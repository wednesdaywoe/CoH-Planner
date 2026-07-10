/**
 * Push new changelog entries to a Discord channel via an incoming webhook.
 *
 * Reads MANUAL_CHANGELOG_GROUPS from src/data/changelog-manual.ts, compares each
 * entry against a committed state file (.changelog-posted.json), and POSTs only
 * the entries not yet posted as rich Discord embeds. The state file is the shared
 * dedup record across machines (it travels in git history).
 *
 * Usage:
 *   npm run changelog:push              # post new entries, update state file
 *   npm run changelog:push -- --dry-run # preview what would be posted, no POST, no state write
 *   npm run changelog:push -- --init    # record all current entries as "posted" WITHOUT posting (baseline)
 *   npm run changelog:push -- --force-backlog  # post every entry, even historical ones
 *
 * The webhook URL is read from DISCORD_CHANGELOG_WEBHOOK_URL (put it in .env, which is gitignored).
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { MANUAL_CHANGELOG_GROUPS } from '../src/data/changelog-manual.ts';

type ChangelogType = 'feat' | 'fix' | 'update' | 'known-issue';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STATE_PATH = join(REPO_ROOT, '.changelog-posted.json');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const INIT = args.has('--init');
const FORCE_BACKLOG = args.has('--force-backlog');

// Presentation per entry type: emoji line prefix + label + embed accent color.
const TYPE_META: Record<ChangelogType, { emoji: string; label: string; color: number }> = {
  feat: { emoji: '✨', label: 'New', color: 0x3ba55d },
  fix: { emoji: '🐛', label: 'Fix', color: 0xed4245 },
  update: { emoji: '🔧', label: 'Update', color: 0x5865f2 },
  'known-issue': { emoji: '⚠️', label: 'Known issue', color: 0xfaa61a },
};

// Priority order used to pick a single accent color for a mixed-type date group.
const COLOR_PRIORITY: ChangelogType[] = ['feat', 'fix', 'update', 'known-issue'];

interface FlatItem {
  date: string;
  type: ChangelogType;
  message: string;
  hash: string;
}

interface StateEntry {
  hash: string;
  date: string;
  preview: string;
}

interface State {
  version: number;
  posted: StateEntry[];
}

function hashItem(date: string, type: string, message: string): string {
  return createHash('sha256').update(`${date}|${type}|${message}`).digest('hex').slice(0, 12);
}

function flattenEntries(): FlatItem[] {
  const items: FlatItem[] = [];
  for (const group of MANUAL_CHANGELOG_GROUPS) {
    for (const item of group.items) {
      items.push({
        date: group.date,
        type: item.type,
        message: item.message,
        hash: hashItem(group.date, item.type, item.message),
      });
    }
  }
  return items;
}

function loadState(): State {
  if (!existsSync(STATE_PATH)) return { version: 1, posted: [] };
  try {
    const raw = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
    if (raw && Array.isArray(raw.posted)) return { version: raw.version ?? 1, posted: raw.posted };
  } catch {
    /* fall through to empty state */
  }
  return { version: 1, posted: [] };
}

