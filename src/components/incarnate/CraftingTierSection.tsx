/**
 * CraftingTierSection - Renders one tier's crafting checklist
 */

import type {
  IncarnateSlotId,
  TierRecipe,
  CraftingVariantKey,
  CraftingVariant,
  CraftingChecklistKey,
  CraftingChecklistState,
} from '@/types';
import { craftingKey } from '@/types';
import { getTierColor, getTierDisplayName } from '@/data';
import type { IncarnateTier } from '@/types';
import { CraftingSalvageRow } from './CraftingSalvageRow';

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
  tierRecipe: TierRecipe;
  variants: Partial<Record<CraftingVariantKey, CraftingVariant>>;
  checklist: CraftingChecklistState;
  onToggleCheck: (key: CraftingChecklistKey) => void;
}

export function CraftingTierSection({
  slotId,
  treeId,
  tier,
  tierRecipe,
  variants,
  checklist,
  onToggleCheck,
}: CraftingTierSectionProps) {
  const rarity = TIER_TO_RARITY[tier] || 'common';
  const tierColor = getTierColor(rarity);
  const tierName = getTierDisplayName(rarity);

  // Helper to check if a key is checked
  const isChecked = (key: string) => !!checklist[key];

  // Currency keys
  const threadsKey = craftingKey(slotId, treeId, tier, '_', 'threads');
  const empyreanKey = craftingKey(slotId, treeId, tier, '_', 'empyrean');
  const shardsKey = craftingKey(slotId, treeId, tier, '_', 'shards');
  const noticeKey = craftingKey(slotId, treeId, tier, '_', 'noticeOfWell');

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
        {/* Currency rows */}
        {tierRecipe.threads > 0 && (
          <CurrencyRow
            label={`${tierRecipe.threads} Threads`}
            checkKey={threadsKey}
            isChecked={isChecked(threadsKey)}
            onToggle={onToggleCheck}
          />
        )}
        {tierRecipe.empyrean > 0 && (
          <CurrencyRow
            label={`${tierRecipe.empyrean} Empyrean Merits`}
            checkKey={empyreanKey}
            isChecked={isChecked(empyreanKey)}
            onToggle={onToggleCheck}
          />
        )}
        {tierRecipe.shards > 0 && (
          <CurrencyRow
            label={`${tierRecipe.shards} Shards`}
            checkKey={shardsKey}
            isChecked={isChecked(shardsKey)}
            onToggle={onToggleCheck}
          />
        )}
        {tierRecipe.noticeOfWell > 0 && (
          <CurrencyRow
            label={`${tierRecipe.noticeOfWell} Notice of the Well`}
            checkKey={noticeKey}
            isChecked={isChecked(noticeKey)}
            onToggle={onToggleCheck}
          />
        )}

        {/* Incarnate component rows */}
        {tierRecipe.incarnateComponents.map((comp, i) => {
          const compKey = craftingKey(slotId, treeId, tier, '_', `comp:${i}`);
          return (
            <CurrencyRow
              key={compKey}
              label={comp}
              checkKey={compKey}
              isChecked={isChecked(compKey)}
              onToggle={onToggleCheck}
            />
          );
        })}

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
              {variant.salvage.map((salvage, idx) => {
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

/** Simple currency/component row with checkbox */
function CurrencyRow({
  label,
  checkKey,
  isChecked,
  onToggle,
}: {
  label: string;
  checkKey: CraftingChecklistKey;
  isChecked: boolean;
  onToggle: (key: CraftingChecklistKey) => void;
}) {
  return (
    <label className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-800/50 transition-colors ${isChecked ? 'opacity-60' : ''}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggle(checkKey)}
        className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
      />
      <span className={`text-xs text-gray-300 ${isChecked ? 'line-through' : ''}`}>
        {label}
      </span>
    </label>
  );
}
