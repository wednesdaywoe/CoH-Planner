/**
 * PowersetCompareModal — Compare two powersets side-by-side with bar charts.
 * Smart auto-pairing groups powers by role (attacks, buffs, controls, etc.)
 * with manual tap-to-swap adjustment.
 */

import { useState, useMemo, useCallback } from 'react';
import { Modal, ModalBody } from './Modal';
import { Select } from '@/components/ui';
import { useUIStore } from '@/stores';
import { getArchetype, getArchetypeIds } from '@/data/archetypes';
import { getPowerset } from '@/data/powersets';
import { calculateDamageWithATTable } from '@/utils/calculations/damage';
import type { Power, ScaledDamageEntry } from '@/types/power';
import type { ArchetypeId } from '@/types/archetype';
import type { SelectOption } from '@/components/ui/Select';

// ============================================
// TYPES
// ============================================

type CompareMetric =
  | 'baseDamage' | 'dpa' | 'dps' | 'endEfficiency'
  | 'recharge' | 'range' | 'endCost' | 'castTime';

type PowerCategory =
  | 'attack-st' | 'attack-aoe' | 'attack-cone' | 'attack-chain'
  | 'buff' | 'control' | 'toggle-defense' | 'toggle-other'
  | 'passive' | 'auto' | 'pet';

interface PowerPair {
  category: PowerCategory;
  powerA: Power | null;
  powerB: Power | null;
}

// ============================================
// CONSTANTS
// ============================================

const METRIC_OPTIONS: SelectOption[] = [
  { value: 'baseDamage', label: 'Base Damage' },
  { value: 'dpa', label: 'DPA (Dmg/Activation)' },
  { value: 'dps', label: 'DPS (Dmg/Cycle)' },
  { value: 'endEfficiency', label: 'Dmg/End' },
  { value: 'recharge', label: 'Recharge' },
  { value: 'range', label: 'Range' },
  { value: 'endCost', label: 'End Cost' },
  { value: 'castTime', label: 'Cast Time' },
];

const CATEGORY_LABELS: Record<PowerCategory, string> = {
  'attack-st': 'Single Target Attacks',
  'attack-aoe': 'AoE Attacks',
  'attack-cone': 'Cone Attacks',
  'attack-chain': 'Chain Attacks',
  'buff': 'Buffs / Utility',
  'control': 'Control',
  'toggle-defense': 'Defense Toggles',
  'toggle-other': 'Other Toggles',
  'passive': 'Passives',
  'auto': 'Auto Powers',
  'pet': 'Pets / Summons',
};

const CATEGORY_ORDER: PowerCategory[] = [
  'attack-st', 'attack-aoe', 'attack-cone', 'attack-chain',
  'buff', 'control', 'toggle-defense', 'toggle-other',
  'passive', 'auto', 'pet',
];

// ============================================
// HELPERS
// ============================================

function normalizeDamageArray(damage: ScaledDamageEntry[] | ScaledDamageEntry | undefined): ScaledDamageEntry[] {
  if (!damage) return [];
  return Array.isArray(damage) ? damage : [damage];
}

function classifyPower(power: Power): PowerCategory | null {
  if (power.mechanicType) return null;

  if (power.damage) {
    const area = power.effectArea;
    if (area === 'Cone') return 'attack-cone';
    if (area === 'AoE' || area === 'Location') return 'attack-aoe';
    if (area === 'Chain') return 'attack-chain';
    return 'attack-st';
  }

  const e = power.effects;
  if (e?.summon) return 'pet';
  if (e?.hold || e?.stun || e?.immobilize || e?.sleep || e?.confuse || e?.fear) return 'control';

  if (power.powerType === 'Passive') return 'passive';
  if (power.powerType === 'Auto') return 'auto';
  if (power.powerType === 'Toggle') {
    if (e?.defense || e?.resistance || e?.protection) return 'toggle-defense';
    return 'toggle-other';
  }

  return 'buff';
}

function calculateMetric(
  power: Power,
  metric: CompareMetric,
  archetypeId: string,
  level: number,
): number | null {
  const stats = power.stats;

  switch (metric) {
    case 'baseDamage': {
      const damages = normalizeDamageArray(power.damage);
      if (!damages.length) return null;
      let total = 0;
      for (const d of damages) {
        const val = calculateDamageWithATTable(d.scale, d.table, archetypeId, level);
        if (val !== null) {
          // For DoT, multiply by tick count
          if (d.duration && d.tickRate && d.tickRate > 0) {
            const ticks = Math.floor(d.duration / d.tickRate) + 1;
            total += val * ticks;
          } else {
            total += val;
          }
        }
      }
      return total > 0 ? total : null;
    }
    case 'dpa': {
      const dmg = calculateMetric(power, 'baseDamage', archetypeId, level);
      const cast = stats?.castTime ?? 1;
      return dmg !== null ? dmg / cast : null;
    }
    case 'dps': {
      const dmg = calculateMetric(power, 'baseDamage', archetypeId, level);
      const cast = stats?.castTime ?? 1;
      const recharge = stats?.recharge ?? 0;
      return dmg !== null ? dmg / (cast + recharge) : null;
    }
    case 'endEfficiency': {
      const dmg = calculateMetric(power, 'baseDamage', archetypeId, level);
      const end = stats?.endurance ?? 0;
      return dmg !== null && end > 0 ? dmg / end : null;
    }
    case 'recharge':
      return stats?.recharge ?? null;
    case 'range':
      return stats?.range ?? null;
    case 'endCost':
      return stats?.endurance ?? null;
    case 'castTime':
      return stats?.castTime ?? null;
  }
}

