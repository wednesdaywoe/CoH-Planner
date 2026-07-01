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
import { useUIStore } from '@/stores';
import type { Power, TargetType, EffectArea, SelectedPower, IOSetEnhancement, ResolvedPseudoPetAbility } from '@/types';
import type { PowerDamageResult } from '@/utils/calculations';
import { calcThreeTier as calcThreeTierUtil } from './powerDisplayUtils';
import { abbreviateDamageType, calculateArcanaTime } from '@/utils/calculations';
import { resolveProcAreaGeometry } from '@/utils/calculations/pet-damage';
import { Chip, type TagKind } from './TagsRow';
import {
  findProcData,
  isProcAlwaysOn,
  calculateProcChance,
  calculateAutoToggleProcChance,
  getPPMAreaDenominator,
  type ProcData,
} from '@/data';

// ----------------------------------------------------------------------
// PowerMetaTags — Power Type / Target Type (+ mez-immunity flags) as chips.
//
// Rendered as a bare fragment so the caller can drop these into the same
// flex-wrap row as the shortHelp chips (TagsRow), giving one cohesive tag
// cloud at the top of the panel. Allowed Enhancements moved to its own
// section (AllowedEnhancementsBlock) — see below.
// ----------------------------------------------------------------------

interface PowerMetaTagsProps {
  power: Power;
}

const CAST_THROUGH_MEZ_LABELS: Record<string, string> = {
  hold: 'Held', sleep: 'Slept', stun: 'Stunned', terror: 'Terrorized',
};

function formatCastThroughMez(states: readonly string[]): string {
  return states.map((s) => CAST_THROUGH_MEZ_LABELS[s] ?? s).join(', ');
}

export function PowerMetaTags({ power }: PowerMetaTagsProps) {
  const targetLabel = formatTargetType(power.targetType);
  const castThroughMez = power.castThroughMez?.length ? formatCastThroughMez(power.castThroughMez) : null;
  const toggleIgnoreMez = power.toggleIgnoreMez?.length ? formatCastThroughMez(power.toggleIgnoreMez) : null;
  return (
    <>
      {power.powerType && <Chip kind="other" title="Power type">{power.powerType}</Chip>}
      {targetLabel && <Chip kind="neutral" title="Target type">{targetLabel}</Chip>}
      {castThroughMez && (
        <Chip
          kind="buff"
          title={`This power can still be activated while ${castThroughMez} (e.g. Blaster Defiance).`}
        >
          Casts while {castThroughMez}
        </Chip>
      )}
      {toggleIgnoreMez && (
        <Chip
          kind="buff"
          title={`This power keeps running (does not detoggle) while ${toggleIgnoreMez}.`}
        >
          Stays on while {toggleIgnoreMez}
        </Chip>
      )}
    </>
  );
}

// ----------------------------------------------------------------------
// AllowedEnhancementsBlock — the slottable set categories (or fall back to
// enhancement types) as a wrapping block of chips. Previously a single
// truncated KvRow value that cut off and became unreadable.
// ----------------------------------------------------------------------

export function AllowedEnhancementsBlock({ power }: { power: Power }) {
  const items = allowedEnhancementsList(power);
  if (items.length === 0) return null;
  return (
    <div className="bg-slate-800/40 rounded p-2 space-y-1">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
        Allowed Enhancements
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <Chip key={item} kind={enhancementAspectKind(item)}>{item}</Chip>
        ))}
      </div>
    </div>
  );
}

/**
 * Map an allowed-enhancement / set-category label to its in-game POG color
 * (public/img/Enhancements/Components/POGS) so each chip matches the
 * enhancement icon a player sees in their slots. Order matters: more
 * specific aspects are checked before generic damage so e.g. "Resist
 * Damage" → cyan and "Defense Debuff" → purple rather than red.
 */
