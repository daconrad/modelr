import React from 'react';
import { ValidationIssue } from '../types';
import { X, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface QualityCheckerModalProps {
  issues: ValidationIssue[];
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

export const QualityCheckerModal: React.FC<QualityCheckerModalProps> = ({
  issues,
  onClose,
  onSelectNode,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base text-slate-100">
              Causal Loop Diagram Quality Advisor
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Rules Guidance Header */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <h3 className="font-semibold text-indigo-400 uppercase tracking-wider text-[11px]">
              System Dynamics Guidelines
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li><strong>Variables should be nouns or noun phrases</strong> (e.g. "Customer Trust", not "Trusting").</li>
              <li><strong>Variables should have a clear sense of direction</strong> (e.g. "Delivery Speed" rather than "Delivery").</li>
              <li><strong>Avoid prefix indicating negation</strong> (e.g. prefer "Satisfaction" over "Dissatisfaction").</li>
              <li><strong>Link Polarity</strong>: Positive ($+$) means changes in same direction; Negative ($-$) means opposite.</li>
            </ul>
          </div>

          {/* Active Issues List */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Active Graph Suggestions ({issues.length})
            </h3>

            {issues.length === 0 ? (
              <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>All variables comply with Causal Loop Diagram guidelines!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {issues.map(issue => (
                  <div
                    key={issue.id}
                    onClick={() => {
                      if (issue.nodeId) {
                        onSelectNode(issue.nodeId);
                        onClose();
                      }
                    }}
                    className="p-4 rounded-xl border bg-slate-950 border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        issue.type === 'error'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : issue.type === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {issue.category.replace('_', ' ')}
                      </span>
                      {issue.nodeId && (
                        <span className="text-[11px] text-indigo-400 group-hover:underline flex items-center">
                          Inspect Node <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {issue.message}
                    </p>

                    {issue.suggestion && (
                      <p className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-lg font-mono">
                        💡 {issue.suggestion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
