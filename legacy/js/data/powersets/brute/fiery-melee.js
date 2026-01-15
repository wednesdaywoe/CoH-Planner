/**
 * Fiery Melee
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_FIERY_MELEE_POWERSET = {
    name: "Fiery Melee",
    category: "Unknown",
    description: "Fiery Melee powerset",
    icon: "fiery-melee_set.png",
    powers: [
        {
            name: "Fire Sword",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Through concentration, you can create a Sword of Fire that sets foes ablaze. Successful attacks from the Fire Sword will cut through your target defenses and ignite them, dealing damage over time.",
            shortHelp: "Melee, DMG(Fire), -Defense",
            icon: "fieryfray_firesword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.33,
                damage: {
                    type: "Fire",
                    scale: 2.891
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1,
                defenseDebuff: 0.5
            }
        },
        {
            name: "Scorch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "This power engulfs your hands in flames, and can ignite the target of your Scorching attack. Once on fire, the target will suffer damage over time.",
            shortHelp: "Melee, DMG(Fire)",
            icon: "fieryfray_targetedlightmelee.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.0,
                damage: {
                    type: "Fire",
                    scale: 2.06
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
            name: "Cremate",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "A slow but devastating attack. Cremate clobbers your foes with a massive 2 handed fiery smash knocks down and leaves your foe on fire.",
            shortHelp: "Melee, DMG(Fire), Knockup",
            icon: "fieryfray_scorch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.5,
                damage: {
                    type: "Fire",
                    scale: 3.41
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Build Up",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "fieryfray_followup.png",
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
            name: "Incinerate",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Intense concentration can allow you to Incinerate an opponent. This will set your foe ablaze, dealing very high damage over a short time.",
            shortHelp: "Melee, DoT (Fire)",
            icon: "fieryfray_incinerate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 6.864,
                cast: 1.67,
                dotDamage: {
                    type: "Fire",
                    scale: 0.44689999999999996,
                    ticks: 9
                },
                buffDuration: 4.6
            }
        },
        {
            name: "Taunt",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "fieryfray_willowisp.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.67,
                buffDuration: 20.0
            }
        },
        {
            name: "Breath of Fire",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "This allows you to spew forth fire from your mouth, burning all foes within its narrow cone. This is a very accurate attack that can deal good damage at a close range.",
            shortHelp: "Close (Cone) DoT (Fire)",
            icon: "fieryfray_breathingfire.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.2,
                range: 15.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 2.67,
                dotDamage: {
                    type: "Fire",
                    scale: 1.8491,
                    ticks: 1
                },
                buffDuration: 0.6
            }
        },
        {
            name: "Fire Sword Circle",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Mastery of your Fire Sword has enabled you to make an attack on every foe within melee distance. This will slash burn and cut through the defenses of your enemies, dealing moderate damage and setting them ablaze.",
            shortHelp: "PBAoE Melee, DMG(Fire), -Defense",
            icon: "fieryfray_fireswordcircle.png",
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
                    type: "Fire",
                    scale: 2.6516
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1,
                defenseDebuff: 0.5
            }
        },
        {
            name: "Greater Fire Sword",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Your mastery of fire allows you to create an enhanced Sword of Fire that can set foes ablaze and cut through their defenses. Successful attacks from the Greater Fire Sword will ignite your target, dealing damage over time.",
            shortHelp: "Melee, DMG(Fire), -Defense",
            icon: "fieryfray_greaterfiresword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 12.0,
                endurance: 12.688,
                cast: 1.37,
                damage: {
                    type: "Fire",
                    scale: 4.279
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.2,
                    ticks: 4
                },
                buffDuration: 4.1,
                defenseDebuff: 0.5
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/fiery-melee'] = BRUTE_FIERY_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_FIERY_MELEE_POWERSET = BRUTE_FIERY_MELEE_POWERSET;
}