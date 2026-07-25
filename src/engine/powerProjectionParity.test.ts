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
 * PROD6B-2c adds the level sweep. Every fixture here builds at level 50, so a magnitude resolved
 * at a pinned 50 and one resolved at the build level looked identical to all of the above — the
 * blindness that let the pin through 6B-2. The last test re-runs the magnitude diff at a level
 * where the two answers differ.
 *
 * The engine runs via wasm-node (the browser `engine.ts` has no Node path), same as
 * `serverParity.test.ts`. The fixture is deliberately parallel to that gate but kept local so the
 * committed dashboard gate stays untouched.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { loadDataset } from '@/data/dataset';
import { getArchetype, STANDARD_ARCHETYPE_IDS } from '@/data/archetypes';
import { getPowersetsForArchetype } from '@/data/powersets';
import { getAllPowerPools } from '@/data/power-pools';
import { getAllEpicPools } from '@/data/epic-pools';
import { getAvailableGenericIOs, createGenericIOEnhancement } from '@/data/enhancement-registry';
import { getIOSet } from '@/data/io-sets';
import { withoutIllegalSlots } from '@/utils/build-enhancement-validation';
import { createEmptyBuild } from '@/types/build';
import { applyExemplarScaling, calculatePowerEnhancementBonuses, combineWithAlphaED, normalizeAspectName, type EnhancementBonuses } from '@/utils/calculations/enhancement-values';
import { getAlphaEnhancementBonuses, getAlphaEdBypassBonuses } from '@/utils/calculations/character-totals';
import { areIncarnatesSuppressed, INCARNATE_MIN_LEVEL } from '@/utils/calculations/effective-level';
import { getIncarnateTrees } from '@/data/incarnates';
import { calculatePermaInfo, type PermaInfo } from '@/utils/calculations/perma';
import { calculateArcanaTime } from '@/utils/calculations/damage';
import { calcThreeTier, convertGlobalBonusesToAspects, withStrengthBonuses, type ThreeTierValues } from '@/components/info/powerDisplayUtils';
import { resolvePowerMagnitudes, type ResolvedMagnitude } from '@/components/info/resolvePowerMagnitudes';
import { buildDisplayEffects, getStackingInfo, withPseudoPetEffects, withTargetsHit } from '@/components/info/buildDisplayEffects';
import { resolveEffectivePower, effectiveGlobalAdjusters, isCasterHidden, type EffectivePowerState } from '@/components/info/resolveEffectivePower';
import { toCharacterStateJson, type AdapterCalcContext } from './characterStateAdapter';
import { mapGlobal, mapOnePowerProjection, mapPowerProjection, projectionKey, type EngineTotals, type GrantedMagnitude, type PowerProjection } from './engineTotalsMap';
import type { Build } from '@/types/build';
import type { Power, PowerEffects, SelectedPower } from '@/types/power';
import type { SelectedIncarnatePower } from '@/types/incarnate';

const require = createRequire(import.meta.url);

const SERVERS = ['homecoming', 'rebirth', 'thunderspy'] as const;
type Server = (typeof SERVERS)[number];

const NODE_ENGINE = join(__dirname, 'wasm-node', 'coh_wasm.cjs');
const BUNDLE_DIR = join(__dirname, '..', '..', 'public', 'engine', 'contract');
const artifactsReady =
  existsSync(NODE_ENGINE) && SERVERS.every((s) => existsSync(join(BUNDLE_DIR, `${s}.json.gz`)));

type EngineHandle = {
  recalculate: (json: string) => string;
  project_power: (json: string, powerSet: string, internalName: string, targetsHit?: number) => string;
};
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
  dominationActive: false,
  stalkerHidden: false,
};

function pickable(p: Power): boolean {
  return p.available >= 0 && p.available < 50;
}

function slotsFor(power: Power): SelectedPower['slots'] {
  const stats = getAvailableGenericIOs(power).slice(0, 3);
  return stats.map((stat) => createGenericIOEnhancement(stat, 50));
}

/** The richest data-driven build a fork offers, assembled with no proper nouns (mirrors the PROD5
 *  gate): first standard AT's first primary + secondary, every ≤50 power, three generic IOs each.
 *
 *  `level` drives the AT-table reads on both sides. `slotted: false` is for the sub-50 sweep: the
 *  fixture's IOs are level-50 ones, which `withoutIllegalSlots` strips out of the ENGINE's input at
 *  a lower build level while the beta reference still reads them off the build — an asymmetry in
 *  the fixture, not in the math under test. Unslotted, both sides see the same slots. */
function buildFor(
  server: Server,
  atId: (typeof STANDARD_ARCHETYPE_IDS)[number] = STANDARD_ARCHETYPE_IDS[0],
  level = 50,
  slotted = true,
  chooseSet: (sets: { powers: Power[] }[]) => number = () => 0,
): Build {
  const build = createEmptyBuild(server);
  build.level = level;
  const at = getArchetype(atId);
  build.archetype = { id: atId, name: at?.name ?? atId, stats: null, inherent: null } as Build['archetype'];

  const setsFor = (category: string) =>
    getPowersetsForArchetype(atId).filter((ps) => (ps.category ?? '').toLowerCase() === category && !ps.dormant);
  const selectFrom = (powersetId: string, powers: Power[]): SelectedPower[] =>
    powers.filter(pickable).map((p) => ({
      ...p,
      powerSet: powersetId,
      level: p.available + 1,
      slots: slotted ? slotsFor(p) : [],
      isActive: p.powerType === 'Toggle' || p.powerType === 'Auto',
    }));

  // Which of the archetype's sets to build from. The default first-set pick is the 6B fixture
  // every sweep here shares; a caller that needs a corpus carrying some specific transform picks
  // by measuring the sets' own data instead (PROD6C-3k).
  const primarySets = setsFor('primary');
  const secondarySets = setsFor('secondary');
  const primary = primarySets[chooseSet(primarySets)];
  const secondary = secondarySets[chooseSet(secondarySets)];
  if (primary) build.primary = { id: primary.id!, name: primary.name, powers: selectFrom(primary.id!, primary.powers) };
  if (secondary) build.secondary = { id: secondary.id!, name: secondary.name, powers: selectFrom(secondary.id!, secondary.powers) };
  return build;
}

/** Does the effective-power resolution have anything to do on this power — a quick form, a
 *  mid-combat cast, or a conditional contribution (PROD6C-3k)? Read off the power's own fields so
 *  the fixture discovers its corpus rather than naming a set. */
function carriesTransform(power: Power): boolean {
  const p = power as unknown as { quickSnipe?: unknown; midCombatCast?: unknown; conditionalEffects?: unknown[] };
  return p.quickSnipe != null || p.midCombatCast != null || (p.conditionalEffects?.length ?? 0) > 0;
}

/** Does this power carry a +Strength self-buff at all? Read off the bag key the Strength pass
 *  consumes on both sides, so the fixture below discovers its own carriers from the fork's data
 *  rather than naming any (Rule 0). */
function grantsStrength(power: Power): boolean {
  return (power as unknown as { effects?: { specialBuff?: unknown } }).effects?.specialBuff != null;
}

/** Candidate builds whose ACTIVE powers grant +Strength (the Power Boost family), for the
 *  PROD6C fold. `buildFor` activates only toggles and autos, and these are clicks, so no fixture
 *  above can produce a non-zero `strength*` — which is exactly what made the fold invisible to
 *  this gate.
 *
 *  Discovered rather than named (Rule 0): every archetype powerset carrying a `specialBuff`
 *  power becomes a candidate, with all its pickable powers selected and its carriers switched
 *  on. Only some Strength aspects reach a display row — the caller runs each candidate through
 *  the engine and keeps the first whose `strength*` lands in a family the fold reads, rather
 *  than this replicating the bag's aspect routing to guess. */
function strengthCandidates(server: Server): { build: Build; atId: string; carriers: string[] }[] {
  const out: { build: Build; atId: string; carriers: string[] }[] = [];
  for (const atId of STANDARD_ARCHETYPE_IDS) {
    for (const set of getPowersetsForArchetype(atId)) {
      if (set.dormant || !set.id) continue;
      const pickables = (set.powers ?? []).filter(pickable);
      const carriers = pickables.filter(grantsStrength);
      if (carriers.length === 0) continue;

      const build = createEmptyBuild(server);
      build.level = 50;
      const at = getArchetype(atId);
      build.archetype = { id: atId, name: at?.name ?? atId, stats: null, inherent: null } as Build['archetype'];
      const selected: SelectedPower[] = pickables.map((p) => ({
        ...p,
        powerSet: set.id!,
        level: p.available + 1,
        slots: slotsFor(p),
        isActive: grantsStrength(p) || p.powerType === 'Toggle' || p.powerType === 'Auto',
      }));
      const placed = { id: set.id, name: set.name, powers: selected };
      if ((set.category ?? '').toLowerCase() === 'secondary') build.secondary = placed;
      else build.primary = placed;
      out.push({ build, atId, carriers: carriers.map((c) => c.internalName) });
    }
  }
  return out;
}

/** An equipped Alpha and everything both sides need to agree about it: the build selection the
 *  adapter forwards, the beta's aspect-keyed bonuses, and the per-aspect slice of them that
 *  bypasses ED — both read from the export through the beta's own accessors. */
interface AlphaFixture {
  selection: SelectedIncarnatePower;
  bonuses: EnhancementBonuses;
  bypass: EnhancementBonuses;
  aspects: string[];
}

/** Every Alpha a fork offers, richest first — discovered from the fork's own incarnate data
 *  (Rule 0: no power is named here). "Richest" is the most non-zero enhancement aspects, so the ED
 *  split is exercised across as many schedules as the fork has; ties break on the power's full name
 *  so the fixture is deterministic.
 *
 *  `levelShift` is deliberately not counted: it is not an enhancement aspect and
 *  `getAlphaEnhancementBonuses` maps it nowhere. */
function alphaFixturesFor(): AlphaFixture[] {
  const out: AlphaFixture[] = [];
  for (const tree of getIncarnateTrees('alpha')) {
    for (const power of tree.powers) {
      const incarnates = { alpha: { powerId: power.fullName } } as unknown as Parameters<typeof getAlphaEnhancementBonuses>[0];
      const active = { alpha: true } as Parameters<typeof getAlphaEnhancementBonuses>[1];
      const bonuses = getAlphaEnhancementBonuses(incarnates, active);
      const bypass = getAlphaEdBypassBonuses(incarnates, active);
      const aspects = Object.entries(bonuses)
        .filter(([, value]) => value !== undefined && value !== 0)
        .map(([aspect]) => aspect)
        .sort();
      if (aspects.length === 0) continue;

      out.push({
        selection: {
          slotId: 'alpha',
          powerId: power.fullName,
          powerName: power.fullName,
          displayName: power.displayName,
          icon: power.icon,
          tier: power.tier,
          treeId: tree.id,
          treeName: tree.name,
        },
        bonuses,
        bypass,
        aspects,
      });
    }
  }
  return out.sort(
    (a, b) => b.aspects.length - a.aspects.length || a.selection.powerId.localeCompare(b.selection.powerId),
  );
}

