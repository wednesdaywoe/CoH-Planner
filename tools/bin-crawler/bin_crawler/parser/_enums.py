"""Enum mappings extracted from Parse7 .ksy format specifications."""

EFFECT_AREA: dict[int, str] = {
    0: "SingleTarget",
    1: "Cone",
    2: "Sphere",
    3: "Location",
    4: "Chain",
    5: "Volume",
    6: "NamedVolume",
    7: "Map",
    8: "Room",
    9: "Touch",
    10: "Box",
}

POWER_TYPE: dict[int, str] = {
    0: "Click",
    1: "Auto",
    2: "Toggle",
    3: "Boost",
    4: "Inspiration",
    5: "GlobalBoost",
}

BOOST_TYPE: dict[int, str] = {
    0: "Science",
    1: "Mutation",
    2: "Magic",
    3: "Technology",
    4: "Natural",
    5: "Accuracy",
    6: "Buff_Defense",
    7: "Buff_ToHit",
    8: "Confuse",
    9: "Damage",
    10: "Debuff_Defense",
    11: "Debuff_ToHit",
    12: "Fear",
    13: "SpeedFlying",
    14: "Heal",
    15: "Immobilize",
    16: "Jump",
    17: "Knockback",
    18: "Recharge",
    19: "SpeedRunning",
    20: "Sleep",
    21: "Stun",
    22: "Range",
    23: "EnduranceDiscount",
    24: "Buff_Damage",
    25: "Debuff_Damage",
    26: "Radius",
    27: "Cone",
    28: "Taunt",
    29: "Slow",
    30: "Hold",
    31: "Intangible",
    32: "Interrupt",
    33: "Recovery",
    34: "Endurance_Drain",
    35: "Res_Damage",
    36: "Hamidon",
    37: "Incarnate_Judgement",
    38: "Incarnate_Interface",
    39: "Incarnate_Lore",
    40: "Incarnate_Destiny",
}

# Rebirth's BOOST_TYPE enum diverges from HC at TWO insertion points:
#   - position 10 (shifts every HC value ≥10 up by 1)
#   - position 36 (additional shift, so HC values ≥35 end up +2 from HC)
#
# Element-wise comparison on Arachnos_Soldier.Burst confirms the +1 shift
# for low values:
#
#   HC      [23, 22, 18, 10, 9, 5]   = EndDisc, Range, Recharge, DebuffDef, Damage, Accuracy
#   Rebirth [24, 23, 19, 11, 9, 5]   ← +1 on every value ≥10
#
# The +2 shift for high values shows up on resistance toggles like
# Brute Dark Armor / Dark Embrace:
#
#   HC      [35, 23, 18]              = Res_Damage, EndDisc, Recharge
#   Rebirth [37, 24, 19]              ← Res_Damage at 37 (+2), others +1
#
# Position 10 in Rebirth is used only by `Boosts.Attuned_Return_From_The_Grave_*`
# (Halloween-event self-rez set) — actual label unknown.
# Position 36 in Rebirth is used by `Inherent.Rest` and the Halloween
# `Attuned_Inexhaustibility_A` boost set — the second Rebirth-only addition,
# label unknown.
BOOST_TYPE_REBIRTH: dict[int, str] = {
    0: "Science",
    1: "Mutation",
    2: "Magic",
    3: "Technology",
    4: "Natural",
    5: "Accuracy",
    6: "Buff_Defense",
    7: "Buff_ToHit",
    8: "Confuse",
    9: "Damage",
    10: "Rebirth_Boost_10",  # placeholder — Rebirth-only event-set boost
    11: "Debuff_Defense",
    12: "Debuff_ToHit",
    13: "Fear",
    14: "SpeedFlying",
    15: "Heal",
    16: "Immobilize",
    17: "Jump",
    18: "Knockback",
    19: "Recharge",
    20: "SpeedRunning",
    21: "Sleep",
    22: "Stun",
    23: "Range",
    24: "EnduranceDiscount",
    25: "Buff_Damage",
    26: "Debuff_Damage",
    27: "Radius",
    28: "Cone",
    29: "Taunt",
    30: "Slow",
    31: "Hold",
    32: "Intangible",
    33: "Interrupt",
    34: "Recovery",
    35: "Endurance_Drain",
    36: "Rebirth_Boost_36",  # placeholder — second Rebirth-only addition (Rest, Inexhaustibility set)
    37: "Res_Damage",
    38: "Hamidon",
    39: "Incarnate_Judgement",
    40: "Incarnate_Interface",
    41: "Incarnate_Lore",
    42: "Incarnate_Destiny",
}

