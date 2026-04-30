#!/usr/bin/env node
/**
 * Auto pricing tracker. Скачивает homepage/docs/pricing у каждого инструмента,
 * ищет цифры в формате "$XX/mo", сравнивает с stored. Алерты — в state.
 *
 * Это эвристика — не парсер с DOM-анализом. Если ToS-сайтов меняется заголовок
 * или формат, мы отметим это как "review needed" не как ложно-положительный alert.
 */
import { listTools, readState, writeState, recordRun } from './_state.mjs';

async function fetchText(url, timeout = 10_000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'agentstack-pricing/0.1 (+https://agentstack.dev)' },
    });
    return r.ok ? await r.text() : '';
  } catch {
    return '';
  } finally {
    clearTimeout(t);
  }
}

function extractPrices(text) {
  const re = /\$\s?(\d{1,3}(?:[.,]\d{1,2})?)\s*\/?\s*(?:mo|month|user|seat|m)\b/gi;
  const out = new Set();
  let m;
  while ((m = re.exec(text)) !== null) out.add(parseFloat(m[1].replace(',', '.')));
  return [...out].sort((a, b) => a - b);
}

async function main() {
  const tools = await listTools();
  const changes = [];
  console.log(`→ Checking pricing for ${tools.length} tools…\n`);

  for (const t of tools) {
    const url = t.docs && t.docs.includes('pricing') ? t.docs : t.homepage;
    if (!url) continue;
    const text = await fetchText(url);
    if (!text) {
      console.log(`  ⚠ ${t.name}: fetch failed`);
      continue;
    }
    const prices = extractPrices(text);
    const stored = t.pricing.paid_from_usd ?? null;
    if (stored === null) {
      console.log(`  · ${t.name}: stored=free, found=${prices.length ? prices.join(',') : 'none'}`);
      continue;
    }
    if (!prices.length) {
      console.log(`  ? ${t.name}: stored=$${stored}, page parsed but no $/mo found`);
      continue;
    }
    const min = prices[0];
    if (min !== stored && Math.abs(min - stored) >= 1) {
      console.log(`  ⚡ ${t.name}: $${stored}/mo → $${min}/mo`);
      changes.push({
        tool: t.name,
        slug: t.slug,
        old: stored,
        new: min,
        detected_at: new Date().toISOString().slice(0, 10),
        source: url,
      });
    } else {
      console.log(`  ✓ ${t.name}: $${stored} (matches)`);
    }
  }

  const state = await readState();
  if (changes.length) {
    state.pricing_changes = [...(state.pricing_changes ?? []), ...changes];
    await writeState(state);
  }
  await recordRun('pricing', { changes: changes.length });

  console.log(`\n${changes.length ? '⚡ ' + changes.length + ' price change(s) detected — review on dashboard.' : '✓ No changes detected.'}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
