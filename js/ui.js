/**
 * City of Heroes Planner - UI Updates
 * 
 * Functions to update the DOM when build data changes
 */

// ============================================
// POWER DISPLAY
// ============================================

/**
 * Update the display of a power's enhancement slots
 * @param {string} powerName - Power name
 */
function updatePowerSlots(powerName) {
    const result = findPower(powerName);
    if (!result) {
        console.error(`Cannot update slots for power: ${powerName}`);
        return;
    }
    
    const { power } = result;
    
    // Find the DOM element for this power; prefer data-power-name attribute
    const powerElements = document.querySelectorAll('.selected-power');
    let targetElement = null;

    for (const elem of powerElements) {
        if (elem.dataset && elem.dataset.powerName === powerName) {
            targetElement = elem;
            break;
        }
        const nameElem = elem.querySelector('.selected-power-name');
        if (nameElem && nameElem.textContent === powerName) {
            targetElement = elem;
            break;
        }
    }
    
    if (!targetElement) {
        console.error(`Cannot find DOM element for power: ${powerName}`);
        console.log('Available .selected-power elements:', document.querySelectorAll('.selected-power'));
        return;
    }
    
    // Get slots container
    const slotsContainer = targetElement.querySelector('.enhancement-slots');
    console.log(`updatePowerSlots: ${powerName} -> slots array length: ${power.slots.length}`, { power, targetElement, slotsContainer });
    if (!slotsContainer) return;
    
    // Clear existing slots
    slotsContainer.innerHTML = '';
    
    // Add slots (filled or empty)
    power.slots.forEach((enhancement, index) => {
        const slot = enhancement 
            ? createFilledSlotElement(enhancement, powerName, index)
            : createEmptySlotElement(powerName, index);
        slotsContainer.appendChild(slot);
    });
    
    // Add ghost + button if not at max slots
    if (power.slots.length < power.maxSlots) {
        const addButton = createAddSlotButton(powerName);
        slotsContainer.appendChild(addButton);
    }
}

/**
 * Create a filled slot element
 * @param {Object} enhancement - Enhancement data
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Slot index
 * @returns {HTMLElement} Slot element
 */
function createFilledSlotElement(enhancement, powerName, slotIndex) {
    const slot = document.createElement('div');
    slot.className = 'slot filled';
    
    // Add icon
    const icon = createEnhancementIconElement(enhancement);
    if (icon) {
        slot.appendChild(icon);
    } else {
        // Fallback to text with colored border if icon not found
        slot.classList.remove('filled');
        if (enhancement.type === 'io-set' || enhancement.type === 'io-generic') {
            slot.classList.add('io');
            slot.textContent = 'IO';
        } else if (enhancement.type === 'origin') {
            slot.classList.add('so');
            slot.textContent = enhancement.tier === 2 ? 'SO' : enhancement.tier === 1 ? 'DO' : 'TO';
        } else if (enhancement.type === 'hamidon') {
            slot.classList.add('io');
            slot.style.borderColor = '#10B981';
            slot.textContent = 'HO';
        }
    }
    
    // Left click: Open picker with clear option
    slot.onclick = (e) => {
        e.preventDefault();
        if (e.shiftKey) {
            // Shift + Left click: Remove slot
            removeSlotFromPower(powerName, slotIndex);
            updatePowerSlots(powerName);
            updateStatsDisplay();
        } else {
            // Normal left click: Open picker with clear option
            openPickerForFilledSlot(powerName, slotIndex, enhancement);
        }
    };
    
    // Right click: Open picker for same category/set
    slot.oncontextmenu = (e) => {
        e.preventDefault();
        openPickerSameCategory(powerName, slotIndex, enhancement);
    };
    
    // Hover tooltip
    slot.onmouseenter = (e) => showEnhancementTooltip(e, enhancement);
    slot.onmouseleave = hideTooltip;
    
    return slot;
}

/**
 * Create an empty slot element
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Slot index
 * @returns {HTMLElement} Slot element
 */
function createEmptySlotElement(powerName, slotIndex) {
    const slot = document.createElement('div');
    slot.className = 'slot empty';
    // No text - just an empty socket
    
    // Find the power's set to pass to openPicker
    const result = findPower(powerName);
    const powerSet = result ? result.power.powerSet : '';
    
    // Left click: Open enhancement picker
    slot.onclick = (e) => {
        e.preventDefault();
        if (e.shiftKey) {
            // Shift + Left click: Remove slot
            removeSlotFromPower(powerName, slotIndex);
            updatePowerSlots(powerName);
            updateStatsDisplay();
        } else {
            // Normal left click: Open picker
            AppState.currentSlotIndex = slotIndex;
            openPicker(powerName, powerSet);
        }
    };
    
    // Right click: Smart-add next enhancement
    slot.oncontextmenu = (e) => {
        e.preventDefault();
        smartAddEnhancement(powerName, slotIndex);
    };
    
    return slot;
}

/**
 * Create add slot button (ghost +)
 * @param {string} powerName - Power name
 * @returns {HTMLElement} Button element
 */
