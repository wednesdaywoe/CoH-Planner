"""Parser for villaindef.bin (entity / villain / pet definitions).

The bin holds ~8,800 entity records covering all NPC critters, AVs, and the
pet entities the planner actually cares about (`Pets_*`, `MastermindPets_*`,
`IncarnatePets_*`, `Villain_Pets_*`).

The full record format is rich (gender, badge stats, conditions, costumes,
etc.). The planner only consumes a slice of it via
`scripts/convert-pet-entities.cjs`:

  - `name`
  - `commandable_pet`
  - `copy_creator_mods`
  - `defaults.character_class_name`
  - `defaults.powers` (the wildcard-expandable [cat, set, pow, level] list)
  - `levels[0].display_names[0]` (primary display name)

So this parser is intentionally minimal — it reads the leading scalar block,
the powers struct_array, and the levels struct_array sequentially, then
heuristically skips into the trailing scalar block to fish out
`copy_creator_mods`. Fields whose meaning isn't yet decoded are kept as raw
ints in `_unknown_*` for future expansion.

Both Parse7 (HC) and Parse6 (Rebirth) are supported. The struct shape is
identical — only string encoding (offset vs inline) differs.
"""

from __future__ import annotations

import struct
from dataclasses import dataclass, field

from ._reader import open_parse7, BinReader, Parse6BinReader


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class EntityPower:
    """One entry in `defaults.powers` — a wildcardable powerset reference."""
    power_category: str = ""
    power_set: str = ""
    power: str = ""
    level: int = 0


@dataclass
class EntityLevel:
    """One entry in `levels[]` — per-level display name + costume."""
    min_level: int = 0
    max_level: int = 0
    display_names: list[str] = field(default_factory=list)
    costumes: list[str] = field(default_factory=list)
    experience: int = 0


@dataclass
class EntityRecord:
    """A villaindef.bin entity record.

    Field names match the in-game C struct as decoded from the VillainDef
    sub-descriptor at 0x1408fa9f0 (see Ghidra `bin_serializer_report.txt`).
    The binary serialization order is: Name, Class, Gender, Description,
    GroupDescription, DisplayClassName, AIConfig, VillainGroup, Power,
    Level, Rank, Ally, Gang, Exclusion, IgnoreCombatMods, CopyCreatorMods,
    IgnoreReduction, CanZone, ... (full list in the report).
    """
    name: str = ""
    character_class_name: str = ""        # `Class` in the descriptor — raw "Class_Minion_Pets" form
    gender_raw: int = 0                   # `Gender` (u4 enum: 1=MALE, 2=NEUTER?, etc.)
    description: str = ""                 # `DisplayDescription` (P-hash or empty)
    group_description: str = ""           # `GroupDescription` (was previously misread as display_name)
    display_class_name: str = ""
    ai_config: str = ""
    villain_group_raw: int = 0            # `VillainGroup` (u4 enum)
    powers: list[EntityPower] = field(default_factory=list)
    levels: list[EntityLevel] = field(default_factory=list)
    rank_raw: int = 0                     # `Rank` (u4 enum: VR_PET=2, etc.) — comes AFTER Level in the binary
    copy_creator_mods: bool = False
    commandable_pet: int = 0              # 0 or 1
    can_zone: bool = False
    power_tags: list[str] = field(default_factory=list)
    # Source path the def was compiled from (e.g.
    # "DEFS/VILLAINS/PETS.VILLAIN") — keep it for debugging/provenance.
    source_file: str = ""

    # Backward-compat: the old API exposed `display_name`. Keep it as a
    # property pointing at the field we actually parse (group_description),
    # since that's what the previous code was reading at u4[4].
    @property
    def display_name(self) -> str:
        return self.group_description

    @display_name.setter
    def display_name(self, value: str) -> None:
        self.group_description = value


# ---------------------------------------------------------------------------
# Parse7 (HC) implementation
# ---------------------------------------------------------------------------

def _parse_power_sub(r: BinReader) -> EntityPower:
    """Each powers sub-record is 6 u4s = 24 bytes:
    cat / set / power / level / 2 trailing flags (almost always 0).
    """
    cat = r.read_string()
    pset = r.read_string()
    power = r.read_string()
    level = r.read_u4()
    r.read_u4()  # unknown trailing 1
    r.read_u4()  # unknown trailing 2
    return EntityPower(power_category=cat, power_set=pset, power=power, level=level)


