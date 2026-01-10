/**
 * Epic Pool Loader
 * 
 * Dynamically loads all epic pool files from the epics directory
 * This avoids the need for 81 individual <script> tags in index.html
 */

async function loadEpicPools() {
    // Accurate list of all 81 epic pools by archetype (as generated)
    const epicPoolsByArchetype = {
        blaster: ['blaster_dark_mastery', 'blaster_mace_mastery', 'blaster_mu_mastery', 'cold_mastery', 'electrical_mastery', 'flame_mastery', 'force_mastery', 'munitions_mastery'],
        brute: ['brute_leviathan_mastery', 'brute_mace_mastery', 'brute_mu_mastery', 'brute_soul_mastery', 'energy_mastery_brute'],
        controller: ['controller_dark_mastery', 'controller_mace_mastery', 'fire_mastery', 'ice_mastery', 'primal_forces_mastery', 'stone_mastery'],
        corruptor: ['corruptor_fire_mastery', 'corruptor_leviathan_mastery', 'corruptor_mace_mastery', 'corruptor_mu_mastery', 'corruptor_soul_mastery'],
        defender: ['dark_mastery', 'defender_fire_mastery', 'defender_ice_mastery', 'electricity_mastery', 'power_mastery', 'psychic_mastery'],
        dominator: ['dominator_dark_mastery', 'dominator_leviathan_mastery', 'dominator_mace_mastery', 'dominator_mu_mastery', 'dominator_soul_mastery', 'fire_mastery_dominator', 'ice_mastery_dominator', 'primal_forces_mastery_dominator', 'psionic_mastery_domingator'],
        mastermind: ['charge_mastery', 'chill_mastery', 'field_mastery', 'heat_mastery_stalker', 'mastermind_dark_mastery', 'mastermind_leviathan_mastery', 'mastermind_mace_mastery', 'mastermind_mu_mastery', 'mastermind_soul_mastery'],
        scrapper: ['darkness_mastery', 'melee_psionic_mastery', 'scrapper_ice_mastery', 'weapon_mastery'],
        sentinel: ['sentinel_dark_mastery', 'sentinel_electricity_mastery', 'sentinel_fire_mastery', 'sentinel_ice_mastery', 'sentinel_leviathan_mastery', 'sentinel_mace_mastery', 'sentinel_mu_mastery', 'sentinel_ninja_mastery', 'sentinel_psionic_mastery', 'sentinel_soul_mastery'],
        stalker: ['body_mastery_stalker', 'stalker_leviathan_mastery', 'stalker_mace_mastery', 'stalker_mu_mastery', 'stalker_soul_mastery', 'weapon_mastery_stalker'],
        tanker: ['arctic_mastery', 'earth_mastery', 'energy_mastery', 'pyre_mastery', 'tank_dark_mastery', 'tank_psionic_mastery'],
        arachnos_soldier: ['veat_leviathan_mastery', 'veat_mace_mastery', 'veat_mu_mastery', 'veat_soul_mastery']
    };
    
    // Load each epic pool dynamically
    const loadPromises = [];
    
    for (const [archetype, pools] of Object.entries(epicPoolsByArchetype)) {
        for (const poolName of pools) {
            const scriptPath = `js/data/epics/${archetype}/${poolName}.js`;
            const promise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = scriptPath;
                script.onload = resolve;
                script.onerror = () => {
                    console.warn(`Failed to load epic pool: ${scriptPath}`);
                    resolve(); // Continue loading other pools
                };
                document.head.appendChild(script);
            });
            loadPromises.push(promise);
        }
    }
    
    // Wait for all pools to load
    await Promise.all(loadPromises);
    
    // Auto-register all loaded epic pools
    if (typeof autoRegisterEpicPools === 'function') {
        autoRegisterEpicPools();
    }
    
    console.log('Epic pool loading complete');
}

// Load epic pools when DOM is ready (but after epic-pools.js has loaded)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEpicPools);
} else {
    loadEpicPools();
}
