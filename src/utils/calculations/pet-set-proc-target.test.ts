import { describe, it, expect, beforeAll } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data/powersets';
import { PROC_DATABASE, getProcEffects } from '@/data/proc-data';
import { createEmptyBuild } from '@/types/build';
import { ioSetSlot, pick } from '@/test/build-fixtures';
import type { Build } from '@/types';

/**
 * A proc in a PET enhancement set is carried by the summoned pet, not by the player.
 * Soulbound Allegiance's "Chance for Build Up" is slotted in a summon power, copied to
 * the pet, and fires from the pet's attacks — the +100% Damage / +15% ToHit lands on the
 * PET. The binary can't say so on its own: the piece grants the very same
 * `Set_Bonus.Global_Bonus.Boost_Up` power as Decimation's and Gaussian's self Build Up,
 * with identical `target: Self` templates. The only discriminator is the set's category
 * (`ECPetDamage`), which the extractor now stamps as `target: 'pets'`.
 *
 * The Build-Up proc pass then has to honour that stamp — it was the one proc pass with no
 * target filter, so a Soulbound in a long-recharge summon (Singularity: 240s base → the
 * 90% PPM cap) handed the player a flat +90% global damage.
 */

function controllerBuild(slots: (ReturnType<typeof ioSetSlot> | null)[]): Build {
  const b = createEmptyBuild();
  b.serverId = 'homecoming';
  b.level = 50;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  b.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as any;
  const ps = getPowerset('controller/gravity-control');
  if (!ps) throw new Error('fixture: no controller/gravity-control powerset');
  const sing = ps.powers.find((p) => p.name === 'Singularity');
  if (!sing) throw new Error('fixture: no Singularity in controller/gravity-control');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  b.primary = { id: 'gravity_control', name: 'Gravity Control',
    powers: [pick(sing, 'gravity_control', { level: 26, isActive: true, slots })] } as any;
  return b;
}

function damageSources(build: Build) {
  const t = calculateCharacterTotals(build, false, undefined, {});
  return t.breakdown.get('damage')?.sources ?? [];
}

describe('pet-set procs do not buff the player', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('the extractor stamps every Soulbound effect as pet-targeted', () => {
    // The calc filter is only as good as the stamp it reads — guard the generated
    // data so an extractor regression reds here rather than silently re-opening the
    // +90% damage leak below.
    const proc = PROC_DATABASE['Soulbound Allegiance: Chance for Build Up'];
    expect(proc).toBeDefined();
    const effects = getProcEffects(proc);
    expect(effects.length).toBeGreaterThan(0);
    expect(effects.every((e) => e.target === 'pets')).toBe(true);
  });

  it('Soulbound Allegiance in a summon power adds NO global +Damage or +ToHit', () => {
    const withProc = controllerBuild([ioSetSlot('soulbound_allegiance', 'Chance for Build Up')]);
    const withoutProc = controllerBuild([null]);

    const t1 = calculateCharacterTotals(withProc, false, undefined, {});
    const t2 = calculateCharacterTotals(withoutProc, false, undefined, {});

    expect(t1.globalBonuses.damage).toBeCloseTo(t2.globalBonuses.damage, 6);
    expect(t1.globalBonuses.toHit).toBeCloseTo(t2.globalBonuses.toHit, 6);
    expect(damageSources(withProc).find((s) => /Soulbound/.test(s.name))).toBeUndefined();
  });

  it('Decimation Build Up (a SELF set) still contributes — the filter is target-keyed', () => {
    const ps = getPowerset('controller/gravity-control');
    const propel = ps!.powers.find((p) => p.name === 'Propel')!;
    // Decimation is a Ranged Damage set granting the identical Boost_Up power. Its
    // Build Up really is the player's, so the pass must keep contributing it.
    const b = createEmptyBuild();
    b.serverId = 'homecoming';
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.primary = { id: 'gravity_control', name: 'Gravity Control', powers: [
      pick(propel, 'gravity_control', {
        level: 8,
        isActive: true,
        slots: [ioSetSlot('decimation', 'Chance for Build Up')],
      }),
    ] } as any;
    expect(damageSources(b).some((s) => /Decimation/.test(s.name))).toBe(true);
  });
});
