/**
 * Dark Miasma
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_DARK_MIASMA_POWERSET = {
    name: "Dark Miasma",
    category: "Unknown",
    description: "Dark Miasma powerset",
    icon: "dark-miasma_set.png",
    powers: [
        {
            name: "Tar Patch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Slow Movement"],
            description: "Drops a large patch of viscous Negative Energy which dramatically slows down enemies that run through it and reduces their damage resistance. Affected targets stuck in the Tar Patch cannot jump or fly.",
            shortHelp: "Ranged (Location AoE), Target -Speed, -Res, -Fly",
            icon: "darkmiasma_tarpatch.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 90.0,
                recharge: 90.0,
                endurance: 7.8,
                cast: 3.1,
                buffDuration: 45.0
            }
        },
        {
            name: "Twilight Grasp",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "To Hit Debuff"],
            description: "You channel Negative Energy from the Netherworld through yourself to a targeted foe. Twilight Grasp drains the power from that target and slowly transfers it to you and all nearby allies. The targeted foe's chance to hit, damage and regeneration rate are reduced, while you and your nearby allies are healed.",
            shortHelp: "Ranged, Foe -To Hit, -DMG, -Regen, Team Heal",
            icon: "darkmiasma_twilightgrasp.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 7.8,
                cast: 2.37,
                tohitDebuff: 0.5,
                buffDuration: 20.0
            }
        },
        {
            name: "Darkest Night",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["To Hit Debuff"],
            description: "While active, you channel Negative Energy onto a targeted foe. While Darkest Night is active the target, and all foes nearby, will have their chance to hit and Damage potential reduced as long as you keep the power active.",
            shortHelp: "Toggle: Ranged (Targeted AoE), Foe -DMG, -To Hit",
            icon: "darkmiasma_darkestnight.png",
            powerType: "Toggle",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                endurance: 0.26,
                cast: 3.17,
                buffDuration: 0.75,
                tohitDebuff: 1.5
            }
        },
        {
            name: "Howling Twilight",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Ranged AoE Damage", "Slow Movement", "Stuns", "Universal Damage Sets"],
            description: "Activating this power channels the power of the Netherworld to weaken your foes, in an attempt to revive all nearby fallen allies. You must stand near your defeated allies to revive them, then select a foe. The selected foe and all nearby foes will be Slowed, Disoriented, have their Regeneration rate reduced and drained of some life. Revived allies will have full Hit Points and Endurance and will be protected from XP Debt for 90 seconds.",
            shortHelp: "Ranged (AoE), Minor DMG(Negative), Target Slow, -Recharge, -Regen, Disorient, Ally Rez",
            icon: "darkmiasma_howlingtwilight.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 180.0,
                endurance: 26.0,
                cast: 3.17,
                damage: {
                    type: "Negative",
                    scale: 0.25
                },
                buffDuration: 30.0,
                stun: 3.0
            }
        },
        {
            name: "Shadow Fall",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Resist Damage"],
            description: "Envelops you and your nearby teammates in a shroud of darkness. Shadow Fall does not grant Invisibility, but it does make you harder to detect. Even if you are discovered, Shadow Fall grants a bonus to Defense bonus to all attacks and Resistance to Fear, while reducing Energy, Negative Energy, and Psionic Damage.",
            shortHelp: "Toggle: PBAoE, Team Stealth, +DEF(All), +Res(Energy, Negative, Psionics, Fear)",
            icon: "darkmiasma_shadowfall.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 0.26,
                cast: 2.03,
                buffDuration: 0.75
            }
        },
        {
            name: "Fearsome Stare",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Fear", "To Hit Debuff"],
            description: "Instills tremendous Fear within a cone area in front of you, causing all affected targets to tremble in Terror uncontrollably, attacking only when attacked and even then with a reduced chance to hit.",
            shortHelp: "Ranged (Cone), Foe Fear, -To Hit",
            icon: "darkmiasma_fearsomeaura.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 40.0,
                endurance: 8.528,
                cast: 2.03,
                tohitDebuff: 1.5,
                buffDuration: 20.0
            }
        },
        {
            name: "Petrifying Gaze",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Holds"],
            description: "Petrifies a single targeted foe with a terrifying gaze. The victim is Held and defenseless.",
            shortHelp: "Ranged Hold",
            icon: "darkmiasma_petrifyinggaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 16.0,
                endurance: 7.8,
                cast: 1.67
            }
        },
        {
            name: "Black Hole",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "Opens up a Black Hole to the Netherworld that temporarily pulls in all foes within its grasp. Victims that are immune to the pull become phase shifted and are completely intangible. They are hard to see, and cannot affect or be affected by those in normal space.",
            shortHelp: "Ranged (Targeted AoE), Foe Intangible",
            icon: "darkmiasma_blackhole.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 120.0,
                endurance: 13.0,
                cast: 1.03
            }
        },
        {
            name: "Dark Servant",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "Holds", "Immobilize", "To Hit Debuff"],
            description: "Summons a Dark Servant to your aid. The Dark Servant possesses an assortment of dark powers to weaken your foes. The summoned entity is not a willing servant, and it is only your power that binds it in this realm. The Dark Servant can be buffed and healed.",
            shortHelp: "Summon Dark Servant: Ranged Debuff Special",
            icon: "darkmiasma_darkservant.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 240.0,
                endurance: 26.0,
                cast: 3.17,
                buffDuration: 240.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/dark-miasma'] = CORRUPTOR_DARK_MIASMA_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_DARK_MIASMA_POWERSET = CORRUPTOR_DARK_MIASMA_POWERSET;
}