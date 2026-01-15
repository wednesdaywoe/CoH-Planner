/**
 * Gravity Control
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_GRAVITY_CONTROL_POWERSET = {
    name: "Gravity Control",
    category: "Unknown",
    description: "Gravity Control powerset",
    icon: "gravity-control_set.png",
    powers: [
        {
            name: "Crush",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Creates a localized gravitational field strong enough to Immobilize a single foe. Crush can also bring down flying entities. This power deals Smashing damage over time and can Slow the movement of targets that escape its grasp.",
            shortHelp: "Ranged, DoT(Smash), Foe Immobilize, -Fly",
            icon: "gravitycontrol_crush.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.33,
                dotDamage: {
                    type: "Smashing",
                    scale: 0.8473,
                    ticks: 4
                },
                buffDuration: 9.2
            }
        },
        {
            name: "Lift",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "Negates the gravity around a single target. Lift violently sends an enemy straight into the air, then slams them to the ground for Smashing damage. This power can bring flying foes to the ground, and can deal bonus damage when used against targets under the effects of Gravity Distortion.",
            shortHelp: "Ranged, DMG(Smash)",
            icon: "gravitycontrol_lift.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.03,
                damage: {
                    type: "Smashing",
                    scale: 5.011500000000001
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Gravity Distortion",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Causes a single foe to be trapped in a misshapen gravity field, rendering him unable to take action. Gravity Distortion applies the Gravity Distortion effect and deals Smashing damage to the target.",
            shortHelp: "Ranged, DoT(Smash), Foe Hold, -Fly, +Gravity Distortion",
            icon: "gravitycontrol_gravitydistortion.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.83,
                dotDamage: {
                    type: "Smashing",
                    scale: 1.0403,
                    ticks: 4
                },
                buffDuration: 4.2
            }
        },
        {
            name: "Propel",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You can open a gravitational rift and retrieve a heavy object, then Propel it at your foes for Smashing Damage. This power can deal bonus damage when used against targets under the effects of Gravity Distortion. This attack's force is so strong that it can knockback additional nearby enemies.",
            shortHelp: "Ranged, DMG(Smash), Foe Knockback",
            icon: "gravitycontrol_propel.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 4,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 9.36,
                cast: 2.07,
                damage: {
                    type: "Smashing",
                    scale: 5.5635
                }
            }
        },
        {
            name: "Crushing Field",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Creates a large gravitational field strong enough to Immobilize multiple foes. Crushing Field can also bring down flying entities. Slower and less damaging than Crush, but can capture multiple targets. Crushing Field deals Smashing damage over time and can Slow the movement of targets that escape its grasp.",
            shortHelp: "Ranged (Targeted AoE), DoT(Smash), Foe Immobilize, -Fly",
            icon: "gravitycontrol_crushingfield.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.9,
                range: 80.0,
                recharge: 8.0,
                endurance: 15.6,
                cast: 1.33,
                dotDamage: {
                    type: "Smashing",
                    scale: 0.3486,
                    ticks: 2
                },
                buffDuration: 5.2
            }
        },
        {
            name: "Dimension Shift",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize"],
            description: "Location-targeted AoE toggle. This power folds space in an area, immobilizing and phasing all targets within the sphere. Enemies who enter the area become immobilized and phased for the duration of the effect. Allies who enter the sphere's area of effect will enter the phase as well, allowing them to combat phased enemies. Detoggling this power ends the effect, bringing the phased creatures back into the physical world. Maintaining this dimensional distortion is taxing on the user, and cannot be done for more than 20 seconds.<br>",
            shortHelp: "Toggle, Ranged (Location AoE), Foe Intangible",
            icon: "gravitycontrol_dimensionshift2.png",
            powerType: "Toggle",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 60.0,
                endurance: 15.6,
                cast: 1.17,
                buffDuration: 20.0
            }
        },
        {
            name: "Gravity Distortion Field",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds", "Slow Movement"],
            description: "Creates a large, intensely misshapen Gravity Distortion Field that encompasses several foes, rendering them unable to take any action. Enemies in the area of effect will be affected by the Gravity Distortion effect.",
            shortHelp: "Ranged (Targeted AoE), Foe Hold, Damage(Smashing), +Gravity Distortion",
            icon: "gravitycontrol_gravitydistortion.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 0.8,
                range: 80.0,
                recharge: 240.0,
                endurance: 15.6,
                cast: 1.83
            }
        },
        {
            name: "Wormhole",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Knockback", "Stuns", "Teleport", "Universal Travel"],
            description: "You can open a gravitational Wormhole behind a targeted foe and violently push them, and all nearby foes, through it. The victims are sent flying out the other end of the Wormhole and are left Disoriented. You determine the location of the Wormhole's end, and can place it high in the air if desired. More powerful foes may be resistant to the Wormhole effects.",
            shortHelp: "Ranged (Targeted AoE), Foe Teleport, Disorient, Knockback",
            icon: "gravitycontrol_wormhole.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 3.0,
                buffDuration: 1.5,
                stun: 4.0
            }
        },
        {
            name: "Singularity",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Knockback", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "You can create a very powerful Gravitational Singularity. The Singularity will engage your foes, assaulting them with various gravity powers. Any foes that attempt to approach the Singularity will be violently hurled away. The Singularity cannot be healed, but is highly resistant to all forms of damage and nearly impervious to Controlling type powers. Type ''/release_pets'' in the chat window to release all your pets.",
            shortHelp: "Summon Singularity: Ranged Control Special",
            icon: "gravitycontrol_singularity.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 240.0,
                endurance: 20.8,
                cast: 2.03
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/gravity-control'] = CONTROLLER_GRAVITY_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_GRAVITY_CONTROL_POWERSET = CONTROLLER_GRAVITY_CONTROL_POWERSET;
}