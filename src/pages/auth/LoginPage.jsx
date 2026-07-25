import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema } from '../../schemas/authSchema';
import { useAuth } from '../../hooks/useAuth';
import FormField, { inputClass } from '../../components/forms/FormField';
import Button from '../../components/common/Button';
import { homePathForUser } from '../../utils/permissions';

const LOGIN_FAIL_MSG = 'Credenciales incorrectas';

const EMPRESA_MESSAGES = {
  EMPRESA_PENDIENTE: 'Tu pago está siendo validado.',
  EMPRESA_SUSPENDIDA: 'Tu cuenta se encuentra suspendida.',
  EMPRESA_VENCIDA:
    'Tu suscripción venció. Realiza nuevamente el pago por SINPE al 8554-8880.'
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { nombre_usuario: '', password: '' }
  });

  const onSubmit = async (values) => {
    setApiError('');
    try {
      const user = await login(values);
      resetField('password');
      const home = homePathForUser(user);
      const redirectTo = location.state?.from?.pathname;
      const safeTarget =
        typeof redirectTo === 'string' &&
        ((user?.rol === 'SuperAdministrador' &&
          redirectTo.startsWith('/super-admin')) ||
          (user?.rol === 'Administrador' && redirectTo.startsWith('/admin')))
          ? redirectTo
          : home;
      navigate(safeTarget, { replace: true });
    } catch (error) {
      const code = error?.response?.data?.errorCode;
      const message = error?.response?.data?.message;
      if (code && EMPRESA_MESSAGES[code]) {
        setApiError(EMPRESA_MESSAGES[code]);
      } else if (code && code !== 'UNAUTHORIZED' && message) {
        setApiError(message);
      } else {
        setApiError(LOGIN_FAIL_MSG);
      }
      resetField('password');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        label="Usuario"
        name="nombre_usuario"
        error={errors.nombre_usuario?.message}
      >
        <input
          id="nombre_usuario"
          className={inputClass}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          {...register('nombre_usuario')}
        />
      </FormField>

      <FormField label="Contraseña" name="password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          className={inputClass}
          autoComplete="current-password"
          {...register('password')}
        />
      </FormField>

      {apiError ? (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
          {apiError}
        </div>
      ) : null}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-slate-500">
        ¿Nuevo negocio?{' '}
        <Link to="/suscribirse" className="font-medium text-navy-700 underline-offset-2 hover:underline">
          Solicitar suscripción
        </Link>
      </p>
    </form>
  );
}
