"""Data structures for parsed binary records."""

from dataclasses import dataclass, field
from ._enums import EFFECT_AREA, POWER_TYPE, TARGET_TYPE_CLASSIC, TARGET_TYPE_HC


# ============================================
# EFFECT TEMPLATE DATA STRUCTURES
# ============================================

@dataclass
class EffectTemplate:
    """A single attrib_mod template within an effect group."""
    attribs: list[str] = field(default_factory=list)
    type: str = ""           # "Magnitude", "Duration", "Expression", etc.
    application_type: str = ""  # "OnTick", "OnActivate", etc.
    aspect: str = ""         # "Current", "Resistance", "Strength", "Absolute", etc.
    target: str = ""         # "Self", "AnyAffected", "Marker", etc.
    # Marker-targeted mods only: {"marker_names": [...], "marker_count": [...]}
    # (CoD2's target_info shape). None for every other target.
    target_info: dict | None = None
    table: str = ""          # AT table name (e.g., "Melee_Ones", "Melee_Damage")
    scale: float = 0.0
    duration: float = 0.0    # seconds
    magnitude: float = 0.0
    delay: float = 0.0
    duration_expression: str = ""
    magnitude_expression: str = ""
    application_period: float = 0.0
    tick_chance: float = 1.0
    tick_mag_multiplier: float = 1.0
    tick_mag_additive: float = 0.0
    jit_requires: str = ""
    caster_stack: str = ""   # "Individual" or "Collective"
    stack: str = ""          # "Stack", "Replace", "Suppress", etc.
    stack_limit: int = 0
    # Legacy resolved-string slot (still populated by the VillainDef template
    # path as a numeric string). The Parse7 power path leaves it None and
    # fills `stack_key_id` instead — the export layer resolves the ID to its
    # real name (TravelBuff, StealthToggle, ...) via parse_stack_key_table.
    stack_key: str | None = None
    # Serialized index into the global StackKeys registry (attrib_names.bin).
    # 0 = no key. NOT a string offset — the old read_string() decode yielded
    # garbage suffixes of the string table's first entry ('ictusFX' etc.).
    stack_key_id: int = 0
    cancel_events: list[str] = field(default_factory=list)
    boost_mod_allowed: str = ""
    flags: list[str] = field(default_factory=list)
    # Raw first flags word. Authored keywords are decoded into `flags` (see
    # _FLAG_BITS in _powers.py); bits 8-11 additionally carry the baked-in
    # effective Resist/CombatMod {Magnitude,Duration} mode, which is left
    # raw-only because it is a compiler default, not an authored keyword.
    flags_raw: int = 0
    # Raw SECOND flags word (the u4 immediately after flags_raw). Its bits are
    # attrib-contextual (DeepSleep on Sleep, RevokeAll on Revoke_Power,
    # CopyBoosts/PseudoPet/etc. on entity-creating attribs — see
    # _FLAG2_BITS_BY_ATTRIB in _powers.py); known classes decode into `flags`,
    # everything else stays raw here. 0 for Parse6.
    flags2_raw: int = 0
    boost_mod_allowed_id: int = 0
    mode_name: str | None = None
    suppress_events: list[dict] = field(default_factory=list)
    required_events: list[dict] = field(default_factory=list)
    # Authored `Messages { ... }` block: five message-store keys
    # (display_attacker_hit / display_victim_hit / display_float /
    # display_attrib_defense_float / display_info), resolved to text at
    # export. None when the template has no Messages record.
    messages: dict | None = None
    # Per-template FX: {continuing_bits, continuing_fx, conditional_bits,
    # conditional_fx}. Bits are raw FX-bit indices (no name oracle yet).
    fx: dict | None = None
    params: dict | None = None


