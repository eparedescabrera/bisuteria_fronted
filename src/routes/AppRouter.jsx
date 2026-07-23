import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import PublicLayout from '../layouts/PublicLayout';
import LoginPage from '../pages/auth/LoginPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import NotFoundPage from '../pages/errors/NotFoundPage';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const CategoriesPage = lazy(() => import('../pages/categories/CategoriesPage'));
const ProductsPage = lazy(() => import('../pages/products/ProductsPage'));
const ProductCreatePage = lazy(() => import('../pages/products/ProductCreatePage'));
const ProductEditPage = lazy(() => import('../pages/products/ProductEditPage'));
const ProductDetailPage = lazy(() => import('../pages/products/ProductDetailPage'));
const InventoryPage = lazy(() => import('../pages/inventory/InventoryPage'));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

const HomePage = lazy(() => import('../pages/public/HomePage'));
const PublicProductsPage = lazy(() => import('../pages/public/PublicProductsPage'));
const PublicProductDetailPage = lazy(
  () => import('../pages/public/PublicProductDetailPage')
);
const CategoryPage = lazy(() => import('../pages/public/CategoryPage'));
const AboutPage = lazy(() => import('../pages/public/AboutPage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));

function PublicOnly({ children }) {
  const { isAuthenticated, booting } = useAuth();
  if (booting) return null;
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return children;
}

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-stone-500">
      Cargando…
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="productos" element={<PublicProductsPage />} />
            <Route path="producto/:slug" element={<PublicProductDetailPage />} />
            <Route path="categoria/:slug" element={<CategoryPage />} />
            <Route path="nosotros" element={<AboutPage />} />
            <Route path="contacto" element={<ContactPage />} />
          </Route>

          <Route
            element={
              <PublicOnly>
                <AuthLayout />
              </PublicOnly>
            }
          >
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="categorias" element={<CategoriesPage />} />
              <Route path="productos" element={<ProductsPage />} />
              <Route path="productos/nuevo" element={<ProductCreatePage />} />
              <Route path="productos/:id" element={<ProductDetailPage />} />
              <Route path="productos/:id/editar" element={<ProductEditPage />} />
              <Route path="inventario" element={<InventoryPage />} />
              <Route path="reportes" element={<ReportsPage />} />
              <Route path="configuracion" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="/403" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
