import React, { useState } from 'react';
import { 
  Calculator, 
  Brain, 
  Split, 
  Menu, 
  X, 
  Zap, 
  Search,
  ChevronRight
} from 'lucide-react';
import { AppModule } from './types';
import SoftmaxModule from './modules/softmax/SoftmaxModule';
import PlaceholderModule from './components/PlaceholderModule';

// Registry of all available math modules
const MODULES: AppModule[] = [
  {
    id: 'softmax',
    title: 'Output Activation',
    description: 'Softmax vs Sigmoid: How AI makes decisions.',
    icon: Split,
    component: SoftmaxModule,
    color: 'indigo'
  },
  {
    id: 'attention',
    title: 'Self-Attention',
    description: 'The core mechanism of Transformers (GPT).',
    icon: Brain,
    component: () => <PlaceholderModule title="Self-Attention" />,
    color: 'amber'
  },
  {
    id: 'relu',
    title: 'ReLU & Nonlinearity',
    description: 'Why neurons need activation functions.',
    icon: Zap,
    component: () => <PlaceholderModule title="ReLU & Activation" />,
    color: 'emerald'
  }
];

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>(MODULES[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];
  const ActiveComponent = activeModule.component;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Calculator size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">AI Math Explorer</span>
            </div>
            <button 
              className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Module List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">
              Modules
            </div>
            {MODULES.map((module) => {
              const isActive = activeModuleId === module.id;
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => {
                    setActiveModuleId(module.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all
                    ${isActive 
                      ? 'bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${isActive ? 'bg-white text-' + module.color + '-600 shadow-sm' : 'bg-slate-100 text-slate-400'}
                  `}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{module.title}</div>
                    <div className="text-xs opacity-70 truncate">{module.description}</div>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-slate-400" />}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 text-center">
                   <strong>Beta v0.2</strong> <br/> More modules coming soon.
                </p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
             >
               <Menu size={20} />
             </button>
             <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   {activeModule.title}
                </h2>
             </div>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-500">
                <Search size={14} />
                <span>Quick Find (cmd+k)</span>
             </div>
           </div>
        </header>

        {/* Scrollable Module Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default App;