function formatMetricValue(value: number, metric: CompareMetric): string {
  switch (metric) {
    case 'baseDamage':
    case 'dpa':
    case 'dps':
    case 'endEfficiency':
      return value.toFixed(1);
    case 'recharge':
    case 'castTime':
      return `${value.toFixed(2)}s`;
    case 'range':
      return `${value.toFixed(0)}ft`;
    case 'endCost':
      return value.toFixed(2);
  }
}

function autoPairPowers(powersA: Power[], powersB: Power[]): PowerPair[] {
  const classifiedA = powersA
    .filter((p) => !p.mechanicType)
    .map((p) => ({ power: p, category: classifyPower(p) }))
    .filter((c): c is { power: Power; category: PowerCategory } => c.category !== null);

  const classifiedB = powersB
    .filter((p) => !p.mechanicType)
    .map((p) => ({ power: p, category: classifyPower(p) }))
    .filter((c): c is { power: Power; category: PowerCategory } => c.category !== null);

  const pairs: PowerPair[] = [];

  for (const cat of CATEGORY_ORDER) {
    const groupA = classifiedA
      .filter((c) => c.category === cat)
      .sort((a, b) => a.power.available - b.power.available);
    const groupB = classifiedB
      .filter((c) => c.category === cat)
      .sort((a, b) => a.power.available - b.power.available);

    const maxLen = Math.max(groupA.length, groupB.length);
    for (let i = 0; i < maxLen; i++) {
      pairs.push({
        category: cat,
        powerA: groupA[i]?.power ?? null,
        powerB: groupB[i]?.power ?? null,
      });
    }
  }

  return pairs;
}

// ============================================
// SUBCOMPONENTS
// ============================================

function CategoryHeader({ category }: { category: PowerCategory }) {
  return (
    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-3 mb-1 border-b border-slate-700/50 pb-1">
      {CATEGORY_LABELS[category]}
    </div>
  );
}

