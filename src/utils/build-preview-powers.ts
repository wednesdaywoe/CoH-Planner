/**
 * Taken-vs-skipped power rosters for the share-preview card. Only meaningful
 * for primary/secondary — pool and epic picks aren't drawn from a single
 * fixed roster the way a primary/secondary powerset is, so there's no
 * "skipped" list to show for them; they're surfaced separately as taken-only.
 */

import type { Build } from '@/types/build';
import type { Power, SelectedPower } from '@/types/power';
import { getPowerset } from '@/data';
import { isBuyablePick } from '@/data/power-requires';

export interface RosterPick {
  power: Power;
  taken: boolean;
}

function rosterFor(powersetId: string | undefined, taken: SelectedPower[]): RosterPick[] {
  const powerset = powersetId ? getPowerset(powersetId) : undefined;
  if (!powerset) return [];
  const takenNames = new Set(taken.map((p) => p.internalName));
  return powerset.powers
    .filter(isBuyablePick)
    .sort((a, b) => a.available - b.available)
    .map((power) => ({ power, taken: takenNames.has(power.internalName) }));
}

export interface PreviewPowerRosters {
  primary: RosterPick[];
  secondary: RosterPick[];
  /** Pool + epic picks, taken-only, level order (matches getBuildPowers' tie order). */
  extras: SelectedPower[];
}

export function getPreviewPowerRosters(build: Build): PreviewPowerRosters {
  const extras = [...build.pools.flatMap((p) => p.powers), ...(build.epicPool?.powers ?? [])]
    .filter((p) => !p.isAutoGranted)
    .sort((a, b) => a.level - b.level);
  return {
    primary: rosterFor(build.primary?.id ?? undefined, build.primary?.powers ?? []),
    secondary: rosterFor(build.secondary?.id ?? undefined, build.secondary?.powers ?? []),
    extras,
  };
}
