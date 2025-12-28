/**
 * City of Heroes: Super Reflexes
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['super-reflexes'] = {
    name: "Super Reflexes",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Focused Fighting",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "cast": 0.67
                    }
        },
        {
                    "name": "Focused Senses",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Agile",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Practiced Brawler",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 200.0,
                                "endurance": 10.4,
                                "cast": 1.53,
                                "rechargeDebuff": 0.3,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Dodge",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Quickness",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "rechargeDebuff": 0.4,
                                "slow": 0.1
                    }
        },
        {
                    "name": "Lucky",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Evasion",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "cast": 3.0
                    }
        },
        {
                    "name": "Elude",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 1000.0,
                                "endurance": 2.6,
                                "cast": 2.0,
                                "slow": 0.5
                    }
        }
    ]
};
