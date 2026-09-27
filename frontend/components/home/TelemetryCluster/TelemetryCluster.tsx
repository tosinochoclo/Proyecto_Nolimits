import React from 'react';
import { WindowFrame } from '../../layout/WindowFrame';
import { Branch } from '../../../types';
import './TelemetryCluster.css';

interface TelemetryClusterProps {
  /** Lista de sucursales con información de stock y telemetría */
  branches: Branch[];
}

/**
 * Componente: TelemetryCluster
 * 
 * Propósito:
 * Muestra el estado operativo de los nodos físicos (Viña, Valparaíso, Quilpué)
 * permitiendo al comprador ver qué sucursales están en línea para retiro inmediato.
 * 
 * Buenas prácticas:
 * - Estilos segregados en TelemetryCluster.css
 * - Tipado TypeScript estricto con la interfaz Branch
 */
export const TelemetryCluster: React.FC<TelemetryClusterProps> = ({ branches }) => {
  return (
    <div className="telemetry-cluster-container">
      <WindowFrame
        title="CLUSTER_TELEMETRY.SYS - [Red de Inventario Físico]"
        variant="chrome"
        statusBarText="SOCKET: ACTIVE // SYNC LATENCY: 14MS // INTEGRIDAD: 100%"
      >
        <div className="telemetry-grid">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="telemetry-branch-card bevel-chrome"
              style={{ borderTopColor: branch.colorTag }}
            >
              <div className="telemetry-branch-header">
                <span className="telemetry-city-title">{branch.city}</span>
                <span className="telemetry-status-indicator">
                  <span className="telemetry-status-dot" />
                  ONLINE
                </span>
              </div>

              <div className="telemetry-branch-name" title={branch.name}>
                {branch.name}
              </div>

              <div className="telemetry-branch-address" title={branch.address}>
                {branch.address}
              </div>

              <div className="telemetry-manager-bar bevel-sunken">
                <span>Jefe: {branch.managerName}</span>
                <span className="telemetry-pickup-tag">RETIRO INMEDIATO</span>
              </div>
            </div>
          ))}
        </div>
      </WindowFrame>
    </div>
  );
};
