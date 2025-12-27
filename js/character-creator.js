/**
 * City of Heroes Planner - Character Creator
 * 
 * Functions for archetype and powerset selection
 */

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize character creator on page load
 */
function initializeCharacterCreator() {
    console.log('Initializing character creator...');
    
    // Populate archetype dropdown
    populateArchetypeDropdown();
    
    console.log('Character creator initialized');
}

// ============================================
// ARCHETYPE SELECTION
// ============================================

/**
 * Populate archetype dropdown with all available archetypes
 */
function populateArchetypeDropdown() {
    const archetypeSelect = document.getElementById('archetypeSelect');
    
    // Clear existing options except the first placeholder
    archetypeSelect.innerHTML = '<option value="">Select Archetype...</option>';
    
    // Add all archetypes
    Object.keys(ARCHETYPES).forEach(archetypeId => {
        const archetype = ARCHETYPES[archetypeId];
        const option = document.createElement('option');
        option.value = archetypeId;
        option.textContent = archetype.name;
        option.title = archetype.description;
        archetypeSelect.appendChild(option);
    });
}

/**
 * Handle archetype selection change
 */
function onArchetypeChange() {
    const archetypeSelect = document.getElementById('archetypeSelect');
    const archetypeId = archetypeSelect.value;
    
    if (!archetypeId) {
        // Clear everything if no archetype selected
        clearPowersetDropdowns();
        clearAvailablePowers();
        clearSelectedPowers();
        return;
    }
    
    const archetype = ARCHETYPES[archetypeId];
    
    // Update build archetype
    Build.archetype = {
        id: archetypeId,
        name: archetype.name,
        stats: archetype.stats,
        inherent: archetype.inherent
    };
    
    // Populate primary/secondary dropdowns
    populatePrimaryDropdown(archetype.primarySets);
    populateSecondaryDropdown(archetype.secondarySets);
    
    // Update inherent power display
    updateInherentPowerDisplay(archetype.inherent);
    
    // Clear selected powers
    clearSelectedPowers();
    
    console.log(`Selected archetype: ${archetype.name}`);
}

// ============================================
// POWERSET DROPDOWNS
// ============================================

/**
 * Populate primary powerset dropdown
 * @param {Array} powersetIds - Available primary powersets
 */
function populatePrimaryDropdown(powersetIds) {
    const primarySelect = document.getElementById('primarySelect');
    
    primarySelect.innerHTML = '<option value="">Select Primary...</option>';
    primarySelect.disabled = false;
    
    powersetIds.forEach(powersetId => {
        const powerset = POWERSETS[powersetId];
        const option = document.createElement('option');
        option.value = powersetId;
        option.textContent = powerset ? powerset.name : formatPowersetName(powersetId);
        if (powerset) {
            option.title = powerset.description;
        }
        primarySelect.appendChild(option);
    });
}

/**
 * Populate secondary powerset dropdown
 * @param {Array} powersetIds - Available secondary powersets
 */
function populateSecondaryDropdown(powersetIds) {
    const secondarySelect = document.getElementById('secondarySelect');
    
    secondarySelect.innerHTML = '<option value="">Select Secondary...</option>';
    secondarySelect.disabled = false;
    
    powersetIds.forEach(powersetId => {
        const powerset = POWERSETS[powersetId];
        const option = document.createElement('option');
        option.value = powersetId;
        option.textContent = powerset ? powerset.name : formatPowersetName(powersetId);
        if (powerset) {
            option.title = powerset.description;
        }
        secondarySelect.appendChild(option);
    });
}

/**
 * Clear powerset dropdowns
 */
function clearPowersetDropdowns() {
    const primarySelect = document.getElementById('primarySelect');
    const secondarySelect = document.getElementById('secondarySelect');
    
    primarySelect.innerHTML = '<option value="">Select Archetype First</option>';
    primarySelect.disabled = true;
    
    secondarySelect.innerHTML = '<option value="">Select Archetype First</option>';
    secondarySelect.disabled = true;
}

// ============================================
// POWERSET SELECTION
// ============================================

/**
 * Handle primary powerset selection
 */
function onPrimaryChange() {
    const primarySelect = document.getElementById('primarySelect');
    const powersetId = primarySelect.value;
    
    if (!powersetId) {
        clearAvailablePrimaryPowers();
        clearSelectedPrimaryPowers();
        return;
    }
    
    const powerset = POWERSETS[powersetId];
    
    if (!powerset) {
        console.warn(`Powerset not yet implemented: ${powersetId}`);
        clearAvailablePrimaryPowers();
        clearSelectedPrimaryPowers();
        return;
    }
    
    // Update build primary
    Build.primary = {
        id: powersetId,
        name: powerset.name,
        powers: []
    };
    
    // Update available powers display
    updateAvailablePrimaryPowers(powerset);
    
    // Update column header
    updatePrimaryColumnHeader(powerset.name);
    
    // Clear selected powers from this set
    clearSelectedPrimaryPowers();
    
    console.log(`Selected primary: ${powerset.name}`);
}

