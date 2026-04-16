/**
 * Onboarding Store - manages progressive feature discovery
 *
 * Tracks which onboarding steps the user has completed and provides
 * actions to advance through the sequence. Persisted to localStorage
 * so progress survives page reloads.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================
// STEP DEFINITIONS
// ============================================

export type OnboardingTier = 1 | 2 | 3 | 4;

export interface OnboardingStepDef {
  /** Unique step id, matches data-onboarding attribute on target element */
  id: string;
  /** Which tier this step belongs to */
  tier: OnboardingTier;
  /** Hint text shown on hover */
  hint: string;
  /** Whether this step requires a condition to be visible (e.g., level 50 for incarnates) */
  conditional?: boolean;
}

/**
 * Ordered sequence of onboarding steps.
 * Steps within a tier are shown one at a time, advancing when the user
 * interacts with the indicated feature.
 */
export const ONBOARDING_STEPS: OnboardingStepDef[] = [
  // Tier 1 — Build Your First Character
  { id: 'select-archetype', tier: 1, hint: 'Start here \u2014 pick an Archetype for your character' },
  { id: 'select-primary', tier: 1, hint: 'Choose your Primary powerset' },
  { id: 'select-secondary', tier: 1, hint: 'Now pick a Secondary' },
  { id: 'add-power', tier: 1, hint: 'Click a power to add it to your build' },
  { id: 'add-slot', tier: 1, hint: 'Click to add a slot, or click and drag to add multiple' },
  { id: 'slot-enhancement', tier: 1, hint: 'Click to open the Enhancement Picker and slot an IO set' },

  // Tier 2 — Understand Your Build
  { id: 'stats-config', tier: 2, hint: 'Customize your dashboard \u2014 pick the stats that matter to your build' },
  { id: 'stat-hover', tier: 2, hint: 'Click any stat to track it \u2014 hover to see the breakdown' },
  { id: 'set-bonus-finder', tier: 2, hint: 'Search IO sets by bonus type to find what your build needs' },
  { id: 'compare-slotting', tier: 2, hint: 'Compare different slotting options side-by-side' },
  { id: 'enhancement-list', tier: 2, hint: 'See your full enhancement shopping list \u2014 click items to mark them as acquired' },
  { id: 'detailed-totals', tier: 2, hint: 'See the full breakdown of all your stats in one place' },
  { id: 'power-toggle', tier: 2, hint: 'Toggle powers on/off to see how they change your stats' },
  { id: 'accolades', tier: 2, hint: 'Claim accolade bonuses to add permanent stat boosts' },

  // Tier 3 — Power User
  { id: 'info-panel', tier: 3, hint: 'Power details appear here \u2014 undock or lock the panel from the header' },
  { id: 'level-slider', tier: 3, hint: 'Preview your build at any level' },
  { id: 'undo-redo', tier: 3, hint: 'Undo and redo are always available' },
  { id: 'export-import', tier: 3, hint: 'Export to share, or import from Mids' },
  { id: 'at-mechanic', tier: 3, hint: "Your AT's special mechanic \u2014 adjust to see the impact" },
  { id: 'controls', tier: 3, hint: 'View all keyboard shortcuts and mouse controls' },
  { id: 'settings', tier: 3, hint: 'Build settings \u2014 level, origin, exemplar mode, and more' },

  // Tier 4 — Endgame (conditional on level 50)
  { id: 'incarnate-slot', tier: 4, hint: 'Unlock Incarnate slots for endgame powers', conditional: true },
  { id: 'help', tier: 4, hint: 'Need help? Browse topics or search for answers here' },
];

// ============================================
// STORE INTERFACE
// ============================================

interface OnboardingState {
  /** Whether onboarding is enabled */
  enabled: boolean;
  /** Set of completed step ids */
  completedSteps: string[];
  /** Index of the current active step in ONBOARDING_STEPS */
  currentStepIndex: number;
  /** Whether to show the hint tooltip (true when user hovers the beacon) */
  hintVisible: boolean;
}

