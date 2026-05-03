/**
 * Eclipse — OVERRIDES LAYER
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
  "description": "The dark Nictus power allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Endurance of all nearby enemies and add to your own. It will also increase your resistance to all damage. The more foes affected, the more Endurance and Damage Resistance you will gain. Affected foes are unable to recover Endurance for a short while.  Recharge: Very Long."
};
