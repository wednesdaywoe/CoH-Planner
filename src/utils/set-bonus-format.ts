/**
 * Shared formatting helpers for set bonus values.
 *
 * The IO-set source data carries both a precise `value` (e.g. 1.125) and a
 * pre-rendered `desc` string (e.g. "+1.1% Maximum HitPoints") that was
 * rounded at extraction time — often to 0 or 1 decimal place, sometimes
 * with a trailing label that no longer matches the precise value.
 *
 * Always prefer the precise `value`. If you need the human-readable
 * description, use `formatBonusDesc` to splice the precise value back
 * into the leading "+X.X%" portion of `desc`.
 */

/** Round to at most 3 decimals, strip trailing zeros.
 *  3 decimals so values like 1.125% (Adrenal Adjustment / Luck of the Gambler
 *  +MaxHP, and the 1.525% damage bonuses) display exactly rather than rounded —
 *  used everywhere (tooltips AND dashboard breakdown rows) so the same bonus
 *  reads identically in every view, matching the in-game number. */
export function formatBonusValue(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return rounded.toString();
}

/** Splice the precise value back into the leading "+X.X%" portion of a
 *  pre-rendered desc. If `desc` is empty/missing, fall back to "<stat>
 *  +<value>%". */
export function formatBonusDesc(desc: string | undefined, stat: string, value: number): string {
  const valueStr = formatBonusValue(value);
  if (!desc) return `${stat} +${valueStr}%`;
  // Replace the leading "+1.1%" / "+12%" / "+1.25%" with the precise value.
  // If the desc doesn't start with that pattern, return it unchanged so we
  // don't mangle unusual descriptions.
  if (/^\+[\d.]+%/.test(desc)) {
    return desc.replace(/^\+[\d.]+%/, `+${valueStr}%`);
  }
  return desc;
}
