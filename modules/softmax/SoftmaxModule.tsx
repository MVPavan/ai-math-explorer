import React, { useState, useMemo } from 'react';
import { LogitItem, Mode } from './types';
import ControlPanel from './ControlPanel';
import VisualizationFlow from './VisualizationFlow';
import { calculateSoftmaxSteps, calculateSigmoidSteps } from './utils';
import { HelpCircle } from 'lucide-react';

const SoftmaxModule: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(1.0);
  const [mode, setMode] = useState<Mode>('softmax');
  const [threshold, setThreshold] = useState<number>(0.5);
  
  const [logits, setLogits] = useState<LogitItem[]>([
    { id: '1', label: 'Cat', value: 3.5, color: '#6366f1' },
    { id: '2', label: 'Dog', value: 1.0, color: '#ec4899' },
    { id: '3', label: 'Car', value: -2.0, color: '#10b981' },
  ]);

  const stepData = useMemo(() => {
    return mode === 'softmax' 
      ? calculateSoftmaxSteps(logits, temperature)
      : calculateSigmoidSteps(logits, temperature);
  }, [logits, temperature, mode]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Controls & Info */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6 h-fit">
            <ControlPanel 
              logits={logits} 
              setLogits={setLogits} 
              temperature={temperature} 
              setTemperature={setTemperature}
              mode={mode}
              setMode={setMode}
              threshold={threshold}
              setThreshold={setThreshold}
            />
            
            <div className={`text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group transition-colors duration-300 ${mode === 'softmax' ? 'bg-indigo-900 border border-indigo-700' : 'bg-emerald-900 border border-emerald-700'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <HelpCircle size={80} />
                </div>
                <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                  Common Scenarios
                </h3>
                <div className="space-y-3 relative z-10 text-xs leading-relaxed opacity-90">
                    {mode === 'softmax' ? (
                      <>
                        <p><strong>Image Recognition (1 Object):</strong> Identifying if an image is a <em>cat</em> OR a <em>dog</em>.</p>
                        <p><strong>Language Modeling:</strong> Predicting the <em>single next word</em> in a sentence.</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Object Detection:</strong> Finding ALL objects in an image (e.g., <em>Cat</em>, <em>Dog</em>, and <em>Table</em> are all present).</p>
                        <p><strong>Tagging:</strong> Labeling a blog post with multiple tags (e.g., <em>AI</em>, <em>Math</em>, <em>Web</em>).</p>
                      </>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Right Area: Visualization Pipeline */}
        <div className="lg:col-span-8">
          <VisualizationFlow data={stepData} temperature={temperature} mode={mode} threshold={threshold} />
        </div>

      </div>
    </div>
  );
};

export default SoftmaxModule;