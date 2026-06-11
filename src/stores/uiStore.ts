/**
 * UI Store - manages UI state (modals, settings, tooltips)
 *
 * Uses Zustand for state management.
 * This replaces the legacy global AppState.ui object.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ModalView,
  EnhancementPickerState,
  GenericPickerState,
  OriginPickerState,
  TooltipState,
  TooltipContent,
  InfoPanelState,
  InfoPanelContent,
  StatDisplayConfig,
  EnhancementStatType,
  EnhancementTier,
  IOSetRarity,
  IncarnateSlotId,
  IncarnateActiveState,
  ToggleableIncarnateSlot,
  ArchetypeBranchId,
  Enhancement,
} from '@/types';
import { createDefaultIncarnateActiveState } from '@/types';
import type { SlotLevelRef } from '@/utils/slot-levels';
import type { PowerMetric } from '@/utils/calculations/attack-chain';

// ============================================
// PROC SETTINGS
// ============================================

/** Per-category toggles for proc effects in dashboard stats */
export interface ProcSettings {
  damage: boolean;
  recovery: boolean;
  regeneration: boolean;
  recharge: boolean;
  toHit: boolean;
  defense: boolean;
  resistance: boolean;
  buildUp: boolean;
  movement: boolean;
}

export type ProcSettingsKey = keyof ProcSettings;

const DEFAULT_PROC_SETTINGS: ProcSettings = {
  damage: true,
  recovery: true,
  regeneration: true,
  recharge: true,
  toHit: true,
  defense: true,
  resistance: true,
  buildUp: true,
  movement: true,
};

// ============================================
// DAMAGE DISPLAY MODE
// ============================================

/**
 * Which damage figure the InfoPanel shows for an attack.
 *   damage         — total damage of one activation (single hit / DoT total)
 *   damagePerAnim  — DPA, damage / cast (animation) time; honors ArcanaTime
 *   damagePerSec   — DPS, damage / full cycle time (cast + recharge)
 *   damagePerEnd   — DPE, damage / endurance cost
 */
export type DamageDisplayMode = 'damage' | 'damagePerAnim' | 'damagePerSec' | 'damagePerEnd';

// ============================================
// UI STORE INTERFACE
// ============================================

interface UIState {
  /** Enhancement picker modal state */
  enhancementPicker: EnhancementPickerState;

  /** Generic enhancement picker state */
  genericPicker: GenericPickerState;

  /** Origin enhancement picker state */
  originPicker: OriginPickerState;

  /** Stats config modal open state */
  statsConfigModalOpen: boolean;

  /** When set, the modal scrolls to the category containing this stat ID
   *  on open and briefly highlights it. Cleared after the modal consumes it. */
  statsConfigScrollTo: string | null;

  /** Accolades modal open state */
  accoladesModalOpen: boolean;

  /** About modal open state */
  aboutModalOpen: boolean;

  /** Incarnate modal open state */
  incarnateModalOpen: boolean;

  /** Incarnate crafting modal open state */
  incarnateCraftingModalOpen: boolean;

  /** Currently selected incarnate slot for modal */
  currentIncarnateSlot: IncarnateSlotId | null;

  /** T4 crafting path combo index per power (keyed by powerId) */
  incarnateT4ComboIndex: Record<string, number>;

  /** Export/Import modal open state */
  exportImportModalOpen: boolean;
  /** Which tab the Export/Import modal should open to */
  exportImportModalTab: 'save' | 'load-import' | 'share-export' | null;

  /** Feedback modal open state */
  feedbackModalOpen: boolean;

  /** Changelog modal open state */
  changelogModalOpen: boolean;

  /** Welcome ("What's New") modal open state */
  welcomeModalOpen: boolean;

  /** Enhancement list (shopping list) modal open state */
  enhancementListModalOpen: boolean;

  /** Controls modal open state */
  controlsModalOpen: boolean;

  /** Help modal open state */
  helpModalOpen: boolean;

  /** Detailed Totals modal open state */
  detailedTotalsModalOpen: boolean;

  /** Powerset Compare modal open state */
  powersetCompareModalOpen: boolean;

  /** Set Bonus Lookup modal open state */
  setBonusLookupModalOpen: boolean;

  /** Floating "Set Bonus Totals" popup — a lightweight draggable window that
   *  lists active set-bonus totals with per-source (set + power) drill-down. */
  setBonusPopupOpen: boolean;

  /** Power Info modal open state (mobile only) */
  powerInfoModalOpen: boolean;

  /** Global IO level for calculations */
  globalIOLevel: number;

  /** Attunement toggle */
  attunementEnabled: boolean;

  /** Global enhancement boost level (0-5) */
  globalBoostLevel: number;

  /** IO set sort preference in enhancement picker */
  ioSetSortBy: 'name' | 'level';

  /**
   * Per-power memory of the last enhancement-picker filter the user
   * landed on (typeFilter + sidebarFilter). Keyed by the power's
   * `internalName`. Restored when the picker reopens for the same
   * power so e.g. slotting an ATO once makes the next slot on the
   * same power default to the ATO category.
   */
  lastPickerFilterByPower: Record<string, { typeFilter: string; sidebarFilter: string }>;

  /** Exemplar mode - when ON, respects build level for set bonus suppression */
  exemplarMode: boolean;

  /** Exemplar level - the level to exemplar down to (1-50, default: 50) */
  exemplarLevel: number;

  /** Target enemy level offset for hit chance calculation (-7 to +7, 0 = even level) */
  targetLevelOffset: number;

  /**
   * Content-mode toggle for defense-softcap math. Incarnate trial encounters
   * carry an empirical extra ToHit buff on enemies (~+14%), pushing the
   * softcap from 45 → 59 on even-level enemies. Stored separately from
   * `targetLevelOffset` so the two compose cleanly.
   */
  contentMode: 'standard' | 'incarnate';

  /** Per-category proc settings for dashboard stat calculations */
  procSettings: ProcSettings;

  /** Proc settings modal open state */
  procSettingsModalOpen: boolean;

  /** Enhancement Tools modal open state */
  enhancementToolsModalOpen: boolean;

  /** Attack Chain Builder modal open state */
  attackChainModalOpen: boolean;

  /** Persisted: the user dismissed the Attack Chain Builder announcement
   *  ("don't show again") — keeps it from re-appearing on reload. */
  attackChainAnnounceDismissed: boolean;

  /** Which metric ranks powers in the Attack Chain Builder — drives palette
   *  order, bar/chip color intensity, and compactness weighting. */
  chainPowerMetric: PowerMetric;

  /** Show the buff/debuff "active window" bands on the Attack Chain timeline. */
  chainShowEffectWindows: boolean;

  /** Include proc damage in per-power DPS calculations */
  includeProcDamageInDPS: boolean;

  /** Use ArcanaTime (server-tick-adjusted cast time) for DPS calculations */
  useArcanaTime: boolean;

  /**
   * How the damage figure is displayed in the InfoPanel:
   *   'damage'         — total damage of one activation
   *   'damagePerAnim'  — damage / cast (animation) time, honoring ArcanaTime
   *   'damagePerSec'   — damage / full cycle time (cast + recharge)
   *   'damagePerEnd'   — damage / endurance cost
   */
  damageDisplayMode: DamageDisplayMode;

  /** Combat mode: suppress defense buffs from stealth/travel powers */
  combatMode: boolean;

  /** Pin the Power Info "Proc Chance" detail section to stay expanded
   *  across power selections. Without this, the section's expansion is
   *  a per-selection local state in the InfoPanel that resets every
   *  time the user clicks a different power. */
  procChancePinned: boolean;

