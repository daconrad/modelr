import { SystemNode, SystemEdge, SystemLoop, FormalEdgeData, FunctionalEdgeData } from '../types';

export interface ModelMetrics {
  totalFormalCost: number;
  nodeCostSum: number;
  edgeCostSum: number;
  formalEdgeCount: number;
  functionalEdgeCount: number;
  reinforcingLoopCount: number;
  balancingLoopCount: number;
  feedbackDensity: number; // 0 to 1
  topLeverageNodes: Array<{ node: SystemNode; loopCount: number; degree: number }>;
  highestCostNodes: SystemNode[];
}

export function calculateMetrics(
  nodes: SystemNode[],
  edges: SystemEdge[],
  loops: SystemLoop[]
): ModelMetrics {
  let nodeCostSum = 0;
  nodes.forEach(n => {
    nodeCostSum += n.cost || 0;
  });

  let edgeCostSum = 0;
  let formalEdgeCount = 0;
  let functionalEdgeCount = 0;

  edges.forEach(e => {
    if (e.data.category === 'formal') {
      formalEdgeCount++;
      const fdata = e.data as FormalEdgeData;
      edgeCostSum += fdata.cost || 0;
    } else {
      functionalEdgeCount++;
    }
  });

  const totalFormalCost = nodeCostSum + edgeCostSum;

  const reinforcingLoopCount = loops.filter(l => l.type === 'reinforcing').length;
  const balancingLoopCount = loops.filter(l => l.type === 'balancing').length;

  // Nodes involved in loops
  const loopNodeSet = new Set<string>();
  loops.forEach(l => l.nodeIds.forEach(id => loopNodeSet.add(id)));
  const feedbackDensity = nodes.length > 0 ? loopNodeSet.size / nodes.length : 0;

  // Calculate leverage score (degree in functional graph + loop appearances)
  const nodeLoopAppearances = new Map<string, number>();
  loops.forEach(l => {
    l.nodeIds.forEach(id => {
      nodeLoopAppearances.set(id, (nodeLoopAppearances.get(id) || 0) + 1);
    });
  });

  const functionalDegree = new Map<string, number>();
  edges.forEach(e => {
    if (e.data.category === 'functional') {
      functionalDegree.set(e.source, (functionalDegree.get(e.source) || 0) + 1);
      functionalDegree.set(e.target, (functionalDegree.get(e.target) || 0) + 1);
    }
  });

  const topLeverageNodes = nodes
    .map(node => {
      const loopCount = nodeLoopAppearances.get(node.id) || 0;
      const degree = functionalDegree.get(node.id) || 0;
      return { node, loopCount, degree };
    })
    .filter(item => item.loopCount > 0 || item.degree > 0)
    .sort((a, b) => b.loopCount * 2 + b.degree - (a.loopCount * 2 + a.degree))
    .slice(0, 5);

  const highestCostNodes = [...nodes]
    .filter(n => n.cost > 0)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  return {
    totalFormalCost,
    nodeCostSum,
    edgeCostSum,
    formalEdgeCount,
    functionalEdgeCount,
    reinforcingLoopCount,
    balancingLoopCount,
    feedbackDensity,
    topLeverageNodes,
    highestCostNodes
  };
}
