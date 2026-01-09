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
    
    // Initialize inherent powers
    Build.inherents = initializeInherentPowers(archetypeId);
    
    // Display inherent powers in UI
    displayInherentPowers();
    
    // Clear selected powers
    clearSelectedPowers();
    
    // Update baseline stats and recalculate all stats
    if (typeof updateBaselineStats === 'function') {
        updateBaselineStats();
    }
    if (typeof recalculateStats === 'function') {
        recalculateStats();
    }
    
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
        
        // Hover tooltip - use available power tooltip (base values only)
        powerElement.onmouseenter = (e) => {
            if (typeof showAvailablePowerTooltip === 'function') {
                showAvailablePowerTooltip(e, power);
            }
        };
        powerElement.onmouseleave = () => {
            if (typeof hideTooltip === 'function') {
                hideTooltip();
            }
        };
        
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
        
        // Hover tooltip - use available power tooltip (base values only)
        powerElement.onmouseenter = (e) => {
            if (typeof showAvailablePowerTooltip === 'function') {
                showAvailablePowerTooltip(e, power);
            }
        };
        powerElement.onmouseleave = () => {
            if (typeof hideTooltip === 'function') {
                hideTooltip();
            }
        };
        
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
        // New field: allowedSetCategories comes from the powerset data (used by enhancement filtering)
        allowedSetCategories: powerData.allowedSetCategories || null,
        effects: powerData.effects,
        powerType: powerData.powerType || null, // Track power type for Toggle/Auto powers
        isActive: false  // For toggles, autos, and buffs like Aim, Build Up
    };
    
    // Add to build
    categoryData.powers.push(power);
    
    // Auto-level in auto mode: Update level based on total power count
    if (Build.progressionMode === 'auto') {
        updateLevelFromPowerCount();
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
    
    // Auto-adjust level in auto mode: Update based on total power count
    if (Build.progressionMode === 'auto') {
        updateLevelFromPowerCount();
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
    
    // Get pool button or create it if needed
    let addPoolBtn = container.querySelector('.add-pool-btn');
    if (!addPoolBtn) {
        addPoolBtn = document.createElement('button');
        addPoolBtn.className = 'add-pool-btn';
        addPoolBtn.textContent = '+ Add Power Pool';
        addPoolBtn.onclick = () => openPoolPowerModal();
        container.appendChild(addPoolBtn);
    }
    
    // Remove existing pool power groups (but keep inherent sections)
    const existingGroups = container.querySelectorAll('.pool-power-group');
    existingGroups.forEach(group => group.remove());
    
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
            
            // Add tooltip - use unified tooltip system
            powerElement.onmouseenter = (e) => {
                const originalPower = getOriginalPowerData(power.name, 'pool', poolData.id);
                if (originalPower && typeof showPowerTooltip === 'function') {
                    showPowerTooltip(e, power, originalPower);
                }
            };
            powerElement.onmouseleave = () => {
                if (typeof hideTooltip === 'function') {
                    hideTooltip();
                }
            };
            
            poolGroup.appendChild(powerElement);
        });

        container.appendChild(poolGroup);

        // Initialize slots after the group is in the DOM
        poolData.powers.forEach(power => {
            updatePowerSlots(power.name);
        });
    });
    
    // Display epic pool section (if selected)
    if (Build.epicPool.id && Build.epicPool.powers.length > 0) {
        const pool = EPIC_POOLS[Build.epicPool.id];
        if (pool) {
            const epicPoolGroup = document.createElement('div');
            epicPoolGroup.className = 'epic-pool-group';
            epicPoolGroup.style.marginTop = '20px';
            epicPoolGroup.style.borderTop = '1px solid var(--border)';
            epicPoolGroup.style.paddingTop = '12px';
            
            // Epic pool header (with remove button)
            const epicPoolHeader = document.createElement('div');
            epicPoolHeader.style.display = 'flex';
            epicPoolHeader.style.justifyContent = 'space-between';
            epicPoolHeader.style.alignItems = 'center';
            epicPoolHeader.style.marginBottom = '8px';
            
            const headerName = document.createElement('div');
            headerName.style.fontWeight = '600';
            headerName.style.fontSize = '11px';
            headerName.style.color = 'var(--accent)';
            headerName.style.textTransform = 'uppercase';
            headerName.style.letterSpacing = '0.05em';
            headerName.textContent = `${pool.name} (Epic)`;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.fontSize = '10px';
            removeBtn.style.padding = '2px 6px';
            removeBtn.style.backgroundColor = 'var(--button-bg)';
            removeBtn.style.color = 'var(--text)';
            removeBtn.style.border = '1px solid var(--border)';
            removeBtn.style.cursor = 'pointer';
            removeBtn.onclick = removeEpicPool;
            
            epicPoolHeader.appendChild(headerName);
            epicPoolHeader.appendChild(removeBtn);
            epicPoolGroup.appendChild(epicPoolHeader);
            
            // Epic pool powers
            Build.epicPool.powers.forEach(power => {
                const powerElement = document.createElement('div');
                powerElement.className = 'selected-power epic-power';
                powerElement.dataset.powerName = power.name;
                
                // Check if this is a toggle or auto power that needs a checkbox
                const needsToggle = power.powerType === 'Toggle' || power.powerType === 'Auto';
                
                powerElement.innerHTML = `
                    <div class="selected-power-header">
                        <span class="selected-power-name">${power.name}</span>
                        ${needsToggle ? `
                            <label class="switch">
                                <input type="checkbox" class="power-toggle-input">
                                <span class="slider round"></span>
                            </label>
                        ` : ''}
                        <span class="selected-power-level">Level ${power.level}</span>
                    </div>
                    <div class="enhancement-slots"></div>
                `;
                
                // Add toggle handler if needed
                if (needsToggle) {
                    const checkbox = powerElement.querySelector('.power-toggle-input');
                    checkbox.checked = power.isActive || false;
                    checkbox.addEventListener('change', (e) => {
                        e.stopPropagation();
                        power.isActive = checkbox.checked;
                        console.log(`${power.name} active: ${power.isActive}`);
                        // Recalculate stats
                        if (typeof recalculateStats === 'function') {
                            recalculateStats();
                        }
                    });
                }
                
                // Add tooltip for epic powers
                powerElement.onmouseenter = (e) => {
                    const originalPower = getEpicPoolPower(Build.epicPool.id, power.name);
                    if (originalPower && typeof showPowerTooltip === 'function') {
                        showPowerTooltip(e, power, originalPower);
                    }
                };
                powerElement.onmouseleave = () => {
                    if (typeof hideTooltip === 'function') {
                        hideTooltip();
                    }
                };
                
                epicPoolGroup.appendChild(powerElement);
            });
            
            container.appendChild(epicPoolGroup);
            
            // Initialize slots for epic powers
            Build.epicPool.powers.forEach(power => {
                updatePowerSlots(power.name);
            });
        }
    }
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
    
    // Check if this is a power that needs a toggle checkbox
    // Toggle/Auto powers always get a checkbox, plus buff powers with tohitBuff or damageBuff
    const isToggleOrAuto = power.powerType === 'Toggle' || power.powerType === 'Auto';
    const isBuffPower = power.effects && (power.effects.tohitBuff || power.effects.damageBuff);
    const needsToggle = isToggleOrAuto || isBuffPower;
    
    powerElement.innerHTML = `
        <div class="selected-power-header">
            <span class="selected-power-name">${power.name}</span>
            <span class="selected-power-level">Level ${power.level}</span>
        </div>
        ${needsToggle ? `
            <label class="switch" style="position: absolute; bottom: 4px; right: 4px;">
                <input type="checkbox" class="power-toggle-input">
                <span class="slider round"></span>
            </label>
        ` : ''}
        <div class="enhancement-slots"></div>
    `;
    
    // Add toggle handler for powers that need it
    if (needsToggle) {
        const checkbox = powerElement.querySelector('.power-toggle-input');
        checkbox.checked = power.isActive || false;
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            power.isActive = checkbox.checked;
            console.log(`${power.name} active: ${power.isActive}`);
            // Recalculate stats to update Final column values
            if (typeof recalculateStats === 'function') {
                recalculateStats();
            }
        });
    }
    
    // Add tooltip - use unified tooltip system to show Base/Enhanced/Final stats
    powerElement.onmouseenter = (e) => {
        const originalPower = getOriginalPowerData(power.name, category);
        if (originalPower && typeof showPowerTooltip === 'function') {
            // Pass the power from build and original definition
            showPowerTooltip(e, power, originalPower);
        }
    };
    powerElement.onmouseleave = () => {
        if (typeof hideTooltip === 'function') {
            hideTooltip();
        }
    };
    
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
    } else if (category === 'epic' && poolId) {
        const epicPool = EPIC_POOLS[poolId];
        if (epicPool) {
            return epicPool.powers.find(p => p.name === powerName);
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

// Power tooltip functions moved to unified-tooltips.js

// Tooltip utility functions moved to unified-tooltips.js

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
    
    // Special handling for travel powers that unlock at level 4
    const travelPowersLevel4 = [
        { pool: 'flight', power: 'Fly' },
        { pool: 'teleportation', power: 'Teleport' },
        { pool: 'leaping', power: 'Super Jump' },
        { pool: 'speed', power: 'Super Speed' },
        { pool: 'experimentation', power: 'Speed of Sound' },
        { pool: 'invisibility', power: 'Infiltration' },
        { pool: 'sorcery', power: 'Mystic Flight' }
    ];
    
    const isTravelPowerLevel4 = travelPowersLevel4.some(t => t.pool === pool.id && t.power === power.name);
    
    // Travel powers at level 4: Available at level 4 with no prerequisites
    if (isTravelPowerLevel4) {
        return Build.level >= 4;
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
        slots: [null], // Start with 1 empty slot
        maxSlots: 6,
        allowedEnhancements: powerData.allowedEnhancements,
        effects: powerData.effects,
        powerType: powerData.powerType || null, // Track power type for Auto powers
        isActive: false // For toggle powers and auto powers
    };
    
    // Add to pool
    poolData.powers.push(power);
    
    // Auto-level in auto mode: Update based on total power count
    if (Build.progressionMode === 'auto') {
        updateLevelFromPowerCount();
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
    
    // Auto-adjust level in auto mode: Update based on total power count
    if (Build.progressionMode === 'auto') {
        updateLevelFromPowerCount();
    }
    
    // Recalculate stats to remove pool power effects
    if (typeof recalculateStats === 'function') {
        recalculateStats();
    }
    
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
    
    // Build pool sections (skip Fitness since those are inherent powers)
    Object.values(POWER_POOLS).forEach(pool => {
        // Skip Fitness pool - those powers are inherent and auto-added
        if (pool.id === 'fitness') {
            return;
        }
        
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
            
            powerOption.appendChild(powerInfo);
            
            // Level requirement
            const powerLevel = document.createElement('div');
            powerLevel.className = 'pool-power-level';
            
            // Special handling for travel powers at level 4
            const travelPowersLevel4 = [
                { pool: 'flight', power: 'Fly' },
                { pool: 'teleportation', power: 'Teleport' },
                { pool: 'leaping', power: 'Super Jump' },
                { pool: 'speed', power: 'Super Speed' },
                { pool: 'experimentation', power: 'Speed of Sound' },
                { pool: 'invisibility', power: 'Infiltration' },
                { pool: 'sorcery', power: 'Mystic Flight' }
            ];
            
            const isTravelPowerLevel4 = travelPowersLevel4.some(t => t.pool === pool.id && t.power === power.name);
            
            // Build requirement text
            let requirementText = '';
            if (power.rank === 1 || power.rank === 2) {
                requirementText = `Level ${Math.max(4, power.available || 4)}`;
            } else if (isTravelPowerLevel4) {
                requirementText = `Level 4`;
            } else if (power.rank === 3) {
                requirementText = `Level 14, 1 other ${pool.name} power`;
            } else if (power.rank >= 4) {
                requirementText = `Level 14, 2 other ${pool.name} powers`;
            }
            
            powerLevel.textContent = requirementText;
            
            // Show why it's disabled
            if (!canSelect) {
                if (Build.level < 4) {
                    powerLevel.textContent += ' (Unlock at level 4)';
                } else if (isTravelPowerLevel4 && Build.level < 4) {
                    powerLevel.textContent += ' (Need level 4)';
                } else if (!isTravelPowerLevel4 && power.rank >= 3 && Build.level < 14) {
                    powerLevel.textContent += ' (Need level 14)';
                } else if (power.rank >= 3) {
                    const poolData = Build.pools.find(p => p.id === pool.id);
                    const powersOwned = poolData ? poolData.powers.length : 0;
                    const powersNeeded = power.rank === 3 ? 1 : 2;
                    if (powersOwned < powersNeeded) {
                        powerLevel.textContent += ` (Need ${powersNeeded - powersOwned} more)`;
                    }
                }
            }
            
            powerOption.appendChild(powerLevel);
            
            // Add click handler if selectable
            if (canSelect) {
                powerOption.style.cursor = 'pointer';
                powerOption.addEventListener('click', () => {
                    selectPoolPowerFromModal(pool.id, power.name);
                });
            }
            
            // Add tooltip (available power - base values only)
            powerOption.addEventListener('mouseenter', (e) => {
                if (typeof showAvailablePowerTooltip === 'function') {
                    showAvailablePowerTooltip(e, power);
                }
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
    
    // Rank 3+: Requires level 14 AND prerequisites
    if (power.rank >= 3) {
        // Must be level 14+
        if (Build.level < 14) {
            return false;
        }
        
        // Pool must already be added
        if (!poolData) {
            return false;
        }
        
        // Rank 3: Need 1 other power from pool
        if (power.rank === 3) {
            return poolData.powers.length >= 1;
        }
        
        // Rank 4-5: Need 2 other powers from pool
        if (power.rank >= 4) {
            return poolData.powers.length >= 2;
        }
    }
    
    return false;
}

/**
 * Select a pool power from the modal
 * @param {string} poolId - Pool ID
 * @param {string} powerName - Power name
 */
function selectPoolPowerFromModal(poolId, powerName) {
    console.log('selectPoolPowerFromModal called with poolId:', poolId, 'powerName:', powerName);
    
    const pool = POWER_POOLS[poolId];
    if (!pool) {
        console.log('Pool not found:', poolId);
        return;
    }
    
    const power = pool.powers.find(p => p.name === powerName);
    if (!power) {
        console.log('Power not found:', powerName);
        return;
    }
    
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
        console.log(`Added pool: ${pool.name}, Build.pools is now:`, Build.pools);
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
    console.log(`Added pool power: ${power.name} from ${pool.name}, Build.pools is now:`, Build.pools);
    
    // Auto-level in auto mode: Update based on total power count
    if (Build.progressionMode === 'auto') {
        updateLevelFromPowerCount();
    }
    
    console.log(`Added pool power: ${power.name} from ${pool.name}`);
    
    // Recalculate stats to include pool power effects
    if (typeof recalculateStats === 'function') {
        recalculateStats();
    }
    
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
/**
 * Update character level display and pool button state
 */
function updateCharacterLevel() {
    const levelDisplay = document.getElementById('charLevel');
    if (levelDisplay) {
        levelDisplay.textContent = Build.level;
    }
    
    // Update baseline stats when level changes
    if (typeof updateBaselineStats === 'function') {
        updateBaselineStats();
    }
    if (typeof recalculateStats === 'function') {
        recalculateStats();
    }
    
    // Update pool button state
    const addPoolBtn = document.getElementById('addPoolBtn');
    if (addPoolBtn) {
        if (Build.level >= 4) {
            addPoolBtn.disabled = false;
            addPoolBtn.title = '';
            addPoolBtn.style.opacity = '1';
            addPoolBtn.style.cursor = 'pointer';
        } else {
            addPoolBtn.disabled = true;
            addPoolBtn.title = 'Power Pools unlock at level 4';
            addPoolBtn.style.opacity = '0.5';
            addPoolBtn.style.cursor = 'not-allowed';
        }
    }
    
    // Update epic pool button state
    const addEpicPoolBtn = document.getElementById('addEpicPoolBtn');
    if (addEpicPoolBtn) {
        if (Build.level >= 35) {
            addEpicPoolBtn.disabled = false;
            addEpicPoolBtn.title = '';
            addEpicPoolBtn.style.opacity = '1';
            addEpicPoolBtn.style.cursor = 'pointer';
        } else {
            addEpicPoolBtn.disabled = true;
            addEpicPoolBtn.title = 'Epic Pools unlock at level 35';
            addEpicPoolBtn.style.opacity = '0.5';
            addEpicPoolBtn.style.cursor = 'not-allowed';
        }
    }
}
// ============================================
// EPIC POOL MANAGEMENT
// ============================================

/**
 * Check if epic pools are unlocked (level 35+)
 * @returns {boolean}
 */
function areEpicPoolsUnlocked() {
    return Build.level >= 35;
}

/**
 * Check if an epic pool power can be selected
 * @param {Object} pool - Epic pool definition
 * @param {Object} power - Power from epic pool
 * @returns {boolean}
 */
function canSelectEpicPoolPower(pool, power) {
    // Epic pools unlock at level 35
    if (!areEpicPoolsUnlocked()) {
        return false;
    }
    
    // Check level requirement
    if (Build.progressionMode === 'auto' && power.available > Build.level) {
        return false;
    }
    
    // All epic pool powers require 4 prerequisite powers from regular pools (rank 1-3)
    const powersTaken = Build.pools.reduce((sum, p) => sum + p.powers.length, 0);
    const requiredPowers = 4;
    
    return powersTaken >= requiredPowers;
}

/**
 * Add an epic pool to the build (replacing any existing epic pool)
 * @param {string} poolId - Epic pool ID
 */
function addEpicPool(poolId) {
    console.log(`addEpicPool called with poolId: ${poolId}`);
    
    const pool = EPIC_POOLS[poolId];
    if (!pool) {
        console.warn(`Epic pool not found: ${poolId}`);
        console.warn('Available pools:', Object.keys(EPIC_POOLS));
        return;
    }
    
    // Replace existing epic pool if any
    if (Build.epicPool.id === poolId) {
        console.log(`Epic pool already selected: ${poolId}`);
        return;
    }
    
    // Remove all powers from previous epic pool
    Build.epicPool = {
        id: poolId,
        name: pool.name,
        powers: []
    };
    
    console.log(`Added epic pool: ${pool.name}`);
    
    // Close pool selection modal
    closeEpicPoolSelector();
    
    // Open power selection modal
    openEpicPoolPowerModal();
    
    // Refresh UI
    refreshAvailablePowers();
}

/**
 * Remove epic pool from the build
 */
function removeEpicPool() {
    if (Build.epicPool.id) {
        const oldName = Build.epicPool.name;
        Build.epicPool = {
            id: null,
            name: '',
            powers: []
        };
        
        console.log(`Removed epic pool: ${oldName}`);
        
        // Refresh UI
        refreshAvailablePowers();
    }
}

/**
 * Select a power from an epic pool
 * @param {Object} powerData - Power definition
 * @param {string} poolId - Epic pool ID
 */
function selectEpicPoolPower(powerData, poolId) {
    const poolData = Build.epicPool;
    if (!poolData || poolData.id !== poolId) {
        console.error(`Epic pool not selected: ${poolId}`);
        return;
    }
    
    // Check if already selected
    if (poolData.powers.some(p => p.name === powerData.name)) {
        console.log(`${powerData.name} already selected`);
        return;
    }
    
    // Check level requirement
    if (Build.progressionMode === 'auto' && powerData.available > Build.level) {
        alert(`${powerData.name} requires level ${powerData.available}`);
        return;
    }
    
    // Create power object
    const power = {
        name: powerData.name,
        level: powerData.available,
        rank: powerData.rank,
        powerSet: poolData.name,
        category: 'epic',
        poolId: poolId,
        slots: [null], // Start with 1 empty slot
        maxSlots: 6,
        allowedEnhancements: powerData.allowedEnhancements,
        effects: powerData.effects,
        powerType: powerData.powerType || null, // Track power type for Auto powers
        isActive: false // For toggle powers and auto powers
    };
    
    // Add to epic pool
    poolData.powers.push(power);
    
    // Auto-level in auto mode: Update based on total power count
    if (Build.progressionMode === 'auto') {
        updateLevelFromPowerCount();
    }
    
    console.log(`Selected epic power: ${powerData.name}`);
    
    // Recalculate stats
    if (typeof recalculateStats === 'function') {
        recalculateStats();
    }
    
    // Refresh UI
    refreshAvailablePowers();
}

/**
 * Remove an epic pool power from build
 * @param {string} powerName - Power name
 */
function removeEpicPoolPowerFromBuild(powerName) {
    const poolData = Build.epicPool;
    if (!poolData || !poolData.id) return;
    
    const index = poolData.powers.findIndex(p => p.name === powerName);
    if (index === -1) return;
    
    // Remove power
    poolData.powers.splice(index, 1);
    
    // Auto-adjust level in auto mode: Update based on total power count
    if (Build.progressionMode === 'auto') {
        updateLevelFromPowerCount();
    }
    
    // Recalculate stats
    if (typeof recalculateStats === 'function') {
        recalculateStats();
    }
    
    // Refresh UI
    refreshAvailablePowers();
    
    console.log(`Removed epic pool power: ${powerName}`);
}

/**
 * Open epic pool power selection modal
 */
function openEpicPoolPowerModal() {
    console.log(`openEpicPoolPowerModal called for pool: ${Build.epicPool.id}`);
    
    if (!Build.epicPool.id) {
        alert('Select an epic pool first');
        return;
    }
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'epicPoolPowerModal';
    modal.className = 'simple-modal';
    
    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.className = 'simple-modal-content epic-power-modal-content';
    
    // Header
    const header = document.createElement('h3');
    header.textContent = `${Build.epicPool.name} Powers`;
    modalContent.appendChild(header);
    
    // Scrollable list container
    const listContainer = document.createElement('div');
    listContainer.className = 'epic-power-modal-list';
    
    const pool = EPIC_POOLS[Build.epicPool.id];
    if (pool) {
        pool.powers.forEach(power => {
            const canSelect = !Build.epicPool.powers.some(p => p.name === power.name);
            
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
            powerDesc.style.fontSize = '10px';
            powerDesc.style.color = 'var(--text-secondary)';
            powerDesc.style.marginTop = '2px';
            powerDesc.textContent = power.shortHelp || power.description;
            powerInfo.appendChild(powerDesc);
            
            powerOption.appendChild(powerInfo);
            
            // Level requirement
            const powerLevel = document.createElement('div');
            powerLevel.className = 'pool-power-level';
            powerLevel.textContent = `Level ${Math.max(35, power.available || 35)}`;
            powerOption.appendChild(powerLevel);
            
            if (canSelect) {
                powerOption.onclick = (e) => {
                    e.stopPropagation();
                    selectEpicPoolPower(power, Build.epicPool.id);
                    closeEpicPoolPowerModal();
                };
            }
            
            listContainer.appendChild(powerOption);
        });
    }
    
    modalContent.appendChild(listContainer);
    
    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', closeEpicPoolPowerModal);
    modalContent.appendChild(cancelBtn);
    
    // Assemble modal
    modal.appendChild(modalContent);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEpicPoolPowerModal();
        }
    });
    
    // Add to page
    document.body.appendChild(modal);
}

/**
 * Close epic pool power selection modal
 */
function closeEpicPoolPowerModal() {
    const modal = document.getElementById('epicPoolPowerModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Open epic pool selection modal
 */
function openEpicPoolSelector() {
    console.log('openEpicPoolSelector called');
    
    if (!areEpicPoolsUnlocked()) {
        alert('Epic Pools unlock at level 35');
        return;
    }
    
    console.log('Epic pools unlocked, creating modal');
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'epicPoolModal';
    modal.className = 'simple-modal';
    
    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.className = 'simple-modal-content epic-modal-content';
    
    // Header
    const header = document.createElement('h3');
    header.textContent = 'Select Epic Pool';
    modalContent.appendChild(header);
    
    // Description
    const desc = document.createElement('p');
    desc.style.fontSize = '11px';
    desc.style.color = 'var(--text-secondary)';
    desc.style.marginBottom = '12px';
    desc.textContent = 'Epic Pools unlock at level 35. You may select ONE epic pool.';
    modalContent.appendChild(desc);
    
    // Scrollable list container
    const listContainer = document.createElement('div');
    listContainer.className = 'epic-modal-list';
    
    // Get epic pools for current archetype
    if (!Build.archetype || !Build.archetype.id) {
        const noArchMsg = document.createElement('p');
        noArchMsg.textContent = 'Select an archetype first';
        noArchMsg.style.opacity = '0.6';
        listContainer.appendChild(noArchMsg);
    } else {
        console.log(`Getting epic pools for archetype: ${Build.archetype.id}`);
        const epicPools = getEpicPoolsByArchetype(Build.archetype.id);
        console.log(`Found ${epicPools.length} epic pools`);
        
        if (epicPools.length === 0) {
            const noPoolMsg = document.createElement('p');
            noPoolMsg.textContent = 'No epic pools available for this archetype';
            noPoolMsg.style.opacity = '0.6';
            listContainer.appendChild(noPoolMsg);
        } else {
            epicPools.forEach(pool => {
                const poolOption = document.createElement('div');
                poolOption.className = 'epic-pool-option';
                
                const poolName = document.createElement('div');
                poolName.className = 'epic-pool-name';
                poolName.textContent = pool.name;
                
                const poolDesc = document.createElement('div');
                poolDesc.className = 'epic-pool-desc';
                poolDesc.style.fontSize = '10px';
                poolDesc.style.color = 'var(--text-secondary)';
                poolDesc.style.marginTop = '4px';
                poolDesc.textContent = pool.description || `${pool.powers.length} powers available`;
                
                poolOption.appendChild(poolName);
                poolOption.appendChild(poolDesc);
                
                // Check if already selected
                if (Build.epicPool.id === pool.id) {
                    poolOption.classList.add('selected');
                }
                
                poolOption.onclick = (e) => {
                    e.stopPropagation();
                    addEpicPool(pool.id);
                };
                
                listContainer.appendChild(poolOption);
            });
        }
    }
    
    modalContent.appendChild(listContainer);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.className = 'modal-btn';
    closeBtn.onclick = closeEpicPoolSelector;
    modalContent.appendChild(closeBtn);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Close epic pool selection modal
 */
function closeEpicPoolSelector() {
    const modal = document.getElementById('epicPoolModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Calculate total power count across all categories
 * @returns {number} Total powers selected
 */
function calculateTotalPowerCount() {
    let total = 0;
    
    // Primary powers
    if (Build.primary.powers) {
        total += Build.primary.powers.length;
    }
    
    // Secondary powers
    if (Build.secondary.powers) {
        total += Build.secondary.powers.length;
    }
    
    // Pool powers
    if (Build.pools && Array.isArray(Build.pools)) {
        for (const pool of Build.pools) {
            if (pool.powers) {
                total += pool.powers.length;
            }
        }
    }
    
    // Epic pool powers
    if (Build.epicPool && Build.epicPool.powers) {
        total += Build.epicPool.powers.length;
    }
    
    return total;
}

/**
 * Update character level based on power count using actual progression
 * Called whenever a power is added or removed
 */
function updateLevelFromPowerCount() {
    if (Build.progressionMode !== 'auto') {
        return; // Only in auto mode
    }
    
    const totalPowers = calculateTotalPowerCount();
    const newLevel = calculateLevelFromPowerCount(totalPowers);
    
    if (Build.level !== newLevel) {
        Build.level = newLevel;
        updateCharacterLevel();
        console.log(`Level updated to ${Build.level} (${totalPowers} powers selected)`);
    }
}