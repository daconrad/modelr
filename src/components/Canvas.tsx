import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  SystemNode, 
  SystemEdge, 
  SystemLoop, 
  LensMode, 
  SignalPulse, 
  FormalEdgeData, 
  FunctionalEdgeData 
} from '../types';
import { ToolMode } from './Toolbar';
import { Zap, DollarSign, Activity, AlertCircle, Clock } from 'lucide-react';

interface CanvasProps {
  nodes: SystemNode[];
  edges: SystemEdge[];
  loops: SystemLoop[];
  lens: LensMode;
  toolMode: ToolMode;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  selectedLoopId: string | null;
  onSelectNode: (id: string | null) => void;
  onSelectEdge: (id: string | null) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  onAddNode: (x: number, y: number) => void;
  onAddEdge: (sourceId: string, targetId: string, category: 'formal' | 'functional') => void;
  isSimulating: boolean;
  simulationSpeed: number;
  focusedNodeIds?: string[];
  focusedEdgeIds?: string[];
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  loops,
  lens,
  toolMode,
  selectedNodeId,
  selectedEdgeId,
  selectedLoopId,
  onSelectNode,
  onSelectEdge,
  onUpdateNodePosition,
  onAddNode,
  onAddEdge,
  isSimulating,
  simulationSpeed,
  focusedNodeIds,
  focusedEdgeIds,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pan and Zoom viewport state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Edge creation state
  const [edgeSourceId, setEdgeSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Live simulation particles
  const [pulses, setPulses] = useState<SignalPulse[]>([]);

  // Selected loop details
  const activeLoop = loops.find(l => l.id === selectedLoopId);

  // Helper: Convert client coordinates to canvas world coordinates
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;
    return {
      x: (rawX - pan.x) / zoom,
      y: (rawY - pan.y) / zoom,
    };
  }, [pan, zoom]);

  // Handle canvas click / background click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target !== containerRef.current && (e.target as HTMLElement).tagName !== 'svg') return;

    if (toolMode === 'add_node') {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      onAddNode(Math.round(coords.x), Math.round(coords.y));
    } else {
      onSelectNode(null);
      onSelectEdge(null);
      setEdgeSourceId(null);
    }
  };

  // Node mouse down (selection / drag / edge drawing)
  const handleNodeMouseDown = (e: React.MouseEvent, node: SystemNode) => {
    e.stopPropagation();

    if (toolMode === 'add_formal_edge' || toolMode === 'add_functional_edge') {
      if (!edgeSourceId) {
        setEdgeSourceId(node.id);
      } else if (edgeSourceId !== node.id) {
        const category = toolMode === 'add_formal_edge' ? 'formal' : 'functional';
        onAddEdge(edgeSourceId, node.id, category);
        setEdgeSourceId(null);
      }
      return;
    }

    onSelectNode(node.id);
    onSelectEdge(null);
    setDraggingNodeId(node.id);

    const coords = getCanvasCoords(e.clientX, e.clientY);
    setDragOffset({
      x: coords.x - node.x,
      y: coords.y - node.y,
    });
  };

  // Canvas Mouse Move (Dragging node / Panning / Drawing edge preview)
  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setMousePos(coords);

    if (draggingNodeId) {
      onUpdateNodePosition(
        draggingNodeId,
        Math.round(coords.x - dragOffset.x),
        Math.round(coords.y - dragOffset.y)
      );
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  // Middle-click / spacebar pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.4, Math.min(2.5, zoom * zoomFactor));
    setZoom(newZoom);
  };

  // Simulation Particle Loop (Loopy Style)
  useEffect(() => {
    if (!isSimulating) {
      setPulses([]);
      return;
    }

    const functionalEdges = edges.filter(e => e.data.category === 'functional');
    if (functionalEdges.length === 0) return;

    // Spawn new pulses periodically
    const spawnInterval = setInterval(() => {
      // Pick random edge or edge from active node
      const randomEdge = functionalEdges[Math.floor(Math.random() * functionalEdges.length)];
      const fdata = randomEdge.data as FunctionalEdgeData;

      setPulses(prev => [
        ...prev,
        {
          id: `pulse-${Date.now()}-${Math.random()}`,
          edgeId: randomEdge.id,
          progress: 0,
          polarity: fdata.polarity,
          delta: fdata.polarity === '+' ? 5 : -5,
          speed: (fdata.delay ? 0.008 : 0.02) * simulationSpeed,
        }
      ]);
    }, 1200 / simulationSpeed);

    // Animation frame for moving pulses
    let animId: number;
    const updatePulses = () => {
      setPulses(prev => {
        return prev
          .map(p => ({
            ...p,
            progress: p.progress + p.speed,
          }))
          .filter(p => p.progress <= 1.0);
      });

      animId = requestAnimationFrame(updatePulses);
    };

    animId = requestAnimationFrame(updatePulses);

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(animId);
    };
  }, [isSimulating, edges, simulationSpeed]);

  // Calculate curve midpoint and Bezier control point for functional curved edges
  const getCurvePath = (source: SystemNode, target: SystemNode, curvature: number = 0.2) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return { path: '', midX: source.x, midY: source.y };

    const normX = dx / dist;
    const normY = dy / dist;

    // Normal vector perpendicular to edge line
    const perpX = -normY;
    const perpY = normX;

    const offset = dist * curvature;
    const ctrlX = (source.x + target.x) / 2 + perpX * offset;
    const ctrlY = (source.y + target.y) / 2 + perpY * offset;

    // Quadratic Bezier curve
    const path = `M ${source.x} ${source.y} Q ${ctrlX} ${ctrlY} ${target.x} ${target.y}`;

    // Midpoint along quadratic curve at t=0.5
    const midX = 0.25 * source.x + 0.5 * ctrlX + 0.25 * target.x;
    const midY = 0.25 * source.y + 0.5 * ctrlY + 0.25 * target.y;

    return { path, ctrlX, ctrlY, midX, midY, dist };
  };

  // Compute loop center coordinates for badge placement
  const getLoopCenter = (loop: SystemLoop) => {
    const loopNodes = nodes.filter(n => loop.nodeIds.includes(n.id));
    if (loopNodes.length === 0) return { x: 0, y: 0 };
    const avgX = loopNodes.reduce((sum, n) => sum + n.x, 0) / loopNodes.length;
    const avgY = loopNodes.reduce((sum, n) => sum + n.y, 0) / loopNodes.length;
    return { x: avgX, y: avgY };
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      className="relative w-full h-full bg-slate-950 overflow-hidden cursor-crosshair select-none"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(51,65,85,0.25) 1px, transparent 1px)',
        backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    >
      {/* SVG Layer for Edges, Polarity Badges, Loops, and Signals */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          {/* Arrow markers for functional links */}
          <marker
            id="arrow-functional-plus"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
          </marker>

          <marker
            id="arrow-functional-minus"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
          </marker>

          <marker
            id="arrow-formal"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>

          {/* Glow filter for emergence map */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Render Edges */}
        {edges.map(edge => {
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          if (!source || !target) return null;

          const isFormal = edge.data.category === 'formal';
          const fdata = edge.data as FunctionalEdgeData;
          const formalData = edge.data as FormalEdgeData;

          // Lens Filtering Visibility
          const isDimmed =
            (lens === 'formal' && !isFormal) ||
            (lens === 'functional' && isFormal) ||
            (focusedEdgeIds && focusedEdgeIds.length > 0 && !focusedEdgeIds.includes(edge.id));

          const isSelected = selectedEdgeId === edge.id;
          const isInActiveLoop = activeLoop?.edgeIds.includes(edge.id);

          const curvature = edge.curvature ?? (isFormal ? 0 : 0.2);
          const { path, midX, midY } = getCurvePath(source, target, curvature);

          return (
            <g
              key={edge.id}
              className={`transition-opacity duration-300 pointer-events-auto cursor-pointer ${
                isDimmed ? 'opacity-15' : 'opacity-100'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEdge(edge.id);
                onSelectNode(null);
              }}
            >
              {/* Edge line */}
              <path
                d={path}
                fill="none"
                stroke={
                  isSelected
                    ? '#a855f7'
                    : isInActiveLoop
                    ? '#eab308'
                    : isFormal
                    ? '#3b82f6'
                    : fdata.polarity === '+'
                    ? '#10b981'
                    : '#f43f5e'
                }
                strokeWidth={isSelected || isInActiveLoop ? 3.5 : isFormal ? 2 : 2.5}
                strokeDasharray={isFormal ? '6,4' : 'none'}
                markerEnd={
                  isFormal
                    ? 'url(#arrow-formal)'
                    : fdata.polarity === '+'
                    ? 'url(#arrow-functional-plus)'
                    : 'url(#arrow-functional-minus)'
                }
              />

              {/* Polarity Badge or Cost Label overlay */}
              <g transform={`translate(${midX}, ${midY})`}>
                {!isFormal ? (
                  <g className="cursor-pointer">
                    <circle
                      r="12"
                      className={`${
                        fdata.polarity === '+'
                          ? 'fill-emerald-950 stroke-emerald-500'
                          : 'fill-rose-950 stroke-rose-500'
                      } stroke-2 shadow-lg`}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      className={`text-xs font-bold font-mono fill-current ${
                        fdata.polarity === '+' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {fdata.polarity}
                    </text>

                    {/* Delay marker */}
                    {fdata.delay && (
                      <g transform="translate(14, -10)">
                        <rect width="12" height="12" rx="3" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                        <text textAnchor="middle" x="6" y="9" className="text-[9px] font-bold fill-slate-300 font-mono">
                          ||
                        </text>
                      </g>
                    )}
                  </g>
                ) : (
                  <g className="cursor-pointer">
                    <rect
                      x="-28"
                      y="-10"
                      width="56"
                      height="20"
                      rx="6"
                      className="fill-slate-900 stroke-blue-500/80 stroke-1 shadow-md"
                    />
                    <text
                      textAnchor="middle"
                      dy="3"
                      className="text-[10px] font-mono font-semibold fill-blue-300"
                    >
                      ${formalData.cost}/m
                    </text>
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* 2. Dynamic Particle Signals (Loopy Pulse Animations) */}
        {pulses.map(pulse => {
          const edge = edges.find(e => e.id === pulse.edgeId);
          if (!edge) return null;
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          if (!source || !target) return null;

          const curvature = edge.curvature ?? (edge.data.category === 'formal' ? 0 : 0.2);
          const { path } = getCurvePath(source, target, curvature);

          // Interpolate point along curve using SVG Point API or calculation
          const ctrlX = (source.x + target.x) / 2 + (target.y - source.y) * curvature;
          const ctrlY = (source.y + target.y) / 2 - (target.x - source.x) * curvature;

          const t = pulse.progress;
          const px = (1 - t) * (1 - t) * source.x + 2 * (1 - t) * t * ctrlX + t * t * target.x;
          const py = (1 - t) * (1 - t) * source.y + 2 * (1 - t) * t * ctrlY + t * t * target.y;

          return (
            <g key={pulse.id} transform={`translate(${px}, ${py})`}>
              <circle
                r="6"
                className={`${
                  pulse.polarity === '+'
                    ? 'fill-emerald-400 shadow-emerald-400/50'
                    : 'fill-rose-400 shadow-rose-400/50'
                } animate-ping opacity-75`}
              />
              <circle
                r="5"
                className={`${
                  pulse.polarity === '+' ? 'fill-emerald-300' : 'fill-rose-300'
                }`}
              />
            </g>
          );
        })}

        {/* 3. Feedback Loop Center Badges */}
        {loops.map(loop => {
          const center = getLoopCenter(loop);
          const isSelected = selectedLoopId === loop.id;
          const isReinforcing = loop.type === 'reinforcing';

          if (lens === 'formal') return null; // Hide CLD loops in Formal Lens

          return (
            <g
              key={loop.id}
              transform={`translate(${center.x}, ${center.y})`}
              className="cursor-pointer pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(null);
                onSelectEdge(null);
              }}
            >
              <circle
                r={isSelected ? "22" : "18"}
                className={`${
                  isReinforcing
                    ? 'fill-amber-950/90 stroke-amber-500'
                    : 'fill-cyan-950/90 stroke-cyan-500'
                } stroke-2 shadow-2xl transition-all ${isSelected ? 'scale-110' : ''}`}
              />
              <text
                textAnchor="middle"
                dy="4"
                className={`text-xs font-black font-mono fill-current ${
                  isReinforcing ? 'text-amber-400' : 'text-cyan-400'
                }`}
              >
                {isReinforcing ? '↺ R' : '↻ B'}
              </text>
            </g>
          );
        })}

        {/* 4. Interactive Edge Creation Preview Line */}
        {edgeSourceId && (
          <line
            x1={nodes.find(n => n.id === edgeSourceId)?.x || 0}
            y1={nodes.find(n => n.id === edgeSourceId)?.y || 0}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke={toolMode === 'add_formal_edge' ? '#3b82f6' : '#10b981'}
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        )}
      </svg>

      {/* HTML Layer for Node UI Cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          const isDimmed =
            focusedNodeIds && focusedNodeIds.length > 0 && !focusedNodeIds.includes(node.id);

          // Heatmap color calculation for Cost Lens
          const costHeatColor =
            node.cost > 30000
              ? 'border-rose-500/80 bg-rose-950/40 shadow-rose-900/30'
              : node.cost > 10000
              ? 'border-amber-500/80 bg-amber-950/40 shadow-amber-900/30'
              : node.cost > 0
              ? 'border-blue-500/80 bg-blue-950/40 shadow-blue-900/30'
              : 'border-slate-800 bg-slate-900/90';

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              className={`absolute pointer-events-auto rounded-2xl p-3 w-56 border-2 backdrop-blur-md shadow-2xl transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-105 z-20'
                  : lens === 'cost_heatmap'
                  ? costHeatColor
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/95'
              } ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Header: Label & Cost Tag */}
              <div className="flex items-start justify-between space-x-2">
                <h3 className="font-semibold text-xs text-slate-100 leading-snug line-clamp-2">
                  {node.label}
                </h3>
                {node.cost > 0 && (
                  <span className="shrink-0 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md flex items-center">
                    ${(node.cost / 1000).toFixed(1)}k
                  </span>
                )}
              </div>

              {/* Dynamic State Meter (0 - 100) */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span>Level</span>
                  <span className="font-bold text-indigo-300">{Math.round(node.value)}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden p-[1px] border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, node.value))}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              {node.tags && node.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {node.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700/60 px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
