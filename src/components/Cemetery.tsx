import React from 'react';
import { ChevronLeft, ChevronRight, PenTool, Flower, Flame, Droplets, Sprout, Mail, Settings, Ghost } from 'lucide-react';
import OfferingBtn from './OfferingBtn';
import Tombstone3D from './Tombstone3D';
import { Grave } from '../App';

interface CemeteryProps {
  graves: Grave[];
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
  onNewGrave: () => void;
  onOffering: (type: 'incense' | 'flowers' | 'wine') => void;
  onCleanWeeds: () => void;
  onOpenLetter: () => void;
  onOpenSettings: () => void;
  onOpenChat: () => void;
  hasWeeds: boolean;
  isNight: boolean;
}

const Cemetery: React.FC<CemeteryProps> = ({ 
  graves, 
  currentIdx, 
  setCurrentIdx, 
  onBack, 
  onNewGrave, 
  onOffering,
  onCleanWeeds,
  onOpenLetter,
  onOpenSettings,
  onOpenChat,
  hasWeeds,
  isNight
}) => {
  const currentGrave = graves[currentIdx];

  // Calculate offering counts
  const incenseCount = currentGrave.offerings.filter(o => o.type === 'incense').length;
  const flowersCount = currentGrave.offerings.filter(o => o.type === 'flowers').length;
  const wineCount = currentGrave.offerings.filter(o => o.type === 'wine').length;

  return (
    <div className="absolute inset-0 z-10 flex flex-col">
      {/* 顶栏 */}
      <div className="h-24 px-6 md:px-10 flex items-center justify-between border-b border-stone-800/50 backdrop-blur-sm z-30 shrink-0">
         <div className="flex items-center gap-6">
           <button onClick={onBack} className="text-stone-500 hover:text-stone-300 text-sm flex items-center gap-2 transition-colors">
              <ChevronLeft size={18}/> 返回
           </button>
           <button onClick={onOpenSettings} className="text-stone-600 hover:text-stone-400 transition-colors p-2" title="设置">
              <Settings size={18} />
           </button>
         </div>
         
         <div className="flex items-center gap-4">
           <button onClick={onOpenChat} className="text-stone-400 hover:text-stone-200 text-xs md:text-sm flex items-center gap-2 border border-stone-800 px-4 py-2 rounded-full bg-stone-900/50 hover:bg-stone-800 transition-colors">
              <Ghost size={14}/> 找齐默默聊聊
           </button>
           <button onClick={onNewGrave} className="text-stone-400 hover:text-stone-200 text-xs md:text-sm flex items-center gap-2 border border-stone-800 px-4 py-2 rounded-full hover:bg-stone-800 transition-colors">
              <PenTool size={14}/> 新建立碑
           </button>
         </div>
      </div>

      {/* 核心展示区 */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
         {/* 切换按钮 */}
         <button
           disabled={currentIdx === 0}
           onClick={() => setCurrentIdx(c => c - 1)}
           className="absolute left-2 md:left-8 z-20 p-4 text-stone-600 hover:text-stone-300 disabled:opacity-0 transition-all"
         >
            <ChevronLeft size={32} className="md:w-12 md:h-12"/>
         </button>
         <button
           disabled={currentIdx === graves.length - 1}
           onClick={() => setCurrentIdx(c => c + 1)}
           className="absolute right-2 md:right-8 z-20 p-4 text-stone-600 hover:text-stone-300 disabled:opacity-0 transition-all"
         >
            <ChevronRight size={32} className="md:w-12 md:h-12"/>
         </button>

         {/* 墓碑 3D 展示区 */}
         <div key={currentGrave.id} className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">

            {/* 梦境来信 (信封) - 浮动在3D场景上方 */}
            {currentGrave.hasLetter && (
              <div
                onClick={onOpenLetter}
                className="absolute top-20 right-20 z-50 cursor-pointer animate-bounce hover:scale-110 transition-transform"
                title="有一封梦境来信"
              >
                <div className="relative">
                  <Mail className="text-stone-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" size={32} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}

            {/* 除草按钮提示 - 仅在有杂草时显示2D提示 */}
            {hasWeeds && (
              <div
                className="absolute bottom-32 z-50 flex flex-col items-center gap-2"
                title="点击土堆上的杂草除草"
              >
                <span className="text-xs text-green-700 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-green-800/50 animate-pulse">
                  点击土堆上的杂草除草
                </span>
              </div>
            )}

            {/* 3D 墓碑主体 */}
            <div className="w-full h-full max-w-5xl">
              <Tombstone3D
                grave={currentGrave}
                isNight={isNight}
                hasWeeds={hasWeeds}
                onCleanWeeds={onCleanWeeds}
              />
            </div>

            {/* 墓志铭展示 (在3D场景下方) */}
            <div className="absolute bottom-28 max-w-2xl px-8">
              <div className="text-center text-sm text-stone-300 italic bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg border border-stone-700/50 shadow-lg">
                "{currentGrave.content}"
              </div>
            </div>
         </div>
      </div>

      {/* 底部互动祭奠栏 */}
      <div className="h-28 bg-[#0c0a09]/90 backdrop-blur-md border-t border-stone-800 flex items-center justify-center gap-12 z-40 pb-6 pt-2">
         <OfferingBtn 
            icon={<Flame size={20}/>} 
            label="上香" 
            count={incenseCount}
            onClick={() => onOffering('incense')}
         />
         <OfferingBtn 
            icon={<Flower size={20}/>} 
            label="献花" 
            count={flowersCount}
            onClick={() => onOffering('flowers')}
         />
         <OfferingBtn 
            icon={<Droplets size={20}/>} 
            label="敬酒" 
            count={wineCount}
            onClick={() => onOffering('wine')}
         />
      </div>
    </div>
  );
};

export default Cemetery;