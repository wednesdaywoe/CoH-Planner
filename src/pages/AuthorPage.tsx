/**
 * AuthorPage — public profile + builds grid for an author handle.
 *
 * Route: /author/{handle}. The "@" is purely a display convention in the UI;
 * the URL itself is plain. Resolves the handle via the resolve_author RPC
 * and lists the author's public builds. 404s gracefully if the handle is
 * unknown.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { resolveAuthor, type PublicAuthor } from '@/services/profile';
import { searchSharedBuilds } from '@/services/sharedBuilds';
import { BuildCard } from '@/components/shared/BuildCard';
import type { SearchResult } from '@/types/shared';

const PAGE_SIZE = 20;

export function AuthorPage() {
  const { handle } = useParams({ from: '/author/$handle' });
  const navigate = useNavigate();

  const [author, setAuthor] = useState<PublicAuthor | null>(null);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [authorError, setAuthorError] = useState<string | null>(null);

  const [result, setResult] = useState<SearchResult | null>(null);
  const [buildsLoading, setBuildsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'views'>('newest');
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently no-op
    }
  };

  // Resolve handle → profile
  useEffect(() => {
    let cancelled = false;
    setAuthorLoading(true);
    setAuthorError(null);
    resolveAuthor(handle)
      .then((p) => {
        if (cancelled) return;
        setAuthor(p);
      })
      .catch((e) => {
        if (!cancelled) setAuthorError(e instanceof Error ? e.message : 'Failed to load author');
      })
      .finally(() => {
        if (!cancelled) setAuthorLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  // Fetch this author's public builds whenever filter inputs change
  useEffect(() => {
    if (!author) return;
    let cancelled = false;
    setBuildsLoading(true);
    searchSharedBuilds({
      authorId: author.user_id,
      query: search.trim() || undefined,
      sortBy,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      })
      .finally(() => {
        if (!cancelled) setBuildsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [author, search, sortBy, page]);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  if (authorLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-gray-400 py-12">
        <p>Loading author...</p>
      </div>
    );
  }

  if (authorError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-900/20 border border-red-700/50 rounded p-4 text-sm text-red-300">
          {authorError}
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-2">Author not found</h1>
        <p className="text-sm text-gray-400 mb-6">
          No author with handle <span className="text-gray-300">@{handle}</span> exists.
        </p>
        <button
          onClick={() => navigate({ to: '/builds' })}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Browse all builds →
        </button>
      </div>
    );
  }

  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 0;
  const builds = result?.builds ?? [];

  const selectClass =
    'bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* Close button */}
      <button
        onClick={() => navigate({ to: '/builds' })}
        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
        title="Back to Builds"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Profile header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6 flex items-start gap-4">
        {author.avatar_url ? (
          <img src={author.avatar_url} alt="" className="w-16 h-16 rounded-full shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-700 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-white truncate">{author.display_name}</h1>
          <p className="text-sm text-gray-400">@{author.handle}</p>
          {author.bio && (
            <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{author.bio}</p>
          )}
          <div className="text-xs text-gray-500 mt-3 flex items-center gap-2 flex-wrap">
            <span>
              {total} public build{total === 1 ? '' : 's'}
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              {linkCopied ? (
                <>
                  <svg
                    className="w-3.5 h-3.5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-green-400">Link copied</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 015.656 0l1.414 1.414a4 4 0 010 5.656l-3 3a4 4 0 01-5.656 0L11 19.5m1.828-9.328L11 12M10.172 13.828a4 4 0 01-5.656 0L3.1 12.414a4 4 0 010-5.656l3-3a4 4 0 015.656 0L13 4.5m-1.828 9.328L13 12"
                    />
                  </svg>
                  Copy profile link
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search this author's builds..."
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'views')}
          className={selectClass}
        >
          <option value="newest">Newest</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      {/* Builds grid */}
      {buildsLoading ? (
        <div className="text-center py-12 text-gray-400">
          <p>Loading builds...</p>
        </div>
      ) : builds.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>
            {search.trim()
              ? 'No builds match your search.'
              : `${author.display_name} hasn't shared any public builds yet.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {builds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
