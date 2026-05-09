"""Parser for powers.bin — the most complex binary file.

Each power record has 122+ fields that MUST be read in strict sequential order.
Supports both Parse7 (HC/Homecoming) and Parse6 (retail/Rebirth) formats.
HC added 6 extra fields not present in Parse6:
  - 35b: u4 after ai_report
  - 38:  chain_effect_array (string_array) + 38b-d: 3×u4
  - 48b: f4 after time_to_activate
  - 52b: u4 after idea_cost
Parse6 retains fields 53-56 (confirm dialog fields) in all records.
Parse6 has 8 bytes of box data (2×f4) instead of Parse7's 24 bytes (2×f4×3).

Post-2026 HC experimental patch added 8 bytes after chain_delay (field 41b):
  - 41b: 2×u4 (likely f4 + u4, often (1.0f, 0))
Auto-detected via _detect_field_41b.
"""

import struct
from pathlib import Path
from ._reader import open_parse7, BinReader, Parse6BinReader
from ._dataclasses import PowerRecord, EffectGroup, EffectTemplate
from ._enums import (
    BOOST_TYPE, BOOST_TYPE_REBIRTH, TARGET_TYPE, ATTRIB_NAME, EVENT_NAME,
    ATTRIB_MOD_TYPE, ATTRIB_MOD_ASPECT, ATTRIB_MOD_APPLICATION,
    ATTRIB_MOD_TARGET, ATTRIB_MOD_STACK, ATTRIB_MOD_CASTER_STACK,
    PVP_FLAG,
)


def _detect_format(r: BinReader) -> tuple[bool, bool]:
    """Detect whether the Parse7 powers.bin has field 45b and/or field 41b.

    Tests first 20 records across all 4 combinations of (has_41b, has_45b).
    Wrong layout shifts reads by 4+ bytes, producing implausible numeric values.
    Returns (has_field_41b, has_field_45b).
    """
    save_pos = r.pos
    best = (False, False)
    best_score = -1
    for has_41b in (False, True):
        for has_45b in (False, True):
            r._pos = save_pos
            score = 0
            for _ in range(20):
                rec_len = r.read_u4()
                sub = r.sub_reader(rec_len)
                try:
                    pw = _parse_power(sub, has_field_45b=has_45b, has_field_41b=has_41b)
                    plausible = (
                        0 <= pw.range <= 500
                        and 0 <= pw.recharge_time <= 3600
                        and 0 <= pw.endurance_cost <= 500
                        and 0 <= pw.time_to_activate <= 30
                    )
                    if plausible:
                        score += 1
                except Exception:
                    pass
                r.skip(rec_len)
            if score > best_score:
                best_score = score
                best = (has_41b, has_45b)
    r._pos = save_pos
    return best


def parse_powers(bin_path_or_data) -> list[PowerRecord]:
    r = open_parse7(bin_path_or_data)
    is_parse6 = isinstance(r, Parse6BinReader)

    block_size = r.read_u4()
    count = r.read_u4()

    if is_parse6:
        parser = _parse_power_parse6
    else:
        # Auto-detect HC format version by testing the first few records.
        # Two known post-release additions that shift subsequent field offsets:
        #   - field 45b (u4 between box_size and range) added in a past HC patch
        #   - field 41b (8 bytes after chain_delay) added in 2026 experimental patch
        # Wrong layout produces implausible values (negative range, huge recharge).
        has_41b, has_45b = _detect_format(r)
        parser = lambda sub: _parse_power(sub, has_field_45b=has_45b, has_field_41b=has_41b)

    records = []
    for i in range(count):
        rec_len = r.read_u4()
        sub = r.sub_reader(rec_len)

        try:
            pw = parser(sub)
            records.append(pw)
        except Exception as e:
            # Log but continue — don't let one bad record stop everything
            if i < 5:
                import sys
                print(f"  Warning: record {i} parse error: {e}", file=sys.stderr)

        r.skip(rec_len)

    return records


def _resolve_offset(strtab_data, strtab_base, offset: int) -> str | None:
    """Resolve a u4 string-table offset to a printable string, or None if invalid.

    Requires the offset to land on a string boundary (the previous byte must be a
    null terminator, or the offset must be 0 within the table). Without that
    check, random u4 values that happen to point mid-string look like valid
    short strings and pollute downstream heuristics (e.g. an offset pointing 5
    bytes into "5thColumnEndgame.NictusFX" yields "lumnEndgame.NictusFX" — same
    shape as a real entity def, but garbage).
    """
    if offset == 0:
        return None
    abs_pos = strtab_base + offset
    if abs_pos <= 0 or abs_pos >= len(strtab_data):
        return None
    # Boundary check: previous byte must be a null terminator.
    if strtab_data[abs_pos - 1] != 0:
        return None
    end = abs_pos
    limit = min(abs_pos + 256, len(strtab_data))
    while end < limit and strtab_data[end] != 0:
        end += 1
    if end >= limit and (limit < len(strtab_data) and strtab_data[end] != 0):
        return None
    try:
        s = bytes(strtab_data[abs_pos:end]).decode('ascii')
    except UnicodeDecodeError:
        return None
    if not s:
        return None
    if not all(0x20 <= ord(c) < 0x7f for c in s):
        return None
    return s


# Attribs that carry a Params Power { Power Redirects.X } block — the ones
# the planner's redirect-following logic in convert-powerset.cjs cares about.
# Source: scripts/convert-powerset.cjs:188 (execute_power follow), :594 (create_entity).
_POWER_PARAM_ATTRIBS = frozenset({
    'execute_power', 'grant_power', 'recharge_power', 'add_behavior',
    'cancel_effects', 'global_chance_mod', 'set_mode',
})

# Heuristic: a string looks like a power name if it has dotted form
# `Category.Powerset.Power` (3 parts, identifier characters, leading uppercase).
_PWRNAME_RE = None  # set below to avoid re-import


def _looks_like_power_name(s: str) -> bool:
    global _PWRNAME_RE
    if _PWRNAME_RE is None:
        import re
        _PWRNAME_RE = re.compile(r'^[A-Z][A-Za-z0-9_]*\.[A-Z][A-Za-z0-9_]*\.[A-Za-z0-9_]+$')
    return bool(_PWRNAME_RE.match(s))


def _looks_like_entity_def(s: str) -> bool:
    # Entity defs in CoH look like `MastermindPets_Howler_Wolf` or
    # `Class_Tarantula_Pet` — identifier characters, leading uppercase,
    # no spaces, no dots. (Power names use dots; entity defs use underscores.)
    if not s or ' ' in s or '.' in s:
        return False
    if len(s) < 4 or len(s) > 80:
        return False
    if not s[0].isupper():
        return False
    return all(c.isalnum() or c == '_' for c in s)


