import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, pass?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
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
        return JSON.parse(saved);
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
      loyaltyPoints: role === 'registered' ? 250 : 0,
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
        loginWithGoogle,
        logout,
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
