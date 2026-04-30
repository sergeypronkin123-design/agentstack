#!/usr/bin/env node
/**
 * Pings homepage/docs/repo/affiliate URLs у каждого инструмента.
 * Помечает 4xx/5xx/timeouts. Записывает в state.health_issues.
 */
import { listTools, readState, writeState, recordRun } from './_state.mjs';

async function ping(url, timeout = 8_000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  const start = Date.now();
  try {
    const r = await fetch(url, {
      method: 'HEAD',
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'agentstack-health/0.1' },
    });
    return { status: r.status, ms: Date.now() - start };
  } catch (e) {
    return { status: 0, ms: Date.now() - start, error: e.name };
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const tools = await listTools();
  const issues = [];
  console.log(`→ Health-check для ${tools.length} tools…\n`);

  for (const t of tools) {
    const targets = [
      { kind: 'homepage', url: t.homepage },
      t.docs && { kind: 'docs', url: t.docs },
      t.repo && { kind: 'repo', url: t.repo },
      t.affiliate_url && { kind: 'affiliate', url: t.affiliate_url },
    ].filter(Boolean);

    for (const tgt of targets) {
      const r = await ping(tgt.url);
      const ok = r.status >= 200 && r.status < 400;
      const symbol = ok ? '✓' : '✗';
      console.log(`  ${symbol} ${t.name}/${tgt.kind} ${r.status} ${r.ms}ms`);
      if (!ok) {
        issues.push({
          tool: t.name,
          slug: t.slug,
          kind: tgt.kind,
          url: tgt.url,
          status: r.status,
          error: r.error ?? null,
          checked_at: new Date().toISOString().slice(0, 10),
        });
      }
    }
  }

  const state = await readState();
  state.health_issues = issues;
  await writeState(state);
  await recordRun('health', { issues: issues.length });

  console.log(`\n${issues.length ? '⚠ ' + issues.length + ' issue(s)' : '✓ All green'}`);
  if (issues.length) {
    console.log('Detected issues are listed in dashboard → Overview.');
    process.exitCode = 1; // fail CI на broken
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
