/**
 * EnhancementListModal — shopping list view of all enhancements in the build.
 *
 * Groups identical enhancements (by set + piece name) and shows counts,
 * plus totals for Catalysts (attuned) and Enhancement Boosters needed.
 */

import { useMemo, useState } from 'react';
import { Modal, ModalBody } from './Modal';
import { useBuildStore } from '@/stores';
import type { Enhancement, IOSetEnhancement } from '@/types';

interface EnhancementListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EnhancementGroup {
  /** Set name (e.g. "Mako's Bite", or "Generic" for non-set enhancements) */
  setName: string;
  /** Piece/enhancement display name */
  pieceName: string;
  /** Total count across the build */
  count: number;
  /** Number of attuned copies (each needs 1 Catalyst) */
  attunedCount: number;
  /** Total boost levels across all copies (each needs 1 Booster) */
  totalBoosts: number;
  /** For sorting: set + piece num */
  sortKey: string;
}

function collectEnhancements(build: ReturnType<typeof useBuildStore.getState>['build']): Enhancement[] {
  const all: Enhancement[] = [];
  const collectFromPower = (slots: (Enhancement | null)[] | undefined) => {
    if (!slots) return;
    for (const slot of slots) {
      if (slot) all.push(slot);
    }
  };
  build.primary.powers.forEach((p) => collectFromPower(p.slots));
  build.secondary.powers.forEach((p) => collectFromPower(p.slots));
  build.pools.forEach((pool) => pool.powers.forEach((p) => collectFromPower(p.slots)));
  if (build.epicPool) build.epicPool.powers.forEach((p) => collectFromPower(p.slots));
  build.inherents.forEach((p) => collectFromPower(p.slots));
  return all;
}

function buildGroups(enhancements: Enhancement[]): EnhancementGroup[] {
  const map = new Map<string, EnhancementGroup>();

  for (const enh of enhancements) {
    let setName: string;
    let pieceName: string;
    let sortKey: string;

    if (enh.type === 'io-set') {
      const io = enh as IOSetEnhancement;
      setName = io.setName;
      pieceName = io.name;
      sortKey = `${io.setName}\u0000${io.pieceNum.toString().padStart(2, '0')}`;
    } else if (enh.type === 'io-generic') {
      setName = 'Generic IOs';
      pieceName = enh.name;
      sortKey = `\u0001Generic\u0000${enh.name}`;
    } else if (enh.type === 'special') {
      const cat = enh.category.charAt(0).toUpperCase() + enh.category.slice(1);
      setName = `${cat} Origin`;
      pieceName = enh.name;
      sortKey = `\u0002${setName}\u0000${enh.name}`;
    } else {
      setName = `${enh.tier} Enhancements`;
      pieceName = enh.name;
      sortKey = `\u0003${setName}\u0000${enh.name}`;
    }

    const key = `${setName}\u0000${pieceName}`;
    let group = map.get(key);
    if (!group) {
      group = {
        setName,
        pieceName,
        count: 0,
        attunedCount: 0,
        totalBoosts: 0,
        sortKey,
      };
      map.set(key, group);
    }
    group.count += 1;
    if (enh.attuned) group.attunedCount += 1;
    if (enh.boost) group.totalBoosts += enh.boost;
  }

  return Array.from(map.values()).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}

function groupBySetName(groups: EnhancementGroup[]): Map<string, EnhancementGroup[]> {
  const bySet = new Map<string, EnhancementGroup[]>();
  for (const g of groups) {
    const list = bySet.get(g.setName);
    if (list) list.push(g);
    else bySet.set(g.setName, [g]);
  }
  return bySet;
}

function formatForClipboard(bySet: Map<string, EnhancementGroup[]>, totalCatalysts: number, totalBoosters: number): string {
  const lines: string[] = [];
  for (const [setName, groups] of bySet) {
    lines.push(setName);
    for (const g of groups) {
      let line = `  ${g.count}x ${g.pieceName}`;
      const extras: string[] = [];
      if (g.attunedCount > 0) extras.push(`${g.attunedCount} attuned`);
      if (g.totalBoosts > 0) extras.push(`${g.totalBoosts} booster${g.totalBoosts === 1 ? '' : 's'}`);
      if (extras.length > 0) line += ` (${extras.join(', ')})`;
      lines.push(line);
    }
    lines.push('');
  }
  lines.push(`Total Catalysts needed: ${totalCatalysts}`);
  lines.push(`Total Enhancement Boosters needed: ${totalBoosters}`);
  return lines.join('\n');
}

/** Build a stable key for a group used for tracking acquired counts */
function groupKey(setName: string, pieceName: string): string {
  return `${setName}\u0000${pieceName}`;
}

