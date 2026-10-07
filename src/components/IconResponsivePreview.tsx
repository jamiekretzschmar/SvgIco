import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Sun, 
  Moon, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  Eye, 
  Check, 
  Bell, 
  Search, 
  Home, 
  Settings, 
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  MoreVertical,
  Plus
} from 'lucide-react';
import { IconItem, ScreenPreviewSize } from '../types/icon';

interface IconResponsivePreviewProps {
  icon: IconItem;
  className?: string;
  defaultSize?: ScreenPreviewSize;
  allowThemeToggle?: boolean;
}

export const IconResponsivePreview: React.FC<IconResponsivePreviewProps> = ({
  icon,
  className = '',
  defaultSize = 'mobile-portrait',
  allowThemeToggle = true,
}) => {
  const [screenSize, setScreenSize] = useState<ScreenPreviewSize>(defaultSize);
  const [isDarkPreview, setIsDarkPreview] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeContext, setActiveContext] = useState<'app' | 'buttons' | 'grid'>('app');

  // Specs for predefined screen sizes
  const screenSpecs: Record<ScreenPreviewSize, { width: number; height: number; label: string; icon: any }> = {
    'mobile-portrait': { width: 375, height: 680, label: 'Mobile Portrait (375 × 680)', icon: Smartphone },
    'mobile-landscape': { width: 680, height: 375, label: 'Mobile Landscape (680 × 375)', icon: Smartphone },
    'tablet': { width: 720, height: 520, label: 'Tablet (720 × 520)', icon: Tablet },
    'desktop': { width: 880, height: 480, label: 'Desktop (880 × 480)', icon: Monitor },
  };

  const currentSpec = screenSpecs[screenSize];

  return (
    <div className={`flex flex-col neo-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 ${className}`}>
      {/* Control Header */}
      <div className="p-3 sm:px-4 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Screen size selectors */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl neo-pressed">
          {(Object.keys(screenSpecs) as ScreenPreviewSize[]).map((sizeKey) => {
            const spec = screenSpecs[sizeKey];
            const IconComp = spec.icon;
            const isSelected = screenSize === sizeKey;
            return (
              <button
                key={sizeKey}
                onClick={() => setScreenSize(sizeKey)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'neo-btn-primary shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
                title={spec.label}
              >
                <IconComp className={`w-3.5 h-3.5 ${sizeKey === 'mobile-landscape' ? 'rotate-90' : ''}`} />
                <span className="hidden sm:inline">
                  {sizeKey === 'mobile-portrait' && 'Portrait'}
                  {sizeKey === 'mobile-landscape' && 'Landscape'}
                  {sizeKey === 'tablet' && 'Tablet'}
                  {sizeKey === 'desktop' && 'Desktop'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center UI view toggle */}
        <div className="hidden md:flex items-center gap-1 p-0.5 rounded-xl neo-pressed text-[11px]">
          <button
            onClick={() => setActiveContext('app')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              activeContext === 'app' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            App Mockup
          </button>
          <button
            onClick={() => setActiveContext('buttons')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              activeContext === 'buttons' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Controls & Badges
          </button>
          <button
            onClick={() => setActiveContext('grid')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              activeContext === 'grid' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Optical Scales
          </button>
        </div>

        {/* Right tools: Dark/Light preview toggle & Zoom */}
        <div className="flex items-center gap-2">
          {allowThemeToggle && (
            <button
              onClick={() => setIsDarkPreview(!isDarkPreview)}
              className="px-2.5 py-1.5 rounded-xl neo-btn flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
              title="Toggle preview frame color theme"
            >
              {isDarkPreview ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xs:inline">Dark Frame</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden xs:inline">Light Frame</span>
                </>
              )}
            </button>
          )}

          {/* Zoom controls */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl neo-pressed">
            <button
              onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 font-semibold text-slate-500">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(130, zoomLevel + 15))}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewport Simulation Workspace */}
      <div className="flex-1 min-h-[420px] p-4 sm:p-6 bg-slate-200/50 dark:bg-slate-950/70 overflow-auto flex items-center justify-center">
        <div
          style={{
            width: `${currentSpec.width}px`,
            height: `${currentSpec.height}px`,
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center center',
          }}
          className={`rounded-[32px] shadow-2xl border-4 ${
            isDarkPreview
              ? 'bg-slate-900 text-slate-100 border-slate-800'
              : 'bg-white text-slate-800 border-slate-300'
          } flex flex-col overflow-hidden transition-all duration-200 select-none relative`}
        >
          {/* Status Bar for mobile */}
          {(screenSize === 'mobile-portrait' || screenSize === 'mobile-landscape') && (
            <div className="px-5 py-2 flex items-center justify-between text-[11px] font-semibold border-b border-black/5 dark:border-white/5 opacity-75">
              <span>9:41</span>
              {screenSize === 'mobile-portrait' && (
                <div className="w-20 h-4 bg-black/80 rounded-full mx-auto" />
              )}
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span>5G</span>
                <span>98%</span>
              </div>
            </div>
          )}

          {/* Desktop/Tablet window title bar */}
          {(screenSize === 'tablet' || screenSize === 'desktop') && (
            <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between text-xs opacity-75 bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-[10px] text-slate-400">workspace.app</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span>{currentSpec.label}</span>
              </div>
            </div>
          )}

          {/* Context 1: APP MOCKUP (Currently edited icon integrated as hero component) */}
          {activeContext === 'app' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top App Header */}
              <div className="px-4 py-2.5 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    {/* The edited icon in the top header */}
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <div 
                        className="w-4 h-4 flex items-center justify-center" 
                        dangerouslySetInnerHTML={{ __html: icon.svgCode }} 
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-none capitalize">{icon.name} Feature</h4>
                      <span className="text-[10px] text-slate-400 font-mono">\{icon.unicodeHex}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </div>
                </div>
              </div>

              {/* Main scrollable view inside the device */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {/* Hero Feature Banner featuring the edited icon */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                      Live Vector Render
                    </span>
                    <span className="text-xs font-mono opacity-80">Folder: {icon.folder}</span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {/* Primary enlarged hero display of currently edited icon */}
                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
                      <div 
                        className="w-7 h-7 flex items-center justify-center text-white" 
                        dangerouslySetInnerHTML={{ __html: icon.svgCode }} 
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold capitalize">{icon.name} Glyph</h3>
                      <p className="text-[11px] opacity-90 leading-tight">
                        Standardized 24×24 geometry ready for production web deployment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button className="px-3 py-1.5 rounded-lg bg-white text-blue-600 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <div className="w-3.5 h-3.5 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                      <span>Execute</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-semibold">
                      Configure
                    </button>
                  </div>
                </div>

                {/* KPI Cards / Micro fixtures containing the edited icon */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[10px] font-semibold">Action Trigger</span>
                      <div className="w-5 h-5 text-blue-500 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                    </div>
                    <div className="text-base font-bold">99.8%</div>
                    <div className="text-[10px] text-emerald-500 font-semibold">+14.2% vector accuracy</div>
                  </div>

                  <div className="p-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[10px] font-semibold">Glyph Status</span>
                      <div className="w-5 h-5 text-purple-500 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                    </div>
                    <div className="text-base font-bold">Active</div>
                    <div className="text-[10px] text-blue-500 font-mono">U+{icon.unicodeHex.toUpperCase()}</div>
                  </div>
                </div>

                {/* List item row adorned with the edited icon */}
                <div className="rounded-xl border border-black/5 dark:border-white/5 overflow-hidden text-xs">
                  <div className="p-2.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <div className="w-4 h-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                      </div>
                      <div>
                        <div className="font-semibold capitalize">{icon.name} Navigation Item</div>
                        <div className="text-[10px] text-slate-400">{icon.tags.slice(0, 3).join(', ')}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Mobile Bottom Tab Bar with Currently Edited Icon in the center! */}
              <div className="px-4 py-2 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-md flex items-center justify-around">
                <div className="flex flex-col items-center gap-0.5 text-slate-400 cursor-pointer">
                  <Home className="w-4 h-4" />
                  <span className="text-[9px]">Home</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 text-slate-400 cursor-pointer">
                  <Search className="w-4 h-4" />
                  <span className="text-[9px]">Explore</span>
                </div>

                {/* Center Highlighted Edited Icon */}
                <div className="flex flex-col items-center gap-0.5 text-blue-600 dark:text-blue-400 cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <div className="w-4 h-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                  </div>
                  <span className="text-[9px] font-bold capitalize">{icon.name}</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 text-slate-400 cursor-pointer">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-[9px]">Store</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 text-slate-400 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span className="text-[9px]">Setup</span>
                </div>
              </div>
            </div>
          )}

          {/* Context 2: BUTTONS & CONTROLS VARIATION */}
          {activeContext === 'buttons' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                Component System States
              </div>

              {/* Primary, Accent, Outlined Buttons with currently edited icon */}
              <div className="space-y-2">
                <div className="text-[11px] text-slate-500">Buttons with Left Icon:</div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 shadow-sm">
                    <div className="w-4 h-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                    <span>Primary Button</span>
                  </button>

                  <button className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold flex items-center gap-2 shadow-sm">
                    <div className="w-4 h-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                    <span>Accent Button</span>
                  </button>

                  <button className="px-4 py-2 rounded-xl border border-blue-500/40 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                    <span>Outlined Button</span>
                  </button>
                </div>
              </div>

              {/* Icon-Only Buttons */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] text-slate-500">Icon-Only Controls:</div>
                <div className="flex items-center gap-3">
                  <button className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
                    <div className="w-5 h-5 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                  </button>

                  <button className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300">
                    <div className="w-5 h-5 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                  </button>

                  <button className="p-2.5 rounded-full bg-rose-500 text-white shadow-md">
                    <div className="w-5 h-5 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                  </button>
                </div>
              </div>

              {/* Badges and Chips */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] text-slate-500">Filter Chips & Badges:</div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5 text-[11px]">
                    <div className="w-3.5 h-3.5 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                    <span>Active Filter</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
                    <div className="w-3.5 h-3.5 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon.svgCode }} />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Context 3: OPTICAL SCALES MATRIX */}
          {activeContext === 'grid' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-xs font-bold capitalize">{icon.name} Optical Size Inspection</h4>
                <p className="text-[11px] text-slate-400">Verifying stroke readability at small and large viewports</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[16, 20, 24, 32, 48, 64, 80, 96].map((size) => (
                  <div key={size} className="p-3 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center gap-2 text-center bg-black/[0.01] dark:bg-white/[0.01]">
                    <div
                      style={{ width: `${size}px`, height: `${size}px` }}
                      className="text-blue-600 dark:text-blue-400 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: icon.svgCode }}
                    />
                    <div className="text-[10px] font-mono text-slate-400">
                      {size}×{size}px
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer bar */}
      <div className="p-2.5 px-4 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>Current Context: <strong className="text-slate-700 dark:text-slate-300 capitalize">{activeContext}</strong></span>
        <span>Resolution: <code className="font-mono text-blue-600">{currentSpec.width}×{currentSpec.height}px</code></span>
      </div>
    </div>
  );
};
