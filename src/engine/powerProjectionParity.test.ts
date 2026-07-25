/**
 * PROD6B-1/6B-2 — per-power projection fidelity gate.
 *
 * The engine's new `power_projection` block must equal the beta's own per-power calculators
 * (`calculatePowerEnhancementBonuses` + `calcThreeTier` + `calculateArcanaTime` +
 * `calculatePermaInfo`) that PROD6C–E will retire. This drives all three forks through the Rust
 * engine (wasm-node) on the SAME data-driven build the PROD5 dashboard gate uses (no fork proper
 * nouns — Rule 0), then diffs the engine's resolved execution three-tiers + ArcanaTime + perma
 * against the beta calculators, power by power. A row here means the engine and the TS calc
 * disagree on a fork's per-power math — exactly what must not ship before 6C swaps the surfaces.
 *
 * PROD6B-2 adds the granted buff/debuff magnitudes to the same diff. Their beta reference is
 * `resolvePowerMagnitudes` — the pure function extracted from `RegistryEffectsDisplay`, which
 * that component now calls (decision 2026-07-24, user-chosen: extract the real resolver rather
 * than reimplement it in the test, so the gate grades the code path the UI actually runs).
 *
 * The engine runs via wasm-node (the browser `engine.ts` has no Node path), same as
 * `serverParity.test.ts`. The fixture is deliberately parallel to that gate but kept local so the
 * committed dashboard gate stays untouched.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDataset } from '@/data/dataset';
import { getArchetype, STANDARD_ARCHETYPE_IDS } from '@/data/archetypes';
import { getPowersetsForArchetype } from '@/data/powersets';
import { getAvailableGenericIOs, createGenericIOEnhancement } from '@/data/enhancement-registry';
import { getIOSet } from '@/data/io-sets';
import { withoutIllegalSlots } from '@/utils/build-enhancement-validation';
import { createEmptyBuild } from '@/types/build';
import { calculatePowerEnhancementBonuses } from '@/utils/calculations/enhancement-values';
import { calculatePermaInfo, type PermaInfo } from '@/utils/calculations/perma';
import { calculateArcanaTime } from '@/utils/calculations/damage';
import { calcThreeTier, convertGlobalBonusesToAspects, type ThreeTierValues } from '@/components/info/powerDisplayUtils';
import { resolvePowerMagnitudes, type ResolvedMagnitude } from '@/components/info/resolvePowerMagnitudes';
import { toCharacterStateJson, type AdapterCalcContext } from './characterStateAdapter';
import { mapGlobal, mapPowerProjection, type EngineTotals, type GrantedMagnitude, type PowerProjection } from './engineTotalsMap';
import type { Build } from '@/types/build';
import type { Power, SelectedPower } from '@/types/power';

const require = createRequire(import.meta.url);

const SERVERS = ['homecoming', 'rebirth', 'thunderspy'] as const;
type Server = (typeof SERVERS)[number];

const NODE_ENGINE = join(__dirname, 'wasm-node', 'coh_wasm.cjs');
const BUNDLE_DIR = join(__dirname, '..', '..', 'public', 'engine', 'contract');
const artifactsReady =
  existsSync(NODE_ENGINE) && SERVERS.every((s) => existsSync(join(BUNDLE_DIR, `${s}.json.gz`)));

type EngineHandle = { recalculate: (json: string) => string };
const nodeEngine = artifactsReady
  ? (require('./wasm-node/coh_wasm.cjs') as { load_dataset: (bytes: Uint8Array) => EngineHandle })
  : null;

const handles = new Map<Server, EngineHandle>();
function engineHandle(server: Server) {
  const cached = handles.get(server);
  if (cached) return cached;
  const handle = nodeEngine!.load_dataset(new Uint8Array(readFileSync(join(BUNDLE_DIR, `${server}.json.gz`))));
  handles.set(server, handle);
  return handle;
}

// The same defaults the totals hook assembles with no options — no incarnates, even level.
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

function pickable(p: Power): boolean {
  return p.available >= 0 && p.available < 50;
}

function slotsFor(power: Power): SelectedPower['slots'] {
  const stats = getAvailableGenericIOs(power).slice(0, 3);
  return stats.map((stat) => createGenericIOEnhancement(stat, 50));
}

/** The richest data-driven build a fork offers, assembled with no proper nouns (mirrors the PROD5
 *  gate): first standard AT's first primary + secondary, every ≤50 power, three generic IOs each. */
