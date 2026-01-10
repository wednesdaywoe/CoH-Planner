/**
 * Energy Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_ENERGY_ASSAULT_POWERSET = {
    name: "Energy Assault",
    category: "Unknown",
    description: "Energy Assault powerset",
    icon: "energy-assault_set.png",
    powers: [
        {
            name: "Bone Smasher",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "This melee attack can be slow, but it compensates by dealing a good amount of damage and having a good chance to Disorient the target. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode. This power will weaken the target's secondary effects if used while in Energy Focus mode.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Smash/Energy), Disorient, Special, Chance for Energy Focus",
            icon: "energyassault_bonesmasher.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.5,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.286
                        },
                        {
                            type: "Smashing",
                            scale: 1.524
                        }
                    ],
                    scale: 3.81
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Power Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "A quick attack that rapidly hurls small bolts of energy at foes, sometimes knocking them down. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Energy/Smash), Foe Knockback, Chance for Energy Focus",
            icon: "energyassault_powerbolt.png",
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
                            scale: 1.3559999999999999
                        },
                        {
                            type: "Smashing",
                            scale: 0.904
                        }
                    ],
                    scale: 2.26
                }
            }
        },
        {
            name: "Power Push",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "Power Push deals a high amount of Energy and Smashing damage and sends the target flying for a great distance. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged Moderate DMG(Energy/Smash), Foe High Knockback, Chance for Energy Focus",
            icon: "energyassault_powerpush.png",
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
                            scale: 1.8780000000000001
                        },
                        {
                            type: "Smashing",
                            scale: 1.252
                        }
                    ],
                    scale: 3.13
                }
            }
        },
        {
            name: "Power Blast",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "A much more powerful, yet slower version of Power Bolt. Power Blast sends a focused beam of energy at a foe that can knock them back. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, High DMG(Energy/Smash), Foe Knockback, Chance for Energy Focus",
            icon: "energyassault_powerblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.9467999999999996
                        },
                        {
                            type: "Smashing",
                            scale: 0.9823
                        }
                    ],
                    scale: 3.9290999999999996
                }
            }
        },
        {
            name: "Power Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Boosts the damage and secondary effects of your powers. Your powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes and more, are all improved. The effects of Power Up last a short while, and only the next couple of attacks will be boosted.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +Special, +Dmg(All)",
            icon: "energyassault_powerboost.png",
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
            name: "Whirling Hands",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "By focusing your energy into the muscles in your arms, you can launch a dizzying flurry of attacks against every foe in melee range. Some foes may be hit hard enough to be Disoriented as well. This power will recharge instantly if used while in Energy Focus mode.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE Melee, Light DMG(Smash/Energy), Special",
            icon: "energyassault_whirlinghands.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.5,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.7015000000000002
                        },
                        {
                            type: "Smashing",
                            scale: 1.1344
                        }
                    ],
                    scale: 2.8359000000000005
                }
            }
        },
        {
            name: "Total Focus",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "Total Focus is complete mastery over Energy Melee. This melee attack is a very slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Total Focus, recharge time is very long. This power will enter Energy Focus mode.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Energy/Smash), Foe Disorient, +Energy Focus",
            icon: "energyassault_totalfocus.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 22.0,
                endurance: 20.176,
                cast: 2.53,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 4.1586
                        },
                        {
                            type: "Smashing",
                            scale: 2.7724
                        }
                    ],
                    scale: 6.931
                },
                stun: 3.0
            }
        },
        {
            name: "Sniper Blast",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "A focused blast that can travel great distances with high Accuracy. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Sniper, Extreme DMG(Energy/Smash), Foe Knockback",
            icon: "energyassault_sniperblaster.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.33
            }
        },
        {
            name: "Power Burst",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "A devastating attack that can knock your target off their feet. This power will inflict bonus damage if used while in Energy Focus mode.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Superior DMG(Energy/Smash), Foe Knockback, Special",
            icon: "energyassault_powerburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.0974000000000004
                        },
                        {
                            type: "Smashing",
                            scale: 1.6316000000000002
                        }
                    ],
                    scale: 4.729000000000001
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/energy-assault'] = DOMINATOR_ENERGY_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_ENERGY_ASSAULT_POWERSET = DOMINATOR_ENERGY_ASSAULT_POWERSET;
}