import { describe, it, expect } from 'vitest';
import { ENHANCEMENT_CURVES as HOMECOMING_CURVES } from '@/data/datasets/homecoming/generated/enhancement-curves';
import { ENHANCEMENT_CURVES as REBIRTH_CURVES } from '@/data/datasets/rebirth/generated/enhancement-curves';
import { ENHANCEMENT_CURVES as THUNDERSPY_CURVES } from '@/data/datasets/thunderspy/generated/enhancement-curves';
import { ENHANCEMENT_CURVES as BRAINSTORM_CURVES } from '@/data/datasets/brainstorm/generated/enhancement-curves';
import { ASPECT_BOOST_TYPE, ASPECT_NAME_MAP } from './enhancement-values';

/**
 * The aspect→boost-type vocabulary (`ASPECT_BOOST_TYPE`) is the engine-side
 * translation onto the export's dim_returns boost types. Its two failure
 * modes are silent: a named boost type that drifts from the export vocabulary
 * would fall to the default schedule at runtime (that lookup mirrors the
 * game's, so it cannot fail loud there), and an aspect key missing from the
 * vocabulary would throw only when first slotted. Both are pinned here
 * against every dataset's generated module instead.
 */
const DATASETS = [
  { id: 'homecoming', curves: HOMECOMING_CURVES },
  { id: 'rebirth', curves: REBIRTH_CURVES },
  { id: 'thunderspy', curves: THUNDERSPY_CURVES },
  { id: 'brainstorm', curves: BRAINSTORM_CURVES },
];

describe.each(DATASETS)('aspect→boost-type vocabulary ($id)', ({ curves }) => {
  it('every named boost type exists in the dataset dim_returns map', () => {
    const named = [...new Set(Object.values(ASPECT_BOOST_TYPE).filter((t) => t !== null))];
    for (const boostType of named) {
      expect(
        curves.boostTypeSchedules,
        `boost type "${boostType}" is named in ASPECT_BOOST_TYPE but absent from the ` +
          `dataset's dim_returns entries — at runtime it would silently take the default ` +
          `schedule; either the export vocabulary changed or the map has a typo`,
      ).toHaveProperty(boostType);
    }
  });

  it('every dim_returns boost type with a non-default schedule is reachable from an aspect', () => {
    const reachable = new Set(Object.values(ASPECT_BOOST_TYPE));
    for (const boostType of Object.keys(curves.boostTypeSchedules)) {
      expect(
        reachable.has(boostType),
        `dim_returns names boost type "${boostType}" but no engine aspect maps to it — ` +
          `the engine cannot reach a non-default schedule the data defines`,
      ).toBe(true);
    }
  });
});

describe('engine aspect vocabulary', () => {
  it('covers every normalized aspect key', () => {
    for (const normalized of new Set(Object.values(ASPECT_NAME_MAP))) {
      expect(
        ASPECT_BOOST_TYPE,
        `normalizeAspectName can produce "${normalized}" but ASPECT_BOOST_TYPE does not ` +
          `list it — getAspectSchedule would throw the first time it is slotted`,
      ).toHaveProperty(normalized);
    }
  });
});
