import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Grid, 
  RotateCcw, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Check, 
  ExternalLink,
  ChevronRight,
  Bell,
  Search,
  Settings,
  Home,
  User,
  ShoppingBag
} from 'lucide-react';
import { IconItem, FontSettings } from '../types/icon';

interface ResponsivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  icons: IconItem[];
  settings: FontSettings;
  activeIconId?: string;
}

type DeviceMode = 'mobile-portrait' | 'mobile-landscape' | 'tablet' | 'desktop' | 'pixel-matrix';

export const ResponsivePreviewModal: React.FC<ResponsivePreviewModalProps> = ({
  isOpen,
  onClose,
  icons,
  settings,
  activeIconId,
}) => {
  if (!isOpen) return null;

  const [device, setDevice] = useState<DeviceMode>('mobile-portrait');
  const [previewDark, setPreviewDark] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'app-mockup' | 'pixel-matrix' | 'buttons'>('app-mockup');
  const [zoom, setZoom] = useState<number>(100);
  const [selectedIconId, setSelectedIconId] = useState<string>(activeIconId || icons[0]?.id || '');

  const currentIcon = icons.find(i => i.id === selectedIconId) || icons[0] || null;

  // Quick lookup of icon by name
  const findIcon = (names: string[]): IconItem => {
    for (const name of names) {
      const match = icons.find(i => i.name.toLowerCase().includes(name.toLowerCase()));
      if (match) return match;
    }
    return icons[0] || null;
  };

  const homeIcon = findIcon(['home', 'house']);
  const searchIcon = findIcon(['search', 'find']);
  const bellIcon = findIcon(['bell', 'notification']);
  const settingsIcon = findIcon(['settings', 'gear']);
  const bagIcon = findIcon(['shopping', 'bag', 'cart']);
  const userIcon = findIcon(['user', 'profile', 'camera']);
  const starIcon = currentIcon || findIcon(['zap', 'shield', 'check']);

  // Dimensions based on device
  const getDeviceDimensions = () => {
    switch (device) {
      case 'mobile-portrait':
        return { width: '380px', height: '680px', label: 'Mobile (380 × 680 portrait)' };
      case 'mobile-landscape':
        return { width: '680px', height: '380px', label: 'Mobile (680 × 380 landscape)' };
      case 'tablet':
        return { width: '740px', height: '620px', label: 'Tablet (740 × 620)' };
      case 'desktop':
        return { width: '920px', height: '560px', label: 'Desktop Viewport (920 × 560)' };
      case 'pixel-matrix':
        return { width: '100%', height: 'auto', label: 'Pixel Grid Matrix (16px - 128px)' };
      default:
        return { width: '380px', height: '680px', label: 'Mobile Portrait' };
    }
  };

  const dims = getDeviceDimensions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="neo-card-lg rounded-3xl w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/80">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/50 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-100/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neo-pressed flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Responsive Screen Inspector
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {dims.label}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Preview how your compiled SVG glyphs and webfont look across mobile, tablet, and desktop UI fixtures.
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl neo-btn text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Device Selectors & Controls */}
        <div className="p-3 sm:px-5 border-b border-slate-200/40 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/80 text-xs">
          {/* Device Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl neo-pressed overflow-x-auto max-w-full">
            <button
              onClick={() => setDevice('mobile-portrait')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                device === 'mobile-portrait' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Portrait</span>
            </button>

            <button
              onClick={() => setDevice('mobile-landscape')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                device === 'mobile-landscape' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 rotate-90" />
              <span className="hidden sm:inline">Mobile Landscape</span>
            </button>

            <button
              onClick={() => setDevice('tablet')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                device === 'tablet' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>

            <button
              onClick={() => setDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                device === 'desktop' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>

            <button
              onClick={() => setDevice('pixel-matrix')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                device === 'pixel-matrix' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Pixel Grid</span>
            </button>
          </div>

          {/* Right Controls: Active icon selector, In-preview theme & Zoom */}
          <div className="flex items-center gap-2">
            {/* Choose icon to preview */}
            <div className="flex items-center gap-1.5 neo-pressed px-2 py-1 rounded-xl">
              <span className="text-slate-400 font-semibold text-[11px] hidden sm:inline">Icon:</span>
              <select
                value={selectedIconId}
                onChange={(e) => setSelectedIconId(e.target.value)}
                className="bg-transparent border-0 font-bold text-xs text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[160px] truncate"
              >
                {icons.map((ic) => (
                  <option key={ic.id} value={ic.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    {ic.name} (\{ic.unicodeHex})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setPreviewDark(!previewDark)}
              className="p-1.5 rounded-xl neo-btn flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
              title="Toggle preview frame dark/light theme"
            >
              {previewDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span className="hidden sm:inline">{previewDark ? 'Dark Mockup' : 'Light Mockup'}</span>
            </button>

            <div className="flex items-center gap-1 p-0.5 rounded-xl neo-pressed">
              <button
                onClick={() => setZoom(Math.max(60, zoom - 15))}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 font-semibold text-slate-500">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(130, zoom + 15))}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Viewport Simulation Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-200/50 dark:bg-slate-950/60 min-h-[460px]">
          {device === 'pixel-matrix' ? (
            /* Pixel Grid Matrix View */
            <div className="w-full max-w-4xl space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  High-DPI Alignment & Optical Scalability Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect crisp pixel boundary rendering across standard UI sizes.
                </p>
              </div>

              <div className="space-y-6">
                {[16, 24, 32, 48, 64].map((size) => (
                  <div key={size} className="neo-card rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{size} × {size} pixels</span>
                      <span>Target: {size <= 20 ? 'Micro UI / Badges' : size <= 32 ? 'Navbars / Standard Controls' : 'Hero / Empty states'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      {icons.slice(0, 10).map((icon) => (
                        <div
                          key={icon.id}
                          className="flex flex-col items-center gap-1 group"
                          title={`${icon.name} (${size}px)`}
                        >
                          <div 
                            style={{ width: `${size}px`, height: `${size}px` }}
                            className="text-slate-800 dark:text-slate-100 flex items-center justify-center border border-slate-300/30 dark:border-slate-700/40 rounded p-0.5 group-hover:text-blue-500 transition-colors"
                            dangerouslySetInnerHTML={{ __html: icon.svgCode }}
                          />
                          <span className="text-[9px] font-mono text-slate-400 opacity-60 truncate max-w-[50px]">
                            {icon.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Device Frame with Realistic Mobile / Tablet / Desktop UI */
            <div
              style={{
                width: dims.width,
                height: dims.height,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center',
              }}
              className={`rounded-[36px] shadow-2xl border-4 ${
                previewDark 
                  ? 'bg-slate-900 text-slate-100 border-slate-800' 
                  : 'bg-white text-slate-800 border-slate-300'
              } flex flex-col overflow-hidden transition-all duration-200 relative select-none`}
            >
              {/* Device Status Bar */}
              <div className="px-6 py-2.5 flex items-center justify-between text-[11px] font-semibold border-b border-black/5 dark:border-white/5 opacity-80">
                <span>9:41</span>
                {/* Speaker notch on mobile portrait */}
                {device === 'mobile-portrait' && (
                  <div className="w-20 h-4 bg-black/80 rounded-full mx-auto" />
                )}
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Mock App Header */}
              <div className="px-5 py-3 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                    <span 
                      className="w-5 h-5 flex items-center justify-center" 
                      dangerouslySetInnerHTML={{ __html: starIcon?.svgCode || '' }} 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">GlyphForge App</h4>
                    <p className="text-[10px] text-slate-400 leading-none">Testing {settings.fontFamily}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500">
                    <span 
                      className="w-4 h-4 flex items-center justify-center" 
                      dangerouslySetInnerHTML={{ __html: searchIcon?.svgCode || '' }} 
                    />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 relative">
                    <span 
                      className="w-4 h-4 flex items-center justify-center" 
                      dangerouslySetInnerHTML={{ __html: bellIcon?.svgCode || '' }} 
                    />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                  </button>
                </div>
              </div>

              {/* Mock App Content Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Search Bar with icon */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                  <span 
                    className="w-4 h-4 text-slate-400 flex items-center justify-center" 
                    dangerouslySetInnerHTML={{ __html: searchIcon?.svgCode || '' }} 
                  />
                  <span className="text-slate-400">Search components, tokens...</span>
                </div>

                {/* Quick Action Grid */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Controls
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {icons.slice(0, 8).map((icon) => (
                      <div
                        key={icon.id}
                        className="p-2.5 rounded-xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center gap-1.5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer"
                      >
                        <div 
                          className="w-5 h-5 text-blue-600 dark:text-blue-400 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: icon.svgCode }}
                        />
                        <span className="text-[10px] font-medium truncate max-w-full text-center">
                          {icon.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Card with Icon Buttons */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Vector Font Preview</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">Active</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-snug">
                    Icons scale smoothly without pixelation across all display densities.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button className="px-3 py-1.5 rounded-lg bg-white text-blue-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span 
                        className="w-3.5 h-3.5 flex items-center justify-center" 
                        dangerouslySetInnerHTML={{ __html: bagIcon?.svgCode || '' }} 
                      />
                      <span>Action</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5">
                      <span 
                        className="w-3.5 h-3.5 flex items-center justify-center" 
                        dangerouslySetInnerHTML={{ __html: settingsIcon?.svgCode || '' }} 
                      />
                      <span>Setup</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mock Mobile Bottom Nav Bar with Icons */}
              <div className="px-4 py-2 border-t border-black/5 dark:border-white/5 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-around">
                <div className="flex flex-col items-center gap-0.5 text-blue-600 dark:text-blue-400 cursor-pointer">
                  <span 
                    className="w-5 h-5 flex items-center justify-center" 
                    dangerouslySetInnerHTML={{ __html: homeIcon?.svgCode || '' }} 
                  />
                  <span className="text-[9px] font-bold">Home</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <span 
                    className="w-5 h-5 flex items-center justify-center" 
                    dangerouslySetInnerHTML={{ __html: searchIcon?.svgCode || '' }} 
                  />
                  <span className="text-[9px]">Explore</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <span 
                    className="w-5 h-5 flex items-center justify-center" 
                    dangerouslySetInnerHTML={{ __html: bagIcon?.svgCode || '' }} 
                  />
                  <span className="text-[9px]">Store</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <span 
                    className="w-5 h-5 flex items-center justify-center" 
                    dangerouslySetInnerHTML={{ __html: settingsIcon?.svgCode || '' }} 
                  />
                  <span className="text-[9px]">Settings</span>
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="py-1 flex justify-center">
                <div className="w-28 h-1 bg-black/20 dark:bg-white/20 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200/50 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500">
            Testing {icons.length} glyphs with CSS prefix <code className="font-mono text-blue-600 font-bold">{settings.fontPrefix}*</code>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl neo-btn-primary font-bold shadow-sm"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
};
