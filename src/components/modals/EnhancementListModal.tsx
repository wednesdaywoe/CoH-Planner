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

export function EnhancementListModal({ isOpen, onClose }: EnhancementListModalProps) {
  const build = useBuildStore((s) => s.build);
  const [copied, setCopied] = useState(false);

  const { bySet, totalEnhancements, totalCatalysts, totalBoosters } = useMemo(() => {
    const enhancements = collectEnhancements(build);
    const groups = buildGroups(enhancements);
    const bySet = groupBySetName(groups);
    const totalCatalysts = groups.reduce((sum, g) => sum + g.attunedCount, 0);
    const totalBoosters = groups.reduce((sum, g) => sum + g.totalBoosts, 0);
    return {
      bySet,
      totalEnhancements: enhancements.length,
      totalCatalysts,
      totalBoosters,
    };
  }, [build]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatForClipboard(bySet, totalCatalysts, totalBoosters));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Enhancement List (${totalEnhancements})`} size="full">
      <ModalBody>
        {totalEnhancements === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No enhancements slotted in this build.</p>
        ) : (
          <>
            {/* Totals + copy */}
            <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-700">
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Catalysts:</span>{' '}
                  <span className="font-semibold text-amber-400">{totalCatalysts}</span>
                </div>
                <div>
                  <span className="text-gray-400">Boosters:</span>{' '}
                  <span className="font-semibold text-green-400">{totalBoosters}</span>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>

            {/* Grouped list */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {[...bySet.entries()].map(([setName, groups]) => (
                <div key={setName}>
                  <h3 className="text-sm font-semibold text-yellow-400 mb-1">{setName}</h3>
                  <ul className="space-y-0.5 ml-2">
                    {groups.map((g) => (
                      <li key={g.pieceName} className="flex items-baseline gap-2 text-sm text-gray-300">
                        <span className="text-gray-500 font-mono w-6 text-right flex-shrink-0">{g.count}x</span>
                        <span className="flex-1">{g.pieceName}</span>
                        {g.attunedCount > 0 && (
                          <span className="text-[10px] text-amber-400 whitespace-nowrap">
                            {g.attunedCount} attuned
                          </span>
                        )}
                        {g.totalBoosts > 0 && (
                          <span className="text-[10px] text-green-400 whitespace-nowrap">
                            +{g.totalBoosts} boost{g.totalBoosts === 1 ? '' : 's'}
                          </span>
                        )}
                      </li>
                    ))}
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
