import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEmpresa, updateEmpresa } from '../../api/superAdminApi';
import Spinner from '../../components/feedback/Spinner';
import ErrorState from '../../components/feedback/ErrorState';
import Button from '../../components/common/Button';
import { formatCRC } from '../../utils/currency';
import { publicTiendaUrl } from '../../utils/tienda';

export default function SuperEmpresaDetailPage() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const qc = useQueryClient();
  const [edit, setEdit] = useState(search.get('editar') === '1');
  const [form, setForm] = useState({});

  const q = useQuery({
    queryKey: ['super-admin', 'empresa', id],
    queryFn: () => getEmpresa(id)
  });

  useEffect(() => {
    if (q.data) {
      setForm({
        nombre_negocio: q.data.nombre_negocio || '',
        propietario: q.data.propietario || '',
        telefono: q.data.telefono || '',
        correo: q.data.correo || '',
        direccion: q.data.direccion || '',
        plan: q.data.plan || 'Mensual',
        observaciones: q.data.observaciones || '',
        fecha_vencimiento: q.data.fecha_vencimiento
          ? String(q.data.fecha_vencimiento).slice(0, 10)
          : ''
      });
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: () => updateEmpresa(id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin', 'empresa', id] });
      setEdit(false);
    }
  });

  if (q.isLoading) return <Spinner label="Cargando empresa" />;
  if (q.isError) {
    return (
      <ErrorState message={q.error?.response?.data?.message || 'No encontrada'} />
    );
  }

  const e = q.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/super-admin/empresas" className="text-sm text-stone-500 underline">
          ← Empresas
        </Link>
        <h2 className="text-xl font-semibold">{e.nombre_negocio}</h2>
        <Button type="button" variant="secondary" onClick={() => setEdit((v) => !v)}>
          {edit ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      {!edit ? (
        <dl className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-2">
          {[
            ['Estado', e.estado],
            ['Plan', e.plan],
            ['Propietario', e.propietario],
            ['Teléfono', e.telefono],
            ['Correo', e.correo],
            ['Dirección', e.direccion || '—'],
            [
              'Vencimiento',
              e.fecha_vencimiento
                ? String(e.fecha_vencimiento).slice(0, 10)
                : '—'
            ],
            ['Observaciones', e.observaciones || '—'],
            [
              'Tienda pública',
              e.slug ? (
                <a
                  href={publicTiendaUrl(e.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 underline break-all"
                >
                  {publicTiendaUrl(e.slug)}
                </a>
              ) : (
                '—'
              )
            ]
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase text-stone-500">{k}</dt>
              <dd className="mt-1 text-sm">{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <form
          className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-2"
          onSubmit={(ev) => {
            ev.preventDefault();
            save.mutate();
          }}
        >
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className="block text-sm">
              <span className="text-xs uppercase text-stone-500">{key}</span>
              <input
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
                value={value}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
              />
            </label>
          ))}
          <div className="sm:col-span-2">
            <Button type="submit" loading={save.isPending}>
              Guardar
            </Button>
          </div>
        </form>
      )}

      <section>
        <h3 className="mb-2 font-semibold">Suscripciones</h3>
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-3 py-2 text-left">Monto</th>
                <th className="px-3 py-2 text-left">Método</th>
                <th className="px-3 py-2 text-left">Inicio</th>
                <th className="px-3 py-2 text-left">Fin</th>
                <th className="px-3 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(e.suscripciones || []).map((s) => (
                <tr key={s.id_suscripcion} className="border-t">
                  <td className="px-3 py-2">{formatCRC(s.monto)}</td>
                  <td className="px-3 py-2">{s.metodo_pago}</td>
                  <td className="px-3 py-2">
                    {String(s.fecha_inicio || '').slice(0, 10)}
                  </td>
                  <td className="px-3 py-2">
                    {String(s.fecha_fin || '').slice(0, 10)}
                  </td>
                  <td className="px-3 py-2">{s.estado}</td>
                </tr>
              ))}
              {!e.suscripciones?.length ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-stone-500">
                    Sin historial
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
