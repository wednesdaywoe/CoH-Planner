/**
 * Incarnate Effects Data
 *
 * Curated lookup table for incarnate power effects.
 * These values are extracted from the game data and used to:
 * 1. Display effects in tooltips
 * 2. Apply stat bonuses to the dashboard when powers are toggled active
 *
 * Note: Alpha powers provide "enhancement" bonuses (boost all powers)
 * Destiny/Hybrid provide direct stat bonuses (defense, resistance, damage, etc.)
 * Interface provides proc-based debuffs (not direct player stats)
 * Judgement/Lore are clickable attacks/pets (not passive stats)
 */

import type { IncarnateSlotId } from '@/types';
import { getActiveDataset } from './dataset';

// The raw generated incarnate tables ride in the active dataset's dynamic
// chunk via `getActiveDataset().incarnateEffectsRaw` (not a static
// cross-dataset import), so only the active server's incarnate data loads.
// Each dataset's index assembles the tables into this container; every slot
// accessor below reads its field on demand (the active dataset isn't loaded
// at module-evaluation time).

// ============================================
// TYPES
// ============================================

/**
 * Enhancement bonuses from Alpha slot (boost power effectiveness)
 *
 * Alpha slot abilities provide enhancement bonuses that apply to ALL powers
 * that accept that enhancement type. A portion of these bonuses bypass
 * Enhancement Diversification (ED), with the ratio depending on rarity:
 * - Common: 1/6 (~16.7%) bypasses ED
 * - Uncommon Core/Radial: 1/3 (~33.3%) bypasses ED
 * - Rare (Total/Partial): 1/2 (50%) bypasses ED
 * - Very Rare (Paragon): 2/3 (~66.7%) bypasses ED
 */
export interface AlphaEffects {
  // Enhancement bonuses (percentage as decimal, e.g., 0.45 = 45%)
  damage?: number;
  accuracy?: number;
  recharge?: number;
  enduranceReduction?: number;
  enduranceModification?: number;
  range?: number;
  heal?: number;
  defense?: number;
  resistance?: number;
  hold?: number;
  immobilize?: number;
  stun?: number;
  sleep?: number;
  fear?: number;
  confuse?: number;
  slow?: number;
  toHitDebuff?: number;
  defenseDebuff?: number;
  toHitBuff?: number;
  taunt?: number;
  runSpeed?: number;
  jumpSpeed?: number;
  flySpeed?: number;
  absorb?: number;
  // Special: Level shift
  levelShift?: number;
  // ED bypass ratio (portion of bonus that bypasses Enhancement Diversification)
  // Common: 1/6, Uncommon: 1/3, Rare: 1/2, VeryRare: 2/3
  edBypass?: number;
}

/**
 * Direct stat bonuses from Destiny slot
 * Note: Destiny effects diminish over time; we store initial (peak) values
 */
export interface DestinyEffects {
  // Defense (all positions/types)
  defenseAll?: number;
  // Resistance (all damage types)
  resistanceAll?: number;
  // Resistance to debuffs (defense, regen, recovery, recharge, tohit, ...).
  // Distinct from `resistanceAll` — Ageless Radial Epiphany grants 50%
  // debuff resistance, not 50% damage resistance.
  debuffResistance?: number;
  // Mez/status DURATION resistance (Clarion). Distinct from debuffResistance —
  // Clarion's Confused/Held/… Resistance templates were being flattened into
  // debuffResistance, which showed a bogus "300% Debuff Resistance". Display-only
  // (decimal, e.g. 2.1 = +210% status resistance).
  statusResistance?: number;
  // Healing Received — Res(Heal) buff (e.g. Incandescence Destiny). Stored
  // POSITIVE = more healing received (the raw Res(Heal) template is negative
  // and is inverted by the converter). Distinct from `healPercent` (heal
  // OUTPUT strength) and from set-bonus healOther. See convert-incarnate-effects.cjs.
  healReceived?: number;
  // Healing
  healPercent?: number;
  // Instantaneous click heal (Rebirth Destiny), stored as raw scale + AT table
  // (like Judgement damage). Resolved to actual HP at display time against the
  // build's archetype — no dashboard total (a click heal isn't a passive stat).
  healScale?: number;
  healTable?: string;
  // Knockback/Knockup protection magnitude (Clarion). Its own field so it feeds
  // the Knockback-protection total, not the six status-protection types.
  kbProtection?: number;
  // Run/jump/fly speed buff (Incandescence Radial), decimal (0.35 = +35%).
  runSpeed?: number;
  // Recovery/Regeneration
  recovery?: number;
  regeneration?: number;
  // Max HP/End
  maxHP?: number;
  maxEndurance?: number;
  // Instantaneous endurance refill on cast (e.g. Ageless) — not a sustained buff,
  // so it isn't folded into dashboard totals; kept for tooltips/completeness.
  endurance?: number;
  // Recharge
  recharge?: number;
  // Damage buff
  damage?: number;
  // ToHit buff
  toHit?: number;
  // Mez protection
  mezProtection?: number;
  // Level shift
  levelShift?: number;
  // Duration info
  initialDuration?: number;  // Duration of peak effect
  totalDuration?: number;    // Total duration before recharge
}

