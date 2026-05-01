/**
 * ProfileSettingsPage — sub-page of /settings.
 *
 * Lets a logged-in user view and edit their public profile (handle,
 * display name, bio). Server enforces format, reserved-handle list,
 * 30-day handle cooldown, and uniqueness; this page mirrors those rules
 * client-side for inline feedback. Avatar and Discord username are
 * read-only; both are refreshed from the JWT each save.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  getProfile,
  updateProfile,
  handleCooldownDaysLeft,
  HANDLE_REGEX,
  DISPLAY_NAME_MAX,
  BIO_MAX,
  type Profile,
  type ProfileUpdate,
} from '@/services/profile';

export function ProfileSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Auth gate — redirect anonymous visitors to the general settings page
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/settings' });
    }
  }, [authLoading, user, navigate]);

  // Load profile once we have a user
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setProfileLoading(true);
    getProfile(user.id)
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          setLoadError('Profile not found. Try logging out and back in.');
          return;
        }
        setProfile(p);
        setHandle(p.handle ?? '');
        setDisplayName(p.display_name);
        setBio(p.bio);
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load profile');
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const cooldownDaysLeft = useMemo(
    () => handleCooldownDaysLeft(profile?.handle_changed_at),
    [profile?.handle_changed_at],
  );

  // Cooldown only locks the handle field after a *change* — first claims are free.
  const handleLocked = cooldownDaysLeft > 0 && !!profile?.handle;

  const trimmedHandle = handle.trim().toLowerCase();
  const trimmedDisplayName = displayName.trim();
  const trimmedBio = bio.trim();

  const handleChanged = trimmedHandle !== (profile?.handle ?? '');
  const displayNameChanged = trimmedDisplayName !== (profile?.display_name ?? '');
  const bioChanged = trimmedBio !== (profile?.bio ?? '');
  const dirty = handleChanged || displayNameChanged || bioChanged;

  // Inline format check for handle (only when set + changed)
  const handleFormatError =
    handleChanged && trimmedHandle.length > 0 && !HANDLE_REGEX.test(trimmedHandle)
      ? '3–30 chars; lowercase letters, digits, _ or -; no leading dash or underscore.'
      : null;

  const canSave =
    dirty &&
    !saving &&
    !handleFormatError &&
    trimmedDisplayName.length <= DISPLAY_NAME_MAX &&
    trimmedBio.length <= BIO_MAX;

  const handleSave = async () => {
    if (!canSave || !profile) return;
    setSaving(true);
    setSaveError(null);
    setSavedAt(null);

    const updates: ProfileUpdate = {};
    if (handleChanged && trimmedHandle.length > 0) updates.handle = trimmedHandle;
    if (displayNameChanged) updates.display_name = trimmedDisplayName;
    if (bioChanged) updates.bio = trimmedBio;

    try {
      const updated = await updateProfile(updates);
      setProfile(updated);
      setHandle(updated.handle ?? '');
      setDisplayName(updated.display_name);
      setBio(updated.bio);
      setSavedAt(Date.now());
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
        <p className="text-sm text-red-400">{loadError}</p>
      </div>
    );
  }

  if (!profile) return null;

  const isDiscordVerified = !!profile.discord_username;

  return (
    <div className="space-y-6">
      {/* Identity (read-only) */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Identity</h2>

        <div className="flex items-center gap-3">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-700" />
          )}
          <div className="min-w-0">
            {isDiscordVerified ? (
              <p className="text-sm text-gray-300 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-indigo-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                </svg>
                <span className="truncate">{profile.discord_username}</span>
                <span className="text-xs text-gray-500">· Verified Discord</span>
              </p>
            ) : (
              <p className="text-sm text-gray-400">Signed in</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Avatar and Discord username are managed by your Discord account.
            </p>
          </div>
        </div>
      </div>

      {/* Public profile (editable) */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Public Profile</h2>

        <div className="space-y-4">
          {/* Handle */}
          <div>
            <Input
              label="Handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="your-handle"
              maxLength={30}
              disabled={handleLocked}
              error={handleFormatError ?? undefined}
              helperText={
                handleLocked
                  ? `You can change your handle again in ${cooldownDaysLeft} day${cooldownDaysLeft === 1 ? '' : 's'}.`
                  : profile.handle
                    ? 'Used in your profile URL: /author/@your-handle'
                    : 'Pick a handle to enable your public author page.'
              }
            />
          </div>

          {/* Display name */}
          <div>
            <Input
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={DISPLAY_NAME_MAX}
              helperText={`${trimmedDisplayName.length}/${DISPLAY_NAME_MAX} — shown on your shared builds.`}
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label htmlFor="profile-bio" className="text-sm font-medium text-gray-200">
              Bio
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              maxLength={BIO_MAX}
              rows={4}
              className="block w-full px-3 py-1.5 bg-gray-800 text-gray-200 border border-gray-600 rounded text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-y"
            />
            <span className="text-xs text-gray-400">
              {trimmedBio.length}/{BIO_MAX}
            </span>
          </div>
        </div>

        {/* Save row */}
        <div className="flex items-center gap-3 mt-5">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            disabled={!canSave}
          >
            Save changes
          </Button>
          {savedAt && !dirty && (
            <span className="text-sm text-green-400">Saved.</span>
          )}
          {saveError && <span className="text-sm text-red-400">{saveError}</span>}
        </div>
      </div>
    </div>
  );
}
