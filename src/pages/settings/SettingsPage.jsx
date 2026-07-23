import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getSettings,
  updateSettings,
  uploadLogo,
  uploadPortada
} from '../../api/settingsApi';
import { settingsSchema } from '../../schemas/settingsSchema';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import FormField, { inputClass } from '../../components/forms/FormField';
import Spinner from '../../components/feedback/Spinner';
import ErrorState from '../../components/feedback/ErrorState';
import { toastError, toastSuccess } from '../../components/feedback/alerts';
import { getApiErrorMessage } from '../../utils/formatters';
import { WHATSAPP_COUNTRY_CODE } from '../../utils/constants';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState(null);
  const [portadaFile, setPortadaFile] = useState(null);

  const query = useQuery({
    queryKey: ['configuracion'],
    queryFn: getSettings
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(settingsSchema)
  });

  useEffect(() => {
    if (query.data?.data) {
      const c = query.data.data;
      reset({
        nombre_negocio: c.nombre_negocio || '',
        descripcion: c.descripcion || '',
        telefono: c.telefono || '',
        whatsapp: c.whatsapp || '',
        correo: c.correo || '',
        direccion: c.direccion || '',
        facebook: c.facebook || '',
        instagram: c.instagram || '',
        moneda: c.moneda || 'CRC',
        mostrar_stock_publico: Boolean(c.mostrar_stock_publico),
        mensaje_bienvenida: c.mensaje_bienvenida || '',
        mensaje_inferior: c.mensaje_inferior || ''
      });
    }
  }, [query.data, reset]);

  const saveMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['configuracion'] });
      toastSuccess('Configuración guardada');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const logoMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: async () => {
      setLogoFile(null);
      await queryClient.invalidateQueries({ queryKey: ['configuracion'] });
      toastSuccess('Logo actualizado');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const portadaMutation = useMutation({
    mutationFn: uploadPortada,
    onSuccess: async () => {
      setPortadaFile(null);
      await queryClient.invalidateQueries({ queryKey: ['configuracion'] });
      toastSuccess('Portada actualizada');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const values = watch();
  const previewMessage = useMemo(() => {
    const productName = 'Pulsera de hilo rojo';
    const base =
      values.mensaje_bienvenida ||
      `Hola, deseo consultar por ${productName}`;
    return base.replace('{producto}', productName);
  }, [values.mensaje_bienvenida]);

  if (query.isLoading) return <Spinner />;
  if (query.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(query.error)}
        onRetry={() => query.refetch()}
      />
    );
  }

  const config = query.data.data;

  return (
    <div>
      <Breadcrumb
        items={[{ label: 'Admin', to: '/admin' }, { label: 'Configuración' }]}
      />
      <PageHeader
        title="Configuración del negocio"
        description="Datos públicos, WhatsApp y apariencia del catálogo"
      />

      <form
        onSubmit={handleSubmit((formValues) => saveMutation.mutate(formValues))}
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2"
      >
        <FormField
          label="Nombre del negocio"
          name="nombre_negocio"
          error={errors.nombre_negocio?.message}
        >
          <input
            id="nombre_negocio"
            className={inputClass}
            {...register('nombre_negocio')}
          />
        </FormField>
        <FormField label="Moneda" name="moneda">
          <input id="moneda" className={inputClass} {...register('moneda')} />
        </FormField>
        <FormField label="Teléfono" name="telefono">
          <input id="telefono" className={inputClass} {...register('telefono')} />
        </FormField>
        <FormField
          label="WhatsApp"
          name="whatsapp"
          hint={`Solo dígitos. Código país sugerido: ${WHATSAPP_COUNTRY_CODE}`}
          error={errors.whatsapp?.message}
        >
          <input id="whatsapp" className={inputClass} {...register('whatsapp')} />
        </FormField>
        <FormField label="Correo" name="correo">
          <input id="correo" className={inputClass} {...register('correo')} />
        </FormField>
        <FormField label="Dirección / ubicación" name="direccion">
          <input id="direccion" className={inputClass} {...register('direccion')} />
        </FormField>
        <FormField label="Facebook" name="facebook">
          <input id="facebook" className={inputClass} {...register('facebook')} />
        </FormField>
        <FormField label="Instagram" name="instagram">
          <input id="instagram" className={inputClass} {...register('instagram')} />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Descripción" name="descripcion">
            <textarea
              id="descripcion"
              rows={3}
              className={inputClass}
              {...register('descripcion')}
            />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Mensaje de bienvenida" name="mensaje_bienvenida">
            <textarea
              id="mensaje_bienvenida"
              rows={2}
              className={inputClass}
              {...register('mensaje_bienvenida')}
            />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Mensaje inferior" name="mensaje_inferior">
            <textarea
              id="mensaje_inferior"
              rows={2}
              className={inputClass}
              {...register('mensaje_inferior')}
            />
          </FormField>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register('mostrar_stock_publico')} />
          Mostrar stock en catálogo público
        </label>
        <div className="flex justify-end md:col-span-2">
          <Button type="submit" loading={isSubmitting || saveMutation.isPending}>
            Guardar configuración
          </Button>
        </div>
      </form>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Logo y portada</h3>
          {config.logo_url ? (
            <img
              src={config.logo_url}
              alt="Logo"
              className="mb-3 h-20 w-20 rounded-lg object-cover"
            />
          ) : null}
          <FormField label="Nuevo logo" name="logo">
            <input
              id="logo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={inputClass}
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </FormField>
          <Button
            className="mt-3"
            disabled={!logoFile}
            loading={logoMutation.isPending}
            onClick={() => logoMutation.mutate(logoFile)}
          >
            Subir logo
          </Button>

          {config.portada_url ? (
            <img
              src={config.portada_url}
              alt="Portada"
              className="mt-4 h-28 w-full rounded-lg object-cover"
            />
          ) : null}
          <FormField label="Nueva portada" name="portada">
            <input
              id="portada"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={inputClass}
              onChange={(e) => setPortadaFile(e.target.files?.[0] || null)}
            />
          </FormField>
          <Button
            className="mt-3"
            disabled={!portadaFile}
            loading={portadaMutation.isPending}
            onClick={() => portadaMutation.mutate(portadaFile)}
          >
            Subir portada
          </Button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">Vista previa WhatsApp</h3>
          <p className="text-sm text-slate-500">
            Número: <strong>{values.whatsapp || '—'}</strong>
          </p>
          <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
            {previewMessage}
          </div>
        </section>
      </div>
    </div>
  );
}
