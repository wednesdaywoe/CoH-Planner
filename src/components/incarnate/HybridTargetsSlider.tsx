/**
 * HybridTargetsSlider — the foe count an active Hybrid's per-enemy layer stacks against.
 *
 * The Melee Hybrid line buffs you once per enemy inside its sphere — Regeneration and
 * Resistance on the Core side, Regeneration and Defense on the Radial — up to a ceiling the
 * equipped tier states (4, 7 or 9 foes). That layer has always been in the data and on the
 * slot's tooltip; until this slider it reached no total, because nothing in the planner said
 * how many enemies to assume. This is that input, and the same kind of input the Destiny time
 * scrubber is: a reading of the build, not a fact about it, so it is never saved into a build.
 *
 * 0 is the default and means solo. The engine clamps the number to the equipped power's own
 * ceiling, so dropping from a T4 to a T1 tier cannot leave a nine-foe reading standing on a
 * power that caps at four.
 *
 * Renders nothing unless the equipped Hybrid actually has a per-enemy layer. Whether the slot
 * is toggled on is the mount site's call (StatsDashboard), the same gate DestinyTimeSlider sits
 * behind.
 */

import { useMemo } from 'react';
import { useBuildStore } from '@/stores/buildStore';
import { useUIStore, useHybridTargetsHit } from '@/stores/uiStore';
import { getHybridEffects, formatEffectValue } from '@/data';
import { HYBRID_LABELS } from './IncarnateEffectsTooltip';

export function HybridTargetsSlider() {
  const hybrid = useBuildStore((s) => s.build.incarnates?.hybrid ?? null);
  const foes = useHybridTargetsHit();
  const setFoes = useUIStore((s) => s.setHybridTargetsHit);

  const powerId = hybrid?.powerId ?? null;
  const fx = useMemo(() => (powerId ? getHybridEffects(powerId) : null), [powerId]);

  const cap = fx?.maxTargets ?? 0;

  /**
   * The per-foe rows, with same-valued families folded into one entry.
   *
   * A Melee Radial's layer is eleven defense keys at one value and a regeneration key; printed
   * one per key that is a twelve-item wall in a readout two lines tall. Folding is on the
   * VALUE and the key's own prefix, not on a list of which types "should" travel together —
   * the day a tier buffs seven of eight resistances at one rate and the eighth at another,
   * this splits them instead of quietly printing one of the two.
   */
  const layer = useMemo(() => {
    const rows = Object.entries(fx?.perTarget ?? {});
    const groups = new Map<string, { keys: string[]; value: number }>();
    for (const [stat, value] of rows) {
      const family = /^(res|def|prot)/.exec(stat)?.[1] ?? stat;
      const key = `${family}|${value}`;
      const existing = groups.get(key);
      if (existing) existing.keys.push(stat);
      else groups.set(key, { keys: [stat], value });
    }
    return Array.from(groups.values()).map(({ keys, value }) => ({
      key: keys[0],
      value,
      isMagnitude: keys[0].startsWith('prot'),
      // One key keeps its own label; a folded family says how many types it covers, so the
      // reader can tell "+1% Res" on one type from the same on eight.
      label:
        keys.length === 1
          ? HYBRID_LABELS[keys[0]] || keys[0]
          : `${(HYBRID_LABELS[keys[0]] || keys[0]).replace(/\s*\(.*\)$/, '')} \u00D7${keys.length}`,
    }));
  }, [fx]);

  // The clamp mirrors the engine's rather than trusting the stored number: switching to a
  // smaller tier leaves the store holding a count this power cannot reach.
  const clamped = Math.min(foes, cap);

  if (!hybrid || cap <= 0 || layer.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-gray-700/70">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          Foes in range: {clamped}
          {clamped === 0 && <span className="ml-1 text-gray-500 normal-case">(solo)</span>}
        </span>
        <span className="text-[10px] text-gray-400 tabular-nums">
          {clamped === 0 ? (
            <span className="text-gray-500">no stacks</span>
          ) : (
            // What the slider is currently adding, stat by stat — the same arithmetic the
            // engine does (row × foes), so a player can see where the totals moved from.
            layer.map((row, i) => (
              <span key={row.key}>
                {i > 0 && ' · '}
                <span className="text-sky-300">
                  {row.isMagnitude
                    ? `Mag ${(row.value * clamped).toFixed(1).replace(/\.0$/, '')}`
                    : `+${formatEffectValue(row.value * clamped).replace(/^\+/, '')}`}{' '}
                  {row.label}
                </span>
              </span>
            ))
          )}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={cap}
        step={1}
        value={clamped}
        onChange={(e) => setFoes(parseInt(e.target.value, 10))}
        className="w-full h-1.5 accent-[var(--color-primary)] cursor-pointer"
        aria-label="Enemies inside the Hybrid's radius"
      />

      <div className="flex justify-between mt-0.5">
        {Array.from({ length: cap + 1 }, (_, n) => (
          <button
            key={n}
            type="button"
            onClick={() => setFoes(n)}
            className={`text-[9px] tabular-nums transition-colors ${
              clamped === n
                ? 'text-[var(--color-primary)] font-semibold'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            title={n === 0 ? 'Solo' : `${n} ${n === 1 ? 'enemy' : 'enemies'} in range`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
