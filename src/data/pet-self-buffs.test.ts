import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { PET_ENTITIES, getPetEntity, type PetAbility, type PetEffect } from '@/data/pet-entities';
import { BUFF_PET_AURA_TYPES } from '@/utils/calculations/buff-pet-auras';
import { createRequire } from 'node:module';

// The converter is the thing under test for the boundary case — reach it directly
// rather than only inspecting its output (see 'the CLASSIFIERS cannot emit across
// the boundary'). Requiring it does NOT run the conversion (`require.main` guard).
const { extractSelfBuff, extractBuffAura } = createRequire(import.meta.url)(
  '../../scripts/convert-pet-entities.cjs',
) as {
  extractSelfBuff: (t: Record<string, unknown>) => PetEffect[];
  extractBuffAura: (t: Record<string, unknown>) => { effects: PetEffect[] };
};

/**
 * The pet's OWN defensive profile (`convert-pet-entities`' `extractSelfBuff`).
 *
 * A summon is a second character (COH-DATA-MODEL §6): its resistance, defense, mez
 * protection and mez resistance live on `target: Self` templates of its own always-on
 * powers. `isDebuffTemplate` rejected target=Self wholesale, so all of it was parsed
 * from the bin and then dropped — "I can't see my pet's stats."
 *
 * The load-bearing invariant is the FIRST test: these types must stay disjoint from the
 * ally-aura vocabulary that `buff-pet-auras.ts` folds into the PLAYER's totals. A pet's
 * own +Res is not the player's +Res, and emitting it under the ally name would put a pet
 * stat on the character sheet — the same failure mode as a pet-set proc read as a self
 * buff. The rest guard the shape and the one named exclusion.
 */

const SELF_TYPES = [
  'SelfResistance',
  'SelfDefense',
  'SelfMezProtection',
  'SelfMezResistance',
  'SelfDebuffResistance',
] as const;

const allAbilities = (): { entity: string; ability: PetAbility }[] =>
  Object.entries(PET_ENTITIES).flatMap(([entity, e]) => [
    ...e.abilities.map((ability) => ({ entity, ability })),
    ...(e.upgradeTiers ?? []).flatMap((t) => t.abilities.map((ability) => ({ entity, ability }))),
  ]);

const allSelfEffects = (): { entity: string; ability: string; effect: PetEffect }[] =>
  allAbilities().flatMap(({ entity, ability }) =>
    (ability.effects ?? [])
      .filter((effect) => effect.type.startsWith('Self'))
      .map((effect) => ({ entity, ability: ability.name, effect })),
  );

