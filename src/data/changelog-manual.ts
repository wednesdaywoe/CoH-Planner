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
  // ─── 2026-03-18 ────────────────────────────────────────────────────────────
  {
    date: '2026-03-20',
    items: [
      { message: 'Added Incarnate power effects to Perma Tracker calculations', type: 'fix' },
      { message: 'Fixed issue with missing recoveryBuff', type: 'fix' },
      { message: 'Updated endurance recovery calculations to reflect max endurance scaling', type: 'fix' },
      { message: 'Corrected active power effects to include self-debuffs', type: 'fix' },
      { message: 'Fixed buildStore to include branch power definitions so VEAT powers can be constructed correctly', type: 'fix' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
