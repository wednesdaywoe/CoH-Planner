/**
 * Pyrotechnic Control
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_PYROTECHNIC_CONTROL_POWERSET = {
    name: "Pyrotechnic Control",
    category: "Unknown",
    description: "Pyrotechnic Control powerset",
    icon: "pyrotechnic-control_set.png",
    powers: [
        {
            name: "Dazzle",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Incapacitates a distant foe with a brilliant explosion of pyrotechnic energy. The target is left helpless for the duration.<br><br>This power has a chance of Blasting Off targets into the air.",
            shortHelp: "Ranged, Moderate DMG (Fire, Energy), Foe Hold, Chance for Blast Off",
            icon: "pyrotechnic_dazzle.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.07,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 1.6268000000000002
                        },
                        {
                            type: "Energy",
                            scale: 1.6268000000000002
                        }
                    ],
                    scale: 3.2536000000000005
                }
            }
        },
        {
            name: "Sparkling Cage",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizes your target in a ring of pyrotechnic energy, dealing Fire and Energy damage over time. More resilient foes may require multiple Sparkling Cages to Immobilize.<br><br>This power has a chance of Blasting Off targets into the air.",
            shortHelp: "Ranged, Moderate DoT(Fire, Energy), Foe Immobilize, Chance for Blast Off",
            icon: "pyrotechnic_sparklingcage.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 0.358,
                            ticks: 4
                        },
                        {
                            type: "Energy",
                            scale: 0.358,
                            ticks: 4
                        }
                    ]
                },
                buffDuration: 9.2
            }
        },
        {
            name: "Sparkling Chain",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Immobilizes a group of foes one by one in a chain formation, dealing Fire and Energy damage over time to each enemy in the chain. More resilient foes may require multiple casts to Immobilize. Sparkling Chain is slower and less damaging than Sparkling Cage, but can capture multiple targets.<br><br>This power has a chance of Blasting Off targets into the air. This chance is greater on the initial target of Sparkling Chain.",
            shortHelp: "Ranged Chain AoE, Minor DoT(Fire, Energy), Foe Immobilize, Chance for Blast Off",
            icon: "pyrotechnic_sparklingfield.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Chain",
            maxTargets: 16,
            effects: {
                accuracy: 0.9,
                range: 80.0,
                recharge: 8.0,
                endurance: 13.0,
                cast: 1.03,
                buffDuration: 1.1
            }
        },
        {
            name: "Glittering Column",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged AoE Damage", "Threat Duration", "To Hit Debuff", "Universal Damage Sets"],
            description: "You summon a column of brilliant, glittering energy that is sure to capture foes' attention. The column will reduce the ToHit of any foe within a short range, while also Taunting them, forcing them to direct their attacks in its direction. <br><br>When the Glittering Column expires, it explodes, Blasting Off nearby enemies into the air.",
            shortHelp: "Summon Glittering Column: Taunt, -ToHit, AoE DMG (Fire, Energy), Blast Off",
            icon: "pyrotechnic_glitteringcolumn.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 40.0,
                endurance: 7.8,
                cast: 1.17,
                buffDuration: 7.0
            }
        },
        {
            name: "Hypnotizing Lights",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Confuse", "Controller Archetype Sets", "Ranged AoE Damage", "Sleep", "Universal Damage Sets"],
            description: "You conjure a whirl of lights with differing effects depending on the distance from which it is viewed. Most all targets within the area will be placed into a sleep like trance. <br><br>Up to five enemies within 20 feet of the display are Confused and receive Psionic damage over time.<br><br><color #fcfc95>Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If the Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.</color>",
            shortHelp: "Ranged (Cone), Foe Sleep, Foe Confuse (Within 20ft), Moderate DoT (Psionic), Foe Deep Sleep",
            icon: "pyrotechnic_hypnotizinglights.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 45.0,
                endurance: 8.582,
                cast: 1.67
            }
        },
        {
            name: "Brilliant Barrage",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Fear", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "With a single gesture, you conjure pyrotechnic missiles to assault two locations at once. First, select a target for the first missile and then a location for the second. <br><br>Enemies near the target you have selected will be bombarded with miniature missiles and Stunned. Meanwhile, enemies near the location you have selected on the ground will be hit by a shrill noisemaking rocket and become Terrified.",
            shortHelp: "Ranged (AoE), Foe Stun, Foe Terrorize, Minor DMG (Fire, Energy)",
            icon: "pyrotechnic_multipurposemissiles.png",
            powerType: "Click",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 8,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.67
            }
        },
        {
            name: "Incendiary Aura",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Debuff", "To Hit Debuff"],
            description: "You create an aura of pyrotechnic energy around yourself that has combustible properties. Enemies within range of the power have a persistent chance of Blasting Off into the air, as well as suffer from reduced ToHit and Defense.",
            shortHelp: "Toggle: PBAoE, Chance for Blast Off. -ToHit, -Defense",
            icon: "pyrotechnic_incendiaryaura.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 0.08,
                cast: 1.47,
                tohitDebuff: 1.25,
                buffDuration: 0.45,
                defenseDebuff: 0.75
            }
        },
        {
            name: "Explosive Bouquet",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds"],
            description: "You create an explosion of light and sound in a flower formation. Foes inside the blast radius will be Held and Blasted Off into the air.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>8</color> seconds and each affected foe will increase the recharge by <color #FF7F27>14.5</color> seconds for a maximum total of <color #FF7F27>240</color> seconds.</color>",
            shortHelp: "Ranged (AoE), Foe Hold, Blast Off",
            icon: "pyrotechnic_explosivebouquet.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.93
            }
        },
        {
            name: "Catherine Wheel",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "You can craft a wheel of pure pyrotechnic energy to assist you in battle. The Catherine Wheel employs a variety of pyrotechnic powers to damage and distract enemies. If an enemy becomes affected by the Blast Off effect from one of your powers, the Catherine Wheel may Intercept the enemy with an attack, dealing additional damage.",
            shortHelp: "Summon Catherine Wheel: Ranged DMG (Fire, Energy), Special",
            icon: "pyrotechnic_catherinewheel.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 240.0,
                endurance: 26.0,
                cast: 2.03
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/pyrotechnic-control'] = CONTROLLER_PYROTECHNIC_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_PYROTECHNIC_CONTROL_POWERSET = CONTROLLER_PYROTECHNIC_CONTROL_POWERSET;
}