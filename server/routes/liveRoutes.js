const express = require("express");
const Bus = require("../models/busModel");
const router = express.Router()

router.get("/live" , async (req , res) => {
    try{
        const { freshness,routeId } = req.query;

        const query = {};
        if (routeId) query.route = routeId;

        let buses = await Bus.find(
            query,
            { busNumber: 1, lastLoc: 1, currentLocation: 1, lastSpeed: 1, lastSeenAt: 1, status: 1 }
        ).lean();

        // Optional freshness filter (in minutes)
    if (freshness) {
      const maxAgeMs = Math.max(0, Number(freshness)) * 60 * 1000;
      const now = Date.now();
      buses = buses.filter(b => b.lastSeenAt && (now - new Date(b.lastSeenAt).getTime()) <= maxAgeMs);
    }

    const payload = buses.map(b => ({
        busNumber: b.busNumber,
        // prefer GeoJSON lastLoc; fall back to legacy currentLocation
        lat: b.lastLoc?.coordinates?.[1] ?? b.currentLocation?.lat ?? null,
        lon: b.lastLoc?.coordinates?.[0] ?? b.currentLocation?.lng ?? null,
        speed: b.lastSpeed || 0,
        lastSeenAt: b.lastSeenAt || null,
        status: b.status || 'unknown',
    }));
    res.json(payload);
    } catch (err){
        console.error('GET /buses/live error:', err);
        res.status(500).json({ error: "Failed to fetch live buses"});
    }
});

module.exports = router;