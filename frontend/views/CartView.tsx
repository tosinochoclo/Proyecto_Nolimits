import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, CreditCard, Sparkles, Store } from 'lucide-react';
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
    shippingCost,
    total,
    clearCart
  } = useCart();
  const { currentUser } = useAuth();
  const { branches } = useBranch();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout_success'>('cart');
  const [selectedMethod, setSelectedMethod] = useState<'webpay' | 'voucher'>('webpay');

  const handleSimulatePayment = () => {
    setCheckoutStep('checkout_success');
    clearCart();
  };

  if (checkoutStep === 'checkout_success') {
    return (
      <div className="max-w-2xl mx-auto py-8 font-sans">
        <WindowFrame
          title="Asistente_de_Instalacion.exe - [Orden Confirmada]"
          icon={<PixelIcon name="info" size={16} />}
          statusBarText="STOCK DESCONTADO EN TIEMPO REAL // WEBPAY AUTH OK"
        >
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-green-100 border-2 border-green-600 text-green-700">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-lg font-bold text-blue-900">
              ¡ORDEN CONFIRMADA CON ÉXITO!
            </h2>
            <p className="text-xs text-gray-700 max-w-md mx-auto leading-relaxed">
              Tu pedido <span className="text-blue-700 font-mono font-bold">#NL-{Math.floor(1000 + Math.random() * 9000)}</span> ha sido validado automáticamente en el sistema. Recibirás tu tracking en Starken/Blue Express por correo electrónico.
            </p>

            <div className="bg-gray-100 border border-gray-400 p-3 max-w-sm mx-auto text-left text-xs space-y-1">
              <div className="font-bold text-gray-800">Resumen de la transacción:</div>
              <div>Titular: {currentUser.name}</div>
              <div>Medio: Webpay Plus (Crédito/Débito)</div>
              <div>Estado: Aprobado (Código: 200_OK)</div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link to="/catalog">
                <button
                  type="button"
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900"
                >
                  <PixelIcon name="search" size={14} />
                  <span>Seguir Comprando</span>
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
        title="Asistente_de_Compra.exe - [Carrito de Compras y Caja]"
        icon={<PixelIcon name="cart" size={16} />}
        statusBarText="RESERVA DE STOCK TEMPORAL: 15:00 MINUTOS"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Lista de Prendas (Col 1-8) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-300 text-xs font-bold text-gray-700">
              <span>PRENDA SELECCIONADA</span>
              <span>SUBTOTAL</span>
            </div>

            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
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

          {/* Panel de Resumen de Pago (Col 9-12) */}
          <div className="lg:col-span-4 bg-[#f8fafc] border border-gray-400 p-3 space-y-3">
            <h3 className="font-bold text-xs text-blue-900 pb-1.5 border-b border-gray-300">
              Resumen de la Compra
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
                <span>Despacho nacional:</span>
                <span>{shippingCost === 0 ? '¡Gratis!' : `$${shippingCost.toLocaleString('es-CL')}`}</span>
              </div>
              <div className="border-t border-gray-300 pt-1.5 flex justify-between font-bold text-sm text-gray-900">
                <span>Total a pagar:</span>
                <span className="text-red-700">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {/* Pasarela Webpay */}
            <div className="pt-2 border-t border-gray-300 space-y-2">
              <div className="text-[11px] font-bold text-gray-800">
                Medio de Pago Seguro:
              </div>
              <div className="bg-white border border-gray-300 p-2 text-xs flex items-center justify-between">
                <span className="font-semibold text-blue-900">Webpay Plus / Redcompra</span>
                <CreditCard className="w-4 h-4 text-blue-700" />
              </div>

              <button
                type="button"
                onClick={handleSimulatePayment}
                className="winxp-button winxp-button-primary text-xs py-2 w-full font-bold text-blue-900 shadow-sm"
              >
                <span>CONFIRMAR Y PAGAR ORDEN</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>

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
