import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset, GRANTED_POWER_GROUPS } from '@/data';
import { createEmptyBuild } from '@/types/build';
import { calculateCharacterTotals } from './character-totals';
import { createDefaultIncarnateActiveState } from '@/types/incarnate';
import { buildChainPowers, buildFormModes } from './attack-chain-powers';
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

  const chainNames = (build: Build, formMode: string | null) => {
    const calc = calculateCharacterTotals(build, false, createDefaultIncarnateActiveState(), {});
    return buildChainPowers(
      build,
      calc.globalBonuses,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { archetypeId: 'peacebringer' } as any,
      {},
      { formMode },
    ).map((p) => p.name);
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
    // …and its chain is unchanged by the new candidate rules.
    expect(chainNames(b, null).sort()).toEqual(['Jab', 'Punch']);
  });

  it('human form shows the human attacks and none of the form attacks', () => {
    const names = chainNames(peacebringerBuild(), null);
    expect(names).toContain('Gleaming Bolt');
    expect(names).toContain('Radiant Strike');
    expect(names.filter((n) => /Nova|Dwarf/.test(n))).toEqual([]);
  });

  it('each form shows its own attacks and drops the ones it disallows', () => {
    const build = peacebringerBuild();
    const [first, second] = buildFormModes(build);
    const byMode = new Map([first, second].map((m) => [m, chainNames(build, m)]));

    for (const [mode, names] of byMode) {
      expect(names.length, `${mode} has castable powers`).toBeGreaterThan(0);
      // Radiant Strike is disallowed in both forms and has no redirect into either.
      expect(names, `${mode} drops a disallowed human attack`).not.toContain('Radiant Strike');
    }

    // The two forms' rosters are disjoint: each form's attacks require that form.
    const [a, b] = [...byMode.values()];
    expect(a.filter((n) => b.includes(n)), 'the two forms share no attack').toEqual([]);

    // Every form attack the build holds is reachable from exactly one of them.
    const formAttacks = [
      ...GRANTED_POWER_GROUPS['Bright_Nova'].grantedPowers,
      ...GRANTED_POWER_GROUPS['White_Dwarf'].grantedPowers,
    ];
    const reachable = new Set([...a, ...b]);
    const missing = formAttacks
      .map((internal) => internal.replace(/_/g, ' '))
      // Sublimation/Step/Antagonize are clicks like the rest; all should appear.
      .filter((display) => !reachable.has(display));
    expect(missing, 'every granted form attack reaches a form').toEqual([]);
  });

  it('a redirecting tier-one attack follows the caster into the form it redirects for', () => {
    const build = peacebringerBuild();
    const modes = buildFormModes(build);
    // Gleaming Bolt disallows Nova and redirects under Dwarf; Glinting Eye is the reverse.
    // Each must therefore appear in exactly one form — the one it is NOT disallowed in.
    for (const name of ['Gleaming Bolt', 'Glinting Eye']) {
      const appearsIn = modes.filter((m) => chainNames(build, m).includes(name));
      expect(appearsIn, `${name} follows into exactly one form`).toHaveLength(1);
    }
  });

  it('a form attack casts with the form power’s own timing, not the human power’s', () => {
    const build = peacebringerBuild();
    const modes = buildFormModes(build);
    const casts = modes.flatMap((m) =>
      buildChainPowers(
        build,
        calculateCharacterTotals(build, false, createDefaultIncarnateActiveState(), {}).globalBonuses,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { archetypeId: 'peacebringer' } as any,
        {},
        { formMode: m },
      ),
    );
    expect(casts.length).toBeGreaterThan(0);
    for (const power of casts) {
      expect(power.cast, `${power.name} has a real cast time`).toBeGreaterThan(0);
      expect(power.baseRecharge, `${power.name} has a recharge`).toBeGreaterThanOrEqual(0);
    }
  });
});
