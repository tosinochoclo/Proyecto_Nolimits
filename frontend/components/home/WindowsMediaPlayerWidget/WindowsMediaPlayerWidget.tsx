import React from 'react';
import { Film, Tv } from 'lucide-react';
import { PixelIcon } from '../../common/PixelIcon';
import './WindowsMediaPlayerWidget.css';

interface WindowsMediaPlayerWidgetProps {
  videoSrc?: string;
  gifSrc?: string;
  posterSrc?: string;
  title?: string;
  onClose?: () => void;
  className?: string;
}

/**
 * WindowsMediaPlayerWidget
 * 
 * Ventana lista para incrustar Video o animación GIF con estética
 * auténtica de Reproductor de Windows Media (Windows XP Luna Edition).
 * Sin botones molestos de reproducción (stop, pausa, saltar, devolverse, barra de duración eliminados),
 * enfocado exclusivamente en la visualización limpia del clip o animación multimedia.
 */
export const WindowsMediaPlayerWidget: React.FC<WindowsMediaPlayerWidgetProps> = ({
  videoSrc,
  gifSrc,
  posterSrc,
  title = 'Clip_Promocional.wmv',
  onClose,
  className = ''
}) => {
  return (
    <div className={`wmp-window ${className}`}>
      {/* 1. Barra de Título Luna Azul */}
      <div className="winxp-titlebar py-1 px-3 flex items-center justify-between">
        <div className="winxp-titlebar-title text-xs flex items-center gap-1.5">
          <PixelIcon name="cd" size={15} />
          <span className="font-bold tracking-tight">
            Reproductor de Windows Media - [{title}]
          </span>
        </div>
        <div className="winxp-controls">
          <button type="button" className="winxp-btn-ctrl winxp-btn-min" title="Minimizar">_</button>
          <button type="button" className="winxp-btn-ctrl winxp-btn-max" title="Maximizar">□</button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="winxp-btn-ctrl winxp-btn-close"
              title="Cerrar"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 2. Barra de Menú Tradicional de Windows Media */}
      <div className="winxp-menubar text-[11px] px-3 py-0.5 flex items-center justify-between border-b border-[#d0ccc0]">
        <div className="flex items-center gap-3">
          <span className="winxp-menu-item">Archivo</span>
          <span className="winxp-menu-item">Ver</span>
          <span className="winxp-menu-item">Reproducir</span>
          <span className="winxp-menu-item">Herramientas</span>
          <span className="winxp-menu-item">Ayuda</span>
        </div>
        <div className="text-[10px] text-gray-600 font-mono hidden sm:inline">
          Windows Media 9 Series
        </div>
      </div>

      {/* 3. Pantalla de Visualización Limpia de Video / GIF */}
      <div className="wmp-viewport">
        <div className="wmp-crt-overlay" />

        {videoSrc ? (
          <video
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain relative z-10"
          />
        ) : gifSrc ? (
          <img
            src={gifSrc}
            alt="Clip Animado Promocional"
            className="w-full h-full object-contain relative z-10"
          />
        ) : (
          /* Estado en espera: Área reservada para futuro Video o GIF sin botones molestos */
          <div className="relative z-10 text-center px-4 py-8 max-w-lg flex flex-col items-center">
            {/* Ícono de Video Retro con Efecto Neón Azul Windows */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#1e50c4] to-[#0a235c] border-2 border-[#5490ff] shadow-[0_0_20px_rgba(30,80,196,0.6)] flex items-center justify-center mb-3">
              <Film className="w-8 h-8 text-[#d0e4ff] animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-[#82b4ff] text-[11px] font-semibold mb-2">
              <Tv className="w-3 h-3 text-cyan-400" />
              <span>Espacio Reservado para Video o GIF</span>
            </div>

            <h3 className="text-white text-base sm:text-lg font-bold tracking-wide drop-shadow mb-1 font-sans">
              Pantalla Multimedia Lista
            </h3>
            <p className="text-blue-200 text-xs sm:text-sm leading-relaxed max-w-md mb-4 font-sans">
              Esta ventana está configurada para alojar tu video promocional, comercial o animación GIF en formato panorámico de alta definición.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-300 font-mono bg-black/40 px-3 py-1.5 rounded border border-gray-700">
              <span className="text-emerald-400">● Listo para incrustar</span>
              <span className="text-gray-500">|</span>
              <span>Formatos: .MP4, .GIF, .WEBM</span>
              <span className="text-gray-500">|</span>
              <span>Relación: 16:9 Panorámica</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
