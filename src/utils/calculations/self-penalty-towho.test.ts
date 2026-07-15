import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data/powersets';
import { isSelfDirectedEffect, hasSelfDirectedPenalty, isScaledEffect } from '@/types';
import type { ScaledEffect } from '@/types';

/**
 * Retirement of the bag-level `selfPenalty` boolean → per-effect DSH4 `eToWho`.
 *
 * The old converter set ONE `selfPenalty` flag on the whole effects bag whenever
 * any Self-targeting debuff appeared, and the calc read it bag-wide — so a foe
 * debuff co-located in the same `slow` map (Rebirth Granite's `AnyAffected`
 * -JumpHeight) was dragged onto the caster's own totals, in direct violation of
 * the converter's own "foe slows don't slow the player" classification.
 *
 * The fix: the converter tags each self-directed debuff value `toWho:'Self'`, and
 * the calc self-applies PER ENTRY. HC (all-Self penalties) is a verified no-op;
 * only genuinely foe-classified entries stop leaking onto the caster.
 */
describe('selfPenalty → toWho retirement', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
    await loadDataset('rebirth');
  });

  const slowEntry = (effects: unknown, key: string): ScaledEffect | undefined => {
    const slow = (effects as { slow?: Record<string, unknown> } | undefined)?.slow;
    const v = slow && typeof slow === 'object' ? (slow as Record<string, unknown>)[key] : undefined;
    return isScaledEffect(v) ? v : undefined;
  };

  it('HC Granite Armor: every slow entry stays self-directed (no-op vs old flag)', async () => {
    await loadDataset('homecoming');
    const granite = getPowerset('tanker/stone-armor')?.powers.find((p) => p.internalName === 'Granite_Armor');
    expect(granite).toBeDefined();
    expect(hasSelfDirectedPenalty(granite!.effects)).toBe(true);
    // Granite's penalties are ALL Self in HC — each slow entry must carry the marker.
    for (const key of Object.keys(granite!.effects!.slow as Record<string, unknown>)) {
      expect(isSelfDirectedEffect(slowEntry(granite!.effects, key))).toBe(true);
    }
    // The -damage / -recharge self-penalties are self-directed too.
    expect(isSelfDirectedEffect(granite!.effects!.damageDebuff)).toBe(true);
    expect(isSelfDirectedEffect(granite!.effects!.rechargeDebuff)).toBe(true);
  });

  it('Rebirth Granite Armor: the foe -JumpHeight is NOT self-directed (leak sealed)', async () => {
    await loadDataset('rebirth');
    const granite = getPowerset('tanker/stone-armor')?.powers.find((p) => p.internalName === 'Granite_Armor');
    expect(granite).toBeDefined();
    // Self movement penalties keep the marker...
    expect(isSelfDirectedEffect(slowEntry(granite!.effects, 'runSpeed'))).toBe(true);
    // ...but the AnyAffected -JumpHeight (scale 500) is foe → NO marker → excluded
    // from the caster's totals. This is the whole point of the retirement.
    const jump = slowEntry(granite!.effects, 'jumpHeight');
    expect(jump).toBeDefined();
    expect(jump!.scale).toBe(500);
    expect(isSelfDirectedEffect(jump)).toBe(false);
  });

  it('HC Reaction Time: self -slow / -recharge preserved; foe -JumpHeight excluded', async () => {
    await loadDataset('homecoming');
    const rt = getPowerset('blaster/martial-combat')?.powers.find((p) => p.internalName === 'Reaction_Time');
    expect(rt).toBeDefined();
    expect(isSelfDirectedEffect(slowEntry(rt!.effects, 'runSpeed'))).toBe(true);
    expect(isSelfDirectedEffect(rt!.effects!.rechargeDebuff)).toBe(true);
    // jumpHeight on Reaction Time comes from an AnyAffected(Strength) template → foe.
    expect(isSelfDirectedEffect(slowEntry(rt!.effects, 'jumpHeight'))).toBe(false);
    expect(hasSelfDirectedPenalty(rt!.effects)).toBe(true);
  });

  it('a pure foe slow (Ice Bolt) is never self-directed', async () => {
    await loadDataset('homecoming');
    const bolt = getPowerset('blaster/ice-blast')?.powers.find((p) => p.internalName === 'Ice_Bolt');
    expect(bolt).toBeDefined();
    expect(hasSelfDirectedPenalty(bolt!.effects)).toBe(false);
  });

  // Rage's crash is TWO self-penalties: -100% damage (long-tagged) AND -20%
  // Defense(All). The defense branch of the converter was never self-tagged, so
  // Rage's -Def read as a foe debuff (Rage is Self-target — it debuffs nobody).
  // The DSH6c discriminator gate caught this on its first run (self-penalty|
  // Defense). Both AT variants must now carry toWho:'Self' on defenseDebuff.
  it('HC Rage crash: the -Def(All) is self-directed (DSH6c catch), like its -Dmg', async () => {
    await loadDataset('homecoming');
    for (const setId of ['brute/super-strength', 'tanker/super-strength']) {
      const rage = getPowerset(setId)?.powers.find((p) => p.internalName === 'Rage');
      expect(rage, setId).toBeDefined();
      expect(isSelfDirectedEffect(rage!.effects!.defenseDebuff), `${setId} -Def self`).toBe(true);
      expect(isSelfDirectedEffect(rage!.effects!.damageDebuff), `${setId} -Dmg self`).toBe(true);
    }
  });
});