function ComparisonBarRow({
  pair,
  metricA,
  metricB,
  maxValue,
  metric,
  selectedKey,
  pairIndex,
  onTap,
}: {
  pair: PowerPair;
  metricA: number | null;
  metricB: number | null;
  maxValue: number;
  metric: CompareMetric;
  selectedKey: string | null;
  pairIndex: number;
  onTap: (pairIndex: number, side: 'A' | 'B') => void;
}) {
  const barWidthA = metricA !== null && maxValue > 0 ? (metricA / maxValue) * 100 : 0;
  const barWidthB = metricB !== null && maxValue > 0 ? (metricB / maxValue) * 100 : 0;
  const isSelectedA = selectedKey === `${pairIndex}-A`;
  const isSelectedB = selectedKey === `${pairIndex}-B`;

  return (
    <div className="space-y-0.5 py-1">
      {/* Set A bar */}
      <div
        className={`flex items-center gap-2 cursor-pointer rounded px-1 py-0.5 ${
          isSelectedA ? 'ring-1 ring-blue-400 bg-blue-900/20' : 'hover:bg-slate-800/50'
        }`}
        onClick={() => onTap(pairIndex, 'A')}
      >
        <span
          className={`w-24 sm:w-32 text-[11px] text-right truncate flex-shrink-0 ${
            !pair.powerA ? 'text-slate-600 italic' : isSelectedA ? 'text-blue-300 font-medium' : 'text-slate-300'
          }`}
        >
          {pair.powerA?.name ?? '—'}
        </span>
        <div className="flex-1 h-5 bg-slate-800 rounded overflow-hidden relative">
          {barWidthA > 0 && (
            <div
              className="h-full bg-blue-600 rounded transition-all duration-200"
              style={{ width: `${barWidthA}%` }}
            />
          )}
          <span className="absolute right-1.5 top-0 text-[11px] text-slate-200 leading-5 tabular-nums">
            {metricA !== null ? formatMetricValue(metricA, metric) : '—'}
          </span>
        </div>
      </div>
      {/* Set B bar */}
      <div
        className={`flex items-center gap-2 cursor-pointer rounded px-1 py-0.5 ${
          isSelectedB ? 'ring-1 ring-amber-400 bg-amber-900/20' : 'hover:bg-slate-800/50'
        }`}
        onClick={() => onTap(pairIndex, 'B')}
      >
        <span
          className={`w-24 sm:w-32 text-[11px] text-right truncate flex-shrink-0 ${
            !pair.powerB ? 'text-slate-600 italic' : isSelectedB ? 'text-amber-300 font-medium' : 'text-slate-300'
          }`}
        >
          {pair.powerB?.name ?? '—'}
        </span>
        <div className="flex-1 h-5 bg-slate-800 rounded overflow-hidden relative">
          {barWidthB > 0 && (
            <div
              className="h-full bg-amber-600 rounded transition-all duration-200"
              style={{ width: `${barWidthB}%` }}
            />
          )}
          <span className="absolute right-1.5 top-0 text-[11px] text-slate-200 leading-5 tabular-nums">
            {metricB !== null ? formatMetricValue(metricB, metric) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function PowersetCompareModal() {
  const isOpen = useUIStore((s) => s.powersetCompareModalOpen);
  const close = useUIStore((s) => s.closePowersetCompareModal);

  // Selection state
  const [atA, setAtA] = useState<string>('');
  const [psA, setPsA] = useState<string>('');
  const [atB, setAtB] = useState<string>('');
  const [psB, setPsB] = useState<string>('');
  const [metric, setMetric] = useState<CompareMetric>('baseDamage');
  const [level, setLevel] = useState(50);

  // Swap state
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [swaps, setSwaps] = useState<Array<[number, 'A' | 'B', number, 'A' | 'B']>>([]);

  // Archetype options
  const archetypeOptions = useMemo<SelectOption[]>(() => {
    return getArchetypeIds()
      .map((id) => {
        const at = getArchetype(id);
        return { value: id, label: at?.name ?? id };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Powerset options for each side
  const psOptionsA = useMemo<SelectOption[]>(() => {
    if (!atA) return [];
    const at = getArchetype(atA as ArchetypeId);
    if (!at) return [];
    const setIds = [...at.primarySets, ...at.secondarySets];
    // Include VEAT branch powersets (Night Widow, Fortunata, Crab Spider, Bane Spider)
    if (at.branches) {
      for (const branch of Object.values(at.branches)) {
        if (branch.primarySet) setIds.push(branch.primarySet);
        if (branch.secondarySet) setIds.push(branch.secondarySet);
      }
    }
    return setIds
      .map((id) => {
        const ps = getPowerset(id);
        return { value: id, label: ps?.name ?? id };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [atA]);

  const psOptionsB = useMemo<SelectOption[]>(() => {
    if (!atB) return [];
    const at = getArchetype(atB as ArchetypeId);
    if (!at) return [];
    const setIds = [...at.primarySets, ...at.secondarySets];
    if (at.branches) {
      for (const branch of Object.values(at.branches)) {
        if (branch.primarySet) setIds.push(branch.primarySet);
        if (branch.secondarySet) setIds.push(branch.secondarySet);
      }
    }
    return setIds
      .map((id) => {
        const ps = getPowerset(id);
        return { value: id, label: ps?.name ?? id };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [atB]);

  // Load powersets
  const powersetA = useMemo(() => (psA ? getPowerset(psA) : null), [psA]);
  const powersetB = useMemo(() => (psB ? getPowerset(psB) : null), [psB]);

  // Auto-pair then apply swaps
  const pairs = useMemo(() => {
    if (!powersetA || !powersetB) return [];
    const basePairs = autoPairPowers(powersetA.powers, powersetB.powers);

    // Apply swap overrides
    const result = [...basePairs];
    for (const [fromIdx, fromSide, toIdx, toSide] of swaps) {
      if (fromIdx >= result.length || toIdx >= result.length) continue;
      const fromPair = result[fromIdx];
      const toPair = result[toIdx];
      const fromPower = fromSide === 'A' ? fromPair.powerA : fromPair.powerB;
      const toPower = toSide === 'A' ? toPair.powerA : toPair.powerB;

      if (fromSide === 'A') result[fromIdx] = { ...fromPair, powerA: toPower };
      else result[fromIdx] = { ...fromPair, powerB: toPower };

      if (toSide === 'A') result[toIdx] = { ...toPair, powerA: fromPower };
      else result[toIdx] = { ...toPair, powerB: fromPower };
    }
    return result;
  }, [powersetA, powersetB, swaps]);

  // Calculate metrics for all pairs
  const { metricsA, metricsB, maxValue } = useMemo(() => {
    const mA: (number | null)[] = [];
    const mB: (number | null)[] = [];
    let max = 0;

    for (const pair of pairs) {
      const valA = pair.powerA ? calculateMetric(pair.powerA, metric, atA, level) : null;
      const valB = pair.powerB ? calculateMetric(pair.powerB, metric, atB, level) : null;
      mA.push(valA);
      mB.push(valB);
      if (valA !== null && valA > max) max = valA;
      if (valB !== null && valB > max) max = valB;
    }

    return { metricsA: mA, metricsB: mB, maxValue: max };
  }, [pairs, metric, atA, atB, level]);

  // Tap-to-swap handler
  const handleTap = useCallback(
    (pairIndex: number, side: 'A' | 'B') => {
      const key = `${pairIndex}-${side}`;
      if (!selectedKey) {
        setSelectedKey(key);
      } else if (selectedKey === key) {
        setSelectedKey(null);
      } else {
        const [fromIdx, fromSide] = selectedKey.split('-') as [string, 'A' | 'B'];
        setSwaps((prev) => [...prev, [parseInt(fromIdx), fromSide, pairIndex, side]]);
        setSelectedKey(null);
      }
    },
    [selectedKey],
  );

  const handleResetPairs = useCallback(() => {
    setSwaps([]);
    setSelectedKey(null);
  }, []);

  // Reset powerset when archetype changes
  const handleAtAChange = useCallback((val: string) => {
    setAtA(val);
    setPsA('');
    setSwaps([]);
    setSelectedKey(null);
  }, []);

  const handleAtBChange = useCallback((val: string) => {
    setAtB(val);
    setPsB('');
    setSwaps([]);
    setSelectedKey(null);
  }, []);

  const handlePsAChange = useCallback((val: string) => {
    setPsA(val);
    setSwaps([]);
    setSelectedKey(null);
  }, []);

  const handlePsBChange = useCallback((val: string) => {
    setPsB(val);
    setSwaps([]);
    setSelectedKey(null);
  }, []);

  // Group pairs by category for section headers
  const groupedPairs = useMemo(() => {
    const groups: Array<{ category: PowerCategory; startIndex: number }> = [];
    let lastCat: PowerCategory | null = null;
    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i].category !== lastCat) {
        groups.push({ category: pairs[i].category, startIndex: i });
        lastCat = pairs[i].category;
      }
    }
    return groups;
  }, [pairs]);

  return (
    <Modal isOpen={isOpen} onClose={close} title="Compare Powersets" size="full">
      <ModalBody>
        {/* Selector Panel */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Set A */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Set A</div>
              <Select
                options={archetypeOptions}
                value={atA}
                onChange={(e) => handleAtAChange(e.target.value)}
                placeholder="Select Archetype..."
              />
              <Select
                options={psOptionsA}
                value={psA}
                onChange={(e) => handlePsAChange(e.target.value)}
                placeholder="Select Powerset..."
                disabled={!atA}
              />
            </div>
            {/* Set B */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Set B</div>
              <Select
                options={archetypeOptions}
                value={atB}
                onChange={(e) => handleAtBChange(e.target.value)}
                placeholder="Select Archetype..."
              />
              <Select
                options={psOptionsB}
                value={psB}
                onChange={(e) => handlePsBChange(e.target.value)}
                placeholder="Select Powerset..."
                disabled={!atB}
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-400">Metric:</label>
              <Select
                options={METRIC_OPTIONS}
                value={metric}
                onChange={(e) => setMetric(e.target.value as CompareMetric)}
                className="!w-auto"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-400">Level:</label>
              <input
                type="number"
                min={1}
                max={50}
                value={level}
                onChange={(e) => setLevel(Math.max(1, Math.min(50, parseInt(e.target.value) || 50)))}
                className="w-14 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200 text-center"
              />
            </div>
            {swaps.length > 0 && (
              <button
                onClick={handleResetPairs}
                className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2"
              >
                Reset Pairs
              </button>
            )}
          </div>
        </div>

        {/* Bar Chart Area */}
        {pairs.length > 0 ? (
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {selectedKey && (
              <div className="text-[10px] text-slate-500 mb-2 italic">
                Tap another power to swap pairing
              </div>
            )}
            {groupedPairs.map(({ category, startIndex }) => {
              // Collect all pairs in this category
              const catPairs: Array<{ pair: PowerPair; index: number }> = [];
              for (let i = startIndex; i < pairs.length && pairs[i].category === category; i++) {
                catPairs.push({ pair: pairs[i], index: i });
              }
              return (
                <div key={`${category}-${startIndex}`}>
                  <CategoryHeader category={category} />
                  {catPairs.map(({ pair, index }) => (
                    <ComparisonBarRow
                      key={index}
                      pair={pair}
                      metricA={metricsA[index]}
                      metricB={metricsB[index]}
                      maxValue={maxValue}
                      metric={metric}
                      selectedKey={selectedKey}
                      pairIndex={index}
                      onTap={handleTap}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-12">
            Select two powersets above to compare
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
