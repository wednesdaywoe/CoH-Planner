/**
 * SPIKE4 — betaBuild → CharacterState adapter.
 *
 * Translates the beta's build model (`Build` from buildStore) plus the calc-context
 * inputs (uiStore options + `incarnateActive`) into the rebuild engine's
 * `CharacterState` wire shape, which `coh_wasm.recalculate(build_json)` deserializes.
 *
 * This is a DATA-SHAPE TRANSLATION, not a calc. It never derives a stat, set bonus, ED
 * result, or level curve — the engine owns all of that. Every field lands in one of the
 * five SPIKE3 buckets (map / rename / restructure / drop / fail-loud); see
 * docs/SPIKE3-CONTRACT-DIFF.md in the rebuild repo for the full table.
 *
 * Fail-loud (the rebuild mandate): inputs the engine has no equivalent for do NOT get
 * silently dropped. `destinyTime` passes through to `combat.destiny_time` (the engine scrubs
 * the diminishing Destiny timeline itself; null → its sustained-floor default). A disabled
 * `incarnateLevelShiftActive` warns (the engine derives level-shift from the equipped incarnate
 * and can't suppress it independently). Conditional adjusters (`globalAdjusters` /
 * `mechanicAdjusters`) reach the engine two ways: for the per-power DISPLAY projection they are
 * forwarded verbatim as `combat.global_conditionals` / `per_power_conditionals` (PROD6C-3k), and for
 * the TOTALS they ride build state the engine already reads — stances via `active_sub_power`,
 * out-of-combat via `combatMode`→`in_combat`. Only the totals half can silently drop a toggle, so
 * that is where this still fails loud: a global toggle carrying an unmodeled caster dashboard buff
 * (see the PROD3 classification below). A silent drop here would be exactly the field-loss class
 * the rebuild exists to kill.
 */

import type { Build, PowersetSelection, PoolSelection, ProcOverride } from '@/types/build';
import type { SelectedPower, ConditionalEffect } from '@/types/power';
import type { Enhancement } from '@/types/enhancement';
import type { IncarnateActiveState } from '@/types/incarnate';
import { getPowerset } from '@/data/powersets';
import { getPowerPool } from '@/data/power-pools';
import { getEpicPool } from '@/data/epic-pools';
import { effectiveGlobalAdjusters, isCasterHidden } from '@/components/info/resolveEffectivePower';

// ============================================
// OUTPUT WIRE SHAPE (mirrors crates/coh_data/src/character.rs serde)
// ============================================

/** `EnhancementKind` — the flattened, `type`-tagged payload half of a slot. */
export type CharacterStateEnhancementKind =
  | { type: 'io-set'; set_id: string; set_name: string; piece_num: number; aspects: string[]; is_proc: boolean; is_unique: boolean }
  | { type: 'io-generic'; stat: string; value: number }
  | { type: 'special'; category: string; aspects: { stat: string; value: number }[] }
  | { type: 'origin'; tier: string; origin: string | null; secondary_origin: string | null; stat: string; value: number };

export type CharacterStateEnhancement = {
  id: string;
  name: string;
  icon: string;
  level: number | null;
  attuned: boolean;
  boost: number;
} & CharacterStateEnhancementKind;

export interface CharacterStateSelectedPower {
  internal_name: string;
  power_set: string;
  level: number;
  slots: (CharacterStateEnhancement | null)[];
  is_active: boolean;
  active_sub_power: string | null;
  inherent_slot_count: number;
  is_locked: boolean;
  inherent_category: 'fitness' | 'basic' | 'prestige' | 'archetype' | null;
  targets_hit: number | null;
}

export interface CharacterStatePowerset {
  id: string | null;
  name: string;
  powers: CharacterStateSelectedPower[];
}

export interface CharacterStatePool {
  id: string;
  name: string;
  powers: CharacterStateSelectedPower[];
}

export interface CharacterStateIncarnateSlot {
  power_name: string;
  active: boolean;
}

export interface CharacterStateIncarnateLoadout {
  alpha: CharacterStateIncarnateSlot | null;
  judgement: CharacterStateIncarnateSlot | null;
  interface: CharacterStateIncarnateSlot | null;
  destiny: CharacterStateIncarnateSlot | null;
  lore: CharacterStateIncarnateSlot | null;
  hybrid: CharacterStateIncarnateSlot | null;
  genesis: CharacterStateIncarnateSlot | null;
}

