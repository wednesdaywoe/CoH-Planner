/**
 * City of Heroes: Ice Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ice-control'] = {
    name: "Ice Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Block of Ice",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.87,
                                "damage": {
                                            "scale": 1.0
                                },
                                "slow": 0.3,
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Chilblain",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "slow": 0.3,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Frostbite",
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
                                "accuracy": 0.9,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 15.6,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 0.1
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 2,
                                "slow": 0.3,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Arctic Air",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 2.08,
                                "cast": 2.03,
                                "rechargeDebuff": 0.5,
                                "slow": -1.0
                    }
        },
        {
                    "name": "Cold Snap",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 40.0,
                                "endurance": 10.4,
                                "cast": 2.17,
                                "rechargeDebuff": 0.65,
                                "slow": -1.0
                    }
        },
        {
                    "name": "Ice Slick",
                    "available": 11,
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
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 90.0,
                                "endurance": 10.4,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Flash Freeze",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 45.0,
                                "endurance": 15.6,
                                "cast": 2.37,
                                "damage": {
                                            "scale": 0.2
                                }
                    }
        },
        {
                    "name": "Glacier",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.03,
                                "rechargeDebuff": 0.5,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Jack Frost",
                    "available": 25,
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
                                "range": 60.0,
                                "recharge": 240.0,
                                "endurance": 20.8,
                                "cast": 1.87
                    }
        }
    ]
};
