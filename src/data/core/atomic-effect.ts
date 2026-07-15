/**
 * DSH4 — Closed atomic effect schema + canonical identity key.
 *
 * Source of truth: streams/DEDUCTIVE_SCHEMA_HARNESS.md. This encodes the Mids /
 * game / bin-parser atomic model — a power is a **flat array of atomic,
 * single-attrib effect records**, a compound effect = N sibling records
 * distinguished by damageType / mezType / pvMode / resistible. It is the schema the
 * converter's bag-of-~90-named-slots `PowerEffects` will be *projected from* (DSH6),
 * and the shape the oracle harness keys on (DSH5). This file defines the record, the
 * attrib→type bridge, and the identity keys — it does NOT yet rewrite the converter
 * (that is DSH6) nor read the Mids oracle (DSH5).
 *
 * Field provenance (each `AtomicEffect` field ← Mids `Effect` / bin-export template):
 *   effectType/subType ← export `attribs[]` string via `bridgeAttrib` (Mids splits
 *                        these into `EffectType` + `DamageType`/`MezType` natively).
 *   pvMode             ← export effect-group `is_pvp` (Mids `PvMode`/ePvX).
 *   resistible         ← NOT template `flags[].IgnoreResistance` (Mids `Resistible`).
 *   toWho              ← export template `target` (Mids `ToWho`/eToWho); replaces the
 *                        ad-hoc `selfPenalty` bag flag.
 *   attribType/aspect  ← export template `type`/`aspect` (Mids `AttribType`/`Aspect`).
 *   modifierTable      ← export template `table` (Mids `ModifierTable`).
 *   scale              ← export template `scale`, SIGN PRESERVED (the converter's
 *                        `makeEffect` does `Math.abs` at ingest — we stop that here).
 *   magnitude/duration/ticks/stacking/... ← the corresponding template fields.
 *   specialCase/conditionals ← group `requires_expression` gate (Mids
 *                        `SpecialCase`+`ActiveConditionals`); replaces the `domination`
 *                        bag bolt-on.
 */

// ============================================================================
// Enums (Mids-aligned; version- & handoff-stable — the structural TRUST set)
// ============================================================================

/** ePvX — which combat context this effect applies in. */
export type PvMode = 'Any' | 'PvE' | 'PvP';

/** eAspect — which face of the attribute is modified. */
export type Aspect = 'Res' | 'Max' | 'Abs' | 'Str' | 'Cur';

/** eAttribType — how the scale is interpreted. ('Constant' is a bin-export-only
 *  application flavor folded onto Magnitude here.) */
export type AttribType = 'Magnitude' | 'Duration' | 'Expression';

/** eToWho — who the effect lands on. Replaces the ad-hoc `selfPenalty` flag:
 *  a foe-debuff is `toWho:'Target'`, a genuine self-penalty is `toWho:'Self'`. */
export type ToWho = 'Unspecified' | 'Target' | 'Self' | 'All';

/** How repeated applications combine. Superset of Mids eStacking (No|Yes) plus the
 *  bin/converter stacking flavors already modeled (RefreshToCount et al.). */
export type Stacking =
  | 'No' | 'Yes' | 'Stack' | 'Replace' | 'Extend' | 'Refresh'
  | 'RefreshToCount' | 'Overlap' | 'Maximize' | 'Ignore' | 'Suppress';

/**
 * The primary effect classification. Mids stores `EffectType` (eEffectType) and a
 * separate `DamageType`/`MezType`; we keep that split — `effectType` here is the
 * gameplay category and `subType` carries the damage/mez/positional dimension. The
 * by-type protection split (Defense vs Resistance vs Elusivity) is NOT in the
 * bin-export attrib string — it is derived from `aspect`+`table` (see `bridgeAttrib`).
 */
