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
    BOOST_TYPE, TARGET_TYPE, ATTRIB_NAME,
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

    # Cancel events, boost_mod_allowed, flags, etc.
    # These are the remaining fields — skip to end for now and add them later
    # as we verify the layout with more test powers
    cancel_events = []
    suppress_events = []
    required_events = []
    boost_mod_allowed = ""
    flags = []
    mode_name = None
    params = None

    # Skip remaining template data
    r.skip_to_end()

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
        flags=flags,
        mode_name=mode_name,
        params=params,
    )


def _parse_effect_group(r: BinReader) -> EffectGroup:
    """Parse an effect group containing templates."""
    # Leading fields: a `Tags` string_array (def keyword: `Tag "foo"`), then a
    # one-u4 slot whose meaning we haven't nailed down (always 0 in samples
    # we've walked). Old parser assumed the first 8 bytes were two u4 "pre"
    # fields — which happens to be correct when Tags is empty (count=0), but
    # shifts every downstream field by 4 bytes per populated tag. Surfaces
    # e.g. in Crowd_Control's `PVP_MainTargetOnly`-tagged nested effect,
    # where the shift drops the whole nested-group parse and loses its
    # AttribMod.
    tags = r.read_string_array()
    _post_tags = r.read_u4()

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


def _parse_effects(r: BinReader) -> list[EffectGroup]:
    """Parse the effects struct_array from a power record.

    Also pulls the trailing `ActivationEffect` struct_array (a parallel top-
    level structure in the .def grammar — separate keyword block from regular
    `Effect`). The binary stores it immediately after the main effects array.
    The ActivationEffect groups are flattened into the same returned list so
    downstream code (and audit) sees one unified set.
    """
    # Pre-field 1: struct_array (recharge_groups or similar).
    # When empty: u4(0). When populated: u4(count) + [u4(len) + data]* per element.
    r.skip_struct_array()
    # Pre-field 2: u4 (unknown scalar, typically 0)
    r.read_u4()

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
    try:
        act_count = r.read_u4()
        for _ in range(act_count):
            eff_len = r.read_u4()
            eff_reader = r.sub_reader(eff_len)
            try:
                eg = _parse_effect_group(eff_reader)
                effects.append(eg)
            except Exception:
                pass
            r.skip(eff_len)
    except Exception:
        pass

    return effects


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
    # 28. slot_requires (string_array)
    r.read_string_array()
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
    # 74. allowed_boostset_cats (string_array)
    allowed_boostset_cats = r.read_string_array()

    # 75-78. exclusion_groups, modes_required, modes_disallowed, modes_suspended (u4_arrays)
    r.read_u4_array()  # exclusion_groups
    r.read_u4_array()  # modes_required
    r.read_u4_array()  # modes_disallowed
    r.read_u4_array()  # modes_suspended

    # Parse effects
    try:
        effects = _parse_effects(r)
    except Exception:
        effects = []

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
        effects=effects,
    )


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
    r.read_string_array()  # 28
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
    # (NO 48b in Parse6)
    recharge_time = r.read_f4()  # 49
    activate_period = r.read_f4()  # 50
    endurance_cost = r.read_f4()  # 51
    r.read_f4()  # 52 idea_cost
    # (NO 52b in Parse6)
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
    boosts_allowed = [BOOST_TYPE.get(v, f"Unknown({v})") for v in boosts_raw]
    allowed_boostset_cats = r.read_string_array()  # 74

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
    )
