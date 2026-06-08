/**
 * The single rounding primitive for every displayed number in the planner.
 *
 * CoH values are authored/derived to a small, fixed precision (set bonuses up
 * to 3 decimals like 1.875%; stats and power effects to 2 like 3.75%). The
 * universal display mechanic is the same everywhere: round to a declared max
 * number of decimals, then strip trailing zeros so 45 reads "45" (not
 * "45.00"), 2.5 reads "2.5", and 3.75 reads "3.75".
 *
 * Rounding happens BEFORE stripping so the float noise that `scale × AT-table`
 * arithmetic produces (e.g. 3.7500001) never leaks into the display.
 *
 *   formatPrecision(3.7500001, 2) → "3.75"
 *   formatPrecision(45, 2)        → "45"
 *   formatPrecision(2.5, 2)       → "2.5"
 *   formatPrecision(1.875, 3)     → "1.875"
 *   formatPrecision(-0.004, 2)    → "0"   (tiny magnitudes collapse to 0)
 *
 * The max-decimals knob is the only context-dependent input, and it lives on
 * the *data definition* of each quantity (EffectDisplayConfig.precision,
 * formatBonusValue's cap-3, the stat formatters' cap-2) — never hardcoded in a
 * rendering component.
 */
export function formatPrecision(value: number, maxDecimals: number): string {
  // toFixed rounds; parseFloat drops trailing zeros and normalizes -0 → 0.
  return parseFloat(value.toFixed(maxDecimals)).toString();
}