function buildFor(server: Server, atId: (typeof STANDARD_ARCHETYPE_IDS)[number] = STANDARD_ARCHETYPE_IDS[0]): Build {
  const build = createEmptyBuild(server);
  build.level = 50;
  const at = getArchetype(atId);
  build.archetype = { id: atId, name: at?.name ?? atId, stats: null, inherent: null } as Build['archetype'];

  const setsFor = (category: string) =>
    getPowersetsForArchetype(atId).filter((ps) => (ps.category ?? '').toLowerCase() === category && !ps.dormant);
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
  if (primary) build.primary = { id: primary.id!, name: primary.name, powers: selectFrom(primary.id!, primary.powers) };
  if (secondary) build.secondary = { id: secondary.id!, name: secondary.name, powers: selectFrom(secondary.id!, secondary.powers) };
  return build;
}

function engineTotals(server: Server, build: Build): EngineTotals {
  const json = engineHandle(server).recalculate(toCharacterStateJson(withoutIllegalSlots(build), CTX));
  return JSON.parse(json) as EngineTotals;
}

/** Base execution stat the engine's / RegistryEffectsDisplay's way: `stats.<key>` when truthy,
 *  else `effects.<effectsKey>`. */
function truthyStat(power: SelectedPower, statKey: string, effectsKey: string): number | null {
  const stats = (power as unknown as { stats?: Record<string, number> }).stats;
  const effects = (power as unknown as { effects?: Record<string, number> }).effects;
  const s = stats?.[statKey];
  if (s) return s;
  const e = effects?.[effectsKey];
  return e || null;
}

function baseEnduranceCost(power: SelectedPower): number | null {
  const stats = (power as unknown as { stats?: Record<string, number> }).stats;
  const effects = (power as unknown as { effects?: Record<string, number> }).effects;
  const end = stats?.endurance;
  if (end) {
    if ((power.powerType ?? '').toLowerCase() === 'toggle') {
      const period = stats?.activatePeriod ?? 0.5;
      return end / period;
    }
    return end;
  }
  return effects?.enduranceCost || null;
}

// f32 engine vs f64 JS — a per-power value apart by more than this is a real disagreement.
const TOLERANCE = 0.05;

function tierDelta(label: string, engine: ThreeTierValues | null, beta: ThreeTierValues | null): string[] {
  if (engine === null && beta === null) return [];
  if (engine === null || beta === null) return [`${label}: engine ${engine ? 'set' : 'null'} vs beta ${beta ? 'set' : 'null'}`];
  const out: string[] = [];
  for (const k of ['base', 'enhanced', 'final'] as const) {
    if (Math.abs(engine[k] - beta[k]) > TOLERANCE) out.push(`${label}.${k}: engine ${engine[k]} vs beta ${beta[k]}`);
  }
  return out;
}