/** The exemplar bonus cap both sides now read — `exemplar_handicaps.bin`'s `preClamp`, indexed
 *  `curve[level - 1]` the way `boost.c`'s `boost_HandicapExemplar` indexes it. Taken from the
 *  engine bundle and compared against what `applyExemplarScaling` produces (a raw bonus of 1.0 at
 *  IO level 50 can only come back as the cap), so a beta that stopped reading the curve fails
 *  before the parity rows below can pass by agreeing on the wrong number. */
function assertSharedExemplarCap(server: Server, exemplarLevel: number): number {
  const bundle = JSON.parse(
    gunzipSync(readFileSync(join(BUNDLE_DIR, `${server}.json.gz`))).toString('utf8'),
  ) as { 'enhancement-curves'?: { exemplarHandicaps?: { preClamp?: number[] } } };
  const curve = bundle['enhancement-curves']?.exemplarHandicaps?.preClamp ?? [];
  const index = Math.min(Math.max(exemplarLevel, 1), curve.length) - 1;
  const exported = curve[index];
  expect(exported, `${server}: the engine bundle carries no exemplar preClamp curve`).toBeDefined();
  expect(
    applyExemplarScaling(1.0, 50, exemplarLevel),
    `${server}: the beta's exemplar cap at ${exemplarLevel} is not the exported preClamp — it has stopped reading exemplar_handicaps.bin`,
  ).toBeCloseTo(exported, 6);
  return exported;
}

/** The power the ENGINE actually reads, keyed the way the engine addresses it — the aggregate's
 *  `id` plus the power's own `internalName`, or for the pool/epic partitions (which carry
 *  neither) the `fullName`-derived identity `coh_data` normalizes to at load.
 *
 *  This is the evidence side of the PROD6C-3h adjudications. The two repos' converters have
 *  drifted in BOTH directions ([[prod6b2a-absorb-stdresult]]), so a row the beta resolves and the
 *  engine does not — or one whose two sides read different authored VALUES — is only acceptable
 *  when the engine's own copy of the power proves it. Reading the bundle proves that rather than
 *  assuming it. */
type BundlePower = { effects?: Record<string, unknown>; strengthsDisallowed?: string[]; globalStrengthsDisallowed?: string[] };
const bundlePartitionCache = new Map<Server, Map<string, BundlePower>>();
function bundlePowers(server: Server): Map<string, BundlePower> {
  const cached = bundlePartitionCache.get(server);
  if (cached) return cached;
  const bundle = JSON.parse(
    gunzipSync(readFileSync(join(BUNDLE_DIR, `${server}.json.gz`))).toString('utf8'),
  ) as Record<string, Record<string, { id?: string; powers?: (BundlePower & { name?: string; internalName?: string; fullName?: string })[] }>>;
  const out = new Map<string, BundlePower>();
  for (const section of ['powersets', 'power-pools', 'epic-pools']) {
    for (const [setKey, set] of Object.entries(bundle[section] ?? {})) {
      for (const power of set.powers ?? []) {
        const source = power.internalName ?? power.fullName?.split('.').pop() ?? power.name ?? '';
        out.set(projectionKey(set.id ?? setKey, source.replace(/\s+/g, '_')), power);
      }
    }
  }
  bundlePartitionCache.set(server, out);
  return out;
}

/** `CTX` with the PROD6C-1d inputs turned on. Everything else stays at the totals hook's own
 *  defaults so a delta can only come from the input under test. */
function ctxWith(overrides: Partial<AdapterCalcContext>): AdapterCalcContext {
  return { ...CTX, ...overrides };
}

