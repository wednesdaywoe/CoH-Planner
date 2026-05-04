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

import type { Power, TargetType, EffectArea } from '@/types';
import type { PowerDamageResult } from '@/utils/calculations';
import { calcThreeTier as calcThreeTierUtil } from './powerDisplayUtils';
import { abbreviateDamageType } from '@/utils/calculations';

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
    castTime?: number;
    radius?: number;
    arc?: number;
    maxTargets?: number;
  };
  enhancementBonuses: Record<string, number | undefined>;
  globalBonusesForCalc: Record<string, number | undefined>;
  /** Attack-type composite needs the rendered damage types. */
  damageType?: string;
}

export function GeneralStatsBlock({
  power,
  effects,
  enhancementBonuses,
  globalBonusesForCalc,
  damageType,
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
        <KvRow label="Activation" value={`${activation.final.toFixed(2)}s`} />
      )}
      {effects.range != null && rng && rng.final > 0 && (
        <KvRow label="Pwr Range" value={`${rng.final.toFixed(0)}ft`} />
      )}
      {effectAreaLabel && <KvRow label="Effect Area" value={effectAreaLabel} />}
      {attackType && <KvRow label="Attack Type" value={attackType} />}
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
    <div className="grid grid-cols-[7rem_1fr] gap-1 text-[11px]" title={title}>
      <span className="text-slate-500">{label}</span>
      <span className={valueClass ?? 'text-slate-200'}>
        {value}
        {delta && <span className="text-slate-500 text-[9px] ml-1">({delta})</span>}
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
