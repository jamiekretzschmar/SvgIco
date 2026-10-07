import { IconItem, FontSettings } from '../types/icon';

// Binary DataView writer helper
class BinaryWriter {
  private buffer: ArrayBuffer;
  private view: DataView;
  private offset: number;

  constructor(initialSize: number = 65536) {
    this.buffer = new ArrayBuffer(initialSize);
    this.view = new DataView(this.buffer);
    this.offset = 0;
  }

  ensureCapacity(extraBytes: number) {
    if (this.offset + extraBytes > this.buffer.byteLength) {
      const newSize = Math.max(this.buffer.byteLength * 2, this.offset + extraBytes + 1024);
      const newBuffer = new ArrayBuffer(newSize);
      new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
      this.buffer = newBuffer;
      this.view = new DataView(this.buffer);
    }
  }

  getOffset(): number {
    return this.offset;
  }

  setOffset(pos: number) {
    this.offset = pos;
  }

  writeUint8(val: number) {
    this.ensureCapacity(1);
    this.view.setUint8(this.offset, val);
    this.offset += 1;
  }

  writeInt16(val: number) {
    this.ensureCapacity(2);
    this.view.setInt16(this.offset, val, false); // big-endian
    this.offset += 2;
  }

  writeUint16(val: number) {
    this.ensureCapacity(2);
    this.view.setUint16(this.offset, val, false);
    this.offset += 2;
  }

  writeUint32(val: number) {
    this.ensureCapacity(4);
    this.view.setUint32(this.offset, val, false);
    this.offset += 4;
  }

  writeInt32(val: number) {
    this.ensureCapacity(4);
    this.view.setInt32(this.offset, val, false);
    this.offset += 4;
  }

  writeBytes(bytes: Uint8Array | number[]) {
    this.ensureCapacity(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      this.view.setUint8(this.offset++, bytes[i]);
    }
  }

  writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      this.writeUint8(str.charCodeAt(i));
    }
  }

  pad4() {
    while (this.offset % 4 !== 0) {
      this.writeUint8(0);
    }
  }

  getBuffer(): ArrayBuffer {
    return this.buffer.slice(0, this.offset);
  }

  getUint8Array(): Uint8Array {
    return new Uint8Array(this.buffer.slice(0, this.offset));
  }
}

// Calculate checksum of table data
function calculateTableChecksum(bytes: Uint8Array): number {
  let sum = 0;
  const len = bytes.length;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const alignedLen = Math.floor(len / 4) * 4;
  for (let i = 0; i < alignedLen; i += 4) {
    sum = (sum + view.getUint32(i, false)) >>> 0;
  }
  let remaining = 0;
  for (let i = alignedLen; i < len; i++) {
    remaining = (remaining << 8) | bytes[i];
  }
  if (len % 4 !== 0) {
    remaining = remaining << ((4 - (len % 4)) * 8);
    sum = (sum + remaining) >>> 0;
  }
  return sum >>> 0;
}

// Convert SVG path coordinates to scaled, flipped Font coordinates
export function svgPathToFontPath(svgPath: string, unitsPerEm: number = 1024, svgSize: number = 24): string {
  if (!svgPath) return '';
  const scale = unitsPerEm / svgSize;
  const ascent = Math.round(unitsPerEm * 0.85);

  // Simple token regex for SVG path commands and numbers
  return svgPath.replace(/([a-df-z])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/gi, (match, cmd, num) => {
    if (cmd) return cmd;
    const val = parseFloat(num);
    if (isNaN(val)) return num;
    return (val * scale).toFixed(1);
  });
}

// Clean and extract path 'd' attributes from raw SVG code
export function extractPathsFromSvg(svgCode: string): string[] {
  const paths: string[] = [];
  const pathRegex = /<path[^>]*\bd=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = pathRegex.exec(svgCode)) !== null) {
    if (match[1]) paths.push(match[1]);
  }

  // Also check for circles, rects, polylines if no direct paths
  if (paths.length === 0) {
    const circleRegex = /<circle[^>]*cx=["']([^"']+)["'][^>]*cy=["']([^"']+)["'][^>]*r=["']([^"']+)["']/gi;
    while ((match = circleRegex.exec(svgCode)) !== null) {
      const cx = parseFloat(match[1]);
      const cy = parseFloat(match[2]);
      const r = parseFloat(match[3]);
      // Circle approximation in path
      paths.push(`M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`);
    }

    const rectRegex = /<rect[^>]*x=["']([^"']+)["'][^>]*y=["']([^"']+)["'][^>]*width=["']([^"']+)["'][^>]*height=["']([^"']+)["']/gi;
    while ((match = rectRegex.exec(svgCode)) !== null) {
      const x = parseFloat(match[1]);
      const y = parseFloat(match[2]);
      const w = parseFloat(match[3]);
      const h = parseFloat(match[4]);
      paths.push(`M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`);
    }
  }

  return paths;
}

