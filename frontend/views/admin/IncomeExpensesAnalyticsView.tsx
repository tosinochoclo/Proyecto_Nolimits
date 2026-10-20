import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Store,
  ArrowLeft,
  RefreshCw,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  PieChart as PieChartIcon,
  Receipt,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { INITIAL_BRANCHES } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import {
  IncomeExpensesBarChart,
  MonthlyFinanceData
} from '../../components/admin/IncomeExpensesBarChart';

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

const MONTH_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic'
];

// Datos base por año (Consolidado de todas las sucursales)
const ANNUAL_BASE_DATA: Record<number, { income: number[]; expenses: number[] }> = {
  2025: {
    income: [
      2100000, 2450000, 2890000, 2600000, 3100000, 3350000,
      3680000, 3150000, 3420000, 3850000, 4100000, 5200000
    ],
    expenses: [
      1250000, 1380000, 1550000, 1420000, 1680000, 1790000,
      1950000, 1690000, 1820000, 2010000, 2180000, 2750000
    ]
  },
  2026: {
    income: [
      3250000, 3890000, 4650000, 4120000, 4850000, 5120000,
      5740000, 4980000, 5340000, 6150000, 5890000, 7250000
    ],
    expenses: [
      1780000, 1920000, 2340000, 2110000, 2490000, 2680000,
      2850000, 2520000, 2710000, 3120000, 2950000, 3680000
    ]
  },
  2027: {
    income: [
      4800000, 5400000, 6200000, 5900000, 6700000, 7100000,
      7800000, 7200000, 7900000, 8900000, 8600000, 10500000
    ],
    expenses: [
      2500000, 2750000, 3100000, 2950000, 3350000, 3550000,
      3850000, 3600000, 3950000, 4400000, 4300000, 5100000
    ]
  },
  2028: {
    income: [
      6500000, 7200000, 8100000, 7800000, 8900000, 9400000,
      10200000, 9600000, 10400000, 11800000, 11500000, 14200000
    ],
    expenses: [
      3300000, 3600000, 4050000, 3900000, 4450000, 4700000,
      5100000, 4800000, 5200000, 5800000, 5750000, 6900000
    ]
  }
};