  /** Hints/help visibility */
  hintsEnabled: boolean;

  /** Info panel state */
  infoPanel: InfoPanelState;

  /** Stats display configuration */
  statsConfig: StatDisplayConfig[];

  /** Tooltip state */
  tooltip: TooltipState;

  /** Collapse the stats dashboard to a slim summary row (toggled by `D` hotkey) */
  dashboardCollapsed: boolean;

  /** App-wide UI zoom scale (0.85 to 1.3, default 1.0) */
  uiScale: number;

  /** Incarnate active state - which incarnate slots are active for stat calculations */
  incarnateActive: IncarnateActiveState;

  /** Whether incarnate level shifts are applied (independent from per-slot stat toggles) */
  incarnateLevelShiftActive: boolean;

  /** Domination active state - for Dominators to see enhanced mez values */
  dominationActive: boolean;

  /** Scourge active state - for Corruptors to see average Scourge damage bonus */
  scourgeActive: boolean;

  /** Fury level for Brutes (0-100) */
  furyLevel: number;

  /** Supremacy active state - for Masterminds to see henchmen buffs */
  supremacyActive: boolean;

  /** Vigilance team size for Defenders (0 = solo, 1-7 = teammates) */
  vigilanceTeamSize: number;

  /** Critical Hits active state - for Scrappers to see average critical damage bonus */
  criticalHitsActive: boolean;

  /** Stalker Hidden state - whether attacking from Hide */
  stalkerHidden: boolean;

  /** Stalker team size for Assassination bonus (0 = solo, 1-7 = teammates) */
  stalkerTeamSize: number;

  /** Stalker critical hits active state - show average crit damage bonus */
  stalkerCritActive: boolean;

  /** Containment active state - for Controllers to see double damage vs controlled targets */
  containmentActive: boolean;

  /** Sentinel critical hits active state */
  sentinelCritActive: boolean;

  /** Selected branch for Arachnos Epic ATs (Soldier: bane-spider/crab-spider, Widow: night-widow/fortunata) */
  selectedBranch: ArchetypeBranchId | null;

  /** Compare Slotting modal */
  compareSlottingOpen: boolean;
  compareSlottingPower: { powerName: string; powerSet: string } | null;

  /** Power view mode: 'chronological' (Mids-style, default) or 'category' */
  powerViewMode: 'category' | 'chronological';

  /** Contextual hint text shown at the bottom of the planner (driven by mouseenter on slots/ghosts/etc). Null hides the bar. */
  hoverHint: string | null;

  /** When set, the planner is in "pick a destination slot" mode for a
   *  Mids-style slot-level move: the user chose "Move slot level…" on this
   *  slot and the next slot they click becomes the swap target. Null = idle. */
  slotMoveSource: SlotLevelRef | null;

  /** Tracked stats — breakdownKey values for stats the user wants to chase via set bonuses */
  trackedStats: string[];

  /** Per-target slider values keyed by power name (0 = buff inactive, 1+ = targets hit) */
  targetsHitValues: Record<string, number>;

  /**
   * Mechanic Adjuster toggle state for `power.conditionalEffects` with
   * `scope: 'per-power'`. Keyed by `<powerInternalName>:<adjusterId>`.
   * Used for target-state mechanics like drowning or Disintegrating that
   * apply to one cast/target at a time.
   */
  mechanicAdjusters: Record<string, boolean>;

  /**
   * Mechanic Adjuster toggle state for `power.conditionalEffects` with
   * `scope: 'global'`. Keyed by just the `<adjusterId>` — flipping a
   * global toggle on one power flips it on every power that references
   * the same id. Used for caster-state mechanics like Bio Armor's
   * Defensive/Offensive/Rested Adaptation, Hide, Domination, and snipe
   * Quick mode (In Combat).
   */
  globalAdjusters: Record<string, boolean>;

  /** Show slot level labels on enhancement slots */
  showSlotLevels: boolean;

  /** Power names being tracked for "perma" (recharge <= duration) */
  permaTrackedPowers: string[];

  /** Level Up mode: gate powers/slots/enhancements by the character's current level */
  levelUpMode: boolean;

  /** Which mobile nav sheet is open (dashboard/menu/settings). Incarnate uses its own modal. */
  mobileSheet: 'dashboard' | 'menu' | 'settings' | null;

  /** Active toast notifications (newest first). */
  toasts: Toast[];

  /** Whether the "discover the help system" hint toast appears on each load. */
  helpToastEnabled: boolean;

  /** Whether to show the educational banner when a build has any capped
   *  (Rule-of-5-rejected) set bonus. Default on so first-time users learn
   *  what the strikethrough/orange-ring indicators mean. */
  ruleOf5AlertEnabled: boolean;

  /** Display recharge as Mids' speed-multiplier "Haste" (100% base + bonuses,
   *  e.g. +70% Hasten → 170%) when true. When false, show just the bonus
   *  portion (+70%) — matches what the in-game UI displays. Default is
   *  false (game-style); toggle on for Mids parity. */
  rechargeMidsStyle: boolean;
}

export interface ToastAction {
  label: string;
  /** Action handler. Toast is dismissed after this fires unless it returns false. */
  onClick: () => void | false;
}

export interface Toast {
  id: string;
  message: string;
  /** Optional action button shown on the right. */
  action?: ToastAction;
  /** Auto-dismiss after this many ms. 0 = sticky until clicked away. Default 8000. */
  durationMs?: number;
  /** Tone for color/icon. Defaults to 'info'. */
  tone?: 'info' | 'success' | 'warning';
}

interface UIActions {
  // Enhancement Picker Modal
  openEnhancementPicker: (powerName: string, powerSet: string, slotIndex: number, overrideSelect?: (slotIndex: number, enhancement: Enhancement) => void, virtualSlots?: (Enhancement | null)[], powerCategory?: string) => void;
  closeEnhancementPicker: () => void;
  setPickerView: (view: ModalView) => void;
  pushPickerView: (view: ModalView) => void;
  popPickerView: () => void;
  setPickerCategory: (category: IOSetRarity | 'all' | null) => void;
  setSelectedSetId: (setId: string | null) => void;

  // Generic Picker
  setGenericType: (type: EnhancementStatType) => void;

  // Origin Picker
  setOriginType: (type: EnhancementStatType) => void;
  setOriginTier: (tier: EnhancementTier) => void;

  // Settings
  setGlobalIOLevel: (level: number) => void;
  toggleAttunement: () => void;
  setGlobalBoostLevel: (level: number) => void;
  setIOSetSortBy: (sort: 'name' | 'level') => void;
  setLastPickerFilter: (powerName: string, typeFilter: string, sidebarFilter: string) => void;
  toggleExemplarMode: () => void;
  setExemplarLevel: (level: number) => void;
  setTargetLevelOffset: (offset: number) => void;
  setContentMode: (mode: 'standard' | 'incarnate') => void;
  toggleProcCategory: (category: ProcSettingsKey) => void;
  setProcSettings: (settings: ProcSettings) => void;
  openProcSettingsModal: () => void;
  closeProcSettingsModal: () => void;
  openEnhancementToolsModal: () => void;
  closeEnhancementToolsModal: () => void;
  openAttackChainModal: () => void;
  closeAttackChainModal: () => void;
  dismissAttackChainAnnounce: () => void;
  setChainPowerMetric: (metric: PowerMetric) => void;
  setChainShowEffectWindows: (show: boolean) => void;
  toggleIncludeProcDamageInDPS: () => void;
  toggleUseArcanaTime: () => void;
  setDamageDisplayMode: (mode: DamageDisplayMode) => void;
  toggleCombatMode: () => void;
  toggleProcChancePinned: () => void;
  toggleHints: () => void;
  toggleDashboardCollapsed: () => void;
  setUIScale: (scale: number) => void;

