import React, { useState } from 'react';
import {
  Inbox,
  Clock,
  Truck,
  CheckCircle,
  Building,
  CheckCheck,
  Filter,
  Eye,
  Store,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { Branch } from '../../types';

export type ProductOperationalState =
  | 'Solicitud recibida'
  | 'En Preparación'
  | 'En transito'
  | 'Entregado'
  | 'Listo para el retiro de sucursal'
  | 'Retirado';

export interface ProductStatusItem {
  id: string;
  orderNumber: string;
  sku: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  customerName: string;
  branchId: string;
  branchName: string;
  state: ProductOperationalState;
  date: string;
  deliveryType: 'Despacho a Domicilio' | 'Retiro en Tienda';
}

interface ProductStatusSummaryWidgetProps {
  branches: Branch[];
  statusData: Record<ProductOperationalState, Record<string, number>>; // { [state]: { [branchId]: count, total: number } }
  recentItems: ProductStatusItem[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
}

const STATE_CONFIG: Record<
  ProductOperationalState,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    badgeBg: string;
    description: string;
  }
> = {
  'Solicitud recibida': {
    icon: Inbox,
    color: '#eab308',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-900',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Nuevos pedidos y reservas registradas esperando confirmación de pago/bodega'
  },
  'En Preparación': {
    icon: Clock,
    color: '#3b82f6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-900',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Prendas en picking, control de calidad y embalaje con packaging oficial'
  },
  'En transito': {
    icon: Truck,
    color: '#8b5cf6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-900',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'En ruta con transportista (Starken / Blue Express) o en traslado entre sucursales'
  },
  'Entregado': {
    icon: CheckCircle,
    color: '#10b981',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-900',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Despacho recepcionado exitosamente en la dirección del cliente'
  },
  'Listo para el retiro de sucursal': {
    icon: Building,
    color: '#06b6d4',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-900',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    description: 'Disponible en el mesón de la tienda para ser retirado por el cliente'
  },
  'Retirado': {
    icon: CheckCheck,
    color: '#475569',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-900',
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
    description: 'Retiro presencial completado por el cliente en el punto de entrega'
  }
};

const ORDERED_STATES: ProductOperationalState[] = [
  'Solicitud recibida',
  'En Preparación',
  'En transito',
  'Entregado',
  'Listo para el retiro de sucursal',
  'Retirado'
];

export const ProductStatusSummaryWidget: React.FC<ProductStatusSummaryWidgetProps> = ({
  branches,
  statusData,
  recentItems,
  selectedBranchId,
  onSelectBranch,
}) => {
  const [filterState, setFilterState] = useState<ProductOperationalState | 'all'>('all');

  // Filtrado de items para la tabla de inspección
  const filteredItems = recentItems.filter((item) => {
    const matchesBranch = selectedBranchId === 'all' || item.branchId === selectedBranchId;
    const matchesState = filterState === 'all' || item.state === filterState;
    return matchesBranch && matchesState;
  });

  return (
    <div className="bg-[#f0f4f8] border border-[#7f9db9] p-3.5 space-y-3.5 winxp-bevel-out">
      {/* Cabecera del Resumen de Productos */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs rounded-xs shadow-xs">
            <PackageCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wide">
              Resumen de Productos
            </h3>
            <p className="text-[11px] text-gray-600">
              Cantidad de productos clasificados por estado operativo y distribución por sucursal
            </p>
          </div>
        </div>

        {/* Selector de Sucursal */}
        <div className="flex items-center gap-1.5 bg-white px-2 py-1 border border-gray-400 text-xs">
          <span className="font-bold text-blue-900 text-[11px]">Especificar Sucursal:</span>
          <select
            value={selectedBranchId}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="text-xs bg-transparent focus:outline-none cursor-pointer font-semibold text-gray-800"
            aria-label="Seleccionar sucursal para resumen de productos"
          >
            <option value="all">★ Todas las Sucursales (Consolidado)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.city} ({b.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de 6 Tarjetas con los Estados Específicos Solicitados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
        {ORDERED_STATES.map((state) => {
          const config = STATE_CONFIG[state];
          const Icon = config.icon;

          // Obtener cantidad según sucursal seleccionada o total global
          const branchCounts = statusData[state] || {};
          const count =
            selectedBranchId === 'all'
              ? Object.values(branchCounts).reduce((a, b) => a + b, 0)
              : branchCounts[selectedBranchId] || 0;

          const isSelected = filterState === state;

          return (
            <div
              key={state}
              onClick={() => setFilterState(isSelected ? 'all' : state)}
              className={`p-2.5 rounded-xs border transition-all cursor-pointer flex flex-col justify-between ${config.bgColor} ${
                isSelected
                  ? `ring-2 ring-blue-600 ${config.borderColor} shadow-md`
                  : `${config.borderColor} hover:shadow-xs hover:brightness-95`
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className="p-1 rounded-xs bg-white/80 border border-gray-300 shadow-xs"
                    style={{ color: config.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs border ${config.badgeBg}`}>
                    {count} prod.
                  </span>
                </div>

                <div className={`text-xs font-bold ${config.textColor} leading-tight`}>
                  {state}
                </div>
              </div>

              {/* Desglose por sucursales en miniatura si estamos en vista 'all' */}
              {selectedBranchId === 'all' && (
                <div className="mt-2 pt-1.5 border-t border-gray-200/60 text-[10px] space-y-0.5 text-gray-600">
                  {branches.map((b) => {
                    const bCount = branchCounts[b.id] || 0;
                    return (
                      <div key={b.id} className="flex justify-between items-center">
                        <span className="truncate max-w-[70px]">{b.city}:</span>
                        <span className="font-mono font-bold text-gray-800">{bCount}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedBranchId !== 'all' && (
                <div className="mt-2 pt-1.5 border-t border-gray-200/60 text-[10px] text-gray-600 font-semibold">
                  Sucursal actual activa
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tabla de Detalle e Inspección de Productos por Estado y Sucursal */}
      <div className="bg-white border border-[#7f9db9] p-2.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200 mb-2">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-800" />
            <span className="font-bold text-xs text-blue-900 uppercase">
              Detalle de Productos en Estado:{' '}
              <span className="text-blue-700 underline">
                {filterState === 'all' ? 'Todos los Estados' : filterState}
              </span>
            </span>
          </div>
          <div className="text-[11px] text-gray-500 font-semibold">
            Mostrando {filteredItems.length} registros operativos
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-200">
            <thead className="bg-[#e4ebf5] text-blue-950 font-bold border-b border-gray-300 text-[11px]">
              <tr>
                <th className="py-1.5 px-2">Pedido / Folio</th>
                <th className="py-1.5 px-2">SKU & Prenda</th>
                <th className="py-1.5 px-2">Cant.</th>
                <th className="py-1.5 px-2">Sucursal Asignada</th>
                <th className="py-1.5 px-2">Cliente</th>
                <th className="py-1.5 px-2">Modalidad</th>
                <th className="py-1.5 px-2">Estado Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const config = STATE_CONFIG[item.state];
                return (
                  <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-1.5 px-2 font-mono font-bold text-blue-900">
                      #{item.orderNumber}
                    </td>
                    <td className="py-1.5 px-2">
                      <div className="flex items-center gap-2">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productTitle}
                            className="w-6 h-6 object-cover border border-gray-300 rounded-xs shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-[11px] max-w-[200px] truncate" title={item.productTitle}>
                            {item.productTitle}
                          </div>
                          <div className="font-mono text-[9px] text-gray-500">
                            {item.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 font-mono font-bold text-gray-900">
                      {item.quantity} un.
                    </td>
                    <td className="py-1.5 px-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-800 text-[11px]">
                        <Store className="w-3 h-3 text-blue-700" />
                        {item.branchName}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-gray-700 text-[11px]">
                      {item.customerName}
                    </td>
                    <td className="py-1.5 px-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-gray-100 border border-gray-300 font-medium">
                        {item.deliveryType}
                      </span>
                    </td>
                    <td className="py-1.5 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${config.badgeBg}`}>
                        {item.state}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
