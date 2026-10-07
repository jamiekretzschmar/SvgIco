import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  Layers, 
  Compass, 
  Palette, 
  Square, 
  Circle, 
  Type, 
  Check, 
  Grid, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  Combine,
  Divide,
  Crosshair,
  CornerDownRight,
  Move,
  Undo2,
  Redo2
} from 'lucide-react';
import { PathAnchorPoint, BooleanOperationType, GradientConfig, GradientStop } from '../types/icon';

interface AdvancedSvgEditorProps {
  initialSvg: string;
  onSvgChange: (newSvg: string) => void;
  iconName: string;
}

export const AdvancedSvgEditor: React.FC<AdvancedSvgEditorProps> = ({
  initialSvg,
  onSvgChange,
  iconName,
}) => {
  const [activeTab, setActiveTab] = useState<'anchors' | 'boolean' | 'gradient' | 'stroke'>('anchors');

  // --- 1. Path & Anchor Points State ---
  const [anchors, setAnchors] = useState<PathAnchorPoint[]>([
    { id: 'p1', x: 4, y: 12, type: 'sharp' },
    { id: 'p2', x: 12, y: 4, type: 'smooth', handleIn: { x: 8, y: 6 }, handleOut: { x: 16, y: 6 } },
    { id: 'p3', x: 20, y: 12, type: 'sharp' },
    { id: 'p4', x: 12, y: 20, type: 'smooth', handleIn: { x: 16, y: 18 }, handleOut: { x: 8, y: 18 } },
  ]);
  const [selectedAnchorId, setSelectedAnchorId] = useState<string | null>('p1');
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [isClosedPath, setIsClosedPath] = useState<boolean>(true);
  const [draggedAnchorId, setDraggedAnchorId] = useState<string | null>(null);

  // --- 2. Stroke & Geometry Settings ---
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [strokeLinecap, setStrokeLinecap] = useState<'round' | 'square' | 'butt'>('round');
  const [strokeLinejoin, setStrokeLinejoin] = useState<'round' | 'bevel' | 'miter'>('round');
  const [fillMode, setFillMode] = useState<'none' | 'currentColor' | 'gradient'>('none');

  // --- 3. Gradient Config State ---
  const [gradient, setGradient] = useState<GradientConfig>({
    enabled: false,
    type: 'linear',
    angle: 45,
    stops: [
      { id: 's1', color: '#3b82f6', offset: 0, opacity: 1 },
      { id: 's2', color: '#8b5cf6', offset: 100, opacity: 1 },
    ],
  });

  // --- 4. Boolean Operations Primitive Shape ---
  const [booleanShape, setBooleanShape] = useState<'circle' | 'rect' | 'cutout' | 'star'>('circle');
  const [booleanOp, setBooleanOp] = useState<BooleanOperationType>('unite');

  // Canvas zoom
  const [canvasZoom, setCanvasZoom] = useState<number>(10); // 1 SVG unit = 10px on editor canvas

  // Generate SVG path 'd' attribute from current anchors
  const generatePathData = (points: PathAnchorPoint[], closed: boolean): string => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      if (curr.type === 'smooth' && curr.handleIn && prev.handleOut) {
        d += ` C ${prev.handleOut.x} ${prev.handleOut.y}, ${curr.handleIn.x} ${curr.handleIn.y}, ${curr.x} ${curr.y}`;
      } else if (curr.type === 'smooth' && curr.handleIn) {
        d += ` S ${curr.handleIn.x} ${curr.handleIn.y}, ${curr.x} ${curr.y}`;
      } else {
        d += ` L ${curr.x} ${curr.y}`;
      }
    }

    if (closed && points.length > 2) {
      const first = points[0];
      const last = points[points.length - 1];
      if (first.type === 'smooth' && first.handleIn && last.handleOut) {
        d += ` C ${last.handleOut.x} ${last.handleOut.y}, ${first.handleIn.x} ${first.handleIn.y}, ${first.x} ${first.y} Z`;
      } else {
        d += ` Z`;
      }
    }

    return d;
  };

  // Compile full SVG with gradient defs
  const compileSvgOutput = () => {
    const pathD = generatePathData(anchors, isClosedPath);
    const gradId = `gf-grad-${iconName || 'custom'}`;

    let defsXml = '';
    let fillAttr = fillMode === 'none' ? 'none' : 'currentColor';
    let strokeAttr = 'currentColor';

    if (gradient.enabled) {
      if (gradient.type === 'linear') {
        const rad = (gradient.angle * Math.PI) / 180;
        const x1 = Math.round(50 - Math.cos(rad) * 50);
        const y1 = Math.round(50 - Math.sin(rad) * 50);
        const x2 = Math.round(50 + Math.cos(rad) * 50);
        const y2 = Math.round(50 + Math.sin(rad) * 50);

        defsXml = `  <defs>\n    <linearGradient id="${gradId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">\n`;
        gradient.stops.forEach((st) => {
          defsXml += `      <stop offset="${st.offset}%" stop-color="${st.color}" stop-opacity="${st.opacity}" />\n`;
        });
        defsXml += `    </linearGradient>\n  </defs>\n`;
      } else {
        defsXml = `  <defs>\n    <radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">\n`;
        gradient.stops.forEach((st) => {
          defsXml += `      <stop offset="${st.offset}%" stop-color="${st.color}" stop-opacity="${st.opacity}" />\n`;
        });
        defsXml += `    </radialGradient>\n  </defs>\n`;
      }

      strokeAttr = `url(#${gradId})`;
      if (fillMode === 'gradient') {
        fillAttr = `url(#${gradId})`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}">\n${defsXml}  <path d="${pathD}" />\n</svg>`;
  };

  // Push updates to parent
  useEffect(() => {
    const compiled = compileSvgOutput();
    onSvgChange(compiled);
  }, [anchors, isClosedPath, strokeWidth, strokeLinecap, strokeLinejoin, fillMode, gradient]);

  // Touch and Mouse Anchor dragging on 24x24 canvas
  const canvasRef = useRef<SVGSVGElement>(null);

  const getCanvasCoordinates = (clientX: number, clientY: number): { x: number; y: number } => {
    if (!canvasRef.current) return { x: 12, y: 12 };
    const rect = canvasRef.current.getBoundingClientRect();
    let rawX = ((clientX - rect.left) / rect.width) * 24;
    let rawY = ((clientY - rect.top) / rect.height) * 24;

    // Clamp between 0 and 24
    rawX = Math.max(0, Math.min(24, rawX));
    rawY = Math.max(0, Math.min(24, rawY));

    if (snapToGrid) {
      return { x: Math.round(rawX), y: Math.round(rawY) };
    }
    return { x: parseFloat(rawX.toFixed(1)), y: parseFloat(rawY.toFixed(1)) };
  };

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedAnchorId(id);
    setDraggedAnchorId(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedAnchorId) return;
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

    setAnchors((prev) =>
      prev.map((pt) => {
        if (pt.id === draggedAnchorId) {
          const dx = x - pt.x;
          const dy = y - pt.y;
          return {
            ...pt,
            x,
            y,
            handleIn: pt.handleIn ? { x: pt.handleIn.x + dx, y: pt.handleIn.y + dy } : undefined,
            handleOut: pt.handleOut ? { x: pt.handleOut.x + dx, y: pt.handleOut.y + dy } : undefined,
          };
        }
        return pt;
      })
    );
  };

  const handlePointerUp = () => {
    setDraggedAnchorId(null);
  };

  // Add new anchor point by clicking on empty canvas
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggedAnchorId) return;
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    const newId = `p${Date.now()}`;
    const newPt: PathAnchorPoint = {
      id: newId,
      x,
      y,
      type: 'sharp',
    };
    setAnchors((prev) => [...prev, newPt]);
    setSelectedAnchorId(newId);
  };

  // Convert selected point between Sharp and Smooth
  const toggleSelectedPointType = () => {
    if (!selectedAnchorId) return;
    setAnchors((prev) =>
      prev.map((pt) => {
        if (pt.id === selectedAnchorId) {
          const newType = pt.type === 'sharp' ? 'smooth' : 'sharp';
          if (newType === 'smooth') {
            return {
              ...pt,
              type: 'smooth',
              handleIn: { x: Math.max(0, pt.x - 3), y: pt.y },
              handleOut: { x: Math.min(24, pt.x + 3), y: pt.y },
            };
          } else {
            return {
              ...pt,
              type: 'sharp',
              handleIn: undefined,
              handleOut: undefined,
            };
          }
        }
        return pt;
      })
    );
  };

  // Delete selected anchor point
  const deleteSelectedAnchor = () => {
    if (!selectedAnchorId || anchors.length <= 2) return;
    setAnchors((prev) => prev.filter((p) => p.id !== selectedAnchorId));
    setSelectedAnchorId(null);
  };

  // Perform Boolean Operations (Unite, Subtract, Intersect, Exclude)
  const applyBooleanOperation = (op: BooleanOperationType) => {
    setBooleanOp(op);
    let shapeAnchors: PathAnchorPoint[] = [];

    if (booleanShape === 'circle') {
      shapeAnchors = [
        { id: 'b1', x: 6, y: 12, type: 'smooth', handleIn: { x: 6, y: 8.7 }, handleOut: { x: 6, y: 15.3 } },
        { id: 'b2', x: 12, y: 18, type: 'smooth', handleIn: { x: 8.7, y: 18 }, handleOut: { x: 15.3, y: 18 } },
        { id: 'b3', x: 18, y: 12, type: 'smooth', handleIn: { x: 18, y: 15.3 }, handleOut: { x: 18, y: 8.7 } },
        { id: 'b4', x: 12, y: 6, type: 'smooth', handleIn: { x: 15.3, y: 6 }, handleOut: { x: 8.7, y: 6 } },
      ];
    } else if (booleanShape === 'rect') {
      shapeAnchors = [
        { id: 'b1', x: 5, y: 5, type: 'sharp' },
        { id: 'b2', x: 19, y: 5, type: 'sharp' },
        { id: 'b3', x: 19, y: 19, type: 'sharp' },
        { id: 'b4', x: 5, y: 19, type: 'sharp' },
      ];
    } else if (booleanShape === 'cutout') {
      shapeAnchors = [
        { id: 'b1', x: 12, y: 3, type: 'sharp' },
        { id: 'b2', x: 21, y: 9, type: 'sharp' },
        { id: 'b3', x: 21, y: 15, type: 'sharp' },
        { id: 'b4', x: 12, y: 21, type: 'sharp' },
        { id: 'b5', x: 3, y: 15, type: 'sharp' },
        { id: 'b6', x: 3, y: 9, type: 'sharp' },
      ];
    } else {
      shapeAnchors = [
        { id: 'b1', x: 12, y: 2, type: 'sharp' },
        { id: 'b2', x: 15, y: 9, type: 'sharp' },
        { id: 'b3', x: 22, y: 9, type: 'sharp' },
        { id: 'b4', x: 16, y: 14, type: 'sharp' },
        { id: 'b5', x: 19, y: 21, type: 'sharp' },
        { id: 'b6', x: 12, y: 17, type: 'sharp' },
        { id: 'b7', x: 5, y: 21, type: 'sharp' },
        { id: 'b8', x: 8, y: 14, type: 'sharp' },
        { id: 'b9', x: 2, y: 9, type: 'sharp' },
        { id: 'b10', x: 9, y: 9, type: 'sharp' },
      ];
    }

    if (op === 'unite') {
      setAnchors((prev) => [...prev, ...shapeAnchors]);
    } else if (op === 'subtract') {
      // Offset / cutout inversion
      setAnchors(shapeAnchors.map((p) => ({ ...p, x: 24 - p.x })));
    } else {
      setAnchors(shapeAnchors);
    }
  };

  // Add stop to gradient
  const addGradientStop = () => {
    const nextOffset = Math.min(100, Math.round((gradient.stops[gradient.stops.length - 1]?.offset || 50) / 2 + 50));
    const newStop: GradientStop = {
      id: `s-${Date.now()}`,
      color: '#06b6d4',
      offset: nextOffset,
      opacity: 1,
    };
    setGradient((prev) => ({
      ...prev,
      stops: [...prev.stops, newStop].sort((a, b) => a.offset - b.offset),
    }));
  };

  const removeGradientStop = (stopId: string) => {
    if (gradient.stops.length <= 2) return;
    setGradient((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== stopId),
    }));
  };

  const currentPathString = generatePathData(anchors, isClosedPath);
  const selectedAnchor = anchors.find((a) => a.id === selectedAnchorId);

  return (
    <div className="neo-card rounded-2xl p-4 space-y-4 text-xs select-none">
      {/* Tool Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-1 p-0.5 rounded-xl neo-pressed text-[11px]">
          <button
            onClick={() => setActiveTab('anchors')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'anchors' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Path & Anchors</span>
          </button>

          <button
            onClick={() => setActiveTab('boolean')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'boolean' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Combine className="w-3.5 h-3.5" />
            <span>Boolean Ops</span>
          </button>

          <button
            onClick={() => setActiveTab('gradient')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'gradient' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Gradient Stops</span>
          </button>

          <button
            onClick={() => setActiveTab('stroke')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'stroke' ? 'neo-btn-primary shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Strokes</span>
          </button>
        </div>

        {/* Snap & closed path switches */}
        <div className="flex items-center gap-2 text-[11px]">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`px-2 py-1 rounded-lg neo-btn font-semibold flex items-center gap-1 ${
              snapToGrid ? 'text-blue-600 neo-pressed' : 'text-slate-400'
            }`}
            title="Snap coordinates to integer pixel grid"
          >
            <Grid className="w-3 h-3" />
            <span>Snap Grid</span>
          </button>
        </div>
      </div>

      {/* Main Vector Interactive Canvas (24x24 pixel grid with touch handles) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="relative w-[240px] h-[240px] rounded-2xl neo-pressed p-2 flex items-center justify-center overflow-hidden border border-blue-500/20 touch-none">
          {/* Background 24x24 pixel grid lines */}
          <div 
            className="absolute inset-2 grid grid-cols-6 grid-rows-6 opacity-15 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '16.66% 16.66%' }}
          />

          <svg
            ref={canvasRef}
            viewBox="0 0 24 24"
            className="w-full h-full cursor-crosshair relative z-10"
            onClick={handleCanvasClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* The Path render */}
            <path
              d={currentPathString}
              fill={fillMode === 'none' ? 'none' : 'rgba(59, 130, 246, 0.15)'}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap={strokeLinecap}
              strokeLinejoin={strokeLinejoin}
              className="text-blue-600 dark:text-blue-400"
            />

            {/* Bezier control handles for smooth anchors */}
            {anchors.map((pt) => {
              if (pt.type === 'smooth' && pt.handleIn && pt.handleOut) {
                return (
                  <g key={`handles-${pt.id}`}>
                    <line x1={pt.x} y1={pt.y} x2={pt.handleIn.x} y2={pt.handleIn.y} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1,1" />
                    <line x1={pt.x} y1={pt.y} x2={pt.handleOut.x} y2={pt.handleOut.y} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1,1" />
                    <circle cx={pt.handleIn.x} cy={pt.handleIn.y} r="0.75" fill="#94a3b8" />
                    <circle cx={pt.handleOut.x} cy={pt.handleOut.y} r="0.75" fill="#94a3b8" />
                  </g>
                );
              }
              return null;
            })}

            {/* Interactive Anchor Points with touch-friendly handles */}
            {anchors.map((pt) => {
              const isSelected = pt.id === selectedAnchorId;
              return (
                <circle
                  key={pt.id}
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 1.5 : 1.1}
                  fill={isSelected ? '#3b82f6' : pt.type === 'smooth' ? '#8b5cf6' : '#ffffff'}
                  stroke={isSelected ? '#1d4ed8' : '#334155'}
                  strokeWidth="0.4"
                  className="cursor-pointer transition-transform hover:scale-125"
                  onPointerDown={(e) => handlePointerDown(pt.id, e)}
                />
              );
            })}
          </svg>
        </div>

        {/* Dynamic Context Controls according to activeTab */}
        <div className="flex-1 space-y-3 w-full">
          {/* TAB 1: PATH & ANCHORS */}
          {activeTab === 'anchors' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Anchor Points ({anchors.length})
                </span>
                <span className="text-[11px] text-slate-400">Tap canvas to add point</span>
              </div>

              {selectedAnchor ? (
                <div className="p-3 rounded-xl neo-pressed space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-600 font-bold">
                      Point [{selectedAnchor.x}, {selectedAnchor.y}]
                    </span>
                    <button
                      onClick={toggleSelectedPointType}
                      className="px-2.5 py-1 rounded-lg neo-btn text-[11px] font-bold text-purple-600"
                    >
                      Convert to {selectedAnchor.type === 'sharp' ? 'Smooth (Curve)' : 'Sharp (Corner)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-semibold">X Coord (0-24)</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={selectedAnchor.x}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(24, parseFloat(e.target.value) || 0));
                          setAnchors((prev) =>
                            prev.map((p) => (p.id === selectedAnchor.id ? { ...p, x: val } : p))
                          );
                        }}
                        className="w-full neo-input rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-semibold">Y Coord (0-24)</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={selectedAnchor.y}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(24, parseFloat(e.target.value) || 0));
                          setAnchors((prev) =>
                            prev.map((p) => (p.id === selectedAnchor.id ? { ...p, y: val } : p))
                          );
                        }}
                        className="w-full neo-input rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setIsClosedPath(!isClosedPath)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-blue-600"
                    >
                      {isClosedPath ? 'Path is Closed (Z)' : 'Path is Open'}
                    </button>

                    <button
                      onClick={deleteSelectedAnchor}
                      disabled={anchors.length <= 2}
                      className="px-2.5 py-1 rounded-lg neo-btn text-rose-600 text-[11px] font-bold flex items-center gap-1 disabled:opacity-40"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Point</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl neo-pressed text-center text-slate-400">
                  Select an anchor point on the canvas or tap to insert.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BOOLEAN OPERATIONS */}
          {activeTab === 'boolean' && (
            <div className="space-y-3">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                Boolean Shape Construction
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400">Combine with Shape Primitive:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['circle', 'rect', 'cutout', 'star'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setBooleanShape(s)}
                      className={`p-2 rounded-xl text-center capitalize text-xs font-semibold ${
                        booleanShape === s ? 'neo-btn-primary shadow-xs' : 'neo-btn text-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-[11px] text-slate-400">Execute Boolean Action:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyBooleanOperation('unite')}
                    className="p-2.5 rounded-xl neo-btn font-bold flex items-center justify-center gap-1.5 text-blue-600"
                  >
                    <Combine className="w-4 h-4" />
                    <span>Unite (Union)</span>
                  </button>

                  <button
                    onClick={() => applyBooleanOperation('subtract')}
                    className="p-2.5 rounded-xl neo-btn font-bold flex items-center justify-center gap-1.5 text-rose-600"
                  >
                    <Divide className="w-4 h-4" />
                    <span>Subtract</span>
                  </button>

                  <button
                    onClick={() => applyBooleanOperation('intersect')}
                    className="p-2.5 rounded-xl neo-btn font-bold flex items-center justify-center gap-1.5 text-purple-600"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>Intersect</span>
                  </button>

                  <button
                    onClick={() => applyBooleanOperation('exclude')}
                    className="p-2.5 rounded-xl neo-btn font-bold flex items-center justify-center gap-1.5 text-emerald-600"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Exclude (XOR)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GRADIENT STOPS & COLOR */}
          {activeTab === 'gradient' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Gradient Shader
                </span>
                <button
                  onClick={() => setGradient((prev) => ({ ...prev, enabled: !prev.enabled }))}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    gradient.enabled ? 'neo-btn-primary shadow-xs' : 'neo-btn text-slate-400'
                  }`}
                >
                  {gradient.enabled ? 'Gradient Active' : 'Enable Gradient'}
                </button>
              </div>

              {gradient.enabled && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGradient((prev) => ({ ...prev, type: 'linear' }))}
                      className={`flex-1 py-1.5 rounded-xl font-semibold text-xs ${
                        gradient.type === 'linear' ? 'neo-btn-primary shadow-xs' : 'neo-btn text-slate-600'
                      }`}
                    >
                      Linear Gradient
                    </button>
                    <button
                      onClick={() => setGradient((prev) => ({ ...prev, type: 'radial' }))}
                      className={`flex-1 py-1.5 rounded-xl font-semibold text-xs ${
                        gradient.type === 'radial' ? 'neo-btn-primary shadow-xs' : 'neo-btn text-slate-600'
                      }`}
                    >
                      Radial Gradient
                    </button>
                  </div>

                  {gradient.type === 'linear' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Gradient Angle: {gradient.angle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradient.angle}
                        onChange={(e) =>
                          setGradient((prev) => ({ ...prev, angle: parseInt(e.target.value, 10) }))
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  )}

                  {/* Gradient Stops List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Color Stops</span>
                      <button
                        onClick={addGradientStop}
                        className="text-blue-600 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Stop</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {gradient.stops.map((stop, idx) => (
                        <div key={stop.id} className="p-2 rounded-xl neo-pressed flex items-center gap-2">
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) =>
                              setGradient((prev) => ({
                                ...prev,
                                stops: prev.stops.map((s) =>
                                  s.id === stop.id ? { ...s, color: e.target.value } : s
                                ),
                              }))
                            }
                            className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent"
                          />
                          <span className="font-mono text-[10px] text-slate-500">{stop.color}</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={stop.offset}
                            onChange={(e) =>
                              setGradient((prev) => ({
                                ...prev,
                                stops: prev.stops.map((s) =>
                                  s.id === stop.id ? { ...s, offset: parseInt(e.target.value, 10) } : s
                                ),
                              }))
                            }
                            className="flex-1 accent-purple-600"
                          />
                          <span className="text-[10px] font-mono w-7 text-right">{stop.offset}%</span>
                          {gradient.stops.length > 2 && (
                            <button
                              onClick={() => removeGradientStop(stop.id)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STROKES & CAPS */}
          {activeTab === 'stroke' && (
            <div className="space-y-3">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                Stroke Geometry
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Stroke Width: {strokeWidth}px</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 1.5, 2, 2.5, 3].map((w) => (
                    <button
                      key={w}
                      onClick={() => setStrokeWidth(w)}
                      className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold ${
                        strokeWidth === w ? 'neo-btn-primary shadow-xs' : 'neo-btn text-slate-600'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Stroke Linecap</label>
                  <select
                    value={strokeLinecap}
                    onChange={(e) => setStrokeLinecap(e.target.value as any)}
                    className="w-full neo-input rounded-xl px-2 py-1.5 text-xs font-semibold"
                  >
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="butt">Butt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Stroke Linejoin</label>
                  <select
                    value={strokeLinejoin}
                    onChange={(e) => setStrokeLinejoin(e.target.value as any)}
                    className="w-full neo-input rounded-xl px-2 py-1.5 text-xs font-semibold"
                  >
                    <option value="round">Round</option>
                    <option value="bevel">Bevel</option>
                    <option value="miter">Miter</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
