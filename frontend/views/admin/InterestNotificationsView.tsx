import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  BellRing,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trash2,
  Reply,
  Plus,
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Truck,
  PackageX,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  ExternalLink,
  ShieldAlert,
  AlertCircle,
  FileText,
  User,
  Sparkles,
  Info
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { INITIAL_PRODUCTS } from '../../services/mockData';

// Claves de almacenamiento local para persistencia
const STORAGE_WAITLIST_KEY = 'nl_admin_waitlist_requests_v1';
const STORAGE_ALERTS_KEY = 'nl_admin_system_alerts_v1';
const STORAGE_REMINDERS_KEY = 'nl_admin_scheduled_reminders_v1';

// 1. Tipos para Solicitudes de Productos Agotados
export interface OutOfStockRequest {
  id: string;
  productName: string;
  productSku: string;
  productImage: string;
  interestedName: string;
  phone: string;
  email: string;
  date: string;
  comment: string;
  sizeRequested?: string;
  status: 'pending' | 'replied';
  replyNote?: string;
  repliedAt?: string;
}

// 2. Tipos para Alertas Automatizadas y Cobranzas
export interface AutomatedAlert {
  id: string;
  category: 'cobro_pendiente' | 'alerta_despacho' | 'recordatorio_cobro' | 'stock_critico';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  customerName?: string;
  customerPhone?: string;
  orderNumber?: string;
  amount?: number;
  timeLimitText?: string;
  dueHours?: number;
  createdAt: string;
  status: 'active' | 'resolved' | 'extended';
  isAutomated: boolean;
}

// 3. Plazos válidos para programar recordatorios
export type ReminderDeadlineHours = 1 | 2 | 4 | 8 | 24 | 48 | 72;

export interface ScheduledReminder {
  id: string;
  title: string;
  category: 'Cobro Pendiente' | 'Alerta de Despacho' | 'Recordatorio Manual de Cobro' | 'Stock / Proveedor' | 'Atención Cliente';
  description: string;
  targetCustomer?: string;
  targetAmount?: number;
  deadlineHours: ReminderDeadlineHours;
  createdAt: string;
  dueAt: string;
  status: 'active' | 'completed';
  notes?: string;
}

