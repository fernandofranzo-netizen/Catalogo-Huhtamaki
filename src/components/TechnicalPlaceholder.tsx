import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TechnicalPlaceholder: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
  };

  return (
    <div className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-200/80 rounded-lg p-4 select-none ${className}`}>
      <div className={`relative flex items-center justify-center text-cyan-600 ${iconSizes[size]}`}>
        {/* Concentric blueprint technical rings matching screenshot */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-500/70" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="34" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="22" strokeWidth="1.2" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="12" strokeWidth="1.5" />
          {/* Crosshairs */}
          <line x1="50" y1="2" x2="50" y2="18" strokeWidth="1.5" />
          <line x1="50" y1="82" x2="50" y2="98" strokeWidth="1.5" />
          <line x1="2" y1="50" x2="18" y2="50" strokeWidth="1.5" />
          <line x1="82" y1="50" x2="98" y2="50" strokeWidth="1.5" />
          {/* Isometric 3D cube inside */}
          <path d="M50 38 L62 44 L62 58 L50 64 L38 58 L38 44 Z" strokeWidth="1.5" fill="rgba(6, 182, 212, 0.08)" />
          <line x1="50" y1="38" x2="50" y2="51" strokeWidth="1.5" />
          <line x1="50" y1="51" x2="62" y2="44" strokeWidth="1.5" />
          <line x1="50" y1="51" x2="38" y2="44" strokeWidth="1.5" />
        </svg>
      </div>
      <span className="mt-2 text-[10px] font-bold tracking-widest text-cyan-700/80 uppercase">
        COMPONENTE
      </span>
    </div>
  );
};
