import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset, getAllPowerPools, GRANTED_POWER_GROUPS } from '@/data';
import { createEmptyBuild } from '@/types/build';
import { calculateCharacterTotals } from './character-totals';
import { createDefaultIncarnateActiveState } from '@/types/incarnate';
import { buildChainPowers, buildFormModes } from './attack-chain-powers';
import type { ChainPower } from './attack-chain';
import type { Build, SelectedPower } from '@/types';

/**
 * Kheldian form attacks belong in the attack chain builder (reported 2026-07-31).
 *
 * Nova and Dwarf attacks were absent entirely. Two things kept them out: `collectCandidates`
 * dropped every `isAutoGranted` power (a form's attacks are auto-granted by its toggle, since
 * they cost no pick), and the chain had no notion of a caster form to put them in.
 *
 * The gate is the binary's own, not a list of which archetypes have forms: a power carries
 * `modesRequired` for the form it needs and `modesDisallowed` for the forms that refuse it,
 * and a power with a `modeVariants` redirect into a form is absent from the latter because the
 * game plays the form's version instead. `modesDisallowed` had been dropped by the converter
 * as "Disable_All noise" — true of the bulk, and it took the form gating with it.
 *
 * The roster is now a UNION across forms rather than one form's slice (cross-form chains), so
 * these assertions moved with it: the gate is no longer "which powers came back" but the
 * `castableModes` tag each power came back carrying. The underlying rule is unchanged, and the
 * disjointness and completeness properties below still pin it.
 */
