import { describe, it, expect } from 'vitest';
import { PROC_DATABASE, getProcEffects } from '@/data/proc-data';
import { PROC_RESIDUAL_EFFECTS } from '@/data/proc-residual-effects';

/**
 * Close-out guard (P6): EVERY proc entry must carry structured `.effects`, so
 * `getProcEffects` is a pure read and `parseProcEffect` stays retired. A new
 * PROC_DATABASE entry without effects (generated or curated) fails here —
 * regenerate `scripts/extract-proc-data.py` or add a `proc-residual-effects` row.
 */
describe('proc effects coverage', () => {
  it('every PROC_DATABASE entry has non-empty structured effects', () => {
    const missing = Object.entries(PROC_DATABASE)
      .filter(([, d]) => !d.effects || d.effects.length === 0)
      .map(([k]) => k);
    expect(missing, `entries with no .effects (add to the generator or proc-residual-effects):\n${missing.join('\n')}`).toEqual([]);
  });

  it('getProcEffects returns the entry effects (no parse fallback)', () => {
    for (const d of Object.values(PROC_DATABASE)) {
      expect(getProcEffects(d)).toBe(d.effects);
    }
  });

  it('every curated residual key maps to a real entry (no stale keys)', () => {
    const stale = Object.keys(PROC_RESIDUAL_EFFECTS).filter((k) => !PROC_DATABASE[k]);
    expect(stale, `proc-residual-effects keys with no PROC_DATABASE entry:\n${stale.join('\n')}`).toEqual([]);
  });
});
