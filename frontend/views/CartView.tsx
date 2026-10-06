import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Store,
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBranch } from '../context/BranchContext';
import { PixelIcon } from '../components/common/PixelIcon';

export const CartView: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    clearCart
  } = useCart();
  const { currentUser } = useAuth();
  const { branches, activeBranchId, setActiveBranchId } = useBranch();

  // Estados del Checkout
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout_success'>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'shipping'>('pickup');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    activeBranchId !== 'all' ? activeBranchId : branches[0]?.id || 'vina_del_mar'
  );

  // Datos del Cliente para despacho / retiro
  const [customerName, setCustomerName] = useState(currentUser.name || 'Valeria Neo-Goth');
  const [customerRut, setCustomerRut] = useState(currentUser.rut || '19.824.112-K');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+56 9 9123 4567');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || 'cliente@nolimits.cl');

  // Datos para envío a domicilio
  const [shippingAddress, setShippingAddress] = useState('Av. Álvarez 1250, Depto 402');
  const [shippingCity, setShippingCity] = useState('Viña del Mar');

  // Orden generada al finalizar
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  // Cálculo del costo de envío según método elegido
  const calculatedShippingCost = deliveryMethod === 'pickup' ? 0 : (subtotal - discount > 50000 ? 0 : 3990);
  const finalTotal = Math.max(0, subtotal - discount + calculatedShippingCost);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    setActiveBranchId(branchId);
  };

  const handleSimulatePayment = () => {
    const orderNumber = `NL-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrderId(orderNumber);
    setCheckoutStep('checkout_success');
    clearCart();
  };

  if (checkoutStep === 'checkout_success') {
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
                Pago Procesado Correctamente
              </span>
              <h2 className="text-xl font-bold text-blue-900 mt-2">
                ¡ORDEN CONFIRMADA CON ÉXITO!
              </h2>
              <p className="text-xs text-gray-700 max-w-md mx-auto mt-1">
                Número de Orden: <span className="text-blue-800 font-mono font-bold text-sm">{confirmedOrderId}</span>
              </p>
            </div>

            {/* Tarjeta de Destino / Sucursal de Retiro */}
            <div className="bg-white border-2 border-[#7eaadb] winxp-bevel-in p-3.5 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="font-bold text-blue-900 flex items-center gap-1.5 border-b border-gray-300 pb-1.5">
                {deliveryMethod === 'pickup' ? (
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

              {deliveryMethod === 'pickup' && selectedBranch ? (
                <div className="space-y-1 text-gray-800">
                  <div className="font-bold text-sm text-gray-900">{selectedBranch.name}</div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{selectedBranch.address}, {selectedBranch.city}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Horario: Lunes a Sábado de 11:00 a 20:00 hrs</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>Jefe de Sucursal: {selectedBranch.managerName} ({selectedBranch.phone})</span>
                  </div>
                  <div className="mt-2 bg-green-50 border border-green-300 p-2 text-[11px] text-green-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                    <span>Tu pedido estará preparado para retiro en <strong>15 minutos</strong> con tu cédula o RUT.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-gray-800">
                  <div><strong>Destinatario:</strong> {customerName} (RUT: {customerRut})</div>
                  <div><strong>Dirección:</strong> {shippingAddress}, {shippingCity}</div>
                  <div><strong>Courier Asignado:</strong> Starken / Blue Express (Tracking enviado a {customerEmail})</div>
                </div>
              )}
            </div>

            {/* Resumen de Transacción Webpay */}
            <div className="bg-gray-100 border border-gray-400 p-3 max-w-md mx-auto text-left text-xs space-y-1">
              <div className="font-bold text-gray-800">Comprobante Transbank Webpay Plus:</div>
              <div className="flex justify-between">
                <span>Titular:</span>
                <span className="font-semibold">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Medio de Pago:</span>
                <span>Webpay Plus (Redcompra / Crédito)</span>
              </div>
              <div className="flex justify-between font-bold text-blue-900 pt-1 border-t border-gray-300">
                <span>Monto Pagado:</span>
                <span className="text-red-700 font-mono">${finalTotal.toLocaleString('es-CL')} CLP</span>
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
    <div className="space-y-4 font-sans">
      <WindowFrame
        title="Asistente_de_Compra.exe - [Carrito de Compras y Pasarela de Pago]"
        icon={<PixelIcon name="cart" size={16} />}
        statusBarText="FLUJO DE SUCURSALES Y DESPACHO CENTRALIZADO // PAGO SEGURO WEBPAY"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Columna Izquierda: Prendas + Flujo de Sucursales / Despacho (Col 1-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1. Lista de Prendas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-300 text-xs font-bold text-gray-700">
                <span>PRENDA SELECCIONADA</span>
                <span>SUBTOTAL</span>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                    className="p-2.5 bg-gray-50 border border-gray-300 flex items-center justify-between gap-3 text-xs"
                  >
                    {/* Foto miniatura */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-14 object-cover border border-gray-400 bg-white shrink-0"
                    />

                    {/* Datos del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {item.product.title}
                      </h3>
                      <div className="text-[11px] text-gray-600 flex items-center gap-2 mt-0.5">
                        <span>Talla: <strong>{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span>Color: <strong>{item.selectedColor.name}</strong></span>
                      </div>
                      <div className="text-[11px] text-blue-900 font-bold mt-1">
                        ${(item.product.salePrice ?? item.product.price).toLocaleString('es-CL')} c/u
                      </div>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="winxp-button text-xs w-6 h-6 p-0"
                        title="Restar unidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold font-mono text-xs">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="winxp-button text-xs w-6 h-6 p-0"
                        title="Sumar unidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total y Eliminar */}
                    <div className="text-right shrink-0">
                      <div className="font-bold text-red-700 text-xs">
                        ${((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString('es-CL')}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-600 text-[10px] mt-1 inline-flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ===============================================================
                2. FLUJO EXCLUSIVO DE SUCURSALES Y DESPACHO EN EL CHECKOUT
                =============================================================== */}
            <div className="border border-gray-400 bg-white p-3 space-y-3 winxp-bevel-out">
              <div className="flex items-center gap-2 pb-1.5 border-b border-gray-300">
                <Store className="w-4 h-4 text-blue-700" />
                <h3 className="font-bold text-xs text-blue-900">
                  PASO 1: SELECCIONA EL NODO DE RETIRO O ENVÍO
                </h3>
              </div>

              {/* Selector de Modalidad (Retiro en Sucursal vs Envío a Domicilio) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-2.5 text-left border flex items-start gap-2.5 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-500 font-semibold'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Store className={`w-4 h-4 mt-0.5 shrink-0 ${deliveryMethod === 'pickup' ? 'text-blue-700' : 'text-gray-500'}`} />
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-1">
                      <span>Retiro en Sucursal Física</span>
                      <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded font-bold">¡GRATIS!</span>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      Retiro inmediato en Viña del Mar, Valparaíso o Quilpué
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('shipping')}
                  className={`p-2.5 text-left border flex items-start gap-2.5 transition-all ${
                    deliveryMethod === 'shipping'
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-500 font-semibold'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Truck className={`w-4 h-4 mt-0.5 shrink-0 ${deliveryMethod === 'shipping' ? 'text-blue-700' : 'text-gray-500'}`} />
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-1">
                      <span>Despacho a Domicilio</span>
                      <span className="text-[10px] text-gray-600">Starken / Blue Express</span>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      Entrega en 24 a 48 hrs hábiles en Chile Central
                    </div>
                  </div>
                </button>
              </div>

              {/* Si eligió Retiro en Sucursal: Selector completo de Sucursales Físicas */}
              {deliveryMethod === 'pickup' ? (
                <div className="bg-[#f2f7fc] border border-[#a0c5e8] p-3 rounded-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-700" />
                      Selecciona la Sucursal donde deseas retirar:
                    </span>
                    <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded font-mono font-bold">
                      SIN COSTO DE ENVÍO ($0 CLP)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {branches.map((branch) => {
                      const isSelected = selectedBranchId === branch.id;
                      return (
                        <div
                          key={branch.id}
                          onClick={() => handleBranchChange(branch.id)}
                          className={`p-2.5 border cursor-pointer text-xs transition-all ${
                            isSelected
                              ? 'bg-white border-blue-700 shadow-sm ring-2 ring-blue-400'
                              : 'bg-white/80 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                            <span className="font-bold text-blue-900">{branch.city}</span>
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                          </div>
                          <div className="font-semibold text-gray-800 mt-1 truncate" title={branch.name}>
                            {branch.name}
                          </div>
                          <div className="text-[11px] text-gray-600 mt-0.5">
                            {branch.address}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1">
                            Resp: {branch.managerName.split('(')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedBranch && (
                    <div className="bg-white border border-gray-300 p-2 text-xs flex flex-wrap items-center justify-between gap-2 text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Sucursal confirmada: <strong>{selectedBranch.name}</strong> ({selectedBranch.address})</span>
                      </div>
                      <div className="font-mono text-[11px] text-blue-900">
                        Tel: {selectedBranch.phone}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Si eligió Despacho a Domicilio */
                <div className="bg-[#f8fafc] border border-gray-300 p-3 rounded-sm space-y-2 text-xs">
                  <div className="font-bold text-gray-800">Dirección de Despacho en Chile:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-0.5">Calle y Número / Depto:</label>
                      <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="winxp-input w-full text-xs py-1 px-2"
                        placeholder="Ej: Av. Libertad 1400, Depto 502"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-0.5">Comuna / Ciudad:</label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="winxp-input w-full text-xs py-1 px-2"
                        placeholder="Ej: Viña del Mar, Valparaíso, Quilpué"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Datos del Comprador */}
            <div className="border border-gray-400 bg-white p-3 space-y-2 winxp-bevel-out text-xs">
              <div className="font-bold text-blue-900 pb-1 border-b border-gray-300">
                PASO 2: DATOS DEL TITULAR DE LA COMPRA
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-gray-600 block mb-0.5">Nombre y Apellidos:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="winxp-input w-full text-xs py-1 px-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-600 block mb-0.5">RUT Chileno:</label>
                  <input
                    type="text"
                    value={customerRut}
                    onChange={(e) => setCustomerRut(e.target.value)}
                    className="winxp-input w-full text-xs py-1 px-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-600 block mb-0.5">Teléfono / WhatsApp de contacto:</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="winxp-input w-full text-xs py-1 px-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-600 block mb-0.5">Email para comprobante:</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="winxp-input w-full text-xs py-1 px-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Panel de Resumen de Pago (Col 9-12) */}
          <div className="lg:col-span-4 bg-[#f8fafc] border border-gray-400 p-3 space-y-3 h-fit winxp-bevel-out">
            <h3 className="font-bold text-xs text-blue-900 pb-1.5 border-b border-gray-300">
              PASO 3: RESUMEN DE COMPRA & PAGO
            </h3>

            <div className="space-y-1.5 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal prendas:</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Descuentos aplicados:</span>
                  <span>-${discount.toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Modalidad de entrega:</span>
                <span className="font-semibold text-blue-900">
                  {deliveryMethod === 'pickup' ? 'Retiro en Sucursal' : 'Envío a Domicilio'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Costo de despacho:</span>
                <span className={calculatedShippingCost === 0 ? 'text-green-700 font-bold' : ''}>
                  {calculatedShippingCost === 0 ? '¡Gratis! ($0)' : `$${calculatedShippingCost.toLocaleString('es-CL')}`}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-1.5 flex justify-between font-bold text-sm text-gray-900">
                <span>Total a pagar:</span>
                <span className="text-red-700 font-mono">${finalTotal.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {/* Pasarela Webpay Plus */}
            <div className="pt-2 border-t border-gray-300 space-y-2">
              <div className="text-[11px] font-bold text-gray-800">
                Pasarela Oficial de Pago:
              </div>
              <div className="bg-white border border-gray-300 p-2 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-blue-900 block">Webpay Plus Transbank</span>
                  <span className="text-[10px] text-gray-500">Tarjetas de Débito, Crédito y Prepago</span>
                </div>
                <CreditCard className="w-5 h-5 text-blue-700" />
              </div>

              <button
                type="button"
                onClick={handleSimulatePayment}
                className="winxp-button winxp-button-primary text-xs py-2 w-full font-bold text-blue-900 shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>CONFIRMAR Y PAGAR CON WEBPAY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

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
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};

export default CartView;
