/**
 * Ice Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_ICE_MANIPULATION_POWERSET = {
    name: "Ice Manipulation",
    category: "Unknown",
    description: "Ice Manipulation powerset",
    icon: "ice-manipulation_set.png",
    powers: [
        {
            name: "Chilblain",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Immobilize", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Immobilizes your target in an icy trap. Deals some damage over time and slightly Slows the target's attack and movement speed. Useful for keeping villains at bay.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Moderate DoT(Cold), Foe Immobilize, -SPD, -Recharge",
            icon: "icemanipulation_chillblains.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    type: "Cold",
                    scale: 0.4758,
                    ticks: 4
                },
                buffDuration: 9.2
            }
        },
        {
            name: "Frozen Fists",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Frozen Fists encrusts your hands in ice, giving them the ability to quickly inflict moderate damage on villains. The foe's attack and movement speed is Slowed, due to the chills caused by the cold blows.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, Moderate DMG(Cold/Smash), Foe -Recharge, -SPD",
            icon: "icemanipulation_frozenfist.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 2.2908
                        },
                        {
                            type: "Smashing",
                            scale: 1.0
                        }
                    ],
                    scale: 3.2908
                },
                buffDuration: 5.0
            }
        },
        {
            name: "Ice Sword",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You create a blade of solid ice that deals higher damage then Frozen Fists. Being hit by this Ice Sword will Slow a target's movement and attack speed, due to the intense chill.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Cold/Lethal), Foe -Recharge, -SPD",
            icon: "icemanipulation_icesword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 2.7308
                        },
                        {
                            type: "Lethal",
                            scale: 0.96
                        }
                    ],
                    scale: 3.6908
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Frigid Protection",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "Recharge"],
            allowedSetCategories: ["Accurate Healing", "Endurance Modification", "Healing", "Slow Movement"],
            description: "While active, you dramatically lower the temperature around yourself, Slowing the attack rate of all nearby foes, as well as their movement speed and damage. The air around your body becomes so cold that attacks deflect off of it, granting you absorption, while your body becomes extremely energy efficient, granting you bonus Recovery.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: PBAoE, Foe -Recharge, -Speed, -DMG, Self +Absorb over Time, +Recovery",
            icon: "icemanipulation_chillingembrace.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 0.73,
                buffDuration: 5.0
            }
        },
        {
            name: "Build Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit",
            icon: "icemanipulation_buildup.png",
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
            name: "Ice Patch",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "You emanate a patch of ice around you, which causes foes that step onto it to slip and fall down. This effect lasts until the ice melts. You must be near the ground to activate this power.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Location (PBAoE), Foe Knockdown",
            icon: "icemanipulation_icepatch.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 2.0,
                recharge: 35.0,
                endurance: 10.4,
                cast: 1.57,
                buffDuration: 30.0
            }
        },
        {
            name: "Shiver",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Slow Movement"],
            description: "You can blast forth a wide cone of chilling air that dramatically Slows the movement and attack rate of nearby foes.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Foe -SPD, -Recharge",
            icon: "icemanipulation_shiver.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 2.3562,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 12.0,
                endurance: 10.4,
                cast: 2.17,
                buffDuration: 18.0
            }
        },
        {
            name: "Freezing Touch",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Melee Damage", "Universal Damage Sets"],
            description: "This Freezing Touch will encase a single foe in a block of ice. This will deal minor damage as well as freezing them in their tracks, leaving them cold and helpless.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Cold), Foe Hold",
            icon: "icemanipulation_freezingtouch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.0,
                damage: {
                    type: "Cold",
                    scale: 0.75
                },
                dotDamage: {
                    type: "Cold",
                    scale: 0.2582,
                    ticks: 10
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Frozen Aura",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Sleep", "Universal Damage Sets"],
            description: "Your mastery of cold enables you to dramatically lower the temperature immediately around you. Foes near you when you perform a Frozen Aura will be caught in a fragile casing of ice. Frozen foes will break free if attacked. Frozen Aura deals no significant damage.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color><br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE Melee, Moderate DMG(Smashing), Foe Sleep",
            icon: "icemanipulation_frozenaura.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.1,
                damage: {
                    type: "Cold",
                    scale: 1.068
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/ice-manipulation'] = BLASTER_ICE_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_ICE_MANIPULATION_POWERSET = BLASTER_ICE_MANIPULATION_POWERSET;
}