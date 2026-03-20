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
import { calculatePowerEnhancementBonuses, getAlphaEnhancementBonuses, type EnhancementBonuses } from '@/utils/calculations';
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
  const build = useBuildStore((s) => s.build);
  const incarnateActive = useUIStore((s) => s.incarnateActive);

  const permaInfo = useMemo<PermaInfo | null>(() => {
    if (!permaTracked) return null;

    const enhBonuses: EnhancementBonuses = calculatePowerEnhancementBonuses(
      { name: power.name, slots: power.slots },
      globalIOLevel,
      getIOSet,
      exemplarMode ? exemplarLevel : undefined,
    );

    // Add Alpha incarnate bonuses (same as InfoPanel)
    const alphaBonuses = getAlphaEnhancementBonuses(build.incarnates, incarnateActive);
    for (const [aspect, value] of Object.entries(alphaBonuses)) {
      if (value !== undefined) {
        enhBonuses[aspect] = (enhBonuses[aspect] || 0) + value;
      }
    }

    return calculatePermaInfo(power, enhBonuses, (globalBonuses.recharge ?? 0) / 100);
  }, [permaTracked, power, globalIOLevel, globalBonuses.recharge, exemplarMode, exemplarLevel, build.level, build.incarnates, incarnateActive]);

  if (!permaTracked || !permaInfo) {
    return <>{children}</>;
  }

  // SVG ring dimensions
  const ringSize = size + 8; // 4px padding around icon for visible gap
  const center = ringSize / 2;
  const radius = (ringSize - 2) / 2; // 1px stroke offset
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - permaInfo.permaPercent / 100);

  // Ring color: SKMagenta
  const ringColor = '#D62BCE';

  const rechargeNeededPct = (permaInfo.rechargeNeeded * 100).toFixed(0);
  const totalRechargePct = (permaInfo.totalRecharge * 100).toFixed(0);

  const tooltipContent = (
    <div className="text-[10px] space-y-0.5 min-w-[130px]">
      <div className="font-semibold text-center mb-1">
        <span className="text-sk-magenta">
          {permaInfo.isPerma ? 'PERMA' : `${permaInfo.permaPercent.toFixed(1)}% to Perma`}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">+Recharge</span>
        <span className={permaInfo.totalRecharge > 0 ? 'text-green-400' : 'text-slate-200'}>
          {totalRechargePct}% / {rechargeNeededPct}%
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Eff. Recharge</span>
        <span className={permaInfo.effectiveRecharge < permaInfo.baseRecharge ? 'text-green-400' : 'text-slate-200'}>
          {permaInfo.effectiveRecharge.toFixed(1)}s
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Base / Duration</span>
        <span className="text-slate-400">{permaInfo.baseRecharge}s / {permaInfo.duration}s</span>
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
      <div className="relative inline-flex items-center justify-center align-top" style={{ width: ringSize, height: ringSize }}>
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
