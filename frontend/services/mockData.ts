import { Branch, Product, Review, AdminAlertNotification, BlacklistCustomer, BranchAnalytics, User } from '../types';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'vina_del_mar',
    name: 'Sucursal Viña del Mar - Mall Marina Studio',
    code: 'VINA-01',
    address: 'Av. Libertad 1348, Local 204',
    city: 'Viña del Mar',
    phone: '+56 9 8452 1190',
    managerName: 'Sebastián Valdés (Store Lead)',
    isActive: true,
    colorTag: '#ff007f'
  },
  {
    id: 'valparaiso',
    name: 'Sucursal Valparaíso - Puerto Cyber Lab',
    code: 'VALPO-02',
    address: 'Calle Prat 740, Nivel 1',
    city: 'Valparaíso',
    phone: '+56 9 7312 9044',
    managerName: 'Camila Rojas',
    isActive: true,
    colorTag: '#00d4ff'
  },
  {
    id: 'quilpue',
    name: 'Sucursal Quilpué - Centro Drop Hub',
    code: 'QUIL-03',
    address: 'Los Carrera 880, Edificio Sol',
    city: 'Quilpué',
    phone: '+56 9 6128 4402',
    managerName: 'Martín Araya',
    isActive: true,
    colorTag: '#9d00ff'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_guest',
    name: 'Visitante Cyber',
    email: 'invitado@nolimits.cl',
    role: 'guest',
    loyaltyPoints: 0,
    createdAt: '2026-01-01'
  },
  {
    id: 'usr_registered',
    name: 'Valeria Neo-Goth',
    email: 'valeria.k@gmail.com',
    role: 'registered',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    loyaltyPoints: 340,
    phone: '+56 9 9123 4567',
    rut: '19.824.112-K',
    createdAt: '2026-02-10'
  },
  {
    id: 'usr_admin_vina',
    name: 'Sebastián Valdés',
    email: 'admin.vina@nolimits.cl',
    role: 'branch_admin',
    branchId: 'vina_del_mar',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    loyaltyPoints: 0,
    phone: '+56 9 8452 1190',
    rut: '17.432.890-3',
    createdAt: '2025-11-01'
  },
  {
    id: 'usr_super_admin',
    name: 'Root Administrator',
    email: 'root@nolimits.cl',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    loyaltyPoints: 9999,
    phone: '+56 9 0000 0001',
    rut: '16.111.222-3',
    createdAt: '2025-01-01'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_cyber_hoodie_01',
    sku: 'NL-CYB-001',
    title: 'Cyber-Tribal Overkill Zip Hoodie',
    description: 'Polerón oversize grueso de 480 GSM con serigrafía cromada reflectante Y2K, cierres metálicos dobles, detalles gótico-digitales bordados en mangas y capucha con forro satén púrpura.',
    price: 49990,
    salePrice: 38990,
    discountPercent: 22,
    category: 'Polerones & Hoodies',
    subCategory: 'Heavyweight',
    tags: ['Y2K', 'Cyberpunk', 'Oversize', 'Exclusive Live Drop'],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Void Black / Silver Bevel', hex: '#0a0a0c' },
      { name: 'Neon Acid Purple', hex: '#6b21a8' }
    ],
    stockPerBranch: {
      vina_del_mar: 8,
      valparaiso: 5,
      quilpue: 3
    },
    totalStock: 16,
    isExclusive: true,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-20'
  },
  {
    id: 'prod_goth_cargo_02',
    sku: 'NL-PAN-002',
    title: 'Gothic Parachute Multipocket Cargo',
    description: 'Pantalón parachute técnico con tiradores metálicos cromados, correas góticas desmontables y rodillas reforzadas. Silueta baggy noventera adaptada a la escena clubbing y streaming nocturno.',
    price: 45990,
    salePrice: 35990,
    discountPercent: 21,
    category: 'Pantalones & Cargos',
    subCategory: 'Parachute',
    tags: ['Baggy', 'Techwear', 'Gótico', 'Live Stream Pick'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Cyber Black', hex: '#111116' },
      { name: 'Washed Grey Metal', hex: '#4b5563' }
    ],
    stockPerBranch: {
      vina_del_mar: 12,
      valparaiso: 4,
      quilpue: 2
    },
    totalStock: 18,
    isExclusive: false,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.8,
    reviewCount: 26,
    createdAt: '2026-02-15',
    updatedAt: '2026-03-18'
  },
  {
    id: 'prod_vintage_tee_03',
    sku: 'NL-TEE-003',
    title: 'Windows XP Glitch 2000 Graphic Tee',
    description: 'Polera de algodón peinado 240g con estampado frontal estilo BSOD y vector Y2K en serigrafía tacto cero. Costuras reforzadas y lavado ácido industrial.',
    price: 24990,
    salePrice: 19990,
    discountPercent: 20,
    category: 'Poleras & Tops',
    subCategory: 'Graphic Tees',
    tags: ['Y2K', 'Pixel', 'Acid Wash'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Acid Washed Black', hex: '#1f2937' },
      { name: 'Electric Lilac', hex: '#a855f7' }
    ],
    stockPerBranch: {
      vina_del_mar: 15,
      valparaiso: 10,
      quilpue: 6
    },
    totalStock: 31,
    isExclusive: false,
    isFeatured: false,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.7,
    reviewCount: 42,
    createdAt: '2026-03-10',
    updatedAt: '2026-03-21'
  },
  {
    id: 'prod_metal_choker_04',
    sku: 'NL-ACC-004',
    title: 'Cybernetic Chrome Spiked Collar & Chain',
    description: 'Choker gótico de aleación de zinc hipoalergénica con acabado cromado espejo, eslabones industriales y remates en punta biselada.',
    price: 18990,
    category: 'Accesorios & Joyería',
    tags: ['Chrome', 'Punk', 'Cyber-Goth'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['Única (Ajustable)'],
    colors: [
      { name: 'Liquid Chrome', hex: '#e2e8f0' }
    ],
    stockPerBranch: {
      vina_del_mar: 6,
      valparaiso: 0,
      quilpue: 4
    },
    totalStock: 10,
    isExclusive: true,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'quilpue'],
    rating: 5.0,
    reviewCount: 15,
    createdAt: '2026-03-12',
    updatedAt: '2026-03-20'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_01',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_registered',
    userName: 'Valeria N.',
    rating: 5,
    title: 'Brutal la calidad del algodón y el cromo!',
    comment: 'Lo compré en la transmisión en vivo de Viña y me llegó al día siguiente a Valparaíso. La capucha con forro púrpura es hermosa y el peso de la tela es de primer nivel. 10/10.',
    date: '2026-03-15',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80'
    ],
    likes: 19,
    branchPurchased: 'Viña del Mar'
  },
  {
    id: 'rev_02',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_guest_demo',
    userName: 'Matías B.',
    rating: 5,
    title: 'Calce perfecto oversized',
    comment: 'Mido 1.82m y la talla L queda impecable. La serigrafía no se despega con los lavados.',
    date: '2026-03-18',
    verifiedPurchase: true,
    photos: [],
    likes: 7,
    branchPurchased: 'Valparaíso'
  }
];

