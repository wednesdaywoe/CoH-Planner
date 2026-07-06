import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * SC-3/SC-4/SC-5 regression guard.
 *
 * Runs scripts/validate-converter-output.cjs and asserts the three open
 * self-check invariants remain clean:
 * - SC-3: no damage/debuff atom missing explicit resistible disposition.
 * - SC-4: no unaccounted PvP sibling in a PvE-kept sibling family.
 * - SC-5: no self-penalty routing leak (foe debuff surfaced as caster self debuff).
 */

const REPO = fileURLToPath(new URL('../../..', import.meta.url));
const DETECTOR = path.join(REPO, 'scripts', 'validate-converter-output.cjs');
const CACHE = new Map<string, { sc3Checked: number; sc3Missing: number; sc4Unaccounted: number; sc5Leaks: number }>();

function run(dataset: string): { sc3Checked: number; sc3Missing: number; sc4Unaccounted: number; sc5Leaks: number } {
  const cached = CACHE.get(dataset);
  if (cached) return cached;

  const out = execFileSync('node', [DETECTOR, '--dataset', dataset], {
    cwd: REPO,
    encoding: 'utf-8',
    timeout: 120_000,
  });

  const mSc3 = out.match(/SC-3:[^\n]*\n\s*checked\s+(\d+)\s+damage\/debuff atoms;\s+missing resistible flag:\s+(\d+)/i);
  const mSc4 = out.match(/SC-4:[^\n]*\n\s*sibling families:\s+\d+;\s+dropped-by-design accounted:\s+\d+;\s+unaccounted:\s+(\d+)/i);
  const mSc5 = out.match(/SC-5:[^\n]*\((\d+)\)/i);

  if (!mSc3 || !mSc4 || !mSc5) {
    throw new Error(`SC-3/4/5 output not parseable:\n${out}`);
  }

  const result = {
    sc3Checked: parseInt(mSc3[1], 10),
    sc3Missing: parseInt(mSc3[2], 10),
    sc4Unaccounted: parseInt(mSc4[1], 10),
    sc5Leaks: parseInt(mSc5[1], 10),
  };
  CACHE.set(dataset, result);
  return result;
}

describe('SC-3/SC-4/SC-5 converter self-checks', () => {
  for (const ds of ['homecoming', 'rebirth', 'thunderspy']) {
    it(`${ds}: SC-3/4/5 all clean`, () => {
      const r = run(ds);
      expect(r.sc3Missing, `${ds} SC-3 missing resistible`).toBe(0);
      expect(r.sc4Unaccounted, `${ds} SC-4 unaccounted PvP sibling`).toBe(0);
      expect(r.sc5Leaks, `${ds} SC-5 routing leaks`).toBe(0);
    }, 120_000);
  }

  it('homecoming: SC-3 checks a non-trivial atom count', () => {
    expect(run('homecoming').sc3Checked).toBeGreaterThan(5000);
  }, 120_000);
});
