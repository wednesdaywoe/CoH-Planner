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
  useScourgeActive,
  useContainmentActive,
  useCriticalHitsActive,
  useStalkerHidden,
  useStalkerTeamSize,
  useStalkerCritActive,
  useSentinelCritActive,
} from '@/stores';
import { calculateCharacterTotals } from '@/utils/calculations';
import {
  buildChainPowers,
  getEnduranceParams,
  getBuildGlobalRecharge,
} from '@/utils/calculations/attack-chain-powers';
import {
  replayChain,
  computeChain,
  effectiveRecharge,
  type ChainPower,
} from '@/utils/calculations/attack-chain';

interface AttackChainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_HUE: Record<ChainPower['type'], number> = { attack: 258, utility: 152, buff: 35 };
const LABEL_W = 116;
const LANE_H = 24;
const MIN_PX = 14;
const MAX_PX = 80;

/** Per-power nominal damage (direct + full DoT) — drives the relative color. */
function powerDpa(p: ChainPower): number {
  return p.damage + (p.dot ? p.dot.ticks * p.dot.perTick : 0);
}

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

function fmt(n: number, d = 1): string {
  return n.toFixed(d);
}

export function AttackChainModal({ isOpen, onClose }: AttackChainModalProps) {
  const build = useBuildStore((s) => s.build);

  // AT hit-time mechanic toggles (crit / scourge / containment / …) — same
  // sources the power tooltips use, so the chain DPS matches them.
  const scourgeActive = useScourgeActive();
  const containmentActive = useContainmentActive();
  const criticalHitsActive = useCriticalHitsActive();
  const stalkerHidden = useStalkerHidden();
  const stalkerTeamSize = useStalkerTeamSize();
  const stalkerCritActive = useStalkerCritActive();
  const sentinelCritActive = useSentinelCritActive();

  const { powers, endParams, buildGlobalRech } = useMemo(() => {
    const calc = calculateCharacterTotals(build);
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
      powers: buildChainPowers(build, calc.globalBonuses, mechCtx),
      endParams: getEnduranceParams(calc.globalBonuses),
      buildGlobalRech: getBuildGlobalRecharge(calc.globalBonuses),
    };
  }, [build, containmentActive, scourgeActive, criticalHitsActive, stalkerCritActive, sentinelCritActive, stalkerHidden, stalkerTeamSize]);

  const [sequence, setSequence] = useState<number[]>([]);
  const [extraRech, setExtraRech] = useState(0);
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

  const globalRech = buildGlobalRech + extraRech;

  const activations = useMemo(
    () => replayChain(powers, sequence, globalRech),
    [powers, sequence, globalRech],
  );
  const result = useMemo(
    () => computeChain(powers, activations, globalRech, endParams),
    [powers, activations, globalRech, endParams],
  );

  // Reset the chain if the build changes underneath us (power indices shift).
  // Keyed by power count + names so a re-slot doesn't wipe the chain.
  const powersKey = powers.map((p) => p.id).join('|');
  const [lastKey, setLastKey] = useState(powersKey);
  if (powersKey !== lastKey) {
    setLastKey(powersKey);
    setSequence([]);
  }

  const addPower = (pi: number) => setSequence((s) => [...s, pi]);
  const removeBar = (seq: number) => setSequence((s) => s.filter((_, i) => i !== seq));
  const clear = () => setSequence([]);
  const reorderSeq = (from: number, to: number) =>
    setSequence((s) => {
      if (from === to || from < 0 || to < 0 || from >= s.length || to >= s.length) return s;
      const a = [...s];
      const [moved] = a.splice(from, 1);
      a.splice(to, 0, moved);
      return a;
    });

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

  // Sort palette: attacks (by damage desc) first, then utility/buff.
  const palette = useMemo(() => {
    return powers
      .map((p, i) => ({ p, i }))
      .sort((a, b) => {
        if (a.p.type !== b.p.type) return a.p.type === 'attack' ? -1 : 1;
        return powerDpa(b.p) - powerDpa(a.p);
      });
  }, [powers]);

  const usedPis = useMemo(() => [...new Set(activations.map((a) => a.pi))], [activations]);
  // Damage-intensity reference over the WHOLE build (not just the chain) so a
  // power's color is stable and identical across the palette, rotation strip,
  // and timeline — the visual link between the three areas.
  const maxDpa = useMemo(() => Math.max(0, ...powers.map((p) => powerDpa(p))), [powers]);

  const cycleSec = result?.cycleSec ?? 0;
  const maxCdEnd = activations.length
    ? Math.max(...activations.map((a) => a.start + effectiveRecharge(powers[a.pi], globalRech)))
    : 0;
  const displaySec = Math.max(cycleSec, maxCdEnd);
  const displayW = displaySec * px;
  const end = result?.endurance ?? null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Attack Chain Builder" size="full">
      <div className="space-y-3 text-[13px] text-gray-300 p-0.5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] text-gray-500">
              Build recharge <span className="text-emerald-400 font-medium">+{fmt(buildGlobalRech, 0)}%</span>
            </span>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-500">
              What-if
              <input
                type="number"
                value={extraRech}
                min={0}
                max={400}
                step={5}
                onChange={(e) => setExtraRech(Math.max(0, Number(e.target.value) || 0))}
                className="w-16 h-7 px-2 bg-gray-800 border border-gray-700 rounded text-gray-200 text-xs"
              />
              <span>%</span>
            </label>
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
              onClick={clear}
              className="ml-1 h-7 px-2.5 rounded border border-gray-700 hover:border-gray-500 text-gray-400 text-xs"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Palette */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Available powers — tap to add
          </div>
          {palette.length === 0 ? (
            <div className="text-[12px] text-gray-500 py-2">
              No click attacks in this build yet. Add some powers first.
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {palette.map(({ p, i }) => (
                <button
                  key={p.id}
                  onClick={() => addPower(i)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-700 hover:border-gray-500 text-gray-200 text-xs"
                  style={{
                    borderLeftWidth: 2,
                    borderLeftColor: barFill(p.type, maxDpa > 0 ? powerDpa(p) / maxDpa : 0),
                    background: chipBg(p.type, maxDpa > 0 ? powerDpa(p) / maxDpa : 0),
                  }}
                  title={`${p.name} · cast ${fmt(p.cast, 2)}s · rech ${fmt(p.baseRecharge, 1)}s · ${fmt(powerDpa(p), 0)} dmg`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] text-gray-500">{fmt(p.cast, 2)}s</span>
                </button>
              ))}
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
                high dmg
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-2 rounded-sm" style={{ background: '#1D9E75', opacity: 0.55 }} />
                active time
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-2 rounded-sm" style={{ background: '#E24B4A', opacity: 0.65 }} />
                dead time
              </span>
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
                  const rel = maxDpa > 0 ? powerDpa(p) / maxDpa : 0;
                  const mine = activations.filter((a) => a.pi === pi);
                  const effRech = effectiveRecharge(p, globalRech);
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
                        {mine.map((act) => {
                          const x = act.start * px;
                          const w = Math.max(p.cast * px, 6);
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
                              {/* after-cast DoT ticks */}
                              {p.dot &&
                                Array.from({ length: p.dot.ticks }).map((_, t) => {
                                  const tickT = act.start + p.cast + (t + 1) * p.dot!.period;
                                  const inWin = tickT <= cycleSec;
                                  return (
                                    <div
                                      key={t}
                                      style={{
                                        position: 'absolute',
                                        left: tickT * px - 1.5,
                                        top: 2,
                                        width: 3,
                                        height: LANE_H - 4,
                                        background: '#EF9F27',
                                        borderRadius: 1,
                                        opacity: inWin ? 0.9 : 0.2,
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
                                title={`${p.name} @ ${fmt(act.start, 2)}s — drag to reorder`}
                              >
                                <button
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onClick={() => {
                                    if (act.seq !== undefined) removeBar(act.seq);
                                  }}
                                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                                  style={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -6,
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    background: '#1a2335',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#c8d4e0',
                                    fontSize: 9,
                                    lineHeight: 1,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                  title="Remove this cast"
                                >
                                  ✕
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <Stat label="Cycle" value={result ? fmt(cycleSec, 2) : '—'} unit="s" />
          <Stat label="Total dmg" value={result ? fmt(result.totalDamage, 0) : '—'} />
          <Stat label="DPS" value={result ? fmt(result.dps, 1) : '—'} />
          <Stat
            label="Efficiency"
            value={result ? fmt(result.efficiency, 0) : '—'}
            unit="%"
            tone={result ? (result.efficiency >= 95 ? 'good' : result.efficiency < 80 ? 'warn' : undefined) : undefined}
          />
          <Stat label="Recovery" value={end ? `+${fmt(end.recoveryPerSec, 2)}` : '—'} unit="/s" tone="good" />
          <Stat label="Spend" value={end ? `−${fmt(end.togglePerSec + end.attackPerSec, 2)}` : '—'} unit="/s" />
          <Stat
            label="Net end"
            value={end ? `${end.netPerSec >= 0 ? '+' : ''}${fmt(end.netPerSec, 2)}` : '—'}
            unit="/s"
            tone={end ? (end.netPerSec >= 0 ? 'good' : 'warn') : undefined}
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
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: 'good' | 'warn';
}) {
  const color = tone === 'good' ? 'text-emerald-400' : tone === 'warn' ? 'text-amber-400' : 'text-gray-200';
  return (
    <div className="rounded-md bg-gray-800/60 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-1">{label}</div>
      <span className={`text-base font-medium ${color}`}>{value}</span>
      {unit && <span className="text-[11px] text-gray-500 ml-0.5">{unit}</span>}
    </div>
  );
}
