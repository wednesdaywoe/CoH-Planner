/**
 * Brawling
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_BRAWLING_POWERSET = {
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
            allowedSetCategories: ["Knockback", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You strike your foe with a powerful punch dealing Moderate Smashing damage. Heavy Blow has a fair chance to knock the target off its feet. Heavy Blow is a Combo Builder and adds 1 Combo Level.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Melee, Moderate DMG(Smash), Foe Knockdown, Combo Builder",
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
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You deliver a pair of lightning fast blows to your opponent in an effort to throw them off balance. Initial Strike deals Light Smashing damage and has a small chance to disorient your target. Initial Strike is a Combo Builder and adds 1 Combo Level.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Melee, Light DMG(Smash), Foe Disorient, Combo Builder",
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
            allowedSetCategories: ["Melee AoE Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You execute a sweeping right hook that can strike multiple targets in your frontal arc. Sweeping Cross deals High Smashing damage and can disorient foes. Sweeping Cross is a Finisher and sets your current Combo Level to 0. It will deal additional damage and have a greater chance to disorient dependent upon the current Combo Level. At Combo Level 3, Sweeping Cross will also have a chance to knock down the affected targets. Critical damage is unaffected by your Combo Level.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee (Cone), High DMG(Smash), Foe Disorient, Finisher",
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
            name: "Assassin's Strike",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Assassin's Strike builds 2 Combo Levels. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Smash), Combo Builder",
            icon: "brawling_assassinsstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.17
            }
        },
        {
            name: "Build Up",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit",
            icon: "brawling_combatreadiness.png",
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
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Blow. However, if you attack a Placated Foe, he will be able to attack you back.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "brawling_placate.png",
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
            name: "Spinning Strike",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You execute a spinning attack that first strikes with your fist and finally your heel hitting your foe and all enemies immediately nearby. Spinning Strike deals Heavy Smashing damage and has a high chance to knockdown foes. Spinning Strike is a Finisher and sets your current Combo Level to 0. It will deal additional damage and have a greater chance to knockdown dependent upon the current Combo Level. At Combo Level 3, Spinning Strike also has a moderate chance to briefly inflict Terrorize in nearby foes. Critical damage is unaffected by your Combo Level.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee (Targeted AoE), High DMG(Smash), Foe Knockdown, Finisher",
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
            allowedSetCategories: ["Defense Debuff", "Melee Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You execute a quick but powerful kick targeting your foe's leg in an attempt to cripple their movement. Shin Breaker deals Superior Smashing damage and moderately reduces your target's movement speed and defense for a short time. Shin Breaker is a Combo Builder and adds 1 Combo Level.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, Superior DMG(Smash), Foe -Speed, -Defense, Combo Builder",
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
            allowedSetCategories: ["Holds", "Knockback", "Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You perform a jaw breaking Crushing Uppercut on your target inflicting Extreme Smashing damage and knocking them into the air. Crushing Uppercut will leave the target disoriented for a short time. Crushing Uppercut is a Finisher and will set your Combo Level to 0. It will deal additional damage and have a longer disorient duration dependent upon the current Combo level. At Combo Level 3, Crushing Uppercut will have its disorient effect upgraded to a Hold effect. Critical damage is unaffected by your Combo Level.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Smash), Foe Knock Up, Disorient, Finisher",
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
    POWERSETS['stalker/brawling'] = STALKER_BRAWLING_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_BRAWLING_POWERSET = STALKER_BRAWLING_POWERSET;
}