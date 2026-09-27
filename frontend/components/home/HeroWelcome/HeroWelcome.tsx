import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Flame, Sparkles } from 'lucide-react';
import { SpiderwebDecor } from '../SpiderwebDecor';
import { PixelNavDock } from '../PixelNavDock';
import { PixelButton } from '../../common/PixelButton';
import './HeroWelcome.css';

interface HeroWelcomeProps {
  /** Indica si el panel de Bitácora está actualmente desplegado */
  showDiario: boolean;
  /** Función para alternar visibilidad de la Bitácora */
  onToggleDiario: () => void;
  /** Indica si el panel de Contacto está actualmente desplegado */
  showContacto: boolean;
  /** Función para alternar visibilidad del panel de Contacto */
  onToggleContacto: () => void;
  /** ID del widget activo seleccionado en el PixelNavDock */
  activeWidgetTab: 'diario' | 'contacto' | null;
  /** Callback para cuando se hace click en un botón del Dock */
  onOpenWidget: (widgetId: 'diario' | 'contacto') => void;
}

/**
 * Componente: HeroWelcome
 * 
 * Propósito:
 * Encabezado central de bienvenida del e-commerce Nolimits.
 * Contiene el logotipo en gradiente, telarañas góticas decorativas,
 * el dock de navegación pixelada y accesos directos a Bitácora y Catálogo.
 * 
 * Buenas prácticas:
 * - Separación limpia: Estilos visuales en HeroWelcome.css
 * - Props explícitas y documentadas con JSDoc
 */
export const HeroWelcome: React.FC<HeroWelcomeProps> = ({
  showDiario,
  onToggleDiario,
  showContacto,
  onToggleContacto,
  activeWidgetTab,
  onOpenWidget,
}) => {
  return (
    <div className="hero-welcome-card">
      <div className="hero-welcome-box bevel-chrome">
        {/* Telarañas de esquinas (SVG gótico decorativo) */}
        <SpiderwebDecor position="top-left" color="#9d00ff" />
        <SpiderwebDecor position="top-right" color="#ff007f" />
        <SpiderwebDecor position="bottom-left" color="#7c3aed" />
        <SpiderwebDecor position="bottom-right" color="#00d4ff" />

        {/* Indicador de Red y Nodo en Tiempo Real */}
        <div className="hero-status-badge bevel-sunken">
          <span className="hero-status-pulse" />
          <span>INVENTARIO EN TIEMPO REAL // NODO VIÑA - VALPARAÍSO - QUILPUÉ</span>
        </div>

        {/* Bloque de títulos */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="hero-title-main text-y2k-gradient">
            Nolimits
          </h1>

          <p className="hero-title-sub">
            Nolimits
          </p>

          <p className="hero-description">
            E-commerce descentralizado e indumentaria cyber-gótica. Eliminamos la validación manual por chat y las listas de espera: sincronización de stock físico en tiempo real con pasarelas automáticas y despacho nacional.
          </p>
        </div>

        {/* Dock de navegación pixelada */}
        <div className="pt-4 flex justify-center">
          <PixelNavDock
            onOpenWidget={onOpenWidget}
            activeWidget={activeWidgetTab}
          />
        </div>

        {/* Botones de acción rápida */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link to="/catalog">
            <PixelButton
              variant="primary"
              size="lg"
              icon={<Flame className="w-4 h-4 text-yellow-300" />}
              className="text-xs sm:text-sm px-6 py-2.5"
            >
              EXPLORAR DROP COMPLETO
            </PixelButton>
          </Link>

          <button
            type="button"
            onClick={onToggleDiario}
            className="hero-toggle-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#00d4ff]" />
            <span>{showDiario ? 'OCULTAR BITÁCORA' : 'VER BITÁCORA DE DROPS'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleContacto}
            className="hero-toggle-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff007f]" />
            <span>{showContacto ? 'OCULTAR CONTACTO' : 'MESA DE AYUDA / WHATSAPP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
