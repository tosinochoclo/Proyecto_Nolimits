import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, Store, MapPin, CheckCircle2, Clock, Truck, Shield } from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { INITIAL_PRODUCTS, INITIAL_BRANCHES } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';

export const LocalBranchAdminView: React.FC = () => {
  const { branchId = 'vina_del_mar' } = useParams<{ branchId: string }>();
  const branch = INITIAL_BRANCHES.find(b => b.id === branchId) || INITIAL_BRANCHES[0];
  const { currentUser } = useAuth();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedPerBranch = { ...p.stockPerBranch, [branch.id]: Math.max(0, newStock) };
          const newTotal = Object.values(updatedPerBranch).reduce((a, b) => a + b, 0);
          return { ...p, stockPerBranch: updatedPerBranch, totalStock: newTotal };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-4 font-sans text-gray-900">
      <WindowFrame
        title={`BRANCH_NODE.SYS - [${branch.name}]`}
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText={`JEFE DE TIENDA: ${branch.managerName} // STOCK FÍSICO AUDITABLE // RED CENTRAL`}
      >
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#003c74]">
                <MapPin className="w-4 h-4 text-blue-700" />
                <span>ADMINISTRACIÓN LOCAL DE SUCURSAL: {branch.city.toUpperCase()}</span>
              </div>
              <span className="text-gray-600 text-xs">
                {branch.address} • Teléfono: {branch.phone}
              </span>
            </div>

            <span className="text-xs bg-green-100 text-green-800 border border-green-500 font-bold px-2.5 py-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              SUCURSAL ACTIVA EN STREAMING
            </span>
          </div>

          {/* Tabla de Inventario de la Sucursal */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-[#003c74] uppercase">
              Inventario Físico de esta Tienda
            </h3>
            <div className="border border-gray-400 overflow-x-auto bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#ece9d8] border-b border-gray-400 text-gray-800 font-bold text-[11px]">
                  <tr>
                    <th className="p-2 border-r border-gray-300">PRENDA</th>
                    <th className="p-2 border-r border-gray-300">SKU</th>
                    <th className="p-2 border-r border-gray-300">PRECIO</th>
                    <th className="p-2 border-r border-gray-300">STOCK EN TIENDA</th>
                    <th className="p-2 border-r border-gray-300">ESTADO</th>
                    <th className="p-2">AJUSTAR EN VIVO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((p) => {
                    const localStock = p.stockPerBranch[branch.id] ?? 0;
                    return (
                      <tr key={p.id} className="hover:bg-blue-50">
                        <td className="p-2 font-bold text-gray-900 flex items-center gap-2">
                          <img src={p.images[0]} alt="" className="w-8 h-8 object-cover border border-gray-300" />
                          <span className="truncate max-w-[220px]">{p.title}</span>
                        </td>
                        <td className="p-2 font-mono text-gray-600">{p.sku}</td>
                        <td className="p-2 font-bold text-gray-900">${p.price.toLocaleString('es-CL')}</td>
                        <td className="p-2 font-mono font-bold text-blue-900 text-sm">
                          {localStock} un.
                        </td>
                        <td className="p-2">
                          {localStock > 0 ? (
                            <span className="text-green-800 font-bold text-[10px] bg-green-100 border border-green-400 px-1.5 py-0.5 rounded-xs">
                              DISPONIBLE
                            </span>
                          ) : (
                            <span className="text-red-800 font-bold text-[10px] bg-red-100 border border-red-400 px-1.5 py-0.5 rounded-xs">
                              AGOTADO
                            </span>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateStock(p.id, localStock - 1)}
                              className="winxp-button text-xs w-6 h-6 p-0 font-bold"
                              title="Restar unidad"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStock(p.id, localStock + 1)}
                              className="winxp-button text-xs w-6 h-6 p-0 font-bold"
                              title="Sumar unidad"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
