import React from 'react';

const Atmosphere: React.FC = () => (
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

export default Atmosphere;