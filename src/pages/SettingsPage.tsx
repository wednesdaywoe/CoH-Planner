/**
 * SettingsPage — Account management and app settings
 */

import { useState } from 'react';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { getOwnedBuildIds, claimBuilds } from '@/services/sharedBuilds';

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const [claimLoading, setClaimLoading] = useState(false);
  const [claimResult, setClaimResult] = useState<{ claimed: number; failed: number } | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const tokenOwnedIds = getOwnedBuildIds();

  const handleClaim = async () => {
    setClaimLoading(true);
    setClaimError(null);
    setClaimResult(null);
    try {
      const result = await claimBuilds();
      setClaimResult({ claimed: result.claimed.length, failed: result.failed.length });
    } catch (e) {
      setClaimError(e instanceof Error ? e.message : 'Failed to claim builds');
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-12">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Account section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Account</h2>

        {!supabase ? (
          <p className="text-sm text-gray-500">Sharing features are not configured.</p>
        ) : !user ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Sign in to manage your shared builds from any device or browser.
              This is optional — you can still share builds anonymously using owner tokens.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => login('discord')}>
                Discord
              </Button>
              <Button variant="primary" onClick={() => login('google')}>
                Google
              </Button>
              <Button variant="primary" onClick={() => login('twitch')}>
                Twitch
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User info */}
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="text-white font-medium">
                  {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  Signed in via {user.app_metadata?.provider === 'google' ? 'Google' : user.app_metadata?.provider === 'twitch' ? 'Twitch' : 'Discord'}
                </p>
              </div>
            </div>

            <Button variant="secondary" size="sm" onClick={() => logout()}>
              Log Out
            </Button>
          </div>
        )}
      </div>

      {/* Claim builds section (only when logged in and has local tokens) */}
      {user && tokenOwnedIds.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Link Builds to Account</h2>
          <p className="text-sm text-gray-400 mb-4">
            You have {tokenOwnedIds.length} build{tokenOwnedIds.length !== 1 ? 's' : ''} saved
            in this browser via owner tokens. Link them to your Discord account so you can manage
            them from any device.
          </p>

          <Button
            variant="primary"
            size="sm"
            onClick={handleClaim}
            isLoading={claimLoading}
          >
            Link All Builds to Account
          </Button>

          {claimResult && (
            <p className="text-sm text-green-400 mt-3">
              {claimResult.claimed} build{claimResult.claimed !== 1 ? 's' : ''} linked to your account.
              {claimResult.failed > 0 && (
                <span className="text-yellow-400">
                  {' '}{claimResult.failed} failed (token may be invalid).
                </span>
              )}
            </p>
          )}
          {claimError && (
            <p className="text-sm text-red-400 mt-3">{claimError}</p>
          )}
        </div>
      )}
    </div>
  );
}
