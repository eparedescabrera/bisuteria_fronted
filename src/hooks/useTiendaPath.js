import { useCallback } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { tiendaPath } from '../utils/tienda';

/** Helper de rutas relativas a la tienda actual (`/t/:slug/...`). */
export function useTiendaPath() {
  const { tiendaSlug } = useCatalog();

  return useCallback(
    (path = '/') => tiendaPath(tiendaSlug, path),
    [tiendaSlug]
  );
}
