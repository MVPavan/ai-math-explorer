import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StepCardProps {
  title: string;
  description: string;
  formula: string;
  icon: LucideIcon;
  children: React.ReactNode;
  colorClass: string;
}

const StepCard: React.FC<StepCardProps> = ({ title, description, formula, icon: Icon, children, colorClass }) => {
  return (
    <div className={`relative flex flex-col w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`}>
      <div className={`px-6 py-4 border-b border-slate-100 ${colorClass} bg-opacity-10 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClass} text-white shadow-sm`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            <p className="text-xs text-slate-500 font-mono">{formula}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-slate-600 mb-6 text-sm leading-relaxed max-w-2xl">
          {description}
        </p>
        <div className="w-full">
            {children}
        </div>
      </div>
    </div>
  );
};

export default StepCard;