@dataclass
class EffectGroup:
    """A group of effect templates with shared chance/flags/requires.

    Effect groups can nest — `child_groups` holds inner Effect blocks (e.g.
    a Chance/Requires-gated sub-effect inside an outer Effect), each with its
    own templates and possibly its own children.
    """
    chance: float = 1.0
    ppm: float = 0.0
    delay: float = 0.0
    radius_inner: float = -1.0
    radius_outer: float = -1.0
    requires_expression: str = ""
    flags: list[str] = field(default_factory=list)
    is_pvp: str = "EITHER"   # "EITHER", "PVE_ONLY", "PVP_ONLY"
    eval_flags: int = 0
    # Effect `Tag`(s) — the named bucket the engine's global chance-mod system
    # flips on/off (Dual Pistols ammo: an attack's ColdDamage/ToxicDamage/
    # FireDamage tag groups carry chance 0 until the matching ammo enables them).
    # Captured so the converter can attribute tag-gated effects to their mode
    # (e.g. ammo) instead of folding them into base. Usually 0 or 1 entry.
    tags: list[str] = field(default_factory=list)
    templates: list[EffectTemplate] = field(default_factory=list)
    child_groups: list["EffectGroup"] = field(default_factory=list)


# ============================================
# POWER RECORD
# ============================================

