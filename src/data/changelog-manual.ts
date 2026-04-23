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
  // ─── 2026-04-23 ────────────────────────────────────────────────────────────
  {
    date: '2026-04-23',
    items: [
      { message: 'Fix for Chain-area attacks (Focused Burst, Chain Lightning, Tesla Cage, Chain Induction, etc.) only accepting Knockback/Universal Damage sets — they now also accept Ranged/Melee Damage and Targeted AoE sets as appropriate', type: 'fix' },
      { message: 'Fix for pool power prerequisites not counting other pool picks — e.g. Tough now correctly unlocks after taking just Kick or Boxing', type: 'fix' },
      { message: 'New audit tool (scripts/audit-allowed-set-categories.cjs) — flags powers whose allowedSetCategories drift from inference or fail sanity invariants; used to catch bugs like the Chain-area one above', type: 'update' },
      { message: 'Fix for Mastermind primary/secondary attack powers (Pistols, Dual Wield, Snap Shot, Pulse Rifle Blast, etc.) missing the Mastermind Archetype Sets category — Command of the Mastermind now slots correctly', type: 'fix' },
      { message: 'Fix for Street Justice Low Kick missing the Accurate Defense Debuff set category, and Chain Induction being incorrectly flagged as Melee AoE instead of Melee Damage, and Omega Maneuver (Crab Spider) missing Threat Duration, and Havoc Punch (Electric Assault) missing Dominator Archetype Sets', type: 'fix' },
    ]
  },

  // ─── 2026-03-24 ────────────────────────────────────────────────────────────
  {
    date: '2026-04-23',
    items: [
      { message: 'Putting out more fires... 🤕', type: 'fix' },
      { message: 'Fix for some powers appearing in the wrong order, also fix for a number of travel powers and their allowedSetCategories', type: 'fix' },
      { message: 'Fix for power pool prerequisites. More collateral damage from migration', type: 'fix' },
      { message: 'Fix for power sorting going wonky due to the dataset migration', type: 'fix' },
      { message: 'Huge milestone for Sidekick: migration to new self-sourced dataset is complete. I expect some growing pains, but it will be worth it for keeping SK current with CoH development.', type: 'update' },
      { message: 'Audit of tooltip hints across the app to ensure everthing has a helpful explaination of what it does', type: 'update' },
      { message: 'New tooltip comparision mode: hover over a power or enhancment and hold shift to keep its info displayed', type: 'feat' },
      { message: 'Audit of Help System to bring it up to date. Did you know there was a searchable Help system??? There is a searchable Help System! Look for the widget at the bottom', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
