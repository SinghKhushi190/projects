// utils/safetyScore.js
// Safety Score Algorithm for SafeRoute Navigation
// Factors: Street Lighting, Crowd Level, Community Reports, Police Proximity, Time of Day

const db = require('../config/database');

/**
 * Calculate area safety score (0–100) for a given coordinate
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusKm  — search radius in km
 * @returns {object} score breakdown
 */
const calculateSafetyScore = (lat, lng, radiusKm = 0.5) => {
  const now = new Date();
  const hour = now.getHours();

  // ── 1. Community Reports Score (0–40 pts) ────────────────────────────────
  // Fetch active reports within radius (using Haversine approximation via SQL)
  const degRadius = radiusKm / 111; // 1 degree ≈ 111 km
  const reports = db.prepare(`
    SELECT report_type, helpful_count
    FROM community_reports
    WHERE is_active = 1
      AND expires_at > datetime('now')
      AND ABS(latitude - ?) < ?
      AND ABS(longitude - ?) < ?
  `).all(lat, degRadius, lng, degRadius);

  let communityScore = 30; // baseline
  for (const r of reports) {
    const weight = Math.min(r.helpful_count + 1, 5); // cap weight
    if (r.report_type === 'safe')    communityScore += weight * 2;
    if (r.report_type === 'alert')   communityScore -= weight * 3;
    if (r.report_type === 'danger')  communityScore -= weight * 6;
  }
  communityScore = Math.max(0, Math.min(40, communityScore));

  // ── 2. Time-of-Day Score (0–25 pts) ──────────────────────────────────────
  // Safer during day / evening, riskier late night / early morning
  let timeScore;
  if (hour >= 6  && hour < 12) timeScore = 25;  // morning
  else if (hour >= 12 && hour < 18) timeScore = 22; // afternoon
  else if (hour >= 18 && hour < 21) timeScore = 18; // evening
  else if (hour >= 21 && hour < 23) timeScore = 10; // night
  else timeScore = 5;                                // late night / early AM

  // ── 3. Street Lighting Score (0–20 pts) ─────────────────────────────────
  // Simulated — in production: integrate OpenStreetMap streetlamp data
  // or a dedicated lighting API
  const lightingScore = hour >= 6 && hour < 20 ? 18 : Math.floor(Math.random() * 10) + 5;

  // ── 4. Crowd / Pedestrian Level Score (0–15 pts) ────────────────────────
  // In production: integrate Google Places Busy Times or Pedestrian APIs
  let crowdScore;
  if (hour >= 8 && hour < 22) crowdScore = 12; // busy hours
  else crowdScore = 5;                          // quiet hours

  // ── Total ─────────────────────────────────────────────────────────────────
  const total = communityScore + timeScore + lightingScore + crowdScore;
  const clamped = Math.max(0, Math.min(100, total));

  let label, color;
  if (clamped >= 70) { label = 'Safe'; color = '#1D9E75'; }
  else if (clamped >= 45) { label = 'Moderate Risk'; color = '#E87722'; }
  else { label = 'Unsafe — Avoid'; color = '#D32F2F'; }

  return {
    score: clamped,
    label,
    color,
    breakdown: {
      community:  communityScore,
      timeOfDay:  timeScore,
      lighting:   lightingScore,
      crowd:      crowdScore
    },
    reportCount: reports.length,
    calculatedAt: new Date().toISOString()
  };
};

/**
 * Score three candidate routes and rank them safest → most dangerous
 */
const scoreRoutes = (fromLat, fromLng, toLat, toLng) => {
  // Generate 3 waypoint midpoints (simplified — production uses Directions API)
  const routes = [
    { id: 'safe',      name: 'Safest Route',    midLat: fromLat + (toLat-fromLat)*0.5,       midLng: fromLng + (toLng-fromLng)*0.5 + 0.003, extraKm: 0.6, extraMin: 5  },
    { id: 'fastest',   name: 'Fastest Route',   midLat: fromLat + (toLat-fromLat)*0.5,       midLng: fromLng + (toLng-fromLng)*0.5,          extraKm: 0,   extraMin: 0  },
    { id: 'alternate', name: 'Alternate Route', midLat: fromLat + (toLat-fromLat)*0.5,       midLng: fromLng + (toLng-fromLng)*0.5 - 0.004, extraKm: 1.2, extraMin: 10 }
  ];

  const baseDist = haversine(fromLat, fromLng, toLat, toLng);
  const baseTime = Math.round((baseDist / 4) * 60); // walking 4 km/h

  return routes.map(r => {
    const safetyData = calculateSafetyScore(r.midLat, r.midLng);
    return {
      ...r,
      distanceKm: +(baseDist + r.extraKm).toFixed(1),
      durationMin: baseTime + r.extraMin,
      safety: safetyData
    };
  }).sort((a, b) => b.safety.score - a.safety.score);
};

// Haversine distance in km
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};
const deg2rad = d => d * (Math.PI/180);

module.exports = { calculateSafetyScore, scoreRoutes };
