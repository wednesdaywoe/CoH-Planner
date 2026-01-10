/**
 * Storm Summoning
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_STORM_SUMMONING_POWERSET = {
    name: "Storm Summoning",
    category: "Unknown",
    description: "Storm Summoning powerset",
    icon: "storm-summoning_set.png",
    powers: [
        {
            name: "Gale",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can call forth a tremendous gust of Gale force winds that knock down foes and deal some Smashing damage in a wide cone area.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Cone), Minor DMG(Smash), Foe Knockback",
            icon: "stormsummoning_gale.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 1.3963,
            effects: {
                accuracy: 0.9,
                range: 50.0,
                recharge: 8.0,
                endurance: 7.8,
                cast: 2.17,
                damage: {
                    type: "Smashing",
                    scale: 0.2
                }
            }
        },
        {
            name: "O2 Boost",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Saturates the air around a targeted ally with rich oxygen, healing their wounds. The O2 Boost can protect a targeted ally from Sleep, Stun and Endurance Drain effects as well as increase perception. You cannot use this power on yourself.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ally Heal, +Res(Disorient, Sleep, End Drain), +Perception",
            icon: "stormsummoning_o2boost.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 13.0,
                cast: 2.27,
                buffDuration: 60.0,
                stun: 1.0,
                stunDuration: 60.0
            }
        },
        {
            name: "Snow Storm",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Slow Movement"],
            description: "While active, the chill from this Snow Storm can dramatically Slow the attack and movement speed of the target and all nearby foes. The torrent winds of the Snow Storm are enough to bring down flying foes.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Ranged (Targeted AoE), Foe -Speed, -Recharge, -Fly",
            icon: "stormsummoning_snowstorm.png",
            powerType: "Toggle",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 0.26,
                cast: 2.03,
                buffDuration: 0.75
            }
        },
        {
            name: "Steamy Mist",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Resist Damage"],
            description: "Your mastery of the elements allows you to hide yourself and all nearby allies within a Steamy Mist. Steamy Mist makes you and your allies harder to see and increases your Defense bonus to all attacks, while reducing Fire, Cold, and Energy damage, as well as your Foes ability to Confuse you.",
            shortHelp: "Toggle: PBAoE, Team Stealth, +DEF(All), +Res(Fire, Cold, Energy, Confuse)",
            icon: "stormsummoning_fog.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 0.26,
                cast: 1.87,
                buffDuration: 0.75
            }
        },
        {
            name: "Freezing Rain",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Summons Freezing Rain at a targeted location. Freezing Rain deals minimal Cold damage to anything that passes through the storm. It also Slows the affected foes and severely reduces their Defense and resistance to damage. Many foes may even slip and fall trying to escape the storm.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), Minor DoT(Cold), Foe -Speed, -Recharge, -DEF -Res",
            icon: "stormsummoning_freezingrain.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                endurance: 18.2,
                cast: 2.03,
                buffDuration: 15.0
            }
        },
        {
            name: "Hurricane",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Knockback", "To Hit Debuff"],
            description: "You can summon a Hurricane. The wind and rain from this massive storm reduce the range and chance to hit of nearby foes. The massive winds of this storm continuously force foes away from you.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: PBAoE, Foe -Range, -To Hit, Repel, Knockback",
            icon: "stormsummoning_hurricane.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.1625,
                cast: 2.03,
                buffDuration: 10.0,
                tohitDebuff: 3.0
            }
        },
        {
            name: "Thunder Clap",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Stuns"],
            description: "You can call forth a tremendous Thunder Clap that will Disorient most foes in a large area around you.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Foe Disorient",
            icon: "stormsummoning_thunderclap.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                recharge: 45.0,
                endurance: 10.4,
                cast: 2.37,
                stun: 2.0
            }
        },
        {
            name: "Tornado",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Accurate Defense Debuff", "Controller Archetype Sets", "Defense Debuff", "Knockback", "Pet Damage", "Recharge Intensive Pets", "Stuns", "Universal Damage Sets"],
            description: "Conjures up a funnel cloud at a targeted location. The Tornado will chase down your foes, tossing them into the air and hurling them great distances. The victims are left Disoriented and with reduced Defense. The Tornado is a menacing sight, and can even cause panic among your foes.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Summon Tornado: PBAoE Minor DMG(Smash), Foe Knockback, Fear, Disorient",
            icon: "stormsummoning_tornado.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.3,
                range: 60.0,
                recharge: 60.0,
                endurance: 20.8,
                cast: 1.17,
                buffDuration: 30.0
            }
        },
        {
            name: "Lightning Storm",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You can create a massive Lightning Storm that will strike any foe that approaches you. Lightning from this storm can knock down and damage all nearby foes, and can even instill panic. Lightning bolts will continue to fall as long as the storm remains.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Create Storm: Ranged, High DMG(Energy), Foe -End",
            icon: "stormsummoning_lightningstorm.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.4,
                recharge: 90.0,
                endurance: 31.2,
                cast: 2.03,
                buffDuration: 60.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/storm-summoning'] = CONTROLLER_STORM_SUMMONING_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_STORM_SUMMONING_POWERSET = CONTROLLER_STORM_SUMMONING_POWERSET;
}