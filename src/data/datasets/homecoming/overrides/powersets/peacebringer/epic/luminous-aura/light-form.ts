/**
 * Light Form — OVERRIDES LAYER
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
  "description": "When you activate Light Form, you become pure Kheldian energy and are extremely resistant to most damage. You are also partially protected from some Disorient, Immobilization, Hold, Sleep, Knockback and Repel effects. Endurance recovery is also increased. Light Form costs little Endurance to activate, but when it wears off you are left exhausted, and drained of Hit Points and Endurance.  Recharge: Very Long."
};
