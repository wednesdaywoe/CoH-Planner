/**
 * Mind Control
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_MIND_CONTROL_POWERSET = {
    name: "Mind Control",
    category: "Unknown",
    description: "Mind Control powerset",
    icon: "mind-control_set.png",
    powers: [
        {
            name: "Levitate",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You can send a single target violently into the air, then slam them to the ground for Smashing damage. This power can bring flying foes to the ground. This power will affect enemies around your primary target, should it be used on the primary target of your Telekinesis.",
            shortHelp: "Ranged, DMG(Smash)",
            icon: "mentalcontrol_levitate.png",
            powerType: "Click",
            targetType: "Foe",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.87,
                damage: {
                    type: "Smashing",
                    scale: 3.2691
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Mesmerize",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Ranged Damage", "Sleep", "Universal Damage Sets"],
            description: "Mesmerize painfully assails a target with psychic energy, rendering them unconscious. The target will remain asleep for some time, but will awaken if attacked.<br><br><color #fcfc95>Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.</color>",
            shortHelp: "Ranged, DMG(Psionic), Foe Deep Sleep",
            icon: "mentalcontrol_hypnotize.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 100.0,
                recharge: 6.0,
                endurance: 5.2,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 1.809
                }
            }
        },
        {
            name: "Dominate",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Painfully tears at the mind of a single foe. Dominate deals Psionic damage and renders a foe helpless, lost in their own mind and unable to defend themselves.",
            shortHelp: "Ranged, DMG(Psionic), Foe Hold",
            icon: "mentalcontrol_command.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.1,
                damage: {
                    type: "Psionic",
                    scale: 1.745
                }
            }
        },
        {
            name: "Confuse",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Confuse", "Controller Archetype Sets"],
            description: "You can Confuse an enemy, forcing that foe to believe their friends are not who they appear to be. If successful, the enemy will ignore you and attack their own allies. If you Confuse someone before they have noticed you, your presence will continue to be masked. You will not receive any Experience Points for foes defeated by a Confused enemy.",
            shortHelp: "Ranged, Target Confuse",
            icon: "mentalcontrol_mindcontrol.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.0
            }
        },
        {
            name: "Mass Hypnosis",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Sleep"],
            description: "Hypnotizes a group of foes at a distance and puts them to Sleep. The targets will remain asleep for some time, but will awaken if attacked. This power deals no damage, but if done discreetly, the targets will never be aware of your presence.<br><br><color #fcfc95>Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Deep Sleep",
            icon: "mentalcontrol_masshypnosis.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 45.0,
                endurance: 15.6,
                cast: 2.03
            }
        },
        {
            name: "Telekinesis",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize"],
            description: "Lifts a foe, and any nearby foes, off the ground and repels them. The targets are helpless, unable to move, and will continue to hover away, picking up any passing targets, as long as you keep this power active. Keeping up this level of concentration costs a lot of Endurance. Note despite this power being auto-hit, it still requires a ToHit check.",
            shortHelp: "Toggle: Ranged (Targeted AoE), Foe Immobilize, Repel",
            icon: "mentalcontrol_telekinesis.png",
            powerType: "Toggle",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 90.0,
                endurance: 0.26,
                cast: 1.13,
                buffDuration: 1.5
            }
        },
        {
            name: "Total Domination",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds"],
            description: "Tears at the mind of a target foe and those near him. Total Domination renders all affected foes helpless, lost in their own minds and unable to defend themselves.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>8</color> seconds and each affected foe will increase the recharge by <color #FF7F27>14.5</color> seconds for a maximum total of <color #FF7F27>240</color> seconds.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Hold",
            icon: "mentalcontrol_freeze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.03
            }
        },
        {
            name: "Terrify",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Fear", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "This power Terrifies foes within a cone area in front of you, causing them to tremble in Fear uncontrollably. The affect is so frightening and overwhelming, that the target takes real damage from the physiological response to this Psionic attack.",
            shortHelp: "Ranged (Cone), DMG(Psionic), Foe Fear(Special)",
            icon: "mentalcontrol_terrify.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 40.0,
                endurance: 20.8,
                cast: 2.03,
                damage: {
                    type: "Psionic",
                    scale: 1.7437
                }
            }
        },
        {
            name: "Mass Confusion",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Confuse", "Controller Archetype Sets"],
            description: "You can cause Mass Confusion within a group of foes, creating chaos. All affected foes within the area will turn and attack each other, ignoring all your allies. If you Confuse your foes before they noticed you, your presence will continue to go unnoticed.<br><br><color #fcfc95>Notes: <br>You will receive diminishedany Experience Points for foes defeated entirely by Confused enemies. <br><br>This power has adaptive recharge. It has a base recharge of <color #FF7F27>8</color> seconds and each affected foe will increase the recharge by <color #FF7F27>14.5</color> seconds for a maximum total of <color #FF7F27>240</color> seconds.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Confuse",
            icon: "mentalcontrol_confuse.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/mind-control'] = CONTROLLER_MIND_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_MIND_CONTROL_POWERSET = CONTROLLER_MIND_CONTROL_POWERSET;
}