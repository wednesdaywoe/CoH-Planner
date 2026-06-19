/**
 * TagsRow — chip-style render of `power.shortHelp`.
 *
 * shortHelp strings follow a loose convention like
 *   "Ranged, Moderate DoT(Cold), Foe Hold, -Def"
 * each comma-separated chunk being a tag the player skims for at-a-glance
 * power identity. Renders each chunk as a colored chip categorised by the
 * leading character / keyword:
 *
 *   `-X`           → debuff   (amber)
 *   `+X` / `Self +`/ `Ally +` → buff (green)
 *   `Foe X`        → mez      (purple)
 *   `DMG`/`DoT`    → damage   (red)
 *   `Summon`/`Toggle` → other (cyan)
 *   default         → range/area/target (slate)
 *
 * Falls back to a single chip for shortHelp strings that don't comma-split.
 */

import type { ReactNode } from 'react';

interface TagsRowProps {
  shortHelp: string;
}

// Two overlapping codes share this table:
//   • the *semantic* code used by shortHelp tags (debuff/buff/mez/damage/…)
//   • the *enhancement-aspect* code used by AllowedEnhancementsBlock, which
//     mirrors the baked-in POG icon colors (public/img/Enhancements/
//     Components/POGS). The extra color families below (yellow/blue/orange/
//     pink/maroon) exist for that second code — Accuracy=yellow,
//     Endurance=blue, Hold=orange, Fear=pink, Recharge=maroon. The two
//     codes never appear in the same chip group, so reusing red/purple/
//     cyan/green/gray across both is fine.
export type TagKind =
  | 'debuff' | 'buff' | 'mez' | 'damage' | 'other' | 'neutral'
  | 'yellow' | 'blue' | 'orange' | 'pink' | 'maroon';

const KIND_CLASSES: Record<TagKind, string> = {
  debuff:  'bg-amber-500/15 text-amber-300  border-amber-500/30',
  buff:    'bg-green-500/15 text-green-300  border-green-500/30',
  mez:     'bg-purple-500/15 text-purple-300 border-purple-500/30',
  damage:  'bg-red-500/15   text-red-300    border-red-500/30',
  other:   'bg-cyan-500/15  text-cyan-300   border-cyan-500/30',
  neutral: 'bg-slate-700/40 text-slate-300  border-slate-600/40',
  yellow:  'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  blue:    'bg-blue-500/15   text-blue-300   border-blue-500/30',
  orange:  'bg-orange-500/15 text-orange-300 border-orange-500/30',
  pink:    'bg-pink-500/15   text-pink-300   border-pink-500/30',
  maroon:  'bg-rose-900/30   text-rose-200   border-rose-800/40',
};

/**
 * Reusable tag chip. Shared by TagsRow (shortHelp), PowerMetaTags (Power
 * Type / Target Type) and AllowedEnhancementsBlock so all chip styling
 * lives in one place.
 */
export function Chip({ kind = 'neutral', title, children }: { kind?: TagKind; title?: string; children: ReactNode }) {
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded border ${KIND_CLASSES[kind]} whitespace-nowrap`}
      title={title}
    >
      {children}
    </span>
  );
}

function classifyTag(raw: string): TagKind {
  const t = raw.trim();
  if (!t) return 'neutral';
  // Debuff: leading minus, e.g. `-Def`, `-Speed`. Also catches `Foe -DEF`.
  if (/^-\w/.test(t) || /\s-\w/.test(t)) return 'debuff';
  // Buff: leading plus or `Self +X` / `Ally +X` / `Team +X` / `+X`.
  if (/(^|\s)\+\w/.test(t) || /^(Self|Ally|Team)\s+\+/i.test(t)) return 'buff';
  // Mez: `Foe Hold`, `Foe Sleep`, etc. (also bare mez words like `Disorient`).
  if (/^Foe\s/i.test(t) || /\b(Hold|Sleep|Stun|Disorient|Confuse|Fear|Terrify|Immobilize|Knockback|Knockdown|Knock\s*Up|Forced\s*Movement)\b/i.test(t)) {
    return 'mez';
  }
  // Damage: contains DMG or DoT keyword, e.g. `Moderate DoT(Cold)`.
  if (/\b(DMG|DoT)\b/i.test(t)) return 'damage';
  // Toggle / Summon — special-case "other" tags.
  if (/^(Toggle|Summon|Auto)\b/i.test(t)) return 'other';
  return 'neutral';
}

/**
 * Split shortHelp on commas without breaking parenthesised type lists.
 * `"Ranged (Targeted AoE), Light DMG(Cold/Smash), Foe Knockback"` →
 *   ["Ranged (Targeted AoE)", "Light DMG(Cold/Smash)", "Foe Knockback"]
 */
function splitTags(shortHelp: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of shortHelp) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) parts.push(trimmed);
      current = '';
    } else {
      current += ch;
    }
  }
  const tail = current.trim();
  if (tail) parts.push(tail);
  return parts;
}

/**
 * The shortHelp chips as a bare fragment (no wrapping container), so callers
 * can place them in the same flex-wrap row as other tags (e.g. PowerMetaTags).
 */
export function ShortHelpChips({ shortHelp }: TagsRowProps) {
  const tags = splitTags(shortHelp);
  if (tags.length === 0) return null;
  return (
    <>
      {tags.map((tag, i) => (
        <Chip key={`${i}-${tag}`} kind={classifyTag(tag)}>
          {tag}
        </Chip>
      ))}
    </>
  );
}

export function TagsRow({ shortHelp }: TagsRowProps) {
  if (splitTags(shortHelp).length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      <ShortHelpChips shortHelp={shortHelp} />
    </div>
  );
}
