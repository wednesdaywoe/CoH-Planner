/**
 * SelectedPowers component - shows powers that have been selected
 * Renders inline within a column (column headers are in PlannerPage)
 */

import { useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import type { PowerCategory } from '@/stores';
import type { SelectedPower, Power } from '@/types';
import { getPowerIconPath, getPowerset, hasGrantedPowers, getGrantedPowerGroup, GRANTED_POWER_GROUPS } from '@/data';
import { resolvePath } from '@/utils/paths';
import { Tooltip } from '@/components/ui';
import { PowerRow } from './PowerRow';
import { shouldShowToggle } from './power-row-utils';

interface SelectedPowersProps {
  category: 'primary' | 'secondary';
}

export function SelectedPowers({ category }: SelectedPowersProps) {
  const [collapsed, setCollapsed] = useState(false);
  const build = useBuildStore((s) => s.build);
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const togglePowerActive = useBuildStore((s) => s.togglePowerActive);
  const setActiveSubPower = useBuildStore((s) => s.setActiveSubPower);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  const selection = category === 'primary' ? build.primary : build.secondary;
  const powersetId = selection.id || '';

  // Sort powers by their position in the powerset (available level)
  // Exclude auto-granted sub-powers from the main list (they render under their parent)
  const powers = [...selection.powers]
    .filter(p => !p.isAutoGranted)
    .sort((a, b) => a.available - b.available);

  const handleRemove = (powerName: string) => {
    removePower(category as PowerCategory, powerName);
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

  const handlePowerHover = (power: SelectedPower) => {
    const powerPowerSet = power.powerSet || powersetId;
    if (powerPowerSet) {
      setInfoPanelContent({
        type: 'power',
        powerName: power.name,
        powerSet: powerPowerSet,
      });
    }
  };

  const handlePowerLeave = () => {
    clearInfoPanel();
  };

  const handleEnhancementHover = (powerName: string, slotIndex: number) => {
    setInfoPanelContent({
      type: 'slotted-enhancement',
      powerName,
      slotIndex,
    });
  };

  const handleClearEnhancement = (powerName: string, slotIndex: number) => {
    clearEnhancement(powerName, slotIndex);
  };

  const handleClearAllEnhancements = (powerName: string, totalSlots: number) => {
    for (let i = 0; i < totalSlots; i++) {
      clearEnhancement(powerName, i);
    }
  };

  const handlePowerRightClick = (e: React.MouseEvent, power: SelectedPower) => {
    e.preventDefault();
    const powerPowerSet = power.powerSet || powersetId;
    if (!powerPowerSet) return;

    if (infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === power.name) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: powerPowerSet,
      });
    }
  };

  if (powers.length === 0) {
    return (
      <div className="text-xs text-slate-500 italic py-4 text-center">
        {selection.name ? 'Select powers from the available list' : 'Select a powerset first'}
      </div>
    );
  }

  // Get powerset to look up sub-powers
  const powerset = getPowerset(powersetId);

  const getSubPowers = (parentPowerName: string): Power[] => {
    if (!powerset || !hasGrantedPowers(parentPowerName)) return [];
    const group = getGrantedPowerGroup(parentPowerName);
    if (!group || group.slottable) return []; // Slottable sub-powers are rendered differently
    return powerset.powers.filter(p =>
      group.grantedPowers.includes(p.name)
    );
  };

  /** Get slottable sub-powers from the build (form sub-powers like Bright Nova Bolt) */
  const getSlottableSubPowers = (parentPowerName: string): SelectedPower[] => {
    const group = GRANTED_POWER_GROUPS[parentPowerName];
    if (!group?.slottable) return [];
    return selection.powers.filter(p =>
      p.isAutoGranted && p.grantedByPower === parentPowerName
    );
  };

  return (
    <div>
      {/* Collapsible header */}
      <div
        className="flex items-center gap-1 mb-1.5 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
          ▶
        </span>
        <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          {selection.name || (category === 'primary' ? 'Primary' : 'Secondary')}
        </h4>
        <span className="text-[9px] text-slate-600">({powers.length})</span>
      </div>

      {/* Collapsible power list */}
      {!collapsed && (
        <div className="space-y-0.5">
          {powers.map((power) => {
            const isLocked = infoPanelLocked &&
              lockedContent?.type === 'power' &&
              lockedContent.powerName === power.name;

            const subPowers = getSubPowers(power.name);
            const grantedGroup = getGrantedPowerGroup(power.name);
            const slottableSubPowers = getSlottableSubPowers(power.name);

            return (
              <div key={power.name}>
                <PowerRow
                  name={power.name}
                  iconSrc={getPowerIconPath(selection.name, power.icon)}
                  size="lg"
                  stackedLayout
                  level={power.level}
                  isLocked={isLocked}
                  toggleSize={shouldShowToggle(power) ? 'md' : undefined}
                  isActive={power.isActive ?? false}
                  onToggle={() => togglePowerActive(power.name)}
                  slots={power.slots}
                  maxSlots={power.maxSlots}
                  onRemove={() => handleRemove(power.name)}
                  onAddSlots={(count) => handleAddSlots(power.name, count)}
                  onRemoveSlot={(index) => handleRemoveSlot(power.name, index)}
                  onRemoveAllSlots={() => handleRemoveAllSlots(power.name, power.slots.length)}
                  onClearEnhancement={(index) => handleClearEnhancement(power.name, index)}
                  onClearAllEnhancements={() => handleClearAllEnhancements(power.name, power.slots.length)}
                  onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, powersetId, slotIndex)}
                  onHover={() => handlePowerHover(power)}
                  onLeave={handlePowerLeave}
                  onEnhancementHover={(index) => handleEnhancementHover(power.name, index)}
                  onRightClick={(e) => handlePowerRightClick(e, power)}
                />

                {/* Granted sub-powers display (simple toggles) */}
                {subPowers.length > 0 && (
                  <GrantedSubPowers
                    subPowers={subPowers}
                    parentPower={power}
                    powersetName={selection.name}
                    isMutuallyExclusive={grantedGroup?.mutuallyExclusive ?? false}
                    activeSubPower={power.activeSubPower}
                    onSetActive={(subPowerName) => setActiveSubPower(power.name, subPowerName)}
                  />
                )}

                {/* Slottable form sub-powers (full PowerRow with slots) */}
                {slottableSubPowers.length > 0 && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-700/50 pl-1">
                    {slottableSubPowers.map((subPower) => {
                      const subIsLocked = infoPanelLocked &&
                        lockedContent?.type === 'power' &&
                        lockedContent.powerName === subPower.name;

                      return (
                        <PowerRow
                          key={subPower.name}
                          name={subPower.name}
                          iconSrc={getPowerIconPath(selection.name, subPower.icon)}
                          size="lg"
                          stackedLayout
                          isLocked={subIsLocked}
                          showRemove={false}
                          showAutoLabel
                          slots={subPower.slots}
                          maxSlots={subPower.maxSlots}
                          onAddSlots={(count) => handleAddSlots(subPower.name, count)}
                          onRemoveSlot={(index) => handleRemoveSlot(subPower.name, index)}
                          onRemoveAllSlots={() => handleRemoveAllSlots(subPower.name, subPower.slots.length)}
                          onClearEnhancement={(index) => handleClearEnhancement(subPower.name, index)}
                          onClearAllEnhancements={() => handleClearAllEnhancements(subPower.name, subPower.slots.length)}
                          onOpenPicker={(slotIndex) => openEnhancementPicker(subPower.name, powersetId, slotIndex)}
                          onHover={() => handlePowerHover(subPower)}
                          onLeave={handlePowerLeave}
                          onEnhancementHover={(index) => handleEnhancementHover(subPower.name, index)}
                          onRightClick={(e) => handlePowerRightClick(e, subPower)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// GRANTED SUB-POWERS COMPONENT
// ============================================

interface GrantedSubPowersProps {
  subPowers: Power[];
  parentPower: SelectedPower;
  powersetName: string;
  isMutuallyExclusive: boolean;
  activeSubPower?: string;
  onSetActive: (subPowerName: string | null) => void;
}

/**
 * Displays granted sub-powers below a parent power
 * For mutually exclusive powers (like Adaptation stances), shows radio-style selection
 */
function GrantedSubPowers({
  subPowers,
  powersetName,
  isMutuallyExclusive,
  activeSubPower,
  onSetActive,
}: GrantedSubPowersProps) {
  return (
    <div className="ml-6 mt-0.5 space-y-0.5">
      {subPowers.map((subPower) => {
        const isActive = activeSubPower === subPower.name;

        return (
          <div
            key={subPower.name}
            className={`
              flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm
              border transition-colors
              ${isActive
                ? 'bg-slate-700/50 border-green-600/50'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }
            `}
          >
            {/* Sub-power icon and name */}
            <img
              src={getPowerIconPath(powersetName, subPower.icon)}
              alt=""
              className="w-4 h-4 rounded-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
              }}
            />
            <span className={`text-xs truncate flex-1 ${isActive ? 'text-green-300' : 'text-slate-400'}`}>
              {subPower.name}
            </span>

            {/* Toggle/Radio button for sub-power */}
            {isMutuallyExclusive ? (
              <Tooltip
                content={
                  isActive
                    ? `${subPower.name} is active`
                    : `Activate ${subPower.name}`
                }
              >
                <button
                  onClick={() => onSetActive(isActive ? null : subPower.name)}
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    transition-colors
                    ${isActive
                      ? 'border-green-500 bg-green-500'
                      : 'border-slate-500 hover:border-green-400'
                    }
                  `}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              </Tooltip>
            ) : (
              <Tooltip
                content={
                  isActive
                    ? `${subPower.name} ON`
                    : `${subPower.name} OFF`
                }
              >
                <button
                  onClick={() => onSetActive(isActive ? null : subPower.name)}
                  className={`
                    relative w-6 h-3 rounded-full transition-colors duration-200
                    ${isActive ? 'bg-green-600' : 'bg-slate-600'}
                  `}
                >
                  <span
                    className={`
                      absolute top-[2px] left-[2px] w-2 h-2 rounded-full bg-white shadow-sm
                      transition-transform duration-200
                      ${isActive ? 'translate-x-3' : 'translate-x-0'}
                    `}
                  />
                </button>
              </Tooltip>
            )}
          </div>
        );
      })}
    </div>
  );
}
