/**
 * City of Heroes: Archery (Blaster Ranged)
 * 
 * Extracted from raw_data_homecoming with updated converter
 * 
 * COMPLETE 9-POWER SET DEMONSTRATION
 * Shows all new fields: allowedSetCategories, description, shortHelp, 
 * icon, powerType, targetType, effectArea, maxTargets, arc
 */

const ARCHERY_POWERSET = {
    name: "Archery",
    category: "Blaster_RANGED",
    description: "Archery focuses on lethal ranged damage with a mix of single-target and area attacks.",
    icon: "archery_set.png",
    powers: [
        {
            "name": "Snap Shot",
            "available": 0,
            "tier": 1,
            "maxSlots": 6,
            "allowedEnhancements": [
                "EnduranceReduction",
                "Range",
                "Recharge",
                "Damage",
                "Accuracy"
            ],
            "allowedSetCategories": [
                "Blaster Archetype Sets",
                "Ranged Damage",
                "Universal Damage Sets"
            ],
            "description": "A quick attack that fires an arrow at your foe after only minimal aiming. Fast, but little damage.",
            "shortHelp": "Ranged, DMG(Lethal)",
            "icon": "archery_quickarrow.png",
            "powerType": "Click",
            "targetType": "Foe (Alive)",
            "effectArea": "SingleTarget",
            "effects": {
                "accuracy": 1.155,
                "range": 80,
                "recharge": 2,
                "endurance": 3.536,
                "cast": 1.0,
                "damage": {
                    "type": "Lethal",
                    "scale": 0.84
                }
            }
        },
        {
            "name": "Aimed Shot",
            "available": 0,
            "tier": 1,
            "maxSlots": 6,
            "allowedEnhancements": [
                "EnduranceReduction",
                "Range",
                "Recharge",
                "Damage",
                "Accuracy"
            ],
            "allowedSetCategories": [
                "Blaster Archetype Sets",
                "Ranged Damage",
                "Universal Damage Sets"
            ],
            "description": "Though it takes longer to execute, your Aimed Shot deals greater damage than Snap Shot.",
            "shortHelp": "Ranged, DMG(Lethal)",
            "icon": "archery_mediumarrow.png",
            "powerType": "Click",
            "targetType": "Foe (Alive)",
            "effectArea": "SingleTarget",
            "effects": {
                "accuracy": 1.155,
                "range": 80,
                "recharge": 6,
                "endurance": 5.2,
                "cast": 1.67,
                "damage": {
                    "type": "Lethal",
                    "scale": 1.32
                }
            }
        },
        {
            "name": "Fistful of Arrows",
            "available": 1,
            "tier": 1,
            "maxSlots": 6,
            "allowedEnhancements": [
                "EnduranceReduction",
                "Range",
                "Recharge",
                "Damage",
                "Accuracy"
            ],
            "allowedSetCategories": [
                "Blaster Archetype Sets",
                "Ranged AoE Damage",
                "Universal Damage Sets"
            ],
            "description": "You fire a fistful of arrows at foes in a cone in front of you. Good at close range.",
            "shortHelp": "Ranged (Cone), DMG(Lethal)",
            "icon": "archery_conearrow.png",
            "powerType": "Click",
            "targetType": "Foe (Alive)",
            "effectArea": "Cone",
            "maxTargets": 10,
            "arc": 0.5236,
            "effects": {
                "accuracy": 1.155,
                "range": 50,
                "recharge": 8,
                "endurance": 8.528,
                "cast": 1.17,
                "damage": {
                    "type": "Lethal",
                    "scale": 0.91
                }
            }
        },
        {
            "name": "Blazing Arrow",
            "available": 5,
            "tier": 2,
            "maxSlots": 6,
            "allowedEnhancements": [
                "EnduranceReduction",
                "Range",
                "Recharge",
                "Damage",
                "Accuracy"
            ],
            "allowedSetCategories": [
                "Blaster Archetype Sets",
                "Ranged Damage",
                "Universal Damage Sets"
            ],
            "description": "You fire a Blazing Arrow at your foe, dealing some Lethal damage and causing them to catch on fire and burn.",
            "shortHelp": "Ranged, DMG(Lethal), DoT(Fire)",
            "icon": "archery_flamingarrow.png",
            "powerType": "Click",
            "targetType": "Foe (Alive)",
            "effectArea": "SingleTarget",
            "effects": {
                "accuracy": 1.155,
                "range": 80,
                "recharge": 10,
                "endurance": 10.192,
                "cast": 1.83,
                "damage": {
                    "type": "Lethal",
                    "scale": 1.96
                },
                "dotDamage": {
                    "type": "Fire",
                    "scale": 0.125,
                    "ticks": 4
                }
            }
        },
        {
            "name": "Aim",
            "available": 7,
            "tier": 3,
            "maxSlots": 6,
            "allowedEnhancements": [
                "EnduranceReduction",
                "Recharge",
                "ToHitBuff"
            ],
            "allowedSetCategories": [
                "To Hit Buff"
            ],
            "description": "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.",
            "shortHelp": "Self +To Hit, +DMG",
            "icon": "archery_aim.png",
            "powerType": "Click",
            "targetType": "Self",
            "effectArea": "SingleTarget",
            "effects": {
                "accuracy": 1.0,
                "recharge": 90,
                "endurance": 5.2,
                "cast": 1.17,
                "tohitBuff": 5.0,
                "damageBuff": 5.0,
                "buffDuration": 10.0
            }
        },
        {
            "name": "Explosive Arrow",
            "available": 11,
            "tier": 3,
            "maxSlots": 6,
            "allowedEnhancements": [
                "EnduranceReduction",
                "Range",
                "Recharge",
                "Knockback",
                "Damage",
                "Accuracy"
            ],
            "allowedSetCategories": [
                "Blaster Archetype Sets",
                "Knockback",
                "Ranged AoE Damage",
                "Universal Damage Sets"
            ],
            "description": "You fire a grenade-tipped arrow at long range. This explosion affects all within the blast radius, and can knock them back.",
            "shortHelp": "Ranged (Targeted AoE), DMG(Lethal/Fire), Knockback",
            "icon": "archery_explodingarrow.png",
            "powerType": "Click",
            "targetType": "Foe (Alive)",
            "effectArea": "AoE",
            "maxTargets": 16,
            "effects": {
                "accuracy": 1.155,
                "range": 80,
                "recharge": 16,
                "endurance": 15.184,
                "cast": 1.0,
                "damage": {
                    "types": [
                        {
                            "type": "Fire",
                            "scale": 0.45
                        },
                        {
                            "type": "Lethal",
                            "scale": 0.45
                        }
                    ],
                    "scale": 0.9
                }
            }
        },
        {
            "name": "Ranged Shot",
            "available": 17,
            "tier": 4,
            "maxSlots": 6,
            "allowedEnhancements": [
                "InterruptReduction",
                "EnduranceReduction",
                "Range",
                "Recharge",
                "Damage",
                "Accuracy"
            ],
            "allowedSetCategories": [
                "Blaster Archetype Sets",
                "Ranged Damage",
                "Sniper Attacks",
                "Universal Damage Sets"
            ],
            "description": "A long range shot that blasts your foes. Like most sniper attacks, this power has a bonus to Accuracy, but is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            "shortHelp": "Sniper, DMG(Lethal), Self +Range",
            "icon": "archery_sniperarrow.png",
            "powerType": "Click",
            "targetType": "Foe (Alive)",
            "effectArea": "SingleTarget",
            "effects": {
                "accuracy": 1.155,
                "range": 150,
                "recharge": 12,
                "endurance": 14.352,
                "cast": 1.67
            }
        },
        {
            "name": "Stunning Shot",
            "available": 21,
            "tier": 5,
            "maxSlots": 6,
            "allowedEnhancements": [
                "EnduranceReduction",
                "Range",
                "Disorient",
                "Recharge",
                "Damage",
                "Accuracy"
            ],
            "allowedSetCategories": [
                "Blaster Archetype Sets",
                "Ranged Damage",
                "Stuns",
                "Universal Damage Sets"
            ],
            "description": "You fire a blunt, weighted arrow at your target's chest. The Stunning Shot has a good chance of stunning your foe.",
            "shortHelp": "Ranged Disorient, DMG(Smashing)",
            "icon": "archery_stunarrow.png",
            "powerType": "Click",
            "targetType": "Foe (Alive)",
            "effectArea": "SingleTarget",
            "effects": {
                "accuracy": 1.155,
                "range": 60,
                "recharge": 20,
                "endurance": 10.192,
                "cast": 1.0,
                "damage": {
                    "type": "Smashing",
                    "scale": 0.25
                },
                "stun": 3.0,
                "stunDuration": 10.0
            }
        },
        {
            "name": "Rain of Arrows",
            "available": 25,
            "tier": 5,
            "maxSlots": 6,
            "allowedEnhancements": [
                "EnduranceReduction",
                "Range",
                "Recharge",
                "Damage",
                "Accuracy"
            ],
            "allowedSetCategories": [
                "Blaster Archetype Sets",
                "Ranged AoE Damage",
                "Universal Damage Sets"
            ],
            "description": "You unleash a Rain of Arrows on a targeted location, damaging foes within a large area.",
            "shortHelp": "Ranged (Location AoE), DoT(Lethal)",
            "icon": "archery_rainofarrows.png",
            "powerType": "Click",
            "targetType": "Location",
            "effectArea": "Location",
            "effects": {
                "accuracy": 1.0,
                "range": 90,
                "recharge": 65,
                "endurance": 20.8,
                "cast": 2.0
            }
        }
    ]
};

// Register the powerset so the app can find it
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['archery'] = ARCHERY_POWERSET;
} else {
    window.ARCHERY_POWERSET = ARCHERY_POWERSET;
}
