/**
 * CraftingTierSection - Renders one tier's crafting checklist (salvage only)
 */

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
}

export function CraftingTierSection({
  slotId,
  treeId,
  tier,
  variants,
  checklist,
  onToggleCheck,
}: CraftingTierSectionProps) {
  const rarity = TIER_TO_RARITY[tier] || 'common';
  const tierColor = getTierColor(rarity);
  const tierName = getTierDisplayName(rarity);

  // Helper to check if a key is checked
  const isChecked = (key: string) => !!checklist[key];

  // Variant ordering
  const variantOrder: CraftingVariantKey[] = ['core', 'core_2', 'radial', 'radial_2'];
  const activeVariants = variantOrder.filter((v) => variants[v]);

  return (
    <div className="border border-gray-700/50 rounded-lg overflow-hidden">
      {/* Tier header */}
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ backgroundColor: `${tierColor}15`, borderLeft: `3px solid ${tierColor}` }}
      >
        <span className="text-xs font-semibold" style={{ color: tierColor }}>
          Tier {tier}: {tierName}
        </span>
      </div>

      <div className="px-3 py-2 space-y-1">
        {/* Salvage per variant */}
        {activeVariants.map((variantKey) => {
          const variant = variants[variantKey]!;
          return (
            <div key={variantKey} className="mt-2">
              {/* Only show variant label if there are multiple variants */}
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
              }).map((salvage, idx) => {
                const salvageKey = craftingKey(
                  slotId, treeId, tier, variantKey, `salvage:${salvage.salvageId}:${idx}`
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
    </div>
  );
}
