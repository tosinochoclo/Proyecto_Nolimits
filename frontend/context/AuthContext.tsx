import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, pass?: string) => Promise<boolean>;
  register: (name: string, email: string, pass?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addLoyaltyPoints: (amount: number) => void;
  deductLoyaltyPoints: (amount: number) => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('nolimits_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Bonificación de testeo solicitada por el usuario: +1000 puntos para la cuenta del cliente
        const testPointsApplied = localStorage.getItem('nolimits_test_1000_pts_applied');
        if (!testPointsApplied && parsed.role === 'registered') {
          parsed.loyaltyPoints = (parsed.loyaltyPoints || 0) + 1000;
          localStorage.setItem('nolimits_test_1000_pts_applied', 'true');
          localStorage.setItem('nolimits_auth_user', JSON.stringify(parsed));
        }
        return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Guest by default
  });

  const currentRole = currentUser.role;

  useEffect(() => {
    localStorage.setItem('nolimits_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const setRole = (role: UserRole) => {
    const userForRole = INITIAL_USERS.find(u => u.role === role) || {
      id: `usr_${role}`,
      name: role === 'guest' ? 'Invitado Cyber' : `Usuario ${role}`,
      email: `${role}@nolimits.cl`,
      role,
      loyaltyPoints: role === 'registered' ? 1250 : 0,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(userForRole);
  };

  const login = async (email: string): Promise<boolean> => {
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // New registered user
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'registered',
      loyaltyPoints: 100, // Welcome points
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, pass?: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email,
      role: 'registered',
      loyaltyPoints: 100, // Welcome points
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const googleUser: User = {
      id: 'usr_google_quick',
      name: 'Sebastián Cyber Guest',
      email: 'sebastian.stream@gmail.com',
      role: 'registered',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      loyaltyPoints: 150,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(googleUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(INITIAL_USERS[0]); // Reset to guest
  };

  const updateProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => {
      const newFirstName = data.firstName !== undefined ? data.firstName : prev.firstName;
      const newLastName = data.lastName !== undefined ? data.lastName : prev.lastName;
      const computedName = (newFirstName || newLastName)
        ? `${newFirstName || ''} ${newLastName || ''}`.trim()
        : (data.name || prev.name);

      const updated: User = {
        ...prev,
        ...data,
        name: computedName
      };
      localStorage.setItem('nolimits_auth_user', JSON.stringify(updated));

      // Sincronizar datos de titular con la pasarela de compra (Checkout)
      try {
        const checkoutInfo = JSON.parse(localStorage.getItem('nolimits_checkout_info') || '{}');
        const updatedCheckout = {
          ...checkoutInfo,
          customerName: computedName || checkoutInfo.customerName,
          customerRut: data.rut || prev.rut || checkoutInfo.customerRut,
          customerPhone: data.phone || prev.phone || checkoutInfo.customerPhone,
          customerEmail: data.email || prev.email || checkoutInfo.customerEmail,
          customerFirstName: newFirstName || checkoutInfo.customerFirstName,
          customerLastName: newLastName || checkoutInfo.customerLastName
        };
        localStorage.setItem('nolimits_checkout_info', JSON.stringify(updatedCheckout));
      } catch {
        // ignore
      }

      return updated;
    });
  };

  const addLoyaltyPoints = (amount: number) => {
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        loyaltyPoints: (prev.loyaltyPoints || 0) + amount,
      };
      return updated;
    });
  };

  const deductLoyaltyPoints = (amount: number): boolean => {
    if ((currentUser.loyaltyPoints || 0) < amount) return false;
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        loyaltyPoints: Math.max(0, (prev.loyaltyPoints || 0) - amount),
      };
      return updated;
    });
    return true;
  };

  const isAuthenticated = currentUser.role !== 'guest';
  const isAdmin = currentUser.role === 'branch_admin' || currentUser.role === 'super_admin';
  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        setRole,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        addLoyaltyPoints,
        deductLoyaltyPoints,
        isAuthenticated,
        isAdmin,
        isSuperAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
