import { useState, useEffect } from 'react';
import Atmosphere, { WeatherType } from './components/Atmosphere';
import Entrance from './components/Entrance';
import RitualProcess from './components/RitualProcess';
import Cemetery from './components/Cemetery';
import DreamLetterModal from './components/DreamLetterModal';
import SettingsModal from './components/SettingsModal';
import ChatModal from './components/ChatModal';
import { AIConfig } from './utils/aiService';

// --- Types ---
export interface Offering {
  id: number;
  type: 'incense' | 'flowers' | 'wine';
  timestamp: number;
}

export interface Grave {
  id: number;
  title: string; // 墓主姓名
  content: string; // 墓志铭
  bornDate: string; // 生于
  deathDate: string; // 卒于
  erector: string; // 立碑人
  createDate: string;
  lastVisit: number; // 上次访问时间
  offerings: Offering[];
  hasLetter?: boolean; // 是否有梦境来信
  savedLetters?: string[]; // 收藏的信件
}

// --- Constants ---
const OFFERING_LIFETIME = 1000 * 60 * 60; // 供品存在1小时
const WEED_GROWTH_TIME = 1000 * 60 * 60 * 24; // 24小时不访问长草
const LETTER_GENERATION_TIME = 1000 * 60 * 60 * 12; // 12小时生成一封信

const DREAM_LETTERS = [
  "梦里你好像又在犹豫什么…不过，那条围巾，你还是围上了呀？",
  "今天雨有点大，幸好我有一块云做的碑。",
  "我把自己种下去的时候，只是想静一静，不小心，长出了一片风。",
  "那一个埋下“社交破防”的地方，我今天又来坐了一会儿……它好像发芽了耶。",
  "回来除草时才发现，连杂草都开了小花。",
  "也许有一天，我不记得当初为什么想藏起来，但我记得，在这片草地上，我安静地，留下过一颗泪珠。",
  "昨晚有只猫踩过了我的头顶，它好像在找什么东西，是你吗？",
  "别担心，这里的土很暖和，像冬天的被窝。"
];

const INITIAL_GRAVES: Grave[] = [
  {
    id: 1,
    title: "被偷走的夏天",
    content: "那年本来约好要去海边的，结果我们在路口就走散了。夏天结束了，我也该长大了。",
    bornDate: "二零零零年六月一日",
    deathDate: "二零二三年八月三十一日",
    erector: "某某",
    createDate: "二零二三年八月三十一日",
    lastVisit: Date.now(),
    offerings: [],
    savedLetters: []
  }
];