/**
 * Handle secondary powerset selection
 */
function onSecondaryChange() {
    const secondarySelect = document.getElementById('secondarySelect');
    const powersetId = secondarySelect.value;
    
    if (!powersetId) {
        clearAvailableSecondaryPowers();
        clearSelectedSecondaryPowers();
        return;
    }
    
    const powerset = POWERSETS[powersetId];
    
    if (!powerset) {
        console.warn(`Powerset not yet implemented: ${powersetId}`);
        clearAvailableSecondaryPowers();
        clearSelectedSecondaryPowers();
        return;
    }
    
    // Update build secondary
    Build.secondary = {
        id: powersetId,
        name: powerset.name,
        powers: []
    };
    
    // Update available powers display
    updateAvailableSecondaryPowers(powerset);
    
    // Update column header
    updateSecondaryColumnHeader(powerset.name);
    
    console.log(`Selected secondary: ${powerset.name}`);
}

// ============================================
// AVAILABLE POWERS DISPLAY
// ============================================

/**
 * Update available primary powers list
 * @param {Object} powerset - Powerset data
 */
function updateAvailablePrimaryPowers(powerset) {
    const container = document.getElementById('availablePrimaryPowers');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Add section header
    const header = document.createElement('div');
    header.style.fontWeight = '600';
    header.style.fontSize = '11px';
    header.style.color = 'var(--text-secondary)';
    header.style.textTransform = 'uppercase';
    header.style.letterSpacing = '0.05em';
    header.style.marginBottom = '8px';
    header.textContent = `${powerset.name} (Primary)`;
    container.appendChild(header);
    
    // Add powers
    powerset.powers.forEach(power => {
        const isSelected = Build.primary.powers.some(p => p.name === power.name);
        const canSelect = canSelectPrimaryPower(power);
        
        const powerElement = document.createElement('div');
        powerElement.className = 'power-item available-power';
        if (isSelected) {
            powerElement.classList.add('selected');
        }
        if (!canSelect && !isSelected) {
            powerElement.classList.add('disabled');
        }
        
        powerElement.dataset.powerId = power.name;
        powerElement.dataset.powerLevel = power.available;
        powerElement.dataset.powerSet = 'primary';
        powerElement.innerHTML = `
            <span class="power-name">${power.name}</span>
            <span class="power-level">Level ${power.available}</span>
        `;
        
        // Click handler
        if (isSelected) {
            powerElement.onclick = () => removePowerFromBuild(power.name, 'primary');
            powerElement.title = 'Click to remove from build';
        } else if (canSelect) {
            powerElement.onclick = () => selectPower(power, 'primary');
        }
        
        // Hover tooltip
        powerElement.onmouseenter = (e) => showPowerTooltip(e, power);
        powerElement.onmouseleave = () => hideTooltip();
        
        container.appendChild(powerElement);
    });
}

/**
 * Update available secondary powers list
 * @param {Object} powerset - Powerset data
 */
function updateAvailableSecondaryPowers(powerset) {
    const container = document.getElementById('availableSecondaryPowers');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Add section header
    const header = document.createElement('div');
    header.style.fontWeight = '600';
    header.style.fontSize = '11px';
    header.style.color = 'var(--text-secondary)';
    header.style.textTransform = 'uppercase';
    header.style.letterSpacing = '0.05em';
    header.style.marginBottom = '8px';
    header.textContent = `${powerset.name} (Secondary)`;
    container.appendChild(header);
    
    // Add powers
    powerset.powers.forEach(power => {
        const isSelected = Build.secondary.powers.some(p => p.name === power.name);
        const canSelect = canSelectSecondaryPower(power);
        
        const powerElement = document.createElement('div');
        powerElement.className = 'power-item available-power';
        if (isSelected) {
            powerElement.classList.add('selected');
        }
        if (!canSelect && !isSelected) {
            powerElement.classList.add('disabled');
        }
        
        powerElement.dataset.powerId = power.name;
        powerElement.dataset.powerLevel = power.available;
        powerElement.dataset.powerSet = 'secondary';
        powerElement.innerHTML = `
            <span class="power-name">${power.name}</span>
            <span class="power-level">Level ${power.available}</span>
        `;
        
        // Click handler
        if (isSelected) {
            powerElement.onclick = () => removePowerFromBuild(power.name, 'secondary');
            powerElement.title = 'Click to remove from build';
        } else if (canSelect) {
            powerElement.onclick = () => selectPower(power, 'secondary');
        }
        
        // Hover tooltip
        powerElement.onmouseenter = (e) => showPowerTooltip(e, power);
        powerElement.onmouseleave = () => hideTooltip();
        
        container.appendChild(powerElement);
    });
}

// ============================================
// POWER SELECTION GATING
// ============================================

/**
 * Check if a primary power can be selected
 * @param {Object} power - Power data
 * @returns {boolean} Can select
 */
