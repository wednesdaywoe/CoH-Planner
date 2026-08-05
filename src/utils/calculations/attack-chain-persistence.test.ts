// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time). The
// syncBuildDefinitions block at the bottom drives the real rehydrate path.
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { sequenceToIds, idsToSequence, buildChainPowers } from './attack-chain-powers';
import { slimBuild, hydrateBuild } from '@/utils/build-serialization';
import { createEmptyBuild } from '@/types/build';
import { composePersistedState } from '@/utils/per-server-builds';
import { useBuildStore } from '@/stores/buildStore';
import { getPowerPool, getPowerset } from '@/data';
import type { AttackChain, Build, SelectedPower } from '@/types';
import type { AtMechanicContext } from './power-at-mechanics';
import type { ChainPower } from './attack-chain';

const mk = (id: string): ChainPower => ({
  id,
  name: id,
  type: 'attack',
  cast: 1,
  baseRecharge: 1,
  rechargeEnh: 0,
  endCost: 1,
  damage: 1,
  dot: null,
});

const powers = [mk('pri:Smite'), mk('sec:Build_Up'), mk('pool0:Boxing')];

describe('saved-chain conversion', () => {
  it('round-trips a sequence through ids and back', () => {
    const seq = [0, 2, 0, 1];
    const ids = sequenceToIds(powers, seq);
    expect(ids).toEqual(['pri:Smite', 'pool0:Boxing', 'pri:Smite', 'sec:Build_Up']);
    expect(idsToSequence(powers, ids)).toEqual(seq);
  });

  it('drops ids whose power is no longer in the build', () => {
    const ids = ['pri:Smite', 'epic:Long_Gone', 'sec:Build_Up'];
    expect(idsToSequence(powers, ids)).toEqual([0, 1]); // missing one skipped, order kept
  });

  it('falls back to internalName when the bucket prefix changed (pool reshuffle)', () => {
    // Saved as pool0:Boxing, but Boxing now sits in pool1 — still resolves.
    const moved = [mk('pri:Smite'), mk('pool1:Boxing')];
    expect(idsToSequence(moved, ['pool0:Boxing'])).toEqual([1]);
  });

  it('sequenceToIds skips out-of-range indices defensively', () => {
    expect(sequenceToIds(powers, [0, 99, 2])).toEqual(['pri:Smite', 'pool0:Boxing']);
  });

  it('empty in, empty out', () => {
    expect(sequenceToIds(powers, [])).toEqual([]);
    expect(idsToSequence(powers, [])).toEqual([]);
  });
});

/**
 * A chain must remember BOTH modelling assumptions it was settled under: the
 * caster form it opens in, and whether it charges each shapeshift its full
 * animation.
 *
 * `startForm` began as "the one form this chain lives in". Kheldian form attacks
 * are auto-granted by the form toggle and castable only inside it, and the
 * candidate roster was rebuilt per form, so reopening a Nova chain in human form
 * resolved none of its ids, `idsToSequence` dropped every one, and Save wrote
 * the emptied list back over the saved rotation — silent, permanent loss on a
 * plain load-then-save.
 *
 * A chain can now SPAN forms via `switch` steps, so the roster is a union and
 * the ids resolve whatever form is set. What the field still decides is where
 * the walk STARTS, which fixes which variant each cast fires and which casts are
 * flagged illegal. `fullShiftAnimations` is the same kind of fact one layer out:
 * the identical order costs 0.26s or 2.24s per switch depending on whether the
 * player animation-cancels, and those are two different rotations with two
 * different DPS figures. Reload one under the other's assumption, press Save,
 * and the original is gone the same way.
 *
 * What this block CAN see: the serializer treats an `AttackChain` as an opaque
 * payload and passes the array through whole in both directions, so these cases
 * pin that contract — they go red the moment anything starts rebuilding chain
 * objects field-by-field (verified by mutation: dropping the field in `slimBuild`
 * fails two of them). What it CANNOT see is whether the modal's Save ever puts
 * the fields there in the first place; that is the store block below.
 */