export type EffectType =
  // offense / healing
  | 'Damage' | 'DamageBuff' | 'Heal' | 'HealResistance' | 'Absorb'
  // mitigation (by-type)
  | 'Defense' | 'Resistance' | 'Elusivity'
  // to-hit / accuracy
  | 'ToHit' | 'Accuracy'
  // control
  | 'Mez' | 'MezResist'
  // secondary-attribute strength buff (Power Boost family; Mids eEffectType.Enhancement)
  | 'Enhancement'
  // resource / survivability
  | 'Endurance' | 'EnduranceDiscount' | 'Recovery' | 'Regeneration'
  | 'MaxHP' | 'MaxEndurance'
  // utility stats
  | 'RechargeTime' | 'Range' | 'ThreatLevel' | 'Perception' | 'Stealth'
  // movement (subType: Run|Fly|Jump|JumpHeight|Control|Friction)
  | 'Movement'
  // meta / engine (grant/execute/summon/mode/etc. — not a numeric player stat)
  | 'GrantPower' | 'ExecutePower' | 'RechargePower' | 'GlobalChanceMod'
  | 'EntCreate' | 'Meta'
  // escape hatch — an attrib the bridge cannot confidently classify. Tracked as a
  // coverage gap, never silently mapped to a wrong slot.
  | 'Unmapped';

// ============================================================================
// The atomic effect record
// ============================================================================

export interface AtomicEffect {
  // --- identity-bearing (structural) ---
  effectType: EffectType;
  /** damage type (Smashing…), mez type (Held…), positional (Melee/Ranged/AoE),
   *  or movement axis (Run/Fly/…). One record per subType — the multi-type
   *  explosion. `undefined` for scalar effects (RechargeTime, ToHit, …). */
  subType?: string;
  pvMode: PvMode;
  /** first-class: absence of `IgnoreResistance` ⇒ resistible (never left agnostic). */
  resistible: boolean;
  toWho: ToWho;
  attribType: AttribType;
  aspect: Aspect;
  /** validated AT/pet table name; '' when the effect carries no table (rare). */
  modifierTable: string;
  /** SIGNED scale — sign preserved at ingest (a debuff is negative). */
  scale: number;

  // --- value / context (non-identity) ---
  magnitude: number;
  duration: number;
  ticks?: number;
  applicationPeriod?: number;
  stacking: Stacking;
  stackCap?: number;
  baseProbability: number;
  procsPerMinute?: number;

  // --- enhancement / calc flags ---
  buffable?: boolean;
  ignoreED?: boolean;
  ignoreScaling?: boolean;
  ignoreStrength?: boolean;

  // --- conditional gate (replaces the `domination`/`selfPenalty` bolt-ons) ---
  specialCase?: string;
  /** raw gate expression (CoH stack-machine string) or Mids (key,value) pairs. */
  requiresExpression?: string;

  // --- provenance (debugging + DSH6 migration) ---
  sourceAttrib?: string;
}

// ============================================================================
// Positional tuple codec — the runtime wire format (Plan B, Phase 0)
// ============================================================================
//
// The generated `Power` carries its atom list as `atoms: EncodedAtom[]` — a
// positional array per atom rather than a keyed object, chosen to keep the
// committed generated tree (and the runtime chunk) small: field NAMES dominate
// the object encoding, so dropping them cuts ~5× (measured: 619 → 124 B/atom on
// the HC corpus). The `effects` bag stays human-readable during migration; only
// the new `atoms` field is tuple-encoded. Consumers decode with `decodeAtoms`.
//
// `sourceAttrib` (debugging provenance) and every converter-local `_`-prefixed
// field are deliberately NOT part of the wire format — only the canonical
// AtomicEffect schema ships. `ATOM_TUPLE_FIELDS` is the ONE source of truth for
// field order; both the converter's encoder and the runtime decoder read it, so
// adding/reordering a field is a single edit here.

/** Canonical AtomicEffect fields, in wire order. Identity/value fields first so
 *  the rarely-set flags fall at the tail and trim away (encoder drops trailing
 *  nulls). `sourceAttrib` and `_`-prefixed provenance are intentionally absent. */