function engineTotals(server: Server, build: Build, ctx: AdapterCalcContext = CTX): EngineTotals {
  const json = engineHandle(server).recalculate(toCharacterStateJson(withoutIllegalSlots(build), ctx));
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

/** Does a build-wide +Range reach this power? Its `boostsAllowed` must list Range; an ABSENT
 *  list accepts every type (the export's tri-state, which `calculatePowerEnhancementBonuses`
 *  reads the same way). */
function rangeEnhanceable(power: SelectedPower): boolean {
  const allowed = power.allowedEnhancements;
  return allowed == null || allowed.includes('Range');
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

/** The same skew as a RELATIVE bound, for the rows whose magnitude makes an absolute one
 *  meaningless. The engine's enhancement fraction is an f32 and the beta's an f64, which measures
 *  as a constant ~1.4e-4 relative gap on every "enhanced"/"final" tier — invisible at 0.05 absolute
 *  on a 12-second recharge, over it on a 400-point heal (measured on the SAME power: its untouched
 *  `recharge` and `enduranceCost` rows carry the identical relative gap, and every `base` tier,
 *  which no enhancement multiplies, agrees exactly). Both bounds apply, so a small value is still
 *  held to the tight absolute one. */
const RELATIVE_TOLERANCE = 1e-3;

/** Are these two the same number, allowing for the f32/f64 skew above? */
function withinTolerance(engine: number, beta: number): boolean {
  const gap = Math.abs(engine - beta);
  return gap <= TOLERANCE || gap <= Math.abs(beta) * RELATIVE_TOLERANCE;
}

/** The sub-50 level the PROD6B-2c sweep resolves at. Any level where the AT tables differ from
 *  their level-50 row works; mid-range keeps the movement well clear of [`TOLERANCE`]. */
const SWEEP_LEVEL = 25;

function tierDelta(label: string, engine: ThreeTierValues | null, beta: ThreeTierValues | null): string[] {
  if (engine === null && beta === null) return [];
  if (engine === null || beta === null) return [`${label}: engine ${engine ? 'set' : 'null'} vs beta ${beta ? 'set' : 'null'}`];
  const out: string[] = [];
  for (const k of ['base', 'enhanced', 'final'] as const) {
    if (!withinTolerance(engine[k], beta[k])) out.push(`${label}.${k}: engine ${engine[k]} vs beta ${beta[k]}`);
  }
  return out;
}

// A perma delta split into real disagreements and adjudicated engine-supersedes-beta ones. The
// engine computes perma ONLY from a real exported recharge + duration, so "engine set, beta null"
// always means the engine read a buff/heal/summon duration the fork's beta converter dropped (the
// PROD5 pattern — the export is truth). That is logged, not failed. The reverse (engine null while
// the beta has a perma) would mean the engine dropped a duration the beta carries — a real defect,
// so it stays a hard delta.
/** The `strengthsDisallowed` entry that locks a power's recharge. Schema vocabulary (the export's
 *  own strength name), not a game proper noun. */
const RECHARGE_STRENGTH = 'RechargeTime';

/** Evidence that a perma disagreement is the engine reading an export field the beta ignores,
 *  rather than engine perma math being wrong. Supplied only where the caller has the engine's own
 *  copy of the power (PROD6C-3h); absent, every field stays a hard delta.
 *
 *  Two shapes, each pinned to a specific field set so an unrelated perma bug still fails:
 *   - the power's `strengthsDisallowed` / `globalStrengthsDisallowed` lists RechargeTime, so the
 *     engine correctly holds `totalRecharge` at 0 while the beta applies the build's global; the
 *     three fields that derive from it move together;
 *   - the two datasets resolved different durations, which moves `duration` and the
 *     `rechargeNeeded` computed from it. */
function permaEvidence(power: BundlePower | undefined, betaDuration: number): { rechargeLocked: boolean; durationDiffers: boolean } {
  const disallowed = [...(power?.strengthsDisallowed ?? []), ...(power?.globalStrengthsDisallowed ?? [])];
  const engineDuration = (power?.effects as { buffDuration?: number; effectDuration?: number } | undefined);
  const resolved = engineDuration?.buffDuration ?? engineDuration?.effectDuration;
  return {
    rechargeLocked: disallowed.includes(RECHARGE_STRENGTH),
    durationDiffers: resolved != null && Math.abs(resolved - betaDuration) > TOLERANCE,
  };
}

function permaDelta(
  engine: PermaInfo | null,
  beta: PermaInfo | null,
  evidence?: BundlePower | undefined,
): { real: string[]; adjudicated: string[] } {
  if (engine === null && beta === null) return { real: [], adjudicated: [] };
  if (engine !== null && beta === null) {
    return { real: [], adjudicated: [`perma: engine computes (recharge ${engine.baseRecharge}s / dur ${engine.duration}s) but beta dropped the duration → null`] };
  }
  if (engine === null || beta === null) return { real: [`perma: engine ${engine ? 'set' : 'null'} vs beta ${beta ? 'set' : 'null'}`], adjudicated: [] };
  const real: string[] = [];
  const adjudicated: string[] = [];
  const { rechargeLocked, durationDiffers } = evidence !== undefined
    ? permaEvidence(evidence, beta.duration)
    : { rechargeLocked: false, durationDiffers: false };
  // Fields each piece of evidence explains. Anything outside these sets is still a real delta
  // even on a power the evidence covers.
  const lockedFields = new Set<keyof PermaInfo>(['totalRecharge', 'effectiveRecharge', 'permaPercent']);
  const durationFields = new Set<keyof PermaInfo>(['duration', 'rechargeNeeded', 'permaPercent']);

  const numeric: (keyof PermaInfo)[] = ['baseRecharge', 'duration', 'effectiveRecharge', 'rechargeNeeded', 'totalRecharge', 'permaPercent'];
  for (const k of numeric) {
    if (Math.abs((engine[k] as number) - (beta[k] as number)) <= TOLERANCE) continue;
    if (rechargeLocked && lockedFields.has(k)) {
      adjudicated.push(`perma.${k}: engine ${engine[k]} vs beta ${beta[k]} — the export disallows ${RECHARGE_STRENGTH} on this power and the beta applies the global anyway`);
    } else if (durationDiffers && durationFields.has(k)) {
      adjudicated.push(`perma.${k}: engine ${engine[k]} vs beta ${beta[k]} — the two datasets resolved different durations (engine ${engine.duration}s, beta ${beta.duration}s)`);
    } else {
      real.push(`perma.${k}: engine ${engine[k]} vs beta ${beta[k]}`);
    }
  }
  if (engine.isPerma !== beta.isPerma) real.push(`perma.isPerma: engine ${engine.isPerma} vs beta ${beta.isPerma}`);
  return { real, adjudicated };
}

/**
 * This power's post-ED enhancement bonuses the beta's way. With no Alpha equipped that is
 * `calculatePowerEnhancementBonuses`; with one it is `combineWithAlphaED`, which folds Alpha's
 * ED-subject slice into the raw IO sum, applies ED once, then adds the bypass slice on top.
 *
 * `allowedEnhancements` is passed on BOTH paths, gating Alpha to the aspects the power accepts —
 * the rule `combineWithAlphaED` documents as the game's own (an Alpha's +Damage does not boost a
 * power that only takes EndRdx and Recharge) and the rule the engine's `power_enhancement`
 * applies. The beta's four DISPLAY call sites omitted it, so Alpha leaked onto every aspect
 * there; PROD6C-3f fixed them to pass it, which is what lets this reference grade the path the
 * surfaces actually run.
 */
function betaEnhancement(power: SelectedPower, build: Build, state: ReferenceState): EnhancementBonuses {
  if (state.enhancementOverride) return state.enhancementOverride;
  const identity = { name: power.name, slots: power.slots, allowedEnhancements: power.allowedEnhancements };
  if (state.alpha) {
    return combineWithAlphaED(
      identity,
      build.level,
      getIOSet,
      state.alpha.bonuses,
      state.alpha.bypass,
      state.exemplarLevel,
    );
  }
  return calculatePowerEnhancementBonuses(identity, build.level, getIOSet, state.exemplarLevel);
}

/** The two inputs PROD6C-1d found ungraded: an equipped Alpha (which splits through ED) and an
 *  exemplared build (which rescales non-attuned IOs and, below 45, suppresses incarnates
 *  outright). Absent = the 6B fixture's own state, no Alpha and no exemplar. */
interface ReferenceState {
  alpha?: AlphaFixture;
  /** The exemplared-to level, or undefined for an unexemplared build. */
  exemplarLevel?: number;
  /** This power's stacking-slider setting (PROD6C-3b), which the display bag reads before the
   *  resolver ever sees it. Absent = the untouched slider every other fixture here runs. */
  targetsHit?: number;
  /** Post-ED bonuses to use verbatim instead of computing them. The exemplar test re-runs the whole
   *  reference with the beta's exemplar CAP swapped for the exported one, which is how it proves a
   *  delta is that cap and nothing else. */
  enhancementOverride?: EnhancementBonuses;
  /** The combat/toggle state the effective-power resolution reads (PROD6C-3k). Absent = `CTX`,
   *  the same all-off state every other fixture drives the engine with. */
  ctx?: AdapterCalcContext;
}

/** The beta reference for one power — the calculators + resolver PROD6C–E will retire. Both halves
 *  come from one call so the enhancement bonuses they read are the same object. */
function betaReference(
  power: SelectedPower,
  build: Build,
  archetypeId: string,
  rawGlobal: ReturnType<typeof mapGlobal>,
  state: ReferenceState = {},
): { projection: Omit<PowerProjection, 'grantedMagnitudes'>; magnitudes: Map<string, ResolvedMagnitude>; bag: Record<string, unknown> } {
  const enh = betaEnhancement(power, build, state);
  const global = convertGlobalBonusesToAspects(rawGlobal);

  // Every execution value describes the power the surface SHOWS (PROD6C-3k): a snipe read in
  // combat mode reports its fast cast, not its slow one. Only `perma` below stays on the base
  // power, which is where both beta surfaces read it.
  const shown = shownPower(power, build, state.ctx) as unknown as SelectedPower;
  const rechargeBase = truthyStat(shown, 'recharge', 'recharge');
  const endBase = baseEnduranceCost(shown);
  const accBase = truthyStat(shown, 'accuracy', 'accuracy');
  const castBase = truthyStat(shown, 'castTime', 'castTime');
  const rangeBase = truthyStat(shown, 'range', 'range');

  return {
    projection: {
      recharge: rechargeBase !== null ? calcThreeTier('recharge', rechargeBase, enh, global) : null,
      enduranceCost: endBase !== null ? calcThreeTier('endurance', endBase, enh, global) : null,
      accuracy: accBase !== null ? calcThreeTier('accuracy', accBase, enh, global) : null,
      castTime: castBase !== null ? calcThreeTier('castTime', castBase, enh, global) : null,
      arcanaTime: castBase !== null ? calculateArcanaTime(castBase) : null,
      // A global +Range reaches a power only when it accepts Range enhancement (`GeneralStatsBlock`,
      // engine `reachable_global_range`). The corpus carries no set bonuses, so the global is zero
      // and gated and ungated agree here — the rule itself is pinned by the engine's own unit test.
      // The tri-state follows the ENGINE (absent list ⇒ every type), which is how
      // `calculatePowerEnhancementBonuses` reads it; the beta's display rule treats absent as
      // accepting nothing, an unresolved divergence noted in the PROD6C plan entry.
      range:
        rangeBase !== null
          ? rangeEnhanceable(shown)
            ? calcThreeTier('range', rangeBase, enh, global)
            : calcThreeTier('range', rangeBase, enh, {})
          : null,
      perma: calculatePermaInfo(power, enh, (rawGlobal.recharge ?? 0) / 100),
    },
    // The magnitude rows read the +Strength-augmented globals — the surfaces' own input
    // (PROD6C). The execution half above deliberately does not: Strength carries no
    // recharge / endurance / accuracy / range / cast aspect.
    magnitudes: betaMagnitudes(power, build, archetypeId, enh, withStrengthBonuses(global, rawGlobal), state.targetsHit, shown as unknown as Power),
    // The bag those magnitudes resolved from, returned so every adjudication below reads the SAME
    // bag the reference did rather than rebuilding one from the authored power.
    bag: displayBag(power, state.targetsHit ?? 0, shown as unknown as Power),
  };
}

/** The state the effective-power resolution reads, assembled from a ctx exactly as the adapter
 *  assembles the engine's (PROD6C-3k) — the stance overlay included — so a delta can never come
 *  from the two sides being handed different toggle state. */
function shownState(build: Build, ctx: AdapterCalcContext): EffectivePowerState {
  return {
    combatMode: ctx.combatMode,
    hidden: isCasterHidden(build, ctx.stalkerHidden),
    globalAdjusters: effectiveGlobalAdjusters(build, ctx.globalAdjusters),
    mechanicAdjusters: ctx.mechanicAdjusters,
    atInherentState: { dominationActive: ctx.dominationActive },
  };
}

/** The power the surfaces actually SHOW for this selection: the snipe's fast form, the mid-combat
 *  cast, the active mode-gated contributions merged in (PROD6C-3k). Not the identity even under the
 *  all-toggles-off `CTX` — a conditional whose own `defaultActive` is true merges with no toggle
 *  touched, which is why every bag below goes through this rather than the authored power. */
function shownPower(power: Power | SelectedPower, build: Build, ctx: AdapterCalcContext = CTX): Power {
  return resolveEffectivePower(power as Power, shownState(build, ctx)).power;
}

/** The bag a surface resolves for one power: the built bag, the power's own slider, then the
 *  pseudo-pet merge (PROD6C-3c). This is the EVIDENCE bag every adjudication below reads, so it
 *  has to be the merged one — a summon power's pet-derived rows are in neither side's authored
 *  bag, and grading them against the unmerged build would adjudicate every one of them away as
 *  converter drift. The same reason `shown` belongs here: a conditional-added row is in neither
 *  AUTHORED bag either.
 *
 *  `shown` is the effective power the bag is BUILT from; `power` stays the base one, because the
 *  stacking slider is offered for the power the build holds and scales the merged bag with it —
 *  the asymmetry both the InfoPanel and the engine's `display_effects` carry. */
function displayBag(
  power: Power | SelectedPower,
  targetsHit = 0,
  shown: Power = power as Power,
): Record<string, unknown> {
  const built = buildDisplayEffects(shown);
  return withPseudoPetEffects(
    shown,
    withTargetsHit(power as Power, built, targetsHit),
  ) as unknown as Record<string, unknown>;
}

/** The bag keys the pseudo-pet merge ADDS to a power (PROD6C-3c) — the rows a summon power
 *  carries only through its non-commandable pet, which its own bag has no key for. */
function pseudoPetKeys(power: Power | SelectedPower, shown: Power = power as Power): Set<string> {
  const built = buildDisplayEffects(shown) as unknown as Record<string, unknown>;
  return new Set(Object.keys(displayBag(power, 0, shown)).filter((key) => !(key in built)));
}

/** The beta reference magnitudes for one power — the resolver `RegistryEffectsDisplay` calls. */
function betaMagnitudes(
  power: SelectedPower,
  build: Build,
  archetypeId: string,
  enh: Record<string, number | undefined>,
  global: Record<string, number | undefined>,
  targetsHit?: number,
  shown: Power = power as Power,
): Map<string, ResolvedMagnitude> {
  const rows = resolvePowerMagnitudes({
    // The bag the SURFACES resolve, not the authored one (PROD6C-3a): the merged stats, the
    // heal extracted from the damage array, a summon's duration as the buff duration, and the
    // flattened movement object. Before this the gate handed both sides the authored bag, so
    // every one of those transforms went ungraded.
    // …at the power's own slider setting, which the surfaces apply to that bag before resolving
    // it (PROD6C-3b) — zero/absent is the identity, so every other fixture here is unaffected —
    // and with the pseudo-pet debuffs merged under it (PROD6C-3c).
    effects: displayBag(power, targetsHit ?? 0, shown) as unknown as PowerEffects,
    archetypeId,
    level: build.level,
    enhancementBonuses: enh,
    globalBonuses: global,
    // 1.0 on both sides, and now unconditionally so: the beta's Defender/Controller-primary
    // support rule keyed on archetype NAMES (Rule 0), was measured to match no row that
    // actually reaches a table-less fallback, and was deleted in PROD6B-2b. The precondition
    // that keeps it dead is held down by supportModifierReach.test.ts.
    buffDebuffMod: 1.0,
  });
  return new Map(rows.map((row) => [row.rowKey, row]));
}

/** The bag's untyped-duration slot: a duration with no attrib behind it, which a converter emits
 *  when it read a template's duration but could not type the effect itself. It is the one beta-only
 *  row that can be adjudicated rather than failed — see `magnitudeDeltas`. Effect keys are schema
 *  vocabulary, not game proper nouns, so naming it here does not breach Rule 0. */
const UNTYPED_DURATION_EFFECT_KEY = 'effectDuration';

/** Effect keys the engine SYNTHESIZES when it normalizes a legacy pool/epic power
 *  (`coh_data`'s `normalize_legacy_power`), rather than reading from the converter.
 *
 *  These are excluded from the beta-only adjudication below. That adjudication accepts a missing
 *  engine key as converter drift, which is true for an authored effect and false for these: here a
 *  missing key means the normalization itself broke, and "the engine's dataset carries no
 *  'castTime'" is a description of the defect, not an excuse for it. Measured — with the renames
 *  disabled the adjudication swallowed every one of these rows, and only the separate
 *  projection-field comparison still failed the gate. */
const ENGINE_NORMALIZED_EFFECT_KEYS = new Set(['enduranceCost', 'castTime']);

/** Diff one power's granted magnitudes, split into real disagreements and adjudicated
 *  engine-supersedes-beta ones. Rows are matched by key, not position — the engine emits them in
 *  bag order while the beta resolver emits them in registry-group order, and row ORDER is the
 *  component's sort, not part of the resolution under test.
 *
 *  An "engine only" row is ACCEPTED only when the beta's own power object has no such effect key:
 *  that means the fork's beta converter dropped an effect the rebuild's parser recovered (the
 *  export is truth — the PROD5 pattern), not that the engine invented a row. If the beta HAS the
 *  key and still resolved no row, the two disagree about resolution and that is a hard delta.
 *
 *  "beta only" is a hard delta — the engine dropping a row the beta carries is an engine defect —
 *  with ONE adjudicated case: a bare `effectDuration` on a power where the engine typed a template
 *  the beta's bag has no key for. Both rows are then the SAME template read twice: the rebuild's
 *  parser recovered its attrib (tspy `Power_Build_Up` → `+Special: Stun`), while the beta's
 *  converter could only keep the duration it hung on. Accepting it needs that typed engine row as
 *  evidence, so a genuine engine drop — no typed row to point at — still fails.
 *
 *  `engineEffects` opens the SYMMETRIC case, and only when the caller can supply the engine's own
 *  copy of the bag (PROD6C-3h, the pool/epic partitions). The rule mirrors the engine-only one
 *  exactly: a beta-only row is adjudicated when the ENGINE's bag has no such key to resolve from,
 *  and stays a hard delta when it HAS the key and still resolved nothing — which is the actual
 *  engine defect this branch exists to catch. Without the bag the branch is unchanged, so every
 *  other sweep keeps failing on beta-only rows.
 *
 *  Both bags are DISPLAY bags (`buildDisplayEffects`), the same input each side resolves from,
 *  so "the engine has no such key" means the engine's dataset yields no such row rather than
 *  merely authoring it elsewhere. That also makes the third adjudication below possible: a row
 *  both sides resolve from a bare number, where those two numbers differ, is converter drift. */
function magnitudeDeltas(
  powerName: string,
  engineRows: GrantedMagnitude[],
  betaRows: Map<string, ResolvedMagnitude>,
  betaEffects: Record<string, unknown> | undefined,
  engineEffects?: Record<string, unknown>,
): { real: string[]; adjudicated: string[] } {
  const out: string[] = [];
  const adjudicated: string[] = [];
  const engineByKey = new Map(engineRows.map((row) => [row.rowKey, row]));
  // Rows the engine typed off effect keys the beta's own bag lacks — the evidence an untyped
  // beta-only duration is the same template seen through the weaker converter.
  const enginesOwnTypings = engineRows.filter((row) => betaEffects?.[row.effectKey] == null);

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
      const untypedResidue = beta?.effectKey === UNTYPED_DURATION_EFFECT_KEY && enginesOwnTypings.length > 0;
      const engineHasNothingToResolve =
        engineEffects != null &&
        beta != null &&
        !ENGINE_NORMALIZED_EFFECT_KEYS.has(beta.effectKey) &&
        engineEffects[beta.effectKey] == null;
      if (untypedResidue) {
        adjudicated.push(`${key}: beta resolved a bare ${beta!.config.label} where the export types the template as ${enginesOwnTypings.map((row) => row.label).join(', ')}`);
      } else if (engineHasNothingToResolve) {
        adjudicated.push(`${key}: beta resolved ${beta!.config.label} but the engine's dataset carries no '${beta!.effectKey}' effect`);
      } else {
        out.push(`${powerName}.${key}: beta only (engine resolved no row)`);
      }
      continue;
    }
    // A row whose two sides resolved from DIFFERENT authored values is converter drift, not a
    // resolution disagreement — the same evidence `permaEvidence` already accepts for the perma
    // duration, now reachable for the row that duration renders as (PROD6C-3a). It needs the
    // engine's own bag, is pinned to the specific key, and compares the inputs: two sides that
    // read the SAME value and still disagree stay a hard delta.
    const inputsDiffer =
      engineEffects != null &&
      typeof engineEffects[key] === 'number' &&
      typeof (betaEffects?.[key]) === 'number' &&
      Math.abs((engineEffects[key] as number) - (betaEffects![key] as number)) > TOLERANCE;
    // PROD6C-3b's per-target SHAPE adjudication is gone (PROD6C-3j): the engine's converter now
    // exports the per-foe increment for a MaxHP-fraction absorb too, so the two shapes agree
    // under a dragged slider as they always did at one target. A row that grows on one side
    // alone is a hard delta again.
    for (const tier of ['base', 'enhanced', 'final'] as const) {
      if (withinTolerance(engine.value[tier], beta.tiers[tier])) continue;
      const delta = `${powerName}.${key}.${tier}: engine ${engine.value[tier]} vs beta ${beta.tiers[tier]}`;
      if (inputsDiffer) {
        adjudicated.push(`${key}.${tier}: the two datasets carry different '${key}' values (engine ${engineEffects[key]}, beta ${betaEffects![key]})`);
      } else {
        out.push(delta);
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
  return { real: out, adjudicated };
}

/** A bypass slice no Alpha authors — the whole bonus bypassing ED — for probing whether the split
 *  is observable on a given fixture at all. */
function probeBypass(alpha: AlphaFixture): EnhancementBonuses {
  return { ...alpha.bonuses };
}

/**
 * `buildFor`'s fixture, re-slotted to SATURATE Enhancement Diversification in one aspect: up to six
 * generic IOs of the same stat on every power that accepts it, instead of three of different stats.
 *
 * This exists because the ordinary fixture cannot grade Alpha's ED split at all. The split only
 * matters once the raw IO sum plus Alpha's ED-subject slice crosses an ED threshold — below it, ED is
 * the identity and every division of Alpha's value sums to the same total. Three IOs of distinct
 * aspects put roughly 0.42 into each, which with any Alpha stays under Schedule A's 0.7 knee: probed
 * against a bypass ratio no tier uses, that fixture produced ZERO deltas on all three forks. Six of
 * one stat put ~2.5 into a single aspect, so ED bites hard and the division is load-bearing.
 *
 * `stat` is chosen by the caller to be an aspect the equipped Alpha also buffs; a power that does not
 * accept it keeps the ordinary slotting so the fixture stays a full build.
 */
function saturatedBuild(server: Server, stat: string, level = 50): Build {
  const build = buildFor(server, STANDARD_ARCHETYPE_IDS[0], level);
  const saturate = (powers: SelectedPower[]) =>
    powers.map((power) => {
      if (!getAvailableGenericIOs(power).some((available) => available === stat)) return power;
      return {
        ...power,
        slots: Array.from({ length: MAX_SLOTS_PER_POWER }, () => createGenericIOEnhancement(stat as never, 50)),
      };
    });
  build.primary = { ...build.primary, powers: saturate(build.primary.powers) };
  build.secondary = { ...build.secondary, powers: saturate(build.secondary.powers) };
  return build;
}

/** The generic-IO stats whose aspect this Alpha also buffs — the saturation candidates for
 *  [`saturatedBuild`]. Derived from the beta's own stat→aspect map, not a second list. */
function saturationStatsFor(powers: SelectedPower[], alpha: AlphaFixture): string[] {
  const stats = new Set<string>();
  for (const power of powers) {
    for (const stat of getAvailableGenericIOs(power)) {
      const aspect = normalizeAspectName(stat);
      if (aspect && alpha.aspects.includes(aspect)) stats.add(stat);
    }
  }
  return [...stats].sort();
}


/** A power holds at most six slots, so at most six IOs can have been clamped in one aspect. The
 *  bound is what makes the cap-multiple proof a proof rather than a fit to any number. */
const MAX_SLOTS_PER_POWER = 6;

/** Did any projected value for this power change between two runs? Every enhanceable surface the
 *  projection carries, not one chosen aspect: an Alpha that enhances only Heal moves magnitude rows
 *  and no execution tier, and a guard watching recharge alone would call that "no effect". */
function projectedValuesMoved(a: PowerProjection, b: PowerProjection): boolean {
  const tiers: (keyof PowerProjection)[] = ['recharge', 'enduranceCost', 'accuracy', 'castTime', 'range'];
  for (const key of tiers) {
    const left = a[key] as ThreeTierValues | null;
    const right = b[key] as ThreeTierValues | null;
    if (!left || !right) continue;
    if (Math.abs(left.enhanced - right.enhanced) > TOLERANCE) return true;
  }
  const rightRows = new Map(b.grantedMagnitudes.map((row) => [row.rowKey, row]));
  for (const row of a.grantedMagnitudes) {
    const other = rightRows.get(row.rowKey);
    if (other && Math.abs(row.value.enhanced - other.value.enhanced) > TOLERANCE) return true;
  }
  return false;
}

/** Diff every power of one fixture: the execution three-tiers, ArcanaTime, perma and granted
 *  magnitudes, against the beta calculators run in the same `state`. The 6B-1 walk inlines this
 *  same body; it is factored out here because PROD6C-3f re-runs the WHOLE diff under two new
 *  inputs, and a second copy of it could drift from the one that grades the base fixture. */
function diffProjection(
  server: Server,
  powers: SelectedPower[],
  build: Build,
  archetypeId: string,
  projection: Map<string, PowerProjection>,
  rawGlobal: ReturnType<typeof mapGlobal>,
  state: ReferenceState = {},
): { deltas: string[]; adjudicated: string[]; rows: number } {
  const deltas: string[] = [];
  const adjudicated: string[] = [];
  let rows = 0;

  for (const power of powers) {
    const engine = projection.get(projectionKey(power.powerSet, power.internalName));
    expect(engine, `${server}: no engine projection for ${power.internalName}`).toBeDefined();
    if (!engine) continue;
    const { projection: beta, magnitudes, bag } = betaReference(power, build, archetypeId, rawGlobal, state);
    const perma = permaDelta(engine.perma, beta.perma);
    const mags = magnitudeDeltas(
      power.internalName,
      engine.grantedMagnitudes,
      magnitudes,
      bag,
    );
    rows += engine.grantedMagnitudes.length;
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
    );
    const arcanaEngine = engine.arcanaTime ?? null;
    const arcanaBeta = beta.arcanaTime ?? null;
    if (arcanaEngine === null || arcanaBeta === null) {
      if (arcanaEngine !== arcanaBeta) deltas.push(`${power.internalName}.arcanaTime: engine ${arcanaEngine} vs beta ${arcanaBeta}`);
    } else if (Math.abs(arcanaEngine - arcanaBeta) > TOLERANCE) {
      deltas.push(`${power.internalName}.arcanaTime: engine ${arcanaEngine} vs beta ${arcanaBeta}`);
    }
  }
  return { deltas, adjudicated, rows };
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

    const matchedRows = powers.reduce((n, power) => {
      const engine = projection.get(projectionKey(power.powerSet, power.internalName));
      if (!engine) return n;
      const { magnitudes } = betaReference(power, build, archetypeId, rawGlobal);
      return n + engine.grantedMagnitudes.filter((r) => magnitudes.has(r.rowKey)).length;
    }, 0);
    const { deltas, adjudicated } = diffProjection(server, powers, build, archetypeId, projection, rawGlobal);

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
    // PROD6C-3c reach — the rows each side resolved from a key only the pseudo-pet merge
    // supplies. Parity alone would stay green with the merge dropped from BOTH sides, so the
    // merge has to be shown to produce rows at all (the 6B-2b method).
    let petPowers = 0;
    let enginePetRows = 0;
    let betaPetRows = 0;

    for (const atId of STANDARD_ARCHETYPE_IDS) {
      const build = buildFor(server, atId);
      const powers = [...build.primary.powers, ...build.secondary.powers];
      if (powers.length === 0) continue;

      const totals = engineTotals(server, build);
      const projection = mapPowerProjection(totals.power_projection);
      const rawGlobal = mapGlobal(totals.bonuses);

      for (const power of powers) {
        const engine = projection.get(projectionKey(power.powerSet, power.internalName));
        if (!engine) continue;
        const { magnitudes, bag } = betaReference(power, build, atId, rawGlobal);
        const mags = magnitudeDeltas(
          `${atId}/${power.internalName}`,
          engine.grantedMagnitudes,
          magnitudes,
          bag,
        );
        deltas.push(...mags.real);
        adjudicated.push(
          ...mags.adjudicated.map((d) => `${atId}/${power.internalName}.${d}`),
        );
        rows += engine.grantedMagnitudes.length;
        const petKeys = pseudoPetKeys(power, shownPower(power, build));
        if (petKeys.size > 0) {
          petPowers += 1;
          enginePetRows += engine.grantedMagnitudes.filter((row) => petKeys.has(row.effectKey)).length;
          betaPetRows += [...magnitudes.values()].filter((row) => petKeys.has(row.effectKey)).length;
        }
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
    // eslint-disable-next-line no-console
    console.warn(`[PROD6C-3c pseudo-pet] ${server} sweep: ${petPowers} powers carry pet-only effect keys, ${enginePetRows} engine / ${betaPetRows} beta rows resolve from one`);
    // Guard against a vacuous pass: the sweep must reach the expanded by-type branch.
    expect([...kinds.keys()].some((k) => k.endsWith('+expanded')), `${server}: sweep reached no expanded by-type row`).toBe(true);
    expect(enginePetRows, `${server}: no engine row resolved from a pseudo-pet key — the merge is ungraded here`).toBeGreaterThan(0);
    expect(betaPetRows, `${server}: no beta row resolved from a pseudo-pet key — the merge is ungraded here`).toBeGreaterThan(0);
    expect(deltas).toEqual([]);
  }, 120000);

  // PROD6C. The info surfaces render powers the build does NOT hold — the tooltip fires off the
  // picker (`AvailablePowers`), which resolves through `lookupPower`, not the build. No
  // `all_selected()` walk reaches those, so the projection could not answer for them at all and
  // the surfaces would have had to keep a second calculator for the unheld case. `project_power`
  // closes that: it projects an arbitrary ref against the same finalized accumulator.
  //
  // What must hold is that the on-demand answer is the SAME answer, not a parallel one. Each
  // unheld power is graded against the beta calculators run unslotted — the state it is actually
  // in — over every archetype's second powerset, which the fixture never picks.
  it.each(SERVERS)('%s: a power the build does not hold projects on demand', async (server) => {
    await loadDataset(server);

    const deltas: string[] = [];
    const adjudicated: string[] = [];
    let projected = 0;
    let magnitudeRows = 0;

    for (const atId of STANDARD_ARCHETYPE_IDS) {
      const build = buildFor(server, atId);
      const held = new Set(
        [...build.primary.powers, ...build.secondary.powers].map((p) => projectionKey(p.powerSet, p.internalName)),
      );
      // A set the fixture did NOT take, so its powers are genuinely unheld.
      const unheldSet = getPowersetsForArchetype(atId).filter(
        (ps) => !ps.dormant && ps.id && ps.id !== build.primary.id && ps.id !== build.secondary.id,
      )[0];
      if (!unheldSet?.id) continue;

      const stateJson = toCharacterStateJson(withoutIllegalSlots(build), CTX);
      const totals = engineTotals(server, build);
      const rawGlobal = mapGlobal(totals.bonuses);

      for (const power of (unheldSet.powers ?? []).filter(pickable)) {
        expect(held.has(projectionKey(unheldSet.id, power.internalName)), `${server}: ${power.internalName} is not actually unheld`).toBe(false);

        const json = engineHandle(server).project_power(stateJson, unheldSet.id, power.internalName);
        const raw = JSON.parse(json) as Parameters<typeof mapOnePowerProjection>[0] | null;
        expect(raw, `${server}: no on-demand projection for ${unheldSet.id}/${power.internalName}`).not.toBeNull();
        if (!raw) continue;
        const engine = mapOnePowerProjection(raw);
        projected += 1;
        magnitudeRows += engine.grantedMagnitudes.length;

        // The beta reference for an UNHELD power: the same calculators, run with no slots.
        const unslotted = { ...power, powerSet: unheldSet.id, level: power.available + 1, slots: [] } as SelectedPower;
        const { projection: beta, magnitudes, bag } = betaReference(unslotted, build, atId, rawGlobal);
        const mags = magnitudeDeltas(
          `${atId}/${power.internalName}`,
          engine.grantedMagnitudes,
          magnitudes,
          bag,
        );
        deltas.push(
          ...tierDelta(`${atId}/${power.internalName}.recharge`, engine.recharge, beta.recharge),
          ...tierDelta(`${atId}/${power.internalName}.enduranceCost`, engine.enduranceCost, beta.enduranceCost),
          ...tierDelta(`${atId}/${power.internalName}.accuracy`, engine.accuracy, beta.accuracy),
          ...tierDelta(`${atId}/${power.internalName}.castTime`, engine.castTime, beta.castTime),
          ...tierDelta(`${atId}/${power.internalName}.range`, engine.range, beta.range),
          ...permaDelta(engine.perma, beta.perma).real.map((d) => `${atId}/${power.internalName}.${d}`),
          ...mags.real,
        );
        adjudicated.push(
          ...permaDelta(engine.perma, beta.perma).adjudicated.map((d) => `${atId}/${power.internalName}.${d}`),
          ...mags.adjudicated.map((d) => `${atId}/${power.internalName}.${d}`),
        );
      }
    }

    // eslint-disable-next-line no-console
    console.warn(`[PROD6C on-demand] ${server}: ${projected} unheld powers projected, ${magnitudeRows} magnitude rows`);
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C on-demand] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6C on-demand] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 40).join('\n    ')}`);
    }
    // Guard the sweep: an empty walk would pass vacuously.
    expect(projected, `${server}: no unheld power was projected`).toBeGreaterThan(0);
    expect(magnitudeRows, `${server}: no unheld power resolved a magnitude row`).toBeGreaterThan(0);
    expect(deltas).toEqual([]);
  }, 120000);

  // PROD6C-3h. The pool and epic partitions, which no projection gate had ever reached: the sweeps
  // above walk powerSETS (the fixture's own two, then an unpicked one), so every pool and epic
  // power went ungraded — the PROD6B-2b blind spot exactly, where `getAllPowersets()` omitting
  // pools and epics hid 100% of that finding.
  //
  // Both partitions arrive in the converter's LEGACY shape: identity only in `fullName`, execution
  // stats under `endurance` / `activationTime`. The beta normalizes them at runtime
  // (`transformPoolPower`); `coh_data` now does the same at bundle load. Two guards below prove the
  // gate can actually SEE a regression in that, rather than passing on a corpus that cannot reach
  // it — the 6C-3f method:
  //
  //   * `renamed` counts powers whose internal name differs from their display name (Swift/Quick,
  //     Hover/Combat_Flight — the game renamed them and kept the original internal name). These are
  //     addressable ONLY through the fullName derivation, so a non-zero count is what makes the
  //     non-null assertion load-bearing.
  //   * `shared` counts internal names published by more than one epic mastery at their own scales.
  //     A lookup that ignores the requested set answers with another archetype's copy, so a
  //     non-zero count is what makes the set-scoped resolution load-bearing.
  it.each(SERVERS)('%s: pool and epic powers project through their legacy shape', async (server) => {
    await loadDataset(server);

    const build = buildFor(server);
    const atId = build.archetype.id as string;
    const stateJson = toCharacterStateJson(withoutIllegalSlots(build), CTX);
    const rawGlobal = mapGlobal(engineTotals(server, build).bonuses);
    const engineBundle = bundlePowers(server);

    const partitions: { label: string; sets: { id: string; powers: Power[] }[] }[] = [
      { label: 'pool', sets: Object.values(getAllPowerPools()) as { id: string; powers: Power[] }[] },
      { label: 'epic', sets: Object.values(getAllEpicPools()) as { id: string; powers: Power[] }[] },
    ];

    const deltas: string[] = [];
    const adjudicated: string[] = [];
    let projected = 0;
    let magnitudeRows = 0;
    let renamed = 0;
    const epicNameOwners = new Map<string, Set<string>>();

    for (const { label, sets } of partitions) {
      for (const set of sets) {
        for (const power of set.powers ?? []) {
          if (power.internalName !== power.name.replace(/\s+/g, '_')) renamed += 1;
          if (label === 'epic') {
            const owners = epicNameOwners.get(power.internalName) ?? new Set<string>();
            owners.add(set.id);
            epicNameOwners.set(power.internalName, owners);
          }

          const tag = `${label}/${set.id}/${power.internalName}`;
          const json = engineHandle(server).project_power(stateJson, set.id, power.internalName);
          const raw = JSON.parse(json) as Parameters<typeof mapOnePowerProjection>[0] | null;
          expect(raw, `${server}: no projection for ${tag} — the partition's identity is unreachable`).not.toBeNull();
          if (!raw) continue;
          const engine = mapOnePowerProjection(raw);
          projected += 1;
          magnitudeRows += engine.grantedMagnitudes.length;

          // A pool/epic power is never held by this fixture, so the beta reference is the same
          // calculators run unslotted — identical to the on-demand sweep above.
          const unslotted = { ...power, powerSet: set.id, level: power.available + 1, slots: [] } as SelectedPower;
          const { projection: beta, magnitudes, bag } = betaReference(unslotted, build, atId, rawGlobal);
          // The engine's OWN copy of this power — the evidence both adjudications rest on.
          const enginePower = engineBundle.get(projectionKey(set.id, power.internalName));
          const mags = magnitudeDeltas(
            tag,
            engine.grantedMagnitudes,
            magnitudes,
            bag,
            enginePower ? displayBag(enginePower as unknown as Power, 0, shownPower(enginePower as unknown as Power, build)) : {},
          );
          const perma = permaDelta(engine.perma, beta.perma, enginePower);
          deltas.push(
            ...tierDelta(`${tag}.recharge`, engine.recharge, beta.recharge),
            ...tierDelta(`${tag}.enduranceCost`, engine.enduranceCost, beta.enduranceCost),
            ...tierDelta(`${tag}.accuracy`, engine.accuracy, beta.accuracy),
            ...tierDelta(`${tag}.castTime`, engine.castTime, beta.castTime),
            ...tierDelta(`${tag}.range`, engine.range, beta.range),
            ...perma.real.map((d) => `${tag}.${d}`),
            ...mags.real,
          );
          adjudicated.push(
            ...perma.adjudicated.map((d) => `${tag}.${d}`),
            ...mags.adjudicated.map((d) => `${tag}.${d}`),
          );
        }
      }
    }

    const shared = [...epicNameOwners.values()].filter((owners) => owners.size > 1).length;

    // eslint-disable-next-line no-console
    console.warn(
      `[PROD6C-3h partitions] ${server}: ${projected} pool/epic powers projected, ${magnitudeRows} magnitude rows, ` +
        `${renamed} carry an internal name their display name does not yield, ${shared} epic names published by more than one mastery`,
    );
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3h partitions] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.slice(0, 20).join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6C-3h partitions] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 40).join('\n    ')}`);
    }
    expect(projected, `${server}: no pool or epic power was projected`).toBeGreaterThan(0);
    expect(magnitudeRows, `${server}: no pool or epic power resolved a magnitude row`).toBeGreaterThan(0);
    expect(
      renamed,
      `${server}: no pool/epic power's internal name differs from its display name — the non-null assertion above cannot detect a lost fullName derivation`,
    ).toBeGreaterThan(0);
    expect(
      shared,
      `${server}: no epic internal name is published by two masteries — this sweep cannot detect an unscoped pool/epic lookup`,
    ).toBeGreaterThan(0);
    expect(deltas).toEqual([]);
  }, 180000);

  // PROD6C. The active +Strength self-buffs (Power Boost family) land in a magnitude row's FINAL
  // column exactly like a build-wide global — InfoPanel has always folded them in, the tooltip
  // never did, and the engine did neither. Every fixture above activates only toggles and autos,
  // so `strength*` is zero throughout and both sides agreed on a row nobody had augmented: the
  // same shape as the 6B-2c level pin, a rule kept alive by a corpus that could not reach it.
  //
  // Three assertions, and the middle one is the point. Parity alone would stay green if the fold
  // were deleted from BOTH sides, so the gate also proves the fold is observable at all — the
  // REAL resolver run twice over the same fixture, with and without the augmentation (the 6B-2b
  // method: no reimplementation of the code under test).
  it.each(SERVERS)('%s: +Strength self-buffs reach the granted magnitudes', async (server) => {
    await loadDataset(server);
    const candidates = strengthCandidates(server);
    if (candidates.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C strength] ${server}: fork carries no specialBuff power — nothing to grade`);
      return;
    }

    // (1) Some candidate must produce a Strength fraction in a family the fold reads, or the
    // rest of this measures nothing. Most carriers grant ToHit / endurance / movement Strength,
    // which no display row reads a global from.
    const foldable = (g: ReturnType<typeof mapGlobal>) => g.strengthDefense + g.strengthHeal + g.strengthMez;
    const chosen = candidates
      .map((c) => ({ ...c, totals: engineTotals(server, c.build) }))
      .find((c) => foldable(mapGlobal(c.totals.bonuses)) > 0);
    expect(chosen, `${server}: none of ${candidates.length} +Strength candidate builds produced a foldable defense/heal/mez fraction`).toBeDefined();
    if (!chosen) return;

    const { build, atId, carriers, totals } = chosen;
    const powers = [...build.primary.powers, ...build.secondary.powers];
    const projection = mapPowerProjection(totals.power_projection);
    const rawGlobal = mapGlobal(totals.bonuses);

    // (2) …and some displayed row must move when it is folded in, or parity is blind to it.
    const plain = convertGlobalBonusesToAspects(rawGlobal);
    const augmented = withStrengthBonuses(plain, rawGlobal);
    let movedRows = 0;
    for (const power of powers) {
      const enh = calculatePowerEnhancementBonuses(
        { name: power.name, slots: power.slots, allowedEnhancements: power.allowedEnhancements },
        build.level,
        getIOSet,
        undefined,
      );
      const without = betaMagnitudes(power, build, atId, enh, plain);
      const with_ = betaMagnitudes(power, build, atId, enh, augmented);
      for (const [key, row] of with_) {
        const other = without.get(key);
        if (other && Math.abs(row.tiers.final - other.tiers.final) > TOLERANCE) movedRows += 1;
      }
    }
    expect(movedRows, `${server}: the +Strength fold changed no displayed row`).toBeGreaterThan(0);

    // (3) …and on that fixture the engine still matches the beta row for row.
    const deltas: string[] = [];
    const adjudicated: string[] = [];
    for (const power of powers) {
      const engine = projection.get(projectionKey(power.powerSet, power.internalName));
      if (!engine) continue;
      const { magnitudes, bag } = betaReference(power, build, atId, rawGlobal);
      const mags = magnitudeDeltas(
        `${atId}/${power.internalName}`,
        engine.grantedMagnitudes,
        magnitudes,
        bag,
      );
      deltas.push(...mags.real);
      adjudicated.push(...mags.adjudicated.map((d) => `${atId}/${power.internalName}.${d}`));
    }

    // eslint-disable-next-line no-console
    console.warn(`[PROD6C strength] ${server}: ${atId} — strength def/heal/mez ${rawGlobal.strengthDefense}/${rawGlobal.strengthHeal}/${rawGlobal.strengthMez} from ${carriers.length} carrier(s), ${movedRows} rows move under the fold`);
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C strength] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6C strength] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 40).join('\n    ')}`);
    }
    expect(deltas).toEqual([]);
  }, 60000);

  // PROD6C-3b — the targets-hit slider, which every fixture in this file left at zero. The
  // display bag a surface renders is the built bag AFTER the power's own slider is applied to it
  // (`withTargetsHit`): an effect carrying `perTarget` grows with the foes hit, and one the power
  // lists in `stacksLinear` is multiplied by the capped stack count. The engine had the transform
  // (`stacking.rs`, ported for the TOTALS in PROD6B-2d) but `granted.rs` never called it, so every
  // magnitude row it emitted was a one-target row — and no gate could see that, because
  // `targetsHitValues: {}` is the identity on both sides.
  //
  // Same two-part shape as the level and Alpha sweeps: parity alone would stay green if the
  // transform were dropped from BOTH sides at once, so each side must also be shown to MOVE.
  // A fork whose corpus reaches the transform on no power is reported and skipped rather than
  // passing vacuously — the reach is measured with the beta's own bag builder, not asserted.
  it.each(SERVERS)('%s: granted magnitudes scale with the targets-hit slider', async (server) => {
    await loadDataset(server);

    const deltas: string[] = [];
    const adjudicated: string[] = [];
    let sliders = 0;
    let bagsChanged = 0;
    let betaMoved = 0;
    let engineMoved = 0;

    for (const atId of STANDARD_ARCHETYPE_IDS) {
      const build = buildFor(server, atId);
      const powers = [...build.primary.powers, ...build.secondary.powers];
      // Data-discovered (Rule 0 — no power is named here): the powers this fork gives a slider,
      // each dragged to the maximum its OWN data declares.
      const sliderMax = new Map<string, number>();
      for (const power of powers) {
        const info = getStackingInfo(power);
        if (info) sliderMax.set(power.internalName, info.maxStacks);
      }
      if (sliderMax.size === 0) continue;
      sliders += sliderMax.size;

      // The slider state is keyed by internalName, exactly as the store keys it — including the
      // collisions that keying carries (`characterStateAdapter`), so the engine sees what the
      // surfaces see.
      const ctx = ctxWith({ targetsHitValues: Object.fromEntries(sliderMax) });
      const engineBundle = bundlePowers(server);
      const totals = engineTotals(server, build, ctx);
      const projection = mapPowerProjection(totals.power_projection);
      const unslid = mapPowerProjection(engineTotals(server, build).power_projection);
      // A slider dragged back to Off is an EXPLICIT zero, and on the display that is the
      // identity — not the totals path's "no foes were hit, so the buff does not fire"
      // (PROD6B-2d). No other fixture here sets one: they all leave the map empty, which both
      // sides read as absent, so the two readings of zero looked the same.
      const zeroedTotals = engineTotals(server, build, ctxWith({
        targetsHitValues: Object.fromEntries([...sliderMax.keys()].map((name) => [name, 0])),
      }));
      const zeroed = mapPowerProjection(zeroedTotals.power_projection);
      const rawGlobal = mapGlobal(totals.bonuses);
      // The accumulator sees the slider too, so a stacked self-buff moves the build-wide bonus
      // every row's "final" tier reads. Each comparison below takes the globals from its OWN run.
      const rawGlobalZero = mapGlobal(zeroedTotals.bonuses);

      for (const power of powers) {
        const targetsHit = sliderMax.get(power.internalName);
        if (targetsHit === undefined) continue;
        const key = projectionKey(power.powerSet, power.internalName);
        const engine = projection.get(key);
        if (!engine) continue;

        const plainBag = buildDisplayEffects(power);
        const slidBag = withTargetsHit(power, plainBag, targetsHit);
        if (slidBag !== plainBag) bagsChanged += 1;

        const { magnitudes, bag: slidEvidence } = betaReference(power, build, atId, rawGlobal, { targetsHit });
        const { magnitudes: before } = betaReference(power, build, atId, rawGlobal);
        for (const [rowKey, row] of magnitudes) {
          const other = before.get(rowKey);
          if (other && Math.abs(row.tiers.base - other.tiers.base) > TOLERANCE) betaMoved += 1;
        }
        const engineBefore = new Map((unslid.get(key)?.grantedMagnitudes ?? []).map((r) => [r.rowKey, r]));
        for (const row of engine.grantedMagnitudes) {
          const other = engineBefore.get(row.rowKey);
          if (other && Math.abs(row.value.base - other.value.base) > TOLERANCE) engineMoved += 1;
        }

        // The engine's OWN copy of this power, dragged to the same setting: the authored values
        // both sides read, which is what separates a converter-value difference from a calc bug.
        const enginePower = engineBundle.get(key);
        const mags = magnitudeDeltas(
          `${atId}/${power.internalName}@${targetsHit}`,
          engine.grantedMagnitudes,
          magnitudes,
          slidEvidence,
          enginePower
            ? displayBag(enginePower as unknown as Power, targetsHit, shownPower(enginePower as unknown as Power, build))
            : {},
        );
        deltas.push(...mags.real);
        adjudicated.push(...mags.adjudicated.map((d) => `${atId}/${power.internalName}.${d}`));

        const atZero = magnitudeDeltas(
          `${atId}/${power.internalName}@0`,
          zeroed.get(key)?.grantedMagnitudes ?? [],
          betaReference(power, build, atId, rawGlobalZero).magnitudes,
          displayBag(power, 0, shownPower(power, build)),
        );
        deltas.push(...atZero.real);
        adjudicated.push(...atZero.adjudicated.map((d) => `${atId}/${power.internalName}@0.${d}`));
      }
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[PROD6C-3b targets-hit] ${server}: ${sliders} powers carry a stacking slider, ` +
        `${bagsChanged} display bags change under it, ${betaMoved} beta / ${engineMoved} engine rows move`,
    );
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3b targets-hit] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.slice(0, 20).join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6C-3b targets-hit] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 40).join('\n    ')}`);
    }
    if (bagsChanged === 0) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3b targets-hit] ${server}: no power's display bag changes under its own slider — this fork's corpus cannot grade the transform`);
      expect(deltas).toEqual([]);
      return;
    }
    expect(betaMoved, `${server}: the slider moved no beta row`).toBeGreaterThan(0);
    expect(engineMoved, `${server}: the slider moved no engine row`).toBeGreaterThan(0);
    expect(deltas).toEqual([]);
  }, 180000);

  // PROD6C-3k — the EFFECTIVE power. Every fixture above runs the all-off `CTX`, where the only
  // transform that fires is a conditional whose own `defaultActive` is true (12 / 9 / 11 powers per
  // fork). This one drives the states that decide WHICH power the surfaces show: combat mode (the
  // snipe's fast form), the from-Hide toggle (a slow opener vs its mid-combat cast), and every
  // conditional-toggle id the build's own powers publish.
  //
  // The toggle ids are data-discovered (Rule 0 — no fixture may name one; they come from the
  // binary's `requiresExpression` gates at convert time), and the same map reaches both sides: the
  // adapter forwards it to the engine, `betaReference` resolves the beta power through it.
  it.each(SERVERS)('%s: the shown power drives the projection under every combat state', async (server) => {
    await loadDataset(server);

    const deltas: string[] = [];
    const adjudicated: string[] = [];
    let quickForms = 0;
    let openers = 0;
    let mergedPowers = 0;
    let mergedRows = 0;
    let castMoved = 0;
    let hiddenMoved = 0;
    const refused: string[] = [];

    for (const atId of STANDARD_ARCHETYPE_IDS) {
      // Build from the sets that CAN grade this: the 6B fixture's first-set pick reaches almost no
      // quick form or conditional (measured — 0 on rebirth), because the mechanics that carry them
      // are spread across an archetype's other sets. Discovered by counting each set's own carriers,
      // so no powerset is named (Rule 0).
      const build = buildFor(server, atId, 50, true, (sets) => {
        const carried = sets.map((set) => set.powers.filter(carriesTransform).length);
        return carried.indexOf(Math.max(...carried));
      });
      const powers = [...build.primary.powers, ...build.secondary.powers];
      if (powers.length === 0) continue;

      // Every conditional this build's powers carry, turned ON, by the scope the DATA declares.
      const globalAdjusters: Record<string, boolean> = {};
      const mechanicAdjusters: Record<string, boolean> = {};
      for (const power of powers) {
        for (const conditional of power.conditionalEffects ?? []) {
          if (conditional.scope === 'global') globalAdjusters[conditional.id] = true;
          else mechanicAdjusters[`${power.internalName}:${conditional.id}`] = true;
        }
        if ((power as unknown as { quickSnipe?: unknown }).quickSnipe != null) quickForms += 1;
        if (power.midCombatCast != null) openers += 1;
      }

      // In combat with every toggle on, and NOT hidden — so the snipe fires its fast form and an
      // opener its mid-combat cast. `hidden` is the same build seen from cover, `CTX` the all-off
      // state every other fixture here runs: three states, one build, so a value that moves can be
      // attributed to the state that moved it.
      const engaged = ctxWith({ combatMode: true, dominationActive: true, globalAdjusters, mechanicAdjusters });
      const hidden = ctxWith({ ...engaged, stalkerHidden: true });
      // The adapter's PROD3 guard refuses a toggle whose conditional carries a caster dashboard
      // buff the engine's TOTALS do not model, and driving every id reaches such a toggle
      // (thunderspy's two Primalist form modes — recorded in the plan, not classified here: they
      // belong to the form-redirect transform this slice defers). Recorded rather than caught
      // silently, and the reach counters below still have to be non-zero, so a fork cannot pass
      // this test by refusing every state.
      let runs;
      try {
        runs = [engaged, hidden].map((ctx) => {
          const totals = engineTotals(server, build, ctx);
          return { ctx, projection: mapPowerProjection(totals.power_projection), rawGlobal: mapGlobal(totals.bonuses) };
        });
      } catch (err) {
        refused.push(`${atId}: ${String(err).split(' — ')[0]}`);
        continue;
      }
      const plain = mapPowerProjection(engineTotals(server, build).power_projection);

      for (const { ctx, projection, rawGlobal } of runs) {
        const tag = ctx === hidden ? 'hidden' : 'engaged';
        for (const power of powers) {
          const key = projectionKey(power.powerSet, power.internalName);
          const engine = projection.get(key);
          if (!engine) continue;
          const { projection: beta, magnitudes, bag } = betaReference(power, build, atId, rawGlobal, { ctx });
          const mags = magnitudeDeltas(
            `${atId}/${power.internalName}@${tag}`,
            engine.grantedMagnitudes,
            magnitudes,
            bag,
          );
          deltas.push(...mags.real);
          adjudicated.push(...mags.adjudicated.map((d) => `${atId}/${power.internalName}@${tag}.${d}`));
          deltas.push(
            ...tierDelta(`${power.internalName}@${tag}.recharge`, engine.recharge, beta.recharge),
            ...tierDelta(`${power.internalName}@${tag}.enduranceCost`, engine.enduranceCost, beta.enduranceCost),
            ...tierDelta(`${power.internalName}@${tag}.accuracy`, engine.accuracy, beta.accuracy),
            ...tierDelta(`${power.internalName}@${tag}.castTime`, engine.castTime, beta.castTime),
            ...tierDelta(`${power.internalName}@${tag}.range`, engine.range, beta.range),
          );
          if (engine.arcanaTime !== null && beta.arcanaTime !== null && Math.abs(engine.arcanaTime - beta.arcanaTime) > TOLERANCE) {
            deltas.push(`${power.internalName}@${tag}.arcanaTime: engine ${engine.arcanaTime} vs beta ${beta.arcanaTime}`);
          }

          // Reach, measured rather than assumed (the PROD6C-3f method): what each state actually
          // MOVED. A transform that changes nothing cannot be graded by the parity above, however
          // green it goes — so these counters, not the deltas, are what makes this test non-vacuous.
          if (tag === 'engaged') {
            const before = plain.get(key)?.castTime;
            if (before && engine.castTime && Math.abs(before.base - engine.castTime.base) > TOLERANCE) castMoved += 1;
            const offBag = displayBag(power, 0, shownPower(power, build));
            const changed = [...new Set([...Object.keys(offBag), ...Object.keys(bag)])].filter(
              (bagKey) => JSON.stringify(offBag[bagKey]) !== JSON.stringify(bag[bagKey]),
            );
            if (changed.length > 0) {
              mergedPowers += 1;
              mergedRows += changed.length;
            }
          } else {
            const engagedCast = runs[0].projection.get(key)?.castTime;
            if (engagedCast && engine.castTime && Math.abs(engagedCast.base - engine.castTime.base) > TOLERANCE) hiddenMoved += 1;
          }
        }
      }
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[PROD6C-3k effective] ${server}: ${quickForms} quick forms, ${openers} from-Hide openers — ` +
        `${castMoved} casts move in combat, ${hiddenMoved} move again from cover, ` +
        `${mergedRows} rows on ${mergedPowers} powers change under the toggles`,
    );
    if (refused.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3k effective] ${server}: ${refused.length} archetype(s) ungraded — the adapter refuses the toggle state:\n    ${refused.join('\n    ')}`);
    }
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3k effective] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.slice(0, 20).join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6C-3k effective] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 40).join('\n    ')}`);
    }
    // Anti-vacuity, one per transform, each asserted only where the fork's corpus carries the data
    // and reported when it does not — the PROD6C-3b shape. The conditional merge is the one every
    // fork carries, so it is unconditional: without it this whole sweep would be the CTX sweep again.
    expect(mergedRows, `${server}: no row changes under any toggle — the merge is ungraded here`).toBeGreaterThan(0);
    if (quickForms > 0) {
      expect(castMoved, `${server}: ${quickForms} quick forms in the corpus and not one cast moved in combat`).toBeGreaterThan(0);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3k effective] ${server}: no quick form in the corpus — this fork cannot grade the snipe swap`);
    }
    if (hiddenMoved === 0) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3k effective] ${server}: no cast moved from cover — ${openers} openers reached, none whose mid-combat cast differs from its from-Hide one`);
    }
    expect(deltas).toEqual([]);
  }, 300000);

  // PROD6B-2c. Every fixture above builds at 50, which is precisely the level the retired pin
  // agreed with — so a magnitude resolved at a fixed 50 and one resolved at the build level were
  // indistinguishable to every gate in this file. That is how the pin survived 6B-2. This runs the
  // same magnitude diff at a level where the two disagree, and holds the property that made the
  // pin visible: ~70% of the AT tables vary by level, so a correct resolver's numbers MOVE when
  // the build level does.
  //
  // Between them the two assertions close both re-pin directions. A pin re-introduced on ONE side
  // shows up as a level-25 parity delta; a pin re-introduced on BOTH at once still resolves in
  // lockstep, so the moved-row counts catch that instead.
  it.each(SERVERS)('%s: granted magnitudes resolve at the build level, not a pinned one', async (server) => {
    await loadDataset(server);

    const deltas: string[] = [];
    const adjudicated: string[] = [];
    let engineMoved = 0;
    let betaMoved = 0;
    let rows = 0;

    for (const atId of STANDARD_ARCHETYPE_IDS) {
      const atLevel = (level: number) => {
        const build = buildFor(server, atId, level, false);
        const powers = [...build.primary.powers, ...build.secondary.powers];
        const totals = engineTotals(server, build);
        const projection = mapPowerProjection(totals.power_projection);
        const rawGlobal = mapGlobal(totals.bonuses);
        return { build, powers, projection, rawGlobal };
      };

      const low = atLevel(SWEEP_LEVEL);
      const high = atLevel(50);
      if (low.powers.length === 0) continue;

      for (const power of low.powers) {
        const key = projectionKey(power.powerSet, power.internalName);
        const engineLow = low.projection.get(key);
        const engineHigh = high.projection.get(key);
        if (!engineLow) continue;
        const low_ = betaReference(power, low.build, atId, low.rawGlobal);
        const betaLow = low_.magnitudes;
        const betaHigh = betaReference(power, high.build, atId, high.rawGlobal).magnitudes;

        const mags = magnitudeDeltas(
          `${atId}/${power.internalName}@${SWEEP_LEVEL}`,
          engineLow.grantedMagnitudes,
          betaLow,
          low_.bag,
        );
        deltas.push(...mags.real);
        adjudicated.push(...mags.adjudicated.map((d) => `${atId}/${power.internalName}.${d}`));
        rows += engineLow.grantedMagnitudes.length;

        const engineHighByKey = new Map((engineHigh?.grantedMagnitudes ?? []).map((r) => [r.rowKey, r]));
        for (const row of engineLow.grantedMagnitudes) {
          const other = engineHighByKey.get(row.rowKey);
          if (other && Math.abs(other.value.base - row.value.base) > TOLERANCE) engineMoved++;
        }
        for (const [rowKey, row] of betaLow) {
          const other = betaHigh.get(rowKey);
          if (other && Math.abs(other.tiers.base - row.tiers.base) > TOLERANCE) betaMoved++;
        }
      }
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[PROD6B-2c] ${server}: ${rows} rows at level ${SWEEP_LEVEL}, ` +
        `${engineMoved} engine / ${betaMoved} beta rows moved vs level 50`,
    );
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6B-2c] ${server} engine-supersedes-beta (accepted, ${adjudicated.length})`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6B-2c] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 60).join('\n    ')}`);
    }

    expect(engineMoved, `${server}: no engine row changed between level ${SWEEP_LEVEL} and 50 — the level is being ignored`).toBeGreaterThan(0);
    expect(betaMoved, `${server}: no beta row changed between level ${SWEEP_LEVEL} and 50 — the level is being ignored`).toBeGreaterThan(0);
    expect(deltas).toEqual([]);
  }, 180000);

  // PROD6C-3f — the two inputs 6C-1d recorded as ungraded. Every fixture above runs `CTX`, which
  // has every incarnate slot off and every build at 50, so `combineWithAlphaED`'s ED split and
  // `exemplarLevel`'s IO rescale had never been diffed at all: not one row in this file had ever
  // been resolved with an Alpha equipped. Both feed the same magnitude and execution rows PROD6C-3
  // is about to swap onto the projection, so they are closed BEFORE those rows move, not after.
  //
  // Same two-part shape as the 6B-2c sweep, for the same reason: parity alone would stay green if
  // Alpha were dropped from BOTH sides at once, so each test also proves its input MOVES rows.
  it.each(SERVERS)('%s: an equipped Alpha splits through ED on every projected power', async (server) => {
    await loadDataset(server);
    const fixtures = alphaFixturesFor();
    const archetypeId = STANDARD_ARCHETYPE_IDS[0];
    const ctx = ctxWith({ incarnateActive: { ...CTX.incarnateActive, alpha: true } });
    // Both sides read the bypass per aspect from the export now (PROD6C-3g), so every Alpha the
    // fork offers is a hard must-equal — there is no expressibility split left to select on.
    expect(fixtures.length, `${server}: no Alpha carries an enhancement aspect`).toBeGreaterThan(0);

    // Search for an (Alpha, saturated aspect) pair whose ED split this comparison can actually SEE,
    // proven by re-running the diff against a bypass slice no Alpha authors. The ordinary three-IO
    // fixture can see none — measured, not assumed — so the search is what makes this test grade the
    // split rather than only Alpha's presence.
    const probeFixture = (alpha: AlphaFixture, build: Build) => {
      const powers = [...build.primary.powers, ...build.secondary.powers];
      const projection = mapPowerProjection(engineTotals(server, build, ctx).power_projection);
      const rawGlobal = mapGlobal(engineTotals(server, build, ctx).bonuses);
      const probe = diffProjection(server, powers, build, archetypeId, projection, rawGlobal, {
        alpha: { ...alpha, bypass: probeBypass(alpha) },
      });
      return { powers, projection, rawGlobal, observable: probe.deltas.length > 0 };
    };

    let alpha = fixtures[0];
    let build = buildFor(server);
    build.incarnates = { ...build.incarnates, alpha: alpha.selection };
    let probed = probeFixture(alpha, build);
    let saturatedOn: string | null = null;
    search: for (const candidate of fixtures) {
      const base = buildFor(server);
      for (const stat of saturationStatsFor([...base.primary.powers, ...base.secondary.powers], candidate)) {
        const saturated = saturatedBuild(server, stat);
        saturated.incarnates = { ...saturated.incarnates, alpha: candidate.selection };
        const attempt = probeFixture(candidate, saturated);
        if (!attempt.observable) continue;
        alpha = candidate;
        build = saturated;
        probed = attempt;
        saturatedOn = stat;
        break search;
      }
    }
    const { powers, projection, rawGlobal } = probed;
    const splitGraded = probed.observable;
    const state: ReferenceState = { alpha };

    // (1) Alpha must actually reach the projected values, or the parity below measures nothing.
    // Measured by running the REAL calculators twice over the same fixture — with and without the
    // equipped Alpha — rather than by reimplementing the split here (the PROD6B-2b method).
    const plainProjection = mapPowerProjection(engineTotals(server, build).power_projection);
    let engineMoved = 0;
    let betaMoved = 0;
    for (const power of powers) {
      const key = projectionKey(power.powerSet, power.internalName);
      const withAlpha = projection.get(key);
      const without = plainProjection.get(key);
      if (withAlpha && without && projectedValuesMoved(withAlpha, without)) engineMoved++;
      const betaWith = betaEnhancement(power, build, state);
      const betaWithout = betaEnhancement(power, build, {});
      for (const aspect of alpha.aspects) {
        if (Math.abs((betaWith[aspect] ?? 0) - (betaWithout[aspect] ?? 0)) > 1e-9) { betaMoved++; break; }
      }
    }
    expect(engineMoved, `${server}: equipping Alpha changed no engine-projected value`).toBeGreaterThan(0);
    expect(betaMoved, `${server}: equipping Alpha changed no beta enhancement bonus`).toBeGreaterThan(0);

    // (2) …and under that Alpha the engine still matches the beta calculators row for row.
    const { deltas, adjudicated, rows } = diffProjection(server, powers, build, archetypeId, projection, rawGlobal, state);

    // eslint-disable-next-line no-console
    console.warn(
      `[PROD6C-3f alpha] ${server}: ${alpha.selection.displayName} (${alpha.selection.tier}) ` +
        `on ${alpha.aspects.join('/')} — ${rows} magnitude rows, ${engineMoved} engine / ${betaMoved} beta powers move; ` +
        `${fixtures.length} of the fork's Alphas graded as hard must-equals; ` +
        `ED split ${splitGraded ? `graded here (saturated on ${saturatedOn ?? 'the base fixture'})` : 'NOT observable on any fixture tried'}`,
    );
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3f alpha] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.slice(0, 20).join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6C-3f alpha] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 60).join('\n    ')}`);
    }
    expect(deltas).toEqual([]);
  }, 60000);

  // The exemplar half. Two levels, because the rule changes across 45: at 45+ the incarnate stays
  // alive and only the non-attuned IOs rescale, while below 45 `areIncarnatesSuppressed` /
  // `incarnates_suppressed` drop Alpha entirely. A one-level test would grade whichever branch it
  // happened to pick and call the other one covered.
  it.each(SERVERS)('%s: an exemplared build rescales IOs, and below 45 suppresses Alpha', async (server) => {
    await loadDataset(server);
    const alpha = alphaFixturesFor()[0];
    if (!alpha) return;

    const deltas: string[] = [];
    const adjudicated: string[] = [];
    let rows = 0;
    let rescaled = 0;
    const suppression: string[] = [];

    // 45 is the incarnate floor itself, so `above` keeps them alive while still rescaling IOs and
    // `below` is the first level that suppresses. Read off the beta's own constant rather than
    // written twice.
    const above = INCARNATE_MIN_LEVEL;
    const below = INCARNATE_MIN_LEVEL - 1;

    const exemplarCap = assertSharedExemplarCap(server, above);

    for (const exemplarLevel of [above, below]) {
      const build = buildFor(server);
      build.incarnates = { ...build.incarnates, alpha: alpha.selection };
      const powers = [...build.primary.powers, ...build.secondary.powers];
      const ctx = ctxWith({
        incarnateActive: { ...CTX.incarnateActive, alpha: true },
        exemplarMode: true,
        exemplarLevel,
      });
      const totals = engineTotals(server, build, ctx);
      const projection = mapPowerProjection(totals.power_projection);
      const rawGlobal = mapGlobal(totals.bonuses);

      // Below the floor the incarnate is gone, so the beta reference drops Alpha too. That the
      // ENGINE also drops it is asserted rather than assumed: its exemplared projection must equal
      // the one it produces with no Alpha equipped at all, or one side is keeping a buff the other
      // suppressed.
      const suppressed = areIncarnatesSuppressed(exemplarLevel);
      const state: ReferenceState = { alpha: suppressed ? undefined : alpha, exemplarLevel };
      if (suppressed) {
        const noAlpha = buildFor(server);
        const withoutAlpha = mapPowerProjection(
          engineTotals(server, noAlpha, ctxWith({ exemplarMode: true, exemplarLevel })).power_projection,
        );
        const kept = powers.filter((power) => {
          const key = projectionKey(power.powerSet, power.internalName);
          const a = projection.get(key);
          const b = withoutAlpha.get(key);
          return a && b && projectedValuesMoved(a, b);
        });
        expect(
          kept.map((p) => p.internalName),
          `${server}: exemplared to ${exemplarLevel} (below ${INCARNATE_MIN_LEVEL}) the engine still applied Alpha`,
        ).toEqual([]);
      }

      // The IO rescale must be observable at this level, or parity here is vacuous.
      for (const power of powers) {
        const scaled = betaEnhancement(power, build, { exemplarLevel });
        const unscaled = betaEnhancement(power, build, {});
        for (const aspect of new Set([...Object.keys(scaled), ...Object.keys(unscaled)])) {
          if (Math.abs((scaled[aspect] ?? 0) - (unscaled[aspect] ?? 0)) > 1e-9) { rescaled++; break; }
        }
      }

      // Per power, so a delta names the power it came from. Both sides read the same handicap
      // curves now (PROD6C-3g), so every row is a hard must-equal — the cap-multiple adjudication
      // this loop used to carry had nothing left to exempt.
      for (const power of powers) {
        const diff = diffProjection(server, [power], build, build.archetype.id!, projection, rawGlobal, state);
        rows += diff.rows;
        adjudicated.push(...diff.adjudicated.map((d) => `@ex${exemplarLevel} ${d}`));
        deltas.push(...diff.deltas.map((d) => `@ex${exemplarLevel} ${d}`));
      }
      suppression.push(`ex${exemplarLevel}: alpha ${suppressed ? 'suppressed' : 'live'}`);
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[PROD6C-3f exemplar] ${server}: ${rows} magnitude rows across ex${above}/ex${below}, ${rescaled} powers rescaled — ${suppression.join(', ')}; ` +
        `shared exemplar pre-clamp ${exemplarCap}`,
    );
    if (adjudicated.length) {
      // eslint-disable-next-line no-console
      console.warn(`[PROD6C-3f exemplar] ${server} engine-supersedes-beta (accepted, ${adjudicated.length}):\n    ${adjudicated.slice(0, 20).join('\n    ')}`);
    }
    if (deltas.length) {
      // eslint-disable-next-line no-console
      console.error(`\n[PROD6C-3f exemplar] ${server} (${deltas.length} deltas)\n    ${deltas.slice(0, 60).join('\n    ')}`);
    }
    expect(rescaled, `${server}: exemplaring changed no enhancement bonus — the fixture's IOs are all attuned`).toBeGreaterThan(0);
    expect(deltas).toEqual([]);
  }, 90000);
});
