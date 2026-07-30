import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DSYNC_ENHANCEMENTS } from './enhancements';

/**
 * D-Sync base values must be the LEVEL-50 (unboosted) magnitudes.
 *
 * Reported 2026-07-30: a level-50 D-Sync Provocation enhanced by 38.3% instead of
 * 33.3%, and a level-53 one by 44% instead of 38.3%. Root cause was not the level
 * scaling — `DSYNC_ENHANCEMENTS` had been hand-transcribed from a source listing
 * +3-boosted values, so every entry was pre-multiplied by 1.15 (33.33 -> 38.3,
 * 20 -> 23.0) and the calc's boost multiplier then stacked on top.
 *
 * The authoritative base magnitudes are the `scale` fields in the binary export
 * (`exported_powers/boosts/dsync_*`), so this pins the registry to that oracle
 * rather than to another hardcoded list. D-Syncs are Rebirth's HamiO analogue and
 * use the same two magnitudes HamiO does: 33.33% and 20%.
 *
 * Note on aspect counts: the registry models a single `Jump` aspect where the
 * export carries separate JumpingSpeed + JumpHeight templates (the convention in
 * every special-enhancement registry here, cf. HAMIDON_ENHANCEMENTS), so this
 * compares the set of distinct magnitudes per enhancement, not a 1:1 template
 * multiset.
 */

const BOOST_MULTIPLIER_PER_LEVEL = 0.05;
const MAX_SPECIAL_BOOST = 3;

function exportedScales(): Map<string, number[]> {
  const boostsDir = fileURLToPath(new URL('../../exported_powers/boosts', import.meta.url));
  const byDisplayName = new Map<string, number[]>();

  for (const dir of fs.readdirSync(boostsDir).filter((d) => d.startsWith('dsync_'))) {
    const dirPath = path.join(boostsDir, dir);
    for (const file of fs.readdirSync(dirPath).filter((f) => f.endsWith('.json'))) {
      const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf8'));
      const scales: number[] = [];
      for (const group of data.effects ?? []) {
        for (const template of group.templates ?? []) {
          if (typeof template.scale === 'number') {
            scales.push(Math.round(template.scale * 100 * 100) / 100);
          }
        }
      }
      // Each D-Sync ships twice: a named entry with templates and a bare
      // aspect-named stub with none. Only the former is the oracle.
      if (scales.length > 0 && typeof data.display_name === 'string') {
        byDisplayName.set(data.display_name, scales);
      }
    }
  }
  return byDisplayName;
}

function countByMagnitude(values: number[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

describe('D-Sync base enhancement values', () => {
  const exported = exportedScales();

  it('has an export for every registry entry (guard against a silent no-op test)', () => {
    expect(exported.size).toBe(20);
    expect(Object.keys(DSYNC_ENHANCEMENTS)).toHaveLength(20);
  });

  it('uses only the two unboosted HamiO-family magnitudes', () => {
    const seen = new Set<number>();
    for (const entry of Object.values(DSYNC_ENHANCEMENTS)) {
      for (const aspect of entry.aspects) seen.add(aspect.value);
    }
    expect([...seen].sort((a, b) => a - b)).toEqual([20, 33.33]);
  });

  it.each(Object.entries(DSYNC_ENHANCEMENTS))(
    '%s matches the exported binary scales',
    (_key, entry) => {
      // Registry name is 'D-Sync Provocation'; export adds an aspect suffix.
      const matches = [...exported.keys()].filter((n) => n.startsWith(`${entry.name} (`));
      expect(matches, `no unique export for ${entry.name}`).toHaveLength(1);

      const expectedScales = exported.get(matches[0])!;
      const registryValues = entry.aspects.map((a) => a.value);

      for (const value of new Set(registryValues)) {
        const hit = expectedScales.some((s) => Math.abs(s - value) < 0.02);
        expect(
          hit,
          `${entry.name}: registry value ${value}% is not an exported scale ` +
            `(exported: ${expectedScales.join(', ')})`,
        ).toBe(true);
      }

      // Where the enhancement mixes both magnitudes, also pin how many aspects
      // sit at each one — otherwise swapping 20% and 33.33% between two aspects
      // of the same enhancement passes the set-membership check above. Only the
      // mixed entries can be checked this way: the single-magnitude travel entry
      // (Acceleration) models JumpingSpeed + JumpHeight as one `Jump` aspect, so
      // its counts legitimately differ from the export's template count.
      const expectedCounts = countByMagnitude(expectedScales);
      if (expectedCounts.size > 1) {
        expect(
          Object.fromEntries(countByMagnitude(registryValues)),
          `${entry.name}: per-magnitude aspect counts must match the export`,
        ).toEqual(Object.fromEntries(expectedCounts));
      }
    },
  );

  it('no registry value is a pre-boosted magnitude', () => {
    // The original bug: values already multiplied by the +3 booster, which the
    // calc then multiplies again. Any base value that equals another base value
    // times a boost multiplier is the fingerprint.
    const bases = [20, 33.33];
    const boosted = new Set<number>();
    for (const base of bases) {
      for (let boost = 1; boost <= MAX_SPECIAL_BOOST; boost++) {
        boosted.add(Math.round(base * (1 + boost * BOOST_MULTIPLIER_PER_LEVEL) * 10) / 10);
      }
    }

    for (const [key, entry] of Object.entries(DSYNC_ENHANCEMENTS)) {
      for (const aspect of entry.aspects) {
        const rounded = Math.round(aspect.value * 10) / 10;
        expect(
          boosted.has(rounded),
          `${key}.${aspect.stat} = ${aspect.value} looks like a boosted value, not a level-50 base`,
        ).toBe(false);
      }
    }
  });
});
