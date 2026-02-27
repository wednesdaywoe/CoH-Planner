/**
 * EnhancementPicker component - single-screen modal for selecting enhancements
 *
 * Layout:
 * - Top: Enhancement type filters (IO Sets, Generic IO, Special, Origin)
 * - Left: Category filters (based on power's allowed set categories)
 * - Main: Scrollable list of all matching enhancements
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import {
  getIOSetsForPower, getAllIOSets, lookupPower,
  getCommonIOValueAtLevel, ORIGIN_TIERS,
  sortCategoriesByPriority,
  createIOSetEnhancement, createGenericIOEnhancement, createSpecialEnhancement, createOriginEnhancement,
  getAvailableGenericIOs, getAvailableHamidons, getAvailableTitans, getAvailableHydras, getAvailableDSyncs,
  getRarityColor, getTierTextColor, getTierBorderColor,
  findProcData, parseProcEffect, getProcEffectLabel, getProcEffectColor, isProcAlwaysOn,
} from '@/data';
import { normalizeAspectName, getAspectSchedule, getIOValueAtLevel, normalizeStatName } from '@/utils/calculations';
import { getPairedStat } from '@/utils/calculations/set-bonuses';
import { Modal, ModalBody } from '@/components/modals';
import { Tooltip, Toggle } from '@/components/ui';
import { IOSetIcon, GenericIOIcon, OriginEnhancementIcon, SpecialEnhancementIcon } from './EnhancementIcon';
import type { IOSet, IOSetPiece, EnhancementStatType, SpecialEnhancementDef, IOSetCategory, SpecialEnhancement } from '@/types';
import { getSetTrackedMatches } from '@/data/set-bonus-index';
import { getEnhancementOutline } from '@/utils/enhancement-outline';

type EnhancementTypeFilter = 'io-sets' | 'generic' | 'special' | 'origin' | 'debug';

// Sidebar filter can be 'all', a category name, or a special group
type SidebarFilter =
  | 'all'
  | 'universal'
  | 'very-rare'
  | 'event'
  | 'archetype'
  | string; // Category name like "Ranged Damage"

export function EnhancementPicker() {
  const picker = useUIStore((s) => s.enhancementPicker);
  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const attunementEnabled = useUIStore((s) => s.attunementEnabled);
  const toggleAttunement = useUIStore((s) => s.toggleAttunement);
  const globalBoostLevel = useUIStore((s) => s.globalBoostLevel);
  const setGlobalBoostLevel = useUIStore((s) => s.setGlobalBoostLevel);
  const closeEnhancementPicker = useUIStore((s) => s.closeEnhancementPicker);
  const setEnhancement = useBuildStore((s) => s.setEnhancement);
  const buildOrigin = useBuildStore((s) => s.build.settings.origin);
  const build = useBuildStore((s) => s.build);

  // Local filter state
  const [typeFilter, setTypeFilter] = useState<EnhancementTypeFilter>('io-sets');
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>('all');

  // Drag selection state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragEndIndex, setDragEndIndex] = useState<number | null>(null);
  const [dragSet, setDragSet] = useState<IOSet | null>(null);

  // Shift+Click multi-select state: setId → Set of piece indices
  const [shiftSelected, setShiftSelected] = useState<Map<string, Set<number>>>(new Map());

  // Get the current power definition (unified lookup across all categories)
  const currentPower = useMemo(() => {
    if (!picker.currentPowerName || !picker.currentPowerSet) return null;
    return lookupPower(picker.currentPowerSet, picker.currentPowerName)?.power ?? null;
  }, [picker.currentPowerName, picker.currentPowerSet]);

  // Get the current power's slots from the build
  const currentPowerSlots = useMemo(() => {
    if (!picker.currentPowerName) return [];

    // Search in all power categories
    const findInPowers = (powers: { name: string; slots: (unknown | null)[] }[]) =>
      powers.find(p => p.name === picker.currentPowerName)?.slots || [];

    let slots = findInPowers(build.primary.powers);
    if (slots.length > 0) return slots;

    slots = findInPowers(build.secondary.powers);
    if (slots.length > 0) return slots;

    for (const pool of build.pools) {
      slots = findInPowers(pool.powers);
      if (slots.length > 0) return slots;
    }

    if (build.epicPool) {
      slots = findInPowers(build.epicPool.powers);
      if (slots.length > 0) return slots;
    }

    slots = findInPowers(build.inherents);
    return slots;
  }, [picker.currentPowerName, build]);

  // Get indices of empty slots (starting from currentSlotIndex)
  const emptySlotIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = picker.currentSlotIndex; i < currentPowerSlots.length; i++) {
      if (!currentPowerSlots[i]) {
        indices.push(i);
      }
    }
    return indices;
  }, [currentPowerSlots, picker.currentSlotIndex]);

  // Get available IO sets for the current power
  const availableSets = useMemo(() => {
    if (!currentPower) return [];
    return getIOSetsForPower((currentPower.allowedSetCategories || []) as IOSetCategory[]);
  }, [currentPower]);

  // Derive all standard set categories from the available sets, sorted by priority
  const standardCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const set of availableSets) {
      if ((set.category === 'uncommon' || set.category === 'rare') && set.type !== 'Universal Damage Sets') {
        cats.add(set.type);
      }
    }
    return sortCategoriesByPriority(Array.from(cats));
  }, [availableSets]);

  // Primary category is the first standard one (used for auto-select on open)
  const primaryCategory = standardCategories[0] || null;

  // Check which special groups have sets available
  const hasUniversal = useMemo(() =>
    availableSets.some((set) => set.type === 'Universal Damage Sets'), [availableSets]);
  const hasVeryRare = useMemo(() =>
    availableSets.some((set) => set.category === 'purple'), [availableSets]);
  const hasEvent = useMemo(() =>
    availableSets.some((set) => set.category === 'event'), [availableSets]);
  const hasArchetype = useMemo(() =>
    availableSets.some((set) => set.category === 'ato'), [availableSets]);
  const hasPvP = useMemo(() =>
    availableSets.some((set) => set.category === 'pvp'), [availableSets]);

  // Helper to check if a set is a "special" category (excluded from normal filters)
  const isSpecialSet = (set: IOSet) =>
    set.category === 'purple' ||
    set.category === 'ato' ||
    set.category === 'event' ||
    set.category === 'pvp' ||
    set.type === 'Universal Damage Sets';

  // Filter sets based on sidebar selection
  const filteredSets = useMemo(() => {
    switch (sidebarFilter) {
      case 'all':
        // "All" only shows standard IO sets (uncommon/rare), excludes special categories
        return availableSets.filter((set) => !isSpecialSet(set));
      case 'universal':
        return availableSets.filter((set) => set.type === 'Universal Damage Sets');
      case 'very-rare':
        return availableSets.filter((set) => set.category === 'purple');
      case 'event':
        return availableSets.filter((set) => set.category === 'event');
      case 'archetype':
        return availableSets.filter((set) => set.category === 'ato');
      case 'pvp':
        return availableSets.filter((set) => set.category === 'pvp');
      default:
        // It's a category name - only show standard sets of that type
        return availableSets.filter((set) => set.type === sidebarFilter && !isSpecialSet(set));
    }
  }, [availableSets, sidebarFilter]);

  // Check if a specific set piece is already slotted in the current power
  const isPieceInCurrentPower = (setId: string, pieceNum: number) => {
    return currentPowerSlots.some((enh) => {
      if (!enh || typeof enh !== 'object') return false;
      const ioEnh = enh as { type?: string; setId?: string; pieceNum?: number };
      return ioEnh.type === 'io-set' && ioEnh.setId === setId && ioEnh.pieceNum === pieceNum;
    });
  };

  // Auto-select primary category when modal opens; clear shift-selection
  const prevIsOpen = useRef(false);
  useEffect(() => {
    if (picker.isOpen && !prevIsOpen.current) {
      if (primaryCategory) setSidebarFilter(primaryCategory);
      setShiftSelected(new Map());
    }
    prevIsOpen.current = picker.isOpen;
  }, [picker.isOpen, primaryCategory]);

  // Helper to create IO set enhancement via registry factory
  const makeIOSetEnhancement = (set: IOSet, piece: IOSetPiece, pieceIndex: number) =>
    createIOSetEnhancement(set, piece, pieceIndex, { attuned: attunementEnabled, level: globalIOLevel, boost: globalBoostLevel });

  // Handle selecting an IO set piece (single click)
  const handleSelectSetPiece = (set: IOSet, piece: IOSetPiece, pieceIndex: number) => {
    if (!picker.currentPowerName) return;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, makeIOSetEnhancement(set, piece, pieceIndex));
    closeEnhancementPicker();
  };

  // Handle slotting all shift-selected pieces (across sets)
  const handleSlotMultiSelect = () => {
    if (!picker.currentPowerName) return;

    // Gather all selected pieces in order
    const allPieces: { set: IOSet; piece: IOSetPiece; pieceIndex: number }[] = [];
    for (const [setId, indices] of shiftSelected) {
      const set = availableSets.find((s) => (s.id || s.name) === setId);
      if (!set) continue;
      for (const idx of Array.from(indices).sort((a, b) => a - b)) {
        if (set.pieces[idx]) {
          allPieces.push({ set, piece: set.pieces[idx], pieceIndex: idx });
        }
      }
    }

    if (allPieces.length === 0) return;

    // Fill empty slots with selected pieces
    const slotsToFill = emptySlotIndices.slice(0, allPieces.length);
    allPieces.forEach(({ set, piece, pieceIndex }, idx) => {
      if (idx < slotsToFill.length) {
        setEnhancement(
          picker.currentPowerName!,
          slotsToFill[idx],
          makeIOSetEnhancement(set, piece, pieceIndex)
        );
      }
    });

    setShiftSelected(new Map());
    closeEnhancementPicker();
  };

  // Toggle a piece in the shift-selection
  const toggleShiftSelect = (set: IOSet, pieceIndex: number) => {
    const setId = set.id || set.name;
    setShiftSelected((prev) => {
      const next = new Map(prev);
      const indices = new Set(next.get(setId) || []);
      if (indices.has(pieceIndex)) {
        indices.delete(pieceIndex);
        if (indices.size === 0) next.delete(setId);
        else next.set(setId, indices);
      } else {
        indices.add(pieceIndex);
        next.set(setId, indices);
      }
      return next;
    });
  };

  // Check if any pieces are shift-selected
  const hasShiftSelection = shiftSelected.size > 0;

  // Check if a piece is shift-selected
  const isShiftSelected = (set: IOSet, pieceIndex: number) => {
    const setId = set.id || set.name;
    return shiftSelected.get(setId)?.has(pieceIndex) || false;
  };

  // Handle drag selection - slot selected range of pieces
  const handleDragSelect = (set: IOSet, startIndex: number, endIndex: number) => {
    if (!picker.currentPowerName) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    const selectedPieces = set.pieces.slice(minIndex, maxIndex + 1);

    // Get empty slots starting from current slot
    const slotsToFill = emptySlotIndices.slice(0, selectedPieces.length);
    if (slotsToFill.length === 0) return;

    // Fill slots with selected pieces
    selectedPieces.forEach((piece, idx) => {
      const pieceIndex = minIndex + idx;
      if (idx < slotsToFill.length) {
        setEnhancement(
          picker.currentPowerName!,
          slotsToFill[idx],
          makeIOSetEnhancement(set, piece, pieceIndex)
        );
      }
    });

    closeEnhancementPicker();
  };

  // Drag handlers
  const handlePieceMouseDown = (set: IOSet, pieceIndex: number, e: React.MouseEvent) => {
    // Don't start drag on shift+click (that's multi-select)
    if (e.shiftKey) return;
    setIsDragging(true);
    setDragStartIndex(pieceIndex);
    setDragEndIndex(pieceIndex);
    setDragSet(set);
  };

  const handlePieceMouseEnter = (pieceIndex: number) => {
    if (isDragging) {
      setDragEndIndex(pieceIndex);
    }
  };

  const handlePieceMouseUp = (set: IOSet, pieceIndex: number, e: React.MouseEvent) => {
    // Shift+Click: toggle in multi-select
    if (e.shiftKey) {
      toggleShiftSelect(set, pieceIndex);
      // Reset drag state in case
      setIsDragging(false);
      setDragStartIndex(null);
      setDragEndIndex(null);
      setDragSet(null);
      return;
    }

    // Regular click on a shift-selected piece: slot all selected
    if (hasShiftSelection && isShiftSelected(set, pieceIndex)) {
      handleSlotMultiSelect();
      setIsDragging(false);
      setDragStartIndex(null);
      setDragEndIndex(null);
      setDragSet(null);
      return;
    }

    if (isDragging && dragStartIndex !== null && dragSet?.id === set.id) {
      const start = dragStartIndex;
      const end = pieceIndex;

      if (start === end) {
        // Single click — slot this piece
        handleSelectSetPiece(set, set.pieces[pieceIndex], pieceIndex);
      } else {
        // Drag selection
        handleDragSelect(set, start, end);
      }
    }

    // Reset drag state
    setIsDragging(false);
    setDragStartIndex(null);
    setDragEndIndex(null);
    setDragSet(null);
  };

  // Touch handlers for mobile — allow native scroll, only select on short stationary taps
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchMoved = useRef(false);
  const TOUCH_MOVE_THRESHOLD = 10; // px — beyond this it's a scroll, not a tap

  const handlePieceTouchStart = (_set: IOSet, _pieceIndex: number, e: React.TouchEvent) => {
    // Don't preventDefault — let the browser handle scroll
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchMoved.current = false;
  };

  const handlePieceTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    // Check if finger moved beyond threshold (scrolling)
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.current.x);
    const dy = Math.abs(touch.clientY - touchStartPos.current.y);
    if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) {
      touchMoved.current = true;
    }
  };

  const handlePieceTouchEnd = (set: IOSet, e: React.TouchEvent) => {
    // If the finger moved significantly, it was a scroll — don't select
    if (touchMoved.current) {
      touchStartPos.current = null;
      return;
    }

    // It was a stationary tap — select the piece
    e.preventDefault(); // Prevent ghost click only on actual taps
    touchStartPos.current = null;

    // Find which piece was tapped from the touch target
    const target = e.target as HTMLElement;
    const pieceButton = target.closest('[data-piece-index]') as HTMLElement | null;
    if (pieceButton) {
      const pieceIndex = parseInt(pieceButton.dataset.pieceIndex || '', 10);
      if (!isNaN(pieceIndex) && set.pieces[pieceIndex]) {
        handleSelectSetPiece(set, set.pieces[pieceIndex], pieceIndex);
      }
    }
  };

  // Global mouse/touch up to cancel drag if released outside
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStartIndex(null);
        setDragEndIndex(null);
        setDragSet(null);
      }
    };
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    window.addEventListener('touchcancel', handleGlobalEnd);
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('touchcancel', handleGlobalEnd);
    };
  }, [isDragging]);

  // Handle selecting a generic IO
  const handleSelectGenericIO = (stat: EnhancementStatType) => {
    if (!picker.currentPowerName) return;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, createGenericIOEnhancement(stat, globalIOLevel, globalBoostLevel));
    closeEnhancementPicker();
  };

  // Handle selecting an origin enhancement
  const handleSelectOrigin = (stat: EnhancementStatType, tier: 'TO' | 'DO' | 'SO') => {
    if (!picker.currentPowerName) return;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, createOriginEnhancement(stat, tier, buildOrigin, globalBoostLevel));
    closeEnhancementPicker();
  };

  // Handle selecting a special enhancement (Hamidon, Titan, Hydra, D-Sync)
  const handleSelectSpecial = (id: string, def: SpecialEnhancementDef, category: SpecialEnhancement['category']) => {
    if (!picker.currentPowerName) return;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, createSpecialEnhancement(id, def, category, globalBoostLevel));
    closeEnhancementPicker();
  };

  // Get available generic IOs and special enhancements for this power (via registry)
  const availableGenericIOs = useMemo(() => getAvailableGenericIOs(currentPower ?? null), [currentPower]);
  const availableHamidons = useMemo(() => getAvailableHamidons(currentPower ?? null), [currentPower]);
  const availableTitans = useMemo(() => getAvailableTitans(currentPower ?? null), [currentPower]);
  const availableHydras = useMemo(() => getAvailableHydras(currentPower ?? null), [currentPower]);
  const availableDSyncs = useMemo(() => getAvailableDSyncs(currentPower ?? null), [currentPower]);

  const ioValue = getCommonIOValueAtLevel(globalIOLevel);

  return (
    <Modal
      isOpen={picker.isOpen}
      onClose={closeEnhancementPicker}
      title={`Select Enhancement for ${picker.currentPowerName || 'Power'}`}
      size="full"
    >
      <ModalBody className="p-0">
        <div className="flex flex-col h-[80vh] sm:h-[70vh]">
        {/* Type filter tabs at top */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-700 bg-gray-900/50 flex-shrink-0">
          <div className="flex overflow-x-auto">
            {[
              { id: 'io-sets' as const, label: 'IO Sets' },
              { id: 'generic' as const, label: 'Generic IO' },
              { id: 'special' as const, label: 'Special' },
              { id: 'origin' as const, label: 'Origin' },
              { id: 'debug' as const, label: 'Debug: All Sets' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setTypeFilter(tab.id);
                  setSidebarFilter('all');
                }}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  typeFilter === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Attunement toggle + Boost dial */}
          <div className="px-3 sm:px-4 py-1.5 sm:py-0 border-t sm:border-t-0 border-gray-700 flex items-center gap-4">
            <Toggle
              id="attunement-toggle-picker"
              name="attunement"
              checked={attunementEnabled}
              onChange={toggleAttunement}
              label="Attuned"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">Boost</span>
              <button
                onClick={() => setGlobalBoostLevel(globalBoostLevel - 1)}
                className="w-5 h-5 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={globalBoostLevel === 0}
              >-</button>
              <span className={`text-sm font-mono w-6 text-center ${globalBoostLevel > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                +{globalBoostLevel}
              </span>
              <button
                onClick={() => setGlobalBoostLevel(globalBoostLevel + 1)}
                className="w-5 h-5 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={globalBoostLevel === 5}
              >+</button>
            </div>
          </div>
        </div>

        {/* Category filter - horizontal scrolling on mobile only */}
        {typeFilter === 'io-sets' && availableSets.length > 0 && (
          <div className="flex sm:hidden overflow-x-auto border-b border-gray-700 bg-gray-900/30 flex-shrink-0 gap-1 px-2 py-1.5">
            <MobileCategoryButton
              label="All"
              count={availableSets.filter((s) => !isSpecialSet(s)).length}
              isActive={sidebarFilter === 'all'}
              onClick={() => setSidebarFilter('all')}
            />
            {standardCategories.map((cat) => (
              <MobileCategoryButton
                key={cat}
                label={cat.replace(' Damage', '').replace(' Sets', '')}
                count={availableSets.filter((s) => s.type === cat && !isSpecialSet(s)).length}
                isActive={sidebarFilter === cat}
                onClick={() => setSidebarFilter(cat)}
                textColor={cat === primaryCategory ? 'text-yellow-400' : undefined}
              />
            ))}
            {hasUniversal && (
              <MobileCategoryButton
                label="Universal"
                count={availableSets.filter((s) => s.type === 'Universal Damage Sets').length}
                isActive={sidebarFilter === 'universal'}
                onClick={() => setSidebarFilter('universal')}
              />
            )}
            {hasVeryRare && (
              <MobileCategoryButton
                label="Very Rare"
                count={availableSets.filter((s) => s.category === 'purple').length}
                isActive={sidebarFilter === 'very-rare'}
                onClick={() => setSidebarFilter('very-rare')}
                textColor="text-purple-400"
              />
            )}
            {hasEvent && (
              <MobileCategoryButton
                label="Event"
                count={availableSets.filter((s) => s.category === 'event').length}
                isActive={sidebarFilter === 'event'}
                onClick={() => setSidebarFilter('event')}
                textColor="text-cyan-400"
              />
            )}
            {hasArchetype && (
              <MobileCategoryButton
                label="ATO"
                count={availableSets.filter((s) => s.category === 'ato').length}
                isActive={sidebarFilter === 'archetype'}
                onClick={() => setSidebarFilter('archetype')}
                textColor="text-orange-400"
              />
            )}
            {hasPvP && (
              <MobileCategoryButton
                label="PvP"
                count={availableSets.filter((s) => s.category === 'pvp').length}
                isActive={sidebarFilter === 'pvp'}
                onClick={() => setSidebarFilter('pvp')}
                textColor="text-red-400"
              />
            )}
          </div>
        )}

        <div className="flex flex-1 min-h-0">
          {/* Category sidebar - desktop only */}
          {typeFilter === 'io-sets' && availableSets.length > 0 && (
            <div className="hidden sm:block w-48 border-r border-gray-700 overflow-y-auto flex-shrink-0 bg-gray-900/30">
              {/* All (standard sets only) */}
              <SidebarButton
                label="All"
                count={availableSets.filter((s) => !isSpecialSet(s)).length}
                isActive={sidebarFilter === 'all'}
                onClick={() => setSidebarFilter('all')}
              />

              {/* Standard set categories (data-driven from power's allowed sets) */}
              {standardCategories.map((cat) => (
                <SidebarButton
                  key={cat}
                  label={cat}
                  count={availableSets.filter((s) => s.type === cat && !isSpecialSet(s)).length}
                  isActive={sidebarFilter === cat}
                  onClick={() => setSidebarFilter(cat)}
                  textColor={cat === primaryCategory ? 'text-yellow-400' : undefined}
                />
              ))}

              {/* Universal Damage */}
              {hasUniversal && (
                <SidebarButton
                  label="Universal Damage"
                  count={availableSets.filter((s) => s.type === 'Universal Damage Sets').length}
                  isActive={sidebarFilter === 'universal'}
                  onClick={() => setSidebarFilter('universal')}
                />
              )}

              {/* Very Rare (Purple) */}
              {hasVeryRare && (
                <SidebarButton
                  label="Very Rare"
                  count={availableSets.filter((s) => s.category === 'purple').length}
                  isActive={sidebarFilter === 'very-rare'}
                  onClick={() => setSidebarFilter('very-rare')}
                  textColor="text-purple-400"
                />
              )}

              {/* Event (Winter, etc.) */}
              {hasEvent && (
                <SidebarButton
                  label="Event"
                  count={availableSets.filter((s) => s.category === 'event').length}
                  isActive={sidebarFilter === 'event'}
                  onClick={() => setSidebarFilter('event')}
                  textColor="text-cyan-400"
                />
              )}

              {/* Archetype (ATO) */}
              {hasArchetype && (
                <SidebarButton
                  label="Archetype"
                  count={availableSets.filter((s) => s.category === 'ato').length}
                  isActive={sidebarFilter === 'archetype'}
                  onClick={() => setSidebarFilter('archetype')}
                  textColor="text-orange-400"
                />
              )}

              {/* PvP */}
              {hasPvP && (
                <SidebarButton
                  label="PvP"
                  count={availableSets.filter((s) => s.category === 'pvp').length}
                  isActive={sidebarFilter === 'pvp'}
                  onClick={() => setSidebarFilter('pvp')}
                  textColor="text-red-400"
                />
              )}
            </div>
          )}

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3">
            {typeFilter === 'io-sets' && (
              <IOSetsContent
                sets={filteredSets}
                globalIOLevel={globalIOLevel}
                attunementEnabled={attunementEnabled}
                onPieceMouseDown={handlePieceMouseDown}
                onPieceMouseEnter={handlePieceMouseEnter}
                onPieceMouseUp={handlePieceMouseUp}
                onPieceTouchStart={handlePieceTouchStart}
                onPieceTouchMove={handlePieceTouchMove}
                onPieceTouchEnd={handlePieceTouchEnd}
                isDragging={isDragging}
                dragSet={dragSet}
                dragStartIndex={dragStartIndex}
                dragEndIndex={dragEndIndex}
                isPieceInCurrentPower={isPieceInCurrentPower}
                isShiftSelected={isShiftSelected}
                hasShiftSelection={hasShiftSelection}
              />
            )}

            {typeFilter === 'generic' && (
              <GenericIOContent
                availableIOs={availableGenericIOs}
                ioValue={ioValue}
                globalIOLevel={globalIOLevel}
                onSelect={handleSelectGenericIO}
              />
            )}

            {typeFilter === 'special' && (
              <SpecialContent
                availableHamidons={availableHamidons}
                availableTitans={availableTitans}
                availableHydras={availableHydras}
                availableDSyncs={availableDSyncs}
                onSelect={handleSelectSpecial}
              />
            )}

            {typeFilter === 'origin' && (
              <OriginContent
                availableTypes={availableGenericIOs}
                onSelect={handleSelectOrigin}
              />
            )}

            {typeFilter === 'debug' && (
              <DebugAllSetsContent />
            )}
          </div>
        </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

// ============================================
// SIDEBAR BUTTON
// ============================================

interface SidebarButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  textColor?: string;
}

function SidebarButton({ label, count, isActive, onClick, textColor }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-2 text-left text-sm transition-colors ${
        isActive
          ? 'bg-blue-900/30 text-blue-300 border-l-2 border-blue-400'
          : `${textColor || 'text-gray-400'} hover:bg-gray-800/50 hover:text-gray-200`
      }`}
    >
      {label} ({count})
    </button>
  );
}

