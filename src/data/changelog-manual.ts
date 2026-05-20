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
    date: '2026-05-19',
    items: [
      { message: 'Rebirth powersets + Rebirth pool/epic pools + Rebirth pet-entities + Rebirth incarnates all regenerated with corrected wiring for summons and redirects, some missing icons located', type: 'fix' },
      { message: 'Added a helper to computeAllSlotLevels once and write one slotOrder to capture the respec-mode level as the stored level', type: 'feat' },
      { message: 'Improved build management options: menu items are now New Build, Clear Powers, Clear Slots, Clear Enhancements, and Maximize Enhancements', type: 'feat' },
      { message: 'Added some UI helpers for Firefox users', type: 'fix' },
      { message: 'Extended enemy level to +7 for HC datasets. Defense softcaps should change depending on target level and a new content mode toggle', type: 'feat' },
      { message: 'Just an absolute dumptruck of changes, QOL features, and bug fixes...', type: 'update' },
      { message: 'Ragnarok piece 6 on Rebirth correctly labeled "Chance for Knockdown" (was "Chance for Knockback"); Rebirth extractor now carries a rename map', type: 'fix' },
      { message: 'Brine no longer gives the caster +MaxHP. Foe -MaxHP debuffs are no longer laundered into a self buff by the powerset converter. Marine Affinity regenerated across all 4 ATs.', type: 'fix' },
      { message: 'Enhancement picker remembers the last filter you used per power (slot an ATO into Footstomp once, the picker opens to ATOs next time)', type: 'feat' },
      { message: 'Multi-slot common IOs / HOs / SOs in one go! 😎 In Select Multiple mode, taps stack a count badge, bar fills empty slots in order', type: 'feat' },
      { message: 'Set bonus values display fixes (Luck of the Gambler 3pc now reads +1.125% instead of +1.13% / +1.1%). Dashboard stat breakdowns also use the precise value across all sets, not just LotG.', type: 'fix' },
      { message: 'Accolade rows in the dashboard breakdown now show the % suffix on MaxHP contributions (e.g. "+10%" instead of "+10")', type: 'fix' },
      { message: 'Auto-reload on stale-tab failures. After a deploy, browsers still holding the old shell will reload themselves instead of showing a blank page on the next chunk import', type: 'feat' },
      { message: 'Mids .mbd import should now correctly set power activations. The importer now reads StatInclude (→ active) and VariableValue (→ stack/targets slider) for every power. Fresh imports reproduce Mids\' default totals without manual toggling', type: 'feat' },
      { message: 'Targets-hit / stack slider is now capped at each power\'s declared maxStacks', type: 'fix' },
      { message: 'Recharge totals now use Mids\' Haste convention. The dashboard shows 100% base + bonuses so the number lines up with what Mids displays (Rech 271% instead of +171%)', type: 'update' },
      { message: 'Exemplar Mode no longer persists across page reloads, and a subtle banner reminds you when it\'s on (silently scaling every recharge / damage / defense number was hard to debug when the toggle was forgotten)', type: 'update' },
      { message: 'Proc damage chance now factors in slotted Recharge enhancement. Slotting a Recharge IO will lower a proc\'s chance per cast', type: 'fix' },
      { message: 'Superior ATO 5ppm damage procs now parse and contribute', type: 'fix' },
      { message: 'Lightning Rod and Shield Charge no longer say "Target type: Dead Teammate". That was the teleport mechanic\'s positional target leaking through to the UI.', type: 'fix' },
      { message: 'Lightning Rod and Shield Charge now display per-cast damage in the main Damage block (with the cap-relative meter, three-tier numbers, DPA/DPS/DPE modes) instead of hiding the actual damage behind a collapsed Pet DPS row. Lightning Rod\'s damage now appears at all. Previously the summon entity pointed at a positional anchor with no damage data, so the panel was empty', type: 'update' },
      { message: 'Incarnate proc damage (Hybrid Assault doublehit, Interface DoT procs) is now included in the per-attack damage breakdown. Hybrid Assault Radial Embodiment\'s Energy doublehit and all six Interface Flawless DoTs (Reactive / Cognitive / Spectral / Degenerative / Preemptive × Core/Radial) appear as rows in "Damage from Procs". AoE attacks apply the proc to all targets hit to match what Mids\'', type: 'feat' },
      { message: 'Fixed proc averager calc for power pools and chance for Build Ups', type: 'fix' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
