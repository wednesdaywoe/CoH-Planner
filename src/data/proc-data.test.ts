import { describe, it, expect } from 'vitest';
import { findProcData } from './proc-data';

/**
 * PPM regression for the Superior Overpowering Presence "Chance for Energy Font"
 * proc (Controller ATO). It was listed at 1 PPM but the in-game value is 2:
 * Superior ATO procs run +1 PPM over their non-superior version. Power Info
 * reads `procData.ppm` straight from PROC_DATABASE, so the value lives here.
 */
describe('Energy Font proc PPM (Overpowering Presence)', () => {
  it('Superior Overpowering Presence: Recharge/Chance for Energy Font is 2 PPM', () => {
    const proc = findProcData(
      'Recharge/Chance for Energy Font',
      'Superior Overpowering Presence'
    );
    expect(proc, 'proc entry').toBeTruthy();
    expect(proc!.ppm).toBe(2);
  });

  it('the non-superior "Chance for Energy Font" stays at 1 PPM (Superior = base + 1)', () => {
    const proc = findProcData('Chance for Energy Font', 'Overpowering Presence');
    expect(proc, 'proc entry').toBeTruthy();
    expect(proc!.ppm).toBe(1);
  });
});
