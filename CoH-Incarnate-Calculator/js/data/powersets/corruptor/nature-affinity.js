/**
 * Nature Affinity
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_NATURE_AFFINITY_POWERSET = {
    name: "Nature Affinity",
    category: "Unknown",
    description: "Nature Affinity powerset",
    icon: "nature-affinity_set.png",
    powers: [
        {
            name: "Corrosive Enzymes",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "You spray a target with toxic, corrosive Enzymes reducing the damage they deal as well as their damage resistance.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe -Res(All), -DMG(All)",
            icon: "natureaffinity_corrosivesap.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 16.0,
                endurance: 8.528,
                cast: 1.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Regrowth",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "By channeling the energies present in nature you are able to immediately heal yourself and allies in front of you for a small amount of health and cause them to recover a small amount of health over time. Regrowth places a stack of Bloom on its target.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged Facing Cone, Minor Ally Heal, Ally Moderate Healing Over Time, +1 Bloom",
            icon: "natureaffinity_regrowth.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "Cone",
            maxTargets: 255,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 45.0,
                recharge: 10.0,
                endurance: 13.52,
                cast: 2.0,
                buffDuration: 4.1
            }
        },
        {
            name: "Wild Growth",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "You channel the power of nature into your allies allowing them to more easily shrug off damage and causing their wounds to heal more quickly. Wild Growth increases the damage resistance and boosts the regeneration rate of all affected allies. This power also grants 2 stacks of Bloom.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, Team +Res(All), +Regen, +2 Bloom",
            icon: "natureaffinity_wildgrowth.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 225.0,
                endurance: 15.6,
                cast: 2.17,
                buffDuration: 90.0
            }
        },
        {
            name: "Spore Cloud",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["To Hit Debuff"],
            description: "You create a large cloud of toxic spores around your targeted foe. The target and all nearby foes will have their damage output, chance to hit and regeneration rate reduced.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle (Targeted AoE), Foe -Dmg(All), -To Hit, -Regen",
            icon: "natureaffinity_sporecloud.png",
            powerType: "Toggle",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 8.0,
                endurance: 0.26,
                cast: 3.1,
                tohitDebuff: 1.5,
                buffDuration: 0.75
            }
        },
        {
            name: "Lifegiving Spores",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "When activating this power you cause all allies at a selected location to recover a small amount of health and endurance every few seconds as long as they remain within the Lifegiving Spores.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle (Location AoE), PBAoE +Minor Heal Over Time, +Endurance",
            icon: "natureaffinity_lifegivingspores.png",
            powerType: "Toggle",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 0.26,
                cast: 2.33
            }
        },
        {
            name: "Wild Bastion",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You encase yourself and nearby allies in a protective barrier that will absorb a moderate amount of damage. Additionally, affected allies will heal for a portion of their health over time. Wild Bastion places 3 stacks of Bloom on all affected targets.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, Team +Absorb, +Heal Over Time, +3 Bloom",
            icon: "natureaffinity_wildbastion.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 240.0,
                endurance: 13.0,
                cast: 2.27,
                buffDuration: 60.0
            }
        },
        {
            name: "Rebirth",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "Rebirth can either greatly heal a conscious ally for a large amount of health over time or it can revive a fallen ally with a large amount of health and endurance and cause them to recover health over time. This power also grants 3 stacks of Bloom.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged, Ally Rez, +Heal Over Time, Special, +3 Bloom",
            icon: "natureaffinity_rebirth.png",
            powerType: "Click",
            targetType: "Leaguemate",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 45.0,
                recharge: 180.0,
                endurance: 26.0,
                cast: 3.0
            }
        },
        {
            name: "Entangling Aura",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Holds"],
            description: "While this power is active there is a high chance that entangling vines will grasp nearby foes and render them held for a short time.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Toggle, Foe Hold",
            icon: "natureaffinity_ragingtempest.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 1.3,
                cast: 2.03
            }
        },
        {
            name: "Overgrowth",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Becoming a conduit of nature itself, you greatly boost the damage, to hit and endurance discount of nearby allies for a long period of time. Overgrowth also grants the affected targets 5 stacks of Bloom.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "PBAoE, Team +Damage, +To Hit, +Endurance Discount, +5 Bloom",
            icon: "natureaffinity_overgrowth.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 255.0,
                endurance: 26.0,
                cast: 3.0,
                tohitBuff: 1.0,
                buffDuration: 60.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/nature-affinity'] = CORRUPTOR_NATURE_AFFINITY_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_NATURE_AFFINITY_POWERSET = CORRUPTOR_NATURE_AFFINITY_POWERSET;
}