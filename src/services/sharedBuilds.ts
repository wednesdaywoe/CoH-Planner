/**
 * Service layer for shared builds — handles all Supabase interactions
 */

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { SharedBuild, ShareBuildInput, SearchFilters, SearchResult } from '@/types/shared';

const DEFAULT_PAGE_SIZE = 20;
const OWNER_TOKENS_KEY = 'coh-planner-owner-tokens';
const FAVORITES_KEY = 'coh-planner-favorites';

// ---- Favorites management (localStorage) ----

function getFavoriteIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavoriteIds(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function isFavorite(buildId: string): boolean {
  return getFavoriteIds().includes(buildId);
}

export function toggleFavorite(buildId: string): boolean {
  const ids = getFavoriteIds();
  const index = ids.indexOf(buildId);
  if (index >= 0) {
    ids.splice(index, 1);
    saveFavoriteIds(ids);
    return false;
  } else {
    ids.push(buildId);
    saveFavoriteIds(ids);
    return true;
  }
}

/** Fetch all favorited builds from Supabase */
export async function getFavoriteBuilds(): Promise<SharedBuild[]> {
  if (!supabase) return [];
  const ids = getFavoriteIds();
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('shared_builds_with_author')
    .select('*')
    .in('id', ids)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as SharedBuild[];
}

// ---- Owner token management (localStorage) ----

function getOwnerTokens(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(OWNER_TOKENS_KEY) || '{}');
  } catch {
    return {};
  }
}

function setOwnerToken(buildId: string, token: string): void {
  const tokens = getOwnerTokens();
  tokens[buildId] = token;
  localStorage.setItem(OWNER_TOKENS_KEY, JSON.stringify(tokens));
}

function removeOwnerToken(buildId: string): void {
  const tokens = getOwnerTokens();
  delete tokens[buildId];
  localStorage.setItem(OWNER_TOKENS_KEY, JSON.stringify(tokens));
}

/** Get the owner token for a build (null if not owned) */
export function getOwnerToken(buildId: string): string | null {
  return getOwnerTokens()[buildId] ?? null;
}

/** Check if the current browser owns a given build (via token or Discord account) */
export function isOwnedBuild(buildId: string, build?: SharedBuild | null): boolean {
  if (getOwnerToken(buildId) !== null) return true;
  const user = useAuthStore.getState().user;
  if (user && build?.user_id === user.id) return true;
  return false;
}

/** Get all owned build IDs (for the update-existing UI) */
export function getOwnedBuildIds(): string[] {
  return Object.keys(getOwnerTokens());
}

/** Reclaim ownership of a build by manually entering an owner token */
export function reclaimBuild(buildId: string, token: string): void {
  setOwnerToken(buildId, token);
}

// ---- API functions ----

/** Check if Supabase is configured */
export function isShareEnabled(): boolean {
  return supabase !== null;
}

/** Share a build to the public repository (create or update) */
export async function shareBuild(input: ShareBuildInput): Promise<{ id: string; url: string; updated?: boolean }> {
  if (!supabase) throw new Error('Sharing is not configured');

  const buildData = input.build_json;
  const archetype = buildData.build.archetype;
  const primary = buildData.build.primary;
  const secondary = buildData.build.secondary;

  const payload: Record<string, unknown> = {
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
    is_public: input.is_public ?? true,
  };

  // If updating an existing build, attach credentials (token and/or JWT via auth header)
  if (input.existingId) {
    const ownerToken = getOwnerToken(input.existingId);
    const user = useAuthStore.getState().user;
    if (!ownerToken && !user) throw new Error('No owner token or login session for this build');
    payload.existing_id = input.existingId;
    if (ownerToken) payload.owner_token = ownerToken;
  }

  // Refresh auth session to avoid 401 from expired JWT
  const user = useAuthStore.getState().user;
  if (user) {
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw new Error('Session expired — please log in again');
    }
  }

  const { data, error } = await supabase.functions.invoke('share-build', {
    body: payload,
  });

  if (error) {
    let msg = 'Failed to share build';
    try {
      if (error.context && typeof error.context.json === 'function') {
        const body = await error.context.json();
        msg = body?.error || msg;
      } else {
        msg = error.message || msg;
      }
    } catch {
      msg = error.message || msg;
    }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);

  // Store owner token on new creates
  if (data.owner_token) {
    setOwnerToken(data.id, data.owner_token);
  }

  return {
    id: data.id,
    url: `${window.location.origin}/builds/${data.id}`,
    updated: data.updated ?? false,
  };
}

