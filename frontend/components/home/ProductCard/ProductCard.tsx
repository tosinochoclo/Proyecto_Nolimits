import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { Product } from '../../../types';
import { PixelIcon } from '../../common/PixelIcon';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  currentStock: number;
  isRecentlyAdded: boolean;
  onQuickAdd: (product: Product) => void;
}

/**
 * ProductCard: Tarjeta de producto estilo Windows XP.
 * 
 * Directrices aplicadas:
 * - Fondo blanco limpio (#ffffff).
 * - Tipografía pequeña no pixelada y de máxima legibilidad (Tahoma).
 * - Botón de compra con icono retro pixel art del carrito de compras.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentStock,
  isRecentlyAdded,
  onQuickAdd,
}) => {
  return (
    <div className="product-card-xp">
      {/* Vista previa de imagen con etiquetas de stock y descuento */}
      <div className="product-card-xp-media">
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-card-xp-img"
          loading="lazy"
        />

        {product.discountPercent && (
          <span className="product-card-xp-discount">
            -{product.discountPercent}%
          </span>
        )}

        <span className="product-card-xp-stock">
          Stock: {currentStock} un.
        </span>
      </div>

      {/* Información detallada del producto */}
      <div className="product-card-xp-info">
        <div>
          <div className="product-card-xp-category">
            {product.category}
          </div>
          <h3 className="product-card-xp-title" title={product.title}>
            {product.title}
          </h3>
        </div>

        {/* Precios en moneda chilena */}
        <div>
          <span className="product-card-xp-price">
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
              <span>Ver Ficha</span>
            </button>
          </Link>

          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            disabled={currentStock <= 0}
            className={`winxp-button text-xs py-1 px-2.5 font-bold ${
              isRecentlyAdded
                ? 'bg-green-100 text-green-900 border-green-600'
                : 'winxp-button-primary text-blue-900'
            }`}
            title={currentStock <= 0 ? 'Sin stock disponible' : 'Añadir al Carrito'}
          >
            {isRecentlyAdded ? (
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
