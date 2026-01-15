// Returns the number of enhancement slots remaining to assign (0 if full)
function getSlotsRemaining() {
    // Calculate total additional slots used (beyond the 1 default per power)
    let totalSlotCount = 0;
    let totalPowerCount = 0;
    if (Build.primary.powers) {
        Build.primary.powers.forEach(power => {
            totalSlotCount += power.slots ? power.slots.length : 0;
            totalPowerCount++;
        });
    }
    if (Build.secondary.powers) {
        Build.secondary.powers.forEach(power => {
            totalSlotCount += power.slots ? power.slots.length : 0;
            totalPowerCount++;
        });
    }
    if (Build.pools) {
        Build.pools.forEach(pool => {
            if (pool.powers) {
                pool.powers.forEach(power => {
                    totalSlotCount += power.slots ? power.slots.length : 0;
                    totalPowerCount++;
                });
            }
        });
    }
    if (Build.epicPool && Build.epicPool.powers) {
        Build.epicPool.powers.forEach(power => {
            totalSlotCount += power.slots ? power.slots.length : 0;
            totalPowerCount++;
        });
    }
    // NOTE: Inherent powers are NOT counted - they have their own slots
    // that don't affect the 67 additional slot budget
    const additionalSlotsUsed = totalSlotCount - totalPowerCount;
    const maxAdditionalSlots = 67;
    return Math.max(0, maxAdditionalSlots - Math.max(0, additionalSlotsUsed));
}
/**
 * City of Heroes Planner - UI Updates
 * 
 * Functions to update the DOM when build data changes
 */

// ============================================
// POWER DISPLAY
// ============================================

/**
 * Return the HTML block for tooltip interaction hints.
 * Kept in `ui.js` so other tooltip builders can reuse it.
 */
