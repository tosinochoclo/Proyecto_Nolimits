import React from 'react';
import './MasterStatusBar.css';

/**
 * Componente: MasterStatusBar
 * 
 * Propósito:
 * Barra de estado del sistema Cyber-Gothic OS. Muestra la telemetría del protocolo,
 * ping de red y el estado del gateway de pagos chilenos (Webpay/Redcompra).
 * 
 * Buenas prácticas:
 * - Estilos segregados en MasterStatusBar.css
 * - Componente puro y optimizado
 */
export const MasterStatusBar: React.FC = React.memo(() => {
  return (
    <div className="master-status-bar bevel-sunken">
      <div className="master-status-left">
        <span className="master-status-ping-dot" />
        <span>NOLIMITS APPAREL CORE // PROTOCOLO TCP/IP DESCENTRALIZADO // CHILE</span>
      </div>
      <div className="master-status-right">
        <span>TIEMPO DE RESPUESTA: 14ms</span>
        <span>WEBPAY / REDCOMPRA / TRANSBANK OK</span>
      </div>
    </div>
  );
});

MasterStatusBar.displayName = 'MasterStatusBar';
