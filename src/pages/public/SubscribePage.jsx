import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPlanes, solicitarSuscripcion } from '../../api/suscripcionApi';
import FormField, { inputClass } from '../../components/forms/FormField';
import Button from '../../components/common/Button';
import { formatCRC } from '../../utils/currency';
import Seo from '../../components/public/Seo';

const schema = z.object({
  nombre_negocio: z.string().trim().min(2, 'Indique el nombre del negocio'),
  propietario: z.string().trim().min(2, 'Indique el propietario'),
  correo: z.string().trim().email('Correo inválido'),
  telefono: z.string().trim().min(8, 'Teléfono inválido'),
  password: z.string().min(10, 'Mínimo 10 caracteres'),
  plan: z.enum(['Mensual', 'Trimestral', 'Anual'], {
    required_error: 'Seleccione un plan'
  }),
  direccion: z.string().optional()
});

export default function SubscribePage() {
  const [planesInfo, setPlanesInfo] = useState(null);
  const [done, setDone] = useState(null);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre_negocio: '',
      propietario: '',
      correo: '',
      telefono: '',
      password: '',
      plan: 'Mensual',
      direccion: ''
    }
  });

  useEffect(() => {
    getPlanes()
      .then(setPlanesInfo)
      .catch(() =>
        setPlanesInfo({
          planes: [
            { plan: 'Mensual', monto: 15000, dias: 30, label: 'Mensual' },
            { plan: 'Trimestral', monto: 40000, dias: 90, label: 'Trimestral' },
            { plan: 'Anual', monto: 140000, dias: 365, label: 'Anual' }
          ],
          sinpe: '8554-8880'
        })
      );
  }, []);

  const onSubmit = async (values) => {
    setApiError('');
    try {
      const data = await solicitarSuscripcion(values);
      setDone(data);
    } catch (error) {
      setApiError(
        error?.response?.data?.message || 'No se pudo registrar la solicitud'
      );
    }
  };

  const sinpe = planesInfo?.sinpe || done?.sinpe || '8554-8880';

  return (
    <div className="min-h-svh bg-[#faf7f2] text-[#3d2c29]">
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      <Seo
        title="Suscribirse"
        description="Solicite su cuenta multiempresa con pago SINPE"
      />

      {!done ? (
        <>
          <h1 className="font-[family-name:Georgia,serif] text-3xl text-[#3d2c29]">
            Solicitar suscripción
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Complete el formulario. Activaremos su cuenta tras verificar el SINPE.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FormField
              label="Nombre del negocio"
              name="nombre_negocio"
              error={errors.nombre_negocio?.message}
            >
              <input className={inputClass} {...register('nombre_negocio')} />
            </FormField>
            <FormField
              label="Nombre del propietario"
              name="propietario"
              error={errors.propietario?.message}
            >
              <input className={inputClass} {...register('propietario')} />
            </FormField>
            <FormField label="Correo" name="correo" error={errors.correo?.message}>
              <input
                type="email"
                className={inputClass}
                autoComplete="email"
                {...register('correo')}
              />
            </FormField>
            <FormField
              label="Teléfono"
              name="telefono"
              error={errors.telefono?.message}
            >
              <input className={inputClass} {...register('telefono')} />
            </FormField>
            <FormField
              label="Contraseña"
              name="password"
              error={errors.password?.message}
            >
              <input
                type="password"
                className={inputClass}
                autoComplete="new-password"
                {...register('password')}
              />
            </FormField>
            <FormField label="Plan" name="plan" error={errors.plan?.message}>
              <select className={inputClass} {...register('plan')}>
                {(planesInfo?.planes || []).map((p) => (
                  <option key={p.plan || p.nombre} value={p.plan || p.nombre}>
                    {p.label || p.plan || p.nombre} — {formatCRC(p.monto)} /{' '}
                    {p.dias} días
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Dirección (opcional)" name="direccion">
              <input className={inputClass} {...register('direccion')} />
            </FormField>

            {apiError ? (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {apiError}
              </div>
            ) : null}

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Solicitar suscripción
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            ¿Ya tiene cuenta?{' '}
            <Link to="/login" className="font-medium text-[#3d2c29] underline">
              Iniciar sesión
            </Link>
          </p>
        </>
      ) : (
        <div className="space-y-6 text-center">
          <h1 className="font-[family-name:Georgia,serif] text-3xl text-[#3d2c29]">
            Gracias por registrarte
          </h1>
          <p className="text-stone-700">
            Para activar tu cuenta realiza un SINPE al número:
          </p>
          <p className="text-2xl font-semibold tracking-wide text-[#3d2c29]">
            {sinpe}
          </p>
          {done.monto ? (
            <p className="text-sm text-stone-600">
              Monto del plan {done.plan}: {formatCRC(done.monto)}
            </p>
          ) : null}
          <p className="text-stone-700">
            Cuando verifiquemos el pago, activaremos tu cuenta. Luego podrás
            iniciar sesión.
          </p>
          <p className="text-xs text-stone-500">
            Usuario admin: <strong>{done.nombre_usuario}</strong>
          </p>
          {done.slug ? (
            <p className="text-sm text-stone-600">
              Tu tienda pública será:{' '}
              <strong>
                {window.location.origin}/t/{done.slug}
              </strong>
            </p>
          ) : null}
          <Link
            to="/login"
            className="inline-block text-sm font-medium text-[#3d2c29] underline"
          >
            Ir al login
          </Link>
        </div>
      )}
    </div>
    </div>
  );
}
