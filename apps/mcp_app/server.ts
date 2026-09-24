import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { geocodePlace } from "@workspace/utils";
import appHtml from "./generated/app-html.js";

const RESOURCE_URI = "ui://map/app.html";

export function createServer() {
  const server = new McpServer({ name: "openstreetmap-viewer", version: "1.0.0" });

  server.registerTool("geocode-place", {
    title: "Find place coordinates",
    description: "Convert a place name into coordinates and geographic bounds. Pass north, south, east, and west from the result to the open-map tool.",
    inputSchema: {
      placeName: z.string().trim().min(1).max(300).describe("Place to find, for example: Paris, France"),
    },
    outputSchema: {
      displayName: z.string(),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      north: z.number().min(-90).max(90),
      south: z.number().min(-90).max(90),
      east: z.number().min(-180).max(180),
      west: z.number().min(-180).max(180),
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true,
    },
  }, async ({ placeName }) => {
    try {
      const result = await geocodePlace(placeName);
      if (!result) {
        return {
          content: [{ type: "text", text: `No place was found for “${placeName}”.` }],
          isError: true,
        };
      }

      return {
        content: [{
          type: "text",
          text: `Found ${result.displayName}. Use north ${result.north}, south ${result.south}, east ${result.east}, and west ${result.west} with open-map.`,
        }],
        structuredContent: result,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown geocoding error.";
      return {
        content: [{ type: "text", text: `Could not geocode “${placeName}”: ${message}` }],
        isError: true,
      };
    }
  });

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
      text: appHtml,
      _meta: { ui: { domain: "openstreetmap-viewer", csp: { resourceDomains: ["https://tile.openstreetmap.org"] } } },
    }],
  }));

  return server;
}
