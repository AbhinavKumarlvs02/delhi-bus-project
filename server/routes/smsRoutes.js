// server/routes/smsRoutes.js
const express = require('express');
const { upsertBusLocation } = require('../services/locationServices');

const router = express.Router();

// Accepts: v1|BUS12|1737441111|28.61390|77.20900|13|S42
function parseSmsPayload(txt = '') {
  const parts = txt.trim().split('|').map(s => s.trim());
  if (parts.length < 6) throw new Error('need 6+ fields: V1|BUS|ts|lat|lon|speed|[seq]');
  const [ver, busNumber, tsStr, latStr, lonStr, speedStr, seqStr] = parts;
  if (!/^v1$/i.test(ver)) throw new Error('version must be V1');
  const ts = Number(tsStr);
  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);
  const speed = Number(speedStr);
  const seq = seqStr ? Number(String(seqStr).replace(/^S/i, '')) : undefined;
  if (!Number.isFinite(ts) || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('ts/lat/lon must be numbers');
  }
  return { busNumber, ts, lat, lon, speed: Number.isFinite(speed) ? speed : 0, seq };
}

/**
 * POST /sms/inbound
 * Body: form-encoded fields from gateway: Body, From
 */
router.post('/inbound', async (req, res) => {
  try {
    const body = (req.body?.Body ?? req.body?.body ?? '').trim();
    const from = (req.body?.From ?? req.body?.from ?? '').trim();
    const p = parseSmsPayload(body);

    const result = await upsertBusLocation({ ...p, from });

    const msg = result.ignored ? 'IGNORED' : `OK ${p.busNumber}`;
    res.type('text/xml').send(`<Response><Message>${msg}</Message></Response>`);
  } catch (e) {
    console.error('SMS inbound error:', e.message);
    res.type('text/xml').send(`<Response><Message>ERR</Message></Response>`);
  }
});

module.exports = router;
