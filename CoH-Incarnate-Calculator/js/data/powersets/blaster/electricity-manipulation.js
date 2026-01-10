/**
 * Electricity Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_ELECTRICITY_MANIPULATION_POWERSET = {
    name: "Electricity Manipulation",
    category: "Unknown",
    description: "Electricity Manipulation powerset",
    icon: "electricity-manipulation_set.png",
    powers: [
        {
            name: "Charged Brawl",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Endurance Modification", "Melee Damage", "Sleep", "Universal Damage Sets"],
            description: "Your fists become electrically charged and deliver a powerful punch. Charged Brawl can drain some Endurance from the target and may overload their synapses, leaving them writhing for a moment. A portion of drained Endurance may be returned to you. Disturbing an overloaded target will disperse the electrical charge and release them.",
            shortHelp: "Melee, DMG(Smash/Energy), Target Sleep, -End",
            icon: "electricitymanipulation_chargedbrawl.png",
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
                            type: "Energy",
                            scale: 2.3810000000000002
                        },
                        {
                            type: "Smashing",
                            scale: 0.96
                        }
                    ],
                    scale: 3.341
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Electric Fence",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Endurance Modification", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Surrounds and Immobilizes a single target in an Electric Fence. Deals some damage over time and slowly drains some Endurance. Useful for keeping villains at bay.",
            shortHelp: "Ranged, DoT (Energy), Foe Immobilize, -End",
            icon: "electricitymanipulation_electricfence.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    type: "Energy",
                    scale: 0.4758,
                    ticks: 4
                },
                buffDuration: 8.2
            }
        },
        {
            name: "Build Up",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "electricitymanipulation_buildup.png",
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
            name: "Havoc Punch",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Endurance Modification", "Knockback", "Melee Damage", "Sleep", "Universal Damage Sets"],
            description: "The Havoc Punch is a slower attack than Charged Brawl, but makes up for it with greater damage. Havoc Punch can knock down targets, drain some Endurance from your target, or even overload their synapses, leaving them writhing for a moment. A portion of the drained Endurance may be given back to you. Disturbing an overloaded target will disperse the electrical charge and release them.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe Sleep, -End, Knock back",
            icon: "electricitymanipulation_havokpunch.png",
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
                            type: "Energy",
                            scale: 4.01
                        },
                        {
                            type: "Smashing",
                            scale: 0.6
                        }
                    ],
                    scale: 4.609999999999999
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Thunder Strike",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave.",
            shortHelp: "Melee (AoE), DMG(Smash/Energy), Foe Disorient, Knockback",
            icon: "electricitymanipulation_thunderstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.53,
                buffDuration: 10.8
            }
        },
        {
            name: "Dynamo",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Endurance Modification", "Healing", "Melee AoE Damage", "Universal Damage Sets"],
            description: "While active, you regenerate health and recover endurance very quickly. Overflow energy generated by this power can damage all nearby foes.",
            shortHelp: "Toggle: PBAoE, DoT (Energy), Foe -End",
            icon: "electricitymanipulation_lightningfield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 2.03,
                damage: {
                    type: "Energy",
                    scale: 0.30820000000000003
                }
            }
        },
        {
            name: "Power Sink",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification"],
            description: "Power Sink leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance. If there are no foes within range, you will not gain any Endurance.",
            shortHelp: "PBAoE, Self +End, Foe -End",
            icon: "electricitymanipulation_powersink.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 13.0,
                cast: 2.03,
                buffDuration: 4.0
            }
        },
        {
            name: "Force of Thunder",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Knockback", "Stuns"],
            description: "You can channel the raw force of a thunderbolt through you knocking enemies back and potentially disorienting them.",
            shortHelp: "PBAoE, Foe Disorient, Knockback",
            icon: "electricitymanipulation_lightningclap.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                recharge: 30.0,
                endurance: 14.0,
                cast: 1.23,
                buffDuration: 8.73
            }
        },
        {
            name: "Shocking Grasp",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Endurance Modification", "Holds", "Melee Damage", "Universal Damage Sets"],
            description: "Shocking Grasp causes the target to be overcome with a violent electrical charge. The seized target is left writhing in agony and is unable to defend themselves. Shocking Grasp also drains a significant amount of Endurance from the target and may return a portion of it to you.",
            shortHelp: "Melee, DoT (Energy), Target Hold, -End",
            icon: "electricitymanipulation_shockinggrasp.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 15.0,
                endurance: 18.2,
                cast: 1.0,
                dotDamage: {
                    type: "Energy",
                    scale: 0.5832999999999999,
                    ticks: 5
                },
                buffDuration: 5.1
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/electricity-manipulation'] = BLASTER_ELECTRICITY_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_ELECTRICITY_MANIPULATION_POWERSET = BLASTER_ELECTRICITY_MANIPULATION_POWERSET;
}