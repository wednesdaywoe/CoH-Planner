/**
 * Manually-maintained changelog entries.
 *
 * These supplement the auto-generated git log history.
 * Use this for historical dates whose commit messages aren't user-friendly,
 * or to add notes about multi-commit sessions.
 *
 * ADD NEW ENTRIES AT THE TOP (newest date first).
 * Multiple entries with the same date are grouped together in the Full Changelog.
 * The WelcomeModal shows whichever date group is most recent (manual or git).
 */

export interface ManualEntry {
  date: string; // YYYY-MM-DD
  message: string;
  type: 'feat' | 'fix' | 'update';
}

export const MANUAL_CHANGELOG: ManualEntry[] = [
  // ─── 2026-03-16 ────────────────────────────────────────────────────────────
  { date: '2026-03-16', message: 'Proc settings now include Damage Procs; header "Proc" toggle acts as master on/off for all proc categories', type: 'feat' },
  { date: '2026-03-16', message: 'ArcanaTime moved to Build Settings; Proc Settings button paired with Proc toggle; In-Combat toggle moved to main bar', type: 'update' },
  { date: '2026-03-16', message: 'Set Bonus Finder now shows rarity badges (PvP, Purple, ATO, Event) and flags PvP-only bonuses with ⚔', type: 'feat' },
  { date: '2026-03-16', message: 'Importing builds with Single/Dual Origin enhancements (SOs/DOs) no longer generates warnings', type: 'fix' },

  // ─── 2026-03-12 ────────────────────────────────────────────────────────────
  { date: '2026-03-12', message: 'Chrono Shift now shows a toggle to display its buff effects on the rest of the build', type: 'fix' },
  { date: '2026-03-12', message: 'Mez effects (Stun, Knockback, etc.) now show enhanced duration/distance values when slotted', type: 'fix' },
  { date: '2026-03-12', message: 'Importing builds now correctly resolves archetype-specific epic pools (e.g., Stalker Psionic Mastery)', type: 'fix' },
  { date: '2026-03-12', message: 'Login popover no longer clips off screen on desktop', type: 'fix' },
  { date: '2026-03-12', message: 'Added In-Combat toggle and power suppression; sniper attacks now use Quick Form cast time while in combat', type: 'feat' },
  { date: '2026-03-12', message: 'Fixed powerSet hydration bug (was storing display name instead of ID, broke power lookup)', type: 'fix' },
  { date: '2026-03-12', message: 'New build button now hard-resets all build-dependent UI state', type: 'fix' },
  { date: '2026-03-12', message: 'Domination recharge and duration now display correctly in archetype inherent', type: 'fix' },
];
