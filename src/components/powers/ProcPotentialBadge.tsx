/**
 * Proc-potential lens — a toggleable badge marking powers that are unusually
 * good vehicles for procs.
 *
 * Shows the COMPOSITION rather than a score. A power's proc value depends
 * entirely on what the player is building for: damage is the commonest goal,
 * but -Res, knockdown, stun and -ToHit procs are equally real ones, and a
 * damage-weighted number would quietly argue against those builds. So the badge
 * reports two facts and no opinion — how many procs run at the 90% PPM ceiling,
 * and which effect categories they fall into — and lets the player judge.
 *
 * Everything shown is BASE potential: base recharge, no enhancement, no
 * slotting. It's a property of the power, so it answers "is this worth building
 * around?" before any slots exist.
 */

import { useMemo } from 'react';
import { Tooltip } from '@/components/ui';
import { useShowProcPotential } from '@/stores/uiStore';
import {
  getProcPotential,
  procPotentialTier,
  PROC_TIER_LABEL,
  type ProcPotential,
} from '@/data/proc-potential';
import type { Power } from '@/types/power';

/** Tier → chip styling. Tier 2 is the loud one; tier 1 stays quiet. */
const TIER_CLASS: Record<number, string> = {
  1: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
  2: 'border-fuchsia-400/60 bg-fuchsia-500/15 text-fuchsia-300',
};

/**
 * Carries no width of its own. Tooltip's shell is `max-w-xs` with `px-2`, so a
 * content block wider than its 304px inner box spills OUT of the bordered panel
 * instead of being clipped — a fixed `w-[21rem]` here overhung the panel by
 * 33px. Auto-filling the box leaves the shell authoritative about its own size,
 * and the long rows wrap rather than truncate.
 */
function ProcPotentialTooltip({ potential }: { potential: ProcPotential }) {
  const tier = procPotentialTier(potential);
  return (
    <div className="text-[11px] space-y-1.5 max-w-full">
      <div className="font-semibold text-fuchsia-300">{PROC_TIER_LABEL[tier]}</div>

      <div className="text-slate-300">
        <span className="font-semibold text-slate-100">{potential.atCap}</span> of{' '}
        {potential.total} slottable procs hit the 90% ceiling at base recharge
      </div>

      <div className="border-t border-slate-700 pt-1">
        <div className="text-[9px] uppercase text-slate-500 mb-0.5">
          Proc options
        </div>
        {potential.composition.map((row) => (
          <div key={row.category} className="flex items-baseline gap-1.5">
            <span className="text-slate-200 w-[5rem] flex-shrink-0">{row.category}</span>
            <span
              className={`flex-shrink-0 whitespace-nowrap ${row.atCap > 0 ? 'text-emerald-400' : 'text-slate-500'}`}
            >
              {row.atCap}/{row.total} at cap
            </span>
            {/* Never truncate: the sub-types ARE the answer to "what could I
                build here", and Knockdown/-Res sitting past an ellipsis is
                exactly the information this feature exists to surface. */}
            {row.effectTypes.length > 0 && (
              <span className="text-slate-500 min-w-0">{row.effectTypes.join(', ')}</span>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-1 text-[10px] text-slate-400 space-y-0.5">
        {potential.rollsInExecutedChildren ? (
          // This power has no window of its own — each proc was scored against
          // the executed child that accepts its set, and those children differ
          // (Fault's cone recharges in 6s, its sphere in 20s). Printing one
          // recharge here would name a window nothing rolled in.
          <div>
            Rolls in this power&apos;s executed sub-powers, each on its own recharge and radius.
          </div>
        ) : (
          <div>
            Base recharge {potential.recharge}s + {potential.castTime}s cast
            {potential.areaDenominator > 1 && (
              <> · AoE penalty ÷{potential.areaDenominator.toFixed(2)}</>
            )}
          </div>
        )}
        {potential.mainTargetOnly && (
          <div className="text-amber-400">
            Procs roll single-target despite the AoE (ProcMainTargetOnly).
          </div>
        )}
        {potential.fromPseudoPet && (
          <div>Rolls against the summoned patch ({potential.radius}ft), not the caster.</div>
        )}
        {potential.purpleSets.length > 0 && (
          <div>Purple procs: {potential.purpleSets.join(', ')}</div>
        )}
        {potential.globalCount > 0 && (
          <div>{potential.globalCount} always-on globals also available.</div>
        )}
      </div>
    </div>
  );
}

/**
 * The badge itself. Renders nothing when the lens is off or the power doesn't
 * clear tier 1, so it stays out of the way of the ~85% of powers that aren't
 * proc vehicles.
 */
export function ProcPotentialBadge({ power }: { power: Power | undefined }) {
  const enabled = useShowProcPotential();
  const potential = useMemo(
    () => (enabled && power ? getProcPotential(power) : null),
    [enabled, power],
  );
  if (!potential) return null;
  const tier = procPotentialTier(potential);
  if (tier === 0) return null;

  return (
    <Tooltip content={<ProcPotentialTooltip potential={potential} />}>
      <span
        className={`ml-1 flex-shrink-0 inline-flex items-center gap-0.5 rounded px-1 py-px border text-[9px] leading-none font-semibold ${TIER_CLASS[tier]}`}
        aria-label={`${PROC_TIER_LABEL[tier]}: ${potential.atCap} procs at cap`}
      >
        <span aria-hidden>⚡</span>
        {potential.atCap}
      </span>
    </Tooltip>
  );
}
