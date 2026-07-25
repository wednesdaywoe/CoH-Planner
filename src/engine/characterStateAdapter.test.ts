import { describe, it, expect } from 'vitest';
import { createEmptyBuild } from '@/types/build';
import type { Build } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import type { Enhancement } from '@/types/enhancement';
import { toCharacterState, type AdapterCalcContext } from './characterStateAdapter';

function defaultCtx(overrides: Partial<AdapterCalcContext> = {}): AdapterCalcContext {
  return {
    exemplarMode: false,
    exemplarLevel: 50,
    incarnateActive: { alpha: false, destiny: false, hybrid: false, interface: false, judgement: false, lore: false, genesis: false },
    incarnateLevelShiftActive: true,
    targetsHitValues: {},
    targetLevelOffset: 0,
    vigilanceTeamSize: 0,
    furyLevel: 75,
    combatMode: false,
    destinyTime: null,
    globalAdjusters: {},
    mechanicAdjusters: {},
    ...overrides,
  };
}

function power(overrides: Partial<SelectedPower> & Pick<SelectedPower, 'internalName' | 'powerSet' | 'level' | 'slots'>): SelectedPower {
  // Only the fields the adapter reads matter; the rest of the Power def is stripped.
  return overrides as SelectedPower;
}

describe('toCharacterState', () => {
  it('maps an empty build to the engine wire shape', () => {
    const build = createEmptyBuild('homecoming');
    const state = toCharacterState(build, defaultCtx());

    expect(state.dataset).toBe('homecoming');
    expect(state.combat.vigilance_team_size).toBe(1); // beta 0 (solo) → engine 1 (solo)
    expect(state.combat.hit_points_percent).toBe(100);
    expect(state.combat.exemplar_level).toBeNull();
    expect(state.incarnates).toEqual({
      alpha: null, judgement: null, interface: null, destiny: null, lore: null, hybrid: null, genesis: null,
    });
  });

  it('reshapes exemplar mode+level into an Option and offsets vigilance', () => {
    const build = createEmptyBuild('rebirth');
    const state = toCharacterState(build, defaultCtx({ exemplarMode: true, exemplarLevel: 30, vigilanceTeamSize: 3 }));
    expect(state.combat.exemplar_level).toBe(30);
    expect(state.combat.vigilance_team_size).toBe(4);
  });

  it('strips the Power def to identity and maps each enhancement kind', () => {
    const ioSet: Enhancement = { type: 'io-set', id: 's0', name: 'Acc/Dam', icon: '', level: 50, attuned: false, boost: 3, setId: 'thunderstrike', setName: 'Thunderstrike', pieceNum: 1, aspects: ['Accuracy', 'Damage'], isProc: false, isUnique: false };
    const generic: Enhancement = { type: 'io-generic', id: 'g0', name: 'Damage IO', icon: '', stat: 'Damage', value: 0 };
    const special: Enhancement = { type: 'special', id: 'h0', name: 'Nucleolus', icon: '', category: 'hamidon', aspects: [{ stat: 'Damage', value: 0.33 }] };
    const origin: Enhancement = { type: 'origin', id: 'o0', name: 'Damage SO', icon: '', tier: 'SO', origin: 'Magic', stat: 'Damage', value: 0.333 };

    const build: Build = {
      ...createEmptyBuild('homecoming'),
      primary: {
        id: 'blaster/fire-blast',
        name: 'Fire Blast',
        powers: [power({ internalName: 'Flares', powerSet: 'blaster/fire-blast', level: 1, slots: [ioSet, generic, special, origin, null], isActive: true })],
      },
    };

    const state = toCharacterState(build, defaultCtx({ targetsHitValues: { Flares: 5 } }));
    const p = state.primary.powers[0];
    expect(p.internal_name).toBe('Flares');
    expect(p.power_set).toBe('blaster/fire-blast');
    expect(p.is_active).toBe(true);
    expect(p.targets_hit).toBe(5);
    expect(p.slots.map((s) => (s ? s.type : null))).toEqual(['io-set', 'io-generic', 'special', 'origin', null]);
    // camelCase → snake_case on the payload
    expect(p.slots[0]).toMatchObject({ type: 'io-set', set_id: 'thunderstrike', piece_num: 1, is_proc: false });
    expect(p.slots[3]).toMatchObject({ type: 'origin', secondary_origin: null, origin: 'Magic' });
  });

  it('lowercases accolade ids to their engine key', () => {
    const build: Build = {
      ...createEmptyBuild('homecoming'),
      accolades: [{ id: 'The_Atlas_Medallion', name: 'Atlas Medallion', description: '', icon: '', bonuses: [] }],
    };
    expect(toCharacterState(build, defaultCtx()).accolades).toEqual(['the_atlas_medallion']);
  });

  it('folds incarnateActive into each equipped slot', () => {
    const build: Build = { ...createEmptyBuild('homecoming') };
    build.incarnates.alpha = { slotId: 'alpha', powerId: 'x', powerName: 'Musculature_Radial', displayName: '', icon: '', tier: 't4', treeId: '', treeName: '' } as never;
    const state = toCharacterState(build, defaultCtx({ incarnateActive: { alpha: true, destiny: false, hybrid: false, interface: false, judgement: false, lore: false, genesis: false } }));
    expect(state.incarnates.alpha).toEqual({ power_name: 'Musculature_Radial', active: true });
  });

  // A build whose only conditional lives on an inherent power (buildConditionalsById reads inherent
  // conditionalEffects directly, so no powerset def is consulted) — lets us exercise the PROD3 guard
  // with a synthetic conditional of a chosen id/effects shape.
  function buildWithInherentConditional(id: string, effects: Record<string, unknown>): Build {
    const build = createEmptyBuild('homecoming');
    build.inherents = [
      { internalName: 'Synthetic', powerSet: '', level: 1, slots: [], conditionalEffects: [{ id, label: '', scope: 'global', effects }] } as unknown as SelectedPower,
    ];
    return build;
  }

  describe('conditional adjusters (PROD3)', () => {
    it('throws on an unclassified global adjuster that carries a caster dashboard buff', () => {
      const build = buildWithInherentConditional('novel_totals_toggle', { defense: { Smashing: { scale: 1 } } });
      expect(() => toCharacterState(build, defaultCtx({ globalAdjusters: { novel_totals_toggle: true } }))).toThrow(/novel_totals_toggle/);
    });
    it('passes through an unclassified adjuster whose conditional is foe-side only (no Self total)', () => {
      const build = buildWithInherentConditional('foe_control_toggle', { stun: { mag: 3 } });
      expect(() => toCharacterState(build, defaultCtx({ globalAdjusters: { foe_control_toggle: true } }))).not.toThrow();
    });
    it('passes through a modeled stance adjuster (engine reads it via active_sub_power)', () => {
      const build = buildWithInherentConditional('defensiveadaptation', { resistance: { Smashing: { scale: 1 } } });
      expect(() => toCharacterState(build, defaultCtx({ globalAdjusters: { defensiveadaptation: true } }))).not.toThrow();
    });
    it('passes through a combat-transient rotation adjuster (engine omits it from sustained totals)', () => {
      const build = buildWithInherentConditional('clearskies', { recoveryBuff: { scale: 1 } });
      expect(() => toCharacterState(build, defaultCtx({ globalAdjusters: { clearskies: true } }))).not.toThrow();
    });
    it('passes through active mechanicAdjusters (per-power scope is foe-side)', () => {
      expect(() => toCharacterState(createEmptyBuild(), defaultCtx({ mechanicAdjusters: { 'power:cond': true } }))).not.toThrow();
    });
    it('passes through a global toggle with no matching conditional on the build', () => {
      expect(() => toCharacterState(createEmptyBuild(), defaultCtx({ globalAdjusters: { some_toggle: true } }))).not.toThrow();
    });
  });

  describe('destinyTime', () => {
    it('passes a non-null destinyTime through to combat.destiny_time', () => {
      const state = toCharacterState(createEmptyBuild(), defaultCtx({ destinyTime: 90 }));
      expect(state.combat.destiny_time).toBe(90);
    });
    it('maps a null destinyTime to null (the engine resolves at the sustained floor)', () => {
      const state = toCharacterState(createEmptyBuild(), defaultCtx({ destinyTime: null }));
      expect(state.combat.destiny_time).toBeNull();
    });
  });

  describe('fail-loud', () => {
    it('does NOT throw when adjusters are present but all off', () => {
      expect(() => toCharacterState(createEmptyBuild(), defaultCtx({ globalAdjusters: { some_toggle: false } }))).not.toThrow();
    });
  });
});
