/**
 * Chip presentation for the what-if team-buff layer, shared by `WhatIfBuffsModal` and the
 * Attack Chain Builder's "other team buffs" section.
 *
 * Every stat the layer offers is one colour-coded chip; only a chip the user activates takes
 * up a slider row. That keeps both surfaces compact — the full vocabulary is a dozen-plus
 * stats, and a build is usually simulating one or two.
 *
 * "Active" is derived, not stored: any stat with a nonzero buff is active (including one set
 * from the OTHER surface — the layer is shared), plus chips toggled on but still sitting at
 * zero, which live only in local component state. Deactivating a chip zeroes its buff, so the
 * two surfaces can never disagree about what is simulated.
 *
 * A control's `color` is a Tailwind text class from `STAT_DEFINITIONS` (e.g. `text-red-400`),
 * so it is applied as a className; chip borders and slider thumbs pick it up via
 * `currentColor`.
 */

import { useMemo, useState } from 'react';
import type { WhatIfControl } from './whatIfControls';

/** Which stats have a visible row: any nonzero buff, plus chips toggled on at zero. */
export function useWhatIfActive(
  values: Record<string, number>,
  setValue: (stat: string, magnitude: number) => void,
) {
  const [manual, setManual] = useState<ReadonlySet<string>>(new Set());
  const activeStats = useMemo(() => {
    const s = new Set(manual);
    for (const [stat, v] of Object.entries(values)) if (v !== 0) s.add(stat);
    return s as ReadonlySet<string>;
  }, [manual, values]);
  const toggle = (stat: string) => {
    if (activeStats.has(stat)) {
      setValue(stat, 0);
      setManual((prev) => {
        const next = new Set(prev);
        next.delete(stat);
        return next;
      });
    } else {
      setManual((prev) => new Set(prev).add(stat));
    }
  };
  /** Companion to "clear all": drop the zero-value chips too, not just the values. */
  const deactivateAll = () => setManual(new Set());
  return { activeStats, toggle, deactivateAll };
}

interface WhatIfChipProps {
  control: WhatIfControl;
  active: boolean;
  /** Current buff magnitude — shown on the chip so a collapsed row still reads. */
  value: number;
  onToggle: () => void;
}

export function WhatIfChip({ control, active, value, onToggle }: WhatIfChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`${control.color} inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-4 transition-colors ${
        active
          ? 'border-current'
          : 'border-gray-700 bg-gray-800/40 opacity-60 hover:opacity-100 hover:border-current'
      }`}
      style={
        active
          ? { backgroundColor: 'color-mix(in srgb, currentColor 12%, transparent)' }
          : undefined
      }
      title={
        active
          ? `Stop simulating a ${control.label} team buff`
          : `Simulate a ${control.label} team buff`
      }
    >
      {control.label}
      {active && value !== 0 && (
        <span className="tabular-nums font-medium">
          {value > 0 ? '+' : ''}
          {value}
          {control.unit}
        </span>
      )}
      {active && (
        <span aria-hidden className="opacity-70">
          ×
        </span>
      )}
    </button>
  );
}

/**
 * The slider's reach, mirrored to the debuff side. A convenience clamp on the SLIDER only —
 * the number field beside it is unbounded, and the engine binds every archetype ceiling
 * against the layer regardless (the chain modal's rows span exported ceilings instead, and
 * keep their own markup).
 */
const GENERIC_RANGE = 200;

interface WhatIfSliderRowProps {
  control: WhatIfControl;
  value: number;
  onChange: (magnitude: number) => void;
}

export function WhatIfSliderRow({ control, value, onChange }: WhatIfSliderRowProps) {
  return (
    <div className={`${control.color} flex items-center gap-2 text-[11px]`}>
      <span className="w-36 shrink-0 truncate">{control.label}</span>
      <input
        type="range"
        min={-GENERIC_RANGE}
        max={GENERIC_RANGE}
        step={5}
        value={Math.max(-GENERIC_RANGE, Math.min(GENERIC_RANGE, value))}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        aria-label={`${control.label} what-if buff`}
        className="h-4 flex-1 cursor-pointer"
        style={{ accentColor: 'currentColor' }}
      />
      <input
        type="number"
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        aria-label={`${control.label} what-if buff, exact value`}
        className="w-16 shrink-0 rounded border border-gray-700 bg-gray-900 px-1 py-0.5 text-right tabular-nums text-gray-200"
      />
      {/* Fixed width keeps the number inputs aligned across rows with and without a unit. */}
      <span className="w-7 shrink-0 text-gray-500">{control.unit}</span>
    </div>
  );
}
