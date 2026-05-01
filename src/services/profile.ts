/**
 * Profile service — wraps the `profiles` table reads and the `update-profile`
 * edge function for handle/display_name/bio writes.
 */

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';

export interface Profile {
  user_id: string;
  handle: string | null;
  display_name: string;
  discord_id: string | null;
  discord_username: string | null;
  avatar_url: string | null;
  bio: string;
  handle_changed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  handle?: string;
  display_name?: string;
  bio?: string;
}

export const HANDLE_REGEX = /^[a-z0-9][a-z0-9_-]{2,29}$/;
export const HANDLE_COOLDOWN_DAYS = 30;
export const DISPLAY_NAME_MAX = 30;
export const BIO_MAX = 280;

/** Read a profile by user_id (RLS allows public reads). */
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) throw new Error('Sharing is not configured');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Profile | null;
}

/**
 * Update the authenticated user's profile via the `update-profile` edge function.
 * Server enforces handle format, reserved-handle list, 30-day cooldown,
 * uniqueness, and field length limits. JWT-derived fields (discord_username,
 * avatar_url) are refreshed on every call.
 */
export async function updateProfile(updates: ProfileUpdate): Promise<Profile> {
  if (!supabase) throw new Error('Sharing is not configured');

  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Must be logged in to update your profile');

  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw new Error('Session expired — please log in again');

  const { data, error } = await supabase.functions.invoke('update-profile', {
    body: updates,
  });

  if (error) {
    let msg = 'Failed to update profile';
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
  if (!data?.profile) throw new Error('Update returned no profile');

  return data.profile as Profile;
}

/** Cooldown helper: returns days remaining (0 if no cooldown active). */
export function handleCooldownDaysLeft(handleChangedAt: string | null | undefined): number {
  if (!handleChangedAt) return 0;
  const lastChanged = new Date(handleChangedAt).getTime();
  const expiresAt = lastChanged + HANDLE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  const msLeft = expiresAt - Date.now();
  if (msLeft <= 0) return 0;
  return Math.ceil(msLeft / (24 * 60 * 60 * 1000));
}
