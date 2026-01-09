/**
 * Katana
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_KATANA_POWERSET = {
    name: "Katana",
    category: "Unknown",
    description: "Katana powerset",
    icon: "katana_set.png",
    powers: [
        {
            name: "Gambler's Cut",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a quick slash with your katana. This attack is very fast, but deals only minor damage. This attack can reduce a target's Defense, making them easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe -Def",
            icon: "katana_slash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.67,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.9145,
                            ticks: 1
                        },
                        {
                            type: "Fire",
                            scale: 0.189,
                            ticks: 1
                        }
                    ]
                },
                buffDuration: 0.3,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Sting of the Wasp",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a standard attack with your katana. This attack is slower than Gambler's Cut, but deals more damage. Sting of the Wasp can reduce a target's Defense, making them easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe -Def",
            icon: "katana_hack.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 1.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.5789999999999997
                        },
                        {
                            type: "Fire",
                            scale: 0.522
                        }
                    ],
                    scale: 3.101
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Flashing Steel",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You swing your katana in a wide arc in front of you, slicing multiple foes. This attack can reduce a target's Defense, making them easier to hit.",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe -Def",
            icon: "katana_slice.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.2689,
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.032,
                cast: 1.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.0884
                        },
                        {
                            type: "Fire",
                            scale: 0.4455
                        }
                    ],
                    scale: 2.5339
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Build Up",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "katana_buildup.png",
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
            name: "Divine Avalanche",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Defense Sets", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You can use your katana to parry incoming melee attacks and then quickly return the favor. Divine Avalanche does minor damage, but every successful hit will increase your Defense against melee and lethal attacks for a short while.",
            shortHelp: "Melee, DMG(Lethal), Self +DEF (Melee, Lethal)",
            icon: "katana_parry.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.291
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 2.669
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Dragon's Roar",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "katana_tauntaoe.png",
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
            name: "The Lotus Drops",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform The Lotus Drops maneuver, attacking all foes in melee range. This attack wounds your opponents, causing them to take moderate damage over time and reduces their Defense.",
            shortHelp: "PBAoE Melee, Moderate DMG(Lethal), Foe -Def",
            icon: "katana_whirlingsword.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 14.0,
                endurance: 13.0,
                cast: 1.83,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.2805
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 2.7305
                },
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.12,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.054,
                            ticks: 2
                        }
                    ]
                },
                buffDuration: 2.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Soaring Dragon",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a powerful Soaring Dragon maneuver that deals a great amount of damage, and can knock a target up into the air. This attack can reduce a target's Defense, making them easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe Knockup, -DEF",
            icon: "katana_disembowel.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 9.0,
                endurance: 9.36,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 3.491
                        },
                        {
                            type: "Fire",
                            scale: 0.81
                        }
                    ],
                    scale: 4.301
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Golden Dragonfly",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Knockback", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a devastating Golden Dragonfly attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce their Defense. The power of this attack can actually extend a short distance through multiple foes.",
            shortHelp: "Melee, DMG(Lethal), Foe Knockback, -DEF",
            icon: "katana_headsplitter.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 0.3491,
            effects: {
                accuracy: 1.05,
                range: 10.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.83,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.441
                        },
                        {
                            type: "Fire",
                            scale: 1.026
                        }
                    ],
                    scale: 5.467
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/katana'] = BRUTE_KATANA_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_KATANA_POWERSET = BRUTE_KATANA_POWERSET;
}