export interface CharacterStateSlotOrderEntry {
  power_name: string;
  slot_index: number;
  category: string | null;
  level: number | null;
}

export interface CharacterStateCombatContext {
  in_combat: boolean;
  enemy_level_offset: number;
  fury_level: number;
  vigilance_team_size: number;
  hit_points_percent: number;
  exemplar_level: number | null;
  destiny_time: number | null;
  hidden: boolean;
  global_conditionals: Record<string, boolean>;
  per_power_conditionals: Record<string, boolean>;
  active_modes: string[];
}

export interface CharacterState {
  name: string;
  dataset: 'homecoming' | 'rebirth' | 'thunderspy';
  archetype: { id: string | null; name: string };
  level: number;
  primary: CharacterStatePowerset;
  secondary: CharacterStatePowerset;
  pools: CharacterStatePool[];
  epic_pool: CharacterStatePool | null;
  inherents: CharacterStateSelectedPower[];
  accolades: string[];
  incarnates: CharacterStateIncarnateLoadout;
  /** Per-slotted-proc control overrides, keyed `"<power display name>:<slot index>"` — the
   *  build's own `procOverrides`, passed through so the engine's proc pass honours the
   *  "Slotted Procs" enable / stacks / %HP controls instead of always running the defaults. */
  proc_overrides: Record<string, ProcOverride>;
  slot_order: CharacterStateSlotOrderEntry[];
  combat: CharacterStateCombatContext;
}

// ============================================
// INPUT: the uiStore-derived calc context (the options bag + incarnateActive)
// ============================================

/**
 * The subset of uiStore the engine consumes, gathered exactly as
 * `useCharacterCalculation` gathers it. Names/defaults match uiStore. `procSettings`
 * is intentionally omitted: it gates per-power proc DPS (engine M5, out of the totals
 * slice); proc set-bonus globals (LotG +Recharge, …) are always-on in the engine.
 */
export interface AdapterCalcContext {
  exemplarMode: boolean;
  exemplarLevel: number;
  incarnateActive: IncarnateActiveState;
  incarnateLevelShiftActive: boolean;
  targetsHitValues: Record<string, number>;
  targetLevelOffset: number;
  vigilanceTeamSize: number;
  furyLevel: number;
  combatMode: boolean;
  destinyTime: number | null;
  globalAdjusters: Record<string, boolean>;
  mechanicAdjusters: Record<string, boolean>;
  /** Header Domination toggle — an AT-inherent mechanic the conditional `domination` id reads
   *  instead of `globalAdjusters` (PROD6C-3k). */
  dominationActive: boolean;
  /** Header alpha-strike toggle. Combined with the build's Hide power into the engine's
   *  `hidden`, which gates the mid-combat cast. */
  stalkerHidden: boolean;
}

const INCARNATE_SLOTS = ['alpha', 'judgement', 'interface', 'destiny', 'lore', 'hybrid', 'genesis'] as const;

// ============================================
// MAPPERS
// ============================================

function mapEnhancement(e: Enhancement): CharacterStateEnhancement {
  const base = {
    id: e.id,
    name: e.name,
    icon: e.icon ?? '',
    level: e.level ?? null,
    attuned: e.attuned ?? false,
    boost: e.boost ?? 0,
  };
  switch (e.type) {
    case 'io-set':
      return { ...base, type: 'io-set', set_id: e.setId, set_name: e.setName, piece_num: e.pieceNum, aspects: e.aspects, is_proc: e.isProc, is_unique: e.isUnique };
    case 'io-generic':
      return { ...base, type: 'io-generic', stat: e.stat, value: e.value ?? 0 };
    case 'special':
      return { ...base, type: 'special', category: e.category, aspects: e.aspects.map((a) => ({ stat: a.stat, value: a.value })) };
    case 'origin':
      return { ...base, type: 'origin', tier: e.tier, origin: e.origin ?? null, secondary_origin: e.secondaryOrigin ?? null, stat: e.stat, value: e.value ?? 0 };
    default: {
      // Exhaustiveness guard — a new enhancement kind must fail loud here, not drop.
      const never: never = e;
      throw new Error(`characterStateAdapter: unmapped enhancement kind ${JSON.stringify(never)}`);
    }
  }
}

