/**
 * City of Heroes: Radiation Emission
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['radiation-emission'] = {
    name: "Radiation Emission",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Radiant Aura",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 8.0,
                                "endurance": 13.0,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Radiation Infection",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "ToHitDebuff",
                                "DefenseDebuff",
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 0.26,
                                "cast": 1.5,
                                "tohitDebuff": 2.5,
                                "buffDuration": 0.75,
                                "defenseDebuff": 2.5
                    }
        },
        {
                    "name": "Accelerate Metabolism",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 422.0,
                                "endurance": 15.6,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 60,
                                "buffDuration": 120.0,
                                "rechargeBuff": 0.3,
                                "speedBuff": 0.3
                    }
        },
        {
                    "name": "Enervating Field",
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
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 0.26,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 2.0
                                },
                                "buffDuration": 0.75
                    }
        },
        {
                    "name": "Mutation",
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
                                "range": 15.0,
                                "recharge": 180.0,
                                "endurance": 26.0,
                                "cast": 3.2,
                                "damage": {
                                            "scale": 4.0
                                },
                                "dotDamage": 4.0,
                                "dotTicks": 45,
                                "buffDuration": 0.5,
                                "rechargeBuff": 1.0,
                                "tohitBuff": 3.0,
                                "tohitDebuff": 3.0
                    }
        },
        {
                    "name": "Lingering Radiation",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 1.5,
                                "speedBuff": 0.6,
                                "buffDuration": 30.0,
                                "rechargeBuff": 0.6,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Choking Cloud",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 1.3,
                                "cast": 1.0
                    }
        },
        {
                    "name": "Fallout",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
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
                                "recharge": 300.0,
                                "endurance": 20.8,
                                "cast": 3.2,
                                "buffDuration": 1.0
                    }
        },
        {
                    "name": "EM Pulse",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 300.0,
                                "endurance": 20.8,
                                "cast": 2.93,
                                "damage": {
                                            "scale": 1.64
                                },
                                "buffDuration": 15.0
                    }
        }
    ]
};
