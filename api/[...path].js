export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Szybki test z paska przeglądarki (GET)
  let bodyPayload;
  if (req.method === "GET") {
    bodyPayload = JSON.stringify({
      query: `query { inbox(mailbox: "test") { id headerfrom subject date } }`,
    });
  } else {
    bodyPayload = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  try {
    const response = await fetch("https://api.maildrop.cc/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      body: bodyPayload,
    });

    const data = await response.text();
    res.status(response.status);
    res.setHeader("Content-Type", "application/json");
    return res.send(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
