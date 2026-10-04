import React from 'react';
import { Link } from 'react-router-dom';
import { PixelIcon } from '../../common/PixelIcon';
import portadaImg from '../../../images/portada.jpg';
import './HeroWelcome.css';

interface HeroWelcomeProps {
  showContacto: boolean;
  onToggleContacto: () => void;
}

/**
 * HeroWelcome: Cabecera principal estilo Windows XP.
 * 
 * En lugar del texto simple "NoLimits Apparel", ahora despliega la imagen
 * de portada oficial alojada en /frontend/images/portada.jpg.
 */
export const HeroWelcome: React.FC<HeroWelcomeProps> = ({
  showContacto,
  onToggleContacto,
}) => {
  return (
    <div className="hero-welcome-xp-box">
      <div className="text-center flex flex-col items-center">
        {/* Banner de Estado del Sistema */}
        <div className="hero-xp-banner winxp-bevel-out">
          <PixelIcon name="network" size={16} />
          <span>SISTEMA DE TIENDA EN VIVO // NODO SANTIAGO - VIÑA DEL MAR - VALPARAÍSO</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
        </div>

        {/* Imagen de Portada oficial en reemplazo del texto plano */}
        <div className="my-2 flex justify-center">
          <img
            src={portadaImg}
            alt="NoLimits Apparel - LMTS"
            className="h-28 sm:h-36 md:h-44 w-auto max-w-full object-contain rounded border border-[#7eaadb] shadow-md hover:scale-[1.01] transition-transform duration-200"
          />
        </div>

        {/* Subtítulo y Descripción */}
        <div className="max-w-2xl">
          <p className="hero-xp-subtitle mt-2">
            INDUMENTARIA CYBER-GÓTICA & DESPACHO DESCENTRALIZADO
          </p>
          <p className="hero-xp-desc">
            Bienvenido al portal oficial de NoLimits en Windows XP. Todas las prendas cuentan con sincronización de inventario físico en tiempo real, retiro inmediato en sucursales autorizadas y pago seguro mediante Webpay.
          </p>
        </div>

        {/* Botones de Acción Estilo Windows XP */}
        <div className="hero-xp-actions mt-3">
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
            onClick={onToggleContacto}
            className="winxp-button text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <PixelIcon name="whatsapp" size={15} />
            <span>{showContacto ? 'Ocultar Soporte' : 'Mesa de Ayuda / WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
