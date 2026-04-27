// routes/settings.js
const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { sendSMS, buildSOSMessage } = require('../utils/sms');

// ── GET /api/settings ─────────────────────────────────────────────────────
router.get('/', authenticate, (req, res) => {
  const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
  if (!settings) {
    db.prepare('INSERT INTO user_settings (user_id) VALUES (?)').run(req.user.id);
    return res.json({ success: true, data: db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id) });
  }
  res.json({ success: true, data: settings });
});

// ── PATCH /api/settings ───────────────────────────────────────────────────
router.patch('/', authenticate, (req, res) => {
  const allowed = ['live_location','voice_sos','stealth_mode','shake_sos','power_btn_sos',
    'night_mode','community_feed','offline_sms','auto_record','wearable_sync',
    'safe_word','language','low_battery_alert'];

  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (!Object.keys(updates).length) {
    return res.status(400).json({ success: false, message: 'No valid fields to update' });
  }

  const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values     = [...Object.values(updates), req.user.id];
  db.prepare(`UPDATE user_settings SET ${setClauses}, updated_at = datetime('now') WHERE user_id = ?`).run(...values);

  const updated = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
  res.json({ success: true, message: 'Settings updated', data: updated });
});

// ── SAFETY TIMER ─────────────────────────────────────────────────────────

// POST /api/settings/timer/start
router.post('/timer/start', authenticate, async (req, res) => {
  try {
    const { duration_minutes, latitude, longitude } = req.body;
    if (!duration_minutes || duration_minutes < 1 || duration_minutes > 180) {
      return res.status(400).json({ success: false, message: 'duration_minutes must be between 1 and 180' });
    }

    // Cancel any active timers
    db.prepare(`UPDATE timer_sessions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'`).run(req.user.id);

    const id = uuidv4();
    const expiresAt = new Date(Date.now() + duration_minutes * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO timer_sessions (id, user_id, duration_minutes, expires_at) VALUES (?, ?, ?, ?)
    `).run(id, req.user.id, duration_minutes, expiresAt);

    // Schedule SOS if timer expires (in-process timer — use a job queue in production)
    const msUntilExpiry = duration_minutes * 60 * 1000;
    setTimeout(async () => {
      const session = db.prepare(`SELECT * FROM timer_sessions WHERE id = ? AND status = 'active'`).get(id);
      if (!session) return; // Already checked in or cancelled

      // Timer expired — auto trigger SOS
      db.prepare(`UPDATE timer_sessions SET status = 'expired' WHERE id = ?`).run(id);

      const user     = db.prepare('SELECT name FROM users WHERE id = ?').get(req.user.id);
      const contacts = db.prepare(`SELECT * FROM emergency_contacts WHERE user_id = ? AND notify_sos = 1`).all(req.user.id);
      for (const c of contacts) {
        const msg = `⏰ SAFETY TIMER EXPIRED — ${user?.name} did not check in!\n` +
          `Last location: https://maps.google.com/?q=${latitude||'unknown'},${longitude||'unknown'}\n` +
          `Please check on her immediately! Call Police: 100\n─ Saheli SafeRoute`;
        await sendSMS(c.phone, msg);
      }
      // Emit SOS via socket
      const io = req.app?.get('io');
      if (io) io.to(`user_${req.user.id}`).emit('timer_expired', { sessionId: id });
    }, msUntilExpiry);

    res.json({
      success: true,
      message: `Safety timer started for ${duration_minutes} minutes`,
      data: { sessionId: id, expiresAt, durationMinutes: duration_minutes }
    });
  } catch (err) {
    console.error('[Timer Start Error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/settings/timer/checkin  — user is safe, stop timer
router.post('/timer/checkin', authenticate, (req, res) => {
  const result = db.prepare(`
    UPDATE timer_sessions SET status = 'completed', checked_in_at = datetime('now')
    WHERE user_id = ? AND status = 'active'
  `).run(req.user.id);

  if (!result.changes) return res.status(404).json({ success: false, message: 'No active timer found' });
  res.json({ success: true, message: 'Check-in successful — glad you are safe! 💚' });
});

// POST /api/settings/timer/cancel
router.post('/timer/cancel', authenticate, (req, res) => {
  db.prepare(`UPDATE timer_sessions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'`).run(req.user.id);
  res.json({ success: true, message: 'Timer cancelled' });
});

// GET /api/settings/timer/active
router.get('/timer/active', authenticate, (req, res) => {
  const session = db.prepare(`
    SELECT * FROM timer_sessions WHERE user_id = ? AND status = 'active'
    ORDER BY started_at DESC LIMIT 1
  `).get(req.user.id);
  res.json({ success: true, data: session || null });
});

module.exports = router;
