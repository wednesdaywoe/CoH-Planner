/**
 * PinnedPowersBar - Shows perma-tracked powers on the stats dashboard
 *
 * Displays each perma-tracked power as a small icon wrapped in a PermaRing
 * with an inline percentage label. Appears only when powers are being tracked.
 */

import { useMemo } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { PermaRing } from '@/components/powers/PermaRing';
import { getPowerIconPath } from '@/utils/power-icons';
import { resolvePath } from '@/utils/paths';
import type { SelectedPower } from '@/types';

const ICON_SIZE = 20;

/**
 * Collect all selected powers from the build, keyed by internalName.
 */
function collectBuildPowers(build: ReturnType<typeof useBuildStore.getState>['build']): Map<string, SelectedPower> {
  const map = new Map<string, SelectedPower>();
  const add = (p: SelectedPower) => map.set(p.internalName, p);

  build.primary.powers.forEach(add);
  build.secondary.powers.forEach(add);
  build.pools.forEach((pool) => pool.powers.forEach(add));
  build.epicPool?.powers.forEach(add);
  build.inherents.forEach(add);
  return map;
}

export function PinnedPowersBar() {
  const permaTracked = useUIStore((s) => s.permaTrackedPowers);
  const build = useBuildStore((s) => s.build);
  const togglePermaTracked = useUIStore((s) => s.togglePermaTracked);

  const trackedPowers = useMemo(() => {
    if (permaTracked.length === 0) return [];
    const powerMap = collectBuildPowers(build);
    return permaTracked
      .map((name) => powerMap.get(name))
      .filter((p): p is SelectedPower => !!p);
  }, [permaTracked, build]);

  if (trackedPowers.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 pt-1 mt-1 border-t border-gray-800">
      <span className="text-[9px] text-gray-500 uppercase tracking-wide font-semibold shrink-0 mr-0.5">Perma</span>
      {trackedPowers.map((power) => (
        <PinnedPowerItem
          key={power.internalName}
          power={power}
          onUnpin={() => togglePermaTracked(power.internalName)}
        />
      ))}
    </div>
  );
}

function PinnedPowerItem({ power, onUnpin }: { power: SelectedPower; onUnpin: () => void }) {
  return (
    <div
      className="group relative flex items-center justify-center rounded hover:bg-gray-800/60 transition-colors cursor-default leading-[0]"
      style={{ padding: 2 }}
    >
      <PermaRing power={power} size={ICON_SIZE}>
        <img
          src={getPowerIconPath(power.icon)}
          alt={power.name}
          className="rounded-full block"
          style={{ width: ICON_SIZE, height: ICON_SIZE, position: 'relative', top: 1, left: -1 }}
          onError={(e) => { (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png'); }}
        />
      </PermaRing>
      {/* Unpin button - appears on hover */}
      <button
        onClick={onUnpin}
        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gray-700 border border-gray-600
                   text-gray-400 hover:text-red-400 hover:bg-gray-600 text-[8px] leading-none
                   flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        title={`Stop tracking ${power.name}`}
      >
        ✕
      </button>
    </div>
  );
}
