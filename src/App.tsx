import React, { useState, useMemo } from 'react';
import { 
  SystemNode, 
  SystemEdge, 
  SystemLoop, 
  LensMode, 
  FormalEdgeData, 
  FunctionalEdgeData 
} from './types';
import { PRESETS } from './data/presets';
import { detectLoops } from './utils/loopDetector';
import { validateSystem } from './utils/cldValidator';
import { calculateMetrics } from './utils/metrics';
import { ToolMode, Toolbar } from './components/Toolbar';
import { Navbar } from './components/Navbar';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';
import { QualityCheckerModal } from './components/QualityCheckerModal';
import { PresentationBar } from './components/PresentationBar';

export const App: React.FC = () => {
  // Preset & Active Model State
  const [activePresetId, setActivePresetId] = useState<string>('saas-system');
  const initialPreset = PRESETS.find(p => p.id === 'saas-system') || PRESETS[0];

  const [nodes, setNodes] = useState<SystemNode[]>(initialPreset.nodes);
  const [edges, setEdges] = useState<SystemEdge[]>(initialPreset.edges);

  // View & Mode State
  const [lens, setLens] = useState<LensMode>('all');
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  
  // Selection State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Presentation & Modal State
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [presentationStepIndex, setPresentationStepIndex] = useState<number>(0);
  const [showQualityModal, setShowQualityModal] = useState<boolean>(false);

  // Automated Feedback Loop Detection
  const loops = useMemo(() => detectLoops(nodes, edges), [nodes, edges]);

  // Real-time Causal Loop Quality Validator
  const validationIssues = useMemo(() => validateSystem(nodes, edges), [nodes, edges]);

  // Aggregate Metrics over current graph
  const metrics = useMemo(() => calculateMetrics(nodes, edges, loops), [nodes, edges, loops]);

  // Currently selected elements
  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const selectedEdge = useMemo(() => edges.find(e => e.id === selectedEdgeId) || null, [edges, selectedEdgeId]);

  // Active Presentation Steps
  const activePreset = PRESETS.find(p => p.id === activePresetId);
  const presentationSteps = activePreset?.presentationSteps || [];
  const currentStep = presentationSteps[presentationStepIndex];

  // Load Preset
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setActivePresetId(presetId);
    setNodes(preset.nodes);
    setEdges(preset.edges);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedLoopId(null);
    setPresentationStepIndex(0);
  };

  // Clear / New Model
  const handleNewModel = () => {
    setActivePresetId('empty');
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedLoopId(null);
  };

  // Add Node
  const handleAddNode = (x: number, y: number) => {
    const newNode: SystemNode = {
      id: `node-${Date.now()}`,
      label: `New Variable ${nodes.length + 1}`,
      x,
      y,
      cost: 0,
      value: 50,
      baselineValue: 50,
      tags: ['New']
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setToolMode('select');
  };

  // Add Edge
  const handleAddEdge = (sourceId: string, targetId: string, category: 'formal' | 'functional') => {
    const newEdge: SystemEdge = {
      id: `edge-${Date.now()}`,
      source: sourceId,
      target: targetId,
      data: category === 'formal'
        ? {
            category: 'formal',
            cost: 500,
            relationship: 'Hosts / Depends on'
          }
        : {
            category: 'functional',
            polarity: '+',
            delay: false,
            strength: 1.0,
            relationship: 'Drives'
          },
      curvature: category === 'formal' ? 0 : 0.2
    };
    setEdges(prev => [...prev, newEdge]);
    setSelectedEdgeId(newEdge.id);
    setToolMode('select');
  };

  // Update Node
  const handleUpdateNode = (updated: SystemNode) => {
    setNodes(prev => prev.map(n => n.id === updated.id ? updated : n));
  };

  // Update Node Position
  const handleUpdateNodePosition = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  // Delete Node
  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
  };

  // Update Edge
  const handleUpdateEdge = (updated: SystemEdge) => {
    setEdges(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  // Delete Edge
  const handleDeleteEdge = (id: string) => {
    setEdges(prev => prev.filter(e => e.id !== id));
    setSelectedEdgeId(null);
  };

  // Impulse Bump Variable
  const handleBumpSelectedNode = (direction: 'up' | 'down') => {
    if (!selectedNodeId) return;
    const delta = direction === 'up' ? 20 : -20;
    setNodes(prev =>
      prev.map(n =>
        n.id === selectedNodeId
          ? { ...n, value: Math.min(100, Math.max(0, n.value + delta)) }
          : n
      )
    );
  };

  // Export Model JSON
  const handleExportJSON = () => {
    const data = JSON.stringify({ nodes, edges, loops }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modelr-system-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Model JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
          setSelectedLoopId(null);
        }
      } catch (err) {
        alert('Invalid Modelr JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Export Executive System Summary Report
  const handleExportReport = () => {
    const reportText = `# Modelr System Analytical Report
Generated: ${new Date().toLocaleString()}

## 1. System Formal Infrastructure
- Total Structural Formal Cost: $${metrics.totalFormalCost.toLocaleString()}/month
- Node Capital Expenses: $${metrics.nodeCostSum.toLocaleString()}/month
- Relationship Maintenance Expenses: $${metrics.edgeCostSum.toLocaleString()}/month
- Formal Component Count: ${nodes.length}

## 2. Functional Causal Dynamics
- Total Functional Causal Links: ${metrics.functionalEdgeCount}
- Detected Feedback Loops: ${loops.length}
- Reinforcing Growth Loops (R): ${metrics.reinforcingLoopCount}
- Balancing Equilibrium Loops (B): ${metrics.balancingLoopCount}
- System Feedback Density: ${Math.round(metrics.feedbackDensity * 100)}%

## 3. High Leverage Variables
${metrics.topLeverageNodes.map(i => `- ${i.node.label}: ${i.loopCount} feedback loops`).join('\n')}

## 4. Loop Inventory
${loops.map(l => `- ${l.name}: ${l.description}`).join('\n')}
`;

    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modelr-executive-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation */}
      <Navbar
        lens={lens}
        setLens={setLens}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        simulationSpeed={simulationSpeed}
        setSimulationSpeed={setSimulationSpeed}
        validationIssues={validationIssues}
        setShowQualityModal={setShowQualityModal}
        isPresentationMode={isPresentationMode}
        setIsPresentationMode={setIsPresentationMode}
        presets={PRESETS}
        activePresetId={activePresetId}
        loadPreset={handleLoadPreset}
        exportJSON={handleExportJSON}
        importJSON={handleImportJSON}
        exportReport={handleExportReport}
        onNewModel={handleNewModel}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Floating Toolbar */}
        <Toolbar
          toolMode={toolMode}
          setToolMode={setToolMode}
          onBumpSelectedNode={handleBumpSelectedNode}
          selectedNodeId={selectedNodeId}
          onResetView={() => {}}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
        />

        {/* Canvas Surface */}
        <main className="flex-1 h-full relative">
          <Canvas
            nodes={nodes}
            edges={edges}
            loops={loops}
            lens={isPresentationMode && currentStep ? currentStep.lens : lens}
            toolMode={toolMode}
            selectedNodeId={selectedNodeId}
            selectedEdgeId={selectedEdgeId}
            selectedLoopId={selectedLoopId}
            onSelectNode={(id) => {
              setSelectedNodeId(id);
              if (id) setSelectedLoopId(null);
            }}
            onSelectEdge={(id) => {
              setSelectedEdgeId(id);
              if (id) setSelectedLoopId(null);
            }}
            onUpdateNodePosition={handleUpdateNodePosition}
            onAddNode={handleAddNode}
            onAddEdge={handleAddEdge}
            isSimulating={isSimulating}
            simulationSpeed={simulationSpeed}
            focusedNodeIds={isPresentationMode ? currentStep?.focusedNodeIds : undefined}
            focusedEdgeIds={isPresentationMode ? currentStep?.focusedEdgeIds : undefined}
          />

          {/* Presentation Bar in Story Mode */}
          {isPresentationMode && (
            <PresentationBar
              steps={presentationSteps}
              currentStepIndex={presentationStepIndex}
              setCurrentStepIndex={setPresentationStepIndex}
              onExit={() => setIsPresentationMode(false)}
            />
          )}
        </main>

        {/* Right Inspector Drawer */}
        <Inspector
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          nodes={nodes}
          edges={edges}
          loops={loops}
          metrics={metrics}
          lens={lens}
          validationIssues={validationIssues}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onUpdateEdge={handleUpdateEdge}
          onDeleteEdge={handleDeleteEdge}
          selectedLoopId={selectedLoopId}
          onSelectLoop={setSelectedLoopId}
          onClose={() => {
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
          }}
        />
      </div>

      {/* Quality Rules Advisor Modal */}
      {showQualityModal && (
        <QualityCheckerModal
          issues={validationIssues}
          onClose={() => setShowQualityModal(false)}
          onSelectNode={(id) => setSelectedNodeId(id)}
        />
      )}
    </div>
  );
};

export default App;
