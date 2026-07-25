import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../../api/superAdminApi';
import { formatCRC } from '../../utils/currency';
import Spinner from '../../components/feedback/Spinner';
import ErrorState from '../../components/feedback/ErrorState';

function Card({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}

export default function SuperDashboardPage() {
  const q = useQuery({
    queryKey: ['super-admin', 'dashboard'],
    queryFn: getDashboard
  });

  if (q.isLoading) return <Spinner label="Cargando dashboard" />;
  if (q.isError) {
    return (
      <ErrorState message={q.error?.response?.data?.message || 'No se pudo cargar'} />
    );
  }

  const d = q.data;
  const e = d.empresas || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-stone-500">Resumen de la plataforma multiempresa</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Empresas" value={e.total ?? 0} />
        <Card label="Activas" value={e.activas ?? 0} />
        <Card label="Pendientes" value={e.pendientes ?? 0} />
        <Card label="Vencidas" value={e.vencidas ?? 0} />
        <Card label="Suspendidas" value={e.suspendidas ?? 0} />
        <Card
          label="Ingresos mensuales"
          value={formatCRC(d.ingresos_mensuales)}
        />
        <Card
          label="Ingresos anuales"
          value={formatCRC(d.ingresos_anuales)}
        />
      </div>
    </div>
  );
}
