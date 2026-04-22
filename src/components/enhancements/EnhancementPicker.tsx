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
  getIOSetsForPower, lookupPower,
  getCommonIOValueAtLevel, ORIGIN_TIERS,
  sortCategoriesByPriority,
  createIOSetEnhancement, createGenericIOEnhancement, createSpecialEnhancement, createOriginEnhancement,
  getAvailableGenericIOs, getAvailableHamidons, getAvailableTitans, getAvailableHydras, getAvailableDSyncs, getAvailablePrestige,
  getRarityColor, getTierTextColor, getTierBorderColor,
  findProcData, parseProcEffect, getProcEffectLabel, getProcEffectColor, isProcAlwaysOn, interpolateProcDamage,
} from '@/data';
import { normalizeAspectName, getAspectSchedule, getIOValueAtLevel, normalizeStatName, getTotalBonusCount, isBonusCapped, getSetRarityMultiplier, BOOST_MULTIPLIER_PER_LEVEL } from '@/utils/calculations';
import { getPairedStat } from '@/utils/calculations/set-bonuses';
import { useBonusTracking } from '@/hooks';
import { Modal, ModalBody } from '@/components/modals';
import { Tooltip, Toggle } from '@/components/ui';
import { IOSetIcon, GenericIOIcon, OriginEnhancementIcon, SpecialEnhancementIcon } from './EnhancementIcon';
import type { IOSet, IOSetPiece, EnhancementStatType, SpecialEnhancementDef, IOSetCategory, SpecialEnhancement, Enhancement } from '@/types';
import { getSetTrackedMatches } from '@/data/set-bonus-index';
import { getEnhancementOutline } from '@/utils/enhancement-outline';

type EnhancementTypeFilter = 'io-sets' | 'generic' | 'special' | 'origin';

// Sidebar filter can be 'all', a category name, or a special group
type SidebarFilter =
  | 'all'
  | 'universal'
  | 'very-rare'
  | 'event'
  | 'archetype'
  | 'procs'
  | string; // Category name like "Ranged Damage"

