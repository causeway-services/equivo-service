import { test } from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { applyWebStandards } from "../../../scripts/apply-web-standards.mjs";
import standards from "../../../standards.config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const page = (title) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title></head><body><main></main></body></html>`;

async function built() {
  const dir = await mkdtemp(join(tmpdir(), "equivo-standards-"));
  await mkdir(join(dir, "data"));
  await mkdir(join(dir, "atlas"));
  const rooms = ["The Descent", "Marks and Utterances"].map((title, index) => ({ title, kind: index === 0 ? "overview" : "lesson" }));
  await writeFile(join(dir, "data/equivo-world.json"), JSON.stringify({ rooms, exercises: [{}, {}, {}] }));
  await writeFile(join(dir, "index.html"), page("Equivo"));
  await writeFile(join(dir, "atlas/index.html"), page("Atlas"));
  await writeFile(join(dir, "404.html"), page("Not found"));
  const config = await standards({ dir, configDir: root });
  await applyWebStandards({ dir, config, date: "2026-10-21" });
  return dir;
}

test("the course page is describable: title, description, canonical, cards, Course JSON-LD", async () => {
  const dir = await built();
  const html = await readFile(join(dir, "index.html"), "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/u)[1];
  assert.ok(title.length >= 10 && title.length <= 70, title);
  const description = html.match(/<meta name="description" content="([^"]*)">/u)[1];
  assert.ok(description.length >= 50 && description.length <= 160, description);
  assert.match(html, /<link rel="canonical" href="https:\/\/equivo\.play\.561\.group\/">/u);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/u);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u)[1]);
  assert.deepEqual(ld["@graph"].map((node) => node["@type"]), ["WebSite", "Organization", "Course"]);
  assert.match(await readFile(join(dir, "404.html"), "utf8"), /noindex/u);
});

test("headers, discovery files and icons are written", async () => {
  const dir = await built();
  const headers = await readFile(join(dir, "_headers"), "utf8");
  assert.match(headers, /Strict-Transport-Security: max-age=63072000\n/u);
  assert.doesNotMatch(headers, /includeSubDomains/u);
  assert.match(headers, /frame-ancestors 'none'/u);
  assert.match(headers, /object-src 'none'/u);
  assert.match(await readFile(join(dir, "robots.txt"), "utf8"), /User-agent: ClaudeBot\nAllow: \//u);
  assert.match(await readFile(join(dir, "sitemap.xml"), "utf8"), /<lastmod>2026-10-21<\/lastmod>/u);
  assert.match(await readFile(join(dir, "llms.txt"), "utf8"), /^# Equivo\n/u);
  assert.match(await readFile(join(dir, ".well-known/security.txt"), "utf8"), /^Contact: mailto:cto@561\.group$/mu);
  for (const name of ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "card.png"]) assert.ok((await readFile(join(dir, name))).length > 100, name);
});