describe('a chain remembers its caster form and its shift assumption', () => {
  // hydrateBuild rebuilds the inherent powers, which needs a live dataset.
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  // Two disjoint rosters, as a Peacebringer's human and Nova powers are. The
  // union roster means a real chain now sees both at once; what stays true is
  // that an id only resolves against a roster that HOLDS it, which is why the
  // payload has to be ids and not indices.
  const human = [mk('pri:Gleaming_Bolt'), mk('pri:Radiant_Strike')];
  const nova = [mk('pri:Bright_Nova_Blast'), mk('pri:Bright_Nova_Bolt')];

  it('ids resolve only against a roster that holds them — the loss the id format prevents', () => {
    const saved = sequenceToIds(nova, [0, 1, 0]);
    expect(saved).toEqual(['pri:Bright_Nova_Blast', 'pri:Bright_Nova_Bolt', 'pri:Bright_Nova_Blast']);
    expect(idsToSequence(nova, saved)).toEqual([0, 1, 0]);
    // Against a roster missing every one of them: nothing. Saving over that is
    // the bug the union roster now prevents by construction.
    expect(idsToSequence(human, saved)).toEqual([]);
  });

  it('round-trips startForm through the build serialization both ways', () => {
    const chain: AttackChain = {
      id: 'chain-1',
      name: 'Nova Rotation',
      powers: sequenceToIds(nova, [0, 1, 0]),
      startForm: 'Bright_Nova',
    };
    const build = createEmptyBuild();
    build.attackChains = [chain];

    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))));
    expect(restored.attackChains).toHaveLength(1);
    expect(restored.attackChains![0]).toEqual(chain);
    // The id format is the load-bearing part of the payload — `<bucket>:<internalName>`.
    expect(restored.attackChains![0].powers).toEqual([
      'pri:Bright_Nova_Blast', 'pri:Bright_Nova_Bolt', 'pri:Bright_Nova_Blast',
    ]);
    // …and it restores into the form it names, which is what makes the ids resolve.
    expect(idsToSequence(nova, restored.attackChains![0].powers)).toEqual([0, 1, 0]);
  });

  it('a human-form chain round-trips with an explicit null rather than a dropped field', () => {
    // Human form is null, not undefined-meaning-unknown: a chain saved before
    // this field existed is `undefined` and reads as human by the `?? null`
    // default, which is right — every pre-existing chain WAS built in human form
    // (the form selector could not save one). New human chains say so explicitly.
    const chain: AttackChain = {
      id: 'chain-2', name: 'Human', powers: sequenceToIds(human, [0, 1]), startForm: null,
    };
    const build = createEmptyBuild();
    build.attackChains = [chain];
    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))));
    expect(restored.attackChains![0].startForm).toBeNull();

    const legacy = { id: 'chain-3', name: 'Legacy', powers: ['pri:Gleaming_Bolt'] } as AttackChain;
    expect(legacy.startForm ?? null).toBeNull();
  });

  it('round-trips fullShiftAnimations through the build serialization both ways', () => {
    // A cross-form chain saved by a player who does NOT animation-cancel. Its
    // cycle and DPS were measured at the full shift cost; reloading it as if
    // they cancelled would silently re-price the rotation.
    const chain: AttackChain = {
      id: 'chain-4',
      name: 'Dwarf tank, no cancel',
      powers: ['pri:Gravity_Well', 'switch:Warshade_Tanker_Mode', 'pri:Black_Dwarf_Smite'],
      startForm: null,
      fullShiftAnimations: true,
    };
    const build = createEmptyBuild();
    build.attackChains = [chain];

    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))));
    expect(restored.attackChains![0]).toEqual(chain);
    expect(restored.attackChains![0].fullShiftAnimations).toBe(true);
    // The switch step's id survives verbatim — it is what makes the shift a
    // reproducible step rather than a gap the reload has to re-infer.
    expect(restored.attackChains![0].powers[1]).toBe('switch:Warshade_Tanker_Mode');
  });

  it('the two assumptions are independent — neither carries the other', () => {
    const build = createEmptyBuild();
    build.attackChains = [
      { id: 'a', name: 'cancelled, opens in Dwarf', powers: ['pri:X'], startForm: 'Warshade_Tanker_Mode', fullShiftAnimations: false },
      { id: 'b', name: 'full shift, opens human', powers: ['pri:X'], startForm: null, fullShiftAnimations: true },
    ];
    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))));
    const [a, b] = restored.attackChains!;
    expect(a.startForm).toBe('Warshade_Tanker_Mode');
    expect(a.fullShiftAnimations).toBe(false);
    expect(b.startForm).toBeNull();
    expect(b.fullShiftAnimations).toBe(true);
  });

  it('a chain saved before either field existed reads as the defaults, not as unknown', () => {
    // Every pre-existing chain was human-form and pre-dates switch steps, so it
    // pays no shift cost at all. `?? null` / `?? false` are therefore the right
    // reading of `undefined` and not a guess.
    const legacy = { id: 'old', name: 'Legacy', powers: ['pri:Gleaming_Bolt'] } as AttackChain;
    const build = createEmptyBuild();
    build.attackChains = [legacy];
    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))))!.attackChains![0];
    expect(restored.startForm ?? null).toBeNull();
    expect(restored.fullShiftAnimations ?? false).toBe(false);
  });

  it('survives a build with no chains at all', () => {
    const restored = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(createEmptyBuild()))));
    expect(restored.attackChains ?? []).toEqual([]);
  });
});

