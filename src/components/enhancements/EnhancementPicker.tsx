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
  getIOSetsForPower, getPower, getPowerPool, getEpicPool, getInherentPowerDef,
  getCommonIOValueAtLevel, ORIGIN_TIERS,
  sortCategoriesByPriority,
  createIOSetEnhancement, createGenericIOEnhancement, createSpecialEnhancement, createOriginEnhancement,
  getAvailableGenericIOs, getAvailableHamidons,
  getRarityColor, getTierTextColor, getTierBorderColor,
} from '@/data';
import { Modal, ModalBody } from '@/components/modals';
import { Tooltip, Toggle } from '@/components/ui';
import { IOSetIcon, GenericIOIcon, OriginEnhancementIcon, SpecialEnhancementIcon } from './EnhancementIcon';
import type { IOSet, IOSetPiece, EnhancementStatType, HamidonEnhancementDef, IOSetCategory } from '@/types';
import { getSetTrackedMatches } from '@/data/set-bonus-index';

type EnhancementTypeFilter = 'io-sets' | 'generic' | 'special' | 'origin';

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

  // Get the current power definition
  const currentPower = useMemo(() => {
    if (!picker.currentPowerName || !picker.currentPowerSet) return null;

    // Check for inherent powers first (Fitness, Basic, Prestige, Archetype inherents)
    if (picker.currentPowerSet === 'Inherent') {
      const inherentDef = getInherentPowerDef(picker.currentPowerName);
      if (inherentDef) {
        // Convert InherentPowerDef to a compatible Power-like object
        return {
          name: inherentDef.name,
          icon: inherentDef.icon,
          available: 0,
          powerType: inherentDef.powerType || 'Auto',
          maxSlots: inherentDef.maxSlots || 6,
          allowedEnhancements: inherentDef.allowedEnhancements || [],
          allowedSetCategories: inherentDef.allowedSetCategories || [],
        };
      }
      return null;
    }

    // Try regular powerset
    let power = getPower(picker.currentPowerSet, picker.currentPowerName);
    if (!power) {
      // Try power pool
      const pool = getPowerPool(picker.currentPowerSet);
      power = pool?.powers.find((p) => p.name === picker.currentPowerName);
    }
    if (!power) {
      // Try epic/patron pool
      const epicPool = getEpicPool(picker.currentPowerSet);
      power = epicPool?.powers.find((p) => p.name === picker.currentPowerName);
    }
    return power;
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
      if (set.category === 'io-set' && set.type !== 'Universal Damage Sets') {
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

  // Helper to check if a set is a "special" category (excluded from normal filters)
  const isSpecialSet = (set: IOSet) =>
    set.category === 'purple' ||
    set.category === 'ato' ||
    set.category === 'event' ||
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
      default:
        // It's a category name - only show standard sets of that type
        return availableSets.filter((set) => set.type === sidebarFilter && !isSpecialSet(set));
    }
  }, [availableSets, sidebarFilter]);

  // Auto-select primary category when modal opens
  const prevIsOpen = useRef(false);
  useEffect(() => {
    if (picker.isOpen && !prevIsOpen.current && primaryCategory) {
      setSidebarFilter(primaryCategory);
    }
    prevIsOpen.current = picker.isOpen;
  }, [picker.isOpen, primaryCategory]);

  // Helper to create IO set enhancement via registry factory
  const makeIOSetEnhancement = (set: IOSet, piece: IOSetPiece, pieceIndex: number) =>
    createIOSetEnhancement(set, piece, pieceIndex, { attuned: attunementEnabled, level: globalIOLevel });

  // Handle selecting an IO set piece (single click)
  const handleSelectSetPiece = (set: IOSet, piece: IOSetPiece, pieceIndex: number) => {
    if (!picker.currentPowerName) return;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, makeIOSetEnhancement(set, piece, pieceIndex));
    closeEnhancementPicker();
  };

  // Handle shift+click to slot entire set (or as many pieces as will fit)
  const handleSlotEntireSet = (set: IOSet) => {
    if (!picker.currentPowerName) return;

    // Get empty slots starting from current slot
    const slotsToFill = emptySlotIndices.slice(0, set.pieces.length);
    if (slotsToFill.length === 0) return;

    // Fill slots with set pieces
    set.pieces.forEach((piece, pieceIndex) => {
      if (pieceIndex < slotsToFill.length) {
        setEnhancement(
          picker.currentPowerName!,
          slotsToFill[pieceIndex],
          makeIOSetEnhancement(set, piece, pieceIndex)
        );
      }
    });

    closeEnhancementPicker();
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
  const handlePieceMouseDown = (set: IOSet, pieceIndex: number) => {
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
    if (isDragging && dragStartIndex !== null && dragSet?.id === set.id) {
      const start = dragStartIndex;
      const end = pieceIndex;

      // If it was just a click (no drag), check for shift
      if (start === end) {
        if (e.shiftKey) {
          handleSlotEntireSet(set);
        } else {
          handleSelectSetPiece(set, set.pieces[pieceIndex], pieceIndex);
        }
      } else {
        // It was a drag selection
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
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, createGenericIOEnhancement(stat, globalIOLevel));
    closeEnhancementPicker();
  };

  // Handle selecting an origin enhancement
  const handleSelectOrigin = (stat: EnhancementStatType, tier: 'TO' | 'DO' | 'SO') => {
    if (!picker.currentPowerName) return;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, createOriginEnhancement(stat, tier, buildOrigin));
    closeEnhancementPicker();
  };

  // Handle selecting a special (Hamidon) enhancement
  const handleSelectSpecial = (id: string, hami: HamidonEnhancementDef) => {
    if (!picker.currentPowerName) return;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, createSpecialEnhancement(id, hami));
    closeEnhancementPicker();
  };

  // Get available generic IOs and Hamidon enhancements for this power (via registry)
  const availableGenericIOs = useMemo(() => getAvailableGenericIOs(currentPower ?? null), [currentPower]);
  const availableHamidons = useMemo(() => getAvailableHamidons(currentPower ?? null), [currentPower]);

  const ioValue = getCommonIOValueAtLevel(globalIOLevel);

  return (
    <Modal
      isOpen={picker.isOpen}
      onClose={closeEnhancementPicker}
      title={`Select Enhancement for ${picker.currentPowerName || 'Power'}`}
      size="xl"
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
          {/* Attunement toggle */}
          <div className="px-3 sm:px-4 py-1.5 sm:py-0 border-t sm:border-t-0 border-gray-700">
            <Toggle
              id="attunement-toggle-picker"
              name="attunement"
              checked={attunementEnabled}
              onChange={toggleAttunement}
              label="Attuned"
            />
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
  onPieceMouseDown: (set: IOSet, pieceIndex: number) => void;
  onPieceMouseEnter: (pieceIndex: number) => void;
  onPieceMouseUp: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
  onPieceTouchStart: (set: IOSet, pieceIndex: number, e: React.TouchEvent) => void;
  onPieceTouchMove: (e: React.TouchEvent) => void;
  onPieceTouchEnd: (set: IOSet, e: React.TouchEvent) => void;
  isDragging: boolean;
  dragSet: IOSet | null;
  dragStartIndex: number | null;
  dragEndIndex: number | null;
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
        />
      ))}
    </div>
  );
}

