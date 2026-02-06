/**
 * IncarnateModal component - full modal for incarnate power selection
 * Shows slot tabs, tree sidebar, and power tree visualization
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBuildStore, useUIStore } from '@/stores';
import { getAllIncarnateSlots, getIncarnateTrees } from '@/data';
import type { IncarnatePower, SelectedIncarnatePower } from '@/types';
import { INCARNATE_SLOT_ORDER, INCARNATE_SLOT_COLORS } from '@/types';
import { IncarnatePowerTree } from './IncarnatePowerTree';

interface IncarnateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncarnateModal({ isOpen, onClose }: IncarnateModalProps) {
  const currentSlot = useUIStore((s) => s.currentIncarnateSlot);
  const setCurrentIncarnateSlot = useUIStore((s) => s.setCurrentIncarnateSlot);
  const incarnates = useBuildStore((s) => s.build.incarnates);
  const setIncarnatePower = useBuildStore((s) => s.setIncarnatePower);
  const clearIncarnatePower = useBuildStore((s) => s.clearIncarnatePower);

  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  const slots = getAllIncarnateSlots();
  const activeSlotId = currentSlot || 'alpha';
  const activeSlot = slots.find((s) => s.id === activeSlotId);
  const trees = activeSlot ? getIncarnateTrees(activeSlotId) : [];

  // Get currently selected power for this slot
  const currentPower = incarnates[activeSlotId];

  // Auto-select tree when slot changes or modal opens
  useEffect(() => {
    if (isOpen && trees.length > 0) {
      if (currentPower) {
        // Select the tree of the currently selected power
        setSelectedTreeId(currentPower.treeId);
      } else {
        // Select first tree
        setSelectedTreeId(trees[0].id);
      }
    }
  }, [isOpen, activeSlotId, trees, currentPower]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedTree = trees.find((t) => t.id === selectedTreeId);

  const handleSelectPower = (power: IncarnatePower | null) => {
    if (power === null) {
      // Deselect the current power
      clearIncarnatePower(activeSlotId);
    } else {
      const selectedPower: SelectedIncarnatePower = {
        slotId: activeSlotId,
        powerId: power.id,
        powerName: power.fullName,
        displayName: power.displayName,
        icon: power.icon,
        tier: power.tier,
        treeId: power.treeId,
        treeName: selectedTree?.name || power.treeId,
      };
      setIncarnatePower(activeSlotId, selectedPower);
    }
  };

  const handleClearPower = () => {
    clearIncarnatePower(activeSlotId);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Incarnate Power Selection"
    >
      <div className="w-full max-w-5xl h-full sm:h-[85vh] bg-gray-900 sm:rounded-lg shadow-xl border border-gray-700 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header with slot tabs */}
        <div className="flex items-center justify-between border-b border-gray-700 px-1 sm:px-2">
          <div className="flex flex-1 overflow-x-auto">
            {INCARNATE_SLOT_ORDER.map((slotId) => {
              const slot = slots.find((s) => s.id === slotId);
              if (!slot) return null;

              const isActive = slotId === activeSlotId;
              const hasPower = incarnates[slotId] !== null;
              const slotColor = INCARNATE_SLOT_COLORS[slotId];

              return (
                <button
                  key={slotId}
                  onClick={() => setCurrentIncarnateSlot(slotId)}
                  className={`
                    px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0
                    ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
                  `}
                  style={{
                    borderBottom: isActive ? `3px solid ${slotColor}` : '3px solid transparent',
                  }}
                >
                  {slot.displayName}
                  {hasPower && (
                    <span
                      className="absolute top-1 sm:top-2 right-0.5 sm:right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: slotColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Tree sidebar - horizontal scrolling list on mobile, side column on desktop */}
          <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col flex-shrink-0">
            <div className="hidden md:block px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-700">
              Trees
            </div>
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto p-1.5 md:p-2 gap-1 md:gap-0">
              {trees.map((tree) => {
                const isSelected = tree.id === selectedTreeId;
                const hasPowerFromTree = currentPower?.treeId === tree.id;

                return (
                  <button
                    key={tree.id}
                    onClick={() => setSelectedTreeId(tree.id)}
                    className={`
                      flex-shrink-0 md:flex-shrink text-left px-3 py-1.5 md:py-2 rounded-lg md:mb-1 md:w-full
                      transition-colors text-xs md:text-sm whitespace-nowrap md:whitespace-normal
                      ${
                        isSelected
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span>{tree.name}</span>
                      {hasPowerFromTree && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: INCARNATE_SLOT_COLORS[activeSlotId] }}
                        />
                      )}
                    </div>
                    {tree.description && (
                      <div className="hidden md:block text-[10px] text-gray-500 mt-0.5">{tree.description}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content - power tree */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Current selection info */}
            {currentPower && (
              <div
                className="px-4 py-2 flex items-center justify-between border-b border-gray-700"
                style={{ backgroundColor: `${INCARNATE_SLOT_COLORS[activeSlotId]}15` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Current:</span>
                  <span className="text-sm font-medium text-white">{currentPower.displayName}</span>
                  <span className="text-xs text-gray-500">({currentPower.treeName})</span>
                </div>
                <button
                  onClick={handleClearPower}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Power tree display */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedTree ? (
                <IncarnatePowerTree
                  slotId={activeSlotId}
                  treeId={selectedTree.id}
                  treeName={selectedTree.name}
                  powers={selectedTree.powers}
                  selectedPowerId={currentPower?.powerId || null}
                  onSelectPower={handleSelectPower}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a tree from the sidebar
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
