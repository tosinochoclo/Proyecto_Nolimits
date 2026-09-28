import React, { useState } from 'react';
import { Sparkles, Eye, RefreshCw } from 'lucide-react';
import { PixelIcon } from '../../common/PixelIcon';
import './Bryce3DGallery.css';

interface Bryce3DGalleryProps {
  onClose?: () => void;
  className?: string;
}

export const Bryce3DGallery: React.FC<Bryce3DGalleryProps> = ({ onClose, className = '' }) => {
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(100);

  const handleReRender = () => {
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className={`bryce-window winxp-window ${className}`}>
      {/* Titlebar */}
      <div className="winxp-titlebar">
        <div className="winxp-titlebar-title">
          <PixelIcon name="computer" size={15} />
          <span>Bryce 3D Ray-Tracer - [Virtual_Isle.ray]</span>
        </div>
        <div className="winxp-controls">
          <button
            type="button"
            className="winxp-btn-ctrl winxp-btn-min"
            title="Minimizar"
          >
            _
          </button>
          <button
            type="button"
            className="winxp-btn-ctrl winxp-btn-max"
            title="Maximizar"
          >
            □
          </button>
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

      {/* Menubar */}
      <div className="winxp-menubar">
        <span className="winxp-menu-item">Scene</span>
        <span className="winxp-menu-item">Objects</span>
        <span className="winxp-menu-item">Materials</span>
        <span className="winxp-menu-item">Sky & Fog</span>
        <span className="winxp-menu-item">Render</span>
      </div>

      {/* Viewport Content */}
      <div className="p-3 bg-[#ece9d8] space-y-2">
        <div className="relative aspect-video bg-[#001f3f] winxp-bevel-in overflow-hidden border border-gray-600">
          {/* Gráfico 3D primitivo renderizado con vectores SVG estilizados inspirados en Bryce 3D */}
          <svg
            viewBox="0 0 600 340"
            className={`w-full h-full object-cover transition-all ${wireframeMode ? 'opacity-80' : 'opacity-100'}`}
          >
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4aa3df" />
                <stop offset="50%" stopColor="#87ceeb" />
                <stop offset="100%" stopColor="#e0f4ff" />
              </linearGradient>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2c7da0" />
                <stop offset="50%" stopColor="#468faf" />
                <stop offset="100%" stopColor="#61a5c2" />
              </linearGradient>
              <linearGradient id="hillGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2d6a4f" />
                <stop offset="100%" stopColor="#1b4332" />
              </linearGradient>
              <linearGradient id="hillGrad2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52b788" />
                <stop offset="100%" stopColor="#2d6a4f" />
              </linearGradient>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#fff3b0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffeedb" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Cielo */}
            <rect width="600" height="220" fill="url(#skyGrad)" />
            <circle cx="480" cy="70" r="50" fill="url(#sunGlow)" />

            {/* Nubes Bryce primitivas */}
            <ellipse cx="150" cy="60" rx="90" ry="25" fill="#ffffff" opacity="0.6" />
            <ellipse cx="380" cy="80" rx="110" ry="28" fill="#ffffff" opacity="0.5" />

            {/* Montañas de fondo poligonales */}
            <polygon points="-50,220 80,90 220,220" fill="url(#hillGrad1)" stroke={wireframeMode ? '#00ff66' : 'none'} strokeWidth={wireframeMode ? 1.5 : 0} />
            <polygon points="140,220 300,70 460,220" fill="url(#hillGrad2)" stroke={wireframeMode ? '#00ff66' : 'none'} strokeWidth={wireframeMode ? 1.5 : 0} />
            <polygon points="360,220 520,100 660,220" fill="url(#hillGrad1)" stroke={wireframeMode ? '#00ff66' : 'none'} strokeWidth={wireframeMode ? 1.5 : 0} />

            {/* Agua con reflejos */}
            <rect y="210" width="600" height="130" fill="url(#waterGrad)" />
            <ellipse cx="300" cy="270" rx="200" ry="12" fill="#ffffff" opacity="0.15" />
            <ellipse cx="260" cy="290" rx="150" ry="8" fill="#ffffff" opacity="0.2" />

            {/* Isla central de hierba */}
            <ellipse cx="300" cy="250" rx="120" ry="45" fill="#40916c" stroke={wireframeMode ? '#00ff66' : '#1b4332'} strokeWidth="2" />
            <ellipse cx="300" cy="245" rx="100" ry="35" fill="#74c69d" />

            {/* Estatua / Monolito retro 3D en la isla */}
            <polygon points="290,240 310,240 305,140 295,140" fill="#9e9e9e" stroke={wireframeMode ? '#ff00ff' : '#424242'} strokeWidth="1" />
            <circle cx="300" cy="130" r="14" fill="#b0bec5" stroke={wireframeMode ? '#ff00ff' : '#37474f'} strokeWidth="1" />
            
            {/* Poliedro flotante iluminado (Early CGI primitive) */}
            <polygon points="300,85 315,100 300,115 285,100" fill="#ffd166" opacity="0.9" stroke="#ffb703" strokeWidth="1.5" />
            <polygon points="300,85 300,115 315,100" fill="#f77f00" opacity="0.7" />
          </svg>

          {/* Sello de marca de agua Early CGI */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-[#00ff66] font-mono text-[10px] px-2 py-0.5 winxp-bevel-in border border-gray-500">
            RENDER: RAYTRACE_DEPTH=16 // RES: 600x340 // 2001
          </div>

          {wireframeMode && (
            <div className="absolute top-2 right-2 bg-yellow-300 text-black font-bold text-[10px] px-2 py-0.5 border border-black animate-pulse">
              WIREFRAME MODE
            </div>
          )}
        </div>

        {/* Barra de progreso de renderizado */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-gray-700">
            <span>Estado de renderizado: {renderProgress === 100 ? 'Listo (100%)' : `Calculando rayos... ${renderProgress}%`}</span>
            <span className="font-mono text-[10px]">14.2 seg</span>
          </div>

          <div className="winxp-progress">
            {Array.from({ length: Math.floor(renderProgress / 5) }).map((_, i) => (
              <div key={i} className="winxp-progress-chunk" />
            ))}
          </div>
        </div>

        {/* Acciones de la escena */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWireframeMode(!wireframeMode)}
              className="winxp-button text-xs"
            >
              <Eye className="w-3 h-3 text-blue-600" />
              <span>{wireframeMode ? 'Modo Sólido' : 'Modo Malla (Wireframe)'}</span>
            </button>

            <button
              type="button"
              onClick={handleReRender}
              className="winxp-button text-xs"
            >
              <RefreshCw className="w-3 h-3 text-green-700" />
              <span>Re-renderizar</span>
            </button>
          </div>

          <span className="text-[11px] text-gray-600 font-semibold">
            Nolimits Digital Art 2000s
          </span>
        </div>
      </div>
    </div>
  );
};
