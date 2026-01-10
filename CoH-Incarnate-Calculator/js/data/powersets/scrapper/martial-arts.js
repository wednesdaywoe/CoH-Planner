/**
 * Martial Arts
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_MARTIAL_ARTS_POWERSET = {
    name: "Martial Arts",
    category: "Unknown",
    description: "Martial Arts powerset",
    icon: "martial-arts_set.png",
    powers: [
        {
            name: "Storm Kick",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You can unleash a roundhouse kick that pummels your foe for moderate damage. Storm Kick has a greater then average chance to score a critical hit.",
            shortHelp: "Melee, DMG(Smash)",
            icon: "martialarts_stormkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.5410000000000004
                        },
                        {
                            type: "Fire",
                            scale: 0.594
                        }
                    ],
                    scale: 3.1350000000000002
                }
            }
        },
        {
            name: "Thunder Kick",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You can perform a strong Thunder Kick that hits so hard it can Disorient your target.",
            shortHelp: "Melee, DMG(Smash), Minor Disorient",
            icon: "martialarts_thunderkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.9409999999999998
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 2.319
                }
            }
        },
        {
            name: "Cobra Strike",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Using intense martial arts focus, you can perform a Cobra Strike that deals high damage, but has a great chance of Disorienting your target.",
            shortHelp: "Melee, DMG(Smash), Foe Disorient",
            icon: "martialarts_cobrastrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 3.9289
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 4.8109
                }
            }
        },
        {
            name: "Focus Chi",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Tapping into your inner Chi greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "martialarts_focuschi.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 2.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Crane Kick",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You can perform a slow, high damage kick that will likely knock your target back.",
            shortHelp: "Melee, High DMG(Smash), Knockback",
            icon: "martialarts_cranekick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 3.9289
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 4.8109
                }
            }
        },
        {
            name: "Warriors Challenge",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Challenges a foe to attack you. Useful to pull a villain off an ally who finds themselves in over their head. A To Hit check required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged, Foe Taunt",
            icon: "martialarts_warrior'schallenge.png",
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
            name: "Crippling Axe Kick",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Immobilize", "Melee Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You can perform a Crippling Axe Kick that deals superior smashing damage, reduces the targets defense, may Immobilize, and Slowing their run speed. Crippling Axe Kick may also knock some flying entities out of the sky.",
            shortHelp: "Melee, DMG(Smash), Foe Immobilize, -SPD, -Fly, -DEF",
            icon: "martialarts_cripplinghookkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.6,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 4.0799
                        },
                        {
                            type: "Fire",
                            scale: 0.954
                        }
                    ],
                    scale: 5.0339
                },
                buffDuration: 8.0,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Dragon's Tail",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "This low spinning kick deals slightly more damage than Thunder Kick, but has a chance to hit all enemies in melee range. Successful hits may trip and knock down your opponents.",
            shortHelp: "PBAoE Melee, DMG(Smash), Foe Knockback",
            icon: "martialarts_monkeysweep.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 14.0,
                endurance: 13.52,
                cast: 1.5,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.0953999999999997
                        },
                        {
                            type: "Fire",
                            scale: 0.5318
                        }
                    ],
                    scale: 2.6271999999999998
                }
            }
        },
        {
            name: "Eagles Claw",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You can perform a devastating kick that can severely Disorient most opponents. Eagle's Claw has an exceptionally good critical hit capability, better than other Martial Arts attacks, that can sometimes deal double damage.",
            shortHelp: "Melee, DMG(Smash), Foe Minor Disorient, +Special",
            icon: "martialarts_eaglesclaw.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 2.53,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 4.930999999999999
                        },
                        {
                            type: "Fire",
                            scale: 1.026
                        }
                    ],
                    scale: 5.956999999999999
                },
                stun: 3.0,
                buffDuration: 2.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/martial-arts'] = SCRAPPER_MARTIAL_ARTS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_MARTIAL_ARTS_POWERSET = SCRAPPER_MARTIAL_ARTS_POWERSET;
}