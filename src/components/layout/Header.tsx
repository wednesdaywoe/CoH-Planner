/**
 * Header component - top bar with build name, archetype, powersets, and controls
 * Matches the legacy app layout with archetype and powerset selectors in the header
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useBuildStore, useUIStore, useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { getPowersetsForArchetype, getPowerset, MAX_LEVEL, ARCHETYPES } from '@/data';
import { Button, Select, Slider, Toggle, Tooltip } from '@/components/ui';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { calculateVigilanceDamageBonus, calculateAssassinationDamageBonus, OPPORTUNITY_CRIT_MULTIPLIER } from '@/utils/calculations';
import type { ArchetypeId, ArchetypeBranchId, Origin, Powerset } from '@/types';
import { BUILD_TIME, APP_VERSION } from '@/buildTime';

const LAST_UPDATED = (() => {
  const date = new Date(BUILD_TIME);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
})();

const SERVER_OPTIONS = [
  { value: 'homecoming', label: 'Homecoming' },
  { value: 'rebirth', label: 'Rebirth (Coming Soon)', disabled: true },
  { value: 'thunderspy', label: 'Thunderspy (Coming Soon)', disabled: true },
];

const ORIGIN_OPTIONS = [
  { value: 'Magic', label: 'Magic' },
  { value: 'Mutation', label: 'Mutation' },
  { value: 'Natural', label: 'Natural' },
  { value: 'Science', label: 'Science' },
  { value: 'Technology', label: 'Technology' },
];

const ARCHETYPE_OPTIONS = [
  { value: '', label: 'Select Archetype...' },
  // Heroes
  { value: 'blaster', label: 'Blaster' },
  { value: 'controller', label: 'Controller' },
  { value: 'defender', label: 'Defender' },
  { value: 'scrapper', label: 'Scrapper' },
  { value: 'tanker', label: 'Tanker' },
  { value: 'sentinel', label: 'Sentinel' },
  // Villains
  { value: 'brute', label: 'Brute' },
  { value: 'corruptor', label: 'Corruptor' },
  { value: 'dominator', label: 'Dominator' },
  { value: 'mastermind', label: 'Mastermind' },
  { value: 'stalker', label: 'Stalker' },
  // Epic
  { value: 'peacebringer', label: 'Peacebringer' },
  { value: 'warshade', label: 'Warshade' },
  { value: 'arachnos-soldier', label: 'Arachnos Soldier' },
  { value: 'arachnos-widow', label: 'Arachnos Widow' },
];

/** Check if a powerset is primary using its category field */
function isPrimaryPowerset(powerset: Powerset): boolean {
  return powerset.category === 'primary';
}

