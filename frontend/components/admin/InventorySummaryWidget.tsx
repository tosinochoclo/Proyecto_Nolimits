import React from 'react';
import { Package, Users, Layers, TrendingUp, Store, DollarSign, CheckCircle2 } from 'lucide-react';
import { Branch } from '../../types';

interface BranchSalesData {
  branchId: string;
  branchName: string;
  city: string;
  salesCount: number;
  totalRevenue: number;
  colorTag?: string;
}

interface InventorySummaryWidgetProps {
  categoriesCount: number;
  categoriesList: { name: string; count: number }[];
  usersCount: number;
  usersBreakdown: {
    registered: number;
    branchAdmins: number;
    superAdmins: number;
  };
  productsCount: number;
  totalStockUnits: number;
  outOfStockCount: number;
  branchSales: BranchSalesData[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
}

export const InventorySummaryWidget: React.FC<InventorySummaryWidgetProps> = ({
  categoriesCount,
  categoriesList,
  usersCount,
  usersBreakdown,
  productsCount,
  totalStockUnits,
  outOfStockCount,
  branchSales,
  selectedBranchId,
  onSelectBranch,
}) => {
  // Cálculo de ventas totales consolidadas de todas las sucursales
  const totalSalesCount = branchSales.reduce((acc, curr) => acc + curr.salesCount, 0);
  const totalSalesRevenue = branchSales.reduce((acc, curr) => acc + curr.totalRevenue, 0);

  // Sucursal seleccionada (si no es 'all')
  const activeBranchData = branchSales.find((b) => b.branchId === selectedBranchId);

  return (
    <div className="bg-[#f0f4f8] border border-[#7f9db9] p-3.5 space-y-3.5 winxp-bevel-out">
      {/* Título de la sección Resumen de Inventario */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0055ea] text-white flex items-center justify-center font-bold text-xs rounded-xs shadow-xs">
            INV
          </div>
          <div>
            <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wide">
              Resumen de Inventario
            </h3>
            <p className="text-[11px] text-gray-600">
              Métricas consolidadas de catálogo, usuarios y volumen de ventas por sucursal
            </p>
          </div>
        </div>

        {/* Selector de Sucursal para foco de ventas */}
        <div className="flex items-center gap-1.5 bg-white px-2 py-1 border border-gray-400 text-xs">
          <span className="font-bold text-blue-900 text-[11px]">Filtrar Sucursal:</span>
          <select
            value={selectedBranchId}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="text-xs bg-transparent focus:outline-none cursor-pointer font-semibold text-gray-800"
            aria-label="Filtrar métricas de sucursal"
          >
            <option value="all">★ Todas las Sucursales (Consolidado Global)</option>
            {branchSales.map((b) => (
              <option key={b.branchId} value={b.branchId}>
                {b.city} - {b.branchName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de 4 Bloques Principales Requeridos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. CATEGORÍAS */}
        <div className="bg-white border border-[#7f9db9] p-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-gray-200 pb-1 mb-2">
              <span className="flex items-center gap-1.5 uppercase">
                <Layers className="w-4 h-4 text-blue-700" />
                Categorías
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-xs">
                Activas
              </span>
            </div>
            <div className="text-3xl font-extrabold text-blue-900 font-mono">
              {categoriesCount}
            </div>
            <div className="text-[11px] text-gray-600 mt-1 font-medium">
              Líneas de producto registradas
            </div>
          </div>

          {/* Mini lista de categorías principales */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
            {categoriesList.slice(0, 4).map((cat) => (
              <span
                key={cat.name}
                className="text-[10px] bg-gray-100 hover:bg-blue-50 text-gray-700 px-1.5 py-0.5 rounded-xs border border-gray-200"
                title={`${cat.count} productos en ${cat.name}`}
              >
                {cat.name} ({cat.count})
              </span>
            ))}
            {categoriesList.length > 4 && (
              <span className="text-[10px] text-blue-700 font-bold self-center">
                +{categoriesList.length - 4} más
              </span>
            )}
          </div>
        </div>

        {/* 2. USUARIOS */}
        <div className="bg-white border border-[#7f9db9] p-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 border-b border-gray-200 pb-1 mb-2">
              <span className="flex items-center gap-1.5 uppercase">
                <Users className="w-4 h-4 text-indigo-700" />
                Usuarios
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-xs">
                Plataforma
              </span>
            </div>
            <div className="text-3xl font-extrabold text-indigo-950 font-mono">
              {usersCount.toLocaleString('es-CL')}
            </div>
            <div className="text-[11px] text-gray-600 mt-1 font-medium">
              Usuarios totales en el sistema
            </div>
          </div>

          {/* Desglose por roles */}
          <div className="mt-3 pt-2 border-t border-gray-100 grid grid-cols-3 gap-1 text-center">
            <div className="bg-indigo-50/70 p-1 rounded-xs border border-indigo-100">
              <div className="text-[10px] text-gray-500 font-medium">Clientes</div>
              <div className="text-xs font-bold text-indigo-900 font-mono">
                {usersBreakdown.registered}
              </div>
            </div>
            <div className="bg-blue-50/70 p-1 rounded-xs border border-blue-100">
              <div className="text-[10px] text-gray-500 font-medium">Admin Suc.</div>
              <div className="text-xs font-bold text-blue-900 font-mono">
                {usersBreakdown.branchAdmins}
              </div>
            </div>
            <div className="bg-purple-50/70 p-1 rounded-xs border border-purple-100">
              <div className="text-[10px] text-gray-500 font-medium">Super Root</div>
              <div className="text-xs font-bold text-purple-900 font-mono">
                {usersBreakdown.superAdmins}
              </div>
            </div>
          </div>
        </div>

        {/* 3. PRODUCTOS */}
        <div className="bg-white border border-[#7f9db9] p-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 border-b border-gray-200 pb-1 mb-2">
              <span className="flex items-center gap-1.5 uppercase">
                <Package className="w-4 h-4 text-amber-700" />
                Productos
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-xs">
                Catálogo
              </span>
            </div>
            <div className="text-3xl font-extrabold text-amber-950 font-mono">
              {productsCount}
            </div>
            <div className="text-[11px] text-gray-600 mt-1 font-medium">
              Modelos activos publicados
            </div>
          </div>

          {/* Desglose de Unidades Físicas de Stock */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <div className="text-gray-600">
              Unidades físicas: <span className="font-bold text-gray-900 font-mono">{totalStockUnits}</span>
            </div>
            {outOfStockCount > 0 ? (
              <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded-xs font-bold border border-red-200">
                {outOfStockCount} agotado(s)
              </span>
            ) : (
              <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-xs font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-green-700" /> 100% Stock
              </span>
            )}
          </div>
        </div>

        {/* 4. VENTAS TOTALES DE TODAS LAS SUCURSALES */}
        <div className="bg-gradient-to-br from-[#0055ea] to-[#003c9e] text-white p-3 border border-blue-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-100 border-b border-blue-400/40 pb-1 mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wide">
                <TrendingUp className="w-4 h-4 text-yellow-300" />
                Ventas Totales
              </span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-xs font-bold">
                Global
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              ${totalSalesRevenue.toLocaleString('es-CL')}
            </div>
            <div className="text-[11px] text-blue-100 mt-1 font-medium">
              Ventas totales de todas las Sucursales
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-blue-400/30 flex items-center justify-between text-xs">
            <span className="text-blue-100">Transacciones:</span>
            <span className="font-bold font-mono text-yellow-300 text-sm">
              {totalSalesCount.toLocaleString('es-CL')} ventas
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE DETALLADO: "Ventas especificando de qué sucursal" */}
      <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2.5">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-blue-800" />
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
              Ventas especificando de qué Sucursal
            </h4>
          </div>
          <span className="text-[11px] text-gray-500 font-semibold">
            {branchSales.length} Nodos Operativos Activos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {branchSales.map((branch) => {
            const isSelected = selectedBranchId === branch.branchId;
            const percentageOfTotal =
              totalSalesRevenue > 0
                ? ((branch.totalRevenue / totalSalesRevenue) * 100).toFixed(1)
                : '0.0';

            return (
              <div
                key={branch.branchId}
                onClick={() => onSelectBranch(isSelected ? 'all' : branch.branchId)}
                className={`p-2.5 border rounded-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-400 shadow-sm'
                    : 'bg-[#fafafa] border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: branch.colorTag || '#0055ea' }}
                    />
                    {branch.branchName}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-gray-200 text-gray-800">
                    {percentageOfTotal}%
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Recaudación</div>
                    <div className="text-sm font-extrabold text-gray-900 font-mono">
                      ${branch.totalRevenue.toLocaleString('es-CL')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Ventas</div>
                    <div className="text-sm font-bold text-blue-800 font-mono">
                      {branch.salesCount} ops
                    </div>
                  </div>
                </div>

                {/* Barra de progreso visual por sucursal */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-[#0055ea] transition-all duration-300"
                    style={{ width: `${percentageOfTotal}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