/** Delete a shared build (requires ownership via token or Discord auth) */
export async function deleteBuild(id: string): Promise<void> {
  if (!supabase) throw new Error('Sharing is not configured');

  const ownerToken = getOwnerToken(id);
  const user = useAuthStore.getState().user;
  if (!ownerToken && !user) throw new Error('No owner token or login session for this build');

  // Refresh auth session to avoid 401 from expired JWT
  if (user) {
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw new Error('Session expired — please log in again');
    }
  }

  const { data, error } = await supabase.functions.invoke('delete-build', {
    body: { id, owner_token: ownerToken || undefined },
  });

  if (error) {
    let msg = 'Failed to delete build';
    try {
      if (error.context && typeof error.context.json === 'function') {
        const body = await error.context.json();
        msg = body?.error || msg;
      } else {
        msg = error.message || msg;
      }
    } catch {
      msg = error.message || msg;
    }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);

  removeOwnerToken(id);
}

/** Fetch a single shared build by ID (joined with author profile if any) */
export async function getSharedBuild(id: string): Promise<SharedBuild | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('shared_builds_with_author')
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
    .from('shared_builds_with_author')
    .select('*', { count: 'exact' })
    .eq('is_public', true);

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
  if (filters.authorId) {
    query = query.eq('user_id', filters.authorId);
  }
  if (filters.authorName) {
    query = query.eq('author_name', filters.authorName);
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

/** Fetch all builds owned by the authenticated user */
export async function getMyBuilds(): Promise<SharedBuild[]> {
  if (!supabase) return [];

  const user = useAuthStore.getState().user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('shared_builds_with_author')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    // Gracefully handle missing user_id column (migration not yet applied)
    if (error.message.includes('user_id') && error.message.includes('does not exist')) {
      return [];
    }
    throw new Error(error.message);
  }
  return (data ?? []) as SharedBuild[];
}

/** Toggle the public/private visibility of an owned build (requires Discord login) */
export async function updateBuildVisibility(id: string, isPublic: boolean): Promise<void> {
  if (!supabase) throw new Error('Sharing is not configured');

  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Must be logged in to change build visibility');

  // Refresh auth session to avoid 401 from expired JWT
  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) {
    throw new Error('Session expired — please log in again');
  }

  const { data, error } = await supabase.functions.invoke('update-build-visibility', {
    body: { id, is_public: isPublic },
  });

  if (error) {
    let msg = 'Failed to update visibility';
    try {
      if (error.context && typeof error.context.json === 'function') {
        const body = await error.context.json();
        msg = body?.error || msg;
      } else {
        msg = error.message || msg;
      }
    } catch {
      msg = error.message || msg;
    }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
}

/** Claim existing token-owned builds by linking them to the authenticated user account */
export async function claimBuilds(): Promise<{ claimed: string[]; failed: string[] }> {
  if (!supabase) throw new Error('Sharing is not configured');

  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Must be logged in to claim builds');

  const tokens = getOwnerTokens();
  if (Object.keys(tokens).length === 0) {
    return { claimed: [], failed: [] };
  }

  // Refresh auth session to avoid 401 from expired JWT
  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) {
    throw new Error('Session expired — please log in again');
  }

  const { data, error } = await supabase.functions.invoke('claim-builds', {
    body: { owner_tokens: tokens },
  });

  if (error) {
    let msg = 'Failed to claim builds';
    try {
      if (error.context && typeof error.context.json === 'function') {
        const body = await error.context.json();
        msg = body?.error || msg;
      } else {
        msg = error.message || msg;
      }
    } catch {
      msg = error.message || msg;
    }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);

  return { claimed: data.claimed ?? [], failed: data.failed ?? [] };
}
