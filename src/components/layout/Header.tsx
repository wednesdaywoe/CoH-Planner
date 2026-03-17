/**
 * Header component - two-row layout
 * Row 1: Build identity (name, AT, powersets, level), Shared Builds, action menu, settings popover, auth
 * Row 2 (conditional): AT-specific mechanic toggles/sliders
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useBuildStore, useUIStore, useAuthStore } from '@/stores';
import { useHistoryStore } from '@/stores/historyStore';
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
  const resetBuild = useBuildStore((s) => s.resetBuild);
  const clearPowers = useBuildStore((s) => s.clearPowers);
  const resetForNewBuild = useUIStore((s) => s.resetForNewBuild);
  const openExportImportModal = useUIStore((s) => s.openExportImportModal);
  const includeProcDamageInDPS = useUIStore((s) => s.includeProcDamageInDPS);
  const toggleIncludeProcDamageInDPS = useUIStore((s) => s.toggleIncludeProcDamageInDPS);
  const showDamagePerActivation = useUIStore((s) => s.showDamagePerActivation);
  const toggleShowDamagePerActivation = useUIStore((s) => s.toggleShowDamagePerActivation);
  const combatMode = useUIStore((s) => s.combatMode);
  const toggleCombatMode = useUIStore((s) => s.toggleCombatMode);
  const openProcSettingsModal = useUIStore((s) => s.openProcSettingsModal);
  const openAboutModal = useUIStore((s) => s.openAboutModal);

  const navigate = useNavigate();
  const location = useLocation();
  const isOnBuildsPage = location.pathname.startsWith('/builds');
  const [confirmAction, setConfirmAction] = useState<'new' | 'clear' | null>(null);

  const archetypeId = build.archetype.id;

  const canUndo = useHistoryStore((s) => s.past.length > 0);
  const canRedo = useHistoryStore((s) => s.future.length > 0);

  const handleUndo = () => {
    const history = useHistoryStore.getState();
    const currentBuild = useBuildStore.getState().build;
    history.setRestoring(true);
    const restored = history.undo(currentBuild);
    if (restored) useBuildStore.getState()._restoreBuild(restored);
    history.setRestoring(false);
  };

  const handleRedo = () => {
    const history = useHistoryStore.getState();
    const currentBuild = useBuildStore.getState().build;
    history.setRestoring(true);
    const restored = history.redo(currentBuild);
    if (restored) useBuildStore.getState()._restoreBuild(restored);
    history.setRestoring(false);
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-2 space-y-2">
      {/* Row 1: three fixed items — never wraps */}
      <div className="flex items-center gap-2">
        <ActionMenu
          onOpenModal={openExportImportModal}
          onNew={() => setConfirmAction('new')}
          onClear={() => setConfirmAction('clear')}
          onAbout={openAboutModal}
        />

        <SettingsPopover />
        <BuildIdentityPopover />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
            </svg>
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: left-anchored Shared Builds + toggles + login/version right-anchored */}
      <div className="flex items-center gap-2 flex-wrap">
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

        <div className="flex items-center bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
          <Toggle id="combat-mode-toggle" name="combatMode" checked={combatMode} onChange={toggleCombatMode} label="In-Combat" className="!gap-2" />
        </div>

        <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
          <Toggle id="procs-toggle" name="procs" checked={includeProcDamageInDPS} onChange={toggleIncludeProcDamageInDPS} label="Procs" className="!gap-2" />
          <button onClick={openProcSettingsModal} className="ml-1 text-slate-400 hover:text-white transition-colors" title="Proc Settings">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
          <Toggle id="avg-dmg-toggle" name="avgDmg" checked={showDamagePerActivation} onChange={toggleShowDamagePerActivation} label="Avg Dmg" className="!gap-2" />
        </div>

        {archetypeId && <ATMechanics archetypeId={archetypeId} />}
      </div>

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

// ---- Build Identity Popover ----

function BuildIdentityPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const build = useBuildStore((s) => s.build);
  const setArchetype = useBuildStore((s) => s.setArchetype);
  const setBuildName = useBuildStore((s) => s.setBuildName);
  const setPrimary = useBuildStore((s) => s.setPrimary);
  const setSecondary = useBuildStore((s) => s.setSecondary);
  const selectedBranch = useUIStore((s) => s.selectedBranch);
  const setSelectedBranch = useUIStore((s) => s.setSelectedBranch);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const archetypeId = build.archetype.id;
  const archetype = archetypeId ? ARCHETYPES[archetypeId] : null;
  const hasBranches = archetype?.branches && Object.keys(archetype.branches).length > 0;
  const isEpicAT = ['peacebringer', 'warshade', 'arachnos-soldier', 'arachnos-widow'].includes(archetypeId || '');

  const allPowersets = archetypeId ? getPowersetsForArchetype(archetypeId) : [];
  let primaryPowersets: Powerset[];
  let secondaryPowersets: Powerset[];
  if (isEpicAT && archetype) {
    primaryPowersets = archetype.primarySets.map(id => getPowerset(id)).filter((ps): ps is Powerset => ps !== undefined);
    secondaryPowersets = archetype.secondarySets.map(id => getPowerset(id)).filter((ps): ps is Powerset => ps !== undefined);
  } else {
    primaryPowersets = allPowersets.filter((ps) => isPrimaryPowerset(ps));
    secondaryPowersets = allPowersets.filter((ps) => !isPrimaryPowerset(ps));
  }

  const primaryOptions = [
    { value: '', label: 'Select Primary...' },
    ...primaryPowersets.filter((ps) => ps.id).map((ps) => ({ value: ps.id as string, label: ps.name })),
  ];
  const secondaryOptions = [
    { value: '', label: 'Select Secondary...' },
    ...secondaryPowersets.filter((ps) => ps.id).map((ps) => ({ value: ps.id as string, label: ps.name })),
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

  // Build summary label for the button
  const isIncomplete = !archetypeId || !build.primary.id || !build.secondary.id;
  const atLabel = archetype?.name ?? null;
  const primaryLabel = build.primary.name || null;
  const secondaryLabel = build.secondary.name || null;
  const buildName = build.name?.trim() || null;
  const summaryLabel = atLabel
    ? [buildName, atLabel, primaryLabel, secondaryLabel].filter(Boolean).join(' · ')
    : 'Select Build Identity...';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2 py-1.5 text-xs border rounded transition-colors ${
          isIncomplete
            ? 'text-amber-300 bg-amber-900/40 hover:bg-amber-800/50 border-amber-600/50'
            : 'text-slate-200 bg-slate-700/50 hover:bg-slate-600/60 border-slate-600'
        }`}
        title="Set archetype and powersets"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline max-w-[320px] truncate">{summaryLabel}</span>
        <svg className="w-3 h-3 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 min-w-[260px] z-50 space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Build Identity</h3>

          {/* Build Name */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400" htmlFor="build-name-popover">Build Name</label>
            <input
              id="build-name-popover"
              type="text"
              value={build.name}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="Build Name"
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Server */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Server</label>
            <Tooltip content="Select your server dataset. Rebirth and Thunderspy support is planned for a future update.">
              <Select
                id="server-select"
                name="server"
                options={SERVER_OPTIONS}
                value="homecoming"
                className="w-full"
              />
            </Tooltip>
          </div>

          {/* Archetype */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Archetype</label>
            <Select
              id="archetype-select"
              name="archetype"
              options={ARCHETYPE_OPTIONS}
              value={archetypeId || ''}
              onChange={handleArchetypeChange}
              className="w-full"
              highlight={!archetypeId}
            />
          </div>

          {/* Primary */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Primary</label>
            <Select
              id="primary-select"
              name="primary"
              options={archetypeId ? primaryOptions : [{ value: '', label: 'Select Primary...' }]}
              value={build.primary.id || ''}
              onChange={(e) => setPrimary(e.target.value)}
              className="w-full"
              disabled={!archetypeId}
              highlight={!!archetypeId && !build.primary.id}
            />
          </div>

          {/* Secondary */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Secondary</label>
            <Select
              id="secondary-select"
              name="secondary"
              options={archetypeId ? secondaryOptions : [{ value: '', label: 'Select Secondary...' }]}
              value={build.secondary.id || ''}
              onChange={(e) => setSecondary(e.target.value)}
              className="w-full"
              disabled={!archetypeId}
              highlight={!!archetypeId && !build.secondary.id}
            />
          </div>

          {/* Branch (Epic ATs only) */}
          {hasBranches && archetype?.branches && (
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Branch</label>
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
                  className="w-full"
                />
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Action Menu (hamburger) ----

function ActionMenu({
  onOpenModal,
  onNew,
  onClear,
  onAbout,
}: {
  onOpenModal: (tab?: 'save-load' | 'import' | 'share') => void;
  onNew: () => void;
  onClear: () => void;
  onAbout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Account';
  const avatarUrl = user?.user_metadata?.avatar_url;

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
        <span className="hidden sm:inline">File</span>
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
          {supabase && !loading && (
            <>
              <hr className="border-gray-700 my-1" />
              {user ? (
                <>
                  <div className="px-3 py-1.5 flex items-center gap-2">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-4 h-4 rounded-full shrink-0" />
                    ) : (
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    )}
                    <span className="text-xs text-gray-400 truncate max-w-[120px]">{displayName}</span>
                  </div>
                  <button onClick={() => { navigate({ to: '/builds' }); setOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    My Builds
                  </button>
                  <button onClick={() => { navigate({ to: '/settings' }); setOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Account
                  </button>
                  <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Log Out
                  </button>
                </>
              ) : (
                <button onClick={() => { login('discord'); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Log In
                </button>
              )}
            </>
          )}
          <hr className="border-gray-700 my-1" />
          <button onClick={() => { onAbout(); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
            <img src="img/favicon-32x32.png" alt="" className="w-4 h-4" />
            About Sidekick
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
  const setLevel = useBuildStore((s) => s.setLevel);
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
  const useArcanaTime = useUIStore((s) => s.useArcanaTime);
  const toggleUseArcanaTime = useUIStore((s) => s.toggleUseArcanaTime);

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
        <div className="absolute left-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 min-w-[280px] z-50 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Build Settings</h3>

          {/* Level */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Level</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLevel(build.level - 1)}
                disabled={build.level <= 1}
                className="text-slate-400 hover:text-emerald-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-1"
              >
                &minus;
              </button>
              <span className="text-sm font-bold text-emerald-400 w-6 text-center">{build.level}</span>
              <button
                onClick={() => setLevel(build.level + 1)}
                disabled={build.level >= MAX_LEVEL}
                className="text-slate-400 hover:text-emerald-400 disabled:text-slate-600 disabled:cursor-not-allowed text-xs font-bold px-1"
              >
                +
              </button>
              <Slider
                value={build.level}
                min={1}
                max={MAX_LEVEL}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-32"
                showValue={false}
                showRange={false}
              />
            </div>
          </div>

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

          {/* Toggles */}
          <div className="space-y-2">
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
            <div className="flex items-center justify-between">
              <Tooltip content="Adjust cast times to account for the server's tick-based animation system (more accurate DPS)">
                <Toggle
                  id="arcanatime-toggle"
                  name="arcanaTime"
                  checked={useArcanaTime}
                  onChange={toggleUseArcanaTime}
                  label="ArcanaTime"
                />
              </Tooltip>
            </div>
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

          <hr className="border-gray-700" />
          <p className="text-[10px] text-gray-600 text-center">v{APP_VERSION} — {LAST_UPDATED}</p>

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
