export default function ProductImage({
  src,
  alt = 'Producto',
  className = 'h-12 w-12 rounded-lg object-cover'
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-xs text-slate-400 ${className}`}
        aria-label="Sin imagen"
      >
        N/A
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.insertAdjacentHTML(
          'afterend',
          '<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">N/A</div>'
        );
      }}
    />
  );
}