@dataclass
class PowerRecord:
    full_name: str
    name: str
    source_name: str
    display_name: str
    display_help: str
    short_help: str
    icon: str
    power_type: int
    num_allowed: int
    auto_issue: bool
    auto_issue_keeps_level: bool
    attack_types: list[int]
    requires: str
    activate_requires: str
    target_requires: str
    effect_area: int
    max_targets_hit: int
    range: float
    range_secondary: float
    radius: float
    arc: float
    time_to_activate: float
    recharge_time: float
    activate_period: float
    endurance_cost: float
    interrupt_time: float
    accuracy: float
    target_type: int
    target_type_secondary: int
    target_visibility: int
    targets_autohit: list[int]
    targets_affected: list[int]
    boosts_allowed: list[str]
    allowed_boostset_cats: list[str]
    cast_through: list[str]
    toggle_ignore: list[str]  # mez states that don't detoggle this power
    # Slot-requires expression. Empty for most powers. Boost (IO piece)
    # records carry per-piece "BoostsSlotted>X <= 0" constraints here when
    # the piece is unique within a slot pool — this is how the game enforces
    # purple-set / ATO / proc uniqueness. The Rebirth IO-set extractor
    # reads this to determine the per-piece `unique` flag instead of
    # guessing from `is_proc`.
    slot_requires: str = ""

    # TimeToRoot (Parse7 field 48b) — animation-lock/root duration. Usually
    # equals time_to_activate; differs on ~50 HC powers (Stalker Assassin's
    # Strike quick forms, self-teleports). 0.0 when the .powers def omits it,
    # and always 0.0 on Parse6 datasets (the field isn't serialized there).
    time_to_root: float = 0.0

    # `ChainEff` (space-joined RPN/infix token list) — per-jump chain-continue
    # chance (e.g. `1 0.20 @ChainJump 1 - * - 0.20 1 minmax`). Previously read
    # and dropped; VERIFIED against Veracity/Parse6 (`@ChainJump`/`minmax`).
    chain_eff_expression: str = ""

    # ChainTarget — next-target selection weighting for the Electrical Affinity
    # circuits (Rejuvenating/Energizing/Empowering/Insulating_Circuit, Chain_Lightning,
    # …): `… kHitPoints% target> - … maintarget> … prevdistance / +`. Lives in
    # Parse7 field 43b (a u4_array of string-table offsets the parser previously
    # read and discarded). VERIFIED 2026-07-01 against the HC `.powers` oracle — the
    # circuits match exactly (55 powers). Empty on non-chain powers and on Parse6
    # (which has no field 43b string content). Sparse → exported only when present.
    chain_target_expression: str = ""

    # MaxTargetsExpr — RPN target-cap (Parse7 field 38, HC-only), e.g. a Tanker
    # Gauntlet attack's `16 kDisable_GauntletTargetCap … -`, or the circuits'
    # `4 Redirects.… source.ownPowerNum? 3 * +`. VERIFIED 2026-07-01 against HC
    # (GauntletTargetCap resolves here, 59 powers). Empty on Parse6 (no field 38).
    # Sparse → exported only when present.
    max_targets_expression: str = ""

    # CastableAfterDeath (i24 eDeathCastableSetting, third word of the
    # cast_flags block; all layouts). Raw enum value — the export maps it via
    # CASTABLE_AFTER_DEATH; 0 = AliveOnly (default, not emitted).
    castable_after_death: int = 0

    # ChainDelay (i24 field 41; all layouts) — per-jump delay in seconds on
    # chain powers (Tesla_Cage 0.5, Chain_Lightning 0.3). 0.0 on non-chain
    # powers.
    chain_delay: float = 0.0

    # OverCap block (HC-added fields 38b-d, right after MaxTargetsExpr): when a
    # spherical AoE catches more than `over_cap_trigger` targets, per-target
    # effect scale is multiplied by `over_cap_multiplier` (exponentially per
    # excess target when `over_cap_exponential`). Defaults (0 / 1.0 / False)
    # mean no over-cap behavior; HC-layout only.
    over_cap_trigger: int = 0
    over_cap_multiplier: float = 1.0
    over_cap_exponential: bool = False

    # MaxToggleTime (HC-added field 52b) — auto-shutoff seconds for
    # time-limited toggles (Hibernate 30, Telekinesis 20). 0.0 = no limit;
    # HC-layout only.
    max_toggle_time: float = 0.0

    # MaxBoosts (i24 tail field) — enhancement slot cap; parse-table default 6,
    # authored 0 on unslottable powers. Currently decoded on the HC layout only
    # (the Parse6 post-effects tail is still unparsed).
    max_boosts: int = 6

    # ProcAllowed (HC-added tail field, raw enum) — 0 = procs allowed
    # (default); the only authored nonzero value is `ProcAllowed kNone` = 1
    # (proc-ineligible powers). HC-layout only.
    proc_allowed_raw: int = 0

    # StrengthsDisallowed (i24 tail field) — attrib offsets (ATTRIB_NAME
    # raw//4 lookup) whose outside buffs/enhancement strength this power
    # ignores (e.g. Punch: Range). Present in the client bin. Currently
    # decoded on the HC layout only.
    strengths_disallowed: list[int] = field(default_factory=list)

    # Parse7/HC diagnostic scratch — field 43 is an FX / ChainIntoPower array, NOT
    # ChainTarget (that's 43b → chain_target_expression above). Kept for probes,
    # never emitted to the export (leading underscore + repr=False). See HOMECOMING_PARSER.
    _field43_str: str = field(default="", repr=False)

    # Effect data — the binary stores two parallel struct_arrays:
    # - `Effect` blocks (main effects) go into `effects`
    # - `ActivationEffect` blocks (self-buff/redirect sources for toggles &
    #   click-with-redirect powers) go into `activation_effects`
    # The converter treats them differently (see collectRedirectTemplates /
    # activation_effects filter logic), so they stay split here instead of
    # being merged.
    effects: list[EffectGroup] = field(default_factory=list)
    activation_effects: list[EffectGroup] = field(default_factory=list)

    # Top-level `Redirect` blocks — the .def grammar allows a power to declare
    # one or more Redirect { Power X Requires Y } entries at the record level
    # (dual-mode powers like Energy_Transfer, sniper attacks with slow/fast
    # variants, etc.). Each element: {name, condition_expression, show_in_info}.
    redirects: list[dict] = field(default_factory=list)

    # Which target-type enum layout this record's raw target ints index into:
    # False = Homecoming's (DeadAny/DeadOrAliveAny inserted at 22), True = the
    # i25 layout kept by Rebirth/Thunderspy/Veracity. See TARGET_TYPE_HC /
    # TARGET_TYPE_CLASSIC in _enums.py.
    classic_target_enum: bool = False

    # Power-level mode gates (`ModesRequired` / `ModesDisallowed` /
    # `ModesSuspended` in the .def) — u4 arrays of mode indices into the same
    # global mode registry that `Set_Mode` magnitudes index (attrib_names.bin's
    # ppchMode sub-array). A power with `modes_required=[45]` only fires while
    # the caster is in mode 45 (Domination); `modes_disallowed` blocks it in
    # those modes; `modes_suspended` auto-detoggles it. Stored raw here (the
    # per-server index) and resolved to names at export via the mode table —
    # same mechanism as `EffectTemplate.mode_name`. Empty on ~all powers.
    modes_required: list[int] = field(default_factory=list)
    modes_disallowed: list[int] = field(default_factory=list)
    modes_suspended: list[int] = field(default_factory=list)

    # `FreeBoostSlotsOnPower` in the .def (powers_load.c parse table, the
    # V23 field between ModesDisallowed and AIGroups) — a per-power override
    # of the global free-slot schedule (BasePower.pFreeBoostSlotsOnPower,
    # PowerInfo.c). Entries are 0-based levels-OWNED offsets: a slot opens
    # when (character level − level bought) reaches the entry, so Rebirth
    # Health's [0, 6, 14] bought at level 2 = the base slot plus bonus slots
    # at levels 8 and 16. Parse6/Rebirth carries it (sole non-empty carriers:
    # Health/Stamina); HC's authored defs never use the token and Thunderspy's
    # layout has no slot for it.
    free_boost_slots_on_power: list[int] = field(default_factory=list)

    # `GroupMembership` in the .def (field 75, HC; field 74 tail, Parse6) — a
    # u4_array, read but previously discarded. Powers sharing a non-empty
    # group id are presumed mutually exclusive (e.g. Dual Pistols' ammo
    # toggles, Bio Armor's Adaptation stances) — a candidate native data
    # source for what `src/data/stance-groups.ts`'s hand-curated
    # `STANCE_GROUPS` approximates by power-name heuristic. Whether these
    # indices resolve through the same mode registry as modes_required/etc.
    # is UNVERIFIED — resolve and cross-check against known stance groups
    # before trusting the resolved names.
    exclusion_groups: list[int] = field(default_factory=list)

    # Fields kept from before for backward compat
    @property
    def power_type_name(self) -> str:
        return POWER_TYPE.get(self.power_type, f"Unknown({self.power_type})")

    @property
    def effect_area_name(self) -> str:
        return EFFECT_AREA.get(self.effect_area, f"Unknown({self.effect_area})")

    @property
    def target_type_table(self) -> dict[int, str]:
        return TARGET_TYPE_CLASSIC if self.classic_target_enum else TARGET_TYPE_HC

    @property
    def target_type_name(self) -> str:
        return self.target_type_table.get(self.target_type, f"Unknown({self.target_type})")

    @property
    def category(self) -> str:
        return self.full_name.split(".")[0] if "." in self.full_name else ""

    @property
    def powerset(self) -> str:
        parts = self.full_name.split(".")
        return parts[1] if len(parts) > 1 else ""

    @property
    def power_name(self) -> str:
        return self.full_name.rsplit(".", 1)[-1]


