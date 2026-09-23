import React from 'react';

interface SpiderwebProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  color?: string;
}

export const SpiderwebDecor: React.FC<SpiderwebProps> = ({
  position,
  className = '',
  color = '#a855f7'
}) => {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      case 'top-left':
      default:
        return 'none';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'top-left':
      default:
        return 'top-0 left-0';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} pointer-events-none select-none z-10 opacity-40 hover:opacity-75 transition-opacity duration-300 ${className}`}
      style={{ transform: getTransform() }}
      aria-hidden="true"
    >
      <svg
        width="110"
        height="110"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20 sm:w-28 sm:h-28"
      >
        {/* Radial structural threads */}
        <line x1="0" y1="0" x2="100" y2="0" stroke={color} strokeWidth="1" strokeOpacity="0.8" />
        <line x1="0" y1="0" x2="95" y2="30" stroke={color} strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="0" y1="0" x2="80" y2="60" stroke={color} strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="0" y1="0" x2="60" y2="80" stroke={color} strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="0" y1="0" x2="30" y2="95" stroke={color} strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="0" y1="0" x2="0" y2="100" stroke={color} strokeWidth="1" strokeOpacity="0.8" />

        {/* Concentric curved spiderweb arcs with cyberpunk tension */}
        <path d="M 20,0 Q 15,10 0,20" stroke={color} strokeWidth="0.75" fill="none" />
        <path d="M 40,0 Q 32,20 0,40" stroke={color} strokeWidth="0.75" fill="none" />
        <path d="M 60,0 Q 48,32 0,60" stroke={color} strokeWidth="0.8" fill="none" />
        <path d="M 80,0 Q 64,48 0,80" stroke={color} strokeWidth="0.85" fill="none" />
        <path d="M 100,0 Q 80,64 0,100" stroke={color} strokeWidth="0.9" fill="none" />

        {/* Secondary cross-rings */}
        <path d="M 12,0 Q 9,6 0,12" stroke="#ff007f" strokeWidth="0.6" fill="none" strokeOpacity="0.6" />
        <path d="M 30,0 Q 24,15 0,30" stroke="#ff007f" strokeWidth="0.6" fill="none" strokeOpacity="0.6" />
        <path d="M 50,0 Q 40,25 0,50" stroke="#ff007f" strokeWidth="0.7" fill="none" strokeOpacity="0.6" />
        <path d="M 70,0 Q 56,38 0,70" stroke="#ff007f" strokeWidth="0.7" fill="none" strokeOpacity="0.6" />
        <path d="M 90,0 Q 72,52 0,90" stroke="#ff007f" strokeWidth="0.8" fill="none" strokeOpacity="0.7" />

        {/* Dew drops / digital glitter points on intersections */}
        <circle cx="20" cy="0" r="1" fill="#fff" />
        <circle cx="40" cy="0" r="1.2" fill="#00d4ff" />
        <circle cx="60" cy="0" r="1.2" fill="#fff" />
        <circle cx="80" cy="0" r="1.5" fill="#ff007f" />
        <circle cx="0" cy="20" r="1" fill="#fff" />
        <circle cx="0" cy="40" r="1.2" fill="#00d4ff" />
        <circle cx="0" cy="60" r="1.2" fill="#fff" />
        <circle cx="0" cy="80" r="1.5" fill="#ff007f" />
        <circle cx="36" cy="36" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
};
