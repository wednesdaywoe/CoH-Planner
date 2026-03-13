/**
 * BuildsPage — shared builds browser with My Builds, Favorites, and public search
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores';
import { BuildCard } from '@/components/shared/BuildCard';
import { BuildFilters } from '@/components/shared/BuildFilters';
import {
  searchSharedBuilds,
  getMyBuilds,
  getFavoriteBuilds,
  isShareEnabled,
} from '@/services/sharedBuilds';
import type { SharedBuild, SearchFilters, SearchResult } from '@/types/shared';

type Tab = 'mine' | 'favorites' | 'all';

const EMPTY_RESULT: SearchResult = {
  builds: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
};

export function BuildsPage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>(user ? 'mine' : 'all');
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'newest',
    page: 1,
    pageSize: 20,
  });
  const [result, setResult] = useState<SearchResult>(EMPTY_RESULT);
  const [myBuilds, setMyBuilds] = useState<SharedBuild[]>([]);
  const [favoriteBuilds, setFavoriteBuilds] = useState<SharedBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // My Builds local sort/search
  const [mySortBy, setMySortBy] = useState<'newest' | 'views' | 'name'>('newest');
  const [mySearch, setMySearch] = useState('');

  // Author filter banner
  const authorFilter = filters.authorId || filters.authorName;

  const fetchBuilds = useCallback(async (currentFilters: SearchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchSharedBuilds(currentFilters);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load builds');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyBuilds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const builds = await getMyBuilds();
      setMyBuilds(builds);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load your builds');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const builds = await getFavoriteBuilds();
      setFavoriteBuilds(builds);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'mine' && user) {
      fetchMyBuilds();
    } else if (tab === 'favorites') {
      fetchFavorites();
    } else {
      if (tab === 'mine' && !user) setTab('all');
      fetchBuilds(filters);
    }
  }, [filters, fetchBuilds, fetchMyBuilds, fetchFavorites, tab, user]);

  // Sort and filter My Builds locally
  const filteredMyBuilds = (() => {
    let builds = [...myBuilds];
    if (mySearch.trim()) {
      const q = mySearch.toLowerCase();
      builds = builds.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.archetype_name.toLowerCase().includes(q) ||
          b.primary_name.toLowerCase().includes(q) ||
          b.secondary_name.toLowerCase().includes(q),
      );
    }
    builds.sort((a, b) => {
      if (mySortBy === 'views') return b.views - a.views;
      if (mySortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return builds;
  })();

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleAuthorClick = (authorId: string | null, authorName: string) => {
    setTab('all');
    setFilters({
      sortBy: 'newest',
      page: 1,
      pageSize: 20,
      ...(authorId ? { authorId } : { authorName }),
    });
  };

  const clearAuthorFilter = () => {
    setFilters((prev) => {
      const { authorId: _a, authorName: _n, ...rest } = prev;
      return { ...rest, page: 1 };
    });
  };

  const handleBuildDeleted = (id: string) => {
    setMyBuilds((prev) => prev.filter((b) => b.id !== id));
  };

  if (!isShareEnabled()) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Shared Builds</h1>
        <p className="text-gray-400">
          Build sharing is not yet configured. Check back soon!
        </p>
      </div>
    );
  }

  const navigate = useNavigate();

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'mine', label: 'My Builds', show: !!user },
    { key: 'favorites', label: 'Favorites', show: true },
    { key: 'all', label: 'All Builds', show: true },
  ];

  const selectClass =
    'bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* Close button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
        title="Back to Planner"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Shared Builds</h1>
        <p className="text-gray-400 text-sm">
          Browse builds shared by the community. Share your own from the Export/Import menu.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-gray-800 border border-gray-700 rounded-lg p-1 w-fit">
        {tabs.filter((t) => t.show).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              tab === t.key
                ? 'bg-gray-700 text-white font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Author filter banner */}
      {tab === 'all' && authorFilter && (
        <div className="flex items-center gap-2 mb-4 bg-blue-900/20 border border-blue-700/40 rounded-lg px-3 py-2">
          <span className="text-sm text-blue-300">
            Showing builds by <span className="font-medium">{filters.authorName || 'this author'}</span>
          </span>
          <button
            onClick={clearAuthorFilter}
            className="text-xs text-blue-400 hover:text-white ml-auto transition-colors"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Filters (only for "All Builds" tab) */}
      {tab === 'all' && (
        <div className="mb-6">
          <BuildFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>
      )}

      {/* My Builds controls */}
      {tab === 'mine' && myBuilds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            value={mySearch}
            onChange={(e) => setMySearch(e.target.value)}
            placeholder="Filter builds..."
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
          <select
            value={mySortBy}
            onChange={(e) => setMySortBy(e.target.value as typeof mySortBy)}
            className={selectClass}
          >
            <option value="newest">Newest</option>
            <option value="views">Most Viewed</option>
            <option value="name">Name A-Z</option>
          </select>
          <span className="text-xs text-gray-500 ml-auto">
            {filteredMyBuilds.length} build{filteredMyBuilds.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Results */}
      {error ? (
        <div className="bg-red-900/20 border border-red-700/50 rounded p-4 text-sm text-red-300">
          {error}
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-gray-400">
          <p>Loading builds...</p>
        </div>
      ) : tab === 'mine' ? (
        /* My Builds tab */
        !user ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">Sign in to see your builds</p>
            <p className="text-gray-500 text-sm">Log in with Discord from Settings to manage your shared builds.</p>
          </div>
        ) : filteredMyBuilds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">
              {mySearch ? 'No builds match your search' : 'No builds linked to your account yet'}
            </p>
            <p className="text-gray-500 text-sm">
              {mySearch
                ? 'Try a different search term.'
                : 'Share a build while logged in, or link existing builds from Settings.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredMyBuilds.map((build) => (
              <BuildCard
                key={build.id}
                build={build}
                showDelete
                onDeleted={handleBuildDeleted}
                onAuthorClick={handleAuthorClick}
              />
            ))}
          </div>
        )
      ) : tab === 'favorites' ? (
        /* Favorites tab */
        favoriteBuilds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">No favorites yet</p>
            <p className="text-gray-500 text-sm">
              Click the star on any build card to save it here.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-3">
              {favoriteBuilds.length} favorite{favoriteBuilds.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {favoriteBuilds.map((build) => (
                <BuildCard key={build.id} build={build} onAuthorClick={handleAuthorClick} />
              ))}
            </div>
          </>
        )
      ) : result.builds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">No builds found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          {/* Result count */}
          <p className="text-xs text-gray-500 mb-3">
            {result.total} build{result.total !== 1 ? 's' : ''} found
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {result.builds.map((build) => (
              <BuildCard key={build.id} build={build} onAuthorClick={handleAuthorClick} />
            ))}
          </div>

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) - 1 })}
                disabled={result.page <= 1}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {result.page} of {result.totalPages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
                disabled={result.page >= result.totalPages}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
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
