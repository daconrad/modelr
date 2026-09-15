import React from 'react';
import { LensMode, ValidationIssue, ModelPreset } from '../types';
import { 
  Eye, 
  Play, 
  Pause, 
  Layers, 
  AlertTriangle, 
  Presentation, 
  Download, 
  Upload, 
  FileText, 
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';

interface NavbarProps {
  lens: LensMode;
  setLens: (lens: LensMode) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  validationIssues: ValidationIssue[];
  setShowQualityModal: (show: boolean) => void;
  isPresentationMode: boolean;
  setIsPresentationMode: (pres: boolean) => void;
  presets: ModelPreset[];
  activePresetId: string;
  loadPreset: (presetId: string) => void;
  exportJSON: () => void;
  importJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exportReport: () => void;
  onNewModel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lens,
  setLens,
  isSimulating,
  setIsSimulating,
  simulationSpeed,
  setSimulationSpeed,
  validationIssues,
  setShowQualityModal,
  isPresentationMode,
  setIsPresentationMode,
  presets,
  activePresetId,
  loadPreset,
  exportJSON,
  importJSON,
  exportReport,
  onNewModel,
}) => {
  const errorCount = validationIssues.filter(i => i.type === 'error' || i.type === 'warning').length;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20 select-none">
      {/* Left: Branding & Model Switcher */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-emerald-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight leading-none flex items-center space-x-1.5">
              <span>Modelr</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Systems, Form & Causal Loops</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <select
            value={activePresetId}
            onChange={(e) => loadPreset(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            {presets.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={onNewModel}
            title="Create blank model"
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800 hover:border-slate-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Lenses & Mode Controls */}
      <div className="flex items-center space-x-3">
        {/* Lens Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <div className="flex items-center text-xs text-slate-400 px-2 font-medium">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            Lens:
          </div>
          <button
            onClick={() => setLens('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              lens === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setLens('formal')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              lens === 'formal'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Formal (IS / Cost)
          </button>
          <button
            onClick={() => setLens('functional')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              lens === 'functional'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Functional (DOES)
          </button>
          <button
            onClick={() => setLens('cost_heatmap')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              lens === 'cost_heatmap'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cost Heatmap
          </button>
          <button
            onClick={() => setLens('emergence_map')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              lens === 'emergence_map'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Emergence
          </button>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* Play / Simulate Control */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              isSimulating
                ? 'bg-emerald-500 text-slate-950 animate-pulse shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Simulating' : 'Play Signals'}</span>
          </button>

          {isSimulating && (
            <div className="flex items-center space-x-1 pr-1">
              <span className="text-[10px] text-slate-400">Speed:</span>
              <button
                onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 0.5 : 1)}
                className="text-xs text-indigo-300 font-mono font-bold bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded"
              >
                {simulationSpeed}x
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Validation & Exports */}
      <div className="flex items-center space-x-2">
        {/* Presentation Toggle */}
        <button
          onClick={() => setIsPresentationMode(!isPresentationMode)}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            isPresentationMode
              ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
              : 'text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Presentation className="w-4 h-4 text-purple-400" />
          <span>Story</span>
        </button>

        {/* Causal Validation Badge */}
        <button
          onClick={() => setShowQualityModal(true)}
          className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            errorCount > 0
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              : 'text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${errorCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <span>CLD Rules</span>
          {errorCount > 0 && (
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 rounded-full">
              {errorCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-slate-800" />

        {/* File Actions */}
        <button
          onClick={exportJSON}
          title="Export Model JSON"
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        <label title="Import Model JSON" className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          <input type="file" accept=".json" onChange={importJSON} className="hidden" />
        </label>

        <button
          onClick={exportReport}
          title="Export System Summary Report"
          className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
