/**
 * Arsenal Control
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_ARSENAL_CONTROL_POWERSET = {
    name: "Arsenal Control",
    category: "Unknown",
    description: "Arsenal Control powerset",
    icon: "arsenal-control_set.png",
    powers: [
        {
            name: "Cryo Freeze Ray",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "The Cryo Freeze Ray encases your foe in a block of ice, holding him helpless in place for a while and dealing some cold damage.",
            shortHelp: "Ranged, DMG(Cold), Foe Hold, -SPD, -Recharge, -Fly",
            icon: "arsenalcontrol_beanbag.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.25,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Cold",
                    scale: 2.8890000000000002
                },
                buffDuration: 12.0
            }
        },
        {
            name: "Tranquilizer",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Ranged Damage", "Sleep", "Slow Movement", "Universal Damage Sets"],
            description: "The Tranquilizing Dart is the perfect tool to sideline a single foe. It deals some toxic damage and can render the target unconscious, allowing you to focus on more important targets. The target remains asleep for some time, but will awaken if attacked.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
            shortHelp: "Ranged, DMG(Toxic), Foe Sleep, -SPD",
            icon: "arsenalcontrol_tranquilizer.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.15,
                range: 80.0,
                recharge: 6.0,
                endurance: 5.2,
                cast: 1.4,
                damage: {
                    type: "Toxic",
                    scale: 1.54
                },
                buffDuration: 5.0
            }
        },
        {
            name: "Sleep Grenade",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Ranged AoE Damage", "Sleep", "Slow Movement", "Universal Damage Sets"],
            description: "The Sleep Grenade can be launched at long range from beneath the barrel of your Assault Rifle. It releases a cloud of gas that will make enemies drowsy, slow, and fall asleep.",
            shortHelp: "Ranged (Location AoE), DMG(Toxic), Foe Sleep, -SPD, -Recharge, -Fly",
            icon: "arsenalcontrol_sleepgrenade.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.05,
                range: 80.0,
                recharge: 45.0,
                endurance: 15.6,
                cast: 1.87,
                buffDuration: 30.0
            }
        },
        {
            name: "Liquid Nitrogen",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "The Liquid Nitrogen dispenser can spray a target location with liquid nitrogen creating a large patch of ice. Those caught in the patch of ice are dramatically slowed, tend to fall down taking damage, and will be unable to jump.",
            shortHelp: "Ranged (Location AoE), DoT(Cold), Knockdown, -SPD",
            icon: "arsenalcontrol_liquidnitrogen.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 90.0,
                endurance: 10.4,
                cast: 2.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Cloaking Device",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "This Cloaking Device is the ultimate in infiltration technology. It uses an LCD body coating to become all but impossible to detect. While concealed you can only be seen at very close range. If you attack while concealed, you will be discovered. Even if discovered, you are hard to see but will retain some of your Defense bonus to all attacks.",
            shortHelp: "Toggle: Self Stealth, +DEF(All)",
            icon: "arsenalcontrol_cloakingdevice.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.182,
                cast: 0.73,
                buffDuration: 0.75
            }
        },
        {
            name: "Smoke Canister",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Confuse", "Dominator Archetype Sets", "To Hit Debuff"],
            description: "The Smoke Canister is a powerful infiltration tool. Fling it at a target location and it will quickly cover the area in smoke. While engulfed within this smoke, most enemies will not be able to see past normal melee range, although some may have better perception. If the foes are attacked, they will become confused and might attack their allies.",
            shortHelp: "Ranged (Location AoE), Foe -Perception, -To Hit, Confuse",
            icon: "arsenalcontrol_smokegrenade.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.05,
                range: 80.0,
                recharge: 90.0,
                endurance: 16.64,
                cast: 1.4,
                buffDuration: 30.0
            }
        },
        {
            name: "Flash Bang",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Dominator Archetype Sets", "Ranged AoE Damage", "Stuns", "To Hit Debuff", "Universal Damage Sets"],
            description: "The Flash Bang Grenade is ideal to disorient a group of enemies. Even enemies that are not disoriented will have their chance to hit reduced.",
            shortHelp: "Ranged (Targeted AoE), DMG(Energy), Disorient, -To Hit",
            icon: "arsenalcontrol_flashbang.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.85,
                range: 70.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.87,
                damage: {
                    type: "Energy",
                    scale: 0.25
                },
                tohitDebuff: 0.5,
                buffDuration: 20.0,
                stun: 4.0
            }
        },
        {
            name: "Tear Gas",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "The Tear Gas canister serves as the ultimate crowd control tool, rendering enemies incapacitated and choking, thereby preventing them from taking any action while also debuffing their damage output.",
            shortHelp: "Ranged (Location AoE), DoT(Toxic), Foe Hold -DMG",
            icon: "arsenalcontrol_teargas.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 180.0,
                endurance: 15.6,
                cast: 1.87,
                buffDuration: 60.0
            }
        },
        {
            name: "Tri-Cannon",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Pet Damage", "Recharge Intensive Pets", "Threat Duration", "Universal Damage Sets"],
            description: "The Tri-Cannon is the perfect companion in the field. It has an extremely fast fire rate and is equipped with a customized tracking system. Once locked on, it will continue to unload a volley of lead into the target until it is destroyed. Enemies around the Tri-Cannon, as well as those hit by it, will prioritize attacking it over its owner. It is armored and can take significant amounts of damage.",
            shortHelp: "Build Tri-Cannon: Ranged, DMG(Lethal)",
            icon: "arsenalcontrol_gunturret.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 240.0,
                endurance: 26.0,
                cast: 1.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/arsenal-control'] = DOMINATOR_ARSENAL_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_ARSENAL_CONTROL_POWERSET = DOMINATOR_ARSENAL_CONTROL_POWERSET;
}