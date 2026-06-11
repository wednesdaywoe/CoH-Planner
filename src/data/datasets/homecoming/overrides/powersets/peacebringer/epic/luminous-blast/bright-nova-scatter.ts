/**
 * Bright Nova Scatter — OVERRIDES LAYER
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
  "description": "Bright Nova Scatter sends bolts of Kheldian light energy to multiple targets at once within a cone area in front of the caster. Bright Nova Scatter deals moderate energy damage to each affected target and reduces their defense. This power is only available while in Bright Nova Form.  Damage: Light. Recharge: Slow.",
  "targetType": "Foe (Alive)",
  "requires": "Bright Nova"
};
