/**
 * ExportImportModal component - handles build export, import, and Mids Reborn import
 */

import { useState, useRef } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal';
import { Button } from '../ui/Button';
import { useBuildStore } from '@/stores/buildStore';
import { importMidsBuild } from '@/utils/mids-import';
import type { MidsImportResult } from '@/utils/mids-import';
import { shareBuild, isShareEnabled } from '@/services/sharedBuilds';
import type { BuildExport } from '@/types/build';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'export' | 'import' | 'mids' | 'share';

export function ExportImportModal({ isOpen, onClose }: ExportImportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [buildAlias, setBuildAlias] = useState('');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mids import state
  const [midsText, setMidsText] = useState('');
  const [midsResult, setMidsResult] = useState<MidsImportResult | null>(null);
  const [midsError, setMidsError] = useState<string | null>(null);
  const [showWarnings, setShowWarnings] = useState(false);
  const midsFileInputRef = useRef<HTMLInputElement>(null);

  // Share state
  const [shareDescription, setShareDescription] = useState('');
  const [shareAuthor, setShareAuthor] = useState('');
  const [shareServer, setShareServer] = useState('');
  const [shareTags, setShareTags] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const { exportBuild, importBuild, importMidsBuild: applyMidsBuild, build } = useBuildStore();

  const handleExport = () => {
    const exportData = JSON.parse(exportBuild());

    // Add alias to metadata if provided
    if (buildAlias.trim()) {
      exportData.meta = {
        ...exportData.meta,
        buildAlias: buildAlias.trim(),
      };
    }

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Create filename from build name or alias
    const filename = (buildAlias.trim() || build.name || 'build')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();

    link.href = url;
    link.download = `${filename}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Reset and close
    setBuildAlias('');
    onClose();
  };

  const handleImportFromText = () => {
    setImportError(null);
    setImportSuccess(false);

    if (!importText.trim()) {
      setImportError('Please paste build data to import');
      return;
    }

    try {
      const success = importBuild(importText);
      if (success) {
        setImportSuccess(true);
        setImportText('');
        setTimeout(() => {
          onClose();
          setImportSuccess(false);
        }, 1500);
      } else {
        setImportError('Failed to import build. Please check the format.');
      }
    } catch (e) {
      setImportError('Invalid build data. Please check the format.');
    }
  };

  const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const success = importBuild(content);
        if (success) {
          setImportSuccess(true);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setTimeout(() => {
            onClose();
            setImportSuccess(false);
          }, 1500);
        } else {
          setImportError('Failed to import build. Please check the file format.');
        }
      } catch (e) {
        setImportError('Invalid build file. Please check the format.');
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read file');
    };
    reader.readAsText(file);
  };

  // ============================================
  // MIDS IMPORT HANDLERS
  // ============================================

  const parseMidsContent = (content: string) => {
    setMidsError(null);
    setMidsResult(null);
    setShowWarnings(false);

    if (!content.trim()) {
      setMidsError('No data to import');
      return;
    }

    try {
      const result = importMidsBuild(content);
      if (result.success) {
        setMidsResult(result);
      } else {
        const msg = result.warnings.length > 0
          ? result.warnings[0].message
          : 'Failed to parse .mbd file';
        setMidsError(msg);
      }
    } catch (e) {
      setMidsError('Failed to parse .mbd file. Make sure it is valid Mids Reborn JSON.');
    }
  };

  const handleMidsParseFromText = () => {
    parseMidsContent(midsText);
  };

  const handleMidsFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMidsText(content);
      parseMidsContent(content);
    };
    reader.onerror = () => {
      setMidsError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleMidsApply = () => {
    if (!midsResult?.build) return;
    applyMidsBuild(midsResult.build);
    handleClose();
  };

  const handleShare = async () => {
    setShareError(null);
    setShareLoading(true);
    setShareUrl(null);

    try {
      const exportData = JSON.parse(exportBuild()) as BuildExport;
      const tags = shareTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await shareBuild({
        name: build.name || 'Untitled Build',
        description: shareDescription,
        author_name: shareAuthor,
        server: shareServer,
        tags,
        build_json: exportData,
      });

      setShareUrl(result.url);
    } catch (e) {
      setShareError(e instanceof Error ? e.message : 'Failed to share build');
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // Fallback: select the text in the input
    }
  };

  const handleClose = () => {
    setBuildAlias('');
    setImportText('');
    setImportError(null);
    setImportSuccess(false);
    setMidsText('');
    setMidsResult(null);
    setMidsError(null);
    setShowWarnings(false);
    setShareDescription('');
    setShareAuthor('');
    setShareServer('');
    setShareTags('');
    setShareError(null);
    setShareUrl(null);
    setShareLoading(false);
    setShareCopied(false);
    setActiveTab('export');
    if (midsFileInputRef.current) midsFileInputRef.current.value = '';
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" showCloseButton={true}>
      <ModalHeader>
        <div className="flex gap-4 border-b border-gray-700 -mb-4">
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'export'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('export')}
          >
            Export
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'import'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('import')}
          >
            Import
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'mids'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('mids')}
          >
            Mids Import
          </button>
          {isShareEnabled() && (
            <button
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'share'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('share')}
            >
              Share
            </button>
          )}
        </div>
      </ModalHeader>

      <ModalBody>
        {activeTab === 'export' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Build Name/Alias (Optional)
              </label>
              <input
                type="text"
                value={buildAlias}
                onChange={(e) => setBuildAlias(e.target.value)}
                placeholder="e.g., Fire/Kin Tank - Farm Build"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                Give your build a memorable name to identify it later
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-600 rounded p-4 space-y-2">
              <h3 className="font-semibold text-gray-300">Current Build Info:</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <p><span className="text-gray-500">Name:</span> {build.name || 'Unnamed Build'}</p>
                <p><span className="text-gray-500">Archetype:</span> {build.archetype.name || 'None'}</p>
                <p><span className="text-gray-500">Level:</span> {build.level}</p>
                {build.primary.name && (
                  <p><span className="text-gray-500">Primary:</span> {build.primary.name}</p>
                )}
                {build.secondary.name && (
                  <p><span className="text-gray-500">Secondary:</span> {build.secondary.name}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/50 rounded p-3 text-sm text-blue-300">
              <p className="font-semibold mb-1">Export Info:</p>
              <p>Your build will be saved as a JSON file that you can share or backup.</p>
            </div>
          </div>
        ) : activeTab === 'import' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Import from File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFromFile}
                className="w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                  file:cursor-pointer cursor-pointer"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">OR</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste Build Data
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste exported build JSON here..."
                className="w-full h-48 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            {importError && (
              <div className="bg-red-900/20 border border-red-700/50 rounded p-3 text-sm text-red-300">
                {importError}
              </div>
            )}

            {importSuccess && (
              <div className="bg-green-900/20 border border-green-700/50 rounded p-3 text-sm text-green-300">
                Build imported successfully!
              </div>
            )}

            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 text-sm text-yellow-300">
              <p className="font-semibold mb-1">Warning:</p>
              <p>Importing will replace your current build. Make sure to export your current build first if you want to keep it.</p>
            </div>
          </div>
        ) : activeTab === 'mids' ? (
          /* Mids Import Tab */
          <div className="space-y-4">
            <div className="bg-amber-900/20 border border-amber-700/50 rounded p-3 text-sm text-amber-300">
              <p>Import a build from <span className="font-semibold">Mids Reborn</span> (.mbd file). Upload the file or paste its contents below.</p>
            </div>

            {/* File upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload .mbd File
              </label>
              <input
                ref={midsFileInputRef}
                type="file"
                accept=".mbd,.json"
                onChange={handleMidsFileUpload}
                className="w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-amber-600 file:text-white
                  hover:file:bg-amber-700
                  file:cursor-pointer cursor-pointer"
              />
            </div>

            {/* OR divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">OR</span>
              </div>
            </div>

            {/* Paste area */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste .mbd Contents
              </label>
              <textarea
                value={midsText}
                onChange={(e) => { setMidsText(e.target.value); setMidsResult(null); setMidsError(null); }}
                placeholder="Paste .mbd JSON here..."
                className="w-full h-32 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              />
            </div>

            {/* Error */}
            {midsError && (
              <div className="bg-red-900/20 border border-red-700/50 rounded p-3 text-sm text-red-300">
                {midsError}
              </div>
            )}

            {/* Results */}
            {midsResult && midsResult.success && (
              <div className="space-y-3">
                {/* Summary */}
                <div className="bg-green-900/20 border border-green-700/50 rounded p-3 text-sm text-green-300">
                  <p className="font-semibold mb-2">Parse Successful</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span>Archetype:</span>
                    <span className="text-white">{midsResult.build?.archetype.name}</span>
                    <span>Primary:</span>
                    <span className="text-white">{midsResult.build?.primary.name || 'None'}</span>
                    <span>Secondary:</span>
                    <span className="text-white">{midsResult.build?.secondary.name || 'None'}</span>
                    <span>Level:</span>
                    <span className="text-white">{midsResult.build?.level}</span>
                    <span>Powers:</span>
                    <span className="text-white">
                      {midsResult.summary.powersImported} imported
                      {midsResult.summary.powersFailed > 0 && (
                        <span className="text-red-400"> / {midsResult.summary.powersFailed} failed</span>
                      )}
                    </span>
                    <span>Enhancements:</span>
                    <span className="text-white">
                      {midsResult.summary.enhancementsImported} imported
                      {midsResult.summary.enhancementsFailed > 0 && (
                        <span className="text-red-400"> / {midsResult.summary.enhancementsFailed} failed</span>
                      )}
                    </span>
                    <span>Pools:</span>
                    <span className="text-white">
                      {midsResult.build?.pools.map((p) => p.name).join(', ') || 'None'}
                    </span>
                    {midsResult.build?.epicPool && (
                      <>
                        <span>Epic/Patron:</span>
                        <span className="text-white">{midsResult.build.epicPool.name}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Warnings */}
                {midsResult.warnings.length > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 text-sm">
                    <button
                      type="button"
                      onClick={() => setShowWarnings(!showWarnings)}
                      className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 font-medium text-sm w-full"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${showWarnings ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {midsResult.warnings.length} warning{midsResult.warnings.length !== 1 ? 's' : ''}
                    </button>
                    {showWarnings && (
                      <ul className="mt-2 space-y-1 text-xs text-yellow-200 max-h-40 overflow-y-auto">
                        {midsResult.warnings.map((w, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-yellow-500 shrink-0">[{w.type}]</span>
                            <span>{w.message}{w.midsName ? `: ${w.midsName}` : ''}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Warning about replacing build */}
                <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 text-sm text-yellow-300">
                  <p className="font-semibold mb-1">Warning:</p>
                  <p>Applying this import will replace your current build.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Share Tab */
          <div className="space-y-4">
            {shareUrl ? (
              /* Success state */
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-700/50 rounded p-4 text-sm text-green-300">
                  <p className="font-semibold mb-2">Build shared successfully!</p>
                  <p className="text-xs text-green-400 mb-3">Anyone with this link can view your build:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm font-mono"
                      onFocus={(e) => e.target.select()}
                    />
                    <Button
                      variant={shareCopied ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={handleCopyShareUrl}
                    >
                      {shareCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Share form */
              <>
                <div className="bg-gray-800 border border-gray-600 rounded p-4 space-y-2">
                  <h3 className="font-semibold text-gray-300">Build to Share:</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><span className="text-gray-500">Name:</span> {build.name || 'Unnamed Build'}</p>
                    <p><span className="text-gray-500">Archetype:</span> {build.archetype.name || 'None'}</p>
                    <p><span className="text-gray-500">Level:</span> {build.level}</p>
                    {build.primary.name && (
                      <p><span className="text-gray-500">Primary:</span> {build.primary.name}</p>
                    )}
                    {build.secondary.name && (
                      <p><span className="text-gray-500">Secondary:</span> {build.secondary.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    value={shareDescription}
                    onChange={(e) => setShareDescription(e.target.value)}
                    placeholder="Describe your build — what it's for, how to play it, etc."
                    className="w-full h-24 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{shareDescription.length}/500</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Author Name <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={shareAuthor}
                      onChange={(e) => setShareAuthor(e.target.value)}
                      placeholder="Your global name"
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Server <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={shareServer}
                      onChange={(e) => setShareServer(e.target.value)}
                      placeholder="e.g., Homecoming"
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      maxLength={50}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tags <span className="text-gray-500">(optional, comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={shareTags}
                    onChange={(e) => setShareTags(e.target.value)}
                    placeholder="e.g., PvP, farming, budget, softcap"
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    maxLength={200}
                  />
                </div>

                {shareError && (
                  <div className="bg-red-900/20 border border-red-700/50 rounded p-3 text-sm text-red-300">
                    {shareError}
                  </div>
                )}

                <div className="bg-green-900/20 border border-green-700/50 rounded p-3 text-sm text-green-300">
                  <p className="font-semibold mb-1">Share Info:</p>
                  <p>Your build will be shared publicly. Anyone with the link can view it. No account required.</p>
                </div>
              </>
            )}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {activeTab === 'export' ? (
            <Button variant="primary" onClick={handleExport}>
              Download Build
            </Button>
          ) : activeTab === 'import' ? (
            <Button
              variant="primary"
              onClick={handleImportFromText}
              disabled={!importText.trim() || importSuccess}
            >
              Import from Text
            </Button>
          ) : activeTab === 'share' ? (
            !shareUrl && (
              <Button
                variant="primary"
                onClick={handleShare}
                isLoading={shareLoading}
                disabled={shareLoading || !build.archetype.id}
              >
                Share Build
              </Button>
            )
          ) : (
            /* Mids tab buttons */
            midsResult?.success ? (
              <Button variant="primary" onClick={handleMidsApply}>
                Apply Build
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleMidsParseFromText}
                disabled={!midsText.trim()}
              >
                Parse .mbd
              </Button>
            )
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}
