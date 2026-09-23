import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createServer } from "./server.js";
import { randomUUID } from "node:crypto";
// import cors from "cors";

async function runStdio() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

function runHttp() {
  const port = Number(process.env.PORT ?? 3001);
  const publicHost = process.env.PUBLIC_HOST ?? "full-hookworm-tightly.ngrok-free.app";
  const allowedHosts = [
    "localhost",
    `localhost:${port}`,
    "127.0.0.1",
    `127.0.0.1:${port}`,
    publicHost,
  ];
  const app = createMcpExpressApp({ allowedHosts });
  // app.use(cors({ origin: "*", exposedHeaders: ["Mcp-Session-Id"] }));
  const transports = new Map<string, StreamableHTTPServerTransport>();

  app.post("/mcp", async (req, res) => {
    try {
      const sessionId = req.headers["mcp-session-id"];
      let transport = typeof sessionId === "string" ? transports.get(sessionId) : undefined;

      if (!transport && !sessionId && isInitializeRequest(req.body)) {
        const server = createServer();
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          enableDnsRebindingProtection: true,
          allowedHosts,
          onsessioninitialized: (initializedSessionId) => {
            transports.set(initializedSessionId, transport!);
          },
          onsessionclosed: (closedSessionId) => {
            transports.delete(closedSessionId);
          },
        });
        transport.onclose = () => {
          const closedSessionId = transport?.sessionId;
          if (closedSessionId) transports.delete(closedSessionId);
        };
        await server.connect(transport);
      }

      if (!transport) {
        res.status(400).json({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Bad Request: No valid session ID provided" },
          id: null,
        });
        return;
      }

      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("MCP request failed", error);
      if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
    }
  });

  app.all("/mcp", async (req, res) => {
    const sessionId = req.headers["mcp-session-id"];
    const transport = typeof sessionId === "string" ? transports.get(sessionId) : undefined;
    if (!transport) {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: No valid session ID provided" },
        id: null,
      });
      return;
    }

    try {
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("MCP request failed", error);
      if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
    }
  });
  app.listen(port, () => console.log(`Sign-in Form MCP server: http://localhost:${port}/mcp`));
}

if (process.env.TRANSPORT === "stdio") {
  runStdio().catch((error) => { console.error(error); process.exit(1); });
} else {
  runHttp();
}
