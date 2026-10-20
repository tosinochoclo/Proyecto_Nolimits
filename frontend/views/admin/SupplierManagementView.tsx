import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Package,
  User,
  Briefcase,
  Calendar,
  Truck,
  Phone,
  Mail,
  DollarSign,
  Globe,
  MapPin,
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  Search,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { useAuth } from '../../context/AuthContext';

export interface SupplierRecord {
  id: string;
  companyName: string;
  productsOffered: string;
  contactName: string;
  contactRole: string;
  orderDays: string;
  deliveryDays: string;
  phone: string;
  email: string;
  minimumPurchase: number;
  website: string;
  region: string;
  city: string;
  street: string;
  number: string;
  reference: string;
  postalCode: string;
  createdAt: string;
  updatedAt?: string;
}

// Lista de Regiones de Chile y sus Ciudades Principales
const CHILE_REGIONS: Record<string, string[]> = {
  'Región de Valparaíso': [
    'Viña del Mar',
    'Valparaíso',
    'Quilpué',
    'Villa Alemana',
    'Concón',
    'Quillota',
    'San Antonio',
    'Los Andes'
  ],
  'Región Metropolitana': [
    'Santiago',
    'Providencia',
    'Las Condes',
    'Ñuñoa',
    'Recoleta',
    'Independencia',
    'Maipú',
    'San Bernardo',
    'Puente Alto'
  ],
  'Región del Biobío': [
    'Concepción',
    'Talcahuano',
    'San Pedro de la Paz',
    'Chiguayante',
    'Los Ángeles',
    'Coronel'
  ],
  'Región de Coquimbo': [
    'La Serena',
    'Coquimbo',
    'Ovalle',
    'Illapel'
  ],
  'Región de Antofagasta': [
    'Antofagasta',
    'Calama',
    'Tocopilla'
  ],
  'Región de La Araucanía': [
    'Temuco',
    'Padre Las Casas',
    'Villarrica',
    'Pucón'
  ],
  'Región de Los Lagos': [
    'Puerto Montt',
    'Puerto Varas',
    'Osorno',
    'Castro'
  ]
};

// Proveedores iniciales realistas para streetwear y moda Y2K
const DEFAULT_INITIAL_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'supp_01',
    companyName: 'Textiles Andinos SpA',
    productsOffered: 'Algodón frisado 480 GSM, Franela pesada para Hoodies, Rib de puño elastano',
    contactName: 'Rodrigo Valenzuela M.',
    contactRole: 'Ejecutivo de Ventas Mayorista',
    orderDays: 'Lunes a Miércoles (hasta las 17:00 hrs)',
    deliveryDays: 'Martes y Jueves',
    phone: '+56 9 8452 9911',
    email: 'rodrigo.v@textilesandinos.cl',
    minimumPurchase: 180000,
    website: 'https://www.textilesandinos.cl',
    region: 'Región de Valparaíso',
    city: 'Viña del Mar',
    street: 'Av. El Salto Industrial',
    number: '2040',
    reference: 'Galpón C-4, Parque Tecnológico',
    postalCode: '2520000',
    createdAt: '2026-02-10'
  },
  {
    id: 'supp_02',
    companyName: 'Importadora Cromo & Cierres Y2K',
    productsOffered: 'Cierres metálicos dobles #8, Tiradores góticos cromados, Remaches y argollas O-Ring',
    contactName: 'Camila Fuenzalida T.',
    contactRole: 'Jefa de Cuentas B2B',
    orderDays: 'Lunes y Jueves',
    deliveryDays: 'Miércoles y Viernes',
    phone: '+56 9 7312 4400',
    email: 'ventas@cromoy2k.cl',
    minimumPurchase: 95000,
    website: 'https://www.cromoy2k.cl',
    region: 'Región Metropolitana',
    city: 'Santiago',
    street: 'Calle Meiggs',
    number: '580',
    reference: 'Local 12, Nivel -1 Barrio Textil',
    postalCode: '8320000',
    createdAt: '2026-03-01'
  },
  {
    id: 'supp_03',
    companyName: 'Tintas & Serigrafía Austral',
    productsOffered: 'Plastisol cromo reflectante, Tintas al agua tacto cero, Mallas 77T y Rasquetas',
    contactName: 'Marcelo Pardo S.',
    contactRole: 'Vendedor Técnico',
    orderDays: 'Martes y Viernes',
    deliveryDays: 'Lunes y Jueves',
    phone: '+56 9 6128 3322',
    email: 'marcelo@tintasaustral.cl',
    minimumPurchase: 120000,
    website: 'https://www.tintasaustral.cl',
    region: 'Región de Valparaíso',
    city: 'Valparaíso',
    street: 'Av. Errázuriz',
    number: '1430',
    reference: 'Frente a Muelle Prat',
    postalCode: '2340000',
    createdAt: '2026-03-15'
  },
  {
    id: 'supp_04',
    companyName: 'Envases & Packaging CyberPack SpA',
    productsOffered: 'Bolsas térmicas metalizadas holográficas, Cajas automontables con serigrafía UV, Hangtags',
    contactName: 'Ignacia Sepúlveda L.',
    contactRole: 'Ejecutiva Comercial',
    orderDays: 'Lunes a Viernes',
    deliveryDays: 'Miércoles (Ruta V Región)',
    phone: '+56 9 9988 1234',
    email: 'ignacia@cyberpack.cl',
    minimumPurchase: 250000,
    website: 'https://www.cyberpack.cl',
    region: 'Región Metropolitana',
    city: 'Providencia',
    street: 'Av. Nueva Providencia',
    number: '1881',
    reference: 'Oficina 804, Edificio Panorámico',
    postalCode: '7500000',
    createdAt: '2026-04-02'
  }
];

