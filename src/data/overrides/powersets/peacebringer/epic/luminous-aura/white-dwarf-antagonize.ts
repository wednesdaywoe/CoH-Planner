/**
 * White Dwarf Antagonize — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. Each field below is a value the previously-committed
 * composed file carried that the current CoD2-raw extraction does not.
 * Keep them — the CoD2 archive we convert from is a snapshot, and these
 * overrides are where current HC values live when they've drifted from
 * that snapshot. See src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "This power attracts the attention of a foe and all those around him. Use this to pull villains off of an ally in trouble. An Accuracy check is required to Taunt enemy players, but is not needed against critter targets.  Recharge: Moderate.",
  "targetType": "Foe (Alive)",
  "requires": "White Dwarf",
  "effects": {}
};
