import React from 'react';

interface PixelHeartProps {
  filled?: boolean;
  size?: number;
  className?: string;
  showSparkles?: boolean;
}

/**
 * PixelHeart: Icono de corazón pixel art auténtico y de alta definición,
 * diseñado fielmente a las imágenes de referencia clásicas de Windows XP / 16-bit retro.
 * 
 * Grilla simétrica 17x16 con contorno negro nítido (crispEdges),
 * destello blanco especular diagonal en el lóbulo superior izquierdo (filas 3-5),
 * cuerpo rojo escarlata vibrante (#e60014 / #ff1128) y bisel de sombra 3D (#990000 / #730000)
 * en el borde inferior derecho.
 */
export const PixelHeart: React.FC<PixelHeartProps> = ({
  filled = false,
  size = 18,
  className = '',
  showSparkles = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 16"
      fill="none"
      style={{ shapeRendering: 'crispEdges' }}
      className={`shrink-0 inline-block select-none overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Destellos de brillo radiante opcionales (Estilo Imagen 2 de referencia) */}
      {showSparkles && (
        <g opacity="0.9">
          {/* Rayo vertical superior */}
          <rect x="8" y="-3" width="1" height="2" fill="#ff4d6d" />
          {/* Rayo vertical inferior */}
          <rect x="8" y="15" width="1" height="2" fill="#ff4d6d" />
          {/* Rayo horizontal izquierdo */}
          <rect x="-3" y="7" width="2" height="1" fill="#ff4d6d" />
          {/* Rayo horizontal derecho */}
          <rect x="18" y="7" width="2" height="1" fill="#ff4d6d" />
          {/* Rayos diagonales en las 4 esquinas */}
          <rect x="0" y="0" width="1" height="1" fill="#ff758f" />
          <rect x="1" y="1" width="1" height="1" fill="#ff758f" />
          <rect x="16" y="0" width="1" height="1" fill="#ff758f" />
          <rect x="15" y="1" width="1" height="1" fill="#ff758f" />
          <rect x="0" y="14" width="1" height="1" fill="#ff758f" />
          <rect x="1" y="13" width="1" height="1" fill="#ff758f" />
          <rect x="16" y="14" width="1" height="1" fill="#ff758f" />
          <rect x="15" y="13" width="1" height="1" fill="#ff758f" />
        </g>
      )}

      {filled ? (
        // =====================================================================
        // CORAZÓN PIXEL ART ACTIVO (FILLED - IDÉNTICO A IMAGEN 1 Y 3)
        // =====================================================================
        <g>
          {/* -----------------------------------------------------------------
             1. SILUETA EXTERIOR NEGRA PIXEL ART (17x16 Sellada y 100% Simétrica)
             ----------------------------------------------------------------- */}
          {/* Fila 2: Cúpula superior plana de 4 píxeles en cada lóbulo */}
          <rect x="3" y="2" width="4" height="1" fill="#000000" />
          <rect x="10" y="2" width="4" height="1" fill="#000000" />

          {/* Fila 3: Hombros externos y entrada al escote V */}
          <rect x="2" y="3" width="1" height="1" fill="#000000" />
          <rect x="7" y="3" width="1" height="1" fill="#000000" />
          <rect x="9" y="3" width="1" height="1" fill="#000000" />
          <rect x="14" y="3" width="1" height="1" fill="#000000" />

          {/* Fila 4: Flancos laterales y punta del escote V central */}
          <rect x="1" y="4" width="1" height="1" fill="#000000" />
          <rect x="8" y="4" width="1" height="1" fill="#000000" />
          <rect x="15" y="4" width="1" height="1" fill="#000000" />

          {/* Fila 5: Laterales verticales */}
          <rect x="1" y="5" width="1" height="1" fill="#000000" />
          <rect x="15" y="5" width="1" height="1" fill="#000000" />

          {/* Fila 6: Laterales verticales */}
          <rect x="1" y="6" width="1" height="1" fill="#000000" />
          <rect x="15" y="6" width="1" height="1" fill="#000000" />

          {/* Fila 7: Diagonales descendentes (paso 1) */}
          <rect x="2" y="7" width="1" height="1" fill="#000000" />
          <rect x="14" y="7" width="1" height="1" fill="#000000" />

          {/* Fila 8: Diagonales descendentes (paso 2) */}
          <rect x="3" y="8" width="1" height="1" fill="#000000" />
          <rect x="13" y="8" width="1" height="1" fill="#000000" />

          {/* Fila 9: Diagonales descendentes (paso 3) */}
          <rect x="4" y="9" width="1" height="1" fill="#000000" />
          <rect x="12" y="9" width="1" height="1" fill="#000000" />

          {/* Fila 10: Diagonales descendentes (paso 4) */}
          <rect x="5" y="10" width="1" height="1" fill="#000000" />
          <rect x="11" y="10" width="1" height="1" fill="#000000" />

          {/* Fila 11: Diagonales descendentes (paso 5) */}
          <rect x="6" y="11" width="1" height="1" fill="#000000" />
          <rect x="10" y="11" width="1" height="1" fill="#000000" />

          {/* Fila 12: Diagonales descendentes (paso 6) */}
          <rect x="7" y="12" width="1" height="1" fill="#000000" />
          <rect x="9" y="12" width="1" height="1" fill="#000000" />

          {/* Fila 13: Punta inferior central única */}
          <rect x="8" y="13" width="1" height="1" fill="#000000" />

          {/* -----------------------------------------------------------------
             2. CUERPO ROJO ESCARLATA VIBRANTE RETRO XP (#e60014 / #ff1128)
             ----------------------------------------------------------------- */}
          {/* Fila 3 */}
          <rect x="3" y="3" width="1" height="1" fill="#e60014" />
          <rect x="6" y="3" width="1" height="1" fill="#e60014" />
          <rect x="10" y="3" width="3" height="1" fill="#e60014" />

          {/* Fila 4 */}
          <rect x="2" y="4" width="1" height="1" fill="#e60014" />
          <rect x="6" y="4" width="2" height="1" fill="#e60014" />
          <rect x="9" y="4" width="4" height="1" fill="#e60014" />

          {/* Fila 5 */}
          <rect x="2" y="5" width="1" height="1" fill="#e60014" />
          <rect x="5" y="5" width="9" height="1" fill="#e60014" />

          {/* Fila 6 */}
          <rect x="2" y="6" width="11" height="1" fill="#e60014" />

          {/* Fila 7 */}
          <rect x="3" y="7" width="9" height="1" fill="#e60014" />

          {/* Fila 8 */}
          <rect x="4" y="8" width="7" height="1" fill="#e60014" />

          {/* Fila 9 */}
          <rect x="5" y="9" width="5" height="1" fill="#e60014" />

          {/* Fila 10 */}
          <rect x="6" y="10" width="3" height="1" fill="#e60014" />

          {/* Fila 11 */}
          <rect x="7" y="11" width="1" height="1" fill="#e60014" />

          {/* -----------------------------------------------------------------
             3. DESTELLO BLANCO ESPECULAR RETRO (Exacto como Imagen 1 de Referencia)
             ----------------------------------------------------------------- */}
          {/* Fila 3: 2 píxeles blancos */}
          <rect x="4" y="3" width="2" height="1" fill="#ffffff" />
          {/* Fila 4: 3 píxeles blancos en diagonal */}
          <rect x="3" y="4" width="3" height="1" fill="#ffffff" />
          {/* Fila 5: 2 píxeles blancos en base */}
          <rect x="3" y="5" width="2" height="1" fill="#ffffff" />

          {/* -----------------------------------------------------------------
             4. RELIEVE 3D / SOMBRA BURDEO PROFUNDO (#990000 / #730000)
             ----------------------------------------------------------------- */}
          {/* Fila 3: Sombra borde derecho */}
          <rect x="13" y="3" width="1" height="1" fill="#990000" />
          {/* Fila 4: Sombra borde derecho */}
          <rect x="13" y="4" width="2" height="1" fill="#990000" />
          {/* Fila 5: Sombra borde derecho */}
          <rect x="14" y="5" width="1" height="1" fill="#990000" />
          {/* Fila 6: Sombra borde derecho */}
          <rect x="13" y="6" width="2" height="1" fill="#990000" />
          {/* Fila 7: Sombra diagonal derecha */}
          <rect x="12" y="7" width="2" height="1" fill="#990000" />
          {/* Fila 8: Sombra diagonal derecha */}
          <rect x="11" y="8" width="2" height="1" fill="#990000" />
          {/* Fila 9: Sombra diagonal derecha */}
          <rect x="10" y="9" width="2" height="1" fill="#990000" />
          {/* Fila 10: Sombra diagonal derecha */}
          <rect x="9" y="10" width="2" height="1" fill="#990000" />
          {/* Fila 11: Sombra diagonal derecha */}
          <rect x="8" y="11" width="2" height="1" fill="#990000" />
          {/* Fila 12: Sombra sobre la punta */}
          <rect x="8" y="12" width="1" height="1" fill="#730000" />
        </g>
      ) : (
        // =====================================================================
        // CORAZÓN PIXEL ART INACTIVO (HOLLOW / SIN MARCAR)
        // Estilo pixel art Windows XP con contorno negro nítido, interior blanco y bisel 3D
        // =====================================================================
        <g>
          {/* -----------------------------------------------------------------
             1. SILUETA EXTERIOR NEGRA PIXEL ART
             ----------------------------------------------------------------- */}
          {/* Fila 2 */}
          <rect x="3" y="2" width="4" height="1" fill="#000000" />
          <rect x="10" y="2" width="4" height="1" fill="#000000" />
          {/* Fila 3 */}
          <rect x="2" y="3" width="1" height="1" fill="#000000" />
          <rect x="7" y="3" width="1" height="1" fill="#000000" />
          <rect x="9" y="3" width="1" height="1" fill="#000000" />
          <rect x="14" y="3" width="1" height="1" fill="#000000" />
          {/* Fila 4 */}
          <rect x="1" y="4" width="1" height="1" fill="#000000" />
          <rect x="8" y="4" width="1" height="1" fill="#000000" />
          <rect x="15" y="4" width="1" height="1" fill="#000000" />
          {/* Fila 5 */}
          <rect x="1" y="5" width="1" height="1" fill="#000000" />
          <rect x="15" y="5" width="1" height="1" fill="#000000" />
          {/* Fila 6 */}
          <rect x="1" y="6" width="1" height="1" fill="#000000" />
          <rect x="15" y="6" width="1" height="1" fill="#000000" />
          {/* Fila 7 */}
          <rect x="2" y="7" width="1" height="1" fill="#000000" />
          <rect x="14" y="7" width="1" height="1" fill="#000000" />
          {/* Fila 8 */}
          <rect x="3" y="8" width="1" height="1" fill="#000000" />
          <rect x="13" y="8" width="1" height="1" fill="#000000" />
          {/* Fila 9 */}
          <rect x="4" y="9" width="1" height="1" fill="#000000" />
          <rect x="12" y="9" width="1" height="1" fill="#000000" />
          {/* Fila 10 */}
          <rect x="5" y="10" width="1" height="1" fill="#000000" />
          <rect x="11" y="10" width="1" height="1" fill="#000000" />
          {/* Fila 11 */}
          <rect x="6" y="11" width="1" height="1" fill="#000000" />
          <rect x="10" y="11" width="1" height="1" fill="#000000" />
          {/* Fila 12 */}
          <rect x="7" y="12" width="1" height="1" fill="#000000" />
          <rect x="9" y="12" width="1" height="1" fill="#000000" />
          {/* Fila 13 */}
          <rect x="8" y="13" width="1" height="1" fill="#000000" />

          {/* -----------------------------------------------------------------
             2. RELLENO INTERIOR BLANCO PURO (#ffffff)
             ----------------------------------------------------------------- */}
          {/* Fila 3 */}
          <rect x="3" y="3" width="4" height="1" fill="#ffffff" />
          <rect x="10" y="3" width="3" height="1" fill="#ffffff" />
          {/* Fila 4 */}
          <rect x="2" y="4" width="6" height="1" fill="#ffffff" />
          <rect x="9" y="4" width="4" height="1" fill="#ffffff" />
          {/* Fila 5 */}
          <rect x="2" y="5" width="12" height="1" fill="#ffffff" />
          {/* Fila 6 */}
          <rect x="2" y="6" width="11" height="1" fill="#ffffff" />
          {/* Fila 7 */}
          <rect x="3" y="7" width="9" height="1" fill="#ffffff" />
          {/* Fila 8 */}
          <rect x="4" y="8" width="7" height="1" fill="#ffffff" />
          {/* Fila 9 */}
          <rect x="5" y="9" width="5" height="1" fill="#ffffff" />
          {/* Fila 10 */}
          <rect x="6" y="10" width="3" height="1" fill="#ffffff" />
          {/* Fila 11 */}
          <rect x="7" y="11" width="1" height="1" fill="#ffffff" />

          {/* -----------------------------------------------------------------
             3. RELIEVE DE SOMBRA BISELADA RETRO (#cbd5e1 y #94a3b8)
             ----------------------------------------------------------------- */}
          <rect x="13" y="3" width="1" height="1" fill="#cbd5e1" />
          <rect x="13" y="4" width="2" height="1" fill="#cbd5e1" />
          <rect x="14" y="5" width="1" height="1" fill="#cbd5e1" />
          <rect x="13" y="6" width="2" height="1" fill="#cbd5e1" />
          <rect x="12" y="7" width="2" height="1" fill="#cbd5e1" />
          <rect x="11" y="8" width="2" height="1" fill="#cbd5e1" />
          <rect x="10" y="9" width="2" height="1" fill="#cbd5e1" />
          <rect x="9" y="10" width="2" height="1" fill="#cbd5e1" />
          <rect x="8" y="11" width="2" height="1" fill="#cbd5e1" />
          <rect x="8" y="12" width="1" height="1" fill="#94a3b8" />
        </g>
      )}
    </svg>
  );
};
