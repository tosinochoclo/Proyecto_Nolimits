import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, CreditCard, Sparkles, Store } from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { PixelButton } from '../components/common/PixelButton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBranch } from '../context/BranchContext';

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
      <div className="max-w-2xl mx-auto py-8">
        <WindowFrame
          title="PAYMENT_CONFIRMED.EXE - [Pedido Registrado]"
          variant="lavender"
          statusBarText="STOCK DESCONTADO EN TIEMPO REAL // WEBPAY AUTH OK"
        >
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-green-950/80 border-2 border-green-500 text-green-400">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h2 className="font-['Silkscreen'] text-xl text-white">¡ORDEN CONFIRMADA CON ÉXITO!</h2>
            <p className="font-['Chakra_Petch'] text-sm text-slate-300 max-w-md mx-auto">
              Tu pedido <span className="text-[#00d4ff] font-mono font-bold">#NL-{Math.floor(1000 + Math.random() * 9000)}</span> ha sido validado automáticamente. Recibirás tu tracking en Starken/Blue Express por correo.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link to="/catalog">
                <PixelButton variant="primary" size="md">
                  Seguir Comprando
                </PixelButton>
              </Link>
            </div>
          </div>
        </WindowFrame>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <WindowFrame
          title="CART_EMPTY.SYS - [Carrito de Compras]"
          variant="chrome"
          statusBarText="ITEMS: 0 // TOTAL: $0 CLP"
        >
          <div className="text-center py-10 space-y-4">
            <div className="font-['VT323'] text-4xl text-[#a855f7]">
              [ EL CARRITO ESTÁ VACÍO ]
            </div>
            <p className="font-['Chakra_Petch'] text-sm text-slate-400 max-w-md mx-auto">
              Aún no has seleccionado ninguna prenda del drop. Explora el catálogo para asegurar tu talla antes de que se agote en el stream.
            </p>
            <Link to="/catalog">
              <PixelButton variant="primary" size="lg" icon={<Sparkles className="w-4 h-4" />}>
                Ir al Catálogo Ahora
              </PixelButton>
            </Link>
          </div>
        </WindowFrame>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WindowFrame
        title="CHECKOUT_TERMINAL.EXE - [Carrito de Compras]"
        variant="lavender"
        statusBarText="RESERVA DE STOCK TEMPORAL: 15:00 MINUTOS"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Items List (Col 1-8) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2d2242] text-xs font-['Silkscreen'] text-slate-300">
              <span>PRENDA SELECCIONADA</span>
              <span>SUBTOTAL</span>
            </div>

            {items.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              return (
                <div
                  key={item.id}
                  className="bevel-sunken p-3 bg-black/50 flex flex-col sm:flex-row items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover bevel-raised shrink-0"
                    />
                    <div>
                      <h4 className="font-['Chakra_Petch'] font-bold text-sm text-white line-clamp-1">
                        {item.product.title}
                      </h4>
                      <div className="font-['VT323'] text-xs text-[#a855f7] flex items-center gap-2 mt-0.5">
                        <span>TALLA: {item.selectedSize}</span>
                        <span>•</span>
                        <span>COLOR: {item.selectedColor.name}</span>
                      </div>
                      <div className="font-['Silkscreen'] text-xs text-[#ff007f] mt-1">
                        ${item.unitPrice.toLocaleString('es-CL')} c/u
                        {item.discountApplicable > 0 && (
                          <span className="text-[10px] text-green-400 ml-1">
                            (Ahorro: ${(item.discountApplicable * item.quantity).toLocaleString('es-CL')})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2b223c]">
                    <div className="flex items-center gap-1 bevel-sunken p-0.5 bg-black">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="win-btn w-6 h-6"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-['Silkscreen'] text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="win-btn w-6 h-6"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-['Silkscreen'] text-sm text-white">
                        ${itemTotal.toLocaleString('es-CL')}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-1.5"
                      title="Eliminar ítem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Financial Summary & Checkout Action (Col 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bevel-chrome p-4 bg-[#110d1c] space-y-3">
              <h3 className="font-['Silkscreen'] text-xs text-white border-b border-[#3b2b52] pb-2">
                RESUMEN DE PAGO
              </h3>

              <div className="space-y-1.5 font-['Chakra_Petch'] text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal prendas:</span>
                  <span className="font-mono">${subtotal.toLocaleString('es-CL')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Descuentos aplicados:</span>
                    <span className="font-mono">-${discount.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Despacho (Chile):</span>
                  <span className="font-mono">
                    {shippingCost === 0 ? 'GRATIS (Over $50k)' : `$${shippingCost.toLocaleString('es-CL')}`}
                  </span>
                </div>

                <div className="border-t border-[#3b2b52] pt-2 flex justify-between font-['Silkscreen'] text-base text-white">
                  <span>TOTAL FINAL:</span>
                  <span className="text-[#ff007f]">${total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Payment selector */}
              <div className="pt-2 space-y-2">
                <span className="font-['Silkscreen'] text-[10px] text-slate-400">PASARELA AUTOMATIZADA:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedMethod('webpay')}
                    className={`p-2 text-center text-xs font-['Silkscreen'] cursor-pointer ${
                      selectedMethod === 'webpay' ? 'bevel-raised bg-[#ff007f] text-white' : 'bevel-sunken text-slate-300'
                    }`}
                  >
                    Webpay Plus
                  </button>
                  <button
                    onClick={() => setSelectedMethod('voucher')}
                    className={`p-2 text-center text-xs font-['Silkscreen'] cursor-pointer ${
                      selectedMethod === 'voucher' ? 'bevel-raised bg-[#7c3aed] text-white' : 'bevel-sunken text-slate-300'
                    }`}
                  >
                    Voucher OCR
                  </button>
                </div>

                <PixelButton
                  variant="primary"
                  size="lg"
                  className="w-full text-sm py-2.5 mt-2"
                  onClick={handleSimulatePayment}
                >
                  PAGAR AHORA CON WEBPAY
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
