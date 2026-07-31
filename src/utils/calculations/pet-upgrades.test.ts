import { describe, it, expect, beforeAll } from 'vitest';
import { PET_ENTITIES } from '@/data/pet-entities';
import { loadDataset } from '@/data/dataset';
import { calculatePetDamage } from './pet-damage';
import {
  hasDerivableUpgrades,
  petUpgradePowerNames,
  petUpgradeStatuses,
  resolveActiveUpgradeTiers,
} from './pet-upgrades';

/**
 * A Mastermind upgrade REPLACES the henchman's powerset; it does not add to it.
 *
 * `Equip_Mercenary` grants `Mastermind_Pets.Soldier_2.Equip` and revokes
 * `Mastermind_Pets.Soldier.Resistance` in the same breath — the game says so in
 * the export, via `Revoke_Power` params sitting beside the grants. Read as an
 * append (which is what the calc did), the Skeletal Warrior swings Hack once per
 * active tier and the Howler Wolf keeps quoting its un-upgraded resistance while
 * the upgraded number sits in the data unread.
 *
 * These tests are corpus-wide rather than anchored to a handful of pets: the
 * failure mode is silent and per-entity, so a spot check on Mercenaries would
 * have passed throughout.
 */

const DATASETS = ['homecoming', 'rebirth', 'thunderspy'] as const;

function tieredEntities() {
  return Object.entries(PET_ENTITIES).filter(([, e]) => (e.upgradeTiers ?? []).length > 0);
}

