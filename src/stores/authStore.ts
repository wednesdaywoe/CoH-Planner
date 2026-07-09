/**
 * Auth Store — manages Discord OAuth state
 *
 * No persistence needed — Supabase persists the session in its own localStorage key.
 */

import { create } from 'zustand';
import { signInWithProvider, signOut, getSession, onAuthStateChange } from '@/services/auth';
import { clearQuickShareCache, clearFavoritesCache, syncFavorites } from '@/services/sharedBuilds';
import type { AuthProvider } from '@/services/auth';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null;
  /** True during initial session check */
  loading: boolean;
  /** True once the first auth check has completed */
  initialized: boolean;
}

interface AuthActions {
  /** Initialize auth — call once on app mount. Returns unsubscribe function. */
  initialize: () => () => void;
  /** Sign in with an OAuth provider (defaults to Discord) */
  login: (provider?: AuthProvider) => Promise<void>;
  /** Sign out */
  logout: () => Promise<void>;
}

// Tracks which user we've already reconciled favourites for, so a token refresh
// (which re-fires onAuthStateChange with the same user) doesn't re-sync on every
// tick — we only sync when the signed-in user actually changes.
let lastSyncedUserId: string | null = null;

/** Reconcile account favourites into the local cache once per newly-seen user. */
function maybeSyncFavorites(user: User | null): void {
  if (user && user.id !== lastSyncedUserId) {
    lastSyncedUserId = user.id;
    void syncFavorites();
  }
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: () => {
    // Check existing session
    getSession().then((session) => {
      const user = session?.user ?? null;
      set({ user, loading: false, initialized: true });
      maybeSyncFavorites(user);
    }).catch(() => {
      set({ user: null, loading: false, initialized: true });
    });

    // Listen for auth changes (login, logout, token refresh)
    const unsubscribe = onAuthStateChange((user) => {
      set({ user, loading: false, initialized: true });
      maybeSyncFavorites(user);
    });

    return unsubscribe;
  },

  login: async (provider: AuthProvider = 'discord') => {
    await signInWithProvider(provider);
  },

  logout: async () => {
    await signOut();
    // Drop the unlisted "Copy Short Link" cache so a different user on this
    // browser doesn't try to update the previous user's build.
    clearQuickShareCache();
    // Drop the local favourites cache too — they're saved on the account and
    // pulled back down on the next login, so clearing here prevents one user's
    // favourites bleeding into (or being pushed up by) the next user to sign in
    // on this browser.
    clearFavoritesCache();
    lastSyncedUserId = null;
    set({ user: null });
  },
}));