export function Header() {
  const build = useBuildStore((s) => s.build);
  const setArchetype = useBuildStore((s) => s.setArchetype);
  const setBuildName = useBuildStore((s) => s.setBuildName);
  const setPrimary = useBuildStore((s) => s.setPrimary);
  const setSecondary = useBuildStore((s) => s.setSecondary);
  const setOrigin = useBuildStore((s) => s.setOrigin);

  const setLevel = useBuildStore((s) => s.setLevel);
  const resetBuild = useBuildStore((s) => s.resetBuild);
  const clearPowers = useBuildStore((s) => s.clearPowers);
  const resetForNewBuild = useUIStore((s) => s.resetForNewBuild);

  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const toggleExemplarMode = useUIStore((s) => s.toggleExemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);
  const setExemplarLevel = useUIStore((s) => s.setExemplarLevel);
  const targetLevelOffset = useUIStore((s) => s.targetLevelOffset);
  const setTargetLevelOffset = useUIStore((s) => s.setTargetLevelOffset);
  const dominationActive = useUIStore((s) => s.dominationActive);
  const toggleDomination = useUIStore((s) => s.toggleDomination);
  const scourgeActive = useUIStore((s) => s.scourgeActive);
  const toggleScourge = useUIStore((s) => s.toggleScourge);
  const furyLevel = useUIStore((s) => s.furyLevel);
  const setFuryLevel = useUIStore((s) => s.setFuryLevel);
  const supremacyActive = useUIStore((s) => s.supremacyActive);
  const toggleSupremacy = useUIStore((s) => s.toggleSupremacy);
  const vigilanceTeamSize = useUIStore((s) => s.vigilanceTeamSize);
  const setVigilanceTeamSize = useUIStore((s) => s.setVigilanceTeamSize);
  const criticalHitsActive = useUIStore((s) => s.criticalHitsActive);
  const toggleCriticalHits = useUIStore((s) => s.toggleCriticalHits);
  const stalkerHidden = useUIStore((s) => s.stalkerHidden);
  const toggleStalkerHidden = useUIStore((s) => s.toggleStalkerHidden);
  const stalkerTeamSize = useUIStore((s) => s.stalkerTeamSize);
  const stalkerCritActive = useUIStore((s) => s.stalkerCritActive);
  const toggleStalkerCrit = useUIStore((s) => s.toggleStalkerCrit);
  const setStalkerTeamSize = useUIStore((s) => s.setStalkerTeamSize);
  const containmentActive = useUIStore((s) => s.containmentActive);
  const toggleContainment = useUIStore((s) => s.toggleContainment);
  const sentinelCritActive = useUIStore((s) => s.sentinelCritActive);
  const toggleSentinelCrit = useUIStore((s) => s.toggleSentinelCrit);
  const openExportImportModal = useUIStore((s) => s.openExportImportModal);
  const selectedBranch = useUIStore((s) => s.selectedBranch);
  const setSelectedBranch = useUIStore((s) => s.setSelectedBranch);
  const showSlotLevels = useUIStore((s) => s.showSlotLevels);
  const toggleShowSlotLevels = useUIStore((s) => s.toggleShowSlotLevels);
  const uiScale = useUIStore((s) => s.uiScale);
  const setUIScale = useUIStore((s) => s.setUIScale);

  const navigate = useNavigate();
  const location = useLocation();
  const isOnBuildsPage = location.pathname.startsWith('/builds');
  const [confirmAction, setConfirmAction] = useState<'new' | 'clear' | null>(null);

  const archetypeId = build.archetype.id;

  // Get archetype definition to check for branches
  const archetype = archetypeId ? ARCHETYPES[archetypeId] : null;
  const hasBranches = archetype?.branches && Object.keys(archetype.branches).length > 0;

  // Get base powersets for the archetype
  const allPowersets = archetypeId ? getPowersetsForArchetype(archetypeId) : [];

  // For Epic ATs with branches, we need special handling
  // Epic ATs have fixed primary/secondary, not filtered like standard ATs
  const isEpicAT = ['peacebringer', 'warshade', 'arachnos-soldier', 'arachnos-widow'].includes(archetypeId || '');

  // Get primary and secondary powersets
  let primaryPowersets: Powerset[];
  let secondaryPowersets: Powerset[];

  if (isEpicAT && archetype) {
    // Epic ATs: use explicitly defined sets
    primaryPowersets = archetype.primarySets
      .map(id => getPowerset(id))
      .filter((ps): ps is Powerset => ps !== undefined);
    secondaryPowersets = archetype.secondarySets
      .map(id => getPowerset(id))
      .filter((ps): ps is Powerset => ps !== undefined);

    // Branch powersets are rendered as combined sections in PlannerPage,
    // not as additional dropdown options. See AvailablePowers rendering.
  } else {
    // Standard ATs: filter by primary/secondary patterns
    primaryPowersets = allPowersets.filter((ps) => isPrimaryPowerset(ps));
    secondaryPowersets = allPowersets.filter((ps) => !isPrimaryPowerset(ps));
  }

  const primaryOptions = [
    { value: '', label: 'Select Primary...' },
    ...primaryPowersets.filter((ps) => ps.id).map((ps) => ({
      value: ps.id as string,
      label: ps.name,
    })),
  ];

  const secondaryOptions = [
    { value: '', label: 'Select Secondary...' },
    ...secondaryPowersets.filter((ps) => ps.id).map((ps) => ({
      value: ps.id as string,
      label: ps.name,
    })),
  ];

  const handleArchetypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setArchetype(value as ArchetypeId);

      // Auto-select powersets for Epic ATs (each has exactly one base primary + secondary)
      if (value === 'peacebringer') {
        setPrimary('peacebringer/luminous-blast');
        setSecondary('peacebringer/luminous-aura');
      } else if (value === 'warshade') {
        setPrimary('warshade/umbral-blast');
        setSecondary('warshade/umbral-aura');
      } else if (value === 'arachnos-soldier') {
        setPrimary('arachnos-soldier/arachnos-soldier');
        setSecondary('arachnos-soldier/training-and-gadgets');
      } else if (value === 'arachnos-widow') {
        setPrimary('arachnos-widow/widow-training');
        setSecondary('arachnos-widow/teamwork');
      }
    }
  };

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrimary(e.target.value);
  };

  const handleSecondaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecondary(e.target.value);
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-2">
      <div className="flex items-center gap-2 flex-nowrap overflow-x-auto md:flex-wrap md:overflow-x-visible scrollbar-thin">
        {/* Build name */}
        <input
          type="text"
          id="build-name"
          name="build-name"
          value={build.name}
          onChange={(e) => setBuildName(e.target.value)}
          placeholder="Build Name"
          className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 min-w-[120px]"
        />

        {/* Server/Dataset selector */}
        <Tooltip content="Select your server dataset. Rebirth and Thunderspy support is planned for a future update.">
          <Select
            id="server-select"
            name="server"
            options={SERVER_OPTIONS}
            value="homecoming"
            className="max-w-[180px] min-w-[120px]"
          />
        </Tooltip>

        {/* Archetype selector */}
        <Select
          id="archetype-select"
          name="archetype"
          options={ARCHETYPE_OPTIONS}
          value={archetypeId || ''}
          onChange={handleArchetypeChange}
          className="max-w-[200px] min-w-[125px]"
          highlight={!archetypeId}
        />

        {/* Primary & Secondary powerset selectors */}
        <div className="flex items-center gap-2">
          <Select
            id="primary-select"
            name="primary"
            options={archetypeId ? primaryOptions : [{ value: '', label: 'Select Primary...' }]}
            value={build.primary.id || ''}
            onChange={handlePrimaryChange}
            className="max-w-[200px] min-w-[125px]"
            disabled={!archetypeId}
            highlight={!!archetypeId && !build.primary.id}
          />
          <Select
            id="secondary-select"
            name="secondary"
            options={archetypeId ? secondaryOptions : [{ value: '', label: 'Select Secondary...' }]}
            value={build.secondary.id || ''}
            onChange={handleSecondaryChange}
            className="max-w-[200px] min-w-[125px]"
            disabled={!archetypeId}
            highlight={!!archetypeId && !build.secondary.id}
          />
        </div>

        {/* Branch selector for Arachnos Epic ATs */}
        {hasBranches && archetype?.branches && (
          <Tooltip content="Choose your specialization path. At level 24, you can branch into a specialization that unlocks additional powers.">
            <Select
              id="branch-select"
              name="branch"
              options={[
                { value: '', label: 'Select Branch...' },
                ...Object.entries(archetype.branches).map(([branchId, branch]) => ({
                  value: branchId,
                  label: branch.name,
                })),
              ]}
              value={selectedBranch || ''}
              onChange={(e) => setSelectedBranch(e.target.value as ArchetypeBranchId || null)}
              className="max-w-[180px] min-w-[125px]"
            />
          </Tooltip>
        )}

        {/* Origin selector */}
        <Select
          id="origin-select"
          name="origin"
          options={ORIGIN_OPTIONS}
          value={build.settings.origin}
          onChange={(e) => setOrigin(e.target.value as Origin)}
          className="max-w-[140px] min-w-[100px]"
        />

        {/* Domination toggle - only for Dominators */}
        {archetypeId === 'dominator' && (
          <Tooltip content="Toggle Domination active state to see enhanced mez values (2× magnitude, 1.5× duration)">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              dominationActive
                ? 'bg-pink-900/30 border-pink-700/50'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <Toggle
                id="domination-toggle"
                name="domination"
                checked={dominationActive}
                onChange={toggleDomination}
                label="Domination"
              />
            </div>
          </Tooltip>
        )}

        {/* Scourge toggle - only for Corruptors */}
        {archetypeId === 'corruptor' && (
          <Tooltip content="Toggle to show average Scourge damage bonus (+30% as multiplier). Scourge chance increases as enemy HP drops below 50%.">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              scourgeActive
                ? 'bg-sk-magenta/10 border-sk-magenta/30'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <Toggle
                id="scourge-toggle"
                name="scourge"
                checked={scourgeActive}
                onChange={toggleScourge}
                label="Scourge"
              />
            </div>
          </Tooltip>
        )}

        {/* Fury slider - only for Brutes */}
        {archetypeId === 'brute' && (
          <Tooltip content={`Fury grants +${furyLevel * 2}% damage. Adjust to see damage at different fury levels.`}>
            <div className={`flex items-center gap-1 px-2 py-1.5 rounded border ${
              furyLevel > 0
                ? 'bg-sk-magenta/10 border-sk-magenta/30'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <span className="text-xs text-sk-magenta font-semibold uppercase">Fury</span>
              <button
                onClick={() => setFuryLevel(Math.max(0, furyLevel - 1))}
                disabled={furyLevel <= 0}
                className="text-slate-400 hover:text-sk-magenta disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                &minus;
              </button>
              <span className="text-sm font-bold text-sk-magenta w-7 text-center">{furyLevel}</span>
              <button
                onClick={() => setFuryLevel(Math.min(100, furyLevel + 1))}
                disabled={furyLevel >= 100}
                className="text-slate-400 hover:text-sk-magenta disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                +
              </button>
              <Slider
                value={furyLevel}
                min={0}
                max={100}
                onChange={(e) => setFuryLevel(Number(e.target.value))}
                className="w-20"
                showValue={false}
                showRange={false}
              />
              <span className="text-[10px] text-sk-magenta/70">+{furyLevel * 2}%</span>
            </div>
          </Tooltip>
        )}

        {/* Supremacy toggle - only for Masterminds */}
        {archetypeId === 'mastermind' && (
          <Tooltip content="Toggle to show Supremacy buffs (+25% Damage, +10% ToHit) for henchmen within 60ft. Also enables Bodyguard Mode info.">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              supremacyActive
                ? 'bg-sk-magenta/10 border-sk-magenta/30'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <Toggle
                id="supremacy-toggle"
                name="supremacy"
                checked={supremacyActive}
                onChange={toggleSupremacy}
                label="Supremacy"
              />
            </div>
          </Tooltip>
        )}

        {/* Vigilance slider - only for Defenders */}
        {archetypeId === 'defender' && (() => {
          const damageBonus = calculateVigilanceDamageBonus(build.level, vigilanceTeamSize);
          const teamLabel = vigilanceTeamSize === 0 ? 'Solo' : `+${vigilanceTeamSize}`;
          return (
            <Tooltip content={`Vigilance grants +${(damageBonus * 100).toFixed(0)}% damage based on team size. Solo = max bonus, 3+ teammates = no bonus.`}>
              <div className={`flex items-center gap-1 px-2 py-1.5 rounded border ${
                vigilanceTeamSize < 3
                  ? 'bg-sk-magenta/10 border-sk-magenta/30'
                  : 'bg-slate-700/50 border-slate-600'
              }`}>
                <span className="text-xs text-sk-magenta font-semibold uppercase">Team</span>
                <button
                  onClick={() => setVigilanceTeamSize(Math.max(0, vigilanceTeamSize - 1))}
                  disabled={vigilanceTeamSize <= 0}
                  className="text-slate-400 hover:text-sk-magenta disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
                >
                  &minus;
                </button>
                <span className="text-sm font-bold text-sk-magenta w-8 text-center">{teamLabel}</span>
                <button
                  onClick={() => setVigilanceTeamSize(Math.min(7, vigilanceTeamSize + 1))}
                  disabled={vigilanceTeamSize >= 7}
                  className="text-slate-400 hover:text-sk-magenta disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
                >
                  +
                </button>
                <Slider
                  value={vigilanceTeamSize}
                  min={0}
                  max={7}
                  onChange={(e) => setVigilanceTeamSize(Number(e.target.value))}
                  className="w-16"
                  showValue={false}
                  showRange={false}
                />
                <span className="text-[10px] text-sk-magenta/70">+{(damageBonus * 100).toFixed(0)}%</span>
              </div>
            </Tooltip>
          );
        })()}

        {/* Critical Hits toggle - only for Scrappers */}
        {archetypeId === 'scrapper' && (
          <Tooltip content="Toggle to show average Critical Hit damage bonus. 5% crit chance vs minions (+5% avg), 10% vs higher ranks (+10% avg). Critical hits deal double damage.">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              criticalHitsActive
                ? 'bg-sk-magenta/10 border-sk-magenta/30'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <Toggle
                id="critical-hits-toggle"
                name="criticalHits"
                checked={criticalHitsActive}
                onChange={toggleCriticalHits}
                label="Critical Hits"
              />
            </div>
          </Tooltip>
        )}

        {/* Stalker Assassination controls */}
        {archetypeId === 'stalker' && (() => {
          const damageBonus = calculateAssassinationDamageBonus(stalkerHidden, stalkerTeamSize);
          const teamLabel = stalkerTeamSize === 0 ? 'Solo' : `+${stalkerTeamSize}`;
          return (
            <>
              {/* Hidden toggle */}
              <Tooltip content={stalkerHidden
                ? "Attacking from Hide: 100% critical chance (double damage)"
                : "Not Hidden: 10% base crit + 3% per teammate. Toggle to see damage from Hide."
              }>
                <div className={`flex items-center px-2 py-1.5 rounded border ${
                  stalkerHidden
                    ? 'bg-sk-magenta/10 border-sk-magenta/30'
                    : 'bg-slate-700/50 border-slate-600'
                }`}>
                  <Toggle
                    id="stalker-hidden-toggle"
                    name="stalkerHidden"
                    checked={stalkerHidden}
                    onChange={toggleStalkerHidden}
                    label="Hidden"
                  />
                </div>
              </Tooltip>
              {/* Team size slider (only shows when not hidden) */}
              {!stalkerHidden && (
                <Tooltip content={`Assassination grants +${(damageBonus * 100).toFixed(0)}% avg damage. 10% base crit + 3% per teammate outside of hide.`}>
                  <div className="flex items-center gap-1 px-2 py-1.5 rounded border bg-sk-magenta/10 border-sk-magenta/30">
                    <span className="text-xs text-sk-magenta font-semibold uppercase">Team</span>
                    <button
                      onClick={() => setStalkerTeamSize(Math.max(0, stalkerTeamSize - 1))}
                      disabled={stalkerTeamSize <= 0}
                      className="text-slate-400 hover:text-sk-magenta disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
                    >
                      &minus;
                    </button>
                    <span className="text-sm font-bold text-sk-magenta w-8 text-center">{teamLabel}</span>
                    <button
                      onClick={() => setStalkerTeamSize(Math.min(7, stalkerTeamSize + 1))}
                      disabled={stalkerTeamSize >= 7}
                      className="text-slate-400 hover:text-sk-magenta disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
                    >
                      +
                    </button>
                    <Slider
                      value={stalkerTeamSize}
                      min={0}
                      max={7}
                      onChange={(e) => setStalkerTeamSize(Number(e.target.value))}
                      className="w-16"
                      showValue={false}
                      showRange={false}
                    />
                    <span className="text-[10px] text-sk-magenta/70">+{(damageBonus * 100).toFixed(0)}%</span>
                  </div>
                </Tooltip>
              )}
              {/* Crit toggle */}
              <Tooltip content={`Toggle to show average Assassination critical damage bonus (+${(damageBonus * 100).toFixed(0)}% avg).`}>
                <div className={`flex items-center px-2 py-1.5 rounded border ${
                  stalkerCritActive
                    ? 'bg-sk-magenta/10 border-sk-magenta/30'
                    : 'bg-slate-700/50 border-slate-600'
                }`}>
                  <Toggle
                    id="stalker-crit-toggle"
                    name="stalkerCrit"
                    checked={stalkerCritActive}
                    onChange={toggleStalkerCrit}
                    label="Crits"
                  />
                </div>
              </Tooltip>
            </>
          );
        })()}

        {/* Containment toggle - only for Controllers */}
        {archetypeId === 'controller' && (
          <Tooltip content="Toggle to show Containment damage bonus. Controllers deal double damage to Held, Immobilized, Slept, or Disoriented targets.">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              containmentActive
                ? 'bg-sk-magenta/10 border-sk-magenta/30'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <Toggle
                id="containment-toggle"
                name="containment"
                checked={containmentActive}
                onChange={toggleContainment}
                label="Containment"
              />
            </div>
          </Tooltip>
        )}

        {/* Sentinel Opportunity Crit toggle */}
        {archetypeId === 'sentinel' && (
          <Tooltip content={`Toggle to show Opportunity critical damage bonus (+${(OPPORTUNITY_CRIT_MULTIPLIER * 100).toFixed(0)}%). Crits deal ${(OPPORTUNITY_CRIT_MULTIPLIER * 100).toFixed(0)}% bonus damage.`}>
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              sentinelCritActive
                ? 'bg-sk-magenta/10 border-sk-magenta/30'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <Toggle
                id="sentinel-crit-toggle"
                name="sentinelCrit"
                checked={sentinelCritActive}
                onChange={toggleSentinelCrit}
                label="Opportunity Crit"
              />
            </div>
          </Tooltip>
        )}

        {/* Level & IO sliders */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
            <span className="text-xs text-slate-400 font-semibold uppercase">Level</span>
            <button
              onClick={() => setLevel(build.level - 1)}
              disabled={build.level <= 1}
              className="text-slate-400 hover:text-emerald-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
            >
              &minus;
            </button>
            <span className="text-sm font-bold text-emerald-400 w-6 text-center">{build.level}</span>
            <button
              onClick={() => setLevel(build.level + 1)}
              disabled={build.level >= MAX_LEVEL}
              className="text-slate-400 hover:text-emerald-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
            >
              +
            </button>
            <Slider
              value={build.level}
              min={1}
              max={MAX_LEVEL}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-24"
              showValue={false}
              showRange={false}
            />
          </div>
          <Tooltip content="Set target enemy level relative to yours. Affects Hit Chance in the stats dashboard.">
            <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
              <span className="text-xs text-slate-400 font-semibold uppercase">Target</span>
              <button
                onClick={() => setTargetLevelOffset(targetLevelOffset - 1)}
                disabled={targetLevelOffset <= -5}
                className="text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                &minus;
              </button>
              <span className="text-sm font-bold text-cyan-400 w-6 text-center">
                {targetLevelOffset >= 0 ? `+${targetLevelOffset}` : `${targetLevelOffset}`}
              </span>
              <button
                onClick={() => setTargetLevelOffset(targetLevelOffset + 1)}
                disabled={targetLevelOffset >= 5}
                className="text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                +
              </button>
            </div>
          </Tooltip>
          <Tooltip content="Show/hide slot level labels on enhancement slots">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              showSlotLevels ? 'bg-slate-700/50 border-slate-500' : 'bg-slate-700/50 border-slate-600'
            }`}>
              <Toggle
                id="slot-levels-toggle"
                name="showSlotLevels"
                checked={showSlotLevels}
                onChange={toggleShowSlotLevels}
                label="Slot Lvls"
              />
            </div>
          </Tooltip>
          <Tooltip content="When enabled, set bonuses are suppressed based on build level (simulates exemplaring down)">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              exemplarMode ? 'bg-amber-900/20 border-amber-600/50' : 'bg-slate-700/50 border-slate-600'
            }`}>
              <Toggle
                id="exemplar-mode-toggle"
                name="exemplarMode"
                checked={exemplarMode}
                onChange={toggleExemplarMode}
                label="Exemplar"
              />
            </div>
          </Tooltip>
          {exemplarMode && (
            <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1.5 rounded border border-amber-600/50">
              <span className="text-xs text-amber-400 font-semibold uppercase">Exemplar</span>
              <button
                onClick={() => setExemplarLevel(exemplarLevel - 1)}
                disabled={exemplarLevel <= 1}
                className="text-slate-400 hover:text-amber-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                &minus;
              </button>
              <span className="text-sm font-bold text-amber-400 w-6 text-center">{exemplarLevel}</span>
              <button
                onClick={() => setExemplarLevel(exemplarLevel + 1)}
                disabled={exemplarLevel >= 50}
                className="text-slate-400 hover:text-amber-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                +
              </button>
              <Slider
                value={exemplarLevel}
                min={1}
                max={50}
                onChange={(e) => setExemplarLevel(Number(e.target.value))}
                className="w-20"
                showValue={false}
                showRange={false}
              />
            </div>
          )}
          <Tooltip content={`UI zoom: ${Math.round(uiScale * 100)}%. Click +/- to scale the interface.`}>
            <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                onClick={() => setUIScale(uiScale - 0.05)}
                disabled={uiScale <= 0.85}
                className="text-slate-400 hover:text-sky-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                &minus;
              </button>
              <span className="text-sm font-bold text-sky-400 w-8 text-center">{Math.round(uiScale * 100)}%</span>
              <button
                onClick={() => setUIScale(uiScale + 0.05)}
                disabled={uiScale >= 1.3}
                className="text-slate-400 hover:text-sky-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                +
              </button>
            </div>
          </Tooltip>
        </div>

        {/* Export, Import, New, Clear */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: isOnBuildsPage ? '/' : '/builds' })}
            title={isOnBuildsPage ? 'Return to the build planner' : 'Browse shared builds from the community'}
            style={{ background: '#4f46e5', borderColor: '#6366f1' }}
            className="text-white hover:!bg-indigo-700"
          >
            {isOnBuildsPage ? 'Back to Planner' : 'Shared Builds'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openExportImportModal()}
            title="Export or import a build"
            style={{ background: '#059669', borderColor: '#10b981' }}
            className="text-white hover:!bg-emerald-700"
          >
            Save / Load / Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmAction('new')}
            title="Reset build and start fresh"
            style={{ background: '#0284c7', borderColor: '#0ea5e9' }}
            className="text-white hover:!bg-sky-700"
          >
            New
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmAction('clear')}
            title="Clear powers and slots, keep archetype and powersets"
            style={{ background: '#d97706', borderColor: '#f59e0b' }}
            className="text-white hover:!bg-amber-700"
          >
            Clear
          </Button>
        </div>

        {/* Discord login / user menu */}
        {supabase && <DiscordAuthButton />}

        {/* Version and last updated */}
        <span className="text-xs text-slate-500 ml-auto whitespace-nowrap">
          v{APP_VERSION} — Updated {LAST_UPDATED}
        </span>
      </div>
      {/* Confirmation modals (replaces window.confirm for mobile compatibility) */}
      <ConfirmModal
        isOpen={confirmAction === 'new'}
        title="New Build"
        message="Are you sure you want to reset? This will clear your entire build."
        confirmLabel="Reset"
        onConfirm={() => { resetBuild(); resetForNewBuild(); setConfirmAction(null); }}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmModal
        isOpen={confirmAction === 'clear'}
        title="Clear Powers"
        message="Clear all powers and enhancements? Archetype and powerset selections will be kept."
        confirmLabel="Clear"
        onConfirm={() => { clearPowers(); setConfirmAction(null); }}
        onCancel={() => setConfirmAction(null)}
      />
    </header>
  );
}

/** Auth button — login dropdown (logged out) or user menu (logged in) */
function DiscordAuthButton() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  if (loading) return null;

  // Logged out — show login dropdown with provider choices
  if (!user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition-colors whitespace-nowrap"
          title="Sign in for cross-device build management"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Log In
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-1 min-w-[210px] z-50">
            <p className="px-3 pt-2 pb-1 text-xs text-gray-400 leading-relaxed">
              Optionally sign in to manage your shared builds across devices and browsers.
            </p>
            <p className="px-3 pb-1.5 text-[10px] text-gray-500">
              Not required — anonymous sharing still works without an account.
            </p>
            <div className="border-t border-gray-700 my-1" />
            <button
              onClick={() => { login('discord'); setMenuOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
            >
              <DiscordIcon /> Sign in with Discord
            </button>
          </div>
        )}
      </div>
    );
  }

  // Logged in — show user menu
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition-colors whitespace-nowrap"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-4 h-4 rounded-full" />
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        <span className="max-w-[80px] truncate">{displayName}</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-1 min-w-[140px] z-50">
          <button
            onClick={() => { navigate({ to: '/builds' }); setMenuOpen(false); }}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            My Builds
          </button>
          <button
            onClick={() => { navigate({ to: '/settings' }); setMenuOpen(false); }}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Account
          </button>
          <hr className="border-gray-700 my-1" />
          <button
            onClick={() => { logout(); setMenuOpen(false); }}
            className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

/** Provider logo icons (16x16) */
function DiscordIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
    </svg>
  );
}


