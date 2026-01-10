/**
 * Pain Domination
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_PAIN_DOMINATION_POWERSET = {
    name: "Pain Domination",
    category: "Unknown",
    description: "Pain Domination powerset",
    icon: "pain-domination_set.png",
    powers: [
        {
            name: "Nullify Pain",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Nullify Pain will heal nearby allies for some hit points by numbing the pain caused by their wounds. Nullify Pain is not as potent as Soothe, but can heal multiple targets at once.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "PBAoE, Team +Heal",
            icon: "paindomination_nullifypain.png",
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
            name: "Soothe",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You heal an ally by numbing their pain and calming their mind. You cannot use this power on yourself.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ally Heal",
            icon: "paindomination_soothe.png",
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
            name: "Share Pain",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Share Pain draws away some of an ally's anguish caused by their wounds, but damages the user. The pain caused by this power causes the user to go into a frenzy, briefly increasing their damage output, however the user cannot be healed and will have their regeneration rate greatly diminished for a short time.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ally Strong Heal, Self Moderate DMG(Special), +DMG",
            icon: "paindomination_sharepain.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 0.52,
                cast: 2.27,
                buffDuration: 15.0
            }
        },
        {
            name: "Conduit of Pain",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification"],
            description: "You revive a fallen ally by becoming a Conduit of Pain and transferring the pain that was inflicted upon them back upon your enemies. This will briefly empower you increasing your damage output, recovery rate, attack rate and chance to hit. After a minute the effect will wear off leaving you weakened for 30 seconds. Your damage, attack rate and chance to hit will all be reduced during this period.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ally Rez, Self +DMG, +Recharge, +Recovery, +To Hit, +Special",
            icon: "paindomination_conduitofpain.png",
            powerType: "Click",
            targetType: "Player Ally (Dead)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 15.0,
                recharge: 180.0,
                endurance: 26.0,
                cast: 3.2,
                buffDuration: 0.5,
                tohitBuff: 2.0,
                tohitDebuff: 2.0
            }
        },
        {
            name: "Enforced Morale",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Enforced Morale frees an ally from any Disorient, Hold, Sleep, Fear, Confuse and Immobilize effects and leaves them resistant to such effects for a good while. Also, Enforced Morale grants the target clearer Perception to see hidden foes, and a minor recharge and movement speed boost. The Protection and Movement boosts will improve with multiple applications and as you advance in level, although the Recharge and Movement boosts will only apply for the first few applications. If the ally is not damaged, Enforced Morale will cause them some pain before granting its benefits.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confuse), +Perception, +Recharge, +Speed, Light DMG",
            icon: "paindomination_enforcedmorale.png",
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
            name: "Soothing Aura",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "While this power is active all nearby allies will be healed by Soothing Aura every couple of seconds for a small portion of their health.<br><br><color #fcfc95>Notes: While on PvP maps this power will grant affected targets a regeneration effect instead of a periodic heal.).</color><br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: PBAoE, Team Minor Periodic Heal",
            icon: "paindomination_soothingaura.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.78,
                cast: 1.67
            }
        },
        {
            name: "World of Pain",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Resist Damage", "To Hit Buff"],
            description: "When this power is activated the user and all nearby team members will gain a moderate damage, resistance, and To Hit bonus. Additionally those affected by this power will also be protected from Placate effects.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE Team +To Hit, +DMG, +RES(All DMG, Placate)",
            icon: "paindomination_worldofpain.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 240.0,
                endurance: 10.192,
                cast: 2.03,
                tohitBuff: 1.0,
                buffDuration: 90.0
            }
        },
        {
            name: "Anguishing Cry",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff"],
            description: "You let out an Anguishing Cry causing a great deal of pain in your foes reducing their resistance and defense to damage for a short time.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, Foe -RES(All), -DEF(All)",
            icon: "paindomination_anguishingcry.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 120.0,
                endurance: 13.0,
                cast: 1.97,
                defenseDebuff: 3.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Painbringer",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You transform an ally to pain incarnate turning them into an inexhaustible killing machine. While the character is imbued with this power they will benefit from incredible health regeneration, endurance recovery and improved damage potential for a short time.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Ally, +Regeneration, +Recovery, +DMG",
            icon: "paindomination_painbringer.png",
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
    POWERSETS['corruptor/pain-domination'] = CORRUPTOR_PAIN_DOMINATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_PAIN_DOMINATION_POWERSET = CORRUPTOR_PAIN_DOMINATION_POWERSET;
}