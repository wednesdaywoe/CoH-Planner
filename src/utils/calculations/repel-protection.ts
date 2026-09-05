import { baseAtoms, reachesCaster, type AtomSource } from '@/data/core/atom-query';

/**
 * The `protRepel` magnitude from this power's SELF-directed `Mez/Repel` protection atoms —
 * a mirror of `kbProtectionValue` (atom-query.ts) for the Repel subtype. Protection is
 * spelled as a negative `Cur` scale (Domination −5, the armored toggles −10); a
 * `MezResist` row on a non-`Res_Boolean` table is Repel *resistance*, not protection
 * (branch 2b), so Domination's `MezResist/Repel 100` stays in the mez-resistance family
 * rather than double-counting here.
 *
 * Lives OUTSIDE atom-query.ts because that file is on the shared identical-status manifest, so
 * every edit to it forks the pair and has to be mirrored and re-recorded — the same
 * call-site-hosted precedent as `mezSourceFor` in character-totals.ts.
 *
 * Carried from the canonical fork by BPORT11, byte-identical, so the two repos read repel
 * protection through one reader rather than two that agree today. Measured here against the
 * `effects.repel` read it replaces: 202 powers agree, 71 lose a credit and 15 gain one, and the
 * direction is the point. The 71 are offensive repel — Ki Push, Jet Stream, Hurricane,
 * Repulsion Field — where the bag handed the caster protection equal to the push the power
 * inflicts on everyone else. The 15 are the real thing, including Increase Density, which the
 * retired block named in its own comment as the example and did not actually read.
 *
 * Fork-resolved at the call site (the caller passes the build's {@link mezSource}); the
 * caller's `|scale| × table@50` gate and the non-Res_Boolean self-atom credit rule match
 * the KB arm exactly.
 */
export function repelProtectionValue(
  power: AtomSource,
): { scale: number; table: string } | undefined {
  let cur: { scale: number; table: string } | undefined;
  for (const a of baseAtoms(power)) {
    if (a.effectType !== 'Mez' && a.effectType !== 'MezResist') continue;
    if (a.subType !== 'Repel') continue;
    if (!reachesCaster(a, power)) continue; // branch 1 (foe) excluded → PASS2B-1
    if (a.pvMode === 'PvP') continue; // the converter drops the PvP twin upstream
    // branch 2b: a Self aspect=Res Repel atom on a NON-Res_Boolean table is Repel
    // *resistance*, not protection — same rule as KB.
    if (a.aspect === 'Res' && !(a.modifierTable || '').toLowerCase().includes('res_boolean')) continue;
    if (!a.modifierTable) continue;
    const table = a.modifierTable;
    const scale = Math.abs(a.scale || 0);
    if (cur && cur.table === table) cur.scale += scale;
    else cur = { scale, table };
  }
  return cur;
}