  // Info Panel
  setInfoPanelEnabled: (enabled: boolean) => void;
  setInfoPanelContent: (content: InfoPanelContent | null) => void;
  showPowerInfo: (powerName: string, powerSet: string) => void;
  showEnhancementInfo: (enhancementId: string) => void;
  showSetInfo: (setId: string) => void;
  clearInfoPanel: () => void;
  lockInfoPanel: (content: InfoPanelContent) => void;
  unlockInfoPanel: () => void;
  toggleInfoPanelLock: () => void;
  setInfoPanelTooltipEnabled: (enabled: boolean) => void;
  toggleInfoPanelTooltip: () => void;
  undockInfoPanel: () => void;
  dockInfoPanel: () => void;

  // Tooltip
  showTooltip: (content: TooltipContent, x: number, y: number) => void;
  hideTooltip: () => void;
  moveTooltip: (x: number, y: number) => void;

  // Stats Config
  openStatsConfigModal: (scrollToStatId?: string) => void;
  closeStatsConfigModal: () => void;
  /** Called by the modal once it has acted on the scroll-to hint, so the
   *  next open without an explicit hint doesn't replay the old one. */
  clearStatsConfigScrollTo: () => void;
  setStatVisible: (stat: string, visible: boolean) => void;
  reorderStats: (stats: StatDisplayConfig[]) => void;
  resetStatsConfig: () => void;

  // Accolades Modal
  openAccoladesModal: () => void;
  closeAccoladesModal: () => void;

  // About Modal
  openAboutModal: () => void;
  closeAboutModal: () => void;

  // Incarnate Modal
  openIncarnateModal: (slotId?: IncarnateSlotId) => void;
  closeIncarnateModal: () => void;
  setCurrentIncarnateSlot: (slotId: IncarnateSlotId) => void;

  // Incarnate Crafting Modal
  openIncarnateCraftingModal: () => void;
  closeIncarnateCraftingModal: () => void;
  setIncarnateT4ComboIndex: (powerId: string, index: number) => void;

  // Export/Import Modal
  openExportImportModal: (tab?: 'save' | 'load-import' | 'share-export') => void;
  closeExportImportModal: () => void;

  // Feedback Modal
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;

  // Changelog Modal
  openChangelogModal: () => void;
  closeChangelogModal: () => void;

  // Welcome Modal ("What's New")
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
  openEnhancementListModal: () => void;
  closeEnhancementListModal: () => void;

  // Controls Modal
  openControlsModal: () => void;
  closeControlsModal: () => void;

  // Help Modal
  /** Optional topic id to expand + scroll to when the help modal opens.
   *  Cleared on close so subsequent opens start fresh. */
  helpModalInitialTopic: string | null;
  openHelpModal: (initialTopicId?: string) => void;
  closeHelpModal: () => void;

  // Detailed Totals Modal
  openDetailedTotalsModal: () => void;
  closeDetailedTotalsModal: () => void;

  // Powerset Compare Modal
  openPowersetCompareModal: () => void;
  closePowersetCompareModal: () => void;

  // Set Bonus Lookup Modal
  openSetBonusLookupModal: () => void;
  closeSetBonusLookupModal: () => void;

  // Set Bonus Totals popup (floating)
  openSetBonusPopup: () => void;
  closeSetBonusPopup: () => void;

  // Power Info Modal (mobile only)
  openPowerInfoModal: () => void;
  closePowerInfoModal: () => void;

  // Incarnate Active State
  toggleIncarnateActive: (slotId: ToggleableIncarnateSlot) => void;
  setIncarnateActive: (slotId: ToggleableIncarnateSlot, active: boolean) => void;
  resetIncarnateActive: () => void;
  toggleIncarnateLevelShift: () => void;

  // Domination Active State (Dominator inherent)
  toggleDomination: () => void;
  setDominationActive: (active: boolean) => void;

  // Scourge Active State (Corruptor inherent)
  toggleScourge: () => void;
  setScourgeActive: (active: boolean) => void;

  // Fury Level (Brute inherent) - slider 0-100
  setFuryLevel: (level: number) => void;

  // Supremacy Active State (Mastermind inherent)
  toggleSupremacy: () => void;
  setSupremacyActive: (active: boolean) => void;

  // Vigilance Team Size (Defender inherent) - slider 0-7
  setVigilanceTeamSize: (size: number) => void;

  // Critical Hits Active State (Scrapper inherent)
  toggleCriticalHits: () => void;
  setCriticalHitsActive: (active: boolean) => void;

  // Stalker Hidden State (Stalker inherent)
  toggleStalkerHidden: () => void;
  setStalkerHidden: (hidden: boolean) => void;

  // Stalker Team Size (Stalker inherent) - slider 0-7
  setStalkerTeamSize: (size: number) => void;

  // Stalker Crit Active State (Stalker inherent)
  toggleStalkerCrit: () => void;

  // Containment Active State (Controller inherent)
  toggleContainment: () => void;
  setContainmentActive: (active: boolean) => void;

  // Opportunity Level (Sentinel inherent) - slider 0-100

  // Sentinel Critical Hits Active State (Sentinel inherent)
  toggleSentinelCrit: () => void;
  setSentinelCritActive: (active: boolean) => void;

  // Arachnos Branch Selection (Epic ATs)
  setSelectedBranch: (branch: ArchetypeBranchId | null) => void;
  clearSelectedBranch: () => void;

  // Compare Slotting Modal
  openCompareSlotting: (powerName?: string, powerSet?: string) => void;
  closeCompareSlotting: () => void;

  // Power View Mode
  setPowerViewMode: (mode: 'category' | 'chronological') => void;
  togglePowerViewMode: () => void;

  // Hover hint (contextual help text at bottom of planner)
  setHoverHint: (hint: string | null) => void;

  // Slot-level move (Mids-style): arm a source slot, then click a destination
  beginSlotLevelMove: (source: SlotLevelRef) => void;
  cancelSlotLevelMove: () => void;

  // Tracked Stats
  toggleTrackedStat: (breakdownKey: string) => void;
  ensureTrackedStats: (keys: string[]) => void;
  clearTrackedStats: () => void;

  // Per-target slider
  setTargetsHit: (powerName: string, value: number) => void;
  /** Bulk-replace the targets-hit map. Used after a Mids import to copy
   *  the .mbd file's per-power `VariableValue` sliders in one shot so the
   *  dashboard reproduces Mids' totals without per-power toggling. */
  setTargetsHitBulk: (values: Record<string, number>) => void;

  // Mechanic Adjuster toggle (per-power conditional effect)
  setMechanicAdjuster: (powerName: string, adjusterId: string, active: boolean) => void;
  toggleMechanicAdjuster: (powerName: string, adjusterId: string) => void;
  /** Clear all toggles for a single power (e.g. on power deselection). */
  clearMechanicAdjusters: (powerName: string) => void;

  // Global Mechanic Adjusters (caster-state — apply across all powers)
  setGlobalAdjuster: (adjusterId: string, active: boolean) => void;
  toggleGlobalAdjuster: (adjusterId: string) => void;
  /**
   * Activate a single member of a mutually-exclusive group (Bio Armor
   * adaptations, Tidal Power stacks, Combo Levels). Sets the named id to
   * true; sets every other id in `siblingIds` to false in one update.
   * Pass `null` for `activeId` to clear the whole group.
   */
  setGlobalAdjusterGroup: (
    activeId: string | null,
    siblingIds: readonly string[],
  ) => void;

