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
  exportImportModalTab: 'save-load' | 'import' | 'share' | null;

  /** Feedback modal open state */
  feedbackModalOpen: boolean;

  /** Known Issues modal open state */
  knownIssuesModalOpen: boolean;

  /** Changelog modal open state */
  changelogModalOpen: boolean;

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

  /** Power Info modal open state (mobile only) */
  powerInfoModalOpen: boolean;

  /** Global IO level for calculations */
  globalIOLevel: number;

  /** Attunement toggle */
  attunementEnabled: boolean;

  /** Global enhancement boost level (0-5) */
  globalBoostLevel: number;

  /** Exemplar mode - when ON, respects build level for set bonus suppression */
  exemplarMode: boolean;

  /** Exemplar level - the level to exemplar down to (1-50, default: 50) */
  exemplarLevel: number;

  /** Target enemy level offset for hit chance calculation (-5 to +5, 0 = even level) */
  targetLevelOffset: number;

  /** Per-category proc settings for dashboard stat calculations */
  procSettings: ProcSettings;

  /** Proc settings modal open state */
  procSettingsModalOpen: boolean;

  /** Include proc damage in per-power DPS calculations */
  includeProcDamageInDPS: boolean;

  /** Use ArcanaTime (server-tick-adjusted cast time) for DPS calculations */
  useArcanaTime: boolean;

  /** Show damage per activation instead of DPS */
  showDamagePerActivation: boolean;

  /** Combat mode: suppress defense buffs from stealth/travel powers */
  combatMode: boolean;

  /** Hints/help visibility */
  hintsEnabled: boolean;

  /** Info panel state */
  infoPanel: InfoPanelState;

  /** Stats display configuration */
  statsConfig: StatDisplayConfig[];

  /** Tooltip state */
  tooltip: TooltipState;

  /** Dark mode (for future use) */
  darkMode: boolean;

  /** Compact mode (for future use) */
  compactMode: boolean;

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

  /** Opportunity meter level for Sentinels (0-100) */
  opportunityLevel: number;

  /** Sentinel critical hits active state */
  sentinelCritActive: boolean;

  /** Selected branch for Arachnos Epic ATs (Soldier: bane-spider/crab-spider, Widow: night-widow/fortunata) */
  selectedBranch: ArchetypeBranchId | null;

  /** Compare Slotting modal */
  compareSlottingOpen: boolean;
  compareSlottingPower: { powerName: string; powerSet: string } | null;

  /** Power view mode: 'category' (default) or 'chronological' (Mids-style) */
  powerViewMode: 'category' | 'chronological';

  /** Tracked stats — breakdownKey values for stats the user wants to chase via set bonuses */
  trackedStats: string[];

  /** Per-target slider values keyed by power name (0 = buff inactive, 1+ = targets hit) */
  targetsHitValues: Record<string, number>;

  /** Show slot level labels on enhancement slots */
  showSlotLevels: boolean;

  /** Power names being tracked for "perma" (recharge <= duration) */
  permaTrackedPowers: string[];
}

interface UIActions {
  // Enhancement Picker Modal
  openEnhancementPicker: (powerName: string, powerSet: string, slotIndex: number, overrideSelect?: (slotIndex: number, enhancement: Enhancement) => void, virtualSlots?: (Enhancement | null)[]) => void;
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
  toggleExemplarMode: () => void;
  setExemplarLevel: (level: number) => void;
  setTargetLevelOffset: (offset: number) => void;
  toggleProcCategory: (category: ProcSettingsKey) => void;
  setProcSettings: (settings: ProcSettings) => void;
  openProcSettingsModal: () => void;
  closeProcSettingsModal: () => void;
  toggleIncludeProcDamageInDPS: () => void;
  toggleUseArcanaTime: () => void;
  toggleShowDamagePerActivation: () => void;
  toggleCombatMode: () => void;
  toggleHints: () => void;
  toggleDarkMode: () => void;
  toggleCompactMode: () => void;
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
  openStatsConfigModal: () => void;
  closeStatsConfigModal: () => void;
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
  openExportImportModal: (tab?: 'save-load' | 'import' | 'share') => void;
  closeExportImportModal: () => void;

  // Feedback Modal
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;

