/**
 * MobileBottomNav — mobile-only fixed bottom navigation.
 *
 * Five tabs:
 *   - Home: dismisses any open sheet/modal, returns to the planner view
 *   - Dashboard: stats dashboard in a sheet (hidden from its normal slot on mobile)
 *   - Incarnate: opens the existing incarnate modal
 *   - Menu: file actions (new/clear/export/import/about/login)
 *   - Options: build options (level, origin, exemplar, toggles)
 *
 * Home is active when no sheet/modal is open, so users always have an
 * unambiguous "back to the planner" tap target (tab-style toggling isn't
 * obvious to everyone).
 *
 * Rendered below `lg` breakpoint (≤1024px). On desktop the equivalent
 * controls already live in the header.
 */

import { useEffect, useState, type ReactNode } from 'react';
import { useUIStore, useBuildStore, useAuthStore } from '@/stores';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { StatsDashboard } from './StatsDashboard';
import { Toggle, Slider } from '@/components/ui';
import { ConfirmModal } from '@/components/modals';
import { MAX_LEVEL } from '@/data';
import type { Origin } from '@/types';
import { supabase } from '@/lib/supabase';
import { useNavigate } from '@tanstack/react-router';

// Nav bar visual height (not counting safe-area). Sheets reserve this at the
// bottom so the bar stays visible and tappable while a sheet is open.
const NAV_HEIGHT_PX = 56;
const NAV_RESERVE_CSS = `calc(${NAV_HEIGHT_PX}px + env(safe-area-inset-bottom))`;

const ORIGIN_OPTIONS: { value: Origin; label: string }[] = [
  { value: 'Magic', label: 'Magic' },
  { value: 'Mutation', label: 'Mutation' },
  { value: 'Natural', label: 'Natural' },
  { value: 'Science', label: 'Science' },
  { value: 'Technology', label: 'Technology' },
];

