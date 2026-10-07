import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  X, 
  Download, 
  CheckSquare, 
  Square, 
  FileCode, 
  Type, 
  Layers, 
  FolderArchive, 
  Sparkles, 
  Check, 
  Loader2,
  FolderTree
} from 'lucide-react';
import { IconItem, FontSettings, BatchExportOptions } from '../types/icon';
import { 
  compileTrueTypeFont, 
  generateSvgFont, 
  generateCssWebfont, 
  uint8ArrayToBase64, 
  generateReactComponentsPack, 
  generateSvgSprite, 
  generateHtmlDemoPage 
} from '../utils/ttfCompiler';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  icons: IconItem[];
  selectedIconIds: string[];
  settings: FontSettings;
  folders: string[];
  currentFolderFilter: string;
}

export const BatchExportModal: React.FC<BatchExportModalProps> = ({
  isOpen,
  onClose,
  icons,
  selectedIconIds,
  settings,
  folders,
  currentFolderFilter,
}) => {
  if (!isOpen) return null;

  const [options, setOptions] = useState<BatchExportOptions>({
    includeTtf: true,
    includeSvgFont: true,
    includeCss: true,
    includeIndividualSvgs: true,
    includeSvgSprite: true,
    includeReactComponents: true,
    includeJsonManifest: true,
    exportScope: selectedIconIds.length > 0 ? 'selected' : (currentFolderFilter !== 'all' ? 'folder' : 'all'),
    selectedFolder: currentFolderFilter !== 'all' ? currentFolderFilter : folders[1] || 'Navigation',
  });

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Filter icons by scope
  const getExportIcons = (): IconItem[] => {
    if (options.exportScope === 'selected' && selectedIconIds.length > 0) {
      return icons.filter(i => selectedIconIds.includes(i.id));
    }
    if (options.exportScope === 'folder' && options.selectedFolder) {
      return icons.filter(i => i.folder === options.selectedFolder);
    }
    return icons;
  };

  const exportIcons = getExportIcons();

  const handleExport = async () => {
    if (exportIcons.length === 0) return;
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const zip = new JSZip();
      const fontName = settings.fontFamily.replace(/\s+/g, '_') || 'GlyphForgeIcons';

      // 1. TTF Binary
      let ttfBase64 = '';
      if (options.includeTtf || options.includeCss) {
        const ttfBytes = compileTrueTypeFont(exportIcons, settings);
        ttfBase64 = uint8ArrayToBase64(ttfBytes);
        if (options.includeTtf) {
          zip.file(`${fontName}.ttf`, ttfBytes);
        }
      }

      // 2. SVG Font
      if (options.includeSvgFont) {
        const svgFont = generateSvgFont(exportIcons, settings);
        zip.file(`${fontName}.svg`, svgFont);
      }

      // 3. CSS Webfont stylesheet + HTML Demo
      if (options.includeCss) {
        const cssContent = generateCssWebfont(exportIcons, settings, ttfBase64);
        zip.file(`${fontName}.css`, cssContent);

        const htmlDemo = generateHtmlDemoPage(exportIcons, settings);
        zip.file(`demo.html`, htmlDemo);
      }

      // 4. Individual SVGs organized by folder
      if (options.includeIndividualSvgs) {
        const svgFolder = zip.folder('svg');
        exportIcons.forEach((icon) => {
          const folderName = icon.folder.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
          const subDir = svgFolder?.folder(folderName) || svgFolder;
          subDir?.file(`${icon.name}.svg`, icon.svgCode);
        });
      }

      // 5. SVG Spritesheet
      if (options.includeSvgSprite) {
        const spriteXml = generateSvgSprite(exportIcons, settings.fontPrefix);
        zip.file(`spritesheet.svg`, spriteXml);
      }

      // 6. React Components (.tsx)
      if (options.includeReactComponents) {
        const reactCode = generateReactComponentsPack(exportIcons);
        zip.file(`ReactIcons.tsx`, reactCode);
      }

      // 7. JSON Manifest
      if (options.includeJsonManifest) {
        const manifest = {
          fontFamily: settings.fontFamily,
          prefix: settings.fontPrefix,
          author: settings.author,
          version: settings.version,
          totalGlyphs: exportIcons.length,
          generatedAt: new Date().toISOString(),
          icons: exportIcons.map(i => ({
            name: i.name,
            folder: i.folder,
            unicode: `\\${i.unicodeHex}`,
            codepoint: parseInt(i.unicodeHex, 16),
            tags: i.tags,
            viewBox: i.viewBox,
          })),
        };
        zip.file(`manifest.json`, JSON.stringify(manifest, null, 2));
      }

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Trigger download
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${fontName}-icon-package.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Batch export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleOption = (key: keyof BatchExportOptions) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="neo-card-lg rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/80">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-100/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neo-pressed flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                Batch Export Icon Set
              </h2>
              <p className="text-xs text-slate-500">
                Generate ZIP archive containing TrueType fonts, SVGs, stylesheets, and React packages.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl neo-btn text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Scope Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Export Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOptions({ ...options, exportScope: 'all' })}
                className={`p-3 rounded-2xl text-left transition-all ${
                  options.exportScope === 'all'
                    ? 'neo-pressed border-2 border-blue-500/50 text-blue-600 dark:text-blue-400'
                    : 'neo-btn text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">All Icons</div>
                <div className="text-[11px] opacity-70">{icons.length} total glyphs</div>
              </button>

              <button
                type="button"
                onClick={() => setOptions({ ...options, exportScope: 'folder' })}
                className={`p-3 rounded-2xl text-left transition-all ${
                  options.exportScope === 'folder'
                    ? 'neo-pressed border-2 border-blue-500/50 text-blue-600 dark:text-blue-400'
                    : 'neo-btn text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">By Folder</div>
                <div className="text-[11px] opacity-70">Single category</div>
              </button>

              <button
                type="button"
                onClick={() => setOptions({ ...options, exportScope: 'selected' })}
                disabled={selectedIconIds.length === 0}
                className={`p-3 rounded-2xl text-left transition-all ${
                  options.exportScope === 'selected'
                    ? 'neo-pressed border-2 border-blue-500/50 text-blue-600 dark:text-blue-400'
                    : selectedIconIds.length === 0
                    ? 'opacity-40 cursor-not-allowed neo-card'
                    : 'neo-btn text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Selected Only</div>
                <div className="text-[11px] opacity-70">
                  {selectedIconIds.length} icon{selectedIconIds.length === 1 ? '' : 's'} checked
                </div>
              </button>
            </div>

            {/* Folder dropdown if scope is folder */}
            {options.exportScope === 'folder' && (
              <div className="pt-2">
                <select
                  value={options.selectedFolder}
                  onChange={(e) => setOptions({ ...options, selectedFolder: e.target.value })}
                  className="w-full neo-input rounded-xl px-3 py-2 text-xs font-medium"
                >
                  {folders.filter(f => f !== 'all').map(folder => (
                    <option key={folder} value={folder}>
                      Folder: {folder} ({icons.filter(i => i.folder === folder).length} glyphs)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Formats Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Include Package Assets
              </label>
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                {exportIcons.length} glyphs will be processed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* TTF */}
              <div
                onClick={() => toggleOption('includeTtf')}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all ${
                  options.includeTtf ? 'neo-pressed border border-blue-500/30' : 'neo-card opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg neo-pressed flex items-center justify-center text-blue-600">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">TrueType Font (.ttf)</div>
                    <div className="text-[10px] text-slate-400">Binary SFNT font file</div>
                  </div>
                </div>
                {options.includeTtf ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              </div>

              {/* CSS Webfont + demo */}
              <div
                onClick={() => toggleOption('includeCss')}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all ${
                  options.includeCss ? 'neo-pressed border border-blue-500/30' : 'neo-card opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg neo-pressed flex items-center justify-center text-purple-600">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">CSS Webfont & Demo</div>
                    <div className="text-[10px] text-slate-400">@font-face + demo.html</div>
                  </div>
                </div>
                {options.includeCss ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Individual SVGs */}
              <div
                onClick={() => toggleOption('includeIndividualSvgs')}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all ${
                  options.includeIndividualSvgs ? 'neo-pressed border border-blue-500/30' : 'neo-card opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg neo-pressed flex items-center justify-center text-emerald-600">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">SVGs in Folders</div>
                    <div className="text-[10px] text-slate-400">Preserved directories</div>
                  </div>
                </div>
                {options.includeIndividualSvgs ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              </div>

              {/* SVG Spritesheet */}
              <div
                onClick={() => toggleOption('includeSvgSprite')}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all ${
                  options.includeSvgSprite ? 'neo-pressed border border-blue-500/30' : 'neo-card opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg neo-pressed flex items-center justify-center text-amber-600">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">SVG Spritesheet</div>
                    <div className="text-[10px] text-slate-400">&lt;symbol&gt; sheet for web</div>
                  </div>
                </div>
                {options.includeSvgSprite ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              </div>

              {/* React Components */}
              <div
                onClick={() => toggleOption('includeReactComponents')}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all ${
                  options.includeReactComponents ? 'neo-pressed border border-blue-500/30' : 'neo-card opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg neo-pressed flex items-center justify-center text-cyan-600">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">React Components (.tsx)</div>
                    <div className="text-[10px] text-slate-400">TypeScript component kit</div>
                  </div>
                </div>
                {options.includeReactComponents ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              </div>

              {/* JSON Manifest */}
              <div
                onClick={() => toggleOption('includeJsonManifest')}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all ${
                  options.includeJsonManifest ? 'neo-pressed border border-blue-500/30' : 'neo-card opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg neo-pressed flex items-center justify-center text-rose-600">
                    <FolderArchive className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">JSON Manifest</div>
                    <div className="text-[10px] text-slate-400">Codepoints, tags, metadata</div>
                  </div>
                </div>
                {options.includeJsonManifest ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              </div>
            </div>
          </div>

          {/* Success banner */}
          {exportSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>ZIP package created and downloaded successfully!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200/50 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Font: <span className="font-bold text-slate-700 dark:text-slate-300">{settings.fontFamily}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl neo-btn text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting || exportIcons.length === 0}
              className="px-6 py-2.5 rounded-xl neo-btn-primary text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compiling ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download .ZIP ({exportIcons.length} glyphs)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
