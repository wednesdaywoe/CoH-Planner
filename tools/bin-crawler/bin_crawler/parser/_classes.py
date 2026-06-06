"""Parser for classes.bin and villain_classes.bin (archetype definitions).

Extracts class name, display name, icon, primary/secondary/pool categories,
and the named modifier tables (e.g. Melee_Damage, Ranged_Buff_Def).

Record layout varies between standard ATs, EATs, and villain classes, so
we use anchor-based field detection:
  - Icon: first string field ending in ".tga"
  - Categories: 3 consecutive strings at icon_offset + 20/24/28 (Parse7) or
    next 3 inline pascal strings after the icon (Parse6)
  - Named tables: struct array scanned from end of record
    (count 30-200, sub-records of ~428 bytes each with 105 float values)
"""

import struct
from pathlib import Path

from ._reader import open_parse7, Parse6BinReader
from ._dataclasses import ClassRecord


def _find_icon_offset(data, rec_start, rec_len, strtab_base):
    """Scan record for the first .tga string reference (icon field)."""
    limit = min(200, rec_len)
    for off in range(8, limit, 4):
        raw = struct.unpack_from("<I", data, rec_start + off)[0]
        if raw == 0 or raw > 200000:
            continue
        str_abs = strtab_base + raw
        if str_abs + 4 >= len(data):
            continue
        end = str_abs
        while end < len(data) and data[end] != 0:
            end += 1
        s = bytes(data[str_abs:end]).decode("ascii", errors="replace")
        if s.endswith(".tga"):
            return off
    return None


def _read_str_at(data, rec_start, off, strtab_base):
    """Read a string table reference at a given record offset."""
    raw = struct.unpack_from("<I", data, rec_start + off)[0]
    if raw == 0:
        return ""
    str_abs = strtab_base + raw
    if str_abs >= len(data):
        return ""
    end = str_abs
    while end < len(data) and data[end] != 0:
        end += 1
    return bytes(data[str_abs:end]).decode("ascii", errors="replace")


def _find_named_tables_offset(data, rec_start, rec_len):
    """Scan backwards for the named_tables struct array.

    HC has level cap 50 + 5 Incarnate = ~105 floats per table (sub_len ~428).
    Thunderspy/older CoH has level cap 50 only, so vcount ~= 50 and sub_len
    ~= 4 (name) + 4 (count) + 50*4 (floats) = 208 bytes. Accept either range.
    """
    for offset in range(rec_len - 12, 0, -4):
        count = struct.unpack_from("<I", data, rec_start + offset)[0]
        if not (30 <= count <= 200):
            continue
        sub_len = struct.unpack_from("<I", data, rec_start + offset + 4)[0]
        # HC: 400-500 bytes (vcount=105). Thunderspy/older: 150-300 (vcount=50).
        if not (150 <= sub_len <= 600):
            continue
        sub_start = rec_start + offset + 8
        vcount = struct.unpack_from("<I", data, sub_start + 4)[0]
        if 40 <= vcount <= 150:
            return offset
    return None


def _parse_named_tables(data, rec_start, tables_offset, strtab_base):
    """Parse the struct array of named modifier tables."""
    abs_pos = rec_start + tables_offset
    count = struct.unpack_from("<I", data, abs_pos)[0]
    abs_pos += 4

    tables = {}
    for _ in range(count):
        sub_len = struct.unpack_from("<I", data, abs_pos)[0]
        abs_pos += 4

        # name (string offset) + value count + float values
        str_off = struct.unpack_from("<I", data, abs_pos)[0]
        str_abs = strtab_base + str_off
        end = str_abs
        while end < len(data) and data[end] != 0:
            end += 1
        tname = bytes(data[str_abs:end]).decode("ascii", errors="replace")

        vcount = struct.unpack_from("<I", data, abs_pos + 4)[0]
        values = [
            struct.unpack_from("<f", data, abs_pos + 8 + i * 4)[0]
            for i in range(vcount)
        ]

        tables[tname] = values
        abs_pos += sub_len

    return tables


def _read_inline_str(data, pos):
    """Read a Parse6 inline pascal string. Returns (string, end_pos_aligned)."""
    if pos + 2 > len(data):
        return "", pos
    slen = struct.unpack_from("<H", data, pos)[0]
    pos += 2
    if slen == 0:
        # Pad to 4-byte alignment from the post-u16 position
        pad = (4 - pos % 4) % 4
        return "", pos + pad
    if pos + slen > len(data):
        return "", pos
    s = bytes(data[pos:pos + slen]).rstrip(b"\x00").decode("utf-8", errors="replace")
    pos += slen
    pad = (4 - pos % 4) % 4
    return s, pos + pad