export const ATOM_TUPLE_FIELDS = [
  'effectType', 'subType', 'scale', 'magnitude', 'duration', 'modifierTable',
  'aspect', 'attribType', 'toWho', 'pvMode', 'resistible', 'stacking',
  'stackCap', 'ticks', 'applicationPeriod', 'baseProbability', 'procsPerMinute',
  'ignoreStrength', 'buffable', 'ignoreED', 'ignoreScaling',
  'specialCase', 'requiresExpression',
] as const satisfies ReadonlyArray<keyof AtomicEffect>;

/** One atom, positionally encoded. A `null` at position `i` means the field
 *  `ATOM_TUPLE_FIELDS[i]` is absent; trailing nulls are trimmed, so a short
 *  array leaves every field past its end absent. */
export type EncodedAtom = ReadonlyArray<string | number | boolean | null>;

/** Encode one AtomicEffect to its positional tuple (trailing nulls trimmed). */
export function encodeAtom(a: AtomicEffect): EncodedAtom {
  const t: (string | number | boolean | null)[] = ATOM_TUPLE_FIELDS.map((f) => {
    const v = a[f];
    return v === undefined ? null : (v as string | number | boolean);
  });
  while (t.length > 0 && t[t.length - 1] === null) t.pop();
  return t;
}

/** Decode a wire atom list back to AtomicEffect records. `null` / past-end
 *  positions restore to `undefined`; every stored non-null value round-trips. */
export function decodeAtoms(encoded: readonly EncodedAtom[] | undefined): AtomicEffect[] {
  if (!encoded) return [];
  return encoded.map((tuple) => {
    const a = {} as Record<string, unknown>;
    for (let i = 0; i < ATOM_TUPLE_FIELDS.length; i++) {
      const v = tuple[i];
      if (v !== undefined && v !== null) a[ATOM_TUPLE_FIELDS[i]] = v;
    }
    return a as unknown as AtomicEffect;
  });
}

// ============================================================================
// Canonical identity keys
// ============================================================================

const KEY_SEP = '|';

/**
 * Full canonical identity key (plan §DSH4). Two records with the same key are the
 * SAME application and may merge; a different key is a genuinely distinct sibling.
 * Includes `round(scale,4)` so the resistible/unresistable twin (identical structure,
 * half scale) and duration-variant stacks stay distinct. Used by the converter's
 * dedup/merge (DSH6) and the collapse detector (DSH3/DSH6).
 */
export function identityKey(e: AtomicEffect): string {
  return [
    e.effectType,
    e.subType ?? '',
    e.pvMode,
    e.resistible ? 'R' : 'U',
    e.toWho,
    e.attribType,
    e.aspect,
    e.modifierTable.toLowerCase(),
    round4(e.scale),
  ].join(KEY_SEP);
}

/**
 * Reduced STRUCTURAL key (plan §guardrail 1) — `(effectType, subType, pvMode,
 * resistible, modifierTable)`, no scale/aspect/attribType/toWho. Used by the oracle
 * differential harness (DSH5) where exact scale is skew-distrusted; canonicalize
 * BOTH sides to a multiset of these before diffing.
 */
export function structuralKey(e: AtomicEffect): string {
  return [
    e.effectType,
    e.subType ?? '',
    e.pvMode,
    e.resistible ? 'R' : 'U',
    e.modifierTable.toLowerCase(),
  ].join(KEY_SEP);
}

function round4(n: number): string {
  // stable, locale-independent 4-dp string; avoids -0 and float noise in the key.
  const r = Math.round((n + Number.EPSILON) * 1e4) / 1e4;
  return (Object.is(r, -0) ? 0 : r).toString();
}

// ============================================================================
// attrib → (effectType, subType) bridge
// ============================================================================

export interface BridgeResult {
  effectType: EffectType;
  subType?: string;
  /** set when effectType === 'Unmapped' — why the bridge declined (coverage gap). */
  reason?: string;
}

