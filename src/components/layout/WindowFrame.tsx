import React from 'react';
import { Minus, Square, X, Sparkles } from 'lucide-react';

interface WindowFrameProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'lavender' | 'chrome' | 'active';
  className?: string;
  bodyClassName?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  showControls?: boolean;
  statusBarText?: string;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title = 'Nolimits OS v2.0 - [Apparel Terminal]',
  subtitle,
  icon,
  children,
  variant = 'lavender',
  className = '',
  bodyClassName = '',
  onClose,
  onMinimize,
  onMaximize,
  showControls = true,
  statusBarText = 'STATUS: ONLINE // STOCK SYNC: REAL-TIME // CLUSTER: VINA-VALPO-QUILPUE'
}) => {
  const getHeaderClass = () => {
    switch (variant) {
      case 'active':
        return 'os-titlebar-active';
      case 'chrome':
        return 'os-titlebar-chrome';
      case 'lavender':
      default:
        return 'os-titlebar-lavender';
    }
  };

  return (
    <div
      className={`bevel-chrome rounded-xs overflow-hidden bg-[#0c0a14]/95 backdrop-blur-md shadow-2xl flex flex-col ${className}`}
    >
      {/* OS Titlebar */}
      <div
        className={`${getHeaderClass()} px-3 py-1.5 flex items-center justify-between select-none cursor-default text-white`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {icon || <Sparkles className="w-3.5 h-3.5 text-[#ff007f]" />}
          <span className="font-['Silkscreen'] text-xs tracking-wider text-white truncate drop-shadow-sm font-semibold">
            {title}
          </span>
          {subtitle && (
            <span className="hidden sm:inline-block font-['VT323'] text-sm text-[#e9d5ff]/90 ml-1">
              :: {subtitle}
            </span>
          )}
        </div>

        {/* Windows Control Buttons */}
        {showControls && (
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={onMinimize}
              aria-label="Minimizar"
              className="win-btn"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            <button
              type="button"
              onClick={onMaximize}
              aria-label="Maximizar"
              className="win-btn"
            >
              <Square className="w-2 h-2" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="win-btn win-btn-close"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Window Body Content */}
      <div className={`flex-1 p-3 sm:p-5 overflow-auto ${bodyClassName}`}>
        {children}
      </div>

      {/* Retro Status Bar at bottom of window */}
      {statusBarText && (
        <div className="bevel-sunken px-2.5 py-1 text-[11px] font-['VT323'] text-slate-300 flex items-center justify-between tracking-wide select-none border-t border-[#2d2242]">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse"></span>
            <span className="truncate">{statusBarText}</span>
          </div>
          <span className="text-[#a78bfa] shrink-0 hidden md:inline-block font-mono">
            PORT: 3000 // Y2K SECURE
          </span>
        </div>
      )}
    </div>
  );
};
