/**
 * Feature-announcement registry.
 *
 * Each entry is a spotlight shown once on load until the user dismisses it. The
 * first announcement whose id is NOT in `uiStore.dismissedAnnouncements`
 * auto-shows (see AnnouncementModal). Dismissal is keyed by id, so adding a new
 * entry here re-surfaces a spotlight for everyone — including users who already
 * dismissed earlier ones.
 *
 * To announce a new feature: add an entry to the TOP of ANNOUNCEMENTS with a
 * fresh, stable `id` (never rename/reuse an id — that's the dismissal key).
 */

import type { ReactNode } from 'react';

/** What the primary CTA button does when clicked. */
export type AnnouncementAction =
  | { kind: 'openModal'; modal: 'attackChain' }
  | { kind: 'navigate'; to: string };

export interface Announcement {
  /** Stable dismissal key — never rename or reuse. */
  id: string;
  /** Short label for the tab strip (the full `title` is the heading inside). */
  tabLabel: string;
  /** Small pill label, e.g. "New". Omit for none. */
  badge?: string;
  title: string;
  body: ReactNode;
  /** Optional preview image; the path is passed through resolvePath() at render. */
  image?: string;
  /** Primary action button. Omit for an FYI-only spotlight. */
  cta?: { label: string; action: AnnouncementAction };
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'rearrangeable-layout',
    tabLabel: 'Custom Layout',
    badge: 'New',
    title: 'Make the planner your own 🏡',
    body: (
      <>
        The planner is now yours to rearrange! Drag sections to reorder them,
        resize panels to fit what matters most, and collapse anything you
        don&apos;t need. You can even hide entire sections through the Layout button at the top. Your layout is remembered between sessions. 
      </>
    ),
    image: '/rearrange.webp',
  },
  {
    id: 'color-themes',
    tabLabel: 'Color Themes',
    badge: 'New',
    title: 'Color themes are here 🎨',
    body: (
      <>
        Give Sidekick a new look! Pick from themes representing City of Heroes, City of Villains, Praetoria, Vigilante/Rogue, or stick with the original because magenta rules. Choose one any time under{' '}
        <span className="text-gray-100 font-medium">Settings → Appearance</span>.
      </>
    ),
    image: '/colorthemes.png',
    cta: { label: 'Pick a theme', action: { kind: 'navigate', to: '/settings' } },
  },
  {
    id: 'attack-chain-builder',
    tabLabel: 'Attack Chain',
    badge: 'New',
    title: 'Try the new Attack Chain Builder 😎',
    body: (
      <>
        Add your attacks onto a timeline to see your rotation&apos;s DPS, dead
        time, and check your endurance burn against your recovery. Open it any
        time from the{' '}
        <span className="text-gray-100 font-medium">Attack Chain</span> button on
        the dashboard.
      </>
    ),
    image: '/chainbuilder.png',
    cta: { label: 'Try it now', action: { kind: 'openModal', modal: 'attackChain' } },
  },
];
