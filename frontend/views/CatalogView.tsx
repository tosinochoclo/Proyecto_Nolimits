import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Sparkles, MapPin } from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { PixelButton } from '../components/common/PixelButton';
import { INITIAL_PRODUCTS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';

export const CatalogView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const { addToCart } = useCart();
  const { branches, activeBranchId, setActiveBranchId } = useBranch();

  const categories = ['all', 'Polerones & Hoodies', 'Pantalones & Cargos', 'Poleras & Tops', 'Accesorios & Joyería'];
  const sizes = ['all', 'S', 'M', 'L', 'XL', 'XXL', 'Única (Ajustable)'];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      if (product.isHidden) return false;

      // Category filter
      if (selectedCategory !== 'all' && !product.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      // Branch stock filter
      if (activeBranchId !== 'all') {
        const stockInBranch = product.stockPerBranch[activeBranchId] ?? 0;
        if (stockInBranch <= 0) return false;
      }

      // Size filter
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // Search term filter
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

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar Window */}
      <WindowFrame
        title="Catalog_Query.exe - [Buscador Avanzado & Filtros]"
        variant="lavender"
        statusBarText={`PRODUCTOS ENCONTRADOS: ${filteredProducts.length} // STOCK CENTRAL SINCRONIZADO`}
      >
        <div className="space-y-4">
          {/* Main Search Input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por prenda, serigrafía, tela o tag Y2K..."
                className="w-full bevel-sunken px-9 py-2 text-sm text-white placeholder-slate-400 font-['Chakra_Petch'] focus:outline-none focus:border-[#ff007f]"
              />
              <Search className="w-4 h-4 text-[#ff007f] absolute left-3 top-3" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 font-['Silkscreen'] text-xs text-slate-400 hover:text-white"
                >
                  X
                </button>
              )}
            </div>

            {/* Quick Branch Selector */}
            <div className="flex items-center gap-1 bevel-sunken px-3 py-1 bg-black/60 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span className="font-['Silkscreen'] text-[10px] text-slate-400">FILTRAR TIENDA:</span>
              <select
                value={activeBranchId}
                onChange={(e) => setActiveBranchId(e.target.value)}
                className="bg-transparent text-[#00d4ff] font-['Silkscreen'] text-xs focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0e0c16]">Todas (Viña, Valpo, Quilpué)</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id} className="bg-[#0e0c16]">
                    {b.name.replace('Sucursal ', '')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Controls: Categories, Sizes & Order */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2d2242] text-xs">
            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-['Silkscreen'] text-[10px] text-slate-400 mr-1">CATEGORÍAS:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-2.5 py-1 text-[11px] font-['Silkscreen'] select-none cursor-pointer transition-all
                    ${selectedCategory === cat
                      ? 'bevel-raised bg-gradient-to-r from-[#ff007f] to-[#7c3aed] text-white font-bold'
                      : 'bevel-sunken text-slate-300 hover:text-white hover:bg-[#1a1426]'
                    }
                  `}
                >
                  {cat === 'all' ? 'TODAS' : cat.split('&')[0].trim()}
                </button>
              ))}
            </div>

            {/* Sorting & Size filter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="font-['Silkscreen'] text-[10px] text-slate-400">TALLA:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bevel-sunken px-2 py-1 bg-black text-white font-['Silkscreen'] text-[10px] focus:outline-none"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-['Silkscreen'] text-[10px] text-slate-400">ORDEN:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bevel-sunken px-2 py-1 bg-black text-white font-['Silkscreen'] text-[10px] focus:outline-none"
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

      {/* Product Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const stock =
            activeBranchId === 'all'
              ? product.totalStock
              : product.stockPerBranch[activeBranchId] ?? 0;

          return (
            <div
              key={product.id}
              className="bevel-chrome bg-[#0a0813] flex flex-col group overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-black">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {product.discountPercent && (
                  <span className="absolute top-2 left-2 bg-[#ff007f] text-white font-['Silkscreen'] text-[10px] px-2 py-0.5 bevel-raised">
                    -{product.discountPercent}% OFF
                  </span>
                )}
                <span className="absolute bottom-2 right-2 bg-black/80 text-[#00d4ff] font-['VT323'] text-xs px-2 py-0.5 border border-[#00d4ff]/40">
                  DISP: {stock} un.
                </span>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="font-['VT323'] text-xs text-[#a855f7] tracking-wider">
                    {product.category}
                  </div>
                  <h3 className="font-['Chakra_Petch'] font-bold text-sm text-white line-clamp-1 group-hover:text-[#ff007f] transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-yellow-400 font-mono mt-0.5">
                    <span>★ {product.rating.toFixed(1)}</span>
                    <span className="text-slate-500">({product.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-['Silkscreen'] text-base text-white">
                    ${(product.salePrice ?? product.price).toLocaleString('es-CL')}
                  </span>
                  {product.salePrice && (
                    <span className="font-['Chakra_Petch'] text-xs line-through text-slate-500">
                      ${product.price.toLocaleString('es-CL')}
                    </span>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <PixelButton variant="retro" size="sm" className="w-full">
                      Detalle
                    </PixelButton>
                  </Link>

                  <PixelButton
                    variant="primary"
                    size="sm"
                    onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                    disabled={stock <= 0}
                  >
                    + Carrito
                  </PixelButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bevel-sunken p-8 text-center space-y-2">
          <p className="font-['Silkscreen'] text-white text-sm">NO SE ENCONTRARON PRENDAS</p>
          <p className="font-['Chakra_Petch'] text-xs text-slate-400">
            Prueba ajustando los filtros o seleccionando "Todas las Sucursales" para ver el inventario total.
          </p>
          <PixelButton
            variant="retro"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedSize('all');
              setActiveBranchId('all');
            }}
          >
            Restablecer Filtros
          </PixelButton>
        </div>
      )}
    </div>
  );
};
