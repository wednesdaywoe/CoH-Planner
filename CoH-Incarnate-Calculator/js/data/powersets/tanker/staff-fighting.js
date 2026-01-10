/**
 * Staff Fighting
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_STAFF_FIGHTING_POWERSET = {
    name: "Staff Fighting",
    category: "Unknown",
    description: "Staff Fighting powerset",
    icon: "staff-fighting_set.png",
    powers: [
        {
            name: "Form of the Body",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "This power is obtained by purchasing Staff Mastery. All Staff Fighting attacks will build a level of Perfection of Body while this toggle is active. Each level will boost the user's damage output slightly. Once the user has built up 3 levels of Perfection of Body and they execute Eye of the Storm, the attack will reduce the targets' damage resistance slightly and will deal additional smashing damage. Executing Sky Splitter with three 3 levels of Perfection of Body will deal additional smashing damage and grant the user a moderate resistance buff for a short time.",
            shortHelp: "Toggle: Grants Perfection of Body levels",
            icon: "stafffighting_formofthebody.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 0.63,
                buffDuration: 1.25
            }
        },
        {
            name: "Form of the Mind",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "This power is obtained by purchasing Staff Mastery. All Staff Fighting attacks will build a level of Perfection of Mind while this toggle is active. Each level will boost the user's recharge rate slightly. Once the user has built up 3 levels of Perfection of Mind and they execute Eye of the Storm, the attack will slow the targets slightly and will deal additional psychic damage. Executing Sky Splitter with three 3 levels of Perfection of Mind will deal additional psychic damage and grant the user a moderate to hit buff for a short time.",
            shortHelp: "Toggle: Grants Perfection of Mind levels",
            icon: "stafffighting_formofthemind.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 0.63,
                buffDuration: 1.25
            }
        },
        {
            name: "Form of the Soul",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "This power is obtained by purchasing Staff Mastery. All Staff Fighting attacks will build a level of Perfection of Soul while this toggle is active. Each level will grant the user an Endurance Discount. Once the user has built up 3 levels of Perfection of Soul and they execute Eye of the Storm, the attack will reduce targets' defense slightly and will deal additional energy damage. Executing Sky Splitter with three 3 levels of Perfection of Soul will deal additional energy damage and grant the user a moderate regeneration and recovery buff for a short time.",
            shortHelp: "Toggle: Grants Perfection of Soul levels",
            icon: "stafffighting_formofthesoul.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 0.63,
                buffDuration: 1.25
            }
        },
        {
            name: "Mercurial Blow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You strike your foe with a lightning fast blow from your staff dealing Smashing damage. The attack is so unexpected that the target's defenses are reduced slightly for a short time. While a form is active, this power will build one level of Perfection.",
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
                    scale: 1.22
                },
                defenseDebuff: 1.0,
                buffDuration: 8.0
            }
        },
        {
            name: "Precise Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You attempt to daze your foe with a heavy staff blow to their head. Precise Strike has a higher chance to hit than normal, deals Smashing damage, and has a small chance to disorient the target briefly. While a form is active, this power will build one level of Perfection.",
            shortHelp: "Melee, DMG(Smash), Foe Disorient",
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
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defense Sets", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You spin your staff like a propeller in front of you dealing Smashing damage to enemies in your frontal arc and deflecting any incoming attacks, thus boosting your Melee and Lethal defense briefly. While a form is active, this power will build one level of Perfection.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>5</color> targets above its cap at 1/3rd effectiveness.</color>",
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
            name: "Taunt",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunts a foe, and some nearby foes, to attack you. Useful for pulling villains off an ally who find themselves in over their head. Taunted foes tend to ignore other Heroes and focus on you for quite a while, so use this power cautiously. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "stafffighting_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 2.0,
                buffDuration: 20.0
            }
        },
        {
            name: "Eye of the Storm",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "With a lightning fast series of spins of your staff you strike at all nearby foes dealing moderate damage with a chance of knocking foes down. While a form is active, this power will build one level of Perfection if the user has two or less levels, if the user has three levels of Perfection it will consume them and gain some benefit. 3 Levels of Perfection of Body will cause additional smashing damage and reduce damage resistance slightly for a short time. 3 Levels of Perfection of Mind will cause additional psionic damage and reduce attack and movement speed for a short time. 3 Levels of Perfection of Soul will cause additional energy damage and reduce defense for a short time.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
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
            name: "Staff Mastery",
            available: 19,
            tier: 4,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "By Purchasing this power, you will gain access to the following powers: Form of the Body, Form of the Mind and Form of the Soul. Each of these toggle powers will allow the user to build up levels of Perfection, which grant the user a stacking short duration buff. Each buff is unique to the active form, and only one form can be active at a time. Perfection can be released by executing Eye of the Storm or Sky Splitter. When either of these attacks are empowered with Perfection they will have additional effects that are unique to each form. See Forms for additional details.",
            shortHelp: "Change Stances/Special",
            icon: "stafffighting_staffmastery.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                buffDuration: 10.25
            }
        },
        {
            name: "Serpent's Reach",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You fully extend your staff and release a burst of energy to lash out at a distant target and deal Smashing damage with a good chance to knock your target down. While a form is active, this power will build one level of Perfection.<br><br><color #fcfc95>Notes: Serpent's Reach is unaffected by Range changes.</color>",
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
                cast: 1.77,
                damage: {
                    type: "Smashing",
                    scale: 1.9989
                }
            }
        },
        {
            name: "Innocuous Strikes",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Immobilize", "Melee AoE Damage", "Slow Movement", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You repeatedly batter your foes' feet and legs with a flurry of sweeps of your staff. This attack deals Smashing damage to all foes within its cone. All affected targets will have their movement speed reduced, with a chance of being immobilized briefly. While a form is active, this power will build one level of Perfection.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>5</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "Melee (Cone), DMG(Smash), Foe Immobilize, -Speed",
            icon: "stafffighting_innocuousstrikes.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.05,
                range: 9.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 2.17
            }
        },
        {
            name: "Sky Splitter",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You leap into the air and hammer your foe with an overhead bash from your staff. Sky Splitter deals Smashing damage, will knock the target into the air and will briefly disorient your target. While a form is active, this power will build one level of Perfection if the user has two or less levels, if the user has three levels of Perfection it will consume them and gain some benefit. 3 Levels of Perfection of Body will cause additional smashing damage and grant the user a bonus to damage resistance a short time. 3 Levels of Perfection of Mind will cause additional psionic damage and boost the user's chance to hit for a short time. 3 Levels of Perfection of Soul will cause additional energy damage and increase the user's regeneration and recovery rate briefly.",
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
    POWERSETS['tanker/staff-fighting'] = TANKER_STAFF_FIGHTING_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_STAFF_FIGHTING_POWERSET = TANKER_STAFF_FIGHTING_POWERSET;
}