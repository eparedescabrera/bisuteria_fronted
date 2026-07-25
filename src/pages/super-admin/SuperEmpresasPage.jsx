import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  activarEmpresa,
  eliminarEmpresa,
  listEmpresas,
  renovarEmpresa,
  suspenderEmpresa
} from '../../api/superAdminApi';
import Spinner from '../../components/feedback/Spinner';
import ErrorState from '../../components/feedback/ErrorState';
import Button from '../../components/common/Button';
import { publicTiendaUrl } from '../../utils/tienda';

const estadoClass = {
  Activa: 'bg-emerald-50 text-emerald-800',
  Pendiente: 'bg-amber-50 text-amber-800',
  Suspendida: 'bg-orange-50 text-orange-800',
  Vencida: 'bg-red-50 text-red-800'
};

export default function SuperEmpresasPage() {
  const qc = useQueryClient();
  const [estado, setEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const q = useQuery({
    queryKey: ['super-admin', 'empresas', estado, busqueda],
    queryFn: () =>
      listEmpresas({
        ...(estado ? { estado } : {}),
        ...(busqueda ? { busqueda } : {})
      })
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ['super-admin', 'empresas'] });

  const mut = useMutation({
    mutationFn: async ({ action, id }) => {
      if (action === 'activar') return activarEmpresa(id);
      if (action === 'suspender') return suspenderEmpresa(id);
      if (action === 'renovar') return renovarEmpresa(id);
      if (action === 'eliminar') return eliminarEmpresa(id);
    },
    onSuccess: invalidate
  });

  if (q.isLoading) return <Spinner label="Cargando empresas" />;
  if (q.isError) {
    return (
      <ErrorState message={q.error?.response?.data?.message || 'No se pudo cargar'} />
    );
  }

  const rows = q.data || [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Empresas</h2>
        <p className="text-sm text-stone-500">Gestión de negocios suscritos</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          placeholder="Buscar…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Activa">Activa</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Suspendida">Suspendida</option>
          <option value="Vencida">Vencida</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Tienda pública</th>
              <th className="px-3 py-2">Plan</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Vence</th>
              <th className="px-3 py-2">Teléfono</th>
              <th className="px-3 py-2">Correo</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id_empresa} className="border-b border-stone-100">
                <td className="px-3 py-2 font-medium">{e.nombre_negocio}</td>
                <td className="px-3 py-2">
                  {e.slug ? (
                    <a
                      href={publicTiendaUrl(e.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-sky-700 underline break-all"
                    >
                      /t/{e.slug}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-3 py-2">{e.plan}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      estadoClass[e.estado] || 'bg-stone-100'
                    }`}
                  >
                    {e.estado}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {e.fecha_vencimiento
                    ? String(e.fecha_vencimiento).slice(0, 10)
                    : '—'}
                </td>
                <td className="px-3 py-2">{e.telefono}</td>
                <td className="px-3 py-2">{e.correo}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    <Link
                      to={`/super-admin/empresas/${e.id_empresa}`}
                      className="rounded bg-stone-100 px-2 py-1 text-xs hover:bg-stone-200"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/super-admin/empresas/${e.id_empresa}?editar=1`}
                      className="rounded bg-stone-100 px-2 py-1 text-xs hover:bg-stone-200"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-800"
                      onClick={() =>
                        mut.mutate({ action: 'activar', id: e.id_empresa })
                      }
                    >
                      Activar
                    </button>
                    <button
                      type="button"
                      className="rounded bg-orange-50 px-2 py-1 text-xs text-orange-800"
                      onClick={() =>
                        mut.mutate({ action: 'suspender', id: e.id_empresa })
                      }
                    >
                      Suspender
                    </button>
                    <button
                      type="button"
                      className="rounded bg-sky-50 px-2 py-1 text-xs text-sky-800"
                      onClick={() =>
                        mut.mutate({ action: 'renovar', id: e.id_empresa })
                      }
                    >
                      Renovar
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-50 px-2 py-1 text-xs text-red-800"
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Eliminar ${e.nombre_negocio}? (borrado lógico)`
                          )
                        ) {
                          mut.mutate({ action: 'eliminar', id: e.id_empresa });
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-stone-500">
                  Sin empresas
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {mut.isError ? (
        <p className="text-sm text-red-600">
          {mut.error?.response?.data?.message || 'Error al actualizar'}
        </p>
      ) : null}
      <Button type="button" variant="secondary" onClick={() => q.refetch()}>
        Actualizar
      </Button>
    </div>
  );
}
