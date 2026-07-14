import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSharedCharacterCalculation,
  _resetSharedCalcCache,
} from './useCalculatedStats';
import type { CharacterCalculationResult } from '@/utils/calculations';

/**
 * Guard for the cross-instance calc cache (perf regression fix).
 *
 * `useCharacterCalculation` is consumed by ~150 per-instance components on a
 * full build (every PowerRow / PowerSlot / PermaRing / tooltip). React's
 * useMemo is per-instance, so without a shared cache each of those re-ran the
 * full `calculateCharacterTotals` pipeline on every state change — the ~0.5-1s
 * click stall. This asserts the shared cache collapses N same-input calls into
 * a single compute, while still recomputing when any input actually changes.
 */
describe('getSharedCharacterCalculation', () => {
  beforeEach(() => {
    _resetSharedCalcCache();
  });

  // A stand-in result; the cache is agnostic to its contents.
  const makeResult = () => ({ marker: {} } as unknown as CharacterCalculationResult);

  it('computes once for many callers sharing the same dep tuple (the 150-instance case)', () => {
    const build = { id: 'b' };
    const compute = vi.fn(makeResult);

    // Simulate one render pass: many component instances, identical store refs.
    const deps = [build, false, 50] as const;
    const results = Array.from({ length: 150 }, () =>
      getSharedCharacterCalculation(deps, compute)
    );

    expect(compute).toHaveBeenCalledTimes(1);
    // All callers get the exact same object reference.
    for (const r of results) expect(r).toBe(results[0]);
  });

  it('recomputes exactly once when a dependency actually changes', () => {
    const build = { id: 'b' };
    const compute = vi.fn(makeResult);

    getSharedCharacterCalculation([build, false, 50], compute); // miss
    getSharedCharacterCalculation([build, false, 50], compute); // hit
    getSharedCharacterCalculation([build, true, 50], compute); // combatMode changed -> miss
    getSharedCharacterCalculation([build, true, 50], compute); // hit

    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('misses when a referenced object identity changes (new build ref)', () => {
    const compute = vi.fn(makeResult);

    getSharedCharacterCalculation([{ id: 'b' }, false, 50], compute);
    getSharedCharacterCalculation([{ id: 'b' }, false, 50], compute); // new object ref

    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('uses Object.is equality (NaN-safe, distinguishes identity)', () => {
    const compute = vi.fn(makeResult);

    getSharedCharacterCalculation([NaN], compute);
    getSharedCharacterCalculation([NaN], compute); // NaN === NaN is false, but Object.is(NaN,NaN) is true -> hit

    expect(compute).toHaveBeenCalledTimes(1);
  });
});
