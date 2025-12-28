/**
 * City of Heroes: Electric Armor
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['electric-armor'] = {
    name: "Electric Armor",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Charged Armor",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.13,
                                "cast": 0.67,
                                "damage": {
                                            "scale": 3.5
                                }
                    }
        },
        {
                    "name": "Lightning Field",
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
                                "recharge": 10.0,
                                "endurance": 1.04,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.2
                                }
                    }
        },
        {
                    "name": "Conductive Shield",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.13,
                                "cast": 0.67,
                                "damage": {
                                            "scale": 3.5
                                }
                    }
        },
        {
                    "name": "Static Shield",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.104,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Grounded",
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
                    "name": "Energize",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 120.0,
                                "endurance": 10.4,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Lightning Reflexes",
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
                                "accuracy": 1.0,
                                "rechargeDebuff": 0.4,
                                "slow": 0.1
                    }
        },
        {
                    "name": "Power Sink",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 13.0,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Power Surge",
                    "available": 29,
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
                                "recharge": 350.0,
                                "endurance": 2.6,
                                "cast": 1.96
                    }
        }
    ]
};
