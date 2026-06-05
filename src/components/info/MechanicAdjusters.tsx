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
  ADAPTATION_MODES,
  ADAPTATION_MODE_IDS,
  isAdaptationModeId,
  stanceGroupForConditionalId,
  buildHasStanceEnabler,
} from '@/data';
import {
  AT_INHERENT_CONDITIONAL_IDS,
  describeAdjusterContribution,
  prettifyEffectKey,
} from './powerDisplayUtils';

interface MechanicAdjustersProps {
  power: Power;
}

export function MechanicAdjusters({ power }: MechanicAdjustersProps) {
  // Power internalNames in the build — used to gate "stance" conditionals
  // (Bio Armor adaptation, Staff Perfection) on the enabling power being taken.
  const build = useBuildStore((s) => s.build);
  const presentPowerNames = useMemo(() => {
    const names = new Set<string>();
    const add = (powers?: { internalName: string }[]) => powers?.forEach((p) => names.add(p.internalName));
    add(build.primary?.powers);
    add(build.secondary?.powers);
    build.pools?.forEach((pool) => add(pool.powers));
    add(build.epicPool?.powers);
    return names;
  }, [build.primary?.powers, build.secondary?.powers, build.pools, build.epicPool?.powers]);

  const conditional = power.conditionalEffects;
  if (!conditional || conditional.length === 0) return null;

  // Drop two classes of conditionals:
  //  - AT-inherent mechanics (Domination, etc.) — already controlled by the
  //    Header's dashboard; the merger reads that existing state for these ids.
  //  - Stance options (adaptation / perfection) whose enabling power isn't taken
  //    — without Adaptation / Staff Mastery the mechanic isn't available, so the
  //    selector would be a no-op (and the dashboard calc already ignores it).
  const surfaceable = conditional.filter((c) => {
    if (AT_INHERENT_CONDITIONAL_IDS.has(c.id)) return false;
    const stanceGroup = stanceGroupForConditionalId(c.id);
    if (stanceGroup && !buildHasStanceEnabler(stanceGroup, presentPowerNames)) return false;
    return true;
  });
  if (surfaceable.length === 0) return null;

  // Bio Armor adaptation modes are pulled out first and rendered as one
  // canonical 3-mode selector (Defensive / Offensive / Efficient) driven by the
  // app-side registry — regardless of how many modes *this* power happens to
  // carry. Bio Armor spreads the modes one-or-two per power (DNA Siphon only
  // gates Offensive; Environmental Modification gates Defensive + Offensive),
  // but the stance is a global caster state, so every Bio Armor power should
  // offer the same complete picker. See `@/data/adaptation-modes`.
  const adaptationEntries = surfaceable.filter((c) => isAdaptationModeId(c.id));
  const rest = surfaceable.filter((c) => !isAdaptationModeId(c.id));

  // Partition the remaining entries into groups (by `group` key) and
  // singletons. Within a group, entries render as a radio set; singletons
  // render as independent checkboxes.
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

  return (
    <div className="bg-slate-800/40 rounded p-2">
      <div className="flex flex-col gap-1">
        {adaptationEntries.length > 0 && (
          <AdaptationModeGroup power={power} entries={adaptationEntries} />
        )}
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
// Bio Armor Adaptation — always renders the full Defensive/Offensive/
// Efficient picker from the registry, even if `entries` only carries some
// of the modes. Selection is global + mutually exclusive across every Bio
// Armor power (and the dashboard calc) via `setGlobalAdjusterGroup` keyed by
// the registry's `ADAPTATION_MODE_IDS`.
// ----------------------------------------------------------------------

function AdaptationModeGroup({ power, entries }: { power: Power; entries: ConditionalEffect[] }) {
  const globalAdjusters = useUIStore((s) => s.globalAdjusters);
  const setGlobalAdjusterGroup = useUIStore((s) => s.setGlobalAdjusterGroup);
  const byId = new Map(entries.map((e) => [e.id, e] as const));
  const activeMode = ADAPTATION_MODES.find((m) => globalAdjusters[m.id]);
  const activeId = activeMode?.id ?? null;

  return (
    <div className="space-y-0.5">
      <GroupHeader label="Adaptation" isGlobal />
      {ADAPTATION_MODES.map((mode) => {
        // Use this power's real conditional entry when it carries this mode
        // (so the contribution hint reflects what THIS power actually grants);
        // otherwise a minimal placeholder so the row still renders.
        const entry = byId.get(mode.id) ?? {
          id: mode.id,
          label: mode.label,
          scope: 'global' as const,
          group: 'adaptation',
        };
        return (
          <RadioRow
            key={mode.id}
            power={power}
            entry={entry}
            labelOverride={mode.label}
            name={`group-${power.internalName}-adaptation`}
            checked={activeId === mode.id}
            onSelect={() => setGlobalAdjusterGroup(mode.id, ADAPTATION_MODE_IDS)}
          />
        );
      })}
      {activeId !== null && (
        <ClearButton onClick={() => setGlobalAdjusterGroup(null, ADAPTATION_MODE_IDS)} />
      )}
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
          name={`group-${groupId}`}
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
          name={`group-${powerName}-${groupId}`}
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
  name: string;
  checked: boolean;
  onSelect: () => void;
  /** Display label override — used by the Adaptation picker to show the
   *  in-game stance name ("Efficient Adaptation") rather than the data's
   *  internal "Rested Adaptation". */
  labelOverride?: string;
}

function RadioRow({ power, entry, name, checked, onSelect, labelOverride }: RadioRowProps) {
  return (
    <div className="flex flex-col">
      <label
        title={describeContribution(entry)}
        className="flex items-center gap-2 text-xs cursor-pointer hover:bg-slate-700/30 rounded px-1 py-0.5 ml-3"
      >
        <input
          type="radio"
          name={name}
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
