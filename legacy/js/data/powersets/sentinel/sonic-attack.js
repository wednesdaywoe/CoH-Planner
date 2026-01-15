/**
 * Sonic Attack
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_SONIC_ATTACK_POWERSET = {
    name: "Sonic Attack",
    category: "Unknown",
    description: "Sonic Attack powerset",
    icon: "sonic-attack_set.png",
    powers: [
        {
            name: "Scream",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Your Scream can cause serious damage to a target.",
            shortHelp: "Ranged, Moderate DoT(Smashing/Energy), -Res",
            icon: "sonicblast_medium.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
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
            name: "Shriek",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You let forth a quick Shriek, damaging your target.",
            shortHelp: "Ranged, Light DMG(Smashing/Energy), Foe -Resist",
            icon: "sonicblast_quick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
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
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Howl",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A short ranged sonic attack that can hit multiple enemies in an arc in front of you.",
            shortHelp: "Ranged Cone, Minor DMG(Smashing/Energy), Foe -Res(All)",
            icon: "sonicblast_cone.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.6,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.9257
                        },
                        {
                            type: "Smashing",
                            scale: 0.3347
                        }
                    ],
                    scale: 3.2603999999999997
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Shout",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You blast your foe with a tremendous Shout, damaging them.",
            shortHelp: "Ranged, High DMG(Smashing/Energy), Foe -Res(All)",
            icon: "sonicblast_heavy.png",
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
                            scale: 3.3000000000000003
                        },
                        {
                            type: "Smashing",
                            scale: 1.06
                        }
                    ],
                    scale: 4.36
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Amplify",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Ranged Damage", "To Hit Buff"],
            description: "Greatly increases your chance to hit with attacks for a few seconds. Slightly increases damage.",
            shortHelp: "Self +To Hit, +DMG, +Range",
            icon: "sonicblast_aim.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 5.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Shockwave",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can call forth a tremendous Shockwave that knocks back foes and deals Smashing damage in a wide cone area.",
            shortHelp: "Ranged (Cone), Light DMG(Smashing/Energy), Foe Knockback, -Res(All)",
            icon: "sonicblast_knockback.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.2526
                        },
                        {
                            type: "Smashing",
                            scale: 0.4326
                        }
                    ],
                    scale: 1.6852
                }
            }
        },
        {
            name: "Sirens Song",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Sleep", "Universal Damage Sets"],
            description: "You send forth a subsonic pulse which causes your foes to fall unconscious and take energy damage. Your foes will remain unconscious for a good while, but will awaken if disturbed.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required against AVs and players, as well as to make secondary effects apply.</color>",
            shortHelp: "Ranged (Cone), Minor DMG(Energy), Foe Sleep",
            icon: "sonicblast_sleep.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.8727,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.86,
                damage: {
                    type: "Energy",
                    scale: 0.9546
                }
            }
        },
        {
            name: "Screech",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "By bursting forth with this hypersonic Screech, you can inflict high damage and disorient a target.",
            shortHelp: "Ranged, High DMG(Smashing/Energy), Foe Disorient, -Res(All)",
            icon: "sonicblast_stun.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.5,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.105
                        },
                        {
                            type: "Energy",
                            scale: 2.105
                        }
                    ],
                    scale: 4.21
                },
                stun: 3.0,
                buffDuration: 15.0
            }
        },
        {
            name: "Dreadful Wail",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Sentinel Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Your Dreadful Wail is so strong that most foes will be defeated by being subjected to it. Dreadful Wail deals Extreme Smashing and Energy damage to all nearby foes in addition to disorienting them for a good while.",
            shortHelp: "PBAoE, Superior DMG(Energy/Smash), Foe Disorient, -Res(All)",
            icon: "sonicblast_massivedamage.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.4,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.97,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.5981
                        },
                        {
                            type: "Smashing",
                            scale: 0.928
                        }
                    ],
                    scale: 4.5261000000000005
                },
                stun: 3.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/sonic-attack'] = SENTINEL_SONIC_ATTACK_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_SONIC_ATTACK_POWERSET = SENTINEL_SONIC_ATTACK_POWERSET;
}