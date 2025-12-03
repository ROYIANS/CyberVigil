import React from 'react';
import { ChevronLeft, ChevronRight, PenTool, Flower, Flame, Droplets, Sprout, Mail, Settings, Ghost } from 'lucide-react';
import OfferingBtn from './OfferingBtn';
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

         {/* 墓碑卡片容器 - 垂直居中 */}
         <div key={currentGrave.id} className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in pb-20 md:pb-0">
            
            {/* 墓碑主体 */}
            <div className="relative z-10 flex flex-col items-center group scale-[0.85] md:scale-100 transition-transform duration-500">
               {/* 杂草层 */}
               {hasWeeds && (
                 <div 
                   onClick={onCleanWeeds}
                   className="absolute -bottom-4 w-full h-1/2 z-40 cursor-pointer group-hover:scale-105 transition-transform"
                   title="点击除草"
                 >
                   <div className="absolute bottom-0 left-0 text-green-900/60 animate-sway origin-bottom"><Sprout size={48} /></div>
                   <div className="absolute bottom-0 right-4 text-green-800/50 animate-sway-delayed origin-bottom"><Sprout size={56} /></div>
                   <div className="absolute bottom-0 left-1/3 text-green-900/70 animate-sway origin-bottom"><Sprout size={32} /></div>
                   <div className="absolute bottom-0 right-1/3 text-green-800/60 animate-sway-delayed origin-bottom"><Sprout size={40} /></div>
                 </div>
               )}

               {/* 梦境来信 (信封) */}
               {currentGrave.hasLetter && (
                 <div 
                   onClick={onOpenLetter}
                   className="absolute -right-8 bottom-20 z-50 cursor-pointer animate-bounce hover:scale-110 transition-transform"
                   title="有一封梦境来信"
                 >
                   <div className="relative">
                     <Mail className="text-stone-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" size={32} />
                     <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                   </div>
                 </div>
               )}

               <div className={`w-80 h-[480px] bg-gradient-to-b from-stone-800 to-stone-900 rounded-t-[120px] border border-stone-700/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center pt-20 px-8 text-center relative overflow-hidden transition-all duration-1000 ${isNight ? 'shadow-[0_0_30px_rgba(100,100,255,0.1)] border-stone-600/80' : ''}`}>
                  {/* 碑面纹理 */}
                  <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                  
                  <div className="relative z-10 w-full h-full flex justify-between px-4 pb-8">
                    {/* 左侧：生卒年 (竖排) */}
                    <div className="h-full flex flex-col justify-start pt-8 text-[10px] text-stone-500 writing-vertical-rl tracking-widest opacity-70">
                      <span>生于 {currentGrave.bornDate || '未知'}</span>
                      <span className="mt-4">卒于 {currentGrave.deathDate || '未知'}</span>
                    </div>

                    {/* 中间：墓主姓名 (竖排大字) */}
                    <div className="h-full flex flex-col items-center justify-center">
                      <h2 className={`text-3xl font-bold font-serif-sc writing-vertical-rl tracking-[0.5em] border-2 border-stone-700/30 py-8 px-4 bg-stone-800/30 shadow-inner transition-colors duration-1000 ${isNight ? 'text-blue-100 drop-shadow-[0_0_8px_rgba(200,200,255,0.5)]' : 'text-stone-200'}`}>
                        {currentGrave.title}之墓
                      </h2>
                    </div>

                    {/* 右侧：立碑人 (竖排) */}
                    <div className="h-full flex flex-col justify-end pb-4 text-[10px] text-stone-500 writing-vertical-rl tracking-widest opacity-70">
                      <span>{currentGrave.erector ? `${currentGrave.erector} 立` : ''}</span>
                      <span className="mt-2">{currentGrave.createDate}</span>
                    </div>
                  </div>
               </div>
               
               {/* 碑座 */}
               <div className="w-96 h-12 bg-stone-900 border-t border-stone-800 shadow-2xl -mt-1 rounded-sm relative z-20 flex items-center justify-center">
                  <div className="text-[10px] text-stone-600 italic opacity-50 max-w-[80%] truncate">
                    "{currentGrave.content}"
                  </div>
               </div>

               {/* --- 供品可视化堆叠区域 --- */}
               <div className="absolute bottom-0 w-full flex justify-center items-end gap-8 px-4 z-30 pointer-events-none translate-y-4">
                  
                  {/* 鲜花堆 */}
                  {flowersCount > 0 && (
                     <div className="flex flex-col items-center animate-fade-in-up">
                        <div className="relative">
                           <Flower className="w-8 h-8 text-stone-400 drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]" />
                           {flowersCount > 1 && <Flower className="w-6 h-6 text-stone-500 absolute -right-3 top-2 -z-10 rotate-12" />}
                           {flowersCount > 2 && <Flower className="w-7 h-7 text-stone-400 absolute -left-3 top-1 -z-10 -rotate-12" />}
                        </div>
                        <span className="mt-1 text-[9px] text-stone-500 bg-black/50 px-1.5 rounded-full backdrop-blur-sm border border-stone-800">
                           {flowersCount}
                        </span>
                     </div>
                  )}

                  {/* 香炉 */}
                  <div className="flex flex-col items-center">
                     <div className="relative w-8 h-10 flex flex-col items-center justify-end">
                        {/* 动态生成的烟雾粒子 */}
                        {incenseCount > 0 && (
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-20 h-32 pointer-events-none overflow-hidden flex justify-center">
                              <div className="smoke-particle w-2 h-2 rounded-full bg-stone-500/20 blur-[3px]"></div>
                           </div>
                        )}
                        <div className="w-[2px] h-5 bg-orange-800/80 relative">
                           {incenseCount > 0 && <div className="absolute -top-0.5 -left-[1px] w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div>}
                        </div>
                        <div className="w-8 h-4 bg-stone-800 rounded-b border-t border-stone-700 flex justify-center items-center">
                           <div className="w-6 h-[1px] bg-stone-700"></div>
                        </div>
                     </div>
                     <span className="mt-1 text-[9px] text-stone-500 bg-black/50 px-1.5 rounded-full backdrop-blur-sm border border-stone-800">
                        {incenseCount}
                     </span>
                  </div>

                  {/* 酒水 */}
                  {wineCount > 0 && (
                     <div className="flex flex-col items-center animate-fade-in-up">
                        <div className="relative w-6 h-6 flex items-center justify-center">
                           <div className="w-5 h-6 border-x border-b border-stone-600 rounded-b-md relative overflow-hidden bg-stone-800/50">
                              <div className="absolute bottom-0 w-full bg-stone-700/80 h-3/4"></div>
                           </div>
                        </div>
                        <span className="mt-1 text-[9px] text-stone-500 bg-black/50 px-1.5 rounded-full backdrop-blur-sm border border-stone-800">
                           {wineCount}
                        </span>
                     </div>
                  )}
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