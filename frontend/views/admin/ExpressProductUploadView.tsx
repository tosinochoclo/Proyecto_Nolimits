import React, { useState } from 'react';
import {
  UploadCloud,
  Zap,
  CheckCircle2,
  Trash2,
  EyeOff,
  Star,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { useBranch } from '../../context/BranchContext';
import { api } from '../../services/api';

export const ExpressProductUploadView: React.FC = () => {
  const { branches } = useBranch();

  // Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [category, setCategory] = useState('Polerones & Hoodies');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [tags, setTags] = useState('Live Drop, Y2K');
  const [isHidden, setIsHidden] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [allowStorePickup, setAllowStorePickup] = useState(true);
  const [enabledBranches, setEnabledBranches] = useState<string[]>(['vina_del_mar', 'valparaiso', 'quilpue']);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'
  ]);

  const [publishedList, setPublishedList] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleBranch = (branchId: string) => {
    setEnabledBranches((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  const handleSimulateAddImage = () => {
    if (images.length >= 10) return;
    const samplePool = [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'
    ];
    const picked = samplePool[images.length % samplePool.length];
    setImages([...images, picked]);
  };

  const handlePublishExpress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const newProd = await api.createProductExpress({
      title,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      category,
      description,
      totalStock: Number(quantity) || 1,
      tags: tags.split(',').map((t) => t.trim()),
      images,
      isHidden,
      isFeatured,
      allowStorePickup,
      branchesEnabled: enabledBranches
    });

    setPublishedList([newProd, ...publishedList]);
    setSuccessMessage(`✓ ¡Prenda "${title}" subida y disponible para el Live Stream!`);

    // Reset fields
    setTitle('');
    setPrice('');
    setSalePrice('');
    setDescription('');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-4 font-sans text-gray-900">
      <WindowFrame
        title="EXPRESS_UPLOAD_ENGINE.SYS - [Publicador Ultrarrápido de Prendas]"
        icon={<PixelIcon name="paint" size={16} />}
        statusBarText="TARGET: 20 PRENDAS EN < 5 MIN // CLOUDINARY CDN // SINCRONIZACIÓN AUTOMÁTICA"
      >
        <div className="space-y-4">
          {/* Banner Superior Estilo Barra de Herramientas Windows XP */}
          <div className="bg-[#f0f4f8] border border-gray-400 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-xs text-[#003c74]">
                  MÓDULO DE CARGA EXPRESS PARA TRANSMISIONES EN VIVO
                </h3>
                <p className="text-[11px] text-gray-600">
                  Prendas publicadas en esta sesión:{' '}
                  <strong className="text-blue-900 font-bold">{publishedList.length} / 20 prendas</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-700 bg-white border border-gray-300 px-2 py-1">
              <Clock className="w-3.5 h-3.5 text-blue-700" />
              <span className="font-semibold">Tiempo Estimado: Inmediato (&lt; 30 seg)</span>
            </div>
          </div>

          {successMessage && (
            <div className="p-2.5 bg-green-100 border border-green-500 text-green-900 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Formulario de Carga en 2 Columnas (Fondo Blanco Limpio) */}
          <form onSubmit={handlePublishExpress} className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
            {/* Columna Izquierda: Datos de la Prenda */}
            <div className="lg:col-span-7 space-y-3 bg-[#f8fafc] border border-gray-300 p-3.5">
              <div className="space-y-1">
                <label className="font-bold text-gray-800">
                  Título de la Prenda (Stock Único):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cyber Tribal Vintage Zip Hoodie #04"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full winxp-input text-xs py-1"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-gray-800">Precio Normal ($ CLP):</label>
                  <input
                    type="number"
                    required
                    placeholder="45990"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full winxp-input text-xs py-1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-red-700">Precio Live Drop ($):</label>
                  <input
                    type="number"
                    placeholder="38990 (Opcional)"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full winxp-input text-xs py-1 font-bold text-red-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-800">Cantidad (Stock):</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full winxp-input text-xs py-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-gray-800">Categoría:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full winxp-input text-xs py-1 cursor-pointer"
                  >
                    <option value="Polerones & Hoodies">Polerones & Hoodies</option>
                    <option value="Pantalones & Cargos">Pantalones & Cargos</option>
                    <option value="Poleras & Tops">Poleras & Tops</option>
                    <option value="Accesorios & Joyería">Accesorios & Joyería</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-800">Etiquetas (separadas por coma):</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Live Stream, Oversize, Y2K"
                    className="w-full winxp-input text-xs py-1"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-800">Descripción & Especificaciones:</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de tela, corte, estado físico y medidas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full winxp-input text-xs py-1"
                />
              </div>

              {/* Casillas de Verificación estilo Windows XP */}
              <div className="bg-white border border-gray-300 p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                  <input
                    type="checkbox"
                    checked={isHidden}
                    onChange={(e) => setIsHidden(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div>
                    <span className="font-bold text-xs flex items-center gap-1">
                      <EyeOff className="w-3 h-3 text-amber-600" /> Estado Oculto
                    </span>
                    <span className="text-[10px] text-gray-500 block">Solo visible para el admin</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div>
                    <span className="font-bold text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" /> Producto Destacado
                    </span>
                    <span className="text-[10px] text-gray-500 block">Fijar en catálogo inicial</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Columna Derecha: Fotos y Sucursales */}
            <div className="lg:col-span-5 space-y-3 bg-[#f8fafc] border border-gray-300 p-3.5">
              {/* Fotos */}
              <div className="bg-white border border-gray-300 p-2.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-800">Fotos de la Prenda (Máx 10):</span>
                  <span className="text-blue-900 font-bold">{images.length} / 10 fotos</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square border border-gray-400 overflow-hidden group">
                      <img src={img} alt={`Prenda ${i}`} className="w-full h-full object-cover" />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {images.length < 10 && (
                    <button
                      type="button"
                      onClick={handleSimulateAddImage}
                      className="aspect-square border border-dashed border-blue-500 bg-blue-50/50 flex flex-col items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors"
                      title="Agregar fotografía"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span className="text-[10px] font-bold mt-0.5">+ Foto</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sucursales Habilitadas */}
              <div className="bg-white border border-gray-300 p-2.5 space-y-1.5">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>Sucursales con Stock Físico:</span>
                </div>
                <div className="space-y-1">
                  {branches.map((b) => (
                    <label key={b.id} className="flex items-center gap-2 cursor-pointer text-gray-800">
                      <input
                        type="checkbox"
                        checked={enabledBranches.includes(b.id)}
                        onChange={() => toggleBranch(b.id)}
                        className="w-3.5 h-3.5 accent-blue-600"
                      />
                      <span className="text-[11px] font-semibold">{b.name} ({b.city})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Retiro Físico Inmediato */}
              <label className="flex items-center gap-2 p-2 bg-white border border-gray-300 text-gray-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={allowStorePickup}
                  onChange={(e) => setAllowStorePickup(e.target.checked)}
                  className="w-3.5 h-3.5 accent-blue-600"
                />
                <span className="font-semibold">Habilitar retiro físico inmediato en tienda sin costo</span>
              </label>

              {/* Botón Principal de Publicar */}
              <button
                type="submit"
                className="winxp-button winxp-button-primary text-xs py-2 w-full font-bold text-blue-900 shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-600 inline mr-1" />
                <span>PUBLICAR PRENDA EN VIVO</span>
              </button>
            </div>
          </form>
        </div>
      </WindowFrame>
    </div>
  );
};
