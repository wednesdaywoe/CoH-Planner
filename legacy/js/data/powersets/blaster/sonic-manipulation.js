/**
 * Sonic Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_SONIC_MANIPULATION_POWERSET = {
    name: "Sonic Manipulation",
    category: "Unknown",
    description: "Sonic Manipulation powerset",
    icon: "sonic-manipulation_set.png",
    powers: [
        {
            name: "Sonic Thrust",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "A focused attack of intense sonic power that violently sends a nearby foe flying. Deals minimal damage, but can be very effective.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Knockback/Repel",
            icon: "sonicmanipulation_sonicthrust.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.8061
                        },
                        {
                            type: "Energy",
                            scale: 0.8061
                        }
                    ],
                    scale: 1.6122
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Strident Echo",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Melee Damage", "Universal Damage Sets"],
            description: "Strident Echo deals minor damage over time. It has a low chance of causing a migraine, leaving the target shaking in pain and helpless.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Chance for Hold",
            icon: "sonicmanipulation_stridentecho.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.67,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.34409999999999996,
                            ticks: 5
                        },
                        {
                            type: "Energy",
                            scale: 0.34409999999999996,
                            ticks: 5
                        }
                    ]
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Echo Chamber",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Encases the target in a field of sonic waves, dealing energy damage and holding them in place.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, DMG(Energy), Foe Hold",
            icon: "sonicmanipulation_echochamber.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 16.0,
                endurance: 11.388,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 2.729
                }
            }
        },
        {
            name: "Sound Booster",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit. Moderately increases the duration of mez effects. Moderately increases the chance for Sound Manipulation powers to induce migraines.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit, +Special",
            icon: "sonicmanipulation_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 2.0,
                buffDuration: 10.0,
                stun: 1.0,
                stunDuration: 10.0
            }
        },
        {
            name: "Deafening Wave",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You create a large field of sonic waves, causing damage to all foes around you. It has a moderate chance of causing migraines, leaving them shaking in pain and helpless.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
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
            name: "Sound Barrier",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Resist Damage"],
            description: "Creates a barrier around the caster which reduces incoming energy and smashing damage, provides protection against sleep effects and grants an absorption shield. Recovery is also increased.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +Absorb, +Recovery, +Res(Smashing, Energy, Sleep)",
            icon: "sonicmanipulation_soundbarrier.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 2.7,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.0,
                            ticks: 1
                        },
                        {
                            type: "Energy",
                            scale: 1.0,
                            ticks: 1
                        }
                    ]
                },
                protection: {
                    sleep: 8.304
                },
                resistance: {
                    smashing: 0.07,
                    energy: 0.07
                },
                buffDuration: 2.25
            }
        },
        {
            name: "Disruption Aura",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "You emit a constant wave of sonic energy around yourself, weakening the Damage Resistance of all nearby foes.<br><br><color #fcfc95>Recharge: Moderate.</color>",
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
            name: "Sound Cannon",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Knockback", "Stuns"],
            description: "You generate a powerful sonic wave that will knock back and disorient foes in front of you for a short time.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Cone), Foe Disorient, Knockback",
            icon: "sonicmanipulation_soundcannon.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 0.8,
                range: 45.0,
                recharge: 90.0,
                endurance: 20.18,
                cast: 1.5,
                stun: 3.0
            }
        },
        {
            name: "Earsplitter",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Melee Damage", "Universal Damage Sets"],
            description: "You generate an earsplitting sound wave right in the face of your foe, inflicting great damage. It has a good chance of causing a migraine, leaving them shaking in pain and helpless.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
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
    POWERSETS['blaster/sonic-manipulation'] = BLASTER_SONIC_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_SONIC_MANIPULATION_POWERSET = BLASTER_SONIC_MANIPULATION_POWERSET;
}