import React from 'react';

export function ArcLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full border-4 border-[#CC1414] bg-white w-20 h-20 shadow-sm ${className}`}>
      <span className="text-[#CC1414] font-black text-2xl tracking-tighter">ARC</span>
    </div>
  );
}