/**
 * One decay tier of a diminishing Destiny buff.
 *
 * Destiny click buffs (Barrier, Ageless, …) apply several independent,
 * overlapping buffs at once, each with its own `value` and `duration`
 * (seconds until it expires, measured from cast). The effective value at time
 * `t` is the SUM of all tiers whose `duration > t` — so the buff starts at the
 * additive peak and steps down as the shorter tiers expire. This matches Mids'
 * time-slider and the in-game behaviour (verified: T4 Barrier resolves to
 * 90% → 32.5% → 7.5% → 5% at its phase boundaries).
 */
export interface DestinyTimelineTier {
  value: number;
  duration: number;
}
export type DestinyTimeline = Record<string, DestinyTimelineTier[]>;

/**
 * Stat bonuses from Hybrid slot (toggle powers)
 *
 * Three-layer model:
 * - passive: Always-on just by equipping (stat key → decimal)
 * - frontLoaded: Active when toggle is on, no enemies required (stat key → decimal)
 * - perTarget: Stacks per nearby enemy up to maxTargets (stat key → decimal per enemy)
 *
 * Stat keys use the same names as GlobalBonuses (e.g. 'regeneration', 'resSmashing', 'defMelee')
 */
export interface HybridEffects {
  tree: string;
  /** Passive bonuses — always-on just by equipping (stat → decimal) */
  passive: Record<string, number>;
  /** Front-loaded bonuses — active when toggle is on, no enemies required (stat → decimal) */
  frontLoaded: Record<string, number>;
  /** Per-target bonuses — stacks per nearby enemy (stat → decimal per enemy) */
  perTarget: Record<string, number>;
  /** Maximum enemies for per-target stacking */
  maxTargets: number;
  duration: number;
  recharge: number;
}

/**
 * Interface proc effects (for display only, not dashboard stats)
 */
export interface InterfaceEffects {
  // Debuff type and magnitude
  debuffType?: string;  // e.g., "-Resistance", "-Defense", "-Regen"
  debuffMagnitude?: number;
  debuffDuration?: number;

  // DoT type and damage
  dotType?: string;  // e.g., "Fire", "Cold", "Toxic"
  dotDamage?: number;       // damage scale value
  dotDuration?: number;
  dotTableName?: string;    // AT table for DoT calc (e.g., "Melee_Tempdamage")

  // Proc chance
  procChance?: number;
}

/**
 * Judgement click attack effects (for display, not dashboard stats)
 */
export interface JudgementEffects {
  damageType: string;        // e.g., "Cold", "Energy", "Smashing", "Fire", "Negative Energy"
  effectArea: string;        // e.g., "Cone", "Chain", "PBAoE", "Targeted AoE", "Self Cone"
  range: number;             // in feet
  radius: number;            // in feet (0 for chain)
  arc: number;               // in degrees (0 for non-cones)
  maxTargets: number;        // 0 for chain powers
  activationTime: number;    // seconds
  rechargeTime: number;      // seconds (always 90)
  damageScale: number;       // usually 4.0
  tableName: string;         // AT table for damage calc (e.g., "Ranged_Tempdamage")
  secondaryEffects: string[];  // descriptive strings for display
}

/**
 * Lore pet summoning effects (for display, not dashboard stats)
 */
export interface LoreEffects {
  faction: string;           // display name e.g., "Arachnos"
  pets: string[];            // e.g., ['Boss', 'Support (Protected)']
  duration: number;          // pet duration in seconds
  rechargeTime: number;      // seconds (900 or 600)
  levelShift: number;        // 0 for T1/T2, 1 for T3/T4
}

