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

// Absorb + regenBuff pins retired 2026-07-24 (PROD6B-2a), joining the melee ATs'
// 2026-07-19 retirement: the converter now recovers the Sentinel form of the
// MaxHP-fraction Expression (`Max.kHitPoints source> @StdResult *`), so the
// generated layer carries the 30%-of-MaxHP absorb itself, and regenBuff already
// matched the old `{scale:1}` pin. Nothing left to override.
export const overrides: Partial<Power> = {};
