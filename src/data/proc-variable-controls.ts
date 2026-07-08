import type { ProcEffect } from './proc-data';

/**
 * Hand-curated "variable control" metadata for procs whose contribution is not a
 * single always-on literal: self-stacking buffs (a stack slider) and
 * "By the Slotted Power" magnitudes (resolved via an AT modifier table).
 *
 * This is an ADDITIVE overlay — unlike `proc-residual-effects` (which replaces a
 * proc's whole `effects` array), each entry here PATCHES a few fields onto the
 * effects already stitched on by the generated/residual merges (see the merge
 * loop in proc-data.ts). That keeps binary-sourced `value`/`duration`/`category`
 * live and regen-safe, and only layers control metadata the generator can't
 * derive (`maxStacks`, `valueMax`, `scaleTable`).
 *
 * Why each field:
 *  - `maxStacks`  — self-stacking buff cap the generator can't read (it lives in
 *    the proc's prose `mechanics`, e.g. "stacks 3 times").
 *  - `scaleTable` — marks a "By the Slotted Power" effect. The generated `value`
 *    is `scale × 100` (a raw scale, NOT a percent); the true per-stack magnitude
 *    is `value × getTableValue(archetype, scaleTable, level)`. Might of the
 *    Tanker: 50 (0.5×100) × 0.10 (Tanker Melee_Res_Dmg, flat by level) = 5%/stack.
 *  - `valueMax`   — the cap for an HP-scaling floor (Reactive Defenses 3%→12.9%).
 *
 * The overlay targets the effect(s) in the array matching `category` (all these
 * are single-effect Resistance procs). Keys match PROC_DATABASE keys exactly.
 */
export interface ProcVariableControl {
  /** Only patch effects whose `category` matches (guards multi-effect entries). */
  category: ProcEffect['category'];
  maxStacks?: number;
  valueMax?: number;
  scaleTable?: string;
}

export const PROC_VARIABLE_CONTROLS: Record<string, ProcVariableControl> = {
  // Might of the Tanker (Tanker ATO) — "Chance for +5% Resistance(All) ... By the
  // Slotted Power, stacks 3 times". Generated value 50 = scale 0.5 × 100; resolved
  // via Melee_Res_Dmg (Tanker 0.10) ⇒ 5% Res(All) per stack, up to 3 (=15%).
  'Chance for +RES(ALL)': { category: 'Resistance', maxStacks: 3, scaleTable: 'Melee_Res_Dmg' },
  // Superior Might of the Tanker — same mechanic, generated value 67 = scale 0.67.
  'Superior Might of the Tanker: Recharge/Chance for +Res(All)': {
    category: 'Resistance',
    maxStacks: 3,
    scaleTable: 'Melee_Res_Dmg',
  },
  // Reactive Defenses "Scaling +Res(All)" — HP-scaling floor→cap. Floor (value=3)
  // is set in proc-globals.generated with scaling:true; add the 12.9% cap.
  'Scaling +Res(All)': { category: 'Resistance', valueMax: 12.9 },
};
