/**
 * Brawling
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_BRAWLING_POWERSET = {
    name: "Brawling",
    category: "Unknown",
    description: "Brawling powerset",
    icon: "brawling_set.png",
    powers: [
        {
            name: "Heavy Blow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You strike your foe with a powerful punch dealing Moderate Smashing damage. Heavy Blow has a fair chance to knock the target off its feet. Heavy Blow is a Combo Builder and adds 1 Combo Level.",
            shortHelp: "Melee, DMG(Smash), Foe Knockdown, Combo Builder",
            icon: "brawling_heavyblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 1.07
            }
        },
        {
            name: "Initial Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "You deliver a pair of lightning fast blows to your opponent in an effort to throw them off balance. Initial Strike deals Light Smashing damage and has a small chance to disorient your target. Initial Strike is a Combo Builder and adds 1 Combo Level.",
            shortHelp: "Melee, DMG(Smash), Foe Disorient, Combo Builder",
            icon: "brawling_initialstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.8
            }
        },
        {
            name: "Sweeping Cross",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee AoE Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "You execute a sweeping right hook that can strike multiple targets in your frontal arc. Sweeping Cross deals High Smashing damage and can disorient foes. Sweeping Cross is a Finisher and resets your current Combo Level to 0. It will deal additional damage and will have a greater chance to disorient dependent upon the current Combo Level. At Combo Level 3, Sweeping Cross will also have a chance to knock down the affected targets.",
            shortHelp: "Melee (Cone), DMG(Smash), Foe Disorient, Finisher",
            icon: "brawling_sweepingcross.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.309,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67
            }
        },
        {
            name: "Combat Readiness",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Activating this power will increase your chance to hit and the amount of damage you deal for a short amount of time as well as setting your current Combo Level to 3.",
            shortHelp: "Self, +DMG, +To Hit, Special",
            icon: "brawling_combatreadiness.png",
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
            name: "Rib Cracker",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You deftly strike your foe in a very vulnerable location. Rib Cracker deals Moderate Damage but reduces your foe's Damage and Resistance moderately for a short time. Rib Cracker is a Combo Builder and adds 1 Combo Level.",
            shortHelp: "Melee, DMG(Smash), Foe -Res (All), -Dmg, Combo Builder",
            icon: "brawling_throatstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.33,
                damage: {
                    type: "Smashing",
                    scale: 1.571
                },
                buffDuration: 5.0
            }
        },
        {
            name: "Taunt",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To-Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "brawling_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.67,
                buffDuration: 12.0
            }
        },
        {
            name: "Spinning Strike",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Ranged AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You execute a spinning attack that first strikes with your fist and finally your heel hitting your foe and all enemies immediately nearby. Spinning Strike deals Heavy Smashing damage and has a high chance to knockdown foes. Spinning Strike is a Finisher and sets your Combo Level to 0. It will deal additional damage and will have a greater chance to knockdown dependent upon the current Combo Level. At Combo Level 3, Spinning Strike also has a moderate chance to briefly inflict Terrorize in nearby foes.",
            shortHelp: "Melee (Targeted AoE), DMG(Smash), Foe Knockdown, Finisher",
            icon: "brawling_spinningstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.8
            }
        },
        {
            name: "Shin Breaker",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Defense Debuff", "Melee Damage", "Slow Movement", "Threat Duration", "Universal Damage Sets"],
            description: "You execute a quick but powerful kick targeting your foe's leg in an attempt to cripple their movement. Shin Breaker deals Superior Smashing damage and moderately reduces your target's movement speed and defense for a short time. Shin Breaker is a Combo Builder and adds 1 Combo Level.",
            shortHelp: "Melee, DMG(Smashing), Foe -Speed, -Defense, Combo Builder",
            icon: "brawling_lowkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.33,
                damage: {
                    type: "Smashing",
                    scale: 1.651
                },
                buffDuration: 8.0,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Crushing Uppercut",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Holds", "Knockback", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a jaw breaking Crushing Uppercut on your target inflicting Extreme Smashing damage and knocking them into the air. Crushing Uppercut will leave the target disoriented for a short time. Crushing Uppercut is a Finisher and will set your Combo Level to 0. It will deal additional damage and have a longer disorient duration dependent upon the current Combo Level. At Combo Level 3, Crushing Uppercut will have its disorient effect upgraded to a Hold effect.",
            shortHelp: "Melee, DMG(Smash), Foe Knock Up, Disorient, Finisher",
            icon: "brawling_crushinguppercut.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 13.0,
                recharge: 25.0,
                endurance: 14.352,
                cast: 2.17
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/brawling'] = BRUTE_BRAWLING_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_BRAWLING_POWERSET = BRUTE_BRAWLING_POWERSET;
}