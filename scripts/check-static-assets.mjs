import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = resolve(root, "index.html");
const html = readFileSync(htmlPath, "utf8");
const assetAttributePattern = /\b(?:src|href)=["']([^"']+)["']/g;
const ogImagePattern = /<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "assets/favicon.svg",
  "assets/hero-ml-systems.png",
  "assets/egor-kuznetsov-cv.pdf",
  "api/chat.js",
  "vercel.json",
];
const references = new Set(requiredFiles);

for (const pattern of [assetAttributePattern, ogImagePattern]) {
  for (const match of html.matchAll(pattern)) {
    addReference(match[1]);
  }
}

function addReference(rawValue) {
  const value = rawValue.trim();

  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("//") ||
    value.startsWith("/") ||
    /^[a-z][a-z0-9+.-]*:/i.test(value)
  ) {
    return;
  }

  references.add(value.split(/[?#]/)[0]);
}

const missing = [];

for (const reference of references) {
  const filePath = resolve(root, reference);

  if (!filePath.startsWith(`${root}${sep}`) && filePath !== root) {
    missing.push(`${reference} points outside the project root`);
    continue;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    missing.push(reference);
  }
}

if (missing.length > 0) {
  console.error("Missing files referenced by the static site:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log(`Static asset check passed (${references.size} files).`);
