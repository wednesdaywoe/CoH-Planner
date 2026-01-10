/**
 * Radiation Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_RADIATION_MANIPULATION_POWERSET = {
    name: "Radiation Manipulation",
    category: "Unknown",
    description: "Radiation Manipulation powerset",
    icon: "radiation-manipulation_set.png",
    powers: [
        {
            name: "Electron Shackles",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizes a single target and deals some energy damage over time. Some more resilient foes may require multiple attacks to Immobilize. Electron Shackles can also reduce a target's Defense and will surround it in negatively charged particles. Hitting a foe that has positive charged particles will trigger a Gamma Burst.",
            shortHelp: "Ranged, DoT(Energy), Foe Immobilize, -DEF, +Negatrons",
            icon: "atomicmanipulation_immob.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.17
            }
        },
        {
            name: "Negatron Slam",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "You channel a greater amount of radiation into your fists and deliver a hard-hitting blow that deals Energy and Smashing damage to the target as well as reduce their Defense for a short time. The affected target will also be surrounded in negatively charged particles. Hitting a foe that has positive charged particles will trigger a Gamma Burst.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Knockdown, -DEF, Special, +Negatrons",
            icon: "atomicmanipulation_weakpunch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.5
            }
        },
        {
            name: "Positron Cell",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Encases a single target in a cage made of positrons. The radiation emitted slowly hurts the victim, inflicting energy damage over time. The encased victim is held helpless and unable to defend themselves in addition to being surrounded by positively charged particles. Hitting a foe that has negatively charged particles will trigger a Gamma Burst.",
            shortHelp: "Ranged, DoT(Energy), Foe Hold, -DEF, +Positrons",
            icon: "atomicmanipulation_hold.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 16.0,
                endurance: 11.388,
                cast: 1.67
            }
        },
        {
            name: "Ionize",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +ToHit",
            icon: "atomicmanipulation_buildup.png",
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
            name: "Beta Decay",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Debuff", "To Hit Debuff"],
            description: "While Beta Decay is active, nearby foes will have their chance to hit and defense decreased slightly. You will gain a recharge bonus per nearby target up to 10 targets. The first target grants the largest benefit.",
            shortHelp: "Toggle: PBAoE, Foe -ToHit, -DEF, Self +Recharge(Special)",
            icon: "atomicmanipulation_decay.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.208,
                cast: 0.67,
                tohitDebuff: 0.75,
                buffDuration: 1.25,
                defenseDebuff: 1.5
            }
        },
        {
            name: "Metabolic Acceleration",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You cloak yourself in a field of radiation that increases your attack speed, Endurance recovery and Regeneration rate. However, only half of this regeneration bonus is enhanceable. Your metabolism is increased so much that you become resistant to effects such as Sleep, Hold, Disorient, Immobilization and Endurance Drain.",
            shortHelp: "Toggle: Self +Recharge, +Regeneration, +Recovery, +Resist(Hold, Immobilize, Disorient, Sleep, End Drain)",
            icon: "atomicmanipulation_metabolism.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 0.73,
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.75
            }
        },
        {
            name: "Atom Smasher",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "You charge up a dangerously unstable amount of radioactive energy into a single fist before driving it into the ground and causing a small explosion. Foes caught in the blast will suffer Energy and Toxic damage and have their defense reduced.",
            shortHelp: "PBAoE, DMG(Toxic/Energy), Foe Disorient, -DEF, Special",
            icon: "atomicmanipulation_atomsmasher.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 22.0,
                endurance: 20.176,
                cast: 2.93
            }
        },
        {
            name: "Radioactive Cloud",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Holds"],
            description: "When activated, you generate toxic radioactive gas around yourself. Any nearby foes may be overcome by the gas, leaving them choking or barfing helplessly. Choking foes might temporarily snap out of it when hit, barfing foes are more likely to be too sick to counterattack.",
            shortHelp: "PBAoE, Foe Hold, Immobilize",
            icon: "atomicmanipulation_holdpbaoe.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                recharge: 90.0,
                endurance: 20.18,
                cast: 1.07
            }
        },
        {
            name: "Positronic Fist",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "You hammer your foe with a brutal smashing attack charged with a lethal dose of radiation. Your target will suffer Energy and Smashing damage, will have its defense reduced and will be disoriented for a short time in addition to being surrounded by positively charged particles. Hitting a foe that has negatively charged particles will trigger a Gamma Burst.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Disorient, -DEF, +Positrons",
            icon: "atomicmanipulation_heavypunch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.67
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/radiation-manipulation'] = BLASTER_RADIATION_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_RADIATION_MANIPULATION_POWERSET = BLASTER_RADIATION_MANIPULATION_POWERSET;
}