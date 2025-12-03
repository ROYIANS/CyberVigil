import React from 'react';

interface EntranceProps {
  onEnter: () => void;
  onStartRitual: () => void;
}

const Entrance: React.FC<EntranceProps> = ({ onEnter, onStartRitual }) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-12 animate-fade-in">
       <div className="relative">
          <div className="absolute inset-0 bg-stone-500 blur-[60px] opacity-10 rounded-full"></div>
          <h1 className="relative text-5xl md:text-7xl font-light text-stone-200 tracking-[0.2em] z-10">
             冬眠坟墓
          </h1>
       </div>
       <p className="text-stone-500 tracking-widest text-sm">在这里，死亡不是终结，而是休眠。</p>
       
       <div className="flex gap-8 mt-12">
          <button 
             onClick={onEnter}
             className="px-8 py-3 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition-all tracking-widest text-xs uppercase"
          >
             进入墓园
          </button>
          <button 
             onClick={onStartRitual}
             className="px-8 py-3 bg-stone-200 text-stone-900 hover:bg-white transition-all tracking-widest text-xs uppercase font-bold"
          >
             开始葬礼
          </button>
       </div>
    </div>
  );
};

export default Entrance;