import React, { useState } from 'react';
import { Bryce3DGallery } from '../Bryce3DGallery/Bryce3DGallery';
import './CosmicBackgroundFx.css';

/**
 * Componente: CosmicBackgroundFx (Old Tech Nostalgia Desktop Layer)
 * 
 * Ventana de renderizado 3D nostálgico Bryce 3D centrada.
 * Se eliminaron los íconos de acceso directo de escritorio ("Mi PC", "Mis Documentos",
 * "Papelera", "Winamp Audio", "MS Paint", "Bryce 3D"), el reproductor Winamp y
 * las herramientas Paint Tools para despejar la vista principal según solicitud.
 */
export const CosmicBackgroundFx: React.FC = () => {
  const [showBryce, setShowBryce] = useState<boolean>(true);

  if (!showBryce) {
    return null;
  }

  return (
    <div className="old-tech-desk-container">
      <div className="w-full flex justify-center">
        <Bryce3DGallery onClose={() => setShowBryce(false)} />
      </div>
    </div>
  );
};
