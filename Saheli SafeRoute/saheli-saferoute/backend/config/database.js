// config/database.js
// SQLite database with better-sqlite3 (synchronous, file-based, zero-config)

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'saheli.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── SCHEMA ────────────────────────────────────────────────────────────────

db.exec(`

  -- USERS table
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name        TEXT NOT NULL,
    phone       TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE,
    password    TEXT NOT NULL,
    language    TEXT DEFAULT 'en',
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now')),
    is_active   INTEGER DEFAULT 1
  );

  -- EMERGENCY CONTACTS table
  CREATE TABLE IF NOT EXISTS emergency_contacts (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    relation    TEXT NOT NULL,
    priority    INTEGER DEFAULT 1,
    notify_sos  INTEGER DEFAULT 1,
    notify_low_battery INTEGER DEFAULT 1,
    notify_safe_zone   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- SOS ALERTS table
  CREATE TABLE IF NOT EXISTS sos_alerts (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude    REAL NOT NULL,
    longitude   REAL NOT NULL,
    address     TEXT,
    trigger_type TEXT DEFAULT 'button',  -- button | voice | shake | power_button
    status      TEXT DEFAULT 'active',   -- active | cancelled | resolved
    audio_file  TEXT,                    -- path to recorded audio evidence
    battery_level INTEGER,
    contacts_notified INTEGER DEFAULT 0,
    sms_sent    INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    resolved_at TEXT
  );

  -- COMMUNITY REPORTS (Safety Feed)
  CREATE TABLE IF NOT EXISTS community_reports (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude    REAL NOT NULL,
    longitude   REAL NOT NULL,
    address     TEXT,
    report_type TEXT NOT NULL,  -- alert | safe | danger
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    helpful_count INTEGER DEFAULT 0,
    is_active   INTEGER DEFAULT 1,
    expires_at  TEXT DEFAULT (datetime('now', '+24 hours')),
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- REPORT VOTES (one per user per report)
  CREATE TABLE IF NOT EXISTS report_votes (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    report_id   TEXT NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TEXT DEFAULT (datetime('now')),
    UNIQUE(report_id, user_id)
  );

  -- SAFE ZONES
  CREATE TABLE IF NOT EXISTS safe_zones (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    latitude    REAL NOT NULL,
    longitude   REAL NOT NULL,
    radius_m    INTEGER DEFAULT 200,
    color       TEXT DEFAULT '#1D9E75',
    notify_entry  INTEGER DEFAULT 1,
    notify_exit   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- LOCATION HISTORY (for live tracking)
  CREATE TABLE IF NOT EXISTS location_history (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude    REAL NOT NULL,
    longitude   REAL NOT NULL,
    accuracy    REAL,
    speed       REAL,
    battery     INTEGER,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- LIVE TRACKING SESSIONS
  CREATE TABLE IF NOT EXISTS tracking_sessions (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_token TEXT UNIQUE NOT NULL,
    is_active   INTEGER DEFAULT 1,
    started_at  TEXT DEFAULT (datetime('now')),
    ended_at    TEXT
  );

  -- SAFETY TIMER SESSIONS
  CREATE TABLE IF NOT EXISTS timer_sessions (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    status      TEXT DEFAULT 'active',   -- active | completed | expired | cancelled
    started_at  TEXT DEFAULT (datetime('now')),
    checked_in_at TEXT,
    expires_at  TEXT NOT NULL
  );

  -- ROUTE HISTORY
  CREATE TABLE IF NOT EXISTS route_history (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_lat    REAL NOT NULL,
    from_lng    REAL NOT NULL,
    to_lat      REAL NOT NULL,
    to_lng      REAL NOT NULL,
    from_address TEXT,
    to_address  TEXT,
    route_type  TEXT DEFAULT 'safe',  -- safe | fastest | alternate
    safety_score INTEGER,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- USER SETTINGS
  CREATE TABLE IF NOT EXISTS user_settings (
    user_id         TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    live_location   INTEGER DEFAULT 1,
    voice_sos       INTEGER DEFAULT 1,
    stealth_mode    INTEGER DEFAULT 0,
    shake_sos       INTEGER DEFAULT 1,
    power_btn_sos   INTEGER DEFAULT 0,
    night_mode      INTEGER DEFAULT 1,
    community_feed  INTEGER DEFAULT 1,
    offline_sms     INTEGER DEFAULT 1,
    auto_record     INTEGER DEFAULT 0,
    wearable_sync   INTEGER DEFAULT 0,
    safe_word       TEXT DEFAULT 'Saheli Help',
    language        TEXT DEFAULT 'en',
    low_battery_alert INTEGER DEFAULT 15,
    updated_at      TEXT DEFAULT (datetime('now'))
  );

  -- REFRESH TOKENS
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT UNIQUE NOT NULL,
    expires_at  TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_community_reports_location ON community_reports(latitude, longitude);
  CREATE INDEX IF NOT EXISTS idx_community_reports_active ON community_reports(is_active, expires_at);
  CREATE INDEX IF NOT EXISTS idx_location_history_user ON location_history(user_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_sos_alerts_user ON sos_alerts(user_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user ON emergency_contacts(user_id);

`);

console.log('✅ Database initialized:', DB_PATH);

module.exports = db;
