import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Package,
  Layers,
  ArrowUpDown,
  Search,
  Filter,
  ArrowLeft,
  RefreshCw,
  Edit3,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Save,
  RotateCcw,
  Download,
  Store,
  Tag,
  DollarSign,
  Maximize2,
  X,
  Check,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { INITIAL_PRODUCTS, INITIAL_BRANCHES } from '../../services/mockData';
import { Product } from '../../types';

const STORAGE_KEY = 'nl_admin_product_stock_v1';

// Interfaz para el stock desglosado con soporte explícito de tallas
export interface ProductStockDetail extends Product {
  stockBySize: Record<string, number>; // Ej: { 'S': 4, 'M': 6, 'L': 4, 'XL': 2 }
  notes?: string;
  lastUpdated?: string;
}

// Función generadora de stock inicial por tallas si no viene predefinido
function generateInitialStockBySize(product: Product): Record<string, number> {
  if (!product.sizes || product.sizes.length === 0) {
    return {};
  }

  const sizesCount = product.sizes.length;
  const total = product.totalStock;

  if (total === 0) {
    const result: Record<string, number> = {};
    product.sizes.forEach((s) => {
      result[s] = 0;
    });
    return result;
  }

  // Distribución proporcional y balanceada
  const basePerSize = Math.floor(total / sizesCount);
  let remainder = total % sizesCount;

  const result: Record<string, number> = {};
  product.sizes.forEach((s, idx) => {
    let count = basePerSize;
    if (remainder > 0) {
      count += 1;
      remainder -= 1;
    }
    result[s] = count;
  });

  return result;
}