  // Slot level labels
  toggleShowSlotLevels: () => void;

  // Perma tracker
  togglePermaTracked: (powerName: string) => void;

  // Level Up mode
  toggleLevelUpMode: () => void;
  setLevelUpMode: (enabled: boolean) => void;

  // Mobile bottom-nav sheets
  openMobileSheet: (sheet: 'dashboard' | 'menu' | 'settings') => void;
  closeMobileSheet: () => void;

  // Toasts
  showToast: (toast: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  setHelpToastEnabled: (enabled: boolean) => void;
  toggleHelpToastEnabled: () => void;
  setRuleOf5AlertEnabled: (enabled: boolean) => void;
  toggleRuleOf5AlertEnabled: () => void;
  setRechargeMidsStyle: (enabled: boolean) => void;
  toggleRechargeMidsStyle: () => void;

  // Hard reset of build-specific UI state (for New Build)
  resetForNewBuild: () => void;
}

type UIStore = UIState & UIActions;

// ============================================
// DEFAULT STATES
// ============================================

const defaultEnhancementPicker: EnhancementPickerState = {
  isOpen: false,
  currentView: 'category',
  viewStack: [],
  currentPowerName: null,
  currentPowerSet: null,
  currentPowerCategory: null,
  currentSlotIndex: 0,
  currentCategory: null,
  selectedSetId: null,
  onOverrideSelect: null,
  virtualSlots: null,
};

const defaultGenericPicker: GenericPickerState = {
  selectedType: 'Damage',
};

const defaultOriginPicker: OriginPickerState = {
  selectedType: 'Damage',
  selectedTier: 'SO',
};

const defaultTooltip: TooltipState = {
  visible: false,
  content: null,
  position: { x: 0, y: 0 },
};

const defaultInfoPanel: InfoPanelState = {
  enabled: true,
  content: null,
  locked: false,
  lockedContent: null,
  tooltipEnabled: false,
  undocked: false,
};

const defaultStatsConfig: StatDisplayConfig[] = [
  { stat: 'damage', visible: true, order: 0 },
  { stat: 'accuracy', visible: true, order: 1 },
  { stat: 'tohit', visible: true, order: 2 },
  { stat: 'recharge', visible: true, order: 3 },
  { stat: 'health', visible: true, order: 4 },
  { stat: 'regeneration', visible: true, order: 5 },
  { stat: 'recovery', visible: true, order: 6 },
  { stat: 'endcost', visible: true, order: 7 },
  { stat: 'netend', visible: true, order: 8 },
  { stat: 'level_shift', visible: true, order: 9 },
  { stat: 'defense_melee', visible: true, order: 10 },
  { stat: 'defense_ranged', visible: true, order: 11 },
  { stat: 'res_smashing', visible: true, order: 12 },
];

// ============================================
// STORE CREATION
// ============================================

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      enhancementPicker: defaultEnhancementPicker,
      genericPicker: defaultGenericPicker,
      originPicker: defaultOriginPicker,
      statsConfigModalOpen: false,
      statsConfigScrollTo: null,
      accoladesModalOpen: false,
      aboutModalOpen: false,
      incarnateModalOpen: false,
      incarnateCraftingModalOpen: false,
      currentIncarnateSlot: null,
      incarnateT4ComboIndex: {},
      exportImportModalOpen: false,
      exportImportModalTab: null,
      feedbackModalOpen: false,
      changelogModalOpen: false,
      welcomeModalOpen: false,
      enhancementListModalOpen: false,
      controlsModalOpen: false,
      helpModalOpen: false,
      helpModalInitialTopic: null,
      detailedTotalsModalOpen: false,
      powersetCompareModalOpen: false,
      setBonusLookupModalOpen: false,
      setBonusPopupOpen: false,
      powerInfoModalOpen: false,
      globalIOLevel: 50,
      attunementEnabled: false,
      globalBoostLevel: 0,
      ioSetSortBy: 'name' as const,
      lastPickerFilterByPower: {},
      exemplarMode: false,
      exemplarLevel: 50,
      targetLevelOffset: 0,
      contentMode: 'standard' as const,
      procSettings: { ...DEFAULT_PROC_SETTINGS },
      procSettingsModalOpen: false,
      enhancementToolsModalOpen: false,
      attackChainModalOpen: false,
      attackChainAnnounceDismissed: false,
      chainPowerMetric: 'damage' as PowerMetric,
      chainShowEffectWindows: true,
      includeProcDamageInDPS: true,
      useArcanaTime: true,
      damageDisplayMode: 'damage' as DamageDisplayMode,
      combatMode: false,
      procChancePinned: false,
      hintsEnabled: true,
      infoPanel: defaultInfoPanel,
      statsConfig: defaultStatsConfig,
      tooltip: defaultTooltip,
      dashboardCollapsed: false,
      uiScale: 1.0,
      incarnateActive: createDefaultIncarnateActiveState(),
      incarnateLevelShiftActive: true,
      dominationActive: false,
      scourgeActive: false,
      furyLevel: 75, // Default to 75 fury (reasonable combat average)
      supremacyActive: true, // Default to ON since henchmen are typically nearby
      vigilanceTeamSize: 0, // Default to solo (0 teammates) for max damage bonus
      criticalHitsActive: false, // Default to OFF (like Scourge)
      stalkerHidden: false, // Default to not hidden (showing out-of-hide damage)
      stalkerTeamSize: 0, // Default to solo (0 teammates)
      stalkerCritActive: false, // Default to OFF (like Critical Hits)
      containmentActive: false, // Default to OFF (like Critical Hits)
      sentinelCritActive: false, // Default to OFF (like Critical Hits)
      selectedBranch: null, // No branch selected by default
      compareSlottingOpen: false,
      compareSlottingPower: null,
      powerViewMode: 'category', // powerViewMode: 'category' | 'chronological';
      hoverHint: null,
      slotMoveSource: null,
      trackedStats: [], // No tracked stats by default
      targetsHitValues: {}, // No per-target overrides by default
      mechanicAdjusters: {}, // No per-power conditional toggles overridden by default
      globalAdjusters: {}, // No global conditional toggles overridden by default
      showSlotLevels: true, // Show slot level labels by default
      permaTrackedPowers: [], // No perma-tracked powers by default
      levelUpMode: false, // Off by default — classic "respec" flow
      mobileSheet: null,
      toasts: [],
      helpToastEnabled: true,
      ruleOf5AlertEnabled: true,
      rechargeMidsStyle: false,

      // Enhancement Picker Modal
      openEnhancementPicker: (powerName, powerSet, slotIndex, overrideSelect, virtualSlots, powerCategory) =>
        set({
          enhancementPicker: {
            ...defaultEnhancementPicker,
            isOpen: true,
            currentPowerName: powerName,
            currentPowerSet: powerSet,
            currentPowerCategory: powerCategory ?? null,
            currentSlotIndex: slotIndex,
            onOverrideSelect: overrideSelect ?? null,
            virtualSlots: virtualSlots ?? null,
          },
        }),

      closeEnhancementPicker: () =>
        set({
          enhancementPicker: defaultEnhancementPicker,
        }),

      setPickerView: (view) =>
        set((state) => ({
          enhancementPicker: {
            ...state.enhancementPicker,
            currentView: view,
          },
        })),

      pushPickerView: (view) =>
        set((state) => ({
          enhancementPicker: {
            ...state.enhancementPicker,
            viewStack: [...state.enhancementPicker.viewStack, state.enhancementPicker.currentView],
            currentView: view,
          },
        })),

