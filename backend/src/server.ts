import express from 'express';
import cors from 'cors';
import { Router } from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database / Mock Store for No Limits OS
let products = [
  {
    id: 'prod_1',
    sku: 'NL-CYBER-001',
    title: 'Top Corset Cyber-Spiders Darkwear',
    description: 'Corset gótico futurista con apliques de telarañas cromadas y tirantes ajustables estilo arnés Y2K.',
    price: 32990,
    category: 'Poleras & Tops',
    tags: ['Cyber-Goth', 'Drop Exclusivo', 'Y2K'],
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Void Black', hex: '#0a0a0c' }],
    stockPerBranch: { vina_del_mar: 3, valparaiso: 2, quilpue: 1 },
    totalStock: 6,
    isExclusive: true,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 5.0,
    reviewCount: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_2',
    sku: 'NL-PANTS-002',
    title: 'Pantalón Parachute Baggy Matrix Silver',
    description: 'Pantalón parachute oversize con bolsillos cargo holográficos, cordones reflectantes y tela ripstop.',
    price: 45990,
    category: 'Pantalones & Faldas',
    tags: ['Baggy', 'Streetwear', 'Reflectivo'],
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80'],
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Silver Chrome', hex: '#cbd5e1' }],
    stockPerBranch: { vina_del_mar: 5, valparaiso: 1, quilpue: 4 },
    totalStock: 10,
    isExclusive: true,
    isFeatured: true,
    isHidden: false,
    allowStorePickup: true,
    branchesEnabled: ['vina_del_mar', 'valparaiso', 'quilpue'],
    rating: 4.9,
    reviewCount: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const branches = [
  {
    id: 'vina_del_mar',
    name: 'Sucursal Viña del Mar (Cyber Hub)',
    city: 'Viña del Mar',
    address: 'Calle Valparaíso 542, Galería Cristal Local 14',
    phone: '+56 9 8472 9102',
    email: 'vina@nolimits.cl',
    isActive: true,
    isFlagship: true,
    workingHours: 'Lun a Sáb 11:00 - 20:00 hrs',
    posIdentifier: 'POS-VINA-01',
    pickupHoursEstimate: 'Listo en 2 horas',
    allowTransferIn: true,
    allowTransferOut: true,
  },
  {
    id: 'valparaiso',
    name: 'Sucursal Valparaíso (Puerto Cyber Lab)',
    city: 'Valparaíso',
    address: 'Av. Pedro Montt 1892, Local 3B',
    phone: '+56 9 7381 2940',
    email: 'valpo@nolimits.cl',
    isActive: true,
    isFlagship: false,
    workingHours: 'Lun a Sáb 11:30 - 19:30 hrs',
    posIdentifier: 'POS-VALPO-01',
    pickupHoursEstimate: 'Listo en 4 horas',
    allowTransferIn: true,
    allowTransferOut: true,
  },
  {
    id: 'quilpue',
    name: 'Sucursal Quilpué (Sub-Core Station)',
    city: 'Quilpué',
    address: 'Vicuña Mackenna 620, Boulevard Centro',
    phone: '+56 9 9128 4710',
    email: 'quilpue@nolimits.cl',
    isActive: true,
    isFlagship: false,
    workingHours: 'Lun a Sáb 12:00 - 19:00 hrs',
    posIdentifier: 'POS-QUILPUE-01',
    pickupHoursEstimate: 'Listo en 24 horas',
    allowTransferIn: true,
    allowTransferOut: false,
  }
];

// Routes
const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'No Limits API Backend' });
});

// Products
apiRouter.get('/products', (req, res) => {
  const { category, branchId, search } = req.query;
  let result = [...products];

  if (category && category !== 'all') {
    result = result.filter(p => p.category.toLowerCase().includes(String(category).toLowerCase()));
  }
  if (branchId && branchId !== 'all') {
    result = result.filter(p => ((p.stockPerBranch as Record<string, number>)[String(branchId)] || 0) > 0);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
  }

  res.json(result);
});

apiRouter.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
});

apiRouter.post('/products', (req, res) => {
  const newProduct = {
    id: `prod_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// Branches
apiRouter.get('/branches', (req, res) => {
  res.json(branches);
});

// Webpay Simulation
apiRouter.post('/payments/webpay/create', (req, res) => {
  const { amount, orderId } = req.body;
  res.json({
    token: `tbk_token_${Date.now()}`,
    url: 'https://webpay3gint.transbank.cl/webpayserver/initTransaction',
    amount,
    orderId,
    status: 'INITIALIZED',
  });
});

app.use('/api', apiRouter);

// Fallback error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`[BACKEND] No Limits API running on http://localhost:${PORT}/api`);
});
