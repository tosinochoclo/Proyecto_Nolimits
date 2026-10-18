import React from 'react';

interface MsnMessengerIconProps {
  size?: number;
  className?: string;
}

/**
 * MsnMessengerIcon: Réplica vectorial fiel del icónico logotipo de dos amigos (Buddy Icon)
 * de MSN Messenger / Windows Live Messenger de la era Windows XP.
 * 
 * Contiene:
 * - Amigo verde (izquierda): cabeza esférica 3D y torso redondeado con gradiente verde lima.
 * - Amigo azul (derecha): cabeza esférica 3D y torso con gradiente azul cielo cobalto.
 * - Onda / cinta dorada dinámica: espiral energética que envuelve a ambos personajes.
 */
export const MsnMessengerIcon: React.FC<MsnMessengerIconProps> = ({
  size = 42,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        {/* =================================================================
            GRADIENTES AMIGO VERDE (Left Buddy)
            ================================================================= */}
        {/* Cabeza Verde 3D */}
        <radialGradient id="msnGreenHead" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#b4f55a" />
          <stop offset="35%" stopColor="#78d428" />
          <stop offset="75%" stopColor="#48a812" />
          <stop offset="100%" stopColor="#2b6b08" />
        </radialGradient>

        {/* Torso Verde 3D */}
        <linearGradient id="msnGreenBody" x1="25%" y1="10%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#9de648" />
          <stop offset="30%" stopColor="#6dc61e" />
          <stop offset="70%" stopColor="#489e10" />
          <stop offset="100%" stopColor="#235c05" />
        </linearGradient>

        {/* Brillo especular suave verde */}
        <linearGradient id="msnGreenHighlight" x1="20%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* =================================================================
            GRADIENTES AMIGO AZUL (Right Buddy - En primer plano)
            ================================================================= */}
        {/* Cabeza Azul 3D */}
        <radialGradient id="msnBlueHead" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#b8e2ff" />
          <stop offset="30%" stopColor="#6cb8f6" />
          <stop offset="70%" stopColor="#2b7ec9" />
          <stop offset="100%" stopColor="#114b8a" />
        </radialGradient>

        {/* Torso Azul 3D */}
        <linearGradient id="msnBlueBody" x1="25%" y1="10%" x2="65%" y2="100%">
          <stop offset="0%" stopColor="#8eceff" />
          <stop offset="35%" stopColor="#479fe8" />
          <stop offset="75%" stopColor="#1e6ab5" />
          <stop offset="100%" stopColor="#0d3b6f" />
        </linearGradient>

        {/* Brillo especular suave azul */}
        <linearGradient id="msnBlueHighlight" x1="20%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* =================================================================
            GRADIENTES DE LA CINTA DORADA / SWOOSH
            ================================================================= */}
        {/* Capa base brillante anaranjada/dorada */}
        <linearGradient id="msnSwirlBack" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e67e00" stopOpacity="0.1" />
          <stop offset="30%" stopColor="#f39c12" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#f1c40f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f39c12" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="msnSwirlFront" x1="0%" y1="30%" x2="100%" y2="70%">
          <stop offset="0%" stopColor="#e67e00" stopOpacity="0.2" />
          <stop offset="15%" stopColor="#f39c12" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#ffeb3b" stopOpacity="1" />
          <stop offset="65%" stopColor="#f1c40f" stopOpacity="0.95" />
          <stop offset="85%" stopColor="#e67e00" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d35400" stopOpacity="0" />
        </linearGradient>

        {/* Núcleo blanco brillante en el centro del rayo dorado */}
        <linearGradient id="msnSwirlCore" x1="0%" y1="30%" x2="100%" y2="70%">
          <stop offset="10%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#fffae0" stopOpacity="0.2" />
        </linearGradient>

        {/* Filtro de sombra suave inferior */}
        <filter id="msnShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#msnShadow)">
        {/* =================================================================
            1. TRAMO TRASERO DE LA CINTA DORADA (Detrás de los personajes)
            ================================================================= */}
        <path
          d="M 12 43 C 11 39, 14 34, 21 33 C 25 32, 28 33, 31 34"
          fill="none"
          stroke="url(#msnSwirlBack)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* =================================================================
            2. AMIGO VERDE (Personaje izquierdo, ligeramente retrasado)
            ================================================================= */}
        {/* Torso Verde */}
        <g>
          <path
            d="M 23 27 
               C 21 27, 18 29, 16 33 
               C 14 37, 13 41, 14 47 
               C 14.5 49, 15.5 50, 18 50 
               L 28 50 
               C 29.5 50, 30.5 49, 31 46 
               C 31.5 41, 31 37, 29 33 
               C 27 29, 25 27, 23 27 Z"
            fill="url(#msnGreenBody)"
            stroke="#205904"
            strokeWidth="0.8"
          />
          {/* Brillo suave en hombro izquierdo */}
          <path
            d="M 23 28 C 21 28, 18 30, 16.5 33.5 C 15 37, 14.5 40, 15 44 C 15 38, 17 32, 22 29 Z"
            fill="url(#msnGreenHighlight)"
          />
        </g>

        {/* Cabeza Verde */}
        <circle
          cx="23.5"
          cy="19"
          r="8.5"
          fill="url(#msnGreenHead)"
          stroke="#1e5404"
          strokeWidth="0.8"
        />
        {/* Reflejo especular blanco superior izquierdo en cabeza verde */}
        <ellipse
          cx="21"
          cy="16"
          rx="3.5"
          ry="2"
          transform="rotate(-25 21 16)"
          fill="#ffffff"
          opacity="0.45"
        />

        {/* =================================================================
            3. AMIGO AZUL (Personaje derecho, en primer plano)
            ================================================================= */}
        {/* Torso Azul */}
        <g>
          <path
            d="M 38 25 
               C 35 25, 31 27, 28.5 32 
               C 26 37, 25.5 43, 26.5 50 
               C 27 52.5, 28.5 54, 32 54 
               L 44 54 
               C 47.5 54, 49 52.5, 49.5 50 
               C 50.5 43, 50 37, 47.5 32 
               C 45 27, 41 25, 38 25 Z"
            fill="url(#msnBlueBody)"
            stroke="#0a325c"
            strokeWidth="0.9"
          />
          {/* Brillo suave en hombro izquierdo del torso azul */}
          <path
            d="M 38 26.5 C 35 26.5, 31 29, 29 33 C 27 38, 26.5 43, 27.5 47 C 27 42, 28.5 34, 37 28 Z"
            fill="url(#msnBlueHighlight)"
          />
        </g>

        {/* Cabeza Azul */}
        <circle
          cx="38.5"
          cy="16.5"
          r="10.5"
          fill="url(#msnBlueHead)"
          stroke="#092f58"
          strokeWidth="0.9"
        />
        {/* Reflejo especular blanco superior izquierdo en cabeza azul */}
        <ellipse
          cx="35"
          cy="13"
          rx="4.5"
          ry="2.5"
          transform="rotate(-25 35 13)"
          fill="#ffffff"
          opacity="0.5"
        />

        {/* =================================================================
            4. TRAMO DELANTERO DE LA CINTA DORADA (Cruza por delante de ambos)
            ================================================================= */}
        {/* Capa de resplandor exterior suave */}
        <path
          d="M 12 43 C 14 47, 21 50, 31 49 C 41 48, 50 43, 56 38"
          fill="none"
          stroke="#ffa726"
          strokeWidth="4.8"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
        {/* Cinta dorada principal con degradado cálido */}
        <path
          d="M 12 43 C 14 47, 21 50, 31 49 C 41 48, 50 43, 56 38"
          fill="none"
          stroke="url(#msnSwirlFront)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Núcleo blanco brillante en la cresta del rayo */}
        <path
          d="M 18 46 C 24 49, 32 49, 41 47 C 46 45, 51 42, 54 39"
          fill="none"
          stroke="url(#msnSwirlCore)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
