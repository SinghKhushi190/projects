// utils/sms.js
// Twilio SMS Gateway — works offline (no internet needed on device)
// Contacts receive SMS with GPS location link

const sendSMS = async (to, body) => {
  // If Twilio credentials are configured, use them
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC') &&
    process.env.TWILIO_AUTH_TOKEN
  ) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const msg = await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
      return { success: true, sid: msg.sid };
    } catch (err) {
      console.error('[Twilio SMS Error]', err.message);
      return { success: false, error: err.message };
    }
  }

  // Dev mode — log to console
  console.log(`\n📱 [SMS SIMULATION]`);
  console.log(`   To  : ${to}`);
  console.log(`   Body: ${body}\n`);
  return { success: true, simulated: true };
};

// Build SOS message with Google Maps deep link
const buildSOSMessage = (user, lat, lng, address) => {
  const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
  return (
    `🚨 SAHELI SOS ALERT 🚨\n` +
    `${user.name} needs IMMEDIATE help!\n` +
    `📍 Location: ${address || 'Unknown'}\n` +
    `🗺 Live GPS: ${mapsLink}\n` +
    `📞 Call her NOW or contact Police: 100\n` +
    `─ Saheli SafeRoute App`
  );
};

// Low battery warning SMS
const buildLowBatteryMessage = (user, battery, lat, lng) => {
  const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
  return (
    `⚠️ Low Battery Alert — ${user.name}\n` +
    `Battery at ${battery}%. She may lose contact soon.\n` +
    `Last known location: ${mapsLink}\n` +
    `─ Saheli SafeRoute App`
  );
};

module.exports = { sendSMS, buildSOSMessage, buildLowBatteryMessage };
