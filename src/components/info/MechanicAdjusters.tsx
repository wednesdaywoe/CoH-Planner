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
 * Visual cadence matches TagsBlock / GeneralStatsBlock — compact
 * `bg-slate-800/40 rounded p-2` container with cyan accents for the
 * state-mechanic theme, and a checkbox style consistent with the radio
 * rows (no chunky `Toggle` switch which dominates vertical space).
 */

import { useMemo } from 'react';
import type { ConditionalEffect, Power } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
import {
  useUIStore,
  useBuildStore,
  useMechanicAdjuster,
  useGlobalAdjuster,
} from '@/stores';
import {
  STANCE_GROUPS,
  findStanceParent,
  activeStanceOptionId,
  stanceGroupForConditionalId,
} from '@/data';
import type { StanceGroup, StancePowerLike } from '@/data';
import {
  AT_INHERENT_CONDITIONAL_IDS,
  describeAdjusterContribution,
  prettifyEffectKey,
} from './powerDisplayUtils';

interface MechanicAdjustersProps {
  power: Power;
}

export function MechanicAdjusters({ power }: MechanicAdjustersProps) {
  // All build powers (flat) — used to resolve the stance parent (Adaptation /
  // Staff Mastery) and read its `activeSubPower`, the single source of truth
  // for which stance is active.
  const build = useBuildStore((s) => s.build);
  const buildPowers = useMemo(() => {
    const out: StancePowerLike[] = [];
    const add = (powers?: { internalName: string; activeSubPower?: string }[]) =>
      powers?.forEach((p) => out.push({ internalName: p.internalName, activeSubPower: p.activeSubPower }));
    add(build.primary?.powers);
    add(build.secondary?.powers);
    build.pools?.forEach((pool) => add(pool.powers));
    add(build.epicPool?.powers);
    return out;
  }, [build.primary?.powers, build.secondary?.powers, build.pools, build.epicPool?.powers]);

  const conditional = power.conditionalEffects;
  if (!conditional || conditional.length === 0) return null;

  // AT-inherent mechanics (Domination, …) share their active state with the
  // Header's dashboard toggle. We still surface a *mirror* toggle here — on the
  // power — because that's where players (and Mids veterans) look for it. The
  // mirror reads/writes the SAME uiStore state (not the generic globalAdjusters
  // map), so flipping it here or in the Header stays in lockstep and the
  // calc/display keep their single source of truth.
  const atInherent = conditional.filter((c) => AT_INHERENT_CONDITIONAL_IDS.has(c.id));
  const surfaceable = conditional.filter((c) => !AT_INHERENT_CONDITIONAL_IDS.has(c.id));
  const dominationEntry = atInherent.find((c) => c.id === 'domination');

  // Pull out stance options (Bio Armor adaptation, Staff Perfection) and route
  // them to a single canonical picker per stance group, driven by the parent's
  // `activeSubPower`. The picker always offers the full set of options from the
  // registry (a power may only carry some), and is hidden entirely when the
  // enabling parent isn't in the build (no Adaptation / Staff Mastery → no
  // stance). Each group's entries on THIS power are kept for contribution hints.
  const stanceEntries = new Map<string, ConditionalEffect[]>();
  const rest: ConditionalEffect[] = [];
  for (const c of surfaceable) {
    const group = stanceGroupForConditionalId(c.id);
    if (group) {
      const arr = stanceEntries.get(group.key) ?? [];
      arr.push(c);
      stanceEntries.set(group.key, arr);
    } else {
      rest.push(c);
    }
  }
  const stanceRenders = STANCE_GROUPS.map((group) => {
    const entries = stanceEntries.get(group.key);
    if (!entries || entries.length === 0) return null;
    const parent = findStanceParent(buildPowers, group);
    if (!parent) return null; // enabling parent not taken → stance unavailable
    return { group, parent, entries };
  }).filter((r): r is { group: StanceGroup; parent: StancePowerLike; entries: ConditionalEffect[] } => r !== null);

  // Partition the remaining (non-stance) entries into groups and singletons.
  const groups = new Map<string, ConditionalEffect[]>();
  const singletons: ConditionalEffect[] = [];
  for (const c of rest) {
    if (c.group) {
      const arr = groups.get(c.group) ?? [];
      arr.push(c);
      groups.set(c.group, arr);
    } else {
      singletons.push(c);
    }
  }

  if (stanceRenders.length === 0 && groups.size === 0 && singletons.length === 0 && !dominationEntry) return null;

  return (
    <div className="bg-slate-800/40 rounded p-2">
      <div className="flex flex-col gap-1">
        {dominationEntry && <DominationAdjusterToggle power={power} entry={dominationEntry} />}
        {stanceRenders.map(({ group, parent, entries }) => (
          <StanceModeGroup
            key={group.key}
            power={power}
            group={group}
            parent={parent}
            entries={entries}
          />
        ))}
        {Array.from(groups.entries()).map(([groupId, members]) => (
          <RadioGroup
            key={groupId}
            power={power}
            groupId={groupId}
            members={members}
          />
        ))}
        {singletons.map((c) => (
          <SingleToggle
            key={c.id}
            power={power}
            entry={c}
          />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Stance picker (Bio Armor Adaptation, Staff Fighting Form). Always renders
// the full set of stances from the registry, even if `entries` only carries
// some. Selection is the parent power's `activeSubPower` (build-scoped, shared
// with the power-list stance chips and the header selector), written via
// `setActiveSubPower`. Mutually exclusive by construction (one activeSubPower).
// ----------------------------------------------------------------------

function StanceModeGroup({
  power,
  group,
  parent,
  entries,
}: {
  power: Power;
  group: StanceGroup;
  parent: StancePowerLike;
  entries: ConditionalEffect[];
}) {
  const setActiveSubPower = useBuildStore((s) => s.setActiveSubPower);
  const byId = new Map(entries.map((e) => [e.id, e] as const));
  const activeId = activeStanceOptionId([parent], group);

  return (
    <div className="space-y-0.5">
      <GroupHeader label={group.headerLabel} isGlobal />
      {group.options.map((option) => {
        // Use this power's real conditional entry when it carries this stance
        // (so the contribution hint reflects what THIS power grants); otherwise
        // a minimal placeholder so the row still renders.
        const entry = byId.get(option.id) ?? {
          id: option.id,
          label: option.label,
          scope: 'global' as const,
          group: group.key,
        };
        const active = activeId === option.id;
        return (
          <RadioRow
            key={option.id}
            power={power}
            entry={entry}
            labelOverride={option.label}
            checked={active}
            onSelect={() => setActiveSubPower(parent.internalName, active ? null : (option.subPower ?? null))}
          />
        );
      })}
      {activeId !== null && (
        <ClearButton onClick={() => setActiveSubPower(parent.internalName, null)} />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// AT-inherent mirror toggle (Domination). A second control surface for the
// Header's dashboard switch, placed on the power because that's where players
// expect it. It reads/writes the shared `uiStore.dominationActive` (the single
// source of truth the calc + effect display already consult) rather than the
// generic globalAdjusters map, so this toggle and the Header switch move as one.
// No ContributionHint: the effect rows already render the boosted Mag/duration
// inline when active — the generic "+ extra instance" hint would misdescribe it.
// Add more AT-inherent mirrors here as other ids gain store bindings.
// ----------------------------------------------------------------------

function DominationAdjusterToggle({ power, entry }: { power: Power; entry: ConditionalEffect }) {
  const active = useUIStore((s) => s.dominationActive);
  const toggle = useUIStore((s) => s.toggleDomination);
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <Toggle
        id={`adjuster-${power.internalName}-${entry.id}`}
        checked={active}
        onChange={toggle}
        label="Domination"
        title="While Domination is active, this power's control magnitude and duration are boosted."
      />
      <GlobalBadge />
    </div>
  );
}

// ----------------------------------------------------------------------
// Single (non-grouped) toggle — checkbox semantics.
// ----------------------------------------------------------------------

interface SingleToggleProps {
  power: Power;
  entry: ConditionalEffect;
}

function SingleToggle({ power, entry }: SingleToggleProps) {
  const powerName = power.internalName;
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
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2 text-xs">
        <Toggle
          id={`adjuster-${powerName}-${entry.id}`}
          checked={active}
          onChange={(e) => handleChange(e.target.checked)}
          label={entry.label}
          title={describeContribution(entry)}
        />
        {isGlobal && <GlobalBadge />}
      </div>
      <ContributionHint power={power} entry={entry} indent="ml-12" />
    </div>
  );
}

// ----------------------------------------------------------------------
// Radio group — exactly one member can be active at a time.
// ----------------------------------------------------------------------

interface RadioGroupProps {
  power: Power;
  groupId: string;
  members: ConditionalEffect[];
}

function RadioGroup({ power, groupId, members }: RadioGroupProps) {
  // Group scope is determined by the members. Mixed-scope groups
  // shouldn't happen by construction (a group either represents a global
  // mechanic or a per-target tier), but if they do we treat the whole
  // group as global so toggle behavior is consistent.
  const anyGlobal = members.some((m) => m.scope === 'global');
  return anyGlobal
    ? <GlobalRadioGroup power={power} groupId={groupId} members={members} />
    : <PerPowerRadioGroup power={power} groupId={groupId} members={members} />;
}

function GlobalRadioGroup({ power, groupId, members }: { power: Power; groupId: string; members: ConditionalEffect[] }) {
  const globalAdjusters = useUIStore((s) => s.globalAdjusters);
  const setGlobalAdjusterGroup = useUIStore((s) => s.setGlobalAdjusterGroup);
  const activeId = members.find((m) => globalAdjusters[m.id])?.id ?? null;

  return (
    <div className="space-y-0.5">
      <GroupHeader label={prettifyGroupId(groupId)} isGlobal />
      {members.map((m) => (
        <RadioRow
          key={m.id}
          power={power}
          entry={m}
          checked={activeId === m.id}
          onSelect={() =>
            setGlobalAdjusterGroup(m.id, members.map((mm) => mm.id))
          }
        />
      ))}
      {activeId !== null && (
        <ClearButton onClick={() => setGlobalAdjusterGroup(null, members.map((m) => m.id))} />
      )}
    </div>
  );
}

function PerPowerRadioGroup({
  power,
  groupId,
  members,
}: {
  power: Power;
  groupId: string;
  members: ConditionalEffect[];
}) {
  const powerName = power.internalName;
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
      <GroupHeader label={prettifyGroupId(groupId)} />
      {members.map((m) => (
        <RadioRow
          key={m.id}
          power={power}
          entry={m}
          checked={activeId === m.id}
          onSelect={() => select(m.id)}
        />
      ))}
      {activeId !== null && (
        <ClearButton onClick={() => select(null)} />
      )}
    </div>
  );
}

interface RadioRowProps {
  power: Power;
  entry: ConditionalEffect;
  checked: boolean;
  onSelect: () => void;
  /** Display label override — used by the Adaptation picker to show the
   *  in-game stance name ("Efficient Adaptation") rather than the data's
   *  internal "Rested Adaptation". */
  labelOverride?: string;
}

// NOTE: intentionally NO native `name` group on the radios. `checked` is a fully
// controlled value derived from a single active id (activeStanceOptionId / the
// group's active member), so React alone enforces mutual exclusivity. Sharing a
// `name` makes the browser natively uncheck sibling radios on click, which
// desyncs React's controlled `checked` tracking and left the newly-picked stance
// visually unfilled until a second click (the "needs a double-click" bug). The
// Header's stance picker avoids this by using <button>s; the row-level clear is
// handled by the sibling ClearButton, so we don't rely on re-clicking a radio.
function RadioRow({ power, entry, checked, onSelect, labelOverride }: RadioRowProps) {
  return (
    <div className="flex flex-col">
      <label
        title={describeContribution(entry)}
        className="flex items-center gap-2 text-xs cursor-pointer hover:bg-slate-700/30 rounded px-1 py-0.5 ml-3"
      >
        <input
          type="radio"
          checked={checked}
          onChange={onSelect}
          className="accent-cyan-500 w-3 h-3"
        />
        <span className={checked ? 'text-slate-100' : 'text-slate-300'}>{labelOverride ?? entry.label}</span>
      </label>
      <ContributionHint power={power} entry={entry} indent="ml-9" />
    </div>
  );
}

// ----------------------------------------------------------------------
// Shared visual primitives.
// ----------------------------------------------------------------------

function GlobalBadge() {
  return (
    <span
      className="text-cyan-400/70 italic text-[10px] uppercase tracking-wide"
      title="Affects all powers that share this state"
    >
      global
    </span>
  );
}

function GroupHeader({ label, isGlobal }: { label: string; isGlobal?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs px-1">
      <span className="text-slate-300 font-medium">{label}</span>
      {isGlobal && <GlobalBadge />}
    </div>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="text-[11px] text-slate-400 hover:text-slate-300 underline ml-9"
      onClick={onClick}
    >
      clear
    </button>
  );
}

// ----------------------------------------------------------------------
// Contribution hint — surfaces "+ second hold instance" style annotations
// for additive conditionals whose effects collide with base, since the
// merger silently leaves base untouched in that case (multi-instance
// display is a separate workstream).
// ----------------------------------------------------------------------

function ContributionHint({
  power,
  entry,
  indent = 'ml-6',
}: { power: Power; entry: ConditionalEffect; indent?: string }) {
  const { collisionKeys } = describeAdjusterContribution(power, entry);
  if (collisionKeys.length === 0) return null;
  const phrase = collisionKeys.map(prettifyEffectKey).join(', ');
  return (
    <div
      className={`text-[11px] text-slate-400 italic ${indent}`}
      title={`When active, casts a second simultaneous instance of: ${phrase}. The displayed numbers don't yet show the duplicate; the game treats them as stacked.`}
    >
      + extra {phrase} instance
    </div>
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
