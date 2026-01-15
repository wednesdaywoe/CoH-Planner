/**
 * Martial Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_MARTIAL_ASSAULT_POWERSET = {
    name: "Martial Assault",
    category: "Unknown",
    description: "Martial Assault powerset",
    icon: "martial-assault_set.png",
    powers: [
        {
            name: "Shuriken Throw",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "You impale your foe with a thrown shuriken, dealing moderate Lethal damage.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Lethal)",
            icon: "martialassault_shurikenthrow.png",
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
                    scale: 2.26
                }
            }
        },
        {
            name: "Thunder Kick",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "You can perform a strong Thunder Kick that hits so hard it can Disorient your target.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, Moderate DMG(Smash), Minor Disorient",
            icon: "martialassault_thunderkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 7.0,
                endurance: 7.696,
                cast: 0.83,
                damage: {
                    type: "Smashing",
                    scale: 2.6220999999999997
                },
                stun: 3.0
            }
        },
        {
            name: "Trick Shot",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "You take careful aim and bounce a thrown shuriken between multiple targets.<br><br><color #fcfc95>Notes: Trick Shot is unaffected by Range changes.</color><br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Chain Light DMG(Lethal)",
            icon: "martialassault_trickshot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Chain",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.07,
                damage: {
                    type: "Lethal",
                    scale: 2.5
                }
            }
        },
        {
            name: "Spinning Kick",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You perform a high spinning reverse roundhouse kick, smashing anything in front of you with devastating force. You can activate this ability at any time, no matter what you have targeted; it will strike enemies directly in front of your character, rather than enemies near your target.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee Cone, Light DMG(Smash), Knockdown",
            icon: "martialassault_spinningkick.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.05,
                range: 9.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.07,
                damage: {
                    type: "Smashing",
                    scale: 2.7464
                }
            }
        },
        {
            name: "Envenomed Blades",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "You add a toxic venom to all of your attacks for a moderate duration. All damaging powers gain bonus Toxic damage. You also gain a moderate bonus to your chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +Toxic Damage on all attacks, +ToHit",
            icon: "martialassault_envenomedblades.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 160.0,
                endurance: 7.8,
                cast: 1.17,
                tohitBuff: 0.12,
                buffDuration: 40.0
            }
        },
        {
            name: "Dragon's Tail",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "This low spinning kick deals less damage than Thunder Kick, but has a chance to hit all enemies in melee range. Successful hits may trip and knock down your opponents.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE Melee, Light DMG(Smash), Foe Knockdown",
            icon: "martialmanipulation_dragonstail.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.5,
                damage: {
                    type: "Smashing",
                    scale: 2.7914
                }
            }
        },
        {
            name: "Caltrops",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You toss a handful of Caltrops at a targeted location and spread the tiny metal spikes over a large area. Any villains that pass over the Caltrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed",
            icon: "martialassault_caltrops.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 25.0,
                recharge: 45.0,
                endurance: 7.8,
                cast: 1.07,
                buffDuration: 45.0
            }
        },
        {
            name: "Masterful Throw",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "Sniper Attacks", "To Hit Debuff", "Universal Damage Sets"],
            description: "You take careful aim and let loose an extremely accurate, extremely forceful blade. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Sniper, Extreme DMG(Lethal), Foe -To Hit",
            icon: "martialassault_masterfulthrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.33
            }
        },
        {
            name: "Explosive Shuriken",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "You rig a shuriken with a powerful explosive, then send it flying towards your enemies.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Superior DMG(Fire), Minor Splash Damage (Fire DoT)",
            icon: "martialassault_explosiveshuriken.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.67,
                damage: {
                    type: "Fire",
                    scale: 4.329
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/martial-assault'] = DOMINATOR_MARTIAL_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_MARTIAL_ASSAULT_POWERSET = DOMINATOR_MARTIAL_ASSAULT_POWERSET;
}