/**
 * Attack Chain Builder — pure timing / damage / endurance model.
 *
 * No app/data dependencies: the caller derives `ChainPower[]` from the live
 * build (recharge/cast/end/damage already enhanced) and feeds it here. This
 * module only does the *scheduling* (single-animation greedy packer, mirroring
 * the in-game constraint that you can only animate one power at a time and a
 * power's recharge does NOT begin until its cast animation finishes — so the
 * soonest it can fire again is cast-end + recharge, and its solo repeat period
 * is cast + recharge, matching the rest of the app's DPS convention) and the
 * *endurance simulation* (continuous recovery − toggle drain, minus the lump
 * end cost paid at each cast — so a spiky rotation can bottom out even when its
 * average net is positive).
 */

export type ChainPowerType = 'attack' | 'utility' | 'buff';

/** Damage-over-time that ticks AFTER the cast finishes (drawn as ticks on the
 *  timeline). DoT that lands during the cast is already folded into `damage`. */
export interface ChainDoT {
  ticks: number;
  /** seconds between ticks */
  period: number;
  /** enhanced damage per tick */
  perTick: number;
}

/** When an alternate form of a power is legal. The chain auto-picks the form
 *  whose trigger is satisfiable at a given cast: `charge` (Energy Transfer's
 *  fast cast, gated on an Energy Focus from Total Focus), `tohit` (fast snipe,
 *  permanent ToHit ≥ threshold or inside a Build Up/Aim window), `hidden`
 *  (Assassin's Strike's slow from-Hide form — opener or immediately post-Placate). */
export type FormTrigger =
  | { type: 'charge'; resource: string }
  | { type: 'tohit'; threshold: number }
  | { type: 'hidden' }
  | { type: 'manual' };

/** An alternate form of a ChainPower (e.g. fast Energy Transfer). Carries the
 *  same already-enhanced fields as the base power so the calc can read either
 *  via {@link effectiveCast} et al. */
export interface ChainForm {
  id: string;
  label: string;
  kind: 'fast' | 'slow';
  /** ArcanaTime for this form's animation. */
  cast: number;
  damage: number;
  endCost: number;
  dot?: ChainDoT | null;
  trigger: FormTrigger;
}

/** One power available to the chain, with values already enhanced for the build. */
export interface ChainPower {
  id: string;
  name: string;
  type: ChainPowerType;
  /** ArcanaTime — the animation lock, in seconds (also the recharge anchor). */
  cast: number;
  /** Raw base recharge (seconds), BEFORE enhancement/global — so a what-if
   *  global-recharge slider can be applied on top. */
  baseRecharge: number;
  /** Slotted recharge enhancement as a fraction (e.g. 0.95 = +95%). */
  rechargeEnh: number;
  /** True for powers with a flat, unenhanceable recharge (Incarnate Judgement)
   *  — no IO slots, and neither slotted nor global recharge bonuses apply.
   *  `effectiveRecharge` returns `baseRecharge` unchanged when set. */
  fixedRecharge?: boolean;
  /** Enhanced endurance cost per activation. */
  endCost: number;
  /** Self endurance GAINED per activation (Dark Consumption / Consume / Power
   *  Sink), scaled by the user's targets-hit slider for the power. A flat
   *  endurance amount paid back at the cast. 0/undefined = none. */
  endGain?: number;
  /** Average direct damage per activation (includes in-cast DoT + buffs). */
  damage: number;
  /** After-cast DoT, drawn as ticks (its damage is included in `damage`). */
  dot?: ChainDoT | null;
  /** A self-buff or foe-debuff window (seconds), drawn as a translucent "active"
   *  band on the timeline. `buff` (Build Up / Aim / Soul Drain) shows which
   *  attacks are buffed; `debuff` (Touch of Fear −ToHit, −Res, …) shows when the
   *  debuff expires so you can time a refresh rather than recast on cooldown.
   *  undefined = neither. Durations are flat (not enhanceable). */
  effectWindow?: { kind: 'buff' | 'debuff'; duration: number };
  /** Alternate cast forms (fast/slow), if any. The flat fields above are the
   *  default form; a form overrides cast/damage/endCost for casts that use it. */
  forms?: ChainForm[];
  /** Resource (charge) this power grants when cast, e.g. Total Focus → the
   *  `energy_focus` that lets a later Energy Transfer fire its fast form. */
  grants?: string;
  /** Window (seconds) this power's ToHit buff stays active — Build Up / Aim /
   *  Soul Drain. A snipe cast inside it fires its fast form (the fast-snipe
   *  ≥22% ToHit rule). undefined = no ToHit buff. */
  tohitWindow?: number;
}

