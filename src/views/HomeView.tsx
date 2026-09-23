import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Radio,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  Store,
  Minus,
  Square,
  X,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { PixelButton } from '../components/common/PixelButton';
import { SpiderwebDecor } from '../components/home/SpiderwebDecor';
import { PixelNavDock } from '../components/home/PixelNavDock';
import { WinampPlayerWidget } from '../components/home/WinampPlayerWidget';
import { LiveStreamCamWidget } from '../components/home/LiveStreamCamWidget';
import { DiarioWidget } from '../components/home/DiarioWidget';
import { ContactoWidget } from '../components/home/ContactoWidget';
import { useCart } from '../context/CartContext';
import { useBranch } from '../context/BranchContext';
import { INITIAL_PRODUCTS } from '../services/mockData';

export const HomeView: React.FC = () => {
  const { addToCart } = useCart();
  const { branches, activeBranchId } = useBranch();

  // Active floating widgets state (can be toggled/closed for interactive desktop chaos)
  const [showStreamCam, setShowStreamCam] = useState(true);
  const [showWinamp, setShowWinamp] = useState(true);
  const [showDiario, setShowDiario] = useState(false);
  const [showContacto, setShowContacto] = useState(false);
  const [activeWidgetTab, setActiveWidgetTab] = useState<'stream' | 'winamp' | 'diario' | 'contacto' | null>(null);

  // Quick feedback state for cart adds
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const featuredProducts = INITIAL_PRODUCTS.filter((p) => !p.isHidden);

  const handleOpenWidget = (widgetId: 'diario' | 'contacto' | 'winamp' | 'stream') => {
    setActiveWidgetTab(widgetId);
    if (widgetId === 'diario') setShowDiario(true);
    if (widgetId === 'contacto') setShowContacto(true);
    if (widgetId === 'winamp') setShowWinamp(true);
    if (widgetId === 'stream') setShowStreamCam(true);
  };

  const handleQuickAdd = (product: typeof featuredProducts[0]) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="space-y-6 relative">
      {/* 
        MASTER BROWSER / OS WINDOW FRAME:
        "Borde de la Ventana del Navegador: Biseles metálicos y negros, con una barra de título
        superior de color morado lavanda que muestra 'Nolimits' en fuente pixelada blanca.
        Botones de control de ventana (min, max, cerrar) de aspecto retro en la esquina derecha."
      */}
      <div className="bevel-chrome rounded-xs bg-[#05030a]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(157,0,255,0.25)] relative overflow-hidden border-2 border-[#2b223c]">
        {/* Lavender Titlebar */}
        <div className="os-titlebar-lavender px-3 sm:px-4 py-2 flex items-center justify-between select-none text-white border-b border-[#3c1e5e]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00ff66] rounded-full animate-pulse shadow-[0_0_8px_#00ff66]" />
            <span className="font-['Silkscreen'] text-xs sm:text-sm tracking-widest text-white font-bold drop-shadow-sm">
              Nolimits
            </span>
            <span className="hidden md:inline font-['VT323'] text-sm text-[#e9d5ff]/80">
              :: [Cyber-Gothic OS v2.0 - Chile Central Network]
            </span>
          </div>

          {/* Retro Window Control Buttons (min, max, close) */}
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
        </div>

        {/* Master Window Body Area */}
        <div className="p-3 sm:p-6 space-y-6 relative overflow-hidden">
          {/* =========================================================================
              BACKGROUND LIGHT RAYS, ELECTRIC GLOW & DIGITAL GLITTER
              ========================================================================= */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* Center Radial Electric Blue to Neon Violet Flare */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(157,0,255,0.28)_0%,rgba(0,212,255,0.18)_35%,rgba(255,0,127,0.12)_60%,transparent_80%)] blur-2xl animate-pulse-glow" />

            {/* Rotating Starburst / Light Beams */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-20 animate-flare bg-[conic-gradient(from_0deg,transparent_0deg,#ff007f_30deg,transparent_60deg,#00d4ff_120deg,transparent_180deg,#9d00ff_240deg,transparent_300deg)] pointer-events-none" />

            {/* Sparkling Stars & Digital Glitter (★ ✦ ✵ ✧ ⋆) */}
            <span className="absolute top-12 left-10 text-[#00d4ff] text-xl animate-twinkle font-mono">✦</span>
            <span className="absolute top-24 left-1/4 text-[#ff007f] text-sm animate-twinkle font-mono" style={{ animationDelay: '0.7s' }}>★</span>
            <span className="absolute top-10 right-16 text-[#e9d5ff] text-2xl animate-twinkle font-mono" style={{ animationDelay: '1.2s' }}>✵</span>
            <span className="absolute top-36 right-1/4 text-[#00ff66] text-sm animate-twinkle font-mono" style={{ animationDelay: '1.8s' }}>✧</span>
            <span className="absolute bottom-20 left-12 text-[#ff77b8] text-lg animate-twinkle font-mono" style={{ animationDelay: '0.4s' }}>★</span>
            <span className="absolute bottom-24 right-16 text-[#00d4ff] text-xl animate-twinkle font-mono" style={{ animationDelay: '1.5s' }}>✦</span>
            <span className="absolute top-1/2 left-6 text-white text-xs animate-twinkle font-mono" style={{ animationDelay: '2.1s' }}>⋆</span>
            <span className="absolute top-1/2 right-6 text-[#a855f7] text-xs animate-twinkle font-mono" style={{ animationDelay: '1.1s' }}>✵</span>
          </div>

          {/* =========================================================================
              HERO WELCOME WINDOW:
              "Encabezado Principal (Welcome): Texto grande, en negrita y biselado con un
              degradado de rosa a blanco que dice 'Nolimits'. Debajo, un texto de párrafo
              más pequeño que dice 'Nolimits'."
              Con telarañas estilizadas en las esquinas, purpurina digital y destellos.
              ========================================================================= */}
          <div className="relative z-10">
            <div className="bevel-chrome bg-[#0a0714]/90 p-5 sm:p-10 relative overflow-hidden text-center space-y-5 shadow-[0_0_35px_rgba(255,0,127,0.2)]">
              {/* Corner Spiderwebs (SVG with neon purple and pink threads) */}
              <SpiderwebDecor position="top-left" color="#9d00ff" />
              <SpiderwebDecor position="top-right" color="#ff007f" />
              <SpiderwebDecor position="bottom-left" color="#7c3aed" />
              <SpiderwebDecor position="bottom-right" color="#00d4ff" />

              {/* Status Badge & Signal Indicator */}
              <div className="inline-flex items-center gap-2 bevel-sunken px-3.5 py-1.5 font-['Silkscreen'] text-xs text-[#00d4ff] bg-black/80 border border-[#00d4ff]/30 shadow-[0_0_12px_rgba(0,212,255,0.3)]">
                <Radio className="w-3.5 h-3.5 text-[#ff007f] animate-pulse" />
                <span className="text-white">STREAMING ACTIVO // NODO VIÑA - VALPARAÍSO - QUILPUÉ</span>
              </div>

              {/* Title Section */}
              <div className="space-y-1 sm:space-y-2 relative">
                {/* Large Bold Beveled Pink to White Gradient "Nolimits" */}
                <h1 className="font-['Syne'] font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-y2k-gradient uppercase select-none drop-shadow-[0_4px_16px_rgba(255,0,127,0.5)]">
                  Nolimits
                </h1>

                {/* Sub-paragraph text: "Nolimits" */}
                <p className="font-['VT323'] text-2xl sm:text-3xl text-[#e9d5ff] tracking-[0.25em] uppercase select-none drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]">
                  Nolimits
                </p>

                <p className="font-['Chakra_Petch'] text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
                  E-commerce descentralizado e indumentaria cyber-gótica. Eliminamos la validación manual por chat y las listas de espera: sincronización de stock físico en tiempo real con pasarelas automáticas y despacho nacional.
                </p>
              </div>

              {/* Pixel Navigation Dock: Hogar, Diario, Compras, Contacto */}
              <div className="pt-2 flex justify-center">
                <PixelNavDock
                  onOpenWidget={handleOpenWidget}
                  activeWidget={activeWidgetTab}
                />
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link to="/catalog">
                  <PixelButton
                    variant="primary"
                    size="lg"
                    icon={<Flame className="w-4 h-4 text-yellow-300" />}
                    className="text-xs sm:text-sm px-6 py-2.5"
                  >
                    EXPLORAR DROP COMPLETO
                  </PixelButton>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowStreamCam(!showStreamCam)}
                  className="bevel-chrome bg-[#1b122e] hover:bg-[#2a1b47] px-4 py-2 text-white font-['Silkscreen'] text-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Radio className="w-3.5 h-3.5 text-[#ff007f]" />
                  <span>{showStreamCam ? 'OCULTAR RADAR LIVE' : 'MOSTRAR RADAR LIVE'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              CHAOTIC & OVERLAPPING DESKTOP WIDGETS SECTION:
              "Paneles de Contenido: Múltiples ventanas flotantes y superpuestas,
              todas con marcos cromados y negros biselados."
              ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 pt-2">
            {/* Widget 1: Stream Radar Cam (Col 1-7 or 1-6) */}
            {showStreamCam && (
              <div className="lg:col-span-6 transform lg:-rotate-0.5 hover:rotate-0 transition-transform">
                <LiveStreamCamWidget onClose={() => setShowStreamCam(false)} />
              </div>
            )}

            {/* Widget 2: CyberAmp Audio Player (Col 8-12) */}
            {showWinamp && (
              <div className="lg:col-span-6 transform lg:rotate-0.5 hover:rotate-0 transition-transform">
                <WinampPlayerWidget onClose={() => setShowWinamp(false)} />
              </div>
            )}

            {/* Widget 3 (Conditional Pop-up): Diario de Lanzamientos */}
            {showDiario && (
              <div className="lg:col-span-6 animate-in fade-in duration-200">
                <DiarioWidget onClose={() => setShowDiario(false)} />
              </div>
            )}

            {/* Widget 4 (Conditional Pop-up): Contacto Directo */}
            {showContacto && (
              <div className="lg:col-span-6 animate-in fade-in duration-200">
                <ContactoWidget onClose={() => setShowContacto(false)} />
              </div>
            )}
          </div>

          {/* =========================================================================
              MULTI-BRANCH TELEMETRY CLUSTER PANEL:
              Sincronización descentralizada Viña, Valparaíso & Quilpué
              ========================================================================= */}
          <div className="relative z-10">
            <WindowFrame
              title="CLUSTER_TELEMETRY.SYS - [Red de Inventario Físico]"
              variant="chrome"
              statusBarText="SOCKET: ACTIVE // SYNC LATENCY: 14MS // INTEGRIDAD: 100%"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-['Chakra_Petch'] text-xs">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="bevel-chrome p-3.5 bg-[#0e0a1a] space-y-2 border-t-2"
                    style={{ borderTopColor: b.colorTag }}
                  >
                    <div className="flex items-center justify-between border-b border-[#281a3d] pb-1 font-['Silkscreen']">
                      <span className="text-white text-xs">{b.city}</span>
                      <span className="text-[#00ff66] text-[10px] flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse"></span>
                        ONLINE
                      </span>
                    </div>

                    <div className="text-slate-300 font-bold text-xs truncate">
                      {b.name}
                    </div>

                    <div className="text-slate-400 text-[11px] truncate">
                      {b.address}
                    </div>

                    <div className="bevel-sunken p-1.5 bg-black/60 flex items-center justify-between font-mono text-[10px] text-slate-300">
                      <span>Jefe: {b.managerName}</span>
                      <span className="text-[#00d4ff]">RETIRO INMEDIATO</span>
                    </div>
                  </div>
                ))}
              </div>
            </WindowFrame>
          </div>

          {/* =========================================================================
              FEATURED PRODUCTS WINDOW:
              Prendas Destacadas en Tiempo Real
              ========================================================================= */}
          <div className="relative z-10">
            <WindowFrame
              title="FEATURED_CATALOG.BIN - [Prendas Destacadas & Live Drops]"
              variant="lavender"
              statusBarText="FILTRADO POR STOCK DISPONIBLE EN SUCURSAL SELECCIONADA // CHECKOUT SEGURO WEBPAY"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#30214a]">
                  <div>
                    <h2 className="font-['Silkscreen'] text-sm sm:text-base text-white">
                      PRENDAS EXCLUSIVAS DEL DROP
                    </h2>
                    <span className="font-['VT323'] text-sm text-[#ff77b8]">
                      // PIEZAS ÚNICAS LISTAS PARA DESPACHO O RETIRO EN LOCAL
                    </span>
                  </div>

                  <Link
                    to="/catalog"
                    className="font-['Silkscreen'] text-xs text-[#00d4ff] hover:text-[#ff007f] flex items-center gap-1.5 bevel-sunken px-3 py-1 bg-black/40"
                  >
                    <span>ABRIR CATÁLOGO ENTERO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProducts.map((product) => {
                    const currentStock =
                      activeBranchId === 'all'
                        ? product.totalStock
                        : product.stockPerBranch[activeBranchId] ?? 0;

                    const isRecentlyAdded = addedProductId === product.id;

                    return (
                      <div
                        key={product.id}
                        className="bevel-chrome bg-[#090710] flex flex-col group overflow-hidden transition-all hover:border-[#ff007f]"
                      >
                        {/* Image Preview with Badges */}
                        <div className="relative aspect-square overflow-hidden bg-black">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />

                          {product.discountPercent && (
                            <span className="absolute top-2 left-2 bg-[#ff007f] text-white font-['Silkscreen'] text-[10px] px-2 py-0.5 bevel-raised">
                              -{product.discountPercent}% OFF
                            </span>
                          )}

                          <span className="absolute bottom-2 right-2 bg-black/85 text-[#00d4ff] font-['VT323'] text-xs px-2 py-0.5 border border-[#00d4ff]/40">
                            STOCK: {currentStock} un.
                          </span>
                        </div>

                        {/* Product Meta & Price */}
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="font-['VT323'] text-xs text-[#a855f7] tracking-wider">
                              {product.category}
                            </div>
                            <h3 className="font-['Chakra_Petch'] font-bold text-sm text-white line-clamp-1 group-hover:text-[#ff007f] transition-colors">
                              {product.title}
                            </h3>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="font-['Silkscreen'] text-base text-white">
                              ${(product.salePrice ?? product.price).toLocaleString('es-CL')}
                            </span>
                            {product.salePrice && (
                              <span className="font-['Chakra_Petch'] text-xs line-through text-slate-500 font-mono">
                                ${product.price.toLocaleString('es-CL')}
                              </span>
                            )}
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="pt-1 flex gap-2">
                            <Link to={`/product/${product.id}`} className="flex-1">
                              <PixelButton variant="retro" size="sm" className="w-full text-xs">
                                Ver Ficha
                              </PixelButton>
                            </Link>

                            <PixelButton
                              variant={isRecentlyAdded ? 'accent' : 'primary'}
                              size="sm"
                              onClick={() => handleQuickAdd(product)}
                              disabled={currentStock <= 0}
                              title={currentStock <= 0 ? 'Sin stock' : 'Añadir al Carrito'}
                              icon={isRecentlyAdded ? <CheckCircle2 className="w-3.5 h-3.5 text-green-300" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                            >
                              {isRecentlyAdded ? '¡Listo!' : '+ Carro'}
                            </PixelButton>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </WindowFrame>
          </div>

          {/* =========================================================================
              FOOTER STATUS BAR OF THE MASTER WINDOW
              ========================================================================= */}
          <div className="bevel-sunken px-3 py-1.5 text-xs font-['VT323'] text-slate-300 flex flex-wrap items-center justify-between gap-2 border-t border-[#2e2044] select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
              <span>NOLIMITS APPAREL CORE // PROTOCOLO TCP/IP DESCENTRALIZADO // CHILE</span>
            </div>
            <div className="flex items-center gap-4 text-[#a855f7]">
              <span>TIEMPO DE RESPUESTA: 14ms</span>
              <span>WEBPAY / REDCOMPRA / TRANSBANK OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