/**
 * The store's save/update actions must carry both assumptions onto the build.
 *
 * This is the write half of the round-trip above: the serializer proves the
 * fields survive storage, and these prove the modal's Save actually puts them
 * there. A `saveAttackChain` that dropped `fullShiftAnimations` would round-trip
 * a perfectly-preserved `undefined`.
 */
describe('saveAttackChain / updateAttackChain carry both assumptions', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  afterEach(() => {
    useBuildStore.setState((s) => ({ build: { ...s.build, attackChains: [] } }));
  });

  it('stores the opening form and the shift assumption on save', () => {
    const id = useBuildStore.getState().saveAttackChain(
      'Dwarf loop', ['pri:A', 'switch:Warshade_Tanker_Mode'], 'Warshade_Tanker_Mode', true,
    );
    const saved = useBuildStore.getState().build.attackChains!.find((c) => c.id === id)!;
    expect(saved.startForm).toBe('Warshade_Tanker_Mode');
    expect(saved.fullShiftAnimations).toBe(true);
  });

  it('defaults to human + cancelled shifts when the caller omits them', () => {
    const id = useBuildStore.getState().saveAttackChain('Plain', ['pri:A']);
    const saved = useBuildStore.getState().build.attackChains!.find((c) => c.id === id)!;
    expect(saved.startForm).toBeNull();
    expect(saved.fullShiftAnimations).toBe(false);
  });

  it('update rewrites both alongside the order — the overwrite this prevents', () => {
    const id = useBuildStore.getState().saveAttackChain('Loop', ['pri:A'], null, true);
    // The user flips the assumption off and re-saves. If update kept the stored
    // `true`, the chain would keep advertising numbers the user just rejected.
    useBuildStore.getState().updateAttackChain(id, ['pri:A', 'pri:B'], 'Warshade_Tanker_Mode', false);
    const saved = useBuildStore.getState().build.attackChains!.find((c) => c.id === id)!;
    expect(saved.powers).toEqual(['pri:A', 'pri:B']);
    expect(saved.startForm).toBe('Warshade_Tanker_Mode');
    expect(saved.fullShiftAnimations).toBe(false);
  });

  it('rename leaves both assumptions alone', () => {
    const id = useBuildStore.getState().saveAttackChain('Before', ['pri:A'], 'Warshade_Tanker_Mode', true);
    useBuildStore.getState().renameAttackChain(id, 'After');
    const saved = useBuildStore.getState().build.attackChains!.find((c) => c.id === id)!;
    expect(saved.name).toBe('After');
    expect(saved.startForm).toBe('Warshade_Tanker_Mode');
    expect(saved.fullShiftAnimations).toBe(true);
  });
});

/**
 * Cross-form gating depends on mode fields surviving a rehydrate.
 *
 * The persisted store keeps whole `SelectedPower` objects, and
 * `syncBuildDefinitions` is what repairs stale metadata on them at load. Its
 * `DefShape` listed name / internalName / effects / icon / powerType /
 * targetType / effectArea — and NOT the five mode-gating fields, which the
 * pool and epic facades only recently started carrying at all. So every build
 * persisted before that fix keeps pool clicks with no gate: `castableInMode`
 * sees `modesDisallowed === undefined`, reads it as "castable anywhere", and the
 * Attack Chain Builder offers Boxing inside Black Dwarf — with nothing for the
 * cross-form legality walk to catch, because the tag it checks is absent.
 *
 * Driven through the REAL rehydrate path (localStorage → persist.rehydrate),
 * because that is where the repair runs.
 */
