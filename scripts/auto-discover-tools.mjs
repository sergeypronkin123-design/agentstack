#!/usr/bin/env node
/**
 * Auto-discovery: scan HN front-page + r/programming + r/LocalLLaMA для упоминаний
 * AI-coding инструментов, которых нет в нашем индексе. Сохраняет кандидатов в state.
 *
 * Запуск:  node scripts/auto-discover-tools.mjs
 *
 * Фильтры (regex по всем известным AI-coding tool-словам):
 *   "ai coding", "code agent", "AI assistant", "AI IDE", "MCP server",
 *   а также имена популярных тулов для ловли follow-up веток.
 */
import { listTools, readState, writeState, recordRun } from './_state.mjs';

const KEYWORDS = [
  'ai coding', 'ai code', 'code agent', 'coding agent', 'code assistant',
  'ai ide', 'mcp server', 'model context protocol',
  'cursor', 'claude code', 'cline', 'aider', 'continue', 'windsurf',
  'codeium', 'tabnine', 'copilot', 'cody', 'roo code', 'kilo', 'opencode',
  'replit', 'bolt.new', 'v0', 'lovable',
];

const KNOWN_NAMES = new Set();

async function fetchHN() {
  const r = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  const ids = (await r.json()).slice(0, 100);
  const items = await Promise.all(
    ids.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((x) => x.json()),
    ),
  );
  return items.filter(Boolean).map((it) => ({
    title: it.title ?? '',
    url: it.url ?? `https://news.ycombinator.com/item?id=${it.id}`,
    source: 'HN',
  }));
}

async function fetchReddit(sub) {
  try {
    const r = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=50`, {
      headers: { 'User-Agent': 'agentstack-discoverer/0.1' },
    });
    if (!r.ok) return [];
    const j = await r.json();
    return j.data.children.map((c) => ({
      title: c.data.title,
      url: c.data.url,
      source: `r/${sub}`,
    }));
  } catch {
    return [];
  }
}

function looksLikeAITool(title) {
  const t = title.toLowerCase();
  return KEYWORDS.some((k) => t.includes(k));
}

function extractToolName(title) {
  // Пытаемся выудить из «Show HN: ToolName – ...» и «I built X for Y»
  const showHn = title.match(/Show HN[:\-–]\s*([A-Z][\w\-\.]{1,30})/);
  if (showHn) return showHn[1];
  const ibuilt = title.match(/I built ([A-Z][\w\-\.]{1,30})/);
  if (ibuilt) return ibuilt[1];
  return null;
}

async function main() {
  const known = await listTools();
  for (const t of known) {
    KNOWN_NAMES.add(t.name.toLowerCase());
    KNOWN_NAMES.add(t.slug.toLowerCase());
  }

  console.log('→ Fetching HN…');
  const hn = await fetchHN();
  console.log('→ Fetching r/programming…');
  const r1 = await fetchReddit('programming');
  console.log('→ Fetching r/LocalLLaMA…');
  const r2 = await fetchReddit('LocalLLaMA');

  const all = [...hn, ...r1, ...r2];
  const candidates = [];

  for (const it of all) {
    if (!looksLikeAITool(it.title)) continue;
    const name = extractToolName(it.title);
    if (!name) continue;
    if (KNOWN_NAMES.has(name.toLowerCase())) continue;
    candidates.push({
      name,
      title: it.title,
      url: it.url,
      source: it.source,
      first_seen: new Date().toISOString().slice(0, 10),
    });
  }

  // dedup по name
  const seen = new Set();
  const unique = candidates.filter((c) => {
    const k = c.name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const state = await readState();
  const existing = new Set((state.discovered_tools ?? []).map((t) => t.name.toLowerCase()));
  const fresh = unique.filter((c) => !existing.has(c.name.toLowerCase()));

  state.discovered_tools = [...(state.discovered_tools ?? []), ...fresh];
  await writeState(state);
  await recordRun('discover', { found: fresh.length });

  console.log(`\n✓ Scanned ${all.length} posts.`);
  console.log(`✓ Found ${unique.length} candidates, ${fresh.length} new.`);
  if (fresh.length) {
    console.log('\nNew candidates (review on dashboard → Pipeline):');
    fresh.forEach((c) => console.log(`  · ${c.name} (${c.source}) — ${c.title}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
