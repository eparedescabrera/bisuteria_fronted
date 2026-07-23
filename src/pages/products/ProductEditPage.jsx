import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listCategories } from '../../api/categoriesApi';
import {
  addProductImages,
  deleteProductImage,
  getProduct,
  setPrincipalImage,
  updateProduct
} from '../../api/productsApi';
import { productUpdateSchema } from '../../schemas/productSchema';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import FormField, { inputClass } from '../../components/forms/FormField';
import Spinner from '../../components/feedback/Spinner';
import ErrorState from '../../components/feedback/ErrorState';
import {
  confirmAction,
  toastError,
  toastSuccess
} from '../../components/feedback/alerts';
import { getApiErrorMessage } from '../../utils/formatters';
import {
  DISPONIBILIDADES,
  PUBLICACIONES,
  UNIDADES
} from '../../utils/constants';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newFiles, setNewFiles] = useState([]);

  const productQuery = useQuery({
    queryKey: ['producto', id],
    queryFn: () => getProduct(id)
  });

  const categoriasQuery = useQuery({
    queryKey: ['categorias', 'select'],
    queryFn: () => listCategories({ limite: 100, pagina: 1 })
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productUpdateSchema)
  });

  useEffect(() => {
    if (productQuery.data?.data) {
      const p = productQuery.data.data;
      reset({
        codigo: p.codigo,
        nombre: p.nombre,
        id_categoria: p.categoria?.id_categoria,
        descripcion_corta: p.descripcion_corta || '',
        descripcion_completa: p.descripcion_completa || '',
        precio_venta: p.precio_venta,
        precio_anterior: p.precio_anterior ?? '',
        stock_minimo: p.stock_minimo,
        unidad_medida: p.unidad_medida,
        marca: p.marca || '',
        color_estilo: p.color_estilo || '',
        material: p.material || '',
        estado_publicacion: p.estado_publicacion,
        estado_disponibilidad: p.estado_disponibilidad,
        destacado: Boolean(p.destacado)
      });
    }
  }, [productQuery.data, reset]);

  const saveMutation = useMutation({
    mutationFn: (values) =>
      updateProduct(id, {
        ...values,
        precio_anterior:
          values.precio_anterior === '' || values.precio_anterior == null
            ? null
            : Number(values.precio_anterior),
        descripcion_corta: values.descripcion_corta || null,
        descripcion_completa: values.descripcion_completa || null,
        marca: values.marca || null,
        color_estilo: values.color_estilo || null,
        material: values.material || null
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['producto', id] });
      await queryClient.invalidateQueries({ queryKey: ['productos'] });
      toastSuccess('Producto actualizado');
      navigate(`/admin/productos/${id}`);
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const imageMutation = useMutation({
    mutationFn: () => addProductImages(id, newFiles),
    onSuccess: async () => {
      setNewFiles([]);
      await queryClient.invalidateQueries({ queryKey: ['producto', id] });
      toastSuccess('Imágenes agregadas');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const deleteImageMutation = useMutation({
    mutationFn: (idImagen) => deleteProductImage(id, idImagen),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['producto', id] });
      toastSuccess('Imagen eliminada');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const principalMutation = useMutation({
    mutationFn: (idImagen) => setPrincipalImage(id, idImagen),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['producto', id] });
      toastSuccess('Imagen principal actualizada');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  if (productQuery.isLoading || categoriasQuery.isLoading) return <Spinner />;
  if (productQuery.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(productQuery.error)}
        onRetry={() => productQuery.refetch()}
      />
    );
  }

  const product = productQuery.data.data;
  const categorias = categoriasQuery.data?.data || [];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin' },
          { label: 'Productos', to: '/admin/productos' },
          { label: product.nombre, to: `/admin/productos/${id}` },
          { label: 'Editar' }
        ]}
      />
      <PageHeader
        title={`Editar: ${product.nombre}`}
        description="El stock solo se modifica desde Inventario"
        actions={
          <Link to={`/admin/inventario?producto=${id}`}>
            <Button variant="secondary">Registrar movimiento</Button>
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2"
      >
        <FormField label="Código" name="codigo" error={errors.codigo?.message}>
          <input id="codigo" className={inputClass} {...register('codigo')} />
        </FormField>
        <FormField label="Nombre" name="nombre" error={errors.nombre?.message}>
          <input id="nombre" className={inputClass} {...register('nombre')} />
        </FormField>
        <FormField label="Categoría" name="id_categoria" error={errors.id_categoria?.message}>
          <select id="id_categoria" className={inputClass} {...register('id_categoria')}>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Unidad" name="unidad_medida">
          <select id="unidad_medida" className={inputClass} {...register('unidad_medida')}>
            {UNIDADES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Precio de venta" name="precio_venta" error={errors.precio_venta?.message}>
          <input
            id="precio_venta"
            type="number"
            step="0.01"
            className={inputClass}
            {...register('precio_venta')}
          />
        </FormField>
        <FormField label="Precio anterior" name="precio_anterior">
          <input
            id="precio_anterior"
            type="number"
            step="0.01"
            className={inputClass}
            {...register('precio_anterior')}
          />
        </FormField>
        <FormField label="Stock mínimo" name="stock_minimo">
          <input
            id="stock_minimo"
            type="number"
            className={inputClass}
            {...register('stock_minimo')}
          />
        </FormField>
        <FormField label="Stock actual" name="stock_actual" hint="Solo lectura">
          <input
            id="stock_actual"
            className={inputClass}
            value={product.stock_actual}
            disabled
            readOnly
          />
        </FormField>
        <FormField label="Publicación" name="estado_publicacion">
          <select
            id="estado_publicacion"
            className={inputClass}
            {...register('estado_publicacion')}
          >
            {PUBLICACIONES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Disponibilidad" name="estado_disponibilidad">
          <select
            id="estado_disponibilidad"
            className={inputClass}
            {...register('estado_disponibilidad')}
          >
            {DISPONIBILIDADES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Marca" name="marca">
          <input id="marca" className={inputClass} {...register('marca')} />
        </FormField>
        <FormField label="Color / estilo" name="color_estilo">
          <input id="color_estilo" className={inputClass} {...register('color_estilo')} />
        </FormField>
        <FormField label="Material" name="material">
          <input id="material" className={inputClass} {...register('material')} />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register('destacado')} />
          Destacado
        </label>
        <div className="md:col-span-2">
          <FormField label="Descripción corta" name="descripcion_corta">
            <textarea
              id="descripcion_corta"
              rows={2}
              className={inputClass}
              {...register('descripcion_corta')}
            />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Descripción completa" name="descripcion_completa">
            <textarea
              id="descripcion_completa"
              rows={4}
              className={inputClass}
              {...register('descripcion_completa')}
            />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 md:col-span-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting || saveMutation.isPending}>
            Guardar cambios
          </Button>
        </div>
      </form>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Imágenes</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(product.imagenes || []).map((img) => (
            <div
              key={img.id_imagen}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <img
                src={img.imagen_url}
                alt={img.texto_alternativo || product.nombre}
                className="h-40 w-full object-cover"
              />
              <div className="flex flex-wrap gap-2 p-3">
                {img.es_principal ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                    Principal
                  </span>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => principalMutation.mutate(img.id_imagen)}
                  >
                    Hacer principal
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={async () => {
                    const ok = await confirmAction({
                      title: '¿Eliminar imagen?',
                      confirmText: 'Eliminar'
                    });
                    if (ok) deleteImageMutation.mutate(img.id_imagen);
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <FormField label="Agregar imágenes" name="nuevas">
            <input
              id="nuevas"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className={inputClass}
              onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
            />
          </FormField>
          <Button
            onClick={() => imageMutation.mutate()}
            loading={imageMutation.isPending}
            disabled={!newFiles.length}
          >
            Subir
          </Button>
        </div>
      </section>
    </div>
  );
}
