import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WindowFrame } from '../../layout/WindowFrame';
import { Product } from '../../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import { PixelIcon } from '../../common/PixelIcon';
import './FeaturedCatalog.css';

interface FeaturedCatalogProps {
  products: Product[];
  activeBranchId: string;
  addedProductId: string | null;
  onQuickAdd: (product: Product) => void;
}

/**
 * FeaturedCatalog: Escaparate de prendas destacadas dentro de una ventana Windows XP.
 * Fondo blanco limpio, tipografía nítida y delegación de eventos al ProductCard.
 */
export const FeaturedCatalog: React.FC<FeaturedCatalogProps> = ({
  products,
  activeBranchId,
  addedProductId,
  onQuickAdd,
}) => {
  return (
    <WindowFrame
      title="CATALOGO_DESTACADOS.EXE - [Colección Drop Actual]"
      subtitle="Filtrado por inventario físico en tiempo real"
      icon={<PixelIcon name="folder-open" size={16} />}
      statusBarText={`TOTAL PRENDAS DISPONIBLES: ${products.length} // RETIRO INMEDIATO EN SUCURSALES`}
    >
      <div>
        {/* Cabecera del Catálogo */}
        <div className="featured-catalog-xp-header">
          <div>
            <h2 className="featured-catalog-xp-title">
              Prendas Exclusivas del Drop de Temporada
            </h2>
            <p className="text-xs text-gray-600 mt-0.5 font-sans">
              Piezas limitadas y serigrafía artesanal listas para despacho nacional o retiro en tienda.
            </p>
          </div>

          <Link to="/catalog">
            <button
              type="button"
              className="winxp-button text-xs py-1 px-3 text-blue-900 font-bold"
            >
              <PixelIcon name="search" size={14} />
              <span>Abrir Catálogo Completo</span>
              <ArrowRight className="w-3 h-3 text-blue-700 ml-1" />
            </button>
          </Link>
        </div>

        {/* Grilla de Productos */}
        <div className="featured-catalog-xp-grid">
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
  );
};
