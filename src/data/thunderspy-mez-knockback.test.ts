import { describe, it, expect } from 'vitest';
// Recovered APPLIED mez / offensive knockback — read straight from the committed
// generated base (pre-override), so a future regen can't silently undo the fix.
import { Fossilize } from './datasets/thunderspy/generated/powersets/controller/primary/earth-control/fossilize';
import { Blind } from './datasets/thunderspy/generated/powersets/controller/primary/illusion-control/blind';
import { FreezeRay } from './datasets/thunderspy/generated/powersets/blaster/primary/ice-blast/freeze-ray';
import { CobraStrike } from './datasets/thunderspy/generated/powersets/tanker/secondary/martial-arts/cobra-strike';
import { EMPPulse } from './datasets/thunderspy/generated/powersets/controller/secondary/radiation-emission/emp-pulse';
import { FootStomp } from './datasets/thunderspy/generated/powersets/brute/primary/super-strength/foot-stomp';
import { Geyser } from './datasets/thunderspy/generated/powersets/blaster/primary/water-blast/geyser';
// Guard negative case: a Self-targeted +mez-strength self-buff whose index names a mez.
import { PowerBoost } from './datasets/thunderspy/generated/powersets/blaster/secondary/energy-manipulation/power-boost';
// Sign-rule negative case: a foe Hold carrying a negative-scale Stun debuff artifact.
import { TimeStop } from './datasets/thunderspy/generated/powersets/defender/primary/time-manipulation/time-stop';
// Protection carve-out: self armor and ally mez shield, both foe-less by nature.
import { Fortification } from './datasets/thunderspy/generated/powersets/arachnos-soldier/epic/crab-spider-training/fortification';
import { ClearMind } from './datasets/thunderspy/generated/powersets/defender/primary/empathy/clear-mind';

/**
 * Thunderspy applied-mez & offensive-knockback recovery — the DATA-DRIVEN fix.
 *
 * Thunderspy's AttribMod schema names the APPLIED mez/KB only in the post-`requires`
 * INDEX array (the front string is the enhancement/duration CATEGORY — a Hold reads
 * front `Immobilize`/`Sleep`, a Stun reads `Stun`), stores the real Magnitude in the
 * post-table slot (k+12, not the flat template `magnitude`), and drops the AttribMod
 * aspect + per-template target. The parser historically read only the front, so every
 * mez was MISLABELLED (Blind/Fossilize emitted `immobilize` instead of `hold`) at a
 * flat Mag 1, and every `Ones`-front mez / offensive knockdown was dropped entirely.
 *
 * The fix (`_parse_effect_template_thunderspy`) relabels the front to the lone index
 * mez attrib and adopts the k+12 Magnitude (verified: index type == HC on 415/422
 * shared powers, k+12 == HC magnitude exactly where tspy didn't rebalance). Offensive
 * knockback/knockup is relabeled from a `Ones` front only when instant (duration 0) and
 * positive — durational / protection KB stays excluded (GAME-DATA-PRINCIPLES §3). The
 * self/ally target-trap (a self-buff whose index names a mez) is vetoed by
 * `guardThunderspyAppliedMez` on the power's `targets_affected` (§7).
 *
 * These re-read the recovered shape from the committed dataset (GAME-DATA-PRINCIPLES §9).
 */
