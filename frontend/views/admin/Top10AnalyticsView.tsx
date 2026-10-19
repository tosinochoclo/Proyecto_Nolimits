import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart as PieChartIcon,
  ArrowLeft,
  RefreshCw,
  Award,
  Crown,
  Users,
  Package,
  Layers,
  TrendingUp,
  Download,
  Filter,
  DollarSign,
  Flame,
  CheckCircle2,
  Store
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_PRODUCTS,
  INITIAL_BRANCHES,
  INITIAL_USERS
} from '../../services/mockData';
import { RetroPieChart, PieChartItem } from '../../components/admin/RetroPieChart';

export const Top10AnalyticsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [categoryMetric, setCategoryMetric] = useState<'units' | 'revenue'>('revenue');
  const [salesMetric, setSalesMetric] = useState<'units' | 'revenue'>('units');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // 1. TOP 10 PRODUCTOS MÁS PEDIDOS POR LOS CLIENTES (DEMANDA / SOLICITUDES)
  const top10RequestedProducts: PieChartItem[] = useMemo(() => {
    const raw = [
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
    ];

    // Factor según sucursal seleccionada
    const multiplier =
      selectedBranchId === 'vina_del_mar' ? 0.48 :
      selectedBranchId === 'valparaiso' ? 0.32 :
      selectedBranchId === 'quilpue' ? 0.20 : 1.0;

    return raw.map((item) => ({
      ...item,
      value: Math.round(item.value * multiplier),
      secondaryText: `${Math.round(item.value * multiplier)} pedidos`
    }));
  }, [selectedBranchId]);

  // 2. TOP 10 PRODUCTOS MÁS VENDIDOS (VENTAS CONFIRMADAS)
  const top10SoldProducts: PieChartItem[] = useMemo(() => {
    const raw = [
      {
        id: 'sold_01',
        label: 'Cyber-Tribal Overkill Zip Hoodie',
        sku: 'NL-CYB-001',
        units: 94,
        revenue: 3665060,
        subLabel: 'Polerones & Hoodies',
        image: INITIAL_PRODUCTS[0]?.images[0],
        color: '#0055ea'
      },
      {
        id: 'sold_02',
        label: 'Gothic Parachute Multipocket Cargo',
        sku: 'NL-PAN-002',
        units: 76,
        revenue: 2735240,
        subLabel: 'Pantalones & Cargos',
        image: INITIAL_PRODUCTS[1]?.images[0],
        color: '#10b981'
      },
      {
        id: 'sold_03',
        label: 'Windows XP Glitch 2000 Graphic Tee',
        sku: 'NL-TEE-003',
        units: 68,
        revenue: 1359320,
        subLabel: 'Poleras & Tops',
        image: INITIAL_PRODUCTS[2]?.images[0],
        color: '#f59e0b'
      },
      {
        id: 'sold_04',
        label: 'Cartera Y2K Mini Baguette Plateada Mirror',
        sku: 'NL-BAG-005',
        units: 48,
        revenue: 1679520,
        subLabel: 'Carteras',
        image: INITIAL_PRODUCTS[4]?.images[0],
        color: '#ec4899'
      },
      {
        id: 'sold_05',
        label: 'Gorra Foam Trucker "NoLimits" Y2K Glitch',
        sku: 'NL-CAP-007',
        units: 45,
        revenue: 899550,
        subLabel: 'Gorras',
        image: INITIAL_PRODUCTS[6]?.images[0],
        color: '#8b5cf6'
      },
      {
        id: 'sold_06',
        label: 'Cybernetic Chrome Spiked Collar & Chain',
        sku: 'NL-ACC-004',
        units: 42,
        revenue: 797580,
        subLabel: 'Accesorios & Joyería',
        image: INITIAL_PRODUCTS[3]?.images[0],
        color: '#06b6d4'
      },
      {
        id: 'sold_07',
        label: 'Bolso Bandolera Cyber-Goth con Cadena Gruesa',
        sku: 'NL-BAG-006',
        units: 38,
        revenue: 1139620,
        subLabel: 'Carteras',
        image: INITIAL_PRODUCTS[5]?.images[0],
        color: '#f97316'
      },
      {
        id: 'sold_08',
        label: 'Gorra Snapback Cyber-Gothic Bordado Neón 3D',
        sku: 'NL-CAP-008',
        units: 35,
        revenue: 629650,
        subLabel: 'Gorras',
        image: INITIAL_PRODUCTS[7]?.images[0],
        color: '#6366f1'
      },
      {
        id: 'sold_09',
        label: 'Choker Industrial O-Ring Cadena Triple',
        sku: 'NL-ACC-009',
        units: 31,
        revenue: 495690,
        subLabel: 'Accesorios & Joyería',
        image: INITIAL_PRODUCTS[8]?.images[0],
        color: '#14b8a6'
      },
      {
        id: 'sold_10',
        label: 'Chaleco Táctico Cyber-Rave Arnés Cromado',
        sku: 'NL-VST-012',
        units: 28,
        revenue: 1119720,
        subLabel: 'Chaquetas',
        image: INITIAL_PRODUCTS[9]?.images[0] || INITIAL_PRODUCTS[0]?.images[0],
        color: '#ef4444'
      }
    ];

    const multiplier =
      selectedBranchId === 'vina_del_mar' ? 0.49 :
      selectedBranchId === 'valparaiso' ? 0.31 :
      selectedBranchId === 'quilpue' ? 0.20 : 1.0;

    return raw.map((item) => {
      const u = Math.round(item.units * multiplier);
      const r = Math.round(item.revenue * multiplier);
      return {
        id: item.id,
        label: item.label,
        sku: item.sku,
        subLabel: item.subLabel,
        value: salesMetric === 'units' ? u : r,
        secondaryText: salesMetric === 'units' ? `$${r.toLocaleString('es-CL')}` : `${u} un.`,
        image: item.image,
        color: item.color
      };
    });
  }, [selectedBranchId, salesMetric]);

  // 3. TOP 10 CATEGORÍAS MÁS VENDIDAS
  const top10Categories: PieChartItem[] = useMemo(() => {
    const raw = [
      { id: 'cat_01', label: 'Polerones & Hoodies', units: 194, revenue: 8120000, color: '#0055ea' },
      { id: 'cat_02', label: 'Pantalones & Cargos', units: 162, revenue: 6240000, color: '#10b981' },
      { id: 'cat_03', label: 'Poleras & Tops', units: 155, revenue: 3450000, color: '#f59e0b' },
      { id: 'cat_04', label: 'Carteras & Bolsos', units: 118, revenue: 3890000, color: '#ec4899' },
      { id: 'cat_05', label: 'Gorras & Beanies', units: 105, revenue: 2150000, color: '#8b5cf6' },
      { id: 'cat_06', label: 'Accesorios & Joyería', units: 98, revenue: 1860000, color: '#06b6d4' },
      { id: 'cat_07', label: 'Chaquetas & Vests', units: 78, revenue: 3200000, color: '#f97316' },
      { id: 'cat_08', label: 'Calzado & Plataformas', units: 54, revenue: 3180000, color: '#6366f1' },
      { id: 'cat_09', label: 'Vestidos & Faldas Cyber', units: 42, revenue: 1650000, color: '#14b8a6' },
      { id: 'cat_10', label: 'Packs & Merch Especial', units: 36, revenue: 710000, color: '#ef4444' }
    ];

    const multiplier =
      selectedBranchId === 'vina_del_mar' ? 0.49 :
      selectedBranchId === 'valparaiso' ? 0.31 :
      selectedBranchId === 'quilpue' ? 0.20 : 1.0;

    return raw.map((item) => {
      const u = Math.round(item.units * multiplier);
      const r = Math.round(item.revenue * multiplier);
      return {
        id: item.id,
        label: item.label,
        value: categoryMetric === 'revenue' ? r : u,
        subLabel: categoryMetric === 'revenue' ? `${u} unidades vendidas` : `$${r.toLocaleString('es-CL')} recaudados`,
        secondaryText: categoryMetric === 'revenue' ? `${u} un.` : `$${r.toLocaleString('es-CL')}`,
        color: item.color
      };
    });
  }, [selectedBranchId, categoryMetric]);

  // 4. TOP 10 LOS MEJORES CLIENTES (REGISTRADOS EN BASE A CUÁNTO HAN COMPRADO EN DINERO)
  const top10BestCustomers: PieChartItem[] = useMemo(() => {
    const raw = [
      {
        id: 'cust_01',
        label: 'Valeria Neo-Goth',
        email: 'valeria.k@gmail.com',
        rut: '19.824.112-K',
        totalSpent: 842920,
        ordersCount: 18,
        loyaltyPoints: 1340,
        color: '#0055ea',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_02',
        label: 'Sebastián Valdés G.',
        email: 's.valdes@live.cl',
        rut: '18.234.901-2',
        totalSpent: 715400,
        ordersCount: 15,
        loyaltyPoints: 980,
        color: '#10b981',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_03',
        label: 'Camila Rojas V.',
        email: 'camila.y2k@outlook.com',
        rut: '20.142.883-4',
        totalSpent: 634850,
        ordersCount: 13,
        loyaltyPoints: 890,
        color: '#f59e0b',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_04',
        label: 'Matías Bustos L.',
        email: 'mati.bustos@gmail.com',
        rut: '19.554.210-9',
        totalSpent: 589900,
        ordersCount: 11,
        loyaltyPoints: 740,
        color: '#ec4899',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_05',
        label: 'Ignacio Silva M.',
        email: 'ignacio.silva@cyber.cl',
        rut: '17.892.431-1',
        totalSpent: 524700,
        ordersCount: 10,
        loyaltyPoints: 680,
        color: '#8b5cf6',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_06',
        label: 'Sofía Moraga B.',
        email: 'sofia.moraga@yahoo.es',
        rut: '21.034.567-K',
        totalSpent: 488950,
        ordersCount: 9,
        loyaltyPoints: 610,
        color: '#06b6d4',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_07',
        label: 'Lucas Vera H.',
        email: 'lucas.v@live.cl',
        rut: '19.112.443-8',
        totalSpent: 432600,
        ordersCount: 8,
        loyaltyPoints: 540,
        color: '#f97316',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_08',
        label: 'Fernanda Zuñiga P.',
        email: 'fernanda.z@gmail.com',
        rut: '20.445.198-3',
        totalSpent: 398750,
        ordersCount: 7,
        loyaltyPoints: 490,
        color: '#6366f1',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_09',
        label: 'Diego Morales C.',
        email: 'diego.mc@cyber.cl',
        rut: '18.776.321-7',
        totalSpent: 365400,
        ordersCount: 6,
        loyaltyPoints: 420,
        color: '#14b8a6',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cust_10',
        label: 'Javiera Pardo T.',
        email: 'javi.pardo@gmail.com',
        rut: '19.921.844-5',
        totalSpent: 329800,
        ordersCount: 5,
        loyaltyPoints: 380,
        color: '#ef4444',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      }
    ];

    return raw.map((c) => ({
      id: c.id,
      label: c.label,
      value: c.totalSpent,
      subLabel: `${c.email} • RUT: ${c.rut}`,
      secondaryText: `${c.ordersCount} pedidos (${c.loyaltyPoints} pts)`,
      image: c.image,
      color: c.color
    }));
  }, []);

  // Métricas totales de cabecera
  const totalTopOrders = top10RequestedProducts.reduce((a, b) => a + b.value, 0);
  const totalTopRevenue = top10BestCustomers.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-4 font-sans text-gray-900 pb-12">
      <WindowFrame
        title="SUPER_ROOT_TOP10.SYS - [Analítica Avanzada Top 10 Consolidada]"
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText="AUDITORÍA SUPER ADMIN // TOP 10 PRODUCTOS, VENTAS, CATEGORÍAS & CLIENTES REGISTRADOS // MOTOR GRÁFICO SVG ACTIVO"
      >
        <div className="space-y-4">
          {/* Barra de Navegación y Control Superior */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Link to="/admin/inventory">
                  <button
                    type="button"
                    className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1 font-semibold"
                    title="Regresar a Gestión de Inventario"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-green-700" />
                    <span>Inventario</span>
                  </button>
                </Link>

                <span className="bg-purple-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-300" />
                  SUPER ADMIN ANALYTICS
                </span>

                <h2 className="text-sm font-extrabold text-[#003c74] uppercase tracking-wide">
                  Módulo Top 10 Estratégico
                </h2>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Visualización gráfica en formato de pastel con los 10 productos más pedidos, 10 más vendidos, 10 categorías líderes y los 10 mejores clientes registrados.
              </p>
            </div>

            {/* Acciones de la barra superior */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filtro de Sucursal */}
              <div className="flex items-center gap-1 bg-white px-2 py-1 border border-gray-400 text-xs shadow-inner">
                <Store className="w-3.5 h-3.5 text-blue-800" />
                <span className="font-bold text-gray-700 text-[11px]">Sucursal:</span>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="text-xs bg-transparent focus:outline-none cursor-pointer font-bold text-blue-900"
                  aria-label="Filtrar por sucursal"
                >
                  <option value="all">★ Todas las Sucursales</option>
                  {INITIAL_BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.city} ({b.name})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1.5"
                title="Actualizar métricas"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>

              <Link to="/admin">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-2.5 text-gray-800"
                >
                  Dashboard Root
                </button>
              </Link>
            </div>
          </div>

          {/* Tarjetas de Resumen KPI Top 10 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>DEMANDA CLIENTES</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-gray-900 mt-1 font-mono">
                {totalTopOrders} pedidos
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Top 10 prendas más solicitadas
              </div>
            </div>

            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-green-900 flex items-center justify-between">
                <span>CATEGORÍA LÍDER</span>
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-black text-green-700 mt-1 truncate">
                Polerones & Hoodies
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                194 unidades ($8.120.000)
              </div>
            </div>

            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-purple-900 flex items-center justify-between">
                <span>CLIENTE #1 DEL AÑO</span>
                <Crown className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-purple-900 mt-1 truncate">
                Valeria Neo-Goth
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                $842.920 CLP (18 compras)
              </div>
            </div>

            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                <span>VENTAS TOP 10 CLIENTES</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-blue-950 mt-1 font-mono">
                ${totalTopRevenue.toLocaleString('es-CL')}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Gasto acumulado fidelizado
              </div>
            </div>
          </div>

          {/* =================================================================
              FILA 1: PRODUCTOS MÁS PEDIDOS Y PRODUCTOS MÁS VENDIDOS
              ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. TOP 10 PRODUCTOS MÁS PEDIDOS POR LOS CLIENTES */}
            <div>
              <RetroPieChart
                title="Top 10 Productos mas pedidos por los clientes"
                subtitle="Los 10 productos con mayor número de solicitudes, reservas en vivo y agregados a pedido"
                data={top10RequestedProducts}
                valueSuffix=" pedidos"
              />
            </div>

            {/* 2. TOP 10 PRODUCTOS MÁS VENDIDOS */}
            <div>
              <div className="mb-1 flex justify-end">
                <div className="flex items-center bg-white border border-gray-400 p-0.5 rounded-xs text-xs">
                  <span className="text-[10px] text-gray-600 font-bold px-1.5">Métrica:</span>
                  <button
                    type="button"
                    onClick={() => setSalesMetric('units')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-xs transition-colors ${
                      salesMetric === 'units'
                        ? 'bg-[#0055ea] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Unidades
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalesMetric('revenue')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-xs transition-colors ${
                      salesMetric === 'revenue'
                        ? 'bg-[#0055ea] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Monto ($)
                  </button>
                </div>
              </div>

              <RetroPieChart
                title="Top 10 Productos más Vendidos"
                subtitle={`Rendimiento de los 10 productos con más ventas reales (${
                  salesMetric === 'units' ? 'unidades despachadas y cobradas' : 'ingresos brutos en CLP'
                })`}
                data={top10SoldProducts}
                valuePrefix={salesMetric === 'revenue' ? '$' : ''}
                valueSuffix={salesMetric === 'units' ? ' un.' : ' CLP'}
              />
            </div>
          </div>

          {/* =================================================================
              FILA 2: CATEGORÍAS MÁS VENDIDAS Y LOS MEJORES CLIENTES
              ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 3. TOP 10 CATEGORÍAS MÁS VENDIDAS */}
            <div>
              <div className="mb-1 flex justify-end">
                <div className="flex items-center bg-white border border-gray-400 p-0.5 rounded-xs text-xs">
                  <span className="text-[10px] text-gray-600 font-bold px-1.5">Ver por:</span>
                  <button
                    type="button"
                    onClick={() => setCategoryMetric('revenue')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-xs transition-colors ${
                      categoryMetric === 'revenue'
                        ? 'bg-[#0055ea] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Recaudación ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryMetric('units')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-xs transition-colors ${
                      categoryMetric === 'units'
                        ? 'bg-[#0055ea] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Unidades
                  </button>
                </div>
              </div>

              <RetroPieChart
                title="Top 10 Categorías más Vendidas"
                subtitle={`Distribución de las 10 líneas de producto líderes de la tienda (${
                  categoryMetric === 'revenue' ? 'total facturado en CLP' : 'unidades totales despachadas'
                })`}
                data={top10Categories}
                valuePrefix={categoryMetric === 'revenue' ? '$' : ''}
                valueSuffix={categoryMetric === 'revenue' ? ' CLP' : ' un.'}
              />
            </div>

            {/* 4. TOP 10 LOS MEJORES CLIENTES (REGISTRADOS EN BASE A CUÁNTO HAN COMPRADO EN DINERO) */}
            <div>
              <div className="mb-1 flex justify-end">
                <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-xs">
                  Filtrado: Solo Clientes Registrados
                </span>
              </div>

              <RetroPieChart
                title="Top 10 Los Mejores Clientes"
                subtitle="Los 10 clientes registrados con mayor gasto acumulado en dinero en NoLimits ($ CLP)"
                data={top10BestCustomers}
                valuePrefix="$"
                valueSuffix=" CLP"
              />
            </div>
          </div>

          {/* Tabla Desglosada de los 10 Mejores Clientes Registrados */}
          <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200 mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wide">
                  Detalle del Ranking: Top 10 Clientes Registrados por Facturación
                </h4>
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">
                Base de datos verificada con RUT y correo activo
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200">
                <thead className="bg-[#e4ebf5] text-blue-950 font-bold border-b border-gray-300 text-[11px]">
                  <tr>
                    <th className="py-1.5 px-2 text-center w-10">Lugar</th>
                    <th className="py-1.5 px-2">Cliente Registrado</th>
                    <th className="py-1.5 px-2">RUT</th>
                    <th className="py-1.5 px-2">Email</th>
                    <th className="py-1.5 px-2 text-center">Compras</th>
                    <th className="py-1.5 px-2 text-center">Puntos Club</th>
                    <th className="py-1.5 px-2 text-right">Total Gastado ($ CLP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {top10BestCustomers.map((cust, idx) => (
                    <tr key={cust.id} className="hover:bg-blue-50/60 transition-colors">
                      <td className="py-1.5 px-2 text-center">
                        <span
                          className="inline-flex w-5 h-5 rounded-full items-center justify-center text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: cust.color }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="flex items-center gap-2">
                          {cust.image ? (
                            <img
                              src={cust.image}
                              alt={cust.label}
                              className="w-6 h-6 rounded-full object-cover border border-gray-300 shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {cust.label.substring(0, 2)}
                            </div>
                          )}
                          <span className="font-bold text-gray-900 text-[11px]">
                            {cust.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-1.5 px-2 font-mono text-[11px] text-gray-600">
                        {cust.subLabel?.split('• RUT: ')[1] || '19.xxx.xxx-x'}
                      </td>
                      <td className="py-1.5 px-2 text-[11px] text-gray-600">
                        {cust.subLabel?.split(' •')[0]}
                      </td>
                      <td className="py-1.5 px-2 text-center font-bold text-gray-800">
                        {cust.secondaryText?.split(' ')[0]} ops
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold text-amber-700">
                        {cust.secondaryText?.match(/\((.*?) pts\)/)?.[1] || 100} pts
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono font-black text-blue-900 text-xs">
                        ${cust.value.toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
