import React from 'react';
import { 
  MousePointer, 
  PlusCircle, 
  ArrowRight, 
  GitCommit, 
  Zap, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  HelpCircle,
  Activity
} from 'lucide-react';

export type ToolMode = 'select' | 'add_node' | 'add_formal_edge' | 'add_functional_edge';

interface ToolbarProps {
  toolMode: ToolMode;
  setToolMode: (mode: ToolMode) => void;
  onBumpSelectedNode: (direction: 'up' | 'down') => void;
  selectedNodeId: string | null;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  toolMode,
  setToolMode,
  onBumpSelectedNode,
  selectedNodeId,
  onResetView,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="absolute left-4 top-20 z-10 flex flex-col space-y-3 select-none">
      {/* Primary Creation Tools */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex flex-col space-y-1">
        <button
          onClick={() => setToolMode('select')}
          title="Select / Drag tool (V)"
          className={`p-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all ${
            toolMode === 'select'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <MousePointer className="w-4 h-4" />
        </button>

        <button
          onClick={() => setToolMode('add_node')}
          title="Add Variable Node (N)"
          className={`p-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all ${
            toolMode === 'add_node'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
        </button>

        <div className="h-px bg-slate-800 my-1" />

        {/* Formal Edge Tool */}
        <button
          onClick={() => setToolMode('add_formal_edge')}
          title="Add Formal Relationship (IS / Structural Cost)"
          className={`p-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all ${
            toolMode === 'add_formal_edge'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-blue-400/80 hover:text-blue-300 hover:bg-slate-800/80'
          }`}
        >
          <GitCommit className="w-4 h-4" />
        </button>

        {/* Functional Edge Tool */}
        <button
          onClick={() => setToolMode('add_functional_edge')}
          title="Add Functional Causal Relationship (+/- Polarity / Dynamic Impact)"
          className={`p-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all ${
            toolMode === 'add_functional_edge'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-slate-800/80'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Impulse Controls (Bump signal trigger) */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex flex-col space-y-1">
        <div className="text-[10px] font-semibold uppercase text-slate-500 text-center py-1">Impulse</div>
        <button
          disabled={!selectedNodeId}
          onClick={() => onBumpSelectedNode('up')}
          title="Bump selected variable value UP (+20)"
          className="p-2 rounded-xl text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-30 transition-all flex items-center justify-center"
        >
          <Zap className="w-4 h-4 mr-1 fill-emerald-400/30" />
          <span className="font-bold text-[10px]">+</span>
        </button>
        <button
          disabled={!selectedNodeId}
          onClick={() => onBumpSelectedNode('down')}
          title="Bump selected variable value DOWN (-20)"
          className="p-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 transition-all flex items-center justify-center"
        >
          <Zap className="w-4 h-4 mr-1 fill-rose-400/30 rotate-180" />
          <span className="font-bold text-[10px]">-</span>
        </button>
      </div>

      {/* Viewport Zoom Controls */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex flex-col space-y-1">
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={onResetView}
          title="Reset Zoom & Pan"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
