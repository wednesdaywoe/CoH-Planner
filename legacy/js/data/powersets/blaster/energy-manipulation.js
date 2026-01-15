/**
 * Energy Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_ENERGY_MANIPULATION_POWERSET = {
    name: "Energy Manipulation",
    category: "Unknown",
    description: "Energy Manipulation powerset",
    icon: "energy-manipulation_set.png",
    powers: [
        {
            name: "Energy Punch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "Powerful focused punch that may Disorient your opponent!<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Smash/Energy), Foe Disorient",
            icon: "energymanipulation_energypunch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.7046000000000001
                        },
                        {
                            type: "Energy",
                            scale: 1.6364
                        }
                    ],
                    scale: 3.341
                },
                stun: 2.0
            }
        },
        {
            name: "Power Thrust",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "A focused attack that violently shoves the target and sends them flying. Deals minimal damage, but can be very effective.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Melee, Minor DMG(Energy/Smash), Foe Knockback",
            icon: "energymanipulation_powerthrust.png",
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
                            type: "Energy",
                            scale: 1.7399
                        },
                        {
                            type: "Smashing",
                            scale: 0.4
                        }
                    ],
                    scale: 2.1399
                }
            }
        },
        {
            name: "Build Up",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit",
            icon: "energymanipulation_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Bone Smasher",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "The Bone Smasher is a slow attack, but makes up for it with a good amount of damage. Has a greater chance to Disorient than Energy Punch.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Superior DMG(Smash/Energy), Foe Disorient",
            icon: "energymanipulation_bonesmasher.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 1.5,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 3.2270000000000003
                        },
                        {
                            type: "Energy",
                            scale: 1.383
                        }
                    ],
                    scale: 4.61
                },
                stun: 3.0
            }
        },
        {
            name: "Energize",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can channel a tremendous amount of energy through your body for a short period of time. Doing so will heal some hit points, reduce the endurance cost of your powers, boost your regeneration dramatically, and make you resistant to Stuns for a short time.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self Endurance Discount, Heal, +Regen, Res(Stun)",
            icon: "energymanipulation_conservepower.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 120.0,
                endurance: 5.2,
                cast: 1.17,
                protection: {
                    stun: 8.304
                },
                healing: {
                    scale: 120.4759,
                    perTarget: true
                },
                buffDuration: 60.0,
                stun: 1.0,
                stunDuration: 60.0
            }
        },
        {
            name: "Stun",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "Stun deals a little bit of damage, but Disorients its target a great deal. This attack can Disorient most opponents. If this power is used under the effects of Boost Range, this power will become a ranged stun instead. If this power is used under the effect of Power Boost, it will become an AoE stun, but it will recharge in 90 seconds instead of 12. Both these effects can be combined for the power to become a ranged AoE stun.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Minor DMG(Energy/Smashing), Foe Disorient, Special",
            icon: "energymanipulation_stun.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 12.0,
                endurance: 10.192,
                cast: 1.8
            }
        },
        {
            name: "Power Boost",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Greatly boosts the secondary effects of your powers. Your powers effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all improved. The effects of Power Boost last a short while, and only the next couple of attacks will be boosted.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Self +Special",
            icon: "energymanipulation_powerboost.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 7.8,
                cast: 1.17,
                buffDuration: 15.0,
                stun: 1.0,
                stunDuration: 15.0,
                tohitBuff: 0.66,
                defenseBuff: 0.66
            }
        },
        {
            name: "Boost Range",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "You can boost your powers to increase the range of your next few attacks.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Self Range Increase",
            icon: "energymanipulation_boostrange.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 13.0,
                cast: 1.17,
                buffDuration: 30.0
            }
        },
        {
            name: "Total Focus",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "Total Focus is complete mastery over Energy Melee. This is a very slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Total Focus, recharge time is very long.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Energy/Smash), Foe Disorient",
            icon: "energymanipulation_totalfocus.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.53,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 4.696400000000001
                        },
                        {
                            type: "Smashing",
                            scale: 1.8346
                        }
                    ],
                    scale: 6.531000000000001
                },
                stun: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/energy-manipulation'] = BLASTER_ENERGY_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_ENERGY_MANIPULATION_POWERSET = BLASTER_ENERGY_MANIPULATION_POWERSET;
}