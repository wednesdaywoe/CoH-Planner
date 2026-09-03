/**
 * ForumExportModal — generate a forum-ready build summary in BBCode,
 * Markdown, or Plain Text. Mirrors Mids Reborn's Forum Post workflow:
 * pick a format, preview the output, copy it to the clipboard. The
 * shareable link is a *separate* copy action so the user can wrap it in
 * the forum's WYSIWYG link tag rather than have it embedded inline.
 */
import { useEffect, useMemo, useState } from 'react';
import { useBuildStore, useAuthStore, useUIStore } from '@/stores';
import type { BuildExport } from '@/types/build';
import { quickShareBuild } from '@/services/sharedBuilds';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import { generateForumExport, type ForumExportFormat } from '@/utils/forum-export';

interface ForumExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMATS: { id: ForumExportFormat; label: string; hint: string }[] = [
  { id: 'plain',    label: 'Plain Text', hint: 'Works on every forum; no styling.' },
  { id: 'bbcode',   label: 'BBCode',     hint: 'phpBB / vBulletin / classic forums.' },
  { id: 'markdown', label: 'Markdown',   hint: 'Reddit, Discord, modern forums.' },
];

type CopyState = 'idle' | 'copied' | 'error';
type ShortLinkState = 'idle' | 'loading' | 'copied' | 'error' | 'auth';

export function ForumExportModal({ isOpen, onClose }: ForumExportModalProps) {
  const build = useBuildStore((s) => s.build);
  const exportBuild = useBuildStore((s) => s.exportBuild);
  const user = useAuthStore((s) => s.user);
  const levelUpMode = useUIStore((s) => s.levelUpMode);

  const [format, setFormat] = useState<ForumExportFormat>('plain');
  const [includeIncarnates, setIncludeIncarnates] = useState(true);
  const [includeSetBonuses, setIncludeSetBonuses] = useState(true);

  const [textCopyState, setTextCopyState] = useState<CopyState>('idle');
  const [linkCopyState, setLinkCopyState] = useState<ShortLinkState>('idle');

  // Reset transient state whenever the modal reopens.
  useEffect(() => {
    if (isOpen) {
      setTextCopyState('idle');
      setLinkCopyState('idle');
    }
  }, [isOpen]);

  const output = useMemo(
    () => generateForumExport(build, format, levelUpMode, { includeIncarnates, includeSetBonuses }),
    [build, format, levelUpMode, includeIncarnates, includeSetBonuses],
  );

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setTextCopyState('copied');
      setTimeout(() => setTextCopyState('idle'), 1500);
    } catch (err) {
      console.error('Forum export copy failed:', err);
      setTextCopyState('error');
      setTimeout(() => setTextCopyState('idle'), 2000);
    }
  };

  const handleCopyShortLink = async () => {
    if (!user) {
      setLinkCopyState('auth');
      setTimeout(() => setLinkCopyState('idle'), 3000);
      return;
    }
    setLinkCopyState('loading');
    try {
      const exportData = JSON.parse(exportBuild()) as BuildExport;
      const { url } = await quickShareBuild(exportData);
      await navigator.clipboard.writeText(url);
      setLinkCopyState('copied');
      setTimeout(() => setLinkCopyState('idle'), 1500);
    } catch (err) {
      console.error('Forum export short link failed:', err);
      setLinkCopyState('error');
      setTimeout(() => setLinkCopyState('idle'), 2000);
    }
  };

  const textCopyLabel =
    textCopyState === 'copied' ? 'Copied!' :
    textCopyState === 'error'  ? 'Copy failed' :
    'Copy Build Text';

  const linkCopyLabel =
    linkCopyState === 'loading' ? 'Creating link…' :
    linkCopyState === 'copied'  ? 'Link copied!' :
    linkCopyState === 'error'   ? 'Link failed' :
    linkCopyState === 'auth'    ? 'Sign in to create' :
    'Copy Short Link';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forum Post Export" size="lg">
      <ModalBody>
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Generate a forum-ready summary of this build. Paste the text
            into a thread, then use the forum's link tool to wrap the
            short link wherever you'd like it.
          </p>

          {/* Format selector */}
          <div>
            <div className="text-xs font-semibold text-gray-300 uppercase mb-1.5">Format</div>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  title={f.hint}
                  className={`px-3 py-1.5 rounded text-sm border transition-colors ${
                    format === f.id
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary-hover)] text-on-primary'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {FORMATS.find((f) => f.id === format)?.hint}
            </div>
          </div>

          {/* Sections to include */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSetBonuses}
                onChange={(e) => setIncludeSetBonuses(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-[var(--color-primary)] focus:ring-[var(--color-ring)] focus:ring-offset-gray-900"
              />
              Include set bonuses
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeIncarnates}
                onChange={(e) => setIncludeIncarnates(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-[var(--color-primary)] focus:ring-[var(--color-ring)] focus:ring-offset-gray-900"
              />
              Include incarnates
            </label>
          </div>

          {!levelUpMode && (
            <p className="text-[11px] text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded px-2 py-1.5">
              This build wasn't planned in a specific leveling order, so the slot levels below are
              a computed placement, not your actual leveling history.
            </p>
          )}

          {/* Preview */}
          <div>
            <div className="text-xs font-semibold text-gray-300 uppercase mb-1.5">Preview</div>
            <textarea
              value={output}
              readOnly
              spellCheck={false}
              className="w-full h-72 bg-gray-900 border border-gray-700 rounded p-2 text-xs font-mono text-gray-200 resize-y focus:outline-none focus:ring-1 focus:ring-[var(--color-ring)]/50 whitespace-pre"
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center justify-between w-full gap-2 flex-wrap">
          <div className="text-[11px] text-gray-500 max-w-[40ch]">
            Short links require sign-in via Discord (one-time setup).
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyShortLink}
              disabled={linkCopyState === 'loading'}
            >
              {linkCopyLabel}
            </Button>
            <Button variant="primary" size="sm" onClick={handleCopyText}>
              {textCopyLabel}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}
