import React, { useState, useMemo } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';
import { INITIAL_PRODUCTS } from '../services/mockData';
import { Product } from '../types';

/* =========================================================================
   Componentes Modulares Extraídos y Estilos Separados
   ========================================================================= */
import { CosmicBackgroundFx } from '../components/home/CosmicBackgroundFx/CosmicBackgroundFx';
import { HeroWelcome } from '../components/home/HeroWelcome/HeroWelcome';
import { TelemetryCluster } from '../components/home/TelemetryCluster/TelemetryCluster';
import { FeaturedCatalog } from '../components/home/FeaturedCatalog/FeaturedCatalog';
import { MasterStatusBar } from '../components/home/MasterStatusBar/MasterStatusBar';
import { DiarioWidget } from '../components/home/DiarioWidget';
import { ContactoWidget } from '../components/home/ContactoWidget';

import './HomeView.css';

/**
 * Vista: HomeView
 * 
 * Propósito:
 * Orquestador principal de la vista de inicio del sistema operativo Cyber-Gothic Nolimits.
 * Integra la ambientación cósmica, el encabezado Hero, los widgets interactivos de escritorio,
 * la telemetría de stock físico en vivo (Viña, Valparaíso, Quilpué) y el catálogo destacado.
 * 
 * Arquitectura y Refactorización:
 * - Cada sección visual ha sido delegada a componentes especializados con sus propios archivos CSS.
 * - Mantiene el estado de UI de nivel superior (widgets de diario/contacto y selección rápida de carro).
 * - Código empático, limpio y preparado para mantenimiento en equipo.
 */
export const HomeView: React.FC = () => {
  // Contextos globales para gestión de carrito y sucursal activa
  const { addToCart } = useCart();
  const { branches, activeBranchId } = useBranch();

  // Estados de control para la apertura de widgets interactivos estilo escritorio retro
  const [showDiario, setShowDiario] = useState<boolean>(true);
  const [showContacto, setShowContacto] = useState<boolean>(false);
  const [activeWidgetTab, setActiveWidgetTab] = useState<'diario' | 'contacto' | null>(null);

  // Estado transitorio para dar feedback visual instantáneo cuando se añade un producto
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Memorización de productos activos para evitar recalcular en renders menores
  const featuredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => !product.isHidden);
  }, []);

  /**
   * Manejador para abrir o alternar un widget desde el Dock pixelado
   */
  const handleOpenWidget = (widgetId: 'diario' | 'contacto') => {
    setActiveWidgetTab(widgetId);
    if (widgetId === 'diario') setShowDiario(true);
    if (widgetId === 'contacto') setShowContacto(true);
  };

  /**
   * Manejador de compra rápida de productos desde la grilla destacada
   */
  const handleQuickAdd = (product: Product) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="home-view-wrapper">
      {/* 
        VENTANA MAESTRA DEL NAVEGADOR / SISTEMA OPERATIVO
        Bisel cromado, barra de título morado lavanda y controles retro
      */}
      <div className="master-os-window bevel-chrome">
        {/* Barra de título de la ventana OS */}
        <header className="master-os-titlebar os-titlebar-lavender">
          <div className="titlebar-brand-group">
            <span className="w-2.5 h-2.5 bg-[#00ff66] rounded-full animate-pulse shadow-[0_0_8px_#00ff66]" />
            <span className="titlebar-brand-title">
              Nolimits
            </span>
            <span className="titlebar-brand-subtitle">
              :: [Cyber-Gothic OS v2.0 - Chile Central Network]
            </span>
          </div>

          {/* Botones de control estilo Windows 95/98 (Minimizar, Maximizar, Cerrar) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              className="win-btn"
              title="Minimizar Ventana Principal"
              aria-label="Minimizar"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            <button
              type="button"
              className="win-btn"
              title="Maximizar"
              aria-label="Maximizar"
            >
              <Square className="w-2 h-2" />
            </button>
            <button
              type="button"
              className="win-btn win-btn-close"
              title="Cerrar Terminal"
              aria-label="Cerrar"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        </header>

        {/* Cuerpo principal de la ventana */}
        <main className="master-os-body">
          {/* Fondo animado cósmico con haces de luz y estrellas */}
          <CosmicBackgroundFx />

          {/* Encabezado principal Hero con logo, dock de navegación y accesos */}
          <HeroWelcome
            showDiario={showDiario}
            onToggleDiario={() => setShowDiario((prev) => !prev)}
            showContacto={showContacto}
            onToggleContacto={() => setShowContacto((prev) => !prev)}
            activeWidgetTab={activeWidgetTab}
            onOpenWidget={handleOpenWidget}
          />

          {/* Widgets de escritorio desplegables (Diario de lanzamientos y Contacto) */}
          {(showDiario || showContacto) && (
            <section className="master-os-widgets-grid" aria-label="Widgets Interactivos">
              {showDiario && (
                <div className={`${showContacto ? 'lg:col-span-6' : 'lg:col-span-12 max-w-2xl mx-auto w-full'}`}>
                  <DiarioWidget onClose={() => setShowDiario(false)} className="w-full" />
                </div>
              )}

              {showContacto && (
                <div className={`${showDiario ? 'lg:col-span-6' : 'lg:col-span-12 max-w-2xl mx-auto w-full'}`}>
                  <ContactoWidget onClose={() => setShowContacto(false)} className="w-full" />
                </div>
              )}
            </section>
          )}

          {/* Telemetría en vivo del clúster de sucursales físicas */}
          <TelemetryCluster branches={branches} />

          {/* Catálogo de prendas destacadas con stock reactivo */}
          <FeaturedCatalog
            products={featuredProducts}
            activeBranchId={activeBranchId}
            addedProductId={addedProductId}
            onQuickAdd={handleQuickAdd}
          />

          {/* Barra de estado inferior con métricas del sistema */}
          <MasterStatusBar />
        </main>
      </div>
    </div>
  );
};
