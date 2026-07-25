import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute, { SuperAdminRoute } from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import PublicLayout from '../layouts/PublicLayout';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import LoginPage from '../pages/auth/LoginPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import NotFoundPage from '../pages/errors/NotFoundPage';
import { useAuth } from '../hooks/useAuth';
import { homePathForUser } from '../utils/permissions';
import { DEFAULT_TIENDA_SLUG } from '../utils/tienda';

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
const SubscribePage = lazy(() => import('../pages/public/SubscribePage'));

const SuperDashboardPage = lazy(
  () => import('../pages/super-admin/SuperDashboardPage')
);
const SuperEmpresasPage = lazy(
  () => import('../pages/super-admin/SuperEmpresasPage')
);
const SuperEmpresaDetailPage = lazy(
  () => import('../pages/super-admin/SuperEmpresaDetailPage')
);

function PublicOnly({ children }) {
  const { isAuthenticated, booting, user } = useAuth();
  if (booting) return null;
  if (isAuthenticated) {
    return <Navigate to={homePathForUser(user)} replace />;
  }
  return children;
}

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-stone-500">
      Cargando…
    </div>
  );
}

const defaultStore = `/t/${DEFAULT_TIENDA_SLUG}`;

function LegacyProductRedirect() {
  const { slug } = useParams();
  return <Navigate to={`${defaultStore}/producto/${slug}`} replace />;
}

function LegacyCategoryRedirect() {
  const { slug } = useParams();
  return <Navigate to={`${defaultStore}/categoria/${slug}`} replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Plataforma (sin tienda) */}
          <Route path="/" element={<Navigate to={defaultStore} replace />} />
          <Route path="/suscribirse" element={<SubscribePage />} />

          {/* Compatibilidad rutas antiguas → tienda principal */}
          <Route path="/productos" element={<Navigate to={`${defaultStore}/productos`} replace />} />
          <Route path="/producto/:slug" element={<LegacyProductRedirect />} />
          <Route path="/categoria/:slug" element={<LegacyCategoryRedirect />} />
          <Route path="/nosotros" element={<Navigate to={`${defaultStore}/nosotros`} replace />} />
          <Route path="/contacto" element={<Navigate to={`${defaultStore}/contacto`} replace />} />

          {/* Catálogo por tienda: /t/{slug} */}
          <Route path="/t/:tiendaSlug" element={<PublicLayout />}>
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

          <Route element={<SuperAdminRoute />}>
            <Route path="/super-admin" element={<SuperAdminLayout />}>
              <Route index element={<SuperDashboardPage />} />
              <Route path="empresas" element={<SuperEmpresasPage />} />
              <Route path="empresas/:id" element={<SuperEmpresaDetailPage />} />
            </Route>
          </Route>

          <Route path="/403" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
