/**
 * Stygian Return — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. The generated layer is now sourced from the live HC
 * binary (exported_powers/), so the legacy numeric pins that used to live
 * here were stale CoD2 values and have been retired (2026-06 override audit).
 * Any remaining entries are display fixes or planner-only enrichments the
 * parser doesn't emit yet — prefer fixing the parser/converter over re-adding
 * an override. See GAME-DATA-PRINCIPLES.md §13 and src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "Should you fall in battle, your Stygian Return can drain the life force of all foes around you to bring yourself back from the brink of death. The more foes nearby, the more Ht Points and Endurance are restored to you. Stygian Return will actually leave you invulnerable for a brief time, and protected from XP Debt for 90 seconds. There must be at least one foe nearby to fuel the Transfer and revive yourself.  Damage: Light. Recharge: Very Long."
};