// ============================================
// MOBILE CATEGORY BUTTON
// ============================================

interface MobileCategoryButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  textColor?: string;
}

function MobileCategoryButton({ label, count, isActive, onClick, textColor }: MobileCategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : `bg-gray-700 ${textColor || 'text-gray-300'} hover:bg-gray-600`
      }`}
    >
      {label} ({count})
    </button>
  );
}

// ============================================
// IO SETS CONTENT
// ============================================

interface IOSetsContentProps {
  sets: IOSet[];
  globalIOLevel: number;
  attunementEnabled: boolean;
  onPieceMouseDown: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
  onPieceMouseEnter: (pieceIndex: number) => void;
  onPieceMouseUp: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
  onPieceTouchStart: (set: IOSet, pieceIndex: number, e: React.TouchEvent) => void;
  onPieceTouchMove: (e: React.TouchEvent) => void;
  onPieceTouchEnd: (set: IOSet, e: React.TouchEvent) => void;
  isDragging: boolean;
  dragSet: IOSet | null;
  dragStartIndex: number | null;
  dragEndIndex: number | null;
  isPieceInCurrentPower: (setId: string, pieceNum: number) => boolean;
  isShiftSelected: (set: IOSet, pieceIndex: number) => boolean;
  hasShiftSelection: boolean;
}

function IOSetsContent({
  sets,
  onPieceMouseDown,
  onPieceMouseEnter,
  onPieceMouseUp,
  onPieceTouchStart,
  onPieceTouchMove,
  onPieceTouchEnd,
  isDragging,
  dragSet,
  dragStartIndex,
  dragEndIndex,
  isPieceInCurrentPower,
  isShiftSelected,
  hasShiftSelection,
}: IOSetsContentProps) {
  if (sets.length === 0) {
    return <div className="text-center text-gray-500 py-8">No IO sets available for this power</div>;
  }

  return (
    <div className="space-y-3">
      {sets.map((set) => (
        <IOSetRow
          key={set.id || set.name}
          set={set}
          onPieceMouseDown={onPieceMouseDown}
          onPieceMouseEnter={onPieceMouseEnter}
          onPieceMouseUp={onPieceMouseUp}
          onPieceTouchStart={onPieceTouchStart}
          onPieceTouchMove={onPieceTouchMove}
          onPieceTouchEnd={onPieceTouchEnd}
          isDragging={isDragging && dragSet?.id === set.id}
          dragStartIndex={dragSet?.id === set.id ? dragStartIndex : null}
          dragEndIndex={dragSet?.id === set.id ? dragEndIndex : null}
          isPieceInCurrentPower={isPieceInCurrentPower}
          isShiftSelected={isShiftSelected}
          hasShiftSelection={hasShiftSelection}
        />
      ))}
    </div>
  );
}

interface IOSetRowProps {
  set: IOSet;
  onPieceMouseDown: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
  onPieceMouseEnter: (pieceIndex: number) => void;
  onPieceMouseUp: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
  onPieceTouchStart: (set: IOSet, pieceIndex: number, e: React.TouchEvent) => void;
  onPieceTouchMove: (e: React.TouchEvent) => void;
  onPieceTouchEnd: (set: IOSet, e: React.TouchEvent) => void;
  isDragging: boolean;
  dragStartIndex: number | null;
  dragEndIndex: number | null;
  isPieceInCurrentPower: (setId: string, pieceNum: number) => boolean;
  isShiftSelected: (set: IOSet, pieceIndex: number) => boolean;
  hasShiftSelection: boolean;
}

function IOSetRow({
  set,
  onPieceMouseDown,
  onPieceMouseEnter,
  onPieceMouseUp,
  onPieceTouchStart,
  onPieceTouchMove,
  onPieceTouchEnd,
  isDragging,
  dragStartIndex,
  dragEndIndex,
  isPieceInCurrentPower,
  isShiftSelected,
  hasShiftSelection,
}: IOSetRowProps) {
  const attunementEnabled = useUIStore((s) => s.attunementEnabled);
  const isUniqueEnhancementSlotted = useBuildStore((s) => s.isUniqueEnhancementSlotted);
  const trackedStats = useUIStore((s) => s.trackedStats);

  // Check if this set provides any tracked stat bonuses
  const hasTrackedMatch = useMemo(() => {
    if (trackedStats.length === 0) return false;
    const matches = getSetTrackedMatches(set, trackedStats);
    return matches.size > 0;
  }, [set, trackedStats]);

  // Compute proc/unique outlines for all pieces
  const pieceOutlines = useMemo(() =>
    set.pieces.map((piece) =>
      getEnhancementOutline(
        { name: piece.name, proc: piece.proc, unique: piece.unique },
        set.name,
      )
    ),
    [set.pieces, set.name],
  );

  // Check if a piece is in the current drag selection
  const isPieceSelected = (pieceIndex: number) => {
    if (!isDragging || dragStartIndex === null || dragEndIndex === null) return false;
    const min = Math.min(dragStartIndex, dragEndIndex);
    const max = Math.max(dragStartIndex, dragEndIndex);
    return pieceIndex >= min && pieceIndex <= max;
  };

  // Check if a piece is disabled (already slotted in this power, or unique/special already in build)
  const isPieceDisabled = (piece: IOSetPiece) => {
    const setId = set.id || set.name;
    // Always prevent duplicate of the same piece in the same power
    if (isPieceInCurrentPower(setId, piece.num)) return 'Already in this power';
    // Unique pieces and special rarity sets: prevent across entire build
    const isSpecialRarity = set.category === 'purple' || set.category === 'event' || set.category === 'ato';
    if ((piece.unique || isSpecialRarity) && isUniqueEnhancementSlotted(setId, piece.num)) {
      return 'Already slotted in build';
    }
    return null;
  };

  return (
    <div className={`rounded-lg p-2 ${
      hasTrackedMatch
        ? 'bg-blue-900/20 border-l-2 border-l-blue-500/70'
        : 'bg-gray-800/40'
    }`}>
      {/* Set header */}
      <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
        <span className={`text-xs sm:text-sm font-medium ${getRarityColor(set.category)}`}>
          {set.name}
        </span>
        <span className="text-[10px] sm:text-xs text-gray-500">
          Lv {set.minLevel}-{set.maxLevel} • {set.pieces.length}pc
        </span>
        <span className="hidden sm:inline text-xs text-gray-600 ml-auto">
          {hasShiftSelection ? 'Click selected to slot all' : 'Shift+click to multi-select'}
        </span>
      </div>

      {/* Pieces as icons - Desktop view */}
      <div className="hidden lg:flex flex-wrap gap-1 select-none">
        {set.pieces.map((piece, pieceIndex) => {
          const dragSelected = isPieceSelected(pieceIndex);
          const shiftSel = isShiftSelected(set, pieceIndex);
          const disabledReason = isPieceDisabled(piece);
          const isDisabled = !!disabledReason;
          return (
            <Tooltip
              key={pieceIndex}
              content={
                isDisabled
                  ? <div className="text-orange-400">{disabledReason}</div>
                  : <SetPieceTooltip set={set} piece={piece} />
              }
            >
              <button
                data-piece-index={pieceIndex}
                onMouseDown={(e) => !isDisabled && onPieceMouseDown(set, pieceIndex, e)}
                onMouseEnter={() => !isDisabled && onPieceMouseEnter(pieceIndex)}
                onMouseUp={(e) => !isDisabled && onPieceMouseUp(set, pieceIndex, e)}
                onTouchStart={(e) => !isDisabled && onPieceTouchStart(set, pieceIndex, e)}
                onTouchMove={(e) => !isDisabled && onPieceTouchMove(e)}
                onTouchEnd={(e) => !isDisabled && onPieceTouchEnd(set, e)}
                disabled={isDisabled}
                className={`relative w-[30px] h-[30px] rounded border transition-all bg-gray-900/50 touch-none ${
                  isDisabled
                    ? 'border-gray-700 opacity-40 cursor-not-allowed'
                    : shiftSel
                      ? 'border-green-400 scale-110 ring-2 ring-green-400/50'
                      : dragSelected
                        ? 'border-blue-400 scale-110 ring-2 ring-blue-400/50'
                        : 'border-gray-600 hover:border-blue-400 hover:scale-110'
                }`}
              >
                <IOSetIcon
                  icon={set.icon || 'Unknown.png'}
                  attuned={attunementEnabled}
                  category={set.category}
                  size={30}
                  alt={piece.name}
                  className="pointer-events-none"
                />
                {pieceOutlines[pieceIndex].show && (
                  <div
                    className="absolute -top-1 right-0 w-2 h-2 rounded-full border border-gray-900 pointer-events-none z-10"
                    style={{
                      background: pieceOutlines[pieceIndex].secondaryColor
                        ? `linear-gradient(135deg, ${pieceOutlines[pieceIndex].color} 50%, ${pieceOutlines[pieceIndex].secondaryColor} 50%)`
                        : pieceOutlines[pieceIndex].color,
                    }}
                  />
                )}
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Pieces as list - Mobile view */}
      <div className="lg:hidden space-y-1 select-none">
        {set.pieces.map((piece, pieceIndex) => {
          const selected = isPieceSelected(pieceIndex);
          const disabledReason = isPieceDisabled(piece);
          const isDisabled = !!disabledReason;
          return (
            <button
              key={pieceIndex}
              data-piece-index={pieceIndex}
              onMouseDown={(e) => !isDisabled && onPieceMouseDown(set, pieceIndex, e)}
              onMouseEnter={() => !isDisabled && onPieceMouseEnter(pieceIndex)}
              onMouseUp={(e) => !isDisabled && onPieceMouseUp(set, pieceIndex, e)}
              onTouchStart={(e) => !isDisabled && onPieceTouchStart(set, pieceIndex, e)}
              onTouchMove={(e) => !isDisabled && onPieceTouchMove(e)}
              onTouchEnd={(e) => !isDisabled && onPieceTouchEnd(set, e)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-2 p-2 rounded border transition-all ${
                isDisabled
                  ? 'border-gray-700 opacity-40 cursor-not-allowed bg-gray-900/30'
                  : selected
                    ? 'border-blue-400 bg-blue-900/20'
                    : 'border-gray-600 bg-gray-900/50 active:bg-blue-900/10'
              }`}
              style={{
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
                touchAction: 'pan-y',
              }}
            >
              {/* Icon on left */}
              <div className="relative flex-shrink-0">
                <IOSetIcon
                  icon={set.icon || 'Unknown.png'}
                  attuned={attunementEnabled}
                  category={set.category}
                  size={30}
                  alt={piece.name}
                  className="pointer-events-none"
                />
                {pieceOutlines[pieceIndex].show && (
                  <div
                    className="absolute -top-0.5 right-0.5 w-2 h-2 rounded-full border border-gray-900 pointer-events-none"
                    style={{
                      background: pieceOutlines[pieceIndex].secondaryColor
                        ? `linear-gradient(135deg, ${pieceOutlines[pieceIndex].color} 50%, ${pieceOutlines[pieceIndex].secondaryColor} 50%)`
                        : pieceOutlines[pieceIndex].color,
                    }}
                  />
                )}
              </div>

              {/* Info on right */}
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-gray-200 truncate">
                  {piece.name}
                </div>
                <div className="text-xs text-gray-400">
                  {piece.aspects.join(', ')}
                </div>
                {piece.proc && (
                  <div className="text-xs" style={{ color: pieceOutlines[pieceIndex].color }}>Proc Effect</div>
                )}
                {(piece.unique || disabledReason) && (
                  <div className="text-xs text-orange-400">
                    {disabledReason || 'Unique'}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// GENERIC IO CONTENT
// ============================================

interface GenericIOContentProps {
  availableIOs: EnhancementStatType[];
  ioValue: number;
  globalIOLevel: number;
  onSelect: (stat: EnhancementStatType) => void;
}

function GenericIOContent({ availableIOs, ioValue, globalIOLevel, onSelect }: GenericIOContentProps) {
  if (availableIOs.length === 0) {
    return <div className="text-center text-gray-500 py-8">No generic IOs available for this power</div>;
  }

  return (
    <div className="bg-gray-800/40 rounded-lg p-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-300">Generic IOs</span>
        <span className="text-xs text-gray-500">
          Lv {globalIOLevel} • +{ioValue.toFixed(1)}%
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {availableIOs.map((stat) => (
          <Tooltip key={stat} content={`${stat} IO (+${ioValue.toFixed(1)}%)`}>
            <button
              onClick={() => onSelect(stat)}
              className="rounded border border-gray-600 hover:border-blue-400 hover:scale-110 transition-all bg-gray-900/50"
            >
              <GenericIOIcon stat={stat} size={30} alt={stat} />
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

// ============================================
// SPECIAL CONTENT
// ============================================

interface SpecialContentProps {
  availableHamidons: [string, SpecialEnhancementDef][];
  availableTitans: [string, SpecialEnhancementDef][];
  availableHydras: [string, SpecialEnhancementDef][];
  availableDSyncs: [string, SpecialEnhancementDef][];
  onSelect: (id: string, def: SpecialEnhancementDef, category: SpecialEnhancement['category']) => void;
}

const SPECIAL_SECTIONS: Array<{
  category: SpecialEnhancement['category'];
  label: string;
  color: string;
  borderColor: string;
  iconPrefix: string;
  key: 'availableHamidons' | 'availableTitans' | 'availableHydras' | 'availableDSyncs';
}> = [
  { category: 'hamidon', label: 'Hamidon Origin', color: 'text-purple-400', borderColor: 'border-purple-700 hover:border-purple-400', iconPrefix: 'HO', key: 'availableHamidons' },
  { category: 'titan', label: 'Titan Origin', color: 'text-amber-400', borderColor: 'border-amber-700 hover:border-amber-400', iconPrefix: 'TN', key: 'availableTitans' },
  { category: 'hydra', label: 'Hydra Origin', color: 'text-cyan-400', borderColor: 'border-cyan-700 hover:border-cyan-400', iconPrefix: 'HY', key: 'availableHydras' },
  { category: 'd-sync', label: 'D-Sync Origin', color: 'text-green-400', borderColor: 'border-green-700 hover:border-green-400', iconPrefix: 'DS', key: 'availableDSyncs' },
];

function SpecialContent(props: SpecialContentProps) {
  const { onSelect } = props;
  const totalAvailable = props.availableHamidons.length + props.availableTitans.length + props.availableHydras.length + props.availableDSyncs.length;

  if (totalAvailable === 0) {
    return <div className="text-center text-gray-500 py-8">No special enhancements available for this power</div>;
  }

  return (
    <div className="space-y-3">
      {SPECIAL_SECTIONS.map(section => {
        const entries = props[section.key];
        if (entries.length === 0) return null;
        return (
          <div key={section.category} className="bg-gray-800/40 rounded-lg p-2">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-medium ${section.color}`}>{section.label}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {entries.map(([id, def]) => {
                const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
                return (
                  <Tooltip key={id} content={`${def.name}: ${def.aspects.map(a => `${a.stat} +${a.value}%`).join(', ')}`}>
                    <button
                      onClick={() => onSelect(id, def, section.category)}
                      className={`rounded border ${section.borderColor} hover:scale-110 transition-all bg-gray-900/50`}
                    >
                      <SpecialEnhancementIcon icon={`${section.iconPrefix}${capitalizedId}.png`} size={30} alt={def.name} />
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// ORIGIN CONTENT
// ============================================

interface OriginContentProps {
  availableTypes: EnhancementStatType[];
  onSelect: (stat: EnhancementStatType, tier: 'TO' | 'DO' | 'SO') => void;
}

function OriginContent({ availableTypes, onSelect }: OriginContentProps) {
  const buildOrigin = useBuildStore((s) => s.build.settings.origin);

  if (availableTypes.length === 0) {
    return <div className="text-center text-gray-500 py-8">No origin enhancements available for this power</div>;
  }

  return (
    <div className="space-y-3">
      {ORIGIN_TIERS.map((tier) => (
        <div key={tier.short} className="bg-gray-800/40 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-medium ${getTierTextColor(tier.short)}`}>
              {tier.name} ({tier.short})
            </span>
            <span className="text-xs text-gray-500">+{tier.value.toFixed(1)}%</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {availableTypes.map((stat) => (
              <Tooltip key={stat} content={`${stat} ${tier.short} (+${tier.value.toFixed(1)}%)`}>
                <button
                  onClick={() => onSelect(stat, tier.short as 'TO' | 'DO' | 'SO')}
                  className={`rounded border hover:scale-110 transition-all bg-gray-900/50 ${getTierBorderColor(tier.short)}`}
                >
                  <OriginEnhancementIcon
                    stat={stat}
                    tier={tier.short as 'TO' | 'DO' | 'SO'}
                    origin={buildOrigin}
                    size={30}
                    alt={`${stat} ${tier.short}`}
                  />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// SHARED COMPONENTS
// ============================================

interface SetPieceTooltipProps {
  set: IOSet;
  piece: IOSetPiece;
}

function SetPieceTooltip({ set, piece }: SetPieceTooltipProps) {
  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const attunementEnabled = useUIStore((s) => s.attunementEnabled);
  const globalBoostLevel = useUIStore((s) => s.globalBoostLevel);
  const build = useBuildStore((s) => s.build);
  const picker = useUIStore((s) => s.enhancementPicker);
  const trackedStats = useUIStore((s) => s.trackedStats);

  // Build a set of normalized stat keys that are being tracked (including paired stats)
  const trackedNormalized = useMemo(() => {
    if (trackedStats.length === 0) return new Set<string>();
    const set = new Set<string>();
    for (const key of trackedStats) {
      set.add(key);
      const pair = getPairedStat(key);
      if (pair) set.add(pair);
    }
    return set;
  }, [trackedStats]);

  // Count how many pieces of this set are already slotted in the current power
  const setId = set.id || set.name;
  const piecesInPower = useMemo(() => {
    if (!picker.currentPowerName) return 0;
    const findPower = (powers: { name: string; slots: (unknown | null)[] }[]) =>
      powers.find(p => p.name === picker.currentPowerName);

    const power = findPower(build.primary.powers)
      || findPower(build.secondary.powers)
      || build.pools.reduce<{ name: string; slots: (unknown | null)[] } | undefined>(
        (found, pool) => found || findPower(pool.powers), undefined)
      || (build.epicPool ? findPower(build.epicPool.powers) : undefined)
      || findPower(build.inherents);

    if (!power) return 0;
    return power.slots.filter(s => {
      if (!s || typeof s !== 'object') return false;
      const ioEnh = s as { type?: string; setId?: string };
      return ioEnh.type === 'io-set' && ioEnh.setId === setId;
    }).length;
  }, [build, picker.currentPowerName, setId]);

  // Calculate aspect values at the effective level
  const effectiveLevel = attunementEnabled ? 50 : globalIOLevel;
  const aspectCount = piece.aspects.filter(a => normalizeAspectName(a) !== null).length || piece.aspects.length;
  const getAspectModifier = (count: number): number => {
    switch (count) {
      case 1: return 1.0;
      case 2: return 0.625;
      case 3: return 0.5;
      case 4: return 0.4375;
      default: return 0.4375;
    }
  };
  const aspectModifier = getAspectModifier(aspectCount);

  // Boost multiplier for non-proc pieces
  const boostMultiplier = (!piece.proc && globalBoostLevel > 0) ? 1 + globalBoostLevel * 0.05 : 1;

  const calculateAspectValue = (aspect: string): number | null => {
    const normalized = normalizeAspectName(aspect);
    if (!normalized) return null;
    const schedule = getAspectSchedule(normalized);
    const baseValue = getIOValueAtLevel(effectiveLevel, schedule);
    return baseValue * aspectModifier * boostMultiplier;
  };

  return (
    <div className="space-y-2 max-w-[320px]">
      {/* Enhancement header with set name */}
      <div className="flex items-center gap-2">
        <IOSetIcon
          icon={set.icon || 'Unknown.png'}
          attuned={attunementEnabled}
          category={set.category}
          size={28}
          alt={piece.name}
          className="flex-shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-xs font-semibold text-yellow-400 leading-tight">{set.name}</h3>
          <span className="text-[10px] text-blue-400">{piece.name}</span>
        </div>
      </div>

      {/* Proc Effect section */}
      {piece.proc ? (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded p-1.5">
          <div className="text-[9px] text-amber-400 uppercase mb-1 font-semibold">Proc Effect</div>
          {(() => {
            const procData = findProcData(piece.name, set.name);
            if (procData) {
              const effect = parseProcEffect(procData.mechanics);
              const effectColorClass = getProcEffectColor(effect.category);
              const categoryLabel = getProcEffectLabel(effect.category);
              const isAlwaysOn = isProcAlwaysOn(procData);

              const badgeColors: Record<string, string> = {
                'Damage': 'bg-red-900/50 text-red-300',
                'Endurance': 'bg-blue-900/50 text-blue-300',
                'Heal': 'bg-emerald-900/50 text-emerald-300',
                'Absorb': 'bg-cyan-900/50 text-cyan-300',
                'Resistance': 'bg-orange-900/50 text-orange-300',
                'Defense': 'bg-purple-900/50 text-purple-300',
                'ToHit': 'bg-yellow-900/50 text-yellow-300',
                'Regeneration': 'bg-green-900/50 text-green-300',
                'Recovery': 'bg-blue-900/50 text-blue-300',
                'Recharge': 'bg-amber-900/50 text-amber-300',
                'RunSpeed': 'bg-teal-900/50 text-teal-300',
                'MaxHP': 'bg-pink-900/50 text-pink-300',
                'KnockbackProtection': 'bg-slate-700 text-slate-300',
                'Stealth': 'bg-gray-700 text-gray-300',
                'Control': 'bg-indigo-900/50 text-indigo-300',
                'Debuff': 'bg-rose-900/50 text-rose-300',
                'Special': 'bg-slate-700 text-slate-300',
              };

              return (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-medium ${effectColorClass}`}>
                      {procData.ioName}
                    </span>
                    <span className={`text-[8px] px-1 py-0.5 rounded ${badgeColors[effect.category] || 'bg-slate-700 text-slate-300'}`}>
                      {categoryLabel}
                    </span>
                    {isAlwaysOn && (
                      <span className="text-[8px] px-1 py-0.5 rounded bg-green-900/50 text-green-300">
                        Always On
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-300 bg-slate-800/50 rounded px-1.5 py-1">
                    {procData.mechanics}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]">
                    {procData.ppm !== null && (
                      <div>
                        <span className="text-slate-500">PPM:</span>
                        <span className="text-amber-300 ml-1 font-medium">{procData.ppm}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <span className={`ml-1 ${
                        procData.type === 'Proc120s' ? 'text-purple-400' :
                        procData.type === 'Global' ? 'text-green-400' :
                        'text-amber-300'
                      }`}>
                        {procData.type === 'Proc120s' ? '100% (120s)' : procData.type}
                      </span>
                    </div>
                    {effect.value !== undefined && effect.category === 'Damage' && effect.valueMax && (
                      <div>
                        <span className="text-slate-500">Dmg:</span>
                        <span className="text-red-400 ml-1">{effect.value}-{effect.valueMax} {effect.effectType}</span>
                      </div>
                    )}
                    {effect.value !== undefined && effect.category !== 'Damage' && (
                      <div>
                        <span className="text-slate-500">Value:</span>
                        <span className={`${effectColorClass} ml-1`}>
                          {effect.category === 'KnockbackProtection' ? `Mag ${effect.value}` :
                           effect.category === 'Stealth' ? `${effect.value} ft` :
                           `${effect.value}%`}
                          {effect.effectType ? ` ${effect.effectType}` : ''}
                        </span>
                      </div>
                    )}
                    {effect.secondaryCategory && effect.secondaryValue !== undefined && (
                      <div>
                        <span className="text-slate-500">+{getProcEffectLabel(effect.secondaryCategory)}:</span>
                        <span className={`${getProcEffectColor(effect.secondaryCategory)} ml-1`}>
                          {effect.secondaryValue}%
                          {effect.secondaryEffectType ? ` ${effect.secondaryEffectType}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            return <div className="text-[10px] text-amber-200">{piece.name}</div>;
          })()}
        </div>
      ) : (
        /* Enhances section with calculated values */
        <div className="bg-slate-800/50 rounded p-1.5">
          <div className="text-[9px] text-slate-500 uppercase mb-1">Enhances:</div>
          {piece.aspects.map((aspect, i) => {
            const value = calculateAspectValue(aspect);
            return (
              <div key={i} className="flex justify-between items-baseline text-[10px]">
                <span className="text-slate-300">{aspect}</span>
                {value !== null && (
                  <span className="text-green-400 font-mono">
                    +{(value * 100).toFixed(2)}%
                  </span>
                )}
              </div>
            );
          })}
          {aspectCount > 1 && (
            <div className="text-[8px] text-slate-500 mt-1 italic">
              {aspectCount === 2 ? '62.5%' : aspectCount === 3 ? '50%' : '43.75%'} per aspect ({aspectCount} aspects)
            </div>
          )}
        </div>
      )}

      {/* Level and flags */}
      <div className="text-[10px] flex gap-3">
        <span className="text-slate-400">
          {attunementEnabled ? (
            <span className="text-purple-400">Attuned</span>
          ) : (
            <>Level: <span className="text-slate-200">{globalIOLevel}</span></>
          )}
        </span>
        <span className="text-slate-400">Range: {set.minLevel}-{set.maxLevel}</span>
        {!piece.proc && globalBoostLevel > 0 && <span className="text-green-400">+{globalBoostLevel} Boosted</span>}
        {piece.unique && <span className="text-red-400">Unique</span>}
      </div>

      {/* Set Bonuses */}
      {set.bonuses.length > 0 && (() => {
        const isPvPSet = set.category === 'pvp';
        const hasPvPEffects = isPvPSet && set.bonuses.some(b => b.effects.some(e => e.pvp));

        return (
          <div className="border-t border-slate-700 pt-2">
            <div className="text-[9px] text-slate-500 uppercase mb-1">
              Set Bonuses ({piecesInPower}/{set.pieces.length} slotted)
            </div>
            {/* PvE bonuses (or all bonuses for non-PvP sets) */}
            <div className="space-y-0.5">
              {set.bonuses.map((bonus, idx) => {
                const pveEffects = hasPvPEffects ? bonus.effects.filter(e => !e.pvp) : bonus.effects;
                if (pveEffects.length === 0) return null;
                const isActive = piecesInPower >= bonus.pieces;
                return (
                  <div
                    key={idx}
                    className={`text-[10px] ${isActive ? 'text-green-400' : 'text-slate-500'}`}
                  >
                    <span className={`font-medium ${isActive ? 'text-green-500' : 'text-slate-600'}`}>
                      {bonus.pieces}pc:
                    </span>{' '}
                    {pveEffects.map((eff, i) => {
                      const normalized = normalizeStatName(eff.stat);
                      const isTracked = normalized ? trackedNormalized.has(normalized) : false;
                      // Use eff.value for accurate display instead of pre-rounded eff.desc
                      const formatted = eff.desc.replace(/^\+[\d.]+%/, `+${eff.value}%`);
                      return (
                        <span key={i} className={isTracked ? 'text-blue-300 font-semibold' : ''}>
                          {i > 0 && ', '}
                          {formatted}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {/* PvP-only bonuses section */}
            {hasPvPEffects && (
              <>
                <div className="text-[9px] text-red-400/70 uppercase mt-2 mb-0.5">PvP Only</div>
                <div className="space-y-0.5">
                  {set.bonuses.map((bonus, idx) => {
                    const pvpEffects = bonus.effects.filter(e => e.pvp);
                    if (pvpEffects.length === 0) return null;
                    const isActive = piecesInPower >= bonus.pieces;
                    return (
                      <div
                        key={idx}
                        className={`text-[10px] ${isActive ? 'text-red-400/60' : 'text-slate-600'}`}
                      >
                        <span className={`font-medium ${isActive ? 'text-red-400/70' : 'text-slate-700'}`}>
                          {bonus.pieces}pc:
                        </span>{' '}
                        {pvpEffects.map((eff, i) => {
                          const formatted = eff.desc.replace(/^\+[\d.]+%/, `+${eff.value}%`);
                          return (
                            <span key={i}>
                              {i > 0 && ', '}
                              {formatted}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ============================================
// DEBUG: ALL SETS VIEW
// ============================================

function DebugAllSetsContent() {
  const allSets = useMemo(() => Object.values(getAllIOSets()), []);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, IOSet[]> = {};
    for (const set of allSets) {
      const key = set.category || 'unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(set);
    }
    // Sort sets within each group alphabetically
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.name.localeCompare(b.name));
    }
    return groups;
  }, [allSets]);

  const categoryOrder = ['uncommon', 'rare', 'purple', 'pvp', 'ato', 'event', 'universal', 'unknown'];
  const categoryLabels: Record<string, string> = {
    'uncommon': 'Uncommon',
    'rare': 'Rare',
    'purple': 'Very Rare (Purple)',
    'pvp': 'PvP',
    'ato': 'Archetype (ATO)',
    'event': 'Event',
    'universal': 'Universal',
    'unknown': 'Unknown Category',
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 bg-gray-800/50 rounded p-2">
        Debug view — showing all {allSets.length} IO sets. Scroll to visually check icons.
      </div>
      {categoryOrder.map((cat) => {
        const sets = grouped[cat];
        if (!sets || sets.length === 0) return null;
        return (
          <div key={cat}>
            <div className="text-sm font-semibold text-gray-300 mb-2 sticky top-0 bg-gray-900 py-1 z-10">
              {categoryLabels[cat] || cat} ({sets.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {sets.map((set) => (
                <div
                  key={set.id || set.name}
                  className="flex items-center gap-2 p-1.5 rounded bg-gray-800/40 border border-gray-700/50"
                >
                  <IOSetIcon icon={set.icon} category={set.category} size={32} alt={set.name} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-200 truncate">{set.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{set.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================



