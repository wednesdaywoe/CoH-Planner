/**
 * Martial Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_MARTIAL_MANIPULATION_POWERSET = {
    name: "Martial Manipulation",
    category: "Unknown",
    description: "Martial Manipulation powerset",
    icon: "martial-manipulation_set.png",
    powers: [
        {
            name: "Reach for the Limit",
            available: -1,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Damage"],
            allowedSetCategories: [],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "martialmanipulation_reachforthelimit.png",
            powerType: "Global Enhancement",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0
            }
        },
        {
            name: "Ki Push",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "You smash your foe with a burst of Ki Energy, sending them flying through the air in slow motion.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Melee, Light DMG(Smash), Foe Repel, KB",
            icon: "martialmanipulation_kipush.png",
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
                    scale: 2.1409000000000002
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Storm Kick",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "You can unleash a roundhouse kick that pummels your foe for moderate damage, knocking them down. Storm Kick has an additional chance to cause your target to bleed for Lethal damage over time.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Melee, Moderate DMG(Smash), DoT(Lethal), Foe Knockdown",
            icon: "martialmanipulation_stormkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.07,
                damage: {
                    type: "Smashing",
                    scale: 2.4311
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.1926,
                    ticks: 3
                },
                buffDuration: 1.5
            }
        },
        {
            name: "Reach for the Limit",
            available: 3,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "You are constantly looking for vulnerabilities in your foes' stances and positioning. Whenever you attack, you have a chance to gain a moderate +ToHit and +Damage bonus for a short duration.",
            shortHelp: "All Attacks: Chance for +ToHit, +DMG(All)",
            icon: "martialmanipulation_reachforthelimit.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                buffDuration: 10.25
            }
        },
        {
            name: "Burst of Speed",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Teleport", "Universal Damage Sets", "Universal Travel"],
            description: "Channeling physical Ki inwards, you move more quickly than can be seen for an instant, allowing you to move instantly to a targeted location and strike at targets within melee range. You can use this Burst of Speed up to 3 times before it needs to recharge.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Location AoE Moderate DMG (Smash), Self Teleport",
            icon: "martialmanipulation_burstofspeed.png",
            powerType: "Click",
            targetType: "Location (Teleport)",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 200.0,
                recharge: 90.0,
                endurance: 13.52,
                cast: 1.0,
                buffDuration: 2.0
            }
        },
        {
            name: "Dragon's Tail",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "This low spinning kick deals moderate damage, but has a chance to hit all enemies in melee range. Successful hits may trip and knock down your opponents.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE Melee, Light DMG(Smash), Foe Knockdown",
            icon: "martialmanipulation_dragonstail.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 14.0,
                endurance: 13.52,
                cast: 1.5,
                damage: {
                    type: "Smashing",
                    scale: 2.0936
                },
                buffDuration: 9.0
            }
        },
        {
            name: "Reaction Time",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Slow Movement"],
            description: "You attune yourself to the world around you, moving with preternatural speed. All enemies nearby move slowly and have reduced recharge, and you can absorb small amounts of damage every 2 seconds. When Reaction Time is deactivated, you gain a burst of speed for a short duration, increasing your own recharge and move speed.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle (PBAoE), Self Absorb over Time, +Recovery, Foe –Rech, - Move, Special",
            icon: "martialmanipulation_reactiontime.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 1.83,
                buffDuration: 5.0
            }
        },
        {
            name: "Inner Will",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Healing"],
            description: "When pushed to your limit, you can tap into an inner reserve of power, allowing you to overcome impossible odds. When you are below half health, below half endurance, or the victim of any status effect, you may activate Inner Will. Inner Will cancels any status effects currently affecting you, increases your resistance to status effects by 100%, and increases the power of your own status effect-inducing powers. Inner Will also heals you for a moderate amount when activated.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self Heal, Special",
            icon: "martialmanipulation_innerwill.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                cast: 1.03,
                stun: 1.0,
                stunDuration: 30.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Throw Sand",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Stuns"],
            description: "You grab some nearby debris and fling it towards a nearby foe, obstructing their vision and dazing them.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Cone), Foe Disorient, -Perception",
            icon: "martialmanipulations_throwsand.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.7854,
            effects: {
                accuracy: 0.8,
                range: 40.0,
                recharge: 90.0,
                endurance: 20.18,
                cast: 1.07,
                stun: 3.0,
                buffDuration: 20.0
            }
        },
        {
            name: "Eagles Claw",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "You can perform a devastating kick that can severely Disorient most opponents. Eagle's Claw strikes so powerfully that it weakens your target's resolve, reducing their Range and Recharge for several seconds after attacking, and has an additional chance to cause your target to bleed for Lethal damage over time.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Smash), DoT(Lethal), Foe Minor Disorient, +Special",
            icon: "martialmanipulation_eaglesclaw.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 18.0,
                endurance: 16.848,
                cast: 2.53,
                damage: {
                    type: "Smashing",
                    scale: 6.1307
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.5,
                    ticks: 10
                },
                buffDuration: 5.0,
                stun: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/martial-manipulation'] = BLASTER_MARTIAL_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_MARTIAL_MANIPULATION_POWERSET = BLASTER_MARTIAL_MANIPULATION_POWERSET;
}