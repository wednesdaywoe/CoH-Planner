import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data';
import { applyActiveConditionals, describeAdjusterContribution } from './powerDisplayUtils';
import { selectActiveConditionals } from '@/utils/conditional-effects';
import type { ConditionalEffect, Power } from '@/types';

/**
 * The "+ extra … instance" hint under a stance row must describe what the merger
 * actually records.
 *
 * `applyActiveConditionals` treats `durations` / `buffDuration` / `effectDuration`
 * as per-effect metadata and never records them as extra instances, but
 * `describeAdjusterContribution` — which writes the hint — skipped only
 * `durations`. So every Bio Armor stance row advertised an "extra Buff Duration
 * instance" that does not exist (screenshot 2026-07-26). Both now read one shared
 * key set; this pins the two against each other rather than against a literal.
 */
describe('adjuster contribution hint (homecoming)', () => {
  beforeAll(async () => { await loadDataset('homecoming'); });

  const bioPowers = () =>
    (getPowerset('scrapper/bio-armor')!.powers as Power[]).filter(
      (p) => (p.conditionalEffects ?? []).length > 0,
    );

  it('never names a duration-metadata key as a collision', () => {
    for (const power of bioPowers()) {
      for (const c of power.conditionalEffects as ConditionalEffect[]) {
        const { collisionKeys, newKeys } = describeAdjusterContribution(power, c);
        for (const k of [...collisionKeys, ...newKeys]) {
          expect(k, `${power.internalName}/${c.id}`).not.toMatch(/^(durations|buffDuration|effectDuration)$/);
        }
      }
    }
  });

  it('claims an extra instance only where the merger records one', () => {
    let checked = 0;
    for (const power of bioPowers()) {
      for (const c of power.conditionalEffects as ConditionalEffect[]) {
        const active = selectActiveConditionals(power, {}, { [c.id]: true });
        const { extraInstances } = applyActiveConditionals(power, active);
        const recorded = new Set(Object.keys(extraInstances));
        for (const k of describeAdjusterContribution(power, c).collisionKeys) {
          expect(recorded.has(k), `${power.internalName}/${c.id} claims "${k}"`).toBe(true);
          checked++;
        }
      }
    }
    // The Bio Armor stances DO collide on real effect keys (Hardened Carapace's
    // resistance, Environmental Modification's defenseBuff) — if this hits zero
    // the test proved nothing.
    expect(checked).toBeGreaterThan(0);
  });
});
