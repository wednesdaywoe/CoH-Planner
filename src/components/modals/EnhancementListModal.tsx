/**
 * EnhancementListModal — shopping list view of all enhancements in the build.
 *
 * Groups identical enhancements (by set + piece name) and shows counts,
 * plus totals for Catalysts (attuned) and Enhancement Boosters needed.
 */

import { useEffect, useMemo, useState } from 'react';
import { Modal, ModalBody } from './Modal';
import { useBuildStore } from '@/stores';
import type { Enhancement, IOSetEnhancement } from '@/types';
import { enhancementToRawIdentifier, fetchPrices, formatInf, type PriceRow } from '@/services/auctionPrices';
import { supabase } from '@/lib/supabase';

// This will enable live AH pricing in the Enhancement List modal.
const SHOW_AUCTION_PRICES = import.meta.env.VITE_SHOW_AUCTION_PRICES === 'true';

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
  /** Per-variant identifiers for auction lookup (null for un-priceable) */
  pricingVariants: Array<{ identifier: string; count: number }>;
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
        pricingVariants: [],
      };
      map.set(key, group);
    }
    group.count += 1;
    if (enh.attuned) group.attunedCount += 1;
    if (enh.boost) group.totalBoosts += enh.boost;

    const id = enhancementToRawIdentifier(enh);
    if (id) {
      const existing = group.pricingVariants.find(v => v.identifier === id);
      if (existing) existing.count += 1;
      else group.pricingVariants.push({ identifier: id, count: 1 });
    }
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
  const [prices, setPrices] = useState<Record<string, PriceRow | null>>({});
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState<string | null>(null);

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

  // Fetch auction prices when modal opens (and whenever the set of identifiers changes)
  const allIdentifiers = useMemo(() => {
    const ids = new Set<string>();
    for (const g of groups) {
      for (const v of g.pricingVariants) ids.add(v.identifier);
    }
    return [...ids];
  }, [groups]);

  useEffect(() => {
    if (!SHOW_AUCTION_PRICES || !isOpen || !supabase || allIdentifiers.length === 0) return;
    let cancelled = false;
    setPricesLoading(true);
    setPricesError(null);
    fetchPrices(allIdentifiers)
      .then(p => { if (!cancelled) setPrices(p); })
      .catch(err => { if (!cancelled) setPricesError(err instanceof Error ? err.message : String(err)); })
      .finally(() => { if (!cancelled) setPricesLoading(false); });
    return () => { cancelled = true; };
  }, [isOpen, allIdentifiers]);

  // Per-group remaining price and overall total (based on remaining, not total)
  const { groupPrice, remainingTotalPrice, totalPrice } = useMemo(() => {
    const groupPrice: Record<string, { full: number | null; remaining: number | null }> = {};
    let remainingTotalPrice = 0;
    let totalPrice = 0;
    let anyPriced = false;

    for (const g of groups) {
      const acq = Math.min(acquired[groupKey(g.setName, g.pieceName)] ?? 0, g.count);
      const remaining = g.count - acq;
      const remainRatio = g.count > 0 ? remaining / g.count : 0;

      let full = 0;
      let priced = false;
      for (const v of g.pricingVariants) {
        const row = prices[v.identifier];
        if (row?.avg_price != null) {
          full += row.avg_price * v.count;
          priced = true;
        }
      }
      if (priced) {
        anyPriced = true;
        groupPrice[groupKey(g.setName, g.pieceName)] = {
          full,
          remaining: Math.round(full * remainRatio),
        };
        totalPrice += full;
        remainingTotalPrice += Math.round(full * remainRatio);
      } else {
        groupPrice[groupKey(g.setName, g.pieceName)] = { full: null, remaining: null };
      }
    }
    return {
      groupPrice,
      remainingTotalPrice: anyPriced ? remainingTotalPrice : null,
      totalPrice: anyPriced ? totalPrice : null,
    };
  }, [groups, prices, acquired]);

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
                {SHOW_AUCTION_PRICES && supabase && (
                  <div title="Estimated influence based on recent auction house averages">
                    <span className="text-gray-400">Est. Inf:</span>{' '}
                    {pricesLoading && Object.keys(prices).length === 0 ? (
                      <span className="text-gray-500 italic">loading&hellip;</span>
                    ) : pricesError ? (
                      <span className="text-red-400 text-xs" title={pricesError}>price fetch failed</span>
                    ) : remainingTotalPrice != null ? (
                      <>
                        <span className="font-semibold text-cyan-400">{formatInf(remainingTotalPrice)}</span>
                        {remainingTotalPrice !== totalPrice && totalPrice != null && (
                          <span className="text-gray-500"> / {formatInf(totalPrice)}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </div>
                )}
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
                          {supabase && !isComplete && groupPrice[groupKey(g.setName, g.pieceName)]?.remaining != null && (
                            <span className="text-[10px] text-cyan-400 whitespace-nowrap font-mono">
                              {formatInf(groupPrice[groupKey(g.setName, g.pieceName)].remaining)}
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