function canSelectPrimaryPower(power) {
    const hasPrimaryPower = Build.primary.powers.length > 0;
    const hasSecondaryPower = Build.secondary.powers.length > 0;
    
    // STAGE 1: Before first primary - Only rank 1-2 available
    if (!hasPrimaryPower) {
        const powerset = POWERSETS[Build.primary.id];
        if (!powerset) return false;
        
        const powerIndex = powerset.powers.findIndex(p => p.name === power.name);
        return powerIndex === 0 || powerIndex === 1; // Only rank 1-2
    }
    
    // STAGE 2: After first primary, before first secondary - ALL PRIMARY LOCKED
    if (!hasSecondaryPower) {
        return false; // Must pick secondary first!
    }
    
    // STAGE 3: After first secondary - Check progression mode
    if (Build.progressionMode === 'auto') {
        return power.available <= Build.level; // Can only pick powers at or below current level
    } else {
        return true; // Freeform mode - all powers available
    }
}

/**
 * Check if a secondary power can be selected
 * @param {Object} power - Power data
 * @returns {boolean} Can select
 */
function canSelectSecondaryPower(power) {
    const hasPrimaryPower = Build.primary.powers.length > 0;
    const hasSecondaryPower = Build.secondary.powers.length > 0;
    
    // Before first primary pick: All secondary powers locked
    if (!hasPrimaryPower) {
        return false;
    }
    
    // After first primary, before first secondary: Only rank 1-2 available (first two in set)
    if (!hasSecondaryPower) {
        const powerset = POWERSETS[Build.secondary.id];
        if (!powerset) return false;
        
        const powerIndex = powerset.powers.findIndex(p => p.name === power.name);
        return powerIndex === 0 || powerIndex === 1; // Rank 1-2 (first two powers)
    }
    
    // After first secondary: Normal level-based gating
    if (Build.progressionMode === 'auto') {
        return power.available <= Build.level; // Can only pick powers at or below current level
    } else {
        return true; // Freeform mode - all powers available
    }
}

// ============================================
// POWER SELECTION
// ============================================

/**
 * Select a power and add it to the build
 * @param {Object} powerData - Power definition from powerset
 * @param {string} category - 'primary' or 'secondary'
 */
function selectPower(powerData, category) {
    // Check if already selected
    const categoryData = category === 'primary' ? Build.primary : Build.secondary;
    const alreadySelected = categoryData.powers.some(p => p.name === powerData.name);
    
    if (alreadySelected) {
        console.log(`${powerData.name} is already selected`);
        return;
    }
    
    // Check if can select
    const canSelect = category === 'primary' ? canSelectPrimaryPower(powerData) : canSelectSecondaryPower(powerData);
    if (!canSelect) {
        console.log(`Cannot select ${powerData.name} - prerequisites not met`);
        return;
    }
    
    // Create power object
    const power = {
        name: powerData.name,
        level: powerData.available,
        tier: powerData.tier,
        powerSet: categoryData.name,
        category: category,
        slots: [null], // Start with 1 empty slot
        maxSlots: powerData.maxSlots,
        allowedEnhancements: powerData.allowedEnhancements,
        effects: powerData.effects
    };
    
    // Add to build
    categoryData.powers.push(power);
    
    // Auto-level in auto mode: Jump to next power level
    if (Build.progressionMode === 'auto') {
        const nextPowerLevel = getNextPowerLevel(Build.level);
        if (nextPowerLevel) {
            Build.level = nextPowerLevel;
            updateCharacterLevel();
            console.log(`Auto-leveled to ${Build.level} (next power pick)`);
        }
    }
    
    // Add to UI
    addPowerToColumn(power, category);
    
    // Refresh available powers to update gating
    refreshAvailablePowers();
    
    console.log(`Added power: ${powerData.name} to ${category}`);
}

/**
 * Remove a power from the build
 * @param {string} powerName - Power name
 * @param {string} category - 'primary' or 'secondary'
 */
function removePowerFromBuild(powerName, category) {
    const categoryData = category === 'primary' ? Build.primary : Build.secondary;
    const index = categoryData.powers.findIndex(p => p.name === powerName);
    
    if (index === -1) {
        console.log(`Power not found: ${powerName}`);
        return;
    }
    
    // Remove from build
    categoryData.powers.splice(index, 1);
    
    // Remove from UI
    const containerId = category === 'primary' ? 'selectedPrimaryPowers' : 'selectedSecondaryPowers';
    const container = document.getElementById(containerId);
    const powerElements = container.querySelectorAll('.selected-power');
    
    for (const elem of powerElements) {
        const nameSpan = elem.querySelector('.selected-power-name');
        if (nameSpan && nameSpan.textContent === powerName) {
            elem.remove();
            break;
        }
    }
    
    // Refresh available powers to update gating
    refreshAvailablePowers();
    
    console.log(`Removed power: ${powerName} from ${category}`);
}

/**
 * Refresh available powers lists (after adding/removing powers)
 */
