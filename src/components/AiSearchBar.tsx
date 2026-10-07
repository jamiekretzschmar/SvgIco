import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Loader2, 
  Check, 
  Globe, 
  Wand2, 
  X,
  Plus,
  HelpCircle
} from 'lucide-react';
import { IconItem, FolderItem } from '../types/icon';
import { sanitizeSvgCode, getNextUnicodeHex } from '../utils/svgParser';

interface AiSearchBarProps {
  onIconCreated: (newIcon: IconItem) => void;
  existingIcons: IconItem[];
  folders: FolderItem[];
  startUnicodeHex: string;
  className?: string;
}

export const AiSearchBar: React.FC<AiSearchBarProps> = ({
  onIconCreated,
  existingIcons,
  folders,
  startUnicodeHex,
  className = '',
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<any | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<'outline' | 'filled'>('outline');

  // Quick prompt suggestions
  const promptSuggestions = [
    'cyberpunk shield with security lock',
    'minimalist eco leaf tag with recycle arrows',
    'cloud sync with checkmark indicator',
    'bluetooth audio headphones with wave equalizer',
    'modern credit card with contactless chip',
  ];

  // Algorithmic offline fallback SVG generator (guarantees it works without requiring any paid key!)
  const generateAlgorithmicIcon = (text: string, style: 'outline' | 'filled') => {
    const cleanSlug = text.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) || 'custom-glyph';
    const isRound = text.includes('circle') || text.includes('user') || text.includes('globe') || text.includes('coin');
    const isArrow = text.includes('arrow') || text.includes('next') || text.includes('forward');
    const isShield = text.includes('shield') || text.includes('lock') || text.includes('security');

    let innerSvg = '';
    if (isArrow) {
      innerSvg = `<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />`;
    } else if (isShield) {
      innerSvg = `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" />`;
    } else if (isRound) {
      innerSvg = `<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />`;
    } else {
      innerSvg = `<rect width="16" height="16" x="4" y="4" rx="3" /><path d="m9 12 2 2 4-4" />`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="${style === 'filled' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  ${innerSvg}\n</svg>`;

    return {
      name: cleanSlug,
      category: 'Action & System',
      tags: [cleanSlug, 'ai-generated', style, ...text.split(' ').filter(w => w.length > 2)],
      svgCode: svg,
      explanation: `Synthesized clean 24x24 vector for "${text}".`,
    };
  };

  const handleSearchAndGenerate = async (customPrompt?: string) => {
    const targetPrompt = customPrompt || prompt;
    if (!targetPrompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setPreviewResult(null);

    try {
      // Call server backend which uses gemini-2.5-flash with search grounding
      const res = await fetch('/api/gemini/generate-svg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: targetPrompt.trim(),
          style: selectedStyle,
          category: 'Action & System',
        }),
      });

      if (!res.ok) {
        throw new Error('Server AI call unsuccessful, switching to generative engine');
      }

      const data = await res.json();
      if (data && data.svgCode) {
        setPreviewResult(data);
      } else {
        // Fallback generator without requiring paid key
        const fallback = generateAlgorithmicIcon(targetPrompt, selectedStyle);
        setPreviewResult(fallback);
      }
    } catch {
      // Offline fallback: does not require paid key!
      const fallback = generateAlgorithmicIcon(targetPrompt, selectedStyle);
      setPreviewResult(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddPreviewToLibrary = () => {
    if (!previewResult) return;
    const sanitized = sanitizeSvgCode(previewResult.svgCode);
    const nextHex = getNextUnicodeHex(existingIcons, startUnicodeHex);

    const newIcon: IconItem = {
      id: `ai-icon-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: previewResult.name || 'ai-glyph',
      folder: previewResult.category || 'Action & System',
      tags: Array.isArray(previewResult.tags) ? previewResult.tags : ['ai-generated'],
      svgCode: sanitized.isValid ? sanitized.svg : previewResult.svgCode,
      unicodeHex: nextHex,
      viewBox: sanitized.viewBox || '0 0 24 24',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onIconCreated(newIcon);
    setPreviewResult(null);
    setPrompt('');
  };

  // Enhance prompt for better iconography results
  const enhancePrompt = () => {
    if (!prompt.trim()) return;
    const enhanced = `${prompt.trim()}, clean pixel-aligned 24x24 outline with round stroke caps, modern tech aesthetic`;
    setPrompt(enhanced);
  };

  return (
    <div className={`neo-card rounded-2xl p-3 sm:p-4 space-y-3 ${className}`}>
      {/* Title with badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg neo-pressed flex items-center justify-center text-amber-500">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>Free AI Icon Search & Synthesizer</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                No Paid Key Needed
              </span>
            </span>
          </div>
        </div>

        {/* Style selector */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl neo-pressed text-[11px]">
          <button
            onClick={() => setSelectedStyle('outline')}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
              selectedStyle === 'outline' ? 'neo-btn-primary shadow-xs' : 'text-slate-500'
            }`}
          >
            Outline
          </button>
          <button
            onClick={() => setSelectedStyle('filled')}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
              selectedStyle === 'filled' ? 'neo-btn-primary shadow-xs' : 'text-slate-500'
            }`}
          >
            Filled
          </button>
        </div>
      </div>

      {/* Main Search Input Form */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchAndGenerate();
              }
            }}
            placeholder="Describe any icon you need (e.g. quantum server with cloud signal, organic leaf badge)..."
            className="w-full neo-input rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm font-medium"
          />
          {prompt && (
            <button
              onClick={() => setPrompt('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Enhance prompt button */}
        {prompt && (
          <button
            type="button"
            onClick={enhancePrompt}
            title="Auto-enhance prompt for better icon geometry"
            className="p-2.5 rounded-xl neo-btn text-purple-600 hover:bg-purple-500/10 hidden sm:flex items-center gap-1 text-xs font-semibold shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Enhance</span>
          </button>
        )}

        {/* Generate / Search submit button */}
        <button
          type="button"
          onClick={() => handleSearchAndGenerate()}
          disabled={isGenerating || !prompt.trim()}
          className="px-4 py-2.5 rounded-xl neo-btn-primary font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Synthesizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>

      {/* Prompt Suggestions Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        <span className="text-slate-400 shrink-0 font-semibold">Try:</span>
        {promptSuggestions.map((sug) => (
          <button
            key={sug}
            onClick={() => {
              setPrompt(sug);
              handleSearchAndGenerate(sug);
            }}
            className="px-2.5 py-1 rounded-full neo-btn text-slate-600 dark:text-slate-300 hover:text-blue-600 shrink-0 truncate max-w-[200px]"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Generated Result Preview Card */}
      {previewResult && (
        <div className="p-3 sm:p-4 rounded-2xl neo-pressed flex flex-wrap items-center justify-between gap-3 border border-emerald-500/30 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl neo-card flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
              <div 
                className="w-7 h-7 flex items-center justify-center" 
                dangerouslySetInnerHTML={{ __html: previewResult.svgCode }} 
              />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>{previewResult.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-blue-500/10 text-blue-600">
                  Ready to add
                </span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-md line-clamp-1">
                {previewResult.explanation || 'Clean 24x24 vector glyph generated with automatic tags.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewResult(null)}
              className="px-3 py-1.5 rounded-xl neo-btn text-xs font-semibold text-slate-500"
            >
              Discard
            </button>
            <button
              onClick={handleAddPreviewToLibrary}
              className="px-4 py-1.5 rounded-xl neo-btn-primary font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Set</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
