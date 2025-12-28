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
            'archery',
            'assault-rifle',
            'beam-rifle',
            'dark-blast',
            'dual-pistols',
            'electrical-blast',
            'energy-blast',
            'fire-blast',
            'ice-blast',
            'psychic-blast',
            'radiation-blast',
            'seismic-blast',
            'sonic-attack',
            'storm-blast',
            'water-blast'
        ],
        secondarySets: [
            'darkness-manipulation',
            'earth-manipulation',
            'electricity-manipulation',
            'energy-manipulation',
            'fire-manipulation',
            'gadgets',
            'ice-manipulation',
            'martial-manipulation',
            'mental-manipulation',
            'ninja-training',
            'plant-manipulation',
            'radiation-manipulation',
            'sonic-manipulation',
            'tactical-arrow',
            'temporal-manipulation'
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
            'arsenal-control',
            'darkness-control',
            'earth-control',
            'electric-control',
            'fire-control',
            'gravity-control',
            'ice-control',
            'illusion-control',
            'mind-control',
            'plant-control',
            'pyrotechnic-control',
            'symphony-control',
            'wind-control'
        ],
        secondarySets: [
            'cold-domination',
            'darkness-affinity',
            'empathy',
            'force-field',
            'kinetics',
            'marine-affinity',
            'nature-affinity',
            'pain-domination',
            'poison',
            'radiation-emission',
            'shock-therapy',
            'sonic-debuff',
            'storm-summoning',
            'thermal-radiation',
            'time-manipulation',
            'traps',
            'trick-arrow'
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
            'cold-domination',
            'dark-miasma',
            'empathy',
            'force-field',
            'kinetics',
            'marine-affinity',
            'nature-affinity',
            'pain-domination',
            'poison',
            'radiation-emission',
            'shock-therapy',
            'sonic-debuff',
            'storm-summoning',
            'thermal-radiation',
            'time-manipulation',
            'traps',
            'trick-arrow'
        ],
        secondarySets: [
            'archery',
            'assault-rifle',
            'beam-rifle',
            'dark-blast',
            'dual-pistols',
            'electrical-blast',
            'energy-blast',
            'fire-blast',
            'ice-blast',
            'psychic-blast',
            'radiation-blast',
            'seismic-blast',
            'sonic-attack',
            'storm-blast',
            'water-blast'
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
            'battle-axe',
            'brawling',
            'broad-sword',
            'claws',
            'dark-melee',
            'dual-blades',
            'electrical-melee',
            'energy-melee',
            'fiery-melee',
            'ice-melee',
            'katana',
            'kinetic-attack',
            'martial-arts',
            'psionic-melee',
            'quills',
            'radiation-melee',
            'savage-melee',
            'staff-fighting',
            'stone-melee',
            'titan-weapons',
            'war-mace'
        ],
        secondarySets: [
            'bio-organic-armor',
            'dark-armor',
            'electric-armor',
            'energy-aura',
            'fiery-aura',
            'ice-armor',
            'invulnerability',
            'ninjitsu',
            'psionic-armor',
            'radiation-armor',
            'regeneration',
            'shield-defense',
            'stone-armor',
            'super-reflexes',
            'willpower'
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
            'bio-organic-armor',
            'dark-armor',
            'electric-armor',
            'energy-aura',
            'fiery-aura',
            'ice-armor',
            'invulnerability',
            'psionic-armor',
            'radiation-armor',
            'regeneration',
            'shield-defense',
            'stone-armor',
            'super-reflexes',
            'willpower'
        ],
        secondarySets: [
            'battle-axe',
            'brawling',
            'broad-sword',
            'claws',
            'dark-melee',
            'dual-blades',
            'electrical-melee',
            'energy-melee',
            'fiery-melee',
            'ice-melee',
            'katana',
            'kinetic-attack',
            'martial-arts',
            'psionic-melee',
            'radiation-melee',
            'savage-melee',
            'spines',
            'staff-fighting',
            'stone-melee',
            'super-strength',
            'titan-weapons',
            'war-mace'
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
            'archery',
            'assault-rifle',
            'beam-rifle',
            'dark-blast',
            'dual-pistols',
            'electrical-blast',
            'energy-blast',
            'fire-blast',
            'ice-blast',
            'psychic-blast',
            'radiation-blast',
            'seismic-blast',
            'sonic-attack',
            'storm-blast',
            'water-blast'
        ],
        secondarySets: [
            'bio-organic-armor',
            'dark-armor',
            'electric-armor',
            'energy-aura',
            'fiery-aura',
            'ice-armor',
            'invulnerability',
            'ninjitsu',
            'psionic-armor',
            'radiation-armor',
            'regeneration',
            'stone-armor',
            'super-reflexes',
            'willpower'
        ]
    },
    
    /*
    // ============================================
    // EPIC ARCHETYPES (Disabled - Complex branching progression)
    // ============================================
    // TODO: Implement branching power trees for Epic ATs
    
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
    */
    // End of Epic Archetypes comment block
    
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
            'battle-axe',
            'brawling',
            'broad-sword',
            'claws',
            'dark-melee',
            'dual-blades',
            'electrical-melee',
            'energy-melee',
            'fiery-melee',
            'ice-melee',
            'katana',
            'kinetic-attack',
            'martial-arts',
            'psionic-melee',
            'radiation-melee',
            'savage-melee',
            'spines',
            'staff-fighting',
            'stone-melee',
            'super-strength',
            'titan-weapons',
            'war-mace'
        ],
        secondarySets: [
            'bio-organic-armor',
            'dark-armor',
            'electric-armor',
            'energy-aura',
            'fiery-aura',
            'ice-armor',
            'invulnerability',
            'psionic-armor',
            'radiation-armor',
            'regeneration',
            'shield-defense',
            'stone-armor',
            'super-reflexes',
            'willpower'
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
            'archery',
            'assault-rifle',
            'beam-rifle',
            'dark-blast',
            'dual-pistols',
            'electrical-blast',
            'energy-blast',
            'fire-blast',
            'ice-blast',
            'psychic-blast',
            'radiation-blast',
            'seismic-blast',
            'sonic-attack',
            'storm-blast',
            'water-blast'
        ],
        secondarySets: [
            'cold-domination',
            'dark-miasma',
            'empathy',
            'force-field',
            'kinetics',
            'marine-affinity',
            'nature-affinity',
            'pain-domination',
            'poison',
            'radiation-emission',
            'shock-therapy',
            'sonic-resonance',
            'storm-summoning',
            'thermal-radiation',
            'time-manipulation',
            'traps',
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
            'arsenal-control',
            'darkness-control',
            'earth-control',
            'electric-control',
            'fire-control',
            'gravity-control',
            'ice-control',
            'illusion-control',
            'mind-control',
            'plant-control',
            'pyrotechnic-control',
            'symphony-control',
            'wind-control'
        ],
        secondarySets: [
            'arsenal-assault',
            'dark-assault',
            'earth-assault',
            'electricity-assault',
            'energy-assault',
            'fiery-assault',
            'icy-assault',
            'martial-assault',
            'psionic-assault',
            'radioactive-assault',
            'savage-assault',
            'sonic-assault',
            'thorny-assault'
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
            'beast-mastery',
            'demon-summoning',
            'mercenaries',
            'necromancy',
            'ninjas',
            'robotics',
            'thugs'
        ],
        secondarySets: [
            'cold-domination',
            'dark-miasma',
            'empathy',
            'force-field',
            'kinetics',
            'marine-affinity',
            'nature-affinity',
            'pain-domination',
            'poison',
            'radiation-emission',
            'shock-therapy',
            'sonic-debuff',
            'storm-summoning',
            'thermal-radiation',
            'time-manipulation',
            'traps',
            'trick-arrow'
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
            'brawling',
            'broad-sword',
            'claws',
            'dark-melee',
            'dual-blades',
            'electrical-melee',
            'energy-melee',
            'fiery-melee',
            'ice-melee',
            'kinetic-attack',
            'martial-arts',
            'ninja-sword',
            'psionic-melee',
            'radiation-melee',
            'savage-melee',
            'spines',
            'staff-fighting',
            'stone-melee'
        ],
        secondarySets: [
            'bio-organic-armor',
            'dark-armor',
            'electric-armor',
            'energy-aura',
            'fiery-aura',
            'ice-armor',
            'invulnerability',
            'ninjitsu',
            'psionic-armor',
            'radiation-armor',
            'regeneration',
            'shield-defense',
            'super-reflexes',
            'willpower'
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARCHETYPES };
}
