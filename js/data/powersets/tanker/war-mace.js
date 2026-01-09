/**
 * War Mace
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_WAR_MACE_POWERSET = {
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
            allowedSetCategories: ["Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a Bashing attack with your mace that deals moderate damage, and can sometimes Disorient your opponent.",
            shortHelp: "Melee, DMG(Smash), Disorient",
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
                            scale: 2.491
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 2.9410000000000003
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
            allowedSetCategories: ["Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You attempt to Pulverize your opponent. This attack is slower than Bash but causes more damage. It also has a chance of Disorienting your opponent for a brief time.",
            shortHelp: "Melee, DMG(Smash), Disorient",
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
                            scale: 3.41
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 4.148
                },
                stun: 2.0
            }
        },
        {
            name: "Jawbreaker",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
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
                            scale: 4.040900000000001
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 4.9229
                }
            }
        },
        {
            name: "Taunt",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunts a foe, and some nearby foes, to attack you. Useful for pulling villains off an ally who find themselves in over their head. Taunted foes tend to ignore other Heroes and focus on you for quite a while, so use this power cautiously. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "mace_taunt.png",
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
            name: "Build Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
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
            name: "Whirling Mace",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You swing your mace in a circle all around you, attacking everyone in melee range. Your Whirling Mace deals moderate damage, and has a chance to Disorient every foe you hit.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "PBAoE Melee, Light DMG(Smash), Minor Disorient",
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
                            scale: 2.7365000000000004
                        },
                        {
                            type: "Fire",
                            scale: 0.504
                        }
                    ],
                    scale: 3.2405000000000004
                },
                stun: 2.0
            }
        },
        {
            name: "Clobber",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
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
                            scale: 4.8209
                        },
                        {
                            type: "Fire",
                            scale: 1.314
                        }
                    ],
                    scale: 6.1349
                },
                stun: 3.0
            }
        },
        {
            name: "Shatter",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You attempt to Shatter the bones of your opponent by striking them with all your might. This attack will deal great damage and can knock foes back a great ways. The power of this attack can actually extend a short distance through multiple foes.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>5</color> targets above its cap at 1/3rd effectiveness.</color>",
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
                            scale: 4.3604
                        },
                        {
                            type: "Fire",
                            scale: 1.026
                        }
                    ],
                    scale: 5.3864
                }
            }
        },
        {
            name: "Crowd Control",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
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
                            scale: 3.1260000000000003
                        },
                        {
                            type: "Fire",
                            scale: 0.7245
                        }
                    ],
                    scale: 3.8505000000000003
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/war-mace'] = TANKER_WAR_MACE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_WAR_MACE_POWERSET = TANKER_WAR_MACE_POWERSET;
}