export const INITIAL_NOTIFICATIONS: AdminAlertNotification[] = [
  {
    id: 'notif_01',
    type: 'debt_reminder',
    title: 'Cobro Pendiente: Pedido #NL-8842',
    message: 'Cliente Ignacio Soto mantiene saldo impago de $38.990 tras reserva en Live. Tiempo límite de liberación de stock expira en 2 horas.',
    severity: 'critical',
    targetCustomerId: 'cust_ignacio_soto',
    targetCustomerName: 'Ignacio Soto M.',
    targetOrderId: 'NL-8842',
    debtAmount: 38990,
    dueHoursEstimate: 2,
    isRead: false,
    createdAt: 'Hace 45 min'
  },
  {
    id: 'notif_02',
    type: 'shipping_alert',
    title: 'Alerta de Despacho: Starken Viña del Mar',
    message: 'Se generaron 6 pedidos en la última hora. Faltan 4 etiquetas por imprimir antes del corte de las 18:00 hrs.',
    severity: 'warning',
    dueHoursEstimate: 3,
    isRead: false,
    createdAt: 'Hace 1 hora'
  },
  {
    id: 'notif_03',
    type: 'stock_critical',
    title: 'Stock Crítico: Cyber-Tribal Zip Hoodie en Quilpué',
    message: 'Quedan solo 3 unidades en el Drop Hub de Quilpué mientras el Live Stream sigue activo.',
    severity: 'info',
    dueHoursEstimate: 5,
    isRead: true,
    createdAt: 'Hace 3 horas'
  }
];

