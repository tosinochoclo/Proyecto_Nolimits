import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Info, Check, Flame, Tag, Sparkles, XCircle } from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { INITIAL_PRODUCTS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { PixelIcon } from '../components/common/PixelIcon';
import { SoldOutCardOverlay } from '../components/common/SoldOutState';
import { Product } from '../types';

export const CatalogView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [saleSubCategory, setSaleSubCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'discount'>('featured');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { addToCart } = useCart();

  // Función para determinar si la categoría corresponde a prendas de ropa con tallas
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

  // La opción de talla SOLO está disponible para categorías de ropa (polerones, chaquetas, pantalones, poleras)
  const showSizeFilter =
    isApparelCategory(selectedCategory) ||
    (selectedCategory === 'Ofertas' && saleSubCategory !== 'all' && isApparelCategory(saleSubCategory));

  // Lista de Categorías
  const categories = [
    'all',
    'Polerones & Hoodies',
    'Chaquetas',
    'Pantalones & Cargos',
    'Poleras & Tops',
    'Accesorios & Joyería',
    'Carteras',
    'Gorras',
    'Ofertas',
  ];

  // Sub-categorías para el filtro condicional cuando la categoría activa es 'Ofertas'
  const saleSubCategories = [
    { id: 'all', label: 'Todas las Ofertas' },
    { id: 'Polerones & Hoodies', label: 'Polerones' },
    { id: 'Chaquetas', label: 'Chaquetas' },
    { id: 'Pantalones & Cargos', label: 'Pantalones' },
    { id: 'Poleras & Tops', label: 'Poleras' },
    { id: 'Accesorios & Joyería', label: 'Accesorios' },
    { id: 'Carteras', label: 'Carteras' },
    { id: 'Gorras', label: 'Gorras' },
  ];

  // Opciones de talla renombrando 'Única Ajustable' a 'Talla estándar' (mantiene S, M, L, XL, XXL, XLL)
  const sizes = ['all', 'S', 'M', 'L', 'XL', 'XXL', 'XLL', 'Talla estándar'];

  // Conteo dinámico de ofertas disponibles por subcategoría
  const saleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    saleSubCategories.forEach((sub) => {
      counts[sub.id] = 0;
    });

    INITIAL_PRODUCTS.forEach((p) => {
      if (p.isHidden) return;
      const isSale = Boolean(
        (p.salePrice && p.salePrice < p.price) || (p.discountPercent && p.discountPercent > 0)
      );
      if (!isSale) return;

      counts.all = (counts.all || 0) + 1;
      saleSubCategories.forEach((sub) => {
        if (sub.id !== 'all' && p.category.toLowerCase().includes(sub.id.toLowerCase())) {
          counts[sub.id] = (counts[sub.id] || 0) + 1;
        }
      });
    });

    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      if (product.isHidden) return false;

      // 1. Filtro especial por Categoría dedicada 'Ofertas' o categoría normal
      if (selectedCategory === 'Ofertas') {
        const isSale = Boolean(
          (product.salePrice && product.salePrice < product.price) ||
          (product.discountPercent && product.discountPercent > 0)
        );
        if (!isSale) return false;

        // Sub-filtro condicional de ofertas por categoría original
        if (saleSubCategory !== 'all') {
          if (!product.category.toLowerCase().includes(saleSubCategory.toLowerCase())) {
            return false;
          }
        }
      } else if (selectedCategory !== 'all') {
        if (!product.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // 2. Filtro por talla (solamente aplicable para ropa que posee tallas)
      if (selectedSize !== 'all' && showSizeFilter) {
        if (isApparelCategory(product.category)) {
          const matches = product.sizes.some((s) => {
            if (s === selectedSize) return true;
            if (selectedSize === 'Talla estándar' && (s === 'Única (Ajustable)' || s === 'Talla estándar')) return true;
            if (selectedSize === 'XLL' && (s === 'XXL' || s === 'XLL')) return true;
            return false;
          });
          if (!matches) return false;
        }
      }

      // 3. Filtro por texto de búsqueda
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
      if (sortBy === 'discount') return (b.discountPercent ?? 0) - (a.discountPercent ?? 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, saleSubCategory, selectedSize, searchTerm, sortBy]);

  const handleQuickAdd = (product: Product) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSaleSubCategory('all');
    setSelectedSize('all');
    setSearchTerm('');
    setSortBy('featured');
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
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar prenda, chaqueta, cartera, gorra, color o código de catálogo..."
                className="w-full winxp-input px-3 pr-8 py-1.5 text-xs text-black placeholder-gray-500"
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
          </div>

          {/* Categorías como carpetas o botones biselados */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-300 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-gray-700 mr-1 text-[11px]">Categorías:</span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const isOfertas = cat === 'Ofertas';

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSize('all');
                      if (cat !== 'Ofertas') {
                        setSaleSubCategory('all');
                      }
                    }}
                    className={`winxp-button text-[11px] py-0.5 px-2.5 flex items-center gap-1 transition-all ${
                      isOfertas
                        ? isSelected
                          ? 'bg-red-600 text-white font-bold border-red-800 shadow-sm'
                          : 'bg-red-50 text-red-700 border-red-300 font-bold hover:bg-red-100'
                        : isSelected
                        ? 'winxp-button-primary bg-blue-100 font-bold'
                        : ''
                    }`}
                  >
                    {isOfertas ? (
                      <>
                        <Flame
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-yellow-300 animate-pulse' : 'text-red-600'
                          }`}
                        />
                        <span>Ofertas</span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ml-0.5 ${
                            isSelected ? 'bg-red-800 text-yellow-200' : 'bg-red-200 text-red-900'
                          }`}
                        >
                          {saleCounts.all}
                        </span>
                      </>
                    ) : (
                      <>
                        <PixelIcon name="folder" size={13} className="mr-0.5" />
                        <span>
                          {cat === 'all'
                            ? 'Todas'
                            : cat.includes('&')
                            ? cat.split('&')[0].trim()
                            : cat}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Filtros de Talla y Orden */}
            <div className="flex items-center gap-3">
              {showSizeFilter && (
                <div className="flex items-center gap-1 text-[11px] animate-fadeIn">
                  <span className="font-bold text-gray-700">Talla:</span>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="winxp-input py-0.5 px-1 text-xs"
                    aria-label="Filtrar por talla"
                  >
                    {sizes.map((s) => (
                      <option key={s} value={s}>
                        {s === 'all' ? 'Todas las tallas' : s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  <option value="discount">Mayor % Descuento</option>
                  <option value="rating">Mejor Calificación</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===================================================================
              SUB-FILTRO CONDICIONAL DEDICADO A LA SECCIÓN 'OFERTAS'
              =================================================================== */}
          {selectedCategory === 'Ofertas' && (
            <div className="bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border border-red-300 p-2.5 winxp-bevel-in rounded-sm space-y-2 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-200/80 pb-1.5">
                <div className="flex items-center gap-1.5 text-xs text-red-900 font-bold">
                  <Tag className="w-3.5 h-3.5 text-red-600" />
                  <span>Sub-filtrar Ofertas por Categoría:</span>
                  <span className="text-[11px] text-red-700 font-normal hidden md:inline">
                    (Prendas liquidación con descuento sobre precio de lista)
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 text-[10px] text-red-700 font-mono bg-white px-2 py-0.5 rounded border border-red-300 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Descuentos de hasta -30% OFF</span>
                </div>
              </div>

              {/* Botones de sub-filtro condicional */}
              <div className="flex flex-wrap items-center gap-1.5">
                {saleSubCategories.map((sub) => {
                  const count = saleCounts[sub.id] ?? 0;
                  const isSelected = saleSubCategory === sub.id;

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setSaleSubCategory(sub.id);
                        setSelectedSize('all');
                      }}
                      className={`winxp-button text-[11px] py-1 px-2.5 flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white font-bold border-red-800 shadow-xs'
                          : 'bg-white text-gray-800 hover:bg-red-100/60 border-gray-400'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isSelected
                            ? 'bg-white text-red-700'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </WindowFrame>

      {/* Grilla de Resultados */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-8 border border-gray-400 winxp-bevel-in text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <PixelIcon name="info" size={24} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm">
            No se encontraron prendas con los filtros seleccionados
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            {selectedCategory === 'Ofertas' && saleSubCategory !== 'all'
              ? `No hay ofertas activas en la subcategoría "${saleSubCategory}". Prueba seleccionando "Todas las Ofertas".`
              : 'Prueba buscando con otros términos o seleccionando otra sucursal o categoría.'}
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900"
          >
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const stock = product.totalStock;
            const isSoldOut = stock <= 0;
            const isRecentlyAdded = addedProductId === product.id;

            return (
              <div key={product.id} className={`product-card-xp ${isSoldOut ? 'opacity-95' : ''}`}>
                {/* Vista previa de imagen con badges */}
                <div className="product-card-xp-media relative">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className={`product-card-xp-img ${isSoldOut ? 'grayscale-30 contrast-90' : ''}`}
                    loading="lazy"
                  />

                  {/* Componente Overlay de Agotado */}
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
                    {isSoldOut ? '0 un. (Agotado)' : `Stock: ${stock} un.`}
                  </span>
                </div>

                {/* Información de la prenda */}
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

                  {/* Precios */}
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

                  {/* Acciones */}
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
                      onClick={() => handleQuickAdd(product)}
                      disabled={isSoldOut}
                      className={`winxp-button text-xs py-1 px-2.5 font-bold ${
                        isSoldOut
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400'
                          : isRecentlyAdded
                          ? 'bg-green-100 text-green-900 border-green-600'
                          : 'winxp-button-primary text-blue-900'
                      }`}
                      title={isSoldOut ? 'Sin stock disponible en ningún nodo' : 'Añadir al Carrito'}
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
          })}
        </div>
      )}
    </div>
  );
};
