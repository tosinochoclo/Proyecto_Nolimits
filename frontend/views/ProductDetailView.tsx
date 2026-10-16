import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Heart,
  Lock
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { PixelIcon } from '../components/common/PixelIcon';
import { SoldOutDetailBanner } from '../components/common/SoldOutState';
import { ProductReviewsSection } from '../components/product/ProductReviewsSection';

export const ProductDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = INITIAL_PRODUCTS.find((p) => p.id === id) || INITIAL_PRODUCTS[0];
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const isWishlisted = isInWishlist(product.id);

  const [wishlistAlert, setWishlistAlert] = useState<{ message: string; type: 'added' | 'removed' } | null>(null);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);

  // Función para determinar si la categoría corresponde a ropa que utiliza tallas
  const isApparelCategory = (categoryName: string) => {
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

  const hasSizeOption = isApparelCategory(product.category);
  const isSoldOut = product.totalStock <= 0;

  const initialSize = hasSizeOption
    ? (product.sizes[0] === 'Única (Ajustable)' ? 'Talla estándar' : product.sizes[0] || 'M')
    : 'Talla estándar';

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Void Black', hex: '#000000' });
  const [addedAlert, setAddedAlert] = useState(false);

  const productReviews = INITIAL_REVIEWS.filter(
    (r) => r.productId === product.id || r.productId === 'prod_cyber_hoodie_01'
  );

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(product, hasSizeOption ? selectedSize : 'Talla estándar', selectedColor, undefined, 1);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  const handleToggleWishlist = () => {
    const result = toggleWishlist(product);
    if (result.requiresAuth) {
      setShowAuthRequiredModal(true);
      return;
    }

    if (result.isAdded) {
      setWishlistAlert({ message: '¡Prenda guardada con éxito en tu Lista de Deseos!', type: 'added' });
    } else {
      setWishlistAlert({ message: 'Prenda removida de tu Lista de Deseos.', type: 'removed' });
    }
    setTimeout(() => {
      setWishlistAlert(null);
    }, 3500);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Ventana de Detalles de Producto estilo Windows XP */}
      <WindowFrame
        title="Detalles de Productos.exe"
        icon={<Info className="w-4 h-4 text-white shrink-0" />}
        statusBarText={`SKU: ${product.sku} // ${product.title.toUpperCase()} // STOCK: ${product.totalStock} UNIDADES`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Galería de Imágenes (Col 1-5, tamaño reducido para no abrumar la vista) */}
          <div className="lg:col-span-5 space-y-3 max-w-sm sm:max-w-md mx-auto w-full">
            <div className="relative aspect-square max-h-[350px] border border-gray-400 bg-white winxp-bevel-in flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Botón flotante de un corazón para Lista de Deseos sobre la imagen */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`absolute top-2.5 right-2.5 p-2 rounded-full border shadow-md z-20 cursor-pointer transition-all active:scale-95 ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-500 text-rose-600 hover:bg-rose-100'
                    : 'bg-white/95 hover:bg-white border-gray-400 text-gray-700 hover:text-rose-600'
                }`}
                title={
                  !isAuthenticated
                    ? 'Añadir a Lista de Deseos (Exclusivo para usuarios registrados)'
                    : isWishlisted
                    ? 'Quitar de mi Lista de Deseos'
                    : 'Añadir a mi Lista de Deseos'
                }
                aria-label="Botón de corazón para lista de deseos"
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    isWishlisted ? 'text-rose-600 fill-rose-600' : 'text-gray-700 hover:text-rose-600'
                  }`}
                />
              </button>

              {/* Etiqueta de descuento oficial sobre la imagen */}
              {product.discountPercent && !isSoldOut && (
                <span
                  className="product-card-xp-discount product-detail-discount-badge"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    fontFamily: 'Tahoma, sans-serif',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.35)',
                    border: '1px solid #166534',
                    zIndex: 10,
                  }}
                >
                  -{product.discountPercent}% OFF
                </span>
              )}

              {/* Botones con flechas visibles y claras para cambiar de imagen */}
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 winxp-button text-xs w-8 h-8 p-0 flex items-center justify-center shadow-md bg-white/95 hover:bg-white text-gray-900 z-10"
                    aria-label="Foto anterior"
                    title="Foto anterior (←)"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 winxp-button text-xs w-8 h-8 p-0 flex items-center justify-center shadow-md bg-white/95 hover:bg-white text-gray-900 z-10"
                    aria-label="Foto siguiente"
                    title="Foto siguiente (→)"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800 stroke-[2.5]" />
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 border ${
                      activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles y Configuración de Compra (Col 6-12) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase">
                Categoría: {product.category}
              </div>
              <h1 className="text-xl font-bold text-gray-900 mt-1">
                {product.title}
              </h1>
              {/* Precios con descuento al lado derecho del precio original tachado */}
              <div className="flex items-center flex-wrap gap-2 mt-1">
                <span className="text-sm font-bold text-red-700">
                  ${(product.salePrice ?? product.price).toLocaleString('es-CL')} CLP
                </span>
                {product.salePrice && (
                  <span className="text-xs text-gray-500 line-through font-normal">
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                )}
                {product.discountPercent && (
                  <span
                    className="product-detail-discount-badge font-bold text-[11px] px-2 py-0.5 rounded-xs shadow-xs tracking-wider border"
                    style={{
                      backgroundColor: '#15803d',
                      borderColor: '#166534',
                      color: '#ffffff',
                    }}
                  >
                    -{product.discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Si el producto está agotado: Renderizar componente específico de Sin Stock y opción de Lista de Deseos */}
            {isSoldOut ? (
              <div className="space-y-3">
                <SoldOutDetailBanner productTitle={product.title} sku={product.sku} />
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`winxp-button text-xs py-2 px-4 w-full font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-500 text-rose-800 hover:bg-rose-100 winxp-button-active'
                      : 'text-gray-800 hover:bg-gray-100 hover:text-rose-700'
                  }`}
                  title={
                    !isAuthenticated
                      ? 'Añadir a Lista de Deseos (Exclusivo para usuarios registrados)'
                      : isWishlisted
                      ? 'Quitar de mi Lista de Deseos'
                      : 'Añadir a mi Lista de Deseos'
                  }
                >
                  <Heart
                    className={`w-4 h-4 transition-transform active:scale-125 ${
                      isWishlisted ? 'text-rose-600 fill-rose-600' : 'text-rose-600'
                    }`}
                  />
                  <span>
                    {isWishlisted
                      ? 'En tu Lista de Deseos (Te avisaremos cuando vuelva a haber stock)'
                      : 'Guardar en Lista de Deseos para Alertas de Reposición'}
                  </span>
                </button>

                {wishlistAlert && (
                  <div
                    className={`p-2 border text-xs flex items-center justify-between gap-2 rounded-xs animate-in fade-in ${
                      wishlistAlert.type === 'added'
                        ? 'bg-rose-50 border-rose-400 text-rose-950'
                        : 'bg-gray-100 border-gray-400 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Heart
                        className={`w-4 h-4 shrink-0 ${
                          wishlistAlert.type === 'added' ? 'text-rose-600 fill-rose-600' : 'text-gray-500'
                        }`}
                      />
                      <span className="font-bold">{wishlistAlert.message}</span>
                    </div>
                    {wishlistAlert.type === 'added' && (
                      <Link
                        to="/profile"
                        className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline shrink-0 cursor-pointer"
                      >
                        Ver en Mi Perfil →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Selección de Talla (SOLO para ropa: polerones, chaquetas, pantalones, poleras) */}
                {hasSizeOption && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-800 block">
                      Seleccionar Talla Disponible:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((s) => {
                        const displaySize = s === 'Única (Ajustable)' ? 'Talla estándar' : s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(displaySize)}
                            className={`winxp-button text-xs py-1 px-3 ${
                              selectedSize === displaySize ? 'winxp-button-primary bg-blue-100 font-bold' : ''
                            }`}
                          >
                            {displaySize}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Botón de Agregar al Carrito y Botón de un Corazón (Lista de Deseos) */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="winxp-button winxp-button-primary text-sm py-2 px-5 flex-1 font-bold text-blue-900 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PixelIcon name="cart" size={16} />
                      <span>AÑADIR AL CARRITO</span>
                    </button>

                    {/* Botón de un corazón para la Lista de Deseos */}
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className={`winxp-button text-sm py-2 px-3.5 sm:px-4 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all ${
                        isWishlisted
                          ? 'bg-rose-50 border-rose-500 text-rose-800 hover:bg-rose-100 winxp-button-active'
                          : 'text-gray-800 hover:bg-gray-100 hover:text-rose-700'
                      }`}
                      title={
                        !isAuthenticated
                          ? 'Añadir a Lista de Deseos (Exclusivo para usuarios registrados)'
                          : isWishlisted
                          ? 'Quitar de mi Lista de Deseos'
                          : 'Añadir a mi Lista de Deseos'
                      }
                      aria-label="Botón de corazón para añadir a la lista de deseos"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          isWishlisted ? 'text-rose-600 fill-rose-600' : 'text-rose-600'
                        }`}
                      />
                      <span className="hidden sm:inline">
                        {isWishlisted ? 'En Lista de Deseos' : 'Lista de Deseos'}
                      </span>
                    </button>
                  </div>

                  {addedAlert && (
                    <div className="mt-2 p-2 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span>¡Prenda añadida al carrito con éxito! Ya puedes completar la compra en caja.</span>
                    </div>
                  )}

                  {wishlistAlert && (
                    <div
                      className={`mt-2 p-2 border text-xs flex items-center justify-between gap-2 rounded-xs animate-in fade-in ${
                        wishlistAlert.type === 'added'
                          ? 'bg-rose-50 border-rose-400 text-rose-950'
                          : 'bg-gray-100 border-gray-400 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Heart
                          className={`w-4 h-4 shrink-0 ${
                            wishlistAlert.type === 'added' ? 'text-rose-600 fill-rose-600' : 'text-gray-500'
                          }`}
                        />
                        <span className="font-bold">{wishlistAlert.message}</span>
                      </div>
                      {wishlistAlert.type === 'added' && (
                        <Link
                          to="/profile"
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline shrink-0 cursor-pointer"
                        >
                          Ver en Mi Perfil →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Bloque de Descripción Detallada (Ubicado en la parte inferior del botón de añadir al carrito) */}
            <div className="bg-gray-50 border border-gray-300 p-2.5 winxp-bevel-in text-xs text-gray-800 space-y-1">
              <div className="font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-300 pb-1">
                <PixelIcon name="notepad" size={13} />
                <span>Descripción del Producto:</span>
              </div>
              <p className="text-gray-700 leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* Garantías de Seguridad */}
            <div className="bg-gray-100 border border-gray-300 p-2.5 text-[11px] text-gray-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Garantía Oficial NoLimits Windows XP</span>
              </div>
              <div>• Cambios presenciales de talla sin costo en cualquiera de nuestras sucursales físicas.</div>
              <div>• Transacción validada automáticamente por Webpay Plus y boleta digital instantánea.</div>
            </div>
          </div>
        </div>

        {/* Sección de Reseñas de Clientes con Filtros y Carga de Fotos Reales */}
        <ProductReviewsSection
          product={product}
          initialReviews={productReviews}
        />
      </WindowFrame>

      {/* =========================================================================
          MODAL ESTILO WINDOWS XP: ACCESO EXCLUSIVO PARA USUARIOS REGISTRADOS
          ========================================================================= */}
      {showAuthRequiredModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 animate-in fade-in">
          <div className="w-full max-w-md bg-[#ece9d8] border-2 border-blue-900 shadow-2xl winxp-bevel-out">
            {/* Barra de Título Windows XP */}
            <div className="winxp-titlebar flex items-center justify-between px-2 py-1 select-none text-white">
              <div className="winxp-titlebar-title flex items-center gap-1.5 text-xs text-white font-bold">
                <Heart className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>Lista_de_Deseos.exe - [Usuario No Registrado]</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthRequiredModal(false)}
                className="winxp-btn-ctrl winxp-btn-close w-4 h-4 text-[10px] font-bold text-white flex items-center justify-center cursor-pointer"
                title="Cerrar"
              >
                ×
              </button>
            </div>

            {/* Contenido Windows XP */}
            <div className="p-4 space-y-3.5 bg-white text-xs text-gray-800">
              <div className="flex items-start gap-3 p-3 bg-amber-50 border-2 border-amber-400 rounded-xs winxp-bevel-in">
                <div className="p-2 bg-amber-100 border border-amber-300 rounded-full shrink-0">
                  <Lock className="w-5 h-5 text-amber-700" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-amber-950 uppercase">
                    Función Exclusiva para Clientes Registrados
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Para añadir <strong>"{product.title}"</strong> a tu <strong>Lista de Deseos</strong> y guardar tus prendas favoritas con alertas de stock, debes contar con una cuenta registrada e iniciar sesión.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-950 text-[11px] space-y-1">
                <div className="font-bold text-blue-900">¿Por qué registrarte en NoLimits?</div>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                  <li>Guarda prendas sin límite y consúltalas en tu Perfil de Usuario.</li>
                  <li>Recibe avisos inmediatos cuando repongamos stock en tiendas.</li>
                  <li>Acumula Puntos NoLimits en tus compras y canjea cupones de descuento.</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setShowAuthRequiredModal(false)}
                  className="winxp-button text-xs py-1.5 px-3.5 text-gray-800 font-bold cursor-pointer"
                >
                  Continuar como Invitado
                </button>
                <Link
                  to="/auth"
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900 flex items-center gap-1.5 cursor-pointer shadow-sm text-center"
                >
                  <span>Iniciar Sesión / Registrarme →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
