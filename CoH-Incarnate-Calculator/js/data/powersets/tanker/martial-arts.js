/**
 * Martial Arts
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_MARTIAL_ARTS_POWERSET = {
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
            allowedSetCategories: ["Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You can unleash a roundhouse kick that pummels your foe for moderate damage. Storm Kick boosts the Tanker's defense against melee, ranged and area of effect damage slightly for a short period of time after hitting their foe. This bonus defense doesn't stack with itself and is unenhanceable.",
            shortHelp: "Melee, DMG(Smash), Self +Defense(Melee, Ranged, AoE)",
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
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Thunder Kick",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You can perform a strong Thunder Kick that hits so hard it can Disorient your target.",
            shortHelp: "Melee, DMG(Smash), Disorient",
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
                },
                stun: 2.0
            }
        },
        {
            name: "Cobra Strike",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
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
                },
                stun: 3.0
            }
        },
        {
            name: "Warrior's Provocation",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunts a foe, and some nearby foes, to attack you. Useful for pulling villains off an ally who find themselves in over their head. Taunted foes tend to ignore other Heroes and focus on you for quite a while, so use this power cautiously. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "martialarts_warriorsprovocation.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.67,
                buffDuration: 20.0
            }
        },
        {
            name: "Crane Kick",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You can perform a slow, high damage kick that will likely knock your target back.",
            shortHelp: "Melee, DMG(Smash), Knockback",
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
            name: "Dragon's Tail",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "This low spinning kick deals slightly more damage than Thunder Kick, but has a chance to hit all enemies in melee range. Successful hits may trip and knock down your opponents.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
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
                            scale: 0.5319
                        }
                    ],
                    scale: 2.6273
                }
            }
        },
        {
            name: "Focus Chi",
            available: 23,
            tier: 5,
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
            name: "Crippling Axe Kick",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Immobilize", "Melee Damage", "Slow Movement", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
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
            name: "Eagles Claw",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You can perform a devastating kick that can severely Disorient most opponents. After using Eagle's Claw your damage will be increased for a brief moment allowing the next attack or two to cause additional damage.",
            shortHelp: "Melee, DMG(Smash), Foe Disorient, +DMG(All)",
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
                buffDuration: 3.0,
                stun: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/martial-arts'] = TANKER_MARTIAL_ARTS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_MARTIAL_ARTS_POWERSET = TANKER_MARTIAL_ARTS_POWERSET;
}