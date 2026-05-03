/**
 * EnhancementInfoContent - Shared component for rendering enhancement details
 * Used by both PowerInfoTooltip (floating tooltip) and InfoPanel (side panel)
 */

import { useBuildStore } from '@/stores';
import { useBonusTracking } from '@/hooks';
import { getIOSet, getPower, getPowerPool, findProcData, parseProcEffect, getProcEffectLabel, getProcEffectColor, isProcAlwaysOn, interpolateProcDamage, calculateProcChance, calculateProcsPerMinute, calculateProcDPS, calculateAutoToggleProcChance, calculateAutoToggleProcsPerMinute } from '@/data';
import {
  normalizeAspectName,
  getAspectSchedule,
  getIOValueAtLevel,
  normalizeStatName,
  getTotalBonusCount,
  isBonusCapped,
  BOOST_MULTIPLIER_PER_LEVEL,
  getMultiAspectModifier,
  getSetRarityMultiplier,
} from '@/utils/calculations';
import {
  IOSetIcon,
  GenericIOIcon,
  OriginEnhancementIcon,
  SpecialEnhancementIcon,
} from '@/components/enhancements/EnhancementIcon';
import type { IOSetEnhancement, GenericIOEnhancement, OriginEnhancement, SpecialEnhancement, Enhancement } from '@/types';

interface EnhancementInfoContentProps {
  powerName: string;
  slotIndex: number;
}

