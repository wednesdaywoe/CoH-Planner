/**
 * Elude — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. The generated layer is now sourced from the live HC
 * binary (exported_powers/), so the legacy numeric pins that used to live
 * here were stale CoD2 values and have been retired (2026-06 override audit).
 * Any remaining entries are display fixes or planner-only enrichments the
 * parser doesn't emit yet — prefer fixing the parser/converter over re-adding
 * an override. See GAME-DATA-PRINCIPLES.md §13 and src/data/README.md.
 *
 * Retired 2026-07-18 (ATOM4 finding): the `elusivity.all` entry hand-copied this
 * power's Base_Defense@Resistance DDR value into a second bag slot, which the
 * calc sums into debuffResistDefense — double-counting defense-debuff-resistance.
 * The binary grants it ONCE (one Base_Defense@Resistance template → the
 * `debuffResistance.defense` bag / `Defense aspect=Res` atom); real elusivity is a
 * distinct PvP-only stat (the aspect=Strength `*_Elusivity` atoms). Do not re-add.
 * No overrides remain for this power.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {};
