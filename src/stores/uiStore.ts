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
} from '@/types';

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

  /** Global IO level for calculations */
  globalIOLevel: number;

  /** Attunement toggle */
  attunementEnabled: boolean;

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
}

interface UIActions {
  // Enhancement Picker Modal
  openEnhancementPicker: (powerName: string, powerSet: string, slotIndex: number) => void;
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
  toggleHints: () => void;
  toggleDarkMode: () => void;
  toggleCompactMode: () => void;

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
};

const defaultStatsConfig: StatDisplayConfig[] = [
  { stat: 'damage', visible: true, order: 0 },
  { stat: 'accuracy', visible: true, order: 1 },
  { stat: 'tohit', visible: true, order: 2 },
  { stat: 'recharge', visible: true, order: 3 },
  { stat: 'endurance', visible: true, order: 4 },
  { stat: 'defense', visible: true, order: 5 },
  { stat: 'resistance', visible: true, order: 6 },
  { stat: 'health', visible: true, order: 7 },
  { stat: 'regeneration', visible: true, order: 8 },
  { stat: 'recovery', visible: true, order: 9 },
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
      globalIOLevel: 50,
      attunementEnabled: false,
      hintsEnabled: true,
      infoPanel: defaultInfoPanel,
      statsConfig: defaultStatsConfig,
      tooltip: defaultTooltip,
      darkMode: true,
      compactMode: false,

      // Enhancement Picker Modal
      openEnhancementPicker: (powerName, powerSet, slotIndex) =>
        set({
          enhancementPicker: {
            ...defaultEnhancementPicker,
            isOpen: true,
            currentPowerName: powerName,
            currentPowerSet: powerSet,
            currentSlotIndex: slotIndex,
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
        set((state) => ({
          infoPanel: {
            ...state.infoPanel,
            locked: true,
            lockedContent: content,
          },
        })),

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
          if (state.infoPanel.locked) {
            return {
              infoPanel: {
                ...state.infoPanel,
                locked: false,
                lockedContent: null,
              },
            };
          }
          // Lock with current content
          return {
            infoPanel: {
              ...state.infoPanel,
              locked: true,
              lockedContent: state.infoPanel.content,
            },
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
    }),
    {
      name: 'coh-planner-ui',
      storage: createJSONStorage(() => localStorage),
      // Only persist settings, not transient state
      partialize: (state) => ({
        globalIOLevel: state.globalIOLevel,
        attunementEnabled: state.attunementEnabled,
        hintsEnabled: state.hintsEnabled,
        infoPanel: { enabled: state.infoPanel.enabled, content: null, locked: false, lockedContent: null, tooltipEnabled: state.infoPanel.tooltipEnabled },
        statsConfig: state.statsConfig,
        darkMode: state.darkMode,
        compactMode: state.compactMode,
      }),
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
