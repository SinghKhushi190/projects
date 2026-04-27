// routes/auth.js
const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db       = require('../config/database');
const { authenticate } = require('../middleware/auth');

const JWT_SECRET  = process.env.JWT_SECRET  || 'saheli_secret_key';
const REF_SECRET  = process.env.REFRESH_TOKEN_SECRET || 'saheli_refresh_secret';
const JWT_EXP     = process.env.JWT_EXPIRES_IN || '7d';

// ── Helper: generate tokens ───────────────────────────────────────────────
const generateTokens = (user) => {
  const payload = { id: user.id, phone: user.phone, name: user.name };
  const accessToken  = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });
  const refreshToken = jwt.sign(payload, REF_SECRET, { expiresIn: '30d' });

  // Store refresh token in DB
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(`INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?,?,?,?)`)
    .run(uuidv4(), user.id, refreshToken, expiresAt);

  return { accessToken, refreshToken };
};

// ── POST /api/auth/register ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check duplicate
    const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Phone number already registered' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    // Insert user
    db.prepare(`
      INSERT INTO users (id, name, phone, email, password)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, name.trim(), phone.trim(), email?.trim() || null, hashed);

    // Create default settings
    db.prepare(`INSERT INTO user_settings (user_id) VALUES (?)`).run(userId);

    const user = db.prepare('SELECT id, name, phone, email, created_at FROM users WHERE id = ?').get(userId);
    const tokens = generateTokens(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful — Welcome to Saheli SafeRoute! 🛡️',
      data: { user, ...tokens }
    });
  } catch (err) {
    console.error('[Register Error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Phone and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE phone = ? AND is_active = 1').get(phone.trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { password: _pw, ...safeUser } = user;
    const tokens = generateTokens(safeUser);

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: safeUser, ...tokens }
    });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/auth/refresh ────────────────────────────────────────────────
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });

    const stored = db.prepare(`
      SELECT rt.*, u.id, u.name, u.phone, u.email
      FROM refresh_tokens rt
      JOIN users u ON u.id = rt.user_id
      WHERE rt.token = ? AND rt.expires_at > datetime('now')
    `).get(refreshToken);

    if (!stored) return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });

    jwt.verify(refreshToken, REF_SECRET);

    // Rotate token
    db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(refreshToken);
    const tokens = generateTokens(stored);

    res.json({ success: true, data: tokens });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────
router.post('/logout', authenticate, (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(refreshToken);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  const user = db.prepare(`
    SELECT u.id, u.name, u.phone, u.email, u.language, u.created_at, s.*
    FROM users u
    LEFT JOIN user_settings s ON s.user_id = u.id
    WHERE u.id = ?
  `).get(req.user.id);

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

module.exports = router;
