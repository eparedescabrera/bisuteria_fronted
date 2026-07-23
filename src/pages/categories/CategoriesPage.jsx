import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from '../../api/categoriesApi';
import { categorySchema } from '../../schemas/categorySchema';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import FormField, { inputClass } from '../../components/forms/FormField';
import Spinner from '../../components/feedback/Spinner';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import {
  confirmAction,
  toastError,
  toastSuccess
} from '../../components/feedback/alerts';
import { useDebounce } from '../../hooks/useDebounce';
import { getApiErrorMessage } from '../../utils/formatters';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [busqueda, setBusqueda] = useState('');
  const [editing, setEditing] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const debouncedSearch = useDebounce(busqueda);

  const query = useQuery({
    queryKey: ['categorias', { busqueda: debouncedSearch }],
    queryFn: () =>
      listCategories({
        busqueda: debouncedSearch || undefined,
        pagina: 1,
        limite: 100
      }),
    placeholderData: (prev) => prev
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { nombre: '', descripcion: '', estado: true, orden_visual: 0 }
  });

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        nombre: values.nombre,
        descripcion: values.descripcion || null,
        estado: values.estado,
        orden_visual: Number(values.orden_visual || 0)
      };
      if (editing) return updateCategory(editing.id_categoria, payload);
      return createCategory(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toastSuccess(editing ? 'Categoría actualizada' : 'Categoría creada');
      setOpenForm(false);
      setEditing(null);
      reset({ nombre: '', descripcion: '', estado: true, orden_visual: 0 });
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toastSuccess('Categoría desactivada');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const rows = useMemo(() => query.data?.data || [], [query.data]);

  const openCreate = () => {
    setEditing(null);
    reset({ nombre: '', descripcion: '', estado: true, orden_visual: 0 });
    setOpenForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      nombre: item.nombre,
      descripcion: item.descripcion || '',
      estado: Boolean(item.estado),
      orden_visual: item.orden_visual || 0
    });
    setOpenForm(true);
  };

  const onDelete = async (item) => {
    const ok = await confirmAction({
      title: `¿Desactivar ${item.nombre}?`,
      text: 'Se realizará borrado lógico (activo = false).',
      confirmText: 'Desactivar'
    });
    if (ok) deleteMutation.mutate(item.id_categoria);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Categorías' }]} />
      <PageHeader
        title="Categorías"
        description="Clasificación de productos del catálogo"
        actions={<Button onClick={openCreate}>Nueva categoría</Button>}
      />

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <FormField label="Buscar" name="busqueda">
          <input
            id="busqueda"
            className={inputClass}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre o descripción"
          />
        </FormField>
      </div>

      {openForm ? (
        <form
          onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
          className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2"
        >
          <FormField label="Nombre" name="nombre" error={errors.nombre?.message}>
            <input id="nombre" className={inputClass} {...register('nombre')} />
          </FormField>
          <FormField label="Orden visual" name="orden_visual">
            <input
              id="orden_visual"
              type="number"
              className={inputClass}
              {...register('orden_visual')}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Descripción" name="descripcion" error={errors.descripcion?.message}>
              <textarea
                id="descripcion"
                rows={3}
                className={inputClass}
                {...register('descripcion')}
              />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" {...register('estado')} />
            Activa
          </label>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpenForm(false);
                setEditing(null);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting || saveMutation.isPending}>
              {editing ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </div>
        </form>
      ) : null}

      {query.isLoading ? (
        <Spinner />
      ) : query.isError ? (
        <ErrorState
          message={getApiErrorMessage(query.error)}
          onRetry={() => query.refetch()}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="Sin categorías"
          description="Crea la primera categoría para organizar tus productos."
          action={<Button onClick={openCreate}>Nueva categoría</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id_categoria} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{item.nombre}</p>
                    <p className="text-xs text-slate-500">{item.descripcion || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.slug}</td>
                  <td className="px-4 py-3">
                    <Badge tone={item.activo && item.estado ? 'green' : 'red'}>
                      {item.activo && item.estado ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => openEdit(item)}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(item)}>
                        Desactivar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