def _extract_params(tail_bytes: bytes, attribs: list[str],
                    strtab_base: int, strtab_data) -> dict | None:
    """Scan the AttribMod template tail for Params data the planner cares about.

    The full tail layout (8 fields: CancelEvents, RequiredEvent, Suppress,
    BoostModAllowed, Flags, Messages, FX, Params) hasn't been fully reverse-
    engineered. As a stopgap, we scan u4-aligned slots for offsets that
    resolve to strings matching the patterns we expect for known attribs:

      * Execute_Power-family attribs → Params Power { Power Redirects.X }
        → emit {type: 'Power', power_names: [...]}
      * Create_Entity attribs → Params EntCreate { EntityDef ... }
        → emit {type: 'EntCreate', entity_def, display_name, redirects, priority_list}

    Returns None if no relevant Params content is found.
    """
    if not attribs or not tail_bytes:
        return None
    attrib_lc = {a.lower() for a in attribs}

    # Pull every plausible string out of the tail in order.
    found: list[str] = []
    seen: set[str] = set()
    for off in range(0, len(tail_bytes) - 3, 4):
        val = struct.unpack_from('<I', tail_bytes, off)[0]
        s = _resolve_offset(strtab_data, strtab_base, val)
        if s and s not in seen:
            found.append(s)
            seen.add(s)

    is_power_attrib = bool(attrib_lc & _POWER_PARAM_ATTRIBS)
    is_create_entity = 'create_entity' in attrib_lc

    if is_power_attrib:
        power_names = [s for s in found if _looks_like_power_name(s)]
        if power_names:
            return {'type': 'Power', 'power_names': power_names}
        return None

    if is_create_entity:
        # Entity defs typically lead the Params block. DisplayName is free text
        # (often title-cased with spaces), PriorityList is short identifier.
        entity_def = next((s for s in found if _looks_like_entity_def(s)), None)
        power_names = [s for s in found if _looks_like_power_name(s)]
        # DisplayName: any short string that isn't a power-name and has a space
        # or just looks like a tooltip.
        display_name = next(
            (s for s in found
             if s != entity_def and not _looks_like_power_name(s)
             and ' ' in s and len(s) < 80),
            None,
        )
        # PriorityList: leftover short non-dotted identifier (e.g. "Pet").
        priority_list = next(
            (s for s in found
             if s != entity_def and s != display_name
             and '.' not in s and len(s) < 40
             and all(c.isalnum() or c == '_' for c in s)),
            None,
        )
        # Only emit a result if we found a real entity_def — without one this
        # is almost certainly a non-EntCreate use of attrib index 117 (binary
        # index 117 is shared between Create_Entity, Translucency, Silent_Kill,
        # Clear_Damagers per the ATTRIB_NAME enum note). Returning a result
        # with just `priority_list` would feed a stray P-hash to the convert
        # script as if it were a real Pet PriorityList.
        if not entity_def:
            return None
        result = {'type': 'EntCreate', 'entity_def': entity_def}
        if display_name: result['display_name'] = display_name
        if power_names: result['redirects'] = power_names
        if priority_list: result['priority_list'] = priority_list
        return result

    return None


def _extract_params_parse6(tail_bytes: bytes, attribs: list[str]) -> dict | None:
    """Parse6-equivalent of `_extract_params`.

    Parse6 stores strings inline as `u16(len) + chars + 4-byte-align pad`
    (vs Parse7's u4 offset into a separate string table). The AttribMod
    tail in Parse6 isn't fully reverse-engineered, but the Power slot
    (granted-power dotted name) is the only field we currently care
    about — it surfaces Stalker Assassin's Focus, Radiation Melee
    Contaminated, Beast Mastery Pack Mentality, etc. on chance-procs
    that would otherwise fall back to a generic "state" label.

    Strategy: scan the tail for inline pascal strings that pass the
    same `_looks_like_power_name` shape filter Parse7 uses. Returns
    `{'type': 'Power', 'power_names': [...]}` when at least one match
    found; None otherwise.

    Entity-create (Pets, summons) handling could follow the same shape
    but isn't currently surfaced from Parse6 — added later if needed.
    """
    if not attribs or not tail_bytes:
        return None
    attrib_lc = {a.lower() for a in attribs}
    # Same attrib gate as Parse7 — only emit when the template's attrib
    # actually uses a Power param. Plus 'null' (Parse6 lowers Grant_Power
    # to a Null-attrib placeholder when the binary stores the granted
    # power separately from the attribs list — see audit notes in
    # MULTI_DATASET_PLAN.md → "Vacuum-style pet conditional gates").
    is_power_attrib = bool(attrib_lc & _POWER_PARAM_ATTRIBS) or 'null' in attrib_lc
    if not is_power_attrib:
        return None

    # Inline-pascal scan: walk the tail looking for plausible string
    # records. A valid record has a length within reason, all printable
    # ASCII, and post-length padded to 4-byte alignment.
    found: list[str] = []
    seen: set[str] = set()
    pos = 0
    while pos + 2 <= len(tail_bytes):
        slen = struct.unpack_from('<H', tail_bytes, pos)[0]
        if 4 <= slen <= 200 and pos + 2 + slen <= len(tail_bytes):
            chars = tail_bytes[pos + 2:pos + 2 + slen]
            if all(32 <= b < 127 or b == 0 for b in chars):
                s = chars.rstrip(b'\x00').decode('ascii', errors='replace')
                if s and s not in seen and all(
                    c.isalnum() or c in '._- ' for c in s
                ):
                    found.append(s)
                    seen.add(s)
                # Advance past the string + alignment pad regardless of
                # whether we recorded it — the bytes were a valid pascal
                # string, so skipping byte-by-byte would re-decode it.
                pos += 2 + slen
                pos += (4 - (pos % 4)) % 4
                continue
        pos += 1

    power_names = [s for s in found if _looks_like_power_name(s)]
    if not power_names:
        return None
    return {'type': 'Power', 'power_names': power_names}


