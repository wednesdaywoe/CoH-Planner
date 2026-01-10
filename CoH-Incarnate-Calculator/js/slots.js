/**
 * City of Heroes Planner - Enhancement Slots
 * 
 * Functions for rendering and managing enhancement slots
 */

/**
 * Update power slots display for a given power
 * @param {string} powerName - Name of the power
 */
function updatePowerSlots(powerName) {
    // Find the power in the build
    const power = findPowerInBuild(powerName);
    if (!power) {
        console.warn(`Power not found: ${powerName}`);
        return;
    }
    
    // Find the power element in DOM
    const powerElements = document.querySelectorAll('.selected-power');
    let powerElement = null;
    
    for (const elem of powerElements) {
        if (elem.dataset.powerName === powerName) {
            powerElement = elem;
            break;
        }
    }
    
    if (!powerElement) {
        console.warn(`Power element not found for: ${powerName}`);
        return;
    }
    
    // Get slots container
    const slotsContainer = powerElement.querySelector('.enhancement-slots');
    if (!slotsContainer) return;
    
    // Clear existing slots
    slotsContainer.innerHTML = '';
    
    // Render all slots
    power.slots.forEach((slot, index) => {
        const slotElement = createSlotElement(slot, index, power);
        slotsContainer.appendChild(slotElement);
    });
    
    // Add ghost slots if more can be added
    if (power.slots.length < power.maxSlots) {
        const ghostSlot = createGhostSlot(power.slots.length, power);
        slotsContainer.appendChild(ghostSlot);
    }
}

/**
 * Create a slot element
 * @param {Object|null} slot - Slot data or null if empty
 * @param {number} index - Slot index
 * @param {Object} power - Power object
 * @returns {HTMLElement} Slot element
 */
function createSlotElement(slot, index, power) {
    const slotElement = document.createElement('div');
    slotElement.className = 'slot';
    
    if (slot === null) {
        // Empty slot
        slotElement.classList.add('empty');
        slotElement.textContent = '+';
        slotElement.onclick = () => openEnhancementPicker(power.name, index);
    } else {
        // Filled slot
        slotElement.classList.add('filled');
        
        // Render enhancement icon
        const icon = renderEnhancementIcon(slot);
        slotElement.appendChild(icon);
        
        // Add tooltip
        slotElement.onmouseenter = (e) => showSlottedEnhancementTooltip(e, slot, power);
        slotElement.onmouseleave = () => {
            if (typeof hideTooltip === 'function') {
                hideTooltip();
            }
        };
        
        // Click to remove/replace
        slotElement.onclick = () => openEnhancementPicker(power.name, index);
    }
    
    return slotElement;
}

/**
 * Create a ghost slot (placeholder for adding more slots)
 * @param {number} index - Slot index
 * @param {Object} power - Power object
 * @returns {HTMLElement} Ghost slot element
 */
function createGhostSlot(index, power) {
    const ghostSlot = document.createElement('div');
    ghostSlot.className = 'slot ghost';
    ghostSlot.title = 'Add enhancement slot';
    ghostSlot.onclick = () => addSlotToPower(power.name);
    return ghostSlot;
}

/**
 * Render enhancement icon based on type
 * @param {Object} slot - Slot data
 * @returns {HTMLElement} Icon element
 */
