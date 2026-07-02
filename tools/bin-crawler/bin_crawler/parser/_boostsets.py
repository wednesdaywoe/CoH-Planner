"""Parse boostsets.bin (IO enhancement set definitions).

Each record describes one IO set (Bonesnap, Hecatomb, Call_to_Arms, etc.) and
carries the authoritative list of powers it can slot into — the data that
lets a client answer "what IO sets can go in this power" without inference.

Two record layouts are in use, distinguishable by whether u4[5] resolves to
an "EC*" category string:

  Regular (Common/Uncommon/Rare):      Purple (VeryRare/Winter/PvP/UltraRare):
    u4[0]   name                          u4[0]   name
    u4[1]   display_name (P-hash)         u4[1]   display_name
    u4[2]   description (P-hash)          u4[2]   description
    u4[3]   opaque flag                   u4[3]   opaque flag (always 1)
    u4[4]   rarity ("ECCommon", ...)      u4[4]   rarity ("ECVeryRare", ...)
    u4[5]   category ("ECMelee", ...)     u4[5]   power_list count
    u4[6]   power_list count

After the header: u16-length-prefixed power full_names, each padded out to a
4-byte boundary, then — after a u16(0) terminator — a trailing block with
level data and the set's enhancement pieces (currently unused by the planner).

Purple sets have no explicit category field — they inherit from whichever
common-rarity set shares their allowed-powers list. We match by (power_count,
first_power) which uniquely identifies each slottable pool.
"""

from __future__ import annotations

import struct
from dataclasses import dataclass, field
from typing import Iterable

from ._reader import open_parse7, Parse6BinReader


@dataclass
class BoostListEntry:
    """One slot in a set — typically two boost variants (Crafted + Attuned)
    that share the same aspects but differ in attunement behavior."""
    boosts: list[str] = field(default_factory=list)


@dataclass
class BoostBonusEntry:
    """One set bonus tier — fires when between MinBoosts and MaxBoosts pieces
    are slotted. Values come from looking up `auto_powers` in powers.bin."""
    min_boosts: int = 0
    max_boosts: int = 0
    auto_powers: list[str] = field(default_factory=list)


@dataclass
class BoostSetRecord:
    name: str
    display_name: str
    description: str
    rarity: str             # "ECCommon", "ECUncommon", "ECRare", "ECVeryRare", etc.
    category: str           # "ECMelee", "ECRanged", etc. — pool-matched for purples
    allowed_powers: list[str] = field(default_factory=list)
    # Trailing-block fields (Phase 2: extended for Rebirth IO set extraction).
    # boostlists: each entry holds 2+ boost variant names (Crafted/Attuned).
    # bonuses:   each entry has min/max-piece count + AutoPower references that
    #            resolve to Set_Bonus.* power records in powers.bin.
    # min_level / max_level: the slottable level range for the set.
    boostlists: list[BoostListEntry] = field(default_factory=list)
    bonuses: list[BoostBonusEntry] = field(default_factory=list)
    min_level: int = 0
    max_level: int = 0


