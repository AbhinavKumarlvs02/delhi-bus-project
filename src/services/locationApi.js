const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function getLiveBuses(freshnessMins = 30) {
  const res = await fetch(`${API_BASE}/api/buses/live?freshness=${freshnessMins}`);
  if (!res.ok) throw new Error("live fetch failed");
  const data = await res.json();

  // normalize for Map.jsx
  return data
    .filter(b => Number.isFinite(b.lat) && Number.isFinite(b.lon))
    .map(b => ({
      id: b.busNumber,
      name: b.busNumber,
      status: b.status || "active",
      routeName: b.routeName || "",            // if you add it later
      location: [b.lat, b.lon],
      speed: b.speed ?? 0,
      lastSeenAt: b.lastSeenAt
    }));
}

export async function sendLocation({ busNumber, lat, lon, speed = 0, ts = Math.floor(Date.now()/1000), seq }) {
  const res = await fetch(`${API_BASE}/api/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ busNumber, lat, lon, speed, ts, seq })
  });
  if (!res.ok) throw new Error("location post failed");
  return res.json();
}
