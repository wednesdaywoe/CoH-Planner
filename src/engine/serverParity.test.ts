/**
 * PROD5 — per-server engine-vs-legacy parity spot-check.
 *
 * The spike browser-verified only Homecoming. This exercises all three datasets through the
 * Rust engine and diffs its dashboard totals against the legacy TS calc on an IDENTICAL,
 * data-driven build (no fork proper nouns — the build is assembled by reading each dataset's
 * own registries, per Rule 0). A per-server row surfacing here means the engine and the old
 * calc disagree on that fork's data, which is exactly what PROD5 must catch before the two
 * new servers ship on the engine.
 *
 * The engine runs via the wasm-node target (the browser `engine.ts` uses fetch + `?url`, which
 * has no Node path); the reshape mirrors `engineCalculate` field-for-field so the comparison is
 * against what the browser would produce.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDataset } from '@/data/dataset';
import { getArchetype, STANDARD_ARCHETYPE_IDS } from '@/data/archetypes';
import { getPowersetsForArchetype } from '@/data/powersets';
import { getAvailableGenericIOs, createGenericIOEnhancement } from '@/data/enhancement-registry';
import { withoutIllegalSlots } from '@/utils/build-enhancement-validation';
import { createEmptyBuild } from '@/types/build';
import { legacyCalculateCharacterTotals } from '@/utils/calculations/character-totals';
import { toCharacterStateJson, type AdapterCalcContext } from './characterStateAdapter';
import { mapStats, mapGlobal, type EngineTotals } from './engineTotalsMap';
import type { Build } from '@/types/build';
import type { Power, SelectedPower } from '@/types/power';

// wasm-node is a CommonJS module that instantiates the .wasm synchronously from its own dir.
const require = createRequire(import.meta.url);

const SERVERS = ['homecoming', 'rebirth', 'thunderspy'] as const;
type Server = (typeof SERVERS)[number];

// The engine artifacts are generated and gitignored: the web target + bundles come from
// `npm run build:engine`; this test additionally needs the Node target, built with
//   wasm-bindgen --target nodejs --out-dir src/engine/wasm-node --out-name coh_wasm <coh_wasm.wasm>
//   (then rename the emitted coh_wasm.js → coh_wasm.cjs, since the repo is "type":"module").
// A fresh checkout / CI without those cannot run this — skip loudly rather than error.
const NODE_ENGINE = join(__dirname, 'wasm-node', 'coh_wasm.cjs');
const BUNDLE_DIR = join(__dirname, '..', '..', 'public', 'engine', 'contract');
const artifactsReady =
  existsSync(NODE_ENGINE) && SERVERS.every((s) => existsSync(join(BUNDLE_DIR, `${s}.json.gz`)));

type EngineHandle = { recalculate: (json: string) => string };
const nodeEngine = artifactsReady
  ? (require('./wasm-node/coh_wasm.cjs') as { load_dataset: (bytes: Uint8Array) => EngineHandle })
  : null;

// One handle per dataset, loaded from the same gzip bundle engine.ts fetches in the browser.
const handles = new Map<Server, EngineHandle>();

function engineHandle(server: Server) {
  const cached = handles.get(server);
  if (cached) return cached;
  const handle = nodeEngine!.load_dataset(new Uint8Array(readFileSync(join(BUNDLE_DIR, `${server}.json.gz`))));
  handles.set(server, handle);
  return handle;
}

// The same defaults calculateCharacterTotals assembles when the hook passes no options.
const CTX: AdapterCalcContext = {
  exemplarMode: false,
  exemplarLevel: 50,
  incarnateActive: { alpha: false, destiny: false, hybrid: false, interface: false, judgement: false, lore: false, genesis: false },
  incarnateLevelShiftActive: true,
  targetsHitValues: {},
  targetLevelOffset: 0,
  vigilanceTeamSize: 0,
  furyLevel: 75,
  combatMode: false,
  destinyTime: null,
  globalAdjusters: {},
  mechanicAdjusters: {},
};

/** A power is pickable at 50 when it unlocks by level (available 0-indexed, < 50) and isn't
 *  a prerequisite-gated hidden entry (available < 0). */
function pickable(p: Power): boolean {
  return p.available >= 0 && p.available < 50;
}

/** Slot up to three distinct valid generic IOs (L50) so the enhancement-value + ED path fires;
 *  a power with no common-IO slot (auto/passive) stays unslotted. */
function slotsFor(power: Power): (SelectedPower['slots'][number])[] {
  const stats = getAvailableGenericIOs(power).slice(0, 3);
  return stats.map((stat) => createGenericIOEnhancement(stat, 50));
}

/** Build the richest data-driven build a fork offers without naming anything: the first
 *  standard archetype's first primary + secondary set, every level-≤50 power selected, toggles
 *  and autos active, each power slotted with valid generic IOs. Exercises the fork's base
 *  tables, active-power bonuses, purple patch, movement, and ED — the fork-specific surfaces. */