function refreshAvailablePowers() {
    if (Build.primary.id) {
        const powerset = POWERSETS[Build.primary.id];
        if (powerset) {
            updateAvailablePrimaryPowers(powerset);
        }
    }
    
    if (Build.secondary.id) {
        const powerset = POWERSETS[Build.secondary.id];
        if (powerset) {
            updateAvailableSecondaryPowers(powerset);
        }
    }
    
    // Update pool powers column (column 4)
    if (arePoolsUnlocked()) {
        updatePoolPowersColumn();
    }
}

/**
 * Update pool powers column (column 4)
 */
function updatePoolPowersColumn() {
    const container = document.querySelector('.column:nth-child(4) .column-content');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add pool selector button
    const addPoolBtn = document.createElement('button');
    addPoolBtn.className = 'add-pool-btn';
    addPoolBtn.textContent = '+ Add Power Pool';
    addPoolBtn.onclick = () => openPoolPowerModal();
    container.appendChild(addPoolBtn);
    
    // Display selected pool powers grouped by pool
    Build.pools.forEach(poolData => {
        const pool = POWER_POOLS[poolData.id];
        if (!pool) return;
        
        // Only show pool if it has powers
        if (poolData.powers.length === 0) return;
        
        // Create pool group
        const poolGroup = document.createElement('div');
        poolGroup.className = 'pool-power-group';
        poolGroup.style.marginTop = '16px';
        
        // Pool header
        const poolHeader = document.createElement('div');
        poolHeader.style.fontWeight = '600';
        poolHeader.style.fontSize = '11px';
        poolHeader.style.color = 'var(--accent)';
        poolHeader.style.textTransform = 'uppercase';
        poolHeader.style.letterSpacing = '0.05em';
        poolHeader.style.marginBottom = '8px';
        poolHeader.textContent = pool.name;
        poolGroup.appendChild(poolHeader);
        
        // Pool powers
        const poolPowerNames = [];
        poolData.powers.forEach(power => {
            const powerElement = document.createElement('div');
            powerElement.className = 'selected-power';
            powerElement.dataset.powerName = power.name;
            powerElement.innerHTML = `
                <div class="selected-power-header">
                    <span class="selected-power-name">${power.name}</span>
                    <span class="selected-power-level">Level ${power.level}</span>
                </div>
                <div class="enhancement-slots"></div>
            `;
            
            // Add tooltip - get original power data
            const originalPower = getOriginalPowerData(power.name, 'pool', poolData.id);
            if (originalPower) {
                powerElement.onmouseenter = (e) => showPowerTooltip(e, originalPower, true);
                powerElement.onmouseleave = () => hideTooltip();
            }
            
            poolGroup.appendChild(powerElement);
            poolPowerNames.push(power.name);
        });

        container.appendChild(poolGroup);

        // Initialize slots after the group is in the DOM so querySelectorAll finds the elements
        poolPowerNames.forEach(name => updatePowerSlots(name));
    });
}

/**
 * Add power to the appropriate column
 * @param {Object} power - Power object
 * @param {string} category - 'primary' or 'secondary'
 */
function addPowerToColumn(power, category) {
    const containerId = category === 'primary' ? 'selectedPrimaryPowers' : 'selectedSecondaryPowers';
    const container = document.getElementById(containerId);
    
    // Create power element
    const powerElement = document.createElement('div');
    powerElement.className = 'selected-power';
    powerElement.dataset.powerName = power.name;
    powerElement.innerHTML = `
        <div class="selected-power-header">
            <span class="selected-power-name">${power.name}</span>
            <span class="selected-power-level">Level ${power.level}</span>
        </div>
        <div class="enhancement-slots"></div>
    `;
    
    // Add tooltip - get original power data to show effects
    const originalPower = getOriginalPowerData(power.name, category);
    if (originalPower) {
        powerElement.onmouseenter = (e) => showPowerTooltip(e, originalPower, true);
        powerElement.onmouseleave = () => hideTooltip();
    }
    
    // Add to column
    container.appendChild(powerElement);
    
    // Initialize slots
    updatePowerSlots(power.name);
}

// ============================================
// CLEAR FUNCTIONS
// ============================================

/**
 * Clear all available powers
 */
function clearAvailablePowers() {
    clearAvailablePrimaryPowers();
    clearAvailableSecondaryPowers();
}

/**
 * Clear available primary powers
 */
function clearAvailablePrimaryPowers() {
    const container = document.getElementById('availablePrimaryPowers');
    if (container) container.innerHTML = '';
}

/**
 * Clear available secondary powers
 */
function clearAvailableSecondaryPowers() {
    const container = document.getElementById('availableSecondaryPowers');
    if (container) container.innerHTML = '';
}

/**
 * Clear all selected powers
 */
function clearSelectedPowers() {
    clearSelectedPrimaryPowers();
    clearSelectedSecondaryPowers();
}

/**
 * Clear selected primary powers
 */
function clearSelectedPrimaryPowers() {
    Build.primary.powers = [];
    const container = document.getElementById('selectedPrimaryPowers');
    if (container) container.innerHTML = '';
}

/**
 * Clear selected secondary powers
 */
function clearSelectedSecondaryPowers() {
    Build.secondary.powers = [];
    const container = document.getElementById('selectedSecondaryPowers');
    if (container) container.innerHTML = '';
}