def _parse_level_sub(r: BinReader) -> EntityLevel:
    """Levels sub-record (28 bytes for the common 1-display-name case):
    min, max, string_array display_names, string_array costumes, experience.
    """
    min_lvl = r.read_u4()
    max_lvl = r.read_u4()
    display_names = r.read_string_array()
    costumes = r.read_string_array()
    experience = r.read_u4() if r.remaining() >= 4 else 0
    return EntityLevel(
        min_level=min_lvl,
        max_level=max_lvl,
        display_names=display_names,
        costumes=costumes,
        experience=experience,
    )


def _parse_entity_parse7(r: BinReader, rec_len: int) -> EntityRecord:
    """Parse a single VillainDef record (Parse7).

    Field order matches the descriptor at 0x1408fa9f0 — see Ghidra's
    `bin_serializer_report.txt` for the authoritative layout.
    """
    rec = EntityRecord()
    rec.name = r.read_string()
    rec.character_class_name = r.read_string()
    rec.gender_raw = r.read_u4()                    # was mislabeled as rank_raw
    rec.description = r.read_string()
    rec.group_description = r.read_string()         # was mislabeled as display_name
    rec.display_class_name = r.read_string()
    rec.ai_config = r.read_string()
    rec.villain_group_raw = r.read_u4()             # was the "mystery u4" before powers
    rec.powers = r.read_struct_array(_parse_power_sub)
    rec.levels = r.read_struct_array(_parse_level_sub)
    _read_tail_flags(r, rec)
    return rec


def _read_tail_flags(r: BinReader, rec: EntityRecord) -> None:
    """The block after `levels`. The Ghidra descriptor at 0x1408fa9f0
    says serialization should resume with Rank → Ally → Gang → ... but
    in practice the bytes at this position start with a constant `10`
    (no valid rank/ally/gang interpretation) — so the binary inserts
    one or more fields here that aren't in the descriptor (probably
    HC-only additions like the chain_effect_array slot in powers.bin).

    Layout below comes from comparing Pets_Tornado vs Pets_LightningStorm
    (only differ in copy_creator_mods at +5 u4s) and
    MastermindPets_Assault_Bot (power_tags=4 entries, source MASTERMINDPETS):

        u4 ???                   (always 10 in samples)
        u4 ??? × 4               (zeros)
        u4 copy_creator_mods     (bool, masked to bit 0)
        u4 ???                   (zero)
        u4 ???                   (zero in pet samples, 1 in MM henchmen)
        s4 spawn_limit           (-1 default)
        s4 spawn_limit_mission   (-1 default)
        u4 ??? × 4               (zeros)
        f4 reward_scale          (1.0)
        string_array power_tags
        u4 ???                   (zero)
        string source_file       (e.g. DEFS/VILLAINS/PETS.VILLAIN)
    """
    try:
        r.read_u4()                          # unknown leading u4 (=10)
        for _ in range(4):
            r.read_u4()                      # zeros
        rec.copy_creator_mods = bool(r.read_u4() & 1)
        r.read_u4()                          # unknown (zero)
        _maybe_dynamic = r.read_u4()         # noqa: F841
        r.read_s4()                          # spawn_limit
        r.read_s4()                          # spawn_limit_mission
        for _ in range(4):
            r.read_u4()                      # zeros
        r.read_f4()                          # reward_scale
        rec.power_tags = r.read_string_array()
        if r.remaining() >= 4:
            r.read_u4()                      # delim
        if r.remaining() >= 4:
            rec.source_file = r.read_string()
    except ValueError:
        pass

    # commandable_pet / can_zone aren't reliably positionable in this
    # record yet, so infer them from the character class. Rebirth Parse6
    # names henchman tiers `Class_Boss_Henchman` etc.; HC Parse7 swaps
    # the parts to `Class_Henchman_Boss`. Match either ordering.
    cls = rec.character_class_name.lower()
    if "henchman" in cls:
        rec.commandable_pet = 1
        rec.can_zone = True


