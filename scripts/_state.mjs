// Утилиты для чтения/записи .automation/state.json
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const STATE_DIR = path.join(ROOT, '.automation');
const STATE_PATH = path.join(STATE_DIR, 'state.json');

export const ROOT_DIR = ROOT;
export const AUTO_DIR = STATE_DIR;

const DEFAULT_STATE = {
  last_runs: {},
  discovered_tools: [],
  pricing_changes: [],
  health_issues: [],
  pipeline: { drafts: [], queued_ideas: [] },
};

export async function readState() {
  try {
    return JSON.parse(await fs.readFile(STATE_PATH, 'utf-8'));
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export async function writeState(state) {
  await fs.mkdir(STATE_DIR, { recursive: true });
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf-8');
}

export async function recordRun(taskId, extra = {}) {
  const s = await readState();
  s.last_runs ??= {};
  s.last_runs[taskId] = { iso: new Date().toISOString(), ...extra };
  await writeState(s);
}

export async function listTools() {
  const dir = path.join(ROOT, 'src/content/tools');
  const files = await fs.readdir(dir);
  const out = [];
  for (const f of files.filter((n) => n.endsWith('.json'))) {
    out.push(JSON.parse(await fs.readFile(path.join(dir, f), 'utf-8')));
  }
  return out;
}