/** A scheduled cast: `pi` indexes into the ChainPower[] passed alongside. */
export interface Activation {
  pi: number;
  start: number;
  end: number;
  /** index into the pick-order sequence (for per-bar removal). */
  seq?: number;
  /** Which alternate form this cast uses ({@link ChainForm.id}); undefined =
   *  the power's default/base form. */
  formId?: string;
}

export interface EnduranceParams {
  /** 100 + maxEndurance bonus. */
  maxEnd: number;
  /** Endurance recovered per second (recovery rate). */
  recoveryPerSec: number;
  /** Endurance drained per second by active toggles. */
  togglePerSec: number;
}

export interface DeadGap {
  start: number;
  end: number;
}

/** A vertex on the endurance-over-time track (for the area chart). */
export interface EndPoint {
  t: number;
  /** endurance as a fraction of maxEnd, clamped [0, 1] */
  frac: number;
}

export interface EnduranceResult {
  /** recovery − toggles − attack spend, per second (steady-state average). */
  netPerSec: number;
  recoveryPerSec: number;
  togglePerSec: number;
  /** attack endurance spent per second over the cycle (gross cost). */
  attackPerSec: number;
  /** net endurance gained/lost per full loop (netPerSec × cycleSec). Analytic
   *  (counts the full click gain); `sustainable`/`stallTime` come from the
   *  clamped sim instead, which discards endurance wasted over the cap. */
  perLoopDelta: number;
  sustainable: boolean;
  /** From a full bar: seconds until empty (null when sustainable). */
  timeToEmpty: number | null;
  /** From a full bar: the first time endurance would hit 0 mid-cast and the
   *  chain stalls (null when it never stalls within the horizon). */
  stallTime: number | null;
  /** Piecewise-linear endurance track from a full bar, for the viz. */
  track: EndPoint[];
  /** How many loops the `track` spans. */
  trackLoops: number;
}

export interface ChainResult {
  cycleSec: number;
  totalDamage: number;
  dps: number;
  /** endurance spent per second (attacks only). */
  endPerSec: number;
  deadTime: number;
  deadGaps: DeadGap[];
  /** 0–100; share of the cycle spent animating (not idle). */
  efficiency: number;
  /** 0–100; damage-weighted recharge utilization — how close each damaging
   *  power comes to firing exactly on cooldown every loop (100 = perfectly
   *  compact; lower means a power sits "waiting" while another animation
   *  plays). null when the chain deals no damage. Distinct from efficiency:
   *  efficiency asks "are you ever idle", compactness asks "when a power is
   *  ready, do you fire it immediately". */
  compactness: number | null;
  endurance: EnduranceResult | null;
  /** max per-activation damage in the chain — drives relative-damage coloring. */
  maxDamage: number;
}

const EPS = 0.001;

/**
 * How powers are ranked / weighted everywhere in the builder (palette order,
 * color intensity, compactness weighting). All three are STABLE per-power
 * values (no dependence on how many times the power is cast this rotation), so a
 * power's color/rank doesn't shift as you build the chain.
 *  - damage: per-cast damage (direct + full DoT) — "how big is the hit".
 *  - dpa:    damage ÷ cast time — damage per second of animation (the classic
 *            attack-chain metric for choosing fillers).
 *  - dps:    damage ÷ (cast + recharge) — sustained single-power throughput.
 */
export type PowerMetric = 'damage' | 'dpa' | 'dps';

/**
 * Smallest the recharge divisor `(1 + strength)` may reach. City of Heroes
 * clamps *net* recharge strength (all buffs − all debuffs) to a minimum of
 * −75%, so the divisor floors at 0.25 and a power can be slowed to AT MOST 4×
 * its base recharge — it never stops recharging or goes negative, however deep
 * the −recharge debuff. This is what makes the what-if debuff slider safe: the
 * denominator can't cross zero.
 *
 * Note this is DELIBERATELY different from perma.ts's `Math.max(1, …)`, which is
 * a buff-only view where a debuff is a no-op (a perma power can't be pushed
 * above base by an enemy). It's also distinct from the −90% movement-speed floor
 * — recharge and movement clamp independently. Source: Homecoming/Fandom wikis
 * "Recharge" & "Limits" (net strength ∈ [−0.75, +4.0]).
 */
