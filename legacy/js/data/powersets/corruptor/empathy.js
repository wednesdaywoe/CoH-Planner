/**
 * Empathy
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_EMPATHY_POWERSET = {
    name: "Empathy",
    category: "Unknown",
    description: "Empathy powerset",
    icon: "empathy_set.png",
    powers: [
        {
            name: "Heal Other",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Heals a single targeted ally. You cannot use this power to heal yourself.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ally Heal",
            icon: "empathy_healother.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 13.0,
                cast: 2.27
            }
        },
        {
            name: "Healing Aura",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Healing Aura restores some Hit Points to you and all nearby heroes. Healing Aura is not as potent as Heal Other, but can heal multiple targets at once.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "PBAoE, Team +Heal",
            icon: "empathy_healingaura.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 8.0,
                endurance: 13.0,
                cast: 2.03
            }
        },
        {
            name: "Absorb Pain",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Dramatically heals an ally's wounds. This power has only a tiny Endurance cost, but it requires you to sacrifice some of your Hit Points. Absorbing someone's pain can be quite dramatic, and afterwards you will be briefly unable to heal your own wounds by any means.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ally Strong Heal, Self Moderate DMG(Special)",
            icon: "empathy_absorbpain.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 0.52,
                cast: 2.27,
                buffDuration: 20.0
            }
        },
        {
            name: "Resurrect",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Resurrects a fallen ally with full Hit Points and Endurance. The Resurrected target is left protected from XP Debt for 90 seconds.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ally Rez",
            icon: "empathy_resurrect.png",
            powerType: "Click",
            targetType: "Player Ally (Dead)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 15.0,
                recharge: 180.0,
                endurance: 26.0,
                cast: 3.2,
                buffDuration: 0.5
            }
        },
        {
            name: "Clear Mind",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Frees an ally from any Disorient, Hold, Sleep, Fear, Confuse and Immobilize effects and leaves them resistant to such effects for a good while. Also, grants target clearer Perception to see hidden foes. Protection will improve with Multiple applications and as you advance in level.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confuse), +Perception",
            icon: "empathy_mindwall.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                stun: 1.0,
                stunDuration: 90.0,
                buffDuration: 90.0
            }
        },
        {
            name: "Fortitude",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Sets", "To Hit Buff"],
            description: "Fortitude immensely enhances a single ally's chance to hit, Damage, and Defense to all attacks.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ally +DEF(All), +DMG, +To Hit",
            icon: "empathy_fortitude.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 60.0,
                endurance: 10.4,
                cast: 2.27,
                tohitBuff: 1.5,
                buffDuration: 120.0
            }
        },
        {
            name: "Recovery Aura",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification"],
            description: "The Recovery Aura dramatically increases the Endurance recovery rate of all nearby heroes for a limited time. Emitting this Aura costs you a lot of Endurance, and it takes a long time to recharge.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "PBAoE, Ally +Recovery",
            icon: "empathy_recoveryaura.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 500.0,
                endurance: 26.0,
                cast: 2.03,
                buffDuration: 90.0
            }
        },
        {
            name: "Regeneration Aura",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "The Regeneration Aura dramatically increases the healing rate of all nearby heroes for a limited time. Emitting this Aura costs you a lot of Endurance, and it takes a long time to recharge.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "PBAoE, Ally +Regeneration",
            icon: "empathy_regenerationaura.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 500.0,
                endurance: 26.0,
                cast: 2.03,
                buffDuration: 90.0
            }
        },
        {
            name: "Adrenalin Boost",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "Dramatically increases an ally's Endurance Recovery, Hit Point Regeneration and attack rate for 90 seconds. Also grants the target high resistance to slow effects.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Ranged, Ally +End, +Regeneration, +Recharge, Res (Slow)",
            icon: "empathy_adrenalinboost.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 300.0,
                endurance: 10.4,
                cast: 2.27,
                buffDuration: 90.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/empathy'] = CORRUPTOR_EMPATHY_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_EMPATHY_POWERSET = CORRUPTOR_EMPATHY_POWERSET;
}