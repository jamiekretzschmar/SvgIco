import React from 'react';
import { 
  Sparkles, 
  FolderTree, 
  Layers, 
  Settings, 
  Sun, 
  Moon, 
  Download, 
  Smartphone, 
  Plus, 
  Compass
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'dashboard' | 'settings';
  setCurrentTab: (tab: 'landing' | 'dashboard' | 'settings') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  openBatchExport: () => void;
  openPreviewModal: () => void;
  openNewIconModal: () => void;
  totalIconsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDarkMode,
  toggleDarkMode,
  openBatchExport,
  openPreviewModal,
  openNewIconModal,
  totalIconsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full px-3 sm:px-6 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto neo-card rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 backdrop-blur-md">
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl neo-pressed flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                GlyphForge
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              SVG • TTF • Webfont Studio
            </p>
          </div>
        </div>

        {/* Center Nav tabs */}
        <nav className="flex items-center p-1 rounded-xl neo-pressed gap-1">
          <button
            onClick={() => setCurrentTab('landing')}
            className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'landing'
                ? 'neo-btn-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Home</span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'neo-btn-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Studio</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 ml-0.5">
              {totalIconsCount}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'settings'
                ? 'neo-btn-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Responsive screen preview modal toggle */}
          <button
            onClick={openPreviewModal}
            title="Preview on different screen sizes"
            className="p-2 sm:px-3 sm:py-2 rounded-xl neo-btn text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Smartphone className="w-4 h-4 text-purple-500" />
            <span className="hidden md:inline">Screens</span>
          </button>

          {/* Dark / Light toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 sm:p-2.5 rounded-xl neo-btn text-slate-700 dark:text-slate-200 hover:text-amber-500"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Quick Create Button (Mobile friendly) */}
          <button
            onClick={openNewIconModal}
            className="p-2 sm:px-3 sm:py-2 rounded-xl neo-btn-accent text-white flex items-center gap-1.5 text-xs font-semibold"
            title="Create or import SVG"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">New Glyph</span>
          </button>

          {/* Batch Export Button */}
          <button
            onClick={openBatchExport}
            className="px-3 sm:px-4 py-2 rounded-xl neo-btn-primary flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Set</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
