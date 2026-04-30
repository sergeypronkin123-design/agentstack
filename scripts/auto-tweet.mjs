#!/usr/bin/env node
/**
 * Auto-tweet новых рецептов через Twitter/X API v2.
 *
 * Требует env:
 *   X_BEARER_TOKEN  — bearer (только read, для проверки)
 *   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET — OAuth1 для post
 *
 * Без ключей — DRY-run: печатает что бы запостило.
 *
 * Запуск:
 *   node scripts/auto-tweet.mjs                    # все за последние 7д
 *   node scripts/auto-tweet.mjs <recipe-slug>      # конкретный
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { recordRun, ROOT_DIR } from './_state.mjs';

const SITE = process.env.PUBLIC_SITE_URL ?? 'https://agentstack.dev';

async function listRecentRecipes(days = 7) {
  const dir = path.join(ROOT_DIR, 'src/content/recipes');
  const files = await fs.readdir(dir);
  const cutoff = Date.now() - days * 86400000;
  const out = [];
  for (const f of files.filter((n) => n.endsWith('.mdx') || n.endsWith('.md'))) {
    const text = await fs.readFile(path.join(dir, f), 'utf-8');
    const m = text.match(/updated:\s*"(\d{4}-\d{2}-\d{2})"/);
    if (!m) continue;
    if (new Date(m[1]).getTime() < cutoff) continue;
    out.push({
      slug: f.replace(/\.(mdx|md)$/, ''),
      title: text.match(/title:\s*"([^"]+)"/)?.[1] ?? '',
      description: text.match(/description:\s*"([^"]+)"/)?.[1] ?? '',
      tags: (text.match(/tags:\s*\[(.*?)\]/)?.[1] ?? '').split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean),
    });
  }
  return out;
}

function buildTweet(recipe) {
  const url = `${SITE}/recipes/${recipe.slug}`;
  const tags = recipe.tags.slice(0, 3).map((t) => `#${t.replace(/[^a-zA-Z]/g, '')}`).join(' ');
  // Twitter ~280 chars; URL counts as 23
  let body = `${recipe.title}\n\n${recipe.description}`;
  if (body.length > 200) body = body.slice(0, 197) + '…';
  return `${body}\n\n${url}\n${tags}`.trim();
}

async function postTweet(text) {
  const haveOAuth =
    process.env.X_API_KEY && process.env.X_API_SECRET &&
    process.env.X_ACCESS_TOKEN && process.env.X_ACCESS_SECRET;
  if (!haveOAuth) {
    console.log('— DRY-RUN — нет X_* env-переменных. Текст:');
    console.log('---');
    console.log(text);
    console.log('---');
    return { dryRun: true };
  }
  // Реальная имплементация требует OAuth1 подписи. Используем typowy
  // стандартный паттерн: либо `twitter-api-v2` пакет, либо ручной HMAC-SHA1.
  // Для скаффолда — оставляем comment-stub. На production — поставьте:
  //   npm i twitter-api-v2
  // и раскомментируйте код ниже.
  /*
  const { TwitterApi } = await import('twitter-api-v2');
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
  });
  const res = await client.v2.tweet(text);
  return { id: res.data.id };
  */
  console.log('⚠ OAuth keys present but twitter-api-v2 пакет не установлен. Установите:');
  console.log('  npm i twitter-api-v2');
  console.log('Затем раскомментируйте блок в scripts/auto-tweet.mjs');
  return { skipped: true };
}

async function main() {
  const arg = process.argv[2];
  let recipes;
  if (arg) {
    recipes = [...(await listRecentRecipes(365))].filter((r) => r.slug === arg);
    if (!recipes.length) {
      console.error(`Recipe not found: ${arg}`);
      process.exit(1);
    }
  } else {
    recipes = await listRecentRecipes(7);
  }

  if (!recipes.length) {
    console.log('Нет рецептов для постинга за последние 7 дней.');
    return;
  }

  for (const r of recipes) {
    const text = buildTweet(r);
    console.log(`\n→ ${r.title}`);
    const res = await postTweet(text);
    if (res?.id) console.log(`  ✓ posted: https://x.com/i/status/${res.id}`);
  }

  await recordRun('tweet', { count: recipes.length });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
