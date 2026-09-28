import React from 'react';
import { PixelIcon } from '../../common/PixelIcon';
import './MasterStatusBar.css';

/**
 * MasterStatusBar: Barra de estado estilo Windows XP.
 * Muestra el estado del protocolo de inventario y la pasarela de pagos Webpay.
 */
export const MasterStatusBar: React.FC = React.memo(() => {
  return (
    <div className="master-status-xp-bar winxp-statusbar">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-semibold text-gray-800">
          NOLIMITS APPAREL CORE // PROTOCOLO TCP/IP DESCENTRALIZADO // CHILE
        </span>
      </div>

      <div className="flex items-center gap-3 text-gray-700">
        <div className="master-status-xp-pane flex items-center gap-1.5">
          <PixelIcon name="computer" size={13} />
          <span>Ping: 12ms</span>
        </div>
        <div className="master-status-xp-pane flex items-center gap-1.5 text-blue-900 font-bold">
          <span>Webpay Plus / Redcompra Transbank OK</span>
        </div>
      </div>
    </div>
  );
});

MasterStatusBar.displayName = 'MasterStatusBar';
