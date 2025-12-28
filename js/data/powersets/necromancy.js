/**
 * City of Heroes: Necromancy
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['necromancy'] = {
    name: "Necromancy",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Dark Blast",
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 6.5,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Zombie Horde",
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
                                "cast": 3.1
                    }
        },
        {
                    "name": "Gloom",
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 10.66,
                                "cast": 1.1,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Enchant Undead",
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
                                "cast": 2.07
                    }
        },
        {
                    "name": "Life Drain",
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
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 8.0,
                                "endurance": 10.66,
                                "cast": 1.93,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Grave Knight",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
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
                                "cast": 1.07
                    }
        },
        {
                    "name": "Soul Extraction",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 150.0,
                                "endurance": 15.0,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Lich",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 15.0,
                                "endurance": 13.18,
                                "cast": 3.17
                    }
        },
        {
                    "name": "Dark Empowerment",
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
                                "cast": 2.07
                    }
        }
    ]
};
