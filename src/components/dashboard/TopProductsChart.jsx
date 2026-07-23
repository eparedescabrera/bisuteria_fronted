import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Spinner from '../feedback/Spinner';

export default function TopProductsChart({ data = [], loading }) {
  if (loading) return <Spinner />;
  if (!data.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No hay salidas en el período seleccionado.
      </p>
    );
  }

  const chartData = data.map((p) => ({
    ...p,
    label: p.codigo || p.nombre
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="label" width={90} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value) => [value, 'Salidas']}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.nombre || ''}
          />
          <Bar
            dataKey="unidades_salida"
            name="Unidades de salida"
            fill="#0f766e"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
