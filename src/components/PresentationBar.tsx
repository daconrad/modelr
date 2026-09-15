import React from 'react';
import { PresentationStep } from '../types';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';

interface PresentationBarProps {
  steps: PresentationStep[];
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  onExit: () => void;
}

export const PresentationBar: React.FC<PresentationBarProps> = ({
  steps,
  currentStepIndex,
  setCurrentStepIndex,
  onExit,
}) => {
  if (!steps || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-3xl px-4 select-none">
      <div className="bg-slate-900/95 backdrop-blur-md border border-purple-500/40 rounded-2xl p-4 shadow-2xl flex flex-col space-y-3">
        {/* Step Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-purple-500 text-slate-950 text-xs font-bold font-mono px-2 py-0.5 rounded-full">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <h3 className="font-bold text-sm text-purple-200">
              {currentStep.title}
            </h3>
          </div>

          <button
            onClick={onExit}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Narrative */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStepIndex ? 'bg-purple-400 w-4' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 transition-all shadow-md shadow-purple-600/30"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
