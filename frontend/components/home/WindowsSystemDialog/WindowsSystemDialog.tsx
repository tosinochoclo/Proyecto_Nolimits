import React, { useState } from 'react';
import { PixelIcon } from '../../common/PixelIcon';

interface WindowsSystemDialogProps {
  title?: string;
  message?: string;
  iconType?: 'error' | 'warning' | 'info';
  onOk?: () => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

/**
 * WindowsSystemDialog: Cuadro de diálogo auténtico estilo Windows XP / Windows 95
 * Emula los mensajes de error y advertencias clásicos de los años 2000.
 */
export const WindowsSystemDialog: React.FC<WindowsSystemDialogProps> = ({
  title = 'System Message - Nolimits.exe',
  message = 'La sesión de compra está sincronizada con las sucursales de Viña, Valparaíso y Quilpué. ¿Desea continuar navegando?',
  iconType = 'info',
  onOk,
  onCancel,
  isOpen = true
}) => {
  const [visible, setVisible] = useState(isOpen);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    if (onCancel) onCancel();
  };

  const handleOk = () => {
    setVisible(false);
    if (onOk) onOk();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[1px] animate-in fade-in duration-150">
      <div className="w-full max-w-sm winxp-window shadow-2xl">
        {/* Titlebar */}
        <div className="winxp-titlebar">
          <div className="winxp-titlebar-title">
            <PixelIcon name={iconType} size={15} />
            <span className="truncate">{title}</span>
          </div>
          <div className="winxp-controls">
            <button
              type="button"
              onClick={handleClose}
              className="winxp-btn-ctrl winxp-btn-close"
              title="Cerrar mensaje"
            >
              ×
            </button>
          </div>
        </div>

        {/* Dialog Body */}
        <div className="p-4 bg-[#ece9d8] space-y-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <PixelIcon name={iconType} size={32} />
            </div>
            <div className="text-[12px] text-black leading-relaxed font-sans select-text">
              {message}
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-400">
            <button
              type="button"
              onClick={handleOk}
              className="winxp-button min-w-[70px] font-semibold winxp-button-primary focus:outline-dotted focus:outline-1"
              autoFocus
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="winxp-button min-w-[70px]"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
