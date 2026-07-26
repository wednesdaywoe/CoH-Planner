/**
 * Slotted Procs — per-proc controls in the power InfoPanel.
 *
 * One row per slotted proc that contributes to the dashboard (always-on globals
 * and variable procs). Each row has an on/off toggle (the per-proc gate that now
 * defaults the global category toggle), and variable procs add a slider:
 *  - stacking buffs (Might of the Tanker): a discrete 0..maxStacks slider,
 *    defaulting to 1 stack (stacks are integers — no fractional "average");
 *  - HP-scaling globals (Reactive Defenses): a 0..100 %HP slider whose Auto
 *    position is the always-on floor.
 *
 * When the host power is a toggle/auto that is switched OFF, its procs can't fire
 * (a proc in a toggled-off damage aura contributes nothing) — the block is shown
 * inactive and reports 0, mirroring the calc.
 *
 * Contribution readouts mirror the calc exactly (legacy-totals.oracle.ts
 * `applyVariableProcBonuses`): magnitude for a "By the Slotted Power" effect is
 * `value × getTableValue(archetype, scaleTable, level)`.
 */

import { useMemo } from 'react';
import type { Enhancement, IOSetEnhancement, ProcOverride } from '@/types';
import { useBuildStore } from '@/stores';
import {
  findProcData,
  getProcEffects,
  getProcControlType,
  isProcAlwaysOn,
  resolveProcContribution,
  DEFAULT_STACK_COUNT,
  procOverrideKey,
  DEFAULT_PROC_OVERRIDE,
} from '@/data';
import type { ProcEffect } from '@/data';
import { getTableValue } from '@/data/at-tables';

interface ProcScanPower {
  name: string;
  powerType?: string;
  isActive?: boolean;
  slots: (Enhancement | null)[];
}

/** Short human label for a proc effect's stat, e.g. "Res(All)". */
function effectLabel(eff: ProcEffect): string {
  const type = eff.effectType && eff.effectType !== 'All' ? eff.effectType : 'All';
  switch (eff.category) {
    case 'Resistance':
      return `Res(${type})`;
    case 'Defense':
      return `Def(${type})`;
    default:
      return eff.category;
  }
}

