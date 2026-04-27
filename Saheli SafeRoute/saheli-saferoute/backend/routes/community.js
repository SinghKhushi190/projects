// routes/community.js
const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');

// ── GET /api/community/feed ───────────────────────────────────────────────
// Fetch nearby active community reports (sorted by distance)
router.get('/feed', optionalAuth, (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat and lng query params required' });
    }

    const degRadius = parseFloat(radius) / 111;
    const reports = db.prepare(`
      SELECT cr.*, u.name as author_name,
        CASE WHEN rv.id IS NOT NULL THEN 1 ELSE 0 END as user_voted
      FROM community_reports cr
      JOIN users u ON u.id = cr.user_id
      LEFT JOIN report_votes rv ON rv.report_id = cr.id AND rv.user_id = ?
      WHERE cr.is_active = 1
        AND cr.expires_at > datetime('now')
        AND ABS(cr.latitude - ?) < ?
        AND ABS(cr.longitude - ?) < ?
      ORDER BY cr.created_at DESC
      LIMIT 50
    `).all(req.user?.id || null, parseFloat(lat), degRadius, parseFloat(lng), degRadius);

    res.json({ success: true, data: reports, count: reports.length });
  } catch (err) {
    console.error('[Community Feed Error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/community/report ────────────────────────────────────────────
router.post('/report', authenticate, (req, res) => {
  try {
    const { latitude, longitude, address, report_type, title, description } = req.body;

    if (!latitude || !longitude || !report_type || !title || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (!['alert', 'safe', 'danger'].includes(report_type)) {
      return res.status(400).json({ success: false, message: 'report_type must be: alert | safe | danger' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO community_reports (id, user_id, latitude, longitude, address, report_type, title, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, latitude, longitude, address || null, report_type, title.trim(), description.trim());

    const report = db.prepare('SELECT * FROM community_reports WHERE id = ?').get(id);

    // Broadcast to nearby users via Socket.io
    const io = req.app.get('io');
    if (io) io.emit('new_community_report', report);

    res.status(201).json({ success: true, message: 'Report submitted — thank you for keeping Sahelis safe! 💚', data: report });
  } catch (err) {
    console.error('[Community Report Error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/community/vote/:id ──────────────────────────────────────────
router.post('/vote/:id', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const report = db.prepare('SELECT * FROM community_reports WHERE id = ?').get(id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    const existing = db.prepare('SELECT id FROM report_votes WHERE report_id = ? AND user_id = ?').get(id, req.user.id);
    if (existing) {
      // Un-vote
      db.prepare('DELETE FROM report_votes WHERE report_id = ? AND user_id = ?').run(id, req.user.id);
      db.prepare('UPDATE community_reports SET helpful_count = MAX(0, helpful_count - 1) WHERE id = ?').run(id);
      return res.json({ success: true, message: 'Vote removed', voted: false });
    }

    db.prepare('INSERT INTO report_votes (id, report_id, user_id) VALUES (?,?,?)').run(uuidv4(), id, req.user.id);
    db.prepare('UPDATE community_reports SET helpful_count = helpful_count + 1 WHERE id = ?').run(id);

    res.json({ success: true, message: 'Marked as helpful', voted: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── DELETE /api/community/report/:id ─────────────────────────────────────
router.delete('/report/:id', authenticate, (req, res) => {
  const result = db.prepare(`
    UPDATE community_reports SET is_active = 0 WHERE id = ? AND user_id = ?
  `).run(req.params.id, req.user.id);
  if (!result.changes) return res.status(404).json({ success: false, message: 'Report not found or not yours' });
  res.json({ success: true, message: 'Report removed' });
});

module.exports = router;