def _parse_effect_template(r: BinReader) -> EffectTemplate:
    """Parse a single attrib_mod template within an effect group."""
    # Attribs: u4_array where values are enum_index * 4
    raw_attribs = r.read_u4_array()
    attribs = [ATTRIB_NAME.get(v // 4, f"Unknown({v // 4})") for v in raw_attribs]

    # Aspect is encoded as value * 8 (byte offset into aspect table)
    aspect_raw = r.read_u4()
    aspect = ATTRIB_MOD_ASPECT.get(aspect_raw // 8, f"Unknown({aspect_raw})")

    # Remaining enums — preserve raw value when unmapped so we can investigate.
    # Field order is (application_type, type) — verified via Ghidra keyword
    # tables. The old parser had these labels swapped, which also explained
    # the ~20% type/application_type "mismatch" vs CoD2 (the mez "Magnitude
    # relabeled as Duration" story — CoD2 was right, parser was wrong).
    _app_raw = r.read_u4()
    app_type = ATTRIB_MOD_APPLICATION.get(_app_raw, f"Unknown({_app_raw})")
    _typ_raw = r.read_u4()
    typ = ATTRIB_MOD_TYPE.get(_typ_raw, f"Unknown({_typ_raw})")
    _target_raw = r.read_u4()
    target = ATTRIB_MOD_TARGET.get(_target_raw, f"Unknown({_target_raw})")

    # Unknown field between target and table (possibly near_ground or another flag)
    r.read_u4()

    # Table name (string) + numeric fields
    table = r.read_string()
    scale = r.read_f4()
    duration = r.read_f4()
    magnitude = r.read_f4()
    delay = r.read_f4()

    # The Ghidra AttribMod field descriptor (table at 0x1408ed5a0, type code
    # 0x500009) says DurationExpr and MagnitudeExpr are always string_arrays.
    # But treating them that way universally breaks ~430 powers — those
    # templates have a legit non-zero single-string offset in this slot that
    # a string_array read misinterprets as a huge count and overruns the
    # template buffer. So the binary file layout has a version/flag the
    # in-memory descriptor doesn't capture. Conservative rule that matches
    # the evidence: only read as string_arrays when _typ_raw says kExpression
    # (the only known case where these slots carry a compiled token stream).
    # Covers ~100+ templates on HC live; remaining 29 stack-mismatches are
    # Create_Entity templates whose discriminator is still unidentified.
    if _typ_raw == 3:
        r.read_u4_array()  # mag_expr_tokens
        r.read_u4_array()  # dur_expr_tokens
        dur_expr = ''
        mag_expr = ''
    else:
        dur_expr = r.read_string()
        mag_expr = r.read_string()

    # Tick fields
    app_period = r.read_f4()
    tick_chance = r.read_f4()
    tick_mul = r.read_f4()
    tick_add = r.read_f4()

    # DelayedRequires — Ghidra descriptor (0x1408ed5a0 row 17) types this as
    # string_array (0x500009), not a single string. Empty for most templates
    # (count=0 → 4 bytes, equivalent to old single-string read). For Create_Entity
    # / Summon / AoE-control templates with delayed conditionals (e.g.
    #   `DelayedRequires arch target> Class_Henchman_Lt eq … 18 tokens`)
    # the array contains the compiled token offsets. The old single-string
    # read shifted every downstream field by 4*N bytes, breaking stack reads
    # on ~29 pet-summon templates (Summon_Wolves, Paralyzing_Blast, etc.).
    r.read_u4_array()  # delayed_requires_tokens
    jit_requires = ''  # legacy field name kept to avoid churn; tokens not resolved here

    # Stack info — preserve raw value when unmapped so the unknown is debuggable
    _caster_stack_raw = r.read_u4()
    caster_stack = ATTRIB_MOD_CASTER_STACK.get(_caster_stack_raw, f"Unknown({_caster_stack_raw})")
    _stack_raw = r.read_u4()
    stack = ATTRIB_MOD_STACK.get(_stack_raw, f"Unknown({_stack_raw})")
    stack_limit = r.read_u4()
    stack_key = r.read_string() or None

    # AttribMod tail. Per the Ghidra-extracted struct descriptor, layout is:
    #   CancelEvents, RequiredEvent, Suppress, BoostModAllowed, Flags,
    #   Messages, FX, Params
    # Sizes verified empirically against Hide.def + Pool/Invisibility/Stealth.def
    # in 2026-04-22 audit. Tail-byte param scan is kept as a fallback for the
    # later fields (Flags / FX / Params) until those are fully decoded.

    # CancelEvents: u4_array of event enum IDs (see EVENT_NAME)
    cancel_event_ids = r.read_u4_array()
    cancel_events = [EVENT_NAME.get(v, f"Event_{v}") for v in cancel_event_ids]
    # RequiredEvent: single u4 (0 = none)
    _required_event_id = r.read_u4()
    required_events = (
        [EVENT_NAME.get(_required_event_id, f"Event_{_required_event_id}")]
        if _required_event_id != 0 else []
    )
    # Suppress: struct_array, each record 12 bytes (event_id u4, duration f4, flag u4).
    # NB: don't reuse the local `duration` name here — that's the AttribMod's
    # buff duration read earlier and used in the EffectTemplate constructor.
    _supp_count = r.read_u4()
    suppress_events: list[dict] = []
    try:
        for _ in range(_supp_count):
            rec_len = r.read_u4()
            sub_supp = r.sub_reader(rec_len)
            ev_id = sub_supp.read_u4()
            supp_duration = sub_supp.read_f4() if rec_len >= 8 else 0.0
            flag = sub_supp.read_u4() if rec_len >= 12 else 0
            suppress_events.append({
                "event": EVENT_NAME.get(ev_id, f"Event_{ev_id}"),
                "event_id": ev_id,
                "duration": supp_duration,
                "flag": flag,
            })
            r._pos += rec_len
    except Exception:
        # Defensive — if struct_array misalignment surfaces, stop parsing
        # the suppress array and let downstream still get whatever we have.
        pass

    # Tail layout after Suppress (verified against Hide.def + Granite_Armor +
    # Summon_Demonlings):
    #   BoostModAllowed (u4) — small enum index, 0 for ~99% of templates
    #   Flags (u4) — bitmask. Bit meanings not yet decoded; observed values
    #     suggest 32-bit flag word with combinations like 0x420 (most Hide
    #     AttribMods, ".def Flags IgnoreResistance"), 0x430 (Hide.def
    #     "Flags IgnoreStrength IgnoreResistance"). Stored raw for now.
    #   Then 2-3 zero-filled u4s of unknown semantic (Messages? Mode? counts?)
    #   Then FX struct_array (count + records) — count > 0 for templates
    #     with .def FX block; record sizes vary (16 bytes for Hide simple
    #     ContinuingFX, 40+ bytes for Create_Entity templates).
    #   Then Params (count + variable data, decoded heuristically below).
    # We capture BMA + raw Flags reliably and leave the rest to the
    # tail-byte heuristic scan that already works for Params (Power refs,
    # EntCreate entity defs).
    boost_mod_allowed_id = r.read_u4() if r.remaining() >= 4 else 0
    flags_raw = r.read_u4() if r.remaining() >= 4 else 0

    # Legacy fields preserved for downstream consumers — flags as a string
    # list is currently empty (bit decoding TBD); BMA exposed as a name
    # via the simple int → str conversion (won't conflict with any consumer
    # since it's never been populated before).
    boost_mod_allowed = str(boost_mod_allowed_id) if boost_mod_allowed_id else ""
    flags: list[str] = []
    mode_name = None

    tail_bytes = bytes(r._data[r._pos:r._end])
    r.skip_to_end()
    params = _extract_params(tail_bytes, attribs, r._strtab_base, r._strtab_data)

    return EffectTemplate(
        attribs=attribs,
        type=typ,
        application_type=app_type,
        aspect=aspect,
        target=target,
        table=table,
        scale=scale,
        duration=duration,
        magnitude=magnitude,
        delay=delay,
        duration_expression=dur_expr,
        magnitude_expression=mag_expr,
        application_period=app_period,
        tick_chance=tick_chance,
        tick_mag_multiplier=tick_mul,
        tick_mag_additive=tick_add,
        jit_requires=jit_requires,
        caster_stack=caster_stack,
        stack=stack,
        stack_limit=stack_limit,
        stack_key=stack_key,
        cancel_events=cancel_events,
        suppress_events=suppress_events,
        required_events=required_events,
        boost_mod_allowed=boost_mod_allowed,
        boost_mod_allowed_id=boost_mod_allowed_id,
        flags=flags,
        flags_raw=flags_raw,
        mode_name=mode_name,
        params=params,
    )


def _parse_effect_group(r: BinReader) -> EffectGroup:
    """Parse an effect group containing templates.

    Per the EffectGroup sub-descriptor at 0x1408ea180 (Ghidra dump in
    `bin_serializer_report.txt`), the leading fields are:
      Tag (string_array), DisplayInfo (string), Chance, PPM, Delay,
      RadiusInner, RadiusOuter, Requires, Flags, EvalFlags, AttribMod,
      Effect (recursive children).

    The previous version read DisplayInfo as a u4. For HC Parse7 a
    string IS a 4-byte offset, so this happened to consume the right
    number of bytes (just lost the semantic value). For Parse6 strings
    are inline pstrings of variable length — reading as u4 there
    cascades into a 99% misalignment that empties effects across the
    whole binary. Reading as string fixes it for both formats.
    """
    tags = r.read_string_array()
    _display_info = r.read_string()

    # Effect header
    chance = r.read_f4()
    ppm = r.read_f4()
    delay = r.read_f4()
    radius_inner = r.read_f4()
    radius_outer = r.read_f4()

    # Requires expression
    req_parts = r.read_string_array()
    requires = " ".join(req_parts) if req_parts else ""

    # Flags and eval_flags
    flags_val = r.read_u4()
    eval_flags = r.read_u4()

    # Determine PvP flag from flags_val
    is_pvp = PVP_FLAG.get(flags_val, "EITHER")
    flags = []
    if flags_val == 1:
        flags = ["PVEOnly"]
    elif flags_val == 2:
        flags = ["PVPOnly"]

    # Templates struct_array
    templates = []
    tmpl_count = r.read_u4()
    for _ in range(tmpl_count):
        tmpl_len = r.read_u4()
        tmpl_reader = r.sub_reader(tmpl_len)
        try:
            tmpl = _parse_effect_template(tmpl_reader)
            templates.append(tmpl)
        except Exception:
            pass  # Skip unparseable templates
        r.skip(tmpl_len)

    # Nested effect groups (recursive). The .def grammar allows `Effect { ... }`
    # inside another `Effect { ... }` (e.g. Chance/Requires-gated sub-effects);
    # the binary mirrors this with a struct_array of child groups right after
    # the templates array. Without this read, ~1700 powers (35%) lost the
    # AttribMods buried inside nested Effects (BS_Bash, Crowd_Control, …).
    child_groups = []
    try:
        child_count = r.read_u4()
        for _ in range(child_count):
            child_len = r.read_u4()
            child_reader = r.sub_reader(child_len)
            try:
                child = _parse_effect_group(child_reader)
                child_groups.append(child)
            except Exception:
                pass
            r.skip(child_len)
    except Exception:
        pass  # No nested-groups field — older or empty effect group

    # Skip any remaining effect group data (tail beyond children — usually 0).
    r.skip_to_end()

    return EffectGroup(
        chance=chance,
        ppm=ppm,
        delay=delay,
        radius_inner=radius_inner,
        radius_outer=radius_outer,
        requires_expression=requires,
        flags=flags,
        is_pvp=is_pvp,
        eval_flags=eval_flags,
        templates=templates,
        child_groups=child_groups,
    )


def _parse_redirects(r: BinReader) -> list[dict]:
    """Parse the Redirect struct_array from a power record.

    Each element: power_name (string) + requires token list (string_array) +
    show_in_info (u4). The condition_expression is:
      - 'Always' when requires is empty or a tautology (`['1']`). This is the
        CoD2 convention the downstream converter matches via `=== 'Always'`.
      - Otherwise the space-joined RPN tokens (e.g.
        'Redirects.X source.ownPower? !') — the downstream converter only
        uses condition_expression for two sentinel checks ('Always' to prefer
        the default, and 'kHitPoints' substring to skip dead-state
        conditionals), so full infix normalization isn't required.

    Guarded against wrong-position reads: count > 1000 or elem_len > remaining
    raises so the caller can fall back to skip_to_end().
    """
    out = []
    count = r.read_u4()
    if count > 1000:
        raise ValueError(f"implausible redirect count {count} — wrong position?")
    for _ in range(count):
        elem_len = r.read_u4()
        if elem_len > (r._end - r._pos):
            raise ValueError(f"redirect elem_len {elem_len} exceeds remaining {r._end - r._pos}")
        er = r.sub_reader(elem_len)
        try:
            power_name = er.read_string()
            req_tokens = er.read_string_array()
            show_raw = er.read_u4()
            if not req_tokens or req_tokens == ['1']:
                cond = 'Always'
            else:
                cond = ' '.join(req_tokens)
            out.append({
                'name': power_name,
                'condition_expression': cond,
                'show_in_info': bool(show_raw & 0xff),
            })
        except Exception:
            pass
        r.skip(elem_len)
    return out


def _parse_effects(r: BinReader) -> tuple[list[EffectGroup], list[EffectGroup]]:
    """Parse the effects and activation_effects struct_arrays from a power record.

    The binary stores two parallel top-level structures:
    - regular `Effect` blocks (main effects struct_array)
    - `ActivationEffect` blocks (separate keyword block in the .def grammar;
      stored in a second struct_array immediately after the main effects)

    Returns (effects, activation_effects) as two distinct lists so the
    converter can treat them with different semantics (redirect-follow,
    self-buff filtering).

    NOTE: _parse_power MUST read the redirect pre-field + redirect struct_array
    BEFORE calling this, since they sit between modes_suspended and the effects
    struct_array in the record layout. Previously this function called
    skip_struct_array() + read_u4() here, but that was silently absorbing the
    redirect data (and happened to work by luck only when redirects were empty).
    """
    effects = []
    # Effects struct_array
    eff_count = r.read_u4()
    for _ in range(eff_count):
        eff_len = r.read_u4()
        eff_reader = r.sub_reader(eff_len)
        try:
            eg = _parse_effect_group(eff_reader)
            effects.append(eg)
        except Exception:
            pass  # Skip unparseable effect groups
        r.skip(eff_len)

    # ActivationEffects struct_array — same layout as regular effects.
    # Wrapped in try since not every power has this field present (older or
    # alternate layouts), and we don't want to abort parsing the rest of the
    # record over a missing optional structure.
    activation_effects = []
    try:
        act_count = r.read_u4()
        for _ in range(act_count):
            eff_len = r.read_u4()
            eff_reader = r.sub_reader(eff_len)
            try:
                eg = _parse_effect_group(eff_reader)
                activation_effects.append(eg)
            except Exception:
                pass
            r.skip(eff_len)
    except Exception:
        pass

    return effects, activation_effects


def _parse_cast_flags(r: BinReader) -> list[str]:
    """Parse cast_flags structure (52 bytes) and return cast-through list."""
    # Layout: near_ground(4) + target_near_ground(4) + 1+3 bytes bitfield
    #   + cast_through_hold(4) + cast_through_sleep(4) + cast_through_stun(4)
    #   + cast_through_terrorize(4) + toggle_ignore_hold(4) + toggle_ignore_sleep(4)
    #   + toggle_ignore_stun(4) + ignore_level_bought(4) + shoot_through_untouchable(4)
    #   + interrupt_like_sleep(4)
    # Total: 4+4 + 1+3 + 10×4 = 52 bytes
    r.skip(8)   # near_ground + target_near_ground
    r.skip(4)   # bitfield (castable_dead_or_alive etc.)
    cast_through_hold = r.read_bool()
    cast_through_sleep = r.read_bool()
    cast_through_stun = r.read_bool()
    cast_through_terrorize = r.read_bool()
    r.skip(24)  # 6 remaining bools: toggle_ignore_* + ignore_level_bought + shoot_through + interrupt_like_sleep

    cast_through = []
    if cast_through_hold: cast_through.append("hold")
    if cast_through_sleep: cast_through.append("sleep")
    if cast_through_stun: cast_through.append("stun")
    if cast_through_terrorize: cast_through.append("terror")
    return cast_through


def _parse_power(r: BinReader, *, has_field_45b: bool = True, has_field_41b: bool = False) -> PowerRecord:
    """Parse a single power record (HC Parse7 layout)."""

    # 1. key (string) — full_name
    full_name = r.read_string()
    # 2. crc (u4)
    r.read_u4()
    # 3. source (string)
    r.read_string()
    # 4. name (string)
    name = r.read_string()
    # 5. source_name (string)
    source_name = r.read_string()
    # 6. system (u4)
    r.read_u4()
    # 7. auto_issue (bool)
    auto_issue = r.read_bool()
    # 8. auto_issue_save_level (bool)
    auto_issue_keeps_level = r.read_bool()
    # 9. free (bool)
    r.read_bool()
    # 10. display (string) — display_name
    display_name = r.read_string()
    # 11. help (string) — display_help
    display_help = r.read_string()
    # 12. short_help (string)
    short_help = r.read_string()
    # 13. target_help (string)
    r.read_string()
    # 14. target_short_help (string)
    r.read_string()
    # 15. attacker_attack (string)
    r.read_string()
    # 16. attacker_attack_floater (string)
    r.read_string()
    # 17. attacker_hit (string)
    r.read_string()
    # 18. victim_hit (string)
    r.read_string()
    # 19. confirm (string)
    r.read_string()
    # 20. float_rewarded (string)
    r.read_string()
    # 21. power_defense_float (string)
    r.read_string()
    # 22. icon (string)
    icon = r.read_string()
    # 23. type (u4 enum power_type)
    power_type = r.read_u4()
    # 24. num_allowed (u4)
    num_allowed = r.read_u4()
    # 25. attack_types (attrib_array = u4 count + u4 values)
    attack_types = r.read_u4_array()
    # 26. buy_requires (string_array) — "requires"
    requires_parts = r.read_string_array()
    requires = " ".join(requires_parts) if requires_parts else ""
    # 27. activate_requires (string_array)
    activate_requires_parts = r.read_string_array()
    activate_requires = " ".join(activate_requires_parts) if activate_requires_parts else ""
    # 28. slot_requires (string_array). Boost (IO piece) records carry
    # `BoostsSlotted>X <= 0` constraints here when the piece is unique
    # within a slot pool — used by the IO-set extractor to detect uniqueness.
    slot_requires_parts = r.read_string_array()
    slot_requires = " ".join(slot_requires_parts) if slot_requires_parts else ""
    # 29. target_requires (string_array)
    target_requires_parts = r.read_string_array()
    target_requires = " ".join(target_requires_parts) if target_requires_parts else ""
    # 30. reward_requires (string_array)
    r.read_string_array()
    # 31. auction_requires (string_array)
    r.read_string_array()
    # 32. reward_fallback (string)
    r.read_string()
    # 33. accuracy (f4)
    accuracy = r.read_f4()
    # 34. cast_flags (52 bytes)
    cast_through = _parse_cast_flags(r)
    # 35. ai_report (u4)
    r.read_u4()
    # 35b. HC extra field (u4)
    r.read_u4()
    # 36. effect_area (u4 enum)
    effect_area = r.read_u4()
    # 37. max_targets_hit (u4)
    max_targets_hit = r.read_u4()
    # 38. chain_effect_array (string_array)
    r.read_string_array()
    # 38b-d. HC extra fields (3 × u4)
    r.skip(12)
    # 39. radius (f4)
    radius = r.read_f4()
    # 40. arc (f4)
    arc = r.read_f4()
    # 41. chain_delay (f4)
    r.read_f4()
    # 41b. HC experimental 2026: 8 bytes (likely f4 + u4, often (1.0f, 0))
    if has_field_41b:
        r.skip(8)
    # 42. chain_eff (string_array)
    r.read_string_array()
    # 43. chain_fork (string_array)
    r.read_string_array()
    # 43b. HC extra: u4_array
    r.read_u4_array()
    # 43c. HC extra: u4_array (boost indices for chain powers; empty for non-chain)
    r.read_u4_array()
    # 44. box_offset (f4 × 3)
    r.skip(12)
    # 45. box_size (f4 × 3)
    r.skip(12)
    # 45b. HC extra field added in ~2025 patch (u4)
    if has_field_45b:
        r.read_u4()
    # 46. range (f4)
    range_val = r.read_f4()
    # 47. range_secondary (f4)
    range_secondary = r.read_f4()
    # 48. time_to_activate (f4)
    time_to_activate = r.read_f4()
    # 48b. HC extra field (f4)
    r.read_f4()
    # 49. recharge_time (f4)
    recharge_time = r.read_f4()
    # 50. activate_period (f4)
    activate_period = r.read_f4()
    # 51. endurance_cost (f4)
    endurance_cost = r.read_f4()
    # 52. idea_cost (f4)
    r.read_f4()
    # 52b. HC extra field (u4)
    r.read_u4()
    # 53. time_to_confirm (u4)
    r.read_u4()
    # 54. self_confirm (u4)
    r.read_u4()
    # 55. confirm_requires (string_array)
    r.read_string_array()
    # 56. destroy_on_limit (bool)
    r.read_bool()
    # 57. stacking_usage (bool)
    r.read_bool()
    # 58. num_charges (u4)
    r.read_u4()
    # 59. max_num_charges (u4)
    r.read_u4()
    # 60. usage_time (f4)
    r.read_f4()
    # 61. max_usage_time (f4)
    r.read_f4()
    # 62. lifetime (f4)
    r.read_f4()
    # 63. max_lifetime (f4)
    r.read_f4()
    # 64. lifetime_in_game (f4)
    r.read_f4()
    # 65. max_lifetime_in_game (f4)
    r.read_f4()
    # 66. interrupt_time (f4)
    interrupt_time = r.read_f4()
    # 67. target_visibility (u4)
    target_visibility = r.read_u4()
    # 68. target (target_type = u4)
    target_type = r.read_u4()
    # 69. target_secondary (target_type = u4)
    target_type_secondary = r.read_u4()
    # 70. auto_hit (target_type_array)
    targets_autohit = r.read_u4_array()
    # 71. affected (target_type_array)
    targets_affected = r.read_u4_array()
    # 72. targets_through_vision_phase (bool)
    r.read_bool()
    # 73. boosts_allowed (boost_type_array)
    boosts_raw = r.read_u4_array()
    boosts_allowed = [BOOST_TYPE.get(v, f"Unknown({v})") for v in boosts_raw]
    # 74. mode_group_refs (u4_array of small integer indices — NOT
    # allowed_boostset_cats as this field was previously labeled). Empty for
    # ~97% of powers; non-empty on mode/stance-setting powers (Hide, Bio Armor
    # adaptations, Dual Pistols ammo modes, etc.) where the values index into
    # a mode/group enum whose table we haven't located yet. Decoding this
    # wrong as a string_array was the source of the long-standing "boostset
    # cats = olumnEndgame.NictusFX" garbage — the small ints resolved as
    # string-table offsets happened to land mid-string in FX-path data.
    #
    # `allowed_boostset_cats` does not exist in the binary at all. In the
    # live game, the categories an IO set can slot into are determined at
    # runtime from the set's own `category` string (see boostsets.bin) plus
    # the power's boost types. The planner converter does this inference —
    # see `inferAllowedSetCategories` in scripts/convert-powerset.cjs.
    r.read_u4_array()
    allowed_boostset_cats: list[str] = []

    # 75-78. exclusion_groups, modes_required, modes_disallowed, modes_suspended (u4_arrays)
    r.read_u4_array()  # exclusion_groups
    r.read_u4_array()  # modes_required
    r.read_u4_array()  # modes_disallowed
    r.read_u4_array()  # modes_suspended

    # Redirect pre-field (always 0 in samples) + Redirect struct_array —
    # top-level Redirect{Power..Requires..} blocks from the .def. Used by
    # dual-mode powers (sniper slow/fast variants, Energy_Transfer, etc.).
    # Per-element layout: power_name (string) + requires_tokens (string_array)
    # + show_in_info (u4, 0xff=true). The old parser collapsed these into
    # _parse_effects's skip_struct_array+read_u4 pre-fields, which worked
    # only when redirects were empty — for non-empty redirects the whole
    # effects parse would misalign and silently produce 0 effects.
    #
    # On parse failure: skip to end of record rather than risking a hang on
    # garbage counts in _parse_effects.
    r.read_u4()  # redirect pre-field (0 in all samples checked)
    try:
        redirects = _parse_redirects(r)
    except Exception:
        redirects = []
        r.skip_to_end()

    # Parse effects
    try:
        effects, activation_effects = _parse_effects(r)
    except Exception:
        effects = []
        activation_effects = []

    # Skip remaining metadata after effects
    r.skip_to_end()

    return PowerRecord(
        full_name=full_name,
        name=name,
        source_name=source_name,
        display_name=display_name,
        display_help=display_help,
        short_help=short_help,
        icon=icon,
        power_type=power_type,
        num_allowed=num_allowed,
        auto_issue=auto_issue,
        auto_issue_keeps_level=auto_issue_keeps_level,
        attack_types=attack_types,
        requires=requires,
        activate_requires=activate_requires,
        target_requires=target_requires,
        effect_area=effect_area,
        max_targets_hit=max_targets_hit,
        range=range_val,
        range_secondary=range_secondary,
        radius=radius,
        arc=arc,
        time_to_activate=time_to_activate,
        recharge_time=recharge_time,
        activate_period=activate_period,
        endurance_cost=endurance_cost,
        interrupt_time=interrupt_time,
        accuracy=accuracy,
        target_type=target_type,
        target_type_secondary=target_type_secondary,
        target_visibility=target_visibility,
        targets_autohit=targets_autohit,
        targets_affected=targets_affected,
        boosts_allowed=boosts_allowed,
        allowed_boostset_cats=allowed_boostset_cats,
        cast_through=cast_through,
        slot_requires=slot_requires,
        effects=effects,
        activation_effects=activation_effects,
        redirects=redirects,
    )


def _parse_effect_template_parse6(r: BinReader) -> EffectTemplate:
    """Parse a single AttribMod (effect template) — Parse6/Rebirth layout.

    Per the Ghidra-extracted depth=1 AttribMod descriptor at 0x1408e8a10
    (`bin_serializer_report.txt`). Critical differences from Parse7:

    - **No EffectGroup wrapper.** Parse6 stores effects as a flat
      struct_array of AttribMods directly under each Power. The
      Tag/DisplayInfo/Chance/PPM/Delay/RadiusInner/RadiusOuter/Requires/
      Flags/EvalFlags grouping was added in HC's newer schema.
    - **Different field order.** Parse6 uses the depth=1 descriptor row
      order, which puts Name/DisplayAttackerHit/DisplayVictimHit/
      DisplayFloat/DisplayAttribDefenseFloat first, then ShowFloaters,
      Attrib, Aspect, etc. This is more verbose than Parse7's depth=2
      descriptor (used inside EffectGroup).
    - **Name is a single inline string in Parse6**, not a string_array
      (despite the descriptor labeling it 0x500009). Empirically verified
      by hand-decoding multiple records.
    - **No DurationExpr/MagnitudeExpr**. Those are HC additions for
      expression-based magnitudes; Parse6 has Duration immediately
      followed by Magnitude.

    The downstream `EffectTemplate` shape is HC-shaped, so we map Parse6
    fields into the closest HC equivalents and fill the rest with
    sensible defaults.
    """
    # Header strings (5)
    _name = r.read_string()
    _attacker_msg = r.read_string()
    _victim_msg = r.read_string()
    _float_msg = r.read_string()
    _adef_float_msg = r.read_string()

    # Display flags + core attrib/aspect/target enums
    _show_floaters = r.read_bool()
    attrib_raw = r.read_u4()
    # Parse6 stores Attrib as a single u4 = index*4 (same scaling as HC).
    attribs = [ATTRIB_NAME.get(attrib_raw // 4, f"Unknown({attrib_raw // 4})")]
    aspect_raw = r.read_u4()
    # Parse6 uses value*4 encoding (4-byte aspect-table entries) vs HC's
    # value*8. Distribution across 21,559 Rebirth records: top values
    # are 0, 8, 16, 12, 4 — all multiples of 4 — confirming the older
    # 4-byte runtime layout.
    aspect = ATTRIB_MOD_ASPECT.get(aspect_raw // 4, f"Unknown({aspect_raw})")
    _boost_ignore_diminishing = r.read_bool()
    target_raw = r.read_u4()
    target = ATTRIB_MOD_TARGET.get(target_raw, f"Unknown({target_raw})")

    # Table + scale + application/type
    table = r.read_string()
    scale = r.read_f4()
    app_raw = r.read_u4()
    app_type = ATTRIB_MOD_APPLICATION.get(app_raw, f"Unknown({app_raw})")
    typ_raw = r.read_u4()
    typ = ATTRIB_MOD_TYPE.get(typ_raw, f"Unknown({typ_raw})")

    # Tick fields — note the Parse6 order is Delay/Period/Chance (no
    # TickChance/TickMultiplier/TickAdditive — those are HC additions).
    delay = r.read_f4()
    app_period = r.read_f4()
    chance = r.read_f4()

    # CancelOnMiss + CancelEvents
    _cancel_on_miss = r.read_bool()
    cancel_event_ids = r.read_u4_array()
    cancel_events = [EVENT_NAME.get(v, f"Event_{v}") for v in cancel_event_ids]

    # Boolean flag block — 9 bools per descriptor:
    #   NearGround, AllowStrength, AllowResistance,
    #   UseMagnitudeResistance, UseDurationResistance,
    #   AllowCombatMods, UseMagnitudeCombatMods, UseDurationCombatMods,
    #   BoostTemplate
    _bool_block = [r.read_bool() for _ in range(9)]

    # Requires (RPN tokens) + two unused string_arrays
    requires_tokens = r.read_string_array()
    jit_requires = ' '.join(requires_tokens) if requires_tokens else ''
    _primary_str_list = r.read_string_array()
    _secondary_str_list = r.read_string_array()

    # Stack info
    caster_stack_raw = r.read_u4()
    caster_stack = ATTRIB_MOD_CASTER_STACK.get(caster_stack_raw, f"Unknown({caster_stack_raw})")
    stack_raw = r.read_u4()
    stack = ATTRIB_MOD_STACK.get(stack_raw, f"Unknown({stack_raw})")
    stack_limit = r.read_u4()
    stack_key_raw = r.read_u4()
    stack_key = str(stack_key_raw) if stack_key_raw else None

    # Duration + DurationExpr + Magnitude + MagnitudeExpr.
    #
    # The depth=1 descriptor at `0x1408e8a10` lists *Expr fields between
    # Duration and Magnitude. Parse6 keeps writing them as empty
    # string_arrays (count=0, 4 bytes each) even though the older
    # binary never carries an actual expression payload — the empty
    # count is part of the layout and must be consumed.
    #
    # Hand-decoded against Suffocate (Dominator/Water_Control): mag=3
    # (Mag-3 hold) lives at the byte that the previous parser was
    # reading as a different field, off by 8 bytes. Adding the two
    # empty string_array reads here aligns it correctly.
    #
    # For mez attribs (Held, Immobilized, Sleep, Stunned, …), Parse6
    # uses **Scale as the base duration in seconds** and Magnitude as
    # the mez magnitude. Damage attribs use Scale as the damage table
    # multiplier with Magnitude=0 (typical). Downstream converters
    # already understand both conventions.
    duration = r.read_f4()
    r.read_string_array()  # DurationExpr (always empty in Parse6)
    magnitude = r.read_f4()
    r.read_string_array()  # MagnitudeExpr (always empty in Parse6)

    # Tail: RadiusInner/Outer, Suppress, ContinuingFX, ConditionalFX,
    # Power, Reward, Params, EntityDef, PriorityList[Passive], display-
    # only flags, BoostModAllowed, ProcsPerMinute. The full layout isn't
    # fully reverse-engineered for Parse6, but the Power slot is the only
    # field the planner cares about (it carries the granted-power dotted
    # name for Grant_Power / Null-attrib chance procs — Stalker Assassin's
    # Focus, Radiation Melee Contaminated, Beast Mastery Pack Mentality,
    # etc.). Scan the remaining bytes for inline-pascal strings that look
    # like power names; mirror's HC's `_extract_params` heuristic but
    # adapted to Parse6's inline string layout.
    tail_start = r._pos
    tail_end = r._end
    tail_bytes = bytes(r._data[tail_start:tail_end])
    r.skip_to_end()
    params = _extract_params_parse6(tail_bytes, attribs)

    return EffectTemplate(
        attribs=attribs,
        type=typ,
        application_type=app_type,
        aspect=aspect,
        target=target,
        table=table,
        scale=scale,
        duration=duration,
        magnitude=magnitude,
        delay=delay,
        application_period=app_period,
        tick_chance=chance,
        jit_requires=jit_requires,
        caster_stack=caster_stack,
        stack=stack,
        stack_limit=stack_limit,
        stack_key=stack_key,
        cancel_events=cancel_events,
        params=params,
    )


def _parse_effects_parse6(r: BinReader) -> tuple[list[EffectGroup], list[EffectGroup]]:
    """Parse Parse6 effects: a flat struct_array of AttribMod records.

    Wraps each AttribMod in a synthetic single-template EffectGroup so
    downstream consumers (convert-powerset.cjs) see the same shape as
    HC. ActivationEffect doesn't exist as a separate field in Parse6.
    """
    effects: list[EffectGroup] = []
    eff_count = r.read_u4()
    if eff_count > 1000:
        # Sanity: an unreasonable count means we're misaligned, not a
        # power with thousands of effects. Bail rather than allocate.
        raise ValueError(f"implausible Parse6 effect count {eff_count}")
    for _ in range(eff_count):
        elem_len = r.read_u4()
        if elem_len > r.remaining():
            raise ValueError(f"Parse6 effect elem_len {elem_len} > remaining")
        elem_reader = r.sub_reader(elem_len)
        try:
            tmpl = _parse_effect_template_parse6(elem_reader)
            # Synthetic group — Parse6 stores conditional gates (PvE vs PvP,
            # mode-active variants, drowning checks, etc.) on the
            # per-template `jit_requires` field, since there's no
            # EffectGroup wrapper to carry them. Lift them onto the
            # synthetic group's `requires_expression` so the downstream
            # converter (which only reads the group-level field) honors
            # the same PvE/PvP filtering it does on HC.
            #
            # HC's Parse7 carries an explicit `is_pvp` flag from the
            # binary; Parse6 doesn't, but encodes the same intent in the
            # template's RPN requires expression as `enttype target>
            # player eq` (PvP) or `enttype target> critter eq` (PvE).
            # Synthesize the equivalent flag so downstream filters
            # (`if (effect.is_pvp === 'PVP_ONLY') continue;`) work.
            req = tmpl.jit_requires or ''
            if 'target> player eq' in req:
                is_pvp = 'PVP_ONLY'
            elif 'target> critter eq' in req:
                is_pvp = 'PVE_ONLY'
            else:
                is_pvp = 'EITHER'
            effects.append(EffectGroup(
                chance=tmpl.tick_chance if tmpl.tick_chance > 0 else 1.0,
                requires_expression=req,
                is_pvp=is_pvp,
                templates=[tmpl],
            ))
        except Exception:
            pass  # Skip unparseable templates
        r.skip(elem_len)
    return effects, []


def _parse_power_parse6(r: BinReader) -> PowerRecord:
    """Parse a single power record (Parse6/Rebirth layout)."""

    # 1-9: Same as Parse7 minus HC extras
    full_name = r.read_string()
    r.read_u4()  # crc
    r.read_string()  # source
    name = r.read_string()
    source_name = r.read_string()
    r.read_u4()  # system
    auto_issue = r.read_bool()
    auto_issue_keeps_level = r.read_bool()
    r.read_bool()  # free
    display_name = r.read_string()
    display_help = r.read_string()
    short_help = r.read_string()
    for _ in range(9): r.read_string()  # 13-21
    icon = r.read_string()  # 22
    power_type = r.read_u4()  # 23
    num_allowed = r.read_u4()  # 24
    attack_types = r.read_u4_array()  # 25
    requires_parts = r.read_string_array()  # 26
    requires = " ".join(requires_parts) if requires_parts else ""
    activate_requires_parts = r.read_string_array()  # 27
    activate_requires = " ".join(activate_requires_parts) if activate_requires_parts else ""
    # 28. slot_requires (string_array). Boost (IO piece) records carry
    # `BoostsSlotted>X <= 0` constraints here when the piece is unique
    # within a slot pool — read by the IO-set extractor for per-piece uniqueness.
    slot_requires_parts = r.read_string_array()  # 28
    slot_requires = " ".join(slot_requires_parts) if slot_requires_parts else ""
    target_requires_parts = r.read_string_array()  # 29
    target_requires = " ".join(target_requires_parts) if target_requires_parts else ""
    r.read_string_array()  # 30
    r.read_string_array()  # 31
    r.read_string()  # 32
    accuracy = r.read_f4()  # 33
    cast_through = _parse_cast_flags(r)  # 34
    r.read_u4()  # 35 ai_report
    # (NO 35b in Parse6)
    effect_area = r.read_u4()  # 36
    max_targets_hit = r.read_u4()  # 37
    # (NO 38 chain_effect_array or 38b-d in Parse6)
    radius = r.read_f4()  # 39
    arc = r.read_f4()  # 40
    r.read_f4()  # 41 chain_delay
    r.read_string_array()  # 42
    r.read_string_array()  # 43
    r.read_u4_array()  # 43b
    r.skip(8)  # 44-45 box (Parse6: 2×f4 = 8 bytes)
    range_val = r.read_f4()  # 46
    range_secondary = r.read_f4()  # 47
    time_to_activate = r.read_f4()  # 48
    # (NO 48b in Parse6 — Ghidra descriptor shows TimeToRoot here, but
    # adding it shifts every following record into garbage and reduces
    # parsed-record count, so Parse6 is genuinely omitting it. Likely a
    # default-suppression flag on the field. Tracked in MULTI_DATASET_PLAN.)
    recharge_time = r.read_f4()  # 49
    activate_period = r.read_f4()  # 50
    endurance_cost = r.read_f4()  # 51
    r.read_f4()  # 52 idea_cost
    # (NO 52b in Parse6 — same caveat as 48b)
    r.read_u4()  # 53
    r.read_u4()  # 54
    r.read_string_array()  # 55
    r.read_bool()  # 56
    r.read_bool()  # 57
    r.read_u4(); r.read_u4()  # 58-59
    for _ in range(6): r.read_f4()  # 60-65
    interrupt_time = r.read_f4()  # 66
    target_visibility = r.read_u4()  # 67
    target_type = r.read_u4()  # 68
    target_type_secondary = r.read_u4()  # 69
    targets_autohit = r.read_u4_array()  # 70
    targets_affected = r.read_u4_array()  # 71
    r.read_bool()  # 72
    boosts_raw = r.read_u4_array()  # 73
    # Parse6 (Rebirth) uses a different BOOST_TYPE enum than Parse7 (HC) —
    # see _enums.py BOOST_TYPE_REBIRTH for the divergence.
    boosts_allowed = [BOOST_TYPE_REBIRTH.get(v, f"Unknown({v})") for v in boosts_raw]
    # 74: u4_array of mode/group refs (see HC parser comment). Not
    # allowed_boostset_cats — that field doesn't exist in the binary.
    r.read_u4_array()
    allowed_boostset_cats: list[str] = []

    # Parse6 tail. Hand-decoded against the binary 2026-05-02:
    # The HC powers.bin descriptor at 0x1408f04f0 lists fields between
    # BoostsAllowed and Effect as GroupMembership/RechargeGroup/
    # ModesRequired/ModesDisallowed/ModesSuspended/AIGroups/Redirect/
    # Effect/ActivationEffect — but **Parse6 omits AIGroups, Redirect,
    # and ActivationEffect entirely**. Those wrapping-and-routing fields
    # were added in the HC schema generation; the older Parse6 binary
    # goes straight from ModesSuspended to a flat struct_array of
    # AttribMod records (no EffectGroup wrapper, no ActivationEffect).
    # See `_parse_effect_template_parse6` for the AttribMod layout.
    effects: list[EffectGroup] = []
    activation_effects: list[EffectGroup] = []
    redirects: list[dict] = []
    try:
        # Field 74 (GroupMembership) was already consumed in the loop
        # above; resume from RechargeGroup.
        r.read_u4_array()  # RechargeGroup
        r.read_u4_array()  # ModesRequired
        r.read_u4_array()  # ModesDisallowed
        r.read_u4_array()  # ModesSuspended
        try:
            effects, activation_effects = _parse_effects_parse6(r)
        except Exception:
            effects = []
            activation_effects = []
    except Exception:
        pass

    r.skip_to_end()

    return PowerRecord(
        full_name=full_name,
        name=name,
        source_name=source_name,
        display_name=display_name,
        display_help=display_help,
        short_help=short_help,
        icon=icon,
        power_type=power_type,
        num_allowed=num_allowed,
        auto_issue=auto_issue,
        auto_issue_keeps_level=auto_issue_keeps_level,
        attack_types=attack_types,
        requires=requires,
        activate_requires=activate_requires,
        target_requires=target_requires,
        effect_area=effect_area,
        max_targets_hit=max_targets_hit,
        range=range_val,
        range_secondary=range_secondary,
        radius=radius,
        arc=arc,
        time_to_activate=time_to_activate,
        recharge_time=recharge_time,
        activate_period=activate_period,
        endurance_cost=endurance_cost,
        interrupt_time=interrupt_time,
        accuracy=accuracy,
        target_type=target_type,
        target_type_secondary=target_type_secondary,
        target_visibility=target_visibility,
        targets_autohit=targets_autohit,
        targets_affected=targets_affected,
        boosts_allowed=boosts_allowed,
        allowed_boostset_cats=allowed_boostset_cats,
        cast_through=cast_through,
        slot_requires=slot_requires,
        effects=effects,
        activation_effects=activation_effects,
        redirects=redirects,
    )
