import React from 'react';

export type PixelIconName =
  | 'cart'
  | 'search'
  | 'computer'
  | 'floppy'
  | 'folder'
  | 'folder-open'
  | 'error'
  | 'warning'
  | 'info'
  | 'notepad'
  | 'paint'
  | 'winamp'
  | 'windows-flag'
  | 'sound'
  | 'network'
  | 'trash'
  | 'cd'
  | 'internet'
  | 'settings'
  | 'key'
  | 'whatsapp'
  | 'phone';

interface PixelIconProps {
  name: PixelIconName;
  size?: number;
  className?: string;
}

/**
 * PixelIcon: Biblioteca de vectores pixelados auténticos inspirados en
 * Microsoft Windows 3.11, Windows 95 y Windows XP.
 * 
 * Implementa shapeRendering='crispEdges' para garantizar que las líneas
 * y píxeles se mantengan perfectamente afilados y sin desenfoques.
 */
export const PixelIcon: React.FC<PixelIconProps> = ({
  name,
  size = 16,
  className = ''
}) => {
  const renderIcon = () => {
    switch (name) {
      /* ===================================================================
         1. CARRITO DE COMPRAS RETRO PIXEL ART (Windows 95 Style)
         =================================================================== */
      case 'cart':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            {/* Ruedas */}
            <rect x="4" y="14" width="2" height="2" fill="#000000" />
            <rect x="11" y="14" width="2" height="2" fill="#000000" />
            <rect x="4" y="14" width="1" height="1" fill="#ffffff" />
            <rect x="11" y="14" width="1" height="1" fill="#ffffff" />
            {/* Chasis base */}
            <rect x="3" y="12" width="11" height="1" fill="#000000" />
            <rect x="3" y="11" width="2" height="1" fill="#707070" />
            {/* Canasta de alambre (rejilla pixel art) */}
            <rect x="2" y="3" width="13" height="1" fill="#000000" />
            <rect x="1" y="2" width="3" height="1" fill="#000000" />
            <rect x="0" y="1" width="2" height="1" fill="#000000" />
            <rect x="3" y="4" width="1" height="7" fill="#000000" />
            <rect x="14" y="4" width="1" height="6" fill="#000000" />
            <rect x="4" y="10" width="10" height="1" fill="#000000" />
            {/* Rejilla interior cromada */}
            <rect x="4" y="4" width="10" height="6" fill="#f0f0f0" />
            <rect x="6" y="5" width="1" height="5" fill="#707070" />
            <rect x="9" y="5" width="1" height="5" fill="#707070" />
            <rect x="12" y="5" width="1" height="5" fill="#707070" />
            <rect x="4" y="7" width="10" height="1" fill="#707070" />
            {/* Prenda / paquete en el carrito (azul/rojo retro) */}
            <rect x="5" y="4" width="4" height="3" fill="#0055ea" />
            <rect x="10" y="5" width="3" height="2" fill="#d84315" />
          </svg>
        );

      /* ===================================================================
         2. LUPA / BUSCADOR RETRO PIXEL ART (Windows 95 Search)
         =================================================================== */
      case 'search':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            {/* Borde exterior del lente */}
            <rect x="3" y="1" width="5" height="1" fill="#000000" />
            <rect x="1" y="3" width="1" height="5" fill="#000000" />
            <rect x="2" y="2" width="1" height="1" fill="#000000" />
            <rect x="8" y="2" width="1" height="1" fill="#000000" />
            <rect x="9" y="3" width="1" height="5" fill="#000000" />
            <rect x="8" y="8" width="1" height="1" fill="#000000" />
            <rect x="3" y="9" width="5" height="1" fill="#000000" />
            <rect x="2" y="8" width="1" height="1" fill="#000000" />
            {/* Cristal del lente con reflejo cyan */}
            <rect x="3" y="2" width="5" height="7" fill="#bfeaff" />
            <rect x="2" y="3" width="7" height="5" fill="#bfeaff" />
            <rect x="3" y="3" width="2" height="2" fill="#ffffff" />
            {/* Mango diagonal de madera/plástico */}
            <rect x="8" y="8" width="2" height="2" fill="#707070" />
            <rect x="10" y="10" width="2" height="2" fill="#000000" />
            <rect x="11" y="11" width="2" height="2" fill="#a0522d" />
            <rect x="12" y="12" width="2" height="2" fill="#a0522d" />
            <rect x="13" y="13" width="2" height="2" fill="#000000" />
            <rect x="14" y="14" width="2" height="2" fill="#a0522d" />
          </svg>
        );

      /* ===================================================================
         3. BANDERA WINDOWS CLÁSICA (4 COLORES)
         =================================================================== */
      case 'windows-flag':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            {/* Rojo (arriba izq) */}
            <rect x="1" y="2" width="5" height="4" fill="#e53935" />
            {/* Verde (arriba der) */}
            <rect x="8" y="1" width="6" height="5" fill="#43a047" />
            {/* Azul (abajo izq) */}
            <rect x="2" y="8" width="5" height="5" fill="#1e88e5" />
            {/* Amarillo (abajo der) */}
            <rect x="9" y="8" width="6" height="5" fill="#fdd835" />
            {/* Estela negra / efecto ondulado */}
            <rect x="0" y="4" width="1" height="2" fill="#000000" />
            <rect x="15" y="3" width="1" height="3" fill="#000000" />
          </svg>
        );

      /* ===================================================================
         4. COMPUTADORA BEIGE RETRO CRT
         =================================================================== */
      case 'computer':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            {/* Monitor beige */}
            <rect x="2" y="1" width="12" height="9" fill="#d4d0c8" />
            <rect x="1" y="2" width="14" height="7" fill="#d4d0c8" />
            <rect x="2" y="1" width="12" height="1" fill="#ffffff" />
            <rect x="1" y="2" width="1" height="7" fill="#ffffff" />
            <rect x="14" y="2" width="1" height="7" fill="#808080" />
            <rect x="2" y="9" width="12" height="1" fill="#808080" />
            {/* Pantalla CRT cyan */}
            <rect x="4" y="3" width="8" height="5" fill="#008080" />
            <rect x="5" y="4" width="2" height="1" fill="#ffffff" />
            {/* Base del monitor */}
            <rect x="6" y="10" width="4" height="1" fill="#808080" />
            {/* Teclado */}
            <rect x="1" y="12" width="14" height="3" fill="#d4d0c8" />
            <rect x="1" y="12" width="14" height="1" fill="#ffffff" />
            <rect x="3" y="13" width="10" height="1" fill="#808080" />
          </svg>
        );

      /* ===================================================================
         5. DISKETTE 3.5" (Floppy Disk)
         =================================================================== */
      case 'floppy':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            <rect x="1" y="1" width="13" height="14" fill="#000080" />
            <rect x="13" y="3" width="2" height="12" fill="#000080" />
            {/* Shutter metálico superior */}
            <rect x="4" y="1" width="7" height="6" fill="#c0c0c0" />
            <rect x="8" y="2" width="2" height="4" fill="#000080" />
            {/* Etiqueta blanca */}
            <rect x="3" y="8" width="9" height="6" fill="#ffffff" />
            <rect x="4" y="9" width="7" height="1" fill="#e53935" />
            <rect x="4" y="11" width="7" height="1" fill="#000080" />
          </svg>
        );

      /* ===================================================================
         6. CARPETA AMARILLA CLÁSICA (Folder)
         =================================================================== */
      case 'folder':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            <rect x="1" y="2" width="6" height="2" fill="#000000" />
            <rect x="2" y="3" width="5" height="1" fill="#fdd835" />
            <rect x="1" y="4" width="14" height="10" fill="#000000" />
            <rect x="2" y="5" width="12" height="8" fill="#ffeb3b" />
            <rect x="2" y="5" width="12" height="1" fill="#ffffff" />
            <rect x="2" y="8" width="12" height="5" fill="#fbc02d" />
          </svg>
        );

      /* ===================================================================
         7. ERROR DIALOG ICON (Círculo Rojo con X Blanca)
         =================================================================== */
      case 'error':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            <rect x="4" y="1" width="8" height="14" fill="#d32f2f" />
            <rect x="1" y="4" width="14" height="8" fill="#d32f2f" />
            <rect x="2" y="2" width="12" height="12" fill="#d32f2f" />
            {/* X blanca */}
            <rect x="4" y="4" width="2" height="2" fill="#ffffff" />
            <rect x="10" y="4" width="2" height="2" fill="#ffffff" />
            <rect x="6" y="6" width="4" height="4" fill="#ffffff" />
            <rect x="4" y="10" width="2" height="2" fill="#ffffff" />
            <rect x="10" y="10" width="2" height="2" fill="#ffffff" />
          </svg>
        );

      /* ===================================================================
         8. WARNING DIALOG ICON (Triángulo Amarillo con !)
         =================================================================== */
      case 'warning':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            <polygon points="8,1 15,14 1,14" fill="#fbc02d" stroke="#000000" strokeWidth="1" />
            {/* Signo de exclamación negro */}
            <rect x="7" y="5" width="2" height="5" fill="#000000" />
            <rect x="7" y="11" width="2" height="2" fill="#000000" />
          </svg>
        );

      /* ===================================================================
         9. MS PAINT PALETTE
         =================================================================== */
      case 'paint':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            {/* Paleta blanca */}
            <rect x="3" y="2" width="10" height="11" fill="#ffffff" stroke="#000000" strokeWidth="1" />
            {/* Manchas de color */}
            <rect x="5" y="4" width="2" height="2" fill="#e53935" />
            <rect x="9" y="4" width="2" height="2" fill="#1e88e5" />
            <rect x="5" y="7" width="2" height="2" fill="#43a047" />
            <rect x="9" y="7" width="2" height="2" fill="#fdd835" />
            <rect x="7" y="10" width="2" height="2" fill="#8e24aa" />
          </svg>
        );

      /* ===================================================================
         10. REPRODUCTOR WINAMP / AUDIO
         =================================================================== */
      case 'winamp':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            <rect x="1" y="2" width="14" height="12" fill="#2b3e50" stroke="#000000" strokeWidth="1" />
            {/* Rayo de Winamp amarillo */}
            <polygon points="9,3 4,9 8,9 7,13 12,7 8,7" fill="#fdd835" />
          </svg>
        );

      /* ===================================================================
         11. PARLANTE DE AUDIO
         =================================================================== */
      case 'sound':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            <rect x="2" y="6" width="3" height="4" fill="#707070" />
            <polygon points="5,6 9,3 9,13 5,10" fill="#707070" />
            {/* Ondas de sonido */}
            <rect x="11" y="5" width="1" height="6" fill="#000000" />
            <rect x="13" y="3" width="1" height="10" fill="#000000" />
          </svg>
        );

      /* ===================================================================
         12. COMPACT DISC (CD)
         =================================================================== */
      case 'cd':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            <circle cx="8" cy="8" r="7" fill="#c0c0c0" stroke="#000000" strokeWidth="1" />
            <circle cx="8" cy="8" r="4" fill="#e0e0e0" />
            <circle cx="8" cy="8" r="2" fill="#ffffff" stroke="#707070" strokeWidth="1" />
            {/* Reflejo arcoíris */}
            <path d="M4 4 L6 6 M10 10 L12 12" stroke="#00bcd4" strokeWidth="1" />
            <path d="M4 12 L6 10 M10 6 L12 4" stroke="#e91e63" strokeWidth="1" />
          </svg>
        );

      /* ===================================================================
         12b. BLOC DE NOTAS (Notepad Clásico)
         =================================================================== */
      case 'notepad':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            {/* Hoja de papel blanca con borde oscuro */}
            <rect x="2" y="1" width="11" height="14" fill="#ffffff" stroke="#000080" strokeWidth="1" />
            {/* Espiral o lomo superior */}
            <rect x="2" y="1" width="11" height="3" fill="#1e88e5" />
            {/* Líneas de texto */}
            <rect x="4" y="6" width="7" height="1" fill="#757575" />
            <rect x="4" y="8" width="7" height="1" fill="#757575" />
            <rect x="4" y="10" width="7" height="1" fill="#757575" />
            <rect x="4" y="12" width="5" height="1" fill="#757575" />
          </svg>
        );

      /* ===================================================================
         13. DIÁLOGO INFO WINDOWS XP (Círculo Azul con 'i' Blanca)
         =================================================================== */
      case 'info':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            style={{ shapeRendering: 'crispEdges' }}
            className={className}
          >
            <circle cx="8" cy="8" r="7" fill="#1976d2" stroke="#0d47a1" strokeWidth="1" />
            {/* Punto de la 'i' */}
            <rect x="7" y="4" width="2" height="2" fill="#ffffff" />
            {/* Cuerpo de la 'i' */}
            <rect x="7" y="7" width="2" height="5" fill="#ffffff" />
            <rect x="6" y="7" width="1" height="1" fill="#ffffff" />
            <rect x="6" y="11" width="4" height="1" fill="#ffffff" />
          </svg>
        );

      /* ===================================================================
         14. WHATSAPP RETRO ICON (Bocadillo Verde con Teléfono Blanco)
         =================================================================== */
      case 'whatsapp':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className={className}
          >
            {/* Fondo Verde WhatsApp con degradado y borde suave */}
            <circle cx="8" cy="8" r="7.5" fill="#25D366" stroke="#128C7E" strokeWidth="0.8" />
            {/* Cola del bocadillo de mensaje */}
            <polygon points="3,11 1.5,14.5 5.5,13.5" fill="#25D366" stroke="#128C7E" strokeWidth="0.5" />
            {/* Auricular de teléfono blanco en el centro */}
            <path
              d="M10.8 9.5c-.15-.08-.9-.45-1.04-.5-.14-.05-.24-.08-.34.08-.1.15-.38.5-.47.6-.09.1-.18.12-.33.04-.15-.07-.63-.23-1.2-1.03-.45-.62-.48-.69-.55-.84-.07-.15 0-.23.07-.3.07-.07.15-.17.22-.26.07-.09.1-.15.15-.25.05-.1 0-.19-.02-.27-.03-.07-.34-.82-.47-1.12-.13-.3-.26-.26-.36-.26h-.3c-.1 0-.27.04-.41.2-.14.15-.54.53-.54 1.3 0 .76.55 1.5.63 1.6.08.1 1.09 1.66 2.64 2.33 1.55.66 1.55.44 1.83.42.28-.03.9-.37 1.03-.73.13-.35.13-.66.09-.72-.04-.07-.15-.1-.3-.17z"
              fill="#ffffff"
            />
          </svg>
        );

      /* ===================================================================
         15. TELÉFONO VERDE VINTAGE (Green Phone Handset)
         =================================================================== */
      case 'phone':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className={className}
          >
            <rect x="1" y="1" width="14" height="14" rx="3" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
            <path
              d="M5.2 4.2c.2-.2.5-.2.7 0l1.2 1.2c.2.2.2.5 0 .7l-.6.6c.4.8 1.1 1.5 1.9 1.9l.6-.6c.2-.2.5-.2.7 0l1.2 1.2c.2.2.2.5 0 .7l-.7.7c-.4.4-1 .4-1.5.1-1.8-.9-3.2-2.3-4.1-4.1-.3-.5-.3-1.1.1-1.5l.6-.6z"
              fill="#ffffff"
            />
          </svg>
        );

      default:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="#0055ea"
            className={className}
          >
            <rect x="2" y="2" width="12" height="12" />
          </svg>
        );
    }
  };

  return <span className="inline-flex items-center justify-center shrink-0">{renderIcon()}</span>;
};