export function EnhancementPicker() {
  const picker = useUIStore((s) => s.enhancementPicker);
  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const attunementEnabled = useUIStore((s) => s.attunementEnabled);
  const toggleAttunement = useUIStore((s) => s.toggleAttunement);
  const setGlobalIOLevel = useUIStore((s) => s.setGlobalIOLevel);
  const globalBoostLevel = useUIStore((s) => s.globalBoostLevel);
  const setGlobalBoostLevel = useUIStore((s) => s.setGlobalBoostLevel);
  const ioSortBy = useUIStore((s) => s.ioSetSortBy);
  const setIOSortBy = useUIStore((s) => s.setIOSetSortBy);
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
    const findInPowers = (powers: { name: string; internalName: string; slots: (unknown | null)[] }[]) =>
      powers.find(p => p.internalName === picker.currentPowerName)?.slots || [];

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
  // When virtualSlots is set (compare modal), use those instead of the build's slots
  const emptySlotIndices = useMemo(() => {
    const slots = picker.virtualSlots ?? currentPowerSlots;
    const indices: number[] = [];
    for (let i = picker.currentSlotIndex; i < slots.length; i++) {
      if (!slots[i]) {
        indices.push(i);
      }
    }
    return indices;
  }, [currentPowerSlots, picker.currentSlotIndex, picker.virtualSlots]);

  // Get available IO sets for the current power based on its allowedSetCategories
  // ATO categories are already included in the power data for eligible powers
  const availableSets = useMemo(() => {
    if (!currentPower) return [];
    const categories = [...(currentPower.allowedSetCategories || [])] as IOSetCategory[];
    return getIOSetsForPower(categories);
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
  const hasProcs = useMemo(() =>
    availableSets.some((set) => set.pieces.some((p) => p.proc)), [availableSets]);

  // Helper to check if a set is a "special" category (excluded from normal filters)
  const isSpecialSet = (set: IOSet) =>
    set.category === 'purple' ||
    set.category === 'ato' ||
    set.category === 'event' ||
    set.category === 'pvp' ||
    set.type === 'Universal Damage Sets';

  // Sort priority for special categories (higher = sorted later)
  const specialSortOrder = (set: IOSet): number => {
    if (set.type === 'Universal Damage Sets') return 1;
    if (set.category === 'purple') return 2;
    if (set.category === 'event') return 3;
    if (set.category === 'pvp') return 4;
    if (set.category === 'ato') return 5;
    return 0;
  };

  const levelUpMode = useUIStore((s) => s.levelUpMode);

  // Filter sets based on sidebar selection, then sort
  const filteredSets = useMemo(() => {
    let sets: IOSet[];
    switch (sidebarFilter) {
      case 'all':
        sets = [...availableSets];
        break;
      case 'universal':
        sets = availableSets.filter((set) => set.type === 'Universal Damage Sets');
        break;
      case 'very-rare':
        sets = availableSets.filter((set) => set.category === 'purple');
        break;
      case 'event':
        sets = availableSets.filter((set) => set.category === 'event');
        break;
      case 'archetype':
        sets = availableSets.filter((set) => set.category === 'ato');
        break;
      case 'pvp':
        sets = availableSets.filter((set) => set.category === 'pvp');
        break;
      case 'procs':
        sets = availableSets.filter((set) => set.pieces.some((p) => p.proc));
        break;
      default:
        sets = availableSets.filter((set) => set.type === sidebarFilter && !isSpecialSet(set));
    }
    // Level Up mode: only show sets the character can use at their current level
    if (levelUpMode) {
      sets = sets.filter((set) => set.minLevel <= build.level);
    }
    if (sidebarFilter === 'all') {
      // In 'all' view, group standard sets first, then special sets at bottom
      if (ioSortBy === 'level') {
        sets.sort((a, b) => specialSortOrder(a) - specialSortOrder(b) || a.minLevel - b.minLevel || a.maxLevel - b.maxLevel || a.name.localeCompare(b.name));
      } else {
        sets.sort((a, b) => specialSortOrder(a) - specialSortOrder(b) || a.name.localeCompare(b.name));
      }
    } else if (ioSortBy === 'level') {
      sets = [...sets].sort((a, b) => a.minLevel - b.minLevel || a.maxLevel - b.maxLevel || a.name.localeCompare(b.name));
    } else {
      sets = [...sets].sort((a, b) => a.name.localeCompare(b.name));
    }
    return sets;
  }, [availableSets, sidebarFilter, ioSortBy, levelUpMode, build.level]);

  // Flat list of individual proc pieces for the Procs filter
  const procPieces = useMemo(() => {
    if (sidebarFilter !== 'procs') return [];
    const pieces: { set: IOSet; piece: IOSetPiece; pieceIndex: number }[] = [];
    for (const set of availableSets) {
      set.pieces.forEach((piece, idx) => {
        if (piece.proc) {
          pieces.push({ set, piece, pieceIndex: idx });
        }
      });
    }
    return pieces;
  }, [availableSets, sidebarFilter]);

  // Check if a specific set piece is already slotted in the current power
  // In compare mode (virtualSlots), check the comparison copy's slots instead of the build
  const isPieceInCurrentPower = (setId: string, pieceNum: number) => {
    const slots = picker.virtualSlots ?? currentPowerSlots;
    return slots.some((enh) => {
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
      // Default IO level to character level when picker opens
      setGlobalIOLevel(Math.max(10, build.level));
    }
    prevIsOpen.current = picker.isOpen;
  }, [picker.isOpen, primaryCategory, build.level, setGlobalIOLevel]);

  // Helper to create IO set enhancement via registry factory
  const makeIOSetEnhancement = (set: IOSet, piece: IOSetPiece, pieceIndex: number) => {
    const clampedLevel = Math.max(set.minLevel, Math.min(globalIOLevel, set.maxLevel));
    return createIOSetEnhancement(set, piece, pieceIndex, { attuned: attunementEnabled, level: clampedLevel, boost: globalBoostLevel });
  };

  // Unified placement: routes to override handler (Compare Slotting) or build store
  const placeEnhancement = (powerName: string, slotIndex: number, enhancement: Enhancement) => {
    if (picker.onOverrideSelect) {
      picker.onOverrideSelect(slotIndex, enhancement);
    } else {
      setEnhancement(powerName, slotIndex, enhancement, picker.currentPowerCategory as import('@/stores').PowerCategory | undefined);
    }
  };

  // Handle selecting an IO set piece (single click)
  const handleSelectSetPiece = (set: IOSet, piece: IOSetPiece, pieceIndex: number) => {
    if (!picker.currentPowerName) return;
    placeEnhancement(picker.currentPowerName, picker.currentSlotIndex, makeIOSetEnhancement(set, piece, pieceIndex));
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
        placeEnhancement(
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
        placeEnhancement(
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

  // Touch handlers — tap to select, drag across pieces to select range, long-press for multi-select
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchStartTime = useRef(0);
  const touchDragging = useRef(false);
  const LONG_PRESS_DURATION = 400; // ms — hold longer than this for multi-select

  const handlePieceTouchStart = (set: IOSet, pieceIndex: number, e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchStartTime.current = Date.now();
    touchDragging.current = false;
    // Start drag tracking (reuse mouse drag state)
    setIsDragging(true);
    setDragStartIndex(pieceIndex);
    setDragEndIndex(pieceIndex);
    setDragSet(set);
  };

  const handlePieceTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || dragStartIndex === null || !dragSet) return;
    const touch = e.touches[0];
    // Use elementFromPoint to find which piece is under the finger
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el) {
      const pieceButton = (el as HTMLElement).closest('[data-piece-index]') as HTMLElement | null;
      if (pieceButton) {
        const idx = parseInt(pieceButton.dataset.pieceIndex || '', 10);
        if (!isNaN(idx) && idx !== dragEndIndex) {
          touchDragging.current = true;
          setDragEndIndex(idx);
          e.preventDefault(); // Prevent scrolling during active drag selection
        }
      }
    }
  };

  const handlePieceTouchEnd = (set: IOSet, e: React.TouchEvent) => {
    if (!isDragging || dragStartIndex === null) {
      touchStartPos.current = null;
      return;
    }

    e.preventDefault(); // Prevent ghost click

    const startIdx = dragStartIndex;
    const endIdx = dragEndIndex ?? startIdx;

    // Reset drag state
    touchStartPos.current = null;
    setIsDragging(false);
    setDragStartIndex(null);
    setDragEndIndex(null);
    setDragSet(null);

    if (touchDragging.current && startIdx !== endIdx) {
      // Drag selection — select range of pieces
      handleDragSelect(set, startIdx, endIdx);
    } else {
      // Stationary tap — check for long-press or single select
      const elapsed = Date.now() - touchStartTime.current;
      if (elapsed >= LONG_PRESS_DURATION) {
        // Long press → toggle multi-select (mobile equivalent of shift+click)
        toggleShiftSelect(set, startIdx);
      } else if (hasShiftSelection && isShiftSelected(set, startIdx)) {
        // Tap on a selected piece → slot all multi-selected pieces
        handleSlotMultiSelect();
      } else if (set.pieces[startIdx]) {
        // Short tap → slot single piece immediately
        handleSelectSetPiece(set, set.pieces[startIdx], startIdx);
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
    placeEnhancement(picker.currentPowerName, picker.currentSlotIndex, createGenericIOEnhancement(stat, globalIOLevel, globalBoostLevel));
    closeEnhancementPicker();
  };

  // Handle selecting an origin enhancement
  const handleSelectOrigin = (stat: EnhancementStatType, tier: 'TO' | 'DO' | 'SO') => {
    if (!picker.currentPowerName) return;
    placeEnhancement(picker.currentPowerName, picker.currentSlotIndex, createOriginEnhancement(stat, tier, buildOrigin, globalBoostLevel));
    closeEnhancementPicker();
  };

  // Handle selecting a special enhancement (Hamidon, Titan, Hydra, D-Sync)
  const handleSelectSpecial = (id: string, def: SpecialEnhancementDef, category: SpecialEnhancement['category']) => {
    if (!picker.currentPowerName) return;
    placeEnhancement(picker.currentPowerName, picker.currentSlotIndex, createSpecialEnhancement(id, def, category, globalBoostLevel));
    closeEnhancementPicker();
  };

  // Get available generic IOs and special enhancements for this power (via registry)
  const availableGenericIOs = useMemo(() => getAvailableGenericIOs(currentPower ?? null), [currentPower]);
  const availableHamidons = useMemo(() => getAvailableHamidons(currentPower ?? null), [currentPower]);
  const availableTitans = useMemo(() => getAvailableTitans(currentPower ?? null), [currentPower]);
  const availableHydras = useMemo(() => getAvailableHydras(currentPower ?? null), [currentPower]);
  const availableDSyncs = useMemo(() => getAvailableDSyncs(currentPower ?? null), [currentPower]);
  const availablePrestige = useMemo(() => getAvailablePrestige(currentPower ?? null), [currentPower]);

  const ioValue = getCommonIOValueAtLevel(globalIOLevel);

  return (
    <Modal
      isOpen={picker.isOpen}
      onClose={closeEnhancementPicker}
      title={`Select Enhancement for ${currentPower?.name || picker.currentPowerName || 'Power'}`}
      size="full"
    >
      <ModalBody className="p-0">
        <div className="flex flex-col h-[80vh] sm:h-[70vh]">
        {/* Type filter tabs at top */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-700 bg-gray-900/50 flex-shrink-0">
          <div className="flex overflow-x-auto">
            {[
              { id: 'io-sets' as const, label: 'IO Sets', title: 'Set IOs that grant set bonuses when slotted together' },
              { id: 'generic' as const, label: 'Generic IO', title: 'Single-aspect Invention enhancements (no set bonuses)' },
              { id: 'special' as const, label: 'Special', title: 'Special enhancements: Hamidon Origin (HO), D-Sync, Titan, etc.' },
              { id: 'origin' as const, label: 'Origin', title: 'Training, Dual, and Single Origin enhancements' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setTypeFilter(tab.id);
                  setSidebarFilter('all');
                }}
                title={tab.title}
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
          {/* IO Level adjuster + Attunement toggle + Boost dial */}
          <div className="px-3 sm:px-4 py-1.5 sm:py-0 border-t sm:border-t-0 border-gray-700 flex items-center gap-4">
            <div
              className={`flex items-center gap-1.5 ${attunementEnabled ? 'opacity-40 pointer-events-none' : ''}`}
              title="Crafting level for IO enhancements (10–53). Higher level = stronger effect, but exemplaring below the level disables it."
            >
              <span className="text-xs text-gray-400">Lv</span>
              <button
                onClick={() => setGlobalIOLevel(globalIOLevel - 1)}
                title="Decrease IO crafting level"
                className="w-5 h-5 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={attunementEnabled || globalIOLevel <= 10}
              >-</button>
              <span className={`text-sm font-mono w-6 text-center ${attunementEnabled ? 'text-gray-500' : 'text-blue-400'}`}>
                {globalIOLevel}
              </span>
              <button
                onClick={() => setGlobalIOLevel(globalIOLevel + 1)}
                title="Increase IO crafting level"
                className="w-5 h-5 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={attunementEnabled || globalIOLevel >= 53}
              >+</button>
            </div>
            <Toggle
              id="attunement-toggle-picker"
              name="attunement"
              checked={attunementEnabled}
              onChange={toggleAttunement}
              label="Attuned"
              title="Attuned IOs scale with your current level — never lose effect when exemplaring."
            />
            <div
              className="flex items-center gap-1.5"
              title="Catalyst boost level (+0 to +5). Each boost increases enhancement strength."
            >
              <span className="text-xs text-gray-400">Boost</span>
              <button
                onClick={() => setGlobalBoostLevel(globalBoostLevel - 1)}
                title="Decrease catalyst boost level"
                className="w-5 h-5 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={globalBoostLevel === 0}
              >-</button>
              <span className={`text-sm font-mono w-6 text-center ${globalBoostLevel > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                +{globalBoostLevel}
              </span>
              <button
                onClick={() => setGlobalBoostLevel(globalBoostLevel + 1)}
                title="Increase catalyst boost level"
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
              title="Show every standard set category for this power"
            />
            {standardCategories.map((cat) => (
              <MobileCategoryButton
                key={cat}
                label={cat.replace(' Damage', '').replace(' Sets', '')}
                count={availableSets.filter((s) => s.type === cat && !isSpecialSet(s)).length}
                isActive={sidebarFilter === cat}
                onClick={() => setSidebarFilter(cat)}
                textColor={cat === primaryCategory ? 'text-yellow-400' : undefined}
                title={cat === primaryCategory ? `${cat} (this power's primary set category)` : cat}
              />
            ))}
            {hasUniversal && (
              <MobileCategoryButton
                label="Universal"
                count={availableSets.filter((s) => s.type === 'Universal Damage Sets').length}
                isActive={sidebarFilter === 'universal'}
                onClick={() => setSidebarFilter('universal')}
                title="Universal Damage sets — slot in any damaging power regardless of category"
              />
            )}
            {hasVeryRare && (
              <MobileCategoryButton
                label="Very Rare"
                count={availableSets.filter((s) => s.category === 'purple').length}
                isActive={sidebarFilter === 'very-rare'}
                onClick={() => setSidebarFilter('very-rare')}
                textColor="text-purple-400"
                title="Very Rare (Purple) sets — level 50 only, but always exemplar-safe"
              />
            )}
            {hasEvent && (
              <MobileCategoryButton
                label="Event"
                count={availableSets.filter((s) => s.category === 'event').length}
                isActive={sidebarFilter === 'event'}
                onClick={() => setSidebarFilter('event')}
                textColor="text-cyan-400"
                title="Event sets (Winter, Summer, Anniversary) — earned from seasonal events; attuned by default"
              />
            )}
            {hasArchetype && (
              <MobileCategoryButton
                label="ATO"
                count={availableSets.filter((s) => s.category === 'ato').length}
                isActive={sidebarFilter === 'archetype'}
                onClick={() => setSidebarFilter('archetype')}
                textColor="text-orange-400"
                title="Archetype Origin sets — exclusive to your AT, slottable from level 10"
              />
            )}
            {hasPvP && (
              <MobileCategoryButton
                label="PvP"
                count={availableSets.filter((s) => s.category === 'pvp').length}
                isActive={sidebarFilter === 'pvp'}
                onClick={() => setSidebarFilter('pvp')}
                textColor="text-red-400"
                title="PvP IO sets — earned through PvP zones/arenas; attuned by default"
              />
            )}
            {hasProcs && (
              <MobileCategoryButton
                label="Procs"
                count={availableSets.reduce((n, s) => n + s.pieces.filter((p) => p.proc).length, 0)}
                isActive={sidebarFilter === 'procs'}
                onClick={() => setSidebarFilter('procs')}
                textColor="text-amber-400"
                title="All proc enhancements (chance-for-X effects) across every set"
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
                title="Show every standard set category for this power"
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
                  title={cat === primaryCategory ? `${cat} (this power's primary set category)` : cat}
                />
              ))}

              {/* Universal Damage */}
              {hasUniversal && (
                <SidebarButton
                  label="Universal Damage"
                  count={availableSets.filter((s) => s.type === 'Universal Damage Sets').length}
                  isActive={sidebarFilter === 'universal'}
                  onClick={() => setSidebarFilter('universal')}
                  title="Universal Damage sets — slot in any damaging power regardless of category"
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
                  title="Very Rare (Purple) sets — level 50 only, but always exemplar-safe"
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
                  title="Event sets (Winter, Summer, Anniversary) — earned from seasonal events; attuned by default"
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
                  title="Archetype Origin sets — exclusive to your AT, slottable from level 10"
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
                  title="PvP IO sets — earned through PvP zones/arenas; attuned by default"
                />
              )}

              {/* Procs */}
              {hasProcs && (
                <SidebarButton
                  label="Procs"
                  count={availableSets.reduce((n, s) => n + s.pieces.filter((p) => p.proc).length, 0)}
                  isActive={sidebarFilter === 'procs'}
                  onClick={() => setSidebarFilter('procs')}
                  textColor="text-amber-400"
                  title="All proc enhancements (chance-for-X effects) across every set"
                />
              )}
            </div>
          )}

          {/* Main content area */}
          <div
            className="flex-1 overflow-y-auto p-2 pr-4 sm:p-3"
            onContextMenu={(e) => { if (e.shiftKey) e.preventDefault(); }}
          >
            {typeFilter === 'io-sets' && sidebarFilter === 'procs' && (
              <ProcsContent
                pieces={procPieces}
                attunementEnabled={attunementEnabled}
                globalIOLevel={globalIOLevel}
                isPieceInCurrentPower={isPieceInCurrentPower}
                onPieceMouseDown={handlePieceMouseDown}
                onPieceMouseUp={handlePieceMouseUp}
                onPieceTouchStart={handlePieceTouchStart}
                onPieceTouchMove={handlePieceTouchMove}
                onPieceTouchEnd={handlePieceTouchEnd}
                isShiftSelected={isShiftSelected}
                hasShiftSelection={hasShiftSelection}
              />
            )}
            {typeFilter === 'io-sets' && sidebarFilter !== 'procs' && (
              <div className="flex items-center justify-end gap-1 mb-2">
                <span className="text-xs text-gray-500 mr-1">Sort:</span>
                <button
                  onClick={() => setIOSortBy('name')}
                  className={`text-xs px-1.5 py-0.5 rounded ${ioSortBy === 'name' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  A-Z
                </button>
                <button
                  onClick={() => setIOSortBy('level')}
                  className={`text-xs px-1.5 py-0.5 rounded ${ioSortBy === 'level' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Level
                </button>
              </div>
            )}
            {typeFilter === 'io-sets' && sidebarFilter !== 'procs' && (
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
                availablePrestige={availablePrestige}
                onSelect={handleSelectSpecial}
              />
            )}

            {typeFilter === 'origin' && (
              <OriginContent
                availableTypes={availableGenericIOs}
                onSelect={handleSelectOrigin}
              />
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
  title?: string;
}

function SidebarButton({ label, count, isActive, onClick, textColor, title }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
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
  title?: string;
}

function MobileCategoryButton({ label, count, isActive, onClick, textColor, title }: MobileCategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
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

// ============================================
// PROCS FLAT LIST
// ============================================

interface ProcsContentProps {
  pieces: { set: IOSet; piece: IOSetPiece; pieceIndex: number }[];
  attunementEnabled: boolean;
  globalIOLevel: number;
  isPieceInCurrentPower: (setId: string, pieceNum: number) => boolean;
  onPieceMouseDown: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
  onPieceMouseUp: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
  onPieceTouchStart: (set: IOSet, pieceIndex: number, e: React.TouchEvent) => void;
  onPieceTouchMove: (e: React.TouchEvent) => void;
  onPieceTouchEnd: (set: IOSet, e: React.TouchEvent) => void;
  isShiftSelected: (set: IOSet, pieceIndex: number) => boolean;
  hasShiftSelection: boolean;
}

function ProcsContent({
  pieces,
  attunementEnabled,
  globalIOLevel,
  isPieceInCurrentPower,
  onPieceMouseDown,
  onPieceMouseUp,
  onPieceTouchStart,
  onPieceTouchMove,
  onPieceTouchEnd,
  isShiftSelected,
  hasShiftSelection,
}: ProcsContentProps) {
  const isUniqueEnhancementSlotted = useBuildStore((s) => s.isUniqueEnhancementSlotted);
  const isCompareMode = useUIStore((s) => s.enhancementPicker.virtualSlots) !== null;

  if (pieces.length === 0) {
    return <div className="text-center text-gray-500 py-8">No procs available for this power</div>;
  }

  return (
    <div className="space-y-1">
      <div className="text-right px-1 mb-1">
        <span className="hidden sm:inline text-xs text-gray-600">
          {hasShiftSelection ? 'Click selected to slot all' : 'Shift+click to multi-select'}
        </span>
        <span className="sm:hidden text-[10px] text-gray-600">
          {hasShiftSelection ? 'Tap selected to slot all' : 'Hold to multi-select'}
        </span>
      </div>
      {pieces.map(({ set, piece, pieceIndex }) => {
        const setId = set.id || set.name;
        const outline = getEnhancementOutline(
          { name: piece.name, proc: piece.proc, unique: piece.unique },
          set.name,
        );

        // Check disabled state
        // In compare mode, skip build-wide unique check — each configuration is independent
        let disabledReason: string | null = null;
        if (isPieceInCurrentPower(setId, piece.num)) {
          disabledReason = 'Already in this power';
        } else if (!isCompareMode) {
          const isSpecialRarity = set.category === 'purple' || set.category === 'event' || set.category === 'ato';
          if ((piece.unique || isSpecialRarity) && isUniqueEnhancementSlotted(setId, piece.num)) {
            disabledReason = 'Already slotted in build';
          }
        }
        const isDisabled = !!disabledReason;

        // Get proc effect info
        const procData = findProcData(piece.name, set.name);
        const procEffect = procData ? parseProcEffect(procData.mechanics) : null;
        const procLabel = procEffect ? getProcEffectLabel(procEffect.category) : null;
        const procColor = procEffect ? getProcEffectColor(procEffect.category) : outline.color;

        const shiftSel = isShiftSelected(set, pieceIndex);

        const tooltipContent = procData && procEffect ? (
          <div className="space-y-1 text-xs">
            <div className="text-slate-300">{procData.mechanics}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {procData.ppm !== null && (
                <span>
                  <span className="text-slate-400">PPM:</span>
                  <span className="text-amber-300 ml-1 font-medium">{procData.ppm}</span>
                </span>
              )}
              <span>
                <span className="text-slate-400">Type:</span>
                <span className={`ml-1 ${
                  procData.type === 'Proc120s' ? 'text-purple-400' :
                  procData.type === 'Global' ? 'text-green-400' :
                  'text-amber-300'
                }`}>
                  {procData.type === 'Proc120s' ? '100% (120s)' : procData.type}
                </span>
              </span>
              {procEffect.category === 'Damage' && procEffect.value !== undefined && procEffect.valueMax !== undefined && (
                <span>
                  <span className="text-slate-400">Dmg:</span>
                  <span className="text-red-400 ml-1">
                    {interpolateProcDamage(procEffect.value, procEffect.valueMax, procData.levelRange, globalIOLevel)} {procEffect.effectType}
                  </span>
                </span>
              )}
              {procEffect.value !== undefined && procEffect.category !== 'Damage' && (
                <span>
                  <span className="text-slate-400">Value:</span>
                  <span className="ml-1" style={{ color: procColor }}>
                    {procEffect.category === 'KnockbackProtection' ? `Mag ${procEffect.value}` :
                     procEffect.category === 'Stealth' ? `${procEffect.value} ft` :
                     `${procEffect.value}%`}
                    {procEffect.effectType ? ` ${procEffect.effectType}` : ''}
                  </span>
                </span>
              )}
              {isProcAlwaysOn(procData) && (
                <span className="text-green-400">Always On</span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-300">{piece.name}</div>
        );

        return (
          <Tooltip key={`${setId}-${piece.num}`} content={tooltipContent} position="right" className="!max-w-sm" triggerClassName="block">
          <button
            onMouseDown={(e) => !isDisabled && onPieceMouseDown(set, pieceIndex, e)}
            onMouseUp={(e) => !isDisabled && onPieceMouseUp(set, pieceIndex, e)}
            onTouchStart={(e) => !isDisabled && onPieceTouchStart(set, pieceIndex, e)}
            onTouchMove={(e) => !isDisabled && onPieceTouchMove(e)}
            onTouchEnd={(e) => !isDisabled && onPieceTouchEnd(set, e)}
            disabled={isDisabled}
            className={`w-full flex items-center gap-2 p-2 rounded border transition-all ${
              isDisabled
                ? 'border-gray-700 opacity-40 cursor-not-allowed bg-gray-900/30'
                : shiftSel
                  ? 'border-green-400 bg-green-900/20 ring-1 ring-green-400/50'
                  : 'border-gray-600 bg-gray-800/40 hover:border-blue-400 hover:bg-blue-900/10'
            }`}
            style={{ touchAction: 'pan-y' }}
          >
            {/* Set icon */}
            <div className="relative flex-shrink-0">
              <IOSetIcon
                icon={set.icon || 'Unknown.png'}
                attuned={attunementEnabled}
                category={set.category}
                size={30}
                alt={piece.name}
                className="pointer-events-none"
              />
              {outline.show && (
                <div
                  className="absolute -top-0.5 right-0.5 w-2 h-2 rounded-full border border-gray-900 pointer-events-none"
                  style={{
                    background: outline.secondaryColor
                      ? `linear-gradient(135deg, ${outline.color} 50%, ${outline.secondaryColor} 50%)`
                      : outline.color,
                  }}
                />
              )}
            </div>

            {/* Piece info */}
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-gray-200 truncate">
                {piece.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {set.name}
                <span className="text-gray-600"> · Lv {set.minLevel}-{set.maxLevel}</span>
              </div>
            </div>

            {/* Proc badge */}
            <div className="flex-shrink-0 text-right">
              <span className="text-xs font-medium" style={{ color: procColor }}>
                {procLabel || 'Proc'}
              </span>
              {disabledReason && (
                <div className="text-xs text-orange-400">{disabledReason}</div>
              )}
            </div>
          </button>
          </Tooltip>
        );
      })}
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
  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const isUniqueEnhancementSlotted = useBuildStore((s) => s.isUniqueEnhancementSlotted);
  const isCompareMode = useUIStore((s) => s.enhancementPicker.virtualSlots) !== null;
  const trackedStats = useUIStore((s) => s.trackedStats);

  // Level gating: set is unavailable if IO level is outside its range
  const isLevelGated = !attunementEnabled && (set.minLevel > globalIOLevel || set.maxLevel < globalIOLevel);

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
  // In compare mode, skip build-wide unique check — each configuration is independent
  const isPieceDisabled = (piece: IOSetPiece) => {
    const setId = set.id || set.name;
    // Always prevent duplicate of the same piece in the same power
    if (isPieceInCurrentPower(setId, piece.num)) return 'Already in this power';
    // Unique pieces and special rarity sets: prevent across entire build (not in compare mode)
    if (!isCompareMode) {
      const isSpecialRarity = set.category === 'purple' || set.category === 'event' || set.category === 'ato';
      if ((piece.unique || isSpecialRarity) && isUniqueEnhancementSlotted(setId, piece.num)) {
        return 'Already slotted in build';
      }
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
        {isLevelGated && (
          <span className="text-[10px] text-orange-400">
            (will slot at Lv {globalIOLevel < set.minLevel ? set.minLevel : set.maxLevel})
          </span>
        )}
        <span className="hidden sm:inline text-xs text-gray-600 ml-auto">
          {hasShiftSelection ? 'Tap selected to slot all' : 'Shift+click or long-press to multi-select'}
        </span>
        <span className="sm:hidden text-[10px] text-gray-600 ml-auto">
          {hasShiftSelection ? 'Tap selected to slot all' : 'Hold to multi-select'}
        </span>
      </div>

      {/* Pieces as icons — hidden on mobile, shown on sm+ */}
      <div className="hidden sm:flex flex-wrap gap-1.5 sm:gap-1 select-none">
        {set.pieces.map((piece, pieceIndex) => {
          const dragSelected = isPieceSelected(pieceIndex);
          const shiftSel = isShiftSelected(set, pieceIndex);
          const disabledReason = isPieceDisabled(piece);
          const isDisabled = !!disabledReason;
          return (
            <Tooltip
              key={pieceIndex}
              content={
                <div>
                  {isDisabled && <div className="text-orange-400 text-xs font-medium mb-1">{disabledReason}</div>}
                  <SetPieceTooltip set={set} piece={piece} />
                </div>
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
                className={`relative w-10 h-10 sm:w-[30px] sm:h-[30px] rounded border transition-all bg-gray-900/50 ${
                  isDisabled
                    ? 'border-gray-700 opacity-40 cursor-not-allowed'
                    : shiftSel
                      ? 'border-green-400 scale-110 ring-2 ring-green-400/50'
                      : dragSelected
                        ? 'border-blue-400 scale-110 ring-2 ring-blue-400/50'
                        : 'border-gray-600 hover:border-blue-400 hover:scale-110'
                }`}
                style={{ touchAction: 'pan-y' }}
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

      {/* Pieces as list — shown on mobile, hidden on sm+ */}
      <div className="sm:hidden space-y-1 select-none mt-1 mr-2">
        {set.pieces.map((piece, pieceIndex) => {
          const selected = isPieceSelected(pieceIndex);
          const shiftSel = isShiftSelected(set, pieceIndex);
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
                  : shiftSel
                    ? 'border-green-400 bg-green-900/20 ring-1 ring-green-400/50'
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
              className="rounded border border-gray-600 hover:border-blue-400 hover:scale-110 transition-all bg-gray-900/50 flex flex-col items-center w-[46px] py-0.5"
            >
              <GenericIOIcon stat={stat} size={30} alt={stat} />
              <span className="text-[8px] text-gray-400 leading-tight truncate w-full text-center">{stat}</span>
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
  availablePrestige: [string, SpecialEnhancementDef][];
  onSelect: (id: string, def: SpecialEnhancementDef, category: SpecialEnhancement['category']) => void;
}

/** Overrides for compound-word IDs whose simple capitalize doesn't match the icon filename */
const SPECIAL_ICON_OVERRIDES: Record<string, string> = {
  antiproton: 'AntiProton',
  clockwork_efficiency: 'ClockworkEfficiency',
  might_of_the_empire: 'MarkoftheEmpire',
  resistance_tactics: 'ResistanceTactics',
  syndicate_techniques: 'SyndicateTechniques',
  will_of_the_seers: 'WilloftheSeers',
};

const SPECIAL_SECTIONS: Array<{
  category: SpecialEnhancement['category'];
  label: string;
  color: string;
  borderColor: string;
  iconPrefix: string;
  key: 'availableHamidons' | 'availableTitans' | 'availableHydras' | 'availableDSyncs' | 'availablePrestige';
}> = [
  { category: 'hamidon', label: 'Hamidon Origin', color: 'text-purple-400', borderColor: 'border-purple-700 hover:border-purple-400', iconPrefix: 'HO', key: 'availableHamidons' },
  { category: 'titan', label: 'Titan Origin', color: 'text-amber-400', borderColor: 'border-amber-700 hover:border-amber-400', iconPrefix: 'TN', key: 'availableTitans' },
  { category: 'hydra', label: 'Hydra Origin', color: 'text-cyan-400', borderColor: 'border-cyan-700 hover:border-cyan-400', iconPrefix: 'HY', key: 'availableHydras' },
  { category: 'd-sync', label: 'D-Sync Origin', color: 'text-green-400', borderColor: 'border-green-700 hover:border-green-400', iconPrefix: 'DS', key: 'availableDSyncs' },
  { category: 'prestige', label: 'Prestige', color: 'text-rose-400', borderColor: 'border-rose-700 hover:border-rose-400', iconPrefix: 'Prestige_', key: 'availablePrestige' },
];

function SpecialContent(props: SpecialContentProps) {
  const { onSelect } = props;
  const totalAvailable = props.availableHamidons.length + props.availableTitans.length + props.availableHydras.length + props.availableDSyncs.length + props.availablePrestige.length;

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
                // D-Sync enhancements all share a single icon; others use prefix + capitalized ID
                const iconName = section.category === 'd-sync'
                  ? 'DSO_all.png'
                  : `${section.iconPrefix}${SPECIAL_ICON_OVERRIDES[id] ?? (id.charAt(0).toUpperCase() + id.slice(1))}.png`;
                return (
                  <Tooltip key={id} content={`${def.name}: ${def.aspects.map(a => `${a.stat} +${a.value}%`).join(', ')}`}>
                    <button
                      onClick={() => onSelect(id, def, section.category)}
                      className={`rounded border ${section.borderColor} hover:scale-110 transition-all bg-gray-900/50`}
                    >
                      <SpecialEnhancementIcon icon={iconName} size={30} alt={def.name} />
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
                  className={`rounded border hover:scale-110 transition-all bg-gray-900/50 flex flex-col items-center w-[46px] py-0.5 ${getTierBorderColor(tier.short)}`}
                >
                  <OriginEnhancementIcon
                    stat={stat}
                    tier={tier.short as 'TO' | 'DO' | 'SO'}
                    origin={buildOrigin}
                    size={30}
                    alt={`${stat} ${tier.short}`}
                  />
                  <span className="text-[8px] text-gray-400 leading-tight truncate w-full text-center">{stat}</span>
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
  const bonusTracking = useBonusTracking();

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
    const findPower = (powers: { name: string; internalName: string; slots: (unknown | null)[] }[]) =>
      powers.find(p => p.internalName === picker.currentPowerName);

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
  // Attuned IOs scale to character level (no maxLevel cap — that only applies to non-attuned)
  const rawLevel = attunementEnabled ? (build.level || 50) : globalIOLevel;
  const effectiveLevel = attunementEnabled
    ? Math.max(set.minLevel, rawLevel)
    : Math.max(set.minLevel, Math.min(rawLevel, set.maxLevel));
  const rawAspectCount = piece.aspects.filter(a => normalizeAspectName(a) !== null).length || piece.aspects.length;
  // Proc effects count as 3 additional aspects for the multi-aspect modifier
  const aspectCount = piece.proc ? rawAspectCount + 3 : rawAspectCount;
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

  // Boost multiplier — pure procs (no aspects) can't be boosted, but hybrid procs can
  const isPureProc = piece.proc && piece.aspects.length === 0;
  const boostMultiplier = (!isPureProc && globalBoostLevel > 0) ? 1 + globalBoostLevel * BOOST_MULTIPLIER_PER_LEVEL : 1;

  // Purple and Superior sets get 25% higher enhancement values
  const rarityMultiplier = getSetRarityMultiplier(set.category, set.name);

  const calculateAspectValue = (aspect: string): number | null => {
    const normalized = normalizeAspectName(aspect);
    if (!normalized) return null;
    const schedule = getAspectSchedule(normalized);
    const baseValue = getIOValueAtLevel(effectiveLevel, schedule);
    return baseValue * aspectModifier * rarityMultiplier * boostMultiplier;
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
                        <span className="text-red-400 ml-1">
                          {interpolateProcDamage(effect.value, effect.valueMax, procData.levelRange, globalIOLevel)} {effect.effectType}
                        </span>
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
            <>Level: <span className="text-slate-200">{effectiveLevel}</span>
              {effectiveLevel !== globalIOLevel && (
                <span className="text-orange-400 ml-1">({effectiveLevel < globalIOLevel ? 'max' : 'min'})</span>
              )}
            </>
          )}
        </span>
        <span className="text-slate-400">Range: {set.minLevel}-{set.maxLevel}</span>
        {!(piece.proc && piece.aspects.length === 0) && globalBoostLevel > 0 && <span className="text-green-400">+{globalBoostLevel} Boosted</span>}
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
                      const totalCount = (isActive && normalized) ? getTotalBonusCount(bonusTracking, normalized, eff.value) : 0;
                      const capped = (isActive && normalized) ? isBonusCapped(bonusTracking, normalized, eff.value) : false;
                      // Use eff.value for accurate display instead of pre-rounded eff.desc
                      const displayValue = parseFloat(eff.value.toFixed(2));
                      const formatted = eff.desc.replace(/^\+[\d.]+%/, `+${displayValue}%`);
                      return (
                        <span key={i} className={capped ? 'text-orange-400 font-semibold' : isTracked ? 'text-blue-300 font-semibold' : ''}>
                          {i > 0 && ', '}
                          {formatted}
                          {isActive && totalCount > 0 && (
                            <span className={`ml-0.5 text-[9px] ${capped ? 'text-orange-400' : 'text-slate-500'}`}>
                              ({totalCount}/5)
                            </span>
                          )}
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
                          const displayValue = parseFloat(eff.value.toFixed(2));
                          const formatted = eff.desc.replace(/^\+[\d.]+%/, `+${displayValue}%`);
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
// HELPER FUNCTIONS
// ============================================



