/**
 * UI state type definitions
 */

import type { EnhancementStatType, EnhancementTier, IOSetRarity } from './common';

// ============================================
// ENHANCEMENT PICKER MODAL VIEWS
// ============================================

export type ModalView =
  | 'category'        // Main category selection
  | 'io-sets'         // IO set browsing
  | 'io-set-detail'   // Specific set's pieces
  | 'io-generic'      // Generic IO selection
  | 'special'         // Hamidon/Titan/etc
  | 'origin';         // SO/DO/TO selection

// ============================================
// ENHANCEMENT PICKER STATE
// ============================================

export interface EnhancementPickerState {
  /** Is the modal open? */
  isOpen: boolean;
  /** Current view in the modal */
  currentView: ModalView;
  /** Navigation history for back button */
  viewStack: ModalView[];
  /** Power being enhanced */
  currentPowerName: string | null;
  /** Powerset of the power being enhanced */
  currentPowerSet: string | null;
  /** Slot index being filled */
  currentSlotIndex: number;
  /** Current IO set category filter */
  currentCategory: IOSetRarity | 'all' | null;
  /** Selected IO set (when viewing details) */
  selectedSetId: string | null;
}

// ============================================
// GENERIC/ORIGIN ENHANCEMENT PICKER STATE
// ============================================

export interface GenericPickerState {
  /** Selected enhancement stat type */
  selectedType: EnhancementStatType;
}

export interface OriginPickerState {
  /** Selected enhancement stat type */
  selectedType: EnhancementStatType;
  /** Selected tier (TO/DO/SO) */
  selectedTier: EnhancementTier;
}

// ============================================
// STATS DASHBOARD STATE
// ============================================

export interface StatDisplayConfig {
  /** Stat identifier */
  stat: string;
  /** Whether to show this stat */
  visible: boolean;
  /** Display order */
  order: number;
}

// ============================================
// TOOLTIP STATE
// ============================================

export interface TooltipState {
  /** Is tooltip visible? */
  visible: boolean;
  /** Tooltip content (could be power, enhancement, etc.) */
  content: TooltipContent | null;
  /** Position */
  position: { x: number; y: number };
}

export type TooltipContent =
  | { type: 'power'; powerName: string; powerSet: string }
  | { type: 'enhancement'; enhancement: unknown }
  | { type: 'set-bonus'; setId: string }
  | { type: 'stat'; stat: string; value: number };

// ============================================
// INFO PANEL STATE
// ============================================

export interface InfoPanelState {
  /** Is the info panel enabled? */
  enabled: boolean;
  /** Current content to display */
  content: InfoPanelContent | null;
  /** Is the info panel locked to current content? */
  locked: boolean;
  /** Locked content (separate from hoverable content) */
  lockedContent: InfoPanelContent | null;
  /** Is power info tooltip enabled? */
  tooltipEnabled: boolean;
  /** Is the info panel undocked into a separate window? */
  undocked: boolean;
}

export type InfoPanelContent =
  | { type: 'power'; powerName: string; powerSet: string }
  | { type: 'enhancement'; enhancementId: string }
  | { type: 'set'; setId: string }
  | { type: 'slotted-enhancement'; powerName: string; slotIndex: number }
  | { type: 'incarnate'; slotId: string; powerId: string };

// ============================================
// GLOBAL UI STATE
// ============================================

export interface UIState {
  /** Enhancement picker modal state */
  enhancementPicker: EnhancementPickerState;

  /** Generic enhancement picker state */
  genericPicker: GenericPickerState;

  /** Origin enhancement picker state */
  originPicker: OriginPickerState;

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
}

// ============================================
// DEFAULT UI STATE FACTORY
// ============================================

export function createDefaultUIState(): UIState {
  return {
    enhancementPicker: {
      isOpen: false,
      currentView: 'category',
      viewStack: [],
      currentPowerName: null,
      currentPowerSet: null,
      currentSlotIndex: 0,
      currentCategory: null,
      selectedSetId: null,
    },
    genericPicker: {
      selectedType: 'Damage',
    },
    originPicker: {
      selectedType: 'Damage',
      selectedTier: 'SO',
    },
    globalIOLevel: 50,
    attunementEnabled: false,
    hintsEnabled: true,
    infoPanel: {
      enabled: true,
      content: null,
      locked: false,
      lockedContent: null,
      tooltipEnabled: false,
      undocked: false,
    },
    statsConfig: [],
    tooltip: {
      visible: false,
      content: null,
      position: { x: 0, y: 0 },
    },
  };
}
