/**
 * Dark Melee
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_DARK_MELEE_POWERSET = {
    name: "Dark Melee",
    category: "Unknown",
    description: "Dark Melee powerset",
    icon: "dark-melee_set.png",
    powers: [
        {
            name: "Shadow Punch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a quick punch that deals minor damage. Shadow Punches cloud the target's vision, lowering their chance to hit for a short time.",
            shortHelp: "Melee, DMG(Smash/Negative), Foe -To Hit,",
            icon: "shadowfighting_shadowpunch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 1.1606
                        },
                        {
                            type: "Smashing",
                            scale: 0.7804
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 2.319
                },
                tohitDebuff: 0.75,
                buffDuration: 6.0
            }
        },
        {
            name: "Smite",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a Smite that deals more damage than Shadow Punch, but has a longer recharge time. Smite clouds the target's vision, lowering his chance to hit for a short time.",
            shortHelp: "Melee, DMG(Smash/Negative), Foe -To Hit",
            icon: "shadowfighting_smite.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 0.97,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 1.9891999999999999
                        },
                        {
                            type: "Smashing",
                            scale: 0.6496999999999999
                        },
                        {
                            type: "Fire",
                            scale: 0.594
                        }
                    ],
                    scale: 3.2329
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Shadow Maul",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your entire arms with Negative Energy channeled from the Netherworlds, then perform a series of blows that deal a lot of damage over a short period of time to multiple targets in front of you. These blows cloud your target's vision, lowering his chance to hit for a short time.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>5</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "Melee (Cone), DoT(Smash/Negative), Foe -To Hit",
            icon: "shadowfighting_shadowmaul.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.0944,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 2.37,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.44079999999999997,
                            ticks: 3
                        },
                        {
                            type: "Negative",
                            scale: 0.44079999999999997,
                            ticks: 3
                        },
                        {
                            type: "Fire",
                            scale: 0.1821,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 2.0,
                tohitDebuff: 0.75
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
            shortHelp: "Ranged, Foe Taunt",
            icon: "shadowfighting_taunt.png",
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
            name: "Siphon Life",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "To Hit Debuff", "Universal Damage Sets"],
            description: "You tap the power of the Netherworld and create a life transferring conduit between a foe and yourself. This will transfer Hit Points from your enemy to yourself. Foes Siphoned in this manner have their chance to hit reduced.",
            shortHelp: "Melee, DMG(Negative), Foe -To Hit, Self +HP",
            icon: "shadowfighting_siphonlife.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.93,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 4.1109
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 4.9929
                },
                healing: {
                    scale: 187.4069,
                    perTarget: true
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Touch of Fear",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Fear", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "To Hit Debuff", "Universal Damage Sets"],
            description: "The Netherworld is one scary place, and with but a touch, you can give your enemy a glimpse into this dark world. This will cause them to helplessly tremble in Fear. Foes in this state of panic have reduced chance to hit.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "Melee (Targeted AoE), DMG(Negative), Fear, Foe -To Hit",
            icon: "shadowfighting_touchoffearaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.97
            }
        },
        {
            name: "Soul Drain",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "To Hit Buff", "Universal Damage Sets"],
            description: "Using this power, you can drain the essence of all nearby foes' souls, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and chance to hit.",
            shortHelp: "PBAoE DMG(Negative), Self +DMG, +To Hit",
            icon: "shadowfighting_stealpower.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.2,
                recharge: 120.0,
                endurance: 15.6,
                cast: 2.37,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 0.7692
                        },
                        {
                            type: "Fire",
                            scale: 0.3462
                        }
                    ],
                    scale: 1.1154
                },
                tohitBuff: 1.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Dark Consumption",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "The dark power of the Netherworld allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Hit Points of your enemy and add to your Endurance.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "PBAoE DMG(Negative), Self +End",
            icon: "shadowfighting_darkconsumption.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 0.52,
                cast: 1.03,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 0.6154
                        },
                        {
                            type: "Fire",
                            scale: 0.2769
                        }
                    ],
                    scale: 0.8922999999999999
                }
            }
        },
        {
            name: "Midnight Grasp",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Immobilize", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "To Hit Debuff", "Universal Damage Sets"],
            description: "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe and continuously drain his life force.",
            shortHelp: "Melee, DMG(Negative), Foe Immobilize, -To Hit",
            icon: "shadowfighting_midnightgrasp.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 15.0,
                endurance: 11.96,
                cast: 2.07,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 4.2893
                        },
                        {
                            type: "Fire",
                            scale: 0.9945
                        }
                    ],
                    scale: 5.2838
                },
                dotDamage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 0.11,
                            ticks: 4
                        },
                        {
                            type: "Fire",
                            scale: 0.0495,
                            ticks: 4
                        }
                    ]
                },
                tohitDebuff: 0.75,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/dark-melee'] = TANKER_DARK_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_DARK_MELEE_POWERSET = TANKER_DARK_MELEE_POWERSET;
}