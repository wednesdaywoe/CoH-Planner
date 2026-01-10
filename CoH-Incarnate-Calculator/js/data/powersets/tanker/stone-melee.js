/**
 * Stone Melee
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_STONE_MELEE_POWERSET = {
    name: "Stone Melee",
    category: "Unknown",
    description: "Stone Melee powerset",
    icon: "stone-melee_set.png",
    powers: [
        {
            name: "Stone Fist",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "Your stone covered fists attack swiftly for moderate damage, and may Disorient your opponent.",
            shortHelp: "Melee DMG(Smash), Foe Minor Disorient,",
            icon: "stonemelee_stonefist.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 0.83,
                damage: {
                    type: "Smashing",
                    scale: 2.141
                }
            }
        },
        {
            name: "Stone Mallet",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "Your control over the earth allows you to form a mallet of solid stone. This Stone Mallet deals heavy damage, and can knock down weak foes.",
            shortHelp: "Melee, DMG(Smash), Knockback",
            icon: "stonemelee_stonemallet.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.61,
                damage: {
                    type: "Smashing",
                    scale: 3.4869
                }
            }
        },
        {
            name: "Heavy Mallet",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "A more impressive form of Stone Mallet, the Heavy Mallet deals more damage, but is slower to swing. It has a greater chance of knocking down opponents.",
            shortHelp: "Melee, DMG(Smash), Knockback",
            icon: "stonemelee_heavymallet.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.63,
                damage: {
                    type: "Smashing",
                    scale: 4.3009
                }
            }
        },
        {
            name: "Taunt",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunts a foe, and some nearby foes, to attack you. Useful for pulling villains off an ally who find themselves in over their head. Taunted foes tend to ignore other Heroes and focus on you for quite a while, so use this power cautiously. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "stonemelee_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.67,
                buffDuration: 20.0
            }
        },
        {
            name: "Build Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "stonemelee_buildup.png",
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
            name: "Fault",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "This powerful stomp can cause a seismic disturbance. This will crack the Earth itself and send a Fault towards a targeted foe, throwing him and nearby enemies into the air and possibly Disorienting them. Fault has a chance of dealing damage to foes in between you and your target.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power's disorient effect can hit up to <color #FF7F27>6</color> targets above its 10 target cap at 1/3rd effectiveness.</color>",
            shortHelp: "Close (Targeted AoE), DMG(Smashing), Foe Knockback, Disorient",
            icon: "stonemelee_fault.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 0.8,
                range: 20.0,
                recharge: 20.0,
                endurance: 10.192,
                cast: 2.1
            }
        },
        {
            name: "Tremor",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You can cause a localized earthquake immediately around you. This will deal moderate damage to every foe in melee range, while knocking them back.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "PBAoE, DMG(Smash), Knockback",
            icon: "stonemelee_tremor.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.53,
                damage: {
                    type: "Smashing",
                    scale: 2.1324
                }
            }
        },
        {
            name: "Hurl Boulder",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You are able to tear up a chunk of ground beneath your feet and Hurl it at an enemy. This attack deals high damage, and can knock foes back and even drop them out of the air if they are flying.",
            shortHelp: "Ranged, DMG(Smash), Foe Knockback, -Fly",
            icon: "stonemelee_hurlboulder.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 9.36,
                cast: 2.5,
                damage: {
                    type: "Smashing",
                    scale: 3.6159
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Seismic Smash",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Holds", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "This massive attack hits with all the force of the Earth itself. It deals tremendous amounts of damage, and may Hold the target if they are not defeated outright.",
            shortHelp: "Melee, DMG(Smash), Foe Hold",
            icon: "stonemelee_seismicsmash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.5,
                damage: {
                    type: "Smashing",
                    scale: 5.8099
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/stone-melee'] = TANKER_STONE_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_STONE_MELEE_POWERSET = TANKER_STONE_MELEE_POWERSET;
}