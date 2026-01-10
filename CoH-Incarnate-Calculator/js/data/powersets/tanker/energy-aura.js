/**
 * Energy Aura
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_ENERGY_AURA_POWERSET = {
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
                    smashing: 0.125,
                    lethal: 0.125,
                    energy: 0.1
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
                    defense: 0.21625
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Power Shield",
            available: 1,
            tier: 1,
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
                    defense: 0.21625
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Entropic Aura",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Entropic Aura diminishes and dampens the energy of controlling type effects. The shield makes you resistant to Knockback, Repel, Disorient, Hold, Sleep, Immobilization, and enemy Teleportation for as long as you can keep this toggle power active. Entropic Aura also grants you good resistance to Defense Debuffs as well as providing you a recharge bonus for each foe in melee, up to the first 10 foes. Foes that get close to the user will have their own recharge rate reduced.",
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
            available: 7,
            tier: 3,
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
                    energy: 0.125,
                    negative: 0.125,
                    psionic: 0.125,
                    toxic: 0.125
                },
                debuffResistance: {
                    recharge: 0.2,
                    movement: 0.2
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Power Armor",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "Power Armor increases Hit Points and resistance to all damage types. This power is always on and costs no endurance.",
            shortHelp: "Auto: Self +MaxHP, +Resist(All DMG)",
            icon: "energyaura_powerarmor.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                resistance: {
                    smashing: 0.07500000000000001,
                    lethal: 0.07500000000000001,
                    fire: 0.07500000000000001,
                    cold: 0.07500000000000001,
                    energy: 0.07500000000000001,
                    negative: 0.07500000000000001,
                    psionic: 0.07500000000000001,
                    toxic: 0.07500000000000001
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Energize",
            available: 17,
            tier: 4,
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
                    scale: 468.51725,
                    perTarget: true
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Energy Drain",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification"],
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
            name: "Overload",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Healing"],
            description: "You can Overcharge your Energy Aura and significantly improve your defense to all attack types. Overcharge also grants you Defense Debuffs. This Energy Aura is so powerful, that it can even absorb some damage, effectively increasing your Max Hit Points. Overcharge also adds a moderate Elusivity defense bonus to all attacks in PVP zones.",
            shortHelp: "Self +DEF(All), +Recovery, +MaxHP, Res(DeBuff DEF)",
            icon: "energyaura_overload.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 300.0,
                endurance: 10.5,
                cast: 3.0,
                debuffResistance: {
                    defense: 0.4325
                },
                buffDuration: 30.0,
                defenseBuff: 1.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/energy-aura'] = TANKER_ENERGY_AURA_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_ENERGY_AURA_POWERSET = TANKER_ENERGY_AURA_POWERSET;
}