function renderEnhancementIcon(slot) {
    const icon = document.createElement('img');
    icon.className = 'enhancement-icon';
    
    if (slot.type === 'io-set') {
        // IO Set piece
        const set = IO_SETS[slot.setId];
        icon.src = getSetIconPath(slot.setId) || 'img/Enhancements/Damage.png';
        icon.onerror = function() { this.onerror = null; this.src = 'img/Enhancements/Damage.png'; };
        icon.alt = set ? set.name : 'IO Set';
    } else if (slot.type === 'io-generic') {
        // Common IO
        icon.src = getAspectIconPath(slot.aspect) || 'img/Enhancements/Damage.png';
        icon.onerror = function() { this.onerror = null; this.src = 'img/Enhancements/Damage.png'; };
        icon.alt = `${slot.aspect} IO`;
    } else if (slot.type === 'origin') {
        // TO/DO/SO - use layered icon
        const layered = document.createElement('div');
        layered.className = 'enhancement-icon-layered';
        
        const base = document.createElement('img');
        base.className = 'enhancement-icon-base';
        base.src = getAspectIconPath(slot.aspect) || 'img/Enhancements/Damage.png';
        
        const overlay = document.createElement('img');
        overlay.className = 'enhancement-icon-overlay';
        overlay.src = getOriginOverlayPath(slot.tier) || '';
        
        layered.appendChild(base);
        layered.appendChild(overlay);
        return layered;
    } else if (slot.type === 'hamidon') {
        // Hamidon Origin
        icon.src = 'img/Enhancements/Hamidon.png';
        icon.onerror = function() { this.onerror = null; this.src = 'img/Enhancements/Damage.png'; };
        icon.alt = 'Hamidon Enhancement';
    }
    
    return icon;
}

/**
 * Show tooltip for a slotted enhancement
 * @param {Event} event - Mouse event
 * @param {Object} slot - Slot data
 * @param {Object} power - Power containing this slot
 */
function showSlottedEnhancementTooltip(event, slot, power) {
    if (!slot) return;
    
    if (slot.type === 'io-set') {
        // Show set tooltip with current piece count
        const set = IO_SETS[slot.setId];
        if (!set) return;
        
        // Count how many pieces of this set are slotted in this power
        const pieceCount = power.slots.filter(s => 
            s && s.type === 'io-set' && s.setId === slot.setId
        ).length;
        
        // Use unified tooltip system
        if (typeof showSetTooltip === 'function') {
            showSetTooltip(event, set, pieceCount);
        }
    } else if (slot.type === 'io-generic') {
        // Show Common IO tooltip
        showCommonIOTooltip(event, slot);
    } else if (slot.type === 'origin') {
        // Show TO/DO/SO tooltip
        showOriginEnhancementTooltip(event, slot);
    } else if (slot.type === 'hamidon') {
        // Show Hamidon tooltip
        showHamidonTooltip(event, slot);
    }
}

/**
 * Show tooltip for Common IO
 * @param {Event} event - Mouse event
 * @param {Object} slot - Slot data
 */
function showCommonIOTooltip(event, slot) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    const level = slot.level || 50;
    const value = (calculateCommonIOValue && calculateCommonIOValue(level, slot.aspect)) || 0;
    
    let html = `<div class="tooltip-title">Common IO - ${slot.aspect}</div>`;
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-label">Level: ${level}</div>`;
    html += `<div class="tooltip-value">+${(value * 100).toFixed(1)}%</div>`;
    html += `</div>`;
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + html;
    if (typeof positionTooltip === 'function') {
        positionTooltip(tooltip, event);
    }
    tooltip.classList.add('visible');
}

/**
 * Show tooltip for Origin enhancement (TO/DO/SO)
 * @param {Event} event - Mouse event
 * @param {Object} slot - Slot data
 */
function showOriginEnhancementTooltip(event, slot) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    const tierNames = ['Training Origin', 'Dual Origin', 'Single Origin'];
    const tierName = tierNames[slot.tier] || 'Unknown';
    
    let html = `<div class="tooltip-title">${tierName}</div>`;
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-label">${slot.aspectName || slot.aspect}</div>`;
    html += `<div class="tooltip-value">+${(slot.value * 100).toFixed(1)}%</div>`;
    html += `</div>`;
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + html;
    if (typeof positionTooltip === 'function') {
        positionTooltip(tooltip, event);
    }
    tooltip.classList.add('visible');
}

/**
 * Show tooltip for Hamidon enhancement
 * @param {Event} event - Mouse event
 * @param {Object} slot - Slot data
 */
