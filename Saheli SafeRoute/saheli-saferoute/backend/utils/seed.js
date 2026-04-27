// utils/seed.js — Seed demo data for development/presentation
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

console.log('🌱 Seeding Saheli SafeRoute database...\n');

// ── Demo Users ────────────────────────────────────────────────────────────
const users = [
  { id: uuidv4(), name: 'Khushi Kumari',  phone: '+919876543210', email: 'kk8147561@gmail.com', password: 'saheli123' },
  { id: uuidv4(), name: 'Priya Sharma',   phone: '+919123456789', email: 'priya@example.com',   password: 'saheli123' },
  { id: uuidv4(), name: 'Ananya Verma',   phone: '+918765432109', email: 'ananya@example.com',  password: 'saheli123' },
  { id: uuidv4(), name: 'Meera Gupta',    phone: '+917654321098', email: 'meera@example.com',   password: 'saheli123' },
];

for (const u of users) {
  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(u.phone);
  if (existing) { console.log(`  ⚠️  User ${u.name} already exists — skipping`); continue; }

  const hashed = bcrypt.hashSync(u.password, 10);
  db.prepare('INSERT INTO users (id, name, phone, email, password) VALUES (?,?,?,?,?)').run(u.id, u.name, u.phone, u.email, hashed);
  db.prepare('INSERT INTO user_settings (user_id) VALUES (?)').run(u.id);
  console.log(`  ✅ User: ${u.name} (${u.phone})`);
}

const [khushi, priya, ananya, meera] = db.prepare('SELECT id, name FROM users LIMIT 4').all();
if (!khushi) { console.log('No users found after insert — aborting seed'); process.exit(1); }

// ── Emergency Contacts for Khushi ────────────────────────────────────────
const existingContacts = db.prepare('SELECT id FROM emergency_contacts WHERE user_id = ?').all(khushi.id);
if (!existingContacts.length) {
  const contacts = [
    { name: 'Mom (Asha)',    phone: '+919998887770', relation: 'Mother',  priority: 1 },
    { name: 'Priya (Sister)',phone: priya?.phone || '+919123456789', relation: 'Sister',  priority: 2 },
    { name: 'Rahul (Friend)',phone: '+918887776660', relation: 'Friend',  priority: 3 },
  ];
  for (const c of contacts) {
    db.prepare('INSERT INTO emergency_contacts (id, user_id, name, phone, relation, priority) VALUES (?,?,?,?,?,?)')
      .run(uuidv4(), khushi.id, c.name, c.phone, c.relation, c.priority);
    console.log(`  📞 Contact: ${c.name} → ${khushi.name}`);
  }
}

// ── Safe Zones ────────────────────────────────────────────────────────────
const existingZones = db.prepare('SELECT id FROM safe_zones WHERE user_id = ?').all(khushi.id);
if (!existingZones.length) {
  const zones = [
    { name: 'Home',      lat: 26.9124, lng: 80.9167, color: '#1D9E75', radius: 200 },
    { name: 'College',   lat: 26.9200, lng: 80.9240, color: '#1565C0', radius: 300 },
    { name: 'Workplace', lat: 26.9050, lng: 80.9100, color: '#7B2FBE', radius: 250 },
  ];
  for (const z of zones) {
    db.prepare('INSERT INTO safe_zones (id, user_id, name, latitude, longitude, radius_m, color) VALUES (?,?,?,?,?,?,?)')
      .run(uuidv4(), khushi.id, z.name, z.lat, z.lng, z.radius, z.color);
    console.log(`  🏠 Safe Zone: ${z.name}`);
  }
}

// ── Community Reports ─────────────────────────────────────────────────────
const existingReports = db.prepare('SELECT COUNT(*) as c FROM community_reports').get();
if (existingReports.c === 0 && ananya && meera) {
  const reports = [
    {
      uid: ananya.id, lat: 26.9110, lng: 80.9150, type: 'alert',
      title: 'Suspicious person near bus stop',
      desc: 'Suspicious man following women near the bus stop at Station Road. Please be careful if travelling alone.',
      addr: 'Station Road, Nawabganj, UP'
    },
    {
      uid: priya?.id || ananya.id, lat: 26.9180, lng: 80.9220, type: 'safe',
      title: 'Civil Lines well-lit tonight',
      desc: 'Civil Lines Market is well-lit and busy. Good crowd, feels very safe for solo travel this evening.',
      addr: 'Civil Lines Market, UP'
    },
    {
      uid: meera.id, lat: 26.9060, lng: 80.9130, type: 'danger',
      title: 'Dark underpass — avoid!',
      desc: 'Underpass near Old Bus Stand is completely dark. Streetlights broken. Police reported. Please use alternate route!',
      addr: 'Old Bus Stand Underpass, UP'
    },
    {
      uid: ananya.id, lat: 26.9140, lng: 80.9190, type: 'safe',
      title: 'Police patrol active near Collectorate',
      desc: 'Lots of police presence and street vendors near Collectorate Road. Very safe route.',
      addr: 'Collectorate Road, UP'
    },
    {
      uid: meera.id, lat: 26.9090, lng: 80.9160, type: 'alert',
      title: 'Unlit street — use with caution',
      desc: 'The side lane behind railway station has poor lighting. Not recommended for walking alone at night.',
      addr: 'Railway Station Road, UP'
    }
  ];

  for (const r of reports) {
    db.prepare(`
      INSERT INTO community_reports (id, user_id, latitude, longitude, address, report_type, title, description, helpful_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), r.uid, r.lat, r.lng, r.addr, r.type, r.title, r.desc, Math.floor(Math.random() * 40) + 5);
    console.log(`  📢 Report: [${r.type.toUpperCase()}] ${r.title}`);
  }
}

console.log('\n✅ Seed complete!\n');
console.log('Demo Login Credentials:');
console.log('  Phone: +919876543210 | Password: saheli123 (Khushi)');
console.log('  Phone: +919123456789 | Password: saheli123 (Priya)');
console.log('\nRun: node server.js\n');
process.exit(0);