export function SlottedProcControls({ power }: { power: ProcScanPower | null | undefined }) {
  const build = useBuildStore((s) => s.build);
  const setProcOverride = useBuildStore((s) => s.setProcOverride);
  const archetype = build.archetype.id || '';
  const level = build.level ?? 50;

  // Host toggle/auto switched off ⇒ slotted procs can't fire (only an explicit
  // off suppresses; a click attack carries isActive === undefined and is fine).
  const hostSuppressed = power?.isActive === false;

  const rows = useMemo(() => {
    if (!power?.slots) return [];

    const resolveMag = (raw: number | undefined, scaleTable: string | undefined): number => {
      if (raw === undefined) return 0;
      if (!scaleTable) return raw;
      return raw * (getTableValue(archetype, scaleTable, level) ?? 0);
    };

    const out: {
      slotIndex: number;
      key: string;
      procName: string;
      setName: string;
      override: ProcOverride;
      controlType: 'stacks' | 'hp' | 'toggle';
      maxStacks: number;
      contribution: number;
      label: string;
    }[] = [];

    for (let slotIndex = 0; slotIndex < power.slots.length; slotIndex++) {
      const slot = power.slots[slotIndex];
      if (!slot || slot.type !== 'io-set') continue;
      const ioSlot = slot as IOSetEnhancement;
      if (!ioSlot.isProc) continue;
      const procData = findProcData(ioSlot.name, ioSlot.setName);
      if (!procData) continue;

      const effects = getProcEffects(procData);
      const variableEff = effects.find((e) => getProcControlType(e) !== 'toggle');
      // Only surface procs that feed the dashboard: variable procs or non-variable
      // always-on globals. Pure damage/chance procs (shown in the DPS block) don't
      // get a steady-state toggle row.
      if (!variableEff && !isProcAlwaysOn(procData)) continue;

      const key = procOverrideKey(power.name, slotIndex);
      const override = build.procOverrides?.[key] ?? DEFAULT_PROC_OVERRIDE;

      let controlType: 'stacks' | 'hp' | 'toggle' = 'toggle';
      let maxStacks = 1;
      let contribution = 0;
      let label = '';

      if (variableEff) {
        controlType = getProcControlType(variableEff) as 'stacks' | 'hp';
        maxStacks = variableEff.maxStacks ?? 1;
        const perUnitValue = resolveMag(variableEff.value, variableEff.scaleTable);
        const capValue =
          variableEff.valueMax !== undefined ? resolveMag(variableEff.valueMax, variableEff.scaleTable) : undefined;
        contribution = resolveProcContribution({ controlType, perUnitValue, capValue, maxStacks, override });
        label = effectLabel(variableEff);
      } else {
        const eff = effects.find((e) => e.value !== undefined);
        contribution = override.enabled ? resolveMag(eff?.value, eff?.scaleTable) : 0;
        label = eff ? effectLabel(eff) : '';
      }

      out.push({ slotIndex, key, procName: ioSlot.name, setName: procData.setName, override, controlType, maxStacks, contribution, label });
    }
    return out;
  }, [power, build.procOverrides, archetype, level]);

  if (rows.length === 0) return null;

  return (
    <div className={`bg-slate-800/40 rounded p-2 flex flex-col gap-2 ${hostSuppressed ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Slotted Procs</span>
        {hostSuppressed && (
          <span className="text-[10px] text-amber-400" title="Host power is toggled off — its procs can't fire">
            host off — inactive
          </span>
        )}
      </div>
      {rows.map((row) => {
        const patch = (p: Partial<ProcOverride>) => setProcOverride(power!.name, row.slotIndex, p);
        const enabled = row.override.enabled;
        const active = enabled && !hostSuppressed;
        const isAuto = row.override.mode === 'auto';
        const stacks = row.override.mode === 'stacks'
          ? Math.max(0, Math.min(row.maxStacks, row.override.stacks ?? 0))
          : DEFAULT_STACK_COUNT;

        return (
          <div key={row.key} className="flex flex-col gap-1.5 border-t border-slate-700/50 pt-1.5 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 min-w-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => patch({ enabled: !enabled })}
                  className="accent-cyan-500 cursor-pointer"
                />
                <span className="text-xs text-slate-200 truncate" title={`${row.setName}: ${row.procName}`}>
                  {row.procName}
                </span>
              </label>
              <span className={`text-xs font-mono whitespace-nowrap ${active ? 'text-emerald-300' : 'text-slate-500'}`}>
                {!enabled ? 'Off' : hostSuppressed ? '0 (host off)' : `+${row.contribution.toFixed(1)}% ${row.label}`}
              </span>
            </div>

            {enabled && row.controlType === 'stacks' && (
              <div className="flex items-center gap-2 pl-6">
                <span className="text-[10px] text-slate-400 w-10">Stacks</span>
                <input
                  type="range"
                  min={0}
                  max={row.maxStacks}
                  step={1}
                  value={stacks}
                  onChange={(e) => patch({ mode: 'stacks', stacks: Number(e.target.value) })}
                  className="flex-1 h-1 accent-cyan-500 cursor-pointer"
                />
                <span className="text-xs text-slate-200 font-mono w-12 text-right">{stacks} / {row.maxStacks}</span>
              </div>
            )}

            {enabled && row.controlType === 'hp' && (
              <div className="flex items-center gap-2 pl-6">
                <button
                  type="button"
                  onClick={() => patch({ mode: 'auto' })}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${isAuto ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                  title="Always-on floor (full HP)"
                >
                  Auto
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={isAuto ? 100 : row.override.hpPct ?? 100}
                  onChange={(e) => patch({ mode: 'hp', hpPct: Number(e.target.value) })}
                  className="flex-1 h-1 accent-cyan-500 cursor-pointer"
                />
                <span className="text-xs text-slate-200 font-mono w-16 text-right">
                  {isAuto ? 'Floor' : `${row.override.hpPct ?? 100}% HP`}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
