/**
 * Attack Chain Builder modal.
 *
 * Click powers to greedily pack an attack rotation (one animation at a time,
 * recharge anchored to cast start — see attack-chain.ts). Drag a bar on the
 * timeline to reorder the cast sequence; grab empty space to pan. Surfaces
 * cycle time, DPS, dead time, and an endurance gain/spend model with a
 * sustainability sawtooth. All per-power numbers come from the live build via
 * the same calc the power tooltips use (attack-chain-powers.ts).
 */

import { useMemo, useRef, useState } from 'react';
import { Modal } from './Modal';
import {
  useBuildStore,
  useUIStore,
  useScourgeActive,
  useContainmentActive,
  useCriticalHitsActive,
  useStalkerHidden,
  useStalkerTeamSize,
  useStalkerCritActive,
  useSentinelCritActive,
  useDominationActive,
} from '@/stores';
import { effectiveGlobalAdjusters } from '@/components/info/resolveEffectivePower';
import { useCharacterCalculation } from '@/hooks/useCalculatedStats';
import {
  buildChainPowers,
  buildFormModes,
  getEnduranceParams,
  getBuildGlobalRecharge,
  chainWhatIfRows,
  sequenceToIds,
  idsToSequence,
} from '@/utils/calculations/attack-chain-powers';
import { whatIfControls } from './whatIfControls';
import { modeLabel } from '@/utils/mode-suppression';
import type { AttackChain } from '@/types';
import { getArchetype } from '@/data';
import {
  replayChain,
  computeChain,
  effectiveRecharge,
  type RechargeBounds,
  powerMetricValue,
  chainDotTickProbability,
  type ChainPower,
  type PowerMetric,
} from '@/utils/calculations/attack-chain';

interface AttackChainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_HUE: Record<ChainPower['type'], number> = { attack: 258, utility: 152, buff: 35 };
const LABEL_W = 116;
const LANE_H = 24;
const MIN_PX = 4; // low enough to fit very long recharges (e.g. 50s+ nukes)
const MAX_PX = 80;

// What-if global-recharge slider. Spans a heavy stacked enemy −recharge debuff
// (Heat Loss alone ≈ −300%) through the +400% recharge-strength buff cap. 0 = the
// build exactly as slotted. Values are % points added to the build's global
// recharge; the per-power ClampStrength bounds (RechargeBounds in attack-chain.ts)
// keeps every result honest no matter how deep the debuff is dialled.
/** The one chain-moving stat with a dedicated control of its own (the labelled track below), so
 *  the compact row list skips it rather than offering the same layer entry twice. */
const RECHARGE_STAT = 'recharge';
const WHATIF_RECH_MIN = -300;
const WHATIF_RECH_MAX = 400;
const WHATIF_RECH_STEP = 5;
// Labelled/clickable ticks along the track (0 is emphasized as the build anchor).
const WHATIF_RECH_TICKS = [-300, -200, -100, 0, 100, 200, 300, 400];
/** Fraction (0–100%) along the slider track for a what-if value. */
const whatIfTrackPct = (v: number) =>
  ((v - WHATIF_RECH_MIN) / (WHATIF_RECH_MAX - WHATIF_RECH_MIN)) * 100;

/** Short label for the power-ranking metric (legend + palette tooltips). See
 *  powerMetricValue in attack-chain.ts. */
const METRIC_LABEL: Record<PowerMetric, string> = { damage: 'dmg', dpa: 'DPA', dps: 'DPS' };

/** Option A coloring: type sets the hue, relative damage sets richness. */
function barFill(type: ChainPower['type'], rel: number): string {
  return `hsl(${TYPE_HUE[type]}, ${30 + rel * 55}%, ${66 - rel * 28}%)`;
}
function cdFill(type: ChainPower['type']): string {
  return `hsl(${TYPE_HUE[type]}, 38%, 24%)`;
}
/** Translucent fill of the bar color — tints palette/rotation chips with the
 *  power's damage color (the visual link to its timeline bar) while keeping the
 *  label readable. */
function chipBg(type: ChainPower['type'], rel: number): string {
  // Stronger saturation + ~45% opacity so chips read as clearly colored (and
  // the damage gradient is visible) while the dark base keeps the label legible.
  return `hsla(${TYPE_HUE[type]}, ${45 + rel * 45}%, ${60 - rel * 26}%, 0.45)`;
}

/** Drop-indicator color for the rotation strip. Deliberately NOT a type hue
 *  (purple/green/amber) so the insert cursor + held-chip ring read as UI, not
 *  a power category. */
const CURSOR_COLOR = '#f1f5f9';

/** Hatched amber band for recharge overshoot — a power that has finished
 *  recharging but hasn't been recast yet because another animation is still
 *  playing ("waiting"). Striped so it reads as idle-ready, distinct
 *  from the solid orange DoT ticks and the dark cooldown bar. */
const READY_FILL =
  'repeating-linear-gradient(45deg, rgba(124,140,162,0.55) 0 4px, rgba(124,140,162,0.18) 4px 8px)';

/** Colors the cooldown/idle stem while a self-buff (azure) or foe-debuff (amber)
 *  is active. The color edge = expiry: keep it touching the next cast for full
 *  uptime with no wasted early recast. Cool = good (buff), warm = debuff. */
const WINDOW_COLOR: Record<'buff' | 'debuff', string> = {
  buff: 'rgba(96, 165, 235, 0.6)',
  debuff: 'rgba(224, 160, 46, 0.6)',
};

function fmt(n: number, d = 1): string {
  return n.toFixed(d);
}

