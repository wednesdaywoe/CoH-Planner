// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data/powersets';
import { useBuildStore } from '@/stores/buildStore';
import { applyFormVariant, applyModeRedirect } from '@/components/info/resolveEffectivePower';
import { selectableModes } from '@/utils/mode-suppression';
import type { Power } from '@/types/power';

/**
 * A power's own toggle publishes every mode it SETS, not just the ones the form selector offers.
 *
 * The 2026-08-19 report: with Power Boost running, Stun still displayed its single-target form
 * at 12s instead of the AoE form at 90s. The redirect data was right and `resolveEffectivePower`
 * was right — handed `BoostPower`, it returns the AoE record. What was wrong sat upstream of
 * both: `togglePower` filtered the toggled power's `setsModes` through `selectableModes`, which
 * collects `modeVariants` KEYS only. No power carries a `BoostPower` modeVariant (Stun reads the
 * mode from a `formVariants` condition instead), so the mode was dropped on the way in and
 * `kBoostPower Source.Mode?` could never be true.
 *
 * The gate that should have caught it supplied its own input: `powerProjectionParity` builds the
 * Build by hand and unions `setsModes` with no filter, so it graded the resolver against an
 * `activeModes` the UI has no writer for. These drive the real store toggle instead.
 */

const emBuild = () =>
  JSON.stringify({
    version: 4,
    build: {
      name: 'BoostPower repro',
      serverId: 'homecoming',
      archetype: { id: 'blaster', name: 'Blaster' },
      level: 50,
      progressionMode: 'auto',
      primary: {
        id: 'blaster/fire-blast',
        name: 'Fire Blast',
        powers: [{ name: 'Fire Blast', internalName: 'Fire_Blast', level: 1, slots: [null] }],
      },
      secondary: {
        id: 'blaster/energy-manipulation',
        name: 'Energy Manipulation',
        powers: [
          { name: 'Energy Punch', internalName: 'Energy_Punch', level: 1, slots: [null] },
          { name: 'Stun', internalName: 'Stun', level: 20, slots: [null] },
          { name: 'Power Boost', internalName: 'Power_Boost', level: 24, slots: [null] },
        ],
      },
      pools: [],
      inherents: [],
      accolades: [],
      sets: {},
      settings: { origin: 'Natural' },
      slotOrder: [],
    },
  });

const warshadeBuild = () =>
  JSON.stringify({
    version: 4,
    build: {
      name: 'form vs toggle',
      serverId: 'homecoming',
      archetype: { id: 'warshade', name: 'Warshade' },
      level: 50,
      progressionMode: 'auto',
      primary: {
        id: 'warshade/umbral-blast',
        name: 'Umbral Blast',
        powers: [{ name: 'Shadow Bolt', internalName: 'Shadow_Bolt', level: 1, slots: [null] }],
      },
      secondary: {
        id: 'warshade/umbral-aura',
        name: 'Umbral Aura',
        powers: [
          { name: 'Absorption', internalName: 'Absorption', level: 1, slots: [null] },
          { name: 'Shadow Cloak', internalName: 'Shadow_Cloak', level: 20, slots: [null] },
        ],
      },
      pools: [],
      inherents: [],
      accolades: [],
      sets: {},
      settings: { origin: 'Natural' },
      slotOrder: [],
    },
  });

const secondaryDefs = () => (getPowerset('blaster/energy-manipulation')?.powers ?? []) as Power[];
const def = (internalName: string) => {
  const p = secondaryDefs().find((x) => x.internalName === internalName);
  expect(p, `${internalName} must be in Energy Manipulation`).toBeTruthy();
  return p!;
};

const powerBoost = () =>
  useBuildStore.getState().build.secondary.powers.find((p) => p.internalName === 'Power_Boost');
const liveModes = () => useBuildStore.getState().build.activeModes ?? [];

beforeAll(async () => {
  await loadDataset('homecoming');
}, 120_000);

afterEach(() => {
  localStorage.clear();
  useBuildStore.getState().resetBuild();
});