// Generate valid W3C SVG Font XML
export function generateSvgFont(icons: IconItem[], settings: FontSettings): string {
  const em = settings.unitsPerEm || 1024;
  const ascent = Math.round(em * 0.875);
  const descent = -Math.round(em * 0.125);

  let glyphsXml = '';
  // Missing glyph
  glyphsXml += `    <missing-glyph horiz-adv-x="${em}" d="M 100 0 L 100 800 L 924 800 L 924 0 Z M 200 100 L 824 100 L 824 700 L 200 700 Z" />\n`;

  icons.forEach((icon) => {
    const codePoint = parseInt(icon.unicodeHex, 16);
    const unicodeChar = `&#x${icon.unicodeHex.toLowerCase()};`;
    const paths = extractPathsFromSvg(icon.svgCode);
    const combinedPath = paths.join(' ');
    // Scale and flip path for font space
    const fontD = flipAndScaleSvgPath(combinedPath, em, 24);

    glyphsXml += `    <glyph glyph-name="${icon.name}" unicode="${unicodeChar}" horiz-adv-x="${em}" d="${fontD || 'M0 0'}" />\n`;
  });

  return `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg">
  <metadata>Generated by GlyphForge Studio for ${settings.author}</metadata>
  <defs>
    <font id="${settings.fontFamily}" horiz-adv-x="${em}">
      <font-face font-family="${settings.fontFamily}"
        units-per-em="${em}"
        ascent="${ascent}"
        descent="${descent}"
        alphabetic="0" />
${glyphsXml}    </font>
  </defs>
</svg>`;
}

// Convert SVG 0..24 coordinate space into Font 0..em (flipped Y)
function flipAndScaleSvgPath(d: string, em: number, viewBoxSize: number = 24): string {
  if (!d) return '';
  const scale = em / viewBoxSize;
  const ascent = Math.round(em * 0.85);

  // Tokenize commands and coordinates
  const tokens = d.match(/([a-df-z])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/gi);
  if (!tokens) return '';

  let result = '';
  let currentCmd = '';
  let coordIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (/^[a-df-z]$/i.test(t)) {
      currentCmd = t;
      result += (result ? ' ' : '') + currentCmd;
      coordIndex = 0;
    } else {
      const val = parseFloat(t);
      if (isNaN(val)) continue;

      let transformed = val;
      const isX = coordIndex % 2 === 0;

      // Handle common commands
      if (currentCmd.toUpperCase() === 'H') {
        transformed = Math.round(val * scale);
      } else if (currentCmd.toUpperCase() === 'V') {
        transformed = Math.round(ascent - val * scale);
      } else if (isX) {
        transformed = Math.round(val * scale);
      } else {
        // Y coordinate flipped
        transformed = Math.round(ascent - val * scale);
      }

      result += ' ' + transformed;
      coordIndex++;
    }
  }

  return result;
}

// Parse simple SVG path into contour points for TrueType
interface GlyphContourPoint {
  x: number;
  y: number;
  onCurve: boolean;
}