export function AttackChainModal({ isOpen, onClose }: AttackChainModalProps) {
  const build = useBuildStore((s) => s.build);

  // The metric that ranks powers everywhere here — palette order, bar/chip
  // color intensity, and compactness weighting (persisted across sessions).
  const powerMetric = useUIStore((s) => s.chainPowerMetric);
  const setPowerMetric = useUIStore((s) => s.setChainPowerMetric);
  const effectWindowsOn = useUIStore((s) => s.chainShowEffectWindows);
  const setEffectWindowsOn = useUIStore((s) => s.setChainShowEffectWindows);
  // Combat Mode is the app-wide "in combat" (kEngaged) toggle. A snipe's quick
  // form fires while in combat OR while the +22% ToHit Marksman buff is active —
  // so Combat Mode drives the kEngaged half here, mirroring the InfoPanel which
  // also swaps in quickSnipe stats when Combat Mode is on. The ToHit half stays
  // in replayChain (permanent ToHit ≥ threshold / Build Up windows).
  const combatMode = useUIStore((s) => s.combatMode);
  const toggleCombatMode = useUIStore((s) => s.toggleCombatMode);
  const showToast = useUIStore((s) => s.showToast);

  // Saved chains live on the build (so they travel with the character).
  const savedChains = build.attackChains ?? [];
  const saveAttackChain = useBuildStore((s) => s.saveAttackChain);
  const updateAttackChain = useBuildStore((s) => s.updateAttackChain);
  const renameAttackChain = useBuildStore((s) => s.renameAttackChain);
  const deleteAttackChain = useBuildStore((s) => s.deleteAttackChain);
  // Which saved chain is loaded into the working sequence (null = unsaved
  // scratch), and the inline name field for new / save-as / rename.
  const [selectedChainId, setSelectedChainId] = useState<string | null>(null);
  const [naming, setNaming] = useState<{ mode: 'new' | 'saveas' | 'rename'; value: string } | null>(null);

  // AT hit-time mechanic toggles (crit / scourge / containment / …) — same
  // sources the power tooltips use, so the chain DPS matches them.
  const scourgeActive = useScourgeActive();
  const containmentActive = useContainmentActive();
  const criticalHitsActive = useCriticalHitsActive();
  const stalkerHidden = useStalkerHidden();
  const stalkerTeamSize = useStalkerTeamSize();
  const stalkerCritActive = useStalkerCritActive();
  const sentinelCritActive = useSentinelCritActive();
  // Conditional-effect toggles (Gravity Control's Impact, Bio Armor stances,
  // Domination) — the same maps the InfoPanel resolves a power under, so a bonus
  // the tooltip shows is a bonus the chain's DPS counts.
  const mechanicAdjusters = useUIStore((s) => s.mechanicAdjusters);
  const globalAdjusters = useUIStore((s) => s.globalAdjusters);
  const dominationActive = useDominationActive();
  // Per-power targets-hit slider (drives the endurance gain of Dark Consumption
  // / Consume / Power Sink, scaled per foe — same setting the dashboard uses).
  const targetsHitValues = useUIStore((s) => s.targetsHitValues);

  // Caster form. Kheldian Nova/Dwarf attacks are auto-granted by the form toggle and
  // usable only inside that form, while the human powers are disallowed inside it, so a
  // chain is built in one form at a time. Empty for every build with no form to enter.
  const formModes = useMemo(() => buildFormModes(build), [build]);
  const [formMode, setFormMode] = useState<string | null>(null);

  // The dashboard's calculation, not a fresh bare one. Calling
  // `calculateCharacterTotals(build)` here passed NO options, so every global the
  // chain reads — damage, recharge, ToHit, endurance — was computed with the
  // targets-hit sliders empty, no incarnates, no exemplar and every adjuster at
  // its default. Rage was the reported symptom: its stack slider moved the
  // dashboard and not the chain, and "Off" still counted one stack here because
  // an absent slider entry reads as the base 1-stack value. Sharing the hook also
  // means this modal hits the same memo cache as the rest of the app.
  const calc = useCharacterCalculation();

  // The archetype's binary-sourced stats — the ClampStrength bounds the chain divides by, the
  // endurance pool it drains, and every ceiling the what-if sliders below reach to. Read once:
  // nothing in this modal may invent one of these numbers (CAPS-1).
  const archetypeStats = useMemo(
    () => (build.archetype?.id ? getArchetype(build.archetype.id)?.stats ?? null : null),
    [build.archetype?.id],
  );

  const { powers, endParams, buildGlobalRech, permanentToHit } = useMemo(() => {
    const hasHide = build.secondary.powers.some((p) => p.internalName === 'Hide');
    const mechCtx = {
      archetypeId: build.archetype?.id ?? undefined,
      containmentActive,
      scourgeActive,
      criticalHitsActive,
      stalkerCritActive,
      sentinelCritActive,
      effectiveHidden: stalkerHidden && hasHide,
      stalkerTeamSize,
    };
    return {
      powers: buildChainPowers(build, calc.globalBonuses, mechCtx, targetsHitValues, {
        globalAdjusters: effectiveGlobalAdjusters(build, globalAdjusters),
        mechanicAdjusters,
        atInherentState: { dominationActive },
        formMode,
      }),
      endParams: getEnduranceParams(calc.globalBonuses, archetypeStats, build.level),
      buildGlobalRech: getBuildGlobalRecharge(calc.globalBonuses),
      // Always-on ToHit (% points) — drives the fast-snipe rule in replayChain.
      permanentToHit: calc.globalBonuses.toHit,
    };
  }, [build, calc, archetypeStats, containmentActive, scourgeActive, criticalHitsActive, stalkerCritActive, sentinelCritActive, stalkerHidden, stalkerTeamSize, targetsHitValues, mechanicAdjusters, globalAdjusters, dominationActive, formMode]);

  const [sequence, setSequence] = useState<number[]>([]);
  // The recharge what-if is ONE ENTRY in the shared team-buff layer, not a number this modal
  // owns: `buildGlobalRech` already carries it (the engine injects the layer into the
  // accumulators before projection, so `calc.globalBonuses.recharge` is already simulated).
  // Keeping a second local copy here would double-count the same adjustment.
  const whatIfBuffs = useUIStore((s) => s.whatIfBuffs);
  const setWhatIfBuff = useUIStore((s) => s.setWhatIfBuff);
  const openWhatIfBuffsModal = useUIStore((s) => s.openWhatIfBuffsModal);
  const extraRech = whatIfBuffs.recharge ?? 0;
  const setExtraRech = (v: number) => setWhatIfBuff('recharge', v);
  const [px, setPx] = useState(38);

  // Timeline reorder: dragging a bar moves that cast in the sequence. Bars are
  // monotonic in time == sequence order (the packer casts strictly in order),
  // so a single x-threshold picks the insert gap. Nothing shuffles until drop —
  // the grabbed bar gets a ring and a full-height insert cursor marks the gap.
  const reorderRef = useRef<{ from: number; insertAt: number } | null>(null);
  const [reorder, setReorder] = useState<{ from: number; left: number } | null>(null);

  // Grab-to-pan the timeline (mouse) from empty lane space / labels. Bars
  // intercept pointerdown (stopPropagation) to start a reorder instead, so a
  // pan only begins when you grab the background. Touch keeps native scrolling.
  const scrollRef = useRef<HTMLDivElement>(null);
  const lanesRef = useRef<HTMLDivElement>(null);
  const dragMoved = useRef(false);
  const onTimelinePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = scrollRef.current;
    if (!el) return;
    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    dragMoved.current = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 4) dragMoved.current = true;
      if (dragMoved.current) el.scrollLeft = startScroll - dx;
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const globalRech = buildGlobalRech;
  // What the build reaches on its own, for the slider's zero-point readout.
  const unsimulatedRech = buildGlobalRech - extraRech;

  // The archetype's own ClampStrength bounds on the recharge divisor, read from the class
  // binary rather than assumed. Without the CAP half the what-if slider could drive a chain
  // past the +400% recharge cap the game enforces (WHAT-IF-BUFFS-PLAN WIF19); without the
  // FLOOR half a deep debuff could take the divisor through zero. A build with no archetype
  // yet has no bounds to read, and the modal cannot schedule without them.
  const rechargeBounds = useMemo<RechargeBounds | null>(
    () => (archetypeStats ? { floor: archetypeStats.rechargeFloor, cap: archetypeStats.rechargeCap } : null),
    [archetypeStats],
  );

  // The OTHER team buffs a chain's numbers move with — damage, endurance discount, the
  // endurance pool, recovery and always-on ToHit (recharge keeps its own richer control above).
  // Which stats these are is measured, not chosen here: `attack-chain-sensitivity.test.ts`
  // pushes every key the layer offers through this whole pipeline and holds
  // `CHAIN_WHAT_IF_STATS` to exactly the set that moved a number.
  const otherWhatIf = useMemo(() => {
    const rows = chainWhatIfRows(calc.globalBonuses, archetypeStats, build.level, whatIfBuffs)
      .filter((row) => row.stat !== RECHARGE_STAT);
    const labels = new Map(whatIfControls(rows.map((row) => row.stat)).map((c) => [c.stat, c]));
    return rows.map((row) => ({ ...row, control: labels.get(row.stat) }));
  }, [calc.globalBonuses, archetypeStats, build.level, whatIfBuffs]);

  // How many distinct chain powers are pinned at the game's 4× recharge floor
  // (net strength at the archetype's own StrengthMin, i.e. the divisor is at the floor)
  // under the current what-if. Once a power is floored, more −recharge can't slow
  // it further — surfacing it keeps a correct cap from reading as a stuck slider
  // (the "why did it stop at −75%?" gotcha on a low-recharge build).
  const rechargeFloor = useMemo(() => {
    const seen = new Set<number>();
    let total = 0;
    let floored = 0;
    for (const pi of sequence) {
      if (seen.has(pi)) continue;
      seen.add(pi);
      const p = powers[pi];
      if (!p || p.baseRecharge <= 0) continue;
      total += 1;
      if (extraRech < 0 && rechargeBounds != null
          && 1 + p.rechargeEnh + globalRech / 100 <= rechargeBounds.floor + 1e-9) {
        floored += 1;
      }
    }
    return { total, floored, all: total > 0 && floored === total };
  }, [sequence, powers, globalRech, extraRech, rechargeBounds]);

  // A power's ranking value under the chosen metric (closes over the live
  // global recharge so DPS tracks the what-if slider).
  const metricVal = (p: ChainPower) =>
    rechargeBounds ? powerMetricValue(p, powerMetric, globalRech, rechargeBounds) : 0;

  const activations = useMemo(
    () =>
      rechargeBounds
        ? replayChain(powers, sequence, globalRech, rechargeBounds, {
            permanentToHit,
            forceFastSnipe: combatMode,
          })
        : [],
    [powers, sequence, globalRech, rechargeBounds, permanentToHit, combatMode],
  );

  // Snipe surfacing: if the chain holds a snipe (a power with a ToHit-gated fast
  // form), expose its threshold so we can guide the user to the controls that
  // make it cast quick — Combat Mode (in-combat) or enough always-on ToHit.
  const fastSnipe = useMemo(() => {
    for (const p of powers) {
      const f = p.forms?.find((x) => x.kind === 'fast' && x.trigger.type === 'tohit');
      if (f && f.trigger.type === 'tohit') return { threshold: f.trigger.threshold };
    }
    return null;
  }, [powers]);
  const toHitMeetsThreshold = fastSnipe != null && permanentToHit >= fastSnipe.threshold;
  const result = useMemo(
    () =>
      rechargeBounds
        ? computeChain(powers, activations, globalRech, rechargeBounds, endParams, powerMetric)
        : null,
    [powers, activations, globalRech, rechargeBounds, endParams, powerMetric],
  );

  // When the build's power set changes underneath us (power ids shift), re-map
  // the loaded saved chain to the new powers (dropping any now-missing power);
  // if nothing is loaded, clear the scratch sequence. Keyed by power ids so a
  // mere re-slot (which doesn't change ids) leaves the working chain alone.
  const powersKey = powers.map((p) => p.id).join('|');
  const [lastKey, setLastKey] = useState(powersKey);
  if (powersKey !== lastKey) {
    setLastKey(powersKey);
    const chain = selectedChainId ? savedChains.find((c) => c.id === selectedChainId) : null;
    setSequence(chain ? idsToSequence(powers, chain.powers) : []);
  }

  const addPower = (pi: number) => setSequence((s) => [...s, pi]);
  const removeBar = (seq: number) => setSequence((s) => s.filter((_, i) => i !== seq));
  const clear = () => setSequence([]);

  // Copy the settled rotation order as plain text (for sharing / notes).
  const copySequence = () => {
    const text = sequence.map((pi) => powers[pi]?.name).filter(Boolean).join(' → ');
    if (!text) return;
    const clip = navigator.clipboard;
    if (!clip) {
      showToast({ message: 'Clipboard unavailable', tone: 'warning' });
      return;
    }
    clip.writeText(text).then(
      () => showToast({ message: 'Rotation order copied to clipboard', tone: 'success' }),
      () => showToast({ message: 'Could not copy rotation order', tone: 'warning' }),
    );
  };
  const reorderSeq = (from: number, to: number) =>
    setSequence((s) => {
      if (from === to || from < 0 || to < 0 || from >= s.length || to >= s.length) return s;
      const a = [...s];
      const [moved] = a.splice(from, 1);
      a.splice(to, 0, moved);
      return a;
    });

  // --- Saved-chain wiring ---------------------------------------------------
  // The working sequence as stable ids, and whether it diverges from the loaded
  // saved chain (drives the "unsaved" dot + what Save does).
  const currentIds = sequenceToIds(powers, sequence);
  const selectedChain = selectedChainId ? savedChains.find((c) => c.id === selectedChainId) ?? null : null;
  const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
  const modified = selectedChain ? !sameIds(currentIds, selectedChain.powers) : sequence.length > 0;

  const loadChain = (c: AttackChain) => {
    setSequence(idsToSequence(powers, c.powers));
    setSelectedChainId(c.id);
    setNaming(null);
  };
  const newChain = () => {
    setSequence([]);
    setSelectedChainId(null);
    setNaming(null);
  };
  const onSaveClick = () => {
    if (sequence.length === 0) return;
    if (selectedChain) {
      updateAttackChain(selectedChain.id, currentIds);
      showToast({ message: `Saved "${selectedChain.name}"`, tone: 'success' });
    } else {
      setNaming({ mode: 'new', value: '' });
    }
  };
  const startNaming = (mode: 'saveas' | 'rename') =>
    setNaming({ mode, value: mode === 'rename' ? selectedChain?.name ?? '' : '' });
  const confirmNaming = () => {
    if (!naming) return;
    const name = naming.value.trim();
    if (!name) return;
    if (naming.mode === 'rename') {
      if (selectedChain) renameAttackChain(selectedChain.id, name);
    } else {
      const id = saveAttackChain(name, currentIds);
      setSelectedChainId(id);
      showToast({ message: `Saved "${name}"`, tone: 'success' });
    }
    setNaming(null);
  };
  const onDelete = () => {
    if (!selectedChain) return;
    const nm = selectedChain.name;
    deleteAttackChain(selectedChain.id);
    setSelectedChainId(null);
    setSequence([]);
    showToast({ message: `Deleted "${nm}"`, tone: 'info' });
  };

  // Grab a bar to reorder its cast. Hit-tests pointer-x against every bar's
  // centre (sorted by screen position == sequence order) to find the insert gap
  // 0..N, and parks a full-height insert cursor at that gap's leading edge. On
  // release we map the gap to a target index (accounting for removing the
  // source) and commit — replayChain then re-packs the timeline once.
  const startBarDrag = (e: React.PointerEvent, from: number) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation(); // don't let the timeline pan handler fire
    e.preventDefault();
    reorderRef.current = { from, insertAt: from };

    const update = (clientX: number) => {
      const cont = lanesRef.current;
      const st = reorderRef.current;
      if (!cont || !st) return;
      const bars = (Array.from(cont.querySelectorAll('[data-bar]')) as HTMLElement[])
        .map((el) => ({ seq: Number(el.dataset.seq), rect: el.getBoundingClientRect() }))
        .sort((a, b) => a.rect.left - b.rect.left);
      if (bars.length === 0) return;
      let insertAt = 0;
      for (const b of bars) if (clientX > b.rect.left + b.rect.width / 2) insertAt++;
      const atEnd = insertAt >= bars.length;
      const edge = atEnd ? bars[bars.length - 1].rect.right : bars[insertAt].rect.left;
      st.insertAt = insertAt;
      setReorder({ from: st.from, left: edge - cont.getBoundingClientRect().left });
    };

    update(e.clientX);
    const move = (ev: PointerEvent) => update(ev.clientX);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const st = reorderRef.current;
      reorderRef.current = null;
      setReorder(null);
      if (st) {
        const to = st.insertAt > st.from ? st.insertAt - 1 : st.insertAt;
        reorderSeq(st.from, to);
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // Sort palette: attacks first, then everything else (buff/utility) by metric.
  // Rank attacks ahead of non-attacks, then order by the chosen metric — a total
  // order (the old `attack ? -1 : 1` form was non-antisymmetric once a third
  // 'buff' type existed, giving buff-vs-utility an arbitrary order).
  const palette = useMemo(() => {
    const rank = (p: ChainPower) => (p.type === 'attack' ? 0 : 1);
    return powers
      .map((p, i) => ({ p, i }))
      .sort((a, b) => {
        if (rank(a.p) !== rank(b.p)) return rank(a.p) - rank(b.p);
        return metricVal(b.p) - metricVal(a.p);
      });
  }, [powers, powerMetric, globalRech, rechargeBounds]);

  const usedPis = useMemo(() => [...new Set(activations.map((a) => a.pi))], [activations]);
  // Metric-intensity reference over the WHOLE build (not just the chain) so a
  // power's color is stable and identical across the palette and timeline — the
  // visual link between the two areas.
  const maxMetric = useMemo(
    () => Math.max(0, ...powers.map((p) => metricVal(p))),
    [powers, powerMetric, globalRech, rechargeBounds],
  );

  const cycleSec = result?.cycleSec ?? 0;
  const maxCdEnd = activations.length
    ? Math.max(
        ...activations.map(
          (a) => a.start + (rechargeBounds ? effectiveRecharge(powers[a.pi], globalRech, rechargeBounds) : 0),
        ),
      )
    : 0;
  const displaySec = Math.max(cycleSec, maxCdEnd);
  const displayW = displaySec * px;
  const end = result?.endurance ?? null;
  // Instant endurance restored by click recovery powers (Dark Consumption etc.)
  // — a lump (refills on cast, not over time). Sum across the distinct recovery
  // powers in the chain, capped at the bar.
  // Without an archetype there is no bar to cap the lump against, so it stays uncapped rather
  // than being clamped to an invented one — the same reason `endParams` is nullable.
  const clickRestore = usedPis.reduce((s, pi) => s + (powers[pi].endGain ?? 0), 0);
  const instantRestore = endParams ? Math.min(endParams.maxEnd, clickRestore) : clickRestore;
  // Continuous net shown as "Net end" = Recovery − Spend, so the three /s stats
  // reconcile. Click recovery is a lump (instantRestore) and feeds Sustain
  // instead — folding its averaged rate into Net end here would make the visible
  // Recovery/Spend/Net numbers fail to add up.
  const passiveNet = end ? end.recoveryPerSec - end.togglePerSec - end.attackPerSec : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Attack Chain Builder" size="full">
      <div className="space-y-3 text-[13px] text-gray-300 p-0.5">
        {/* Saved chains — named rotations stored on the character */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/40 px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Chains</span>
          <div className="flex flex-wrap items-center gap-1">
            {savedChains.map((c) => {
              const active = c.id === selectedChainId;
              return (
                <button
                  key={c.id}
                  onClick={() => loadChain(c)}
                  className={`h-7 px-2.5 rounded border text-xs ${
                    active
                      ? 'border-emerald-500 text-gray-100 bg-emerald-900/20'
                      : 'border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                  title={active && modified ? `${c.name} — unsaved changes` : c.name}
                >
                  {c.name}
                  {active && modified && <span className="text-amber-400" aria-label="unsaved"> •</span>}
                </button>
              );
            })}
            <button
              onClick={newChain}
              className={`h-7 px-2.5 rounded border border-dashed text-xs ${
                selectedChainId === null
                  ? 'border-emerald-600 text-gray-200'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
              title="Start a new, unsaved chain"
            >
              + New
            </button>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {naming ? (
              <>
                <input
                  autoFocus
                  value={naming.value}
                  onChange={(e) => setNaming((n) => (n ? { ...n, value: e.target.value } : n))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmNaming();
                    if (e.key === 'Escape') setNaming(null);
                  }}
                  placeholder={naming.mode === 'rename' ? 'New name' : 'Chain name'}
                  className="h-7 w-40 px-2 bg-gray-800 border border-gray-700 rounded text-gray-200 text-xs"
                />
                <button
                  onClick={confirmNaming}
                  disabled={!naming.value.trim()}
                  className="h-7 px-2.5 rounded border border-emerald-600 text-emerald-300 text-xs hover:border-emerald-400 disabled:opacity-40"
                >
                  Save
                </button>
                <button
                  onClick={() => setNaming(null)}
                  className="h-7 px-2 rounded border border-gray-700 text-gray-400 text-xs hover:border-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onSaveClick}
                  disabled={sequence.length === 0 || (!!selectedChain && !modified)}
                  className="h-7 px-2.5 rounded border border-gray-700 text-gray-300 text-xs hover:border-gray-500 disabled:opacity-40"
                  title={selectedChain ? 'Save changes to this chain' : 'Save the current rotation as a new chain'}
                >
                  {selectedChain ? 'Save' : 'Save as…'}
                </button>
                {selectedChain && (
                  <>
                    <button
                      onClick={() => startNaming('saveas')}
                      disabled={sequence.length === 0}
                      className="h-7 px-2.5 rounded border border-gray-700 text-gray-300 text-xs hover:border-gray-500 disabled:opacity-40"
                      title="Save the current rotation as a new chain"
                    >
                      Save as…
                    </button>
                    <button
                      onClick={() => startNaming('rename')}
                      className="h-7 px-2.5 rounded border border-gray-700 text-gray-300 text-xs hover:border-gray-500"
                    >
                      Rename
                    </button>
                    <button
                      onClick={onDelete}
                      className="h-7 px-2.5 rounded border border-gray-700 text-red-400/80 text-xs hover:border-red-500/60 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Form selector — only for builds that have a form to switch into. A form's
              * attacks can't be used outside it and human attacks can't be used inside it,
              * so a chain lives in one form; switching here rebuilds the candidate list. */}
            {formModes.length > 0 && (
              <div className="flex items-center gap-1" role="group" aria-label="Caster form">
                <span className="text-[11px] text-gray-500 mr-0.5">Form</span>
                {[null, ...formModes].map((mode) => {
                  const isActive = formMode === mode;
                  return (
                    <button
                      key={mode ?? 'human'}
                      type="button"
                      onClick={() => setFormMode(mode)}
                      aria-pressed={isActive}
                      className={`px-2 py-0.5 text-[11px] rounded border transition-colors ${
                        isActive
                          ? 'bg-[var(--color-selected)]/40 border-[var(--color-selected)] text-[var(--color-link)]'
                          : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {mode === null ? 'Human' : modeLabel(mode)}
                    </button>
                  );
                })}
              </div>
            )}
            <label className="flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={effectWindowsOn}
                onChange={(e) => setEffectWindowsOn(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 accent-amber-500"
              />
              Buff/debuff windows
            </label>
            {fastSnipe && (
              <label
                className="flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer select-none"
                title={
                  toHitMeetsThreshold
                    ? `Your always-on ToHit (${permanentToHit.toFixed(1)}%) already clears the +${fastSnipe.threshold}% fast-snipe threshold, so snipes cast quick regardless of Combat Mode.`
                    : `Snipes cast quick while in combat (kEngaged) or with +${fastSnipe.threshold}% ToHit. Turn on Combat Mode to use the quick form; otherwise the slow charged cast is shown. Your always-on ToHit is ${permanentToHit.toFixed(1)}%.`
                }
              >
                <input
                  type="checkbox"
                  checked={combatMode || toHitMeetsThreshold}
                  disabled={toHitMeetsThreshold}
                  onChange={toggleCombatMode}
                  className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 accent-amber-500 disabled:opacity-50"
                />
                Combat Mode (quick snipe)
              </label>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500 mr-1">Zoom</span>
            <button
              onClick={() => setPx((v) => Math.max(MIN_PX, Math.round(v / 1.3)))}
              className="w-7 h-7 rounded border border-gray-700 hover:border-gray-500 text-gray-400"
            >
              −
            </button>
            <button
              onClick={() => setPx((v) => Math.min(MAX_PX, Math.round(v * 1.3)))}
              className="w-7 h-7 rounded border border-gray-700 hover:border-gray-500 text-gray-400"
            >
              +
            </button>
            <button
              onClick={() => {
                // Fit the whole loop (incl. a long recharge) into the visible
                // width in one click — sizes px so displaySec spans the track.
                const el = scrollRef.current;
                if (!el || displaySec <= 0) return;
                const avail = el.clientWidth - LABEL_W - 8;
                if (avail > 0) setPx(Math.max(MIN_PX, Math.min(MAX_PX, avail / displaySec)));
              }}
              className="ml-1 h-7 px-2.5 rounded border border-gray-700 hover:border-gray-500 text-gray-400 text-xs"
              title="Fit the whole cycle (including recharge) to the window"
            >
              Fit
            </button>
            <button
              onClick={clear}
              className="ml-1 h-7 px-2.5 rounded border border-gray-700 hover:border-gray-500 text-gray-400 text-xs"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Simulates recharge buffs and debuffs. Drag to simulate a global recharge buff (right) or an enemy −recharge debuff (left) and watch the rotation's cycle/DPS respond live. Check how much −recharge your build can eat before the chain degrades. */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                +/- Recharge Simulation
              </span>
              <span className="text-[11px] text-gray-600">
                Build <span className="text-emerald-400 font-medium">+{fmt(unsimulatedRech, 0)}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] tabular-nums">
                {extraRech === 0 ? (
                  <span className="text-gray-500">No adjustment</span>
                ) : extraRech > 0 ? (
                  <span className="text-emerald-400">
                    +{fmt(extraRech, 0)}% simulated → <span className="font-medium">+{fmt(globalRech, 0)}%</span> global
                  </span>
                ) : (
                  <span className="text-amber-400">
                    −{fmt(-extraRech, 0)}% simulated debuff → <span className="font-medium">{globalRech >= 0 ? '+' : ''}{fmt(globalRech, 0)}%</span> global
                  </span>
                )}
              </span>
              {extraRech !== 0 && (
                <button
                  onClick={() => setExtraRech(0)}
                  className="h-5 px-1.5 rounded border border-gray-700 text-gray-400 text-[10px] hover:border-gray-500"
                  title="Reset the what-if recharge to your build's value"
                >
                  Reset
                </button>
              )}
              <button
                onClick={openWhatIfBuffsModal}
                className="h-5 px-1.5 rounded border border-gray-700 text-gray-400 text-[10px] hover:border-gray-500"
                title="Every other stat a teammate can buff — the same layer this slider writes to"
              >
                All team buffs…
              </button>
            </div>
          </div>

          {/* Track: amber (debuff) ← 0 → emerald (buff), with a range input over it. */}
          <div className="relative h-5">
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full"
              style={{
                background: `linear-gradient(90deg, rgba(224,160,46,0.55) 0%, rgba(224,160,46,0.18) ${whatIfTrackPct(0).toFixed(1)}%, rgba(52,211,153,0.18) ${whatIfTrackPct(0).toFixed(1)}%, rgba(52,211,153,0.55) 100%)`,
              }}
            />
            {WHATIF_RECH_TICKS.map((t) => (
              <div
                key={t}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full ${
                  t === 0 ? 'w-0.5 h-4 bg-gray-300' : 'w-px h-2.5 bg-gray-600'
                }`}
                style={{ left: `${whatIfTrackPct(t)}%` }}
              />
            ))}
            <input
              type="range"
              min={WHATIF_RECH_MIN}
              max={WHATIF_RECH_MAX}
              step={WHATIF_RECH_STEP}
              value={extraRech}
              onChange={(e) =>
                setExtraRech(
                  Math.max(WHATIF_RECH_MIN, Math.min(WHATIF_RECH_MAX, Number(e.target.value) || 0)),
                )
              }
              aria-label="What-if global recharge (negative simulates an enemy recharge debuff)"
              className="absolute inset-0 w-full h-5 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-400 [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-gray-400 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Tick labels — click to jump to a preset debuff/buff amount. */}
          <div className="relative h-4 mt-1">
            {WHATIF_RECH_TICKS.map((t) => (
              <button
                key={t}
                onClick={() => setExtraRech(t)}
                className={`absolute -translate-x-1/2 text-[9px] tabular-nums hover:text-gray-200 ${
                  t === 0
                    ? 'text-gray-300 font-medium'
                    : t < 0
                      ? 'text-amber-500/70'
                      : 'text-emerald-500/70'
                }`}
                style={{ left: `${whatIfTrackPct(t)}%` }}
                title={`Set what-if recharge to ${t > 0 ? '+' : ''}${t}%`}
              >
                {t > 0 ? '+' : ''}
                {t}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center mt-0.5 gap-2">
            <span className="text-[9px] text-amber-500/60 whitespace-nowrap">◄ enemy −recharge</span>
            <span className="text-[9px] text-gray-600 text-center">
              −recharge floors at 4× base (−75%) — a power never fully stops
            </span>
            <span className="text-[9px] text-emerald-500/60 whitespace-nowrap">recharge buff ►</span>
          </div>

          {/* At-the-floor notice: a correct 4× cap otherwise reads as a stuck
              slider, so say so plainly. */}
          {rechargeFloor.floored > 0 && (
            <div className="mt-2 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[10px] leading-snug text-amber-300">
              {rechargeFloor.all
                ? 'Ooof. You’ve hit the −recharge floor. Every power in the chain is capped at 4× its base recharge (the game’s −75% net-strength limit), Add global recharge or slot recharge for more punishment.'
                : `You’re at your −recharge floor on ${rechargeFloor.floored} of ${rechargeFloor.total} chain powers. They are capped at 4× base recharge and won’t slow further; the rest still have recharge headroom before they cap.`}
            </div>
          )}

          {/* The rest of the chain-moving team buffs. Each slider spans the archetype's OWN
              exported ceiling for that stat, mirrored to the debuff side — the game caps the
              buff half, and a hand-set range would be a guess about a number the export owns. */}
          <div className="mt-3 border-t border-gray-800 pt-2 space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Other team buffs this chain responds to
            </div>
            {otherWhatIf.map((row) => {
              const simulated = whatIfBuffs[row.stat] ?? 0;
              const label = row.control?.label ?? row.stat;
              return (
                <div key={row.stat} className="flex items-center gap-2 text-[11px]">
                  <span className="w-28 shrink-0 truncate" style={{ color: row.control?.color }}>
                    {label}
                  </span>
                  <span className="w-20 shrink-0 text-right tabular-nums text-gray-600">
                    Build {fmt(row.fromBuild, 0)}
                  </span>
                  {row.ceiling === null ? (
                    <span className="flex-1 text-[10px] text-amber-400/80">
                      no exported ceiling for this archetype — value only
                    </span>
                  ) : (
                    <input
                      type="range"
                      min={-row.ceiling}
                      max={row.ceiling}
                      step={5}
                      value={simulated}
                      onChange={(e) => setWhatIfBuff(row.stat, Number(e.target.value) || 0)}
                      aria-label={`${label} team-buff simulation`}
                      className="flex-1 h-4 cursor-pointer accent-purple-400"
                    />
                  )}
                  <input
                    type="number"
                    step={5}
                    value={simulated}
                    onChange={(e) => setWhatIfBuff(row.stat, Number(e.target.value) || 0)}
                    aria-label={`${label} team-buff simulation, exact value`}
                    className="w-16 shrink-0 rounded border border-gray-700 bg-gray-900 px-1 py-0.5 text-right tabular-nums text-gray-200"
                  />
                  <span
                    className={`w-24 shrink-0 text-right tabular-nums ${
                      simulated === 0 ? 'text-gray-600' : simulated > 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {simulated === 0 ? '—' : `→ ${fmt(row.current, 0)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Palette */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Available powers — tap to add
            </div>
            <label className="flex items-center gap-1.5 text-[10px] text-gray-500">
              Rank by
              <select
                value={powerMetric}
                onChange={(e) => setPowerMetric(e.target.value as PowerMetric)}
                className="h-6 px-1.5 bg-gray-800 border border-gray-700 rounded text-gray-200 text-[11px]"
                title="Metric that ranks powers — palette order, color intensity, and compactness weighting"
              >
                <option value="damage">Damage (total dmg)</option>
                <option value="dpa">DPA (dmg / actvn)</option>
                <option value="dps">DPS (dmg / actvn + rech)</option>
              </select>
            </label>
          </div>
          {palette.length === 0 ? (
            <div className="text-[12px] text-gray-500 py-2">
              No click attacks in this build yet. Add some powers first.
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {palette.map(({ p, i }) => {
                const rel = maxMetric > 0 ? metricVal(p) / maxMetric : 0;
                // Powers that carry a special chain mechanic: an alternate cast
                // form (snipes, Energy Transfer, Assassin's Strike from-Hide) or
                // a charge that enables one (Total Focus, Placate). Flag them so
                // the build/spend pieces stand out; the hint is trigger-aware.
                const specialForm = p.forms?.find((f) => f.kind === 'fast') ?? p.forms?.[0];
                const special = specialForm
                  ? specialForm.trigger.type === 'tohit'
                    ? `Has a fast form — auto-fires with ≥${specialForm.trigger.threshold}% ToHit (Build Up / Aim / Tactics)`
                    : specialForm.trigger.type === 'hidden'
                      ? `Has a slow from-Hide form — auto-fires as the opener or right after Placate`
                      : `Has a ${specialForm.label} fast form — auto-fires when its charge is available`
                  : p.grants === 'hidden'
                    ? `Re-Hides you — lets the next Assassin's Strike use its from-Hide form`
                    : p.grants
                      ? `Grants ${p.grants.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} — enables a fast form later in the chain`
                      : null;
                return (
                  <button
                    key={p.id}
                    onClick={() => addPower(i)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-700 hover:border-gray-500 text-gray-200 text-xs"
                    style={{
                      borderLeftWidth: 2,
                      borderLeftColor: barFill(p.type, rel),
                      background: chipBg(p.type, rel),
                      ...(special && { boxShadow: 'inset 0 0 0 1px rgba(255,224,138,0.55)' }),
                    }}
                    title={`${p.name} · cast ${fmt(p.cast, 2)}s · rech ${fmt(p.baseRecharge, 1)}s · ${fmt(metricVal(p), powerMetric === 'damage' ? 0 : 1)} ${METRIC_LABEL[powerMetric]}${special ? `\n⚡ ${special}` : ''}`}
                  >
                    {special && <span style={{ color: '#FFE08A', fontSize: 10, lineHeight: 1 }}>⚡</span>}
                    <span>{p.name}</span>
                    <span className="text-[10px] text-gray-500">{fmt(p.cast, 2)}s</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Chain timeline
              <span className="font-normal normal-case text-gray-600"> · drag a bar to reorder</span>
            </span>
            <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[10px] text-gray-500">
              <span className="flex items-center gap-1.5">
                low
                <span
                  className="inline-block w-12 h-2 rounded"
                  style={{ background: `linear-gradient(90deg, ${barFill('attack', 0)}, ${barFill('attack', 1)})` }}
                />
                high {METRIC_LABEL[powerMetric]}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-2 rounded-sm" style={{ background: '#1D9E75', opacity: 0.55 }} />
                active time
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-2 rounded-sm" style={{ background: '#E24B4A', opacity: 0.65 }} />
                dead time
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-2 rounded-sm" style={{ background: READY_FILL }} />
                waiting
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-[2px] h-2.5 rounded-sm" style={{ background: '#F2A83A', opacity: 0.85 }} />
                DoT tick
              </span>
              {effectWindowsOn && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-2 rounded-sm" style={{ background: WINDOW_COLOR.buff }} />
                    buff
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-2 rounded-sm" style={{ background: WINDOW_COLOR.debuff }} />
                    debuff
                  </span>
                </>
              )}
              {result && (
                <span
                  className={
                    result.efficiency >= 95
                      ? 'text-emerald-400'
                      : result.efficiency >= 80
                        ? 'text-amber-400'
                        : 'text-red-400'
                  }
                >
                  {result.efficiency >= 95 ? 'Tight loop' : `${fmt(result.deadTime, 2)}s dead`}
                </span>
              )}
            </div>
          </div>

          {activations.length === 0 ? (
            <div className="text-[12px] text-gray-500 py-6 text-center">
              Tap powers above to build a chain.
            </div>
          ) : (
            <div
              ref={scrollRef}
              onPointerDown={onTimelinePointerDown}
              className="overflow-x-auto select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {/* Lanes */}
              <div ref={lanesRef} style={{ position: 'relative', minWidth: LABEL_W + displayW }}>
                {usedPis.map((pi) => {
                  const p = powers[pi];
                  const rel = maxMetric > 0 ? metricVal(p) / maxMetric : 0;
                  const mine = activations.filter((a) => a.pi === pi);
                  const effRech = rechargeBounds ? effectiveRecharge(p, globalRech, rechargeBounds) : 0;
                  const cdW = Math.max(0, effRech - p.cast) * px;
                  return (
                    <div key={pi} style={{ display: 'flex', alignItems: 'center', height: LANE_H, marginBottom: 3 }}>
                      <div
                        style={{ width: LABEL_W, flexShrink: 0, paddingRight: 8 }}
                        className="text-[11px] text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis"
                        title={p.name}
                      >
                        {p.name}
                        {mine.length > 1 && <span className="text-gray-600"> ×{mine.length}</span>}
                      </div>
                      <div style={{ position: 'relative', height: LANE_H, width: displayW, flexShrink: 0 }}>
                        {mine.map((act, mi) => {
                          const x = act.start * px;
                          // An alternate form (e.g. fast Energy Transfer) shortens
                          // the animation — the bar width must follow the form's
                          // cast, not the base, or a fast cast would render long.
                          const form = act.formId ? p.forms?.find((f) => f.id === act.formId) : undefined;
                          const effCast = form?.cast ?? p.cast;
                          const w = Math.max(effCast * px, 6);
                          // Recharge overshoot ("waiting"): from when this
                          // cast's recharge completes (or its animation ends, if
                          // it recharges mid-cast) until the next cast of this
                          // power — the next in-lane cast, or across the loop
                          // boundary. Clipped to the cycle so it doesn't spill
                          // into the next loop.
                          const overStart = Math.max(act.start + effRech, act.end);
                          const nextStart =
                            mi + 1 < mine.length ? mine[mi + 1].start : mine[0].start + cycleSec;
                          const overEnd = Math.min(nextStart, cycleSec);
                          const overW = overEnd - overStart;
                          // Buff/debuff "active window": colour the stem from the
                          // cast's end to expiry (cast + duration), clipped to the
                          // visible track. The colour edge marks when the effect
                          // falls off — the moment to refresh.
                          const win = effectWindowsOn ? p.effectWindow : undefined;
                          const winLeft = x + w;
                          const winW = win
                            ? Math.min(act.start + win.duration, displaySec) * px - winLeft
                            : 0;
                          return (
                            <div key={act.seq}>
                              {/* recharge (cooldown) */}
                              {cdW > 0 && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: x + w,
                                    top: LANE_H / 2 - 3,
                                    width: cdW,
                                    height: 6,
                                    background: cdFill(p.type),
                                    borderRadius: '0 2px 2px 0',
                                  }}
                                />
                              )}
                              {/* waiting (recharge overshoot) */}
                              {overW > 0.001 && (
                                <div
                                  title={`waiting ${fmt(overW, 2)}s — ${p.name} has recharged but you're still mid-animation`}
                                  style={{
                                    position: 'absolute',
                                    left: overStart * px,
                                    top: LANE_H / 2 - 3,
                                    width: overW * px,
                                    height: 6,
                                    background: READY_FILL,
                                    borderRadius: 2,
                                  }}
                                />
                              )}
                              {/* buff/debuff active window — colours the stem
                                  over the cooldown/idle bars until the effect
                                  expires (the colour edge = refresh point). */}
                              {win && winW > 0 && (
                                <div
                                  title={`${p.name} ${win.kind} active ${fmt(win.duration, 0)}s — colour ends at expiry`}
                                  style={{
                                    position: 'absolute',
                                    left: winLeft,
                                    top: LANE_H / 2 - 3,
                                    width: winW,
                                    height: 6,
                                    background: WINDOW_COLOR[win.kind],
                                    borderRadius: '0 2px 2px 0',
                                    zIndex: 1,
                                  }}
                                />
                              )}
                              {/* after-cast DoT ticks */}
                              {p.dot &&
                                Array.from({ length: p.dot.ticks }).map((_, t) => {
                                  const tickT = act.start + effCast + (t + 1) * p.dot!.period;
                                  const inWin = tickT <= cycleSec;
                                  // Fade each mark by its landing probability so
                                  // cancel-on-miss / chance-gated decay reads visually.
                                  const prob = chainDotTickProbability(p.dot!, t + 1);
                                  return (
                                    <div
                                      key={t}
                                      style={{
                                        position: 'absolute',
                                        left: tickT * px - 1,
                                        top: (LANE_H - 10) / 2,
                                        width: 2,
                                        height: 10,
                                        background: '#F2A83A',
                                        borderRadius: 1,
                                        opacity: (inWin ? 0.85 : 0.25) * prob,
                                        zIndex: 2,
                                      }}
                                    />
                                  );
                                })}
                              {/* activation bar (drag to reorder) + remove ✕ */}
                              <div
                                className="group cursor-grab active:cursor-grabbing touch-none"
                                data-bar
                                data-seq={act.seq}
                                onPointerDown={(e) => {
                                  if (act.seq !== undefined) startBarDrag(e, act.seq);
                                }}
                                style={{
                                  position: 'absolute',
                                  left: x,
                                  top: 3,
                                  width: w,
                                  height: LANE_H - 6,
                                  background: barFill(p.type, rel),
                                  borderRadius: 3,
                                  zIndex: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  overflow: 'visible',
                                  ...(reorder?.from === act.seq && {
                                    boxShadow: `0 0 0 2px ${CURSOR_COLOR}, 0 3px 8px rgba(0,0,0,0.45)`,
                                    zIndex: 3,
                                  }),
                                }}
                                title={`${p.name}${form ? ` · ${form.label} (${fmt(effCast, 2)}s)` : ''} @ ${fmt(act.start, 2)}s — drag to reorder`}
                              >
                                {/* Active-form badge (e.g. ⚡ fast Energy Transfer).
                                    Marks casts the engine upgraded to an alternate
                                    form so the shortened bar isn't mistaken for a
                                    different power. */}
                                {form && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      left: 2,
                                      top: 1,
                                      fontSize: 9,
                                      lineHeight: 1,
                                      color: '#FFE08A',
                                      pointerEvents: 'none',
                                      zIndex: 3,
                                    }}
                                  >
                                    ⚡
                                  </span>
                                )}
                                {/* Larger transparent hit target around a small
                                    visible dot — forgiving to click, especially
                                    on narrow (fast-cast) bars. */}
                                <button
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onClick={() => {
                                    if (act.seq !== undefined) removeBar(act.seq);
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: -9,
                                    right: -9,
                                    width: 26,
                                    height: 26,
                                    padding: 0,
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    touchAction: 'none',
                                  }}
                                  title="Remove this power"
                                >
                                  <span
                                    className="opacity-40 group-hover:opacity-100 transition-opacity"
                                    style={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: 8,
                                      background: '#1a2335',
                                      border: '1px solid rgba(255,255,255,0.2)',
                                      color: '#c8d4e0',
                                      fontSize: 9,
                                      lineHeight: 1,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    ✕
                                  </span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* loop boundary line */}
                <div
                  style={{
                    position: 'absolute',
                    left: LABEL_W + cycleSec * px,
                    top: 0,
                    width: 2,
                    height: '100%',
                    background: '#1D9E75',
                    opacity: 0.55,
                  }}
                />

                {/* reorder insert cursor — full-height line marking the drop gap */}
                {reorder && (
                  <div
                    style={{
                      position: 'absolute',
                      left: reorder.left - 2,
                      top: 0,
                      width: 4,
                      height: '100%',
                      background: CURSOR_COLOR,
                      borderRadius: 2,
                      boxShadow: `0 0 6px ${CURSOR_COLOR}`,
                      pointerEvents: 'none',
                      zIndex: 4,
                    }}
                  />
                )}
              </div>

              {/* Activity / dead-time bar */}
              <div style={{ position: 'relative', height: 8, marginLeft: LABEL_W, minWidth: displayW, marginTop: 4 }}>
                <div
                  style={{ position: 'absolute', left: 0, top: 1, width: cycleSec * px, height: 6, background: '#1D9E75', opacity: 0.25, borderRadius: 3 }}
                />
                {result?.deadGaps.map((g, i) => (
                  <div
                    key={i}
                    style={{ position: 'absolute', left: g.start * px, top: 1, width: (g.end - g.start) * px, height: 6, background: '#E24B4A', opacity: 0.65, borderRadius: 2 }}
                  />
                ))}
              </div>

              {/* Ruler */}
              <Ruler maxSec={displaySec} px={px} marginLeft={LABEL_W} />

              {/* Endurance sawtooth */}
              {end && (
                <EnduranceTrack end={end} px={px} cycleSec={cycleSec} marginLeft={LABEL_W} />
              )}
            </div>
          )}
        </div>

        {/* Rotation quick reference — the settled rotation order, copyable */}
        {sequence.length > 0 && (
          <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Rotation order
              </div>
              <button
                onClick={copySequence}
                className="h-6 px-2 rounded border border-gray-700 hover:border-gray-500 text-gray-400 text-[11px]"
                title="Copy the rotation order to the clipboard"
              >
                Copy
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[13px] leading-relaxed">
              {sequence.map((pi, idx) => {
                const p = powers[pi];
                if (!p) return null;
                return (
                  <span key={idx} className="flex items-center gap-1">
                    {idx > 0 && <span className="text-gray-600">→</span>}
                    <span style={{ color: `hsl(${TYPE_HUE[p.type]}, 55%, 72%)` }}>{p.name}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2">
          <Stat
            label="Cycle"
            value={result ? fmt(cycleSec, 2) : '—'}
            unit="s"
            help="How long one full loop of the rotation takes before it repeats. This is the last power's end time, OR — if a long-recharge power hasn't recovered by then — extended until every power is ready to fire again. Each power's animation lock (ArcanaTime) and its effective recharge are both built into this number."
          />
          <Stat
            label="Total dmg"
            value={result ? fmt(result.totalDamage, 0) : '—'}
            help="Total damage dealt across one full cycle — every power's hit, in-cycle damage-over-time ticks, and expected proc damage. DoT ticks that would land after the loop repeats are not counted."
          />
          <Stat
            label="DPS"
            value={result ? fmt(result.dps, 1) : '—'}
            help="Damage per second = Total damage ÷ Cycle time. The sustained throughput of the rotation, including any idle time inside the cycle."
          />
          <Stat
            label="Efficiency"
            value={result ? fmt(result.efficiency, 0) : '—'}
            unit="%"
            tone={result ? (result.efficiency >= 95 ? 'good' : result.efficiency < 80 ? 'warn' : undefined) : undefined}
            help="measures how often your character is activating powers (cycle − dead time) ÷ cycle. 100% = you are always activating something (the red gaps on the timeline are dead time)"
          />
          <Stat
            label="Compact."
            value={result && result.compactness !== null ? fmt(result.compactness, 0) : '—'}
            unit="%"
            tone={
              result && result.compactness !== null
                ? result.compactness >= 95
                  ? 'good'
                  : result.compactness < 80
                    ? 'warn'
                    : undefined
                : undefined
            }
            help="Compactness — measures how often powers are idle (off cooldown, waiting to be used), weighted by the selected power metric (damage / DPA / DPS). For each power: min(1, times activation × effective recharge ÷ cycle)"
          />
          <Stat
            label="Recovery"
            value={end ? `+${fmt(end.recoveryPerSec, 2)}` : '—'}
            unit="/s"
            tone="good"
            help="Endurance recovered per second from your recovery rate (before subtracting toggles and attack costs)."
          />
          {instantRestore > 0.5 && (
            <Stat
              label="Click +End"
              value={`+${fmt(instantRestore, 0)}`}
              unit="end"
              tone="good"
              help="Endurance restored per cycle by click recovery powers in the chain (Dark Consumption / Consume / Power Sink), scaled by your targets-hit setting for each."
            />
          )}
          <Stat
            label="Spend"
            value={end ? `−${fmt(end.togglePerSec + end.attackPerSec, 2)}` : '—'}
            unit="/s"
            help="Endurance drained per second: active toggle upkeep plus the average attack cost spread over the cycle."
          />
          <Stat
            label="Net end"
            value={end ? `${passiveNet >= 0 ? '+' : ''}${fmt(passiveNet, 2)}` : '—'}
            unit="/s"
            tone={end ? (passiveNet >= -0.001 ? 'good' : 'warn') : undefined}
            help="Recovery minus total spend, per second. Positive (green) = endurance grows over time; negative (amber) = the rotation drains your bar."
          />
          <Stat
            label="Sustain"
            value={
              !end
                ? '—'
                : end.stallTime !== null
                  ? `stall ${fmt(end.stallTime, 0)}s`
                  : end.sustainable
                    ? 'yes'
                    : `${fmt(end.timeToEmpty ?? 0, 0)}s`
            }
            tone={end ? (end.sustainable && end.stallTime === null ? 'good' : 'warn') : undefined}
            help="Can you run this rotation forever from a full bar? 'yes' = endurance never bottoms out. 'stall Ns' = the bar hits zero mid-cast at N seconds and the chain breaks. A bare 'Ns' = not stalling yet but slowly draining, emptying in about N seconds."
          />
        </div>
      </div>
    </Modal>
  );
}

function Ruler({ maxSec, px, marginLeft }: { maxSec: number; px: number; marginLeft: number }) {
  const interval = maxSec > 20 ? 5 : maxSec > 10 ? 2 : 1;
  const ticks: number[] = [];
  for (let t = 0; t <= Math.ceil(maxSec); t += interval) ticks.push(t);
  return (
    <div style={{ position: 'relative', height: 16, marginLeft, minWidth: maxSec * px, marginTop: 3 }}>
      {ticks.map((t) => (
        <div key={t} style={{ position: 'absolute', left: t * px, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 1, height: 4, background: 'rgba(255,255,255,0.14)' }} />
          <span className="text-[9px] text-gray-600 mt-0.5">{t}s</span>
        </div>
      ))}
    </div>
  );
}

function EnduranceTrack({
  end,
  px,
  cycleSec,
  marginLeft,
}: {
  end: NonNullable<ReturnType<typeof computeChain>>['endurance'];
  px: number;
  cycleSec: number;
  marginLeft: number;
}) {
  if (!end || end.track.length < 2) return null;
  const H = 38;
  const horizon = end.track[end.track.length - 1].t;
  const w = Math.max(horizon * px, 40);
  // Endurance is the game's blue bar; sustainability is conveyed by the Sustain
  // stat card and the red stall marker rather than recoloring the whole track.
  const color = '#3B9EE8';
  const pts = end.track.map((p) => `${p.t * px},${H - p.frac * H}`).join(' ');
  const areaPts = `0,${H} ${pts} ${w},${H}`;
  const loopLines: number[] = [];
  for (let t = cycleSec; t <= horizon + 0.01; t += cycleSec) loopLines.push(t);

  return (
    <div style={{ marginLeft, minWidth: w, marginTop: 6 }}>
      <div className="text-[9px] uppercase tracking-wide text-gray-600 mb-0.5">
        Endurance (from full)
      </div>
      <svg width={w} height={H} style={{ display: 'block' }}>
        <polygon points={areaPts} fill={color} opacity={0.16} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} opacity={0.85} />
        {loopLines.map((t, i) => (
          <line key={i} x1={t * px} y1={0} x2={t * px} y2={H} stroke="#1D9E75" strokeWidth={1} opacity={0.3} />
        ))}
        {end.stallTime !== null && (
          <circle cx={end.stallTime * px} cy={H} r={3} fill="#E24B4A" />
        )}
      </svg>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  tone,
  help,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: 'good' | 'warn';
  /** Plain-language explanation shown on hover (native tooltip). */
  help?: string;
}) {
  const color = tone === 'good' ? 'text-emerald-400' : tone === 'warn' ? 'text-amber-400' : 'text-gray-200';
  return (
    <div
      className={`rounded-md bg-gray-800/60 px-3 py-2.5${help ? ' cursor-help' : ''}`}
      title={help}
    >
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{label}</span>
        {help && <span className="text-[9px] text-gray-600 leading-none">ⓘ</span>}
      </div>
      <span className={`text-base font-medium ${color}`}>{value}</span>
      {unit && <span className="text-[11px] text-gray-500 ml-0.5">{unit}</span>}
    </div>
  );
}
