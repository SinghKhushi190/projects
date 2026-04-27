// routes/location.js
const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { calculateSafetyScore, scoreRoutes } = require('../utils/safetyScore');

// ── POST /api/location/update ─────────────────────────────────────────────
// Called periodically by the app to log current position
router.post('/update', authenticate, (req, res) => {
  try {
    const { latitude, longitude, accuracy, speed, battery } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Coordinates required' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO location_history (id, user_id, latitude, longitude, accuracy, speed, battery)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, latitude, longitude, accuracy || null, speed || null, battery || null);

    // Broadcast to contacts watching this user's live session
    const session = db.prepare(`
      SELECT id, share_token FROM tracking_sessions
      WHERE user_id = ? AND is_active = 1
    `).get(req.user.id);

    const io = req.app.get('io');
    if (io && session) {
      io.to(`track_${session.share_token}`).emit('location_update', {
        userId: req.user.id, userName: req.user.name,
        latitude, longitude, accuracy, speed, battery,
        timestamp: new Date().toISOString()
      });
    }

    // Check safe zones for this user
    checkSafeZones(req.user.id, latitude, longitude, io);

    res.json({ success: true, message: 'Location updated' });
  } catch (err) {
    console.error('[Location Update Error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/location/live/start ─────────────────────────────────────────
router.post('/live/start', authenticate, (req, res) => {
  try {
    // End any existing sessions
    db.prepare(`
      UPDATE tracking_sessions SET is_active = 0, ended_at = datetime('now')
      WHERE user_id = ? AND is_active = 1
    `).run(req.user.id);

    const sessionId   = uuidv4();
    const shareToken  = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();

    db.prepare(`
      INSERT INTO tracking_sessions (id, user_id, share_token) VALUES (?, ?, ?)
    `).run(sessionId, req.user.id, shareToken);

    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/track/${shareToken}`;

    res.json({
      success: true,
      message: 'Live location sharing started',
      data: { sessionId, shareToken, shareUrl }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/location/live/stop ──────────────────────────────────────────
router.post('/live/stop', authenticate, (req, res) => {
  db.prepare(`
    UPDATE tracking_sessions SET is_active = 0, ended_at = datetime('now')
    WHERE user_id = ? AND is_active = 1
  `).run(req.user.id);
  res.json({ success: true, message: 'Live sharing stopped' });
});

// ── GET /api/location/track/:token ────────────────────────────────────────
// Public endpoint — for contacts watching a live share link
router.get('/track/:token', (req, res) => {
  const session = db.prepare(`
    SELECT ts.*, u.name, u.phone,
      lh.latitude, lh.longitude, lh.battery, lh.created_at as last_seen
    FROM tracking_sessions ts
    JOIN users u ON u.id = ts.user_id
    LEFT JOIN location_history lh ON lh.user_id = ts.user_id
    WHERE ts.share_token = ? AND ts.is_active = 1
    ORDER BY lh.created_at DESC
    LIMIT 1
  `).get(req.params.token);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Tracking session not found or expired' });
  }
  res.json({ success: true, data: session });
});

// ── GET /api/location/history ─────────────────────────────────────────────
router.get('/history', authenticate, (req, res) => {
  const limit  = parseInt(req.query.limit) || 50;
  const history = db.prepare(`
    SELECT * FROM location_history WHERE user_id = ?
    ORDER BY created_at DESC LIMIT ?
  `).all(req.user.id, limit);
  res.json({ success: true, data: history });
});

// ── GET /api/location/safety-score ───────────────────────────────────────
router.get('/safety-score', authenticate, (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'lat and lng required' });
  }
  const score = calculateSafetyScore(parseFloat(lat), parseFloat(lng));
  res.json({ success: true, data: score });
});

// ── POST /api/location/route ──────────────────────────────────────────────
// Calculate safest route options
router.post('/route', authenticate, (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng, fromAddress, toAddress } = req.body;
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({ success: false, message: 'All coordinates required' });
    }

    const routes = scoreRoutes(fromLat, fromLng, toLat, toLng);

    // Save to route history
    const histId = uuidv4();
    db.prepare(`
      INSERT INTO route_history (id, user_id, from_lat, from_lng, to_lat, to_lng, from_address, to_address, route_type, safety_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(histId, req.user.id, fromLat, fromLng, toLat, toLng, fromAddress || null, toAddress || null, routes[0].id, routes[0].safety.score);

    res.json({ success: true, data: { routes, recommendedRoute: routes[0] } });
  } catch (err) {
    console.error('[Route Error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── SAFE ZONES ───────────────────────────────────────────────────────────
router.get('/safe-zones', authenticate, (req, res) => {
  const zones = db.prepare('SELECT * FROM safe_zones WHERE user_id = ? ORDER BY created_at').all(req.user.id);
  res.json({ success: true, data: zones });
});

router.post('/safe-zones', authenticate, (req, res) => {
  const { name, latitude, longitude, radius_m, color, notify_entry, notify_exit } = req.body;
  if (!name || !latitude || !longitude) {
    return res.status(400).json({ success: false, message: 'name, latitude, longitude required' });
  }
  const id = uuidv4();
  db.prepare(`
    INSERT INTO safe_zones (id, user_id, name, latitude, longitude, radius_m, color, notify_entry, notify_exit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.user.id, name, latitude, longitude, radius_m || 200, color || '#1D9E75', notify_entry ?? 1, notify_exit ?? 1);

  const zone = db.prepare('SELECT * FROM safe_zones WHERE id = ?').get(id);
  res.status(201).json({ success: true, message: 'Safe zone created', data: zone });
});

router.delete('/safe-zones/:id', authenticate, (req, res) => {
  const result = db.prepare('DELETE FROM safe_zones WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!result.changes) return res.status(404).json({ success: false, message: 'Zone not found' });
  res.json({ success: true, message: 'Safe zone deleted' });
});

// ── Helper: check if user entered/left a safe zone ───────────────────────
function checkSafeZones(userId, lat, lng, io) {
  const zones = db.prepare('SELECT * FROM safe_zones WHERE user_id = ?').all(userId);
  for (const zone of zones) {
    const dist = haversineMeters(lat, lng, zone.latitude, zone.longitude);
    const inside = dist <= zone.radius_m;
    if (io) {
      io.to(`user_${userId}`).emit('safe_zone_check', {
        zoneId: zone.id, zoneName: zone.name, inside, distanceMeters: Math.round(dist)
      });
    }
  }
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

module.exports = router;
