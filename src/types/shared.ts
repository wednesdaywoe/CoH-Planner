/**
 * Types for the shared builds feature (Supabase-backed public build repository)
 */

import type { BuildExport } from './build';

/**
 * 'private': owner only. 'unlisted': readable by anyone with the exact
 * share link, never listed in search/browse. 'public': readable by link AND
 * listed.
 */
export type BuildVisibility = 'private' | 'unlisted' | 'public';

/** A build that has been shared to the public repository */
export interface SharedBuild {
  id: string;
  name: string;
  description: string;
  archetype: string;
  archetype_name: string;
  primary_set: string;
  primary_name: string;
  secondary_set: string;
  secondary_name: string;
  level: number;
  author_name: string;
  server: string;
  tags: string[];
  build_json: BuildExport;
  created_at: string;
  updated_at: string;
  views: number;
  /** User ID from Discord OAuth (null for anonymous builds) */
  user_id?: string | null;
  visibility: BuildVisibility;
  /** Object path in the `build-previews` Storage bucket for this build's
   *  social share-preview image, or null/undefined if none has been
   *  rendered yet (e.g. builds shared before this feature shipped). */
  preview_image_path?: string | null;
  /** CURRENT_PREVIEW_TEMPLATE_VERSION the image at preview_image_path was
   *  rendered under, or null/undefined alongside a null preview_image_path
   *  (never rendered). A value older than the live constant means the image
   *  is stale, not missing. */
  preview_template_version?: number | null;
  /** Author profile fields (joined from `profiles` via shared_builds_with_author view).
   *  Null when user_id is null OR when the user hasn't claimed a handle/profile yet. */
  author_handle?: string | null;
  author_display_name?: string | null;
  author_avatar_url?: string | null;
}

/** Input for sharing a build */
export interface ShareBuildInput {
  name: string;
  description: string;
  author_name: string;
  server: string;
  tags: string[];
  build_json: BuildExport;
  /** If set, updates an existing build instead of creating a new one */
  existingId?: string;
  /** Visibility to set (default 'public'). Requires login to set 'private' or 'unlisted'. */
  visibility?: BuildVisibility;
}

/** Filters for searching shared builds */
export interface SearchFilters {
  archetype?: string;
  primarySet?: string;
  secondarySet?: string;
  query?: string;
  authorId?: string;
  authorName?: string;
  sortBy?: 'newest' | 'views';
  page?: number;
  pageSize?: number;
}

/** Paginated search result */
export interface SearchResult {
  builds: SharedBuild[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
