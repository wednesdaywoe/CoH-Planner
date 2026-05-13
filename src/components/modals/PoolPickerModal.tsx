/**
 * PoolPickerModal — pool/epic-pool picker with inline expand/collapse rows.
 *
 * The modal renders a fixed-size scrollable list of pool rows. Clicking a
 * row expands it inline to reveal that pool's powers; clicking a power adds
 * the pool AND that power. Only one row is expanded at a time.
 */

import { useState, useMemo, useEffect } from 'react';
import { Modal } from './Modal';
import { PowerItem } from '@/components/powers/AvailablePowers';
import {
  getAllPowerPools,
  getPowerPool,
  getEpicPool,
  getEpicPoolsForArchetype,
  getExcludedPools,
  isPowerAvailableInPool,
  isEpicPowerAvailable,
} from '@/data';
import { useUIStore } from '@/stores';
import type { Power } from '@/types';

export type PoolPickerMode = 'pool' | 'epic';

interface PoolPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: PoolPickerMode;
  /** Required for epic mode */
  archetypeId?: string;
  /** Build level (used for power availability checks) */
  level: number;
  /** IDs of pools the user has already added (to exclude from the list). */
  excludeIds: Set<string>;
  /** Called when the user finalizes a selection. If powerInternalName is omitted, just add the pool. */
  onSelect: (poolId: string, powerInternalName?: string) => void;
}

interface PoolListEntry {
  id: string;
  name: string;
  description: string;
  /** If non-empty, the entry is disabled and this string explains why. */
  disabledReason: string;
}