# EC* enum → planner category name. Matches the existing category labels in
# src/data/io-sets-raw.ts (and convert-powerset.cjs's SET_CATEGORY_MAP).
EC_CATEGORY_TO_PLANNER = {
    "ECMelee":                 "Melee Damage",
    "ECMeleeAoE":              "Melee AoE Damage",
    "ECRanged":                "Ranged Damage",
    "ECTargetedAoE":           "Ranged AoE Damage",
    "ECSniper":                "Sniper Attacks",
    "ECPetDamage":             "Pet Damage",
    "ECRechargeIntensivePets": "Recharge Intensive Pets",
    "ECKnockback":             "Knockback",
    "ECHold":                  "Holds",
    "ECStun":                  "Stuns",
    "ECConfuse":               "Confuse",
    "ECSleep":                 "Sleep",
    "ECFear":                  "Fear",
    "ECImmobilize":            "Immobilize",
    "ECSlow":                  "Slow Movement",
    "ECTaunt":                 "Threat Duration",
    "ECDefense":               "Defense Sets",
    "ECDefenseDebuff":         "Defense Debuff",
    "ECResist":                "Resist Damage",
    "ECHealing":               "Healing",
    "ECAccurateHealing":       "Accurate Healing",
    "ECAccurateDefenseDebuff": "Accurate Defense Debuff",
    "ECAccurateToHitDebuff":   "Accurate To-Hit Debuff",
    "ECToHitBuff":             "To Hit Buff",
    "ECToHitDeBuff":           "To Hit Debuff",
    "ECEnduranceModification": "Endurance Modification",
    "ECFlight":                "Flight",
    "ECLeaping":               "Leaping",
    "ECRunning":               "Running",
    "ECTeleport":              "Teleport",
    "ECUniversalTravel":       "Universal Travel",
    "ECUniversalDamage":       "Universal Damage Sets",
    # Archetype ATO categories. Superior (EC-S-*) variants share the planner
    # category with their non-superior counterpart — the planner's "*
    # Archetype Sets" umbrella covers both rarities.
    "ECBlaster":               "Blaster Archetype Sets",
    "ECBrute":                 "Brute Archetype Sets",
    "ECController":            "Controller Archetype Sets",
    "ECCorruptor":             "Corruptor Archetype Sets",
    "ECDefender":              "Defender Archetype Sets",
    "ECDominator":             "Dominator Archetype Sets",
    "ECMastermind":            "Mastermind Archetype Sets",
    "ECScrapper":              "Scrapper Archetype Sets",
    "ECSentinel":              "Sentinel Archetype Sets",
    "ECStalker":               "Stalker Archetype Sets",
    "ECTanker":                "Tanker Archetype Sets",
    "ECArachnos":              "Soldiers of Arachnos Archetype Sets",
    "ECKheldian":              "Kheldian Archetype Sets",
    "ECSBlaster":              "Blaster Archetype Sets",
    "ECSBrute":                "Brute Archetype Sets",
    "ECSController":           "Controller Archetype Sets",
    "ECSCorruptor":            "Corruptor Archetype Sets",
    "ECSDefender":             "Defender Archetype Sets",
    "ECSDominator":            "Dominator Archetype Sets",
    "ECSMastermind":           "Mastermind Archetype Sets",
    "ECSScrapper":             "Scrapper Archetype Sets",
    "ECSSentinel":             "Sentinel Archetype Sets",
    "ECSStalker":              "Stalker Archetype Sets",
    "ECSTanker":               "Tanker Archetype Sets",
    "ECSArachnos":             "Soldiers of Arachnos Archetype Sets",
    "ECSKheldian":             "Kheldian Archetype Sets",
    # Rebirth-only Guardian umbrella (ECATO/ECSATO/ECATO2/ECSATO2 all
    # land here once their allowed_powers are matched against Guardian
    # categories via _AT_PREFIX_TO_EC).
    "ECGuardian":              "Guardian Archetype Sets",
}


def _parse_power_list(buf: bytes, start: int, expected_count: int) -> tuple[list[str], int]:
    """Parse u16-length-prefixed inline strings, 4-byte aligned, up to the
    expected count. Returns (strings, byte_position_after_list)."""
    pos = start
    powers: list[str] = []
    for _ in range(expected_count):
        if pos + 2 > len(buf):
            break
        slen = struct.unpack_from("<H", buf, pos)[0]
        pos += 2
        if slen == 0 or pos + slen > len(buf):
            break
        s = buf[pos:pos + slen].decode("ascii", errors="replace")
        powers.append(s)
        pos += slen
        # Pad to 4-byte boundary
        while pos % 4 != 0 and pos < len(buf):
            pos += 1
    return powers, pos


def _next_is_ec_string(sub: Parse6BinReader) -> bool:
    """Peek the next 4 bytes: do they look like an inline pascal string
    starting with "EC"? Used to distinguish the regular layout
    (next field is a category string like "ECMelee") from the purple layout
    (next field is the u4 power_count)."""
    if sub._pos + 4 > sub._end:
        return False
    slen = struct.unpack_from("<H", sub._data, sub._pos)[0]
    if not (0 < slen < 64):
        return False
    if sub._pos + 2 + 2 > sub._end:
        return False
    return bytes(sub._data[sub._pos + 2:sub._pos + 4]) == b"EC"