@dataclass
class PowersetRecord:
    source: str
    key: str
    display_name: str
    help: str
    short_help: str
    icon: str
    powers: list = field(default_factory=list)
    available: list = field(default_factory=list)


@dataclass
class PowercatRecord:
    source: str
    key: str
    display_name: str
    help: str
    short_help: str
    powersets: list = field(default_factory=list)


@dataclass
class NamedTable:
    name: str
    values: list[float] = field(default_factory=list)


@dataclass
class ClassRecord:
    name: str
    display_name: str
    icon: str
    primary_category: str
    secondary_category: str
    pool_category: str
    display_help: str = ""
    display_short_help: str = ""
    epic_pool_category: str = ""
    allowed_origins: list[str] = field(default_factory=list)
    special_restrictions: list[str] = field(default_factory=list)
    store_requires: str = ""
    locked_tooltip: str = ""
    product_code: str = ""
    reduction_class: str = ""
    reduce_as_archvillain: bool = False
    # Levels at which levelling grants a full respec instead of the normal
    # power/slot picks — [24] on the Arachnos EATs (the branch-choice respec),
    # empty elsewhere.
    level_up_respecs: list[int] = field(default_factory=list)
    # Homecoming only: the VillainRank enum word HC added to the class prefix
    # (VR_NONE=0 for players, VR_SMALL=1 .. VR_DESTRUCTIBLE=11 for NPC
    # classes). None on datasets whose schema lacks the field.
    villain_rank: int | None = None
    # Character-select additions all three forks data-drove from i24's
    # hardcoded client tables (uiArchetype.c): screenshot texture names, the
    # six stat bars (-1 = the Kheldian "?" bars), the playstyle-filter
    # bitmask, and the class-mechanic tooltip key ("RageTip", ...).
    archetype_shots: list[str] = field(default_factory=list)
    creation_stats: list[int] = field(default_factory=list)
    playstyle_flags: int = 0
    mechanic_tip: str = ""
    # Thunderspy/Rebirth only: the mechanic-bar id preceding MechanicTip
    # (1=PrimalEnergy, 2=Rage, 3=Domination) and the unidentified word after
    # it (non-zero only on locked epic ATs). None where the schema lacks them.
    mechanic_bar_raw: int | None = None
    mechanic_gap_raw: int | None = None
    connect_hp_and_status: bool = False
    defiant_scale: float = 1.0
    # Homecoming only: the HC-added float after DefiantScale (per-class,
    # 0.1-1.0; meaning unknown — kept raw, never interpreted).
    tail_scalar_raw: float | None = None
    # Any word read from an assert-zero slot that was not zero, as
    # (slot label, value) pairs — surfaced instead of silently dropped.
    extra_raw: list[tuple[str, int]] = field(default_factory=list)
    named_tables: dict[str, list[float]] = field(default_factory=dict)
    # Per-archetype attribute curves/caps derived from the class struct's
    # CharacterAttributes arrays (NOT the named modifier tables above). These
    # feed the planner's archetype definitions (HP curve, HP cap, resistance
    # cap). `attribs` keys: "hit_points" / "hp_cap" (per-level float lists,
    # levels 1-50) and "resistance_cap" (scalar). Empty when the format/record
    # doesn't expose them (e.g. pet classes, unrecognized layout).
    attribs: dict[str, object] = field(default_factory=dict)


