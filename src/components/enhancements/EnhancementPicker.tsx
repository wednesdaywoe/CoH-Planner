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
import { getIOSetsForPower, getPower, getPowerPool } from '@/data';
import { COMMON_IO_TYPES, getCommonIOValueAtLevel, ORIGIN_TIERS, HAMIDON_ENHANCEMENTS } from '@/data/enhancements';
import { resolvePath } from '@/utils/paths';
import { Modal, ModalBody } from '@/components/modals';
import { Tooltip, Toggle } from '@/components/ui';
import { IOSetIcon, GenericIOIcon, OriginEnhancementIcon, SpecialEnhancementIcon } from './EnhancementIcon';
import type { IOSet, IOSetPiece, EnhancementStatType, GenericIOEnhancement, OriginEnhancement, SpecialEnhancement, IOSetCategory } from '@/types';

type EnhancementTypeFilter = 'io-sets' | 'generic' | 'special' | 'origin';

// Sidebar filter can be 'all', a category name, or a special group
type SidebarFilter =
  | 'all'
  | 'universal'
  | 'very-rare'
  | 'event'
  | 'archetype'
  | string; // Category name like "Ranged Damage"

// ============================================
// CATEGORY PRIORITY MAPPING
// ============================================

/**
 * Maps power's allowedSetCategories to a priority-sorted list.
 * The first category in this list that matches a power's allowed categories
 * should be shown first. This handles the case where a power like "Smite"
 * accepts both Melee Damage and ToHit Debuff sets - Melee Damage should appear first.
 */
const CATEGORY_PRIORITY: IOSetCategory[] = [
  // Primary damage categories (most common expectation)
  'Ranged Damage',
  'Melee Damage',
  'Ranged AoE Damage',
  'Melee AoE Damage',
  'Sniper Attacks',
  'Pet Damage',
  'Recharge Intensive Pets',
  // Defense/Resistance (for defensive powers)
  'Defense Sets',
  'Resist Damage',
  // Control (for mez powers)
  'Holds',
  'Stuns',
  'Immobilize',
  'Sleep',
  'Confuse',
  'Fear',
  'Knockback',
  // Support primary categories
  'Healing',
  'To Hit Buff',
  // Debuff categories (often secondary effects)
  'To Hit Debuff',
  'Defense Debuff',
  'Accurate To-Hit Debuff',
  'Accurate Defense Debuff',
  'Slow Movement',
  // Other support
  'Endurance Modification',
  'Threat Duration',
  'Accurate Healing',
  // Travel (usually specific travel powers)
  'Running',
  'Running & Sprints',
  'Leaping',
  'Leaping & Sprints',
  'Flight',
  'Teleport',
  'Universal Travel',
  // Universal sets (lowest priority - always available)
  'Universal Damage Sets',
  // Archetype sets (usually shown separately)
  'Blaster Archetype Sets',
  'Brute Archetype Sets',
  'Controller Archetype Sets',
  'Corruptor Archetype Sets',
  'Defender Archetype Sets',
  'Dominator Archetype Sets',
  'Mastermind Archetype Sets',
  'Scrapper Archetype Sets',
  'Stalker Archetype Sets',
  'Tanker Archetype Sets',
  'Sentinel Archetype Sets',
  'Kheldian Archetype Sets',
  'Soldiers of Arachnos Archetype Sets',
];

/**
 * Sort categories by priority for the sidebar display.
 * Categories that appear earlier in CATEGORY_PRIORITY are shown first.
 */
