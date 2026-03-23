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
      { message: 'Fixed issue with power import deduplication', type: 'fix' },
      { message: 'Fix for imported powers with debuffs being applied incorrectly', type: 'fix' },
      { message: '21 powers now correctly flagged with selfPenalty', type: 'fix' },
      { message: ' fix: Display names ("Combat Jumping") being compared \
         against internal names ("Combat_Jumping"). This affected all \
         rank 3+ pool powers that have multi-word names.', type: 'fix' },
      { message: 'Rage crash debuff excluded from DMG stat', type: 'fix' },
      { message: 'Contributing sources now display for Movement and Debuff Resistance', type: 'fix' },
      { message: 'Added missing defense debuff resistance to power data', type: 'fix' },
      { message: 'Updated internal names for various powers across Arachnos Soldier, Arachnos Widow, and Peacebringer powersets ', type: 'fix' },
      { message: 'Implemented fallback logic in getIOSet function to support backward compatibility for renamed IO set', type: 'fix' },
      { message: 'Added migration logic to sync internal name changes during build synchronization', type: 'fix' },
      { message: 'Enhanced import functionality to skip non-slottable granted sub-powers during data import', type: 'fix' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
