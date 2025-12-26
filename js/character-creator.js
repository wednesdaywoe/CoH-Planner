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
    
    // STAGE 3: After first secondary - Check level gating
    if (Build.levelGatedMode) {
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
    if (Build.levelGatedMode) {
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
    
    // Increment character level in level-gated mode
    if (Build.levelGatedMode) {
        // Find the minimum level needed to select this power
        const nextLevel = Math.max(Build.level, powerData.available);
        if (nextLevel > Build.level) {
            Build.level = nextLevel;
            updateCharacterLevel();
            console.log(`Character level increased to ${Build.level}`);
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
    header.textContent = `Primary: ${powersetName}`;
}

/**
 * Update secondary column header
 * @param {string} powersetName - Powerset name
 */
function updateSecondaryColumnHeader(powersetName) {
    const columns = document.querySelectorAll('.column');
    const secondaryColumn = columns[2];
    const header = secondaryColumn.querySelector('.column-header');
    header.textContent = `Secondary: ${powersetName}`;
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
 */
function showPowerTooltip(event, power) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    let html = `<div class="tooltip-title">${power.name}</div>`;
    
    // Power type
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-label">Type</div>`;
    html += `<div class="tooltip-value">${formatPowerType(power.type)}</div>`;
    html += `</div>`;
    
    // Description
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-desc">${power.description}</div>`;
    html += `</div>`;
    
    // Effects
    if (power.effects) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        
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
    
    // Get tooltip dimensions
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';
    
    const rect = tooltip.getBoundingClientRect();
    
    // Adjust if tooltip goes off right edge
    if (rect.right > window.innerWidth) {
        x = event.clientX - rect.width - offset;
    }
    
    // Adjust if tooltip goes off bottom edge
    if (rect.bottom > window.innerHeight) {
        y = event.clientY - rect.height - offset;
    }
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.visibility = 'visible';
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    initializeCharacterCreator();
});

// ============================================
// LEVEL GATING MODE TOGGLE
// ============================================

/**
 * Toggle between level-gated and freeform mode
 */
function toggleLevelGatedMode() {
    const checkbox = document.getElementById('levelGatedMode');
    Build.levelGatedMode = checkbox.checked;
    
    console.log(`Level-gated mode: ${Build.levelGatedMode ? 'ON' : 'OFF'}`);
    
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
