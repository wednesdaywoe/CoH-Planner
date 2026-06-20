/**
 * CraftNodeRow - One node in the incarnate crafting dependency tree.
 *
 * Renders the node's "obtained" checkbox + its salvage checklist, then recurses
 * into the prerequisite nodes it consumes. Marking a node obtained (or having an
 * obtained ancestor) greys it out and removes it from the remaining shopping
 * list — its ingredients were already spent crafting it.
 */

import { useState } from 'react';
import type {
  IncarnateSlotId,
  CraftingChecklistState,
  CraftingChecklistKey,
} from '@/types';
import { getTierColor, getSalvageRarity, getSalvageDisplayName } from '@/data';
import { CraftingSalvageRow } from './CraftingSalvageRow';
import type { CraftNode } from './craft-tree';

const TIER_TO_RARITY: Record<number, 'common' | 'uncommon' | 'rare' | 'veryrare'> = {
  1: 'common',
  2: 'uncommon',
  3: 'rare',
  4: 'veryrare',
};

const RARITY_SORT: Record<string, number> = { common: 0, uncommon: 1, rare: 2, 'very-rare': 3 };

interface CraftNodeRowProps {
  node: CraftNode;
  depth: number;
  slotId: IncarnateSlotId;
  treeId: string;
  obtained: CraftingChecklistState;
  /** True when some ancestor node is obtained (so this node is consumed). */
  ancestorObtained: boolean;
  onToggleObtained: (key: string) => void;
  checklist: CraftingChecklistState;
  onToggleCheck: (key: CraftingChecklistKey) => void;
}

export function CraftNodeRow({
  node,
  depth,
  slotId,
  treeId,
  obtained,
  ancestorObtained,
  onToggleObtained,
  checklist,
  onToggleCheck,
}: CraftNodeRowProps) {
  const obtainedKey = `${slotId}:${treeId}:${node.path}`;
  const selfObtained = !!obtained[obtainedKey];
  const effObtained = ancestorObtained || selfObtained;

  const rarity = TIER_TO_RARITY[node.tier] ?? 'common';
  const tierColor = getTierColor(rarity);

  // Collapse the salvage list by default; obtained nodes have nothing to buy.
  const [collapsed, setCollapsed] = useState(true);
  const showSalvage = !collapsed && !effObtained && node.salvage.length > 0;

  const sortedSalvage = [...node.salvage].sort((a, b) => {
    const ra = RARITY_SORT[getSalvageRarity(a.salvageId)] ?? 99;
    const rb = RARITY_SORT[getSalvageRarity(b.salvageId)] ?? 99;
    if (ra !== rb) return ra - rb;
    return getSalvageDisplayName(a.salvageId).localeCompare(getSalvageDisplayName(b.salvageId));
  });

  return (
    <div style={{ marginLeft: depth > 0 ? 14 : 0 }}>
      <div
        className={`rounded-md ${depth > 0 ? 'border-l border-gray-700/60 pl-2' : ''}`}
      >
        {/* Node header */}
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-opacity ${effObtained ? 'opacity-50' : ''}`}
          style={{ backgroundColor: `${tierColor}12`, borderLeft: `3px solid ${tierColor}` }}
        >
          <input
            type="checkbox"
            checked={selfObtained}
            disabled={ancestorObtained}
            onChange={() => onToggleObtained(obtainedKey)}
            title={
              ancestorObtained
                ? 'Consumed by a higher tier you already have'
                : selfObtained
                  ? 'Obtained — click to unmark'
                  : 'Mark as obtained (drops it and its ingredients from the list)'
            }
            aria-label={`Obtained: ${node.label}`}
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 cursor-pointer disabled:cursor-not-allowed shrink-0"
            style={{ accentColor: tierColor }}
          />
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            disabled={effObtained || node.salvage.length === 0}
            className="flex-1 flex items-center justify-between gap-2 text-left cursor-pointer disabled:cursor-default min-w-0"
          >
            <span className={`text-xs font-medium truncate ${effObtained ? 'line-through text-gray-400' : 'text-gray-100'}`}>
              {node.label}
            </span>
            <span className="flex items-center gap-1.5 shrink-0">
              {ancestorObtained ? (
                <span className="text-[10px] uppercase tracking-wide text-gray-500">Consumed</span>
              ) : selfObtained ? (
                <span className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: tierColor }}>
                  Obtained
                </span>
              ) : (
                node.salvage.length > 0 && (
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )
              )}
            </span>
          </button>
        </div>

        {/* This node's salvage */}
        {showSalvage && (
          <div className="pl-6 pr-2 py-1 space-y-0.5">
            {sortedSalvage.map((salvage) => {
              const checkKey = `${slotId}:${treeId}:${node.path}:salvage:${salvage.salvageId}`;
              return (
                <CraftingSalvageRow
                  key={checkKey}
                  salvage={salvage}
                  checkKey={checkKey}
                  isChecked={!!checklist[checkKey]}
                  onToggle={onToggleCheck}
                />
              );
            })}
          </div>
        )}

        {/* Prerequisite nodes (consumed by this one) */}
        {node.children.length > 0 && (
          <div className="mt-0.5 space-y-0.5">
            {node.children.map((child) => (
              <CraftNodeRow
                key={child.path}
                node={child}
                depth={depth + 1}
                slotId={slotId}
                treeId={treeId}
                obtained={obtained}
                ancestorObtained={effObtained}
                onToggleObtained={onToggleObtained}
                checklist={checklist}
                onToggleCheck={onToggleCheck}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
