import { useMemo } from 'react';
import { useBuildStore } from '@/stores';
import { getPowerset, getPowerPool, getEpicPool } from '@/data';
import {
  computeModeSuppression,
  type ModeCarrier,
  type SuppressionInfo,
} from '@/utils/mode-suppression';
import type { Build } from '@/types';

/**
 * The build's currently-suppressed powers, keyed by `internalName`. A power is
 * suppressed when an active power in the build sets a mode that suspends it
 * (Granite Armor suspends the other Stone toggles; Kheldian forms suspend human
 * toggles). Mirrors the totals calc's own suppression pass so the UI marking and
 * the numbers agree. Enriches each stored power with its def so the mode flags
 * are present even when the stored build copy is lean.
 */
export function useModeSuppression(): Map<string, SuppressionInfo> {
  const build = useBuildStore((s) => s.build);
  return useMemo(() => computeModeSuppression(collectCarriers(build)), [build]);
}

function collectCarriers(build: Build): ModeCarrier[] {
  const carriers: ModeCarrier[] = [];
  const push = (
    power: { internalName: string; name?: string; isActive?: boolean; powerType?: string; setsModes?: string[]; modesSuspended?: string[] },
    def?: { setsModes?: string[]; modesSuspended?: string[]; powerType?: string },
  ) => {
    // No mode flags on either the stored copy or the def → can't participate.
    const setsModes = power.setsModes ?? def?.setsModes;
    const modesSuspended = power.modesSuspended ?? def?.modesSuspended;
    if (!setsModes?.length && !modesSuspended?.length) return;
    carriers.push({
      internalName: power.internalName,
      name: power.name ?? power.internalName,
      isActive: power.isActive,
      powerType: power.powerType ?? def?.powerType,
      setsModes,
      modesSuspended,
    });
  };

  const primaryDef = build.primary.id ? getPowerset(build.primary.id) : undefined;
  for (const p of build.primary.powers) push(p, primaryDef?.powers.find((d) => d.internalName === p.internalName));

  const secondaryDef = build.secondary.id ? getPowerset(build.secondary.id) : undefined;
  for (const p of build.secondary.powers) push(p, secondaryDef?.powers.find((d) => d.internalName === p.internalName));

  for (const pool of build.pools) {
    const poolDef = getPowerPool(pool.id);
    for (const p of pool.powers) push(p, poolDef?.powers.find((d) => d.internalName === p.internalName));
  }

  if (build.epicPool) {
    const epicDef = getEpicPool(build.epicPool.id);
    for (const p of build.epicPool.powers) push(p, epicDef?.powers.find((d) => d.internalName === p.internalName));
  }

  for (const p of build.inherents ?? []) push(p);

  return carriers;
}
