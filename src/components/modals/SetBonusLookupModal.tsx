/**
 * SetBonusLookupModal - Mids-style set bonus lookup
 *
 * Cascading filters: Effect → Type → Strength
 * Optional "My Powers Only" toggle filters to sets the user can actually slot.
 * Results table: Set Name, Level Range, Set Type, Pieces Required
 */

import { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { useBuild } from '@/stores/buildStore';
import { IO_SET_TYPE_TO_CATEGORY } from '@/data/io-sets';
import type { IOSetCategory } from '@/types';
import {
  getEffects,
  getTypesForEffect,
  getStrengthsForFilter,
  searchBonusLookup,
  type LookupEntry,
} from '@/data/set-bonus-index';

// ============================================
// SUB-COMPONENTS
// ============================================

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
}

function FilterSelect({ label, value, onChange, options, disabled, placeholder }: FilterSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-400 whitespace-nowrap min-w-[60px]">{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 text-sm bg-gray-800 border border-gray-700 rounded px-2.5 py-1.5 text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ============================================
// BUILD POWER HELPERS
// ============================================

/** Collect all IO set categories that the user's current powers can accept */
function useSlottableSetCategories(): Set<IOSetCategory> {
  const build = useBuild();

  return useMemo(() => {
    const categories = new Set<IOSetCategory>();

    const collectFrom = (powers: { allowedSetCategories?: IOSetCategory[] }[]) => {
      for (const power of powers) {
        if (power.allowedSetCategories) {
          for (const cat of power.allowedSetCategories) {
            categories.add(cat);
          }
        }
      }
    };

    if (build.primary) collectFrom(build.primary.powers);
    if (build.secondary) collectFrom(build.secondary.powers);
    for (const pool of build.pools) collectFrom(pool.powers);
    if (build.epicPool) collectFrom(build.epicPool.powers);
    if (build.inherents) collectFrom(build.inherents);

    return categories;
  }, [build.primary, build.secondary, build.pools, build.epicPool, build.inherents]);
}

// ============================================
// MAIN COMPONENT
// ============================================

interface SetBonusLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetBonusLookupModal({ isOpen, onClose }: SetBonusLookupModalProps) {
  const [selectedEffect, setSelectedEffect] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStrength, setSelectedStrength] = useState('');
  const [myPowersOnly, setMyPowersOnly] = useState(false);

  const slottableCategories = useSlottableSetCategories();

  // Available effects (static list from data)
  const effects = useMemo(() => getEffects(), []);

  // Types available for selected effect (data-driven)
  const types = useMemo(() => {
    if (!selectedEffect) return [];
    return getTypesForEffect(selectedEffect);
  }, [selectedEffect]);

  // Strengths available for selected effect + type (data-driven)
  const strengths = useMemo(() => {
    if (!selectedEffect) return [];
    return getStrengthsForFilter(selectedEffect, selectedType || undefined);
  }, [selectedEffect, selectedType]);

  // Results based on current filters + optional "my powers only"
  const results = useMemo(() => {
    if (!selectedEffect) return [];
    let entries = searchBonusLookup({
      effect: selectedEffect,
      effectType: selectedType || undefined,
      strength: selectedStrength ? parseFloat(selectedStrength) : undefined,
    });

    if (myPowersOnly && slottableCategories.size > 0) {
      entries = entries.filter(entry => {
        const mappedCategory = IO_SET_TYPE_TO_CATEGORY[entry.setType] as IOSetCategory | undefined;
        return mappedCategory && slottableCategories.has(mappedCategory);
      });
    }

    return entries;
  }, [selectedEffect, selectedType, selectedStrength, myPowersOnly, slottableCategories]);

  // Handlers for cascading resets
  const handleEffectChange = (value: string) => {
    setSelectedEffect(value);
    setSelectedType('');
    setSelectedStrength('');
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setSelectedStrength('');
  };

  const handleStrengthChange = (value: string) => {
    setSelectedStrength(value);
  };

  // Format strength values for display (truncate to 2 decimal places)
  const strengthOptions = useMemo(() =>
    strengths.map(v => ({
      value: String(v),
      label: `${parseFloat(v.toFixed(2))}%`,
    })),
    [strengths]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Bonus Lookup" size="full">
      <div className="flex flex-col h-[75vh]">
        {/* Filter section */}
        <div className="px-4 pt-3 pb-3 space-y-2 border-b border-gray-700">
          <FilterSelect
            label="Effect"
            value={selectedEffect}
            onChange={handleEffectChange}
            options={effects.map(e => ({ value: e, label: e }))}
            placeholder="Select an effect..."
          />
          <FilterSelect
            label="Type"
            value={selectedType}
            onChange={handleTypeChange}
            options={types.map(t => ({ value: t, label: t }))}
            disabled={types.length === 0}
            placeholder={types.length === 0 ? 'N/A' : 'Any'}
          />
          <FilterSelect
            label="Strength"
            value={selectedStrength}
            onChange={handleStrengthChange}
            options={strengthOptions}
            disabled={!selectedEffect}
            placeholder="Any"
          />
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={myPowersOnly}
              onChange={(e) => setMyPowersOnly(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-xs text-gray-400">Only show sets I can slot</span>
          </label>
        </div>

        {/* Results header */}
        {selectedEffect && (
          <div className="grid grid-cols-[1fr_90px_1fr_80px] gap-2 px-4 py-2 border-b border-gray-700 text-[11px] text-gray-500 uppercase tracking-wide">
            <span>Set Name</span>
            <span>Level Range</span>
            <span>Set Type</span>
            <span className="text-right">Pieces</span>
          </div>
        )}

        {/* Results list */}
        <div className="flex-1 overflow-y-auto">
          {!selectedEffect ? (
            <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
              Select an effect to search
            </div>
          ) : results.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
              No matching set bonuses found
            </div>
          ) : (
            <div>
              {results.map((entry, i) => (
                <ResultRow
                  key={`${entry.setId}-${entry.piecesRequired}-${entry.effectType}-${i}`}
                  entry={entry}
                  dimmed={myPowersOnly ? false : !canSlot(entry, slottableCategories)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with result count */}
        {selectedEffect && (
          <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ============================================
// RESULT ROW
// ============================================

function canSlot(entry: LookupEntry, slottableCategories: Set<IOSetCategory>): boolean {
  if (slottableCategories.size === 0) return true;
  const mapped = IO_SET_TYPE_TO_CATEGORY[entry.setType] as IOSetCategory | undefined;
  return !!mapped && slottableCategories.has(mapped);
}

function ResultRow({ entry, dimmed }: { entry: LookupEntry; dimmed: boolean }) {
  return (
    <div
      className={`grid grid-cols-[1fr_90px_1fr_80px] gap-2 px-4 py-1.5 hover:bg-gray-800/50 text-sm border-b border-gray-800/30 ${
        dimmed ? 'opacity-40' : ''
      }`}
    >
      <span className="text-gray-200 truncate">{entry.setName}</span>
      <span className="text-gray-400">{entry.levelRange}</span>
      <span className="text-gray-400 truncate">{entry.setType}</span>
      <span className="text-green-400 text-right">{entry.piecesRequired}</span>
    </div>
  );
}
