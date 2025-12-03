import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Wind, Cloud, Flower, Flame, Droplets, 
  Shovel, Ghost, X, ChevronLeft, ChevronRight, 
  Box, Archive, MoveDown, PenTool 
} from 'lucide-react';

// --- 沉浸式样式与动画 ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;500;700&display=swap');
    
    .font-serif-sc { font-family: 'Noto Serif SC', serif; }
    
    /* 烟雾动画 */
    @keyframes smokeRise {
      0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
      20% { opacity: 0.6; }
      100% { transform: translateY(-80px) scale(3) rotate(15deg); opacity: 0; }
    }
    .smoke-particle { animation: smokeRise 3s ease-out forwards; }
    
    /* 挖掘震动 */
    @keyframes shake {
      0% { transform: translate(1px, 1px) rotate(0deg); }
      10% { transform: translate(-1px, -2px) rotate(-1deg); }
      20% { transform: translate(-3px, 0px) rotate(1deg); }
      30% { transform: translate(3px, 2px) rotate(0deg); }
      40% { transform: translate(1px, -1px) rotate(1deg); }
      50% { transform: translate(-1px, 2px) rotate(-1deg); }
      60% { transform: translate(-3px, 1px) rotate(0deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
    .shake-hard { animation: shake 0.5s; }

    /* 掩土动画 */
    @keyframes fillDirt {
      0% { height: 0%; opacity: 0; }
      100% { height: 100%; opacity: 1; }
    }

    /* 雨滴 */
    @keyframes rain {
      0% { transform: translateY(-100vh); }
      100% { transform: translateY(100vh); }
    }
    .rain-drop {
      position: absolute;
      background: rgba(255, 255, 255, 0.15);
      width: 1px;
      animation: rain linear infinite;
    }
  `}</style>
);

// --- 基础组件：氛围背景 ---
const Atmosphere = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c0a09]">
    <div className="absolute inset-0 opacity-[0.07] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <div key={i} className="rain-drop" style={{
          left: `${Math.random() * 100}%`,
          height: `${Math.random() * 30 + 10}px`,
          animationDuration: `${Math.random() * 0.8 + 0.3}s`,
          animationDelay: `${Math.random() * 2}s`
        }} />
      ))}
    </div>
    {/* 底部雾气 */}
    <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-[#0c0a09] via-[#1c1917]/80 to-transparent"></div>
  </div>
);

// --- 祭奠流程组件 ---
const RitualProcess = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0); 
  // 0:Write(书写) -> 1:Seal(封印) -> 2:Dig(掘土) -> 3:Place(安放) -> 4:Cover(掩土) -> 5:Carve(刻碑)
  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0); // 用于挖掘和掩土
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef(null);

  // 震动反馈
  const triggerShake = () => {
    setIsShaking(true);
    if (navigator.vibrate) navigator.vibrate(20);
    setTimeout(() => setIsShaking(false), 200);
  };

  // 挖掘/掩土逻辑
  const handleWork = () => {
    triggerShake();
    if (progress < 100) {
      setProgress(p => Math.min(p + 10, 100)); // 点击10次完成
    } else {
      setTimeout(() => {
        setStep(s => s + 1);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 font-serif-sc">
      <button onClick={onCancel} className="absolute top-6 right-6 text-stone-600 hover:text-stone-300 transition-colors">
        <X size={24}/>
      </button>

      {/* 步骤进度指示器 */}
      <div className="absolute top-10 flex gap-2 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-1 w-8 rounded-full transition-all duration-500 ${i <= step ? 'bg-stone-200' : 'bg-stone-800'}`} />
        ))}
      </div>

      {/* --- Step 0: 倾诉 (Write) --- */}
      {step === 0 && (
        <div className="w-full max-w-md space-y-6 animate-fade-in-up">
          <div className="text-center space-y-2">
            <h2 className="text-2xl text-stone-200 tracking-widest">第一步：倾诉</h2>
            <p className="text-xs text-stone-500">把那些沉重的、无法言说的，都交给这里。</p>
          </div>
          <textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="在这里写下..."
            className="w-full h-48 bg-stone-900/50 border border-stone-800 rounded p-4 text-stone-300 focus:border-stone-500 outline-none resize-none leading-relaxed text-sm"
          />
          <button 
            disabled={!content.trim()}
            onClick={() => setStep(1)}
            className="w-full py-4 bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors disabled:opacity-50"
          >
            写好了，准备封存
          </button>
        </div>
      )}

      {/* --- Step 1: 封印 (Seal) --- */}
      {step === 1 && (
        <div className="flex flex-col items-center space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-xl text-stone-200">第二步：封存</h2>
            <p className="text-xs text-stone-500 mt-2">将情绪折叠，装进骨灰盒。</p>
          </div>
          
          <div 
            onClick={() => setStep(2)}
            className="group cursor-pointer relative w-40 h-40 flex items-center justify-center"
          >
            <div className="absolute inset-0 border border-stone-600 rounded-lg rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
            <div className="w-32 h-32 bg-stone-800 rounded flex flex-col items-center justify-center shadow-2xl group-hover:scale-95 transition-transform z-10 border-t border-stone-700">
               <Archive size={40} className="text-stone-400 mb-2"/>
               <span className="text-[10px] text-stone-500 tracking-widest">点击封印</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Step 2: 掘土 (Dig) --- */}
      {step === 2 && (
        <div className="flex flex-col items-center space-y-10 animate-fade-in">
          <div className="text-center">
            <h2 className="text-xl text-stone-200">第三步：掘土</h2>
            <p className="text-xs text-stone-500 mt-2">点击铁锹。每一次挖掘，都是一次宣泄。</p>
          </div>

          <div className="relative w-64 h-48 flex items-end justify-center border-b border-stone-700">
             {/* 坑洞遮罩 */}
             <div 
               className="absolute bottom-0 w-40 bg-[#1c1917] rounded-b-2xl shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] transition-all duration-100 ease-out border-x border-stone-800"
               style={{ height: `${progress}%` }}
             ></div>
             <span className="relative z-10 text-4xl font-bold text-stone-800 mix-blend-difference mb-8">
               {progress}%
             </span>
          </div>

          <button 
            onClick={handleWork}
            className={`w-20 h-20 rounded-full bg-stone-800 border-4 border-stone-700 flex items-center justify-center shadow-lg active:scale-90 transition-transform ${isShaking ? 'shake-hard' : ''}`}
          >
            <Shovel className="text-stone-400" size={32} />
          </button>
        </div>
      )}

      {/* --- Step 3: 安放 (Place) --- */}
      {step === 3 && (
        <div className="flex flex-col items-center space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-xl text-stone-200">第四步：安放</h2>
            <p className="text-xs text-stone-500 mt-2">既然已经决定放下，就让它入土吧。</p>
          </div>

          <div className="relative h-64 w-full flex flex-col items-center justify-end pb-10">
             <div className="w-40 h-32 bg-[#1c1917] border-x border-b border-stone-800 rounded-b-2xl absolute bottom-0 shadow-inner flex items-center justify-center">
                <div className="text-stone-800 text-xs">墓穴</div>
             </div>
             
             <button 
                onClick={() => setStep(4)}
                className="z-10 animate-bounce cursor-pointer flex flex-col items-center gap-2 group"
             >
                <div className="w-24 h-24 bg-stone-800 border border-stone-600 shadow-2xl flex items-center justify-center rounded">
                   <Box className="text-stone-400"/>
                </div>
                <div className="flex items-center gap-1 text-stone-500 text-xs group-hover:text-stone-300">
                   <MoveDown size={14}/>
                   <span>点击放入</span>
                </div>
             </button>
          </div>
        </div>
      )}

      {/* --- Step 4: 掩土 (Cover) --- */}
      {step === 4 && (
        <div className="flex flex-col items-center space-y-10 animate-fade-in">
          <div className="text-center">
            <h2 className="text-xl text-stone-200">第五步：掩土</h2>
            <p className="text-xs text-stone-500 mt-2">尘归尘，土归土。亲手盖上最后一层土。</p>
          </div>

          <div className="relative w-64 h-48 flex items-end justify-center">
             {/* 墓穴内容 */}
             <div className="absolute bottom-0 w-40 h-32 bg-[#1c1917] rounded-b-2xl border border-stone-800 flex items-center justify-center overflow-hidden">
                <Box className="text-stone-700 opacity-50 absolute bottom-4"/>
                {/* 泥土覆盖层 */}
                <div 
                  className="absolute bottom-0 w-full bg-stone-800/80 transition-all duration-300 ease-linear"
                  style={{ height: `${progress}%` }}
                >
                   <div className="w-full h-full opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                </div>
             </div>
          </div>

          <button 
            onClick={handleWork}
            className={`w-20 h-20 rounded-full bg-stone-800 border-4 border-stone-700 flex items-center justify-center shadow-lg active:scale-90 transition-transform ${isShaking ? 'shake-hard' : ''}`}
          >
            <span className="text-xs text-stone-400 font-bold">填土</span>
          </button>
        </div>
      )}

      {/* --- Step 5: 刻碑 (Carve) --- */}
      {step === 5 && (
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-xl text-stone-200">最后一步：刻碑</h2>
            <p className="text-xs text-stone-500 mt-2">为这段记忆刻下一个名字。</p>
          </div>

          <div className="relative w-full flex justify-center py-8">
             <div className="w-56 h-72 bg-stone-800 rounded-t-full border border-stone-700 flex flex-col items-center pt-16 px-6 relative shadow-2xl">
                <span className="text-stone-500 text-xs mb-4">R.I.P</span>
                <input 
                  type="text"
                  maxLength={10}
                  placeholder="未命名"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-transparent text-center text-xl text-stone-200 placeholder:text-stone-600 outline-none border-b border-stone-600/50 pb-2 focus:border-stone-400 transition-colors font-serif-sc"
                  autoFocus
                />
                <div className="mt-auto text-[10px] text-stone-600 pb-4">{new Date().toLocaleDateString()}</div>
             </div>
          </div>

          <button 
            onClick={() => onComplete({ title, content })}
            disabled={!title.trim()}
            className="w-full py-4 bg-stone-200 text-stone-900 font-bold tracking-widest hover:bg-white transition-colors rounded-sm"
          >
            礼成，安息
          </button>
        </div>
      )}
    </div>
  );
};

