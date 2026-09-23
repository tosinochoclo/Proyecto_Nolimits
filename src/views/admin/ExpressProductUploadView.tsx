import React, { useState } from 'react';
import {
  UploadCloud,
  Zap,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  EyeOff,
  Eye,
  Star,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelButton } from '../../components/common/PixelButton';
import { useBranch } from '../../context/BranchContext';
import { api } from '../../services/api';

export const ExpressProductUploadView: React.FC = () => {
  const { branches } = useBranch();

  // Speed-run timer to prove < 5 min capability
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

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

    // Reset fields for the next garment in the speed queue
    setTitle('');
    setPrice('');
    setSalePrice('');
    setDescription('');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <WindowFrame
        title="EXPRESS_UPLOAD_ENGINE.SYS - [Publicador Ultrarrápido de Prendas]"
        variant="lavender"
        statusBarText="TARGET: 20 PRENDAS EN < 5 MIN // CLOUDINARY CDN PIPELINE LISTO"
      >
        <div className="space-y-4">
          {/* Top Speed Banner */}
          <div className="bevel-chrome p-3.5 bg-gradient-to-r from-[#200d3d] via-[#100720] to-[#250d30] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
              <div>
                <h3 className="font-['Silkscreen'] text-sm text-white">
                  MÓDULO DE CARGA EXPRESS PARA TRANSMISIONES EN VIVO
                </h3>
                <p className="font-['Chakra_Petch'] text-xs text-slate-300">
                  Prendas publicadas en esta sesión:{' '}
                  <strong className="text-[#00d4ff] font-mono">{publishedList.length} / 20</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-['VT323'] text-lg text-slate-200">
              <Clock className="w-4 h-4 text-[#ff007f]" />
              <span>TIEMPO OPTIMIZADO: ULTRA-RAPID</span>
            </div>
          </div>

          {successMessage && (
            <div className="p-3 bevel-raised bg-green-950/90 border border-green-500 text-green-300 font-['Silkscreen'] text-xs text-center">
              {successMessage}
            </div>
          )}

          {/* Express Form */}
          <form onSubmit={handlePublishExpress} className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-['Chakra_Petch'] text-xs">
            {/* Col 1-7: Product Data */}
            <div className="lg:col-span-7 space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-200">Título de la Prenda (Stock Único):</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cyber Tribal Vintage Zip Hoodie #04"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bevel-sunken p-2.5 bg-black text-white focus:outline-none focus:border-[#ff007f] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Precio Normal ($ CLP):</label>
                  <input
                    type="number"
                    required
                    placeholder="45990"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#ff77b8]">Precio Live Drop ($):</label>
                  <input
                    type="number"
                    placeholder="38990 (Opcional)"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none border-b-2 border-b-[#ff007f]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Cantidad (Stock):</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Categoría:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Polerones & Hoodies">Polerones & Hoodies</option>
                    <option value="Pantalones & Cargos">Pantalones & Cargos</option>
                    <option value="Poleras & Tops">Poleras & Tops</option>
                    <option value="Accesorios & Joyería">Accesorios & Joyería</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Etiquetas (separadas por coma):</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Live Stream, Oversize, Y2K"
                    className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Descripción & Especificaciones:</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de tela, corte, estado físico y medidas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none"
                />
              </div>

              {/* Switches: Hidden status & Featured */}
              <div className="bevel-chrome p-3 bg-[#0d0a17] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isHidden}
                    onChange={(e) => setIsHidden(e.target.checked)}
                    className="accent-[#ff007f] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold flex items-center gap-1">
                      <EyeOff className="w-3.5 h-3.5 text-yellow-400" /> Estado Oculto
                    </span>
                    <span className="text-[10px] text-slate-400 block">Solo visible para el admin/streamer</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#00d4ff] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#00d4ff]" /> Producto Destacado
                    </span>
                    <span className="text-[10px] text-slate-400 block">Pin en portada de la tienda</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Col 8-12: Multi-photo Upload & Branch Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {/* Photo Upload Stage */}
              <div className="bevel-sunken p-3 bg-black/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-['Silkscreen'] text-white">FOTOS (MÁX 10):</span>
                  <span className="font-mono text-[#00d4ff]">{images.length} / 10 fotos</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square bevel-raised overflow-hidden group">
                      <img src={img} alt={`Prenda ${i}`} className="w-full h-full object-cover" />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                      className="aspect-square bevel-sunken border border-dashed border-[#7c3aed] flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-[#ff007f] transition-colors"
                    >
                      <UploadCloud className="w-5 h-5 text-[#ff007f]" />
                      <span className="text-[9px] font-['Silkscreen'] mt-1">+ FOTO</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Branch Selection Checkboxes */}
              <div className="bevel-sunken p-3 bg-black/60 space-y-2">
                <div className="font-['Silkscreen'] text-xs text-[#00d4ff] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>SUCURSALES HABILITADAS:</span>
                </div>
                <div className="space-y-1.5">
                  {branches.map((b) => (
                    <label key={b.id} className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={enabledBranches.includes(b.id)}
                        onChange={() => toggleBranch(b.id)}
                        className="accent-[#00d4ff]"
                      />
                      <span className="font-mono text-[11px]">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Allow Store Pickup */}
              <label className="flex items-center gap-2 bevel-sunken p-2.5 bg-black/40 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowStorePickup}
                  onChange={(e) => setAllowStorePickup(e.target.checked)}
                  className="accent-[#a855f7]"
                />
                <span>Habilitar retiro físico inmediato en tienda sin costo</span>
              </label>

              {/* Submit Button */}
              <PixelButton
                variant="primary"
                size="lg"
                type="submit"
                className="w-full py-3 text-sm"
              >
                PUBLICAR PRENDA EN VIVO
              </PixelButton>
            </div>
          </form>
        </div>
      </WindowFrame>
    </div>
  );
};
