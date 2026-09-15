import { SystemNode, SystemEdge, ValidationIssue } from '../types';

const ACTIVE_VERBS = [
  'increase', 'increasing', 'decreased', 'decreasing', 'grow', 'growing',
  'raise', 'raising', 'reduce', 'reducing', 'improve', 'improving',
  'lower', 'lowering', 'drop', 'dropping', 'boost', 'boosting', 'decline'
];

const NEGATIVE_PREFIXES = ['non-', 'non ', 'un-', 'un', 'dis-', 'dis', 'im-', 'in-', 'anti-'];

const GENERIC_SINGLE_WORDS = ['delivery', 'staff', 'cost', 'time', 'process', 'data', 'user', 'service'];

export function validateSystem(nodes: SystemNode[], edges: SystemEdge[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Edge map for connectivity
  const connectedNodeIds = new Set<string>();
  edges.forEach(e => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  nodes.forEach(node => {
    const label = node.label.trim();
    const lowerLabel = label.toLowerCase();

    // 1. Unconnected node check
    if (!connectedNodeIds.has(node.id) && nodes.length > 1) {
      issues.push({
        id: `unconnected-${node.id}`,
        nodeId: node.id,
        type: 'warning',
        category: 'unconnected',
        message: `Variable "${label}" is isolated with no incoming or outgoing connections.`,
        suggestion: 'Connect this variable to formal dependencies or functional cause-and-effect paths.'
      });
    }

    // 2. Active verb check (Variables should be nouns, not actions)
    const firstWord = lowerLabel.split(/\s+/)[0];
    if (ACTIVE_VERBS.includes(firstWord)) {
      issues.push({
        id: `verb-${node.id}`,
        nodeId: node.id,
        type: 'warning',
        category: 'noun_phrase',
        message: `"${label}" begins with an active verb ("${firstWord}"). CLD variables should be nouns or noun phrases.`,
        suggestion: `Rename to state the variable quantity (e.g. use "Customer Growth Rate" instead of "Increase Customers").`
      });
    }

    // 3. Negation prefix check
    for (const prefix of NEGATIVE_PREFIXES) {
      if (lowerLabel.startsWith(prefix) && prefix.length >= 3) {
        issues.push({
          id: `negation-${node.id}`,
          nodeId: node.id,
          type: 'info',
          category: 'negation',
          message: `Variable "${label}" uses a negative formulation ("${prefix}"). CLDs are clearest with positively phrased variables.`,
          suggestion: `Consider positive phrasing (e.g. use "Customer Satisfaction" instead of "Dissatisfaction", or "Compliance Rate" instead of "Non-compliance").`
        });
        break;
      }
    }

    // 4. Direction sense check
    if (GENERIC_SINGLE_WORDS.includes(lowerLabel)) {
      issues.push({
        id: `direction-${node.id}`,
        nodeId: node.id,
        type: 'info',
        category: 'direction',
        message: `Variable "${label}" is very general. Variables should express a clear sense of direction or measurable property.`,
        suggestion: `Be specific, e.g. "${label.charAt(0).toUpperCase() + label.slice(1)} Velocity", "${label} Capacity", or "${label} Count".`
      });
    }
  });

  return issues;
}