describe('mode gates survive a rehydrate', () => {
  const KEY = 'coh-planner-build';
  /** Every AT hit-time mechanic off — none of them touch mode gating, and a
   *  neutral context keeps the roster's shape the only variable here. */
  const NO_AT_MECHANICS: AtMechanicContext = {
    archetypeId: 'warshade',
    containmentActive: false,
    scourgeActive: false,
    criticalHitsActive: false,
    stalkerCritActive: false,
    sentinelCritActive: false,
    effectiveHidden: false,
    stalkerTeamSize: 1,
  };

  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  afterEach(() => {
    localStorage.clear();
  });

  /** Boxing exactly as the Fighting pool defines it. The oracle for the test:
   *  if the shipped data ever stops gating it, the assertions below say so
   *  rather than passing vacuously against an empty expectation. */
  const boxingDef = (): SelectedPower => {
    const def = getPowerPool('fighting')?.powers.find((p) => p.internalName === 'Boxing');
    expect(def, 'Fighting pool ships Boxing').toBeDefined();
    return def as unknown as SelectedPower;
  };

  /** A power from a Warshade powerset, as the definition ships it. */
  const wsPower = (setId: string, internalName: string): SelectedPower => {
    const def = getPowerset(setId)?.powers.find((p) => p.internalName === internalName);
    expect(def, `${setId} ships ${internalName}`).toBeDefined();
    return def as unknown as SelectedPower;
  };
  const asSelected = (def: SelectedPower, level: number, powerSet: string): SelectedPower =>
    ({ ...def, level, slots: [null], powerSet } as SelectedPower);

  /**
   * A Warshade that can actually shapeshift — Black Dwarf plus one of its
   * attacks — whose stored Boxing has had the five mode fields stripped, which
   * is the exact shape a pre-fix save has on disk.
   *
   * The form toggle matters: `castableModes` is only emitted for a build that
   * can enter a form, so a fixture without one would assert the field's absence
   * and prove nothing.
   */
  function legacyWarshadeSave(): { build: Build; gatedModes: string[] } {
    const def = boxingDef();
    const gatedModes = def.modesDisallowed ?? [];
    expect(gatedModes, 'shipped Boxing is mode-gated at all').not.toHaveLength(0);
    expect(gatedModes, 'and specifically inside Black Dwarf').toContain('Warshade_Tanker_Mode');

    const build = createEmptyBuild();
    build.serverId = 'homecoming';
    build.archetype = { ...build.archetype, id: 'warshade', name: 'Warshade' };
    build.level = 50;
    build.primary = {
      id: 'warshade/umbral-blast',
      name: 'Umbral Blast',
      powers: [asSelected(wsPower('warshade/umbral-blast', 'Gravity_Well'), 1, 'warshade/umbral-blast')],
    };
    build.secondary = {
      id: 'warshade/umbral-aura',
      name: 'Umbral Aura',
      powers: [
        asSelected(wsPower('warshade/umbral-aura', 'Black_Dwarf'), 20, 'warshade/umbral-aura'),
        {
          ...asSelected(wsPower('warshade/umbral-aura', 'Black_Dwarf_Smite'), 20, 'warshade/umbral-aura'),
          isAutoGranted: true,
          grantedByPower: 'Black_Dwarf',
        },
      ],
    };
    // Strip exactly what the old DefShape could not restore.
    const stripped = asSelected(def, 4, 'fighting');
    delete stripped.setsModes;
    delete stripped.modesRequired;
    delete stripped.modesDisallowed;
    delete stripped.modesSuspended;
    delete stripped.modeVariants;
    build.pools = [{ id: 'fighting', name: 'Fighting', powers: [stripped] }];
    return { build, gatedModes };
  }

  const rehydrateFrom = (build: Build) => {
    localStorage.setItem(KEY, JSON.stringify({ state: composePersistedState(build, {}), version: 1 }));
    return useBuildStore.persist.rehydrate();
  };

  it('precondition: the stored power really is ungated before the sync runs', () => {
    const { build } = legacyWarshadeSave();
    expect(build.pools[0].powers[0].modesDisallowed).toBeUndefined();
  });

  it('restores the mode gates onto a pool power saved without them', async () => {
    const { build, gatedModes } = legacyWarshadeSave();
    await rehydrateFrom(build);

    const boxing = useBuildStore.getState().build.pools
      .flatMap((p) => p.powers)
      .find((p) => p.internalName === 'Boxing');
    expect(boxing, 'Boxing survived the rehydrate').toBeDefined();
    expect(boxing!.modesDisallowed, 'gates restored from the definition').toEqual(gatedModes);
  });

  it('and that is what makes cross-form gating see it — Boxing is not castable in Dwarf', async () => {
    const { build } = legacyWarshadeSave();
    await rehydrateFrom(build);
    const synced = useBuildStore.getState().build;

    // The CONSEQUENCE, not just the field. `buildChainPowers` tags every
    // candidate with the caster forms it may be cast in, and that tag is the only
    // thing the cross-form legality walk has to check. With the gates missing,
    // Boxing reads as castable everywhere and a Boxing scheduled inside Black
    // Dwarf is never flagged.
    const chain = buildChainPowers(synced, {} as never, NO_AT_MECHANICS);
    const boxing = chain.find((c) => c.id.endsWith(':Boxing'));
    expect(boxing, 'Boxing is a chain candidate').toBeDefined();
    expect(boxing!.castableModes, 'human only — never inside the Dwarf form').toEqual([null]);

    // Its Dwarf counterpart is the mirror: castable only inside the form.
    const smite = chain.find((c) => c.id.endsWith(':Black_Dwarf_Smite'));
    expect(smite, 'Black Dwarf Smite is a chain candidate').toBeDefined();
    expect(smite!.castableModes).toEqual(['Warshade_Tanker_Mode']);

    // …and the shift between them exists as a step, which is what the palette
    // renders as a "→ Black Dwarf" chip.
    const toDwarf = chain.find((c) => c.id === 'switch:Warshade_Tanker_Mode');
    expect(toDwarf?.type).toBe('switch');
    expect(toDwarf?.switchTo).toBe('Warshade_Tanker_Mode');
    const toHuman = chain.find((c) => c.id === 'switch:human');
    expect(toHuman, 'a way back to human exists').toBeDefined();
    expect(toHuman!.switchTo, 'null is the human form, not a missing value').toBeNull();
  });

  it('a gate the game data no longer carries is CLEARED, not left behind', async () => {
    // The other direction. An override that lingers after the source dropped it
    // freezes an old rule on top of correct data — so the def wins both ways.
    const def = boxingDef();
    const build = createEmptyBuild();
    build.serverId = 'homecoming';
    build.level = 50;
    const invented = {
      ...def,
      level: 4,
      slots: [null],
      powerSet: 'fighting',
      modesRequired: ['Some_Retired_Mode'],
    } as SelectedPower;
    build.pools = [{ id: 'fighting', name: 'Fighting', powers: [invented] }];
    await rehydrateFrom(build);

    const boxing = useBuildStore.getState().build.pools
      .flatMap((p) => p.powers)
      .find((p) => p.internalName === 'Boxing')!;
    expect(boxing.modesRequired ?? undefined, 'stale requirement dropped').toBeUndefined();
  });

  it('a primary powerset power keeps its gates through the same sync', async () => {
    // Not pool-specific: the primary/secondary branch runs the same helper, and
    // the Kheldian form attacks are where the gates matter most.
    const set = getPowerset('warshade/umbral-blast');
    const gated = set?.powers.find((p) => (p.modesDisallowed?.length ?? 0) > 0);
    expect(gated, 'Umbral Blast ships at least one mode-gated power').toBeDefined();

    const build = createEmptyBuild();
    build.serverId = 'homecoming';
    build.level = 50;
    const stripped = { ...gated, level: 1, slots: [null], powerSet: 'warshade/umbral-blast' } as SelectedPower;
    delete stripped.modesDisallowed;
    build.primary = { id: 'warshade/umbral-blast', name: 'Umbral Blast', powers: [stripped] };
    await rehydrateFrom(build);

    const synced = useBuildStore.getState().build.primary.powers
      .find((p) => p.internalName === gated!.internalName)!;
    expect(synced.modesDisallowed).toEqual(gated!.modesDisallowed);
  });
});