export const SupplierManagementView: React.FC = () => {
  const { currentUser } = useAuth();

  // Directorio de proveedores persistido en localStorage
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nolimits_suppliers_records');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignorar fallback
    }
    return DEFAULT_INITIAL_SUPPLIERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('nolimits_suppliers_records', JSON.stringify(suppliers));
    } catch (e) {
      console.error('Error saving suppliers to localStorage', e);
    }
  }, [suppliers]);

  // Modo de edición
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados de los campos del formulario
  const [companyName, setCompanyName] = useState<string>('');
  const [productsOffered, setProductsOffered] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactRole, setContactRole] = useState<string>('');
  const [orderDays, setOrderDays] = useState<string>('Lunes y Miércoles');
  const [deliveryDays, setDeliveryDays] = useState<string>('Martes y Jueves');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [rawMinPurchase, setRawMinPurchase] = useState<string>('150000');
  const [formattedMinPurchase, setFormattedMinPurchase] = useState<string>('150.000');
  const [website, setWebsite] = useState<string>('https://');

  // Campos de ubicación
  const [region, setRegion] = useState<string>('Región de Valparaíso');
  const [city, setCity] = useState<string>('Viña del Mar');
  const [street, setStreet] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('2520000');

  // Filtros y búsquedas
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  // Modales
  const [modalSupplier, setModalSupplier] = useState<SupplierRecord | null>(null); // "Ver más información"
  const [deleteCandidate, setDeleteCandidate] = useState<SupplierRecord | null>(null); // "Eliminar"
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ciudades disponibles según la región seleccionada en el formulario
  const availableCities = useMemo(() => {
    return CHILE_REGIONS[region] || ['Otra Ciudad'];
  }, [region]);

  // Al cambiar de región, reiniciar ciudad a la primera de la lista
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    const cities = CHILE_REGIONS[newRegion];
    if (cities && cities.length > 0) {
      setCity(cities[0]);
    }
  };

  // Manejo de input de dinero con auto-separador para mínimo de compra
  const handleMinPurchaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setRawMinPurchase('');
      setFormattedMinPurchase('');
      return;
    }
    const num = parseInt(val, 10);
    setRawMinPurchase(val);
    setFormattedMinPurchase(num.toLocaleString('es-CL'));
  };

  // Cargar datos en el formulario para EDITAR
  const handleStartEdit = (supp: SupplierRecord) => {
    setEditingId(supp.id);
    setCompanyName(supp.companyName);
    setProductsOffered(supp.productsOffered);
    setContactName(supp.contactName);
    setContactRole(supp.contactRole);
    setOrderDays(supp.orderDays);
    setDeliveryDays(supp.deliveryDays);
    setPhone(supp.phone);
    setEmail(supp.email);
    setRawMinPurchase(String(supp.minimumPurchase));
    setFormattedMinPurchase(supp.minimumPurchase.toLocaleString('es-CL'));
    setWebsite(supp.website);
    setRegion(supp.region);
    setCity(supp.city);
    setStreet(supp.street);
    setNumber(supp.number);
    setReference(supp.reference);
    setPostalCode(supp.postalCode);
    setStatusMessage(null);

    // Scroll suave hacia el formulario
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  // Limpiar formulario
  const resetForm = () => {
    setCompanyName('');
    setProductsOffered('');
    setContactName('');
    setContactRole('');
    setOrderDays('Lunes y Miércoles');
    setDeliveryDays('Martes y Jueves');
    setPhone('');
    setEmail('');
    setRawMinPurchase('100000');
    setFormattedMinPurchase('100.000');
    setWebsite('https://');
    setRegion('Región de Valparaíso');
    setCity('Viña del Mar');
    setStreet('');
    setNumber('');
    setReference('');
    setPostalCode('2520000');
  };

  // Guardar (Agregar o Actualizar)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      setStatusMessage({ type: 'error', text: 'Debe ingresar el Nombre de la empresa.' });
      return;
    }

    if (!productsOffered.trim()) {
      setStatusMessage({ type: 'error', text: 'Debe especificar los Productos que ofrece el proveedor.' });
      return;
    }

    if (!contactName.trim()) {
      setStatusMessage({ type: 'error', text: 'Debe ingresar el Nombre de la persona de contacto.' });
      return;
    }

    const minPurchaseNum = parseInt(rawMinPurchase, 10) || 0;

    if (editingId) {
      // MODO ACTUALIZAR
      const updated = suppliers.map((s) => {
        if (s.id === editingId) {
          return {
            ...s,
            companyName: companyName.trim(),
            productsOffered: productsOffered.trim(),
            contactName: contactName.trim(),
            contactRole: contactRole.trim() || 'Ejecutivo de Ventas',
            orderDays: orderDays.trim(),
            deliveryDays: deliveryDays.trim(),
            phone: phone.trim(),
            email: email.trim(),
            minimumPurchase: minPurchaseNum,
            website: website.trim(),
            region,
            city,
            street: street.trim(),
            number: number.trim(),
            reference: reference.trim(),
            postalCode: postalCode.trim(),
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
      setSuppliers(updated);
      setStatusMessage({ type: 'success', text: `¡Proveedor "${companyName}" actualizado correctamente!` });
      setEditingId(null);
      resetForm();
    } else {
      // MODO AGREGAR PROVEEDOR
      const newSupplier: SupplierRecord = {
        id: `supp_${Date.now()}`,
        companyName: companyName.trim(),
        productsOffered: productsOffered.trim(),
        contactName: contactName.trim(),
        contactRole: contactRole.trim() || 'Ejecutivo de Ventas',
        orderDays: orderDays.trim(),
        deliveryDays: deliveryDays.trim(),
        phone: phone.trim(),
        email: email.trim(),
        minimumPurchase: minPurchaseNum,
        website: website.trim(),
        region,
        city,
        street: street.trim(),
        number: number.trim(),
        reference: reference.trim(),
        postalCode: postalCode.trim(),
        createdAt: new Date().toISOString()
      };
      setSuppliers([newSupplier, ...suppliers]);
      setStatusMessage({ type: 'success', text: `¡Proveedor "${companyName}" agregado con éxito al directorio!` });
      resetForm();
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    setSuppliers(suppliers.filter((s) => s.id !== deleteCandidate.id));
    setStatusMessage({ type: 'success', text: `Proveedor "${deleteCandidate.companyName}" eliminado del sistema.` });
    setDeleteCandidate(null);
  };

  // Filtrado de proveedores en el directorio
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (regionFilter !== 'all' && s.region !== regionFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          s.companyName.toLowerCase().includes(q) ||
          s.productsOffered.toLowerCase().includes(q) ||
          s.contactName.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [suppliers, regionFilter, searchTerm]);

  return (
    <div className="space-y-4 font-sans text-gray-900 pb-16">
      <WindowFrame
        title="SUPER_ROOT_SUPPLIERS.SYS - [Gestión & Directorio de Proveedores]"
        icon={<PixelIcon name="folder-open" size={16} />}
        statusBarText={`AUDITORÍA SUPER ADMIN // PROVEEDORES ACTIVOS: ${suppliers.length} // SINCRONIZACIÓN CONTABLE OK`}
      >
        <div className="space-y-4">
          {/* Cabecera y Navegación Superior */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Link to="/admin/inventory">
                  <button
                    type="button"
                    className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1 font-semibold"
                    title="Regresar a Gestión de Inventario"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-green-700" />
                    <span>Inventario</span>
                  </button>
                </Link>

                <span className="bg-indigo-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-indigo-200" />
                  CADENA DE SUMINISTRO
                </span>

                <h2 className="text-sm font-extrabold text-[#003c74] uppercase tracking-wide">
                  Crear y Editar Proveedores
                </h2>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Administración de socios comerciales, insumos textiles, herrajes góticos, días de pedido y despacho por región.
              </p>
            </div>

            {/* Accesos Rápidos */}
            <div className="flex items-center gap-2">
              <Link to="/admin/register-expense">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-2.5 text-red-950 font-bold bg-red-50 hover:bg-red-100 border border-red-400"
                >
                  <span>Registrar Gasto a Proveedor</span>
                </button>
              </Link>
              <Link to="/admin">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-2.5 text-gray-800"
                >
                  Dashboard Root
                </button>
              </Link>
            </div>
          </div>

          {/* Mensajes de Estado */}
          {statusMessage && (
            <div
              className={`p-2.5 rounded-xs border text-xs flex items-center justify-between ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 border-green-300 text-green-800'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-gray-500 hover:text-black font-bold text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* =================================================================
              COMPONENTE 1: FORMULARIO "CREAR / EDITAR PROVEEDOR"
              Con todos los campos requeridos
              ================================================================= */}
          <div className="bg-[#f0f4f8] border border-[#7f9db9] p-4 winxp-bevel-out space-y-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                  {editingId ? '★ Editar Información de Proveedor' : 'Formulario: Crear Nuevo Proveedor'}
                </h3>
              </div>
              {editingId && (
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-xs border border-amber-300">
                  Modo Edición Activo
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* SECCIÓN 1: DATOS DE LA EMPRESA & PRODUCTOS */}
              <div className="bg-white border border-gray-300 p-3 rounded-xs space-y-3">
                <div className="font-bold text-blue-900 border-b border-gray-200 pb-1 text-[11px] uppercase flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-700" />
                  <span>1. Datos de la Empresa y Suministros</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Nombre de la empresa */}
                  <div className="space-y-1">
                    <label htmlFor="company-name" className="block font-bold text-gray-800">
                      Nombre de la empresa: <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ej: Textiles Andinos SpA"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner font-semibold"
                    />
                  </div>

                  {/* Sitio web */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-website" className="block font-bold text-gray-800 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-gray-500" />
                      <span>Sitio web:</span>
                    </label>
                    <input
                      id="supplier-website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.proveedor.cl"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner font-mono"
                    />
                  </div>

                  {/* Productos que ofrece */}
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="products-offered" className="block font-bold text-gray-800">
                      Productos que ofrece: <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="products-offered"
                      type="text"
                      required
                      value={productsOffered}
                      onChange={(e) => setProductsOffered(e.target.value)}
                      placeholder="Ej: Algodón frisado 480 GSM, cierres metálicos dobles, etiquetas cromadas, tintas serigráficas"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                    <p className="text-[10px] text-gray-500">
                      Detalle los insumos, telas, piezas o acabados que suministra a NoLimits.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: CONTACTO & CONDICIONES COMERCIALES */}
              <div className="bg-white border border-gray-300 p-3 rounded-xs space-y-3">
                <div className="font-bold text-blue-900 border-b border-gray-200 pb-1 text-[11px] uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  <span>2. Contacto Comercial y Logística de Pedidos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Nombre persona de contacto */}
                  <div className="space-y-1">
                    <label htmlFor="contact-name" className="block font-bold text-gray-800">
                      Nombre persona de contacto: <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ej: Rodrigo Valenzuela"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                  </div>

                  {/* Cargo del contacto */}
                  <div className="space-y-1">
                    <label htmlFor="contact-role" className="block font-bold text-gray-800">
                      Cargo del contacto:
                    </label>
                    <input
                      id="contact-role"
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder="Ej: Vendedor, Ejecutivo de Ventas"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-phone" className="block font-bold text-gray-800 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span>Teléfono:</span>
                    </label>
                    <input
                      id="supplier-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+56 9 8452 9911"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner font-mono"
                    />
                  </div>

                  {/* Correo */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-email" className="block font-bold text-gray-800 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-500" />
                      <span>Correo:</span>
                    </label>
                    <input
                      id="supplier-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ventas@proveedor.cl"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner font-mono"
                    />
                  </div>

                  {/* Días de pedido */}
                  <div className="space-y-1">
                    <label htmlFor="order-days" className="block font-bold text-gray-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-700" />
                      <span>Días de pedido:</span>
                    </label>
                    <input
                      id="order-days"
                      type="text"
                      value={orderDays}
                      onChange={(e) => setOrderDays(e.target.value)}
                      placeholder="Ej: Lunes y Miércoles"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                  </div>

                  {/* Días de reparto */}
                  <div className="space-y-1">
                    <label htmlFor="delivery-days" className="block font-bold text-gray-800 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-green-700" />
                      <span>Días de reparto:</span>
                    </label>
                    <input
                      id="delivery-days"
                      type="text"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(e.target.value)}
                      placeholder="Ej: Martes y Jueves"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                  </div>

                  {/* Mínimo de compra */}
                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="min-purchase" className="block font-bold text-gray-800 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-700" />
                        <span>Mínimo de compra ($ CLP):</span>
                      </span>
                      <span className="text-[10px] text-blue-600 font-normal">Auto-separador de miles</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-500">
                        $
                      </span>
                      <input
                        id="min-purchase"
                        type="text"
                        inputMode="numeric"
                        value={formattedMinPurchase}
                        onChange={handleMinPurchaseChange}
                        placeholder="100.000"
                        className="w-full bg-white border border-[#7f9db9] pl-7 pr-3 py-1.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: UBICACIÓN */}
              <div className="bg-white border border-gray-300 p-3 rounded-xs space-y-3">
                <div className="font-bold text-blue-900 border-b border-gray-200 pb-1 text-[11px] uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>3. Ubicación Geográfica</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Seleccione Región */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-region" className="block font-bold text-gray-800">
                      Seleccione Región: <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="supplier-region"
                      value={region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner font-semibold cursor-pointer"
                    >
                      {Object.keys(CHILE_REGIONS).map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Seleccione Ciudad */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-city" className="block font-bold text-gray-800">
                      Seleccione Ciudad: <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="supplier-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner font-semibold cursor-pointer"
                    >
                      {availableCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Calle */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-street" className="block font-bold text-gray-800">
                      Calle:
                    </label>
                    <input
                      id="supplier-street"
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ej: Av. Libertad"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                  </div>

                  {/* Número */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-number" className="block font-bold text-gray-800">
                      Número:
                    </label>
                    <input
                      id="supplier-number"
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Ej: 1420"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                  </div>

                  {/* Referencia */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-reference" className="block font-bold text-gray-800">
                      Referencia:
                    </label>
                    <input
                      id="supplier-reference"
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Ej: Galpón 4, frente a estación metro"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                  </div>

                  {/* Código postal */}
                  <div className="space-y-1">
                    <label htmlFor="supplier-postal" className="block font-bold text-gray-800">
                      Código postal:
                    </label>
                    <input
                      id="supplier-postal"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Ej: 2520000"
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Agregar / Actualizar Proveedor */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-gray-300">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="winxp-button text-xs py-1.5 px-4 text-gray-800"
                  >
                    Cancelar Edición
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetForm}
                  className="winxp-button text-xs py-1.5 px-4 text-gray-800"
                >
                  Limpiar Formulario
                </button>

                <button
                  type="submit"
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900 flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-blue-800" />
                  <span>{editingId ? 'Actualizar Proveedor' : 'Agregar Proveedor'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* =================================================================
              COMPONENTE 2: DIRECTORIO DE PROVEEDORES REGISTRADOS
              Con botones: (Editar, Ver más información, Eliminar)
              ================================================================= */}
          <div className="bg-white border border-[#7f9db9] p-3 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-800" />
                <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wide">
                  Directorio de Proveedores Registrados ({filteredSuppliers.length})
                </h4>
              </div>

              {/* Filtro por región y buscador */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-white px-2 py-1 border border-gray-400 text-xs shadow-inner">
                  <span className="font-bold text-gray-700 text-[11px]">Región:</span>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="text-xs bg-transparent focus:outline-none cursor-pointer font-bold text-blue-900"
                  >
                    <option value="all">Todas las Regiones</option>
                    {Object.keys(CHILE_REGIONS).map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-white px-2 py-1 border border-gray-400 text-xs shadow-inner w-56">
                  <Search className="w-3 h-3 text-gray-500 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar empresa, producto, contacto..."
                    className="w-full text-xs bg-transparent focus:outline-none text-gray-900"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-black font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabla de Proveedores con Botones (Editar, Ver más información, Eliminar) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200">
                <thead className="bg-[#e4ebf5] text-blue-950 font-bold border-b border-gray-300 text-[11px]">
                  <tr>
                    <th className="py-2 px-2.5">Empresa</th>
                    <th className="py-2 px-2.5">Productos que Ofrece</th>
                    <th className="py-2 px-2.5">Persona de Contacto</th>
                    <th className="py-2 px-2.5">Contacto (Fono / Email)</th>
                    <th className="py-2 px-2.5">Ubicación</th>
                    <th className="py-2 px-2.5 text-right">Mínimo Compra</th>
                    <th className="py-2 px-2.5 text-center w-48">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500 italic">
                        No se encontraron proveedores registrados con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((supp) => {
                      const isCurrentEditing = editingId === supp.id;
                      return (
                        <tr
                          key={supp.id}
                          className={`transition-colors ${
                            isCurrentEditing
                              ? 'bg-amber-50 font-semibold'
                              : 'hover:bg-blue-50/60'
                          }`}
                        >
                          {/* Empresa */}
                          <td className="py-2 px-2.5">
                            <div className="font-bold text-gray-900 text-xs">
                              {supp.companyName}
                            </div>
                            {supp.website && supp.website !== 'https://' && (
                              <a
                                href={supp.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 mt-0.5 font-mono"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span>{supp.website.replace('https://', '').replace('http://', '')}</span>
                              </a>
                            )}
                          </td>

                          {/* Productos que ofrece */}
                          <td className="py-2 px-2.5 text-[11px] text-gray-700 max-w-xs truncate" title={supp.productsOffered}>
                            {supp.productsOffered}
                          </td>

                          {/* Persona de Contacto & Cargo */}
                          <td className="py-2 px-2.5">
                            <div className="font-bold text-gray-900 text-[11px]">
                              {supp.contactName}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {supp.contactRole || 'Contacto'}
                            </div>
                          </td>

                          {/* Teléfono & Correo */}
                          <td className="py-2 px-2.5 text-[11px] font-mono text-gray-600 whitespace-nowrap">
                            <div>{supp.phone}</div>
                            <div className="text-[10px] text-blue-800">{supp.email}</div>
                          </td>

                          {/* Ubicación (Ciudad / Región) */}
                          <td className="py-2 px-2.5 text-[11px] text-gray-700 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">{supp.city}</div>
                            <div className="text-[10px] text-gray-500">{supp.region}</div>
                          </td>

                          {/* Mínimo de compra */}
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-green-800 text-xs whitespace-nowrap">
                            ${supp.minimumPurchase.toLocaleString('es-CL')} CLP
                          </td>

                          {/* BOTONES REQUERIDOS: Editar, Ver más información, Eliminar */}
                          <td className="py-2 px-2.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              {/* 1. Botón "Editar" */}
                              <button
                                type="button"
                                onClick={() => handleStartEdit(supp)}
                                className="winxp-button text-[10px] py-0.5 px-2 text-blue-900 hover:bg-blue-50 font-bold flex items-center gap-1"
                                title="Editar datos del proveedor"
                              >
                                <Edit className="w-3 h-3 text-blue-700" />
                                <span>Editar</span>
                              </button>

                              {/* 2. Botón "Ver más información" */}
                              <button
                                type="button"
                                onClick={() => setModalSupplier(supp)}
                                className="winxp-button text-[10px] py-0.5 px-2 text-gray-800 hover:bg-gray-100 font-bold flex items-center gap-1"
                                title="Ver ficha técnica completa del proveedor"
                              >
                                <Eye className="w-3 h-3 text-indigo-700" />
                                <span>Ver más</span>
                              </button>

                              {/* 3. Botón "Eliminar" */}
                              <button
                                type="button"
                                onClick={() => setDeleteCandidate(supp)}
                                className="winxp-button text-[10px] py-0.5 px-1.5 text-red-700 hover:bg-red-50 hover:border-red-400"
                                title="Eliminar proveedor"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* =================================================================
          MODAL WINDOWS XP: "VER MÁS INFORMACIÓN" DEL PROVEEDOR
          ================================================================= */}
      {modalSupplier && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <WindowFrame
            title={`FICHA DE PROVEEDOR: ${modalSupplier.companyName.toUpperCase()}`}
            icon={<PixelIcon name="info" size={16} />}
            showControls={true}
            onClose={() => setModalSupplier(null)}
            statusBarText="AUDITORÍA DE PROVEEDOR // FICHA TÉCNICA OFICIAL"
            className="max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 space-y-4 font-sans text-xs">
              {/* Encabezado */}
              <div className="flex items-center justify-between border-b border-gray-300 pb-2.5">
                <div>
                  <h3 className="font-extrabold text-base text-blue-900">
                    {modalSupplier.companyName}
                  </h3>
                  <p className="text-[11px] text-gray-600">
                    Proveedor registrado el {modalSupplier.createdAt.substring(0, 10)}
                  </p>
                </div>
                <span className="bg-green-100 text-green-900 font-bold px-2.5 py-1 rounded-xs border border-green-300 text-xs">
                  Mínimo: ${modalSupplier.minimumPurchase.toLocaleString('es-CL')} CLP
                </span>
              </div>

              {/* 1. Productos que ofrece */}
              <div className="bg-[#f8fafc] border border-gray-300 p-3 rounded-xs space-y-1">
                <div className="font-bold text-blue-900 text-[11px] uppercase flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-700" />
                  <span>Productos y Suministros Ofrecidos</span>
                </div>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {modalSupplier.productsOffered}
                </p>
              </div>

              {/* 2. Persona de Contacto & Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#f8fafc] border border-gray-300 p-2.5 rounded-xs space-y-1">
                  <div className="font-bold text-gray-600 text-[10px] uppercase">Persona de Contacto</div>
                  <div className="font-extrabold text-gray-900 text-sm">{modalSupplier.contactName}</div>
                  <div className="text-[11px] text-indigo-800 font-semibold">{modalSupplier.contactRole}</div>
                </div>

                <div className="bg-[#f8fafc] border border-gray-300 p-2.5 rounded-xs space-y-1">
                  <div className="font-bold text-gray-600 text-[10px] uppercase">Canales de Contacto</div>
                  <div className="font-mono text-gray-900 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-green-700" />
                    <span>{modalSupplier.phone || 'No registrado'}</span>
                  </div>
                  <div className="font-mono text-blue-800 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-700" />
                    <a href={`mailto:${modalSupplier.email}`} className="hover:underline">
                      {modalSupplier.email || 'No registrado'}
                    </a>
                  </div>
                </div>
              </div>

              {/* 3. Días de pedido y reparto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xs space-y-1">
                  <div className="font-bold text-blue-900 text-[10px] uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-700" />
                    <span>Días de Pedido</span>
                  </div>
                  <div className="font-bold text-gray-900">{modalSupplier.orderDays}</div>
                </div>

                <div className="bg-green-50 border border-green-200 p-2.5 rounded-xs space-y-1">
                  <div className="font-bold text-green-900 text-[10px] uppercase flex items-center gap-1">
                    <Truck className="w-3 h-3 text-green-700" />
                    <span>Días de Reparto / Despacho</span>
                  </div>
                  <div className="font-bold text-gray-900">{modalSupplier.deliveryDays}</div>
                </div>
              </div>

              {/* 4. Ubicación Física Completa */}
              <div className="bg-[#f8fafc] border border-gray-300 p-3 rounded-xs space-y-2">
                <div className="font-bold text-blue-900 text-[11px] uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>Dirección y Ubicación Física</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-500 font-semibold block text-[10px]">Región:</span>
                    <span className="font-bold text-gray-900">{modalSupplier.region}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block text-[10px]">Ciudad:</span>
                    <span className="font-bold text-gray-900">{modalSupplier.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block text-[10px]">Código Postal:</span>
                    <span className="font-mono font-bold text-gray-900">{modalSupplier.postalCode || 'S/N'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 font-semibold block text-[10px]">Calle y Número:</span>
                    <span className="font-bold text-gray-900">
                      {modalSupplier.street || 'S/N'} {modalSupplier.number ? `#${modalSupplier.number}` : ''}
                    </span>
                  </div>
                  {modalSupplier.reference && (
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-gray-500 font-semibold block text-[10px]">Referencia:</span>
                      <span className="text-gray-800 italic">{modalSupplier.reference}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sitio Web si existe */}
              {modalSupplier.website && modalSupplier.website !== 'https://' && (
                <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-xs">
                  <span className="font-semibold text-gray-700">Sitio Web Oficial:</span>
                  <a
                    href={modalSupplier.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:underline font-mono font-bold flex items-center gap-1"
                  >
                    <span>{modalSupplier.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Botón de cierre y acción de editar */}
              <div className="pt-3 border-t border-gray-300 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleStartEdit(modalSupplier);
                    setModalSupplier(null);
                  }}
                  className="winxp-button text-xs py-1.5 px-4 font-bold text-blue-900 flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Editar este Proveedor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalSupplier(null)}
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </WindowFrame>
        </div>
      )}

      {/* =================================================================
          MODAL WINDOWS XP: CONFIRMAR ELIMINACIÓN DE PROVEEDOR
          ================================================================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <WindowFrame
            title="DIRECTORIO - [Confirmar Eliminación de Proveedor]"
            icon={<PixelIcon name="warning" size={16} />}
            showControls={true}
            onClose={() => setDeleteCandidate(null)}
            statusBarText="ATENCIÓN: ELIMINACIÓN PERMANENTE DEL DIRECTORIO"
            className="max-w-md w-full shadow-2xl"
          >
            <div className="p-4 space-y-3 font-sans text-xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-blue-900">
                    ¿Desea eliminar a este proveedor?
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Se eliminará permanentemente la ficha de <strong className="text-red-900">{deleteCandidate.companyName}</strong> ({deleteCandidate.city}) del directorio de compras de NoLimits.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-300 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(null)}
                  className="winxp-button text-xs py-1.5 px-4 text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-red-950 bg-red-100 border border-red-600 hover:bg-red-200"
                >
                  Eliminar Proveedor
                </button>
              </div>
            </div>
          </WindowFrame>
        </div>
      )}
    </div>
  );
};
