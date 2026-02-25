/**
 * BuildsPage — public shared builds browser with search and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BuildCard } from '@/components/shared/BuildCard';
import { BuildFilters } from '@/components/shared/BuildFilters';
import { searchSharedBuilds, isShareEnabled } from '@/services/sharedBuilds';
import type { SearchFilters, SearchResult } from '@/types/shared';

const EMPTY_RESULT: SearchResult = {
  builds: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
};

export function BuildsPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'newest',
    page: 1,
    pageSize: 20,
  });
  const [result, setResult] = useState<SearchResult>(EMPTY_RESULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchBuilds(filters);
  }, [filters, fetchBuilds]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
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

      {/* Filters */}
      <div className="mb-6">
        <BuildFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* Results */}
      {error ? (
        <div className="bg-red-900/20 border border-red-700/50 rounded p-4 text-sm text-red-300">
          {error}
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-gray-400">
          <p>Loading builds...</p>
        </div>
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
              <BuildCard key={build.id} build={build} />
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
