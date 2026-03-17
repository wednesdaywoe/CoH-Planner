/**
 * BuildDetailPage — read-only preview of a shared build
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/Button';
import { getSharedBuild, incrementViews, isOwnedBuild, deleteBuild, reclaimBuild, updateBuildVisibility } from '@/services/sharedBuilds';
import { useBuildStore } from '@/stores/buildStore';
import { useAuthStore } from '@/stores/authStore';
import type { SharedBuild } from '@/types/shared';

export function BuildDetailPage() {
  const { id } = useParams({ from: '/builds/$id' });
  const navigate = useNavigate();
  const importBuild = useBuildStore((s) => s.importBuild);
  const user = useAuthStore((s) => s.user);

  const [build, setBuild] = useState<SharedBuild | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadConfirm, setLoadConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showReclaim, setShowReclaim] = useState(false);
  const [reclaimToken, setReclaimToken] = useState('');
  const [reclaimSuccess, setReclaimSuccess] = useState(false);
  const [owned, setOwned] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [visibilityError, setVisibilityError] = useState<string | null>(null);

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
          setOwned(isOwnedBuild(id, data));
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

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteBuild(id);
      navigate({ to: '/builds' });
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Failed to delete build');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!build || visibilityLoading) return;
    setVisibilityLoading(true);
    setVisibilityError(null);
    const newIsPublic = !build.is_public;
    try {
      await updateBuildVisibility(id, newIsPublic);
      setBuild({ ...build, is_public: newIsPublic });
    } catch (e) {
      setVisibilityError(e instanceof Error ? e.message : 'Failed to update visibility');
    } finally {
      setVisibilityLoading(false);
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
          <div className="flex gap-2 shrink-0 flex-wrap justify-end">
            <Button
              variant={copied ? 'secondary' : 'ghost'}
              size="sm"
              onClick={handleCopyLink}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            {/* Visibility toggle — only for Discord-linked owners */}
            {owned && user && build?.user_id === user.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleVisibility}
                isLoading={visibilityLoading}
                className={build?.is_public ? 'text-gray-400 hover:text-indigo-300' : 'text-indigo-400 hover:text-indigo-300'}
              >
                {build?.is_public ? 'Make Private' : 'Make Public'}
              </Button>
            )}
            {owned ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirm(true)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReclaim(!showReclaim)}
                className="text-gray-400 hover:text-gray-300"
              >
                Reclaim
              </Button>
            )}
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

      {/* Private build badge */}
      {build && !build.is_public && (
        <div className="bg-indigo-900/20 border border-indigo-700/50 rounded-lg px-4 py-2.5 mb-6 flex items-center gap-2 text-sm text-indigo-300">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          This build is private. Only you can see it.
        </div>
      )}

      {/* Visibility error */}
      {visibilityError && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 mb-6 text-sm text-red-300">
          {visibilityError}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-6 space-y-3">
          <p className="text-sm text-red-300 font-semibold">Are you sure you want to delete this build?</p>
          <p className="text-xs text-red-400">This action cannot be undone. The build will be permanently removed.</p>
          {deleteError && (
            <p className="text-xs text-red-300">{deleteError}</p>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setDeleteConfirm(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDelete}
              isLoading={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      )}

      {/* Reclaim ownership */}
      {showReclaim && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 space-y-3">
          <p className="text-sm text-gray-300 font-semibold">Reclaim Build</p>
          <p className="text-xs text-gray-400">
            Enter the owner token you received when you originally shared this build.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={reclaimToken}
              onChange={(e) => setReclaimToken(e.target.value)}
              placeholder="Paste owner token..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="primary"
              size="sm"
              disabled={!reclaimToken.trim()}
              onClick={() => {
                reclaimBuild(id, reclaimToken.trim());
                setOwned(true);
                setShowReclaim(false);
                setReclaimToken('');
                setReclaimSuccess(true);
                setTimeout(() => setReclaimSuccess(false), 3000);
              }}
            >
              Reclaim
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            If the token is incorrect, future update or delete attempts will fail.
          </p>
        </div>
      )}

      {reclaimSuccess && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 mb-6 text-sm text-green-300">
          Ownership reclaimed. You can now update or delete this build.
        </div>
      )}

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
