import React, { useState, useEffect } from 'react';
import {
  Package,
  Heart,
  Award,
  Settings,
  RotateCcw,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  Check,
  Camera,
  Upload,
  Star,
  Trash2,
  Copy,
  Sparkles,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  Plus,
  Phone,
  HelpCircle,
  Calendar,
  User as UserIcon,
  Save,
  Image as ImageIcon,
  Lock
} from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { PixelIcon } from '../components/common/PixelIcon';
import { INITIAL_PRODUCTS } from '../services/mockData';
import { Link } from 'react-router-dom';

/**
 * Interfaz para las direcciones del usuario con soporte de predeterminada
 */
export interface UserAddress {
  id: string;
  alias: string;
  recipientName: string;
  street: string;
  number: string;
  apartment?: string;
  comuna: string;
  city: string;
  region: string;
  postalCode?: string;
  phone: string;
  notes?: string;
  isDefault: boolean;
}

/**
 * Interfaz para casos de Devolución con los 4 estados obligatorios
 */
export interface ReturnRequest {
  id: string;
  ticketNumber: string;
  orderNumber: string;
  productId: string;
  productTitle: string;
  productSize: string;
  productImage: string;
  reason: 'Cambio de Talla' | 'Falla de Fábrica' | 'Drop Insatisfecho' | 'Garantía Legal';
  requestedSize?: string;
  returnMethod: 'branch_dropoff' | 'courier_shipping';
  targetBranchId: string;
  targetBranchName: string;
  requestDate: string;
  currentStatus:
    | 'Solicitud recibida'
    | 'Revisión de equipo'
    | 'Aprobada'
    | 'Rechazada'
    | 'Envió a punto/sucursal';
  notes?: string;
  rejectionReason?: string;
  rejectionDate?: string;
  adminInspector?: string;
  photos?: string[];
}

/**
 * Interfaz para las reseñas ya realizadas por el usuario
 */
export interface UserPublishedReview {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productSize?: string;
  orderNumber: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  date: string;
  pointsEarned: number;
}

/**
 * Información oficial de horarios de atención física de sucursales
 */
export interface BranchScheduleInfo {
  id: string;
  name: string;
  city: string;
  address: string;
  scheduleWeekdays: string;
  scheduleSaturday: string;
  scheduleSunday: string;
  phone: string;
  whatsapp: string;
  leadContact: string;
  returnInstructions: string;
  badge: string;
}

export const BRANCH_PHYSICAL_SCHEDULES: BranchScheduleInfo[] = [
  {
    id: 'vina_del_mar',
    name: 'Sucursal Viña del Mar - Mall Marina Studio',
    city: 'Viña del Mar',
    address: 'Av. Libertad 1348, Local 204 (Segundo Nivel)',
    scheduleWeekdays: 'Lunes a Viernes: 10:30 a 19:30 hrs',
    scheduleSaturday: 'Sábados: 11:00 a 17:00 hrs',
    scheduleSunday: 'Domingos y Feriados: Cerrado',
    phone: '+56 9 8452 1190',
    whatsapp: '+56 9 8452 1190',
    leadContact: 'Sebastián Valdés (Store Lead)',
    returnInstructions: 'Presentar prenda con etiqueta original y N° de Ticket DEV o Boleta en mesón central.',
    badge: 'Tienda Matriz & Devolución Rápida'
  },
  {
    id: 'valparaiso',
    name: 'Sucursal Valparaíso - Puerto Cyber Lab',
    city: 'Valparaíso',
    address: 'Calle Prat 740, Nivel 1 (Frente a Plaza Sotomayor)',
    scheduleWeekdays: 'Lunes a Viernes: 11:00 a 19:00 hrs',
    scheduleSaturday: 'Sábados: 11:00 a 16:30 hrs',
    scheduleSunday: 'Domingos: Cerrado',
    phone: '+56 9 7312 9044',
    whatsapp: '+56 9 7312 9044',
    leadContact: 'Camila Rojas (Jefa de Sucursal)',
    returnInstructions: 'Módulo Express Drop-off para cambios de talla inmediatos y pruebas de calce.',
    badge: 'Hub Urbano Puerto'
  },
  {
    id: 'quilpue',
    name: 'Sucursal Quilpué - Centro Drop Hub',
    city: 'Quilpué',
    address: 'Los Carrera 880, Edificio Sol, Local 12',
    scheduleWeekdays: 'Lunes a Sábado: 10:00 a 20:00 hrs (Continuado)',
    scheduleSaturday: 'Sábados: 10:00 a 20:00 hrs',
    scheduleSunday: 'Domingos: 11:00 a 16:00 hrs',
    phone: '+56 9 6128 4402',
    whatsapp: '+56 9 6128 4402',
    leadContact: 'Martín Araya (Atención al Cliente)',
    returnInstructions: 'Punto oficial de recepción de prendas para inspección técnica y retiro de nueva prenda.',
    badge: 'Horario Extendido'
  }
];

/**
 * Interfaz para las órdenes de compra con la nomenclatura obligatoria de estados
 */
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  deliveryMethod: 'pickup' | 'shipping';
  branchName?: string; // Valparaíso, Viña del Mar, Quilpué
  branchId?: string;
  courier?: string; // Starken, Blue Express, Paket
  shippingAddress?: string;
  items: {
    productId: string;
    title: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  // Estados obligatorios según requerimiento
  currentStatus:
    | 'Solicitud recibida'
    | 'En Preparación'
    | 'En transito'
    | 'Listo para el retiro de sucursal'
    | 'Entregado'
    | 'Retirado';
}

/**
 * Cupones canjeables con Puntos NoLimits
 */
interface CouponItem {
  id: string;
  title: string;
  discountDescription: string;
  pointsCost: number;
  codePrefix: string;
  minPurchase?: string;
  badge: string;
}

const AVAILABLE_COUPONS: CouponItem[] = [
  {
    id: 'coup_3k',
    title: 'Cupón $3.000 CLP de Descuento',
    discountDescription: '$3.000 CLP aplicable al total de tu compra',
    pointsCost: 300,
    codePrefix: 'DROP3K',
    minPurchase: 'Sin monto mínimo',
    badge: 'Popular'
  },
  {
    id: 'coup_5k',
    title: 'Cupón $5.000 CLP de Descuento',
    discountDescription: '$5.000 CLP en compras sobre $25.000 CLP',
    pointsCost: 500,
    codePrefix: 'CYBER5K',
    minPurchase: 'Mínimo $25.000 CLP',
    badge: 'Más Canjeado'
  },
  {
    id: 'coup_10k',
    title: 'Cupón $10.000 CLP VIP Drop',
    discountDescription: '$10.000 CLP en compras sobre $40.000 CLP',
    pointsCost: 1000,
    codePrefix: 'NOLIMITS10K',
    minPurchase: 'Mínimo $40.000 CLP',
    badge: 'Premio Mayor'
  },
  {
    id: 'coup_freeship',
    title: 'Cupón Despacho Gratis Nacional',
    discountDescription: 'Envío gratuito a domicilio o sucursal en todo Chile',
    pointsCost: 350,
    codePrefix: 'FREESHIP',
    minPurchase: 'Válido para Starken y Blue Express',
    badge: 'Ahorro Envío'
  }
];

export const PRESET_AVATARS = [
  {
    id: 'cyber_girl',
    name: 'Cyberpunk Neon',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'streetwear_hoodie',
    name: 'Streetwear Void',
    url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'gothic_chrome',
    name: 'Gothic Chrome',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'matrix_hacker',
    name: 'Matrix Retro',
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'y2k_aesthetic',
    name: 'Y2K Street',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=80'
  }
];

