import React from 'react';
import { Mail, Flame, Archive } from 'lucide-react';

interface DreamLetterModalProps {
  content: string;
  onKeep: () => void;
  onBurn: () => void;
}

const DreamLetterModal: React.FC<DreamLetterModalProps> = ({ content, onKeep, onBurn }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-6">
      <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-lg shadow-2xl p-8 relative overflow-hidden">
        {/* 信纸纹理 */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
            <Mail className="text-stone-400" size={24} />
          </div>
          
          <h3 className="text-xl text-stone-200 font-serif-sc tracking-widest">梦境来信</h3>
          
          <div className="w-full p-6 bg-stone-800/50 rounded border border-stone-700/50">
            <p className="text-stone-300 text-sm leading-loose font-serif-sc italic">
              "{content}"
            </p>
          </div>

          <div className="flex gap-4 w-full pt-4">
            <button 
              onClick={onBurn}
              className="flex-1 py-3 border border-stone-700 text-stone-500 hover:text-orange-400 hover:border-orange-900/50 hover:bg-orange-900/10 transition-all flex items-center justify-center gap-2 text-xs tracking-widest group"
            >
              <Flame size={14} className="group-hover:animate-pulse"/> 焚烧
            </button>
            <button 
              onClick={onKeep}
              className="flex-1 py-3 bg-stone-200 text-stone-900 hover:bg-white transition-all flex items-center justify-center gap-2 text-xs tracking-widest font-bold"
            >
              <Archive size={14}/> 珍藏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamLetterModal;