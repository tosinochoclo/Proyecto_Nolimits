import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Store, Calendar } from 'lucide-react';

export interface MonthlyFinanceData {
  monthIndex: number; // 0 a 11
  monthName: string; // 'Enero', 'Febrero', ...
  shortName: string; // 'Ene', 'Feb', ...
  income: number;
  expenses: number;
}

interface IncomeExpensesBarChartProps {
  data: MonthlyFinanceData[];
  year: number;
  branchName: string;
}

export const IncomeExpensesBarChart: React.FC<IncomeExpensesBarChartProps> = ({
  data,
  year,
  branchName,
}) => {
  const [hoveredBar, setHoveredBar] = useState<{
    monthIndex: number;
    type: 'income' | 'expense' | 'both';
  } | null>(null);

  // Encontrar el valor máximo entre ingresos y gastos para escalar el eje Y
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expenses)),
    1000000 // Mínimo 1M para escala
  );

  // Redondear hacia arriba para tener una escala limpia en el eje Y (ej: múltiplos de 1M o 5M)
  const yAxisMax = Math.ceil((maxVal * 1.15) / 1000000) * 1000000;
  const yTicks = [0, yAxisMax * 0.25, yAxisMax * 0.5, yAxisMax * 0.75, yAxisMax];

  // Dimensiones del gráfico SVG
  const svgWidth = 860;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 95 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Ancho por mes y ancho de barras
  const monthWidth = chartWidth / data.length;
  const barWidth = Math.max(14, monthWidth * 0.32);
  const barGap = 4;

  const formatShortCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}K`;
    }
    return `$${val}`;
  };

  const activeData = hoveredBar !== null ? data[hoveredBar.monthIndex] : null;

  return (
    <div className="bg-white border border-[#7f9db9] p-3.5 shadow-xs space-y-3">
      {/* Cabecera y Leyenda de Colores */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-2.5">
        <div>
          <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#16a34a] inline-block shadow-xs" />
            <span>Comparativa de Ingresos vs. Gastos — Año {year}</span>
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Filtrado por: <strong className="text-gray-800">{branchName}</strong> • Eje Y: Dinero ($ CLP) • Eje X: Meses (Ene - Dic)
          </p>
        </div>

        {/* Leyenda interactiva de colores */}
        <div className="flex items-center gap-3 text-xs bg-gray-50 px-3 py-1 border border-gray-300 rounded-xs">
          <div className="flex items-center gap-1.5 font-bold text-green-800">
            <span className="w-3.5 h-3.5 bg-[#16a34a] border border-green-800 rounded-xs inline-block shadow-xs" />
            <span>Ingresos (Verde)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-red-800">
            <span className="w-3.5 h-3.5 bg-[#dc2626] border border-red-800 rounded-xs inline-block shadow-xs" />
            <span>Gastos (Rojo)</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras SVG con Scroll Horizontal en pantallas pequeñas */}
      <div className="relative overflow-x-auto select-none pt-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[700px] font-sans"
        >
          {/* Fondo de cuadrícula estilo Windows XP */}
          <rect
            x={padding.left}
            y={padding.top}
            width={chartWidth}
            height={chartHeight}
            fill="#fafafa"
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* Líneas horizontales de la cuadrícula y etiquetas del EJE Y (Dinero) */}
          {yTicks.map((tick, i) => {
            const yPos = padding.top + chartHeight - (tick / yAxisMax) * chartHeight;
            return (
              <g key={`ytick-${i}`}>
                {/* Línea horizontal */}
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={padding.left + chartWidth}
                  y2={yPos}
                  stroke={i === 0 ? '#64748b' : '#e2e8f0'}
                  strokeDasharray={i === 0 ? '0' : '3 3'}
                  strokeWidth="1"
                />
                {/* Etiqueta Eje Y */}
                <text
                  x={padding.left - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  className="fill-gray-600 font-mono text-[11px] font-semibold"
                >
                  {formatShortCurrency(tick)}
                </text>
              </g>
            );
          })}

          {/* Barras agrupadas por mes (Enero hasta Diciembre) */}
          {data.map((item, index) => {
            const groupCenterX = padding.left + index * monthWidth + monthWidth / 2;

            // Coordenadas barra de INGRESOS (Verde)
            const incomeHeight = (item.income / yAxisMax) * chartHeight;
            const incomeX = groupCenterX - barWidth - barGap / 2;
            const incomeY = padding.top + chartHeight - incomeHeight;

            // Coordenadas barra de GASTOS (Rojo)
            const expenseHeight = (item.expenses / yAxisMax) * chartHeight;
            const expenseX = groupCenterX + barGap / 2;
            const expenseY = padding.top + chartHeight - expenseHeight;

            const isIncomeHovered =
              hoveredBar?.monthIndex === index &&
              (hoveredBar.type === 'income' || hoveredBar.type === 'both');
            const isExpenseHovered =
              hoveredBar?.monthIndex === index &&
              (hoveredBar.type === 'expense' || hoveredBar.type === 'both');

            return (
              <g
                key={item.monthName}
                onMouseEnter={() => setHoveredBar({ monthIndex: index, type: 'both' })}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Resaltado de fondo de mes activo al pasar el cursor */}
                {hoveredBar?.monthIndex === index && (
                  <rect
                    x={padding.left + index * monthWidth}
                    y={padding.top}
                    width={monthWidth}
                    height={chartHeight}
                    fill="#3b82f6"
                    opacity="0.08"
                  />
                )}

                {/* BARRA DE INGRESOS (VERDE) */}
                <g
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredBar({ monthIndex: index, type: 'income' });
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={incomeX}
                    y={incomeY}
                    width={barWidth}
                    height={incomeHeight}
                    fill="#16a34a"
                    stroke={isIncomeHovered ? '#14532d' : '#15803d'}
                    strokeWidth={isIncomeHovered ? 2 : 1}
                    className="transition-all duration-150 hover:brightness-110"
                    rx="1"
                  />
                  {/* Borde biselado superior brillante estilo XP */}
                  <line
                    x1={incomeX}
                    y1={incomeY}
                    x2={incomeX + barWidth}
                    y2={incomeY}
                    stroke="#4ade80"
                    strokeWidth="1.5"
                  />
                </g>

                {/* BARRA DE GASTOS (ROJO) */}
                <g
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredBar({ monthIndex: index, type: 'expense' });
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={expenseX}
                    y={expenseY}
                    width={barWidth}
                    height={expenseHeight}
                    fill="#dc2626"
                    stroke={isExpenseHovered ? '#7f1d1d' : '#b91c1c'}
                    strokeWidth={isExpenseHovered ? 2 : 1}
                    className="transition-all duration-150 hover:brightness-110"
                    rx="1"
                  />
                  {/* Borde biselado superior brillante estilo XP */}
                  <line
                    x1={expenseX}
                    y1={expenseY}
                    x2={expenseX + barWidth}
                    y2={expenseY}
                    stroke="#f87171"
                    strokeWidth="1.5"
                  />
                </g>

                {/* EJE X: Etiqueta del Mes (Ene..Dic) */}
                <text
                  x={groupCenterX}
                  y={padding.top + chartHeight + 20}
                  textAnchor="middle"
                  className={`text-xs font-bold ${
                    hoveredBar?.monthIndex === index
                      ? 'fill-blue-900 font-black'
                      : 'fill-gray-700'
                  }`}
                >
                  {item.shortName}
                </text>
              </g>
            );
          })}

          {/* Línea base del EJE X */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Título del EJE X al fondo */}
          <text
            x={padding.left + chartWidth / 2}
            y={padding.top + chartHeight + 42}
            textAnchor="middle"
            className="fill-gray-500 text-[11px] font-semibold uppercase tracking-wider"
          >
            Meses del Año {year} (Enero a Diciembre)
          </text>

          {/* Título del EJE Y vertical */}
          <text
            transform={`rotate(-90)`}
            x={-(padding.top + chartHeight / 2)}
            y={24}
            textAnchor="middle"
            className="fill-gray-600 text-[11px] font-bold uppercase tracking-wider"
          >
            Monto de Dinero ($ CLP)
          </text>
        </svg>
      </div>

      {/* PANEL TOOLTIP / DETALLE EXACTO AL COLOCAR EL CURSOR DEL MOUSE */}
      <div className="bg-[#eaf2fc] border border-[#7f9db9] p-3 rounded-xs min-h-[58px] flex items-center justify-between flex-wrap gap-3">
        {activeData ? (
          <>
            <div className="flex items-center gap-3">
              <span className="bg-[#0055ea] text-white px-2 py-1 rounded-xs font-bold text-xs uppercase tracking-wide">
                {activeData.monthName} {year}
              </span>
              <span className="text-xs text-gray-700 font-semibold">
                Sucursal: <strong className="text-blue-900">{branchName}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              {/* Ingreso Exacto */}
              <div
                className={`p-1.5 px-3 rounded-xs border flex items-center gap-1.5 ${
                  hoveredBar?.type === 'income'
                    ? 'bg-green-100 border-green-600 ring-2 ring-green-400 font-black'
                    : 'bg-green-50 border-green-300'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                <span className="text-green-900 font-bold">Ingreso Exacto:</span>
                <span className="text-green-800 text-sm font-extrabold">
                  ${activeData.income.toLocaleString('es-CL')} CLP
                </span>
              </div>

              {/* Gasto Exacto */}
              <div
                className={`p-1.5 px-3 rounded-xs border flex items-center gap-1.5 ${
                  hoveredBar?.type === 'expense'
                    ? 'bg-red-100 border-red-600 ring-2 ring-red-400 font-black'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span className="text-red-900 font-bold">Gasto Exacto:</span>
                <span className="text-red-800 text-sm font-extrabold">
                  ${activeData.expenses.toLocaleString('es-CL')} CLP
                </span>
              </div>

              {/* Balance Neto del Mes */}
              {(() => {
                const net = activeData.income - activeData.expenses;
                const isPositive = net >= 0;
                return (
                  <div
                    className={`p-1.5 px-3 rounded-xs border flex items-center gap-1.5 ${
                      isPositive
                        ? 'bg-blue-50 border-blue-300 text-blue-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-blue-700" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span className="font-bold">Utilidad Neta:</span>
                    <span className="font-extrabold text-sm">
                      {isPositive ? '+' : '-'}${Math.abs(net).toLocaleString('es-CL')} CLP
                    </span>
                  </div>
                );
              })()}
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-600 italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>
              Coloque el cursor del mouse sobre cualquier barra <strong>Verde (Ingreso)</strong> o <strong>Roja (Gasto)</strong> para ver el monto exacto en pesos chilenos de ese mes.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