      popPickerView: () =>
        set((state) => {
          const viewStack = [...state.enhancementPicker.viewStack];
          const previousView = viewStack.pop() || 'category';
          return {
            enhancementPicker: {
              ...state.enhancementPicker,
              viewStack,
              currentView: previousView,
            },
          };
        }),

      setPickerCategory: (category) =>
        set((state) => ({
          enhancementPicker: {
            ...state.enhancementPicker,
            currentCategory: category,
          },
        })),

      setSelectedSetId: (setId) =>
        set((state) => ({
          enhancementPicker: {
            ...state.enhancementPicker,
            selectedSetId: setId,
          },
        })),

      // Generic Picker
      setGenericType: (type) =>
        set((state) => ({
          genericPicker: {
            ...state.genericPicker,
            selectedType: type,
          },
        })),

      // Origin Picker
      setOriginType: (type) =>
        set((state) => ({
          originPicker: {
            ...state.originPicker,
            selectedType: type,
          },
        })),

      setOriginTier: (tier) =>
        set((state) => ({
          originPicker: {
            ...state.originPicker,
            selectedTier: tier,
          },
        })),

      // Settings
      setGlobalIOLevel: (level) =>
        set({
          globalIOLevel: Math.max(10, Math.min(53, level)),
        }),

      toggleAttunement: () =>
        set((state) => ({
          attunementEnabled: !state.attunementEnabled,
        })),

      setGlobalBoostLevel: (level) =>
        set({
          globalBoostLevel: Math.max(0, Math.min(5, level)),
        }),

      setIOSetSortBy: (sort) =>
        set({ ioSetSortBy: sort }),

      setLastPickerFilter: (powerName, typeFilter, sidebarFilter) =>
        set((state) => ({
          lastPickerFilterByPower: {
            ...state.lastPickerFilterByPower,
            [powerName]: { typeFilter, sidebarFilter },
          },
        })),

      toggleExemplarMode: () =>
        set((state) => ({
          exemplarMode: !state.exemplarMode,
        })),

      setExemplarLevel: (level) =>
        set({
          exemplarLevel: Math.max(1, Math.min(50, level)),
        }),

      setTargetLevelOffset: (offset) =>
        set({
          // HC supports enemy levels up to +7 above the player (incarnate
          // trial bosses, +4-shifted AVs in late-Story arcs, +7 in some
          // hard mode content). The defense softcap shifts +5% per
          // enemy level above, so the offset range needs to cover the
          // full span for the dashboard cap to reflect reality.
          targetLevelOffset: Math.max(-7, Math.min(7, offset)),
        }),

      setContentMode: (mode) => set({ contentMode: mode }),

      toggleProcCategory: (category: ProcSettingsKey) =>
        set((state) => ({
          procSettings: {
            ...state.procSettings,
            [category]: !state.procSettings[category],
          },
        })),

      setProcSettings: (settings: ProcSettings) =>
        set({ procSettings: settings }),

      openProcSettingsModal: () =>
        set({ procSettingsModalOpen: true }),

      closeProcSettingsModal: () =>
        set({ procSettingsModalOpen: false }),

      openEnhancementToolsModal: () =>
        set({ enhancementToolsModalOpen: true }),

      closeEnhancementToolsModal: () =>
        set({ enhancementToolsModalOpen: false }),

      openAttackChainModal: () =>
        set({ attackChainModalOpen: true }),

      closeAttackChainModal: () =>
        set({ attackChainModalOpen: false }),

      dismissAttackChainAnnounce: () =>
        set({ attackChainAnnounceDismissed: true }),

      setChainPowerMetric: (metric) => set({ chainPowerMetric: metric }),
      setChainShowEffectWindows: (show) => set({ chainShowEffectWindows: show }),

      toggleIncludeProcDamageInDPS: () =>
        set((state) => ({
          includeProcDamageInDPS: !state.includeProcDamageInDPS,
        })),

      toggleCombatMode: () =>
        set((state) => ({
          combatMode: !state.combatMode,
        })),

      toggleProcChancePinned: () =>
        set((state) => ({
          procChancePinned: !state.procChancePinned,
        })),

      toggleUseArcanaTime: () =>
        set((state) => ({
          useArcanaTime: !state.useArcanaTime,
        })),

      setDamageDisplayMode: (mode) => set({ damageDisplayMode: mode }),

      toggleHints: () =>
        set((state) => ({
          hintsEnabled: !state.hintsEnabled,
        })),

      toggleDashboardCollapsed: () =>
        set((state) => ({
          dashboardCollapsed: !state.dashboardCollapsed,
        })),

      setUIScale: (scale: number) =>
        set({ uiScale: Math.max(0.85, Math.min(1.3, scale)) }),

