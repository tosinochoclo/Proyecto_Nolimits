import React, { useState } from 'react';
import {
  Package,
  Heart,
  Award,
  CreditCard,
  Settings,
  RotateCcw,
  MessageSquare,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { PixelButton } from '../components/common/PixelButton';
import { useAuth } from '../context/AuthContext';

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
    { id: 'returns', label: 'Devoluciones / Reembolsos', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: 'reviews', label: 'Mis Reseñas', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div className="space-y-6">
      <WindowFrame
        title={`USER_PROFILE.SYS - [${currentUser.name}]`}
        variant="lavender"
        statusBarText={`PUNTOS ACTIVOS: ${currentUser.loyaltyPoints} PTS // ESTADO: VERIFICADO`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* User Side Card & Navigation Tabs (Col 1-4) */}
          <div className="md:col-span-4 space-y-4">
            <div className="bevel-chrome p-4 bg-[#100c1e] text-center space-y-2">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-20 h-20 rounded-xs mx-auto bevel-raised object-cover"
              />
              <div>
                <h3 className="font-['Silkscreen'] text-white text-sm">{currentUser.name}</h3>
                <span className="font-['VT323'] text-xs text-[#00d4ff]">{currentUser.email}</span>
              </div>
              <div className="bevel-sunken p-2 bg-black/60 flex items-center justify-around font-['Silkscreen'] text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">PUNTOS:</div>
                  <div className="text-[#ff007f]">{currentUser.loyaltyPoints} pts</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">NIVEL:</div>
                  <div className="text-[#a855f7]">CYBER-VIP</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs List */}
            <div className="flex flex-col space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-left font-['Silkscreen'] text-xs select-none cursor-pointer transition-all
                    ${activeTab === tab.id
                      ? 'bevel-raised bg-gradient-to-r from-[#ff007f] to-[#7c3aed] text-white font-bold'
                      : 'bevel-sunken bg-[#0e0a17] text-slate-300 hover:text-white hover:bg-[#1d1430]'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>

            <PixelButton variant="retro" size="sm" className="w-full" onClick={logout}>
              Cerrar Sesión
            </PixelButton>
          </div>

          {/* Active Tab Content Area (Col 5-12) */}
          <div className="md:col-span-8">
            <div className="bevel-sunken p-4 bg-[#0a0713] min-h-[380px] space-y-4">
              {activeTab === 'orders' && (
                <div className="space-y-3">
                  <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#2d2042] pb-2 flex items-center justify-between">
                    <span>HISTORIAL Y SEGUIMIENTO DE PEDIDOS</span>
                    <span className="text-[#00d4ff] font-['VT323'] text-sm">ENLACE DIRECTO A STARKEN & BLUE EXPRESS</span>
                  </h3>

                  <div className="bevel-chrome p-3.5 bg-[#120e20] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-['Silkscreen'] text-[#ff007f]">ORDEN #NL-9912</span>
                      <span className="font-mono text-green-400 bg-green-950/60 px-2 py-0.5 border border-green-600 text-[10px]">
                        EN TRÁNSITO
                      </span>
                    </div>
                    <div className="font-['Chakra_Petch'] text-xs text-slate-300">
                      Prenda: Cyber-Tribal Overkill Zip Hoodie (Talla L) • Total: $38.990 CLP
                    </div>
                    <div className="font-['VT323'] text-xs text-slate-400 flex items-center gap-3">
                      <span>Transportista: STARKEN</span>
                      <span>•</span>
                      <span>Código Seguimiento: STK-88421990</span>
                    </div>
                    <div className="pt-1 flex gap-2">
                      <PixelButton variant="accent" size="sm">
                        Rastrear en Starken
                      </PixelButton>
                      <PixelButton variant="retro" size="sm">
                        Descargar Comprobante
                      </PixelButton>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="space-y-3">
                  <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#2d2042] pb-2">
                    LISTA DE DESEOS (WISHLIST)
                  </h3>
                  <p className="font-['Chakra_Petch'] text-xs text-slate-300">
                    Recibirás alertas en tu correo 15 minutos antes de que estas prendas salgan en directo en los lives de Viña o Valparaíso.
                  </p>
                  <div className="p-3 bevel-sunken bg-black/40 text-slate-400 font-['VT323'] text-sm text-center">
                    Gothic Parachute Multipocket Cargo (Guardado en favoritos)
                  </div>
                </div>
              )}

              {activeTab === 'points' && (
                <div className="space-y-3">
                  <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#2d2042] pb-2">
                    SISTEMA DE PUNTOS CYBER-REWARDS
                  </h3>
                  <div className="bevel-raised p-4 bg-gradient-to-r from-[#200d3d] to-[#120721] flex items-center justify-between">
                    <div>
                      <div className="font-['Silkscreen'] text-2xl text-[#ff007f]">{currentUser.loyaltyPoints} PUNTOS</div>
                      <div className="font-['Chakra_Petch'] text-xs text-slate-300 mt-1">
                        Equivale a ${(currentUser.loyaltyPoints * 10).toLocaleString('es-CL')} de descuento en tu próximo checkout.
                      </div>
                    </div>
                    <PixelButton variant="primary" size="sm">
                      Canjear en Carrito
                    </PixelButton>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-3">
                  <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#2d2042] pb-2">
                    DIRECCIONES DE ENVÍO GUARDADAS
                  </h3>
                  <div className="bevel-chrome p-3 bg-[#110d1c] font-['Chakra_Petch'] text-xs space-y-1">
                    <div className="font-bold text-white">Casa Principal (Valparaíso)</div>
                    <div className="text-slate-300">Av. Gran Bretaña 450, Playa Ancha, Valparaíso</div>
                    <div className="text-slate-400 font-mono">Destinatario: {currentUser.name} (+56 9 9123 4567)</div>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-3">
                  <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#2d2042] pb-2">
                    MÉTODOS DE PAGO Y VINCULACIÓN
                  </h3>
                  <p className="font-['Chakra_Petch'] text-xs text-slate-300">
                    Soporte para Webpay Plus, OnePay y validación de transferencias bancarias mediante Smart OCR Reader.
                  </p>
                  <div className="bevel-sunken p-3 bg-black/40 text-xs font-mono text-slate-300">
                    Transbank Webpay Tokenization: Conectado
                  </div>
                </div>
              )}

              {activeTab === 'returns' && (
                <div className="space-y-3">
                  <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#2d2042] pb-2">
                    ESTADO DE DEVOLUCIONES Y REEMBOLSOS
                  </h3>
                  <p className="font-['Chakra_Petch'] text-xs text-slate-400">
                    No tienes solicitudes de cambio o devolución activas. Todos tus pedidos anteriores se encuentran cerrados satisfactoriamente.
                  </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#2d2042] pb-2">
                    MIS VALORACIONES Y COMENTARIOS
                  </h3>
                  <div className="bevel-chrome p-3 bg-[#120e20] text-xs font-['Chakra_Petch'] text-slate-300">
                    Has dejado 1 reseña verificada para: Cyber-Tribal Overkill Zip Hoodie (5 Estrellas).
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-3 font-['Chakra_Petch'] text-xs">
                  <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#2d2042] pb-2">
                    CONFIGURACIONES GENERALES
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input type="checkbox" defaultChecked className="accent-[#ff007f]" />
                      <span>Notificarme por SMS / WhatsApp cuando inicie un Live Stream con stock de mi talla</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input type="checkbox" defaultChecked className="accent-[#ff007f]" />
                      <span>Sincronizar avisos de disponibilidad en la sucursal de Viña del Mar</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