// ============================================
// COLUMN HEADER UPDATES
// ============================================

/**
 * Update primary column header
 * @param {string} powersetName - Powerset name
 */
function updatePrimaryColumnHeader(powersetName) {
    const columns = document.querySelectorAll('.column');
    const primaryColumn = columns[1];
    const header = primaryColumn.querySelector('.column-header');
    header.textContent = 'Primary Powers';
}

/**
 * Update secondary column header
 * @param {string} powersetName - Powerset name
 */
function updateSecondaryColumnHeader(powersetName) {
    const columns = document.querySelectorAll('.column');
    const secondaryColumn = columns[2];
    const header = secondaryColumn.querySelector('.column-header');
    header.textContent = 'Secondary Powers';
}

// ============================================
// INHERENT POWER DISPLAY
// ============================================

/**
 * Update inherent power display
 * @param {Object} inherent - Inherent power data
 */
function updateInherentPowerDisplay(inherent) {
    // Find the Defiance power element (or whatever the current inherent is)
    const columns = document.querySelectorAll('.column');
    const poolColumn = columns[3];
    const inherentPowers = poolColumn.querySelectorAll('.selected-power');
    
    // Find the inherent power (last one, no level number)
    const inherentPowerElement = Array.from(inherentPowers).find(elem => {
        const levelSpan = elem.querySelector('.selected-power-level');
        return levelSpan && levelSpan.textContent === 'Inherent';
    });
    
    if (inherentPowerElement) {
        const nameSpan = inherentPowerElement.querySelector('.selected-power-name');
        nameSpan.textContent = inherent.name;
        
        // Update description
        const description = inherentPowerElement.querySelector('div[style*="italic"]');
        if (description) {
            description.textContent = inherent.description;
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get original power data from powersets or pools
 * @param {string} powerName - Power name
 * @param {string} category - 'primary', 'secondary', or 'pool'
 * @param {string} poolId - Pool ID (for pool powers)
 * @returns {Object|null} Original power data
 */
function getOriginalPowerData(powerName, category, poolId = null) {
    if (category === 'primary' && Build.primary.id) {
        const powerset = POWERSETS[Build.primary.id];
        if (powerset) {
            return powerset.powers.find(p => p.name === powerName);
        }
    } else if (category === 'secondary' && Build.secondary.id) {
        const powerset = POWERSETS[Build.secondary.id];
        if (powerset) {
            return powerset.powers.find(p => p.name === powerName);
        }
    } else if (category === 'pool' && poolId) {
        const pool = POWER_POOLS[poolId];
        if (pool) {
            return pool.powers.find(p => p.name === powerName);
        }
    }
    return null;
}

/**
 * Format powerset ID to readable name
 * @param {string} powersetId - Powerset ID
 * @returns {string} Formatted name
 */
function formatPowersetName(powersetId) {
    return powersetId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Show detailed power tooltip
 * @param {Event} event - Mouse event
 * @param {Object} power - Power data
 * @param {boolean} showEnhancements - Whether to show enhancement bonuses
 */
function showPowerTooltip(event, power, showEnhancements = false) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        console.error('Tooltip element not found!');
        return;
    }
    
    if (!power) {
        console.error('Power data is null!');
        return;
    }
    
    let html = `<div class="tooltip-title">${power.name}</div>`;
    
    // Power type
    if (power.type) {
        html += `<div class="tooltip-section">`;
        html += `<div class="tooltip-label">Type</div>`;
        html += `<div class="tooltip-value">${formatPowerType(power.type)}</div>`;
        html += `</div>`;
    }
    
    // Description
    if (power.description) {
        html += `<div class="tooltip-section">`;
        html += `<div class="tooltip-desc">${power.description}</div>`;
        html += `</div>`;
    }
    
    // Effects
    if (power.effects) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        
        // Note: Enhancement bonuses placeholder
        if (showEnhancements) {
            html += `<div style="font-size: 11px; color: var(--accent); margin-bottom: 6px; font-style: italic;">With Enhancements</div>`;
        }
        
        // Damage
        if (power.effects.damage) {
            const dmg = power.effects.damage;
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Damage:</span> `;
            html += `<span class="tooltip-value">${dmg.type} (scale ${dmg.scale})</span>`;
            html += `</div>`;
        }
        
        // DoT Damage
        if (power.effects.dotDamage) {
            const dot = power.effects.dotDamage;
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">DoT:</span> `;
            html += `<span class="tooltip-value">${dot.type} (${dot.scale} × ${dot.ticks} ticks)</span>`;
            html += `</div>`;
        }
        
        // Accuracy
        if (power.effects.accuracy !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Accuracy:</span> `;
            html += `<span class="tooltip-value">${(power.effects.accuracy * 100).toFixed(0)}%</span>`;
            html += `</div>`;
        }
        
        // Range
        if (power.effects.range !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Range:</span> `;
            html += `<span class="tooltip-value">${power.effects.range} ft</span>`;
            html += `</div>`;
        }
        
        // Radius (for AoE)
        if (power.effects.radius !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Radius:</span> `;
            html += `<span class="tooltip-value">${power.effects.radius} ft</span>`;
            html += `</div>`;
        }
        
        // Cone
        if (power.effects.cone) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Cone:</span> `;
            html += `<span class="tooltip-value">${power.effects.cone.range} ft × ${power.effects.cone.arc}°</span>`;
            html += `</div>`;
        }
        
        // Recharge
        if (power.effects.recharge !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Recharge:</span> `;
            html += `<span class="tooltip-value">${power.effects.recharge}s</span>`;
            html += `</div>`;
        }
        
        // Endurance
        if (power.effects.endurance !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Endurance:</span> `;
            html += `<span class="tooltip-value">${power.effects.endurance.toFixed(2)}</span>`;
            html += `</div>`;
        }
        
        // Duration
        if (power.effects.duration !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Duration:</span> `;
            html += `<span class="tooltip-value">${power.effects.duration}s</span>`;
            html += `</div>`;
        }
        
        // Hold/Immobilize/etc
        if (power.effects.immobilize) {
            const imm = power.effects.immobilize;
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Immobilize:</span> `;
            html += `<span class="tooltip-value">Mag ${imm.magnitude} (${imm.duration}s)</span>`;
            html += `</div>`;
        }
        
        // Defense
        if (power.effects.defense) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Defense:</span> `;
            html += `<span class="tooltip-value">+${(power.effects.defense * 100).toFixed(1)}%</span>`;
            html += `</div>`;
        }
        
        // Resistance
        if (power.effects.resistance) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Resistance:</span> `;
            html += `<span class="tooltip-value">+${(power.effects.resistance * 100).toFixed(1)}%</span>`;
            html += `</div>`;
        }
        
        // Regeneration
        if (power.effects.regeneration !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Regeneration:</span> `;
            html += `<span class="tooltip-value">+${(power.effects.regeneration * 100).toFixed(1)}%</span>`;
            html += `</div>`;
        }
        
        // Recovery
        if (power.effects.recovery !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Recovery:</span> `;
            html += `<span class="tooltip-value">+${(power.effects.recovery * 100).toFixed(1)}%</span>`;
            html += `</div>`;
        }
        
        // Buffs
        if (power.effects.tohitBuff !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">To-Hit Buff:</span> `;
            html += `<span class="tooltip-value">+${(power.effects.tohitBuff * 100).toFixed(1)}%</span>`;
            html += `</div>`;
        }
        
        if (power.effects.damageBuff !== undefined) {
            html += `<div class="tooltip-stat">`;
            html += `<span class="tooltip-label">Damage Buff:</span> `;
            html += `<span class="tooltip-value">+${(power.effects.damageBuff * 100).toFixed(1)}%</span>`;
            html += `</div>`;
        }
        
        html += `</div>`;
    }
    
    tooltip.innerHTML = html;
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

/**
 * Format power type for display
 * @param {string} type - Power type
 * @returns {string} Formatted type
 */
function formatPowerType(type) {
    const typeMap = {
        'ranged-single': 'Ranged (Single Target)',
        'ranged-aoe': 'Ranged (Area of Effect)',
        'location-aoe': 'Location AoE',
        'pbaoe': 'Point Blank AoE',
        'cone': 'Cone',
        'melee': 'Melee',
        'self-buff': 'Self Buff',
        'self-heal': 'Self Heal',
        'toggle-aura': 'Toggle Aura',
        'ranged-snipe': 'Ranged Sniper'
    };
    
    return typeMap[type] || type;
}

/**
 * Position tooltip near mouse cursor
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {Event} event - Mouse event
 */
function positionTooltip(tooltip, event) {
    const offset = 10;
    let x = event.clientX + offset;
    let y = event.clientY + offset;
    
    // Set initial position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    
    // Get tooltip dimensions for edge detection
    const rect = tooltip.getBoundingClientRect();
    
    // Adjust if tooltip goes off right edge
    if (rect.right > window.innerWidth) {
        x = event.clientX - rect.width - offset;
    }
    
    // Adjust if tooltip goes off bottom edge
    if (rect.bottom > window.innerHeight) {
        y = event.clientY - rect.height - offset;
    }
    
    // Apply final position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    initializeCharacterCreator();
});