function enhancementAspectKind(raw: string): TagKind {
  const t = raw.toLowerCase();
  if (/resist/.test(t)) return 'other';                                 // cyan  — Damage Resistance
  if (/defen[cs]e/.test(t)) return 'mez';                               // purple — Defense (buff & debuff)
  if (/to.?hit|accuracy/.test(t)) return 'yellow';                      // yellow — Accuracy / ToHit ("accuracy" not "accurate", so "Accurate Healing" → green)
  if (/heal|absorb|resurrect|regen/.test(t)) return 'buff';            // green  — Heal
  if (/endur|recovery/.test(t)) return 'blue';                         // blue   — Endurance / Recovery
  if (/recharge/.test(t)) return 'maroon';                              // maroon — Recharge
  if (/hold|immobil|intangib/.test(t)) return 'orange';                // orange — Hold / Immobilize / Intangible
  if (/fear|terror|radius/.test(t)) return 'pink';                     // pink   — Fear / Radius
  if (/confus/.test(t)) return 'mez';                                   // purple — Confuse
  if (/slow/.test(t)) return 'other';                                   // cyan   — Slow Movement
  if (/stun|sleep|knockback|interrupt|taunt|threat/.test(t)) return 'neutral'; // gray — Stun/Sleep/KB/Interrupt/Taunt
  if (/damage|dmg|sniper/.test(t)) return 'damage';                     // red    — Damage (before range, so "Ranged Damage" → red not green)
  if (/range|cone/.test(t)) return 'buff';                              // green  — Range / Cone
  if (/fly|flight|run|jump|leap|teleport|travel|sprint|speed/.test(t)) return 'other'; // cyan — movement
  return 'neutral';                                                      // gray   — Archetype Sets, Universal Debuff, etc.
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

  // Ground-patch / summon-shell powers (Burn, Rain of Fire, Caltrops, …) carry
  // their shell's Self/SingleTarget/Location area with radius 0, so their real
  // AoE footprint lives on the pseudo-pet. Surface that as the display area
  // instead of the misleading "Single Target" — display-only, never mutates the
  // power's real effect_area. See parser_logs/BIN-PARSER-LOG.md.
  const patchArea = deriveSummonPatchArea(power, effects);
  // Proc area-factor geometry. `effects.arc` is already in degrees and
  // `effects.radius` is the BASE radius (a cone's enhanced reach must not
  // inflate the proc denominator). When the parent has no radius the resolver
  // borrows the summoned pseudo-pet/patch footprint (Burn, rains, Caltrops).
  const procAreaGeometry = resolveProcAreaGeometry(
    effects.radius ?? 0, effects.arc, power.effects?.summon);
  // For a cone, `radius` and `range` describe the same dimension — the cone's
  // reach — and Range enhancements extend it (unlike sphere/PBAoE radii, which
  // are fixed). Show the *enhanced* reach in the Effect Area row so it matches
  // the Pwr Range row instead of the stale base radius. This is display-only:
  // ProcChanceRow below still gets the base `effects.radius`, because a cone's
  // enhanced reach must NOT inflate its proc-area denominator.
  const areaEffects =
    power.effectArea === 'Cone' && rng && rng.final > 0
      ? { ...effects, radius: rng.final }
      : effects;
  const effectAreaLabel = patchArea
    ? `${formatEffectArea(patchArea.area, patchArea)} (patch)`
    : formatEffectArea(power.effectArea, areaEffects);
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
        // Summon-shell AoEs (Burn, rains, Caltrops) have base radius 0 — pull the
        // pseudo-pet/patch footprint so procs aren't scored single-target. Powers
        // with a real radius (incl. cones, base reach not enhanced) are untouched.
        radius={procAreaGeometry.radius}
        arcDegrees={procAreaGeometry.arcDegrees}
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

function ProcChanceRow({
  powerType,
  selectedPower,
  baseRecharge,
  castTime,
  radius,
  arcDegrees,
  slottedRechargeBonus,
}: ProcChanceRowProps) {
  // Per-view local expansion plus a persisted "pin" toggle. The pin
  // wins when on — Power Info shows the breakdown automatically for
  // every power the user clicks through, so they don't have to chase
  // the chevron on each one.
  const pinned = useUIStore((s) => s.procChancePinned);
  const togglePinned = useUIStore((s) => s.toggleProcChancePinned);
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = pinned || localExpanded;

  if (!selectedPower?.slots) return null;

  const isToggleOrAuto = powerType === 'Toggle' || powerType === 'Auto';
  // For non-attack passives there's nothing to compute.
  if (!isToggleOrAuto && baseRecharge <= 0 && castTime <= 0) return null;

  const arcDeg = radius > 0 ? (arcDegrees && arcDegrees > 0 ? arcDegrees : 360) : 360;
  const modifiedRecharge = baseRecharge / (1 + slottedRechargeBonus);
  const areaDenom = getPPMAreaDenominator(radius, arcDeg);

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
      <div className="grid grid-cols-[7rem_1fr] gap-1 text-xs select-none hover:bg-slate-700/30 -mx-0.5 px-0.5 rounded">
        <div className="flex items-center text-slate-400">
          <span
            role="button"
            tabIndex={pinned ? -1 : 0}
            aria-expanded={expanded}
            title={
              pinned
                ? 'Proc Chance is pinned open — click the pin to release'
                : expanded
                  ? 'Hide proc chance detail'
                  : 'Show proc chance breakdown'
            }
            onClick={() => { if (!pinned) setLocalExpanded((v) => !v); }}
            onKeyDown={(e) => {
              if (pinned) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setLocalExpanded((v) => !v);
              }
            }}
            className={`flex items-center ${pinned ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span className={`inline-block text-[10px] mr-0.5 transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
            Proc Chance
          </span>
          <button
            type="button"
            onClick={togglePinned}
            title={pinned
              ? 'Unpin — Proc Chance will collapse when you click another power'
              : 'Pin Proc Chance open across powers'}
            aria-label={pinned ? 'Unpin Proc Chance' : 'Pin Proc Chance open'}
            aria-pressed={pinned}
            className={`ml-1 inline-flex items-center transition-colors ${pinned ? 'text-amber-300' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {pinned ? (
              // Heroicons v2 outline — lock-closed
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            ) : (
              // Heroicons v2 outline — lock-open
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            )}
          </button>
        </div>
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
    case 'Location': {
      const r = effects.radius;
      const tgt = effects.maxTargets;
      const parts = ['Location AoE'];
      if (r) parts.push(`${r.toFixed(0)}ft`);
      if (tgt) parts.push(`${tgt} max`);
      return parts.join(', ');
    }
    case 'Chain':
      return 'Chain';
    default:
      return area;
  }
}

/**
 * Derive a DISPLAY effect area for "ground patch" summon-shell powers (Burn,
 * Rain of Fire, Caltrops, Tar Patch, Ice Storm, Sleet, Bonfire, …). These are
 * Self/SingleTarget or Location shells whose own radius/max-targets are 0 — they
 * just summon a pseudo-pet that carries the real AoE (Burn → FieryBurn, 15ft/10).
 * The converter resolves that footprint into `summon.resolvedEntities[].abilities`,
 * but the headline still reads the shell's values, so the UI mislabels these as
 * "Single Target" and hides the radius/cap rows.
 *
 * Returns the widest pet-ability footprint to display, or null when the power
 * isn't a pseudo-pet shell, already surfaces its own radius, or its pet has no
 * AoE ability (callers then fall back to the power's own effect_area).
 *
 * Display-only: the real effect_area is never mutated — downstream calc/targeting
 * depends on the literal Self/SingleTarget value. See parser_logs/BIN-PARSER-LOG.md.
 */
function deriveSummonPatchArea(
  power: Power,
  effects: { radius?: number },
): { area: EffectArea; radius?: number; maxTargets?: number } | null {
  // `resolvedEntities` is the converter's synthesized footprint for redirect-
  // based patches/shells (it is NOT populated for real PET_ENTITIES summons like
  // Mastermind henchmen), so its presence is the signal — not the narrower
  // `isPseudoPet` flag, which is false for Burn-style PL_StaticObject shells.
  const summon = power.effects?.summon;
  if (!summon?.resolvedEntities?.length) return null;
  // Only fill a gap: if the headline already shows a real AoE radius, leave it.
  if (effects.radius && effects.radius > 0) return null;

  // Widest-footprint ability across all resolved pets is the patch's AoE; pet
  // self-buffs (ResistAll, etc.) carry no radius and are skipped.
  let best: ResolvedPseudoPetAbility | null = null;
  for (const ent of summon.resolvedEntities) {
    for (const ab of ent.abilities) {
      if (!ab.radius || ab.radius <= 0) continue;
      if (!best || ab.radius > (best.radius ?? 0)) best = ab;
    }
  }
  if (!best) return null;

  // Keep the power's own area when it already conveys an AoE shape (Location
  // patches like Tar Patch / Rain of Fire stay "Location AoE"); only the
  // misleading Self/SingleTarget shells (Burn) borrow the pet's area.
  const own = power.effectArea;
  const petRaw = best.effectArea; // raw bin string ('Sphere' | 'Cone' | …), unmapped
  const area: EffectArea =
    own === 'Location' || own === 'AoE' || own === 'Cone'
      ? own
      : petRaw === 'Cone' ? 'Cone' : 'AoE';
  // 255 is the bin's "uncapped" sentinel — omit rather than render "255 max".
  const maxTargets = best.maxTargets && best.maxTargets < 255 ? best.maxTargets : undefined;
  return { area, radius: best.radius, maxTargets };
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
 * The slot-relevant set categories (or fall back to enhancement types). Set
 * categories carry richer build info ("Ranged Damage", "Defense Debuff" —
 * what IO sets you can slot here) so prefer those when present.
 */
function allowedEnhancementsList(power: Power): string[] {
  const setCats = power.allowedSetCategories;
  if (setCats && setCats.length > 0) {
    return [...setCats];
  }
  const enh = power.allowedEnhancements;
  if (enh && enh.length > 0) {
    return [...enh];
  }
  return [];
}

// Re-export for any panel that wants to render PowerDamageResult-driven
// info — the inferred damageType lives on calculatedDamage.type.
export type { PowerDamageResult };
