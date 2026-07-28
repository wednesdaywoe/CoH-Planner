/**
 * SPIKE5 — output mapper: engine `CalculatedTotals` (snake_case) → beta
 * `CharacterCalculationResult` (camelCase). The mirror of the SPIKE4 input adapter.
 *
 * The engine owns the numbers; this only reshapes keys. Movement lives in the engine's
 * `GlobalBonuses` (not its `CharacterStats`), so the beta `stats.runspeed…` fields are
 * pulled from `bonuses`. A handful of beta fields have no engine source (`threatLevel`,
 * `protRepel`/`protTeleport`, `toggleEndCost`/`enduranceDiscount`/`netEndPerSec`) and are
 * left 0 — none feed the totals dashboard. `bonusTracking` and `breakdown` are populated from
 * the engine's own tracking (PROD2): set-bonus Rule-of-5 provenance (the `(x/5)` counters,
 * capped rings/banner, per-stat tooltip set-bonus rows) plus the always-on proc `type:'proc'`
 * sources (LotG +Rech etc.). Active-power / inherent rows, and stealth-radius proc rows, are
 * not here yet (PROD6). `setBonuses` (AggregatedBonuses) stays empty — no UI reads it.
 */

import type { Build } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import type { IncarnateActiveState } from '@/types/incarnate';
import type { CharacterCalculationResult } from '@/utils/calculations';
import { toCharacterStateJson, type AdapterCalcContext } from './characterStateAdapter';
import { recalcJson } from './engine';
import {
  mapStats,
  mapGlobal,
  mapBonusTracking,
  mapSetBonusBreakdown,
  addProcBreakdown,
  addBuffPetBreakdown,
  addMovementBreakdown,
  mapPowerProjection,
  type EngineTotals,
  type PowerProjection,
  type PowerNameResolver,
} from './engineTotalsMap';

/**
 * A resolver from an engine source ref back to the slotting power's DISPLAY name — the engine's
 * `SelectedPower` carries only `internal_name`/`power_set`, but the over-cap ring matches the
 * PowerRow's display name, so we rebuild it from the same build the engine read. Keyed by
 * `powerSet\0internalName` (internal names are not unique across sets). Unresolved refs fall
 * back to the internal name rather than dropping the source.
 */
function powerNameResolver(build: Build): PowerNameResolver {
  const byKey = new Map<string, string>();
  const add = (powers: SelectedPower[] | undefined) => {
    for (const p of powers ?? []) byKey.set(`${p.powerSet}\0${p.internalName}`, p.name);
  };
  add(build.primary.powers);
  add(build.secondary.powers);
  for (const pool of build.pools) add(pool.powers);
  add(build.epicPool?.powers);
  add(build.inherents);
  return (ref) =>
    byKey.get(`${ref.power_set}\0${ref.power_internal_name}`) ?? ref.power_internal_name;
}

/**
 * Run the build through the engine and reshape to the beta result. Returns `null` when the
 * dataset isn't loaded yet (boot) — the caller substitutes an empty result until then.
 * Any engine `errors` are logged (fail-loud) but do not blank the totals.
 */
export function engineCalculate(build: Build, ctx: AdapterCalcContext): CharacterCalculationResult | null {
  const stateJson = toCharacterStateJson(build, ctx);
  const out = recalcJson(build.serverId, stateJson);
  if (out === null) return null;

  const totals = JSON.parse(out) as EngineTotals;
  if (totals.bonuses.errors?.length) {
    for (const e of totals.bonuses.errors) {
      console.error(`[engine] ${e.context}: ${e.detail}`);
    }
  }
  const resolveName = powerNameResolver(build);
  const breakdown = mapSetBonusBreakdown(totals.set_bonus_tracking, resolveName);
  addProcBreakdown(breakdown, totals.proc_breakdown, resolveName);
  addBuffPetBreakdown(breakdown, totals.buff_pet_breakdown, resolveName);
  addMovementBreakdown(breakdown, totals.movement_breakdown);
  return {
    stats: mapStats(totals.stats, totals.bonuses),
    globalBonuses: mapGlobal(totals.bonuses, totals.stats),
    breakdown,
    setBonuses: {},
    bonusTracking: mapBonusTracking(totals.set_bonus_tracking, resolveName),
    powerProjection: mapPowerProjection(totals.power_projection),
    engineStateJson: stateJson,
  };
}

/** Re-export for the totals hook's context assembly. */
export type { AdapterCalcContext, IncarnateActiveState };
export type { PowerProjection };
