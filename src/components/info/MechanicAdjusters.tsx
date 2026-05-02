/**
 * Mechanic Adjusters — toggles for `power.conditionalEffects`.
 *
 * Each entry on the power's `conditionalEffects` array becomes either a
 * checkbox (independent toggle) or a radio (mutually exclusive with its
 * group). State scoping respects the entry's `scope` field:
 *
 * - `scope: 'global'` → caster-state mechanics (Bio Armor adaptation,
 *   Hide, Domination, In Combat). State stored in
 *   `uiStore.globalAdjusters` keyed by `id` only — flipping it on one
 *   power flips it everywhere.
 * - `scope: 'per-power'` → target-state mechanics (drowning,
 *   Disintegrating). State keyed by `<powerInternalName>:<id>`.
 *
 * Calc-pipeline integration is a follow-up: the toggles persist and
 * render correctly here; `calculatePowerDamage` etc. don't yet read the
 * active state.
 */

import type { ConditionalEffect, Power } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
import {
  useUIStore,
  useMechanicAdjuster,
  useGlobalAdjuster,
} from '@/stores';
import { AT_INHERENT_CONDITIONAL_IDS } from './powerDisplayUtils';

interface MechanicAdjustersProps {
  power: Power;
}

export function MechanicAdjusters({ power }: MechanicAdjustersProps) {
  const conditional = power.conditionalEffects;
  if (!conditional || conditional.length === 0) return null;

  // AT-inherent mechanics (Domination, etc.) are already controlled by
  // the Header's dashboard. Filter them out of the per-power section so
  // the user has one canonical place to toggle them — the merger reads
  // the existing dashboard state for these ids.
  const surfaceable = conditional.filter((c) => !AT_INHERENT_CONDITIONAL_IDS.has(c.id));
  if (surfaceable.length === 0) return null;

  // Partition entries into groups (by `group` key) and singletons. Within
  // a group, entries render as a radio set; singletons render as
  // independent checkboxes.
  const groups = new Map<string, ConditionalEffect[]>();
  const singletons: ConditionalEffect[] = [];
  for (const c of surfaceable) {
    if (c.group) {
      const arr = groups.get(c.group) ?? [];
      arr.push(c);
      groups.set(c.group, arr);
    } else {
      singletons.push(c);
    }
  }

  return (
    <div className="px-3 py-2 border-t border-slate-800/60 space-y-1.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
        Mechanic Adjusters
      </div>
      <div className="flex flex-col gap-1">
        {Array.from(groups.entries()).map(([groupId, members]) => (
          <RadioGroup
            key={groupId}
            powerName={power.internalName}
            groupId={groupId}
            members={members}
          />
        ))}
        {singletons.map((c) => (
          <SingleToggle
            key={c.id}
            powerName={power.internalName}
            entry={c}
          />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Single (non-grouped) toggle — checkbox semantics.
// ----------------------------------------------------------------------

interface SingleToggleProps {
  powerName: string;
  entry: ConditionalEffect;
}

function SingleToggle({ powerName, entry }: SingleToggleProps) {
  const isGlobal = entry.scope === 'global';
  const perPowerActive = useMechanicAdjuster(powerName, entry.id, entry.defaultActive ?? false);
  const globalActive = useGlobalAdjuster(entry.id, entry.defaultActive ?? false);
  const active = isGlobal ? globalActive : perPowerActive;

  const setMechanicAdjuster = useUIStore((s) => s.setMechanicAdjuster);
  const setGlobalAdjuster = useUIStore((s) => s.setGlobalAdjuster);

  const handleChange = (checked: boolean) => {
    if (isGlobal) setGlobalAdjuster(entry.id, checked);
    else setMechanicAdjuster(powerName, entry.id, checked);
  };

  return (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <Toggle
        id={`adjuster-${powerName}-${entry.id}`}
        checked={active}
        onChange={(e) => handleChange(e.target.checked)}
        label={entry.label}
        title={describeContribution(entry)}
      />
      {isGlobal && (
        <span
          className="text-slate-500 italic text-[9px] uppercase tracking-wide"
          title="Affects all powers that share this state"
        >
          global
        </span>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Radio group — exactly one member can be active at a time.
// ----------------------------------------------------------------------

interface RadioGroupProps {
  powerName: string;
  groupId: string;
  members: ConditionalEffect[];
}

function RadioGroup({ powerName, groupId, members }: RadioGroupProps) {
  // Group scope is determined by the members. Mixed-scope groups
  // shouldn't happen by construction (a group either represents a global
  // mechanic or a per-target tier), but if they do we treat the whole
  // group as global so toggle behavior is consistent.
  const anyGlobal = members.some((m) => m.scope === 'global');
  return anyGlobal
    ? <GlobalRadioGroup groupId={groupId} members={members} />
    : <PerPowerRadioGroup powerName={powerName} groupId={groupId} members={members} />;
}

function GlobalRadioGroup({ groupId, members }: { groupId: string; members: ConditionalEffect[] }) {
  const globalAdjusters = useUIStore((s) => s.globalAdjusters);
  const setGlobalAdjusterGroup = useUIStore((s) => s.setGlobalAdjusterGroup);
  const activeId = members.find((m) => globalAdjusters[m.id])?.id ?? null;

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-400 font-medium">{prettifyGroupId(groupId)}</span>
        <span className="text-slate-500 italic text-[9px] uppercase tracking-wide" title="Affects all powers">
          global
        </span>
      </div>
      {members.map((m) => (
        <RadioRow
          key={m.id}
          name={`group-${groupId}`}
          checked={activeId === m.id}
          onSelect={() =>
            setGlobalAdjusterGroup(m.id, members.map((mm) => mm.id))
          }
          label={m.label}
          title={describeContribution(m)}
        />
      ))}
      {activeId !== null && (
        <button
          type="button"
          className="text-[9px] text-slate-500 hover:text-slate-300 underline ml-5"
          onClick={() => setGlobalAdjusterGroup(null, members.map((m) => m.id))}
        >
          clear
        </button>
      )}
    </div>
  );
}

function PerPowerRadioGroup({
  powerName,
  groupId,
  members,
}: {
  powerName: string;
  groupId: string;
  members: ConditionalEffect[];
}) {
  const mechanicAdjusters = useUIStore((s) => s.mechanicAdjusters);
  const setMechanicAdjuster = useUIStore((s) => s.setMechanicAdjuster);
  const activeId = members.find(
    (m) => mechanicAdjusters[`${powerName}:${m.id}`],
  )?.id ?? null;

  const select = (chosenId: string | null) => {
    for (const m of members) {
      setMechanicAdjuster(powerName, m.id, m.id === chosenId);
    }
  };

  return (
    <div className="space-y-0.5">
      <div className="text-[10px] text-slate-400 font-medium">
        {prettifyGroupId(groupId)}
      </div>
      {members.map((m) => (
        <RadioRow
          key={m.id}
          name={`group-${powerName}-${groupId}`}
          checked={activeId === m.id}
          onSelect={() => select(m.id)}
          label={m.label}
          title={describeContribution(m)}
        />
      ))}
      {activeId !== null && (
        <button
          type="button"
          className="text-[9px] text-slate-500 hover:text-slate-300 underline ml-5"
          onClick={() => select(null)}
        >
          clear
        </button>
      )}
    </div>
  );
}

interface RadioRowProps {
  name: string;
  checked: boolean;
  onSelect: () => void;
  label: string;
  title?: string;
}

function RadioRow({ name, checked, onSelect, label, title }: RadioRowProps) {
  return (
    <label
      title={title}
      className="flex items-center gap-2 text-[11px] cursor-pointer hover:bg-slate-800/40 rounded px-1 py-0.5"
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="accent-blue-500 w-3 h-3"
      />
      <span className={checked ? 'text-slate-200' : 'text-slate-400'}>{label}</span>
    </label>
  );
}

// ----------------------------------------------------------------------
// Helpers.
// ----------------------------------------------------------------------

function describeContribution(entry: ConditionalEffect): string | undefined {
  const parts: string[] = [];
  if (entry.damage) parts.push('damage');
  if (entry.effects) parts.push(...Object.keys(entry.effects).slice(0, 3));
  return parts.length > 0
    ? `When active, adds: ${parts.join(', ')}`
    : undefined;
}

function prettifyGroupId(groupId: string): string {
  // 'adaptation' → 'Adaptation'
  // 'tidal_power-stacks' → 'Tidal Power Stacks'
  // 'kinetic_combat-levels' → 'Kinetic Combat Levels'
  return groupId
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
