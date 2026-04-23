/**
 * OnboardingBeacon - pulsing ring indicator that guides users to features
 *
 * Renders as a portal overlay positioned over the current onboarding target.
 * Shows a gentle pulsing ring animation and displays a hint tooltip on hover.
 *
 * The entire overlay is pointer-events:none so clicks pass through to the
 * actual UI elements beneath. Step completion is detected via:
 * - Document-level click listener for most steps
 * - Build store subscriptions for build-identity steps (AT/primary/secondary)
 * - Document-level mouseover for hover-based steps (stat-hover)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useBuildStore, useIsPickerOpen } from '@/stores';
import { useUIStore } from '@/stores/uiStore';
import {
  useOnboardingStore,
  useOnboardingEnabled,
  useOnboardingCurrentStep,
  useIsOnboardingComplete,
} from '@/stores/onboardingStore';

interface BeaconPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function OnboardingBeacon() {
  const enabled = useOnboardingEnabled();
  const currentStep = useOnboardingCurrentStep();
  const isComplete = useIsOnboardingComplete();
  const { completeStep } = useOnboardingStore();

  // Hide beacon when any modal is open
  const pickerOpen = useIsPickerOpen();
  const anyModalOpen = useUIStore((s) =>
    pickerOpen ||
    s.statsConfigModalOpen ||
    s.accoladesModalOpen ||
    s.aboutModalOpen ||
    s.incarnateModalOpen ||
    s.incarnateCraftingModalOpen ||
    s.exportImportModalOpen ||
    s.feedbackModalOpen ||
    s.changelogModalOpen ||
    s.controlsModalOpen ||
    s.helpModalOpen ||
    s.detailedTotalsModalOpen ||
    s.powersetCompareModalOpen ||
    s.setBonusLookupModalOpen ||
    s.powerInfoModalOpen ||
    s.procSettingsModalOpen ||
    s.compareSlottingOpen
  );

  // Store values for auto-completing steps that live inside dropdowns/popovers
  const archetypeId = useBuildStore((s) => s.build.archetype.id);
  const primaryId = useBuildStore((s) => s.build.primary.id);
  const secondaryId = useBuildStore((s) => s.build.secondary.id);
  const exportModalOpen = useUIStore((s) => s.exportImportModalOpen);
  const helpModalOpen = useUIStore((s) => s.helpModalOpen);

  const [position, setPosition] = useState<BeaconPosition | null>(null);
  const [visible, setVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const rafRef = useRef<number>(0);
  const hintRef = useRef<HTMLDivElement>(null);

  // Auto-complete steps based on store state changes
  useEffect(() => {
    if (!enabled || isComplete || !currentStep) return;
    if (currentStep.id === 'select-archetype' && archetypeId) completeStep('select-archetype');
    else if (currentStep.id === 'select-primary' && primaryId) completeStep('select-primary');
    else if (currentStep.id === 'select-secondary' && secondaryId) completeStep('select-secondary');
    else if (currentStep.id === 'export-import' && exportModalOpen) completeStep('export-import');
    else if (currentStep.id === 'help' && helpModalOpen) completeStep('help');
  }, [enabled, isComplete, currentStep, archetypeId, primaryId, secondaryId, exportModalOpen, helpModalOpen, completeStep]);

  // Find and track the target element's position
  const updatePosition = useCallback(() => {
    if (!currentStep) {
      setPosition(null);
      setVisible(false);
      return;
    }

    const target = document.querySelector(`[data-onboarding="${currentStep.id}"]`);
    if (!target) {
      setPosition(null);
      setVisible(false);
      return;
    }

    const rect = target.getBoundingClientRect();
    // Don't show if element is hidden or off-screen
    if (rect.width === 0 || rect.height === 0) {
      setVisible(false);
      return;
    }

    setPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    setVisible(true);
  }, [currentStep]);

  // Auto-skip steps whose target doesn't appear after a timeout.
  // Handles cases like power-toggle (no togglable powers) or at-mechanic (Tanker has none).
  const skipTimerRef = useRef<number>(0);
  useEffect(() => {
    if (!enabled || isComplete || !currentStep) return;
    // Only auto-skip steps that might not have a target
    const skippableSteps = ['power-toggle', 'at-mechanic', 'incarnate-slot'];
    if (!skippableSteps.includes(currentStep.id)) return;

    const { skipStep } = useOnboardingStore.getState();
    skipTimerRef.current = window.setTimeout(() => {
      const target = document.querySelector(`[data-onboarding="${currentStep.id}"]`);
      if (!target) skipStep();
    }, 3000);

    return () => clearTimeout(skipTimerRef.current);
  }, [enabled, isComplete, currentStep]);

  // Poll position with rAF for smooth tracking (handles scroll, resize, layout shifts)
  useEffect(() => {
    if (!enabled || isComplete || !currentStep) {
      setVisible(false);
      return;
    }

    let running = true;
    const tick = () => {
      if (!running) return;
      updatePosition();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, isComplete, currentStep, updatePosition]);

  // Hover detection via mouseenter/mouseleave on the actual target element.
  // Suppresses native title tooltips while the onboarding hint is showing.
  useEffect(() => {
    if (!enabled || isComplete || !currentStep) return;

    const target = document.querySelector(`[data-onboarding="${currentStep.id}"]`) as HTMLElement | null;
    if (!target) return;

    const savedTitles = new Map<HTMLElement, string>();

    const suppressTitles = (root: HTMLElement) => {
      // Suppress title on root and all children that have one
      const els = [root, ...Array.from(root.querySelectorAll<HTMLElement>('[title]'))];
      for (const el of els) {
        const t = el.getAttribute('title');
        if (t) {
          savedTitles.set(el, t);
          el.removeAttribute('title');
        }
      }
    };

    const restoreTitles = () => {
      for (const [el, t] of savedTitles) {
        el.setAttribute('title', t);
      }
      savedTitles.clear();
    };

    const enter = () => {
      suppressTitles(target);
      setHintVisible(true);
    };
    const leave = () => {
      restoreTitles();
      setHintVisible(false);
    };

    target.addEventListener('mouseenter', enter);
    target.addEventListener('mouseleave', leave);
    return () => {
      target.removeEventListener('mouseenter', enter);
      target.removeEventListener('mouseleave', leave);
      restoreTitles();
      setHintVisible(false);
    };
  }, [enabled, isComplete, currentStep]);

  // Document-level click listener for step completion
  useEffect(() => {
    if (!enabled || isComplete || !currentStep) return;
    // These steps are handled by store-based completion above
    const storeCompletedSteps = ['select-archetype', 'select-primary', 'select-secondary', 'export-import', 'help'];
    if (storeCompletedSteps.includes(currentStep.id)) return;

    const handler = (e: MouseEvent) => {
      const stepId = currentStep.id;
      // Walk up from click target to find a matching data-onboarding element
      let el = e.target as HTMLElement | null;
      while (el) {
        if (el.dataset?.onboarding === stepId) {
          // Small delay so the click's primary action fires first
          requestAnimationFrame(() => completeStep(stepId));
          return;
        }
        el = el.parentElement;
      }
    };

    // Use capture phase so we see the click before it might be stopped
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [enabled, isComplete, currentStep, completeStep]);


  // Clamp hint tooltip to viewport
  useEffect(() => {
    if (!hintVisible || !hintRef.current || !position) return;
    const hint = hintRef.current;
    const padding = 8;
    const vw = window.innerWidth;

    // Reset transform before measuring
    hint.style.transform = 'translateX(-50%)';
    const freshRect = hint.getBoundingClientRect();

    if (freshRect.right > vw - padding) {
      const offset = freshRect.right - vw + padding;
      hint.style.transform = `translateX(calc(-50% - ${offset}px))`;
    } else if (freshRect.left < padding) {
      const offset = padding - freshRect.left;
      hint.style.transform = `translateX(calc(-50% + ${offset}px))`;
    }
  }, [hintVisible, position]);

  if (!enabled || isComplete || !currentStep || !position || !visible || anyModalOpen) {
    return null;
  }

  // Diagnostic mode: append ?beacon-debug=1 to the URL to overlay coordinate values.
  // Helps chase down mobile alignment offsets without needing remote devtools.
  const debug = typeof window !== 'undefined' && window.location.search.includes('beacon-debug=1');
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;

  const beacon = (
    <div
      className="onboarding-beacon-container"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* Pulsing ring overlay — fully non-interactive */}
      <div
        className="onboarding-beacon-ring"
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: 6,
        }}
      />

      {/* Hint tooltip */}
      {hintVisible && (
        <div
          ref={hintRef}
          className="onboarding-hint"
          style={{
            position: 'absolute',
            top: position.height + 12,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="onboarding-hint-arrow" />
          <span>{currentStep.hint}</span>
        </div>
      )}
    </div>
  );

  const debugOverlay = debug ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 10,
        padding: 6,
        pointerEvents: 'none',
        lineHeight: 1.3,
      }}
    >
      <div>step: {currentStep.id}</div>
      <div>pos: {position.top.toFixed(1)},{position.left.toFixed(1)} {position.width.toFixed(1)}x{position.height.toFixed(1)}</div>
      <div>win: {window.innerWidth}x{window.innerHeight} dpr:{window.devicePixelRatio}</div>
      <div>vv: {vv ? `${vv.width.toFixed(0)}x${vv.height.toFixed(0)} off:${vv.offsetLeft.toFixed(1)},${vv.offsetTop.toFixed(1)} scale:${vv.scale.toFixed(2)}` : 'none'}</div>
      <div>scroll: {window.scrollX.toFixed(1)},{window.scrollY.toFixed(1)}</div>
    </div>
  ) : null;

  return createPortal(
    <>
      {beacon}
      {debugOverlay}
    </>,
    document.body
  );
}
