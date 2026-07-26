"""Parser for classes.bin and villain_classes.bin (archetype definitions).

Every record is read SEQUENTIALLY, field for field, against the serialized
`ParseCharacterClass` layout — no anchor scans, no fixed byte-deltas. The walk
is byte-accounted: a record that does not consume exactly its declared length
raises, so a schema change in any dataset fails loudly instead of shipping a
misread (the WS8 mandate; the old fixed-delta layout drifted silently on
Thunderspy and exported a wrong-row HP cap for Rebirth Kheldians).

Layout oracle: the released i24 server source (`Common/entity/classes.h`,
`odasm/coh-server-original`) gives the base field order. All three datasets
extend it the same way — the archetype-select stat bars and screenshot names
that i24 hardcoded in the client (`uiArchetype.c` `aStats`/`sImages`, byte-
identical values) plus a class-mechanic tip string — but splice the additions
in differently, and Homecoming also reshapes the i24 prefix:

Prefix after DisplayHelp:
  i24 / Thunderspy / Rebirth:
    AllowedOrigins[] SpecialRestrictions[] StoreRequires LockedTooltip
    ProductCode ReductionClass ReduceAsArchvillain(u4) LevelUpRespecs(u4[])
  Homecoming (freemium fields deleted, one field added):
    VillainRank(u4)  — VR_NONE(0) for players, VR_SMALL(1)..VR_DESTRUCTIBLE(11)
                       for NPC classes (i24 `VillainDef.h` enum, exact match)
    SpecialRestrictions[] <always-0 word> ReductionClass
    ReduceAsArchvillain(u4) LevelUpRespecs(u4[])

Then (all datasets): DisplayShortHelp, Icon.
  Homecoming inserts here: ArchetypeShots[] (string array), then the four
  categories, then MechanicTip (string, e.g. "RageTip"), CreationStats
  (counted int array, the six AT-select bars; empty for NPCs), and a
  playstyle-filter bitmask word. Thunderspy/Rebirth: just the four categories
  (their copies of these additions live in the record tail instead).

Attrib block (all datasets, fully self-describing):
  10 struct-arrays of CharacterAttributes (AttribMin, AttribBase, StrengthMin,
  ResistanceMin, DiminStr/Cur/Res × In/Out) — each element a flat float run
  (HC 117 floats = 468 B, Thunderspy/Rebirth 116 = 464 B, matching each
  dataset's sizeof(CharacterAttributes) from the special-attrib bases);
  4 struct-arrays of CharacterAttributesTable (AttribMaxTable, AttribMaxMax-
  Table, StrengthMaxTable, ResistanceMaxTable) — each element a run of
  count-prefixed f32 arrays, one per attrib in table order (`ParseCharacter-
  AttributesTable`: DamageType00-19, HitPoints, ... — NB the table order
  differs from the struct order: no Absorb slot after HitPoints, Defense
  serialized twice, Absorb last);
  ModTable (the named per-level modifier tables).

Tail after ModTable:
  Homecoming: ConnectHPAndStatus(u4) DefiantScale(f4) + one HC-added float
    (varies per class, meaning unknown — captured raw).
  Thunderspy/Rebirth: ConnectHPAndStatus(u4), DefiantHitPointsAttrib raw
    (1 word; 2 on Thunderspy — its 64-bit binner serializes the size_t as 8
    bytes), DefiantScale(f4), then the fork copy of the shared additions:
    mechanic-bar id (1=PrimalEnergy 2=Rage 3=Domination), MechanicTip,
    one unidentified word (non-zero only on locked epic ATs — captured raw),
    six CreationStats ints (−1 = the "?" bars on Kheldians), three
    ArchetypeShots strings, the playstyle bitmask, and five words observed
    always zero (the four `_Final*_` shared-memory pointer blobs of the i24
    tail plus one more) — captured raw when non-zero.

Verified 2026-07-21: all 191 records across the six bins (3 datasets ×
classes/villain_classes) walk byte-clean, and the exported attribs/named
tables reproduce the committed game-verified values for every player
archetype on every dataset. Known deliberate diffs vs the old heuristics are
documented in DATA-GAP-REGISTER.md (CLASSES-1/WS8): the old cap-delta read
the AttribMaxMax DamageType00 row instead of HitPoints (wrong for Rebirth
Kheldians), and every old NPC-class attrib/header misread is replaced by the
structural values.
"""

from ._reader import open_parse7, BinReader, Parse6BinReader
from ._dataclasses import ClassRecord

