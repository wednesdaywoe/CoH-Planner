/**
 * CraftingTierSection - Renders one tier's crafting checklist (salvage only).
 * Collapsible: click the tier header to expand/collapse.
 */

import { useState } from 'react';
import type {
  IncarnateSlotId,
  CraftingVariantKey,
  CraftingVariant,
  CraftingChecklistKey,
  CraftingChecklistState,
} from '@/types';
import { craftingKey } from '@/types';
import { getTierColor, getTierDisplayName, getSalvageRarity, getSalvageDisplayName } from '@/data';
import type { IncarnateTier } from '@/types';
import { CraftingSalvageRow } from './CraftingSalvageRow';

const RARITY_SORT: Record<string, number> = { 'common': 0, 'uncommon': 1, 'rare': 2, 'very-rare': 3 };

const TIER_TO_RARITY: Record<number, IncarnateTier> = {
  1: 'common',
  2: 'uncommon',
  3: 'rare',
  4: 'veryrare',
};

/** Display-friendly variant labels */
const VARIANT_LABELS: Record<string, string> = {
  core: 'Core',
  radial: 'Radial',
  core_2: 'Core (Alt)',
  radial_2: 'Radial (Alt)',
};

interface CraftingTierSectionProps {
  slotId: IncarnateSlotId;
  treeId: string;
  tier: number;
  variants: Partial<Record<CraftingVariantKey, CraftingVariant>>;
  checklist: CraftingChecklistState;
  onToggleCheck: (key: CraftingChecklistKey) => void;
  defaultCollapsed?: boolean;
}

export function CraftingTierSection({
  slotId,
  treeId,
  tier,
  variants,
  checklist,
  onToggleCheck,
  defaultCollapsed = true,
}: CraftingTierSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const rarity = TIER_TO_RARITY[tier] || 'common';
  const tierColor = getTierColor(rarity);
  const tierName = getTierDisplayName(rarity);

  const isChecked = (key: string) => !!checklist[key];

  const variantOrder: CraftingVariantKey[] = ['core', 'core_2', 'radial', 'radial_2'];
  const activeVariants = variantOrder.filter((v) => variants[v]);

  return (
    <div className="border border-gray-700/50 rounded-lg overflow-hidden">
      {/* Tier header - clickable to toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? `Show salvage required for Tier ${tier}: ${tierName}` : `Hide Tier ${tier} salvage list`}
        aria-expanded={!collapsed}
        className="w-full px-3 py-1.5 flex items-center justify-between cursor-pointer hover:brightness-125 transition-all"
        style={{ backgroundColor: `${tierColor}15`, borderLeft: `3px solid ${tierColor}` }}
      >
        <span className="text-xs font-semibold" style={{ color: tierColor }}>
          Tier {tier}: {tierName}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div className="px-3 py-2 space-y-1">
          {activeVariants.map((variantKey) => {
            const variant = variants[variantKey]!;
            return (
              <div key={variantKey} className="mt-2">
                {activeVariants.length > 1 && (
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 pl-1">
                    {VARIANT_LABELS[variantKey] || variantKey}
                  </div>
                )}
                {[...variant.salvage].sort((a, b) => {
                  const ra = RARITY_SORT[getSalvageRarity(a.salvageId)] ?? 99;
                  const rb = RARITY_SORT[getSalvageRarity(b.salvageId)] ?? 99;
                  if (ra !== rb) return ra - rb;
                  return getSalvageDisplayName(a.salvageId).localeCompare(getSalvageDisplayName(b.salvageId));
                }).map((salvage) => {
                  const salvageKey = craftingKey(
                    slotId, treeId, tier, variantKey, `salvage:${salvage.salvageId}`
                  );
                  return (
                    <CraftingSalvageRow
                      key={salvageKey}
                      salvage={salvage}
                      checkKey={salvageKey}
                      isChecked={isChecked(salvageKey)}
                      onToggle={onToggleCheck}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
