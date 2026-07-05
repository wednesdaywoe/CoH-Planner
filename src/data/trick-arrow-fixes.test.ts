import { describe, it, expect } from 'vitest';
import { getTableValue } from '@/data/datasets/homecoming/at-tables';
import type { ScaledEffect } from '@/types';
import { FlashArrow } from '@/data/datasets/homecoming/powersets/defender/primary/trick-arrow/flash-arrow';
import { IceArrow } from '@/data/datasets/homecoming/powersets/defender/primary/trick-arrow/ice-arrow';
import { PoisonGasArrow } from '@/data/datasets/homecoming/powersets/defender/primary/trick-arrow/poison-gas-arrow';
import { DullPain } from '@/data/datasets/homecoming/powersets/scrapper/secondary/regeneration/dull-pain';
import { EMPArrow } from '@/data/datasets/homecoming/powersets/defender/primary/trick-arrow/emp-arrow';
import { ThunderousBlast } from '@/data/datasets/homecoming/powersets/sentinel/primary/electrical-blast/thunderous-blast';
import { Hibernate } from '@/data/datasets/homecoming/powersets/tanker/primary/ice-armor/hibernate';

/**
 * Regression guards for the Trick Arrow effect-collapse fixes (2026-07-05):
 *   ① collectTemplatesDeep drops `enttype target> player eq` PvP groups so the
 *      PvE values are no longer clobbered (last-write-wins).
 *   ③ extractEffects coalesces resistable + IgnoreResistance DEBUFF twins into
 *      one slot tagged `unresistable` (the UI renders both halves), WITHOUT
 *      touching self-buff twins (which legitimately sum).
 *   ④ getTableValue aliases `Ranged_Debuff_Dam` → `ranged_debuff_dmg` so damage
 *      debuffs resolve through the AT table (−0.125) instead of the half-rate
 *      generic fallback.
 *   ② addOrAccumulate is duration-aware for DEBUFFS: a debuff the power applies
 *      twice at different durations (EMP -Regen 15s+45s, Thunderous Blast
 *      -Recovery 10s+20s) splits into a primary (longest-lived) + per-duration
 *      `durationVariants` instead of summing into one value at one duration.
 *      Self-sustain BUFFS still sum regardless of duration (Hibernate).
 */
describe('Trick Arrow effect-collapse fixes', () => {
  const eff = (p: { effects?: unknown }) => p.effects as Record<string, unknown>;
  const scaled = (v: unknown) => v as ScaledEffect;

  it('④ damage-debuff table name resolves (not half)', () => {
    expect(getTableValue('defender', 'Ranged_Debuff_Dam', 50)).toBeCloseTo(-0.125, 5);
    // Same value whether the power spells it _Dam or _Dmg.
    expect(getTableValue('defender', 'Ranged_Debuff_Dmg', 50)).toBeCloseTo(-0.125, 5);
  });

  it('① Flash Arrow shows PvE ToHit 0.75 / 60s, not PvP 0.5 / 20s', () => {
    const e = eff(FlashArrow);
    expect(scaled(e.tohitDebuff).scale).toBe(0.75);
    expect((e.durations as Record<string, number>).tohitDebuff).toBe(60);
  });

  it('③ Flash Arrow ToHit is tagged unresistable (split debuff twin)', () => {
    expect(scaled(eff(FlashArrow).tohitDebuff).unresistable).toBe(true);
  });

  it('③④ Poison Gas -DMG is scale 2 (→25%) and tagged unresistable', () => {
    const e = eff(PoisonGasArrow);
    expect(scaled(e.damageDebuff).scale).toBe(2);
    expect(scaled(e.damageDebuff).unresistable).toBe(true);
  });

  it('④① Ice Arrow -DMG is scale 1.6 (→20%), single (no twin), -Special 60s', () => {
    const e = eff(IceArrow);
    expect(scaled(e.damageDebuff).scale).toBe(1.6);
    expect(scaled(e.damageDebuff).unresistable).toBeUndefined();
    expect((e.durations as Record<string, number>).specialDebuff).toBe(60);
  });

  it('③ self-buff twins are NOT coalesced/halved (Dull Pain +MaxHP stays 2)', () => {
    const e = eff(DullPain);
    expect(scaled(e.maxHPBuff).scale).toBe(2);
    expect(scaled(e.maxHPBuff).unresistable).toBeUndefined();
  });

  it('⑤ EMP Field surfaces the +Resistance buff and mez PROTECTION (not offense)', () => {
    const summon = (eff(EMPArrow).summon ?? {}) as {
      resolvedEntities?: { abilities?: { effects?: { type: string }[] }[] }[];
    };
    const types = new Set(
      (summon.resolvedEntities ?? [])
        .flatMap((re) => re.abilities ?? [])
        .flatMap((ab) => ab.effects ?? [])
        .map((e) => e.type),
    );
    // The +15% all-resistance buff was previously dropped entirely.
    expect(types.has('ResistanceBuff')).toBe(true);
    // Mez protection to allies must NOT be inverted into offensive control, and
    // EVERY mez attrib of a [Held, Stunned, Sleep] template must surface (not
    // just the first).
    expect(types.has('HoldProtection')).toBe(true);
    expect(types.has('StunProtection')).toBe(true);
    expect(types.has('SleepProtection')).toBe(true);
    expect(types.has('Hold')).toBe(false);
    expect(types.has('Immobilize')).toBe(false);
    // End-drain / recovery-debuff RESISTANCE, not an offensive -Recovery debuff.
    expect(types.has('RecoveryDebuffResist')).toBe(true);
    expect(types.has('RecoveryDebuff')).toBe(false);
  });

  it('② EMP -Regen splits into 45s primary + 15s variant (not summed -1000%)', () => {
    const e = eff(EMPArrow);
    const regen = scaled(e.regenDebuff);
    // Primary is the longest-lived instance (-500% for 45s), NOT the -1000% sum.
    expect(regen.scale).toBe(5);
    expect((e.durations as Record<string, number>).regenDebuff).toBe(45);
    // The shorter -500% @ 15s instance rides along as a duration variant.
    expect(regen.durationVariants).toEqual([{ scale: 5, duration: 15 }]);
  });

  it('② Thunderous Blast -Recovery splits into 20s primary + 10s variant', () => {
    const e = eff(ThunderousBlast);
    const rec = scaled(e.recoveryDebuff);
    expect(rec.scale).toBe(1);
    expect((e.durations as Record<string, number>).recoveryDebuff).toBe(20);
    expect(rec.durationVariants).toEqual([{ scale: 1, duration: 10 }]);
  });

  it('② self-sustain BUFFS still sum, never split (Hibernate +Recovery stays 4)', () => {
    const rec = scaled(eff(Hibernate).recoveryBuff);
    expect(rec.scale).toBe(4);
    expect(rec.durationVariants).toBeUndefined();
  });
});