/** damage-type dimension normalization → canonical subType (Mids eDamage names). */
const DAMAGE_SUBTYPE: Record<string, string> = {
  smashing: 'Smashing', lethal: 'Lethal', fire: 'Fire', cold: 'Cold',
  energy: 'Energy', negative_energy: 'Negative', negative: 'Negative',
  toxic: 'Toxic', psionic: 'Psionic', special: 'Special',
  melee: 'Melee', ranged: 'Ranged', area: 'AoE', aoe: 'AoE',
  // exotic damage-only types seen in the HC export (Kheldian / signature)
  radiation: 'Radiation', electrical: 'Electrical', quantum: 'Quantum',
  sonic: 'Sonic', unique1: 'Unique1', unique2: 'Unique2', unique3: 'Unique3',
};

/** mez-name attribs → canonical mez subType (Mids eMez names; Knockback/Knockup/
 *  Repel are eMez in the canonical model even though the UI treats KB specially). */
const MEZ_SUBTYPE: Record<string, string> = {
  stunned: 'Stunned', held: 'Held', immobilized: 'Immobilized', sleep: 'Sleep',
  confused: 'Confused', terrorized: 'Terrorized', afraid: 'Afraid',
  placate: 'Placate', taunt: 'Taunt', teleport: 'Teleport', intangible: 'Intangible',
  untouchable: 'Untouchable', onlyaffectsself: 'OnlyAffectsSelf',
  combat_phase: 'CombatPhase', knockback: 'Knockback', knockup: 'Knockup',
  repel: 'Repel', evade: 'Evade',
};

/** scalar-stat attribs → effectType (no subType). */
const SCALAR_EFFECT: Record<string, EffectType> = {
  rechargetime: 'RechargeTime', endurance: 'Endurance',
  endurancediscount: 'EnduranceDiscount', recovery: 'Recovery',
  regeneration: 'Regeneration', hitpoints: 'MaxHP', accuracy: 'Accuracy',
  tohit: 'ToHit', range: 'Range', threatlevel: 'ThreatLevel',
  perceptionradius: 'Perception', stealthradius_pve: 'Stealth',
  stealthradius_pvp: 'Stealth', absorb: 'Absorb',
};

/** movement attribs → Movement/<axis>. */
const MOVEMENT_AXIS: Record<string, string> = {
  runningspeed: 'Run', flyingspeed: 'Fly', jumpingspeed: 'Jump',
  jumpheight: 'JumpHeight', fly: 'Fly', movementcontrol: 'Control',
  movementfriction: 'Friction',
};

/** engine / meta attribs → their effectType (or 'Meta' for non-stat markers). */
const META_EFFECT: Record<string, EffectType> = {
  grant_power: 'GrantPower', create_entity: 'EntCreate',
  execute_power: 'ExecutePower', recharge_power: 'RechargePower',
  global_chance_mod: 'GlobalChanceMod',
  set_mode: 'Meta', set_token: 'Meta', add_behavior: 'Meta',
  cancel_effects: 'Meta', designer_status: 'Meta', meter: 'Meta',
  rage: 'Meta', null: 'Meta', 'jump pack': 'Meta', stealth: 'Stealth',
  // Engine / script markers surfaced by the 2026-07-07 export refresh (mode-system
  // parsing + the attrib-118 byte-granular sub-index fix, which stopped collapsing
  // several of these onto Set_Mode). None is a numeric player stat — all are
  // non-stat engine/reward/script/costume markers → 'Meta' (translucency is the
  // stealth-visual component → 'Stealth', alongside `stealth`).
  translucency: 'Stealth',
  revoke_power: 'Meta', cancel_mods: 'Meta', set_costume: 'Meta',
  silent_kill: 'Meta', xpdebtprotection: 'Meta', token_add: 'Meta',
  token_set: 'Meta', clear_damagers: 'Meta', view_attributes: 'Meta',
  vision_phase: 'Meta', combat_mod_shift: 'Meta', avoid: 'Meta',
  grant_boosted_power: 'Meta', set_script_value: 'Meta', reward: 'Meta',
  ninja_run: 'Meta', script_notify: 'Meta',
};

