import React, { useState } from 'react';
import { 
  SystemNode, 
  SystemEdge, 
  SystemLoop, 
  LensMode, 
  FormalEdgeData, 
  FunctionalEdgeData, 
  ValidationIssue 
} from '../types';
import { ModelMetrics } from '../utils/metrics';
import { 
  X, 
  Edit3, 
  DollarSign, 
  ArrowRightLeft, 
  RotateCcw, 
  Trash2, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Tag,
  FileText
} from 'lucide-react';

interface InspectorProps {
  selectedNode: SystemNode | null;
  selectedEdge: SystemEdge | null;
  nodes: SystemNode[];
  edges: SystemEdge[];
  loops: SystemLoop[];
  metrics: ModelMetrics;
  lens: LensMode;
  validationIssues: ValidationIssue[];
  onUpdateNode: (node: SystemNode) => void;
  onDeleteNode: (id: string) => void;
  onUpdateEdge: (edge: SystemEdge) => void;
  onDeleteEdge: (id: string) => void;
  selectedLoopId: string | null;
  onSelectLoop: (id: string | null) => void;
  onClose: () => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  selectedNode,
  selectedEdge,
  nodes,
  edges,
  loops,
  metrics,
  lens,
  validationIssues,
  onUpdateNode,
  onDeleteNode,
  onUpdateEdge,
  onDeleteEdge,
  selectedLoopId,
  onSelectLoop,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'loops' | 'lens'>('details');

  // Find validation warnings for selected node
  const nodeIssues = selectedNode
    ? validationIssues.filter(i => i.nodeId === selectedNode.id)
    : [];