function mapPower(p: SelectedPower, targetsHitValues: Record<string, number>): CharacterStateSelectedPower {
  return {
    internal_name: p.internalName,
    power_set: p.powerSet,
    level: p.level,
    slots: p.slots.map((slot) => (slot ? mapEnhancement(slot) : null)),
    is_active: p.isActive ?? false,
    active_sub_power: p.activeSubPower ?? null,
    inherent_slot_count: p.inherentSlotCount ?? 0,
    is_locked: p.isLocked ?? false,
    inherent_category: p.inherentCategory ?? null,
    // targetsHitValues is keyed by internalName (NOT unique across the build); a value
    // distributes to every pick with that name, inheriting the beta's own limitation.
    targets_hit: p.internalName in targetsHitValues ? targetsHitValues[p.internalName] : null,
  };
}

function mapPowerset(s: PowersetSelection, targetsHitValues: Record<string, number>): CharacterStatePowerset {
  return { id: s.id, name: s.name, powers: s.powers.map((p) => mapPower(p, targetsHitValues)) };
}

function mapPool(p: PoolSelection, targetsHitValues: Record<string, number>): CharacterStatePool {
  return { id: p.id, name: p.name, powers: p.powers.map((pw) => mapPower(pw, targetsHitValues)) };
}

function mapIncarnates(build: Build, active: IncarnateActiveState): CharacterStateIncarnateLoadout {
  const out = {} as CharacterStateIncarnateLoadout;
  for (const slot of INCARNATE_SLOTS) {
    const sel = build.incarnates[slot];
    out[slot] = sel ? { power_name: sel.powerName, active: active[slot] ?? false } : null;
  }
  return out;
}

// ============================================
// CONDITIONAL-ADJUSTER CLASSIFICATION (PROD3)
// ============================================

/**
 * `ActivePowerEffect` keys that land on a CASTER dashboard total (defense, resistance, +damage,
 * movement, …) — as opposed to foe-facing control (hold/stun/…) or attack-damage entries, which
 * never move a Self total. A conditional whose `effects` carry one of these reaches the dashboard.
 */
const SELF_TOTAL_EFFECT_KEYS: ReadonlySet<string> = new Set([
  'tohitBuff', 'tohitBuffUnenhanced', 'accuracyBuff', 'damageBuff', 'rechargeBuff',
  'defense', 'defenseBuff', 'defenseBuffSuppressible', 'resistance', 'debuffResistance',
  'mezResistance', 'elusivity', 'absorb', 'protection', 'enduranceDiscount',
  'runSpeed', 'runSpeedUnenhanced', 'flySpeed', 'jumpHeight', 'jumpSpeed', 'movement',
  'regeneration', 'recovery', 'maxEndurance', 'maxHealth',
  'regenBuff', 'regenBuffUnenhanced', 'recoveryBuff', 'recoveryBuffUnenhanced',
  'maxHPBuff', 'maxHPBuffUnenhanced', 'maxEndBuff',
]);

/**
 * Global conditional-adjuster ids whose caster-side buff the engine already accounts for, so
 * forwarding the beta toggle changes no total and must not fail loud:
 *  - the Bio Armor adaptation stances flow via `active_sub_power`, and the engine re-admits their
 *    `Source.Mode?`-gated atoms (PROD3 increment 1);
 *  - out-of-combat rides `combatMode` → `in_combat` — the engine binds `kOutOfCombat` to `!in_combat`,
 *    the same signal that governs the suppressible out-of-combat defense;
 *  - the Primalist form stances ride the toggled form power's own `setsModes`, which is what
 *    `collect_source_modes` binds `kHunterMode` / `kProwlerMode` from. Thunderspy published no mode
 *    at all until TSPY-4 fixed the parser, which is why these two used to fail loud here.
 */
const ENGINE_MODELED_ADJUSTERS: ReadonlySet<string> = new Set([
  'defensiveadaptation', 'offensiveadaptation', 'restedadaptation',
  'outofcombat',
  'huntermode', 'prowlermode',
]);

