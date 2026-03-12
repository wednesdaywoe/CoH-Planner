/**
 * PermaRing - Circular progress indicator around a power icon
 * showing how close a power is to being "permanent" (recharge <= duration).
 *
 * Wraps the power icon's container with an SVG ring that fills from 0-100%.
 * Color transitions: red (0%) → yellow (50%) → green (100%).
 */

import { useMemo } from 'react';
import { useUIStore, useBuildStore } from '@/stores';
import { useGlobalBonuses } from '@/hooks/useCalculatedStats';
import { calculatePowerEnhancementBonuses, type EnhancementBonuses } from '@/utils/calculations';
import { calculatePermaInfo, type PermaInfo } from '@/utils/calculations/perma';
import { getIOSet } from '@/data';
import { Tooltip } from '@/components/ui/Tooltip';
import type { SelectedPower } from '@/types';

interface PermaRingProps {
  /** The power to track */
  power: SelectedPower;
  /** Size of the icon in pixels (the ring will be slightly larger) */
  size: number;
  /** The icon element to wrap */
  children: React.ReactNode;
}

export function PermaRing({ power, size, children }: PermaRingProps) {
  const permaTracked = useUIStore((s) => s.permaTrackedPowers.includes(power.name));
  const globalBonuses = useGlobalBonuses();
  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);
  const buildLevel = useBuildStore((s) => s.build.level);

  const permaInfo = useMemo<PermaInfo | null>(() => {
    if (!permaTracked) return null;

    const enhBonuses: EnhancementBonuses = calculatePowerEnhancementBonuses(
      { name: power.name, slots: power.slots },
      globalIOLevel,
      getIOSet,
      exemplarMode ? exemplarLevel : undefined,
    );

    return calculatePermaInfo(power, enhBonuses, globalBonuses.recharge ?? 0);
  }, [permaTracked, power, globalIOLevel, globalBonuses.recharge, exemplarMode, exemplarLevel, buildLevel]);

  if (!permaTracked || !permaInfo) {
    return <>{children}</>;
  }

  // SVG ring dimensions
  const ringSize = size + 4; // 2px padding around icon
  const center = ringSize / 2;
  const radius = (ringSize - 2) / 2; // 1px stroke offset
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - permaInfo.permaPercent / 100);

  // Color based on perma percentage
  const ringColor = permaInfo.isPerma
    ? '#22c55e' // green-500
    : permaInfo.permaPercent > 50
      ? '#eab308' // yellow-500
      : '#ef4444'; // red-500

  const tooltipContent = (
    <div className="text-[10px] space-y-0.5 min-w-[120px]">
      <div className="font-semibold text-center mb-1">
        <span className={permaInfo.isPerma ? 'text-green-400' : permaInfo.permaPercent > 50 ? 'text-yellow-400' : 'text-red-400'}>
          {permaInfo.isPerma ? 'PERMA' : `${permaInfo.permaPercent.toFixed(1)}% to Perma`}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Duration</span>
        <span className="text-slate-200">{permaInfo.duration}s</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Eff. Recharge</span>
        <span className={permaInfo.effectiveRecharge < permaInfo.baseRecharge ? 'text-green-400' : 'text-slate-200'}>
          {permaInfo.effectiveRecharge.toFixed(1)}s
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Base Recharge</span>
        <span className="text-slate-400">{permaInfo.baseRecharge}s</span>
      </div>
      {!permaInfo.isPerma && (
        <div className="flex justify-between border-t border-slate-600 pt-0.5 mt-0.5">
          <span className="text-slate-400">Gap</span>
          <span className="text-red-400">{(permaInfo.effectiveRecharge - permaInfo.duration).toFixed(1)}s</span>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top" delay={100}>
      <div className="relative inline-flex items-center justify-center" style={{ width: ringSize, height: ringSize }}>
        {/* SVG ring */}
        <svg
          className="absolute inset-0"
          width={ringSize}
          height={ringSize}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(100,116,139,0.3)"
            strokeWidth={1.5}
          />
          {/* Progress ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
          />
        </svg>
        {/* Icon (centered inside the ring) */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </Tooltip>
  );
}