/**
 * The level-44-and-below "exemplar power" a Genesis ability grants. When you
 * exemplar below 45 your incarnate abilities switch off — but Genesis instead
 * grants one of these usable powers, typed by tree:
 *   verdict → an AoE damage attack (like a mini Judgement)
 *   socket  → a proc/debuff applied to your attacks (like Interface)
 *   data    → a pet summon (like Lore)
 *   fate    → a PBAoE ally buff (+End/+Recovery/+Recharge; Clarion adds mez prot)
 * All four are display-only EXCEPT Fate's self stat-buff, which feeds the
 * dashboard while exemplared below 45 (see applyGenesisExemplarBuff).
 */
export type GenesisExemplarEffect =
  | {
      kind: 'attack';
      damageType: string;
      effectArea: string;
      range: number;
      radius: number;
      arc: number;
      maxTargets: number;
      activationTime: number;
      recharge: number;
      damageScale: number;
      tableName: string;
      secondaryEffects: string[];
    }
  | {
      kind: 'proc';
      label: string;
      debuffType?: string;
      debuffMagnitude?: number;
      dotType?: string;
      dotDamage?: number;
      dotTableName?: string;
      duration: number;
      procPeriod: number;
    }
  | {
      kind: 'summon';
      faction: string;
      pets: string[];
      duration: number;
      recharge: number;
    }
  | {
      kind: 'buff';
      stats: { endurance?: number; recovery?: number; recharge?: number };
      mezProtection?: number;
      radius: number;
      recharge: number;
    };

/**
 * Genesis amplifier effects (Rebirth-only).
 *
 * Genesis is NOT a flat global buff slot — each tree amplifies a partner
 * incarnate slot by `tierPercent` (0.025 | 0.05 | 0.075 | 0.1):
 *   data    → your Lore pets' damage (+ flat `loreMaxHP`)
 *   fate    → your Destiny slot ability's effects
 *   socket  → your Interface procs AND your player Max HP / Max Endurance
 *   verdict → your Judgement attack's damage
 * Only Socket's player Max HP / Max End reach the dashboard directly; the rest
 * scale a partner slot's contribution (see applyIncarnateBonuses / the Info
 * panel's Judgement & Lore displays).
 */
export interface GenesisEffects {
  displayName: string;
  tree: string;
  enhancesSlot: IncarnateSlotId;
  /** Amplification fraction applied to the partner slot / player Max HP+End. */
  tierPercent: number;
  /** Data only: flat Max HP granted to your Lore pets. */
  loreMaxHP?: number;
  /** The level-44- exemplar-only power this ability grants (reference). */
  exemplarPower: string;
  /** Resolved below-45 exemplar power, typed by tree. Descriptive only, except
   *  Fate's self-buff which feeds the dashboard while exemplared below 45. */
  exemplarEffect?: GenesisExemplarEffect;
}

/**
 * Per-dataset container for all raw incarnate effect tables. Assembled in each
 * `datasets/<id>/index.ts` from that server's generated files and hung on the
 * `Dataset` object, so only the active server's incarnate data is bundled into
 * its dynamic chunk. The generated literals are structurally looser than these
 * runtime types (the assertion that formerly lived in each `_pick3(...) as ...`
 * cast), so each dataset asserts the whole container once at assembly.
 */
export interface IncarnateEffectsRaw {
  alpha: Record<string, AlphaEffects>;
  destiny: Record<string, DestinyEffects>;
  destinyTimeline: Record<string, DestinyTimeline>;
  destinyBoosts: Record<string, string[]>;
  hybrid: Record<string, HybridEffects>;
  interface: Record<string, InterfaceEffects>;
  judgement: Record<string, JudgementEffects>;
  lore: Record<string, LoreEffects>;
  /** Homecoming ships no Genesis slot — its container holds an empty map. */
  genesis: Record<string, GenesisEffects>;
}

/**
 * Combined incarnate power effects
 */
export interface IncarnatePowerEffects {
  powerName: string;
  displayName: string;
  slotId: IncarnateSlotId;
  alpha?: AlphaEffects;
  destiny?: DestinyEffects;
  hybrid?: HybridEffects;
  interface?: InterfaceEffects;
  judgement?: JudgementEffects;
  lore?: LoreEffects;
  genesis?: GenesisEffects;
}

// ============================================
// ALPHA EFFECTS DATA
// ============================================

// Alpha data auto-generated — see scripts/convert-incarnate-effects.cjs
function alphaEffects(): Record<string, AlphaEffects> {
  return getActiveDataset().incarnateEffectsRaw.alpha;
}

// ============================================
// DESTINY EFFECTS DATA
// ============================================

