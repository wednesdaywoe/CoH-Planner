/**
 * IncarnateCraftingModal - Shows crafting requirements for the player's selected incarnate powers.
 * Only displays tiers up to the selected power's tier, filtered to the relevant core/radial branch.
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBuildStore, useUIStore } from '@/stores';
import {
  getAllIncarnateSlots,
  getSlotColor,
  getTreeComponents,
  getTierRecipe,
} from '@/data';
import { INCARNATE_SLOT_ORDER, inferBranchFromPowerName } from '@/types';
import type { IncarnateSlotId, IncarnateBranch, CraftingVariantKey, CraftingVariant } from '@/types';
import { CraftingTierSection } from './CraftingTierSection';
import { CraftingCostSummary } from './CraftingCostSummary';

const TIER_NUMBER: Record<string, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  veryrare: 4,
};

/** Filter variant map to only the branch-relevant keys */
function branchVariants(
  variants: Partial<Record<CraftingVariantKey, CraftingVariant>>,
  branch: IncarnateBranch,
  tier: number
): Partial<Record<CraftingVariantKey, CraftingVariant>> {
  // T1 has no branch choice yet — show all variants
  if (tier === 1 || branch === 'base') return variants;

  const keys: CraftingVariantKey[] = branch === 'core'
    ? ['core', 'core_2']
    : ['radial', 'radial_2'];

  const filtered: Partial<Record<CraftingVariantKey, CraftingVariant>> = {};
  for (const k of keys) {
    if (variants[k]) filtered[k] = variants[k];
  }
  return filtered;
}

interface IncarnateCraftingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncarnateCraftingModal({ isOpen, onClose }: IncarnateCraftingModalProps) {
  const currentSlot = useUIStore((s) => s.currentIncarnateSlot);
  const setCurrentIncarnateSlot = useUIStore((s) => s.setCurrentIncarnateSlot);
  const openIncarnateModal = useUIStore((s) => s.openIncarnateModal);
  const incarnates = useBuildStore((s) => s.build.incarnates);
  const craftingChecklist = useBuildStore((s) => s.build.craftingChecklist);
  const toggleCraftingCheckItem = useBuildStore((s) => s.toggleCraftingCheckItem);
  const clearCraftingChecklistForSlot = useBuildStore((s) => s.clearCraftingChecklistForSlot);

  const slots = getAllIncarnateSlots();
  const activeSlotId: IncarnateSlotId = currentSlot || 'alpha';
  const currentPower = incarnates[activeSlotId];

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Derive crafting parameters from selected power
  const targetTier = currentPower ? (TIER_NUMBER[currentPower.tier] ?? 4) : 0;
  const treeName = currentPower?.treeName || '';
  const branch: IncarnateBranch = currentPower
    ? inferBranchFromPowerName(currentPower.displayName)
    : 'base';
  const treeComponents = treeName ? getTreeComponents(activeSlotId, treeName) : null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Incarnate Crafting Checklist"
    >
      <div className="w-full max-w-2xl h-full sm:h-[85vh] bg-gray-900 sm:rounded-lg shadow-xl border border-gray-700 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header: slot tabs + close */}
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
                  style={{ borderBottom: isActive ? `3px solid ${slotColor}` : '3px solid transparent' }}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!currentPower ? (
            /* No power selected */
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <p className="text-gray-400 text-sm">No power selected for this slot.</p>
              <button
                onClick={() => { onClose(); openIncarnateModal(activeSlotId); }}
                className="px-4 py-2 text-sm font-medium text-blue-400 border border-blue-700 hover:border-blue-500 hover:bg-blue-900/30 rounded-lg transition-colors"
              >
                Select a Power
              </button>
            </div>
          ) : (
            /* Power selected — show crafting path */
            <div className="p-4 space-y-3">
              {/* Selected power header */}
              <div
                className="px-3 py-2 rounded-lg flex items-center gap-2"
                style={{ backgroundColor: `${getSlotColor(activeSlotId)}15`, border: `1px solid ${getSlotColor(activeSlotId)}40` }}
              >
                <span className="text-xs text-gray-400">Crafting path to:</span>
                <span className="text-sm font-semibold text-white">{currentPower.displayName}</span>
              </div>

              {/* Tier sections — only up to the selected tier */}
              {[1, 2, 3, 4].filter((t) => t <= targetTier).map((tier) => {
                const tierRecipe = getTierRecipe(activeSlotId, tier);
                const allVariants = treeComponents?.[tier];
                if (!tierRecipe || !allVariants) return null;

                const filteredVariants = branchVariants(allVariants, branch, tier);

                return (
                  <CraftingTierSection
                    key={tier}
                    slotId={activeSlotId}
                    treeId={currentPower.treeId}
                    tier={tier}
                    tierRecipe={tierRecipe}
                    variants={filteredVariants}
                    checklist={craftingChecklist}
                    onToggleCheck={toggleCraftingCheckItem}
                  />
                );
              })}

              {/* Cost summary */}
              <CraftingCostSummary
                slotId={activeSlotId}
                targetTier={targetTier}
                checklist={craftingChecklist}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 flex justify-between gap-2">
          <button
            onClick={() => clearCraftingChecklistForSlot(activeSlotId)}
            className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!currentPower}
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