// A perma delta split into real disagreements and adjudicated engine-supersedes-beta ones. The
// engine computes perma ONLY from a real exported recharge + duration, so "engine set, beta null"
// always means the engine read a buff/heal/summon duration the fork's beta converter dropped (the
// PROD5 pattern — the export is truth). That is logged, not failed. The reverse (engine null while
// the beta has a perma) would mean the engine dropped a duration the beta carries — a real defect,
// so it stays a hard delta.
function permaDelta(engine: PermaInfo | null, beta: PermaInfo | null): { real: string[]; adjudicated: string[] } {
  if (engine === null && beta === null) return { real: [], adjudicated: [] };
  if (engine !== null && beta === null) {
    return { real: [], adjudicated: [`perma: engine computes (recharge ${engine.baseRecharge}s / dur ${engine.duration}s) but beta dropped the duration → null`] };
  }
  if (engine === null || beta === null) return { real: [`perma: engine ${engine ? 'set' : 'null'} vs beta ${beta ? 'set' : 'null'}`], adjudicated: [] };
  const real: string[] = [];
  const numeric: (keyof PermaInfo)[] = ['baseRecharge', 'duration', 'effectiveRecharge', 'rechargeNeeded', 'totalRecharge', 'permaPercent'];
  for (const k of numeric) {
    if (Math.abs((engine[k] as number) - (beta[k] as number)) > TOLERANCE) real.push(`perma.${k}: engine ${engine[k]} vs beta ${beta[k]}`);
  }
  if (engine.isPerma !== beta.isPerma) real.push(`perma.isPerma: engine ${engine.isPerma} vs beta ${beta.isPerma}`);
  return { real, adjudicated: [] };
}

/** The beta reference for one power — the calculators + resolver PROD6C–E will retire. Both halves
 *  come from one call so the enhancement bonuses they read are the same object. */
function betaReference(
  power: SelectedPower,
  build: Build,
  archetypeId: string,
  rawGlobal: ReturnType<typeof mapGlobal>,
): { projection: Omit<PowerProjection, 'grantedMagnitudes'>; magnitudes: Map<string, ResolvedMagnitude> } {
  const enh = calculatePowerEnhancementBonuses(
    { name: power.name, slots: power.slots, allowedEnhancements: power.allowedEnhancements },
    build.level,
    getIOSet,
    undefined,
  );
  const global = convertGlobalBonusesToAspects(rawGlobal);

  const rechargeBase = truthyStat(power, 'recharge', 'recharge');
  const endBase = baseEnduranceCost(power);
  const accBase = truthyStat(power, 'accuracy', 'accuracy');
  const castBase = truthyStat(power, 'castTime', 'castTime');
  const rangeBase = truthyStat(power, 'range', 'range');

  return {
    projection: {
      recharge: rechargeBase !== null ? calcThreeTier('recharge', rechargeBase, enh, global) : null,
      enduranceCost: endBase !== null ? calcThreeTier('endurance', endBase, enh, global) : null,
      accuracy: accBase !== null ? calcThreeTier('accuracy', accBase, enh, global) : null,
      castTime: castBase !== null ? calcThreeTier('castTime', castBase, enh, global) : null,
      arcanaTime: castBase !== null ? calculateArcanaTime(castBase) : null,
      range: rangeBase !== null ? calcThreeTier('range', rangeBase, enh, global) : null,
      perma: calculatePermaInfo(power, enh, (rawGlobal.recharge ?? 0) / 100),
    },
    magnitudes: betaMagnitudes(power, build, archetypeId, enh, global),
  };
}

/** The beta reference magnitudes for one power — the resolver `RegistryEffectsDisplay` calls. */
function betaMagnitudes(
  power: SelectedPower,
  build: Build,
  archetypeId: string,
  enh: Record<string, number | undefined>,
  global: Record<string, number | undefined>,
): Map<string, ResolvedMagnitude> {
  const rows = resolvePowerMagnitudes({
    effects: (power as unknown as { effects?: Parameters<typeof resolvePowerMagnitudes>[0]['effects'] }).effects,
    archetypeId,
    level: build.level,
    enhancementBonuses: enh,
    globalBonuses: global,
    // 1.0, not the archetype's support modifier: the engine cannot carry the beta's
    // Defender/Controller-primary rule (it keys on archetype NAMES — Rule 0). The path is
    // unreachable while every effect value carries a resolvable table; a power that DID reach
    // it would surface here as a delta rather than pass silently.
    buffDebuffMod: 1.0,
  });
  return new Map(rows.map((row) => [row.rowKey, row]));
}

