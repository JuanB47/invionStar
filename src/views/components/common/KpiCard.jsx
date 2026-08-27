import React from 'react';

export const KpiCard = ({ title, value, isDarkMode }) => {
  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      isDarkMode 
        ? 'bg-[#0D1B2A] border-[#1E293B] text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    } shadow-sm`}>
      <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {title}
      </span>
      <div className="text-3xl font-extrabold mt-2">
        {value}
      </div>
    </div>
  );
};