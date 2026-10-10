import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Settings,
  Check
} from 'lucide-react';
import { PixelIcon } from '../../common/PixelIcon';
import { useAuth } from '../../../context/AuthContext';
import './AdminImageCarousel.css';

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  title: string;
  tag?: string;
  link?: string;
}

// 8 diapositivas iniciales de alta calidad con prendas y estilo Cyber-Gothic / Y2K NoLimits
const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=85',
    title: 'NEW DROP CYBER-GOTHIC 2026 // COLECCIÓN LIMITADA',
    tag: 'DROP EXCLUSIVO',
    link: '/catalog'
  },
  {
    id: 'slide-2',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&auto=format&fit=crop&q=85',
    title: 'HEAVYWEIGHT OVERSIZED HOODIES & TECHWEAR CHILE',
    tag: 'INDUMENTARIA URBANA',
    link: '/catalog'
  },
  {
    id: 'slide-3',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop&q=85',
    title: 'RETIRO GRATUITO EN TIENDAS VIÑA DEL MAR & VALPARAÍSO',
    tag: 'STOCKS EN VIVO',
    link: '/cart'
  },
  {
    id: 'slide-4',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&auto=format&fit=crop&q=85',
    title: 'ACCESORIOS Y2K, CARTERAS BAGUETTE & CADENAS DARK METAL',
    tag: 'ACCESORIOS DROP',
    link: '/catalog'
  },
  {
    id: 'slide-5',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1600&auto=format&fit=crop&q=85',
    title: 'TACTICAL PARACHUTE CARGOS // SILUETA NOVENTERA BAGGY',
    tag: 'PANTALONES & CARGOS',
    link: '/catalog'
  },
  {
    id: 'slide-6',
    imageUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1600&auto=format&fit=crop&q=85',
    title: 'CHAQUETAS DE CUERO VINTAGE & BOMBERS DISTÓPICAS',
    tag: 'OUTERWEAR SPECIAL',
    link: '/catalog'
  },
  {
    id: 'slide-7',
    imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1600&auto=format&fit=crop&q=85',
    title: 'POLERAS OVERSIZE ACID WASH & BORDADOS GÓTICOS CROMADOS',
    tag: 'DROP VERANO/OTOÑO',
    link: '/catalog'
  },
  {
    id: 'slide-8',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&auto=format&fit=crop&q=85',
    title: 'GORRAS SNAPBACK CYBER & ACCESORIOS STREETWEAR EXCLUSIVOS',
    tag: 'EDICIÓN LIMITADA',
    link: '/catalog'
  }
];

const STORAGE_KEY = 'nolimits_home_carousel_slides_v2';