function getTooltipHintsHtml() {
    return `
        <div class="tooltip-hints">
            <div class="hints-grid">
                <div class="hints-left">
                    <div class="hint-row">
                        <div class="hint-key">Left Click</div>
                        <div class="hint-desc">Add or replace enhancement</div>
                    </div>
                    <div class="hint-row">
                        <div class="hint-key">Shift + Left Click</div>
                        <div class="hint-desc">Add next piece from set</div>
                    </div>
                </div>
                <div class="hints-right">
                    <div class="hint-row">
                        <div class="hint-key">Right Click</div>
                        <div class="hint-desc">Remove enhancement but keep slot</div>
                    </div>
                    <div class="hint-row">
                        <div class="hint-key">Shift + Right Click</div>
                        <div class="hint-desc">Remove slot entirely</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Update the display of a power's enhancement slots
 * @param {string} powerName - Power name
 */
function updatePowerSlots(powerName) {
    // First check if it's an inherent power
    let power = null;
    let isInherent = false;
    if (Build.inherents && Array.isArray(Build.inherents)) {
        power = Build.inherents.find(p => p.name === powerName);
        if (power) {
            isInherent = true;
        }
    }
    
    // If not inherent, check in standard powers
    if (!power) {
        const result = findPower(powerName);
        if (!result) {
            console.error(`Cannot update slots for power: ${powerName}`);
            return;
        }
        power = result.power;
    }
    
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
        return;
    }
    
    // Get slots container
    const slotsContainer = targetElement.querySelector('.enhancement-slots');
    if (!slotsContainer) {
        console.error(`Cannot find enhancement-slots for power: ${powerName}`);
        return;
    }
    
    // Clear existing slots
    slotsContainer.innerHTML = '';
    
    // If power has no slots or can't be slotted, don't show anything
    if (!power.slots || power.maxSlots === 0) {
        return;
    }
    
    // Add slots (filled or empty) - same logic for both inherent and regular powers
    power.slots.forEach((enhancement, index) => {
        const slot = enhancement 
            ? createFilledSlotElement(enhancement, powerName, index)
            : createEmptySlotElement(powerName, index);
        slotsContainer.appendChild(slot);
    });
    
    // Add ghost + button if not at max slots (check both per-power and global limits)
    const slotsRemaining = typeof getSlotsRemaining === 'function' ? getSlotsRemaining() : 67;
    if (power.slots.length < power.maxSlots && slotsRemaining > 0) {
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
    
    // Left click: Open picker to replace
    slot.onclick = (e) => {
        e.preventDefault();
        if (!e.shiftKey) {
            // Normal left click: Open picker to replace
            openPickerForFilledSlot(powerName, slotIndex, enhancement);
        }
        // Shift + Left click on filled slot: Do nothing
    };
    
    // Right click: Remove enhancement OR remove slot
    slot.oncontextmenu = (e) => {
        e.preventDefault();
        if (e.shiftKey) {
            // Shift + Right click: Remove all enhancements from this power
            const result = findPower(powerName);
            if (result) {
                // Clear all slots but keep the slots themselves
                result.power.slots.forEach((slotEnhancement, index) => {
                    if (slotEnhancement && slotEnhancement.type === 'io-set') {
                        untrackSetBonus(slotEnhancement.setId, slotEnhancement.pieceNum);
                    }
                    result.power.slots[index] = null;
                });
                updatePowerSlots(powerName);
                recalculateStats();
                if (typeof updateSlotCounter === 'function') {
                    updateSlotCounter();
                }
            }
        } else {
            // Normal right click: Remove enhancement but keep slot
            const result = findPower(powerName);
            if (result) {
                result.power.slots[slotIndex] = null;
                if (enhancement.type === 'io-set') {
                    untrackSetBonus(enhancement.setId, enhancement.pieceNum);
                }
                updatePowerSlots(powerName);
                recalculateStats();
                if (typeof updateSlotCounter === 'function') {
                    updateSlotCounter();
                }
            }
        }
    };
    
    // Hover tooltip
    slot.onmouseenter = (e) => showEnhancementTooltip(e, enhancement, powerName);
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
    
    // Left click: Open enhancement picker OR smart duplicate
    slot.onclick = (e) => {
        e.preventDefault();
        if (e.shiftKey) {
            // Shift + Left click: Smart duplicate (copy last enhancement or add next from set)
            smartAddEnhancement(powerName, slotIndex);
        } else {
            // Normal left click: Open picker
            AppState.currentSlotIndex = slotIndex;
            openPicker(powerName, powerSet);
        }
    };
    
    // Right click: Remove slot (normal) or remove all added slots (shift)
    slot.oncontextmenu = (e) => {
        e.preventDefault();
        if (e.shiftKey) {
            // Shift + Right click: Remove all added slots, keep default slot
            const result = findPower(powerName);
            if (result) {
                // Remove all slots except the first one (default slot)
                while (result.power.slots.length > 1) {
                    result.power.slots.pop();
                }
                updatePowerSlots(powerName);
                recalculateStats();
                if (typeof updateSlotCounter === 'function') {
                    updateSlotCounter();
                }
            }
        } else {
            // Normal right click: Remove this slot
            removeSlotFromPower(powerName, slotIndex);
            updatePowerSlots(powerName);
            recalculateStats();
            if (typeof updateSlotCounter === 'function') {
                updateSlotCounter();
            }
        }
    };
    
    return slot;
}

/**
 * Drag state for adding multiple slots
 */
const SlotDragState = {
    isDragging: false,
    hasMoved: false,
    startPowerName: null,
    numSlotsToAdd: 0,
    startX: 0,
    startY: 0,
    ghostSlotElement: null,
    slotsContainer: null,
    previewSlots: []
};

/**
 * Create add slot button (ghost +)
 * @param {string} powerName - Power name
 * @returns {HTMLElement} Button element
 */
function createAddSlotButton(powerName) {
    const button = document.createElement('div');
    button.className = 'slot empty ghost';
    button.textContent = '+';
    button.title = 'Add enhancement slot (or drag to add multiple)';
    button.dataset.powerName = powerName;
    
    // Attach drag handlers
    button.addEventListener('mousedown', handleSlotDragStart);
    
    return button;
}

/**
 * Handle start of slot drag
 */
function handleSlotDragStart(e) {
    // Only handle left mouse button
    if (e.button !== 0) return;
    
    // Only handle ghost slots
    if (!e.target.classList.contains('ghost')) return;
    
    e.preventDefault();
    
    const powerName = e.target.dataset.powerName;
    const result = findPower(powerName);
    if (!result) return;
    
    SlotDragState.isDragging = true;
    SlotDragState.hasMoved = false;
    SlotDragState.startPowerName = powerName;
    SlotDragState.numSlotsToAdd = 1;
    SlotDragState.startX = e.clientX;
    SlotDragState.startY = e.clientY;
    SlotDragState.ghostSlotElement = e.target;
    
    // Store reference to slots container for preview updates
    SlotDragState.slotsContainer = e.target.closest('.enhancement-slots');
    SlotDragState.previewSlots = [];
    
    // Add visual feedback
    e.target.classList.add('drag-active');
    
    // Attach document-level handlers
    document.addEventListener('mousemove', handleSlotDragMove);
    document.addEventListener('mouseup', handleSlotDragEnd);
    
    console.log('Slot drag started');
}

/**
 * Handle slot drag movement
 */
function handleSlotDragMove(e) {
    if (!SlotDragState.isDragging) return;
    
    const result = findPower(SlotDragState.startPowerName);
    if (!result) return;
    
    const power = result.power;
    
    // Calculate distance moved
    const deltaX = Math.abs(e.clientX - SlotDragState.startX);
    const deltaY = Math.abs(e.clientY - SlotDragState.startY);
    const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // If moved more than 5 pixels, it's a drag
    if (totalDistance > 5) {
        SlotDragState.hasMoved = true;
    }
    
    // Each ~35 pixels of movement adds another slot (roughly the height of a slot + gap)
    const additionalSlots = Math.floor(totalDistance / 35);

    // Calculate max slots that can be added (check both per-power and global limits)
    const globalSlotsRemaining = typeof getSlotsRemaining === 'function' ? getSlotsRemaining() : 67;
    const maxCanAdd = Math.min(
        power.maxSlots - power.slots.length,
        globalSlotsRemaining
    );
    SlotDragState.numSlotsToAdd = Math.min(1 + additionalSlots, maxCanAdd);
    
    // Visual feedback - update tooltip
    if (SlotDragState.ghostSlotElement) {
        SlotDragState.ghostSlotElement.title = `Add ${SlotDragState.numSlotsToAdd} slot${SlotDragState.numSlotsToAdd > 1 ? 's' : ''}`;
    }
    
    // Update preview slots
    updateSlotPreview(SlotDragState.numSlotsToAdd);
    
    console.log(`Dragging: distance=${totalDistance}, slots=${SlotDragState.numSlotsToAdd}`);
}

/**
 * Update the preview slots shown during drag
 */
function updateSlotPreview(numSlots) {
    if (!SlotDragState.slotsContainer) return;
    
    const result = findPower(SlotDragState.startPowerName);
    if (!result) return;
    
    const power = result.power;

    // Cap preview to actual max addable slots (check both per-power and global limits)
    const globalSlotsRemaining = typeof getSlotsRemaining === 'function' ? getSlotsRemaining() : 67;
    const maxCanAdd = Math.min(
        power.maxSlots - power.slots.length,
        globalSlotsRemaining
    );
    const slotsToPreview = Math.min(numSlots, maxCanAdd);
    
    // Remove old preview slots
    SlotDragState.previewSlots.forEach(slot => {
        if (slot.parentNode) {
            slot.parentNode.removeChild(slot);
        }
    });
    SlotDragState.previewSlots = [];
    
    // Create new preview slots
    // Insert before the ghost slot for better visual order
    const ghostSlot = SlotDragState.slotsContainer.querySelector('.ghost');
    for (let i = 0; i < slotsToPreview; i++) {
        const previewSlot = document.createElement('div');
        previewSlot.className = 'slot empty preview';
        if (ghostSlot) {
            // Insert before ghost slot
            SlotDragState.slotsContainer.insertBefore(previewSlot, ghostSlot);
        } else {
            // Fallback if no ghost slot found
            SlotDragState.slotsContainer.appendChild(previewSlot);
        }
        SlotDragState.previewSlots.push(previewSlot);
    }
    
    console.log(`Preview updated: showing ${slotsToPreview} preview slots (max can add: ${maxCanAdd})`);
}

/**
 * Handle end of slot drag
 */
function handleSlotDragEnd(e) {
    if (!SlotDragState.isDragging) return;
    
    e.preventDefault();
    
    // Remove visual feedback
    if (SlotDragState.ghostSlotElement) {
        SlotDragState.ghostSlotElement.classList.remove('drag-active');
    }
    
    // Clean up preview slots
    SlotDragState.previewSlots.forEach(slot => {
        if (slot.parentNode) {
            slot.parentNode.removeChild(slot);
        }
    });
    
    // If we dragged (moved and have slots to add), add them
    if (SlotDragState.hasMoved && SlotDragState.numSlotsToAdd > 0) {
        console.log(`Drag completed - adding ${SlotDragState.numSlotsToAdd} slot(s)`);
        addMultipleSlots(SlotDragState.startPowerName, SlotDragState.numSlotsToAdd);
    } else if (!SlotDragState.hasMoved) {
        // Just a click - add single slot
        console.log('Just a click - adding single slot');
        const result = findPower(SlotDragState.startPowerName);
        if (result) {
            if (addSlotToPower(SlotDragState.startPowerName)) {
                updatePowerSlots(SlotDragState.startPowerName);
            }
        }
    }
    
    // Remove document-level handlers
    document.removeEventListener('mousemove', handleSlotDragMove);
    document.removeEventListener('mouseup', handleSlotDragEnd);
    
    // Reset state
    SlotDragState.isDragging = false;
    SlotDragState.hasMoved = false;
    SlotDragState.startPowerName = null;
    SlotDragState.numSlotsToAdd = 0;
    SlotDragState.startX = 0;
    SlotDragState.startY = 0;
    SlotDragState.ghostSlotElement = null;
    SlotDragState.slotsContainer = null;
    SlotDragState.previewSlots = [];
    
    console.log('Slot drag ended');
}

/**
 * Add multiple slots to a power at once
 * @param {string} powerName - Power name
 * @param {number} numSlots - Number of slots to add
 */
function addMultipleSlots(powerName, numSlots) {
    const result = findPower(powerName);
    if (!result) return;
    
    const power = result.power;
    const maxCanAdd = power.maxSlots - power.slots.length;
    // Also check global slots remaining
    const slotsRemaining = typeof getSlotsRemaining === 'function' ? getSlotsRemaining() : 67;
    const slotsToAdd = Math.min(numSlots, maxCanAdd, slotsRemaining);

    if (slotsToAdd <= 0) {
        alert('No enhancement slots remaining to assign.');
        return;
    }

    // Add multiple empty slots
    for (let i = 0; i < slotsToAdd; i++) {
        power.slots.push(null);
    }

    // Update display
    updatePowerSlots(powerName);

    // Update slot counter
    if (typeof updateSlotCounter === 'function') {
        updateSlotCounter();
    }

    console.log(`Added ${slotsToAdd} slot(s) to ${powerName} (${power.slots.length}/${power.maxSlots})`);
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
        smartAddSetPiece(powerName, slotIndex, firstEnhancement.setId, power, firstEnhancement);
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
 * @param {Object} template - Source enhancement to copy attuned state from
 */
function smartAddSetPiece(powerName, slotIndex, setId, power, template) {
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
    
    // Create and add the enhancement (preserve attuned state from template)
    const enhancement = createEnhancement('io-set', {
        setId: setId,
        pieceNum: nextPiece.num,
        setName: set.name,
        pieceName: nextPiece.name,
        values: nextPiece.values,
        unique: nextPiece.unique || false,
        attuned: template.attuned || false
    });
    
    if (addEnhancementToPower(powerName, slotIndex, enhancement)) {
        updatePowerSlots(powerName);
        recalculateStats();
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
        recalculateStats();
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
        recalculateStats();
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
 * @param {string} powerName - Name of the power this enhancement is in
 */
function showEnhancementTooltip(event, enhancement, powerName) {
    const tooltip = document.getElementById('tooltip');
    let html = '';
    
    if (enhancement.type === 'io-set') {
        const set = IO_SETS[enhancement.setId];
        const piece = set.pieces.find(p => p.num === enhancement.pieceNum);
        
        html = `<div class="tooltip-title">${set.name}</div>`;
        html += `<div class="tooltip-section">`;
        html += `<div style="font-weight: 600; font-size: 12px; color: var(--accent);">${piece.name}</div>`;
        html += `</div>`;
        
        // Parse and show enhancement values
        if (piece.aspects) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div class="tooltip-label" style="margin-bottom: 6px;">Enhancement Values</div>`;
            
            // Get IO level
            const ioLevel = AppState.globalIOLevel || 50;
            const level = Math.min(ioLevel, set.maxLevel);
            
            // Multi-aspect modifier
            const aspectCount = piece.aspects.length;
            let modifier = 1.0;
            if (aspectCount === 2) {
                modifier = 0.70;
            } else if (aspectCount >= 3) {
                modifier = 0.50;
            }
            
            piece.aspects.forEach(aspect => {
                // Each aspect has its own schedule and gets modified by aspect count
                const normalized = normalizeAspectName(aspect);
                const schedule = normalized ? getAspectSchedule(normalized) : 'A';
                const baseValue = (typeof getIOValueAtLevel === 'function' ? getIOValueAtLevel(level, schedule) : 0.255);
                const enhValue = baseValue * modifier * 100;
                html += `<div style="font-size: 11px; padding: 2px 0;">`;
                html += `<span style="font-weight: 600;">${aspect}: +${enhValue.toFixed(1)}%</span>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        // Show set bonuses
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 6px;">Set Bonuses</div>`;
        
        // Count how many pieces from this set are slotted in this power
        let slottedPieceCount = 0;
        if (powerName) {
            const result = findPower(powerName);
            if (result && result.power.slots) {
                slottedPieceCount = result.power.slots.filter(slot => 
                    slot && slot.type === 'io-set' && slot.setId === enhancement.setId
                ).length;
            }
        }
        
        const bonusesByPieces = {};
        set.bonuses.forEach(bonus => {
            const pieces = bonus.pieces || 0;
            if (!bonusesByPieces[pieces]) bonusesByPieces[pieces] = [];
            bonusesByPieces[pieces].push(bonus);
        });
        
        Object.keys(bonusesByPieces).map(Number).sort((a,b)=>a-b).forEach(pieceCount => {
            const bonuses = bonusesByPieces[pieceCount];
            const isActive = slottedPieceCount >= pieceCount;
            const opacity = isActive ? '1.0' : '0.5';
            const fontWeight = isActive ? '700' : '400';
            const checkmark = isActive ? ' ✓' : '';
            
            html += `<div style="margin-bottom: 6px; opacity: ${opacity};">`;
            html += `<div style="font-weight: ${fontWeight}; font-size: 10px; margin-bottom: 2px;">${pieceCount} pieces${checkmark}:</div>`;
            bonuses.forEach(bonus => {
                if (bonus.effects && Array.isArray(bonus.effects)) {
                    bonus.effects.forEach(effect => {
                        html += `<div style="padding-left: 12px; font-size: 10px;">${effect.desc || effect.stat}</div>`;
                    });
                }
            });
            html += `</div>`;
        });
        
        html += `</div>`;
        
        html += `<div class="tooltip-section" style="margin-top: 8px; font-size: 11px; color: var(--text-tertiary);">`;
        html += `Left click: Replace • Right click: Remove • Shift+Right: Delete slot`;
        html += `</div>`;
    } else if (enhancement.type === 'io-generic') {
        const value = calculateCommonIOValue(enhancement.level);
        html = `
            <div class="tooltip-title">Common IO - ${enhancement.aspectName}</div>
            <div class="tooltip-section">
                <div class="tooltip-label">Level ${enhancement.level}</div>
                <div class="tooltip-value">+${value.toFixed(1)}%</div>
            </div>
            <div class="tooltip-section" style="margin-top: 8px; font-size: 11px; color: var(--text-tertiary);">
                Shift+Left on empty: Add copy
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
        
        // Remove existing click listeners and re-add to ensure it works
        const newButton = button.cloneNode(true);
        newButton.addEventListener('click', () => {
            if (Build.level < 4) {
                alert('Power Pools unlock at level 4');
                return;
            }
            openPoolPowerModal();
        });
        
        // Disable if at max
        if (poolCount >= 4) {
            newButton.disabled = true;
            newButton.style.opacity = '0.5';
            newButton.style.cursor = 'not-allowed';
            newButton.title = 'Maximum pools selected (4/4)';
        } else {
            newButton.disabled = false;
            newButton.style.opacity = '1';
            newButton.style.cursor = 'pointer';
            newButton.title = '';
        }
        
        button.replaceWith(newButton);
    }
}

/**
 * Update slot counter display in the resource badge
 */
function updateSlotCounter() {
    const badge = document.getElementById('slotCounter');
    if (!badge) return;

    // Calculate total additional slots used (beyond the 1 default per power)
    let totalSlotCount = 0;
    let totalPowerCount = 0;

    // Count slots in primary powers
    if (Build.primary.powers) {
        Build.primary.powers.forEach(power => {
            totalSlotCount += power.slots ? power.slots.length : 0;
            totalPowerCount++;
        });
    }

    // Count slots in secondary powers
    if (Build.secondary.powers) {
        Build.secondary.powers.forEach(power => {
            totalSlotCount += power.slots ? power.slots.length : 0;
            totalPowerCount++;
        });
    }

    // Count slots in pool powers
    if (Build.pools) {
        Build.pools.forEach(pool => {
            if (pool.powers) {
                pool.powers.forEach(power => {
                    totalSlotCount += power.slots ? power.slots.length : 0;
                    totalPowerCount++;
                });
            }
        });
    }

    // Count slots in epic pool
    if (Build.epicPool && Build.epicPool.powers) {
        Build.epicPool.powers.forEach(power => {
            totalSlotCount += power.slots ? power.slots.length : 0;
            totalPowerCount++;
        });
    }

    // NOTE: Inherent powers are NOT counted - they have their own slots
    // that don't affect the 67 additional slot budget

    // Each power comes with 1 default slot (doesn't count toward the 67)
    // So additional slots used = total slots - number of powers
    const additionalSlotsUsed = totalSlotCount - totalPowerCount;
    const maxAdditionalSlots = 67;
    const slotsRemaining = maxAdditionalSlots - Math.max(0, additionalSlotsUsed);
    badge.textContent = `${slotsRemaining}/${maxAdditionalSlots}`;

    // Also update power counter
    updatePowerCounter();
}

/**
 * Update the power counter (X/24 powers selected)
 */
function updatePowerCounter() {
    const powerBadge = document.getElementById('powerCounter');
    if (!powerBadge) return;
    
    const totalPowers = typeof getTotalPowerCount === 'function' ? getTotalPowerCount() : 0;
    const maxPowers = 24;
    powerBadge.textContent = `${totalPowers}/${maxPowers}`;
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
    const levelDisplay = power.level > 0 ? `(${power.level})` : '';
    powerElement.innerHTML = `
        <div class="selected-power-header">
            <span class="selected-power-name">${levelDisplay} ${power.name}</span>
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
    Build.inherents.forEach(power => {
        updatePowerSlots(power.name);
    });
    
    // Update pool counter
    updatePoolCounter();
}

// ============================================
// INHERENT POWERS
// ============================================

/**
 * Display inherent powers in the Pool Powers column
 */
function displayInherentPowers() {
    const container = document.querySelector('.column:nth-child(4) .column-content');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // ========================================
    // DISPLAY POOL POWERS FIRST (TOP)
    // ========================================
    
    // Add pool selector button to add new pools
    const addPoolBtn = document.createElement('button');
    addPoolBtn.className = 'add-pool-btn';
    addPoolBtn.id = 'addPoolBtn';
    addPoolBtn.textContent = '+ Add Power Pool';
    addPoolBtn.style.width = '100%';
    addPoolBtn.style.marginBottom = '8px';
    addPoolBtn.style.backgroundColor = 'rgba(90, 200, 250, 0.1)';
    addPoolBtn.style.borderColor = '#5ac8fa';
    addPoolBtn.style.color = '#5ac8fa';
    
    // Add click handler
    addPoolBtn.addEventListener('click', () => {
        if (Build.level < 4) {
            alert('Power Pools unlock at level 4');
            return;
        }
        openPoolPowerModal();
    });
    
    // Check if pools are unlocked and if max pools reached
    if (Build.level < 4) {
        addPoolBtn.disabled = true;
        addPoolBtn.title = 'Power Pools unlock at level 4';
        addPoolBtn.style.opacity = '0.5';
        addPoolBtn.style.cursor = 'not-allowed';
    } else if (Build.pools.length >= 4) {
        addPoolBtn.disabled = true;
        addPoolBtn.title = 'Maximum 4 power pools allowed';
        addPoolBtn.style.opacity = '0.5';
        addPoolBtn.style.cursor = 'not-allowed';
    }
    
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
        poolData.powers.forEach(power => {
            const powerElement = document.createElement('div');
            powerElement.className = 'selected-power';
            powerElement.dataset.powerName = power.name;
            
            // Check if this power needs a toggle checkbox
            // Toggle powers always get a switch
            // Click powers with buffDuration get a switch (they have lasting effects worth toggling for planning)
            const needsToggle = power.powerType === 'Toggle' ||
                (power.powerType === 'Click' && power.effects?.buffDuration);

            const levelDisplay = power.level > 0 ? `(${power.level})` : '';
            powerElement.innerHTML = `
                <div class="selected-power-header">
                    <span class="selected-power-name">${levelDisplay} ${power.name}</span>
                    <button class="remove-pool-power-btn" title="Remove from build">✕</button>
                </div>
                <div class="enhancement-slots"></div>
                ${needsToggle ? `
                    <label class="switch power-toggle-switch">
                        <input type="checkbox" class="power-toggle-input">
                        <span class="slider round"></span>
                    </label>
                ` : ''}
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
            
            // Add remove button handler
            const removeBtn = powerElement.querySelector('.remove-pool-power-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removePoolPowerFromBuild(power.name, poolData.id);
            });
            
            // Add tooltip
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
        
        // Add thin + button below last power in pool group
        const addPoolPowerBtn = document.createElement('button');
        addPoolPowerBtn.className = 'add-specific-pool-btn';
        addPoolPowerBtn.textContent = '+';
        addPoolPowerBtn.style.width = '100%';
        addPoolPowerBtn.style.padding = '4px';
        addPoolPowerBtn.style.marginTop = '4px';
        addPoolPowerBtn.style.backgroundColor = 'var(--button-bg)';
        addPoolPowerBtn.style.color = 'var(--text)';
        addPoolPowerBtn.style.border = '1px solid var(--border)';
        addPoolPowerBtn.style.cursor = 'pointer';
        addPoolPowerBtn.style.fontSize = '12px';
        addPoolPowerBtn.style.fontWeight = 'bold';
        addPoolPowerBtn.style.borderRadius = '3px';
        addPoolPowerBtn.title = `Add power from ${pool.name}`;
        
        addPoolPowerBtn.addEventListener('click', () => {
            if (Build.level < 4) {
                alert('Power Pools unlock at level 4');
                return;
            }
            openPoolPowerModalForSpecificPool(poolData.id);
        });
        
        poolGroup.appendChild(addPoolPowerBtn);
        
        container.appendChild(poolGroup);
        
        // Initialize slots after the group is in the DOM
        poolData.powers.forEach(power => {
            updatePowerSlots(power.name);
        });
    });
    
    // ========================================
    // DISPLAY EPIC POOL POWERS (AFTER POOLS)
    // ========================================
    
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
                
                // Check if this power needs a toggle checkbox
                // Toggle powers always get a switch
                // Click powers with buffDuration get a switch (they have lasting effects worth toggling for planning)
                const needsToggle = power.powerType === 'Toggle' ||
                    (power.powerType === 'Click' && power.effects?.buffDuration);

                const levelDisplay = power.level > 0 ? `(${power.level})` : '';
                powerElement.innerHTML = `
                    <div class="selected-power-header">
                        <span class="selected-power-name">${levelDisplay} ${power.name}</span>
                        <button class="epic-power-remove-btn" title="Remove from build">×</button>
                    </div>
                    <div class="enhancement-slots"></div>
                    ${needsToggle ? `
                        <label class="switch power-toggle-switch">
                            <input type="checkbox" class="power-toggle-input">
                            <span class="slider round"></span>
                        </label>
                    ` : ''}
                `;
                
                // Add remove button handler
                const removeBtn = powerElement.querySelector('.epic-power-remove-btn');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (typeof removeEpicPoolPowerFromBuild === 'function') {
                        removeEpicPoolPowerFromBuild(power.name);
                        // Refresh the UI
                        if (typeof displayInherentPowers === 'function') {
                            displayInherentPowers();
                        }
                    }
                });
                
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
            
            // Add thin + button below epic pool powers
            const addEpicPowerBtn = document.createElement('button');
            addEpicPowerBtn.className = 'add-epic-pool-btn';
            addEpicPowerBtn.textContent = '+';
            addEpicPowerBtn.style.width = '100%';
            addEpicPowerBtn.style.padding = '4px';
            addEpicPowerBtn.style.marginTop = '4px';
            addEpicPowerBtn.style.backgroundColor = 'var(--button-bg)';
            addEpicPowerBtn.style.color = 'var(--text)';
            addEpicPowerBtn.style.border = '1px solid var(--border)';
            addEpicPowerBtn.style.cursor = 'pointer';
            addEpicPowerBtn.style.fontSize = '12px';
            addEpicPowerBtn.style.fontWeight = 'bold';
            addEpicPowerBtn.style.borderRadius = '3px';
            addEpicPowerBtn.title = 'Add power from epic pool';
            
            addEpicPowerBtn.addEventListener('click', () => {
                if (Build.level < 35) {
                    alert('Epic Pools unlock at level 35');
                    return;
                }
                openEpicPoolPowerModal();
            });
            
            epicPoolGroup.appendChild(addEpicPowerBtn);
            
            container.appendChild(epicPoolGroup);
            
            // Initialize slots for epic powers
            Build.epicPool.powers.forEach(power => {
                updatePowerSlots(power.name);
            });
        }
    } else if (Build.level >= 4) {
        // Show "Add Epic Pool" button only when no epic pool selected
        const addEpicPoolBtn = document.createElement('button');
        addEpicPoolBtn.className = 'add-pool-btn';
        addEpicPoolBtn.id = 'addEpicPoolBtn';
        addEpicPoolBtn.textContent = '+ Add Epic Pool';
        addEpicPoolBtn.style.marginTop = '8px';
        addEpicPoolBtn.style.width = '100%';
        addEpicPoolBtn.style.backgroundColor = 'rgba(90, 200, 250, 0.1)';
        addEpicPoolBtn.style.borderColor = '#5ac8fa';
        addEpicPoolBtn.style.color = '#5ac8fa';
        
        // Add click handler
        addEpicPoolBtn.addEventListener('click', () => {
            if (Build.level < 35) {
                alert('Epic Pools unlock at level 35');
                return;
            }
            openEpicPoolSelector();
        });
        
        // Check if epic pools are unlocked
        if (Build.level < 35) {
            addEpicPoolBtn.disabled = true;
            addEpicPoolBtn.title = 'Epic Pools unlock at level 35';
            addEpicPoolBtn.style.opacity = '0.5';
            addEpicPoolBtn.style.cursor = 'not-allowed';
        }
        
        container.appendChild(addEpicPoolBtn);
    }
    
    // ========================================
    // DISPLAY INHERENT POWERS (BELOW POOLS)
    // ========================================
    
    // Organize inherents by category
    const fitnessPowers = Build.inherents.filter(p => p.category === 'fitness');
    const archetypePowers = Build.inherents.filter(p => p.category === 'archetype-specific');
    const universalPowers = Build.inherents.filter(p => p.category === 'universal');

    // Collect granted powers (available: -1) from primary and secondary powersets
    const grantedPowers = [];
    if (Build.primary && Build.primary.powerset && Build.primary.powerset.powers) {
        Build.primary.powerset.powers.forEach(power => {
            if (power.available === -1) {
                // Add category to match inherent power structure
                const grantedPower = {...power, category: 'granted'};
                grantedPowers.push(grantedPower);
            }
        });
    }
    if (Build.secondary && Build.secondary.powerset && Build.secondary.powerset.powers) {
        Build.secondary.powerset.powers.forEach(power => {
            if (power.available === -1) {
                // Add category to match inherent power structure
                const grantedPower = {...power, category: 'granted'};
                grantedPowers.push(grantedPower);
            }
        });
    }
    
    // Merge granted powers with archetype powers for the "Inherent Powers" section
    const allInherentPowers = [...archetypePowers, ...grantedPowers];

    console.log('Fitness powers:', fitnessPowers.map(p => p.name));
    console.log('Archetype powers:', archetypePowers.map(p => p.name));
    console.log('Granted powers:', grantedPowers.map(p => p.name));
    console.log('Universal powers:', universalPowers.map(p => p.name));
    console.log('Fitness first power object:', fitnessPowers[0]);
    console.log('Archetype first power object:', archetypePowers[0]);
    
    // Helper function to create a power section
    const createPowerSection = (title, powers) => {
        if (powers.length === 0) {
            return null;
        }
        
        const section = document.createElement('div');
        section.className = 'inherent-powers-section';
        section.style.marginTop = '20px';
        section.style.marginBottom = '20px';
        
        // Section header
        const header = document.createElement('div');
        header.style.fontWeight = '600';
        header.style.fontSize = '11px';
        header.style.color = 'var(--accent)';
        header.style.textTransform = 'uppercase';
        header.style.letterSpacing = '0.05em';
        header.style.marginBottom = '8px';
        header.textContent = title;
        section.appendChild(header);
        
        // Add each power
        powers.forEach(power => {
            const powerElement = document.createElement('div');
            powerElement.className = 'selected-power inherent-power';
            powerElement.dataset.powerName = power.name;
            
            // Check if this power needs a toggle checkbox
            // Toggle powers always get a switch
            // Click powers with buffDuration get a switch (they have lasting effects worth toggling for planning)
            const needsToggle = power.powerType === 'Toggle' ||
                (power.powerType === 'Click' && power.effects?.buffDuration);

            powerElement.innerHTML = `
                <div class="selected-power-header">
                    <span class="selected-power-name">${power.name}</span>
                </div>
                <div class="enhancement-slots"></div>
                ${needsToggle ? `
                    <label class="switch power-toggle-switch">
                        <input type="checkbox" class="power-toggle-input">
                        <span class="slider round"></span>
                    </label>
                ` : ''}
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
            
            // Add tooltip - use available power tooltip like columns 1, 2, 3
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
            
            section.appendChild(powerElement);
        });
        
        return section;
    };
    
    // Display fitness section first
    const fitnessSection = createPowerSection('Inherent Fitness', fitnessPowers);
    let allSections = null;
    if (fitnessSection) {
        // Create a wrapper for all inherent sections
        if (!allSections) {
            allSections = document.createElement('div');
            allSections.id = 'all-inherent-sections';
        }
        allSections.appendChild(fitnessSection);
    }
    
    // Display archetype section (renamed to Inherent Powers to include granted powers)
    const archetypeSection = createPowerSection('Inherent Powers', allInherentPowers);
    if (archetypeSection) {
        if (!allSections) {
            allSections = document.createElement('div');
            allSections.id = 'all-inherent-sections';
        }
        allSections.appendChild(archetypeSection);
    }
    
    // Display universal section
    const universalSection = createPowerSection('Inherent', universalPowers);
    if (universalSection) {
        if (!allSections) {
            allSections = document.createElement('div');
            allSections.id = 'all-inherent-sections';
        }
        allSections.appendChild(universalSection);
    }
    
    // Append all sections as one block
    if (allSections) {
        container.appendChild(allSections);
    }
    
    // NOW initialize slots AFTER all DOM elements are added
    const allInherents = [...fitnessPowers, ...allInherentPowers, ...universalPowers];
    allInherents.forEach(power => {
        if (power.maxSlots > 0) {
            updatePowerSlots(power.name);
        }
    });
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
