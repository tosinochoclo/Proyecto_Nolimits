import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Shield,
  Layers,
  ShoppingBag,
  User as UserIcon,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useBranch } from '../../context/BranchContext';
import { useAdminNotifications } from '../../context/AdminNotificationContext';
import { UserRole } from '../../types';
import { PixelIcon } from '../common/PixelIcon';

export const TopNavBar: React.FC = () => {
  const { currentRole, setRole, currentUser } = useAuth();
  const { totalItems } = useCart();
  const { branches, activeBranchId, setActiveBranchId } = useBranch();
  const { unreadCount } = useAdminNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#ece9d8] border-b-2 border-[#707070] shadow-md select-none font-sans">
      {/* 1. Barra de Título Superior de Internet Explorer 6 */}
      <div className="winxp-titlebar py-1 px-3 flex items-center justify-between">
        <div className="winxp-titlebar-title text-xs">
          <PixelIcon name="internet" size={16} />
          <span>NoLimits Apparel OS - Microsoft Internet Explorer 6.0</span>
        </div>
        <div className="winxp-controls">
          <button type="button" className="winxp-btn-ctrl winxp-btn-min" title="Minimizar">_</button>
          <button type="button" className="winxp-btn-ctrl winxp-btn-max" title="Maximizar">□</button>
          <button type="button" className="winxp-btn-ctrl winxp-btn-close" title="Cerrar">×</button>
        </div>
      </div>

      {/* 2. Barra de Menú Estándar (Archivo, Edición, etc.) */}
      <div className="winxp-menubar text-[11px] px-3 py-1 flex items-center justify-between border-b border-[#d0ccc0]">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="winxp-menu-item">Archivo</span>
          <span className="winxp-menu-item">Edición</span>
          <span className="winxp-menu-item">Ver</span>
          <span className="winxp-menu-item">Favoritos</span>
          <span className="winxp-menu-item">Herramientas</span>
          <span className="winxp-menu-item">Ayuda</span>
        </div>

        {/* Simulador de Rol Windows */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="hidden md:inline text-gray-700 font-semibold">Usuario Actual:</span>
          <select
            value={currentRole}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="winxp-input text-[11px] py-0 px-1 border border-gray-500 bg-white"
            aria-label="Cambiar Rol de Usuario"
          >
            <option value="guest">Invitado (Público)</option>
            <option value="registered">Cliente Registrado</option>
            <option value="branch_admin">Admin Sucursal (Viña)</option>
            <option value="super_admin">Súper Administrador</option>
          </select>

          {(currentRole === 'branch_admin' || currentRole === 'super_admin') && (
            <Link
              to="/admin/logistics"
              className="winxp-button text-[10px] py-0.5 px-2 bg-yellow-100 hover:bg-yellow-200 text-blue-900 border border-yellow-600 font-bold"
            >
              <Shield className="w-3 h-3 text-red-600" />
              <span>PANEL ADMIN {unreadCount > 0 && `(${unreadCount})`}</span>
            </Link>
          )}
        </div>
      </div>

      {/* 3. Barra de Herramientas Estándar con Botones Retro */}
      <div className="px-2 sm:px-3 py-1.5 bg-[#ece9d8] flex flex-wrap items-center justify-between gap-2 border-b border-[#b0aca0]">
        <div className="flex items-center gap-1">
          {/* Botón Atrás */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="winxp-button text-xs py-1 px-2 text-gray-800"
            title="Atrás"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-green-700" />
            <span className="hidden sm:inline">Atrás</span>
          </button>

          {/* Botón Adelante */}
          <button
            type="button"
            onClick={() => navigate(1)}
            className="winxp-button text-xs py-1 px-2 text-gray-800"
            title="Adelante"
          >
            <ArrowRight className="w-3.5 h-3.5 text-green-700" />
          </button>

          {/* Botón Actualizar */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="winxp-button text-xs py-1 px-2 text-gray-800"
            title="Actualizar"
          >
            <RotateCw className="w-3.5 h-3.5 text-blue-600" />
          </button>

          {/* Separador */}
          <div className="h-5 w-px bg-gray-400 mx-1" />

          {/* Botón Inicio */}
          <Link to="/" className="winxp-button text-xs py-1 px-2.5">
            <Home className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>

          {/* Botón Catálogo con Lupa Pixelada */}
          <Link to="/catalog" className="winxp-button text-xs py-1 px-2.5">
            <PixelIcon name="search" size={14} />
            <span>Catálogo</span>
          </Link>

          {/* Botón Carrito con Carrito Pixelado */}
          <Link
            to="/cart"
            className="winxp-button text-xs py-1 px-2.5 bg-[#f5f8ff] border-blue-700 relative font-semibold"
          >
            <PixelIcon name="cart" size={15} />
            <span>Carro ({totalItems})</span>
            {totalItems > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1 right-1 animate-ping" />
            )}
          </Link>

          {/* Botón Mi Cuenta */}
          <Link to="/auth" className="winxp-button text-xs py-1 px-2 text-gray-800">
            <UserIcon className="w-3.5 h-3.5 text-gray-700" />
            <span className="hidden md:inline">{currentUser.role === 'guest' ? 'Iniciar Sesión' : 'Mi Perfil'}</span>
          </Link>
        </div>

        {/* Selector Rápido de Sucursal Física */}
        <div className="flex items-center gap-1 bg-white px-2 py-0.5 border border-gray-400 text-xs">
          <span className="text-[11px] font-bold text-gray-700">Nodo:</span>
          <select
            value={activeBranchId}
            onChange={(e) => setActiveBranchId(e.target.value)}
            className="text-[11px] font-medium bg-transparent focus:outline-none cursor-pointer text-blue-900"
            aria-label="Seleccionar Sucursal"
          >
            <option value="all">Todas las Sucursales (Chile Central)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.city} ({b.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Barra de Dirección (Address Bar) estilo Internet Explorer */}
      <div className="px-2 sm:px-3 py-1 bg-[#ece9d8] flex items-center gap-2 text-xs">
        <span className="text-gray-700 font-bold text-[11px] shrink-0">Dirección</span>
        <div className="flex-1 flex items-center bg-white winxp-bevel-in px-2 py-0.5">
          <PixelIcon name="internet" size={14} className="mr-1.5 shrink-0" />
          <span className="text-gray-900 truncate font-mono text-[11px]">
            http://www.nolimits.xp{location.pathname === '/' ? '/index.html' : location.pathname}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {}}
          className="winxp-button text-[11px] py-0.5 px-2 bg-green-50 text-green-900 font-bold shrink-0"
        >
          Ir
        </button>
      </div>
    </header>
  );
};
