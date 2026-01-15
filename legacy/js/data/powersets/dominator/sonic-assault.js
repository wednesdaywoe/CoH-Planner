/**
 * Sonic Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_SONIC_ASSAULT_POWERSET = {
    name: "Sonic Assault",
    category: "Unknown",
    description: "Sonic Assault powerset",
    icon: "sonic-assault_set.png",
    powers: [
        {
            name: "Shriek",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "You let forth a quick Shriek, damaging your target. This power applies <color #ffd9b3>Short Sonic Vibrations</color> that lower resistance for 8s.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe -Res(All)",
            icon: "sonicmanipulation_shriek.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.64
                        },
                        {
                            type: "Smashing",
                            scale: 0.42
                        }
                    ],
                    scale: 2.06
                }
            }
        },
        {
            name: "Strident Echo",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Melee Damage", "Universal Damage Sets"],
            description: "Strident Echo deals minor damage over time. It has a low chance of causing a migraine, leaving the target shaking in pain and helpless.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Chance for Hold",
            icon: "sonicmanipulation_stridentecho.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.67,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.3607,
                            ticks: 5
                        },
                        {
                            type: "Energy",
                            scale: 0.3607,
                            ticks: 5
                        }
                    ]
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Scream",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "Your Scream can cause serious damage to a target. This power applies <color #ffd9b3>Lingering Sonic Vibrations</color> that lower resistance for 10s.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe -Res(All)",
            icon: "sonicmanipulation_scream.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.47,
                dotDamage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 0.4658,
                            ticks: 4
                        },
                        {
                            type: "Smashing",
                            scale: 0.132,
                            ticks: 4
                        }
                    ]
                },
                buffDuration: 1.05
            }
        },
        {
            name: "Shockwave",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can call forth a tremendous Shockwave that knocks back foes and deals Smashing damage in a wide cone area.",
            shortHelp: "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
            icon: "sonicmanipulation_shockwave.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 13.0,
                endurance: 12.688,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.9263
                        },
                        {
                            type: "Energy",
                            scale: 0.9263
                        }
                    ],
                    scale: 1.8526
                }
            }
        },
        {
            name: "Bass Boost",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Boosts the damage and secondary effects of your powers. Your powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes and more, are all improved. The effects of Power Up last a short while, and only the next couple of attacks will be boosted.",
            shortHelp: "Self +Special, +Dmg(All)",
            icon: "sonicmanipulation_powerup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 7.8,
                cast: 1.17,
                buffDuration: 10.0,
                stun: 1.0,
                stunDuration: 10.0,
                tohitBuff: 0.5,
                defenseBuff: 0.5
            }
        },
        {
            name: "Deafening Wave",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You create a large field of sonic waves, causing damage to all foes around you. It has a moderate chance of causing migraines, leaving them shaking in pain and helpless.",
            shortHelp: "PBAoE Melee, DMG(Energy/Smash), Foe Chance for Hold",
            icon: "sonicmanipulation_deafeningcry.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.03,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.9509
                        },
                        {
                            type: "Energy",
                            scale: 0.9509
                        }
                    ],
                    scale: 1.9018
                }
            }
        },
        {
            name: "Disruption Aura",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "You emit a constant wave of sonic energy around yourself, weakening the Damage Resistance of all nearby foes.",
            shortHelp: "Toggle: PBAoE, Foe -Res(All)",
            icon: "sonicmanipulation_disruptionaura.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 1.04,
                cast: 1.97,
                buffDuration: 2.25
            }
        },
        {
            name: "Shout",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "You blast your foe with a tremendous Shout, damaging them. This power applies <color #ffd9b3>Extended Sonic Vibrations</color> that lower resistance for 12s.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe -Res(All)",
            icon: "sonicmanipulation_shout.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.0,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.6603000000000003
                        },
                        {
                            type: "Smashing",
                            scale: 1.3
                        }
                    ],
                    scale: 4.9603
                }
            }
        },
        {
            name: "Earsplitter",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Melee Damage", "Universal Damage Sets"],
            description: "You generate an earsplitting sound wave right in the face of your foe, inflicting great damage. It has a good chance of causing a migraine, leaving them shaking in pain and helpless.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Chance for Hold",
            icon: "sonicmanipulation_earsplitter.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.97,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 3.0695
                        },
                        {
                            type: "Energy",
                            scale: 3.0695
                        }
                    ],
                    scale: 6.139
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/sonic-assault'] = DOMINATOR_SONIC_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_SONIC_ASSAULT_POWERSET = DOMINATOR_SONIC_ASSAULT_POWERSET;
}