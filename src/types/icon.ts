export interface IconItem {
  id: string;
  name: string;
  folder: string;
  tags: string[];
  svgCode: string;
  unicodeHex: string; // e.g. "e900"
  viewBox: string; // e.g. "0 0 24 24"
  createdAt: number;
  updatedAt: number;
  pathData?: string; // extracted or primary path
}

export interface FolderItem {
  id: string;
  name: string;
  color: string; // hex or tailwind identifier
  description?: string;
}

export interface FontSettings {
  fontFamily: string;
  fontPrefix: string;
  startUnicodeHex: string;
  unitsPerEm: number;
  author: string;
  version: string;
  normalizeGlyphs: boolean;
}

export type ViewportDevice = 'mobile' | 'tablet' | 'desktop' | 'pixels';

export interface ViewportConfig {
  id: ViewportDevice;
  label: string;
  width: number;
  height: number;
  iconSize: number;
  scaleDescription: string;
}

export interface BatchExportOptions {
  includeTtf: boolean;
  includeSvgFont: boolean;
  includeCss: boolean;
  includeIndividualSvgs: boolean;
  includeSvgSprite: boolean;
  includeReactComponents: boolean;
  includeJsonManifest: boolean;
  exportScope: 'all' | 'folder' | 'selected';
  selectedFolder?: string;
}

export interface GradientStop {
  id: string;
  color: string;
  offset: number; // 0 to 100
  opacity: number; // 0 to 1
}

export interface GradientConfig {
  enabled: boolean;
  type: 'linear' | 'radial';
  angle: number; // in degrees
  stops: GradientStop[];
}

export interface PathAnchorPoint {
  id: string;
  x: number;
  y: number;
  type: 'sharp' | 'smooth';
  handleIn?: { x: number; y: number };
  handleOut?: { x: number; y: number };
}

export type BooleanOperationType = 'unite' | 'subtract' | 'intersect' | 'exclude';

export type ScreenPreviewSize = 'mobile-portrait' | 'mobile-landscape' | 'tablet' | 'desktop';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchGroundingResult {
  summary: string;
  sources: GroundingSource[];
  queries: string[];
  note?: string;
}
