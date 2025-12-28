/**
 * City of Heroes: Mercenaries
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['mercenaries'] = {
    name: "Mercenaries",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Burst",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 90.0,
                                "recharge": 4.0,
                                "endurance": 6.5,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.27
                                }
                    }
        },
        {
                    "name": "Soldiers",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 5.0,
                                "endurance": 5.46,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Slug",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 100.0,
                                "recharge": 8.0,
                                "endurance": 10.66,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Equip Mercenary",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 50.0,
                                "recharge": 6.0,
                                "endurance": 11.375,
                                "cast": 1.3
                    }
        },
        {
                    "name": "M30 Grenade",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 80.0,
                                "recharge": 16.0,
                                "endurance": 18.98,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.602
                                }
                    }
        },
        {
                    "name": "Spec Ops",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 10.0,
                                "endurance": 9.62,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Serum",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 100.0,
                                "recharge": 250.0,
                                "endurance": 15.0,
                                "cast": 1.3,
                                "damage": {
                                            "scale": 4.0
                                },
                                "dotDamage": 4.0,
                                "dotTicks": 30
                    }
        },
        {
                    "name": "Commando",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 15.0,
                                "endurance": 13.18,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Tactical Upgrade",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 50.0,
                                "recharge": 10.0,
                                "endurance": 11.375,
                                "cast": 2.03
                    }
        }
    ]
};
