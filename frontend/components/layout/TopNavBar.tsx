import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  Radio,
  MapPin,
  Flame,
  Shield,
  Layers,
  Terminal,
  Search,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useBranch } from '../../context/BranchContext';
import { useAdminNotifications } from '../../context/AdminNotificationContext';
import { UserRole } from '../../types';

export const TopNavBar: React.FC = () => {
  const { currentRole, setRole, currentUser } = useAuth();
  const { totalItems } = useCart();
  const { branches, activeBranchId, setActiveBranchId } = useBranch();
  const { unreadCount } = useAdminNotifications();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'HOME', icon: <Radio className="w-3.5 h-3.5 text-[#ff007f]" /> },
    { path: '/catalog', label: 'CATÁLOGO', icon: <Layers className="w-3.5 h-3.5 text-[#00d4ff]" /> },
    { path: '/cart', label: 'CARRITO', icon: <ShoppingBag className="w-3.5 h-3.5 text-[#a855f7]" />, badge: totalItems },
    { path: '/auth', label: currentUser.role === 'guest' ? 'LOGIN' : 'MI CUENTA', icon: <UserIcon className="w-3.5 h-3.5 text-[#e2e8f0]" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07050d]/95 backdrop-blur-md border-b-2 border-[#3c2a5c] shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
      {/* Top Banner: Role Simulator & Live Stream Alert */}
      <div className="bg-gradient-to-r from-[#200d3d] via-[#100720] to-[#2b0833] border-b border-[#4d326f] px-2 sm:px-4 py-1 flex items-center justify-between text-[11px] font-['VT323'] tracking-wider text-slate-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007f] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff007f]"></span>
          </span>
          <span className="text-[#ff007f] font-bold">LIVE STREAM ON AIR</span>
          <span className="hidden md:inline text-slate-400">| Stock sincronizado en tiempo real con Viña, Valpo & Quilpué</span>
        </div>

        {/* Developer/User Role Switcher Bar */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden sm:inline text-slate-400">MODO ROL:</span>
          <select
            value={currentRole}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-[#171226] text-[#b8a2e8] border border-[#6b469b] rounded-xs px-1.5 py-0.5 font-['Silkscreen'] text-[10px] focus:outline-none cursor-pointer hover:border-[#ff007f]"
            aria-label="Simular Rol de Usuario"
          >
            <option value="guest">1. Invitado (Público)</option>
            <option value="registered">2. Registrado (Cliente)</option>
            <option value="branch_admin">3. Admin Sucursal (Viña)</option>
            <option value="super_admin">4. Súper Administrador</option>
          </select>

          {(currentRole === 'branch_admin' || currentRole === 'super_admin') && (
            <Link
              to="/admin/logistics"
              className="bg-[#ff007f]/20 hover:bg-[#ff007f]/40 text-[#ff77b8] border border-[#ff007f] px-2 py-0.5 rounded-xs flex items-center gap-1 font-['Silkscreen'] text-[10px]"
            >
              <Shield className="w-3 h-3 text-[#ff007f]" />
              <span className="hidden lg:inline">PANEL ADMIN</span>
              {unreadCount > 0 && (
                <span className="bg-[#ff007f] text-white text-[9px] px-1 rounded-full font-mono">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Logo / Y2K Header */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 bevel-raised bg-gradient-to-br from-[#ff007f] via-[#7c3aed] to-[#00d4ff] flex items-center justify-center p-1 shadow-lg group-hover:scale-105 transition-transform">
            <span className="font-['Silkscreen'] text-white font-black text-sm tracking-tighter">NL</span>
          </div>
          <div className="flex flex-col">
            <span className="font-['Syne'] font-extrabold text-2xl tracking-tighter text-y2k-gradient leading-none">
              Nolimits
            </span>
            <span className="font-['VT323'] text-xs text-[#a78bfa] tracking-widest leading-none mt-0.5">
              CYBER-GOTHIC OS v2.0
            </span>
          </div>
        </Link>

        {/* Sucursales Quick Selector */}
        <div className="hidden lg:flex items-center gap-1.5 bevel-sunken px-2.5 py-1">
          <MapPin className="w-3.5 h-3.5 text-[#00d4ff] shrink-0" />
          <span className="font-['Silkscreen'] text-[10px] text-slate-400">SUCURSAL:</span>
          <select
            value={activeBranchId}
            onChange={(e) => setActiveBranchId(e.target.value)}
            className="bg-transparent text-[#00d4ff] font-['Silkscreen'] text-[10px] focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#0e0c16] text-slate-200">Todas las Sucursales</option>
            {branches.map(b => (
              <option key={b.id} value={b.id} className="bg-[#0e0c16] text-white">
                {b.name.replace('Sucursal ', '')}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1.5 sm:gap-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs font-['Silkscreen'] text-xs tracking-wide transition-all select-none
                  ${isActive
                    ? 'bevel-raised bg-gradient-to-b from-[#7c3aed] to-[#4c1d95] text-white font-bold shadow-[0_0_12px_rgba(157,0,255,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#1a1429]'
                  }
                `}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="bg-[#ff007f] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-white font-mono shadow-[0_0_8px_#ff007f]">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Admin Direct Hub if authorized */}
          {(currentRole === 'branch_admin' || currentRole === 'super_admin') && (
            <Link
              to="/admin/express-upload"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bevel-raised bg-gradient-to-b from-[#ff007f] to-[#be123c] text-white font-['Silkscreen'] text-xs hover:brightness-110 shadow-[0_0_10px_rgba(255,0,127,0.3)]"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-300" />
              <span>CARGA EXPRESS</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