def _find_inline_icon_pos(data, rec_start, rec_len):
    """Locate the icon inline string in a Parse6 record by searching for ".tga".

    Returns (icon_string_start_pos, end_pos_after_icon) or (None, None).
    """
    end = rec_start + rec_len
    haystack = bytes(data[rec_start:end])
    idx = haystack.find(b".tga")
    if idx < 0:
        return None, None
    # The string content runs up through the .tga extension. Walk backwards to
    # find the u16 length prefix that points at this string.
    for back in range(idx, max(idx - 64, 0), -1):
        candidate_str_start = rec_start + back
        len_pos = candidate_str_start - 2
        if len_pos < rec_start:
            continue
        slen = struct.unpack_from("<H", data, len_pos)[0]
        # The length should land us exactly on the end of `.tga` (with optional
        # null terminator or trailing chars in the same string).
        if 4 < slen < 80 and back + slen >= idx + 4:
            actual_end = candidate_str_start + slen
            content = bytes(data[candidate_str_start:actual_end]).rstrip(b"\x00")
            if content.endswith(b".tga"):
                pad = (4 - (actual_end - rec_start) % 4) % 4
                return candidate_str_start - 2, actual_end + pad
    return None, None


def _find_inline_named_tables_offset(data, rec_start, rec_len):
    """Scan backwards in a Parse6 record for the named_tables struct array.

    Each table sub-record: u4 sub_len + inline-string name + u4 vcount
    + vcount × f4 values. HC Parse7 uses vcount=105; Rebirth Parse6 uses
    vcount=50 (different game version's level cap). Accept any vcount in
    a plausible range.
    """
    for offset in range(rec_len - 12, 4, -4):
        count = struct.unpack_from("<I", data, rec_start + offset)[0]
        if not (30 <= count <= 200):
            continue
        sub_len = struct.unpack_from("<I", data, rec_start + offset + 4)[0]
        if not (150 <= sub_len <= 600):
            continue
        name_pos = rec_start + offset + 8
        _, after_name = _read_inline_str(data, name_pos)
        if after_name + 4 > rec_start + rec_len:
            continue
        vcount = struct.unpack_from("<I", data, after_name)[0]
        # Plausible level-table sizes seen so far: 50 (Rebirth), 105 (HC).
        if 40 <= vcount <= 150:
            return offset
    return None


def _parse_inline_named_tables(data, rec_start, tables_offset):
    """Parse Parse6 named_tables: count + per-entry [u4 sub_len + inline name
    + u4 vcount + vcount × f4]."""
    abs_pos = rec_start + tables_offset
    count = struct.unpack_from("<I", data, abs_pos)[0]
    abs_pos += 4

    tables = {}
    for _ in range(count):
        sub_len = struct.unpack_from("<I", data, abs_pos)[0]
        abs_pos += 4
        sub_end = abs_pos + sub_len

        tname, after_name = _read_inline_str(data, abs_pos)
        vcount = struct.unpack_from("<I", data, after_name)[0]
        values = [
            struct.unpack_from("<f", data, after_name + 4 + i * 4)[0]
            for i in range(vcount)
        ]
        tables[tname] = values
        abs_pos = sub_end

    return tables


def _parse_classes_parse6(r: Parse6BinReader) -> list[ClassRecord]:
    """Parse6 (Rebirth/retail) classes.bin. Inline pascal strings replace
    Parse7's u4 string-table offsets; named_tables struct array uses the
    same shape but with inline string names."""
    r.read_u4()  # block_size
    count = r.read_u4()

    records = []
    for _ in range(count):
        rec_len = r.read_u4()
        sub = r.sub_reader(rec_len)
        data = sub._data
        rec_start = sub._pos

        # Sequential header: name, display_name, description as inline strings.
        name, pos = _read_inline_str(data, rec_start)
        display_name, _ = _read_inline_str(data, pos)

        # Anchor: find the icon string via ".tga".
        icon = ""
        primary = ""
        secondary = ""
        pool = ""
        icon_len_pos, after_icon = _find_inline_icon_pos(data, rec_start, rec_len)
        if icon_len_pos is not None:
            icon, _ = _read_inline_str(data, icon_len_pos)
            # Three more inline strings: primary, secondary, pool.
            primary, p2 = _read_inline_str(data, after_icon)
            secondary, p3 = _read_inline_str(data, p2)
            pool, _ = _read_inline_str(data, p3)

        named_tables = {}
        tables_off = _find_inline_named_tables_offset(data, rec_start, rec_len)
        if tables_off is not None:
            named_tables = _parse_inline_named_tables(data, rec_start, tables_off)

        # Per-archetype attribute curves/caps (HP, HP-cap, resistance cap)
        attribs = _extract_attribs(data, rec_start, rec_len, _ATTRIB_LAYOUT["parse6"])

        records.append(ClassRecord(
            name=name,
            display_name=display_name,
            icon=icon,
            primary_category=primary,
            secondary_category=secondary,
            pool_category=pool,
            named_tables=named_tables,
            attribs=attribs,
        ))
        r.skip(rec_len)

    return records


