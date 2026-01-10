/**
 * Ninja Training
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_NINJA_TRAINING_POWERSET = {
    name: "Ninja Training",
    category: "Unknown",
    description: "Ninja Training powerset",
    icon: "ninja-training_set.png",
    powers: [
        {
            name: "Immobilizing Dart",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizing Darts do minor toxic damage over time and weakens your foe's legs. They will either be entirely unable to move, or severely slowed down.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Minor DoT(Toxic), Foe Immobilize",
            icon: "ninjatools_immob.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 60.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.5,
                dotDamage: {
                    type: "Toxic",
                    scale: 0.522,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Sting of the Wasp",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee Damage", "Universal Damage Sets"],
            description: "You perform a standard attack with your Ninja Blade. Sting of the Wasp can reduce a target's Defense, making them easier to hit.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Lethal), Foe -Def",
            icon: "ninjatools_katanalight.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 10.0,
                endurance: 6.03,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 3.5789999999999997
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Choking Powder",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Toss a fistful of toxic powder at an enemy’s face. This powder will temporarily close the affected foe’s throat making them choke and struggle to grasp for air.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Moderate DoT(Toxic), Foe Hold",
            icon: "ninjatools_hold.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 60.0,
                recharge: 16.0,
                endurance: 11.388,
                cast: 1.07,
                dotDamage: {
                    type: "Toxic",
                    scale: 0.3548,
                    ticks: 4
                },
                buffDuration: 4.2
            }
        },
        {
            name: "Shinobi",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "To Hit Buff"],
            description: "A shinobi is a master of stealth and assassination. While this power is active you will be very hard to detect, and your first strike out of the shadows will deal extra damage. Even while detected, a shinobi is a deadly foe and able to deal lethal critical strikes.",
            shortHelp: "Toggle: Self Stealth, +DEF(All), +Special",
            icon: "ninjatools_assassin.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                buffDuration: 0.75,
                tohitBuff: 0.5
            }
        },
        {
            name: "The Lotus Drops",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You perform The Lotus Drops maneuver, attacking all foes in melee range. This attack wounds your opponents, causing them to take moderate damage over time and reduces their Defense.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE Melee, Moderate DMG(Lethal), Foe -Def",
            icon: "ninjatools_katanaaoe.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 14.0,
                endurance: 13.0,
                cast: 1.83,
                damage: {
                    type: "Lethal",
                    scale: 2.0835999999999997
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.25,
                    ticks: 2
                },
                buffDuration: 2.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Kuji-In Toh",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Resist Damage"],
            description: "Kuji-In Toh invokes the power of Toh, or harmony with the universe. Focusing your inner power, you can make your body regenerate and recover endurance for a while. You also gain resistance to psionic attacks and fear protection.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +Regen, +Recovery, Res(Psionic, Fear)",
            icon: "ninjatools_toh.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 200.0,
                endurance: 5.2,
                cast: 1.0,
                dotDamage: {
                    type: "Psionic",
                    scale: 1.0,
                    ticks: 105
                },
                protection: {
                    fear: 8.304
                },
                resistance: {
                    psionic: 0.07
                },
                buffDuration: 210.0
            }
        },
        {
            name: "Smoke Flash",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "You throw a smoke bomb at your feet. The resulting flash of light and smoke can briefly distract your foes and Placate them so they can no longer find or target you. Enemies will be distracted and confused, making them more vulnerable to attacks for a short time.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, Foe Placate, -Res",
            icon: "ninjatools_placate.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.4,
                recharge: 90.0,
                endurance: 2.6,
                cast: 1.83,
                buffDuration: 15.0
            }
        },
        {
            name: "Blinding Powder",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Confuse", "To Hit Debuff"],
            description: "You throw a handful of Blinding powder in a wide arc at your foes. Most foes will be blinded, and unable to see. Some affected targets may be overcome by the powder that they may start attacking their own allies. If you attack the blinded foes, they will be alerted to your presence, but will continue to suffer a penalty to their chance to hit.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color><br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Cone), Foe -To Hit, Sleep, Confuse, -Perception",
            icon: "ninjatools_blindingpowder.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.7854,
            effects: {
                accuracy: 0.8,
                range: 25.0,
                recharge: 90.0,
                endurance: 7.8,
                cast: 1.07,
                tohitDebuff: 1.0,
                buffDuration: 15.0
            }
        },
        {
            name: "Golden Dragonfly",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You perform a devastating Golden Dragonfly attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce their Defense. The power of this attack can actually extend a short distance through multiple foes.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Lethal), Foe Knockback, -DEF",
            icon: "ninjatools_goldendragonfly.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.3491,
            effects: {
                accuracy: 1.05,
                range: 10.0,
                recharge: 20.0,
                endurance: 11.856,
                cast: 1.83,
                damage: {
                    type: "Lethal",
                    scale: 6.041
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/ninja-training'] = BLASTER_NINJA_TRAINING_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_NINJA_TRAINING_POWERSET = BLASTER_NINJA_TRAINING_POWERSET;
}