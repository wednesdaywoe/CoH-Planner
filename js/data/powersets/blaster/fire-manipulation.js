/**
 * Fire Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_FIRE_MANIPULATION_POWERSET = {
    name: "Fire Manipulation",
    category: "Unknown",
    description: "Fire Manipulation powerset",
    icon: "fire-manipulation_set.png",
    powers: [
        {
            name: "Fire Sword",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee Damage", "Universal Damage Sets"],
            description: "Through concentration, you can create a Sword of Fire that sets foes ablaze. Successful attacks from the Fire Sword will cut through your target defenses and ignite them, dealing damage over time.",
            shortHelp: "Melee, Moderate DMG(Fire), -Defense",
            icon: "firemanipulation_firesword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.33,
                damage: {
                    type: "Fire",
                    scale: 3.691
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.1,
                    ticks: 4
                },
                buffDuration: 3.1,
                defenseDebuff: 0.5
            }
        },
        {
            name: "Ring of Fire",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizes your target in a Ring of Fire. Deals some damage over time. Useful for keeping villains at bay.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, DoT (Fire), Foe Immobilize",
            icon: "firemanipulation_ringoffire.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 6.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    type: "Fire",
                    scale: 0.4632,
                    ticks: 6
                },
                buffDuration: 9.2
            }
        },
        {
            name: "Combustion",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Universal Damage Sets"],
            description: "Your mastery of fire allows you to violently raise the temperature around yourself in an attempt to spontaneously combust any nearby foes and set them ablaze, dealing damage over time.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee (AoE), DoT (Fire)",
            icon: "firemanipulation_combustion.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 13.0,
                cast: 2.4,
                damage: {
                    type: "Fire",
                    scale: 0.9855
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.1971,
                    ticks: 9
                },
                buffDuration: 7.1
            }
        },
        {
            name: "Fire Sword Circle",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Universal Damage Sets"],
            description: "Mastery of your Fire Sword has enabled you to make an attack on every foe within melee distance. This will slash and burn your enemies, dealing minor damage and setting them ablaze.",
            shortHelp: "PBAoE Melee, DMG(Fire/Lethal)",
            icon: "firemanipulation_fireswordcircle.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 2.5085
                        },
                        {
                            type: "Lethal",
                            scale: 0.755
                        }
                    ],
                    scale: 3.2635
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.1,
                    ticks: 2
                },
                buffDuration: 2.1
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
            shortHelp: "Self +DMG +To Hit",
            icon: "firemanipulation_buildup.png",
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
            name: "Cauterizing Aura",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Blaster Archetype Sets", "Endurance Modification", "Healing", "Melee AoE Damage", "Universal Damage Sets"],
            description: "While active, you are surrounded by flames that continuously burn all foes that attempt to enter melee range. In addition, you recover a small amount of health every few seconds.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: PBAoE, DoT (Fire), Self +Heal Over Time, +Recovery",
            icon: "firemanipulation_blazingaura.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 2.03,
                damage: {
                    type: "Fire",
                    scale: 0.36260000000000003
                }
            }
        },
        {
            name: "Consume",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Endurance Modification", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can Consume some fuel from your nearby enemies to recover Endurance.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, DMG(Fire), Self +End",
            icon: "firemanipulation_consume.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 0.52,
                cast: 2.03,
                buffDuration: 15.0
            }
        },
        {
            name: "Burn",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can ignite the ground beneath you, freeing yourself from Immobilization effects. Foes that enter the flames you leave behind will take damage. You must be near the ground to activate this power.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Location (PBAoE), DoT (Fire), Self Res(Immobilize)",
            icon: "firemanipulation_burn.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                recharge: 25.0,
                endurance: 5.2,
                cast: 2.03,
                damage: {
                    type: "Fire",
                    scale: 1.44
                }
            }
        },
        {
            name: "Hot Feet",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "While active, you heat the earth in a large area around yourself. Enemy movement is Slowed as they attempt to flee the immediate area. All foes in the affected area may also suffer some damage over time. You cannot fly and must be near the ground to use this power.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Toggle: PBAoE, DoT (Fire), Foe -SPD",
            icon: "firemanipulation_hotfeet.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 2.08,
                cast: 1.47,
                damage: {
                    type: "Fire",
                    scale: 0.45330000000000004
                },
                buffDuration: 15.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/fire-manipulation'] = BLASTER_FIRE_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_FIRE_MANIPULATION_POWERSET = BLASTER_FIRE_MANIPULATION_POWERSET;
}