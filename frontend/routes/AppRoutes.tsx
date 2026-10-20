import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomeView } from '../views/HomeView';
import { CatalogView } from '../views/CatalogView';
import { ProductDetailView } from '../views/ProductDetailView';
import { CartView } from '../views/CartView';
import { CheckoutView } from '../views/CheckoutView';
import { AuthView } from '../views/AuthView';
import { ProfileView } from '../views/ProfileView';
import { ProtectedRoute } from './ProtectedRoute';

// Admin views
import { GlobalDashboardView } from '../views/admin/GlobalDashboardView';
import { BranchManagementView } from '../views/admin/BranchManagementView';
import { LocalBranchAdminView } from '../views/admin/LocalBranchAdminView';
import { LogisticsAnalyticsView } from '../views/admin/LogisticsAnalyticsView';
import { ExpressProductUploadView } from '../views/admin/ExpressProductUploadView';
import { InventoryManagementView } from '../views/admin/InventoryManagementView';
import { Top10AnalyticsView } from '../views/admin/Top10AnalyticsView';
import { RegisterExpenseView } from '../views/admin/RegisterExpenseView';
import { IncomeExpensesAnalyticsView } from '../views/admin/IncomeExpensesAnalyticsView';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public & Guest Routes */}
      <Route path="/" element={<HomeView />} />
      <Route path="/catalog" element={<CatalogView />} />
      <Route path="/product/:id" element={<ProductDetailView />} />
      <Route path="/cart" element={<CartView />} />
      <Route path="/checkout" element={<CheckoutView />} />
      <Route path="/auth" element={<AuthView />} />
      <Route path="/register" element={<AuthView />} />
      <Route path="/login" element={<AuthView />} />

      {/* 2. Registered Customer Protected Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['registered', 'branch_admin', 'super_admin']}>
            <ProfileView />
          </ProtectedRoute>
        }
      />

      {/* 3. Branch Admin & Super Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['branch_admin', 'super_admin']}>
            <GlobalDashboardView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'branch_admin']}>
            <InventoryManagementView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/top10"
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'branch_admin']}>
            <Top10AnalyticsView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/register-expense"
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'branch_admin']}>
            <RegisterExpenseView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/expenses"
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'branch_admin']}>
            <RegisterExpenseView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/income-expenses"
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'branch_admin']}>
            <IncomeExpensesAnalyticsView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/branches"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <BranchManagementView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/branch/:branchId"
        element={
          <ProtectedRoute allowedRoles={['branch_admin', 'super_admin']}>
            <LocalBranchAdminView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/logistics"
        element={
          <ProtectedRoute allowedRoles={['branch_admin', 'super_admin']}>
            <LogisticsAnalyticsView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/express-upload"
        element={
          <ProtectedRoute allowedRoles={['branch_admin', 'super_admin']}>
            <ExpressProductUploadView />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