def _rarity_is_present(sub: Parse6BinReader) -> bool:
    """True when the rarity slot holds a real pascal string. Rarity tags are
    always alphabetic ("ECCommon", "LibertysBelt", "ECSWinter", ...). Some
    Rebirth challenge records (e.g. Inexhaustibility) omit the rarity AND
    category strings entirely, so the u4 power_count sits in this slot instead —
    its first content byte is 0x00, which no real rarity tag has."""
    if sub._pos + 4 > sub._end:
        return False
    slen = struct.unpack_from("<H", sub._data, sub._pos)[0]
    if not (0 < slen < 64):
        return False
    first = sub._data[sub._pos + 2]
    return (0x41 <= first <= 0x5a) or (0x61 <= first <= 0x7a)


def _parse_trailing_block(
    sub,
) -> tuple[list[BoostListEntry], list[BoostBonusEntry], int, int]:
    """Parse the BoostLists (pieces) + Bonuses (set bonus tiers) + level data
    that follow a boostset record's power list.

    `sub` must be a reader positioned at the trailing block (i.e. just after
    the allowed-powers list). The block uses inline pascal strings and the
    SAME layout in both Parse6 (Rebirth) and Parse7 (HC), so both branches
    share this code:

        u4 bl_count
        per boostlist: u4 block_size, [u4 boost_count, boost_count × string]
        u4 bn_count
        per bonus:     u4 block_size, [u4 unk, u4 min, u4 max, u4 unk,
                                        u4 ap_count, ap_count × string]
        u4 min_level, u4 max_level

    Layout hand-decoded from Bonesnap's Parse6 record (2026-05-03) and
    re-confirmed against HC's Parse7 records (Panacea/Aegis, 2026-06-05).
    Each entry is length-prefixed via a u4 block_size, so unknown trailing
    fields per block are skipped via sub_reader. Wrapped in try/except so any
    oddball record (Inexhaustibility-style) still surfaces its header.

    Returns ([], [], 0, 0) on any layout deviation.
    """
    boostlists: list[BoostListEntry] = []
    bonuses: list[BoostBonusEntry] = []
    min_level = 0
    max_level = 0
    try:
        bl_count = sub.read_u4()
        if bl_count <= 100:  # sanity bound — sets typically have 3-6
            for _ in range(bl_count):
                block_size = sub.read_u4()
                bl_sub = sub.sub_reader(block_size)
                boost_count = bl_sub.read_u4()
                if 0 < boost_count <= 100:
                    boosts = [bl_sub.read_string() for _ in range(boost_count)]
                    boostlists.append(BoostListEntry(boosts=boosts))
                sub.skip(block_size)
            bn_count = sub.read_u4()
            if bn_count <= 100:
                for _ in range(bn_count):
                    block_size = sub.read_u4()
                    bn_sub = sub.sub_reader(block_size)
                    bn_sub.read_u4()              # unknown leading u4 (always 0 in samples)
                    min_b = bn_sub.read_u4()
                    max_b = bn_sub.read_u4()
                    bn_sub.read_u4()              # unknown (always 0 in samples)
                    ap_count = bn_sub.read_u4()
                    auto_powers: list[str] = []
                    if 0 < ap_count <= 20:
                        auto_powers = [bn_sub.read_string() for _ in range(ap_count)]
                    bonuses.append(BoostBonusEntry(
                        min_boosts=min_b, max_boosts=max_b,
                        auto_powers=auto_powers,
                    ))
                    sub.skip(block_size)
                # Trailing level data: u4 min_level, u4 max_level. Verified
                # against Bonesnap (L10-25 in boostsets.def) — first u4 after
                # the last bonus block holds MinLevel directly.
                if sub.remaining() >= 8:
                    min_level = sub.read_u4()
                    max_level = sub.read_u4()
    except (ValueError, IndexError):
        # Layout deviation — keep what we got and continue.
        pass
    return boostlists, bonuses, min_level, max_level


