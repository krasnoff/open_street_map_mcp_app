import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { createServer } from "./server.js";

export function createHttpApp(mcpPath = "/mcp") {
  const app = new Hono();

  app.get("/", (context) => context.json({
    name: "openstreetmap-viewer",
    mcp: "/mcp",
  }));

  app.all(mcpPath, async (context) => {
    const server = createServer();
    const transport = new StreamableHTTPTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    try {
      await server.connect(transport);
      const response = await transport.handleRequest(context);

      return response ?? context.json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "The MCP transport returned no response." },
        id: null,
      }, 500);
    } catch (error) {
      console.error("MCP request failed", error);
      return context.json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      }, 500);
    }
  });

  return app;
}
