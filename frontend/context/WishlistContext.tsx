import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { INITIAL_PRODUCTS } from '../services/mockData';

interface WishlistContextType {
  wishlist: Product[];
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => { success: boolean; isAdded: boolean; requiresAuth: boolean };
  addToWishlist: (product: Product) => { success: boolean; requiresAuth: boolean };
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();

  // Clave de almacenamiento por usuario (o sesión registrada)
  const storageKey = currentUser?.id && currentUser.role !== 'guest'
    ? `nolimits_wishlist_${currentUser.id}`
    : 'nolimits_wishlist_shared';

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      // Si el usuario es registrado, verificar su almacenamiento local
      if (currentUser && currentUser.role !== 'guest') {
        const key = `nolimits_wishlist_${currentUser.id}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
        // Semilla inicial amigable de 1 producto demo si es usuario registrado nuevo
        return [INITIAL_PRODUCTS[0]];
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sincronizar cuando cambia el usuario autenticado
  useEffect(() => {
    try {
      if (currentUser && currentUser.role !== 'guest') {
        const key = `nolimits_wishlist_${currentUser.id}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          setWishlist(JSON.parse(saved));
        } else {
          // Si no tiene nada guardado, sembrar 1 producto demo para que explore
          const seed = [INITIAL_PRODUCTS[0]];
          setWishlist(seed);
          localStorage.setItem(key, JSON.stringify(seed));
        }
      } else {
        // Invitado no tiene lista persistida hasta registrarse
        setWishlist([]);
      }
    } catch {
      setWishlist([]);
    }
  }, [currentUser?.id, currentUser?.role]);

  // Persistir cambios en localStorage para usuarios registrados
  useEffect(() => {
    if (currentUser && currentUser.role !== 'guest') {
      try {
        const key = `nolimits_wishlist_${currentUser.id}`;
        localStorage.setItem(key, JSON.stringify(wishlist));
      } catch {
        // ignore
      }
    }
  }, [wishlist, currentUser?.id, currentUser?.role]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const addToWishlist = (product: Product): { success: boolean; requiresAuth: boolean } => {
    if (!isAuthenticated || currentUser.role === 'guest') {
      return { success: false, requiresAuth: true };
    }

    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product]);
    }
    return { success: true, requiresAuth: false };
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product: Product): { success: boolean; isAdded: boolean; requiresAuth: boolean } => {
    if (!isAuthenticated || currentUser.role === 'guest') {
      return { success: false, isAdded: false, requiresAuth: true };
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return { success: true, isAdded: false, requiresAuth: false };
    } else {
      setWishlist((prev) => [...prev, product]);
      return { success: true, isAdded: true, requiresAuth: false };
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds: wishlist.map((p) => p.id),
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
