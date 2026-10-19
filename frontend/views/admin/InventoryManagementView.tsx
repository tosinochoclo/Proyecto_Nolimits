import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Layers,
  RefreshCw,
  Download,
  Zap,
  PieChart as PieChartIcon,
  Store,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_PRODUCTS,
  INITIAL_BRANCHES,
  INITIAL_USERS,
  INITIAL_ANALYTICS
} from '../../services/mockData';
import { InventorySummaryWidget } from '../../components/admin/InventorySummaryWidget';
import {
  ProductStatusSummaryWidget,
  ProductOperationalState,
  ProductStatusItem
} from '../../components/admin/ProductStatusSummaryWidget';
import { RetroPieChart, PieChartItem } from '../../components/admin/RetroPieChart';

export const InventoryManagementView: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [salesMetricMode, setSalesMetricMode] = useState<'units' | 'revenue'>('units');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 1. CÁLCULO DE CATEGORÍAS
  const { categoriesCount, categoriesList } = useMemo(() => {
    const map = new Map<string, number>();
    INITIAL_PRODUCTS.forEach((p) => {
      const cat = p.category || 'Sin Categoría';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    const list = Array.from(map.entries()).map(([name, count]) => ({ name, count }));
    return {
      categoriesCount: list.length,
      categoriesList: list.sort((a, b) => b.count - a.count)
    };
  }, []);

  // 2. CÁLCULO DE USUARIOS
  const { usersCount, usersBreakdown } = useMemo(() => {
    // Estimación con base en usuarios iniciales + base de clientes
    const registered = 1380;
    const branchAdmins = INITIAL_BRANCHES.length; // 3
    const superAdmins = 1;
    return {
      usersCount: registered + branchAdmins + superAdmins,
      usersBreakdown: {
        registered,
        branchAdmins,
        superAdmins
      }
    };
  }, []);

  // 3. CÁLCULO DE PRODUCTOS Y STOCK FÍSICO
  const { productsCount, totalStockUnits, outOfStockCount } = useMemo(() => {
    let stock = 0;
    let outOfStock = 0;

    INITIAL_PRODUCTS.forEach((p) => {
      stock += p.totalStock;
      if (p.totalStock === 0) outOfStock++;
    });

    return {
      productsCount: INITIAL_PRODUCTS.length,
      totalStockUnits: stock,
      outOfStockCount: outOfStock
    };
  }, []);

  // 4. VENTAS ESPECIFICANDO DE QUÉ SUCURSAL Y TOTALES CONSOLIDADAS
  const branchSales = useMemo(() => {
    return INITIAL_BRANCHES.map((b) => {
      const analytics = INITIAL_ANALYTICS.find((a) => a.branchId === b.id);
      return {
        branchId: b.id,
        branchName: b.name,
        city: b.city,
        salesCount: analytics?.ordersProcessed || 120,
        totalRevenue: analytics?.totalSales || 5000000,
        colorTag: b.colorTag
      };
    });
  }, []);

  // 5. RESUMEN DE PRODUCTOS POR ESTADOS OPERATIVOS (Especificando de qué sucursal)
  const productStatusData: Record<ProductOperationalState, Record<string, number>> = useMemo(() => {
    return {
      'Solicitud recibida': {
        vina_del_mar: 14,
        valparaiso: 9,
        quilpue: 6
      },
      'En Preparación': {
        vina_del_mar: 18,
        valparaiso: 12,
        quilpue: 7
      },
      'En transito': {
        vina_del_mar: 22,
        valparaiso: 15,
        quilpue: 11
      },
      'Entregado': {
        vina_del_mar: 168,
        valparaiso: 104,
        quilpue: 68
      },
      'Listo para el retiro de sucursal': {
        vina_del_mar: 16,
        valparaiso: 11,
        quilpue: 8
      },
      'Retirado': {
        vina_del_mar: 74,
        valparaiso: 47,
        quilpue: 24
      }
    };
  }, []);

  // 6. REGISTROS RECIENTES PARA DETALLE DE PRODUCTOS EN ESTADO
  const recentProductItems: ProductStatusItem[] = useMemo(() => [
    {
      id: 'st_01',
      orderNumber: 'NL-9201',
      sku: 'NL-CYB-001',
      productTitle: 'Cyber-Tribal Overkill Zip Hoodie',
      productImage: INITIAL_PRODUCTS[0]?.images[0] || '',
      quantity: 2,
      customerName: 'Valeria Neo-Goth',
      branchId: 'vina_del_mar',
      branchName: 'Viña del Mar',
      state: 'Solicitud recibida',
      date: 'Hoy, 10:15',
      deliveryType: 'Despacho a Domicilio'
    },
    {
      id: 'st_02',
      orderNumber: 'NL-9198',
      sku: 'NL-PAN-002',
      productTitle: 'Gothic Parachute Multipocket Cargo',
      productImage: INITIAL_PRODUCTS[1]?.images[0] || '',
      quantity: 1,
      customerName: 'Matías Bustos',
      branchId: 'valparaiso',
      branchName: 'Valparaíso',
      state: 'En Preparación',
      date: 'Hoy, 09:40',
      deliveryType: 'Retiro en Tienda'
    },
    {
      id: 'st_03',
      orderNumber: 'NL-9189',
      sku: 'NL-TEE-003',
      productTitle: 'Windows XP Glitch 2000 Graphic Tee',
      productImage: INITIAL_PRODUCTS[2]?.images[0] || '',
      quantity: 3,
      customerName: 'Ignacio Silva',
      branchId: 'vina_del_mar',
      branchName: 'Viña del Mar',
      state: 'En transito',
      date: 'Ayer, 17:20',
      deliveryType: 'Despacho a Domicilio'
    },
    {
      id: 'st_04',
      orderNumber: 'NL-9175',
      sku: 'NL-BAG-005',
      productTitle: 'Cartera Y2K Mini Baguette Plateada Mirror',
      productImage: INITIAL_PRODUCTS[4]?.images[0] || '',
      quantity: 1,
      customerName: 'Camila Rojas',
      branchId: 'quilpue',
      branchName: 'Quilpué',
      state: 'Listo para el retiro de sucursal',
      date: 'Ayer, 15:10',
      deliveryType: 'Retiro en Tienda'
    },
    {
      id: 'st_05',
      orderNumber: 'NL-9160',
      sku: 'NL-ACC-004',
      productTitle: 'Cybernetic Chrome Spiked Collar & Chain',
      productImage: INITIAL_PRODUCTS[3]?.images[0] || '',
      quantity: 2,
      customerName: 'Lucas Vera',
      branchId: 'vina_del_mar',
      branchName: 'Viña del Mar',
      state: 'Retirado',
      date: '17 Oct, 18:30',
      deliveryType: 'Retiro en Tienda'
    },
    {
      id: 'st_06',
      orderNumber: 'NL-9152',
      sku: 'NL-CAP-007',
      productTitle: 'Gorra Foam Trucker "NoLimits" Y2K Glitch',
      productImage: INITIAL_PRODUCTS[6]?.images[0] || '',
      quantity: 1,
      customerName: 'Fernanda Zuñiga',
      branchId: 'valparaiso',
      branchName: 'Valparaíso',
      state: 'Entregado',
      date: '16 Oct, 14:00',
      deliveryType: 'Despacho a Domicilio'
    },
    {
      id: 'st_07',
      orderNumber: 'NL-9144',
      sku: 'NL-CAP-008',
      productTitle: 'Gorra Snapback Cyber-Gothic Bordado Neón 3D',
      productImage: INITIAL_PRODUCTS[7]?.images[0] || '',
      quantity: 1,
      customerName: 'Diego Morales',
      branchId: 'quilpue',
      branchName: 'Quilpué',
      state: 'Solicitud recibida',
      date: 'Hoy, 08:30',
      deliveryType: 'Despacho a Domicilio'
    },
    {
      id: 'st_08',
      orderNumber: 'NL-9130',
      sku: 'NL-BAG-006',
      productTitle: 'Bolso Bandolera Cyber-Goth con Cadena Gruesa',
      productImage: INITIAL_PRODUCTS[5]?.images[0] || '',
      quantity: 1,
      customerName: 'Sofía Moraga',
      branchId: 'vina_del_mar',
      branchName: 'Viña del Mar',
      state: 'En Preparación',
      date: 'Hoy, 11:00',
      deliveryType: 'Despacho a Domicilio'
    }
  ], []);

  // 7. COMPONENTE 3: TOP 10 PRODUCTOS MÁS PEDIDOS POR LOS CLIENTES (DEMANDA)
  const top10RequestedProducts: PieChartItem[] = useMemo(() => [
    {
      id: 'req_01',
      label: 'Cyber-Tribal Overkill Zip Hoodie',
      sku: 'NL-CYB-001',
      value: 128,
      subLabel: 'Polerones & Hoodies',
      image: INITIAL_PRODUCTS[0]?.images[0],
      color: '#0055ea'
    },
    {
      id: 'req_02',
      label: 'Gothic Parachute Multipocket Cargo',
      sku: 'NL-PAN-002',
      value: 114,
      subLabel: 'Pantalones & Cargos',
      image: INITIAL_PRODUCTS[1]?.images[0],
      color: '#10b981'
    },
    {
      id: 'req_03',
      label: 'Windows XP Glitch 2000 Graphic Tee',
      sku: 'NL-TEE-003',
      value: 98,
      subLabel: 'Poleras & Tops',
      image: INITIAL_PRODUCTS[2]?.images[0],
      color: '#f59e0b'
    },
    {
      id: 'req_04',
      label: 'Cybernetic Chrome Spiked Collar & Chain',
      sku: 'NL-ACC-004',
      value: 84,
      subLabel: 'Accesorios & Joyería',
      image: INITIAL_PRODUCTS[3]?.images[0],
      color: '#ec4899'
    },
    {
      id: 'req_05',
      label: 'Gorra Foam Trucker "NoLimits" Y2K Glitch',
      sku: 'NL-CAP-007',
      value: 72,
      subLabel: 'Gorras',
      image: INITIAL_PRODUCTS[6]?.images[0],
      color: '#8b5cf6'
    },
    {
      id: 'req_06',
      label: 'Cartera Y2K Mini Baguette Plateada Mirror',
      sku: 'NL-BAG-005',
      value: 65,
      subLabel: 'Carteras',
      image: INITIAL_PRODUCTS[4]?.images[0],
      color: '#06b6d4'
    },
    {
      id: 'req_07',
      label: 'Bolso Bandolera Cyber-Goth con Cadena Gruesa',
      sku: 'NL-BAG-006',
      value: 59,
      subLabel: 'Carteras',
      image: INITIAL_PRODUCTS[5]?.images[0],
      color: '#f97316'
    },
    {
      id: 'req_08',
      label: 'Gorra Snapback Cyber-Gothic Bordado Neón 3D',
      sku: 'NL-CAP-008',
      value: 52,
      subLabel: 'Gorras',
      image: INITIAL_PRODUCTS[7]?.images[0],
      color: '#6366f1'
    },
    {
      id: 'req_09',
      label: 'Choker Industrial O-Ring Cadena Triple',
      sku: 'NL-ACC-009',
      value: 46,
      subLabel: 'Accesorios & Joyería',
      image: INITIAL_PRODUCTS[8]?.images[0],
      color: '#14b8a6'
    },
    {
      id: 'req_10',
      label: 'Chaleco Táctico Cyber-Rave Arnés Cromado',
      sku: 'NL-VST-012',
      value: 38,
      subLabel: 'Chaquetas',
      image: INITIAL_PRODUCTS[9]?.images[0] || INITIAL_PRODUCTS[0]?.images[0],
      color: '#ef4444'
    }
  ], []);

  // 8. COMPONENTE 4: TOP 10 PRODUCTOS MÁS VENDIDOS (UNIDADES Y RECAUDACIÓN)
  const top10SoldProducts: PieChartItem[] = useMemo(() => {
    const rawSales = [
      {
        id: 'sold_01',
        label: 'Cyber-Tribal Overkill Zip Hoodie',
        sku: 'NL-CYB-001',
        units: 94,
        revenue: 3665060,
        image: INITIAL_PRODUCTS[0]?.images[0],
        color: '#0055ea'
      },
      {
        id: 'sold_02',
        label: 'Gothic Parachute Multipocket Cargo',
        sku: 'NL-PAN-002',
        units: 76,
        revenue: 2735240,
        image: INITIAL_PRODUCTS[1]?.images[0],
        color: '#10b981'
      },
      {
        id: 'sold_03',
        label: 'Windows XP Glitch 2000 Graphic Tee',
        sku: 'NL-TEE-003',
        units: 68,
        revenue: 1359320,
        image: INITIAL_PRODUCTS[2]?.images[0],
        color: '#f59e0b'
      },
      {
        id: 'sold_04',
        label: 'Cartera Y2K Mini Baguette Plateada Mirror',
        sku: 'NL-BAG-005',
        units: 48,
        revenue: 1679520,
        image: INITIAL_PRODUCTS[4]?.images[0],
        color: '#ec4899'
      },
      {
        id: 'sold_05',
        label: 'Gorra Foam Trucker "NoLimits" Y2K Glitch',
        sku: 'NL-CAP-007',
        units: 45,
        revenue: 899550,
        image: INITIAL_PRODUCTS[6]?.images[0],
        color: '#8b5cf6'
      },
      {
        id: 'sold_06',
        label: 'Cybernetic Chrome Spiked Collar & Chain',
        sku: 'NL-ACC-004',
        units: 42,
        revenue: 797580,
        image: INITIAL_PRODUCTS[3]?.images[0],
        color: '#06b6d4'
      },
      {
        id: 'sold_07',
        label: 'Bolso Bandolera Cyber-Goth con Cadena Gruesa',
        sku: 'NL-BAG-006',
        units: 38,
        revenue: 1139620,
        image: INITIAL_PRODUCTS[5]?.images[0],
        color: '#f97316'
      },
      {
        id: 'sold_08',
        label: 'Gorra Snapback Cyber-Gothic Bordado Neón 3D',
        sku: 'NL-CAP-008',
        units: 35,
        revenue: 629650,
        image: INITIAL_PRODUCTS[7]?.images[0],
        color: '#6366f1'
      },
      {
        id: 'sold_09',
        label: 'Choker Industrial O-Ring Cadena Triple',
        sku: 'NL-ACC-009',
        units: 31,
        revenue: 495690,
        image: INITIAL_PRODUCTS[8]?.images[0],
        color: '#14b8a6'
      },
      {
        id: 'sold_10',
        label: 'Chaleco Táctico Cyber-Rave Arnés Cromado',
        sku: 'NL-VST-012',
        units: 28,
        revenue: 1119720,
        image: INITIAL_PRODUCTS[9]?.images[0] || INITIAL_PRODUCTS[0]?.images[0],
        color: '#ef4444'
      }
    ];

    return rawSales.map((item) => ({
      id: item.id,
      label: item.label,
      sku: item.sku,
      value: salesMetricMode === 'units' ? item.units : item.revenue,
      secondaryText: salesMetricMode === 'units' ? `$${item.revenue.toLocaleString('es-CL')}` : `${item.units} un.`,
      image: item.image,
      color: item.color
    }));
  }, [salesMetricMode]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-4 font-sans text-gray-900 pb-12">
      <WindowFrame
        title="SUPER_ROOT_INVENTORY.SYS - [Gestión Integral de Inventario & Métricas Super Admin]"
        icon={<PixelIcon name="floppy" size={16} />}
        statusBarText={`NODO SUPER ADMIN // CONEXIÓN ESTABLE // SUCURSALES ACTIVAS: ${INITIAL_BRANCHES.length} // STOCK CONSOLIDADO: ${totalStockUnits} UN.`}
      >
        <div className="space-y-4">
          {/* Barra de Título y Control Superior */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                  SUPER ADMIN ONLY
                </span>
                <h2 className="text-sm font-extrabold text-[#003c74] uppercase tracking-wide">
                  Gestión Central de Inventario
                </h2>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Panel maestro para el Super Administrador con auditoría de categorías, usuarios, productos y ventas por sucursal.
              </p>
            </div>

            {/* Acciones de la Barra Superior */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1.5"
                title="Actualizar datos en tiempo real"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>

              <Link to="/admin/express-upload">
                <button
                  type="button"
                  className="winxp-button winxp-button-primary text-xs py-1 px-3 text-blue-900 font-bold flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Carga Express Live</span>
                </button>
              </Link>

              <Link to="/admin">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1"
                >
                  <span>Dashboard Root</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* =================================================================
              COMPONENTE 1: RESUMEN DE INVENTARIO
              Muestra: Categorías, Usuarios, Productos, y Ventas (por sucursal y totales)
              ================================================================= */}
          <section>
            <InventorySummaryWidget
              categoriesCount={categoriesCount}
              categoriesList={categoriesList}
              usersCount={usersCount}
              usersBreakdown={usersBreakdown}
              productsCount={productsCount}
              totalStockUnits={totalStockUnits}
              outOfStockCount={outOfStockCount}
              branchSales={branchSales}
              selectedBranchId={selectedBranchId}
              onSelectBranch={setSelectedBranchId}
            />
          </section>

          {/* =================================================================
              COMPONENTE 2: RESUMEN DE PRODUCTOS
              Muestra: Estados ("Solicitud recibida", "En Preparación", "En transito",
              "Entregado", "Listo para el retiro de sucursal", "Retirado"), especificando sucursal.
              ================================================================= */}
          <section>
            <ProductStatusSummaryWidget
              branches={INITIAL_BRANCHES}
              statusData={productStatusData}
              recentItems={recentProductItems}
              selectedBranchId={selectedBranchId}
              onSelectBranch={setSelectedBranchId}
            />
          </section>

          {/* =================================================================
              SECCIÓN DE GRÁFICOS DE PASTEL (PIE CHARTS)
              Componentes 3 y 4:
              - "Top 10 Productos mas pedidos por los clientes"
              - "Top 10 Productos más Vendidos"
              ================================================================= */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#d3e5fa] px-3 py-1.5 border border-[#9bb8e5] text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-950">
                <PieChartIcon className="w-4 h-4 text-blue-800" />
                <span>ANALÍTICA GRÁFICA DE DEMANDA Y RENDIMIENTO COMERCIAL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-700 font-semibold">Visualización de Ventas:</span>
                <div className="flex items-center bg-white border border-gray-400 p-0.5 rounded-xs">
                  <button
                    type="button"
                    onClick={() => setSalesMetricMode('units')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-xs transition-colors ${
                      salesMetricMode === 'units'
                        ? 'bg-[#0055ea] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Por Unidades
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalesMetricMode('revenue')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-xs transition-colors ${
                      salesMetricMode === 'revenue'
                        ? 'bg-[#0055ea] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Por Recaudación ($)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* COMPONENTE 3: Top 10 Productos mas pedidos por los clientes */}
              <div>
                <RetroPieChart
                  title="Top 10 Productos mas pedidos por los clientes"
                  subtitle="Demanda acumulada de clientes en preventas, carritos y órdenes de compra"
                  data={top10RequestedProducts}
                  valueSuffix=" pedidos"
                />
              </div>

              {/* COMPONENTE 4: Top 10 Productos más Vendidos */}
              <div>
                <RetroPieChart
                  title="Top 10 Productos más Vendidos"
                  subtitle={`Rendimiento comercial real ${
                    salesMetricMode === 'units' ? 'en unidades entregadas y cobradas' : 'en ingresos brutos consolidados'
                  }`}
                  data={top10SoldProducts}
                  valuePrefix={salesMetricMode === 'revenue' ? '$' : ''}
                  valueSuffix={salesMetricMode === 'units' ? ' un.' : ' CLP'}
                />
              </div>
            </div>
          </section>

          {/* Pie de Auditoría del Sistema Windows XP */}
          <div className="bg-[#f8fafc] border border-gray-300 p-2.5 text-xs flex flex-wrap items-center justify-between gap-2 text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span>Base de datos sincronizada: <strong>PostgreSQL / In-Memory NoLimits Core</strong></span>
            </div>
            <div className="font-mono text-[11px] text-gray-500">
              HASH SHA-256 // SUPER_ADMIN_SESSION: {currentUser.email}
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