  // Known Issues Modal
  openKnownIssuesModal: () => void;
  closeKnownIssuesModal: () => void;

  // Changelog Modal
  openChangelogModal: () => void;
  closeChangelogModal: () => void;

  // Controls Modal
  openControlsModal: () => void;
  closeControlsModal: () => void;

  // Help Modal
  openHelpModal: () => void;
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
  setOpportunityLevel: (level: number) => void;

  // Sentinel Critical Hits Active State (Sentinel inherent)
  toggleSentinelCrit: () => void;
  setSentinelCritActive: (active: boolean) => void;

  // Arachnos Branch Selection (Epic ATs)
  setSelectedBranch: (branch: ArchetypeBranchId | null) => void;
  clearSelectedBranch: () => void;

  // Compare Slotting Modal
  openCompareSlotting: (powerName: string, powerSet: string) => void;
  closeCompareSlotting: () => void;

  // Power View Mode
  setPowerViewMode: (mode: 'category' | 'chronological') => void;
  togglePowerViewMode: () => void;

  // Tracked Stats
  toggleTrackedStat: (breakdownKey: string) => void;
  clearTrackedStats: () => void;

  // Per-target slider
  setTargetsHit: (powerName: string, value: number) => void;

  // Slot level labels
  toggleShowSlotLevels: () => void;

  // Perma tracker
  togglePermaTracked: (powerName: string) => void;

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
  tooltipEnabled: true,
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
  { stat: 'defense_melee', visible: true, order: 9 },
  { stat: 'defense_ranged', visible: true, order: 10 },
  { stat: 'res_smashing', visible: true, order: 11 },
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
      accoladesModalOpen: false,
      aboutModalOpen: false,
      incarnateModalOpen: false,
      incarnateCraftingModalOpen: false,
      currentIncarnateSlot: null,
      incarnateT4ComboIndex: {},
      exportImportModalOpen: false,
      exportImportModalTab: null,
      feedbackModalOpen: false,
      knownIssuesModalOpen: false,
      changelogModalOpen: false,
      controlsModalOpen: false,
      helpModalOpen: false,
      detailedTotalsModalOpen: false,
      powersetCompareModalOpen: false,
      setBonusLookupModalOpen: false,
      powerInfoModalOpen: false,
      globalIOLevel: 50,
      attunementEnabled: false,
      globalBoostLevel: 0,
      exemplarMode: false,
      exemplarLevel: 50,
      targetLevelOffset: 0,
      procSettings: { ...DEFAULT_PROC_SETTINGS },
      procSettingsModalOpen: false,
      includeProcDamageInDPS: true,
      useArcanaTime: true,
      showDamagePerActivation: true,
      combatMode: false,
      hintsEnabled: true,
      infoPanel: defaultInfoPanel,
      statsConfig: defaultStatsConfig,
      tooltip: defaultTooltip,
      darkMode: true,
      compactMode: false,
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
      opportunityLevel: 50, // Default to 50 (reasonable mid-combat average)
      sentinelCritActive: false, // Default to OFF (like Critical Hits)
      selectedBranch: null, // No branch selected by default
      compareSlottingOpen: false,
      compareSlottingPower: null,
      powerViewMode: 'category', // Default to category-based view
      trackedStats: [], // No tracked stats by default
      targetsHitValues: {}, // No per-target overrides by default
      showSlotLevels: true, // Show slot level labels by default
      permaTrackedPowers: [], // No perma-tracked powers by default

