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
  // ─── 2026-04-23 (evening) ─────────────────────────────────────────────────
  {
    date: '2026-04-29',
    items: [
      { message: 'Began work on the plumbing to support multiple datasets. Stuff might break',type: "feat"},
      { message: 'Filtered out Heal, PvP, and InherentDamage entries from damage calculations', type: 'fix' },
      { message: 'Snipes (Sniper Blast, Sniper Rifle, Moonbeam, Zapp, etc.) now show their actual damage — extraction was missing the pseudo-pet redirect target. Both charged (Normal) and fast-snipe (Quick) variants are now populated, and the In-Combat toggle swaps in fast-snipe stats', type: 'fix' },
      { message: 'Power info panel now synthesizes a "Damage from Procs" section for non-damaging powers (Infrigidate, Siphon Speed, etc.) that carry damage procs — shows chance, per-cast avg, and DPS for each slotted proc', type: 'feat' },
      { message: 'You can now collapse and expand the dashboard (press D or use the arrow), and L toggles infopanel lock', type: 'feat' },
    ] 
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
