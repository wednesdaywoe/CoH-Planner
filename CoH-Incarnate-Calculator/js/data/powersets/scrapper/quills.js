/**
 * Quills
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_QUILLS_POWERSET = {
    name: "Quills",
    category: "Unknown",
    description: "Quills powerset",
    icon: "quills_set.png",
    powers: [
        {
            name: "Barb Swipe",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "Shred your opponent with several quick Swipes from your Spines. Barb Swipe deals Light Lethal damage and a minor amount of additional Toxic damage over time and Slows affected foes.",
            shortHelp: "Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
            icon: "quills_swipe.png",
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
                            type: "Lethal",
                            scale: 4.7219999999999995
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 5.1
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 2
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Lunge",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You can lunge forward, stabbing and poisoning a foe with the large Spine on your arm. Lunge deals moderate damage. Spine poison deals additional Toxic damage and Slows affected foes.",
            shortHelp: "Melee, DMG(Lethal), DoT(Toxic) -SPD, -Recharge",
            icon: "quills_lunge.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.63,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 7.522
                        },
                        {
                            type: "Fire",
                            scale: 0.594
                        }
                    ],
                    scale: 8.116
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Spine Burst",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You can fling dozens of Spines in all directions. These Spines only travel a short distance, but they can deal moderate damage and poison any target close to you. Spine poison deals additional Toxic damage and Slows affected foes.",
            shortHelp: "PBAoE Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
            icon: "quills_flingquills.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 3.0,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.6324
                        },
                        {
                            type: "Fire",
                            scale: 0.405
                        }
                    ],
                    scale: 5.0374
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 3
                },
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
            icon: "quills_bristle.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 0.73,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Impale",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Immobilize", "Ranged Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You can throw a single large Spine at a targeted foe. This Spine does only moderate damage, but carries a large amount of the Spine toxin. A successful attack can completely Immobilize most foes, as well as Slowing them and dealing Toxic poison damage. Impale can also bring down flying entities.",
            shortHelp: "Ranged, DMG(Lethal), DoT(Toxic), Immobilize, -Recharge, -Fly",
            icon: "quills_impale.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.43,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 9.762
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 10.5
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 4
                },
                buffDuration: 15.0
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
            icon: "quills_taunt.png",
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
            name: "Quills",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "While this power is active, you will constantly fire dozens of Spines in all directions. These Spines do minor damage, but can poison all foes in close range. Spine poison Slows affected foes.",
            shortHelp: "Toggle: PBAoE, DoT(Lethal), Foe -Speed, -Recharge",
            icon: "quills_quills.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 1.04,
                cast: 0.73,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.5683
                        },
                        {
                            type: "Fire",
                            scale: 0.0675
                        }
                    ],
                    scale: 0.6358
                },
                buffDuration: 3.0
            }
        },
        {
            name: "Ripper",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You can unleash a spectacular slashing maneuver that attacks all villains in a wide arc in front of you. Ripper deals massive damage and poisons multiple targets. It can even knock foes down. Spine poison Slows affected targets and deals additional Toxic damage.",
            shortHelp: "Melee (Cone), DMG(Lethal), DoT(Toxic), Knockback, -SPD, -Recharge",
            icon: "quills_bonesword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 2.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 9.0378
                        },
                        {
                            type: "Fire",
                            scale: 0.765
                        }
                    ],
                    scale: 9.802800000000001
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.2,
                    ticks: 4
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Throw Spines",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You can throw dozens of Spines in a wide cone in front of you, impaling foes caught within the range. Spine throwing deals moderate damage, and poisons any targets it hits. Spine poison deals additional Toxic damage and Slows affected foes.",
            shortHelp: "Ranged (Cone), DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
            icon: "quills_quillthrowing.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 12.0,
                endurance: 13.0,
                cast: 1.63,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.8675999999999995
                        },
                        {
                            type: "Fire",
                            scale: 0.4905
                        }
                    ],
                    scale: 5.358099999999999
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 4
                },
                buffDuration: 15.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/quills'] = SCRAPPER_QUILLS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_QUILLS_POWERSET = SCRAPPER_QUILLS_POWERSET;
}