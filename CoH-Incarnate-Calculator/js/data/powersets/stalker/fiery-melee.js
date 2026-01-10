/**
 * Fiery Melee
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_FIERY_MELEE_POWERSET = {
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                buffDuration: 1.6,
                defenseDebuff: 0.5
            }
        },
        {
            name: "Scorch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                buffDuration: 1.1
            }
        },
        {
            name: "Cremate",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                buffDuration: 1.6
            }
        },
        {
            name: "Assassin's Blaze",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior fire damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Blaze when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Fire)",
            icon: "fieryfray_assassin.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.67
            }
        },
        {
            name: "Build Up",
            available: 7,
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
            name: "Placate",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Strike. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "fieryfray_placate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                cast: 0.8,
                buffDuration: 10.0
            }
        },
        {
            name: "Breath of Fire",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                buffDuration: 1.6,
                defenseDebuff: 0.5
            }
        },
        {
            name: "Greater Fire Sword",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "Your mastery of fire allows you to create an enhanced Sword of Fire that can set foes ablaze and cut through their defenses. Successful attacks from the Greater Fire Sword will ignite your target, dealing damage over time.",
            shortHelp: "Melee, DMG(Fire), -Defense",
            icon: "fieryfray_greaterfiresword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 13.0,
                endurance: 12.688,
                cast: 1.37,
                damage: {
                    type: "Fire",
                    scale: 4.319
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.2,
                    ticks: 4
                },
                buffDuration: 2.1,
                defenseDebuff: 0.5
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/fiery-melee'] = STALKER_FIERY_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_FIERY_MELEE_POWERSET = STALKER_FIERY_MELEE_POWERSET;
}