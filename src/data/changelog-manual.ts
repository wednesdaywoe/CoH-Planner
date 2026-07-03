/**
 * Manually-maintained changelog for the WelcomeModal "What's New" list.
  * This is separate from the auto-generated changelog (changelog.ts) which is based on git history.
 */

export interface ManualChangelogGroup {
  date: string; // YYYY-MM-DD
  items: {
    message: string;
    type: 'feat' | 'fix' | 'update' | 'known-issue';
  }[];
}

/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update' | 'known-issue';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ───────────────────────────────────────────────────────────────────────
  {
    date: '2026-07-03',

    items: [
      { message: 'Added a recharge buff/debuff simulation to the attack chain builder', type: 'feat'},
      { message: 'Large audit and update to Incarnate powers: a lot of effects were being silently dropped before reaching the display layers, others were attributed incorrectly', type: 'fix'},
      { message: 'Fix for the stacking detector, it only saw stack-type and not RefreshToCount', type: 'fix'},
      { message: 'The planner will now pre-fill metadata fields the moment a build is selected for update', type: 'feat'},
      { message: 'Added Export build image feature. Menu > Export as Image, choose the amount of detail you want to include', type: 'feat'},
      { message: 'Proc-DPS section, incarnate procs, and the DamageBlock "+proc" annotation should all agree now. If they don\'t, that\'s a paddlin\'.', type: 'fix'},
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
