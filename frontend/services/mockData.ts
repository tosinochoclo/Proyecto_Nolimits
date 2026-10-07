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
    sizes: ['S', 'M', 'L', 'XL', 'Talla estándar'],
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
    sizes: ['M', 'L', 'XL', 'Talla estándar'],
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
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XLL', 'Talla estándar'],
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
    sizes: [],
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
  },
  {
    id: 'prod_cartera_holographic_05',
    sku: 'NL-BAG-005',
    title: 'Cartera Y2K Mini Baguette Plateada Mirror',
    description: 'Mini cartera estilo baguette noventera en eco-cuero metalizado con acabado espejo, cierre plateado reforzado y correa compacta al hombro.',
    price: 34990,
    category: 'Carteras',
    subCategory: 'Baguette',
    tags: ['Y2K', 'Carteras', 'Baguette', 'Chrome'],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: [],
    colors: [
      { name: 'Liquid Mirror Silver', hex: '#e2e8f0' }
    ],
    stockPerBranch: {
      vina_del_mar: 5,
      valparaiso: 3,
      quilpue: 2
    },
    totalStock: 10,
    isExclusive: false,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.8,
    reviewCount: 19,
    createdAt: '2026-03-25',
    updatedAt: '2026-04-01'
  },
  {
    id: 'prod_cartera_cyber_sale_06',
    sku: 'NL-BAG-006',
    title: 'Bolso Bandolera Cyber-Goth con Cadena Gruesa & Remaches',
    description: 'Bolso bandolera unisex con herrajes góticos cromados, bolsillo frontal expandible con cierre industrial y correa con cinta de seguridad regulable.',
    price: 42990,
    salePrice: 29990,
    discountPercent: 30,
    category: 'Carteras',
    subCategory: 'Crossbody',
    tags: ['Cyberpunk', 'Gótico', 'Carteras', 'Oferta', 'Sale'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: [],
    colors: [
      { name: 'Onyx Black', hex: '#111116' }
    ],
    stockPerBranch: {
      vina_del_mar: 8,
      valparaiso: 4,
      quilpue: 3
    },
    totalStock: 15,
    isExclusive: true,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.9,
    reviewCount: 22,
    createdAt: '2026-03-26',
    updatedAt: '2026-04-02'
  },
  {
    id: 'prod_gorra_trucker_07',
    sku: 'NL-CAP-007',
    title: 'Gorra Foam Trucker "NoLimits" Y2K Glitch',
    description: 'Gorra trucker de espuma frontal con panel trasero de malla transpirable, visera semicurva y parche bordado con tipografía pixel y cromo.',
    price: 19990,
    category: 'Gorras',
    subCategory: 'Trucker',
    tags: ['Trucker', 'Gorras', 'Y2K', 'Retro'],
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: [],
    colors: [
      { name: 'Black & Acid Cyan', hex: '#00e5ff' },
      { name: 'Total Blackout', hex: '#000000' }
    ],
    stockPerBranch: {
      vina_del_mar: 12,
      valparaiso: 8,
      quilpue: 5
    },
    totalStock: 25,
    isExclusive: false,
    isFeatured: false,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.6,
    reviewCount: 14,
    createdAt: '2026-03-22',
    updatedAt: '2026-04-01'
  },
  {
    id: 'prod_gorra_snapback_sale_08',
    sku: 'NL-CAP-008',
    title: 'Gorra Snapback Cyber-Gothic Bordado Neón 3D',
    description: 'Gorra snapback de 6 paneles con visera plana rígida, ojales metálicos bordados y logotipo cyber-gótico frontal en alto relieve.',
    price: 23990,
    salePrice: 17990,
    discountPercent: 25,
    category: 'Gorras',
    subCategory: 'Snapback',
    tags: ['Snapback', 'Gorras', 'Cyber-Goth', 'Oferta', 'Sale'],
    images: [
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: [],
    colors: [
      { name: 'Goth Black / Neon Violet', hex: '#8b5cf6' }
    ],
    stockPerBranch: {
      vina_del_mar: 7,
      valparaiso: 5,
      quilpue: 2
    },
    totalStock: 14,
    isExclusive: false,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.8,
    reviewCount: 31,
    createdAt: '2026-03-24',
    updatedAt: '2026-04-02'
  },
  {
    id: 'prod_choker_sale_09',
    sku: 'NL-ACC-009',
    title: 'Choker Industrial O-Ring con Cadena Triple Cromada',
    description: 'Collar gargantilla con argolla central O-Ring cromada de 45mm y triple caída de cadenas en eslabón cubano.',
    price: 21990,
    salePrice: 15990,
    discountPercent: 27,
    category: 'Accesorios & Joyería',
    subCategory: 'Chokers',
    tags: ['Punk', 'Choker', 'Oferta', 'Chrome', 'Sale'],
    images: [
      'https://joyaspatriciolillo.cl/wp-content/uploads/2023/12/WhatsApp-Image-2021-04-21-at-7.29.28-PM.jpeg'
    ],
    sizes: [],
    colors: [
      { name: 'Chrome & Black', hex: '#1f2937' }
    ],
    stockPerBranch: {
      vina_del_mar: 4,
      valparaiso: 4,
      quilpue: 2
    },
    totalStock: 10,
    isExclusive: false,
    isFeatured: false,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.9,
    reviewCount: 11,
    createdAt: '2026-03-28',
    updatedAt: '2026-04-03'
  },
  {
    id: 'prod_chaqueta_biker_10',
    sku: 'NL-JKT-010',
    title: 'Chaqueta Biker Cyber-Goth Cuero Vegano con Cierres Y2K',
    description: 'Chaqueta motera pesada en eco-cuero granulado con múltiples cierres metálicos plateados, tachas industriales y cinturón con hebilla cromada.',
    price: 68990,
    category: 'Chaquetas',
    subCategory: 'Biker',
    tags: ['Chaquetas', 'Biker', 'Gótico', 'Y2K', 'Cuero'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pitch Black', hex: '#0f0f14' }
    ],
    stockPerBranch: {
      vina_del_mar: 6,
      valparaiso: 4,
      quilpue: 2
    },
    totalStock: 12,
    isExclusive: true,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.9,
    reviewCount: 28,
    createdAt: '2026-03-29',
    updatedAt: '2026-04-04'
  },
  {
    id: 'prod_chaqueta_windbreaker_sale_11',
    sku: 'NL-JKT-011',
    title: 'Chaqueta Cortavientos Reflectante Cyber-Track Y2K',
    description: 'Chaqueta cortavientos técnica ultraliviana con paneles de microfibra reflectante 3M, cuello alto y elásticos ajustables con tancas de acetal.',
    price: 49990,
    salePrice: 34990,
    discountPercent: 30,
    category: 'Chaquetas',
    subCategory: 'Windbreaker',
    tags: ['Chaquetas', 'Reflectante', 'Cyberpunk', 'Oferta', 'Sale'],
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Silver Glitch & Neon Green', hex: '#4ade80' },
      { name: 'Dark Slate', hex: '#334155' }
    ],
    stockPerBranch: {
      vina_del_mar: 9,
      valparaiso: 5,
      quilpue: 3
    },
    totalStock: 17,
    isExclusive: false,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.8,
    reviewCount: 16,
    createdAt: '2026-03-30',
    updatedAt: '2026-04-05'
  },
  {
    id: 'prod_cyber_vest_soldout_12',
    sku: 'NL-VST-012',
    title: 'Chaleco Táctico Cyber-Rave Arnés Cromado [EDICIÓN AGOTADA]',
    description: 'Chaleco táctico con cinchas de nylon balístico de alta tenacidad, hebillas cobra de aluminio y mosquetones cromados. Edición limitada de Drop Live.',
    price: 39990,
    category: 'Chaquetas',
    subCategory: 'Vests',
    tags: ['Chaquetas', 'Techwear', 'Tactical', 'Agotado', 'Sold Out'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'Talla estándar'],
    colors: [
      { name: 'Void Blackout', hex: '#000000' }
    ],
    stockPerBranch: {
      vina_del_mar: 0,
      valparaiso: 0,
      quilpue: 0
    },
    totalStock: 0,
    isExclusive: true,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: false,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 5.0,
    reviewCount: 45,
    createdAt: '2026-03-30',
    updatedAt: '2026-04-05'
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
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
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
    photos: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80'
    ],
    likes: 14,
    branchPurchased: 'Valparaíso'
  },
  {
    id: 'rev_03',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_camila_y2k',
    userName: 'Camila Rojas',
    rating: 4,
    title: 'Muy buen corte aunque abrigado para media estación',
    comment: 'El material es súper grueso (algodón frisado pesado). Me encantó el diseño gótico y los cierres plateados. Solo tardó 1 día extra por Blue Express.',
    date: '2026-03-22',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    likes: 8,
    branchPurchased: 'Quilpué'
  },
  {
    id: 'rev_04',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_lucas_v',
    userName: 'Lucas Vera',
    rating: 4,
    title: 'Estilo cyber excelente y costuras reforzadas',
    comment: 'Queda excelente con pantalones cargo negros. Buenos acabados y los estampados reflectantes se ven genial con flash.',
    date: '2026-03-25',
    verifiedPurchase: false,
    photos: [],
    likes: 5,
    branchPurchased: 'Viña del Mar'
  },
  {
    id: 'rev_05',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_ignacio_s',
    userName: 'Ignacio Silva',
    rating: 3,
    title: 'Talla ligeramente más ancha de lo esperado',
    comment: 'Recomiendo pedir una talla menos si no te gusta el calce muy holgado. La calidad es buena pero consideren que es bien oversize.',
    date: '2026-03-27',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80'
    ],
    likes: 11,
    branchPurchased: 'Valparaíso'
  },
  {
    id: 'rev_06',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_sofia_m',
    userName: 'Sofía Moraga',
    rating: 5,
    title: 'Una joya del streetwear chileno',
    comment: 'Compré en preventa durante el Live y no me arrepiento. La atención en el local de Viña fue un 7 cuando fui a probarme.',
    date: '2026-04-01',
    verifiedPurchase: true,
    photos: [],
    likes: 6,
    branchPurchased: 'Viña del Mar'
  },
  {
    id: 'rev_07',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_diego_k',
    userName: 'Diego K.',
    rating: 2,
    title: 'Llegó con retraso del transportista',
    comment: 'La prenda en sí está bien confeccionada pero Starken tardó 4 días en entregar en mi comuna. Sugiero mejorar el courier.',
    date: '2026-04-02',
    verifiedPurchase: true,
    photos: [],
    likes: 3,
    branchPurchased: 'Quilpué'
  },
  {
    id: 'rev_08',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_fernanda_z',
    userName: 'Fernanda Z.',
    rating: 5,
    title: 'Fotos reales del calce puestas',
    comment: 'Dejo mis fotos para que vean cómo cae en persona. Queda espectacular, la textura es suave por dentro y rígida por fuera.',
    date: '2026-04-03',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80'
    ],
    likes: 22,
    branchPurchased: 'Viña del Mar'
  },
  {
    id: 'rev_09',
    productId: 'prod_cyber_hoodie_01',
    userId: 'usr_andres_p',
    userName: 'Andrés Pavez',
    rating: 1,
    title: 'Elegí mal la talla y tuve que ir a cambiarla',
    comment: 'La tabla de medidas me confundió un poco. Fui a la tienda de Valparaíso y me la cambiaron sin problema, pero ojo con el tamaño.',
    date: '2026-04-04',
    verifiedPurchase: true,
    photos: [],
    likes: 2,
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
