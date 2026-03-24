/**
 * Manually-maintained changelog for the WelcomeModal "What's New" list.
  * This is separate from the auto-generated changelog (changelog.ts) which is based on git history.
 */

export interface ManualChangelogGroup {
  date: string; // YYYY-MM-DD
  items: {
    message: string;
    type: 'feat' | 'fix' | 'update';
  }[];
}

/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ─── 2026-03-24 ────────────────────────────────────────────────────────────
  {
    date: '2026-03-24',
    items: [
      { message: 'Added Sudden Acceleration KBtoKD to the procs filter even though it isn\'t 😤', type: 'feat' },
      { message: 'Mobile: Suppressed hover tooltip on touch devices during power selection — use the info button instead', type: 'fix' },
      { message: 'Mobile: Larger touch targets for info, compare, and remove buttons on selected powers', type: 'fix' },
      { message: 'Mobile: Enhancement picker now shows piece names and aspects as a list instead of icon-only grid', type: 'feat' },
      { message: 'Elusivity and Defense Debuff Resistance now enhanced by slotted Defense enhancements', type: 'fix' },
      { message: 'Mez Resistance now enhanced by corresponding mez enhancements (Hold enhancements boost Hold resistance, etc.)', type: 'fix' },
      { message: 'Renamed "Tesla Coil" to "Paralyzing Blast" in Electric Control (Controller/Dominator)', type: 'fix' },
      { message: 'Toggle endurance costs: conversion script was not including activate_period from raw data — toggle costs were up to 4x too high', type: 'fix' },
      { message: 'Large data regeneration: 348 powersets regenerated with mezResistance, elusivity, and debuff resistance data', type: 'fix' },
      { message: 'Power-key utility to solve slotOrder issue where powers share an identical ID across categories', type: 'fix' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
