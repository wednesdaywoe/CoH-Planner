import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerPool } from '@/data';
import { isPermaEligible } from '@/utils/calculations/perma';
import { SpeedBoost } from './datasets/thunderspy/generated/powersets/controller/secondary/kinetics/speed-boost';
import { SiphonSpeed } from './datasets/thunderspy/generated/powersets/controller/secondary/kinetics/siphon-speed';
import { Absorption } from './datasets/thunderspy/generated/powersets/warshade/epic/umbral-aura/absorption';
import { GrantCover } from './datasets/thunderspy/generated/powersets/tanker/primary/shield-defense/grant-cover';
import { DisruptingTorrent } from './datasets/thunderspy/generated/powersets/dominator/secondary/kinetic-assault/disrupting-torrent';
// Two DIFFERENT powers share the internal name Touch_of_Fear: the Blaster Darkness
// Manipulation "Touch of the Beyond" (advertises "Self +Regeneration") and the Dark
// Melee fear attack (no self-buff). The guard must keep the former, drop the latter.
import { TouchofFear as TouchOfTheBeyond } from './datasets/thunderspy/generated/powersets/blaster/secondary/darkness-manipulation/touch-of-fear';
import { TouchofFear as DarkMeleeTouchOfFear } from './datasets/thunderspy/generated/powersets/brute/primary/dark-melee/touch-of-fear';
import { EquipRobot } from './datasets/thunderspy/generated/powersets/mastermind/primary/robotics/equip-robot';
import { Repair } from './datasets/thunderspy/generated/powersets/mastermind/primary/robotics/repair';
import { FortifyPack } from './datasets/thunderspy/generated/powersets/mastermind/primary/beast-mastery/fortify-pack';
import { RallyTheMilitia } from './datasets/thunderspy/generated/powersets/mastermind/primary/knights/rally-the-militia';

/**
 * Thunderspy `Ones`-attrib buff recovery — the DATA-DRIVEN fix.
 *
 * Thunderspy's older AttribMod schema stores a front string-attrib (the
 * *enhancement aspect* — here the catch-all `Ones` on the `*_Ones` unit tables)
 * plus a separate post-`requires` INDEX array naming the *affected* stat. The
 * parser historically read only the front, so every `Ones`-based recharge /
 * recovery / regen / endurance buff was unclassifiable and dropped — e.g. Hasten
 * had no `rechargeBuff` (no +recharge) and no `buffDuration` (no perma "Track").
 *
 * The fix (`_parse_effect_template_thunderspy` + `ATTRIB_NAME_THUNDERSPY`) decodes
 * the index array — with Thunderspy's RechargeTime at index 89 (HC: 90) — and, for
 * a lone `['Ones']` front, relabels to the real stat when it is one of the
 * high-confidence resource/recharge attribs (recharge/recovery/regen/endurance).
 * Sign alone then routes buff vs debuff. This replaced the earlier shortHelp-driven
 * `recoverThunderspyOnesBuffs` converter workaround (which only reached 3 Self
 * powers) with the actual binary datum — now covering ally buffs and debuffs too.
 *
 * These tests re-read the recovered shape from the committed dataset so a future
 * regen can't silently undo it (GAME-DATA-PRINCIPLES §9).
 */
