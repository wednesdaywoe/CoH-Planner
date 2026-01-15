/**
 * Psionic Melee
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_PSIONIC_MELEE_POWERSET = {
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
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 4.4449
                        },
                        {
                            type: "Smashing",
                            scale: 0.515
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 5.337899999999999
                },
                dotDamage: {
                    type: "Psionic",
                    scale: 0.084,
                    ticks: 3
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
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 5.8141
                        },
                        {
                            type: "Lethal",
                            scale: 0.6677
                        },
                        {
                            type: "Fire",
                            scale: 0.513
                        }
                    ],
                    scale: 6.9948
                },
                dotDamage: {
                    type: "Psionic",
                    scale: 0.2285,
                    ticks: 3
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
            allowedSetCategories: ["Knockback", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 8.0806
                        },
                        {
                            type: "Smashing",
                            scale: 0.8972
                        },
                        {
                            type: "Fire",
                            scale: 0.81
                        }
                    ],
                    scale: 9.7878
                },
                dotDamage: {
                    type: "Psionic",
                    scale: 0.18,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Concentration",
            available: 5,
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
            name: "Psi Blade Sweep",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You project a Psi Blade and swing it in a broad arc hitting all foes within a wide cone in front of you for high Psionic and Lethal damage. Foes struck by this power have their recharge reduced and have chance to become disoriented for a short time. Psi Blade Sweep has a high chance of granting you Insight. While you have Insight, Psi Blade Sweep will deal additional minor psionic damage over time and has a greater chance to disorient foes.",
            shortHelp: "Melee (Cone), DMG(Psionic/Lethal), Foe Disorient, -Rech; Self +Insight",
            icon: "psionicmelee_psibladesweep.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.2217,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.77,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 6.773999999999999
                        },
                        {
                            type: "Lethal",
                            scale: 0.762
                        },
                        {
                            type: "Fire",
                            scale: 0.648
                        }
                    ],
                    scale: 8.184
                },
                dotDamage: {
                    type: "Psionic",
                    scale: 0.236,
                    ticks: 3
                },
                buffDuration: 6.0,
                stun: 3.0
            }
        },
        {
            name: "Confront",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Challenges a foe to attack you. Useful to pull a foe off an ally who finds themselves in over their head. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged, Foe Taunt",
            icon: "psionicmelee_confront.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 3.0,
                cast: 1.67,
                buffDuration: 12.0
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
            allowedSetCategories: ["Holds", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            scale: 15.1572
                        },
                        {
                            type: "Lethal",
                            scale: 1.3775
                        },
                        {
                            type: "Fire",
                            scale: 1.242
                        }
                    ],
                    scale: 17.776699999999998
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
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                    types: [
                        {
                            type: "Smashing",
                            scale: 6.4597999999999995
                        },
                        {
                            type: "Fire",
                            scale: 0.639
                        }
                    ],
                    scale: 7.0988
                },
                dotDamage: {
                    type: "Psionic",
                    scale: 0.142,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/psionic-melee'] = SCRAPPER_PSIONIC_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_PSIONIC_MELEE_POWERSET = SCRAPPER_PSIONIC_MELEE_POWERSET;
}