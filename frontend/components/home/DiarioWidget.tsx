import React from 'react';
import { BookOpen, Calendar, MapPin, Tag } from 'lucide-react';
import { WindowFrame } from '../layout/WindowFrame';
import { PixelIcon } from '../common/PixelIcon';

interface DiarioWidgetProps {
  onClose?: () => void;
  className?: string;
}

export const DiarioWidget: React.FC<DiarioWidgetProps> = ({
  onClose,
  className = ''
}) => {
  const diaryEntries = [
    {
      date: '22 SEPTIEMBRE 2026',
      title: 'DROP #04: CÁPSULA CYBER-GOTHIC SUB-ZERO',
      location: 'Taller Valparaíso - Cerro Alegre',
      body: 'Liberamos 24 unidades exclusivas intervenidas con cierres dobles metálicos y parches reflectantes Y2K. Cada pieza fue lavada con técnica de ácido artesanal para un desgaste único.',
      tags: ['Edición Limitada', 'Confección Local', 'Stock 1:1']
    },
    {
      date: '18 SEPTIEMBRE 2026',
      title: 'SINCRONIZACIÓN DE NODO: VIÑA DEL MAR',
      location: 'Sucursal Viña del Mar - Calle Valparaíso 520',
      body: 'Habilitamos el probador interactivo y terminal de retiro inmediato en menos de 5 minutos tras el checkout web. Se despacharon 48 pedidos vía Starken y Blue Express sin intermediarios.',
      tags: ['Logística', 'Retiro en Tienda']
    },
    {
      date: '12 SEPTIEMBRE 2026',
      title: 'MANIFIESTO: POR QUÉ NO HACEMOS FILAS MANUALES',
      location: 'Central Quilpué - Hub Tecnológico',
      body: 'El modelo tradicional de "pide por DM y espera confirmación" está muerto. Creamos Nolimits OS para que tu stock quede reservado inmediatamente con Webpay o comprobante OCR.',
      tags: ['Manifiesto', 'Zero Bullshit']
    }
  ];

  return (
    <WindowFrame
      title="DIARIO_DE_LANZAMIENTOS.TXT - [Bitácora de Diseño]"
      icon={<PixelIcon name="notepad" size={16} />}
      showControls={true}
      onClose={onClose}
      statusBarText="DOC SIZE: 4.8 KB // AUTORES: COLECTIVO NOLIMITS // ARCHIVO PRIVADO"
      className={`max-w-lg ${className}`}
    >
      <div className="space-y-3 font-sans text-xs text-gray-900">
        <div className="bg-[#f0f4f8] border border-gray-300 p-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PixelIcon name="notepad" size={15} />
            <span className="font-bold text-xs text-[#003c74]">
              BITÁCORA DE CONFECCIÓN & DROPS
            </span>
          </div>
          <span className="font-mono text-[11px] text-gray-500">v2.0_PUBLIC_LOG</span>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {diaryEntries.map((entry, idx) => (
            <div key={idx} className="bg-white border border-[#7f9db9] p-3 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-200 pb-1 text-[11px]">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-700" />
                  {entry.date}
                </span>
                <span className="text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {entry.location}
                </span>
              </div>

              <h4 className="font-bold text-gray-900 text-xs">{entry.title}</h4>
              <p className="text-gray-700 text-[11px] leading-relaxed">{entry.body}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {entry.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 border border-gray-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
};
