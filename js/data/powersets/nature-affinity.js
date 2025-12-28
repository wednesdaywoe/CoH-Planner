/**
 * City of Heroes: Nature Affinity
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['nature-affinity'] = {
    name: "Nature Affinity",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Corrosive Enzymes",
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
                                "recharge": 16.0,
                                "endurance": 8.528,
                                "cast": 1.0,
                                "dotDamage": -2.5,
                                "dotTicks": 15,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Regrowth",
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
                                "range": 45.0,
                                "recharge": 10.0,
                                "endurance": 13.52,
                                "cast": 2.0,
                                "dotDamage": 0.15,
                                "dotTicks": 2,
                                "buffDuration": 4.1
                    }
        },
        {
                    "name": "Wild Growth",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 225.0,
                                "endurance": 15.6,
                                "cast": 2.17,
                                "damage": {
                                            "scale": 1.5
                                },
                                "dotDamage": 1.5,
                                "dotTicks": 45,
                                "buffDuration": 90.0,
                                "heal": 1.0
                    }
        },
        {
                    "name": "Spore Cloud",
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
                                "cast": 3.1,
                                "damage": {
                                            "scale": 2.25
                                },
                                "tohitDebuff": 1.5,
                                "buffDuration": 0.75
                    }
        },
        {
                    "name": "Lifegiving Spores",
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
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 0.26,
                                "cast": 2.33
                    }
        },
        {
                    "name": "Wild Bastion",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 240.0,
                                "endurance": 13.0,
                                "cast": 2.27,
                                "dotDamage": 0.2727,
                                "dotTicks": 5,
                                "absorption": 1.0,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Rebirth",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 45.0,
                                "recharge": 180.0,
                                "endurance": 26.0,
                                "cast": 3.0
                    }
        },
        {
                    "name": "Entangling Aura",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 1.3,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Overgrowth",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 255.0,
                                "endurance": 26.0,
                                "cast": 3.0,
                                "damage": {
                                            "scale": 6.6
                                },
                                "dotDamage": 6.6,
                                "dotTicks": 30,
                                "tohitBuff": 1.0,
                                "buffDuration": 60.0
                    }
        }
    ]
};