export const ProductStockSummaryView: React.FC = () => {
  // 1. Estado local de productos cargado desde localStorage o iniciales
  const [products, setProducts] = useState<ProductStockDetail[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error cargando stock desde storage', e);
    }

    // Inicialización por defecto con desglose de tallas
    return INITIAL_PRODUCTS.map((p) => ({
      ...p,
      stockBySize: generateInitialStockBySize(p),
      lastUpdated: new Date().toISOString()
    }));
  });

  // Guardar en localStorage cada vez que cambien los productos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error guardando stock en storage', e);
    }
  }, [products]);

  // 2. Filtros y Estados de Control
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockOrder, setStockOrder] = useState<'desc' | 'asc'>('desc'); // 'desc' = mayor a menor, 'asc' = menor a mayor
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'with_sizes' | 'one_size'>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'sold_out'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Estados de Edición Manual (Modal)
  const [editingProduct, setEditingProduct] = useState<ProductStockDetail | null>(null);
  const [editFormStockBySize, setEditFormStockBySize] = useState<Record<string, number>>({});
  const [editFormTotalStock, setEditFormTotalStock] = useState<number>(0);
  const [editFormPrice, setEditFormPrice] = useState<number>(0);
  const [editFormNotes, setEditFormNotes] = useState<string>('');
  const [newSizeInput, setNewSizeInput] = useState<string>('');
  const [editBranchStock, setEditBranchStock] = useState<Record<string, number>>({});

  // Feedback y Notificaciones
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Lista única de categorías calculadas dinámicamente
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  // Conteo de productos por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // 3. Filtrado y Ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Filtro por Categoría
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Filtro por Búsqueda (Texto)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchSku && !matchCategory && !matchTags) {
            return false;
          }
        }

        // Filtro por Tallas (con talla vs sin talla)
        if (sizeFilter === 'with_sizes' && (!p.sizes || p.sizes.length === 0)) {
          return false;
        }
        if (sizeFilter === 'one_size' && p.sizes && p.sizes.length > 0) {
          return false;
        }

        // Filtro por Estado de Stock
        if (stockStatusFilter === 'in_stock' && p.totalStock <= 0) return false;
        if (stockStatusFilter === 'low_stock' && (p.totalStock <= 0 || p.totalStock > 8)) return false;
        if (stockStatusFilter === 'sold_out' && p.totalStock > 0) return false;

        return true;
      })
      .sort((a, b) => {
        // Ordenamiento por Stock
        if (stockOrder === 'desc') {
          // De mayor a menor
          return b.totalStock - a.totalStock;
        } else {
          // De menor a mayor
          return a.totalStock - b.totalStock;
        }
      });
  }, [products, selectedCategory, stockOrder, searchQuery, sizeFilter, stockStatusFilter]);

  // Métricas Consolidadas para KPIs
  const summaryMetrics = useMemo(() => {
    let totalUnits = 0;
    let withSizesCount = 0;
    let lowStockCount = 0;
    let soldOutCount = 0;

    products.forEach((p) => {
      totalUnits += p.totalStock;
      if (p.sizes && p.sizes.length > 0) withSizesCount++;
      if (p.totalStock === 0) soldOutCount++;
      else if (p.totalStock <= 8) lowStockCount++;
    });

    return {
      totalUnits,
      totalProducts: products.length,
      withSizesCount,
      withoutSizesCount: products.length - withSizesCount,
      lowStockCount,
      soldOutCount
    };
  }, [products]);

  // Mostrar mensaje toast temporal
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 4. Actualizaciones Rápidas Inline (Ajustar Stock de una Talla o Total)
  const handleInlineSizeStockChange = (
    productId: string,
    size: string,
    delta: number
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;

        const currentSizeStock = prod.stockBySize?.[size] ?? 0;
        const newSizeStock = Math.max(0, currentSizeStock + delta);

        const updatedSizes = {
          ...(prod.stockBySize || {}),
          [size]: newSizeStock
        };

        // Recalcular total stock como la suma de las tallas
        const newTotalStock = Object.values(updatedSizes).reduce((acc, val) => acc + val, 0);

        // Actualizar proporcionalmente sucursales
        const currentBranches = { ...prod.stockPerBranch };
        const branchIds = Object.keys(currentBranches);
        if (branchIds.length > 0 && branchIds[0]) {
          currentBranches[branchIds[0]] = Math.max(
            0,
            (currentBranches[branchIds[0]] || 0) + delta
          );
        }

        return {
          ...prod,
          stockBySize: updatedSizes,
          totalStock: newTotalStock,
          stockPerBranch: currentBranches,
          lastUpdated: new Date().toISOString()
        };
      })
    );

    triggerToast(`Stock de talla ${size} actualizado (${delta > 0 ? '+' : ''}${delta})`);
  };

  const handleInlineTotalStockChange = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;

        const newTotal = Math.max(0, prod.totalStock + delta);

        // Si tiene tallas, ajustar la primera o repartir
        let updatedSizes = { ...(prod.stockBySize || {}) };
        if (prod.sizes && prod.sizes.length > 0) {
          const firstSize = prod.sizes[0];
          updatedSizes[firstSize] = Math.max(0, (updatedSizes[firstSize] || 0) + delta);
        }

        return {
          ...prod,
          totalStock: newTotal,
          stockBySize: updatedSizes,
          lastUpdated: new Date().toISOString()
        };
      })
    );

    triggerToast(`Stock total actualizado (${delta > 0 ? '+' : ''}${delta})`);
  };

  // 5. Iniciar Edición Manual en Modal
  const openEditModal = (product: ProductStockDetail) => {
    setEditingProduct(product);
    setEditFormStockBySize({ ...(product.stockBySize || {}) });
    setEditFormTotalStock(product.totalStock);
    setEditFormPrice(product.price);
    setEditFormNotes(product.notes || '');
    setEditBranchStock({ ...(product.stockPerBranch || {}) });
    setNewSizeInput('');
  };

  const closeEditModal = () => {
    setEditingProduct(null);
  };

  // Guardar Cambios Manuales desde el Modal
  const handleSaveEditModal = () => {
    if (!editingProduct) return;

    // Calcular suma de tallas si el producto las tiene
    const hasSizes = editingProduct.sizes && editingProduct.sizes.length > 0;
    let finalTotalStock = editFormTotalStock;

    if (hasSizes) {
      finalTotalStock = Object.values(editFormStockBySize).reduce((a, b) => a + (Number(b) || 0), 0);
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== editingProduct.id) return p;

        return {
          ...p,
          price: editFormPrice,
          totalStock: Math.max(0, finalTotalStock),
          stockBySize: editFormStockBySize,
          stockPerBranch: editBranchStock,
          notes: editFormNotes,
          lastUpdated: new Date().toISOString()
        };
      })
    );

    triggerToast(`Producto "${editingProduct.title}" actualizado manualmente`);
    closeEditModal();
  };

  // Agregar nueva talla al producto en edición
  const handleAddNewSize = () => {
    const trimmed = newSizeInput.trim().toUpperCase();
    if (!trimmed || !editingProduct) return;

    if (editingProduct.sizes.includes(trimmed)) {
      alert('Esta talla ya existe en el producto.');
      return;
    }

    const updatedSizes = [...editingProduct.sizes, trimmed];
    setEditingProduct({
      ...editingProduct,
      sizes: updatedSizes
    });

    setEditFormStockBySize((prev) => ({
      ...prev,
      [trimmed]: 0
    }));

    setNewSizeInput('');
  };

  // Eliminar una talla del producto en edición
  const handleRemoveSize = (sizeToRemove: string) => {
    if (!editingProduct) return;
    const updatedSizes = editingProduct.sizes.filter((s) => s !== sizeToRemove);
    const updatedStock = { ...editFormStockBySize };
    delete updatedStock[sizeToRemove];

    setEditingProduct({
      ...editingProduct,
      sizes: updatedSizes
    });
    setEditFormStockBySize(updatedStock);
  };

  // Restablecer Datos de Stock a la configuración de fábrica
  const handleResetToDefault = () => {
    if (window.confirm('¿Deseas restablecer todos los productos y stocks a los valores iniciales predeterminados?')) {
      const initial = INITIAL_PRODUCTS.map((p) => ({
        ...p,
        stockBySize: generateInitialStockBySize(p),
        lastUpdated: new Date().toISOString()
      }));
      setProducts(initial);
      localStorage.removeItem(STORAGE_KEY);
      triggerToast('Stock restablecido a valores iniciales de fábrica');
    }
  };

  // Recarga visual simulada
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('Datos de stock sincronizados');
    }, 500);
  };

  // Exportar reporte de stock a formato CSV
  const handleExportCSV = () => {
    const headers = ['SKU', 'Producto', 'Categoria', 'Precio', 'Stock_Total', 'Tallas_Desglose', 'Estado'];
    const rows = filteredAndSortedProducts.map((p) => {
      const sizeBreakdown = p.sizes && p.sizes.length > 0
        ? p.sizes.map((s) => `${s}:${p.stockBySize?.[s] ?? 0}`).join(' | ')
        : 'Talla Única';
      const status = p.totalStock === 0 ? 'AGOTADO' : p.totalStock <= 8 ? 'STOCK_BAJO' : 'DISPONIBLE';

      return [
        `"${p.sku}"`,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.price,
        p.totalStock,
        `"${sizeBreakdown}"`,
        status
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_stock_nolimits_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Reporte CSV descargado con éxito');
  };

  return (
    <div className="space-y-4 font-sans text-gray-900 pb-16">
      <WindowFrame
        title="STOCK_INVENTORY_MATRIX.SYS - [Resumen de Stock de Productos y Tallas - Super Admin]"
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText={`NODO SUPER ADMIN // CONEXIÓN ESTABLE // PRODUCTOS AUDITADOS: ${products.length} // STOCK TOTAL CONSOLIDADO: ${summaryMetrics.totalUnits} UN.`}
      >
        <div className="space-y-4 text-xs">
          {/* Barra Superior de Identificación y Navegación */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3 bg-linear-to-r from-blue-50/60 to-transparent p-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                  SUPER ADMIN
                </span>
                <span className="bg-emerald-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase flex items-center gap-1">
                  <Boxes className="w-3 h-3" />
                  CONTROL DE STOCK & TALLAS
                </span>
                <h1 className="text-sm font-extrabold text-[#003c74] uppercase tracking-wide">
                  Resumen de Stock de Productos
                </h1>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Visualización centralizada de stock, desglose de unidades por tallas individuales y actualización manual en tiempo real.
              </p>
            </div>

            {/* Botones de Acción Global */}
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/admin/inventory">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-3 text-gray-800 flex items-center gap-1.5 font-bold"
                  title="Volver al panel general de Inventario"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-700" />
                  <span>Volver a Inventario</span>
                </button>
              </Link>

              <button
                type="button"
                onClick={handleRefresh}
                className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1.5"
                title="Sincronizar datos"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1.5"
                title="Descargar planilla CSV con el stock detallado"
              >
                <Download className="w-3.5 h-3.5 text-green-700" />
                <span>Exportar CSV</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="winxp-button text-xs py-1 px-2 text-gray-700 flex items-center gap-1"
                title="Restablecer stock a valores de fábrica"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>

          {/* Toast de confirmación flotante */}
          {toastMessage && (
            <div className="p-2.5 bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-md rounded-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-emerald-800 hover:text-emerald-950 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tarjetas de Resumen KPI de Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-white border border-[#7f9db9] shadow-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] uppercase tracking-wider text-blue-900">Total Unidades</span>
                <Boxes className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-xl font-black text-gray-900 mt-1">
                {summaryMetrics.totalUnits.toLocaleString('es-CL')} <span className="text-xs font-normal text-gray-600">un.</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">En toda la red de sucursales</div>
            </div>

            <div className="p-2.5 bg-white border border-[#7f9db9] shadow-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] uppercase tracking-wider text-purple-900">Con Tallas</span>
                <Layers className="w-4 h-4 text-purple-700" />
              </div>
              <div className="text-xl font-black text-purple-900 mt-1">
                {summaryMetrics.withSizesCount} <span className="text-xs font-normal text-gray-600">de {summaryMetrics.totalProducts}</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">Productos con desglose de tallas</div>
            </div>

            <div className="p-2.5 bg-white border border-[#7f9db9] shadow-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] uppercase tracking-wider text-amber-900">Stock Bajo (≤ 8)</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-black text-amber-700 mt-1">
                {summaryMetrics.lowStockCount} <span className="text-xs font-normal text-gray-600">prendas</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">Requieren reposición a proveedor</div>
            </div>

            <div className="p-2.5 bg-white border border-[#7f9db9] shadow-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] uppercase tracking-wider text-red-900">Agotados (0 un.)</span>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-xl font-black text-red-700 mt-1">
                {summaryMetrics.soldOutCount} <span className="text-xs font-normal text-gray-600">productos</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">Sin disponibilidad en catálogo</div>
            </div>
          </div>

          {/* BARRA DE FILTROS: FILTRAR POR CATEGORÍA Y ORDENAR POR STOCK */}
          <div className="p-3 bg-[#ece9d8] border border-gray-400 space-y-2.5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 pb-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#003c74]" />
                <span className="font-bold text-xs text-[#003c74] uppercase tracking-wide">
                  Controles de Filtrado & Ordenamiento de Stock
                </span>
              </div>
              <div className="text-[11px] text-gray-600">
                Mostrando <strong className="text-gray-900">{filteredAndSortedProducts.length}</strong> de {products.length} productos
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. FILTRAR POR CATEGORÍA (Requisito Explícito) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-700" />
                  <span>Filtrar por Categoría:</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full winxp-input text-xs py-1 px-2 font-medium bg-white border border-[#7f9db9]"
                >
                  <option value="all">Todas las Categorías ({products.length})</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({categoryCounts[cat] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. ORDENAR POR STOCK (Requisito Explícito: Mayor a menor y Menor a mayor) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Ordenar por Stock:</span>
                </label>
                <div className="flex items-center gap-1">
                  <select
                    value={stockOrder}
                    onChange={(e) => setStockOrder(e.target.value as 'desc' | 'asc')}
                    className="w-full winxp-input text-xs py-1 px-2 font-bold bg-white border border-[#7f9db9] text-[#003c74]"
                  >
                    <option value="desc">Mayor a menor (Más stock primero)</option>
                    <option value="asc">Menor a mayor (Menos stock primero)</option>
                  </select>
                </div>
              </div>

              {/* 3. Búsqueda por Texto (Nombre / SKU) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-gray-700" />
                  <span>Buscar por Nombre o SKU:</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: Hoodie, NL-TEE, Cargo..."
                    className="w-full winxp-input text-xs py-1 px-2 pr-6 bg-white border border-[#7f9db9]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Filtro por Tipo de Talla / Estado */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-700" />
                  <span>Tipo de Prenda & Tallas:</span>
                </label>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value as 'all' | 'with_sizes' | 'one_size')}
                  className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9]"
                >
                  <option value="all">Todas las prendas</option>
                  <option value="with_sizes">Solo con Tallas Separadas (Ropa)</option>
                  <option value="one_size">Talla Única (Accesorios / Gorras / Carteras)</option>
                </select>
              </div>
            </div>

            {/* Sub-barra de chips rápidos de filtro y modo de vista */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-300">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-700 uppercase">Estado rápido:</span>
                <button
                  type="button"
                  onClick={() => setStockStatusFilter('all')}
                  className={`text-[11px] px-2 py-0.5 border font-semibold ${
                    stockStatusFilter === 'all'
                      ? 'bg-blue-700 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100'
                  }`}
                >
                  Todos ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStockStatusFilter('in_stock')}
                  className={`text-[11px] px-2 py-0.5 border font-semibold ${
                    stockStatusFilter === 'in_stock'
                      ? 'bg-emerald-700 text-white border-emerald-900 shadow-xs'
                      : 'bg-white text-emerald-800 border-gray-400 hover:bg-emerald-50'
                  }`}
                >
                  Con Stock ({products.filter((p) => p.totalStock > 0).length})
                </button>
                <button
                  type="button"
                  onClick={() => setStockStatusFilter('low_stock')}
                  className={`text-[11px] px-2 py-0.5 border font-semibold ${
                    stockStatusFilter === 'low_stock'
                      ? 'bg-amber-600 text-white border-amber-800 shadow-xs'
                      : 'bg-white text-amber-800 border-gray-400 hover:bg-amber-50'
                  }`}
                >
                  Stock Bajo ≤8 ({summaryMetrics.lowStockCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStockStatusFilter('sold_out')}
                  className={`text-[11px] px-2 py-0.5 border font-semibold ${
                    stockStatusFilter === 'sold_out'
                      ? 'bg-red-700 text-white border-red-900 shadow-xs'
                      : 'bg-white text-red-800 border-gray-400 hover:bg-red-50'
                  }`}
                >
                  Agotados 0 un. ({summaryMetrics.soldOutCount})
                </button>
              </div>

              {/* Botones de Vista: Tabla XP vs Tarjetas */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-700 uppercase">Vista:</span>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`winxp-button text-[11px] py-0.5 px-2 font-bold ${
                    viewMode === 'table' ? 'winxp-button-primary text-blue-950 border-blue-800' : 'text-gray-700'
                  }`}
                >
                  Tabla Detallada
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`winxp-button text-[11px] py-0.5 px-2 font-bold ${
                    viewMode === 'cards' ? 'winxp-button-primary text-blue-950 border-blue-800' : 'text-gray-700'
                  }`}
                >
                  Tarjetas Visuales
                </button>
              </div>
            </div>
          </div>

          {/* VISTA 1: TABLA DETALLADA XP (CON SEPARACIÓN DE TALLAS Y CONTROLES MANUALES) */}
          {viewMode === 'table' ? (
            <div className="border border-gray-400 overflow-x-auto bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#ece9d8] border-b-2 border-gray-400 text-gray-900 font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5 border-r border-gray-300 w-16 text-center">IMAGEN</th>
                    <th className="p-2.5 border-r border-gray-300">PRODUCTO / SKU</th>
                    <th className="p-2.5 border-r border-gray-300">CATEGORÍA</th>
                    <th className="p-2.5 border-r border-gray-300 text-right">PRECIO</th>
                    <th className="p-2.5 border-r border-gray-300 text-center w-36">
                      <div className="flex items-center justify-center gap-1">
                        <span>STOCK TOTAL</span>
                        <ArrowUpDown className="w-3 h-3 text-blue-700" />
                      </div>
                    </th>
                    <th className="p-2.5 border-r border-gray-300 min-w-[280px]">
                      DESGLOSE POR TALLAS (SEPARADAS)
                    </th>
                    <th className="p-2.5 text-center w-40">ACCIONES MANUALES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="font-bold text-sm text-gray-700">No se encontraron productos con los filtros seleccionados.</p>
                        <p className="text-xs text-gray-500 mt-1">Prueba cambiando la categoría o limpiando la búsqueda.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('all');
                            setSearchQuery('');
                            setSizeFilter('all');
                            setStockStatusFilter('all');
                          }}
                          className="winxp-button text-xs py-1 px-3 mt-3 text-blue-900 font-bold"
                        >
                          Restablecer todos los filtros
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedProducts.map((p) => {
                      const hasSizes = p.sizes && p.sizes.length > 0;
                      const isSoldOut = p.totalStock === 0;
                      const isLowStock = p.totalStock > 0 && p.totalStock <= 8;

                      return (
                        <tr key={p.id} className="hover:bg-blue-50/70 transition-colors">
                          {/* 1. Imagen del Producto con preview al hacer click */}
                          <td className="p-2 border-r border-gray-200 text-center align-middle">
                            <div
                              onClick={() => setPreviewImage({ url: p.images[0] || '', title: p.title })}
                              className="relative group cursor-pointer inline-block"
                              title="Click para ampliar imagen"
                            >
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-12 h-12 object-cover border border-gray-300 shadow-2xs group-hover:border-blue-600 transition-all rounded-xs"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xs">
                                <Maximize2 className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </td>

                          {/* 2. Título, SKU y Tags */}
                          <td className="p-2 border-r border-gray-200 align-middle">
                            <div className="font-bold text-gray-900 leading-tight">
                              {p.title}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[10px] text-gray-600 font-bold bg-gray-100 px-1 py-0.2 border border-gray-300">
                                {p.sku}
                              </span>
                              {p.isFeatured && (
                                <span className="text-[9px] bg-purple-100 text-purple-900 font-bold px-1 border border-purple-300">
                                  DESTACADO
                                </span>
                              )}
                              {p.isExclusive && (
                                <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1 border border-amber-300">
                                  EXCLUSIVO
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 3. Categoría */}
                          <td className="p-2 border-r border-gray-200 align-middle">
                            <span className="inline-block bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded-xs">
                              {p.category}
                            </span>
                            {p.subCategory && (
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                {p.subCategory}
                              </div>
                            )}
                          </td>

                          {/* 4. Precio */}
                          <td className="p-2 border-r border-gray-200 text-right align-middle">
                            <div className="font-mono font-bold text-gray-900 text-xs">
                              ${p.price.toLocaleString('es-CL')}
                            </div>
                            {p.salePrice && (
                              <div className="text-[10px] text-red-600 line-through">
                                ${p.price.toLocaleString('es-CL')}
                              </div>
                            )}
                          </td>

                          {/* 5. Cantidad de Unidades (Stock Total) con Ajuste Rápido */}
                          <td className="p-2 border-r border-gray-200 text-center align-middle">
                            <div className="inline-flex flex-col items-center">
                              <div className="flex items-center gap-1">
                                {!hasSizes && (
                                  <button
                                    type="button"
                                    onClick={() => handleInlineTotalStockChange(p.id, -1)}
                                    disabled={p.totalStock <= 0}
                                    className="w-5 h-5 bg-gray-200 hover:bg-gray-300 border border-gray-400 font-black flex items-center justify-center text-xs disabled:opacity-40"
                                    title="Disminuir 1 unidad de stock total"
                                  >
                                    -
                                  </button>
                                )}

                                <span
                                  className={`font-mono font-black text-sm px-2 py-0.5 border ${
                                    isSoldOut
                                      ? 'bg-red-100 text-red-900 border-red-400'
                                      : isLowStock
                                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                                      : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                  }`}
                                >
                                  {p.totalStock} un.
                                </span>

                                {!hasSizes && (
                                  <button
                                    type="button"
                                    onClick={() => handleInlineTotalStockChange(p.id, 1)}
                                    className="w-5 h-5 bg-gray-200 hover:bg-gray-300 border border-gray-400 font-black flex items-center justify-center text-xs"
                                    title="Aumentar 1 unidad de stock total"
                                  >
                                    +
                                  </button>
                                )}
                              </div>

                              <span
                                className={`text-[9px] font-black uppercase tracking-wider mt-1 px-1.5 py-0.2 rounded-xs border ${
                                  isSoldOut
                                    ? 'bg-red-700 text-white border-red-900'
                                    : isLowStock
                                    ? 'bg-amber-600 text-white border-amber-800'
                                    : 'bg-emerald-700 text-white border-emerald-900'
                                }`}
                              >
                                {isSoldOut ? 'AGOTADO' : isLowStock ? 'STOCK BAJO' : 'EN STOCK'}
                              </span>
                            </div>
                          </td>

                          {/* 6. Desglose de Tallas Separadas (Requisito Explícito) */}
                          <td className="p-2 border-r border-gray-200 align-middle">
                            {hasSizes ? (
                              <div className="space-y-1.5">
                                <div className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                                  <Layers className="w-3 h-3 text-purple-700" />
                                  <span>{p.sizes.length} Tallas Diferenciadas:</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {p.sizes.map((size) => {
                                    const sizeStock = p.stockBySize?.[size] ?? 0;
                                    const sizeEmpty = sizeStock === 0;

                                    return (
                                      <div
                                        key={size}
                                        className={`flex items-center border rounded-xs px-1.5 py-1 shadow-2xs ${
                                          sizeEmpty
                                            ? 'bg-red-50 border-red-300 text-red-900'
                                            : sizeStock <= 2
                                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                                            : 'bg-white border-gray-300 text-gray-800'
                                        }`}
                                      >
                                        <div className="mr-1.5">
                                          <span className="font-extrabold text-[11px] text-blue-950">
                                            {size}:
                                          </span>
                                          <span className="font-mono font-bold ml-1 text-[11px]">
                                            {sizeStock} un.
                                          </span>
                                        </div>

                                        {/* Botones inline de ajuste rápido por talla */}
                                        <div className="flex items-center gap-0.5 ml-1 border-l border-gray-300 pl-1">
                                          <button
                                            type="button"
                                            onClick={() => handleInlineSizeStockChange(p.id, size, -1)}
                                            disabled={sizeStock <= 0}
                                            className="w-4 h-4 bg-gray-100 hover:bg-gray-200 border border-gray-400 font-bold flex items-center justify-center text-[10px] disabled:opacity-30"
                                            title={`Restar 1 un. a Talla ${size}`}
                                          >
                                            -
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleInlineSizeStockChange(p.id, size, 1)}
                                            className="w-4 h-4 bg-gray-100 hover:bg-gray-200 border border-gray-400 font-bold flex items-center justify-center text-[10px]"
                                            title={`Sumar 1 un. a Talla ${size}`}
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-xs text-gray-600">
                                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <div>
                                  <span className="font-bold text-[11px] text-gray-800">Talla Única / Accesorio Estándar</span>
                                  <p className="text-[10px] text-gray-500">Este producto no requiere separación de tallas (Stock unitario general: {p.totalStock} un.)</p>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* 7. Acciones Manuales (Requisito Explícito: Actualizar Manualmente) */}
                          <td className="p-2 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              className="winxp-button winxp-button-primary text-xs py-1 px-2.5 text-blue-950 font-bold flex items-center justify-center gap-1 mx-auto shadow-xs border-blue-700 bg-blue-50/80 hover:bg-blue-100"
                              title="Abrir panel completo de actualización manual de stock y tallas"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                              <span>Actualizar</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* VISTA 2: TARJETAS VISUALES XP (GRID) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAndSortedProducts.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-white border border-gray-300">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-bold text-sm text-gray-700">No se encontraron productos coincidentes.</p>
                </div>
              ) : (
                filteredAndSortedProducts.map((p) => {
                  const hasSizes = p.sizes && p.sizes.length > 0;
                  const isSoldOut = p.totalStock === 0;
                  const isLowStock = p.totalStock > 0 && p.totalStock <= 8;

                  return (
                    <div
                      key={p.id}
                      className="bg-white border-2 border-gray-300 hover:border-blue-600 p-3 shadow-xs flex flex-col justify-between space-y-2 transition-all"
                    >
                      <div className="space-y-2">
                        {/* Cabecera de tarjeta */}
                        <div className="flex items-start gap-2.5">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            onClick={() => setPreviewImage({ url: p.images[0] || '', title: p.title })}
                            className="w-16 h-16 object-cover border border-gray-300 shadow-2xs shrink-0 cursor-pointer"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono text-[10px] text-gray-600 font-bold bg-gray-100 px-1 border border-gray-300">
                                {p.sku}
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase px-1 py-0.2 border ${
                                  isSoldOut
                                    ? 'bg-red-100 text-red-900 border-red-400'
                                    : isLowStock
                                    ? 'bg-amber-100 text-amber-900 border-amber-400'
                                    : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                }`}
                              >
                                {isSoldOut ? 'AGOTADO' : isLowStock ? 'STOCK BAJO' : 'DISPONIBLE'}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-gray-900 mt-1 line-clamp-2 leading-tight">
                              {p.title}
                            </h4>
                            <div className="text-[10px] text-blue-900 font-semibold mt-0.5">
                              {p.category}
                            </div>
                          </div>
                        </div>

                        {/* Stock Total */}
                        <div className="p-2 bg-gray-50 border border-gray-200 flex items-center justify-between">
                          <span className="font-bold text-xs text-gray-700">Stock Total:</span>
                          <span className="font-mono font-black text-sm text-[#003c74]">
                            {p.totalStock} unidades
                          </span>
                        </div>

                        {/* Desglose de Tallas en tarjeta */}
                        <div>
                          <div className="text-[10px] font-bold text-gray-600 uppercase mb-1 flex items-center justify-between">
                            <span>Tallas Separadas:</span>
                            {hasSizes && (
                              <span className="text-purple-900 font-semibold">{p.sizes.length} tallas</span>
                            )}
                          </div>

                          {hasSizes ? (
                            <div className="grid grid-cols-2 gap-1.5">
                              {p.sizes.map((s) => {
                                const sizeCount = p.stockBySize?.[s] ?? 0;
                                return (
                                  <div
                                    key={s}
                                    className="p-1 border border-gray-300 bg-white flex items-center justify-between text-xs"
                                  >
                                    <span className="font-bold text-blue-950">{s}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="font-mono font-bold text-gray-900">{sizeCount}</span>
                                      <div className="flex flex-col">
                                        <button
                                          type="button"
                                          onClick={() => handleInlineSizeStockChange(p.id, s, 1)}
                                          className="text-[9px] w-3.5 h-2.5 bg-gray-100 hover:bg-gray-300 border border-gray-400 flex items-center justify-center font-bold"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleInlineSizeStockChange(p.id, s, -1)}
                                          disabled={sizeCount <= 0}
                                          className="text-[9px] w-3.5 h-2.5 bg-gray-100 hover:bg-gray-300 border border-gray-400 flex items-center justify-center font-bold disabled:opacity-30"
                                        >
                                          ▼
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-2 bg-gray-100 text-gray-600 text-[10px] text-center border border-gray-300">
                              Talla única / Sin separación requerida
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botón de Actualizar Manualmente */}
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="w-full winxp-button winxp-button-primary text-xs py-1 px-3 text-blue-950 font-bold flex items-center justify-center gap-1.5 shadow-xs border-blue-700 bg-blue-50/80 hover:bg-blue-100 mt-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                        <span>Actualizar Stock Manualmente</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Información y Ayuda del Módulo Super Admin */}
          <div className="p-3 bg-blue-50 border border-blue-300 flex items-start gap-2.5 shadow-xs">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-950 space-y-1">
              <strong className="block font-bold">Guía de Operación para el Super Administrador:</strong>
              <p>
                • <strong>Separación de Tallas:</strong> Cada producto con variantes de vestuario (S, M, L, XL, etc.) desglosa sus unidades individualmente para evitar discrepancias físicas en bodega y transmisiones en vivo.
              </p>
              <p>
                • <strong>Actualización Manual:</strong> Puedes usar los botones rápidos <kbd className="px-1 py-0.2 bg-white border border-gray-400 font-mono">+</kbd> y <kbd className="px-1 py-0.2 bg-white border border-gray-400 font-mono">-</kbd> para ajustes al instante, o pulsar <strong>"Actualizar"</strong> para abrir el panel completo con ingreso numérico exacto y distribución por sucursal.
              </p>
              <p>
                • <strong>Persistencia Garantizada:</strong> Cualquier modificación manual se sincroniza de forma inmediata en el almacenamiento local y en los reportes de inventario.
              </p>
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* MODAL WINDOWS XP: ACTUALIZAR PRODUCTO & STOCK MANUALMENTE */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-2xl animate-in zoom-in-95 duration-150">
            <WindowFrame
              title={`MODIFICACIÓN MANUAL DE STOCK // SKU: ${editingProduct.sku}`}
              icon={<PixelIcon name="floppy" size={16} />}
              onClose={closeEditModal}
              statusBarText="EDICIÓN DIRECTA // SUPER ADMIN PRIVILEGES // REGISTRO AUDITABLE"
            >
              <div className="space-y-4 text-xs p-1">
                {/* Cabecera del Producto en Edición */}
                <div className="flex items-start gap-3 p-2.5 bg-gray-100 border border-gray-300">
                  <img
                    src={editingProduct.images[0]}
                    alt={editingProduct.title}
                    className="w-14 h-14 object-cover border border-gray-400 shadow-2xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-950 bg-white px-1.5 py-0.5 border border-gray-300">
                        {editingProduct.sku}
                      </span>
                      <span className="text-[11px] text-gray-600 font-semibold">
                        Categoría: <strong>{editingProduct.category}</strong>
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 mt-1 leading-snug">
                      {editingProduct.title}
                    </h3>
                    <div className="text-xs text-gray-700 mt-0.5">
                      Precio de venta: <strong>${editingProduct.price.toLocaleString('es-CL')}</strong>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 1: DESGLOSE DE TALLAS INDIVIDUALES (SEPARADAS) */}
                {editingProduct.sizes && editingProduct.sizes.length > 0 ? (
                  <div className="p-3 bg-white border border-gray-300 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-purple-700" />
                        <h4 className="font-bold text-xs text-[#003c74] uppercase">
                          Desglose y Ajuste Manual por Talla (Separadas)
                        </h4>
                      </div>
                      <span className="text-[11px] text-gray-500">
                        La suma total se recalcula automáticamente
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {editingProduct.sizes.map((size) => {
                        const currentVal = editFormStockBySize[size] ?? 0;
                        return (
                          <div
                            key={size}
                            className="p-2 border border-gray-300 bg-gray-50/80 rounded-xs flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-blue-950">Talla {size}:</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSize(size)}
                                className="text-red-600 hover:text-red-800 text-[10px] font-bold"
                                title="Eliminar esta talla"
                              >
                                Quitar
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditFormStockBySize((prev) => ({
                                    ...prev,
                                    [size]: Math.max(0, (prev[size] ?? 0) - 1)
                                  }))
                                }
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 border border-gray-400 font-black flex items-center justify-center text-xs"
                              >
                                -
                              </button>

                              <input
                                type="number"
                                min={0}
                                value={currentVal}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value) || 0);
                                  setEditFormStockBySize((prev) => ({
                                    ...prev,
                                    [size]: val
                                  }));
                                }}
                                className="w-full winxp-input text-center font-mono font-bold text-xs py-0.5 px-1 bg-white border border-[#7f9db9]"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setEditFormStockBySize((prev) => ({
                                    ...prev,
                                    [size]: (prev[size] ?? 0) + 1
                                  }))
                                }
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 border border-gray-400 font-black flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Agregar una nueva talla al producto */}
                    <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-700">Agregar Talla:</span>
                      <input
                        type="text"
                        value={newSizeInput}
                        onChange={(e) => setNewSizeInput(e.target.value)}
                        placeholder="Ej: XXL, XS, 42..."
                        className="winxp-input text-xs py-1 px-2 uppercase font-mono w-28 bg-white border border-[#7f9db9]"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewSize}
                        className="winxp-button text-xs py-1 px-2.5 text-blue-900 font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* PRODUCTO SIN TALLAS (TALLA ÚNICA) */
                  <div className="p-3 bg-white border border-gray-300 space-y-2">
                    <div className="flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                      <Boxes className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs text-[#003c74] uppercase">
                        Ajuste Manual de Stock Total (Talla Única / Accesorio)
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <label className="font-bold text-xs text-gray-800">
                        Cantidad de Unidades Disponibles:
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditFormTotalStock((prev) => Math.max(0, prev - 1))}
                          className="w-7 h-7 bg-gray-200 hover:bg-gray-300 border border-gray-400 font-black flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={editFormTotalStock}
                          onChange={(e) => setEditFormTotalStock(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 winxp-input text-center font-mono font-bold text-sm py-1 bg-white border border-[#7f9db9]"
                        />
                        <button
                          type="button"
                          onClick={() => setEditFormTotalStock((prev) => prev + 1)}
                          className="w-7 h-7 bg-gray-200 hover:bg-gray-300 border border-gray-400 font-black flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">unidades en bodega central</span>
                    </div>
                  </div>
                )}

                {/* SECCIÓN 2: DISTRIBUCIÓN POR SUCURSALES (FÍSICO) */}
                <div className="p-3 bg-white border border-gray-300 space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                    <div className="flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-blue-700" />
                      <h4 className="font-bold text-xs text-[#003c74] uppercase">
                        Distribución de Stock Físico por Sucursal
                      </h4>
                    </div>
                    <span className="text-[10px] text-gray-500">Viña del Mar, Valparaíso, Quilpué</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {INITIAL_BRANCHES.map((b) => {
                      const branchVal = editBranchStock[b.id] ?? 0;
                      return (
                        <div key={b.id} className="p-2 border border-gray-300 bg-gray-50 rounded-xs">
                          <div className="font-bold text-[11px] text-gray-900 mb-1">
                            {b.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              value={branchVal}
                              onChange={(e) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                setEditBranchStock((prev) => ({
                                  ...prev,
                                  [b.id]: val
                                }));
                              }}
                              className="w-full winxp-input text-center font-mono font-bold text-xs py-0.5 bg-white border border-[#7f9db9]"
                            />
                            <span className="text-[11px] text-gray-600 font-mono">un.</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECCIÓN 3: PRECIO Y NOTAS INTERNAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white border border-gray-300">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      Precio de Venta ($ CLP):
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={editFormPrice}
                      onChange={(e) => setEditFormPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full winxp-input text-xs py-1 px-2 font-mono font-bold bg-white border border-[#7f9db9]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1">
                      Notas de Auditoría de Stock:
                    </label>
                    <input
                      type="text"
                      value={editFormNotes}
                      onChange={(e) => setEditFormNotes(e.target.value)}
                      placeholder="Ej: Reposición recibida por Starken..."
                      className="w-full winxp-input text-xs py-1 px-2 bg-white border border-[#7f9db9]"
                    />
                  </div>
                </div>

                {/* Resumen Final de Stock Calculado */}
                <div className="p-2.5 bg-emerald-50 border-2 border-emerald-600 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-emerald-950">Stock Total resultante a guardar:</span>
                  </div>
                  <span className="font-mono font-black text-base text-emerald-900">
                    {editingProduct.sizes && editingProduct.sizes.length > 0
                      ? Object.values(editFormStockBySize).reduce((a, b) => a + (Number(b) || 0), 0)
                      : editFormTotalStock}{' '}
                    unidades
                  </span>
                </div>

                {/* Botones de Acción del Modal */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-300">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="winxp-button text-xs py-1 px-3 text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditModal}
                    className="winxp-button winxp-button-primary text-xs py-1 px-4 text-blue-950 font-bold flex items-center gap-1.5 shadow-xs border-blue-800 bg-blue-100"
                  >
                    <Save className="w-3.5 h-3.5 text-blue-800" />
                    <span>Guardar Cambios de Stock</span>
                  </button>
                </div>
              </div>
            </WindowFrame>
          </div>
        </div>
      )}

      {/* MODAL DE PREVIEW DE IMAGEN */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#ece9d8] border-2 border-white shadow-2xl p-2 rounded-xs animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-gray-400 pb-1 mb-2">
              <span className="font-bold text-xs text-blue-900 truncate pr-2">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-5 h-5 bg-red-600 text-white font-bold flex items-center justify-center text-xs hover:bg-red-700"
              >
                ✕
              </button>
            </div>
            <img
              src={previewImage.url}
              alt={previewImage.title}
              className="w-full h-80 object-cover border border-gray-400"
            />
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="winxp-button text-xs py-1 px-4 font-bold"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductStockSummaryView;
