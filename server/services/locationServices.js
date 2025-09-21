const Bus = require('../models/busModel');
let Ping;
try { Ping = require('../models/pingModel'); } catch { /* optional */ }

/**
 * Upsert latest location for a bus and (optionally) store a time-series ping.
 * Returns { ok: true, bus, ignored } where `ignored` is true if de-duped.
 */
async function upsertBusLocation({ busNumber, lat, lon, speed = 0, ts, from, seq }) {
  if (!busNumber) throw new Error('busNumber required');
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('lat/lon must be numbers');

  const when = ts ? new Date(Number(ts) * 1000) : new Date();
  speed = Number.isFinite(speed) ? Number(speed) : 0;

  // find/create bus
  let bus = await Bus.findOne({ busNumber });

  if (!bus) {
    bus = await Bus.create({
      busNumber,
      capacity: 0,
      currentLocation: { lat, lng: lon },
      lastLoc: { type: 'Point', coordinates: [lon, lat] },
      lastSpeed: speed,
      lastSeenAt: when,
      status: 'active',
      driverPhone: from,
      seq: seq ?? 0
    });
  } else {
    // --- de-duplication (keep it simple and safe) ---
    // ignore exact duplicate seq
    if (Number.isFinite(seq) && Number.isFinite(bus.seq) && seq === bus.seq) {
      return { ok: true, bus, ignored: true };
    }
    // ignore strictly older timestamps
    if (bus.lastSeenAt && when <= bus.lastSeenAt) {
      return { ok: true, bus, ignored: true };
    }

    // update latest
    bus.currentLocation = { lat, lng: lon };
    bus.lastLoc = { type: 'Point', coordinates: [lon, lat] };
    bus.lastSpeed = speed;
    bus.lastSeenAt = when;
    bus.status = 'active';
    if (Number.isFinite(seq)) bus.seq = seq;
    if (from) bus.driverPhone = from;
    await bus.save();
  }

  // store time-series (optional)
  if (Ping) {
    await Ping.create({
      busId: bus._id,
      busNumber,
      ts: when,
      loc: { type: 'Point', coordinates: [lon, lat] },
      speed,
      from,
      seq,
      raw: 'service'
    });
  }

  // (optional) broadcast via socket.io if you saved io on app.locals in index.js
  // const io = global._io;
  // io?.emit('locationUpdate', { busNumber, lat, lon, speed, ts: when.getTime() });

  return { ok: true, bus, ignored: false };
}

module.exports = { upsertBusLocation };
