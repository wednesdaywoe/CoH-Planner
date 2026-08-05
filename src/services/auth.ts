/**
 * Auth service — wraps Supabase Auth for OAuth providers
 */

import { supabase } from '@/lib/supabase';
import type { User, Session, Provider } from '@supabase/supabase-js';

export type AuthProvider = 'discord' | 'custom:simplelogin';

const redirectTo = () => window.location.origin + (import.meta.env.BASE_URL || '/');

/** Sign in with an OAuth provider (full-page redirect) */
export async function signInWithProvider(provider: AuthProvider): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');

  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: { redirectTo: redirectTo() },
  });

  if (error) throw error;
}

/** Convenience aliases */
export const signInWithDiscord = () => signInWithProvider('discord');
export const signInWithSimpleLogin = () => signInWithProvider('custom:simplelogin');

/** Sign out the current user */
export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/** Get the current session (if any) */
export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/** Get the current user (if any) */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 *
 * A same-user TOKEN_REFRESHED is swallowed. The JWT lives in Supabase's own
 * storage, never in our store, so a rotation has nothing for subscribers to
 * consume — but it does hand back a brand-new `User` object, and that fresh
 * identity alone is enough to retrigger every effect keyed on `user`. That's
 * how a single visibility toggle used to remount the whole My Builds grid:
 * updateBuildVisibility refreshes the session, the refresh re-set the store,
 * BuildsPage's effect saw a "new" user and refetched mid-write. USER_UPDATED
 * (the event that actually carries profile changes) still propagates.
 */
export function onAuthStateChange(
  callback: (user: User | null) => void,
): () => void {
  if (!supabase) return () => {};

  let lastUserId: string | null | undefined;
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      const user = session?.user ?? null;
      if (event === 'TOKEN_REFRESHED' && user?.id === lastUserId) return;
      lastUserId = user?.id ?? null;
      callback(user);
    },
  );

  return () => subscription.unsubscribe();
}