// Destiny data auto-generated — see scripts/convert-incarnate-effects.cjs
function destinyEffects(): Record<string, DestinyEffects> {
  return getActiveDataset().incarnateEffectsRaw.destiny;
}

// Per-stat decay tiers for diminishing Destiny buffs. Only powers that
// actually decay (a stat with >1 tier) appear here; everything else is fully
// described by the flat peak values in destinyEffects().
function destinyTimelines(): Record<string, DestinyTimeline> {
  return getActiveDataset().incarnateEffectsRaw.destinyTimeline;
}

// Boost categories each Destiny power accepts — the game's rule for which Alpha
// enhancement aspects can enhance it.
function destinyBoosts(): Record<string, string[]> {
  return getActiveDataset().incarnateEffectsRaw.destinyBoosts;
}

// ============================================
// HYBRID EFFECTS DATA
// ============================================

// Hybrid data auto-generated — see scripts/convert-incarnate-effects.cjs
function hybridEffects(): Record<string, HybridEffects> {
  return getActiveDataset().incarnateEffectsRaw.hybrid;
}

// ============================================
// INTERFACE EFFECTS DATA
// ============================================

// Interface data auto-generated — see scripts/convert-incarnate-effects.cjs
function interfaceEffectsRegistry(): Record<string, InterfaceEffects> {
  return getActiveDataset().incarnateEffectsRaw.interface;
}

// ============================================
// JUDGEMENT EFFECTS DATA
// ============================================

// Judgement data auto-generated — see scripts/convert-incarnate-effects.cjs
function judgementEffectsRegistry(): Record<string, JudgementEffects> {
  return getActiveDataset().incarnateEffectsRaw.judgement;
}

// ============================================
// LORE EFFECTS DATA
// ============================================

// All 21 factions share identical tier structures — only faction name and entity names differ.
// Generated programmatically to avoid 189 manual entries.

// Lore data auto-generated — see scripts/convert-incarnate-effects.cjs
function loreEffectsRegistry(): Record<string, LoreEffects> {
  return getActiveDataset().incarnateEffectsRaw.lore;
}

// ============================================
// GENESIS EFFECTS DATA (Rebirth-only)
// ============================================

// Genesis data auto-generated — see scripts/convert-incarnate-effects.cjs.
// Homecoming has no Genesis slot, so its container holds an empty map; Rebirth
// and Thunderspy both ship one (see each dataset's index assembly).
function genesisEffectsRegistry(): Record<string, GenesisEffects> {
  return getActiveDataset().incarnateEffectsRaw.genesis;
}

// ============================================
// LOOKUP FUNCTIONS
// ============================================

/**
 * Normalize power ID for lookup (remove slot prefix, convert to lowercase with underscores)
 */
function normalizePowerId(powerId: string): string {
  // Remove common prefixes
  let normalized = powerId
    .toLowerCase()
    .replace(/^incarnate\.(alpha|judgement|interface|destiny|lore|hybrid|genesis)\./, '')
    .replace(/[.\s-]/g, '_');

  return normalized;
}

/**
 * Get Alpha effects for a power
 */
export function getAlphaEffects(powerId: string): AlphaEffects | null {
  const normalized = normalizePowerId(powerId);
  return alphaEffects()[normalized] || null;
}

/**
 * Get Destiny effects for a power
 */
export function getDestinyEffects(powerId: string): DestinyEffects | null {
  const normalized = normalizePowerId(powerId);
  return destinyEffects()[normalized] || null;
}

/**
 * Raw decay timeline for a Destiny power, or null if the power doesn't
 * diminish over time (single-tier buffs, instant heals, pure level shifts).
 */
export function getDestinyTimeline(powerId: string): DestinyTimeline | null {
  const normalized = normalizePowerId(powerId);
  return destinyTimelines()[normalized] || null;
}

/**
 * Longest tier duration across every stat of a Destiny power — i.e. when the
 * buff fully expires (0 if the power doesn't decay). Drives the max extent of
 * the time slider.
 */
export function getDestinyTotalDuration(powerId: string): number {
  const timeline = getDestinyTimeline(powerId);
  if (!timeline) return 0;
  let max = 0;
  for (const tiers of Object.values(timeline)) {
    for (const t of tiers) if (t.duration > max) max = t.duration;
  }
  return max;
}

