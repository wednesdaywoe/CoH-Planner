import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSharedCharacterCalculation,
  createSharedSingleEntryMemo,
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

  // ── Regression: the engine-swap defeat ───────────────────────────────────
  // The data-pipeline swap wrapped the calc inputs into an `options` object
  // built inside a per-instance `useMemo` (useCalculationContext). Each of the
  // ~150 consumers then produced its OWN structurally-equal-but-distinct
  // `options` reference, so the calc cache missed on every instance and the
  // (now heavier, engine-backed) calc re-ran ~150×. These two tests pin the
  // failure mode and the fix (routing the context through its own shared memo).

  it('per-instance option objects DEFEAT the calc cache (the regression)', () => {
    const build = { id: 'b' };
    const procSettings = { damage: true }; // one shared store ref...
    const compute = vi.fn(makeResult);

    // ...but each instance builds its own `options` object from it.
    for (let i = 0; i < 150; i++) {
      const options = { procSettings, combatMode: false }; // fresh ref per instance
      getSharedCharacterCalculation([build, options], compute);
    }

    // Every call misses — this is exactly the stall we're guarding against.
    expect(compute).toHaveBeenCalledTimes(150);
  });

  it('a shared context memo collapses those option objects to one ref → calc runs once', () => {
    const build = { id: 'b' };
    const procSettings = { damage: true };
    const combatMode = false;
    const contextMemo = createSharedSingleEntryMemo<{ procSettings: object; combatMode: boolean }>();
    const compute = vi.fn(makeResult);

    for (let i = 0; i < 150; i++) {
      // Each instance still *calls* the context builder, but the shared memo
      // hands back one identical `options` reference (deps are shared store
      // values), so the downstream calc cache now hits.
      const options = contextMemo.get([procSettings, combatMode], () => ({ procSettings, combatMode }));
      getSharedCharacterCalculation([build, options], compute);
    }

    expect(compute).toHaveBeenCalledTimes(1);
  });
});
