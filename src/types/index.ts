export type EdgeCategory = 'formal' | 'functional';

export type LinkPolarity = '+' | '-';

export interface SystemNode {
  id: string;
  label: string;
  x: number;
  y: number;
  cost: number; // Structural / Formal cost ($ / month)
  value: number; // Dynamic state value (0 - 100)
  baselineValue: number;
  tags: string[];
  notes?: string;
}

export interface FormalEdgeData {
  category: 'formal';
  cost: number; // Maintenance or dependency cost
  relationship: string; // e.g. "Hosts", "Employs", "Contains"
}

export interface FunctionalEdgeData {
  category: 'functional';
  polarity: LinkPolarity; // '+' = Same direction, '-' = Opposite direction
  delay: boolean; // Time delay flag (||)
  strength: number; // 0.1 to 2.0 dynamic impact multiplier
  relationship: string; // e.g. "Increases", "Drives", "Reduces"
}

export type EdgeData = FormalEdgeData | FunctionalEdgeData;

export interface SystemEdge {
  id: string;
  source: string;
  target: string;
  data: EdgeData;
  curvature?: number; // Visual curved arrow offset
}

export type LoopType = 'reinforcing' | 'balancing';

export interface SystemLoop {
  id: string;
  name: string;
  type: LoopType;
  nodeIds: string[];
  edgeIds: string[];
  description?: string;
}

export type LensMode = 'all' | 'formal' | 'functional' | 'cost_heatmap' | 'emergence_map';

export interface SignalPulse {
  id: string;
  edgeId: string;
  progress: number; // 0 to 1
  polarity: LinkPolarity;
  delta: number; // Magnitude of change (+10 or -10)
  speed: number;
}

export interface ValidationIssue {
  id: string;
  nodeId?: string;
  edgeId?: string;
  type: 'error' | 'warning' | 'info';
  category: 'noun_phrase' | 'direction' | 'negation' | 'unconnected' | 'loop_polarity';
  message: string;
  suggestion?: string;
}

export interface PresentationStep {
  id: string;
  title: string;
  description: string;
  lens: LensMode;
  focusedNodeIds?: string[];
  focusedEdgeIds?: string[];
  zoomLevel?: number;
  panOffset?: { x: number; y: number };
}

export interface ModelPreset {
  id: string;
  name: string;
  description: string;
  nodes: SystemNode[];
  edges: SystemEdge[];
  presentationSteps?: PresentationStep[];
}
