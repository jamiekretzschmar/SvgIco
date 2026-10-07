import { IconItem } from '../types/icon';

// Clean and sanitize SVG code
export function sanitizeSvgCode(rawSvg: string): { svg: string; viewBox: string; isValid: boolean } {
  if (!rawSvg || typeof rawSvg !== 'string') {
    return { svg: '', viewBox: '0 0 24 24', isValid: false };
  }

  // Remove scripts, events, and dangerous tags
  let cleaned = rawSvg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  // Extract or verify viewBox
  const viewBoxMatch = cleaned.match(/viewBox=["']([^"']+)["']/i);
  let viewBox = '0 0 24 24';
  if (viewBoxMatch && viewBoxMatch[1]) {
    viewBox = viewBoxMatch[1].trim();
  } else {
    // If width and height exist, create viewBox
    const widthMatch = cleaned.match(/width=["'](\d+)["']/i);
    const heightMatch = cleaned.match(/height=["'](\d+)["']/i);
    if (widthMatch && heightMatch) {
      viewBox = `0 0 ${widthMatch[1]} ${heightMatch[1]}`;
    }
  }

  // Ensure svg opening tag has standard attributes
  if (!cleaned.includes('<svg')) {
    // Maybe user pasted just path data or fragments
    cleaned = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${cleaned}</svg>`;
  }

  // Ensure stroke and fill harmonized if outline
  if (!cleaned.includes('viewBox=')) {
    cleaned = cleaned.replace(/<svg\b/i, `<svg viewBox="${viewBox}" `);
  }

  const isValid = /<svg[\s\S]*<\/svg>/i.test(cleaned);

  return {
    svg: cleaned,
    viewBox,
    isValid,
  };
}

// Convert a filename into clean icon name and tags
export function parseIconMetadataFromFileName(filename: string, folderName?: string): { name: string; tags: string[] } {
  // strip extension
  const baseName = filename.replace(/\.svg$/i, '');
  // normalize separators
  const cleanName = baseName
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .trim() || 'icon';

  const parts = cleanName.split('-');
  const tagsSet = new Set<string>();
  parts.forEach(p => {
    if (p.length > 1) tagsSet.add(p);
  });
  if (folderName) {
    tagsSet.add(folderName.toLowerCase());
  }

  return {
    name: cleanName,
    tags: Array.from(tagsSet),
  };
}

// Helper to calculate the next available unicode hex
export function getNextUnicodeHex(existingIcons: IconItem[], startHex: string = 'e900'): string {
  let highest = parseInt(startHex, 16) - 1;
  existingIcons.forEach(icon => {
    const val = parseInt(icon.unicodeHex, 16);
    if (!isNaN(val) && val > highest) {
      highest = val;
    }
  });
  return (highest + 1).toString(16).toLowerCase();
}

// Read an entire directory via drag and drop (FileSystemEntry API)
export async function scanDroppedEntries(dataTransferItems: DataTransferItemList): Promise<Array<{ file: File; relativePath: string; folder: string }>> {
  const results: Array<{ file: File; relativePath: string; folder: string }> = [];

  const traverseFileTree = async (item: any, currentPath: string = ''): Promise<void> => {
    if (item.isFile) {
      return new Promise((resolve) => {
        item.file((file: File) => {
          if (file.name.toLowerCase().endsWith('.svg')) {
            const folder = currentPath.split('/')[0] || 'Imported';
            results.push({ file, relativePath: `${currentPath}${file.name}`, folder });
          }
          resolve();
        });
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      return new Promise((resolve) => {
        const readEntries = () => {
          dirReader.readEntries(async (entries: any[]) => {
            if (entries.length === 0) {
              resolve();
            } else {
              for (const child of entries) {
                await traverseFileTree(child, `${currentPath}${item.name}/`);
              }
              // continue reading until entries is empty (browser batching)
              readEntries();
            }
          });
        };
        readEntries();
      });
    }
  };

  const tasks: Promise<void>[] = [];
  for (let i = 0; i < dataTransferItems.length; i++) {
    const item = dataTransferItems[i];
    if (item.webkitGetAsEntry) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        tasks.push(traverseFileTree(entry));
      }
    }
  }

  await Promise.all(tasks);
  return results;
}
