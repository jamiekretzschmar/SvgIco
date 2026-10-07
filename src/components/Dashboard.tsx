import React, { useState, useRef, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  FolderTree, 
  Tag, 
  FolderPlus, 
  Filter, 
  Sliders, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Upload, 
  Grid, 
  Maximize2, 
  X, 
  CheckSquare, 
  Square, 
  Code, 
  Layers, 
  Globe, 
  ExternalLink, 
  ChevronRight,
  FolderUp,
  RefreshCw,
  Loader2,
  Eye,
  FileCode,
  SlidersHorizontal,
  ChevronDown,
  Smartphone,
  Compass
} from 'lucide-react';
import { IconItem, FolderItem, FontSettings, SearchGroundingResult } from '../types/icon';
import { sanitizeSvgCode, parseIconMetadataFromFileName, getNextUnicodeHex, scanDroppedEntries } from '../utils/svgParser';
import { IconResponsivePreview } from './IconResponsivePreview';
import { AdvancedSvgEditor } from './AdvancedSvgEditor';
import { AiSearchBar } from './AiSearchBar';

interface DashboardProps {
  icons: IconItem[];
  setIcons: React.Dispatch<React.SetStateAction<IconItem[]>>;
  folders: FolderItem[];
  setFolders: React.Dispatch<React.SetStateAction<FolderItem[]>>;
  settings: FontSettings;
  selectedIconIds: string[];
  setSelectedIconIds: React.Dispatch<React.SetStateAction<string[]>>;
  openBatchExport: () => void;
  openScreenPreview: () => void;
  initialFolderFilter?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  icons,
  setIcons,
  folders,
  setFolders,
  settings,
  selectedIconIds,
  setSelectedIconIds,
  openBatchExport,
  openScreenPreview,
  initialFolderFilter = 'all',
}) => {
  // Navigation & filter state
  const [activeFolder, setActiveFolder] = useState<string>(initialFolderFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [density, setDensity] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);

  // Mobile drawer states
  const [isMobileFolderDrawerOpen, setIsMobileFolderDrawerOpen] = useState<boolean>(false);

  // Inspector & Editor Drawer state
  const [editingIcon, setEditingIcon] = useState<IconItem | null>(null);
  const [editorSvgCode, setEditorSvgCode] = useState<string>('');
  const [editorName, setEditorName] = useState<string>('');
  const [editorFolder, setEditorFolder] = useState<string>('');
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editorSubTab, setEditorSubTab] = useState<'preview' | 'vector' | 'code'>('preview');

  // AI & Search Grounding drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiStyle, setAiStyle] = useState<'outline' | 'filled'>('outline');
  const [aiCategory, setAiCategory] = useState<string>('Action & System');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [searchGroundingResult, setSearchGroundingResult] = useState<SearchGroundingResult | null>(null);
  const [isSearchingGrounding, setIsSearchingGrounding] = useState<boolean>(false);

  // New Icon Modal state
  const [isNewIconModalOpen, setIsNewIconModalOpen] = useState<boolean>(false);
  const [newIconName, setNewIconName] = useState<string>('');
  const [newIconFolder, setNewIconFolder] = useState<string>('Navigation');
  const [newIconTags, setNewIconTags] = useState<string>('');
  const [newIconSvg, setNewIconSvg] = useState<string>('');

  // New Folder Modal state
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderColor, setNewFolderColor] = useState<string>('#3b82f6');

  // Drag and drop state
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);

  // Collect all unique tags for quick filter chips
  const allUniqueTags = useMemo(() => {
    const tagsMap = new Map<string, number>();
    icons.forEach(i => {
      i.tags.forEach(t => {
        const lower = t.toLowerCase();
        tagsMap.set(lower, (tagsMap.get(lower) || 0) + 1);
      });
    });
    return Array.from(tagsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([tag]) => tag);
  }, [icons]);

  // Filtered icons
  const filteredIcons = useMemo(() => {
    return icons.filter(icon => {
      // Folder filter
      if (activeFolder !== 'all' && icon.folder !== activeFolder) {
        return false;
      }
      // Tag filter
      if (selectedTag && !icon.tags.map(t => t.toLowerCase()).includes(selectedTag.toLowerCase())) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = icon.name.toLowerCase().includes(query);
        const matchesTags = icon.tags.some(t => t.toLowerCase().includes(query));
        const matchesFolder = icon.folder.toLowerCase().includes(query);
        const matchesUnicode = icon.unicodeHex.toLowerCase().includes(query) || `\\${icon.unicodeHex}`.includes(query);
        return matchesName || matchesTags || matchesFolder || matchesUnicode;
      }
      return true;
    });
  }, [icons, activeFolder, selectedTag, searchQuery]);

  // Open icon inspector
  const handleEditIcon = (icon: IconItem) => {
    setEditingIcon(icon);
    setEditorSvgCode(icon.svgCode);
    setEditorName(icon.name);
    setEditorFolder(icon.folder);
    setEditorTags([...icon.tags]);
  };

  // Save changes to editing icon
  const handleSaveEditor = () => {
    if (!editingIcon) return;
    const sanitized = sanitizeSvgCode(editorSvgCode);
    if (!sanitized.isValid) return;

    setIcons(prev => prev.map(item => {
      if (item.id === editingIcon.id) {
        return {
          ...item,
          name: editorName.trim() || item.name,
          folder: editorFolder,
          tags: editorTags,
          svgCode: sanitized.svg,
          viewBox: sanitized.viewBox,
          updatedAt: Date.now(),
        };
      }
      return item;
    }));

    setEditingIcon(null);
  };

  // Delete icon
  const handleDeleteIcon = (id: string) => {
    setIcons(prev => prev.filter(i => i.id !== id));
    setSelectedIconIds(prev => prev.filter(selectedId => selectedId !== id));
    if (editingIcon?.id === id) {
      setEditingIcon(null);
    }
  };

  // Copy SVG or CSS
  const handleCopySvg = (icon: IconItem) => {
    navigator.clipboard.writeText(icon.svgCode);
    setCopiedId(icon.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIconIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select all visible
  const handleSelectAllVisible = () => {
    const visibleIds = filteredIcons.map(i => i.id);
    const allSelected = visibleIds.every(id => selectedIconIds.includes(id));
    if (allSelected) {
      setSelectedIconIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIconIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Add tag to editing icon
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim().toLowerCase();
    if (!editorTags.includes(tag)) {
      setEditorTags(prev => [...prev, tag]);
    }
    setNewTagInput('');
  };

  // Remove tag from editing icon
  const handleRemoveTag = (tagToRemove: string) => {
    setEditorTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Handle Drag and Drop for single files or entire directory trees
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (e.dataTransfer.items) {
      const scanned = await scanDroppedEntries(e.dataTransfer.items);
      if (scanned.length > 0) {
        const newIcons: IconItem[] = [];
        const discoveredFolders = new Set<string>();
        let currentNextHex = getNextUnicodeHex(icons, settings.startUnicodeHex);

        for (let i = 0; i < scanned.length; i++) {
          const item = scanned[i];
          const text = await item.file.text();
          const sanitized = sanitizeSvgCode(text);
          if (!sanitized.isValid) continue;

          const assignedFolder = item.folder || 'Imported';
          discoveredFolders.add(assignedFolder);
          const meta = parseIconMetadataFromFileName(item.file.name, assignedFolder);

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
          setFolders(prev => {
            const existingNames = new Set(prev.map(f => f.name));
            const updated = [...prev];
            discoveredFolders.forEach(df => {
              if (!existingNames.has(df)) {
                updated.push({
                  id: df,
                  name: df,
                  color: '#3b82f6',
                  description: 'Imported folder',
                });
              }
            });
            return updated;
          });

          setIcons(prev => [...prev, ...newIcons]);
        }
      }
    }
  };

  // Call Server-side Search Grounding with Gemini 2.5 Flash
  const handlePerformSearchGrounding = async () => {
    if (!aiPrompt.trim()) return;
    setIsSearchingGrounding(true);
    setSearchGroundingResult(null);

    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiPrompt.trim() }),
      });

      if (!res.ok) throw new Error('Search Grounding failed');
      const data = await res.json();
      setSearchGroundingResult(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSearchingGrounding(false);
    }
  };

  // Generate SVG Icon with AI (Gemini 2.5 Flash + Search Grounding)
  const handleGenerateAiIcon = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/gemini/generate-svg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          style: aiStyle,
          category: aiCategory,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate icon');
      }

      const data = await res.json();
      if (!data.svgCode) throw new Error('No SVG returned from model');

      const sanitized = sanitizeSvgCode(data.svgCode);
      const nextHex = getNextUnicodeHex(icons, settings.startUnicodeHex);

      const createdIcon: IconItem = {
        id: `icon-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: data.name || aiPrompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20),
        folder: data.category || aiCategory || 'Custom',
        tags: Array.isArray(data.tags) ? data.tags : [aiPrompt.toLowerCase(), 'ai-generated'],
        svgCode: sanitized.svg,
        unicodeHex: nextHex,
        viewBox: sanitized.viewBox,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Ensure category exists
      if (!folders.some(f => f.name === createdIcon.folder)) {
        setFolders(prev => [...prev, { id: createdIcon.folder, name: createdIcon.folder, color: '#06b6d4' }]);
      }

      setIcons(prev => [createdIcon, ...prev]);
      setActiveFolder(createdIcon.folder);
      handleEditIcon(createdIcon);
    } catch (err: any) {
      setAiError(err.message || 'Failed to generate SVG icon');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Add custom new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const cleanName = newFolderName.trim();
    if (!folders.some(f => f.name.toLowerCase() === cleanName.toLowerCase())) {
      setFolders(prev => [
        ...prev,
        {
          id: cleanName,
          name: cleanName,
          color: newFolderColor,
          description: 'User created category',
        }
      ]);
      setActiveFolder(cleanName);
    }
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
  };

  // Add custom new icon manually
  const handleCreateNewIcon = () => {
    if (!newIconName.trim()) return;
    const sanitized = sanitizeSvgCode(newIconSvg);
    const nextHex = getNextUnicodeHex(icons, settings.startUnicodeHex);

    const tags = newIconTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const newIcon: IconItem = {
      id: `icon-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: newIconName.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      folder: newIconFolder,
      tags: tags.length > 0 ? tags : [newIconName.toLowerCase()],
      svgCode: sanitized.isValid 
        ? sanitized.svg 
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`,
      unicodeHex: nextHex,
      viewBox: sanitized.viewBox || '0 0 24 24',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setIcons(prev => [newIcon, ...prev]);
    setIsNewIconModalOpen(false);
    setNewIconName('');
    setNewIconSvg('');
    setNewIconTags('');
    handleEditIcon(newIcon);
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      className={`min-h-[calc(100vh-80px)] py-4 px-2 sm:px-6 max-w-7xl mx-auto space-y-4 relative ${
        isDraggingOver ? 'ring-4 ring-blue-500/50 rounded-3xl' : ''
      }`}
    >
      {/* Hidden file and folder pickers */}
      <input
        type="file"
        ref={singleFileInputRef}
        onChange={async (e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          const newItems: IconItem[] = [];
          let curHex = getNextUnicodeHex(icons, settings.startUnicodeHex);
          for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const text = await f.text();
            const san = sanitizeSvgCode(text);
            if (!san.isValid) continue;
            const meta = parseIconMetadataFromFileName(f.name);
            newItems.push({
              id: `icon-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
              name: meta.name,
              folder: activeFolder !== 'all' ? activeFolder : 'Imported',
              tags: meta.tags,
              svgCode: san.svg,
              unicodeHex: curHex,
              viewBox: san.viewBox,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
            curHex = (parseInt(curHex, 16) + 1).toString(16).toLowerCase();
          }
          if (newItems.length > 0) setIcons(prev => [...newItems, ...prev]);
          if (singleFileInputRef.current) singleFileInputRef.current.value = '';
        }}
        accept=".svg"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={dirInputRef}
        onChange={async (e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          const newItems: IconItem[] = [];
          const discovered = new Set<string>();
          let curHex = getNextUnicodeHex(icons, settings.startUnicodeHex);
          for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const rel = f.webkitRelativePath || f.name;
            const parts = rel.split('/');
            let folderName = 'Imported';
            if (parts.length > 1) {
              folderName = parts[parts.length - 2];
              folderName = folderName.charAt(0).toUpperCase() + folderName.slice(1);
            }
            discovered.add(folderName);
            const text = await f.text();
            const san = sanitizeSvgCode(text);
            if (!san.isValid) continue;
            const meta = parseIconMetadataFromFileName(f.name, folderName);
            newItems.push({
              id: `icon-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
              name: meta.name,
              folder: folderName,
              tags: meta.tags,
              svgCode: san.svg,
              unicodeHex: curHex,
              viewBox: san.viewBox,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
            curHex = (parseInt(curHex, 16) + 1).toString(16).toLowerCase();
          }
          if (newItems.length > 0) {
            setFolders(prev => {
              const names = new Set(prev.map(p => p.name));
              const next = [...prev];
              discovered.forEach(d => {
                if (!names.has(d)) {
                  next.push({ id: d, name: d, color: '#3b82f6' });
                }
              });
              return next;
            });
            setIcons(prev => [...newItems, ...prev]);
          }
          if (dirInputRef.current) dirInputRef.current.value = '';
        }}
        // @ts-ignore
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
      />

      {/* Drag & Drop Visual Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-40 bg-blue-600/10 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 border-4 border-dashed border-blue-500 pointer-events-none text-center">
          <FolderUp className="w-16 h-16 text-blue-600 animate-bounce mb-3" />
          <h3 className="text-xl font-extrabold text-blue-700 dark:text-blue-300">
            Drop SVG Files or Directory Hierarchy
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Folder structure and tags will be automatically extracted!
          </p>
        </div>
      )}

      {/* Free AI Icon Search & Synthesizer Bar (No paid key needed) */}
      <AiSearchBar
        existingIcons={icons}
        folders={folders}
        startUnicodeHex={settings.startUnicodeHex}
        onIconCreated={(newIcon) => {
          setIcons((prev) => [newIcon, ...prev]);
          setActiveFolder(newIcon.folder);
          handleEditIcon(newIcon);
        }}
      />

      {/* Top Studio Control Bar */}
      <div className="neo-card rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons, tags (#arrow), unicode (\\e900), or folder..."
              className="w-full neo-input rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* AI Icon Generator Drawer toggle */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="px-3 py-2 rounded-xl neo-btn-accent text-white flex items-center gap-1.5 text-xs font-bold shadow-sm"
              title="Generate SVG with Gemini 2.5 Flash and Google Search Grounding"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI Icon Maker</span>
            </button>

            {/* Import Button Dropdown / Single or Folder */}
            <button
              onClick={() => singleFileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl neo-btn text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
              title="Import single or multiple SVGs"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Import SVGs</span>
              <span className="sm:hidden">Import</span>
            </button>

            <button
              onClick={() => dirInputRef.current?.click()}
              className="px-3 py-2 rounded-xl neo-btn text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
              title="Import entire directory structure with preserved folders"
            >
              <FolderTree className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden md:inline">Import Folder Tree</span>
            </button>

            {/* New Custom Icon */}
            <button
              onClick={() => setIsNewIconModalOpen(true)}
              className="px-3 py-2 rounded-xl neo-btn text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">New Glyph</span>
            </button>

            {/* Density switch */}
            <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-xl neo-pressed text-xs">
              {(['compact', 'normal', 'spacious'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`px-2 py-1 rounded-lg capitalize text-[11px] font-medium transition-all ${
                    density === d ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Selection Mode Toggle */}
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSelectionMode
                  ? 'neo-pressed border border-blue-500/40 text-blue-600 dark:text-blue-400'
                  : 'neo-btn text-slate-700 dark:text-slate-300'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Select Mode</span>
            </button>
          </div>
        </div>

        {/* Mobile & Desktop Tag Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3 text-purple-500" />
            <span>Tags:</span>
          </span>

          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
              selectedTag === null ? 'neo-btn-primary shadow-xs' : 'neo-btn text-slate-600 dark:text-slate-300'
            }`}
          >
            All Tags
          </button>

          {allUniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                selectedTag === tag ? 'neo-btn-primary shadow-xs' : 'neo-btn text-slate-600 dark:text-slate-300'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Layout: Left Sidebar + Icon Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Sidebar: Folders List & Dropzone (Desktop or Mobile drawer toggle) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="neo-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <FolderTree className="w-4 h-4 text-blue-600" />
                <span>Folders ({folders.length - 1})</span>
              </div>

              <button
                onClick={() => setIsNewFolderModalOpen(true)}
                className="p-1.5 rounded-lg neo-btn text-slate-600 hover:text-blue-600"
                title="Create new folder"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Folder Items List */}
            <div className="space-y-1 text-xs">
              {folders.map(folder => {
                const isSelected = activeFolder === folder.name || (folder.id === 'all' && activeFolder === 'all');
                const count = folder.id === 'all' 
                  ? icons.length 
                  : icons.filter(i => i.folder === folder.name).length;

                return (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolder(folder.id === 'all' ? 'all' : folder.name)}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between transition-all text-left ${
                      isSelected
                        ? 'neo-pressed font-bold text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        style={{ backgroundColor: folder.color }}
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                      />
                      <span className="truncate">{folder.name}</span>
                    </div>

                    <span className="font-mono text-[11px] opacity-70 px-1.5 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800/50">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Directory drag-and-drop info widget */}
          <div className="neo-card-sm rounded-2xl p-4 text-center space-y-2 text-xs">
            <FolderUp className="w-8 h-8 text-blue-500 mx-auto" />
            <div className="font-bold text-slate-800 dark:text-slate-200">
              Drag & Drop Directory
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Drop an icon folder directly anywhere on the screen to automatically parse and sort into categories.
            </p>
          </div>
        </div>

        {/* Right Area: Icon Grid View */}
        <div className="lg:col-span-9 space-y-4">
          {/* Header Bar of Grid */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {activeFolder === 'all' ? 'All Glyphs' : activeFolder}
              </span>
              <span className="text-slate-400">
                ({filteredIcons.length} of {icons.length})
              </span>
              {selectedTag && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center gap-1 font-semibold">
                  #{selectedTag}
                  <X onClick={() => setSelectedTag(null)} className="w-3 h-3 cursor-pointer" />
                </span>
              )}
            </div>

            {/* Selection actions if items selected */}
            {selectedIconIds.length > 0 && (
              <div className="flex items-center gap-2 p-1 rounded-xl neo-pressed animate-fade-in">
                <span className="text-xs font-semibold text-blue-600 px-2 font-mono">
                  {selectedIconIds.length} selected
                </span>
                <button
                  onClick={openBatchExport}
                  className="px-2.5 py-1 rounded-lg neo-btn-primary text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => {
                    setIcons(prev => prev.filter(i => !selectedIconIds.includes(i.id)));
                    setSelectedIconIds([]);
                  }}
                  className="px-2.5 py-1 rounded-lg neo-btn text-xs font-bold text-rose-600 hover:bg-rose-500/10 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Grid of Icons */}
          {filteredIcons.length === 0 ? (
            <div className="neo-card rounded-3xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl neo-pressed flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No Glyphs Match Current Filter
                </h3>
                <p className="text-xs text-slate-500">
                  Try clearing search terms or import new SVGs into this folder.
                </p>
              </div>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTag(null); setActiveFolder('all'); }}
                className="px-4 py-2 rounded-xl neo-btn text-xs font-semibold text-blue-600"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-3 transition-all ${
                density === 'compact'
                  ? 'grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'
                  : density === 'spacious'
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4'
                  : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
              }`}
            >
              {filteredIcons.map((icon) => {
                const isSelected = selectedIconIds.includes(icon.id);
                return (
                  <div
                    key={icon.id}
                    className={`neo-card rounded-2xl p-3 flex flex-col items-center justify-between gap-2 transition-all relative group select-none hover:-translate-y-0.5 ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
                    }`}
                  >
                    {/* Checkbox for selection */}
                    {(isSelectionMode || isSelected) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleSelect(icon.id); }}
                        className="absolute top-2 left-2 z-10 p-1 rounded-md bg-white/80 dark:bg-slate-900/80 shadow-xs"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    )}

                    {/* Quick action buttons on top right */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopySvg(icon); }}
                        title="Copy SVG XML"
                        className="p-1 rounded-lg neo-btn text-slate-500 hover:text-blue-600"
                      >
                        {copiedId === icon.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditIcon(icon); }}
                        title="Edit SVG in Studio"
                        className="p-1 rounded-lg neo-btn text-slate-500 hover:text-purple-600"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* SVG Glyph preview container */}
                    <div
                      onClick={() => handleEditIcon(icon)}
                      className="w-full aspect-square rounded-xl neo-pressed flex items-center justify-center p-3 text-slate-800 dark:text-slate-100 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      <div 
                        className="w-7 h-7 flex items-center justify-center transition-transform group-hover:scale-110"
                        dangerouslySetInnerHTML={{ __html: icon.svgCode }}
                      />
                    </div>

                    {/* Icon details */}
                    <div className="w-full text-center space-y-0.5">
                      <div 
                        onClick={() => handleEditIcon(icon)}
                        className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate cursor-pointer hover:underline"
                        title={icon.name}
                      >
                        {icon.name}
                      </div>

                      <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400">
                        <span>\{icon.unicodeHex}</span>
                        <span>•</span>
                        <span className="truncate max-w-[60px]">{icon.folder}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT DRAWER: Icon Inspector & SVG Code Editor */}
      {editingIcon && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[560px] lg:w-[640px] bg-slate-100 dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-left">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg neo-pressed flex items-center justify-center text-blue-600">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span>Glyph Studio: {editorName}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600">
                    \{editingIcon.unicodeHex}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Folder: {editorFolder} • 24×24 Vector
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditingIcon(null)}
              className="p-1.5 rounded-lg neo-btn text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subtab Switcher: Preview, Vector Studio, Code & Meta */}
          <div className="px-4 py-2 border-b border-slate-200/50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 p-0.5 rounded-xl neo-pressed w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setEditorSubTab('preview')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  editorSubTab === 'preview' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Responsive Previews</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorSubTab('vector')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  editorSubTab === 'vector' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Advanced Vector Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorSubTab('code')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  editorSubTab === 'code' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>XML & Tags</span>
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* SUBTAB 1: RESPONSIVE SCREEN PREVIEW */}
            {editorSubTab === 'preview' && (
              <div className="space-y-3">
                <div className="text-slate-500 text-xs">
                  Inspect <strong className="text-slate-700 dark:text-slate-300">{editorName}</strong> rendered inside simulated mobile portrait, landscape, tablet, and desktop viewports with independent theme switching.
                </div>
                <IconResponsivePreview
                  icon={{
                    ...editingIcon,
                    name: editorName,
                    folder: editorFolder,
                    tags: editorTags,
                    svgCode: editorSvgCode,
                  }}
                  defaultSize="mobile-portrait"
                />
              </div>
            )}

            {/* SUBTAB 2: ADVANCED VECTOR & PATH STUDIO */}
            {editorSubTab === 'vector' && (
              <div className="space-y-3">
                <div className="text-slate-500 text-xs">
                  Touch & mouse vector path editor: adjust anchor coordinates, convert between sharp/smooth curves, execute boolean shape operations, and apply linear or radial gradients.
                </div>
                <AdvancedSvgEditor
                  initialSvg={editorSvgCode}
                  onSvgChange={(newSvg) => setEditorSvgCode(newSvg)}
                  iconName={editorName}
                />
              </div>
            )}

            {/* SUBTAB 3: XML MARKUP, TAGS & FOLDER */}
            {editorSubTab === 'code' && (
              <div className="space-y-4">
                {/* Live Visual Canvas */}
                <div className="neo-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative">
                  <div 
                    className="w-16 h-16 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform hover:scale-110"
                    dangerouslySetInnerHTML={{ __html: editorSvgCode }}
                  />
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400">
                    ViewBox: {editingIcon.viewBox}
                  </div>
                </div>

                {/* Icon Name & Folder */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 dark:text-slate-300">
                      Icon Slug Name
                    </label>
                    <input
                      type="text"
                      value={editorName}
                      onChange={(e) => setEditorName(e.target.value)}
                      className="w-full neo-input rounded-xl px-3 py-2 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 dark:text-slate-300">
                      Category Folder
                    </label>
                    <select
                      value={editorFolder}
                      onChange={(e) => setEditorFolder(e.target.value)}
                      className="w-full neo-input rounded-xl px-3 py-2 text-xs font-medium"
                    >
                      {folders.filter(f => f.id !== 'all').map(f => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tag Cloud Manager */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Searchable Tags</span>
                    <span className="text-[10px] text-slate-400">For fast lookup</span>
                  </label>

                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl neo-pressed min-h-[44px]">
                    {editorTags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-medium flex items-center gap-1"
                      >
                        #{tag}
                        <X
                          onClick={() => handleRemoveTag(tag)}
                          className="w-3 h-3 cursor-pointer hover:text-rose-500"
                        />
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                      placeholder="Add tag and press Enter..."
                      className="flex-1 neo-input rounded-xl px-3 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 rounded-xl neo-btn font-semibold text-xs text-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Raw SVG Code Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-blue-600" />
                      <span>SVG XML Markup</span>
                    </label>
                    <button
                      onClick={() => handleCopySvg(editingIcon)}
                      className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    value={editorSvgCode}
                    onChange={(e) => setEditorSvgCode(e.target.value)}
                    className="w-full neo-input rounded-xl p-3 font-mono text-[11px] leading-relaxed resize-y"
                  />
                </div>

                {/* Quick Webfont Integration Snippets */}
                <div className="p-3 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                    Webfont CSS Class
                  </div>
                  <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400 select-all">
                    &lt;i class="{settings.fontPrefix}{editorName}"&gt;&lt;/i&gt;
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    Glyph Escape: \{editingIcon.unicodeHex}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => handleDeleteIcon(editingIcon.id)}
              className="px-3 py-2 rounded-xl neo-btn text-rose-600 text-xs font-semibold flex items-center gap-1 hover:bg-rose-500/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingIcon(null)}
                className="px-3 py-2 rounded-xl neo-btn text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEditor}
                className="px-5 py-2 rounded-xl neo-btn-primary font-bold text-xs shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT DRAWER: AI Icon Maker & Search Grounding */}
      {isAiDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-100 dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-left">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg neo-pressed flex items-center justify-center text-amber-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  AI Icon Studio with Search Grounding
                </h3>
                <p className="text-[10px] text-slate-400">
                  Powered by Gemini 2.5 Flash + Google Search
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="p-1.5 rounded-lg neo-btn text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Icon Description or Brand Name
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Next.js lightning logo, shopping cart with tag, crypto Bitcoin coin, modern cloud sync..."
                className="w-full neo-input rounded-xl p-3 text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Style</label>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value as any)}
                  className="w-full neo-input rounded-xl px-3 py-2 text-xs"
                >
                  <option value="outline">Clean Outline (2px Stroke)</option>
                  <option value="filled">Filled Silhouette</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Folder</label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  className="w-full neo-input rounded-xl px-3 py-2 text-xs"
                >
                  {folders.filter(f => f.id !== 'all').map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grounding Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handlePerformSearchGrounding}
                disabled={isSearchingGrounding || !aiPrompt.trim()}
                className="flex-1 py-2.5 rounded-xl neo-btn font-semibold text-xs flex items-center justify-center gap-1.5 text-blue-600 disabled:opacity-50"
              >
                {isSearchingGrounding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                <span>Google Search Grounding</span>
              </button>

              <button
                onClick={handleGenerateAiIcon}
                disabled={isGeneratingAi || !aiPrompt.trim()}
                className="flex-1 py-2.5 rounded-xl neo-btn-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {isGeneratingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate SVG</span>
              </button>
            </div>

            {/* Error Message */}
            {aiError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-medium">
                {aiError}
              </div>
            )}

            {/* Search Grounding Details Card */}
            {searchGroundingResult && (
              <div className="neo-card rounded-2xl p-4 space-y-3 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Search Grounding Insights</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Live Web Data</span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {searchGroundingResult.summary}
                </div>

                {/* Grounding sources links */}
                {searchGroundingResult.sources && searchGroundingResult.sources.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Grounding Sources:</div>
                    <div className="space-y-1">
                      {searchGroundingResult.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW ICON MODAL */}
      {isNewIconModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="neo-card-lg rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Create New Vector Glyph</span>
              </h3>
              <button onClick={() => setIsNewIconModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Glyph Name (Slug)</label>
                <input
                  type="text"
                  value={newIconName}
                  onChange={(e) => setNewIconName(e.target.value)}
                  placeholder="e.g. cloud-download"
                  className="w-full neo-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Folder</label>
                  <select
                    value={newIconFolder}
                    onChange={(e) => setNewIconFolder(e.target.value)}
                    className="w-full neo-input rounded-xl px-3 py-2 text-xs"
                  >
                    {folders.filter(f => f.id !== 'all').map(f => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newIconTags}
                    onChange={(e) => setNewIconTags(e.target.value)}
                    placeholder="cloud, download, sync"
                    className="w-full neo-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Raw SVG Code (or paste from Figma)</label>
                <textarea
                  rows={4}
                  value={newIconSvg}
                  onChange={(e) => setNewIconSvg(e.target.value)}
                  placeholder="<svg viewBox='0 0 24 24'>...</svg>"
                  className="w-full neo-input rounded-xl p-3 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewIconModalOpen(false)}
                className="px-4 py-2 rounded-xl neo-btn text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewIcon}
                disabled={!newIconName.trim()}
                className="px-5 py-2 rounded-xl neo-btn-primary font-bold text-xs shadow-md disabled:opacity-50"
              >
                Add Glyph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW FOLDER MODAL */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="neo-card-lg rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-600" />
                <span>Create Category Folder</span>
              </h3>
              <button onClick={() => setIsNewFolderModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Social & Badges"
                  className="w-full neo-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Accent Color</label>
                <div className="flex items-center gap-2">
                  {['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFolderColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newFolderColor === color ? 'scale-125 ring-2 ring-white dark:ring-slate-900 shadow-md' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-4 py-2 rounded-xl neo-btn text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-5 py-2 rounded-xl neo-btn-primary font-bold text-xs shadow-md disabled:opacity-50"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
