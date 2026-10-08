import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductColor } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, branchId?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  loyaltyPointsDiscount: number;
  applyLoyaltyPoints: (points: number) => void;
  pointsApplied: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nolimits_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [pointsApplied, setPointsApplied] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('nolimits_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (
    product: Product,
    size: string,
    color: ProductColor,
    branchId?: string,
    quantity: number = 1
  ) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name &&
          item.pickupBranchId === branchId
      );

      const price = product.salePrice ?? product.price;
      const originalPrice = product.price;
      const discountUnit = originalPrice - price;

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart_${product.id}_${size}_${color.name}_${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          pickupBranchId: branchId,
          unitPrice: price,
          discountApplicable: discountUnit
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      // No quitar automáticamente la prenda al reducir a menos de 1 con '-';
      // para eliminar la prenda se debe usar el botón 'Quitar' (removeFromCart).
      return;
    }
    setItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setPointsApplied(0);
  };

  const applyLoyaltyPoints = (points: number) => {
    setPointsApplied(points);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const directDiscount = items.reduce(
    (sum, item) => sum + (item.discountApplicable > 0 ? item.discountApplicable * item.quantity : 0),
    0
  );

  // 1 point = $10 CLP discount
  const loyaltyPointsDiscount = Math.min(pointsApplied * 10, subtotal * 0.4);

  const discount = directDiscount + loyaltyPointsDiscount;

  // Free shipping over $50.000 CLP, otherwise standard $3.990 CLP
  const shippingCost = items.length === 0 ? 0 : subtotal - discount > 50000 ? 0 : 3990;

  const total = Math.max(0, subtotal - discount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shippingCost,
        total,
        loyaltyPointsDiscount,
        applyLoyaltyPoints,
        pointsApplied
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
