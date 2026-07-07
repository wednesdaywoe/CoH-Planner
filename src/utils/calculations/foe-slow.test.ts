import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data/powersets';
import { hasSelfDirectedPenalty } from '@/types';

/**
 * Foe movement-slow ("-Speed") extraction.
 *
 * A CoH Slow reduces both Recharge AND movement (Run/Fly/Jump speed), encoded as
 * two AttribMods on a *_Slow table. The converter captured the -Recharge half
 * (`rechargeDebuff`) but DROPPED the movement half — the MOVEMENT block did
 * `continue` on any non-self movement effect ("enemy slows like Time's
 * Juncture"). Debuffs are first-class power info, so the movement half is now
 * emitted as a foe `slow` (no `toWho:'Self'` marker, so the calc treats it as a
 * foe debuff and the InfoPanel surfaces it). Self-penalty slows (Granite) carry
 * `toWho:'Self'` per-entry and are unchanged.
 */
describe('Foe movement-slow extraction (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('surfaces the movement half of a foe Slow alongside the -Recharge half', () => {
    const ps = getPowerset('blaster/ice-blast');
    const bolt = ps?.powers.find((p) => p.internalName === 'Ice_Bolt');
    expect(bolt).toBeDefined();

    const slow = bolt!.effects?.slow as Record<string, unknown> | undefined;
    expect(slow).toBeDefined();
    expect(slow!.runSpeed).toBeDefined(); // -Run/Fly/Jump speed (was dropped)

    // Foe debuff — must NOT be self-directed (it doesn't slow the player).
    expect(hasSelfDirectedPenalty(bolt!.effects)).toBe(false);
    // The matching -Recharge half is still present.
    expect(bolt!.effects?.rechargeDebuff).toBeDefined();
  });

  it('leaves self-penalty Slows (Granite Armor) self-directed (toWho:Self)', () => {
    const ps = getPowerset('tanker/stone-armor');
    const granite = ps?.powers.find((p) => p.internalName === 'Granite_Armor');
    expect(granite).toBeDefined();
    expect(granite!.effects?.slow).toBeDefined();
    expect(hasSelfDirectedPenalty(granite!.effects)).toBe(true);
  });
});
