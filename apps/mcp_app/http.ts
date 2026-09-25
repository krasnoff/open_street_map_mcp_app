import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono, type Handler } from "hono";
import { createServer } from "./server.js";

export function createHttpApp(mcpPaths: string | string[] = "/mcp") {
  const app = new Hono();

  app.get("/", (context) => context.json({
    name: "openstreetmap-viewer",
    mcp: "/mcp",
  }));

  const handleMcpRequest: Handler = async (context) => {
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
  };

  for (const path of Array.isArray(mcpPaths) ? mcpPaths : [mcpPaths]) {
    app.all(path, handleMcpRequest);
  }

  return app;
}
