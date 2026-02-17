import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderModuleProps {
  title: string;
}

const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 p-8 text-center">
      <div className="p-6 bg-slate-100 rounded-full mb-6">
        <Construction size={48} className="text-slate-300" />
      </div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">{title} Coming Soon</h2>
      <p className="max-w-md mx-auto">
        We are working on adding this mathematical visualization. Check back later for interactive demos on {title}.
      </p>
    </div>
  );
};

export default PlaceholderModule;
