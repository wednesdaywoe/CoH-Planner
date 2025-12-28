/**
 * City of Heroes: Traps
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['traps'] = {
    name: "Traps",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Caltrops",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 25.0,
                                "recharge": 45.0,
                                "endurance": 7.8,
                                "cast": 1.07,
                                "buffDuration": 45.0
                    }
        },
        {
                    "name": "Web Grenade",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.37,
                                "buffDuration": 15.0,
                                "rechargeBuff": 0.5,
                                "speedBuff": 0.5
                    }
        },
        {
                    "name": "Triage Beacon",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 200.0,
                                "endurance": 13.0,
                                "cast": 2.77,
                                "buffDuration": 90.0
                    }
        },
        {
                    "name": "Acid Mortar",
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
                                "recharge": 90.0,
                                "endurance": 13.0,
                                "cast": 2.77,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Force Field Generator",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 20.0,
                                "recharge": 15.0,
                                "endurance": 13.0,
                                "cast": 2.03,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Poison Trap",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 13.0,
                                "cast": 2.77,
                                "buffDuration": 260.0
                    }
        },
        {
                    "name": "Seeker Drones",
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
                                "accuracy": 1.2,
                                "range": 60.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 2.03,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Trip Mine",
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
                                "accuracy": 1.2,
                                "recharge": 20.0,
                                "endurance": 13.0,
                                "cast": 5.0,
                                "buffDuration": 260.0
                    }
        },
        {
                    "name": "Temporal Bomb",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 2.0
                    }
        }
    ]
};
