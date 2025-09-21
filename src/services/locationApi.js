const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function getLiveBuses(freshnessMins = 30) {
    // Use an environment variable for the API URL so it works anywhere
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";
    
    try {
        const response = await fetch(`${apiUrl}/api/buses/live?freshness=${freshnessMins}`);

        // IMPORTANT: Check if the server responded with an OK status
        if (!response.ok) {
            // If not, throw an error to be caught by the catch block
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch live buses:", error);
        // Return an empty array on failure so the app doesn't crash
        return []; 
    }
}

// export async function getLocationByNumber({busNumber}){
//   try{
//     const res = await fetch(`${API_BASE}/api/buses/live/`);
//   }
//   catch (err){
//     console.error(err);
//   }
// }

export async function getStatus({busNumber}){
  try{
    const res = await fetch(`${API_BASE}/api/buses/live/`);
  }
  catch (err){
    console.error(err);
  }
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