/** Effect keys the rebuild's EXPORT is missing on at least one fork while the beta's converted
 *  dataset still carries them — so the beta resolves a row the engine cannot. Verified per key
 *  against `contract/<fork>/bundle.json.gz`:
 *
 *   - `absorb`: HC `sentinel/bio-armor Parasitic_Leech` records `durations.absorb: 45` but carries
 *     NO `absorb` magnitude. The export knows the effect exists and dropped its value — a real
 *     export gap, not a resolution disagreement.
 *   - `effectDuration`: tspy `dominator/akimbo-assault Power_Build_Up` has no `effectDuration` in
 *     the export while the beta dataset does.
 *
 *  Listed rather than tolerated wholesale: anything NOT here still fails, so this cannot quietly
 *  absorb a genuine engine drop. These are export/converter defects tracked in the plan doc — the
 *  parser owns them, and this gate is what keeps them visible. Effect keys are schema vocabulary,
 *  not game proper nouns, so naming them here does not breach Rule 0. */
const KNOWN_EXPORT_GAP_EFFECT_KEYS = new Set(['absorb', 'effectDuration']);

/** Diff one power's granted magnitudes, split into real disagreements and adjudicated
 *  engine-supersedes-beta ones. Rows are matched by key, not position — the engine emits them in
 *  bag order while the beta resolver emits them in registry-group order, and row ORDER is the
 *  component's sort, not part of the resolution under test.
 *
 *  An "engine only" row is ACCEPTED only when the beta's own power object has no such effect key:
 *  that means the fork's beta converter dropped an effect the rebuild's parser recovered (the
 *  export is truth — the PROD5 pattern), not that the engine invented a row. If the beta HAS the
 *  key and still resolved no row, the two disagree about resolution and that is a hard delta.
 *  "beta only" is always hard: the engine dropping a row the beta carries is an engine defect. */
function magnitudeDeltas(
  powerName: string,
  engineRows: GrantedMagnitude[],
  betaRows: Map<string, ResolvedMagnitude>,
  betaEffects: Record<string, unknown> | undefined,
): { real: string[]; adjudicated: string[]; exportGaps: string[] } {
  const out: string[] = [];
  const adjudicated: string[] = [];
  const exportGaps: string[] = [];
  const engineByKey = new Map(engineRows.map((row) => [row.rowKey, row]));

  for (const key of new Set([...engineByKey.keys(), ...betaRows.keys()])) {
    const engine = engineByKey.get(key);
    const beta = betaRows.get(key);
    if (engine && !beta) {
      if (betaEffects?.[engine.effectKey] == null) {
        adjudicated.push(`${key}: engine resolved ${engine.label} = ${engine.value.base} but the beta dataset carries no '${engine.effectKey}' effect`);
      } else {
        out.push(`${powerName}.${key}: engine only (beta HAS '${engine.effectKey}' but resolved no row)`);
      }
      continue;
    }
    if (!engine || !beta) {
      const message = `${powerName}.${key}: beta only (engine resolved no row)`;
      if (beta && KNOWN_EXPORT_GAP_EFFECT_KEYS.has(beta.effectKey)) exportGaps.push(message);
      else out.push(message);
      continue;
    }
    for (const tier of ['base', 'enhanced', 'final'] as const) {
      if (Math.abs(engine.value[tier] - beta.tiers[tier]) > TOLERANCE) {
        out.push(`${powerName}.${key}.${tier}: engine ${engine.value[tier]} vs beta ${beta.tiers[tier]}`);
      }
    }
    // The row's identity and unit must agree too — a magnitude landing in the right number but
    // the wrong unit or label would render wrong while diffing clean on value alone.
    const betaLabel = beta.expandedLabel ?? beta.config.label;
    if (engine.label !== betaLabel) out.push(`${powerName}.${key}.label: engine ${engine.label} vs beta ${betaLabel}`);
    if (engine.format !== beta.config.format) out.push(`${powerName}.${key}.format: engine ${engine.format} vs beta ${beta.config.format}`);
    if (engine.category !== beta.config.category) out.push(`${powerName}.${key}.category: engine ${engine.category} vs beta ${beta.config.category}`);
    if (engine.quantity.kind !== beta.quantity.kind) {
      out.push(`${powerName}.${key}.quantity: engine ${engine.quantity.kind} vs beta ${beta.quantity.kind}`);
    } else if (beta.quantity.kind === 'mez_duration' && engine.quantity.kind === 'mez_duration') {
      const engineMag = engine.quantity.magnitude ?? null;
      if (engineMag === null || Math.abs(engineMag - beta.quantity.magnitude) > TOLERANCE) {
        out.push(`${powerName}.${key}.mag: engine ${engineMag} vs beta ${beta.quantity.magnitude}`);
      }
    }
    const engineByType = engine.byTypeLabel ?? null;
    const betaByType = beta.byTypeLabel ?? null;
    if (engineByType !== betaByType) {
      out.push(`${powerName}.${key}.byTypeLabel: engine ${engineByType} vs beta ${betaByType}`);
    }
  }
  return { real: out, adjudicated, exportGaps };
}

