/**
 * Dark Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_DARK_ASSAULT_POWERSET = {
    name: "Dark Assault",
    category: "Unknown",
    description: "Dark Assault powerset",
    icon: "dark-assault_set.png",
    powers: [
        {
            name: "Dark Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's chance to hit.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Negative), Foe -To Hit",
            icon: "darknessassault_darkblast.png",
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
                    type: "Negative",
                    scale: 2.26
                },
                tohitDebuff: 0.75,
                buffDuration: 6.0
            }
        },
        {
            name: "Smite",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your fists with Negative Energy channeled from the Netherworld and Smite your foe with a powerful blow. Smite clouds the target's vision, lowering their chance to hit for a short time.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, Moderate DMG(Smash/Negative), Foe -To Hit",
            icon: "darknessassault_smite.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 0.97,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 2.2892
                        },
                        {
                            type: "Smashing",
                            scale: 0.7497
                        }
                    ],
                    scale: 3.0389
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Gloom",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "Gloom slowly drains a target of life, while reducing their chance to hit. Slower than Dark Blast, but deals more damage over time.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, High DoT(Negative), Foe -To Hit",
            icon: "darknessassault_gloom.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.1,
                dotDamage: {
                    type: "Negative",
                    scale: 0.4063,
                    ticks: 7
                },
                buffDuration: 3.6,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Night Fall",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "Unleashes a cone shaped burst of particles from the Netherworld. All targets within the modest range of this power take Negative Energy damage and have a reduced chance to hit.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Moderate DMG(Negative), Foe -To Hit",
            icon: "darknessassault_nightfall.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.3491,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 14.0,
                endurance: 17.3829,
                cast: 2.0,
                dotDamage: {
                    type: "Negative",
                    scale: 0.2395,
                    ticks: 9
                },
                buffDuration: 2.8,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Gather Shadows",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "By collecting shadows from your surroundings you boost your damage and the secondary effects of your powers. Your powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all improved. The effects of Gather Shadows last a short while, and only the next couple of attacks will be boosted.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +Special, +Dmg(All)",
            icon: "darknessassault_gathershadows.png",
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
            name: "Engulfing Darkness",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You release a burst of negative energy to foes around you dealing moderate Negative Energy damage, reducing their chance to hit and sapping their health over time.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Light DMG(Negative), Foe -To Hit, Minor DoT(Negative)",
            icon: "darknessassault_deathshroud.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 18.0,
                endurance: 16.848,
                cast: 2.0,
                damage: {
                    type: "Negative",
                    scale: 1.8639999999999999
                },
                dotDamage: {
                    type: "Negative",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Life Drain",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can tap the power of the Netherworld to steal some life from a target foe and reduce their chance to hit. Some of that stolen life is transferred to you in the form of Hit Points.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Moderate DMG(Negative), Target -To Hit, Self +HP",
            icon: "darknessassault_lifedrain.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.93,
                damage: {
                    type: "Negative",
                    scale: 3.4101
                },
                healing: {
                    scale: 101.7352,
                    perTarget: true
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Moon Beam",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "Sniper Attacks", "To Hit Debuff", "Universal Damage Sets"],
            description: "An extremely long range and accurate beam of Negative Energy that deals tremendous damage and reduces the target's chance to hit. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Sniper, Extreme DMG(Negative), Target -To Hit",
            icon: "darknessassault_moonbeam.png",
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
            name: "Midnight Grasp",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Dominator Archetype Sets", "Immobilize", "Melee Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe, reduce their chance to hit and continuously drain their life force.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Superior DMG(Negative), Foe Immobilize, -To Hit",
            icon: "darknessassault_midnightgrasp.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 15.0,
                endurance: 11.96,
                cast: 2.07,
                damage: {
                    type: "Negative",
                    scale: 4.3018
                },
                dotDamage: {
                    type: "Negative",
                    scale: 0.11,
                    ticks: 4
                },
                tohitDebuff: 0.75,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/dark-assault'] = DOMINATOR_DARK_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_DARK_ASSAULT_POWERSET = DOMINATOR_DARK_ASSAULT_POWERSET;
}