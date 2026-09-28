import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  Star,
  ThumbsUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';
import { PixelIcon } from '../components/common/PixelIcon';

export const ProductDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = INITIAL_PRODUCTS.find((p) => p.id === id) || INITIAL_PRODUCTS[0];
  const { addToCart } = useCart();
  const { branches } = useBranch();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Void Black', hex: '#000000' });
  const [selectedPickupBranch, setSelectedPickupBranch] = useState(product.branchesEnabled[0] || 'vina_del_mar');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'with_images' | '5_stars' | 'verified'>('all');
  const [addedAlert, setAddedAlert] = useState(false);

  const reviews = INITIAL_REVIEWS.filter(r => r.productId === product.id || r.productId === 'prod_cyber_hoodie_01');

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'with_images') return r.photos.length > 0;
    if (reviewFilter === '5_stars') return r.rating === 5;
    if (reviewFilter === 'verified') return r.verifiedPurchase;
    return true;
  });

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, selectedPickupBranch, 1);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  return (
    <div className="space-y-4 font-sans">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al Catálogo de Productos</span>
      </Link>

      {/* Ventana de Propiedades de Prenda estilo Windows XP */}
      <WindowFrame
        title={`Propiedades_de_${product.sku}.exe - [${product.title}]`}
        icon={<PixelIcon name="notepad" size={16} />}
        statusBarText={`SKU: ${product.sku} // SUCURSALES AUTORIZADAS: ${product.branchesEnabled.length} // STOCK VERIFICADO`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Galería de Imágenes (Col 1-6) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-square border border-gray-400 bg-white winxp-bevel-in flex items-center justify-center overflow-hidden">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 winxp-button text-xs w-7 h-7 p-0"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 winxp-button text-xs w-7 h-7 p-0"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {product.discountPercent && (
                <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-xs px-2 py-0.5 rounded-xs shadow">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 border ${
                      activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles y Configuración de Compra (Col 7-12) */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase">
                Categoría: {product.category}
              </div>
              <h1 className="text-xl font-bold text-gray-900 mt-1">
                {product.title}
              </h1>
              <div className="text-sm font-bold text-red-700 mt-1">
                ${(product.salePrice ?? product.price).toLocaleString('es-CL')} CLP
                {product.salePrice && (
                  <span className="text-xs text-gray-500 line-through ml-2 font-normal">
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed border-t border-b border-gray-300 py-2">
              {product.description}
            </p>

            {/* Selección de Talla */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">
                Seleccionar Talla Disponible:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`winxp-button text-xs py-1 px-3 ${
                      selectedSize === s ? 'winxp-button-primary bg-blue-100 font-bold' : ''
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sucursal de Retiro Inmediato */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                <span>Sucursal de Retiro Inmediato (Chile Central):</span>
              </label>
              <select
                value={selectedPickupBranch}
                onChange={(e) => setSelectedPickupBranch(e.target.value)}
                className="winxp-input w-full text-xs py-1"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.city} - {b.name} ({b.address})
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de Agregar al Carrito */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="winxp-button winxp-button-primary text-sm py-2 px-6 w-full font-bold text-blue-900"
              >
                <PixelIcon name="cart" size={16} />
                <span>AÑADIR ESTA PRENDA AL CARRITO</span>
              </button>

              {addedAlert && (
                <div className="mt-2 p-2 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span>¡Prenda añadida al carrito con éxito! Ya puedes completar la compra.</span>
                </div>
              )}
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

        {/* Sección de Reseñas de Clientes */}
        <div className="mt-6 pt-4 border-t border-gray-300 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-blue-900">
              Comentarios y Valoraciones de Clientes ({reviews.length})
            </h3>
            <div className="text-xs text-gray-600 font-semibold">
              ★ 4.8 / 5.0 Promedio General
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="p-3 bg-gray-50 border border-gray-300 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{rev.userName}</span>
                  <span className="text-[10px] text-gray-500">{rev.date}</span>
                </div>
                <div className="flex text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
