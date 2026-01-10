/**
 * Energy Aura
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_ENERGY_AURA_POWERSET = {
    name: "Energy Aura",
    category: "Unknown",
    description: "Energy Aura powerset",
    icon: "energy-aura_set.png",
    powers: [
        {
            name: "Dampening Field",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "Your body resonates a mild Dampening Field that absorbs kinetic energy from physical weapons as well as Energy damage. This auto power permanently reduces all incoming Smashing, Lethal and Energy damage as well as providing a minor amount of resistance to Endurance Drain effects. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Res (Smashing, Lethal, Energy, Endurance Drain)",
            icon: "energyaura_powershield.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.25,
                            ticks: 5
                        },
                        {
                            type: "Lethal",
                            scale: 1.25,
                            ticks: 5
                        },
                        {
                            type: "Energy",
                            scale: 1.0,
                            ticks: 5
                        }
                    ]
                },
                resistance: {
                    smashing: 0.09375,
                    lethal: 0.09375,
                    energy: 0.075
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Kinetic Shield",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Kinetic Shield creates a harmonic Energy Aura that can deflect physical attacks. Your Defense to Smashing and Lethal attacks is increased as weapons and powers like bullets, blades and punches tend to deflect off the shield. Kinetic Shield also grants you good resistance to Defense Debuffs. The Energy based nature of Kinetic Shield also offers some minimal Defense to Energy attacks. Kinetic Shield also adds an Elusivity defense bonus to Smashing, Lethal, and Energy Attacks in PVP zones.",
            shortHelp: "Toggle: Self +DEF(Smashing, Lethal, Energy), Res(DeBuff DEF)",
            icon: "energyaura_kineticshield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 0.73,
                debuffResistance: {
                    defense: 0.173
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Power Shield",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "This Power Shield creates a Electro-Magnetic shield around you that can deflect non-physical attacks. Your Defense to Fire, Cold, Energy and Negative Energy attacks is increased as these attacks are reflected or refracted off the shield. Power Shield also grants you good resistance to Defense Debuffs. Power Shield also adds Psionic Defense and an Elusivity defense bonus to Fire, Cold, Energy and Psionic Attacks in PVP zones.",
            shortHelp: "Toggle: Self +DEF(Fire, Cold, Energy, Negative), Res(DeBuff DEF)",
            icon: "energyaura_powershield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 1.67,
                debuffResistance: {
                    defense: 0.173
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Entropic Aura",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Entropic Aura diminishes and dampens the energy of controlling type effects. The shield makes you resistant to Knockback, Repel, Disorient, Hold, Sleep, Immobilization, and enemy Teleportation for as long as you can keep this toggle power active. Entropic Aura also grants you good resistance to Defense Debuffs as well as providing you a recharge bonus for each foe in melee, up to the first 10 foes. Foes that get close to the user will have their own recharge rate reduced and may be taunted.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +Res(Knockback, Repel, Disorient, Hold, Sleep, Immobilize, Teleport, DeBuff DEF), Self +Recharge, Foe -Recharge",
            icon: "energyaura_entropy.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.52,
                cast: 0.73,
                buffDuration: 2.0
            }
        },
        {
            name: "Energy Protection",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "Your ability to channel energy makes you naturally resistant to Energy, Negative Energy, Psionic and Toxic damage. Additionally, this power grants some resistance to both recharge and movement slowing effects. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Res (Energy, Negative, Toxic, Psionic, Slow)",
            icon: "energyaura_protection.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                dotDamage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.25,
                            ticks: 5
                        },
                        {
                            type: "Negative",
                            scale: 1.25,
                            ticks: 5
                        },
                        {
                            type: "Psionic",
                            scale: 1.25,
                            ticks: 5
                        },
                        {
                            type: "Toxic",
                            scale: 1.25,
                            ticks: 5
                        }
                    ]
                },
                resistance: {
                    energy: 0.09375,
                    negative: 0.09375,
                    psionic: 0.09375,
                    toxic: 0.09375
                },
                debuffResistance: {
                    recharge: 0.2,
                    movement: 0.2
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Energy Cloak",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "The Energy Cloak bends light around you so you become partially invisible. While Cloaked you can only be seen at very close range. If you attack while Cloaked, you will be discovered. Even if discovered, you still maintain a Defense bonus to all attacks.",
            shortHelp: "Toggle: Self Stealth, +DEF",
            icon: "energyaura_cloak.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.73,
                buffDuration: 0.75
            }
        },
        {
            name: "Energy Drain",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Threat Duration"],
            description: "Energy Drain leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance and Defense. If there are no foes within range, you will not gain any Endurance or Defense.",
            shortHelp: "PBAoE, Self +End, +Def, Foe -End",
            icon: "energyaura_drain.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 13.0,
                cast: 2.37
            }
        },
        {
            name: "Energize",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can channel a tremendous amount of energy through your body for a short period of time. Doing so will heal some hit points, reduce the endurance cost of your powers and boost your regeneration for a short time.",
            shortHelp: "Self Endurance Discount, Heal, +Regen",
            icon: "energyaura_energize.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 120.0,
                endurance: 10.4,
                cast: 1.17,
                healing: {
                    scale: 374.81375,
                    perTarget: true
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Overload",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Healing"],
            description: "You can Overload your Energy Aura and dramatically improve your defense to all attack types. Overload also grants you high resistance to Defense Debuffs. This Energy Aura is so powerful, that it can even absorb some damage, effectively increasing your Max Hit Points. However, when Overload wears off, you are left drained of all Endurance and unable to recover Endurance for a while. Overload also adds a moderate Elusivity defense bonus to all attacks in PVP zones.",
            shortHelp: "Self +DEF(All), +Recovery, +Max HP, Res(DeBuff DEF), +Special",
            icon: "energyaura_overload.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 1000.0,
                endurance: 2.6,
                cast: 3.0,
                debuffResistance: {
                    defense: 0.346
                },
                buffDuration: 180.0,
                defenseBuff: 1.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/energy-aura'] = BRUTE_ENERGY_AURA_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_ENERGY_AURA_POWERSET = BRUTE_ENERGY_AURA_POWERSET;
}