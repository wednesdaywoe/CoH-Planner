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
class BoostSetRecord:
    name: str
    display_name: str
    description: str
    rarity: str             # "ECCommon", "ECUncommon", "ECRare", "ECVeryRare", etc.
    category: str           # "ECMelee", "ECRanged", etc. — pool-matched for purples
    allowed_powers: list[str] = field(default_factory=list)


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
        rarity       = sub.read_string()

        if _next_is_ec_string(sub):
            category    = sub.read_string()
            power_count = sub.read_u4()
        else:
            category    = ""  # filled in by pool-matching below
            power_count = sub.read_u4()

        # Implausible power_count means this record uses a layout we don't
        # understand (Rebirth has one such oddball: an empty-rarity
        # "Inexhaustibility" record that is structured differently). Skip
        # the power list rather than crashing — the set still exports with
        # its header fields but no allowed-powers, which is graceful enough.
        if power_count > rec_len:
            powers: list[str] = []
        else:
            powers = [sub.read_string() for _ in range(power_count)]

        raw.append({
            "name": name,
            "display_name": display_name,
            "description": description,
            "rarity": rarity,
            "category": category,
            "powers": powers,
        })
        r.skip(rec_len)

    # Pool-match purple sets to a regular set's category by (count, first_power).
    pool_to_cat: dict[tuple[int, str], str] = {}
    for rec in raw:
        if rec["category"] and rec["powers"]:
            key = (len(rec["powers"]), rec["powers"][0])
            pool_to_cat.setdefault(key, rec["category"])

    for rec in raw:
        if not rec["category"] and rec["powers"]:
            key = (len(rec["powers"]), rec["powers"][0])
            rec["category"] = pool_to_cat.get(key, "")
        if not rec["category"] and rec["rarity"] == "ECUniversalDamage":
            rec["category"] = "ECUniversalDamage"
        # Rebirth's Parse6 ATOs lack a category string AND have AT-specific
        # pools that no common-rarity set shares — so pool-matching fails.
        # Infer the AT from the first power's category prefix.
        if not rec["category"] and rec["powers"]:
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
        )
        for rec in raw
    ]


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

        powers, _ = _parse_power_list(buf, list_start, power_count)
        raw.append({
            "name": name,
            "display_name": display_name,
            "description": description,
            "rarity": rarity,
            "category": category,
            "powers": powers,
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
        )
        for r in raw
    ]


_SPRINT_MARKER = "Inherent.Inherent.Sprint"


def _resolve_category(s: BoostSetRecord) -> str:
    """Map the set's EC-label to a planner category, accounting for the
    Running/Leaping split. The planner treats "Running & Sprints" as a
    distinct category from "Running" (Thrust vs Quickfoot/Celerity): the
    distinction is data-derived — if the set's allowed-powers list includes
    Sprint, it's the "& Sprints" variant.
    """
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
        planner_cat = _resolve_category(s)
        if not planner_cat:
            continue
        for p in s.allowed_powers:
            idx.setdefault(p, set()).add(planner_cat)
    return {k: sorted(v) for k, v in idx.items()}
