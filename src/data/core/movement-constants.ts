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
 * Travel toggles that raise the cap of one movement stat while active.
 * Keyed by the canonical power fullName ("Pool.<set>.<powerInternalName>").
 * Multiple active bumps for the same stat take the maximum (game rule:
 * "only the strongest buff applies"). When the In-Combat toggle is on,
 * none of these apply (the game suppresses the cap bump on attack).
 */
export const TRAVEL_CAP_BUMPS: Record<string, { stat: MovementStat; cap: number }> = {
  'Pool.Speed.Super_Speed':              { stat: 'runSpeed',  cap: 120.25 },
  'Pool.Experimentation.Speed_of_Sound': { stat: 'runSpeed',  cap: 120.25 },
  'Pool.Leaping.Long_Jump':              { stat: 'jumpSpeed', cap: 101.80 }, // Super Jump
  'Pool.Force_of_Will.Mighty_Leap':      { stat: 'jumpSpeed', cap: 101.80 },
  'Pool.Flight.Fly':                     { stat: 'flySpeed',  cap: 87.90 },
  'Pool.Sorcery.Mystic_Flight':          { stat: 'flySpeed',  cap: 87.90 },
  'Pool.Flight.Fly_Boost':               { stat: 'flySpeed',  cap: 102.27 }, // Afterburner
};

/**
 * Compute the effective movement caps given a set of active travel toggles.
 * Falls back to MOVEMENT_CAPS for any stat not bumped.
 */
export function getEffectiveMovementCaps(activeFullNames: Iterable<string>): MovementCaps {
  const caps: MovementCaps = { ...MOVEMENT_CAPS };
  for (const name of activeFullNames) {
    const bump = TRAVEL_CAP_BUMPS[name];
    if (bump && bump.cap > caps[bump.stat]) caps[bump.stat] = bump.cap;
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
