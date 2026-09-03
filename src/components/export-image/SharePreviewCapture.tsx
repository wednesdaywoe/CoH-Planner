/**
 * Always-mounted, invisible off-screen render of the current build's
 * BuildPreviewCard, kept in sync with live build state so `shareBuild()`
 * (a plain service module, no hooks) can grab a fresh social-preview PNG at
 * share time via `capturePreviewPng()` — see `preview-capture.ts`.
 *
 * Mount once near the root of the authenticated planner view (StatsDashboard),
 * unconditionally — unlike BuildImageModal's identical off-screen technique,
 * this isn't gated by a modal's `isOpen`, since a share can happen at any time.
 */

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { useCalculatedStats, useCharacterCalculation } from '@/hooks';
import { getBaselineHealth } from '@/utils/calculations/stats';
import { computeAllStats } from '@/utils/detailed-totals';
import { getDefenseSoftcap } from '@/data/purple-patch';
import { BuildPreviewCard } from './BuildPreviewCard';
import { registerPreviewCaptureNode } from '@/utils/preview-capture';

export function SharePreviewCapture() {
  const build = useBuildStore((s) => s.build);
  const targetLevelOffset = useUIStore((s) => s.targetLevelOffset);
  const contentMode = useUIStore((s) => s.contentMode);
  const rechargeMidsStyle = useUIStore((s) => s.rechargeMidsStyle);
  const defenseSoftcap = getDefenseSoftcap(targetLevelOffset, contentMode);

  const stats = useCalculatedStats();
  const calcResult = useCharacterCalculation();

  const allStats = useMemo(() => {
    const h = getBaselineHealth(build.archetype?.id ?? undefined, build.level);
    return computeAllStats(
      stats,
      calcResult.globalBonuses,
      calcResult.breakdown,
      h.baseHealth,
      h.maxHealth,
      build.archetype?.id ?? undefined,
      rechargeMidsStyle,
      defenseSoftcap,
    );
  }, [stats, calcResult, build.archetype?.id, build.level, rechargeMidsStyle, defenseSoftcap]);

  const nodeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerPreviewCaptureNode(nodeRef.current);
    return () => registerPreviewCaptureNode(null);
  });

  return (
    <div aria-hidden style={{ position: 'fixed', left: -100000, top: 0, pointerEvents: 'none', opacity: 0 }}>
      <div ref={nodeRef}>
        <BuildPreviewCard build={build} allStats={allStats} netEndPerSec={calcResult.globalBonuses.netEndPerSec ?? 0} />
      </div>
    </div>
  );
}
