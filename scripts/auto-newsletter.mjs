#!/usr/bin/env node
/**
 * Generate weekly newsletter draft из изменений за последние 7 дней.
 * Output: .automation/newsletter/<YYYY-WNN>.md — готовый к копированию в beehiiv/Substack.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { listTools, readState, recordRun, ROOT_DIR, AUTO_DIR } from './_state.mjs';

function isoWeek(d = new Date()) {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((target - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return { year: target.getUTCFullYear(), week };
}

async function recentRecipes(days = 7) {
  const dir = path.join(ROOT_DIR, 'src/content/recipes');
  const files = await fs.readdir(dir);
  const cutoff = Date.now() - days * 86400000;
  const out = [];
  for (const f of files.filter((n) => n.endsWith('.mdx') || n.endsWith('.md'))) {
    const text = await fs.readFile(path.join(dir, f), 'utf-8');
    const m = text.match(/updated:\s*"(\d{4}-\d{2}-\d{2})"/);
    if (!m) continue;
    if (new Date(m[1]).getTime() < cutoff) continue;
    const titleM = text.match(/title:\s*"([^"]+)"/);
    const descM = text.match(/description:\s*"([^"]+)"/);
    out.push({
      slug: f.replace(/\.(mdx|md)$/, ''),
      title: titleM?.[1] ?? f,
      description: descM?.[1] ?? '',
      updated: m[1],
    });
  }
  return out.sort((a, b) => (a.updated < b.updated ? 1 : -1));
}

async function main() {
  const tools = await listTools();
  const state = await readState();
  const { year, week } = isoWeek();
  const today = new Date().toISOString().slice(0, 10);
  const recent = await recentRecipes(7);

  const stale = tools.filter((t) => {
    const d = (Date.now() - new Date(t.last_verified).getTime()) / 86400000;
    return d > 30;
  });
  const pricingChanges = (state.pricing_changes ?? []).filter((c) => {
    const d = (Date.now() - new Date(c.detected_at).getTime()) / 86400000;
    return d <= 7;
  });

  const md = `# AgentStack — Weekly ${year}-W${String(week).padStart(2, '0')}

_${today}_

Hi! Here's what's new in the AI coding agents world this week.

## 📝 New on the site

${recent.length ? recent.map((r) => `- [**${r.title}**](https://agentstack.dev/recipes/${r.slug}) — ${r.description}`).join('\n') : '_No new recipes published this week._'}

## 💸 Pricing changes detected

${pricingChanges.length
    ? pricingChanges.map((c) => `- **${c.tool}**: $${c.old}/mo → $${c.new}/mo (${c.detected_at})`).join('\n')
    : '_No pricing changes detected this week._'}

## 🧰 Tools snapshot

${tools.length} tools indexed. ${tools.filter((t) => t.open_source).length} OSS, ${tools.filter((t) => !t.pricing.free_tier).length} paid-only.

${stale.length ? `⚠ ${stale.length} tool(s) due for refresh: ${stale.map((t) => t.name).join(', ')}.` : '✓ All entries fresh.'}

## 🤔 What we're watching

- **MCP server ecosystem** — new servers landing weekly. Browse [our directory](https://agentstack.dev) for current best.
- **Auto-discovery scanned ${state.discovered_tools?.length ?? 0} candidates** from HN/Reddit since last run. Pending review.

## Curated reads

_Hand-pick 2-3 outside articles to credibilize. Edit before sending._

- TODO: pick a great post from the past week
- TODO: maybe a viral tweet thread
- TODO: a research paper on coding agents

---

**Reply with feedback** — what's confusing? what would you like reviewed?

— AgentStack team

P.S. If a friend forwarded this, [subscribe here](https://agentstack.dev/about).
`;

  const dir = path.join(AUTO_DIR, 'newsletter');
  await fs.mkdir(dir, { recursive: true });
  const out = path.join(dir, `${year}-W${String(week).padStart(2, '0')}.md`);
  await fs.writeFile(out, md, 'utf-8');
  await recordRun('newsletter');

  console.log(`✓ Newsletter draft: ${out}`);
  console.log('  Hand-edit "Curated reads" before sending. Then paste into beehiiv/Substack.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
