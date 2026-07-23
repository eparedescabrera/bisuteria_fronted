import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema } from '../../schemas/authSchema';
import { useAuth } from '../../hooks/useAuth';
import FormField, { inputClass } from '../../components/forms/FormField';
import Button from '../../components/common/Button';
import { getApiErrorMessage } from '../../utils/formatters';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { nombre_usuario: '', password: '' }
  });

  const onSubmit = async (values) => {
    setApiError('');
    try {
      await login(values);
      const redirectTo = location.state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Credenciales incorrectas'));
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
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{apiError}</div>
      ) : null}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Iniciar sesión
      </Button>
    </form>
  );
}