describe('pet self-buff vocabulary (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('is disjoint from the ally-aura types that fold into PLAYER totals', () => {
    // buff-pet-auras.ts keys on exact type strings. If a Self* type ever appeared in
    // that list — or a Self effect were emitted under an ally name — every pet's own
    // resistance would land on the character's dashboard.
    for (const t of SELF_TYPES) {
      expect([...BUFF_PET_AURA_TYPES], `${t} must not fold into player totals`).not.toContain(t);
    }
    for (const allyType of BUFF_PET_AURA_TYPES) {
      expect(allyType.startsWith('Self'), `${allyType} looks like a pet self type`).toBe(false);
    }
  });

  it('the CLASSIFIERS cannot emit across the boundary', () => {
    // The test above only compares two constant lists — it stays green if the
    // converter emits a pet's own defense under the name `DefenseBuff`, which is
    // precisely the leak that matters (mutation-tested: renaming SelfDefense →
    // DefenseBuff survived it). Grade the functions themselves instead.
    const t = (over: Record<string, unknown>) => ({
      attribs: ['Smashing_Dmg', 'Lethal_Dmg'], aspect: 'Resistance',
      scale: 0.2, table: 'Melee_Ones', target: 'Self', ...over,
    });
    const cases = [
      t({}),                                                                    // resistance
      t({ scale: -0.2 }),                                                       // vulnerability
      t({ attribs: ['Melee', 'Ranged'], aspect: 'Current', table: 'Melee_Buff_Def' }), // defense
      t({ attribs: ['Held', 'Confused'], aspect: 'Current', scale: -4 }),       // mez protection
      t({ attribs: ['Held', 'Confused'] }),                                     // mez resistance
      t({ attribs: ['RunningSpeed', 'RechargeTime'] }),                         // debuff resistance
    ];
    for (const tpl of cases) {
      const self = extractSelfBuff(tpl);
      expect(self.length, `no classification for ${JSON.stringify(tpl.attribs)}`).toBeGreaterThan(0);
      for (const e of self) {
        expect(SELF_TYPES, `extractSelfBuff emitted ${e.type}`).toContain(e.type);
        expect([...BUFF_PET_AURA_TYPES]).not.toContain(e.type);
      }
      // …and the ally classifier must never claim a Self template's effect.
      for (const e of extractBuffAura(tpl).effects) {
        expect(e.type.startsWith('Self'), `extractBuffAura emitted ${e.type}`).toBe(false);
      }
    }
  });

  it('emits a non-trivial number of self effects across many entities', () => {
    const found = allSelfEffects();
    const entities = new Set(found.map((f) => f.entity));
    // Sized from the conversion (1254 across 352 entities). A floor well under that
    // catches the vocabulary silently going dark without pinning an exact count.
    expect(found.length).toBeGreaterThan(900);
    expect(entities.size).toBeGreaterThan(250);
  });

  it('every self effect carries a scale, a table and a non-empty sub-type list', () => {
    const bad = allSelfEffects().filter(({ effect }) => {
      const subTypes =
        effect.resistanceTypes ?? effect.defenseTypes ?? effect.mezTypes ?? effect.debuffTypes;
      return (
        typeof effect.scale !== 'number' ||
        effect.scale === 0 ||
        !effect.table ||
        !subTypes ||
        subTypes.length === 0
      );
    });
    expect(bad.map((b) => `${b.entity}/${b.ability}: ${JSON.stringify(b.effect)}`)).toEqual([]);
  });

  it('keeps SelfResistance SIGNED — a negative is a real vulnerability, not a typo', () => {
    // Dark Servant carries a genuine −20% Energy resistance; abs()ing the scale would
    // turn a weakness into a strength.
    const negatives = allSelfEffects().filter(
      ({ effect }) => effect.type === 'SelfResistance' && (effect.scale ?? 0) < 0,
    );
    expect(negatives.length).toBeGreaterThan(0);
  });

  it('mez PROTECTION and mez RESISTANCE stay distinct on the same power', () => {
    // The Bruiser's Resistance power carries both: mag-4 Placate/Fear protection
    // (Current, negative) and 50% Confuse/Fear resistance (Resistance aspect).
    const bruiser = getPetEntity('MastermindPets_Thug_Boss');
    expect(bruiser, 'MastermindPets_Thug_Boss').toBeTruthy();
    const res = bruiser!.abilities.find((a) => a.name === 'Resistance');
    expect(res, 'Bruiser Resistance power').toBeTruthy();
    const types = (res!.effects ?? []).map((e) => e.type);
    expect(types).toContain('SelfResistance');
    expect(types).toContain('SelfMezProtection');
    expect(types).toContain('SelfMezResistance');

    const prot = (res!.effects ?? []).find((e) => e.type === 'SelfMezProtection');
    expect(prot!.scale).toBe(4); // magnitude, sign stripped
    expect(prot!.mezTypes).toEqual(expect.arrayContaining(['Placate', 'Fear']));
  });

  it('excludes Materialization — a spawn window, not a pet stat', () => {
    // "This effect lasts for up to 15s after the henchman is summoned or until they
    // engage in combat" — neither condition is in the binary, which states a flat
    // +100% Defense to all 11 types on a 20s duration / 20s period, structurally
    // identical to a permanent refreshing aura. Read literally it tells a Mastermind
    // their Bruiser has 100% defense to everything.
    const offenders = allAbilities().filter(
      ({ ability }) =>
        ability.name === 'Materialization' &&
        (ability.effects ?? []).some((e) => e.type.startsWith('Self')),
    );
    expect(offenders.map((o) => o.entity)).toEqual([]);
  });

  it('never claims a pet has 100% defense to everything', () => {
    // The generic form of the Materialization trap: any future transient read as a
    // stat would show up as an absurd all-positions grant on a flat Ones table.
    const absurd = allSelfEffects().filter(
      ({ effect }) =>
        effect.type === 'SelfDefense' &&
        (effect.defenseTypes?.length ?? 0) >= 8 &&
        /_ones$/i.test(effect.table ?? '') &&
        (effect.scale ?? 0) >= 1,
    );
    expect(absurd.map((a) => `${a.entity}/${a.ability}`)).toEqual([]);
  });
});
