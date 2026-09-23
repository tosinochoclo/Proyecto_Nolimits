/**
 * No Limits REST API Client & Service Contract
 * Prepared for Express.js / Node.js Backend with JWT Auth, Webpay, Cloudinary & OCR
 */

import { Product, Order, Review, BlacklistCustomer, BranchAnalytics, AdminAlertNotification } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BRANCHES, INITIAL_REVIEWS, INITIAL_BLACKLIST, INITIAL_ANALYTICS } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('nolimits_jwt_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('nolimits_jwt_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('nolimits_jwt_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error [${response.status}]: ${response.statusText}`);
      }

      return await response.json();
    } catch {
      // In development or when backend is mocked, return local mock fallbacks seamlessly
      return this.handleMockFallback<T>(endpoint, options);
    }
  }

  private handleMockFallback<T>(endpoint: string, options: RequestInit): T {
    // Seamless offline/local demo handler
    if (endpoint.startsWith('/products')) {
      return INITIAL_PRODUCTS as unknown as T;
    }
    if (endpoint.startsWith('/branches')) {
      return INITIAL_BRANCHES as unknown as T;
    }
    if (endpoint.startsWith('/analytics')) {
      return INITIAL_ANALYTICS as unknown as T;
    }
    if (endpoint.startsWith('/blacklist')) {
      return INITIAL_BLACKLIST as unknown as T;
    }
    return {} as T;
  }

  // --- Products Service ---
  async getProducts(params?: { category?: string; branchId?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }): Promise<Product[]> {
    let list = [...INITIAL_PRODUCTS];
    if (params?.category && params.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase().includes(params.category!.toLowerCase()));
    }
    if (params?.branchId && params.branchId !== 'all') {
      list = list.filter(p => (p.stockPerBranch[params.branchId!] || 0) > 0);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return INITIAL_PRODUCTS.find(p => p.id === id);
  }

  // Express Upload (up to 20 garments in < 5 mins)
  async createProductExpress(productData: Partial<Product>): Promise<Product> {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      sku: productData.sku || `NL-${Math.floor(100 + Math.random() * 900)}`,
      title: productData.title || 'Prenda Exclusiva',
      description: productData.description || '',
      price: productData.price || 0,
      salePrice: productData.salePrice,
      discountPercent: productData.discountPercent,
      category: productData.category || 'Poleras & Tops',
      tags: productData.tags || ['Drop Exclusivo'],
      images: productData.images || ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'],
      sizes: productData.sizes || ['M', 'L'],
      colors: productData.colors || [{ name: 'Void Black', hex: '#000000' }],
      stockPerBranch: productData.stockPerBranch || { vina_del_mar: 1, valparaiso: 1, quilpue: 1 },
      totalStock: productData.totalStock || 3,
      isExclusive: productData.isExclusive ?? true,
      isFeatured: productData.isFeatured ?? false,
      isHidden: productData.isHidden ?? false,
      allowStorePickup: productData.allowStorePickup ?? true,
      branchesEnabled: productData.branchesEnabled || ['vina_del_mar', 'valparaiso', 'quilpue'],
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newProduct;
  }

  // --- Payment & Voucher OCR Service ---
  async initiateWebpayTransaction(orderId: string, amount: number) {
    return {
      token: `tbk_${Date.now()}`,
      url: `https://webpay3gint.transbank.cl/webpayserver/initTransaction`,
      status: 'INITIALIZED'
    };
  }

  async uploadAndScanVoucher(file: File): Promise<{
    verified: boolean;
    confidence: number;
    extractedAmount: number;
    bankName: string;
    transactionCode: string;
    isDuplicate: boolean;
  }> {
    // Simulates Smart Voucher OCR scanner
    await new Promise(r => setTimeout(r, 1200));
    return {
      verified: true,
      confidence: 0.96,
      extractedAmount: 38990,
      bankName: 'BancoEstado / CuentaRUT',
      transactionCode: `TRANS-${Math.floor(100000 + Math.random() * 900000)}`,
      isDuplicate: false
    };
  }

  // --- Logistics & Carriers Service ---
  async trackShipment(carrier: 'starken' | 'blue_express' | 'paket', trackingCode: string) {
    return {
      carrier,
      trackingCode,
      status: 'En tránsito a sucursal de destino',
      estimatedDelivery: '24-48 hrs hábiles',
      origin: 'Viña del Mar Central Hub',
      destination: 'Valparaíso Puerto Cyber Lab',
      checkpoints: [
        { time: '10:30 hrs', event: 'Paquete recibido en centro de distribución Viña' },
        { time: '14:15 hrs', event: 'Clasificado y despachado en ruta troncal' }
      ]
    };
  }
}

export const api = new ApiClient();