      // Enhancement Picker Modal
      openEnhancementPicker: (powerName, powerSet, slotIndex, overrideSelect, virtualSlots) =>
        set({
          enhancementPicker: {
            ...defaultEnhancementPicker,
            isOpen: true,
            currentPowerName: powerName,
            currentPowerSet: powerSet,
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
          targetLevelOffset: Math.max(-5, Math.min(5, offset)),
        }),

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

      toggleIncludeProcDamageInDPS: () =>
        set((state) => ({
          includeProcDamageInDPS: !state.includeProcDamageInDPS,
        })),

      toggleCombatMode: () =>
        set((state) => ({
          combatMode: !state.combatMode,
        })),

      toggleUseArcanaTime: () =>
        set((state) => ({
          useArcanaTime: !state.useArcanaTime,
        })),

      toggleShowDamagePerActivation: () =>
        set((state) => ({
          showDamagePerActivation: !state.showDamagePerActivation,
        })),

      toggleHints: () =>
        set((state) => ({
          hintsEnabled: !state.hintsEnabled,
        })),

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      toggleCompactMode: () =>
        set((state) => ({
          compactMode: !state.compactMode,
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
      openStatsConfigModal: () =>
        set({ statsConfigModalOpen: true }),

      closeStatsConfigModal: () =>
        set({ statsConfigModalOpen: false }),

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

      // Known Issues Modal
      openKnownIssuesModal: () =>
        set({ knownIssuesModalOpen: true }),

      closeKnownIssuesModal: () =>
        set({ knownIssuesModalOpen: false }),

      // Changelog Modal
      openChangelogModal: () =>
        set({ changelogModalOpen: true }),

      closeChangelogModal: () =>
        set({ changelogModalOpen: false }),

      // Controls Modal
      openControlsModal: () =>
        set({ controlsModalOpen: true }),

      closeControlsModal: () =>
        set({ controlsModalOpen: false }),

      // Help Modal
      openHelpModal: () =>
        set({ helpModalOpen: true }),

      closeHelpModal: () =>
        set({ helpModalOpen: false }),

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

      // Opportunity Level (Sentinel)
      setOpportunityLevel: (level) =>
        set({ opportunityLevel: Math.max(0, Math.min(100, level)) }),

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
      openCompareSlotting: (powerName, powerSet) =>
        set({ compareSlottingOpen: true, compareSlottingPower: { powerName, powerSet } }),

      closeCompareSlotting: () =>
        set({ compareSlottingOpen: false, compareSlottingPower: null }),

      // Power View Mode
      setPowerViewMode: (mode) =>
        set({ powerViewMode: mode }),

      togglePowerViewMode: () =>
        set((state) => ({
          powerViewMode: state.powerViewMode === 'category' ? 'chronological' : 'category',
        })),

      // Tracked Stats
      toggleTrackedStat: (breakdownKey) =>
        set((state) => ({
          trackedStats: state.trackedStats.includes(breakdownKey)
            ? state.trackedStats.filter((k) => k !== breakdownKey)
            : [...state.trackedStats, breakdownKey],
        })),
      clearTrackedStats: () => set({ trackedStats: [] }),

      // Per-target slider
      setTargetsHit: (powerName, value) =>
        set((state) => ({
          targetsHitValues: { ...state.targetsHitValues, [powerName]: value },
        })),

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
          incarnateActive: { alpha: false, destiny: false, hybrid: false, interface: false },
          incarnateLevelShiftActive: false,
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
          opportunityLevel: 0,
          sentinelCritActive: false,
          trackedStats: [],
          permaTrackedPowers: [],
          // Close all modals
          statsConfigModalOpen: false,
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
        exemplarMode: state.exemplarMode,
        exemplarLevel: state.exemplarLevel,
        targetLevelOffset: state.targetLevelOffset,
        procSettings: state.procSettings,
        combatMode: state.combatMode,
        hintsEnabled: state.hintsEnabled,
        infoPanel: { enabled: state.infoPanel.enabled, content: null, locked: false, lockedContent: null, tooltipEnabled: state.infoPanel.tooltipEnabled, undocked: false },
        statsConfig: state.statsConfig,
        darkMode: state.darkMode,
        compactMode: state.compactMode,
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
        containmentActive: state.containmentActive,
        selectedBranch: state.selectedBranch,
        powerViewMode: state.powerViewMode,
        trackedStats: state.trackedStats,
        showSlotLevels: state.showSlotLevels,
        permaTrackedPowers: state.permaTrackedPowers,
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

/** Select stalker team size */
export const useStalkerTeamSize = () => useUIStore((state) => state.stalkerTeamSize);

/** Select stalker crit active state */
export const useStalkerCritActive = () => useUIStore((state) => state.stalkerCritActive);

/** Select containment active state */
export const useContainmentActive = () => useUIStore((state) => state.containmentActive);

/** Select opportunity meter level */
export const useOpportunityLevel = () => useUIStore((state) => state.opportunityLevel);

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
export const useShowDamagePerActivation = () => useUIStore((state) => state.showDamagePerActivation);
