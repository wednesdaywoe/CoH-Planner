/**
 * Energy Blast
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_ENERGY_BLAST_POWERSET = {
    name: "Energy Blast",
    category: "Unknown",
    description: "Energy Blast powerset",
    icon: "energy-blast_set.png",
    powers: [
        {
            name: "Power Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A much more powerful, yet slower version of Power Bolt. Power Blast sends a focused beam of energy at a foe that can knock them back.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_powerblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.849
                        },
                        {
                            type: "Smashing",
                            scale: 0.64
                        }
                    ],
                    scale: 3.4890000000000003
                }
            }
        },
        {
            name: "Power Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A quick attack that rapidly hurls small bolts of energy at foes, sometimes knocking them down. Fast, but little damage.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_powerbolts.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.06
                        },
                        {
                            type: "Smashing",
                            scale: 0.2
                        }
                    ],
                    scale: 2.2600000000000002
                }
            }
        },
        {
            name: "Energy Torrent",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Energy Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying.",
            shortHelp: "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_energytorrent.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.07,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.3445
                        },
                        {
                            type: "Smashing",
                            scale: 0.3
                        }
                    ],
                    scale: 1.6445
                }
            }
        },
        {
            name: "Power Burst",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A devastating attack, Power Burst unleashes a massive amount of energy dealing very high damage at short distances. The impact from this burst often knocks back most foes.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_powerburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 2.0,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.3200000000000003
                        },
                        {
                            type: "Smashing",
                            scale: 1.0
                        }
                    ],
                    scale: 4.32
                }
            }
        },
        {
            name: "Aim",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage and range.",
            shortHelp: "Self +To Hit, +DMG, +Range",
            icon: "powerblast_aim.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.625,
                damageBuff: 0.425,
                buffDuration: 10.0
            }
        },
        {
            name: "Power Push",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "This ranged attack deals little damage, but sends the target flying for a great distance.",
            shortHelp: "Ranged DMG(Energy/Smash), Foe High Knockback",
            icon: "powerblast_powerpush.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.1,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.504
                        },
                        {
                            type: "Smashing",
                            scale: 0.626
                        }
                    ],
                    scale: 3.13
                }
            }
        },
        {
            name: "Explosive Blast",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You hurl a blast of charged energy that violently explodes on impact, damaging all foes near the target. Explosive Blast may knock targets backwards.",
            shortHelp: "Ranged (Targeted AoE), DMG(Smash/Energy), Foe Knockback",
            icon: "powerblast_explosion.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.2887
                        },
                        {
                            type: "Smashing",
                            scale: 0.5
                        }
                    ],
                    scale: 3.7887
                }
            }
        },
        {
            name: "Focused Power Bolt",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A focused and very accurate blast that deals tremendous damage.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_heavy.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 5.244999999999999
                        },
                        {
                            type: "Smashing",
                            scale: 0.584
                        }
                    ],
                    scale: 5.828999999999999
                }
            }
        },
        {
            name: "Nova",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can explode in a tremendous blast of energy, sending nearby foes flying. The Nova deals extreme Energy and Smashing damage to all nearby foes.",
            shortHelp: "PBAoE, DMG(Energy), Foe Knockback",
            icon: "powerblast_novablast.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.4,
                recharge: 90.0,
                endurance: 15.6,
                cast: 3.0,
                damage: {
                    type: "Energy",
                    scale: 4.7059999999999995
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/energy-blast'] = SENTINEL_ENERGY_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_ENERGY_BLAST_POWERSET = SENTINEL_ENERGY_BLAST_POWERSET;
}