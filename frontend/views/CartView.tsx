import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Store,
  Truck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  User,
  ShoppingBag,
  Info,
  Clock,
  X
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBranch } from '../context/BranchContext';
import { PixelIcon } from '../components/common/PixelIcon';
import { CheckoutCustomerData, Product } from '../types';

// Detectar si una categoría es de vestuario que usa tallas
const isApparelCategory = (categoryName?: string) => {
  if (!categoryName) return false;
  const c = categoryName.toLowerCase();
  return (
    c.includes('poleron') ||
    c.includes('hoodie') ||
    c.includes('chaqueta') ||
    c.includes('pantalon') ||
    c.includes('cargo') ||
    c.includes('polera') ||
    c.includes('top')
  );
};

// Determinar si una prenda debe mostrar talla (excluye cadenas, bolsos, accesorios sin tallas)
const hasApparelSize = (product: Product, size?: string) => {
  if (!product.sizes || product.sizes.length === 0) return false;
  if (!isApparelCategory(product.category)) return false;
  if (!size) return false;
  return true;
};

// Función para dar formato automático al RUT chileno con puntos y guion:
// - Solo permite números (hasta 9 números)
// - Inserta '.' cada 3 dígitos en el cuerpo y '-' antes del dígito verificador
export const formatRutNumbers = (rawDigits: string): string => {
  const digits = rawDigits.replace(/\D/g, '').slice(0, 9);
  if (!digits) return '';
  if (digits.length === 1) return digits;
  const dv = digits.slice(-1);
  const body = digits.slice(0, -1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${dv}`;
};

export const CartView: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount
  } = useCart();
  const { currentUser } = useAuth();
  const { branches, activeBranchId, setActiveBranchId } = useBranch();

  // Carga inicial o lectura desde localStorage (inyectando dirección predeterminada si existe)
  const [initialData] = useState<CheckoutCustomerData>(() => {
    let base: any = {};
    const saved = localStorage.getItem('nolimits_checkout_info');
    if (saved) {
      try {
        base = JSON.parse(saved);
      } catch {
        // ignore
      }
    }

    // Inyección de la dirección predeterminada configurada en el perfil
    let defaultAddr: any = null;
    const defaultAddrSaved = localStorage.getItem('nolimits_default_address');
    if (defaultAddrSaved) {
      try {
        defaultAddr = JSON.parse(defaultAddrSaved);
      } catch {
        // ignore
      }
    }

    return {
      customerFirstName: base.customerFirstName || 'Valeria',
      customerLastName: base.customerLastName || 'Gallardo',
      customerName: base.customerName || defaultAddr?.recipientName || currentUser.name || 'Valeria Gallardo',
      customerRut: base.customerRut || '198765432',
      customerPhone: base.customerPhone || defaultAddr?.phone?.replace('+56 ', '') || '9123 4567',
      customerEmail: base.customerEmail || (currentUser.email?.toLowerCase().endsWith('@gmail.com') ? currentUser.email : 'cliente@gmail.com'),
      deliveryMethod: base.deliveryMethod || 'pickup',
      selectedBranchId:
        base.selectedBranchId || (activeBranchId !== 'all' ? activeBranchId : branches[0]?.id || 'vina_del_mar'),
      shippingCountry: 'Chile',
      shippingComuna: defaultAddr?.comuna || base.shippingComuna || 'Viña del Mar',
      shippingStreet: defaultAddr?.street || base.shippingStreet || 'Av. Libertad',
      shippingNumber: defaultAddr?.number || base.shippingNumber || '1400',
      shippingNoNumber: base.shippingNoNumber || false,
      shippingApartment: defaultAddr?.apartment ?? base.shippingApartment ?? 'Depto 402',
      shippingPostalCode: defaultAddr?.postalCode || base.shippingPostalCode || '2520000',
      shippingNotes: defaultAddr?.notes ?? base.shippingNotes ?? '',
      shippingCourier: base.shippingCourier || 'Starken',
      shippingAddress: defaultAddr ? `${defaultAddr.street} ${defaultAddr.number}${defaultAddr.apartment ? ', ' + defaultAddr.apartment : ''}` : (base.shippingAddress || 'Av. Libertad 1400, Depto 402'),
      shippingCity: defaultAddr?.city || base.shippingCity || 'Viña del Mar',
    };
  });

  // PASO 1: Datos del Titular de la Compra
  // Nombres y Apellidos separados (sin caracteres especiales para prevenir inyección SQL)
  const [customerFirstName, setCustomerFirstName] = useState(() => {
    if (initialData.customerFirstName) {
      return initialData.customerFirstName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    }
    const full = (initialData.customerName || currentUser.name || 'Valeria').trim();
    const parts = full.split(/\s+/);
    return (parts[0] || 'Valeria').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  });

  const [customerLastName, setCustomerLastName] = useState(() => {
    if (initialData.customerLastName) {
      return initialData.customerLastName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    }
    const full = (initialData.customerName || currentUser.name || '').trim();
    const parts = full.split(/\s+/);
    const rest = parts.slice(1).join(' ') || 'Gallardo';
    return rest.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  });

  // RUT: solo números (límite 9 números), formato automático con '.' y '-'
  const [customerRutDigits, setCustomerRutDigits] = useState(() => {
    const raw = (initialData.customerRut || '198765432').replace(/\D/g, '');
    return raw.slice(0, 9);
  });

  // Teléfono: solo dígitos numéricos (máximo 8 dígitos, con espacio tras los primeros 4)
  // El prefijo +56 9 es fijo e inmutable en la interfaz
  const [customerPhoneDigits, setCustomerPhoneDigits] = useState(() => {
    const raw = (initialData.customerPhone || '').replace(/\+56\s*9/g, '').replace(/\D/g, '');
    return raw.slice(0, 8);
  });
  const [customerEmail, setCustomerEmail] = useState(
    initialData.customerEmail || 'cliente@gmail.com'
  );
  // Mensaje de error para correo que solo se activa al presionar "Proceder con el Pago"
  const [emailError, setEmailError] = useState<string>('');

  // Validación de correo: debe ser real y terminar estrictamente con @gmail.com
  const isGmailValid = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    return (
      trimmed.endsWith('@gmail.com') &&
      trimmed.length > '@gmail.com'.length &&
      !trimmed.includes(' ') &&
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(trimmed)
    );
  };

  // RUT con máscara automática
  const formattedRut = formatRutNumbers(customerRutDigits);

  // Nombre completo unificado para compatibilidad
  const customerName = `${customerFirstName.trim()} ${customerLastName.trim()}`.trim();

  // Formato visual de los 8 dígitos del teléfono: "1234 5678"
  const formattedPhoneDigits =
    customerPhoneDigits.length > 4
      ? `${customerPhoneDigits.slice(0, 4)} ${customerPhoneDigits.slice(4)}`
      : customerPhoneDigits;

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // No permitir caracteres especiales (solo letras, espacios, acentos)
    const sanitized = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    setCustomerFirstName(sanitized);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // No permitir caracteres especiales (solo letras, espacios, acentos)
    const sanitized = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    setCustomerLastName(sanitized);
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números y máximo 9 dígitos (el límite de un RUT)
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 9);
    setCustomerRutDigits(digitsOnly);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números y máximo 8 dígitos
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCustomerPhoneDigits(digitsOnly);
  };

  // PASO 2: Selección de Nodo de Retiro o Envío
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'shipping'>(
    initialData.deliveryMethod
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    initialData.selectedBranchId ||
      (activeBranchId !== 'all' ? activeBranchId : branches[0]?.id || 'vina_del_mar')
  );

  // Formulario Despacho a Domicilio
  const [shippingCountry] = useState<string>('Chile'); // Fijo: Chile
  const [shippingComuna, setShippingComuna] = useState<string>(
    initialData.shippingComuna || initialData.shippingCity || 'Viña del Mar'
  );
  const [shippingStreet, setShippingStreet] = useState<string>(
    initialData.shippingStreet || 'Av. Libertad'
  );
  const [shippingNumber, setShippingNumber] = useState<string>(
    initialData.shippingNumber || '1400'
  );
  const [shippingNoNumber, setShippingNoNumber] = useState<boolean>(
    initialData.shippingNoNumber || false
  );
  const [shippingApartment, setShippingApartment] = useState<string>(
    initialData.shippingApartment || 'Depto 402'
  );
  const [shippingPostalCode, setShippingPostalCode] = useState<string>(
    (initialData.shippingPostalCode || '2520000').replace(/\D/g, '').slice(0, 7)
  );
  const [shippingNotes, setShippingNotes] = useState<string>(
    initialData.shippingNotes || ''
  );
  const [shippingCourier, setShippingCourier] = useState<
    'Starken' | 'bluexpress' | 'Paket' | 'Paket '
  >((initialData.shippingCourier as any) || 'Starken');

  // Solo dígitos para código postal
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 7);
    setShippingPostalCode(onlyDigits);
  };

  // Mensaje de validación
  const [errorMessage, setErrorMessage] = useState<string>('');
  // Modal/tooltip explicativo de retiro en sucursal
  const [showPickupInfo, setShowPickupInfo] = useState<boolean>(false);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  // Horarios de retiro por sucursal
  const BRANCH_HOURS: Record<string, string> = {
    vina_del_mar: 'hora de retiro entre 10:00 hasta 20:30 hrs',
    valparaiso: 'hora de retiro entre 10:30 hasta 19:30 hrs',
    quilpue: 'hora de retiro entre 11:00 hasta 20:00 hrs',
  };
  const selectedBranchHours =
    BRANCH_HOURS[selectedBranch?.id || ''] || 'hora de retiro entre 10:00 hasta 20:00 hrs';

  // El costo de despacho no se cobra en el carro ya que lo determina la empresa de despacho
  const finalTotal = Math.max(0, subtotal - discount);

  // Teléfono completo para guardado (+56 9 XXXX XXXX)
  const fullPhoneNumber = customerPhoneDigits
    ? `+56 9 ${formattedPhoneDigits}`
    : '';

  // Dirección calculada para resumen y compatibilidad
  const calculatedNumberStr = shippingNoNumber ? 'S/N' : shippingNumber.trim();
  const calculatedShippingAddress = `${shippingStreet.trim()} ${calculatedNumberStr}${
    shippingApartment.trim() ? `, ${shippingApartment.trim()}` : ''
  }`.trim();

  // Sincronizar automáticamente en localStorage
  useEffect(() => {
    try {
      const payload: CheckoutCustomerData = {
        customerName,
        customerFirstName,
        customerLastName,
        customerRut: formattedRut,
        customerPhone: fullPhoneNumber,
        customerEmail,
        deliveryMethod,
        selectedBranchId,
        shippingCountry,
        shippingComuna,
        shippingStreet,
        shippingNumber,
        shippingNoNumber,
        shippingApartment,
        shippingPostalCode,
        shippingNotes,
        shippingCourier,
        shippingAddress: calculatedShippingAddress,
        shippingCity: shippingComuna,
      };
      localStorage.setItem('nolimits_checkout_info', JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [
    customerName,
    customerFirstName,
    customerLastName,
    formattedRut,
    fullPhoneNumber,
    customerEmail,
    deliveryMethod,
    selectedBranchId,
    shippingCountry,
    shippingComuna,
    shippingStreet,
    shippingNumber,
    shippingNoNumber,
    shippingApartment,
    shippingPostalCode,
    shippingNotes,
    shippingCourier,
    calculatedShippingAddress,
  ]);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    setActiveBranchId(branchId);
  };

  // Botón "Proceder con el Pago": valida datos de Paso 1 y Paso 2 y navega a la pasarela de pago (/checkout)
  const handleProceedToPayment = () => {
    setErrorMessage('');
    setEmailError('');

    if (!customerFirstName.trim()) {
      setErrorMessage('Falta ingresar los Nombres en el PASO 1.');
      return;
    }
    if (!customerLastName.trim()) {
      setErrorMessage('Falta ingresar los Apellidos en el PASO 1.');
      return;
    }
    if (customerRutDigits.length < 7) {
      setErrorMessage('Falta ingresar el RUT del titular (mínimo 7 números) en el PASO 1.');
      return;
    }
    if (customerPhoneDigits.length < 8) {
      setErrorMessage('El Teléfono debe tener los 8 dígitos requeridos después de +56 9.');
      return;
    }
    if (!customerEmail.trim()) {
      setEmailError('correo invalido');
      setErrorMessage('correo invalido: falta ingresar el correo electrónico en el PASO 1.');
      return;
    }
    if (!isGmailValid(customerEmail)) {
      setEmailError('correo invalido');
      setErrorMessage('correo invalido (debe terminar con @gmail.com).');
      return;
    }
    if (deliveryMethod === 'shipping') {
      if (!shippingComuna.trim()) {
        setErrorMessage('Falta ingresar la Comuna en el formulario de despacho.');
        return;
      }
      if (!shippingStreet.trim()) {
        setErrorMessage('Falta ingresar la Calle en el formulario de despacho.');
        return;
      }
      if (!shippingNoNumber && !shippingNumber.trim()) {
        setErrorMessage('Falta ingresar el Número de la calle (o marca la opción "Calle sin número").');
        return;
      }
      if (!shippingCourier) {
        setErrorMessage('Falta seleccionar el Método de envío (Starken, bluexpress o Paket).');
        return;
      }
    }

    // Guardar los datos confirmados antes de navegar
    const payload: CheckoutCustomerData = {
      customerName: customerName.trim(),
      customerFirstName: customerFirstName.trim(),
      customerLastName: customerLastName.trim(),
      customerRut: formattedRut,
      customerPhone: fullPhoneNumber,
      customerEmail: customerEmail.trim(),
      deliveryMethod,
      selectedBranchId,
      shippingCountry,
      shippingComuna: shippingComuna.trim(),
      shippingStreet: shippingStreet.trim(),
      shippingNumber: shippingNumber.trim(),
      shippingNoNumber,
      shippingApartment: shippingApartment.trim(),
      shippingPostalCode: shippingPostalCode.trim(),
      shippingNotes: shippingNotes.trim(),
      shippingCourier,
      shippingAddress: calculatedShippingAddress,
      shippingCity: shippingComuna.trim(),
    };
    localStorage.setItem('nolimits_checkout_info', JSON.stringify(payload));

    // Redirigir a la página de checkout / pasarela de pago
    navigate('/checkout');
  };

  // Carro Vacío
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8 font-sans">
        <WindowFrame
          title="Carro_Vacio.exe - [No hay prendas seleccionadas]"
          icon={<PixelIcon name="cart" size={16} />}
          statusBarText="ELEMENTOS: 0 // TOTAL: $0 CLP"
        >
          <div className="text-center py-8 space-y-3">
            <div className="flex justify-center">
              <PixelIcon name="cart" size={48} />
            </div>
            <h2 className="text-base font-bold text-gray-800">
              El carro de compras está actualmente vacío
            </h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Aún no has agregado ninguna prenda del catálogo. Explora la colección para asegurar tu talla antes de que se agote el stock físico.
            </p>
            <div className="pt-2">
              <Link to="/catalog">
                <button
                  type="button"
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900"
                >
                  <PixelIcon name="search" size={14} />
                  <span>Ir al Catálogo de Prendas</span>
                </button>
              </Link>
            </div>
          </div>
        </WindowFrame>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans max-w-6xl mx-auto">
      <WindowFrame
        title="Asistente_de_Compra.exe - [Carrito de Compras]"
        icon={<PixelIcon name="cart" size={16} />}
        statusBarText={`PRENDAS EN ORDEN: ${items.length} // SUCURSALES Y DESPACHO CENTRALIZADO`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ===============================================================
              COLUMNA IZQUIERDA: LISTA DE PRENDAS SELECCIONADAS (Col 1-7)
              =============================================================== */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              {/* Encabezado con PRENDA SELECCIONADA (#) y botón Continuar Explorando Catálogo a su derecha */}
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-300 text-xs font-bold text-gray-700 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-blue-700" />
                    <span>PRENDA SELECCIONADA ({items.length})</span>
                  </span>
                  <Link to="/catalog">
                    <button
                      type="button"
                      className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1.5 font-semibold cursor-pointer"
                      title="Explorar el catálogo"
                    >
                      <PixelIcon name="search" size={13} />
                      <span>Continuar Explorando Catálogo</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Contenedor con desplazamiento para las prendas seleccionadas */}
              <div className="max-h-[460px] md:max-h-[520px] winxp-scroll-container border border-gray-300 bg-white p-2 space-y-2 rounded-xs shadow-inner">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                    className="p-2.5 bg-gray-50 hover:bg-blue-50/40 transition-colors border border-gray-300 flex items-center justify-between gap-3 text-xs"
                  >
                    {/* Foto miniatura vinculada a la página de detalle */}
                    <Link
                      to={`/product/${item.product.id}`}
                      className="shrink-0 group block cursor-pointer"
                      title={`Ver detalles de ${item.product.title}`}
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-14 h-14 object-cover border border-gray-400 bg-white group-hover:border-blue-600 transition-colors"
                      />
                    </Link>

                    {/* Datos del producto */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-bold text-gray-900 truncate block hover:text-blue-700 hover:underline cursor-pointer"
                        title={item.product.title}
                      >
                        {item.product.title}
                      </Link>

                      {/* Talla: visible únicamente en prendas/productos que tienen talla */}
                      {hasApparelSize(item.product, item.selectedSize) && (
                        <div className="text-[11px] text-gray-600 mt-0.5">
                          <span>
                            Talla: <strong className="text-gray-900">{item.selectedSize}</strong>
                          </span>
                        </div>
                      )}

                      {/* Precio por unidad y Subtotal a su derecha */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] text-blue-900 font-bold">
                          ${(item.product.salePrice ?? item.product.price).toLocaleString('es-CL')} c/u
                        </span>
                        <span className="text-gray-300 text-[11px]">|</span>
                        <span className="text-[11px] text-gray-700">
                          Subtotal:{' '}
                          <strong className="text-red-700 font-mono font-bold">
                            ${((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString('es-CL')}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Controles de Cantidad con iconos "-" y "+" claros y definidos junto al botón Quitar */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-white border border-gray-300 px-1.5 py-0.5 rounded shadow-xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          disabled={item.quantity <= 1}
                          className="winxp-qty-button group disabled:opacity-40 disabled:cursor-not-allowed"
                          title={
                            item.quantity <= 1
                              ? "Mínimo 1 prenda (para eliminar usa el botón 'Quitar')"
                              : "Restar prenda (-)"
                          }
                          aria-label="Restar una prenda (-)"
                        >
                          <Minus
                            size={15}
                            strokeWidth={3.5}
                            className={`pointer-events-none transition-colors ${
                              item.quantity <= 1
                                ? 'text-gray-400'
                                : 'text-gray-900 group-hover:text-red-700'
                            }`}
                          />
                        </button>
                        <span className="w-7 text-center font-bold font-mono text-xs text-gray-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="winxp-qty-button group"
                          title="Sumar prenda (+)"
                          aria-label="Sumar una prenda (+)"
                        >
                          <Plus size={15} strokeWidth={3.5} className="text-gray-900 group-hover:text-green-700 pointer-events-none transition-colors" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Quitar prenda del carro"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span className="hidden sm:inline">Quitar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===============================================================
              COLUMNA DERECHA: RESUMEN DE COMPRA + PASO 1 + PASO 2 (Col 8-12)
              =============================================================== */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. RESUMEN DE COMPRA CON BOTÓN "Proceder con el Pago" */}
            <div className="bg-[#f8fafc] border border-gray-400 p-3 space-y-3 winxp-bevel-out">
              <h3 className="font-bold text-xs text-blue-900 pb-1.5 border-b border-gray-300">
                RESUMEN DE COMPRA
              </h3>

              <div className="space-y-1.5 text-xs text-gray-700 bg-white border border-gray-300 p-2.5">
                <div className="flex justify-between">
                  <span>Subtotal prendas:</span>
                  <span className="font-mono">${subtotal.toLocaleString('es-CL')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Descuentos aplicados:</span>
                    <span className="font-mono">-${discount.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Modalidad de entrega:</span>
                  <span className="font-semibold text-blue-900">
                    {deliveryMethod === 'pickup' ? 'Retiro en Sucursal' : 'Envío a Domicilio'}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-1.5 flex justify-between font-bold text-sm text-gray-900">
                  <span>Total a pagar:</span>
                  <span className="text-red-700 font-mono text-base">
                    ${finalTotal.toLocaleString('es-CL')} CLP
                  </span>
                </div>
              </div>

              {/* Mensaje de validación si faltan datos */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-300 p-2 text-xs text-red-800 flex items-center gap-1.5 rounded-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-semibold">{errorMessage}</span>
                </div>
              )}

              {/* BOTÓN REQUERIDO: "Proceder con el Pago" */}
              <div>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="winxp-button winxp-button-primary text-xs py-2.5 w-full font-bold text-blue-900 shadow-md flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <span className="tracking-wide">Proceder con el Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] text-gray-500 text-center leading-tight">
                🔒 Al presionar este botón serás redirigido a la <strong>Pasarela Oficial de Pago Webpay</strong> (Paso 3).
              </div>
            </div>

            {/* 2. PASO 1: DATOS DEL TITULAR DE LA COMPRA (Ubicado debajo del resumen de compra) */}
            <div className="border border-gray-400 bg-white p-3 space-y-2.5 winxp-bevel-out text-xs">
              <div className="font-bold text-blue-900 pb-1 border-b border-gray-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-700" />
                <span>PASO 1: DATOS DEL TITULAR DE LA COMPRA</span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Nombres y Apellidos separados (sin caracteres especiales para evitar inyección SQL) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-0.5">
                      Nombres:
                    </label>
                    <input
                      type="text"
                      value={customerFirstName}
                      onChange={handleFirstNameChange}
                      placeholder="Ej. Valeria"
                      className="winxp-input w-full text-xs py-1 px-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-0.5">
                      Apellidos:
                    </label>
                    <input
                      type="text"
                      value={customerLastName}
                      onChange={handleLastNameChange}
                      placeholder="Ej. Gallardo Contreras"
                      className="winxp-input w-full text-xs py-1 px-2"
                      required
                    />
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 font-mono -mt-1.5">
                  (Solo letras y espacios, sin caracteres especiales para evitar inyección SQL)
                </div>

                {/* 2. Campo RUT (solo números, formato automático con '.' y '-', límite de 9 números) */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[11px] font-semibold text-gray-700">
                      RUT:
                    </label>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {customerRutDigits.length}/9 números
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formattedRut}
                    onChange={handleRutChange}
                    placeholder="Ej. 12.345.678-9"
                    maxLength={12}
                    className="winxp-input w-full text-xs py-1 px-2 font-mono tracking-wider focus:outline-none"
                    required
                  />
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    (Solo números, puntos y guion se agregan de manera automática)
                  </div>
                </div>

                {/* 2. Teléfono (+56 9 fijo y no borrable, solo números, espacio automático a los 4 dígitos, máx 8 números) */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[11px] font-semibold text-gray-700">
                      Teléfono:
                    </label>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {customerPhoneDigits.length}/8 dígitos
                    </span>
                  </div>
                  <div className="flex items-stretch">
                    <span className="inline-flex items-center px-2 text-xs font-mono font-bold text-gray-700 bg-gray-200 border border-r-0 border-gray-400 select-none">
                      +56 9
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={formattedPhoneDigits}
                      onChange={handlePhoneChange}
                      placeholder="1234 5678"
                      maxLength={9} // 8 dígitos + 1 espacio
                      className="winxp-input flex-1 text-xs py-1 px-2 font-mono tracking-wider focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* 3. Correo electrónico (debe terminar con @gmail.com) */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[11px] font-semibold text-gray-700">
                      Correo electrónico:
                    </label>
                  </div>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (emailError) {
                        setEmailError('');
                      }
                      if (errorMessage.toLowerCase().includes('correo')) {
                        setErrorMessage('');
                      }
                    }}
                    placeholder="ejemplo@gmail.com"
                    className={`winxp-input w-full text-xs py-1 px-2 ${
                      emailError
                        ? 'border-red-500 bg-red-50/50 text-red-950 focus:border-red-600'
                        : ''
                    }`}
                    required
                  />
                  {emailError && (
                    <div className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{emailError} (debe terminar con @gmail.com)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. PASO 2: SELECCIONA EL NODO DE RETIRO O ENVÍO (Ubicado debajo del Paso 1) */}
            <div className="border border-gray-400 bg-white p-3 space-y-2.5 winxp-bevel-out text-xs">
              <div className="flex items-center gap-1.5 pb-1 border-b border-gray-300">
                <Store className="w-3.5 h-3.5 text-blue-700" />
                <h3 className="font-bold text-xs text-blue-900">
                  PASO 2: SELECCIONA EL NODO DE RETIRO O ENVÍO
                </h3>
              </div>

              {/* Selector de Modalidad (Retiro en Sucursal vs Envío a Domicilio) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-2 text-left border flex items-start gap-2 transition-all cursor-pointer ${
                    deliveryMethod === 'pickup'
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-500 font-semibold'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Store
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      deliveryMethod === 'pickup' ? 'text-blue-700' : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-1">
                      <span>Retiro en Sucursal</span>
                      <span className="text-[9px] bg-green-100 text-green-800 px-1 py-0.2 rounded font-bold">
                        ¡GRATIS!
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      Viña del Mar, Valparaíso o Quilpué
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('shipping')}
                  className={`p-2 text-left border flex items-start gap-2 transition-all cursor-pointer ${
                    deliveryMethod === 'shipping'
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-500 font-semibold'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Truck
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      deliveryMethod === 'shipping' ? 'text-blue-700' : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-1">
                      <span>Despacho a Domicilio</span>
                    </div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      Starken / bluexpress / Paket
                    </div>
                  </div>
                </button>
              </div>

              {/* Si eligió Retiro en Sucursal: Selector de Sucursales */}
              {deliveryMethod === 'pickup' ? (
                <div className="bg-[#f2f7fc] border border-[#a0c5e8] p-2.5 rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-blue-950 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-700" />
                      Elige la sucursal física:
                    </span>
                    {/* Icono de información en lugar de la etiqueta $0 CLP */}
                    <button
                      type="button"
                      onClick={() => setShowPickupInfo(!showPickupInfo)}
                      className="inline-flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 bg-white border border-blue-300 hover:border-blue-500 px-1.5 py-0.5 rounded shadow-2xs font-semibold cursor-pointer transition-colors"
                      title="Información sobre retiro presencial"
                      aria-label="Información sobre retiro presencial"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                      <span>Info retiro</span>
                    </button>
                  </div>

                  {/* Panel explicativo cuando se hace click en el icono de información */}
                  {showPickupInfo && (
                    <div className="bg-amber-50 border border-amber-300 text-amber-950 p-2 rounded text-[11px] relative flex items-start gap-2 shadow-xs">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="pr-5 leading-relaxed">
                        <strong className="block text-amber-900 font-bold mb-0.5">
                          ¿Cómo funciona el Retiro en Sucursal?
                        </strong>
                        Estás eligiendo la sucursal física donde tú o la persona autorizada irá a recoger los productos de manera presencial al lugar seleccionado, sin costo adicional de envío.
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPickupInfo(false)}
                        className="absolute top-1.5 right-1.5 text-amber-600 hover:text-amber-900 p-0.5 rounded hover:bg-amber-100"
                        title="Cerrar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {branches.map((branch) => {
                      const isSelected = selectedBranchId === branch.id;
                      return (
                        <div
                          key={branch.id}
                          onClick={() => handleBranchChange(branch.id)}
                          className={`p-2 border cursor-pointer text-xs transition-all ${
                            isSelected
                              ? 'bg-white border-blue-700 shadow-sm ring-2 ring-blue-400'
                              : 'bg-white/80 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-0.5">
                            <span className="font-bold text-blue-900 text-[11px]">
                              {branch.city}
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedBranch && (
                    <div className="bg-white border border-gray-300 p-2 text-[11px] space-y-1.5 text-gray-700">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        <span>
                          Retiro en: <strong>{selectedBranch.name}</strong>
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-600 pl-4.5">
                        {selectedBranch.address}
                      </div>
                      {/* Horario de retiro para la sucursal seleccionada */}
                      <div className="flex items-center gap-1.5 text-[10px] text-blue-900 bg-blue-50 border border-blue-200 px-2 py-1 rounded-xs font-medium">
                        <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>
                          {selectedBranchHours}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Si eligió Despacho a Domicilio: Formulario completo + Métodos de envío */
                <div className="bg-[#f8fafc] border border-gray-300 p-3 rounded-sm space-y-3 text-xs">
                  {/* Encabezado del Formulario */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                    <div className="font-bold text-gray-900 text-[11px] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-700" />
                      <span>Formulario de Despacho a Domicilio</span>
                    </div>
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                      Envíos a todo Chile
                    </span>
                  </div>

                  {/* Campos del Formulario */}
                  <div className="space-y-2.5">
                    {/* 1. País: Fija opción 'Chile' (solo envíos nacionales) */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                        País <span className="text-gray-400 font-normal">(Fijo - Envíos nacionales únicamente)</span>
                      </label>
                      <div className="flex items-center justify-between bg-gray-100 border border-gray-300 px-2.5 py-1.5 rounded-xs text-xs text-gray-800 select-none">
                        <div className="flex items-center gap-1.5 font-semibold text-blue-950">
                          <span className="text-sm">🇨🇱</span>
                          <span>Chile</span>
                        </div>
                        <span className="text-[10px] text-gray-500 italic">
                          Envíos exclusivos a nivel nacional
                        </span>
                      </div>
                    </div>

                    {/* 2. Comuna (Campo obligatorio) */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                        Comuna <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingComuna}
                        onChange={(e) => setShippingComuna(e.target.value)}
                        className="winxp-input w-full text-xs py-1.5 px-2 bg-white"
                        placeholder="Ej: Viña del Mar, Valparaíso, Providencia, etc."
                        required
                      />
                    </div>

                    {/* 3. Calle (obligatorio) y 4. Número (con opción 'Calle sin número') */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-7">
                        <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                          Calle <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={shippingStreet}
                          onChange={(e) => setShippingStreet(e.target.value)}
                          className="winxp-input w-full text-xs py-1.5 px-2 bg-white"
                          placeholder="Ej: Av. Libertad, Los Alerces, San Martín"
                          required
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="text-[10px] font-bold text-gray-700">
                            Número {!shippingNoNumber && <span className="text-red-600">*</span>}
                          </label>
                          <label className="text-[10px] text-blue-800 flex items-center gap-1 cursor-pointer select-none hover:text-blue-900 font-medium">
                            <input
                              type="checkbox"
                              checked={shippingNoNumber}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setShippingNoNumber(checked);
                                if (checked) {
                                  setShippingNumber('');
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-0 cursor-pointer w-3 h-3"
                            />
                            <span>Calle sin número</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          value={shippingNoNumber ? 'S/N (Sin número)' : shippingNumber}
                          onChange={(e) => {
                            if (!shippingNoNumber) {
                              setShippingNumber(e.target.value);
                            }
                          }}
                          disabled={shippingNoNumber}
                          className={`winxp-input w-full text-xs py-1.5 px-2 ${
                            shippingNoNumber
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed italic font-medium'
                              : 'bg-white'
                          }`}
                          placeholder={shippingNoNumber ? 'Sin número' : 'Ej: 1400'}
                        />
                      </div>
                    </div>

                    {/* 5. Departamento/oficina/casa/etc (Campo opcional) */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                        Departamento / Oficina / Casa / etc.{' '}
                        <span className="text-gray-400 font-normal">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={shippingApartment}
                        onChange={(e) => setShippingApartment(e.target.value)}
                        className="winxp-input w-full text-xs py-1.5 px-2 bg-white"
                        placeholder="Ej: Depto 502, Torre B, Casa 14, Oficina 301"
                      />
                    </div>

                    {/* 6. Código postal (Campo opcional, pero solo permite números) */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                        Código postal{' '}
                        <span className="text-gray-400 font-normal">(Opcional - solo números)</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={shippingPostalCode}
                        onChange={handlePostalCodeChange}
                        className="winxp-input w-full text-xs py-1.5 px-2 bg-white font-mono"
                        placeholder="Ej: 2520000"
                        maxLength={7}
                      />
                    </div>

                    {/* 7. Indicaciones (Campo opcional) */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                        Indicaciones{' '}
                        <span className="text-gray-400 font-normal">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={shippingNotes}
                        onChange={(e) => setShippingNotes(e.target.value)}
                        className="winxp-input w-full text-xs py-1.5 px-2 bg-white"
                        placeholder="Ej: Dejar en conserjería, timbre blanco, portón negro, entre calles..."
                      />
                    </div>
                  </div>

                  {/* Abajo del formulario: Métodos de envío con las 3 opciones requeridas */}
                  <div className="pt-2.5 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-gray-900 text-[11px] flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-blue-700" />
                        Métodos de envío:
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Selecciona el courier para tu despacho
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: 'Starken' as const,
                          name: 'Starken',
                          desc: 'Cobertura nacional en todo Chile',
                          badge: 'Agencias y Domicilio',
                        },
                        {
                          id: 'bluexpress' as const,
                          name: 'bluexpress',
                          desc: 'Distribución express y seguimiento',
                          badge: 'Red Express',
                        },
                        {
                          id: 'Paket ' as const,
                          name: 'Paket ',
                          desc: 'Despacho urbano y regional',
                          badge: 'Entrega Rápida',
                        },
                      ].map((courier) => {
                        const isSelected = shippingCourier === courier.id;
                        return (
                          <div
                            key={courier.id}
                            onClick={() => setShippingCourier(courier.id)}
                            className={`p-2 rounded border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-400 shadow-xs'
                                : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-bold ${
                                  isSelected ? 'text-blue-900' : 'text-gray-800'
                                }`}
                              >
                                {courier.name}
                              </span>
                              <input
                                type="radio"
                                name="shippingCourier"
                                checked={isSelected}
                                onChange={() => setShippingCourier(courier.id)}
                                className="w-3.5 h-3.5 text-blue-600 focus:ring-0 cursor-pointer"
                              />
                            </div>
                            <div className="text-[9.5px] text-gray-500 mt-1 line-clamp-1">
                              {courier.desc}
                            </div>
                            <div className="mt-1 text-[8.5px] font-mono font-bold text-blue-800 bg-blue-100/70 px-1.5 py-0.5 rounded inline-block">
                              {courier.badge}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};

export default CartView;
