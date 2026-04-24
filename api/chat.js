const DEFAULT_TIMEOUT_MS = 25000;

function sendJson(response, statusCode, payload) {
  response.status(statusCode);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.send(JSON.stringify(payload));
}

function getRequestBody(request) {
  if (request.body == null) {
    return "{}";
  }

  if (typeof request.body === "string" || Buffer.isBuffer(request.body)) {
    return request.body;
  }

  return JSON.stringify(request.body);
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { detail: "Method Not Allowed" });
  }

  const chatApiUrl = process.env.CV_CHAT_API_URL;

  if (!chatApiUrl) {
    return sendJson(response, 503, {
      detail: "CV_CHAT_API_URL is not configured for this Vercel project.",
    });
  }

  let targetUrl;

  try {
    targetUrl = new URL(chatApiUrl);

    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      throw new Error("Unsupported protocol");
    }
  } catch {
    return sendJson(response, 500, {
      detail: "CV_CHAT_API_URL must be an absolute http(s) URL.",
    });
  }

  const timeoutMs = Number(process.env.CV_CHAT_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const headers = {
    "Content-Type": "application/json",
  };

  if (process.env.CV_CHAT_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.CV_CHAT_API_TOKEN}`;
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: getRequestBody(request),
      signal: controller.signal,
    });
    const contentType = upstream.headers.get("content-type") || "application/json; charset=utf-8";
    const body = await upstream.text();

    response.status(upstream.status);
    response.setHeader("Content-Type", contentType);
    response.setHeader("Cache-Control", "no-store");
    return response.send(body);
  } catch (error) {
    const isTimeout = error.name === "AbortError";

    return sendJson(response, isTimeout ? 504 : 502, {
      detail: isTimeout ? "Chat backend request timed out." : "Chat backend is unavailable.",
    });
  } finally {
    clearTimeout(timeout);
  }
};
