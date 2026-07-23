import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCatalog } from '../../context/CatalogContext';
import { buildWhatsAppUrl } from '../../utils/publicHelpers';

export default function WhatsAppFab({ message }) {
  const { config } = useCatalog();
  const text =
    message ||
    config?.mensaje_bienvenida ||
    'Hola, deseo consultar por sus accesorios.';
  const href = buildWhatsAppUrl(config?.whatsapp, text);

  if (!href) return null;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden />
    </motion.a>
  );
}
