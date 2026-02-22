/**
 * Header component - top bar with build name, archetype, powersets, and controls
 * Matches the legacy app layout with archetype and powerset selectors in the header
 */

import { useBuildStore, useUIStore } from '@/stores';
import { getPowersetsForArchetype, getPowerset, MAX_LEVEL, ARCHETYPES } from '@/data';
import { Button, Select, Slider, Toggle, Tooltip } from '@/components/ui';
import { calculateVigilanceDamageBonus, calculateAssassinationDamageBonus } from '@/utils/calculations';
import type { ArchetypeId, ArchetypeBranchId, Powerset } from '@/types';
import { BUILD_TIME } from '@/buildTime';

const LAST_UPDATED = (() => {
  const date = new Date(BUILD_TIME);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
})();

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

  const setLevel = useBuildStore((s) => s.setLevel);
  const resetBuild = useBuildStore((s) => s.resetBuild);
  const clearPowers = useBuildStore((s) => s.clearPowers);

  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const setGlobalIOLevel = useUIStore((s) => s.setGlobalIOLevel);
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const toggleExemplarMode = useUIStore((s) => s.toggleExemplarMode);
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
  const setStalkerTeamSize = useUIStore((s) => s.setStalkerTeamSize);
  const containmentActive = useUIStore((s) => s.containmentActive);
  const toggleContainment = useUIStore((s) => s.toggleContainment);
  const openExportImportModal = useUIStore((s) => s.openExportImportModal);
  const selectedBranch = useUIStore((s) => s.selectedBranch);
  const setSelectedBranch = useUIStore((s) => s.setSelectedBranch);

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

    // If a branch is selected, add branch-specific powersets
    if (selectedBranch && archetype.branches?.[selectedBranch]) {
      const branch = archetype.branches[selectedBranch];
      if (branch.primarySet) {
        const branchPrimary = getPowerset(branch.primarySet);
        if (branchPrimary) primaryPowersets.push(branchPrimary);
      }
      if (branch.secondarySet) {
        const branchSecondary = getPowerset(branch.secondarySet);
        if (branchSecondary) secondaryPowersets.push(branchSecondary);
      }
    }
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

      // Auto-select powersets for Kheldians (only one option each)
      if (value === 'peacebringer') {
        setPrimary('peacebringer/luminous-blast');
        setSecondary('peacebringer/luminous-aura');
      } else if (value === 'warshade') {
        setPrimary('warshade/umbral-blast');
        setSecondary('warshade/umbral-aura');
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
      <div className="flex items-center gap-2 flex-wrap">
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

        {/* Archetype selector */}
        <Select
          id="archetype-select"
          name="archetype"
          options={ARCHETYPE_OPTIONS}
          value={archetypeId || ''}
          onChange={handleArchetypeChange}
          className="max-w-[200px] min-w-[125px]"
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
          />
          <Select
            id="secondary-select"
            name="secondary"
            options={archetypeId ? secondaryOptions : [{ value: '', label: 'Select Secondary...' }]}
            value={build.secondary.id || ''}
            onChange={handleSecondaryChange}
            className="max-w-[200px] min-w-[125px]"
            disabled={!archetypeId}
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

        {/* Exemplar Mode toggle */}
        <Tooltip content="When enabled, set bonuses are suppressed based on build level (simulates exemplaring down)">
          <div className="flex items-center bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
            <Toggle
              id="exemplar-mode-toggle"
              name="exemplarMode"
              checked={exemplarMode}
              onChange={toggleExemplarMode}
              label="Exemplar"
            />
          </div>
        </Tooltip>

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
                ? 'bg-cyan-900/30 border-cyan-700/50'
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
                ? 'bg-red-900/30 border-red-700/50'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <span className="text-xs text-red-400 font-semibold uppercase">Fury</span>
              <button
                onClick={() => setFuryLevel(Math.max(0, furyLevel - 1))}
                disabled={furyLevel <= 0}
                className="text-slate-400 hover:text-red-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
              >
                &minus;
              </button>
              <span className="text-sm font-bold text-red-400 w-7 text-center">{furyLevel}</span>
              <button
                onClick={() => setFuryLevel(Math.min(100, furyLevel + 1))}
                disabled={furyLevel >= 100}
                className="text-slate-400 hover:text-red-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
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
              <span className="text-[10px] text-red-300">+{furyLevel * 2}%</span>
            </div>
          </Tooltip>
        )}

        {/* Supremacy toggle - only for Masterminds */}
        {archetypeId === 'mastermind' && (
          <Tooltip content="Toggle to show Supremacy buffs (+25% Damage, +10% ToHit) for henchmen within 60ft. Also enables Bodyguard Mode info.">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              supremacyActive
                ? 'bg-amber-900/30 border-amber-700/50'
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
                  ? 'bg-indigo-900/30 border-indigo-700/50'
                  : 'bg-slate-700/50 border-slate-600'
              }`}>
                <span className="text-xs text-indigo-400 font-semibold uppercase">Team</span>
                <button
                  onClick={() => setVigilanceTeamSize(Math.max(0, vigilanceTeamSize - 1))}
                  disabled={vigilanceTeamSize <= 0}
                  className="text-slate-400 hover:text-indigo-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
                >
                  &minus;
                </button>
                <span className="text-sm font-bold text-indigo-400 w-8 text-center">{teamLabel}</span>
                <button
                  onClick={() => setVigilanceTeamSize(Math.min(7, vigilanceTeamSize + 1))}
                  disabled={vigilanceTeamSize >= 7}
                  className="text-slate-400 hover:text-indigo-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
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
                <span className="text-[10px] text-indigo-300">+{(damageBonus * 100).toFixed(0)}%</span>
              </div>
            </Tooltip>
          );
        })()}

        {/* Critical Hits toggle - only for Scrappers */}
        {archetypeId === 'scrapper' && (
          <Tooltip content="Toggle to show average Critical Hit damage bonus. 5% crit chance vs minions (+5% avg), 10% vs higher ranks (+10% avg). Critical hits deal double damage.">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              criticalHitsActive
                ? 'bg-orange-900/30 border-orange-700/50'
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
                    ? 'bg-purple-900/30 border-purple-700/50'
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
                  <div className="flex items-center gap-1 px-2 py-1.5 rounded border bg-purple-900/30 border-purple-700/50">
                    <span className="text-xs text-purple-400 font-semibold uppercase">Team</span>
                    <button
                      onClick={() => setStalkerTeamSize(Math.max(0, stalkerTeamSize - 1))}
                      disabled={stalkerTeamSize <= 0}
                      className="text-slate-400 hover:text-purple-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
                    >
                      &minus;
                    </button>
                    <span className="text-sm font-bold text-purple-400 w-8 text-center">{teamLabel}</span>
                    <button
                      onClick={() => setStalkerTeamSize(Math.min(7, stalkerTeamSize + 1))}
                      disabled={stalkerTeamSize >= 7}
                      className="text-slate-400 hover:text-purple-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
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
                    <span className="text-[10px] text-purple-300">+{(damageBonus * 100).toFixed(0)}%</span>
                  </div>
                </Tooltip>
              )}
            </>
          );
        })()}

        {/* Containment toggle - only for Controllers */}
        {archetypeId === 'controller' && (
          <Tooltip content="Toggle to show Containment damage bonus. Controllers deal double damage to Held, Immobilized, Slept, or Disoriented targets.">
            <div className={`flex items-center px-2 py-1.5 rounded border ${
              containmentActive
                ? 'bg-cyan-900/30 border-cyan-700/50'
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
          <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
            <span className="text-xs text-slate-400 font-semibold uppercase">IO</span>
            <button
              onClick={() => setGlobalIOLevel(globalIOLevel - 1)}
              disabled={globalIOLevel <= 10}
              className="text-slate-400 hover:text-blue-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
            >
              &minus;
            </button>
            <span className="text-sm font-bold text-blue-400 w-6 text-center">{globalIOLevel}</span>
            <button
              onClick={() => setGlobalIOLevel(globalIOLevel + 1)}
              disabled={globalIOLevel >= 50}
              className="text-slate-400 hover:text-blue-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-0.5"
            >
              +
            </button>
            <Slider
              value={globalIOLevel}
              min={10}
              max={50}
              onChange={(e) => setGlobalIOLevel(Number(e.target.value))}
              className="w-20"
              showValue={false}
              showRange={false}
            />
          </div>
        </div>

        {/* Export, Import, New, Clear */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openExportImportModal()}
            title="Export your build to a file"
          >
            Export
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openExportImportModal()}
            title="Import a build from a file"
          >
            Import
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset? This will clear your entire build.')) {
                resetBuild();
              }
            }}
            title="Reset build and start fresh"
          >
            New
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (window.confirm('Clear all powers and enhancements? Archetype and powerset selections will be kept.')) {
                clearPowers();
              }
            }}
            title="Clear powers and slots, keep archetype and powersets"
          >
            Clear
          </Button>
        </div>

        {/* Last updated */}
        <span className="text-xs text-slate-500 ml-auto whitespace-nowrap">
          Updated {LAST_UPDATED}
        </span>
      </div>
    </header>
  );
}