// ============================================
// POWER POOL MANAGEMENT
// ============================================

/**
 * Check if power pools are unlocked (level 4+)
 * @returns {boolean}
 */
function arePoolsUnlocked() {
    return Build.level >= 4;
}

/**
 * Check if a pool power can be selected
 * @param {Object} pool - Pool definition
 * @param {Object} power - Power from pool
 * @returns {boolean}
 */
function canSelectPoolPower(pool, power) {
    // Pools unlock at level 4
    if (!arePoolsUnlocked()) {
        return false;
    }
    
    // Check level requirement
    if (Build.progressionMode === 'auto' && power.available > Build.level) {
        return false;
    }
    
    // Rank 1-2: Available immediately (at level 4+)
    if (power.rank === 1 || power.rank === 2) {
        return true;
    }
    
    // Rank 3-4: Check prerequisite count
    const poolData = Build.pools.find(p => p.id === pool.id);
    if (!poolData) {
        return false; // Pool not selected yet
    }
    
    const powersTaken = poolData.powers.length;
    const requiredCount = power.prerequisiteCount || 0;
    
    return powersTaken >= requiredCount;
}

/**
 * Add a power pool to the build
 * @param {string} poolId - Pool ID
 */
function addPowerPool(poolId) {
    // Check if pool already added
    if (Build.pools.some(p => p.id === poolId)) {
        console.log(`Pool already added: ${poolId}`);
        return;
    }
    
    // Max 4 pools
    if (Build.pools.length >= 4) {
        alert('Maximum 4 power pools allowed');
        return;
    }
    
    const pool = POWER_POOLS[poolId];
    if (!pool) {
        console.warn(`Pool not found: ${poolId}`);
        return;
    }
    
    // Add pool to build
    Build.pools.push({
        id: poolId,
        name: pool.name,
        powers: []
    });
    
    console.log(`Added pool: ${pool.name}`);
    
    // Close modal
    closePoolSelector();
    
    // Refresh available powers
    refreshAvailablePowers();
}

