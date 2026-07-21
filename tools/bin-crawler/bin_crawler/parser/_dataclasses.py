"""Data structures for parsed binary records."""

from dataclasses import dataclass, field
from ._enums import EFFECT_AREA, POWER_TYPE, TARGET_TYPE


# ============================================
# EFFECT TEMPLATE DATA STRUCTURES
# ============================================

@dataclass
class EffectTemplate:
    """A single attrib_mod template within an effect group."""
    attribs: list[str] = field(default_factory=list)
    type: str = ""           # "Magnitude", "Duration", "Expression", etc.
    application_type: str = ""  # "OnTick", "Immediate", etc.
    aspect: str = ""         # "Current", "Resistance", "Strength", "Absolute", etc.
    target: str = ""         # "Self", "AnyAffected", etc.
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
    caster_stack: str = ""   # "Individual", "Unlimited", etc.
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
    # Raw flag bitmask from the binary (bit meanings not yet decoded — see
    # the AttribMod tail comment in _powers.py). Stored alongside `flags`
    # so downstream consumers can pattern-match common values like 0x420
    # (IgnoreResistance) and 0x430 (IgnoreStrength + IgnoreResistance)
    # without waiting for the full bit-to-name table.
    flags_raw: int = 0
    # Raw SECOND flags word (the u4 immediately after flags_raw). The binary
    # stores AttribMod flags across two consecutive u4s; `flags_raw` is the
    # first, this is the second. Validated bits: CopyBoosts=0x4, CopyCreatorMods=0x8,
    # PseudoPet=0x20 (see _FLAG2_BITS in _powers.py). Stored raw so the
    # remaining bits can be decoded later without re-export. 0 for Parse6.
    flags2_raw: int = 0
    boost_mod_allowed_id: int = 0
    mode_name: str | None = None
    suppress_events: list[dict] = field(default_factory=list)
    required_events: list[str] = field(default_factory=list)
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
    def target_type_name(self) -> str:
        return TARGET_TYPE.get(self.target_type, f"Unknown({self.target_type})")

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
