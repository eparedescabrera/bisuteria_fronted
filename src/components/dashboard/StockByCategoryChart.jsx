import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Spinner from '../feedback/Spinner';

const COLORS = ['#1f57c8', '#0f766e', '#d97706', '#be123c', '#7c3aed', '#475569'];

export function StockByCategoryChart({ data = [], loading }) {
  if (loading) return <Spinner />;
  if (!data.length) {
    return <p className="py-8 text-center text-sm text-slate-500">Sin datos de categorías.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="categoria"
            width={100}
            tick={{ fontSize: 11 }}
          />
          <Tooltip />
          <Bar dataKey="unidades" name="Unidades" fill="#1f57c8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InventoryDistributionChart({ data = [], loading }) {
  if (loading) return <Spinner />;
  const filtered = data.filter((d) => Number(d.unidades) > 0);
  if (!filtered.length) {
    return <p className="py-8 text-center text-sm text-slate-500">Sin unidades en inventario.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filtered}
            dataKey="unidades"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {filtered.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MovementsByTypeChart({ data = [], loading }) {
  if (loading) return <Spinner />;
  if (!data.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No hay movimientos para el período seleccionado.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="unidades"
            nameKey="tipo_movimiento"
            cx="50%"
            cy="50%"
            outerRadius={90}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
