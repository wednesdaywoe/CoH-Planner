/**
 * Header component - two-row layout
 * Row 1: Build identity (name, AT, powersets, level), Shared Builds, action menu, settings popover, auth
 * Row 2 (conditional): AT-specific mechanic toggles/sliders
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

const ORIGIN_OPTIONS = [
  { value: 'Magic', label: 'Magic' },
  { value: 'Mutation', label: 'Mutation' },
  { value: 'Natural', label: 'Natural' },
  { value: 'Science', label: 'Science' },
  { value: 'Technology', label: 'Technology' },
];

const SERVER_OPTIONS = [
  { value: 'homecoming', label: 'Homecoming' },
  { value: 'rebirth', label: 'Rebirth (Coming Soon)', disabled: true },
  { value: 'thunderspy', label: 'Thunderspy (Coming Soon)', disabled: true },
];

const ARCHETYPE_OPTIONS = [
  { value: '', label: 'Select Archetype...' },
  { value: 'blaster', label: 'Blaster' },
  { value: 'controller', label: 'Controller' },
  { value: 'defender', label: 'Defender' },
  { value: 'scrapper', label: 'Scrapper' },
  { value: 'tanker', label: 'Tanker' },
  { value: 'sentinel', label: 'Sentinel' },
  { value: 'brute', label: 'Brute' },
  { value: 'corruptor', label: 'Corruptor' },
  { value: 'dominator', label: 'Dominator' },
  { value: 'mastermind', label: 'Mastermind' },
  { value: 'stalker', label: 'Stalker' },
  { value: 'peacebringer', label: 'Peacebringer' },
  { value: 'warshade', label: 'Warshade' },
  { value: 'arachnos-soldier', label: 'Arachnos Soldier' },
  { value: 'arachnos-widow', label: 'Arachnos Widow' },
];

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
  const resetForNewBuild = useUIStore((s) => s.resetForNewBuild);
  const openExportImportModal = useUIStore((s) => s.openExportImportModal);
  const selectedBranch = useUIStore((s) => s.selectedBranch);
  const setSelectedBranch = useUIStore((s) => s.setSelectedBranch);
  const includeProcDamageInDPS = useUIStore((s) => s.includeProcDamageInDPS);
  const toggleIncludeProcDamageInDPS = useUIStore((s) => s.toggleIncludeProcDamageInDPS);
  const showDamagePerActivation = useUIStore((s) => s.showDamagePerActivation);
  const toggleShowDamagePerActivation = useUIStore((s) => s.toggleShowDamagePerActivation);

  const navigate = useNavigate();
  const location = useLocation();
  const isOnBuildsPage = location.pathname.startsWith('/builds');
  const [confirmAction, setConfirmAction] = useState<'new' | 'clear' | null>(null);

  const archetypeId = build.archetype.id;
  const archetype = archetypeId ? ARCHETYPES[archetypeId] : null;
  const hasBranches = archetype?.branches && Object.keys(archetype.branches).length > 0;

  const allPowersets = archetypeId ? getPowersetsForArchetype(archetypeId) : [];
  const isEpicAT = ['peacebringer', 'warshade', 'arachnos-soldier', 'arachnos-widow'].includes(archetypeId || '');

  let primaryPowersets: Powerset[];
  let secondaryPowersets: Powerset[];

  if (isEpicAT && archetype) {
    primaryPowersets = archetype.primarySets
      .map(id => getPowerset(id))
      .filter((ps): ps is Powerset => ps !== undefined);
    secondaryPowersets = archetype.secondarySets
      .map(id => getPowerset(id))
      .filter((ps): ps is Powerset => ps !== undefined);
  } else {
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
      if (value === 'peacebringer') { setPrimary('peacebringer/luminous-blast'); setSecondary('peacebringer/luminous-aura'); }
      else if (value === 'warshade') { setPrimary('warshade/umbral-blast'); setSecondary('warshade/umbral-aura'); }
      else if (value === 'arachnos-soldier') { setPrimary('arachnos-soldier/arachnos-soldier'); setSecondary('arachnos-soldier/training-and-gadgets'); }
      else if (value === 'arachnos-widow') { setPrimary('arachnos-widow/widow-training'); setSecondary('arachnos-widow/teamwork'); }
    }
  };

  // Check if AT has mechanics to show second row
  const hasATMechanics = archetypeId && [
    'dominator', 'corruptor', 'brute', 'mastermind', 'defender',
    'scrapper', 'stalker', 'controller', 'sentinel',
  ].includes(archetypeId);

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-2 space-y-2">
      {/* Row 1: Build identity + actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Build name */}
        <input
          type="text"
          id="build-name"
          name="build-name"
          value={build.name}
          onChange={(e) => setBuildName(e.target.value)}
          placeholder="Build Name"
          className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 sm:w-40 min-w-[100px]"
        />

        {/* Server/Dataset selector (hidden on small screens - only one active option) */}
        <div className="hidden sm:block">
          <Tooltip content="Select your server dataset. Rebirth and Thunderspy support is planned for a future update.">
            <Select
              id="server-select"
              name="server"
              options={SERVER_OPTIONS}
              value="homecoming"
              className="max-w-[180px] min-w-[120px]"
            />
          </Tooltip>
        </div>

        {/* Archetype selector */}
        <Select
          id="archetype-select"
          name="archetype"
          options={ARCHETYPE_OPTIONS}
          value={archetypeId || ''}
          onChange={handleArchetypeChange}
          className="max-w-[200px] min-w-[110px]"
          highlight={!archetypeId}
        />

        {/* Primary & Secondary (grouped to prevent flex split on desktop) */}
        <div className="flex items-center gap-2 shrink-0 sm:shrink-0 max-sm:shrink">
          <Select
            id="primary-select"
            name="primary"
            options={archetypeId ? primaryOptions : [{ value: '', label: 'Select Primary...' }]}
            value={build.primary.id || ''}
            onChange={(e) => setPrimary(e.target.value)}
            className="max-w-[200px] min-w-[110px]"
            disabled={!archetypeId}
            highlight={!!archetypeId && !build.primary.id}
          />
          <Select
            id="secondary-select"
            name="secondary"
            options={archetypeId ? secondaryOptions : [{ value: '', label: 'Select Secondary...' }]}
            value={build.secondary.id || ''}
            onChange={(e) => setSecondary(e.target.value)}
            className="max-w-[200px] min-w-[110px]"
            disabled={!archetypeId}
            highlight={!!archetypeId && !build.secondary.id}
          />
        </div>

        {/* Branch selector for Epic ATs */}
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

        {/* Level slider */}
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
            className="hidden sm:block w-24"
            showValue={false}
            showRange={false}
          />
        </div>

        {/* Shared Builds button (always visible) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: isOnBuildsPage ? '/' : '/builds' })}
          title={isOnBuildsPage ? 'Return to the build planner' : 'Browse shared builds from the community'}
          style={{ background: '#4f46e5', borderColor: '#6366f1' }}
          className="text-white hover:!bg-indigo-700"
        >
          <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="hidden sm:inline">{isOnBuildsPage ? 'Back to Planner' : 'Shared Builds'}</span>
        </Button>

        {/* Action menu */}
        <ActionMenu
          onOpenModal={openExportImportModal}
          onNew={() => setConfirmAction('new')}
          onClear={() => setConfirmAction('clear')}
        />

        {/* Settings popover (Target, Slot Levels, Exemplar, UI Scale, Origin, Server) */}
        <SettingsPopover />

        {/* Proc DPS toggle */}
        <div className="hidden sm:flex items-center bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
          <Toggle
            id="proc-dps-toggle"
            name="procDPS"
            checked={includeProcDamageInDPS}
            onChange={toggleIncludeProcDamageInDPS}
            label="Proc DPS"
            className="!gap-2"
          />
        </div>

        {/* Avg Dmg toggle */}
        <div className="hidden sm:flex items-center bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
          <Toggle
            id="avg-dmg-toggle"
            name="avgDmg"
            checked={showDamagePerActivation}
            onChange={toggleShowDamagePerActivation}
            label="Avg Dmg"
            className="!gap-2"
          />
        </div>

        {/* Discord auth (hidden on very small screens, accessible via Settings page) */}
        {supabase && <div className="hidden sm:block"><DiscordAuthButton /></div>}

        {/* Version */}
        <span className="hidden md:inline text-xs text-slate-500 ml-auto whitespace-nowrap">
          v{APP_VERSION} — {LAST_UPDATED}
        </span>
      </div>

      {/* Row 2: AT-specific mechanics (conditional) */}
      {hasATMechanics && (
        <div className="flex items-center gap-2 flex-wrap">
          <ATMechanics archetypeId={archetypeId!} />
        </div>
      )}

      {/* Confirmation modals */}
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

