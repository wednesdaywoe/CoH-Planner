/**
 * A stat's ceiling, and which of the two kinds it is.
 *
 * The kind is not cosmetic, and a bare number cannot carry it. Resistance's cap is a clamp
 * the engine already applied (`finalize.rs` clamps `res_*` to `resistanceCap × 100`), so the
 * ceiling and the total are the same number. Defense's softcap is a threshold the engine
 * deliberately leaves unbound — guarded there by
 * `resistance_cap_binds_but_defense_softcap_does_not` — because defense past it is real and
 * load-bearing: it is what holds you at the softcap through a foe's +ToHit and a ToHit-debuff
 * cascade.
 *
 * Every surface that shows a ceiling reads these two functions, so the decision is made once.
 * The dashboard made it locally and got it wrong: it rendered `45.00%` over a 77.5% total.
 */

/** A ceiling as a percentage, with which of the two kinds it is. */
export type StatCap = { value: number; kind: 'hard' | 'soft' };

/** The ceiling to show for a stat id, or `undefined` for a stat with none. */
export function statCapFor(
  statId: string,
  defenseCap: number,
  resistanceCap: number,
): StatCap | undefined {
  if (statId.startsWith('def') || statId.startsWith('defense_')) {
    return { value: defenseCap, kind: 'soft' };
  }
  if (statId.startsWith('res_')) return { value: resistanceCap, kind: 'hard' };
  return undefined;
}

/** Whether the ceiling should be rendered IN PLACE OF the total. Only a hard cap may:
 *  past it the surplus is genuinely discarded, so the ceiling is the total. A softcap
 *  replaces nothing. */
export function capReplacesTotal(cap: StatCap | undefined, numericValue: number | undefined): boolean {
  return cap !== undefined && numericValue !== undefined && numericValue >= cap.value && cap.kind === 'hard';
}

/** What a meter or ceiling label means, in words. `soft` says the surplus survives; `hard`
 *  says the number stopped climbing there. */
export function capDescription(cap: StatCap): string {
  return cap.kind === 'soft'
    ? `Softcap ${cap.value}%. Defense past it is real: it holds you at the softcap through a foe's +ToHit and a ToHit-debuff cascade.`
    : `Cap ${cap.value}%. The engine clamps here — the surplus is discarded.`;
}
