/**
 * No Limits - Cyber-Gothic Y2K Apparel OS
 * Core Domain Interfaces & Type Definitions
 */

export type UserRole = 'guest' | 'registered' | 'branch_admin' | 'super_admin';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  managerName: string;
  isActive: boolean;
  colorTag: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  branchId?: string; // Para branch_admin (Jefe de Sucursal)
  loyaltyPoints: number;
  phone?: string;
  rut?: string;
  isBlacklisted?: boolean;
  blacklistReason?: string;
  createdAt: string;
}

export type ProductStatus = 'available' | 'low_stock' | 'reserved_live' | 'sold_out';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  discountPercent?: number;
  category: string;
  subCategory?: string;
  tags: string[];
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stockPerBranch: Record<string, number>; // { 'vina': 4, 'valpo': 2, 'quilpue': 0 }
  totalStock: number;
  isExclusive: boolean;
  isFeatured: boolean;
  isHidden: boolean; // Estado oculto (solo visible para admin)
  allowStorePickup: boolean;
  branchesEnabled: string[]; // ['vina', 'valpo', 'quilpue']
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  photos: string[];
  likes: number;
  branchPurchased?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
  pickupBranchId?: string;
  unitPrice: number;
  discountApplicable: number;
}

export type OrderStatus =
  | 'pending_payment'
  | 'validating_voucher'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'ready_for_pickup'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethodType = 'webpay' | 'voucher_transfer';
export type ShippingProviderType = 'starken' | 'blue_express' | 'paket' | 'store_pickup';

export interface ShippingAddress {
  fullName: string;
  rut: string;
  phone: string;
  street: string;
  number: string;
  apartment?: string;
  city: string;
  region: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  branchId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  voucherUrl?: string;
  voucherOcrConfidence?: number;
  voucherValidatedByAi?: boolean;
  shippingProvider: ShippingProviderType;
  trackingNumber?: string;
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface AdminAlertNotification {
  id: string;
  type: 'debt_reminder' | 'shipping_alert' | 'stock_critical' | 'live_order';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  targetCustomerId?: string;
  targetCustomerName?: string;
  targetOrderId?: string;
  debtAmount?: number;
  dueHoursEstimate?: number;
  isRead: boolean;
  createdAt: string;
}

export interface BlacklistCustomer {
  id: string;
  name: string;
  rut: string;
  email: string;
  phone: string;
  debtAmount: number;
  reason: string;
  incidentCount: number;
  status: 'active_blocked' | 'warning' | 'cleared';
  dateAdded: string;
}

export interface BranchAnalytics {
  branchId: string;
  branchName: string;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  projectedProfit: number;
  ordersProcessed: number;
  activeLiveOrders: number;
  topProducts: { productId: string; title: string; unitsSold: number; revenue: number }[];
  laggingProducts: { productId: string; title: string; daysInStock: number; stockLeft: number }[];
}

export interface CheckoutCustomerData {
  customerName: string;
  customerRut?: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethod: 'pickup' | 'shipping';
  selectedBranchId: string;
  shippingCountry?: string; // Fijo 'Chile'
  shippingComuna?: string;
  shippingStreet?: string;
  shippingNumber?: string;
  shippingNoNumber?: boolean;
  shippingApartment?: string;
  shippingPostalCode?: string;
  shippingNotes?: string;
  shippingCourier?: 'Starken' | 'bluexpress' | 'Paket' | 'Paket ';
  shippingAddress: string;
  shippingCity: string;
}
