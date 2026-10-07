import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  FolderTree, 
  Download, 
  Smartphone, 
  FileCode, 
  Layers, 
  Type, 
  Search, 
  FolderUp, 
  Sliders, 
  CheckCircle2, 
  Laptop, 
  Zap, 
  Palette,
  ShieldCheck,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { IconItem, FontSettings } from '../types/icon';

interface LandingPageProps {
  icons: IconItem[];
  settings: FontSettings;
  onEnterStudio: (folder?: string) => void;
  onOpenBatchExport: () => void;
  onOpenScreenPreview: () => void;
  onOpenSettings: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  icons,
  settings,
  onEnterStudio,
  onOpenBatchExport,
  onOpenScreenPreview,
  onOpenSettings,
}) => {
  const [activePreviewIcon, setActivePreviewIcon] = useState<IconItem>(icons[0] || null);
  const [previewScale, setPreviewScale] = useState<number>(32);
  const [tickerText, setTickerText] = useState<string>('GlyphForge Studio 2026');

  const sampleIcons = icons.slice(0, 14);

  return (
    <div className="min-h-screen py-6 px-3 sm:px-6 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8 text-center space-y-6">
        {/* Glow ambient background pill */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] bg-gradient-to-tr from-blue-500/15 via-purple-500/15 to-rose-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-pressed text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <span>Vector SVG & TrueType Font (TTF) Compiler</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 max-w-4xl mx-auto leading-tight">
          Craft Production <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">SVG & TTF</span> Icon Sets with Neomorphic Precision
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The all-in-one studio to design, organize by folders, test across screen sizes, and batch export production-ready vector glyphs, TrueType fonts, and React components.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={() => onEnterStudio()}
            className="px-6 py-3.5 rounded-2xl neo-btn-primary flex items-center gap-2.5 font-bold text-sm sm:text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <span>Open Icon Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenBatchExport}
            className="px-6 py-3.5 rounded-2xl neo-btn flex items-center gap-2.5 font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200 hover:text-blue-600"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Batch Export (.ttf & .svg)</span>
          </button>

          <button
            onClick={onOpenScreenPreview}
            className="px-5 py-3.5 rounded-2xl neo-btn flex items-center gap-2 font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200 hover:text-purple-600"
          >
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>Responsive Test</span>
          </button>
        </div>

        {/* Live Interactive Neomorphic Showcase Canvas */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="neo-card-lg rounded-3xl p-4 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 ml-2">
                  Interactive Glyph Sandbox • {settings.fontFamily}.ttf
                </span>
              </div>

              {/* Pixel size toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl neo-pressed text-xs">
                {[16, 24, 32, 48, 64].map((size) => (
                  <button
                    key={size}
                    onClick={() => setPreviewScale(size)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                      previewScale === size
                        ? 'neo-btn-primary shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-blue-500'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* Clickable glyph ribbon */}
            <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-14 gap-2.5">
              {sampleIcons.map((icon) => {
                const isSelected = activePreviewIcon?.id === icon.id;
                return (
                  <button
                    key={icon.id}
                    onClick={() => setActivePreviewIcon(icon)}
                    title={`${icon.name} (\\${icon.unicodeHex})`}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group ${
                      isSelected
                        ? 'neo-pressed border-2 border-blue-500/50 text-blue-600 dark:text-blue-400 scale-105'
                        : 'neo-btn text-slate-700 dark:text-slate-300 hover:text-blue-600'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110"
                      dangerouslySetInnerHTML={{ __html: icon.svgCode }}
                    />
                    <span className="text-[10px] font-mono opacity-60 truncate w-full text-center">
                      \{icon.unicodeHex}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Inspector card */}
            {activePreviewIcon && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/60">
                {/* Left: Scaled view */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl neo-pressed min-h-[160px] text-center">
                  <div 
                    style={{ width: `${previewScale}px`, height: `${previewScale}px` }}
                    className="text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-200"
                    dangerouslySetInnerHTML={{ __html: activePreviewIcon.svgCode }}
                  />
                  <div className="mt-3 text-xs font-mono text-slate-500">
                    Rendered at {previewScale}×{previewScale}px
                  </div>
                </div>

                {/* Right: Metadata details */}
                <div className="md:col-span-8 text-left space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>{activePreviewIcon.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                          U+{activePreviewIcon.unicodeHex.toUpperCase()}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">Folder: <span className="font-semibold text-slate-700 dark:text-slate-300">{activePreviewIcon.folder}</span></p>
                    </div>

                    <button
                      onClick={() => onEnterStudio(activePreviewIcon.folder)}
                      className="px-3 py-1.5 rounded-xl neo-btn text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                    >
                      <span>Edit in Studio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {activePreviewIcon.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full neo-pressed text-slate-600 dark:text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Quick Code Snippets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 truncate">
                      <span className="text-slate-400 font-sans">CSS: </span>
                      .{settings.fontPrefix}{activePreviewIcon.name}:before
                    </div>
                    <div className="p-2 rounded-lg bg-slate-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 truncate">
                      <span className="text-slate-400 font-sans">Glyph: </span>
                      &amp;#x{activePreviewIcon.unicodeHex};
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Engineered for Modern Web Workflows
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Everything you need to turn raw SVG vectors into complete web fonts and developer packages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Batch Export */}
          <div className="neo-card rounded-3xl p-6 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl neo-pressed flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Complete Batch Export Suite
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Export in one click as TrueType Font (.ttf), SVG Font, CSS Webfont stylesheet, standalone organized SVGs in a ZIP archive, SVG Spritesheet, and React TypeScript components.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">.ttf</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">.svg</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">.css</span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">React .tsx</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">.json</span>
            </div>
          </div>

          {/* Card 2: Responsive Screen Preview */}
          <div className="neo-card rounded-3xl p-6 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl neo-pressed flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Multi-Device Screen Previews
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Preview your icons in real device viewports: mobile portrait (iPhone / Android), tablet, desktop, and high-DPI pixel inspection grids from 16px to 128px with live interactive UI fixtures.
            </p>
            <button
              onClick={onOpenScreenPreview}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline pt-2"
            >
              <span>Launch Device Inspector</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Folders & Searchable Tags */}
          <div className="neo-card rounded-3xl p-6 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl neo-pressed flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FolderTree className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Folder Hierarchy & Fast Search
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Organize hundreds of glyphs into custom category folders. Every icon features searchable tags for instantaneous discovery when building UI kits or searching in code.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <Search className="w-3.5 h-3.5 text-emerald-500" />
              <span>Multi-token search by name, tag, or unicode</span>
            </div>
          </div>

          {/* Card 4: Directory Import */}
          <div className="neo-card rounded-3xl p-6 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl neo-pressed flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FolderUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Single & Directory Tree Import
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag-and-drop entire folder hierarchies directly from your local filesystem. Subfolder names are automatically mapped to categories and tags with zero manual sorting.
            </p>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold pt-1">
              • Recursive folder traversal with FileSystemEntry
            </div>
          </div>

          {/* Card 5: Neomorphic Tactile Design */}
          <div className="neo-card rounded-3xl p-6 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl neo-pressed flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Tactile Pressed Neomorphism
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Sculpted with physical bevels, soft inset shadows, and vibrant electric blue and violet primaries. Fully tuned for both Light and Dark themes with zero eye fatigue.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Primary bright color accents</span>
            </div>
          </div>

          {/* Card 6: AI Search Grounding */}
          <div className="neo-card rounded-3xl p-6 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl neo-pressed flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              AI & Search Grounding
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate missing icons on-demand using Gemini 2.5 Flash grounded with live Google Search. Query official brand geometry, tech standards, and modern SVG specifications.
            </p>
            <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold pt-1">
              • Google Search grounding verification
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="neo-card-lg rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            Ready to Build Your Custom Icon Library?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
            Start with the curated 40+ glyph starter set, import your existing SVGs or folders, and export production assets in seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onEnterStudio()}
            className="px-8 py-4 rounded-2xl neo-btn-primary font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <span>Launch Studio Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onOpenSettings}
            className="px-6 py-4 rounded-2xl neo-btn font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200"
          >
            Configure Webfont Settings
          </button>
        </div>
      </section>
    </div>
  );
};
