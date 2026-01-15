/**
 * Sonic Resonance
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_SONIC_RESONANCE_POWERSET = {
    name: "Sonic Resonance",
    category: "Unknown",
    description: "Sonic Resonance powerset",
    icon: "sonic-resonance_set.png",
    powers: [
        {
            name: "Sonic Barrier",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "This shield dramatically reduces the damage an ally takes from Smashing, Lethal, and Toxic attacks for a limited time. You cannot stack multiple Sonic Barriers on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Sonic Haven. You cannot use this power on yourself.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Ally +Res(Smash, Lethal, Toxic)",
            icon: "sonicdebuff_protectphysical.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.0,
                endurance: 9.75,
                cast: 1.33,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Lethal",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Toxic",
                            scale: 2.0,
                            ticks: 120
                        }
                    ]
                },
                buffDuration: 240.0
            }
        },
        {
            name: "Sonic Siphon",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "By setting up a constant vibration within the body of your foe, you weaken their Damage Resistance. Affected targets will take more damage from successful attacks.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe -Res(All)",
            icon: "sonicdebuff_debuffdamres.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 16.0,
                endurance: 10.66,
                cast: 2.17,
                buffDuration: 30.0
            }
        },
        {
            name: "Sonic Haven",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "This shield dramatically reduces the damage an ally takes from Fire, Cold, Energy, and Negative Energy attacks for a limited time. You cannot stack multiple Sonic Havens on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Sonic Barrier. You cannot use this power on yourself.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Ally +Res(Fire, Cold, Energy, Negative Energy)",
            icon: "sonicdebuff_protectelements.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.0,
                endurance: 9.75,
                cast: 1.33,
                dotDamage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Cold",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Energy",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Negative",
                            scale: 2.0,
                            ticks: 120
                        }
                    ]
                },
                buffDuration: 240.0
            }
        },
        {
            name: "Sonic Cage",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "Encases the target in an impenetrable field of sonic waves. The target cannot attack or be attacked.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe Capture (Special)",
            icon: "sonicdebuff_hold.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.4,
                range: 80.0,
                recharge: 60.0,
                endurance: 15.6,
                cast: 1.67,
                buffDuration: 30.0
            }
        },
        {
            name: "Disruption Field",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "You set up a constant wave of sonic energy around an ally, weakening the Damage Resistance of all nearby foes.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Ranged (Target Ally AoE), Foe -Res",
            icon: "sonicdebuff_teamdebuffdamres.png",
            powerType: "Toggle",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 8.0,
                endurance: 0.325,
                cast: 2.7,
                buffDuration: 0.75
            }
        },
        {
            name: "Sonic Dispersion",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You create a large field of sonic waves, protecting all allies inside. The Sonic Dispersion gives all allies within increased Resistance against all damage except Psionic. The Sonic Bubble also protects allies from Immobilization, Disorient, and Hold effects.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Toggle: PBAoE, Ally +Res(All DMG except Psionic, Hold, Immobilize, Disorient)",
            icon: "sonicdebuff_buffdamageres.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 1.3,
                cast: 2.03,
                buffDuration: 2.25,
                stun: 1.0,
                stunDuration: 2.25
            }
        },
        {
            name: "Sonic Repulsion",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Knockback"],
            description: "You create a powerful sonic resonance around an ally, repelling all foes nearby. You will lose endurance for each target repelled.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Ranged (Target Ally AoE), Foe Knockback",
            icon: "sonicdebuff_teamknockback.png",
            powerType: "Toggle",
            targetType: "Leaguemate (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 8.0,
                endurance: 0.4063,
                cast: 2.33,
                buffDuration: 0.5
            }
        },
        {
            name: "Clarity",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "By bouncing a carefully pitched sound wave off an ally's ear drum, you can free him from any Disorient, Hold, Sleep, Confusion, Fear, and Immobilize effects, and leave them resistant to such effects for a good while. Protection will improve with multiple applications and as you advance in level. Clarity also provides your ally's enhanced perception.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confusion), +Perception",
            icon: "sonicdebuff_dispel.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 4.0,
                endurance: 6.5,
                cast: 1.5,
                stun: 1.0,
                stunDuration: 90.0,
                buffDuration: 90.0
            }
        },
        {
            name: "Liquefy",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate To-Hit Debuff", "Defense Debuff", "Holds", "Knockback", "Ranged AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You unleash a barrage of sonic waves on the Earth itself, generating a powerful, localized earthquake. Most foes that pass through the location will fall down. The violent shaking also reduces their chance to hit and Defense.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Ranged (Location AoE), Foe Knockback, Hold, -To Hit, -DEF",
            icon: "sonicdebuff_dropknockback.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 150.0,
                endurance: 23.4,
                cast: 2.67,
                buffDuration: 30.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/sonic-resonance'] = MASTERMIND_SONIC_RESONANCE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_SONIC_RESONANCE_POWERSET = MASTERMIND_SONIC_RESONANCE_POWERSET;
}