function parsePathToContours(d: string, em: number): GlyphContourPoint[][] {
  const contours: GlyphContourPoint[][] = [];
  let currentContour: GlyphContourPoint[] = [];
  const flipped = flipAndScaleSvgPath(d, em, 24);
  const tokens = flipped.match(/([a-df-z])|(-?\d+)/gi);
  if (!tokens) {
    // Fallback simple square glyph outline
    return [[
      { x: 100, y: 100, onCurve: true },
      { x: em - 100, y: 100, onCurve: true },
      { x: em - 100, y: em - 100, onCurve: true },
      { x: 100, y: em - 100, onCurve: true },
    ]];
  }

  let cmd = '';
  let curX = 0;
  let curY = 0;
  let i = 0;

  while (i < tokens.length) {
    const tok = tokens[i];
    if (/^[a-df-z]$/i.test(tok)) {
      cmd = tok;
      i++;
      if (cmd.toUpperCase() === 'Z') {
        if (currentContour.length > 2) {
          contours.push(currentContour);
        }
        currentContour = [];
      }
      continue;
    }

    if (cmd.toUpperCase() === 'M' || cmd.toUpperCase() === 'L') {
      const x = parseInt(tokens[i++] || '0', 10);
      const y = parseInt(tokens[i++] || '0', 10);
      curX = x;
      curY = y;
      currentContour.push({ x, y, onCurve: true });
    } else if (cmd.toUpperCase() === 'H') {
      const x = parseInt(tokens[i++] || '0', 10);
      curX = x;
      currentContour.push({ x, y: curY, onCurve: true });
    } else if (cmd.toUpperCase() === 'V') {
      const y = parseInt(tokens[i++] || '0', 10);
      curY = y;
      currentContour.push({ x: curX, y, onCurve: true });
    } else if (cmd.toUpperCase() === 'C') {
      // Cubic bezier: approximate with 2 points
      const x1 = parseInt(tokens[i++] || '0', 10);
      const y1 = parseInt(tokens[i++] || '0', 10);
      const x2 = parseInt(tokens[i++] || '0', 10);
      const y2 = parseInt(tokens[i++] || '0', 10);
      const x = parseInt(tokens[i++] || '0', 10);
      const y = parseInt(tokens[i++] || '0', 10);
      currentContour.push({ x: x1, y: y1, onCurve: false });
      currentContour.push({ x, y, onCurve: true });
      curX = x;
      curY = y;
    } else if (cmd.toUpperCase() === 'Q') {
      const x1 = parseInt(tokens[i++] || '0', 10);
      const y1 = parseInt(tokens[i++] || '0', 10);
      const x = parseInt(tokens[i++] || '0', 10);
      const y = parseInt(tokens[i++] || '0', 10);
      currentContour.push({ x: x1, y: y1, onCurve: false });
      currentContour.push({ x, y, onCurve: true });
      curX = x;
      curY = y;
    } else {
      i++;
    }
  }

  if (currentContour.length > 2) {
    contours.push(currentContour);
  }

  if (contours.length === 0) {
    // Default pleasant icon glyph box
    contours.push([
      { x: 128, y: 128, onCurve: true },
      { x: em - 128, y: 128, onCurve: true },
      { x: em - 128, y: em - 128, onCurve: true },
      { x: 128, y: em - 128, onCurve: true },
    ]);
  }

  return contours;
}

