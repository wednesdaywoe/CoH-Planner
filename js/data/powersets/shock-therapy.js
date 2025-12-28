/**
 * City of Heroes: Shock Therapy
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['shock-therapy'] = {
    name: "Shock Therapy",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Rejuvenating Circuit",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 13.0,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Shock",
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
                                "recharge": 12.0,
                                "endurance": 8.528,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 12,
                                "buffDuration": 25.0
                    }
        },
        {
                    "name": "Galvanic Sentinel",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 25.0,
                                "cast": 2.03,
                                "buffDuration": 120.0
                    }
        },
        {
                    "name": "Energizing Circuit",
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
                                "range": 80.0,
                                "recharge": 35.0,
                                "endurance": 13.0,
                                "cast": 1.67,
                                "rechargeBuff": 1.25,
                                "buffDuration": 5.0
                    }
        },
        {
                    "name": "Faraday Cage",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 25.0,
                                "recharge": 10.0,
                                "endurance": 13.0,
                                "cast": 1.07,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Empowering Circuit",
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
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 13.0,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 30,
                                "buffDuration": 60.0,
                                "tohitBuff": 1.2
                    }
        },
        {
                    "name": "Defibrillate",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 120.0,
                                "endurance": 26.0,
                                "cast": 3.3
                    }
        },
        {
                    "name": "Insulating Circuit",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 20.0,
                                "endurance": 13.0,
                                "cast": 1.0,
                                "absorption": 2.0,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Amp Up",
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
                                "range": 80.0,
                                "recharge": 300.0,
                                "endurance": 10.4,
                                "cast": 2.57,
                                "dotDamage": 6.0,
                                "dotTicks": 45,
                                "rechargeBuff": 0.5,
                                "buffDuration": 90.0,
                                "speedBuff": 6.0,
                                "absorption": 6.0,
                                "tohitBuff": 3.6,
                                "defenseBuff": 3.6
                    }
        }
    ]
};
