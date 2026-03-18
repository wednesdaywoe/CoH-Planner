/**
 * ExportImportModal component - handles build save/load, import, and sharing
 */

import { useState, useRef, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal';
import { Button } from '../ui/Button';
import { useBuildStore, useUIStore, useAuthStore } from '@/stores';
import type { ArchetypeBranchId } from '@/types';
import { importMidsBuild } from '@/utils/mids-import';
import type { MidsImportResult } from '@/utils/mids-import';
import { importGameExport } from '@/utils/game-import';
import type { GameImportResult } from '@/utils/game-import';
import { shareBuild, getOwnedBuildIds, getOwnerToken, getMyBuilds } from '@/services/sharedBuilds';
import type { BuildExport } from '@/types/build';
import type { SharedBuild } from '@/types/shared';
import { generatePopmenu } from '@/utils/export-popmenu';
import { openPrintView } from '@/utils/export-print';
import { exportToMids } from '@/utils/mids-export';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'save' | 'load-import' | 'share-export';
type LoadSource = 'local' | 'mids' | 'game';
type ShareExportSubTab = 'share' | 'export';

export function ExportImportModal({ isOpen, onClose }: ExportImportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('save');
  const requestedTab = useUIStore((s) => s.exportImportModalTab);

  // Sync tab when modal opens with a specific tab requested
  useEffect(() => {
    if (isOpen && requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [isOpen, requestedTab]);

  // Save state
  const [buildAlias, setBuildAlias] = useState('');

  // Load local state
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Popmenu state
  const [showPopmenu, setShowPopmenu] = useState(false);
  const [popmenuName, setPopmenuName] = useState('');
  const [popmenuStatus, setPopmenuStatus] = useState<string | null>(null);
  const [popmenuError, setPopmenuError] = useState<string | null>(null);

  // Load/Import source toggle
  const [loadSource, setLoadSource] = useState<LoadSource>('local');

  // Mids import state
  const [midsText, setMidsText] = useState('');
  const [midsResult, setMidsResult] = useState<MidsImportResult | null>(null);
  const [midsError, setMidsError] = useState<string | null>(null);
  const [showWarnings, setShowWarnings] = useState(false);
  const midsFileInputRef = useRef<HTMLInputElement>(null);

  // Game import state
  const [gameText, setGameText] = useState('');
  const [gameResult, setGameResult] = useState<GameImportResult | null>(null);
  const [gameError, setGameError] = useState<string | null>(null);
  const [showGameWarnings, setShowGameWarnings] = useState(false);
  const gameFileInputRef = useRef<HTMLInputElement>(null);

  // Share/Export sub-tab
  const [shareExportSubTab, setShareExportSubTab] = useState<ShareExportSubTab>('share');

  // Share state
  const [shareDescription, setShareDescription] = useState('');
  const [shareAuthor, setShareAuthor] = useState('');
  const [shareServer, setShareServer] = useState('');
  const [shareTags, setShareTags] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareUpdated, setShareUpdated] = useState(false);
  const [updateExistingId, setUpdateExistingId] = useState<string | null>(null);
  const [sharedBuildId, setSharedBuildId] = useState<string | null>(null);
  const [showOwnerToken, setShowOwnerToken] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [accountBuilds, setAccountBuilds] = useState<SharedBuild[]>([]);

  // Vault save state
  const [vaultSaveSuccess, setVaultSaveSuccess] = useState(false);
  const [vaultSaveError, setVaultSaveError] = useState<string | null>(null);
  const [vaultSaveLoading, setVaultSaveLoading] = useState(false);

  const { exportBuild, importBuild, importMidsBuild: applyMidsBuild, build } = useBuildStore();
  const user = useAuthStore((s) => s.user);

  // Fetch account-owned builds when modal opens and user is logged in
  useEffect(() => {
    if (isOpen && user) {
      getMyBuilds().then(setAccountBuilds).catch(() => {});
    }
  }, [isOpen, user]);

  // Merge token-owned IDs with account-owned IDs (deduplicated)
  const tokenIds = getOwnedBuildIds();
  const accountIds = accountBuilds.map((b) => b.id);
  const allOwnedIds = [...new Set([...tokenIds, ...accountIds])];
  const accountBuildMap = new Map(accountBuilds.map((b) => [b.id, b]));

  // ============================================
  // SAVE HANDLERS
  // ============================================

  const handleExport = () => {
    const exportData = JSON.parse(exportBuild());

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

    const filename = (buildAlias.trim() || build.name || 'build')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();

    link.href = url;
    link.download = `${filename}_${Date.now()}.skif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setBuildAlias('');
    onClose();
  };

  const handleVaultSave = async () => {
    setVaultSaveError(null);
    setVaultSaveLoading(true);
    setVaultSaveSuccess(false);

    try {
      const exportData = JSON.parse(exportBuild()) as BuildExport;
      await shareBuild({
        name: buildAlias.trim() || build.name || 'Untitled Build',
        description: '',
        author_name: '',
        server: '',
        tags: [],
        build_json: exportData,
        is_public: false,
      });
      setVaultSaveSuccess(true);
    } catch (e) {
      setVaultSaveError(e instanceof Error ? e.message : 'Failed to save to vault');
    } finally {
      setVaultSaveLoading(false);
    }
  };

  // ============================================
  // LOAD LOCAL HANDLERS
  // ============================================

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
    } catch {
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
      } catch {
        setImportError('Invalid build file. Please check the format.');
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read file');
    };
    reader.readAsText(file);
  };

  // ============================================
  // POPMENU HANDLER
  // ============================================

  const handlePopmenuSave = async () => {
    const name = popmenuName || build.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'MyBuild';
    const content = generatePopmenu(build, name);

    if ('showSaveFilePicker' in window) {
      try {
        setPopmenuStatus(null);
        setPopmenuError(null);

        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `${name}.mnu`,
          types: [{
            description: 'Popmenu file',
            accept: { 'text/plain': ['.mnu'] },
          }],
        });

        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();

        setPopmenuStatus(`Saved ${name}.mnu`);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setPopmenuError(`Failed to save: ${e?.message || 'Unknown error'}`);
      }
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.mnu`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    } catch {
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
    // Auto-set branch for VEAT imports (e.g., Crab Spider, Bane Spider)
    if (midsResult.detectedBranch) {
      useUIStore.getState().setSelectedBranch(midsResult.detectedBranch as ArchetypeBranchId);
    }
    handleClose();
  };

  // ============================================
  // GAME IMPORT HANDLERS
  // ============================================

  const handleGameParse = () => {
    setGameError(null);
    setGameResult(null);
    setShowGameWarnings(false);

    if (!gameText.trim()) {
      setGameError('No data to import');
      return;
    }

    try {
      const result = importGameExport(gameText);
      if (result.success) {
        setGameResult(result);
      } else {
        const msg = result.warnings.length > 0
          ? result.warnings[0].message
          : 'Failed to parse game export';
        setGameError(msg);
      }
    } catch {
      setGameError('Failed to parse game export. Make sure it is a valid Homecoming build export.');
    }
  };

  const handleGameFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setGameText(content);
      setGameError(null);
      setGameResult(null);
      setShowGameWarnings(false);

      // Auto-parse
      try {
        const result = importGameExport(content);
        if (result.success) {
          setGameResult(result);
        } else {
          const msg = result.warnings.length > 0
            ? result.warnings[0].message
            : 'Failed to parse game export';
          setGameError(msg);
        }
      } catch {
        setGameError('Failed to parse game export. Make sure it is a valid Homecoming build export.');
      }
    };
    reader.onerror = () => {
      setGameError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleGameApply = () => {
    if (!gameResult?.build) return;
    applyMidsBuild(gameResult.build);
    handleClose();
  };

  // ============================================
  // SHARE HANDLERS
  // ============================================

  const handleShare = async () => {
    setShareError(null);
    setShareLoading(true);
    setShareUrl(null);
    setShareUpdated(false);

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
        existingId: updateExistingId ?? undefined,
        is_public: true,
      });

      setShareUrl(result.url);
      setShareUpdated(result.updated ?? false);
      setSharedBuildId(result.id);
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

  // ============================================
  // CLOSE
  // ============================================

  const handleClose = () => {
    setBuildAlias('');
    setImportText('');
    setImportError(null);
    setImportSuccess(false);
    setShowPopmenu(false);
    setPopmenuName('');
    setPopmenuStatus(null);
    setPopmenuError(null);
    setLoadSource('local');
    setMidsText('');
    setMidsResult(null);
    setMidsError(null);
    setShowWarnings(false);
    setGameText('');
    setGameResult(null);
    setGameError(null);
    setShowGameWarnings(false);
    setShareExportSubTab('share');
    setShareDescription('');
    setShareAuthor('');
    setShareServer('');
    setShareTags('');
    setShareError(null);
    setShareUrl(null);
    setShareLoading(false);
    setShareCopied(false);
    setShareUpdated(false);
    setUpdateExistingId(null);
    setSharedBuildId(null);
    setShowOwnerToken(false);
    setTokenCopied(false);
    setVaultSaveSuccess(false);
    setVaultSaveError(null);
    setVaultSaveLoading(false);
    setActiveTab('save');
    if (midsFileInputRef.current) midsFileInputRef.current.value = '';
    if (gameFileInputRef.current) gameFileInputRef.current.value = '';
    onClose();
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderWarningsToggle = (
    warnings: { type: string; message: string; midsName?: string; name?: string }[],
    show: boolean,
    setShow: (v: boolean) => void,
    useNameField = false,
  ) => {
    if (warnings.length === 0) return null;
    return (
      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 text-sm">
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 font-medium text-sm w-full"
        >
          <svg
            className={`w-4 h-4 transition-transform ${show ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
        </button>
        {show && (
          <ul className="mt-2 space-y-1 text-xs text-yellow-200 max-h-40 overflow-y-auto">
            {warnings.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-yellow-500 shrink-0">[{w.type}]</span>
                <span>{w.message}{useNameField ? (w.name ? `: ${w.name}` : '') : (w.midsName ? `: ${w.midsName}` : '')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderImportResultSummary = (
    resultBuild: NonNullable<MidsImportResult['build']> | NonNullable<GameImportResult['build']>,
    summary: { powersImported: number; powersFailed: number; enhancementsImported: number; enhancementsFailed: number },
    characterName?: string,
  ) => (
    <div className="bg-green-900/20 border border-green-700/50 rounded p-3 text-sm text-green-300">
      <p className="font-semibold mb-2">Parse Successful</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {characterName && (
          <>
            <span>Character:</span>
            <span className="text-white">{characterName}</span>
          </>
        )}
        <span>Archetype:</span>
        <span className="text-white">{resultBuild.archetype.name}</span>
        <span>Primary:</span>
        <span className="text-white">{resultBuild.primary.name || 'None'}</span>
        <span>Secondary:</span>
        <span className="text-white">{resultBuild.secondary.name || 'None'}</span>
        <span>Level:</span>
        <span className="text-white">{resultBuild.level}</span>
        <span>Powers:</span>
        <span className="text-white">
          {summary.powersImported} imported
          {summary.powersFailed > 0 && (
            <span className="text-red-400"> / {summary.powersFailed} failed</span>
          )}
        </span>
        <span>Enhancements:</span>
        <span className="text-white">
          {summary.enhancementsImported} imported
          {summary.enhancementsFailed > 0 && (
            <span className="text-red-400"> / {summary.enhancementsFailed} failed</span>
          )}
        </span>
        <span>Pools:</span>
        <span className="text-white">
          {resultBuild.pools.map((p) => p.name).join(', ') || 'None'}
        </span>
        {resultBuild.epicPool && (
          <>
            <span>Epic/Patron:</span>
            <span className="text-white">{resultBuild.epicPool.name}</span>
          </>
        )}
      </div>
    </div>
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" showCloseButton={true}>
      <ModalHeader>
        <div className="flex gap-4 border-b border-gray-700 -mb-4">
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'save'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('save')}
          >
            Save
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'load-import'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('load-import')}
          >
            Load / Import
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'share-export'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('share-export')}
          >
            Share / Export
          </button>
        </div>
      </ModalHeader>

      <ModalBody>
        {activeTab === 'save' ? (
          /* ========== SAVE TAB ========== */
          <div className="space-y-4">
            {/* Save section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Save Build</h3>

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
              </div>

              <div className="bg-gray-800 border border-gray-600 rounded p-4 space-y-2">
                <h3 className="font-semibold text-gray-300">Current Build:</h3>
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

              <Button variant="primary" onClick={handleExport} className="w-full">
                Download Build (.skif)
              </Button>
            </div>

            {/* Vault divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">VAULT</span>
              </div>
            </div>

            {/* Vault save section */}
            <div className="space-y-3">
              {user ? (
                <>
                  {vaultSaveSuccess ? (
                    <div className="bg-indigo-900/20 border border-indigo-700/50 rounded p-4 text-sm text-indigo-300">
                      <p className="font-semibold">Build saved to your vault!</p>
                      <p className="text-xs text-indigo-400 mt-1">
                        This build is private and only visible to you in My Builds.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        onClick={handleVaultSave}
                        isLoading={vaultSaveLoading}
                        disabled={vaultSaveLoading || !build.archetype.id}
                        className="w-full !bg-indigo-600 hover:!bg-indigo-700"
                      >
                        Save to Vault (Private)
                      </Button>
                      {vaultSaveError && (
                        <div className="bg-red-900/20 border border-red-700/50 rounded p-3 text-sm text-red-300">
                          {vaultSaveError}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-3">
                  <p className="text-sm text-gray-500">Log in to save builds to your vault</p>
                </div>
              )}
            </div>
          </div>

        ) : activeTab === 'load-import' ? (
          /* ========== LOAD / IMPORT TAB ========== */
          <div className="space-y-4">
            {/* 3-way source toggle */}
            <div className="flex gap-2">
              <button
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${
                  loadSource === 'local'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setLoadSource('local')}
              >
                Local (.skif)
              </button>
              <button
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${
                  loadSource === 'mids'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setLoadSource('mids')}
              >
                Mids Reborn (.mbd)
              </button>
              <button
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${
                  loadSource === 'game'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setLoadSource('game')}
              >
                Game (/buildsave)
              </button>
            </div>

            {loadSource === 'local' ? (
              /* Local JSON load */
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Load from File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.skif"
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
                    className="w-full h-24 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  {importText.trim() && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleImportFromText}
                      disabled={importSuccess}
                      className="mt-2"
                    >
                      Import from Text
                    </Button>
                  )}
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
              </div>

            ) : loadSource === 'mids' ? (
              /* Mids Import */
              <div className="space-y-4">
                <div className="bg-amber-900/20 border border-amber-700/50 rounded p-3 text-sm text-amber-300">
                  <p>Upload an .MBD file or paste its contents below. </p>
                  <p>!!! PLEASE READ !!! Here's the reality: Mids name patterns are all over the place. Some entries have no AT designation at all, others use abbreviated or combined AT names, and a few use prefixes instead of suffixes. There are also cases where the AT name appears as a prefix instead of a suffix, which makes the naming even more inconsistent. Importing and exporting Mids files reliably is going to be a long work in progress.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload .mbd File
                  </label>
                  <input
                    ref={midsFileInputRef}
                    type="file"
                    accept=".mbd,.json,.skif"
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
                    Paste .mbd Contents
                  </label>
                  <textarea
                    value={midsText}
                    onChange={(e) => { setMidsText(e.target.value); setMidsResult(null); setMidsError(null); }}
                    placeholder="Paste .mbd JSON here..."
                    className="w-full h-32 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                  />
                </div>

                {midsError && (
                  <div className="bg-red-900/20 border border-red-700/50 rounded p-3 text-sm text-red-300">
                    {midsError}
                  </div>
                )}

                {midsResult && midsResult.success && midsResult.build && (
                  <div className="space-y-3">
                    {renderImportResultSummary(midsResult.build, midsResult.summary)}
                    {renderWarningsToggle(midsResult.warnings, showWarnings, setShowWarnings)}
                    <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 text-sm text-yellow-300">
                      <p className="font-semibold mb-1">Warning:</p>
                      <p>Applying this import will replace your current build.</p>
                    </div>
                  </div>
                )}
              </div>

            ) : (
              /* Game Import */
              <div className="space-y-4">
                <div className="bg-cyan-900/20 border border-cyan-700/50 rounded p-3 text-sm text-cyan-300">
                  <p>Import a build from the <span className="font-semibold">Homecoming</span> in-game build export. Use the <span className="text-sk-magenta font-semibold">/buildsave</span> command in-game, then upload the text file or paste its contents below.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Build Export (.txt)
                  </label>
                  <input
                    ref={gameFileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleGameFileUpload}
                    className="w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-cyan-600 file:text-white
                      hover:file:bg-cyan-700
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
                    Paste Build Export
                  </label>
                  <textarea
                    value={gameText}
                    onChange={(e) => { setGameText(e.target.value); setGameResult(null); setGameError(null); }}
                    placeholder={"CharName: Level 50 Science Class_Tanker\n\nCharacter Profile:\n------------------\nLevel 1: Tanker_Defense Radiation_Armor Alpha_Barrier\n\tAttuned_Unbreakable_Guard_A (1)\n..."}
                    className="w-full h-48 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                  />
                </div>

                {gameError && (
                  <div className="bg-red-900/20 border border-red-700/50 rounded p-3 text-sm text-red-300">
                    {gameError}
                  </div>
                )}

                {gameResult && gameResult.success && gameResult.build && (
                  <div className="space-y-3">
                    {renderImportResultSummary(gameResult.build, gameResult.summary, gameResult.build.name)}
                    {renderWarningsToggle(gameResult.warnings, showGameWarnings, setShowGameWarnings, true)}
                    <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 text-sm text-yellow-300">
                      <p className="font-semibold mb-1">Warning:</p>
                      <p>Applying this import will replace your current build.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        ) : (
          /* ========== SHARE / EXPORT TAB ========== */
          <div className="space-y-4">
            {/* Sub-tab toggle */}
            <div className="flex gap-2">
              <button
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${
                  shareExportSubTab === 'share'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setShareExportSubTab('share')}
              >
                Share Publicly
              </button>
              <button
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${
                  shareExportSubTab === 'export'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setShareExportSubTab('export')}
              >
                Export Utilities
              </button>
            </div>

            {shareExportSubTab === 'share' ? (
              /* Share Publicly */
              <div className="space-y-4">
                {shareUrl ? (
                  <div className="space-y-4">
                    {/* Public share success */}
                    <div className="bg-green-900/20 border border-green-700/50 rounded p-4 text-sm text-green-300">
                      <p className="font-semibold mb-2">
                        {shareUpdated ? 'Build updated successfully!' : 'Build shared successfully!'}
                      </p>
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
                      {!shareUpdated && (
                        <p className="text-xs text-green-500 mt-2">
                          You can update or delete this build later from this browser.
                        </p>
                      )}
                    </div>

                    {/* Owner token backup */}
                    {sharedBuildId && getOwnerToken(sharedBuildId) && (
                      <div className="bg-gray-800 border border-gray-600 rounded p-3 text-xs">
                        <button
                          type="button"
                          onClick={() => setShowOwnerToken(!showOwnerToken)}
                          className="flex items-center gap-1 text-gray-400 hover:text-gray-300 font-medium w-full"
                        >
                          <svg
                            className={`w-3 h-3 transition-transform ${showOwnerToken ? 'rotate-90' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          Owner Token (backup)
                        </button>
                        {showOwnerToken && (
                          <div className="mt-2 space-y-2">
                            <p className="text-gray-500">
                              Save this token to manage your build from another browser or after clearing cache.
                              You can enter it on the build's detail page to reclaim ownership.
                            </p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                readOnly
                                value={getOwnerToken(sharedBuildId) ?? ''}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white font-mono text-xs"
                                onFocus={(e) => e.target.select()}
                              />
                              <Button
                                variant={tokenCopied ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={async () => {
                                  const token = getOwnerToken(sharedBuildId);
                                  if (token) {
                                    await navigator.clipboard.writeText(token);
                                    setTokenCopied(true);
                                    setTimeout(() => setTokenCopied(false), 2000);
                                  }
                                }}
                              >
                                {tokenCopied ? 'Copied!' : 'Copy'}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Update existing build option */}
                    {allOwnedIds.length > 0 && (
                      <div className="bg-gray-800 border border-gray-600 rounded p-3 space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={updateExistingId !== null}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUpdateExistingId(allOwnedIds[0]);
                              } else {
                                setUpdateExistingId(null);
                              }
                            }}
                            className="rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                          />
                          Update an existing shared build
                        </label>
                        {updateExistingId !== null && (
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Build to update</label>
                            <select
                              value={updateExistingId}
                              onChange={(e) => setUpdateExistingId(e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              {allOwnedIds.map((id) => {
                                const info = accountBuildMap.get(id);
                                const label = info ? `${info.name} (${id})` : id;
                                return <option key={id} value={id}>{label}</option>;
                              })}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">This will replace the build data at the existing URL.</p>
                          </div>
                        )}
                      </div>
                    )}

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
                      <p className="font-semibold mb-1">
                        {updateExistingId ? 'Update Info:' : 'Share Info:'}
                      </p>
                      <p>
                        {updateExistingId
                          ? 'This will replace the existing shared build with your current build data. The URL will stay the same.'
                          : 'Your build will be shared publicly. Anyone with the link can view it. No account required.'
                        }
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Export Utilities */
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const json = exportToMids(build);
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      const filename = (build.name || 'build')
                        .replace(/[^a-z0-9]/gi, '_')
                        .toLowerCase();
                      link.href = url;
                      link.download = `${filename}.mbd`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1"
                  >
                    Export to Mids (experimental)
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => { openPrintView(build); handleClose(); }}
                    className="flex-1"
                  >
                    Print Build
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPopmenu(!showPopmenu)}
                    className="flex-1"
                  >
                    Test Server Popmenu
                  </Button>
                </div>

                {/* Popmenu expanded section */}
                {showPopmenu && (
                  <div className="space-y-3 border border-gray-700 rounded p-3 bg-gray-800/50">
                    <div className="text-xs text-emerald-300">
                      Generate a <span className="font-semibold">.mnu</span> popmenu file for the test server. Save to <span className="text-sk-magenta font-semibold">Homecoming/data/texts/English/Menus/</span> and use <span className="text-sk-magenta font-semibold">/popmenu {popmenuName || 'YourMenuName'}</span> in-game.
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Menu Name
                        </label>
                        <input
                          type="text"
                          value={popmenuName}
                          onChange={(e) => setPopmenuName(e.target.value)}
                          placeholder={build.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'MyBuild'}
                          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          maxLength={50}
                        />
                      </div>
                      <Button variant="primary" size="sm" onClick={handlePopmenuSave}>
                        Save .mnu
                      </Button>
                    </div>
                    {popmenuStatus && (
                      <div className="text-xs text-green-300">{popmenuStatus}</div>
                    )}
                    {popmenuError && (
                      <div className="text-xs text-red-300">{popmenuError}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {activeTab === 'share-export' && shareExportSubTab === 'share' ? (
            !shareUrl && (
              <Button
                variant="primary"
                onClick={handleShare}
                isLoading={shareLoading}
                disabled={shareLoading || !build.archetype.id}
              >
                {updateExistingId ? 'Update Build' : 'Share Build'}
              </Button>
            )
          ) : activeTab === 'load-import' ? (
            loadSource === 'mids' ? (
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
            ) : loadSource === 'game' ? (
              gameResult?.success ? (
                <Button variant="primary" onClick={handleGameApply}>
                  Apply Build
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleGameParse}
                  disabled={!gameText.trim()}
                >
                  Parse Export
                </Button>
              )
            ) : null
          ) : null}
        </div>
      </ModalFooter>
    </Modal>
  );
}
