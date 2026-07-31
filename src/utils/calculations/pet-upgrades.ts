/**
 * Which henchman upgrades a build has actually taken.
 *
 * A Mastermind's Equip/Upgrade powers are ordinary powers in the primary set,
 * and taking one permanently switches every henchman it names over to its `_2`
 * or `_3` powerset. That is a fact about the BUILD, not a setting: if Equip
 * Mercenary is in the build, the Soldier is equipped, and a panel that shows an
 * un-equipped Soldier by default is showing a pet the character does not have.
 *
 * The join is exact and comes from the game's own data. `PetUpgradeTier.grantedBy`
 * holds the internal names of the powers that grant into that tier, resolved by
 * the converter from which powerset each `Grant_Power` targets — the `_2`/`_3`
 * suffix IS the tier. So nothing here keys on power names, unlock levels, or the
 * order upgrades appear in; a server that renames Equip Mercenary or moves it to
 * level 12 needs no change.
 *
 * Thunderspy's export does not resolve grant targets, so its tiers carry no
 * `grantedBy` and this returns `undefined` — "cannot be derived", distinct from
 * "derived, and nothing is upgraded". Callers must keep a manual control for
 * that case rather than silently showing an un-upgraded pet.
 */

import type { PetEntity } from '@/data/pet-entities';
import type { Build } from '@/types';

/**
 * Internal names of every power the build has taken.
 *
 * All of them, not just the primary set: which set an upgrade lives in is a
 * per-server choice, and a name that isn't an upgrade simply never matches.
 */
export function takenPowerNames(build: Build): Set<string> {
  const names = new Set<string>();
  const add = (p: { internalName: string }) => names.add(p.internalName);

  build.primary.powers.forEach(add);
  build.secondary.powers.forEach(add);
  build.pools.forEach((pool) => pool.powers.forEach(add));
  build.epicPool?.powers.forEach(add);
  build.inherents.forEach(add);
  return names;
}

/** Every player power that can turn on one of this pet's upgrade tiers. */
export function petUpgradePowerNames(entity: PetEntity | undefined): string[] {
  if (!entity?.upgradeTiers) return [];
  const names = new Set<string>();
  for (const tier of entity.upgradeTiers) {
    for (const name of tier.grantedBy ?? []) names.add(name);
  }
  return [...names];
}

/** True when at least one of this pet's tiers records what grants it. */
export function hasDerivableUpgrades(entity: PetEntity | undefined): boolean {
  return (entity?.upgradeTiers ?? []).some((tier) => (tier.grantedBy ?? []).length > 0);
}

/**
 * The tiers active for a build holding `takenPowers` (internal names).
 *
 * Returns `undefined` when the entity records no grant sources at all — the
 * question is unanswerable from the build, not answered with "none".
 *
 * A tier lights up when ANY of its granters is taken. That is not a
 * simplification: Homecoming's Tame Beasts grants into the Alpha wolf's `_2`
 * set as well as Train Beasts does, and either one on its own does upgrade it.
 */
export function resolveActiveUpgradeTiers(
  entity: PetEntity | undefined,
  takenPowers: ReadonlySet<string>,
): Set<number> | undefined {
  if (!hasDerivableUpgrades(entity)) return undefined;

  const active = new Set<number>();
  for (const tier of entity!.upgradeTiers ?? []) {
    if ((tier.grantedBy ?? []).some((name) => takenPowers.has(name))) active.add(tier.tier);
  }
  return active;
}

/**
 * The upgrade powers relevant to a set of pets, paired with whether the build
 * has them — what a panel needs to say "Equipped · Tactical Upgrade not taken"
 * instead of "Upgrade 1 / Upgrade 2".
 *
 * Ordered by tier so the list reads in the order the upgrades apply.
 */
export interface PetUpgradeStatus {
  tier: number;
  /** Internal name of the granting power, e.g. `Equip_Mercenary`. */
  powerName: string;
  taken: boolean;
}

export function petUpgradeStatuses(
  entities: readonly (PetEntity | undefined)[],
  takenPowers: ReadonlySet<string>,
): PetUpgradeStatus[] {
  const byPower = new Map<string, PetUpgradeStatus>();

  for (const entity of entities) {
    for (const tier of entity?.upgradeTiers ?? []) {
      for (const powerName of tier.grantedBy ?? []) {
        const existing = byPower.get(powerName);
        // A power that grants into more than one tier (Homecoming's Enchant
        // Undead reaches both the Zombie's `_2` and the Skeletal Warrior's `_3`)
        // is listed once, under the earliest tier it touches, so the row order
        // still matches the order a player takes them.
        if (!existing || tier.tier < existing.tier) {
          byPower.set(powerName, { tier: tier.tier, powerName, taken: takenPowers.has(powerName) });
        }
      }
    }
  }

  return [...byPower.values()].sort((a, b) => a.tier - b.tier || a.powerName.localeCompare(b.powerName));
}
