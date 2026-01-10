/**
 * Savage Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_SAVAGE_ASSAULT_POWERSET = {
    name: "Savage Assault",
    category: "Unknown",
    description: "Savage Assault powerset",
    icon: "savage-assault_set.png",
    powers: [
        {
            name: "Call Swarm",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You summon a swarm of stinging insects to harass your foe causing Light Lethal damage over time and reducing both their movement speed and defense. This power grants 1 stack of Blood Frenzy.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, DoT (Lethal), Foe -Defense, -Speed, +1 Blood Frenzy",
            icon: "savagemelee_callswarm.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.46,
                cast: 1.0,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.47219999999999995,
                    ticks: 4
                },
                buffDuration: 3.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Maiming Slash",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You execute a savage slash at your foe's lower body causing moderate lethal damage and minor damage over time. The foe will also have their movement speed reduced moderately. Maiming Slash grants 1 stack of Blood Frenzy.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Melee, DMG(Lethal), DoT (Lethal), Foe -Speed, +1 Blood Frenzy",
            icon: "savagemelee_maimingslash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.03,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 2.5793
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.3226,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Vicious Slash",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "You tear at your foe with both hands dealing high lethal damage and causing minor lethal damage over time. Foes struck by this attack have a high chance to be knocked down. Vicious Slash grants 2 stacks of Blood Frenzy.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, DMG(Lethal), Foe DoT (Lethal), Knockdown, Self +2 Blood Frenzy",
            icon: "savagemelee_viciousslash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.67,
                damage: {
                    type: "Lethal",
                    scale: 4.129300000000001
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.5423,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Unkindness",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "With a mighty roar, you command an unkindness of ravens to quickly assault and harass your foes. Your foes will suffer Moderate Lethal damage over time and have their speed and defense reduced. The power inflicts lethal damage over time that scales in strength with the number Blood Frenzy stacks. This power grants 2 stacks of Blood Frenzy.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), DoT (Lethal), Foe -Speed, -Defense, -Fly, +2 Blood Frenzy",
            icon: "savagemelee_callravens.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.155,
                range: 40.0,
                recharge: 14.0,
                endurance: 16.9,
                cast: 2.0,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.4924,
                    ticks: 4
                },
                buffDuration: 3.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Spot Prey",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases perception and chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit, +Perception",
            icon: "savagemelee_aim.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 5.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Rending Flurry",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Universal Damage Sets"],
            description: "You wildly slash at nearby foes to deal moderate lethal damage and cause minor lethal damage over time. This power consumes all Blood Frenzy and will deal additional damage per stack of Blood Frenzy consumed. If you have 5 stacks of Blood Frenzy while activating this power, its radius is greatly increased, but causes you to become Exhausted for a short time. While exhausted you cannot gain Blood Frenzy.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, DMG(Lethal), Foe DoT (Lethal), -Blood Frenzy",
            icon: "savagemelee_rendingflurry.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.17
            }
        },
        {
            name: "Blood Craze",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You go into a blood craze, making you quickly shrug aside some of the damage received. Blood Craze will immediately heal you for a small amount and cause you to heal for a moderate amount of health over time.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +HP, +Health over Time",
            icon: "savagemelee_bloodthirst.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 7.8,
                cast: 2.0,
                healing: {
                    scale: 101.7352,
                    perTarget: true
                },
                buffDuration: 9.1
            }
        },
        {
            name: "Call Hawk",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You call forth a hawk ally to swoop in and viciously peck at your target causing High Lethal damage. The attack often catches foes off their guard and can knock them down as well as reducing their chance to hit. This power's damage over time effect will scale with the number of stacks of Blood Frenzy. Using this power with 5 stacks of Blood Frenzy causes you to become Exhausted for a short time, but the duration of its damage over time effect is increased. While exhausted you cannot gain Blood Frenzy.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe DoT (Lethal), -To Hit, Knockdown, -Fly",
            icon: "savagemelee_callhawk.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 14.0,
                endurance: 10.9702,
                cast: 1.67,
                dotDamage: {
                    type: "Lethal",
                    scale: 1.4855,
                    ticks: 4
                },
                buffDuration: 1.3,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Feral Charge",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Teleport", "Universal Damage Sets", "Universal Travel"],
            description: "You throw yourself at your target while slashing and tearing wildly dealing moderate lethal damage and causing it to suffer from additional minor lethal damage over time. The damage of this power can increase based on how far away you charge from, with up to double damage dealt at its strongest. Feral Charge builds 1 stacks of Blood Frenzy for every 20 ft in between your target and you, up to 3 stacks.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, DMG(Lethal), Foe DoT (Lethal), +3 Blood Frenzy, Self Teleport",
            icon: "savagemelee_feralcharge.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.19,
                cast: 1.1667
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/savage-assault'] = DOMINATOR_SAVAGE_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_SAVAGE_ASSAULT_POWERSET = DOMINATOR_SAVAGE_ASSAULT_POWERSET;
}