function showHamidonTooltip(event, slot) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    let html = `<div class="tooltip-title">Hamidon Origin</div>`;
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-label">${slot.hamiType || 'Unknown'}</div>`;
    if (slot.aspects) {
        html += `<div class="tooltip-value">${slot.aspects.join(', ')}</div>`;
    }
    html += `</div>`;
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + html;
    if (typeof positionTooltip === 'function') {
        positionTooltip(tooltip, event);
    }
    tooltip.classList.add('visible');
}

/**
 * Find a power in the build by name
 * @param {string} powerName - Power name
 * @returns {Object|null} Power object or null
 */
function findPowerInBuild(powerName) {
    // Check primary
    if (Build.primary && Build.primary.powers) {
        const found = Build.primary.powers.find(p => p.name === powerName);
        if (found) return found;
    }
    
    // Check secondary
    if (Build.secondary && Build.secondary.powers) {
        const found = Build.secondary.powers.find(p => p.name === powerName);
        if (found) return found;
    }
    
    // Check pools
    if (Build.pools) {
        for (const pool of Build.pools) {
            const found = pool.powers.find(p => p.name === powerName);
            if (found) return found;
        }
    }
    
    return null;
}

/**
 * Open enhancement picker for a slot
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Slot index
 */
function openEnhancementPicker(powerName, slotIndex) {
    // This function should open your enhancement picker modal
    // For now, just log
    console.log(`Open picker for ${powerName}, slot ${slotIndex}`);
    
    // If you have an openPicker function, call it
    if (typeof openPicker === 'function') {
        openPicker(powerName, null, slotIndex);
    }
}

/**
 * Add a new slot to a power
 * @param {string} powerName - Power name
 */
function addSlotToPower(powerName) {
    const power = findPowerInBuild(powerName);
    if (!power) return;
    
    if (power.slots.length >= power.maxSlots) {
        console.log(`${powerName} already has maximum slots`);
        return;
    }
    
    // Add empty slot
    power.slots.push(null);
    
    // Update display
    updatePowerSlots(powerName);
    
    console.log(`Added slot to ${powerName} (${power.slots.length}/${power.maxSlots})`);
}

/**
 * Get set icon path
 * @param {string} setId - Set ID
 * @returns {string} Icon path
 */
function getSetIconPath(setId) {
    // Map set IDs to icon paths
    const iconMap = {
        'thunderstrike': 'img/Enhancements/Damage.png',
        'positrons': 'img/Enhancements/Damage.png',
        'crushing-impact': 'img/Enhancements/Damage.png',
        // Add more as needed
    };
    
    return iconMap[setId] || 'img/Enhancements/Damage.png';
}

/**
 * Get aspect icon path
 * @param {string} aspect - Aspect name
 * @returns {string} Icon path
 */
function getAspectIconPath(aspect) {
    const normalized = aspect.toLowerCase().replace(/ /g, '');
    const iconMap = {
        'damage': 'img/Enhancements/Damage.png',
        'accuracy': 'img/Enhancements/Accuracy.png',
        'recharge': 'img/Enhancements/Recharge.png',
        'endurance': 'img/Enhancements/Endurance.png',
        'defense': 'img/Enhancements/Defense.png',
        'resistance': 'img/Enhancements/Resistance.png',
        'healing': 'img/Enhancements/Healing.png',
        'range': 'img/Enhancements/Range.png'
    };
    
    return iconMap[normalized] || 'img/Enhancements/Damage.png';
}

/**
 * Get origin overlay path
 * @param {number} tier - Tier (0=TO, 1=DO, 2=SO)
 * @returns {string} Overlay path
 */
function getOriginOverlayPath(tier) {
    const overlayMap = {
        0: 'img/Overlays/TO.png',
        1: 'img/Overlays/DO.png',
        2: 'img/Overlays/SO.png'
    };
    
    return overlayMap[tier] || '';
}
