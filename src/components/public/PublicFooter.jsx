import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useCatalog } from '../../context/CatalogContext';
import { buildWhatsAppUrl, cloudinaryUrl } from '../../utils/publicHelpers';

export default function PublicFooter() {
  const { config } = useCatalog();
  const wa = buildWhatsAppUrl(config?.whatsapp, 'Hola, deseo más información.');

  return (
    <footer className="mt-16 border-t border-stone-200 bg-[#3d2c29] text-[#f3e6d8]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {config?.logo_url ? (
              <img
                src={cloudinaryUrl(config.logo_url, { width: 80 })}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : null}
            <div>
              <p className="font-[family-name:Georgia,serif] text-xl">
                {config?.nombre_negocio || 'Accesorios Anny'}
              </p>
              <p className="mt-1 text-sm text-[#e8d5c4]/80">
                {config?.descripcion || 'Bisutería hecha con dedicación'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#e8d5c4]">
            Información
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/productos" className="hover:underline">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/nosotros" className="hover:underline">
                Nosotros
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:underline">
                Contacto
              </Link>
            </li>
            {config?.direccion ? <li>{config.direccion}</li> : null}
            {config?.telefono ? <li>Tel: {config.telefono}</li> : null}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#e8d5c4]">
            Redes
          </p>
          <div className="mt-3 flex gap-3">
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp className="h-6 w-6" />
              </a>
            ) : null}
            {config?.facebook ? (
              <a
                href={config.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
            ) : null}
            {config?.instagram ? (
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            ) : null}
          </div>
          {config?.mensaje_inferior ? (
            <p className="mt-4 text-sm text-[#e8d5c4]/80">{config.mensaje_inferior}</p>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[#e8d5c4]/70">
        © {new Date().getFullYear()} {config?.nombre_negocio || 'Accesorios Anny'}. Todos los
        derechos reservados.
      </div>
    </footer>
  );
}
