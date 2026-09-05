import React from 'react';

interface Props {
  className?: string;
  type?: 'componente' | 'sensor';
  label?: string;
  showUnregisteredText?: boolean;
}

export const TechnicalPlaceholder: React.FC<Props> = ({
  className = '',
  type = 'componente',
  label,
  showUnregisteredText = true,
}) => {
  const displayLabel = label || (type === 'sensor' ? 'SENSOR' : 'COMPONENTE');

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-full bg-[#f8fafc] select-none ${className}`}
    >
      {/* Corner blueprint marks */}
      <span className="absolute top-1 left-1.5 text-[9px] font-mono text-cyan-700/40 pointer-events-none select-none">
        ┌
      </span>
      <span className="absolute top-1 right-1.5 text-[9px] font-mono text-cyan-700/40 pointer-events-none select-none">
        ┐
      </span>
      <span className="absolute bottom-1 left-1.5 text-[9px] font-mono text-cyan-700/40 pointer-events-none select-none">
        └
      </span>
      <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-cyan-700/40 pointer-events-none select-none">
        ┘
      </span>

      {/* Top Left Text matching screenshot */}
      {showUnregisteredText && (
        <span className="absolute top-2 left-2 text-[8px] font-mono font-medium tracking-wider text-cyan-800/60 uppercase select-none">
          IMAGEM DO ITEM NÃO CADASTRADA
        </span>
      )}

      {/* Center Blueprint Circles & Graphic */}
      <div className="relative flex flex-col items-center justify-center mt-3">
        <div className="relative flex items-center justify-center w-24 h-24">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-cyan-500/70"
            fill="none"
            stroke="currentColor"
          >
            {/* Outer dashed concentric ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="text-cyan-500/50"
            />
            {/* Solid middle ring */}
            <circle
              cx="50"
              cy="50"
              r="32"
              strokeWidth="1.2"
              className="text-cyan-500/70"
            />
            {/* Subtle inner radial gradient fill */}
            <circle
              cx="50"
              cy="50"
              r="24"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              className="text-cyan-400/40"
              fill="rgba(6, 182, 212, 0.04)"
            />

            {/* Crosshairs */}
            <line x1="50" y1="4" x2="50" y2="14" strokeWidth="1.2" />
            <line x1="50" y1="86" x2="50" y2="96" strokeWidth="1.2" />
            <line x1="4" y1="50" x2="14" y2="50" strokeWidth="1.2" />
            <line x1="86" y1="50" x2="96" y2="50" strokeWidth="1.2" />

            {type === 'sensor' ? (
              /* Sensor reticle */
              <>
                <circle cx="50" cy="50" r="14" strokeWidth="1.5" className="text-cyan-600" />
                <circle cx="50" cy="50" r="6" strokeWidth="1.5" fill="rgba(6, 182, 212, 0.2)" />
                <line x1="32" y1="50" x2="40" y2="50" strokeWidth="1.5" />
                <line x1="60" y1="50" x2="68" y2="50" strokeWidth="1.5" />
                <line x1="50" y1="32" x2="50" y2="40" strokeWidth="1.5" />
                <line x1="50" y1="60" x2="50" y2="68" strokeWidth="1.5" />
              </>
            ) : (
              /* Isometric 3D Component Cube */
              <>
                <path
                  d="M50 38 L62 45 L62 58 L50 65 L38 58 L38 45 Z"
                  strokeWidth="1.3"
                  fill="rgba(6, 182, 212, 0.08)"
                  className="text-cyan-600"
                />
                <line x1="50" y1="38" x2="50" y2="52" strokeWidth="1.3" className="text-cyan-600" />
                <line x1="50" y1="52" x2="62" y2="45" strokeWidth="1.3" className="text-cyan-600" />
                <line x1="50" y1="52" x2="38" y2="45" strokeWidth="1.3" className="text-cyan-600" />
              </>
            )}
          </svg>
        </div>

        {/* Pill label matching screenshot */}
        <div className="mt-1 px-2.5 py-0.5 text-[8.5px] font-mono font-bold tracking-widest text-cyan-700 uppercase bg-cyan-50/80 border border-cyan-300/60 rounded-xs">
          {displayLabel}
        </div>
      </div>
    </div>
  );
};
