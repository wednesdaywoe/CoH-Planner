/**
 * Claws
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_CLAWS_POWERSET = {
    name: "Claws",
    category: "Unknown",
    description: "Claws powerset",
    icon: "claws_set.png",
    powers: [
        {
            name: "Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You perform a deadly Strike with your claws. This is a basic attack that deals a moderate amount of lethal damage.",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "claws_clawsstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.2,
                endurance: 4.16,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 2.427
                }
            }
        },
        {
            name: "Swipe",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A quick Swipe with your claws. Does minor lethal damage, but has a quick recharge rate.",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "claws_clawsswipe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 1.7,
                endurance: 2.912,
                cast: 0.83,
                damage: {
                    type: "Lethal",
                    scale: 1.809
                }
            }
        },
        {
            name: "Slash",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You Slash at your foe with your claws, dealing a good amount of lethal damage, but with a longer recharge rate than Swipe or Strike . This attack can reduce a target's Defense, making them easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe -DEF",
            icon: "claws_slash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 4.8,
                endurance: 5.4912,
                cast: 1.33,
                damage: {
                    type: "Lethal",
                    scale: 2.843
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Assassin's Claw",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior lethal damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you impale your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "claws_assassinclaw.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.0
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
            icon: "claws_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 72.0,
                endurance: 4.16,
                cast: 0.73,
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
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Claw. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "claws_placate.png",
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
            name: "Focus",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "Projects a burst of Focused power over a short distance. Focus deals high lethal damage and can possibly knock down your foe.",
            shortHelp: "Ranged, DMG(Lethal), Knockback",
            icon: "claws_focus.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 6.4,
                endurance: 6.8224,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 2.865
                }
            }
        },
        {
            name: "Eviscerate",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You spin and slash violently at the foe in front of you. This attack deals exceptional damage, and has a high chance of landing a critical hit even while not hidden.",
            shortHelp: "Melee, DMG(Lethal), +Special",
            icon: "claws_stalkereviscerate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.867,
                endurance: 8.8749,
                cast: 2.33,
                damage: {
                    type: "Lethal",
                    scale: 4.6157
                }
            }
        },
        {
            name: "Shockwave",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "Projects a Shockwave of focused power that can travel a short distance. Shockwave travels in a wide arc in front of you dealing moderate lethal damage and, possibly knocking back foes. If executed while hidden, all affected targets have a chance to be hit with a Critical for extra damage.",
            shortHelp: "Ranged (Cone), DMG(Lethal), Foe Knockback",
            icon: "claws_wave.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 12.1,
                endurance: 11.5648,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 1.6661000000000001
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/claws'] = STALKER_CLAWS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_CLAWS_POWERSET = STALKER_CLAWS_POWERSET;
}