export const MIN_RECHARGE_DENOM = 0.25;

/** Effective recharge after enhancement + (build + what-if) global recharge,
 *  with the game's −75% net-strength floor so a recharge debuff can slow a power
 *  to at most 4× base rather than blowing the divisor past zero. */
export function effectiveRecharge(p: ChainPower, globalRechargePct: number): number {
  if (p.fixedRecharge) return p.baseRecharge;
  const denom = Math.max(MIN_RECHARGE_DENOM, 1 + p.rechargeEnh + globalRechargePct / 100);
  return p.baseRecharge / denom;
}

/** Per-cast effective stats: the activation's chosen form, else the base power.
 *  Both shapes carry cast/damage/endCost/dot, so callers read uniformly.
 *  Recharge is NOT form-specific — every form shares the power's one cooldown
 *  lane (fast and slow Energy Transfer share the same 10s recharge). */
export function effectiveStats(
  powers: ChainPower[],
  act: Activation,
): { cast: number; damage: number; endCost: number; dot?: ChainDoT | null } {
  const p = powers[act.pi];
  if (act.formId) {
    const f = p.forms?.find((x) => x.id === act.formId);
    if (f) return { cast: f.cast, damage: f.damage, endCost: f.endCost, dot: f.dot };
  }
  return { cast: p.cast, damage: p.damage, endCost: p.endCost, dot: p.dot };
}

/** Per-cast nominal damage (direct hit + every DoT tick). */
function nominalDamage(p: ChainPower): number {
  return p.damage + (p.dot ? p.dot.ticks * p.dot.perTick : 0);
}

/** The ranking value for a power under the chosen metric. dps needs the global
 *  recharge (so the sustained number tracks the what-if slider). */
export function powerMetricValue(
  p: ChainPower,
  metric: PowerMetric,
  globalRechargePct: number,
): number {
  const dmg = nominalDamage(p);
  if (metric === 'dpa') return p.cast > 0 ? dmg / p.cast : 0;
  if (metric === 'dps') {
    const t = p.cast + effectiveRecharge(p, globalRechargePct);
    return t > 0 ? dmg / t : 0;
  }
  return dmg; // 'damage'
}

function overlapsAny(activations: Activation[], start: number, end: number): boolean {
  for (const a of activations) {
    if (start < a.end - EPS && end > a.start + EPS) return true;
  }
  return false;
}

/**
 * Earliest start time at which power `pi` can be cast: not before its own
 * recharge lane is ready, and not overlapping any other animation. Greedy —
 * mirrors the mockup. Returns the chosen start.
 *
 * Recharge starts when a cast *finishes*, not when it begins (CoH mechanic), so
 * a prior cast at [start, end] makes the power ready again at `end + effRech` —
 * its solo repeat period is cast + recharge.
 */
export function findSlot(
  powers: ChainPower[],
  activations: Activation[],
  pi: number,
  globalRechargePct: number,
): number {
  const p = powers[pi];
  const effRech = effectiveRecharge(p, globalRechargePct);
  const mine = activations.filter((a) => a.pi === pi);
  const laneReadyAt = mine.length > 0 ? Math.max(...mine.map((a) => a.end + effRech)) : 0;

  let candidateStart = laneReadyAt;
  for (let iter = 0; iter < 500; iter++) {
    const candidateEnd = candidateStart + p.cast;
    if (!overlapsAny(activations, candidateStart, candidateEnd)) return candidateStart;
    const blocker = activations
      .filter((a) => a.start < candidateEnd && a.end > candidateStart)
      .sort((a, b) => b.end - a.end)[0];
    if (!blocker) break;
    candidateStart = Math.max(blocker.end, laneReadyAt);
  }
  return candidateStart;
}

/** Append a cast of power `pi` at its earliest legal slot. Returns a NEW array. */
export function addActivation(
  powers: ChainPower[],
  activations: Activation[],
  pi: number,
  globalRechargePct: number,
): Activation[] {
  const start = findSlot(powers, activations, pi, globalRechargePct);
  const next = [...activations, { pi, start, end: start + powers[pi].cast }];
  next.sort((a, b) => a.start - b.start);
  return next;
}

