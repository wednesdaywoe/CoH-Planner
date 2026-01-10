/**
 * Electrical Blast
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_ELECTRICAL_BLAST_POWERSET = {
    name: "Electrical Blast",
    category: "Unknown",
    description: "Electrical Blast powerset",
    icon: "electrical-blast_set.png",
    powers: [
        {
            name: "Charged Bolts",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can quickly hurl small bolts of electricity at foes, dealing some damage and draining some Endurance. Some of this Endurance may transfer back to you. Charged Bolts deals light damage but recharges quickly.",
            shortHelp: "Ranged, DMG(Energy), Foe -End",
            icon: "electricalbolt_chargedbolts.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Energy",
                    scale: 2.26
                }
            }
        },
        {
            name: "Lightning Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can send a large blast of electrical energy at a foe, dealing heavy damage and draining some Endurance. Some of this Endurance may transfer back to you. Lightning Bolt deals more damage than Charged Bolts, but recharges more slowly.",
            shortHelp: "Ranged, DMG(Energy), Foe -End",
            icon: "electricalbolt_lightningbolt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 3.529
                }
            }
        },
        {
            name: "Ball Lightning",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Hurls a highly charged ball of lightning that explodes on contact. Ball Lightning deals good damage in an area of effect, and drains some Endurance from each target it hits.",
            shortHelp: "Ranged (Targeted AoE), DoT(Energy), Foe -End",
            icon: "electricalbolt_balllightning.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.07,
                damage: {
                    type: "Energy",
                    scale: 1.341
                },
                dotDamage: {
                    type: "Energy",
                    scale: 0.0725,
                    ticks: 3
                },
                buffDuration: 2.2
            }
        },
        {
            name: "Zapping Bolt",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A focused electrical blast that can be fired off at a quick speed with high Accuracy. Zapping Bolt drains Endurance.",
            shortHelp: "Ranged, DMG(Energy), Foe -End",
            icon: "electricalbolt_heavy.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.0,
                damage: {
                    type: "Energy",
                    scale: 3.46
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Charge Up",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage and endurance modification.",
            shortHelp: "Self +To Hit, +DMG, +Range, +End Mod",
            icon: "electricalbolt_aim.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 4.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Tesla Cage",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Holds", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Tesla Cage confines the target in an electrical prison. The target is overwhelmed by the electrical charge and is left helpless and can be attacked. The target is drained of some Endurance and some of that Endurance may be transferred back to you.<br><br>Taking this power allows you to build Static with each activation of other electrical blast attacks. As Static builds, you can unleash it with Tesla Cage as electricity will jump off your main target and shock others nearby!",
            shortHelp: "Ranged, DMG(Energy), Foe Hold, -End",
            icon: "electricalbolt_telsacage.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Chain",
            maxTargets: 1,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 2.17,
                damage: {
                    type: "Energy",
                    scale: 4.329
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Voltaic Sentinel",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Pet Damage", "Recharge Intensive Pets", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can manifest a polarized electricity field that hovers above the ground and hurls bolts of electricity at nearby foes. Any enemy that passes near this Sentinel risks serious injury. The Sentinel is not alive and cannot be targeted or attacked by enemies. The Sentinel can fly and will follow you.",
            shortHelp: "Summon Sentinel: Ranged, DMG(Energy), Foe -End",
            icon: "electricalbolt_voltaicsentinal.png",
            powerType: "Toggle",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 2.0,
                range: 40.0,
                recharge: 10.0,
                endurance: 0.52,
                cast: 3.1
            }
        },
        {
            name: "Short Circuit",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Releases a burst of electrical energy around you, shocking all nearby foes. This highly accurate discharge deals Moderate damage over time, drains a lot of Endurance from the targets and renders them unable to recover Endurance for quite a while. Additionally, Short Circuit deals extra damage to most robots and mechanical foes. Short Circuit is very effective when used with your other Endurance draining powers.",
            shortHelp: "PBAoE, DoT(Energy), Foe -End, -Recovery",
            icon: "electricalbolt_shortcircuit.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.3,
                recharge: 20.0,
                endurance: 15.6,
                cast: 2.5,
                dotDamage: {
                    type: "Energy",
                    scale: 0.3275,
                    ticks: 4
                },
                buffDuration: 1.5
            }
        },
        {
            name: "Thunderous Blast",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You hurl a tremendously powerful bolt of lightning at a target, devastating all nearby foes. Thunderous Blast deals extreme Energy and Smashing damage and drains a lot of Endurance from nearby foes.",
            shortHelp: "Ranged (Targeted AoE), DMG(Energy), Foe -End, -Recovery",
            icon: "electricalbolt_thunderouseblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.4,
                range: 40.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.93,
                damage: {
                    type: "Energy",
                    scale: 3.7658
                },
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/electrical-blast'] = SENTINEL_ELECTRICAL_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_ELECTRICAL_BLAST_POWERSET = SENTINEL_ELECTRICAL_BLAST_POWERSET;
}