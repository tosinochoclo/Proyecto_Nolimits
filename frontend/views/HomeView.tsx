import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';
import { INITIAL_PRODUCTS } from '../services/mockData';
import { Product } from '../types';
import { PixelIcon } from '../components/common/PixelIcon';

/* =========================================================================
   Componentes Windows XP Design System
   ========================================================================= */
import { CosmicBackgroundFx } from '../components/home/CosmicBackgroundFx/CosmicBackgroundFx';
import { HeroWelcome } from '../components/home/HeroWelcome/HeroWelcome';
import { TelemetryCluster } from '../components/home/TelemetryCluster/TelemetryCluster';
import { FeaturedCatalog } from '../components/home/FeaturedCatalog/FeaturedCatalog';
import { MasterStatusBar } from '../components/home/MasterStatusBar/MasterStatusBar';
import { DiarioWidget } from '../components/home/DiarioWidget';
import { ContactoWidget } from '../components/home/ContactoWidget';
import { WindowsSystemDialog } from '../components/home/WindowsSystemDialog/WindowsSystemDialog';

import './HomeView.css';

/**
 * Vista: HomeView (Windows XP Luna Edition)
 * 
 * Orquestador principal de la experiencia de compra bajo la nueva dirección
 * artística nostálgica de Windows XP y tecnología de principios de los 2000.
 */
export const HomeView: React.FC = () => {
  const { addToCart } = useCart();
  const { branches, activeBranchId } = useBranch();

  const [showDiario, setShowDiario] = useState<boolean>(false);
  const [showContacto, setShowContacto] = useState<boolean>(false);
  const [activeWidgetTab, setActiveWidgetTab] = useState<'diario' | 'contacto' | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState<boolean>(false);

  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const featuredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => !product.isHidden);
  }, []);

  const handleOpenWidget = (widgetId: 'diario' | 'contacto') => {
    setActiveWidgetTab(widgetId);
    if (widgetId === 'diario') setShowDiario(true);
    if (widgetId === 'contacto') setShowContacto(true);
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="home-view-wrapper">
      {/* Diálogo emergente estilo "Mensaje del Sistema Windows XP" (opcional/descartable) */}
      {showWelcomeDialog && (
        <WindowsSystemDialog
          title="Nolimits.exe - Inicialización Completa"
          message="Bienvenido al nuevo sistema operativo de compra NoLimits en Windows XP. Su conexión con el servidor central de Santiago y Valparaíso está activa."
          iconType="info"
          onOk={() => setShowWelcomeDialog(false)}
          onCancel={() => setShowWelcomeDialog(false)}
        />
      )}

      {/* Ventana Maestra de Windows XP Luna */}
      <div className="master-xp-window">
        {/* Barra de Título Luna Azul */}
        <header className="winxp-titlebar">
          <div className="winxp-titlebar-title">
            <PixelIcon name="windows-flag" size={16} />
            <span>Nolimits Apparel OS - [Escritorio Principal Windows XP]</span>
          </div>

          <div className="winxp-controls">
            <button
              type="button"
              className="winxp-btn-ctrl winxp-btn-min"
              title="Minimizar"
            >
              _
            </button>
            <button
              type="button"
              className="winxp-btn-ctrl winxp-btn-max"
              title="Maximizar"
            >
              □
            </button>
            <button
              type="button"
              onClick={() => setShowWelcomeDialog(true)}
              className="winxp-btn-ctrl winxp-btn-close"
              title="Cerrar ventana / Ayuda del sistema"
            >
              ×
            </button>
          </div>
        </header>

        {/* Menú de ventana clásico */}
        <nav className="winxp-menubar">
          <span className="winxp-menu-item">Archivo</span>
          <span className="winxp-menu-item">Edición</span>
          <span className="winxp-menu-item">Ver</span>
          <span className="winxp-menu-item">Herramientas</span>
          <span className="winxp-menu-item" onClick={() => setShowWelcomeDialog(true)}>Ayuda</span>
        </nav>

        {/* Cuerpo Interior de la Ventana */}
        <main className="master-xp-body">
          {/* Elementos de Tecnología Antigua: Íconos de Escritorio, Winamp, Paint y Bryce 3D */}
          <CosmicBackgroundFx />

          {/* Encabezado Principal Hero (Fondo Blanco Limpio, Tipografía Tahoma) */}
          <HeroWelcome
            showDiario={showDiario}
            onToggleDiario={() => setShowDiario((prev) => !prev)}
            showContacto={showContacto}
            onToggleContacto={() => setShowContacto((prev) => !prev)}
            activeWidgetTab={activeWidgetTab}
            onOpenWidget={handleOpenWidget}
          />

          {/* Paneles Desplegables de Bitácora y Contacto */}
          {(showDiario || showContacto) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {showDiario && (
                <div className="bg-white p-3 border border-gray-400 winxp-bevel-in">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-300 font-bold text-xs text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <PixelIcon name="notepad" size={15} />
                      Bitácora de Lanzamientos
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDiario(false)}
                      className="text-gray-500 hover:text-red-600 font-bold text-xs"
                    >
                      [Cerrar]
                    </button>
                  </div>
                  <DiarioWidget onClose={() => setShowDiario(false)} className="w-full mt-2" />
                </div>
              )}

              {showContacto && (
                <div className="bg-white p-3 border border-gray-400 winxp-bevel-in">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-300 font-bold text-xs text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <PixelIcon name="info" size={15} />
                      Mesa de Ayuda & Atención
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowContacto(false)}
                      className="text-gray-500 hover:text-red-600 font-bold text-xs"
                    >
                      [Cerrar]
                    </button>
                  </div>
                  <ContactoWidget onClose={() => setShowContacto(false)} className="w-full mt-2" />
                </div>
              )}
            </div>
          )}

          {/* Telemetría y Estado de Nodos Físicos */}
          <TelemetryCluster branches={branches} />

          {/* Catálogo de Prendas Destacadas con fondo blanco y tarjetas nítidas */}
          <FeaturedCatalog
            products={featuredProducts}
            activeBranchId={activeBranchId}
            addedProductId={addedProductId}
            onQuickAdd={handleQuickAdd}
          />

          {/* Barra de Estado inferior de la ventana */}
          <MasterStatusBar />
        </main>
      </div>
    </div>
  );
};