const suite = artifactsReady ? describe : describe.skip;
if (!artifactsReady) {
  // eslint-disable-next-line no-console
  console.warn('[PROD6B-1 projection parity] skipped — engine artifacts absent; run `npm run build:engine` and build the Node target (see serverParity.test.ts header).');
}

suite('PROD6B-1 — engine per-power projection vs beta calculators, per server', () => {
  beforeAll(() => {
    for (const s of SERVERS) engineHandle(s);
  });

  it.each(SERVERS)('%s: every selected power projects to the beta calculators', async (server) => {
    await loadDataset(server); // activates this dataset for the beta calculators
    const build = buildFor(server);
    const powers = [...build.primary.powers, ...build.secondary.powers];
    expect(powers.length, `${server}: fixture selected no powers`).toBeGreaterThan(0);

    const totals = engineTotals(server, build);
    const projection = mapPowerProjection(totals.power_projection);
    const rawGlobal = mapGlobal(totals.bonuses);

    // Guard the fixture: at least one power must actually project (else a trivial all-null match).
    expect(projection.size, `${server}: engine projected nothing`).toBeGreaterThan(0);
    const archetypeId = build.archetype.id!;
    // …and the magnitude half must be exercised, else an empty-vs-empty diff passes vacuously.
    const magnitudeRows = [...projection.values()].reduce((n, p) => n + p.grantedMagnitudes.length, 0);
    expect(magnitudeRows, `${server}: engine resolved no granted magnitudes`).toBeGreaterThan(0);

    const deltas: string[] = [];
    const adjudicated: string[] = [];
    let matchedRows = 0;
    for (const power of powers) {
      const key = `${power.powerSet} ${power.internalName}`;
      const engine = projection.get(key);
      expect(engine, `${server}: no engine projection for ${key}`).toBeDefined();
      if (!engine) continue;
      const { projection: beta, magnitudes } = betaReference(power, build, archetypeId, rawGlobal);
      const perma = permaDelta(engine.perma, beta.perma);
      const mags = magnitudeDeltas(
        power.internalName,
        engine.grantedMagnitudes,
        magnitudes,
        (power as unknown as { effects?: Record<string, unknown> }).effects,
      );
      matchedRows += engine.grantedMagnitudes.filter((r) => magnitudes.has(r.rowKey)).length;
      deltas.push(
        ...tierDelta(`${power.internalName}.recharge`, engine.recharge, beta.recharge),
        ...tierDelta(`${power.internalName}.enduranceCost`, engine.enduranceCost, beta.enduranceCost),
        ...tierDelta(`${power.internalName}.accuracy`, engine.accuracy, beta.accuracy),
        ...tierDelta(`${power.internalName}.castTime`, engine.castTime, beta.castTime),
        ...tierDelta(`${power.internalName}.range`, engine.range, beta.range),
        ...perma.real.map((d) => `${power.internalName}.${d}`),
        ...mags.real,
      );
      adjudicated.push(
        ...perma.adjudicated.map((d) => `${power.internalName}.${d}`),
        ...mags.adjudicated.map((d) => `${power.internalName}.${d}`),
        ...mags.exportGaps.map((d) => `EXPORT GAP ${d}`),
      );
      const arcanaEngine = engine.arcanaTime ?? null;
      const arcanaBeta = beta.arcanaTime ?? null;
      if (arcanaEngine === null || arcanaBeta === null) {
        if (arcanaEngine !== arcanaBeta) deltas.push(`${power.internalName}.arcanaTime: engine ${arcanaEngine} vs beta ${arcanaBeta}`);
      } else if (Math.abs(arcanaEngine - arcanaBeta) > TOLERANCE) {
        deltas.push(`${power.internalName}.arcanaTime: engine ${arcanaEngine} vs beta ${arcanaBeta}`);
      }
    }

    // eslint-disable-next-line no-console
    console.warn(`[PROD6B-2 magnitudes] ${server}: ${magnitudeRows} engine rows across ${powers.length} powers, ${matchedRows} matched key-for-key`);
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`\n[PROD6B-1 projection parity] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6B-1 projection parity] ${server} (${powers.length} powers)\n    ${deltas.join('\n    ')}`);
    }
    expect(deltas).toEqual([]);
  }, 30000); // dataset load + per-power calculators over a full build exceed the 5s default

  // The 6B-1 fixture is one archetype, whose powers are almost all attacks — it never reaches the
  // by-type expansion (defense/resistance), mez protection, absorb, mez duration or knockback
  // distance branches, which live in armor and control sets. This sweeps EVERY standard archetype
  // so those branches are actually graded. Magnitudes only; the execution/perma half is covered
  // above.
  it.each(SERVERS)('%s: granted magnitudes match the beta resolver for every archetype', async (server) => {
    await loadDataset(server);

    const deltas: string[] = [];
    const adjudicated: string[] = [];
    const kinds = new Map<string, number>();
    let rows = 0;

    for (const atId of STANDARD_ARCHETYPE_IDS) {
      const build = buildFor(server, atId);
      const powers = [...build.primary.powers, ...build.secondary.powers];
      if (powers.length === 0) continue;

      const totals = engineTotals(server, build);
      const projection = mapPowerProjection(totals.power_projection);
      const rawGlobal = mapGlobal(totals.bonuses);

      for (const power of powers) {
        const engine = projection.get(`${power.powerSet} ${power.internalName}`);
        if (!engine) continue;
        const { magnitudes } = betaReference(power, build, atId, rawGlobal);
        const mags = magnitudeDeltas(
          `${atId}/${power.internalName}`,
          engine.grantedMagnitudes,
          magnitudes,
          (power as unknown as { effects?: Record<string, unknown> }).effects,
        );
        deltas.push(...mags.real);
        adjudicated.push(
          ...mags.adjudicated.map((d) => `${atId}/${power.internalName}.${d}`),
          ...mags.exportGaps.map((d) => `EXPORT GAP ${d}`),
        );
        rows += engine.grantedMagnitudes.length;
        for (const row of engine.grantedMagnitudes) {
          const kind = row.rowKey === row.effectKey ? row.quantity.kind : `${row.quantity.kind}+expanded`;
          kinds.set(kind, (kinds.get(kind) ?? 0) + 1);
        }
      }
    }

    // eslint-disable-next-line no-console
    console.warn(`[PROD6B-2 magnitudes] ${server} sweep: ${rows} rows — ${[...kinds].map(([k, n]) => `${k}:${n}`).join(' ')}`);
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6B-2 magnitudes] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6B-2 magnitudes] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 60).join('\n    ')}`);
    }
    // Guard against a vacuous pass: the sweep must reach the expanded by-type branch.
    expect([...kinds.keys()].some((k) => k.endsWith('+expanded')), `${server}: sweep reached no expanded by-type row`).toBe(true);
    expect(deltas).toEqual([]);
  }, 120000);
});