def _parse_boostsets_parse6(r: Parse6BinReader) -> list[BoostSetRecord]:
    """Parse6 (Rebirth/retail) layout. Same record schema as Parse7 but with
    inline pascal strings in place of string-table offsets.

    Layout detection: regular sets have a category string (e.g. "ECMelee")
    after rarity; purple/superior sets jump straight to power_count. We pick
    by peeking the next 4 bytes for a pascal-string starting with "EC".
    Rebirth has many rarity tags beyond HC's purple set
    (ECSATO/ECSWinter/ECSHalloween/LibertysBelt/...), so a rarity allowlist
    isn't enough."""
    r.read_u4()  # block_size — unused
    count = r.read_u4()

    raw: list[dict] = []
    for _ in range(count):
        rec_len = r.read_u4()
        sub = r.sub_reader(rec_len)

        name         = sub.read_string()
        display_name = sub.read_string()
        description  = sub.read_string()
        sub.read_u4()  # opaque flag

        # Most records: rarity string, then optional category string, then
        # power_count. The no-rarity variant (Inexhaustibility) omits both
        # strings and the power_count sits in the rarity slot — detect that so
        # we don't consume the count as a bogus empty string and desync.
        category = ""  # filled in by pool-matching below for regular sets
        if _rarity_is_present(sub):
            rarity = sub.read_string()
            if _next_is_ec_string(sub):
                category = sub.read_string()
        else:
            rarity = ""
        power_count = sub.read_u4()

        # Safety net: an implausible power_count still means a layout we don't
        # understand — skip the power list rather than crashing.
        if power_count > rec_len:
            powers: list[str] = []
        else:
            powers = [sub.read_string() for _ in range(power_count)]

        # Trailing block: BoostLists (pieces) + Bonuses + level data.
        # Shared with the Parse7 (HC) branch via _parse_trailing_block.
        boostlists, bonuses, min_level, max_level = _parse_trailing_block(sub)

        raw.append({
            "name": name,
            "display_name": display_name,
            "description": description,
            "rarity": rarity,
            "category": category,
            "powers": powers,
            "boostlists": boostlists,
            "bonuses": bonuses,
            "min_level": min_level,
            "max_level": max_level,
        })
        r.skip(rec_len)

    # Pool-match purple sets to a regular set's category by (count, first_power).
    pool_to_cat: dict[tuple[int, str], str] = {}
    for rec in raw:
        if rec["category"] and rec["powers"]:
            key = (len(rec["powers"]), rec["powers"][0])
            pool_to_cat.setdefault(key, rec["category"])

    for rec in raw:
        # Curated overrides win unconditionally — the binary doesn't carry a
        # category for these sets and the AT-prefix fallback is unreliable
        # for wide allowed_powers pools (Halloween, challenge enhancements).
        override = REBIRTH_SET_CATEGORY_OVERRIDES.get(rec["name"])
        if override:
            rec["category"] = override
            continue
        if not rec["category"] and rec["powers"]:
            key = (len(rec["powers"]), rec["powers"][0])
            rec["category"] = pool_to_cat.get(key, "")
        if not rec["category"] and rec["rarity"] == "ECUniversalDamage":
            rec["category"] = "ECUniversalDamage"
        # Rebirth's Parse6 ATOs lack a category string AND have AT-specific
        # pools that no common-rarity set shares — so pool-matching fails.
        # Infer the AT from the first power's category prefix. Skip sets that
        # carry an explicit planner-category override (e.g. Return From The
        # Grave): the AT-prefix heuristic would otherwise mislabel them from
        # their first power's prefix (RFTG's first rez power is Brute_Defense.*
        # → bogus "ECBrute"), leaving a misleading raw category behind even
        # though _resolve_category later overrides it.
        if (not rec["category"] and rec["powers"]
                and rec["name"] not in _CHALLENGE_SET_OVERRIDES_BY_NAME):
            rec["category"] = _infer_ato_category(rec["rarity"], rec["powers"])
        # Rebirth-only oddballs: Overwhelming Force (rarity=ECSummer) and
        # similar wide-pool sets that allow slotting into nearly every power
        # in the game. Treat as universal-damage by category.
        if not rec["category"] and len(rec["powers"]) > 1000:
            rec["category"] = "ECUniversalDamage"

    return [
        BoostSetRecord(
            name=rec["name"],
            display_name=rec["display_name"],
            description=rec["description"],
            rarity=rec["rarity"],
            category=rec["category"],
            allowed_powers=rec["powers"],
            boostlists=rec.get("boostlists", []),
            bonuses=rec.get("bonuses", []),
            min_level=rec.get("min_level", 0),
            max_level=rec.get("max_level", 0),
        )
        for rec in raw
    ]