@dataclass
class SalvageRecord:
    """One salvage item from salvage.bin (invention / incarnate / base / reward)."""
    name: str            # internal name, e.g. "S_ArcaneCantrip"
    display_name: str    # resolved English name, e.g. "Arcane Cantrip"
    icon: str            # e.g. "salvage_ArcaneCantrip.tga"
    rarity: str          # "common" | "uncommon" | "rare" | "very-rare"
    category: str        # "invention" | "base" | "reward" | "incarnate" | "unknown"


@dataclass
class DimReturnTier:
    """One ED tier boundary: raw enhancement beyond `start` counts at
    `handicap` effectiveness (the game's DimReturn {fStart, fHandicap,
    fBasis} triple; fBasis is 0 on every observed record but is preserved
    because the engine reads it)."""
    start: float
    handicap: float
    basis: float


@dataclass
class AttribDimReturns:
    """One AttribDimReturnSet: the ED tier curve applied to a set of
    character attributes. `is_default` marks the catch-all curve used for
    every attribute no other record claims (Schedule A)."""
    is_default: bool
    attribs: list[str] = field(default_factory=list)       # resolved names
    attribs_raw: list[int] = field(default_factory=list)   # byte offsets as stored
    tiers: list[DimReturnTier] = field(default_factory=list)


@dataclass
class DimReturnSetRecord:
    """One DimReturnSet from dim_returns.bin: ED curves keyed by the
    enhancement (boost) types they govern. `is_default` marks the set the
    game applies when no boost-type match exists."""
    is_default: bool
    boost_types: list[str] = field(default_factory=list)     # resolved names
    boost_types_raw: list[int] = field(default_factory=list)  # enum values as stored
    returns: list[AttribDimReturns] = field(default_factory=list)


@dataclass
class LevelingSchedule:
    """The leveling grant schedule from schedules.bin (the game's `Schedule`
    struct, power_system.h). Every list is a sorted array of 0-based security
    levels; the count of entries <= a level is how many of that thing the
    character has at that level (`CountForLevel`, power_system.c). Field names
    mirror the parse-table tokens (`ParseSchedule`), with `Col` expanded."""
    free_boost_slots_on_power: list[int]
    pool_power_set: list[int]
    epic_power_set: list[int]
    power: list[int]
    assignable_boost: list[int]
    inspiration_column: list[int]
    inspiration_row: list[int]


@dataclass
class ExemplarHandicapCurves:
    """The exemplar magnitude clamp curves from exemplar_handicaps.bin
    (`ExemplarHandicaps`, boost.h), each indexed by 0-based combat level.
    `boost_HandicapExemplar` (boost.c) applies them to an enhancement
    magnitude when exemplared: PreClamp cap, then if magnitude >= the Limits
    entry, scale by handicaps[combat_level] / handicaps[experience_level],
    then PostClamp cap. `handicaps` is the parse-table token `Weights`
    (struct field pfHandicaps)."""
    limits: list[float]
    handicaps: list[float]
    pre_clamp: list[float]
    post_clamp: list[float]