export default function App() {
  const [phase, setPhase] = useState<'entrance' | 'ritual' | 'cemetery'>('entrance');
  
  // Load from LocalStorage
  const [graves, setGraves] = useState<Grave[]>(() => {
    const saved = localStorage.getItem('cyber-vigil-graves');
    return saved ? JSON.parse(saved) : INITIAL_GRAVES;
  });

  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('cyber-vigil-ai-config');
    return saved ? JSON.parse(saved) : { apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-3.5-turbo' };
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [isNight, setIsNight] = useState(false);
  const [showLetter, setShowLetter] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('cyber-vigil-graves', JSON.stringify(graves));
  }, [graves]);

  useEffect(() => {
    localStorage.setItem('cyber-vigil-ai-config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  // Time & Weather Logic
  useEffect(() => {
    const checkStatus = () => {
      const now = Date.now();
      const currentGrave = graves[currentIdx];
      const timeSinceVisit = now - currentGrave.lastVisit;

      // 1. Night Mode Check (23:00 - 03:00)
      const hour = new Date().getHours();
      setIsNight(hour >= 23 || hour < 3);

      // 2. Weather Logic
      if (timeSinceVisit > WEED_GROWTH_TIME * 3) {
        setWeather('rain'); // > 3 days
      } else if (timeSinceVisit > WEED_GROWTH_TIME) {
        setWeather('fog'); // > 1 day
      } else {
        setWeather('clear');
      }

      // 3. Decay Logic (Offerings)
      setGraves(prevGraves => prevGraves.map(grave => {
        const activeOfferings = grave.offerings.filter(o => now - o.timestamp < OFFERING_LIFETIME);
        
        // 4. Letter Generation Logic
        let hasLetter = grave.hasLetter;
        if (!hasLetter && (now - grave.lastVisit > LETTER_GENERATION_TIME)) {
           hasLetter = true;
        }

        if (activeOfferings.length !== grave.offerings.length || hasLetter !== grave.hasLetter) {
          return { ...grave, offerings: activeOfferings, hasLetter };
        }
        return grave;
      }));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [currentIdx]); // Re-run when switching graves

  // 将日期转换为中文格式
  const formatChineseDate = (dateStr: string): string => {
    if (!dateStr) return '';

    const chineseNumbers: { [key: string]: string } = {
      '0': '零', '1': '一', '2': '二', '3': '三', '4': '四',
      '5': '五', '6': '六', '7': '七', '8': '八', '9': '九'
    };

    // dateStr 格式: YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;

    const [year, month, day] = parts;

    // 转换年份
    let yearChinese = '';
    for (let char of year) {
      yearChinese += chineseNumbers[char] || char;
    }
    yearChinese += '年';

    // 转换月份
    const monthNum = parseInt(month);
    let monthChinese = '';
    if (monthNum === 10) {
      monthChinese = '十月';
    } else if (monthNum > 10) {
      const lastDigit = monthNum % 10;
      monthChinese = '十' + chineseNumbers[lastDigit.toString()] + '月';
    } else {
      monthChinese = chineseNumbers[monthNum.toString()] + '月';
    }

    // 转换日期
    const dayNum = parseInt(day);
    let dayChinese = '';
    if (dayNum === 10) {
      dayChinese = '十日';
    } else if (dayNum < 10) {
      dayChinese = chineseNumbers[dayNum.toString()] + '日';
    } else if (dayNum < 20) {
      const lastDigit = dayNum % 10;
      dayChinese = '十' + (lastDigit === 0 ? '' : chineseNumbers[lastDigit.toString()]) + '日';
    } else if (dayNum === 20) {
      dayChinese = '二十日';
    } else if (dayNum === 30) {
      dayChinese = '三十日';
    } else if (dayNum < 30) {
      const lastDigit = dayNum % 10;
      dayChinese = '二十' + chineseNumbers[lastDigit.toString()] + '日';
    } else {
      const lastDigit = dayNum % 10;
      dayChinese = '三十' + (lastDigit === 0 ? '' : chineseNumbers[lastDigit.toString()]) + '日';
    }

    return yearChinese + monthChinese + dayChinese;
  };

  const handleCreateGrave = (data: { title: string; content: string; bornDate: string; deathDate: string; erector: string }) => {
    const newGrave: Grave = {
      id: Date.now(),
      ...data,
      bornDate: formatChineseDate(data.bornDate),
      deathDate: formatChineseDate(data.deathDate),
      createDate: formatChineseDate(new Date().toISOString().split('T')[0]),
      lastVisit: Date.now(),
      offerings: [],
      savedLetters: []
    };
    setGraves([newGrave, ...graves]);
    setCurrentIdx(0);
    setPhase('cemetery');
  };

  const handleOffering = (type: 'incense' | 'flowers' | 'wine') => {
    const newGraves = [...graves];
    const grave = newGraves[currentIdx];
    
    grave.offerings.push({
      id: Date.now(),
      type,
      timestamp: Date.now()
    });
    
    // Update visit time (clears fog/rain/weeds)
    grave.lastVisit = Date.now();
    setGraves(newGraves);
    
    // Update weather immediately
    setWeather('clear');
  };

  const handleCleanWeeds = () => {
    const newGraves = [...graves];
    newGraves[currentIdx].lastVisit = Date.now();
    setGraves(newGraves);
    setWeather('clear');
  };

  const handleOpenLetter = () => {
    const randomLetter = DREAM_LETTERS[Math.floor(Math.random() * DREAM_LETTERS.length)];
    setShowLetter(randomLetter);
  };

  const handleLetterAction = (action: 'keep' | 'burn') => {
    const newGraves = [...graves];
    const grave = newGraves[currentIdx];
    
    grave.hasLetter = false; // Letter consumed
    grave.lastVisit = Date.now(); // Interaction counts as visit

    if (action === 'keep' && showLetter) {
      if (!grave.savedLetters) grave.savedLetters = [];
      grave.savedLetters.push(showLetter);
    }

    setGraves(newGraves);
    setShowLetter(null);
    setWeather('clear');
  };

  // Check if current grave has weeds
  const hasWeeds = (Date.now() - graves[currentIdx].lastVisit) > WEED_GROWTH_TIME;

  return (
    <div className="w-full h-screen bg-stone-950 text-stone-300 font-serif-sc relative overflow-hidden select-none">
      <Atmosphere weather={weather} />

      {/* --- 入口 --- */}
      {phase === 'entrance' && (
        <Entrance 
          onEnter={() => setPhase('cemetery')}
          onStartRitual={() => setPhase('ritual')}
        />
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
        <>
          <Cemetery 
            graves={graves}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            onBack={() => setPhase('entrance')}
            onNewGrave={() => setPhase('ritual')}
            onOffering={handleOffering}
            onCleanWeeds={handleCleanWeeds}
            onOpenLetter={handleOpenLetter}
            onOpenSettings={() => setShowSettings(true)}
            onOpenChat={() => setShowChat(true)}
            hasWeeds={hasWeeds}
            isNight={isNight}
          />
          {showLetter && (
            <DreamLetterModal 
              content={showLetter}
              onKeep={() => handleLetterAction('keep')}
              onBurn={() => handleLetterAction('burn')}
            />
          )}
          {showSettings && (
            <SettingsModal 
              initialConfig={aiConfig}
              onClose={() => setShowSettings(false)}
              onSave={setAiConfig}
            />
          )}
          {showChat && (
            <ChatModal 
              config={aiConfig}
              onClose={() => setShowChat(false)}
            />
          )}
        </>
      )}
    </div>
  );
}