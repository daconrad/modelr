import { SystemNode, SystemEdge, SystemLoop, FunctionalEdgeData } from '../types';

export function detectLoops(nodes: SystemNode[], edges: SystemEdge[]): SystemLoop[] {
  // Only consider functional edges for Causal Loops
  const functionalEdges = edges.filter(e => e.data.category === 'functional');
  
  if (functionalEdges.length < 2) return [];

  // Build adjacency graph: nodeId -> Array<{ targetId: string, edgeId: string, polarity: '+' | '-' }>
  const adj = new Map<string, Array<{ target: string; edgeId: string; polarity: '+' | '-' }>>();
  nodes.forEach(n => adj.set(n.id, []));

  functionalEdges.forEach(e => {
    const fdata = e.data as FunctionalEdgeData;
    const list = adj.get(e.source);
    if (list) {
      list.push({ target: e.target, edgeId: e.id, polarity: fdata.polarity });
    }
  });

  const rawCycles: Array<Array<{ nodeId: string; edgeId: string; polarity: '+' | '-' }>> = [];
  const visited = new Set<string>();
  const stack: Array<{ nodeId: string; edgeId: string; polarity: '+' | '-' }> = [];
  const inStack = new Set<string>();

  function dfs(currNode: string) {
    visited.add(currNode);
    inStack.add(currNode);

    const neighbors = adj.get(currNode) || [];
    for (const edge of neighbors) {
      if (!inStack.has(edge.target)) {
        if (!visited.has(edge.target)) {
          stack.push({ nodeId: currNode, edgeId: edge.edgeId, polarity: edge.polarity });
          dfs(edge.target);
          stack.pop();
        }
      } else {
        // Cycle detected!
        const cycleStartIndex = stack.findIndex(item => item.nodeId === edge.target);
        if (cycleStartIndex !== -1) {
          const cycleSegment = stack.slice(cycleStartIndex);
          cycleSegment.push({ nodeId: currNode, edgeId: edge.edgeId, polarity: edge.polarity });
          rawCycles.push(cycleSegment);
        } else if (currNode === edge.target) {
          // Self loop
          rawCycles.push([{ nodeId: currNode, edgeId: edge.edgeId, polarity: edge.polarity }]);
        }
      }
    }

    inStack.delete(currNode);
  }

  nodes.forEach(n => {
    if (!visited.has(n.id)) {
      dfs(n.id);
    }
  });

  // Deduplicate cycles based on normalized node sequence
  const uniqueCycles: SystemLoop[] = [];
  const seenCycleKeys = new Set<string>();

  let rCount = 1;
  let bCount = 1;

  rawCycles.forEach(cycle => {
    const nodeIds = cycle.map(item => item.nodeId);
    const edgeIds = cycle.map(item => item.edgeId);

    // Create canonical key for cycle (sorted node set)
    const sortedKey = [...nodeIds].sort().join('->');
    if (seenCycleKeys.has(sortedKey)) return;
    seenCycleKeys.add(sortedKey);

    // Count negative polarities
    const negCount = cycle.filter(item => item.polarity === '-').length;
    const isReinforcing = negCount % 2 === 0;
    const type = isReinforcing ? 'reinforcing' : 'balancing';

    const loopCode = isReinforcing ? `R${rCount++}` : `B${bCount++}`;

    // Get names of variables in loop
    const variableNames = nodeIds
      .map(id => nodes.find(n => n.id === id)?.label)
      .filter(Boolean);

    const name = `${loopCode}: ${isReinforcing ? 'Reinforcing' : 'Balancing'} Loop (${variableNames.slice(0, 2).join(' / ')})`;

    uniqueCycles.push({
      id: `loop-${sortedKey}`,
      name,
      type,
      nodeIds,
      edgeIds,
      description: isReinforcing
        ? `Compounding loop (${negCount} negative links). Amplifies changes in either direction.`
        : `Stabilizing loop (${negCount} negative links). Counteracts change toward equilibrium.`
    });
  });

  return uniqueCycles;
}
