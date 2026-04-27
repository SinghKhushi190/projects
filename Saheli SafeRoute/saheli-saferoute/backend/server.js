// server.js — Saheli SafeRoute Backend
// Express + Socket.io + SQLite

require('dotenv').config();

const express   = require('express');
const http      = require('http');
const { Server } = require('socket.io');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const path      = require('path');
const rateLimit = require('express-rate-limit');

// ── Initialize DB (runs schema creation) ─────────────────────────────────
const db = require('./config/database');

// ── Routes ────────────────────────────────────────────────────────────────
const authRoutes      = require('./routes/auth');
const sosRoutes       = require('./routes/sos');
const communityRoutes = require('./routes/community');
const locationRoutes  = require('./routes/location');
const contactRoutes   = require('./routes/contacts');
const settingsRoutes  = require('./routes/settings');

const app    = express();
const server = http.createServer(app);

// ── Socket.io Setup ───────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});
app.set('io', io); // make io available in route handlers

// ── Middleware ────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded files (audio recordings, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rate Limiting ─────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max:      parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message:  { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// SOS has more generous limits (safety critical)
const sosLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });
app.use('/api/sos/', sosLimiter);

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/sos',       sosRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/location',  locationRoutes);
app.use('/api/contacts',  contactRoutes);
app.use('/api/settings',  settingsRoutes);

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const userCount    = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const reportCount  = db.prepare('SELECT COUNT(*) as c FROM community_reports WHERE is_active=1').get().c;
  const activeAlerts = db.prepare("SELECT COUNT(*) as c FROM sos_alerts WHERE status='active'").get().c;

  res.json({
    success: true,
    service: 'Saheli SafeRoute API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    stats: { users: userCount, activeReports: reportCount, activeSosAlerts: activeAlerts }
  });
});

// ── API Docs (inline) ─────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'Saheli SafeRoute API',
    version: '1.0.0',
    description: 'Women Safety App — Elite Her Hackathon | Team SoftTech',
    baseUrl: `http://localhost:${process.env.PORT || 5000}/api`,
    endpoints: {
      auth: {
        'POST /auth/register':  'Register new user',
        'POST /auth/login':     'Login with phone + password',
        'POST /auth/refresh':   'Refresh access token',
        'POST /auth/logout':    'Logout & invalidate token',
        'GET  /auth/me':        'Get current user profile'
      },
      sos: {
        'POST /sos/trigger':      'Trigger SOS alert → SMS all contacts',
        'POST /sos/cancel':       'Cancel active SOS',
        'POST /sos/resolve':      'Mark SOS as resolved',
        'POST /sos/low-battery':  'Send low battery warning SMS',
        'GET  /sos/history':      'Get SOS alert history'
      },
      community: {
        'GET  /community/feed':          'Get nearby safety reports (lat, lng, radius)',
        'POST /community/report':        'Submit new safety report',
        'POST /community/vote/:id':      'Mark report as helpful / un-vote',
        'DELETE /community/report/:id':  'Remove your report'
      },
      location: {
        'POST /location/update':          'Push current GPS position',
        'POST /location/live/start':      'Start live location sharing session',
        'POST /location/live/stop':       'Stop live sharing',
        'GET  /location/track/:token':    'Public: view live location by share token',
        'GET  /location/history':         'Get location history',
        'GET  /location/safety-score':    'Get area safety score (lat, lng)',
        'POST /location/route':           'Calculate safest route options',
        'GET  /location/safe-zones':      'Get user safe zones',
        'POST /location/safe-zones':      'Create safe zone',
        'DELETE /location/safe-zones/:id': 'Delete safe zone'
      },
      contacts: {
        'GET    /contacts':     'List emergency contacts',
        'POST   /contacts':     'Add emergency contact',
        'PUT    /contacts/:id': 'Update contact',
        'DELETE /contacts/:id': 'Remove contact'
      },
      settings: {
        'GET   /settings':              'Get user settings',
        'PATCH /settings':              'Update settings',
        'POST  /settings/timer/start':  'Start safety timer',
        'POST  /settings/timer/checkin':'Check in (I am safe)',
        'POST  /settings/timer/cancel': 'Cancel timer',
        'GET   /settings/timer/active': 'Get active timer'
      }
    },
    authentication: 'Bearer JWT token in Authorization header',
    realtime: 'Socket.io events: sos_triggered, sos_cancelled, location_update, new_community_report, safe_zone_check, timer_expired, contact_sos'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Socket.io Real-time Events ────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // User joins their personal room (for SOS / timer events)
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`   User ${userId} joined personal room`);
  });

  // Contact joins a live tracking room
  socket.on('join_tracking', (shareToken) => {
    socket.join(`track_${shareToken}`);
    console.log(`   Joined tracking room: ${shareToken}`);
  });

  // User leaves tracking room
  socket.on('leave_tracking', (shareToken) => {
    socket.leave(`track_${shareToken}`);
  });

  // Voice SOS keyword detected on client
  socket.on('voice_sos_detected', ({ userId, keyword, latitude, longitude }) => {
    console.log(`🎤 Voice SOS detected for user ${userId}: "${keyword}"`);
    socket.to(`user_${userId}`).emit('voice_sos_confirm', { keyword, latitude, longitude });
  });

  // Shake/stealth SOS from client
  socket.on('stealth_sos', ({ userId, triggerType }) => {
    socket.to(`user_${userId}`).emit('stealth_sos_received', { triggerType });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║      🛡️  SAHELI SAFEROUTE API — RUNNING          ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  HTTP  : http://localhost:${PORT}                   ║`);
  console.log(`║  Docs  : http://localhost:${PORT}/api               ║`);
  console.log(`║  Health: http://localhost:${PORT}/api/health        ║`);
  console.log('║  WS    : Socket.io active                        ║');
  console.log('║  DB    : SQLite (data/saheli.db)                 ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('\n  Team SoftTech — Elite Her Hackathon 2025 🌸\n');
});

module.exports = { app, server, io };
