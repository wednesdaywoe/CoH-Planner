/**
 * DestinyTimeSlider — Mids-style time scrubber for diminishing Destiny buffs.
 *
 * Destiny click buffs (Barrier, Ageless, …) apply several overlapping timed
 * buffs at once and step down as the shorter tiers expire. This slider lets the
 * player evaluate their totals at any point after cast — the additive peak at
 * t=0, or the sustained floor a perma-Destiny build relies on. Scrubbing feeds
 * `destinyTime` into the calc so the whole dashboard updates live.
 *
 * `destinyTime === null` means "auto" = this power's sustained floor, the
 * conservative default (peak protection only lasts a few seconds).
 *
 * Renders nothing unless a Destiny power that actually decays is equipped.
 */

import { useMemo } from 'react';
import { useBuildStore } from '@/stores/buildStore';
import { useUIStore, useDestinyTime } from '@/stores/uiStore';
import {
  getDestinyTimeline,
  getDestinyTotalDuration,
  getDestinyEffectsAtTime,
  getDestinySustainedFloorTime,
  getDestinyBoostsAllowed,
  getAlphaEffects,
  applyAlphaToDestiny,
} from '@/data';

/** Format a decimal buff (0.325 → "32.5%"). */
function pct(v: number): string {
  return `${(v * 100).toFixed(1).replace(/\.0$/, '')}%`;
}

export function DestinyTimeSlider() {
  const destiny = useBuildStore((s) => s.build.incarnates?.destiny ?? null);
  const alpha = useBuildStore((s) => s.build.incarnates?.alpha ?? null);
  const alphaActive = useUIStore((s) => s.incarnateActive.alpha);
  const destinyTime = useDestinyTime();
  const setDestinyTime = useUIStore((s) => s.setDestinyTime);

  const powerId = destiny?.powerId ?? null;
  const timeline = useMemo(() => (powerId ? getDestinyTimeline(powerId) : null), [powerId]);
  const totalDuration = useMemo(() => (powerId ? getDestinyTotalDuration(powerId) : 0), [powerId]);
  const floorTime = useMemo(() => (powerId ? getDestinySustainedFloorTime(powerId) : 0), [powerId]);

  // Distinct tier-expiry boundaries drive the slider's snap stops and tick labels.
  const stops = useMemo(() => {
    if (!timeline) return [];
    const set = new Set<number>([0]);
    for (const tiers of Object.values(timeline)) {
      for (const t of tiers) set.add(t.duration);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [timeline]);

  // null (auto) resolves to the sustained floor; a number is an explicit scrub.
  const effectiveTime = destinyTime === null ? floorTime : destinyTime;

  // Mirror the calc: resolve at time, then apply the active Alpha's enhancement
  // (gated by boosts_allowed) so this readout matches the dashboard totals.
  const alphaId = alpha?.powerId ?? null;
  const resolved = useMemo(() => {
    if (!powerId) return null;
    const fx = getDestinyEffectsAtTime(powerId, effectiveTime);
    if (!fx || !alphaId || !alphaActive) return fx;
    return applyAlphaToDestiny(fx, getDestinyBoostsAllowed(powerId), getAlphaEffects(alphaId));
  }, [powerId, effectiveTime, alphaId, alphaActive]);

  // Only decaying Destiny powers get a slider; everything else is a flat buff.
  if (!destiny || !timeline || totalDuration <= 0) return null;

  const clamped = Math.min(effectiveTime, totalDuration);
  const expired = clamped >= totalDuration;
  const isAuto = destinyTime === null;

  return (
    <div className="mt-2 pt-2 border-t border-gray-700/70">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          Destiny @ {clamped}s
          {isAuto && <span className="ml-1 text-[var(--color-primary)] normal-case">(floor)</span>}
        </span>
        <span className="text-[10px] text-gray-400 tabular-nums">
          {expired ? (
            <span className="text-amber-400/90">expired</span>
          ) : (
            <>
              {resolved?.defenseAll !== undefined && (
                <span className="text-sky-300">+{pct(resolved.defenseAll)} Def</span>
              )}
              {resolved?.defenseAll !== undefined && resolved?.resistanceAll !== undefined && ' · '}
              {resolved?.resistanceAll !== undefined && (
                <span className="text-emerald-300">+{pct(resolved.resistanceAll)} Res</span>
              )}
            </>
          )}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={totalDuration}
        step={0.5}
        value={clamped}
        onChange={(e) => {
          // Snap to the nearest tier boundary so the stepped decay is easy to hit.
          const raw = parseFloat(e.target.value);
          const nearest = stops.reduce(
            (best, s) => (Math.abs(s - raw) < Math.abs(best - raw) ? s : best),
            stops[0],
          );
          // Snap only when close; otherwise honour the raw drag for fine control.
          const next = Math.abs(nearest - raw) <= 2 ? nearest : raw;
          // Landing on the floor boundary returns to auto so switching powers re-defaults.
          setDestinyTime(next === floorTime ? null : next);
        }}
        className="w-full h-1.5 accent-[var(--color-primary)] cursor-pointer"
        aria-label="Destiny buff time after cast"
      />

      <div className="flex justify-between mt-0.5">
        {stops.map((s) => {
          const isFloor = s === floorTime;
          const active = isFloor ? isAuto || clamped === s : !isAuto && clamped === s;
          return (
            <button
              key={s}
              type="button"
              // The floor stop toggles back to auto so it tracks the equipped power.
              onClick={() => setDestinyTime(isFloor ? null : s)}
              className={`text-[9px] tabular-nums transition-colors ${
                active ? 'text-[var(--color-primary)] font-semibold' : 'text-gray-500 hover:text-gray-300'
              }`}
              title={isFloor ? 'Sustained floor (default)' : `Jump to ${s}s`}
            >
              {s === 0 ? 'Peak' : isFloor ? 'Floor' : `${s}s`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
