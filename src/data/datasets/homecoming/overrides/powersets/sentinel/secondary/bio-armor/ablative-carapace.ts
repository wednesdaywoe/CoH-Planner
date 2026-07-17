/**
 * Ablative Carapace — OVERRIDES LAYER
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

// Absorb + regenBuff pins retired 2026-07-17: the generated layer now sources
// the correct 30%-of-MaxHP absorb (`maxHPFraction: 0.3`, +Absorb strength) from
// the live bin's Expression, and regenBuff already matches the old {scale:1}
// pin. The stale `absorb: {scale:1}` here read as 100% of MaxHP (Melee_Ones ⇒
// scale is a MaxHP fraction), the "very large absorb" bug. Nothing left to override.
export const overrides: Partial<Power> = {};