describe.each(DATASETS)('pet upgrades (%s)', (datasetId) => {
  beforeAll(async () => {
    await loadDataset(datasetId);
  });

  it('has pets with upgrade tiers to check', () => {
    // A corpus that resolved to nothing would pass every assertion below.
    expect(tieredEntities().length).toBeGreaterThan(10);
  });

  it('never lets an upgrade tier add a second copy of an ability the pet already has', () => {
    const offenders: string[] = [];
    let checked = 0;

    for (const [name, entity] of tieredEntities()) {
      const tiers = (entity.upgradeTiers ?? []).map((t) => t.tier);
      const result = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, tiers);
      if (!result) continue;
      checked++;

      const seen = new Map<string, number>();
      for (const ad of result.abilities) seen.set(ad.ability.name, (seen.get(ad.ability.name) ?? 0) + 1);
      for (const ability of result.effectOnlyAbilities) {
        seen.set(ability.name, (seen.get(ability.name) ?? 0) + 1);
      }
      for (const [ability, count] of seen) {
        if (count > 1) offenders.push(`${name}.${ability} x${count}`);
      }
    }

    expect(checked, 'entities whose damage resolved').toBeGreaterThan(10);
    expect(offenders).toEqual([]);
  });

  it('lets an upgraded passive win over the base one it replaces', () => {
    // Same NAME across tiers means the same power, upgraded — Beast Mastery's
    // Howler Wolf goes from 7.5% to 12% smashing/lethal on Train Beasts. Taking
    // the base value (first-wins, which is what the effect merge did) shows the
    // un-upgraded wolf to a player who has the upgrade.
    const stale: string[] = [];
    let checked = 0;

    for (const [name, entity] of tieredEntities()) {
      const tiers = (entity.upgradeTiers ?? []).map((t) => t.tier);

      // Only pets where a tier genuinely restates a base ability with DIFFERENT
      // numbers. Where the restatement is verbatim (most of them), nothing about
      // the merge is observable and there is nothing to assert.
      const rewritten = (entity.upgradeTiers ?? [])
        .flatMap((t) => t.abilities)
        .filter((a) => {
          const base = entity.abilities.find((b) => b.name === a.name);
          return base && JSON.stringify(base.effects ?? []) !== JSON.stringify(a.effects ?? []);
        });
      if (rewritten.length === 0) continue;

      const off = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, []);
      const on = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, tiers);
      if (!off || !on) continue;
      checked++;

      // The upgraded pet must not read identically to the un-upgraded one — that
      // is exactly the symptom: ticking the upgrade changed the DPS list while
      // the stat block sat still, because the base effect was keyed first and won.
      // Sub-types are part of the fingerprint: Hellfire Demonling's upgrade
      // moves toxic and cold between its two resistance bands without changing
      // either number, so a value-only comparison reads it as unchanged.
      const render = (r: typeof off) =>
        r.allEffects
          .map((e) => [
            e.type, e.value ?? '', e.magnitude ?? '',
            (e.resistanceTypes ?? []).join(','), (e.defenseTypes ?? []).join(','),
            (e.mezTypes ?? []).join(','), (e.debuffTypes ?? []).join(','),
          ].join('|'))
          .sort()
          .join(';');
      if (render(off) === render(on)) stale.push(`${name} (${rewritten.map((a) => a.name).join(', ')})`);
    }

    expect(checked, 'entities with a genuinely rewritten passive').toBeGreaterThan(0);
    expect(stale).toEqual([]);
  });

  it('applies a tier only when its tier number is asked for', () => {
    const withTiers = tieredEntities();
    let compared = 0;

    for (const [name, entity] of withTiers) {
      const tiers = (entity.upgradeTiers ?? []).map((t) => t.tier);
      const off = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, []);
      const on = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, tiers);
      if (!off || !on) continue;

      const upgradeOnly = (entity.upgradeTiers ?? [])
        .flatMap((t) => t.abilities)
        .filter((a) => !entity.abilities.some((b) => b.name === a.name));
      if (upgradeOnly.length === 0) continue;
      compared++;

      const offNames = new Set([
        ...off.abilities.map((a) => a.ability.name),
        ...off.effectOnlyAbilities.map((a) => a.name),
      ]);
      for (const ability of upgradeOnly) {
        expect(offNames.has(ability.name), `${name}: ${ability.name} leaked into the un-upgraded pet`).toBe(false);
      }
    }

    expect(compared, 'entities with upgrade-only abilities').toBeGreaterThan(5);
  });

  it('resolves upgrade tiers from the powers a build has taken', () => {
    const derivable = tieredEntities().filter(([, e]) => hasDerivableUpgrades(e));

    if (derivable.length === 0) {
      // Thunderspy's export doesn't resolve grant targets, so no tier records
      // what grants it. That must read as "cannot derive", never as "nothing is
      // upgraded" — a caller that can't tell the difference silently shows every
      // Thunderspy henchman un-equipped.
      for (const [, entity] of tieredEntities()) {
        expect(resolveActiveUpgradeTiers(entity, new Set(['Equip_Mercenary']))).toBeUndefined();
      }
      return;
    }

    for (const [name, entity] of derivable) {
      const granters = petUpgradePowerNames(entity);
      expect(granters.length, `${name} has grantedBy but no granter names`).toBeGreaterThan(0);

      expect(resolveActiveUpgradeTiers(entity, new Set())).toEqual(new Set());

      const all = resolveActiveUpgradeTiers(entity, new Set(granters))!;
      const derivableTiers = (entity.upgradeTiers ?? [])
        .filter((t) => (t.grantedBy ?? []).length > 0)
        .map((t) => t.tier);
      expect([...all].sort()).toEqual([...new Set(derivableTiers)].sort());
    }
  });

  it('names the granting power rather than a tier number', () => {
    const soldier = PET_ENTITIES['MastermindPets_Soldier'];
    if (!soldier || !hasDerivableUpgrades(soldier)) return; // Thunderspy

    const statuses = petUpgradeStatuses([soldier], new Set(['Equip_Mercenary']));
    expect(statuses.map((s) => s.powerName)).toEqual(['Equip_Mercenary', 'Tactical_Upgrade']);
    expect(statuses.map((s) => s.taken)).toEqual([true, false]);
    expect(statuses.map((s) => s.tier)).toEqual([2, 3]);
  });
});

