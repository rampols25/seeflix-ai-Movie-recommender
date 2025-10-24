[export default {
  async fetch(request, env) {
    const API_KEY = "sk-ntuTTa7MPaMYYysTbBk5KZyOyUmy0RPSWUfhvVynmCrDaZ11";
    const BASE_URL = "https://seeflix-ai-proxy.rampolsrock.workers.dev/";
    const url = new URL(request.url);

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
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
