import React from 'react';
import { Link } from 'react-router-dom';

interface PixelNavDockProps {
  onOpenWidget?: (widgetId: 'diario' | 'contacto' | 'winamp') => void;
  activeWidget?: string | null;
}

export const PixelNavDock: React.FC<PixelNavDockProps> = ({
  onOpenWidget,
  activeWidget
}) => {
  return (
    <div className="bevel-chrome bg-[#0c0916]/95 p-2 sm:p-3 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 shadow-[0_0_20px_rgba(157,0,255,0.3)]">
      {/* 1. HOGAR (Home) */}
      <Link
        to="/"
        className="group flex flex-col items-center justify-center p-2 min-w-[70px] bevel-sunken bg-black/60 hover:bg-[#1a122e] transition-all cursor-pointer"
        title="Escritorio / Inicio"
      >
        <div className="w-8 h-8 flex items-center justify-center relative mb-1 group-hover:scale-110 transition-transform">
          {/* Pixel Art Home Icon (SVG) */}
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" className="image-pixelated">
            <path d="M8 1L1 7H3V14H6V10H10V14H13V7H15L8 1Z" fill="#ff007f" />
            <rect x="7" y="11" width="2" height="3" fill="#ffffff" />
            <rect x="5" y="4" width="2" height="2" fill="#00d4ff" />
            <path d="M8 2L3 6.5V13H5V9H11V13H13V6.5L8 2Z" fill="#ffd1eb" opacity="0.4" />
          </svg>
        </div>
        <span className="font-['Silkscreen'] text-[10px] sm:text-xs text-white group-hover:text-[#ff007f] tracking-wider">
          HOGAR
        </span>
      </Link>

      {/* 2. DIARIO (Diary / Drops Log) */}
      <button
        type="button"
        onClick={() => onOpenWidget && onOpenWidget('diario')}
        className={`group flex flex-col items-center justify-center p-2 min-w-[70px] bevel-sunken transition-all cursor-pointer ${
          activeWidget === 'diario' ? 'bg-[#ff007f]/20 border-b-2 border-[#ff007f]' : 'bg-black/60 hover:bg-[#1a122e]'
        }`}
        title="Abrir Diario de Lanzamientos & Notas"
      >
        <div className="w-8 h-8 flex items-center justify-center relative mb-1 group-hover:scale-110 transition-transform">
          {/* Pixel Art Diary / Book Icon (SVG) */}
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="#7c3aed" />
            <rect x="3" y="3" width="10" height="10" fill="#120c22" />
            <rect x="5" y="5" width="6" height="1.5" fill="#00d4ff" />
            <rect x="5" y="7.5" width="6" height="1.5" fill="#ffffff" />
            <rect x="5" y="10" width="4" height="1.5" fill="#ff007f" />
            <rect x="2" y="2" width="2" height="12" fill="#c4b5fd" />
          </svg>
        </div>
        <span className="font-['Silkscreen'] text-[10px] sm:text-xs text-white group-hover:text-[#a855f7] tracking-wider">
          DIARIO
        </span>
      </button>

      {/* 3. COMPRAS (Shopping / Catalog) */}
      <Link
        to="/catalog"
        className="group flex flex-col items-center justify-center p-2 min-w-[70px] bevel-sunken bg-black/60 hover:bg-[#1a122e] transition-all cursor-pointer"
        title="Catálogo & Drops Activos"
      >
        <div className="w-8 h-8 flex items-center justify-center relative mb-1 group-hover:scale-110 transition-transform">
          {/* Pixel Art Shopping Bag / Cart Icon (SVG) */}
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <path d="M4 5V3C4 1.89543 4.89543 1 6 1H10C11.1046 1 12 1.89543 12 3V5H14L15 15H1L2 5H4ZM6 3V5H10V3H6ZM4 7H6V9H4V7ZM10 7H12V9H10V7Z" fill="#00d4ff" />
            <rect x="7" y="10" width="2" height="3" fill="#ff007f" />
          </svg>
        </div>
        <span className="font-['Silkscreen'] text-[10px] sm:text-xs text-white group-hover:text-[#00d4ff] tracking-wider">
          COMPRAS
        </span>
      </Link>

      {/* 4. CONTACTO (Contact / Chat Hotline) */}
      <button
        type="button"
        onClick={() => onOpenWidget && onOpenWidget('contacto')}
        className={`group flex flex-col items-center justify-center p-2 min-w-[70px] bevel-sunken transition-all cursor-pointer ${
          activeWidget === 'contacto' ? 'bg-[#00d4ff]/20 border-b-2 border-[#00d4ff]' : 'bg-black/60 hover:bg-[#1a122e]'
        }`}
        title="Contacto Directo, WhatsApp & Redes"
      >
        <div className="w-8 h-8 flex items-center justify-center relative mb-1 group-hover:scale-110 transition-transform">
          {/* Pixel Art Chat / Mail Icon (SVG) */}
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="10" fill="#9d00ff" />
            <rect x="2" y="4" width="12" height="8" fill="#0a0614" />
            <path d="M2 4L8 9L14 4" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="7" y="8.5" width="2" height="2" fill="#ff007f" />
          </svg>
        </div>
        <span className="font-['Silkscreen'] text-[10px] sm:text-xs text-white group-hover:text-[#ff77b8] tracking-wider">
          CONTACTO
        </span>
      </button>
    </div>
  );
};
