/**
 * Electric Control
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_ELECTRIC_CONTROL_POWERSET = {
    name: "Electric Control",
    category: "Unknown",
    description: "Electric Control powerset",
    icon: "electric-control_set.png",
    powers: [
        {
            name: "Electric Fence",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Endurance Modification", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Surrounds and Immobilizes a single target in an Electric Fence. Deals some damage over time and slowly drains some Endurance. Useful for keeping villains at bay and bringing down fliers.",
            shortHelp: "Ranged, DoT(Energy), Foe Immobilize, -End, -Fly, -Knockback",
            icon: "electriccontrol_electricfence.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.67,
                dotDamage: {
                    type: "Energy",
                    scale: 0.5458000000000001,
                    ticks: 4
                },
                buffDuration: 9.2
            }
        },
        {
            name: "Tesla Cage",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Endurance Modification", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Tesla Cage confines the target in an electrical prison. The target is overwhelmed by the electrical charge and is left helpless and can be attacked. The target is drained of some Endurance and some of that Endurance may be transferred back to you.",
            shortHelp: "Ranged, DMG(Energy), Foe Hold, -End",
            icon: "electriccontrol_teslacage.png",
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
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.8891
                        },
                        {
                            type: "Energy",
                            scale: 1.0
                        }
                    ],
                    scale: 2.8891
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Chain Fences",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Endurance Modification", "Immobilize", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can immobilize multiple foes in a chain of electricity, dealing minor damage to all foes in range and draining some endurance. This power also reduces Flight capacity in targets.",
            shortHelp: "Ranged AoE, DMG(Energy), Foe Immobilize, -End, -Fly",
            icon: "electriccontrol_chainfences.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.9,
                range: 80.0,
                recharge: 8.0,
                endurance: 15.6,
                cast: 1.17,
                damage: {
                    type: "Energy",
                    scale: 1.839
                },
                dotDamage: {
                    type: "Energy",
                    scale: 0.1,
                    ticks: 2
                },
                buffDuration: 5.2
            }
        },
        {
            name: "Jolting Chain",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You can send a bolt of electricity through multiple opponents, causing a muscle spasm and dealing minor damage. Each foe is knocked down, and the electric charge can fork several times, jumping to several opponents rapidly.",
            shortHelp: "Ranged Chain AoE, DMG(Energy), Foe Knockdown, -End",
            icon: "electriccontrol_joltingchain.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Chain",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 10.4,
                cast: 2.07,
                damage: {
                    type: "Energy",
                    scale: 1.9272
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Conductive Aura",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "While this power is active, the air around you becomes charged with electricity, leaping out and shocking foes that get too close. Foes will lose some endurance, while you gain Recovery and Regeneration per target hit.",
            shortHelp: "Toggle: PBAoE, Foe -End, Self +Rec, +Regen",
            icon: "electriccontrol_stunningaura.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                cast: 2.03,
                buffDuration: 2.25
            }
        },
        {
            name: "Static Field",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Sleep", "Recharge", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Endurance Modification", "Sleep", "Slow Movement"],
            description: "You can build up a Static Field at a nearby location. Any foes in the field may lose control of their muscles due to the static charge, and will shake violently. Foes may also be drained of some endurance, and some of that endurance may be transferred to nearby allies. Any attack will interrupt the effect temporarily and foes will re-gain control, although their movement and attack rates will be reduced. This effect can last for some time, and will continue to paralyze foes in the field.",
            shortHelp: "Target (Location AoE), Foe Sleep, -End, -Speed, -Recharge",
            icon: "electriccontrol_staticfield.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 40.0,
                endurance: 15.6,
                cast: 2.03,
                buffDuration: 25.0
            }
        },
        {
            name: "Tesla Coil",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Summoning a large amount of energy that periodically jolts at nearby enemies dealing energy damage and paralizing them for a short time. These foes may be drained of some endurance as well.",
            shortHelp: "Ranged (Targeted AoE), Foe DMG(Energy), Hold, -End, -Fly, -Jump, -Recharge",
            icon: "electriccontrol_paralyzingblastpatch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 0.8,
                range: 80.0,
                recharge: 240.0,
                endurance: 15.6,
                cast: 1.67
            }
        },
        {
            name: "Synaptic Overload",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Confuse", "Dominator Archetype Sets"],
            description: "This power can subtly scramble the synapses of any target affected, causing hallucinations and confusion amongst foes. The electric charge lasts for some time, and will jump slowly to other opponents causing wide spread confusion. Foes may not be aware that this has happened, and will not be alerted to your presence. You will also not receive experience for any damage dealt by confused opponents.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>6</color> seconds and each affected foe will increase the recharge by <color #FF7F27>6.5</color> seconds for a maximum total of <color #FF7F27>110</color> seconds.</color>",
            shortHelp: "Ranged Chain AoE, Foe Confuse, -End",
            icon: "electriccontrol_synapticoverload.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Chain",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 6.0,
                endurance: 15.6,
                cast: 2.0,
                buffDuration: 8.0
            }
        },
        {
            name: "Gremlins",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Mastery over electricity allows you to create almost sentient elementals of lightning. These elementals are mischievous in nature, and enjoy creating havoc and interfering with electronic equipment or magical cantrips. They also never work alone, where there is one Gremlin, there is often another nearby.",
            shortHelp: "Summon Gremlins: Melee DMG(Energy)",
            icon: "electriccontrol_gremlins.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
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
    POWERSETS['dominator/electric-control'] = DOMINATOR_ELECTRIC_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_ELECTRIC_CONTROL_POWERSET = DOMINATOR_ELECTRIC_CONTROL_POWERSET;
}