# ----------------------------------------------------------------------------
# Placeholder / template boostset records — exclude from the category index.
# ----------------------------------------------------------------------------
# Some server datasets ship malformed dev/template boostset records in
# boostsets.bin. On Thunderspy (2026-06 bins) two records carry the literal
# placeholder display name "SumoBoostName" instead of a real P-hash string:
#
#   KB                 — EC="ECMelee", pieces are Crafted_KB_* (KNOCKBACK), and
#                        its allowed_powers is a 1905-entry catch-all mixing
#                        ranged/melee/toggle powers. Because it resolves to
#                        "Melee Damage", it wrongly grants Melee-set slotting to
#                        ~1387 powers that are not melee attacks (every Archery /
#                        Beam Rifle / Fire Blast / etc. ranged attack in the set,
#                        plus the Psychokinetic Assault whip attacks). The live
#                        client ignores this record (its display name is unset),
#                        so the planner must too.
#   Overwhelming_Force — a 3-power stub with an empty EC category (the REAL
#                        universal-damage set of the same name on HC has a
#                        1627-power pool + "ECUniversalDamage"); harmless on its
#                        own since it resolves to nothing, but excluded for the
#                        same reason.
#
# Filtering by the placeholder display name is dataset-safe: real sets (incl.
# HC's genuine Overwhelming_Force) never use "SumoBoostName", so this is a
# no-op on HC/Rebirth bins. See BIN-PARSER-LOG / Psychokinetic Assault report.
_PLACEHOLDER_SET_DISPLAY_NAMES = frozenset({"SumoBoostName"})


def _is_placeholder_set(s: BoostSetRecord) -> bool:
    return s.display_name in _PLACEHOLDER_SET_DISPLAY_NAMES


# Maps a power's category prefix (first segment of "Cat.Set.Power") to the
# planner-recognized EC* AT category. Used only as a fallback for Rebirth
# ATOs whose binary record omits the category string.
_AT_PREFIX_TO_EC = {
    "Blaster_Ranged":      "ECBlaster",
    "Blaster_Support":     "ECBlaster",
    "Brute_Melee":         "ECBrute",
    "Brute_Defense":       "ECBrute",
    "Controller_Buff":     "ECController",
    "Controller_Control":  "ECController",
    "Corruptor_Buff":      "ECCorruptor",
    "Corruptor_Ranged":    "ECCorruptor",
    "Defender_Buff":       "ECDefender",
    "Defender_Ranged":     "ECDefender",
    "Dominator_Assault":   "ECDominator",
    "Dominator_Control":   "ECDominator",
    "Mastermind_Buff":     "ECMastermind",
    "Mastermind_Summon":   "ECMastermind",
    "Scrapper_Defense":    "ECScrapper",
    "Scrapper_Melee":      "ECScrapper",
    "Sentinel_Defense":    "ECSentinel",
    "Sentinel_Ranged":     "ECSentinel",
    "Stalker_Defense":     "ECStalker",
    "Stalker_Melee":       "ECStalker",
    "Tanker_Defense":      "ECTanker",
    "Tanker_Melee":        "ECTanker",
    "Arachnos_Soldiers":   "ECArachnos",
    "Widow_Training":      "ECArachnos",
    "Peacebringer_Defensive": "ECKheldian",
    "Peacebringer_Offensive": "ECKheldian",
    "Warshade_Defensive":     "ECKheldian",
    "Warshade_Offensive":     "ECKheldian",
    # Rebirth Guardian — its ATOs (Guardian's Gift, Absolute Resolution)
    # slot into Guardian_Assault.* / Guardian_Comp.* powers exclusively.
    "Guardian_Assault":   "ECGuardian",
    "Guardian_Comp":      "ECGuardian",
}


