import React, { useState } from 'react';
import {
  Package,
  Heart,
  Award,
  CreditCard,
  Settings,
  RotateCcw,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { useAuth } from '../context/AuthContext';
import { PixelIcon } from '../components/common/PixelIcon';

export const ProfileView: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'orders' | 'wishlist' | 'points' | 'payments' | 'settings' | 'returns' | 'reviews' | 'addresses'
  >('orders');

  const tabs = [
    { id: 'orders', label: 'Historial Pedidos', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'wishlist', label: 'Lista de Deseos', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'points', label: 'Puntos Acumulados', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'addresses', label: 'Direcciones Envío', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'payments', label: 'Métodos de Pago', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'returns', label: 'Devoluciones', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: 'reviews', label: 'Mis Reseñas', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div className="space-y-4 font-sans">
      <WindowFrame
        title={`Propiedades_del_Sistema.cpl - [Cuenta: ${currentUser.name}]`}
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText={`PUNTOS ACTIVOS: ${currentUser.loyaltyPoints} PTS // ESTADO: VERIFICADO`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Tarjeta de Usuario Lateral (Col 1-4) */}
          <div className="md:col-span-4 space-y-3">
            <div className="p-3 bg-gray-50 border border-gray-300 text-center space-y-2">
              <div className="w-20 h-20 mx-auto border-2 border-gray-400 bg-amber-100 flex items-center justify-center text-4xl shadow-sm">
                🦆
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{currentUser.name}</h3>
                <span className="text-xs text-blue-900 font-mono">{currentUser.email}</span>
              </div>

              <div className="bg-white border border-gray-300 p-2 flex items-center justify-around text-xs">
                <div>
                  <div className="text-[10px] text-gray-500">PUNTOS:</div>
                  <div className="font-bold text-red-700">{currentUser.loyaltyPoints} pts</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">ROL:</div>
                  <div className="font-bold text-blue-900 uppercase">{currentUser.role}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="winxp-button text-xs py-1 px-3 w-full text-red-700 font-semibold"
              >
                Cerrar Sesión de Windows
              </button>
            </div>

            {/* Pestañas de navegación vertical estilo Windows XP */}
            <div className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`winxp-button text-xs py-1.5 px-3 justify-start ${
                    activeTab === tab.id
                      ? 'winxp-button-primary bg-blue-100 font-bold text-blue-900'
                      : 'text-gray-800'
                  }`}
                >
                  <span className="text-blue-700">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Área de Detalle de la Pestaña (Col 5-12) */}
          <div className="md:col-span-8 bg-white border border-gray-300 p-4 min-h-[360px]">
            {activeTab === 'orders' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                  <h4 className="font-bold text-sm text-blue-900">
                    Historial de Pedidos Recientes
                  </h4>
                  <span className="text-xs text-gray-500">2 pedidos registrados</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 border border-gray-300 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900">Orden #NL-8842</span>
                      <span className="bg-green-100 text-green-800 border border-green-500 px-1.5 py-0.5 text-[10px] font-bold">
                        DESPACHADO
                      </span>
                    </div>
                    <div className="text-gray-600">Fecha: 15 de Septiembre 2026 · Total: $54.990 CLP</div>
                    <div className="text-gray-800 font-semibold">1x Cyber Oversized Hoodie [Void Black / L]</div>
                    <div className="text-[11px] text-gray-500">Tracking: Starken CH-992140-XP</div>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-300 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900">Orden #NL-7319</span>
                      <span className="bg-blue-100 text-blue-800 border border-blue-500 px-1.5 py-0.5 text-[10px] font-bold">
                        ENTREGADO EN SUCURSAL VIÑA
                      </span>
                    </div>
                    <div className="text-gray-600">Fecha: 02 de Agosto 2026 · Total: $38.990 CLP</div>
                    <div className="text-gray-800 font-semibold">1x Tactical Cargo Pants [M]</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-blue-900 border-b border-gray-300 pb-2">
                  Prendas Guardadas en Lista de Deseos
                </h4>
                <div className="text-xs text-gray-600">
                  Actualmente tienes 2 prendas reservadas para alertas de reposición de stock.
                </div>
              </div>
            )}

            {activeTab === 'points' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-blue-900 border-b border-gray-300 pb-2">
                  Programa de Puntos NoLimits Rewards
                </h4>
                <div className="p-3 bg-blue-50 border border-blue-200 text-xs space-y-1">
                  <div className="font-bold text-blue-900">Saldo Disponible: 450 Puntos</div>
                  <div className="text-gray-700">Equivalente a $4.500 CLP de descuento en tu próxima compra de drop.</div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-blue-900 border-b border-gray-300 pb-2">
                  Direcciones de Despacho Registradas
                </h4>
                <div className="p-3 bg-gray-50 border border-gray-300 text-xs space-y-1">
                  <div className="font-bold text-gray-900">Casa Principal (Predeterminada)</div>
                  <div className="text-gray-600">Av. Libertad 1250, Depto 402 · Viña del Mar, Valparaíso</div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-blue-900 border-b border-gray-300 pb-2">
                  Billetera y Métodos de Pago
                </h4>
                <div className="text-xs text-gray-700">
                  Todas las compras se procesan mediante la pasarela protegida de Transbank Webpay Plus.
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-blue-900 border-b border-gray-300 pb-2">
                  Configuración de la Cuenta
                </h4>
                <div className="text-xs text-gray-600">
                  Gestiona tus notificaciones por correo y preferencias de privacidad.
                </div>
              </div>
            )}
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
