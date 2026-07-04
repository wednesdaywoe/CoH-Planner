import { describe, it, expect } from 'vitest';
// Read straight from the committed generated base (pre-override) so a future regen
// can't silently undo the summon→pet linkage (GAME-DATA-PRINCIPLES §9).
import { UmbraBeast } from './datasets/thunderspy/generated/powersets/controller/primary/darkness-control/umbra-beast';
import { ShadowField } from './datasets/thunderspy/generated/powersets/controller/primary/darkness-control/shadow-field';
import { Haunt } from './datasets/thunderspy/generated/powersets/controller/primary/darkness-control/haunt';
import { SingleShot } from './datasets/thunderspy/generated/powersets/blaster/primary/beam-blast/single-shot';
// Negative case: a plain single-target Hold must NOT gain a phantom summon.
import { DarkGrasp } from './datasets/thunderspy/generated/powersets/controller/primary/darkness-control/dark-grasp';
import { PET_ENTITIES } from './datasets/thunderspy/pet-entities';

/**
 * Thunderspy pet / pseudo-pet summon recovery — the DATA-DRIVEN fix.
 *
 * Thunderspy's Parse6-derived AttribMod schema does NOT carry Create_Entity as a
 * template front attrib the way HC/Rebirth do. Instead it packs the EntCreate list
 * into a NESTED struct-array inside a single effect element, each pet sub-entry
 * leading with the byte-granular raw marker 465 ( = Create_Entity: Rebirth's -1 index
 * shift + HC's byte-granular +1 sub-index) and carrying its own EntityDef / PriorityList
 * offsets. The element's *front* attrib is a bare `Ones`/`Level` summon shell. The
 * single-template parser only surfaced that shell, so EVERY Thunderspy summon lost its
 * pet linkage: Umbra Beast / Phantasm / MM henchmen / rains / chain-jump & teleport-strike
 * pseudo-pets (Lightning Rod, Shield Charge, Savage Leap, Disintegrate spread) all
 * exported as a bare shell with no `params.entity_def`, so the converter's Create_Entity
 * handler no-opped and the info panel showed nothing.
 *
 * The fix (`_extract_thunderspy_summons` in `_powers.py`) splits the element at each 465
 * marker and emits one Create_Entity template per pet with
 * `params:{type:'EntCreate', entity_def, priority_list?, redirects?}` — matching HC's
 * one-template-per-pet shape so the existing converter/display path
 * (`params.entity_def` → PET_ENTITIES) works unchanged. Verified: 465-marker count ==
 * pet count (Haunt 2 shades, Summon Wolves 3, Rally 6, Hell on Earth 10); 809 player
 * summon sub-entries, 0 missing EntityDef.
 *
 * These re-read the recovered shape from the committed dataset (GAME-DATA-PRINCIPLES §9).
 */
describe('Thunderspy pet / pseudo-pet summon recovery (data-driven)', () => {
  it('Umbra Beast links to its Pets_Umbra_Beast entity (single pet)', () => {
    expect(UmbraBeast.effects?.summon?.entity).toBe('Pets_Umbra_Beast');
    // The entity_def is the verbatim PET_ENTITIES key — getPetEntity resolves it.
    const ent = PET_ENTITIES['Pets_Umbra_Beast'];
    expect(ent).toBeDefined();
    expect(ent.abilities.length).toBeGreaterThan(0);
  });

  it('Shadow Field (location pseudo-pet) links to Pets_Shadow_Field_Controller', () => {
    expect(ShadowField.effects?.summon?.entity).toBe('Pets_Shadow_Field_Controller');
    const ent = PET_ENTITIES['Pets_Shadow_Field_Controller'];
    expect(ent).toBeDefined();
    // The field's actual Hold rides the entity's auto-pulse ability, not the summon shell.
    const hasHold = ent.abilities.some(a => (a.effects || []).some(e => e.type === 'Hold'));
    expect(hasHold).toBe(true);
  });

  it('Haunt counts BOTH shades (465-marker count == pet count)', () => {
    expect(Haunt.effects?.summon?.entity).toBe('Pets_Shade');
    expect(Haunt.effects?.summon?.entityCount).toBe(2);
    expect(PET_ENTITIES['Pets_Shade']).toBeDefined();
  });

  it('an attack pseudo-pet is surfaced: Beam Single Shot → Pets_DisintegrateSpread', () => {
    // The Disintegrate spread is an incidental Create_Entity on a damage attack,
    // gated on the target already Disintegrating — so it rides a conditionalEffect,
    // not the base `effects`, but is emitted alongside the attack's own effects.
    const cond = SingleShot.conditionalEffects?.find(
      c => c.effects?.summon?.entity === 'Pets_DisintegrateSpread',
    );
    expect(cond).toBeDefined();
  });

  it('a plain single-target Hold gains NO phantom summon (no false positive)', () => {
    expect(DarkGrasp.effects?.summon).toBeUndefined();
  });

  // --- TSPY9: pet ABILITY extraction (generic tspy `Damage` attrib) -----------
  // convert-pet-entities' extractDamage keyed only on specific `*_Dmg` attribs +
  // `aspect === 'Absolute'`. Thunderspy pets carry the generic `Damage` attrib
  // with the aspect dropped, so every pure-attack pet (Howler Wolf, Demonlings,
  // Knight Minion, …) extracted ZERO damage and was skipped as "no combat
  // abilities" — its summon linked but showed only the pet name. The fix accepts
  // a positive-scale `Damage` on a `*_Damage` table and types it from the shortHelp.
  it('a summoned attack-pet resolves with element-typed damage (Howler Wolf)', () => {
    const wolf = PET_ENTITIES['MastermindPets_Howler_Wolf'];
    expect(wolf).toBeDefined();
    const bite = wolf.abilities.find(a => a.name === 'Vicious_Bite');
    expect(bite).toBeDefined();
    // Element resolved from the shortHelp DMG(Lethal), scale/table from the binary.
    expect(bite!.damage).toEqual([
      { damageType: 'Lethal', scale: 0.84, table: 'Melee_Damage' },
    ]);
  });
});