export const INITIAL_BLACKLIST: BlacklistCustomer[] = [
  {
    id: 'bl_01',
    name: 'Franco Navarrete C.',
    rut: '18.992.334-5',
    email: 'franco.n99@live.cl',
    phone: '+56 9 7788 1122',
    debtAmount: 64980,
    reason: 'Comprobante de transferencia adulterado (falso PDF de banco) en 2 ocasiones consecutivas durante Live Stream.',
    incidentCount: 3,
    status: 'active_blocked',
    dateAdded: '2026-02-14'
  },
  {
    id: 'bl_02',
    name: 'Carolina Pizarro T.',
    rut: '20.104.992-1',
    email: 'carito.piz@outlook.com',
    phone: '+56 9 6655 4433',
    debtAmount: 24990,
    reason: 'Reserva constante en transmisiones sin concretar pago, bloqueando stock físico a otros clientes.',
    incidentCount: 4,
    status: 'warning',
    dateAdded: '2026-03-02'
  }
];

export const INITIAL_ANALYTICS: BranchAnalytics[] = [
  {
    branchId: 'vina_del_mar',
    branchName: 'Viña del Mar',
    totalSales: 14850000,
    totalExpenses: 6200000,
    netProfit: 8650000,
    projectedProfit: 11200000,
    ordersProcessed: 312,
    activeLiveOrders: 18,
    topProducts: [
      { productId: 'prod_cyber_hoodie_01', title: 'Cyber-Tribal Overkill Zip Hoodie', unitsSold: 94, revenue: 3665060 },
      { productId: 'prod_goth_cargo_02', title: 'Gothic Parachute Multipocket Cargo', unitsSold: 76, revenue: 2735240 }
    ],
    laggingProducts: [
      { productId: 'prod_legacy_belt', title: 'Cinturón Tachas 2024 Remanente', daysInStock: 82, stockLeft: 14 }
    ]
  },
  {
    branchId: 'valparaiso',
    branchName: 'Valparaíso',
    totalSales: 9420000,
    totalExpenses: 4100000,
    netProfit: 5320000,
    projectedProfit: 6800000,
    ordersProcessed: 198,
    activeLiveOrders: 11,
    topProducts: [
      { productId: 'prod_goth_cargo_02', title: 'Gothic Parachute Multipocket Cargo', unitsSold: 58, revenue: 2087420 },
      { productId: 'prod_vintage_tee_03', title: 'Windows XP Glitch 2000 Graphic Tee', unitsSold: 51, revenue: 1019490 }
    ],
    laggingProducts: [
      { productId: 'prod_retro_cap', title: 'Gorro Cyber Beanie Invierno', daysInStock: 64, stockLeft: 9 }
    ]
  },
  {
    branchId: 'quilpue',
    branchName: 'Quilpué',
    totalSales: 6180000,
    totalExpenses: 2800000,
    netProfit: 3380000,
    projectedProfit: 4500000,
    ordersProcessed: 124,
    activeLiveOrders: 7,
    topProducts: [
      { productId: 'prod_vintage_tee_03', title: 'Windows XP Glitch 2000 Graphic Tee', unitsSold: 42, revenue: 839580 }
    ],
    laggingProducts: [
      { productId: 'prod_sock_pack', title: 'Pack Calcetines Neón', daysInStock: 45, stockLeft: 11 }
    ]
  }
];
