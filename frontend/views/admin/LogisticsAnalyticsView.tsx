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
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
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
    <div className="space-y-4 font-sans text-gray-900">
      <WindowFrame
        title="LOGISTICS_AND_FINANCE_OS.EXE - [Dashboard Analítico Central]"
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText="PROCESADOR DE AUDITORÍA: EN LÍNEA // FRECUENCIA: STREAMING LIVE // CHILE CENTRAL"
      >
        <div className="space-y-4">
          {/* Cabecera y Pestañas Estilo Windows XP */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#003c74] tracking-tight">
                CENTRO LOGÍSTICO, FINANCIERO Y CONTROL DE RIESGO
              </h2>
              <span className="text-xs text-blue-700 font-semibold">
                // Supervisión Multi-Sucursal (Viña del Mar, Valparaíso & Quilpué)
              </span>
            </div>

            {/* Pestañas clásicas Windows XP */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedSubTab('financial')}
                className={`winxp-button text-xs py-1 px-3 ${
                  selectedSubTab === 'financial'
                    ? 'winxp-button-primary bg-[#e6f0fa] font-bold text-blue-900'
                    : 'text-gray-700'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-green-700 mr-1 inline" />
                <span>Finanzas & Proyecciones</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSubTab('blacklist')}
                className={`winxp-button text-xs py-1 px-3 ${
                  selectedSubTab === 'blacklist'
                    ? 'winxp-button-primary bg-[#e6f0fa] font-bold text-blue-900'
                    : 'text-gray-700'
                }`}
              >
                <UserX className="w-3.5 h-3.5 text-red-600 mr-1 inline" />
                <span>Lista Negra ({blacklist.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSubTab('reminders')}
                className={`winxp-button text-xs py-1 px-3 ${
                  selectedSubTab === 'reminders'
                    ? 'winxp-button-primary bg-[#e6f0fa] font-bold text-blue-900'
                    : 'text-gray-700'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-600 mr-1 inline" />
                <span>Alertas & Cobranzas ({notifications.length})</span>
              </button>
            </div>
          </div>

          {/* SubTab 1: Finanzas & Proyecciones */}
          {selectedSubTab === 'financial' && (
            <div className="space-y-4">
              {/* Tarjetas KPI Financieras con fondo blanco limpio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* KPI 1: Ventas */}
                <div className="bg-white border border-[#7f9db9] p-3.5 shadow-xs winxp-bevel-out">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 uppercase">
                      Ventas Globales Netas
                    </span>
                    <TrendingUp className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1 font-sans">
                    ${totalGlobalSales.toLocaleString('es-CL')}
                  </div>
                  <div className="text-[11px] text-green-700 font-semibold mt-1 flex items-center gap-1">
                    <span>↑ +28% vs ciclo anterior sin automatización</span>
                  </div>
                </div>

                {/* KPI 2: Gastos */}
                <div className="bg-white border border-[#7f9db9] p-3.5 shadow-xs winxp-bevel-out">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-900 uppercase">
                      Gastos Operativos & Envíos
                    </span>
                    <DollarSign className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1 font-sans">
                    ${totalGlobalExpenses.toLocaleString('es-CL')}
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1">
                    Transportistas (Starken/Blue Express) & arriendos
                  </div>
                </div>

                {/* KPI 3: Ganancia Neta */}
                <div className="bg-white border border-[#0055ea] p-3.5 shadow-xs winxp-bevel-out">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-green-900 uppercase">
                      Ganancia Neta Total
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 mt-1 font-sans">
                    ${totalGlobalProfit.toLocaleString('es-CL')}
                  </div>
                  <div className="text-[11px] text-blue-900 font-bold mt-1">
                    Margen operativo consolidado: 56.4%
                  </div>
                </div>
              </div>

              {/* Comparativa por Sucursales (Fondo Blanco Limpio y Borde Clásico) */}
              <div className="bg-[#f8fafc] border border-gray-400 p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                  <h3 className="text-xs font-bold text-[#003c74] uppercase tracking-wide">
                    Desglose Granular por Sucursal
                  </h3>
                  <span className="text-[11px] text-gray-500 font-mono">
                    3 Nodos Físicos Conectados
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {INITIAL_ANALYTICS.map((b) => (
                    <div
                      key={b.branchId}
                      className="bg-white border border-[#7f9db9] p-3 space-y-2 shadow-xs"
                    >
                      <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                        <span className="font-bold text-blue-900 text-xs">{b.branchName}</span>
                        <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-1.5 py-0.2 rounded-xs">
                          {b.ordersProcessed} pedidos
                        </span>
                      </div>

                      <div className="space-y-1 text-gray-700">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ventas:</span>
                          <span className="font-semibold">${b.totalSales.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gastos:</span>
                          <span className="text-red-700">-${b.totalExpenses.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between text-green-700 font-bold border-t border-gray-200 pt-1">
                          <span>Ganancia:</span>
                          <span>${b.netProfit.toLocaleString('es-CL')}</span>
                        </div>
                      </div>

                      {/* Producto estrella y rezagado con badges limpios */}
                      <div className="pt-2 border-t border-gray-200 text-[11px] space-y-1">
                        <div className="text-blue-900 font-semibold truncate flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span>Top: {b.topProducts[0]?.title} ({b.topProducts[0]?.unitsSold} un)</span>
                        </div>
                        <div className="text-red-700 truncate flex items-center gap-1">
                          <span>⚠</span>
                          <span>Rezagado: {b.laggingProducts[0]?.title} ({b.laggingProducts[0]?.stockLeft} un)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SubTab 2: Lista Negra */}
          {selectedSubTab === 'blacklist' && (
            <div className="space-y-4">
              <div className="bg-[#fff8e1] border border-[#ffe082] p-3 flex items-center gap-2.5 text-xs text-amber-900 shadow-xs">
                <PixelIcon name="warning" size={20} />
                <span>
                  Los clientes incluidos en la <strong>Lista Negra</strong> quedan bloqueados preventivamente en el checkout y no pueden apartar prendas durante las transmisiones en vivo.
                </span>
              </div>

              {/* Formulario de Bloqueo con fondo Windows XP y controles limpios */}
              <form onSubmit={handleAddBlacklist} className="bg-[#ece9d8] border border-gray-400 p-3 space-y-2 text-xs">
                <div className="font-bold text-xs text-[#003c74] flex items-center gap-1.5">
                  <UserX className="w-3.5 h-3.5 text-red-600" />
                  <span>BLOQUEAR NUEVO CLIENTE POR MOROSIDAD</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellido"
                    value={newBlName}
                    onChange={(e) => setNewBlName(e.target.value)}
                    className="winxp-input text-xs py-1"
                  />
                  <input
                    type="text"
                    required
                    placeholder="RUT (ej: 18.992.334-5)"
                    value={newBlRut}
                    onChange={(e) => setNewBlRut(e.target.value)}
                    className="winxp-input text-xs py-1"
                  />
                  <input
                    type="number"
                    placeholder="Deuda impaga ($ CLP)"
                    value={newBlDebt}
                    onChange={(e) => setNewBlDebt(e.target.value)}
                    className="winxp-input text-xs py-1"
                  />
                  <input
                    type="text"
                    placeholder="Motivo / Causa"
                    value={newBlReason}
                    onChange={(e) => setNewBlReason(e.target.value)}
                    className="winxp-input text-xs py-1"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="winxp-button winxp-button-primary text-xs py-1 px-3 text-red-900 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-600 inline mr-1" />
                    <span>Agregar a Lista Negra</span>
                  </button>
                </div>
              </form>

              {/* Tabla de Registros Estilo Windows Explorer */}
              <div className="border border-gray-400 overflow-x-auto bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#ece9d8] border-b border-gray-400 text-gray-800 font-bold text-[11px]">
                    <tr>
                      <th className="p-2 border-r border-gray-300">CLIENTE</th>
                      <th className="p-2 border-r border-gray-300">RUT</th>
                      <th className="p-2 border-r border-gray-300">DEUDA</th>
                      <th className="p-2 border-r border-gray-300">MOTIVO DEL BLOQUEO</th>
                      <th className="p-2 border-r border-gray-300">ESTADO</th>
                      <th className="p-2">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {blacklist.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50">
                        <td className="p-2 font-bold text-gray-900">{item.name}</td>
                        <td className="p-2 font-mono text-gray-700">{item.rut}</td>
                        <td className="p-2 font-bold text-red-700">
                          ${item.debtAmount.toLocaleString('es-CL')}
                        </td>
                        <td className="p-2 text-gray-600 max-w-xs">{item.reason}</td>
                        <td className="p-2">
                          <span className="text-[10px] font-bold bg-red-100 text-red-800 border border-red-400 px-1.5 py-0.5 rounded-xs">
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={() => setBlacklist(blacklist.filter((b) => b.id !== item.id))}
                            className="text-blue-700 hover:text-red-700 font-semibold underline cursor-pointer"
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

          {/* SubTab 3: Alertas & Cobranzas */}
          {selectedSubTab === 'reminders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-300">
                <div>
                  <h3 className="text-xs font-bold text-[#003c74] uppercase">
                    Recordatorios y Alertas Automatizadas
                  </h3>
                  <span className="text-xs text-gray-600">
                    Notificaciones del sistema para cobros de deudas impagas y avisos de despacho.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCreateReminder}
                  className="winxp-button winxp-button-primary text-xs py-1 px-3 text-blue-900 font-bold"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700 inline mr-1" />
                  <span>Programar Recordatorio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 bg-white border border-[#7f9db9] space-y-2 border-l-4 shadow-xs ${
                      notif.severity === 'critical'
                        ? 'border-l-red-600'
                        : notif.severity === 'warning'
                        ? 'border-l-amber-500'
                        : 'border-l-blue-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-900 font-bold flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-blue-700" />
                        {notif.title}
                      </span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {notif.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700">
                      {notif.message}
                    </p>

                    {/* Estimación de Horas */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-blue-700" />
                        <span>Plazo:</span>
                        <select
                          value={notif.dueHoursEstimate || 2}
                          onChange={(e) => updateReminderDueHours(notif.id, Number(e.target.value))}
                          className="winxp-input py-0 px-1 text-xs"
                        >
                          <option value={1}>1 hora</option>
                          <option value={2}>2 horas</option>
                          <option value={4}>4 horas</option>
                          <option value={8}>8 horas</option>
                          <option value={24}>24 horas</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        className="winxp-button text-xs py-0.5 px-2.5 text-blue-900 font-bold"
                      >
                        Ejecutar Cobro
                      </button>
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