function buildFor(server: Server): Build {
  const build = createEmptyBuild(server);
  build.level = 50;
  // The Archetype object carries no `id` (it lives in the registry key), so drive off the id.
  const atId = STANDARD_ARCHETYPE_IDS[0];
  const at = getArchetype(atId);
  build.archetype = { id: atId, name: at?.name ?? atId, stats: null, inherent: null } as Build['archetype'];

  const setsFor = (category: string) =>
    getPowersetsForArchetype(atId).filter(
      (ps) => (ps.category ?? '').toLowerCase() === category && !ps.dormant,
    );

  const selectFrom = (powersetId: string, powers: Power[]): SelectedPower[] =>
    powers.filter(pickable).map((p) => ({
      ...p,
      powerSet: powersetId,
      level: p.available + 1,
      slots: slotsFor(p),
      isActive: p.powerType === 'Toggle' || p.powerType === 'Auto',
    }));

  const primary = setsFor('primary')[0];
  const secondary = setsFor('secondary')[0];
  if (primary) {
    build.primary = { id: primary.id!, name: primary.name, powers: selectFrom(primary.id!, primary.powers) };
  }
  if (secondary) {
    build.secondary = { id: secondary.id!, name: secondary.name, powers: selectFrom(secondary.id!, secondary.powers) };
  }
  return build;
}

function engineResult(server: Server, build: Build) {
  const json = engineHandle(server).recalculate(toCharacterStateJson(withoutIllegalSlots(build), CTX));
  const totals = JSON.parse(json) as EngineTotals;
  return { stats: mapStats(totals.stats, totals.bonuses), global: mapGlobal(totals.bonuses), errors: totals.bonuses.errors ?? [] };
}

// The engine computes in f32; the legacy calc in f64 JS numbers. Widening a summed f32 total back
// to f64 leaves error up to a few hundredths on values in the hundreds (e.g. recovery 71.19 reads
// as 71.1899995803833). A dashboard total apart by more than this is a real disagreement, not that.
const F32_TOLERANCE = 0.05;

// GlobalBonuses fields `mapGlobal` deliberately hardcodes to 0 — they have no engine source and
// feed no dashboard total (see engineTotalsMap.ts). The legacy calc still fills them, so a
// difference here is expected and off-scope for parity.
const UNMAPPED = new Set(['threatLevel', 'protRepel', 'protTeleport', 'toggleEndCost', 'enduranceDiscount', 'netEndPerSec']);

// Stats (lowercased key) where the engine intentionally supersedes the legacy calc — the engine
// reads a faithful effect the beta's older converter drops. These are validated, not defects:
//   - homecoming `recharge`: Beta_Decay's per-target self-recharge (+12.5%). The engine models the
//     caster buff (its `scale` base); the legacy calc omits it entirely.
//   - thunderspy `maxhp`: Metabolic_Aura's `maxHPBuff{scale:0.333, Melee_HealSelf}` (+3.33). The
//     rebuild export carries it; the beta `effects` for the same toggle has no maxHP key at all.
// (See PROD5 in docs/SIDEKICK-PRODUCTIONIZE-PLAN.md for the adjudication.)
const ADJUDICATED: Record<Server, Set<string>> = {
  homecoming: new Set(['recharge']),
  rebirth: new Set(),
  thunderspy: new Set(['maxhp']),
};

function diff(server: Server, a: Record<string, number>, b: Record<string, number>): string[] {
  const out: string[] = [];
  for (const key of Object.keys(a)) {
    if (UNMAPPED.has(key)) continue;
    if (ADJUDICATED[server].has(key.toLowerCase())) continue;
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    if (Math.abs(av - bv) > F32_TOLERANCE) out.push(`${key}: engine ${av} vs legacy ${bv}`);
  }
  return out;
}

const suite = artifactsReady ? describe : describe.skip;
if (!artifactsReady) {
  // eslint-disable-next-line no-console
  console.warn('[PROD5 parity] skipped — engine artifacts absent; run `npm run build:engine` and build the Node target (see file header).');
}

suite('PROD5 — engine vs legacy dashboard parity, per server', () => {
  beforeAll(() => {
    // Warm each engine handle once so a load failure surfaces here, not mid-assert.
    for (const s of SERVERS) engineHandle(s);
  });

  it.each(SERVERS)('%s: engine loads, errors clean, and matches the legacy calc', async (server) => {
    await loadDataset(server); // activates this dataset for the legacy TS calc
    const build = buildFor(server);

    // Guard the fixture itself: a build that selected nothing would trivially "match" at zero.
    const powerCount = build.primary.powers.length + build.secondary.powers.length;
    expect(powerCount, `${server}: fixture selected no powers`).toBeGreaterThan(0);

    const legacy = legacyCalculateCharacterTotals(build, false, undefined, {});
    const engine = engineResult(server, build);

    // Hard invariants: the per-serverId load path returned real, sane numbers.
    expect(engine.errors, `${server}: engine returned errors`).toEqual([]);
    for (const [key, value] of Object.entries({ ...engine.stats, ...engine.global })) {
      expect(Number.isFinite(value), `${server}: engine ${key} not finite (${value})`).toBe(true);
    }

    const statDeltas = diff(server, engine.stats as unknown as Record<string, number>, legacy.stats as unknown as Record<string, number>);
    const globalDeltas = diff(server, engine.global as unknown as Record<string, number>, legacy.globalBonuses as unknown as Record<string, number>);

    if (statDeltas.length || globalDeltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD5 parity] ${server} (${powerCount} powers)\n  stats:\n    ${statDeltas.join('\n    ')}\n  global:\n    ${globalDeltas.join('\n    ')}`);
    }
    expect({ statDeltas, globalDeltas }).toEqual({ statDeltas: [], globalDeltas: [] });
  }, 30000); // dataset load (large TS modules) + a full legacy calc exceed the 5s default
});