def parse_entities(bin_path_or_data) -> list[EntityRecord]:
    """Parse villaindef.bin into EntityRecord list.

    Accepts a file path (str/Path) or raw bytes.
    """
    r = open_parse7(bin_path_or_data)
    if isinstance(r, Parse6BinReader):
        return _parse_entities_parse6(r)

    r.read_u4()  # block_size
    count = r.read_u4()

    records = []
    for _ in range(count):
        rec_len = r.read_u4()
        sub = r.sub_reader(rec_len)
        records.append(_parse_entity_parse7(sub, rec_len))
        r.skip(rec_len)
    return records


# ---------------------------------------------------------------------------
# Parse6 (Rebirth) implementation
# ---------------------------------------------------------------------------

def _parse_entity_parse6(r: Parse6BinReader, rec_len: int) -> EntityRecord:
    """Parse6 record layout mirrors Parse7's, but every string is an inline
    pascal-pad rather than a u4 strtab offset. The struct_array shape and
    field order are identical for the fields we currently consume — name,
    class, ai_config, powers — and we stop there.

    What's NOT yet decoded for Parse6:
      - The levels[] struct_array. Between powers and levels there's a
        4 × u4 block (`54, 52, 1, 1` consistent across every record I
        sampled), and the level sub-record itself appears to be inline
        rather than length-prefixed. Until that's fully decoded the
        downstream display-name comes from the entity's own `name`
        (`Pets_Tornado` → "Tornado"), which is what
        convert-pet-entities.cjs already uses as its fallback.
      - copy_creator_mods / power_tags / source_file. Same blocker —
        they live past the unparsed levels block. Keeping defaults
        (False / [] / "") means Rebirth pets render with HC-style
        damage scaling, which is wrong for the small subset of pets
        that actually copy creator mods (Storm's Lightning Storm,
        some incarnate pets) but right for the rest. Worth revisiting
        when more bytes are reverse-engineered.
    """
    rec = EntityRecord()
    rec.name = r.read_string()
    rec.character_class_name = r.read_string()
    rec.gender_raw = r.read_u4()
    rec.description = r.read_string()
    rec.group_description = r.read_string()
    rec.display_class_name = r.read_string()
    rec.ai_config = r.read_string()
    rec.villain_group_raw = r.read_u4()
    try:
        rec.powers = r.read_struct_array(_parse_power_sub_p6)
    except ValueError:
        # If a record's power array fails to parse, leave it empty rather
        # than aborting the whole parse run.
        rec.powers = []

    # commandable_pet / can_zone heuristic from class name (same rule as
    # Parse7's _read_tail_flags fallback).
    cls = rec.character_class_name.lower()
    # Rebirth Parse6 names the henchman tiers as `Class_Boss_Henchman`,
    # `Class_Lt_Henchman`, `Class_Minion_Henchman`; HC Parse7 swaps the
    # parts to `Class_Henchman_Boss` etc. Match either ordering.
    if "henchman" in cls:
        rec.commandable_pet = 1
        rec.can_zone = True
    return rec


def _parse_power_sub_p6(r: Parse6BinReader) -> EntityPower:
    cat = r.read_string()
    pset = r.read_string()
    power = r.read_string()
    level = r.read_u4()
    # The two trailing u4s present in Parse7 may not exist in Parse6 — read
    # what's left of the sub-record so we don't overrun.
    while r.remaining() >= 4:
        r.read_u4()
    return EntityPower(power_category=cat, power_set=pset, power=power, level=level)


def _parse_level_sub_p6(r: Parse6BinReader) -> EntityLevel:
    min_lvl = r.read_u4()
    max_lvl = r.read_u4()
    display_names = r.read_string_array()
    costumes = r.read_string_array()
    experience = r.read_u4() if r.remaining() >= 4 else 0
    return EntityLevel(
        min_level=min_lvl,
        max_level=max_lvl,
        display_names=display_names,
        costumes=costumes,
        experience=experience,
    )


def _parse_entities_parse6(r: Parse6BinReader) -> list[EntityRecord]:
    r.read_u4()  # block_size
    count = r.read_u4()

    records = []
    for _ in range(count):
        rec_len = r.read_u4()
        sub = r.sub_reader(rec_len)
        records.append(_parse_entity_parse6(sub, rec_len))
        r.skip(rec_len)
    return records
