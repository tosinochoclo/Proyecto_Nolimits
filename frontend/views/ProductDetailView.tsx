import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { PixelIcon } from '../components/common/PixelIcon';
import { SoldOutDetailBanner } from '../components/common/SoldOutState';
import { ProductReviewsSection } from '../components/product/ProductReviewsSection';

export const ProductDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = INITIAL_PRODUCTS.find((p) => p.id === id) || INITIAL_PRODUCTS[0];
  const { addToCart } = useCart();

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
            <div className="relative aspect-square max-h-[450px] border border-gray-400 bg-white winxp-bevel-in flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

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
                  <span className="bg-red-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-xs shadow-xs tracking-wider">
                    -{product.discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Si el producto está agotado: Renderizar componente específico de Sin Stock */}
            {isSoldOut ? (
              <SoldOutDetailBanner productTitle={product.title} sku={product.sku} />
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

                {/* Botón de Agregar al Carrito */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="winxp-button winxp-button-primary text-sm py-2 px-6 w-full font-bold text-blue-900 shadow-sm"
                  >
                    <PixelIcon name="cart" size={16} />
                    <span>AÑADIR AL CARRITO</span>
                  </button>

                  {addedAlert && (
                    <div className="mt-2 p-2 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span>¡Prenda añadida al carrito con éxito! Ya puedes completar la compra en caja.</span>
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
    </div>
  );
};
