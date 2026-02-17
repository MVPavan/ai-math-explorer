import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LabelList, ReferenceLine
} from 'recharts';
import { Layers, ArrowDown, Divide, Zap, PieChart as PieChartIcon, Activity, CheckCircle2 } from 'lucide-react';
import StepCard from '../../components/StepCard';
import { StepData, Mode } from './types';
import { formatNumber } from './utils';

interface VisualizationFlowProps {
  data: StepData[];
  temperature: number;
  mode: Mode;
  threshold: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-50">
        <p className="font-bold mb-1">{data.label}</p>
        <p className="font-mono">Value: {formatNumber(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const VisualizationFlow: React.FC<VisualizationFlowProps> = ({ data, temperature, mode, threshold }) => {

  const maxLogit = Math.max(...data.map(d => Math.abs(d.originalLogit)));
  const maxScaled = Math.max(...data.map(d => Math.abs(d.scaledLogit)));
  
  const logitDomain = [-Math.max(5, maxLogit), Math.max(5, maxLogit)];
  const scaledDomain = [-Math.max(5, maxScaled), Math.max(5, maxScaled)];

  const selectedLabels = data.filter(item => item.probability >= threshold);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Step 1: Raw Logits */}
      <StepCard 
        title="1. Input Logits (z)" 
        description="The raw scores output by the neural network's last linear layer. These can be any real number, positive or negative."
        formula="z = [z₁, z₂, ..., zₖ]"
        icon={Layers}
        colorClass="bg-slate-500"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="label" tick={{fontSize: 12, fontWeight: 500}} />
              <YAxis domain={logitDomain} hide />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#cbd5e1" />
              <Bar dataKey="originalLogit" radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
                <LabelList dataKey="originalLogit" position="top" formatter={(val: number) => val.toFixed(1)} style={{ fill: '#64748b', fontSize: '11px', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </StepCard>

      <div className="flex justify-center -my-3 z-10">
        <div className="bg-slate-100 p-2 rounded-full border border-slate-200 text-slate-400 shadow-sm">
            <ArrowDown size={20} />
        </div>
      </div>

      {/* Step 2: Scaling by Temperature */}
      <StepCard 
        title="2. Scaling (z / T)" 
        description={`Scale logits by T = ${temperature}. This adjusts the 'softness' of the decisions before activation.`}
        formula="hᵢ = zᵢ / T"
        icon={Divide}
        colorClass="bg-orange-500"
      >
         <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="label" tick={{fontSize: 12, fontWeight: 500}} />
              <YAxis domain={scaledDomain} hide />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#cbd5e1" />
              <Bar dataKey="scaledLogit" radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
                <LabelList dataKey="scaledLogit" position="top" formatter={(val: number) => val.toFixed(2)} style={{ fill: '#64748b', fontSize: '11px', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </StepCard>

      <div className="flex justify-center -my-3 z-10">
        <div className="bg-slate-100 p-2 rounded-full border border-slate-200 text-slate-400 shadow-sm">
            <ArrowDown size={20} />
        </div>
      </div>

      {mode === 'softmax' ? (
        <>
          <StepCard 
            title="3. Exponentiation (eʰ)" 
            description="Apply the natural exponential function. This makes all values positive and exaggerates differences."
            formula="eʰᵢ = exp(zᵢ / T)"
            icon={Zap}
            colorClass="bg-purple-500"
          >
             <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="label" tick={{fontSize: 12, fontWeight: 500}} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="exponential" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                     <LabelList 
                        dataKey="exponential" 
                        position="top" 
                        formatter={(val: number) => formatNumber(val)} 
                        style={{ fill: '#64748b', fontSize: '11px', fontWeight: 'bold' }} 
                     />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </StepCard>

          <div className="flex justify-center -my-3 z-10">
            <div className="bg-slate-100 p-2 rounded-full border border-slate-200 text-slate-400 shadow-sm">
                <ArrowDown size={20} />
            </div>
          </div>

          <StepCard 
            title="4. Probabilities (P)" 
            description="Normalized distribution summing to 1.0. If one class probability goes up, another must go down."
            formula="P(i) = eʰᵢ / Σ eʰⱼ"
            icon={PieChartIcon}
            colorClass="bg-emerald-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis dataKey="label" type="category" width={80} tick={{fontSize: 12, fontWeight: 600}} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                             <LabelList 
                                dataKey="probability" 
                                position="right" 
                                formatter={(val: number) => (val * 100).toFixed(1) + '%'} 
                                style={{ fill: '#475569', fontSize: '12px', fontWeight: 'bold' }} 
                            />
                        </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="h-64 w-full flex justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="probability"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={45}
                                paddingAngle={2}
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                     </ResponsiveContainer>
                 </div>
            </div>
          </StepCard>
        </>
      ) : (
        <>
          <StepCard 
            title="3. Independent Sigmoids" 
            description="Apply Sigmoid to each output. Each class is an independent probability. Note the threshold line."
            formula="P(i) = 1 / (1 + e^(-hᵢ))"
            icon={Activity}
            colorClass="bg-emerald-500"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 5 }} layout="vertical">
                  <XAxis type="number" domain={[0, 1]} ticks={[0, threshold, 1]} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis dataKey="label" type="category" width={80} tick={{fontSize: 12, fontWeight: 600}} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={threshold} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: `Threshold: ${threshold}`, fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                  <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={24}>
                    {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          fillOpacity={entry.probability >= threshold ? 1 : 0.4} 
                          stroke={entry.probability >= threshold ? '#000' : 'none'}
                          strokeWidth={1}
                        />
                    ))}
                      <LabelList 
                        dataKey="probability" 
                        position="right" 
                        formatter={(val: number) => (val * 100).toFixed(1) + '%'} 
                        style={{ fill: '#475569', fontSize: '11px', fontWeight: 'bold' }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                 <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                 <div className="flex-1 min-w-0">
                   <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Selected Labels (Multi-Label)</h4>
                   <div className="flex flex-wrap gap-2 mt-1.5">
                      {selectedLabels.length > 0 ? selectedLabels.map(l => (
                        <span key={l.id} className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: l.color }}>
                          {l.label}
                        </span>
                      )) : (
                        <span className="text-[10px] text-slate-400 italic">No labels selected (all below threshold)</span>
                      )}
                   </div>
                 </div>
              </div>
            </div>
          </StepCard>
        </>
      )}

    </div>
  );
};

export default VisualizationFlow;