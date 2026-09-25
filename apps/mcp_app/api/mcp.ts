import { getRequestListener } from "@hono/node-server";
import { createHttpApp } from "../http.js";

const app = createHttpApp("/api/mcp");

export default getRequestListener(app.fetch);
