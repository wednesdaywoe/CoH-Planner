import { describe, it, expect, afterAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllEpicPools, isEpicPowerAvailable } from '@/data';

/**
 * Epic-pool prerequisites are a PER-SERVER rule.
 *
 * Homecoming/Rebirth gate deeper epic powers (rank 3+) behind prior picks + a
 * higher level. Thunderspy's epic pools are FLAT — any power is selectable once
 * epic pools unlock, no prior-pick requirement (Tspy dev-confirmed: e.g. Body
 * Mastery's Physical Perfection can be your only pick). The planner used to
 * enforce the HC tiers uniformly, wrongly blocking those Thunderspy picks.
 */
async function deepEpicPower(server: 'homecoming' | 'thunderspy') {
  await loadDataset(server);
  const pool = Object.values(getAllEpicPools()).find((p: any) =>
    p.powers.some((pw: any) => (pw.rank || 1) >= 5),
  ) as any;
  return pool.powers.find((pw: any) => (pw.rank || 1) >= 5);
}

describe('epic-pool tier prerequisites are per-server', () => {
  // loadDataset mutates global active-dataset state; restore HC (the default)
  // so we don't leak Thunderspy into later suites.
  afterAll(async () => {
    await loadDataset('homecoming');
  });

  it('Thunderspy: a deep (rank 5) epic power is selectable with no prior picks', async () => {
    const pw = await deepEpicPower('thunderspy');
    expect(isEpicPowerAvailable(pw, 50, [])).toBe(true);
    // ...but still only once epic pools have unlocked.
    expect(isEpicPowerAvailable(pw, 34, [])).toBe(false);
  });

  it('Homecoming: a deep (rank 5) epic power still requires prior picks', async () => {
    const pw = await deepEpicPower('homecoming');
    expect(isEpicPowerAvailable(pw, 50, [])).toBe(false); // 0 picks → blocked
    expect(isEpicPowerAvailable(pw, 50, ['a', 'b'])).toBe(true); // 2 picks → ok
  });
});