// Build a valid TrueType Font (.ttf) SFNT Binary
export function compileTrueTypeFont(icons: IconItem[], settings: FontSettings): Uint8Array {
  const em = settings.unitsPerEm || 1024;
  const numGlyphs = icons.length + 1; // index 0 is missing glyph (.notdef)

  // 1. Prepare Glyphs (glyf table) & Locations (loca table)
  const glyfWriter = new BinaryWriter(131072);
  const locaOffsets: number[] = [0];

  // --- Glyph 0: .notdef (empty or simple box)
  const notdefXMin = 50, notdefYMin = 50, notdefXMax = em - 50, notdefYMax = em - 50;
  glyfWriter.writeInt16(1); // 1 contour
  glyfWriter.writeInt16(notdefXMin);
  glyfWriter.writeInt16(notdefYMin);
  glyfWriter.writeInt16(notdefXMax);
  glyfWriter.writeInt16(notdefYMax);
  glyfWriter.writeUint16(3); // endPtsOfContours[0] = 3 (4 points: 0,1,2,3)
  glyfWriter.writeUint16(0); // instructionLength = 0
  // Flags: 4 points onCurve
  glyfWriter.writeUint8(1);
  glyfWriter.writeUint8(1);
  glyfWriter.writeUint8(1);
  glyfWriter.writeUint8(1);
  // xCoordinates (absolute for 1st, then deltas)
  glyfWriter.writeInt16(notdefXMin);
  glyfWriter.writeInt16(notdefXMax - notdefXMin);
  glyfWriter.writeInt16(0);
  glyfWriter.writeInt16(-(notdefXMax - notdefXMin));
  // yCoordinates
  glyfWriter.writeInt16(notdefYMin);
  glyfWriter.writeInt16(0);
  glyfWriter.writeInt16(notdefYMax - notdefYMin);
  glyfWriter.writeInt16(0);
  glyfWriter.pad4();
  locaOffsets.push(glyfWriter.getOffset());

  // --- Icons Glyphs
  icons.forEach((icon) => {
    const paths = extractPathsFromSvg(icon.svgCode);
    const contours = parsePathToContours(paths.join(' '), em);

    if (contours.length === 0) {
      // Empty glyph
      locaOffsets.push(glyfWriter.getOffset());
      return;
    }

    const startOffset = glyfWriter.getOffset();
    const numContours = contours.length;

    // Calculate bbox
    let xMin = em, yMin = em, xMax = 0, yMax = 0;
    contours.forEach(c => c.forEach(p => {
      xMin = Math.min(xMin, p.x);
      yMin = Math.min(yMin, p.y);
      xMax = Math.max(xMax, p.x);
      yMax = Math.max(yMax, p.y);
    }));

    glyfWriter.writeInt16(numContours);
    glyfWriter.writeInt16(xMin);
    glyfWriter.writeInt16(yMin);
    glyfWriter.writeInt16(xMax);
    glyfWriter.writeInt16(yMax);

    // endPtsOfContours
    let pointCount = 0;
    for (let c = 0; c < numContours; c++) {
      pointCount += contours[c].length;
      glyfWriter.writeUint16(pointCount - 1);
    }

    // instructions
    glyfWriter.writeUint16(0);

    // Flags & points
    const allPoints: GlyphContourPoint[] = [];
    contours.forEach(c => allPoints.push(...c));

    allPoints.forEach(p => {
      glyfWriter.writeUint8(p.onCurve ? 1 : 0);
    });

    // X coordinates (delta encoded as 16-bit)
    let lastX = 0;
    allPoints.forEach(p => {
      const dx = p.x - lastX;
      glyfWriter.writeInt16(dx);
      lastX = p.x;
    });

    // Y coordinates (delta encoded as 16-bit)
    let lastY = 0;
    allPoints.forEach(p => {
      const dy = p.y - lastY;
      glyfWriter.writeInt16(dy);
      lastY = p.y;
    });

    glyfWriter.pad4();
    locaOffsets.push(glyfWriter.getOffset());
  });

  const glyfData = glyfWriter.getUint8Array();

  // 2. Build 'loca' table (32-bit offsets)
  const locaWriter = new BinaryWriter((numGlyphs + 1) * 4);
  locaOffsets.forEach(offset => locaWriter.writeUint32(offset));
  const locaData = locaWriter.getUint8Array();

  // 3. Build 'hmtx' table (horizontal metrics for all glyphs)
  const hmtxWriter = new BinaryWriter(numGlyphs * 4);
  for (let i = 0; i < numGlyphs; i++) {
    hmtxWriter.writeUint16(em); // advanceWidth = em
    hmtxWriter.writeInt16(0);   // leftSideBearing = 0
  }
  const hmtxData = hmtxWriter.getUint8Array();

  // 4. Build 'cmap' table (format 4 for Unicode mapping)
  const cmapWriter = new BinaryWriter(2048);
  cmapWriter.writeUint16(0); // version
  cmapWriter.writeUint16(1); // numTables = 1
  cmapWriter.writeUint16(0); // platformID = 0 (Unicode)
  cmapWriter.writeUint16(3); // encodingID = 3 (Unicode BMP)
  cmapWriter.writeUint32(12); // subtable offset

  // Format 4 Subtable
  // Segments: sorted character codes + 0xFFFF sentinel
  const codepoints = icons.map(i => parseInt(i.unicodeHex, 16)).sort((a, b) => a - b);
  // Each codepoint as its own segment + sentinel
  const segCount = codepoints.length + 1;
  const searchRange = Math.pow(2, Math.floor(Math.log2(segCount))) * 2;
  const entrySelector = Math.floor(Math.log2(segCount));
  const rangeShift = segCount * 2 - searchRange;

  const subtableStart = cmapWriter.getOffset();
  cmapWriter.writeUint16(4); // format 4
  cmapWriter.writeUint16(0); // length placeholder (fill later)
  cmapWriter.writeUint16(0); // language
  cmapWriter.writeUint16(segCount * 2);
  cmapWriter.writeUint16(searchRange);
  cmapWriter.writeUint16(entrySelector);
  cmapWriter.writeUint16(rangeShift);

  // endCode array
  codepoints.forEach(cp => cmapWriter.writeUint16(cp));
  cmapWriter.writeUint16(0xFFFF); // endCode sentinel
  cmapWriter.writeUint16(0); // reservedPad

  // startCode array
  codepoints.forEach(cp => cmapWriter.writeUint16(cp));
  cmapWriter.writeUint16(0xFFFF); // startCode sentinel

  // idDelta array: glyphIndex = (codepoint + idDelta) % 65536
  codepoints.forEach((cp, idx) => {
    // glyphIndex is (idx + 1) because index 0 is .notdef
    const targetGlyph = idx + 1;
    const delta = (targetGlyph - cp) & 0xFFFF;
    cmapWriter.writeInt16(delta);
  });
  cmapWriter.writeInt16(1); // delta for sentinel

  // idRangeOffset array: all 0 since we use idDelta
  for (let s = 0; s < segCount; s++) {
    cmapWriter.writeUint16(0);
  }

  const subtableLen = cmapWriter.getOffset() - subtableStart;
  new DataView(cmapWriter.getBuffer()).setUint16(subtableStart + 2, subtableLen, false);
  const cmapData = cmapWriter.getUint8Array();

  // 5. Build 'head' table
  const headWriter = new BinaryWriter(54);
  headWriter.writeUint32(0x00010000); // version 1.0
  headWriter.writeUint32(0x00010000); // fontRevision 1.0
  headWriter.writeUint32(0); // checkSumAdjustment placeholder
  headWriter.writeUint32(0x5F0F3CF5); // magicNumber
  headWriter.writeUint16(0x0001); // flags
  headWriter.writeUint16(em); // unitsPerEm
  // created & modified (8 bytes each, 1904 epochs)
  headWriter.writeUint32(0);
  headWriter.writeUint32(0x36481234);
  headWriter.writeUint32(0);
  headWriter.writeUint32(0x36481234);
  headWriter.writeInt16(0); // xMin
  headWriter.writeInt16(-128); // yMin
  headWriter.writeInt16(em); // xMax
  headWriter.writeInt16(Math.round(em * 0.875)); // yMax
  headWriter.writeUint16(0); // macStyle
  headWriter.writeUint16(8); // lowestRecPPEM
  headWriter.writeInt16(2); // fontDirectionHint
  headWriter.writeInt16(1); // indexToLocFormat: 1 = long (32-bit offsets in loca)
  headWriter.writeInt16(0); // glyphDataFormat
  const headData = headWriter.getUint8Array();

  // 6. Build 'hhea' table
  const hheaWriter = new BinaryWriter(36);
  hheaWriter.writeUint32(0x00010000);
  hheaWriter.writeInt16(Math.round(em * 0.875)); // ascender
  hheaWriter.writeInt16(-Math.round(em * 0.125)); // descender
  hheaWriter.writeInt16(0); // lineGap
  hheaWriter.writeUint16(em); // advanceWidthMax
  hheaWriter.writeInt16(0); // minLeftSideBearing
  hheaWriter.writeInt16(0); // minRightSideBearing
  hheaWriter.writeInt16(em); // xMaxExtent
  hheaWriter.writeInt16(1); // caretSlopeRise
  hheaWriter.writeInt16(0); // caretSlopeRun
  hheaWriter.writeInt16(0); // caretOffset
  hheaWriter.writeInt16(0); // reserved
  hheaWriter.writeInt16(0);
  hheaWriter.writeInt16(0);
  hheaWriter.writeInt16(0);
  hheaWriter.writeInt16(0); // metricDataFormat
  hheaWriter.writeUint16(numGlyphs); // numberOfHMetrics
  const hheaData = hheaWriter.getUint8Array();

  // 7. Build 'maxp' table
  const maxpWriter = new BinaryWriter(32);
  maxpWriter.writeUint32(0x00010000); // version 1.0
  maxpWriter.writeUint16(numGlyphs);
  maxpWriter.writeUint16(128); // maxPoints
  maxpWriter.writeUint16(16);  // maxContours
  maxpWriter.writeUint16(0);   // maxCompositePoints
  maxpWriter.writeUint16(0);   // maxCompositeContours
  maxpWriter.writeUint16(2);   // maxZones
  maxpWriter.writeUint16(0);   // maxTwilightPoints
  maxpWriter.writeUint16(0);   // maxStorage
  maxpWriter.writeUint16(0);   // maxFunctionDefs
  maxpWriter.writeUint16(0);   // maxInstructionDefs
  maxpWriter.writeUint16(0);   // maxStackElements
  maxpWriter.writeUint16(0);   // maxSizeOfInstructions
  maxpWriter.writeUint16(0);   // maxComponentElements
  maxpWriter.writeUint16(0);   // maxComponentDepth
  const maxpData = maxpWriter.getUint8Array();

  // 8. Build 'name' table
  const nameWriter = new BinaryWriter(2048);
  const strings = [
    settings.fontFamily || 'GlyphForgeIcons', // 1: Family
    'Regular',                                 // 2: Subfamily
    `1.000;GLYPH;${settings.fontFamily}`,      // 3: Unique ID
    settings.fontFamily || 'GlyphForgeIcons', // 4: Full Name
    `Version ${settings.version || '1.0.0'}`,  // 5: Version
    settings.fontFamily.replace(/\s+/g, '-'),  // 6: PostScript
  ];
  const numNameRecords = strings.length;
  nameWriter.writeUint16(0); // format 0
  nameWriter.writeUint16(numNameRecords);
  nameWriter.writeUint16(6 + numNameRecords * 12); // stringOffset

  let strOffset = 0;
  strings.forEach((str, index) => {
    nameWriter.writeUint16(3); // platformID: Windows
    nameWriter.writeUint16(1); // encodingID: Unicode BMP
    nameWriter.writeUint16(0x0409); // languageID: English (US)
    nameWriter.writeUint16(index + 1); // nameID
    nameWriter.writeUint16(str.length * 2); // length in bytes (UTF-16BE)
    nameWriter.writeUint16(strOffset); // offset
    strOffset += str.length * 2;
  });

  // Write UTF-16BE strings
  strings.forEach(str => {
    for (let c = 0; c < str.length; c++) {
      nameWriter.writeUint16(str.charCodeAt(c));
    }
  });
  const nameData = nameWriter.getUint8Array();

  // 9. Build 'OS/2' table
  const os2Writer = new BinaryWriter(96);
  os2Writer.writeUint16(4); // version 4
  os2Writer.writeInt16(Math.round(em * 0.5)); // xAvgCharWidth
  os2Writer.writeUint16(400); // usWeightClass = 400 (Regular)
  os2Writer.writeUint16(5);   // usWidthClass = Medium
  os2Writer.writeUint16(0);   // fsType: Installable embedding
  os2Writer.writeInt16(Math.round(em * 0.6)); // ySubscriptXSize
  os2Writer.writeInt16(Math.round(em * 0.7)); // ySubscriptYSize
  os2Writer.writeInt16(0); // ySubscriptXOffset
  os2Writer.writeInt16(Math.round(em * 0.14)); // ySubscriptYOffset
  os2Writer.writeInt16(Math.round(em * 0.6));
  os2Writer.writeInt16(Math.round(em * 0.7));
  os2Writer.writeInt16(0);
  os2Writer.writeInt16(Math.round(em * 0.48));
  os2Writer.writeInt16(50); // yStrikeoutSize
  os2Writer.writeInt16(Math.round(em * 0.25)); // yStrikeoutPosition
  os2Writer.writeInt16(0); // sFamilyClass
  // panose (10 bytes)
  os2Writer.writeBytes([2, 0, 5, 3, 0, 0, 0, 0, 0, 0]);
  // ulUnicodeRange (16 bytes)
  os2Writer.writeUint32(0x80000000);
  os2Writer.writeUint32(0);
  os2Writer.writeUint32(0);
  os2Writer.writeUint32(0);
  os2Writer.writeString('GLPH'); // achVendID
  os2Writer.writeUint16(0x0040); // fsSelection: Regular
  os2Writer.writeUint16(0xE900); // usFirstCharIndex
  os2Writer.writeUint16(0xF8FF); // usLastCharIndex
  os2Writer.writeInt16(Math.round(em * 0.875)); // sTypoAscender
  os2Writer.writeInt16(-Math.round(em * 0.125)); // sTypoDescender
  os2Writer.writeInt16(0); // sTypoLineGap
  os2Writer.writeUint16(Math.round(em * 0.875)); // usWinAscent
  os2Writer.writeUint16(Math.round(em * 0.125)); // usWinDescent
  const os2Data = os2Writer.getUint8Array();

  // 10. Build 'post' table (format 3.0)
  const postWriter = new BinaryWriter(32);
  postWriter.writeUint32(0x00030000); // version 3.0
  postWriter.writeUint32(0); // italicAngle
  postWriter.writeInt16(0);  // underlinePosition
  postWriter.writeInt16(0);  // underlineThickness
  postWriter.writeUint32(1); // isFixedPitch
  postWriter.writeUint32(0); // minMemType42
  postWriter.writeUint32(0); // maxMemType42
  postWriter.writeUint32(0); // minMemType1
  postWriter.writeUint32(0); // maxMemType1
  const postData = postWriter.getUint8Array();

  // List of tables alphabetically sorted
  const tables = [
    { tag: 'OS/2', data: os2Data },
    { tag: 'cmap', data: cmapData },
    { tag: 'glyf', data: glyfData },
    { tag: 'head', data: headData },
    { tag: 'hhea', data: hheaData },
    { tag: 'hmtx', data: hmtxData },
    { tag: 'loca', data: locaData },
    { tag: 'maxp', data: maxpData },
    { tag: 'name', data: nameData },
    { tag: 'post', data: postData },
  ];

  // 11. Assemble final SFNT Binary
  const numTables = tables.length;
  const searchRangeTable = Math.pow(2, Math.floor(Math.log2(numTables))) * 16;
  const entrySelectorTable = Math.floor(Math.log2(numTables));
  const rangeShiftTable = numTables * 16 - searchRangeTable;

  const fontWriter = new BinaryWriter(12 + numTables * 16 + 262144);
  fontWriter.writeUint32(0x00010000); // sfntVersion (TrueType)
  fontWriter.writeUint16(numTables);
  fontWriter.writeUint16(searchRangeTable);
  fontWriter.writeUint16(entrySelectorTable);
  fontWriter.writeUint16(rangeShiftTable);

  let currentTableOffset = 12 + numTables * 16;
  const tableDirectoryPositions: number[] = [];

  // Write Table Directory Headers
  tables.forEach(table => {
    tableDirectoryPositions.push(fontWriter.getOffset());
    fontWriter.writeString(table.tag);
    fontWriter.writeUint32(calculateTableChecksum(table.data));
    fontWriter.writeUint32(currentTableOffset);
    fontWriter.writeUint32(table.data.length);
    currentTableOffset += Math.ceil(table.data.length / 4) * 4;
  });

  // Write Table Payloads
  let headTablePosInFile = 0;
  tables.forEach(table => {
    if (table.tag === 'head') {
      headTablePosInFile = fontWriter.getOffset();
    }
    fontWriter.writeBytes(table.data);
    fontWriter.pad4();
  });

  // Calculate master checksum for whole font and patch head.checkSumAdjustment
  const fullBytes = fontWriter.getUint8Array();
  const fontChecksum = calculateTableChecksum(fullBytes);
  const checkSumAdjustment = (0xB1B0AFBA - fontChecksum) >>> 0;
  new DataView(fontWriter.getBuffer()).setUint32(headTablePosInFile + 8, checkSumAdjustment, false);

  return fontWriter.getUint8Array();
}

