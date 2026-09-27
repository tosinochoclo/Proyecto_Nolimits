import React from 'react';
import './CosmicBackgroundFx.css';

/**
 * Componente: CosmicBackgroundFx
 * 
 * Propósito:
 * Renderiza la ambientación visual cyber-gótica con haces de luz en rotación,
 * destellos radiales y estrellas titilantes en estilo pixel/retro.
 * 
 * Buenas prácticas aplicadas:
 * - Los estilos y keyframes de animación residen en CosmicBackgroundFx.css.
 * - Este componente no tiene estado y está optimizado con React.memo para evitar re-renderizados innecesarios.
 */
export const CosmicBackgroundFx: React.FC = React.memo(() => {
  return (
    <div className="cosmic-bg-container" aria-hidden="true">
      {/* Resplandor radial de alta energía */}
      <div className="cosmic-radial-flare" />

      {/* Rueda de haces de luz giratorios */}
      <div className="cosmic-starburst-beams" />

      {/* Constelación de glifos titilantes (★ ✦ ✵ ✧ ⋆) */}
      <span className="cosmic-star cosmic-star-1">✦</span>
      <span className="cosmic-star cosmic-star-2">★</span>
      <span className="cosmic-star cosmic-star-3">✵</span>
      <span className="cosmic-star cosmic-star-4">✧</span>
      <span className="cosmic-star cosmic-star-5">★</span>
      <span className="cosmic-star cosmic-star-6">✦</span>
      <span className="cosmic-star cosmic-star-7">⋆</span>
      <span className="cosmic-star cosmic-star-8">✵</span>
    </div>
  );
});

CosmicBackgroundFx.displayName = 'CosmicBackgroundFx';
