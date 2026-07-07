import { describe, it, expect } from 'vitest';
import { computeModeSuppression, modeLabel, type ModeCarrier } from './mode-suppression';

describe('computeModeSuppression', () => {
  const granite: ModeCarrier = {
    internalName: 'Granite_Armor',
    name: 'Granite Armor',
    powerType: 'Toggle',
    isActive: true,
    setsModes: ['Suppress_FlyToggles', 'Suppress_RunToggles', 'Suppress_JumpToggles', 'Granite_Mode'],
  };
  const rock: ModeCarrier = {
    internalName: 'Rock_Armor',
    name: 'Rock Armor',
    powerType: 'Toggle',
    isActive: true,
    modesSuspended: ['Granite_Mode'],
  };
  const superSpeed: ModeCarrier = {
    internalName: 'Super_Speed',
    name: 'Super Speed',
    powerType: 'Toggle',
    isActive: true,
    modesSuspended: ['Suppress_RunToggles'],
  };

  it('suspends other Stone toggles when Granite is active', () => {
    const map = computeModeSuppression([granite, rock]);
    expect(map.get('Rock_Armor')).toEqual({ by: 'Granite Armor', mode: 'Granite_Mode' });
    expect(map.has('Granite_Armor')).toBe(false); // the setter is never self-suspended
  });

  it('suspends travel toggles via Granite Suppress_* markers', () => {
    const map = computeModeSuppression([granite, superSpeed]);
    expect(map.get('Super_Speed')).toEqual({ by: 'Granite Armor', mode: 'Suppress_RunToggles' });
  });

  it('does nothing when the mode-setter is toggled OFF', () => {
    const map = computeModeSuppression([{ ...granite, isActive: false }, rock]);
    expect(map.size).toBe(0);
  });

  it('does nothing when no active power sets any mode (default-safe)', () => {
    const map = computeModeSuppression([rock, superSpeed]);
    expect(map.size).toBe(0);
  });

  it('treats Auto powers as always-active setters', () => {
    const autoSetter: ModeCarrier = { ...granite, powerType: 'Auto', isActive: false };
    const map = computeModeSuppression([autoSetter, rock]);
    expect(map.get('Rock_Armor')?.by).toBe('Granite Armor');
  });
});

describe('modeLabel', () => {
  it('uses curated labels for known combat states', () => {
    expect(modeLabel('FastMode')).toBe('Momentum');
    expect(modeLabel('Peacebringer_Blaster_Mode')).toBe('Nova Form');
    expect(modeLabel('Granite_Mode')).toBe('Granite Armor');
  });
  it('humanizes travel-toggle "On" modes', () => {
    expect(modeLabel('SuperJumpOn')).toBe('Super Jump active');
    expect(modeLabel('FlyOn')).toBe('Fly active');
  });
});
