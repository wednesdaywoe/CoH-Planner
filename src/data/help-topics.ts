/**
 * Help system topic data — defines all searchable help content.
 * Each topic has a title, description, category, and keywords for search scoring.
 */

import type { ComponentType } from 'react';

export type HelpCategory =
  | 'getting-started'
  | 'power-management'
  | 'enhancement-slotting'
  | 'dashboard-stats'
  | 'settings-toggles'
  | 'import-export'
  | 'keyboard-shortcuts';

export interface HelpCategoryInfo {
  id: HelpCategory;
  label: string;
  icon: string; // SVG path data
  color: string; // Tailwind text color class
  description: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  category: HelpCategory;
  description: string;
  keywords: string[];
  steps?: string[];
  tips?: string[];
  demoComponent?: ComponentType;
  mediaUrl?: string;
  mediaType?: 'gif' | 'video';
}

export const HELP_CATEGORIES: HelpCategoryInfo[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'text-emerald-400',
    description: 'Basic workflow to create your first build',
  },
  {
    id: 'power-management',
    label: 'Power Management',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    color: 'text-cyan-400',
    description: 'Selecting, reordering, and inspecting powers',
  },
  {
    id: 'enhancement-slotting',
    label: 'Enhancement Slotting',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    color: 'text-green-400',
    description: 'Slotting enhancements, IO sets, and multi-select',
  },
  {
    id: 'dashboard-stats',
    label: 'Dashboard & Stats',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'text-purple-400',
    description: 'Understanding and configuring dashboard statistics',
  },
  {
    id: 'settings-toggles',
    label: 'Settings & Toggles',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    color: 'text-amber-400',
    description: 'Proc DPS, ArcanaTime, Exemplar Mode, and more',
  },
  {
    id: 'import-export',
    label: 'Import / Export',
    icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
    color: 'text-blue-400',
    description: 'Importing from Mids, sharing builds, saving/loading',
  },
  {
    id: 'keyboard-shortcuts',
    label: 'Keyboard Shortcuts',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'text-rose-400',
    description: 'Quick reference for all keyboard and mouse controls',
  },
];

// ============================================
// HELP TOPICS
// ============================================

