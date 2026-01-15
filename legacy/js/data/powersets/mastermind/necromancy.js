/**
 * Necromancy
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_NECROMANCY_POWERSET = {
    name: "Necromancy",
    category: "Unknown",
    description: "Necromancy powerset",
    icon: "necromancy_set.png",
    powers: [
        {
            name: "Dark Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's chance to hit.<br><br><color #fcfc95>Spectral Forces:</color><br>Activating this power has a chance to summon a Specter to your side! Specters slowly fade away over 90 seconds, even faster when attacking. They cannot be healed, regenerate, upgraded, or commanded, but provide a good distraction. <br><br>Enhancements in this power will also enhance the stats of summoned Specters. You may only have 1 Specter active per Necromancy attack.",
            shortHelp: "Ranged, DMG(Negative), Foe -To Hit",
            icon: "necromancy_darkblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 6.5,
                cast: 1.0,
                damage: {
                    type: "Negative",
                    scale: 2.26
                },
                tohitDebuff: 0.75,
                buffDuration: 6.0
            }
        },
        {
            name: "Zombie Horde",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "To Hit Debuff", "Universal Damage Sets"],
            description: "Summons one to three Zombies (depending on your level) to do your bidding. Zombies are very tough but can be slow and stupid. They start out with only rudimentary melee attacks, but can be empowered with range and even life draining powers.<br><br>You may only have 3 Zombies under your control at any given time. If you attempt to summon more Zombies, you can only replace the ones you have lost in battle. If you already have three, the power will fail.<br><br><color #fcfc95>Notes: Zombie Horde is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Zombies",
            icon: "necromancy_callzombiehorde.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 5.0,
                endurance: 5.46,
                cast: 3.1
            }
        },
        {
            name: "Gloom",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "Gloom slowly drains a target of life, while reducing their chance to hit Slower than Dark Blast, but deals more damage over time.<br><br><color #fcfc95>Spectral Forces:</color><br>Activating this power has a chance to summon a Specter to your side! Specters slowly fade away over 90 seconds, even faster when attacking. They cannot be healed, regenerate, upgraded, or commanded, but provide a good distraction. <br><br>Enhancements in this power will also enhance the stats of summoned Specters. You may only have 1 Specter active per Necromancy attack.",
            shortHelp: "Ranged, DoT (Negative), Foe -To Hit",
            icon: "necromancy_gloom.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 10.66,
                cast: 1.1,
                dotDamage: {
                    type: "Negative",
                    scale: 0.4063,
                    ticks: 7
                },
                buffDuration: 3.6,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Enchant Undead",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "Enchant Undead will permanently bestow new powers and abilities to all of your Undead Henchman. The powers gained are unique and dependent upon the type of Undead Henchman that is Enchanted, but all henchmen will gain Resistances to most forms of crowd control and a variety of damage types.<br><br>Enchant Undead only works on your Undead Henchmen and you can only Enchant your Undead Henchmen once with this power.",
            shortHelp: "Ranged, Enchant Undead Henchman",
            icon: "necromancy_enchantundead.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 6.0,
                endurance: 11.375,
                cast: 2.07
            }
        },
        {
            name: "Life Drain",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can tap the power of the Netherworld to steal some life from a target foe and reduce their chance to hit. Some of that stolen life is transferred to you in the form of Hit Points.<br><br><color #fcfc95>Spectral Forces:</color><br>Activating this power has a chance to summon a Specter to your side! Specters slowly fade away over 90 seconds, even faster when attacking. They cannot be healed, regenerate, upgraded, or commanded, but provide a good distraction. <br><br>Enhancements in this power will also enhance the stats of summoned Specters. You may only have 1 Specter active per Necromancy attack.",
            shortHelp: "Ranged, DMG(Negative), Target -To Hit, Self +HP",
            icon: "necromancy_lifedrain.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 10.66,
                cast: 1.93,
                damage: {
                    type: "Negative",
                    scale: 3.7110000000000003
                },
                healing: {
                    scale: 80.3173,
                    perTarget: true
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Grave Knight",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can summon one to two powerful Grave Knights (depending on your level) to do your bidding. Grave Knights come well equipped with several attack powers and can be empowered with even more.<br><br>You may only have 2 Grave Knights under your control at any given time. If you attempt to summon more Grave Knights, you can only replace the ones you have lost in battle. If you already have two, the power will fail.<br><br><color #fcfc95>Notes: Grave Knight is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Grave Knight",
            icon: "necromancy_summonskeletonwarrior.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 10.0,
                endurance: 9.62,
                cast: 1.07
            }
        },
        {
            name: "Soul Extraction",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "Holds", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can extract the souls from your Undead Henchmen and summon their spectral essence to do your bidding. The power of each soul is dependent upon the type of undead Henchman you extract it from, however it will always be one level lower than you. Unlike your other Henchman, these extracted Souls are only loosely bound to your control and will quickly move on to the next world. <br><br>These Souls cannot gain new powers with Enchanted Undead or Dark Empowerment. If a Soul's original body is defeated then the Soul will also be defeated. If you activate Soul Extraction again while a Soul is active, it will simply be replaced.",
            shortHelp: "Summon Ghost (Special)",
            icon: "necromancy_soulextraction.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 150.0,
                endurance: 15.0,
                cast: 2.03,
                buffDuration: 0.5
            }
        },
        {
            name: "Lich",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Fear", "Holds", "Immobilize", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "To Hit Debuff", "Universal Damage Sets"],
            description: "Summons a dark and powerful Lich. The lich is an undead entity that, when alive, possessed many dark powers of his own. Perhaps it was a dark wizard, or powerful arch villain. Perhaps it was even a Necromancer. Now it only hungers for the souls of the living, and is quite good at feeding itself. The Lich specializes in dark control and draining powers.<br><br>You may only have 1 Lich under your control at any given time. If you attempt to summon another Lich, the power will fail.<br><br><color #fcfc95>Notes: Lich is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Lich",
            icon: "necromancy_summonlitch.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 15.0,
                endurance: 13.18,
                cast: 3.17
            }
        },
        {
            name: "Dark Empowerment",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Dark Empowerment will permanently bestow the most powerful and darkest new powers and abilities to all of your Undead Henchman. The Empowered Undead will gain new abilities and powers. The powers gained are unique and dependent upon the type of Undead Henchman that is Empowered, but all Henchmen will gain additional Hit Points, and the power to steal life force from enemies they attack!<br><br>Dark Empowerment only works on your Undead Henchmen and you can only Empower your Undead Henchmen once with this power.",
            shortHelp: "Ranged, Empower Undead Henchman",
            icon: "necromancy_darkempowerment.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 10.0,
                endurance: 11.375,
                cast: 2.07
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/necromancy'] = MASTERMIND_NECROMANCY_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_NECROMANCY_POWERSET = MASTERMIND_NECROMANCY_POWERSET;
}