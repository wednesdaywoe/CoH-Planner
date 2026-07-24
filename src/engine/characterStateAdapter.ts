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
 * silently dropped. `globalAdjusters`, `mechanicAdjusters`, and a non-null `destinyTime`
 * throw; a disabled `incarnateLevelShiftActive` warns (the engine derives level-shift from
 * the equipped incarnate and can't suppress it independently). A silent drop here would be
 * exactly the field-loss class the rebuild exists to kill.
 */

import type { Build, PowersetSelection, PoolSelection } from '@/types/build';
import type { SelectedPower } from '@/types/power';
import type { Enhancement } from '@/types/enhancement';
import type { IncarnateActiveState } from '@/types/incarnate';

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
// MAIN ADAPTER
// ============================================

/**
 * Build a `CharacterState` from the beta build + calc context. Throws on any input the
 * engine cannot honor (the fail-loud rows of the SPIKE3 table).
 */
export function toCharacterState(build: Build, ctx: AdapterCalcContext): CharacterState {
  // --- Fail-loud guards: inputs with no engine equivalent must not silently vanish. ---
  const activeGlobalAdjusters = Object.entries(ctx.globalAdjusters).filter(([, on]) => on).map(([k]) => k);
  if (activeGlobalAdjusters.length > 0) {
    throw new Error(`characterStateAdapter: globalAdjusters have no engine equivalent and would be silently dropped: ${activeGlobalAdjusters.join(', ')}`);
  }
  const activeMechanicAdjusters = Object.entries(ctx.mechanicAdjusters).filter(([, on]) => on).map(([k]) => k);
  if (activeMechanicAdjusters.length > 0) {
    throw new Error(`characterStateAdapter: mechanicAdjusters have no engine equivalent and would be silently dropped: ${activeMechanicAdjusters.join(', ')}`);
  }
  if (ctx.destinyTime !== null) {
    throw new Error(`characterStateAdapter: destinyTime=${ctx.destinyTime} (Destiny uptime scrub) has no engine equivalent — the engine models only the sustained Destiny value`);
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
    },
  };
}

/** Convenience: `toCharacterState` serialized to the JSON string `coh_wasm.recalculate` takes. */
export function toCharacterStateJson(build: Build, ctx: AdapterCalcContext): string {
  return JSON.stringify(toCharacterState(build, ctx));
}
