import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Store,
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText
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

const hasApparelSize = (product: Product, size?: string) => {
  if (!product.sizes || product.sizes.length === 0) return false;
  if (!isApparelCategory(product.category)) return false;
  if (!size) return false;
  return true;
};

export const CheckoutView: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { branches } = useBranch();

  // Carga de datos del titular y despacho guardados en el Carrito
  const [checkoutData] = useState<CheckoutCustomerData>(() => {
    const saved = localStorage.getItem('nolimits_checkout_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      customerName: currentUser.name || 'Valeria Gallardo',
      customerPhone: '+56 9 9123 4567',
      customerEmail: currentUser.email || 'cliente@nolimits.cl',
      deliveryMethod: 'pickup',
      selectedBranchId: 'vina_del_mar',
      shippingCountry: 'Chile',
      shippingComuna: 'Viña del Mar',
      shippingStreet: 'Av. Libertad',
      shippingNumber: '1400',
      shippingCourier: 'Starken',
      shippingAddress: 'Av. Libertad 1400, Depto 402',
      shippingCity: 'Viña del Mar',
    };
  });

  // Método de tarjeta seleccionado en Webpay
  const [selectedCardType, setSelectedCardType] = useState<'debito' | 'credito' | 'prepago'>('debito');
  const [selectedInstallments, setSelectedInstallments] = useState<number>(1);

  // Estado de éxito tras pago
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedBranch =
    branches.find((b) => b.id === checkoutData.selectedBranchId) || branches[0];

  // El costo de despacho lo determina la empresa de despacho, no se cobra en el pago online
  const finalTotal = Math.max(0, subtotal - discount);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderNumber = `NL-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrderId(orderNumber);
      setIsProcessing(false);
      clearCart();
    }, 1200);
  };

  // Si el pago ya fue aprobado exitosamente
  if (confirmedOrderId) {
    return (
      <div className="max-w-2xl mx-auto py-6 font-sans">
        <WindowFrame
          title="Pasarela_Webpay_Plus.exe - [Transacción Aprobada Exitosamente]"
          icon={<PixelIcon name="windows-flag" size={16} />}
          statusBarText="WEBPAY AUTH CODE: 200_OK // STOCK DESCONTADO EN TIEMPO REAL"
        >
          <div className="text-center py-6 px-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-green-100 border-2 border-green-600 text-green-700">
              <ShieldCheck className="w-12 h-12" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-green-800 bg-green-100 px-2.5 py-0.5 rounded border border-green-400">
                Pago Procesado Correctamente con Webpay
              </span>
              <h2 className="text-xl font-bold text-blue-900 mt-2">
                ¡ORDEN CONFIRMADA CON ÉXITO!
              </h2>
              <p className="text-xs text-gray-700 max-w-md mx-auto mt-1">
                Número de Orden:{' '}
                <span className="text-blue-800 font-mono font-bold text-sm">
                  {confirmedOrderId}
                </span>
              </p>
            </div>

            {/* Tarjeta de Destino / Sucursal de Retiro */}
            <div className="bg-white border-2 border-[#7eaadb] winxp-bevel-in p-3.5 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="font-bold text-blue-900 flex items-center gap-1.5 border-b border-gray-300 pb-1.5">
                {checkoutData.deliveryMethod === 'pickup' ? (
                  <>
                    <Store className="w-4 h-4 text-blue-700" />
                    <span>SUCURSAL FÍSICA SELECCIONADA PARA RETIRO</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-blue-700" />
                    <span>DATOS DE ENVÍO A DOMICILIO</span>
                  </>
                )}
              </div>

              {checkoutData.deliveryMethod === 'pickup' && selectedBranch ? (
                <div className="space-y-1 text-gray-800">
                  <div className="font-bold text-sm text-gray-900">
                    {selectedBranch.name}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>
                      {selectedBranch.address}, {selectedBranch.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Horario: Lunes a Sábado de 11:00 a 20:00 hrs</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>
                      Jefe de Sucursal: {selectedBranch.managerName} ({selectedBranch.phone})
                    </span>
                  </div>
                  <div className="mt-2 bg-green-50 border border-green-300 p-2 text-[11px] text-green-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                    <span>
                      Tu pedido estará preparado para retiro en{' '}
                      <strong>15 minutos</strong> con tu cédula o RUT.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-gray-800">
                  <div>
                    <strong>Destinatario:</strong> {checkoutData.customerName}
                  </div>
                  <div>
                    <strong>Teléfono:</strong> {checkoutData.customerPhone}
                  </div>
                  <div>
                    <strong>Dirección:</strong> {checkoutData.shippingAddress},{' '}
                    {checkoutData.shippingCity}
                  </div>
                  <div>
                    <strong>Courier Asignado:</strong> {checkoutData.shippingCourier || 'Starken'} (Tracking enviado a{' '}
                    {checkoutData.customerEmail})
                  </div>
                  {checkoutData.shippingNotes && (
                    <div className="text-[11px] text-gray-600 bg-gray-50 p-1 rounded border border-gray-200 mt-1">
                      <strong>Indicaciones:</strong> {checkoutData.shippingNotes}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resumen de Transacción Webpay */}
            <div className="bg-gray-100 border border-gray-400 p-3 max-w-md mx-auto text-left text-xs space-y-1">
              <div className="font-bold text-gray-800">
                Comprobante Transbank Webpay Plus:
              </div>
              <div className="flex justify-between">
                <span>Titular:</span>
                <span className="font-semibold">{checkoutData.customerName}</span>
              </div>
              {checkoutData.customerRut && (
                <div className="flex justify-between">
                  <span>RUT:</span>
                  <span className="font-mono font-semibold">{checkoutData.customerRut}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Medio de Pago:</span>
                <span>
                  Webpay Plus (
                  {selectedCardType === 'debito'
                    ? 'Redcompra Débito'
                    : selectedCardType === 'credito'
                    ? `Crédito (${selectedInstallments} cuota${selectedInstallments > 1 ? 's' : ''})`
                    : 'Prepago Digital'}
                  )
                </span>
              </div>
              <div className="flex justify-between font-bold text-blue-900 pt-1 border-t border-gray-300">
                <span>Monto Pagado:</span>
                <span className="text-red-700 font-mono">
                  ${finalTotal.toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link to="/catalog">
                <button
                  type="button"
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900"
                >
                  <PixelIcon name="search" size={14} />
                  <span>Volver al Catálogo de Prendas</span>
                </button>
              </Link>
            </div>
          </div>
        </WindowFrame>
      </div>
    );
  }

  // Si no hay prendas en el carro
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8 font-sans">
        <WindowFrame
          title="Pasarela_Webpay_Plus.exe - [No hay prendas en la orden]"
          icon={<PixelIcon name="cart" size={16} />}
          statusBarText="CHECKOUT // CARRITO SIN ELEMENTOS"
        >
          <div className="text-center py-8 space-y-3">
            <div className="flex justify-center">
              <PixelIcon name="cart" size={48} />
            </div>
            <h2 className="text-base font-bold text-gray-800">
              No hay prendas disponibles para procesar el pago
            </h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Tu carro de compras no tiene prendas pendientes. Vuelve al carrito o explora el catálogo para seleccionar tus prendas.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/cart">
                <button
                  type="button"
                  className="winxp-button text-xs py-1.5 px-4 font-semibold text-gray-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ir al Carrito de Compras</span>
                </button>
              </Link>
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
    <div className="space-y-4 font-sans max-w-5xl mx-auto">
      {/* Barra de progreso de compra Windows XP */}
      <div className="bg-white border border-gray-400 p-2 winxp-bevel-out flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="flex items-center gap-1 text-blue-700 hover:underline font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Carrito</span>
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">Paso 1: Datos</span>
          <span className="text-gray-300">→</span>
          <span className="text-gray-500">Paso 2: Despacho / Retiro</span>
          <span className="text-gray-300">→</span>
          <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
            PASO 3: RESUMEN DE COMPRA & PAGO
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-green-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Webpay Seguro Transbank</span>
        </div>
      </div>

      <WindowFrame
        title="Pasarela_de_Pago.exe - [PASO 3: RESUMEN DE COMPRA & PAGO]"
        icon={<PixelIcon name="windows-flag" size={16} />}
        statusBarText="PASO 3: RESUMEN DE COMPRA & PAGO // WEBPAY PLUS TRANSBANK // CIFRADO SSL 128-BITS"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Columna Izquierda: Detalle de la Orden & Confirmación de Datos (Col 1-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Prendas en la Orden */}
            <div className="border border-gray-400 bg-white p-3 space-y-2.5 winxp-bevel-out">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-300 text-xs font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>PRENDAS INCLUIDAS EN LA ORDEN ({items.length})</span>
                </span>
                <Link
                  to="/cart"
                  className="text-[11px] text-blue-700 hover:underline font-normal flex items-center gap-0.5"
                >
                  Modificar en carrito
                </Link>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                    className="p-2 bg-gray-50 border border-gray-300 flex items-center justify-between gap-3 text-xs"
                  >
                    <Link
                      to={`/product/${item.product.id}`}
                      className="shrink-0 block group cursor-pointer"
                      title={`Ver detalles de ${item.product.title}`}
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover border border-gray-400 bg-white group-hover:border-blue-600 transition-colors"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-bold text-gray-900 truncate block hover:text-blue-700 hover:underline cursor-pointer"
                        title={item.product.title}
                      >
                        {item.product.title}
                      </Link>
                      <div className="text-[11px] text-gray-600 flex items-center gap-2 mt-0.5">
                        {hasApparelSize(item.product, item.selectedSize) && (
                          <>
                            <span>
                              Talla: <strong className="text-gray-900">{item.selectedSize}</strong>
                            </span>
                            <span>·</span>
                          </>
                        )}
                        <span>
                          Cant: <strong className="text-gray-900">{item.quantity}</strong>
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-700 font-mono mt-0.5">
                        ${(item.product.salePrice ?? item.product.price).toLocaleString('es-CL')} c/u
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-red-700 text-xs font-mono">
                        ${((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString('es-CL')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Datos del Titular y Entrega Confirmados */}
            <div className="border border-gray-400 bg-white p-3 space-y-2.5 winxp-bevel-out text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-300">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>DATOS DEL COMPRADOR Y ENTREGA CONFIRMADOS</span>
                </span>
                <Link
                  to="/cart"
                  className="text-[11px] text-blue-700 hover:underline flex items-center gap-0.5"
                >
                  Editar datos
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Datos del Titular */}
                <div className="bg-gray-50 border border-gray-300 p-2 space-y-1">
                  <div className="font-bold text-gray-800 border-b border-gray-200 pb-0.5">
                    Titular de la Compra:
                  </div>
                  <div>
                    <strong>Nombre:</strong> {checkoutData.customerName}
                  </div>
                  {checkoutData.customerRut && (
                    <div>
                      <strong>RUT:</strong> <span className="font-mono">{checkoutData.customerRut}</span>
                    </div>
                  )}
                  <div>
                    <strong>Teléfono:</strong> {checkoutData.customerPhone}
                  </div>
                  <div className="truncate">
                    <strong>Email:</strong> {checkoutData.customerEmail}
                  </div>
                </div>

                {/* Datos de Entrega */}
                <div className="bg-gray-50 border border-gray-300 p-2 space-y-1">
                  <div className="font-bold text-gray-800 border-b border-gray-200 pb-0.5 flex items-center gap-1">
                    {checkoutData.deliveryMethod === 'pickup' ? (
                      <>
                        <Store className="w-3.5 h-3.5 text-blue-700" />
                        <span>Retiro en Sucursal Física</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-3.5 h-3.5 text-blue-700" />
                        <span>Envío a Domicilio</span>
                      </>
                    )}
                  </div>
                  {checkoutData.deliveryMethod === 'pickup' ? (
                    <>
                      <div>
                        <strong>Sucursal:</strong> {selectedBranch?.name} ({selectedBranch?.city})
                      </div>
                      <div className="text-[11px] text-gray-600">
                        {selectedBranch?.address}
                      </div>
                      <div className="text-[10px] text-green-700 font-bold">
                        ✓ Preparado en 15 minutos (Sin costo)
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <strong>Dirección:</strong> {checkoutData.shippingAddress}
                      </div>
                      <div>
                        <strong>Ciudad:</strong> {checkoutData.shippingCity}
                      </div>
                      <div className="text-[10px] text-blue-700 font-semibold">
                        Courier: {checkoutData.shippingCourier || 'Starken'}
                      </div>
                      {checkoutData.shippingNotes && (
                        <div className="text-[10px] text-gray-600 italic">
                          Indicaciones: {checkoutData.shippingNotes}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: PASO 3: RESUMEN DE COMPRA & PAGO WEBPAY (Col 8-12) */}
          <div className="lg:col-span-5 bg-[#f8fafc] border border-gray-400 p-3 space-y-3 h-fit winxp-bevel-out">
            <h3 className="font-bold text-xs text-blue-900 pb-1.5 border-b border-gray-300 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-700" />
              <span>PASO 3: RESUMEN DE COMPRA & PAGO</span>
            </h3>

            {/* Desglose de totales */}
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
                  {checkoutData.deliveryMethod === 'pickup'
                    ? 'Retiro en Sucursal'
                    : 'Envío a Domicilio'}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-1.5 flex justify-between font-bold text-sm text-gray-900">
                <span>Total a pagar:</span>
                <span className="text-red-700 font-mono text-base">
                  ${finalTotal.toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>

            {/* Pasarela Webpay Plus Transbank */}
            <div className="border border-[#7eaadb] bg-white p-2.5 space-y-2 winxp-bevel-in">
              <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                <div>
                  <div className="text-xs font-bold text-blue-900">
                    Pasarela Oficial Webpay Plus
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Transbank Chile · Operación Certificada
                  </div>
                </div>
                <div className="px-2 py-0.5 bg-blue-50 border border-blue-300 rounded text-[10px] font-bold text-blue-800">
                  Webpay
                </div>
              </div>

              {/* Selector de Tipo de Tarjeta */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Selecciona Medio de Pago:
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCardType('debito')}
                    className={`p-1.5 border rounded-xs transition-all ${
                      selectedCardType === 'debito'
                        ? 'bg-blue-100 border-blue-700 font-bold text-blue-900 shadow-xs'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-[11px]">Débito</div>
                    <div className="text-[9px] text-gray-500">Redcompra</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCardType('credito')}
                    className={`p-1.5 border rounded-xs transition-all ${
                      selectedCardType === 'credito'
                        ? 'bg-blue-100 border-blue-700 font-bold text-blue-900 shadow-xs'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-[11px]">Crédito</div>
                    <div className="text-[9px] text-gray-500">Visa / Master</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCardType('prepago')}
                    className={`p-1.5 border rounded-xs transition-all ${
                      selectedCardType === 'prepago'
                        ? 'bg-blue-100 border-blue-700 font-bold text-blue-900 shadow-xs'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-[11px]">Prepago</div>
                    <div className="text-[9px] text-gray-500">MACH / Tenpo</div>
                  </button>
                </div>
              </div>

              {/* Selector de Cuotas si es Crédito */}
              {selectedCardType === 'credito' && (
                <div className="pt-1 text-xs">
                  <label className="text-[11px] font-bold text-gray-700 block mb-0.5">
                    Plan de Cuotas:
                  </label>
                  <select
                    value={selectedInstallments}
                    onChange={(e) => setSelectedInstallments(Number(e.target.value))}
                    className="winxp-input w-full text-xs py-1 px-2"
                  >
                    <option value={1}>1 Cuota sin interés (${finalTotal.toLocaleString('es-CL')})</option>
                    <option value={3}>3 Cuotas sin interés (${Math.round(finalTotal / 3).toLocaleString('es-CL')} /mes)</option>
                    <option value={6}>6 Cuotas (${Math.round(finalTotal / 6).toLocaleString('es-CL')} /mes)</option>
                  </select>
                </div>
              )}

              {/* Botón de Confirmación y Pago */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSimulatePayment}
                  className="winxp-button winxp-button-primary text-xs py-2.5 w-full font-bold text-blue-900 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Conectando con Transbank Webpay...</span>
                  ) : (
                    <>
                      <span>CONFIRMAR Y PAGAR CON WEBPAY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 p-2 text-[10px] text-yellow-900 flex items-start gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5" />
                <span>
                  Al pagar, se descontará el stock físico automáticamente del nodo central de inventario.
                </span>
              </div>

              <p className="text-[10px] text-gray-500 text-center leading-tight">
                🔒 Transacción encriptada SSL de 128-bits. Conforme a las normas de seguridad de Windows XP y Transbank.
              </p>
            </div>

            {/* Enlace para volver al carrito */}
            <div className="pt-1 text-center">
              <Link
                to="/cart"
                className="text-xs text-blue-800 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Modificar prendas o datos en el Carrito</span>
              </Link>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};

export default CheckoutView;