describe('Attack chain form selector', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  /** A Peacebringer holding both form toggles, with each form's auto-granted attacks.
   *  Nova lives in the primary (Luminous Blast), Dwarf in the secondary (Luminous Aura). */
  function pick(powersetId: string, names: string[], granting?: string[]): SelectedPower[] {
    const powerset = getPowerset(powersetId);
    expect(powerset, `${powersetId} resolves`).toBeDefined();
    const picked: SelectedPower[] = [];
    const take = (name: string, parent?: string) => {
      const def = powerset!.powers.find((p) => p.internalName === name);
      expect(def, `${name} is in ${powersetId}`).toBeDefined();
      picked.push({
        ...def!,
        powerSet: powersetId,
        level: 1,
        slots: [],
        isActive: true,
        ...(parent ? { isAutoGranted: true, grantedByPower: parent } : {}),
      } as SelectedPower);
    };
    for (const name of names) take(name);
    // The shape buildStore produces when a form toggle is picked: its attacks arrive
    // auto-granted, costing no pick.
    for (const parent of granting ?? []) {
      for (const grant of GRANTED_POWER_GROUPS[parent].grantedPowers) take(grant, parent);
    }
    return picked;
  }

  function peacebringerBuild(): Build {
    const build = createEmptyBuild();
    build.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build.archetype = { id: 'peacebringer', name: 'Peacebringer', stats: null, inherent: null } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build.primary = {
      id: 'peacebringer/luminous-blast',
      name: 'Luminous Blast',
      powers: pick('peacebringer/luminous-blast', ['Gleaming_Bolt', 'Glinting_Eye', 'Radiant_Strike', 'Bright_Nova'], ['Bright_Nova']),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build.secondary = {
      id: 'peacebringer/luminous-aura',
      name: 'Luminous Aura',
      powers: pick('peacebringer/luminous-aura', ['White_Dwarf'], ['White_Dwarf']),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    return build;
  }

  const chainPowers = (build: Build): ChainPower[] => {
    const calc = calculateCharacterTotals(build, false, createDefaultIncarnateActiveState(), {});
    return buildChainPowers(
      build,
      calc.globalBonuses,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { archetypeId: 'peacebringer' } as any,
    );
  };
  /** Attack/utility candidates only — the form SWITCHES are chain steps too, but they are
   *  synthesized rather than collected and have their own tests. */
  const chainNames = (build: Build) =>
    chainPowers(build).filter((p) => p.type !== 'switch').map((p) => p.name);
  /** The caster forms `name` can be cast in, as the chain tagged it. */
  const modesOf = (powers: ChainPower[], name: string): (string | null)[] => {
    const p = powers.find((x) => x.name === name);
    expect(p, `${name} is in the union roster`).toBeDefined();
    expect(p!.castableModes, `${name} carries a mode tag`).toBeDefined();
    return p!.castableModes!;
  };

  it('offers exactly the two forms the build can enter and that gate its powers', () => {
    const modes = buildFormModes(peacebringerBuild());
    expect(modes).toHaveLength(2);
    // Derived from the data, so assert the property rather than the ids: each is set by a
    // power in the build AND gates one of its clicks. `Suppress_PoolToggles` and
    // `Disable_Walk` are also set by the form toggles and must NOT be offered.
    expect(modes).not.toContain('Suppress_PoolToggles');
    expect(modes).not.toContain('Disable_Walk');
    expect(new Set(modes).size).toBe(2);
  });

  it('a build with no form gets no selector', () => {
    const b = createEmptyBuild();
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'tanker', name: 'Tanker', stats: null, inherent: null } as any;
    const ss = getPowerset('tanker/super-strength');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.secondary = {
      id: 'tanker/super-strength', name: 'Super Strength',
      powers: ['Jab', 'Punch'].map((n) => ({
        ...ss!.powers.find((p) => p.internalName === n),
        powerSet: 'tanker/super-strength', level: 1, slots: [], isActive: true,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    expect(buildFormModes(b)).toEqual([]);
    // …and its chain is unchanged by the new candidate rules: same two powers, no switch
    // steps to offer, and no `castableModes` tag (there is no form to be legal in).
    expect(chainNames(b).sort()).toEqual(['Jab', 'Punch']);
    expect(chainPowers(b).filter((p) => p.type === 'switch')).toEqual([]);
    expect(chainPowers(b).every((p) => p.castableModes === undefined)).toBe(true);
  });

  /** A pool pick plus the rider its toggle auto-grants, shaped the way buildStore stores
   *  them: the rider carries `isAutoGranted` and the pool's empty `boosts_allowed`. */
  function poolPowers(poolId: string, picked: string, granted: string): SelectedPower[] {
    const pool = getAllPowerPools()[poolId];
    expect(pool, `${poolId} pool resolves`).toBeDefined();
    const take = (name: string, auto: boolean): SelectedPower => {
      const def = pool!.powers.find((p) => p.internalName === name);
      expect(def, `${name} is in ${poolId}`).toBeDefined();
      return {
        ...def!, powerSet: poolId, level: 1, slots: [], isActive: true,
        ...(auto ? { isAutoGranted: true, grantedByPower: picked } : {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as SelectedPower;
    };
    return [take(picked, false), take(granted, true)];
  }

  /**
   * A travel toggle's free rider is not a form.
   *
   * Three HC pools hold a complete setter/gate pair on their own — Speed of Sound → Jaunt,
   * Mighty Leap → Stomp, Mystic Flight → Translocation — where the toggle `setsModes` its
   * `*On` mode and the rider is a Click carrying it in `modesRequired`. Those satisfy
   * `buildFormModes`' settable-AND-gating rule literally, so once the pool facade started
   * carrying the mode fields at all, every Sorcery build was offered a bogus "Mystic Flight
   * active" form whose roster is identical to Human's. The rider is auto-granted with an
   * empty `boosts_allowed` and so can never sit in a chain — the same reason
   * `collectCandidates` drops it — which is what disqualifies it as a gate.
   */
  it('a travel toggle and its auto-granted rider are not a caster form', () => {
    const b = createEmptyBuild();
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'tanker', name: 'Tanker', stats: null, inherent: null } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.pools = [{ id: 'sorcery', name: 'Sorcery',
      powers: poolPowers('sorcery', 'Mystic_Flight', 'Translocation') } as any];
    // The pair really is a settable+gating match — otherwise this test grades air.
    const set = b.pools![0].powers!.find((p) => p.internalName === 'Mystic_Flight');
    const rider = b.pools![0].powers!.find((p) => p.internalName === 'Translocation');
    expect(set?.setsModes, 'Mystic Flight sets its mode').toContain('MysticFlightOn');
    expect(rider?.modesRequired, 'Translocation requires it').toContain('MysticFlightOn');
    expect(rider?.powerType, 'and is a Click').toBe('Click');
    expect(rider?.allowedEnhancements ?? [], 'and is unslottable').toHaveLength(0);

    expect(buildFormModes(b)).toEqual([]);
  });

  it('a real form survives a travel toggle sitting beside it', () => {
    const build = peacebringerBuild();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build.pools = [{ id: 'sorcery', name: 'Sorcery',
      powers: poolPowers('sorcery', 'Mystic_Flight', 'Translocation') } as any];
    const modes = buildFormModes(build);
    expect(modes, 'still exactly Nova and Dwarf').toHaveLength(2);
    expect(modes).not.toContain('MysticFlightOn');
  });

  it('the roster is a union across forms, with each power tagged for the forms it works in', () => {
    // Before cross-form chains this list was a per-form SLICE: asking for human form
    // returned the human attacks only, and a Nova attack simply was not there. A chain that
    // can shapeshift mid-rotation needs them all present at once — the palette dims what the
    // live form cannot cast instead of hiding it — so the gate moved onto the tag.
    const powers = chainPowers(peacebringerBuild());
    const names = powers.filter((p) => p.type !== 'switch').map((p) => p.name);
    expect(names).toContain('Gleaming Bolt');
    expect(names).toContain('Radiant Strike');
    expect(names.filter((n) => /Nova|Dwarf/.test(n)).length, 'form attacks are present too')
      .toBeGreaterThan(0);

    // Human-only, because it is disallowed in both forms and redirects into neither.
    expect(modesOf(powers, 'Radiant Strike')).toEqual([null]);
    // …and every form attack excludes human, which is what the palette dims on.
    for (const p of powers) {
      if (!/Nova|Dwarf/.test(p.name) || p.type === 'switch') continue;
      expect(p.castableModes, `${p.name} is not castable in human form`).not.toContain(null);
    }
  });

  it('each form’s attacks are castable only in that form, and every one is reachable', () => {
    const build = peacebringerBuild();
    const powers = chainPowers(build).filter((p) => p.type !== 'switch');
    const [first, second] = buildFormModes(build);
    const rosterFor = (mode: string) =>
      powers.filter((p) => p.castableModes?.includes(mode)).map((p) => p.name);
    const byMode = new Map([first, second].map((m) => [m, rosterFor(m)]));

    for (const [mode, names] of byMode) {
      expect(names.length, `${mode} has castable powers`).toBeGreaterThan(0);
      // Radiant Strike is disallowed in both forms and has no redirect into either.
      expect(names, `${mode} drops a disallowed human attack`).not.toContain('Radiant Strike');
    }

    // The two forms' AUTO-GRANTED rosters are disjoint: each form's attacks require that
    // form. (The overlap between them is exactly the human powers that redirect into one or
    // the other, which is why this filters to the granted set rather than the whole roster.)
    const granted = new Set([
      ...GRANTED_POWER_GROUPS['Bright_Nova'].grantedPowers,
      ...GRANTED_POWER_GROUPS['White_Dwarf'].grantedPowers,
    ].map((internal) => internal.replace(/_/g, ' ')));
    const [a, b] = [...byMode.values()].map((names) => names.filter((n) => granted.has(n)));
    expect(a.length, 'the first form has granted attacks').toBeGreaterThan(0);
    expect(b.length, 'and so does the second').toBeGreaterThan(0);
    expect(a.filter((n) => b.includes(n)), 'the two forms share no granted attack').toEqual([]);

    // Every form attack the build holds is reachable from exactly one of them.
    const reachable = new Set([...a, ...b]);
    // Sublimation/Step/Antagonize are clicks like the rest; all should appear.
    const missing = [...granted].filter((display) => !reachable.has(display));
    expect(missing, 'every granted form attack reaches a form').toEqual([]);
  });

  it('a redirecting tier-one attack follows the caster into the form it redirects for', () => {
    const build = peacebringerBuild();
    const powers = chainPowers(build);
    const modes = buildFormModes(build);
    // Gleaming Bolt disallows Nova and redirects under Dwarf; Glinting Eye is the reverse.
    // Each is therefore castable in human plus exactly one form — the one it is NOT
    // disallowed in — and carries that form's variant as a `mode` form on the SAME power,
    // not as a second entry (one tray slot, one recharge lane).
    for (const name of ['Gleaming Bolt', 'Glinting Eye']) {
      const castable = modesOf(powers, name);
      expect(castable, `${name} is castable in human`).toContain(null);
      expect(castable.filter((m) => m !== null), `${name} follows into exactly one form`)
        .toHaveLength(1);
      const p = powers.find((x) => x.name === name)!;
      const form = castable.find((m) => m !== null)!;
      expect(modes, 'and it is one of the offered forms').toContain(form);
      expect(
        p.forms?.filter((f) => f.trigger.type === 'mode' && f.trigger.mode === form),
        `${name} carries the ${form} variant as a sibling form`,
      ).toHaveLength(1);
      expect(powers.filter((x) => x.name === name), 'and appears once in the union').toHaveLength(1);
    }
  });

  it('a form attack casts with the form power’s own timing, not the human power’s', () => {
    const build = peacebringerBuild();
    const powers = chainPowers(build);
    expect(powers.length).toBeGreaterThan(0);
    for (const power of powers) {
      expect(power.cast, `${power.name} has a real cast time`).toBeGreaterThan(0);
      expect(power.baseRecharge, `${power.name} has a recharge`).toBeGreaterThanOrEqual(0);
      for (const f of power.forms ?? []) {
        expect(f.cast, `${power.name} / ${f.id} has a real cast time`).toBeGreaterThan(0);
      }
    }
    // Glinting Eye's Nova redirect authors its OWN cast (1.5s against the human 1.67s) — the
    // whole point of resolving the redirect rather than reusing the human numbers.
    const eye = powers.find((p) => p.name === 'Glinting Eye')!;
    const nova = eye.forms!.find((f) => f.trigger.type === 'mode')!;
    expect(nova.cast).not.toBeCloseTo(eye.cast, 6);
  });
});
