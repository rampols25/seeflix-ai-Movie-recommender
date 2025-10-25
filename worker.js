export default {
  async fetch(request, env) {
    // ✅ Store your AgentRouter API key in a Cloudflare environment variable (not in code!)
    // In Cloudflare dashboard → Settings → Variables → Add secret (API_KEY)
    const API_KEY = env.AGENTROUTER_API_KEY;

    // ✅ Allow only your own domains (replace with your real domain or localhost for testing)
    const ALLOWED_ORIGINS = [
      "https://seeflix.net",     // your live domain
      "https://seeflix.vercel.app", // if hosted on Vercel
      "http://localhost:3000"    // local testing
    ];

    // Validate request origin
    const origin = request.headers.get("Origin");
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized domain" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const BASE_URL = "https://api.agentrouter.org/v1";
    const url = new URL(request.url);

    // Route handling
    let endpoint = "/chat/completions";
    if (url.pathname.startsWith("/image")) endpoint = "/images/generate";
    if (url.pathname.startsWith("/tools")) endpoint = "/tools";

    const targetURL = `${BASE_URL}${endpoint}`;

    try {
      const response = await fetch(targetURL, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: request.method === "GET" ? undefined : await request.text(),
      });

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Proxy request failed",
          details: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
