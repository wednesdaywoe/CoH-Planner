/**
 * Illusion Control
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_ILLUSION_CONTROL_POWERSET = {
    name: "Illusion Control",
    category: "Unknown",
    description: "Illusion Control powerset",
    icon: "illusion-control_set.png",
    powers: [
        {
            name: "Blind",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged Damage", "Sleep", "Universal Damage Sets"],
            description: "Painfully Blinds a single targeted foe so severely that they are rendered helpless. Blind is so bright that additional foes may also be blinded, though they will not take any damage, and attacking them will free them from the effects.",
            shortHelp: "Ranged (Targeted AoE), DMG(Psionic), Foe Hold/Sleep",
            icon: "illusions_blind.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 9.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 2.9291
                }
            }
        },
        {
            name: "Spectral Wall",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Dominator Archetype Sets", "Immobilize", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "Creates an illusionary wall of specters that prevents enemies from moving. As the foe is surrounded, they take psionic damage over time.",
            shortHelp: "Ranged, DoT (Psionic), Foe Immobilize, -ToHit",
            icon: "illusions_immob.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.33,
                dotDamage: {
                    type: "Psionic",
                    scale: 0.49820000000000003,
                    ticks: 4
                },
                buffDuration: 9.2,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Deceive",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Confuse", "Dominator Archetype Sets"],
            description: "You can Deceive an enemy into believing their friends are not who they appear to be. If successful, the enemy will ignore you and attack their own allies. If you Deceive someone before they have noticed you, your presence will continue to be masked. Damage done by a Deceived enemy will reduce the total amount of Experience Points awarded when a foe is defeated.",
            shortHelp: "Ranged, Foe Confuse",
            icon: "illusions_decieve.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.0
            }
        },
        {
            name: "Spectral Terror",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Dominator Archetype Sets", "Fear", "To Hit Debuff"],
            description: "You can create an illusion of unspeakable Terror. The manifestation is so horrible that it caused most foes to tremble helplessly in terror. The Spectral Terror may also Terrify individual foes, causing them to run away in panic.",
            shortHelp: "Summon Terror: Ranged Fear, -ToHit",
            icon: "illusions_spectralterror.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 45.0,
                endurance: 16.64,
                cast: 3.2,
                buffDuration: 45.0
            }
        },
        {
            name: "Superior Invisibility",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "You can bend light around yourself to become completely Invisible. While this power is active, you are all but impossible to detect, and have an extremely high Defense bonus to all attacks. Superior Invisibility is the only toggle invisibility power that allows you to attack while it is active, although you will lose some of your defense bonus if you do so.",
            shortHelp: "Toggle: Self Stealth, +DEF(All)",
            icon: "illusions_invisibility.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.182,
                cast: 0.73,
                buffDuration: 0.75
            }
        },
        {
            name: "Gleam",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "Multiple flashing lights go off around enemies, disorienting and damaging them. Gleam deals minimal Psionic damage, and can Disorient all affected targets for a good while.",
            shortHelp: "Ranged (Targeted AoE), DMG(Psionic), Foe Disorient",
            icon: "illusions_stun.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            arc: 1.5708,
            effects: {
                accuracy: 0.8,
                range: 70.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.5,
                damage: {
                    type: "Psionic",
                    scale: 0.5
                },
                stun: 4.0
            }
        },
        {
            name: "Phantom Army",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "You can fabricate 3 Phantom heroes around a targeted foe. These Phantoms are not real, and are indestructible. Though they deal damage, it is illusory and will heal if the victim survives long enough. Phantoms are short lived and cannot be buffed or healed.",
            shortHelp: "Summon Decoys: Ranged DMG(Psionic)",
            icon: "illusions_phantomarmy2.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 240.0,
                endurance: 26.0,
                cast: 3.1,
                buffDuration: 60.0
            }
        },
        {
            name: "Flash",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds"],
            description: "Generates a brilliant flash of light around you that blinds nearby foes. Flashed foes are rendered helpless and unable to defend themselves.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>8</color> seconds and each affected foe will increase the recharge by <color #FF7F27>14.5</color> seconds for a maximum total of <color #FF7F27>240</color> seconds.</color>",
            shortHelp: "PBAoE, Foe Hold",
            icon: "illusions_flash.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                recharge: 8.0,
                endurance: 8.528,
                cast: 3.0
            }
        },
        {
            name: "Phantasm",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "You can construct a powerful entity composed of pure light. Although made of light, the Phantasm is tangible and has powerful Energy attacks. The Phantasm can also fly and summon duplicates of itself. The duplicates are intangible, and cannot be harmed. The duplicates' attacks deal illusory damage similar to that dealt by Spectral Wounds. Only the original Phantasm can be healed and buffed. Type ''/release_pets'' in the chat window to release all your pets.",
            shortHelp: "Summon Phantasm: Ranged, DMG(Smash/Energy/Psionic)",
            icon: "illusions_phantasm.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 240.0,
                endurance: 26.0,
                cast: 2.03
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/illusion-control'] = DOMINATOR_ILLUSION_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_ILLUSION_CONTROL_POWERSET = DOMINATOR_ILLUSION_CONTROL_POWERSET;
}