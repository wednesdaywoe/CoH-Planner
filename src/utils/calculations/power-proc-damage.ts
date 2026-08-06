/**
 * Slotted damage-proc contribution per cast — the single source for the
 * "+proc" damage shown on the DamageBlock and folded into the Attack Chain
 * builder's DPS. Extracted from DamageBlock so the two can't diverge.
 *
 * Proc damage is FLAT in CoH: it is NOT modified by damage IOs slotted in the
 * power, nor by damage-strength buffs (Fury/Build Up/Aim/Musculature). A proc
 * fires at its fixed scale-table value. Proc *chance* uses the power's base
 * recharge shrunk by its own slotted recharge and widened back out by the
 * build's global — `base × (1 + global) / (1 + global + local)`. Global alone
 * cancels, which is why the older reading "global recharge never affects PPM
 * rolls" held for as long as nobody slotted recharge in the power; once they do,
 * global softens the penalty. Measured 2026-08-02 (DATA-GAP-REGISTER PPM-2).
 */

import type { Enhancement, IOSetEnhancement } from '@/types';
import {
  findProcData,
  getProcEffects,
  calculateProcChance,
  interpolateProcDamage,
  resolveProcRollGeometry,
  powerFiresProcs,
} from '@/data';

export interface SlottedProcDamageInput {
  slots: (Enhancement | null)[];
  /** Base recharge (s) — the window is built from this plus both recharge terms. */
  baseRecharge: number;
  /** Raw cast/activation time (s) — NOT ArcanaTime. */
  castTime: number;
  /** AoE radius (ft); 0 for single-target. */
  radius: number;
  /** Cone arc already in DEGREES (callers convert from raw arc themselves). */
  arcDegrees: number;
  /** Local slotted recharge enhancement as a fraction (e.g. 0.95). */
  rechargeEnh: number;
  /** Build-wide recharge as a fraction. Bites only when `rechargeEnh` is non-zero,
   *  where it softens the penalty rather than adding one. Defaults to 0. */
  globalRechargeEnh?: number;
  /** Character level used to interpolate proc damage. */
  buildLevel: number;
  /** The power's `ProcMainTargetOnly` flag — when set, its procs roll
   *  single-target despite an AoE radius; see resolveProcRollGeometry. */
  procsOnlyOnMainTarget?: boolean;
  /** The power's `ProcAllowed` flag. `false` means no PPM proc rolls here at
   *  all, so the power adds no proc damage; see powerFiresProcs. */
  procsAllowed?: boolean;
}

/**
 * Sum of `chance × damage` over every slotted foe-damage proc in the power —
 * the expected proc damage added to one cast. Returns 0 when nothing procs.
 */
export function calculateSlottedProcDamagePerCast(input: SlottedProcDamageInput): number {
  const { slots, baseRecharge, castTime, radius, arcDegrees, rechargeEnh, buildLevel } = input;
  // ProcAllowed kNone (Fault, Spring Attack, every pet summon): the power's
  // recharge window is not a proc window, so a damage proc slotted here adds
  // nothing to this cast. Pet summons are the subtle case — the proc does reach
  // the pet via CopyBoosts, but what it deals there is pet damage fired on the
  // pet's schedule, not damage on this activation.
  if (!powerFiresProcs(input)) return 0;
  // In a main-target-only power every proc — damage or not — rolls
  // single-target: the AoE radius belongs to a secondary effect (the knockback
  // splash) that the proc never rolls against.
  const { radius: areaRadius, arcDegrees: areaArc } =
    resolveProcRollGeometry(input.procsOnlyOnMainTarget, radius, arcDegrees);
  let total = 0;
  for (const slot of slots) {
    if (!slot || slot.type !== 'io-set') continue;
    const io = slot as IOSetEnhancement;
    if (!io.isProc) continue;
    const procData = findProcData(io.name, io.setName);
    if (!procData || procData.ppm === null) continue;
    // A foe-damage proc is a Damage effect with a value..valueMax range (Build
    // Up's self-buff Damage carries a duration and no valueMax — excluded).
    const dmg = getProcEffects(procData).find(
      (e) => e.category === 'Damage' && e.value !== undefined && e.valueMax !== undefined,
    );
    if (!dmg || dmg.value === undefined || dmg.valueMax === undefined) continue;
    // Proc DAMAGE scales with the CHARACTER's (combat) level, never the slotted
    // IO's crafted level: a level-21 and a level-50 Touch of Lady Grey deal
    // identical damage on a level-50 character (the "slot the cheapest proc"
    // rule). The IO level governs enhancement *values* and exemplar floor, not
    // the proc payload. interpolateProcDamage clamps to the proc's own
    // levelRange. (@Redlynne report, 2026-06-12 — was using io.level for
    // non-attuned, so Global-IO-Level builds under-counted 10×.)
    const procDmg = interpolateProcDamage(dmg.value, dmg.valueMax, procData.levelRange, buildLevel);
    const procChance = calculateProcChance(procData.ppm, baseRecharge, castTime, areaRadius, areaArc, rechargeEnh, input.globalRechargeEnh ?? 0);
    total += procDmg * procChance;
  }
  return total;
}
