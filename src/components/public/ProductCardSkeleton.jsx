export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
      <div className="aspect-[4/5] bg-stone-200" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-stone-200" />
        <div className="h-4 w-3/4 rounded bg-stone-200" />
        <div className="h-4 w-1/2 rounded bg-stone-200" />
      </div>
    </div>
  );
}
