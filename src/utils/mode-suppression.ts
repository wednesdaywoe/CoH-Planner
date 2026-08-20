/**
 * Game "mode" suppression — the runtime "what's actually contributing" rule.
 *
 * City of Heroes powers carry combat-state flags ("modes"). A power that is
 * active can SET modes (`setsModes`) and can be SUSPENDED by modes (`modesSuspended`).
 * The canonical case: Granite Armor sets `Granite_Mode`, and the other Stone
 * Armor toggles (Rock/Crystal/Brimstone/Minerals) carry
 * `modesSuspended: ['Granite_Mode']` — so while Granite runs, their armor is
 * suppressed and contributes nothing. Kheldian forms suspend human toggles the
 * same way (`Peacebringer_*_Mode` / `Suppress_PoolToggles`), and Granite also
 * suspends travel toggles (`Suppress_RunToggles` etc.).
 *
 * A suppressed toggle is still *on* (still costs endurance, still grants its
 * slotted set bonuses) — only its own effect contribution is dropped. So the
 * totals calc filters suppressed powers out of the direct-effect passes while
 * leaving the separate set-bonus path untouched.
 *
 * Pure and dependency-free so both the totals calc and a UI selector can share it.
 */

/** A power just enough for suppression resolution. */
export interface ModeCarrier {
  internalName: string;
  /** Display name — used as the "Suspended by <name>" attribution. */
  name: string;
  /** 'Toggle' | 'Auto' | … — autos count as always-active. */
  powerType?: string;
  /** User toggle state (toggles/clicks). Autos ignore this. */
  isActive?: boolean;
  setsModes?: string[];
  modesSuspended?: string[];
}

export interface SuppressionInfo {
  /** Display name of the active power whose mode suspends this one. */
  by: string;
  /** The mode id responsible (e.g. 'Granite_Mode'). */
  mode: string;
}

function isActivePower(p: ModeCarrier): boolean {
  return p.powerType?.toLowerCase() === 'auto' || !!p.isActive;
}

/**
 * Given the build's powers, return which ones are currently suppressed and by
 * whom. Keyed by `internalName`. Only active powers can suppress or be
 * suppressed. A suppressed toggle still counts as active for the purpose of the
 * modes IT sets (a suspended toggle is still running), so live modes are
 * collected from every active power before suppression is resolved (single
 * pass — the game does not cascade suppression through a suspended toggle).
 */
export function computeModeSuppression(powers: ModeCarrier[]): Map<string, SuppressionInfo> {
  // Live modes: mode id → the display name of an active power that sets it.
  const liveModes = new Map<string, string>();
  for (const p of powers) {
    if (!isActivePower(p) || !p.setsModes?.length) continue;
    for (const m of p.setsModes) {
      if (!liveModes.has(m)) liveModes.set(m, p.name);
    }
  }

  const suppressed = new Map<string, SuppressionInfo>();
  if (liveModes.size === 0) return suppressed;

  for (const p of powers) {
    if (!isActivePower(p) || !p.modesSuspended?.length) continue;
    for (const m of p.modesSuspended) {
      const setter = liveModes.get(m);
      // Don't let a power suppress itself (a mode it also sets).
      if (setter && setter !== p.name) {
        suppressed.set(p.internalName, { by: setter, mode: m });
        break;
      }
    }
  }
  return suppressed;
}

/**
 * The modes this build can switch between: every key of a selected power's `modeVariants`.
 *
 * A mode is selectable exactly when some power in the build displays differently under it —
 * which is what the binary's per-power `Redirect` table says, so the selector is a read of the
 * build's own data rather than a list of which archetypes have forms.
 *
 * SELECTABLE is not the same as LIVE, and conflating them was a real defect. This answers "what
 * does the form selector offer", which is a `modeVariants` question. What a mode-gated condition
 * reads is `publishedModes` below — every mode an active power SETS, whether or not a selector
 * offers it. Power Boost sets `BoostPower` and no power carries a `BoostPower` modeVariant, so
 * filtering the published set through this one left `kBoostPower Source.Mode?` permanently false
 * and Stun stuck in its single-target form with Power Boost running.
 */
export function selectableModes(powers: { modeVariants?: Record<string, unknown> }[]): string[] {
  const modes = new Set<string>();
  for (const p of powers) {
    for (const mode of Object.keys(p.modeVariants ?? {})) modes.add(mode);
  }
  return [...modes];
}

/**
 * The modes a power publishes while it is running: its `setsModes`, verbatim.
 *
 * This is the beta's half of `crates/coh_math/src/gather.rs`'s `collect_source_modes`, which
 * unions the `setsModes` of every active power with no filter of any kind. Keeping the two rules
 * identical is the point — the engine and the display resolver answer the same `Source.Mode?`
 * gates, so a mode either side drops is a form the other still swaps.
 *
 * The combat pair (`kEngaged`/`kOutOfCombat`) is deliberately absent: no power's `setsModes`
 * publishes either, and both are bound from the in-combat flag where the condition context is
 * built, exactly as the engine binds them in `live_modes`.
 */
export function publishedModes(power: { setsModes?: string[] } | undefined): string[] {
  return power?.setsModes ?? [];
}

/** Curated → human labels for the ~15 `modesRequired` values (annotation only). */
const MODE_LABELS: Record<string, string> = {
  FastMode: 'Momentum',
  Domination: 'Domination',
  LethalAmmo: 'Standard Ammo',
  Peacebringer_Blaster_Mode: 'Nova Form',
  Warshade_Blaster_Mode: 'Nova Form',
  Peacebringer_Tanker_Mode: 'Dwarf Form',
  Warshade_Tanker_Mode: 'Dwarf Form',
  Peacebringer_Light_Mode: 'Light Form',
  Granite_Mode: 'Granite Armor',
};

/**
 * Human-readable label for a raw mode id, for the "Requires: <mode>" annotation.
 * Curated names for the known combat states, else a humanized fallback — travel
 * toggles like `SuperJumpOn` become "Super Jump active".
 */
export function modeLabel(id: string): string {
  if (MODE_LABELS[id]) return MODE_LABELS[id];
  const isToggleOn = id.endsWith('On');
  const base = isToggleOn ? id.slice(0, -2) : id;
  const spaced = base
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim();
  return isToggleOn ? `${spaced} active` : spaced;
}
