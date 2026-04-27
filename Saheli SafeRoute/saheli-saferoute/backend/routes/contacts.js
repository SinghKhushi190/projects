// routes/contacts.js
const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../config/database');
const { authenticate } = require('../middleware/auth');

// ── GET /api/contacts ─────────────────────────────────────────────────────
router.get('/', authenticate, (req, res) => {
  const contacts = db.prepare(`
    SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY priority ASC
  `).all(req.user.id);
  res.json({ success: true, data: contacts });
});

// ── POST /api/contacts ────────────────────────────────────────────────────
router.post('/', authenticate, (req, res) => {
  try {
    const { name, phone, relation, priority, notify_sos, notify_low_battery, notify_safe_zone } = req.body;
    if (!name || !phone || !relation) {
      return res.status(400).json({ success: false, message: 'name, phone, relation required' });
    }

    // Max 5 emergency contacts
    const count = db.prepare('SELECT COUNT(*) as c FROM emergency_contacts WHERE user_id = ?').get(req.user.id);
    if (count.c >= 5) {
      return res.status(400).json({ success: false, message: 'Maximum 5 emergency contacts allowed' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO emergency_contacts (id, user_id, name, phone, relation, priority, notify_sos, notify_low_battery, notify_safe_zone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, name.trim(), phone.trim(), relation.trim(),
       priority || count.c + 1, notify_sos ?? 1, notify_low_battery ?? 1, notify_safe_zone ?? 1);

    const contact = db.prepare('SELECT * FROM emergency_contacts WHERE id = ?').get(id);
    res.status(201).json({ success: true, message: 'Emergency contact added', data: contact });
  } catch (err) {
    console.error('[Contacts Error]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PUT /api/contacts/:id ─────────────────────────────────────────────────
router.put('/:id', authenticate, (req, res) => {
  const { name, phone, relation, priority, notify_sos, notify_low_battery, notify_safe_zone } = req.body;
  const result = db.prepare(`
    UPDATE emergency_contacts
    SET name = COALESCE(?, name), phone = COALESCE(?, phone), relation = COALESCE(?, relation),
        priority = COALESCE(?, priority), notify_sos = COALESCE(?, notify_sos),
        notify_low_battery = COALESCE(?, notify_low_battery), notify_safe_zone = COALESCE(?, notify_safe_zone)
    WHERE id = ? AND user_id = ?
  `).run(name, phone, relation, priority, notify_sos, notify_low_battery, notify_safe_zone, req.params.id, req.user.id);

  if (!result.changes) return res.status(404).json({ success: false, message: 'Contact not found' });
  const updated = db.prepare('SELECT * FROM emergency_contacts WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: 'Contact updated', data: updated });
});

// ── DELETE /api/contacts/:id ──────────────────────────────────────────────
router.delete('/:id', authenticate, (req, res) => {
  const result = db.prepare('DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!result.changes) return res.status(404).json({ success: false, message: 'Contact not found' });
  res.json({ success: true, message: 'Contact deleted' });
});

module.exports = router;