/** Remove the latest-scheduled cast of power `pi`. Returns a NEW array. */
export function removeLastActivation(activations: Activation[], pi: number): Activation[] {
  const mine = activations.filter((a) => a.pi === pi).sort((a, b) => b.start - a.start);
  if (mine.length === 0) return activations;
  const target = mine[0];
  return activations.filter((a) => a !== target);
}

/**
 * Replay a pick-order sequence into scheduled activations, each tagged with its
 * sequence index so a single bar can be removed (filter the sequence by `seq`).
 * Deterministic: same sequence + recharge ⇒ identical layout.
 */
/** Build-global context the form rules evaluate against (timeline-independent
 *  state). Position/charge state is derived from the activations themselves. */
export interface FormContext {
  /** Permanent ToHit buff (% points) from always-on sources — Tactics, Kismet,
   *  global / set bonuses. A snipe fires its fast form whenever this meets the
   *  form's threshold, regardless of timeline position. */
  permanentToHit?: number;
  /** Force every `tohit` form (fast snipe) to fire regardless of permanent
   *  ToHit or buff windows — the user's "assume I'll Aim/Build Up first"
   *  override. Set from the Attack Chain Builder's "Quick snipe" toggle. */
  forceFastSnipe?: boolean;
}

export function replayChain(
  powers: ChainPower[],
  sequence: number[],
  globalRechargePct: number,
  formCtx: FormContext = {},
): Activation[] {
  const acts: Activation[] = [];
  // Consumable charges accumulated along the rotation (in pick order, which is
  // the user's intended cast order). Total Focus grants `energy_focus`, which
  // the next Energy Transfer spends. Tracked as a plain counter — charge
  // expiry / stack caps are a later refinement.
  const charges: Record<string, number> = {};
  // The immediately-preceding power in PICK order (not time order) — drives the
  // "AS only right after Placate" rule. null at the rotation opener.
  let prevPi: number | null = null;
  sequence.forEach((pi, seq) => {
    if (pi < 0 || pi >= powers.length) return;
    const p = powers[pi];
    const start = findSlot(powers, acts, pi, globalRechargePct);
    // Auto-pick the first alternate form whose trigger is satisfiable now and
    // consume what it requires.
    let formId: string | undefined;
    let cast = p.cast;
    for (const f of p.forms ?? []) {
      if (f.trigger.type === 'charge' && (charges[f.trigger.resource] ?? 0) > 0) {
        charges[f.trigger.resource] -= 1;
        formId = f.id;
        cast = f.cast;
        break;
      }
      if (f.trigger.type === 'tohit') {
        // Fast snipe: the user forced it on, OR permanent ToHit meets the
        // threshold, OR this cast lands inside an earlier ToHit-buff window
        // (Build Up / Aim) on the timeline.
        const permanent =
          !!formCtx.forceFastSnipe || (formCtx.permanentToHit ?? 0) >= f.trigger.threshold;
        const inWindow =
          !permanent &&
          acts.some((a) => {
            const w = powers[a.pi].tohitWindow;
            return w != null && start >= a.start - EPS && start <= a.start + w + EPS;
          });
        if (permanent || inWindow) {
          formId = f.id;
          cast = f.cast;
          break;
        }
      }
      if (f.trigger.type === 'hidden') {
        // Assassin's Strike from-Hide: legal only as the rotation opener or
        // immediately after a Placate (which re-Hides you). Anywhere else AS
        // uses its fast mid-combat base form.
        const isOpener = prevPi === null;
        const afterPlacate = prevPi !== null && powers[prevPi].grants === 'hidden';
        if (isOpener || afterPlacate) {
          formId = f.id;
          cast = f.cast;
          break;
        }
      }
    }
    acts.push({ pi, start, end: start + cast, seq, formId });
    if (p.grants) charges[p.grants] = (charges[p.grants] ?? 0) + 1;
    acts.sort((a, b) => a.start - b.start);
    prevPi = pi;
  });
  return acts;
}

