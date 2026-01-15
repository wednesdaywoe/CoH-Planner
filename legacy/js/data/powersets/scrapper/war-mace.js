/**
 * War Mace
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_WAR_MACE_POWERSET = {
    name: "War Mace",
    category: "Unknown",
    description: "War Mace powerset",
    icon: "war-mace_set.png",
    powers: [
        {
            name: "Bash",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You perform a Bashing attack with your mace that deals moderate damage, and can sometimes Disorient your opponent.",
            shortHelp: "Melee, DMG(Smash), Minor Disorient",
            icon: "mace_bash.png",
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
                            type: "Smashing",
                            scale: 5.6988
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 6.1488000000000005
                },
                stun: 2.0
            }
        },
        {
            name: "Pulverize",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You attempt to Pulverize your opponent. This attack is slower than Bash but causes more damage. It also has a chance of Disorienting your opponent for a brief time.",
            shortHelp: "Melee, DMG(Smash), Minor Disorient",
            icon: "mace_pulverize.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.5,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 8.1238
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 8.861799999999999
                },
                stun: 2.0
            }
        },
        {
            name: "Jawbreaker",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "This upward swing attempts to shatter your opponent's jaw, and has a chance to send him flying upwards into the air.",
            shortHelp: "Melee, DMG(Smash), Knockup",
            icon: "mace_jawbreaker.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.83,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 9.6466
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 10.528599999999999
                }
            }
        },
        {
            name: "Build Up",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Scrapper Archetype Sets", "To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "mace_buildup.png",
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
            name: "Clobber",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You Clobber your foe with a massive swing of your mace. This attack deals exceptional damage and can leave most opponents disoriented for a period of time.",
            shortHelp: "Melee, DMG(Smash), Disorient",
            icon: "mace_clobber.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.23,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 12.2008
                        },
                        {
                            type: "Fire",
                            scale: 1.314
                        }
                    ],
                    scale: 13.5148
                },
                stun: 3.0
            }
        },
        {
            name: "Confront",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Scrapper Archetype Sets", "Threat Duration"],
            description: "Challenges a foe to attack you. Useful to pull a villain off an ally who finds themselves in over their head. A To Hit check required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged, Foe Taunt",
            icon: "mace_confront.png",
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
            name: "Whirling Mace",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You swing your mace in a circle all around you, attacking everyone in melee range. Your Whirling Mace deals moderate damage, and has a chance to Disorient every foe you hit.",
            shortHelp: "PBAoE Melee, DMG(Smash), Minor Disorient",
            icon: "mace_whirlingmace.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 14.0,
                endurance: 13.0,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 6.2860000000000005
                        },
                        {
                            type: "Fire",
                            scale: 0.504
                        }
                    ],
                    scale: 6.790000000000001
                },
                stun: 2.0
            }
        },
        {
            name: "Shatter",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You attempt to Shatter the bones of your opponent by striking them with all your might. This attack will deal great damage and can knock foes back a great ways. The power of this attack can actually extend a short distance through multiple foes.",
            shortHelp: "Melee (Cone), DMG(Smashing), Knockback",
            icon: "mace_shatter.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 0.7854,
            effects: {
                accuracy: 1.05,
                range: 8.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 2.33,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 11.0008
                        },
                        {
                            type: "Fire",
                            scale: 1.026
                        }
                    ],
                    scale: 12.0268
                }
            }
        },
        {
            name: "Crowd Control",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You swing your mace in a wide arc in front of you. This attack strikes all foes within melee range, deals them serious damage, and knocks them down.",
            shortHelp: "Melee (Cone), DMG(Smash), Knockback",
            icon: "mace_crowdcontrol.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 3.1416,
            effects: {
                accuracy: 1.05,
                range: 8.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 2.0,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 7.862000000000001
                        },
                        {
                            type: "Fire",
                            scale: 0.7245
                        }
                    ],
                    scale: 8.586500000000001
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/war-mace'] = SCRAPPER_WAR_MACE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_WAR_MACE_POWERSET = SCRAPPER_WAR_MACE_POWERSET;
}