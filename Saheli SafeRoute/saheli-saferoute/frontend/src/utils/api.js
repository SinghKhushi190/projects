// frontend/src/utils/api.js
// Complete API client for Saheli SafeRoute backend

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseUrl    = BASE_URL;
    this.token      = localStorage.getItem('saheli_token');
    this.refreshTok = localStorage.getItem('saheli_refresh');
  }

  setTokens(accessToken, refreshToken) {
    this.token      = accessToken;
    this.refreshTok = refreshToken;
    localStorage.setItem('saheli_token',   accessToken);
    localStorage.setItem('saheli_refresh', refreshToken);
  }

  clearTokens() {
    this.token = this.refreshTok = null;
    localStorage.removeItem('saheli_token');
    localStorage.removeItem('saheli_refresh');
  }

  async request(method, path, body = null, retry = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    try {
      const res  = await fetch(`${this.baseUrl}${path}`, opts);
      const data = await res.json();

      // Auto-refresh on 401 TOKEN_EXPIRED
      if (res.status === 401 && data.code === 'TOKEN_EXPIRED' && this.refreshTok && retry) {
        const refreshed = await this.refreshToken();
        if (refreshed) return this.request(method, path, body, false);
        this.clearTokens();
        window.location.href = '/login';
        return;
      }

      return { ok: res.ok, status: res.status, ...data };
    } catch (err) {
      return { ok: false, message: 'Network error — check your connection', error: err.message };
    }
  }

  async refreshToken() {
    const res = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshTok })
    });
    const data = await res.json();
    if (res.ok && data.data) {
      this.setTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    }
    return false;
  }

  // ── AUTH ──────────────────────────────────────────────────────────────
  async register(name, phone, email, password) {
    const res = await this.request('POST', '/auth/register', { name, phone, email, password });
    if (res?.ok && res.data) this.setTokens(res.data.accessToken, res.data.refreshToken);
    return res;
  }

  async login(phone, password) {
    const res = await this.request('POST', '/auth/login', { phone, password });
    if (res?.ok && res.data) this.setTokens(res.data.accessToken, res.data.refreshToken);
    return res;
  }

  async logout() {
    await this.request('POST', '/auth/logout', { refreshToken: this.refreshTok });
    this.clearTokens();
  }

  getMe()           { return this.request('GET', '/auth/me'); }

  // ── SOS ───────────────────────────────────────────────────────────────
  triggerSOS(lat, lng, address, triggerType = 'button', battery = null) {
    return this.request('POST', '/sos/trigger', {
      latitude: lat, longitude: lng, address, trigger_type: triggerType, battery_level: battery
    });
  }
  cancelSOS(alertId)    { return this.request('POST', '/sos/cancel', { alert_id: alertId }); }
  resolveSOS(alertId)   { return this.request('POST', '/sos/resolve', { alert_id: alertId }); }
  getSosHistory()       { return this.request('GET', '/sos/history'); }
  sendLowBattery(bat, lat, lng) {
    return this.request('POST', '/sos/low-battery', { battery: bat, latitude: lat, longitude: lng });
  }

  // ── COMMUNITY ─────────────────────────────────────────────────────────
  getCommunityFeed(lat, lng, radius = 5) {
    return this.request('GET', `/community/feed?lat=${lat}&lng=${lng}&radius=${radius}`);
  }
  submitReport(lat, lng, address, type, title, description) {
    return this.request('POST', '/community/report', {
      latitude: lat, longitude: lng, address, report_type: type, title, description
    });
  }
  voteReport(id)        { return this.request('POST', `/community/vote/${id}`); }
  deleteReport(id)      { return this.request('DELETE', `/community/report/${id}`); }

  // ── LOCATION ──────────────────────────────────────────────────────────
  updateLocation(lat, lng, accuracy, speed, battery) {
    return this.request('POST', '/location/update', { latitude: lat, longitude: lng, accuracy, speed, battery });
  }
  startLiveShare()      { return this.request('POST', '/location/live/start'); }
  stopLiveShare()       { return this.request('POST', '/location/live/stop'); }
  getTrackByToken(tok)  { return this.request('GET', `/location/track/${tok}`); }
  getLocationHistory()  { return this.request('GET', '/location/history'); }
  getSafetyScore(lat, lng) { return this.request('GET', `/location/safety-score?lat=${lat}&lng=${lng}`); }
  calculateRoute(fLat, fLng, tLat, tLng, fAddr, tAddr) {
    return this.request('POST', '/location/route', {
      fromLat: fLat, fromLng: fLng, toLat: tLat, toLng: tLng, fromAddress: fAddr, toAddress: tAddr
    });
  }
  getSafeZones()        { return this.request('GET', '/location/safe-zones'); }
  createSafeZone(name, lat, lng, radius, color) {
    return this.request('POST', '/location/safe-zones', { name, latitude: lat, longitude: lng, radius_m: radius, color });
  }
  deleteSafeZone(id)    { return this.request('DELETE', `/location/safe-zones/${id}`); }

  // ── CONTACTS ──────────────────────────────────────────────────────────
  getContacts()         { return this.request('GET', '/contacts'); }
  addContact(name, phone, relation, priority) {
    return this.request('POST', '/contacts', { name, phone, relation, priority });
  }
  updateContact(id, data) { return this.request('PUT', `/contacts/${id}`, data); }
  deleteContact(id)     { return this.request('DELETE', `/contacts/${id}`); }

  // ── SETTINGS ──────────────────────────────────────────────────────────
  getSettings()         { return this.request('GET', '/settings'); }
  updateSettings(data)  { return this.request('PATCH', '/settings', data); }
  startTimer(minutes, lat, lng) {
    return this.request('POST', '/settings/timer/start', { duration_minutes: minutes, latitude: lat, longitude: lng });
  }
  checkinTimer()        { return this.request('POST', '/settings/timer/checkin'); }
  cancelTimer()         { return this.request('POST', '/settings/timer/cancel'); }
  getActiveTimer()      { return this.request('GET', '/settings/timer/active'); }

  // ── HEALTH CHECK ──────────────────────────────────────────────────────
  healthCheck()         { return this.request('GET', '/health'); }
}

const api = new ApiClient();
export default api;