# Event IDs used in AttribMod CancelEvents and Suppress arrays.
# Mapped by cross-referencing parsed IDs against .def file event names
# (see: Pool/Invisibility/Stealth, Stalker_Defense/Ninjitsu/Hide, etc.).
# Mapping is partial — IDs we haven't confirmed yet are passed through as ints.
EVENT_NAME: dict[int, str] = {
    1: "ActivateAttackClick",
    2: "Attacked",
    4: "Helped",
    17: "HitByFoe",
    21: "Damaged",
    23: "Stunned",
    25: "Held",
    26: "Sleep",
    27: "Confused",
    33: "MissionObjectInteract",
    37: "MissionObjectClick",
    41: "CommandedPet",
    47: "PseudoPetAttacked",
    48: "PseudoPetHelped",
}

ATTRIB_NAME: dict[int, str] = {
    # Binary stores attrib indices as value * 4 (byte offsets).
    # Divide binary value by 4 to get the index used here.
    # Verified by cross-referencing 7,687 powers against CoD2 data.

    # Damage types (0-16)
    0: "Smashing_Dmg",
    1: "Lethal_Dmg",
    2: "Fire_Dmg",
    3: "Cold_Dmg",
    4: "Energy_Dmg",
    5: "Negative_Energy_Dmg",
    6: "Psionic_Dmg",
    7: "Heal_Dmg",
    8: "Special_Dmg",
    9: "Toxic_Dmg",
    10: "Radiation_Dmg",
    11: "Electrical_Dmg",
    12: "Sonic_Dmg",
    13: "Quantum_Dmg",
    14: "Unique1_Dmg",
    15: "Unique2_Dmg",

    # Core character attribs (20-36)
    20: "HitPoints",
    21: "Absorb",
    22: "Endurance",
    24: "Rage",
    25: "ToHit",
    26: "Ranged",          # Positional defense
    27: "Melee",           # Positional defense
    28: "Area",            # Positional defense
    29: "Smashing",        # Typed defense
    30: "Lethal",
    31: "Fire",
    32: "Cold",
    33: "Energy",
    34: "Negative_Energy",
    35: "Psionic",
    36: "Toxic",

    # Movement & misc (46-62)
    46: "Base_Defense",
    47: "RunningSpeed",
    48: "FlyingSpeed",
    50: "JumpingSpeed",
    51: "JumpHeight",
    52: "MovementControl",
    53: "MovementFriction",
    54: "Stealth",
    55: "StealthRadius_PVE",
    56: "StealthRadius_PVP",
    57: "PerceptionRadius",
    58: "Regeneration",
    59: "Recovery",
    61: "ThreatLevel",
    62: "Taunt",
    63: "Placate",

    # Status effects (64-76)
    64: "Confused",
    65: "Afraid",
    66: "Terrorized",
    67: "Held",
    68: "Immobilized",
    69: "Stunned",
    70: "Sleep",
    71: "Fly",
    72: "Jump Pack",
    73: "Teleport",
    74: "Untouchable",
    75: "Intangible",
    76: "OnlyAffectsSelf",

    # XP/Influence (77-79)
    77: "ExperienceGain",
    78: "InfluenceGain",
    79: "PrestigeGain",

    # Combat (80-92)
    80: "Evade",
    81: "Knockup",
    82: "Knockback",
    83: "Repel",
    84: "Accuracy",
    87: "Range",
    90: "RechargeTime",
    92: "EnduranceDiscount",

    # Meter & Elusivity (94-115)
    94: "Meter",
    95: "Ranged_Elusivity",
    96: "Melee_Elusivity",
    97: "Area_Elusivity",
    98: "Smashing_Elusivity",
    99: "Lethal_Elusivity",
    100: "Fire_Elusivity",
    101: "Cold_Elusivity",
    102: "Energy_Elusivity",
    103: "Negative_Energy_Elusivity",
    104: "Psionic_Elusivity",
    115: "ElusivityBase",

    # Meta/scripting region (indices 117-128) — SUPERSEDED. These entries look
    # "multi-purpose" only because `raw // 4` collapses them: unlike normal
    # (4-byte-aligned) attribs, the engine packs several distinct "special"
    # attribs into each of these indices and discriminates them with the low
    # 2 bits of the raw value (raw % 4). Dividing by 4 throws that sub-index
    # away and merges 2-4 unrelated attribs into one. Resolve special attribs
    # via SPECIAL_ATTRIB_BY_RAW / resolve_attrib() below (keyed on the RAW
    # value), NOT these collapsed entries — kept only for reference / any direct
    # index reader. See HOMECOMING_PARSER.md "attrib-118 misdecode".
    117: "Create_Entity",        # really the +1 slot; see SPECIAL_ATTRIB_BY_RAW
    118: "Set_Mode",             # really the +1 slot
    119: "Null",
    120: "Grant_Power",          # NB: the +2 slot (raw 482) is the OPPOSITE, Revoke_Power
    121: "Global_Chance_Mod",
    122: "Combat_Phase",
    123: "Recharge_Power",
    124: "Designer_Status",
    125: "Add_Behavior",
    126: "Set_Token",
    127: "Cancel_Effects",       # really Cancel_Mods (raw 511)
    128: "Execute_Power",
}


