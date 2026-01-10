/**
 * Beast Mastery
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_BEAST_MASTERY_POWERSET = {
    name: "Beast Mastery",
    category: "Unknown",
    description: "Beast Mastery powerset",
    icon: "beast-mastery_set.png",
    powers: [
        {
            name: "Call Swarm",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You summon a swarm of stinging insects to harass your foe causing Light Lethal damage over time and reducing both their movement speed and defense. This power has a moderate chance at granting your pets a stack of Pack Mentality.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Light DoT(Lethal), Foe -Defense, -Speed",
            icon: "beastmastery_callswarm.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 3.0,
                endurance: 5.46,
                cast: 1.0,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.42879999999999996,
                    ticks: 4
                },
                buffDuration: 3.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Summon Wolves",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate To-Hit Debuff", "Defense Debuff", "Healing", "Knockback", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Running", "Running & Sprints", "To Hit Buff", "To Hit Debuff", "Universal Damage Sets"],
            description: "Calls forth one to three Wolves to do your bidding. The third one summoned will be an Alpha Wolf, which grants some leadership bonuses to the pack. Wolves have no ranged attacks, but can quickly close in on their prey.<br><br>You may only have 3 Wolves under your control at any given time. If you attempt to call more Wolves, you can only replace the ones you have lost in battle. If you already have three, the power will fail.<br><br>Wolf attacks have a chance to build a charge of Pack Mentality. Pack Mentality is a Damage buff aura that radiates from the Mastermind and can stack up to 10 times.<br><br><color #fcfc95>Notes: Summon Wolves is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Summon Wolves",
            icon: "beastmastery_summonwolves.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 5.0,
                endurance: 5.46,
                cast: 1.97
            }
        },
        {
            name: "Call Hawk",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Knockback", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You call forth a hawk ally to swoop in and viciously peck at your target causing High Lethal damage. The attack often catches foes off their guard and can knock them down as well as reducing their chance to hit. This power has a good chance at granting your pets a stack of Pack Mentality.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Moderate DMG(Lethal), Foe -To Hit, Knockdown, -Fly",
            icon: "beastmastery_callhawk.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 6.0,
                endurance: 9.62,
                cast: 1.67,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.7236,
                    ticks: 4
                },
                buffDuration: 1.3,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Train Beasts",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Train your Beast Henchmen to more effectively attack your foes. This power permanently bestows new powers and abilities to all of your Beast Henchmen. The powers gained are unique and dependent upon the type of Beast Henchman.<br><br>This power only works on your Beast Henchmen and you can only Train your Beast Henchmen once with this power.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Train Beast Henchmen",
            icon: "beastmastery_trainbeasts.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 6.0,
                endurance: 11.375,
                cast: 1.67
            }
        },
        {
            name: "Call Ravens",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You command an unkindness of ravens to quickly assault and harass your foes. Your foes will suffer Moderate Lethal damage over time and have their speed and defense reduced. This power has a high chance at granting your pets a stack of Pack Mentality.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Moderate DoT(Lethal), Foe -Speed, -Defense, -Fly",
            icon: "beastmastery_calllocusts.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.155,
                range: 40.0,
                recharge: 14.0,
                endurance: 16.9,
                cast: 2.17,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.5673999999999999,
                    ticks: 4
                },
                buffDuration: 3.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Summon Lions",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Damage", "Accuracy"],
            allowedSetCategories: ["Defense Sets", "Healing", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Running", "Running & Sprints", "Stuns", "Universal Damage Sets"],
            description: "You can summon one to two mighty lions (depending on your level). Lions are one of the most deadly predators on the planet and possess vicious claw and bite attacks as well as growl and roar buffs and debuffs. Like all Henchmen, Lions can be trained to be even more powerful.<br><br>You may only have 2 Lions under your control at any given time. If you attempt to summon more Lions, you can only replace the ones you have lost in battle. If you already have two, the power will fail.<br><br>Lion attacks have a chance to build a charge of Pack Mentality. Pack Mentality is a Damage buff aura that radiates from the Mastermind and can stack up to 10 times.<br><br><color #fcfc95>Notes: Summon Lions is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Summon Lions",
            icon: "beastmastery_summonlions.png",
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
            name: "Fortify Pack",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Healing"],
            description: "You command your beasts to fight more defensively. Using Fortify Pack will prevent your pets from benefiting from Pack Mentality for 60 seconds. The number of charges of Pack Mentality you own when activating this power will determine the potency of the Defense and Regeneration buff that will be granted to your pack. Additionally, simply owning this power grants your beast pets attacks a chance to critically hit that scales with the amount of Pack Mentality owned by the Mastermind.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, Pets +Defense, +Regeneration, consumes all charges of Pack Mentality",
            icon: "beastmastery_fortifypack.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 240.0,
                endurance: 16.25,
                cast: 2.27,
                buffDuration: 60.0
            }
        },
        {
            name: "Summon Dire Wolf",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Fear", "Healing", "Mastermind Archetype Sets", "Pet Damage", "Recharge Intensive Pets", "Resist Damage", "Running", "Running & Sprints", "Slow Movement", "Universal Damage Sets"],
            description: "You call upon the aid of the fabled Dire Wolf. It has powerful bite and breath attacks. Unlike wolves and lions, the Dire Wolf has some limited ranged attacks. The Dire Wolf has good defense to Melee, Ranged and AoE attacks and good resistance to Cold damage.<br><br>You may only have 1 Dire Wolf under your control at any given time. If you attempt to summon another Dire Wolf the power will fail.<br><br>Dire Wolf attacks have a chance to build a charge of Pack Mentality. Pack Mentality is a Damage buff aura that radiates from the Mastermind and can stack up to 10 times.<br><br><color #fcfc95>Notes: Summon Dire Wolf is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Summon Dire Wolf",
            icon: "beastmastery_summondirewolves.png",
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
            name: "Tame Beasts",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Tame Beasts will permanently teach the most deadly and ferocious powers to all of your Beast Henchmen. The Tamed Beasts will gain new abilities and powers. The powers gained are unique and dependent upon the type of Beast Henchman that is Tamed.<br><br>Tame Beasts only works on your Beast Henchmen and you can only Tame your Beast Henchmen once with this power.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Upgrade Beast Henchmen",
            icon: "beastmastery_tamebeasts.png",
            powerType: "Click",
            targetType: "Own Pet (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 10.0,
                endurance: 11.375,
                cast: 1.07
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/beast-mastery'] = MASTERMIND_BEAST_MASTERY_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_BEAST_MASTERY_POWERSET = MASTERMIND_BEAST_MASTERY_POWERSET;
}