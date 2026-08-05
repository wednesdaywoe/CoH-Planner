import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset, getActiveDataset } from '@/data/dataset';
import { getAllPowerPools, getPowerPool } from '@/data/power-pools';
import { getAllEpicPools } from '@/data/epic-pools';
import type { Power } from '@/types';

/**
 * Mode gating must survive the pool and epic runtime facades.
 *
 * `transformPoolPower` / `transformEpicPower` are the only two power paths in the
 * app that rebuild the power object field by field instead of shipping the
 * generated literal as-is — everything under `generated/powersets/` is already
 * `Power`-shaped and reaches the calc untouched. That hand-written whitelist
 * omitted the five mode fields, all of which are TOP-LEVEL keys on the converted
 * power (siblings of `powerType`) and therefore out of reach of the
 * `...effectFields` spread, which only carries the remainder of `effects`.
 *
 * Consequence, with `lookupPower` resolving pools/epics through these facades:
 * every consumer of a pool or epic power's mode gating saw `undefined` and read
 * it as "ungated". The visible one was `castableInMode`
 * (src/utils/calculations/attack-chain-powers.ts) offering Boxing, Kick, Cross
 * Punch and Hasten inside Nova/Dwarf form — all four of which HC's binary
 * explicitly forbids there.
 *
 * Two things are pinned here:
 *   1. a whole-corpus parity sweep — for every live pool/epic power in all three
 *      datasets, each mode field must reach the facade output byte-identical, and
 *      must stay absent when the converter omitted it (absence is meaningful:
 *      `assignModes` drops empty arrays, and every consumer reads a missing key
 *      as "no gating");
 *   2. the named carriers from the bug, plus one carrier for each of the other
 *      four fields, so the sweep can't pass on a corpus that happens to have no
 *      `setsModes` left to lose.
 *
 * Per-partition carrier counts are printed rather than folded into one corpus
 * total, so a field going structurally empty in one dataset stays visible instead
 * of hiding behind the other two.
 */

const DATASETS = ['homecoming', 'rebirth', 'thunderspy'] as const;

/** The five fields the converter stamps at the top level of a power. */
const MODE_FIELDS = [
  'modesDisallowed',
  'modesRequired',
  'setsModes',
  'modesSuspended',
  'modeVariants',
] as const;
type ModeField = (typeof MODE_FIELDS)[number];

/** The Kheldian form modes. A power listing these cannot be cast in that form. */
const KHELDIAN_FORM_MODES = [
  'Peacebringer_Blaster_Mode',
  'Peacebringer_Tanker_Mode',
  'Warshade_Blaster_Mode',
  'Warshade_Tanker_Mode',
] as const;

interface Partition {
  label: string;
  /** raw pool id → raw powers, straight off the dataset's `*Raw` registry */
  raw: Map<string, Record<string, unknown>[]>;
  /** transformed pool id → transformed powers, straight off the facade */
  live: Map<string, Power[]>;
}

/**
 * Both trees for the active dataset. Pools are keyed by id and compared
 * position-wise rather than by `internalName`: internalName is NOT globally
 * unique in this data (it is only unique within a powerset), and the transform
 * maps powers in array order, so position is the honest correspondence.
 */
function partitionsForActiveDataset(): Partition[] {
  const ds = getActiveDataset();

  const poolRaw = new Map<string, Record<string, unknown>[]>();
  for (const [id, pool] of Object.entries(ds.powerPoolsRaw)) {
    poolRaw.set(id, pool.powers as unknown as Record<string, unknown>[]);
  }
  const poolLive = new Map<string, Power[]>();
  for (const [id, pool] of Object.entries(getAllPowerPools())) poolLive.set(id, pool.powers);

  const epicRaw = new Map<string, Record<string, unknown>[]>();
  for (const [id, pool] of Object.entries(ds.epicPoolsRaw)) {
    epicRaw.set(id, pool.powers as unknown as Record<string, unknown>[]);
  }
  const epicLive = new Map<string, Power[]>();
  for (const [id, pool] of Object.entries(getAllEpicPools())) epicLive.set(id, pool.powers);

  return [
    { label: `${ds.id}/pools`, raw: poolRaw, live: poolLive },
    { label: `${ds.id}/epics`, raw: epicRaw, live: epicLive },
  ];
}

function poolPowerBy(poolId: string, internalName: string): Power | undefined {
  return getPowerPool(poolId)?.powers.find((p) => p.internalName === internalName);
}

