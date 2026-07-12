/**
 * Movement speed bases, caps, and unit conversions.
 *
 * Base speeds and caps per the HC wiki's "Movement Speed / Maximum" table:
 * a scale unit equals 21 fps = 14.3181818 mph. Travel-power-conditional caps
 * (e.g. Fly's +50% on the fly cap) are listed for reference but not applied
 * automatically — the dashboard uses the standard cap because it doesn't
 * detect which travel toggles are currently "on".
 *
 * Base fly speed is 0 because characters cannot fly without a power; the %
 * fly buff displayed in the dashboard is a multiplier on whatever fly speed
 * the active fly power supplies in-game (which the planner doesn't model
 * separately yet).
 */

export const MPH_PER_SCALE = 14.3181818;

/** Base (unbuffed) movement speeds for a level-50 character. */
export const MOVEMENT_BASES = {
  runSpeed: 14.32,   // mph
  flySpeed: 0.0,     // mph — characters cannot fly without a power
  jumpSpeed: 21.0,   // mph
  jumpHeight: 4.0,   // feet (jump height is a distance, not a speed)
} as const;

/**
 * Standard movement caps. Travel powers raise these — see TRAVEL_CAP_BUMPS:
 *   Run:  Super Speed / Speed of Sound → 120.25
 *   Fly:  Fly / Mystic Flight → 87.90; Afterburner adds another → 102.27
 *   Jump: Super Jump / Mighty Leap → 101.80
 * Jump height has no documented cap. Click-power cap bumps (Takeoff) are
 * not modeled because the planner has no concept of an in-flight buff window.
 */
export const MOVEMENT_CAPS = {
  runSpeed: 92.50,
  flySpeed: 58.63,
  jumpSpeed: 78.18,
  jumpHeight: Number.POSITIVE_INFINITY,
} as const;

export type MovementStat = keyof typeof MOVEMENT_BASES;
export type MovementCaps = Record<MovementStat, number>;

/**
 * One active travel-power cap raise, read from the power's generated
 * `effects.movementCapBump` (the binary's aspect=Maximum movement templates —
 * data-driven, replacing the old hardcoded per-fullName TRAVEL_CAP_BUMPS
 * table). `scale` is in movement-scale units (Melee_Ones): 1 unit = 21 fps =
 * MPH_PER_SCALE mph. Super Speed +1.938 run (→120.25 mph), Super Jump +1.65
 * jump (→101.80), Fly +2.0475 fly (→87.95), Afterburner +1.0 fly on top
 * (→102.27).
 */
export interface MovementCapBump {
  stat: MovementStat;
  scale: number;
  /** Binary suppress group (kTravelMaxBuff etc.): within a group only the
   *  strongest bump applies; distinct groups ADD (Fly's TravelMaxBuff +
   *  Afterburner's TravelTurboMaxBuff = 102.27). Absent = always adds. */
  stackKey?: string;
  /** True when the game suppresses the cap raise in combat (`Suppress
   *  ActivateAttackClick`): Super Jump's and Afterburner's do; Super Speed's
   *  and Fly's persist — the old blanket "combat removes all cap bumps" rule
   *  was wrong for the latter two. */
  suppressible?: boolean;
}

/**
 * Compute the effective movement caps given the active powers' cap bumps.
 * Falls back to MOVEMENT_CAPS for any stat not bumped. In combat mode,
 * suppressible bumps are dropped; the rest resolve strongest-per-suppress-
 * group, then groups add onto the standard cap.
 */
export function getEffectiveMovementCaps(
  bumps: Iterable<MovementCapBump>,
  combatMode = false,
): MovementCaps {
  const caps: MovementCaps = { ...MOVEMENT_CAPS };
  // stat → (group key → strongest scale). Unkeyed bumps each form their own
  // group (they always add).
  const groups = new Map<MovementStat, Map<string, number>>();
  let unkeyed = 0;
  for (const b of bumps) {
    if (!b || b.scale <= 0) continue;
    if (combatMode && b.suppressible) continue;
    const key = b.stackKey ?? `__unkeyed_${unkeyed++}`;
    let g = groups.get(b.stat);
    if (!g) groups.set(b.stat, (g = new Map()));
    const cur = g.get(key);
    if (cur === undefined || b.scale > cur) g.set(key, b.scale);
  }
  for (const [stat, g] of groups) {
    let total = 0;
    for (const v of g.values()) total += v;
    if (total > 0 && Number.isFinite(caps[stat])) {
      caps[stat] = caps[stat] + total * MPH_PER_SCALE;
    }
  }
  return caps;
}

/**
 * Apply a percentage buff to a movement base, clamped to the standard cap.
 * Returns { value, capped } so callers can flag capped speeds visually.
 * Pass `caps` to override the standard cap (e.g. travel-toggle bumps).
 */
export function applyMovementBuff(
  stat: MovementStat,
  percent: number,
  caps: MovementCaps = MOVEMENT_CAPS,
): { value: number; capped: boolean } {
  const base = MOVEMENT_BASES[stat];
  const cap = caps[stat];
  const raw = base * (1 + percent / 100);
  if (raw >= cap) return { value: cap, capped: true };
  return { value: raw, capped: false };
}
