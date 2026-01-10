/**
 * Symphony Control
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_SYMPHONY_CONTROL_POWERSET = {
    name: "Symphony Control",
    category: "Unknown",
    description: "Symphony Control powerset",
    icon: "symphony-control_set.png",
    powers: [
        {
            name: "Hymn of Dissonance",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Hymn of Dissonance causes pain on its listener, disruptive enough to hold them in place. Stronger foes might persist, but will still attack at a reduced speed.",
            shortHelp: "Ranged, DMG(Psionic), Foe Hold, -Recharge",
            icon: "symphonycontrol_holdst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 2.8890000000000002
                },
                buffDuration: 18.0
            }
        },
        {
            name: "Melodic Binding",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Melodic Binding immobilizes your target in place and inflict psionic damage. Stronger foes might still be able to move, but will do so at a reduced speed.",
            shortHelp: "Ranged, DMG(Psionic), Foe Immobilize, -SPD",
            icon: "symphonycontrol_immobst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.5,
                damage: {
                    type: "Psionic",
                    scale: 2.6100000000000003
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Aria of Stasis",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Aria of Stasis roots your audience in place and causes psionic damage. Stronger foes might still be able to move, but will do so at a reduced speed.",
            shortHelp: "Ranged (Cone), DMG(Psionic), Foe Immobilize, -SPD",
            icon: "symphonycontrol_immobaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 1.0472,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 13.0,
                cast: 1.5,
                damage: {
                    type: "Psionic",
                    scale: 1.003
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Impassioned Serenade",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Confuse", "Dominator Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "You serenade your target with an impassioned song, charming them into fighting for you.<br><br><color #fcfc95>Note: this power inflicts damage over time for up to 30 seconds as long as the target is confused.</color>",
            shortHelp: "Ranged, DoT(Psionic), Foe Confuse",
            icon: "symphonycontrol_confusest.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.0,
                damage: {
                    type: "Psionic",
                    scale: 0.65
                },
                dotDamage: {
                    type: "Psionic",
                    scale: 0.04,
                    ticks: 30
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Dreadful Discord",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Fear", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Dreadful Discord is a terrifying song that will leave your audience shaking in fear.",
            shortHelp: "Ranged (Cone), DMG(Psionic), Foe Fear",
            icon: "symphonycontrol_fearaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 40.0,
                endurance: 8.528,
                cast: 2.17,
                damage: {
                    type: "Psionic",
                    scale: 1.2437
                }
            }
        },
        {
            name: "Enfeebling Lullaby",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Ranged AoE Damage", "Sleep", "Universal Damage Sets"],
            description: "A song that will put even elephants to sleep. Enfeebling Lullaby will relax foes, causing them to sleep and their attacks will do reduced damage for some time.<br><br><color #fcfc95>Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.</color>",
            shortHelp: "Ranged (Cone), DMG(Psionic), Foe Deep Sleep, -DMG",
            icon: "symphonycontrol_sleepst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 45.0,
                endurance: 15.6,
                cast: 2.67,
                damage: {
                    type: "Psionic",
                    scale: 0.2
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Confounding Chant",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "Confounding Chant will disorient anyone that hears it, while dealing psionic damage over time. <br><br><color #fcfc95>Note: this power's damage over time will extend its duration but only inflict its damage if the foe is stunned.</color>",
            shortHelp: "Ranged (Cone), DoT(Psionic), Foe Disorient",
            icon: "symphonycontrol_stunaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 0.7854,
            effects: {
                accuracy: 0.8,
                range: 70.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.33,
                stun: 3.0
            }
        },
        {
            name: "Chords of Despair",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds"],
            description: "Your audience falls into deep despair, incapacitating them.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>8</color> seconds and each affected foe will increase the recharge by <color #FF7F27>14.5</color> seconds for a maximum total of <color #FF7F27>240</color> seconds.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Hold",
            icon: "symphonycontrol_holdaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.67
            }
        },
        {
            name: "Reverberant",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Sleep", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Confuse", "Fear", "Holds", "Immobilize", "Pet Damage", "Recharge Intensive Pets", "Sleep", "Stuns", "Universal Damage Sets"],
            description: "You summon an entity capable of repeating your songs a short while after you have executed them. <br><br><color #fcfc95>Note: This entity will execute weaker versions of your songs. Type ''/release_pets'' in the chat window to release all your pets.",
            shortHelp: "Summon Reverberant: Ranged Control Special",
            icon: "symphonycontrol_pet.png",
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
    POWERSETS['dominator/symphony-control'] = DOMINATOR_SYMPHONY_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_SYMPHONY_CONTROL_POWERSET = DOMINATOR_SYMPHONY_CONTROL_POWERSET;
}