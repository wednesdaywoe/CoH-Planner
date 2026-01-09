/**
 * Broad Sword
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_BROAD_SWORD_POWERSET = {
    name: "Broad Sword",
    category: "Unknown",
    description: "Broad Sword powerset",
    icon: "broad-sword_set.png",
    powers: [
        {
            name: "Hack",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You Hack your opponent for a high amount of damage. This attack can reduce a target's Defense, making him easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe -DEF",
            icon: "sword_hack.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 3.291
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 4.029
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Slash",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a quick Slash that can reduce a target's Defense, making him easier to hit. This attack causes moderate damage, but has a quick recharge time.",
            shortHelp: "Melee, DMG(Lethal), Foe -DEF",
            icon: "sword_slash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.491
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 2.9410000000000003
                },
                defenseDebuff: 1.0,
                buffDuration: 6.0
            }
        },
        {
            name: "Slice",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You Slice your sword in a wide arc, attacking all enemies in front of you. Slice does less damage than Hack but can hit multiple foes and reduce their defense.",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe -DEF",
            icon: "sword_slice.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.2689,
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.0,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.826
                        },
                        {
                            type: "Fire",
                            scale: 0.5535
                        }
                    ],
                    scale: 3.3795
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
            icon: "sword_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Parry",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Defense Sets", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You can use this power to Parry incoming melee attacks. The Parry itself does minor damage, but every successful hit will increase your Defense against melee and lethal attacks for a short while.",
            shortHelp: "Melee, DMG(Lethal), Self +DEF(Melee,Lethal)",
            icon: "sword_parry.png",
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
            name: "Taunt",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To-Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "broadsword_taunt.png",
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
            name: "Whirling Sword",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a Whirling Sword maneuver, attacking all foes in melee range. This attack wounds your opponents, causing them to take minor damage over time and reduces their defense.",
            shortHelp: "PBAoE Melee, DMG(Lethal), Foe -Def",
            icon: "sword_whirlingsword.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.7965
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 3.2465
                },
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.1,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.045,
                            ticks: 2
                        }
                    ]
                },
                buffDuration: 2.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Disembowel",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a powerful Disemboweling maneuver that deals a great amount of damage, and can knock a target up into the air. This attack can reduce a target's Defense, making him easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Knockup, Foe -DEF",
            icon: "sword_disembowel.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.8,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.0199
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 4.9018999999999995
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Head Splitter",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Knockback", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a devastating Head Splitter attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce its Defense. The power of this attack can actually extend a short distance through multiple foes.",
            shortHelp: "Melee, DMG(Lethal), Foe Knockback, -DEF",
            icon: "sword_headsplitter.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 0.3491,
            effects: {
                accuracy: 1.05,
                range: 10.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 5.1909
                        },
                        {
                            type: "Fire",
                            scale: 1.17
                        }
                    ],
                    scale: 6.3609
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/broad-sword'] = BRUTE_BROAD_SWORD_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_BROAD_SWORD_POWERSET = BRUTE_BROAD_SWORD_POWERSET;
}