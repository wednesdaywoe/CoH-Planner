/**
 * Fire Control
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_FIRE_CONTROL_POWERSET = {
    name: "Fire Control",
    category: "Unknown",
    description: "Fire Control powerset",
    icon: "fire-control_set.png",
    powers: [
        {
            name: "Char",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Incapacitates a distant foe by Charring him with smoldering soot and cinders. The target is left helpless, choking on the soot.",
            shortHelp: "Ranged, Moderate DoT(Fire), Foe Hold",
            icon: "firetrap_soot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.07,
                dotDamage: {
                    type: "Fire",
                    scale: 0.5138,
                    ticks: 4
                },
                buffDuration: 4.2
            }
        },
        {
            name: "Ring of Fire",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizes your target in a Ring of Fire, dealing Fire damage over time. More resilient foes may require multiple Fire Rings to Immobilize.",
            shortHelp: "Ranged, Moderate DoT(Fire), Foe Immobilize",
            icon: "firetrap_ringoffire.png",
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
                    type: "Fire",
                    scale: 0.4958,
                    ticks: 4
                },
                buffDuration: 9.2
            }
        },
        {
            name: "Fire Cages",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Immobilizes a group of foes in Fire Cages, dealing Fire damage over time. More resilient foes may require multiple Fire Cages to Immobilize. Fire Cages is slower and less damaging than Ring of Fire, but can capture multiple targets.",
            shortHelp: "Ranged (Targeted AoE), Minor DoT(Fire), Foe Immobilize",
            icon: "firetrap_firecage.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.9,
                range: 80.0,
                recharge: 8.0,
                endurance: 15.6,
                cast: 1.03,
                dotDamage: {
                    type: "Fire",
                    scale: 0.1965,
                    ticks: 2
                },
                buffDuration: 5.2
            }
        },
        {
            name: "Smoke",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["To Hit Debuff"],
            description: "Covers all foes near your target in clouds of Smoke. Your enemies are so blinded that they can hardly see a thing. Most foes will not be able to see past normal melee range, although some may have better perception. If the affected targets are attacked, they will be alerted to your presence, but will suffer a penalty to their chance to hit.",
            shortHelp: "Ranged (Targeted AoE), Foe -Perception, -To Hit",
            icon: "firetrap_smoke.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 7.8,
                cast: 1.17,
                buffDuration: 60.0,
                tohitDebuff: 0.5
            }
        },
        {
            name: "Hot Feet",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "While active, you heat the earth in a large area around yourself. Enemy movement is Slowed as they attempt to flee the immediate area. All foes in the affected area may suffer some damage over time. You cannot fly and must be near the ground to use this power.",
            shortHelp: "Toggle: PBAoE, Minor DoT(Fire), Foe -SPD",
            icon: "firetrap_hotfeet.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 2.08,
                cast: 1.47,
                damage: {
                    type: "Fire",
                    scale: 0.25
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Flashfire",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "You can bring forth a Flashfire to Disorient a group of foes and deal some damage over time. Target must be on the ground to activate Flashfire.",
            shortHelp: "Ranged (Targeted AoE), Minor DoT(Fire), Foe Disorient",
            icon: "firetrap_flashfire.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                range: 70.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.37,
                dotDamage: {
                    type: "Fire",
                    scale: 0.06,
                    ticks: 4
                },
                buffDuration: 4.0,
                stun: 1.0
            }
        },
        {
            name: "Cinders",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds"],
            description: "Incapacitates foes around the caster by whirling Cinders around them. The targets are left helpless, choking on the soot.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>8</color> seconds and each affected foe will increase the recharge by <color #FF7F27>14.5</color> seconds for a maximum total of <color #FF7F27>240</color> seconds.</color>",
            shortHelp: "PBAoE, Foe Hold",
            icon: "firetrap_cinders.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.07
            }
        },
        {
            name: "Bonfire",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can create a Bonfire that knocks back and burns any foes who try to pass through it.",
            shortHelp: "Ranged (Location AoE), Minor DMG(Fire), Foe Knockback",
            icon: "firetrap_bonfire.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 60.0,
                endurance: 13.0,
                cast: 3.07,
                buffDuration: 45.0
            }
        },
        {
            name: "Fire Imps",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "You can craft 3 small Fire Imps out of pure flame in a targeted location. Fire Imps will viciously attack any nearby foes, but they only possess the most basic instincts. Fire Imps can be healed and buffed like any teammate.",
            shortHelp: "Summon Imps: Melee Minor DMG(Fire)",
            icon: "firetrap_fireimps.png",
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
    POWERSETS['dominator/fire-control'] = DOMINATOR_FIRE_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_FIRE_CONTROL_POWERSET = DOMINATOR_FIRE_CONTROL_POWERSET;
}