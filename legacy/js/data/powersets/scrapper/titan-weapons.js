/**
 * Titan Weapons
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_TITAN_WEAPONS_POWERSET = {
    name: "Titan Weapons",
    category: "Unknown",
    description: "Titan Weapons powerset",
    icon: "titan-weapons_set.png",
    powers: [
        {
            name: "Crushing Blow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You swing a mighty crushing blow at your opponent dealing High Smashing damage and reducing their defense.",
            shortHelp: "Melee, DMG(Smashing), -DEF",
            icon: "titanweapons_crushingblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 9.0,
                recharge: 8.0,
                endurance: 8.7838,
                cast: 2.0
            }
        },
        {
            name: "Defensive Sweep",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defense Sets", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You take a defensive stance and strike your opponents. Successfully executing this attack will cause light smashing damage to nearby foes, while giving you increased defense against their melee and smashing attacks.<br><br><color #fcfc95>Notes: Defensive Sweep is unaffected by Arc changes.</color>",
            shortHelp: "Melee(Cone), DMG(Smashing), Self +DEF(Melee, Smash)",
            icon: "titanweapons_defensivesweep.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.0944,
            effects: {
                accuracy: 1.0,
                range: 10.0,
                recharge: 4.0,
                endurance: 5.356,
                cast: 2.2
            }
        },
        {
            name: "Titan Sweep",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You make a sweeping slash with your weapon, causing high damage and possibly knocking your opponent down.<br><br><color #fcfc95>Notes: Titan Sweep is unaffected by Arc changes.</color>",
            shortHelp: "Melee (Cone), DMG(Smashing), Foe Knockdown",
            icon: "titanweapons_sweepingstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.0944,
            effects: {
                accuracy: 1.0,
                range: 10.0,
                recharge: 10.0,
                endurance: 10.4982,
                cast: 2.43
            }
        },
        {
            name: "Follow Through",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You Follow Through with a massive attack dealing Superior Smashing damage, knocking your opponent down and possibly stunning them.<br><br><color #fcfc95>Notes: Follow Through requires Momentum in order to be activated.</color>",
            shortHelp: "Melee, DMG(Smashing), Knockdown, Stun, Requires Momentum",
            icon: "titanweapons_followthrough.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 9.0,
                recharge: 10.0,
                endurance: 10.4978,
                cast: 1.1,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 8.870899999999999
                        },
                        {
                            type: "Fire",
                            scale: 0.9702
                        }
                    ],
                    scale: 9.841099999999999
                },
                stun: 3.0
            }
        },
        {
            name: "Build Momentum",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Grants you momentum, moderately increases the amount of damage you deal for a few seconds and slightly increases your chance to hit. Build Momentum grants you Momentum for 10 seconds and it replaces any remaining Momentum you may still have.",
            shortHelp: "Self +DMG, +To Hit, +Momentum",
            icon: "titanweapons_buildup.png",
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
            name: "Confront",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Challenges a foe to attack you. Useful to pull a villain off an ally who finds themselves in over their head. A To Hit check required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged, Foe Taunt",
            icon: "titanweapons_confront.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 3.0,
                cast: 1.67,
                buffDuration: 12.0
            }
        },
        {
            name: "Rend Armor",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You batter your enemy with your mighty weapon dealing Extreme Smashing damage and reducing their resistance to damage as well as their defense to all types of attacks for a short time.",
            shortHelp: "Melee, DMG(Smashing), Foe -Def(All), -Res(All)",
            icon: "titanweapons_shatterarmor.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 9.0,
                recharge: 16.0,
                endurance: 15.6395,
                cast: 2.3
            }
        },
        {
            name: "Whirling Smash",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You perform a powerful Whirling Smash that deals Moderate Smashing damage, and can knock an opponent down.<br><br><color #fcfc95>Notes: Whirling Smash requires Momentum in order to be activated.</color>",
            shortHelp: "PBAoE Melee, DMG(Smashing), Knockdown, Requires Momentum",
            icon: "titanweapons_whirlingslice.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 14.0,
                endurance: 13.9256,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 4.448
                        },
                        {
                            type: "Fire",
                            scale: 0.468
                        }
                    ],
                    scale: 4.916
                }
            }
        },
        {
            name: "Arc of Destruction",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You swing your weapon in a devastating Arc of Destruction that deals Superior Smashing damage and has a good chance to knock foes down. Arc of Destruction may only be used while on the ground.<br><br><color #fcfc95>Notes: Arc of Destruction is unaffected by Arc changes.</color>",
            shortHelp: "Melee (Cone), DMG(Smashing), Foe Knockback",
            icon: "titanweapons_arcofdestruction.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.0944,
            effects: {
                accuracy: 1.0,
                range: 10.0,
                recharge: 16.0,
                endurance: 15.6395,
                cast: 2.7
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/titan-weapons'] = SCRAPPER_TITAN_WEAPONS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_TITAN_WEAPONS_POWERSET = SCRAPPER_TITAN_WEAPONS_POWERSET;
}