interface IOSetRowProps {
  set: IOSet;
  onPieceMouseDown: (set: IOSet, pieceIndex: number) => void;
  onPieceMouseEnter: (pieceIndex: number) => void;
  onPieceMouseUp: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
  onPieceTouchStart: (set: IOSet, pieceIndex: number, e: React.TouchEvent) => void;
  onPieceTouchMove: (e: React.TouchEvent) => void;
  onPieceTouchEnd: (set: IOSet, e: React.TouchEvent) => void;
  isDragging: boolean;
  dragStartIndex: number | null;
  dragEndIndex: number | null;
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

  // Check if a piece is in the current drag selection
  const isPieceSelected = (pieceIndex: number) => {
    if (!isDragging || dragStartIndex === null || dragEndIndex === null) return false;
    const min = Math.min(dragStartIndex, dragEndIndex);
    const max = Math.max(dragStartIndex, dragEndIndex);
    return pieceIndex >= min && pieceIndex <= max;
  };

  // Check if a piece is already slotted (unique pieces, or any piece from purple/event/ato sets)
  const isAlreadySlotted = (piece: IOSetPiece) => {
    const isSpecialRarity = set.category === 'purple' || set.category === 'event' || set.category === 'ato';
    if (!piece.unique && !isSpecialRarity) return false;
    const setId = set.id || set.name;
    return isUniqueEnhancementSlotted(setId, piece.num);
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
        <span className="hidden sm:inline text-xs text-gray-600 ml-auto">Shift+click to slot all</span>
      </div>

      {/* Pieces as icons - Desktop view */}
      <div className="hidden lg:flex flex-wrap gap-1 select-none">
        {set.pieces.map((piece, pieceIndex) => {
          const selected = isPieceSelected(pieceIndex);
          const isDisabled = isAlreadySlotted(piece);
          return (
            <Tooltip
              key={pieceIndex}
              content={
                isDisabled
                  ? <div className="text-orange-400">Already slotted in build</div>
                  : <SetPieceTooltip set={set} piece={piece} />
              }
            >
              <button
                data-piece-index={pieceIndex}
                onMouseDown={() => !isDisabled && onPieceMouseDown(set, pieceIndex)}
                onMouseEnter={() => !isDisabled && onPieceMouseEnter(pieceIndex)}
                onMouseUp={(e) => !isDisabled && onPieceMouseUp(set, pieceIndex, e)}
                onTouchStart={(e) => !isDisabled && onPieceTouchStart(set, pieceIndex, e)}
                onTouchMove={(e) => !isDisabled && onPieceTouchMove(e)}
                onTouchEnd={(e) => !isDisabled && onPieceTouchEnd(set, e)}
                disabled={isDisabled}
                className={`w-9 h-9 rounded border transition-all bg-gray-900/50 touch-none ${
                  isDisabled
                    ? 'border-gray-700 opacity-40 cursor-not-allowed'
                    : selected
                      ? 'border-blue-400 scale-110 ring-2 ring-blue-400/50'
                      : 'border-gray-600 hover:border-blue-400 hover:scale-110'
                }`}
              >
                <IOSetIcon
                  icon={set.icon || 'Unknown.png'}
                  attuned={attunementEnabled}
                  size={36}
                  alt={piece.name}
                  className="pointer-events-none"
                />
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Pieces as list - Mobile view */}
      <div className="lg:hidden space-y-1 select-none">
        {set.pieces.map((piece, pieceIndex) => {
          const selected = isPieceSelected(pieceIndex);
          const isDisabled = isAlreadySlotted(piece);
          return (
            <button
              key={pieceIndex}
              data-piece-index={pieceIndex}
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
              <div className="flex-shrink-0">
                <IOSetIcon
                  icon={set.icon || 'Unknown.png'}
                  attuned={attunementEnabled}
                  size={40}
                  alt={piece.name}
                  className="pointer-events-none"
                />
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
                  <div className="text-xs text-green-400">Proc Effect</div>
                )}
                {piece.unique && (
                  <div className="text-xs text-orange-400">
                    {isDisabled ? 'Already slotted' : 'Unique'}
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
              <GenericIOIcon stat={stat} size={36} alt={stat} />
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
  availableHamidons: [string, HamidonEnhancementDef][];
  onSelect: (id: string, hami: HamidonEnhancementDef) => void;
}

function SpecialContent({ availableHamidons, onSelect }: SpecialContentProps) {
  if (availableHamidons.length === 0) {
    return <div className="text-center text-gray-500 py-8">No special enhancements available for this power</div>;
  }

  return (
    <div className="bg-gray-800/40 rounded-lg p-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-purple-400">Hamidon Origin</span>
        <span className="text-xs text-gray-500">+50% to two stats</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {availableHamidons.map(([id, hami]) => {
          // Capitalize the ID for the icon filename (nucleolus -> Nucleolus)
          const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
          return (
            <Tooltip key={id} content={`${hami.name}: ${hami.aspects.join(' / ')} +${hami.value}%`}>
              <button
                onClick={() => onSelect(id, hami)}
                className="rounded border border-purple-700 hover:border-purple-400 hover:scale-110 transition-all bg-gray-900/50"
              >
                <SpecialEnhancementIcon icon={`HO${capitalizedId}.png`} size={36} alt={hami.name} />
              </button>
            </Tooltip>
          );
        })}
      </div>
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
                    size={36}
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
  return (
    <div className="max-w-xs">
      <div className="font-medium text-yellow-400">{piece.name}</div>
      <div className="text-sm text-gray-300">{set.name}</div>
      <div className="text-xs text-gray-400 mt-1">
        Level {set.minLevel}-{set.maxLevel} • {piece.aspects.join(', ')}
      </div>
      {piece.proc && <div className="text-xs text-green-400 mt-1">Proc Effect</div>}
      {piece.unique && <div className="text-xs text-orange-400">Unique</div>}
      {set.bonuses.length > 0 && (
        <div className="text-xs text-gray-400 mt-2 border-t border-gray-600 pt-1">
          <div className="text-gray-500">Set Bonuses:</div>
          {set.bonuses.map((b, i) => (
            <div key={i}>{b.pieces}pc: {b.effects.map(e => `${e.stat} +${formatBonusValue(e.value)}`).join(', ')}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Format a number to at most 2 decimal places, removing trailing zeros */
function formatBonusValue(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded}%`;
}

