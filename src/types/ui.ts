/**
 * UI state type definitions
 */

import type { EnhancementStatType, EnhancementTier, IOSetRarity } from './common';
import type { Enhancement } from './enhancement';

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
  /** Build category of the power (primary/secondary/pool/epic/inherent) for disambiguation */
  currentPowerCategory: string | null;
  /** Slot index being filled */
  currentSlotIndex: number;
  /** Current IO set category filter */
  currentCategory: IOSetRarity | 'all' | null;
  /** Selected IO set (when viewing details) */
  selectedSetId: string | null;
  /** Optional override for enhancement selection (used by Compare Slotting modal) */
  onOverrideSelect: ((slotIndex: number, enhancement: Enhancement) => void) | null;
  /** Virtual slots used for empty-slot detection when override is active (e.g. compare modal) */
  virtualSlots: (Enhancement | null)[] | null;
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
// PLANNER LAYOUT STATE
// ============================================

/**
 * Identifiers for the rearrangeable planner columns. Category view uses
 * available/primary/secondary/pool/inherent/info; chronological view uses
 * available/bylevel/info. `info` is shared by both. `pool` holds pool + epic
 * powers; `inherent` (Fitness / Basic / Prestige / archetype inherent) is its
 * own column so users can place or hide it independently.
 */
export type PlannerSectionId =
  | 'available'
  | 'primary'
  | 'secondary'
  | 'pool'
  | 'inherent'
  | 'info'
  | 'bylevel';

export interface PlannerSectionConfig {
  /** Which section this entry positions */
  id: PlannerSectionId;
  /** Whether the section is shown in the desktop (lg+) grid */
  visible: boolean;
  /**
   * Grid track weight in fr units (defaults to 1 when omitted). Lets a section
   * claim more horizontal space than its siblings — e.g. the chronological
   * "Powers by Level" grid is 2fr.
   */
  weight?: number;
}

/**
 * Per-view-mode desktop column arrangement. Order within each array IS the
 * left-to-right column order. Persisted so a user's layout survives reload.
 * Tier-1 scope: reorder + show/hide (no free-form resize yet — `weight` is the
 * seam a future resize feature would drive).
 */
export interface PlannerLayoutState {
  category: PlannerSectionConfig[];
  chronological: PlannerSectionConfig[];
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
      currentPowerCategory: null,
      currentSlotIndex: 0,
      currentCategory: null,
      selectedSetId: null,
      onOverrideSelect: null,
      virtualSlots: null,
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
