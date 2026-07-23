import { Outlet } from 'react-router-dom';
import { CatalogProvider } from '../context/CatalogContext';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import WhatsAppFab from '../components/public/WhatsAppFab';

export default function PublicLayout() {
  return (
    <CatalogProvider>
      <div className="min-h-svh overflow-x-hidden bg-[#faf7f2] text-[#3d2c29]">
        <PublicNavbar />
        <main id="contenido-principal">
          <Outlet />
        </main>
        <PublicFooter />
        <WhatsAppFab />
      </div>
    </CatalogProvider>
  );
}
