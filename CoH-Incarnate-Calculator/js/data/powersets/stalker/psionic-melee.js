/**
 * Psionic Melee
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_PSIONIC_MELEE_POWERSET = {
    name: "Psionic Melee",
    category: "Unknown",
    description: "Psionic Melee powerset",
    icon: "psionic-melee_set.png",
    powers: [
        {
            name: "Mental Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You project psionic energy around your fist and strike at your foe dealing light Psionic and Smashing damage. Affected foes will have their recharge rate reduced. Mental Strike has a small chance to grant you Insight. While you have Insight, Mental Strike will deal additional minor psionic damage over time.",
            shortHelp: "Melee, DMG(Psionic/Smash), Foe -Rech; Self +Insight",
            icon: "psionicmelee_mentalstrike.png",
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
                    types: [
                        {
                            type: "Psionic",
                            scale: 1.545
                        },
                        {
                            type: "Smashing",
                            scale: 0.515
                        }
                    ],
                    scale: 2.06
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Psi Blade",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You lash at your foe's mind with a mentally projected blade of psychic energy to deal moderate Psionic and Lethal damage. Affected foes will have their recharge rate reduced. Psi Blade has a moderate chance to grant you Insight. While you have Insight, Psi Blade will deal additional minor psionic damage over time.",
            shortHelp: "Melee, DMG(Psionic/Lethal), Foe -Rech, Self +Insight",
            icon: "psionicmelee_psiblade.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 5.928,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 2.0032
                        },
                        {
                            type: "Lethal",
                            scale: 0.6677
                        }
                    ],
                    scale: 2.6709
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Telekinetic Blow",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You project telekinetic energy around your fist before delivering a shattering uppercut to your foe dealing high Psionic and Smashing damage and sending them flying into the air. Telekinetic Blow has a high chance of granting you Insight. While you have Insight, Telekinetic Blow will deal additional minor psionic damage over time.",
            shortHelp: "Melee, DMG(Psionic/Smash), Foe Knock Up, Self +Insight",
            icon: "psionicmelee_telekineticblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 9.0,
                endurance: 9.36,
                cast: 1.47,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 2.6917
                        },
                        {
                            type: "Smashing",
                            scale: 0.8972
                        }
                    ],
                    scale: 3.5888999999999998
                }
            }
        },
        {
            name: "Assassin's Psi Blade",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior psionic and smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Psi Blade has a good chance to grant Insight if used while not hidden and a very high chance to grant Insight if used while hidden. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Psionic/Smash), +Insight",
            icon: "psionicmelee_assassinspsiblade.png",
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
            name: "Concentration",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "psionicmelee_concentration.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 2.0,
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
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Blow. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "psionicmelee_placate.png",
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
            name: "Boggle",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Confuse"],
            description: "You flood your foe's mind with doubt causing them to become confused for a brief time. Confused foes will attack their allies. Boggle will also place the \"Boggled\" effect on your target for a short time. Attacking a Boggled target will increase your chance of gaining Insight.",
            shortHelp: "Short Ranged, Target Confuse, +Special",
            icon: "psionicmelee_boggle.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 20.0,
                endurance: 7.8,
                cast: 2.0
            }
        },
        {
            name: "Greater Psi Blade",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Holds", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You focus and create a more powerful Psi Blade projection before slashing at your foe to deal superior Psionic and Lethal damage. The affected foe will have their recharge reduced moderately and be left held for a short time. Greater Psi Blade will cause additional damage and cause this power's hold to last for a longer duration if you have Insight. Using this power removes Insight.",
            shortHelp: "Melee, DMG(Psionic/Lethal), Foe -Rech, Hold; Self -Insight",
            icon: "psionicmelee_greaterpsiblade.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.5,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 4.0649999999999995
                        },
                        {
                            type: "Lethal",
                            scale: 1.3775
                        }
                    ],
                    scale: 5.442499999999999
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Mass Levitate",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You build up a large amount of telekinetic energy and release it causing nearby foes to be flung into the air. Affected foes will suffer high Smashing damage. If the caster has Insight when this power is used Mass Levitate will also cause a moderate amount of Psionic damage over time.",
            shortHelp: "PBAoE, DMG(Smash), Foe Knock Up, +Insight",
            icon: "psionicmelee_masslevitate.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.5,
                damage: {
                    type: "Smashing",
                    scale: 2.5999999999999996
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/psionic-melee'] = STALKER_PSIONIC_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_PSIONIC_MELEE_POWERSET = STALKER_PSIONIC_MELEE_POWERSET;
}