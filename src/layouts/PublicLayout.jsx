import { Link, Navigate, Outlet, useParams } from 'react-router-dom';
import { CatalogProvider, useCatalog } from '../context/CatalogContext';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import WhatsAppFab from '../components/public/WhatsAppFab';
import StoreBrandHead from '../components/public/StoreBrandHead';
import Spinner from '../components/feedback/Spinner';
import { isValidTiendaSlug } from '../utils/tienda';

function TiendaShell() {
  const { loading, error, config, tiendaSlug } = useCatalog();
  const status = error?.response?.status;

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#faf7f2]">
        <Spinner label="Cargando tienda…" />
      </div>
    );
  }

  if (status === 404 || status === 403 || (!config && error)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-[#faf7f2] px-4 text-center text-[#3d2c29]">
        <h1 className="font-[family-name:Georgia,serif] text-2xl">
          {status === 403 ? 'Tienda no disponible' : 'Tienda no encontrada'}
        </h1>
        <p className="mt-2 max-w-md text-sm text-stone-600">
          {status === 403
            ? 'Esta tienda está pendiente, suspendida o vencida.'
            : `No existe una tienda con el enlace “${tiendaSlug}”.`}
        </p>
        <Link to="/suscribirse" className="mt-6 text-sm font-medium underline">
          Solicitar suscripción
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#faf7f2] text-[#3d2c29]">
      <StoreBrandHead />
      <PublicNavbar />
      <main id="contenido-principal">
        <Outlet />
      </main>
      <PublicFooter />
      <WhatsAppFab />
    </div>
  );
}

export default function PublicLayout() {
  const { tiendaSlug } = useParams();
  const slug = String(tiendaSlug || '').toLowerCase();

  if (!isValidTiendaSlug(slug)) {
    return <Navigate to="/" replace />;
  }

  return (
    <CatalogProvider tiendaSlug={slug}>
      <TiendaShell />
    </CatalogProvider>
  );
}
