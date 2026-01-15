/**
 * Ninja Sword
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_NINJA_SWORD_POWERSET = {
    name: "Ninja Sword",
    category: "Unknown",
    description: "Ninja Sword powerset",
    icon: "ninja-sword_set.png",
    powers: [
        {
            name: "Gambler's Cut",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You perform a quick slash with your Ninja Blade. This attack is very fast, but deals only minor lethal damage. This attack can reduce a target's Defense, making them easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe -Def",
            icon: "katana_slash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.67,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.9145,
                    ticks: 1
                },
                buffDuration: 0.3,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Sting of the Wasp",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You perform a standard attack with your Ninja Blade. This attack is slower than Gambler's Cut, but deals more lethal damage. Sting of the Wasp can reduce a target's Defense, making them easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe -Def",
            icon: "katana_hack.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 2.5789999999999997
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Flashing Steel",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You swing your Ninja Blade in a wide arc in front of you, slicing multiple foes with lethal damage. This attack can reduce a target's Defense, making them easier to hit. If executed while hidden, all affected targets have a chance to be hit with a Critical for extra damage.",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe -Def",
            icon: "katana_slice.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.2689,
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.032,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 2.0884
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Assassin's Blade",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior lethal damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you impale your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "katana_assassinblade.png",
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
            icon: "katana_buildup.png",
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
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Blade. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "katana_placate.png",
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
            name: "Divine Avalanche",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defense Sets", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can use your Ninja Blade to parry incoming melee attacks and then quickly return the favor. Divine Avalanche does minor damage, but every successful hit will increase your Defense against melee and lethal attacks for a short while.",
            shortHelp: "Melee, DMG(Lethal), Self +DEF (Melee, Lethal)",
            icon: "katana_parry.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.33,
                damage: {
                    type: "Lethal",
                    scale: 2.291
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Soaring Dragon",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You perform a powerful Soaring Dragon maneuver that deals a great amount of lethal damage, and can knock a target up into the air. This attack can reduce a target's Defense, making them easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe Knockup, -DEF",
            icon: "katana_disembowel.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 9.0,
                endurance: 9.36,
                cast: 1.33,
                damage: {
                    type: "Lethal",
                    scale: 3.491
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Golden Dragonfly",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You perform a devastating Golden Dragonfly attack that deals a massive amount of lethal damage and can even knock a foe down to the ground and reduce their Defense. The power of this attack can actually extend a short distance through multiple foes. If executed while hidden, only some affected targets may be hit with a Critical, however, there is a chance you may land a Critical hit with Golden Dragonfly even if you are not Hidden.",
            shortHelp: "Melee, High DMG(Lethal), Foe Knockback, -DEF",
            icon: "katana_headsplitter.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 0.3491,
            effects: {
                accuracy: 1.05,
                range: 10.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.83,
                damage: {
                    type: "Lethal",
                    scale: 4.440899999999999
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/ninja-sword'] = STALKER_NINJA_SWORD_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_NINJA_SWORD_POWERSET = STALKER_NINJA_SWORD_POWERSET;
}