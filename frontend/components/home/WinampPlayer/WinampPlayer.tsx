import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { PixelIcon } from '../../common/PixelIcon';
import './WinampPlayer.css';

interface WinampPlayerProps {
  onClose?: () => void;
  className?: string;
}

const PLAYLIST = [
  { title: 'LIA - DISINTEGRATION', duration: '5:09', artist: 'Lia (2001)' },
  { title: 'NoLimits - Cyber Nostalgia', duration: '3:45', artist: 'Y2K Beats' },
  { title: 'Windows XP Startup (Trance Remix)', duration: '4:12', artist: 'Brian Eno Club Mix' },
  { title: 'Castle in the Sky', duration: '3:30', artist: 'EAJ Park (2002)' },
];

/**
 * WinampPlayer: Reproductor skeuomórfico nostálgico de audio
 * basado en la referencia de los años 2000 (Winamp Classic Skin).
 */
export const WinampPlayer: React.FC<WinampPlayerProps> = ({ onClose, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(20);
  const [volume, setVolume] = useState<number>(85);
  const [eqHeights, setEqHeights] = useState<number[]>([8, 12, 16, 14, 10, 15, 9, 13]);

  // Simulación del temporizador de reproducción
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSeconds((prev) => (prev + 1) % 300);
      // Animación viva de las barras del ecualizador
      setEqHeights(Array.from({ length: 8 }, () => Math.floor(Math.random() * 12) + 4));
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentTrack = PLAYLIST[trackIndex];
  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setSeconds(0);
  };

  const handlePrev = () => {
    setTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setSeconds(0);
  };

  return (
    <div className={`winamp-container ${className}`}>
      {/* Barra de Título Winamp */}
      <div className="winamp-titlebar">
        <div className="flex items-center gap-1.5">
          <PixelIcon name="winamp" size={14} />
          <span>WINAMP v2.91 - [LUNA EDITION]</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            className="w-3.5 h-3.5 bg-[#43637e] text-white flex items-center justify-center text-[9px] rounded-xs"
            title="Minimizar"
          >
            _
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-3.5 h-3.5 bg-[#bf360c] text-white flex items-center justify-center text-[9px] rounded-xs hover:bg-red-600"
              title="Cerrar reproductor"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Pantalla LED retro */}
      <div className="winamp-display">
        <div className="flex flex-col">
          <span className="winamp-timer">{timeFormatted}</span>
          <span className="text-[9px] text-[#00ff66] font-mono">192 KBPS STEREO 44.1 KHZ</span>
        </div>

        <div className="flex-1 overflow-hidden px-2">
          <div className="winamp-track-info" title={currentTrack.title}>
            {isPlaying ? '▶' : '❚❚'} {trackIndex + 1}. {currentTrack.title}
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {currentTrack.artist} ({currentTrack.duration})
          </div>
        </div>

        {/* Visualizador de Ecualizador */}
        <div className="winamp-eq-visualizer">
          {eqHeights.map((h, i) => (
            <div
              key={i}
              className="winamp-eq-bar"
              style={{ height: isPlaying ? `${h}px` : '3px' }}
            />
          ))}
        </div>
      </div>

      {/* Botones de control redondeados */}
      <div className="winamp-controls">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className="winamp-btn-round"
            title="Pista anterior"
          >
            <SkipBack className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="winamp-btn-round winamp-btn-play"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setSeconds(0);
            }}
            className="winamp-btn-round"
            title="Detener"
          >
            <Square className="w-2.5 h-2.5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="winamp-btn-round"
            title="Siguiente pista"
          >
            <SkipForward className="w-3 h-3" />
          </button>
        </div>

        {/* Control de Volumen */}
        <div className="flex items-center gap-1 bg-[#1a2d3e]/30 px-2 py-1 rounded-sm border border-[#506e87]/40">
          <Volume2 className="w-3 h-3 text-[#2a4862]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1.5 bg-[#45617a] accent-[#0055ea] rounded-xs cursor-pointer"
            title={`Volumen: ${volume}%`}
          />
          <span className="text-[9px] font-mono w-5 text-right">{volume}%</span>
        </div>
      </div>
    </div>
  );
};
