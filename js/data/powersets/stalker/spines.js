/**
 * Spines
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_SPINES_POWERSET = {
    name: "Spines",
    category: "Unknown",
    description: "Spines powerset",
    icon: "spines_set.png",
    powers: [
        {
            name: "Barb Swipe",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "Shred your opponent with several quick Swipes from your Spines. Barb Swipe deals Light Lethal damage and a minor amount of additional Toxic damage over time and Slows affected foes.",
            shortHelp: "Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
            icon: "quills_swipe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.83,
                damage: {
                    type: "Lethal",
                    scale: 1.9409999999999998
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 2
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Lunge",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You Lunge forward, stabbing and poisoning a foe with the large Spine on your arm. Lunge deals moderate lethal damage. Spine poison deals additional Toxic damage and Slows affected foes.",
            shortHelp: "Melee, DMG(Lethal), DoT(Toxic) -SPD, -Recharge",
            icon: "quills_lunge.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.63,
                damage: {
                    type: "Lethal",
                    scale: 3.101
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Spine Burst",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can fling dozens of Spines in all directions. These Spines only travel a short distance, but they can deal moderate lethal damage and poison any target close to you. Spine poison deals additional Toxic damage and Slows affected foes. If executed while hidden, all affected targets have a chance to be hit with a Critical Hit for extra damage.",
            shortHelp: "PBAoE Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
            icon: "quills_flingquills.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 3.0,
                damage: {
                    type: "Lethal",
                    scale: 1.8662
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Assassin's Impaler",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior lethal damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you impale your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "quills_assassinstrike.png",
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
            icon: "quills_bristle.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
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
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Impaler. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "quills_placate.png",
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
            name: "Impale",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Immobilize", "Ranged Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can throw a single large Spine at a targeted foe. This Spine does only moderate lethal damage, but carries a large amount of the Spine toxin. A successful attack can completely Immobilize most foes, as well as Slowing them and dealing Toxic poison damage. Impale can also bring down flying entities.",
            shortHelp: "Ranged, DMG(Lethal), DoT(Toxic), Immobilize, -Recharge, -Fly",
            icon: "quills_impale.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.43,
                damage: {
                    type: "Lethal",
                    scale: 4.061
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 4
                },
                buffDuration: 4.1
            }
        },
        {
            name: "Ripper",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can unleash a spectacular slashing maneuver that attacks all foes in a wide arc in front of you. Ripper deals massive lethal damage and poisons multiple targets. It can even knock foes down. Spine poison Slows affected targets and deals additional Toxic damage. If executed while hidden, all affected targets have a chance to be hit with a Critical Hit for extra damage.",
            shortHelp: "Melee (Cone), DMG(Lethal), DoT(Toxic), Knockback, -SPD, -Recharge",
            icon: "quills_bonesword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 2.33,
                damage: {
                    type: "Lethal",
                    scale: 3.6689
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.2,
                    ticks: 4
                },
                buffDuration: 4.1
            }
        },
        {
            name: "Throw Spines",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can throw dozens of Spines in a wide cone in front of you, impaling foes caught within the range. Spine throwing deals moderate lethal damage, and poisons any targets it hits. Spine poison deals additional Toxic damage and Slows affected foes. If executed while hidden, all affected targets have a chance to be hit with a Critical Hit for extra damage.",
            shortHelp: "Ranged (Cone), DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
            icon: "quills_quillthrowing.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 12.0,
                endurance: 13.0,
                cast: 1.63,
                damage: {
                    type: "Lethal",
                    scale: 1.8888
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 4
                },
                buffDuration: 4.1
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/spines'] = STALKER_SPINES_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_SPINES_POWERSET = STALKER_SPINES_POWERSET;
}