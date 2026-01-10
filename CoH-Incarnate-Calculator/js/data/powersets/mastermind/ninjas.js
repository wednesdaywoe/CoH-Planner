/**
 * Ninjas
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_NINJAS_POWERSET = {
    name: "Ninjas",
    category: "Unknown",
    description: "Ninjas powerset",
    icon: "ninjas_set.png",
    powers: [
        {
            name: "Call Genin",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Stuns", "Universal Damage Sets"],
            description: "Calls forth one to three Genin Ninja (depending on your level) to do your bidding. Genin have good reflexes and jumping skill, but they are still the lowest rank Ninja and only possess the most rudimentary skills, However, they can be trained in more advanced techniques and weapons.<br><br>You may only have 3 Genin under your control at any given time. If you attempt to call Genin, you can only replace the ones you have lost in battle. If you already have three, the power will fail.<br><br><color #fcfc95>Notes: Call Genin is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Genin",
            icon: "ninjas_callgenin.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 5.0,
                endurance: 5.46,
                cast: 1.7
            }
        },
        {
            name: "Snap Shot",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "A quick attack that fires an arrow at your foe after only minimal aiming. Fast, but little damage.<br><br><color #fcfc95>Sensei's Guidance:</color><br>Hitting with this power will grant your Ninja Henchman +3% Critical Hit chance for 30 seconds. This does not stack from the same power.",
            shortHelp: "Ranged, DMG(Lethal)",
            icon: "ninjas_quickshot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 80.0,
                recharge: 2.0,
                endurance: 4.42,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 1.8599999999999999
                }
            }
        },
        {
            name: "Aimed Shot",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "Though it takes longer to execute, your Aimed Shot deals greater damage than Snap Shot.<br><br><color #fcfc95>Sensei's Guidance:</color><br>Hitting with this power will grant your Ninja Henchman +3% Critical Hit chance for 30 seconds. This does not stack from the same power.",
            shortHelp: "Ranged, DMG(Lethal)",
            icon: "ninjas_standardshot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 80.0,
                recharge: 4.0,
                endurance: 6.5,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 2.26
                }
            }
        },
        {
            name: "Train Ninjas",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Train your Ninja Henchmen with more advanced techniques and weaponry. This power permanently bestows new powers and abilities to all of your Ninja Henchman. The powers gained are unique and dependent upon the type of Ninja Henchman. <br><br>Your Ninja Henchman will also become more evasive against all forms of positional attacks and gain 3% more Critical Hit chance. This power only works on your Ninja Henchmen and you can only Train your Ninja Henchmen once with this power.",
            shortHelp: "Ranged, Train Ninja Henchman",
            icon: "ninjas_trainninjas.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 6.0,
                endurance: 11.375,
                cast: 2.37,
                buffDuration: 5.0
            }
        },
        {
            name: "Fistful of Arrows",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Universal Damage Sets"],
            description: "You fire a fistful of arrows at foes in a cone in front of you. Good at close range.<br><br><color #fcfc95>Sensei's Guidance:</color><br>Hitting with this power will grant your Ninja Henchman +3% Critical Hit chance for 30 seconds. This does not stack from the same power.",
            shortHelp: "Ranged (Cone), DMG(Lethal)",
            icon: "ninjas_fistfullarrows.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.155,
                range: 40.0,
                recharge: 8.0,
                endurance: 10.66,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 1.6225
                }
            }
        },
        {
            name: "Call Jounin",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Sleep", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate To-Hit Debuff", "Confuse", "Defense Debuff", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Sleep", "Stuns", "Threat Duration", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can summon one to two highly skilled Jounin Ninja (depending on your level). Jounin Ninja are master assassins and expert swordsmen. They possess superior reflexes and jumping skill. Like all Henchmen, Jounin can be trained in even deadlier Ninjitsu techniques and weapons.<br><br>You may only have 2 Jounin under your control at any given time. If you attempt to summon more Jounin, you can only replace the ones you have lost in battle. If you already have two, the power will fail.<br><br><color #fcfc95>Notes: Call Jounin is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Jounin",
            icon: "ninjas_calljounin.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 10.0,
                endurance: 9.62,
                cast: 1.7
            }
        },
        {
            name: "Smoke Flash",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "You can command one of your Ninja Henchmen to throw down a Smoke Bomb. The Smoke Flash will allow the Ninja to Placate his nearby foes, and thus unable to target the Ninja. The Smoke Flash also makes all your Ninja stealthy and Hidden for 3 seconds, enabling them to perform Critical hits with their next few attacks. You can only use this power on a Ninja Henchmen.",
            shortHelp: "Hide Ninja",
            icon: "ninjas_kujikiri.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 1,
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 90.0,
                endurance: 15.0,
                cast: 1.17,
                buffDuration: 3.0
            }
        },
        {
            name: "Oni",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Holds", "Immobilize", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Summons an ancient and powerful Oni. An Oni is a powerful human-like demon warrior. The Oni is a formidable creature who possesses the skill of a warrior and the powers of wind and fire.<br><br>You may only have 1 Oni under your control at any given time. If you attempt to summon another Oni, the power will fail.<br><br><color #fcfc95>Notes: Oni is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Oni",
            icon: "ninjas_calloni.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 15.0,
                endurance: 13.18,
                cast: 2.03
            }
        },
        {
            name: "Kuji-In Zen",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Kuji-In Zen will permanently bestow the most advanced techniques and powers to all of your Ninja Henchman. The Enlightened Ninja will gain new abilities, powers, and weapons. The powers gained are unique and dependent upon the type of Ninja Henchman that is Enlightened. <br><br>Your Ninja Henchman also gain 3% more Critical Hit chance and the ability to heal themselves periodically with Kuji-In Sha. This power only works on your Ninja Henchmen and you can only Enlighten your Ninja Henchmen once with this power.",
            shortHelp: "Ranged, Enlighten Ninja Henchman",
            icon: "ninjas_upgradeequipment.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 10.0,
                endurance: 11.375,
                cast: 2.37,
                buffDuration: 7.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/ninjas'] = MASTERMIND_NINJAS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_NINJAS_POWERSET = MASTERMIND_NINJAS_POWERSET;
}