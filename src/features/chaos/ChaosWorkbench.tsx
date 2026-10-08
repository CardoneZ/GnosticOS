import React, { useState } from 'react';
import SigilForge from './SigilForge';
import ServitorManager from './ServitorManager';
import { Sparkles, Activity } from 'lucide-react';

interface ChaosWorkbenchProps {
  onAttachSigilToJournal?: (svgString: string, intent: string) => void;
}

export const ChaosWorkbench: React.FC<ChaosWorkbenchProps> = ({
  onAttachSigilToJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'sigils' | 'servitors'>('sigils');

  return (
    <div className="w-full h-full flex flex-col bg-black text-neutral-200 overflow-hidden">
      {/* Top Tab Bar */}
      <div className="px-6 pt-4 pb-2 border-b border-neutral-900 bg-neutral-950/60 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sigils')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'sigils'
                ? 'bg-neutral-900 border border-red-700/60 text-white font-bold shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            Austin Osman Spare Sigil Forge
          </button>

          <button
            onClick={() => setActiveTab('servitors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'servitors'
                ? 'bg-neutral-900 border border-purple-700/60 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Servitor Lifecycle & Thoughtforms
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'sigils' ? (
          <SigilForge onAttachToJournal={onAttachSigilToJournal} />
        ) : (
          <ServitorManager />
        )}
      </div>
    </div>
  );
};

export default ChaosWorkbench;