interface OnboardingActions {
  /** Complete the current step and advance to the next */
  completeStep: (stepId: string) => void;
  /** Enable onboarding */
  enable: () => void;
  /** Disable onboarding */
  disable: () => void;
  /** Toggle onboarding on/off */
  toggle: () => void;
  /** Reset all progress and re-enable */
  reset: () => void;
  /** Show the hover hint */
  showHint: () => void;
  /** Hide the hover hint */
  hideHint: () => void;
  /** Skip to the next step without completing */
  skipStep: () => void;
  /** Get the current step definition, or null if all done */
  getCurrentStep: () => OnboardingStepDef | null;
}

type OnboardingStore = OnboardingState & OnboardingActions;

// ============================================
// HELPERS
// ============================================

function findNextIncompleteStep(completedSteps: string[], fromIndex: number): number {
  for (let i = fromIndex; i < ONBOARDING_STEPS.length; i++) {
    if (!completedSteps.includes(ONBOARDING_STEPS[i].id)) {
      return i;
    }
  }
  return ONBOARDING_STEPS.length; // all done
}

// ============================================
// STORE
// ============================================

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      enabled: true,
      completedSteps: [],
      currentStepIndex: 0,
      hintVisible: false,

      completeStep: (stepId: string) => {
        const { completedSteps, currentStepIndex } = get();
        if (completedSteps.includes(stepId)) return;

        const currentStep = ONBOARDING_STEPS[currentStepIndex];
        // Only advance if the completed step matches the current step
        if (!currentStep || currentStep.id !== stepId) return;

        const newCompleted = [...completedSteps, stepId];
        const nextIndex = findNextIncompleteStep(newCompleted, currentStepIndex + 1);
        set({
          completedSteps: newCompleted,
          currentStepIndex: nextIndex,
          hintVisible: false,
        });
      },

      enable: () => set({ enabled: true }),
      disable: () => set({ enabled: false, hintVisible: false }),
      toggle: () => {
        const { enabled } = get();
        set({ enabled: !enabled, hintVisible: false });
      },

      reset: () =>
        set({
          enabled: true,
          completedSteps: [],
          currentStepIndex: 0,
          hintVisible: false,
        }),

      showHint: () => set({ hintVisible: true }),
      hideHint: () => set({ hintVisible: false }),

      skipStep: () => {
        const { completedSteps, currentStepIndex } = get();
        const nextIndex = findNextIncompleteStep(completedSteps, currentStepIndex + 1);
        set({ currentStepIndex: nextIndex, hintVisible: false });
      },

      getCurrentStep: () => {
        const { currentStepIndex } = get();
        return ONBOARDING_STEPS[currentStepIndex] ?? null;
      },
    }),
    {
      name: 'coh-planner-onboarding',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        enabled: state.enabled,
        completedSteps: state.completedSteps,
        currentStepIndex: state.currentStepIndex,
      }),
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<OnboardingStore>) };
        // If persisted index is beyond steps array (e.g., steps were removed), clamp it
        if (merged.currentStepIndex > ONBOARDING_STEPS.length) {
          merged.currentStepIndex = ONBOARDING_STEPS.length;
        }
        return merged;
      },
    }
  )
);

// ============================================
// SELECTOR HOOKS
// ============================================

export const useOnboardingEnabled = () => useOnboardingStore((s) => s.enabled);
export const useOnboardingCurrentStep = () => {
  const index = useOnboardingStore((s) => s.currentStepIndex);
  return ONBOARDING_STEPS[index] ?? null;
};
export const useOnboardingHintVisible = () => useOnboardingStore((s) => s.hintVisible);
export const useIsOnboardingComplete = () =>
  useOnboardingStore((s) => s.currentStepIndex >= ONBOARDING_STEPS.length);
