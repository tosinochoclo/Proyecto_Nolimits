import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Film,
  Sparkles,
  Tv
} from 'lucide-react';
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
 * 
 * Ocupa el ancho completo indicado en el área superior del escritorio principal.
 */
export const WindowsMediaPlayerWidget: React.FC<WindowsMediaPlayerWidgetProps> = ({
  videoSrc,
  gifSrc,
  posterSrc,
  title = 'Clip_Promocional.wmv',
  onClose,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
  };

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

      {/* 3. Pantalla de Visualización de Video / GIF */}
      <div className="wmp-viewport">
        <div className="wmp-crt-overlay" />

        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            className="w-full h-full object-contain"
            onTimeUpdate={() => {
              if (videoRef.current) {
                const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                setProgress(isNaN(p) ? 0 : p);
              }
            }}
            onEnded={() => setIsPlaying(false)}
          />
        ) : gifSrc ? (
          <img
            src={gifSrc}
            alt="Clip Animado"
            className="w-full h-full object-contain relative z-10"
          />
        ) : (
          /* Estado en espera: Área reservada para futuro Video o GIF */
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

      {/* 4. Barra de Controles de Reproducción Estilo XP */}
      <div className="wmp-controls-bar">
        {/* Barra de Progreso / Seeker */}
        <div className="flex items-center gap-2 text-[11px] text-gray-700">
          <span className="font-mono text-[10px] w-10 text-right">
            {isPlaying ? '00:18' : '00:00'}
          </span>
          <div className="flex-1 h-3 bg-white winxp-bevel-in relative flex items-center px-0.5 cursor-pointer">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-200"
              style={{ width: `${isPlaying ? (progress || 35) : 0}%` }}
            />
            <div
              className="w-2 h-3.5 bg-gray-300 border border-gray-600 absolute shadow-sm"
              style={{ left: `calc(${isPlaying ? (progress || 35) : 0}% - 4px)` }}
            />
          </div>
          <span className="font-mono text-[10px] w-10 text-gray-500">
            01:45
          </span>
        </div>

        {/* Botones de Control de Reproducción */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleStop}
              className="wmp-btn-action"
              title="Detener"
            >
              <Square className="w-3 h-3 fill-gray-700" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="wmp-btn-action wmp-btn-play-main"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-blue-900" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-blue-900 ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {}}
              className="wmp-btn-action"
              title="Anterior"
            >
              <SkipBack className="w-3 h-3 fill-gray-700" />
            </button>

            <button
              type="button"
              onClick={() => {}}
              className="wmp-btn-action"
              title="Siguiente"
            >
              <SkipForward className="w-3 h-3 fill-gray-700" />
            </button>

            <div className="h-4 w-px bg-gray-400 mx-1" />

            {/* Control de Volumen */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="wmp-btn-action"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 text-red-600" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1.5 accent-blue-600 cursor-pointer"
              title="Volumen"
            />
          </div>

          {/* Estado Informativo Inferior */}
          <div className="flex items-center gap-3 text-[11px] text-gray-700">
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-blue-600'}`} />
              <span className="font-semibold text-[10px]">
                {isPlaying ? 'Reproduciendo' : 'En pausa (Listo)'}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[10px] text-gray-500 font-mono">
              <span>Modo: Panorámico</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
