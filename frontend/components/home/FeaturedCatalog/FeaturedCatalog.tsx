import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WindowFrame } from '../../layout/WindowFrame';
import { Product } from '../../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import './FeaturedCatalog.css';

interface FeaturedCatalogProps {
  /** Colección de productos a presentar en el catálogo principal */
  products: Product[];
  /** ID de la sucursal seleccionada o 'all' para stock global */
  activeBranchId: string;
  /** ID del producto recién agregado para disparar animación de feedback */
  addedProductId: string | null;
  /** Función para añadir directamente un producto al carrito */
  onQuickAdd: (product: Product) => void;
}

/**
 * Componente: FeaturedCatalog
 * 
 * Propósito:
 * Muestra el escaparate de prendas exclusivas dentro de una ventana retro-futurista,
 * gestionando el cálculo de stock reactivo por sucursal y la delegación de eventos al ProductCard.
 * 
 * Buenas prácticas:
 * - Estilos segregados en FeaturedCatalog.css
 * - Modularización: delega el renderizado individual en ProductCard
 */
export const FeaturedCatalog: React.FC<FeaturedCatalogProps> = ({
  products,
  activeBranchId,
  addedProductId,
  onQuickAdd,
}) => {
  return (
    <div className="featured-catalog-section">
      <WindowFrame
        title="FEATURED_CATALOG.BIN - [Prendas Destacadas & Live Drops]"
        variant="lavender"
        statusBarText="FILTRADO POR STOCK DISPONIBLE EN SUCURSAL SELECCIONADA // CHECKOUT SEGURO WEBPAY"
      >
        <div>
          {/* Cabecera de la sección con enlace al catálogo completo */}
          <div className="featured-catalog-header">
            <div>
              <h2 className="featured-catalog-title">
                PRENDAS EXCLUSIVAS DEL DROP
              </h2>
              <span className="featured-catalog-subtitle">
                // PIEZAS ÚNICAS LISTAS PARA DESPACHO O RETIRO EN LOCAL
              </span>
            </div>

            <Link
              to="/catalog"
              className="featured-catalog-link bevel-sunken"
            >
              <span>ABRIR CATÁLOGO ENTERO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grilla responsiva de tarjetas de productos */}
          <div className="featured-catalog-grid">
            {products.map((product) => {
              const currentStock =
                activeBranchId === 'all'
                  ? product.totalStock
                  : product.stockPerBranch[activeBranchId] ?? 0;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentStock={currentStock}
                  isRecentlyAdded={addedProductId === product.id}
                  onQuickAdd={onQuickAdd}
                />
              );
            })}
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
