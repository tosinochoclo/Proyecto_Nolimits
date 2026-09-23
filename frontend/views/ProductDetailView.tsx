import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  Star,
  ThumbsUp,
  Image as ImageIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { PixelButton } from '../components/common/PixelButton';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';

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

  // Reviews for this product
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
    <div className="space-y-6">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 font-['Silkscreen'] text-xs text-[#a855f7] hover:text-[#ff007f] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>VOLVER AL CATÁLOGO</span>
      </Link>

      {/* Main Product Window */}
      <WindowFrame
        title={`ITEM_VIEW.EXE - [${product.sku}] - ${product.title}`}
        variant="lavender"
        statusBarText={`STOCK AUDIT: VERIFICADO // SUCURSALES ACTIVAS: ${product.branchesEnabled.length}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Gallery Carousel (Col 1-7) */}
          <div className="lg:col-span-6 space-y-3">
            {/* Main Stage */}
            <div className="relative aspect-square bevel-chrome overflow-hidden bg-black flex items-center justify-center">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 win-btn w-7 h-7 bg-black/60 text-white"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 win-btn w-7 h-7 bg-black/60 text-white"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {product.discountPercent && (
                <span className="absolute top-3 left-3 bg-[#ff007f] text-white font-['Silkscreen'] text-xs px-2.5 py-1 bevel-raised shadow-lg">
                  -{product.discountPercent}% OFF LIVE
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`
                      w-16 h-16 shrink-0 bevel-raised overflow-hidden cursor-pointer
                      ${activeImageIndex === idx ? 'border-2 border-[#ff007f] scale-105' : 'opacity-70 hover:opacity-100'}
                    `}
                  >
                    <img src={img} alt={`Vista ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Purchasing Control Panel (Col 8-12) */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 font-['VT323'] text-sm text-[#00d4ff]">
                <span>SKU: {product.sku}</span>
                <span>// CATEGORÍA: {product.category}</span>
              </div>
              <h1 className="font-['Syne'] font-extrabold text-2xl sm:text-3xl text-white mt-1">
                {product.title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="bevel-sunken p-3 flex items-baseline gap-3 bg-black/80">
              <span className="font-['Silkscreen'] text-2xl sm:text-3xl text-[#ff007f]">
                ${(product.salePrice ?? product.price).toLocaleString('es-CL')}
              </span>
              {product.salePrice && (
                <span className="font-['Chakra_Petch'] text-sm line-through text-slate-500">
                  ${product.price.toLocaleString('es-CL')}
                </span>
              )}
              <span className="font-mono text-[10px] text-green-400 bg-green-950/60 px-2 py-0.5 border border-green-700 ml-auto">
                EN STOCK FÍSICO
              </span>
            </div>

            {/* Description */}
            <p className="font-['Chakra_Petch'] text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Tallas Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-['Silkscreen']">
                <span className="text-slate-300">TALLAS DISPONIBLES:</span>
                <span className="text-[#00d4ff] text-[10px]">GUÍA Y2K OVERSIZED</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-3 py-1.5 font-['Silkscreen'] text-xs cursor-pointer select-none
                      ${selectedSize === size
                        ? 'bevel-raised bg-[#ff007f] text-white font-bold'
                        : 'bevel-sunken bg-[#151121] text-slate-300 hover:text-white'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores Selector */}
            <div className="space-y-1.5">
              <span className="font-['Silkscreen'] text-xs text-slate-300">
                COLOR: <span className="text-[#a855f7]">{selectedColor.name}</span>
              </span>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    className={`
                      w-7 h-7 rounded-xs bevel-raised cursor-pointer
                      ${selectedColor.name === color.name ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-80 hover:opacity-100'}
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Stock per Branch Breakdown */}
            <div className="bevel-sunken p-3 bg-black/60 space-y-1.5 text-xs">
              <div className="font-['Silkscreen'] text-[11px] text-[#00d4ff] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>INVENTARIO LOCAL POR TIENDA:</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-['Chakra_Petch'] text-[11px]">
                {branches.map((b) => {
                  const qty = product.stockPerBranch[b.id] ?? 0;
                  return (
                    <div key={b.id} className="bevel-sunken p-1.5 text-center">
                      <div className="text-slate-400 truncate">{b.city}</div>
                      <div className={`font-bold font-mono ${qty > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {qty > 0 ? `${qty} un.` : 'Agotado'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <PixelButton
                variant="primary"
                size="lg"
                className="w-full text-base py-3"
                onClick={handleAddToCart}
              >
                AÑADIR AL CARRITO :: ${(product.salePrice ?? product.price).toLocaleString('es-CL')}
              </PixelButton>

              {addedAlert && (
                <div className="p-2 bevel-sunken bg-green-950/80 border border-green-500 text-green-300 font-['Silkscreen'] text-xs text-center animate-in fade-in">
                  ✓ ¡PRENDA AGREGADA AL CARRITO DE COMPRAS!
                </div>
              )}
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* Customer Reviews & Feedback Window */}
      <WindowFrame
        title="REVIEWS_AND_RATINGS.LOG - [Valoraciones de Clientes]"
        variant="chrome"
        statusBarText="VERIFICADO POR TRANSACCIONES REALES DE WEBPAY Y SUCURSALES"
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#291d3d]">
            <div>
              <h2 className="font-['Silkscreen'] text-base text-white">RESEÑAS DEL DROP</h2>
              <div className="flex items-center gap-2 font-mono text-sm text-yellow-400">
                <span>★ ★ ★ ★ ★ {product.rating.toFixed(1)} / 5.0</span>
                <span className="text-slate-400 font-['Chakra_Petch']">({product.reviewCount} compras verificadas)</span>
              </div>
            </div>

            {/* Review interactive filters */}
            <div className="flex flex-wrap items-center gap-1.5 font-['Silkscreen'] text-[10px]">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-2 py-1 ${reviewFilter === 'all' ? 'bevel-raised bg-[#7c3aed] text-white' : 'bevel-sunken text-slate-300'}`}
              >
                TODAS
              </button>
              <button
                onClick={() => setReviewFilter('with_images')}
                className={`px-2 py-1 flex items-center gap-1 ${reviewFilter === 'with_images' ? 'bevel-raised bg-[#7c3aed] text-white' : 'bevel-sunken text-slate-300'}`}
              >
                <ImageIcon className="w-3 h-3" /> CON FOTOS
              </button>
              <button
                onClick={() => setReviewFilter('5_stars')}
                className={`px-2 py-1 ${reviewFilter === '5_stars' ? 'bevel-raised bg-[#7c3aed] text-white' : 'bevel-sunken text-slate-300'}`}
              >
                5 ESTRELLAS
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="bevel-sunken p-3 bg-black/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-['Silkscreen'] text-white font-bold">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="font-['VT323'] text-green-400 border border-green-500/40 px-1">
                        COMPRA VERIFICADA ({rev.branchPurchased})
                      </span>
                    )}
                  </div>
                  <span className="font-['VT323'] text-slate-400">{rev.date}</span>
                </div>

                <div className="text-yellow-400 text-xs font-mono">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </div>

                <h4 className="font-['Chakra_Petch'] font-bold text-sm text-slate-100">{rev.title}</h4>
                <p className="font-['Chakra_Petch'] text-xs text-slate-300">{rev.comment}</p>

                {rev.photos.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.photos.map((p, i) => (
                      <img key={i} src={p} alt="User fit" className="w-16 h-16 object-cover bevel-raised" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