function createAddSlotButton(powerName) {
    const button = document.createElement('div');
    button.className = 'slot empty ghost';
    button.textContent = '+';
    button.title = 'Add enhancement slot';
    
    button.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (addSlotToPower(powerName)) {
            updatePowerSlots(powerName);
        }
    };
    
    return button;
}

// ============================================
// SMART ENHANCEMENT FUNCTIONS
// ============================================

/**
 * Smart-add next enhancement based on existing enhancements
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Target slot index
 */
function smartAddEnhancement(powerName, slotIndex) {
    const result = findPower(powerName);
    if (!result) return;
    
    const { power } = result;
    
    // Find first enhancement in this power
    const firstEnhancement = power.slots.find(e => e !== null);
    
    if (!firstEnhancement) {
        console.log('No enhancement to copy - please add one first');
        return;
    }
    
    if (firstEnhancement.type === 'io-set') {
        // Find next piece from the set that isn't slotted yet
        smartAddSetPiece(powerName, slotIndex, firstEnhancement.setId, power);
    } else {
        // Clone the enhancement (Common IO, Hamidon, or Origin)
        cloneEnhancement(powerName, slotIndex, firstEnhancement);
    }
}

/**
 * Smart-add next piece from an IO set
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Target slot index
 * @param {string} setId - Set ID
 * @param {Object} power - Power object
 */
function smartAddSetPiece(powerName, slotIndex, setId, power) {
    const set = IO_SETS[setId];
    if (!set) return;
    
    // Get piece numbers already slotted in this power
    const slottedPieces = new Set();
    power.slots.forEach(slot => {
        if (slot && slot.type === 'io-set' && slot.setId === setId) {
            slottedPieces.add(slot.pieceNum);
        }
    });
    
    // Find next available piece
    const nextPiece = set.pieces.find(p => !slottedPieces.has(p.num));
    
    if (!nextPiece) {
        console.log('All pieces from this set are already slotted');
        return;
    }
    
    // Create and add the enhancement
    const enhancement = createEnhancement('io-set', {
        setId: setId,
        pieceNum: nextPiece.num,
        setName: set.name,
        pieceName: nextPiece.name,
        values: nextPiece.values,
        unique: nextPiece.unique || false
    });
    
    if (addEnhancementToPower(powerName, slotIndex, enhancement)) {
        updatePowerSlots(powerName);
        updateStatsDisplay();
        console.log(`Smart-added: ${set.name} - ${nextPiece.name}`);
    }
}

/**
 * Clone an enhancement (for Common IO, Hamidon, Origin)
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Target slot index
 * @param {Object} template - Enhancement to clone
 */
function cloneEnhancement(powerName, slotIndex, template) {
    let enhancement;
    
    if (template.type === 'io-generic') {
        enhancement = createEnhancement('io-generic', {
            aspect: template.aspect,
            aspectName: template.aspectName,
            level: template.level,
            value: template.value
        });
    } else if (template.type === 'hamidon') {
        enhancement = createEnhancement('hamidon', {
            hamiType: template.hamiType,
            name: template.name,
            aspects: template.aspects,
            value: template.value
        });
    } else if (template.type === 'origin') {
        enhancement = createEnhancement('origin', {
            tier: template.tier,
            tierName: template.tierName,
            aspect: template.aspect,
            aspectName: template.aspectName,
            value: template.value
        });
    }
    
    if (enhancement && addEnhancementToPower(powerName, slotIndex, enhancement)) {
        updatePowerSlots(powerName);
        updateStatsDisplay();
        console.log(`Cloned: ${template.type} enhancement`);
    }
}

/**
 * Open picker for a filled slot (clears and opens picker)
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Slot index
 * @param {Object} currentEnhancement - Current enhancement
 */
function openPickerForFilledSlot(powerName, slotIndex, currentEnhancement) {
    // Clear the enhancement
    const result = findPower(powerName);
    if (result) {
        result.power.slots[slotIndex] = null;
        if (currentEnhancement.type === 'io-set') {
            untrackSetBonus(currentEnhancement.setId, currentEnhancement.pieceNum);
        }
        updatePowerSlots(powerName);
        updateStatsDisplay();
    }
    
    // Open picker to replace
    AppState.currentSlotIndex = slotIndex;
    const powerSet = result ? result.power.powerSet : '';
    openPicker(powerName, powerSet);
}

/**
 * Open picker for same category/set
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Slot index
 * @param {Object} enhancement - Current enhancement
 */
function openPickerSameCategory(powerName, slotIndex, enhancement) {
    AppState.currentSlotIndex = slotIndex;
    const result = findPower(powerName);
    const powerSet = result ? result.power.powerSet : '';
    
    // Open picker and auto-select the category
    openPicker(powerName, powerSet);
    
    // Auto-navigate to the same category
    setTimeout(() => {
        if (enhancement.type === 'io-set') {
            const set = IO_SETS[enhancement.setId];
            selectCategory(set.category);
        } else if (enhancement.type === 'io-generic') {
            selectCategory('io-generic');
        } else if (enhancement.type === 'hamidon') {
            selectCategory('special');
        } else if (enhancement.type === 'origin') {
            selectCategory('to-do-so');
        }
    }, 50);
}

