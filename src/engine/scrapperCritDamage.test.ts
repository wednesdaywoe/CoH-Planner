/**
 * Scrapper crit fidelity — the "w/ Crit" surfaces read the power's OWN crit rows,
 * engine-resolved against a named target rank, not an archetype constant.
 *
 * The regression this locks (reported 2026-08-09): the InfoPanel multiplied final damage by
 * a flat ×1.10 ("10% chance of double damage") for every Scrapper attack, so One Thousand
 * Cuts showed +14.77 "crit" against an authored crit component of 138.26 (scale 2.21 on
 * `Melee_InherentDamage` — City of Data's own listing), and Sweeping Strike's 15% roll read
 * as 10%. The export states each power's crit as its own rows — scale, table, probability,
 * rank fork — and the engine resolves them; these tests drive the exact composition the
 * `usePowerDamageVsRank` hook runs (rank token from `targetRanksJson`, target injected into
 * the CharacterState, `projectPowerJson`, `mapOnePowerProjection`) and pin the numbers.
 *
 * Dual Blades is the fixture set because its crits are NOT uniform doubles — the shape the
 * flat multiplier could never state.
 */

import { describe, it, expect } from 'vitest';
import { engineArtifactsPresent, projectPowerJson, targetRanksJson } from './engine.node';
import { mapOnePowerProjection, type EnginePowerProjection, type PowerDamage } from './engineTotalsMap';
import {
  critBranchSummary,
  critComponents,
  VS_HIGHER_RANK_SEGMENT,
  VS_MINION_RANK_SEGMENT,
} from '@/utils/calculations/power-at-mechanics';

const suite = engineArtifactsPresent('homecoming') ? describe : describe.skip;
if (!engineArtifactsPresent('homecoming')) {
  console.warn('[scrapperCritDamage] engine artifacts missing — run `npm run build:engine`; suite skipped.');
}

/** A blank level-50 Scrapper, targeting `targetClass` — the same override the hook applies
 *  to the adapter's CharacterState (only the target identity differs from the totals run). */
const stateJson = (targetClass: string) =>
  JSON.stringify({
    name: 'crit-fidelity',
    dataset: 'homecoming',
    archetype: { id: 'scrapper', name: 'Scrapper' },
    level: 50,
    primary: { id: 'scrapper/dual-blades', name: 'Dual Blades', powers: [] },
    secondary: { id: 'scrapper/super-reflexes', name: 'Super Reflexes', powers: [] },
    pools: [],
    epic_pool: null,
    inherents: [],
    accolades: [],
    incarnates: { alpha: null, judgement: null, interface: null, destiny: null, lore: null, hybrid: null, genesis: null },
    slot_order: [],
    combat: {
      in_combat: false,
      enemy_level_offset: 0,
      fury_level: 0,
      vigilance_team_size: 1,
      target_class: targetClass,
      target_is_player: false,
    },
  });

function rankToken(segment: string): string {
  const ranks = JSON.parse(targetRanksJson('homecoming')!) as { segment: string; classes: string[] }[];
  const rank = ranks.find((r) => r.segment === segment);
  if (!rank) throw new Error(`homecoming gates name no '${segment}' rank`);
  return rank.classes[0];
}

function damageVs(internalName: string, segment: string): PowerDamage {
  const json = projectPowerJson('homecoming', stateJson(rankToken(segment)), 'scrapper/dual-blades', internalName);
  const projected = JSON.parse(json!) as EnginePowerProjection | null;
  if (!projected) throw new Error(`${internalName} did not project`);
  return mapOnePowerProjection(projected).damage;
}

suite('Scrapper crit — the power’s own rows, not a flat archetype average', () => {
  it('the engine vocabulary names the two ranks the surfaces project against', () => {
    // The UI constants are segment names into the DERIVED vocabulary; if a regen ever
    // drops either segment the surfaces would silently lose their target, so pin them.
    expect(rankToken(VS_HIGHER_RANK_SEGMENT)).toMatch(/^Class_/);
    expect(rankToken(VS_MINION_RANK_SEGMENT)).toMatch(/^Class_/);
  });

  it("One Thousand Cuts: crit component is 138.26 at 10% vs Lt+ (was +14.77 under the flat ×1.10)", () => {
    const damage = damageVs('High_Low', VS_HIGHER_RANK_SEGMENT);
    // The certain base the panel already showed — unchanged by this fix.
    expect(damage.final).toBeCloseTo(147.7115, 3);
    const crit = critComponents(damage);
    expect(crit).toHaveLength(1);
    expect(crit[0].application).toBeCloseTo(0.1, 5);
    // City of Data's crit component for the power: 2.21 × Melee_InherentDamage[50].
    expect(crit[0].total.final).toBeCloseTo(138.2645, 3);
    expect(crit[0].table).toBe('Melee_InherentDamage');
  });

  it('One Thousand Cuts vs minions: same component at the 5% branch', () => {
    const crit = critComponents(damageVs('High_Low', VS_MINION_RANK_SEGMENT));
    expect(crit).toHaveLength(1);
    expect(crit[0].application).toBeCloseTo(0.05, 5);
    expect(crit[0].total.final).toBeCloseTo(138.2645, 3);
  });

  it("Sweeping Strike: 15% roll (not 10%) against both ranks — the chance is the power's, not the archetype's", () => {
    for (const segment of [VS_HIGHER_RANK_SEGMENT, VS_MINION_RANK_SEGMENT]) {
      const summary = critBranchSummary(damageVs('Special_2', segment));
      expect(summary).not.toBeNull();
      expect(summary!.chanceLabel).toBe('15%');
      expect(summary!.finalTotal).toBeCloseTo(106.3573, 3);
    }
  });

  it('Nimble Slash: a plain attack still reads as a true double', () => {
    const damage = damageVs('Light_Opening', VS_HIGHER_RANK_SEGMENT);
    const crit = critComponents(damage);
    expect(crit).toHaveLength(1);
    // Crit component equals the certain base — the one case the old flat model got right.
    expect(crit[0].total.final).toBeCloseTo(damage.final, 3);
  });
});
