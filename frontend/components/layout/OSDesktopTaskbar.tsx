import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Clock,
  Radio,
  Layers,
  ShoppingBag,
  Shield,
  Zap,
  Store,
  Folder,
  Music,
  Power,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAdminNotifications } from '../../context/AdminNotificationContext';
import { PixelIcon } from '../common/PixelIcon';

export const OSDesktopTaskbar: React.FC = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const location = useLocation();
  const { currentRole, currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const { notifications, unreadCount } = useAdminNotifications();
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ===================================================================
          MENÚ INICIO ESTILO WINDOWS XP LUNA (2 Columnas)
          =================================================================== */}
      {startMenuOpen && (
        <div
          className="fixed bottom-8 left-0 z-50 w-96 max-w-[95vw] bg-white border-2 border-[#0055ea] rounded-t-lg shadow-2xl overflow-hidden font-sans select-none animate-in fade-in slide-in-from-bottom-2 duration-150"
          onClick={() => setStartMenuOpen(false)}
        >
          {/* Cabecera Azul de Usuario Windows XP */}
          <div className="bg-gradient-to-r from-[#0055ea] via-[#288eff] to-[#0045d6] p-3 flex items-center justify-between text-white border-b-2 border-[#f7941d]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm border-2 border-white bg-amber-100 flex items-center justify-center shadow-md overflow-hidden">
                <span className="text-xl">🦆</span>
              </div>
              <div>
                <div className="font-bold text-sm leading-tight text-white drop-shadow-sm">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-blue-100">
                  Nolimits Apparel OS ({currentRole})
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-xs italic opacity-80">Windows XP</span>
            </div>
          </div>

          {/* Cuerpo en dos columnas (Programas frecuentes a la izquierda, Lugares a la derecha) */}
          <div className="flex min-h-[300px]">
            {/* Columna Izquierda: Accesos Directos a la Tienda (Fondo Blanco) */}
            <div className="flex-1 bg-white p-2 space-y-1 text-xs">
              <Link
                to="/"
                className="flex items-center gap-2.5 p-2 hover:bg-[#316ac5] hover:text-white rounded-xs text-gray-900 group"
              >
                <PixelIcon name="windows-flag" size={24} />
                <div>
                  <div className="font-bold">Tienda Virtual Nolimits</div>
                  <div className="text-[10px] text-gray-500 group-hover:text-blue-100">Página principal y catálogo</div>
                </div>
              </Link>

              <Link
                to="/catalog"
                className="flex items-center gap-2.5 p-2 hover:bg-[#316ac5] hover:text-white rounded-xs text-gray-900 group"
              >
                <PixelIcon name="search" size={24} />
                <div>
                  <div className="font-bold">Buscador de Prendas</div>
                  <div className="text-[10px] text-gray-500 group-hover:text-blue-100">Filtros por stock y tallas</div>
                </div>
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-2.5 p-2 hover:bg-[#316ac5] hover:text-white rounded-xs text-gray-900 group"
              >
                <PixelIcon name="cart" size={24} />
                <div>
                  <div className="font-bold">Carro de Compras</div>
                  <div className="text-[10px] text-gray-500 group-hover:text-blue-100">
                    {totalItems} prenda(s) en orden
                  </div>
                </div>
              </Link>

              <div className="border-t border-gray-200 my-1 pt-1" />

              <div className="px-2 py-1 text-[11px] font-bold text-gray-600">Herramientas:</div>
              <div className="flex items-center gap-2 px-2 py-1 text-gray-700">
                <PixelIcon name="paint" size={16} />
                <span>MS Paint Suite</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 text-gray-700">
                <PixelIcon name="winamp" size={16} />
                <span>Winamp Audio Player</span>
              </div>
            </div>

            {/* Columna Derecha: Sistema y Gestión (Fondo Azul Claro) */}
            <div className="w-44 bg-[#d3e5fa] border-l border-[#9bb8e5] p-2 space-y-1.5 text-xs text-[#001f5c]">
              <div className="font-bold text-[11px] text-blue-900 pb-1 border-b border-blue-200">
                ADMINISTRACIÓN
              </div>

              {(currentRole === 'branch_admin' || currentRole === 'super_admin') ? (
                <>
                  <Link
                    to="/admin/logistics"
                    className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white rounded-xs"
                  >
                    <Shield className="w-4 h-4 text-blue-800" />
                    <span className="font-semibold">Logística & Stock</span>
                  </Link>

                  <Link
                    to="/admin/express-upload"
                    className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white rounded-xs"
                  >
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Carga Express</span>
                  </Link>

                  <Link
                    to="/admin/branches"
                    className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white rounded-xs"
                  >
                    <Store className="w-4 h-4 text-blue-800" />
                    <span>Sucursales</span>
                  </Link>
                </>
              ) : (
                <div className="text-[11px] text-gray-600 p-1">
                  Acceso estándar cliente. Inicie sesión como Administrador para ver las herramientas del sistema.
                </div>
              )}

              <div className="border-t border-blue-200 my-1 pt-1" />

              <Link
                to="/auth"
                className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white rounded-xs"
              >
                <Settings className="w-4 h-4 text-gray-700" />
                <span>Cuentas de Usuario</span>
              </Link>
            </div>
          </div>

          {/* Pie del Menú Inicio (Cerrar Sesión / Apagar) */}
          <div className="bg-gradient-to-r from-[#0055ea] to-[#0030a6] p-2 flex items-center justify-end gap-3 text-white text-xs border-t border-[#3380e6]">
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 hover:bg-white/20 px-2 py-1 rounded-sm text-yellow-200 font-medium"
            >
              <LogOut className="w-3.5 h-3.5 text-yellow-300" />
              <span>Cerrar sesión</span>
            </button>
            <button
              type="button"
              onClick={() => setStartMenuOpen(false)}
              className="flex items-center gap-1.5 hover:bg-white/20 px-2 py-1 rounded-sm text-red-200 font-medium"
            >
              <Power className="w-3.5 h-3.5 text-red-400" />
              <span>Cerrar menú</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          BARRA DE TAREAS INFERIOR WINDOWS XP LUNA BLUE
          =================================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 winxp-taskbar">
        {/* Botón de Inicio Verde */}
        <div className="flex items-center h-full">
          <button
            type="button"
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className="winxp-start-btn"
            title="Haga clic aquí para comenzar"
          >
            <PixelIcon name="windows-flag" size={18} />
            <span>inicio</span>
          </button>

          {/* Pestañas de Ventanas Abiertas en la Barra */}
          <div className="hidden sm:flex items-center gap-1 px-2">
            <div className="h-6 px-3 bg-[#1e50c4] border border-[#0d348a] rounded-sm text-white text-xs flex items-center gap-1.5 shadow-inner">
              <PixelIcon name="internet" size={14} />
              <span className="font-semibold truncate max-w-[160px]">
                {location.pathname === '/' ? 'NoLimits - Home' : location.pathname.replace('/', '')}
              </span>
            </div>

            <div className="h-6 px-3 bg-[#245edb] hover:bg-[#326ce5] border border-[#143ea8] rounded-sm text-white/90 text-xs flex items-center gap-1.5 cursor-pointer">
              <PixelIcon name="winamp" size={14} />
              <span className="hidden md:inline text-[11px]">Winamp Player</span>
            </div>
          </div>
        </div>

        {/* Área de Notificación (System Tray Azul Obscuro) */}
        <div className="winxp-tray">
          {/* Campanita de Alertas */}
          <button
            type="button"
            onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
            className="flex items-center gap-1 text-white hover:text-yellow-300"
            title="Centro de Notificaciones y Seguridad"
          >
            <Bell className={`w-3.5 h-3.5 ${unreadCount > 0 ? 'text-yellow-300 animate-bounce' : 'text-blue-200'}`} />
            {unreadCount > 0 && <span className="font-bold text-[10px]">{unreadCount}</span>}
          </button>

          {/* Icono de Sonido Pixel */}
          <PixelIcon name="sound" size={14} />

          {/* Icono de Red en Línea */}
          <div className="flex items-center gap-1 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
            <span className="hidden lg:inline text-blue-100">En línea</span>
          </div>

          {/* Reloj Digital */}
          <div className="font-mono text-[11px] font-bold tracking-tight text-white pl-1">
            {timeStr || '17:00'}
          </div>
        </div>
      </footer>
    </>
  );
};
