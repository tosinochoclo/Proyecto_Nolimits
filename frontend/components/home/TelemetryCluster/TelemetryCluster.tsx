import React from 'react';
import { WindowFrame } from '../../layout/WindowFrame';
import { Branch } from '../../../types';
import { PixelIcon } from '../../common/PixelIcon';
import './TelemetryCluster.css';

interface TelemetryClusterProps {
  branches: Branch[];
}

/**
 * TelemetryCluster: Panel de sucursales físicas estilo Conexiones de Red de Windows XP.
 * Muestra el estado en vivo de los nodos de Viña del Mar, Valparaíso y Quilpué.
 */
export const TelemetryCluster: React.FC<TelemetryClusterProps> = ({ branches }) => {
  return (
    <WindowFrame
      title="Conexiones_de_Red.cpl - [Nodos de Retiro Físico]"
      subtitle="Protocolo TCP/IP Red Local Central"
      icon={<PixelIcon name="network" size={16} />}
      statusBarText="3 NODOS ACTIVOS // LATENCIA: 12ms // RETIRO INMEDIATO HABILITADO"
    >
      <div className="telemetry-xp-grid">
        {branches.map((b) => (
          <div key={b.id} className="telemetry-xp-card">
            <div className="telemetry-xp-header">
              <span className="telemetry-xp-city">{b.city}</span>
              <span className="telemetry-xp-status">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                CONECTADO
              </span>
            </div>

            <div className="text-xs font-bold text-gray-900 truncate">
              {b.name}
            </div>

            <div className="text-[11px] text-gray-600 truncate">
              📍 {b.address}
            </div>

            <div className="bg-[#f0f4f8] border border-[#cbd5e1] p-1.5 flex items-center justify-between text-[11px] mt-1">
              <span className="text-gray-700">Jefe: {b.managerName}</span>
              <span className="text-blue-700 font-bold">Retiro Listo</span>
            </div>
          </div>
        ))}
      </div>
    </WindowFrame>
  );
};
