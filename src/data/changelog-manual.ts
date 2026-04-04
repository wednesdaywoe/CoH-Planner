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
    date: '2026-04-03',
    items: [
      { message: 'Continued work on implementing changes from Issue 28, Page 3, Panel 2', type: 'fix' },
      { message: 'Fixed powers endurance costs to only divide by activatePeriod when explicitly present', type: 'fix' },
      { message: 'Added Boomerang Slice power to Broadsword', type: 'fix' },
      { message: 'Trying a layout change to see if it helps reduce scrolling. Let me know what you think through the feedback tool or the Discord', type: 'feat' },
      { message: 'Changed the Tooltip toggle to OFF by default. You may need to turn it off manually if it was previously enabled because settings are intended to persist across sessions', type: 'feat' },
      ]
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
