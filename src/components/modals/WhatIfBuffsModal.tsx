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
import { useUIStore } from '@/stores';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import { whatIfVocabulary } from '@/engine/engine';
import { STAT_SECTIONS } from '@/data/core/stat-definitions';
import { whatIfControls, CATEGORY_LABELS } from './whatIfControls';

interface WhatIfBuffsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatIfBuffsModal({ isOpen, onClose }: WhatIfBuffsModalProps) {
  const whatIfBuffs = useUIStore((s) => s.whatIfBuffs);
  const setWhatIfBuff = useUIStore((s) => s.setWhatIfBuff);
  const clearWhatIfBuffs = useUIStore((s) => s.clearWhatIfBuffs);

  const controls = useMemo(() => whatIfControls(whatIfVocabulary()), []);
  const grouped = useMemo(() => {
    return STAT_SECTIONS.map(({ category }) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      rows: controls.filter((c) => c.category === category),
    })).filter((g) => g.rows.length > 0);
  }, [controls]);

  const activeCount = Object.keys(whatIfBuffs).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What-if team buffs" size="lg">
      <ModalBody>
        <div className="mb-4 rounded border border-purple-500/40 bg-purple-500/10 px-3 py-2 text-xs leading-relaxed text-gray-300">
          These buffs are <span className="font-semibold text-purple-300">simulated</span>. They
          are injected where a teammate&apos;s real buff would land — into the build&apos;s globals
          before anything is projected — so every archetype cap binds against them and every
          surface agrees. They are never saved or shared with the build, and they reset when you
          reload.
        </div>

        {controls.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">
            The engine is still loading — reopen this once the dashboard shows numbers.
          </div>
        ) : (
          grouped.map((group) => (
            <section key={group.category} className="mb-4">
              <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {group.label}
              </h3>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {group.rows.map((control) => {
                  const magnitude = whatIfBuffs[control.stat] ?? 0;
                  return (
                    <label
                      key={control.stat}
                      className={`flex items-center gap-2 rounded px-2 py-1 text-xs ${
                        magnitude !== 0 ? 'bg-purple-500/10 ring-1 ring-purple-500/40' : ''
                      }`}
                    >
                      <span className="flex-1 truncate" style={{ color: control.color }}>
                        {control.label}
                      </span>
                      <input
                        type="number"
                        step={5}
                        value={magnitude}
                        aria-label={`${control.label} what-if buff`}
                        onChange={(e) =>
                          setWhatIfBuff(control.stat, Number(e.target.value) || 0)
                        }
                        className="w-20 rounded border border-gray-700 bg-gray-900 px-1 py-0.5 text-right tabular-nums text-gray-200"
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={clearWhatIfBuffs} disabled={activeCount === 0}>
          Clear all{activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
        <Button onClick={onClose}>Done</Button>
      </ModalFooter>
    </Modal>
  );
}
