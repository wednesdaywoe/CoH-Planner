/**
 * BuildCard — compact card for displaying a shared build in search results
 */

import { useNavigate } from '@tanstack/react-router';
import type { SharedBuild } from '@/types/shared';

interface BuildCardProps {
  build: SharedBuild;
}

export function BuildCard({ build }: BuildCardProps) {
  const navigate = useNavigate();

  const timeAgo = getTimeAgo(build.created_at);

  return (
    <button
      type="button"
      onClick={() => navigate({ to: '/builds/$id', params: { id: build.id } })}
      className="w-full text-left bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-500 hover:bg-gray-750 transition-colors cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-white text-sm truncate">{build.name}</h3>
        <span className="text-xs text-gray-500 shrink-0">Lv {build.level}</span>
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
        <span>{build.author_name || 'Anonymous'}{build.server ? ` · ${build.server}` : ''}</span>
        <span className="flex items-center gap-2">
          <span>{build.views} views</span>
          <span>{timeAgo}</span>
        </span>
      </div>
    </button>
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