      // Info Panel
      setInfoPanelEnabled: (enabled) =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            enabled,
          },
        })),

      setInfoPanelContent: (content) =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            content,
          },
        })),

      showPowerInfo: (powerName, powerSet) =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            content: { type: 'power', powerName, powerSet },
          },
        })),

      showEnhancementInfo: (enhancementId) =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            content: { type: 'enhancement', enhancementId },
          },
        })),

      showSetInfo: (setId) =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            content: { type: 'set', setId },
          },
        })),

      clearInfoPanel: () =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            content: null,
          },
        })),

      lockInfoPanel: (content) =>
        set((state) => {
          // On mobile/tablet (<= 1024px), also open the power info modal
          const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1024;
          return {
            infoPanel: {
              ...state.infoPanel,
              locked: true,
              lockedContent: content,
            },
            powerInfoModalOpen: isMobile || state.powerInfoModalOpen,
          };
        }),

      unlockInfoPanel: () =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            locked: false,
            lockedContent: null,
          },
        })),

      toggleInfoPanelLock: () =>
        set((state) => {
          const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1024;

          if (state.infoPanel.locked) {
            return {
              infoPanel: {
                ...state.infoPanel,
                locked: false,
                lockedContent: null,
              },
              // Close modal when unlocking on mobile
              powerInfoModalOpen: isMobile ? false : state.powerInfoModalOpen,
            };
          }
          // Lock with current content
          return {
            infoPanel: {
              ...state.infoPanel,
              locked: true,
              lockedContent: state.infoPanel.content,
            },
            // Open modal when locking on mobile
            powerInfoModalOpen: isMobile || state.powerInfoModalOpen,
          };
        }),

      setInfoPanelTooltipEnabled: (enabled) =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            tooltipEnabled: enabled,
          },
        })),

      toggleInfoPanelTooltip: () =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            tooltipEnabled: !state.infoPanel.tooltipEnabled,
          },
        })),

      undockInfoPanel: () =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            undocked: true,
          },
        })),

      dockInfoPanel: () =>
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            undocked: false,
          },
        })),

      // Tooltip
      showTooltip: (content, x, y) =>
        set({
          tooltip: {
            visible: true,
            content,
            position: { x, y },
          },
        }),

      hideTooltip: () =>
        set({
          tooltip: {
            ...get().tooltip,
            visible: false,
          },
        }),

      moveTooltip: (x, y) =>
        set((state) => ({
          tooltip: {
            ...state.tooltip,
            position: { x, y },
          },
        })),

      // Stats Config
      openStatsConfigModal: (scrollToStatId?: string) =>
        set({ statsConfigModalOpen: true, statsConfigScrollTo: scrollToStatId ?? null }),

      closeStatsConfigModal: () =>
        set({ statsConfigModalOpen: false }),

      clearStatsConfigScrollTo: () =>
        set({ statsConfigScrollTo: null }),

      // About Modal
      openAboutModal: () =>
        set({ aboutModalOpen: true }),

      closeAboutModal: () =>
        set({ aboutModalOpen: false }),

      setStatVisible: (stat, visible) =>
        set((state) => ({
          statsConfig: state.statsConfig.map((s) =>
            s.stat === stat ? { ...s, visible } : s
          ),
        })),

      reorderStats: (stats) =>
        set({
          statsConfig: stats,
        }),

      resetStatsConfig: () =>
        set({
          statsConfig: defaultStatsConfig,
        }),

      // Accolades Modal
      openAccoladesModal: () =>
        set({ accoladesModalOpen: true }),

      closeAccoladesModal: () =>
        set({ accoladesModalOpen: false }),

      // Incarnate Modal
      openIncarnateModal: (slotId) =>
        set({
          incarnateModalOpen: true,
          currentIncarnateSlot: slotId || 'alpha',
        }),

      closeIncarnateModal: () =>
        set({
          incarnateModalOpen: false,
        }),

      setCurrentIncarnateSlot: (slotId) =>
        set({
          currentIncarnateSlot: slotId,
        }),

      // Incarnate Crafting Modal
      openIncarnateCraftingModal: () =>
        set({ incarnateCraftingModalOpen: true }),

      closeIncarnateCraftingModal: () =>
        set({ incarnateCraftingModalOpen: false }),

      setIncarnateT4ComboIndex: (powerId, index) =>
        set((state) => ({
          incarnateT4ComboIndex: {
            ...state.incarnateT4ComboIndex,
            [powerId]: index,
          },
        })),

      // Export/Import Modal
      openExportImportModal: (tab) =>
        set({ exportImportModalOpen: true, exportImportModalTab: tab ?? null }),

      closeExportImportModal: () =>
        set({ exportImportModalOpen: false, exportImportModalTab: null }),

      // Feedback Modal
      openFeedbackModal: () =>
        set({ feedbackModalOpen: true }),

      closeFeedbackModal: () =>
        set({ feedbackModalOpen: false }),

      // Changelog Modal
      openChangelogModal: () =>
        set({ changelogModalOpen: true }),

      closeChangelogModal: () =>
        set({ changelogModalOpen: false }),

      openWelcomeModal: () =>
        set({ welcomeModalOpen: true }),

      closeWelcomeModal: () =>
        set({ welcomeModalOpen: false }),

      openEnhancementListModal: () =>
        set({ enhancementListModalOpen: true }),

      closeEnhancementListModal: () =>
        set({ enhancementListModalOpen: false }),

      // Controls Modal
      openControlsModal: () =>
        set({ controlsModalOpen: true }),

      closeControlsModal: () =>
        set({ controlsModalOpen: false }),

      // Help Modal
      openHelpModal: (initialTopicId) =>
        set({ helpModalOpen: true, helpModalInitialTopic: initialTopicId ?? null }),

      closeHelpModal: () =>
        set({ helpModalOpen: false, helpModalInitialTopic: null }),

      // Detailed Totals Modal
      openDetailedTotalsModal: () =>
        set({ detailedTotalsModalOpen: true }),

      closeDetailedTotalsModal: () =>
        set({ detailedTotalsModalOpen: false }),

      // Powerset Compare Modal
      openPowersetCompareModal: () =>
        set({ powersetCompareModalOpen: true }),

      closePowersetCompareModal: () =>
        set({ powersetCompareModalOpen: false }),

      // Set Bonus Lookup Modal
      openSetBonusPopup: () =>
        set({ setBonusPopupOpen: true }),

      closeSetBonusPopup: () =>
        set({ setBonusPopupOpen: false }),

      openSetBonusLookupModal: () =>
        set({ setBonusLookupModalOpen: true }),

      closeSetBonusLookupModal: () =>
        set({ setBonusLookupModalOpen: false }),

      // Power Info Modal (mobile only)
      openPowerInfoModal: () =>
        set({ powerInfoModalOpen: true }),

      closePowerInfoModal: () =>
        set({ powerInfoModalOpen: false }),

      // Incarnate Active State
      toggleIncarnateActive: (slotId) =>
        set((state) => ({
          incarnateActive: {
            ...state.incarnateActive,
            [slotId]: !state.incarnateActive[slotId],
          },
        })),

      setIncarnateActive: (slotId, active) =>
        set((state) => ({
          incarnateActive: {
            ...state.incarnateActive,
            [slotId]: active,
          },
        })),

      resetIncarnateActive: () =>
        set({ incarnateActive: createDefaultIncarnateActiveState() }),

      toggleIncarnateLevelShift: () =>
        set((state) => ({
          incarnateLevelShiftActive: !state.incarnateLevelShiftActive,
        })),

      // Domination Active State
      toggleDomination: () =>
        set((state) => ({
          dominationActive: !state.dominationActive,
        })),

      setDominationActive: (active) =>
        set({ dominationActive: active }),

      // Scourge Active State
      toggleScourge: () =>
        set((state) => ({
          scourgeActive: !state.scourgeActive,
        })),

      setScourgeActive: (active) =>
        set({ scourgeActive: active }),

      // Fury Level (Brute)
      setFuryLevel: (level) =>
        set({ furyLevel: Math.max(0, Math.min(100, level)) }),

      // Supremacy Active State (Mastermind)
      toggleSupremacy: () =>
        set((state) => ({
          supremacyActive: !state.supremacyActive,
        })),

      setSupremacyActive: (active) =>
        set({ supremacyActive: active }),

      // Vigilance Team Size (Defender)
      setVigilanceTeamSize: (size) =>
        set({ vigilanceTeamSize: Math.max(0, Math.min(7, size)) }),

      // Critical Hits Active State (Scrapper)
      toggleCriticalHits: () =>
        set((state) => ({
          criticalHitsActive: !state.criticalHitsActive,
        })),

      setCriticalHitsActive: (active) =>
        set({ criticalHitsActive: active }),

      // Stalker Hidden State
      toggleStalkerHidden: () =>
        set((state) => ({
          stalkerHidden: !state.stalkerHidden,
        })),

      setStalkerHidden: (hidden) =>
        set({ stalkerHidden: hidden }),

      // Stalker Team Size
      setStalkerTeamSize: (size) =>
        set({ stalkerTeamSize: Math.max(0, Math.min(7, size)) }),

      // Stalker Crit Active State
      toggleStalkerCrit: () =>
        set((state) => ({
          stalkerCritActive: !state.stalkerCritActive,
        })),

      // Containment Active State (Controller)
      toggleContainment: () =>
        set((state) => ({
          containmentActive: !state.containmentActive,
        })),

      setContainmentActive: (active) =>
        set({ containmentActive: active }),

      // Sentinel Critical Hits
      toggleSentinelCrit: () =>
        set((state) => ({
          sentinelCritActive: !state.sentinelCritActive,
        })),

      setSentinelCritActive: (active) =>
        set({ sentinelCritActive: active }),

      // Arachnos Branch Selection
      setSelectedBranch: (branch) =>
        set({ selectedBranch: branch }),

      clearSelectedBranch: () =>
        set({ selectedBranch: null }),

      // Compare Slotting Modal
      openCompareSlotting: (powerName?, powerSet?) =>
        set({
          compareSlottingOpen: true,
          compareSlottingPower: powerName && powerSet ? { powerName, powerSet } : null,
        }),

      closeCompareSlotting: () =>
        set({ compareSlottingOpen: false, compareSlottingPower: null }),

      // Power View Mode
      setPowerViewMode: (mode) =>
        set({ powerViewMode: mode }),

      togglePowerViewMode: () =>
        set((state) => ({
          powerViewMode: state.powerViewMode === 'category' ? 'chronological' : 'category',
        })),

      // Hover hint — ephemeral; never persisted
      setHoverHint: (hint) => set({ hoverHint: hint }),

      beginSlotLevelMove: (source) => set({ slotMoveSource: source }),
      cancelSlotLevelMove: () => set({ slotMoveSource: null }),

      // Tracked Stats
      toggleTrackedStat: (breakdownKey) =>
        set((state) => ({
          trackedStats: state.trackedStats.includes(breakdownKey)
            ? state.trackedStats.filter((k) => k !== breakdownKey)
            : [...state.trackedStats, breakdownKey],
        })),
      ensureTrackedStats: (keys) =>
        set((state) => {
          const toAdd = keys.filter((k) => !state.trackedStats.includes(k));
          if (toAdd.length === 0) return state;
          return { trackedStats: [...state.trackedStats, ...toAdd] };
        }),
      clearTrackedStats: () => set({ trackedStats: [] }),

      // Per-target slider
      setTargetsHit: (powerName, value) =>
        set((state) => ({
          targetsHitValues: { ...state.targetsHitValues, [powerName]: value },
        })),

      setTargetsHitBulk: (values) =>
        set((state) => ({
          targetsHitValues: { ...state.targetsHitValues, ...values },
        })),

      // Mechanic Adjuster toggles
      setMechanicAdjuster: (powerName, adjusterId, active) =>
        set((state) => ({
          mechanicAdjusters: {
            ...state.mechanicAdjusters,
            [`${powerName}:${adjusterId}`]: active,
          },
        })),
      toggleMechanicAdjuster: (powerName, adjusterId) =>
        set((state) => {
          const key = `${powerName}:${adjusterId}`;
          return {
            mechanicAdjusters: {
              ...state.mechanicAdjusters,
              [key]: !state.mechanicAdjusters[key],
            },
          };
        }),
      clearMechanicAdjusters: (powerName) =>
        set((state) => {
          const prefix = `${powerName}:`;
          const next: Record<string, boolean> = {};
          for (const k of Object.keys(state.mechanicAdjusters)) {
            if (!k.startsWith(prefix)) next[k] = state.mechanicAdjusters[k];
          }
          return { mechanicAdjusters: next };
        }),

      // Global Mechanic Adjusters
      setGlobalAdjuster: (adjusterId, active) =>
        set((state) => ({
          globalAdjusters: { ...state.globalAdjusters, [adjusterId]: active },
        })),
      toggleGlobalAdjuster: (adjusterId) =>
        set((state) => ({
          globalAdjusters: {
            ...state.globalAdjusters,
            [adjusterId]: !state.globalAdjusters[adjusterId],
          },
        })),
      setGlobalAdjusterGroup: (activeId, siblingIds) =>
        set((state) => {
          const next = { ...state.globalAdjusters };
          for (const id of siblingIds) next[id] = false;
          if (activeId !== null) next[activeId] = true;
          return { globalAdjusters: next };
        }),

      // Slot level labels
      toggleShowSlotLevels: () =>
        set((state) => ({
          showSlotLevels: !state.showSlotLevels,
        })),

      togglePermaTracked: (powerName) =>
        set((state) => ({
          permaTrackedPowers: state.permaTrackedPowers.includes(powerName)
            ? state.permaTrackedPowers.filter((n) => n !== powerName)
            : [...state.permaTrackedPowers, powerName],
        })),

      toggleLevelUpMode: () =>
        set((state) => ({ levelUpMode: !state.levelUpMode })),

      setLevelUpMode: (enabled) =>
        set({ levelUpMode: enabled }),

      openMobileSheet: (sheet) => set({ mobileSheet: sheet }),
      closeMobileSheet: () => set({ mobileSheet: null }),

      // Toasts
      showToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({ toasts: [{ id, ...toast }, ...state.toasts] }));
        return id;
      },
      dismissToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
      clearToasts: () => set({ toasts: [] }),
      setHelpToastEnabled: (enabled) => set({ helpToastEnabled: enabled }),
      toggleHelpToastEnabled: () =>
        set((state) => ({ helpToastEnabled: !state.helpToastEnabled })),
      setRuleOf5AlertEnabled: (enabled) => set({ ruleOf5AlertEnabled: enabled }),
      toggleRuleOf5AlertEnabled: () =>
        set((state) => ({ ruleOf5AlertEnabled: !state.ruleOf5AlertEnabled })),
      setRechargeMidsStyle: (enabled) => set({ rechargeMidsStyle: enabled }),
      toggleRechargeMidsStyle: () =>
        set((state) => ({ rechargeMidsStyle: !state.rechargeMidsStyle })),

      resetForNewBuild: () =>
        set({
          enhancementPicker: defaultEnhancementPicker,
          genericPicker: defaultGenericPicker,
          originPicker: defaultOriginPicker,
          infoPanel: defaultInfoPanel,
          tooltip: defaultTooltip,
          compareSlottingOpen: false,
          compareSlottingPower: null,
          selectedBranch: null,
          targetsHitValues: {},
          mechanicAdjusters: {},
          globalAdjusters: {},
          incarnateActive: createDefaultIncarnateActiveState(),
          incarnateLevelShiftActive: true,
          dominationActive: false,
          scourgeActive: false,
          furyLevel: 0,
          supremacyActive: false,
          vigilanceTeamSize: 0,
          criticalHitsActive: false,
          stalkerHidden: false,
          stalkerTeamSize: 0,
          stalkerCritActive: false,
          containmentActive: false,
          sentinelCritActive: false,
          trackedStats: [],
          permaTrackedPowers: [],
          // Close all modals
          statsConfigModalOpen: false,
          statsConfigScrollTo: null,
          accoladesModalOpen: false,
          incarnateModalOpen: false,
          incarnateCraftingModalOpen: false,
          exportImportModalOpen: false,
          exportImportModalTab: null,
          powerInfoModalOpen: false,
          detailedTotalsModalOpen: false,
          powersetCompareModalOpen: false,
          setBonusLookupModalOpen: false,
        }),
    }),
    {
      name: 'coh-planner-ui',
      storage: createJSONStorage(() => localStorage),
      // Only persist settings, not transient state
      partialize: (state) => ({
        globalIOLevel: state.globalIOLevel,
        attunementEnabled: state.attunementEnabled,
        globalBoostLevel: state.globalBoostLevel,
        ioSetSortBy: state.ioSetSortBy,
        lastPickerFilterByPower: state.lastPickerFilterByPower,
        // exemplarMode / exemplarLevel intentionally NOT persisted. Leaving
        // exemplar on across sessions silently changes every recharge /
        // damage / defense number on reload, which is hard to debug when
        // the user forgets the toggle is on.
        targetLevelOffset: state.targetLevelOffset,
        contentMode: state.contentMode,
        procSettings: state.procSettings,
        combatMode: state.combatMode,
        procChancePinned: state.procChancePinned,
        hintsEnabled: state.hintsEnabled,
        infoPanel: { enabled: state.infoPanel.enabled, content: null, locked: false, lockedContent: null, tooltipEnabled: state.infoPanel.tooltipEnabled, undocked: false },
        statsConfig: state.statsConfig,
        dashboardCollapsed: state.dashboardCollapsed,
        uiScale: state.uiScale,
        incarnateActive: state.incarnateActive,
        incarnateLevelShiftActive: state.incarnateLevelShiftActive,
        dominationActive: state.dominationActive,
        scourgeActive: state.scourgeActive,
        furyLevel: state.furyLevel,
        supremacyActive: state.supremacyActive,
        vigilanceTeamSize: state.vigilanceTeamSize,
        criticalHitsActive: state.criticalHitsActive,
        stalkerHidden: state.stalkerHidden,
        stalkerTeamSize: state.stalkerTeamSize,
        stalkerCritActive: state.stalkerCritActive,
        containmentActive: state.containmentActive,
        sentinelCritActive: state.sentinelCritActive,
        selectedBranch: state.selectedBranch,
        powerViewMode: state.powerViewMode,
        trackedStats: state.trackedStats,
        showSlotLevels: state.showSlotLevels,
        permaTrackedPowers: state.permaTrackedPowers,
        levelUpMode: state.levelUpMode,
        mechanicAdjusters: state.mechanicAdjusters,
        globalAdjusters: state.globalAdjusters,
        helpToastEnabled: state.helpToastEnabled,
        ruleOf5AlertEnabled: state.ruleOf5AlertEnabled,
        rechargeMidsStyle: state.rechargeMidsStyle,
        attackChainAnnounceDismissed: state.attackChainAnnounceDismissed,
        chainPowerMetric: state.chainPowerMetric,
        chainShowEffectWindows: state.chainShowEffectWindows,
      }),
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<UIStore>) };
        // Migrate old infoPanelScale → uiScale
        const raw = persisted as Record<string, unknown> | undefined;
        if (raw && 'infoPanelScale' in raw && !('uiScale' in raw)) {
          merged.uiScale = raw.infoPanelScale as number;
        }
        // Migrate old includeProcsInStats → procSettings
        if (raw && 'includeProcsInStats' in raw && !('procSettings' in raw)) {
          const allOn = raw.includeProcsInStats !== false;
          merged.procSettings = {
            damage: allOn,
            recovery: allOn,
            regeneration: allOn,
            recharge: allOn,
            toHit: allOn,
            defense: allOn,
            resistance: allOn,
            buildUp: allOn,
            movement: allOn,
          };
        }
        // Ensure procSettings has all keys (in case new categories are added)
        if (merged.procSettings) {
          merged.procSettings = { ...DEFAULT_PROC_SETTINGS, ...merged.procSettings };
        }
        // Ensure incarnateActive has all slot keys (judgement/lore added later as cosmetic toggles)
        if (merged.incarnateActive) {
          merged.incarnateActive = { ...createDefaultIncarnateActiveState(), ...merged.incarnateActive };
        }
        // Inject any new default stats that aren't in the persisted config
        const persistedStats = (persisted as Partial<UIStore>)?.statsConfig;
        if (persistedStats) {
          const existingStatIds = new Set(persistedStats.map((s) => s.stat));
          const missing = defaultStatsConfig.filter((s) => !existingStatIds.has(s.stat));
          if (missing.length > 0) {
            const maxOrder = Math.max(...persistedStats.map((s) => s.order), -1);
            merged.statsConfig = [
              ...persistedStats,
              ...missing.map((s, i) => ({ ...s, order: maxOrder + 1 + i })),
            ];
          }
        }
        return merged;
      },
    })
  );

