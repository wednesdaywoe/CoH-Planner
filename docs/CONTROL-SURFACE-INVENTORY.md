
---

# Appendix: the beta, enumerated

Every menu item, modal and control surface in the beta, as of this census. Counted so the
rebuild's own surfaces can be checked against it: 8 menus, 27 modals, 6 banners, 7 routes.

## Menus

**1. Menu (`ActionMenu`, [Header.tsx:795](../../CoH-Sidekick/src/components/layout/Header.tsx)) — 24 items**

Build: 1 Save build · 2 Load / Import · 3 Copy short link · 4 Copy live link · 5 Share / Export ·
6 Export as Image · 7 New · 8 Clear · 9 Clear slots · 10 Clear enhancements · 11 Enhancement Tools

Account: 12 My builds · 13 Account settings · 14 Profile · 15 Log out · 16 Log in with Discord ·
17 Log in with SimpleLogin

App: 18 App settings · 19 Install app (PWA)

Help: 20 Roadmap · 21 What's New · 22 Changelog · 23 System Atlas · 24 About

Six unrelated jobs in one list, which is the drift this document exists to avoid.

**2. Options (`SettingsPopover`, [Header.tsx:1117](../../CoH-Sidekick/src/components/layout/Header.tsx)) — 14 items**

1 Level · 2 UI Scale · 3 Origin · 4 Target Level · 5 Content · 6 Level Shift · 7 Slot Levels ·
8 Proc Potential · 9 ArcanaTime · 10 Mids Recharge · 11 Exemplar Mode · 12 Exemplar level ·
13 Debug Logging · 14 Guided Hints (+ Reset guided hints)

**3. Layout (`PlannerLayoutMenu`)** — show/hide and reorder for 6 planner columns (Available
Powers, Primary, Secondary, Pool Powers, Power Info, Powers by Level), plus a By Level / By
Powerset view toggle.

**4. Build Identity popover** — archetype and powersets.

**5. Dashboard action buttons (`DashboardActionButtons`, StatsDashboard.tsx) — 11**

1 Accolades · 2 Set Bonuses · 3 Set Totals · 4 Totals · 5 Compare Sets · 6 Chain · 7 Team Buffs ·
8 Compare Slots · 9 Enh List · 10 Configure · 11 Controls

**6. Slot context menu (`SlotContextMenu`) — 8**

1 Add/Change Enhancement · 2 Remove Enhancement · 3 Remove Slot · 4 Move slot… ·
5 Move slot level… · 6 Compare Slotting · 7 Clear All Enhancements · 8 Remove All Extra Slots

**7. Mobile bottom nav (`MobileBottomNav`) — 5 tabs over 3 sheets**

Tabs: Home · Dashboard · Incarnate · Options · Menu. The Menu sheet re-lists the desktop Menu in
three sections (Build 9, Info 11, Account 3-5); Build Options re-lists Options plus Origin.

**8. Footer floating actions (`MainLayout.tsx:124`) — 5**

1 Help · 2 What's New · 3 Send feedback · 4 Join Discord · 5 Support Sidekick

Plus a header toggle row that is a menu in everything but name: In-Combat, Procs (+ a gear to
Proc Settings), Bonus Cap Alert, Shared Builds, login, version.

## Modals — 27

Build I/O: 1 ExportImportModal (save / load-import / share-export) · 2 ForumExportModal (nested
in it) · 3 BuildImageModal · 4 ConfirmModal

Pickers: 5 PoolPickerModal · 6 IncarnateModal · 7 IncarnateCraftingModal · 8 AccoladesModal ·
9 PowerInfoModal

Analysis: 10 DetailedTotalsModal · 11 StatsConfigModal · 12 SetBonusLookupModal ·
13 PowersetCompareModal · 14 AttackChainModal · 15 WhatIfBuffsModal · 16 ProcSettingsModal ·
17 CompareSlottingModal · 18 EnhancementListModal · 19 EnhancementToolsModal

Help/meta: 20 HelpModal · 21 ControlsModal · 22 AboutModal · 23 ChangelogModal ·
24 WelcomeModal · 25 AnnouncementModal (wraps RoadmapPanel) · 26 FeedbackModal · 27 DonateModal

Non-modal overlays beside them: SetBonusPopup, PopOutInfoPanel, EnhancementPicker,
WhatIfChipPanel, DraggableSlotGhost.

## Banners — 6

StatusBanner · UpdateBanner · ExemplarModeBanner · RuleOf5Banner · CalcErrorBanner ·
EngineErrorBanner

## Routes — 7

/ · /builds · /builds/$id · /author/$handle · /settings · /settings/profile · /import

`/settings` is the third settings home: Account, Appearance (themes, also in Options' orbit),
Link Builds, Developer.
