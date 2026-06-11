/**
 * Bright Nova Detonation — OVERRIDES LAYER
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
  "description": "You hurl a large blast of Kheldian light energy that violently explodes on impact, damaging all foes near the target, reducing their defense. Some affected targets may get knocked back. This power is only available while in Bright Nova Form.  Damage: Light. Recharge: Slow.",
  "targetType": "Foe (Alive)",
  "requires": "Bright Nova"
};
