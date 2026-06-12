import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

// The converter is a CJS build script; pull `extractEffects` out of it directly
// so we can exercise the template→effects mapping without a full regen.
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { extractEffects } = require('../../scripts/convert-powerset.cjs');

/**
 * Regression for the @Redlynne report: Rebirth's Stealth (and Tough, Weave,
 * Combat Jumping, Stone Armor, the Kheldian shields, …) carry a no-op
 * Recovery/Regen marker — a `type: "Expression"`, `tick_chance: 0` template that
 * never fires in-game. Our parser can't yet extract its `magnitude_expression`,
 * so without a guard the converter falls back to scale×table and emits a phantom
 * "+100% Recovery (2s)".
 *
 * The discriminator is `tick_chance`: the phantom markers are 0; genuine scaling
 * Expression buffs — Gamma Boost's HP-scaled recovery/regen, Earthen Embrace,
 * the pseudopet HP heals — are `tick_chance: 1` and MUST pass through (every
 * Homecoming resource-Expression template is tick_chance 1, so HC is untouched).
 */
describe('converter: tick_chance=0 Expression resource markers are phantoms', () => {
  const recoveryTemplate = (over: Record<string, unknown>) => ({
    attribs: ['Recovery'],
    aspect: 'Current',
    target: 'Self',
    table: 'Melee_Ones',
    scale: 1,
    magnitude: 1,
    ...over,
  });

  const recoveryKeys = (tmpl: Record<string, unknown>) =>
    Object.keys(extractEffects([tmpl], 'Test')).filter((k) => /recovery/i.test(k));

  it('drops a tick_chance=0 Expression recovery marker (Stealth phantom)', () => {
    const phantom = recoveryTemplate({ type: 'Expression', tick_chance: 0, flags: ['IgnoreStrength', 'IgnoreResistance'] });
    expect(recoveryKeys(phantom)).toEqual([]);
  });

  it('keeps a tick_chance=1 Expression recovery buff (Gamma Boost scaling recovery)', () => {
    const real = recoveryTemplate({ type: 'Expression', tick_chance: 1, flags: ['IgnoreResistance'] });
    expect(recoveryKeys(real)).toContain('recoveryBuff');
  });

  it('keeps a Magnitude recovery buff (Stamina / Quick Recovery)', () => {
    const stamina = recoveryTemplate({ type: 'Magnitude', tick_chance: 1, scale: 0.25, flags: ['IgnoreResistance'] });
    expect(recoveryKeys(stamina)).toContain('recoveryBuff');
  });

  it('drops a tick_chance=0 Expression regen marker too', () => {
    const phantomRegen = { ...recoveryTemplate({ type: 'Expression', tick_chance: 0 }), attribs: ['Regeneration'] };
    const regenKeys = Object.keys(extractEffects([phantomRegen], 'Test')).filter((k) => /regen/i.test(k));
    expect(regenKeys).toEqual([]);
  });
});