/**
 * Time (seconds after cast) at which a Destiny buff reaches its sustained floor
 * — the start of the final plateau, i.e. the value a perma-Destiny build can
 * rely on continuously. Returns 0 for powers that don't decay (the whole buff
 * is one plateau). This is the conservative default for the time slider.
 *
 * Example: Barrier's tiers expire at 7.5/22.5/45/90s, so the floor phase is
 * [45s, 90s) and this returns 45.
 */
export function getDestinySustainedFloorTime(powerId: string): number {
  const timeline = getDestinyTimeline(powerId);
  if (!timeline) return 0;
  const durations = new Set<number>();
  for (const tiers of Object.values(timeline)) {
    for (const t of tiers) if (t.duration > 0) durations.add(t.duration);
  }
  const sorted = Array.from(durations).sort((a, b) => a - b);
  // Fewer than two distinct expiries → no decay steps, floor === peak at t=0.
  if (sorted.length <= 1) return 0;
  return sorted[sorted.length - 2];
}

/**
 * Destiny effects resolved at a point in time `timeSec` after cast.
 *
 * For any stat that decays, the value is the additive sum of the tiers still
 * active at `timeSec` (`duration > timeSec`); stats without a timeline (level
 * shift, non-decaying buffs) pass through from the flat peak values unchanged.
 * With `timeSec` undefined or a power that doesn't decay, this returns the
 * peak values — identical to getDestinyEffects().
 */
export function getDestinyEffectsAtTime(
  powerId: string,
  timeSec: number | undefined,
): DestinyEffects | null {
  const base = getDestinyEffects(powerId);
  if (!base) return null;
  const timeline = getDestinyTimeline(powerId);
  if (!timeline || timeSec == null) return base;

  const resolved: DestinyEffects = { ...base };
  for (const [stat, tiers] of Object.entries(timeline)) {
    let sum = 0;
    for (const t of tiers) {
      // A tier is active while `timeSec` is before its expiry. Instantaneous
      // effects (duration 0 — e.g. Ageless's endurance refill) only exist at
      // the moment of cast, so they count at t=0 only.
      if (t.duration > timeSec || (t.duration === 0 && timeSec <= 0)) sum += t.value;
    }
    // Guard float drift from summing tiers like 0.575 + 0.25 + 0.025 + 0.05.
    (resolved as Record<string, number>)[stat] = Math.round(sum * 1e6) / 1e6;
  }
  return resolved;
}

/** Boost categories a Destiny power accepts (e.g. ['Res_Damage','Buff_Defense']). */
export function getDestinyBoostsAllowed(powerId: string): string[] {
  const normalized = normalizePowerId(powerId);
  return destinyBoosts()[normalized] || [];
}

/**
 * Which Alpha enhancement aspect enhances which Destiny stat, and the boost
 * category the game requires the power to accept for it to apply. This is the
 * game-accurate, data-gated rule for "Alpha enhances Destiny" (something Mids
 * doesn't model): Cardiac's resistance enhances Barrier because Barrier's
 * boosts_allowed lists Res_Damage; Musculature's damage does not, because
 * Barrier doesn't accept a damage boost.
 */
const ALPHA_DESTINY_ENHANCEMENT: ReadonlyArray<{
  boost: string;
  alphaAspect: keyof AlphaEffects;
  destinyStat: keyof DestinyEffects;
}> = [
  { boost: 'Res_Damage', alphaAspect: 'resistance', destinyStat: 'resistanceAll' },
  { boost: 'Buff_Defense', alphaAspect: 'defense', destinyStat: 'defenseAll' },
  { boost: 'Heal', alphaAspect: 'heal', destinyStat: 'healPercent' },
  { boost: 'Recovery', alphaAspect: 'enduranceModification', destinyStat: 'recovery' },
];

/**
 * Enhance a Destiny buff by the equipped Alpha's enhancement, gated by the
 * power's accepted boost categories. Returns a new object; unchanged when no
 * Alpha, no matching boost, or no relevant enhancement aspect.
 *
 * A Destiny click buff carries no slotted enhancements, so the Alpha value is
 * the only enhancement in that aspect and sits well below the ED knee — we
 * apply it as a straight `× (1 + aspect)` with no ED penalty modelled.
 */
