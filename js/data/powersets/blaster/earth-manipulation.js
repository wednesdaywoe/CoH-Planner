/**
 * Earth Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_EARTH_MANIPULATION_POWERSET = {
    name: "Earth Manipulation",
    category: "Unknown",
    description: "Earth Manipulation powerset",
    icon: "earth-manipulation_set.png",
    powers: [
        {
            name: "Heavy Mallet",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "Your control over the earth allows you to form a mallet of solid stone. This Stone Mallet deals high damage and can knock down weak foes.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, High DMG(Smashing), Knockback",
            icon: "earthmanip_heavymallet.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.33,
                damage: {
                    type: "Smashing",
                    scale: 4.0908999999999995
                }
            }
        },
        {
            name: "Stone Prison",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizes a single target within an earthy formation and deals some Smashing damage over time. Some more resilient foes may require multiple attacks to Immobilize. Stone Prison can also reduce a target's Defense.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Moderate DoT(Smash), Foe Immobilize, -DEF, -Fly",
            icon: "earthmanip_stoneprison.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.23,
                dotDamage: {
                    type: "Smashing",
                    scale: 0.4842,
                    ticks: 4
                },
                buffDuration: 9.2,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Salt Crystals",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Sleep"],
            description: "Attempts to encrust all nearby foes in a Pillar of Salt. The victims will remain encased within the salt for quite a while, but will automatically break free if attacked. Affected targets have reduced defense for a while, even if they break free.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required against AVs and players, as well as to make secondary effects apply.</color><br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Foe Sleep, -DEF",
            icon: "earthmanip_saltcrystals.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 15.6,
                cast: 1.07,
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Build Up",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit",
            icon: "earthmanip_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Tremor",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can cause a localized earthquake immediately around you. This will deal moderate damage to every foe in melee range, while knocking them back.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Light DMG(Smashing), Knockback",
            icon: "earthmanip_tremor.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.53,
                damage: {
                    type: "Smashing",
                    scale: 2.1324
                }
            }
        },
        {
            name: "Mud Bath",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Slow Movement"],
            description: "While this power is active, you draw upon the geothermal power of the Earth to create a bubbling pool of hot mud around you. All foes in melee range will become snared and entrapped in the mud, slowing them down. You recover a small amount of health every few seconds while this power is active.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: PBAoE, -SPD, Self +Heal Over Time, +Recovery",
            icon: "earthmanip_mudbath.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 2.03,
                buffDuration: 5.0
            }
        },
        {
            name: "Beryl Crystals",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Activating this power summons several rare Beryl Crystals to orbit around you. These Crystals can bring clarity of the mind and increase your Accuracy, Perception to see hidden foes, and grant resistance to Confusion, Perception and ToHit debuffs.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self Res(Confuse, Perception, ToHit), +Perception, Accuracy",
            icon: "earthmanip_beryl.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 0.73,
                protection: {
                    confuse: 7.266
                },
                buffDuration: 0.75,
                tohitBuff: 1.0
            }
        },
        {
            name: "Fracture",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Stuns"],
            description: "You can Fracture the ground around an enemy, disorienting all affected targets for a good while. You must be on the ground to activate this power.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Disorient, -DEF",
            icon: "earthmanip_fracture.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                range: 70.0,
                recharge: 90.0,
                endurance: 10.4,
                cast: 1.0,
                defenseDebuff: 1.0,
                buffDuration: 10.0,
                stun: 3.0
            }
        },
        {
            name: "Seismic Smash",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Melee Damage", "Universal Damage Sets"],
            description: "This massive attack hits with all the force of the Earth itself. It deals tremendous amounts of damage and may Hold the target if they are not defeated outright.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Smashing), Foe Hold",
            icon: "earthmanip_seismicsmash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.5,
                damage: {
                    type: "Smashing",
                    scale: 5.8099
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/earth-manipulation'] = BLASTER_EARTH_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_EARTH_MANIPULATION_POWERSET = BLASTER_EARTH_MANIPULATION_POWERSET;
}