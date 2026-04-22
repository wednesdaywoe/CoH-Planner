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

    # Meta/scripting (117-128)
    # These indices are multi-purpose: the binary engine uses one index for several
    # CoD2-distinct attrib names. CoD2 disambiguates by context (effect type, aspect, etc.).
    # Names here are the most common CoD2 match for each index.
    117: "Create_Entity",        # CoD2 also: Translucency, Silent_Kill, Clear_Damagers
    118: "Set_Mode",             # CoD2 also: Set_Costume, Debt_Protection
    119: "Null",                 # CoD2 also: Avoid, Reward, Debt
    120: "Grant_Power",          # CoD2 also: Revoke_Power, Drop_Toggles
    121: "Global_Chance_Mod",    # CoD2 also: View_Attributes, Grant_Boosted_Power
    122: "Combat_Phase",         # CoD2 also: Reward_Source_Team, Clear_Fog
    123: "Recharge_Power",       # CoD2 also: Level_Shift, Vision_Phase, Ninja_Run
    124: "Designer_Status",      # CoD2 also: Steam_Jump
    125: "Add_Behavior",         # CoD2 also: Exclusive_Vision_Phase, Set_Script_Value
    126: "Set_Token",            # CoD2 also: Add_Token
    127: "Cancel_Effects",       # CoD2 also: Script_Notify, Force_Move
    128: "Execute_Power",
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
