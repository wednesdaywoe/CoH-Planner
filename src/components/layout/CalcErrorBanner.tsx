/**
 * Partial-calculation banner — the per-item half of the engine's fail-loud path, where
 * {@link EngineErrorBanner} is the total-failure half.
 *
 * The engine computes around anything it cannot resolve rather than aborting, so a build
 * with an unreadable power renders completely: every card, slot, enhancement and toggle
 * looks right, and only the totals are short. Until now the miss went to `console.error`
 * and nowhere else, which is invisible to everyone who isn't holding devtools open — a
 * real level-50 build lost 22.5% recharge and ~13 points of positional defense this way and
 * read as intact.
 *
 * Deliberately not dismissible, for the same reason as the engine banner: the numbers stay
 * wrong after the click, and the banner is the only thing saying so.
 */

import { useState } from 'react';
import { useEngineStore } from '@/engine/engineStore';
import { useBuildStore } from '@/stores/buildStore';
import { getAllDatasetMetadata } from '@/data/dataset';

function datasetLabel(serverId: string): string {
  return getAllDatasetMetadata().find((d) => d.id === serverId)?.displayName ?? serverId;
}

export function CalcErrorBanner() {
  const { lines, missingPowers, allMissingPowers } = useEngineStore((s) => s.calcErrors);
  const serverId = useBuildStore((s) => s.build.serverId);
  const [showDetails, setShowDetails] = useState(false);

  if (lines.length === 0) return null;

  // Naming the powers is only honest when they are the WHOLE story; with anything else in
  // the list, a named subset reads as the full account of what went wrong.
  const headline =
    allMissingPowers && missingPowers.length > 0 ? (
      <>
        <span className="font-semibold">
          {missingPowers.length === 1
            ? `1 power in this build isn't in the ${datasetLabel(serverId)} data:`
            : `${missingPowers.length} powers in this build aren't in the ${datasetLabel(serverId)} data:`}
        </span>{' '}
        {missingPowers.join(', ')}. The totals below are missing{' '}
        {missingPowers.length === 1 ? 'it' : 'them'}.
      </>
    ) : (
      <>
        <span className="font-semibold">
          Part of this build couldn&apos;t be calculated ({lines.length}{' '}
          {lines.length === 1 ? 'issue' : 'issues'}).
        </span>{' '}
        The totals below are incomplete.
      </>
    );

  return (
    <div role="alert" className="bg-amber-600/90 text-white text-sm px-4 py-1.5">
      <div className="flex items-center justify-center gap-3 flex-wrap text-center">
        <span>{headline}</span>
        <button
          onClick={() => setShowDetails((v) => !v)}
          className="underline underline-offset-2 text-white/90 hover:text-white transition-colors whitespace-nowrap"
          aria-expanded={showDetails}
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
      </div>
      {showDetails && (
        <div className="mt-2 mx-auto max-w-3xl text-left">
          <ul className="space-y-1">
            {lines.map((line) => (
              <li key={line} className="font-mono text-xs text-white/90 break-words">
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-white/80">
            If the numbers look wrong, this is why. Please report it with the lines above.
          </p>
        </div>
      )}
    </div>
  );
}
