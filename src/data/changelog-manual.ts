/**
 * Manually-maintained changelog for the WelcomeModal "What's New" list.
  * This is separate from the auto-generated changelog (changelog.ts) which is based on git history.
 */

export interface ManualChangelogGroup {
  date: string; // YYYY-MM-DD
  items: {
    message: string;
    type: 'feat' | 'fix' | 'update' | 'known-issue';
  }[];
}

/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update' | 'known-issue';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ───────────────────────────────────────────────────────────────────────
  {
    date: '2026-07-09',

    items:[
      {message: '', type:'feat'},
      {message: '', type:'feat'},
    ]
  },
  {
    date: '2026-07-08',

    items: [
      { message: 'New "Slotted Procs" controls in the power info panel: each slotted proc now has its own on/off switch, plus a slider for variable procs. A stack slider for Might of the Tanker (0–3 stacks of +Res(All)) and an HP% slider for Reactive Defenses\' scaling +Res(All) (3%→12.9%). Settings save and share with the build', type: 'feat'},
      { message: 'Might of the Tanker\'s +Res(All) proc now contributes to your resistance totals (resolved at the correct 5%/stack via the slotted-power modifier, rather than the raw unscaled value). Defaults to 1 stack; slide to set your actual stack count. Procs in a toggled-off power correctly contribute nothing. This will move resistance numbers on builds slotting it.', type: 'update'},
      { message: 'Thunderspy: the Gadgetry power and Utility Belt pools are now available. It was present in the game data but wasn\'t being surfaced in the planner', type: 'feat'},
      { message: 'Stance and mode toggles should now correctly suppress the powers they disable', type: 'fix'},
      { message: 'Power hover-tooltips now show conditional, stance-gated healing (such as DNA Siphon) that previously only appeared in the full info panel.', type: 'fix'},
      { message: 'Corrected Obscure Sustenance\'s recharge', type: 'update'},
      { message: '🚨 A very large and comprehensive data converter rewrite was implemented to address a large family of bugs related to the old coverter flattening data and dropping important attributes before it reached the planner (ie: a power does energy/smashing damage, but in the planner you only see the smashing damage portion). If the change is successful, you won\'t notice anything has changed other than more information surfacing in the planner that was previously missing 🚨', type: 'fix'},
      { message: 'Added support for Incarnate Judgement power in attack chain calculations', type: 'feat'},
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
