import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SettingsView } from './components/SettingsView';
import { BatchExportModal } from './components/BatchExportModal';
import { ResponsivePreviewModal } from './components/ResponsivePreviewModal';
import { INITIAL_ICONS, INITIAL_FOLDERS } from './utils/defaultIcons';
import { IconItem, FolderItem, FontSettings } from './types/icon';
import { 
  Compass, 
  FolderTree, 
  Settings, 
  Smartphone, 
  Download, 
  Plus 
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'settings'>('landing');
  const [icons, setIcons] = useState<IconItem[]>(INITIAL_ICONS);
  const [folders, setFolders] = useState<FolderItem[]>(INITIAL_FOLDERS);
  const [selectedIconIds, setSelectedIconIds] = useState<string[]>([]);
  const [targetFolderFilter, setTargetFolderFilter] = useState<string>('all');

  const [settings, setSettings] = useState<FontSettings>({
    fontFamily: 'GlyphForgeIcons',
    fontPrefix: 'gf-',
    startUnicodeHex: 'e900',
    unitsPerEm: 1024,
    author: 'GlyphForge Studio',
    version: '1.0.0',
    normalizeGlyphs: true,
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('glyphforge-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('glyphforge-dark-mode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Modals state
  const [isBatchExportOpen, setIsBatchExportOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  // Quick navigation helper
  const handleEnterStudioWithFolder = (folderName?: string) => {
    if (folderName) {
      setTargetFolderFilter(folderName);
    }
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 pb-20 sm:pb-8">
      {/* Top Header Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        openBatchExport={() => setIsBatchExportOpen(true)}
        openPreviewModal={() => setIsPreviewModalOpen(true)}
        openNewIconModal={() => {
          setCurrentTab('dashboard');
        }}
        totalIconsCount={icons.length}
      />

      {/* Main Tab Content */}
      <main className="w-full">
        {currentTab === 'landing' && (
          <LandingPage
            icons={icons}
            settings={settings}
            onEnterStudio={handleEnterStudioWithFolder}
            onOpenBatchExport={() => setIsBatchExportOpen(true)}
            onOpenScreenPreview={() => setIsPreviewModalOpen(true)}
            onOpenSettings={() => setCurrentTab('settings')}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            icons={icons}
            setIcons={setIcons}
            folders={folders}
            setFolders={setFolders}
            settings={settings}
            selectedIconIds={selectedIconIds}
            setSelectedIconIds={setSelectedIconIds}
            openBatchExport={() => setIsBatchExportOpen(true)}
            openScreenPreview={() => setIsPreviewModalOpen(true)}
            initialFolderFilter={targetFolderFilter}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
            icons={icons}
            setIcons={setIcons}
            folders={folders}
            setFolders={setFolders}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onNavigateToStudio={() => setCurrentTab('dashboard')}
          />
        )}
      </main>

      {/* Batch Export Modal */}
      <BatchExportModal
        isOpen={isBatchExportOpen}
        onClose={() => setIsBatchExportOpen(false)}
        icons={icons}
        selectedIconIds={selectedIconIds}
        settings={settings}
        folders={folders.map(f => f.name)}
        currentFolderFilter={targetFolderFilter}
      />

      {/* Responsive Screen Preview Modal */}
      <ResponsivePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        icons={icons}
        settings={settings}
      />

      {/* Mobile-Friendly Portrait Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 sm:hidden px-3 py-2 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-around select-none">
        <button
          onClick={() => setCurrentTab('landing')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            currentTab === 'landing' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            currentTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span className="text-[10px]">Studio</span>
        </button>

        <button
          onClick={() => setIsPreviewModalOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 text-purple-600 dark:text-purple-400"
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-[10px]">Screens</span>
        </button>

        <button
          onClick={() => setIsBatchExportOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 text-emerald-600 dark:text-emerald-400 font-semibold"
        >
          <Download className="w-4 h-4" />
          <span className="text-[10px]">Export</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            currentTab === 'settings' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px]">Settings</span>
        </button>
      </nav>
    </div>
  );
}
