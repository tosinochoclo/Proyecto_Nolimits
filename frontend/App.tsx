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
              {/* Cosmic Y2K Desktop Workspace */}
              <div className="min-h-screen y2k-cosmic-bg y2k-stars-grid text-slate-100 flex flex-col selection:bg-[#ff007f] selection:text-white pb-14">
                {/* Vintage CRT Scanline Subtle Ambient Atmosphere */}
                <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] z-30 opacity-70"></div>

                {/* Top OS App Navigation */}
                <TopNavBar />

                {/* Main Dynamic View Area */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 py-4 sm:py-6 relative z-10">
                  <AppRoutes />
                </main>

                {/* Windows XP / 98 Retro Taskbar */}
                <OSDesktopTaskbar />
              </div>
            </AdminNotificationProvider>
          </CartProvider>
        </BranchProvider>
      </AuthProvider>
    </HashRouter>
  );
}
