import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data';
import { useBuildStore } from '@/stores/buildStore';
import type { Power, SelectedPower } from '@/types';

/**
 * Powers with `maxSlots: 0` accept no enhancement slots at all — the mode
 * setters and stance switchers (Bio Armor's Adaptation/Evolution, Dual
 * Pistols' Swap Ammo, Staff Fighting's Staff Mastery, Martial Combat's Reach
 * for the Limit). `addPower` enforces that on pick, and the slim serializer
 * faithfully stores `slots: []`.
 *
 * `hydratePowers` then undid it: "ensure at least one slot" pushed a null onto
 * every empty array, without the `maxSlots !== 0` guard its inherent-merge
 * sibling has. So a build round-tripped through JSON export, a share link, the
 * /import route, or a cloud load came back with a phantom slot the picker
 * never gives it — visible in the UI, but unusable.
 */
describe('unslottable powers survive import without a phantom slot', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  const pick = (category: 'primary' | 'secondary', powersetId: string, internalName: string) => {
    const def = getPowerset(powersetId)?.powers.find((p: Power) => p.internalName === internalName);
    expect(def, `${internalName} exists in ${powersetId}`).toBeDefined();
    // The UI always hands addPower a base slot; addPower is what strips it
    // back off for an unslottable power.
    useBuildStore.getState().addPower(category, {
      ...def!,
      powerSet: powersetId,
      level: useBuildStore.getState().build.level,
      slots: [null],
    } as SelectedPower);
  };

  const find = (category: 'primary' | 'secondary', internalName: string): SelectedPower | undefined =>
    useBuildStore.getState().build[category].powers.find((p) => p.internalName === internalName);

  it.each([
    // A stance/mode setter in every one of these sets — all common picks, not
    // hidden powers. maxSlots 0 comes straight from the exported power data.
    ['blaster', 'blaster/dual-pistols', 'blaster/martial-combat', 'primary', 'Swap_Ammo'],
    ['blaster', 'blaster/dual-pistols', 'blaster/martial-combat', 'secondary', 'Reach_for_the_Limit'],
    ['scrapper', 'scrapper/staff-fighting', 'scrapper/bio-armor', 'primary', 'Staff_Mastery'],
    ['scrapper', 'scrapper/staff-fighting', 'scrapper/bio-armor', 'secondary', 'Evolution'],
  ] as const)(
    '%s %s keeps %s (%s) unslotted across an export → import round trip',
    (archetypeId, primaryId, secondaryId, category, internalName) => {
      const s = () => useBuildStore.getState();
      s().resetBuild();
      s().setArchetype(archetypeId);
      s().setPrimary(primaryId);
      s().setSecondary(secondaryId);
      s().setLevel(50);

      pick(category, category === 'primary' ? primaryId : secondaryId, internalName);

      const picked = find(category, internalName);
      expect(picked, `${internalName} picked`).toBeDefined();
      expect(picked!.maxSlots, `${internalName} is unslottable`).toBe(0);
      // Precondition: if addPower ever stops stripping the base slot, the
      // round-trip assertion below stops testing hydration.
      expect(picked!.slots, `${internalName} has no slots when picked`).toHaveLength(0);

      const json = s().exportBuild();
      const exported = JSON.parse(json).build[category].powers as Array<{
        internalName: string;
        slots: unknown[];
      }>;
      expect(
        exported.find((p) => p.internalName === internalName)?.slots,
        `${internalName} exported with no slots`,
      ).toHaveLength(0);

      expect(s().importBuild(json)).toBe(true);

      expect(
        find(category, internalName)?.slots,
        `${internalName} imported with no slots`,
      ).toHaveLength(0);
    },
  );

  // The other direction: a build saved back when the power's definition still
  // claimed slots (or hand-edited JSON) carries real stored slots. Restoring
  // them would spend the 67-slot budget on a power that can't hold them, so
  // the stored slots have to be dropped, not merely left un-padded. This
  // mirrors what the inherent merge does for Ninja Run / Beast Run.
  it('drops stored slots carried on a now-unslottable power', () => {
    const s = () => useBuildStore.getState();
    s().resetBuild();
    s().setArchetype('blaster');
    s().setPrimary('blaster/dual-pistols');
    s().setSecondary('blaster/martial-combat');
    s().setLevel(50);
    pick('primary', 'blaster/dual-pistols', 'Swap_Ammo');

    const data = JSON.parse(s().exportBuild());
    const stale = data.build.primary.powers.find(
      (p: { internalName: string }) => p.internalName === 'Swap_Ammo',
    );
    expect(stale, 'Swap_Ammo present in the export').toBeDefined();
    stale.slots = [null, null, null];

    expect(s().importBuild(JSON.stringify(data))).toBe(true);
    expect(find('primary', 'Swap_Ammo')?.slots, 'stale slots dropped').toHaveLength(0);
  });
});
