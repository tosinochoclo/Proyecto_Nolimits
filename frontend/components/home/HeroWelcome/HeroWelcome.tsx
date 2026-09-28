import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ShoppingBag } from 'lucide-react';
import { PixelIcon } from '../../common/PixelIcon';
import './HeroWelcome.css';

interface HeroWelcomeProps {
  showDiario: boolean;
  onToggleDiario: () => void;
  showContacto: boolean;
  onToggleContacto: () => void;
  activeWidgetTab: 'diario' | 'contacto' | null;
  onOpenWidget: (widgetId: 'diario' | 'contacto') => void;
}

/**
 * HeroWelcome: Cabecera principal estilo Windows XP.
 * 
 * Directrices aplicadas:
 * - Contenedor con fondo blanco puro y bisel interior clásico de ventana.
 * - Tipografía Tahoma pequeña y ultra-legible (sin fuentes pixeladas ilegibles).
 * - Iconografía retro pixel art auténtica para búsqueda y carrito.
 */
export const HeroWelcome: React.FC<HeroWelcomeProps> = ({
  showDiario,
  onToggleDiario,
  showContacto,
  onToggleContacto,
}) => {
  return (
    <div className="hero-welcome-xp-box">
      <div className="text-center">
        {/* Banner de Estado del Sistema */}
        <div className="hero-xp-banner winxp-bevel-out">
          <PixelIcon name="network" size={16} />
          <span>SISTEMA DE TIENDA EN VIVO // NODO SANTIAGO - VIÑA DEL MAR - VALPARAÍSO</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
        </div>

        {/* Título Principal y Subtítulo no pixelados */}
        <div>
          <h1 className="hero-xp-title">
            NoLimits Apparel
          </h1>
          <p className="hero-xp-subtitle">
            Indumentaria Cyber-Gótica & Despacho Descentralizado
          </p>
          <p className="hero-xp-desc">
            Bienvenido al portal oficial de NoLimits en Windows XP. Todas las prendas cuentan con sincronización de inventario físico en tiempo real, retiro inmediato en sucursales autorizadas y pago seguro mediante Webpay.
          </p>
        </div>

        {/* Botones de Acción Estilo Windows XP */}
        <div className="hero-xp-actions">
          <Link to="/catalog">
            <button
              type="button"
              className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900"
            >
              <PixelIcon name="search" size={15} />
              <span>EXPLORAR CATÁLOGO COMPLETO</span>
            </button>
          </Link>

          <button
            type="button"
            onClick={onToggleDiario}
            className="winxp-button text-xs py-1.5 px-3"
          >
            <PixelIcon name="notepad" size={15} />
            <span>{showDiario ? 'Ocultar Bitácora' : 'Ver Bitácora de Drops'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleContacto}
            className="winxp-button text-xs py-1.5 px-3"
          >
            <PixelIcon name="info" size={15} />
            <span>{showContacto ? 'Ocultar Soporte' : 'Mesa de Ayuda / WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
