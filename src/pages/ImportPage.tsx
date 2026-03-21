/**
 * ImportPage — Receives a build from the Homecoming game client via URL fragment.
 *
 * URL format: /import#<deflate+base64 encoded JSON>
 * The fragment contains a compressed JSON blob in the same format as the
 * external tool import. This page decodes it, shows a summary, and lets
 * the user load it into the planner.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useBuildStore } from '@/stores';
import { importExternalBuild } from '@/utils/external-import/converter';
import type { ExternalImportResult } from '@/utils/external-import/converter';
import { decodeImportFragment } from '@/utils/import-url';
import { Button } from '@/components/ui';

type ImportState =
  | { status: 'loading' }
  | { status: 'success'; result: ExternalImportResult; selectedBuild: number; rawJson: string }
  | { status: 'error'; message: string }
  | { status: 'empty' };

export function ImportPage() {
  const [state, setState] = useState<ImportState>({ status: 'loading' });
  const [showWarnings, setShowWarnings] = useState(false);
  const navigate = useNavigate();
  const importMidsBuild = useBuildStore((s) => s.importMidsBuild);

  useEffect(() => {
    const fragment = window.location.hash;
    if (!fragment || fragment === '#') {
      setState({ status: 'empty' });
      return;
    }

    try {
      const json = decodeImportFragment(fragment);
      const result = importExternalBuild(json);
      if (result.success && result.build) {
        setState({
          status: 'success',
          result,
          selectedBuild: result.selectedBuild,
          rawJson: json,
        });
      } else {
        const msg = result.warnings.length > 0
          ? result.warnings[0].message
          : 'Failed to parse build data';
        setState({ status: 'error', message: msg });
      }
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to decode build data',
      });
    }
  }, []);

  const handleBuildSelect = useCallback((buildIndex: number) => {
    if (state.status !== 'success') return;
    const result = importExternalBuild(state.rawJson, buildIndex);
    if (result.success && result.build) {
      setState({ status: 'success', result, selectedBuild: buildIndex, rawJson: state.rawJson });
    }
  }, [state]);

  const handleApply = useCallback(() => {
    if (state.status !== 'success' || !state.result.build) return;
    importMidsBuild(state.result.build);
    navigate({ to: '/' });
  }, [state, importMidsBuild, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {state.status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Decoding build data...</p>
          </div>
        )}

        {state.status === 'empty' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-white mb-2">No Build Data</h2>
            <p className="text-slate-400 text-sm mb-4">
              This page receives builds from the Homecoming game client.
              No build data was found in the URL.
            </p>
            <Button variant="primary" onClick={() => navigate({ to: '/' })}>
              Go to Planner
            </Button>
          </div>
        )}

        {state.status === 'error' && (
          <div className="bg-slate-800 border border-red-700/50 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Import Failed</h2>
            <p className="text-slate-400 text-sm mb-4">{state.message}</p>
            <Button variant="primary" onClick={() => navigate({ to: '/' })}>
              Go to Planner
            </Button>
          </div>
        )}

        {state.status === 'success' && state.result.build && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Import from Homecoming</h2>

            {/* Build selector for multi-build exports */}
            {state.result.availableBuilds.length > 1 && (
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-2">
                  {state.result.availableBuilds.length} builds detected — select one:
                </p>
                <div className="flex gap-2">
                  {state.result.availableBuilds.map((b) => (
                    <button
                      key={b.index}
                      onClick={() => handleBuildSelect(b.index)}
                      className={`
                        px-3 py-1.5 rounded text-xs font-medium transition-colors
                        ${state.selectedBuild === b.index
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }
                      `}
                    >
                      Build {b.index + 1} ({b.enhancementCount} enh)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Build summary */}
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm mb-4">
              {state.result.build.name && (
                <>
                  <span className="text-slate-400">Character</span>
                  <span className="text-white">{state.result.build.name}</span>
                </>
              )}
              <span className="text-slate-400">Archetype</span>
              <span className="text-white">{state.result.build.archetype.name}</span>
              <span className="text-slate-400">Level</span>
              <span className="text-white">{state.result.build.level}</span>
              <span className="text-slate-400">Primary</span>
              <span className="text-white">{state.result.build.primary.name || 'None'}</span>
              <span className="text-slate-400">Secondary</span>
              <span className="text-white">{state.result.build.secondary.name || 'None'}</span>
              <span className="text-slate-400">Powers</span>
              <span className="text-white">
                {state.result.summary.powersImported} imported
                {state.result.summary.powersFailed > 0 && (
                  <span className="text-red-400"> / {state.result.summary.powersFailed} failed</span>
                )}
              </span>
              <span className="text-slate-400">Enhancements</span>
              <span className="text-white">
                {state.result.summary.enhancementsImported} imported
                {state.result.summary.enhancementsFailed > 0 && (
                  <span className="text-red-400"> / {state.result.summary.enhancementsFailed} failed</span>
                )}
              </span>
              {state.result.build.pools.length > 0 && (
                <>
                  <span className="text-slate-400">Pools</span>
                  <span className="text-white">
                    {state.result.build.pools.map((p) => p.name).join(', ')}
                  </span>
                </>
              )}
              {state.result.build.epicPool && (
                <>
                  <span className="text-slate-400">Epic/Patron</span>
                  <span className="text-white">{state.result.build.epicPool.name}</span>
                </>
              )}
            </div>

            {/* Warnings */}
            {state.result.warnings.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setShowWarnings(!showWarnings)}
                  className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  {state.result.warnings.length} warning{state.result.warnings.length !== 1 ? 's' : ''}
                  {showWarnings ? ' ▾' : ' ▸'}
                </button>
                {showWarnings && (
                  <ul className="mt-2 space-y-1 text-xs text-yellow-200 max-h-40 overflow-y-auto">
                    {state.result.warnings.map((w, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-yellow-500 shrink-0">[{w.type}]</span>
                        <span>{w.message}{w.name ? `: ${w.name}` : ''}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleApply} className="flex-1">
                Load Build
              </Button>
              <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