export function EnhancementInfoContent({ powerName, slotIndex }: EnhancementInfoContentProps) {
  const build = useBuildStore((s) => s.build);
  const bonusTracking = useBonusTracking();

  // Find the power and get the enhancement
  const findEnhancement = (): Enhancement | null => {
    // Check primary
    const primaryPower = build.primary.powers.find((p) => p.internalName === powerName);
    if (primaryPower && primaryPower.slots[slotIndex]) {
      return primaryPower.slots[slotIndex];
    }

    // Check secondary
    const secondaryPower = build.secondary.powers.find((p) => p.internalName === powerName);
    if (secondaryPower && secondaryPower.slots[slotIndex]) {
      return secondaryPower.slots[slotIndex];
    }

    // Check pools
    for (const pool of build.pools) {
      const poolPower = pool.powers.find((p) => p.internalName === powerName);
      if (poolPower && poolPower.slots[slotIndex]) {
        return poolPower.slots[slotIndex];
      }
    }

    // Check epic pool
    if (build.epicPool) {
      const epicPower = build.epicPool.powers.find((p) => p.internalName === powerName);
      if (epicPower && epicPower.slots[slotIndex]) {
        return epicPower.slots[slotIndex];
      }
    }

    // Check inherent powers (Fitness, Basic, Prestige)
    const inherentPower = build.inherents.find((p) => p.internalName === powerName);
    if (inherentPower && inherentPower.slots[slotIndex]) {
      return inherentPower.slots[slotIndex];
    }

    return null;
  };

  // Count how many pieces of a set are slotted in this power
  const countSetPiecesInPower = (setId: string): number => {
    const findPower = () => {
      const primary = build.primary.powers.find((p) => p.internalName === powerName);
      if (primary) return primary;
      const secondary = build.secondary.powers.find((p) => p.internalName === powerName);
      if (secondary) return secondary;
      for (const pool of build.pools) {
        const poolPower = pool.powers.find((p) => p.internalName === powerName);
        if (poolPower) return poolPower;
      }
      if (build.epicPool) {
        const epicPower = build.epicPool.powers.find((p) => p.internalName === powerName);
        if (epicPower) return epicPower;
      }
      // Check inherent powers (Fitness, Basic, Prestige)
      const inherentPower = build.inherents.find((p) => p.internalName === powerName);
      if (inherentPower) return inherentPower;
      return null;
    };

    const power = findPower();
    if (!power) return 0;

    return power.slots.filter(
      (s) => s && s.type === 'io-set' && (s as IOSetEnhancement).setId === setId
    ).length;
  };

  const enhancement = findEnhancement();

  if (!enhancement) {
    return <div className="text-slate-500 text-[10px]">No enhancement</div>;
  }

  // IO Set Enhancement
  if (enhancement.type === 'io-set') {
    const ioEnh = enhancement as IOSetEnhancement;
    const ioSet = getIOSet(ioEnh.setId);
    const piecesSlotted = countSetPiecesInPower(ioEnh.setId);
    // Use set data icon (authoritative) with fallback to stored icon
    const rawIcon = ioSet?.icon || ioEnh.icon || 'Unknown.png';
    const iconName = rawIcon.includes('/')
      ? rawIcon.split('/').pop() || 'Unknown.png'
      : rawIcon;

    // Calculate enhancement values for each aspect.
    // Both attuned and non-attuned cap at the set's maxLevel — only ATOs / event IOs
    // (maxLevel <= 1) scale freely above their listed cap. Mirrors the calc engine
    // in enhancement-values.ts so the displayed value matches the actual contribution
    // (e.g. attuned Kinetic Combat caps at L35, not character level).
    const setMax = ioSet?.maxLevel ?? 50;
    const setMin = ioSet?.minLevel ?? 1;
    const effectiveLevel = ioEnh.attuned
      ? Math.max(setMin, setMax > 1 ? Math.min(build.level || 50, setMax) : (build.level || 50))
      : (enhancement.level || 50);
    const rawAspectCount = ioEnh.aspects.filter(a => normalizeAspectName(a) !== null).length || ioEnh.aspects.length;
    // Proc effects count as 3 additional aspects for the multi-aspect modifier
    const effectiveAspectCount = ioEnh.isProc ? rawAspectCount + 3 : rawAspectCount;
    const aspectModifier = getMultiAspectModifier(effectiveAspectCount);
    // Purple and Superior sets get 25% higher enhancement values
    const rarityMultiplier = getSetRarityMultiplier(ioSet?.category, ioSet?.name);

    const boostMultiplier = 1 + (enhancement.boost || 0) * BOOST_MULTIPLIER_PER_LEVEL;

    const calculateAspectValue = (aspect: string): number | null => {
      const normalized = normalizeAspectName(aspect);
      if (!normalized) return null;
      const schedule = getAspectSchedule(normalized);
      const baseValue = getIOValueAtLevel(effectiveLevel, schedule);
      return baseValue * aspectModifier * rarityMultiplier * boostMultiplier;
    };

    return (
      <div className="space-y-2 max-w-[320px]">
        {/* Enhancement header with set name */}
        <div className="flex items-center gap-2">
          <IOSetIcon
            icon={iconName}
            attuned={ioEnh.attuned}
            category={ioSet?.category}
            size={28}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-yellow-400 leading-tight">
              {ioEnh.setName}
              {ioSet && <span className="text-yellow-600 font-normal ml-1">({ioEnh.pieceNum}/{ioSet.pieces.length})</span>}
            </h3>
            <span className="text-[10px] text-blue-400">{enhancement.name}</span>
          </div>
        </div>

        {/* Proc Effect section - shown for proc enhancements */}
        {ioEnh.isProc ? (
          <div className="bg-amber-900/30 border border-amber-700/50 rounded p-1.5">
            <div className="text-[9px] text-amber-400 uppercase mb-1 font-semibold">Proc Effect</div>
            {/* Look up detailed proc data */}
            {(() => {
              const procData = findProcData(enhancement.name, ioEnh.setName);

              if (procData) {
                // Parse the mechanics into structured effect data
                const effect = parseProcEffect(procData.mechanics);
                const effectColorClass = getProcEffectColor(effect.category);
                const categoryLabel = getProcEffectLabel(effect.category);
                const isAlwaysOn = isProcAlwaysOn(procData);

                // Get category-specific badge colors
                const BADGE_COLORS: Record<string, string> = {
                  'Damage': 'bg-red-900/50 text-red-300',
                  'Endurance': 'bg-blue-900/50 text-blue-300',
                  'Heal': 'bg-emerald-900/50 text-emerald-300',
                  'Absorb': 'bg-cyan-900/50 text-cyan-300',
                  'Resistance': 'bg-orange-900/50 text-orange-300',
                  'Defense': 'bg-purple-900/50 text-purple-300',
                  'ToHit': 'bg-yellow-900/50 text-yellow-300',
                  'Regeneration': 'bg-green-900/50 text-green-300',
                  'Recovery': 'bg-blue-900/50 text-blue-300',
                  'Recharge': 'bg-amber-900/50 text-amber-300',
                  'RunSpeed': 'bg-teal-900/50 text-teal-300',
                  'MaxHP': 'bg-pink-900/50 text-pink-300',
                  'KnockbackProtection': 'bg-slate-700 text-slate-300',
                  'Stealth': 'bg-gray-700 text-gray-300',
                  'Control': 'bg-indigo-900/50 text-indigo-300',
                  'Debuff': 'bg-rose-900/50 text-rose-300',
                  'Special': 'bg-slate-700 text-slate-300',
                };
                const badgeColors = BADGE_COLORS[effect.category] || 'bg-slate-700 text-slate-300';
                const secondaryBadgeColors = effect.secondaryCategory
                  ? BADGE_COLORS[effect.secondaryCategory] || 'bg-slate-700 text-slate-300'
                  : undefined;

                return (
                  <div className="space-y-1">
                    {/* Effect name and category */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-medium ${effectColorClass}`}>
                        {procData.ioName}
                      </span>
                      <span className={`text-[8px] px-1 py-0.5 rounded ${badgeColors}`}>
                        {categoryLabel}
                      </span>
                      {effect.secondaryCategory && secondaryBadgeColors && (
                        <span className={`text-[8px] px-1 py-0.5 rounded ${secondaryBadgeColors}`}>
                          {getProcEffectLabel(effect.secondaryCategory)}
                        </span>
                      )}
                      {isAlwaysOn && (
                        <span className="text-[8px] px-1 py-0.5 rounded bg-green-900/50 text-green-300">
                          Always On
                        </span>
                      )}
                    </div>

                    {/* Detailed mechanics */}
                    <div className="text-[9px] text-slate-300 bg-slate-800/50 rounded px-1.5 py-1">
                      {procData.mechanics}
                    </div>

                    {/* Effect details based on category */}
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]">
                      {procData.ppm !== null && (
                        <div>
                          <span className="text-slate-500">PPM:</span>
                          <span className="text-amber-300 ml-1 font-medium">{procData.ppm}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-500">Type:</span>
                        <span className={`ml-1 ${
                          procData.type === 'Proc120s' ? 'text-purple-400' :
                          procData.type === 'Global' ? 'text-green-400' :
                          'text-amber-300'
                        }`}>
                          {procData.type === 'Proc120s' ? '100% (120s)' : procData.type}
                        </span>
                      </div>
                      {/* Show parsed effect values */}
                      {effect.value !== undefined && effect.category === 'Damage' && effect.valueMax && (
                        <div>
                          <span className="text-slate-500">Dmg:</span>
                          <span className="text-red-400 ml-1">
                            {interpolateProcDamage(effect.value, effect.valueMax, procData.levelRange, effectiveLevel)} {effect.effectType}
                          </span>
                        </div>
                      )}
                      {effect.value !== undefined && effect.category !== 'Damage' && (
                        <div>
                          <span className="text-slate-500">Value:</span>
                          <span className={`${effectColorClass} ml-1`}>
                            {effect.category === 'KnockbackProtection' ? `Mag ${effect.value}` :
                             effect.category === 'Stealth' ? `${effect.value} ft` :
                             `${effect.value}%`}
                            {effect.effectType ? ` ${effect.effectType}` : ''}
                          </span>
                        </div>
                      )}
                      {effect.duration && (
                        <div>
                          <span className="text-slate-500">Dur:</span>
                          <span className="text-cyan-300 ml-1">{effect.duration}s</span>
                        </div>
                      )}
                      {/* Secondary effect (for combined procs like Numina's, Panacea) */}
                      {effect.secondaryCategory && effect.secondaryValue !== undefined && (
                        <div>
                          <span className="text-slate-500">+{getProcEffectLabel(effect.secondaryCategory)}:</span>
                          <span className={`${getProcEffectColor(effect.secondaryCategory)} ml-1`}>
                            {effect.secondaryValue}%
                            {effect.secondaryEffectType ? ` ${effect.secondaryEffectType}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PPM Calculation - show for PPM-based procs */}
                    {procData.ppm !== null && (() => {
                      // Find the power this enhancement is slotted in
                      const findPowerData = () => {
                        // Check primary
                        const primaryPower = build.primary.powers.find((p) => p.internalName === powerName);
                        if (primaryPower && build.primary.id) {
                          const basePower = getPower(build.primary.id, powerName);
                          return { selected: primaryPower, base: basePower };
                        }
                        // Check secondary
                        const secondaryPower = build.secondary.powers.find((p) => p.internalName === powerName);
                        if (secondaryPower && build.secondary.id) {
                          const basePower = getPower(build.secondary.id, powerName);
                          return { selected: secondaryPower, base: basePower };
                        }
                        // Check pools
                        for (const pool of build.pools) {
                          const poolPower = pool.powers.find((p) => p.internalName === powerName);
                          if (poolPower) {
                            const poolData = getPowerPool(pool.id);
                            const basePower = poolData?.powers.find((p) => p.internalName === powerName);
                            return { selected: poolPower, base: basePower };
                          }
                        }
                        // Check inherents
                        const inherentPower = build.inherents.find((p) => p.internalName === powerName);
                        if (inherentPower) {
                          return { selected: inherentPower, base: null };
                        }
                        return null;
                      };

                      const powerData = findPowerData();
                      if (!powerData) return null;

                      const { selected, base } = powerData;
                      const powerType = selected.powerType?.toLowerCase() || base?.powerType?.toLowerCase() || 'click';
                      const isAutoOrToggle = powerType === 'auto' || powerType === 'toggle';

                      // For Auto/Toggle powers, use special calculation
                      if (isAutoOrToggle) {
                        const procChance = calculateAutoToggleProcChance(procData.ppm);
                        const procsPerMin = calculateAutoToggleProcsPerMinute(procData.ppm);

                        return (
                          <div className="mt-1 pt-1 border-t border-amber-700/30">
                            <div className="text-[8px] text-amber-400/70 uppercase mb-0.5">PPM Calculation ({powerType})</div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]">
                              <div>
                                <span className="text-slate-500">Chance/tick:</span>
                                <span className="text-amber-300 ml-1">{(procChance * 100).toFixed(1)}%</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Procs/min:</span>
                                <span className="text-green-400 ml-1">{procsPerMin.toFixed(2)}</span>
                              </div>
                              {effect.category === 'Damage' && effect.value !== undefined && effect.valueMax !== undefined && (
                                <div>
                                  <span className="text-slate-500">DPS:</span>
                                  <span className="text-red-400 ml-1">
                                    {((procsPerMin * interpolateProcDamage(effect.value, effect.valueMax, procData.levelRange, effectiveLevel)) / 60).toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {/* Endurance per second for endurance procs */}
                              {effect.category === 'Endurance' && effect.value !== undefined && (
                                <div>
                                  <span className="text-slate-500">End/sec:</span>
                                  <span className="text-blue-400 ml-1">
                                    {((procsPerMin * effect.value) / 60).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {/* HP per second for heal procs */}
                              {effect.category === 'Heal' && effect.value !== undefined && (
                                <div>
                                  <span className="text-slate-500">HP%/sec:</span>
                                  <span className="text-green-400 ml-1">
                                    {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                  </span>
                                </div>
                              )}
                              {/* Recovery rate for recovery procs */}
                              {effect.category === 'Recovery' && effect.value !== undefined && (
                                <div>
                                  <span className="text-slate-500">Rec%/sec:</span>
                                  <span className="text-blue-300 ml-1">
                                    {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                  </span>
                                </div>
                              )}
                              {/* Regen rate for regeneration procs */}
                              {effect.category === 'Regeneration' && effect.value !== undefined && (
                                <div>
                                  <span className="text-slate-500">Regen%/sec:</span>
                                  <span className="text-green-300 ml-1">
                                    {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-[7px] text-slate-500 mt-0.5 italic">
                              Auto/Toggle: 10s pseudo-recharge, 6 checks/min
                            </div>
                          </div>
                        );
                      }

                      // For Click powers, need recharge and cast time
                      const recharge = base?.effects?.recharge || selected.effects?.recharge || 0;
                      const castTime = base?.effects?.castTime || selected.effects?.castTime || 1;
                      const radius = base?.effects?.radius || selected.effects?.radius || 0;

                      if (recharge <= 0) return null; // Can't calculate without recharge

                      const procChance = calculateProcChance(procData.ppm, recharge, castTime, radius);
                      const procsPerMin = calculateProcsPerMinute(procData.ppm, recharge, castTime, radius, 0);

                      return (
                        <div className="mt-1 pt-1 border-t border-amber-700/30">
                          <div className="text-[8px] text-amber-400/70 uppercase mb-0.5">PPM Calculation</div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]">
                            <div>
                              <span className="text-slate-500">Chance:</span>
                              <span className="text-amber-300 ml-1">{(procChance * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Procs/min:</span>
                              <span className="text-green-400 ml-1">{procsPerMin.toFixed(2)}</span>
                            </div>
                            {effect.category === 'Damage' && effect.value !== undefined && effect.valueMax !== undefined && (() => {
                              const dmgAtLevel = interpolateProcDamage(effect.value, effect.valueMax, procData.levelRange, effectiveLevel);
                              return (
                                <div>
                                  <span className="text-slate-500">DPS:</span>
                                  <span className="text-red-400 ml-1">
                                    {calculateProcDPS(procData.ppm, dmgAtLevel, dmgAtLevel, recharge, castTime, radius, 0).toFixed(1)}
                                  </span>
                                </div>
                              );
                            })()}
                            {/* Endurance per second for endurance procs */}
                            {effect.category === 'Endurance' && effect.value !== undefined && (
                              <div>
                                <span className="text-slate-500">End/sec:</span>
                                <span className="text-blue-400 ml-1">
                                  {((procsPerMin * effect.value) / 60).toFixed(2)}
                                </span>
                              </div>
                            )}
                            {/* HP per second for heal procs */}
                            {effect.category === 'Heal' && effect.value !== undefined && (
                              <div>
                                <span className="text-slate-500">HP%/sec:</span>
                                <span className="text-green-400 ml-1">
                                  {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                </span>
                              </div>
                            )}
                            {/* Recovery rate for recovery procs */}
                            {effect.category === 'Recovery' && effect.value !== undefined && (
                              <div>
                                <span className="text-slate-500">Rec%/sec:</span>
                                <span className="text-blue-300 ml-1">
                                  {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                </span>
                              </div>
                            )}
                            {/* Regen rate for regeneration procs */}
                            {effect.category === 'Regeneration' && effect.value !== undefined && (
                              <div>
                                <span className="text-slate-500">Regen%/sec:</span>
                                <span className="text-green-300 ml-1">
                                  {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-[7px] text-slate-500 mt-0.5 italic">
                            Base: {recharge.toFixed(1)}s rech, {castTime.toFixed(2)}s cast{radius > 0 ? `, ${radius}ft AoE` : ''}
                          </div>
                        </div>
                      );
                    })()}

                    {/* PvP notes if any */}
                    {procData.pvpNotes && (
                      <div className="text-[8px] text-orange-400/80">
                        PvP: {procData.pvpNotes}
                      </div>
                    )}
                  </div>
                );
              } else {
                // Fallback to basic display if no proc data found
                const name = enhancement.name.toLowerCase();
                let effectText = enhancement.name;
                if (name.includes('chance for')) {
                  effectText = enhancement.name.replace(/^Chance for /i, '');
                } else if (name.includes('chance to')) {
                  effectText = enhancement.name.replace(/^Chance to /i, '');
                }

                return (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-200">{effectText}</span>
                    </div>
                    <div className="text-[8px] text-slate-500 mt-1 italic">
                      Proc effects trigger based on PPM (Procs Per Minute) formula
                    </div>
                  </>
                );
              }
            })()}
          </div>
        ) : (
          /* Enhances section with calculated values - for non-proc enhancements */
          <div className="bg-slate-800/50 rounded p-1.5">
            <div className="text-[10px] text-slate-400 uppercase mb-1 font-medium">Enhances:</div>
            {ioEnh.aspects.map((aspect, i) => {
              const value = calculateAspectValue(aspect);
              return (
                <div key={i} className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-200">{aspect}</span>
                  {value !== null && (
                    <span className="text-green-400 font-mono">
                      +{(value * 100).toFixed(2)}%
                    </span>
                  )}
                </div>
              );
            })}
            {effectiveAspectCount > 1 && (
              <div className="text-[10px] text-slate-400 mt-1 italic">
                {(aspectModifier * 100).toFixed(1)}% per aspect ({rawAspectCount} aspect{rawAspectCount !== 1 ? 's' : ''}{ioEnh.isProc ? ' + proc' : ''})
              </div>
            )}
          </div>
        )}

        {/* Level and flags */}
        <div className="text-[10px] flex gap-3">
          <span className="text-slate-400">
            {ioEnh.attuned ? (
              <span className="text-purple-400">Attuned (scales to Lvl {build.level})</span>
            ) : (
              <>Level: <span className="text-slate-200">{enhancement.level}</span></>
            )}
          </span>
          {ioEnh.isUnique && (
            <span className="text-red-400">Unique</span>
          )}
          {enhancement.boost && enhancement.boost > 0 && (
            <span className="text-green-400">+{enhancement.boost} Boosted</span>
          )}
        </div>

        {/* Set Bonuses */}
        {ioSet && ioSet.bonuses.length > 0 && (() => {
          const hasPvPEffects = ioSet.category === 'pvp' && ioSet.bonuses.some(b => b.effects.some(e => e.pvp));
          return (
            <div className="border-t border-slate-700 pt-2">
              <div className="text-[10px] text-slate-400 uppercase mb-1 font-medium">
                Set Bonuses ({piecesSlotted}/{ioSet.pieces.length} slotted)
              </div>
              <div className="space-y-0.5">
                {ioSet.bonuses.map((bonus, idx) => {
                  const pveEffects = hasPvPEffects ? bonus.effects.filter(e => !e.pvp) : bonus.effects;
                  if (pveEffects.length === 0) return null;
                  const isActive = piecesSlotted >= bonus.pieces;
                  return (
                    <div
                      key={idx}
                      className={`text-xs ${isActive ? 'text-green-400' : 'text-slate-400'}`}
                    >
                      <span className={`font-medium ${isActive ? 'text-green-500' : 'text-slate-500'}`}>
                        {bonus.pieces}pc:
                      </span>{' '}
                      {pveEffects.map((eff, i) => {
                        const normalized = isActive ? normalizeStatName(eff.stat) : null;
                        const totalCount = normalized ? getTotalBonusCount(bonusTracking, normalized, eff.value) : 0;
                        const capped = normalized ? isBonusCapped(bonusTracking, normalized, eff.value) : false;
                        const displayValue = parseFloat(eff.value.toFixed(2));
                        const formatted = eff.desc.replace(/^\+[\d.]+%/, `+${displayValue}%`);
                        return (
                          <span key={i} className={capped ? 'text-orange-400' : ''}>
                            {i > 0 && ', '}
                            {formatted}
                            {isActive && totalCount > 0 && (
                              <span className={`ml-0.5 text-[10px] ${capped ? 'text-orange-400 font-semibold' : 'text-slate-400'}`}>
                                ({totalCount}/5)
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              {hasPvPEffects && (
                <>
                  <div className="text-[10px] text-red-400 uppercase mt-2 mb-0.5 font-medium">PvP Only</div>
                  <div className="space-y-0.5">
                    {ioSet.bonuses.map((bonus, idx) => {
                      const pvpEffects = bonus.effects.filter(e => e.pvp);
                      if (pvpEffects.length === 0) return null;
                      const isActive = piecesSlotted >= bonus.pieces;
                      return (
                        <div
                          key={idx}
                          className={`text-xs ${isActive ? 'text-red-300' : 'text-slate-500'}`}
                        >
                          <span className={`font-medium ${isActive ? 'text-red-400' : 'text-slate-600'}`}>
                            {bonus.pieces}pc:
                          </span>{' '}
                          {pvpEffects.map((eff, i) => (
                            <span key={i}>
                              {i > 0 && ', '}
                              {eff.desc}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </div>
    );
  }

  // Generic IO Enhancement
  if (enhancement.type === 'io-generic') {
    const genericEnh = enhancement as GenericIOEnhancement;
    return (
      <div className="space-y-1.5 max-w-[250px]">
        <div className="flex items-center gap-2">
          <GenericIOIcon
            stat={genericEnh.stat}
            size={24}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-blue-400 leading-tight">{enhancement.name}</h3>
            <span className="text-[9px] text-slate-400">Generic IO</span>
          </div>
        </div>
        <div className="text-[10px]">
          <span className="text-slate-400">Enhances: </span>
          <span className="text-green-400">{genericEnh.stat}</span>
          <span className="text-slate-400"> by </span>
          <span className="text-green-400">
            {(genericEnh.value * (1 + (enhancement.boost || 0) * BOOST_MULTIPLIER_PER_LEVEL)).toFixed(1)}%
          </span>
        </div>
        <div className="text-[10px] flex gap-3">
          {enhancement.level && (
            <span className="text-slate-400">
              Level: <span className="text-slate-200">{enhancement.level}</span>
            </span>
          )}
          {enhancement.boost && enhancement.boost > 0 && (
            <span className="text-green-400">+{enhancement.boost} Boosted</span>
          )}
        </div>
      </div>
    );
  }

  // Origin Enhancement (SO/DO/TO)
  if (enhancement.type === 'origin') {
    const originEnh = enhancement as OriginEnhancement;
    return (
      <div className="space-y-1.5 max-w-[250px]">
        <div className="flex items-center gap-2">
          <OriginEnhancementIcon
            stat={originEnh.stat}
            tier={originEnh.tier}
            origin={originEnh.origin}
            size={24}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-blue-400 leading-tight">{enhancement.name}</h3>
            <span className="text-[9px] text-slate-400">{originEnh.tier}</span>
          </div>
        </div>
        <div className="text-[10px]">
          <span className="text-slate-400">Enhances: </span>
          <span className="text-green-400">{originEnh.stat}</span>
          <span className="text-slate-400"> by </span>
          <span className="text-green-400">
            {(originEnh.value * (1 + (enhancement.boost || 0) * BOOST_MULTIPLIER_PER_LEVEL)).toFixed(1)}%
          </span>
        </div>
        {enhancement.boost && enhancement.boost > 0 && (
          <div className="text-[10px] text-green-400">+{enhancement.boost} Boosted</div>
        )}
      </div>
    );
  }

  // Special Enhancement (Hamidon, etc.)
  if (enhancement.type === 'special') {
    const specialEnh = enhancement as SpecialEnhancement;
    // Extract icon filename from the full path if needed
    const iconName = specialEnh.icon?.includes('/')
      ? specialEnh.icon.split('/').pop() || 'Unknown.png'
      : specialEnh.icon || 'Unknown.png';

    return (
      <div className="space-y-1.5 max-w-[250px]">
        <div className="flex items-center gap-2">
          <SpecialEnhancementIcon
            icon={iconName}
            size={24}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-purple-400 leading-tight">{enhancement.name}</h3>
            <span className="text-[9px] text-slate-400 capitalize">{specialEnh.category}</span>
          </div>
        </div>
        <div className="text-[10px]">
          <span className="text-slate-400">Enhances: </span>
          <span className="text-green-400">
            {specialEnh.aspects.map(a => {
              const boosted = a.value * (1 + (enhancement.boost || 0) * BOOST_MULTIPLIER_PER_LEVEL);
              return `${a.stat} +${boosted.toFixed(1)}%`;
            }).join(', ')}
          </span>
        </div>
        {enhancement.boost && enhancement.boost > 0 && (
          <div className="text-[10px] text-green-400">+{enhancement.boost} Boosted</div>
        )}
      </div>
    );
  }

  return <div className="text-slate-500 text-[10px]">Unknown enhancement type</div>;
}
