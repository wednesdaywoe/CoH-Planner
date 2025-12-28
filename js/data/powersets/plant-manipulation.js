/**
 * City of Heroes: Plant Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['plant-manipulation'] = {
    name: "Plant Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Entangle",
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
                                "accuracy": 1.2,
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 0.1
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 4,
                                "buffDuration": 9.2
                    }
        },
        {
                    "name": "Skewer",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.23,
                                "damage": {
                                            "scale": 1.96
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "defenseDebuff": 2.0
                    }
        },
        {
                    "name": "Strangler",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 60.0,
                                "recharge": 16.0,
                                "endurance": 11.388,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 2,
                                "buffDuration": 4.2
                    }
        },
        {
                    "name": "Toxins",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 5.2,
                                "cast": 1.17,
                                "tohitBuff": 2.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Spore Cloud",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 0.26,
                                "cast": 3.1,
                                "damage": {
                                            "scale": 1.125
                                },
                                "tohitDebuff": 0.75,
                                "buffDuration": 0.75
                    }
        },
        {
                    "name": "Wild Fortress",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "cast": 2.27,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 1,
                                "absorption": 0.15,
                                "buffDuration": 12.0
                    }
        },
        {
                    "name": "Ripper",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 13.0,
                                "endurance": 12.688,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 1.95
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 2,
                                "buffDuration": 4.1,
                                "defenseDebuff": 3.0
                    }
        },
        {
                    "name": "Vines",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 80.0,
                                "recharge": 90.0,
                                "endurance": 20.18,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Thorn Burst",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 17.0,
                                "endurance": 16.016,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.95
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "defenseDebuff": 3.0
                    }
        }
    ]
};
