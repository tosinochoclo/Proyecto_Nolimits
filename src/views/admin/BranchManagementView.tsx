import React, { useState } from 'react';
import { Store, Plus, Users, Shield, MapPin, CheckCircle2 } from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelButton } from '../../components/common/PixelButton';
import { INITIAL_BRANCHES } from '../../services/mockData';
import { Branch } from '../../types';

export const BranchManagementView: React.FC = () => {
  const [branchesList, setBranchesList] = useState<Branch[]>(INITIAL_BRANCHES);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCity, setNewStoreCity] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [newStoreManager, setNewStoreManager] = useState('');

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newStoreCity) return;

    const newBranch: Branch = {
      id: `branch_${Date.now()}`,
      name: `Sucursal ${newStoreCity} - ${newStoreName}`,
      code: `${newStoreCity.slice(0, 4).toUpperCase()}-0${branchesList.length + 1}`,
      city: newStoreCity,
      address: newStoreAddress || 'Dirección por definir',
      phone: '+56 9 8000 0000',
      managerName: newStoreManager || 'Por Asignar',
      isActive: true,
      colorTag: '#00d4ff'
    };

    setBranchesList([...branchesList, newBranch]);
    setNewStoreName('');
    setNewStoreCity('');
    setNewStoreAddress('');
    setNewStoreManager('');
  };

  return (
    <div className="space-y-6">
      <WindowFrame
        title="BRANCH_MANAGER.SYS - [Gestión Global de Sucursales]"
        variant="lavender"
        statusBarText="SUPER ADMIN PRIVILEGES // CLUSTER NODE EXPANSION"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#302148]">
            <div>
              <h2 className="font-['Silkscreen'] text-base text-white">
                APERTURA Y ADMINISTRACIÓN DE SUCURSALES FÍSICAS
              </h2>
              <span className="font-['VT323'] text-sm text-[#00d4ff]">
                // ASIGNACIÓN DE JEFES DE TIENDA Y LOGÍSTICA DESCENTRALIZADA
              </span>
            </div>
          </div>

          {/* New Store Creation Form */}
          <form onSubmit={handleCreateBranch} className="bevel-chrome p-4 bg-[#120e20] space-y-3 font-['Chakra_Petch'] text-xs">
            <h3 className="font-['Silkscreen'] text-xs text-white">APERTURA DE NUEVA SUCURSAL</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                required
                placeholder="Nombre de la tienda (ej: Drop Hub Sol)"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                className="bevel-sunken p-2 bg-black text-white focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Ciudad (ej: Quilpué / Viña)"
                value={newStoreCity}
                onChange={(e) => setNewStoreCity(e.target.value)}
                className="bevel-sunken p-2 bg-black text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Dirección Física"
                value={newStoreAddress}
                onChange={(e) => setNewStoreAddress(e.target.value)}
                className="bevel-sunken p-2 bg-black text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Jefe de Sucursal Asignado"
                value={newStoreManager}
                onChange={(e) => setNewStoreManager(e.target.value)}
                className="bevel-sunken p-2 bg-black text-white focus:outline-none"
              />
            </div>
            <PixelButton variant="primary" size="sm" type="submit">
              + Registrar Nueva Tienda
            </PixelButton>
          </form>

          {/* Branches Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {branchesList.map((branch) => (
              <div key={branch.id} className="bevel-chrome p-4 bg-[#0d0a17] space-y-2 font-['Chakra_Petch'] text-xs">
                <div className="flex justify-between items-center border-b border-[#2d2142] pb-1">
                  <span className="font-['Silkscreen'] text-sm text-white">{branch.city}</span>
                  <span className="font-mono text-[#00d4ff] bg-black/60 px-2 py-0.5 border border-[#00d4ff]/40">
                    {branch.code}
                  </span>
                </div>
                <div className="text-slate-300 font-bold">{branch.name}</div>
                <div className="text-slate-400">{branch.address}</div>
                <div className="text-[#ff77b8]">Jefe de Tienda: {branch.managerName}</div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-green-400 font-mono text-[11px]">● ACTIVA EN TIEMPO REAL</span>
                  <PixelButton variant="retro" size="sm">
                    Permisos
                  </PixelButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
