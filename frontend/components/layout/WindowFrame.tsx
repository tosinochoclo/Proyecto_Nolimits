import React from 'react';
import { PixelIcon } from '../common/PixelIcon';

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

/**
 * WindowFrame: Contenedor principal de ventana estilo Windows XP Luna Blue.
 * 
 * Cumple estrictamente con las directrices de diseño:
 * - Marco biselado y barra de título azul degradado con botones clásicos.
 * - Fondo interior blanco puro (#ffffff) para máxima legibilidad.
 * - Tipografía clara, no pixelada y pequeña.
 */
export const WindowFrame: React.FC<WindowFrameProps> = ({
  title = 'Nolimits OS - [Windows XP Explorer]',
  subtitle,
  icon,
  children,
  className = '',
  bodyClassName = '',
  onClose,
  onMinimize,
  onMaximize,
  showControls = true,
  statusBarText = 'Listo // Sistema operativo Windows XP Luna Edition // Conectado a Servidor Central'
}) => {
  return (
    <div className={`winxp-window ${className}`}>
      {/* Barra de Título Windows XP Luna */}
      <div className="winxp-titlebar">
        <div className="winxp-titlebar-title truncate">
          {icon || <PixelIcon name="windows-flag" size={15} />}
          <span className="truncate">{title}</span>
          {subtitle && (
            <span className="hidden sm:inline font-normal text-[11px] text-white/90">
              - {subtitle}
            </span>
          )}
        </div>

        {/* Botones de Control de Ventana */}
        {showControls && (
          <div className="winxp-controls">
            <button
              type="button"
              onClick={onMinimize}
              aria-label="Minimizar"
              className="winxp-btn-ctrl winxp-btn-min"
              title="Minimizar"
            >
              _
            </button>
            <button
              type="button"
              onClick={onMaximize}
              aria-label="Maximizar"
              className="winxp-btn-ctrl winxp-btn-max"
              title="Maximizar"
            >
              □
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="winxp-btn-ctrl winxp-btn-close"
              title="Cerrar"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Menú de ventana clásico (Archivo, Edición, Ver, Ayuda) */}
      <div className="winxp-menubar">
        <span className="winxp-menu-item">Archivo</span>
        <span className="winxp-menu-item">Edición</span>
        <span className="winxp-menu-item">Ver</span>
        <span className="winxp-menu-item">Favoritos</span>
        <span className="winxp-menu-item">Herramientas</span>
        <span className="winxp-menu-item">Ayuda</span>
      </div>

      {/* Área de Contenido Principal (Fondo Blanco Limpio y Bisel Interior) */}
      <div className={`winxp-content-pane flex-1 overflow-auto ${bodyClassName}`}>
        {children}
      </div>

      {/* Barra de Estado Inferior estilo Windows XP */}
      {statusBarText && (
        <div className="winxp-statusbar select-none">
          <div className="winxp-status-pane flex-1 truncate text-gray-700 font-sans">
            {statusBarText}
          </div>
          <div className="winxp-status-pane hidden sm:flex items-center gap-1 text-[10px] text-gray-600 font-mono">
            <span>Red Local: 100 Mbps</span>
          </div>
        </div>
      )}
    </div>
  );
};
