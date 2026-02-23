/**
 * ChronologicalPowerSlot - Individual slot in the chronological power view
 *
 * Shows either a power with enhancements or an empty slot placeholder.
 * Includes category color coding and all standard interactions.
 */

import { useBuildStore, useUIStore } from '@/stores';
import type { PowerCategory as StorePowerCategory } from '@/stores';
import { getPowerIconPath, getPowerset } from '@/data';
import { PowerRow } from './PowerRow';
import { shouldShowToggle } from './power-row-utils';
import type { CategorizedPower, PowerCategory } from './ChronologicalPowerView';

// Category colors for left border
const CATEGORY_COLORS: Record<PowerCategory, string> = {
  primary: 'border-l-4 border-l-yellow-500',
  secondary: 'border-l-4 border-l-blue-500',
  pool: 'border-l-4 border-l-green-500',
  epic: 'border-l-4 border-l-purple-500',
};

/**
 * Map chronological category to store category for removal
 */
function mapCategoryToStoreCategory(category: PowerCategory): StorePowerCategory {
  switch (category) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'pool':
      return 'pool';
    case 'epic':
      return 'epic';
    default:
      return 'pool';
  }
}

interface ChronologicalPowerSlotProps {
  level: number;
  power: CategorizedPower | null;
  isPrimarySlot?: boolean;
  isSecondarySlot?: boolean;
}

export function ChronologicalPowerSlot({
  level,
  power,
  isPrimarySlot,
  isSecondarySlot,
}: ChronologicalPowerSlotProps) {
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const togglePowerActive = useBuildStore((s) => s.togglePowerActive);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  // Get the powerset display name for icon lookup
  // Primary/secondary: look up from powerset registry
  // Pool/epic: use the poolName already carried on CategorizedPower
  const powersetName = (() => {
    if (!power) return '';
    if (power.category === 'pool' || power.category === 'epic') {
      return power.poolName || '';
    }
    const powerset = power.powerSet ? getPowerset(power.powerSet) : null;
    return powerset?.name || '';
  })();

  if (!power) {
    // Render empty slot placeholder
    return (
      <div className="min-h-[46px] flex items-center gap-2 px-2 py-1 bg-slate-800/50 border border-dashed border-slate-700 rounded">
        <div className="flex-shrink-0 w-8 text-center">
          <span className="text-xs font-semibold text-slate-500">L{level}</span>
        </div>
        <div className="flex-1 text-xs text-slate-600 italic">
          {isPrimarySlot
            ? 'Primary power'
            : isSecondarySlot
            ? 'Secondary power'
            : 'Empty slot'}
        </div>
      </div>
    );
  }

  const isLocked =
    infoPanelLocked &&
    lockedContent?.type === 'power' &&
    lockedContent.powerName === power.name;

  const handleRemove = () => {
    const storeCategory = mapCategoryToStoreCategory(power.category);
    removePower(storeCategory, power.name);
  };

  const handleAddSlots = (count: number) => {
    for (let i = 0; i < count; i++) {
      addSlot(power.name);
    }
  };

  const handleClearAllEnhancements = () => {
    for (let i = 0; i < power.slots.length; i++) {
      clearEnhancement(power.name, i);
    }
  };

  const handleRemoveAllSlots = () => {
    for (let i = power.slots.length - 1; i > 0; i--) {
      removeSlot(power.name, i);
    }
  };

  const handlePowerHover = () => {
    if (power.powerSet) {
      setInfoPanelContent({
        type: 'power',
        powerName: power.name,
        powerSet: power.powerSet,
      });
    }
  };

  const handlePowerLeave = () => {
    clearInfoPanel();
  };

  const handleEnhancementHover = (index: number) => {
    setInfoPanelContent({
      type: 'slotted-enhancement',
      powerName: power.name,
      slotIndex: index,
    });
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!power.powerSet) return;

    if (
      infoPanelLocked &&
      lockedContent?.type === 'power' &&
      lockedContent.powerName === power.name
    ) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: power.powerSet,
      });
    }
  };

  return (
    <PowerRow
      name={power.name}
      iconSrc={getPowerIconPath(powersetName, power.icon)}
      size="lg"
      stackedLayout
      level={level}
      isLocked={isLocked}
      categoryBorder={CATEGORY_COLORS[power.category]}
      toggleSize={shouldShowToggle(power) ? 'md' : undefined}
      isActive={power.isActive ?? false}
      onToggle={() => togglePowerActive(power.name)}
      slots={power.slots}
      maxSlots={power.maxSlots}
      onRemove={handleRemove}
      onAddSlots={handleAddSlots}
      onRemoveSlot={(index) => removeSlot(power.name, index)}
      onRemoveAllSlots={handleRemoveAllSlots}
      onClearEnhancement={(index) => clearEnhancement(power.name, index)}
      onClearAllEnhancements={handleClearAllEnhancements}
      onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, power.powerSet, slotIndex)}
      onHover={handlePowerHover}
      onLeave={handlePowerLeave}
      onEnhancementHover={handleEnhancementHover}
      onRightClick={handleRightClick}
    />
  );
}

export default ChronologicalPowerSlot;
