import { useState } from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Seo from '../../components/public/Seo';
import { useCatalog } from '../../context/CatalogContext';
import { buildWhatsAppUrl } from '../../utils/publicHelpers';

export default function ContactPage() {
  const { config } = useCatalog();
  const [form, setForm] = useState({ nombre: '', mensaje: '' });

  const waBase = buildWhatsAppUrl(
    config?.whatsapp,
    `Hola, soy ${form.nombre || 'un cliente'}.\n\n${form.mensaje || 'Deseo más información.'}`
  );

  return (
    <>
      <Seo
        title="Contacto"
        description="Teléfono, WhatsApp y redes de Accesorios Anny."
        path="/contacto"
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Contacto</p>
          <h1 className="mt-2 font-[family-name:Georgia,serif] text-4xl">Hablemos</h1>
          <p className="mt-3 text-stone-600">
            Toda consulta de disponibilidad y diseños se atiende por WhatsApp.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {config?.telefono ? <li>Teléfono: {config.telefono}</li> : null}
            {config?.whatsapp ? <li>WhatsApp: {config.whatsapp}</li> : null}
            {config?.correo ? <li>Correo: {config.correo}</li> : null}
            {config?.direccion ? <li>Ubicación: {config.direccion}</li> : null}
            <li>Horario: consulta por WhatsApp (sujeto a disponibilidad)</li>
          </ul>

          <div className="mt-6 flex gap-4 text-2xl text-[#3d2c29]">
            {waBase ? (
              <a href={waBase} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
            ) : null}
            {config?.facebook ? (
              <a href={config.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
            ) : null}
            {config?.instagram ? (
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            ) : null}
          </div>
        </div>

        <form
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
          onSubmit={(e) => {
            e.preventDefault();
            if (waBase) window.open(waBase, '_blank', 'noopener,noreferrer');
          }}
        >
          <h2 className="font-[family-name:Georgia,serif] text-2xl">Formulario rápido</h2>
          <p className="mt-1 text-sm text-stone-500">
            Se abre WhatsApp con tu mensaje. No enviamos datos a un servidor propio.
          </p>
          <label className="mt-5 block text-sm">
            Nombre
            <input
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              required
            />
          </label>
          <label className="mt-4 block text-sm">
            Mensaje
            <textarea
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
              rows={4}
              value={form.mensaje}
              onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
              required
            />
          </label>
          <button
            type="submit"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white"
          >
            <FaWhatsapp /> Enviar por WhatsApp
          </button>
        </form>
      </div>
    </>
  );
}
