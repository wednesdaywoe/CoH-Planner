/**
 * Auto-generated changelog from git history.
 * Data is injected by Vite at build time via __CHANGELOG_DATA__.
 * Overrides in changelog-overrides.ts can customize or hide entries.
 */

import { CHANGELOG_OVERRIDES } from './changelog-overrides';
import { MANUAL_CHANGELOG } from './changelog-manual';

interface ChangeItem {
  text: string;
  status: 'known-bug' | 'fixed' | 'planned' | 'in-progress' | 'new';
}

declare const __CHANGELOG_DATA__: ChangelogEntry[];

export interface ChangelogEntry {
  hash: string;
  date: string;   // YYYY-MM-DD
  message: string;
  type: 'feat' | 'fix' | 'update';
}

/** Apply overrides: custom messages, type changes, and hidden entries */
function applyOverrides(entries: ChangelogEntry[]): ChangelogEntry[] {
  return entries
    .filter(e => !CHANGELOG_OVERRIDES[e.hash]?.hide)
    .map(e => {
      const override = CHANGELOG_OVERRIDES[e.hash];
      if (!override) return e;
      return {
        ...e,
        ...(override.message && { message: override.message }),
        ...(override.type && { type: override.type }),
      };
    });
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = applyOverrides(__CHANGELOG_DATA__);

/** Manual entries converted to ChangelogEntry format (no hash) */
const MANUAL_ENTRIES: ChangelogEntry[] = MANUAL_CHANGELOG.map(e => ({
  hash: '',
  date: e.date,
  message: e.message,
  type: e.type,
}));

/**
 * All entries merged: git-log + manual, deduplicated by (date+message).
 * Sorted newest-first. Git-log entries take precedence over manual entries
 * with identical messages on the same date.
 */
function buildAllEntries(): ChangelogEntry[] {
  const seen = new Set<string>();
  const all: ChangelogEntry[] = [];
  for (const entry of [...CHANGELOG_ENTRIES, ...MANUAL_ENTRIES]) {
    const key = `${entry.date}|${entry.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      all.push(entry);
    }
  }
  // Sort by date descending, preserving insertion order within a date
  return all.sort((a, b) => b.date.localeCompare(a.date));
}

const ALL_ENTRIES = buildAllEntries();

const TYPE_TO_STATUS: Record<string, ChangeItem['status']> = {
  feat: 'new',
  fix: 'fixed',
  update: 'in-progress',
};

/** Get entries for the most recent date from the manual changelog as ChangeItems.
 *  Used by WelcomeModal. Only shows manually curated entries. */
export function getRecentChanges(): { date: string; items: ChangeItem[] } {
  if (MANUAL_ENTRIES.length === 0) return { date: '', items: [] };
  const targetDate = MANUAL_ENTRIES[0].date;
  const entries = MANUAL_ENTRIES.filter(e => e.date === targetDate);
  return {
    date: targetDate,
    items: entries.map(entry => ({
      text: entry.message,
      status: TYPE_TO_STATUS[entry.type] ?? 'in-progress',
    })),
  };
}

/** Group all entries (git-log + manual) by date, newest date first. */
export function getChangelogByDate(): Map<string, ChangelogEntry[]> {
  const grouped = new Map<string, ChangelogEntry[]>();
  for (const entry of ALL_ENTRIES) {
    const existing = grouped.get(entry.date);
    if (existing) {
      existing.push(entry);
    } else {
      grouped.set(entry.date, [entry]);
    }
  }
  return grouped;
}
