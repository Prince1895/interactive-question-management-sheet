import React from 'react';

export const ProgressBar = ({ percentage }) => {
  return (
    <div className="flex items-center gap-2 w-full max-w-[120px]">
      <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden border border-[#F5E6CC]">
        <div 
          className="h-full bg-[#FF8C00] transition-all duration-700 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-[#FF8C00] min-w-[28px]">{percentage}%</span>
    </div>
  );
};