/**
 * Map a bin-export `attribs[]` string (with its template `aspect`/`table` for the
 * cases where those disambiguate) to a canonical `(effectType, subType)`. Returns
 * `effectType:'Unmapped'` with a reason for anything it cannot confidently classify
 * — the caller tracks that as a coverage gap rather than silently mis-slotting it.
 *
 * The one context-dependent family: bare by-type attribs (`Smashing`, `Melee`, …)
 * carry no effectType in the name — Defense vs Resistance vs Elusivity lives in
 * `aspect`+`table` (verified against the committed HC export, 2026-07-05).
 */
export function bridgeAttrib(attrib: string, aspect?: string, table?: string): BridgeResult {
  const a = (attrib || '').toLowerCase();
  const tbl = (table || '').toLowerCase();
  const asp = (aspect || '').toLowerCase();
  if (!a) return { effectType: 'Unmapped', reason: 'empty attrib' };

  // aspect is the deep discriminator (verified against the HC oracle 2026-07-05):
  //   Str ⇒ a STRENGTH buff (DamageBuff for damage, Enhancement for a secondary
  //          attribute), NOT dealing/applying the attribute.
  //   Res ⇒ resistance to the attribute (Resistance / MezResist).
  //   Abs/Cur/Max ⇒ deal / apply / cap.
  const isStr = asp === 'strength';
  const isRes = asp === 'resistance';
  const resTable = tbl.includes('res') && !tbl.includes('restore');
  const defTable = tbl.includes('def');

  // Heal_Dmg is special: aspect=Resistance ⇒ healing *received* (not -res); the
  // bare `endsWith('_Dmg')` test historically flattened it into resistanceAll.
  if (a === 'heal_dmg') {
    return isRes ? { effectType: 'HealResistance' } : { effectType: 'Heal' };
  }

  // Damage / DamageBuff: `<type>_Dmg`. aspect=Str ⇒ a buff to the Damage attribute.
  if (a.endsWith('_dmg')) {
    const sub = DAMAGE_SUBTYPE[a.slice(0, -4)];
    if (!sub) return { effectType: 'Unmapped', reason: `unknown damage type: ${attrib}` };
    if (isStr) return { effectType: 'DamageBuff', subType: sub };
    if (isRes) return { effectType: 'Resistance', subType: sub };
    return { effectType: 'Damage', subType: sub };
  }

  // Elusivity: `<type>_Elusivity` / `ElusivityBase`.
  if (a === 'elusivitybase') return { effectType: 'Elusivity', subType: 'All' };
  if (a.endsWith('_elusivity')) {
    const sub = DAMAGE_SUBTYPE[a.slice(0, -'_elusivity'.length)];
    return { effectType: 'Elusivity', subType: sub ?? 'All' };
  }

  // Mez family. Res ⇒ mez RESISTANCE (duration reduction); Str ⇒ a buff to the
  // mez's strength (Power Boost); else ⇒ applying the mez.
  if (a in MEZ_SUBTYPE) {
    const sub = MEZ_SUBTYPE[a];
    if (isRes) return { effectType: 'MezResist', subType: sub };
    if (isStr) return { effectType: 'Enhancement', subType: sub };
    return { effectType: 'Mez', subType: sub };
  }

  // Scalar stats keep their type at any aspect (Mids keeps Recovery/Regen/ToHit at
  // Str); only Endurance gains a Max variant.
  if (a in SCALAR_EFFECT) {
    if (a === 'endurance' && asp === 'maximum') return { effectType: 'MaxEndurance' };
    return { effectType: SCALAR_EFFECT[a] };
  }

  // Movement.
  if (a in MOVEMENT_AXIS) return { effectType: 'Movement', subType: MOVEMENT_AXIS[a] };

  // Meta / engine.
  if (a in META_EFFECT) return { effectType: META_EFFECT[a] };

  // Base_Defense / bare by-type dimension (Smashing/…/Melee/Ranged/Area) — effectType
  // is NOT in the name (the damage/resistance face is always written `<type>_Dmg`).
  // Res/res-table ⇒ Resistance; def-table ⇒ Defense; Cur ⇒ Defense (the bare attrib IS
  // the defense characteristic, on any table); Str ⇒ Enhancement (defense strength buff);
  // else (Abs/Max on a non-def/res table) ⇒ deferred to DSH6's holistic routing.
  const sub = a === 'base_defense' ? 'All' : DAMAGE_SUBTYPE[a];
  if (sub) {
    if (isRes || (resTable && !defTable)) return { effectType: 'Resistance', subType: sub };
    if (defTable) return { effectType: 'Defense', subType: sub };
    // A bare position/type attrib with no `_Dmg` suffix IS the *defense* characteristic
    // (the damage/resistance face is always written `<type>_Dmg`); aspect=Current ⇒ a
    // defense buff/debuff — EVEN on a generic scaling table (`Melee_Ones`/`Ranged_Ones`,
    // the incarnate flat-buff tables), not just a `*Def*` table. Verified across the full
    // HC export (2026-07-05): every bare-by-type @ Current template is defense — Barrier /
    // Support Core incarnates and the positional NPC "Resistance" powers (whose real
    // resistance rides `_Dmg`@Res) — with zero mez/notify co-listing at aspect=Current.
    // Previously these fell to Unmapped, blinding DSH5/DSH6 to defense on non-`*Def*` tables.
    if (asp === 'current') return { effectType: 'Defense', subType: sub };
    if (isStr) return { effectType: 'Enhancement', subType: sub };
    return { effectType: 'Unmapped', reason: `by-type '${attrib}' at aspect '${aspect ?? '?'}' on non-def/res table '${table}' (deferred — DSH6 routing)` };
  }

  if (a.startsWith('unknown(')) return { effectType: 'Unmapped', reason: `parser-unmapped attrib index: ${attrib}` };
  return { effectType: 'Unmapped', reason: `no bridge rule: ${attrib}` };
}

