/**
 * MobileBottomNav — mobile-only fixed bottom navigation.
 *
 * Five tabs:
 *   - Home: dismisses any open sheet/modal, returns to the planner view
 *   - Dashboard: stats dashboard in a sheet (hidden from its normal slot on mobile)
 *   - Incarnate: opens the existing incarnate modal
 *   - Menu: file actions (new/clear/export/import/about/login)
 *   - Settings: build settings (level, origin, exemplar, toggles)
 *
 * Home is active when no sheet/modal is open, so users always have an
 * unambiguous "back to the planner" tap target (tab-style toggling isn't
 * obvious to everyone).
 *
 * Rendered below `lg` breakpoint (≤1024px). On desktop the equivalent
 * controls already live in the header.
 */

import { useEffect, type ReactNode } from 'react';
import { useUIStore, useBuildStore, useAuthStore } from '@/stores';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { StatsDashboard } from './StatsDashboard';
import { Toggle, Slider } from '@/components/ui';
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
          <MobileMenuContent onDone={closeMobileSheet} />
        </MobileSheet>
      )}
      {mobileSheet === 'settings' && (
        <MobileSheet title="Settings" onClose={closeMobileSheet}>
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
          label="Menu"
          icon={IconMenu}
          active={mobileSheet === 'menu'}
          onClick={() => switchSheet('menu')}
        />
        <NavButton
          label="Settings"
          icon={IconSettings}
          active={mobileSheet === 'settings'}
          onClick={() => switchSheet('settings')}
        />
      </nav>
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
          ? 'text-sky-400 bg-slate-800'
          : 'text-slate-400 hover:text-slate-200 active:bg-slate-800'
      }`}
    >
      {active && (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-b bg-sky-400"
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

function MobileMenuContent({ onDone }: { onDone: () => void }) {
  const openExportImportModal = useUIStore((s) => s.openExportImportModal);
  const openAboutModal = useUIStore((s) => s.openAboutModal);
  const openHelpModal = useUIStore((s) => s.openHelpModal);
  const openChangelogModal = useUIStore((s) => s.openChangelogModal);
  const openFeedbackModal = useUIStore((s) => s.openFeedbackModal);
  const openControlsModal = useUIStore((s) => s.openControlsModal);
  const resetBuild = useBuildStore((s) => s.resetBuild);
  const clearPowers = useBuildStore((s) => s.clearPowers);
  const resetForNewBuild = useUIStore((s) => s.resetForNewBuild);

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

  const handleNew = () => {
    if (confirm('Start a new build? Unsaved changes will be lost.')) {
      resetBuild();
      resetForNewBuild();
    }
  };
  const handleClear = () => {
    if (confirm('Clear all powers and slots?')) clearPowers();
  };
  const handleBuyMeCoffee = () => {
    // Trigger the hidden BMC widget button (injected by the script in index.html)
    const bmcBtn = document.getElementById('bmc-wbtn');
    if (bmcBtn) {
      bmcBtn.style.display = 'block';
      bmcBtn.click();
      bmcBtn.style.display = 'none';
    } else {
      window.open('https://buymeacoffee.com/Wednesdaywoe', '_blank');
    }
  };

  return (
    <div className="divide-y divide-slate-800">
      <Section label="Build">
        {item('Save build', () => openExportImportModal('save'))}
        {item('Load / Import', () => openExportImportModal('load-import'))}
        {item('Share / Export', () => openExportImportModal('share-export'))}
        {item('New build', handleNew)}
        {item('Clear powers', handleClear, true)}
      </Section>
      <Section label="Info">
        {item('Help', openHelpModal)}
        {item('Controls', openControlsModal)}
        {item('Changelog', openChangelogModal)}
        {item('Send feedback', openFeedbackModal)}
        {item('About Sidekick', openAboutModal)}
        {item('☕Buy me a coffee', handleBuyMeCoffee)}
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
          <span className="text-base font-bold text-emerald-400 w-8 text-center">{build.level}</span>
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
            disabled={targetLevelOffset <= -5}
            className="w-8 h-8 rounded bg-slate-800 text-slate-300 disabled:opacity-30 font-bold"
          >−</button>
          <span className="text-base font-bold text-cyan-400 w-10 text-center">
            {targetLevelOffset >= 0 ? `+${targetLevelOffset}` : targetLevelOffset}
          </span>
          <button
            onClick={() => setTargetLevelOffset(targetLevelOffset + 1)}
            disabled={targetLevelOffset >= 5}
            className="w-8 h-8 rounded bg-slate-800 text-slate-300 disabled:opacity-30 font-bold"
          >+</button>
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
