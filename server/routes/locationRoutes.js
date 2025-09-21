// server/routes/locationRoutes.js
const express = require('express');
const { upsertBusLocation } = require('../services/locationServices');

const router = express.Router();

/**
 * POST /api/location
 * Body: { busNumber, lat, lon, speed?, ts? (unix seconds), seq? }
 */
router.post('/', async (req, res) => {
  try {
    const { busNumber, lat, lon, speed, ts, seq } = req.body || {};
    const result = await upsertBusLocation({ busNumber, lat, lon, speed, ts, seq });
    res.json({ ok: true, ignored: result.ignored });
  } catch (e) {
    console.error('POST /api/location error:', e.message);
    res.status(400).json({ ok: false, error: e.message });
  }
});

module.exports = router;
