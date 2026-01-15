/**
 * EnhancementPicker component - modal for selecting enhancements
 */

import { useMemo } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { getIOSetsForPower, getIOSet, getPower } from '@/data';
import { Modal, ModalBody } from '@/components/modals';
import { Button } from '@/components/ui';
import { IOSetList, CategoryFilter } from './IOSetList';
import { EnhancementCard } from './EnhancementCard';
import type { IOSet, IOSetRarity, ModalView, EnhancementStatType } from '@/types';

export function EnhancementPicker() {
  const picker = useUIStore((s) => s.enhancementPicker);
  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const attunementEnabled = useUIStore((s) => s.attunementEnabled);
  const closeEnhancementPicker = useUIStore((s) => s.closeEnhancementPicker);
  const setPickerView = useUIStore((s) => s.setPickerView);
  const setPickerCategory = useUIStore((s) => s.setPickerCategory);
  const setSelectedSetId = useUIStore((s) => s.setSelectedSetId);
  const popPickerView = useUIStore((s) => s.popPickerView);

  const setEnhancement = useBuildStore((s) => s.setEnhancement);

  // Get available IO sets for the current power
  const availableSets = useMemo(() => {
    if (!picker.currentPowerName || !picker.currentPowerSet) return [];
    // Get the power to find its allowed set categories
    const power = getPower(picker.currentPowerSet, picker.currentPowerName);
    if (!power) return [];
    return getIOSetsForPower(power.allowedSetCategories);
  }, [picker.currentPowerName, picker.currentPowerSet]);

  // Filter sets by category (category is used as rarity in IOSet type)
  const filteredSets = useMemo(() => {
    if (!picker.currentCategory || picker.currentCategory === 'all') {
      return availableSets;
    }
    return availableSets.filter((set) => set.category === picker.currentCategory);
  }, [availableSets, picker.currentCategory]);

  // Get category counts for filters
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const set of availableSets) {
      counts[set.category] = (counts[set.category] || 0) + 1;
    }
    return Object.entries(counts).map(([id, count]) => ({
      id,
      label: getRarityLabel(id as IOSetRarity),
      count,
    }));
  }, [availableSets]);

  const selectedSet = picker.selectedSetId ? getIOSet(picker.selectedSetId) : null;

  const handleSelectSet = (set: IOSet) => {
    setSelectedSetId(set.id || set.name);
    setPickerView('io-set-detail');
  };

  const handleSelectPiece = (pieceIndex: number) => {
    if (!selectedSet || !picker.currentPowerName) return;

    const piece = selectedSet.pieces[pieceIndex];
    const setId = selectedSet.id || selectedSet.name;
    setEnhancement(picker.currentPowerName, picker.currentSlotIndex, {
      type: 'io-set',
      id: `${setId}-${pieceIndex}`,
      name: piece.name,
      icon: selectedSet.icon,
      setId: setId,
      setName: selectedSet.name,
      pieceNum: piece.num,
      level: attunementEnabled ? undefined : globalIOLevel,
      attuned: attunementEnabled,
      aspects: piece.aspects as EnhancementStatType[],
      isProc: piece.proc,
      isUnique: piece.unique,
    });
    closeEnhancementPicker();
  };

  const handleBack = () => {
    if (picker.viewStack.length > 0) {
      popPickerView();
    } else {
      closeEnhancementPicker();
    }
  };

  const renderContent = () => {
    switch (picker.currentView) {
      case 'category':
        return (
          <CategoryView
            onSelectCategory={(view) => setPickerView(view)}
          />
        );

      case 'io-sets':
        return (
          <div className="flex flex-col h-full">
            <CategoryFilter
              categories={categoryCounts}
              selectedCategory={picker.currentCategory as string}
              onSelectCategory={(cat) => setPickerCategory(cat as IOSetRarity | 'all' | null)}
            />
            <div className="flex-1 overflow-y-auto p-3">
              <IOSetList
                sets={filteredSets}
                selectedSetId={picker.selectedSetId}
                onSelectSet={handleSelectSet}
              />
            </div>
          </div>
        );

      case 'io-set-detail':
        if (!selectedSet) return <div>Set not found</div>;
        return (
          <IOSetDetailView
            set={selectedSet}
            level={globalIOLevel}
            isAttuned={attunementEnabled}
            onSelectPiece={handleSelectPiece}
          />
        );

      case 'io-generic':
        return <GenericIOView />;

      case 'special':
        return <SpecialEnhancementView />;

      case 'origin':
        return <OriginEnhancementView />;

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={picker.isOpen}
      onClose={closeEnhancementPicker}
      title={getModalTitle(picker.currentView, selectedSet?.name)}
      size="lg"
    >
      {/* Navigation */}
      {picker.currentView !== 'category' && (
        <div className="px-4 py-2 border-b border-gray-700">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
        </div>
      )}

      <ModalBody className="p-0 min-h-[400px]">{renderContent()}</ModalBody>
    </Modal>
  );
}

