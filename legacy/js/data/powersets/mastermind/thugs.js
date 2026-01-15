/**
 * Thugs
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_THUGS_POWERSET = {
    name: "Thugs",
    category: "Unknown",
    description: "Thugs powerset",
    icon: "thugs_set.png",
    powers: [
        {
            name: "Call Thugs",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Calls forth one to three Thugs (depending on your level) to do your bidding. The third Thug you gain will be an Arsonist. Thugs use Dual Pistols and can be taught additional pistol attacks.<br><br>You may only have 3 Thugs under your control at any given time. If you attempt to call more Thugs, you can only replace the ones you have lost in battle. If you already have three, the power will fail.<br><br><color #fcfc95>Notes: Call Thugs is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Summon Punks",
            icon: "thugs_hireposse.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 5.0,
                endurance: 5.46,
                cast: 1.67
            }
        },
        {
            name: "Pistols",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "Quickly fires a round from one of your heavy automatic pistols. Damage is average, but the fire rate is very fast.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Light DMG(Lethal)",
            icon: "thugs_targetedrangedminordmg.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 3.0,
                endurance: 6.5,
                cast: 1.2,
                damage: {
                    type: "Lethal",
                    scale: 2.3600000000000003
                }
            }
        },
        {
            name: "Dual Wield",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "Fires both pistols at once at a time target. Firing both pistols at once is slower than a single shot, but deals more damage, and the target may get knocked down by the force of the impact.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Lethal), Foe Knockback",
            icon: "thugs_targetedrangedheavydmg.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 6.0,
                endurance: 8.58,
                cast: 1.2,
                dotDamage: {
                    type: "Lethal",
                    scale: 1.4,
                    ticks: 1
                },
                buffDuration: 0.3
            }
        },
        {
            name: "Equip Thugs",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Equip your Thug Henchmen with better ammo, weapons and training. This power permanently bestows new weapons and abilities to all of your Thug Henchman. The powers gained are unique and dependent upon the type of Thug Henchman.<br><br>This power only works on your Thug Henchmen and you can only Equip your Thug Henchmen once with this power.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Equip Thug Henchman",
            icon: "thugs_equipthugs.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 6.0,
                endurance: 11.375,
                cast: 1.3,
                buffDuration: 3.5
            }
        },
        {
            name: "Empty Clips",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You empty the clips of both your pistols in a arc of suppression fire. This attack can blast multiple foes in the affected cone area, and has a small chance of knocking some foes down.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Cone), Minor DMG(Lethal), Knockback",
            icon: "thugs_conerangedmoderatedmg.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.1,
                range: 40.0,
                recharge: 8.0,
                endurance: 18.98,
                cast: 1.83,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.569,
                    ticks: 2
                },
                buffDuration: 0.7
            }
        },
        {
            name: "Call Enforcer",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Defense Sets", "Holds", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Stuns", "To Hit Buff", "Universal Damage Sets"],
            description: "Calls forth one to two Thug Enforcers (depending on your level) to do your bidding. Thug Enforcers carry a Sub-machine Gun, and possess good leadership skills. Their weapon of choice is an UZI, and can be equipped to carry up to 2 at once.<br><br>You may only have 2 Thug Enforcers under your control at any given time. If you attempt to call more Enforcers, you can only replace the ones you have lost in battle. If you already have two, the power will fail.<br><br><color #fcfc95>Notes: Call Enforcer is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Summon Enforcer",
            icon: "thugs_enlistlieutenant.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 10.0,
                endurance: 9.62,
                cast: 1.67
            }
        },
        {
            name: "Gang War",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Calls a gang of 10 or so Thug Posse to come to your aid for a brief while. Posse are not like your true Henchman. They cannot be given direct commands, nor will they appear in your pet window. You must select an enemy target to attack first before calling these Thugs. Posse are many, but they are very weak, and are only equipped with the most basic weapons. Although they will follow you, they are not as loyal as your Henchmen, and they will only stick around for a few minutes before taking off.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Summon Posse",
            icon: "thugs_targetedsummonmob.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 600.0,
                endurance: 13.0,
                cast: 1.67
            }
        },
        {
            name: "Call Bruiser",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Calls one massive Bruiser. He is strong, tough and has a mean temper. As a Brute, he will generate Fury and deal more damage the longer the combat lasts. His Super Strength powers means he favors hand to hand combat. He has resistance to Lethal and Smashing Damage and some resistance to Fire and Cold Damage.<br><br>You may only have 1 Bruiser under your control at any given time. If you attempt to summon another Bruiser the power will fail.<br><br><color #fcfc95>Notes: Call Bruiser is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Summon Bruiser",
            icon: "thugs_enlistboss.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 15.0,
                endurance: 13.18,
                cast: 1.67
            }
        },
        {
            name: "Upgrade Equipment",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Permanently Upgrade the most advanced ammo, weapons and training to all of your Thug Henchman. The Upgraded Thug will gain new powers, weapons and abilities. The powers gained are unique and dependent upon the type of Thug Henchman that is Upgraded.<br><br>This power only works on your Thug Henchmen and you can only Upgrade the Equipment of your Thug Henchmen once with this power.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Upgrade Thug Henchman",
            icon: "thugs_upgradeequipment.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 10.0,
                endurance: 11.375,
                cast: 1.67,
                buffDuration: 7.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/thugs'] = MASTERMIND_THUGS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_THUGS_POWERSET = MASTERMIND_THUGS_POWERSET;
}