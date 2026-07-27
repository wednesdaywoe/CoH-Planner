import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Structural invariants on the COMMITTED generated data.
 *
 * These run in CI with NO raw data (the `exported_powers` source is gitignored —
 * see HOMECOMING_PARSER.md), by scanning the generated `.ts` files directly. They
 * lock in the converter-regression classes that have repeatedly bitten us, so a
 * bad converter change is caught at PR time instead of months later on a manual
 * regen:
 *   1. export const identifier === PascalCase(internalName) (= file name) — the
 *      recurring Bio Armor naming saga. Module identifiers must derive from the
 *      stable internal name, never the mutable display name.
 *   2. No malformed bare `specialBuff` — the RechargeTime/Strength stacking-patch
 *      regression that corrupted the keyed strength container.
 *   3. No unsigned `0xFFFFFFFF` (4294967295) sentinels — must be normalized to -1.
 *   4. No NEW PvP-only mez tables — the prefer-PvE mez fix; a small allowlist of
 *      powers whose bin data is genuinely PvP-table-only is grandfathered.
 *
 * If one of these fails, regenerate the affected data (the converter output drifted
 * or a converter change produced bad output) — don't just edit the generated file.
 */

const DATASETS_DIR = fileURLToPath(new URL('./datasets', import.meta.url));