// --- 墓园主界面 ---
export default function App() {
  const [phase, setPhase] = useState('entrance');
  const [graves, setGraves] = useState([
    {
      id: 1,
      title: "被偷走的夏天",
      content: "那年本来约好要去海边的，结果我们在路口就走散了。夏天结束了，我也该长大了。",
      date: "2023.08.31",
      offerings: { incense: 142, flowers: 34, wine: 12 }
    },
    {
      id: 2,
      title: "沉默",
      content: "在会议室里，我有无数个想要反驳的念头，最后都变成了点头。那个勇敢的我，死在了下午三点。",
      date: "2024.01.15",
      offerings: { incense: 88, flowers: 9, wine: 5 }
    }
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleCreateGrave = (data) => {
    const newGrave = {
      id: Date.now(),
      ...data,
      date: new Date().toLocaleDateString(),
      offerings: { incense: 0, flowers: 0, wine: 0 }
    };
    setGraves([newGrave, ...graves]);
    setCurrentIdx(0);
    setPhase('cemetery');
  };

  const handleOffering = (type) => {
    const newGraves = [...graves];
    newGraves[currentIdx].offerings[type]++;
    setGraves(newGraves);
  };

  return (
    <div className="w-full h-screen bg-stone-950 text-stone-300 font-serif-sc relative overflow-hidden select-none">
      <GlobalStyles />
      <Atmosphere />

      {/* --- 入口 --- */}
      {phase === 'entrance' && (
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
                 onClick={() => setPhase('cemetery')}
                 className="px-8 py-3 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition-all tracking-widest text-xs uppercase"
              >
                 进入墓园
              </button>
              <button 
                 onClick={() => setPhase('ritual')}
                 className="px-8 py-3 bg-stone-200 text-stone-900 hover:bg-white transition-all tracking-widest text-xs uppercase font-bold"
              >
                 开始葬礼
              </button>
           </div>
        </div>
      )}

      {/* --- 仪式 --- */}
      {phase === 'ritual' && (
        <RitualProcess 
          onComplete={handleCreateGrave} 
          onCancel={() => setPhase('entrance')} 
        />
      )}

      {/* --- 墓园 --- */}
      {phase === 'cemetery' && (
        <div className="absolute inset-0 z-10 flex flex-col">
          {/* 顶栏 */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-stone-800/50 backdrop-blur-sm z-30">
             <button onClick={() => setPhase('entrance')} className="text-stone-500 hover:text-stone-300 text-xs flex items-center gap-1">
                <ChevronLeft size={14}/> 返回
             </button>
             <button onClick={() => setPhase('ritual')} className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-2 border border-stone-800 px-3 py-1 rounded-full">
                <PenTool size={12}/> 新建立碑
             </button>
          </div>

          {/* 核心展示区 */}
          <div className="flex-1 relative flex items-center justify-center">
             {/* 切换按钮 */}
             <button 
               disabled={currentIdx === 0}
               onClick={() => setCurrentIdx(c => c - 1)}
               className="absolute left-4 z-20 p-4 text-stone-600 hover:text-stone-300 disabled:opacity-0 transition-all"
             >
                <ChevronLeft size={32}/>
             </button>
             <button 
               disabled={currentIdx === graves.length - 1}
               onClick={() => setCurrentIdx(c => c + 1)}
               className="absolute right-4 z-20 p-4 text-stone-600 hover:text-stone-300 disabled:opacity-0 transition-all"
             >
                <ChevronRight size={32}/>
             </button>

             {/* 墓碑卡片 */}
             <div key={graves[currentIdx].id} className="relative w-full h-full max-w-2xl flex flex-col items-center justify-end pb-32 animate-fade-in">
                
                {/* 墓碑 */}
                <div className="relative z-10 flex flex-col items-center group">
                   <div className="w-72 h-96 bg-gradient-to-b from-stone-800 to-stone-900 rounded-t-[100px] border border-stone-700/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center pt-20 px-8 text-center relative overflow-hidden">
                      {/* 碑面纹理 */}
                      <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                      
                      <div className="relative z-10">
                        <div className="text-stone-500 text-[10px] tracking-[0.3em] mb-6">R . I . P</div>
                        <h2 className="text-2xl text-stone-200 font-bold mb-6 font-serif-sc">{graves[currentIdx].title}</h2>
                        <div className="w-8 h-[1px] bg-stone-600 mx-auto mb-6"></div>
                        <p className="text-stone-400 text-xs leading-loose italic line-clamp-6 opacity-80">
                           {graves[currentIdx].content}
                        </p>
                      </div>
                      
                      <div className="mt-auto mb-8 text-[10px] text-stone-600">{graves[currentIdx].date}</div>
                   </div>
                   
                   {/* 碑座 */}
                   <div className="w-80 h-10 bg-stone-900 border-t border-stone-800 shadow-2xl -mt-1 rounded-sm relative z-20"></div>

                   {/* --- 供品可视化堆叠区域 --- */}
                   <div className="absolute bottom-0 w-full flex justify-center items-end gap-6 px-4 z-30 pointer-events-none translate-y-2">
                      
                      {/* 鲜花堆 (根据数量显示不同大小) */}
                      {graves[currentIdx].offerings.flowers > 0 && (
                         <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="relative">
                               <Flower className="w-8 h-8 text-stone-400 drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]" />
                               {graves[currentIdx].offerings.flowers > 5 && <Flower className="w-6 h-6 text-stone-500 absolute -right-3 top-2 -z-10 rotate-12" />}
                               {graves[currentIdx].offerings.flowers > 10 && <Flower className="w-7 h-7 text-stone-400 absolute -left-3 top-1 -z-10 -rotate-12" />}
                            </div>
                            <span className="mt-1 text-[9px] text-stone-500 bg-black/50 px-1.5 rounded-full backdrop-blur-sm border border-stone-800">
                               {graves[currentIdx].offerings.flowers}
                            </span>
                         </div>
                      )}

                      {/* 香炉 (一直存在，有数量则冒烟) */}
                      <div className="flex flex-col items-center">
                         <div className="relative w-6 h-8 flex flex-col items-center justify-end">
                            {/* 动态生成的烟雾粒子 */}
                            {graves[currentIdx].offerings.incense > 0 && (
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-20 h-32 pointer-events-none overflow-hidden flex justify-center">
                                  <div className="smoke-particle w-2 h-2 rounded-full bg-stone-500/20 blur-[3px]"></div>
                               </div>
                            )}
                            <div className="w-[1px] h-4 bg-orange-800/80 relative">
                               {graves[currentIdx].offerings.incense > 0 && <div className="absolute -top-0.5 -left-[1px] w-1 h-1 bg-orange-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div>}
                            </div>
                            <div className="w-6 h-3 bg-stone-800 rounded-b border-t border-stone-700"></div>
                         </div>
                         <span className="mt-1 text-[9px] text-stone-500 bg-black/50 px-1.5 rounded-full backdrop-blur-sm border border-stone-800">
                            {graves[currentIdx].offerings.incense}
                         </span>
                      </div>

                      {/* 酒水 */}
                      {graves[currentIdx].offerings.wine > 0 && (
                         <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="relative w-6 h-6 flex items-center justify-center">
                               <div className="w-5 h-6 border-x border-b border-stone-600 rounded-b-md relative overflow-hidden bg-stone-800/50">
                                  <div className="absolute bottom-0 w-full bg-stone-700/80 h-3/4"></div>
                               </div>
                            </div>
                            <span className="mt-1 text-[9px] text-stone-500 bg-black/50 px-1.5 rounded-full backdrop-blur-sm border border-stone-800">
                               {graves[currentIdx].offerings.wine}
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
                count={graves[currentIdx].offerings.incense}
                onClick={() => handleOffering('incense')}
             />
             <OfferingBtn 
                icon={<Flower size={20}/>} 
                label="献花" 
                count={graves[currentIdx].offerings.flowers}
                onClick={() => handleOffering('flowers')}
             />
             <OfferingBtn 
                icon={<Droplets size={20}/>} 
                label="敬酒" 
                count={graves[currentIdx].offerings.wine}
                onClick={() => handleOffering('wine')}
             />
          </div>
        </div>
      )}
    </div>
  );
}

// --- 子组件：祭奠按钮 ---
const OfferingBtn = ({ icon, label, onClick }) => {
   const [active, setActive] = useState(false);
   
   const trigger = () => {
      setActive(true);
      onClick();
      setTimeout(() => setActive(false), 200);
   };

   return (
      <button 
         onClick={trigger}
         className={`flex flex-col items-center gap-2 group transition-all duration-200 ${active ? 'scale-90 opacity-80' : 'hover:-translate-y-1'}`}
      >
         <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 group-hover:text-stone-300 group-hover:border-stone-600 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
            {icon}
         </div>
         <span className="text-[10px] text-stone-600 tracking-widest group-hover:text-stone-400">{label}</span>
      </button>
   );
};