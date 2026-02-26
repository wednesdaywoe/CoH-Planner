/**
 * Service layer for shared builds — handles all Supabase interactions
 */

import { supabase } from '@/lib/supabase';
import type { SharedBuild, ShareBuildInput, SearchFilters, SearchResult } from '@/types/shared';

const DEFAULT_PAGE_SIZE = 20;

/** Check if Supabase is configured */
export function isShareEnabled(): boolean {
  return supabase !== null;
}

/** Share a build to the public repository */
export async function shareBuild(input: ShareBuildInput): Promise<{ id: string; url: string }> {
  if (!supabase) throw new Error('Sharing is not configured');

  const buildData = input.build_json;
  const archetype = buildData.build.archetype;
  const primary = buildData.build.primary;
  const secondary = buildData.build.secondary;

  // Call the edge function for validation + rate limiting + insert
  const { data, error } = await supabase.functions.invoke('share-build', {
    body: {
      name: input.name || buildData.build.name || 'Untitled Build',
      description: input.description,
      archetype: archetype.id || '',
      archetype_name: archetype.name || '',
      primary_set: primary.id || '',
      primary_name: primary.name || '',
      secondary_set: secondary.id || '',
      secondary_name: secondary.name || '',
      level: buildData.build.level,
      author_name: input.author_name,
      server: input.server,
      tags: input.tags,
      build_json: buildData,
    },
  });

  if (error) {
    // Supabase client wraps non-2xx as a generic error — try to extract the real message
    const msg = data?.error || error.message || 'Failed to share build';
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);

  return {
    id: data.id,
    url: `${window.location.origin}/builds/${data.id}`,
  };
}

/** Fetch a single shared build by ID */
export async function getSharedBuild(id: string): Promise<SharedBuild | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('shared_builds')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as SharedBuild;
}

/** Increment view count (fire-and-forget) */
export function incrementViews(id: string): void {
  if (!supabase) return;
  supabase.rpc('increment_views', { build_id: id }).then(() => {});
}

/** Search shared builds with filters and pagination */
export async function searchSharedBuilds(filters: SearchFilters = {}): Promise<SearchResult> {
  if (!supabase) {
    return { builds: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 0 };
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('shared_builds')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters.archetype) {
    query = query.eq('archetype', filters.archetype);
  }
  if (filters.primarySet) {
    query = query.eq('primary_set', filters.primarySet);
  }
  if (filters.secondarySet) {
    query = query.eq('secondary_set', filters.secondarySet);
  }
  if (filters.query?.trim()) {
    query = query.textSearch('name', filters.query.trim(), { type: 'websearch' });
  }

  // Apply sorting
  if (filters.sortBy === 'views') {
    query = query.order('views', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  const total = count ?? 0;

  return {
    builds: (data ?? []) as SharedBuild[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
