/**
 * A team-only defense buff must not land in the caster's totals.
 *
 * Shield Defense's Grant Cover carries the RPN clause `entref target> entref source>
 * eq !` — "target ≠ source" — on nine `Defense` rows aimed at `Target`. The game's own
 * help text says it outright: "The defense bonus from this power is only applied to
 * nearby team mates, but not yourself."
 *
 * This used to be handled by a hand-written `defenseBuffExcludesSelf` flag in the
 * overrides layer — four files on Homecoming, three on Rebirth, and none at all on
 * Thunderspy, which is exactly the hole a per-power hand-list leaves. The clause is on
 * the wire, so the applier reads it now and the flag is gone.
 *
 * Two halves, and the second is what keeps the first honest. Phalanx Fighting carries
 * the SAME clause on rows aimed at `Self` — it counts nearby allies to size a buff it
 * hands to the caster. A filter reading only the clause deletes Phalanx's per-ally
 * increment; a filter reading only the recipient keeps Grant Cover. Both powers sit in
 * the same powerset, so getting either wrong shows up here.
 *
 * This grades the TypeScript oracle half. The engine the app actually runs is the wasm
 * built from the rebuild, whose mirror of this gate is
 * `crates/coh_math/tests/caster_excluded_defense.rs` there — the two are independent
 * implementations of the same rule, which is the point of `serverParity.test.ts`.
 */
import { describe, it, expect } from 'vitest';
import { defenseBuffValue, defenseBuffSuppressibleValue, defenseBuffIsTeamOnly } from '@/data/core/atom-query';
import { GrantCover as GrantCoverHC } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/shield-defense/grant-cover';
import { GrantCover as GrantCoverRebirth } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/shield-defense/grant-cover';
import { GrantCover as GrantCoverTspy } from '@/data/datasets/thunderspy/generated/powersets/tanker/primary/shield-defense/grant-cover';
import { PhalanxFighting } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/shield-defense/phalanx-fighting';

const forks = [
  ['Homecoming', GrantCoverHC],
  ['Rebirth', GrantCoverRebirth],
  ['Thunderspy', GrantCoverTspy],
] as const;

describe('Grant Cover — the caster is not on the team it covers', () => {
  it.each(forks)('%s: the atom applier surfaces no caster defense', (_fork, power) => {
    expect(defenseBuffValue(power)).toBeUndefined();
    expect(defenseBuffSuppressibleValue(power)).toBeUndefined();
  });

  it.each(forks)('%s: and the bag fallback is suppressed too', (_fork, power) => {
    // The atom half going quiet is not enough on its own: `defenseBuffValue(power) ??
    // effects.defenseBuff` would hand the caster back the very number the applier
    // declined to give. The bag keeps that slot on purpose — the power card shows
    // allies what they receive — so the seam needs the explicit verdict.
    expect(defenseBuffIsTeamOnly(power)).toBe(true);
    expect(power.effects?.defenseBuff).toBeDefined();
  });
});

describe('Phalanx Fighting — the same clause, aimed at the caster', () => {
  it('keeps both the base and the per-ally increment', () => {
    // Pinned to both numbers, not to "defined": the clause rides only on the 0.3
    // increment, which folds into `perTarget`. A test asserting the power still
    // returns something passes with the increment deleted.
    const d = defenseBuffValue(PhalanxFighting)!;
    expect(Object.keys(d).sort()).toEqual(['aoe', 'melee', 'ranged']);
    for (const type of ['melee', 'ranged', 'aoe']) {
      expect(d[type].scale).toBeCloseTo(0.5);
      expect(d[type].perTarget).toBeCloseTo(0.3);
    }
  });

  it('is not team-only', () => {
    expect(defenseBuffIsTeamOnly(PhalanxFighting)).toBe(false);
  });
});
