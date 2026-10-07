import { IconItem, FolderItem } from '../types/icon';

export const INITIAL_FOLDERS: FolderItem[] = [
  { id: 'all', name: 'All Glyphs', color: '#3b82f6', description: 'Complete library of icons' },
  { id: 'Navigation', name: 'Navigation', color: '#2563eb', description: 'Wayfinding, arrows, and maps' },
  { id: 'Action & System', name: 'Action & System', color: '#7c3aed', description: 'Controls, settings, and utilities' },
  { id: 'Media & Device', name: 'Media & Device', color: '#06b6d4', description: 'Audio, visual, and hardware screens' },
  { id: 'Commerce & Pay', name: 'Commerce & Pay', color: '#10b981', description: 'E-commerce, security, and transactions' },
  { id: 'Code & Cloud', name: 'Code & Cloud', color: '#f59e0b', description: 'Developer tools, servers, and data' },
];

export const INITIAL_ICONS: IconItem[] = [
  // --- Navigation (e900 - e907)
  {
    id: 'icon-home',
    name: 'home',
    folder: 'Navigation',
    tags: ['home', 'house', 'main', 'dashboard', 'landing', 'root'],
    unicodeHex: 'e900',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 500000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
</svg>`
  },
  {
    id: 'icon-compass',
    name: 'compass',
    folder: 'Navigation',
    tags: ['compass', 'direction', 'explore', 'location', 'travel'],
    unicodeHex: 'e901',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 480000,
    updatedAt: Date.now() - 480000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" />
  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
</svg>`
  },
  {
    id: 'icon-map-pin',
    name: 'map-pin',
    folder: 'Navigation',
    tags: ['location', 'marker', 'pin', 'gps', 'place', 'map'],
    unicodeHex: 'e902',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 470000,
    updatedAt: Date.now() - 470000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
  <circle cx="12" cy="10" r="3" />
</svg>`
  },
  {
    id: 'icon-arrow-right',
    name: 'arrow-right',
    folder: 'Navigation',
    tags: ['arrow', 'right', 'forward', 'next', 'continue', 'move'],
    unicodeHex: 'e903',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 460000,
    updatedAt: Date.now() - 460000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12h14" />
  <path d="m12 5 7 7-7 7" />
</svg>`
  },
  {
    id: 'icon-chevron-down',
    name: 'chevron-down',
    folder: 'Navigation',
    tags: ['chevron', 'arrow', 'down', 'expand', 'dropdown', 'more'],
    unicodeHex: 'e904',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 450000,
    updatedAt: Date.now() - 450000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m6 9 6 6 6-6" />
</svg>`
  },
  {
    id: 'icon-globe',
    name: 'globe',
    folder: 'Navigation',
    tags: ['globe', 'world', 'earth', 'web', 'internet', 'language', 'locale'],
    unicodeHex: 'e905',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 440000,
    updatedAt: Date.now() - 440000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" />
  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
  <path d="M2 12h20" />
</svg>`
  },
  {
    id: 'icon-external-link',
    name: 'external-link',
    folder: 'Navigation',
    tags: ['link', 'external', 'open', 'new-tab', 'redirect', 'url'],
    unicodeHex: 'e906',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 430000,
    updatedAt: Date.now() - 430000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 3h6v6" />
  <path d="M10 14 21 3" />
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
</svg>`
  },
  {
    id: 'icon-corner-down-right',
    name: 'corner-down-right',
    folder: 'Navigation',
    tags: ['corner', 'arrow', 'turn', 'sub', 'tree', 'child'],
    unicodeHex: 'e907',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 420000,
    updatedAt: Date.now() - 420000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="15 10 20 15 15 20" />
  <path d="M4 4v7a4 4 0 0 0 4 4h12" />
</svg>`
  },

  // --- Action & System (e908 - e911)
  {
    id: 'icon-search',
    name: 'search',
    folder: 'Action & System',
    tags: ['search', 'find', 'lookup', 'magnifier', 'query', 'filter'],
    unicodeHex: 'e908',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 410000,
    updatedAt: Date.now() - 410000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8" />
  <path d="m21 21-4.3-4.3" />
</svg>`
  },
  {
    id: 'icon-settings',
    name: 'settings',
    folder: 'Action & System',
    tags: ['settings', 'gear', 'cog', 'preferences', 'configure', 'options'],
    unicodeHex: 'e909',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 400000,
    updatedAt: Date.now() - 400000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
  <circle cx="12" cy="12" r="3" />
</svg>`
  },
  {
    id: 'icon-bell',
    name: 'bell',
    folder: 'Action & System',
    tags: ['bell', 'notification', 'alert', 'alarm', 'ring', 'reminder'],
    unicodeHex: 'e90a',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 390000,
    updatedAt: Date.now() - 390000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
</svg>`
  },
  {
    id: 'icon-sliders',
    name: 'sliders',
    folder: 'Action & System',
    tags: ['sliders', 'tune', 'filter', 'adjust', 'audio', 'controls'],
    unicodeHex: 'e90b',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 380000,
    updatedAt: Date.now() - 380000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="4" x2="4" y1="21" y2="14" />
  <line x1="4" x2="4" y1="10" y2="3" />
  <line x1="12" x2="12" y1="21" y2="12" />
  <line x1="12" x2="12" y1="8" y2="3" />
  <line x1="20" x2="20" y1="21" y2="16" />
  <line x1="20" x2="20" y1="12" y2="3" />
  <line x1="1" x2="7" y1="14" y2="14" />
  <line x1="9" x2="15" y1="8" y2="8" />
  <line x1="17" x2="23" y1="16" y2="16" />
</svg>`
  },
  {
    id: 'icon-grid',
    name: 'grid',
    folder: 'Action & System',
    tags: ['grid', 'layout', 'apps', 'dashboard', 'tiles', 'collection'],
    unicodeHex: 'e90c',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 370000,
    updatedAt: Date.now() - 370000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="7" height="7" x="3" y="3" rx="1" />
  <rect width="7" height="7" x="14" y="3" rx="1" />
  <rect width="7" height="7" x="14" y="14" rx="1" />
  <rect width="7" height="7" x="3" y="14" rx="1" />
</svg>`
  },
  {
    id: 'icon-trash',
    name: 'trash',
    folder: 'Action & System',
    tags: ['trash', 'delete', 'remove', 'bin', 'discard'],
    unicodeHex: 'e90d',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 360000,
    updatedAt: Date.now() - 360000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 6h18" />
  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  <line x1="10" x2="10" y1="11" y2="17" />
  <line x1="14" x2="14" y1="11" y2="17" />
</svg>`
  },
  {
    id: 'icon-check',
    name: 'check',
    folder: 'Action & System',
    tags: ['check', 'done', 'success', 'confirm', 'tick', 'accept'],
    unicodeHex: 'e90e',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 350000,
    updatedAt: Date.now() - 350000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 6 9 17l-5-5" />
</svg>`
  },
  {
    id: 'icon-plus',
    name: 'plus',
    folder: 'Action & System',
    tags: ['plus', 'add', 'create', 'new', 'more', 'insert'],
    unicodeHex: 'e90f',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 340000,
    updatedAt: Date.now() - 340000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12h14" />
  <path d="M12 5v14" />
</svg>`
  },

  // --- Media & Device (e910 - e917)
  {
    id: 'icon-camera',
    name: 'camera',
    folder: 'Media & Device',
    tags: ['camera', 'photo', 'picture', 'capture', 'snapshot', 'lens'],
    unicodeHex: 'e910',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 330000,
    updatedAt: Date.now() - 330000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
  <circle cx="12" cy="13" r="3" />
</svg>`
  },
  {
    id: 'icon-play',
    name: 'play',
    folder: 'Media & Device',
    tags: ['play', 'start', 'video', 'music', 'media', 'resume'],
    unicodeHex: 'e911',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 320000,
    updatedAt: Date.now() - 320000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="6 3 20 12 6 21 6 3" />
</svg>`
  },
  {
    id: 'icon-volume',
    name: 'volume',
    folder: 'Media & Device',
    tags: ['volume', 'audio', 'sound', 'speaker', 'music', 'listen'],
    unicodeHex: 'e912',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 310000,
    updatedAt: Date.now() - 310000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
</svg>`
  },
  {
    id: 'icon-smartphone',
    name: 'smartphone',
    folder: 'Media & Device',
    tags: ['smartphone', 'mobile', 'cell', 'phone', 'device', 'responsive'],
    unicodeHex: 'e913',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 300000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
  <path d="M12 18h.01" />
</svg>`
  },
  {
    id: 'icon-monitor',
    name: 'monitor',
    folder: 'Media & Device',
    tags: ['monitor', 'screen', 'desktop', 'display', 'computer', 'pc'],
    unicodeHex: 'e914',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 290000,
    updatedAt: Date.now() - 290000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="14" x="2" y="3" rx="2" />
  <line x1="8" x2="16" y1="21" y2="21" />
  <line x1="12" x2="12" y1="17" y2="21" />
</svg>`
  },
  {
    id: 'icon-headphones',
    name: 'headphones',
    folder: 'Media & Device',
    tags: ['headphones', 'headset', 'audio', 'music', 'podcast', 'listen'],
    unicodeHex: 'e915',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 280000,
    updatedAt: Date.now() - 280000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
</svg>`
  },
  {
    id: 'icon-image',
    name: 'image',
    folder: 'Media & Device',
    tags: ['image', 'photo', 'picture', 'gallery', 'artwork', 'visual'],
    unicodeHex: 'e916',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 270000,
    updatedAt: Date.now() - 270000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
  <circle cx="9" cy="9" r="2" />
  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
</svg>`
  },
  {
    id: 'icon-mic',
    name: 'mic',
    folder: 'Media & Device',
    tags: ['mic', 'microphone', 'audio', 'voice', 'record', 'podcast'],
    unicodeHex: 'e917',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 260000,
    updatedAt: Date.now() - 260000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
  <line x1="12" x2="12" y1="19" y2="22" />
</svg>`
  },

  // --- Commerce & Pay (e918 - e91e)
  {
    id: 'icon-shopping-bag',
    name: 'shopping-bag',
    folder: 'Commerce & Pay',
    tags: ['shopping', 'bag', 'cart', 'store', 'ecommerce', 'checkout', 'buy'],
    unicodeHex: 'e918',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 250000,
    updatedAt: Date.now() - 250000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
  <path d="M3 6h18" />
  <path d="M16 10a4 4 0 0 1-8 0" />
</svg>`
  },
  {
    id: 'icon-credit-card',
    name: 'credit-card',
    folder: 'Commerce & Pay',
    tags: ['card', 'credit-card', 'payment', 'finance', 'money', 'billing'],
    unicodeHex: 'e919',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 240000,
    updatedAt: Date.now() - 240000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="14" x="2" y="5" rx="2" />
  <line x1="2" x2="22" y1="10" y2="10" />
</svg>`
  },
  {
    id: 'icon-wallet',
    name: 'wallet',
    folder: 'Commerce & Pay',
    tags: ['wallet', 'money', 'crypto', 'cash', 'pay', 'funds'],
    unicodeHex: 'e91a',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 230000,
    updatedAt: Date.now() - 230000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
</svg>`
  },
  {
    id: 'icon-tag',
    name: 'tag',
    folder: 'Commerce & Pay',
    tags: ['tag', 'price', 'discount', 'label', 'offer', 'badge', 'sale'],
    unicodeHex: 'e91b',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 220000,
    updatedAt: Date.now() - 220000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
  <path d="M7 7h.01" />
</svg>`
  },
  {
    id: 'icon-shield-check',
    name: 'shield-check',
    folder: 'Commerce & Pay',
    tags: ['shield', 'check', 'security', 'verified', 'safe', 'protection'],
    unicodeHex: 'e91c',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 210000,
    updatedAt: Date.now() - 210000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  <path d="m9 12 2 2 4-4" />
</svg>`
  },
  {
    id: 'icon-dollar-sign',
    name: 'dollar-sign',
    folder: 'Commerce & Pay',
    tags: ['dollar', 'money', 'price', 'cost', 'currency', 'usd'],
    unicodeHex: 'e91d',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 200000,
    updatedAt: Date.now() - 200000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="12" x2="12" y1="2" y2="22" />
  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
</svg>`
  },

  // --- Code & Cloud (e91f - e926)
  {
    id: 'icon-code',
    name: 'code',
    folder: 'Code & Cloud',
    tags: ['code', 'developer', 'programming', 'html', 'tag', 'brackets', 'syntax'],
    unicodeHex: 'e91e',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 190000,
    updatedAt: Date.now() - 190000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="16 18 22 12 16 6" />
  <polyline points="8 6 2 12 8 18" />
</svg>`
  },
  {
    id: 'icon-terminal',
    name: 'terminal',
    folder: 'Code & Cloud',
    tags: ['terminal', 'bash', 'console', 'cli', 'command', 'shell'],
    unicodeHex: 'e91f',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 180000,
    updatedAt: Date.now() - 180000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="4 17 10 11 4 5" />
  <line x1="12" x2="20" y1="19" y2="19" />
</svg>`
  },
  {
    id: 'icon-git-branch',
    name: 'git-branch',
    folder: 'Code & Cloud',
    tags: ['git', 'branch', 'vcs', 'version-control', 'merge', 'repo'],
    unicodeHex: 'e920',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 170000,
    updatedAt: Date.now() - 170000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="6" x2="6" y1="3" y2="15" />
  <circle cx="18" cy="6" r="3" />
  <circle cx="6" cy="18" r="3" />
  <path d="M18 9a9 9 0 0 1-9 9" />
</svg>`
  },
  {
    id: 'icon-cpu',
    name: 'cpu',
    folder: 'Code & Cloud',
    tags: ['cpu', 'processor', 'hardware', 'chip', 'compute', 'silicon'],
    unicodeHex: 'e921',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 160000,
    updatedAt: Date.now() - 160000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="16" height="16" x="4" y="4" rx="2" />
  <rect width="6" height="6" x="9" y="9" rx="1" />
  <path d="M15 2v2" />
  <path d="M15 20v2" />
  <path d="M2 15h2" />
  <path d="M2 9h2" />
  <path d="M20 15h2" />
  <path d="M20 9h2" />
  <path d="M9 2v2" />
  <path d="M9 20v2" />
</svg>`
  },
  {
    id: 'icon-database',
    name: 'database',
    folder: 'Code & Cloud',
    tags: ['database', 'sql', 'storage', 'data', 'server', 'db'],
    unicodeHex: 'e922',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 150000,
    updatedAt: Date.now() - 150000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="12" cy="5" rx="9" ry="3" />
  <path d="M3 5V19A9 3 0 0 0 21 19V5" />
  <path d="M3 12A9 3 0 0 0 21 12" />
</svg>`
  },
  {
    id: 'icon-zap',
    name: 'zap',
    folder: 'Code & Cloud',
    tags: ['zap', 'lightning', 'energy', 'fast', 'speed', 'power', 'quick'],
    unicodeHex: 'e923',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 140000,
    updatedAt: Date.now() - 140000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
</svg>`
  },
  {
    id: 'icon-layers',
    name: 'layers',
    folder: 'Code & Cloud',
    tags: ['layers', 'stack', 'components', 'design', 'structure', 'architecture'],
    unicodeHex: 'e924',
    viewBox: '0 0 24 24',
    createdAt: Date.now() - 130000,
    updatedAt: Date.now() - 130000,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
  <path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2 12.5" />
  <path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2 17.5" />
</svg>`
  },
];
