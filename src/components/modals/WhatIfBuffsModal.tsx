/**
 * WhatIfBuffsModal — simulate the buffs a teammate is handing this build.
 *
 * The layer is a `Record<statKey, magnitude>` on the UI store, passed to the engine as
 * `combat.what_if_buffs` and injected into the accumulators BEFORE projection — the same
 * point the build's own globals land. That is what makes every archetype ceiling bind against
 * a simulated buff, and what lets a +ToHit what-if flip the fast-snipe form (which reads
 * `globalBonuses.toHit`). Scaling an already-projected number in a component would do neither.
 *
 * **No stat is named in this file.** The controls come from `whatIfVocabulary()` — the
 * engine's own answer about which `GlobalBonuses` fields it will accept — narrowed by
 * `whatIfControls` to the ones some `STAT_DEFINITIONS` entry renders. A stat the engine grows
 * arrives with no edit here; a stat no dashboard row shows never becomes a control that appears
 * to do something. The Attack Chain Builder offers the chain-moving subset from the same
 * derivation.
 */

import { useMemo } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import { whatIfVocabulary } from '@/engine/engine';
import { useEngineStore } from '@/engine/engineStore';
import { STAT_SECTIONS } from '@/data/core/stat-definitions';
import { whatIfControls, CATEGORY_LABELS } from './whatIfControls';
import { useWhatIfActive, WhatIfChip, WhatIfSliderRow } from './WhatIfChipPanel';

interface WhatIfBuffsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatIfBuffsModal({ isOpen, onClose }: WhatIfBuffsModalProps) {
  const whatIfBuffs = useUIStore((s) => s.whatIfBuffs);
  const setWhatIfBuff = useUIStore((s) => s.setWhatIfBuff);
  const clearWhatIfBuffs = useUIStore((s) => s.clearWhatIfBuffs);

  // `whatIfVocabulary()` is empty until the wasm dataset handle loads, and this component
  // mounts with the dashboard — before that. Gating on the engine store's loaded flag re-fires
  // the memo when the handle arrives; a bare `[]` here froze the boot-time empty answer forever.
  const serverId = useBuildStore((s) => s.build.serverId);
  const engineLoaded = useEngineStore((s) => s.loaded[serverId] ?? false);
  const controls = useMemo(
    () => (engineLoaded ? whatIfControls(whatIfVocabulary()) : []),
    [engineLoaded],
  );
  const grouped = useMemo(() => {
    return STAT_SECTIONS.map(({ category }) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      rows: controls.filter((c) => c.category === category),
    })).filter((g) => g.rows.length > 0);
  }, [controls]);

  const { activeStats, toggle, deactivateAll } = useWhatIfActive(whatIfBuffs, setWhatIfBuff);
  const activeControls = controls.filter((c) => activeStats.has(c.stat));

  const activeCount = Object.keys(whatIfBuffs).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What-if team buffs" size="lg">
      <ModalBody>
        <div className="mb-4 rounded border border-purple-500/40 bg-purple-500/10 px-3 py-2 text-xs leading-relaxed text-gray-300">
          These buffs are <span className="font-semibold text-purple-300">simulated</span>. They
          are injected as a teammate&apos;s real buff, and affect the build&apos;s globals
          before anything is projected. They are never saved or shared with the build, and they reset when you
          reload.
        </div>

        {controls.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">
            The engine is still loading — the controls will appear here in a moment.
          </div>
        ) : (
          <>
            {/* One row per ACTIVE chip — the sliders live here, not one per stat, so the
                modal stays the size of what's actually being simulated. */}
            {activeControls.length > 0 && (
              <section className="mb-4 space-y-1 rounded border border-gray-800 bg-gray-900/40 p-2">
                <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Simulated buffs
                </h3>
                {activeControls.map((control) => (
                  <WhatIfSliderRow
                    key={control.stat}
                    control={control}
                    value={whatIfBuffs[control.stat] ?? 0}
                    onChange={(v) => setWhatIfBuff(control.stat, v)}
                  />
                ))}
              </section>
            )}

            {grouped.map((group) => (
              <section key={group.category} className="mb-3">
                <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {group.rows.map((control) => (
                    <WhatIfChip
                      key={control.stat}
                      control={control}
                      active={activeStats.has(control.stat)}
                      value={whatIfBuffs[control.stat] ?? 0}
                      onToggle={() => toggle(control.stat)}
                    />
                  ))}
                </div>
              </section>
            ))}
            <p className="mt-1 text-[10px] text-gray-600">
              Tap a chip to add a slider for that buff; tap again to remove it.
            </p>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          variant="secondary"
          onClick={() => {
            clearWhatIfBuffs();
            deactivateAll();
          }}
          disabled={activeCount === 0 && activeStats.size === 0}
        >
          Clear all{activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
        <Button onClick={onClose}>Done</Button>
      </ModalFooter>
    </Modal>
  );
}
