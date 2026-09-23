import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, Store, MapPin, CheckCircle2, Clock, Truck, Shield } from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelButton } from '../../components/common/PixelButton';
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
    <div className="space-y-6">
      <WindowFrame
        title={`BRANCH_NODE.SYS - [${branch.name}]`}
        variant="lavender"
        statusBarText={`JEFE DE TIENDA: ${branch.managerName} // STOCK FÍSICO AUDITABLE`}
      >
        <div className="space-y-4 font-['Chakra_Petch'] text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#302148] pb-3">
            <div>
              <div className="flex items-center gap-1.5 font-['Silkscreen'] text-sm text-white">
                <MapPin className="w-4 h-4 text-[#ff007f]" />
                <span>ADMINISTRACIÓN LOCAL DE SUCURSAL: {branch.city.toUpperCase()}</span>
              </div>
              <span className="text-slate-400 font-['VT323'] text-sm">
                {branch.address} • Teléfono: {branch.phone}
              </span>
            </div>

            <span className="font-['Silkscreen'] text-xs bg-green-950 text-green-400 border border-green-600 px-3 py-1">
              SUCURSAL ACTIVA EN STREAMING
            </span>
          </div>

          {/* Local Inventory Management Table */}
          <div className="space-y-2">
            <h3 className="font-['Silkscreen'] text-xs text-white">INVENTARIO FÍSICO DE ESTA TIENDA</h3>
            <div className="bevel-sunken overflow-x-auto">
              <table className="w-full text-left font-['Chakra_Petch'] text-xs">
                <thead className="bg-[#171128] font-['Silkscreen'] text-[10px] text-slate-300 border-b border-[#30214a]">
                  <tr>
                    <th className="p-2.5">PRENDA</th>
                    <th className="p-2.5">SKU</th>
                    <th className="p-2.5">PRECIO</th>
                    <th className="p-2.5">STOCK EN TIENDA</th>
                    <th className="p-2.5">ESTADO</th>
                    <th className="p-2.5">AJUSTAR EN VIVO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#221736]">
                  {products.map((p) => {
                    const localStock = p.stockPerBranch[branch.id] ?? 0;
                    return (
                      <tr key={p.id} className="hover:bg-[#120c22]">
                        <td className="p-2.5 font-bold text-white flex items-center gap-2">
                          <img src={p.images[0]} alt="" className="w-8 h-8 object-cover bevel-raised" />
                          <span className="truncate max-w-[180px]">{p.title}</span>
                        </td>
                        <td className="p-2.5 font-mono text-slate-400">{p.sku}</td>
                        <td className="p-2.5 font-mono text-white">${p.price.toLocaleString('es-CL')}</td>
                        <td className="p-2.5 font-mono font-bold text-[#00d4ff] text-sm">
                          {localStock} un.
                        </td>
                        <td className="p-2.5">
                          {localStock > 0 ? (
                            <span className="text-green-400 text-[10px] font-['Silkscreen']">DISPONIBLE</span>
                          ) : (
                            <span className="text-red-400 text-[10px] font-['Silkscreen']">AGOTADO</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1 font-['Silkscreen'] text-xs">
                            <button
                              onClick={() => handleUpdateStock(p.id, localStock - 1)}
                              className="win-btn w-6 h-6"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleUpdateStock(p.id, localStock + 1)}
                              className="win-btn w-6 h-6"
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
