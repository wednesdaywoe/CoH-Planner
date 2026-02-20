/**
 * ChronologicalInherentsSection - Inherent powers section for the chronological view
 *
 * Displays Fitness, Basic, and Archetype inherent powers in a collapsible section.
 */

import { useMemo, useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { resolvePath } from '@/utils/paths';
import { DraggableSlotGhost } from './DraggableSlotGhost';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import type { SelectedPower } from '@/types';

/** Get the icon path for an inherent power based on its category */
function getInherentIconPath(power: SelectedPower): string {
  const category = power.inherentCategory || 'basic';
  const lowercaseIcon = power.icon?.toLowerCase() || 'unknown.png';

  switch (category) {
    case 'fitness':
      return resolvePath(`/img/Powers/Fitness Powers Icons/${lowercaseIcon}`);
    case 'archetype':
      return resolvePath(`/img/Powers/Archetype Inherent Powers icons/${lowercaseIcon}`);
    case 'prestige':
    case 'basic':
    default:
      return resolvePath(`/img/Powers/Inherent Powers Icons/${lowercaseIcon}`);
  }
}

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
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

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

  const handleSlotClick = (powerName: string, slotIndex: number) => {
    openEnhancementPicker(powerName, 'Inherent', slotIndex);
  };

  const handleSlotRightClick = (
    e: React.MouseEvent,
    power: SelectedPower,
    index: number,
    hasEnhancement: boolean
  ) => {
    e.preventDefault();
    if (hasEnhancement) {
      clearEnhancement(power.name, index);
      return;
    }
    if (index > 0) {
      removeSlot(power.name, index);
    }
  };

  const handleAddSlots = (powerName: string, count: number) => {
    for (let i = 0; i < count; i++) {
      addSlot(powerName);
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
              onSlotClick={handleSlotClick}
              onSlotRightClick={handleSlotRightClick}
              onAddSlots={handleAddSlots}
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
              onSlotClick={handleSlotClick}
              onSlotRightClick={handleSlotRightClick}
              onAddSlots={handleAddSlots}
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
              onSlotClick={handleSlotClick}
              onSlotRightClick={handleSlotRightClick}
              onAddSlots={handleAddSlots}
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
  onSlotClick: (powerName: string, slotIndex: number) => void;
  onSlotRightClick: (
    e: React.MouseEvent,
    power: SelectedPower,
    index: number,
    hasEnhancement: boolean
  ) => void;
  onAddSlots: (powerName: string, count: number) => void;
}

function InherentGroup({
  title,
  powers,
  isPowerLocked,
  onPowerHover,
  onPowerLeave,
  onPowerRightClick,
  onEnhancementHover,
  onSlotClick,
  onSlotRightClick,
  onAddSlots,
}: InherentGroupProps) {
  const sortedPowers = [...powers].sort((a, b) => a.available - b.available);

  return (
    <div>
      <div className="text-[10px] font-medium text-slate-500 uppercase mb-1">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {sortedPowers.map((power) => {
          const isLocked = isPowerLocked(power.name);
          const hasSlots = power.slots.length > 0;

          return (
            <div
              key={power.name}
              className={`
                flex flex-col px-1.5 py-1 bg-slate-800/50 border rounded-sm transition-colors
                ${
                  isLocked
                    ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800/50'
                    : 'border-slate-700/50 hover:border-slate-600'
                }
              `}
              onMouseLeave={onPowerLeave}
            >
              {/* Row 1: icon + name */}
              <div
                className="flex items-center min-w-0 cursor-default"
                onMouseEnter={() => onPowerHover(power)}
                onContextMenu={(e) => onPowerRightClick(e, power)}
              >
                <img
                  src={getInherentIconPath(power)}
                  alt=""
                  className="w-4 h-4 rounded-sm flex-shrink-0 mr-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                  }}
                />
                <span className="text-xs text-slate-400 truncate">{power.name}</span>
              </div>

              {/* Row 2: slots (indented to align under icon) */}
              {(hasSlots || power.maxSlots > 0) && (
                <div className="flex items-center mt-0.5">
                  <div className="w-5 flex-shrink-0" />{/* aligns under icon */}
                  <div className="flex gap-0.5 items-center">
                    {power.slots.map((slot, index) => (
                      <div
                        key={index}
                        onClick={() => onSlotClick(power.name, index)}
                        onMouseEnter={() =>
                          slot ? onEnhancementHover(power.name, index) : onPowerHover(power)
                        }
                        onContextMenu={(e) => onSlotRightClick(e, power, index, !!slot)}
                        className={`
                          w-4 h-4 rounded-full border flex items-center justify-center
                          text-[7px] cursor-pointer hover:scale-110 transition-transform
                          ${
                            slot
                              ? 'border-transparent'
                              : 'border-slate-600 bg-slate-700/50 hover:border-blue-500'
                          }
                        `}
                      >
                        {slot ? (
                          <SlottedEnhancementIcon enhancement={slot} size={16} />
                        ) : (
                          <span className="text-slate-400">+</span>
                        )}
                      </div>
                    ))}

                    {power.maxSlots > power.slots.length && (
                      <DraggableSlotGhost
                        powerName={power.name}
                        currentSlots={power.slots.length}
                        maxSlots={power.maxSlots}
                        onAddSlots={(count) => onAddSlots(power.name, count)}
                        size="xs"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChronologicalInherentsSection;