export const HELP_TOPICS: HelpTopic[] = [
  // GETTING STARTED
  {
    id: 'gs-pick-archetype',
    title: 'Picking an Archetype',
    category: 'getting-started',
    description: 'Start by choosing your Archetype from the dropdown in the header bar. This determines your available primary and secondary powersets, as well as AT-specific stat caps and inherent abilities.',
    keywords: ['AT', 'class', 'archetype', 'blaster', 'scrapper', 'tanker', 'first step', 'new build'],
    steps: [
      'Click the Archetype dropdown in the header',
      'Select your desired AT (e.g., Scrapper, Blaster)',
      'Your primary and secondary powerset dropdowns will update to show available sets',
    ],
  },
  {
    id: 'gs-pick-powersets',
    title: 'Choosing Powersets',
    category: 'getting-started',
    description: 'After selecting an AT, choose your Primary and Secondary powersets. The primary set defines your main role (damage, control, buffs), and the secondary supports it.',
    keywords: ['primary', 'secondary', 'powerset', 'choose', 'select'],
    steps: [
      'Select a Primary powerset from the dropdown',
      'Select a Secondary powerset from the dropdown',
      'Available powers appear in the power columns below',
    ],
  },
  {
    id: 'gs-slot-powers',
    title: 'Selecting and Slotting Powers',
    category: 'getting-started',
    description: 'Click on available powers to add them to your build. You have 24 power picks and 67 additional enhancement slots to distribute across your powers. The budget counters (Pwr and Slot) in the dashboard show remaining resources.',
    keywords: ['slot', 'pick', 'level', 'add power', 'budget', 'pwr', '24', '67'],
    steps: [
      'Click an available (unselected) power to add it to your build',
      'Click the + button next to a selected power to add an enhancement slot',
      'Click an empty slot to open the Enhancement Picker',
      'Watch the Pwr/Slot counters in the dashboard to track your budget',
    ],
  },
  {
    id: 'gs-pool-powers',
    title: 'Pool and Epic Powers',
    category: 'getting-started',
    description: 'In addition to primary and secondary, you can pick up to 4 power pools (Fitness, Speed, Leaping, etc.) and 1 Epic/Patron pool at level 35+. Pool powers appear in the Pools section below your primary/secondary.',
    keywords: ['pool', 'epic', 'patron', 'fitness', 'speed', 'leaping', 'hasten'],
  },

  // POWER MANAGEMENT
  {
    id: 'pm-select-power',
    title: 'Selecting Powers (Click)',
    category: 'power-management',
    description: 'Click an available power in the power list to add it to your build. Powers are organized by powerset. Selected powers show their enhancement slots.',
    keywords: ['click', 'add', 'select', 'pick', 'toggle'],
  },
  {
    id: 'pm-hover-info',
    title: 'Power Info on Hover',
    category: 'power-management',
    description: 'Hover over any power to see its details in the Info Panel on the right side. The panel shows damage numbers, cast time, recharge, endurance cost, and effects. A floating tooltip also follows your cursor with the same info. On mobile, long-press a power to view its info.',
    keywords: ['hover', 'tooltip', 'info panel', 'details', 'damage', 'cast time', 'recharge', 'long press'],
  },
  {
    id: 'pm-lock-info',
    title: 'Locking the Info Panel (Right-Click)',
    category: 'power-management',
    description: "Right-click a power to lock its information in the Info Panel. This keeps the panel showing that power's details even when you hover over other powers. Right-click again or click the lock icon to unlock.",
    keywords: ['right click', 'lock', 'pin', 'info panel', 'persistent'],
  },
  {
    id: 'pm-reorder',
    title: 'Reordering Powers',
    category: 'power-management',
    description: 'In Chronological view mode, you can drag powers to reorder them and change which level they are taken at. Switch to Chronological view using the view toggle in the dashboard action bar.',
    keywords: ['drag', 'reorder', 'move', 'chronological', 'level order'],
  },
  {
    id: 'pm-remove-power',
    title: 'Removing a Power',
    category: 'power-management',
    description: 'Click a selected power to deselect it and remove it from your build. Any enhancements slotted in that power will be removed.',
    keywords: ['remove', 'delete', 'deselect', 'unselect'],
  },

  // ENHANCEMENT SLOTTING
  {
    id: 'es-open-picker',
    title: 'Opening the Enhancement Picker',
    category: 'enhancement-slotting',
    description: 'Click on any empty enhancement slot in a selected power to open the Enhancement Picker. The picker shows all compatible IO sets and enhancement types for that power.',
    keywords: ['picker', 'open', 'empty slot', 'click slot'],
  },
  {
    id: 'es-slot-single',
    title: 'Slotting a Single Enhancement',
    category: 'enhancement-slotting',
    description: 'In the Enhancement Picker, click on an enhancement piece to immediately slot it and close the picker. The enhancement will appear in the slot you clicked to open the picker.',
    keywords: ['slot', 'single', 'click', 'place'],
  },
  {
    id: 'es-multi-select',
    title: 'Multi-Select with Shift+Click',
    category: 'enhancement-slotting',
    description: 'Hold Shift and click multiple enhancement pieces to select them. Selected pieces are highlighted. Then click any selected piece to slot all of them at once into consecutive empty slots. You can multi-select across different IO sets.',
    keywords: ['shift', 'multi', 'select', 'batch', 'multiple', 'bulk'],
  },
  {
    id: 'es-drag-select',
    title: 'Range Select by Dragging',
    category: 'enhancement-slotting',
    description: 'In the Enhancement Picker, click and drag across multiple pieces within a set to range-select them. Then click any selected piece to slot all of them at once.',
    keywords: ['drag', 'range', 'select', 'sweep'],
  },
  {
    id: 'es-remove-enhancement',
    title: 'Removing Enhancements',
    category: 'enhancement-slotting',
    description: 'Right-click a slotted enhancement to see a context menu with options to remove just the enhancement, remove the slot entirely, or clear all slots in that power.',
    keywords: ['remove', 'delete', 'clear', 'right click', 'context menu'],
  },
  {
    id: 'es-add-slots',
    title: 'Adding Enhancement Slots',
    category: 'enhancement-slotting',
    description: 'Each power starts with one free slot. Click the + button to add slots (up to 6 total per power). You have 67 additional slots to distribute. Drag the + button to rapidly add multiple slots.',
    keywords: ['add slot', 'plus', 'button', 'drag', '67', 'budget'],
  },
  {
    id: 'es-attune-boost',
    title: 'Attuning and Boosting',
    category: 'enhancement-slotting',
    description: 'Use the Attune and Boost controls in the header settings to globally attune all IOs (making them auto-level) or boost them (+1 to +5). Attuned IOs scale with your level and ignore exemplar suppression. Boosted IOs get extra enhancement value.',
    keywords: ['attune', 'boost', 'global', 'auto-level', 'exemplar'],
  },
  {
    id: 'es-compare-slotting',
    title: 'Compare Slotting Tool',
    category: 'enhancement-slotting',
    description: 'Shift + Right-click a slot to open the Slot Comparison Tool. This lets you compare different IO set combinations for a power, showing total enhancement values and set bonuses side by side.',
    keywords: ['compare', 'comparison', 'alternative', 'side by side', 'shift right click'],
  },

  // DASHBOARD & STATS
  {
    id: 'ds-overview',
    title: 'Dashboard Overview',
    category: 'dashboard-stats',
    description: "The dashboard at the top shows your character's calculated stats grouped by category (Offense, Defense, Resistance, etc.). Stats update in real-time as you slot enhancements and toggle powers.",
    keywords: ['dashboard', 'stats', 'overview', 'totals', 'numbers'],
  },
  {
    id: 'ds-stat-tracking',
    title: 'Tracking Stats (Click to Track)',
    category: 'dashboard-stats',
    description: 'Click any stat in the dashboard to "track" it. Tracked stats get a blue highlight ring, and IO sets in the Enhancement Picker that boost that stat will be highlighted. Click a tracked stat again to untrack it.',
    keywords: ['track', 'highlight', 'click stat', 'ring', 'blue', 'chase'],
  },
  {
    id: 'ds-stat-tooltips',
    title: 'Stat Breakdowns (Hover Tooltips)',
    category: 'dashboard-stats',
    description: 'Hover over any stat to see a detailed breakdown of all its sources: set bonuses, active powers, inherent powers, accolades, procs, and incarnate powers. Sources that exceed the Rule of 5 cap are shown in orange with strikethrough.',
    keywords: ['breakdown', 'tooltip', 'hover', 'sources', 'rule of 5', 'cap', 'orange'],
  },
  {
    id: 'ds-configure',
    title: 'Configuring Visible Stats',
    category: 'dashboard-stats',
    description: 'Click the Configure (gear) button in the dashboard action bar to open the Stats Config modal. Here you can show/hide individual stats, reorder them, and reset to defaults.',
    keywords: ['configure', 'gear', 'visible', 'show', 'hide', 'reorder'],
  },
  {
    id: 'ds-detailed-totals',
    title: 'Detailed Totals',
    category: 'dashboard-stats',
    description: 'Click the Totals button in the dashboard for a comprehensive view of all character stats, including full defense/resistance breakdowns, movement speeds, and mez protection values.',
    keywords: ['totals', 'detailed', 'full', 'comprehensive', 'all stats'],
  },
  {
    id: 'ds-perma-tracker',
    title: 'Perma Tracker',
    category: 'dashboard-stats',
    description: 'Right-click a power with recharge to add it to the Perma Tracker. This shows how much additional recharge bonus you need for that power to be "permanent" (recharge <= duration). The tracker displays the needed recharge amount.',
    keywords: ['perma', 'permanent', 'recharge', 'duration', 'hasten', 'tracker'],
  },

  // SETTINGS & TOGGLES
  {
    id: 'st-proc-dps',
    title: 'Proc DPS Toggle',
    category: 'settings-toggles',
    description: 'When enabled, proc damage is included in per-power DPS calculations shown in the Info Panel. Procs use the PPM (Procs Per Minute) formula based on cast time, recharge, and area factor. Disable this to see base power DPS only.',
    keywords: ['proc', 'DPS', 'PPM', 'procs per minute', 'toggle', 'damage'],
  },
  {
    id: 'st-avg-dmg',
    title: 'Avg Dmg Toggle',
    category: 'settings-toggles',
    description: 'Toggle between showing DPS (damage per second, divided by cycle time) or Avg Dmg (total average damage per activation) in power info. Avg Dmg shows total damage per cast, useful for comparing attacks without considering recharge.',
    keywords: ['avg', 'average', 'damage', 'DPA', 'DPS', 'per activation', 'per cast'],
  },
  {
    id: 'st-arcana-time',
    title: 'ArcanaTime Toggle',
    category: 'settings-toggles',
    description: "ArcanaTime adjusts cast times to account for the server's tick-based animation system. The server rounds cast times up to the nearest 0.132s server tick. Enable this for more accurate DPS calculations that match in-game behavior.",
    keywords: ['arcana', 'arcanatime', 'server tick', '0.132', 'cast time', 'animation'],
  },
  {
    id: 'st-exemplar-mode',
    title: 'Exemplar Mode',
    category: 'settings-toggles',
    description: 'When enabled, the planner respects exemplar level for IO set bonus suppression. IO set bonuses are suppressed when exemplared below the level required for the enhancement. Set the exemplar level with the level slider in the settings popover.',
    keywords: ['exemplar', 'sidekick', 'level', 'suppress', 'set bonus', 'lackey'],
  },
  {
    id: 'st-target-level',
    title: 'Target Level Offset',
    category: 'settings-toggles',
    description: 'Adjusts the enemy level relative to you (-5 to +5) for hit chance calculations. At +0, enemies are even level. Higher offsets reduce your accuracy and defense values. Found in the settings popover (gear icon).',
    keywords: ['target', 'level', 'enemy', 'hit chance', 'accuracy', 'offset', 'con'],
  },
  {
    id: 'st-ui-scale',
    title: 'UI Scale',
    category: 'settings-toggles',
    description: 'Adjust the overall interface size from 85% to 130% using the UI Scale slider in the settings popover (gear icon). Useful for high-DPI displays or if you prefer larger/smaller text.',
    keywords: ['zoom', 'scale', 'size', 'font', 'DPI', 'display'],
  },
  {
    id: 'st-at-inherents',
    title: 'AT Inherent Toggles',
    category: 'settings-toggles',
    description: 'Each archetype has inherent ability settings that appear in a second header row when applicable. Examples: Brute Fury level slider, Scrapper Critical Hits toggle, Dominator Domination toggle, Defender Vigilance team size. These adjust damage and stat calculations accordingly.',
    keywords: ['inherent', 'fury', 'critical', 'domination', 'scourge', 'vigilance', 'containment', 'supremacy', 'stalker', 'hidden', 'opportunity'],
  },

  // IMPORT / EXPORT
  {
    id: 'ie-mids-import',
    title: 'Importing from Mids',
    category: 'import-export',
    description: "Import builds from Mids' Reborn (.mbd files or data chunks). Open the Export/Import modal, switch to the Import tab, and paste the Mids data or upload a .mbd file.",
    keywords: ['mids', 'import', 'mbd', 'reborn', 'paste', 'upload', 'file'],
    steps: [
      'Open the Export/Import modal from the header menu',
      'Switch to the Import tab',
      'Select "Mids" as the import source',
      'Paste data chunk text or click "Upload .mbd file"',
      'Review any warnings and click "Apply" to load the build',
    ],
  },
  {
    id: 'ie-share',
    title: 'Sharing Builds',
    category: 'import-export',
    description: 'Share your build with others by generating a shareable link. Click the Share tab in the Export/Import modal, optionally add a description and author name, then click Share. The URL can be shared with anyone.',
    keywords: ['share', 'link', 'URL', 'public', 'send'],
  },
  {
    id: 'ie-save-load',
    title: 'Saving and Loading Builds',
    category: 'import-export',
    description: 'Save builds locally in your browser. Use the Save/Load tab in the Export/Import modal to manage local builds. You can also export a Popmenu file for in-game use.',
    keywords: ['save', 'load', 'local', 'browser', 'storage', 'popmenu'],
  },
  {
    id: 'ie-mids-export',
    title: 'Exporting to Mids (Experimental)',
    category: 'import-export',
    description: 'Export your build as a .mbd file that can be opened in Mids\' Reborn. This feature is experimental — some enhancements or power naming differences may not transfer perfectly.',
    keywords: ['export', 'mids', 'mbd', 'reborn', 'save', 'download'],
  },

  // KEYBOARD SHORTCUTS
  {
    id: 'ks-planner-desktop',
    title: 'Desktop Planner Controls',
    category: 'keyboard-shortcuts',
    description: 'Mouse and keyboard interactions for the main planner view on desktop.',
    keywords: ['mouse', 'keyboard', 'desktop', 'click', 'right-click', 'hover', 'drag'],
    steps: [
      'Hover over a power: See details in the info panel',
      'Click a power: Select/deselect it',
      'Right-click a power: Lock its info in the panel',
      'Right-click a slot: Remove enhancement or slot',
      'Shift + Right-click a slot: Compare Slotting tool',
      'Drag the + button: Add multiple slots at once',
    ],
  },
  {
    id: 'ks-picker-desktop',
    title: 'Enhancement Picker Controls',
    category: 'keyboard-shortcuts',
    description: 'Mouse interactions for the Enhancement Picker.',
    keywords: ['picker', 'enhancement', 'shift', 'click', 'drag'],
    steps: [
      'Click a piece: Slot a single enhancement',
      'Shift+Click: Multi-select pieces across sets',
      'Click a selected piece: Slot all selected at once',
      'Drag across pieces: Range-select within a set',
    ],
  },
  {
    id: 'ks-mobile-controls',
    title: 'Mobile / Touch Controls',
    category: 'keyboard-shortcuts',
    description: 'Touch interactions for the planner on phones and tablets.',
    keywords: ['mobile', 'touch', 'tap', 'long press', 'phone', 'tablet'],
    steps: [
      'Tap: Select powers or open the enhancement picker',
      'Long-press a power: View its info in the panel',
      'Touch and hold a slot: Action menu (add, remove, clear)',
      'Touch and drag the + button: Add multiple slots',
    ],
  },
  {
    id: 'ks-dashboard-controls',
    title: 'Dashboard Controls',
    category: 'keyboard-shortcuts',
    description: 'Interactions for the stats dashboard.',
    keywords: ['dashboard', 'stat', 'track', 'click'],
    steps: [
      'Click/Tap a stat: Track it (highlights IO Sets that boost it)',
      'Click/Tap a tracked stat: Untrack it',
      'Hover a stat: See breakdown of all sources',
      'Right-click a power: Add to Perma Tracker',
    ],
  },
];

// ============================================
// SEARCH
// ============================================

/**
 * Search help topics by query string.
 * Scores matches across title, description, keywords, and steps.
 * Returns topics sorted by relevance score.
 */
export function searchHelpTopics(query: string): HelpTopic[] {
  if (!query.trim()) return HELP_TOPICS;

  const words = query.toLowerCase().trim().split(/\s+/);

  const scored = HELP_TOPICS.map((topic) => {
    let score = 0;
    const titleLower = topic.title.toLowerCase();
    const descLower = topic.description.toLowerCase();
    const keywordsLower = topic.keywords.map((k) => k.toLowerCase());
    const stepsLower = (topic.steps ?? []).map((s) => s.toLowerCase());

    for (const word of words) {
      if (titleLower.includes(word)) score += 10;
      if (descLower.includes(word)) score += 3;
      if (keywordsLower.some((k) => k === word)) score += 8;
      else if (keywordsLower.some((k) => k.includes(word))) score += 4;
      if (stepsLower.some((s) => s.includes(word))) score += 2;
    }

    return { topic, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.topic);
}

export function getTopicsByCategory(category: HelpCategory): HelpTopic[] {
  return HELP_TOPICS.filter((t) => t.category === category);
}
