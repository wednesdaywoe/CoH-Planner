/**
 * PowerInfoBlocks — TagsBlock + GeneralStatsBlock.
 *
 * The metadata sections of the InfoPanel redesign. Both render compact
 * key/value rows. TagsBlock shows the power's identity (Power Type /
 * Target Type / Allowed Enhancements) as a section near the top.
 * GeneralStatsBlock holds the non-enhanceable execution metadata
 * (Activation, Pwr Range, Effect Area, Attack Type) near the bottom of
 * the panel. Accuracy / End Cost / Rech Time live in the main effects
 * table (RegistryEffectsDisplay's three-column layout) so the user can
 * see base / enhanced / final values.
 *
 * Both use in-game terminology: "Enemies" for Foe targets, "Single
 * Target" / "Cone" / "Targeted AoE" for effect areas, "Ranged, Cold"
 * style attack-type composites, etc.
 */

import { useState } from 'react';
import type { Power, TargetType, EffectArea, SelectedPower, IOSetEnhancement } from '@/types';
import type { PowerDamageResult } from '@/utils/calculations';
import { calcThreeTier as calcThreeTierUtil } from './powerDisplayUtils';
import { abbreviateDamageType, calculateArcanaTime } from '@/utils/calculations';
import {
  findProcData,
  isProcAlwaysOn,
  calculateProcChance,
  calculateAutoToggleProcChance,
  type ProcData,
} from '@/data';

// ----------------------------------------------------------------------
// TagsBlock — Power Type / Target Type / Allowed Enhancements.
// ----------------------------------------------------------------------

interface TagsBlockProps {
  power: Power;
}

export function TagsBlock({ power }: TagsBlockProps) {
  const targetLabel = formatTargetType(power.targetType);
  const allowedEnh = formatAllowedEnhancements(power);
  return (
    <div className="bg-slate-800/40 rounded p-2 space-y-0.5">
      <KvRow label="Power Type" value={power.powerType} />
      {targetLabel && <KvRow label="Target Type" value={targetLabel} />}
      {allowedEnh && <KvRow label="Allowed Enh" value={allowedEnh} valueClass="text-slate-300 truncate" title={allowedEnh} />}
    </div>
  );
}

// ----------------------------------------------------------------------
// GeneralStatsBlock — Activation / Range / Area / Attack.
// ----------------------------------------------------------------------

interface GeneralStatsBlockProps {
  power: Power;
  /** Merged effects object (stats + power.effects) used by the 3-tier calc */
  effects: {
    range?: number;
    recharge?: number;
    castTime?: number;
    radius?: number;
    /** Arc in degrees (already converted upstream from radians). */
    arc?: number;
    maxTargets?: number;
  };
  enhancementBonuses: Record<string, number | undefined>;
  globalBonusesForCalc: Record<string, number | undefined>;
  /** Attack-type composite needs the rendered damage types. */
  damageType?: string;
  /** Whether the user prefers Arcanatime as the inline activation value. */
  useArcanaTime: boolean;
  /** The build's slotted version of this power — used to find slotted procs. */
  selectedPower?: SelectedPower | null;
}