def _infer_ato_category(rarity: str, powers: list[str]) -> str:
    """Infer the EC AT category for a Rebirth ATO whose record omitted it.

    Scans the first ~30 powers for any AT-prefix match, since some ATO
    pools (Kheldian especially) start with shared "Inherent" entries
    before reaching AT-specific powers."""
    if not rarity.startswith(("ECATO", "ECSATO", "ECHalloween", "ECSHalloween")):
        return ""
    for p in powers[:30]:
        prefix = p.split(".", 1)[0] if "." in p else ""
        ec = _AT_PREFIX_TO_EC.get(prefix)
        if ec:
            return ec
    return ""


def parse_boostsets(bin_path_or_data) -> list[BoostSetRecord]:
    """Parse boostsets.bin into a list of BoostSetRecord."""

    r = open_parse7(bin_path_or_data)
    if isinstance(r, Parse6BinReader):
        return _parse_boostsets_parse6(r)

    def strtab_resolve(offset: int) -> str:
        if offset == 0:
            return ""
        abs_pos = r._strtab_base + offset
        end = abs_pos
        data = r._strtab_data
        while end < len(data) and data[end] != 0:
            end += 1
        return bytes(data[abs_pos:end]).decode("ascii", errors="replace")

    r.read_u4()  # block_size — unused
    count = r.read_u4()

    # First pass: gather the raw header fields + power list for every record.
    # A purple set's category is stored on its base set, so we need all records
    # parsed before we can fill category in for purples.
    raw: list[dict] = []
    for _ in range(count):
        rec_len = r.read_u4()
        buf = bytes(r._data[r._pos:r._pos + rec_len])
        r.skip(rec_len)

        # Peek u4[5] — if it resolves to an "EC*" string it's the category
        # (regular layout); otherwise u4[5] is the power-list count (purple
        # layout).
        u4_5 = struct.unpack_from("<I", buf, 5 * 4)[0] if rec_len >= 24 else 0
        u4_5_str = strtab_resolve(u4_5) if 0 < u4_5 < (r._strtab_base and len(r._strtab_data)) else ""
        is_purple = not u4_5_str.startswith("EC")

        name         = strtab_resolve(struct.unpack_from("<I", buf, 0)[0])
        display_name = strtab_resolve(struct.unpack_from("<I", buf, 4)[0])
        description  = strtab_resolve(struct.unpack_from("<I", buf, 8)[0])
        rarity       = strtab_resolve(struct.unpack_from("<I", buf, 16)[0])
        if is_purple:
            category    = ""  # filled in later by pool-matching
            power_count = u4_5
            list_start  = 24
        else:
            category    = u4_5_str
            power_count = struct.unpack_from("<I", buf, 24)[0]
            list_start  = 28

        powers, pl_end = _parse_power_list(buf, list_start, power_count)
        # BoostLists (pieces) + Bonuses + levels follow the power list in the
        # same inline-string layout as Parse6, so parse them with the shared
        # helper over a Parse6 reader on the remaining record bytes. (The
        # Parse7 branch historically stopped here, which is why HC IO-set
        # pieces/bonuses were never binary-sourced.)
        boostlists, bonuses, min_level, max_level = _parse_trailing_block(
            Parse6BinReader(buf[pl_end:])
        )
        raw.append({
            "name": name,
            "display_name": display_name,
            "description": description,
            "rarity": rarity,
            "category": category,
            "powers": powers,
            "boostlists": boostlists,
            "bonuses": bonuses,
            "min_level": min_level,
            "max_level": max_level,
        })

    # Second pass: resolve purple categories by matching their allowed-powers
    # list against a regular set's list. Key = (count, first_power) —
    # unique per slottable pool because the game defines one authoritative
    # power list per category that every set of that category shares.
    pool_to_cat: dict[tuple[int, str], str] = {}
    for r in raw:
        if r["category"] and r["powers"]:
            key = (len(r["powers"]), r["powers"][0])
            pool_to_cat.setdefault(key, r["category"])

    for r in raw:
        if not r["category"] and r["powers"]:
            key = (len(r["powers"]), r["powers"][0])
            r["category"] = pool_to_cat.get(key, "")
        # ECUniversalDamage sets (Overwhelming Force, Cupid's Crush) have
        # their own 2297-power pool that no regular set shares. Tag directly.
        if not r["category"] and r["rarity"] == "ECUniversalDamage":
            r["category"] = "ECUniversalDamage"

    return [
        BoostSetRecord(
            name=r["name"],
            display_name=r["display_name"],
            description=r["description"],
            rarity=r["rarity"],
            category=r["category"],
            allowed_powers=r["powers"],
            boostlists=r.get("boostlists", []),
            bonuses=r.get("bonuses", []),
            min_level=r.get("min_level", 0),
            max_level=r.get("max_level", 0),
        )
        for r in raw
    ]


