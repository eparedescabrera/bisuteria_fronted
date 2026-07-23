import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">403</p>
      <h1 className="text-3xl font-semibold text-slate-900">Sin autorización</h1>
      <p className="max-w-md text-slate-600">
        Tu cuenta no tiene permisos de administrador para esta sección.
      </p>
      <Link to="/login">
        <Button>Volver al login</Button>
      </Link>
    </div>
  );
}
