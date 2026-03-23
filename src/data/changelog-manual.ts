/**
 * Manually-maintained changelog for the WelcomeModal "What's New" list.
  * This is separate from the auto-generated changelog (changelog.ts) which is based on git history.
 */

export interface ManualChangelogGroup {
  date: string; // YYYY-MM-DD
  items: {
    message: string;
    type: 'feat' | 'fix' | 'update';
  }[];
}

/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ─── 2026-03-22 ────────────────────────────────────────────────────────────
  {
    date: '2026-03-23',
    items: [
      { message: 'Fixed stale auth session causing 401 error when trying to save to private builds', type: 'feat' },
      { message: 'Practiced Brawlers scale now processes correctly', type: 'fix' },
      { message: 'Added processing for elusivity to debuffResistDefense. All 7 SR powers (Agile, Dodge, Lucky, Evasion, Focused Fighting, Focused Senses, Elude) now contribute', type: 'fix' },
      { message: 'Fixed Practiced Brawlers duplicate KB protection', type: 'fix' },
      { message: 'KB/KU res now stores as scaled effect instead of raw magnitude in protection', type: 'fix' },
      { message: 'Fixed issue with power import deduplication', type: 'fix' },
      { message: 'Fix for imported powers with debuffs being applied incorrectly', type: 'fix' },
      { message: '21 powers now correctly flagged with selfPenalty', type: 'fix' },
    
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
