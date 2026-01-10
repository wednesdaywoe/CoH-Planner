/**
 * Robotics
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_ROBOTICS_POWERSET = {
    name: "Robotics",
    category: "Unknown",
    description: "Robotics powerset",
    icon: "robotics_set.png",
    powers: [
        {
            name: "Battle Drones",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Construct one to three Battle Drones (depending on your level) to do your bidding. Drones start out with only basic weaponry, but can be upgraded with heavier energy weapons. Drones can Super Leap.<br><br>You may only have 3 Drones under your control at any given time. If you attempt to construct more Drones, you can only replace the ones you have lost in battle. If you already have three, the power will fail.<br><br><color #fcfc95>Notes: Battle Drones is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Battle Drones",
            icon: "robotics_buildrobotarmy.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 5.0,
                endurance: 5.46,
                cast: 2.03
            }
        },
        {
            name: "Pulse Rifle Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "This Pulse Rifle can fire a long range laser pulse that deals Energy damage.<br><br><color #fcfc95>Laser Burn:</color><br>Targets struck by this attack will have their Regeneration debuffed for 30 seconds.",
            shortHelp: "Ranged, DMG(Energy), -Regen",
            icon: "robotics_laserrifleburst.png",
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
                    type: "Energy",
                    scale: 2.26
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Pulse Rifle Burst",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "This high powered laser pulse from your Pulse Rifle takes more energy to fire, but causes much more damage than a standard pulse and has a very good chance to send your foes flying.<br><br><color #fcfc95>Laser Burn:</color><br>Targets struck by this attack will have their Regeneration debuffed for 30 seconds.",
            shortHelp: "Ranged, DMG(Energy), Foe Knockback, -Regen",
            icon: "robotics_laserrifleblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 10.66,
                cast: 1.1,
                damage: {
                    type: "Energy",
                    scale: 3.13
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Equip Robot",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "Equip your Robots with the latest gear and weaponry. This power permanently bestows new powers and abilities to all of your Robot Henchman. The powers gained are unique and dependent upon the type of Robot Henchman that is Equipped.<br><br>Your Robot Henchmen will also become more resistant to damage. This power only works on your Robot Henchmen and you can only Equip your Robot Henchmen once with this power.",
            shortHelp: "Ranged, Equip Robot Henchman",
            icon: "robotics_equiprobot.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 6.0,
                endurance: 11.375,
                cast: 2.03,
                buffDuration: 5.6
            }
        },
        {
            name: "Photon Grenade",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "Launches an Energy Grenade at long range from your Pulse Rifle. The energy from this explosion can Disorient some targets in the affected area and debuffs their regeneration.<br><br><color #fcfc95>Laser Burn:</color><br>Targets struck by this attack will have their Regeneration debuffed for 30 seconds.",
            shortHelp: "Ranged (Targeted AoE), DMG(Energy), Disorient, -Regen",
            icon: "robotics_laserriflestungrenade.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 16.0,
                endurance: 18.98,
                cast: 1.87,
                damage: {
                    type: "Energy",
                    scale: 1.6213
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Protector Bots",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Defense Sets", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Stuns", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can summon one to two powerful Protector Bots (depending on your level). Protector Bots can defend your army by placing Force Fields on you and your allies. They can even be equipped to repair your other Robot Henchmen. Make no mistake though, the best defense is a good offense, and Protector Bots are well equipped with energy weapons.<br><br>You may only have 2 Protector Bots under your control at any given time. If you attempt to summon more Protector Bots, you can only replace the ones you have lost in battle. If you already have two, the power will fail.<br><br><color #fcfc95>Notes: Protector Bots is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Protector Bot",
            icon: "robotics_constructprotectorbot.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 10.0,
                endurance: 9.62,
                cast: 2.03
            }
        },
        {
            name: "Maintenance Drone",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "This sturdy Maintenance Drone serves as a health battery reserve for your machines. As your other drones are hurt, it will use its own health to heal other drones. Once all its health is used up, it will self destruct. Maintenance Drone does not regenerate health, and can't be healed.",
            shortHelp: "Summon Maintenance Robot",
            icon: "robotics_maintenancebot.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 120.0,
                endurance: 16.25,
                cast: 2.03
            }
        },
        {
            name: "Assault Bot",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Stuns", "Universal Damage Sets"],
            description: "Builds one massive Assault Bot. Simply put, the Assault Bot is a killing machine. There is nothing subtle about its weaponry.<br><br>You may only have 1 Assault Bot under your control at any given time. If you attempt to summon another Assault Bot, the power will fail.<br><br><color #fcfc95>Notes: Assault Bot is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Assault Bot",
            icon: "robotics_assembleassaultmech.png",
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
            name: "Upgrade Robot",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Upgrade Robot will permanently bestow the most powerful and high-tech gear and weaponry to all of your Robot Henchman. The Upgraded Robot will gain new abilities, powers and weapons. The powers gained are unique and dependent upon the type of Robot Henchmen that is Upgraded.<br><br>Your Protector Bot Henchmen will also gain the ability to Repair other Robot Henchmen. This power only works on your Robot Henchmen and you can only Upgrade your Robot Henchman once with this power.",
            shortHelp: "Ranged, Upgrade Robot Henchman",
            icon: "robotics_upgraderobot.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 10.0,
                endurance: 11.375,
                cast: 2.03,
                buffDuration: 11.5
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/robotics'] = MASTERMIND_ROBOTICS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_ROBOTICS_POWERSET = MASTERMIND_ROBOTICS_POWERSET;
}