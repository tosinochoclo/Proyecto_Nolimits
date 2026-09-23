import React from 'react';
import { BookOpen, Calendar, Sparkles, MapPin, Tag } from 'lucide-react';
import { WindowFrame } from '../layout/WindowFrame';

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
      variant="lavender"
      showControls={true}
      onClose={onClose}
      statusBarText="DOC SIZE: 4.8 KB // AUTORES: COLECTIVO NOLIMITS // ARCHIVO PRIVADO"
      className={`max-w-lg ${className}`}
    >
      <div className="space-y-4 font-['Chakra_Petch'] text-xs text-slate-200">
        <div className="bevel-sunken p-2.5 bg-black/60 border-l-2 border-l-[#ff007f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#ff007f]" />
            <span className="font-['Silkscreen'] text-[11px] text-white">
              BITÁCORA DE CONFECCIÓN & DROPS
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#00d4ff]">V2.0_PUBLIC_LOG</span>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {diaryEntries.map((entry, idx) => (
            <div key={idx} className="bevel-chrome p-3 bg-[#0d0918] space-y-1.5">
              <div className="flex items-center justify-between border-b border-[#281a3d] pb-1">
                <span className="font-['Silkscreen'] text-[10px] text-[#ff77b8] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#ff007f]" />
                  {entry.date}
                </span>
                <span className="font-['VT323'] text-xs text-[#00d4ff] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {entry.location}
                </span>
              </div>

              <h4 className="font-bold text-white text-xs">{entry.title}</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">{entry.body}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {entry.tags.map((t, i) => (
                  <span
                    key={i}
                    className="font-mono text-[9px] bg-black px-1.5 py-0.5 text-[#a855f7] border border-[#a855f7]/30"
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
