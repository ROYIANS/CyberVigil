import React from 'react';

export type WeatherType = 'clear' | 'fog' | 'rain';

interface AtmosphereProps {
  weather?: WeatherType;
}

const Atmosphere: React.FC<AtmosphereProps> = ({ weather = 'clear' }) => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c0a09] transition-colors duration-1000">
    {/* 基础噪点 */}
    <div className="absolute inset-0 opacity-[0.07] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    
    {/* 雨天效果 */}
    {weather === 'rain' && (
      <div className="absolute inset-0 animate-fade-in">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="rain-drop" style={{
            left: `${Math.random() * 100}%`,
            height: `${Math.random() * 30 + 10}px`,
            animationDuration: `${Math.random() * 0.8 + 0.3}s`,
            animationDelay: `${Math.random() * 2}s`
          }} />
        ))}
      </div>
    )}

    {/* 雾天效果 */}
    {weather === 'fog' && (
      <div className="absolute inset-0 animate-fade-in">
        <div className="absolute inset-0 bg-stone-800/20 animate-fog blur-3xl"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-stone-800/40 to-transparent blur-xl"></div>
      </div>
    )}

    {/* 晴朗/夜晚效果 (萤火虫) */}
    {weather === 'clear' && (
      <div className="absolute inset-0 animate-fade-in">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-yellow-200/40 rounded-full blur-[1px] animate-firefly" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80 + 20}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>
    )}

    {/* 底部通用雾气遮罩 */}
    <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-[#0c0a09] via-[#1c1917]/80 to-transparent"></div>
  </div>
);

export default Atmosphere;