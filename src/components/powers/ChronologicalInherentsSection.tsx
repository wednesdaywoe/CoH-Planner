/**
 * ChronologicalInherentsSection - Inherent powers section for the chronological view
 *
 * Displays Fitness, Basic, and Archetype inherent powers in a collapsible section.
 */

import { useMemo, useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { PowerRow } from './PowerRow';
import { getInherentIconPath } from './power-row-utils';
import type { SelectedPower } from '@/types';

interface ChronologicalInherentsSectionProps {
  inherents: SelectedPower[];
}

export function ChronologicalInherentsSection({ inherents }: ChronologicalInherentsSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);

  // Group inherent powers by category
  const inherentGroups = useMemo(() => {
    const groups: Record<string, SelectedPower[]> = {
      fitness: [],
      basic: [],
      archetype: [],
    };

    for (const power of inherents) {
      const category = power.inherentCategory || 'basic';
      // Skip prestige powers for cleaner display
      if (category === 'prestige') continue;
      if (groups[category]) {
        groups[category].push(power);
      }
    }

    return groups;
  }, [inherents]);

  const handlePowerHover = (power: SelectedPower) => {
    setInfoPanelContent({
      type: 'power',
      powerName: power.name,
      powerSet: 'Inherent',
    });
  };

  const handlePowerLeave = () => {
    clearInfoPanel();
  };

  const handlePowerRightClick = (e: React.MouseEvent, power: SelectedPower) => {
    e.preventDefault();
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
        powerSet: 'Inherent',
      });
    }
  };

  const handleEnhancementHover = (powerName: string, slotIndex: number) => {
    setInfoPanelContent({
      type: 'slotted-enhancement',
      powerName,
      slotIndex,
    });
  };

  const handleAddSlots = (powerName: string, count: number) => {
    for (let i = 0; i < count; i++) {
      addSlot(powerName);
    }
  };

  const handleRemoveSlot = (powerName: string, slotIndex: number) => {
    removeSlot(powerName, slotIndex);
  };

  const handleRemoveAllSlots = (powerName: string, totalSlots: number) => {
    for (let i = totalSlots - 1; i > 0; i--) {
      removeSlot(powerName, i);
    }
  };

  const handleClearEnhancement = (powerName: string, slotIndex: number) => {
    clearEnhancement(powerName, slotIndex);
  };

  const handleClearAllEnhancements = (powerName: string, totalSlots: number) => {
    for (let i = 0; i < totalSlots; i++) {
      clearEnhancement(powerName, i);
    }
  };

  const isPowerLocked = (powerName: string) => {
    return (
      infoPanelLocked &&
      lockedContent?.type === 'power' &&
      lockedContent.powerName === powerName
    );
  };

  // Count total inherents (excluding prestige)
  const totalCount =
    inherentGroups.fitness.length +
    inherentGroups.basic.length +
    inherentGroups.archetype.length;

  if (totalCount === 0) return null;

  return (
    <div className="border-t border-slate-700 bg-slate-900">
      {/* Section header */}
      <div
        className="flex items-center gap-2 px-2 py-1.5 bg-slate-800 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span
          className={`text-xs text-slate-500 transition-transform ${
            collapsed ? '' : 'rotate-90'
          }`}
        >
          ▶
        </span>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Inherent Powers
        </h3>
        <span className="text-[10px] text-slate-600">({totalCount})</span>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <div className="p-2 space-y-2">
          {/* Fitness powers */}
          {inherentGroups.fitness.length > 0 && (
            <InherentGroup
              title="Fitness"
              powers={inherentGroups.fitness}
              isPowerLocked={isPowerLocked}
              onPowerHover={handlePowerHover}
              onPowerLeave={handlePowerLeave}
              onPowerRightClick={handlePowerRightClick}
              onEnhancementHover={handleEnhancementHover}
              onClearEnhancement={handleClearEnhancement}
              onAddSlots={handleAddSlots}
              onRemoveSlot={handleRemoveSlot}
              onRemoveAllSlots={handleRemoveAllSlots}
              onClearAllEnhancements={handleClearAllEnhancements}
            />
          )}

          {/* Basic powers (Brawl, Rest, Sprint) */}
          {inherentGroups.basic.length > 0 && (
            <InherentGroup
              title="Basic"
              powers={inherentGroups.basic}
              isPowerLocked={isPowerLocked}
              onPowerHover={handlePowerHover}
              onPowerLeave={handlePowerLeave}
              onPowerRightClick={handlePowerRightClick}
              onEnhancementHover={handleEnhancementHover}
              onClearEnhancement={handleClearEnhancement}
              onAddSlots={handleAddSlots}
              onRemoveSlot={handleRemoveSlot}
              onRemoveAllSlots={handleRemoveAllSlots}
              onClearAllEnhancements={handleClearAllEnhancements}
            />
          )}

          {/* Archetype inherent */}
          {inherentGroups.archetype.length > 0 && (
            <InherentGroup
              title="Archetype"
              powers={inherentGroups.archetype}
              isPowerLocked={isPowerLocked}
              onPowerHover={handlePowerHover}
              onPowerLeave={handlePowerLeave}
              onPowerRightClick={handlePowerRightClick}
              onEnhancementHover={handleEnhancementHover}
              onClearEnhancement={handleClearEnhancement}
              onAddSlots={handleAddSlots}
              onRemoveSlot={handleRemoveSlot}
              onRemoveAllSlots={handleRemoveAllSlots}
              onClearAllEnhancements={handleClearAllEnhancements}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface InherentGroupProps {
  title: string;
  powers: SelectedPower[];
  isPowerLocked: (name: string) => boolean;
  onPowerHover: (power: SelectedPower) => void;
  onPowerLeave: () => void;
  onPowerRightClick: (e: React.MouseEvent, power: SelectedPower) => void;
  onEnhancementHover: (powerName: string, slotIndex: number) => void;
  onClearEnhancement: (powerName: string, slotIndex: number) => void;
  onAddSlots: (powerName: string, count: number) => void;
  onRemoveSlot: (powerName: string, slotIndex: number) => void;
  onRemoveAllSlots: (powerName: string, totalSlots: number) => void;
  onClearAllEnhancements: (powerName: string, totalSlots: number) => void;
}

function InherentGroup({
  title,
  powers,
  isPowerLocked,
  onPowerHover,
  onPowerLeave,
  onPowerRightClick,
  onEnhancementHover,
  onClearEnhancement,
  onAddSlots,
  onRemoveSlot,
  onRemoveAllSlots,
  onClearAllEnhancements,
}: InherentGroupProps) {
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);
  const sortedPowers = [...powers].sort((a, b) => a.available - b.available);

  return (
    <div>
      <div className="text-[10px] font-medium text-slate-500 uppercase mb-1">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {sortedPowers.map((power) => {
          const isLocked = isPowerLocked(power.name);

          return (
            <PowerRow
              key={power.name}
              name={power.name}
              iconSrc={getInherentIconPath(power)}
              size="xs"
              muted
              showRemove={false}
              isLocked={isLocked}
              slots={power.slots}
              maxSlots={power.maxSlots}
              onAddSlots={(count) => onAddSlots(power.name, count)}
              onRemoveSlot={(index) => onRemoveSlot(power.name, index)}
              onRemoveAllSlots={() => onRemoveAllSlots(power.name, power.slots.length)}
              onClearEnhancement={(index) => onClearEnhancement(power.name, index)}
              onClearAllEnhancements={() => onClearAllEnhancements(power.name, power.slots.length)}
              onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, 'Inherent', slotIndex)}
              onHover={() => onPowerHover(power)}
              onLeave={onPowerLeave}
              onEnhancementHover={(index) => onEnhancementHover(power.name, index)}
              onRightClick={(e) => onPowerRightClick(e, power)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ChronologicalInherentsSection;