function sortCategoriesByPriority(categories: string[]): string[] {
  return categories.sort((a, b) => {
    const aIndex = CATEGORY_PRIORITY.indexOf(a as IOSetCategory);
    const bIndex = CATEGORY_PRIORITY.indexOf(b as IOSetCategory);
    // If not found in priority list, put at the end
    const aPriority = aIndex === -1 ? 999 : aIndex;
    const bPriority = bIndex === -1 ? 999 : bIndex;
    return aPriority - bPriority;
  });
}

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
    let power = getPower(picker.currentPowerSet, picker.currentPowerName);
    if (!power) {
      const pool = getPowerPool(picker.currentPowerSet);
      power = pool?.powers.find((p) => p.name === picker.currentPowerName);
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
    return getIOSetsForPower(currentPower.allowedSetCategories);
  }, [currentPower]);

  // Determine the primary category for this power (first in priority order)
  const primaryCategory = useMemo(() => {
    const cats = new Set<string>();
    availableSets.forEach((set) => cats.add(set.type));
    const sorted = sortCategoriesByPriority(Array.from(cats));
    // Return first non-universal category, or first if all are universal
    return sorted.find(c => c !== 'Universal Damage Sets') || sorted[0] || null;
  }, [availableSets]);

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

  // Helper to create IO set enhancement object
  const createIOSetEnhancement = (set: IOSet, piece: IOSetPiece, pieceIndex: number) => {
    const setId = set.id || set.name;
    // Just store the filename - EnhancementIcon handles path construction
    const iconFilename = set.icon || 'Unknown.png';
    return {
      type: 'io-set' as const,
      id: `${setId}-${pieceIndex}`,
      name: piece.name,
      icon: iconFilename,
      setId: setId,
      setName: set.name,
      pieceNum: piece.num,
      level: attunementEnabled ? undefined : globalIOLevel,
      attuned: attunementEnabled,
      aspects: piece.aspects as EnhancementStatType[],
      isProc: piece.proc,
      isUnique: piece.unique,
    };
  };

  // Handle selecting an IO set piece (single click)
  const handleSelectSetPiece = (set: IOSet, piece: IOSetPiece, pieceIndex: number) => {
    if (!picker.currentPowerName) return;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, createIOSetEnhancement(set, piece, pieceIndex));
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
          createIOSetEnhancement(set, piece, pieceIndex)
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
          createIOSetEnhancement(set, piece, pieceIndex)
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

  // Global mouse up to cancel drag if released outside
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStartIndex(null);
        setDragEndIndex(null);
        setDragSet(null);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  // Handle selecting a generic IO
  const handleSelectGenericIO = (stat: EnhancementStatType) => {
    if (!picker.currentPowerName) return;
    const value = getCommonIOValueAtLevel(globalIOLevel);

    const enhancement: GenericIOEnhancement = {
      type: 'io-generic',
      id: `generic-io-${stat}-${globalIOLevel}`,
      name: `${stat} IO`,
      icon: getGenericIOIcon(stat),
      level: globalIOLevel,
      stat,
      value,
    };
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, enhancement);
    closeEnhancementPicker();
  };

  // Handle selecting an origin enhancement
  const handleSelectOrigin = (stat: EnhancementStatType, tier: 'TO' | 'DO' | 'SO') => {
    if (!picker.currentPowerName) return;
    const tierInfo = ORIGIN_TIERS.find((t) => t.short === tier);
    const value = tierInfo?.value ?? 0;

    const enhancement: OriginEnhancement = {
      type: 'origin',
      id: `origin-${tier}-${stat}`,
      name: `${stat} ${tier}`,
      icon: getOriginIcon(stat, tier),
      tier,
      origin: tier === 'SO' ? buildOrigin : undefined,
      stat,
      value,
    };
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, enhancement);
    closeEnhancementPicker();
  };

  // Handle selecting a special (Hamidon) enhancement
  const handleSelectSpecial = (id: string, hami: typeof HAMIDON_ENHANCEMENTS[keyof typeof HAMIDON_ENHANCEMENTS]) => {
    if (!picker.currentPowerName) return;

    // Capitalize the ID for the icon filename (nucleolus -> Nucleolus)
    const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);

    const enhancement: SpecialEnhancement = {
      type: 'special',
      id: `hamidon-${id}`,
      name: hami.name,
      icon: `HO${capitalizedId}.png`, // Just the filename, path handled by EnhancementIcon
      category: 'hamidon',
      aspects: hami.aspects.map(mapHamidonAspect),
      value: hami.value,
    };
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, enhancement);
    closeEnhancementPicker();
  };

  // Get available generic IOs for this power
  const availableGenericIOs = useMemo(() => {
    if (!currentPower) return COMMON_IO_TYPES;
    const allowed = new Set(currentPower.allowedEnhancements);
    return COMMON_IO_TYPES.filter((type) => allowed.has(type));
  }, [currentPower]);

  // Get available Hamidon enhancements
  const availableHamidons = useMemo(() => {
    if (!currentPower) return Object.entries(HAMIDON_ENHANCEMENTS);
    const allowed = new Set(currentPower.allowedEnhancements);
    return Object.entries(HAMIDON_ENHANCEMENTS).filter(([, hami]) => {
      return hami.aspects.some((aspect) => allowed.has(mapHamidonAspect(aspect)));
    });
  }, [currentPower]);

  const ioValue = getCommonIOValueAtLevel(globalIOLevel);

  return (
    <Modal
      isOpen={picker.isOpen}
      onClose={closeEnhancementPicker}
      title={`Select Enhancement for ${picker.currentPowerName || 'Power'}`}
      size="xl"
    >
      <ModalBody className="p-0">
        <div className="flex flex-col h-[70vh]">
        {/* Type filter tabs at top */}
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900/50 flex-shrink-0">
          <div className="flex">
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
                className={`px-4 py-2 text-sm font-medium transition-colors ${
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
          <div className="px-4">
            <Toggle
              id="attunement-toggle-picker"
              name="attunement"
              checked={attunementEnabled}
              onChange={toggleAttunement}
              label="Attuned"
            />
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Category sidebar - only for IO Sets */}
          {typeFilter === 'io-sets' && availableSets.length > 0 && (
            <div className="w-48 border-r border-gray-700 overflow-y-auto flex-shrink-0 bg-gray-900/30">
              {/* All (standard sets only) */}
              <SidebarButton
                label="All"
                count={availableSets.filter((s) => !isSpecialSet(s)).length}
                isActive={sidebarFilter === 'all'}
                onClick={() => setSidebarFilter('all')}
              />

              {/* Primary category (the main one for this power, standard sets only) */}
              {primaryCategory && (
                <SidebarButton
                  label={primaryCategory}
                  count={availableSets.filter((s) => s.type === primaryCategory && !isSpecialSet(s)).length}
                  isActive={sidebarFilter === primaryCategory}
                  onClick={() => setSidebarFilter(primaryCategory)}
                  textColor="text-yellow-400"
                />
              )}

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
          <div className="flex-1 overflow-y-auto p-3">
            {typeFilter === 'io-sets' && (
              <IOSetsContent
                sets={filteredSets}
                globalIOLevel={globalIOLevel}
                attunementEnabled={attunementEnabled}
                onPieceMouseDown={handlePieceMouseDown}
                onPieceMouseEnter={handlePieceMouseEnter}
                onPieceMouseUp={handlePieceMouseUp}
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
// IO SETS CONTENT
// ============================================

interface IOSetsContentProps {
  sets: IOSet[];
  globalIOLevel: number;
  attunementEnabled: boolean;
  onPieceMouseDown: (set: IOSet, pieceIndex: number) => void;
  onPieceMouseEnter: (pieceIndex: number) => void;
  onPieceMouseUp: (set: IOSet, pieceIndex: number, e: React.MouseEvent) => void;
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
  isDragging: boolean;
  dragStartIndex: number | null;
  dragEndIndex: number | null;
}

function IOSetRow({
  set,
  onPieceMouseDown,
  onPieceMouseEnter,
  onPieceMouseUp,
  isDragging,
  dragStartIndex,
  dragEndIndex,
}: IOSetRowProps) {
  const attunementEnabled = useUIStore((s) => s.attunementEnabled);

  // Check if a piece is in the current drag selection
  const isPieceSelected = (pieceIndex: number) => {
    if (!isDragging || dragStartIndex === null || dragEndIndex === null) return false;
    const min = Math.min(dragStartIndex, dragEndIndex);
    const max = Math.max(dragStartIndex, dragEndIndex);
    return pieceIndex >= min && pieceIndex <= max;
  };

  return (
    <div className="bg-gray-800/40 rounded-lg p-2">
      {/* Set header */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-medium ${getRarityColor(set.category)}`}>
          {set.name}
        </span>
        <span className="text-xs text-gray-500">
          Lv {set.minLevel}-{set.maxLevel} • {set.pieces.length} pieces
        </span>
        <span className="text-xs text-gray-600 ml-auto">Shift+click to slot all</span>
      </div>

      {/* Pieces as icons */}
      <div className="flex flex-wrap gap-1 select-none">
        {set.pieces.map((piece, pieceIndex) => {
          const selected = isPieceSelected(pieceIndex);
          return (
            <Tooltip key={pieceIndex} content={<SetPieceTooltip set={set} piece={piece} />}>
              <button
                onMouseDown={() => onPieceMouseDown(set, pieceIndex)}
                onMouseEnter={() => onPieceMouseEnter(pieceIndex)}
                onMouseUp={(e) => onPieceMouseUp(set, pieceIndex, e)}
                className={`w-9 h-9 rounded border transition-all bg-gray-900/50 ${
                  selected
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
  availableHamidons: [string, typeof HAMIDON_ENHANCEMENTS[keyof typeof HAMIDON_ENHANCEMENTS]][];
  onSelect: (id: string, hami: typeof HAMIDON_ENHANCEMENTS[keyof typeof HAMIDON_ENHANCEMENTS]) => void;
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
          {set.bonuses.slice(0, 3).map((b, i) => (
            <div key={i}>{b.pieces}pc: {b.effects.map(e => `${e.stat} +${e.value}`).join(', ')}</div>
          ))}
          {set.bonuses.length > 3 && <div className="text-gray-500">...and more</div>}
        </div>
      )}
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getGenericIOIcon(stat: EnhancementStatType): string {
  const iconMap: Partial<Record<EnhancementStatType, string>> = {
    'Damage': resolvePath('/img/Enhancements/IO_Damage.png'),
    'Accuracy': resolvePath('/img/Enhancements/IO_Accuracy.png'),
    'Recharge': resolvePath('/img/Enhancements/IO_Recharge.png'),
    'EnduranceReduction': resolvePath('/img/Enhancements/IO_Endurance.png'),
    'Range': resolvePath('/img/Enhancements/IO_Range.png'),
    'Defense': resolvePath('/img/Enhancements/IO_Defense.png'),
    'Resistance': resolvePath('/img/Enhancements/IO_Resistance.png'),
    'Healing': resolvePath('/img/Enhancements/IO_Healing.png'),
    'ToHit': resolvePath('/img/Enhancements/IO_ToHit.png'),
    'Hold': resolvePath('/img/Enhancements/IO_Hold.png'),
    'Stun': resolvePath('/img/Enhancements/IO_Stun.png'),
    'Immobilize': resolvePath('/img/Enhancements/IO_Immobilize.png'),
    'Sleep': resolvePath('/img/Enhancements/IO_Sleep.png'),
    'Confuse': resolvePath('/img/Enhancements/IO_Confuse.png'),
    'Fear': resolvePath('/img/Enhancements/IO_Fear.png'),
    'Knockback': resolvePath('/img/Enhancements/IO_Knockback.png'),
    'Run Speed': resolvePath('/img/Enhancements/IO_RunSpeed.png'),
    'Jump': resolvePath('/img/Enhancements/IO_Jump.png'),
    'Fly': resolvePath('/img/Enhancements/IO_Fly.png'),
  };
  return iconMap[stat] || resolvePath('/img/Unknown.png');
}

function getOriginIcon(stat: EnhancementStatType, tier: string): string {
  const statPart = stat.replace(/\s+/g, '');
  return resolvePath(`/img/Enhancements/${tier}_${statPart}.png`);
}

function mapHamidonAspect(aspect: string): EnhancementStatType {
  const mapping: Record<string, EnhancementStatType> = {
    'Damage': 'Damage',
    'Accuracy': 'Accuracy',
    'Range': 'Range',
    'ToHit Debuff': 'ToHit Debuff',
    'Defense Debuff': 'Defense Debuff',
    'Recharge': 'Recharge',
    'Mez Duration': 'Hold',
    'Resistance': 'Resistance',
    'Endurance': 'EnduranceReduction',
    'Healing': 'Healing',
    'Defense': 'Defense',
  };
  return mapping[aspect] || 'Damage';
}

function getRarityColor(category: string): string {
  switch (category) {
    case 'purple': return 'text-purple-400';
    case 'ato': return 'text-yellow-400';
    case 'pvp': return 'text-red-400';
    case 'event': return 'text-cyan-400';
    default: return 'text-gray-200';
  }
}

function getTierTextColor(tier: string): string {
  switch (tier) {
    case 'TO': return 'text-gray-400';
    case 'DO': return 'text-yellow-400';
    case 'SO': return 'text-orange-400';
    default: return 'text-gray-300';
  }
}

function getTierBorderColor(tier: string): string {
  switch (tier) {
    case 'TO': return 'border-gray-600 hover:border-gray-400';
    case 'DO': return 'border-yellow-700 hover:border-yellow-400';
    case 'SO': return 'border-orange-700 hover:border-orange-400';
    default: return 'border-gray-600 hover:border-gray-400';
  }
}
