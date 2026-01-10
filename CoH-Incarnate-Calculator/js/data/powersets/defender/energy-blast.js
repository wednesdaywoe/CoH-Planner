/**
 * Energy Blast
 * Character Level: 50
 * Archetype: defender
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DEFENDER_ENERGY_BLAST_POWERSET = {
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
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "A much more powerful, yet slower version of Power Bolt. Power Blast sends a focused beam of energy at a foe that can knock them back.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_powerblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.1333
                        },
                        {
                            type: "Smashing",
                            scale: 1.3956
                        }
                    ],
                    scale: 3.5289
                }
            }
        },
        {
            name: "Power Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "A quick attack that rapidly hurls small bolts of energy at foes, sometimes knocking them down. Fast, but little damage.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_powerbolts.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.808
                        },
                        {
                            type: "Smashing",
                            scale: 0.452
                        }
                    ],
                    scale: 2.2600000000000002
                }
            }
        },
        {
            name: "Energy Torrent",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Energy Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying.",
            shortHelp: "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_energytorrent.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
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
                            scale: 1.1879
                        },
                        {
                            type: "Smashing",
                            scale: 0.5262
                        }
                    ],
                    scale: 1.7141
                }
            }
        },
        {
            name: "Power Burst",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "A devastating attack, Power Burst unleashes a massive amount of energy dealing very high damage at short distances. The impact from this burst often knocks back most foes.",
            shortHelp: "Ranged, DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_powerburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.4,
                cast: 2.0,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.2859
                        },
                        {
                            type: "Smashing",
                            scale: 2.0339
                        }
                    ],
                    scale: 4.3198
                }
            }
        },
        {
            name: "Sniper Blast",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "A focused blast that can travel great distances with high Accuracy. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Energy/Smash), Foe Knockback",
            icon: "powerblast_sniperblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 12.0,
                endurance: 14.352,
                cast: 1.33
            }
        },
        {
            name: "Aim",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +To Hit, +DMG",
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
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "This ranged attack deals little damage, but sends the target flying for a great distance.",
            shortHelp: "Ranged DMG(Energy/Smash), Foe High Knockback",
            icon: "powerblast_powerpush.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.4,
                range: 70.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.1,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 0.6722
                        },
                        {
                            type: "Smashing",
                            scale: 0.4326
                        }
                    ],
                    scale: 1.1048
                }
            }
        },
        {
            name: "Explosive Blast",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You hurl a blast of charged energy that violently explodes on impact, damaging all foes near the target.",
            shortHelp: "Ranged (Targeted AoE), DMG(Smash/Energy), Foe Knockback",
            icon: "powerblast_explosion.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
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
            name: "Nova",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can explode in a tremendous blast of energy, sending nearby foes flying. The Nova deals extreme Energy and Smashing damage to all nearby foes.",
            shortHelp: "PBAoE, DMG(Energy), Foe Knockback",
            icon: "powerblast_novablast.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.4,
                recharge: 145.0,
                endurance: 27.716,
                cast: 3.0,
                damage: {
                    type: "Energy",
                    scale: 5.7473
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['defender/energy-blast'] = DEFENDER_ENERGY_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DEFENDER_ENERGY_BLAST_POWERSET = DEFENDER_ENERGY_BLAST_POWERSET;
}