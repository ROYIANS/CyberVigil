import React, { useState } from 'react';

interface OfferingBtnProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick: () => void;
}

const OfferingBtn: React.FC<OfferingBtnProps> = ({ icon, label, onClick }) => {
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

export default OfferingBtn;