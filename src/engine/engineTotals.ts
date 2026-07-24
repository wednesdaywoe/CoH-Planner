/**
 * SPIKE5 — output mapper: engine `CalculatedTotals` (snake_case) → beta
 * `CharacterCalculationResult` (camelCase). The mirror of the SPIKE4 input adapter.
 *
 * The engine owns the numbers; this only reshapes keys. Movement lives in the engine's
 * `GlobalBonuses` (not its `CharacterStats`), so the beta `stats.runspeed…` fields are
 * pulled from `bonuses`. A handful of beta fields have no engine source (`threatLevel`,
 * `protRepel`/`protTeleport`, `toggleEndCost`/`enduranceDiscount`/`netEndPerSec`) and are
 * left 0 — none feed the totals dashboard. Breakdown / set-bonus / Rule-of-5 tracking are
 * empty for the totals slice (tooltips/rings are out of scope; SPIKE5).
 */

import type { Build } from '@/types/build';
import type { IncarnateActiveState } from '@/types/incarnate';
import type { CharacterCalculationResult, DashboardStatBreakdown } from '@/utils/calculations';
import { toCharacterStateJson, type AdapterCalcContext } from './characterStateAdapter';
import { recalcJson } from './engine';
import { mapStats, mapGlobal, type EngineTotals } from './engineTotalsMap';

/**
 * Run the build through the engine and reshape to the beta result. Returns `null` when the
 * dataset isn't loaded yet (boot) — the caller substitutes an empty result until then.
 * Any engine `errors` are logged (fail-loud) but do not blank the totals.
 */
export function engineCalculate(build: Build, ctx: AdapterCalcContext): CharacterCalculationResult | null {
  const out = recalcJson(build.serverId, toCharacterStateJson(build, ctx));
  if (out === null) return null;

  const totals = JSON.parse(out) as EngineTotals;
  if (totals.bonuses.errors?.length) {
    for (const e of totals.bonuses.errors) {
      console.error(`[engine] ${e.context}: ${e.detail}`);
    }
  }
  return {
    stats: mapStats(totals.stats, totals.bonuses),
    globalBonuses: mapGlobal(totals.bonuses),
    breakdown: new Map<string, DashboardStatBreakdown>(),
    setBonuses: {},
    bonusTracking: {},
  };
}

/** Re-export for the totals hook's context assembly. */
export type { AdapterCalcContext, IncarnateActiveState };
