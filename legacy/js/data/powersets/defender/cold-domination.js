/**
 * Cold Domination
 * Character Level: 50
 * Archetype: defender
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DEFENDER_COLD_DOMINATION_POWERSET = {
    name: "Cold Domination",
    category: "Unknown",
    description: "Cold Domination powerset",
    icon: "cold-domination_set.png",
    powers: [
        {
            name: "Ice Shield",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Resist Damage"],
            description: "Casts a rock hard Ice Shield on one of your allies and grants them Defense to Melee, Lethal attacks and damage resistance to Cold and Fire damage. You cannot stack multiple Ice Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Glacial Shield. You cannot use this power on yourself.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Ally +DEF(Melee, Smash, Lethal), Res(Cold, Fire)",
            icon: "colddomination_iceshield.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 1.25,
                            ticks: 120
                        },
                        {
                            type: "Fire",
                            scale: 1.0,
                            ticks: 120
                        }
                    ]
                },
                buffDuration: 240.0
            }
        },
        {
            name: "Infrigidate",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Slow Movement"],
            description: "Fires a frigid beam of cold at a single target. This beam dramatically reduces the targets attack rate, movement speed and Defense. Infrigidate draws so much heat out of the target that the damage of any of its Fire attacks will be reduced.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged Foe -Speed, -Recharge, -DEF, -DMG (Fire)",
            icon: "colddomination_infrigidate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 10.4,
                cast: 1.0,
                dotDamage: {
                    type: "Fire",
                    scale: 3.0,
                    ticks: 10
                },
                buffDuration: 20.0,
                defenseDebuff: 2.5
            }
        },
        {
            name: "Snow Storm",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Slow Movement"],
            description: "While active, the chill from this Snow Storm can dramatically Slow the attack and movement speed of the target and all nearby foes. The torrent winds of the Snow Storm are enough to bring down flying foes.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Ranged (Targeted AoE), Foe -Speed, -Recharge, -Fly",
            icon: "colddomination_snowstorm.png",
            powerType: "Toggle",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 0.26,
                cast: 2.03,
                buffDuration: 0.75
            }
        },
        {
            name: "Glacial Shield",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Resist Damage"],
            description: "Envelopes an ally in gleaming Glacial Ice. Its crystalline structure has refracting properties that grants the target good Defense against Area Effect, Ranged, Energy and Negative Energy attacks. Glacial Shield also grants the target some damage resistance to Cold. You cannot stack multiple Glacial Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Ice Shield. You cannot use this power on yourself.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Ally +DEF(Ranged, AoE, Energy, Negative), Res(Cold)",
            icon: "colddomination_glaciate.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    type: "Cold",
                    scale: 1.25,
                    ticks: 120
                },
                buffDuration: 240.0
            }
        },
        {
            name: "Frostwork",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Covers an ally in a thick layer of Frost. The frost can absorb the impact from enemy attacks, effectively increasing your ally's maximum Hit Points for a short time. Frostwork also grants your ally resistance to Toxic Damage.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Target +Max HP, Res(Toxic)",
            icon: "colddomination_frostwork.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 60.0,
                endurance: 14.56,
                cast: 1.17,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 60
                },
                buffDuration: 120.0
            }
        },
        {
            name: "Arctic Fog",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Resist Damage"],
            description: "Your mastery of Cold allows you to hide yourself and all nearby allies within thick Arctic Fog. Arctic Fog makes you and your allies harder to see and increases your Defense to area effect, melee and ranged attacks, as well as your resistance to Slow, Fire, Cold, and Energy damage.",
            shortHelp: "Toggle: PBAoE, Team Stealth, +DEF, +Res(Fire, Cold, Energy, Slow)",
            icon: "colddomination_arcticfog.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 0.26,
                cast: 1.87,
                buffDuration: 0.75
            }
        },
        {
            name: "Benumb",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "Numbs a single target to its very core. Benumb reduces the target's core body temperature, dramatically weakening them. A Benumbed target's Damage and Regeneration Rate are greatly reduced. Additionally, the affected target's secondary power effects are all weakened. The target's powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all weakened.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged Foe -DMG, -END, -Regeneration, -Special",
            icon: "colddomination_benumb.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 120.0,
                endurance: 13.0,
                cast: 2.07,
                buffDuration: 30.0
            }
        },
        {
            name: "Sleet",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defender Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Summons a Sleet Storm at a targeted location. Sleet deals minimal Cold damage to anything that passes through the storm. It also Slows the affected foes and severely reduces their Defense and resistance to damage. Many foes may even slip and fall trying to escape the storm.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), Minor DoT(Cold), Foe -Speed, -Recharge, -DEF -Res",
            icon: "colddomination_sleet.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                endurance: 18.2,
                cast: 2.03,
                buffDuration: 15.0
            }
        },
        {
            name: "Heat Loss",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Slow Movement"],
            description: "Heat Loss drains the heat from your enemies and transfers that energy to your allies in the form of Endurance. All foes near the selected target may experience a Heat Loss, which will drain their Endurance, Slow them, and reduce their Damage Resistance. Each enemy target that is successfully drained of Heat will expel that energy to all your nearby allies, granting them Endurance and a boost to their Endurance Recovery. Some Endurance and Recovery will also be transferred directly to you and any allies near you.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Ranged (Foe AoE), Foe -RES, -END, Slow; Team +END, +Recovery",
            icon: "colddomination_heatloss.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 360.0,
                endurance: 15.6,
                cast: 2.17
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['defender/cold-domination'] = DEFENDER_COLD_DOMINATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DEFENDER_COLD_DOMINATION_POWERSET = DEFENDER_COLD_DOMINATION_POWERSET;
}