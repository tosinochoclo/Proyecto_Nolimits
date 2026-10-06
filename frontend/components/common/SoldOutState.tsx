import React, { useState } from 'react';
import { AlertTriangle, Bell, Check, Phone, ArrowLeft } from 'lucide-react';
import { PixelIcon } from './PixelIcon';
import sinStockImg from '../../images/sin_stock.png';

interface SoldOutDetailBannerProps {
  productTitle: string;
  sku: string;
}

/**
 * SoldOutDetailBanner: Componente de estado "Sin Stock" para la ficha de producto.
 * Muestra la imagen gráfica oficial de sin stock, el desglose de inventario
 * en los nodos y un botón interactivo para suscribirse a la alerta de reposición.
 */
export const SoldOutDetailBanner: React.FC<SoldOutDetailBannerProps> = ({
  productTitle,
  sku,
}) => {
  const [subscribed, setSubscribed] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setSubscribed(true);
  };

  return (
    <div className="bg-red-50 border-2 border-red-500 winxp-bevel-out p-3.5 space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Imagen específica de Sin Stock */}
        <div className="w-full sm:w-44 shrink-0 rounded overflow-hidden border border-red-400 bg-white shadow-xs">
          <img
            src={sinStockImg}
            alt="Sin Stock Disponible - Agotado"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Mensaje de estado */}
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Prenda Agotada Temporalmente</span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm">
            Unidades físicas en 0 // Nodo Central Desabastecido
          </h3>
          <p className="text-xs text-gray-700 leading-tight">
            Todas las unidades de <strong>{productTitle}</strong> (SKU: {sku}) han sido reservadas o despachadas. La confección del siguiente lote se informará por Live Stream.
          </p>
        </div>
      </div>

      {/* Desglose por sucursales */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2 border border-red-200">
        <div className="p-1 bg-red-50 border border-red-200 rounded-xs">
          <div className="text-[10px] text-gray-600 font-semibold">Viña del Mar</div>
          <div className="font-bold text-red-700 font-mono">0 en stock</div>
        </div>
        <div className="p-1 bg-red-50 border border-red-200 rounded-xs">
          <div className="text-[10px] text-gray-600 font-semibold">Valparaíso</div>
          <div className="font-bold text-red-700 font-mono">0 en stock</div>
        </div>
        <div className="p-1 bg-red-50 border border-red-200 rounded-xs">
          <div className="text-[10px] text-gray-600 font-semibold">Quilpué</div>
          <div className="font-bold text-red-700 font-mono">0 en stock</div>
        </div>
      </div>

      {/* Suscripción a reposición de stock */}
      <div className="bg-white border border-gray-300 p-2 text-xs">
        {subscribed ? (
          <div className="flex items-center gap-2 text-green-800 font-bold py-1">
            <Check className="w-4 h-4 text-green-600" />
            <span>¡Notificación activada! Te enviaremos un SMS/WhatsApp cuando ingrese nuevo inventario.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-1.5">
            <div className="font-bold text-gray-800 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-blue-700" />
              <span>Avisarme cuando esté disponible:</span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="WhatsApp (+56 9...) o correo electrónico"
                className="winxp-input flex-1 py-1 px-2 text-xs"
                required
              />
              <button
                type="submit"
                className="winxp-button winxp-button-primary text-xs py-1 px-3 font-bold text-blue-900 shrink-0"
              >
                Suscribirme
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/**
 * SoldOutCardOverlay: Superposición para tarjetas de producto en el catálogo cuando stock <= 0.
 */
export const SoldOutCardOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 z-10 text-center select-none">
      <div className="bg-red-600 text-white font-black text-xs px-2.5 py-1 uppercase tracking-widest border border-white shadow-lg transform -rotate-3">
        [ AGOTADO ]
      </div>
      <div className="bg-black/90 text-white font-mono text-[9px] px-2 py-0.5 mt-1 rounded border border-red-500 font-bold">
        0 UNIDADES DISPONIBLES
      </div>
    </div>
  );
};
