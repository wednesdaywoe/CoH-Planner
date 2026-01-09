/**
 * Staff Fighting
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_STAFF_FIGHTING_POWERSET = {
    name: "Staff Fighting",
    category: "Unknown",
    description: "Staff Fighting powerset",
    icon: "staff-fighting_set.png",
    powers: [
        {
            name: "Mercurial Blow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You strike your foe with a lightning fast blow from your staff dealing Smashing damage. The attack is so unexpected that the target's defenses are reduced slightly for a short time. This power grants one stack of Perfection of Body.",
            shortHelp: "Melee, DMG(Smash), Foe -Def",
            icon: "stafffighting_mercurialblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 9.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.0,
                damage: {
                    type: "Smashing",
                    scale: 1.68
                }
            }
        },
        {
            name: "Precise Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You attempt to daze your foe with a heavy staff blow to their head. Precise Strike has a higher chance to hit than normal, deals Smashing damage, and has a small chance to disorient the target briefly. This power grants one stack of Perfection of Body.",
            shortHelp: "Melee, Liht DMG(Smash), Foe Disorient",
            icon: "stafffighting_precisestrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 9.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.13
            }
        },
        {
            name: "Guarded Spin",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defense Sets", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You spin your staff like a propeller in front of you dealing Smashing damage to enemies in your frontal arc and deflecting any incoming attacks, thus boosting your Melee and Lethal defense briefly. This power grants one stack of Perfection of Body.",
            shortHelp: "Melee (Cone), DMG(Smash), Self +Def(Melee, Lethal)",
            icon: "stafffighting_guardedspin.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.05,
                range: 9.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.83,
                buffDuration: 10.0
            }
        },
        {
            name: "Assassin's Staff",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. This power grants one stack of Perfection of Body. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Smash)",
            icon: "stafffighting_assassinsstaff.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 9.0,
                recharge: 15.0,
                endurance: 14.352,
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
            icon: "stafffighting_buildup.png",
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
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassin's Staff. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "stafffighting_placate.png",
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
            name: "Eye of the Storm",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "With a lightning fast series of spins of your staff you strike at all nearby foes dealing damage with a chance of knocking foes down. This power will build one stack of Perfection of Body if the user has two or less stacks, if the user has three stacks of Perfection of Body it will consume them and gain some benefit. 3 stacks of Perfection of Body will cause additional smashing damage and reduce damage resistance slightly for a short time.",
            shortHelp: "PBAoE Melee, DMG(Smash), Foe Knockdown, Consumes Perfection",
            icon: "stafffighting_eyeofthestorm.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 17.0,
                endurance: 16.016,
                cast: 2.57
            }
        },
        {
            name: "Serpent's Reach",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You fully extend your staff and release a burst of energy to lash out at a distant target and deal Smashing damage with a good chance to knock your target down. This power builds one level of Perfection of Body.<br><br><color #fcfc95>Notes: Serpent's Reach is unaffected by Range changes.</color>",
            shortHelp: "Ranged, DMG(Smash), Foe Knockdown",
            icon: "stafffighting_serpentsreach.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 40.0,
                recharge: 9.0,
                endurance: 9.36,
                cast: 1.77
            }
        },
        {
            name: "Sky Splitter",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You leap into the air and hammer your foe with an overhead bash from your staff. Sky Splitter deals Smashing damage, will knock the target into the air and will briefly disorient your target. This power will build one stack of Perfection of Body if the user has two or less stacks, if the user has three stacks of Perfection of Body it will consume them and gain some benefit. 3 Levels of Perfection of Body will cause additional smashing damage and grant the user a bonus to damage resistance a short time. Critical Hit damage isn't enhanced by levels of Perfection.",
            shortHelp: "Melee, DMG(Smash), Foe Knock Up, Disorient, -Fly, Consumes Perfection",
            icon: "stafffighting_skysplitter.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 9.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.83
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/staff-fighting'] = STALKER_STAFF_FIGHTING_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_STAFF_FIGHTING_POWERSET = STALKER_STAFF_FIGHTING_POWERSET;
}