// ============================================
// SELECTOR HOOKS
// ============================================

/** Select enhancement picker state */
export const useEnhancementPicker = () => useUIStore((state) => state.enhancementPicker);

/** Select if enhancement picker is open */
export const useIsPickerOpen = () => useUIStore((state) => state.enhancementPicker.isOpen);

/** Select global IO level */
export const useGlobalIOLevel = () => useUIStore((state) => state.globalIOLevel);

/** Select attunement setting */
export const useAttunement = () => useUIStore((state) => state.attunementEnabled);

/** Select exemplar mode setting */
export const useExemplarMode = () => useUIStore((state) => state.exemplarMode);

/** Select exemplar level */
export const useExemplarLevel = () => useUIStore((state) => state.exemplarLevel);

/** Select hints setting */
export const useHintsEnabled = () => useUIStore((state) => state.hintsEnabled);

/** Select info panel state */
export const useInfoPanel = () => useUIStore((state) => state.infoPanel);

/** Select tooltip state */
export const useTooltip = () => useUIStore((state) => state.tooltip);

/** Select stats config */
export const useStatsConfig = () => useUIStore((state) => state.statsConfig);

/** Select visible stats only */
export const useVisibleStats = () =>
  useUIStore((state) =>
    state.statsConfig.filter((s) => s.visible).sort((a, b) => a.order - b.order)
  );

