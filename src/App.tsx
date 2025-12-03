import React, { useState, useEffect } from 'react';
import Atmosphere from './components/Atmosphere';
import Entrance from './components/Entrance';
import RitualProcess from './components/RitualProcess';
import Cemetery from './components/Cemetery';

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
  lastVisit: number; // 上次访问时间，用于计算杂草
  offerings: Offering[];
}

// --- Constants ---
const OFFERING_LIFETIME = 1000 * 60 * 60; // 供品存在1小时
const WEED_GROWTH_TIME = 1000 * 60 * 60 * 24; // 24小时不访问长草

const INITIAL_GRAVES: Grave[] = [
  {
    id: 1,
    title: "被偷走的夏天",
    content: "那年本来约好要去海边的，结果我们在路口就走散了。夏天结束了，我也该长大了。",
    bornDate: "2000.06.01",
    deathDate: "2023.08.31",
    erector: "某某",
    createDate: "2023.08.31",
    lastVisit: Date.now(),
    offerings: []
  }
];

export default function App() {
  const [phase, setPhase] = useState<'entrance' | 'ritual' | 'cemetery'>('entrance');
  
  // Load from LocalStorage
  const [graves, setGraves] = useState<Grave[]>(() => {
    const saved = localStorage.getItem('cyber-vigil-graves');
    return saved ? JSON.parse(saved) : INITIAL_GRAVES;
  });

  const [currentIdx, setCurrentIdx] = useState(0);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('cyber-vigil-graves', JSON.stringify(graves));
  }, [graves]);

  // Decay Logic & Weed Growth Check
  useEffect(() => {
    const interval = setInterval(() => {
      setGraves(prevGraves => prevGraves.map(grave => {
        const now = Date.now();
        // Filter expired offerings
        const activeOfferings = grave.offerings.filter(o => now - o.timestamp < OFFERING_LIFETIME);
        
        // Check if offerings changed to avoid unnecessary re-renders if possible (simple check)
        if (activeOfferings.length !== grave.offerings.length) {
          return { ...grave, offerings: activeOfferings };
        }
        return grave;
      }));
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCreateGrave = (data: { title: string; content: string; bornDate: string; deathDate: string; erector: string }) => {
    const newGrave: Grave = {
      id: Date.now(),
      ...data,
      createDate: new Date().toLocaleDateString(),
      lastVisit: Date.now(),
      offerings: []
    };
    setGraves([newGrave, ...graves]);
    setCurrentIdx(0);
    setPhase('cemetery');
  };

  const handleOffering = (type: 'incense' | 'flowers' | 'wine') => {
    const newGraves = [...graves];
    const grave = newGraves[currentIdx];
    
    // Add new offering
    grave.offerings.push({
      id: Date.now(),
      type,
      timestamp: Date.now()
    });
    
    // Update visit time (clears weeds implicitly if we add logic, but let's make weeding explicit or auto-clear on visit?)
    // Let's keep weeding explicit for interaction, but visiting updates the timer preventing NEW weeds.
    grave.lastVisit = Date.now();
    
    setGraves(newGraves);
  };

  const handleCleanWeeds = () => {
    const newGraves = [...graves];
    newGraves[currentIdx].lastVisit = Date.now();
    setGraves(newGraves);
  };

  // Check if current grave has weeds
  const hasWeeds = (Date.now() - graves[currentIdx].lastVisit) > WEED_GROWTH_TIME;

  return (
    <div className="w-full h-screen bg-stone-950 text-stone-300 font-serif-sc relative overflow-hidden select-none">
      <Atmosphere />

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
        <Cemetery 
          graves={graves}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
          onBack={() => setPhase('entrance')}
          onNewGrave={() => setPhase('ritual')}
          onOffering={handleOffering}
          onCleanWeeds={handleCleanWeeds}
          hasWeeds={hasWeeds}
        />
      )}
    </div>
  );
}