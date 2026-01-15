/**
 * Darkness Control
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_DARKNESS_CONTROL_POWERSET = {
    name: "Darkness Control",
    category: "Unknown",
    description: "Darkness Control powerset",
    icon: "darkness-control_set.png",
    powers: [
        {
            name: "Dark Grasp",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Controller Archetype Sets", "Holds", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You cause your target's shadow to wholly envelop them, leaving them held and rendered helpless while suffering from moderate negative energy damage. Even if the target is powerful enough to resist the power's hold effect they will have their chance to hit reduced.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, High DMG(Negative), Foe Hold, -To Hit",
            icon: "darknesscontrol_darkgrasp.png",
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
                    type: "Negative",
                    scale: 4.8335
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Shadowy Binds",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Controller Archetype Sets", "Immobilize", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You take control of your victim's shadow causing it to entangle and bind its owner thus leaving them immobilized and suffering from negative energy damage over time and reducing their chance to hit. Immobilized foes cannot move but can still attack.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Moderate DoT(Negative), Foe Immobilize, -To Hit, -Fly",
            icon: "darknesscontrol_shadowybinds.png",
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
                    type: "Negative",
                    scale: 0.7200000000000001,
                    ticks: 4
                },
                buffDuration: 9.2,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Living Shadows",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Controller Archetype Sets", "Immobilize", "Ranged AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You extend and animate your own shadow causing it to entangle all foes within a long cone pattern in front of you, rendering all affected foes immobilized.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Cone), Minor DoT(Negative), Foe Immobilize, -To Hit, -Fly",
            icon: "darknesscontrol_livingshadows.png",
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
                cast: 1.67,
                dotDamage: {
                    type: "Negative",
                    scale: 0.3429,
                    ticks: 2
                },
                buffDuration: 5.2,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Possess",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Confuse", "Controller Archetype Sets"],
            description: "You cause your targeted foe to be possessed by a dark entity from the Netherworld causing them to be confused for a short period of time. While confused they will be unable to tell the difference between friend or foe and will attack nearby allies.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Target Confuse",
            icon: "darknesscontrol_possess.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.33
            }
        },
        {
            name: "Fearsome Stare",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Controller Archetype Sets", "Fear", "To Hit Debuff"],
            description: "Instills tremendous Fear within a cone area in front of you, causing all affected targets to tremble in Terror uncontrollably.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Foe Fear, -To Hit",
            icon: "darknesscontrol_fearsomestare.png",
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
                cast: 2.03,
                tohitDebuff: 1.5,
                buffDuration: 20.0
            }
        },
        {
            name: "Heart of Darkness",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Controller Archetype Sets", "Melee AoE Damage", "Stuns", "To Hit Debuff", "Universal Damage Sets"],
            description: "In a burst of negative energy you overwhelm the minds of those around you causing them to be disoriented and suffer minor negative energy damage over a short time. Affected targets will also have their chance to hit reduced.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, Foe Disorient, -To Hit, Minor DoT(Negative)",
            icon: "darknesscontrol_heartofdarkness.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.67,
                dotDamage: {
                    type: "Negative",
                    scale: 0.42200000000000004,
                    ticks: 4
                },
                buffDuration: 4.1,
                stun: 1.0,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Haunt",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Fear", "Pet Damage", "Recharge Intensive Pets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You summon a pair of Shades from the Netherworld to harass your target foe. Shades deal moderate damage and they terrorize their victims.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Foe Targeted, Summon Shades",
            icon: "darknesscontrol_haunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 210.0,
                endurance: 10.4,
                cast: 2.33,
                buffDuration: 1.0
            }
        },
        {
            name: "Shadow Field",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Controller Archetype Sets", "Holds", "To Hit Debuff"],
            description: "You blanket a targeted area in darkness immediately holding foes within the field. Any foe who enters this area will have their chance to hit reduced and has a chance to be held for a short period of time.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Target (Location AoE), Foe Hold, -To Hit",
            icon: "darknesscontrol_shadowfield.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 240.0,
                endurance: 15.6,
                cast: 2.67,
                buffDuration: 45.0
            }
        },
        {
            name: "Umbra Beast",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Fear", "Immobilize", "Pet Damage", "Recharge Intensive Pets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You conjure up one of the most fearsome creatures of the Netherworld, the Umbra Beast. This creature will fight beside its summoner using its brutal claw, bite and darkness attacks.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Summon Umbra Beast",
            icon: "darknesscontrol_umbrabeast.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 240.0,
                endurance: 26.0,
                cast: 2.33
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/darkness-control'] = CONTROLLER_DARKNESS_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_DARKNESS_CONTROL_POWERSET = CONTROLLER_DARKNESS_CONTROL_POWERSET;
}