/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BranchProvider } from './context/BranchContext';
import { CartProvider } from './context/CartContext';
import { AdminNotificationProvider } from './context/AdminNotificationContext';
import { TopNavBar } from './components/layout/TopNavBar';
import { OSDesktopTaskbar } from './components/layout/OSDesktopTaskbar';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <BranchProvider>
          <CartProvider>
            <AdminNotificationProvider>
              {/* Escritorio Windows XP con Tapiz Clásico "Bliss" (Colina verde, cielo azul y nubes) */}
              <div className="min-h-screen winxp-bliss-background text-gray-900 flex flex-col selection:bg-[#316ac5] selection:text-white pb-12 font-sans">
                {/* Barra de Navegación Estilo Internet Explorer 6 / Windows Explorer */}
                <TopNavBar />

                {/* Área de Visualización Principal (Ventanas y Contenido Blanco Limpio) */}
                <main className="flex-1 w-full max-w-[94%] xl:max-w-[1500px] 2xl:max-w-[1650px] mx-auto px-2 sm:px-3 py-3 relative z-10">
                  <AppRoutes />
                </main>

                {/* Barra de Tareas Oficial de Windows XP Luna Blue con Botón Inicio Verde */}
                <OSDesktopTaskbar />
              </div>
            </AdminNotificationProvider>
          </CartProvider>
        </BranchProvider>
      </AuthProvider>
    </HashRouter>
  );
}