// ---- Action Menu (hamburger) ----

function ActionMenu({
  onOpenModal,
  onNew,
  onClear,
}: {
  onOpenModal: (tab?: 'save-load' | 'import' | 'share') => void;
  onNew: () => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700/50 rounded transition-colors"
        title="Build actions"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">Actions</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-1 min-w-[180px] z-50">
          <button onClick={() => { onOpenModal('save-load'); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Save / Export
          </button>
          <button onClick={() => { onOpenModal('import'); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Load / Import
          </button>
          <button onClick={() => { onOpenModal('share'); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share Build
          </button>
          <hr className="border-gray-700 my-1" />
          <button onClick={() => { onNew(); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Build
          </button>
          <button onClick={() => { onClear(); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Clear Powers
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Settings Popover (gear icon) ----

function SettingsPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const build = useBuildStore((s) => s.build);
  const setOrigin = useBuildStore((s) => s.setOrigin);
  const targetLevelOffset = useUIStore((s) => s.targetLevelOffset);
  const setTargetLevelOffset = useUIStore((s) => s.setTargetLevelOffset);
  const showSlotLevels = useUIStore((s) => s.showSlotLevels);
  const toggleShowSlotLevels = useUIStore((s) => s.toggleShowSlotLevels);
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const toggleExemplarMode = useUIStore((s) => s.toggleExemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);
  const setExemplarLevel = useUIStore((s) => s.setExemplarLevel);
  const uiScale = useUIStore((s) => s.uiScale);
  const setUIScale = useUIStore((s) => s.setUIScale);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2 py-1.5 text-xs hover:text-white border rounded transition-colors ${
          exemplarMode
            ? 'text-amber-400 bg-amber-900/40 hover:bg-amber-800/50 border-amber-600/50'
            : 'text-sky-300 bg-sky-900/30 hover:bg-sky-800/40 border-sky-700/50'
        }`}
        title="Build settings"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="hidden sm:inline">Settings</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 min-w-[280px] z-50 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Build Settings</h3>

          {/* UI Scale */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">UI Scale</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setUIScale(uiScale - 0.05)}
                disabled={uiScale <= 0.85}
                className="text-slate-400 hover:text-sky-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-1"
              >
                &minus;
              </button>
              <span className="text-sm font-bold text-sky-400 w-10 text-center">{Math.round(uiScale * 100)}%</span>
              <button
                onClick={() => setUIScale(uiScale + 0.05)}
                disabled={uiScale >= 1.3}
                className="text-slate-400 hover:text-sky-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-1"
              >
                +
              </button>
            </div>
          </div>

          {/* Origin */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Origin</label>
            <Select
              id="origin-select"
              name="origin"
              options={ORIGIN_OPTIONS}
              value={build.settings.origin}
              onChange={(e) => setOrigin(e.target.value as Origin)}
              className="w-full"
            />
          </div>

          <hr className="border-gray-700" />

          {/* Target Level Offset */}
          <div className="space-y-1">
            <Tooltip content="Set target enemy level relative to yours. Affects Hit Chance in the stats dashboard.">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Target Level</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTargetLevelOffset(targetLevelOffset - 1)}
                    disabled={targetLevelOffset <= -5}
                    className="text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-1"
                  >
                    &minus;
                  </button>
                  <span className="text-sm font-bold text-cyan-400 w-8 text-center">
                    {targetLevelOffset >= 0 ? `+${targetLevelOffset}` : `${targetLevelOffset}`}
                  </span>
                  <button
                    onClick={() => setTargetLevelOffset(targetLevelOffset + 1)}
                    disabled={targetLevelOffset >= 5}
                    className="text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-1"
                  >
                    +
                  </button>
                </div>
              </div>
            </Tooltip>
          </div>

          {/* Toggles row */}
          <div className="flex items-center justify-between">
            <Tooltip content="Show/hide slot level labels on enhancement slots">
              <Toggle
                id="slot-levels-toggle"
                name="showSlotLevels"
                checked={showSlotLevels}
                onChange={toggleShowSlotLevels}
                label="Slot Levels"
              />
            </Tooltip>
          </div>

          {/* Exemplar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Tooltip content="When enabled, set bonuses are suppressed based on exemplar level">
                <Toggle
                  id="exemplar-mode-toggle"
                  name="exemplarMode"
                  checked={exemplarMode}
                  onChange={toggleExemplarMode}
                  label="Exemplar Mode"
                />
              </Tooltip>
            </div>
            {exemplarMode && (
              <div className="flex items-center gap-1 pl-1">
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
                  className="w-28"
                  showValue={false}
                  showRange={false}
                />
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

// ---- AT Mechanics Row ----

function ATMechanics({ archetypeId }: { archetypeId: string }) {
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

  const build = useBuildStore((s) => s.build);

  return (
    <>
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">AT Mechanics</span>

      {/* Domination - Dominators */}
      {archetypeId === 'dominator' && (
        <Tooltip content="Toggle Domination active state to see enhanced mez values (2x magnitude, 1.5x duration)">
          <div className={`flex items-center px-2 py-1 rounded border ${
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

      {/* Scourge - Corruptors */}
      {archetypeId === 'corruptor' && (
        <Tooltip content="Toggle to show average Scourge damage bonus (+30% as multiplier). Scourge chance increases as enemy HP drops below 50%.">
          <div className={`flex items-center px-2 py-1 rounded border ${
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

      {/* Fury - Brutes */}
      {archetypeId === 'brute' && (
        <Tooltip content={`Fury grants +${furyLevel * 2}% damage. Adjust to see damage at different fury levels.`}>
          <div className={`flex items-center gap-1 px-2 py-1 rounded border ${
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

      {/* Supremacy - Masterminds */}
      {archetypeId === 'mastermind' && (
        <Tooltip content="Toggle to show Supremacy buffs (+25% Damage, +10% ToHit) for henchmen within 60ft. Also enables Bodyguard Mode info.">
          <div className={`flex items-center px-2 py-1 rounded border ${
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

      {/* Vigilance - Defenders */}
      {archetypeId === 'defender' && (() => {
        const damageBonus = calculateVigilanceDamageBonus(build.level, vigilanceTeamSize);
        const teamLabel = vigilanceTeamSize === 0 ? 'Solo' : `+${vigilanceTeamSize}`;
        return (
          <Tooltip content={`Vigilance grants +${(damageBonus * 100).toFixed(0)}% damage based on team size. Solo = max bonus, 3+ teammates = no bonus.`}>
            <div className={`flex items-center gap-1 px-2 py-1 rounded border ${
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

      {/* Critical Hits - Scrappers */}
      {archetypeId === 'scrapper' && (
        <Tooltip content="Toggle to show average Critical Hit damage bonus. 5% crit chance vs minions (+5% avg), 10% vs higher ranks (+10% avg). Critical hits deal double damage.">
          <div className={`flex items-center px-2 py-1 rounded border ${
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

      {/* Stalker controls */}
      {archetypeId === 'stalker' && (() => {
        const damageBonus = calculateAssassinationDamageBonus(stalkerHidden, stalkerTeamSize);
        const teamLabel = stalkerTeamSize === 0 ? 'Solo' : `+${stalkerTeamSize}`;
        return (
          <>
            <Tooltip content={stalkerHidden
              ? "Attacking from Hide: 100% critical chance (double damage)"
              : "Not Hidden: 10% base crit + 3% per teammate. Toggle to see damage from Hide."
            }>
              <div className={`flex items-center px-2 py-1 rounded border ${
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
            {!stalkerHidden && (
              <Tooltip content={`Assassination grants +${(damageBonus * 100).toFixed(0)}% avg damage. 10% base crit + 3% per teammate outside of hide.`}>
                <div className="flex items-center gap-1 px-2 py-1 rounded border bg-sk-magenta/10 border-sk-magenta/30">
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
            <Tooltip content={`Toggle to show average Assassination critical damage bonus (+${(damageBonus * 100).toFixed(0)}% avg).`}>
              <div className={`flex items-center px-2 py-1 rounded border ${
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

      {/* Containment - Controllers */}
      {archetypeId === 'controller' && (
        <Tooltip content="Toggle to show Containment damage bonus. Controllers deal double damage to Held, Immobilized, Slept, or Disoriented targets.">
          <div className={`flex items-center px-2 py-1 rounded border ${
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

      {/* Sentinel Opportunity Crit */}
      {archetypeId === 'sentinel' && (
        <Tooltip content={`Toggle to show Opportunity critical damage bonus (+${(OPPORTUNITY_CRIT_MULTIPLIER * 100).toFixed(0)}%). Crits deal ${(OPPORTUNITY_CRIT_MULTIPLIER * 100).toFixed(0)}% bonus damage.`}>
          <div className={`flex items-center px-2 py-1 rounded border ${
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
    </>
  );
}

// ---- Discord Auth Button ----

function DiscordAuthButton() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
              Optionally sign in with Discord to manage your shared builds across devices and browsers. Sidekick does 
            </p>
            <p className="px-3 pb-1.5 text-[10px] text-gray-500">
              THIS IS COMPLETELY OPTIONAL - anonymous sharing still works without a Discord account.
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

function DiscordIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
    </svg>
  );
}
