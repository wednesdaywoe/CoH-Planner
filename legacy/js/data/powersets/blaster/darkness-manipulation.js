/**
 * Darkness Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_DARKNESS_MANIPULATION_POWERSET = {
    name: "Darkness Manipulation",
    category: "Unknown",
    description: "Darkness Manipulation powerset",
    icon: "darkness-manipulation_set.png",
    powers: [
        {
            name: "Penumbral Grasp",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Immobilize", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "Penumbral Grasp deals moderate Negative Energy damage, reduces their chance to hit and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.",
            shortHelp: "Ranged, Moderate DOT(Negative), Foe Immobilize, -To Hit",
            icon: "darknessmanipulation_penumbralgrasp.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.67,
                dotDamage: {
                    type: "Negative",
                    scale: 0.5458000000000001,
                    ticks: 4
                },
                buffDuration: 9.2,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Smite",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Melee Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a Smite that deals High negative energy damage. Smite clouds the target's vision, lowering its chance to hit for a short time.",
            shortHelp: "Melee, High DMG(Smash/Negative), Foe -To Hit",
            icon: "darknessmanipulation_smite.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 0.97,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 2.5791
                        },
                        {
                            type: "Smashing",
                            scale: 0.8596999999999999
                        }
                    ],
                    scale: 3.4387999999999996
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Death Shroud",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You become a focus point for the Netherworld, allowing its Negative Energy to seep from your body. This will continuously damage all foes in melee range.",
            shortHelp: "Toggle: PBAoE Minor DoT(Negative)",
            icon: "darknessmanipulation_deathshroud.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 1.04,
                cast: 2.47,
                damage: {
                    type: "Negative",
                    scale: 0.2
                }
            }
        },
        {
            name: "Shadow Maul",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Melee AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your entire arms with Negative Energy channeled from the Netherworlds, then perform a series of blows that deal a lot of damage over a short period of time to multiple targets in front of you. These blows cloud your target's vision, lowering his chance to hit for a short time.",
            shortHelp: "Melee (Cone), Superior DoT(Smash/Negative), Foe -To Hit",
            icon: "darknessmanipulation_shadowmaul.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 3.07,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.7136,
                            ticks: 3
                        },
                        {
                            type: "Negative",
                            scale: 0.7136,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 2.0,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Soul Drain",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "To Hit Buff", "Universal Damage Sets"],
            description: "Using this power, you can drain the essence of all nearby foes' souls, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and chance to hit.",
            shortHelp: "PBAoE Light DMG(Negative), Self +DMG, +To Hit",
            icon: "darknessmanipulation_souldrain.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.2,
                recharge: 120.0,
                endurance: 15.6,
                cast: 2.37,
                damage: {
                    type: "Negative",
                    scale: 1.0
                },
                tohitBuff: 1.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Touch of the Beyond",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Fear", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Endurance Modification", "Fear", "Healing", "To Hit Debuff"],
            description: "The Netherworld is one scary place, and with but a touch, you can give your enemy a glimpse into this dark world. This will cause them to helplessly tremble in Fear. Foes in this state of panic have reduced chance to hit. Additionally, drawing upon this connection to the Netherworld causes you to rapidly regenerate health and recover endurance for a short time.<br><br><color #fcfc95>Notes: Touch of the Beyond is unaffected by Range changes.</color>",
            shortHelp: "Fear, Foe -To Hit, Self +Regeneration, +Recovery, +Res(Fear)",
            icon: "darknessmanipulation_touchoffear.png",
            powerType: "Click",
            targetType: "Anything",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 10.0,
                endurance: 5.2,
                cast: 1.17
            }
        },
        {
            name: "Dark Consumption",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Endurance Modification", "Melee AoE Damage", "Universal Damage Sets"],
            description: "The dark power of the Netherworld allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Hit Points of your enemy and add to your Endurance.",
            shortHelp: "PBAoE Minor DMG(Negative), Self +End",
            icon: "darknessmanipulation_darkconsumption.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 0.52,
                cast: 1.03,
                damage: {
                    type: "Negative",
                    scale: 0.8
                },
                buffDuration: 8.53
            }
        },
        {
            name: "Dark Pit",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Stuns"],
            description: "Envelops a targeted foe and any nearby enemies in a pit of Negative Energy. The attack deals no damage, but Disorients all affected foes for a good while.",
            shortHelp: "Ranged (Targeted AoE), Foe Disorient",
            icon: "darknessmanipulation_darkpit.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                range: 70.0,
                recharge: 90.0,
                endurance: 20.18,
                cast: 1.07,
                stun: 3.0,
                buffDuration: 8.57
            }
        },
        {
            name: "Midnight Grasp",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Immobilize", "Melee Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe and continuously drain his life force.",
            shortHelp: "Melee, Superior DMG(Negative), Foe Immobilize, -To Hit",
            icon: "darknessmanipulation_midnightgrasp.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 18.0,
                endurance: 11.96,
                cast: 2.07,
                damage: {
                    type: "Negative",
                    scale: 4.902100000000001
                },
                dotDamage: {
                    type: "Negative",
                    scale: 0.18130000000000002,
                    ticks: 4
                },
                buffDuration: 3.1,
                tohitDebuff: 0.75
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/darkness-manipulation'] = BLASTER_DARKNESS_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_DARKNESS_MANIPULATION_POWERSET = BLASTER_DARKNESS_MANIPULATION_POWERSET;
}