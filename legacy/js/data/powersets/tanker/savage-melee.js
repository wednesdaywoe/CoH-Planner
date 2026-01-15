/**
 * Savage Melee
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_SAVAGE_MELEE_POWERSET = {
    name: "Savage Melee",
    category: "Unknown",
    description: "Savage Melee powerset",
    icon: "savage-melee_set.png",
    powers: [
        {
            name: "Savage Leap AoE",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: [],
            description: "You throw yourself at your distant foes while slashing and tearing wildly dealing moderate lethal damage and causing your foes to suffer from additional minor lethal damage over time. The damage of this power can increase based on how far away you leap from, with up to double damage dealt at its strongest. Savage Leap build 1 stacks of Blood Frenzy for every 20 ft in between your target and you, up to 3 stacks.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, DMG(Lethal), Foe DoT (Lethal), +3 Blood Frenzy, Self Teleport",
            icon: "savagemelee_savageleap.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 1000.0,
                recharge: 40.0,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.095
                        },
                        {
                            type: "Fire",
                            scale: 0.38
                        }
                    ],
                    scale: 1.475
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.08810000000000001,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Rending Flurry Large",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                cast: 2.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.309
                        },
                        {
                            type: "Fire",
                            scale: 0.532
                        }
                    ],
                    scale: 2.841
                }
            }
        },
        {
            name: "Rending Flurry Normal",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                cast: 2.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.309
                        },
                        {
                            type: "Fire",
                            scale: 0.532
                        }
                    ],
                    scale: 2.841
                }
            }
        },
        {
            name: "Savage Melee",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "Savage Melee",
            shortHelp: "Savage Melee",
            icon: "savage_melee_set.png"
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/savage-melee'] = TANKER_SAVAGE_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_SAVAGE_MELEE_POWERSET = TANKER_SAVAGE_MELEE_POWERSET;
}