export function EnhancementListModal({ isOpen, onClose }: EnhancementListModalProps) {
  const build = useBuildStore((s) => s.build);
  const [copied, setCopied] = useState(false);
  // Tracks how many of each group have been "acquired" (clicked off).
  // Keyed by groupKey(setName, pieceName).
  const [acquired, setAcquired] = useState<Record<string, number>>({});

  const { bySet, groups, totalEnhancements, totalCatalysts, totalBoosters } = useMemo(() => {
    const enhancements = collectEnhancements(build);
    const groups = buildGroups(enhancements);
    const bySet = groupBySetName(groups);
    const totalCatalysts = groups.reduce((sum, g) => sum + g.attunedCount, 0);
    const totalBoosters = groups.reduce((sum, g) => sum + g.totalBoosts, 0);
    return {
      bySet,
      groups,
      totalEnhancements: enhancements.length,
      totalCatalysts,
      totalBoosters,
    };
  }, [build]);

  // Compute remaining catalysts/boosters proportionally based on remaining pieces.
  const { remainingCatalysts, remainingBoosters, remainingEnhancements } = useMemo(() => {
    let cats = 0, boosts = 0, count = 0;
    for (const g of groups) {
      const acq = Math.min(acquired[groupKey(g.setName, g.pieceName)] ?? 0, g.count);
      const remaining = g.count - acq;
      count += remaining;
      // Scale catalysts/boosters proportionally to remaining pieces in this group.
      if (g.count > 0) {
        cats += Math.round((g.attunedCount * remaining) / g.count);
        boosts += Math.round((g.totalBoosts * remaining) / g.count);
      }
    }
    return { remainingCatalysts: cats, remainingBoosters: boosts, remainingEnhancements: count };
  }, [groups, acquired]);

  const handleClickGroup = (setName: string, pieceName: string, count: number) => {
    const key = groupKey(setName, pieceName);
    setAcquired((prev) => {
      const current = Math.min(prev[key] ?? 0, count);
      // If everything is acquired, clicking resets to 0.
      // Otherwise, increment by 1 (decrease remaining by 1).
      const next = current >= count ? 0 : current + 1;
      return { ...prev, [key]: next };
    });
  };

  const handleResetAll = () => setAcquired({});

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatForClipboard(bySet, totalCatalysts, totalBoosters));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const allAcquired = remainingEnhancements === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Enhancement List (${remainingEnhancements}/${totalEnhancements})`} size="full">
      <ModalBody>
        {totalEnhancements === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No enhancements slotted in this build.</p>
        ) : (
          <>
            {/* Instructions */}
            <div className="text-[10px] text-gray-500 text-center mb-2">
              Click an item to mark one as acquired &middot; Click again at 0 to reset
            </div>

            {/* Totals + actions */}
            <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-700">
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Catalysts:</span>{' '}
                  <span className="font-semibold text-amber-400">{remainingCatalysts}</span>
                  {remainingCatalysts !== totalCatalysts && (
                    <span className="text-gray-500"> / {totalCatalysts}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-400">Boosters:</span>{' '}
                  <span className="font-semibold text-green-400">{remainingBoosters}</span>
                  {remainingBoosters !== totalBoosters && (
                    <span className="text-gray-500"> / {totalBoosters}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetAll}
                  disabled={remainingEnhancements === totalEnhancements}
                  className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {allAcquired && (
              <div className="text-xs text-emerald-400 text-center mb-2">
                All enhancements acquired! &#x2713;
              </div>
            )}

            {/* Grouped list */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {[...bySet.entries()].map(([setName, groups]) => (
                <div key={setName}>
                  <h3 className="text-sm font-semibold text-yellow-400 mb-1">{setName}</h3>
                  <ul className="space-y-0.5 ml-2">
                    {groups.map((g) => {
                      const acq = Math.min(acquired[groupKey(g.setName, g.pieceName)] ?? 0, g.count);
                      const remaining = g.count - acq;
                      const isComplete = remaining <= 0;
                      return (
                        <li
                          key={g.pieceName}
                          onClick={() => handleClickGroup(g.setName, g.pieceName, g.count)}
                          className={`flex items-baseline gap-2 text-sm rounded px-1 py-0.5 cursor-pointer select-none transition-colors ${
                            isComplete
                              ? 'text-gray-500 line-through opacity-50 hover:opacity-70'
                              : 'text-gray-300 hover:bg-gray-800/50'
                          }`}
                        >
                          <span className="font-mono w-10 text-right flex-shrink-0">
                            {isComplete ? '' : `${remaining}x`}
                            {!isComplete && acq > 0 && (
                              <span className="text-gray-500">/{g.count}</span>
                            )}
                          </span>
                          <span className="flex-1">{g.pieceName}</span>
                          {g.attunedCount > 0 && !isComplete && (
                            <span className="text-[10px] text-amber-400 whitespace-nowrap">
                              {g.attunedCount} attuned
                            </span>
                          )}
                          {g.totalBoosts > 0 && !isComplete && (
                            <span className="text-[10px] text-green-400 whitespace-nowrap">
                              +{g.totalBoosts} boost{g.totalBoosts === 1 ? '' : 's'}
                            </span>
                          )}
                          {isComplete && (
                            <span className="text-[10px] text-gray-600">&#x2713;</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
}
