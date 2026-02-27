/**
 * BuildDetailPage — read-only preview of a shared build
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/Button';
import { getSharedBuild, incrementViews } from '@/services/sharedBuilds';
import { useBuildStore } from '@/stores/buildStore';
import type { SharedBuild } from '@/types/shared';

export function BuildDetailPage() {
  const { id } = useParams({ from: '/builds/$id' });
  const navigate = useNavigate();
  const importBuild = useBuildStore((s) => s.importBuild);

  const [build, setBuild] = useState<SharedBuild | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadConfirm, setLoadConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        const data = await getSharedBuild(id);
        if (cancelled) return;
        if (!data) {
          setError('Build not found');
        } else {
          setBuild(data);
          incrementViews(id);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load build');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const handleLoadBuild = () => {
    if (!build) return;
    const success = importBuild(JSON.stringify(build.build_json));
    if (success) {
      navigate({ to: '/' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-12">
        <p className="text-gray-400">Loading build...</p>
      </div>
    );
  }

  if (error || !build) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Build Not Found</h1>
        <p className="text-gray-400 mb-6">{error || 'This build does not exist or has been removed.'}</p>
        <Button variant="secondary" onClick={() => navigate({ to: '/builds' })}>
          Browse Builds
        </Button>
      </div>
    );
  }

  const buildData = build.build_json.build;
  const pools = buildData.pools ?? [];
  const epicPool = buildData.epicPool;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back link */}
      <button
        onClick={() => navigate({ to: '/builds' })}
        className="text-sm text-gray-400 hover:text-gray-300 mb-4 inline-block transition-colors"
      >
        &larr; Back to Builds
      </button>

      {/* Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{build.name}</h1>
            <p className="text-blue-400 font-medium">
              {build.archetype_name} — Level {build.level}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant={copied ? 'secondary' : 'ghost'}
              size="sm"
              onClick={handleCopyLink}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>

        {/* Powersets */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-500">Primary:</span>{' '}
            <span className="text-white">{build.primary_name}</span>
          </div>
          <div>
            <span className="text-gray-500">Secondary:</span>{' '}
            <span className="text-white">{build.secondary_name}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {build.author_name && <span>By {build.author_name}</span>}
          {build.server && <span>{build.server}</span>}
          <span>{new Date(build.created_at).toLocaleDateString()}</span>
          <span>{build.views} views</span>
        </div>
      </div>

      {/* Description */}
      {build.description && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">Description</h2>
          <p className="text-sm text-gray-400 whitespace-pre-wrap">{build.description}</p>
        </div>
      )}

      {/* Tags */}
      {build.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {build.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Power Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">Powers</h2>
        <div className="space-y-4">
          {/* Primary */}
          <PowersetSummary label="Primary" name={build.primary_name} powers={buildData.primary.powers} />

          {/* Secondary */}
          <PowersetSummary label="Secondary" name={build.secondary_name} powers={buildData.secondary.powers} />

          {/* Pools */}
          {pools.map((pool) => (
            <PowersetSummary key={pool.id} label="Pool" name={pool.name} powers={pool.powers} />
          ))}

          {/* Epic */}
          {epicPool && (
            <PowersetSummary label="Epic" name={epicPool.name} powers={epicPool.powers} />
          )}
        </div>
      </div>

      {/* Load into Planner */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-20">
        {!loadConfirm ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Want to use this build?</p>
            <Button variant="primary" onClick={() => setLoadConfirm(true)}>
              Load into Planner
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 text-sm text-yellow-300">
              <p className="font-semibold mb-1">Warning:</p>
              <p>This will replace your current build. Make sure to export your current build first if you want to keep it.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setLoadConfirm(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleLoadBuild}>
                Confirm & Load
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Simple power list for a powerset */
function PowersetSummary({
  label,
  name,
  powers,
}: {
  label: string;
  name: string;
  powers: { name: string; level: number; slots: unknown[] }[];
}) {
  if (powers.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">
        {label}: <span className="text-gray-300">{name}</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {powers.map((power) => (
          <span
            key={power.name}
            className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
            title={`Level ${power.level} · ${power.slots.length} slot${power.slots.length !== 1 ? 's' : ''}`}
          >
            {power.name}
          </span>
        ))}
      </div>
    </div>
  );
}
