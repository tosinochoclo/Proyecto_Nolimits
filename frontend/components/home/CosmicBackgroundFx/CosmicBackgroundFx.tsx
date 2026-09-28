import React, { useState } from 'react';
import { PixelIcon } from '../../common/PixelIcon';
import { WinampPlayer } from '../WinampPlayer/WinampPlayer';
import { MSPaintPalette } from '../MSPaintPalette/MSPaintPalette';
import { Bryce3DGallery } from '../Bryce3DGallery/Bryce3DGallery';
import './CosmicBackgroundFx.css';

/**
 * Componente: CosmicBackgroundFx (Old Tech Nostalgia Desktop Layer)
 * 
 * Cumple los parámetros innegociables de Windows XP / Old Tech Nostalgia:
 * - Íconos de acceso directo de escritorio pixel art clásicos.
 * - Reproductor Winamp integrado y funcional con animaciones de ecualizador.
 * - Paleta interactiva de herramientas de MS Paint con selector de colores.
 * - Ventana de gráficos primitivos 3D estilo Bryce 3D early CGI.
 */
export const CosmicBackgroundFx: React.FC = () => {
  const [showWinamp, setShowWinamp] = useState<boolean>(true);
  const [showPaint, setShowPaint] = useState<boolean>(true);
  const [showBryce, setShowBryce] = useState<boolean>(true);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const desktopShortcuts = [
    { id: 'pc', name: 'Mi PC', icon: 'computer' as const, action: () => {} },
    { id: 'docs', name: 'Mis Documentos', icon: 'folder' as const, action: () => {} },
    { id: 'trash', name: 'Papelera', icon: 'trash' as const, action: () => {} },
    { id: 'winamp', name: 'Winamp Audio', icon: 'winamp' as const, action: () => setShowWinamp(true) },
    { id: 'paint', name: 'MS Paint', icon: 'paint' as const, action: () => setShowPaint(true) },
    { id: 'bryce', name: 'Bryce 3D', icon: 'cd' as const, action: () => setShowBryce(true) },
  ];

  return (
    <div className="old-tech-desk-container">
      {/* 1. Barra de Accesos Directos de Escritorio */}
      <div className="xp-desktop-shortcuts">
        {desktopShortcuts.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedIcon(item.id);
              item.action();
            }}
            className={`xp-desktop-icon ${selectedIcon === item.id ? 'selected' : ''}`}
            title={`Abrir ${item.name}`}
          >
            <PixelIcon name={item.icon} size={32} />
            <span className="xp-desktop-icon-label">{item.name}</span>
          </div>
        ))}
      </div>

      {/* 2. Área de Widgets Nostálgicos de los Años 2000 */}
      <div className="xp-floating-widgets-area">
        {/* Columna Izquierda: Winamp + Paleta Paint */}
        <div className="space-y-3">
          {showWinamp && (
            <WinampPlayer onClose={() => setShowWinamp(false)} />
          )}

          {showPaint && (
            <div className="flex justify-start">
              <MSPaintPalette onClose={() => setShowPaint(false)} />
            </div>
          )}
        </div>

        {/* Columna Derecha: Bryce 3D Primitive CGI Gallery */}
        {showBryce && (
          <div className="flex-1">
            <Bryce3DGallery onClose={() => setShowBryce(false)} />
          </div>
        )}
      </div>
    </div>
  );
};
