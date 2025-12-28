/**
 * City of Heroes: Ice Blast
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ice-blast'] = {
    name: "Ice Blast",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Ice Blast",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.64
                                },
                                "rechargeDebuff": 0.2,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Ice Bolt",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
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
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                },
                                "slow": 0.2,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Frost Breath",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 40.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.7
                                },
                                "rechargeDebuff": 0.2,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Aim",
                    "available": 5,
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
                    "name": "Freeze Ray",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Ice Storm",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
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
                                "recharge": 60.0,
                                "endurance": 15.6,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Bitter Ice Blast",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 2.28
                                },
                                "rechargeDebuff": 0.2,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Bitter Freeze Ray",
                    "available": 21,
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
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 2.76
                                },
                                "rechargeDebuff": 0.2,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Blizzard",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 2.0,
                                "range": 60.0,
                                "recharge": 170.0,
                                "endurance": 27.716,
                                "cast": 2.03
                    }
        }
    ]
};
