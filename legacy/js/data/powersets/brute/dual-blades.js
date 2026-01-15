/**
 * Dual Blades
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_DUAL_BLADES_POWERSET = {
    name: "Dual Blades",
    category: "Unknown",
    description: "Dual Blades powerset",
    icon: "dual-blades_set.png",
    powers: [
        {
            name: "Nimble Slash",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "A quick swipe with your blades. Does minor lethal damage, but has a quick recharge rate. This attack begins both the Empower and Weaken combination attacks.<br><br><color #ff7f00>Empower: Nimble Slash > Ablating Strike > Blinding Feint.</color><br><color #ff7f00>Weaken: Nimble Slash > Ablating Strike > Typhoon's Edge.</color>",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "dualblades_lightopening.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.03,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.0405,
                            ticks: 1
                        },
                        {
                            type: "Fire",
                            scale: 0.189,
                            ticks: 1
                        }
                    ]
                },
                buffDuration: 0.5
            }
        },
        {
            name: "Power Slice",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a deadly Strike with your blades. This is a basic attack that deals a moderate amount of lethal damage. This power is needed for the Sweep combination attack.<br><br><color #ff7f00>Sweep: One Thousand Cuts > Power Slice > Typhoon's Edge.</color>",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "dualblades_moderateopening.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 1.4,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.9080999999999999,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.174,
                            ticks: 2
                        }
                    ]
                },
                buffDuration: 1.0
            }
        },
        {
            name: "Ablating Strike",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You Slash at your foe with your blades, dealing a good amount of lethal damage. This attack can reduce a target's Defense, making him easier to hit. This power is needed for the Empower and Weaken combination attacks, and is the beginning of the Attack Vitals combination attack.<br><br><color #ff7f00>Empower: Nimble Slash > Ablating Strike > Blinding Feint.</color><br><color #ff7f00>Weaken: Nimble Slash > Ablating Strike > Typhoon's Edge.</color><br><color #ff7f00>Attack Vitals: Ablating Strike > Vengeful Slice > Sweeping Strike.</color>",
            shortHelp: "Melee, DMG(Lethal), Foe -DEF",
            icon: "dualblades_moderatebridge.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.03,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.3405,
                            ticks: 1
                        },
                        {
                            type: "Fire",
                            scale: 0.297,
                            ticks: 1
                        }
                    ]
                },
                buffDuration: 0.6,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Typhoon's Edge",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You spin around in a circle, attacking everyone within melee range with a striking attack. This attack is the finishing move in both the Weaken and Sweep combination attacks.<br><br><color #ff7f00>Weaken: Nimble Slash > Ablating Strike > Typhoon's Edge.</color><br><color #ff7f00>Sweep: One Thousand Cuts > Power Slice > Typhoon's Edge.</color>",
            shortHelp: "PBAoE Melee, DMG(Lethal)",
            icon: "dualblades_aoebridge.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 2.27,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.57
                        },
                        {
                            type: "Fire",
                            scale: 0.2565
                        }
                    ],
                    scale: 0.8265
                },
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.2753999999999999,
                            ticks: 1
                        },
                        {
                            type: "Fire",
                            scale: 0.2565,
                            ticks: 1
                        }
                    ]
                },
                buffDuration: 0.6,
                defenseDebuff: 1.0,
                tohitDebuff: 1.0
            }
        },
        {
            name: "Blinding Feint",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Threat Duration", "To Hit Buff", "Universal Damage Sets"],
            description: "You perform a feint attack that deals light damage. After this attack hits, it gives you a large bonus to your chance to hit and damage for a brief time. This power is the finishing move in the Empower combination attack.<br><br><color #ff7f00>Empower: Nimble Slash > Ablating Strike > Blinding Feint.</color>",
            shortHelp: "Melee, DMG(Lethal), Self +DMG, +To Hit",
            icon: "dualblades_followup.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 12.0,
                endurance: 7.8,
                cast: 1.2,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.52
                        },
                        {
                            type: "Fire",
                            scale: 0.36
                        }
                    ],
                    scale: 2.88
                },
                tohitBuff: 0.33,
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
            description: "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "dualblades_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.93,
                buffDuration: 12.0
            }
        },
        {
            name: "Vengeful Slice",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Unleashes a series of strong attacks on your foe, dealing high lethal damage and knocking them down. This power is needed for the Attack Vitals combination attack.<br><br><color #ff7f00>Attack Vitals: Ablating Strike > Vengeful Slice > Sweeping Strike.</color>",
            shortHelp: "Melee, DMG(Lethal), Knockdown",
            icon: "dualblades_special1.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.43,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.0607999999999995
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 4.7988
                }
            }
        },
        {
            name: "Sweeping Strike",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You make a sweeping strike with your blades, hitting all foes in a cone in front of you and dealing superior lethal damage to each. This power is the finishing move for the Attack Vitals combination attack.<br><br><color #ff7f00>Attack Vitals: Ablating Strike > Vengeful Slice > Sweeping Strike.</color>",
            shortHelp: "Melee (Cone), DMG(Lethal)",
            icon: "dualblades_special2.png",
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
                cast: 1.23,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 3.0553999999999997
                        },
                        {
                            type: "Fire",
                            scale: 0.765
                        }
                    ],
                    scale: 3.8204
                },
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.2,
                            ticks: 4
                        },
                        {
                            type: "Fire",
                            scale: 0.09,
                            ticks: 4
                        }
                    ]
                },
                buffDuration: 4.1
            }
        },
        {
            name: "One Thousand Cuts",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Unleashes a flurry of attacks on all foes in a cone in front of you, dealing moderate lethal damage to each foe hit. This power is the opening move for the Sweep combination attack.<br><br><color #ff7f00>Sweep: One Thousand Cuts > Power Slice > Typhoon's Edge.</color>",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe Knockback",
            icon: "dualblades_highlow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.3,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.9944999999999999
                        },
                        {
                            type: "Fire",
                            scale: 0.315
                        }
                    ],
                    scale: 1.3094999999999999
                },
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.364,
                            ticks: 10
                        },
                        {
                            type: "Fire",
                            scale: 0.068,
                            ticks: 10
                        }
                    ]
                },
                buffDuration: 2.05
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/dual-blades'] = BRUTE_DUAL_BLADES_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_DUAL_BLADES_POWERSET = BRUTE_DUAL_BLADES_POWERSET;
}