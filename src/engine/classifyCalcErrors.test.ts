import { describe, it, expect } from 'vitest';
import { classifyCalcErrors } from './engineTotals';
import type { PowerNameResolver } from './engineTotalsMap';

/**
 * `classifyCalcErrors` decides whether the calc-error banner can NAME what went wrong or
 * must fall back to counting it. It reads the engine's human-readable `detail` string,
 * which is the fragile joint: `CalcError` carries no structured fields, so a reworded
 * engine message silently downgrades the banner. These tests pin the shapes the engine
 * emits today (copied verbatim from `coh_math::gather`) so that rewording goes red here
 * instead of going quiet in the UI.
 */

const DISPLAY_NAMES = new Map([
  ['speed\0Hasten', 'Hasten'],
  ['leadership\0Defense', 'Maneuvers'],
]);

const resolver: PowerNameResolver = (ref) =>
  DISPLAY_NAMES.get(`${ref.power_set}\0${ref.power_internal_name}`) ?? ref.power_internal_name;

const err = (context: string, detail: string) => ({ context, detail });

const missingPower = (set: string, internal: string) =>
  err('gather', `selected power ${set}/${internal} is not in this dataset — its contribution is missing from the totals`);

describe('classifyCalcErrors', () => {
  it('reports nothing for a clean run', () => {
    expect(classifyCalcErrors([], resolver).lines).toEqual([]);
    expect(classifyCalcErrors(undefined, resolver).lines).toEqual([]);
  });

  it('names missing picked powers by their display name', () => {
    const r = classifyCalcErrors([missingPower('leadership', 'Defense')], resolver);
    expect(r.missingPowers).toEqual(['Maneuvers']);
    expect(r.allMissingPowers).toBe(true);
  });

  it('falls back to counting when anything else is in the list', () => {
    const r = classifyCalcErrors(
      [missingPower('speed', 'Hasten'), err('caps', "no archetype caps for 'defender'")],
      resolver
    );
    // Still collected — the banner just must not present a named subset as the whole story.
    expect(r.missingPowers).toEqual(['Hasten']);
    expect(r.allMissingPowers).toBe(false);
    expect(r.lines).toHaveLength(2);
  });

  it('does not name a look-alike message from another context', () => {
    const r = classifyCalcErrors(
      [err('accolades', 'accolade portal_jockey is not in this dataset — its bonus is missing from the totals')],
      resolver
    );
    expect(r.missingPowers).toEqual([]);
    expect(r.allMissingPowers).toBe(false);
  });

  it('does not name the stance variant, whose subject is the stance and not the power', () => {
    const r = classifyCalcErrors(
      [err('gather', 'active stance Foo of bio-armor/Bar is not in this dataset — its contribution is missing from the totals')],
      resolver
    );
    expect(r.missingPowers).toEqual([]);
    expect(r.allMissingPowers).toBe(false);
  });

  it('keeps every detail verbatim for a bug report', () => {
    const r = classifyCalcErrors([missingPower('leaping', 'Defense')], resolver);
    expect(r.lines).toEqual([
      'gather — selected power leaping/Defense is not in this dataset — its contribution is missing from the totals',
    ]);
  });
});