export const AdminImageCarousel: React.FC = () => {
  const { isAdmin } = useAuth();

  // Cargar diapositivas desde localStorage o usar las 8 iniciales
  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_SLIDES;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number>(4500); // 4.5 segundos por defecto
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  // Formulario para añadir nueva diapositiva (máximo 8)
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Guardar en localStorage cuando cambien los slides
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    } catch {
      // ignore
    }
  }, [slides]);

  // Rotación automática continua de diapositivas
  useEffect(() => {
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, autoPlayInterval, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      setFeedbackMsg('Por favor ingresa la URL de la imagen.');
      return;
    }
    if (slides.length >= 8) {
      setFeedbackMsg('El carrusel ya tiene el límite máximo de 8 imágenes.');
      setTimeout(() => setFeedbackMsg(''), 3500);
      return;
    }

    const newSlide: CarouselSlide = {
      id: `slide_${Date.now()}`,
      imageUrl: newImageUrl.trim(),
      title: newTitle.trim() || 'NUEVA CAMPAÑA NOLIMITS APPAREL',
      tag: newTag.trim() || 'DROP EXCLUSIVO'
    };

    setSlides((prev) => [...prev, newSlide]);
    setNewImageUrl('');
    setNewTitle('');
    setNewTag('');
    setFeedbackMsg('¡Imagen añadida con éxito al carrusel!');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleRemoveSlide = (id: string) => {
    if (slides.length <= 1) {
      setFeedbackMsg('Debe haber al menos 1 imagen en el carrusel.');
      setTimeout(() => setFeedbackMsg(''), 3000);
      return;
    }
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setCurrentIndex(0);
  };

  const handleResetDefaults = () => {
    setSlides(DEFAULT_SLIDES);
    setCurrentIndex(0);
    setFeedbackMsg('Carrusel restablecido a las 8 imágenes de campaña predeterminadas.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="wmp-carousel-wrapper w-full">
      {/* Ventana Windows XP que encierra el carrusel con el mismo ancho y tamaño del Reproductor de Windows Media */}
      <div className="wmp-window w-full">
        {/* 1. Barra de Título Luna Azul de Windows XP */}
        <div className="winxp-titlebar py-1 px-3 flex items-center justify-between">
          <div className="winxp-titlebar-title text-xs flex items-center gap-1.5">
            <PixelIcon name="paint" size={15} />
            <span className="font-bold tracking-tight">
              Galeria_Campaña.cpl - [Carrusel Automático de Imágenes // Slide {currentIndex + 1} de {slides.length}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Acceso para que el administrador gestione o agregue imágenes */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAdminPanel((prev) => !prev)}
                className={`text-[11px] px-2 py-0.5 rounded-xs font-bold flex items-center gap-1 border shadow-xs cursor-pointer transition-colors ${
                  showAdminPanel
                    ? 'bg-yellow-200 text-yellow-950 border-yellow-600'
                    : 'bg-white/20 text-white hover:bg-white/30 border-white/40'
                }`}
                title="Administrar imágenes del carrusel"
              >
                <Settings className="w-3 h-3" />
                <span>{showAdminPanel ? 'Ocultar Panel Admin' : 'Admin Carrusel'}</span>
              </button>
            )}

            <div className="winxp-controls">
              <button type="button" className="winxp-btn-ctrl winxp-btn-min" title="Minimizar">_</button>
              <button type="button" className="winxp-btn-ctrl winxp-btn-max" title="Maximizar">□</button>
            </div>
          </div>
        </div>

        {/* 2. Barra de Menú Estilo Windows Media / Explorador de Imágenes */}
        <div className="winxp-menubar text-[11px] px-3 py-0.5 flex items-center justify-between border-b border-[#d0ccc0]">
          <div className="flex items-center gap-3">
            <span className="winxp-menu-item">Archivo</span>
            <span className="winxp-menu-item">Ver</span>
            <span className="winxp-menu-item">Transición</span>
            <span className="winxp-menu-item">Opciones</span>
          </div>

          <div className="text-[10px] text-gray-700 font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>TRANSICIÓN AUTOMÁTICA EN VIVO ({autoPlayInterval / 1000}s)</span>
          </div>
        </div>

        {/* 3. Panel de Visualización del Carrusel (Mismo tamaño del Reproductor de Windows Media) */}
        <div className="wmp-carousel-viewport relative w-full overflow-hidden">
          {/* Capa de líneas CRT retro de Windows XP */}
          <div className="wmp-crt-overlay" />

          {/* Diapositiva Activa con transición suave */}
          {currentSlide && (
            <div className="w-full h-full relative group">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                key={currentSlide.id}
                className="w-full h-full object-cover object-center animate-in fade-in duration-500 transition-transform duration-700 select-none"
              />

              {/* Degradado oscuro inferior para legibilidad de títulos */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Contenido flotante con etiqueta, título y controles */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="max-w-2xl space-y-1 drop-shadow-md">
                  {currentSlide.tag && (
                    <span className="inline-block px-2 py-0.5 bg-[#0055ea] text-white text-[10px] font-bold rounded-xs uppercase tracking-wider border border-blue-400">
                      ⚡ {currentSlide.tag}
                    </span>
                  )}
                  <h3 className="text-white font-extrabold text-sm sm:text-lg md:text-xl tracking-tight leading-snug drop-shadow-lg">
                    {currentSlide.title}
                  </h3>
                </div>

                {/* Controles de avance manual: Solo flechas negras estilizadas sin botón de pausa */}
                <div className="flex items-center gap-1.5 shrink-0 bg-white/90 p-1 rounded-sm border border-gray-400 shadow-md backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="carousel-arrow-btn"
                    title="Imagen anterior"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-4 h-4 text-black shrink-0 stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="carousel-arrow-btn"
                    title="Siguiente imagen"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-4 h-4 text-black shrink-0 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Indicadores de bolitas / barras de diapositiva (hasta 8 imágenes) */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-white/20">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 bg-[#3593ff] border border-white shadow-xs'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    title={`Ir a imagen ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Panel de Gestión del Administrador (Colocar, subir o eliminar imágenes hasta 8) */}
        {showAdminPanel && isAdmin && (
          <div className="p-3 bg-[#ece9d8] border-t-2 border-[#0055ea] text-xs font-sans animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-300 font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-blue-700" />
                <span>Panel Administrador: Gestión de Imágenes del Carrusel (Máximo 8)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="winxp-button text-[11px] py-0.5 px-2 text-gray-700"
                  title="Restablecer a las 8 imágenes por defecto"
                >
                  Restablecer (8 Slides)
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminPanel(false)}
                  className="winxp-button text-[11px] py-0.5 px-2 text-red-700 font-bold"
                >
                  Cerrar Panel
                </button>
              </div>
            </div>

            {feedbackMsg && (
              <div className="my-2 p-1.5 bg-blue-100 border border-blue-400 text-blue-950 font-bold text-[11px] rounded-xs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-700" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              {/* Formulario para añadir nueva imagen */}
              <form onSubmit={handleAddSlide} className="md:col-span-5 bg-white p-2.5 border border-gray-400 winxp-bevel-out space-y-2">
                <div className="font-bold text-gray-900 flex items-center justify-between text-[11px] pb-1 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-green-700" />
                    <span>Añadir Imagen a la Campaña</span>
                  </div>
                  <span className={`text-[10px] font-bold ${slides.length >= 8 ? 'text-red-600' : 'text-blue-800'}`}>
                    {slides.length}/8 ocupados
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                    URL de la Imagen (Direct link / Unsplash / JPG / PNG / WebP):
                  </label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/banner-nueva-temporada.jpg"
                    className="winxp-input w-full text-xs"
                    disabled={slides.length >= 8}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                    Título o Mensaje de la Campaña:
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. DROP TEMPORADA OTOÑO / EDICIÓN CYBER"
                    className="winxp-input w-full text-xs"
                    disabled={slides.length >= 8}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                    Etiqueta (Badge):
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ej. NUEVA COLECCIÓN, REBAJAS, DROP LIMITADO"
                    className="winxp-input w-full text-xs"
                    disabled={slides.length >= 8}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={slides.length >= 8}
                    className="winxp-button winxp-button-primary text-xs py-1 px-3 font-bold text-blue-900 flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar al Carrusel ({slides.length}/8)</span>
                  </button>

                  <select
                    value={autoPlayInterval}
                    onChange={(e) => setAutoPlayInterval(Number(e.target.value))}
                    className="winxp-input text-[11px] py-1"
                    title="Velocidad del movimiento automático"
                  >
                    <option value={3000}>Velocidad: 3s</option>
                    <option value={4500}>Velocidad: 4.5s (Recomendada)</option>
                    <option value={6000}>Velocidad: 6s</option>
                    <option value={8000}>Velocidad: 8s</option>
                  </select>
                </div>
              </form>

              {/* Lista de diapositivas actuales con opción de eliminar */}
              <div className="md:col-span-7 bg-white p-2.5 border border-gray-400 winxp-bevel-out space-y-1.5">
                <div className="font-bold text-gray-900 text-[11px] pb-1 border-b border-gray-200 flex items-center justify-between">
                  <span>Imágenes en Rotación ({slides.length} de 8 disponibles)</span>
                  <span className="text-[10px] text-gray-500 font-normal">
                    Se mueven automáticamente en bucle
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {slides.map((s, index) => (
                    <div
                      key={s.id}
                      className={`p-1.5 border flex items-center justify-between gap-2 text-[11px] ${
                        index === currentIndex
                          ? 'bg-blue-50 border-blue-400 font-bold'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-gray-500 text-[10px] w-4 shrink-0">#{index + 1}</span>
                        <img
                          src={s.imageUrl}
                          alt={s.title}
                          className="w-10 h-7 object-cover border border-gray-400 shrink-0"
                        />
                        <div className="truncate">
                          <div className="truncate text-gray-900 font-semibold">{s.title}</div>
                          <div className="text-[10px] text-gray-500 truncate">{s.imageUrl}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setCurrentIndex(index)}
                          className="winxp-button text-[10px] py-0.5 px-1.5"
                          title="Mostrar esta diapositiva ahora"
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlide(s.id)}
                          className="winxp-button text-[10px] py-0.5 px-1.5 text-red-700 hover:bg-red-50"
                          title="Eliminar imagen"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Barra de Estado inferior del carrusel */}
        <div className="winxp-statusbar px-3 py-1 bg-[#ece9d8] border-t border-[#707070] flex items-center justify-between text-[11px] text-gray-700 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span>ESTADO: ROTACIÓN AUTOMÁTICA ACTIVA</span>
          </div>
          <div className="font-mono text-[10px] text-gray-600">
            {slides.length} DE 8 IMÁGENES PROGRAMADAS // VELOCIDAD: {autoPlayInterval / 1000}s
          </div>
        </div>
      </div>
    </div>
  );
};
