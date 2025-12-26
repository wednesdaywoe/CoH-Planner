/**
 * City of Heroes: Homecoming - Archetype Definitions
 * 
 * Complete archetype data including:
 * - Base stats (HP, endurance, recovery, etc.)
 * - Damage modifiers
 * - Available primary/secondary sets
 * - Inherent powers
 */

const ARCHETYPES = {
    // ============================================
    // HERO ARCHETYPES
    // ============================================
    
    'blaster': {
        name: 'Blaster',
        side: 'hero',
        description: 'Ranged damage specialist with high offensive power but low defenses',
        inherent: {
            name: 'Defiance',
            description: 'Build up damage bonus as health drops, attacks while mezzed'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.5,
                ranged: 1.125,
                aoe: 1.0
            }
        },
        primarySets: [
            'archery', 'assault-rifle', 'beam-rifle', 'dual-pistols', 'electrical-blast',
            'energy-blast', 'fire-blast', 'ice-blast', 'psychic-blast', 'radiation-blast',
            'sonic-attack', 'water-blast', 'dark-blast', 'seismic-blast'
        ],
        secondarySets: [
            'atomic-manipulation', 'electricity-manipulation', 'energy-manipulation',
            'fire-manipulation', 'ice-manipulation', 'martial-combat', 'mental-manipulation',
            'plant-manipulation', 'tactical-arrow', 'temporal-manipulation'
        ]
    },
    
    'controller': {
        name: 'Controller',
        side: 'hero',
        description: 'Mezzes enemies and buffs/debuffs with strong team support',
        inherent: {
            name: 'Containment',
            description: 'Deal double damage to controlled enemies'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.55,
                ranged: 0.55,
                aoe: 0.5
            }
        },
        primarySets: [
            'darkness-control', 'earth-control', 'electric-control', 'fire-control',
            'gravity-control', 'ice-control', 'illusion-control', 'mind-control',
            'plant-control', 'pyrotechnic-control', 'symphony-control'
        ],
        secondarySets: [
            'cold-domination', 'empathy', 'force-field', 'kinetics', 'nature-affinity',
            'radiation-emission', 'sonic-resonance', 'storm-summoning', 'thermal-radiation',
            'time-manipulation', 'trick-arrow'
        ]
    },
    
    'defender': {
        name: 'Defender',
        side: 'hero',
        description: 'Support specialist with powerful buffs, debuffs, and healing',
        inherent: {
            name: 'Vigilance',
            description: 'Damage increases when team is wounded, endurance discount when solo'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.55,
                ranged: 0.65,
                aoe: 0.5
            }
        },
        primarySets: [
            'cold-domination', 'dark-miasma', 'empathy', 'force-field', 'kinetics',
            'nature-affinity', 'pain-domination', 'poison', 'radiation-emission',
            'sonic-resonance', 'storm-summoning', 'thermal-radiation', 'time-manipulation',
            'traps', 'trick-arrow'
        ],
        secondarySets: [
            'archery', 'assault-rifle', 'beam-rifle', 'dark-blast', 'dual-pistols',
            'electrical-blast', 'energy-blast', 'ice-blast', 'psychic-blast',
            'radiation-blast', 'sonic-attack', 'water-blast'
        ]
    },
    
    'scrapper': {
        name: 'Scrapper',
        side: 'hero',
        description: 'Melee damage dealer with good survivability through defense/resistance',
        inherent: {
            name: 'Critical Hit',
            description: 'Chance for critical hits (higher chance vs minions/underlings)'
        },
        stats: {
            baseHP: 1338.6,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 3.0,
            damageModifier: {
                melee: 1.125,
                ranged: 0.5,
                aoe: 0.8
            }
        },
        primarySets: [
            'battle-axe', 'broad-sword', 'claws', 'dark-melee', 'dual-blades',
            'electrical-melee', 'fiery-melee', 'katana', 'kinetic-melee',
            'martial-arts', 'psionic-melee', 'radiation-melee', 'savage-melee',
            'sonic-melee', 'spines', 'staff-fighting', 'street-justice', 'titan-weapons'
        ],
        secondarySets: [
            'bio-armor', 'dark-armor', 'electric-armor', 'energy-aura', 'fiery-aura',
            'ice-armor', 'invulnerability', 'ninjitsu', 'radiation-armor',
            'regeneration', 'shield-defense', 'super-reflexes', 'willpower'
        ]
    },
    
    'tanker': {
        name: 'Tanker',
        side: 'hero',
        description: 'Extremely tough with highest HP and strong defensive powers',
        inherent: {
            name: 'Gauntlet',
            description: 'All attacks taunt enemies, AoE punch-voke effect'
        },
        stats: {
            baseHP: 1874.1,
            maxHP: 2409.5,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 4.0,
            damageModifier: {
                melee: 0.8,
                ranged: 0.5,
                aoe: 0.7
            }
        },
        primarySets: [
            'bio-armor', 'dark-armor', 'electric-armor', 'energy-aura', 'fiery-aura',
            'ice-armor', 'invulnerability', 'radiation-armor', 'shield-defense',
            'stone-armor', 'super-reflexes', 'willpower'
        ],
        secondarySets: [
            'battle-axe', 'broad-sword', 'dark-melee', 'dual-blades', 'electrical-melee',
            'energy-melee', 'fiery-melee', 'ice-melee', 'kinetic-melee', 'martial-arts',
            'radiation-melee', 'savage-melee', 'sonic-melee', 'spines', 'staff-fighting',
            'street-justice', 'titan-weapons', 'war-mace'
        ]
    },
    
    'sentinel': {
        name: 'Sentinel',
        side: 'hero',
        description: 'Homecoming exclusive: Ranged damage with built-in armor for survivability',
        inherent: {
            name: 'Opportunity',
            description: 'Build up meter with attacks, consume for offensive/defensive stance'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 2.0,
            damageModifier: {
                melee: 0.65,
                ranged: 0.95,
                aoe: 0.8
            }
        },
        primarySets: [
            'archery', 'assault-rifle', 'beam-rifle', 'dark-blast', 'dual-pistols',
            'electrical-blast', 'energy-blast', 'fire-blast', 'ice-blast',
            'psychic-blast', 'radiation-blast', 'sonic-attack', 'water-blast'
        ],
        secondarySets: [
            'bio-armor', 'dark-armor', 'electric-armor', 'energy-aura', 'fiery-aura',
            'ice-armor', 'invulnerability', 'ninjitsu', 'radiation-armor',
            'regeneration', 'super-reflexes', 'willpower'
        ]
    },
    
    'peacebringer': {
        name: 'Peacebringer',
        side: 'hero',
        description: 'Kheldian shapeshifter with access to multiple forms',
        inherent: {
            name: 'Energy Flight',
            description: 'Transform between human, nova, and dwarf forms'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.85,
                ranged: 0.8,
                aoe: 0.7
            }
        },
        primarySets: ['luminous-blast'],
        secondarySets: ['luminous-aura']
    },
    
    'warshade': {
        name: 'Warshade',
        side: 'hero',
        description: 'Kheldian shapeshifter that feeds on defeated enemies',
        inherent: {
            name: 'Shadow Step',
            description: 'Transform between human, nova, and dwarf forms'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.85,
                ranged: 0.8,
                aoe: 0.7
            }
        },
        primarySets: ['umbral-blast'],
        secondarySets: ['umbral-aura']
    },
    
    // ============================================
    // VILLAIN ARCHETYPES
    // ============================================
    
    'brute': {
        name: 'Brute',
        side: 'villain',
        description: 'High damage melee fighter that builds fury through combat',
        inherent: {
            name: 'Fury',
            description: 'Build up damage bonus by attacking and being attacked'
        },
        stats: {
            baseHP: 1606.4,
            maxHP: 2140.9,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 4.0,
            damageModifier: {
                melee: 0.75,
                ranged: 0.5,
                aoe: 0.65
            }
        },
        primarySets: [
            'battle-axe', 'claws', 'dark-melee', 'dual-blades', 'electrical-melee',
            'energy-melee', 'fiery-melee', 'kinetic-melee', 'martial-arts',
            'psionic-melee', 'radiation-melee', 'savage-melee', 'sonic-melee',
            'spines', 'staff-fighting', 'stone-melee', 'street-justice',
            'super-strength', 'titan-weapons', 'war-mace'
        ],
        secondarySets: [
            'bio-armor', 'dark-armor', 'electric-armor', 'energy-aura', 'fiery-aura',
            'ice-armor', 'invulnerability', 'radiation-armor', 'regeneration',
            'shield-defense', 'stone-armor', 'super-reflexes', 'willpower'
        ]
    },
    
    'corruptor': {
        name: 'Corruptor',
        side: 'villain',
        description: 'Ranged damage dealer with debuffs and support abilities',
        inherent: {
            name: 'Scourge',
            description: 'Increased critical hit chance against low-health enemies'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.55,
                ranged: 0.75,
                aoe: 0.6
            }
        },
        primarySets: [
            'archery', 'assault-rifle', 'beam-rifle', 'dark-blast', 'dual-pistols',
            'electrical-blast', 'energy-blast', 'fire-blast', 'ice-blast',
            'psychic-blast', 'radiation-blast', 'sonic-attack', 'water-blast'
        ],
        secondarySets: [
            'cold-domination', 'dark-miasma', 'kinetics', 'nature-affinity',
            'pain-domination', 'poison', 'radiation-emission', 'sonic-resonance',
            'storm-summoning', 'thermal-radiation', 'time-manipulation', 'traps',
            'trick-arrow'
        ]
    },
    
    'dominator': {
        name: 'Dominator',
        side: 'villain',
        description: 'Control specialist with strong offensive capabilities',
        inherent: {
            name: 'Domination',
            description: 'Build meter to activate Domination for mag boost and endurance refill'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.75,
                ranged: 0.75,
                aoe: 0.65
            }
        },
        primarySets: [
            'darkness-control', 'earth-control', 'electric-control', 'fire-control',
            'gravity-control', 'ice-control', 'mind-control', 'plant-control',
            'pyrotechnic-control', 'symphony-control'
        ],
        secondarySets: [
            'atomic-manipulation', 'earth-assault', 'electricity-assault', 'energy-assault',
            'fiery-assault', 'ice-assault', 'martial-assault', 'psionic-assault',
            'psychic-shockwave', 'radioactive-assault', 'savage-assault', 'thorny-assault'
        ]
    },
    
    'mastermind': {
        name: 'Mastermind',
        side: 'villain',
        description: 'Pet commander with support abilities for minions',
        inherent: {
            name: 'Supremacy',
            description: 'Pets gain bonuses to accuracy, damage, and resistance when near you'
        },
        stats: {
            baseHP: 695.7,
            maxHP: 1070.8,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.55,
                ranged: 0.55,
                aoe: 0.5
            }
        },
        primarySets: [
            'beast-mastery', 'demons', 'mercenaries', 'necromancy', 'ninjas',
            'robotics', 'thugs'
        ],
        secondarySets: [
            'cold-domination', 'dark-miasma', 'force-field', 'kinetics',
            'nature-affinity', 'pain-domination', 'poison', 'sonic-resonance',
            'storm-summoning', 'thermal-radiation', 'time-manipulation',
            'traps', 'trick-arrow'
        ]
    },
    
    'stalker': {
        name: 'Stalker',
        side: 'villain',
        description: 'Stealthy assassin with critical strikes from hide',
        inherent: {
            name: 'Assassination',
            description: 'Massive critical strikes from hide, improved criticals'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 3.0,
            damageModifier: {
                melee: 1.0,
                ranged: 0.6,
                aoe: 0.7
            }
        },
        primarySets: [
            'broad-sword', 'claws', 'dark-melee', 'dual-blades', 'electrical-melee',
            'energy-melee', 'kinetic-melee', 'martial-arts', 'ninja-blade',
            'psionic-melee', 'radiation-melee', 'savage-melee', 'sonic-melee',
            'spines', 'staff-fighting', 'street-justice'
        ],
        secondarySets: [
            'bio-armor', 'dark-armor', 'electric-armor', 'energy-aura', 'ice-armor',
            'invulnerability', 'ninjitsu', 'radiation-armor', 'regeneration',
            'shield-defense', 'super-reflexes', 'willpower'
        ]
    },
    
    'arachnos-soldier': {
        name: 'Soldier of Arachnos',
        side: 'villain',
        description: 'Versatile soldier with branching power choices',
        inherent: {
            name: 'Conditioning',
            description: 'Increased max HP'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 3.0,
            damageModifier: {
                melee: 0.75,
                ranged: 0.75,
                aoe: 0.65
            }
        },
        primarySets: ['arachnos-soldier'],
        secondarySets: ['training-and-gadgets']
    },
    
    'arachnos-widow': {
        name: 'Widow',
        side: 'villain',
        description: 'Versatile operative with branching power choices',
        inherent: {
            name: 'Conditioning',
            description: 'Increased max HP'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 3.0,
            damageModifier: {
                melee: 0.85,
                ranged: 0.65,
                aoe: 0.7
            }
        },
        primarySets: ['widow-training'],
        secondarySets: ['widow-teamwork']
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARCHETYPES };
}
