import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { buildChainPowers } from './attack-chain-powers';
import { effectiveRecharge } from './attack-chain';
import { createEmptyBuild } from '@/types/build';
import type { SelectedIncarnatePower } from '@/types/incarnate';

/**
 * The Attack Chain Builder never queried `build.incarnates`, so a slotted
 * Judgement power (a real click AoE attack with a 90s recharge) couldn't be
 * added to a chain. Guards `buildJudgementChainPower` in
 * attack-chain-powers.ts, which bridges the display-only `JudgementEffects`
 * registry into a `ChainPower`, and the `fixedRecharge` flag on
 * `effectiveRecharge` that keeps Judgement's flat 90s recharge immune to
 * slotted/global recharge bonuses (it can't be slotted at all in-game).
 */

function judgementSlot(powerId: string): SelectedIncarnatePower {
  return {
    slotId: 'judgement', powerId, powerName: powerId, displayName: 'Cryonic Core Judgement',
    icon: '', tier: 'uncommon', treeId: 'cryonic', treeName: 'Cryonic',
  };
}

function scrapperBuild(judgement: SelectedIncarnatePower | null, level = 50) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = createEmptyBuild();
  b.level = level;
  b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null };
  if (judgement) b.incarnates.judgement = judgement;
  return b;
}

describe('Attack Chain Builder — Judgement', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  const globalBonuses = { recharge: 0, toHit: 0, maxEndurance: 0, toggleEndCost: 0 } as never;
  const mechCtx = { archetypeId: 'scrapper' } as never;

  it('omits Judgement when no incarnate power is slotted', () => {
    const powers = buildChainPowers(scrapperBuild(null), globalBonuses, mechCtx);
    expect(powers.some((p) => p.id.startsWith('judgement:'))).toBe(false);
  });

  it('omits Judgement below the incarnate level threshold', () => {
    const powers = buildChainPowers(scrapperBuild(judgementSlot('cryonic_core_judgement'), 40), globalBonuses, mechCtx);
    expect(powers.some((p) => p.id.startsWith('judgement:'))).toBe(false);
  });

  it('adds the slotted Judgement power with a real cast/recharge/damage', () => {
    const build = scrapperBuild(judgementSlot('cryonic_core_judgement'));
    const powers = buildChainPowers(build, globalBonuses, mechCtx);
    const j = powers.find((p) => p.id === 'judgement:cryonic_core_judgement');
    expect(j).toBeDefined();
    expect(j!.type).toBe('attack');
    expect(j!.baseRecharge).toBe(90);
    expect(j!.fixedRecharge).toBe(true);
    expect(j!.rechargeEnh).toBe(0);
    expect(j!.endCost).toBe(0);
    expect(j!.damage).toBeGreaterThan(0);
  });

  it('recharge stays flat at 90s regardless of slotted/global recharge (fixedRecharge)', () => {
    const build = scrapperBuild(judgementSlot('cryonic_core_judgement'));
    const powers = buildChainPowers(build, globalBonuses, mechCtx);
    const j = powers.find((p) => p.id === 'judgement:cryonic_core_judgement')!;
    expect(effectiveRecharge(j, 0)).toBe(90);
    expect(effectiveRecharge(j, 400)).toBe(90); // a what-if +400% global recharge does nothing
    expect(effectiveRecharge(j, -300)).toBe(90); // nor a -300% debuff
  });
});