export function applyAlphaToDestiny(
  effects: DestinyEffects,
  boostsAllowed: string[],
  alpha: AlphaEffects | null,
): DestinyEffects {
  if (!alpha || boostsAllowed.length === 0) return effects;
  let out: DestinyEffects | null = null;
  for (const m of ALPHA_DESTINY_ENHANCEMENT) {
    if (!boostsAllowed.includes(m.boost)) continue;
    const enh = alpha[m.alphaAspect];
    const base = effects[m.destinyStat];
    // destinyStat is always a numeric aspect (resistanceAll/defenseAll/…), but
    // DestinyEffects now includes the string `healTable`, so narrow explicitly.
    if (!enh || typeof base !== 'number') continue;
    if (!out) out = { ...effects };
    (out as Record<string, number>)[m.destinyStat] = Math.round(base * (1 + enh) * 1e6) / 1e6;
  }
  return out ?? effects;
}

/**
 * Alias map for Hybrid Melee/Support powers.
 *
 * The UI data loader uses slot-index internal names from the bin-crawler
 * export (e.g. `Melee_Core_Embodiment`), but incarnate-effects-generated
 * is built from a different extraction pass where the internal names are
 * numeric suffixes (e.g. `Melee_Genome_8`). Order matches the position in
 * the hybrid powerset index — that's the stable contract between the two
 * name spaces.
 */
const HYBRID_ID_ALIASES: Record<string, string> = {
  // Melee tree (9 powers, in powerset order)
  'melee_genome': 'melee_genome_1',
  'melee_core_genome': 'melee_genome_2',
  'melee_radial_genome': 'melee_genome_3',
  'melee_total_core_graft': 'melee_genome_4',
  'melee_partial_core_graft': 'melee_genome_5',
  'melee_partial_radial_graft': 'melee_genome_6',
  'melee_total_radial_graft': 'melee_genome_7',
  'melee_core_embodiment': 'melee_genome_8',
  'melee_radial_embodiment': 'melee_genome_9',
  // Support tree (9 powers — support_genome keeps its name, rest are numeric)
  'support_core_genome': 'support_genome_2',
  'support_radial_genome': 'support_genome_3',
  'support_total_core_graft': 'support_genome_4',
  'support_partial_core_graft': 'support_genome_5',
  'support_partial_radial_graft': 'support_genome_6',
  'support_total_radial_graft': 'support_genome_7',
  'support_core_embodiment': 'support_genome_8',
  'support_radial_embodiment': 'support_genome_9',
};

/**
 * Get Hybrid effects for a power
 */
export function getHybridEffects(powerId: string): HybridEffects | null {
  const normalized = normalizePowerId(powerId);
  const key = HYBRID_ID_ALIASES[normalized] || normalized;
  return hybridEffects()[key] || null;
}

/**
 * Get Interface effects for a power
 */
export function getInterfaceEffects(powerId: string): InterfaceEffects | null {
  const normalized = normalizePowerId(powerId);
  return interfaceEffectsRegistry()[normalized] || null;
}

/**
 * Get Judgement effects for a power
 */
export function getJudgementEffects(powerId: string): JudgementEffects | null {
  const normalized = normalizePowerId(powerId);
  return judgementEffectsRegistry()[normalized] || null;
}

/**
 * Get Lore effects for a power
 */
export function getLoreEffects(powerId: string): LoreEffects | null {
  const normalized = normalizePowerId(powerId);
  return loreEffectsRegistry()[normalized] || null;
}

/**
 * Get Genesis amplifier effects for a power (Rebirth-only; null elsewhere).
 */
export function getGenesisEffects(powerId: string): GenesisEffects | null {
  const normalized = normalizePowerId(powerId);
  return genesisEffectsRegistry()[normalized] || null;
}

/**
 * Get effects for any incarnate power based on its slot
 */
export function getIncarnateEffects(
  slotId: IncarnateSlotId,
  powerId: string
): AlphaEffects | DestinyEffects | HybridEffects | InterfaceEffects | JudgementEffects | LoreEffects | GenesisEffects | null {
  switch (slotId) {
    case 'alpha':
      return getAlphaEffects(powerId);
    case 'destiny':
      return getDestinyEffects(powerId);
    case 'hybrid':
      return getHybridEffects(powerId);
    case 'interface':
      return getInterfaceEffects(powerId);
    case 'judgement':
      return getJudgementEffects(powerId);
    case 'lore':
      return getLoreEffects(powerId);
    case 'genesis':
      return getGenesisEffects(powerId);
    default:
      return null;
  }
}

/**
 * Format effect value as percentage string
 */
export function formatEffectPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

/**
 * Format effect value with sign
 */
export function formatEffectValue(value: number, isPercent = true): string {
  const sign = value >= 0 ? '+' : '';
  if (isPercent) {
    return `${sign}${(value * 100).toFixed(1)}%`;
  }
  return `${sign}${value.toFixed(2)}`;
}