/**
 * Show tooltip for slotted enhancement
 * @param {Event} event - Mouse event
 * @param {Object} enhancement - Enhancement data
 */
function showEnhancementTooltip(event, enhancement) {
    const tooltip = document.getElementById('tooltip');
    let html = '';
    
    if (enhancement.type === 'io-set') {
        const set = IO_SETS[enhancement.setId];
        const piece = set.pieces.find(p => p.num === enhancement.pieceNum);
        html = `
            <div class="tooltip-title">${set.name} - ${piece.name}</div>
            <div class="tooltip-section">
                <div class="tooltip-label">Enhancement Values</div>
                <div class="tooltip-value">${piece.values}</div>
            </div>
            <div class="tooltip-section" style="margin-top: 8px; font-size: 11px; color: var(--text-tertiary);">
                Left click: Replace/Clear<br>
                Right click: Change piece<br>
                Shift+Click: Remove slot
            </div>
        `;
    } else if (enhancement.type === 'io-generic') {
        const value = calculateCommonIOValue(enhancement.level);
        html = `
            <div class="tooltip-title">Common IO - ${enhancement.aspectName}</div>
            <div class="tooltip-section">
                <div class="tooltip-label">Level ${enhancement.level}</div>
                <div class="tooltip-value">+${value.toFixed(1)}%</div>
            </div>
            <div class="tooltip-section" style="margin-top: 8px; font-size: 11px; color: var(--text-tertiary);">
                Right click empty slot: Add copy
            </div>
        `;
    } else if (enhancement.type === 'hamidon') {
        const hami = HAMIDON_ENHANCEMENTS[enhancement.hamiType];
        html = `
            <div class="tooltip-title">${hami.name}</div>
            <div class="tooltip-section">
                <div class="tooltip-value">+${hami.value}% ${hami.aspects[0]}</div>
                <div class="tooltip-value">+${hami.value}% ${hami.aspects[1]}</div>
            </div>
        `;
    } else if (enhancement.type === 'origin') {
        html = `
            <div class="tooltip-title">${enhancement.tierName} - ${enhancement.aspectName}</div>
            <div class="tooltip-section">
                <div class="tooltip-value">+${enhancement.value}%</div>
            </div>
        `;
    }
    
    tooltip.innerHTML = html;
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// STATS DISPLAY
// ============================================

/**
 * Update the stats dashboard with calculated values
 */
function updateStatsDisplay() {
    // TODO: Calculate actual stats from slotted enhancements
    // For now, just log that we should update
    console.log('Stats display should update here');
    
    // Get active set bonuses
    const activeBonuses = getActiveSetBonuses();
    console.log('Active set bonuses:', activeBonuses);
}

// ============================================
// POOL POWER DISPLAY
// ============================================

/**
 * Update pool power counter in UI
 */
function updatePoolCounter() {
    const button = document.querySelector('.add-pool-btn');
    if (button) {
        const poolCount = Build.pools.length;
        button.textContent = `+ Add Power Pool (${poolCount}/4 pools used)`;
        
        // Disable if at max
        if (poolCount >= 4) {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }
}

/**
 * Add a pool power to the DOM
 * @param {Object} power - Power object
 */
function addPoolPowerToDOM(power) {
    const poolColumn = document.querySelectorAll('.column')[3]; // 4th column
    const columnContent = poolColumn.querySelector('.column-content');
    
    // Find the inherent section
    const inherentSection = columnContent.querySelector('[style*="margin-top: auto"]');
    
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

    // Tooltip hookup if original power data is available
    const originalPower = getOriginalPowerData ? getOriginalPowerData(power.name, 'pool', power.poolId) : null;
    if (originalPower) {
        powerElement.onmouseenter = (e) => showPowerTooltip(e, originalPower, true);
        powerElement.onmouseleave = () => hideTooltip();
    }
    
    // Insert before inherent section
    if (inherentSection) {
        columnContent.insertBefore(powerElement, inherentSection);
    } else {
        columnContent.appendChild(powerElement);
    }
    
    // Update slots display
    updatePowerSlots(power.name);
}

/**
 * Refresh all power displays
 */
function refreshAllPowers() {
    // Update primary powers
    Build.primary.powers.forEach(power => {
        updatePowerSlots(power.name);
    });
    
    // Update secondary powers
    Build.secondary.powers.forEach(power => {
        updatePowerSlots(power.name);
    });
    
    // Update pool powers (iterate each pool)
    Build.pools.forEach(pool => {
        pool.powers.forEach(power => updatePowerSlots(power.name));
    });
    
    // Update inherent powers
    Build.inherent.powers.forEach(power => {
        updatePowerSlots(power.name);
    });
    
    // Update pool counter
    updatePoolCounter();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize UI on page load
 */
function initializeUI() {
    console.log('Initializing UI...');
    
    // Demo build disabled - use character creator instead
    // initializeDemoBuild();
    // refreshAllPowers();
    
    console.log('UI initialized');
}

// Add to DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(initializeUI, 100);
});
