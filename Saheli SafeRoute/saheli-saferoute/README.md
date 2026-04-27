# 🛡️ Saheli SafeRoute — Full Stack App
**Elite Her Hackathon | Team SoftTech | Women Safety Theme**

> *Her Smart Companion for Safer Journeys*

---

## 📁 Project Structure

```
saheli-saferoute/
├── backend/                     ← Node.js + Express + SQLite
│   ├── server.js                ← Main server (Express + Socket.io)
│   ├── config/
│   │   └── database.js          ← SQLite schema (11 tables)
│   ├── routes/
│   │   ├── auth.js              ← Register, Login, JWT refresh
│   │   ├── sos.js               ← SOS trigger, SMS alerts, history
│   │   ├── community.js         ← Safety feed, reports, votes
│   │   ├── location.js          ← GPS tracking, routes, safe zones
│   │   ├── contacts.js          ← Emergency contacts CRUD
│   │   └── settings.js          ← User settings, safety timer
│   ├── middleware/
│   │   └── auth.js              ← JWT authentication middleware
│   ├── utils/
│   │   ├── sms.js               ← Twilio SMS gateway
│   │   ├── safetyScore.js       ← Safety Score Algorithm
│   │   └── seed.js              ← Demo data seeder
│   ├── data/
│   │   └── saheli.db            ← SQLite database (auto-created)
│   ├── .env.example             ← Environment variables template
│   └── package.json
│
└── frontend/
    └── src/
        └── utils/
            └── api.js           ← Full API client (all endpoints)
```

---

## 🗄️ Database Schema (11 Tables)

| Table | Purpose |
|---|---|
| `users` | User accounts with phone auth |
| `emergency_contacts` | Up to 5 contacts per user |
| `sos_alerts` | SOS history with GPS + trigger type |
| `community_reports` | Crowdsourced safety reports |
| `report_votes` | Helpful votes (1 per user per report) |
| `safe_zones` | Named safe areas with radius |
| `location_history` | GPS breadcrumb trail |
| `tracking_sessions` | Live share sessions with tokens |
| `timer_sessions` | Safety timer with auto-SOS |
| `route_history` | Past navigation requests |
| `user_settings` | All app settings per user |
| `refresh_tokens` | JWT refresh token store |

---

## 🚀 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env — fill in your API keys
```

### 3. Seed Demo Data
```bash
npm run seed
```

### 4. Start Server
```bash
npm run dev        # development (nodemon)
npm start          # production
```

Server runs at: **http://localhost:5000**

---

## 🔑 API Endpoints (24 Total)

### Auth
```
POST /api/auth/register     Register new user
POST /api/auth/login        Login (phone + password)
POST /api/auth/refresh      Refresh JWT token
POST /api/auth/logout       Logout
GET  /api/auth/me           Get profile + settings
```

### SOS Alerts
```
POST /api/sos/trigger       🚨 Trigger SOS → SMS all contacts
POST /api/sos/cancel        Cancel active SOS
POST /api/sos/resolve       Mark SOS resolved
POST /api/sos/low-battery   Low battery SMS warning
GET  /api/sos/history       SOS alert history
```

### Community Safety Feed
```
GET    /api/community/feed          Nearby reports (lat, lng, radius)
POST   /api/community/report        Submit safety report
POST   /api/community/vote/:id      Mark as helpful
DELETE /api/community/report/:id    Remove report
```

### Location & Routes
```
POST /api/location/update           Push GPS position
POST /api/location/live/start       Start live share session
POST /api/location/live/stop        Stop live share
GET  /api/location/track/:token     Public: view live location
GET  /api/location/safety-score     Area safety score (0-100)
POST /api/location/route            Calculate safest route
GET  /api/location/safe-zones       List safe zones
POST /api/location/safe-zones       Create safe zone
DEL  /api/location/safe-zones/:id   Delete safe zone
```

### Emergency Contacts
```
GET    /api/contacts                List contacts
POST   /api/contacts                Add contact
PUT    /api/contacts/:id            Update contact
DELETE /api/contacts/:id            Delete contact
```

### Settings & Timer
```
GET   /api/settings                 Get settings
PATCH /api/settings                 Update settings
POST  /api/settings/timer/start     Start safety timer
POST  /api/settings/timer/checkin   I am safe ✓
POST  /api/settings/timer/cancel    Cancel timer
GET   /api/settings/timer/active    Active timer status
```

---

## 📡 Real-Time Events (Socket.io)

| Event | Direction | Description |
|---|---|---|
| `sos_triggered` | Server→Client | SOS alert sent |
| `sos_cancelled` | Server→Client | SOS cancelled |
| `location_update` | Server→Contacts | Live GPS update |
| `new_community_report` | Server→All | New nearby report |
| `safe_zone_check` | Server→Client | Zone enter/exit |
| `timer_expired` | Server→Client | Timer auto-SOS |
| `contact_sos` | Server→Contact | Friend triggered SOS |
| `voice_sos_detected` | Client→Server | Safe word heard |
| `stealth_sos` | Client→Server | Silent SOS trigger |

---

## 🔧 APIs Used

| Service | Purpose |
|---|---|
| **Google Maps API** | SafeRoute navigation + map tiles |
| **Google Speech-to-Text** | Voice-activated SOS |
| **Twilio SMS Gateway** | Offline SMS alerts (no internet needed) |
| **OpenStreetMap/Nominatim** | Reverse geocoding |
| **Geolocation API** | Device GPS |
| **Web Speech API** | Client-side voice detection |
| **Battery Status API** | Low battery alerts |

---

## 🌱 Demo Credentials (after seeding)

```
Phone    : +919876543210
Password : saheli123
Name     : Khushi Kumari
```

---

## 📱 Tech Stack

- **Frontend**: React Native (mobile) / React (web)
- **Backend**:  Node.js + Express.js
- **Database**: SQLite (better-sqlite3) — zero config, runs anywhere
- **Real-time**: Socket.io
- **Auth**:     JWT (access + refresh tokens)
- **SMS**:      Twilio
- **Security**: Helmet, bcrypt, rate limiting, CORS

---

## 🔮 Future Scope (from presentation)

- [ ] Wearable technology integration
- [ ] Multilingual support (Hindi, Urdu, Tamil)
- [ ] ML-based predictive Safety Score
- [ ] PostgreSQL migration for production scale
- [ ] Push notifications (FCM)
- [ ] In-app voice recording + upload

---

*Team SoftTech — kk8147561@gmail.com*
*linkedin.com/in/khushi-kumari-02933430a*
