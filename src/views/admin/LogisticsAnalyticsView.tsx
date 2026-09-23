import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Users,
  DollarSign,
  Package,
  Bell,
  CheckCircle2,
  UserX,
  FileSpreadsheet
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelButton } from '../../components/common/PixelButton';
import { INITIAL_ANALYTICS, INITIAL_BLACKLIST } from '../../services/mockData';
import { useAdminNotifications } from '../../context/AdminNotificationContext';
import { BlacklistCustomer } from '../../types';

export const LogisticsAnalyticsView: React.FC = () => {
  const { notifications, addNotification, updateReminderDueHours } = useAdminNotifications();
  const [blacklist, setBlacklist] = useState<BlacklistCustomer[]>(INITIAL_BLACKLIST);
  const [selectedSubTab, setSelectedSubTab] = useState<'financial' | 'blacklist' | 'reminders'>('financial');

  // Form state for adding to blacklist
  const [newBlName, setNewBlName] = useState('');
  const [newBlRut, setNewBlRut] = useState('');
  const [newBlReason, setNewBlReason] = useState('');
  const [newBlDebt, setNewBlDebt] = useState('');

  // Total sales across all branches
  const totalGlobalSales = INITIAL_ANALYTICS.reduce((acc, curr) => acc + curr.totalSales, 0);
  const totalGlobalExpenses = INITIAL_ANALYTICS.reduce((acc, curr) => acc + curr.totalExpenses, 0);
  const totalGlobalProfit = INITIAL_ANALYTICS.reduce((acc, curr) => acc + curr.netProfit, 0);

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlName || !newBlRut) return;

    const newEntry: BlacklistCustomer = {
      id: `bl_${Date.now()}`,
      name: newBlName,
      rut: newBlRut,
      email: `${newBlName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: '+56 9 0000 0000',
      debtAmount: Number(newBlDebt) || 0,
      reason: newBlReason || 'Incumplimiento reiterado de pago en Live Stream',
      incidentCount: 1,
      status: 'active_blocked',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setBlacklist([newEntry, ...blacklist]);
    setNewBlName('');
    setNewBlRut('');
    setNewBlReason('');
    setNewBlDebt('');
  };

  const handleCreateReminder = () => {
    addNotification({
      type: 'debt_reminder',
      title: 'Recordatorio Manual de Cobro',
      message: 'Cobrar saldo pendiente de reserva en transmisión de Viña del Mar.',
      severity: 'warning',
      dueHoursEstimate: 2
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-navigation */}
      <WindowFrame
        title="LOGISTICS_AND_FINANCE_OS.EXE - [Dashboard Analítico Central]"
        variant="lavender"
        statusBarText="PROCESADOR DE AUDITORÍA: EN LÍNEA // FRECUENCIA: STREAMING LIVE"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#312247] pb-3">
            <div>
              <h2 className="font-['Silkscreen'] text-base text-white">
                CENTRO LOGÍSTICO, FINANCIERO Y CONTROL DE RIESGO
              </h2>
              <span className="font-['VT323'] text-sm text-[#00d4ff]">
                // SUPERVISIÓN MULTI-SUCURSAL (VIÑA DEL MAR, VALPARAÍSO & QUILPUÉ)
              </span>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex items-center gap-1.5 font-['Silkscreen'] text-xs">
              <button
                onClick={() => setSelectedSubTab('financial')}
                className={`px-3 py-1.5 cursor-pointer ${
                  selectedSubTab === 'financial' ? 'bevel-raised bg-[#ff007f] text-white font-bold' : 'bevel-sunken text-slate-300'
                }`}
              >
                Finanzas & Proyecciones
              </button>
              <button
                onClick={() => setSelectedSubTab('blacklist')}
                className={`px-3 py-1.5 cursor-pointer flex items-center gap-1.5 ${
                  selectedSubTab === 'blacklist' ? 'bevel-raised bg-[#7c3aed] text-white font-bold' : 'bevel-sunken text-slate-300'
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Lista Negra ({blacklist.length})</span>
              </button>
              <button
                onClick={() => setSelectedSubTab('reminders')}
                className={`px-3 py-1.5 cursor-pointer flex items-center gap-1.5 ${
                  selectedSubTab === 'reminders' ? 'bevel-raised bg-[#00d4ff] text-black font-bold' : 'bevel-sunken text-slate-300'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Alertas & Cobranzas ({notifications.length})</span>
              </button>
            </div>
          </div>

          {/* SubTab 1: Financial & Projections */}
          {selectedSubTab === 'financial' && (
            <div className="space-y-4">
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bevel-chrome p-3.5 bg-[#120e20]">
                  <div className="font-['VT323'] text-xs text-[#00d4ff]">VENTAS GLOBALES NETAS</div>
                  <div className="font-['Silkscreen'] text-xl text-white mt-1">
                    ${totalGlobalSales.toLocaleString('es-CL')}
                  </div>
                  <div className="font-['Chakra_Petch'] text-[11px] text-green-400 mt-1">
                    ↑ +28% vs ciclo anterior sin automatización
                  </div>
                </div>

                <div className="bevel-chrome p-3.5 bg-[#120e20]">
                  <div className="font-['VT323'] text-xs text-red-400">GASTOS OPERATIVOS & ENVÍOS</div>
                  <div className="font-['Silkscreen'] text-xl text-slate-200 mt-1">
                    ${totalGlobalExpenses.toLocaleString('es-CL')}
                  </div>
                  <div className="font-['Chakra_Petch'] text-[11px] text-slate-400 mt-1">
                    Transportistas (Starken/Blue Express) & arriendos
                  </div>
                </div>

                <div className="bevel-chrome p-3.5 bg-[#120e20]">
                  <div className="font-['VT323'] text-xs text-[#ff007f]">GANANCIA NETA TOTAL</div>
                  <div className="font-['Silkscreen'] text-xl text-[#ff007f] mt-1">
                    ${totalGlobalProfit.toLocaleString('es-CL')}
                  </div>
                  <div className="font-['Chakra_Petch'] text-[11px] text-yellow-300 mt-1">
                    Margen operativo consolidado: 56.4%
                  </div>
                </div>
              </div>

              {/* Branch Performance Comparison */}
              <div className="bevel-sunken p-4 bg-black/60 space-y-3">
                <h3 className="font-['Silkscreen'] text-xs text-white">
                  DESGLOSE GRANULAR POR SUCURSAL
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-['Chakra_Petch'] text-xs">
                  {INITIAL_ANALYTICS.map((b) => (
                    <div key={b.branchId} className="bevel-chrome p-3 bg-[#0d0918] space-y-2">
                      <div className="flex justify-between items-center border-b border-[#2d2042] pb-1 font-['Silkscreen']">
                        <span className="text-[#00d4ff]">{b.branchName}</span>
                        <span className="text-white text-[11px] font-mono">{b.ordersProcessed} pedidos</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Ventas:</span>
                          <span className="font-mono">${b.totalSales.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Gastos:</span>
                          <span className="font-mono">-${b.totalExpenses.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between text-green-400 font-bold border-t border-[#201830] pt-1">
                          <span>Ganancia:</span>
                          <span className="font-mono">${b.netProfit.toLocaleString('es-CL')}</span>
                        </div>
                      </div>

                      {/* Top vs Lagging product */}
                      <div className="pt-2 border-t border-[#201830] text-[11px] space-y-1">
                        <div className="text-[#ff77b8] truncate">
                          ★ Top: {b.topProducts[0]?.title} ({b.topProducts[0]?.unitsSold} un)
                        </div>
                        <div className="text-red-400 truncate">
                          ⚠ Rezagado: {b.laggingProducts[0]?.title} ({b.laggingProducts[0]?.stockLeft} un)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SubTab 2: Blacklist Management */}
          {selectedSubTab === 'blacklist' && (
            <div className="space-y-4">
              <div className="bevel-sunken p-3 bg-red-950/40 border border-red-500/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="font-['Chakra_Petch'] text-xs text-red-200">
                    Los clientes incluidos en la <strong>Lista Negra</strong> quedan bloqueados preventivamente en el checkout y no pueden apartar prendas durante las transmisiones en vivo.
                  </span>
                </div>
              </div>

              {/* Add Blacklist Customer Form */}
              <form onSubmit={handleAddBlacklist} className="bevel-chrome p-3.5 bg-[#120d20] space-y-3 font-['Chakra_Petch'] text-xs">
                <div className="font-['Silkscreen'] text-xs text-white">BLOQUEAR NUEVO CLIENTE</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellido"
                    value={newBlName}
                    onChange={(e) => setNewBlName(e.target.value)}
                    className="bevel-sunken p-2 bg-black text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="RUT (ej: 18.992.334-5)"
                    value={newBlRut}
                    onChange={(e) => setNewBlRut(e.target.value)}
                    className="bevel-sunken p-2 bg-black text-white focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Deuda impaga ($ CLP)"
                    value={newBlDebt}
                    onChange={(e) => setNewBlDebt(e.target.value)}
                    className="bevel-sunken p-2 bg-black text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Motivo / Causa"
                    value={newBlReason}
                    onChange={(e) => setNewBlReason(e.target.value)}
                    className="bevel-sunken p-2 bg-black text-white focus:outline-none"
                  />
                </div>
                <PixelButton variant="danger" size="sm" type="submit">
                  Agregar a Lista Negra
                </PixelButton>
              </form>

              {/* Blacklist Records Table */}
              <div className="bevel-sunken overflow-x-auto">
                <table className="w-full text-left font-['Chakra_Petch'] text-xs">
                  <thead className="bg-[#171128] font-['Silkscreen'] text-[10px] text-slate-300 border-b border-[#30214a]">
                    <tr>
                      <th className="p-2.5">CLIENTE</th>
                      <th className="p-2.5">RUT</th>
                      <th className="p-2.5">DEUDA</th>
                      <th className="p-2.5">MOTIVO DEL BLOQUEO</th>
                      <th className="p-2.5">ESTADO</th>
                      <th className="p-2.5">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#221736]">
                    {blacklist.map((item) => (
                      <tr key={item.id} className="hover:bg-[#120c22]">
                        <td className="p-2.5 font-bold text-white">{item.name}</td>
                        <td className="p-2.5 font-mono text-slate-300">{item.rut}</td>
                        <td className="p-2.5 font-mono text-[#ff007f] font-bold">
                          ${item.debtAmount.toLocaleString('es-CL')}
                        </td>
                        <td className="p-2.5 text-slate-300 max-w-xs">{item.reason}</td>
                        <td className="p-2.5">
                          <span className="font-['Silkscreen'] text-[10px] bg-red-950 text-red-400 px-2 py-0.5 border border-red-600">
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <button
                            onClick={() => setBlacklist(blacklist.filter((b) => b.id !== item.id))}
                            className="font-['Silkscreen'] text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            Desbloquear
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab 3: System Notifications & Debt Reminders */}
          {selectedSubTab === 'reminders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2d2042]">
                <div>
                  <h3 className="font-['Silkscreen'] text-xs text-white">
                    RECORDATORIOS Y ALERTAS AUTOMATIZADAS
                  </h3>
                  <span className="font-['Chakra_Petch'] text-xs text-slate-400">
                    Notificaciones nativas para cobros de deudas impagas y avisos de despacho.
                  </span>
                </div>
                <PixelButton variant="primary" size="sm" onClick={handleCreateReminder}>
                  + Programar Recordatorio
                </PixelButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`bevel-chrome p-3.5 bg-[#0e0918] space-y-2 border-l-4 ${
                      notif.severity === 'critical' ? 'border-l-[#ff007f]' : notif.severity === 'warning' ? 'border-l-yellow-400' : 'border-l-[#00d4ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-['Silkscreen'] text-xs text-white font-bold">
                        {notif.title}
                      </span>
                      <span className="font-['VT323'] text-slate-400 text-sm">
                        {notif.createdAt}
                      </span>
                    </div>

                    <p className="font-['Chakra_Petch'] text-xs text-slate-300">
                      {notif.message}
                    </p>

                    {/* Adjustable Reminder Hours */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#231a33] text-xs">
                      <div className="flex items-center gap-1 font-['Chakra_Petch'] text-yellow-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Plazo estimación:</span>
                        <select
                          value={notif.dueHoursEstimate || 2}
                          onChange={(e) => updateReminderDueHours(notif.id, Number(e.target.value))}
                          className="bevel-sunken bg-black text-white px-1 py-0.5 text-xs font-mono"
                        >
                          <option value={1}>1 hora</option>
                          <option value={2}>2 horas</option>
                          <option value={4}>4 horas</option>
                          <option value={8}>8 horas</option>
                          <option value={24}>24 horas</option>
                        </select>
                      </div>

                      <PixelButton variant="retro" size="sm">
                        Ejecutar Cobro
                      </PixelButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </WindowFrame>
    </div>
  );
};
