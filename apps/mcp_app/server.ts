import { readFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";

const RESOURCE_URI = "ui://sign-in/app.html";
const MODULE_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const APP_HTML_PATH = resolve(
  MODULE_DIRECTORY,
  basename(MODULE_DIRECTORY) === "dist-server" ? "../dist/index.html" : "dist/index.html",
);

export function createServer() {
  const server = new McpServer({ name: "sign-in-form", version: "1.0.0" });

  registerAppTool(server, "open-sign-in", {
    title: "Open sign-in form",
    description: "Display an interactive username and password form.",
    inputSchema: {},
    outputSchema: { ready: z.boolean() },
    _meta: { ui: { resourceUri: RESOURCE_URI } },
  }, async () => {
    return {
      content: [{ type: "text", text: "Sign-in form opened." }],
      structuredContent: { ready: true },
    };
  });

  registerAppResource(server, "Sign-in form", RESOURCE_URI, {
    description: "Interactive username and password form",
  }, async () => ({
    contents: [{
      uri: RESOURCE_URI,
      mimeType: RESOURCE_MIME_TYPE,
      text: await readFile(APP_HTML_PATH, "utf8"),
      _meta: { ui: { csp: {} } },
    }],
  }));

  return server;
}
