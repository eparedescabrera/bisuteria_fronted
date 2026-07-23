import Seo from '../../components/public/Seo';
import { useCatalog } from '../../context/CatalogContext';

export default function AboutPage() {
  const { config } = useCatalog();

  return (
    <>
      <Seo
        title="Nosotros"
        description={`Conoce la historia de ${config?.nombre_negocio || 'Accesorios Anny'}.`}
        path="/nosotros"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Nosotros</p>
        <h1 className="mt-2 font-[family-name:Georgia,serif] text-4xl">
          {config?.nombre_negocio || 'Accesorios Anny'}
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          {config?.descripcion ||
            'Bisutería y accesorios hechos con dedicación para acompañar tu estilo diario.'}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <h2 className="font-[family-name:Georgia,serif] text-2xl">Historia</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Nacimos del gusto por crear piezas accesibles, cálidas y con detalle. Cada accesorio
              busca acompañar momentos cotidianos con un toque especial.
            </p>
          </section>
          <section className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <h2 className="font-[family-name:Georgia,serif] text-2xl">Misión</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Ofrecer bisutería artesanal con atención cercana, claridad de disponibilidad y
              asesoría personalizada por WhatsApp.
            </p>
          </section>
          <section className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <h2 className="font-[family-name:Georgia,serif] text-2xl">Visión</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Ser la referencia local de accesorios con identidad, calidad y un catálogo digital
              confiable.
            </p>
          </section>
          <section className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <h2 className="font-[family-name:Georgia,serif] text-2xl">Valores</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-600">
              <li>Cercanía y honestidad</li>
              <li>Detalle en cada pieza</li>
              <li>Respuesta clara al cliente</li>
              <li>Compromiso con lo artesanal</li>
            </ul>
          </section>
        </div>

        {config?.direccion ? (
          <section className="mt-10 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200">
            <div className="border-b border-stone-200 px-6 py-4">
              <h2 className="font-[family-name:Georgia,serif] text-2xl">Ubicación</h2>
              <p className="mt-1 text-sm text-stone-600">{config.direccion}</p>
            </div>
            <iframe
              title="Mapa de ubicación"
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(config.direccion)}&output=embed`}
            />
          </section>
        ) : null}
      </div>
    </>
  );
}
