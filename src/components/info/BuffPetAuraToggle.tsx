/**
 * Buff-pet aura toggle.
 *
 * "Floaty" buff-pets (Traps' Force Field Generator, Marine's Barrier Reef, Traps'
 * Triage Beacon, …) are summonable, non-commandable drones whose purpose is to
 * project a persistent AoE buff onto the caster and team. Their buffs live on the
 * pet entity, so the pre-engine calc — which walks only the player's own
 * powers — never counted them.
 *
 * This is the opt-in seam: when a summon power is a buff-pet, this control surfaces
 * a per-pet toggle that folds the pet's aura into the top-of-screen totals
 * (the pre-engine calc's Step 7.2, gated on the same `${internalName}:buffpet`
 * mechanicAdjuster key). Off by default — the pet is temporary and positional, so
 * the user opts in to model "I'm standing in its buff." Detection and the toggle
 * id are shared with the calc via `buff-pet-auras.ts`.
 */

import { useMemo } from 'react';
import type { Power } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
import { useUIStore, useMechanicAdjuster } from '@/stores';
import { getBuffPetSources, BUFF_PET_TOGGLE_ID } from '@/utils/calculations/buff-pet-auras';

/** Compact stat labels for the "adds to totals" hint. */
const AURA_SHORT_LABEL: Record<string, string> = {
  DefenseBuff: '+Def',
  ResistanceBuff: '+Res',
  Absorb: 'Absorb',
  RegenBuff: '+Regen',
  RecoveryBuff: '+Recovery',
  ToHitBuff: '+ToHit',
  RechargeBuff: '+Recharge',
};

export function BuffPetAuraToggle({ power }: { power: Power }) {
  const summon = power.summon;
  const sources = useMemo(() => getBuffPetSources(summon), [summon]);
  const active = useMechanicAdjuster(power.internalName, BUFF_PET_TOGGLE_ID, false);
  const setMechanicAdjuster = useUIStore((s) => s.setMechanicAdjuster);

  if (sources.length === 0) return null;

  const petName = sources[0].displayName;
  const stats = Array.from(
    new Set(sources.flatMap((s) => s.auras.map((a) => AURA_SHORT_LABEL[a.type] ?? a.type))),
  );

  return (
    <div className="bg-slate-800/40 rounded p-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <Toggle
          id={`buffpet-${power.internalName}`}
          checked={active}
          onChange={(e) => setMechanicAdjuster(power.internalName, BUFF_PET_TOGGLE_ID, e.target.checked)}
          label={`Count ${petName} buffs`}
          title={`Fold ${petName}'s aura into your character totals. Off by default — the pet is temporary and you must stand near it, so enable this to model being in its buff.`}
        />
      </div>
      <div className="text-[11px] text-slate-400 italic ml-12">
        Adds to totals: {stats.join(', ')}
      </div>
    </div>
  );
}
