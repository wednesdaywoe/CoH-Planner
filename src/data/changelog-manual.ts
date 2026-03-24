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
  // ─── 2026-03-24 ────────────────────────────────────────────────────────────
  {
    date: '2026-03-24',
    items: [
      { message: 'Mobile: Suppressed hover tooltip on touch devices during power selection — use the info button instead', type: 'fix' },
      { message: 'Mobile: Larger touch targets for info, compare, and remove buttons on selected powers', type: 'fix' },
      { message: 'Mobile: Enhancement picker now shows piece names and aspects as a list instead of icon-only grid', type: 'feat' },
      { message: 'Toggle endurance costs: The conversion script was not including activate_period from the raw data. Every toggle power defaulted to 0.5s tick interval. This caused endurance costs to be up to 4x too high', type: 'fix' },
      { message: 'Large data regeneration: 348 powersets regenerated. 74 powers now have mezResistance data that was previously missing. Status Resistance extracted for all types', type: 'fix' },
      { message: 'Created a new power-key utility to solve a slotOrder issue where powers share an identical ID across categories. Example: Energize and Superior Conditioning sharing "Conserve_Power"', type: 'fix' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
