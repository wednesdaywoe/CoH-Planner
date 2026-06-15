/**
 * MobileBuildBar — a slim, persistent build-context bar pinned to the top on
 * mobile, mirroring the bottom nav. On mobile the planner columns stack and the
 * whole page scrolls, so the Header (with its level control) scrolls out of
 * view; users reported having to scroll up and down to check/change the build
 * level and to see how many power picks / slots remain. This keeps the level
 * stepper and the pick/slot budget in view while scrolling powers.
 *
 * Hidden on desktop (lg+, where the dashboard shows this), on the Shared Builds
 * browser, and while a mobile sheet is open (those cover the viewport).
 */

import { useLocation } from '@tanstack/react-router';
import { useUIStore } from '@/stores';
import { useBuildBudget } from '@/hooks';
import { Tooltip } from '@/components/ui';
import { HeaderLevelSlider } from './Header';

export function MobileBuildBar() {
  const location = useLocation();
  const mobileSheet = useUIStore((s) => s.mobileSheet);
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);
  const { currentPowerCount, powerBudget, powerRemaining, currentSlotCount, slotBudget, slotRemaining } =
    useBuildBudget();

  // Don't compete with fullscreen sheets, and stay off the shared-builds browser.
  if (mobileSheet !== null || location.pathname.startsWith('/builds')) return null;

  const powerColor =
    currentPowerCount > powerBudget ? 'text-red-400' : powerRemaining <= 3 ? 'text-yellow-400' : 'text-emerald-400';
  const slotColor =
    currentSlotCount > slotBudget ? 'text-red-400' : slotRemaining <= 5 ? 'text-yellow-400' : 'text-emerald-400';

  return (
    <div className="lg:hidden sticky top-0 z-30 flex items-center gap-2 bg-slate-800 border-b border-slate-700 px-3 py-1.5 overflow-x-auto scrollbar-thin">
      <div className="shrink-0">
        <HeaderLevelSlider />
      </div>

      {exemplarMode && (
        <Tooltip content={`Exemplared — stats scale to level ${exemplarLevel}`}>
          <span className="text-xs font-medium tabular-nums text-amber-400 whitespace-nowrap shrink-0">
            ex {exemplarLevel}
          </span>
        </Tooltip>
      )}

      {/* Pick / slot budget — mirrors the dashboard counters */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        <Tooltip content={`${powerRemaining} power picks remaining (${currentPowerCount} used of ${powerBudget})`}>
          <span className={`text-xs font-medium tabular-nums whitespace-nowrap ${powerColor}`}>
            Pwr {powerRemaining}/{powerBudget}
          </span>
        </Tooltip>
        <Tooltip content={`${slotRemaining} enhancement slots remaining (${currentSlotCount} used of ${slotBudget})`}>
          <span className={`text-xs font-medium tabular-nums whitespace-nowrap ${slotColor}`}>
            Slot {slotRemaining}/{slotBudget}
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
