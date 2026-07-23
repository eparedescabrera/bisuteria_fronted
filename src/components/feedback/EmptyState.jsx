export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <h3 className="text-lg font-medium text-slate-800">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
