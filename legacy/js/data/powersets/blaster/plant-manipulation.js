/**
 * Plant Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_PLANT_MANIPULATION_POWERSET = {
    name: "Plant Manipulation",
    category: "Unknown",
    description: "Plant Manipulation powerset",
    icon: "plant-manipulation_set.png",
    powers: [
        {
            name: "Entangle",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Immobilizes your target by Entangling their feet in a twisted mass of thorny roots. The roots do smashing and lethal damage to the target over time. More resilient foes may require multiple applications to Immobilize. Entangle can immobilize flying targets, if they are near the ground when attacked.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, DoT(Smash/Lethal), Foe Immobilize, -Fly",
            icon: "plantmanipulation_entangle.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
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
            name: "Skewer",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee Damage", "Universal Damage Sets"],
            description: "You lunge forward with this melee attack and Skewer your foe with the large Thorn on your arm. Deals high damage and poisons your foe. Poison from the Thorns deals additional Toxic damage and can reduce your foes Defense.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, DMG(Lethal), DoT(Toxic), Foe -DEF",
            icon: "plantmanipulation_skewer.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.23,
                damage: {
                    type: "Lethal",
                    scale: 3.6208
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1,
                defenseDebuff: 2.0
            }
        },
        {
            name: "Strangler",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Holds a distant foe by Strangling him with massive root-like vines. The target is held helpless, while he is slowly crushed by the vines.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, DoT(Smash), Foe Hold",
            icon: "plantmanipulation_strangler.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 16.0,
                endurance: 11.388,
                cast: 2.07,
                dotDamage: {
                    type: "Smashing",
                    scale: 0.7179,
                    ticks: 4
                },
                buffDuration: 4.2
            }
        },
        {
            name: "Toxins",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "You use your power over plants to coat all your attacks with powerful toxins for a few seconds, all your attacks will now do extra toxic damage and be more accurate.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +ToHit, +DMG(Special)",
            icon: "plantmanipulation_toxins.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 2.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Spore Cloud",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["To Hit Debuff"],
            description: "You create a large cloud of toxic spores around your targeted foe. The target and all nearby foes will have their damage output, chance to hit and regeneration rate reduced.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Ranged (Targeted AoE), Foe -DMG, -ToHit, -Regen",
            icon: "natureaffinity_sporecloud.png",
            powerType: "Toggle",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 8.0,
                endurance: 0.26,
                cast: 3.1,
                tohitDebuff: 0.75,
                buffDuration: 0.75
            }
        },
        {
            name: "Wild Fortress",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Resist Damage"],
            description: "You encase yourself in a protective barrier that will absorb a moderate amount of damage. Additionally, you will recover endurance faster and be resistant to toxic damage and have confusion protection.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +Absorb, +Recovery, +Resist(Toxic, Confuse)",
            icon: "plantmanipulation_wildfortress.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 2.27,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 1
                },
                protection: {
                    confuse: 7.266
                },
                resistance: {
                    toxic: 0.13
                },
                buffDuration: 12.0
            }
        },
        {
            name: "Ripper",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can unleash a spectacular slashing maneuver that attacks all foes in a wide arc directly in front of you. Ripper deals massive damage and poisons multiple targets. It can even knock foes down. Thorn poison deals additional Toxic damage and can reduce your foes Defense.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee (Cone), DMG(Lethal), DoT(Toxic), Foe Knockdown, -DEF",
            icon: "plantmanipulation_ripper.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 13.0,
                endurance: 12.688,
                cast: 2.33,
                damage: {
                    type: "Lethal",
                    scale: 3.9827000000000004
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.2,
                    ticks: 4
                },
                buffDuration: 4.1,
                defenseDebuff: 3.0
            }
        },
        {
            name: "Vines",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Holds", "Immobilize"],
            description: "Creates a field of Strangler Vines that can Hold multiple foes at range. The affected targets are held helpless by the massive root-like vines. Some are likely to free their arms and attack, but will still be unable to move. Unlike the power Strangler, this power does not deal any damage, but it can Hold multiple foes at once.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Hold, Immobilize",
            icon: "plantmanipulation_vines.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                range: 80.0,
                recharge: 90.0,
                endurance: 20.18,
                cast: 1.17
            }
        },
        {
            name: "Thorn Burst",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can explode dozens of Thorns in all directions around you. These Thorns only travel a short distance, but they can deal moderate damage and poison any target close to you. Toxic damage from the thorns can reduce the Defense of affected foes.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE Melee, DMG(Lethal), DoT(Toxic), Foe -DEF",
            icon: "plantmanipulation_thornburst.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 17.0,
                endurance: 16.016,
                cast: 2.0,
                damage: {
                    type: "Lethal",
                    scale: 2.367
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1,
                defenseDebuff: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/plant-manipulation'] = BLASTER_PLANT_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_PLANT_MANIPULATION_POWERSET = BLASTER_PLANT_MANIPULATION_POWERSET;
}