export function GeneralStatsBlock({
  power,
  effects,
  enhancementBonuses,
  globalBonusesForCalc,
  damageType,
  useArcanaTime,
  selectedPower,
}: GeneralStatsBlockProps) {
  const tier = (aspect: string, base: number | undefined) =>
    base != null ? calcThreeTierUtil(aspect, base, enhancementBonuses, globalBonusesForCalc) : null;

  const activation = tier('castTime', effects.castTime);
  const rng = tier('range', effects.range);

  const effectAreaLabel = formatEffectArea(power.effectArea, effects);
  const attackType = formatAttackType(power, effects, damageType);

  return (
    <div className="bg-slate-800/40 rounded p-2 space-y-0.5">
      {effects.castTime != null && activation && (
        <ActivationRow castTime={activation.final} useArcanaTime={useArcanaTime} />
      )}
      {effects.range != null && rng && rng.final > 0 && (
        <KvRow label="Pwr Range" value={`${rng.final.toFixed(0)}ft`} />
      )}
      {effectAreaLabel && <KvRow label="Effect Area" value={effectAreaLabel} />}
      {attackType && <KvRow label="Attack Type" value={attackType} />}
      <ProcChanceRow
        powerType={power.powerType}
        selectedPower={selectedPower ?? null}
        baseRecharge={effects.recharge ?? 0}
        castTime={effects.castTime ?? 0}
        radius={effects.radius ?? 0}
        arcDegrees={effects.arc}
        slottedRechargeBonus={enhancementBonuses.recharge ?? 0}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// ActivationRow — Activation (raw cast time) is always shown. When the
// user has the ArcanaTime toggle on, a second row shows the
// server-tick-adjusted lockout. Both rows use the same KvRow style as
// Range / Effect Area / Attack Type for visual consistency.
// ----------------------------------------------------------------------

function ActivationRow({ castTime, useArcanaTime }: { castTime: number; useArcanaTime: boolean }) {
  return (
    <>
      <KvRow label="Activation" value={`${castTime.toFixed(3)}s`} />
      {useArcanaTime && (
        <KvRow label="ArcanaTime" value={`${calculateArcanaTime(castTime).toFixed(3)}s`} />
      )}
    </>
  );
}

// ----------------------------------------------------------------------
// ProcChanceRow — expandable row showing PPM-based proc chances for the
// procs slotted into this power. Collapsed shows a compact headline.
// Expanded shows per-proc formula breakdown so users can reproduce the
// math by hand.
//
// PPM rule of thumb: only this power's slotted enhancement recharge
// modifies the formula (NOT global recharge / set bonuses / Hasten).
// `slottedRechargeBonus` here is the post-ED enhancement total for the
// power; Alpha incarnate is bundled into that figure.
// ----------------------------------------------------------------------

interface ProcChanceRowProps {
  powerType?: string;
  selectedPower: SelectedPower | null;
  baseRecharge: number;
  castTime: number;
  radius: number;
  arcDegrees: number | undefined;
  slottedRechargeBonus: number;
}

interface ProcEntry {
  key: string;
  name: string;
  setName: string;
  ppm: number | null;
  /** undefined when always-on (no PPM); otherwise the computed chance 0–1 */
  chance?: number;
}

function ppmAreaDenom(radius: number, arcDegrees: number): number {
  if (radius <= 0) return 1.0;
  return 0.25 + 0.75 * (1 + radius * (11 * arcDegrees + 540) / 40000);
}

function ProcChanceRow({
  powerType,
  selectedPower,
  baseRecharge,
  castTime,
  radius,
  arcDegrees,
  slottedRechargeBonus,
}: ProcChanceRowProps) {
  const [expanded, setExpanded] = useState(false);

  if (!selectedPower?.slots) return null;

  const isToggleOrAuto = powerType === 'Toggle' || powerType === 'Auto';
  // For non-attack passives there's nothing to compute.
  if (!isToggleOrAuto && baseRecharge <= 0 && castTime <= 0) return null;

  const arcDeg = radius > 0 ? (arcDegrees && arcDegrees > 0 ? arcDegrees : 360) : 360;
  const modifiedRecharge = baseRecharge / (1 + slottedRechargeBonus);
  const areaDenom = ppmAreaDenom(radius, arcDeg);

  const entries: ProcEntry[] = [];
  const procDataByKey: Record<string, ProcData> = {};

  for (const slot of selectedPower.slots) {
    if (!slot || slot.type !== 'io-set') continue;
    const ioSlot = slot as IOSetEnhancement;
    if (!ioSlot.isProc) continue;
    const procData = findProcData(ioSlot.name, ioSlot.setName);
    if (!procData) continue;

    const key = `${ioSlot.setName}:${ioSlot.name}:${ioSlot.pieceNum}`;
    procDataByKey[key] = procData;

    if (procData.ppm == null || isProcAlwaysOn(procData)) {
      entries.push({
        key,
        name: ioSlot.name,
        setName: ioSlot.setName,
        ppm: null,
      });
      continue;
    }

    const chance = isToggleOrAuto
      ? calculateAutoToggleProcChance(procData.ppm, radius, arcDeg)
      : calculateProcChance(procData.ppm, baseRecharge, castTime, radius, arcDeg, slottedRechargeBonus);

    entries.push({
      key,
      name: ioSlot.name,
      setName: ioSlot.setName,
      ppm: procData.ppm,
      chance,
    });
  }

  if (entries.length === 0) return null;

  const ppmEntries = entries.filter((e) => e.chance !== undefined);
  const headline = ppmEntries.length > 0
    ? ppmEntries.map((e) => `${Math.round((e.chance ?? 0) * 100)}%`).join(' / ')
    : 'always-on';

  return (
    <>
      <div
        role="button"
        aria-expanded={expanded}
        title={expanded ? 'Hide proc chance detail' : 'Show proc chance breakdown'}
        className="grid grid-cols-[7rem_1fr] gap-1 text-xs cursor-pointer select-none hover:bg-slate-700/30 -mx-0.5 px-0.5 rounded"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-slate-400">
          <span className={`inline-block text-[10px] mr-0.5 transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
          Proc Chance
        </span>
        <span className="text-slate-200">
          {entries.length} slotted{ppmEntries.length > 0 ? ` — ${headline}` : ''}
        </span>
      </div>
      {expanded && (
        <div className="ml-3 pl-2 border-l border-slate-700/60 space-y-1 mt-0.5">
          {entries.map((entry) => (
            <ProcDetailLine
              key={entry.key}
              entry={entry}
              isToggleOrAuto={isToggleOrAuto}
              modifiedRecharge={modifiedRecharge}
              castTime={castTime}
              areaDenom={areaDenom}
              hasRechargeMod={slottedRechargeBonus > 0}
              baseRecharge={baseRecharge}
            />
          ))}
          <div className="text-[11px] text-slate-400 italic mt-1">
            Recharge here = base ÷ (1 + slotted enh recharge); global recharge buffs (set bonuses, Hasten) do not affect proc chance.
            {isToggleOrAuto && ' Toggle procs check every 10s (~6×/min) with suppression in between.'}
            {' '}Clamped to 5+PPM×1.5% min, 90% max.
          </div>
        </div>
      )}
    </>
  );
}

function ProcDetailLine({
  entry,
  isToggleOrAuto,
  modifiedRecharge,
  castTime,
  areaDenom,
  hasRechargeMod,
  baseRecharge,
}: {
  entry: ProcEntry;
  isToggleOrAuto: boolean;
  modifiedRecharge: number;
  castTime: number;
  areaDenom: number;
  hasRechargeMod: boolean;
  baseRecharge: number;
}) {
  if (entry.ppm == null || entry.chance === undefined) {
    return (
      <div className="text-xs">
        <span className="text-slate-300">{entry.name}</span>
        <span className="text-slate-400"> — always-on (no PPM check)</span>
      </div>
    );
  }

  const ppm = entry.ppm;
  const chancePct = entry.chance * 100;

  let formula: string;
  if (isToggleOrAuto) {
    formula = `${ppm.toFixed(1)} × 10 / (60 × ${areaDenom.toFixed(2)})`;
  } else {
    const rechargeLabel = hasRechargeMod
      ? `${modifiedRecharge.toFixed(2)} (was ${baseRecharge.toFixed(2)})`
      : `${modifiedRecharge.toFixed(2)}`;
    formula = `${ppm.toFixed(1)} × (${rechargeLabel} + ${castTime.toFixed(2)}) / (60 × ${areaDenom.toFixed(2)})`;
  }

  return (
    <div className="text-xs leading-tight">
      <div>
        <span className="text-slate-300">{entry.name}</span>
        <span className="text-slate-400"> · {ppm.toFixed(1)} PPM</span>
        <span className="text-amber-300 ml-2">{chancePct.toFixed(1)}%</span>
      </div>
      <div className="text-[11px] text-slate-400 font-mono pl-1">{formula}</div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Shared row primitive.
// ----------------------------------------------------------------------

interface KvRowProps {
  label: string;
  value: string;
  /** Optional small annotation rendered after the value (e.g. "8.0s base"). */
  delta?: string | null;
  valueClass?: string;
  title?: string;
}

function KvRow({ label, value, delta, valueClass, title }: KvRowProps) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-1 text-xs" title={title}>
      <span className="text-slate-400">{label}</span>
      <span className={valueClass ?? 'text-slate-200'}>
        {value}
        {delta && <span className="text-slate-400 text-[11px] ml-1">({delta})</span>}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------
// Formatting helpers.
// ----------------------------------------------------------------------

function formatTargetType(t: TargetType | undefined): string | null {
  if (!t) return null;
  // Convert game's internal terms to player-facing language.
  if (t === 'Foe' || t.startsWith('Foe')) return 'Enemies';
  if (t === 'Self') return 'Self';
  if (t === 'Friend' || t.startsWith('Friend')) return 'Allies';
  if (t === 'Ally' || t.startsWith('Ally')) return 'Allies';
  if (t === 'Teammate' || t.startsWith('Teammate')) return 'Teammates';
  if (t === 'Location' || t === 'Location (Teleport)') return 'Location';
  if (t === 'Any' || t === 'Any (Alive)') return 'Any';
  if (t === 'Own Pet (Alive)') return 'Own Pets';
  if (t === 'DeadFoe') return 'Dead Enemies';
  return t;
}

function formatEffectArea(area: EffectArea | undefined, effects: { radius?: number; arc?: number; maxTargets?: number }): string | null {
  if (!area) return null;
  switch (area) {
    case 'SingleTarget':
      return 'Single Target';
    case 'AoE': {
      const r = effects.radius;
      const tgt = effects.maxTargets;
      const parts = ['AoE'];
      if (r) parts.push(`${r.toFixed(0)}ft`);
      if (tgt) parts.push(`${tgt} max`);
      return parts.join(', ');
    }
    case 'Cone': {
      const r = effects.radius;
      const a = effects.arc;
      const tgt = effects.maxTargets;
      const parts = ['Cone'];
      if (r) parts.push(`${r.toFixed(0)}ft`);
      if (a) parts.push(`${a.toFixed(0)}°`);
      if (tgt) parts.push(`${tgt} max`);
      return parts.join(', ');
    }
    case 'Location':
      return 'Location AoE';
    case 'Chain':
      return 'Chain';
    default:
      return area;
  }
}

/**
 * Compose Attack Type as "<Vector>, <Damage Types>".
 *
 *   Suffocate: range 80, single-target, Cold damage → "Ranged, Cold"
 *   Boxing:    range 0,  melee, Smash damage         → "Melee, Smash"
 *   Shadow Maul: range 0, cone, Negative damage      → "Melee Cone, Neg"
 *   Self-buff (no damage): range 0, self             → "Self"
 */
function formatAttackType(
  power: Power,
  effects: { range?: number; radius?: number },
  damageType: string | undefined,
): string | null {
  // Self-targeted with no damage: "Self" only.
  if (power.targetType === 'Self' && !damageType) {
    return 'Self';
  }
  // Use the damage entry's table as the primary signal — `Melee_Damage`
  // and `Ranged_Damage` come straight from the binary and reliably name
  // the attack vector. Range alone is unreliable because melee attacks
  // typically have range 5–7ft (the natural reach of the strike) and a
  // simple `range > 5` check labels Barrage/Slash/Boxing as Ranged.
  // Fall back to the range threshold (>20ft, well above melee reach)
  // only when no damage table is available.
  const tables = damageEntryTables(power);
  const isMelee = tables.some((t) => t.startsWith('melee_'));
  const isRangedTable = tables.some((t) => t.startsWith('ranged_'));
  const isRanged = isRangedTable || (!isMelee && (effects.range ?? 0) > 20);
  const isAoE = (effects.radius ?? 0) > 0;
  const vectorParts: string[] = [];
  vectorParts.push(isRanged ? 'Ranged' : 'Melee');
  if (isAoE && power.effectArea && power.effectArea !== 'SingleTarget') {
    vectorParts.push(power.effectArea === 'Cone' ? 'Cone' : 'AoE');
  }
  const vector = vectorParts.join(' ');
  if (!damageType || damageType === 'Unknown') return vector;
  return `${vector}, ${abbreviateDamageType(damageType)}`;
}

/** Lowercased damage-entry tables for melee/ranged classification. */
function damageEntryTables(power: Power): string[] {
  const dmg = power.damage;
  if (!dmg) return [];
  const arr = Array.isArray(dmg) ? dmg : [dmg];
  return arr.map((d) => (d.table || '').toLowerCase()).filter(Boolean);
}

/**
 * Render the slot-relevant set categories (or fall back to enhancement
 * types). Set categories carry richer build info ("Ranged Damage",
 * "Defense Debuff" — what IO sets you can slot here) so prefer those
 * when present.
 */
function formatAllowedEnhancements(power: Power): string | null {
  const setCats = power.allowedSetCategories;
  if (setCats && setCats.length > 0) {
    return setCats.join(', ');
  }
  const enh = power.allowedEnhancements;
  if (enh && enh.length > 0) {
    return enh.join(', ');
  }
  return null;
}

// Re-export for any panel that wants to render PowerDamageResult-driven
// info — the inferred damageType lives on calculatedDamage.type.
export type { PowerDamageResult };
