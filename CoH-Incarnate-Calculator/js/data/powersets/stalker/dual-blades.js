/**
 * Dual Blades
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_DUAL_BLADES_POWERSET = {
    name: "Dual Blades",
    category: "Unknown",
    description: "Dual Blades powerset",
    icon: "dual-blades_set.png",
    powers: [
        {
            name: "Nimble Slash",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A quick swipe with your blades. Does minor lethal damage, but has a quick recharge rate. This attack is needed for the Attack Vitals combination attack.<br><br><color #ff7f00>Attack Vitals: Power Slice > Nimble Slash > Vengeful Slice.</color>",
            shortHelp: "Melee, Light DMG(Lethal)",
            icon: "dualblades_lightopening.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.03,
                dotDamage: {
                    type: "Lethal",
                    scale: 1.0405,
                    ticks: 1
                },
                buffDuration: 0.5
            }
        },
        {
            name: "Power Slice",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You perform a deadly Strike with your blades. This is a basic attack that deals a moderate amount of lethal damage. This power begins the Attack Vitals combination attack and is needed for the Weaken combination attack.<br><br><color #ff7f00>Attack Vitals: Power Slice > Nimble Slash > Vengeful Slice.</color><br><color #ff7f00>Weaken: Sweeping Strike > Power Slice > One Thousand Cuts.</color>",
            shortHelp: "Melee, Light DMG(Lethal)",
            icon: "dualblades_moderateopening.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 1.4,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.9128000000000001,
                    ticks: 2
                },
                buffDuration: 1.0
            }
        },
        {
            name: "Ablating Strike",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You Slash at your foe with your blades, dealing a good amount of lethal damage. This attack can reduce a target's Defense, making them easier to hit. This power is the finishing move of the Sweep combination attack.<br><br><color #ff7f00>Sweep: Build Up > Assassin’s Blades > Ablating Strike.</color>",
            shortHelp: "Melee, DMG(Lethal), Foe -DEF",
            icon: "dualblades_moderatebridge.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.03,
                dotDamage: {
                    type: "Lethal",
                    scale: 1.3405,
                    ticks: 1
                },
                buffDuration: 0.6,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Assassin's Blades",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior lethal damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous lethal damage, as you impale your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. This power is needed for the Empower and Sweep combination attacks. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.<br><br><color #ff7f00>Empower: Build Up > Assassin’s Blades > Placate.</color><br><color #ff7f00>Sweep: Build Up > Assassin’s Blades > Ablating Strike.</color>",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "dualblades_assassinblades.png",
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
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit. This power is the opening move for the Empower and Sweep combination attacks.<br><br><color #ff7f00>Empower: Build Up > Assassin’s Blades > Placate.</color><br><color #ff7f00>Sweep: Build Up > Assassin’s Blades > Ablating Strike.</color>",
            shortHelp: "Self +DMG, +To Hit",
            icon: "dualblades_buildup.png",
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
            description: "Allows you to trick a foe to no longer attack you. A successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or Assassination. However, if you attack a Placated Foe, he will be able to attack you back. This power is the finishing move in the Empower combination attack.<br><br><color #ff7f00>Empower: Build Up > Assassin’s Blades > Placate.</color>",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "dualblades_placate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                cast: 0.8,
                buffDuration: 10.0,
                tohitBuff: 1.0
            }
        },
        {
            name: "Vengeful Slice",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "Unleashes a series of strong attacks on your foe, dealing high lethal damage and knocking them down. This power is the finishing move for the Attack Vitals combination attack.<br><br><color #ff7f00>Attack Vitals: Power Slice > Nimble Slash > Vengeful Slice.</color>",
            shortHelp: "Melee, DMG(Lethal), Knockdown",
            icon: "dualblades_special1.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.43,
                damage: {
                    type: "Lethal",
                    scale: 4.0607999999999995
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.2,
                    ticks: 4
                },
                buffDuration: 4.1
            }
        },
        {
            name: "Sweeping Strike",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You make a sweeping strike with your blades, hitting all foes in a cone in front of you and dealing moderate lethal damage to each. This power is the opening move for the Weaken combination attack.<br><br><color #ff7f00>Weaken: Sweeping Strike > Power Slice > One Thousand Cuts.</color>",
            shortHelp: "Melee (Cone), DMG(Lethal)",
            icon: "dualblades_special2.png",
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
                cast: 1.23,
                damage: {
                    type: "Lethal",
                    scale: 3.0553999999999997
                }
            }
        },
        {
            name: "One Thousand Cuts",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "Unleashes a flurry of attacks on all foes in a cone in front of you, dealing moderate lethal damage to each foe hit. This power is the finishing move for the Weaken combination attack.<br><br><color #ff7f00>Weaken: Sweeping Strike > Power Slice > One Thousand Cuts.</color>",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe Knockback",
            icon: "dualblades_highlow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 10.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.3,
                damage: {
                    type: "Lethal",
                    scale: 1.1702
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.322,
                    ticks: 10
                },
                buffDuration: 2.05,
                defenseDebuff: 1.0,
                tohitDebuff: 1.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/dual-blades'] = STALKER_DUAL_BLADES_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_DUAL_BLADES_POWERSET = STALKER_DUAL_BLADES_POWERSET;
}