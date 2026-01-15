/**
 * Dark Melee
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_DARK_MELEE_POWERSET = {
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
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee Damage", "Scrapper Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a quick punch that deals minor damage. Shadow Punches cloud the target's vision, lowering his chance to hit for a short time.",
            shortHelp: "Melee, DMG(Smash/Negative), Foe -To Hit",
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
                            scale: 3.9414999999999996
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
                    scale: 5.0999
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
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee Damage", "Scrapper Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
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
                            scale: 5.9481
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
                    scale: 7.1918
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Shadow Maul",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee AoE Damage", "Scrapper Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your entire arms with Negative Energy channeled from the Netherworlds, then perform a series of blows that deal a lot of damage over a short period of time to multiple targets in front of you. These blows cloud your target's vision, lowering his chance to hit for a short time.",
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
                damage: {
                    type: "Negative",
                    scale: 5.1442
                },
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
            name: "Touch of Fear",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Fear", "Melee AoE Damage", "Scrapper Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "The Netherworld is one scary place, and with but a touch, you can give your enemy a glimpse into this dark world. This will cause them to helplessly tremble in Fear. Foes in this state of panic have reduced chance to hit.",
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
            name: "Siphon Life",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "Melee Damage", "Scrapper Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
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
                            scale: 10.181799999999999
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 11.063799999999999
                },
                healing: {
                    scale: 133.8621,
                    perTarget: true
                },
                tohitDebuff: 0.75,
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
            icon: "shadowfighting_confront.png",
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
            name: "Dark Consumption",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "The dark power of the Netherworld allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Hit Points of your enemy and add to your Endurance.",
            shortHelp: "PBAoE Light DMG(Negative), Self +End",
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
                            scale: 3.0309
                        },
                        {
                            type: "Fire",
                            scale: 0.36
                        }
                    ],
                    scale: 3.3909
                }
            }
        },
        {
            name: "Soul Drain",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "To Hit Buff", "Universal Damage Sets"],
            description: "Using this power, you can drain the essence of all nearby foes' souls, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and chance to hit.",
            shortHelp: "PBAoE Light DMG(Negative), Self +DMG, +To Hit",
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
                            scale: 3.7885999999999997
                        },
                        {
                            type: "Fire",
                            scale: 0.45
                        }
                    ],
                    scale: 4.2386
                },
                tohitBuff: 1.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Midnight Grasp",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Immobilize", "Melee Damage", "Scrapper Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe and continuously drain his life force.",
            shortHelp: "Melee, Superior DMG(Negative), Foe Immobilize, -To Hit",
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
                            scale: 12.2335
                        },
                        {
                            type: "Fire",
                            scale: 0.9945
                        }
                    ],
                    scale: 13.228
                },
                dotDamage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 0.1889,
                            ticks: 4
                        },
                        {
                            type: "Fire",
                            scale: 0.045,
                            ticks: 4
                        }
                    ]
                },
                buffDuration: 3.1,
                tohitDebuff: 0.75
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/dark-melee'] = SCRAPPER_DARK_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_DARK_MELEE_POWERSET = SCRAPPER_DARK_MELEE_POWERSET;
}