describe.each(DATASETS)('pool + epic mode gating survives the facade — %s', (datasetId) => {
  beforeAll(async () => {
    await loadDataset(datasetId);
  });

  it('carries every mode field through, and carries no mode field the raw data lacks', () => {
    for (const { label, raw, live } of partitionsForActiveDataset()) {
      // The facade drops dormant pools, so iterate what it shipped and pull the
      // raw side by id — a live pool with no raw counterpart is itself a bug.
      const carriers: Record<ModeField, number> = {
        modesDisallowed: 0, modesRequired: 0, setsModes: 0, modesSuspended: 0, modeVariants: 0,
      };
      let compared = 0;

      for (const [poolId, livePowers] of live) {
        const rawPowers = raw.get(poolId);
        expect(rawPowers, `${label}: live pool ${poolId} has no raw counterpart`).toBeTruthy();
        expect(livePowers.length, `${label}/${poolId} power count`).toBe(rawPowers!.length);

        livePowers.forEach((livePower, i) => {
          const rawPower = rawPowers![i];
          compared++;
          for (const field of MODE_FIELDS) {
            const before = rawPower[field];
            const after = (livePower as unknown as Record<string, unknown>)[field];
            // Both directions: the facade must not drop a gate, and must not
            // invent one. `toEqual` on undefined would let a dropped key pass as
            // equal to an absent one, so presence is asserted separately.
            expect(
              after !== undefined,
              `${label}/${poolId}[${i}] ${livePower.internalName}: ${field} presence`,
            ).toBe(before !== undefined);
            if (before !== undefined) {
              expect(
                after,
                `${label}/${poolId}[${i}] ${livePower.internalName}: ${field} value`,
              ).toEqual(before);
              carriers[field]++;
            }
          }
        });
      }

      // Counts, not a bare green. A partition that compared zero powers, or one
      // whose `modesDisallowed` went structurally empty, is an INVALID run.
      console.log(
        `[mode-gates] ${label}: ${compared} powers compared — ` +
          MODE_FIELDS.map((f) => `${f}=${carriers[f]}`).join(' '),
      );
      expect(compared, `${label}: nothing compared`).toBeGreaterThan(0);
      expect(carriers.modesDisallowed, `${label}: no modesDisallowed carriers`).toBeGreaterThan(0);
    }
  });

  it('pool clicks that the binary forbids in Kheldian form still say so', () => {
    // Boxing / Kick / Cross Punch are the Fighting pool's melee clicks; every
    // dataset's binary lists all four Kheldian form modes on them. These are the
    // powers the Attack Chain Builder was offering inside Nova and Dwarf.
    for (const internalName of ['Boxing', 'Kick', 'Cross_Punch']) {
      const power = poolPowerBy('fighting', internalName);
      expect(power, `fighting/${internalName}`).toBeTruthy();
      for (const mode of KHELDIAN_FORM_MODES) {
        expect(power!.modesDisallowed, `fighting/${internalName} disallows ${mode}`).toContain(mode);
      }
    }
  });

  it('Flurry is form-gated on every server (Hasten and Burnout are, except on Thunderspy)', () => {
    const flurry = poolPowerBy('speed', 'Flurry');
    expect(flurry, 'speed/Flurry').toBeTruthy();
    for (const mode of KHELDIAN_FORM_MODES) {
      expect(flurry!.modesDisallowed, `speed/Flurry disallows ${mode}`).toContain(mode);
    }

    // Hasten and Burnout are form-gated on HC and Rebirth. Thunderspy's copies
    // carry `["Disable_Pool"]` only — a genuine fork divergence in tspy's bins,
    // not a facade drop (the sweep above proves the facade is faithful either
    // way). Pinned in both directions so a rebalance on either side is noticed.
    const formGatedSelfBuffs = datasetId !== 'thunderspy';
    for (const internalName of ['Hasten', 'Burnout']) {
      const power = poolPowerBy('speed', internalName);
      expect(power, `speed/${internalName}`).toBeTruthy();
      expect(
        KHELDIAN_FORM_MODES.every((m) => power!.modesDisallowed?.includes(m)),
        `speed/${internalName} form-gated`,
      ).toBe(formGatedSelfBuffs);
    }
  });

  it('setsModes and modesRequired reach the facade too, on a carrier every server has', () => {
    // The Experimentation travel pair is the one setter/requirer both forks kept
    // verbatim, so it pins these two fields on all three datasets: Speed of Sound
    // switches SpeedofSoundOn on, and Jaunt only exists while it is on.
    const speedOfSound = poolPowerBy('experimentation', 'Speed_of_Sound');
    expect(speedOfSound, 'experimentation/Speed_of_Sound').toBeTruthy();
    expect(speedOfSound!.setsModes, 'Speed of Sound sets SpeedofSoundOn')
      .toContain('SpeedofSoundOn');

    const jaunt = poolPowerBy('experimentation', 'Jaunt');
    expect(jaunt, 'experimentation/Jaunt').toBeTruthy();
    expect(jaunt!.modesRequired, 'Jaunt requires SpeedofSoundOn').toContain('SpeedofSoundOn');
  });

  it('modesSuspended and modeVariants: HC carries them, the forks have none', () => {
    // What this gate CANNOT see, stated rather than assumed: `modesSuspended` and
    // `modeVariants` are structurally empty on Rebirth and Thunderspy pool data,
    // so the sweep above exercises those two fields on Homecoming only. Both
    // directions are pinned — HC's carriers must survive, and the forks' zeros
    // must stay zero — so a fork that starts emitting either one shows up here
    // instead of riding through unverified.
    const suspendCarriers = Object.values(getAllPowerPools())
      .flatMap((p) => p.powers)
      .filter((p) => p.modesSuspended !== undefined);
    const variantCarriers = Object.values(getAllPowerPools())
      .flatMap((p) => p.powers)
      .filter((p) => p.modeVariants !== undefined);
    console.log(
      `[mode-gates] ${datasetId}/pools carriers — ` +
        `modesSuspended=${suspendCarriers.length} modeVariants=${variantCarriers.length}`,
    );

    if (datasetId !== 'homecoming') {
      expect(suspendCarriers.length, `${datasetId} modesSuspended carriers`).toBe(0);
      expect(variantCarriers.length, `${datasetId} modeVariants carriers`).toBe(0);
      return;
    }

    // modesSuspended: Fly is dropped by the suppressors the Kheldian forms raise.
    const fly = poolPowerBy('flight', 'Fly');
    expect(fly, 'flight/Fly').toBeTruthy();
    expect(fly!.modesSuspended, 'Fly is suspended by the pool-toggle suppressor')
      .toContain('Suppress_PoolToggles');
    expect(suspendCarriers.length, 'HC modesSuspended carriers').toBeGreaterThan(0);

    // modeVariants: Teleport becomes Chain Teleport under the ChainTeleport mode.
    // It is HC's only pool carrier, and `convert-epic-pools.cjs` never calls
    // extractModeVariants at all, so no epic power has one on any server.
    const teleport = poolPowerBy('teleportation', 'Teleport');
    expect(teleport, 'teleportation/Teleport').toBeTruthy();
    expect(Object.keys(teleport!.modeVariants ?? {}), 'Teleport mode variants')
      .toContain('ChainTeleport');
  });
});

