import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { Product } from '../../../types';
import { PixelButton } from '../../common/PixelButton';
import './ProductCard.css';

interface ProductCardProps {
  /** Objeto completo de la prenda con información de precio, stock y fotos */
  product: Product;
  /** Cantidad de unidades disponibles en la sucursal seleccionada */
  currentStock: number;
  /** Estado transitorio de feedback visual al agregar al carro */
  isRecentlyAdded: boolean;
  /** Disparador de compra rápida con talle y color por defecto */
  onQuickAdd: (product: Product) => void;
}

/**
 * Componente: ProductCard
 * 
 * Propósito:
 * Tarjeta individual para mostrar cada producto en la grilla destacada.
 * Maneja el estado de stock en tiempo real, descuentos, y botones de acción.
 * 
 * Buenas prácticas:
 * - Estilos segregados en ProductCard.css
 * - Lógica de presentación pura y props desacopladas
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentStock,
  isRecentlyAdded,
  onQuickAdd,
}) => {
  return (
    <div className="product-card-root bevel-chrome group">
      {/* Vista previa de la imagen y etiquetas flotantes */}
      <div className="product-card-media">
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-card-image"
          loading="lazy"
        />

        {product.discountPercent && (
          <span className="product-card-discount bevel-raised">
            -{product.discountPercent}% OFF
          </span>
        )}

        <span className="product-card-stock">
          STOCK: {currentStock} un.
        </span>
      </div>

      {/* Datos del producto y precio */}
      <div className="product-card-details">
        <div>
          <div className="product-card-category">
            {product.category}
          </div>
          <h3 className="product-card-title">
            {product.title}
          </h3>
        </div>

        <div className="product-card-price-group">
          <span className="product-card-price-main">
            ${(product.salePrice ?? product.price).toLocaleString('es-CL')}
          </span>
          {product.salePrice && (
            <span className="product-card-price-old">
              ${product.price.toLocaleString('es-CL')}
            </span>
          )}
        </div>

        {/* Acciones de compra y detalle */}
        <div className="product-card-actions">
          <Link to={`/product/${product.id}`} className="flex-1">
            <PixelButton variant="retro" size="sm" className="w-full text-xs">
              Ver Ficha
            </PixelButton>
          </Link>

          <PixelButton
            variant={isRecentlyAdded ? 'accent' : 'primary'}
            size="sm"
            onClick={() => onQuickAdd(product)}
            disabled={currentStock <= 0}
            title={currentStock <= 0 ? 'Sin stock disponible' : 'Añadir al Carrito'}
            icon={
              isRecentlyAdded ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )
            }
          >
            {isRecentlyAdded ? '¡Listo!' : '+ Carro'}
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
