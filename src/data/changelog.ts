/**
 * Auto-generated changelog from git history.
 * Data is injected by Vite at build time via __CHANGELOG_DATA__.
 * Overrides in changelog-overrides.ts can customize or hide entries.
 */

import type { TrackerItem } from './tracker';
import { CHANGELOG_OVERRIDES } from './changelog-overrides';

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

const TYPE_TO_STATUS: Record<string, TrackerItem['status']> = {
  feat: 'new',
  fix: 'fixed',
  update: 'in-progress',
};

/** Get changelog entries from the most recent date as TrackerItems for WelcomeModal */
export function getRecentChanges(): TrackerItem[] {
  if (CHANGELOG_ENTRIES.length === 0) return [];
  const latestDate = CHANGELOG_ENTRIES[0].date;
  return CHANGELOG_ENTRIES
    .filter(e => e.date === latestDate)
    .map(entry => ({
      text: entry.message,
      status: TYPE_TO_STATUS[entry.type] ?? 'in-progress',
    }));
}

/** Group all changelog entries by date */
export function getChangelogByDate(): Map<string, ChangelogEntry[]> {
  const grouped = new Map<string, ChangelogEntry[]>();
  for (const entry of CHANGELOG_ENTRIES) {
    const existing = grouped.get(entry.date);
    if (existing) {
      existing.push(entry);
    } else {
      grouped.set(entry.date, [entry]);
    }
  }
  return grouped;
}
