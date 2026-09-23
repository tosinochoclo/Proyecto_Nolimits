import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, TrendingUp, Users, Store, Package, Bell, FileSpreadsheet } from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelButton } from '../../components/common/PixelButton';
import { INITIAL_ANALYTICS, INITIAL_BRANCHES } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';

export const GlobalDashboardView: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      <WindowFrame
        title="SUPER_ROOT_CONTROL.SYS - [Dashboard Global Consolidado]"
        variant="lavender"
        statusBarText="NODOS ACTIVOS: 3 // AUDITORÍA PERMANENTE // SIN DEPENDENCIAS EXTERNAS"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#302148] pb-3">
            <div>
              <h2 className="font-['Silkscreen'] text-base text-white">
                PANEL DE CONTROL CENTRAL - NO LIMITS
              </h2>
              <span className="font-['VT323'] text-sm text-[#ff007f]">
                // BIENVENIDO {currentUser.name} (SUPER ADMINISTRADOR GLOBAL)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/admin/express-upload">
                <PixelButton variant="primary" size="sm" icon={<Zap className="w-3.5 h-3.5" />}>
                  Carga Express Live
                </PixelButton>
              </Link>
              <Link to="/admin/logistics">
                <PixelButton variant="retro" size="sm">
                  Logística & Deudores
                </PixelButton>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bevel-chrome p-3.5 bg-[#100d1c]">
              <div className="font-['VT323'] text-xs text-[#00d4ff]">SUCURSALES VINCULADAS</div>
              <div className="font-['Silkscreen'] text-2xl text-white mt-1">3 TIENDAS</div>
              <div className="font-['Chakra_Petch'] text-[11px] text-slate-400">Viña, Valparaíso, Quilpué</div>
            </div>
            <div className="bevel-chrome p-3.5 bg-[#100d1c]">
              <div className="font-['VT323'] text-xs text-[#ff007f]">TOTAL VENTAS HISTÓRICAS</div>
              <div className="font-['Silkscreen'] text-2xl text-[#ff007f] mt-1">$30.450.000</div>
              <div className="font-['Chakra_Petch'] text-[11px] text-green-400">Sin desfase de planillas</div>
            </div>
            <div className="bevel-chrome p-3.5 bg-[#100d1c]">
              <div className="font-['VT323'] text-xs text-yellow-300">PEDIDOS TRANSMISIÓN LIVE</div>
              <div className="font-['Silkscreen'] text-2xl text-white mt-1">36 ACTIVOS</div>
              <div className="font-['Chakra_Petch'] text-[11px] text-yellow-400">Validación OCR & Webpay</div>
            </div>
            <div className="bevel-chrome p-3.5 bg-[#100d1c]">
              <div className="font-['VT323'] text-xs text-purple-400">CLIENTES EN LISTA NEGRA</div>
              <div className="font-['Silkscreen'] text-2xl text-red-400 mt-1">2 BLOQUEADOS</div>
              <div className="font-['Chakra_Petch'] text-[11px] text-slate-400">Protección de stock</div>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <Link to="/admin/branches" className="block group">
              <div className="bevel-sunken p-4 bg-[#0c0915] hover:border-[#ff007f] transition-all space-y-2">
                <Store className="w-6 h-6 text-[#00d4ff]" />
                <h3 className="font-['Silkscreen'] text-sm text-white group-hover:text-[#ff007f]">
                  GESTIÓN DE SUCURSALES
                </h3>
                <p className="font-['Chakra_Petch'] text-xs text-slate-400">
                  Aperturas de tiendas físicas, habilitación de stock regional y configuración de permisos de jefes de local.
                </p>
              </div>
            </Link>

            <Link to="/admin/logistics" className="block group">
              <div className="bevel-sunken p-4 bg-[#0c0915] hover:border-[#ff007f] transition-all space-y-2">
                <TrendingUp className="w-6 h-6 text-[#ff007f]" />
                <h3 className="font-['Silkscreen'] text-sm text-white group-hover:text-[#ff007f]">
                  LOGÍSTICA & CONTROL FINANCIERO
                </h3>
                <p className="font-['Chakra_Petch'] text-xs text-slate-400">
                  Despachos con Starken/Blue Express, balance de ingresos y egresos, y bloqueo preventivo de usuarios conflictivos.
                </p>
              </div>
            </Link>

            <Link to="/admin/express-upload" className="block group">
              <div className="bevel-sunken p-4 bg-[#0c0915] hover:border-[#ff007f] transition-all space-y-2">
                <Zap className="w-6 h-6 text-yellow-300" />
                <h3 className="font-['Silkscreen'] text-sm text-white group-hover:text-[#ff007f]">
                  MÓDULO DE CARGA EXPRESS
                </h3>
                <p className="font-['Chakra_Petch'] text-xs text-slate-400">
                  Sube hasta 20 prendas exclusivas en menos de 5 minutos directamente al live stream con fotos de alta resolución.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