_SPRINT_MARKER = "Inherent.Inherent.Sprint"


# ----------------------------------------------------------------------------
# Curated category overrides for Rebirth-only sets.
# ----------------------------------------------------------------------------
# The bin format doesn't store a planner-friendly category for these sets:
#   - Halloween / event sets carry a wide-pool allowed_powers list (~30-1000+
#     powers) where AT-prefix inference picks up whichever AT happens to come
#     first alphabetically — usually wrong (Witchcraft tagged "ECBlaster",
#     Return From The Grave tagged "ECBrute", etc.).
#   - Challenge enhancements (Secret Master TF rewards) likewise lack any
#     authoritative category in the binary.
#
# Inference from boost-type frequency was tested and rejected: most of these
# pools are dominated by generic boosts (EndDisc 99%, Recharge 98%, Accuracy
# 87%) with no boost type unique enough to distinguish the set's intended
# slot category. Sleep / Fear sets are the only ones inference would catch
# correctly — and even those work better with an explicit table.
#
# Verify each entry against the Rebirth Wiki before adding:
#   https://wiki.cityofheroesrebirth.com/wiki/Halloween_Enhancements
#   https://wiki.cityofheroesrebirth.com/wiki/Challenge_Enhancements
REBIRTH_SET_CATEGORY_OVERRIDES: dict[str, str] = {
    # Halloween — verified via in-pool boost-frequency signal AND user report.
    'Witchcraft':                    'ECToHitDeBuff',  # @Redlynne 2026-05-08
    'Superior_Witchcraft':           'ECToHitDeBuff',
    'The_Haunting':                  'ECFear',         # 92.9% Fear in pool
    'Superior_The_Haunting':         'ECFear',
    'Endless_Nightmare':             'ECSleep',        # 100% Sleep in pool
    'Superior_Endless_Nightmare':    'ECSleep',
    # Verified 2026-06-12 (binary, not "mis-tagged" — these were FALSE TODOs):
    #   Vampires_Bite / Superior   → ECMelee  is CORRECT. Its 511-power pool is
    #       byte-identical to the standard Melee pool (Kinetic_Combat/Mako's
    #       Bite = 511); pool-matching assigns it correctly.
    #   Imperial_Might             → ECKnockback is CORRECT. 608-power pool ==
    #       the standard Knockback pool (Force_Feedback/Kinetic_Crash = 608);
    #       its pieces are Damage+Knockback. Pool-matched, no override needed.
    #   Libertys_Belt              → ECResist is CORRECT. 314-power pool == the
    #       standard Resist pool (Aegis/Steadfast = 314); pieces are all
    #       Damage Resistance. Pool-matched, no override needed.
    #   Synapses_Agility           → ECUniversalTravel via pool-match, CORRECT.
    # Handled elsewhere (no entry needed here):
    #   Return_From_The_Grave / Superior → "Resurrection" via
    #       _CHALLENGE_SET_OVERRIDES_BY_NAME (the only genuine mislabel; the
    #       AT-prefix fallback wrongly read ECBrute off its first rez power).
    #   Forced_Indoctrination → "Universal Control Duration" (BY_RARITY).
    #   Inexhaustibility      → "Rest Buff" (BY_NAME).
}