/** Select incarnate modal state */
export const useIncarnateModal = () =>
  useUIStore((state) => ({
    isOpen: state.incarnateModalOpen,
    currentSlot: state.currentIncarnateSlot,
  }));

/** Select incarnate active state */
export const useIncarnateActive = () => useUIStore((state) => state.incarnateActive);

/** Select if a specific incarnate slot is active */
export const useIsIncarnateSlotActive = (slotId: ToggleableIncarnateSlot) =>
  useUIStore((state) => state.incarnateActive[slotId]);

/** Select domination active state */
export const useDominationActive = () => useUIStore((state) => state.dominationActive);

/** Select scourge active state */
export const useScourgeActive = () => useUIStore((state) => state.scourgeActive);

/** Select fury level */
export const useFuryLevel = () => useUIStore((state) => state.furyLevel);

/** Select supremacy active state */
export const useSupremacyActive = () => useUIStore((state) => state.supremacyActive);

/** Select vigilance team size */
export const useVigilanceTeamSize = () => useUIStore((state) => state.vigilanceTeamSize);

/** Select critical hits active state */
export const useCriticalHitsActive = () => useUIStore((state) => state.criticalHitsActive);

/** Select stalker hidden state */
export const useStalkerHidden = () => useUIStore((state) => state.stalkerHidden);

/**
 * Select the active state of one Mechanic Adjuster toggle. Falls back to
 * the conditional effect's `defaultActive` flag when the user hasn't
 * touched the toggle. Use for `scope: 'per-power'` conditionals.
 */
export const useMechanicAdjuster = (
  powerName: string,
  adjusterId: string,
  defaultActive: boolean = false,
): boolean => useUIStore((state) => {
  const v = state.mechanicAdjusters[`${powerName}:${adjusterId}`];
  return v === undefined ? defaultActive : v;
});

/**
 * Select the active state of one global Mechanic Adjuster (caster-state
 * mechanic — Bio Armor adaptation, Hide, Domination, etc.). Use for
 * `scope: 'global'` conditionals.
 */
export const useGlobalAdjuster = (
  adjusterId: string,
  defaultActive: boolean = false,
): boolean => useUIStore((state) => {
  const v = state.globalAdjusters[adjusterId];
  return v === undefined ? defaultActive : v;
});

/** Select stalker team size */
export const useStalkerTeamSize = () => useUIStore((state) => state.stalkerTeamSize);

/** Select stalker crit active state */
export const useStalkerCritActive = () => useUIStore((state) => state.stalkerCritActive);

/** Select containment active state */
export const useContainmentActive = () => useUIStore((state) => state.containmentActive);

/** Select sentinel crit active state */
export const useSentinelCritActive = () => useUIStore((state) => state.sentinelCritActive);

/** Select power view mode */
export const usePowerViewMode = () => useUIStore((state) => state.powerViewMode);

/** Select targets-hit value for a specific power */
export const useTargetsHit = (powerName: string) =>
  useUIStore((state) => state.targetsHitValues[powerName] ?? 0);

/** Select slot level labels visibility */
export const useShowSlotLevels = () => useUIStore((state) => state.showSlotLevels);

/** Select proc damage in DPS toggle */
export const useIncludeProcDamageInDPS = () => useUIStore((state) => state.includeProcDamageInDPS);

/** Select ArcanaTime toggle */
export const useArcanaTime = () => useUIStore((state) => state.useArcanaTime);

/** Select damage per activation toggle */
export const useDamageDisplayMode = () => useUIStore((state) => state.damageDisplayMode);
