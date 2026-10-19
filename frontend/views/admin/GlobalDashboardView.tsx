import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, TrendingUp, Users, Store, Package, Bell, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { INITIAL_ANALYTICS, INITIAL_BRANCHES } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';

export const GlobalDashboardView: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-4 font-sans text-gray-900">
      <WindowFrame
        title="SUPER_ROOT_CONTROL.SYS - [Dashboard Global Consolidado]"
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText="NODOS ACTIVOS: 3 // AUDITORÍA PERMANENTE // SINCRONIZACIÓN WEBPAY TRANSBANK OK"
      >
        <div className="space-y-4">
          {/* Cabecera del Panel */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#003c74]">
                PANEL DE CONTROL CENTRAL - NO LIMITS
              </h2>
              <span className="text-xs text-blue-700 font-semibold">
                // Bienvenido {currentUser.name} (Super Administrador Global)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link to="/admin/inventory">
                <button
                  type="button"
                  className="winxp-button winxp-button-primary text-xs py-1 px-3 text-blue-900 font-bold"
                >
                  <Package className="w-3.5 h-3.5 text-blue-700 inline mr-1" />
                  <span>Gestión de Inventario</span>
                </button>
              </Link>
              <Link to="/admin/express-upload">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-3 text-gray-800"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
                  <span>Carga Express Live</span>
                </button>
              </Link>
              <Link to="/admin/logistics">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-3 text-gray-800"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-blue-700 inline mr-1" />
                  <span>Logística & Deudores</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Tarjetas de Métricas Globales (Fondo Blanco Limpio y Borde Clásico) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-blue-900 uppercase">Sucursales Vinculadas</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">3 Tiendas</div>
              <div className="text-[11px] text-gray-600 mt-0.5">Viña, Valparaíso, Quilpué</div>
            </div>

            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-green-900 uppercase">Ventas Históricas</div>
              <div className="text-2xl font-bold text-green-700 mt-1">$30.450.000</div>
              <div className="text-[11px] text-gray-600 mt-0.5">Sin desfase de planillas</div>
            </div>

            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-amber-900 uppercase">Pedidos Transmisión Live</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">36 Activos</div>
              <div className="text-[11px] text-gray-600 mt-0.5">Validación OCR & Webpay</div>
            </div>

            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-red-900 uppercase">Clientes Bloqueados</div>
              <div className="text-2xl font-bold text-red-700 mt-1">2 en Lista Negra</div>
              <div className="text-[11px] text-gray-600 mt-0.5">Protección de stock</div>
            </div>
          </div>

          {/* Accesos Directos a los Módulos de Administración */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <Link to="/admin/inventory" className="block group">
              <div className="p-4 bg-white border border-[#7f9db9] hover:border-blue-600 hover:shadow-md transition-all space-y-2 h-full">
                <div className="flex items-center justify-between">
                  <Package className="w-5 h-5 text-blue-700" />
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="font-bold text-xs text-blue-900 group-hover:underline">
                  GESTIÓN DE INVENTARIO
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Resumen de categorías, usuarios, productos, ventas por sucursal y gráficos Top 10 de pedidos y ventas.
                </p>
              </div>
            </Link>

            <Link to="/admin/branches" className="block group">
              <div className="p-4 bg-white border border-[#7f9db9] hover:border-blue-600 hover:shadow-md transition-all space-y-2 h-full">
                <div className="flex items-center justify-between">
                  <Store className="w-5 h-5 text-blue-700" />
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="font-bold text-xs text-blue-900 group-hover:underline">
                  GESTIÓN DE SUCURSALES
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Aperturas de tiendas físicas, habilitación de stock regional y configuración de permisos de jefes de local.
                </p>
              </div>
            </Link>

            <Link to="/admin/logistics" className="block group">
              <div className="p-4 bg-white border border-[#7f9db9] hover:border-blue-600 hover:shadow-md transition-all space-y-2 h-full">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="font-bold text-xs text-blue-900 group-hover:underline">
                  LOGÍSTICA & CONTROL FINANCIERO
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Despachos con Starken/Blue Express, balance de ingresos y egresos, y bloqueo preventivo de usuarios conflictivos.
                </p>
              </div>
            </Link>

            <Link to="/admin/express-upload" className="block group">
              <div className="p-4 bg-white border border-[#7f9db9] hover:border-blue-600 hover:shadow-md transition-all space-y-2 h-full">
                <div className="flex items-center justify-between">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="font-bold text-xs text-blue-900 group-hover:underline">
                  MÓDULO DE CARGA EXPRESS
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
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
