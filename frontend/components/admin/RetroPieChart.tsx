import React, { useState } from 'react';

export interface PieChartItem {
  id: string;
  label: string;
  value: number;
  subLabel?: string;
  secondaryText?: string;
  color?: string;
  sku?: string;
  image?: string;
}

interface RetroPieChartProps {
  title: string;
  subtitle?: string;
  data: PieChartItem[];
  valuePrefix?: string;
  valueSuffix?: string;
  height?: number;
  donut?: boolean;
}

const DEFAULT_PALETTE = [
  '#0055ea', // Azul Windows XP
  '#10b981', // Verde esmeralda
  '#f59e0b', // Ámbar dorado
  '#ec4899', // Rosa Cyber
  '#8b5cf6', // Violeta neón
  '#06b6d4', // Cian cielo
  '#f97316', // Naranja eléctrico
  '#6366f1', // Índigo profundo
  '#14b8a6', // Teal digital
  '#ef4444', // Rojo rubí
];

export const RetroPieChart: React.FC<RetroPieChartProps> = ({
  title,
  subtitle,
  data,
  valuePrefix = '',
  valueSuffix = '',
  height = 280,
  donut = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Dimensiones del canvas SVG
  const size = 260;
  const center = size / 2;
  const radius = donut ? 105 : 110;
  const innerRadius = donut ? 50 : 0;

  // Cálculo de los sectores del pastel
  let cumulativeAngle = -90; // Empezamos en las 12:00 (-90 grados)

  const slices = data.map((item, index) => {
    const fraction = total > 0 ? item.value / total : 0;
    const sliceAngle = fraction * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;
    cumulativeAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const midRad = (midAngle * Math.PI) / 180;

    const color = item.color || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];

    // Desplazamiento sutil al pasar el mouse por encima
    const isHovered = hoveredIndex === index;
    const offset = isHovered ? 8 : 0;
    const offsetX = offset * Math.cos(midRad);
    const offsetY = offset * Math.sin(midRad);

    const x1 = center + radius * Math.cos(startRad) + offsetX;
    const y1 = center + radius * Math.sin(startRad) + offsetY;
    const x2 = center + radius * Math.cos(endRad) + offsetX;
    const y2 = center + radius * Math.sin(endRad) + offsetY;

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    let pathData = '';
    if (innerRadius > 0) {
      const ix1 = center + innerRadius * Math.cos(startRad) + offsetX;
      const iy1 = center + innerRadius * Math.sin(startRad) + offsetY;
      const ix2 = center + innerRadius * Math.cos(endRad) + offsetX;
      const iy2 = center + innerRadius * Math.sin(endRad) + offsetY;
      pathData = `M ${ix1} ${iy1} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1} Z`;
    } else {
      const cx = center + offsetX;
      const cy = center + offsetY;
      pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }

    return {
      ...item,
      index,
      color,
      pathData,
      fraction,
      percentage: (fraction * 100).toFixed(1),
      isHovered,
    };
  });

  const activeItem = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
      {/* Cabecera del Gráfico */}
      <div className="border-b border-gray-200 pb-2 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0055ea] inline-block shadow-xs" />
            {title}
          </h4>
          {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="text-[11px] font-bold text-gray-700 bg-blue-50 px-2 py-0.5 border border-blue-200">
          Total Muestra: <span className="text-blue-900">{valuePrefix}{total.toLocaleString('es-CL')}{valueSuffix}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Visualización del Gráfico de Pastel (SVG) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative select-none">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="filter drop-shadow-sm overflow-visible"
          >
            {/* Sombra base del gráfico de pastel */}
            <circle cx={center + 2} cy={center + 4} r={radius} fill="#000000" opacity="0.08" />

            {/* Sectores de pastel */}
            {slices.map((slice) => (
              <path
                key={slice.id}
                d={slice.pathData}
                fill={slice.color}
                stroke="#ffffff"
                strokeWidth={slice.isHovered ? 2.5 : 1.5}
                className="transition-all duration-150 cursor-pointer hover:brightness-110"
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}

            {/* Agujero central si es dona */}
            {donut && (
              <circle
                cx={center}
                cy={center}
                r={innerRadius - 2}
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            )}
          </svg>

          {/* Información emergente al pasar el cursor */}
          <div className="h-10 mt-2 flex items-center justify-center text-center">
            {activeItem ? (
              <div className="bg-[#1e3a8a] text-white px-2.5 py-1 rounded-xs text-[11px] shadow-md border border-blue-400 animate-in fade-in zoom-in-95 duration-100 max-w-[280px] truncate">
                <span className="font-bold text-amber-300 mr-1.5">#{activeItem.index + 1}</span>
                <span className="font-semibold">{activeItem.label}:</span>{' '}
                <span className="font-bold text-white ml-1">
                  {valuePrefix}{activeItem.value.toLocaleString('es-CL')}{valueSuffix} ({activeItem.percentage}%)
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-500 italic">
                Pase el cursor sobre un segmento o elemento para ver detalles
              </span>
            )}
          </div>
        </div>

        {/* Leyenda y Ranking Top 10 Detallado */}
        <div className="md:col-span-6 space-y-1 max-h-[300px] overflow-y-auto pr-1 text-xs">
          {slices.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-1.5 rounded-xs border transition-colors cursor-pointer ${
                item.isHovered
                  ? 'bg-blue-100/80 border-blue-400 text-blue-950 font-semibold shadow-xs'
                  : 'bg-[#f8fafc] border-gray-200 text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span
                  className="w-4 h-4 rounded-xs shrink-0 flex items-center justify-center text-[9px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: item.color }}
                >
                  {item.index + 1}
                </span>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-6 h-6 object-cover border border-gray-300 rounded-xs shrink-0 bg-white"
                  />
                )}

                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate leading-tight" title={item.label}>
                    {item.label}
                  </div>
                  {item.sku && (
                    <div className="text-[10px] text-gray-500 font-mono leading-none">
                      SKU: {item.sku}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono text-[11px] font-bold text-blue-900">
                  {valuePrefix}{item.value.toLocaleString('es-CL')}{valueSuffix}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
