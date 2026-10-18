import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Info, XCircle } from 'lucide-react';
import { Product } from '../../../types';
import { PixelIcon, PixelHeart } from '../../common/PixelIcon';
import { SoldOutCardOverlay } from '../../common/SoldOutState';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  currentStock: number;
  isRecentlyAdded: boolean;
  onQuickAdd: (product: Product) => void;
  onWishlistToggle?: (product: Product, result: { success: boolean; isAdded: boolean; requiresAuth: boolean }) => void;
}

/**
 * ProductCard: Tarjeta de producto estilo Windows XP.
 * 
 * Directrices aplicadas:
 * - Fondo blanco limpio (#ffffff).
 * - Tipografía pequeña no pixelada y de máxima legibilidad (Tahoma).
 * - Componente y overlay oficial de "Agotado" para productos sin stock.
 * - Botón de Lista de Deseos (Corazón Pixel Art Windows XP).
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentStock,
  isRecentlyAdded,
  onQuickAdd,
  onWishlistToggle,
}) => {
  const isSoldOut = currentStock <= 0;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className={`product-card-xp ${isSoldOut ? 'opacity-95' : ''}`}>
      {/* Vista previa de imagen con etiquetas de stock y descuento */}
      <div className="product-card-xp-media relative">
        <img
          src={isSoldOut && product.images[0] ? product.images[0] : product.images[0]}
          alt={product.title}
          className={`product-card-xp-img ${isSoldOut ? 'grayscale-30 contrast-90' : ''}`}
          loading="lazy"
        />

        {/* Botón rápido de Lista de Deseos con Corazón Pixel Art */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const result = toggleWishlist(product);
            if (onWishlistToggle) {
              onWishlistToggle(product, result);
            }
          }}
          className={`absolute top-1.5 right-1.5 w-7.5 h-7.5 winxp-button p-0 z-10 cursor-pointer transition-transform active:scale-90 flex items-center justify-center shadow-xs ${
            isWishlisted
              ? 'border-red-600 bg-rose-50 shadow-inner'
              : 'border-[#003c74]'
          }`}
          title={
            !isAuthenticated
              ? 'Añadir a Lista de Deseos (Exclusivo para usuarios registrados)'
              : isWishlisted
              ? 'Quitar de mi Lista de Deseos'
              : 'Añadir a mi Lista de Deseos'
          }
          aria-label="Lista de Deseos"
        >
          <PixelHeart filled={isWishlisted} size={16} />
        </button>

        {/* Overlay oficial de Agotado */}
        {isSoldOut && <SoldOutCardOverlay />}

        {product.discountPercent && !isSoldOut && (
          <span className="product-card-xp-discount">
            -{product.discountPercent}% OFF
          </span>
        )}

        <span
          className={`product-card-xp-stock ${
            isSoldOut ? 'bg-red-700 text-white font-bold border-red-900' : ''
          }`}
        >
          {isSoldOut ? '0 un. (Agotado)' : `Stock: ${currentStock} un.`}
        </span>
      </div>

      {/* Información detallada del producto */}
      <div className="product-card-xp-info">
        <div>
          <div className="product-card-xp-category flex items-center justify-between">
            <span>{product.category}</span>
            {isSoldOut && (
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                Sin Stock
              </span>
            )}
          </div>
          <h3 className="product-card-xp-title" title={product.title}>
            {product.title}
          </h3>
        </div>

        {/* Precios en moneda chilena */}
        <div>
          <span className={`product-card-xp-price ${isSoldOut ? 'text-gray-600' : ''}`}>
            ${(product.salePrice ?? product.price).toLocaleString('es-CL')}
          </span>
          {product.salePrice && (
            <span className="product-card-xp-oldprice">
              ${product.price.toLocaleString('es-CL')}
            </span>
          )}
        </div>

        {/* Acciones: Ver Ficha y Añadir al Carrito con Pixel Cart */}
        <div className="flex items-center gap-1.5 pt-1">
          <Link to={`/product/${product.id}`} className="flex-1">
            <button
              type="button"
              className="winxp-button text-xs py-1 w-full text-gray-800"
            >
              <Info className="w-3 h-3 text-blue-700" />
              <span>Ver Detalle</span>
            </button>
          </Link>

          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            disabled={isSoldOut}
            className={`winxp-button text-xs py-1 px-2.5 font-bold ${
              isSoldOut
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400'
                : isRecentlyAdded
                ? 'bg-green-100 text-green-900 border-green-600'
                : 'winxp-button-primary text-blue-900'
            }`}
            title={isSoldOut ? 'Prenda agotada en todos los nodos' : 'Añadir al Carrito'}
          >
            {isSoldOut ? (
              <>
                <XCircle className="w-3.5 h-3.5 text-red-500" />
                <span>Agotado</span>
              </>
            ) : isRecentlyAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-700" />
                <span>¡Listo!</span>
              </>
            ) : (
              <>
                <PixelIcon name="cart" size={14} />
                <span>+ Carro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
