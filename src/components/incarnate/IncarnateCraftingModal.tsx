/**
 * IncarnateCraftingModal - Dedicated modal for incarnate crafting checklist
 * Shows crafting requirements per slot/tree with persistent checkboxes
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBuildStore, useUIStore } from '@/stores';
import {
  getAllIncarnateSlots,
  getIncarnateTrees,
  getSlotColor,
  getTreeComponents,
  getTierRecipe,
} from '@/data';
import { INCARNATE_SLOT_ORDER } from '@/types';
import type { IncarnateSlotId } from '@/types';
import { CraftingTierSection } from './CraftingTierSection';
import { CraftingCostSummary } from './CraftingCostSummary';

interface IncarnateCraftingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncarnateCraftingModal({ isOpen, onClose }: IncarnateCraftingModalProps) {
  const currentSlot = useUIStore((s) => s.currentIncarnateSlot);
  const setCurrentIncarnateSlot = useUIStore((s) => s.setCurrentIncarnateSlot);
  const incarnates = useBuildStore((s) => s.build.incarnates);
  const craftingChecklist = useBuildStore((s) => s.build.craftingChecklist);
  const toggleCraftingCheckItem = useBuildStore((s) => s.toggleCraftingCheckItem);
  const clearCraftingChecklistForSlot = useBuildStore((s) => s.clearCraftingChecklistForSlot);

  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  const slots = getAllIncarnateSlots();
  const activeSlotId: IncarnateSlotId = currentSlot || 'alpha';
  const trees = getIncarnateTrees(activeSlotId);

  // Get currently selected power for this slot
  const currentPower = incarnates[activeSlotId];

  // Auto-select tree when slot changes or modal opens
  useEffect(() => {
    if (isOpen && trees.length > 0) {
      if (currentPower) {
        setSelectedTreeId(currentPower.treeId);
      } else {
        setSelectedTreeId(trees[0].id);
      }
    }
  }, [isOpen, activeSlotId, trees, currentPower]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  // Get crafting data for selected tree — use display name for lookup (matches component data keys)
  const treeName = selectedTree?.name || '';
  const treeComponents = treeName ? getTreeComponents(activeSlotId, treeName) : null;

  // Determine the highest tier the selected power is at (for summary)
  const selectedTier = currentPower
    ? currentPower.tier === 'veryrare' ? 4
    : currentPower.tier === 'rare' ? 3
    : currentPower.tier === 'uncommon' ? 2
    : 1
    : 4; // Default to showing all tiers

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleClearSlotChecklist = () => {
    clearCraftingChecklistForSlot(activeSlotId);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Incarnate Crafting Checklist"
    >
      <div className="w-full max-w-4xl h-full sm:h-[85vh] bg-gray-900 sm:rounded-lg shadow-xl border border-gray-700 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header with slot tabs */}
        <div className="flex items-center justify-between border-b border-gray-700 px-1 sm:px-2">
          <div className="flex flex-1 overflow-x-auto">
            {INCARNATE_SLOT_ORDER.map((slotId) => {
              const slot = slots.find((s) => s.id === slotId);
              if (!slot) return null;

              const isActive = slotId === activeSlotId;
              const hasPower = incarnates[slotId] !== null;
              const slotColor = getSlotColor(slotId);

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
          {/* Tree sidebar */}
          <div className="w-full md:w-44 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col flex-shrink-0">
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
                      ${isSelected
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span>{tree.name}</span>
                      {hasPowerFromTree && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getSlotColor(activeSlotId) }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content - crafting checklist */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Current power info */}
            {currentPower && currentPower.treeId === selectedTreeId && (
              <div
                className="px-4 py-2 flex items-center gap-2 border-b border-gray-700"
                style={{ backgroundColor: `${getSlotColor(activeSlotId)}15` }}
              >
                <span className="text-sm text-gray-400">Selected:</span>
                <span className="text-sm font-medium text-white">{currentPower.displayName}</span>
              </div>
            )}

            {/* Checklist */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedTree && treeComponents ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((tier) => {
                    const tierRecipe = getTierRecipe(activeSlotId, tier);
                    const variants = treeComponents[tier];
                    if (!tierRecipe || !variants) return null;

                    return (
                      <CraftingTierSection
                        key={tier}
                        slotId={activeSlotId}
                        treeId={selectedTreeId!}
                        tier={tier}
                        tierRecipe={tierRecipe}
                        variants={variants}
                        checklist={craftingChecklist}
                        onToggleCheck={toggleCraftingCheckItem}
                      />
                    );
                  })}

                  {/* Cost summary */}
                  <CraftingCostSummary
                    slotId={activeSlotId}
                    targetTier={selectedTier}
                    checklist={craftingChecklist}
                  />
                </div>
              ) : selectedTree ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No crafting data available for {selectedTree.name}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  Select a tree from the sidebar
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 flex justify-between gap-2">
          <button
            onClick={handleClearSlotChecklist}
            className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-gray-800"
          >
            Clear Checklist
          </button>
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
