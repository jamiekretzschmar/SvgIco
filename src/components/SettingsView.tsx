import React, { useRef } from 'react';
import { 
  Settings, 
  Type, 
  FolderTree, 
  BarChart3, 
  Sliders, 
  FolderUp, 
  Upload, 
  Sparkles, 
  FileCode, 
  Save, 
  RotateCcw, 
  Check, 
  Hash, 
  Layers, 
  Database,
  Cpu,
  Moon,
  Sun
} from 'lucide-react';
import { IconItem, FontSettings, FolderItem } from '../types/icon';
import { sanitizeSvgCode, parseIconMetadataFromFileName, getNextUnicodeHex, scanDroppedEntries } from '../utils/svgParser';

interface SettingsViewProps {
  settings: FontSettings;
  setSettings: React.Dispatch<React.SetStateAction<FontSettings>>;
  icons: IconItem[];
  setIcons: React.Dispatch<React.SetStateAction<IconItem[]>>;
  folders: FolderItem[];
  setFolders: React.Dispatch<React.SetStateAction<FolderItem[]>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onNavigateToStudio: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  icons,
  setIcons,
  folders,
  setFolders,
  isDarkMode,
  toggleDarkMode,
  onNavigateToStudio,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);

  // Statistics calculation
  const totalGlyphs = icons.length;
  const folderCounts: Record<string, number> = {};
  let totalBytes = 0;
  const uniqueTags = new Set<string>();

  icons.forEach((icon) => {
    folderCounts[icon.folder] = (folderCounts[icon.folder] || 0) + 1;
    totalBytes += icon.svgCode.length;
    icon.tags.forEach(t => uniqueTags.add(t));
  });

  const avgBytesPerGlyph = totalGlyphs > 0 ? Math.round(totalBytes / totalGlyphs) : 0;
  const estimatedTtfSizeKb = totalGlyphs > 0 ? (totalGlyphs * 1.2 + 8).toFixed(1) : '0';

  // Single or multiple file upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newIcons: IconItem[] = [];
    let currentNextHex = getNextUnicodeHex(icons, settings.startUnicodeHex);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.toLowerCase().endsWith('.svg')) continue;

      const text = await file.text();
      const sanitized = sanitizeSvgCode(text);
      if (!sanitized.isValid) continue;

      const meta = parseIconMetadataFromFileName(file.name);
      newIcons.push({
        id: `icon-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        name: meta.name,
        folder: 'Imported',
        tags: meta.tags,
        svgCode: sanitized.svg,
        unicodeHex: currentNextHex,
        viewBox: sanitized.viewBox,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      currentNextHex = (parseInt(currentNextHex, 16) + 1).toString(16).toLowerCase();
    }

    if (newIcons.length > 0) {
      // Ensure 'Imported' folder exists
      if (!folders.some(f => f.name === 'Imported')) {
        setFolders(prev => [...prev, { id: 'Imported', name: 'Imported', color: '#8b5cf6' }]);
      }
      setIcons(prev => [...prev, ...newIcons]);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Entire directory upload handler
  const handleDirectoryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newIcons: IconItem[] = [];
    const discoveredFolders = new Set<string>();
    let currentNextHex = getNextUnicodeHex(icons, settings.startUnicodeHex);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.toLowerCase().endsWith('.svg')) continue;

      // Extract folder name from webkitRelativePath
      const relPath = file.webkitRelativePath || file.name;
      const pathParts = relPath.split('/');
      let assignedFolder = 'Imported';
      if (pathParts.length > 1) {
        // e.g. "my-icons/navigation/home.svg" -> folder is navigation
        assignedFolder = pathParts[pathParts.length - 2] || 'Imported';
        // Capitalize folder name
        assignedFolder = assignedFolder.charAt(0).toUpperCase() + assignedFolder.slice(1);
      }

      discoveredFolders.add(assignedFolder);

      const text = await file.text();
      const sanitized = sanitizeSvgCode(text);
      if (!sanitized.isValid) continue;

      const meta = parseIconMetadataFromFileName(file.name, assignedFolder);
      newIcons.push({
        id: `icon-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        name: meta.name,
        folder: assignedFolder,
        tags: meta.tags,
        svgCode: sanitized.svg,
        unicodeHex: currentNextHex,
        viewBox: sanitized.viewBox,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      currentNextHex = (parseInt(currentNextHex, 16) + 1).toString(16).toLowerCase();
    }

    if (newIcons.length > 0) {
      // Add any missing folders
      setFolders(prev => {
        const existingNames = new Set(prev.map(f => f.name));
        const updated = [...prev];
        discoveredFolders.forEach(df => {
          if (!existingNames.has(df)) {
            updated.push({
              id: df,
              name: df,
              color: '#3b82f6',
              description: `Imported folder structure`,
            });
          }
        });
        return updated;
      });

      setIcons(prev => [...prev, ...newIcons]);
    }

    if (dirInputRef.current) dirInputRef.current.value = '';
  };

  const handleResetToDefaults = () => {
    setSettings({
      fontFamily: 'GlyphForgeIcons',
      fontPrefix: 'gf-',
      startUnicodeHex: 'e900',
      unitsPerEm: 1024,
      author: 'GlyphForge Studio',
      version: '1.0.0',
      normalizeGlyphs: true,
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-3 sm:px-6 space-y-8 animate-fade-in">
      {/* Settings Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-pressed flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <span>Studio Settings & Statistics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure TrueType font generation metadata, view library statistics, and batch import SVG directory structures.
          </p>
        </div>

        <button
          onClick={onNavigateToStudio}
          className="px-4 py-2.5 rounded-xl neo-btn-primary font-bold text-xs sm:text-sm shadow-md"
        >
          Return to Studio
        </button>
      </div>

      {/* Grid: Stats Top Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="neo-card rounded-2xl p-4.5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Glyphs</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {totalGlyphs}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
            {folders.filter(f => f.id !== 'all').length} Active Folders
          </div>
        </div>

        <div className="neo-card rounded-2xl p-4.5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Searchable Tags</span>
            <Hash className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {uniqueTags.size}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">
            Instant filter tokens
          </div>
        </div>

        <div className="neo-card rounded-2xl p-4.5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Estimated .TTF</span>
            <Cpu className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {estimatedTtfSizeKb} <span className="text-sm font-normal text-slate-400">KB</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            SFNT binary container
          </div>
        </div>

        <div className="neo-card rounded-2xl p-4.5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Avg SVG Weight</span>
            <Database className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {avgBytesPerGlyph} <span className="text-sm font-normal text-slate-400">bytes</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
            Clean 24×24 geometry
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Font & Export Configuration */}
        <div className="lg:col-span-7 space-y-6">
          <div className="neo-card-lg rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                <span>Webfont & TTF Compilation Settings</span>
              </h2>
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="text-xs neo-btn px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Font Family Name */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Font Family Name
                </label>
                <input
                  type="text"
                  value={settings.fontFamily}
                  onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                  placeholder="e.g. GlyphForgeIcons"
                  className="w-full neo-input rounded-xl px-3 py-2 text-sm font-medium"
                />
                <p className="text-[11px] text-slate-500">
                  Used in CSS <code className="font-mono">font-family: '{settings.fontFamily}'</code> and TTF name records.
                </p>
              </div>

              {/* CSS Class Prefix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    CSS Class Prefix
                  </label>
                  <input
                    type="text"
                    value={settings.fontPrefix}
                    onChange={(e) => setSettings({ ...settings, fontPrefix: e.target.value })}
                    placeholder="e.g. gf-"
                    className="w-full neo-input rounded-xl px-3 py-2 text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Generates <code className="font-mono">.{settings.fontPrefix}home:before</code>
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Starting Unicode Hex (BMP PUA)
                  </label>
                  <input
                    type="text"
                    value={settings.startUnicodeHex}
                    onChange={(e) => setSettings({ ...settings, startUnicodeHex: e.target.value })}
                    placeholder="e.g. e900"
                    className="w-full neo-input rounded-xl px-3 py-2 text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Private Use Area range: \e900 to \f8ff
                  </p>
                </div>
              </div>

              {/* Units Per EM & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Units per EM (Grid Resolution)
                  </label>
                  <select
                    value={settings.unitsPerEm}
                    onChange={(e) => setSettings({ ...settings, unitsPerEm: parseInt(e.target.value, 10) })}
                    className="w-full neo-input rounded-xl px-3 py-2 text-sm font-medium"
                  >
                    <option value={1024}>1024 (Power of 2 - Recommended)</option>
                    <option value={1000}>1000 (Decimal Standard)</option>
                    <option value={2048}>2048 (Ultra High Fidelity)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Font Version
                  </label>
                  <input
                    type="text"
                    value={settings.version}
                    onChange={(e) => setSettings({ ...settings, version: e.target.value })}
                    placeholder="1.0.0"
                    className="w-full neo-input rounded-xl px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Author / Designer */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Author / Copyright Notice
                </label>
                <input
                  type="text"
                  value={settings.author}
                  onChange={(e) => setSettings({ ...settings, author: e.target.value })}
                  placeholder="e.g. Your Team or Studio"
                  className="w-full neo-input rounded-xl px-3 py-2 text-sm font-medium"
                />
              </div>

              {/* Theme Preference */}
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Theme Appearance</div>
                  <div className="text-[11px] text-slate-500">Toggle between Light and Dark neomorphic palettes</div>
                </div>

                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="px-4 py-2 rounded-xl neo-btn flex items-center gap-2 text-xs font-bold"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                  <span>{isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Import Files & Folder Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* File & Directory Import Card */}
          <div className="neo-card-lg rounded-3xl p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
              <FolderUp className="w-4 h-4 text-purple-600" />
              <span>Import Single SVG or Directory Tree</span>
            </h2>

            <p className="text-xs text-slate-500 leading-relaxed">
              Import single files or entire nested directories. Directory imports automatically preserve subfolder category hierarchies and generate tags from filenames!
            </p>

            {/* Hidden native inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".svg"
              multiple
              className="hidden"
            />
            {/* Directory picker */}
            <input
              type="file"
              ref={dirInputRef}
              onChange={handleDirectoryChange}
              // @ts-ignore
              webkitdirectory=""
              directory=""
              multiple
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Single / Multiple SVGs Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl neo-btn flex flex-col items-center justify-center gap-2 text-center group hover:border-blue-500/40"
              >
                <div className="w-10 h-10 rounded-xl neo-pressed flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Import SVG Files
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Single or multi-select
                  </div>
                </div>
              </button>

              {/* Entire Directory Structure Button */}
              <button
                type="button"
                onClick={() => dirInputRef.current?.click()}
                className="p-4 rounded-2xl neo-btn flex flex-col items-center justify-center gap-2 text-center group hover:border-purple-500/40"
              >
                <div className="w-10 h-10 rounded-xl neo-pressed flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Import Entire Directory
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Preserves folder hierarchy
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Folder Breakdown Card */}
          <div className="neo-card-lg rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Category Folder Breakdown</span>
            </h2>

            <div className="space-y-2.5">
              {folders.filter(f => f.id !== 'all').map((folder) => {
                const count = folderCounts[folder.name] || 0;
                const percentage = totalGlyphs > 0 ? Math.round((count / totalGlyphs) * 100) : 0;

                return (
                  <div key={folder.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {folder.name}
                      </span>
                      <span className="font-mono text-slate-500">
                        {count} glyphs ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full neo-pressed overflow-hidden">
                      <div
                        style={{ width: `${percentage}%`, backgroundColor: folder.color }}
                        className="h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
