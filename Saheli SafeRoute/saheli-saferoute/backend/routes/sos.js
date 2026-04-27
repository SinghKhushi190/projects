// routes/sos.js
const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { sendSMS, buildSOSMessage, buildLowBatteryMessage } = require('../utils/sms');

// ── POST /api/sos/trigger ─────────────────────────────────────────────────
// Main SOS trigger — sends SMS to all emergency contacts
router.post('/trigger', authenticate, async (req, res) => {
  try {
    const { latitude, longitude, address, trigger_type, battery_level, audio_file } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Location coordinates required' });
    }

    const userId = req.user.id;
    const alertId = uuidv4();

    // Save SOS alert to database
    db.prepare(`
      INSERT INTO sos_alerts (id, user_id, latitude, longitude, address, trigger_type, battery_level, audio_file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(alertId, userId, latitude, longitude, address || null, trigger_type || 'button', battery_level || null, audio_file || null);

    // Get user details
    const user = db.prepare('SELECT name, phone FROM users WHERE id = ?').get(userId);

    // Get all emergency contacts
    const contacts = db.prepare(`
      SELECT * FROM emergency_contacts WHERE user_id = ? AND notify_sos = 1
    `).all(userId);

    // Send SMS to each contact
    let smsSent = 0;
    const smsResults = [];
    for (const contact of contacts) {
      const message = buildSOSMessage(user, latitude, longitude, address);
      const result  = await sendSMS(contact.phone, message);
      smsResults.push({ contact: contact.name, phone: contact.phone, ...result });
      if (result.success) smsSent++;
    }

    // Update alert record with notification counts
    db.prepare(`
      UPDATE sos_alerts SET contacts_notified = ?, sms_sent = ? WHERE id = ?
    `).run(contacts.length, smsSent, alertId);

    // Emit real-time event via Socket.io (attached to app)
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${userId}`).emit('sos_triggered', {
        alertId, latitude, longitude, address, timestamp: new Date().toISOString()
      });
      // Notify contacts who are also app users
      contacts.forEach(c => {
        const contactUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(c.phone);
        if (contactUser) {
          io.to(`user_${contactUser.id}`).emit('contact_sos', {
            user: user.name, alertId, latitude, longitude
          });
        }
      });
    }

    res.json({
      success: true,
      message: `🚨 SOS alert sent to ${smsSent}/${contacts.length} contacts`,
      data: { alertId, contactsNotified: contacts.length, smsSent, smsResults }
    });
  } catch (err) {
    console.error('[SOS Trigger Error]', err);
    res.status(500).json({ success: false, message: 'Failed to send SOS alert' });
  }
});

// ── POST /api/sos/cancel ──────────────────────────────────────────────────
router.post('/cancel', authenticate, (req, res) => {
  try {
    const { alert_id } = req.body;
    const result = db.prepare(`
      UPDATE sos_alerts SET status = 'cancelled', resolved_at = datetime('now')
      WHERE id = ? AND user_id = ? AND status = 'active'
    `).run(alert_id, req.user.id);

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${req.user.id}`).emit('sos_cancelled', { alertId: alert_id });
    }

    res.json({ success: true, message: 'SOS alert cancelled', cancelled: result.changes > 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/sos/resolve ─────────────────────────────────────────────────
router.post('/resolve', authenticate, (req, res) => {
  const { alert_id } = req.body;
  db.prepare(`
    UPDATE sos_alerts SET status = 'resolved', resolved_at = datetime('now')
    WHERE id = ? AND user_id = ?
  `).run(alert_id, req.user.id);
  res.json({ success: true, message: 'Alert resolved — glad you are safe! 💚' });
});

// ── GET /api/sos/history ──────────────────────────────────────────────────
router.get('/history', authenticate, (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const alerts = db.prepare(`
    SELECT * FROM sos_alerts WHERE user_id = ?
    ORDER BY created_at DESC LIMIT ?
  `).all(req.user.id, limit);
  res.json({ success: true, data: alerts });
});

// ── POST /api/sos/low-battery ─────────────────────────────────────────────
router.post('/low-battery', authenticate, async (req, res) => {
  try {
    const { battery, latitude, longitude } = req.body;
    const userId = req.user.id;
    const user   = db.prepare('SELECT name FROM users WHERE id = ?').get(userId);
    const settings = db.prepare('SELECT low_battery_alert FROM user_settings WHERE user_id = ?').get(userId);

    if (battery > (settings?.low_battery_alert || 15)) {
      return res.json({ success: false, message: 'Battery level not critical yet' });
    }

    const contacts = db.prepare(`
      SELECT * FROM emergency_contacts WHERE user_id = ? AND notify_low_battery = 1
    `).all(userId);

    let sent = 0;
    for (const c of contacts) {
      const msg = buildLowBatteryMessage(user, battery, latitude, longitude);
      const r = await sendSMS(c.phone, msg);
      if (r.success) sent++;
    }

    res.json({ success: true, message: `Low battery alert sent to ${sent} contacts`, sent });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