describe('Thunderspy Ones-attrib buff recovery (data-driven)', () => {
  beforeAll(async () => {
    await loadDataset('thunderspy');
  });

  it('Hasten recovers its +70% recharge buff and 120s duration from the binary', () => {
    const hasten = getPowerPool('speed')?.powers.find((p) => p.internalName === 'Hasten');
    expect(hasten).toBeDefined();
    expect(hasten!.effects?.rechargeBuff).toEqual({ scale: 0.7, table: 'Melee_Ones' });
    expect(hasten!.effects?.buffDuration).toBe(120);
  });

  it('Hasten is perma-eligible (the Track button appears)', () => {
    const hasten = getPowerPool('speed')?.powers.find((p) => p.internalName === 'Hasten');
    // 450s recharge / 120s duration, self recharge-buff → eligible.
    expect(isPermaEligible(hasten!)).toBe(true);
  });

  it('Speed Boost recovers BOTH +recharge and +recovery (multi-stat ally buff the shortHelp hack could not)', () => {
    expect(SpeedBoost.effects?.rechargeBuff).toEqual({ scale: 0.5, table: 'Melee_Ones' });
    expect(SpeedBoost.effects?.recoveryBuff).toEqual({ scale: 0.25, table: 'Melee_Ones' });
    expect(SpeedBoost.effects?.buffDuration).toBe(240);
  });

  it('Siphon Speed routes its negative-scale Ones template to a recharge DEBUFF', () => {
    // -0.2 RechargeTime → rechargeDebuff (sign discriminates buff vs debuff),
    // never a bogus +recharge buff.
    expect(SiphonSpeed.effects?.rechargeDebuff).toEqual({ scale: 0.2, table: 'Melee_Ones' });
    expect(SiphonSpeed.effects?.rechargeBuff).toBeUndefined();
  });

  it('Burnout (instant power-reset, not a +recharge buff) stays ineligible', () => {
    // Burnout's Ones template is the Recharge_Power reset mechanic (index outside
    // the recoverable allowlist), so it must NOT gain a rechargeBuff / buffDuration.
    const burnout = getPowerPool('speed')?.powers.find((p) => p.internalName === 'Burnout');
    expect(burnout).toBeDefined();
    expect(burnout!.effects?.rechargeBuff).toBeUndefined();
    expect(burnout!.effects?.buffDuration).toBeUndefined();
    expect(isPermaEligible(burnout!)).toBe(false);
  });

  // --- Disambiguation vetoes (guardThunderspyOnesBuffs) ---------------------
  // Thunderspy drops the AttribMod aspect AND per-template target, so an index-89
  // RechargeTime template can be a real +recharge buff OR a resistance-to-slow, and
  // a positive resource template on a foe attack looks like a caster self-buff. The
  // binary can't tell them apart; these assert the shortHelp/target vetoes hold.

  it('Absorption (Kheldian +Res passive) does NOT gain a phantom +recharge buff (aspect-trap)', () => {
    // Its RechargeTime Ones template is resistance-to-slow with the aspect dropped;
    // shortHelp advertises only +Res, so no +recharge buff must surface.
    expect(Absorption.effects?.rechargeBuff).toBeUndefined();
    // The +Res (Energy/Negative) is now surfaced from the `Res_DMG`-front index
    // array (tspy-resist-tohit-vocab, 2026-07-09) — byte-identical to HC's own
    // Absorption, which likewise carries resistance.energy + a 10.25s auto-reapply
    // `buffDuration`. So a buffDuration here is the REAL resistance duration, not the
    // phantom recharge buff this test guards; assert it tracks the resistance.
    expect(Absorption.effects?.resistance?.energy).toBeDefined();
    expect(Absorption.effects?.durations?.rechargeBuff).toBeUndefined();
    if (Absorption.effects?.buffDuration !== undefined) {
      expect(Absorption.effects.buffDuration).toBe(Absorption.effects.durations?.resistance);
    }
  });

  it('Grant Cover keeps its defense but not a phantom +recharge (its recharge is +RES(Recharge Debuff))', () => {
    expect(GrantCover.effects?.rechargeBuff).toBeUndefined();
    expect(GrantCover.effects?.defenseBuff).toBeDefined();
  });

  it('Disrupting Torrent (foe attack, no self-buff advertised) does NOT gain a caster +regen (target-trap)', () => {
    expect(DisruptingTorrent.targetType).toBe('Foe');
    expect(DisruptingTorrent.effects?.regenBuff).toBeUndefined();
    expect(DisruptingTorrent.effects?.recoveryBuff).toBeUndefined();
  });

  it('the foe-target veto is shortHelp-aware: it drops the phantom regen but keeps a genuine advertised one', () => {
    // Both target a Foe and share internalName Touch_of_Fear, but only the Blaster
    // one advertises "Self +Regeneration" — so its regenBuff must survive while the
    // Dark Melee fear attack's must not.
    expect(TouchOfTheBeyond.shortHelp).toMatch(/\+\s*Regeneration/i);
    expect(TouchOfTheBeyond.effects?.regenBuff).toBeDefined();
    expect(DarkMeleeTouchOfFear.effects?.regenBuff).toBeUndefined();
  });

  // --- Pet target-trap (guardThunderspyOnesBuffs, `targets_affected=['MyPet']`) ------
  // The MM pet-upgrade powers are auto-pulse PBAoEs cast on Self whose effects land on
  // the henchmen (the binary's `targets_affected` says MyPet, but the per-template target
  // is dropped). Their uniform, unadvertised +15% Recovery therefore reads as a caster
  // self-buff and leaked into the MM's Recovery. Drop it — but shortHelp-aware, so a power
  // that genuinely buffs Self+Pets keeps its buff.

  it('Equip Robot does NOT leak the pets’ +15% Recovery into the MM (pet target-trap)', () => {
    // Auto PBAoE, target_type=Self but targets_affected=['MyPet'], shortHelp names no Self buff.
    expect(EquipRobot.effects?.recoveryBuff).toBeUndefined();
    expect(EquipRobot.effects?.buffDuration).toBeUndefined();
  });

  it('Repair does NOT leak its pet Endurance heal into the MM', () => {
    expect(Repair.effects?.enduranceGain).toBeUndefined();
  });

  it('Fortify Pack (Pets-only +Def/+Regen, no Self) drops BOTH the phantom regen and defense', () => {
    expect(FortifyPack.shortHelp).not.toMatch(/\bself\b/i);
    expect(FortifyPack.effects?.regenBuff).toBeUndefined();
    expect(FortifyPack.effects?.defenseBuff).toBeUndefined();
  });

  it('the pet-target veto is shortHelp-aware: Rally the Militia keeps its Self +Def/+Regen', () => {
    // Same targets_affected=['MyPet'] as the phantom cases, but its shortHelp is
    // "Self, Pets +Defense, +Regeneration" — it genuinely buffs the MM, so both survive.
    expect(RallyTheMilitia.shortHelp).toMatch(/\bself\b/i);
    expect(RallyTheMilitia.effects?.regenBuff).toBeDefined();
    expect(RallyTheMilitia.effects?.defenseBuff).toBeDefined();
  });
});
