export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const path = Array.isArray(req.query.path) ? req.query.path.join("/") : (req.query.path || "");
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== "path") queryParams.append(key, value);
  }
  const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const targetUrl = `https://api.mail.tm/${path}${qs}`;

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "application/json",
  };
  if (req.headers["content-type"]) headers["Content-Type"] = req.headers["content-type"];
  if (req.headers["authorization"]) headers["Authorization"] = req.headers["authorization"];

  const init = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  try {
    const response = await fetch(targetUrl, init);
    const data = await response.text();
    res.status(response.status);
    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    return res.send(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
