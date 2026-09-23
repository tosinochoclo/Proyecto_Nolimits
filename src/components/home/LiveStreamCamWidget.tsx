import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Users, Flame, Clock, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { WindowFrame } from '../layout/WindowFrame';
import { PixelButton } from '../common/PixelButton';

interface LiveStreamCamWidgetProps {
  onClose?: () => void;
  className?: string;
}

export const LiveStreamCamWidget: React.FC<LiveStreamCamWidgetProps> = ({
  onClose,
  className = ''
}) => {
  const [viewers, setViewers] = useState(1842);
  const [secondsLeft, setSecondsLeft] = useState(245); // 4 min countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
      // Subtle organic viewer fluctuation
      setViewers((v) => v + (Math.floor(Math.random() * 5) - 2));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <WindowFrame
      title="LIVE_RADAR_CAM01.AVI - [Transmisión Central]"
      variant="lavender"
      showControls={true}
      onClose={onClose}
      statusBarText={`STREAM BITRATE: 6.2 MBPS // ESPECTADORES: ${viewers.toLocaleString()} // SYNC: 100%`}
      className={`max-w-md ${className}`}
    >
      <div className="space-y-3 font-['Chakra_Petch'] text-xs">
        {/* Stream Video Container with CRT Scanlines & Overlays */}
        <div className="relative aspect-video bg-black overflow-hidden bevel-sunken crt-scanlines">
          {/* Simulated Cyber Stream Studio Video/Poster */}
          <img
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80"
            alt="Live Stream Cam"
            className="w-full h-full object-cover object-center opacity-80"
          />

          {/* Glitch Scanlines & Radial Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

          {/* Top Indicators: LIVE badge & Viewers */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 border border-[#ff007f] bevel-raised">
            <Radio className="w-3 h-3 text-[#ff007f] animate-pulse" />
            <span className="font-['Silkscreen'] text-[10px] text-white font-bold">EN VIVO</span>
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 px-2 py-0.5 border border-[#00d4ff]/40 text-[#00d4ff] font-['VT323'] text-xs">
            <Users className="w-3 h-3" />
            <span>{viewers.toLocaleString()}</span>
          </div>

          {/* Bottom Countdown Overlay to next live piece */}
          <div className="absolute bottom-2 left-2 right-2 bg-[#090614]/90 p-1.5 bevel-chrome flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
              <div>
                <div className="font-['Silkscreen'] text-[9px] text-white">SIGUIENTE DROP:</div>
                <div className="text-[10px] text-[#ff77b8] truncate font-bold">Zip Hoodie Gótico 'Overkill'</div>
              </div>
            </div>

            <div className="font-['Silkscreen'] text-xs text-[#00ff66] bg-black px-1.5 py-0.5 border border-[#00ff66]/40">
              {formatCountdown(secondsLeft)}
            </div>
          </div>
        </div>

        {/* Live Stream Chat Log Ticker */}
        <div className="bevel-sunken p-2 bg-[#05030a] space-y-1 font-mono text-[11px] max-h-20 overflow-hidden">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[#a855f7] font-bold">@clau_valpo:</span>
            <span>¿Queda talla M en la sucursal de Viña?</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00ff66]">
            <span className="text-[#ff007f] font-bold">★ SISTEMA:</span>
            <span>Stock liberado en tiempo real en Webpay</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[#00d4ff] font-bold">@goth_chile:</span>
            <span>Reservado y listo para retiro en Valparaíso 🖤</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex gap-2">
          <Link to="/catalog" className="flex-1">
            <PixelButton variant="primary" size="sm" className="w-full text-[11px] py-1.5">
              Capturar Prenda en Vivo
            </PixelButton>
          </Link>
        </div>
      </div>
    </WindowFrame>
  );
};
