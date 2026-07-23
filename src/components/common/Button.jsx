const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary: 'bg-navy-600 text-white hover:bg-navy-700 focus-visible:outline-navy-600',
  secondary:
    'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400'
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  ...props
}) {
  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Procesando…' : children}
    </button>
  );
}