// Convert Uint8Array to base64 string
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Generate CSS Webfont stylesheet
export function generateCssWebfont(icons: IconItem[], settings: FontSettings, ttfBase64?: string): string {
  const prefix = settings.fontPrefix || 'gf-';
  const family = settings.fontFamily || 'GlyphForgeIcons';

  let fontSrc = `url('${family}.ttf') format('truetype')`;
  if (ttfBase64) {
    fontSrc = `url('data:font/ttf;base64,${ttfBase64}') format('truetype'), ` + fontSrc;
  }

  let classRules = '';
  icons.forEach((icon) => {
    const slug = icon.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    classRules += `.${prefix}${slug}:before {\n  content: "\\${icon.unicodeHex.toLowerCase()}";\n}\n`;
  });

  return `/* Generated by GlyphForge Studio for ${family} */
@font-face {
  font-family: '${family}';
  src: ${fontSrc};
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="${prefix}"], [class*=" ${prefix}"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: '${family}' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  letter-spacing: 0;
  display: inline-block;
  vertical-align: middle;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

${classRules}`;
}

// Generate React / TypeScript Component Package
export function generateReactComponentsPack(icons: IconItem[]): string {
  let components = `import React from 'react';\n\n`;

  icons.forEach((icon) => {
    // PascalCase component name
    const compName = icon.name
      .replace(/[-_ ]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^[a-z]/, (c) => c.toUpperCase()) + 'Icon';

    // Sanitize inner svg
    const innerSvg = icon.svgCode
      .replace(/<\/?svg[^>]*>/gi, '')
      .replace(/stroke-width/g, 'strokeWidth')
      .replace(/stroke-linecap/g, 'strokeLinecap')
      .replace(/stroke-linejoin/g, 'strokeLinejoin')
      .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
      .replace(/fill-rule/g, 'fillRule')
      .replace(/clip-rule/g, 'clipRule')
      .trim();

    components += `export interface ${compName}Props extends React.SVGProps<SVGSVGElement> {\n  size?: number | string;\n}\n\n`;
    components += `export const ${compName}: React.FC<${compName}Props> = ({ size = 24, className = '', ...props }) => (\n`;
    components += `  <svg\n    viewBox="${icon.viewBox || '0 0 24 24'}"\n    width={size}\n    height={size}\n    fill="none"\n    stroke="currentColor"\n    strokeWidth={2}\n    strokeLinecap="round"\n    strokeLinejoin="round"\n    className={className}\n    {...props}\n  >\n    ${innerSvg}\n  </svg>\n);\n\n`;
  });

  return components;
}

