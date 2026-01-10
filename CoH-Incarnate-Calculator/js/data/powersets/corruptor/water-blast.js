/**
 * Water Blast
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_WATER_BLAST_POWERSET = {
    name: "Water Blast",
    category: "Unknown",
    description: "Water Blast powerset",
    icon: "water-blast_set.png",
    powers: [
        {
            name: "Aqua Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Corruptor Archetype Sets", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "You strike your foe with a rapid blast of freezing cold water causing Cold and Smashing damage as well as reducing their defense. Aqua Bolt builds 1 Tidal Power.",
            shortHelp: "Ranged, DMG(Cold/Smash), Foe -Def, +Wet, Self +Tidal Power",
            icon: "waterblast_aquabolt.png",
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
                            type: "Cold",
                            scale: 3.6048999999999998
                        },
                        {
                            type: "Smashing",
                            scale: 0.515
                        }
                    ],
                    scale: 4.1198999999999995
                },
                defenseDebuff: 1.0,
                buffDuration: 8.0
            }
        },
        {
            name: "Hydro Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You briefly focus before releasing an intense blast of chilling water at your foe that causes Cold and Smashing damage. Affected foes will have their movement speed reduced briefly and have a chance to be knocked down. Hydro Blast builds 1 Tidal Power.",
            shortHelp: "Ranged, DMG(Cold/Smash), Foe -Speed, Knockdown, +Wet, Self +Tidal Power",
            icon: "waterblast_hydroblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 7.0,
                endurance: 7.696,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 5.8256
                        },
                        {
                            type: "Smashing",
                            scale: 0.8322
                        }
                    ],
                    scale: 6.6578
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Water Burst",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You cause water to violently explode from beneath your target's feet blasting all foes nearby with freezing cold water. Affected targets will suffer Cold and Smashing damage, have their movement speed reduced and may be knocked down by the force of the blast. Water Burst consumes all Tidal Power. It will deal additional cold damage and have a greater chance to knockdown for each stack of Tidal Power. If you have 3 stacks of Tidal Power Water Burst will have a 100% chance to knock the targets into the air.",
            shortHelp: "Ranged (Targeted AoE), DMG(Cold/Smash), Foe -Speed, Knockdown, +Wet, Self -Tidal Power",
            icon: "waterblast_waterburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.73,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 3.4558
                        },
                        {
                            type: "Smashing",
                            scale: 0.3981
                        }
                    ],
                    scale: 3.8539
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Whirlpool",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Corruptor Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You create a violent whirlpool at the target location causing Cold damage over time, reducing the targets' speed and defense for a short time. Whirlpool grants 1 stack of Tidal Power.",
            shortHelp: "Ranged (Location AoE), DoT(Cold), -Speed, -Defense, Self +Tidal Power",
            icon: "waterblast_whirlpool.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                endurance: 15.6,
                cast: 2.03,
                buffDuration: 15.0
            }
        },
        {
            name: "Tidal Forces",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "You draw tidal energies into yourself thus boosting your chance to hit significantly, slightly boosting your damage and granting yourself +3 Tidal Power.",
            shortHelp: "Self +To Hit, +DMG",
            icon: "waterblast_tidalforces.png",
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
            name: "Dehydrate",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate Healing", "Corruptor Archetype Sets", "Defense Debuff", "Healing", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You rapidly dehydrate your target, causing Cold and Smashing damage, reducing their movement speed and defense as well as causing a measure of Cold damage over time. You are then healed over time for a moderate amount of health. Dehydrate grants 1 stack of Tidal Power if you have 2 or less. Dehydrate will consume all stacks of Tidal Power if you have 3, but the power's heal over time effect is increased by 50%.",
            shortHelp: "Ranged, DMG(Cold/Smash), Foe -Speed, -Defense, DoT(Cold), Self +Heal Over Time, +/- Tidal Power",
            icon: "waterblast_dehydrate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.87,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 5.9406
                        },
                        {
                            type: "Smashing",
                            scale: 0.7572
                        }
                    ],
                    scale: 6.6978
                },
                dotDamage: {
                    type: "Cold",
                    scale: 0.2589,
                    ticks: 4
                },
                healing: {
                    scale: 44.17450124999999,
                    perTarget: true
                },
                buffDuration: 4.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Water Jet",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You spray a concentrated torrent of water toward your target that causes Cold and Smashing damage as well as reducing your target's movement speed. If you have 2 or less Tidal Power, you will gain a stack of Tidal Power. If you have 3 Tidal Power and you activate this power, it will have an enhanced effect causing Water Jet to cast slightly faster and immediately reset the recharge of Water Jet. Water Jet's enhanced effect can be used once every 8 seconds.",
            shortHelp: "Ranged, DMG(Cold/Smash), Foe -Speed, +Wet, Self +/-Tidal Power",
            icon: "waterblast_waterjet.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.43
            }
        },
        {
            name: "Steam Spray",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Corruptor Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You spray scalding hot steam in a cone in front of you badly burning affected targets. Steam Spray causes Fire damage, Fire damage over time and reduces the target's Defense slightly. Steam Spray grants 1 stack of Tidal Power.",
            shortHelp: "Ranged (Cone), DMG(Fire), Foe -Defense, DoT(Fire), +Wet, Self +Tidal Power",
            icon: "waterblast_steamspray.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.8727,
            effects: {
                accuracy: 1.2,
                range: 40.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.53,
                damage: {
                    type: "Fire",
                    scale: 2.8810000000000002
                },
                dotDamage: {
                    type: "Fire",
                    scale: 3.0260000000000002,
                    ticks: 1
                },
                buffDuration: 0.6,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Geyser",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged AoE Damage", "Slow Movement", "Stuns", "Universal Damage Sets"],
            description: "You cause the earth to erupt beneath your target's feet as a Geyser of scalding hot water burns your foes and tosses them violently into the air. Geyser causes Fire and Smashing damage before causing Fire damage over time as well as reducing their movement speed. Geyser consumes all Tidal Power. Both the initial damage and damage over time portions of this power will be increased and have a scaling chance to disorient for each stack of Tidal Power. If you have 3 stacks of Tidal Power, Geyser will have a 100% chance to disorient affected targets.",
            shortHelp: "Ranged (Targeted AoE), DMG(Fire/Smash), Foe DoT(Fire), +Wet, -Speed, Knock Up, Disorient, Self -Tidal Power",
            icon: "waterblast_geyser.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.4,
                range: 80.0,
                recharge: 125.0,
                endurance: 20.8,
                cast: 2.93,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 7.5684000000000005
                        },
                        {
                            type: "Smashing",
                            scale: 0.8921
                        }
                    ],
                    scale: 8.4605
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.6028,
                    ticks: 10
                },
                stun: 3.0,
                buffDuration: 5.1
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/water-blast'] = CORRUPTOR_WATER_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_WATER_BLAST_POWERSET = CORRUPTOR_WATER_BLAST_POWERSET;
}