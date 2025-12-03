import React, { useState, useRef } from 'react';
import { X, Archive, Shovel, Box, MoveDown } from 'lucide-react';

interface RitualProcessProps {
  onComplete: (data: { title: string; content: string; bornDate: string; deathDate: string; erector: string }) => void;
  onCancel: () => void;
}

const RitualProcess: React.FC<RitualProcessProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0); 
  // 0:Write(书写) -> 1:Seal(封印) -> 2:Dig(掘土) -> 3:Place(安放) -> 4:Cover(掩土) -> 5:Carve(刻碑)
  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [bornDate, setBornDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [erector, setErector] = useState('');
  
  const [progress, setProgress] = useState(0); // 用于挖掘和掩土
  const [isShaking, setIsShaking] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-2xl text-stone-200 tracking-widest">最后一步：刻碑</h2>
            <p className="text-xs text-stone-500">为这段记忆刻下一个名字</p>
          </div>

          <div className="space-y-4 bg-stone-900/30 border border-stone-800 rounded-lg p-6">
            {/* 墓主名称 */}
            <div className="space-y-2">
              <label className="text-xs text-stone-500 tracking-wider">墓主名称</label>
              <input
                type="text"
                maxLength={10}
                placeholder="未命名"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-stone-900/50 border border-stone-700 rounded px-4 py-3 text-stone-200 placeholder:text-stone-600 outline-none focus:border-stone-500 transition-colors"
                autoFocus
              />
            </div>

            {/* 生卒日期 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-stone-500 tracking-wider">生于</label>
                <input
                  type="date"
                  value={bornDate}
                  onChange={e => setBornDate(e.target.value)}
                  className="w-full bg-stone-900/50 border border-stone-700 rounded px-3 py-2 text-stone-400 outline-none focus:border-stone-500 transition-colors text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-stone-500 tracking-wider">卒于</label>
                <input
                  type="date"
                  value={deathDate}
                  onChange={e => setDeathDate(e.target.value)}
                  className="w-full bg-stone-900/50 border border-stone-700 rounded px-3 py-2 text-stone-400 outline-none focus:border-stone-500 transition-colors text-sm"
                />
              </div>
            </div>

            {/* 立碑人 */}
            <div className="space-y-2">
              <label className="text-xs text-stone-500 tracking-wider">立碑人</label>
              <input
                type="text"
                placeholder="立碑人（可选）"
                value={erector}
                onChange={e => setErector(e.target.value)}
                className="w-full bg-stone-900/50 border border-stone-700 rounded px-4 py-3 text-stone-200 placeholder:text-stone-600 outline-none focus:border-stone-500 transition-colors"
              />
            </div>

            {/* 立碑日期提示 */}
            <div className="text-center pt-2">
              <span className="text-[10px] text-stone-600">立碑日期：{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <button
            onClick={() => onComplete({ title, content, bornDate, deathDate, erector })}
            disabled={!title.trim()}
            className="w-full py-4 bg-stone-200 text-stone-900 font-bold tracking-widest hover:bg-white transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            礼成，安息
          </button>
        </div>
      )}
    </div>
  );
};

export default RitualProcess;