// Datos iniciales de Solicitudes de Productos Agotados
const INITIAL_WAITLIST: OutOfStockRequest[] = [
  {
    id: 'req_01',
    productName: 'Chaleco Táctico Cyber-Rave Arnés Cromado [EDICIÓN AGOTADA]',
    productSku: 'NL-VST-012',
    productImage: INITIAL_PRODUCTS[11]?.images[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    interestedName: 'Camila Henríquez',
    phone: '+56 9 8451 9283',
    email: 'camila.henriquez@gmail.com',
    date: '2026-10-20 08:30',
    sizeRequested: 'Talla L',
    comment: 'Hola! Vi el chaleco táctico en la transmisión en vivo de anoche y cuando fui a pagar me salió que la talla L estaba agotada. Por favor avísenme apenas tengan reposición o si les queda una unidad guardada en la sucursal de Viña del Mar, lo compro de inmediato con transferencia directa! Quedo muy atenta.',
    status: 'pending'
  },
  {
    id: 'req_02',
    productName: 'Cyber-Tribal Overkill Zip Hoodie',
    productSku: 'NL-HOOD-001',
    productImage: INITIAL_PRODUCTS[0]?.images[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
    interestedName: 'Matías Berríos',
    phone: '+56 9 9234 1188',
    email: 'matias.berrios.y2k@hotmail.com',
    date: '2026-10-19 19:45',
    sizeRequested: 'Talla XL',
    comment: 'Busco este polerón en talla XL para envío a Santiago. Me dijeron que en el Drop de Quilpué se agotaron las unidades oversized. Si van a reponer esta semana avísenme antes de que empiece el próximo Live.',
    status: 'pending'
  },
  {
    id: 'req_03',
    productName: 'Gorra Foam Trucker "NoLimits" Y2K Glitch',
    productSku: 'NL-CAP-007',
    productImage: INITIAL_PRODUCTS[6]?.images[0] || 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    interestedName: 'Francisca Morales',
    phone: '+56 9 7612 0044',
    email: 'fran.morales.c@gmail.com',
    date: '2026-10-19 14:10',
    sizeRequested: 'Talla Única',
    comment: 'Hola equipo, necesito 2 unidades de esta gorra trucker para un evento musical el fin de semana. Como está con stock crítico en la web, quería saber si tienen stock en la tienda física de Valparaíso para retiro en tienda hoy mismo.',
    status: 'replied',
    replyNote: 'Se informó a clienta que en Valparaíso quedan 2 unidades en bodega y se le reservaron por 24 horas.',
    repliedAt: '2026-10-19 15:00'
  }
];

// Datos iniciales de Alertas Automatizadas y Cobranzas (Casos ficticios solicitados)
const INITIAL_ALERTS: AutomatedAlert[] = [
  {
    id: 'alert_01',
    category: 'cobro_pendiente',
    title: 'Cobro Pendiente: Reserva en Live #NL-8842',
    description: 'Cliente Ignacio Soto mantiene saldo impago de $38.990 tras reserva en Live. Tiempo límite de liberación de stock expira en 2 horas.',
    severity: 'critical',
    customerName: 'Ignacio Soto',
    customerPhone: '+56 9 7123 4499',
    orderNumber: 'NL-8842',
    amount: 38990,
    timeLimitText: 'Expira en 2 horas',
    dueHours: 2,
    createdAt: 'Hace 45 min',
    status: 'active',
    isAutomated: true
  },
  {
    id: 'alert_02',
    category: 'alerta_despacho',
    title: 'Alerta de Despacho: Operación Starken & Blue Express',
    description: 'Se generaron 6 pedidos en la última hora. Faltan 4 etiquetas por imprimir antes del corte de las 18:00 hrs.',
    severity: 'warning',
    orderNumber: 'Corte 18:00 hrs',
    timeLimitText: 'Corte en 3 horas',
    dueHours: 3,
    createdAt: 'Hace 1 hora',
    status: 'active',
    isAutomated: true
  },
  {
    id: 'alert_03',
    category: 'recordatorio_cobro',
    title: 'Recordatorio Manual de Cobro: Transferencia Mayorista',
    description: 'Cliente Valentina Muñoz solicitó plazo para abonar $64.990 mediante transferencia BancoEstado. Verificar recepción de comprobante en correo.',
    severity: 'warning',
    customerName: 'Valentina Muñoz',
    customerPhone: '+56 9 6611 7733',
    amount: 64990,
    timeLimitText: 'Plazo 24 horas',
    dueHours: 24,
    createdAt: 'Ayer, 16:30',
    status: 'active',
    isAutomated: false
  }
];

// Recordatorios iniciales programados
const INITIAL_REMINDERS: ScheduledReminder[] = [
  {
    id: 'rem_01',
    title: 'Cobro Ignacio Soto - Liberación de Stock',
    category: 'Cobro Pendiente',
    description: 'Verificar si Ignacio Soto adjuntó comprobante de $38.990. Si no, liberar la prenda nuevamente al catálogo del Live Stream.',
    targetCustomer: 'Ignacio Soto',
    targetAmount: 38990,
    deadlineHours: 2,
    createdAt: new Date(Date.now() - 3600000).toLocaleString('es-CL'),
    dueAt: new Date(Date.now() + 3600000).toLocaleString('es-CL'),
    status: 'active',
    notes: 'Pedido #NL-8842'
  },
  {
    id: 'rem_02',
    title: 'Impresión de Etiquetas Starken',
    category: 'Alerta de Despacho',
    description: 'Revisar con bodega que las 4 etiquetas restantes estén pegadas en paquetes antes del retiro del transportista a las 18:00 hrs.',
    deadlineHours: 4,
    createdAt: new Date(Date.now() - 1800000).toLocaleString('es-CL'),
    dueAt: new Date(Date.now() + 12600000).toLocaleString('es-CL'),
    status: 'active',
    notes: '6 bultos preparados'
  }
];

export const InterestNotificationsView: React.FC = () => {
  // Pestaña activa
  const [activeTab, setActiveTab] = useState<'all' | 'waitlist' | 'alerts' | 'reminders'>('all');

  // 1. Estados de Solicitudes de Agotados
  const [waitlistRequests, setWaitlistRequests] = useState<OutOfStockRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WAITLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error cargando waitlist', e);
    }
    return INITIAL_WAITLIST;
  });

  // 2. Estados de Alertas y Cobranzas
  const [alerts, setAlerts] = useState<AutomatedAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALERTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error cargando alertas', e);
    }
    return INITIAL_ALERTS;
  });

  // 3. Estados de Recordatorios Programados
  const [reminders, setReminders] = useState<ScheduledReminder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REMINDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error cargando recordatorios', e);
    }
    return INITIAL_REMINDERS;
  });

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem(STORAGE_WAITLIST_KEY, JSON.stringify(waitlistRequests));
  }, [waitlistRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REMINDERS_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Estados de control de UI
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Estados para Modal de Respuesta
  const [replyingRequest, setReplyingRequest] = useState<OutOfStockRequest | null>(null);
  const [replyChannel, setReplyChannel] = useState<'email' | 'whatsapp'>('whatsapp');
  const [replyTemplate, setReplyTemplate] = useState<string>('restock_next_week');
  const [replyCustomText, setReplyCustomText] = useState<string>('');

  // Estados para Modal de Programar Recordatorio
  const [showProgramModal, setShowProgramModal] = useState<boolean>(false);
  const [newReminderTitle, setNewReminderTitle] = useState<string>('');
  const [newReminderCategory, setNewReminderCategory] = useState<ScheduledReminder['category']>('Cobro Pendiente');
  const [newReminderDesc, setNewReminderDesc] = useState<string>('');
  const [newReminderCustomer, setNewReminderCustomer] = useState<string>('');
  const [newReminderAmount, setNewReminderAmount] = useState<number>(0);
  const [newReminderDeadlineHours, setNewReminderDeadlineHours] = useState<ReminderDeadlineHours>(2);

  // Estados para Modal de Nueva Solicitud Manual
  const [showNewWaitlistModal, setShowNewWaitlistModal] = useState<boolean>(false);
  const [newReqProduct, setNewReqProduct] = useState<string>('Chaleco Táctico Cyber-Rave Arnés Cromado [EDICIÓN AGOTADA]');
  const [newReqName, setNewReqName] = useState<string>('');
  const [newReqPhone, setNewReqPhone] = useState<string>('');
  const [newReqEmail, setNewReqEmail] = useState<string>('');
  const [newReqSize, setNewReqSize] = useState<string>('Talla M');
  const [newReqComment, setNewReqComment] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle para "Ver más..." en comentarios largos
  const toggleCommentExpand = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtrado de solicitudes de agotados
  const filteredWaitlist = useMemo(() => {
    return waitlistRequests.filter((req) => {
      if (statusFilter !== 'all' && req.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchProd = req.productName.toLowerCase().includes(q);
        const matchName = req.interestedName.toLowerCase().includes(q);
        const matchEmail = req.email.toLowerCase().includes(q);
        const matchPhone = req.phone.toLowerCase().includes(q);
        if (!matchProd && !matchName && !matchEmail && !matchPhone) return false;
      }
      return true;
    });
  }, [waitlistRequests, statusFilter, searchQuery]);

  // Eliminación de solicitud
  const handleDeleteWaitlistRequest = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la solicitud de interés de "${name}"?`)) {
      setWaitlistRequests((prev) => prev.filter((r) => r.id !== id));
      triggerToast(`Solicitud de ${name} eliminada`);
    }
  };

  // Abrir modal de respuesta
  const handleOpenReplyModal = (request: OutOfStockRequest) => {
    setReplyingRequest(request);
    setReplyChannel('whatsapp');
    setReplyTemplate('restock_next_week');
    setReplyCustomText(
      `¡Hola ${request.interestedName}! Te escribimos de No Limits Apparel. Vimos tu interés en "${request.productName}". Te informamos que tendremos reposición exclusiva la próxima semana. ¿Te gustaría que te reservemos una unidad prioritaria?`
    );
  };

  // Enviar respuesta
  const handleSendReply = () => {
    if (!replyingRequest) return;

    setWaitlistRequests((prev) =>
      prev.map((r) => {
        if (r.id !== replyingRequest.id) return r;
        return {
          ...r,
          status: 'replied',
          replyNote: `Canal: ${replyChannel.toUpperCase()} - Mensaje: "${replyCustomText}"`,
          repliedAt: new Date().toLocaleString('es-CL')
        };
      })
    );

    triggerToast(`Respuesta enviada a ${replyingRequest.interestedName} vía ${replyChannel}`);
    setReplyingRequest(null);
  };

  // Eliminar alerta
  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    triggerToast('Alerta descartada');
  };

  // Resolver / Extender alerta
  const handleResolveAlert = (id: string, actionName: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
    triggerToast(`Alerta marcada como ${actionName}`);
  };

  // Guardar nuevo recordatorio programado
  const handleSaveScheduledReminder = () => {
    if (!newReminderTitle.trim()) {
      alert('Ingresa un título para el recordatorio');
      return;
    }

    const now = Date.now();
    const dueTime = new Date(now + newReminderDeadlineHours * 3600000);

    const newReminder: ScheduledReminder = {
      id: `rem_${Date.now()}`,
      title: newReminderTitle.trim(),
      category: newReminderCategory,
      description: newReminderDesc.trim(),
      targetCustomer: newReminderCustomer.trim() || undefined,
      targetAmount: newReminderAmount > 0 ? newReminderAmount : undefined,
      deadlineHours: newReminderDeadlineHours,
      createdAt: new Date().toLocaleString('es-CL'),
      dueAt: dueTime.toLocaleString('es-CL'),
      status: 'active'
    };

    setReminders((prev) => [newReminder, ...prev]);
    triggerToast(`Recordatorio programado con plazo de ${newReminderDeadlineHours} horas`);

    // Limpiar formulario y cerrar
    setNewReminderTitle('');
    setNewReminderDesc('');
    setNewReminderCustomer('');
    setNewReminderAmount(0);
    setNewReminderDeadlineHours(2);
    setShowProgramModal(false);
  };

  // Acciones en recordatorios
  const handleToggleReminderStatus = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'active' ? 'completed' : 'active' }
          : r
      )
    );
    triggerToast('Estado del recordatorio actualizado');
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    triggerToast('Recordatorio eliminado');
  };

  // Registrar nueva solicitud manual de agotado
  const handleSaveNewWaitlist = () => {
    if (!newReqName.trim() || !newReqPhone.trim()) {
      alert('Por favor completa al menos el nombre y teléfono del cliente');
      return;
    }

    const newReq: OutOfStockRequest = {
      id: `req_${Date.now()}`,
      productName: newReqProduct,
      productSku: 'NL-MANUAL',
      productImage: INITIAL_PRODUCTS[0]?.images[0] || '',
      interestedName: newReqName.trim(),
      phone: newReqPhone.trim(),
      email: newReqEmail.trim() || 'cliente@nolimits.cl',
      date: new Date().toLocaleString('es-CL'),
      sizeRequested: newReqSize,
      comment: newReqComment.trim() || 'Solicitud registrada manualmente por Super Admin tras contacto telefónico o DM.',
      status: 'pending'
    };

    setWaitlistRequests((prev) => [newReq, ...prev]);
    triggerToast(`Solicitud para "${newReqName}" registrada con éxito`);

    setNewReqName('');
    setNewReqPhone('');
    setNewReqEmail('');
    setNewReqComment('');
    setShowNewWaitlistModal(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('Notificaciones y cobranzas sincronizadas');
    }, 450);
  };

  return (
    <div className="space-y-4 font-sans text-gray-900 pb-16">
      <WindowFrame
        title="INTEREST_NOTIFICATIONS_CENTER.SYS - [Centro de Notificaciones de Interés, Alertas & Cobranzas - Super Admin]"
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText={`SUPER ADMIN // COBRANZAS EN TIEMPO REAL // ALERTAS AUTOMATIZADAS // SOLICITUDES AGOTADOS: ${waitlistRequests.length}`}
      >
        <div className="space-y-4 text-xs">
          {/* Cabecera Principal */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3 bg-linear-to-r from-amber-50/70 via-blue-50/50 to-transparent p-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                  SUPER ADMIN
                </span>
                <span className="bg-amber-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase flex items-center gap-1">
                  <BellRing className="w-3 h-3" />
                  ALERTAS & COBRANZAS
                </span>
                <h1 className="text-sm font-extrabold text-[#003c74] uppercase tracking-wide">
                  Notificaciones de Interés & Centro de Cobranzas
                </h1>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Gestión de clientes interesados en productos agotados, alertas automatizadas de despacho, cobranzas de reservas en Live y programación de recordatorios.
              </p>
            </div>

            {/* Botones de Barra Superior */}
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/admin/inventory">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-3 text-gray-800 flex items-center gap-1.5 font-bold"
                  title="Volver al panel general de Inventario"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-700" />
                  <span>Volver a Inventario</span>
                </button>
              </Link>

              <button
                type="button"
                onClick={() => setShowProgramModal(true)}
                className="winxp-button winxp-button-primary text-xs py-1 px-3 text-purple-950 font-bold flex items-center gap-1.5 border-purple-700 bg-purple-50/80 hover:bg-purple-100"
                title="Programar un nuevo recordatorio con plazos de 1h a 72h"
              >
                <Clock className="w-3.5 h-3.5 text-purple-700" />
                <span>Programar Recordatorio</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNewWaitlistModal(true)}
                className="winxp-button text-xs py-1 px-2.5 text-blue-900 font-bold flex items-center gap-1.5"
                title="Registrar una nueva solicitud de cliente manualmente"
              >
                <Plus className="w-3.5 h-3.5 text-blue-700" />
                <span>Nueva Solicitud Agotado</span>
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                className="winxp-button text-xs py-1 px-2 text-gray-700 flex items-center gap-1"
                title="Sincronizar alertas y solicitudes"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* Toast de confirmación flotante */}
          {toastMessage && (
            <div className="p-2.5 bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-md rounded-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-emerald-800 hover:text-emerald-950 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tarjetas KPI de Resumen */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-white border border-[#7f9db9] shadow-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] uppercase tracking-wider text-purple-900">Interés en Agotados</span>
                <PackageX className="w-4 h-4 text-purple-700" />
              </div>
              <div className="text-xl font-black text-gray-900 mt-1">
                {waitlistRequests.filter((r) => r.status === 'pending').length}{' '}
                <span className="text-xs font-normal text-gray-500">pendientes</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">{waitlistRequests.length} solicitudes totales registradas</div>
            </div>

            <div className="p-2.5 bg-white border border-[#7f9db9] shadow-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] uppercase tracking-wider text-red-900">Cobros Pendientes Live</span>
                <DollarSign className="w-4 h-4 text-red-700" />
              </div>
              <div className="text-xl font-black text-red-700 mt-1">
                $38.990 <span className="text-xs font-normal text-gray-600">Ignacio Soto</span>
              </div>
              <div className="text-[10px] text-red-600 font-bold mt-0.5">Expira en 2 hrs • Liberar stock</div>
            </div>

            <div className="p-2.5 bg-white border border-[#7f9db9] shadow-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] uppercase tracking-wider text-amber-900">Alertas de Despacho</span>
                <Truck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-black text-amber-700 mt-1">
                4 etiquetas <span className="text-xs font-normal text-gray-600">x imprimir</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">Corte de Starken a las 18:00 hrs</div>
            </div>

            <div className="p-2.5 bg-white border border-[#7f9db9] shadow-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] uppercase tracking-wider text-blue-900">Recordatorios Activos</span>
                <Clock className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-xl font-black text-[#003c74] mt-1">
                {reminders.filter((r) => r.status === 'active').length}{' '}
                <span className="text-xs font-normal text-gray-600">programados</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">Plazos desde 1h hasta 72h</div>
            </div>
          </div>

          {/* Navegación por Pestañas */}
          <div className="flex flex-wrap items-center gap-1 border-b-2 border-gray-300 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`winxp-button text-xs py-1 px-3 font-bold flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'winxp-button-primary text-blue-950 border-blue-800 bg-blue-100 shadow-xs'
                  : 'text-gray-700'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Ver Todo ({waitlistRequests.length + alerts.length + reminders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('waitlist')}
              className={`winxp-button text-xs py-1 px-3 font-bold flex items-center gap-1.5 ${
                activeTab === 'waitlist'
                  ? 'winxp-button-primary text-purple-950 border-purple-800 bg-purple-100 shadow-xs'
                  : 'text-gray-700'
              }`}
            >
              <PackageX className="w-3.5 h-3.5 text-purple-700" />
              <span>Solicitudes de Agotados ({waitlistRequests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`winxp-button text-xs py-1 px-3 font-bold flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'winxp-button-primary text-red-950 border-red-800 bg-red-100 shadow-xs'
                  : 'text-gray-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
              <span>Alertas Automatizadas & Cobranzas ({alerts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reminders')}
              className={`winxp-button text-xs py-1 px-3 font-bold flex items-center gap-1.5 ${
                activeTab === 'reminders'
                  ? 'winxp-button-primary text-emerald-950 border-emerald-800 bg-emerald-100 shadow-xs'
                  : 'text-gray-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Recordatorios Programados ({reminders.length})</span>
            </button>
          </div>

          {/* =========================================================================
              SECCIÓN 1: SOLICITUDES DE CLIENTES PARA PRODUCTOS AGOTADOS
             ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'waitlist') && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#ece9d8] border border-gray-400">
                <div className="flex items-center gap-2">
                  <PackageX className="w-4 h-4 text-purple-800" />
                  <h3 className="font-bold text-xs text-[#003c74] uppercase tracking-wide">
                    1. Clientes Interesados en Productos Agotados (Waitlist / Solicitudes)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Búsqueda rápida */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por cliente o producto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="winxp-input text-xs py-0.5 px-2 pr-6 bg-white border border-[#7f9db9] w-48"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filtro estado */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="winxp-input text-xs py-0.5 px-2 bg-white border border-[#7f9db9]"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes de respuesta</option>
                    <option value="replied">Respondidas</option>
                  </select>
                </div>
              </div>

              {/* Lista de Solicitudes */}
              {filteredWaitlist.length === 0 ? (
                <div className="p-6 bg-white border border-gray-300 text-center text-gray-500">
                  <PackageX className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-bold text-sm text-gray-700">No hay solicitudes que coincidan con la búsqueda.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredWaitlist.map((req) => {
                    const isExpanded = !!expandedComments[req.id];
                    const isLongComment = req.comment.length > 90;
                    const displayedComment = !isExpanded && isLongComment
                      ? req.comment.slice(0, 90) + '...'
                      : req.comment;

                    return (
                      <div
                        key={req.id}
                        className={`p-3 bg-white border-2 transition-all shadow-xs rounded-xs ${
                          req.status === 'pending'
                            ? 'border-purple-300 hover:border-purple-600'
                            : 'border-gray-300 opacity-90'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-gray-200 pb-2">
                          {/* Producto y Datos de Producto */}
                          <div className="flex items-center gap-2.5">
                            <img
                              src={req.productImage}
                              alt={req.productName}
                              className="w-12 h-12 object-cover border border-gray-400 rounded-xs shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-gray-600 bg-gray-100 px-1 border border-gray-300 font-bold">
                                  {req.productSku}
                                </span>
                                {req.sizeRequested && (
                                  <span className="text-[10px] font-bold text-purple-900 bg-purple-50 px-1.5 py-0.2 border border-purple-300">
                                    {req.sizeRequested}
                                  </span>
                                )}
                                <span
                                  className={`text-[9px] font-black uppercase px-1.5 py-0.2 border rounded-xs ${
                                    req.status === 'pending'
                                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                                      : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                  }`}
                                >
                                  {req.status === 'pending' ? 'PENDIENTE' : 'RESPONDIDA'}
                                </span>
                              </div>
                              <h4 className="font-bold text-xs text-[#003c74] mt-0.5 line-clamp-1">
                                {req.productName}
                              </h4>
                            </div>
                          </div>

                          {/* Botones de Acción del Administrador (Responder y Eliminar) */}
                          <div className="flex items-center gap-2 self-end md:self-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenReplyModal(req)}
                              className="winxp-button winxp-button-primary text-xs py-1 px-3 text-blue-950 font-bold flex items-center gap-1 shadow-xs border-blue-700 bg-blue-50/80 hover:bg-blue-100"
                              title="Responder a este cliente por Email o WhatsApp"
                            >
                              <Reply className="w-3.5 h-3.5 text-blue-700" />
                              <span>Responder</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteWaitlistRequest(req.id, req.interestedName)}
                              className="winxp-button text-xs py-1 px-2.5 text-red-900 font-bold flex items-center gap-1 border-red-400 hover:bg-red-50"
                              title="Eliminar esta solicitud"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>

                        {/* Campos Requeridos: Interesado, Teléfono, Email, Fecha y Comentario con "Ver más..." */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[11px]">
                          <div>
                            <span className="font-bold text-gray-600 block">Nombre del Interesado:</span>
                            <span className="font-extrabold text-gray-900 flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3 text-blue-700 shrink-0" />
                              {req.interestedName}
                            </span>
                          </div>

                          <div>
                            <span className="font-bold text-gray-600 block">Teléfono:</span>
                            <a
                              href={`tel:${req.phone}`}
                              className="font-mono text-blue-900 hover:underline flex items-center gap-1 mt-0.5 font-bold"
                            >
                              <Phone className="w-3 h-3 text-emerald-700 shrink-0" />
                              {req.phone}
                            </a>
                          </div>

                          <div>
                            <span className="font-bold text-gray-600 block">Email:</span>
                            <a
                              href={`mailto:${req.email}`}
                              className="text-blue-900 hover:underline flex items-center gap-1 mt-0.5 truncate font-medium"
                              title={req.email}
                            >
                              <Mail className="w-3 h-3 text-amber-700 shrink-0" />
                              {req.email}
                            </a>
                          </div>

                          <div>
                            <span className="font-bold text-gray-600 block">Fecha:</span>
                            <span className="text-gray-700 flex items-center gap-1 mt-0.5 font-mono">
                              <Calendar className="w-3 h-3 text-gray-500 shrink-0" />
                              {req.date}
                            </span>
                          </div>
                        </div>

                        {/* Comentario con botón "Ver más..." */}
                        <div className="mt-2.5 p-2 bg-gray-50 border border-gray-200 rounded-xs">
                          <div className="flex items-start gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-bold text-gray-700 mr-1">Comentario del Cliente:</span>
                              <span className="text-gray-900 italic">"{displayedComment}"</span>

                              {isLongComment && (
                                <button
                                  type="button"
                                  onClick={() => toggleCommentExpand(req.id)}
                                  className="ml-2 font-bold text-blue-700 hover:text-blue-900 underline text-[11px] inline-flex items-center gap-0.5"
                                >
                                  {isExpanded ? (
                                    <>
                                      <span>Ver menos</span>
                                      <ChevronUp className="w-3 h-3" />
                                    </>
                                  ) : (
                                    <>
                                      <span>Ver más...</span>
                                      <ChevronDown className="w-3 h-3" />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Nota de respuesta previa si existe */}
                          {req.status === 'replied' && req.replyNote && (
                            <div className="mt-2 pt-1.5 border-t border-gray-200 text-[10px] text-emerald-900 flex items-center justify-between">
                              <span><strong>Respuesta enviada:</strong> {req.replyNote}</span>
                              <span className="font-mono text-gray-500">{req.repliedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SECCIÓN 2: ALERTAS AUTOMATIZADAS & COBRANZAS (CASOS FICTICIOS)
             ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'alerts') && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#ece9d8] border border-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-700" />
                  <h3 className="font-bold text-xs text-[#003c74] uppercase tracking-wide">
                    2. Alertas Automatizadas & Control de Cobranzas
                  </h3>
                </div>
                <div className="text-[11px] text-gray-600">
                  Monitoreo de saldo impago en reservas de Live Stream y logística de salida
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alerts.map((al) => {
                  const isCritical = al.severity === 'critical';
                  const isResolved = al.status === 'resolved';

                  return (
                    <div
                      key={al.id}
                      className={`p-3 bg-white border-2 rounded-xs shadow-xs space-y-2.5 transition-all ${
                        isResolved
                          ? 'border-gray-300 opacity-70 bg-gray-50'
                          : isCritical
                          ? 'border-red-500 hover:border-red-700'
                          : 'border-amber-400 hover:border-amber-600'
                      }`}
                    >
                      {/* Cabecera de Alerta */}
                      <div className="flex items-start justify-between gap-2 border-b border-gray-200 pb-2">
                        <div className="flex items-start gap-2">
                          <div
                            className={`p-1.5 rounded-xs shrink-0 ${
                              isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {al.category === 'cobro_pendiente' ? (
                              <DollarSign className="w-4 h-4" />
                            ) : al.category === 'alerta_despacho' ? (
                              <Truck className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-xs border ${
                                  isCritical
                                    ? 'bg-red-700 text-white border-red-900'
                                    : 'bg-amber-600 text-white border-amber-800'
                                }`}
                              >
                                {al.category === 'cobro_pendiente'
                                  ? 'COBRO PENDIENTE'
                                  : al.category === 'alerta_despacho'
                                  ? 'ALERTA DE DESPACHO'
                                  : 'RECORDATORIO MANUAL'}
                              </span>
                              {al.isAutomated && (
                                <span className="text-[9px] bg-blue-100 text-blue-900 font-bold px-1 border border-blue-300">
                                  AUTOMATIZADA
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-gray-500">{al.createdAt}</span>
                            </div>
                            <h4 className="font-bold text-xs text-gray-900 mt-1">{al.title}</h4>
                          </div>
                        </div>

                        {/* Botón descartar */}
                        <button
                          type="button"
                          onClick={() => handleDeleteAlert(al.id)}
                          className="text-gray-400 hover:text-red-700 p-1"
                          title="Descartar alerta"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Mensaje descriptivo exacto */}
                      <div className="p-2.5 bg-gray-50 border border-gray-300 rounded-xs text-xs text-gray-800 leading-relaxed font-medium">
                        {al.description}
                      </div>

                      {/* Metadatos adicionales */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                        <div className="flex items-center gap-2">
                          {al.customerName && (
                            <span className="font-bold text-gray-700">
                              Cliente: <strong className="text-gray-900">{al.customerName}</strong>
                            </span>
                          )}
                          {al.amount && (
                            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-300">
                              Monto: ${al.amount.toLocaleString('es-CL')}
                            </span>
                          )}
                        </div>

                        {al.timeLimitText && (
                          <span className="font-bold text-red-700 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-red-600" />
                            {al.timeLimitText}
                          </span>
                        )}
                      </div>

                      {/* Acciones de Alerta */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setNewReminderTitle(`Seguimiento: ${al.title}`);
                            setNewReminderCategory(
                              al.category === 'cobro_pendiente'
                                ? 'Cobro Pendiente'
                                : al.category === 'alerta_despacho'
                                ? 'Alerta de Despacho'
                                : 'Recordatorio Manual de Cobro'
                            );
                            setNewReminderDesc(al.description);
                            setNewReminderCustomer(al.customerName || '');
                            setNewReminderAmount(al.amount || 0);
                            setNewReminderDeadlineHours(al.dueHours === 2 ? 2 : 4);
                            setShowProgramModal(true);
                          }}
                          className="winxp-button text-xs py-0.5 px-2 text-purple-900 font-bold flex items-center gap-1"
                          title="Crear un recordatorio programado a partir de esta alerta"
                        >
                          <Clock className="w-3 h-3 text-purple-700" />
                          <span>Programar Recordatorio (+Plazo)</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {al.category === 'cobro_pendiente' && (
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Simulación: Contactando por WhatsApp a ${al.customerName} (+56 9 7123 4499) con aviso de liberación de stock.`);
                              }}
                              className="winxp-button text-xs py-0.5 px-2 text-blue-900 font-bold"
                            >
                              Cobrar Vía WhatsApp
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleResolveAlert(al.id, 'Resuelta')}
                            className="winxp-button winxp-button-primary text-xs py-0.5 px-2.5 text-emerald-950 font-bold flex items-center gap-1 border-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>{isResolved ? 'Resuelta' : 'Marcar Resuelta'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              SECCIÓN 3: RECORDATORIOS PROGRAMADOS CON PLAZOS ESPECÍFICOS
             ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'reminders') && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#ece9d8] border border-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-800" />
                  <h3 className="font-bold text-xs text-[#003c74] uppercase tracking-wide">
                    3. Recordatorios Programados (Plazos: 1h, 2h, 4h, 8h, 24h, 48h, 72h)
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProgramModal(true)}
                  className="winxp-button winxp-button-primary text-xs py-1 px-3 text-purple-950 font-bold flex items-center gap-1.5 border-purple-700 bg-purple-50/80 hover:bg-purple-100"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-700" />
                  <span>Programar Nuevo Recordatorio</span>
                </button>
              </div>

              {reminders.length === 0 ? (
                <div className="p-6 bg-white border border-gray-300 text-center text-gray-500">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-bold text-sm text-gray-700">No hay recordatorios programados actualmente.</p>
                  <button
                    type="button"
                    onClick={() => setShowProgramModal(true)}
                    className="winxp-button text-xs py-1 px-3 mt-2 text-purple-900 font-bold"
                  >
                    Programar el primer recordatorio
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reminders.map((rem) => {
                    const isDone = rem.status === 'completed';

                    return (
                      <div
                        key={rem.id}
                        className={`p-3 bg-white border-2 rounded-xs shadow-xs space-y-2 transition-all ${
                          isDone ? 'border-gray-300 opacity-60 bg-gray-50' : 'border-purple-300 hover:border-purple-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-gray-200 pb-1.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-purple-100 text-purple-900 border border-purple-400 rounded-xs">
                                {rem.category}
                              </span>
                              <span className="font-mono text-[10px] text-gray-500">Plazo: {rem.deadlineHours} hrs</span>
                            </div>
                            <h4 className="font-bold text-xs text-[#003c74] mt-1">{rem.title}</h4>
                          </div>

                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.2 border rounded-xs ${
                              isDone
                                ? 'bg-gray-200 text-gray-700 border-gray-400'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-400 animate-pulse'
                            }`}
                          >
                            {isDone ? 'COMPLETADO' : 'ACTIVO'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-800 leading-snug">{rem.description}</p>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-600 bg-gray-50 p-1.5 border border-gray-200 rounded-xs font-mono">
                          <div>Creado: {rem.createdAt}</div>
                          <div className="font-bold text-purple-900">Vence: {rem.dueAt}</div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => handleToggleReminderStatus(rem.id)}
                            className="winxp-button text-xs py-0.5 px-2.5 text-emerald-900 font-bold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>{isDone ? 'Reactivar' : 'Marcar Completado'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteReminder(rem.id)}
                            className="text-red-600 hover:text-red-800 font-bold text-[11px] p-1"
                            title="Eliminar recordatorio"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Guía Operativa para Super Admin */}
          <div className="p-3 bg-amber-50 border border-amber-300 flex items-start gap-2.5 shadow-xs">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-950 space-y-1">
              <strong className="block font-bold">Protocolo de Notificaciones & Cobranzas Super Admin:</strong>
              <p>
                • <strong>Solicitudes de Agotados:</strong> Permite fidelizar a los clientes que no alcanzaron a comprar prendas agotadas durante transmisiones en vivo o promociones, permitiendo responderles con opciones de reserva preferente.
              </p>
              <p>
                • <strong>Alertas Automatizadas & Cobranzas:</strong> Previene la retención o pérdida de stock de compras en Live impagas (ej. Ignacio Soto) y alerta sobre cortes de despacho de Starken/Blue Express antes de las 18:00 hrs.
              </p>
              <p>
                • <strong>Plazos de Recordatorios:</strong> Diseñados para ciclos de venta ágiles de 1h, 2h, 4h, 8h, 24h (1 día), 48h (2 días) y 72h (3 días).
              </p>
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* =========================================================================
          MODAL 1: RESPONDER A CLIENTE INTERESADO EN PRODUCTO AGOTADO
         ========================================================================= */}
      {replyingRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-lg animate-in zoom-in-95 duration-150">
            <WindowFrame
              title={`RESPONDER A CLIENTE // ${replyingRequest.interestedName}`}
              icon={<PixelIcon name="floppy" size={16} />}
              onClose={() => setReplyingRequest(null)}
              statusBarText="COMUNICACIÓN DIRECTA CON CLIENTE // REGISTRO AUDITABLE"
            >
              <div className="space-y-3 p-1 text-xs">
                {/* Resumen del cliente */}
                <div className="p-2.5 bg-gray-100 border border-gray-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{replyingRequest.interestedName}</span>
                    <span className="font-mono text-gray-600">{replyingRequest.phone}</span>
                  </div>
                  <div className="text-gray-700">
                    Producto: <strong>{replyingRequest.productName}</strong> ({replyingRequest.sizeRequested || 'Talla Única'})
                  </div>
                </div>

                {/* Canal de respuesta */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    Canal de Envío:
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="channel"
                        checked={replyChannel === 'whatsapp'}
                        onChange={() => setReplyChannel('whatsapp')}
                      />
                      <span>WhatsApp (+56)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold ml-4">
                      <input
                        type="radio"
                        name="channel"
                        checked={replyChannel === 'email'}
                        onChange={() => setReplyChannel('email')}
                      />
                      <span>Correo Electrónico ({replyingRequest.email})</span>
                    </label>
                  </div>
                </div>

                {/* Plantilla rápida */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    Plantilla de Respuesta Rápida:
                  </label>
                  <select
                    value={replyTemplate}
                    onChange={(e) => {
                      const t = e.target.value;
                      setReplyTemplate(t);
                      if (t === 'restock_next_week') {
                        setReplyCustomText(
                          `¡Hola ${replyingRequest.interestedName}! Te escribimos de No Limits Apparel. Vimos tu interés en "${replyingRequest.productName}". Te informamos que tendremos reposición exclusiva la próxima semana. ¿Te gustaría que te reservemos una unidad prioritaria?`
                        );
                      } else if (t === 'store_pickup') {
                        setReplyCustomText(
                          `¡Hola ${replyingRequest.interestedName}! Te escribimos de No Limits. Tenemos 1 unidad disponible para retiro inmediato en la tienda de Viña del Mar. Si confirmas hoy, te la reservamos por 24 horas.`
                        );
                      } else if (t === 'custom') {
                        setReplyCustomText('');
                      }
                    }}
                    className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9]"
                  >
                    <option value="restock_next_week">Reposición disponible la próxima semana (Recomendada)</option>
                    <option value="store_pickup">Unidad disponible en tienda física para retiro</option>
                    <option value="custom">Mensaje personalizado en blanco</option>
                  </select>
                </div>

                {/* Mensaje de respuesta */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    Mensaje a enviar:
                  </label>
                  <textarea
                    rows={4}
                    value={replyCustomText}
                    onChange={(e) => setReplyCustomText(e.target.value)}
                    className="w-full winxp-input text-xs p-2 bg-white border border-[#7f9db9]"
                    placeholder="Escribe el mensaje..."
                  />
                </div>

                {/* Botones */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-300">
                  <button
                    type="button"
                    onClick={() => setReplyingRequest(null)}
                    className="winxp-button text-xs py-1 px-3 text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="winxp-button winxp-button-primary text-xs py-1 px-4 text-blue-950 font-bold flex items-center gap-1.5 shadow-xs border-blue-800 bg-blue-100"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-700" />
                    <span>Enviar Respuesta</span>
                  </button>
                </div>
              </div>
            </WindowFrame>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PROGRAMAR RECORDATORIO (PLAZOS: 1, 2, 4, 8, 24, 48, 72 HORAS)
         ========================================================================= */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-lg animate-in zoom-in-95 duration-150">
            <WindowFrame
              title="PROGRAMAR RECORDATORIO // SUPER ADMIN"
              icon={<PixelIcon name="computer" size={16} />}
              onClose={() => setShowProgramModal(false)}
              statusBarText="CONFIGURACIÓN DE PLAZOS AUTOMATIZADOS DE COBRO Y DESPACHO"
            >
              <div className="space-y-3 p-1 text-xs">
                {/* Título */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    Título del Recordatorio:
                  </label>
                  <input
                    type="text"
                    value={newReminderTitle}
                    onChange={(e) => setNewReminderTitle(e.target.value)}
                    placeholder="Ej: Cobro Pendiente Ignacio Soto / Alerta Despacho Starken"
                    className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9] font-bold"
                  />
                </div>

                {/* Tipo / Categoría */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      Categoría:
                    </label>
                    <select
                      value={newReminderCategory}
                      onChange={(e) => setNewReminderCategory(e.target.value as any)}
                      className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9] font-bold"
                    >
                      <option value="Cobro Pendiente">Cobro Pendiente</option>
                      <option value="Alerta de Despacho">Alerta de Despacho</option>
                      <option value="Recordatorio Manual de Cobro">Recordatorio Manual de Cobro</option>
                      <option value="Stock / Proveedor">Stock / Proveedor</option>
                      <option value="Atención Cliente">Atención Cliente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      Cliente Asociado (Opcional):
                    </label>
                    <input
                      type="text"
                      value={newReminderCustomer}
                      onChange={(e) => setNewReminderCustomer(e.target.value)}
                      placeholder="Ej: Ignacio Soto"
                      className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9]"
                    />
                  </div>
                </div>

                {/* SELECCIÓN DE PLAZO ESPECÍFICO (REQUISITO EXPLÍCITO) */}
                <div className="p-2.5 bg-purple-50 border border-purple-300 rounded-xs space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-purple-950 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-700" />
                    <span>Plazo de Expiración del Recordatorio (Requisito):</span>
                  </label>
                  <p className="text-[10px] text-purple-900">
                    Selecciona en cuántas horas deseas que se active la alerta máxima en el panel del Super Admin:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                    {[
                      { hours: 1, label: '1 hora' },
                      { hours: 2, label: '2 horas' },
                      { hours: 4, label: '4 horas' },
                      { hours: 8, label: '8 horas' },
                      { hours: 24, label: '24h (1 día)' },
                      { hours: 48, label: '48h (2 días)' },
                      { hours: 72, label: '72h (3 días)' }
                    ].map((opt) => (
                      <button
                        key={opt.hours}
                        type="button"
                        onClick={() => setNewReminderDeadlineHours(opt.hours as ReminderDeadlineHours)}
                        className={`text-xs py-1 px-2 border font-bold text-center transition-all ${
                          newReminderDeadlineHours === opt.hours
                            ? 'bg-purple-700 text-white border-purple-900 shadow-xs ring-1 ring-purple-900'
                            : 'bg-white text-gray-800 border-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] text-purple-950 font-mono pt-1 text-right">
                    Plazo seleccionado: <strong>{newReminderDeadlineHours} horas</strong>
                  </div>
                </div>

                {/* Monto involucrado */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    Monto Involucrado ($ CLP, opcional):
                  </label>
                  <input
                    type="number"
                    value={newReminderAmount}
                    onChange={(e) => setNewReminderAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="Ej: 38990"
                    className="w-full winxp-input text-xs py-1 px-2 font-mono font-bold bg-white border border-[#7f9db9]"
                  />
                </div>

                {/* Descripción / Notas */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    Instrucción / Descripción del Recordatorio:
                  </label>
                  <textarea
                    rows={3}
                    value={newReminderDesc}
                    onChange={(e) => setNewReminderDesc(e.target.value)}
                    placeholder="Ej: Verificar comprobante de pago de reserva Live. Si no abona en el plazo, liberar stock..."
                    className="w-full winxp-input text-xs p-2 bg-white border border-[#7f9db9]"
                  />
                </div>

                {/* Botones */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-300">
                  <button
                    type="button"
                    onClick={() => setShowProgramModal(false)}
                    className="winxp-button text-xs py-1 px-3 text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveScheduledReminder}
                    className="winxp-button winxp-button-primary text-xs py-1 px-4 text-purple-950 font-bold flex items-center gap-1.5 shadow-xs border-purple-800 bg-purple-100"
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-700" />
                    <span>Programar Recordatorio</span>
                  </button>
                </div>
              </div>
            </WindowFrame>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: AGREGAR SOLICITUD DE AGOTADO MANUALMENTE
         ========================================================================= */}
      {showNewWaitlistModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-lg animate-in zoom-in-95 duration-150">
            <WindowFrame
              title="REGISTRAR CLIENTE INTERESADO // PRODUCTO AGOTADO"
              icon={<PixelIcon name="computer" size={16} />}
              onClose={() => setShowNewWaitlistModal(false)}
              statusBarText="ALTA MANUAL EN LISTA DE ESPERA DE STOCK"
            >
              <div className="space-y-3 p-1 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    Producto Agotado Solicitado:
                  </label>
                  <select
                    value={newReqProduct}
                    onChange={(e) => setNewReqProduct(e.target.value)}
                    className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9] font-bold"
                  >
                    {INITIAL_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      Nombre del Interesado:
                    </label>
                    <input
                      type="text"
                      value={newReqName}
                      onChange={(e) => setNewReqName(e.target.value)}
                      placeholder="Ej: Sofía Cárdenas"
                      className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      Talla Solicitada:
                    </label>
                    <input
                      type="text"
                      value={newReqSize}
                      onChange={(e) => setNewReqSize(e.target.value)}
                      placeholder="Ej: M, L, XL, Única"
                      className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      Teléfono de Contacto:
                    </label>
                    <input
                      type="text"
                      value={newReqPhone}
                      onChange={(e) => setNewReqPhone(e.target.value)}
                      placeholder="+56 9 1234 5678"
                      className="w-full winxp-input text-xs py-1 px-2 font-mono bg-white border border-[#7f9db9]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      Correo Electrónico:
                    </label>
                    <input
                      type="email"
                      value={newReqEmail}
                      onChange={(e) => setNewReqEmail(e.target.value)}
                      placeholder="cliente@gmail.com"
                      className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    Comentario / Solicitud del Cliente:
                  </label>
                  <textarea
                    rows={3}
                    value={newReqComment}
                    onChange={(e) => setNewReqComment(e.target.value)}
                    placeholder="Detalle de lo que busca el cliente o contexto del contacto (Live, DM Instagram, llamada)..."
                    className="w-full winxp-input text-xs p-2 bg-white border border-[#7f9db9]"
                  />
                </div>

                {/* Botones */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-300">
                  <button
                    type="button"
                    onClick={() => setShowNewWaitlistModal(false)}
                    className="winxp-button text-xs py-1 px-3 text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewWaitlist}
                    className="winxp-button winxp-button-primary text-xs py-1 px-4 text-blue-950 font-bold flex items-center gap-1.5 shadow-xs border-blue-800 bg-blue-100"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-700" />
                    <span>Guardar Solicitud</span>
                  </button>
                </div>
              </div>
            </WindowFrame>
          </div>
        </div>
      )}
    </div>
  );
};
export default InterestNotificationsView;
