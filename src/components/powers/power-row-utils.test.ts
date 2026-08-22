import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { shouldShowToggle, ROUTED_SUBTYPES } from './power-row-utils';

/**
 * A click power only earns a toggle if flipping it can actually move a number.
 *
 * Reported 2026-07-30: Fold Space showed a toggle that did nothing. `shouldShowToggle`
 * tested only for *presence* of a `CASTER_BUFF_KEYS` entry, and Fold Space's bag
 * carries `mezResistance.teleport` — the 15s teleport protection granted to the foes
 * you yank, so they can't be chain-pulled. That is a foe effect, and `teleport` has
 * no mez-resistance total to route into on either the Rust engine or the TS oracle,
 * so the toggle was a guaranteed no-op.
 *
 * The fix gates the two sub-keyed containers (`mezResistance`, `debuffResistance`) on
 * whether any of their subtypes is one the calc actually consumes.
 */

const MEZ_RES_TOTALS = ['hold', 'stun', 'immobilize', 'sleep', 'confuse', 'fear', 'knockback'];
const DEBUFF_RES_TOTALS = [
  'movement', 'defense', 'recharge', 'endurance', 'recovery', 'tohit',
  'regeneration', 'perception',
];

function readOracle(): string {
  const p = fileURLToPath(
    new URL('../../utils/calculations/legacy-totals.oracle.ts', import.meta.url),
  );
  return fs.readFileSync(p, 'utf8');
}

/** Pull the subtype keys out of a `const xMapping: Record<...> = { ... }` block. */
function mappingKeys(source: string, mappingName: string): string[] {
  const start = source.indexOf(`const ${mappingName}: Record<`);
  expect(start, `${mappingName} not found — did the oracle get renamed?`).toBeGreaterThan(-1);
  const open = source.indexOf('{', start);
  const close = source.indexOf('};', open);
  const body = source.slice(open + 1, close);
  return [...body.matchAll(/^\s*(\w+):/gm)].map((m) => m[1]);
}

describe('shouldShowToggle — routability of sub-keyed resistance containers', () => {
  it('the UI subtype lists match the calc routing maps (drift guard)', () => {
    const oracle = readOracle();
    // Compare the *shipped* constant against the calc, in both directions, so that
    // adding a subtype to the calc without teaching the UI about it goes red even
    // if no fixture power happens to use it.
    expect([...ROUTED_SUBTYPES.mezResistance].sort()).toEqual(
      mappingKeys(oracle, 'mezResMapping').sort(),
    );
    expect([...ROUTED_SUBTYPES.debuffResistance].sort()).toEqual(
      mappingKeys(oracle, 'debuffResMapping').sort(),
    );
    // And pin the expected content, so a matched-but-wrong pair of edits is caught.
    expect([...ROUTED_SUBTYPES.mezResistance].sort()).toEqual([...MEZ_RES_TOTALS].sort());
    expect([...ROUTED_SUBTYPES.debuffResistance].sort()).toEqual([...DEBUFF_RES_TOTALS].sort());
  });

  it('does NOT toggle a click whose only caster-buff key is unrouted mezResistance', () => {
    // Fold Space, verbatim shape from the generated tree.
    expect(
      shouldShowToggle({
        powerType: 'Click',
        targetType: 'Self',
        effects: { mezResistance: { teleport: { scale: 100, table: 'Ranged_Ones' } } },
      }),
    ).toBe(false);
  });

  it('DOES toggle a click with a routed mezResistance subtype (Aid Self)', () => {
    // Aid Self stamps toWho:'Target' too, but it is a self-cast single target and
    // `stun` routes to mezResistStun — so routability, not targeting, is the test.
    expect(
      shouldShowToggle({
        powerType: 'Click',
        targetType: 'Self',
        effects: { mezResistance: { stun: { scale: 1.75, table: 'Melee_Res_Boolean' } } },
      }),
    ).toBe(true);
  });

  it('toggles when a routed subtype sits alongside an unrouted one', () => {
    expect(
      shouldShowToggle({
        powerType: 'Click',
        targetType: 'Self',
        effects: { mezResistance: { teleport: { scale: 100 }, hold: { scale: 2 } } },
      }),
    ).toBe(true);
  });

  it('does not regress unrelated caster buffs, or toggle powers themselves', () => {
    expect(
      shouldShowToggle({ powerType: 'Click', targetType: 'Self', effects: { tohitBuff: 0.2 } }),
    ).toBe(true);
    // A toggle power short-circuits before any effect inspection.
    expect(
      shouldShowToggle({
        powerType: 'Toggle',
        targetType: 'Self',
        effects: { mezResistance: { teleport: { scale: 100 } } },
      }),
    ).toBe(true);
    expect(shouldShowToggle({ powerType: 'Click', targetType: 'Foe', effects: {} })).toBe(false);
  });

  it('handles a malformed/empty container without granting a toggle', () => {
    expect(
      shouldShowToggle({ powerType: 'Click', targetType: 'Self', effects: { mezResistance: {} } }),
    ).toBe(false);
    expect(
      shouldShowToggle({
        powerType: 'Click',
        targetType: 'Self',
        effects: { debuffResistance: null as unknown as object },
      }),
    ).toBe(false);
  });
});

describe('shouldShowToggle — real generated data', () => {
  function walk(dir: string, out: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p, out);
      else if (entry.name.endsWith('.ts')) out.push(p);
    }
    return out;
  }

  function findPower(dataset: string, name: string): Record<string, unknown> | null {
    const root = fileURLToPath(
      new URL(`../../data/datasets/${dataset}/generated`, import.meta.url),
    );
    if (!fs.existsSync(root)) return null;
    for (const file of walk(root)) {
      const text = fs.readFileSync(file, 'utf8');
      const needle = `"name": "${name}"`;
      const idx = text.indexOf(needle);
      if (idx < 0) continue;
      const start = text.lastIndexOf('{', idx);
      let depth = 0;
      for (let i = start; i < text.length; i++) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') {
          depth--;
          if (depth === 0) {
            try {
              const obj = JSON.parse(text.slice(start, i + 1));
              if (obj?.name === name) return obj;
            } catch {
              // Not a self-contained JSON object (nested template literal etc.) —
              // keep scanning other files rather than swallowing the whole search.
            }
            break;
          }
        }
      }
    }
    return null;
  }

  // Every teleport-foe power in the committed tree that tripped the old predicate.
  const CASES: Array<[string, string]> = [
    ['homecoming', 'Fold Space'],
    ['homecoming', 'Shadow Slip'],
    ['homecoming', 'Wormhole'],
    ['rebirth', 'Mass Translocate'],
    ['rebirth', 'Starless Gateway'],
    ['rebirth', 'Wormhole'],
    ['thunderspy', 'Teleport Foe'],
  ];

  it.each(CASES)('%s / %s gets no toggle', (dataset, name) => {
    const power = findPower(dataset, name);
    expect(power, `${name} not found in ${dataset} — fixture stale`).not.toBeNull();
    expect(power!.effects).toHaveProperty('mezResistance');
    expect(shouldShowToggle(power!)).toBe(false);
  });

  it.each(['homecoming', 'rebirth', 'thunderspy', 'brainstorm'])('%s / Aid Self keeps its toggle', (dataset) => {
    const power = findPower(dataset, 'Aid Self');
    expect(power, `Aid Self not found in ${dataset} — fixture stale`).not.toBeNull();
    expect(shouldShowToggle(power!)).toBe(true);
  });
});