function calcDeadGaps(activations: Activation[], cycleSec: number): DeadGap[] {
  const sorted = [...activations].sort((a, b) => a.start - b.start);
  const gaps: DeadGap[] = [];
  let cursor = 0;
  for (const a of sorted) {
    if (a.start > cursor + EPS) gaps.push({ start: cursor, end: a.start });
    cursor = Math.max(cursor, a.end);
  }
  if (cursor < cycleSec - EPS) gaps.push({ start: cursor, end: cycleSec });
  return gaps;
}

/**
 * Per-activation damage that lands within the cycle window. After-cast DoT
 * ticks are only counted if they fall before the loop closes (matching how a
 * looping rotation truncates trailing ticks — the mockup's convention).
 */
function activationDamage(powers: ChainPower[], act: Activation, cycleSec: number): number {
  const e = effectiveStats(powers, act);
  let dmg = e.damage;
  if (e.dot) {
    for (let t = 1; t <= e.dot.ticks; t++) {
      const tickT = act.start + e.cast + t * e.dot.period;
      if (tickT <= cycleSec + EPS) dmg += e.dot.perTick;
    }
  }
  return dmg;
}

/**
 * Simulate endurance from a FULL bar across enough loops to reveal steady state
 * or a stall. Continuous slope = recovery − toggles; each activation subtracts
 * its end cost at its start. Endurance clamps to [0, maxEnd].
 */
function simulateEndurance(
  powers: ChainPower[],
  activations: Activation[],
  cycleSec: number,
  end: EnduranceParams,
): EnduranceResult {
  const netPassive = end.recoveryPerSec - end.togglePerSec;
  const attackPerCycle = activations.reduce((s, a) => s + effectiveStats(powers, a).endCost, 0);
  const gainPerCycle = activations.reduce((s, a) => s + (powers[a.pi].endGain ?? 0), 0);
  const attackPerSec = cycleSec > 0 ? attackPerCycle / cycleSec : 0;
  const perLoopDelta = netPassive * cycleSec - attackPerCycle + gainPerCycle;
  const netPerSec = cycleSec > 0 ? perLoopDelta / cycleSec : netPassive;

  // Order the per-cycle endurance events (cast start → net of cost − gain, so a
  // recovery power like Dark Consumption is a refill spike).
  const events = [...activations]
    .sort((a, b) => a.start - b.start)
    .map((a) => ({ t: a.start, cost: effectiveStats(powers, a).endCost - (powers[a.pi].endGain ?? 0) }));

  // Walk the CLAMPED track from a full bar and read sustainability from IT, not
  // from perLoopDelta: a burst recovery power (Dark Consumption) that overfills
  // the cap wastes the overflow, which the analytic perLoopDelta would wrongly
  // credit. Run until the per-loop boundary endurance settles (steady state →
  // sustainable) or the bar empties mid-cast (stall → not), capped at 30 loops
  // for a slow drain that never quite stalls within the horizon.
  const MAX_LOOPS = 30;
  const track: EndPoint[] = [];
  let e = end.maxEnd;
  let stallTime: number | null = null;
  let prevBoundary = end.maxEnd;
  let boundaryDelta = 0;
  const push = (t: number, val: number) =>
    track.push({ t, frac: Math.max(0, Math.min(1, val / end.maxEnd)) });

  push(0, e);
  let loops = 0;
  outer: for (let loop = 0; loop < MAX_LOOPS; loop++) {
    const base = loop * cycleSec;
    let cursor = 0;
    for (const ev of events) {
      // recover continuously up to this cast
      e = Math.min(end.maxEnd, e + netPassive * (ev.t - cursor));
      push(base + ev.t, e);
      // pay the cast
      e -= ev.cost;
      if (e < -EPS && stallTime === null) {
        stallTime = base + ev.t;
        push(base + ev.t, 0);
        break outer;
      }
      // Clamp both ways: a recovery power (negative cost) refills but caps at max.
      e = Math.min(end.maxEnd, Math.max(0, e));
      push(base + ev.t, e);
      cursor = ev.t;
    }
    // recover through the tail of the loop
    e = Math.min(end.maxEnd, e + netPassive * (cycleSec - cursor));
    push(base + cycleSec, e);
    loops = loop + 1;
    boundaryDelta = e - prevBoundary;
    // Steady state reached (boundary endurance stopped moving) → stop; keep at
    // least 2 loops so the sawtooth shows the repeating pattern.
    if (loop >= 1 && Math.abs(boundaryDelta) < EPS) break;
    prevBoundary = e;
  }

  // Sustainable iff the clamped bar never emptied AND isn't still trending down.
  const sustainable = stallTime === null && boundaryDelta >= -EPS;
  const timeToEmpty = sustainable ? null : netPerSec < 0 ? end.maxEnd / -netPerSec : null;

  return {
    netPerSec,
    recoveryPerSec: end.recoveryPerSec,
    togglePerSec: end.togglePerSec,
    attackPerSec,
    perLoopDelta,
    sustainable,
    timeToEmpty,
    stallTime,
    track,
    trackLoops: loops,
  };
}

