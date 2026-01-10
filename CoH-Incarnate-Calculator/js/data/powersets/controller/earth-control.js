/**
 * Earth Control
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_EARTH_CONTROL_POWERSET = {
    name: "Earth Control",
    category: "Unknown",
    description: "Earth Control powerset",
    icon: "earth-control_set.png",
    powers: [
        {
            name: "Fossilize",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Encases a single target within solid stone. The stone slowly crushes the victim, dealing Smashing damage. The Fossilized victim is held helpless and unable to defend themselves. Damage, Moderate.",
            shortHelp: "Ranged, DMG(Smash), Foe Hold, -DEF",
            icon: "earthgrasp_fossilize.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.07,
                damage: {
                    type: "Smashing",
                    scale: 5.2536000000000005
                },
                defenseDebuff: 2.0,
                buffDuration: 12.0
            }
        },
        {
            name: "Stone Prison",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizes a single target within an earthy formation and deals some Smashing damage over time. Some more resilient foes may require multiple attacks to Immobilize. Stone Prison can also reduce a target's Defense.",
            shortHelp: "Ranged, DoT(Smash), Foe Immobilize, -DEF, -Fly",
            icon: "earthgrasp_stoneprison.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.23,
                dotDamage: {
                    type: "Smashing",
                    scale: 0.8263,
                    ticks: 4
                },
                buffDuration: 9.2,
                defenseDebuff: 2.0
            }
        },
        {
            name: "Stone Cages",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Immobilizes a group of foes within earthy formations and deals some Smashing damage over time. Slower and less damaging than Stone Prison, but can capture multiple targets. Stone Cages can also reduce a target's Defense.",
            shortHelp: "Ranged AoE, DMG(Smash), Foe Immobilize, -Fly, -DEF",
            icon: "earthgrasp_stonecages.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.9,
                range: 80.0,
                recharge: 8.0,
                endurance: 15.6,
                cast: 1.17,
                dotDamage: {
                    type: "Smashing",
                    scale: 0.3385,
                    ticks: 2
                },
                buffDuration: 5.2,
                defenseDebuff: 2.0
            }
        },
        {
            name: "Quicksand",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Slow Movement"],
            description: "You can cause the ground to liquefy like Quicksand at a targeted location. Any foes that pass through the Quicksand will become snared, their movement will be dramatically Slowed, and their Defense reduced. Foes trapped in the Quicksand cannot jump or Fly.",
            shortHelp: "Ranged (Location AoE), Foe -Speed, -Jump, -Fly, -DEF",
            icon: "earthgrasp_quicksand.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 90.0,
                recharge: 30.0,
                endurance: 7.8,
                cast: 3.1,
                buffDuration: 45.0
            }
        },
        {
            name: "Salt Crystals",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Sleep"],
            description: "Attempts to encrust all nearby foes in a Pillar of Salt. The victims will remain encased within the salt for quite a while, but will automatically break free if attacked. Affected targets have reduced defense for a while, even if they break free.<br><br><color #fcfc95>Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.</color>",
            shortHelp: "PBAoE, Foe Deep Sleep, -DEF",
            icon: "earthgrasp_saltpillars.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 45.0,
                endurance: 15.6,
                cast: 1.07,
                defenseDebuff: 2.0,
                buffDuration: 15.0
            }
        },
        {
            name: "Stalagmites",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "You can cause Stalagmites to erupt all around an enemy, damaging all nearby foes. The Stalagmites deal minimal Lethal damage, and can Disorient all affected targets for a good while, as well as reduce their Defense. You must be on the ground to activate this power.",
            shortHelp: "Ranged (Targeted AoE), DMG(Lethal), Foe Disorient, -DEF",
            icon: "earthgrasp_stalagmites.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                range: 70.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 0.5641
                },
                stun: 4.0,
                defenseDebuff: 2.0,
                buffDuration: 12.0
            }
        },
        {
            name: "Earthquake",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Debuff", "Knockback", "To Hit Debuff"],
            description: "Generates a powerful, localized Earthquake. Most foes that pass through the location will fall down. The violent shaking also reduces their chance to hit and Defense.",
            shortHelp: "Ranged (Location AoE), Foe Knockback, -To Hit, -Def",
            icon: "earthgrasp_earthquake.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 90.0,
                endurance: 10.4,
                cast: 2.03,
                buffDuration: 30.0
            }
        },
        {
            name: "Volcanic Gasses",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can tap into the geothermal power of the Earth and focus it at a targeted location. Foes that pass near a thermal vent will take minor Fire damage and be overcome by the gasses, leaving them choking and helpless.",
            shortHelp: "Ranged (Location AoE), Foe Hold, DoT(Fire), Special",
            icon: "earthgrasp_volcanicgasses.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.4,
                range: 60.0,
                recharge: 240.0,
                endurance: 18.2,
                cast: 1.17,
                buffDuration: 60.0
            }
        },
        {
            name: "Animate Stone",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Earth and stone coalesce to form an incredibly tough entity that can attack your foes. The Animated Stone is not alive and is immune to Psionic damage. It is also virtually immune to Sleep, Immobilize, Disorient, and Hold effects. The entity can be healed and buffed like any teammate. Type ''/release_pets'' in the chat window to release all your pets.",
            shortHelp: "Summon Golem: Melee DMG(Smashing)",
            icon: "earthgrasp_animatestone.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 240.0,
                endurance: 20.8,
                cast: 3.2
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/earth-control'] = CONTROLLER_EARTH_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_EARTH_CONTROL_POWERSET = CONTROLLER_EARTH_CONTROL_POWERSET;
}