/**
 * City of Heroes: Titan Weapons
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['titan-weapons'] = {
    name: "Titan Weapons",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Crushing Blow",
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
                                "range": 9.0,
                                "recharge": 8.0,
                                "endurance": 8.7838,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Defensive Sweep",
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
                                "range": 10.0,
                                "recharge": 4.0,
                                "endurance": 5.356,
                                "cast": 2.2
                    }
        },
        {
                    "name": "Titan Sweep",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 10.0,
                                "recharge": 10.0,
                                "endurance": 10.4982,
                                "cast": 2.43
                    }
        },
        {
                    "name": "Follow Through",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 9.0,
                                "recharge": 10.0,
                                "endurance": 10.4978,
                                "cast": 1.1,
                                "damage": {
                                            "scale": 1.96
                                }
                    }
        },
        {
                    "name": "Build Momentum",
                    "available": 7,
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
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Confront",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 3.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Rend Armor",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 9.0,
                                "recharge": 16.0,
                                "endurance": 15.6395,
                                "cast": 2.3
                    }
        },
        {
                    "name": "Whirling Smash",
                    "available": 21,
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
                                "recharge": 14.0,
                                "endurance": 13.9256,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.04
                                }
                    }
        },
        {
                    "name": "Arc of Destruction",
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
                                "range": 10.0,
                                "recharge": 16.0,
                                "endurance": 15.6395,
                                "cast": 2.7
                    }
        }
    ]
};
