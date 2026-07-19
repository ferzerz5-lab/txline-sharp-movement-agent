export default async function handler(req, res) {
  try {
    const API_ORIGIN = "https://txline-dev.txodds.com";
    const API_TOKEN = process.env.TXLINE_API_TOKEN;

    const authResp = await fetch(`${API_ORIGIN}/auth/guest/start`, { method: "POST" });
    const authData = await authResp.json();
    const jwt = authData.token;

    const competitionIds = [430, 8, 7];
    const results = [];
    for (const id of competitionIds) {
      const r = await fetch(`${API_ORIGIN}/api/fixtures/snapshot?competitionId=${id}`, {
        headers: { Authorization: `Bearer ${jwt}`, "X-Api-Token": API_TOKEN },
      });
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data)) results.push(...data);
      }
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
