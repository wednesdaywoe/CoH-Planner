import { describe, it, expect } from 'vitest';
import { Blind } from '@/data/datasets/thunderspy/generated/powersets/controller/primary/illusion-control/blind';
import { Beheader } from '@/data/datasets/thunderspy/generated/powersets/scrapper/primary/battle-axe/beheader';
import { Invisibility as SuperiorInvisibility } from '@/data/datasets/thunderspy/generated/powersets/controller/primary/illusion-control/invisibility';

/**
 * Thunderspy ATO (Archetype Set) category coverage.
 *
 * Thunderspy's boostsets.bin does NOT encode ATO categories in the per-power
 * allowed_powers lists (Homecoming/Rebirth do), so the converter's preferred
 * path — which trusts the export — produced ZERO Thunderspy powers accepting
 * their ATOs (reported for Illusion Control). The converter now infers the AT's
 * own ATO for qualifying powers (control ATO on mez powers, damage ATO on
 * damaging powers) when the dataset's bin omits them.
 */
describe('Thunderspy powers accept their archetype (ATO) sets', () => {
  it('Illusion Control Blind (Controller hold) accepts Controller ATOs', () => {
    expect(Blind.allowedSetCategories).toContain('Controller Archetype Sets');
  });

  it('a Scrapper attack accepts Scrapper ATOs', () => {
    expect(Beheader.allowedSetCategories).toContain('Scrapper Archetype Sets');
  });

  it('a non-mez / non-damage Controller power does NOT get the ATO', () => {
    // Superior Invisibility is a self defense toggle — no mez, no damage — so
    // Controller ATOs must not be offered (matches HC).
    expect(SuperiorInvisibility.allowedSetCategories ?? []).not.toContain(
      'Controller Archetype Sets',
    );
  });
});
