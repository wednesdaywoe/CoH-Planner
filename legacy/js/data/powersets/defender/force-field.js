/**
 * Force Field
 * Character Level: 50
 * Archetype: defender
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DEFENDER_FORCE_FIELD_POWERSET = {
    name: "Force Field",
    category: "Unknown",
    description: "Force Field powerset",
    icon: "force-field_set.png",
    powers: [
        {
            name: "Deflection Shield",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Dramatically protects an ally from Smashing, Lethal and all Melee attacks for a limited time. Also reduces Toxic damage. You cannot stack multiple Deflection Shields on the same target; however, the shield can be improved by another ally using the same power. Can also be used in conjunction with your Insulation Shield. You cannot use this power on yourself.",
            shortHelp: "Ranged, Ally +DEF(Smash, Lethal, Melee), Res(Toxic)",
            icon: "forcefield_deflectionshield.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.0,
                endurance: 7.8,
                cast: 2.07,
                dotDamage: {
                    type: "Toxic",
                    scale: 4.0,
                    ticks: 120
                },
                buffDuration: 240.0
            }
        },
        {
            name: "Personal Force Field",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "The Personal Force Field is almost impenetrable to all attacks, even Psionics and Enemy Teleportation, although attacks from more powerful foes may get through more easily. Personal Force Field will also reduce the damage of almost any attacks that do get through. The Personal Force Field works both ways; while it is active, you can only use powers that affect yourself. Cannot be used with Rest.",
            shortHelp: "Toggle: Self +Def, Res(All except Toxic)",
            icon: "forcefield_personalforcefield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 0.13,
                cast: 2.03,
                resistance: {
                    smashing: 0.4,
                    lethal: 0.4,
                    fire: 0.4,
                    cold: 0.4,
                    energy: 0.4,
                    negative: 0.4,
                    psionic: 0.4,
                    toxic: 0.4
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Repulsion Bolt",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "Discharges a bolt of force that knocks down foes and deals some Smashing Damage. Foes struck will have their armor shattered by the force of the impact, leaving them with lowered damage resistance.",
            shortHelp: "Ranged, DMG(Smash), Foe Knockback",
            icon: "forcefield_forcebolt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.4,
                range: 80.0,
                recharge: 4.0,
                endurance: 10.192,
                cast: 1.1,
                damage: {
                    type: "Smashing",
                    scale: 0.2
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Insulation Shield",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Dramatically protects an ally from Fire, Cold, Energy, Negative Energy, Ranged and AoE attacks for a limited time. The Insulation also protects the target from Endurance Draining effects. You cannot stack multiple Insulation Shields on the same target; however, the shield can be improved by another ally using the same power. Can also be used in conjunction with your Deflection Shield. In PvP, this power also grants a small amount of Mez Protection to its primary target. You cannot use this power on yourself.",
            shortHelp: "Ranged, Ally +DEF(Fire, Cold, Energy, Negative, Ranged, AoE), Res (End Drain)",
            icon: "forcefield_insulationshield.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.0,
                endurance: 7.8,
                cast: 2.07,
                buffDuration: 240.0,
                stun: 1.0,
                stunDuration: 90.0
            }
        },
        {
            name: "Detention Field",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "Encases a targeted foe in a Detention Force Field. The captured target cannot be harmed, is Immobilized, and cannot attack or aid their allies. The target can, however, use powers on themselves.",
            shortHelp: "Ranged, Foe Capture (Special)",
            icon: "forcefield_refractionshield.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.4,
                range: 80.0,
                recharge: 60.0,
                endurance: 10.4,
                cast: 2.07,
                buffDuration: 30.0
            }
        },
        {
            name: "Dispersion Bubble",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Creates a large bubble which protects all allies inside. While active, the Dispersion Bubble gives all allies within increased Defense against all attack types. The Dispersion Bubble also protects allies from Immobilization, Disorient, and Hold effects.<br><br>Allies will retain bonuses from the bubble for some after leaving the bubble's area.",
            shortHelp: "Toggle: PBAoE, Team +Res(Hold, Immobilize, Disorient) +DEF(All)",
            icon: "forcefield_dispersionbubble.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 1.04,
                cast: 1.07,
                buffDuration: 15.0,
                stun: 1.0,
                stunDuration: 15.0
            }
        },
        {
            name: "Repulsion Field",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Knockback"],
            description: "This Toggle power creates a field that keeps all foes at bay, protecting all allies inside from melee or short ranged attacks. More powerful foes may be able to penetrate the Repulsion Field, but may slip and get knocked down and forced back if they try.<br><br>Enemies that get too close will be violently knocked away. In PvP, Each villain that is knocked away costs you additional Endurance.<br><br><color #fcfc95>Note: Slotting Knockback to Knockdown enhancement in this power will disable Repel.</color>",
            shortHelp: "Toggle: PBAoE Knockback",
            icon: "forcefield_repulsionfield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 0.1625,
                cast: 2.03
            }
        },
        {
            name: "Force Bomb",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "A powerful Force Bomb is hurled at your foes dealing a moderate amount of damage and knocking them off of their feet. Foes struck by Repulsion Bomb have a chance to become disoriented, and the force of the blow will leave their armor shattered, lowering their damage resistance.",
            shortHelp: "Ranged (Targeted AoE), DMG(Smash), Foe Knockdown, Disorient",
            icon: "forcefield_repulsionbomb.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.2,
                range: 70.0,
                recharge: 30.0,
                endurance: 16.9,
                cast: 1.67,
                damage: {
                    type: "Smashing",
                    scale: 0.6
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Damping Bubble",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Creates a large bubble at your location which protects all allies inside. While active, this power will grant resistance to Accuracy, Defense, Regeneration, Perception, and Slow debuffs on yourself and allies. Foes within this bubble will have the strength of their Accuracy, Defense, Regeneration, Perception, and Speed debuff powers weakened directly.",
            shortHelp: "Location (PBAoE), Team +Res(Accuracy, Defense, Perception, Recharge, Regen, Speed, ToHit), Foe -Str(Defense, Perception, Regen, Speed, ToHit)",
            icon: "forcefield_dampeningbubble.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 25.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.07,
                buffDuration: 45.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['defender/force-field'] = DEFENDER_FORCE_FIELD_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DEFENDER_FORCE_FIELD_POWERSET = DEFENDER_FORCE_FIELD_POWERSET;
}