// Generate SVG Spritesheet
export function generateSvgSprite(icons: IconItem[], prefix: string = 'gf-'): string {
  let symbols = '';
  icons.forEach((icon) => {
    const slug = icon.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const inner = icon.svgCode.replace(/<\/?svg[^>]*>/gi, '').trim();
    symbols += `  <symbol id="${prefix}${slug}" viewBox="${icon.viewBox || '0 0 24 24'}">\n    ${inner}\n  </symbol>\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n${symbols}</svg>`;
}

// Generate HTML Demo Page
export function generateHtmlDemoPage(icons: IconItem[], settings: FontSettings): string {
  const prefix = settings.fontPrefix || 'gf-';
  const family = settings.fontFamily || 'GlyphForgeIcons';

  const cards = icons.map(icon => `
    <div class="icon-card">
      <div class="icon-glyph"><i class="${prefix}${icon.name}"></i></div>
      <div class="icon-name">${icon.name}</div>
      <div class="icon-code">\\${icon.unicodeHex}</div>
      <div class="icon-tag">${icon.folder}</div>
    </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${family} - Icon Set Showcase</title>
  <link rel="stylesheet" href="${family}.css">
  <style>
    body { font-family: system-ui, sans-serif; background: #eef2f7; color: #1e293b; padding: 40px 20px; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 8px; }
    p { text-align: center; color: #64748b; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; max-width: 1100px; margin: 0 auto; }
    .icon-card { background: #eef2f7; border-radius: 16px; padding: 20px 12px; text-align: center; box-shadow: 6px 6px 14px #cad3df, -6px -6px 14px #ffffff; transition: transform 0.15s ease; }
    .icon-card:hover { transform: translateY(-3px); }
    .icon-glyph { font-size: 32px; color: #2563eb; margin-bottom: 12px; height: 36px; line-height: 36px; }
    .icon-name { font-weight: 600; font-size: 13px; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .icon-code { font-family: monospace; font-size: 11px; color: #94a3b8; }
    .icon-tag { font-size: 10px; background: #dfe7f1; color: #475569; padding: 2px 8px; border-radius: 12px; display: inline-block; margin-top: 6px; }
  </style>
</head>
<body>
  <h1>${family}</h1>
  <p>${icons.length} Vector Glyphs Compiled by GlyphForge Studio</p>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`;
}
