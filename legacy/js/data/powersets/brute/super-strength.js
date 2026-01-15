/**
 * Super Strength
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_SUPER_STRENGTH_POWERSET = {
    name: "Super Strength",
    category: "Unknown",
    description: "Super Strength powerset",
    icon: "super-strength_set.png",
    powers: [
        {
            name: "Jab",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "A quick jab that deals minor damage, but has a chance of Disorienting the target, especially if coupled with other attacks.",
            shortHelp: "Melee, DMG(Smashing), Minor Disorient",
            icon: "superstrength_jab.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 2.0,
                endurance: 3.536,
                cast: 1.07,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.9090000000000003
                        },
                        {
                            type: "Fire",
                            scale: 0.306
                        }
                    ],
                    scale: 2.2150000000000003
                },
                stun: 2.0
            }
        },
        {
            name: "Punch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Your Super Strength Punch can deal a moderate amount of damage, but most of all can knock your opponent off their feet, unable to attack again until they stand up.",
            shortHelp: "Melee, DMG(Smashing), Knockback",
            icon: "superstrength_punch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.2,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.4
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 2.85
                }
            }
        },
        {
            name: "Haymaker",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "A slow but devastating attack, the Haymaker has a great chance of knocking your opponent down.",
            shortHelp: "Melee, DMG(Smashing), Knockback",
            icon: "superstrength_haymaker.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.5,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 3.41
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 4.148
                }
            }
        },
        {
            name: "Hand Clap",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Knockback", "Stuns", "Threat Duration"],
            description: "You can clap your hands together with such force that you create a deafening shockwave. This shockwave can knock back nearby foes, and they have a chance to become Disoriented due to the shock to the inner ear. Hand Clap deals no damage.",
            shortHelp: "PBAoE, Foe Disorient, Knockback",
            icon: "superstrength_handclap.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                recharge: 30.0,
                endurance: 13.0,
                cast: 1.23,
                damage: {
                    type: "Fire",
                    scale: 0.4871
                },
                stun: 2.0
            }
        },
        {
            name: "Knockout Blow",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Holds", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You can perform a Knockout Blow on your opponent. This punch does Superior damage, and has a great chance of Holding your target.",
            shortHelp: "Melee, DMG(Smashing), Foe Hold",
            icon: "superstrength_knockoutblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 13.2,
                recharge: 25.0,
                endurance: 18.512,
                cast: 2.23,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 6.5209
                        },
                        {
                            type: "Fire",
                            scale: 1.602
                        }
                    ],
                    scale: 8.1229
                }
            }
        },
        {
            name: "Taunt",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "superstrength_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.67,
                buffDuration: 12.0
            }
        },
        {
            name: "Rage",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "A Rage comes over you, sending you into a berserker fury. While Raging, your damage and chance to hit is dramatically increased. However, when your Rage subsides, you are left with reduced Defense, drained of some of your Endurance, and your attacks are substantially weakened.",
            shortHelp: "Self +DMG, +To Hit, Delayed Self(Weaken, Special)",
            icon: "superstrength_rage.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 1.0,
                recharge: 240.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 2.0,
                buffDuration: 120.0,
                defenseBuff: 0.2
            }
        },
        {
            name: "Hurl",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Ranged Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You are able to tear up a chunk of ground beneath your feet and Hurl it at an enemy. This attack deals high damage, and can knock foes back and even drop them out of the air if they are flying.",
            shortHelp: "Ranged, DMG(Smashing), Knockback, -Fly",
            icon: "superstrength_hurl.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 9.36,
                cast: 2.5,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 3.6159
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 4.353899999999999
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Foot Stomp",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Using your superior leg strength, you can Stomp your foot to the ground, quaking the earth itself. This is a localized attack against everything in melee range.",
            shortHelp: "PBAoE Melee, DMG(Smashing), Knockback",
            icon: "superstrength_footstomp.png",
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
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.9457
                        },
                        {
                            type: "Fire",
                            scale: 0.639
                        }
                    ],
                    scale: 3.5846999999999998
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/super-strength'] = BRUTE_SUPER_STRENGTH_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_SUPER_STRENGTH_POWERSET = BRUTE_SUPER_STRENGTH_POWERSET;
}