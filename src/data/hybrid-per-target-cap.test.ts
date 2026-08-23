import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { EXPORTED } from './export-manifests';
import { GENERATED_HYBRID_EFFECTS as HC } from './datasets/homecoming/generated/incarnate-effects';
import { GENERATED_HYBRID_EFFECTS as REB } from './datasets/rebirth/generated/incarnate-effects';
import { GENERATED_HYBRID_EFFECTS as TSPY } from './datasets/thunderspy/generated/incarnate-effects';
import { GENERATED_HYBRID_EFFECTS as BRAIN } from './datasets/brainstorm/generated/incarnate-effects';

/**
 * HYBRID-PT-1 — the Hybrid per-foe cap is read off the power, not its tooltip.
 *
 * A Melee Hybrid stacks its buff once per enemy in the sphere, up to a ceiling that
 * differs by tier (4 / 7 / 9). The converter used to scrape that ceiling out of
 * `display_help` ("maximum strength at 9 enemies"); it now derives it from
 * `max_targets_hit` minus the caster's own slot, gated on the power actually
 * affecting `Foe`. This gate grades that derivation two ways.
 *
 * The oracle is the prose it replaced. Tooltip and target list are independent
 * statements of one fact — the writer typed the 9, the designer set the sphere's
 * capacity to 10 — so their agreement on every melee tier on every fork is evidence
 * neither is a transcription of the other. Where the prose says nothing (Assault,
 * Control, Support) it grades nothing, which is why the second leg exists: the
 * derivation must also reproduce the value the generated data actually ships, for
 * every hybrid, prose or no prose.
 *
 * What it cannot see: whether `max_targets_hit` itself is decoded correctly. Both
 * legs read the same export field, so a parser that mis-read the sphere capacity
 * would move the derivation and the shipped value together — the prose leg is the
 * only thing standing outside that, and only for the 9 melee records.
 */

const DATASETS: Array<[string, Record<string, { maxTargets: number; perTarget: Record<string, number> }>]> = [
  ['homecoming', HC],
  ['rebirth', REB],
  ['thunderspy', TSPY],
  ['brainstorm', BRAIN],
];

/** The converter's own path resolution: Homecoming keeps the legacy flat layout. */
function hybridDir(dataset: string): string {
  const namespaced = join(EXPORTED, dataset, 'incarnate', 'hybrid');
  return dataset === 'homecoming' && !existsSync(namespaced)
    ? join(EXPORTED, 'incarnate', 'hybrid')
    : namespaced;
}

interface HybridRecord {
  id: string;
  displayHelp: string;
  maxTargetsHit: number;
  targetsAffected: string[];
}

function readHybrids(dataset: string): HybridRecord[] {
  const dir = hybridDir(dataset);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => {
      const d = JSON.parse(readFileSync(join(dir, f), 'utf-8'));
      return {
        id: f.replace(/\.json$/, ''),
        displayHelp: d.display_help || '',
        maxTargetsHit: d.max_targets_hit || 0,
        targetsAffected: d.targets_affected || [],
      };
    });
}

/** The converter's derivation, restated here so the gate grades a rule and not a copy. */
function derivedCap(r: HybridRecord): number {
  if (!r.targetsAffected.includes('Foe')) return 0;
  return Math.max(0, r.maxTargetsHit - (r.targetsAffected.includes('Self') ? 1 : 0));
}

describe('Hybrid per-foe cap', () => {
  it('agrees with the tooltip on every record that states a number', () => {
    const graded: string[] = [];
    for (const [dataset] of DATASETS) {
      for (const r of readHybrids(dataset)) {
        const m = r.displayHelp.match(/maximum strength at (\d+) enem/i);
        if (!m) continue;
        graded.push(`${dataset}/${r.id}`);
        expect(derivedCap(r), `${dataset}/${r.id} cap`).toBe(parseInt(m[1], 10));
      }
    }
    // Anti-vacuous: nine melee tiers on each of four forks. A path that resolves to
    // an empty directory, or a prose rewrite that drops the phrase, empties the loop
    // above and would otherwise pass in silence.
    expect(graded.length).toBe(36);
    expect(graded.filter((g) => g.includes('melee_genome')).length).toBe(36);
  });

  it('reproduces the shipped maxTargets for every hybrid on every fork', () => {
    for (const [dataset, generated] of DATASETS) {
      for (const r of readHybrids(dataset)) {
        const gen = generated[r.id];
        if (!gen) continue; // silent-boost records and the like are not hybrids proper
        expect(gen.maxTargets, `${dataset}/${r.id} shipped cap`).toBe(derivedCap(r));
      }
    }
  });

  it('caps only the trees that actually hit foes', () => {
    for (const [dataset, generated] of DATASETS) {
      const records = readHybrids(dataset);
      // Support's sphere holds 255 leaguemates and has no per-foe layer at all. It is
      // the case that separates "read max_targets_hit" from "read it when Foe is
      // affected": a derivation missing the Foe test ships 254 here.
      const support = records.filter((r) => r.targetsAffected.includes('Leaguemate'));
      expect(support.length, `${dataset} support roster`).toBeGreaterThan(0);
      for (const r of support) {
        expect(r.maxTargetsHit, `${dataset}/${r.id} raw`).toBeGreaterThan(9);
        expect(generated[r.id]?.maxTargets, `${dataset}/${r.id} cap`).toBe(0);
      }
      // And a cap of 0 must never sit under a live per-foe layer: that pairing is a
      // per-foe buff the slider can never raise off zero.
      for (const r of records) {
        const gen = generated[r.id];
        if (!gen || Object.keys(gen.perTarget).length === 0) continue;
        expect(gen.maxTargets, `${dataset}/${r.id} has perTarget but no cap`).toBeGreaterThan(0);
      }
    }
  });
});
