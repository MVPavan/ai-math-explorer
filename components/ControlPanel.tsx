import React from 'react';
import { Plus, Trash2, RotateCcw, Thermometer, Split, GitMerge, ChevronDown, CheckSquare } from 'lucide-react';
import { LogitItem, Mode } from '../types';

interface ControlPanelProps {
  logits: LogitItem[];
  setLogits: React.Dispatch<React.SetStateAction<LogitItem[]>>;
  temperature: number;
  setTemperature: (t: number) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  threshold: number;
  setThreshold: (val: number) => void;
}

const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
];

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  logits, setLogits, temperature, setTemperature, mode, setMode, threshold, setThreshold
}) => {

  const handleLogitChange = (id: string, newValue: number) => {
    setLogits(prev => prev.map(item => item.id === id ? { ...item, value: newValue } : item));
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    setLogits(prev => prev.map(item => item.id === id ? { ...item, label: newLabel } : item));
  };

  const addLogit = () => {
    const nextId = (logits.length + 1).toString();
    const nextColor = COLORS[logits.length % COLORS.length];
    setLogits([...logits, { id: Date.now().toString(), label: `Class ${nextId}`, value: 0, color: nextColor }]);
  };

  const removeLogit = (id: string) => {
    if (logits.length <= 2) return; // Maintain at least 2
    setLogits(logits.filter(l => l.id !== id));
  };

  const reset = () => {
    setTemperature(1);
    setThreshold(0.5);
    setLogits([
      { id: '1', label: 'Cat', value: 3.5, color: '#6366f1' },
      { id: '2', label: 'Dog', value: 1.0, color: '#ec4899' },
      { id: '3', label: 'Car', value: -2.0, color: '#10b981' },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-8 h-fit sticky top-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Parameters</h2>
        <button 
          onClick={reset}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          title="Reset to Defaults"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Mode Selection Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Type</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {mode === 'softmax' ? (
              <GitMerge size={18} className="rotate-90 text-indigo-500" />
            ) : (
              <Split size={18} className="text-emerald-500" />
            )}
          </div>
          <select 
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer transition-all"
          >
            <option value="softmax">Softmax (Single-Label)</option>
            <option value="sigmoid">Sigmoid (Multi-Label)</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Context info based on mode */}
      <div className={`p-4 rounded-lg text-sm border transition-colors duration-300 ${mode === 'softmax' ? 'bg-indigo-50 border-indigo-100 text-indigo-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
        <h4 className="font-bold mb-1 flex items-center gap-2">
          {mode === 'softmax' ? (
            <>One Winner</>
          ) : (
            <>Tagging System</>
          )}
        </h4>
        <p className="opacity-90 leading-relaxed text-xs">
          {mode === 'softmax' 
            ? "Used for 'Multi-class' (1 of N). Classes compete. Probabilities must sum to 100%."
            : "Used for 'Multi-label' (Any of N). Each output is independent. An image can be 'Dog' AND 'Outdoor' AND 'Furry'."}
        </p>
      </div>

      {/* Temperature Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <Thermometer size={16} className="text-orange-500" />
            <span>Temperature (T)</span>
          </div>
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
            {temperature.toFixed(1)}
          </span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="5.0" 
          step="0.1" 
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      {/* Threshold Control - Only for Sigmoid */}
      {mode === 'sigmoid' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <CheckSquare size={16} className="text-emerald-500" />
              <span>Label Threshold</span>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
              {threshold.toFixed(2)}
            </span>
          </div>
          <input 
            type="range" 
            min="0.01" 
            max="0.99" 
            step="0.01" 
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p className="text-[10px] text-slate-400 uppercase font-bold">Labels {'>'} {threshold.toFixed(2)} will be "Active"</p>
        </div>
      )}

      <hr className="border-slate-100" />

      {/* Logits Input */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-700 text-sm">Logits (Raw Scores)</h3>
          <button 
            onClick={addLogit}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors"
          >
            <Plus size={12} /> Add Class
          </button>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {logits.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50 group hover:border-slate-300 transition-all">
              <div className="w-2.5 h-6 rounded-full" style={{ backgroundColor: item.color }}></div>
              <div className="flex-1 min-w-0">
                <input 
                  type="text" 
                  value={item.label} 
                  onChange={(e) => handleLabelChange(item.id, e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none mb-1 truncate"
                />
                <div className="flex items-center gap-2">
                   <input 
                    type="range"
                    min="-10" 
                    max="10" 
                    step="0.1"
                    value={item.value}
                    onChange={(e) => handleLogitChange(item.id, parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400"
                  />
                  <input 
                    type="number" 
                    value={item.value} 
                    onChange={(e) => handleLogitChange(item.id, parseFloat(e.target.value))}
                    className="w-12 text-right text-[10px] p-0.5 rounded border border-slate-200 focus:border-blue-400 outline-none font-mono"
                    step="0.1"
                  />
                </div>
              </div>
              {logits.length > 2 && (
                <button 
                  onClick={() => removeLogit(item.id)}
                  className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;