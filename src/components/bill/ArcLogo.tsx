import React from 'react';

export function ArcLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-[#CC1414] w-20 h-20 shadow-md ${className}`}>
      <span className="text-white font-black text-2xl tracking-tighter">ARC</span>
    </div>
  );
}
