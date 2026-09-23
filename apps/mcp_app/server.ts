import { readFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";

const RESOURCE_URI = "ui://map/app.html";
const MODULE_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const APP_HTML_PATH = resolve(
  MODULE_DIRECTORY,
  basename(MODULE_DIRECTORY) === "dist-server" ? "../dist/index.html" : "dist/index.html",
);

export function createServer() {
  const server = new McpServer({ name: "openstreetmap-viewer", version: "1.0.0" });

  registerAppTool(server, "open-map", {
    title: "Open map",
    description: "Display an interactive OpenStreetMap map for the supplied geographic bounds.",
    inputSchema: {
      north: z.number().min(-90).max(90).describe("Northern latitude of the map bounds"),
      south: z.number().min(-90).max(90).describe("Southern latitude of the map bounds"),
      east: z.number().min(-180).max(180).describe("Eastern longitude of the map bounds"),
      west: z.number().min(-180).max(180).describe("Western longitude of the map bounds"),
    },
    outputSchema: { ready: z.boolean() },
    _meta: { ui: { resourceUri: RESOURCE_URI } },
  }, async ({ north, south, east, west }) => {
    return {
      content: [{
        type: "text",
        text: `Interactive map opened for bounds north ${north}, south ${south}, east ${east}, west ${west}.`,
      }],
      structuredContent: { ready: true },
    };
  });

  registerAppResource(server, "OpenStreetMap map", RESOURCE_URI, {
    description: "Interactive OpenStreetMap map",
  }, async () => ({
    contents: [{
      uri: RESOURCE_URI,
      mimeType: RESOURCE_MIME_TYPE,
      text: await readFile(APP_HTML_PATH, "utf8"),
      _meta: { ui: { domain: "openstreetmap-viewer", csp: { resourceDomains: ["https://tile.openstreetmap.org"] } } },
    }],
  }));

  return server;
}