/**
 * KNOWN HC DATA DIVERGENCE — Jump Kick, reported not overridden.
 *
 * `exported_powers/pool/leaping/jump_kick.json` carries
 * `modes_disallowed: ["Disable_All"]` and nothing else. `Disable_All` is stamped
 * on nearly every power in the game (it is how the client blanks the tray) and is
 * stripped by MODE_NOISE in scripts/convert-powerset.cjs, so HC's generated Jump
 * Kick ends up with no `modesDisallowed` key at all — not even the `Disable_Pool`
 * that every other live HC pool power carries.
 *
 * Three independent HC sources agree, so this is HC's data, not a parse or
 * converter fault:
 *   • `exported_powers/pool/leaping/jump_kick.json`  → ["Disable_All"]
 *   • `tools/bin-crawler/exported_powers/live/…`     → no modes_disallowed at all
 *   • `raw defs/Pool/Leaping/Jump_Kick.powers` line 5 → `ModesDisallowed kDisable_All`
 *     (its Leaping siblings on the same snapshot are fully gated — Spring Attack
 *     lists all four Kheldian modes, Combat Jumping lists Disable_Pool)
 *
 * Rebirth and Thunderspy both gate it properly, so a Kheldian on those servers is
 * correctly refused Jump Kick in form while an HC Kheldian is still offered it.
 * That asymmetry is left standing: inventing an override here would freeze a
 * guess on top of live data that HC could fix in any patch, and the planner has
 * no oracle saying the game refuses the cast — only that HC's bin does not say it
 * does. Pinned so the day HC's data changes, this test reports it.
 */
describe('KNOWN DIVERGENCE: Jump Kick is form-gated on Rebirth/Thunderspy but not on HC', () => {
  it('Homecoming Jump Kick carries no mode gating at all', async () => {
    await loadDataset('homecoming');
    const jumpKick = poolPowerBy('leaping', 'Jump_Kick');
    expect(jumpKick, 'leaping/Jump_Kick').toBeTruthy();
    expect(jumpKick!.modesDisallowed).toBeUndefined();
    // Its Leaping siblings are gated, which is what makes this an HC data gap
    // rather than a whole-pool absence.
    expect(poolPowerBy('leaping', 'Spring_Attack')!.modesDisallowed)
      .toEqual(expect.arrayContaining([...KHELDIAN_FORM_MODES]));
  });

  it.each(['rebirth', 'thunderspy'] as const)('%s Jump Kick refuses every Kheldian form', async (id) => {
    await loadDataset(id);
    const jumpKick = poolPowerBy('leaping', 'Jump_Kick');
    expect(jumpKick, 'leaping/Jump_Kick').toBeTruthy();
    for (const mode of KHELDIAN_FORM_MODES) {
      expect(jumpKick!.modesDisallowed, `${id} Jump Kick disallows ${mode}`).toContain(mode);
    }
    // Both forks also gate their own fork-specific forms on it.
    expect(jumpKick!.modesDisallowed).toEqual(expect.arrayContaining(['HunterMode', 'ProwlerMode']));
  });
});
