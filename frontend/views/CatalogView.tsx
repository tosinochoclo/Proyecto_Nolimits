import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Info, Check } from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { INITIAL_PRODUCTS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';
import { PixelIcon } from '../components/common/PixelIcon';
import { Product } from '../types';

export const CatalogView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { branches, activeBranchId, setActiveBranchId } = useBranch();

  const categories = ['all', 'Polerones & Hoodies', 'Pantalones & Cargos', 'Poleras & Tops', 'Accesorios & Joyería'];
  const sizes = ['all', 'S', 'M', 'L', 'XL', 'XXL', 'Única (Ajustable)'];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      if (product.isHidden) return false;

      // Filtro por categoría
      if (selectedCategory !== 'all' && !product.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      // Filtro por sucursal física
      if (activeBranchId !== 'all') {
        const stockInBranch = product.stockPerBranch[activeBranchId] ?? 0;
        if (stockInBranch <= 0) return false;
      }

      // Filtro por talla
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // Filtro por texto de búsqueda
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTag) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, activeBranchId, selectedSize, searchTerm, sortBy]);

  const handleQuickAdd = (product: Product) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Ventana de Búsqueda y Filtros estilo Windows XP Explorer */}
      <WindowFrame
        title="Explorador_Catalogo.exe - [Buscador Avanzado & Filtros de Stock]"
        icon={<PixelIcon name="search" size={16} />}
        statusBarText={`ELEMENTOS ENCONTRADOS: ${filteredProducts.length} // SERVIDOR DE INVENTARIO CENTRAL: ACTIVO`}
      >
        <div className="space-y-3">
          {/* Fila Principal de Búsqueda */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-2.5 top-2.5 pointer-events-none">
                <PixelIcon name="search" size={15} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar prenda, tela, color o código de catálogo..."
                className="w-full winxp-input pl-8 pr-8 py-1.5 text-xs text-black placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-xs font-bold text-gray-500 hover:text-black"
                >
                  ×
                </button>
              )}
            </div>

            {/* Selector de Sucursal */}
            <div className="flex items-center gap-1.5 bg-[#f0f4f8] border border-gray-400 px-2 py-1 shrink-0 text-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              <span className="font-bold text-gray-700">Sucursal:</span>
              <select
                value={activeBranchId}
                onChange={(e) => setActiveBranchId(e.target.value)}
                className="text-xs bg-transparent focus:outline-none cursor-pointer text-blue-900 font-semibold"
              >
                <option value="all">Todas (Viña, Valpo, Quilpué)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.city} - {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categorías como carpetas o botones biselados */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-300 text-xs">
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-bold text-gray-700 mr-1 text-[11px]">Categorías:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`winxp-button text-[11px] py-0.5 px-2 ${
                    selectedCategory === cat ? 'winxp-button-primary bg-blue-100 font-bold' : ''
                  }`}
                >
                  <PixelIcon name="folder" size={13} className="mr-1" />
                  <span>{cat === 'all' ? 'Todas' : cat.split('&')[0].trim()}</span>
                </button>
              ))}
            </div>

            {/* Filtros de Talla y Orden */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px]">
                <span className="font-bold text-gray-700">Talla:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="winxp-input py-0.5 px-1 text-xs"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                <span className="font-bold text-gray-700">Orden:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="winxp-input py-0.5 px-1 text-xs"
                >
                  <option value="featured">Destacados</option>
                  <option value="price_asc">Menor Precio</option>
                  <option value="price_desc">Mayor Precio</option>
                  <option value="rating">Mejor Calificación</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* Grilla de Resultados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const stock =
            activeBranchId === 'all'
              ? product.totalStock
              : product.stockPerBranch[activeBranchId] ?? 0;

          const isRecentlyAdded = addedProductId === product.id;

          return (
            <div key={product.id} className="product-card-xp">
              {/* Vista previa de imagen con badges */}
              <div className="product-card-xp-media">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="product-card-xp-img"
                  loading="lazy"
                />

                {product.discountPercent && (
                  <span className="product-card-xp-discount">
                    -{product.discountPercent}% OFF
                  </span>
                )}

                <span className="product-card-xp-stock">
                  Stock: {stock} un.
                </span>
              </div>

              {/* Información de la prenda */}
              <div className="product-card-xp-info">
                <div>
                  <div className="product-card-xp-category">
                    {product.category}
                  </div>
                  <h3 className="product-card-xp-title" title={product.title}>
                    {product.title}
                  </h3>
                </div>

                {/* Precios */}
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

                {/* Acciones */}
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
                    onClick={() => handleQuickAdd(product)}
                    disabled={stock <= 0}
                    className={`winxp-button text-xs py-1 px-2.5 font-bold ${
                      isRecentlyAdded
                        ? 'bg-green-100 text-green-900 border-green-600'
                        : 'winxp-button-primary text-blue-900'
                    }`}
                    title={stock <= 0 ? 'Sin stock disponible' : 'Añadir al Carrito'}
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
        })}
      </div>
    </div>
  );
};
