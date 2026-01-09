/**
 * Electricity Manipulation
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_ELECTRICITY_MANIPULATION_POWERSET = {
    name: "Electricity Manipulation",
    category: "Unknown",
    description: "Electricity Manipulation powerset",
    icon: "electricity-manipulation_set.png",
    powers: [
        {
            name: "Charged Bolts",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged Damage", "Universal Damage Sets"],
            description: "You can quickly hurl small bolts of electricity at foes, dealing some damage and draining some Endurance. Some of this Endurance may transfer back to you. Charged Bolts deals light damage but recharges quickly.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Energy), Foe -End",
            icon: "electricalassault_chargedbolts.png",
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
                    type: "Energy",
                    scale: 2.26
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Charged Brawl",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee Damage", "Sleep", "Universal Damage Sets"],
            description: "Your fists become electrically charged and deliver a powerful punch. Charged Brawl can drain some Endurance from the target and may overload their synapses, leaving it writhing for a moment. A portion of drained Endurance may be returned to you. Disturbing an overloaded target will disperse the electrical charge and release the target.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Melee, Light DMG(Smash/Energy), Target Sleep, -End",
            icon: "electricalassault_chargedbrawl.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.2837
                        },
                        {
                            type: "Energy",
                            scale: 1.2573
                        }
                    ],
                    scale: 2.5410000000000004
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Lightning Bolt",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged Damage", "Universal Damage Sets"],
            description: "You can send a large blast of electrical energy at a foe, dealing high damage and draining some Endurance. Some of this Endurance may transfer back to you. Lightning Bolt deals more damage than Charged Bolts, but recharges more slowly.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Moderate DMG(Energy), Foe -End",
            icon: "electricalassault_lightningbolt.png",
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
                    type: "Energy",
                    scale: 3.5290999999999997
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Havoc Punch",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Knockback", "Melee Damage", "Sleep", "Universal Damage Sets"],
            description: "The Havoc Punch is a slower attack than Charged Brawl, but makes up for it with greater damage and a chance to knock the target off their feet. Havoc Punch can drain some Endurance from your target and may overload its synapses, leaving them writhing for a moment. A portion of the drained Endurance may be given back to you. Disturbing an overloaded target will disperse the electrical charge and release him.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Smash/Energy), Foe Sleep, -End, Knock Back",
            icon: "electricalassault_havocpunch.png",
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
                            type: "Smashing",
                            scale: 2.9152
                        },
                        {
                            type: "Energy",
                            scale: 0.8948
                        }
                    ],
                    scale: 3.81
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Build Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit",
            icon: "electricalassault_buildup.png",
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
            name: "Zapp",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "A focused electrical blast that can travel great distances with high Accuracy. Zapp drains Endurance, some of which may transfer back to you. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Sniper, Extreme DMG(Energy), Foe -End",
            icon: "electricalassault_zapp.png",
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
            name: "Static Discharge",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Discharges a cone of Static Electricity that deals damage and drains Endurance from all affected foes in the area.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Light DMG(Energy), -END",
            icon: "electricalassault_staticdischarge.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.07,
                damage: {
                    type: "Energy",
                    scale: 2.2758000000000003
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Thunder Strike",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Knockback", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee (AoE), Superior DMG(Smash, Energy), Foe Disorient, Knockback",
            icon: "electricalassault_thunderstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.53,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 3.997
                        },
                        {
                            type: "Energy",
                            scale: 1.713
                        }
                    ],
                    scale: 5.71
                },
                stun: 1.0,
                buffDuration: 4.0
            }
        },
        {
            name: "Voltaic Sentinel",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "You can manifest a polarized electricity field that hovers above the ground and hurls bolts of electricity at nearby foes. Any enemy that passes near this Sentinel risks serious injury. The Sentinel is not alive and cannot be targeted or attacked by enemies. The Sentinel can fly and will follow you.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Summon Sentinel: Ranged, Moderate DMG(Energy), Foe -End",
            icon: "electricalassault_voltaicsentinel.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 2.0,
                range: 60.0,
                recharge: 60.0,
                endurance: 26.0,
                cast: 3.1,
                buffDuration: 60.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/electricity-manipulation'] = DOMINATOR_ELECTRICITY_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_ELECTRICITY_MANIPULATION_POWERSET = DOMINATOR_ELECTRICITY_MANIPULATION_POWERSET;
}