import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { WindowFrame } from '../layout/WindowFrame';

interface WinampPlayerWidgetProps {
  onClose?: () => void;
  className?: string;
}

const PLAYLIST = [
  { id: 1, title: '01. Nolimits - Cyber-Tribal Overkill (Drop Mix)', duration: '03:42', genre: 'Dark Witchwave' },
  { id: 2, title: '02. Valparaíso Night Core - Rain In The Port', duration: '04:15', genre: 'Industrial Breakbeat' },
  { id: 3, title: '03. Viña Sub-Zero - Y2K Metallic Bassline', duration: '02:58', genre: 'Cyber-Gothic Trance' },
];

export const WinampPlayerWidget: React.FC<WinampPlayerWidgetProps> = ({
  onClose,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);

  const track = PLAYLIST[currentTrackIndex];

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  return (
    <WindowFrame
      title="CYBER_AMP.EXE - [Audio Player v2.9]"
      variant="lavender"
      showControls={true}
      onClose={onClose}
      statusBarText="192 KBPS // 44.1 KHZ // STEREO // HI-FI CHIP"
      className={`max-w-md ${className}`}
    >
      <div className="space-y-3 font-mono text-xs">
        {/* LCD Screen Display */}
        <div className="bevel-sunken p-2.5 bg-[#05040a] border border-[#3c2a5c] relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-['Silkscreen'] text-[#00d4ff] pb-1">
            <span className="flex items-center gap-1.5">
              <Disc className={`w-3.5 h-3.5 text-[#ff007f] ${isPlaying ? 'animate-spin' : ''}`} />
              <span className="text-white font-bold">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
            </span>
            <span className="font-mono text-[#00ff66]">02:18 / {track.duration}</span>
          </div>

          {/* Marquee Track Title */}
          <div className="font-['VT323'] text-lg text-[#ff77b8] truncate tracking-wider">
            {track.title}
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
            <span className="text-[#a855f7]">{track.genre}</span>
            <span className="text-yellow-300">AUTO-REPEAT: ON</span>
          </div>

          {/* 16-Band Graphic Equalizer Bars (animated) */}
          <div className="flex items-end gap-1 h-10 pt-2 border-t border-[#1d162e] mt-2">
            {[45, 80, 60, 95, 30, 70, 85, 100, 65, 40, 90, 75, 50, 85, 95, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#00ff66] via-yellow-400 to-[#ff007f] transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.min(100, Math.max(15, (h * volume) / 100))}%` : '15%',
                  animation: isPlaying ? `eqBarBounce 0.${(i % 5) + 6}s ease-in-out infinite alternate` : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Transport & Volume Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Playback Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="win-btn w-7 h-6"
              title="Pista Anterior"
            >
              <SkipBack className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="win-btn w-8 h-6 bg-[#ff007f]/30"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#ff007f]" /> : <Play className="w-3.5 h-3.5 text-[#00ff66]" />}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="win-btn w-7 h-6"
              title="Siguiente Pista"
            >
              <SkipForward className="w-3 h-3" />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-1.5 bevel-sunken px-2 py-1 bg-black">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#a855f7] hover:text-white"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
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
              className="w-16 sm:w-20 accent-[#ff007f] cursor-pointer"
            />
            <span className="font-['Silkscreen'] text-[9px] text-white w-6 text-right">
              {isMuted ? '0%' : `${volume}%`}
            </span>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
