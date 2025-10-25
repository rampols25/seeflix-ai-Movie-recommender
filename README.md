# AgentRouter Proxy

A Cloudflare Worker that securely connects your website or app to the AgentRouter API.

## Features
- Supports multiple endpoints: /chat, /image, /tools
- CORS enabled for web use
- Ready for integration with SEEFLIX or other AI projects

## Usage
POST your requests to your Worker URL:
```
https://your-worker-name.username.workers.dev/chat
```

Replace `YOUR_AGENTROUTER_API_KEY` in worker.js with your actual AgentRouter API key.
