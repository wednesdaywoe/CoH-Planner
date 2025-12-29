/**
 * City of Heroes Planner - Drag Selection for IO Sets
 * 
 * Allows click-drag selection and shift-click for bulk slotting
 */

// Drag selection state
const DragSelectionState = {
    isDragging: false,
    hasMoved: false, // Track if mouse actually moved
    startPiece: null,
    currentSetId: null,
    selectedPieces: new Set()
};

/**
 * Initialize drag selection handlers on set piece grids
 */
function initDragSelection() {
    const grids = document.querySelectorAll('.set-pieces-grid');
    
    grids.forEach(grid => {
        grid.addEventListener('mousedown', handleDragStart);
        grid.addEventListener('mousemove', handleDragMove);
        grid.addEventListener('mouseup', handleDragEnd);
        grid.addEventListener('mouseleave', handleDragEnd);
    });
}

/**
 * Handle start of drag selection
 */
function handleDragStart(e) {
    // Only handle left mouse button
    if (e.button !== 0) return;
    
    const piece = e.target.closest('.set-piece-icon');
    if (!piece) return;
    
    e.preventDefault();
    
    DragSelectionState.isDragging = true;
    DragSelectionState.hasMoved = false; // Reset movement tracking
    DragSelectionState.currentSetId = piece.dataset.setId;
    DragSelectionState.startPiece = parseInt(piece.dataset.pieceNum);
    DragSelectionState.selectedPieces.clear();
    DragSelectionState.selectedPieces.add(DragSelectionState.startPiece);
    
    updateSelectionVisuals();
}

/**
 * Handle drag movement
 */
function handleDragMove(e) {
    if (!DragSelectionState.isDragging) return;
    
    const piece = e.target.closest('.set-piece-icon');
    if (!piece) return;
    
    const setId = piece.dataset.setId;
    const pieceNum = parseInt(piece.dataset.pieceNum);
    
    // Only select pieces from the same set
    if (setId !== DragSelectionState.currentSetId) return;
    
    // Mark that we've moved (this is a drag, not a click)
    if (pieceNum !== DragSelectionState.startPiece) {
        DragSelectionState.hasMoved = true;
    }
    
    // Select range from start to current
    const start = DragSelectionState.startPiece;
    const end = pieceNum;
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    
    DragSelectionState.selectedPieces.clear();
    for (let i = min; i <= max; i++) {
        DragSelectionState.selectedPieces.add(i);
    }
    
    updateSelectionVisuals();
}

/**
 * Handle end of drag selection
 */
function handleDragEnd(e) {
    if (!DragSelectionState.isDragging) return;
    
    e.preventDefault();
    
    // If we actually dragged (moved to different pieces), slot the selection
    if (DragSelectionState.hasMoved && DragSelectionState.selectedPieces.size > 0) {
        console.log('Drag completed - slotting selected pieces');
        slotMultiplePieces(
            DragSelectionState.currentSetId,
            Array.from(DragSelectionState.selectedPieces).sort((a, b) => a - b)
        );
    }
    // If we didn't move (just clicked), the click handler will deal with it
    
    // Reset state
    DragSelectionState.isDragging = false;
    DragSelectionState.hasMoved = false;
    DragSelectionState.startPiece = null;
    DragSelectionState.currentSetId = null;
    DragSelectionState.selectedPieces.clear();
    
    updateSelectionVisuals();
}

/**
 * Update visual highlighting of selected pieces
 */
function updateSelectionVisuals() {
    // Clear all selections
    document.querySelectorAll('.set-piece-icon').forEach(piece => {
        piece.classList.remove('drag-selected');
    });
    
    // Highlight selected pieces
    if (DragSelectionState.currentSetId && DragSelectionState.selectedPieces.size > 0) {
        const grid = document.querySelector(`.set-pieces-grid[data-set-id="${DragSelectionState.currentSetId}"]`);
        if (grid) {
            DragSelectionState.selectedPieces.forEach(pieceNum => {
                const piece = grid.querySelector(`.set-piece-icon[data-piece-num="${pieceNum}"]`);
                if (piece) {
                    piece.classList.add('drag-selected');
                }
            });
        }
    }
}

/**
 * Handle piece click (shift-click or normal click)
 */
function handlePieceClick(event, setId, pieceNum) {
    event.preventDefault();
    
    if (event.shiftKey) {
        // Shift-click: slot entire set
        slotEntireSet(setId);
    } else {
        // Normal click: slot single piece
        addEnhancement(setId, pieceNum);
    }
}

/**
 * Slot entire set (or as many pieces as will fit)
 */
function slotEntireSet(setId) {
    const set = IO_SETS[setId];
    if (!set) return;
    
    const pieceNums = set.pieces.map(p => p.num).sort((a, b) => a - b);
    slotMultiplePieces(setId, pieceNums);
}

/**
 * Slot multiple pieces from a set
 * @param {string} setId - Set ID
 * @param {Array<number>} pieceNums - Array of piece numbers to slot
 */
function slotMultiplePieces(setId, pieceNums) {
    const result = findPower(AppState.currentPowerName);
    if (!result) {
        console.error('Power not found:', AppState.currentPowerName);
        return;
    }
    
    const power = result.power;
    
    // Initialize slots array if it doesn't exist
    if (!power.slots) {
        power.slots = [null]; // Powers always start with 1 default slot
    }
    
    // DON'T add more slots - only use what exists
    // Find empty slots in the existing array
    const emptySlots = [];
    for (let i = 0; i < power.slots.length; i++) {
        if (!power.slots[i]) {
            emptySlots.push(i);
        }
    }
    
    console.log(`Power has ${power.slots.length} slots, ${emptySlots.length} are empty`);
    
    if (emptySlots.length === 0) {
        console.log('No empty slots available - all slots are full');
        return;
    }
    
    // Slot as many pieces as we have empty slots
    const piecesToSlot = pieceNums.slice(0, emptySlots.length);
    let slotsUsed = 0;
    
    piecesToSlot.forEach(pieceNum => {
        // Check if this piece is already slotted
        const hasDuplicate = power.slots.some(slot => 
            slot && slot.type === 'io-set' && slot.setId === setId && slot.pieceNum === pieceNum
        );
        
        if (!hasDuplicate && slotsUsed < emptySlots.length) {
            const set = IO_SETS[setId];
            const piece = set.pieces.find(p => p.num === pieceNum);
            
            const enhancement = createEnhancement('io-set', {
                setId: setId,
                pieceNum: pieceNum,
                setName: set.name,
                pieceName: piece.name,
                values: piece.values,
                unique: piece.unique || false
            });
            
            // Add to the next empty slot
            const slotIndex = emptySlots[slotsUsed];
            power.slots[slotIndex] = enhancement;
            console.log(`Slotted ${set.name} piece ${pieceNum} into slot ${slotIndex}`);
            slotsUsed++;
        } else if (hasDuplicate) {
            console.log(`Skipping piece ${pieceNum} - already slotted`);
        }
    });
    
    if (slotsUsed > 0) {
        console.log(`Successfully slotted ${slotsUsed} enhancement(s)`);
        
        // Update UI - this should NOT add more slots
        updatePowerSlots(AppState.currentPowerName);
        recalculateStats();
        
        // Close modal if all requested pieces were slotted
        if (slotsUsed === pieceNums.length) {
            closeModal();
        }
    } else {
        console.log('No enhancements were slotted');
    }
}