describe('Thunderspy applied-mez & knockback recovery (data-driven)', () => {
  // --- Type corrected from the index array (front != applied mez) -----------
  it('Blind is a Mag-3 Hold, not the front-string Immobilize', () => {
    // front `Immobilize` (enhancement category) → index `Held`; k+12 Magnitude 3.
    expect(Blind.effects?.hold).toEqual({ mag: 3, scale: 10, table: 'Ranged_Immobilize' });
    expect(Blind.effects?.immobilize).toBeUndefined();
  });

  it('Fossilize is a Mag-3 Hold (was mislabelled immobilize Mag 1)', () => {
    expect(Fossilize.effects?.hold).toEqual({ mag: 3, scale: 12, table: 'Ranged_Immobilize' });
    expect(Fossilize.effects?.immobilize).toBeUndefined();
  });

  it('Freeze Ray is a Mag-3 Hold even though its front string / table is Sleep', () => {
    expect(FreezeRay.effects?.hold).toEqual({ mag: 3, scale: 8, table: 'Ranged_Sleep' });
    expect(FreezeRay.effects?.sleep).toBeUndefined();
  });

  // --- Magnitude corrected from the placeholder (type already matched) -------
  it('Cobra Strike keeps its Stun type but at the real Mag 3 (was Mag 1)', () => {
    expect(CobraStrike.effects?.stun).toEqual({ mag: 3, scale: 10, table: 'Melee_Stun' });
  });

  // --- PBAoE control cast on Self but foe-facing → KEPT (targets_affected=Foe)
  it('EMP Pulse (PBAoE, target_type Self) keeps its Mag-3 Hold — targets_affected is Foe', () => {
    expect(EMPPulse.effects?.hold).toEqual({ mag: 3, scale: 15, table: 'Ranged_Immobilize' });
  });

  // --- Offensive knockdown / knockup recovered from a Ones front ------------
  it('Foot Stomp recovers its offensive knockdown (Ones-front, instant)', () => {
    expect(FootStomp.effects?.knockback).toEqual({ scale: 0.67, table: 'Melee_Ones' });
  });

  it('Geyser recovers its offensive knockup', () => {
    expect(Geyser.effects?.knockup).toEqual({ scale: 1.5, table: 'Ranged_Ones' });
  });

  // --- Aspect distinguishes mez-STRENGTH from applied mez (TSPY-3) --------------
  it('Power Boost gains its mez-STRENGTH buff (specialBuff.stun), not an applied Stun', () => {
    // Power Boost is a +Strength self-buff (the Power Boost family): its `Stun` template is
    // aspect=Strength, toWho=Self — a buff to the CASTER'S stun MAGNITUDE, not an applied
    // Stun mez. Before TSPY-3 recovered the AttribMod aspect, the blank aspect (plus
    // targets_affected=['Self']) made guardThunderspyAppliedMez drop the whole template, so
    // the power carried nothing — while HC's Power Boost / Power Up carries exactly this
    // specialBuff.stun. With the aspect now read from the binary, it routes correctly to
    // specialBuff.stun (matching HC) and is STILL not an applied `effects.stun` mez.
    expect(PowerBoost.effects?.stun).toBeUndefined(); // no applied Stun mez
    expect(PowerBoost.effects?.specialBuff?.stun).toEqual({ scale: 0.75, table: 'Melee_Ones' });
  });

  // --- Sign rule: a negative-scale mez on a duration table is not applied --------
  it('Time Stop is a pure Hold — its negative-scale Stun artifact is not emitted', () => {
    // Time Stop carries a Held Mag 3 plus a scale -0.25 `Stun` on Ranged_Stun (a
    // debuff/duration artifact, not applied mez). Only the Hold must survive.
    expect(TimeStop.effects?.hold).toEqual({ mag: 3, scale: 8, table: 'Ranged_Immobilize' });
    expect(TimeStop.effects?.stun).toBeUndefined();
  });

  // --- Mez PROTECTION shares the mez slots and is foe-less too ------------------
  // The target-trap veto keys on "affects no foe", which is also true of every armor
  // and ally mez shield. Negative magnitude at aspect=Current is the discriminator:
  // applied control is always positive. Dropping these left the whole Thunderspy fork
  // without status protection while its HC and Rebirth twins carried it.
  it('Fortification keeps its self status protection (Rebirth twin carries the same −24)', () => {
    const prot = { mag: 1, scale: 24, table: 'Melee_Res_Boolean' };
    expect(Fortification.effects?.hold).toEqual(prot);
    expect(Fortification.effects?.stun).toEqual(prot);
    expect(Fortification.effects?.sleep).toEqual(prot);
    expect(Fortification.effects?.immobilize).toEqual(prot);
  });

  it('Clear Mind keeps its ALLY-cast protection — recipient is not part of the test', () => {
    // toWho `Target`, not `Self`: the protection rule is sign + aspect, nothing else.
    expect(ClearMind.effects?.hold).toEqual({ mag: 1, scale: 30, table: 'Ranged_Res_Boolean' });
    expect(ClearMind.effects?.fear).toEqual({ mag: 1, scale: 30, table: 'Ranged_Res_Boolean' });
  });
});
