/**
 * Demon Summoning
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_DEMON_SUMMONING_POWERSET = {
    name: "Demon Summoning",
    category: "Unknown",
    description: "Demon Summoning powerset",
    icon: "demon-summoning_set.png",
    powers: [
        {
            name: "Corruption",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "You lash out with your whip, firing a bolt of hellfire and corrupting your victim's very living essence. This attack deals minor fire damage, causes minor toxic damage over time, and reduces their damage resistance for a short time.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Fire), Foe Minor DoT (Toxic), -Res",
            icon: "demonsummoning_corruption.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 6.5,
                cast: 1.23,
                damage: {
                    type: "Fire",
                    scale: 2.181
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.15,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Summon Demonlings",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Slow Movement", "Universal Damage Sets"],
            description: "Call forth up to three demonlings (depending on your level) to do your bidding. The first demonling is adept at manipulating fire, the second blasts your foes with cold attacks and the third is able to wield hellfire to deal fire/toxic damage.<br><br>You may only have three demonlings under your command at any given time. If you attempt to summon more demonlings, you can only replace those that have been lost in battle. If you already have your maximum allowed amount, the power will fail.<br><br><color #fcfc95>Notes: Summon Demonlings is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Summon Demonlings",
            icon: "demonsummoning_summondemonlings.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 5.0,
                endurance: 5.46,
                cast: 2.0
            }
        },
        {
            name: "Lash",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "You channel unholy energies into your whip and Lash out at your foe dealing high fire damage causing toxic damage over time. Lash has longer range than most melee attacks will reduce the target's damage resistance and also has a chance to knockdown your target.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Close, Moderate DMG(Fire), Foe -Res, Knockdown, Minor DoT(Toxic)",
            icon: "demonsummoning_lash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 20.0,
                recharge: 8.0,
                endurance: 10.66,
                cast: 1.8,
                damage: {
                    type: "Fire",
                    scale: 3.044
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.21,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Enchant Demon",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Enchant Demon will permanently bestow new powers and abilities to all of your Demon Henchman. The powers gained are unique and dependent upon the type of Demon Henchman that is Enchanted.<br><br>Enchant Demon only works on your Demon Henchmen and you can only Enchant your Demon Henchmen once with this power.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Enchant Demon Henchman",
            icon: "demonsummoning_enchantdemon.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 6.0,
                endurance: 11.375,
                cast: 2.17
            }
        },
        {
            name: "Crack Whip",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You channel hellfire into your whip and make an impressive sweep causing high fire damage to enemies within a wide cone and also cause some toxic damage over time. Whip Crack has a larger range than most melee cones. Targets that are struck will also have their resistance to damage reduced for a short time, may suffer toxic damage over time and may be knocked down.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Short Ranged (Cone), Moderate DMG(Fire), Foe -Res, Knockdown, DoT(Toxic)",
            icon: "demonsummoning_crackwhip.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 15.0,
                endurance: 17.94,
                cast: 2.33,
                damage: {
                    type: "Fire",
                    scale: 2.537
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.222,
                    ticks: 2
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Summon Demons",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Healing", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Resist Damage", "Universal Damage Sets"],
            description: "Summons forth one to two Demons (depending on your level) to do your bidding. One is cloaked in hellfire and has skin as hard as stone while the other manipulates flame.<br><br>You may only have 2 Demons under your control at any given time. If you attempt to call more Demons, you can only replace the ones you have lost in battle. If you already have your maximum allowed number, the power will fail.<br><br><color #fcfc95>Notes: Summon Demons is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Summon Demons",
            icon: "demonsummoning_summondemons.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 10.0,
                endurance: 9.62,
                cast: 2.0
            }
        },
        {
            name: "Hell on Earth",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "A dark blessing is placed upon a selected Demon henchman which will increase its damage and chance to hit for 90 seconds. While this is in effect living hellfire may spawn every 15 seconds at the affected Demon henchman's location. The creatures summoned will have a very weak tie to the material plane and will return to Abyss after a short time.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Ranged, Pet +Dmg, +To Hit, Summon Living Hellfire",
            icon: "demonsummoning_hellonearth.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 600.0,
                endurance: 16.25,
                cast: 2.03,
                tohitBuff: 1.0,
                buffDuration: 90.0
            }
        },
        {
            name: "Summon Demon Prince",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Sleep", "Damage", "Accuracy"],
            allowedSetCategories: ["Holds", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Sleep", "Slow Movement", "Universal Damage Sets"],
            description: "Summons forth a foul Demon Prince from the deepest reaches of the Abyss. The Demon Prince is mighty among its kind and is a master of cold powers. It serves the conjuror only so that it may wreak havoc upon the material plane. The Demon has some defense versus lethal, smashing, fire and cold attacks.<br><br>You may only have 1 Demon Prince under your control at any given time. If you attempt to summon another Demon Prince the power will fail.<br><br><color #fcfc95>Notes: Summon Demon Prince is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Summon Demon Prince",
            icon: "demonsummoning_summondemonprince.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 15.0,
                endurance: 13.18,
                cast: 2.0
            }
        },
        {
            name: "Abyssal Empowerment",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Abyssal Empowerment will permanently unseal the most powerful powers in your Demon Henchmen's infernal repertoire. The Empowered Demons will gain new abilities and powers. The powers gained are unique and dependent upon the type of Demon Henchman that is Empowered.<br><br>Abyssal Empowerment only works on your Demon Henchmen and you can only Empower your Demon Henchmen once with this power.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Empower Demon Henchman",
            icon: "demonsummoning_abyssalempowerment.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 10.0,
                endurance: 11.375,
                cast: 2.07
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/demon-summoning'] = MASTERMIND_DEMON_SUMMONING_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_DEMON_SUMMONING_POWERSET = MASTERMIND_DEMON_SUMMONING_POWERSET;
}