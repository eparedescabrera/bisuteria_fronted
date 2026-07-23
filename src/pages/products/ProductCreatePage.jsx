import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listCategories } from '../../api/categoriesApi';
import { createProduct } from '../../api/productsApi';
import { productCreateSchema } from '../../schemas/productSchema';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import FormField, { inputClass } from '../../components/forms/FormField';
import Spinner from '../../components/feedback/Spinner';
import { toastError, toastSuccess } from '../../components/feedback/alerts';
import { getApiErrorMessage } from '../../utils/formatters';
import { PUBLICACIONES, UNIDADES } from '../../utils/constants';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);

  const categoriasQuery = useQuery({
    queryKey: ['categorias', 'select'],
    queryFn: () => listCategories({ limite: 100, pagina: 1, activo: true })
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      codigo: '',
      nombre: '',
      id_categoria: '',
      descripcion_corta: '',
      descripcion_completa: '',
      precio_venta: 0,
      precio_anterior: '',
      stock_inicial: 0,
      stock_minimo: 0,
      unidad_medida: 'Unidad',
      marca: '',
      color_estilo: '',
      material: '',
      estado_publicacion: 'Publicado',
      destacado: false
    }
  });

  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = {
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
      };
      return createProduct(payload, files.slice(0, 6));
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['productos'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toastSuccess('Producto creado');
      navigate(`/admin/productos/${response.data.id_producto}`);
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const previews = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file)
      })),
    [files]
  );

  if (categoriasQuery.isLoading) return <Spinner />;

  const categorias = (categoriasQuery.data?.data || []).filter(
    (c) => c.activo && c.estado
  );

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin' },
          { label: 'Productos', to: '/admin/productos' },
          { label: 'Nuevo' }
        ]}
      />
      <PageHeader
        title="Nuevo producto"
        description="Crea el producto y registra stock inicial en una sola operación"
      />

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2"
      >
        <FormField label="Código" name="codigo" error={errors.codigo?.message}>
          <input id="codigo" className={inputClass} {...register('codigo')} />
        </FormField>
        <FormField label="Nombre" name="nombre" error={errors.nombre?.message}>
          <input id="nombre" className={inputClass} {...register('nombre')} />
        </FormField>
        <FormField
          label="Categoría"
          name="id_categoria"
          error={errors.id_categoria?.message}
        >
          <select id="id_categoria" className={inputClass} {...register('id_categoria')}>
            <option value="">Seleccione</option>
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
        <FormField
          label="Precio de venta"
          name="precio_venta"
          error={errors.precio_venta?.message}
        >
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
        <FormField
          label="Stock inicial"
          name="stock_inicial"
          error={errors.stock_inicial?.message}
          hint="Solo en creación; luego use Inventario"
        >
          <input
            id="stock_inicial"
            type="number"
            className={inputClass}
            {...register('stock_inicial')}
          />
        </FormField>
        <FormField
          label="Stock mínimo"
          name="stock_minimo"
          error={errors.stock_minimo?.message}
        >
          <input
            id="stock_minimo"
            type="number"
            className={inputClass}
            {...register('stock_minimo')}
          />
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
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register('destacado')} />
          Destacado
        </label>
        <div className="md:col-span-2">
          <FormField
            label="Imágenes (máx. 6)"
            name="imagenes"
            hint="JPG, PNG o WEBP · máx. 5 MB c/u · Doc 3"
          >
            <input
              id="imagenes"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className={inputClass}
              onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 6))}
            />
          </FormField>
          {previews.length ? (
            <div className="mt-3 flex flex-wrap gap-3">
              {previews.map((p) => (
                <img
                  key={p.name}
                  src={p.url}
                  alt={p.name}
                  className="h-20 w-20 rounded-lg object-cover ring-1 ring-slate-200"
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex justify-end gap-2 md:col-span-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting || mutation.isPending}>
            Guardar producto
          </Button>
        </div>
      </form>
    </div>
  );
}
