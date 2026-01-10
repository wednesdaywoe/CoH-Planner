/**
 * Electric Armor
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_ELECTRIC_ARMOR_POWERSET = {
    name: "Electric Armor",
    category: "Unknown",
    description: "Electric Armor powerset",
    icon: "electric-armor_set.png",
    powers: [
        {
            name: "Charged Armor",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "When you toggle on this power, you are surrounded in a charged field that makes you highly resistant to Smashing, Lethal and Energy damage.",
            shortHelp: "Toggle: Self +Res(Smash, Lethal, Energy)",
            icon: "electricarmor_selfbuffdefensephysical.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.67,
                resistance: {
                    smashing: 0.2625,
                    lethal: 0.2625,
                    energy: 0.2625
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Hide",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Hide makes you almost impossible to detect. When properly 'Hidden\", a Stalker can pull off Critical hits with his attacks, and even land a massive 'Assassin's Strike' with an Assassin's power. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense. Unlike most stealth powers, Hide can be used at the same time as other Concealment powers, giving you even greater stealth capability. No Endurance cost.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
            icon: "electricarmor_hide.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                cast: 0.73,
                buffDuration: 0.75
            }
        },
        {
            name: "Conductive Shield",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "When you toggle on this power, you are surrounded in a Conductive Shield that will conduct many sorts of energy away from your body. Conductive Shield grants high resistant to Fire, Cold, and Energy damage, as well as good resistance to Negative Energy damage.",
            shortHelp: "Toggle: Self +Res(Fire, Cold, Energy, Negative)",
            icon: "electricarmor_selfresistelements.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.67,
                resistance: {
                    fire: 0.2625,
                    cold: 0.2625,
                    energy: 0.2625,
                    negative: 0.15
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Static Shield",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You can create a field of Static Electricity around your body. This Static Shield protects you from Hold, Sleep, and Disorient effects as well as Endurance Drain, Recovery DeBuffs and enemy Teleportation. Static Shield can also help normalize your synaptic activity, granting you good resistance to Psionic Damage.",
            shortHelp: "Toggle: Self +Res(Hold, Sleep, Disorient, End Drain, Recovery DeBuff, Psionic, Toxic, Teleport)",
            icon: "electricarmor_selfresistmez.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 1.17
            }
        },
        {
            name: "Grounded",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "You are Grounded and naturally very resistant to Energy and Negative Energy damage. You also have added resistance to Endurance Drain effects. Additionally, Grounded provides Immobilize, Knockback protection and the Grounded status, but only for up to 10 seconds after being near the ground. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Res (All DMG but Toxic and Psionics, End Drain, Immobilize, KB)",
            icon: "electricarmor_selfresistenergies.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0
            }
        },
        {
            name: "Lightning Reflexes",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "Your Lightning Reflexes allow you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
            shortHelp: "Auto: Self +Recharge, +SPD, Res (Slow)",
            icon: "electricarmor_selfbuffrunspeed.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    recharge: 0.4,
                    movement: 0.4
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Energize",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can channel a tremendous amount of electricity through your body for a short period of time. Doing so will heal some hit points, reduce the endurance cost of your powers and boost your regeneration for a short time.",
            shortHelp: "Self Endurance Discount, Heal, +Regen",
            icon: "electricarmor_energize.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 120.0,
                endurance: 10.4,
                cast: 1.17,
                healing: {
                    scale: 301.18975,
                    perTarget: true
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Power Sink",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "Power Sink leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance and regeneration rate. If there are no foes within range, you will not gain any Endurance.",
            shortHelp: "PBAoE, Self +End, +Regen, Foe -End",
            icon: "electricarmor_pbaoeregendrain.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 60.0,
                endurance: 13.0,
                cast: 2.03
            }
        },
        {
            name: "Power Surge",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Holds", "Resist Damage"],
            description: "When you activate this power, you transform your body into living Electricity and become extremely resistant to all damage but Psionics, as well as Disorient, Sleep, Hold, Immobilize, Knockback, End Drain, Recovery DeBuff, and enemy Teleportation. Your Regeneration rate and Endurance recovery are also increased. As Power Surge wears off, the charge in your body explodes in a massive EMP pulse.",
            shortHelp: "Self +Res(All DMG, but Psionics), +Res(Knockback, Repel, Disorient, Hold, Immobilize, Sleep), +Regen, +Recovery, +Special",
            icon: "electricarmor_selfbuffdefense.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 350.0,
                endurance: 2.6,
                cast: 1.96
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/electric-armor'] = STALKER_ELECTRIC_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_ELECTRIC_ARMOR_POWERSET = STALKER_ELECTRIC_ARMOR_POWERSET;
}