export function MobileBottomNav() {
  const mobileSheet = useUIStore((s) => s.mobileSheet);
  const openMobileSheet = useUIStore((s) => s.openMobileSheet);
  const closeMobileSheet = useUIStore((s) => s.closeMobileSheet);
  const openIncarnateModal = useUIStore((s) => s.openIncarnateModal);
  const closeIncarnateModal = useUIStore((s) => s.closeIncarnateModal);
  const incarnateModalOpen = useUIStore((s) => s.incarnateModalOpen);

  // Confirm dialogs for destructive build actions live at this level so they
  // remain mounted after the menu sheet closes (the sheet unmounts its own
  // children on close, which would tear down any state-driven modal inside it).
  const resetBuild = useBuildStore((s) => s.resetBuild);
  const clearPowers = useBuildStore((s) => s.clearPowers);
  const clearAllEnhancementsGlobal = useBuildStore((s) => s.clearAllEnhancementsGlobal);
  const clearAllExtraSlots = useBuildStore((s) => s.clearAllExtraSlots);
  const resetForNewBuild = useUIStore((s) => s.resetForNewBuild);
  const openEnhancementToolsModal = useUIStore((s) => s.openEnhancementToolsModal);
  const [confirmAction, setConfirmAction] = useState<'new' | 'clear' | 'clear-slots' | 'clear-enhancements' | null>(null);

  const requestNewBuild = () => {
    closeMobileSheet();
    setConfirmAction('new');
  };
  const requestClearPowers = () => {
    closeMobileSheet();
    setConfirmAction('clear');
  };
  const requestClearSlots = () => {
    closeMobileSheet();
    setConfirmAction('clear-slots');
  };
  const requestClearEnhancements = () => {
    closeMobileSheet();
    setConfirmAction('clear-enhancements');
  };
  const requestEnhancementTools = () => {
    closeMobileSheet();
    openEnhancementToolsModal();
  };

  // Picking any non-Incarnate tab should close the Incarnate modal so tab
  // selection behaves like a consistent switcher (and not require the user
  // to manually hit Close/X first).
  const switchSheet = (sheet: 'dashboard' | 'menu' | 'settings') => {
    closeIncarnateModal();
    if (mobileSheet === sheet) {
      closeMobileSheet();
    } else {
      openMobileSheet(sheet);
    }
  };

  // Close sheet on Escape
  useEffect(() => {
    if (!mobileSheet) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileSheet();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobileSheet, closeMobileSheet]);

  return (
    <>
      {/* Sheets */}
      {mobileSheet === 'dashboard' && (
        <MobileSheet title="Dashboard" onClose={closeMobileSheet}>
          <StatsDashboard excludeModals />
        </MobileSheet>
      )}
      {mobileSheet === 'menu' && (
        <MobileSheet title="Menu" onClose={closeMobileSheet}>
          <MobileMenuContent
            onDone={closeMobileSheet}
            onRequestNewBuild={requestNewBuild}
            onRequestClearPowers={requestClearPowers}
            onRequestClearSlots={requestClearSlots}
            onRequestClearEnhancements={requestClearEnhancements}
            onRequestEnhancementTools={requestEnhancementTools}
          />
        </MobileSheet>
      )}
      {mobileSheet === 'settings' && (
        <MobileSheet title="Build Options" onClose={closeMobileSheet}>
          <MobileSettingsContent />
        </MobileSheet>
      )}

      {/* Fixed bottom nav — stays visible above any open sheet so you can switch tabs */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 flex items-stretch"
        style={{ height: NAV_RESERVE_CSS, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <NavButton
          label="Home"
          icon={IconHome}
          active={mobileSheet === null && !incarnateModalOpen}
          onClick={() => { closeMobileSheet(); closeIncarnateModal(); }}
        />
        <NavButton
          label="Dashboard"
          icon={IconDashboard}
          active={mobileSheet === 'dashboard'}
          onClick={() => switchSheet('dashboard')}
        />
        <NavButton
          label="Incarnate"
          icon={IconIncarnate}
          active={incarnateModalOpen}
          onClick={() => {
            closeMobileSheet();
            if (incarnateModalOpen) closeIncarnateModal(); else openIncarnateModal();
          }}
        />
        <NavButton
          label="Options"
          icon={IconSettings}
          active={mobileSheet === 'settings'}
          onClick={() => switchSheet('settings')}
        />
        <NavButton
          label="Menu"
          icon={IconMenu}
          active={mobileSheet === 'menu'}
          onClick={() => switchSheet('menu')}
        />
      </nav>

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
      <ConfirmModal
        isOpen={confirmAction === 'clear-slots'}
        title="Clear Slots"
        message="Remove every added slot from every power, leaving only the base slot? All slotted enhancements will also be cleared. Powers themselves are kept."
        confirmLabel="Clear Slots"
        onConfirm={() => { clearAllExtraSlots(); setConfirmAction(null); }}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmModal
        isOpen={confirmAction === 'clear-enhancements'}
        title="Clear Enhancements"
        message="Remove every slotted enhancement across the build? Powers and slot allocations are kept."
        confirmLabel="Clear Enhancements"
        onConfirm={() => { clearAllEnhancementsGlobal(); setConfirmAction(null); }}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}

function NavButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
        active
          ? 'text-[var(--color-link)] bg-slate-800'
          : 'text-slate-400 hover:text-slate-200 active:bg-slate-800'
      }`}
    >
      {active && (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-b bg-[var(--color-selected)]"
          aria-hidden
        />
      )}
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

function MobileSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  // Lock body scroll while sheet is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="lg:hidden fixed top-0 left-0 right-0 z-40 flex flex-col bg-slate-950"
      style={{ bottom: NAV_RESERVE_CSS }}
    >
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3 flex-shrink-0">
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">{title}</h2>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

// ============================================
// MENU CONTENT
// ============================================

function MobileMenuContent({
  onDone,
  onRequestNewBuild,
  onRequestClearPowers,
  onRequestClearSlots,
  onRequestClearEnhancements,
  onRequestEnhancementTools,
}: {
  onDone: () => void;
  onRequestNewBuild: () => void;
  onRequestClearPowers: () => void;
  onRequestClearSlots: () => void;
  onRequestClearEnhancements: () => void;
  onRequestEnhancementTools: () => void;
}) {
  const openExportImportModal = useUIStore((s) => s.openExportImportModal);
  const openAboutModal = useUIStore((s) => s.openAboutModal);
  const openHelpModal = useUIStore((s) => s.openHelpModal);
  const openWelcomeModal = useUIStore((s) => s.openWelcomeModal);
  const openChangelogModal = useUIStore((s) => s.openChangelogModal);
  const openFeedbackModal = useUIStore((s) => s.openFeedbackModal);
  const openDonateModal = useUIStore((s) => s.openDonateModal);
  const openControlsModal = useUIStore((s) => s.openControlsModal);

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const item = (label: string, onClick: () => void, destructive = false) => (
    <button
      onClick={() => { onClick(); onDone(); }}
      className={`w-full text-left px-4 py-3 text-sm border-b border-slate-800 transition-colors ${
        destructive
          ? 'text-red-400 hover:bg-red-950/30 active:bg-red-950/50'
          : 'text-slate-200 hover:bg-slate-800 active:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );

  // New/Clear items don't call onDone — the parent's request handlers close
  // the sheet themselves (so the ConfirmModal mounted by the parent isn't
  // racing the sheet teardown).
  const itemNoClose = (label: string, onClick: () => void, destructive = false) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 text-sm border-b border-slate-800 transition-colors ${
        destructive
          ? 'text-red-400 hover:bg-red-950/30 active:bg-red-950/50'
          : 'text-slate-200 hover:bg-slate-800 active:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="divide-y divide-slate-800">
      <Section label="Build">
        {item('Save build', () => openExportImportModal('save'))}
        {item('Load / Import', () => openExportImportModal('load-import'))}
        {item('Share / Export', () => openExportImportModal('share-export'))}
        {itemNoClose('New build (full reset)', onRequestNewBuild)}
        {itemNoClose('Clear powers', onRequestClearPowers, true)}
        {itemNoClose('Clear slots', onRequestClearSlots, true)}
        {itemNoClose('Clear enhancements', onRequestClearEnhancements, true)}
        {itemNoClose('Enhancement Tools', onRequestEnhancementTools)}
      </Section>
      <Section label="Info">
        {item('Settings', () => navigate({ to: '/settings' }))}
        {item('Help', openHelpModal)}
        {item('Controls', openControlsModal)}
        <button
          onClick={() => { openWelcomeModal(); onDone(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-slate-800 text-amber-300 font-medium hover:bg-amber-500/10 active:bg-amber-500/20 transition-colors"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>What's New</span>
        </button>
        {item('Changelog', openChangelogModal)}
        {item('Send feedback', openFeedbackModal)}
        <button
          onClick={() => { window.open('https://discord.gg/Tf2nkeqcFy', '_blank', 'noopener,noreferrer'); onDone(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-slate-800 text-slate-100 font-medium hover:bg-[#5865F2]/10 active:bg-[#5865F2]/20 transition-colors"
        >
          <svg className="w-5 h-5 shrink-0" fill="#5865F2" viewBox="0 0 16 16" aria-hidden>
            <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
          </svg>
          <span>Join Sidekick Discord</span>
        </button>
        {item('About Sidekick', openAboutModal)}
        {item('☕ Support Sidekick', openDonateModal)}
      </Section>
      {supabase && !loading && (
        <Section label="Account">
          {user ? (
            <>
              <div className="px-4 py-2 text-xs text-slate-400">
                Signed in as {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
              </div>
              {item('My builds', () => navigate({ to: '/builds' }))}
              {item('Account', () => navigate({ to: '/settings' }))}
              {item('Log out', () => { logout(); onDone(); }, true)}
            </>
          ) : (
            <>
              {item('Log in with Discord', () => { login('discord'); onDone(); })}
              {item('Log in with SimpleLogin', () => { login('custom:simplelogin'); onDone(); })}
            </>
          )}
        </Section>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-900">
        {label}
      </div>
      {children}
    </div>
  );
}

// ============================================
// SETTINGS CONTENT
// ============================================

function MobileSettingsContent() {
  const build = useBuildStore((s) => s.build);
  const setLevel = useBuildStore((s) => s.setLevel);
  const setOrigin = useBuildStore((s) => s.setOrigin);

  const combatMode = useUIStore((s) => s.combatMode);
  const toggleCombatMode = useUIStore((s) => s.toggleCombatMode);
  const includeProcs = useUIStore((s) => s.includeProcDamageInDPS);
  const toggleIncludeProcs = useUIStore((s) => s.toggleIncludeProcDamageInDPS);
  const useArcanaTime = useUIStore((s) => s.useArcanaTime);
  const toggleUseArcanaTime = useUIStore((s) => s.toggleUseArcanaTime);
  const showSlotLevels = useUIStore((s) => s.showSlotLevels);
  const toggleShowSlotLevels = useUIStore((s) => s.toggleShowSlotLevels);
  const targetLevelOffset = useUIStore((s) => s.targetLevelOffset);
  const setTargetLevelOffset = useUIStore((s) => s.setTargetLevelOffset);
  const contentMode = useUIStore((s) => s.contentMode);
  const setContentMode = useUIStore((s) => s.setContentMode);
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const toggleExemplarMode = useUIStore((s) => s.toggleExemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);
  const setExemplarLevel = useUIStore((s) => s.setExemplarLevel);

  const onboardingEnabled = useOnboardingStore((s) => s.enabled);
  const toggleOnboarding = useOnboardingStore((s) => s.toggle);
  const resetOnboarding = useOnboardingStore((s) => s.reset);

  return (
    <div className="p-4 space-y-5">
      <Field label="Level">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLevel(build.level - 1)}
            disabled={build.level <= 1}
            className="w-8 h-8 rounded bg-slate-800 text-slate-300 disabled:opacity-30 font-bold"
          >−</button>
          <span className="text-base font-bold text-[var(--color-link)] w-8 text-center">{build.level}</span>
          <button
            onClick={() => setLevel(build.level + 1)}
            disabled={build.level >= MAX_LEVEL}
            className="w-8 h-8 rounded bg-slate-800 text-slate-300 disabled:opacity-30 font-bold"
          >+</button>
          <Slider
            value={build.level}
            min={1}
            max={MAX_LEVEL}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="flex-1 ml-2"
            showValue={false}
            showRange={false}
          />
        </div>
      </Field>

      <Field label="Origin">
        <select
          value={build.settings.origin}
          onChange={(e) => setOrigin(e.target.value as Origin)}
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
        >
          {ORIGIN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Target Level">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTargetLevelOffset(targetLevelOffset - 1)}
            disabled={targetLevelOffset <= -7}
            className="w-8 h-8 rounded bg-slate-800 text-slate-300 disabled:opacity-30 font-bold"
          >−</button>
          <span className="text-base font-bold text-[var(--color-link)] w-10 text-center">
            {targetLevelOffset >= 0 ? `+${targetLevelOffset}` : targetLevelOffset}
          </span>
          <button
            onClick={() => setTargetLevelOffset(targetLevelOffset + 1)}
            disabled={targetLevelOffset >= 7}
            className="w-8 h-8 rounded bg-slate-800 text-slate-300 disabled:opacity-30 font-bold"
          >+</button>
        </div>
      </Field>

      <Field label="Content">
        <div className="flex items-center gap-0.5 bg-slate-800 rounded p-0.5">
          <button
            onClick={() => setContentMode('standard')}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              contentMode === 'standard' ? 'bg-[var(--color-selected)] text-[var(--color-primary-fg)]' : 'text-slate-400'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setContentMode('incarnate')}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              contentMode === 'incarnate' ? 'bg-[var(--color-selected)] text-[var(--color-primary-fg)]' : 'text-slate-400'
            }`}
          >
            Incarnate
          </button>
        </div>
      </Field>

      <div className="border-t border-slate-800 pt-4 space-y-3">
        <ToggleRow label="In-Combat mode" checked={combatMode} onChange={toggleCombatMode} />
        <ToggleRow label="Include procs in DPS" checked={includeProcs} onChange={toggleIncludeProcs} />
        <ToggleRow label="Use ArcanaTime" checked={useArcanaTime} onChange={toggleUseArcanaTime} />
        <ToggleRow label="Show slot levels" checked={showSlotLevels} onChange={toggleShowSlotLevels} />
      </div>

      <div className="border-t border-slate-800 pt-4 space-y-3">
        <ToggleRow label="Exemplar mode" checked={exemplarMode} onChange={toggleExemplarMode} />
        {exemplarMode && (
          <div className="pl-1 flex items-center gap-2">
            <span className="text-xs text-slate-400">Exemplar level</span>
            <button
              onClick={() => setExemplarLevel(exemplarLevel - 1)}
              disabled={exemplarLevel <= 1}
              className="w-7 h-7 rounded bg-slate-800 text-slate-300 disabled:opacity-30 font-bold"
            >−</button>
            <span className="text-sm font-bold text-amber-400 w-6 text-center">{exemplarLevel}</span>
            <button
              onClick={() => setExemplarLevel(exemplarLevel + 1)}
              disabled={exemplarLevel >= 50}
              className="w-7 h-7 rounded bg-slate-800 text-slate-300 disabled:opacity-30 font-bold"
            >+</button>
            <Slider
              value={exemplarLevel}
              min={1}
              max={50}
              onChange={(e) => setExemplarLevel(Number(e.target.value))}
              className="flex-1"
              showValue={false}
              showRange={false}
            />
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 pt-4 space-y-3">
        <ToggleRow label="Onboarding beacons" checked={onboardingEnabled} onChange={toggleOnboarding} />
        <button
          onClick={resetOnboarding}
          className="text-xs text-slate-400 hover:text-slate-200 underline"
        >
          Reset onboarding progress
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-slate-400 font-medium">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-200">{label}</span>
      <Toggle
        id={`mobile-toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
        name={label}
        checked={checked}
        onChange={onChange}
        label=""
      />
    </div>
  );
}

// ============================================
// ICONS
// ============================================

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-10l2 2M5 10v10a1 1 0 001 1h3m10-11l-2-2m2 2v10a1 1 0 01-1 1h-3m-6 0h6" />
    </svg>
  );
}

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M7 15v-4m5 4V8m5 7v-2" />
    </svg>
  );
}

function IconIncarnate({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
    </svg>
  );
}
