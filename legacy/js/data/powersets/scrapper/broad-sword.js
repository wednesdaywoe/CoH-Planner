/**
 * Broad Sword
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_BROAD_SWORD_POWERSET = {
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 8.2218
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 8.9598
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 5.9818
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 6.4318
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 6.8820000000000014
                        },
                        {
                            type: "Fire",
                            scale: 0.5535
                        }
                    ],
                    scale: 7.435500000000001
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
            allowedSetCategories: ["Defense Sets", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 5.4218
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 5.7998
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Confront",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Challenges a foe to attack you. Useful to pull a villain off an ally who finds themselves in over their head. A To Hit check required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged, Foe Taunt",
            icon: "sword_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 3.0,
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 6.6495999999999995
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 7.0996
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 9.9998
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 10.8818
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You perform a devastating Head Splitter attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce its Defense. This attack has an exceptionally good critical hit capability, better than other Broadsword attacks, that can sometimes deal double damage. The power of this attack can actually extend a short distance through multiple foes.",
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
                            scale: 10.3818
                        },
                        {
                            type: "Fire",
                            scale: 1.17
                        }
                    ],
                    scale: 11.5518
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/broad-sword'] = SCRAPPER_BROAD_SWORD_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_BROAD_SWORD_POWERSET = SCRAPPER_BROAD_SWORD_POWERSET;
}