# Rebirth Challenge Enhancement sets (Secret Master TF/SF rewards) have
# non-standard category fields in boostsets.bin — Forced_Indoctrination
# stores an empty `category` despite being a fully-functional universal
# control set, and Inexhaustibility stores empty for both `category` and
# `rarity`. Override here so the per-power category index and the IO-set
# `type` field both surface them correctly.
#
# Forced Indoctrination: universal control set, slots into any power that
#   accepts immobilize / sleep / stun / hold / fear / confuse. The binary's
#   729-entry allowed_powers list propagates this category to all of them.
# Inexhaustibility: single-piece special enhancement, slots only into Rest.
_CHALLENGE_SET_OVERRIDES_BY_RARITY = {
    "ForcedIndoctrination": "Universal Control Duration",
}
_CHALLENGE_SET_OVERRIDES_BY_NAME = {
    "Inexhaustibility": "Rest Buff",
    # Rebirth multi-aspect debuff event sets. Their pieces enhance Defense +
    # Slow + ToHit Debuff (verified in io-sets-raw), making them "Universal
    # Debuff" sets slottable in ANY debuff power — e.g. Tar Patch via its Slow
    # aspect. The binary tags them ECToHitDeBuff (one of their aspects), which
    # wrongly implied Tar Patch accepts ToHit-debuff sets. Real single-aspect
    # ToHit sets (Cloud Senses, Dark Watcher's Despair, Siphon Insight) stay
    # "To Hit Debuff". See BIN-PARSER-LOG.
    "Witchcraft": "Universal Debuff",
    "Superior_Witchcraft": "Universal Debuff",
    # Return From The Grave — Rebirth's "first-ever Rez IO Set" (Halloween
    # event). Its 60-power pool is exclusively resurrection powers (Revive,
    # Rise of the Phoenix, Soul Transfer, Resurgence, Howling Twilight,
    # Resurrect, Rebirth, Mutation, Stygian Return, Restore Essence,
    # Resuscitate, Power of the Phoenix, Phoenix, …). No common-rarity set
    # shares that pool, so pool-matching fails and the AT-prefix fallback
    # mislabeled it "ECBrute" off its first power (Brute_Defense.*). The set
    # is conceptually a bespoke "Resurrection" category (verified 2026-06-12).
    "Return_From_The_Grave": "Resurrection",
    "Superior_Return_From_The_Grave": "Resurrection",
}


def _resolve_category(s: BoostSetRecord) -> str:
    """Map the set's EC-label to a planner category, accounting for the
    Running/Leaping split and the Rebirth Challenge Enhancement overrides.

    The planner treats "Running & Sprints" as a distinct category from
    "Running" (Thrust vs Quickfoot/Celerity): the distinction is data-
    derived — if the set's allowed-powers list includes Sprint, it's the
    "& Sprints" variant.
    """
    # Rebirth Challenge overrides win over EC_CATEGORY lookup. Their
    # category field is empty in the binary so the default lookup
    # returns "" and the set gets silently dropped without these.
    override = _CHALLENGE_SET_OVERRIDES_BY_NAME.get(s.name) \
        or _CHALLENGE_SET_OVERRIDES_BY_RARITY.get(s.rarity)
    if override:
        return override
    base = EC_CATEGORY_TO_PLANNER.get(s.category, "")
    if base in ("Running", "Leaping") and _SPRINT_MARKER in s.allowed_powers:
        return f"{base} & Sprints"
    return base


def build_power_category_index(sets: Iterable[BoostSetRecord]) -> dict[str, list[str]]:
    """Build power full_name → sorted list of planner category names.

    Drops EC-labels the planner has no corresponding category for (treated
    as "unknown"; the caller can log them if useful).
    """
    idx: dict[str, set[str]] = {}
    for s in sets:
        # Malformed dev/template records (e.g. Thunderspy's "KB" set tagged
        # ECMelee over a 1905-power catch-all) would contaminate a whole
        # category. Skip them — see _PLACEHOLDER_SET_DISPLAY_NAMES.
        if _is_placeholder_set(s):
            continue
        planner_cat = _resolve_category(s)
        if not planner_cat:
            continue
        for p in s.allowed_powers:
            idx.setdefault(p, set()).add(planner_cat)
    return {k: sorted(v) for k, v in idx.items()}