  return (
    <aside className="w-80 h-[calc(100vh-4rem)] bg-slate-900 border-l border-slate-800 flex flex-col z-10 select-none overflow-hidden shadow-2xl">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 bg-slate-950">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'details'
                ? 'bg-slate-800 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inspector
          </button>
          <button
            onClick={() => setActiveTab('loops')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
              activeTab === 'loops'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Loops</span>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 rounded-full font-mono font-bold">
              {loops.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('lens')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'lens'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Metrics
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab 1: Inspector (Node or Edge Details) */}
      {activeTab === 'details' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Node Title & Type */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                  Variable Node
                </span>
                <button
                  onClick={() => onDeleteNode(selectedNode.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                  title="Delete Variable"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Label Edit */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Variable Label
                </label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => onUpdateNode({ ...selectedNode, label: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* CLD Rule Warnings for this node */}
              {nodeIssues.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center text-xs font-semibold text-amber-300 space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>CLD Quality Suggestion</span>
                  </div>
                  {nodeIssues.map(issue => (
                    <div key={issue.id} className="text-[11px] text-amber-200/90 leading-normal">
                      <p>{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-[10px] text-amber-400 italic mt-0.5">{issue.suggestion}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic Value Slider */}
              <div>
                <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                  <span className="font-medium">Current Level</span>
                  <span className="font-mono font-bold text-indigo-400">{Math.round(selectedNode.value)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedNode.value}
                  onChange={(e) => onUpdateNode({ ...selectedNode, value: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2"
                />
              </div>

              {/* Formal Cost Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Structural Cost ($ / month)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="number"
                    value={selectedNode.cost}
                    onChange={(e) => onUpdateNode({ ...selectedNode, cost: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Formal structural expense attributable to maintaining this entity.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={selectedNode.tags.join(', ')}
                  onChange={(e) =>
                    onUpdateNode({
                      ...selectedNode,
                      tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes / Documentation
                </label>
                <textarea
                  rows={3}
                  value={selectedNode.notes || ''}
                  onChange={(e) => onUpdateNode({ ...selectedNode, notes: e.target.value })}
                  placeholder="System role, documentation, or assumptions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ) : selectedEdge ? (
            <div className="space-y-4">
              {/* Edge Header */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                  selectedEdge.data.category === 'formal'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {selectedEdge.data.category} Relationship
                </span>
                <button
                  onClick={() => onDeleteEdge(selectedEdge.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                  title="Delete Relationship"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Relationship Category Switcher */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Relationship Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => {
                      onUpdateEdge({
                        ...selectedEdge,
                        data: {
                          category: 'formal',
                          cost: 500,
                          relationship: 'Hosts / Contains'
                        }
                      });
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedEdge.data.category === 'formal'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Formal (IS)
                  </button>
                  <button
                    onClick={() => {
                      onUpdateEdge({
                        ...selectedEdge,
                        data: {
                          category: 'functional',
                          polarity: '+',
                          delay: false,
                          strength: 1.0,
                          relationship: 'Drives'
                        }
                      });
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedEdge.data.category === 'functional'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Functional (DOES)
                  </button>
                </div>
              </div>

              {/* Functional Specific Controls */}
              {selectedEdge.data.category === 'functional' && (
                <>
                  {/* Link Polarity Switcher */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Link Polarity (Causal Direction)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const fdata = selectedEdge.data as FunctionalEdgeData;
                          onUpdateEdge({
                            ...selectedEdge,
                            data: { ...fdata, polarity: '+' }
                          });
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 transition-all ${
                          (selectedEdge.data as FunctionalEdgeData).polarity === '+'
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-sm font-mono">+</span>
                        <span>Same Direction</span>
                      </button>

                      <button
                        onClick={() => {
                          const fdata = selectedEdge.data as FunctionalEdgeData;
                          onUpdateEdge({
                            ...selectedEdge,
                            data: { ...fdata, polarity: '-' }
                          });
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 transition-all ${
                          (selectedEdge.data as FunctionalEdgeData).polarity === '-'
                            ? 'bg-rose-950 border-rose-500 text-rose-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-sm font-mono">-</span>
                        <span>Opposite</span>
                      </button>
                    </div>
                  </div>

                  {/* Delay Toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Time Delay (||)</h4>
                      <p className="text-[10px] text-slate-500">Causal effect is not instantaneous.</p>
                    </div>
                    <button
                      onClick={() => {
                        const fdata = selectedEdge.data as FunctionalEdgeData;
                        onUpdateEdge({
                          ...selectedEdge,
                          data: { ...fdata, delay: !fdata.delay }
                        });
                      }}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        (selectedEdge.data as FunctionalEdgeData).delay
                          ? 'bg-indigo-600'
                          : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          (selectedEdge.data as FunctionalEdgeData).delay ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}

              {/* Formal Specific Controls */}
              {selectedEdge.data.category === 'formal' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Relationship Maintenance Cost ($ / month)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="number"
                      value={(selectedEdge.data as FormalEdgeData).cost}
                      onChange={(e) => {
                        const fdata = selectedEdge.data as FormalEdgeData;
                        onUpdateEdge({
                          ...selectedEdge,
                          data: { ...fdata, cost: Math.max(0, parseFloat(e.target.value) || 0) }
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Layers className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs font-medium text-slate-400">Nothing Selected</p>
              <p className="text-[11px] leading-normal max-w-[200px] mx-auto">
                Click any Variable Node or Relationship Link on the canvas to inspect and modify properties.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Feedback Loops */}
      {activeTab === 'loops' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Detected Causal Feedback Loops ({loops.length})
          </div>

          {loops.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No feedback loops detected yet. Connect functional variables in a circular cause-and-effect path to form loops.
            </div>
          ) : (
            loops.map(loop => {
              const isSelected = selectedLoopId === loop.id;
              const isReinforcing = loop.type === 'reinforcing';

              return (
                <div
                  key={loop.id}
                  onClick={() => onSelectLoop(isSelected ? null : loop.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? isReinforcing
                        ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                        : 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      isReinforcing
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {loop.name.split(':')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {loop.nodeIds.length} variables
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100">{loop.name}</h4>
                  {loop.description && (
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      {loop.description}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: System Metrics Summary */}
      {activeTab === 'lens' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            System Analytical Summary
          </h3>

          {/* Cost Metric Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Formal Cost Burden</span>
            <div className="text-2xl font-bold font-mono text-blue-400">
              ${metrics.totalFormalCost.toLocaleString()}<span className="text-xs text-slate-500">/mo</span>
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-900">
              <span>Node Expenses: ${metrics.nodeCostSum.toLocaleString()}</span>
              <span>Edge Cost: ${metrics.edgeCostSum.toLocaleString()}</span>
            </div>
          </div>

          {/* Emergence / Dynamics Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Causal Feedback Density</span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-emerald-400">
                {Math.round(metrics.feedbackDensity * 100)}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {metrics.reinforcingLoopCount} Reinforcing / {metrics.balancingLoopCount} Balancing
              </span>
            </div>
          </div>

          {/* Top Leverage Variables */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2">High Leverage Variables</h4>
            <div className="space-y-1.5">
              {metrics.topLeverageNodes.map(item => (
                <div key={item.node.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-200">{item.node.label}</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    {item.loopCount} loops
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