export const ProfileView: React.FC = () => {
  const { currentUser, logout, updateProfile, addLoyaltyPoints, deductLoyaltyPoints } = useAuth();
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  // Helper para formatear RUT con puntos y guion automáticos (ej: 19.876.543-2)
  const formatRutWithDotsAndDash = (raw: string): string => {
    const cleaned = (raw || '').replace(/[^0-9kK]/g, '').toUpperCase().slice(0, 9);
    if (!cleaned) return '';
    if (cleaned.length === 1) return cleaned;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    let formattedBody = '';
    for (let i = body.length - 1, j = 1; i >= 0; i--, j++) {
      formattedBody = body[i] + formattedBody;
      if (j % 3 === 0 && i !== 0) {
        formattedBody = '.' + formattedBody;
      }
    }
    return `${formattedBody}-${dv}`;
  };

  // Helper para formatear teléfono móvil con separación automática (ejemplo: 9 5689 6328)
  const formatChileanMobilePhone = (raw: string): string => {
    let digits = (raw || '').replace(/\D/g, '');
    if (digits.startsWith('56') && digits.length > 9) {
      digits = digits.slice(2);
    }
    digits = digits.slice(0, 9);
    if (!digits) return '';
    if (digits.length <= 1) return digits;
    if (digits.length <= 5) {
      return `${digits.slice(0, 1)} ${digits.slice(1)}`;
    }
    return `${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5, 9)}`;
  };

  // Estados del Formulario de Perfil en "Configuración" (Nombre y Apellido máx. 50 caracteres)
  const [profileFirstName, setProfileFirstName] = useState(() => {
    if (currentUser.firstName) return currentUser.firstName.slice(0, 50);
    const parts = (currentUser.name || '').split(' ');
    return (parts[0] || 'Valeria').slice(0, 50);
  });

  const [profileLastName, setProfileLastName] = useState(() => {
    if (currentUser.lastName) return currentUser.lastName.slice(0, 50);
    const parts = (currentUser.name || '').split(' ');
    return (parts.slice(1).join(' ') || 'Gallardo').slice(0, 50);
  });

  const [profileRut, setProfileRut] = useState(() => {
    return formatRutWithDotsAndDash(currentUser.rut || '198765432');
  });

  const [profileEmail, setProfileEmail] = useState(() => {
    return currentUser.email || 'valeria.cyber@gmail.com';
  });

  const [profilePhone, setProfilePhone] = useState(() => {
    return formatChileanMobilePhone(currentUser.phone || '956896328');
  });

  const [profileAvatarUrl, setProfileAvatarUrl] = useState(() => {
    return currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
  });

  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Sincronizar campos cuando cambie el usuario autenticado
  useEffect(() => {
    if (currentUser) {
      if (currentUser.firstName) setProfileFirstName(currentUser.firstName.slice(0, 50));
      if (currentUser.lastName) setProfileLastName(currentUser.lastName.slice(0, 50));
      if (currentUser.rut) setProfileRut(formatRutWithDotsAndDash(currentUser.rut));
      if (currentUser.email) setProfileEmail(currentUser.email);
      if (currentUser.phone) setProfilePhone(formatChileanMobilePhone(currentUser.phone));
      if (currentUser.avatarUrl) setProfileAvatarUrl(currentUser.avatarUrl);
    }
  }, [currentUser]);

  // Manejadores con restricciones estrictas (máximo 50 caracteres para nombres, separaciones automáticas)
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileFirstName(e.target.value.slice(0, 50));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileLastName(e.target.value.slice(0, 50));
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const currentClean = (profileRut || '').replace(/[^0-9kK]/g, '').toUpperCase();
    let newClean = inputValue.replace(/[^0-9kK]/g, '').toUpperCase().slice(0, 9);

    // Si el usuario borró algo pero la cantidad de dígitos/letras quedó igual (borró un punto o guion),
    // removemos el último dígito para que el borrado con retroceso funcione fluidamente
    if (inputValue.length < profileRut.length && newClean.length === currentClean.length && newClean.length > 0) {
      newClean = newClean.slice(0, -1);
    }

    const formatted = formatRutWithDotsAndDash(newClean);
    setProfileRut(formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const currentDigits = (profilePhone || '').replace(/\D/g, '');
    let newDigits = inputValue.replace(/\D/g, '').slice(0, 9);

    // Si el usuario borró un espacio, descontar el dígito anterior para evitar trabas al borrar
    if (inputValue.length < profilePhone.length && newDigits.length === currentDigits.length && newDigits.length > 0) {
      newDigits = newDigits.slice(0, -1);
    }

    const formatted = formatChileanMobilePhone(newDigits);
    setProfilePhone(formatted);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setProfileErrorMsg('La foto de perfil no debe superar los 3 MB.');
      setTimeout(() => setProfileErrorMsg(null), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileAvatarUrl(event.target.result as string);
        setProfileErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);

    const trimmedFirstName = profileFirstName.trim();
    const trimmedLastName = profileLastName.trim();
    const trimmedRut = profileRut.trim();
    const trimmedPhone = profilePhone.trim();
    const trimmedEmail = profileEmail.trim();

    const rawRutDigits = trimmedRut.replace(/[^0-9kK]/g, '');
    const rawPhoneDigits = trimmedPhone.replace(/\D/g, '');

    if (!trimmedFirstName) {
      setProfileErrorMsg('El Nombre es obligatorio.');
      return;
    }
    if (trimmedFirstName.length > 50) {
      setProfileErrorMsg('El Nombre no puede exceder los 50 caracteres máximo.');
      return;
    }
    if (!trimmedLastName) {
      setProfileErrorMsg('El Apellido es obligatorio.');
      return;
    }
    if (trimmedLastName.length > 50) {
      setProfileErrorMsg('El Apellido no puede exceder los 50 caracteres máximo.');
      return;
    }
    if (!trimmedRut || rawRutDigits.length < 7) {
      setProfileErrorMsg('El RUT es obligatorio para envíos a domicilio y retiros (formato: 12.345.678-K).');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setProfileErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!trimmedPhone || rawPhoneDigits.length < 8) {
      setProfileErrorMsg('El Teléfono es obligatorio (ejemplo: 9 5689 6328).');
      return;
    }

    updateProfile({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      name: `${trimmedFirstName} ${trimmedLastName}`,
      rut: trimmedRut,
      email: trimmedEmail,
      phone: trimmedPhone,
      avatarUrl: profileAvatarUrl
    });

    setProfileSuccessMsg('✓ ¡Perfil actualizado con éxito! Datos sincronizados con el Checkout y despacho.');
    setTimeout(() => setProfileSuccessMsg(null), 4000);
  };

  // Tab activo: Se eliminó 'payments' por prohibición estricta de guardar tarjetas
  const [activeTab, setActiveTab] = useState<
    'orders' | 'points' | 'wishlist' | 'addresses' | 'returns' | 'reviews' | 'settings'
  >('orders');

  // Filtro para el historial de compras
  const [ordersFilter, setOrdersFilter] = useState<'all' | 'in_progress' | 'pickup' | 'delivered'>('all');

  // Modal para dejar reseña con fotos
  const [reviewModalProduct, setReviewModalProduct] = useState<{
    productId: string;
    title: string;
    image: string;
    orderNumber: string;
  } | null>(null);

  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);

  // Registro de productos ya reseñados por el usuario
  const [reviewedProductIds, setReviewedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nolimits_user_reviewed_items');
      return saved ? JSON.parse(saved) : ['prod_cyber_hoodie_01'];
    } catch {
      return ['prod_cyber_hoodie_01'];
    }
  });

  // Sub-pestañas para el módulo "Mis Reseñas": Tab 1: 'Pendientes' y Tab 2: 'Realizadas'
  const [reviewsSubTab, setReviewsSubTab] = useState<'pending' | 'completed'>('pending');

  // Historial de reseñas realizadas por el usuario
  const [myPublishedReviews, setMyPublishedReviews] = useState<UserPublishedReview[]>(() => {
    try {
      const saved = localStorage.getItem('nolimits_my_published_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'rev_initial_01',
        productId: 'prod_cyber_hoodie_01',
        productTitle: 'Cyber-Tribal Overkill Zip Hoodie',
        productImage: INITIAL_PRODUCTS[0]?.images[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300',
        productSize: 'L',
        orderNumber: 'NL-8842',
        rating: 5,
        title: 'Excelente serigrafía y calce oversized impecable',
        comment: 'La calidad del algodón frisado es pesada y abriga bien. El calce oversized cae perfecto con los parachute pants y los cierres metálicos son ultra resistentes. Muy recomendado el Drop.',
        photos: [
          'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&auto=format&fit=crop&q=80'
        ],
        date: '10 de Octubre 2026',
        pointsEarned: 100
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nolimits_my_published_reviews', JSON.stringify(myPublishedReviews));
  }, [myPublishedReviews]);

  // Lista de cupones canjeados por el usuario
  const [redeemedCoupons, setRedeemedCoupons] = useState<
    { code: string; title: string; date: string; discount: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem('nolimits_redeemed_coupons');
      return saved
        ? JSON.parse(saved)
        : [
            {
              code: 'DROP3K-XP-7721',
              title: 'Cupón $3.000 CLP de Descuento',
              date: '10 de Octubre 2026',
              discount: '$3.000 CLP'
            }
          ];
    } catch {
      return [];
    }
  });

  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);
  const [pointsNotification, setPointsNotification] = useState<string | null>(null);

  // =========================================================================
  // GESTIÓN DE DIRECCIONES (Múltiples Direcciones & Selección de Predeterminada)
  // =========================================================================
  const [addresses, setAddresses] = useState<UserAddress[]>(() => {
    try {
      const saved = localStorage.getItem('nolimits_user_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'addr_principal_01',
        alias: 'Casa Principal',
        recipientName: currentUser.name || 'Valeria Gallardo',
        street: 'Av. Libertad',
        number: '1250',
        apartment: 'Depto 402',
        comuna: 'Viña del Mar',
        city: 'Viña del Mar',
        region: 'Región de Valparaíso',
        postalCode: '2520000',
        phone: '+56 9 9123 4567',
        notes: 'Entregar en conserjería edificio torre B',
        isDefault: true
      },
      {
        id: 'addr_trabajo_02',
        alias: 'Estudio / Trabajo',
        recipientName: currentUser.name || 'Valeria Gallardo',
        street: 'Calle Prat',
        number: '856',
        apartment: 'Oficina 301',
        comuna: 'Valparaíso',
        city: 'Valparaíso',
        region: 'Región de Valparaíso',
        postalCode: '2340000',
        phone: '+56 9 8765 4321',
        notes: 'Horario continuado 09:00 a 18:30 hrs',
        isDefault: false
      }
    ];
  });

  const [addressSuccessMessage, setAddressSuccessMessage] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrAlias, setNewAddrAlias] = useState('');
  const [newAddrRecipient, setNewAddrRecipient] = useState(currentUser.name || '');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrNumber, setNewAddrNumber] = useState('');
  const [newAddrApt, setNewAddrApt] = useState('');
  const [newAddrComuna, setNewAddrComuna] = useState('Viña del Mar');
  const [newAddrPhone, setNewAddrPhone] = useState('+56 9 ');
  const [newAddrNotes, setNewAddrNotes] = useState('');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  // Sincronizar direcciones en localStorage y asegurar dirección predeterminada
  useEffect(() => {
    localStorage.setItem('nolimits_user_addresses', JSON.stringify(addresses));
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    if (defaultAddr) {
      localStorage.setItem('nolimits_default_address', JSON.stringify(defaultAddr));
    }
  }, [addresses]);

  /**
   * Establecer una dirección como predeterminada e inyectarla al Checkout
   */
  const handleSetDefaultAddress = (addressId: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    setAddresses(updated);

    const selected = updated.find(a => a.id === addressId);
    if (selected) {
      localStorage.setItem('nolimits_default_address', JSON.stringify(selected));

      // Inyección directa en el auto-rellenado del Checkout (nolimits_checkout_info)
      try {
        const currentCheckout = JSON.parse(localStorage.getItem('nolimits_checkout_info') || '{}');
        const updatedCheckout = {
          ...currentCheckout,
          customerName: selected.recipientName || currentCheckout.customerName || currentUser.name,
          customerPhone: selected.phone || currentCheckout.customerPhone,
          shippingCountry: 'Chile',
          shippingStreet: selected.street,
          shippingNumber: selected.number,
          shippingApartment: selected.apartment || '',
          shippingComuna: selected.comuna,
          shippingCity: selected.city || selected.comuna,
          shippingAddress: `${selected.street} ${selected.number}${selected.apartment ? ', ' + selected.apartment : ''}`,
          shippingPostalCode: selected.postalCode || '2520000',
          shippingNotes: selected.notes || ''
        };
        localStorage.setItem('nolimits_checkout_info', JSON.stringify(updatedCheckout));
      } catch {
        // ignore
      }

      setAddressSuccessMessage(`✓ "${selected.alias}" establecida como predeterminada e inyectada al Checkout.`);
      setTimeout(() => setAddressSuccessMessage(null), 3500);
    }
  };

  /**
   * Eliminar una dirección guardada
   */
  const handleDeleteAddress = (addressId: string) => {
    const addrToDelete = addresses.find(a => a.id === addressId);
    if (!addrToDelete) return;
    if (addresses.length <= 1) {
      alert('Debes conservar al menos una dirección registrada para despachos.');
      return;
    }
    const confirmed = window.confirm(`¿Deseas eliminar la dirección "${addrToDelete.alias}"?`);
    if (!confirmed) return;

    let updated = addresses.filter(a => a.id !== addressId);
    // Si la eliminada era la predeterminada, asignar la primera disponible como predeterminada
    if (addrToDelete.isDefault && updated.length > 0) {
      updated = updated.map((a, idx) => ({ ...a, isDefault: idx === 0 }));
      handleSetDefaultAddress(updated[0].id);
    }
    setAddresses(updated);
  };

  /**
   * Guardar nueva dirección
   */
  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrNumber || !newAddrComuna) {
      alert('Por favor completa calle, número y comuna.');
      return;
    }

    const newId = `addr_${Date.now()}`;
    const newAddress: UserAddress = {
      id: newId,
      alias: newAddrAlias.trim() || 'Dirección Adicional',
      recipientName: newAddrRecipient.trim() || currentUser.name || 'Cliente NoLimits',
      street: newAddrStreet.trim(),
      number: newAddrNumber.trim(),
      apartment: newAddrApt.trim() || undefined,
      comuna: newAddrComuna.trim(),
      city: newAddrComuna.trim(),
      region: 'Región de Valparaíso',
      postalCode: '2520000',
      phone: newAddrPhone.trim() || '+56 9 9123 4567',
      notes: newAddrNotes.trim() || undefined,
      isDefault: newAddrIsDefault || addresses.length === 0
    };

    let updatedAddresses = [...addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
      updatedAddresses.push(newAddress);
      handleSetDefaultAddress(newId);
    } else {
      updatedAddresses.push(newAddress);
      setAddresses(updatedAddresses);
    }

    // Reset formulario
    setNewAddrAlias('');
    setNewAddrStreet('');
    setNewAddrNumber('');
    setNewAddrApt('');
    setNewAddrNotes('');
    setNewAddrIsDefault(false);
    setIsAddingAddress(false);
    setAddressSuccessMessage(`✓ Nueva dirección "${newAddress.alias}" registrada con éxito.`);
    setTimeout(() => setAddressSuccessMessage(null), 3500);
  };

  // =========================================================================
  // MÓDULO DE DEVOLUCIONES (Estados Obligatorios & Horarios de Sucursales)
  // Estados: Solicitud recibida -> Revisión de equipo -> Aprobada -> Envió a punto/sucursal
  // =========================================================================
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(() => {
    try {
      const saved = localStorage.getItem('nolimits_return_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'ret_case_01',
        ticketNumber: 'DEV-8821',
        orderNumber: 'NL-6104',
        productId: 'prod_baguette_bag_03',
        productTitle: 'Cartera Y2K Mini Baguette Plateada Mirror',
        productSize: 'Talla estándar',
        productImage: INITIAL_PRODUCTS[2]?.images[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300',
        reason: 'Drop Insatisfecho',
        returnMethod: 'branch_dropoff',
        targetBranchId: 'vina_del_mar',
        targetBranchName: 'Sucursal Viña del Mar - Mall Marina Studio',
        requestDate: '12 de Octubre 2026',
        currentStatus: 'Aprobada',
        notes: 'Inspección previa aprobada. El cliente debe acudir a la sucursal de Viña del Mar en horario hábil para entrega de la prenda y recepción de nota de crédito o cambio.'
      },
      {
        id: 'ret_case_02',
        ticketNumber: 'DEV-9104',
        orderNumber: 'NL-7319',
        productId: 'prod_gothic_cargo_02',
        productTitle: 'Gothic Parachute Multipocket Cargo',
        productSize: 'M',
        productImage: INITIAL_PRODUCTS[1]?.images[0] || 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=300',
        reason: 'Cambio de Talla',
        requestedSize: 'L',
        returnMethod: 'branch_dropoff',
        targetBranchId: 'valparaiso',
        targetBranchName: 'Sucursal Valparaíso - Puerto Cyber Lab',
        requestDate: '14 de Octubre 2026',
        currentStatus: 'Revisión de equipo',
        notes: 'El equipo de logística física está verificando disponibilidad de talla L en bodega central antes de autorizar el cambio en sucursal Valparaíso.'
      },
      {
        id: 'ret_case_03',
        ticketNumber: 'DEV-4019',
        orderNumber: 'NL-8842',
        productId: 'prod_collar_chain_04',
        productTitle: 'Cybernetic Chrome Spiked Collar & Chain',
        productSize: 'Talla estándar',
        productImage: INITIAL_PRODUCTS[3]?.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300',
        reason: 'Garantía Legal',
        returnMethod: 'branch_dropoff',
        targetBranchId: 'vina_del_mar',
        targetBranchName: 'Sucursal Viña del Mar - Mall Marina Studio',
        requestDate: '11 de Octubre 2026',
        currentStatus: 'Rechazada',
        notes: 'Cliente solicitó cambio alegando daño estético posterior a la entrega.',
        rejectionReason: 'La pieza presenta manipulación forzada y signos evidentes de impacto exterior posterior al retiro. El sello holográfico de autenticidad del drop fue removido. De acuerdo al Artículo 21 de la Ley 19.496 y la política NoLimits OS, la garantía legal cubre exclusivamente fallas de fábrica preexistentes.',
        rejectionDate: '13 de Octubre 2026',
        adminInspector: 'Administración de Control de Calidad NoLimits'
      }
    ];
  });

  // Filtro de devoluciones: Todas, En Proceso, Aprobadas, Rechazadas
  const [returnsFilter, setReturnsFilter] = useState<'all' | 'in_progress' | 'approved' | 'rejected'>('all');

  // Guardar devoluciones en localStorage
  useEffect(() => {
    localStorage.setItem('nolimits_return_requests', JSON.stringify(returnRequests));
  }, [returnRequests]);

  const [returnSuccessMessage, setReturnSuccessMessage] = useState<string | null>(null);
  const [isNewReturnModalOpen, setIsNewReturnModalOpen] = useState(false);
  const [returnModalStep, setReturnModalStep] = useState<'confirm' | 'form'>('confirm');
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<string>('');
  const [selectedReturnItem, setSelectedReturnItem] = useState<string>('');
  const [selectedReturnReason, setSelectedReturnReason] = useState<ReturnRequest['reason']>('Cambio de Talla');
  const [selectedReturnMethod, setSelectedReturnMethod] = useState<'branch' | 'shipping'>('branch');
  const [selectedReturnBranch, setSelectedReturnBranch] = useState<string>('vina_del_mar');
  const [selectedReturnNotes, setSelectedReturnNotes] = useState<string>('');
  const [returnPhotos, setReturnPhotos] = useState<string[]>([]);
  const [returnTargetOrder, setReturnTargetOrder] = useState<PurchaseOrder | null>(null);
  const [returnTargetItem, setReturnTargetItem] = useState<{ productId: string; title: string; size: string; color: string; image: string; price: number } | null>(null);
  const [rejectionModalReturn, setRejectionModalReturn] = useState<ReturnRequest | null>(null);

  /**
   * Helper para calcular la antigüedad de una compra y si está dentro de los 7 días de garantía para devolución
   */
  const getReturnEligibility = (orderDateStr: string) => {
    if (!orderDateStr || orderDateStr.toLowerCase().includes('reciente')) {
      return {
        isEligible: true,
        daysElapsed: 0,
        daysLeft: 7,
        statusLabel: '7 días restantes'
      };
    }

    let orderDate: Date | null = null;
    const spanishMonths: Record<string, number> = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    };

    const match = orderDateStr.toLowerCase().match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+(\d{4})/);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthName = match[2].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const year = parseInt(match[3], 10);
      if (spanishMonths[monthName] !== undefined) {
        orderDate = new Date(year, spanishMonths[monthName], day);
      }
    } else {
      const direct = new Date(orderDateStr);
      if (!isNaN(direct.getTime())) orderDate = direct;
    }

    if (!orderDate) {
      return {
        isEligible: true,
        daysElapsed: 1,
        daysLeft: 6,
        statusLabel: '6 días restantes'
      };
    }

    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - orderDate.getTime());
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const isEligible = daysElapsed <= 7;
    const daysLeft = Math.max(0, 7 - daysElapsed);

    return {
      isEligible,
      daysElapsed,
      daysLeft,
      statusLabel: isEligible
        ? (daysLeft === 0 ? 'Último día disponible' : `${daysLeft} día${daysLeft > 1 ? 's' : ''} restante${daysLeft > 1 ? 's' : ''}`)
        : `Plazo de 7 días expirado (+${daysElapsed} días)`
    };
  };

  /**
   * Abrir modal de devolución iniciando con la pestaña "¿Está seguro?" y pre-seleccionando orden y prenda
   */
  const handleOpenDirectReturnModal = (
    order: PurchaseOrder,
    item: { productId: string; title: string; size: string; color: string; image: string; price: number }
  ) => {
    setSelectedReturnOrder(order.orderNumber);
    setSelectedReturnItem(item.productId);
    setSelectedReturnReason('Cambio de Talla');
    setSelectedReturnMethod(order.deliveryMethod === 'shipping' ? 'shipping' : 'branch');
    setSelectedReturnBranch(order.branchId || 'vina_del_mar');
    setSelectedReturnNotes('');
    setReturnPhotos([]);
    setReturnTargetOrder(order);
    setReturnTargetItem(item);
    setReturnModalStep('confirm'); // Inicia con "¿Está seguro?"
    setIsNewReturnModalOpen(true);
  };

  /**
   * Subida de hasta 6 fotos para la devolución
   */
  const handleReturnPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 6 - returnPhotos.length;
    if (remainingSlots <= 0) {
      alert('Has alcanzado el límite máximo permitido de 6 fotos.');
      return;
    }

    const filesToRead = files.slice(0, remainingSlots);
    filesToRead.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReturnPhotos(prev => {
            if (prev.length >= 6) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveReturnPhoto = (index: number) => {
    setReturnPhotos(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Agregar foto de muestra rápida para devolución (máximo 6 fotos)
   */
  const handleAddSampleReturnPhoto = () => {
    if (returnPhotos.length >= 6) {
      alert('Has alcanzado el límite máximo permitido de 6 fotos.');
      return;
    }
    const sampleReturnPhotos = [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80'
    ];
    const nextPhoto = sampleReturnPhotos[returnPhotos.length % sampleReturnPhotos.length];
    setReturnPhotos(prev => [...prev, nextPhoto]);
  };

  /**
   * Crear nueva solicitud de devolución
   */
  const handleCreateReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnOrder || !selectedReturnItem) {
      alert('Por favor selecciona la compra y la prenda que deseas devolver.');
      return;
    }

    const orderObj = orders.find(o => o.orderNumber === selectedReturnOrder);
    const itemObj = orderObj?.items.find(it => it.productId === selectedReturnItem);
    const branchObj = BRANCH_PHYSICAL_SCHEDULES.find(b => b.id === selectedReturnBranch) || BRANCH_PHYSICAL_SCHEDULES[0];

    const targetBranchName = selectedReturnMethod === 'shipping'
      ? 'Cambio o Retiro por Envío (Starken / Blue Express a Domicilio)'
      : branchObj.name;

    const randomTicketNumber = `DEV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase: ReturnRequest = {
      id: `ret_${Date.now()}`,
      ticketNumber: randomTicketNumber,
      orderNumber: selectedReturnOrder,
      productId: selectedReturnItem,
      productTitle: itemObj?.title || 'Prenda NoLimits Drop',
      productSize: itemObj?.size || 'M',
      productImage: itemObj?.image || INITIAL_PRODUCTS[0]?.images[0],
      reason: selectedReturnReason,
      returnMethod: selectedReturnMethod === 'shipping' ? 'courier_shipping' : 'branch_dropoff',
      targetBranchId: selectedReturnMethod === 'shipping' ? 'shipping_courier' : branchObj.id,
      targetBranchName: targetBranchName,
      requestDate: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
      currentStatus: 'Solicitud recibida',
      notes: selectedReturnNotes.trim() || 'Solicitud generada por el cliente. Esperando evaluación del equipo.',
      photos: returnPhotos
    };

    setReturnRequests(prev => [newCase, ...prev]);
    setIsNewReturnModalOpen(false);
    setSelectedReturnNotes('');
    setReturnPhotos([]);
    setReturnSuccessMessage(`✓ Solicitud ${randomTicketNumber} ingresada con éxito. Redirigiendo a Devoluciones...`);
    setTimeout(() => {
      setReturnSuccessMessage(null);
      setActiveTab('returns');
    }, 1200);
  };

  /**
   * Pasos oficiales obligatorios para Devoluciones
   */
  const RETURN_STATUS_STEPS = [
    { key: 'Solicitud recibida', label: '1. Solicitud recibida' },
    { key: 'Revisión de equipo', label: '2. Revisión de equipo' },
    { key: 'Aprobado / Rechazado', label: '3. Aprobado / Rechazado' },
    { key: 'Envió a punto/sucursal', label: '4. Envió a punto/sucursal' }
  ] as const;

  const getReturnStepStatus = (currentStatus: string, stepIndex: number) => {
    if (currentStatus === 'Rechazada') {
      if (stepIndex < 2) return 'completed';
      if (stepIndex === 2) return 'rejected';
      return 'cancelled';
    }
    const statusKeys = ['Solicitud recibida', 'Revisión de equipo', 'Aprobada', 'Envió a punto/sucursal'];
    const currentIdx = statusKeys.indexOf(currentStatus);
    if (stepIndex < currentIdx) return 'completed';
    if (stepIndex === currentIdx) return 'current';
    return 'pending';
  };

  // Lista de órdenes iniciales con los estados obligatorios solicitados
  const initialPurchaseOrders: PurchaseOrder[] = [
    {
      id: 'ord_demo_05',
      orderNumber: 'NL-9550',
      date: '14 de Octubre 2026',
      total: 42990,
      deliveryMethod: 'shipping',
      courier: 'Blue Express',
      shippingAddress: 'Av. Álvarez 680, Depto 901, Viña del Mar',
      currentStatus: 'Entregado',
      items: [
        {
          productId: 'prod_chaqueta_biker_10',
          title: 'Chaqueta Biker Cyber-Goth Cuero Vegano con Cierres Y2K',
          size: 'L',
          color: 'Obsidian Black',
          quantity: 1,
          price: 42990,
          image: INITIAL_PRODUCTS[9]?.images[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300'
        }
      ]
    },
    {
      id: 'ord_demo_06',
      orderNumber: 'NL-8320',
      date: '13 de Octubre 2026',
      total: 24990,
      deliveryMethod: 'pickup',
      branchName: 'Valparaíso',
      branchId: 'valparaiso',
      currentStatus: 'Retirado',
      items: [
        {
          productId: 'prod_vintage_tee_03',
          title: 'Windows XP Glitch 2000 Graphic Tee',
          size: 'M',
          color: 'Acid Washed Black',
          quantity: 1,
          price: 24990,
          image: INITIAL_PRODUCTS[2]?.images[0] || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300'
        }
      ]
    },
    {
      id: 'ord_demo_01',
      orderNumber: 'NL-8842',
      date: '12 de Octubre 2026',
      total: 54990,
      deliveryMethod: 'pickup',
      branchName: 'Viña del Mar',
      branchId: 'vina_del_mar',
      currentStatus: 'Listo para el retiro de sucursal',
      items: [
        {
          productId: 'prod_cyber_hoodie_01',
          title: 'Cyber-Tribal Overkill Zip Hoodie',
          size: 'L',
          color: 'Void Black',
          quantity: 1,
          price: 38990,
          image: INITIAL_PRODUCTS[0]?.images[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300'
        },
        {
          productId: 'prod_collar_chain_04',
          title: 'Cybernetic Chrome Spiked Collar & Chain',
          size: 'Talla estándar',
          color: 'Chrome Silver',
          quantity: 1,
          price: 18990,
          image: INITIAL_PRODUCTS[3]?.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300'
        }
      ]
    },
    {
      id: 'ord_demo_02',
      orderNumber: 'NL-7319',
      date: '02 de Agosto 2026',
      total: 35990,
      deliveryMethod: 'shipping',
      courier: 'Starken',
      shippingAddress: 'Av. Libertad 1250, Depto 402, Viña del Mar',
      currentStatus: 'Entregado',
      items: [
        {
          productId: 'prod_gothic_cargo_02',
          title: 'Gothic Parachute Multipocket Cargo',
          size: 'M',
          color: 'Shadow Grey',
          quantity: 1,
          price: 35990,
          image: INITIAL_PRODUCTS[1]?.images[0] || 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=300'
        }
      ]
    },
    {
      id: 'ord_demo_03',
      orderNumber: 'NL-6104',
      date: '28 de Julio 2026',
      total: 34990,
      deliveryMethod: 'pickup',
      branchName: 'Valparaíso',
      branchId: 'valparaiso',
      currentStatus: 'Retirado',
      items: [
        {
          productId: 'prod_baguette_bag_03',
          title: 'Cartera Y2K Mini Baguette Plateada Mirror',
          size: 'Talla estándar',
          color: 'Liquid Mirror',
          quantity: 1,
          price: 34990,
          image: INITIAL_PRODUCTS[2]?.images[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300'
        }
      ]
    },
    {
      id: 'ord_demo_04',
      orderNumber: 'NL-9201',
      date: '14 de Octubre 2026',
      total: 31990,
      deliveryMethod: 'pickup',
      branchName: 'Quilpué',
      branchId: 'quilpue',
      currentStatus: 'En Preparación',
      items: [
        {
          productId: 'prod_acid_babytee_05',
          title: 'Acid Glitch Cyber-Goth Baby Tee',
          size: 'S',
          color: 'Washed Black',
          quantity: 1,
          price: 31990,
          image: INITIAL_PRODUCTS[4]?.images[0] || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300'
        }
      ]
    }
  ];

  // Carga de órdenes desde localStorage combinadas con las iniciales
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const local = localStorage.getItem('nolimits_user_orders');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((o: any) => ({
            id: o.id || `ord_${Date.now()}`,
            orderNumber: o.orderNumber || 'NL-9999',
            date: o.date || 'Reciente',
            total: o.total || 0,
            deliveryMethod: o.deliveryMethod || 'pickup',
            branchName: o.branchName || 'Viña del Mar',
            branchId: o.branchId || 'vina_del_mar',
            courier: o.courier || 'Starken',
            shippingAddress: o.shippingAddress,
            currentStatus: (o.status as any) || 'Solicitud recibida',
            items: (o.items || []).map((it: any) => ({
              productId: it.productId || 'prod_cyber_hoodie_01',
              title: it.title || 'Prenda NoLimits Drop',
              size: it.size || 'M',
              color: it.color || 'Void Black',
              quantity: it.quantity || 1,
              price: it.price || 0,
              image: it.image || INITIAL_PRODUCTS[0]?.images[0]
            }))
          }));
          const userOnly = formatted.filter(
            (f: any) => !initialPurchaseOrders.some(init => init.orderNumber === f.orderNumber || init.id === f.id)
          );
          return [...userOnly, ...initialPurchaseOrders];
        }
      }
    } catch {
      // fallback
    }
    return initialPurchaseOrders;
  });

  // Compras realizadas (pedidos 'Entregado' o 'Retirado') que no han sido reseñadas aún (Tab 1: Pendientes)
  const pendingReviewItems = orders
    .filter(o => o.currentStatus === 'Entregado' || o.currentStatus === 'Retirado')
    .flatMap(o =>
      o.items.map(item => ({
        ...item,
        orderNumber: o.orderNumber,
        orderDate: o.date,
        deliveryMethod: o.deliveryMethod,
        branchName: o.branchName
      }))
    )
    .filter(item => !reviewedProductIds.includes(item.productId));

  // Filtrado de solicitudes de devolución
  const filteredReturnRequests = returnRequests.filter(ret => {
    if (returnsFilter === 'in_progress') {
      return ret.currentStatus === 'Solicitud recibida' || ret.currentStatus === 'Revisión de equipo';
    }
    if (returnsFilter === 'approved') {
      return ret.currentStatus === 'Aprobada' || ret.currentStatus === 'Envió a punto/sucursal';
    }
    if (returnsFilter === 'rejected') {
      return ret.currentStatus === 'Rechazada';
    }
    return true;
  });

  // Pestañas de navegación vertical estilo Windows XP
  // "Historial de pedidos" ahora renombrado a "Historial de Compras"
  // "Direcciones Envío" renombrado a "Gestión de Direcciones"
  // Se eliminó la pestaña "Métodos de Pago" / Guardar Tarjetas por requerimiento
  const tabs = [
    { id: 'orders', label: 'Historial de Compras', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'points', label: 'Puntos Acumulados', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'reviews', label: 'Mis Reseñas', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'wishlist', label: 'Lista de Deseos', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'addresses', label: 'Gestión de Direcciones', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'returns', label: 'Devoluciones', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-3.5 h-3.5" /> }
  ] as const;

  /**
   * Helper para obtener los pasos obligatorios según método de entrega
   */
  const getOrderSteps = (order: PurchaseOrder) => {
    if (order.deliveryMethod === 'shipping') {
      return [
        { label: 'Solicitud recibida', key: 'Solicitud recibida' },
        { label: 'En Preparación', key: 'En Preparación' },
        { label: 'En transito', key: 'En transito' },
        { label: 'Entregado', key: 'Entregado' }
      ];
    }

    // Modalidad Retiro en Sucursal: incluye la sucursal específica (Valparaíso, Viña del Mar, Quilpué)
    const branchLabel = order.branchName || 'Viña del Mar';
    return [
      { label: 'Solicitud recibida', key: 'Solicitud recibida' },
      { label: 'En Preparación', key: 'En Preparación' },
      { label: 'En transito', key: 'En transito' },
      { label: `Listo para el retiro de sucursal (${branchLabel})`, key: 'Listo para el retiro de sucursal' },
      { label: 'Retirado', key: 'Retirado' }
    ];
  };

  /**
   * Helper para calcular el índice de progreso actual
   */
  const getStepStatus = (order: PurchaseOrder, stepKey: string, stepIndex: number) => {
    const steps = getOrderSteps(order);
    const currentIndex = steps.findIndex(s => s.key === order.currentStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  /**
   * Canjear un cupón usando puntos acumulados
   */
  const handleRedeemCoupon = (coupon: CouponItem) => {
    if ((currentUser.loyaltyPoints || 0) < coupon.pointsCost) {
      alert(`Puntos insuficientes. Necesitas ${coupon.pointsCost} puntos y tienes ${currentUser.loyaltyPoints}.`);
      return;
    }

    const confirmed = window.confirm(
      `¿Deseas canjear ${coupon.pointsCost} Puntos por el "${coupon.title}"?`
    );
    if (!confirmed) return;

    const success = deductLoyaltyPoints(coupon.pointsCost);
    if (!success) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `${coupon.codePrefix}-XP-${randomSuffix}`;

    const newRedeemed = {
      code: newCode,
      title: coupon.title,
      date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
      discount: coupon.discountDescription
    };

    setRedeemedCoupons(prev => [newRedeemed, ...prev]);
    setPointsNotification(`¡Cupón canjeado con éxito! Código: ${newCode}. Se descontaron ${coupon.pointsCost} puntos.`);
  };

  /**
   * Copiar código de cupón al portapapeles
   */
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCouponCode(code);
    setTimeout(() => setCopiedCouponCode(null), 2500);
  };

  /**
   * Abrir modal para dejar reseña con fotos
   */
  const handleOpenReviewModal = (item: { productId: string; title: string; image: string }, orderNumber: string) => {
    setReviewModalProduct({
      productId: item.productId,
      title: item.title,
      image: item.image,
      orderNumber
    });
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setReviewPhotos([]);
    setReviewSuccessMessage(null);
  };

  /**
   * Adjuntar foto de prueba rápida con 1 clic
   */
  const handleAddSampleStreetwearPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80'
    ];
    const nextPhoto = samplePhotos[reviewPhotos.length % samplePhotos.length];
    setReviewPhotos(prev => [...prev, nextPhoto]);
  };

  /**
   * Subir foto desde explorador de archivos local
   */
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReviewPhotos(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Publicar reseña y otorgar puntos
   */
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalProduct) return;

    const hasPhotos = reviewPhotos.length > 0;
    // Otorga 100 puntos por fotos según requerimiento explícito
    const earnedPoints = hasPhotos ? 100 : 20;

    setReviewSubmitting(true);

    setTimeout(() => {
      // 1. Acreditar puntos al usuario
      addLoyaltyPoints(earnedPoints);

      // 2. Marcar producto como reseñado
      const updatedReviewed = [...reviewedProductIds, reviewModalProduct.productId];
      setReviewedProductIds(updatedReviewed);
      localStorage.setItem('nolimits_user_reviewed_items', JSON.stringify(updatedReviewed));

      // 3. Registrar en las reseñas realizadas por el usuario (Tab 2: Realizadas)
      const newMyReview: UserPublishedReview = {
        id: `my_rev_${Date.now()}`,
        productId: reviewModalProduct.productId,
        productTitle: reviewModalProduct.title,
        productImage: reviewModalProduct.image,
        orderNumber: reviewModalProduct.orderNumber,
        rating: reviewRating,
        title: reviewTitle || 'Prenda espectacular recomendada',
        comment: reviewComment || 'Calidad y corte insuperables, la serigrafía es fiel al drop.',
        photos: reviewPhotos,
        date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }),
        pointsEarned: earnedPoints
      };
      setMyPublishedReviews(prev => [newMyReview, ...prev]);

      // 4. Guardar reseña en localStorage para que aparezca en el detalle de producto
      try {
        const storageKey = `nolimits_reviews_${reviewModalProduct.productId}`;
        const existingReviews = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const newReview = {
          id: `rev_user_${Date.now()}`,
          productId: reviewModalProduct.productId,
          userId: currentUser.id,
          userName: currentUser.name || 'Cliente Verificado',
          rating: reviewRating,
          title: reviewTitle || 'Prenda espectacular recomendada',
          comment: reviewComment || 'Calidad y corte insuperables, la serigrafía es fiel al drop.',
          date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }),
          verifiedPurchase: true,
          photos: reviewPhotos,
          likes: 1
        };
        localStorage.setItem(storageKey, JSON.stringify([newReview, ...existingReviews]));
      } catch {
        // ignore
      }

      setReviewSubmitting(false);
      setReviewSuccessMessage(
        `¡Reseña publicada con éxito! Se han acreditado +${earnedPoints} Cyber Points a tu cuenta por incluir fotos reales.`
      );

      setTimeout(() => {
        setReviewModalProduct(null);
        setReviewSuccessMessage(null);
      }, 2000);
    }, 800);
  };

  // Filtrado de compras
  const filteredOrders = orders.filter(o => {
    if (ordersFilter === 'in_progress') {
      return o.currentStatus !== 'Entregado' && o.currentStatus !== 'Retirado';
    }
    if (ordersFilter === 'pickup') {
      return o.deliveryMethod === 'pickup';
    }
    if (ordersFilter === 'delivered') {
      return o.currentStatus === 'Entregado' || o.currentStatus === 'Retirado';
    }
    return true;
  });

  return (
    <div className="space-y-4 font-sans">
      <WindowFrame
        title={`Propiedades_del_Sistema.cpl - [Cuenta: ${(currentUser.name || 'Usuario').slice(0, 45)}${(currentUser.name || '').length > 45 ? '...' : ''}]`}
        icon={<PixelIcon name="computer" size={16} />}
        statusBarText={`PUNTOS ACTIVOS: ${currentUser.loyaltyPoints} PTS // ESTADO: VERIFICADO`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Tarjeta de Usuario Lateral (Col 1-4) */}
          <div className="md:col-span-4 space-y-3">
            <div className="p-3 bg-gray-50 border border-gray-300 text-center space-y-2 winxp-bevel-out">
              <div className="w-20 h-20 mx-auto border-2 border-gray-400 bg-amber-100 flex items-center justify-center text-4xl shadow-sm overflow-hidden relative">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>🦆</span>
                )}
              </div>
              <div className="px-1 overflow-hidden">
                <h3 className="font-bold text-gray-900 text-sm break-words line-clamp-2" title={currentUser.name}>
                  {currentUser.name}
                </h3>
                <span className="text-xs text-blue-900 font-mono break-all block">{currentUser.email}</span>
              </div>

              <div className="bg-white border border-gray-300 p-2 flex items-center justify-around text-xs">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold">PUNTOS:</div>
                  <div className="font-bold text-red-700 text-sm">{currentUser.loyaltyPoints} pts</div>
                </div>
                <div className="h-6 w-px bg-gray-300" />
                <div>
                  <div className="text-[10px] text-gray-500 font-bold">VALOR CANJE:</div>
                  <div className="font-bold text-green-700 text-xs">
                    ${(currentUser.loyaltyPoints * 10).toLocaleString('es-CL')} CLP
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="winxp-button text-xs py-1 px-3 w-full text-red-700 font-semibold cursor-pointer"
              >
                Cerrar Sesión de Windows
              </button>
            </div>

            {/* Pestañas de navegación vertical estilo Windows XP alineadas al centro */}
            <div className="flex flex-col gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`winxp-button w-full text-xs py-2 px-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    activeTab === tab.id
                      ? 'winxp-button-primary bg-blue-100 font-bold text-blue-900 shadow-inner'
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-blue-700 shrink-0">{tab.icon}</span>
                  <span className="font-semibold text-center">{tab.label}</span>
                  {tab.id === 'orders' && (
                    <span
                      data-force-white
                      style={{ color: '#ffffff' }}
                      className="bg-blue-700 !text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 shadow-xs"
                    >
                      {orders.length}
                    </span>
                  )}
                  {tab.id === 'points' && (
                    <span
                      data-force-white
                      style={{ color: '#ffffff' }}
                      className="bg-amber-600 !text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 shadow-xs"
                    >
                      {currentUser.loyaltyPoints}p
                    </span>
                  )}
                  {tab.id === 'reviews' && pendingReviewItems.length > 0 && (
                    <span
                      data-force-white
                      style={{ color: '#ffffff' }}
                      className="bg-amber-600 !text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 shadow-xs"
                    >
                      {pendingReviewItems.length}
                    </span>
                  )}
                  {tab.id === 'wishlist' && wishlistCount > 0 && (
                    <span
                      data-force-white
                      style={{ color: '#ffffff' }}
                      className="bg-rose-600 !text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 shadow-xs"
                    >
                      {wishlistCount}
                    </span>
                  )}
                  {tab.id === 'returns' && (
                    <span
                      data-force-white
                      style={{ color: '#ffffff' }}
                      className="bg-purple-700 !text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 shadow-xs"
                    >
                      {returnRequests.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Área de Detalle de la Pestaña (Col 5-12) */}
          <div className="md:col-span-8 bg-white border border-gray-300 p-4 min-h-[420px] winxp-bevel-in">
            {/* =================================================================
                1. PESTAÑA: HISTORIAL DE COMPRAS (Renombrado y con Estados Obligatorios)
                ================================================================= */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Cabecera de la Pestaña */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-300 gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-blue-700" />
                      Historial de Compras
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Trazabilidad completa con estados oficiales de preparación, tránsito y entrega.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 border border-gray-300">
                    {filteredOrders.length} compras registradas
                  </span>
                </div>

                {/* Filtros de Compras */}
                <div className="flex flex-wrap gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setOrdersFilter('all')}
                    className={`winxp-button text-[11px] py-1 px-2.5 ${
                      ordersFilter === 'all' ? 'winxp-button-primary font-bold' : ''
                    }`}
                  >
                    Todas ({orders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdersFilter('in_progress')}
                    className={`winxp-button text-[11px] py-1 px-2.5 ${
                      ordersFilter === 'in_progress' ? 'winxp-button-primary font-bold' : ''
                    }`}
                  >
                    En Proceso / Tránsito
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdersFilter('pickup')}
                    className={`winxp-button text-[11px] py-1 px-2.5 ${
                      ordersFilter === 'pickup' ? 'winxp-button-primary font-bold' : ''
                    }`}
                  >
                    Retiro en Sucursal
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdersFilter('delivered')}
                    className={`winxp-button text-[11px] py-1 px-2.5 ${
                      ordersFilter === 'delivered' ? 'winxp-button-primary font-bold' : ''
                    }`}
                  >
                    Entregados / Retirados
                  </button>
                </div>

                {/* Listado de Órdenes */}
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-xs border border-dashed border-gray-300 bg-gray-50">
                      No se encontraron compras en esta categoría.
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const steps = getOrderSteps(order);
                      const isPickup = order.deliveryMethod === 'pickup';

                      return (
                        <div
                          key={order.id}
                          className="bg-[#fafbfc] border border-gray-400 p-3.5 space-y-3 winxp-bevel-out shadow-xs"
                        >
                          {/* Fila Superior: Número de Orden, Fecha y Estado Actual */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-300 pb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-blue-900 font-mono">
                                  Orden #{order.orderNumber}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 border ${
                                    isPickup
                                      ? 'bg-purple-100 text-purple-900 border-purple-400'
                                      : 'bg-blue-100 text-blue-900 border-blue-400'
                                  }`}
                                >
                                  {isPickup ? `🏪 Retiro en ${order.branchName}` : `🚚 Envío ${order.courier}`}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                Fecha de compra: {order.date} · Total: ${order.total.toLocaleString('es-CL')} CLP
                              </div>
                            </div>

                            {/* Badge con el Estado Actual Oficial (Diseño Vibrante con Texto Blanco Garantizado) */}
                            <div className="shrink-0">
                              {(() => {
                                const isFinished = order.currentStatus === 'Entregado' || order.currentStatus === 'Retirado';
                                const isReadyPickup = order.currentStatus === 'Listo para el retiro de sucursal';
                                const isTransit = order.currentStatus === 'En transito';

                                let badgeBg = 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)';
                                let badgeBorder = '#075985';
                                let BadgeIcon = Clock;

                                if (isFinished) {
                                  badgeBg = 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)';
                                  badgeBorder = '#14532d';
                                  BadgeIcon = Check;
                                } else if (isReadyPickup) {
                                  badgeBg = 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)';
                                  badgeBorder = '#92400e';
                                  BadgeIcon = Store;
                                } else if (isTransit) {
                                  badgeBg = 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)';
                                  badgeBorder = '#1e3a8a';
                                  BadgeIcon = Truck;
                                }

                                const displayText = isReadyPickup
                                  ? `Listo para retiro (${order.branchName})`
                                  : order.currentStatus;

                                return (
                                  <span
                                    style={{
                                      background: badgeBg,
                                      borderColor: badgeBorder,
                                      color: '#ffffff',
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)'
                                    }}
                                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 border rounded-xs select-none ${
                                      isReadyPickup ? 'animate-pulse' : ''
                                    }`}
                                  >
                                    <BadgeIcon className="w-3.5 h-3.5 shrink-0" style={{ color: '#ffffff' }} />
                                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                                      {displayText}
                                    </span>
                                  </span>
                                );
                              })()}
                            </div>
                          </div>

                          {/* =========================================================
                              DISEÑO DE ESTADOS OBLIGATORIOS (Timeline / Pipeline Retro)
                              Solicitud recibida -> En Preparación -> En transito -> 
                              Listo para el retiro de sucursal -> Entregado / Retirado
                              ========================================================= */}
                          <div className="bg-white border border-gray-300 p-2.5 space-y-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                              <span>Línea de Estado del Pedido:</span>
                              <span className="text-blue-800 font-mono text-[10px]">
                                {isPickup ? 'Flujo de Retiro Presencial' : 'Flujo de Despacho Domicilio'}
                              </span>
                            </div>

                            {/* Visual Stepper Horizontal con Estado Actual Embellecido y Texto Blanco */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-1.5 pt-1">
                              {steps.map((step, idx) => {
                                const status = getStepStatus(order, step.key, idx);

                                if (status === 'current') {
                                  return (
                                    <div
                                      key={idx}
                                      style={{
                                        background: 'linear-gradient(180deg, #1e69de 0%, #0050cf 45%, #003fb5 50%, #002d8f 100%)',
                                        borderColor: '#06266f',
                                        color: '#ffffff',
                                        boxShadow: '0 2px 5px rgba(0, 30, 90, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                                      }}
                                      className="p-2 border rounded-xs text-center transition-all flex flex-col justify-between"
                                    >
                                      <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-ping" />
                                        <span className="font-mono text-[11px] font-black" style={{ color: '#ffffff' }}>
                                          {idx + 1}.
                                        </span>
                                      </div>
                                      <div
                                        className="text-[11px] leading-snug font-bold tracking-tight my-0.5"
                                        style={{ color: '#ffffff' }}
                                      >
                                        {step.label}
                                      </div>
                                      <div className="pt-1">
                                        <span
                                          className="inline-block px-1.5 py-0.5 text-[9px] uppercase font-black tracking-wider rounded-xs shadow-xs"
                                          style={{
                                            backgroundColor: '#ffffff',
                                            color: '#003fb5',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                          }}
                                        >
                                          ★ Estado Actual ★
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }

                                if (status === 'completed') {
                                  return (
                                    <div
                                      key={idx}
                                      style={{
                                        backgroundColor: '#f0fdf4',
                                        borderColor: '#86efac',
                                        color: '#166534'
                                      }}
                                      className="p-2 border rounded-xs text-center transition-all flex flex-col justify-between"
                                    >
                                      <div className="flex items-center justify-center gap-1 mb-1 text-[11px]">
                                        <Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" />
                                        <span className="font-mono font-bold text-green-800">{idx + 1}.</span>
                                      </div>
                                      <div className="text-[10px] leading-snug text-green-900 font-semibold">
                                        {step.label}
                                      </div>
                                      <div className="text-[9px] text-green-600 font-bold uppercase mt-1">
                                        ✓ Completado
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      backgroundColor: '#f8fafc',
                                      borderColor: '#e2e8f0',
                                      color: '#94a3b8'
                                    }}
                                    className="p-2 border rounded-xs text-center transition-all flex flex-col justify-between"
                                  >
                                    <div className="flex items-center justify-center gap-1 mb-1 text-[11px] font-mono text-gray-400">
                                      <span>{idx + 1}.</span>
                                    </div>
                                    <div className="text-[10px] leading-snug text-gray-400 font-medium">
                                      {step.label}
                                    </div>
                                    <div className="text-[9px] text-gray-400 font-mono mt-1">
                                      Pendiente
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Lista de Prendas Compradas en este Pedido */}
                          <div className="space-y-2 pt-1">
                            <div className="text-[11px] font-bold text-gray-700">Prendas de esta Compra:</div>
                            {order.items.map((item, idx) => {
                              const isReviewed = reviewedProductIds.includes(item.productId);
                              const isDeliveredOrPickedUp =
                                order.currentStatus === 'Entregado' || order.currentStatus === 'Retirado';

                              return (
                                <div
                                  key={idx}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-white border border-gray-300"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-12 h-12 object-cover border border-gray-400 shrink-0"
                                    />
                                    <div>
                                      <h5 className="font-bold text-xs text-gray-900">{item.title}</h5>
                                      <div className="text-[11px] text-gray-500">
                                        Talla: <strong className="text-gray-700">{item.size}</strong> · Color:{' '}
                                        <strong className="text-gray-700">{item.color}</strong> · Cantidad:{' '}
                                        <strong className="text-gray-700">{item.quantity}</strong>
                                      </div>
                                      <div className="text-[11px] font-bold text-red-700">
                                        ${item.price.toLocaleString('es-CL')} CLP
                                      </div>
                                    </div>
                                  </div>

                                  {/* Botón de Solicitud de Devolución con regla de 7 días */}
                                  <div className="shrink-0 sm:text-right">
                                    {(() => {
                                      const isDeliveredOrPickedUp =
                                        order.currentStatus === 'Entregado' || order.currentStatus === 'Retirado';
                                      const existingReturn = returnRequests.find(
                                        r => r.orderNumber === order.orderNumber && r.productId === item.productId
                                      );

                                      // Caso 1: Ya existe una devolución registrada para este producto
                                      if (existingReturn) {
                                        const isRejected = existingReturn.currentStatus === 'Rechazada' || !!existingReturn.rejectionReason;
                                        if (isRejected) {
                                          return (
                                            <div className="flex flex-col items-start sm:items-end gap-1">
                                              <button
                                                type="button"
                                                onClick={() => setRejectionModalReturn(existingReturn)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 hover:bg-red-200 border border-red-500 text-red-900 rounded-xs text-xs font-bold shadow-xs cursor-pointer transition-colors"
                                                title="Hacer clic para ver el motivo del rechazo en una ventanita"
                                              >
                                                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                                <span>Devolución rechazada</span>
                                                <span className="text-[10px] text-red-700 underline font-semibold ml-0.5">(Ver motivo)</span>
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => setRejectionModalReturn(existingReturn)}
                                                className="winxp-button text-[11px] py-0.5 px-2.5 font-bold text-red-800 hover:bg-red-50 border-red-400 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                                                title="Ver ventanita con el motivo del rechazo de la devolución"
                                              >
                                                <span>Ver motivo del rechazo</span>
                                                <span className="text-[10px]">🔍</span>
                                              </button>
                                            </div>
                                          );
                                        }

                                        // Devolución aprobada o en proceso: sólo mostrar que ya se hizo la devolución y que está aprobada, sin el ticket ni el enlace redundante a Devoluciones
                                        const isApproved = existingReturn.currentStatus === 'Aprobada';
                                        return (
                                          <div className="flex flex-col items-start sm:items-end gap-1">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-emerald-500 text-emerald-900 rounded-xs text-xs font-bold shadow-xs">
                                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                              <span>Ya se hizo la devolución</span>
                                            </div>
                                            <span className="text-[10px] text-emerald-700 font-semibold">
                                              {isApproved ? 'Devolución Aprobada' : `Estado: ${existingReturn.currentStatus}`}
                                            </span>
                                          </div>
                                        );
                                      }

                                      // Caso 2: El pedido aún NO ha sido Retirado ni Entregado -> NO se puede devolver
                                      if (!isDeliveredOrPickedUp) {
                                        return (
                                          <div className="flex flex-col items-start sm:items-end gap-1">
                                            <button
                                              type="button"
                                              disabled
                                              className="winxp-button text-xs py-1.5 px-3 font-medium flex items-center gap-1.5 cursor-not-allowed opacity-60 bg-gray-100 text-gray-500 border-gray-300 select-none"
                                              title="La solicitud de devolución sólo está disponible cuando la prenda ha sido Entregada o Retirada"
                                            >
                                              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                              <span>Disponible tras entrega o retiro</span>
                                            </button>
                                            <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                                              <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                                              Disponible solo al ser Retirado o Entregado
                                            </span>
                                          </div>
                                        );
                                      }

                                      // Caso 3: El pedido fue Entregado o Retirado -> se verifica la garantía de 7 días
                                      const returnEligibility = getReturnEligibility(order.date);

                                      if (returnEligibility.isEligible) {
                                        return (
                                          <div className="flex flex-col items-start sm:items-end gap-1">
                                            <button
                                              type="button"
                                              onClick={() => handleOpenDirectReturnModal(order, item)}
                                              className="winxp-button winxp-button-primary text-xs py-1.5 px-3 font-bold flex items-center gap-1.5 cursor-pointer shadow-xs bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-600"
                                              title="Iniciar solicitud de cambio o devolución pre-seleccionando esta prenda"
                                            >
                                              <RotateCcw className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                                              <span className="font-bold">Solicitud de Devolución</span>
                                              <span
                                                data-force-white
                                                style={{ color: '#ffffff' }}
                                                className="bg-blue-700 !text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 inline-flex items-center shadow-xs"
                                              >
                                                {returnEligibility.daysLeft} {returnEligibility.daysLeft === 1 ? 'día rest.' : 'días rest.'}
                                              </span>
                                            </button>
                                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                              Garantía de 7 días activa ({returnEligibility.statusLabel})
                                            </span>
                                          </div>
                                        );
                                      }

                                      return (
                                        <div className="flex flex-col items-start sm:items-end gap-1">
                                          <button
                                            type="button"
                                            disabled
                                            className="winxp-button text-xs py-1.5 px-3 font-medium flex items-center gap-1.5 cursor-not-allowed opacity-60 bg-gray-100 text-gray-500 border-gray-300 select-none"
                                            title="La opción se bloqueó porque han transcurrido más de 7 días desde la compra"
                                          >
                                            <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span>Solicitud de Devolución Bloqueada</span>
                                          </button>
                                          <span className="text-[10px] text-red-600 font-medium flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                                            Plazo de 7 días expirado (+{returnEligibility.daysElapsed} días desde la compra)
                                          </span>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* =================================================================
                2. PESTAÑA: PUNTOS ACUMULADOS & CANJE POR CUPONES
                ================================================================= */}
            {activeTab === 'points' && (
              <div className="space-y-4">
                {/* Notificación de Puntos / Canje */}
                {pointsNotification && (
                  <div className="p-2.5 bg-green-100 border-2 border-green-600 text-green-900 text-xs flex items-center justify-between rounded-xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-700 shrink-0" />
                      <span className="font-bold">{pointsNotification}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPointsNotification(null)}
                      className="text-green-800 hover:text-black font-bold text-sm px-1"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Banner de Saldo de Puntos (Rediseño Estilo Windows XP Luna / Rewards OS sin texto negro) */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, #0058ee 0%, #288eff 25%, #0055ea 75%, #003db3 100%)',
                    borderColor: '#002575',
                    boxShadow: '0 4px 12px rgba(0, 35, 120, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                  }}
                  className="p-4 border-2 rounded-xs winxp-bevel-out text-white space-y-3"
                >
                  {/* Fila Principal: Saldo y Regla Oficial */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.4)'
                        }}
                      >
                        <Award className="w-3.5 h-3.5" style={{ color: '#fef08a' }} />
                        <span style={{ color: '#ffffff' }}>Programa NoLimits Rewards OS</span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <h3
                          className="text-3xl font-black tracking-tight"
                          style={{
                            color: '#ffffff',
                            textShadow: '0 2px 5px rgba(0, 20, 80, 0.6)'
                          }}
                        >
                          {currentUser.loyaltyPoints} PUNTOS ACUMULADOS
                        </h3>
                      </div>

                      <div
                        className="text-xs font-medium flex flex-wrap items-center gap-1.5 pt-0.5"
                        style={{ color: '#ffffff' }}
                      >
                        <span style={{ color: '#ffffff' }}>Equivalen a</span>
                        <span
                          className="font-black text-sm px-2 py-0.5 rounded-xs shadow-xs"
                          style={{
                            backgroundColor: '#fef08a',
                            color: '#003db3',
                            border: '1px solid #fde047'
                          }}
                        >
                          ${(currentUser.loyaltyPoints * 10).toLocaleString('es-CL')} CLP
                        </span>
                        <span style={{ color: '#ffffff' }}>para canjear por cupones de compra oficiales.</span>
                      </div>
                    </div>

                    {/* Tarjeta Regla Oficial de Canje (Sin texto negro, contraste óptimo) */}
                    <div
                      className="p-3.5 rounded-xs border text-center shrink-0 sm:min-w-[210px] shadow-sm"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0, 30, 95, 0.75) 0%, rgba(0, 20, 70, 0.9) 100%)',
                        borderColor: 'rgba(255, 255, 255, 0.35)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                      }}
                    >
                      <div
                        className="text-[11px] uppercase font-bold tracking-wider"
                        style={{ color: '#bae6fd' }}
                      >
                        Regla Oficial:
                      </div>
                      <div
                        className="font-black text-lg my-1 tracking-tight"
                        style={{
                          color: '#fef08a',
                          textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
                        }}
                      >
                        1 Punto = $10 CLP
                      </div>
                      <div
                        className="text-[11px] font-semibold flex items-center justify-center gap-1"
                        style={{ color: '#ffffff' }}
                      >
                        <Sparkles className="w-3 h-3" style={{ color: '#67e8f9' }} />
                        <span style={{ color: '#ffffff' }}>Sin vencimiento de saldo</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra Inferior con Puntos Destacados */}
                  <div
                    className="pt-2.5 border-t flex flex-wrap items-center gap-2 text-[11px]"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.25)' }}
                  >
                    <div
                      className="px-2.5 py-1 rounded-xs flex items-center gap-1.5 font-medium shadow-xs"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <Camera className="w-3.5 h-3.5" style={{ color: '#fef08a' }} />
                      <span style={{ color: '#ffffff' }}>
                        <strong style={{ color: '#ffffff' }}>+100 Pts</strong> por reseña con fotos
                      </span>
                    </div>

                    <div
                      className="px-2.5 py-1 rounded-xs flex items-center gap-1.5 font-medium shadow-xs"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <Award className="w-3.5 h-3.5" style={{ color: '#67e8f9' }} />
                      <span style={{ color: '#ffffff' }}>Canje directo por cupones</span>
                    </div>

                    <div
                      className="px-2.5 py-1 rounded-xs flex items-center gap-1.5 font-medium shadow-xs"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: '#86efac' }} />
                      <span style={{ color: '#ffffff' }}>Aplicable en tu próximo checkout</span>
                    </div>
                  </div>
                </div>

                {/* ¿Cómo Ganar Más Puntos? */}
                <div className="p-3 bg-amber-50 border border-amber-300 text-xs space-y-1.5 winxp-bevel-in">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-700" />
                    <span>¿Cómo ganar puntos en NoLimits?</span>
                  </div>
                  <ul className="text-gray-700 text-[11px] space-y-1 pl-4 list-disc">
                    <li>
                      <strong className="text-blue-900">+100 Puntos:</strong> Por dejar una reseña con fotos reales
                      mostrando el calce de tus prendas compradas.
                    </li>
                    <li>
                      <strong className="text-blue-900">+20 Puntos:</strong> Por reseñas breves sin fotos.
                    </li>
                    <li>
                      <strong className="text-blue-900">Canje directo:</strong> Utiliza tus puntos en el catálogo de
                      cupones inferior y aplícalos directamente en el checkout.
                    </li>
                  </ul>
                </div>

                {/* Catálogo de Cupones Canjeables */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-300 pb-1.5">
                    <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Catálogo de Cupones Disponibles para Canje
                    </h4>
                    <span className="text-[11px] text-gray-500">Canje instantáneo</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AVAILABLE_COUPONS.map((coupon) => {
                      const canAfford = (currentUser.loyaltyPoints || 0) >= coupon.pointsCost;

                      return (
                        <div
                          key={coupon.id}
                          className="bg-white border-2 border-gray-300 p-3 space-y-2 winxp-bevel-out flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span
                                className="text-[10px] font-bold uppercase px-2 py-0.5 border rounded-xs shadow-xs"
                                style={{
                                  background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                                  borderColor: '#075985',
                                  color: '#ffffff'
                                }}
                              >
                                <span style={{ color: '#ffffff' }}>{coupon.badge}</span>
                              </span>
                              <span className="text-xs font-bold text-red-700 font-mono">
                                {coupon.pointsCost} Puntos
                              </span>
                            </div>
                            <h5 className="font-bold text-sm text-gray-900 mt-1">{coupon.title}</h5>
                            <p className="text-xs text-gray-600 mt-0.5">{coupon.discountDescription}</p>
                            <div className="text-[10px] text-gray-500 mt-1 font-mono">
                              Condición: {coupon.minPurchase}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200">
                            <button
                              type="button"
                              disabled={!canAfford}
                              onClick={() => handleRedeemCoupon(coupon)}
                              className={`w-full winxp-button text-xs py-1.5 px-3 font-bold cursor-pointer flex items-center justify-center gap-1.5 ${
                                canAfford
                                  ? 'winxp-button-primary text-blue-900 hover:bg-blue-100'
                                  : 'opacity-50 cursor-not-allowed text-gray-500 bg-gray-100'
                              }`}
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>
                                {canAfford
                                  ? `Canjear por ${coupon.pointsCost} Puntos`
                                  : `Faltan ${coupon.pointsCost - (currentUser.loyaltyPoints || 0)} Puntos`}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mis Cupones Canjeados */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5 border-b border-gray-300 pb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Mis Cupones Canjeados (Listos para Usar)
                  </h4>

                  {redeemedCoupons.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500 bg-gray-50 border border-gray-300">
                      Aún no has canjeado cupones. Selecciona uno del catálogo superior.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {redeemedCoupons.map((coupon, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-yellow-50/70 border border-yellow-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="font-bold text-gray-900">{coupon.title}</div>
                            <div className="text-[11px] text-gray-600">
                              Descuento: <span className="font-bold text-red-700">{coupon.discount}</span> · Canjeado el:{' '}
                              {coupon.date}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="bg-white border-2 border-dashed border-gray-500 font-mono font-bold text-xs px-2.5 py-1 select-all">
                              {coupon.code}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(coupon.code)}
                              className="winxp-button text-xs py-1 px-2.5 font-bold text-blue-900 flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3 text-blue-700" />
                              <span>{copiedCouponCode === coupon.code ? '¡Copiado!' : 'Copiar'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================================
                3. PESTAÑA: MIS RESEÑAS
                ================================================================= */}
            {/* =================================================================
                3. PESTAÑA: MIS RESEÑAS CON TABS (Tab 1: Pendientes, Tab 2: Realizadas)
                ================================================================= */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Cabecera Principal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-300 gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-blue-700" />
                      Mis Reseñas de la Comunidad
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Comparte fotos de tus prendas compradas y gana +100 puntos canjeables por cupones.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-green-900 font-bold bg-green-100 px-2.5 py-1 border border-green-600 rounded-xs flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-green-700" />
                      <span>Bono: +100 Pts con fotos reales</span>
                    </span>
                  </div>
                </div>

                {/* Barra de Pestañas (Sub-Tabs) Estilo Carpeta Windows XP */}
                <div className="flex border-b border-gray-300 gap-1 select-none pt-1">
                  <button
                    type="button"
                    onClick={() => setReviewsSubTab('pending')}
                    className={`px-3.5 py-1.5 text-xs font-bold border-t-2 border-x-2 rounded-t-xs transition-colors flex items-center gap-2 cursor-pointer ${
                      reviewsSubTab === 'pending'
                        ? 'bg-white border-blue-900 text-blue-900 -mb-px z-10 shadow-xs'
                        : 'bg-[#e4e2d5] border-gray-400 text-gray-700 hover:bg-[#eae8dc]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tab 1: Pendientes</span>
                    <span
                      data-force-white
                      style={{ color: '#ffffff' }}
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold !text-white ${
                        pendingReviewItems.length > 0 ? 'bg-amber-600' : 'bg-gray-500'
                      }`}
                    >
                      {pendingReviewItems.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewsSubTab('completed')}
                    className={`px-3.5 py-1.5 text-xs font-bold border-t-2 border-x-2 rounded-t-xs transition-colors flex items-center gap-2 cursor-pointer ${
                      reviewsSubTab === 'completed'
                        ? 'bg-white border-blue-900 text-blue-900 -mb-px z-10 shadow-xs'
                        : 'bg-[#e4e2d5] border-gray-400 text-gray-700 hover:bg-[#eae8dc]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                    <span>Tab 2: Realizadas</span>
                    <span
                      data-force-white
                      style={{ color: '#ffffff' }}
                      className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-green-700 !text-white"
                    >
                      {myPublishedReviews.length}
                    </span>
                  </button>
                </div>

                {/* CONTENIDO TAB 1: PENDIENTES (Compras realizadas sin reseñar) */}
                {reviewsSubTab === 'pending' && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="p-3 bg-amber-50 border border-amber-300 text-xs flex items-start gap-2.5 winxp-bevel-in">
                      <div className="p-1 bg-amber-100 border border-amber-400 text-amber-800 rounded-xs shrink-0 mt-0.5">
                        <Camera className="w-4 h-4 text-amber-700" />
                      </div>
                      <div className="space-y-0.5 text-gray-800">
                        <div className="font-bold text-amber-950 text-[11px]">
                          Compras Realizadas Disponibles para Calificar
                        </div>
                        <div className="text-[11px] text-gray-700 leading-relaxed">
                          Aquí se muestran las prendas de tus compras ya <strong>Entregadas</strong> o <strong>Retiradas</strong> que aún no has calificado. Deja tu reseña con fotos reales para acreditar <strong>+100 Puntos Rewards</strong> instantáneos.
                        </div>
                      </div>
                    </div>

                    {pendingReviewItems.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-600 bg-gray-50 border border-dashed border-gray-300 space-y-2 winxp-bevel-in">
                        <div className="w-10 h-10 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-700 border border-green-300">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-sm text-gray-800">¡Tus reseñas están al día!</div>
                        <p className="text-gray-500 max-w-md mx-auto">
                          No tienes compras pendientes por calificar en este momento. Cuando recibas nuevos pedidos completados aparecerán aquí.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingReviewItems.map((item, idx) => (
                          <div
                            key={`${item.productId}_${item.orderNumber}_${idx}`}
                            className="p-3 bg-white border border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 winxp-bevel-out shadow-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-16 h-16 object-cover border border-gray-400 bg-gray-100 shrink-0"
                              />
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-900 border border-green-500 uppercase">
                                    ✓ Compra Recibida (Orden #{item.orderNumber})
                                  </span>
                                  <span className="text-[10px] text-gray-500 font-mono">
                                    {item.orderDate}
                                  </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                  {item.title}
                                </h5>
                                <div className="text-[11px] text-gray-600 flex items-center gap-2">
                                  <span>Talla: <strong className="text-gray-800">{item.size}</strong></span>
                                  <span>·</span>
                                  <span>Color: <strong className="text-gray-800">{item.color}</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 flex flex-col sm:items-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-400 self-start sm:self-auto">
                                +100 Pts con fotos (+20 pts sin fotos)
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenReviewModal({ productId: item.productId, title: item.title, image: item.image }, item.orderNumber)}
                                className="winxp-button winxp-button-primary text-xs py-1.5 px-3.5 font-bold text-blue-900 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs w-full sm:w-auto"
                              >
                                <Camera className="w-3.5 h-3.5 text-blue-700" />
                                <span>Dejar Reseña con Fotos</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* CONTENIDO TAB 2: REALIZADAS (Compras que ya tienen calificación) */}
                {reviewsSubTab === 'completed' && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="p-3 bg-blue-50 border border-blue-300 text-xs flex items-start gap-2.5 winxp-bevel-in">
                      <div className="p-1 bg-blue-100 border border-blue-400 text-blue-800 rounded-xs shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-700" />
                      </div>
                      <div className="space-y-0.5 text-gray-800">
                        <div className="font-bold text-blue-950 text-[11px]">
                          Tus Reseñas Publicadas en NoLimits OS
                        </div>
                        <div className="text-[11px] text-gray-700 leading-relaxed">
                          Estas son las calificaciones que has compartido con la comunidad. Cada reseña con fotos te otorgó <strong>+100 Puntos</strong> directos a tu saldo para canjear por cupones.
                        </div>
                      </div>
                    </div>

                    {myPublishedReviews.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-600 bg-gray-50 border border-dashed border-gray-300 space-y-2 winxp-bevel-in">
                        <MessageSquare className="w-8 h-8 mx-auto text-gray-400" />
                        <div className="font-bold text-sm text-gray-800">No has publicado reseñas aún</div>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Dirígete al <strong>Tab 1: Pendientes</strong> para calificar tus prendas entregadas y sumar puntos rewards.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myPublishedReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-3.5 bg-white border border-gray-300 space-y-2.5 winxp-bevel-out shadow-xs text-xs"
                          >
                            {/* Cabecera de la reseña */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={rev.productImage}
                                  alt={rev.productTitle}
                                  className="w-12 h-12 object-cover border border-gray-400 shrink-0"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-xs text-blue-950">
                                      {rev.productTitle}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-mono">
                                      (Orden #{rev.orderNumber})
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    Publicado el {rev.date} · Compra Verificada
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <div className="flex text-amber-500 text-sm">
                                  {'★'.repeat(rev.rating)}
                                  {'☆'.repeat(5 - rev.rating)}
                                </div>
                                <span className="text-[10px] font-bold text-green-900 bg-green-100 px-2 py-0.5 border border-green-500 rounded-xs flex items-center gap-1">
                                  <Check className="w-3 h-3 text-green-700" />
                                  <span>+{rev.pointsEarned} Pts Acreditados</span>
                                </span>
                              </div>
                            </div>

                            {/* Título y comentario */}
                            <div className="space-y-1">
                              <div className="font-bold text-gray-900 text-xs">
                                "{rev.title}"
                              </div>
                              <p className="text-gray-700 leading-relaxed italic bg-[#fbfbfb] p-2 border border-gray-200">
                                "{rev.comment}"
                              </p>
                            </div>

                            {/* Fotos adjuntas por el usuario */}
                            {rev.photos && rev.photos.length > 0 && (
                              <div className="space-y-1 pt-1">
                                <div className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                                  <Camera className="w-3 h-3 text-blue-700" />
                                  <span>Fotos de la prenda ({rev.photos.length}):</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {rev.photos.map((photo, pIdx) => (
                                    <div key={pIdx} className="relative w-16 h-16 border border-gray-400 bg-black/5 overflow-hidden">
                                      <img
                                        src={photo}
                                        alt={`Foto ${pIdx + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* =================================================================
                4. PESTAÑA: LISTA DE DESEOS (Prendas Guardadas con Corazón)
                ================================================================= */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-300 gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                      Prendas Guardadas en Lista de Deseos
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Gestiona tus artículos favoritos guardados con el botón de corazón y agrégalos al carrito cuando desees.
                    </p>
                  </div>
                  <span className="text-xs bg-rose-50 text-rose-800 font-bold px-2.5 py-1 border border-rose-300 rounded-xs self-start sm:self-auto shadow-xs">
                    {wishlist.length} {wishlist.length === 1 ? 'prenda guardada' : 'prendas guardadas'}
                  </span>
                </div>

                {wishlist.length === 0 ? (
                  <div className="p-8 text-center bg-[#f8fafc] border border-gray-300 rounded-xs space-y-3 winxp-bevel-in">
                    <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shadow-inner">
                      <Heart className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-sm text-gray-900">Tu Lista de Deseos está vacía</h5>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        Ingresa a la página de detalle de cualquier producto del catálogo y presiona el botón de corazón para guardarlo en tu cuenta.
                      </p>
                    </div>
                    <Link
                      to="/catalog"
                      className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900 inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Explorar Catálogo →</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {wishlist.map((item) => {
                      const isSoldOut = item.totalStock <= 0;
                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-[#fbfaf5] border border-gray-300 rounded-xs flex flex-col justify-between winxp-bevel-out gap-2.5 hover:border-gray-400 transition-colors"
                        >
                          <div className="space-y-2">
                            <div className="relative aspect-square w-full overflow-hidden border border-gray-300 bg-white">
                              <img
                                src={item.images[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300'}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              {item.discountPercent && !isSoldOut && (
                                <span className="absolute top-1.5 left-1.5 bg-green-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-xs border border-green-800 shadow-xs">
                                  -{item.discountPercent}% OFF
                                </span>
                              )}
                              {isSoldOut && (
                                <span className="absolute top-1.5 right-1.5 bg-red-800 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-xs border border-red-900 shadow-xs">
                                  Agotado
                                </span>
                              )}
                            </div>

                            <div>
                              <div className="text-[10px] font-bold text-blue-700 uppercase">{item.category}</div>
                              <h5 className="font-bold text-xs text-gray-900 line-clamp-1" title={item.title}>
                                {item.title}
                              </h5>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-bold text-xs text-red-700">
                                  ${(item.salePrice ?? item.price).toLocaleString('es-CL')} CLP
                                </span>
                                {item.salePrice && (
                                  <span className="text-[10px] text-gray-500 line-through">
                                    ${item.price.toLocaleString('es-CL')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-1.5">
                              <Link
                                to={`/product/${item.id}`}
                                className="winxp-button text-[11px] py-1 px-2 font-bold text-gray-800 text-center flex items-center justify-center cursor-pointer"
                              >
                                Ver Detalle
                              </Link>
                              <button
                                type="button"
                                disabled={isSoldOut}
                                onClick={() => {
                                  addToCart(
                                    item,
                                    item.sizes[0] === 'Única (Ajustable)' ? 'Talla estándar' : item.sizes[0] || 'Talla estándar',
                                    item.colors[0] || { name: 'Void Black', hex: '#000000' },
                                    undefined,
                                    1
                                  );
                                }}
                                className={`winxp-button winxp-button-primary text-[11px] py-1 px-2 font-bold text-blue-900 text-center flex items-center justify-center gap-1 ${
                                  isSoldOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              >
                                <PixelIcon name="cart" size={12} />
                                <span>{isSoldOut ? 'Sin Stock' : 'Al Carro'}</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromWishlist(item.id)}
                              className="winxp-button text-[10px] py-0.5 px-2 w-full text-red-700 hover:text-red-900 flex items-center justify-center gap-1 cursor-pointer"
                              title="Quitar de mi Lista de Deseos"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                              <span>Quitar de la Lista</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =================================================================
                5. PESTAÑA: GESTIÓN DE DIRECCIONES (Múltiples Direcciones & Inyección a Checkout)
                ================================================================= */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-300 gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-700" />
                      Gestión de Direcciones de Despacho
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Administra múltiples domicilios y selecciona tu dirección predeterminada para el Checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="winxp-button winxp-button-primary text-xs py-1.5 px-3 font-bold text-blue-900 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isAddingAddress ? 'Cerrar Formulario' : 'Agregar Nueva Dirección'}</span>
                  </button>
                </div>

                {/* Notificación de éxito */}
                {addressSuccessMessage && (
                  <div className="p-2.5 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2 rounded-xs animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                    <span className="font-bold">{addressSuccessMessage}</span>
                  </div>
                )}

                {/* Banner Informativo de Auto-Rellenado en Checkout */}
                <div className="p-3 bg-blue-50 border border-blue-300 text-xs flex items-start gap-2.5 winxp-bevel-in">
                  <div className="p-1 bg-blue-100 border border-blue-400 text-blue-800 rounded-xs shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-gray-800">
                    <div className="font-bold text-blue-900 text-[11px]">
                      Sincronización Directa con Pasarela de Compra
                    </div>
                    <div className="text-[11px] text-gray-600 leading-relaxed">
                      La dirección marcada como <strong className="text-green-800 font-bold">"Predeterminada"</strong> se inyecta automáticamente en los campos de entrega del <strong>Checkout</strong> al seleccionar despacho a domicilio, agilizando tu compra sin tener que volver a escribirla.
                    </div>
                  </div>
                </div>

                {/* Formulario para Agregar Nueva Dirección */}
                {isAddingAddress && (
                  <form
                    onSubmit={handleSaveNewAddress}
                    className="p-3.5 bg-[#f0f4f8] border-2 border-blue-400 space-y-3 winxp-bevel-out"
                  >
                    <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5 border-b border-gray-300 pb-1.5">
                      <Plus className="w-4 h-4 text-blue-700" />
                      <span>Registrar Nueva Dirección de Entrega</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Nombre o Alias de la Dirección:
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrAlias}
                          onChange={(e) => setNewAddrAlias(e.target.value)}
                          placeholder="Ej. Casa Playa, Oficina Viña, Depto Quilpué"
                          className="winxp-input w-full text-xs py-1"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Nombre del Destinatario:
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrRecipient}
                          onChange={(e) => setNewAddrRecipient(e.target.value)}
                          placeholder="Nombre y Apellido de quien recibe"
                          className="winxp-input w-full text-xs py-1"
                        />
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-gray-700 mb-1">
                            Calle / Avenida:
                          </label>
                          <input
                            type="text"
                            required
                            value={newAddrStreet}
                            onChange={(e) => setNewAddrStreet(e.target.value)}
                            placeholder="Ej. Av. Libertad, Calle Prat, Los Carrera"
                            className="winxp-input w-full text-xs py-1"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Número:
                          </label>
                          <input
                            type="text"
                            required
                            value={newAddrNumber}
                            onChange={(e) => setNewAddrNumber(e.target.value)}
                            placeholder="Ej. 1250"
                            className="winxp-input w-full text-xs py-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Depto / Block / Torre (Opcional):
                        </label>
                        <input
                          type="text"
                          value={newAddrApt}
                          onChange={(e) => setNewAddrApt(e.target.value)}
                          placeholder="Ej. Depto 402, Torre B"
                          className="winxp-input w-full text-xs py-1"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Comuna / Ciudad:
                        </label>
                        <select
                          value={newAddrComuna}
                          onChange={(e) => setNewAddrComuna(e.target.value)}
                          className="winxp-input w-full text-xs py-1 bg-white"
                        >
                          <option value="Viña del Mar">Viña del Mar (Región de Valparaíso)</option>
                          <option value="Valparaíso">Valparaíso (Región de Valparaíso)</option>
                          <option value="Quilpué">Quilpué (Región de Valparaíso)</option>
                          <option value="Villa Alemana">Villa Alemana (Región de Valparaíso)</option>
                          <option value="Concón">Concón (Región de Valparaíso)</option>
                          <option value="Santiago">Santiago (Región Metropolitana)</option>
                          <option value="Providencia">Providencia (Región Metropolitana)</option>
                          <option value="Las Condes">Las Condes (Región Metropolitana)</option>
                          <option value="Concepción">Concepción (Región del Biobío)</option>
                          <option value="Otra Comuna">Otra Comuna (Chile)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Teléfono de Contacto:
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          placeholder="+56 9 1234 5678"
                          className="winxp-input w-full text-xs py-1"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Instrucciones para Despachador:
                        </label>
                        <input
                          type="text"
                          value={newAddrNotes}
                          onChange={(e) => setNewAddrNotes(e.target.value)}
                          placeholder="Ej. Timbre rojo, dejar con conserje"
                          className="winxp-input w-full text-xs py-1"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-300">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-900 select-none">
                        <input
                          type="checkbox"
                          checked={newAddrIsDefault}
                          onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                          className="winxp-checkbox"
                        />
                        <span>Establecer como dirección predeterminada para el Checkout</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="winxp-button text-xs py-1 px-3 text-gray-700 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="winxp-button winxp-button-primary text-xs py-1 px-4 font-bold text-blue-900 cursor-pointer"
                        >
                          Guardar Dirección
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Lista de Direcciones Guardadas */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-gray-700 flex items-center justify-between">
                    <span>Direcciones Guardadas ({addresses.length}):</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Haz clic en "Establecer como Predeterminada" para elegir cuál enviar al Checkout
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-3.5 border transition-all rounded-xs winxp-bevel-out ${
                          addr.isDefault
                            ? 'bg-[#f4fbf7] border-green-600 shadow-xs'
                            : 'bg-white border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-gray-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-blue-900">
                              {addr.alias}
                            </span>
                            {addr.isDefault ? (
                              <span
                                style={{
                                  background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)',
                                  borderColor: '#14532d',
                                  color: '#ffffff'
                                }}
                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 border rounded-xs shadow-xs"
                              >
                                <Check className="w-3 h-3" style={{ color: '#ffffff' }} />
                                <span style={{ color: '#ffffff' }}>★ PREDETERMINADA PARA CHECKOUT</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="winxp-button text-[11px] py-0.5 px-2 font-bold text-blue-900 hover:bg-blue-100 cursor-pointer"
                                title="Al marcarla, se auto-rellenará en tu próximo checkout"
                              >
                                Establecer como Predeterminada
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="winxp-button text-xs py-0.5 px-2 text-red-700 hover:text-red-900 cursor-pointer flex items-center gap-1"
                              title="Eliminar esta dirección"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>

                        {/* Detalles de la Dirección */}
                        <div className="pt-2 text-xs space-y-1 text-gray-700">
                          <div>
                            <strong className="text-gray-900">{addr.recipientName}</strong>
                            <span className="text-gray-500 font-mono text-[11px] ml-2">({addr.phone})</span>
                          </div>
                          <div className="text-gray-800 font-medium">
                            {addr.street} #{addr.number} {addr.apartment && `· ${addr.apartment}`}
                          </div>
                          <div className="text-gray-600">
                            {addr.comuna}, {addr.city} · {addr.region} {addr.postalCode && `(CP: ${addr.postalCode})`}
                          </div>
                          {addr.notes && (
                            <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xs inline-block mt-1">
                              Nota: {addr.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                6. PESTAÑA: DEVOLUCIONES (Estados Obligatorios & Horarios de Sucursales)
                Estados obligatorios: Solicitud recibida -> Revisión de equipo -> Aprobada -> Envió a punto/sucursal
                ================================================================= */}
            {activeTab === 'returns' && (
              <div className="space-y-5">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-300 gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-blue-700" />
                      Módulo Oficial de Devoluciones y Cambios de Talla
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Trazabilidad garantizada de estados y atención física presencial en sucursales.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const eligibleOrder =
                        orders.find(
                          o => (o.currentStatus === 'Entregado' || o.currentStatus === 'Retirado') && o.items.length > 0
                        ) || orders[0];
                      if (eligibleOrder && eligibleOrder.items.length > 0) {
                        setSelectedReturnOrder(eligibleOrder.orderNumber);
                        setSelectedReturnItem(eligibleOrder.items[0].productId);
                        setReturnTargetOrder(eligibleOrder);
                        setReturnTargetItem(eligibleOrder.items[0]);
                      }
                      setReturnModalStep('confirm');
                      setIsNewReturnModalOpen(true);
                    }}
                    className="winxp-button winxp-button-primary text-xs py-1.5 px-3.5 font-bold text-blue-900 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-700" />
                    <span>Iniciar Solicitud de Devolución</span>
                  </button>
                </div>

                {/* Notificación de Solicitud */}
                {returnSuccessMessage && (
                  <div className="p-2.5 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2 rounded-xs animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                    <span className="font-bold">{returnSuccessMessage}</span>
                  </div>
                )}

                {/* Banner de Garantía y Política Oficial */}
                <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-300 text-xs flex items-start gap-2.5 winxp-bevel-in">
                  <div className="p-1 bg-purple-100 border border-purple-400 text-purple-900 rounded-xs shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-gray-800">
                    <div className="font-bold text-purple-950 text-[11px]">
                      Garantía Legal de Satisfacción y Cambios Presenciales sin Costo
                    </div>
                    <div className="text-[11px] text-gray-600 leading-relaxed">
                      Tienes <strong>30 días continuos</strong> desde la entrega para cambios de talla o modelo. Si acudes físicamente a cualquiera de nuestras sucursales con tu solicitud aprobada, el cambio o nota de crédito se realiza en el acto sin gastos adicionales.
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 1: Solicitudes de Devolución Activas */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-300 pb-2 gap-2">
                    <div>
                      <h5 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                        <span>Mis Solicitudes de Devolución ({returnRequests.length}):</span>
                      </h5>
                      <span className="text-[10px] text-gray-500 font-mono">
                        Estados: Solicitud recibida → Revisión de equipo → Aprobado / Rechazado → Envió a punto/sucursal
                      </span>
                    </div>

                    {/* Botones de filtro rápido */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setReturnsFilter('all')}
                        className={`winxp-button text-[10px] py-0.5 px-2 font-bold cursor-pointer ${
                          returnsFilter === 'all'
                            ? 'winxp-button-primary bg-blue-100 text-blue-900 shadow-inner'
                            : 'text-gray-700'
                        }`}
                      >
                        Todas ({returnRequests.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReturnsFilter('in_progress')}
                        className={`winxp-button text-[10px] py-0.5 px-2 font-bold cursor-pointer ${
                          returnsFilter === 'in_progress'
                            ? 'winxp-button-primary bg-blue-100 text-blue-900 shadow-inner'
                            : 'text-gray-700'
                        }`}
                      >
                        En Revisión ({returnRequests.filter(r => r.currentStatus === 'Solicitud recibida' || r.currentStatus === 'Revisión de equipo').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReturnsFilter('approved')}
                        className={`winxp-button text-[10px] py-0.5 px-2 font-bold cursor-pointer ${
                          returnsFilter === 'approved'
                            ? 'winxp-button-primary bg-green-100 text-green-900 shadow-inner'
                            : 'text-gray-700'
                        }`}
                      >
                        Aprobadas ({returnRequests.filter(r => r.currentStatus === 'Aprobada' || r.currentStatus === 'Envió a punto/sucursal').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReturnsFilter('rejected')}
                        className={`winxp-button text-[10px] py-0.5 px-2 font-bold cursor-pointer ${
                          returnsFilter === 'rejected'
                            ? 'winxp-button-primary bg-red-100 text-red-900 shadow-inner'
                            : 'text-gray-700'
                        }`}
                      >
                        Rechazadas ({returnRequests.filter(r => r.currentStatus === 'Rechazada').length})
                      </button>
                    </div>
                  </div>

                  {filteredReturnRequests.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-300">
                      No hay solicitudes registradas bajo el filtro seleccionado.
                    </div>
                  ) : (
                    filteredReturnRequests.map((ret) => (
                      <div
                        key={ret.id}
                        className={`p-3.5 space-y-3 winxp-bevel-out shadow-xs border ${
                          ret.currentStatus === 'Rechazada'
                            ? 'bg-[#fffbfa] border-red-300'
                            : 'bg-[#fafbfc] border-gray-400'
                        }`}
                      >
                        {/* Cabecera del Caso */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-300 pb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-purple-950 font-mono">
                                Ticket #{ret.ticketNumber}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 border bg-purple-100 text-purple-900 border-purple-400">
                                {ret.reason}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                (Orden #{ret.orderNumber})
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              Ingresado: {ret.requestDate} · Sucursal asignada: <strong className="text-gray-700">{ret.targetBranchName}</strong>
                            </div>
                          </div>

                          {/* Badge de Estado Actual Oficial de Devolución */}
                          <div className="shrink-0">
                            {(() => {
                              let bg = 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)';
                              let border = '#075985';
                              let icon = Clock;

                              if (ret.currentStatus === 'Revisión de equipo') {
                                bg = 'linear-gradient(180deg, #4f46e5 0%, #4338ca 100%)';
                                border = '#312e81';
                                icon = Sparkles;
                              } else if (ret.currentStatus === 'Aprobada') {
                                bg = 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)';
                                border = '#14532d';
                                icon = Check;
                              } else if (ret.currentStatus === 'Envió a punto/sucursal') {
                                bg = 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)';
                                border = '#92400e';
                                icon = Store;
                              } else if (ret.currentStatus === 'Rechazada') {
                                bg = 'linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)';
                                border = '#7f1d1d';
                                icon = X;
                              }

                              const IconComp = icon;

                              return (
                                <span
                                  style={{
                                    background: bg,
                                    borderColor: border,
                                    color: '#ffffff',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)'
                                  }}
                                  className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 border rounded-xs select-none"
                                >
                                  <IconComp className="w-3.5 h-3.5 shrink-0" style={{ color: '#ffffff' }} />
                                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                                    {ret.currentStatus === 'Rechazada' ? 'Devolución Rechazada' : ret.currentStatus}
                                  </span>
                                </span>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Prenda Involucrada */}
                        <div className="flex items-center gap-3 p-2 bg-white border border-gray-300">
                          <img
                            src={ret.productImage}
                            alt={ret.productTitle}
                            className="w-12 h-12 object-cover border border-gray-400 shrink-0"
                          />
                          <div className="text-xs">
                            <h5 className="font-bold text-gray-900">{ret.productTitle}</h5>
                            <div className="text-[11px] text-gray-500">
                              Talla original: <strong className="text-gray-700">{ret.productSize}</strong>
                              {ret.requestedSize && (
                                <> · Talla solicitada para cambio: <strong className="text-blue-700">{ret.requestedSize}</strong></>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-600 italic mt-0.5">
                              "{ret.notes}"
                            </div>
                          </div>
                        </div>

                        {/* =========================================================
                            LÍNEA DE ESTADOS OBLIGATORIOS PARA DEVOLUCIONES:
                            Solicitud recibida -> Revisión de equipo -> Aprobado / Rechazado -> Envió a punto/sucursal
                            ========================================================= */}
                        <div className="bg-white border border-gray-300 p-2.5 space-y-2">
                          <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                            <span>Línea Oficial de Estado de Devolución:</span>
                            <span className="text-purple-900 font-mono text-[10px]">
                              Resolución Máxima: 24 a 48 hrs hábiles
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 pt-1">
                            {RETURN_STATUS_STEPS.map((step, idx) => {
                              const stepStatus = getReturnStepStatus(ret.currentStatus, idx);

                              // Estado rechazado específicamente para el Paso 3 (Aprobado / Rechazado)
                              if (stepStatus === 'rejected') {
                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      background: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 45%, #991b1b 50%, #7f1d1d 100%)',
                                      borderColor: '#450a0a',
                                      color: '#ffffff',
                                      boxShadow: '0 2px 5px rgba(120, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                                    }}
                                    className="p-2 border rounded-xs text-center transition-all flex flex-col justify-between"
                                  >
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                      <X className="w-3.5 h-3.5 text-white stroke-[3]" />
                                      <span className="font-mono text-[11px] font-black" style={{ color: '#ffffff' }}>
                                        {idx + 1}.
                                      </span>
                                    </div>
                                    <div
                                      className="text-[11px] leading-snug font-bold tracking-tight my-0.5"
                                      style={{ color: '#ffffff' }}
                                    >
                                      Rechazada por Admin
                                    </div>
                                    <div className="pt-1">
                                      <span
                                        className="inline-block px-1.5 py-0.5 text-[9px] uppercase font-black tracking-wider rounded-xs shadow-xs"
                                        style={{
                                          backgroundColor: '#ffffff',
                                          color: '#b91c1c',
                                          boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }}
                                      >
                                        ✕ Rechazada ✕
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              // Estado cancelado o no aplicable (Paso 4 cuando la devolución fue rechazada)
                              if (stepStatus === 'cancelled') {
                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      backgroundColor: '#f1f5f9',
                                      borderColor: '#cbd5e1',
                                      color: '#94a3b8'
                                    }}
                                    className="p-2 border rounded-xs text-center transition-all flex flex-col justify-between opacity-75"
                                  >
                                    <div className="flex items-center justify-center gap-1 mb-1 text-[11px] font-mono text-gray-400">
                                      <span>{idx + 1}.</span>
                                    </div>
                                    <div className="text-[10px] leading-snug text-gray-400 font-medium line-through">
                                      {step.label}
                                    </div>
                                    <div className="text-[9px] text-gray-400 font-mono mt-1 italic">
                                      No Aplica (Rechazada)
                                    </div>
                                  </div>
                                );
                              }

                              if (stepStatus === 'current') {
                                const stepText = idx === 2 && ret.currentStatus === 'Aprobada'
                                  ? '3. Aprobada por Admin'
                                  : step.label;

                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      background: 'linear-gradient(180deg, #1e69de 0%, #0050cf 45%, #003fb5 50%, #002d8f 100%)',
                                      borderColor: '#06266f',
                                      color: '#ffffff',
                                      boxShadow: '0 2px 5px rgba(0, 30, 90, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                                    }}
                                    className="p-2 border rounded-xs text-center transition-all flex flex-col justify-between"
                                  >
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                      <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-ping" />
                                      <span className="font-mono text-[11px] font-black" style={{ color: '#ffffff' }}>
                                        {idx + 1}.
                                      </span>
                                    </div>
                                    <div
                                      className="text-[11px] leading-snug font-bold tracking-tight my-0.5"
                                      style={{ color: '#ffffff' }}
                                    >
                                      {stepText}
                                    </div>
                                    <div className="pt-1">
                                      <span
                                        className="inline-block px-1.5 py-0.5 text-[9px] uppercase font-black tracking-wider rounded-xs shadow-xs"
                                        style={{
                                          backgroundColor: '#ffffff',
                                          color: '#003fb5',
                                          boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }}
                                      >
                                        ★ Estado Actual ★
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              if (stepStatus === 'completed') {
                                const completedLabel = idx === 2 ? '3. Aprobada' : step.label;
                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      backgroundColor: '#f0fdf4',
                                      borderColor: '#86efac',
                                      color: '#166534'
                                    }}
                                    className="p-2 border rounded-xs text-center transition-all flex flex-col justify-between"
                                  >
                                    <div className="flex items-center justify-center gap-1 mb-1 text-[11px]">
                                      <Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" />
                                      <span className="font-mono font-bold text-green-800">{idx + 1}.</span>
                                    </div>
                                    <div className="text-[10px] leading-snug text-green-900 font-semibold">
                                      {completedLabel}
                                    </div>
                                    <div className="text-[9px] text-green-600 font-bold uppercase mt-1">
                                      ✓ Completado
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={idx}
                                  style={{
                                    backgroundColor: '#f8fafc',
                                    borderColor: '#e2e8f0',
                                    color: '#94a3b8'
                                  }}
                                  className="p-2 border rounded-xs text-center transition-all flex flex-col justify-between"
                                >
                                  <div className="flex items-center justify-center gap-1 mb-1 text-[11px] font-mono text-gray-400">
                                    <span>{idx + 1}.</span>
                                  </div>
                                  <div className="text-[10px] leading-snug text-gray-400 font-medium">
                                    {step.label}
                                  </div>
                                  <div className="text-[9px] text-gray-400 font-mono mt-1">
                                    Pendiente
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* EXPLICACIÓN OFICIAL DEL RECHAZO (en caso de que administrador rechace la devolución) */}
                        {ret.currentStatus === 'Rechazada' && (
                          <div className="p-3 bg-red-50 border-2 border-red-500 text-xs space-y-2 winxp-bevel-out">
                            <div className="flex items-center justify-between border-b border-red-200 pb-1.5">
                              <div className="font-bold text-red-900 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                                <span className="font-bold">
                                  Explicación Oficial del Rechazo por el Administrador:
                                </span>
                              </div>
                              {ret.rejectionDate && (
                                <span className="text-[10px] font-mono text-red-700 bg-red-100 px-1.5 py-0.5 border border-red-300">
                                  {ret.rejectionDate}
                                </span>
                              )}
                            </div>

                            <div className="p-2.5 bg-white border border-red-300 text-gray-800 leading-relaxed space-y-1.5 shadow-inner">
                              <div className="text-[11px] font-bold text-red-950 flex items-center gap-1">
                                <span>Dictamen de Inspección de Calidad:</span>
                              </div>
                              <p className="text-xs text-gray-700 italic">
                                "{ret.rejectionReason || 'La prenda no cumple con las condiciones mínimas para cambio o garantía legal (debe conservar etiquetas originales, sin indicios de uso ni lavado).'}"
                              </p>
                              {ret.adminInspector && (
                                <div className="pt-1.5 border-t border-gray-200 text-[10px] text-gray-500 flex items-center justify-between font-mono">
                                  <span>Responsable: {ret.adminInspector}</span>
                                  <span className="text-red-700 font-bold uppercase tracking-wider">
                                    Ticket No Aprobado
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5 text-[11px] text-red-900">
                              <span>
                                Si necesitas mayor información o apelar esta resolución, contáctanos indicando el Ticket <strong>#{ret.ticketNumber}</strong>.
                              </span>
                              <span className="font-bold text-red-700 text-[10px] uppercase font-mono">
                                Estado Final: Rechazado
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Indicación de Entrega Física */}
                        {(ret.currentStatus === 'Aprobada' || ret.currentStatus === 'Envió a punto/sucursal') && (
                          <div className="p-2.5 bg-amber-50 border border-amber-300 text-xs flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Store className="w-4 h-4 text-amber-700 shrink-0" />
                              <span className="text-amber-950 font-medium">
                                Ya puedes acudir a <strong>{ret.targetBranchName}</strong> para entregar tu prenda y retirar tu cambio.
                              </span>
                            </div>
                            <span className="text-[10px] uppercase font-bold bg-amber-200 text-amber-900 px-2 py-0.5 border border-amber-400 shrink-0">
                              Atención Habilitada
                            </span>
                          </div>
                        )}

                        {/* Fotos Adjuntas de Respaldo */}
                        {ret.photos && ret.photos.length > 0 && (
                          <div className="p-2 bg-gray-50 border border-gray-200 rounded-xs space-y-1">
                            <div className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                              <Camera className="w-3 h-3 text-blue-700" />
                              <span>Fotos de respaldo adjuntadas ({ret.photos.length}/6):</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {ret.photos.map((ph, pIdx) => (
                                <img
                                  key={pIdx}
                                  src={ph}
                                  alt={`Foto respaldo ${pIdx + 1}`}
                                  className="w-12 h-12 object-cover border border-gray-300 rounded-xs shadow-xs"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* =========================================================
                    SECCIÓN 2: COMPONENTE DE HORARIOS DE ATENCIÓN DE SUCURSALES FÍSICAS
                    (Si el cliente debe acudir presencialmente)
                    ========================================================= */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-gray-300 pb-1.5">
                    <h5 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-blue-700" />
                      <span>Horarios y Sucursales para Entrega / Retiro Presencial:</span>
                    </h5>
                    <span className="text-[11px] text-gray-500 font-mono">
                      Valparaíso · Viña del Mar · Quilpué
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                    {BRANCH_PHYSICAL_SCHEDULES.map((branch) => (
                      <div
                        key={branch.id}
                        className="p-3.5 bg-white border-2 border-gray-300 rounded-xs space-y-3 winxp-bevel-out flex flex-col justify-between"
                      >
                        <div>
                          {/* Insignia de Sucursal */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 border border-blue-400">
                              {branch.badge}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                              {branch.city}
                            </span>
                          </div>

                          <h6 className="font-bold text-xs text-gray-900 leading-snug">
                            {branch.name}
                          </h6>

                          <div className="text-[11px] text-gray-600 mt-1 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                            <span>{branch.address}</span>
                          </div>

                          {/* Tabla de Horarios Semanales */}
                          <div className="mt-2.5 p-2 bg-[#f8fafc] border border-gray-300 text-[11px] space-y-1">
                            <div className="font-bold text-blue-950 flex items-center gap-1 border-b border-gray-200 pb-0.5">
                              <Clock className="w-3 h-3 text-blue-700" />
                              <span>Horarios Oficiales de Atención:</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                              <span>Lun - Vie:</span>
                              <strong className="text-gray-900">{branch.scheduleWeekdays.replace('Lunes a Viernes: ', '')}</strong>
                            </div>
                            <div className="flex justify-between text-gray-700">
                              <span>Sábado:</span>
                              <strong className="text-gray-900">{branch.scheduleSaturday.replace('Sábados: ', '')}</strong>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Domingo:</span>
                              <span className="italic">{branch.scheduleSunday.replace('Domingos: ', '').replace('Domingos y Feriados: ', '')}</span>
                            </div>
                          </div>

                          {/* Contacto Directo */}
                          <div className="mt-2 text-[11px] text-gray-600 space-y-0.5">
                            <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                              <Phone className="w-3 h-3 text-blue-700" />
                              <span>WhatsApp: {branch.whatsapp}</span>
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Encargado: {branch.leadContact}
                            </div>
                          </div>
                        </div>

                        {/* Instrucción Específica */}
                        <div className="pt-2 border-t border-gray-200 text-[10px] text-gray-600 bg-gray-50 p-1.5 border border-gray-200 mt-2">
                          <strong className="text-gray-800">Protocolo de entrega:</strong> {branch.returnInstructions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                7. PESTAÑA: CONFIGURACIÓN (Formulario de Perfil Oficial)
                Nombre, Apellido, Rut (Obligatorio para envíos), Correo, Teléfono, Foto Perfil
                ================================================================= */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-300 gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-blue-700" />
                      Configuración del Perfil de Usuario
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Actualiza tu información personal, documento oficial de despacho y foto de perfil.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 border border-blue-400 self-start sm:self-auto">
                    ID: {currentUser.id}
                  </span>
                </div>

                {/* Mensaje de Éxito */}
                {profileSuccessMsg && (
                  <div className="p-3 bg-green-100 border border-green-500 text-green-950 text-xs flex items-center gap-2 rounded-xs animate-in fade-in shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                    <span className="font-bold">{profileSuccessMsg}</span>
                  </div>
                )}

                {/* Mensaje de Error */}
                {profileErrorMsg && (
                  <div className="p-3 bg-red-100 border border-red-500 text-red-950 text-xs flex items-center gap-2 rounded-xs animate-in fade-in shadow-xs">
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    <span className="font-bold">{profileErrorMsg}</span>
                  </div>
                )}

                {/* Banner de Sincronización Automática con Despacho y Checkout */}
                <div className="p-3 bg-blue-50 border border-blue-300 text-xs flex items-start gap-2.5 winxp-bevel-in">
                  <div className="p-1 bg-blue-100 border border-blue-400 text-blue-800 rounded-xs shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-gray-800">
                    <div className="font-bold text-blue-950 text-[11px]">
                      Sincronización Directa con Envíos y Boleta Electrónica
                    </div>
                    <div className="text-[11px] text-gray-600 leading-relaxed">
                      El <strong className="text-blue-900">RUT es obligatorio</strong> por normativa del Servicio de Impuestos Internos (SII) y por los operadores logísticos <strong>(Starken y Blue Express)</strong> para la emisión de la boleta y la entrega o retiro presencial de tus prendas.
                    </div>
                  </div>
                </div>

                {/* Formulario de Perfil */}
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* SECCIÓN 1: FOTO DE PERFIL */}
                  <div className="p-3.5 bg-[#f8fafc] border border-gray-300 space-y-3 winxp-bevel-out">
                    <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-700" />
                      <span>Foto de Perfil del Usuario:</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Vista previa de la foto actual */}
                      <div className="relative shrink-0 text-center">
                        <div className="w-20 h-20 border-2 border-blue-900 bg-white shadow-md flex items-center justify-center overflow-hidden winxp-bevel-out mx-auto">
                          {profileAvatarUrl ? (
                            <img
                              src={profileAvatarUrl}
                              alt="Foto de perfil actual"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl">🦆</span>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-gray-500 mt-1 block uppercase tracking-wider">
                          Foto Actual
                        </span>
                      </div>

                      {/* Botones para cambiar la foto */}
                      <div className="space-y-2.5 flex-1 text-xs w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="winxp-button text-xs py-1.5 px-3 cursor-pointer flex items-center gap-1.5 font-bold text-blue-900 bg-white hover:bg-gray-50 shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-blue-700" />
                            <span>Subir Foto desde tu Equipo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarFileUpload}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setProfileAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80')}
                            className="winxp-button text-xs py-1.5 px-2.5 text-gray-700 cursor-pointer"
                            title="Restablecer a avatar por defecto"
                          >
                            Restablecer Avatar
                          </button>
                        </div>

                        {/* Colección de Avatares Streetwear Y2K listos con 1 clic */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            <span>O escoge un avatar de la colección NoLimits Y2K / Streetwear:</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {PRESET_AVATARS.map((preset) => (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => setProfileAvatarUrl(preset.url)}
                                className={`w-10 h-10 border-2 rounded-xs overflow-hidden cursor-pointer transition-all ${
                                  profileAvatarUrl === preset.url
                                    ? 'border-blue-600 ring-2 ring-blue-300 scale-105 shadow-sm'
                                    : 'border-gray-300 hover:border-gray-500 opacity-80 hover:opacity-100'
                                }`}
                                title={preset.name}
                              >
                                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN 2: INFORMACIÓN PERSONAL Y DE ENVÍO */}
                  <div className="p-3.5 bg-white border border-gray-300 space-y-3 winxp-bevel-out">
                    <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                      <UserIcon className="w-4 h-4 text-blue-700" />
                      <span>Datos Personales y Documento Oficial:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      {/* Nombre - Máximo 50 caracteres */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-gray-800">
                            Nombre: <span className="text-red-600 font-bold">*</span>
                          </label>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {profileFirstName.length}/50
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={50}
                          value={profileFirstName}
                          onChange={handleFirstNameChange}
                          placeholder="Ej. Valeria"
                          className="winxp-input w-full text-xs py-1.5 bg-white"
                        />
                      </div>

                      {/* Apellido - Máximo 50 caracteres */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-gray-800">
                            Apellido: <span className="text-red-600 font-bold">*</span>
                          </label>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {profileLastName.length}/50
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={50}
                          value={profileLastName}
                          onChange={handleLastNameChange}
                          placeholder="Ej. Gallardo"
                          className="winxp-input w-full text-xs py-1.5 bg-white"
                        />
                      </div>

                      {/* RUT (Separación automática con "." y "-") */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-blue-950 flex items-center gap-1">
                            <span>RUT:</span>
                            <span className="text-red-600 font-bold">*</span>
                          </label>
                          <span className="text-[10px] text-gray-500 font-mono font-bold">
                            {profileRut.replace(/[^0-9kK]/g, '').length}/9 dígitos
                          </span>
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          required
                          maxLength={12}
                          value={profileRut}
                          onChange={handleRutChange}
                          placeholder="Ej. 19.876.543-2"
                          className="winxp-input w-full text-xs py-1.5 bg-white font-mono font-bold tracking-wider"
                        />
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-gray-500">
                            Separación automática con "." y "-" (ej: 19.876.543-2).
                          </span>
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 border border-amber-400">
                            Obligatorio para envíos
                          </span>
                        </div>
                      </div>

                      {/* Correo */}
                      <div>
                        <label className="block font-bold text-gray-800 mb-1">
                          Correo Electrónico: <span className="text-red-600 font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          placeholder="valeria.cyber@gmail.com"
                          className="winxp-input w-full text-xs py-1.5 bg-white"
                        />
                        <span className="text-[10px] text-gray-500 mt-0.5 block">
                          Recibirás confirmaciones de compra y boletas del drop.
                        </span>
                      </div>

                      {/* Teléfono Móvil - Separación automática (ejemplo: 9 5689 6328) */}
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-gray-800">
                            Teléfono Móvil: <span className="text-red-600 font-bold">*</span>
                          </label>
                          <span className="text-[10px] text-gray-500 font-mono font-bold">
                            {profilePhone.replace(/\D/g, '').length}/9 dígitos
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="winxp-input bg-gray-100 text-gray-700 px-2 py-1.5 font-mono text-xs select-none flex items-center shrink-0 border border-gray-300">
                            🇨🇱 +56
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            required
                            maxLength={11}
                            value={profilePhone}
                            onChange={handlePhoneChange}
                            placeholder="Ej. 9 5689 6328"
                            className="winxp-input flex-1 text-xs py-1.5 bg-white font-mono tracking-wider font-semibold"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-0.5 block">
                          Separación automática de números (ejemplo: 9 5689 6328). Notificación de despacho o retiro.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2 border-t border-gray-300">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentUser) {
                          const rawFirst = currentUser.firstName || (currentUser.name || '').split(' ')[0] || '';
                          const rawLast = currentUser.lastName || (currentUser.name || '').split(' ').slice(1).join(' ') || '';
                          setProfileFirstName(rawFirst.slice(0, 50));
                          setProfileLastName(rawLast.slice(0, 50));
                          setProfileRut(formatRutWithDotsAndDash(currentUser.rut || '198765432'));
                          setProfileEmail(currentUser.email || '');
                          setProfilePhone(formatChileanMobilePhone(currentUser.phone || '956896328'));
                          setProfileAvatarUrl(currentUser.avatarUrl || '');
                        }
                      }}
                      className="winxp-button text-xs py-1.5 px-3 text-gray-700 cursor-pointer w-full sm:w-auto"
                    >
                      Descartar Cambios
                    </button>
                    <button
                      type="submit"
                      className="winxp-button winxp-button-primary text-xs py-2 px-5 font-bold text-blue-900 flex items-center justify-center gap-2 cursor-pointer shadow-md w-full sm:w-auto"
                    >
                      <Save className="w-4 h-4 text-blue-700" />
                      <span>Guardar Cambios de Perfil</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </WindowFrame>

      {/* =========================================================================
          MODAL DE RESEÑA CON FOTOS (+100 PUNTOS GARANTIZADOS)
          ========================================================================= */}
      {reviewModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 animate-in fade-in">
          <div className="w-full max-w-lg bg-[#ece9d8] border-2 border-blue-900 shadow-2xl winxp-bevel-out">
            {/* Barra de Título Windows XP */}
            <div className="winxp-titlebar flex items-center justify-between px-2 py-1 select-none">
              <div className="winxp-titlebar-title flex items-center gap-1.5 text-xs text-white font-bold">
                <Camera className="w-3.5 h-3.5 text-yellow-300" />
                <span>Resena_Drop_Verificada.exe - [Ganar +100 Puntos Rewards]</span>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalProduct(null)}
                className="winxp-btn-ctrl winxp-btn-close w-4 h-4 text-[10px] font-bold text-white flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-4 space-y-3.5 bg-white text-xs text-gray-800">
              {reviewSuccessMessage ? (
                <div className="p-4 bg-green-50 border-2 border-green-600 text-green-900 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-700">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">¡Puntos Acreditados con Éxito!</h4>
                  <p className="text-xs">{reviewSuccessMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  {/* Prenda Seleccionada */}
                  <div className="flex items-center gap-3 p-2 bg-blue-50 border border-blue-200">
                    <img
                      src={reviewModalProduct.image}
                      alt={reviewModalProduct.title}
                      className="w-14 h-14 object-cover border border-blue-400 shrink-0"
                    />
                    <div>
                      <div className="text-[10px] text-blue-700 font-bold uppercase">
                        Compra Verificada (Orden #{reviewModalProduct.orderNumber})
                      </div>
                      <h4 className="font-bold text-xs text-gray-900">{reviewModalProduct.title}</h4>
                      <div className="text-[10px] text-gray-500">
                        Comparte fotos de tu prenda puesta o de los detalles para acreditar puntos.
                      </div>
                    </div>
                  </div>

                  {/* Calificación por Estrellas */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Calificación General:
                    </label>
                    <div className="flex items-center gap-1 text-lg">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-gray-600 ml-2">
                        {reviewRating === 5 ? '¡Excelente prenda!' : `${reviewRating} de 5 estrellas`}
                      </span>
                    </div>
                  </div>

                  {/* Título de la Reseña */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Título de la Reseña:
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Ej. Excelente confección y detalles Y2K nítidos"
                      className="winxp-input w-full text-xs py-1"
                    />
                  </div>

                  {/* Comentario */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Comentario sobre el Calce y Experiencia:
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Cuéntanos cómo te queda la talla, cómo se siente la tela y cómo combina con tu estilo..."
                      className="winxp-input w-full text-xs py-1 resize-none"
                    />
                  </div>

                  {/* Subida de Fotos Reales (Requisito para los 100 Puntos) */}
                  <div className="p-2.5 bg-[#f8fafc] border border-gray-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-blue-700" />
                        <span>Subir Fotos Reales (Obligatorio para los +100 Pts):</span>
                      </label>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 border rounded-xs ${
                          reviewPhotos.length > 0
                            ? 'bg-green-100 text-green-900 border-green-600'
                            : 'bg-yellow-100 text-yellow-900 border-yellow-500'
                        }`}
                      >
                        {reviewPhotos.length > 0
                          ? `✓ Bono +100 Pts Activado (${reviewPhotos.length} fotos)`
                          : '⚠️ Sin fotos = solo +20 pts'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="winxp-button text-xs py-1 px-3 cursor-pointer flex items-center gap-1.5 font-bold text-gray-800">
                        <Upload className="w-3.5 h-3.5 text-blue-700" />
                        <span>Seleccionar Foto Local</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleAddSampleStreetwearPhoto}
                        className="winxp-button text-xs py-1 px-3 text-purple-900 font-bold flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100"
                        title="Adjunta foto real demostrativa para probar el sistema de puntos de inmediato"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                        <span>Adjuntar Foto de Muestra</span>
                      </button>
                    </div>

                    {/* Previsualización de Fotos Adjuntadas */}
                    {reviewPhotos.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {reviewPhotos.map((photo, idx) => (
                          <div key={idx} className="relative group w-14 h-14 border border-gray-400 bg-white shadow-xs">
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setReviewPhotos(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold cursor-pointer"
                              title="Eliminar foto"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botones de Acción */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-300">
                    <button
                      type="button"
                      onClick={() => setReviewModalProduct(null)}
                      className="winxp-button text-xs py-1.5 px-3 text-gray-700 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {reviewSubmitting
                          ? 'Publicando y acreditando puntos...'
                          : reviewPhotos.length > 0
                          ? 'Publicar Reseña y Acreditar +100 Puntos'
                          : 'Publicar Reseña (+20 Pts)'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL PARA INICIAR NUEVA SOLICITUD DE DEVOLUCIÓN
          ========================================================================= */}
      {isNewReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 animate-in fade-in">
          <div className="w-full max-w-lg bg-[#ece9d8] border-2 border-blue-900 shadow-2xl winxp-bevel-out">
            {/* Barra de Título Windows XP */}
            <div className="winxp-titlebar flex items-center justify-between px-2 py-1 select-none">
              <div className="winxp-titlebar-title flex items-center gap-1.5 text-xs text-white font-bold">
                <RotateCcw className="w-3.5 h-3.5 text-yellow-300" />
                <span>
                  {returnModalStep === 'confirm'
                    ? 'Solicitud_de_Devolucion.exe - [¿Está seguro?]'
                    : 'Solicitud_de_Devolucion.exe - [Formulario de Solicitud]'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNewReturnModalOpen(false)}
                className="winxp-btn-ctrl winxp-btn-close w-4 h-4 text-[10px] font-bold text-white flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* PASO 1: PESTAÑA / VISTA "¿ESTÁ SEGURO?" */}
            {returnModalStep === 'confirm' && (
              <div className="p-4 space-y-4 bg-white text-xs text-gray-800">
                <div className="flex items-start gap-3 p-3 bg-amber-50 border-2 border-amber-400 rounded-xs winxp-bevel-in">
                  <div className="p-2 bg-amber-100 border border-amber-300 rounded-full shrink-0">
                    <HelpCircle className="w-6 h-6 text-amber-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-amber-950">
                      ¿Está seguro que desea solicitar una devolución o cambio?
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Estás a punto de iniciar una solicitud oficial de devolución o cambio para tu compra. Por favor verifica los detalles de la prenda y las condiciones de garantía antes de continuar.
                    </p>
                  </div>
                </div>

                {/* Previsualización del Producto Seleccionado */}
                {(() => {
                  const targetOrder = orders.find(o => o.orderNumber === selectedReturnOrder) || orders[0];
                  const targetItem = targetOrder?.items.find(i => i.productId === selectedReturnItem) || targetOrder?.items[0];
                  if (!targetItem) return null;

                  return (
                    <div className="border border-gray-300 p-3 bg-[#fbfaf5] rounded-xs space-y-2 winxp-bevel-out">
                      <div className="text-[11px] font-bold text-gray-700 flex items-center justify-between border-b border-gray-200 pb-1">
                        <span>Prenda sujeta a devolución:</span>
                        <span className="font-mono text-blue-900 font-bold">Orden #{targetOrder?.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={targetItem.image}
                          alt={targetItem.title}
                          className="w-16 h-16 object-cover border border-gray-400 bg-white p-0.5 rounded-xs shrink-0"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <h5 className="font-bold text-gray-900 text-xs truncate">{targetItem.title}</h5>
                          <div className="text-[11px] text-gray-600 flex flex-wrap gap-2">
                            <span>Talla: <strong>{targetItem.size}</strong></span>
                            <span>Color: <strong>{targetItem.color}</strong></span>
                            <span>Precio: <strong>${targetItem.price.toLocaleString('es-CL')} CLP</strong></span>
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            Garantía válida de 7 días activa
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Condiciones clave */}
                <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-950 text-[11px] space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-700" />
                    <span>Requisitos para que tu solicitud sea aprobada:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                    <li>La prenda debe encontrarse sin uso, sin lavar y con etiquetas originales.</li>
                    <li>Podrás elegir si prefieres cambio físico en sucursal o solicitar el cambio por envío a domicilio.</li>
                    <li>Podrás redactar observaciones y adjuntar hasta 6 fotos de la prenda.</li>
                  </ul>
                </div>

                {/* Botones de Confirmación "¿Está seguro?" */}
                <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-gray-300">
                  <button
                    type="button"
                    onClick={() => setIsNewReturnModalOpen(false)}
                    className="winxp-button text-xs py-1.5 px-4 text-gray-800 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gray-200"
                  >
                    <X className="w-3.5 h-3.5 text-red-600" />
                    <span>Rechazar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnModalStep('form')}
                    className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-700" />
                    <span>Aceptar y Continuar →</span>
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: FORMULARIO CON CAMPOS REQUERIDOS */}
            {returnModalStep === 'form' && (
              <form onSubmit={handleCreateReturnSubmit} className="p-4 space-y-3.5 bg-white text-xs text-gray-800 max-h-[85vh] overflow-y-auto">
                {/* Cabecera / Pestaña indicadora */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-900 text-white font-bold text-[10px] px-2 py-0.5 rounded-full font-mono">
                      Paso 2 de 2
                    </span>
                    <span className="font-bold text-xs text-blue-950">
                      Rellena los campos de la Solicitud:
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReturnModalStep('confirm')}
                    className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    ← Volver a "¿Está seguro?"
                  </button>
                </div>

                {/* Prenda seleccionada */}
                {selectedReturnOrder && selectedReturnItem && (
                  <div className="p-2.5 bg-blue-50 border border-blue-300 text-xs text-blue-950 flex items-center justify-between winxp-bevel-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                      <div>
                        <span className="font-bold">Prenda Seleccionada:</span>
                        <div className="text-[11px] text-blue-900 font-semibold truncate max-w-[280px]">
                          {orders.find(o => o.orderNumber === selectedReturnOrder)?.items.find(i => i.productId === selectedReturnItem)?.title || 'Prenda seleccionada'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-blue-700 text-white px-2 py-0.5 rounded-full shrink-0">
                      Orden #{selectedReturnOrder}
                    </span>
                  </div>
                )}

                {/* 1. Motivo de la Solicitud */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Motivo de la Solicitud: <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={selectedReturnReason}
                    onChange={(e) => setSelectedReturnReason(e.target.value as any)}
                    className="winxp-input w-full text-xs py-1.5 bg-white font-medium"
                    required
                  >
                    <option value="Cambio de Talla">Cambio de Talla (Ajuste de calce / fit)</option>
                    <option value="Falla de Fábrica">Falla de Fábrica / Detalle en costura</option>
                    <option value="Drop Insatisfecho">Drop Insatisfecho (Cambio por otro producto)</option>
                    <option value="Garantía Legal">Garantía Legal 6 meses (Ley 19.496)</option>
                  </select>
                </div>

                {/* 2. Sucursal Física para Entrega o Cambio: (en caso de la persona se la cambien en la sucursal o solicite el cambio por envío) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-800">
                    Sucursal Física para Entrega o Cambio: <span className="text-red-600">*</span>
                  </label>
                  <div className="text-[11px] text-gray-500 mb-1">
                    Elige si realizarás la entrega/cambio presencial en una sucursal física o solicitas el cambio por envío:
                  </div>

                  {/* Selector de Modalidad: Sucursal Física vs Envío */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReturnMethod('branch')}
                      className={`p-2 border rounded-xs text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        selectedReturnMethod === 'branch'
                          ? 'winxp-button-primary bg-blue-100 border-blue-700 text-blue-950 font-bold shadow-xs'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-blue-700" />
                      <span>Sucursal Física (Presencial)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedReturnMethod('shipping')}
                      className={`p-2 border rounded-xs text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        selectedReturnMethod === 'shipping'
                          ? 'winxp-button-primary bg-blue-100 border-blue-700 text-blue-950 font-bold shadow-xs'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 text-blue-700" />
                      <span>Cambio por Envío (Courier)</span>
                    </button>
                  </div>

                  {/* Desplegable de Sucursales Físicas si se eligió Sucursal */}
                  {selectedReturnMethod === 'branch' ? (
                    <div className="p-2.5 bg-blue-50/70 border border-blue-300 rounded-xs space-y-1.5 mt-2">
                      <label className="block text-[11px] font-bold text-blue-950">
                        Selecciona la Sucursal Física para Entrega o Cambio:
                      </label>
                      <select
                        value={selectedReturnBranch}
                        onChange={(e) => setSelectedReturnBranch(e.target.value)}
                        className="winxp-input w-full text-xs py-1.5 bg-white font-medium"
                      >
                        {BRANCH_PHYSICAL_SCHEDULES.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} — ({b.city}: {b.address}) · {b.scheduleWeekdays}
                          </option>
                        ))}
                      </select>
                      <div className="text-[10px] text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500 shrink-0" />
                        <span>Podrás acudir directamente una vez aprobada tu solicitud en los horarios informados.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xs space-y-1 mt-2">
                      <div className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Solicitud de Cambio o Devolución por Envío:</span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        Una vez aprobada tu solicitud, te enviaremos una orden de retiro o etiqueta prepagada de courier (Starken / Blue Express) a tu dirección registrada sin costo adicional.
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Observaciones adicionales */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    . Observaciones adicionales:
                  </label>
                  <textarea
                    rows={3}
                    value={selectedReturnNotes}
                    onChange={(e) => setSelectedReturnNotes(e.target.value)}
                    placeholder="Escribe la razón de la devolución, descripción de motivos o talla requerida..."
                    className="winxp-input w-full text-xs p-2 resize-none font-sans"
                  />
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Describe la razón de la devolución para agilizar la revisión del equipo NoLimits.
                  </div>
                </div>

                {/* 4. Fotos de Respaldo (Máximo 6 Fotos) */}
                <div className="space-y-2 pt-1 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-700" />
                      <span>Subir Fotos de Respaldo (Máximo 6 fotos):</span>
                    </label>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      returnPhotos.length >= 6 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {returnPhotos.length} / 6 fotos máximo
                    </span>
                  </div>

                  {/* Botones de Carga */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className={`winxp-button text-xs py-1 px-3 flex items-center gap-1.5 ${
                      returnPhotos.length >= 6 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'
                    }`}>
                      <Upload className="w-3.5 h-3.5 text-blue-700" />
                      <span>Examinar equipo...</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={returnPhotos.length >= 6}
                        onChange={handleReturnPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      disabled={returnPhotos.length >= 6}
                      onClick={handleAddSampleReturnPhoto}
                      className="winxp-button text-xs py-1 px-3 flex items-center gap-1.5 cursor-pointer hover:bg-gray-100 text-blue-900"
                      title="Agregar una foto de muestra rápida para probar"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-700" />
                      <span>+ Foto de muestra rápida</span>
                    </button>

                    {returnPhotos.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setReturnPhotos([])}
                        className="text-[11px] text-red-600 hover:underline font-semibold ml-auto cursor-pointer"
                      >
                        Limpiar fotos
                      </button>
                    )}
                  </div>

                  {/* Grid de Fotos Subidas (Hasta 6) */}
                  {returnPhotos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                      {returnPhotos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square border-2 border-gray-400 bg-black/5 overflow-hidden rounded-xs group winxp-bevel-out"
                        >
                          <img
                            src={photo}
                            alt={`Foto devolución ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveReturnPhoto(idx)}
                            className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs cursor-pointer"
                            title="Eliminar foto"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-0.5 left-0.5 bg-black/70 text-white text-[9px] font-mono px-1 rounded-xs">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-500 italic">
                    Puedes adjuntar fotos de la prenda completa, etiquetas y cualquier detalle o defecto (máx 6 fotos).
                  </p>
                </div>

                {/* Botones de Acción del Formulario */}
                <div className="pt-3 flex items-center justify-between border-t border-gray-300">
                  <button
                    type="button"
                    onClick={() => setReturnModalStep('confirm')}
                    className="winxp-button text-xs py-1.5 px-3.5 text-gray-800 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gray-200"
                  >
                    <X className="w-3.5 h-3.5 text-red-600" />
                    <span>Rechazar / Volver</span>
                  </button>

                  <button
                    type="submit"
                    className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-700" />
                    <span>Ingresar Solicitud de Devolución</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* =========================================================================
          VENTANITA MODAL CON EL MOTIVO DEL RECHAZO DE LA DEVOLUCIÓN
          ========================================================================= */}
      {rejectionModalReturn && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 animate-in fade-in">
          <div className="w-full max-w-md bg-[#ece9d8] border-2 border-red-900 shadow-2xl winxp-bevel-out">
            {/* Barra de Título Windows XP en tono de Advertencia/Error */}
            <div
              style={{
                background: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 45%, #991b1b 50%, #7f1d1d 100%)'
              }}
              className="winxp-titlebar flex items-center justify-between px-2 py-1 select-none text-white"
            >
              <div className="winxp-titlebar-title flex items-center gap-1.5 text-xs text-white font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-yellow-300" />
                <span>Motivo_Rechazo_Devolucion.exe - [Ticket #{rejectionModalReturn.ticketNumber}]</span>
              </div>
              <button
                type="button"
                onClick={() => setRejectionModalReturn(null)}
                className="winxp-btn-ctrl winxp-btn-close w-4 h-4 text-[10px] font-bold text-white flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Contenido de la Ventanita con Motivo Oficial */}
            <div className="p-4 space-y-3.5 bg-white text-xs text-gray-800">
              {/* Alerta Destacada */}
              <div className="p-3 bg-red-50 border-2 border-red-400 rounded-xs flex items-start gap-3 winxp-bevel-in">
                <div className="p-1.5 bg-red-100 border border-red-300 rounded-full shrink-0">
                  <X className="w-5 h-5 text-red-600 stroke-[3]" />
                </div>
                <div>
                  <div className="font-bold text-red-950 text-xs uppercase tracking-wide">
                    Dictamen Oficial: Devolución Rechazada
                  </div>
                  <div className="text-[11px] text-red-900 mt-0.5">
                    Ticket: <strong>#{rejectionModalReturn.ticketNumber}</strong> · Orden #{rejectionModalReturn.orderNumber}
                  </div>
                  {rejectionModalReturn.rejectionDate && (
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      Fecha de dictamen: {rejectionModalReturn.rejectionDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Prenda Involucrada */}
              <div className="flex items-center gap-3 p-2 bg-[#f8fafc] border border-gray-300 rounded-xs winxp-bevel-out">
                <img
                  src={rejectionModalReturn.productImage}
                  alt={rejectionModalReturn.productTitle}
                  className="w-12 h-12 object-cover border border-gray-400 rounded-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-xs text-gray-900 truncate">
                    {rejectionModalReturn.productTitle}
                  </h5>
                  <div className="text-[11px] text-gray-600">
                    Talla: <strong>{rejectionModalReturn.productSize}</strong> · Motivo indicado:{' '}
                    <strong>{rejectionModalReturn.reason}</strong>
                  </div>
                </div>
              </div>

              {/* Motivo del Rechazo escrito por el Administrador */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-red-950 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>Motivo y Justificación del Rechazo:</span>
                </label>
                <div className="p-3 bg-red-50/70 border border-red-300 rounded-xs text-gray-800 text-xs leading-relaxed italic winxp-bevel-in shadow-inner">
                  "{rejectionModalReturn.rejectionReason ||
                    'La pieza presenta manipulación forzada y signos evidentes de impacto exterior posterior a la entrega. El sello holográfico de autenticidad del drop fue removido. De acuerdo al Artículo 21 de la Ley 19.496 y la política NoLimits OS, la garantía legal cubre exclusivamente fallas de fábrica preexistentes.'}"
                </div>
                {rejectionModalReturn.adminInspector && (
                  <div className="text-[10px] text-gray-500 font-mono text-right">
                    Inspeccionado por: <strong>{rejectionModalReturn.adminInspector}</strong>
                  </div>
                )}
              </div>

              {/* Protocolo de Garantía */}
              <div className="p-2.5 bg-gray-50 border border-gray-300 rounded-xs text-[11px] text-gray-600 space-y-1">
                <div className="font-bold text-gray-800">Política de Garantía y Ley del Consumidor:</div>
                <p>
                  Las devoluciones aplican exclusivamente para prendas sin uso con sus etiquetas y sellos originales intactos, o fallas de confección preexistentes.
                </p>
              </div>

              {/* Botón de Cierre */}
              <div className="pt-2 flex items-center justify-end border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setRejectionModalReturn(null)}
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900 cursor-pointer shadow-sm"
                >
                  Entendido / Cerrar Ventana
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