# ---------------------------------------------------------------------------
# Special-attrib region — byte-granular sub-index (HC / Parse7 & Veracity)
# ---------------------------------------------------------------------------
# Attrib indices 117-128 (raw u4 values 468-515) are NOT plain float-offset
# attribs. The engine packs several distinct "special" attribs into each
# collapsed `raw // 4` index and uses the low 2 bits (`raw % 4`) as a real
# sub-index. The normal decode path divides by 4 and so merges 2-4 unrelated
# attribs into one — the root cause of the historic "attrib-118 misdecode"
# (kXPDebtProtection / kSetCostume / kSetMode all landing on index 118) and of
# the broader "these indices are multi-purpose" note. This map keys the RAW u4
# value directly and MUST be consulted before the `// 4` lookup.
#
# Verified by cross-referencing every occurring special raw value against the
# HC `.powers` oracle (1,905 matched powers, 2026-07-04). A handful of rare
# raw values still lack an oracle name (475, 479, 485, 490, 501 — all count<=10
# NPC/prestige/proc edge cases) and fall through to "Special(<raw>)" rather than
# borrow a sibling's (wrong) name.
SPECIAL_ATTRIB_BY_RAW: dict[int, str] = {
    # idx 117
    468: "Translucency", 469: "Create_Entity", 470: "Clear_Damagers", 471: "Silent_Kill",
    # idx 118 (all three formerly collapsed to "Set_Mode")
    472: "XPDebtProtection", 473: "Set_Mode", 474: "Set_Costume",
    # idx 119
    476: "Null", 477: "Avoid", 478: "Reward",
    # idx 120 (482 Revoke_Power is the opposite of 481 Grant_Power)
    480: "Drop_Toggles", 481: "Grant_Power", 482: "Revoke_Power", 483: "Unset_Mode",
    # idx 121
    484: "Global_Chance_Mod", 486: "Grant_Boosted_Power", 487: "View_Attributes",
    # idx 122
    489: "Reward_Source_Team", 491: "Combat_Phase",
    # idx 123
    492: "Combat_Mod_Shift", 493: "Recharge_Power", 494: "Vision_Phase", 495: "Ninja_Run",
    # idx 124
    498: "Steam_Jump", 499: "Designer_Status",
    # idx 125
    500: "Exclusive_Vision_Phase", 502: "Set_Script_Value", 503: "Add_Behavior",
    # idx 126
    505: "Token_Add", 506: "Token_Set",
    # idx 127
    508: "Script_Notify", 509: "Force_Move", 511: "Cancel_Mods",
    # idx 128
    512: "Execute_Power",
}

