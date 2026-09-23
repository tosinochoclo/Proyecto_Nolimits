import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layers,
  ShoppingBag,
  Shield,
  Zap,
  Radio,
  Clock,
  Volume2,
  Bell,
  Sliders,
  Store,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAdminNotifications } from '../../context/AdminNotificationContext';

export const OSDesktopTaskbar: React.FC = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const location = useLocation();
  const { currentRole, currentUser } = useAuth();
  const { totalItems } = useCart();
  const { notifications, unreadCount } = useAdminNotifications();
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Start Menu Drop-up Modal */}
      {startMenuOpen && (
        <div
          className="fixed bottom-10 left-1 z-50 w-72 bevel-chrome bg-[#0e0c16] shadow-2xl flex flex-col font-['Silkscreen'] animate-in fade-in slide-in-from-bottom-2 duration-150"
          onClick={() => setStartMenuOpen(false)}
        >
          {/* Windows XP style left accent strip */}
          <div className="flex">
            <div className="w-9 bg-gradient-to-b from-[#7c3aed] via-[#ff007f] to-[#1e1035] flex items-end justify-center pb-3 text-white">
              <span className="font-['Silkscreen'] text-xs font-bold -rotate-90 tracking-widest whitespace-nowrap">
                NOLIMITS OS
              </span>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-2 space-y-1 text-xs">
              <div className="p-1.5 bg-[#1f1733] border-b border-[#4d326f] text-[#ff77b8] flex items-center justify-between text-[11px]">
                <span className="truncate">{currentUser.name}</span>
                <span className="font-mono text-[9px] text-[#00d4ff] uppercase">[{currentRole}]</span>
              </div>

              <Link
                to="/"
                className="flex items-center gap-2 p-2 hover:bg-[#7c3aed] hover:text-white rounded-xs text-slate-200"
              >
                <Radio className="w-4 h-4 text-[#ff007f]" />
                <span>Inicio / Tienda Virtual</span>
              </Link>

              <Link
                to="/catalog"
                className="flex items-center gap-2 p-2 hover:bg-[#7c3aed] hover:text-white rounded-xs text-slate-200"
              >
                <Layers className="w-4 h-4 text-[#00d4ff]" />
                <span>Catálogo & Filtros</span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-2 p-2 hover:bg-[#7c3aed] hover:text-white rounded-xs text-slate-200"
              >
                <ShoppingBag className="w-4 h-4 text-[#a855f7]" />
                <span>Carrito ({totalItems})</span>
              </Link>

              {(currentRole === 'branch_admin' || currentRole === 'super_admin') && (
                <>
                  <div className="border-t border-[#34244f] my-1 pt-1 text-[10px] text-[#ff77b8] px-2 font-mono">
                    BACKOFFICE GESTIÓN
                  </div>
                  <Link
                    to="/admin/logistics"
                    className="flex items-center gap-2 p-2 hover:bg-[#ff007f] hover:text-white rounded-xs text-slate-200"
                  >
                    <Shield className="w-4 h-4 text-[#ff007f]" />
                    <span>Logística & Finanzas</span>
                  </Link>
                  <Link
                    to="/admin/express-upload"
                    className="flex items-center gap-2 p-2 hover:bg-[#ff007f] hover:text-white rounded-xs text-slate-200"
                  >
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>Carga Express (20 prendas)</span>
                  </Link>
                  <Link
                    to="/admin/branches"
                    className="flex items-center gap-2 p-2 hover:bg-[#ff007f] hover:text-white rounded-xs text-slate-200"
                  >
                    <Store className="w-4 h-4 text-[#00d4ff]" />
                    <span>Sucursales & Permisos</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Notification Drawer */}
      {notifDrawerOpen && (
        <div className="fixed bottom-10 right-2 z-50 w-80 max-w-[90vw] bevel-chrome bg-[#0e0c16] shadow-2xl p-3 font-['Silkscreen'] text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#3b2b52] text-[#ff77b8]">
            <span className="flex items-center gap-1.5 font-bold">
              <Bell className="w-3.5 h-3.5" /> CENTRO DE ALERTAS
            </span>
            <button
              onClick={() => setNotifDrawerOpen(false)}
              className="text-slate-400 hover:text-white font-mono text-sm"
            >
              [X]
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 mt-2 font-['Chakra_Petch'] text-xs">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`p-2 bevel-sunken ${
                  n.severity === 'critical'
                    ? 'border-l-2 border-l-[#ff007f]'
                    : n.severity === 'warning'
                    ? 'border-l-2 border-l-yellow-400'
                    : 'border-l-2 border-l-[#00d4ff]'
                }`}
              >
                <div className="flex items-center justify-between font-['Silkscreen'] text-[10px] text-white">
                  <span>{n.title}</span>
                  <span className="text-[#a78bfa]">{n.createdAt}</span>
                </div>
                <p className="text-slate-300 text-[11px] mt-1">{n.message}</p>
                {n.dueHoursEstimate && (
                  <div className="mt-1 text-[10px] text-yellow-300 font-mono">
                    ⏳ Recordatorio asignado: Plazo {n.dueHoursEstimate}h
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Taskbar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 h-9 bg-gradient-to-r from-[#1a1426] via-[#2d1b4d] to-[#120a21] border-t-2 border-[#5b3d87] flex items-center justify-between px-1.5 select-none shadow-[0_-4px_16px_rgba(0,0,0,0.8)]">
        {/* Start Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`
              h-7 px-2.5 flex items-center gap-1.5 font-['Silkscreen'] text-xs font-bold text-white
              bevel-raised transition-all active:bevel-sunken
              ${startMenuOpen
                ? 'bg-gradient-to-r from-[#ff007f] to-[#7c3aed]'
                : 'bg-gradient-to-r from-[#7c3aed] to-[#4c1d95] hover:brightness-110'
              }
            `}
          >
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>INICIO</span>
          </button>

          {/* Quick Active Window Tab */}
          <div className="hidden sm:flex items-center gap-1 bevel-sunken px-2.5 py-0.5 text-[11px] font-['VT323'] text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"></span>
            <span className="truncate max-w-[200px]">
              {location.pathname === '/' ? 'Home / Drop Principal' : location.pathname}
            </span>
          </div>
        </div>

        {/* System Tray (Clock, Sound, Notifications, Status) */}
        <div className="flex items-center gap-2 font-['VT323'] text-xs text-slate-300">
          {/* Notification Bell */}
          <button
            onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
            className="flex items-center gap-1 bevel-sunken px-1.5 py-0.5 hover:bg-[#32204c] text-slate-200 cursor-pointer"
            title="Centro de Notificaciones"
          >
            <Bell className={`w-3.5 h-3.5 ${unreadCount > 0 ? 'text-[#ff007f] animate-bounce' : 'text-slate-400'}`} />
            {unreadCount > 0 && <span className="font-mono text-[#ff007f] font-bold">{unreadCount}</span>}
          </button>

          <div className="hidden md:flex items-center gap-1 bevel-sunken px-2 py-0.5 text-slate-300">
            <Volume2 className="w-3 h-3 text-[#00d4ff]" />
            <span>AUDIO: ON</span>
          </div>

          <div className="flex items-center gap-1.5 bevel-sunken px-2 py-0.5 text-slate-200">
            <Clock className="w-3 h-3 text-[#ff007f]" />
            <span className="tracking-wider font-mono">{timeStr || '23:29:00'}</span>
          </div>
        </div>
      </footer>
    </>
  );
};
