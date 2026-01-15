/**
 * Earth Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_EARTH_ASSAULT_POWERSET = {
    name: "Earth Assault",
    category: "Unknown",
    description: "Earth Assault powerset",
    icon: "earth-assault_set.png",
    powers: [
        {
            name: "Stone Mallet",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "Your control over the earth allows you to form a mallet of solid stone. This Stone Mallet deals heavy damage, and can knock down weak foes.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, Moderate DMG(Smash), Knockback",
            icon: "earthassault_stonemallet.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.6,
                damage: {
                    type: "Smashing",
                    scale: 3.48
                }
            }
        },
        {
            name: "Stone Spears",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "Stone Spears erupt from the ground at the feet of your target. This attack can only be used against targets on the ground, and does moderate lethal damage.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Lethal), Foe Knock Up",
            icon: "earthassault_stonespears.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 2.2601
                }
            }
        },
        {
            name: "Tremor",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can cause a localized earthquake immediately around you. This will deal moderate damage to every foe in melee range, while knocking them back.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Light DMG(Smash), Knockback",
            icon: "earthassault_tremor.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 18.0,
                endurance: 16.848,
                cast: 2.53,
                damage: {
                    type: "Smashing",
                    scale: 1.9881
                }
            }
        },
        {
            name: "Hurl Boulder",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You are able to tear up a chunk of ground beneath your feet and Hurl it at an enemy. This attack deals moderate damage, and can knock foes back and even drop them out of the air if they are flying.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, High DMG(Smash), Foe Knockback, -Fly",
            icon: "earthassault_hurlboulder.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.5,
                damage: {
                    type: "Smashing",
                    scale: 4.2101
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Power Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Boosts the damage and secondary effects of your powers. Your powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes and more, are all improved. The effects of Power Up last a short while, and only the next couple of attacks will be boosted.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +Special, +Dmg(All)",
            icon: "earthassault_powerboost.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 7.8,
                cast: 1.17,
                buffDuration: 10.0,
                stun: 1.0,
                stunDuration: 10.0,
                tohitBuff: 0.5,
                defenseBuff: 0.5
            }
        },
        {
            name: "Heavy Mallet",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "A more impressive form of Stone Mallet, the Heavy Mallet deals more damage, but is slower to swing. It has a greater chance of knocking down opponents.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Superior DMG(Smash), Knockback",
            icon: "earthassault_heavymallet.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 1.63,
                damage: {
                    type: "Smashing",
                    scale: 4.901
                }
            }
        },
        {
            name: "Seismic Smash",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Melee Damage", "Universal Damage Sets"],
            description: "This massive attack hits with all the force of the Earth itself. It deals tremendous amounts of damage, and may Hold the target if they are not defeated outright.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Smash), Foe Hold",
            icon: "earthassault_seismicsmash.png",
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
                    scale: 5.8100000000000005
                }
            }
        },
        {
            name: "Mud Pots",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "While this power is active, you draw upon the geothermal power of the Earth to create a bubbling pool of hot mud around yourself. All foes in melee range will become snared and entrapped in the mud, Immobilizing some and slowing others. The boiling heat from Mud Pots may also deal some damage over time to the snared foes.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: PBAoE, Minor DoT(Fire), Foe Immobilize, -SPD",
            icon: "earthassault_mudpots.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 1.04,
                cast: 2.03,
                damage: {
                    type: "Fire",
                    scale: 0.13
                },
                buffDuration: 5.0
            }
        },
        {
            name: "Fissure",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Knockback", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "This powerful stomp can crack the earth itself, damaging a nearby targeted foe and any foes around it. This Fissure can only affect foes on the ground, dealing moderate smashing damage and possibly throwing them into the air or disorienting them.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Close (Targeted AoE), Light DMG(Smash), Foe Knockback, Disorient",
            icon: "earthassault_fissure.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 20.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.1,
                damage: {
                    type: "Smashing",
                    scale: 2.0305999999999997
                },
                stun: 1.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/earth-assault'] = DOMINATOR_EARTH_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_EARTH_ASSAULT_POWERSET = DOMINATOR_EARTH_ASSAULT_POWERSET;
}