# --- Per-archetype attribute curves (CharacterAttributes struct) -------------
#
# Beyond the named modifier tables, each class record serializes the engine's
# CharacterAttributes as a long run of count-prefixed per-level float arrays
# (u4 count + count×f4). The planner's archetype definitions need three of them:
# the HP curve, the HP-cap curve, and the resistance cap. Rather than fully
# decode the (large, version-specific) member layout, we anchor on the
# hit_points curve — the first such array whose level-1 value is a small HP-like
# number rising to a large level-50 value — and read the cap members at fixed
# byte-deltas from it. Deltas were derived empirically and VERIFIED against the
# hand-port for all 15 HC archetypes (full curves + caps match; the only diff
# was a stale Brute HP table in the hand data, which the binary corrects).
#
# Per-binary-format layout. Deltas are byte offsets from the hit_points array's
# count-prefix; `cap_delta` lands on the hp-cap array's count-prefix,
# `res_value_delta` on the resistance-cap FLOAT (a flat per-level value), and
# `threat_delta` on the base-threat FLOAT — a header scalar that sits BEFORE the
# hit_points anchor (negative delta), so it shifts if HC ever inserts a header
# field; the sane-range guard in _extract_attribs catches a gross misread.
# Derived empirically and VERIFIED against the hand-port for every archetype —
# HC: 15 ATs (caught a stale Brute HP table the binary corrects); Rebirth: 15
# incl. Guardian. Guarded by the archetype-stats CI test so a format change that
# shifts these fails loudly.
#   parse7 (Homecoming): 105-entry level tables (50 + combat/incarnate extension)
#   parse6 (Rebirth):    50-entry level tables (level cap 50, no incarnate)
# `dmg_cap_delta` lands on the first damage-type StrengthMax array — a per-level
# curve whose L50 value is the AT's damage buff cap (Blaster 5.0=500%, Brute
# 7.0=700% HC / 7.75=775% Rebirth, etc.). Verified against the HC 2020-01-23
# Tanker/Brute patch notes (Tanker 400->500%, Brute 775->700%) and the live
# forum (Scrapper 500%). NB: there is a second, STALE copy of the cap elsewhere
# in the HC record (pre-2020 values) — do NOT read that one. Per-server: Rebirth
# kept the older Tanker 400% / Brute 775%.
_ATTRIB_LAYOUT = {
    "parse7": {"count": 105, "cap_delta": 44656, "res_value_delta": 112744, "threat_delta": -4040, "dmg_cap_delta": 74872},
    "parse6": {"count": 50,  "cap_delta": 15472, "res_value_delta": 46420, "threat_delta": -4004, "dmg_cap_delta": 30944},
}
_PLAYER_LEVELS = 50             # planner uses levels 1-50


def _find_hit_points_offset(data, rec_start, rec_len, count):
    """First count-prefixed array that looks like the hit_points curve: level-1
    in (50, 300) rising to a level-50 in (300, 5000). Returns record-relative
    offset of the count prefix, or None."""
    off = 0
    while off < rec_len - 8:
        if struct.unpack_from("<I", data, rec_start + off)[0] == count \
                and rec_start + off + 4 + count * 4 <= rec_start + rec_len:
            l1 = struct.unpack_from("<f", data, rec_start + off + 4)[0]
            l50 = struct.unpack_from("<f", data, rec_start + off + 4 + 49 * 4)[0]
            if 50 < l1 < 300 and 300 < l50 < 5000 and l50 > l1:
                return off
        off += 4
    return None


def _read_level_array(data, rec_start, off, take):
    """Read `take` floats from the count-prefixed array at `off` (skips the u4
    count prefix)."""
    base = rec_start + off + 4
    return [struct.unpack_from("<f", data, base + i * 4)[0] for i in range(take)]


