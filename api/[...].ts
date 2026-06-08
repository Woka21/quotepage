import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import the built Nitro server entry point
let nitroApp: any;

async function getNitroApp() {
  if (!nitroApp) {
    try {
      const module = await import("../dist/server/nitro.mjs");
      nitroApp = module.default || module;
    } catch (err) {
      console.error("Failed to import nitro app:", err);
      throw err;
    }
  }
  return nitroApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await getNitroApp();
    
    // Build the full URL
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const url = `${protocol}://${host}${req.url}`;

    // Create a Web standard Request
    const webRequest = new Request(url, {
      method: req.method || "GET",
      headers: new Headers(req.headers as Record<string, string>),
      body:
        req.method && req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body || {})
          : undefined,
    });

    // Call the Nitro server
    const webResponse = await app.fetch(webRequest, {}, {});

    // Set response status
    res.status(webResponse.status);

    // Copy headers from web response
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Get and send body
    const body = await webResponse.text();
    res.send(body);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