describe('pet upgrades — Homecoming anchors', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('equipping a Soldier swaps its Resistance for Equip rather than stacking both', () => {
    const soldier = PET_ENTITIES['MastermindPets_Soldier'];
    const tier2 = soldier.upgradeTiers!.find((t) => t.tier === 2)!;
    expect(tier2.grantedBy).toEqual(['Equip_Mercenary']);
    expect(tier2.revokes).toContain('Resistance');

    const equipped = calculatePetDamage('MastermindPets_Soldier', 50, 1, undefined, 0, false, 0, [2])!;
    const names = equipped.effectOnlyAbilities.map((a) => a.name);
    expect(names).toContain('Equip');
    expect(names).not.toContain('Resistance');

    // Both carry the same smashing/lethal resistance, so the number must not
    // double when the pair is (incorrectly) allowed to coexist.
    const res = equipped.allEffects.filter(
      (e) => e.type === 'SelfResistance' && e.resistanceTypes?.includes('smashing'),
    );
    expect(res).toHaveLength(1);
  });

  it('stops the Skeletal Warrior swinging Hack three times', () => {
    const warrior = PET_ENTITIES['MastermindPets_Skeletal_Warrior'];
    // Base, tier 2 and tier 3 each carry a Hack — this is the shape that made
    // the append triple-count it.
    const copies = [
      warrior.abilities,
      ...warrior.upgradeTiers!.map((t) => t.abilities),
    ].filter((set) => set.some((a) => a.name === 'Hack')).length;
    expect(copies).toBe(3);

    const full = calculatePetDamage('MastermindPets_Skeletal_Warrior', 50, 1, undefined, 0, false, 0, [2, 3])!;
    expect(full.abilities.filter((a) => a.ability.name === 'Hack')).toHaveLength(1);
    expect(full.abilities.filter((a) => a.ability.name === 'Slash')).toHaveLength(1);
  });

  it("drops the Medic's Brawl when Equip Mercenary revokes it", () => {
    const medic = PET_ENTITIES['MastermindPets_Medic'];
    expect(medic.upgradeTiers!.find((t) => t.tier === 2)!.revokes).toContain('Brawl');

    const base = calculatePetDamage('MastermindPets_Medic', 50, 1, undefined, 0, false, 0, [])!;
    const equipped = calculatePetDamage('MastermindPets_Medic', 50, 1, undefined, 0, false, 0, [2])!;
    expect(base.abilities.map((a) => a.ability.name)).toContain('Brawl');
    expect(equipped.abilities.map((a) => a.ability.name)).not.toContain('Brawl');
  });

  it("never revokes one henchman's power from another", () => {
    // Equip Mercenary revokes across all four henchmen at once (the Medic's
    // Brawl, everyone's Resistance). Joining those onto the wrong pet would
    // quietly delete abilities that upgrade has nothing to do with.
    const soldierTier2 = PET_ENTITIES['MastermindPets_Soldier'].upgradeTiers!.find((t) => t.tier === 2)!;
    expect(soldierTier2.revokes).not.toContain('Brawl');

    const equipped = calculatePetDamage('MastermindPets_Soldier', 50, 1, undefined, 0, false, 0, [2])!;
    expect(equipped.abilities.map((a) => a.ability.name)).toContain('Brawl');
  });

  it("raises the Howler Wolf's resistance when the pack is trained", () => {
    const wolf = PET_ENTITIES['MastermindPets_Howler_Wolf'];
    const baseRes = wolf.abilities
      .find((a) => a.name === 'Resistance')!
      .effects!.find((e) => e.type === 'SelfResistance')!;
    const upgradedRes = wolf.upgradeTiers!
      .find((t) => t.tier === 2)!
      .abilities.find((a) => a.name === 'Resistance')!
      .effects!.find((e) => e.type === 'SelfResistance')!;
    expect(upgradedRes.scale).toBeGreaterThan(baseRes.scale!);

    const trained = calculatePetDamage('MastermindPets_Howler_Wolf', 50, 1, undefined, 0, false, 0, [2])!;
    const shown = trained.allEffects.find(
      (e) => e.type === 'SelfResistance' && e.resistanceTypes?.includes('smashing'),
    )!;
    // The upgraded scale, not the base one: base × table is strictly lower.
    const untrained = calculatePetDamage('MastermindPets_Howler_Wolf', 50, 1, undefined, 0, false, 0, [])!;
    const before = untrained.allEffects.find(
      (e) => e.type === 'SelfResistance' && e.resistanceTypes?.includes('smashing'),
    )!;
    expect(shown.value!).toBeGreaterThan(before.value!);
  });
});
