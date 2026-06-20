/**
 * IncarnateCraftingModal - Shows crafting requirements for the player's selected incarnate powers.
 * Renders the full crafting dependency tree for the goal power (a T4 consumes
 * both T3 variants, each with its own T2/T1). Nodes marked "obtained" — and
 * everything consumed to craft them — drop out of the cost summary and the
 * consolidated shopping list.
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBuildStore, useUIStore } from '@/stores';
import {
  getAllIncarnateSlots,
  getSlotColor,
  getTreeComponents,
} from '@/data';
import { INCARNATE_SLOT_ORDER, inferBranchFromPowerName } from '@/types';
import type { IncarnateSlotId, IncarnateBranch, SalvageId } from '@/types';
import { CraftingCostSummary } from './CraftingCostSummary';
import { ShoppingListView } from './ShoppingListView';
import { CraftNodeRow } from './CraftNodeRow';
import { TIER_NUMBER, inferT3VariantKey } from './crafting-utils';
import { buildCraftTree, resolveGoalVariant, remainingSalvage, goalNodeSalvage } from './craft-tree';

type ActiveView = 'per-slot' | 'shopping-list';

// Genesis is excluded from crafting — its recipe/salvage costs aren't catalogued
// yet (Rebirth-only slot). The effects are modeled; the crafting checklist isn't.
const CRAFTING_SLOT_IDS = INCARNATE_SLOT_ORDER.filter((id) => id !== 'genesis');

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
  const incarnateObtained = useBuildStore((s) => s.build.incarnateObtained);
  const toggleCraftingCheckItem = useBuildStore((s) => s.toggleCraftingCheckItem);
  const toggleIncarnateObtainedNode = useBuildStore((s) => s.toggleIncarnateObtainedNode);
  const clearCraftingChecklistForSlot = useBuildStore((s) => s.clearCraftingChecklistForSlot);
  const clearShoppingListAcquired = useBuildStore((s) => s.clearShoppingListAcquired);

  const [activeView, setActiveView] = useState<ActiveView>('per-slot');

  const slots = getAllIncarnateSlots();
  // Genesis has no crafting view; if it's the last-touched slot, default to alpha.
  const activeSlotId: IncarnateSlotId = (currentSlot && currentSlot !== 'genesis') ? currentSlot : 'alpha';
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
  const t3VariantKey = currentPower ? inferT3VariantKey(currentPower.displayName, branch) : null;
  const treeComponents = treeName ? getTreeComponents(activeSlotId, treeName) : null;

  // Build the crafting dependency tree for the selected goal power. The tree
  // accounts for consumption — a T4 pulls in BOTH T3 variants, each with its own
  // T2/T1 — and obtained nodes prune their sub-tree from the remaining cost.
  const craftTree = currentPower && treeComponents && targetTier > 0
    ? buildCraftTree(
        treeComponents,
        targetTier,
        resolveGoalVariant(targetTier, branch, t3VariantKey),
        currentPower.displayName,
      )
    : null;

  const isNodeObtained = (path: string) =>
    !!incarnateObtained[`${activeSlotId}:${currentPower?.treeId}:${path}`];

  const nodeOnlySalvage = craftTree ? goalNodeSalvage(craftTree) : new Map<SalvageId, number>();
  const fullPathSalvage = craftTree ? remainingSalvage(craftTree, isNodeObtained) : new Map<SalvageId, number>();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isShoppingList = activeView === 'shopping-list';

  return createPortal(
    <div
      className="fixed inset-0 max-lg:bottom-[calc(56px+env(safe-area-inset-bottom))] z-40 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Incarnate Crafting Checklist"
    >
      <div className="w-full max-w-2xl h-full sm:h-[85vh] bg-gray-900 sm:rounded-lg shadow-xl border border-gray-700 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header: slot tabs + shopping list tab + close */}
        <div className="flex items-center justify-between border-b border-gray-700 px-1 sm:px-2">
          <div className="flex flex-1 overflow-x-auto">
            {CRAFTING_SLOT_IDS.map((slotId) => {
              const slot = slots.find((s) => s.id === slotId);
              if (!slot) return null;
              const isActive = !isShoppingList && slotId === activeSlotId;
              const hasPower = incarnates[slotId] !== null;
              const slotColor = getSlotColor(slotId);

              return (
                <button
                  key={slotId}
                  onClick={() => {
                    setCurrentIncarnateSlot(slotId);
                    setActiveView('per-slot');
                  }}
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
            {/* Divider */}
            <div className="w-px h-6 bg-gray-600 mx-1 self-center flex-shrink-0" />
            {/* Shopping List tab */}
            <button
              onClick={() => setActiveView('shopping-list')}
              className={`
                px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0
                ${isShoppingList
                  ? 'text-emerald-400 border-b-[3px] border-emerald-400'
                  : 'text-gray-400 hover:text-gray-200 border-b-[3px] border-transparent'}
              `}
            >
              All
            </button>
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
          {isShoppingList ? (
            <ShoppingListView />
          ) : !currentPower ? (
            /* No power selected */
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <p className="text-gray-400 text-sm">No power selected for this slot.</p>
              <button
                onClick={() => { onClose(); openIncarnateModal(activeSlotId); }}
                className="px-4 py-2 text-sm font-medium text-link border border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 rounded-lg transition-colors"
              >
                Select a Power
              </button>
            </div>
          ) : (
            /* Power selected — show crafting path */
            <div className="p-4 space-y-3">
              {/* Selected power header */}
              <div
                className="px-3 py-2 rounded-lg flex items-center gap-2 flex-wrap"
                style={{ backgroundColor: `${getSlotColor(activeSlotId)}15`, border: `1px solid ${getSlotColor(activeSlotId)}40` }}
              >
                <span className="text-xs text-gray-400">Crafting path to:</span>
                <span className="text-sm font-semibold text-white">{currentPower.displayName}</span>
                {craftTree && fullPathSalvage.size === 0 && (
                  <span className="ml-auto text-[11px] font-semibold text-emerald-400">✓ Fully crafted</span>
                )}
              </div>

              {/* Hint: check off nodes you already have to trim the list */}
              <p className="text-[10px] text-gray-500 -mt-1 px-1">
                A Tier 4 consumes both Tier 3 powers (each with its own Tier 2 + Tier 1). Check a node you already
                have — it and everything consumed to make it drop from the costs and shopping list.
              </p>

              {/* Shopping list summary */}
              <CraftingCostSummary
                nodeOnlySalvage={nodeOnlySalvage}
                fullPathSalvage={fullPathSalvage}
                fullPathLabel="Remaining"
              />

              {/* Crafting dependency tree */}
              {craftTree && (
                <div className="space-y-0.5">
                  <CraftNodeRow
                    node={craftTree}
                    depth={0}
                    slotId={activeSlotId}
                    treeId={currentPower.treeId}
                    obtained={incarnateObtained}
                    ancestorObtained={false}
                    onToggleObtained={toggleIncarnateObtainedNode}
                    checklist={craftingChecklist}
                    onToggleCheck={toggleCraftingCheckItem}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 flex justify-between gap-2">
          {isShoppingList ? (
            <button
              onClick={clearShoppingListAcquired}
              className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-gray-800"
            >
              Reset All Acquired
            </button>
          ) : (
            <button
              onClick={() => clearCraftingChecklistForSlot(activeSlotId)}
              className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!currentPower}
            >
              Clear Checklist
            </button>
          )}
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
