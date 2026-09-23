import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'retro';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'retro',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-b from-[#ff007f] via-[#d6006b] to-[#99004d] text-white border-t-[#ff66b2] border-l-[#ff66b2] border-r-[#660033] border-b-[#4d0026] hover:brightness-110 active:brightness-95';
      case 'accent':
        return 'bg-gradient-to-b from-[#00d4ff] via-[#0099cc] to-[#006688] text-black font-semibold border-t-[#80e5ff] border-l-[#80e5ff] border-r-[#004d66] border-b-[#003344] hover:brightness-110';
      case 'danger':
        return 'bg-gradient-to-b from-[#ef4444] via-[#dc2626] to-[#991b1b] text-white border-t-[#fca5a5] border-l-[#fca5a5] border-r-[#7f1d1d] border-b-[#450a0a]';
      case 'secondary':
        return 'bg-gradient-to-b from-[#a855f7] via-[#9333ea] to-[#6b21a8] text-white border-t-[#d8b4fe] border-l-[#d8b4fe] border-r-[#3b0764] border-b-[#2e1065]';
      case 'retro':
      default:
        return 'bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8] text-[#0f172a] font-bold border-t-[#ffffff] border-l-[#f1f5f9] border-r-[#334155] border-b-[#1e293b] active:border-t-[#1e293b] active:border-l-[#1e293b] active:border-r-[#ffffff] active:border-b-[#ffffff]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2.5 py-1 gap-1.5';
      case 'lg':
        return 'text-base px-5 py-2.5 gap-2.5';
      case 'md':
      default:
        return 'text-sm px-3.5 py-1.5 gap-2';
    }
  };

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-['Silkscreen'] tracking-wide
        border-2 select-none cursor-pointer transition-all duration-75
        active:translate-x-[1px] active:translate-y-[1px]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