def _extract_attribs(data, rec_start, rec_len, layout):
    """Extract hit_points / hp_cap curves + resistance_cap from a class record
    using the given format layout. Returns {} when the hit_points anchor isn't
    found (pet/odd records)."""
    cnt = layout["count"]
    hp_off = _find_hit_points_offset(data, rec_start, rec_len, cnt)
    if hp_off is None:
        return {}
    out: dict[str, object] = {
        "hit_points": _read_level_array(data, rec_start, hp_off, _PLAYER_LEVELS),
    }
    cap_off = hp_off + layout["cap_delta"]
    if rec_start + cap_off + 4 + cnt * 4 <= rec_start + rec_len \
            and struct.unpack_from("<I", data, rec_start + cap_off)[0] == cnt:
        out["hp_cap"] = _read_level_array(data, rec_start, cap_off, _PLAYER_LEVELS)
    res_off = hp_off + layout["res_value_delta"]
    if rec_start + res_off + 4 <= rec_start + rec_len:
        v = struct.unpack_from("<f", data, rec_start + res_off)[0]
        if 0 < v <= 1:  # sane resistance cap
            out["resistance_cap"] = v
    # base_threat: header scalar at a negative delta (before the anchor).
    threat_off = hp_off + layout["threat_delta"]
    if 0 <= threat_off and rec_start + threat_off + 4 <= rec_start + rec_len:
        v = struct.unpack_from("<f", data, rec_start + threat_off)[0]
        if 0 < v <= 20:  # sane per-AT threat multiplier (player ATs span 1..4)
            out["base_threat"] = v
    # damage_cap: L50 of the first damage-type StrengthMax curve.
    dc_off = hp_off + layout["dmg_cap_delta"]
    if rec_start + dc_off + 4 + (_PLAYER_LEVELS - 1) * 4 + 4 <= rec_start + rec_len \
            and struct.unpack_from("<I", data, rec_start + dc_off)[0] == cnt:
        v = struct.unpack_from("<f", data, rec_start + dc_off + 4 + (_PLAYER_LEVELS - 1) * 4)[0]
        if 3 <= v <= 10:  # sane damage buff cap (player ATs span 400%..775%)
            out["damage_cap"] = v
    return out


def parse_classes(bin_path_or_data) -> list[ClassRecord]:
    """Parse classes.bin or villain_classes.bin into ClassRecord list."""
    r = open_parse7(bin_path_or_data)
    if isinstance(r, Parse6BinReader):
        return _parse_classes_parse6(r)

    block_size = r.read_u4()
    count = r.read_u4()

    records = []
    for _ in range(count):
        rec_len = r.read_u4()
        sub = r.sub_reader(rec_len)
        data = sub._data
        rec_start = sub.pos
        strtab_base = sub._strtab_base

        # Field 0: name
        name = _read_str_at(data, rec_start, 0, strtab_base)
        # Field 1: display_name (P-hash)
        display_name = _read_str_at(data, rec_start, 4, strtab_base)

        # Find icon via .tga anchor
        icon = ""
        primary = ""
        secondary = ""
        pool = ""
        icon_off = _find_icon_offset(data, rec_start, rec_len, strtab_base)
        if icon_off is not None:
            icon = _read_str_at(data, rec_start, icon_off, strtab_base)
            # HC layout: categories at icon + 20/24/28 (5 u4 gap after icon for
            # screenshots etc). Thunderspy's older record schema drops those
            # intermediate fields and puts categories at icon + 4/8/12. Detect
            # by reading the HC slot first: in Thunderspy that slot lands on
            # the parent_class field, which begins with "Class_".
            hc_primary = _read_str_at(data, rec_start, icon_off + 20, strtab_base)
            if hc_primary.startswith("Class_") or not hc_primary:
                primary = _read_str_at(data, rec_start, icon_off + 4, strtab_base)
                secondary = _read_str_at(data, rec_start, icon_off + 8, strtab_base)
                pool = _read_str_at(data, rec_start, icon_off + 12, strtab_base)
            else:
                primary = hc_primary
                secondary = _read_str_at(data, rec_start, icon_off + 24, strtab_base)
                pool = _read_str_at(data, rec_start, icon_off + 28, strtab_base)

        # Find and parse named modifier tables
        named_tables = {}
        tables_off = _find_named_tables_offset(data, rec_start, rec_len)
        if tables_off is not None:
            named_tables = _parse_named_tables(data, rec_start, tables_off, strtab_base)

        # Per-archetype attribute curves/caps (HP, HP-cap, resistance cap)
        attribs = _extract_attribs(data, rec_start, rec_len, _ATTRIB_LAYOUT["parse7"])

        records.append(ClassRecord(
            name=name,
            display_name=display_name,
            icon=icon,
            primary_category=primary,
            secondary_category=secondary,
            pool_category=pool,
            named_tables=named_tables,
            attribs=attribs,
        ))

        r.skip(rec_len)

    return records