/**
 * Global conditional-adjuster ids that carry a caster-side buff but gate a COMBAT-TRANSIENT rotation
 * state (Storm's clear skies, Dual Pistols ammo / status mode, Staff perfection, Storm Blast's
 * in-cell): a mid-combo pulse, not a sustained total. The engine leaves them Indeterminate and omits
 * them, so the dashboard shows the sustained value and the toggle is a no-op — the deliberate reading
 * of a totals dashboard, not a silent drop of a persistent buff.
 *
 * The last two are thunderspy's, and their data says the same thing in a different idiom: both gate
 * on `Temporary_Powers.… source.ownPower?` — a temp power a prior attack grants and the next
 * consumes — rather than on a mode. A build does not hold that temp, so it is rotation state.
 */
const TRANSIENT_UNMODELED_ADJUSTERS: ReadonlySet<string> = new Set([
  'clearskies', 'cryoammunition', 'dd_statusmode_2',
  'perfection_of_body_level_3', 'perfection_of_mind_level_3', 'stormblast_instormcell',
  'bulletcut', 'pale_self_buff_plaguebearer',
]);

/** Every `conditionalEffects` entry the build's selected powers carry, indexed by conditional id. */
function buildConditionalsById(build: Build): Map<string, ConditionalEffect[]> {
  const byId = new Map<string, ConditionalEffect[]>();
  const add = (conds?: ConditionalEffect[]) => {
    for (const c of conds ?? []) {
      const list = byId.get(c.id);
      if (list) list.push(c);
      else byId.set(c.id, [c]);
    }
  };
  const fromSet = (
    setId: string | null | undefined,
    powers: { internalName: string }[],
    lookup: (id: string) => { powers: { internalName: string; conditionalEffects?: ConditionalEffect[] }[] } | undefined,
  ) => {
    if (!setId) return;
    const def = lookup(setId);
    if (!def) return;
    for (const pick of powers) add(def.powers.find((p) => p.internalName === pick.internalName)?.conditionalEffects);
  };
  fromSet(build.primary.id, build.primary.powers, getPowerset);
  fromSet(build.secondary.id, build.secondary.powers, getPowerset);
  for (const pool of build.pools) fromSet(pool.id, pool.powers, getPowerPool);
  if (build.epicPool) fromSet(build.epicPool.id, build.epicPool.powers, getEpicPool);
  // Inherents carry their own hydrated conditionalEffects (no powerset def to consult).
  for (const p of build.inherents) add((p as { conditionalEffects?: ConditionalEffect[] }).conditionalEffects);
  return byId;
}

/** True when any `conditionalEffects` entry with this id contributes a caster dashboard total. */
function adjusterAffectsSelfTotals(byId: Map<string, ConditionalEffect[]>, id: string): boolean {
  return (byId.get(id) ?? []).some((c) => {
    const effects = (c as { effects?: Record<string, unknown> }).effects;
    return !!effects && Object.keys(effects).some((k) => SELF_TOTAL_EFFECT_KEYS.has(k));
  });
}

// ============================================
// MAIN ADAPTER
// ============================================

/**
 * Build a `CharacterState` from the beta build + calc context. Throws on any input the
 * engine cannot honor (the fail-loud rows of the SPIKE3 table).
 */
