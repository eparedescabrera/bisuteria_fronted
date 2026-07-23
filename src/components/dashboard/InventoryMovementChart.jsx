import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Spinner from '../feedback/Spinner';

export default function InventoryMovementChart({ data = [], loading }) {
  if (loading) return <Spinner label="Cargando gráfico" />;
  if (!data.length) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No hay movimientos para el período seleccionado.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="entradas" name="Entradas" fill="#1f57c8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="salidas" name="Salidas" fill="#d97706" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InventoryMovementLineChart({ data = [], loading }) {
  if (loading) return <Spinner label="Cargando gráfico" />;
  if (!data.length) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No hay movimientos para el período seleccionado.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="entradas" stroke="#1f57c8" strokeWidth={2} />
          <Line type="monotone" dataKey="salidas" stroke="#d97706" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
