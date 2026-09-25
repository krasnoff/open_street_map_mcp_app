import { handle } from "hono/vercel";
import { createHttpApp } from "../http.js";

const app = createHttpApp("/api/mcp");

export default handle(app);
