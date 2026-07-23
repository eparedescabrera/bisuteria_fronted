import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-navy-600">404</p>
      <h1 className="text-3xl font-semibold text-slate-900">Página no encontrada</h1>
      <p className="max-w-md text-slate-600">
        La ruta solicitada no existe o fue movida.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/">
          <Button variant="secondary">Ir al inicio</Button>
        </Link>
        <Link to="/admin">
          <Button>Ir al panel</Button>
        </Link>
      </div>
    </div>
  );
}