// ============================================================================
// Reference ingest: bin-export effect template → AtomicEffect[]
// ============================================================================

/** minimal structural shape of a committed `exported_powers/**.json` effect group. */
export interface ExportGroup {
  is_pvp?: string;
  chance?: number;
  ppm?: number;
  requires_expression?: string;
  templates?: ExportTemplate[];
}
export interface ExportTemplate {
  attribs?: string[];
  type?: string;
  aspect?: string;
  target?: string;
  table?: string;
  scale?: number;
  magnitude?: number;
  duration?: string | number;
  application_period?: number;
  stack?: string;
  stack_limit?: number;
  flags?: string[];
}

const PV_MAP: Record<string, PvMode> = { EITHER: 'Any', PVE_ONLY: 'PvE', PVP_ONLY: 'PvP' };
const ASPECT_MAP: Record<string, Aspect> = {
  Absolute: 'Abs', Current: 'Cur', Resistance: 'Res', Strength: 'Str', Maximum: 'Max',
};

function mapAttribType(t?: string): AttribType {
  if (t === 'Duration') return 'Duration';
  if (t === 'Expression') return 'Expression';
  return 'Magnitude'; // Magnitude, Constant, undefined
}
function mapToWho(target?: string): ToWho {
  const t = target || '';
  if (t === 'Self') return 'Self';
  if (t.includes('Pets') || t === 'All') return 'All';
  if (t.includes('AnyAffected') || t === 'Target') return 'Target';
  return 'Unspecified';
}
function mapStacking(s?: string): Stacking {
  const known: Record<string, Stacking> = {
    Stack: 'Stack', Replace: 'Replace', Extend: 'Extend', Refresh: 'Refresh',
    RefreshToCount: 'RefreshToCount', Overlap: 'Overlap', Maximize: 'Maximize',
    Ignore: 'Ignore', Suppress: 'Suppress', Yes: 'Yes', No: 'No',
  };
  return (s && known[s]) || 'No';
}
export function parseDuration(d?: string | number): number {
  if (typeof d === 'number') return d;
  if (!d) return 0;
  const m = /-?\d+(\.\d+)?/.exec(d);
  return m ? parseFloat(m[0]) : 0;
}

