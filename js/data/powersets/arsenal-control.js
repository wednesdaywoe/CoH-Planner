/**
 * City of Heroes: Arsenal Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['arsenal-control'] = {
    name: "Arsenal Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Cryo Freeze Ray",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.25,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.0
                                },
                                "slow": 0.3,
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Tranquilizer",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.15,
                                "range": 80.0,
                                "recharge": 6.0,
                                "endurance": 5.2,
                                "cast": 1.4,
                                "damage": {
                                            "scale": 1.54
                                },
                                "slow": 0.1
                    }
        },
        {
                    "name": "Sleep Grenade",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 80.0,
                                "recharge": 45.0,
                                "endurance": 15.6,
                                "cast": 1.87
                    }
        },
        {
                    "name": "Liquid Nitrogen",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
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
                                "recharge": 90.0,
                                "endurance": 10.4,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Cloaking Device",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.182,
                                "cast": 0.73
                    }
        },
        {
                    "name": "Smoke Canister",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 80.0,
                                "recharge": 90.0,
                                "endurance": 16.64,
                                "cast": 1.4
                    }
        },
        {
                    "name": "Flash Bang",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.85,
                                "range": 70.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 1.87,
                                "damage": {
                                            "scale": 0.25
                                }
                    }
        },
        {
                    "name": "Tear Gas",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.85,
                                "range": 80.0,
                                "recharge": 180.0,
                                "endurance": 15.6,
                                "cast": 1.87
                    }
        },
        {
                    "name": "Tri-Cannon",
                    "available": 25,
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
                                "range": 50.0,
                                "recharge": 240.0,
                                "endurance": 26.0,
                                "cast": 1.0
                    }
        }
    ]
};
