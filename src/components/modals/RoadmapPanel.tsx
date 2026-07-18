/**
 * The "Road to 1.0" panel rendered inside AnnouncementModal's pinned tab.
 * Vertical path of category nodes (glow = in-progress), each expandable to its
 * item checklist; an expandable intro carries the author's explainer. Pure
 * presentation over the roadmap data model — see data/core/roadmap.
 */

import { useState } from 'react';
import {
  ROADMAP_INTRO,
  ROADMAP_GROUPS,
  deriveGroupState,
  roadmapProgress,
  type StepState,
  type RoadmapGroup,
} from '@/data/core/roadmap';

const STATE_ICON: Record<StepState, string> = {
  done: '✅',
  'in-progress': '🔄',
  planned: '⬜',
};

/** Marker ring per node state. In-progress glows with the theme accent. */
function nodeMarkerClass(state: StepState): string {
  if (state === 'done') return 'bg-[var(--color-selected)] border-[var(--color-selected)]';
  if (state === 'in-progress')
    return 'bg-[var(--color-sk-magenta)] border-[var(--color-sk-magenta)] roadmap-glow';
  return 'bg-transparent border-gray-600';
}

function groupProgress(group: RoadmapGroup): string {
  const done = group.items.filter((i) => i.state === 'done').length;
  return `${done}/${group.items.length}`;
}

export function RoadmapPanel({ onSeeWhatsNew }: { onSeeWhatsNew: () => void }) {
  const [introOpen, setIntroOpen] = useState(false);
  // Default-expand the in-progress groups so the "current work" is visible.
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () =>
      new Set(
        ROADMAP_GROUPS.filter((g) => deriveGroupState(g) === 'in-progress').map((g) => g.id),
      ),
  );
  const { done, total } = roadmapProgress();
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="space-y-5">
      {/* Expandable intro */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/40">
        <button
          type="button"
          onClick={() => setIntroOpen((o) => !o)}
          aria-expanded={introOpen}
          className="w-full flex items-start gap-2 text-left px-4 py-3"
        >
          <span
            className={`mt-0.5 text-gray-400 transition-transform ${introOpen ? 'rotate-90' : ''}`}
            aria-hidden
          >
            ▸
          </span>
          <span className="text-sm text-gray-200">{ROADMAP_INTRO.teaser}</span>
        </button>
        {introOpen && (
          <div className="px-4 pb-4 max-h-72 overflow-y-auto">{ROADMAP_INTRO.full}</div>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Progress</span>
          <span>
            {done} of {total} done
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
          <div
            className="h-full bg-[var(--color-sk-magenta)] rounded-full transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Vertical node path */}
      <ol className="relative pl-1">
        {ROADMAP_GROUPS.map((group, idx) => {
          const state = deriveGroupState(group);
          const isOpen = openGroups.has(group.id);
          const panelId = `roadmap-group-${group.id}`;
          const isLast = idx === ROADMAP_GROUPS.length - 1;
          return (
            <li key={group.id} className="relative pl-8 pb-4">
              {/* Connector line */}
              {!isLast && (
                <span
                  className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-700"
                  aria-hidden
                />
              )}
              {/* Node marker */}
              <span
                className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 ${nodeMarkerClass(state)}`}
                aria-hidden
              />
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center gap-2 text-left py-1"
              >
                <span className="text-sm">{STATE_ICON[state]}</span>
                <span className="text-sm font-medium text-gray-100 flex-1">{group.title}</span>
                <span className="text-xs text-gray-400 tabular-nums">{groupProgress(group)}</span>
                <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} aria-hidden>
                  ▸
                </span>
              </button>
              {isOpen && (
                <ul id={panelId} className="mt-1 space-y-1.5">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span aria-hidden>{STATE_ICON[item.state]}</span>
                      <span>
                        {item.label}
                        {item.detail && (
                          <span className="block text-xs text-gray-500">{item.detail}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      {/* Link to the featurette tabs */}
      <div className="text-right">
        <button
          type="button"
          onClick={onSeeWhatsNew}
          className="text-sm text-[var(--color-sk-magenta)] hover:underline"
        >
          See what else is new →
        </button>
      </div>
    </div>
  );
}
