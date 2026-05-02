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
 * Standard movement caps. Travel powers raise these:
 *   Run:  Super Speed / Speed of Sound → 120.25
 *   Fly:  Fly / Mystic Flight → 87.90; Afterburner adds another → 102.27
 *   Jump: Super Jump / Mighty Leap → 101.80; Takeoff adds another → 110.39
 * Jump height has no documented cap.
 */
export const MOVEMENT_CAPS = {
  runSpeed: 92.50,
  flySpeed: 58.63,
  jumpSpeed: 78.18,
  jumpHeight: Number.POSITIVE_INFINITY,
} as const;

export type MovementStat = keyof typeof MOVEMENT_BASES;

/**
 * Apply a percentage buff to a movement base, clamped to the standard cap.
 * Returns { value, capped } so callers can flag capped speeds visually.
 */
export function applyMovementBuff(stat: MovementStat, percent: number): { value: number; capped: boolean } {
  const base = MOVEMENT_BASES[stat];
  const cap = MOVEMENT_CAPS[stat];
  const raw = base * (1 + percent / 100);
  if (raw >= cap) return { value: cap, capped: true };
  return { value: raw, capped: false };
}
