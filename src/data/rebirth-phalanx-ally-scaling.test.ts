import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Rebirth Phalanx Fighting — per-ally defense scaling must survive the PvE filter.
 *
 * Rebirth (Parse6) has no explicit `is_pvp` flag, so the parser synthesizes it
 * from each AttribMod's RPN `requires`. Phalanx's per-ally +Def increment is a
 * Self-targeted buff whose requires counts nearby OTHER players via the
 * self-exclusion clause `entref target> entref source> eq ! enttype target>
 * player eq &&`. The old heuristic saw the `player eq` substring and tagged it
 * PVP_ONLY, so convert-powerset dropped it from the PvE planner — Rebirth
 * Phalanx generated a flat +Def with NO ally scaling, contradicting its own
 * description ("this bonus grows for each ally near you") and HC's EITHER flag.
 *
 * Fix: a Self-targeted AttribMod with the self-exclusion clause is a proximity/
 * ally-counting self-buff, not a PvE/PvP combat split → classify EITHER. This
 * guards that the ally scaling (`perTarget`) is present in generated.
 */
const RB = fileURLToPath(new URL('./datasets/rebirth/generated/powersets', import.meta.url));

const PHALANX = [
  ['Brute', 'brute/secondary/shield-defense/phalanx-fighting.ts'],
  ['Scrapper', 'scrapper/secondary/shield-defense/phalanx-fighting.ts'],
  ['Tanker', 'tanker/primary/shield-defense/phalanx-fighting.ts'],
] as const;

describe('Rebirth Phalanx Fighting per-ally defense scaling (is_pvp ally pattern)', () => {
  it.each(PHALANX)('%s Phalanx defenseBuff carries perTarget ally scaling', (_at, file) => {
    const text = fs.readFileSync(`${RB}/${file}`, 'utf8');
    // Every defense vector of the ally increment scales at perTarget 0.3.
    const perTargets = [...text.matchAll(/"perTarget":\s*0\.3\b/g)];
    expect(perTargets.length).toBe(3); // melee, ranged, area
  });
});
