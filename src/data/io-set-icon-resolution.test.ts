/**
 * io-set-icon-resolution.test.ts — every IO-set icon names a file that exists.
 *
 * Icons aren't in the binary, so each one is curated by hand in the extractor's ICON_OVERRIDES
 * (or inherited from HC's registry for a set both forks ship). A curated name that points at
 * nothing renders as a 404, and nothing downstream notices: EnhancementIcon picks the folder from
 * the filename prefix, asks for the file, and shows Unknown.png when the request fails.
 *
 * One shipped that way. Rebirth's `superior_winters_gift` requested `ssuperior_winters_gift.png`
 * from the day the set was added until 2026-08-20, because the extractor's third icon arm was
 * `f's{set_id}.png'` — a fabricated name its own comment called bogus. The same mis-keyed override
 * gave the base set the SUPERIOR artwork and left `IO Sets/WintersGift.png` referenced by no set
 * at all. The fabricated arm is gone and _resolve_icon now stops the regen instead, but that guard
 * only sees a set with NO icon. This one sees a set with a wrong one.
 *
 * `getIOSetFolder` is duplicated here rather than imported: the point is to grade the registry
 * against the filesystem the way the component resolves it, and importing the component's rule
 * would make the two agree by construction on the axis most likely to be wrong.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { IO_SETS_RAW as HC } from '@/data/datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as REBIRTH } from '@/data/datasets/rebirth/io-sets-raw';
import { IO_SETS_RAW as TSPY } from '@/data/datasets/thunderspy/io-sets-raw';

const ASSET_ROOT = path.join(process.cwd(), 'public', 'img', 'Enhancements');

function folderFor(icon: string): string {
  if (icon.startsWith('AO_') || icon.startsWith('SAO_')) return 'Archetype';
  if (icon.startsWith('EO_') || icon.startsWith('SEO_')) return 'Event';
  if (icon.startsWith('UD_')) return 'Universal';
  return 'IO Sets';
}

const REGISTRIES = { homecoming: HC, rebirth: REBIRTH, thunderspy: TSPY };

describe('IO-set icons resolve to real files', () => {
  // Without this the sweep below passes by finding nothing to check, which is the failure
  // mode a filesystem-reading guard has and a data-reading one doesn't.
  it('the asset library is where the sweep expects it', () => {
    expect(fs.existsSync(ASSET_ROOT), `no asset library at ${ASSET_ROOT}`).toBe(true);
  });

  for (const [dataset, sets] of Object.entries(REGISTRIES)) {
    it(`${dataset}: every set's icon exists on disk`, () => {
      const entries = Object.entries(sets);
      expect(entries.length).toBeGreaterThan(150);
      const missing = entries
        .filter(([, s]) => !fs.existsSync(path.join(ASSET_ROOT, folderFor(s.icon), s.icon)))
        .map(([id, s]) => `${id} -> ${folderFor(s.icon)}/${s.icon}`);
      expect(missing, `${dataset} sets whose icon is not in the asset library`).toEqual([]);
    });
  }

  it('no set carries the retired s{set_id}.png fabrication', () => {
    const fabricated = Object.entries(REGISTRIES).flatMap(([dataset, sets]) =>
      Object.entries(sets)
        .filter(([id, s]) => s.icon === `s${id}.png`)
        .map(([id]) => `${dataset}/${id}`)
    );
    expect(fabricated).toEqual([]);
  });
});
