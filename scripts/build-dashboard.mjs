#!/usr/bin/env node
/**
 * Generates dashboard.html — single-file control center.
 *
 * Reads:
 *   src/content/tools/*.json
 *   src/content/recipes/*.mdx (front-matter only)
 *   .automation/state.json (if exists — outputs of automation runs)
 *
 * Writes:
 *   dashboard.html (project root)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

async function loadTools() {
  const dir = path.join(ROOT, 'src/content/tools');
  const files = await fs.readdir(dir);
  const out = [];
  for (const f of files.filter((n) => n.endsWith('.json'))) {
    const content = JSON.parse(await fs.readFile(path.join(dir, f), 'utf-8'));
    out.push(content);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
    } else if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    } else if (!isNaN(Number(val))) {
      val = Number(val);
    }
    fm[kv[1]] = val;
  }
  return fm;
}

async function loadRecipes() {
  const dir = path.join(ROOT, 'src/content/recipes');
  const files = await fs.readdir(dir);
  const out = [];
  for (const f of files.filter((n) => n.endsWith('.mdx') || n.endsWith('.md'))) {
    const text = await fs.readFile(path.join(dir, f), 'utf-8');
    const fm = parseFrontmatter(text);
    if (fm) out.push({ slug: f.replace(/\.(mdx|md)$/, ''), ...fm });
  }
  return out.sort((a, b) => (a.updated < b.updated ? 1 : -1));
}

async function loadAutomationState() {
  try {
    return JSON.parse(await fs.readFile(path.join(ROOT, '.automation/state.json'), 'utf-8'));
  } catch {
    return {
      last_runs: {},
      discovered_tools: [],
      pricing_changes: [],
      health_issues: [],
      pipeline: { drafts: [], queued_ideas: [] },
    };
  }
}

function dayDelta(iso) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / 86400000);
}

function statusForTool(t) {
  const d = dayDelta(t.last_verified);
  if (d == null) return { label: 'no data', color: 'gray' };
  if (d <= 7) return { label: 'fresh', color: 'green' };
  if (d <= 30) return { label: 'aging', color: 'yellow' };
  return { label: `stale (${d}d)`, color: 'red' };
}

async function main() {
  const tools = await loadTools();
  const recipes = await loadRecipes();
  const auto = await loadAutomationState();

  const stats = {
    tools: tools.length,
    recipes: recipes.length,
    oss: tools.filter((t) => t.open_source).length,
    paid: tools.filter((t) => !t.pricing.free_tier).length,
    pairs: (tools.length * (tools.length - 1)) / 2,
    fresh: tools.filter((t) => dayDelta(t.last_verified) <= 7).length,
    stale: tools.filter((t) => dayDelta(t.last_verified) > 30).length,
  };

  const data = { tools, recipes, auto, stats, generated: new Date().toISOString() };
  const json = JSON.stringify(data);

  const html = await fs.readFile(path.join(__dirname, 'dashboard-template.html'), 'utf-8');
  const filled = html.replace(
    '__DASHBOARD_DATA__',
    json.replace(/</g, '\\u003c').replace(/-->/g, '--\\u003e'),
  );

  await fs.writeFile(path.join(ROOT, 'dashboard.html'), filled, 'utf-8');
  console.log('✓ dashboard.html generated');
  console.log(`  ${stats.tools} tools, ${stats.recipes} recipes, ${stats.fresh} fresh, ${stats.stale} stale`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
