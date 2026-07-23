import { Link } from 'react-router-dom';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const tones = {
  blue: 'border-navy-200 bg-navy-50 text-navy-900',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-950',
  red: 'border-rose-200 bg-rose-50 text-rose-900',
  slate: 'border-slate-200 bg-white text-slate-800'
};

export default function KpiCard({
  label,
  value,
  comparison,
  comparisonLabel,
  to,
  tone = 'slate',
  loading = false
}) {
  let Comp = 'div';
  const props = {};
  if (to) {
    Comp = Link;
    props.to = to;
  }

  let trendIcon = null;
  let trendClass = 'text-slate-500';
  if (typeof comparison === 'number') {
    if (comparison > 0) {
      trendIcon = <TrendingUp className="h-3.5 w-3.5" aria-hidden />;
      trendClass = 'text-emerald-700';
    } else if (comparison < 0) {
      trendIcon = <TrendingDown className="h-3.5 w-3.5" aria-hidden />;
      trendClass = 'text-rose-700';
    } else {
      trendIcon = <Minus className="h-3.5 w-3.5" aria-hidden />;
    }
  }

  return (
    <Comp
      {...props}
      className={`block rounded-xl border p-4 shadow-sm transition hover:shadow-md ${tones[tone] || tones.slate}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</p>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-black/10" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      )}
      {(comparison != null || comparisonLabel) && !loading && (
        <p className={`mt-2 flex items-center gap-1 text-xs ${trendClass}`}>
          {trendIcon}
          <span>
            {typeof comparison === 'number'
              ? `${comparison > 0 ? '+' : ''}${comparison}%`
              : null}{' '}
            {comparisonLabel || 'vs período anterior'}
          </span>
        </p>
      )}
    </Comp>
  );
}