/**
 * Remove a power pool from the build
 * @param {string} poolId - Pool ID
 */
function removePowerPool(poolId) {
    const index = Build.pools.findIndex(p => p.id === poolId);
    if (index === -1) {
        return;
    }
    
    // Remove pool and all its powers
    Build.pools.splice(index, 1);
    
    console.log(`Removed pool: ${poolId}`);
    
    // Refresh UI
    refreshAvailablePowers();
}

/**
 * Select a power from a power pool
 * @param {Object} powerData - Power definition
 * @param {string} poolId - Pool ID
 */
function selectPoolPower(powerData, poolId) {
    const poolData = Build.pools.find(p => p.id === poolId);
    if (!poolData) {
        console.error(`Pool not found: ${poolId}`);
        return;
    }
    
    // Check if already selected
    if (poolData.powers.some(p => p.name === powerData.name)) {
        console.log(`${powerData.name} already selected`);
        return;
    }
    
    // Create power object
    const power = {
        name: powerData.name,
        level: powerData.available,
        rank: powerData.rank,
        powerSet: poolData.name,
        category: 'pool',
        poolId: poolId,
        slots: [null],
        maxSlots: 6,
        allowedEnhancements: powerData.allowedEnhancements,
        effects: powerData.effects
    };
    
    // Add to pool
    poolData.powers.push(power);
    
    // Auto-level in auto mode
    if (Build.progressionMode === 'auto') {
        const nextPowerLevel = getNextPowerLevel(Build.level);
        if (nextPowerLevel) {
            Build.level = nextPowerLevel;
            updateCharacterLevel();
            console.log(`Auto-leveled to ${Build.level} (next power pick)`);
        }
    }
    
    // Refresh UI
    refreshAvailablePowers();
    
    console.log(`Added pool power: ${powerData.name} from ${poolData.name}`);
}

/**
 * Remove a pool power from build
 * @param {string} powerName - Power name
 * @param {string} poolId - Pool ID
 */
function removePoolPowerFromBuild(powerName, poolId) {
    const poolData = Build.pools.find(p => p.id === poolId);
    if (!poolData) return;
    
    const index = poolData.powers.findIndex(p => p.name === powerName);
    if (index === -1) return;
    
    // Remove power
    poolData.powers.splice(index, 1);
    
    // Refresh UI
    refreshAvailablePowers();
    
    console.log(`Removed pool power: ${powerName}`);
}

/**
 * Open pool power selection modal
 */
function openPoolPowerModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'poolPowerModal';
    modal.className = 'simple-modal';
    
    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.className = 'simple-modal-content pool-modal-content';
    
    // Header
    const header = document.createElement('h3');
    header.textContent = 'Select Power Pool Power';
    modalContent.appendChild(header);
    
    // Scrollable list container
    const listContainer = document.createElement('div');
    listContainer.className = 'pool-modal-list';
    
    // Build pool sections
    Object.values(POWER_POOLS).forEach(pool => {
        const poolSection = document.createElement('div');
        poolSection.className = 'pool-section';
        
        // Pool header
        const poolHeader = document.createElement('div');
        poolHeader.className = 'pool-section-header';
        poolHeader.textContent = pool.name;
        poolSection.appendChild(poolHeader);
        
        // Pool powers
        pool.powers.forEach(power => {
            const canSelect = canSelectPoolPowerInModal(pool, power);
            
            const powerOption = document.createElement('div');
            powerOption.className = 'pool-power-option';
            if (!canSelect) {
                powerOption.classList.add('disabled');
            }
            
            // Power info
            const powerInfo = document.createElement('div');
            
            const powerName = document.createElement('div');
            powerName.className = 'pool-power-name';
            powerName.textContent = power.name;
            powerInfo.appendChild(powerName);
            
            const powerDesc = document.createElement('div');
            powerDesc.className = 'pool-power-desc';
            powerDesc.textContent = power.description;
            powerInfo.appendChild(powerDesc);
            
            powerOption.appendChild(powerInfo);
            
            // Level requirement
            const powerLevel = document.createElement('div');
            powerLevel.className = 'pool-power-level';
            let levelText = `Level ${power.available}`;
            if (power.prerequisiteCount) {
                levelText += ` (${power.prerequisiteCount}+ from ${pool.name})`;
            }
            powerLevel.textContent = levelText;
            powerOption.appendChild(powerLevel);
            
            // Add click handler if selectable
            if (canSelect) {
                powerOption.style.cursor = 'pointer';
                powerOption.addEventListener('click', () => {
                    selectPoolPowerFromModal(pool.id, power.name);
                });
            }
            
            // Add tooltip (base values for modal)
            powerOption.addEventListener('mouseenter', (e) => {
                showPowerTooltip(e, power, false);
            });
            powerOption.addEventListener('mouseleave', () => {
                hideTooltip();
            });
            
            poolSection.appendChild(powerOption);
        });
        
        listContainer.appendChild(poolSection);
    });
    
    modalContent.appendChild(listContainer);
    
    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', closePoolPowerModal);
    modalContent.appendChild(cancelBtn);
    
    // Assemble modal
    modal.appendChild(modalContent);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePoolPowerModal();
        }
    });
    
    // Add to page
    document.body.appendChild(modal);
}

/**
 * Check if a pool power can be selected (in modal context)
 * @param {Object} pool - Pool definition
 * @param {Object} power - Power from pool
 * @returns {boolean}
 */
function canSelectPoolPowerInModal(pool, power) {
    // Check if already selected
    const poolData = Build.pools.find(p => p.id === pool.id);
    if (poolData && poolData.powers.some(p => p.name === power.name)) {
        return false; // Already selected
    }
    
    // Pools unlock at level 4
    if (Build.level < 4) {
        return false;
    }
    
    // Check level requirement
    if (Build.progressionMode === 'auto' && power.available > Build.level) {
        return false;
    }
    
    // Rank 1-2: Available immediately (at level 4+)
    if (power.rank === 1 || power.rank === 2) {
        return true;
    }
    
    // Rank 3-4: Check prerequisite count
    if (!poolData) {
        return false; // Pool not added yet, can't select rank 3-4
    }
    
    const powersTaken = poolData.powers.length;
    const requiredCount = power.prerequisiteCount || 0;
    
    return powersTaken >= requiredCount;
}

/**
 * Select a pool power from the modal
 * @param {string} poolId - Pool ID
 * @param {string} powerName - Power name
 */
function selectPoolPowerFromModal(poolId, powerName) {
    const pool = POWER_POOLS[poolId];
    if (!pool) return;
    
    const power = pool.powers.find(p => p.name === powerName);
    if (!power) return;
    
    // Add pool to build if not already added
    let poolData = Build.pools.find(p => p.id === poolId);
    if (!poolData) {
        // Check max pools
        if (Build.pools.length >= 4) {
            alert('Maximum 4 power pools allowed');
            return;
        }
        
        poolData = {
            id: poolId,
            name: pool.name,
            powers: []
        };
        Build.pools.push(poolData);
        console.log(`Added pool: ${pool.name}`);
    }
    
    // Create power object
    const powerObj = {
        name: power.name,
        level: power.available,
        rank: power.rank,
        powerSet: pool.name,
        category: 'pool',
        poolId: poolId,
        slots: [null],
        maxSlots: 6,
        allowedEnhancements: power.allowedEnhancements,
        effects: power.effects
    };
    
    // Add to pool
    poolData.powers.push(powerObj);
    
    // Auto-level in auto mode
    if (Build.progressionMode === 'auto') {
        const nextPowerLevel = getNextPowerLevel(Build.level);
        if (nextPowerLevel) {
            Build.level = nextPowerLevel;
            updateCharacterLevel();
            console.log(`Auto-leveled to ${Build.level} (next power pick)`);
        }
    }
    
    console.log(`Added pool power: ${power.name} from ${pool.name}`);
    
    // Close modal and refresh
    closePoolPowerModal();
    refreshAvailablePowers();
}

/**
 * Close pool power modal
 */
function closePoolPowerModal() {
    const modal = document.getElementById('poolPowerModal');
    if (modal) modal.remove();
}

// ============================================
// PROGRESSION MODE
// ============================================

/**
 * Change progression mode (auto-level or freeform)
 */
function changeProgressionMode() {
    const modeSelect = document.getElementById('progressionMode');
    Build.progressionMode = modeSelect.value;
    
    console.log(`Progression mode: ${Build.progressionMode}`);
    
    // Refresh available powers to update gating
    refreshAvailablePowers();
}

/**
 * Update character level display
 */
function updateCharacterLevel() {
    const levelDisplay = document.getElementById('charLevel');
    if (levelDisplay) {
        levelDisplay.textContent = Build.level;
    }
}
