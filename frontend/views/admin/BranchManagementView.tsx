import React, { useState } from 'react';
import { Store, Plus, Users, Shield, MapPin, CheckCircle2 } from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
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
      colorTag: '#0055ea'
    };

    setBranchesList([...branchesList, newBranch]);
    setNewStoreName('');
    setNewStoreCity('');
    setNewStoreAddress('');
    setNewStoreManager('');
  };

  return (
    <div className="space-y-4 font-sans text-gray-900">
      <WindowFrame
        title="BRANCH_MANAGER.SYS - [Gestión Global de Sucursales]"
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText="SUPER ADMIN PRIVILEGES // CLUSTER NODE EXPANSION // PROTOCOLO TCP/IP CHILE"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-300">
            <div>
              <h2 className="text-sm font-bold text-[#003c74]">
                APERTURA Y ADMINISTRACIÓN DE SUCURSALES FÍSICAS
              </h2>
              <span className="text-xs text-blue-700 font-semibold">
                // Asignación de jefes de tienda y logística descentralizada
              </span>
            </div>
          </div>

          {/* Formulario de Apertura de Nueva Sucursal */}
          <form onSubmit={handleCreateBranch} className="bg-[#ece9d8] border border-gray-400 p-3.5 space-y-3 text-xs">
            <h3 className="font-bold text-xs text-[#003c74] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-700" />
              <span>APERTURA DE NUEVA SUCURSAL FÍSICA</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                required
                placeholder="Nombre tienda (ej: Drop Hub)"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                className="winxp-input text-xs py-1"
              />
              <input
                type="text"
                required
                placeholder="Ciudad (ej: Quillota / Viña)"
                value={newStoreCity}
                onChange={(e) => setNewStoreCity(e.target.value)}
                className="winxp-input text-xs py-1"
              />
              <input
                type="text"
                placeholder="Dirección Física"
                value={newStoreAddress}
                onChange={(e) => setNewStoreAddress(e.target.value)}
                className="winxp-input text-xs py-1"
              />
              <input
                type="text"
                placeholder="Jefe de Sucursal Asignado"
                value={newStoreManager}
                onChange={(e) => setNewStoreManager(e.target.value)}
                className="winxp-input text-xs py-1"
              />
            </div>
            <div>
              <button
                type="submit"
                className="winxp-button winxp-button-primary text-xs py-1 px-3 text-blue-900 font-bold"
              >
                <Plus className="w-3.5 h-3.5 text-blue-700 inline mr-1" />
                <span>Registrar Nueva Tienda</span>
              </button>
            </div>
          </form>

          {/* Tarjetas de Sucursales Activas (Fondo Blanco Limpio) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {branchesList.map((branch) => (
              <div key={branch.id} className="bg-white border border-[#7f9db9] p-3.5 space-y-2 text-xs shadow-xs">
                <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                  <span className="font-bold text-sm text-blue-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    {branch.city}
                  </span>
                  <span className="font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 border border-gray-300 text-[11px]">
                    {branch.code}
                  </span>
                </div>
                <div className="text-gray-900 font-bold">{branch.name}</div>
                <div className="text-gray-600 text-[11px]">{branch.address}</div>
                <div className="text-blue-900 text-[11px] font-semibold">
                  Jefe de Tienda: {branch.managerName}
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-green-700 font-semibold text-[11px] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    ACTIVA EN TIEMPO REAL
                  </span>
                  <button type="button" className="winxp-button text-xs py-0.5 px-2">
                    Permisos
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