describe('a toggled power publishes the modes it sets', () => {
  it('the mode Stun reads is NOT a modeVariants key, so the selector cannot be its writer', () => {
    // Vacuity guard: were BoostPower ever to become selectable, the old filter would pass it
    // through and every assertion below would go green for the wrong reason.
    expect(selectableModes(secondaryDefs())).not.toContain('BoostPower');
    expect(def('Power_Boost').setsModes).toContain('BoostPower');
    const gates = (def('Stun').formVariants ?? []).flatMap((v) => v.condition);
    expect(gates, 'Stun must gate a variant on the mode').toContain('kBoostPower');
  });

  it('toggling Power Boost on publishes BoostPower, and off retracts it', () => {
    expect(useBuildStore.getState().importBuild(emBuild())).toBe(true);
    expect(powerBoost(), 'Power Boost must be selected').toBeTruthy();

    if (powerBoost()!.isActive) useBuildStore.getState().togglePowerActive('Power_Boost');
    expect(liveModes(), 'absent while the power is off').not.toContain('BoostPower');

    useBuildStore.getState().togglePowerActive('Power_Boost');
    expect(powerBoost()!.isActive).toBe(true);
    expect(liveModes(), 'toggling on must publish the mode').toContain('BoostPower');

    useBuildStore.getState().togglePowerActive('Power_Boost');
    expect(liveModes(), 'toggling off must retract the mode').not.toContain('BoostPower');
  });

  it('switching form replaces the form and leaves a toggle-published mode standing', () => {
    // A Warshade holds both kinds at once: the Nova/Dwarf forms the selector offers, and
    // Shadow Cloak, whose `Hidden_Attack` no selector lists. Before the fix `activeModes` only
    // ever held selectable modes, so the selector could replace it wholesale; now that a toggle
    // publishes into the same field, a wholesale replace would switch Shadow Cloak's mode off
    // without switching Shadow Cloak off, and only its own toggle can put it back.
    expect(useBuildStore.getState().importBuild(warshadeBuild())).toBe(true);
    const cloak = () =>
      useBuildStore.getState().build.secondary.powers.find((p) => p.internalName === 'Shadow_Cloak');
    expect(cloak(), 'Shadow Cloak must be selected').toBeTruthy();

    if (!cloak()!.isActive) useBuildStore.getState().togglePowerActive('Shadow_Cloak');
    expect(liveModes()).toContain('Hidden_Attack');

    const forms = selectableModes(
      (getPowerset('warshade/umbral-blast')?.powers ?? []) as Power[],
    );
    expect(forms.length, 'the Warshade blast set must offer a form').toBeGreaterThan(0);

    useBuildStore.getState().setActiveModes([forms[0]]);
    expect(liveModes(), 'the selected form goes live').toContain(forms[0]);
    expect(liveModes(), 'the toggle-published mode survives the form switch').toContain('Hidden_Attack');

    useBuildStore.getState().setActiveModes([]);
    expect(liveModes(), 'clearing the form does not clear the toggle').toContain('Hidden_Attack');
    expect(liveModes(), 'the form itself is gone').not.toContain(forms[0]);
  });

  it('a build that arrives with the power already on heals on load', () => {
    // The incremental writer only runs on a toggle, so a build that was SAVED with Power Boost
    // running never passes through it — every build stored before the writer was fixed is in
    // exactly that state, and so is any hash deeplink or auto-activated pick. Without the load
    // funnel reconciling, the redirect stays unresolved until the user toggles the power off
    // and on by hand.
    const withPowerBoostOn = JSON.parse(emBuild());
    for (const p of withPowerBoostOn.build.secondary.powers) {
      if (p.internalName === 'Power_Boost') p.isActive = true;
    }
    // ...and no activeModes at all, which is what the old writer left behind.
    delete withPowerBoostOn.build.activeModes;

    expect(useBuildStore.getState().importBuild(JSON.stringify(withPowerBoostOn))).toBe(true);
    expect(powerBoost()!.isActive, 'the stored active flag survives').toBe(true);
    expect(liveModes(), 'load reconciles the mode from the active power').toContain('BoostPower');
  });

  it('a build stored with the power OFF does not gain the mode on load', () => {
    const off = JSON.parse(emBuild());
    for (const p of off.build.secondary.powers) {
      if (p.internalName === 'Power_Boost') p.isActive = false;
    }
    off.build.activeModes = ['BoostPower']; // stale the other way
    expect(useBuildStore.getState().importBuild(JSON.stringify(off))).toBe(true);
    expect(liveModes(), 'an inactive publisher retracts its stale mode').not.toContain('BoostPower');
  });

  it('Stun reads as the 90s AoE form under the modes the store actually publishes', () => {
    const ctxFor = (modes: readonly string[]) => {
      const live = new Set<string>();
      for (const m of modes) {
        live.add(m.toLowerCase());
        live.add(`k${m.toLowerCase()}`);
      }
      live.add('koutofcombat');
      live.add('outofcombat');
      return { liveModes: live, ownsPower: () => true, ownedPowerCount: () => 1, currentToHit: 0.75 };
    };
    const resolve = (modes: readonly string[]) =>
      applyFormVariant(applyModeRedirect(def('Stun'), modes), ctxFor(modes) as never) as Power;

    const base = resolve([]);
    expect(base.stats?.recharge, 'no modes live: the base record stands').toBe(12);
    expect(base.effectArea).toBe('SingleTarget');

    expect(useBuildStore.getState().importBuild(emBuild())).toBe(true);
    if (!powerBoost()!.isActive) useBuildStore.getState().togglePowerActive('Power_Boost');

    // The modes the STORE publishes, not a hand-written list — that substitution is the bug.
    const boosted = resolve(liveModes());
    expect(boosted.stats?.recharge, 'Power Boost makes Stun the 90s AoE').toBe(90);
    expect(boosted.effectArea).toBe('AoE');
  });
});