export const IncomeExpensesAnalyticsView: React.FC = () => {
  const { currentUser } = useAuth();

  // Estados interactivos para filtros
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Lista de años disponibles para seleccionar
  const availableYears = [2025, 2026, 2027, 2028];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Cálculo de datos mensuales con base en el año y la sucursal seleccionada
  const monthlyData: MonthlyFinanceData[] = useMemo(() => {
    const yearBase = ANNUAL_BASE_DATA[selectedYear] || ANNUAL_BASE_DATA[2026];

    // Factor según la sucursal
    // Viña: 48% ingresos, 46% gastos
    // Valpo: 32% ingresos, 33% gastos
    // Quilpué: 20% ingresos, 21% gastos
    let incomeMultiplier = 1.0;
    let expenseMultiplier = 1.0;

    if (selectedBranchId === 'vina_del_mar') {
      incomeMultiplier = 0.48;
      expenseMultiplier = 0.46;
    } else if (selectedBranchId === 'valparaiso') {
      incomeMultiplier = 0.32;
      expenseMultiplier = 0.33;
    } else if (selectedBranchId === 'quilpue') {
      incomeMultiplier = 0.20;
      expenseMultiplier = 0.21;
    }

    return MONTH_NAMES.map((name, index) => {
      const rawInc = yearBase.income[index] || 0;
      const rawExp = yearBase.expenses[index] || 0;
      return {
        monthIndex: index,
        monthName: name,
        shortName: MONTH_SHORT[index],
        income: Math.round(rawInc * incomeMultiplier),
        expenses: Math.round(rawExp * expenseMultiplier)
      };
    });
  }, [selectedYear, selectedBranchId]);

  // Totales acumulados del año
  const totalAnnualIncome = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.income, 0);
  }, [monthlyData]);

  const totalAnnualExpenses = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.expenses, 0);
  }, [monthlyData]);

  const netAnnualProfit = totalAnnualIncome - totalAnnualExpenses;
  const profitMarginPercent =
    totalAnnualIncome > 0
      ? ((netAnnualProfit / totalAnnualIncome) * 100).toFixed(1)
      : '0.0';

  // Nombre de la sucursal activa para el título
  const activeBranchName = useMemo(() => {
    if (selectedBranchId === 'all') {
      return 'Todas las Sucursales (Consolidado)';
    }
    const branch = INITIAL_BRANCHES.find((b) => b.id === selectedBranchId);
    return branch ? `${branch.city} - ${branch.name}` : 'Sucursal Seleccionada';
  }, [selectedBranchId]);

  // Exportar datos a CSV
  const handleExportCSV = () => {
    const headers = 'Mes,Ingresos_CLP,Gastos_CLP,Utilidad_Neta_CLP,Margen_Porcentaje\n';
    const rows = monthlyData
      .map((d) => {
        const net = d.income - d.expenses;
        const margin = d.income > 0 ? ((net / d.income) * 100).toFixed(1) : '0.0';
        return `${d.monthName},${d.income},${d.expenses},${net},${margin}%`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ingresos_Gastos_${selectedYear}_${selectedBranchId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-sans text-gray-900 pb-16">
      <WindowFrame
        title="SUPER_ROOT_FINANCES.SYS - [Analítica Comparativa de Ingresos vs. Gastos]"
        icon={<PixelIcon name="floppy" size={16} />}
        statusBarText={`AUDITORÍA SUPER ADMIN // AÑO FISCAL: ${selectedYear} // NODO: ${selectedBranchId.toUpperCase()} // UTILIDAD NETA: $${netAnnualProfit.toLocaleString('es-CL')} CLP`}
      >
        <div className="space-y-4">
          {/* Cabecera y Barra de Control */}
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

                <span className="bg-emerald-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                  BALANCE & CASHFLOW
                </span>

                <h2 className="text-sm font-extrabold text-[#003c74] uppercase tracking-wide">
                  Ingresos vs. Gastos
                </h2>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Visualización mensual de flujo de caja con barras de Ingresos (Verde) y Gastos (Rojo) de Enero a Diciembre por sucursal.
              </p>
            </div>

            {/* Acciones y Filtros de la Barra Superior */}
            <div className="flex flex-wrap items-center gap-2">
              {/* SELECTOR DE AÑO (2025, 2026, 2027, 2028) */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-gray-400 text-xs shadow-inner">
                <Calendar className="w-3.5 h-3.5 text-blue-800" />
                <span className="font-bold text-gray-700 text-[11px]">Año:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="text-xs bg-transparent focus:outline-none cursor-pointer font-bold text-blue-900"
                  aria-label="Seleccionar Año Fiscal"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      Año {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* FILTRO DE SUCURSAL (TODAS O ESPECÍFICA) */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-gray-400 text-xs shadow-inner">
                <Store className="w-3.5 h-3.5 text-blue-800" />
                <span className="font-bold text-gray-700 text-[11px]">Sucursal:</span>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="text-xs bg-transparent focus:outline-none cursor-pointer font-bold text-blue-900"
                  aria-label="Filtrar por Sucursal"
                >
                  <option value="all">★ Todas las Sucursales (Consolidado)</option>
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
                title="Actualizar datos"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1.5"
                title="Descargar informe CSV"
              >
                <Download className="w-3.5 h-3.5 text-blue-700" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Tarjetas de Resumen Financiero Anual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Ingresos Totales */}
            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-green-900 flex items-center justify-between">
                <span>INGRESOS ANUALES ({selectedYear})</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-black text-green-700 mt-1 font-mono">
                ${totalAnnualIncome.toLocaleString('es-CL')}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Ventas y reservas cobradas
              </div>
            </div>

            {/* 2. Gastos Totales */}
            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-red-900 flex items-center justify-between">
                <span>GASTOS ANUALES ({selectedYear})</span>
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-red-700 mt-1 font-mono">
                ${totalAnnualExpenses.toLocaleString('es-CL')}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Operaciones, insumos y compras
              </div>
            </div>

            {/* 3. Utilidad Neta */}
            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>UTILIDAD NETA ({selectedYear})</span>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-blue-900 mt-1 font-mono">
                ${netAnnualProfit.toLocaleString('es-CL')}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Balance positivo consolidado
              </div>
            </div>

            {/* 4. Margen Operativo */}
            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-purple-900 flex items-center justify-between">
                <span>MARGEN OPERATIVO</span>
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-purple-900 mt-1 font-mono">
                {profitMarginPercent}%
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Eficiencia financiera del negocio
              </div>
            </div>
          </div>

          {/* =================================================================
              COMPONENTE PRINCIPAL: GRÁFICO DE BARRAS DE INGRESOS Y GASTOS
              ================================================================= */}
          <section>
            <IncomeExpensesBarChart
              data={monthlyData}
              year={selectedYear}
              branchName={activeBranchName}
            />
          </section>

          {/* TABLA DE AUDITORÍA: DESGLOSE MES A MES */}
          <div className="bg-white border border-[#7f9db9] p-3 shadow-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-800" />
                <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wide">
                  Desglose Mensual Detallado — Año {selectedYear} ({activeBranchName})
                </h4>
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">
                12 Meses Fiscales Auditados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200">
                <thead className="bg-[#e4ebf5] text-blue-950 font-bold border-b border-gray-300 text-[11px]">
                  <tr>
                    <th className="py-1.5 px-3">Mes Fiscal</th>
                    <th className="py-1.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-green-900">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        Ingresos ($ CLP)
                      </span>
                    </th>
                    <th className="py-1.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-red-900">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        Gastos ($ CLP)
                      </span>
                    </th>
                    <th className="py-1.5 px-3 text-right">Utilidad Neta</th>
                    <th className="py-1.5 px-3 text-center">Margen</th>
                    <th className="py-1.5 px-3 text-center">Estado Financiero</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlyData.map((item) => {
                    const net = item.income - item.expenses;
                    const isPositive = net >= 0;
                    const margin =
                      item.income > 0 ? ((net / item.income) * 100).toFixed(1) : '0.0';

                    return (
                      <tr key={item.monthName} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-2 px-3 font-bold text-gray-900 text-xs">
                          {item.monthName}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-green-700 text-xs">
                          ${item.income.toLocaleString('es-CL')}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-red-700 text-xs">
                          ${item.expenses.toLocaleString('es-CL')}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-xs">
                          <span className={isPositive ? 'text-blue-900 font-extrabold' : 'text-amber-800'}>
                            {isPositive ? '+' : '-'}${Math.abs(net).toLocaleString('es-CL')}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-semibold text-gray-700">
                          {margin}%
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${
                              isPositive
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            {isPositive ? '★ Superávit' : '⚠ Déficit'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-[#eaf2fc] border-t-2 border-blue-900 font-bold text-xs">
                  <tr>
                    <td className="py-2 px-3 text-blue-950 uppercase font-black">
                      Total Anual {selectedYear}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-black text-green-800 text-sm">
                      ${totalAnnualIncome.toLocaleString('es-CL')}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-black text-red-800 text-sm">
                      ${totalAnnualExpenses.toLocaleString('es-CL')}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-black text-blue-950 text-sm">
                      ${netAnnualProfit.toLocaleString('es-CL')}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-black text-purple-900 text-xs">
                      {profitMarginPercent}%
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-xs bg-blue-900 text-white">
                        AUDITADO OK
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
