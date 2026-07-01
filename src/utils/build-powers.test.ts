import { describe, it, expect } from 'vitest';
import { getBuildPowers, getSelectedPowersByLevel, getSlottedInherents, getInherentPowers, getSelectedIncarnates, isPowerSlotted } from './build-powers';
import type { Build } from '@/types/build';
import type { SelectedPower } from '@/types/power';

// Minimal SelectedPower stub — only the fields these helpers read.
function power(name: string, level: number, extra: Partial<SelectedPower> = {}): SelectedPower {
  return {
    name,
    internalName: name,
    level,
    powerSet: 'set',
    slots: [],
    ...extra,
  } as SelectedPower;
}

function buildWith(over: Partial<Build>): Build {
  return {
    primary: { id: 'p', name: 'Primary', powers: [] },
    secondary: { id: 's', name: 'Secondary', powers: [] },
    pools: [],
    epicPool: null,
    inherents: [],
    ...over,
  } as Build;
}

describe('getBuildPowers', () => {
  it('flattens every category and sorts by pick level', () => {
    const build = buildWith({
      primary: { id: 'p', name: 'Primary', powers: [power('A', 1), power('C', 8)] },
      secondary: { id: 's', name: 'Secondary', powers: [power('B', 2)] },
      pools: [{ id: 'speed', name: 'Speed', powers: [power('D', 4)] }],
      epicPool: { id: 'epic', name: 'Epic', powers: [power('E', 35)] },
    });
    expect(getBuildPowers(build).map((p) => p.name)).toEqual(['A', 'B', 'D', 'C', 'E']);
  });

  it('excludes auto-granted sub-powers', () => {
    const build = buildWith({
      primary: { id: 'p', name: 'Primary', powers: [power('Nova', 6), power('NovaBolt', 6, { isAutoGranted: true })] },
    });
    expect(getBuildPowers(build).map((p) => p.name)).toEqual(['Nova']);
  });

  it('keeps a stable primary→secondary order on level ties', () => {
    const build = buildWith({
      primary: { id: 'p', name: 'Primary', powers: [power('P1', 1)] },
      secondary: { id: 's', name: 'Secondary', powers: [power('S1', 1)] },
    });
    expect(getBuildPowers(build).map((p) => p.name)).toEqual(['P1', 'S1']);
  });
});

describe('getSelectedPowersByLevel', () => {
  it('groups by level ascending, omitting empty levels', () => {
    const build = buildWith({
      primary: { id: 'p', name: 'Primary', powers: [power('A', 1), power('B', 1), power('C', 8)] },
    });
    const groups = getSelectedPowersByLevel(build);
    expect(groups.map((g) => g.level)).toEqual([1, 8]);
    expect(groups[0].powers.map((p) => p.name)).toEqual(['A', 'B']);
    expect(groups[1].powers.map((p) => p.name)).toEqual(['C']);
  });
});

describe('isPowerSlotted', () => {
  it('is true only when a non-null enhancement is present', () => {
    expect(isPowerSlotted(power('A', 1, { slots: [null, { id: 'x' } as never] }))).toBe(true);
    expect(isPowerSlotted(power('B', 1, { slots: [null, null] }))).toBe(false);
    expect(isPowerSlotted(power('C', 1, { slots: [] }))).toBe(false);
  });
});

describe('getInherentPowers', () => {
  it('returns all inherents (slotted or not) but excludes auto-granted', () => {
    const build = buildWith({
      inherents: [
        power('Health', 1, { slots: [{ id: 'x' } as never] }),
        power('Sprint', 1, { slots: [null] }),
        power('SubForm', 1, { isAutoGranted: true }),
      ],
    });
    expect(getInherentPowers(build).map((p) => p.name)).toEqual(['Health', 'Sprint']);
  });
});

describe('getSelectedIncarnates', () => {
  it('returns non-null slots in canonical order, skipping empties', () => {
    const inc = (slotId: string, displayName: string) => ({ slotId, displayName, icon: 'x' } as never);
    const build = buildWith({
      incarnates: {
        alpha: inc('alpha', 'Musculature Core'),
        judgement: null,
        interface: null,
        destiny: null,
        lore: inc('lore', 'Cimeroran'),
        hybrid: null,
        genesis: null,
      } as never,
    });
    const names = getSelectedIncarnates(build).map((i) => i.displayName);
    expect(names).toEqual(['Musculature Core', 'Cimeroran']);
  });

  it('returns [] when there is no incarnate state', () => {
    expect(getSelectedIncarnates(buildWith({}))).toEqual([]);
  });
});

describe('getSlottedInherents', () => {
  it('keeps only inherents with at least one slotted enhancement', () => {
    const build = buildWith({
      inherents: [
        power('Health', 1, { slots: [{ id: 'x' } as never] }),
        power('Sprint', 1, { slots: [null] }),
      ],
    });
    expect(getSlottedInherents(build).map((p) => p.name)).toEqual(['Health']);
  });
});
