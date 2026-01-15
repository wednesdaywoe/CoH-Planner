/**
 * Plant Control
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_PLANT_CONTROL_POWERSET = {
    name: "Plant Control",
    category: "Unknown",
    description: "Plant Control powerset",
    icon: "plant-control_set.png",
    powers: [
        {
            name: "Entangle",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizes your target by Entangling their feet in a twisted mass of thorny roots. The roots do smashing and lethal damage to the target over time. More resilient foes may require multiple applications to Immobilize. Entangle can immobilize flying targets, if they are near the ground when attacked.",
            shortHelp: "Ranged, DoT(Smashing, Lethal), Foe Immobilize",
            icon: "plantcontrol_entangle.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.2,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.24000000000000002,
                            ticks: 4
                        },
                        {
                            type: "Lethal",
                            scale: 0.24000000000000002,
                            ticks: 4
                        }
                    ]
                },
                buffDuration: 9.2
            }
        },
        {
            name: "Strangler",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Holds a distant foe by Strangling him with massive root-like vines. The target is held helpless, while he is slowly crushed by the vines.",
            shortHelp: "Ranged, DoT(Smashing), Foe Hold",
            icon: "plantcontrol_strangler.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.07,
                dotDamage: {
                    type: "Smashing",
                    scale: 0.6538,
                    ticks: 4
                },
                buffDuration: 4.2
            }
        },
        {
            name: "Roots",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Immobilizes a group of foes by entangling their feet in a twisted mass of thorny Roots. Roots is slower and does less damage than Entangle, but it can capture multiple foes in one attack. Like Entangle, Roots can immobilize flying targets, if they are near the ground when attacked.",
            shortHelp: "Ranged (Targeted AoE), DoT(Smashing, Lethal), Foe Immobilize",
            icon: "plantcontrol_roots.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.9,
                range: 80.0,
                recharge: 8.0,
                endurance: 13.0,
                cast: 1.67,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.16510000000000002,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.16510000000000002,
                            ticks: 2
                        }
                    ]
                },
                buffDuration: 5.2
            }
        },
        {
            name: "Spore Burst",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Sleep"],
            description: "You hurl a large fungi pod at your foes. This pod is full of Spores that burst on impact, engulfing the target and all those around him. All affected targets may succumb to the narcotic effect of the Spores and will fall asleep. The targets will remain asleep for some time, but will awaken if attacked.<br><br><color #fcfc95>Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Deep Sleep",
            icon: "plantcontrol_sporeburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 45.0,
                endurance: 13.0,
                cast: 1.37
            }
        },
        {
            name: "Seeds of Confusion",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Confuse", "Dominator Archetype Sets"],
            description: "You throw a handful of seeds from a rare Baffle plant at your foes. The seeds spread out in a wide cone and release a dusty chaff that contain a number of alkaloids and hallucinogenic compounds. Foes that come into contact with these seeds become violently confused and will turn and attack each other, ignoring you and all your allies. You will not receive any Experience Points for foes defeated entirely by Confused enemies.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>6</color> seconds and each affected foe will increase the recharge by <color #FF7F27>6.5</color> seconds for a maximum total of <color #FF7F27>110</color> seconds.</color>",
            shortHelp: "Ranged (Cone), Foe Confuse",
            icon: "plantcontrol_seedsconfusion.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 1.0472,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 6.0,
                endurance: 15.6,
                cast: 1.07
            }
        },
        {
            name: "Spirit Tree",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing", "Threat Duration"],
            description: "You can tap into the elusive and powerful energy of the World Tree and extract a Spirit Tree at a targeted location. The Sprit Tree is immobile, but possesses incredible rejuvenating powers. The Regeneration Rate of you, or your allies, will be greatly increased as long as you are near the Spirit Tree. The tree will also distract some enemies, taunting them to attack it instead of you.",
            shortHelp: "Place Tree: PBAoE +Regen",
            icon: "plantcontrol_spirittree.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 120.0,
                endurance: 13.0,
                cast: 1.67,
                buffDuration: 60.0
            }
        },
        {
            name: "Vines",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Creates a field of Strangler Vines that can Hold multiple foes at range. The affected targets are held helpless by the massive root-like vines. Vines lowers damage output of targets and deals toxic damage over time if they are held.",
            shortHelp: "Ranged (Targeted AoE), Foe Hold, -DMG, -DoT(Toxic)",
            icon: "plantcontrol_vines.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 0.8,
                range: 80.0,
                recharge: 240.0,
                endurance: 15.6,
                cast: 2.1
            }
        },
        {
            name: "Carrion Creepers",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Knockback", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You can create a Creeper patch at a targeted location. The patch will snag foes, slowing their movement, and preventing them from jumping or flying. Additionally, a Creeper Vine will burst from under each live and defeated foe in the area and start attacking your enemies. Creeper Vines do minimal damage, but they can knock down your enemies and its poisonous thorns can slow your foes. Any foes that are defeated in the Creeper patch will also produce a growth of Entangle Roots that will Immobilize any enemies near the defeated foe.",
            shortHelp: "Summon Creepers, Ranged (Location AoE), Target -Speed, -Fly, -Jump,",
            icon: "plantcontrol_carrioncreeper.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 360.0,
                endurance: 26.0,
                cast: 1.17,
                buffDuration: 120.0
            }
        },
        {
            name: "Fly Trap",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "You can summon a giant carnivorous Fly Trap plant beast. Fly Trap may be an understatement, as this plant beast has a taste for flesh. The Fly Trap will viciously attack any nearby foes; biting, hurling poisonous Thorns and even casting its own Entangle Roots. The Fly Trap will fight by your side and can be healed and buffed like any teammate.",
            shortHelp: "Summon Fly Trap: Ranged Control Special",
            icon: "plantcontrol_venusflytrap.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 240.0,
                endurance: 26.0,
                cast: 1.17
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/plant-control'] = DOMINATOR_PLANT_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_PLANT_CONTROL_POWERSET = DOMINATOR_PLANT_CONTROL_POWERSET;
}