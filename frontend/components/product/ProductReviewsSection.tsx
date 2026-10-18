import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MessageSquare,
  ThumbsUp,
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { Review, Product } from '../../types';
import { PixelIcon } from '../common/PixelIcon';
import { useAuth } from '../../context/AuthContext';

interface ProductReviewsSectionProps {
  product: Product;
  initialReviews: Review[];
}

type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1';
type ContentTypeFilter = 'all' | 'with_images' | 'comments_only';

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  initialReviews,
}) => {
  const { currentUser } = useAuth();
  const storageKey = `nolimits_reviews_${product.id}`;

  // Clave de almacenamiento de reseñas marcadas como "Útil" por el usuario
  const userId = currentUser?.id || 'guest';
  const userLikedStorageKey = `nolimits_liked_reviews_${userId}`;

  const [userLikedReviewIds, setUserLikedReviewIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(userLikedStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Guardar likes del usuario en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(userLikedStorageKey, JSON.stringify(userLikedReviewIds));
    } catch {
      // ignore
    }
  }, [userLikedReviewIds, userLikedStorageKey]);

  // Sincronizar cuando cambia el usuario activo
  useEffect(() => {
    try {
      const saved = localStorage.getItem(userLikedStorageKey);
      if (saved) {
        setUserLikedReviewIds(JSON.parse(saved));
      } else {
        setUserLikedReviewIds([]);
      }
    } catch {
      setUserLikedReviewIds([]);
    }
  }, [userLikedStorageKey]);

  // Carga de reseñas combinando mockData y las subidas localmente por el cliente (sin saltos de línea)
  const sanitizeCommentText = (text: string) =>
    (text || '').replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, 600);

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userUploaded = parsed
            .filter((r: Review) => r.id.startsWith('rev_user_'))
            .map((r: Review) => ({ ...r, comment: sanitizeCommentText(r.comment) }));
          const mergedInitial = initialReviews.map((initR) => {
            const found = parsed.find((p: Review) => p.id === initR.id);
            const likes = found?.likes ?? initR.likes;
            return {
              ...initR,
              comment: sanitizeCommentText(initR.comment),
              likes,
            };
          });
          return [...userUploaded, ...mergedInitial];
        }
      }
    } catch {
      // ignore
    }
    return initialReviews.map((r) => ({
      ...r,
      comment: sanitizeCommentText(r.comment),
    }));
  });

  // Guardar en localStorage cuando cambian las reseñas
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews, storageKey]);

  // Estados de Filtros según la imagen de referencia (filtro de reseñas ejemplo.png)
  const [selectedRating, setSelectedRating] = useState<RatingFilter>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estados para el formulario de Nueva Reseña con subida de fotos reales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para Visor / Lightbox con navegación entre imágenes de la reseña
  interface LightboxState {
    photos: string[];
    currentIndex: number;
    userName: string;
  }
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = (review: Review, startIndex: number) => {
    if (!review.photos || review.photos.length === 0) return;
    setLightbox({
      photos: review.photos,
      currentIndex: startIndex,
      userName: review.userName,
    });
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightbox || lightbox.photos.length <= 1) return;
    setLightbox((prev) => {
      if (!prev) return null;
      const nextIndex =
        prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.photos.length - 1;
      return { ...prev, currentIndex: nextIndex };
    });
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightbox || lightbox.photos.length <= 1) return;
    setLightbox((prev) => {
      if (!prev) return null;
      const nextIndex =
        prev.currentIndex < prev.photos.length - 1 ? prev.currentIndex + 1 : 0;
      return { ...prev, currentIndex: nextIndex };
    });
  };

  // Soporte de navegación con teclas de flecha y Escape
  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  // Cerrar el dropdown al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Conteos dinámicos para los botones de filtro
  const countWithImages = reviews.filter((r) => r.photos && r.photos.length > 0).length;
  const countCommentsOnly = reviews.filter((r) => (!r.photos || r.photos.length === 0) && r.comment?.trim().length > 0).length;

  // Filtrado de reseñas
  const filteredReviews = reviews.filter((rev) => {
    // 1. Filtro por estrellas
    if (selectedRating !== 'all') {
      const targetStar = parseInt(selectedRating, 10);
      if (rev.rating !== targetStar) return false;
    }

    // 2. Filtro por tipo de contenido (con fotos o solo comentarios)
    if (contentTypeFilter === 'with_images') {
      if (!rev.photos || rev.photos.length === 0) return false;
    } else if (contentTypeFilter === 'comments_only') {
      if (rev.photos && rev.photos.length > 0) return false;
      if (!rev.comment || rev.comment.trim().length === 0) return false;
    }

    return true;
  });

  // Manejo de carga de archivos reales del cliente (máximo 10 fotos)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      alert('Has alcanzado el límite máximo permitido de 10 fotografías.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const filesArray = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      alert(`Solo puedes adjuntar hasta 10 fotos en total. Se cargarán las primeras ${remainingSlots} imagen(es).`);
    }

    setIsUploading(true);
    const newPhotosArray: string[] = [];
    let filesProcessed = 0;

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotosArray.push(event.target.result as string);
        }
        filesProcessed += 1;
        if (filesProcessed === filesArray.length) {
          setUploadedPhotos((prev) => [...prev, ...newPhotosArray].slice(0, 10));
          setIsUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Enviar reseña (sin saltos de línea y hasta 600 caracteres)
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedComment = newComment
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .slice(0, 600);
    if (!sanitizedComment) return;

    const newRev: Review = {
      id: `rev_user_${Date.now()}`,
      productId: product.id,
      userId: currentUser?.id || 'guest_user',
      userName: authorName.trim() || 'Cliente',
      rating: newRating,
      title: newTitle.replace(/[\r\n]+/g, ' ').trim() || 'Valoración de Prenda',
      comment: sanitizedComment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      photos: [...uploadedPhotos],
      likes: 0,
      branchPurchased: 'Viña del Mar',
    };

    setReviews((prev) => [newRev, ...prev]);
    setNewComment('');
    setNewTitle('');
    setUploadedPhotos([]);
    setFormSuccessMessage(true);

    setTimeout(() => {
      setFormSuccessMessage(false);
      setIsFormOpen(false);
    }, 2000);
  };

  // Seleccionar / Deseleccionar voto de "Útil" por usuario
  const handleToggleLikeReview = (revId: string) => {
    const isAlreadyLiked = userLikedReviewIds.includes(revId);

    if (isAlreadyLiked) {
      // Deseleccionar: quitar de userLikedReviewIds y decrementar likes en 1 (mínimo 0)
      setUserLikedReviewIds((prev) => prev.filter((id) => id !== revId));
      setReviews((prev) =>
        prev.map((r) => (r.id === revId ? { ...r, likes: Math.max(0, r.likes - 1) } : r))
      );
    } else {
      // Seleccionar: agregar a userLikedReviewIds e incrementar likes en 1
      setUserLikedReviewIds((prev) => [...prev, revId]);
      setReviews((prev) =>
        prev.map((r) => (r.id === revId ? { ...r, likes: r.likes + 1 } : r))
      );
    }
  };

  // Etiquetas para el dropdown
  const ratingLabels: Record<RatingFilter, string> = {
    all: 'Todas las valoraciones',
    '5': '5 estrella',
    '4': '4 estrella',
    '3': '3 estrella',
    '2': '2 estrella',
    '1': '1 estrella',
  };

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="mt-8 pt-6 border-t-2 border-gray-300 space-y-4 font-sans">
      {/* Encabezado General */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-blue-900 flex items-center gap-2">
              <PixelIcon name="notepad" size={16} />
              <span>Comentarios y Valoraciones de Clientes</span>
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-300">
              {reviews.length} opiniones
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <div className="flex text-amber-500 text-sm">
              {'★'.repeat(Math.round(Number(averageRating)))}
              <span className="text-gray-300">
                {'★'.repeat(5 - Math.round(Number(averageRating)))}
              </span>
            </div>
            <span className="font-bold text-gray-800">{averageRating} de 5.0</span>
            <span className="text-gray-400">|</span>
            <span>{countWithImages} fotos reales de clientes</span>
          </div>
        </div>

        {/* Botón para Abrir Formulario de Subida de Reseña */}
        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="winxp-button winxp-button-primary text-xs py-1.5 px-3.5 font-bold text-blue-900 flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Camera className="w-4 h-4 text-blue-700" />
          <span>{isFormOpen ? 'Cerrar Formulario' : 'Escribir Reseña & Subir Fotos'}</span>
        </button>
      </div>

      {/* =========================================================================
          BARRA DE FILTROS (DISEÑADA IDÉNTICA A LA IMAGEN: filtro de reseñas ejemplo.png)
          ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
        {/* 1. Selector Dropdown de Valoraciones ("Todas las valoraciones ⌵" en Azul) */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xs border transition-colors shadow-xs ${
              selectedRating !== 'all'
                ? 'bg-blue-50 text-blue-700 border-blue-500 ring-1 ring-blue-300'
                : 'bg-white text-blue-700 hover:bg-blue-50/70 border-gray-300'
            }`}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <span>{ratingLabels[selectedRating]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-600 transition-transform duration-150" />
          </button>

          {/* Menú desplegable */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-1 w-44 rounded-xs bg-white shadow-lg border border-gray-300 py-1 z-30 animate-fadeIn">
              {(['all', '5', '4', '3', '2', '1'] as RatingFilter[]).map((filterKey) => {
                const isCurrent = selectedRating === filterKey;
                return (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => {
                      setSelectedRating(filterKey);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      isCurrent
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-gray-800 hover:bg-blue-50/50 hover:text-blue-900'
                    }`}
                  >
                    <span>
                      {filterKey === 'all' ? 'All ratings' : `${filterKey} estrella`}
                    </span>
                    {filterKey !== 'all' && (
                      <span className="text-[10px] text-gray-400">
                        (
                        {
                          reviews.filter((r) => r.rating === parseInt(filterKey, 10))
                            .length
                        }
                        )
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Botón Filtro: [ 🖼️ (count) ] Reseñas con Imágenes */}
        <button
          type="button"
          onClick={() =>
            setContentTypeFilter((prev) =>
              prev === 'with_images' ? 'all' : 'with_images'
            )
          }
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-xs transition-colors shadow-xs ${
            contentTypeFilter === 'with_images'
              ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-400'
              : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
          }`}
          title="Ver solo reseñas con fotografías de clientes"
        >
          <ImageIcon className="w-4 h-4 text-gray-700" />
          <span>({countWithImages})</span>
        </button>

        {/* 3. Botón Filtro: [ 💬 (count) ] Reseñas con solo Comentarios */}
        <button
          type="button"
          onClick={() =>
            setContentTypeFilter((prev) =>
              prev === 'comments_only' ? 'all' : 'comments_only'
            )
          }
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-xs transition-colors shadow-xs ${
            contentTypeFilter === 'comments_only'
              ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-400'
              : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
          }`}
          title="Ver solo reseñas con comentarios sin fotos"
        >
          <MessageSquare className="w-4 h-4 text-gray-700" />
          <span>({countCommentsOnly})</span>
        </button>

        {/* Botón de Limpiar filtros (estilo Windows XP retro y pulido) */}
        {(selectedRating !== 'all' || contentTypeFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSelectedRating('all');
              setContentTypeFilter('all');
            }}
            className="winxp-button text-xs py-1 px-2.5 flex items-center gap-1.5 text-gray-700 hover:text-blue-900 font-semibold transition-all shadow-xs"
            title="Restablecer todos los filtros de valoraciones"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-700" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          FORMULARIO INTERACTIVO: CARGA DE RESEÑA CON FOTOS REALES DEL CLIENTE
          ========================================================================= */}
      {isFormOpen && (
        <div className="bg-blue-50/70 border-2 border-[#7eaadb] winxp-bevel-in p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                Publicar Valoración con Fotografías Reales
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-gray-500 hover:text-red-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {formSuccessMessage ? (
            <div className="p-3 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2 rounded-xs">
              <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
              <div>
                <strong>¡Gracias por tu valoración!</strong> Tu reseña y fotografías se
                han guardado y ya están visibles para la comunidad.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nombre del autor */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">
                    Tu Nombre o Apodo:
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ej. Valeria Neo-Goth / Matías"
                    className="winxp-input w-full text-xs py-1 px-2"
                    required
                  />
                </div>

                {/* Calificación en estrellas */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">
                    Calificación general:
                  </label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setNewRating(starVal)}
                        className="text-lg transition-transform hover:scale-110 focus:outline-hidden"
                      >
                        <span
                          className={
                            starVal <= newRating ? 'text-amber-500' : 'text-gray-300'
                          }
                        >
                          ★
                        </span>
                      </button>
                    ))}
                    <span className="text-xs text-gray-600 font-bold ml-2">
                      {newRating} de 5 estrellas
                    </span>
                  </div>
                </div>
              </div>

              {/* Título de la reseña */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 block">
                    Título de la Opinión:
                  </label>
                  <span className={`text-[10px] font-mono ${newTitle.length >= 100 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                    {newTitle.length}/100 caracteres
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={100}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value.replace(/[\r\n]+/g, ' ').slice(0, 100))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  placeholder="Ej. Calce perfecto y excelente peso del algodón (máx. 100 caracteres)"
                  className="winxp-input w-full text-xs py-1 px-2"
                  required
                />
              </div>

              {/* Comentario (sin saltos de línea, límite de 600 caracteres) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span>Comentario / Experiencia con la prenda:</span>
                    <span className="font-normal text-[10px] text-gray-500">
                      (sin saltos de línea)
                    </span>
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      newComment.length >= 600 ? 'text-red-600 font-bold' : 'text-gray-500'
                    }`}
                  >
                    {newComment.length}/600 caracteres
                  </span>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) =>
                    setNewComment(e.target.value.replace(/[\r\n]+/g, ' ').slice(0, 600))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasteText = e.clipboardData.getData('text');
                    const cleanPaste = pasteText.replace(/[\r\n]+/g, ' ');
                    const target = e.currentTarget;
                    const start = target.selectionStart || 0;
                    const end = target.selectionEnd || 0;
                    const nextVal = (
                      newComment.slice(0, start) +
                      cleanPaste +
                      newComment.slice(end)
                    )
                      .replace(/[\r\n]+/g, ' ')
                      .slice(0, 600);
                    setNewComment(nextVal);
                  }}
                  maxLength={600}
                  placeholder="Cuéntale a otros compradores cómo te quedó la talla, la caída de la tela... (texto continuo sin saltos de línea, máx. 600 caracteres)"
                  rows={3}
                  className="winxp-input w-full text-xs p-2"
                  required
                />
              </div>

              {/* CARGA DE FOTOGRAFÍAS REALES DEL CLIENTE */}
              <div className="space-y-2 bg-white border border-gray-300 p-2.5 winxp-bevel-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-700" />
                    <span>Fotografías reales de la prenda (Opcional):</span>
                  </label>
                  <span className="text-[10px] text-gray-500">
                    Sube fotos desde tu dispositivo (JPG, PNG, WebP)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="client-photo-upload"
                  />
                  <label
                    htmlFor="client-photo-upload"
                    className="winxp-button text-xs py-1 px-3 cursor-pointer flex items-center gap-1.5 text-gray-800 font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-700" />
                    <span>Seleccionar fotos del dispositivo...</span>
                  </label>

                  {isUploading && (
                    <span className="text-xs text-blue-700 animate-pulse font-medium">
                      Procesando imágenes...
                    </span>
                  )}
                </div>

                {/* Previsualización de imágenes cargadas */}
                {uploadedPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                    {uploadedPhotos.map((photoData, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 border border-gray-400 bg-black/5 rounded-xs overflow-hidden group"
                      >
                        <img
                          src={photoData}
                          alt={`Carga ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow hover:bg-red-700"
                          title="Eliminar foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón de Enviar */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="winxp-button text-xs py-1.5 px-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900"
                >
                  Publicar Valoración
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* =========================================================================
          GRILLA DE RESEÑAS FILTRADAS
          ========================================================================= */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white p-6 border border-gray-300 winxp-bevel-in text-center space-y-2">
          <div className="text-gray-400">
            <PixelIcon name="info" size={24} />
          </div>
          <h4 className="font-bold text-gray-800 text-xs">
            No se encontraron reseñas con los filtros seleccionados
          </h4>
          <p className="text-[11px] text-gray-600">
            Prueba seleccionando "Todas las valoraciones" o sé el primero en subir una foto real.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedRating('all');
              setContentTypeFilter('all');
            }}
            className="winxp-button text-xs py-1 px-3 mt-1 text-blue-900 font-bold"
          >
            Ver todas las reseñas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-w-0">
          {filteredReviews.map((rev) => (
            <ReviewCardItem
              key={rev.id}
              rev={rev}
              isLiked={userLikedReviewIds.includes(rev.id)}
              onOpenLightbox={openLightbox}
              onLikeReview={handleToggleLikeReview}
            />
          ))}
        </div>
      )}

      {/* =========================================================================
          LIGHTBOX / MODAL PARA VER FOTO REAL AMPLIADA EN ALTA RESOLUCIÓN
          CON FLECHAS BLANCAS SEMITRANSPARENTES Y CONTADOR DE IMÁGENES EN TEXTO BLANCO
          Y LÍMITES RESPONSIVOS DE ALTURA PARA IMÁGENES MUY ALTAS
          ========================================================================= */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 pt-14 pb-12 animate-fadeIn select-none overflow-hidden"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[calc(100vh-7rem)] bg-white p-2 border-2 border-gray-400 winxp-bevel-out shadow-2xl flex flex-col rounded-xs overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de título estilo Windows XP */}
            <div className="winxp-titlebar flex items-center justify-between p-1.5 mb-1.5 select-none shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-white font-bold truncate">
                <PixelIcon name="paint" size={14} />
                <span className="truncate">
                  Visor_Fotografia_Cliente.exe - [{lightbox.userName}]
                  {lightbox.photos.length > 1 &&
                    ` (Foto ${lightbox.currentIndex + 1} de ${lightbox.photos.length})`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="winxp-control-btn close text-white shrink-0 ml-2"
                aria-label="Cerrar"
                title="Cerrar Visor (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Contenedor de la Imagen con Flechas Blancas Semitransparentes y Contención Responsiva */}
            <div className="relative flex-1 min-h-0 overflow-hidden flex items-center justify-center bg-black/15 border border-gray-300 winxp-bevel-in select-none p-1">
              <img
                src={lightbox.photos[lightbox.currentIndex]}
                alt={`Fotografía ${lightbox.currentIndex + 1} de ${lightbox.userName}`}
                className="w-auto h-auto max-w-full max-h-[46vh] sm:max-h-[50vh] object-contain block mx-auto select-none transition-all duration-150"
              />

              {/* Botones de Flechas Blancas Semitransparentes (visibles cuando la reseña tiene más de 1 imagen) */}
              {lightbox.photos.length > 1 && (
                <>
                  {/* Flecha Anterior (Izquierda) - Blanca y semitransparente */}
                  <button
                    type="button"
                    data-force-white="true"
                    onClick={handlePrevPhoto}
                    className="review-img-arrow absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/80 !text-white text-white p-2 sm:p-2.5 rounded-full backdrop-blur-xs border border-white/35 shadow-lg transition-all z-20 cursor-pointer active:scale-90"
                    style={{ color: '#ffffff', stroke: '#ffffff' }}
                    aria-label="Ver imagen anterior"
                    title="Ver imagen anterior (←)"
                  >
                    <ChevronLeft
                      className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] !text-white !stroke-white text-white"
                      style={{ color: '#ffffff', stroke: '#ffffff' }}
                    />
                  </button>

                  {/* Flecha Siguiente (Derecha) - Blanca y semitransparente */}
                  <button
                    type="button"
                    data-force-white="true"
                    onClick={handleNextPhoto}
                    className="review-img-arrow absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/80 !text-white text-white p-2 sm:p-2.5 rounded-full backdrop-blur-xs border border-white/35 shadow-lg transition-all z-20 cursor-pointer active:scale-90"
                    style={{ color: '#ffffff', stroke: '#ffffff' }}
                    aria-label="Ver siguiente imagen"
                    title="Ver siguiente imagen (→)"
                  >
                    <ChevronRight
                      className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] !text-white !stroke-white text-white"
                      style={{ color: '#ffffff', stroke: '#ffffff' }}
                    />
                  </button>

                  {/* Indicador de posición flotante semitransparente con TEXTO BLANCO (ej. 1/3 o 2/3) */}
                  <div
                    data-force-white="true"
                    className="review-img-counter absolute top-2 right-2 bg-black/60 !text-white text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-white/25 backdrop-blur-xs z-20 shadow-sm"
                    style={{ color: '#ffffff' }}
                  >
                    {lightbox.currentIndex + 1} / {lightbox.photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Tira de miniaturas para navegar rápido si hay más de 1 foto */}
            {lightbox.photos.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-1.5 pb-1 overflow-x-auto shrink-0">
                {lightbox.photos.map((thumbUrl, thumbIdx) => (
                  <button
                    key={thumbIdx}
                    type="button"
                    onClick={() =>
                      setLightbox((prev) =>
                        prev ? { ...prev, currentIndex: thumbIdx } : null
                      )
                    }
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xs overflow-hidden border transition-all shrink-0 ${
                      lightbox.currentIndex === thumbIdx
                        ? 'border-blue-600 ring-2 ring-blue-400 scale-105'
                        : 'border-gray-400 opacity-60 hover:opacity-100'
                    }`}
                    title={`Ir a imagen ${thumbIdx + 1}`}
                  >
                    <img
                      src={thumbUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Pie del Visor */}
            <div className="pt-1.5 flex items-center justify-between text-xs text-gray-700 shrink-0 border-t border-gray-200 mt-1">
              <span className="italic text-[10px] sm:text-[11px] text-gray-600 truncate mr-2">
                {lightbox.photos.length > 1
                  ? 'Navega con flechas en pantalla o teclas ← →'
                  : 'Fotografía real del cliente ajustada a pantalla'}
              </span>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="winxp-button text-xs py-1 px-3 font-semibold text-gray-800 shrink-0"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// SUBCOMPONENTE DE TARJETA DE RESEÑA INDIVIDUAL
// Muestra cuadros de fotos reales con indicador blanco (ej. 1/3, 2/3) y click para ampliar
// =========================================================================
interface ReviewCardItemProps {
  rev: Review;
  isLiked: boolean;
  onOpenLightbox: (review: Review, startIndex: number) => void;
  onLikeReview: (id: string) => void;
}

const ReviewCardItem: React.FC<ReviewCardItemProps> = ({
  rev,
  isLiked,
  onOpenLightbox,
  onLikeReview,
}) => {
  const totalPhotos = rev.photos?.length || 0;

  return (
    <div className="p-3 bg-gray-50 border border-gray-300 text-xs space-y-2 winxp-bevel-out flex flex-col justify-between overflow-hidden min-w-0">
      <div className="space-y-1.5 min-w-0 overflow-hidden">
        {/* Cabecera del comentario */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-bold text-gray-900 truncate min-w-0">{rev.userName}</span>
          <span className="text-[10px] text-gray-500 shrink-0">{rev.date}</span>
        </div>

        {/* Estrellas y Título */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex text-amber-500 text-xs shrink-0">
            {'★'.repeat(rev.rating)}
            <span className="text-gray-300">
              {'★'.repeat(5 - rev.rating)}
            </span>
          </div>
          {rev.title && (
            <span className="font-bold text-gray-800 text-xs truncate min-w-0">
              {rev.title}
            </span>
          )}
        </div>

        {/* Texto del comentario (sin saltos de línea, máx. 600 caracteres y ajuste de palabras) */}
        <p className="text-gray-700 leading-relaxed text-[11px] break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-normal">
          {rev.comment.replace(/[\r\n]+/g, ' ').slice(0, 600)}
        </p>

        {/* Galería de Fotografías Reales Subidas por el Cliente (Cuadros de fotos) */}
        {totalPhotos > 0 && (
          <div className="pt-1 space-y-1">
            <div className="text-[10px] font-bold text-gray-600 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3 text-blue-700" />
                <span>Fotos reales del cliente ({totalPhotos}):</span>
              </span>
            </div>

            {/* Cuadros de fotos: con indicador numérico blanco y clic para ver en visor ampliado */}
            <div className="flex flex-wrap gap-1.5">
              {rev.photos!.map((photoUrl, photoIdx) => (
                <button
                  key={photoIdx}
                  type="button"
                  onClick={() => onOpenLightbox(rev, photoIdx)}
                  className="relative w-16 h-16 border border-gray-400 rounded-xs overflow-hidden group bg-black/5 hover:ring-2 hover:ring-blue-500 transition-all cursor-zoom-in"
                  title={`Click para ampliar fotografía ${photoIdx + 1} de ${totalPhotos}`}
                >
                  <img
                    src={photoUrl}
                    alt={`Foto real de ${rev.userName}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2
                      className="w-3.5 h-3.5 drop-shadow text-white stroke-white"
                      style={{ color: '#ffffff', stroke: '#ffffff' }}
                    />
                  </div>
                  {totalPhotos > 1 && (
                    <span
                      data-force-white="true"
                      className="review-img-counter absolute bottom-0.5 right-0.5 bg-black/75 !text-white text-white text-[9px] px-1 font-mono font-bold rounded-xs shadow-xs"
                      style={{ color: '#ffffff' }}
                    >
                      {photoIdx + 1}/{totalPhotos}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pie de la tarjeta: Botón Útil (Seleccionable y deseleccionable por usuario) */}
      <div className="flex items-center justify-end pt-2 border-t border-gray-200 text-[10px] text-gray-500 mt-2">
        <button
          type="button"
          onClick={() => onLikeReview(rev.id)}
          className={`flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded cursor-pointer transition-all active:scale-95 border ${
            isLiked
              ? 'bg-blue-100 text-blue-900 border-blue-400 font-bold shadow-xs'
              : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50/80 border-transparent'
          }`}
          title={isLiked ? 'Quitar mi voto de útil (clic para deseleccionar)' : 'Marcar reseña como útil'}
          aria-pressed={isLiked}
        >
          <ThumbsUp
            className={`w-3.5 h-3.5 transition-transform ${
              isLiked ? 'text-blue-700 fill-blue-600 scale-110' : 'text-blue-600'
            }`}
          />
          <span>¿Útil? ({rev.likes})</span>
        </button>
      </div>
    </div>
  );
};
