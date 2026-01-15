/**
 * Beam Rifle
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_BEAM_RIFLE_POWERSET = {
    name: "Beam Rifle",
    category: "Unknown",
    description: "Beam Rifle powerset",
    icon: "beam-rifle_set.png",
    powers: [
        {
            name: "Charged Shot",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "By charging up your Beam Rifle, you're able to launch a concentrated blast of energy at your foe to cause High Energy damage. The impact strikes with such force that it can knock your target off of their feet. Charge Shot causes additional damage if the target is suffering from the Disintegrating effect. In addition, targets already affected by the Disintegrating effect have a chance to spread to 3 nearby targets. This Disintegrate Spread effect can only hit targets that aren't already affected by the Disintegrating effect. Disintegrate Spread causes Minor Energy damage over time.",
            shortHelp: "Ranged, DMG(Energy), Foe Knockdown, Special",
            icon: "beamrifle_chargedshot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 7.5870999999999995
                }
            }
        },
        {
            name: "Single Shot",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You fire a single blast from your Beam Rifle which deals Moderate Energy damage and has a chance to knock the target down. If the target is suffering from the Disintegrating effect, Single Shot will reduce the target's regeneration rate slightly. In addition, targets already affected by the Disintegrating effect have a chance to spread to 3 nearby targets. This Disintegrate Spread effect can only hit targets that aren't already affected by the Disintegrating effect. Disintegrate Spread causes Minor Energy damage over time.",
            shortHelp: "Ranged, DMG(Energy), Foe Knockdown, Special",
            icon: "beamrifle_singleshot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Energy",
                    scale: 4.5198
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Cutting Beam",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Corruptor Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You fire a constant stream of energy from your weapon and sweep it in a broad arc blasting all foes in a wide cone in front of you. Cutting beam deals Moderate Energy damage and reduces the targets' Defense. This power will cause Minor Energy damage over time if the target is suffering from the Disintegrating effect.",
            shortHelp: "Ranged (Cone), DMG(Energy), Foe -Def(All), Special",
            icon: "beamrifle_cuttingbeam.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.05,
                range: 50.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.9,
                damage: {
                    type: "Energy",
                    scale: 3.5766
                },
                dotDamage: {
                    type: "Energy",
                    scale: 0.1966,
                    ticks: 2
                },
                buffDuration: 2.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Disintegrate",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "You fire a stream of energy at your foe which causes them to slowly disintegrate and suffer High Energy damage over time. Even after the damage over time effect wears off the target will have their regeneration rate reduced and suffer from the Disintegration effect for an additional period of time. Using Beam Rifle powers on targets affected by Disintegrate will inflict additional effects. Additionally if Single Shot, Charged Shot, Lancer Shot and Penetrating Ray are used on a target suffering from Disintegrating, they have a chance to cause this effect to spread to up 3 nearby targets that aren't already suffering from Disintegrating. Targets affected by this Disintegrate Spread will also suffer some Minor Energy damage over time.",
            shortHelp: "Ranged, DoT(Energy), Foe -Regen, Special",
            icon: "beamrifle_disintegrate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.9,
                damage: {
                    type: "Energy",
                    scale: 3.8059000000000003
                },
                dotDamage: {
                    type: "Energy",
                    scale: 0.45030000000000003,
                    ticks: 9
                },
                buffDuration: 10.5
            }
        },
        {
            name: "Aim",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.",
            shortHelp: "Self +To-hit, +DMG",
            icon: "beamrifle_aim.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.625,
                damageBuff: 0.425,
                buffDuration: 10.0
            }
        },
        {
            name: "Lancer Shot",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Stuns", "Universal Damage Sets"],
            description: "You charge up your Beam Rifle and deliver an incredibly focused ray of energy at a nearby foe that deals Superior Energy damage and will briefly stun the target. Lancer Shot will cause additional damage if the target is suffering from the Disintegrating effect. In addition, targets already affected by the Disintegrating effect have a chance to spread to 3 nearby targets. This Disintegrate Spread effect can only hit targets that aren't already affected by the Disintegration effect. Disintegrate Spread causes Minor Energy damage over time.",
            shortHelp: "Ranged, DMG(Energy), Foe Stun, Special",
            icon: "beamrifle_lancershot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 80.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.9,
                damage: {
                    type: "Energy",
                    scale: 9.4378
                },
                stun: 3.0
            }
        },
        {
            name: "Penetrating Ray",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "You take careful aim at your target and deliver a punishing supercharged shot from your Beam Rifle. This causes Extreme Energy damage and may knock the target off their feet. If the target is also suffering from the Disintegrating effect it will also suffer additional damage over time. Like all Sniper attacks it will be interrupted if you're attacked. In addition, targets already affected by the Disintegrating effect will cause this effect to spread to 3 nearby targets. This Disintegrate Spread effect can only hit targets that aren't already affected by the Disintegrating effect. Disintegrate Spread causes Minor Energy damage over time. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Energy), Foe Knockdown, Special",
            icon: "beamrifle_penetratingray.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 150.0,
                recharge: 12.0,
                endurance: 14.352,
                cast: 1.67
            }
        },
        {
            name: "Piercing Beam",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You release a supercharged beam in a narrow cone of energy that pierces through up to 3 enemies. Piercing Beam deals High Energy damage and briefly reduces their damage resistance. If a target struck by Piercing Beam is suffering from the Disintegrating effect it will immediately suffer additional damage.",
            shortHelp: "Narrow Ranged (Cone), DMG(Energy), Foes -Res, Special",
            icon: "beamrifle_piercingbeam.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 3,
            arc: 0.0873,
            effects: {
                accuracy: 1.05,
                range: 80.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.33,
                damage: {
                    type: "Energy",
                    scale: 10.7133
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Overcharge",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Corruptor Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "You overcharge your Beam Rifle and release a massive blast of energy at a group of distant foes causing Extreme Energy damage, causing Minor Energy damage over time, reducing the defense of all affected foes and potentially stunning affected foes. If Overcharge strikes a target suffering from the Disintegrating effect they will be affected by a longer stun.",
            shortHelp: "Ranged (Targeted AoE), DMG(Energy), Foe Minor DoT (Energy), -Def(All), Disorient, Special",
            icon: "beamrifle_overcharge.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.4,
                range: 80.0,
                recharge: 125.0,
                endurance: 20.8,
                cast: 2.9,
                damage: {
                    type: "Energy",
                    scale: 6.3566
                },
                dotDamage: {
                    type: "Energy",
                    scale: 0.1,
                    ticks: 4
                },
                buffDuration: 4.1,
                defenseDebuff: 1.5,
                stun: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/beam-rifle'] = CORRUPTOR_BEAM_RIFLE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_BEAM_RIFLE_POWERSET = CORRUPTOR_BEAM_RIFLE_POWERSET;
}