# Raw-value window of the special region: 117*4 .. 128*4+3. A raw attrib value
# in this window is byte-granular and resolved via SPECIAL_ATTRIB_BY_RAW;
# everything else uses the 4-aligned ATTRIB_NAME lookup.
SPECIAL_ATTRIB_MIN = 468
SPECIAL_ATTRIB_MAX = 515


def resolve_attrib(raw: int) -> str:
    """Resolve a raw AttribMod attrib value (u4) to its attrib name.

    Normal attribs are stored as ``index * 4`` (4-byte-aligned); the special
    region (indices 117-128) is byte-granular, so those raw values are looked
    up directly. Unmapped special values become ``Special(<raw>)`` (honest
    unknown) rather than borrowing a collapsed-index sibling's name; unmapped
    normal values become ``Unknown(<index>)`` as before.
    """
    if SPECIAL_ATTRIB_MIN <= raw <= SPECIAL_ATTRIB_MAX:
        return SPECIAL_ATTRIB_BY_RAW.get(raw, f"Special({raw})")
    return ATTRIB_NAME.get(raw // 4, f"Unknown({raw // 4})")


# Rebirth (Parse6) keeps a slightly different attrib index layout. Empirically,
# the only divergence that affects player-visible data is the meta/scripting
# block being shifted -1 relative to HC: Rebirth puts Create_Entity at 116 vs
# HC's 117. Confirmed by matching template shape against HC Create_Entity
# (scale=-1, duration ~3-5s, aspect=Current, large entity-spawn powers like
# Omega_Maneuver, Dive_Attack pet-spawners). Without this map, Rebirth pool
# attack powers (Dive Attack, Blink Blitz) and pet summons surface as
# `Unknown(116)` and lose their `Pets_X` summon wiring downstream.
#
# Other Rebirth indices (91, ...) still report as Unknown until a player-
# visible bug surfaces; the unknown name reaches the converter as-is and is
# filtered out by attrib-type detection rather than producing wrong data.
ATTRIB_NAME_REBIRTH: dict[int, str] = {
    **ATTRIB_NAME,
    # Rebirth shifts Accuracy to 85 (HC: 84). Index 84 may still exist in
    # Rebirth as something else, but in every observed boost-piece context
    # 85 carries the Accuracy aspect. Confirmed by cross-referencing 802
    # Rebirth boost pieces (Rolling_Barrage_A, Bonesnap_A, etc.) — all
    # match the HC equivalent's Accuracy attrib exactly. The 254 non-boost
    # uses (5thColumn, BanishedPantheon critter defense toggles, aspect=
    # Resistance, scale=1, duration=999999) line up with HC's pattern of
    # the same attrib doing double duty as "accuracy-debuff resistance"
    # on AV/elite-boss defensive powers.
    #
    # Symptom before fix: every Acc/Dam (and Acc/Dmg/Rech, etc.) IO piece
    # on Rebirth surfaced as `Unknown(85)` and the io-sets extractor
    # heuristically mapped that to "Endurance" — making Rolling Barrage's
    # piece 1 read as "Damage/Endurance" instead of "Accuracy/Damage".
    85: "Accuracy",
    # Rebirth shifts Range to 88 (HC: 87) — the same +1 pattern as Accuracy.
    # Symptom before fix: Rebirth-only IO sets with a +Range set bonus
    # (Rolling Barrage 2-piece +7.5% Range, etc.) silently lost the tier
    # because the bonus extractor saw `Unknown(88)` and failed lookup.
    88: "Range",
    116: "Create_Entity",
}


# Thunderspy (Parse6-derived schema, Parse7 frame) keeps yet another attrib-index
# layout in its upper band. Its front string-attribs are decoded directly, but the
# post-`requires` affected-attribute INDEX array (see _parse_effect_template_thunderspy)
# is decoded via this map. The one player-visible divergence proven so far is
# **RechargeTime at 89** (HC/Rebirth: 90). Empirically confirmed: 837 index-array
# entries resolve to 89 and EVERY power carrying it is recharge-related — +recharge
# buffs (Hasten 0.7, Quickness/Lightning Reflexes 0.2, Accelerate Metabolism 0.3,
# Speed Boost 0.5, the Recharge_* temp powers) and -recharge slows (Siphon Speed,
# Cryonic Judgement, Liquefy). Without this, those all decoded as `Unknown(89)` and
# their recharge effect was silently dropped. Everything else matches HC's ATTRIB_NAME
# (defense positions, damage types, mez, Recovery/Regeneration/Endurance all verified
# to land on their HC indices), so we only override the single confirmed divergence
# rather than guess the rest of the band.
ATTRIB_NAME_THUNDERSPY: dict[int, str] = {
    **ATTRIB_NAME,
    89: "RechargeTime",
}

ATTRIB_MOD_TYPE: dict[int, str] = {
    # Verified via Ghidra keyword table at 0x1408eb958 in cityofheroes.exe —
    # values 0/1 were swapped in the old parser (the .ksy spec had them backwards),
    # which is the root cause of the "CoD2 re-labels Magnitude as Duration for mez
    # templates" confusion: the binary always stored Duration=0, and CoD2 was right.
    0: "Duration",
    1: "Magnitude",
    2: "Constant",
    3: "Expression",
}

ATTRIB_MOD_ASPECT: dict[int, str] = {
    # Binary stores aspect as value * 8 (byte offset).
    # Divide by 8 to get the index used here.
    0: "Current",
    1: "Maximum",
    2: "Strength",
    3: "Resistance",
    4: "Absolute",
}

ATTRIB_MOD_APPLICATION: dict[int, str] = {
    0: "Immediate",
    1: "OnTick",
    2: "OnActivate",
    3: "OnDeactivate",
    4: "OnEnable",
    5: "OnDisable",
    6: "OnExpire",
}

ATTRIB_MOD_TARGET: dict[int, str] = {
    0: "Self",
    1: "SelfAndPets",
    2: "TargetOnly",
    4: "AnyAffected",
    5: "AnyAffectedAndPets",
    6: "Caster",
}

ATTRIB_MOD_STACK: dict[int, str] = {
    # All 11 values verified via Ghidra keyword table at 0x1408ee708 in
    # cityofheroes.exe (24-byte rows: { const char* name, uint64 value }).
    # The bulk-audit-driven corrections below are all confirmed by this table.
    0: "Stack",
    1: "Ignore",
    2: "Extend",
    3: "Replace",
    4: "Overlap",
    5: "StackThenIgnore",
    6: "Refresh",
    7: "RefreshToCount",
    8: "Maximize",
    9: "Suppress",
    10: "Continuous",
    # kCollective is NOT in this enum — it belongs to ATTRIB_MOD_CASTER_STACK.
}

ATTRIB_MOD_CASTER_STACK: dict[int, str] = {
    0: "Individual",
    1: "Unlimited",
    2: "Collective",
}

PVP_FLAG: dict[int, str] = {
    0: "EITHER",
    1: "PVE_ONLY",
    2: "PVP_ONLY",
}

TARGET_TYPE: dict[int, str] = {
    0: "None",
    1: "Self",
    2: "Player",
    3: "PlayerHero",
    4: "PlayerVillain",
    5: "DeadPlayer",
    6: "DeadPlayerFriend",
    7: "DeadPlayerFoe",
    8: "Teammate",
    9: "DeadTeammate",
    10: "DeadOrAliveTeammate",
    11: "Villain",
    12: "DeadVillain",
    13: "NPC",
    14: "DeadOrAliveFriend",
    15: "DeadFriend",
    16: "Friend",
    17: "DeadOrAliveFoe",
    18: "DeadFoe",
    19: "Foe",
    20: "Location",
    21: "Any",
    22: "Teleport",
    23: "DeadOrAliveMyPet",
    24: "DeadMyPet",
    25: "MyPet",
    26: "MyOwner",
    27: "MyCreator",
    28: "MyCreation",
    29: "DeadMyCreation",
    30: "DeadOrAliveMyCreation",
    31: "Leaguemate",
    32: "DeadLeaguemate",
    33: "DeadOrAliveLeaguemate",
    34: "Position",
}