export function PoolPickerModal({
  isOpen,
  onClose,
  mode,
  archetypeId,
  level,
  excludeIds,
  onSelect,
}: PoolPickerModalProps) {
  const [expandedPoolId, setExpandedPoolId] = useState<string | null>(null);

  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);
  const openPowerInfoModal = useUIStore((s) => s.openPowerInfoModal);

  // Reset expansion whenever the modal is reopened
  useEffect(() => {
    if (isOpen) setExpandedPoolId(null);
  }, [isOpen]);

  const poolEntries = useMemo<PoolListEntry[]>(() => {
    if (mode === 'pool') {
      const all = getAllPowerPools();
      return Object.entries(all)
        .filter(([id]) => id !== 'fitness' && !excludeIds.has(id))
        .map(([id, pool]) => {
          const excluded = getExcludedPools(id);
          const conflictId = excluded?.find((c) => excludeIds.has(c));
          if (conflictId) {
            const conflict = all[conflictId];
            return {
              id,
              name: pool.name,
              description: pool.description,
              disabledReason: `Mutually exclusive with ${conflict?.name || conflictId}`,
            };
          }
          return { id, name: pool.name, description: pool.description, disabledReason: '' };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    if (!archetypeId) return [];
    return getEpicPoolsForArchetype(archetypeId)
      .filter((pool) => !excludeIds.has(pool.id))
      .map((pool) => ({
        id: pool.id,
        name: pool.displayName || pool.name,
        description: pool.description,
        disabledReason: '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [mode, archetypeId, excludeIds]);

  const accent: 'blue' | 'purple' = mode === 'pool' ? 'blue' : 'purple';
  const accentText = accent === 'blue' ? 'text-blue-400' : 'text-purple-400';
  const accentBorderHover =
    accent === 'blue' ? 'hover:border-blue-500' : 'hover:border-purple-500';

  const handleToggleExpand = (entry: PoolListEntry) => {
    if (entry.disabledReason) return;
    setExpandedPoolId((curr) => (curr === entry.id ? null : entry.id));
  };

  const handleAddPoolOnly = (poolId: string) => {
    onSelect(poolId);
    onClose();
  };

  const handlePickPower = (poolId: string, power: Power) => {
    onSelect(poolId, power.internalName);
    onClose();
  };

  const isPowerLocked = (powerName: string) =>
    infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === powerName;

  const handlePowerHover = (poolId: string, power: Power) => {
    setInfoPanelContent({
      type: 'power',
      powerName: power.internalName,
      powerSet: poolId,
    });
  };

  const handleLockToggle = (poolId: string, power: Power) => {
    if (isPowerLocked(power.internalName)) {
      unlockInfoPanel();
      return;
    }
    lockInfoPanel({
      type: 'power',
      powerName: power.internalName,
      powerSet: poolId,
    });
    // In the picker modal the side InfoPanel is occluded by the modal
    // overlay, so just locking it would feel like nothing happened.
    // Also pop the dedicated Power Info modal — same as the (i) info
    // button on mobile — so right-click actually surfaces the info.
    openPowerInfoModal();
  };

  const handleShowInfo = (poolId: string, power: Power, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    lockInfoPanel({
      type: 'power',
      powerName: power.internalName,
      powerSet: poolId,
    });
    openPowerInfoModal();
  };

  const title = mode === 'pool' ? 'Add a Power Pool' : 'Choose Epic / Patron Pool';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      {/* Fixed-height scroll area so expanding a row never resizes the modal */}
      <div className="h-[60vh] overflow-y-auto p-2 space-y-1">
        <p className="text-[11px] text-slate-500 px-2 pb-1">
          Click a pool to preview its powers, then choose a starting power — or add the pool empty.
        </p>

        {poolEntries.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400 italic">
            {mode === 'pool'
              ? 'No more pools available to add.'
              : 'No epic pools available for this archetype.'}
          </div>
        ) : (
          poolEntries.map((entry) => {
            const isExpanded = expandedPoolId === entry.id;
            const disabled = !!entry.disabledReason;
            return (
              <div
                key={entry.id}
                className={`
                  rounded border bg-slate-800
                  ${disabled
                    ? 'opacity-40 border-slate-700'
                    : isExpanded
                      ? `border-slate-600`
                      : `border-slate-700 ${accentBorderHover}`}
                  transition-colors
                `}
              >
                {/* Row header */}
                <button
                  type="button"
                  onClick={() => handleToggleExpand(entry)}
                  disabled={disabled}
                  aria-expanded={isExpanded}
                  className={`
                    w-full text-left px-3 py-2 flex items-baseline justify-between gap-2
                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-baseline gap-2 min-w-0 flex-1">
                    <span
                      className={`text-[10px] text-slate-500 transition-transform inline-block w-2 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    >
                      ▶
                    </span>
                    <span className={`text-sm font-semibold ${accentText} truncate`}>
                      {entry.name}
                    </span>
                  </div>
                  {disabled ? (
                    <span className="text-[10px] text-amber-400/80 italic flex-shrink-0">
                      {entry.disabledReason}
                    </span>
                  ) : !isExpanded && entry.description ? (
                    <span className="text-[11px] text-slate-500 truncate flex-shrink min-w-0 max-w-[60%]">
                      {entry.description}
                    </span>
                  ) : null}
                </button>

                {/* Expanded body */}
                {isExpanded && !disabled && (
                  <ExpandedPoolBody
                    entry={entry}
                    mode={mode}
                    level={level}
                    accent={accent}
                    isPowerLocked={isPowerLocked}
                    onAddPoolOnly={() => handleAddPoolOnly(entry.id)}
                    onPickPower={(power) => handlePickPower(entry.id, power)}
                    onPowerHover={(power) => handlePowerHover(entry.id, power)}
                    onLockToggle={(power) => handleLockToggle(entry.id, power)}
                    onShowInfo={(power, e) => handleShowInfo(entry.id, power, e)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}

// ============================================
// EXPANDED POOL BODY (inline power list)
// ============================================

interface ExpandedPoolBodyProps {
  entry: PoolListEntry;
  mode: PoolPickerMode;
  level: number;
  accent: 'blue' | 'purple';
  isPowerLocked: (name: string) => boolean;
  onAddPoolOnly: () => void;
  onPickPower: (power: Power) => void;
  onPowerHover: (power: Power) => void;
  onLockToggle: (power: Power) => void;
  onShowInfo: (power: Power, e?: React.MouseEvent) => void;
}

function ExpandedPoolBody({
  entry,
  mode,
  level,
  accent,
  isPowerLocked,
  onAddPoolOnly,
  onPickPower,
  onPowerHover,
  onLockToggle,
  onShowInfo,
}: ExpandedPoolBodyProps) {
  const data = useMemo(() => {
    if (mode === 'pool') {
      const pool = getPowerPool(entry.id);
      if (!pool) return null;
      return { powers: pool.powers as Power[], name: pool.name };
    }
    const epic = getEpicPool(entry.id);
    if (!epic) return null;
    return { powers: epic.powers as Power[], name: epic.displayName || epic.name };
  }, [entry.id, mode]);

  if (!data) return null;

  const visiblePowers = data.powers.filter((p) => p.available >= 0);

  const checkAvailability = (power: Power): boolean => {
    if (mode === 'pool') return isPowerAvailableInPool(entry.id, power, level, []);
    return isEpicPowerAvailable(power, level, []);
  };

  return (
    <div className="border-t border-slate-700 px-2 pb-2 pt-1.5 space-y-0.5">
      {entry.description && (
        <p className="text-[11px] text-slate-400 leading-snug px-1 pb-1.5">
          {entry.description}
        </p>
      )}

      <div className="flex justify-end pb-1">
        <button
          type="button"
          onClick={onAddPoolOnly}
          className="text-[11px] px-2 py-1 rounded border border-slate-600 hover:border-slate-400 text-slate-200 hover:bg-slate-700/50 transition-colors"
        >
          + Add pool without picking a power
        </button>
      </div>

      {visiblePowers.length === 0 ? (
        <div className="text-xs text-slate-500 italic text-center py-2">
          No selectable powers in this pool.
        </div>
      ) : (
        visiblePowers.map((power) => {
          const isAvailable = checkAvailability(power);
          const isDisabled = !isAvailable;
          return (
            <PowerItem
              key={power.name}
              power={power}
              powersetId={entry.id}
              powersetName={data.name}
              accentColor={accent}
              isSelected={false}
              isAvailable={isAvailable}
              isDisabled={isDisabled}
              isLocked={isPowerLocked(power.internalName)}
              onSelect={() => onPickPower(power)}
              onHover={() => onPowerHover(power)}
              onLeave={() => { /* keep last preview */ }}
              onLockToggle={() => onLockToggle(power)}
              onShowInfo={(e) => onShowInfo(power, e)}
            />
          );
        })
      )}
    </div>
  );
}
