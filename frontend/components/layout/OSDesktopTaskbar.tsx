import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
  Bell,
  Users,
  HelpCircle,
  CreditCard,
  FileText,
  ShieldCheck,
  Truck,
  RotateCcw,
  Instagram,
  ChevronUp,
  ChevronDown,
  Phone,
  ExternalLink,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAdminNotifications } from '../../context/AdminNotificationContext';
import { PixelIcon } from '../common/PixelIcon';
import { WindowFrame } from './WindowFrame';
import { ContactoWidget } from '../home/ContactoWidget';

interface ModalInfo {
  title: string;
  category: string;
  content: React.ReactNode;
}

export const OSDesktopTaskbar: React.FC = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const location = useLocation();
  const { currentRole, currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const { notifications, unreadCount } = useAdminNotifications();
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  // Estado para la expansión del footer corporativo (controlado únicamente por clic del usuario)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // Modal para la Mesa de Ayuda / Contacto WhatsApp
  const [showContacto, setShowContacto] = useState<boolean>(false);
  // Modal informativo para los botones del footer
  const [activeModal, setActiveModal] = useState<ModalInfo | null>(null);

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

  const handleOpenInfo = (key: string) => {
    switch (key) {
      case 'quienes_somos':
        setActiveModal({
          title: 'Quienes_Somos.txt - Bloc de Notas',
          category: 'NOSOTROS // HISTORIA Y VISIÓN',
          content: (
            <div className="space-y-3 text-xs leading-relaxed text-gray-800">
              <div className="p-2.5 bg-blue-50 border border-blue-300 winxp-bevel-in font-bold text-blue-900">
                ⚡ NOLIMITS APPAREL CORE // CHILE
              </div>
              <p>
                <strong>NoLimits</strong> es una marca chilena pionera en indumentaria urbana alternativa, cyber-gótica y streetwear técnico inspirada en la estética nostálgica de Windows XP y los años 2000.
              </p>
              <p>
                Nuestras colecciones se fabrican con altos estándares de gramaje y durabilidad, diseñadas para quienes buscan un estilo audaz, cortes oversized y siluetas auténticas.
              </p>
              <div className="border-t border-gray-300 pt-2 text-[11px] text-gray-600">
                Puntos de presencia física: Mall Marina Studio (Viña del Mar), Valparaíso Cerro Alegre Drop Store y Quilpué Drop Hub.
              </div>
            </div>
          )
        });
        break;

      case 'contacto':
        setShowContacto(true);
        break;

      case 'como_comprar':
        setActiveModal({
          title: 'Guia_de_Compra.chm - Ayuda de Windows',
          category: 'NOSOTROS // PASO A PASO',
          content: (
            <div className="space-y-2.5 text-xs text-gray-800">
              <div className="font-bold text-blue-900 pb-1 border-b border-gray-300">
                ¿Cómo comprar en NoLimits?
              </div>
              <ol className="list-decimal pl-4 space-y-1.5">
                <li><strong>Explora el Catálogo:</strong> Selecciona tus prendas favoritas y escoge tu talla.</li>
                <li><strong>Agrega al Carro:</strong> Presiona &quot;Agregar al Carro&quot; para asegurar tu stock físico en tiempo real.</li>
                <li><strong>Datos del Titular (Paso 1):</strong> Completa tus nombres, apellidos, RUT chileno (con máscara automática), teléfono y correo electrónico.</li>
                <li><strong>Selecciona Retiro o Despacho (Paso 2):</strong> Escoge retiro inmediato en nuestras sucursales físicas (sin costo) o envío a domicilio por courier (Starken, bluexpress o Paket).</li>
                <li><strong>Pago Seguro (Paso 3):</strong> Presiona &quot;Proceder con el Pago&quot; para ingresar a la pasarela protegida de Transbank Webpay Plus.</li>
              </ol>
            </div>
          )
        });
        break;

      case 'medios_de_pago':
        setActiveModal({
          title: 'Medios_de_Pago.cpl - Transbank Webpay',
          category: 'NOSOTROS // PAGOS DIGITALES',
          content: (
            <div className="space-y-2.5 text-xs text-gray-800">
              <div className="p-2 bg-green-50 border border-green-300 winxp-bevel-in flex items-center gap-2 text-green-900 font-bold">
                <CreditCard className="w-4 h-4 text-green-700 shrink-0" />
                <span>Pasarela Oficial Transbank Webpay Plus (Cifrado SSL 128-Bits)</span>
              </div>
              <p>Aceptamos todos los medios de pago bancarios nacionales chilenos:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-700">
                <li><strong>Tarjetas de Débito:</strong> Redcompra, CuentaRUT, Cuenta Corriente de cualquier banco chileno.</li>
                <li><strong>Tarjetas de Crédito:</strong> Visa, Mastercard, Magna, American Express, Diners.</li>
                <li><strong>Tarjetas de Prepago Digital:</strong> Tenpo, MACH, Mercado Pago.</li>
              </ul>
              <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-200">
                ✓ Transacciones directas y seguras procesadas por los servidores de Transbank.
              </div>
            </div>
          )
        });
        break;

      case 'privacidad':
        setActiveModal({
          title: 'Politicas_Privacidad.doc - Documento Oficial',
          category: 'SERVICIO AL CLIENTE // SEGURIDAD',
          content: (
            <div className="space-y-2 text-xs text-gray-800">
              <p className="font-bold text-blue-900">Protección de Datos Personales (Ley N° 19.628 de Chile)</p>
              <p>
                En NoLimits respetamos rigurosamente tu privacidad. Los datos proporcionados durante el proceso de compra (Nombre, RUT, Teléfono, Dirección y Correo electrónico) son utilizados exclusivamente para:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                <li>Generar la boleta electrónica y comprobante de compra.</li>
                <li>Gestionar el retiro presencial o rotulación con el courier de despacho.</li>
                <li>Enviar notificaciones del estado de tu orden y código de tracking.</li>
              </ul>
              <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-200">
                Tus datos jamás serán transferidos ni comercializados a terceras partes.
              </p>
            </div>
          )
        });
        break;

      case 'terminos':
        setActiveModal({
          title: 'Terminos_y_Condiciones.txt - Términos del Servicio',
          category: 'SERVICIO AL CLIENTE // CONDICIONES',
          content: (
            <div className="space-y-2 text-xs text-gray-800">
              <p className="font-bold text-blue-900">Términos de Compra y Despacho</p>
              <p>
                Al realizar una orden en NoLimits, el cliente acepta las condiciones de stock sincronizado, los tiempos estimados de preparación en tienda y los plazos de entrega nacional según el courier seleccionado.
              </p>
              <p>
                Cada prenda cuenta con garantía legal de 6 meses ante fallas de fábrica conforme a la normativa del SERNAC.
              </p>
            </div>
          )
        });
        break;

      case 'metodos_envio':
        setActiveModal({
          title: 'Metodos_de_Envio.exe - Logística Nacional',
          category: 'SERVICIO AL CLIENTE // DESPACHOS',
          content: (
            <div className="space-y-2.5 text-xs text-gray-800">
              <div className="font-bold text-blue-900 pb-1 border-b border-gray-300 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-700" />
                <span>Couriers Oficiales de Despacho a Todo Chile</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 border border-gray-300">
                  <strong className="text-blue-950">1. Starken:</strong> Cobertura nacional a domicilio y agencias de Arica a Punta Arenas. Plazo: 24 a 72 hrs hábiles.
                </div>
                <div className="p-2 bg-gray-50 border border-gray-300">
                  <strong className="text-blue-950">2. bluexpress:</strong> Despacho express regional y metropolitano con seguimiento satelital paso a paso.
                </div>
                <div className="p-2 bg-gray-50 border border-gray-300">
                  <strong className="text-blue-950">3. Paket:</strong> Envíos urbanos inteligentes con tarifa competitiva en comunas centrales.
                </div>
              </div>
              <div className="text-[11px] text-gray-600">
                * El número de seguimiento (tracking) se enviará directamente a tu correo electrónico una vez despachado el paquete.
              </div>
            </div>
          )
        });
        break;

      case 'retiro_sucursal':
        setActiveModal({
          title: 'Retiro_en_Sucursal.cpl - Puntos Físicos',
          category: 'SERVICIO AL CLIENTE // TIENDAS FÍSICAS',
          content: (
            <div className="space-y-2 text-xs text-gray-800">
              <div className="font-bold text-blue-900 pb-1 border-b border-gray-300 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-blue-700" />
                <span>Retiro Inmediato Gratuito ($0 CLP) en 15 Minutos</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 bg-gray-50 border border-gray-300">
                  <div className="font-bold text-gray-900">Sucursal Viña del Mar - Mall Marina Studio</div>
                  <div className="text-gray-600 text-[11px]">Av. Libertad 1348, Local 204 · hora de retiro entre 10:00 hasta 20:30 hrs</div>
                </div>
                <div className="p-2 bg-gray-50 border border-gray-300">
                  <div className="font-bold text-gray-900">Sucursal Valparaíso - Cerro Alegre Drop Store</div>
                  <div className="text-gray-600 text-[11px]">Calle Urriola 450 · hora de retiro entre 10:30 hasta 19:30 hrs</div>
                </div>
                <div className="p-2 bg-gray-50 border border-gray-300">
                  <div className="font-bold text-gray-900">Sucursal Quilpué - Centro Drop Hub</div>
                  <div className="text-gray-600 text-[11px]">Los Carrera 880, Edificio Sol · hora de retiro entre 11:00 hasta 20:00 hrs</div>
                </div>
              </div>
              <div className="text-[11px] text-green-700 font-semibold">
                ✓ Para retirar solo debes presentar tu cédula de identidad o el número de orden de compra.
              </div>
            </div>
          )
        });
        break;

      case 'cambios_devoluciones':
        setActiveModal({
          title: 'Cambios_y_Devoluciones.doc - Políticas de Post-Venta',
          category: 'SERVICIO AL CLIENTE // GARANTÍA',
          content: (
            <div className="space-y-2 text-xs text-gray-800">
              <div className="font-bold text-blue-900 pb-1 border-b border-gray-300 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-blue-700" />
                <span>Garantía de Satisfacción y Cambio de Tallas</span>
              </div>
              <p>
                Si la talla no te acomoda o requieres cambiar tu prenda, cuentas con <strong>30 días corridos</strong> desde la fecha de recepción para solicitar cambio o devolución.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-700">
                <li>La prenda debe encontrarse sin uso, sin lavar y con sus etiquetas originales intactas.</li>
                <li>Puedes realizar el cambio directamente en cualquiera de nuestras sucursales físicas sin costo adicional.</li>
                <li>Para cambios por despacho, puedes coordinarlo mediante nuestra Mesa de Ayuda de WhatsApp.</li>
              </ul>
            </div>
          )
        });
        break;

      default:
        break;
    }
  };

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

          {/* Cuerpo en dos columnas */}
          <div className="flex min-h-[300px]">
            {/* Columna Izquierda: Accesos Directos a la Tienda */}
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

              <div className="px-2 py-1 text-[11px] font-bold text-gray-600">Sistema:</div>
              <Link
                to="/auth"
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#316ac5] hover:text-white rounded-xs text-gray-700"
              >
                <PixelIcon name="computer" size={16} />
                <span>Mi Cuenta / Perfil</span>
              </Link>
            </div>

            {/* Columna Derecha: Administración */}
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

          {/* Pie del Menú Inicio */}
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
          BARRA DE TAREAS INFERIOR WINDOWS XP LUNA BLUE (<footer className="fixed bottom-0 left-0 right-0 z-40 winxp-taskbar">)
          CON PANEL EXPANDIBLE HACIA ABAJO/ARRIBA AL LLEGAR AL FINAL DEL FOOTER
          =================================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 winxp-taskbar select-none">
        {/* PANEL EXPANDIBLE: Contiene los bloques NOSOTROS, SERVICIO AL CLIENTE y SÍGUENOS */}
        {isExpanded && (
          <div className="absolute bottom-[32px] left-0 right-0 bg-[#ece9d8] border-t-2 border-b border-[#0055ea] shadow-2xl animate-in slide-in-from-bottom duration-200 font-sans max-h-[85vh] overflow-y-auto">
            {/* Cabecera superior del contenedor expandido */}
            <div className="bg-gradient-to-r from-[#0055ea] via-[#288eff] to-[#0045d6] px-3 py-1.5 text-white flex items-center justify-between border-b border-[#003cb3]">
              <div className="flex items-center gap-2">
                <PixelIcon name="windows-flag" size={16} />
                <span className="font-bold text-xs tracking-wide drop-shadow-sm">
                  NOLIMITS APPAREL // CORPORATIVO & SERVICIO AL CLIENTE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Contraer panel"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Minimizar</span>
              </button>
            </div>

            {/* Contenido en 3 Columnas: NOSOTROS, SERVICIO AL CLIENTE, SÍGUENOS */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-300 winxp-bevel-in max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. NOSOTROS */}
                <div className="space-y-2 bg-[#f8fafc] p-3 border border-gray-300 winxp-bevel-out">
                  <div className="font-bold text-xs text-blue-900 pb-1.5 border-b border-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span>NOSOTROS</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenInfo('quienes_somos')}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50/80 cursor-pointer w-full text-left"
                    >
                      <PixelIcon name="info" size={14} />
                      <span>Quienes Somos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowContacto(true)}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-green-950 hover:text-green-900 hover:bg-green-50/80 cursor-pointer w-full text-left"
                    >
                      <PixelIcon name="whatsapp" size={14} />
                      <span>Contacto / WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInfo('como_comprar')}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50/80 cursor-pointer w-full text-left"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-blue-700" />
                      <span>Cómo Comprar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInfo('medios_de_pago')}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50/80 cursor-pointer w-full text-left"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Medios de Pago</span>
                    </button>
                  </div>
                </div>

                {/* 2. SERVICIO AL CLIENTE */}
                <div className="space-y-2 bg-[#f8fafc] p-3 border border-gray-300 winxp-bevel-out">
                  <div className="font-bold text-xs text-blue-900 pb-1.5 border-b border-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <HelpCircle className="w-4 h-4 text-blue-700" />
                    <span>SERVICIO AL CLIENTE</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenInfo('privacidad')}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50/80 cursor-pointer w-full text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                      <span>Políticas de Privacidad</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInfo('terminos')}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50/80 cursor-pointer w-full text-left"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-600" />
                      <span>Términos y Condiciones</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInfo('metodos_envio')}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50/80 cursor-pointer w-full text-left"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Métodos de Envío</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInfo('retiro_sucursal')}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50/80 cursor-pointer w-full text-left"
                    >
                      <Store className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Retiro en Sucursal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInfo('cambios_devoluciones')}
                      className="winxp-button text-xs py-1.5 px-3 justify-start font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50/80 cursor-pointer w-full text-left"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                      <span>Cambios y Devoluciones</span>
                    </button>
                  </div>
                </div>

                {/* 3. SÍGUENOS */}
                <div className="space-y-2 bg-[#f8fafc] p-3 border border-gray-300 winxp-bevel-out">
                  <div className="font-bold text-xs text-blue-900 pb-1.5 border-b border-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <ExternalLink className="w-4 h-4 text-blue-700" />
                    <span>SÍGUENOS</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    Conéctate a nuestras redes oficiales para enterarte de los nuevos drops y eventos en tiendas físicas.
                  </p>

                  <div className="space-y-2 pt-1">
                    {/* Botón con Ícono de TikTok */}
                    <a
                      href="https://tiktok.com/@nolimits.cl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="winxp-button text-xs py-2 px-3 justify-start font-bold text-gray-900 hover:text-black hover:bg-gray-100 cursor-pointer w-full flex items-center gap-2.5 border border-gray-400 shadow-xs"
                    >
                      <div className="w-5 h-5 rounded-[4px] bg-[#010101] flex items-center justify-center shrink-0 shadow-sm border border-gray-700">
                        {/* Logotipo oficial de TikTok con efecto duotono Cian (#25F4EE) y Magenta (#FE2C55) */}
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M16.6 5.82s.51.5 1.45.75c.95.26 1.83.17 1.83.17V3.5s-.82.02-1.84-.33c-1.02-.35-1.78-1.07-1.78-1.07V13.8a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.35 0 .69.06 1 .17V7.5a6.45 6.45 0 0 0-1-.08A6.4 6.4 0 0 0 6.96 13.8a6.4 6.4 0 0 0 6.4 6.4 6.4 6.4 0 0 0 6.4-6.4V8.42a8.55 8.55 0 0 0 3.24 1.15V6.13c-.93-.16-1.8-.57-2.52-1.18a5.53 5.53 0 0 1-1.48-1.55l-2.4 2.42z"
                            fill="#25F4EE"
                          />
                          <path
                            d="M16.1 5.32s.51.5 1.45.75c.95.26 1.83.17 1.83.17V3s-.82.02-1.84-.33c-1.02-.35-1.78-1.07-1.78-1.07V13.3a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.35 0 .69.06 1 .17V7a6.45 6.45 0 0 0-1-.08A6.4 6.4 0 0 0 6.46 13.3a6.4 6.4 0 0 0 6.4 6.4 6.4 6.4 0 0 0 6.4-6.4V7.92a8.55 8.55 0 0 0 3.24 1.15V5.63c-.93-.16-1.8-.57-2.52-1.18a5.53 5.53 0 0 1-1.48-1.55l-2.4 2.42z"
                            fill="#FE2C55"
                          />
                          <path
                            d="M16.35 5.57s.51.5 1.45.75c.95.26 1.83.17 1.83.17V3.25s-.82.02-1.84-.33c-1.02-.35-1.78-1.07-1.78-1.07V13.55a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.35 0 .69.06 1 .17V7.25a6.45 6.45 0 0 0-1-.08 6.4 6.4 0 0 0-6.4 6.38 6.4 6.4 0 0 0 6.4 6.4 6.4 6.4 0 0 0 6.4-6.4V8.17a8.55 8.55 0 0 0 3.24 1.15V5.88c-.93-.16-1.8-.57-2.52-1.18a5.53 5.53 0 0 1-1.48-1.55l-2.4 2.42z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-[11px] leading-tight">TikTok Oficial</div>
                        <div className="text-[10px] text-gray-500 font-mono">@nolimits.cl</div>
                      </div>
                    </a>

                    {/* Botón con Ícono de Instagram */}
                    <a
                      href="https://instagram.com/nolimits.cl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="winxp-button text-xs py-2 px-3 justify-start font-bold text-gray-900 hover:text-pink-900 hover:bg-pink-50/50 cursor-pointer w-full flex items-center gap-2.5 border border-pink-300 shadow-xs"
                    >
                      <div className="w-5 h-5 rounded-sm bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Instagram className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-[11px] leading-tight">Instagram Oficial</div>
                        <div className="text-[10px] text-gray-500 font-mono">@nolimits.cl</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Pie de página con copyright y notas del sistema */}
              <div className="mt-3 pt-2.5 border-t border-gray-300 flex flex-wrap items-center justify-between text-[11px] text-gray-500 gap-2">
                <div>
                  © 2026 NoLimits Apparel Core. Todos los derechos reservados. Windows XP Luna Edition.
                </div>
                <div className="font-mono text-[10px] text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span>Conexión Segura Transbank Webpay Plus OK</span>
                </div>
              </div>
            </div>
          </div>
        )}

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
          </div>

          {/* Botón para expandir / contraer los contenidos corporativos */}
          <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className={`winxp-button text-[11px] h-6 py-0 px-2 flex items-center gap-1 font-semibold cursor-pointer ${
                isExpanded ? 'bg-blue-100 text-blue-950 border-blue-900 font-bold' : 'text-blue-900 border-blue-800'
              }`}
              title={isExpanded ? 'Minimizar información del footer' : 'Expandir información del footer'}
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-700" />
                  <span className="hidden sm:inline">Minimizar</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-blue-700" />
                  <span className="hidden sm:inline">Nosotros & Servicio al Cliente</span>
                </>
              )}
            </button>
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

      {/* Modal Ventana Informativa Windows XP al hacer clic en un botón corporativo (Renderizado en Portal al tope de toda la app) */}
      {activeModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-150 overflow-y-auto">
            <WindowFrame
              title={activeModal.title}
              icon={<PixelIcon name="info" size={16} />}
              showControls={true}
              onClose={() => setActiveModal(null)}
              statusBarText={activeModal.category}
              className="max-w-md w-full shadow-2xl my-auto"
            >
              <div className="p-2.5 space-y-3 max-h-[70vh] overflow-y-auto">
                {activeModal.content}
                <div className="flex justify-end pt-2 border-t border-gray-300">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900 cursor-pointer"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </WindowFrame>
          </div>,
          document.body
        )}

      {/* Modal de Contacto / WhatsApp cuando se abre desde el footer (Renderizado en Portal al tope de toda la app) */}
      {showContacto &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-150 overflow-y-auto">
            <ContactoWidget onClose={() => setShowContacto(false)} className="w-full max-w-md shadow-2xl my-auto" />
          </div>,
          document.body
        )}
    </>
  );
};
