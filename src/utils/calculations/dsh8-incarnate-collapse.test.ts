import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * DSH8 — regression guard for the incarnate collapse detector
 * (`scripts/dsh8-incarnate-collapse-detector.cjs`). It sweeps the Hybrid + Destiny
 * buff slots per dataset, keying INPUT by the DSH4 bridge (`ingestExportPower`) and
 * OUTPUT by the generated `incarnate-effects.ts`, and flags a "class-present,
 * sibling-missing" multi-type collapse (the Support Core defense drop's shape).
 *
 * This asserts the gate stays at ZERO high-confidence collapses across all three
 * datasets — so a future incarnate-converter or bridge change that re-drops a buff
 * sibling fails here. (The known Thunderspy generic-attrib gap surfaces as a
 * non-gating *class-absent* entry, not a collapse — the whole tspy Support hybrid is
 * empty, deferred — so it does not trip this gate.)
 *
 * See streams/DEDUCTIVE_SCHEMA_HARNESS.md (DSH8).
 */

const REPO = fileURLToPath(new URL('../../..', import.meta.url));
const DETECTOR = path.join(REPO, 'scripts', 'dsh8-incarnate-collapse-detector.cjs');

function runDetector(dataset: string): { collapses: number; groups: number; checked: number } {
  const out = execFileSync('node', [DETECTOR, '--dataset', dataset], {
    cwd: REPO, encoding: 'utf-8', timeout: 60_000,
  });
  const m = out.match(/HIGH-confidence collapses:\s*(\d+)\s*\((\d+)\s*groups\)/);
  const c = out.match(/atoms checked:\s*(\d+)/);
  if (!m) throw new Error(`detector output not parseable:\n${out}`);
  return { collapses: parseInt(m[1], 10), groups: parseInt(m[2], 10), checked: c ? parseInt(c[1], 10) : 0 };
}

describe('DSH8 incarnate collapse detector — gate', () => {
  for (const ds of ['homecoming', 'rebirth', 'thunderspy']) {
    it(`${ds}: zero high-confidence multi-type collapses in Hybrid + Destiny`, () => {
      const r = runDetector(ds);
      expect(r.collapses, `${ds} high-confidence collapse groups: ${r.groups}`).toBe(0);
    });
  }

  it('homecoming: the detector actually inspects buff atoms (not a vacuous pass)', () => {
    // guard against the gate passing because nothing was checked (e.g. a broken
    // source path). HC has ~hundreds of checkable Hybrid+Destiny buff atoms.
    expect(runDetector('homecoming').checked).toBeGreaterThan(200);
  });
});
