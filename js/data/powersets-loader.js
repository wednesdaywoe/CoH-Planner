/**
 * Powerset Auto-Loader
 * 
 * Automatically registers all loaded powersets to the POWERSETS object
 * after all script files have been loaded.
 */

(function() {
    // Wait for all scripts to load
    window.addEventListener('DOMContentLoaded', function() {
        console.log('Registering powersets...');
        
        // List of all powerset constants that should be defined
        const powersetConstants = [
            // Blast Sets (Ranged)
            { key: 'archery', constant: 'ARCHERY_POWERSET' },
            { key: 'assault-rifle', constant: 'ASSAULT_RIFLE_POWERSET' },
            { key: 'beam-rifle', constant: 'BEAM_RIFLE_POWERSET' },
            { key: 'dark-blast', constant: 'DARK_BLAST_POWERSET' },
            { key: 'dual-pistols', constant: 'DUAL_PISTOLS_POWERSET' },
            { key: 'electrical-blast', constant: 'ELECTRICAL_BLAST_POWERSET' },
            { key: 'energy-blast', constant: 'ENERGY_BLAST_POWERSET' },
            { key: 'fire-blast', constant: 'FIRE_BLAST_POWERSET' },
            { key: 'ice-blast', constant: 'ICE_BLAST_POWERSET' },
            { key: 'psychic-blast', constant: 'PSYCHIC_BLAST_POWERSET' },
            { key: 'radiation-blast', constant: 'RADIATION_BLAST_POWERSET' },
            { key: 'seismic-blast', constant: 'SEISMIC_BLAST_POWERSET' },
            { key: 'sonic-attack', constant: 'SONIC_ATTACK_POWERSET' },
            { key: 'storm-blast', constant: 'STORM_BLAST_POWERSET' },
            { key: 'water-blast', constant: 'WATER_BLAST_POWERSET' },
            
            // Manipulation Sets (Blaster Secondary)
            { key: 'darkness-manipulation', constant: 'DARKNESS_MANIPULATION_POWERSET' },
            { key: 'earth-manipulation', constant: 'EARTH_MANIPULATION_POWERSET' },
            { key: 'electricity-manipulation', constant: 'ELECTRICITY_MANIPULATION_POWERSET' },
            { key: 'energy-manipulation', constant: 'ENERGY_MANIPULATION_POWERSET' },
            { key: 'fire-manipulation', constant: 'FIRE_MANIPULATION_POWERSET' },
            { key: 'gadgets', constant: 'GADGETS_POWERSET' },
            { key: 'ice-manipulation', constant: 'ICE_MANIPULATION_POWERSET' },
            { key: 'martial-manipulation', constant: 'MARTIAL_MANIPULATION_POWERSET' },
            { key: 'mental-manipulation', constant: 'MENTAL_MANIPULATION_POWERSET' },
            { key: 'ninja-training', constant: 'NINJA_TRAINING_POWERSET' },
            { key: 'plant-manipulation', constant: 'PLANT_MANIPULATION_POWERSET' },
            { key: 'radiation-manipulation', constant: 'RADIATION_MANIPULATION_POWERSET' },
            { key: 'sonic-manipulation', constant: 'SONIC_MANIPULATION_POWERSET' },
            { key: 'tactical-arrow', constant: 'TACTICAL_ARROW_POWERSET' },
            { key: 'temporal-manipulation', constant: 'TEMPORAL_MANIPULATION_POWERSET' },
            
            // Melee Sets
            { key: 'battle-axe', constant: 'BATTLE_AXE_POWERSET' },
            { key: 'brawling', constant: 'BRAWLING_POWERSET' },
            { key: 'broad-sword', constant: 'BROAD_SWORD_POWERSET' },
            { key: 'claws', constant: 'CLAWS_POWERSET' },
            { key: 'dark-melee', constant: 'DARK_MELEE_POWERSET' },
            { key: 'dual-blades', constant: 'DUAL_BLADES_POWERSET' },
            { key: 'electrical-melee', constant: 'ELECTRICAL_MELEE_POWERSET' },
            { key: 'energy-melee', constant: 'ENERGY_MELEE_POWERSET' },
            { key: 'fiery-melee', constant: 'FIERY_MELEE_POWERSET' },
            { key: 'ice-melee', constant: 'ICE_MELEE_POWERSET' },
            { key: 'katana', constant: 'KATANA_POWERSET' },
            { key: 'kinetic-attack', constant: 'KINETIC_ATTACK_POWERSET' },
            { key: 'martial-arts', constant: 'MARTIAL_ARTS_POWERSET' },
            { key: 'ninja-sword', constant: 'NINJA_SWORD_POWERSET' },
            { key: 'psionic-melee', constant: 'PSIONIC_MELEE_POWERSET' },
            { key: 'quills', constant: 'QUILLS_POWERSET' },
            { key: 'radiation-melee', constant: 'RADIATION_MELEE_POWERSET' },
            { key: 'savage-melee', constant: 'SAVAGE_MELEE_POWERSET' },
            { key: 'spines', constant: 'SPINES_POWERSET' },
            { key: 'staff-fighting', constant: 'STAFF_FIGHTING_POWERSET' },
            { key: 'stone-melee', constant: 'STONE_MELEE_POWERSET' },
            { key: 'super-strength', constant: 'SUPER_STRENGTH_POWERSET' },
            { key: 'titan-weapons', constant: 'TITAN_WEAPONS_POWERSET' },
            { key: 'war-mace', constant: 'WAR_MACE_POWERSET' },
            
            // Armor Sets
            { key: 'bio-organic-armor', constant: 'BIO_ORGANIC_ARMOR_POWERSET' },
            { key: 'dark-armor', constant: 'DARK_ARMOR_POWERSET' },
            { key: 'electric-armor', constant: 'ELECTRIC_ARMOR_POWERSET' },
            { key: 'energy-aura', constant: 'ENERGY_AURA_POWERSET' },
            { key: 'fiery-aura', constant: 'FIERY_AURA_POWERSET' },
            { key: 'ice-armor', constant: 'ICE_ARMOR_POWERSET' },
            { key: 'invulnerability', constant: 'INVULNERABILITY_POWERSET' },
            { key: 'ninjitsu', constant: 'NINJITSU_POWERSET' },
            { key: 'psionic-armor', constant: 'PSIONIC_ARMOR_POWERSET' },
            { key: 'radiation-armor', constant: 'RADIATION_ARMOR_POWERSET' },
            { key: 'regeneration', constant: 'REGENERATION_POWERSET' },
            { key: 'shield-defense', constant: 'SHIELD_DEFENSE_POWERSET' },
            { key: 'stone-armor', constant: 'STONE_ARMOR_POWERSET' },
            { key: 'super-reflexes', constant: 'SUPER_REFLEXES_POWERSET' },
            { key: 'willpower', constant: 'WILLPOWER_POWERSET' },
            
            // Support Sets (Defender/Controller)
            { key: 'cold-domination', constant: 'COLD_DOMINATION_POWERSET' },
            { key: 'darkness-affinity', constant: 'DARKNESS_AFFINITY_POWERSET' },
            { key: 'dark-miasma', constant: 'DARK_MIASMA_POWERSET' },
            { key: 'empathy', constant: 'EMPATHY_POWERSET' },
            { key: 'force-field', constant: 'FORCE_FIELD_POWERSET' },
            { key: 'kinetics', constant: 'KINETICS_POWERSET' },
            { key: 'marine-affinity', constant: 'MARINE_AFFINITY_POWERSET' },
            { key: 'nature-affinity', constant: 'NATURE_AFFINITY_POWERSET' },
            { key: 'pain-domination', constant: 'PAIN_DOMINATION_POWERSET' },
            { key: 'poison', constant: 'POISON_POWERSET' },
            { key: 'radiation-emission', constant: 'RADIATION_EMISSION_POWERSET' },
            { key: 'shock-therapy', constant: 'SHOCK_THERAPY_POWERSET' },
            { key: 'sonic-debuff', constant: 'SONIC_DEBUFF_POWERSET' },
            { key: 'sonic-resonance', constant: 'SONIC_RESONANCE_POWERSET' },
            { key: 'storm-summoning', constant: 'STORM_SUMMONING_POWERSET' },
            { key: 'thermal-radiation', constant: 'THERMAL_RADIATION_POWERSET' },
            { key: 'time-manipulation', constant: 'TIME_MANIPULATION_POWERSET' },
            { key: 'traps', constant: 'TRAPS_POWERSET' },
            { key: 'trick-arrow', constant: 'TRICK_ARROW_POWERSET' },
            
            // Control Sets
            { key: 'arsenal-control', constant: 'ARSENAL_CONTROL_POWERSET' },
            { key: 'darkness-control', constant: 'DARKNESS_CONTROL_POWERSET' },
            { key: 'earth-control', constant: 'EARTH_CONTROL_POWERSET' },
            { key: 'electric-control', constant: 'ELECTRIC_CONTROL_POWERSET' },
            { key: 'fire-control', constant: 'FIRE_CONTROL_POWERSET' },
            { key: 'gravity-control', constant: 'GRAVITY_CONTROL_POWERSET' },
            { key: 'ice-control', constant: 'ICE_CONTROL_POWERSET' },
            { key: 'illusion-control', constant: 'ILLUSION_CONTROL_POWERSET' },
            { key: 'mind-control', constant: 'MIND_CONTROL_POWERSET' },
            { key: 'plant-control', constant: 'PLANT_CONTROL_POWERSET' },
            { key: 'pyrotechnic-control', constant: 'PYROTECHNIC_CONTROL_POWERSET' },
            { key: 'symphony-control', constant: 'SYMPHONY_CONTROL_POWERSET' },
            { key: 'wind-control', constant: 'WIND_CONTROL_POWERSET' },
            
            // Assault Sets (Dominator Secondary)
            { key: 'arsenal-assault', constant: 'ARSENAL_ASSAULT_POWERSET' },
            { key: 'dark-assault', constant: 'DARK_ASSAULT_POWERSET' },
            { key: 'earth-assault', constant: 'EARTH_ASSAULT_POWERSET' },
            { key: 'electricity-assault', constant: 'ELECTRICITY_ASSAULT_POWERSET' },
            { key: 'energy-assault', constant: 'ENERGY_ASSAULT_POWERSET' },
            { key: 'fiery-assault', constant: 'FIERY_ASSAULT_POWERSET' },
            { key: 'icy-assault', constant: 'ICY_ASSAULT_POWERSET' },
            { key: 'martial-assault', constant: 'MARTIAL_ASSAULT_POWERSET' },
            { key: 'psionic-assault', constant: 'PSIONIC_ASSAULT_POWERSET' },
            { key: 'radioactive-assault', constant: 'RADIOACTIVE_ASSAULT_POWERSET' },
            { key: 'savage-assault', constant: 'SAVAGE_ASSAULT_POWERSET' },
            { key: 'sonic-assault', constant: 'SONIC_ASSAULT_POWERSET' },
            { key: 'thorny-assault', constant: 'THORNY_ASSAULT_POWERSET' },
            
            // Pet Sets (Mastermind)
            { key: 'beast-mastery', constant: 'BEAST_MASTERY_POWERSET' },
            { key: 'demon-summoning', constant: 'DEMON_SUMMONING_POWERSET' },
            { key: 'mercenaries', constant: 'MERCENARIES_POWERSET' },
            { key: 'necromancy', constant: 'NECROMANCY_POWERSET' },
            { key: 'ninjas', constant: 'NINJAS_POWERSET' },
            { key: 'robotics', constant: 'ROBOTICS_POWERSET' },
            { key: 'thugs', constant: 'THUGS_POWERSET' }
        ];
        
        let registered = 0;
        let missing = 0;
        
        powersetConstants.forEach(({key, constant}) => {
            if (typeof window[constant] !== 'undefined') {
                POWERSETS[key] = window[constant];
                registered++;
            } else {
                console.warn(`Powerset not loaded: ${constant} (${key})`);
                missing++;
            }
        });
        
        console.log(`Powersets registered: ${registered}/${powersetConstants.length}`);
        if (missing > 0) {
            console.warn(`Missing ${missing} powersets`);
        }
        
        console.log('Available powersets:', Object.keys(POWERSETS).sort());
    });
})();
