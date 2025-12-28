/**
 * City of Heroes: Kinetics
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['kinetics'] = {
    name: "Kinetics",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Siphon Power",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 20.0,
                                "endurance": 10.4,
                                "cast": 1.93,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 15,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Transfusion",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 60.0,
                                "recharge": 8.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "buffDuration": 20.0
                    }
        },
        {
                    "name": "Repel",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 0.325,
                                "cast": 1.07,
                                "buffDuration": 0.5
                    }
        },
        {
                    "name": "Siphon Speed",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 7.8,
                                "cast": 1.93,
                                "speedBuff": 0.85,
                                "buffDuration": 60.0,
                                "rechargeDebuff": 0.2,
                                "rechargeBuff": 0.2,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Increase Density",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 3.0,
                                "endurance": 5.2,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 2.5
                                },
                                "dotDamage": 2.5,
                                "dotTicks": 30,
                                "buffDuration": 60.0,
                                "speedBuff": 0.1
                    }
        },
        {
                    "name": "Speed Boost",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 50.0,
                                "recharge": 2.0,
                                "endurance": 7.8,
                                "cast": 1.0,
                                "rechargeBuff": 0.5,
                                "buffDuration": 120.0,
                                "rechargeDebuff": 0.5,
                                "speedBuff": 0.5
                    }
        },
        {
                    "name": "Inertial Reduction",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 23.4,
                                "cast": 2.03,
                                "buffDuration": 60.0,
                                "speedBuff": 1.0
                    }
        },
        {
                    "name": "Transference",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.1,
                                "range": 60.0,
                                "recharge": 30.0,
                                "endurance": 2.6,
                                "cast": 2.27
                    }
        },
        {
                    "name": "Fulcrum Shift",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 60.0,
                                "endurance": 15.6,
                                "cast": 2.17
                    }
        }
    ]
};