export function toCharacterState(build: Build, ctx: AdapterCalcContext): CharacterState {
  // --- Conditional adjusters (PROD3): the engine models them through build state, not these maps. ---
  // Stance modes flow via `active_sub_power`; out-of-combat rides `combatMode` → `in_combat`. Every
  // other active toggle is either target-state (mechanicAdjusters — per-power scope is foe-side, zero
  // Self total) or a combat-transient caster buff the engine deliberately omits from a sustained-totals
  // dashboard. So forwarding them changes no total and must NOT throw. The guard stays fail-loud for the
  // one case that WOULD be a silent drop: a global toggle carrying a caster dashboard buff that is
  // neither modeled nor a known transient — i.e. a future data drop added a totals-relevant conditional
  // without a decision here. (The mechanic map is target-side by construction, so it is not scanned.)
  const unclassifiedActive = Object.entries(ctx.globalAdjusters)
    .filter(([id, on]) => on && !ENGINE_MODELED_ADJUSTERS.has(id) && !TRANSIENT_UNMODELED_ADJUSTERS.has(id))
    .map(([id]) => id);
  if (unclassifiedActive.length > 0) {
    // Only an unknown active toggle reaches the powerset defs — the common no-adjuster path never does.
    const conditionalsById = buildConditionalsById(build);
    const unclassifiedTotalsAdjusters = unclassifiedActive.filter((id) => adjusterAffectsSelfTotals(conditionalsById, id));
    if (unclassifiedTotalsAdjusters.length > 0) {
      throw new Error(
        `characterStateAdapter: global adjuster(s) carry a caster dashboard buff the engine does not model and would be silently dropped: ${unclassifiedTotalsAdjusters.join(', ')} — classify in ENGINE_MODELED_ADJUSTERS or TRANSIENT_UNMODELED_ADJUSTERS (or model in the engine) before forwarding`,
      );
    }
  }
  if (ctx.incarnateLevelShiftActive === false) {
    // Minor gap, not fatal: the engine derives level-shift from the equipped incarnate
    // (WS16 hardcoded-on) and cannot suppress it independently, so the build's totals
    // will include the level shift the user tried to toggle off.
    console.warn('characterStateAdapter: incarnateLevelShiftActive=false is not honored — the engine applies level-shift whenever a shift-granting incarnate is equipped');
  }

  return {
    name: build.name,
    dataset: build.serverId,
    archetype: { id: build.archetype.id, name: build.archetype.name },
    level: build.level,
    primary: mapPowerset(build.primary, ctx.targetsHitValues),
    secondary: mapPowerset(build.secondary, ctx.targetsHitValues),
    pools: build.pools.map((p) => mapPool(p, ctx.targetsHitValues)),
    epic_pool: build.epicPool ? mapPool(build.epicPool, ctx.targetsHitValues) : null,
    inherents: build.inherents.map((p) => mapPower(p, ctx.targetsHitValues)),
    accolades: build.accolades.map((a) => a.id.toLowerCase()),
    incarnates: mapIncarnates(build, ctx.incarnateActive),
    proc_overrides: build.procOverrides ?? {},
    slot_order: build.slotOrder.map((s) => ({
      power_name: s.powerName,
      slot_index: s.slotIndex,
      category: s.category ?? null,
      level: s.level ?? null,
    })),
    combat: {
      in_combat: ctx.combatMode,
      enemy_level_offset: ctx.targetLevelOffset,
      fury_level: ctx.furyLevel,
      // Beta vigilanceTeamSize = teammate count (0 = solo); engine vigilance_team_size =
      // team SIZE (1 = solo, and it rejects 0). See the beta calc + rebuild inherents test.
      vigilance_team_size: ctx.vigilanceTeamSize + 1,
      // Not fed by the beta totals path; the engine defaults it to full health.
      hit_points_percent: 100,
      // (mode + level) → Option: only exemplared when the mode is on.
      exemplar_level: ctx.exemplarMode ? ctx.exemplarLevel : null,
      // Destiny-time scrub: null → engine resolves at the sustained-floor time (the perma
      // default); a number → that exact second. The engine reads the same timeline the beta's
      // getDestinyEffectsAtTime does, so null↔None and n↔Some(n) match the beta path exactly.
      destiny_time: ctx.destinyTime,
      // The three DISPLAY-side inputs (PROD6C-3k): they resolve the effective power each
      // per-power projection describes and change no dashboard total, which is why forwarding
      // the toggle maps here does not disturb the classification above.
      hidden: isCasterHidden(build, ctx.stalkerHidden),
      // Stances win over stale UI toggles (the same overlay the surfaces and this calc apply),
      // and the one AT-inherent id the beta routes to the Header's own state is resolved into
      // the map here — the engine reads the data's `scope`, not a curated list of mechanic names.
      global_conditionals: { ...effectiveGlobalAdjusters(build, ctx.globalAdjusters), domination: ctx.dominationActive },
      per_power_conditionals: ctx.mechanicAdjusters,
      // The caster modes the player switched on. Display only: the engine swaps the redirected
      // record into the projection, and the TOTALS pass reads the same states through the
      // powers' own `setsModes` gates, so no total moves (PROD6C-3l).
      active_modes: build.activeModes ?? [],
    },
  };
}

/** Convenience: `toCharacterState` serialized to the JSON string `coh_wasm.recalculate` takes. */
export function toCharacterStateJson(build: Build, ctx: AdapterCalcContext): string {
  return JSON.stringify(toCharacterState(build, ctx));
}
