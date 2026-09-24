import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const root = resolve(__dirname, "..");

const inputFile = resolve(root, "dist/index.html");

const outputFile = resolve(
  root,
  "generated/app-html.ts",
);

const html = await readFile(inputFile, "utf8");

const source = `
// THIS FILE IS AUTO-GENERATED.
// DO NOT EDIT MANUALLY.

const html = ${JSON.stringify(html)};

export default html;
`;

await mkdir(
  dirname(outputFile),
  { recursive: true },
);

await writeFile(
  outputFile,
  source,
  "utf8",
);

console.log(
  `Generated ${outputFile}`,
);