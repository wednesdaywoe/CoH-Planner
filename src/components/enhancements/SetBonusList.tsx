/**
 * SetBonusList - Shared set-bonus presentation block.
 *
 * Renders a set's 2pc/3pc/… bonuses with active/inactive coloring, Rule-of-5
 * count indicators, cap warnings, tracked-stat highlighting, and a separate
 * PvP-only section. It reads tracked stats and bonus tracking from the stores
 * itself, so it drops into multiple surfaces without prop threading:
 *
 *  - Enhancement picker desktop hover tooltip (SetPieceTooltip)
 *  - Enhancement picker mobile inline expander (IOSetRow)
 *  - Main planner power expand view (SlottedSetBonuses)
 *
 * One source of truth for set-bonus markup. Previously this lived only inside
 * the picker's hover tooltip, which never fires on touch, so mobile users had
 * no way to see set bonuses while slotting — and the main planner had no way
 * to surface them at all.
 *
 * Piece count: by default this counts pieces of the set already slotted in the
 * power being edited in the enhancement picker (via picker.currentPowerName).
 * Callers outside the picker (e.g. the planner expand view) pass an explicit
 * `piecesInPower` so the active/inactive state reflects that power's slotting
 * without a picker being open.
 */

import { useMemo } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { normalizeStatName, getTotalBonusCount, isBonusCapped } from '@/utils/calculations';
import { formatBonusDesc } from '@/utils/set-bonus-format';
import { getPairedStat } from '@/utils/calculations/set-bonuses';
import { useBonusTracking } from '@/hooks';
import type { IOSet } from '@/types';

interface SetBonusListProps {
  set: IOSet;
  /**
   * Explicit count of this set's pieces slotted in the relevant power. When
   * omitted, the count is derived from the open enhancement picker's current
   * power. Supply this when rendering outside the picker.
   */
  piecesInPower?: number;
}

export function SetBonusList({ set, piecesInPower: piecesInPowerProp }: SetBonusListProps) {
  const build = useBuildStore((s) => s.build);
  const picker = useUIStore((s) => s.enhancementPicker);
  const trackedStats = useUIStore((s) => s.trackedStats);
  const bonusTracking = useBonusTracking();

  // Build a set of normalized stat keys that are being tracked (including paired stats)
  const trackedNormalized = useMemo(() => {
    if (trackedStats.length === 0) return new Set<string>();
    const out = new Set<string>();
    for (const key of trackedStats) {
      out.add(key);
      const pair = getPairedStat(key);
      if (pair) out.add(pair);
    }
    return out;
  }, [trackedStats]);

  // Count how many pieces of this set are already slotted in the current power
  const setId = set.id || set.name;
  const piecesInPowerFromPicker = useMemo(() => {
    if (!picker.currentPowerName) return 0;
    const findPower = (powers: { name: string; internalName: string; slots: (unknown | null)[] }[]) =>
      powers.find(p => p.internalName === picker.currentPowerName);

    const power = findPower(build.primary.powers)
      || findPower(build.secondary.powers)
      || build.pools.reduce<{ name: string; slots: (unknown | null)[] } | undefined>(
        (found, pool) => found || findPower(pool.powers), undefined)
      || (build.epicPool ? findPower(build.epicPool.powers) : undefined)
      || findPower(build.inherents);

    if (!power) return 0;
    return power.slots.filter(s => {
      if (!s || typeof s !== 'object') return false;
      const ioEnh = s as { type?: string; setId?: string };
      return ioEnh.type === 'io-set' && ioEnh.setId === setId;
    }).length;
  }, [build, picker.currentPowerName, setId]);

  const piecesInPower = piecesInPowerProp ?? piecesInPowerFromPicker;

  if (set.bonuses.length === 0) return null;

  const isPvPSet = set.category === 'pvp';
  const hasPvPEffects = isPvPSet && set.bonuses.some(b => b.effects.some(e => e.pvp));

  return (
    <div className="border-t border-slate-700 pt-2">
      <div className="text-[9px] text-slate-500 uppercase mb-1">
        Set Bonuses ({piecesInPower}/{set.pieces.length} slotted)
      </div>
      {/* PvE bonuses (or all bonuses for non-PvP sets) */}
      <div className="space-y-0.5">
        {set.bonuses.map((bonus, idx) => {
          const pveEffects = hasPvPEffects ? bonus.effects.filter(e => !e.pvp) : bonus.effects;
          if (pveEffects.length === 0) return null;
          const isActive = piecesInPower >= bonus.pieces;
          return (
            <div
              key={idx}
              className={`text-[10px] ${isActive ? 'text-green-400' : 'text-slate-500'}`}
            >
              <span className={`font-medium ${isActive ? 'text-green-500' : 'text-slate-600'}`}>
                {bonus.pieces}pc:
              </span>{' '}
              {pveEffects.map((eff, i) => {
                const normalized = normalizeStatName(eff.stat);
                const isTracked = normalized ? trackedNormalized.has(normalized) : false;
                const totalCount = (isActive && normalized) ? getTotalBonusCount(bonusTracking, normalized, eff.value) : 0;
                const capped = (isActive && normalized) ? isBonusCapped(bonusTracking, normalized, eff.value) : false;
                // Use eff.value for accurate display instead of pre-rounded eff.desc
                const formatted = formatBonusDesc(eff.desc, eff.stat, eff.value);
                return (
                  <span key={i} className={capped ? 'text-warning-fg font-semibold' : isTracked ? 'text-link font-semibold' : ''}>
                    {i > 0 && ', '}
                    {formatted}
                    {isActive && totalCount > 0 && (
                      <span className={`ml-0.5 text-[9px] ${capped ? 'text-warning-fg' : 'text-slate-500'}`}>
                        ({totalCount}/5)
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* PvP-only bonuses section */}
      {hasPvPEffects && (
        <>
          <div className="text-[9px] text-red-400/70 uppercase mt-2 mb-0.5">PvP Only</div>
          <div className="space-y-0.5">
            {set.bonuses.map((bonus, idx) => {
              const pvpEffects = bonus.effects.filter(e => e.pvp);
              if (pvpEffects.length === 0) return null;
              const isActive = piecesInPower >= bonus.pieces;
              return (
                <div
                  key={idx}
                  className={`text-[10px] ${isActive ? 'text-red-400/60' : 'text-slate-600'}`}
                >
                  <span className={`font-medium ${isActive ? 'text-red-400/70' : 'text-slate-700'}`}>
                    {bonus.pieces}pc:
                  </span>{' '}
                  {pvpEffects.map((eff, i) => {
                    const formatted = formatBonusDesc(eff.desc, eff.stat, eff.value);
                    return (
                      <span key={i}>
                        {i > 0 && ', '}
                        {formatted}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
