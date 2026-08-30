/**
 * Mids' internal name for a power → this dataset's, per powerset (DATA-GAP MBDIMPORT-2).
 *
 * A `.mbd` identifies a power by internal name alone, and that namespace has drifted from
 * the game's. HC has rotated internal names underneath stable display names: Tactical
 * Arrow's `Gymnastics` is Oil Slick Arrow in the export now, and the power the game shows
 * as "Gymnastics" is internally `Quickness`. Stalker Shield Defense is a three-cycle.
 *
 * That makes an exact internal-name match the *least* reliable matcher rather than the
 * most: the name exists, so nothing fails — it just resolves to a different power, takes
 * that power's slots, and the entry that rightfully owned them is deduped away in silence.
 *
 * The tables are DERIVED (`scripts/convert-mids-name-map.cjs`) by joining Mids' own power
 * list to the export on display name. They are not a curated list of known breakages, and
 * that matters: the four that a bug report surfaced are 8 of the 115 rows Homecoming
 * carries. Reading Mids for this is not a Rule 0 breach — the question is what MIDS calls
 * a power, and only Mids can answer it. [[derive-dont-invent]]
 */

import { getActiveDataset, type DatasetId } from './dataset';
import { MIDS_NAME_MAP as HOMECOMING_MIDS_NAMES } from './datasets/homecoming/generated/mids-name-map';
import { MIDS_NAME_MAP as REBIRTH_MIDS_NAMES } from './datasets/rebirth/generated/mids-name-map';
import { MIDS_NAME_MAP as THUNDERSPY_MIDS_NAMES } from './datasets/thunderspy/generated/mids-name-map';
import { MIDS_NAME_MAP as BRAINSTORM_MIDS_NAMES } from './datasets/brainstorm/generated/mids-name-map';

type NameMap = Readonly<Record<string, Readonly<Record<string, string>>>>;

/**
 * One entry per dataset and no `default` arm, for the reason `accolades.ts` records: a
 * fall-through to Homecoming reads live's data on a fork that has its own, and reads it
 * silently. A Record typed on `DatasetId` cannot compile with a dataset missing.
 */
const MAP_BY_DATASET: Record<DatasetId, NameMap> = {
  homecoming: HOMECOMING_MIDS_NAMES,
  rebirth: REBIRTH_MIDS_NAMES,
  thunderspy: THUNDERSPY_MIDS_NAMES,
  brainstorm: BRAINSTORM_MIDS_NAMES,
};

/**
 * This dataset's internal name for the power Mids calls `midsInternalName` inside
 * `powersetKey` (`blaster_support.tactical_arrow`), or undefined when the two agree —
 * which is every name but a hundred-odd, so undefined is the overwhelmingly common answer.
 */
export function midsNameRemap(powersetKey: string, midsInternalName: string): string | undefined {
  const set = MAP_BY_DATASET[getActiveDataset().id][powersetKey.toLowerCase()];
  return set?.[midsInternalName.toLowerCase()];
}

/**
 * Which Mids name owns each of THIS dataset's powers in `powersetKey`, as
 * `ourInternalName` (lower) → the Mids name that resolves to it.
 *
 * The inverse view exists because a rotation leaves a second way to bind the wrong power:
 * Stalker Willpower's `Resurgence` remaps to `Reconstruction`, and Mids' OWN `Reconstruction`
 * — a power HC has since removed — still exact-matches ours and takes the slot first, purely
 * because it is listed earlier in the file. An exact hit on a name that is demonstrably
 * another power's is not evidence, so the owner named here outranks it and the squatter
 * falls through to a warning.
 */
export function midsNameOwners(powersetKey: string): ReadonlyMap<string, string> {
  const set = MAP_BY_DATASET[getActiveDataset().id][powersetKey.toLowerCase()];
  const owners = new Map<string, string>();
  for (const [midsName, ourName] of Object.entries(set ?? {})) {
    owners.set(ourName.toLowerCase(), midsName);
  }
  return owners;
}

/** The active dataset's whole table — for gates and audits, not for resolution. */
export function midsNameMap(): NameMap {
  return MAP_BY_DATASET[getActiveDataset().id];
}
