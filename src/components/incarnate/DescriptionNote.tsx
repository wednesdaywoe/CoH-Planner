/**
 * DescriptionNote — the disagreement banner for a power whose in-game text promises something
 * the planner's data does not carry.
 *
 * Deliberately unconfident. What we know is that two sources disagree; which one is right is a
 * question the player can settle in ten seconds by looking at the power in game, and we cannot.
 * The alternative wording ("this description is out of date") is a ruling on the game's intent
 * that nothing in the export sources, and it would read as authoritative on exactly the cases
 * where we turn out to be wrong.
 *
 * Nothing here decides which powers get a note: `src/data/description-notes.ts` holds the
 * adjudicated list and the sweep behind it.
 */

import { getDescriptionNote } from '@/data';

interface DescriptionNoteProps {
  /** Namespaced subject key, e.g. `incarnate:melee_genome_8`. */
  subject: string;
  /** Active dataset id — a divergence is per fork, and most forks read correctly. */
  dataset: string;
}

export function DescriptionNote({ subject, dataset }: DescriptionNoteProps) {
  const note = getDescriptionNote(subject, dataset);
  if (!note) return null;

  return (
    <div
      data-testid="description-note"
      title={note.detail}
      className="mt-0.5 text-[10px] leading-snug text-amber-400/90"
    >
      {/* A plain line, not a boxed banner: the pane it lands in is a 120px band that already
        * holds the name, tier and short help, and a box's padding and border push the last
        * line out of view. Same treatment the InfoPanel "Requires:" annotation uses. */}
      Description may be outdated — Sidekick finds {note.finding}. Check in game.
    </div>
  );
}