interface CategoryViewProps {
  onSelectCategory: (view: ModalView) => void;
}

function CategoryView({ onSelectCategory }: CategoryViewProps) {
  const categories = [
    { view: 'io-sets' as const, label: 'IO Sets', desc: 'Invention Origin set enhancements' },
    { view: 'io-generic' as const, label: 'Generic IOs', desc: 'Single-stat invention enhancements' },
    { view: 'special' as const, label: 'Special', desc: 'Hamidon, Titan, and Hydra enhancements' },
    { view: 'origin' as const, label: 'Origin', desc: 'Training, Dual, and Single Origin enhancements' },
  ];

  return (
    <div className="p-4 grid grid-cols-2 gap-3">
      {categories.map((cat) => (
        <button
          key={cat.view}
          onClick={() => onSelectCategory(cat.view)}
          className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors text-left"
        >
          <div className="text-lg font-medium text-gray-200">{cat.label}</div>
          <div className="text-sm text-gray-500">{cat.desc}</div>
        </button>
      ))}
    </div>
  );
}

interface IOSetDetailViewProps {
  set: IOSet;
  level: number;
  isAttuned: boolean;
  onSelectPiece: (index: number) => void;
}

function IOSetDetailView({ set, level, isAttuned, onSelectPiece }: IOSetDetailViewProps) {
  return (
    <div className="p-4">
      {/* Set header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <img
            src={set.icon || '/img/Unknown.png'}
            alt=""
            className="w-12 h-12 rounded"
          />
          <div>
            <h3 className="text-lg font-medium text-yellow-400">{set.name}</h3>
            <div className="text-sm text-gray-400">
              Level {set.minLevel}-{set.maxLevel} • {set.pieces.length} pieces
            </div>
          </div>
        </div>
      </div>

      {/* Set bonuses preview */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <div className="text-sm font-medium text-gray-300 mb-2">Set Bonuses:</div>
        <div className="space-y-1">
          {set.bonuses.map((bonus, i) => (
            <div key={i} className="text-xs text-gray-400">
              <span className="text-gray-500">{bonus.pieces}pc:</span>{' '}
              {bonus.effects.map((e) => `${e.stat} +${e.value}`).join(', ')}
            </div>
          ))}
        </div>
      </div>

      {/* Pieces */}
      <div className="space-y-2">
        {set.pieces.map((piece, index) => (
          <EnhancementCard
            key={index}
            piece={piece}
            setName={set.name}
            setIcon={set.icon}
            level={level}
            isAttuned={isAttuned}
            onClick={() => onSelectPiece(index)}
            showDetails
          />
        ))}
      </div>
    </div>
  );
}

function GenericIOView() {
  return (
    <div className="p-4 text-center text-gray-500">
      Generic IO selection coming soon
    </div>
  );
}

function SpecialEnhancementView() {
  return (
    <div className="p-4 text-center text-gray-500">
      Special enhancement selection coming soon
    </div>
  );
}

function OriginEnhancementView() {
  return (
    <div className="p-4 text-center text-gray-500">
      Origin enhancement selection coming soon
    </div>
  );
}

function getModalTitle(view: ModalView, setName?: string): string {
  switch (view) {
    case 'category':
      return 'Select Enhancement Type';
    case 'io-sets':
      return 'IO Sets';
    case 'io-set-detail':
      return setName || 'IO Set';
    case 'io-generic':
      return 'Generic IOs';
    case 'special':
      return 'Special Enhancements';
    case 'origin':
      return 'Origin Enhancements';
    default:
      return 'Select Enhancement';
  }
}

function getRarityLabel(rarity: IOSetRarity): string {
  switch (rarity) {
    case 'io-set':
      return 'Standard';
    case 'purple':
      return 'Purple';
    case 'ato':
      return 'ATO';
    case 'pvp':
      return 'PvP';
    case 'event':
      return 'Event';
    default:
      return rarity;
  }
}
