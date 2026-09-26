import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono, type Handler } from "hono";
import { createServer } from "./server.js";

export function createHttpApp(mcpPaths: string | string[] = "/mcp") {
  const app = new Hono();
  const paths = Array.isArray(mcpPaths) ? mcpPaths : [mcpPaths];

  app.get("/", (context) => context.json({
    name: "openstreetmap-viewer",
    mcp: "/mcp",
  }));

  for (const path of paths) {
    app.use(path, async (context, next) => {
      await next();
      context.header("Access-Control-Allow-Origin", "*");
      context.header("Access-Control-Expose-Headers", "Mcp-Session-Id");
    });

    app.options(path, (context) => {
      context.header("Access-Control-Allow-Origin", "*");
      context.header("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
      context.header(
        "Access-Control-Allow-Headers",
        "content-type, accept, mcp-protocol-version, mcp-session-id",
      );
      context.header("Access-Control-Expose-Headers", "Mcp-Session-Id");
      return context.body(null, 204);
    });
  }

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

  for (const path of paths) {
    app.all(path, handleMcpRequest);
  }

  return app;
}
