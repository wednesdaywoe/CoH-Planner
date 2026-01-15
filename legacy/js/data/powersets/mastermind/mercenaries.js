/**
 * Mercenaries
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_MERCENARIES_POWERSET = {
    name: "Mercenaries",
    category: "Unknown",
    description: "Mercenaries powerset",
    icon: "mercenaries_set.png",
    powers: [
        {
            name: "Burst",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "Quickly fires a Burst of rounds at a single target at very long range. Damage is average, but the fire rate is fast. Can also reduce the target's defense.<br><br><color #fcfc95>Focus Fire:</color><br>The target struck by this attack will take 3.33% increased damage from any Mercenary Henchmen regardless of their owners for 30 seconds. This does effect does not stack from the same power or from multiple Masterminds.",
            shortHelp: "Ranged, DoT (Lethal) Foe -DEF",
            icon: "paramilitary_assaultrifleburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 90.0,
                recharge: 4.0,
                endurance: 6.5,
                cast: 1.0,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.585,
                    ticks: 3
                },
                buffDuration: 0.91,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Soldiers",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Healing", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Calls forth one to three Mercenary Soldiers (depending on your level) to do your bidding. The third Soldier you gain will be a Medic. All Soldiers use Sub Machine Guns, but these can be upgraded.<br><br>You may only have 3 Soldiers under your control at any given time. If you attempt to call more Soldiers, you can only replace the ones you have lost in battle. If you already have three, the power will fail.<br><br><color #fcfc95>Notes: Soldiers is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Soldier",
            icon: "paramilitary_draftarmy.png",
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
            name: "Slug",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "Fires a single Slug at a targeted foe. Firing a single Slug is slower than firing a Burst, but deals more damage, is longer range, and can knock down foes.<br><br><color #fcfc95>Focus Fire:</color><br>The target struck by this attack will take 3.33% increased damage from any Mercenary Henchmen regardless of their owners for 30 seconds. This does effect does not stack from the same power or from multiple Masterminds.",
            shortHelp: "Ranged, DMG(Lethal), Foe Knockback",
            icon: "paramilitary_assaultrifleslug.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 100.0,
                recharge: 8.0,
                endurance: 10.66,
                cast: 1.67,
                damage: {
                    type: "Lethal",
                    scale: 3.529
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Equip Mercenary",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "Equip your Mercenary Henchmen with more advanced munitions and weaponry. This power permanently bestows new weapons and abilities to all Mercenary Henchman. The powers gained are unique and dependent upon the type of Mercenary Henchman.<br><br>Your Mercenary Henchmen will also become more resistant to damage. This power only works on your Mercenary Henchmen and you can only Equip your Mercenary Henchmen once with this power.",
            shortHelp: "Ranged, Equip Mercenary Henchman",
            icon: "paramilitary_equipsoldier.png",
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
            name: "M30 Grenade",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Launches a Grenade at long range from beneath the barrel of your Assault Rifle. This explosion affects all within the blast radius, and can knock them back.<br><br><color #fcfc95>Focus Fire:</color><br>The main target struck by this attack will take 3.33% increased damage from any Mercenary Henchmen regardless of their owners for 30 seconds. This does effect does not stack from the same power or from multiple Masterminds.",
            shortHelp: "Ranged (Targeted AoE), DMG(Lethal/Fire), Knockback",
            icon: "paramilitary_assaultriflegrenade.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.05,
                range: 80.0,
                recharge: 16.0,
                endurance: 18.98,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 1.0574
                        },
                        {
                            type: "Lethal",
                            scale: 0.5207999999999999
                        }
                    ],
                    scale: 1.5781999999999998
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Spec Ops",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate To-Hit Debuff", "Defense Debuff", "Holds", "Immobilize", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Stuns", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can enlist one to two highly skilled Spec Ops Mercenary (depending on your level). Spec Ops weapons are highly accurate and long ranged, and they are adept in many different tactical weapons. Like all Henchmen, Spec Ops can be equipped with even deadlier munitions.<br><br>You may only have 2 Spec Ops under your control at any given time. If you attempt to summon more Spec Ops, you can only replace the ones you have lost in battle. If you already have two, the power will fail.<br><br><color #fcfc95>Notes: Spec Ops is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Spec Ops",
            icon: "paramilitary_enlistspecialforces.png",
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
            name: "Serum",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Resist Damage", "To Hit Buff"],
            description: "You can use a special Serum to turn your Mercenaries into a virtually Unstoppable killing machines for a short time. The Serum, will increase their Damage, chance to hit, Endurance Recovery, and Damage Resistance to all damage except Psionics. They will also be virtually immune to controlling effects including Disorient, Sleep, Hold, Immobilize and Knockback. The effects will start to slowly fade away over 60 seconds.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Buff Mercenaries +DMG, +RES(All except Psionic), +To Hit, +Recovery",
            icon: "paramilitary_serum.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 250.0,
                endurance: 15.0,
                cast: 1.3,
                buffDuration: 60.0,
                stun: 1.0,
                stunDuration: 60.0,
                tohitBuff: 1.0
            }
        },
        {
            name: "Commando",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "Enlists one highly trained Commando. The Commando is a seasoned professional who favors heavy assault weapons. He is simply a one man army that can leave a wake of destruction in his path. In addition to standard Soldier resistance, the Commandos experience also makes him resistant to Fear and his rugged advanced training makes him slightly resistant to Fire, Cold and Toxic Damage.<br><br>You may only have 1 Commando under your control at any given time. If you attempt to summon another Commando, the power will fail.<br><br><color #fcfc95>Notes: Commando is unaffected by Recharge Time changes.</color>",
            shortHelp: "Summon Commando",
            icon: "paramilitary_supersoldier.png",
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
            name: "Tactical Upgrade",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Permanently Upgrade the most advanced tactical weapons and gear to all of your Mercenary Henchman. The Tactically Upgraded Mercenaries will gain powers, weapons and munitions. The powers gained are unique and dependent upon the type of Mercenary Henchman that is Upgraded.<br><br>Your Mercenary Henchmen will also become more evasive towards Ranged and AoE attacks. This power only works on your Mercenary Henchmen and you can only Upgrade your Mercenary Henchmen once with this power.",
            shortHelp: "Ranged, Upgrade Mercenary Henchman",
            icon: "paramilitary_tacticalupgrade.png",
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
                buffDuration: 11.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/mercenaries'] = MASTERMIND_MERCENARIES_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_MERCENARIES_POWERSET = MASTERMIND_MERCENARIES_POWERSET;
}