/** Compute every derived stat for the current chain. */
export function computeChain(
  powers: ChainPower[],
  activations: Activation[],
  globalRechargePct: number,
  end: EnduranceParams | null,
  metric: PowerMetric = 'damage',
): ChainResult | null {
  if (activations.length === 0) return null;

  const lastEnd = Math.max(...activations.map((a) => a.end));
  // The cycle isn't just where the last animation ends — when the loop repeats,
  // every power must have recharged since its last cast THIS loop. Recharge
  // starts at cast-END, so power P's last cast [.., lastEnd_P] is ready again at
  // lastEnd_P + effRech. The loop's next cast of P sits at cycle + firstStart_P,
  // which must not precede that — so cycle ≥ lastEnd_P + effRech − firstStart_P.
  // The binding power (usually the long-recharge opener cast once) can push the
  // true cycle past the visible casts — that boundary idle is real dead time.
  let cycleSec = lastEnd;
  for (const pi of new Set(activations.map((a) => a.pi))) {
    const mine = activations.filter((a) => a.pi === pi);
    const firstStart = Math.min(...mine.map((a) => a.start));
    const lastEndPi = Math.max(...mine.map((a) => a.end));
    const need = lastEndPi + effectiveRecharge(powers[pi], globalRechargePct) - firstStart;
    if (need > cycleSec) cycleSec = need;
  }

  const deadGaps = calcDeadGaps(activations, cycleSec);
  const deadTime = deadGaps.reduce((s, g) => s + (g.end - g.start), 0);
  const efficiency = cycleSec > 0 ? Math.round((1 - deadTime / cycleSec) * 100) : 0;

  let totalDamage = 0;
  let maxDamage = 0;
  let endPerCycle = 0;
  // Times each power is cast this loop — drives the compactness utilization.
  const castCount = new Map<number, number>();
  for (const a of activations) {
    const d = activationDamage(powers, a, cycleSec);
    totalDamage += d;
    if (d > maxDamage) maxDamage = d;
    endPerCycle += effectiveStats(powers, a).endCost;
    castCount.set(a.pi, (castCount.get(a.pi) ?? 0) + 1);
  }

  // Compactness: metric-weighted recharge utilization. A power's fastest solo
  // repeat period is cast + effRech (recharge starts at cast-END), so in a
  // cycleSec loop it could fire at most cycleSec / (cast + effRech) times. For
  // each power, u = min(1, timesCast × (cast + effRech) / cycleSec) — 1.0 means
  // it fires exactly on cooldown every loop; < 1 means it sits ready-but-unused
  // while other animations play. Weighting by the chosen power metric (damage /
  // DPA / DPS) keeps weak fillers and zero-value utility from skewing it, and
  // means slack on a high-value power (recoverable DPS) counts most.
  let wSum = 0;
  let wuSum = 0;
  for (const [pi, count] of castCount) {
    const w = powerMetricValue(powers[pi], metric, globalRechargePct);
    if (w <= 0) continue;
    const period = powers[pi].cast + effectiveRecharge(powers[pi], globalRechargePct);
    const u = cycleSec > 0 && period > 0 ? Math.min(1, (count * period) / cycleSec) : 1;
    wSum += w;
    wuSum += w * u;
  }
  const compactness = wSum > 0 ? Math.round((wuSum / wSum) * 100) : null;

  return {
    cycleSec,
    totalDamage,
    dps: cycleSec > 0 ? totalDamage / cycleSec : 0,
    endPerSec: cycleSec > 0 ? endPerCycle / cycleSec : 0,
    deadTime,
    deadGaps,
    efficiency,
    compactness,
    endurance: end ? simulateEndurance(powers, activations, cycleSec, end) : null,
    maxDamage,
  };
}
