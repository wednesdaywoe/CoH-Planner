/**
 * Auth service — wraps Supabase Auth for Discord OAuth
 */

import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type AuthProvider = 'discord';

const redirectTo = () => window.location.origin + (import.meta.env.BASE_URL || '/');

/** Sign in with an OAuth provider (full-page redirect) */
export async function signInWithProvider(provider: AuthProvider): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectTo() },
  });

  if (error) throw error;
}

/** Convenience alias */
export const signInWithDiscord = () => signInWithProvider('discord');

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
 */
export function onAuthStateChange(
  callback: (user: User | null) => void,
): () => void {
  if (!supabase) return () => {};

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null);
    },
  );

  return () => subscription.unsubscribe();
}
