/**
 * Savage Melee
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_SAVAGE_MELEE_POWERSET = {
    name: "Savage Melee",
    category: "Unknown",
    description: "Savage Melee powerset",
    icon: "savage-melee_set.png",
    powers: [
        {
            name: "Maiming Slash",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You execute a savage slash at your foe's lower body causing moderate lethal damage and minor damage over time. The foe will also have their movement speed reduced moderately. Maiming Slash grants 1 stack of Blood Frenzy.",
            shortHelp: "Melee, DMG(Lethal), DoT (Lethal), Foe -Speed), Self +1 Blood Frenzy",
            icon: "savagemelee_maimingslash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.03,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 2.5785
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Savage Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You quickly tear at your foe dealing minor lethal damage and causing minor lethal damage over time. Savage Strikes grants you 1 stack of Blood Frenzy.",
            shortHelp: "Melee, DMG(Lethal), Foe DoT (Lethal), Self +1 Blood Frenzy",
            icon: "savagemelee_savagestrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 2.5,
                endurance: 3.95,
                cast: 0.8,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.9104,
                    ticks: 1
                },
                buffDuration: 0.4
            }
        },
        {
            name: "Shred",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You rapidly slash at your foes several times causing a moderate amount of damage to all enemies in front of you and reduce their defense. Shred also causes minor lethal damage over time. This power grants 1 stack of Blood Frenzy.",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe DoT (Lethal), -Def(All), Self +1 Blood Frenzy",
            icon: "savagemelee_shred.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.3963,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 7.5,
                endurance: 8.11,
                cast: 2.17,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.5091,
                    ticks: 5
                },
                buffDuration: 2.0,
                defenseDebuff: 1.2
            }
        },
        {
            name: "Assassin's Frenzy",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior lethal damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Frenzy will grant 2 stacks of Blood Frenzy if used while not hidden and will grant 3 stacks if hidden. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not. Assassin's Frenzy grants 2 stacks of Blood Frenzy.",
            shortHelp: "Melee, DMG(Lethal)), Self +1 Blood Frenzy",
            icon: "savagemelee_assassinstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.35,
                cast: 3.0
            }
        },
        {
            name: "Build Up",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "savagemelee_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Placate",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Claw. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "savagemelee_placate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                cast: 0.8,
                buffDuration: 10.0
            }
        },
        {
            name: "Rending Flurry",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You wildly slash at nearby foes to deal moderate lethal damage and cause minor lethal damage over time. This power consumes all Blood Frenzy and will deal additional damage per stack of Blood Frenzy consumed. If you have 5 stacks of Blood Frenzy while activating this power, its radius is greatly increased, but causes you to become Exhausted for a short time. While exhausted you cannot gain Blood Frenzy.",
            shortHelp: "PBAoE, DMG(Lethal), Foe DoT (Lethal), -Blood Frenzy",
            icon: "savagemelee_rendingflurry.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.17
            }
        },
        {
            name: "Hemorrhage",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You viciously tear at your foe causing a light amount of lethal damage. Additionally, the target will suffer from lethal damage over time. Hemorrhage consumes all stacks of Blood Frenzy. This power's damage over time effect will scale with the number of stacks of Blood Frenzy. Using this power with 5 stacks of Blood Frenzy causes you to become Exhausted for a short time, but the duration of Hemorrhage's damage over time effect is increased. While exhausted you cannot gain Blood Frenzy.",
            shortHelp: "Melee, DMG(Lethal), Foe Special DoT (Lethal), -Blood Frenzy",
            icon: "savagemelee_hemorrhage.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.0,
                damage: {
                    type: "Lethal",
                    scale: 1.4498
                }
            }
        },
        {
            name: "Savage Leap",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Stalker Archetype Sets", "Teleport", "Universal Damage Sets", "Universal Travel"],
            description: "You throw yourself at your distant foes while slashing and tearing wildly dealing moderate lethal damage and causing your foes to suffer from additional minor lethal damage over time. The damage of this power can increase based on how far away you leap from, with up to double damage dealt at its strongest. Savage Leap build 1 stacks of Blood Frenzy for every 20 ft in between your target and you, up to 3 stacks.",
            shortHelp: "PBAoE, DMG(Lethal), Foe DoT (Lethal), 1 to 3 Blood Frenzy, Self Teleport",
            icon: "savagemelee_savageleap.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 40.0,
                endurance: 17.58,
                cast: 1.17
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/savage-melee'] = STALKER_SAVAGE_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_SAVAGE_MELEE_POWERSET = STALKER_SAVAGE_MELEE_POWERSET;
}