function writeState(state: State): void {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function stateEntry(item: FlatItem): StateEntry {
  return { hash: item.hash, date: item.date, preview: item.message.slice(0, 80) };
}

// Discord limits: <=10 embeds per message, embed description <=4096 chars.
const MAX_EMBEDS_PER_MESSAGE = 10;
const MAX_DESC = 4000; // leave headroom under the 4096 hard cap

function pickColor(types: ChangelogType[]): number {
  for (const t of COLOR_PRIORITY) if (types.includes(t)) return TYPE_META[t].color;
  return 0x5865f2;
}

/** Build one or more embeds for a single date group, splitting if the description overflows. */
function embedsForGroup(date: string, items: FlatItem[]): unknown[] {
  const color = pickColor(items.map((i) => i.type));
  const lines = items.map((i) => {
    const meta = TYPE_META[i.type];
    return `${meta.emoji} **${meta.label}** — ${i.message}`;
  });

  const chunks: string[] = [];
  let current = '';
  for (const line of lines) {
    // A single line longer than the cap gets hard-truncated so the POST never fails.
    const safeLine = line.length > MAX_DESC ? line.slice(0, MAX_DESC - 1) + '…' : line;
    if (current && current.length + safeLine.length + 2 > MAX_DESC) {
      chunks.push(current);
      current = safeLine;
    } else {
      current = current ? `${current}\n\n${safeLine}` : safeLine;
    }
  }
  if (current) chunks.push(current);

  return chunks.map((description, idx) => ({
    title: idx === 0 ? `📋 What's New — ${date}` : `📋 What's New — ${date} (cont.)`,
    description,
    color,
  }));
}

async function postBatch(webhook: string, embeds: unknown[]): Promise<void> {
  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Sidekick Dispatch',
      avatar_url: 'https://coh-sidekick.com/img/favicon-512x512.png',
      embeds,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Discord webhook responded ${res.status} ${res.statusText}: ${body.slice(0, 300)}`);
  }
}

async function main(): Promise<number> {
  const allItems = flattenEntries();
  const state = loadState();
  const postedHashes = new Set(state.posted.map((e) => e.hash));

  // Baseline mode: record everything as posted, send nothing. Used on first install so
  // existing users don't get spammed with the historical changelog.
  if (INIT) {
    const seeded: State = { version: 1, posted: allItems.map(stateEntry) };
    writeState(seeded);
    console.log(`[changelog] Baseline recorded: ${seeded.posted.length} entries marked as already posted. Nothing sent.`);
    return 0;
  }

  // First real run with no state file and no explicit backlog request: baseline silently
  // rather than blast the entire backlog to the channel.
  if (!existsSync(STATE_PATH) && !FORCE_BACKLOG) {
    const seeded: State = { version: 1, posted: allItems.map(stateEntry) };
    if (!DRY_RUN) writeState(seeded);
    console.log(
      `[changelog] No state file found — baselining ${seeded.posted.length} existing entries (nothing posted). ` +
        `Re-run after adding a new entry, or use --force-backlog to post everything.`,
    );
    return 0;
  }

  const newItems = FORCE_BACKLOG ? allItems : allItems.filter((i) => !postedHashes.has(i.hash));

  if (newItems.length === 0) {
    console.log('[changelog] No new entries to post.');
    return 0;
  }

  // Group new items by date, preserving the order they appear in the source file.
  const byDate = new Map<string, FlatItem[]>();
  for (const item of newItems) {
    const bucket = byDate.get(item.date) ?? [];
    bucket.push(item);
    byDate.set(item.date, bucket);
  }

  const embeds: unknown[] = [];
  for (const [date, items] of byDate) embeds.push(...embedsForGroup(date, items));

  console.log(`[changelog] ${newItems.length} new entr${newItems.length === 1 ? 'y' : 'ies'} across ${byDate.size} date group(s).`);

  if (DRY_RUN) {
    for (const [date, items] of byDate) {
      console.log(`\n── ${date} ──`);
      for (const i of items) console.log(`  ${TYPE_META[i.type].emoji} [${i.type}] ${i.message}`);
    }
    console.log('\n[changelog] --dry-run: nothing posted, state file unchanged.');
    return 0;
  }

  const webhook = process.env.DISCORD_CHANGELOG_WEBHOOK_URL;
  if (!webhook) {
    console.warn(
      '[changelog] DISCORD_CHANGELOG_WEBHOOK_URL is not set — skipping post. ' +
        'Add it to .env (see .env.example). No state written.',
    );
    return 0; // Do not fail the commit; just skip.
  }

  // POST in batches of <=10 embeds.
  for (let i = 0; i < embeds.length; i += MAX_EMBEDS_PER_MESSAGE) {
    await postBatch(webhook, embeds.slice(i, i + MAX_EMBEDS_PER_MESSAGE));
  }

  // Only record as posted after a successful send.
  const updated: State = {
    version: 1,
    posted: [...state.posted, ...newItems.map(stateEntry)],
  };
  writeState(updated);
  console.log(`[changelog] Posted ${newItems.length} entr${newItems.length === 1 ? 'y' : 'ies'} to Discord and updated ${STATE_PATH}.`);
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('[changelog] Failed to post changelog:', err instanceof Error ? err.message : err);
    // Exit 0 so a hook-triggered run never disrupts your git workflow.
    process.exit(0);
  });
