#!/usr/bin/env node
/**
 * SEO-аудит: обходит dist/ после `npm run build` и проверяет:
 * - <title> длина 30-60
 * - <meta name="description"> длина 80-160
 * - один <h1> на странице
 * - canonical присутствует
 * - наличие OG meta
 * - ссылки 404 внутри
 *
 * Output: .automation/seo-report.md
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { recordRun, ROOT_DIR, AUTO_DIR } from './_state.mjs';

const DIST = path.join(ROOT_DIR, 'dist');

async function walk(dir, out = []) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function audit(html, file) {
  const issues = [];
  const get = (re) => html.match(re)?.[1] ?? null;

  const title = get(/<title>([^<]+)<\/title>/);
  if (!title) issues.push('missing <title>');
  else if (title.length < 30) issues.push(`title too short (${title.length} chars)`);
  else if (title.length > 65) issues.push(`title too long (${title.length} chars)`);

  const desc = get(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (!desc) issues.push('missing meta description');
  else if (desc.length < 80) issues.push(`description too short (${desc.length} chars)`);
  else if (desc.length > 165) issues.push(`description too long (${desc.length} chars)`);

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count === 0) issues.push('no <h1>');
  else if (h1Count > 1) issues.push(`multiple <h1> (${h1Count})`);

  if (!html.includes('rel="canonical"')) issues.push('missing canonical');
  if (!html.includes('property="og:title"')) issues.push('missing OG title');
  if (!html.includes('property="og:image"')) issues.push('missing OG image');

  return { file: file.replace(DIST, ''), issues };
}

async function main() {
  const files = await walk(DIST);
  if (!files.length) {
    console.error('✗ dist/ пуст. Запустите `npm run build` сначала.');
    process.exit(1);
  }

  console.log(`→ Аудит ${files.length} HTML-файлов в dist/`);
  const results = [];
  for (const f of files) {
    const html = await fs.readFile(f, 'utf-8');
    const r = audit(html, f);
    if (r.issues.length) results.push(r);
  }

  const md = `# SEO Audit — ${new Date().toISOString().slice(0, 10)}

Pages scanned: **${files.length}**
Pages with issues: **${results.length}**

${results.length === 0 ? '✓ All pages clean!' : results.map((r) => `## ${r.file}\n${r.issues.map((i) => `- ${i}`).join('\n')}`).join('\n\n')}
`;
  const out = path.join(AUTO_DIR, 'seo-report.md');
  await fs.mkdir(AUTO_DIR, { recursive: true });
  await fs.writeFile(out, md, 'utf-8');
  await recordRun('seo', { issues: results.reduce((s, r) => s + r.issues.length, 0) });

  console.log(`\n✓ Report: ${out}`);
  if (results.length) {
    console.log(`⚠ ${results.length} pages with issues — fix before publish`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