# Attrib indices used by the export. Table order (ParseCharacterAttributes-
# Table) puts HitPoints right after the 20 damage types on every dataset;
# the scalar struct order (ParseCharacterAttributes) has ThreatLevel at 61 on
# every dataset (the fork layout divergences — Rebirth's Accuracy band,
# Thunderspy's recharge band, HC's extra slot — all sit past the indices used
# here). Verified value-for-value against the committed game-verified curves
# for all 45 player archetypes.
_IDX_TABLE_HITPOINTS = 20
_IDX_TABLE_DAMAGE = 0
_IDX_SCALAR_THREAT = 61
_PLAYER_LEVELS = 50             # planner uses levels 1-50


def _read_attrib_struct_array(r) -> list[list[float]]:
    """Struct-array of CharacterAttributes: u4 count, per element u4 byte size
    + a flat float run. The element size is the dataset's
    sizeof(CharacterAttributes); trusting it keeps the read layout-agnostic."""
    count = r.read_u4()
    out = []
    for _ in range(count):
        elem_size = r.read_u4()
        if elem_size % 4 != 0:
            raise ValueError(f"CharacterAttributes element size {elem_size} "
                             f"is not float-aligned")
        out.append([r.read_f4() for _ in range(elem_size // 4)])
    return out


def _read_attrib_table_array(r) -> list[list[list[float]]]:
    """Struct-array of CharacterAttributesTable: per element, a run of
    count-prefixed f32 arrays (one per attrib, table order) filling exactly
    the element's declared byte length."""
    count = r.read_u4()
    out = []
    for _ in range(count):
        elem_size = r.read_u4()
        end = r.pos + elem_size
        arrays = []
        while r.pos < end:
            value_count = r.read_u4()
            if r.pos + value_count * 4 > end:
                raise ValueError(
                    f"CharacterAttributesTable f32 array (count {value_count}) "
                    f"overruns its element")
            arrays.append([r.read_f4() for _ in range(value_count)])
        out.append(arrays)
    return out


def _read_named_tables(r) -> dict[str, list[float]]:
    """ModTable: struct-array of NamedTable (name + per-level float values)."""
    count = r.read_u4()
    tables = {}
    for _ in range(count):
        elem_size = r.read_u4()
        end = r.pos + elem_size
        table_name = r.read_string()
        value_count = r.read_u4()
        tables[table_name] = [r.read_f4() for _ in range(value_count)]
        if r.pos != end:
            raise ValueError(f"named table {table_name!r} consumed "
                             f"{r.pos - (end - elem_size)} of {elem_size} bytes")
    return tables


def _extract_attribs(attrib_base, attrib_max, attrib_max_max,
                     strength_max, resistance_max) -> dict:
    """The planner's five attrib values, addressed structurally.

    hit_points / hp_cap: the HitPoints per-level rows of AttribMaxTable /
    AttribMaxMaxTable. NB hp_cap must come from the HitPoints row, not the
    (usually identical) damage-type rows — Rebirth raised only the real
    HitPoints row for Kheldians, which the old fixed-delta read missed.
    resistance_cap: ResistanceMaxTable DamageType00 (flat per-level run).
    base_threat: AttribBase ThreatLevel scalar.
    damage_cap: StrengthMaxTable DamageType00 at level 50.
    """
    out: dict[str, object] = {}
    if attrib_max and len(attrib_max[0]) > _IDX_TABLE_HITPOINTS:
        hp = attrib_max[0][_IDX_TABLE_HITPOINTS]
        if len(hp) >= _PLAYER_LEVELS:
            out["hit_points"] = hp[:_PLAYER_LEVELS]
    if attrib_max_max and len(attrib_max_max[0]) > _IDX_TABLE_HITPOINTS:
        cap = attrib_max_max[0][_IDX_TABLE_HITPOINTS]
        if len(cap) >= _PLAYER_LEVELS:
            out["hp_cap"] = cap[:_PLAYER_LEVELS]
    if resistance_max and resistance_max[0] and resistance_max[0][_IDX_TABLE_DAMAGE]:
        out["resistance_cap"] = resistance_max[0][_IDX_TABLE_DAMAGE][0]
    if attrib_base and len(attrib_base[0]) > _IDX_SCALAR_THREAT:
        threat = attrib_base[0][_IDX_SCALAR_THREAT]
        if threat != 0.0:
            out["base_threat"] = threat
    if strength_max and strength_max[0]:
        dmg = strength_max[0][_IDX_TABLE_DAMAGE]
        if len(dmg) >= _PLAYER_LEVELS:
            out["damage_cap"] = dmg[_PLAYER_LEVELS - 1]
    return out


def _to_signed(word: int) -> int:
    return word - 0x100000000 if word >= 0x80000000 else word


def _read_class_record(r, flavor: str) -> ClassRecord:
    rec: dict = {}
    rec["name"] = r.read_string()
    rec["display_name"] = r.read_string()
    rec["display_help"] = r.read_string()

    if flavor == "hc":
        rec["villain_rank"] = r.read_u4()
        rec["special_restrictions"] = r.read_string_array()
        # One always-0 word sits between the restrictions and ReductionClass —
        # plausibly the emptied AllowedOrigins slot (HC deleted origin
        # restrictions along with the freemium Store/Locked/ProductCode
        # fields). Captured, surfaced if it ever goes non-zero.
        hc_prefix_word = r.read_u4()
        if hc_prefix_word != 0:
            rec.setdefault("extra_raw", []).append(("prefix", hc_prefix_word))
        rec["reduction_class"] = r.read_string()
    else:
        rec["allowed_origins"] = r.read_string_array()
        rec["special_restrictions"] = r.read_string_array()
        rec["store_requires"] = r.read_string()
        rec["locked_tooltip"] = r.read_string()
        rec["product_code"] = r.read_string()
        rec["reduction_class"] = r.read_string()

    rec["reduce_as_archvillain"] = bool(r.read_u4())
    rec["level_up_respecs"] = r.read_u4_array()

    rec["display_short_help"] = r.read_string()
    rec["icon"] = r.read_string()
    if flavor == "hc":
        rec["archetype_shots"] = r.read_string_array()
    rec["primary_category"] = r.read_string()
    rec["secondary_category"] = r.read_string()
    rec["pool_category"] = r.read_string()
    rec["epic_pool_category"] = r.read_string()
    if flavor == "hc":
        rec["mechanic_tip"] = r.read_string()
        rec["creation_stats"] = [_to_signed(w) for w in r.read_u4_array()]
        rec["playstyle_flags"] = r.read_u4()

    # AttribMin, AttribBase, StrengthMin, ResistanceMin, then the six
    # diminishing-returns tables; only AttribBase feeds the export today.
    attrib_structs = [_read_attrib_struct_array(r) for _ in range(10)]
    attrib_base = attrib_structs[1]
    attrib_max = _read_attrib_table_array(r)
    attrib_max_max = _read_attrib_table_array(r)
    strength_max = _read_attrib_table_array(r)
    resistance_max = _read_attrib_table_array(r)

    rec["named_tables"] = _read_named_tables(r)
    rec["attribs"] = _extract_attribs(attrib_base, attrib_max, attrib_max_max,
                                      strength_max, resistance_max)

    rec["connect_hp_and_status"] = bool(r.read_u4())
    if flavor == "hc":
        rec["defiant_scale"] = r.read_f4()
        rec["tail_scalar_raw"] = r.read_f4()
    else:
        defiant_words = 2 if flavor == "thunderspy" else 1
        for _ in range(defiant_words):
            word = r.read_u4()
            if word != 0:
                rec.setdefault("extra_raw", []).append(("defiant", word))
        rec["defiant_scale"] = r.read_f4()
        rec["mechanic_bar_raw"] = r.read_u4()
        rec["mechanic_tip"] = r.read_string()
        rec["mechanic_gap_raw"] = r.read_u4()
        rec["creation_stats"] = [_to_signed(r.read_u4()) for _ in range(6)]
        rec["archetype_shots"] = [r.read_string() for _ in range(3)]
        rec["playstyle_flags"] = r.read_u4()
        for _ in range(5):
            word = r.read_u4()
            if word != 0:
                rec.setdefault("extra_raw", []).append(("tail", word))

    if r.remaining() != 0:
        raise ValueError(f"{rec['name']}: record walk left {r.remaining()} "
                         f"unread bytes — layout drift")
    return ClassRecord(**rec)


def _detect_parse7_flavor(r: BinReader) -> str:
    """Homecoming and Thunderspy are both Parse7 but serialize different
    prefixes. Decide once per file by trial-walking the first record under
    each schema — the byte-accounted walk succeeds for exactly one."""
    save_pos = r.pos
    verdicts = []
    for flavor in ("hc", "thunderspy"):
        r._pos = save_pos
        rec_len = r.read_u4()
        sub = r.sub_reader(rec_len)
        try:
            _read_class_record(sub, flavor)
            verdicts.append(flavor)
        except (ValueError, IndexError):
            pass
    r._pos = save_pos
    if len(verdicts) != 1:
        raise ValueError(
            f"Parse7 classes flavor detection failed: first record walks "
            f"clean under {verdicts or 'neither schema'} — layout drift")
    return verdicts[0]


def parse_classes(bin_path_or_data) -> list[ClassRecord]:
    """Parse classes.bin or villain_classes.bin into ClassRecord list."""
    r = open_parse7(bin_path_or_data)
    r.read_u4()  # block size
    count = r.read_u4()
    if isinstance(r, Parse6BinReader):
        flavor = "rebirth"
    else:
        flavor = _detect_parse7_flavor(r)

    records = []
    for _ in range(count):
        rec_len = r.read_u4()
        sub = r.sub_reader(rec_len)
        records.append(_read_class_record(sub, flavor))
        r.skip(rec_len)
    return records
