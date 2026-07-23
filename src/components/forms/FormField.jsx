export default function TextField({
  label,
  name,
  error,
  children,
  hint
}) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 disabled:bg-slate-100';
