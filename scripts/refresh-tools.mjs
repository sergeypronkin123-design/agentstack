#!/usr/bin/env node
/**
 * Auto-refresh script — обновляет факты по инструментам из публичных API.
 *
 * Запуск:
 *   node scripts/refresh-tools.mjs           # все инструменты
 *   node scripts/refresh-tools.mjs cline     # один инструмент
 *
 * Что обновляет:
 * 1. Звёзды и последний релиз для OSS-тулов из GitHub API
 * 2. Дату last_verified
 *
 * Что НЕ обновляет автоматически (требует ручной правки):
 * - Pricing
 * - Features list
 * - Pros/cons
 * (потому что эти вещи требуют качественного review, не парсинга)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOOLS_DIR = path.join(__dirname, '..', 'src', 'content', 'tools');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // optional but raises rate limit
const headers = {
  Accept: 'application/vnd.github+json',
  ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
};

async function fetchRepoInfo(repoUrl) {
  // https://github.com/owner/repo → owner/repo
  const m = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  const fullName = `${m[1]}/${m[2].replace(/\.git$/, '')}`;
  const res = await fetch(`https://api.github.com/repos/${fullName}`, { headers });
  if (!res.ok) {
    console.warn(`  ⚠ GitHub API ${res.status} for ${fullName}`);
    return null;
  }
  const data = await res.json();
  return {
    stars: data.stargazers_count,
    last_release: data.pushed_at?.slice(0, 10),
    license: data.license?.spdx_id ?? null,
  };
}

async function processTool(filename) {
  const filepath = path.join(TOOLS_DIR, filename);
  const raw = await fs.readFile(filepath, 'utf-8');
  const data = JSON.parse(raw);
  console.log(`→ ${data.name}`);

  if (data.repo) {
    const info = await fetchRepoInfo(data.repo);
    if (info) {
      data.github_stars = info.stars;
      data.github_last_push = info.last_release;
      console.log(`  ✓ ${info.stars.toLocaleString()} stars · last push ${info.last_release}`);
    }
  }

  data.last_verified = new Date().toISOString().slice(0, 10);

  await fs.writeFile(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

async function main() {
  const filter = process.argv[2];
  const files = await fs.readdir(TOOLS_DIR);
  const targets = files.filter((f) => f.endsWith('.json') && (!filter || f.startsWith(filter)));

  if (!targets.length) {
    console.error('No tool files matched.');
    process.exit(1);
  }

  console.log(`Refreshing ${targets.length} tool(s)…\n`);
  for (const file of targets) {
    try {
      await processTool(file);
    } catch (e) {
      console.error(`  ✗ ${file}:`, e.message);
    }
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
