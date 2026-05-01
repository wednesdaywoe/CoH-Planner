/**
 * BuildCard — compact card for displaying a shared build in search results
 */

import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { isFavorite, toggleFavorite, isOwnedBuild, deleteBuild } from '@/services/sharedBuilds';
import type { SharedBuild } from '@/types/shared';

interface BuildCardProps {
  build: SharedBuild;
  /** Show inline delete button */
  showDelete?: boolean;
  /** Callback after successful delete */
  onDeleted?: (id: string) => void;
  /** Callback when author name is clicked */
  onAuthorClick?: (authorId: string | null, authorName: string) => void;
  /** Show visibility toggle (lock icon) for the My Builds tab */
  onVisibilityToggle?: (id: string, isPublic: boolean) => Promise<void>;
}

export function BuildCard({ build, showDelete, onDeleted, onAuthorClick, onVisibilityToggle }: BuildCardProps) {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(() => isFavorite(build.id));
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(build.is_public);

  const timeAgo = getTimeAgo(build.created_at);
  const owned = showDelete && isOwnedBuild(build.id, build);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nowFav = toggleFavorite(build.id);
    setFavorited(nowFav);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteLoading(true);
    try {
      await deleteBuild(build.id);
      onDeleted?.(build.id);
    } catch {
      // Fall back to detail page if delete fails
      setDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Verified author with a handle → public author page
    if (build.author_handle) {
      navigate({ to: '/author/$handle', params: { handle: build.author_handle } });
      return;
    }
    // Otherwise fall back to filtering the build list by author
    if (onAuthorClick && build.author_name) {
      onAuthorClick(build.user_id ?? null, build.author_name);
    }
  };

  const handleVisibilityToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onVisibilityToggle || visibilityLoading) return;
    setVisibilityLoading(true);
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic); // optimistic update
    try {
      await onVisibilityToggle(build.id, newIsPublic);
    } catch {
      setIsPublic(!newIsPublic); // revert on error
    } finally {
      setVisibilityLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => navigate({ to: '/builds/$id', params: { id: build.id } })}
        className="w-full text-left bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-500 hover:bg-gray-750 transition-colors cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{build.name}</h3>
            {!isPublic && (
              <span className="shrink-0 px-1 py-0.5 bg-indigo-900/60 border border-indigo-700/50 rounded text-[10px] text-indigo-300 font-medium">
                Private
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-gray-500">Lv {build.level}</span>
            {/* Favorite star */}
            <span
              role="button"
              onClick={handleFavoriteClick}
              className={`text-sm transition-colors ${favorited ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400/60'}`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favorited ? '\u2605' : '\u2606'}
            </span>
            {/* Visibility toggle (My Builds tab) */}
            {onVisibilityToggle && !deleteConfirm && (
              <span
                role="button"
                onClick={handleVisibilityToggle}
                className={`p-0.5 transition-colors rounded ${visibilityLoading ? 'opacity-50' : ''} ${
                  isPublic ? 'text-gray-500 hover:text-indigo-400' : 'text-indigo-400 hover:text-indigo-300'
                }`}
                title={isPublic ? 'Make private (save to vault)' : 'Make public'}
              >
                {isPublic ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </span>
            )}
            {/* Delete (My Builds tab) */}
            {owned && !deleteConfirm && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true); }}
                className="p-0.5 text-gray-600 hover:text-red-400 transition-colors rounded"
                title="Delete build"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Archetype + Powersets */}
        <div className="text-xs text-gray-400 space-y-0.5 mb-3">
          <p className="text-blue-400 font-medium">{build.archetype_name}</p>
          <p>{build.primary_name} / {build.secondary_name}</p>
        </div>

        {/* Description preview */}
        {build.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{build.description}</p>
        )}

        {/* Tags */}
        {build.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {build.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded text-[10px]"
              >
                {tag}
              </span>
            ))}
            {build.tags.length > 4 && (
              <span className="text-[10px] text-gray-500">+{build.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>
            {build.author_name ? (
              <span
                role="button"
                onClick={handleAuthorClick}
                className={
                  build.author_handle || onAuthorClick
                    ? 'hover:text-blue-400 transition-colors'
                    : ''
                }
              >
                {build.author_name}
              </span>
            ) : (
              'Anonymous'
            )}
            {build.server ? ` · ${build.server}` : ''}
          </span>
          <span className="flex items-center gap-2">
            <span>{build.views} views</span>
            <span>{timeAgo}</span>
          </span>
        </div>
      </button>

      {/* Delete confirmation overlay */}
      {deleteConfirm && (
        <div
          className="absolute inset-0 bg-gray-900/95 border border-red-700/50 rounded-lg flex flex-col items-center justify-center gap-3 p-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm text-red-300 font-medium text-center">Delete this build?</p>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(false); }}
              disabled={deleteLoading}
              className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
