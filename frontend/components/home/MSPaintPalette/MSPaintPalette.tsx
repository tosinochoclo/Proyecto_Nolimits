import React, { useState } from 'react';
import { PixelIcon } from '../../common/PixelIcon';
import './MSPaintPalette.css';

interface MSPaintPaletteProps {
  onClose?: () => void;
  className?: string;
}

const PAINT_COLORS = [
  '#000000', '#787878', '#790300', '#757a01', '#007902', '#007778', '#010078', '#7b0077',
  '#767a38', '#003e3e', '#0f78ff', '#003e7e', '#3c00ff', '#783c00', '#ffffff', '#b8b8b8',
  '#ff0018', '#ffff00', '#00ff24', '#00ffff', '#0024ff', '#ff00ff', '#ffff78', '#00ff78',
  '#79ffff', '#7976ff', '#ff0078', '#ff783c'
];

/**
 * MSPaintPalette: Herramienta decorativa e interactiva inspirada en MS Paint
 * de Windows 95 y Windows XP, con caja de herramientas y selector de 28 colores.
 */
export const MSPaintPalette: React.FC<MSPaintPaletteProps> = ({ onClose, className = '' }) => {
  const [selectedTool, setSelectedTool] = useState<string>('brush');
  const [activeColor, setActiveColor] = useState<string>('#ff0018');

  const tools = [
    { id: 'select-free', label: 'Selección libre', icon: '✂' },
    { id: 'select-rect', label: 'Selección rectangular', icon: '⬚' },
    { id: 'eraser', label: 'Borrador', icon: '⌫' },
    { id: 'bucket', label: 'Relleno con color', icon: '🪣' },
    { id: 'dropper', label: 'Selector de color', icon: '💉' },
    { id: 'magnifier', label: 'Lupa de zoom', icon: '🔍' },
    { id: 'pencil', label: 'Lápiz fino', icon: '✏' },
    { id: 'brush', label: 'Pincel', icon: '🖌' },
    { id: 'airbrush', label: 'Aerógrafo', icon: '💨' },
    { id: 'text', label: 'Texto', icon: 'A' },
    { id: 'line', label: 'Línea', icon: '╱' },
    { id: 'curve', label: 'Curva', icon: '∿' },
    { id: 'rect', label: 'Rectángulo', icon: '▭' },
    { id: 'polygon', label: 'Polígono', icon: '⬟' },
    { id: 'ellipse', label: 'Elipse', icon: '⬭' },
    { id: 'roundrect', label: 'Rectángulo redondeado', icon: '▢' },
  ];

  return (
    <div className={`mspaint-box ${className}`}>
      {/* Barra de título Paint */}
      <div className="mspaint-titlebar">
        <div className="flex items-center gap-1.5">
          <PixelIcon name="paint" size={14} />
          <span className="font-bold">Paint Tools - [Sin título.bmp]</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-4 bg-[#ece9d8] text-black border border-gray-600 flex items-center justify-center text-[10px] leading-none"
            title="Cerrar paleta"
          >
            ×
          </button>
        )}
      </div>

      {/* Grid de herramientas 2 columnas */}
      <div className="p-2 bg-[#ece9d8]">
        <div className="grid grid-cols-2 gap-1 w-20 mx-auto">
          {tools.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTool(t.id)}
              className={`w-9 h-7 text-xs flex items-center justify-center font-bold transition-all ${
                selectedTool === t.id
                  ? 'winxp-bevel-in bg-white text-blue-700'
                  : 'winxp-bevel-out bg-[#ece9d8] text-gray-800 hover:bg-gray-100'
              }`}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>

        {/* Muestra del color actual y paleta de 28 colores */}
        <div className="mt-2 pt-2 border-t border-gray-400">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[10px] text-gray-700">Color actual:</span>
            <div
              className="w-5 h-5 winxp-bevel-in border border-gray-800"
              style={{ backgroundColor: activeColor }}
              title={`Color activo: ${activeColor}`}
            />
          </div>

          <div className="grid grid-cols-7 gap-1">
            {PAINT_COLORS.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveColor(c)}
                className={`w-3.5 h-3.5 border transition-transform ${
                  activeColor === c ? 'border-black scale-110 shadow-sm' : 'border-gray-500'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
