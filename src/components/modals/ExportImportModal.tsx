/**
 * ExportImportModal component - handles build export and import
 */

import { useState, useRef } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal';
import { Button } from '../ui/Button';
import { useBuildStore } from '@/stores/buildStore';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'export' | 'import';

export function ExportImportModal({ isOpen, onClose }: ExportImportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [buildAlias, setBuildAlias] = useState('');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { exportBuild, importBuild, build } = useBuildStore();

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

  const handleClose = () => {
    setBuildAlias('');
    setImportText('');
    setImportError(null);
    setImportSuccess(false);
    setActiveTab('export');
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
            Export Build
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'import'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('import')}
          >
            Import Build
          </button>
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
        ) : (
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
          ) : (
            <Button
              variant="primary"
              onClick={handleImportFromText}
              disabled={!importText.trim() || importSuccess}
            >
              Import from Text
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}
