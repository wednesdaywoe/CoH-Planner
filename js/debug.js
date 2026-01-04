/**
 * Debug Functions
 * Quick setup functions for testing
 */

/**
 * Debug button: Set up Fire/Fire Blaster with all Primary and Secondary powers
 * Sets character to level 35 for epic pool testing
 */
function debugFireFire() {
    console.log('🔥 Debug: Setting up Fire/Fire Blaster with all powers for level 35');
    
    // 1. Set Archetype
    const archetypeSelect = document.getElementById('archetypeSelect');
    archetypeSelect.value = 'blaster';
    onArchetypeChange();
    
    // 2. Set Primary (Fire Blast)
    setTimeout(() => {
        const primarySelect = document.getElementById('primarySelect');
        primarySelect.value = 'fire-blast';
        onPrimaryChange();
        
        // 3. Set Secondary (Fire Manipulation)
        setTimeout(() => {
            const secondarySelect = document.getElementById('secondarySelect');
            secondarySelect.value = 'fire-manipulation';
            onSecondaryChange();
            
            // 4. Add all Primary powers
            setTimeout(() => {
                const fireBlastPowerset = POWERSETS['fire-blast'];
                if (fireBlastPowerset && fireBlastPowerset.powers) {
                    console.log(`Adding ${fireBlastPowerset.powers.length} Fire Blast powers`);
                    fireBlastPowerset.powers.forEach(power => {
                        selectPower(power, 'primary');
                    });
                }
                
                // 5. Add all Secondary powers
                setTimeout(() => {
                    const fireManipulationPowerset = POWERSETS['fire-manipulation'];
                    if (fireManipulationPowerset && fireManipulationPowerset.powers) {
                        console.log(`Adding ${fireManipulationPowerset.powers.length} Fire Manipulation powers`);
                        fireManipulationPowerset.powers.forEach(power => {
                            selectPower(power, 'secondary');
                        });
                    }
                    
                    // Update UI
                    refreshAvailablePowers();
                    updateCharacterLevel();
                    
                    console.log('✓ Fire/Fire Blaster ready! Level:', Build.level);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}

// Add Fire Blast and Fire Manipulation to POWERSETS if they're loaded
if (typeof FIRE_BLAST_POWERSET !== 'undefined') {
    POWERSETS['fire-blast'] = FIRE_BLAST_POWERSET;
    console.log('✓ Loaded Fire Blast powerset');
}

if (typeof FIRE_MANIPULATION_POWERSET !== 'undefined') {
    POWERSETS['fire-manipulation'] = FIRE_MANIPULATION_POWERSET;
    console.log('✓ Loaded Fire Manipulation powerset');
}