function walkTs(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTs(p, out);
    else if (entry.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

const DATASETS = ['homecoming', 'rebirth'];
// Every generated .ts (powersets/**, plus the single-object epic-pools / power-pools
// / incarnate-effects files).
const generatedFiles = DATASETS.flatMap((ds) => walkTs(path.join(DATASETS_DIR, ds, 'generated')));
// The per-power powerset files (one `export const <Power>` each), excluding indexes.
const powerFiles = generatedFiles.filter(
  (f) => f.replace(/\\/g, '/').includes('/generated/powersets/') && !f.endsWith('index.ts'),
);

const rel = (f: string) => path.relative(DATASETS_DIR, f).replace(/\\/g, '/');
const read = (f: string) => fs.readFileSync(f, 'utf8');
const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '');

/**
 * Powers whose mez is stored ONLY on a `*_PvPMez` table in the bin — there is no
 * PvE alternative for the converter's prefer-PvE rule to pick, so they legitimately
 * keep the PvP table. (Their mez DURATION is then unresolvable — a separate data
 * limitation, not a converter bug.) A NEW PvP-mez file failing the test below means
 * either a regression in prefer-PvE or another genuinely-PvP-only power to justify
 * and add here.
 */
const PVP_MEZ_ALLOWLIST = new Set([
  'homecoming/generated/powersets/blaster/primary/psychic-blast/scramble-thoughts.ts',
  'homecoming/generated/powersets/corruptor/primary/psychic-blast/scramble-thoughts.ts',
  'homecoming/generated/powersets/defender/secondary/psychic-blast/scramble-thoughts.ts',
  'homecoming/generated/powersets/dominator/primary/ice-control/arctic-air.ts',
  // Epic.Field_Mastery.Repulsion_Bomb — stun stored only on Ranged_PvPMez in the
  // bin (its damage is likewise on Ranged_PvPDamage; a separate data quirk).
  'homecoming/generated/epic-pools.ts',
]);

describe('generated-data invariants (committed; CI-runnable, no raw data)', () => {
  it('discovers the generated powerset files', () => {
    // Guards against the walk silently returning nothing (which would make every
    // invariant below vacuously pass).
    expect(powerFiles.length).toBeGreaterThan(1000);
  });

  it('export const identifier === PascalCase(internalName) (= file name)', () => {
    const offenders: string[] = [];
    for (const f of powerFiles) {
      const t = read(f);
      const exp = t.match(/export const (\w+): Power/)?.[1];
      const internal = t.match(/"internalName":\s*"([^"]+)"/)?.[1];
      if (!exp || !internal) continue;
      const expected = sanitize(internal);
      if (exp !== expected) offenders.push(`${rel(f)}: export "${exp}" != "${expected}"`);
    }
    expect(offenders).toEqual([]);
  });

  it('no malformed bare specialBuff (must be a keyed { stat: effect } container)', () => {
    const offenders = generatedFiles.filter((f) => /"specialBuff":\s*\{\s*"scale"/.test(read(f))).map(rel);
    expect(offenders).toEqual([]);
  });

  it('no unsigned 0xFFFFFFFF sentinels (must be normalized to -1)', () => {
    const offenders = generatedFiles.filter((f) => read(f).includes('4294967295')).map(rel);
    expect(offenders).toEqual([]);
  });

  it('no NEW PvP-only mez tables (prefer-PvE); known PvP-only powers allowlisted', () => {
    const offenders = generatedFiles
      .filter((f) => /"table":\s*"\w*PvPMez"/.test(read(f)))
      .map(rel)
      .filter((r) => !PVP_MEZ_ALLOWLIST.has(r));
    expect(offenders).toEqual([]);
  });

  // A PvP-map value must never reach the BASE atom set. The planner is PvE-only,
  // so `isPVPMap?` content is conditional by definition and its `isPVPMap? !` twin
  // is the one that applies. `_isConditionalGate`'s trailing-`!` shortcut reads the
  // last token of the `&&`-flattened requires as if it were the top-level operator;
  // that holds for a conjunction of negations ("no combo level active" — genuinely
  // the default) but not when the `!` negates only ONE conjunct. Rebirth's Weave,
  // Hover and Guardian Dispersion Bubble all carry `isPVPMap? … eq ! &&`, and all
  // 24 of their PvP atoms were landing ungated (Dispersion Bubble's and Hover's
  // also reached the bag as a phantom `mezResistance`). Scans EVERY atom tuple at
  // any indent depth, so the nested power-pools / epic-pools structures are covered
  // — a powersets-only walk misses exactly where this bit.
  it('no PvP-map value reaches the base atom set (gated, never base)', () => {
    const ATOM_LINE = /^[ \t]*(\[".*?\])[ \t]*,?[ \t]*$/gm;
    const I_REQUIRES = 22;
    const I_GATED = 23;
    const BARE_PVP = /\bisPVPMap\?(?!\s+!)/i;

    const offenders: string[] = [];
    let scanned = 0;
    let pvp = 0;

    for (const ds of ['homecoming', 'rebirth', 'thunderspy']) {
      for (const f of walkTs(path.join(DATASETS_DIR, ds, 'generated'))) {
        for (const m of read(f).matchAll(ATOM_LINE)) {
          let atom: unknown[];
          try { atom = JSON.parse(m[1]) as unknown[]; } catch { continue; }
          if (typeof atom[0] !== 'string') continue;
          scanned++;
          const requires = atom[I_REQUIRES];
          if (typeof requires !== 'string' || !BARE_PVP.test(requires)) continue;
          pvp++;
          if (atom[I_GATED] !== true) offenders.push(`${rel(f)}: ${atom[0]}/${atom[1]} scale ${atom[2]} — ${requires}`);
        }
      }
    }

    // Guard the guard: print-and-assert the counts so a regex that stops matching
    // (indent change, encoder reorder) fails loudly instead of passing vacuously.
    expect(scanned).toBeGreaterThan(50_000);
    expect(pvp).toBeGreaterThan(1_000);
    expect(offenders).toEqual([]);
  });

  // Every toggle with an endurance cost must carry its `activatePeriod` (tick
  // period). End/sec = endurance / activatePeriod; when the field is missing the
  // runtime transform falls back to 0.5s, overcounting any toggle whose real
  // period differs (Oppressive Gloom ticks every 2.0s → its 0.156 cost is 0.08/s,
  // not the 0.31/s the 0.5 default produced). The epic-pools converter once
  // dropped this field for all 75 epic toggles; this locks it in for the
  // single-object epic-pools / power-pools generated files in both datasets.
  it('every endurance-costing toggle carries activatePeriod (no 0.5s fallback)', () => {
    const offenders: string[] = [];
    for (const ds of DATASETS) {
      for (const name of ['epic-pools.ts', 'power-pools.ts']) {
        const file = path.join(DATASETS_DIR, ds, 'generated', name);
        if (!fs.existsSync(file)) continue;
        const m = read(file).match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\})\s*(?:as\s+const)?\s*;?\s*$/);
        if (!m) continue;
        const obj = JSON.parse(m[1]) as Record<string, { powers?: Array<{ internalName?: string; name?: string; powerType?: string; effects?: { endurance?: number; activatePeriod?: number } }> }>;
        for (const poolId of Object.keys(obj)) {
          for (const p of obj[poolId].powers ?? []) {
            if (p.powerType === 'Toggle' && p.effects?.endurance != null && p.effects.activatePeriod == null) {
              offenders.push(`${ds}/${poolId}/${p.internalName ?? p.name}`);
            }
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
