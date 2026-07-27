import { describe, it, expect } from 'vitest';
import { PET_ENTITIES as HC_PETS } from './datasets/homecoming/pet-entities';
import { PET_ENTITIES as REBIRTH_PETS } from './datasets/rebirth/pet-entities';
import { PET_ENTITIES as TSPY_PETS } from './datasets/thunderspy/pet-entities';
import type { PetEntity } from '@/types';

/**
 * PvE/PvP twin drop in the pet-entity converter.
 *
 * HC splits many powers into a PvE group (`enttype target> critter eq`) and a
 * PvP group (`enttype target> player eq`), BOTH tagged is_pvp='EITHER' so the
 * PVP_ONLY flag never catches the PvP half; Thunderspy spells the same split as
 * `isPVPMap?`. convert-powerset.cjs has dropped the PvP half since the Trick
 * Arrow fixes, but convert-pet-entities.cjs matched the CoD2 *infix* spelling
 * (`target>enttype eq 'player'`) that the parser never emits — a dead guard.
 * Every summoned rain/storm pet therefore kept BOTH halves: Blizzard listed four
 * damage sources (Lethal + PvE Cold + two PvP Cold) instead of two, Ice Storm and
 * Rain of Fire three instead of one, and 43 mez/damage rows across HC read their
 * PvP `*_PvPDamage` / `*_PvPMez` value instead of the PvE one.
 *
 * The planner has no PvP mode, so the PvE twin is always the one kept
 * (GAME-DATA-PRINCIPLES §3).
 */

const DATASETS: [string, Record<string, PetEntity>][] = [
  ['homecoming', HC_PETS],
  ['rebirth', REBIRTH_PETS],
  ['thunderspy', TSPY_PETS],
];

function* allAbilities(pets: Record<string, PetEntity>) {
  for (const [petName, pet] of Object.entries(pets)) {
    for (const ability of pet.abilities ?? []) yield { petName, ability };
    // Upgrade tiers carry their own ability lists on some entities.
    for (const tier of Object.values((pet as { upgrades?: Record<string, { abilities?: unknown[] }> }).upgrades ?? {})) {
      for (const ability of (tier?.abilities ?? []) as PetEntity['abilities']) yield { petName, ability };
    }
  }
}

describe.each(DATASETS)('pet PvE/PvP twin drop (%s)', (_ds, pets) => {
  it('no ability keeps a PvP-only table', () => {
    const offenders: string[] = [];
    let checked = 0;

    for (const { petName, ability } of allAbilities(pets)) {
      for (const d of ability.damage ?? []) {
        checked++;
        if (/PvP/i.test(d.table ?? '')) offenders.push(`${petName}/${ability.name} damage ${d.damageType}@${d.table}`);
      }
      for (const e of (ability.effects ?? []) as { type: string; table?: string }[]) {
        checked++;
        if (/PvP/i.test(e.table ?? '')) offenders.push(`${petName}/${ability.name} effect ${e.type}@${e.table}`);
      }
    }

    // Guard the guard: a converter that emitted nothing would pass vacuously.
    expect(checked).toBeGreaterThan(500);
    expect(offenders).toEqual([]);
  });
});

/**
 * The PvP twin does not always use a `*_PvP*` table — Blizzard's two PvP Cold
 * rows sit on plain `Melee_Damage` and are distinguishable only by their group's
 * `enttype target> player eq` requires. These are the reported powers, pinned to
 * their exact PvE damage sources.
 */
describe('rain/storm pseudo-pets list only their PvE damage sources', () => {
  it.each([
    ['Pets_Blizzard', [['Lethal', 0.05], ['Cold', 0.05]]],
    ['Pets_Blizzard_Defender', [['Lethal', 0.029], ['Cold', 0.029]]],
    ['Pets_IceStorm', [['Cold', 0.028]]],
    ['Pets_RainofFire', [['Fire', 0.0347]]],
  ] as [string, [string, number][]][])('%s', (petName, expected) => {
    const ability = HC_PETS[petName]?.abilities?.[0];
    expect(ability, `${petName} missing`).toBeDefined();
    expect((ability!.damage ?? []).map((d) => [d.damageType, d.scale])).toEqual(expected);
  });
});