/**
 * Group-level context an `ExportTemplate` inherits from its enclosing effect
 * group (or, in the converter's flattened-template world, from the `_group*`
 * tags the collectors stamp onto each template). `mapPvMode` converts the raw
 * export `is_pvp` string.
 */
export interface IngestContext {
  pvMode: PvMode;
  baseProbability: number;
  procsPerMinute?: number;
  requiresExpression?: string;
  /** e.g. 'OutOfCombat' for combat-gated (suppressible) templates. */
  specialCase?: string;
}

/** Raw export `is_pvp` string → PvMode ('EITHER'/undefined ⇒ 'Any'). */
export function mapPvMode(isPvp?: string): PvMode {
  return PV_MAP[isPvp || 'EITHER'] ?? 'Any';
}

/**
 * Ingest ONE export template into AtomicEffect records — one per mapped attrib.
 * Every attrib produces a record; an unbridged attrib yields an
 * `effectType:'Unmapped'` record (never dropped) so the caller can measure
 * coverage. Shared by the reference encoder below AND the converter's
 * production ingest (DSH6 — `templatesToAtoms` in convert-powerset.cjs), so
 * both sides encode a template identically by construction.
 */
export function ingestTemplate(t: ExportTemplate, ctx: IngestContext): AtomicEffect[] {
  const resistible = !(t.flags ?? []).includes('IgnoreResistance');
  const ignoreStrength = (t.flags ?? []).includes('IgnoreStrength');
  const aspect = ASPECT_MAP[t.aspect ?? ''] ?? 'Cur';
  const attribType = mapAttribType(t.type);
  const toWho = mapToWho(t.target);
  const stacking = mapStacking(t.stack);
  const out: AtomicEffect[] = [];
  for (const attrib of t.attribs ?? []) {
    const bridged = bridgeAttrib(attrib, t.aspect, t.table);
    out.push({
      effectType: bridged.effectType,
      subType: bridged.subType,
      pvMode: ctx.pvMode,
      resistible,
      toWho,
      attribType,
      aspect,
      modifierTable: t.table ?? '',
      scale: t.scale ?? 0,
      magnitude: t.magnitude ?? 0,
      duration: parseDuration(t.duration),
      applicationPeriod: t.application_period || undefined,
      stacking,
      stackCap: t.stack_limit && t.stack_limit > 0 ? t.stack_limit : undefined,
      baseProbability: ctx.baseProbability,
      procsPerMinute: ctx.procsPerMinute,
      ignoreStrength: ignoreStrength || undefined,
      specialCase: ctx.specialCase,
      requiresExpression: ctx.requiresExpression,
      sourceAttrib: attrib,
    });
  }
  return out;
}

/**
 * Ingest one export effect group's templates into AtomicEffect records — one per
 * (template × mapped attrib). This is the *reference* encoder that validates the
 * schema/key against real data; the converter's production ingest shares
 * `ingestTemplate` above.
 */
export function ingestExportGroup(group: ExportGroup): AtomicEffect[] {
  const ctx: IngestContext = {
    pvMode: mapPvMode(group.is_pvp),
    baseProbability: group.chance ?? 1,
    procsPerMinute: group.ppm && group.ppm > 0 ? group.ppm : undefined,
    requiresExpression: group.requires_expression || undefined,
  };
  return (group.templates ?? []).flatMap((t) => ingestTemplate(t, ctx));
}

/** Ingest a whole power JSON (`{ effects: ExportGroup[] }`). */
export function ingestExportPower(power: { effects?: ExportGroup[] }): AtomicEffect[] {
  return (power.effects ?? []).flatMap(ingestExportGroup);
}
